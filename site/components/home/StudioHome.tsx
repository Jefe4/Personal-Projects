"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/profile";
import { ContactBlock, EducationBlocks, SkillRow } from "./bits";
import { ScrollReel } from "./ScrollReel";

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
          <a href="#work">Scroll the work</a>
          <a className="ghost" href="#education">
            Education
          </a>
          <Link className="ghost" href="/gym">
            Gym scan
          </Link>
          <Link className="ghost" href="/fit">
            Paste a JD
          </Link>
        </div>
      </section>

      <ScrollReel />
      <p className="muted scroll-follow">
        {jobs.length} roles from the Aug 27 resume are in the scroll, including Westat. {projects.length} projects are linked from it.{" "}
        <Link href="/resume">One-pager</Link>
        {" · "}
        <Link href="/projects">All projects</Link>
      </p>

      <section className="studio-story" id="education">
        <div className="story-pin">
          <p className="eyebrow">04 — Education</p>
          <h2>Expected June 2027.</h2>
        </div>
        <div className="story-stack">
          <EducationBlocks education={profile.education} />
          <SkillRow skills={profile.skills} />
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
