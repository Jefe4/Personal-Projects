"use client";

import Link from "next/link";
import type { Profile } from "@/lib/profile";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ContactBlock, EducationBlocks, JobPanels, SkillRow } from "./bits";

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
  return (
    <main id="main" className="home home-editorial">
      <header className="masthead">
        <div className="mast-meta mono">
          <span>Layout · Editorial</span>
          <span>Source · resume Aug 27, 2026</span>
          <span>{id.location}</span>
        </div>
        <p className="kicker">Recruiter briefing</p>
        <h1>{id.name}</h1>
        <p className="deck">{id.summary}</p>
        <div className="cta">
          <a href="#ed-work">Work</a>
          <a className="ghost" href="#ed-projects">
            Case studies
          </a>
          <Link className="ghost" href="/resume">
            One-pager
          </Link>
        </div>
      </header>

      <section className="ed-section" id="about">
        <p className="ed-num">01</p>
        <div>
          <h2>About</h2>
          <div className="ed-cols">
            <p>
              Datacenter Technician at Akkodis, Leesburg, on assignment at a Google data center. Not a Google employee. Computer science at Frostburg State University, expected June 2027, still enrolled.
            </p>
            <p>
              Team Member and Systems Administrator at DMV Iron Gym, Falls Church. The gym is veteran-owned. I am staff, not the founder, and I am not a documented veteran. Leo Torres Williams is founder/CEO.
            </p>
          </div>
          <SkillRow skills={profile.skills} />
        </div>
      </section>

      <section className="ed-section" id="ed-work">
        <p className="ed-num">02</p>
        <div>
          <h2>Work</h2>
          <div className="ed-jobs">
            <JobPanels jobs={jobs} />
          </div>
          <p className="muted">
            Under Armour, Advance Auto Parts, UPS, and Chick-fil-A are on the <Link href="/resume">one-pager</Link>, not in this opening.
          </p>
        </div>
      </section>

      <section className="ed-section" id="ed-projects">
        <p className="ed-num">03</p>
        <div>
          <h2>Projects</h2>
          <p className="deck-sm">Numbered case studies. Public code first. Anything without a repo is marked WIP and stays that way.</p>
          <div className="project-grid editorial-grid">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
          <p>
            <Link href="/projects">Index of every project</Link>
          </p>
        </div>
      </section>

      <section className="ed-section" id="education">
        <p className="ed-num">04</p>
        <div>
          <h2>Education</h2>
          <EducationBlocks education={profile.education} />
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
