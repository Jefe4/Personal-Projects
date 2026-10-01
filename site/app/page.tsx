import { HomeExperience } from "@/components/home/HomeExperience";
import { flagshipProjects, getProfile, heroJobs } from "@/lib/profile";

export default function HomePage() {
  return <HomeExperience profile={getProfile()} jobs={heroJobs()} projects={flagshipProjects()} />;
}
