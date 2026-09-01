"use client";

import { useState } from "react";
import type { FitBucket } from "@/lib/jobfit";

export function JobFitPanel() {
  const [jd, setJd] = useState("");
  const [buckets, setBuckets] = useState<FitBucket[] | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [narrative, setNarrative] = useState("");

  async function run() {
    const res = await fetch("/api/fit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: jd }),
    });
    const data = await res.json();
    setBuckets(data.buckets || []);
    setNotes(data.notes || []);
    setNarrative(data.narrative || "");
  }

  return (
    <div className="fit-box">
      <label htmlFor="jd" className="mono">
        Paste a job description
      </label>
      <textarea id="jd" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Responsibilities, must-haves, stack…" />
      <p className="cta">
        <button type="button" onClick={run}>
          Map my evidence
        </button>
      </p>
      {buckets && (
        <div>
          {buckets.map((b, i) => (
            <p key={i}>
              <strong className={b.status === "must-evidence" ? "tag-must" : b.status === "stretch" ? "tag-stretch" : "tag-missing"}>
                {b.status}
              </strong>{" "}
              {b.item}
              <br />
              <span className="muted">{b.evidence.join(" · ")}</span>
            </p>
          ))}
          <p className="muted">{notes.join(" ")}</p>
          {narrative ? <pre>{narrative}</pre> : null}
        </div>
      )}
    </div>
  );
}
