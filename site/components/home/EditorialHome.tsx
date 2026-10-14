"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/profile";
import { ContactBlock, EducationBlocks, SkillRow } from "./bits";
import { ScrollReel } from "./ScrollReel";

export function EditorialHome({
  profile,
  jobs,
  projects,
}: {
  profile: Profile;
  jobs: Profile["experience"];
  projects: Profile["projects"];
}) {
  const id = profile.identity;
  const reduce = useReducedMotion();
  return (
    <main id="main" className="home home-editorial">
      <header className="masthead">
        <div className="mast-meta mono">
          <span>Layout · Editorial</span>
          <span>Source · resume Aug 27, 2026</span>
          <span>{id.location}</span>
        </div>
        <p className="kicker">Recruiter briefing</p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {id.name}
        </motion.h1>
        <p className="deck">{id.summary}</p>
        <div className="cta">
          <a href="#work">Scroll the work</a>
          <a className="ghost" href="#education">
            Education
          </a>
          <Link className="ghost" href="/resume">
            One-pager
          </Link>
        </div>
      </header>

      <ScrollReel />
      <p className="muted scroll-follow">
        {jobs.length} resume roles and {projects.length} projects are in the scroll. Earlier retail jobs stay on the <Link href="/resume">one-pager</Link>.{" "}
        <Link href="/projects">Index</Link>
      </p>

      <section className="ed-section" id="education">
        <p className="ed-num">04</p>
        <div>
          <h2>Education</h2>
          <EducationBlocks education={profile.education} />
          <SkillRow skills={profile.skills} />
        </div>
      </section>

      <section className="ed-section" id="contact">
        <p className="ed-num">05</p>
        <div>
          <h2>Contact</h2>
          <ContactBlock identity={id} />
        </div>
      </section>
    </main>
  );
}
