"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import { excerptFor } from "@/lib/excerpts";
import { SCROLL_CHAPTERS } from "@/lib/scroll-chapters";

export function ScrollReel() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduce) return;
    const next = Math.min(SCROLL_CHAPTERS.length - 1, Math.max(0, Math.floor(value * SCROLL_CHAPTERS.length)));
    setActive((current) => (current === next ? current : next));
  });

  return (
    <section
      id="work"
      className="scroll-reel"
      ref={root}
      style={{ ["--chapters" as string]: SCROLL_CHAPTERS.length }}
      aria-label="Scroll through the work"
    >
      <div className="scroll-sticky">
        <ol className="scroll-dots" aria-hidden={reduce ? true : undefined}>
          {SCROLL_CHAPTERS.map((chapter, index) => (
            <li key={chapter.id}>
              <button
                type="button"
                className={index === active ? "on" : ""}
                aria-current={index === active ? "true" : undefined}
                aria-label={chapter.title}
                onClick={() => {
                  const node = root.current;
                  if (!node || reduce) return;
                  const top = node.getBoundingClientRect().top + window.scrollY;
                  const span = node.offsetHeight - window.innerHeight;
                  const target = top + (span * index) / SCROLL_CHAPTERS.length;
                  window.scrollTo({ top: target, behavior: "smooth" });
                }}
              />
            </li>
          ))}
        </ol>
        <div className="scroll-frame">
          {SCROLL_CHAPTERS.map((chapter, index) => {
            const excerpt = chapter.slug ? excerptFor(chapter.slug) : null;
            const on = index === active;
            return (
              <article key={chapter.id} className={on ? "scroll-chapter on" : "scroll-chapter"} aria-hidden={reduce ? undefined : !on}>
                <div className="scroll-copy">
                  <p className="kicker">
                    {String(index + 1).padStart(2, "0")} — {chapter.kicker}
                    {chapter.badge ? ` · ${chapter.badge}` : ""}
                  </p>
                  <h2>{chapter.title}</h2>
                  <p>{chapter.plain}</p>
                  {chapter.href ? (
                    <p>
                      <Link href={chapter.href}>Open this chapter</Link>
                    </p>
                  ) : null}
                </div>
                <div className="scroll-proof">
                  {excerpt && excerpt.code && !excerpt.code.startsWith("// source not") ? (
                    <figure>
                      <figcaption className="mono">
                        {excerpt.path} · lines {excerpt.startLine}–{excerpt.endLine}
                        {chapter.badge === "private repo" ? " · private repo" : ""}
                      </figcaption>
                      <pre>
                        <code>{excerpt.code}</code>
                      </pre>
                    </figure>
                  ) : chapter.placeholder ? (
                    <p className="scroll-placeholder">{chapter.placeholder}</p>
                  ) : (
                    <p className="muted">No code excerpt for this chapter. The sentences on the left are the resume facts.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
