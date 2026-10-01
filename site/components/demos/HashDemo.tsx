"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ProbeTable, SAMPLE_MOVIES, type ProbeTrace } from "@/lib/interactive";

export function HashDemo() {
  const reduce = useReducedMotion();
  const tableRef = useRef(new ProbeTable(11));
  const timer = useRef<number | null>(null);
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState("The Shining");
  const [cursor, setCursor] = useState(-1);
  const [trace, setTrace] = useState<number[]>([]);
  const [note, setNote] = useState("Empty 11-slot table. Insert a title from the movie CSV.");
  const table = tableRef.current;

  useEffect(() => {
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  function play(slot: ProbeTrace, done: string) {
    if (timer.current) window.clearInterval(timer.current);
    setTrace(slot.probes);
    setTick((n) => n + 1);
    if (reduce || slot.probes.length <= 1) {
      setCursor(slot.probes.length - 1);
      setNote(done);
      return;
    }
    let i = 0;
    setCursor(0);
    timer.current = window.setInterval(() => {
      i += 1;
      if (i >= slot.probes.length) {
        if (timer.current) window.clearInterval(timer.current);
        setNote(done);
        return;
      }
      setCursor(i);
    }, 260);
  }

  function insert(key: string, value: string) {
    const existed = table.table.some((c) => c && c !== "DEFUNCT" && c.key === key);
    const slot = table.put(key, value);
    play(
      slot,
      existed
        ? `Updated ${key}.`
        : `Inserted ${key} → ${value}. Home ${table.hash(key)}, probes ${slot.probes.length}.`,
    );
  }

  function find() {
    const key = query.trim();
    if (!key) return;
    const { value, trace: slot } = table.get(key);
    play(slot, value ? `Found ${key}: ${value}.` : `${key} is not in the table. Probe stopped at an empty slot or wrapped.`);
  }

  function remove() {
    const key = query.trim();
    if (!key) return;
    const slot = table.remove(key);
    play(slot, slot.found ? `Deleted ${key}. Slot is DEFUNCT so later probes can walk past it.` : `${key} was not stored.`);
  }

  return (
    <div className="demo">
      <div className="chips">
        {SAMPLE_MOVIES.map((m) => (
          <button key={m.key} type="button" onClick={() => insert(m.key, m.value)}>
            Insert {m.key}
          </button>
        ))}
      </div>
      <div className="demo-bar">
        <label className="mono">
          Key{" "}
          <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Movie title to find" />
        </label>
        <button type="button" onClick={find}>
          Find
        </button>
        <button type="button" onClick={remove}>
          Delete
        </button>
        <button
          type="button"
          onClick={() => {
            tableRef.current = new ProbeTable(11);
            setTrace([]);
            setCursor(-1);
            setNote("Table cleared.");
            setTick((n) => n + 1);
          }}
        >
          Clear
        </button>
      </div>
      <div className="slot-row" data-tick={tick}>
        {table.table.map((cell, i) => {
          const hot = trace[cursor] === i;
          const seen = trace.includes(i);
          const label = cell === null ? "empty" : cell === "DEFUNCT" ? "DEFUNCT" : cell.key;
          return (
            <div key={i} className={`slot${hot ? " hot" : ""}${seen ? " seen" : ""}`}>
              <span className="mono">{i}</span>
              <strong>{label}</strong>
              {cell && cell !== "DEFUNCT" ? <em>{cell.value}</em> : null}
            </div>
          );
        })}
      </div>
      <p className="mono">
        {note} collisions on insert {table.collisions} · size {table.n} · load {(table.n / table.capacity).toFixed(2)}
      </p>
    </div>
  );
}
