"use client";

import { useEffect, useMemo, useState } from "react";
import { buildGraph } from "@/lib/graph-data";

export function KnowledgeGraphView() {
  const data = useMemo(() => buildGraph(), []);
  const [hot, setHot] = useState<string[]>([]);
  useEffect(() => {
    const on = (e: Event) => {
      const ce = e as CustomEvent<string[]>;
      setHot(ce.detail || []);
    };
    window.addEventListener("jefe-highlight", on as EventListener);
    return () => window.removeEventListener("jefe-highlight", on as EventListener);
  }, []);

  const w = 720;
  const h = 420;
  const cx = w / 2;
  const cy = h / 2;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="420" role="img" aria-label="Knowledge graph of Jeffrey's verified facts">
      {data.edges.map((e, i) => {
        const a = data.nodes.find((n) => n.id === e.from);
        const b = data.nodes.find((n) => n.id === e.to);
        if (!a || !b) return null;
        return (
          <g key={i}>
            <line x1={cx + a.x} y1={cy + a.y} x2={cx + b.x} y2={cy + b.y} stroke="var(--line)" strokeWidth={1.4} />
            <title>{`${e.rel} ← ${e.source}`}</title>
          </g>
        );
      })}
      {data.nodes.map((n) => {
        const on = hot.includes(n.id);
        return (
          <g key={n.id} transform={`translate(${cx + n.x}, ${cy + n.y})`}>
            <circle r={on ? 16 : 11} fill={on ? "var(--accent)" : "var(--bg-elev)"} stroke="var(--accent)" />
            <text y={28} textAnchor="middle" fill="var(--ink)" fontSize={11} fontFamily="var(--sans)">
              {n.label}
            </text>
            <title>{`${n.type} · ${n.provenance || ""}`}</title>
          </g>
        );
      })}
    </svg>
  );
}
