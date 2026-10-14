"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/profile";
import { ContactBlock, EducationBlocks, SkillRow } from "./bits";
import { ScrollReel } from "./ScrollReel";

const GymScanViewer = dynamic(() => import("@/components/GymScanViewer").then((m) => m.GymScanViewer), {
  ssr: false,
  loading: () => <p className="muted">Loading the gym scan…</p>,
});

export function SpatialHome({
  profile,
  jobs,
  projects,
}: {
  profile: Profile;
  jobs: Profile["experience"];
  projects: Profile["projects"];
}) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLElement>(null);
  const id = profile.identity;

  useEffect(() => {
    const el = stage.current;
    if (!el || reduce) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 22;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      el.style.setProperty("--px", `${x.toFixed(2)}px`);
      el.style.setProperty("--py", `${y.toFixed(2)}px`);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <main id="main" className="home home-spatial">
      <section className="spatial-stage" ref={stage}>
        <div className="depth depth-back" aria-hidden="true" />
        <div className="depth depth-mid" aria-hidden="true" />
        <div className="spatial-hero-grid">
          <div className="glass spatial-copy">
            <p className="kicker">Spatial · {id.location}</p>
            <h1>{id.name}</h1>
            <p className="hero-line">{id.headline}</p>
            <p className="lede">{id.summary}</p>
            <div className="cta">
              <Link href="/gym">Open the full scan</Link>
              <a className="ghost" href="#work">
                Scroll the work
              </a>
              <Link className="ghost" href="/fit">
                Paste a JD
              </Link>
            </div>
          </div>
          <div className="glass spatial-preview">
            <p className="mono">/gym · Falls Church floor · staff, not owner</p>
            <GymScanViewer compact />
          </div>
        </div>
      </section>

      <ScrollReel />
      <p className="muted scroll-follow">
        {jobs.length} resume roles and {projects.length} projects are in the scroll.{" "}
        <Link href="/projects">Every project</Link>
      </p>

      <section className="spatial-block" id="education">
        <h2>Education</h2>
        <div className="glass-stack">
          <EducationBlocks education={profile.education} />
          <SkillRow skills={profile.skills} />
        </div>
      </section>

      <section className="spatial-block" id="contact">
        <h2>Contact</h2>
        <div className="glass">
          <ContactBlock identity={id} />
        </div>
      </section>
    </main>
  );
}
