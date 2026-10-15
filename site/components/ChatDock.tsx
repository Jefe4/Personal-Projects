"use client";

import { useEffect, useRef, useState } from "react";
import { guardRecruiterAnswer } from "@/lib/answer-guard";
import { retrieveFacts, systemPrompt, type ChatTurn } from "@/lib/retrieve";
import { WEBLLM_LABEL, WEBLLM_MODEL } from "@/lib/webllm";

const CHIPS = ["Fit for this role", "Projects", "Skills", "Experience", "Education", "Gym scan"];

type Msg = { role: "user" | "assistant"; content: string };
type EngineMode = "rule" | "loading" | "ready" | "failed";

type ProgressReport = { progress?: number; text?: string };
type WebEngine = {
  chat: {
    completions: {
      create: (body: {
        messages: { role: string; content: string }[];
        temperature?: number;
        max_tokens?: number;
      }) => Promise<{ choices?: { message?: { content?: string | null } }[] }>;
    };
  };
};

type GpuNavigator = Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } };

async function webGpuAvailable() {
  if (typeof navigator === "undefined") return false;
  const gpu = (navigator as GpuNavigator).gpu;
  if (!gpu) return false;
  try {
    const adapter = await gpu.requestAdapter();
    return Boolean(adapter);
  } catch {
    return false;
  }
}

export function ChatDock() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [webgpu, setWebgpu] = useState<boolean | null>(null);
  const [mode, setMode] = useState<EngineMode>("rule");
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I'm Jeffrey. Ask about the datacenter assignment, Frostburg CS (expected 2027), gym systems work, or the code. I only answer from the resume file. I won't invent employers or a degree I don't have yet.",
    },
  ]);
  const log = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WebEngine | null>(null);

  useEffect(() => {
    let cancelled = false;
    webGpuAvailable().then((ok) => {
      if (!cancelled) setWebgpu(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    log.current?.scrollTo(0, log.current.scrollHeight);
  }, [messages, open, progressText]);

  async function optIn() {
    if (mode === "loading" || mode === "ready") return;
    setMode("loading");
    setProgress(0);
    setProgressText("Starting the on-device model…");
    try {
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
      const engine = await CreateMLCEngine(WEBLLM_MODEL, {
        initProgressCallback: (report: ProgressReport) => {
          setProgress(typeof report.progress === "number" ? report.progress : 0);
          setProgressText(report.text || "Loading…");
        },
      });
      engineRef.current = engine as WebEngine;
      setMode("ready");
      setProgress(1);
      setProgressText(`${WEBLLM_LABEL} is ready. Answers stay limited to the resume facts.`);
    } catch (error) {
      engineRef.current = null;
      setMode("failed");
      setProgressText(error instanceof Error ? error.message : "The on-device model did not load.");
    }
  }

  async function ruleReply(history: ChatTurn[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    return (data.reply as string) || "That is not covered in the resume materials.";
  }

  async function send(q: string) {
    const query = q.trim();
    if (!query || busy) return;
    const next = [...messages, { role: "user" as const, content: query }];
    setMessages(next);
    setText("");
    setBusy(true);
    try {
      let raw = "";
      let note = "";
      if (mode === "ready" && engineRef.current) {
        try {
          const facts = retrieveFacts(query);
          const completion = await engineRef.current.chat.completions.create({
            messages: [
              { role: "system", content: systemPrompt(facts) },
              { role: "user", content: query },
            ],
            temperature: 0.1,
            max_tokens: 280,
          });
          raw = completion.choices?.[0]?.message?.content?.trim() || "That is not covered in the resume materials.";
        } catch {
          raw = await ruleReply(next);
          note = "The on-device model failed this turn, so this answer is from the resume file.";
        }
      } else {
        raw = await ruleReply(next);
      }
      const guarded = guardRecruiterAnswer(raw);
      const content = note ? `${note}\n\n${guarded.text}` : guarded.text;
      setMessages([...next, { role: "assistant", content }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Chat failed locally. The resume file is still on /resume." }]);
    }
    setBusy(false);
  }

  const status =
    webgpu === null
      ? "Checking this browser for WebGPU…"
      : webgpu === false
        ? "WebGPU isn't available in this browser, so this chat uses the resume file instead of an on-device model."
        : mode === "ready"
          ? `On-device model: ${WEBLLM_LABEL}. It only sees the resume facts in its prompt.`
          : mode === "loading"
            ? "Loading the on-device model. Nothing is sent to a chat server for this model."
            : mode === "failed"
              ? "The on-device model did not load. Answers are coming from the resume file."
              : "An on-device model is available. It stays unloaded until you opt in. Until then, answers come from the resume file.";

  if (!open) {
    return (
      <button className="chat-launcher" type="button" onClick={() => setOpen(true)}>
        Ask about Jeffrey
      </button>
    );
  }

  return (
    <aside className="chat-dock" aria-label="Ask about Jeffrey">
      <header>
        <span>Ask about Jeffrey</span>
        <button type="button" onClick={() => setOpen(false)} aria-label="Minimize chat" style={{ background: "none", border: 0, color: "inherit", cursor: "pointer" }}>
          ▴
        </button>
      </header>
      <p className="chat-status">{status}</p>
      {webgpu && mode !== "ready" ? (
        <div className="chat-model">
          <button type="button" onClick={optIn} disabled={mode === "loading"}>
            {mode === "loading" ? "Loading model…" : `Load ${WEBLLM_LABEL}`}
          </button>
          {mode === "loading" || mode === "failed" ? (
            <>
              <div
                className="chat-progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                aria-label="Model download"
              >
                <span style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
              <p className="chat-status">{progressText}</p>
            </>
          ) : null}
        </div>
      ) : null}
      <div className="chips" style={{ padding: "0.45rem 0.7rem 0" }}>
        {CHIPS.map((c) => (
          <button key={c} type="button" onClick={() => send(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="chat-log" ref={log}>
        {messages.map((m, i) => (
          <div key={i} className={"bubble " + m.role}>
            {m.content}
          </div>
        ))}
      </div>
      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a job note or ask a question"
          aria-label="Message"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(text);
            }
          }}
        />
        <button type="submit" disabled={busy}>
          Send
        </button>
      </form>
    </aside>
  );
}
