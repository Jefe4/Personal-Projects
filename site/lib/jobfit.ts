import profile from "@/content/jeffrey.json";

export type FitBucket = {
  item: string;
  status: "must-evidence" | "stretch" | "missing";
  evidence: string[];
};

const STOP = new Set(
  "a an the and or to for of in on with our you we is are be this that as at by from about into over your".split(" ")
);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+/#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

const SKILL_ALIASES: Record<string, string[]> = {
  java: ["java"],
  python: ["python"],
  sql: ["sql", "mysql"],
  "c++": ["c++", "cpp"],
  javascript: ["javascript", "js"],
  typescript: ["typescript", "ts"],
  html: ["html"],
  css: ["css"],
  tcp: ["tcp", "socket"],
  networking: ["network", "networking", "ethernet", "fiber"],
  gcp: ["gcp", "google cloud"],
  excel: ["excel"],
  swift: ["swift", "ios", "swiftui"],
  firestore: ["firestore"],
  "data center": ["datacenter", "data center", "data-center"],
  linux: ["linux"],
  git: ["git", "github"],
};

export function fitJob(jd: string): { buckets: FitBucket[]; notes: string[] } {
  const text = jd.toLowerCase();
  const buckets: FitBucket[] = [];
  const notes: string[] = [];
  const never = profile.jobFitHints.neverInvent.map((s) => s.toLowerCase());

  for (const word of never) {
    if (text.includes(word.toLowerCase()) && word !== "founder") {
      buckets.push({
        item: word,
        status: "missing",
        evidence: ["Not in Jeffrey's verified materials. Will not invent it."],
      });
    }
  }
  if (text.includes("founder") || text.includes("owner-operator") || text.includes("ceo")) {
    buckets.push({
      item: "founder / owner / CEO",
      status: "missing",
      evidence: [
        "Gym role is Team Member & Systems Administrator. Owner is Leo Torres Williams. Do not map this JD as if Jeffrey founded the gym.",
      ],
    });
  }
  if (text.includes("degree required") || text.includes("bachelor") || text.includes("bs in")) {
    buckets.push({
      item: "bachelor's degree in hand",
      status: "stretch",
      evidence: [
        "Computer Science student at Frostburg State University, expected June 2027. Still enrolled — not a conferred degree.",
      ],
    });
  }

  const map = profile.jobFitHints.mustMap as Record<string, string[]>;
  for (const [key, evidence] of Object.entries(map)) {
    if (text.includes(key)) {
      buckets.push({ item: key, status: "must-evidence", evidence });
    }
  }
  for (const stretch of profile.jobFitHints.stretch) {
    if (text.includes(stretch.toLowerCase())) {
      buckets.push({
        item: stretch,
        status: "stretch",
        evidence: ["Listed as WIP or secondary — not a production-engineer claim."],
      });
    }
  }

  for (const [canon, aliases] of Object.entries(SKILL_ALIASES)) {
    if (buckets.some((b) => b.item === canon)) continue;
    if (aliases.some((a) => text.includes(a))) {
      const mapped = map[canon];
      if (mapped) {
        buckets.push({ item: canon, status: "must-evidence", evidence: mapped });
      }
    }
  }

  notes.push(profile.roleFit.datacenter_it);
  notes.push(profile.roleFit.junior_software);
  notes.push("I will not add a skill to fill a gap. Missing means missing.");
  return { buckets, notes };
}
