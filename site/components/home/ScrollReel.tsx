"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import { excerptFor } from "@/lib/excerpts";
import { SCROLL_CHAPTERS } from "@/lib/scroll-chapters";

export function ScrollReel() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 800px)");
    const apply = () => setNarrow(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const stack = Boolean(reduce) || narrow;

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (stack) return;
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
      data-stacked={stack ? "true" : "false"}
    >
      <p className="visually-hidden" aria-live="polite">
        {stack ? "All chapters are on the page." : `Chapter ${active + 1} of ${SCROLL_CHAPTERS.length}. ${SCROLL_CHAPTERS[active]?.title ?? ""}`}
      </p>
      <div className="scroll-sticky">
        <ol className="scroll-dots" aria-label="Chapters">
          {SCROLL_CHAPTERS.map((chapter, index) => (
            <li key={chapter.id}>
              <button
                type="button"
                className={index === active ? "on" : ""}
                aria-current={index === active ? "true" : undefined}
                aria-label={chapter.title}
                onClick={() => {
                  const node = root.current;
                  if (!node || stack) return;
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
              <article
                key={chapter.id}
                id={`chapter-${chapter.id}`}
                className={on || stack ? "scroll-chapter on" : "scroll-chapter"}
                aria-hidden={stack ? undefined : !on}
              >
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
                      <pre tabIndex={0} aria-label={`Code from ${excerpt.path}`}>
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
