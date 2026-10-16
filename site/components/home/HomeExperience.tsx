"use client";

import type { Profile } from "@/lib/profile";
import { useUi } from "@/components/UiProvider";
import { EditorialHome } from "./EditorialHome";
import { ShowcaseHome } from "./ShowcaseHome";
import { SpatialHome } from "./SpatialHome";
import { StudioHome } from "./StudioHome";

export function HomeExperience({
  profile,
  jobs,
  projects,
}: {
  profile: Profile;
  jobs: Profile["experience"];
  projects: Profile["projects"];
}) {
  const { ui } = useUi();
  if (ui === "spatial") return <SpatialHome profile={profile} jobs={jobs} projects={projects} />;
  if (ui === "editorial") return <EditorialHome profile={profile} jobs={jobs} projects={projects} />;
  if (ui === "showcase") return <ShowcaseHome profile={profile} />;
  return <StudioHome profile={profile} jobs={jobs} projects={projects} />;
}
