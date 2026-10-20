"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ChatDock } from "./ChatDock";
import { DirectionPicker } from "./DirectionPicker";
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
  const headerRef = useRef<HTMLElement>(null);
  const { ui, setUi, scheme, setScheme } = useUi();
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty("--header", `${el.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ui, menu]);
  useEffect(() => {
    setMenu(false);
  }, [path, ui]);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  function Directions() {
    return (
      <div className="ui-switch directions" role="group" aria-label="UI direction">
        {UI_DIRECTIONS.map((id) => (
          <button key={id} type="button" aria-pressed={ui === id} onClick={() => setUi(id)}>
            {UI_LABEL[id]}
          </button>
        ))}
      </div>
    );
  }

  function SchemeSwitch() {
    if (ui === "spatial") return null;
    return (
      <div className="ui-switch" role="group" aria-label="Color scheme">
        <button type="button" aria-pressed={scheme === "light"} onClick={() => setScheme("light")}>
          Light
        </button>
        <button type="button" aria-pressed={scheme === "dark"} onClick={() => setScheme("dark")}>
          Dark
        </button>
      </div>
    );
  }

  return (
    <>
      {ui === "showcase" ? null : (
        <motion.div className="scroll-progress" style={{ scaleX: reduce ? scrollYProgress : scaleX }} aria-hidden="true" />
      )}
      {ui === "showcase" ? (
        <header className="site-header showcase-nav" ref={headerRef}>
          <Link className="brand" href="/">
            Jeffrey Gomez
          </Link>
          <nav className="showcase-center" aria-label="Primary">
            {links.map(([href, label]) => (
              <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="showcase-menu-btn"
            aria-expanded={menu}
            aria-controls="showcase-drawer"
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? "Close" : "Menu"}
          </button>
        </header>
      ) : (
      <header className="site-header" ref={headerRef}>
        <div className="header-top">
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
        </div>
        <div className="direction-bar">
          <Directions />
          <SchemeSwitch />
        </div>
      </header>
      )}
      <div
        id="showcase-drawer"
        className={menu && ui === "showcase" ? "showcase-drawer open" : "showcase-drawer"}
        role={menu && ui === "showcase" ? "dialog" : undefined}
        aria-modal={menu && ui === "showcase" ? true : undefined}
        aria-hidden={ui !== "showcase" || !menu}
        aria-label="Menu"
        inert={ui !== "showcase" || !menu ? true : undefined}
      >
        <nav aria-label="Menu">
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </Link>
          ))}
        </nav>
        <Directions />
        <SchemeSwitch />
      </div>
      {ui === "showcase" && menu ? (
        <button type="button" className="showcase-scrim" aria-label="Close menu" onClick={() => setMenu(false)} />
      ) : null}
      {children}
      <DirectionPicker />
      <ChatDock />
    </>
  );
}
