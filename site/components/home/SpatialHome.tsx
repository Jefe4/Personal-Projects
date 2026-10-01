"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/profile";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ContactBlock, EducationBlocks, JobPanels, SkillRow } from "./bits";

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
              <a className="ghost" href="#shelf">
                Project shelf
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

      <section className="spatial-block" id="about">
        <h2>About</h2>
        <div className="glass-grid">
          <article className="glass">
            <h3>Akkodis</h3>
            <p>Datacenter Technician in Leesburg, on assignment at a Google data center. Contractor via Akkodis, not a Google FTE. Racks, fiber, ethernet, floor cleanliness.</p>
          </article>
          <article className="glass">
            <h3>Frostburg</h3>
            <p>B.S. Computer Science, expected June 2027. Still enrolled. Not a completed degree.</p>
          </article>
          <article className="glass">
            <h3>DMV Iron Gym</h3>
            <p>Team Member and Systems Administrator in Falls Church. Leo Torres Williams is founder/CEO. I am staff, not an owner, and not a documented veteran. The scan is the room I work in.</p>
          </article>
        </div>
        <SkillRow skills={profile.skills} />
      </section>

      <section className="spatial-block" id="work">
        <h2>Work</h2>
        <div className="glass-stack">
          <JobPanels jobs={jobs} />
        </div>
        <p>
          <Link href="/resume">Earlier roles on the one-pager</Link>
        </p>
      </section>

      <section className="spatial-block" id="shelf">
        <h2>Apps on the shelf</h2>
        <p className="muted">Each tile opens a case study. WIP stays labeled. The gym tile is the photogrammetry scan, not a product launch.</p>
        <div className="app-shelf">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
        <p>
          <Link href="/projects">Every project</Link>
        </p>
      </section>

      <section className="spatial-block" id="education">
        <h2>Education</h2>
        <div className="glass-stack">
          <EducationBlocks education={profile.education} />
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
