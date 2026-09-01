"use client";

import { useEffect, useRef, useState } from "react";

const CHIPS = ["Fit for this role", "Projects", "Skills", "Experience", "Education", "Gym scan"];

type Msg = { role: "user" | "assistant"; content: string };

export function ChatDock() {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I'm Jeffrey. Ask about the datacenter assignment, Frostburg CS (expected 2027), gym systems work, the gym photogrammetry scan, or code in this repo. I won't invent employers or a degree I don't have yet.",
    },
  ]);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    log.current?.scrollTo(0, log.current.scrollHeight);
  }, [messages, open]);

  async function send(q: string) {
    const query = q.trim();
    if (!query || busy) return;
    const next = [...messages, { role: "user" as const, content: query }];
    setMessages(next);
    setText("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || "I don't have that in my materials." }]);
      if (data.highlights && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("jefe-highlight", { detail: data.highlights }));
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Chat endpoint failed locally. Try npm run dev in site/." }]);
    }
    setBusy(false);
  }

  if (!open) {
    return (
      <button className="cta" style={{ position: "fixed", right: "1rem", bottom: "1rem", zIndex: 30 }} onClick={() => setOpen(true)}>
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
