"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/profile";

type Project = Profile["projects"][number];

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const reduce = useReducedMotion();
  const wip = "wip" in project && project.wip;
  return (
    <motion.article
      className="project-card"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      whileHover={reduce ? undefined : { y: -10, scale: 1.015 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 28, mass: 0.8 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <p className="mono card-index">
          {String(index + 1).padStart(2, "0")}
          {wip ? " · WIP" : ""}
          {project.flagship ? "" : " · note"}
        </p>
        <h3>{project.name}</h3>
        <p className="muted">{project.summary}</p>
        <p className="mono stack-line">{(project.stack || []).join(" · ") || "WIP"}</p>
      </Link>
    </motion.article>
  );
}
