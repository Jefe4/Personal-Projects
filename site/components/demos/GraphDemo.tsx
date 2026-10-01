"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { adjacencyMatrix, cheapestPath, friendBot, roomPoint, ROOM_COUNT } from "@/lib/interactive";

export function GraphDemo() {
  const reduce = useReducedMotion();
  const matrix = useMemo(() => adjacencyMatrix(), []);
  const bot = useMemo(() => friendBot(0, 11), []);
  const cheap = useMemo(() => cheapestPath(0, 11), []);
  const [mode, setMode] = useState<"bot" | "cheap">("bot");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const walk = mode === "bot" ? bot.order : cheap.rooms;
  const steps = mode === "bot" ? bot.steps : cheap.steps;
  const max = Math.max(0, walk.length - 1);
  const fuel = steps.slice(0, step).reduce((sum, s) => sum + s.liters, 0);
  const seen = new Set(walk.slice(0, step + 1));
  const used = new Set(steps.slice(0, step).map((s) => `${s.from}-${s.to}`));
  const active = step > 0 ? steps[step - 1] : null;

  useEffect(() => {
    if (!playing || reduce) return;
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= max) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 650);
    return () => window.clearInterval(id);
  }, [playing, reduce, max]);

  function setModeAndReset(next: "bot" | "cheap") {
    setPlaying(false);
    setMode(next);
    setStep(0);
  }

  const edges: { i: number; j: number; w: number }[] = [];
  for (let i = 0; i < ROOM_COUNT; i++) {
    for (let j = 0; j < ROOM_COUNT; j++) {
      if (matrix[i][j]) edges.push({ i, j, w: matrix[i][j] });
    }
  }

  return (
    <div className="demo">
      <div className="demo-bar">
        <div className="ui-switch" role="group" aria-label="Search mode">
          <button type="button" aria-pressed={mode === "bot"} onClick={() => setModeAndReset("bot")}>
            FRIEND-BOT
          </button>
          <button type="button" aria-pressed={mode === "cheap"} onClick={() => setModeAndReset("cheap")}>
            Cheapest fuel
          </button>
        </div>
        <button type="button" onClick={() => setStep((s) => Math.min(max, s + 1))} disabled={step >= max}>
          Step
        </button>
        <button type="button" onClick={() => (reduce ? setStep(max) : setPlaying((p) => !p))}>
          {reduce ? "Show all" : playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
        >
          Reset
        </button>
        <p className="mono demo-readout">
          Room {walk[step] ?? 0} · {fuel} L{mode === "bot" ? ` / ${bot.fuel} L full search` : ` / ${cheap.fuel} L path`}
        </p>
      </div>
      <svg viewBox="0 0 560 420" role="img" aria-label="Twelve-room labyrinth with fuel weights">
        {edges.map((e) => {
          const a = roomPoint(e.i);
          const b = roomPoint(e.j);
          const key = `${e.i}-${e.j}`;
          const hot = active && active.from === e.i && active.to === e.j;
          const prior = used.has(key);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <g key={key}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={hot ? "var(--accent)" : prior ? "var(--ink)" : "var(--line)"}
                strokeWidth={hot ? 3 : 1.2}
              />
              <text x={mx} y={my} textAnchor="middle" fill="var(--muted)" fontSize="10">
                {e.w}
              </text>
            </g>
          );
        })}
        {Array.from({ length: ROOM_COUNT }, (_, i) => {
          const p = roomPoint(i);
          const on = seen.has(i);
          const current = walk[step] === i;
          return (
            <g key={i}>
              <circle r={current ? 16 : 13} cx={p.x} cy={p.y} fill={on ? "var(--accent)" : "var(--bg-elev)"} stroke="var(--ink)" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill={on ? "var(--bg)" : "var(--ink)"}>
                {i}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mono">
        Order: {walk.slice(0, step + 1).join(" → ")}
        {mode === "bot" && step >= max && bot.found ? " · target 11 found" : ""}
      </p>
    </div>
  );
}
