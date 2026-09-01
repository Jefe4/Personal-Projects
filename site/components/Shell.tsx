"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatDock } from "./ChatDock";

const links = [
  ["/", "Work"],
  ["/founder", "Ops"],
  ["/projects", "Projects"],
  ["/fit", "Job-fit"],
  ["/graph", "Graph"],
  ["/3d", "3D resume"],
  ["/resume", "One-pager"],
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [theme, setTheme] = useState<"briefing" | "editorial">("briefing");

  useEffect(() => {
    const saved = window.localStorage.getItem("jefe-theme");
    if (saved === "editorial" || saved === "briefing") setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("jefe-theme", theme);
  }, [theme]);

  return (
    <>
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
        <div className="toggles">
          <button type="button" aria-pressed={theme === "briefing"} onClick={() => setTheme("briefing")}>
            Briefing
          </button>
          <button type="button" aria-pressed={theme === "editorial"} onClick={() => setTheme("editorial")}>
            Editorial
          </button>
        </div>
      </header>
      {children}
      <ChatDock />
    </>
  );
}
