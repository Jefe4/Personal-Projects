"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/profile";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ContactBlock, EducationBlocks, JobPanels, SkillRow } from "./bits";

export function StudioHome({
  profile,
  jobs,
  projects,
}: {
  profile: Profile;
  jobs: Profile["experience"];
  projects: Profile["projects"];
}) {
  const reduce = useReducedMotion();
  const id = profile.identity;
  return (
    <main id="main" className="home home-studio">
      <section className="studio-hero">
        <p className="kicker">{id.location} · EN / ES</p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {id.name}
        </motion.h1>
        <p className="hero-line">{id.headline}</p>
        <p className="lede">{id.summary}</p>
        <div className="cta">
          <a href="#work">Work</a>
          <a className="ghost" href="#projects">
            Projects
          </a>
          <Link className="ghost" href="/gym">
            Gym scan
          </Link>
          <Link className="ghost" href="/fit">
            Paste a JD
          </Link>
        </div>
      </section>

      <section className="studio-story" id="about">
        <div className="story-pin">
          <p className="eyebrow">01 — About</p>
          <h2>Datacenter floor, CS coursework, gym systems.</h2>
        </div>
        <div className="story-copy">
          <p>
            I rack hardware and pull fiber in Leesburg as a Datacenter Technician for Akkodis, on assignment at a Google data center. That is a contractor seat, not a Google FTE.
          </p>
          <p>I study computer science at Frostburg State University. The degree is expected June 2027. I am still enrolled.</p>
          <p>
            I also do gym-floor systems work at DMV Iron Gym in Falls Church: memberships, payments, Excel, and a Swift + Firestore app that is still in progress. I am staff. I am not the owner, founder, or CEO.
          </p>
          <SkillRow skills={profile.skills} />
        </div>
      </section>

      <section className="studio-story" id="work">
        <div className="story-pin">
          <p className="eyebrow">02 — Work</p>
          <h2>The roles on the Aug 27 resume.</h2>
          <p className="muted">Earlier retail and warehouse jobs stay on the one-pager.</p>
          <p>
            <Link href="/resume">Open the one-pager</Link>
          </p>
        </div>
        <div className="story-stack">
          <JobPanels jobs={jobs} />
        </div>
      </section>

      <section className="studio-band" id="projects">
        <div className="band-head">
          <p className="eyebrow">03 — Projects</p>
          <h2>Open a case study.</h2>
          <p className="muted">Hover lifts the card. The page after it is the code, the run steps, and a small interactive model where the repo supports one.</p>
        </div>
        <div className="project-grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
        <p>
          <Link href="/projects">All projects, including WIP</Link>
        </p>
      </section>

      <section className="studio-story" id="education">
        <div className="story-pin">
          <p className="eyebrow">04 — Education</p>
          <h2>Expected June 2027.</h2>
        </div>
        <div className="story-stack">
          <EducationBlocks education={profile.education} />
        </div>
      </section>

      <section className="studio-contact" id="contact">
        <p className="eyebrow">05 — Contact</p>
        <h2>Ask, or write.</h2>
        <p className="lede">The chat on this page answers from the resume file. It does not invent employers or a degree I do not have yet.</p>
        <ContactBlock identity={id} />
      </section>
    </main>
  );
}
