"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { UI_BLURB, UI_DIRECTIONS, UI_LABEL } from "@/lib/ui";
import { useUi } from "./UiProvider";

export function DirectionPicker() {
  const { offerPicker, setUi, dismissPicker } = useUi();
  const reduce = useReducedMotion();
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!offerPicker) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissPicker();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [offerPicker, dismissPicker]);

  if (!offerPicker) return null;

  return (
    <div className="direction-picker" role="dialog" aria-modal="true" aria-labelledby="direction-title">
      <motion.div
        className="direction-sheet"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="kicker">Three directions, equal weight</p>
        <h2 id="direction-title">Same resume. Pick how you want to move through it.</h2>
        <p className="muted">
          Studio, Spatial, and Editorial stay in the header. None of them is the only site. Your choice is saved in this browser, and the URL can be shared.
        </p>
        <div className="direction-grid">
          {UI_DIRECTIONS.map((id, i) => (
            <button
              key={id}
              ref={i === 0 ? first : undefined}
              type="button"
              className={`direction-card tone-${id}`}
              onClick={() => setUi(id)}
            >
              <span className={`direction-mini tone-${id}`} aria-hidden="true" />
              <strong>{UI_LABEL[id]}</strong>
              <span>{UI_BLURB[id]}</span>
            </button>
          ))}
        </div>
        <button type="button" className="direction-skip" onClick={dismissPicker}>
          Look around first. Nothing is saved until you pick a direction.
        </button>
      </motion.div>
    </div>
  );
}
