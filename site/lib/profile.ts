import profile from "@/content/jeffrey.json";

export type Profile = typeof profile;

export function getProfile(): Profile {
  return profile;
}

export function heroJobs() {
  return profile.experience.filter((e) => e.hero);
}

export function moreJobs() {
  return profile.experience.filter((e) => !e.hero);
}

export function publicProjects() {
  return profile.projects.filter((p) => p.visibility !== "omit");
}

export function flagshipProjects() {
  return profile.projects.filter((p) => p.flagship);
}

export function projectBySlug(slug: string) {
  return profile.projects.find((p) => p.slug === slug);
}
