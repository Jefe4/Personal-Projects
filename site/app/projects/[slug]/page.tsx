import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { projectBySlug, publicProjects } from "@/lib/profile";

export function generateStaticParams() {
  return publicProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  const rest = publicProjects().filter((p) => p.slug !== slug);
  const related = [...rest.filter((p) => p.flagship), ...rest.filter((p) => !p.flagship)].slice(0, 3);
  return <CaseStudy project={project} related={related} />;
}
