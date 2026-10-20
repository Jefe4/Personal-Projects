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
          Flagship work is this GitHub repo. Tools labeled private repo live under tools/ in this checkout because a private GitHub repository could not be created from here. They were not published as public repos. WIP stays labeled. A README-only repo is a pointer, not a product.
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
