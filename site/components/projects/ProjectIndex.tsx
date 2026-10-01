"use client";

import type { Profile } from "@/lib/profile";
import { useUi } from "@/components/UiProvider";
import { ProjectCard } from "./ProjectCard";

type Project = Profile["projects"][number];

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const { ui } = useUi();
  return (
    <main id="main" className={`wrap project-index index-${ui}`}>
      <header className="hero">
        <p className="kicker">{ui === "editorial" ? "03 — Index" : "Public proof first"}</p>
        <h1>Projects</h1>
        <p className="lede">
          Flagship work is this GitHub repo. WIP items stay labeled. A README-only repo is a pointer, not a product. Interview-assist tools are not listed.
        </p>
      </header>
      <div className={ui === "spatial" ? "app-shelf" : "project-grid"}>
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </main>
  );
}
