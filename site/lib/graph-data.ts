import profile from "@/content/jeffrey.json";

export type GNode = {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  provenance?: string;
};
export type GEdge = { from: string; to: string; rel: string; source: string };

export function buildGraph() {
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  const place = (id: string, type: string, label: string, x: number, y: number, provenance?: string) => {
    if (!nodes.some((n) => n.id === id)) nodes.push({ id, type, label, x, y, provenance });
  };
  place("jeffrey", "person", profile.identity.name, 0, 0, "resume-2026-08-27");
  profile.experience.filter((e) => e.hero).forEach((job, i) => {
    const id = "org:" + job.org.toLowerCase().replace(/\s+/g, "-");
    place(id, "org", job.org, Math.cos((i + 1) * 1.7) * 220, Math.sin((i + 1) * 1.7) * 140, job.provenance);
    edges.push({
      from: "jeffrey",
      to: id,
      rel: job.current ? "works_at" : "worked_at",
      source: job.provenance,
    });
  });
  profile.education.forEach((ed, i) => {
    const id = "edu:" + ed.school.toLowerCase().replace(/\s+/g, "-");
    place(id, "school", ed.school, -220, -80 + i * 90, ed.provenance);
    edges.push({ from: "jeffrey", to: id, rel: "studied_at", source: ed.provenance });
  });
  profile.projects.filter((p) => p.flagship).forEach((p, i) => {
    const id = "proj:" + p.slug;
    place(id, "project", p.name, 80 + (i % 3) * 130, 160 + Math.floor(i / 3) * 80, p.provenance);
    edges.push({ from: "jeffrey", to: id, rel: "built", source: p.path || p.provenance });
  });
  return { nodes, edges };
}
