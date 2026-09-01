import profile from "@/content/jeffrey.json";

export type ChatTurn = { role: "user" | "assistant"; content: string };

const BANNED = [
  "umass",
  "boston",
  "hadoop",
  "keras",
  "pytorch engineer",
  "jefeai",
  "interview overlay",
  "gemini overlay",
];

function norm(s: string) {
  return s.toLowerCase();
}

function mentions(q: string, words: string[]) {
  const n = norm(q);
  return words.some((w) => n.includes(w));
}

export function retrieveFacts(query: string): string[] {
  const q = norm(query);
  const facts: string[] = [];
  const id = profile.identity;

  facts.push(`${id.name} — ${id.headline}. Based in ${id.location}.`);
  facts.push(`Contact: ${id.email}, ${id.phone}. GitHub ${id.github}. LinkedIn ${id.linkedin}.`);
  facts.push(`Languages: ${id.languageNote}.`);

  if (mentions(q, ["school", "college", "university", "frostburg", "degree", "graduat", "education", "student", "diploma", "high school", "rockville high", "ap class"])) {
    for (const ed of profile.education) {
      if ("line" in ed && ed.line) facts.push(ed.line);
      if ("status" in ed && ed.status === "enrolled") {
        facts.push("Still enrolled. Do not say a bachelor's degree is already conferred. Expected June 2027.");
      }
      if ("credential" in ed) {
        facts.push(`${ed.school} diploma ${ed.graduated} (attended ${ed.attended}). ${(ed.notes || []).join("; ")}`);
      }
    }
  }

  if (mentions(q, ["gym", "iron", "dmv", "falls church", "leo", "owner", "founder", "ceo", "veteran", "ios", "swift", "membership"])) {
    const gym = profile.experience.find((e) => e.org.includes("Iron Gym"));
    if (gym) {
      facts.push(`${gym.title} at ${gym.org}, ${gym.location}, ${gym.start} – ${gym.end}.`);
      if (gym.titleNote) facts.push(gym.titleNote);
      if (gym.owner) facts.push(gym.owner);
      facts.push(...gym.bullets);
      facts.push("I am not the owner, founder, or CEO. I am not documenting myself as a veteran; the gym is veteran-owned.");
    }
  }

  if (mentions(q, ["google", "akkodis", "datacenter", "data center", "leesburg", "fiber", "rack", "gcp", "contractor"])) {
    const dc = profile.experience.find((e) => e.org === "Akkodis");
    if (dc) {
      facts.push(`${dc.title} at ${dc.org}, ${dc.location}, ${dc.start} – ${dc.end}.${dc.assignment ? " " + dc.assignment + "." : ""}`);
      facts.push(...dc.bullets);
      facts.push("Not a Google employee. Contractor/assignment via Akkodis.");
    }
  }

  if (mentions(q, ["westat", "data entry", "rockville"])) {
    const w = profile.experience.find((e) => e.org === "Westat");
    if (w) facts.push(`${w.title} at ${w.org}, ${w.location}, ${w.start} – ${w.end}.`);
  }

  if (mentions(q, ["under armour", "advance auto", "ups", "chick", "more experience", "older"])) {
    for (const job of profile.experience.filter((e) => !e.hero)) {
      facts.push(`${job.title}, ${job.org}, ${job.location}, ${job.start} – ${job.end}.`);
    }
  }

  if (mentions(q, ["project", "github", "code", "graph", "hash", "tcp", "sql", "flash", "repo", "built", "java", "python", "c++"])) {
    for (const p of profile.projects.filter((p) => p.flagship || p.path)) {
      facts.push(`${p.name}${p.path ? " (" + p.path + ")" : ""}: ${p.summary}`);
    }
  }

  if (mentions(q, ["wip", "gymmaster", "digital twin", "trading", "polymarket", "event tracker", "lidar"])) {
    for (const p of profile.projects.filter((p) => p.wip)) {
      facts.push(`${p.name} (WIP): ${p.summary}`);
    }
  }

  if (mentions(q, ["skill", "stack", "language", "spanish", "bilingual"])) {
    facts.push("Skills with evidence: " + profile.skills.map((s) => s.name).join(", "));
  }

  if (mentions(q, ["fit", "role", "job", "hiring", "sre", "software", "infra", "it "])) {
    facts.push(profile.roleFit.datacenter_it);
    facts.push(profile.roleFit.junior_software);
    facts.push(profile.roleFit.systems_networking);
  }

  if (mentions(q, ["arlington", "where", "live", "located", "based"])) {
    facts.push(`Current site location: ${id.location}. Rockville is hometown / high school, not the current city on the latest resume.`);
  }

  facts.push("Never claim: " + profile.doNotClaim.join("; "));
  return facts;
}

function stitch(query: string, facts: string[]): string {
  const q = norm(query);
  const id = profile.identity;
  const lines: string[] = [];

  if (mentions(q, ["owner", "founder", "ceo"]) && mentions(q, ["gym", "iron", "dmv"])) {
    lines.push("I'm a Team Member and Systems Administrator at DMV Iron Gym in Falls Church — not the owner, founder, or CEO. Leo Torres Williams is the founder/CEO. The gym is veteran-owned; I'm staff.");
  }

  if (mentions(q, ["google employee", "work at google", "google fte"]) || (mentions(q, ["google"]) && mentions(q, ["employ", "full-time", "fte"]))) {
    lines.push("I'm not a Google employee. I'm a Datacenter Technician at Akkodis, on assignment at a Google data center in Leesburg, VA (Sep 2025–present).");
  }

  if (mentions(q, ["graduat", "degree in hand", "already have a degree", "bachelor"])) {
    lines.push("I'm a Computer Science student at Frostburg State University, expected June 2027 — still enrolled, not a conferred bachelor's on this resume.");
  }

  if (mentions(q, ["umass", "boston", "jeffrey g. gomez"])) {
    lines.push("That's a different person. I'm Jeffrey Gomez — Arlington / DC metro, Frostburg CS, Akkodis datacenter assignment, DMV Iron Gym staff. LinkedIn: " + id.linkedin);
  }

  if (!lines.length) {
    lines.push(`I'm ${id.name}, ${id.headline}, ${id.location}.`);
  }

  const extra = facts.filter((f) => !f.startsWith("Never claim")).slice(0, 10);
  for (const f of extra) {
    if (!lines.some((l) => l.includes(f.slice(0, 40)))) {
      lines.push(f);
    }
  }

  if (mentions(q, ["project", "code", "repo", "show me"])) {
    const flag = profile.projects.find((p) => p.flagship);
    if (flag?.path) {
      lines.push(`A project in this repo: ${flag.name} at ${flag.path} — ${flag.github}`);
    }
  }

  lines.push("If something isn't in my materials I won't invent it — employers, dates, degrees, or skills.");
  return lines.join("\n\n");
}

export function answerFromRetrieval(query: string): { answer: string; facts: string[]; highlights: string[] } {
  const facts = retrieveFacts(query);
  const answer = stitch(query, facts);
  const highlights: string[] = [];
  const n = norm(query + " " + answer);
  if (n.includes("akkodis") || n.includes("datacenter")) highlights.push("org:akkodis");
  if (n.includes("iron gym")) highlights.push("org:dmv-iron-gym-inc");
  if (n.includes("frostburg")) highlights.push("edu:frostburg-state-university");
  if (n.includes("graph") || n.includes("friend-bot")) highlights.push("proj:graph");
  if (n.includes("hash")) highlights.push("proj:hashmap");
  if (n.includes("tcp")) highlights.push("proj:tcp");
  for (const b of BANNED) {
    if (norm(answer).includes(b) && !mentions(query, ["umass", "boston"])) {
      // keep UMass only as a denial
    }
  }
  return { answer, facts, highlights };
}

export function systemPrompt(facts: string[]) {
  return [
    "You are Jeffrey Gomez speaking in first person to a recruiter.",
    "Use ONLY the facts below. If asked for something missing, say it is not in your materials.",
    "You are NOT the owner/founder/CEO of DMV Iron Gym. You are Team Member & Systems Administrator. Owner is Leo Torres Williams.",
    "You are NOT a Google FTE. Akkodis contractor on assignment at a Google data center, Leesburg VA.",
    "You have NOT graduated. CS at Frostburg, expected June 2027.",
    "Location on the latest resume: Arlington, Virginia / DC metro.",
    "Never mention interview overlays, screen/audio capture, JefeAi, tax/medical files, or the other Jeffrey G. Gomez (UMass/Boston).",
    "Never invent employers, dates, degrees, or skills.",
    "Facts:",
    ...facts.map((f) => "- " + f),
  ].join("\n");
}

export async function maybeOpenAI(query: string, history: ChatTurn[], facts: string[]): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const messages = [
    { role: "system", content: systemPrompt(facts) },
    ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: query },
  ];
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}
