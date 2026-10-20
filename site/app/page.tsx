import { HomeExperience } from "@/components/home/HomeExperience";
import { getProfile, heroJobs, publicProjects } from "@/lib/profile";

export default function HomePage() {
  return <HomeExperience profile={getProfile()} jobs={heroJobs()} projects={publicProjects()} />;
}
