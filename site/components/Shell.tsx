"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ChatDock } from "./ChatDock";
import { useUi } from "./UiProvider";
import { UI_DIRECTIONS, UI_LABEL } from "@/lib/ui";

const links = [
  ["/", "Work"],
  ["/founder", "Ops"],
  ["/projects", "Projects"],
  ["/fit", "Job-fit"],
  ["/graph", "Graph"],
  ["/gym", "Gym scan"],
  ["/resume", "One-pager"],
];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { ui, setUi, scheme, setScheme } = useUi();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: reduce ? scrollYProgress : scaleX }} aria-hidden="true" />
      <header className="site-header">
        <Link className="brand" href="/">
          Jeffrey Gomez
        </Link>
        <nav aria-label="Primary">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="controls">
          <div className="ui-switch" role="group" aria-label="UI direction">
            {UI_DIRECTIONS.map((id) => (
              <button key={id} type="button" aria-pressed={ui === id} onClick={() => setUi(id)}>
                {UI_LABEL[id]}
              </button>
            ))}
          </div>
          {ui === "spatial" ? null : (
            <div className="ui-switch" role="group" aria-label="Color scheme">
              <button type="button" aria-pressed={scheme === "light"} onClick={() => setScheme("light")}>
                Light
              </button>
              <button type="button" aria-pressed={scheme === "dark"} onClick={() => setScheme("dark")}>
                Dark
              </button>
            </div>
          )}
        </div>
      </header>
      {children}
      <ChatDock />
    </>
  );
}
