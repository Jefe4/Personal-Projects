export type GuardFlag = "google-employee" | "graduated" | "gym-owner";

const CORRECTION: Record<GuardFlag, string> = {
  "google-employee":
    "I am not a Google employee. I am a Datacenter Technician at Akkodis, a contractor on a Google data center assignment in Leesburg, VA, from September 2025 to present.",
  graduated:
    "I have not graduated. I am still a computer science student at Frostburg State University, expected June 2027.",
  "gym-owner":
    "I am not the owner or founder of DMV Iron Gym. I am a Team Member and Systems Administrator, which is staff. The owner is Leo Torres Williams.",
};

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function negated(sentence: string, pattern: RegExp): boolean {
  return pattern.test(sentence);
}

/** Affirmative claim that Jeffrey is a Google employee. A denial does not count. */
export function affirmsGoogleEmployment(sentence: string): boolean {
  const n = sentence.toLowerCase();
  if (negated(n, /\b(not|n't|never)\b[^.]{0,48}\bgoogle\b[^.]{0,24}\b(employee|fte|employer|staff)\b/)) return false;
  if (/\b(contractor|akkodis)\b/.test(n) && /\bnot a google\b/.test(n)) return false;
  if (/\bgoogle (employee|fte|full-time employee|full time employee)\b/.test(n)) return true;
  if (/\b(employed by google|google hired me|i am employed at google)\b/.test(n)) return true;
  if (/\bi (work|worked) (at|for) google\b/.test(n) && !/\b(not|n't|assignment|contractor|akkodis|data center|datacenter)\b/.test(n)) return true;
  if (/\b(i am|i'm|i’m)\s+(a\s+)?googler\b/.test(n)) return true;
  // Third person or "full-time" phrasing: "He works for Google as a full-time engineer."
  if (/\b(he|jeffrey|i)\s+(works|worked|work)\s+(at|for)\s+google\b/.test(n) && !/\b(not|n't|never|assignment|contractor|akkodis|data center|datacenter)\b/.test(n)) return true;
  if (/\b(he|jeffrey) is (a|an)\s+(google employee|googler|google fte)\b/.test(n)) return true;
  return false;
}

/** Affirmative claim of a completed college degree. High school graduation is allowed. */
export function affirmsGraduated(sentence: string): boolean {
  const n = sentence.toLowerCase();
  const highSchoolOnly = /\b(high school|rockville high)\b/.test(n) && !/\b(frostburg|bachelor|college degree|university degree|b\.s)\b/.test(n);
  if (highSchoolOnly) return false;
  if (/\b(not|never|haven't|have not|didn't|did not|n't)\b[^.]{0,40}\bgraduat/.test(n)) return false;
  if (/\bstill (a )?student\b/.test(n) && !/\bgraduated\b/.test(n)) return false;
  if (/\b(i graduated|i have graduated|i've graduated|i already graduated)\b/.test(n)) return true;
  if (/\bgraduated\b/.test(n) && /\b(frostburg|college|university|bachelor|computer science)\b/.test(n)) return true;
  if (/\b(degree in hand|conferred degree|completed my (bachelor|degree)|alumni of frostburg|alumnus of frostburg)\b/.test(n)) return true;
  if (/\b(hold|have|earned)\s+(a\s+)?(bachelor|b\.s\.|bs degree)\b/.test(n) && !/\bexpected\b/.test(n)) return true;
  return false;
}

/** Affirmative claim that Jeffrey owns or founded the gym. Naming Leo as owner does not count. */
export function affirmsGymOwner(sentence: string): boolean {
  const n = sentence.toLowerCase();
  if (/\b(not the|not an|am not|n't the|is not)\b[^.]{0,40}\b(owner|founder|ceo)\b/.test(n)) return false;
  if (/\b(i am|i'm|i’m)\s+(the\s+)?(owner|founder|ceo)\b/.test(n)) return true;
  if (/\b(i own|i founded)\b/.test(n) && /\bgym\b/.test(n)) return true;
  if (/\b(he|jeffrey)\s+(owns|founded|co-owns|runs his own)\b/.test(n) && /\b(gym|iron|dmv)\b/.test(n)) return true;
  if (/\b(he|jeffrey) is the\s+(owner|founder|ceo|co-owner)\b/.test(n) && /\b(gym|iron|dmv)\b/.test(n)) return true;
  if (/\bmy (gym|company)\b/.test(n) && /\b(iron gym|dmv)\b/.test(n)) return true;
  return false;
}

export function claimFlags(text: string): GuardFlag[] {
  const flags = new Set<GuardFlag>();
  for (const sentence of sentences(text)) {
    if (affirmsGoogleEmployment(sentence)) flags.add("google-employee");
    if (affirmsGraduated(sentence)) flags.add("graduated");
    if (affirmsGymOwner(sentence)) flags.add("gym-owner");
  }
  return [...flags];
}

export function guardRecruiterAnswer(raw: string): { text: string; flags: GuardFlag[] } {
  const flags = claimFlags(raw);
  if (!flags.length) return { text: raw, flags };
  const kept = sentences(raw).filter((sentence) => claimFlags(sentence).length === 0);
  const text = [...flags.map((flag) => CORRECTION[flag]), ...kept].join(" ").replace(/[ \t]+\n/g, "\n").trim();
  return { text, flags };
}
