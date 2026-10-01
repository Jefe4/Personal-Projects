import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { publicProjects } from "@/lib/profile";

export default function ProjectsPage() {
  return <ProjectIndex projects={publicProjects()} />;
}
