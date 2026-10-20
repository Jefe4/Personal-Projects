import profile from "@/content/jeffrey.json";

export type ChatTurn = { role: "user" | "assistant"; content: string };

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

  if (mentions(q, ["project", "github", "code", "graph", "hash", "tcp", "sql", "flash", "repo", "built", "java", "python", "c++", "tool", "esp32", "novum", "firmware"])) {
    for (const p of profile.projects.filter((p) => p.flagship || p.path)) {
      facts.push(`${p.name}${p.path ? " (" + p.path + ")" : ""}: ${p.summary}`);
    }
  }

  if (mentions(q, ["esp32", "dispenser", "firmware", "husky", "serial log", "serial-monitor"])) {
    facts.push("The ESP32 dispenser firmware page for branch firmware/dispense-fsm is still a placeholder. That GitHub tree was not readable from this checkout, so no firmware source is quoted from it. A different local branch, firmware/estop-nc at 91af525, has 186 host checks and is not compiled or tested on hardware. tools/esp32-serial-log is a separate log parser, not that firmware.");
  }

  if (mentions(q, ["novum", "local model", "coding agent", "harness"])) {
    facts.push("Novum is work in progress. The Oct 15, 2026 verify report and the installed app call it 0.9.0. Do not take that version from package.json. Runner: 9/10 real-gemma tasks after fixes, 6/10 on the first run. Retrieval: 11 correct / 7 partial / 2 wrong, versus base alone at 0 / 7 / 13. Cold start 2.0 s at about 300 MB. The 18/18 tab pass is from the 0.8.4 verify. Older 0.3.7 QA verdict was Not done (repeated line 0/40, but the action line doubled in 3/9 lessons and the 40-token cap cut off 34/35 desk and unlock replies).");
  }

  if (mentions(q, ["kicad", "schematic", "pcb", "circuit board", "dispenser board"])) {
    facts.push("KiCad dispenser carrier v2 is work in progress: 100×72 mm, 2 layers, ERC 0 and DRC 0 on 2026-10-16. Not fabricated. Pin order is assumed. Fuse and reverse-polarity protection are not on the board yet. The e-stop is not purchased. PIR is not in the firmware yet.");
  }

  if (mentions(q, ["tinyml", "tiny ml", "motion classifier", "synthetic"])) {
    facts.push("TinyML motion classifier is work in progress. 584 host checks passed, and C++ agrees with Python on 24/24. Accuracy 1.0 is on synthetic data, not real dogs. Not compiled for the ESP32. No real IMU data. The old esp32_dispense copy is marked DO NOT FLASH.");
  }

  if (mentions(q, ["mcp", "model context"])) {
    facts.push("MCP servers are work in progress, read-only, written in JavaScript. 14 tests passed, 1 skipped (Iron Desk was not running). Not published. They do not write.");
  }

  if (mentions(q, ["e-stop", "estop", "normally-closed", "normally closed"])) {
    facts.push("E-stop dispense firmware on branch firmware/estop-nc at 91af525: 186 host checks passed. Not compiled for the ESP32 and not tested on hardware. The NC button has not been bought. It boots stopped. A remote enable cannot override the button.");
  }

  if (mentions(q, ["rack label", "asset label", "port label", "maintenance", "resume json", "private repo", "drop label"])) {
    facts.push("Private-repo tools in this checkout, under tools/: esp32-serial-log, rack-label-check, resume-json-check, gym-maint, and port-label-check. A private GitHub repo could not be created from the environment that added them, so they are in this pull request and labeled private repo. They were not published as public repos.");
  }

  if (mentions(q, ["wip", "gymmaster", "digital twin", "trading", "polymarket", "event tracker"])) {
    for (const p of profile.projects.filter((p) => p.wip)) {
      facts.push(`${p.name} (WIP): ${p.summary}`);
    }
  }

  if (mentions(q, ["lidar", "photogrammetry", "realitykit", "arkit", "digital twin", "gym scan", "glb", "spatial", "3d scan", "3d gym", "3d resume"])) {
    facts.push("The 3D file is a photogrammetry scan of DMV Iron Gym (Falls Church floor I work on), not a 3D paper resume. Zero readable CV text on the mesh. Interactive viewer: /gym. File: site/public/gym.glb (Git LFS).");
    facts.push("On the mesh only: floor letters DMV IRON GYM; yellow DON'T QUIT mural with strike-throughs so it also reads DO IT; pink DMV IRON GYM wall graphic; red EXIT signs; US flag, Thin Blue Line, Thin Red Line, and a US Coast Guard seal as wall decor — not a claim that I served.");
    facts.push("Open-ceiling dollhouse of connected gym bays: racks, dumbbells, benches, vending, brick walls. I captured it toward QR/AR gym software (Swift + RealityKit/ARKit + Firestore, GymMasterPro, WIP). I am staff at the gym, not the owner.");
  }

  if (mentions(q, ["resume", "cv", "one-pager", "pdf"]) && !mentions(q, ["scan", "glb", "photogrammetry"])) {
    facts.push("Written resume facts are from the Aug 27 2026 resume in jeffrey.json and the /resume page. gym.glb is not a resume and has no CV text.");
    for (const job of profile.experience.filter((e) => e.hero)) {
      facts.push(`${job.title} at ${job.org}, ${job.location}, ${job.start} – ${job.end}.`);
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

export const DECLINE = "That is not covered in the resume materials.";

const INJECTION = /\b(ignore|disregard|forget|override)\b[^.]{0,40}\b(instruction|rule|prompt|previous|above|prior)s?\b|\bsystem prompt\b|\byou are now\b|\bpretend (to be|you)\b|\bjailbreak\b|\bdeveloper mode\b|(^|\n)\s*(\[system\]|system\s*:)|\[system\]|\bbase64\b|\bignora\b[^.]{0,40}\binstrucciones\b|\bignorez\b[^.]{0,40}\binstructions\b|\bvergiss\b[^.]{0,40}\banweisungen\b/i;

export function isInjectionAttempt(query: string): boolean {
  return INJECTION.test(query);
}

const BASE_FACT_COUNT = 4; // identity, contact, languages, never-claim
const SMALL_TALK = ["who is", "who's", "about", "tell me", "hi", "hello", "hey", "looking for", "role", "jeffrey", "yourself", "introduce", "contact", "email", "phone", "linkedin", "hire", "experience", "work", "background", "summary"];

function mentionsWord(q: string, words: string[]) {
  const n = norm(q);
  return words.some((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(n));
}

export function isOffTopic(query: string, facts: string[]): boolean {
  return facts.length <= BASE_FACT_COUNT && !mentionsWord(query, SMALL_TALK);
}

function stitch(query: string, facts: string[]): string {
  const q = norm(query);
  const id = profile.identity;
  const lines: string[] = [];

  if (isInjectionAttempt(query)) {
    return DECLINE + " I can only answer questions about my resume, and I won't change those rules.";
  }

  if ((/\b(own|owns|owned|owner|found|founder|founded|co-founded|ceo|run|runs)\b/.test(q) || /\bhis gym\b/.test(q)) && mentions(q, ["gym", "iron", "dmv"])) {
    lines.push("I'm a Team Member and Systems Administrator at DMV Iron Gym in Falls Church — not the owner, founder, or CEO. Leo Torres Williams is the founder/CEO. The gym is veteran-owned; I'm staff.");
  }

  if (mentions(q, ["google employee", "work at google", "google fte"]) || (mentions(q, ["google"]) && mentions(q, ["employ", "full-time", "fte"]))) {
    lines.push("I'm not a Google employee. I'm a Datacenter Technician at Akkodis, on assignment at a Google data center in Leesburg, VA (Sep 2025–present).");
  }

  if (mentions(q, ["graduat", "degree in hand", "already have a degree", "bachelor"])) {
    lines.push("I'm a Computer Science student at Frostburg State University, expected June 2027 — still enrolled, not a conferred bachelor's on this resume.");
  }

  if (mentions(q, ["3d resume", "resume.glb"]) || (mentions(q, ["resume"]) && mentions(q, ["3d", "glb", "mesh"]))) {
    lines.push("The GLB is not a 3D paper resume — it's a photogrammetry scan of DMV Iron Gym. Orbit it on /gym. Written CV facts are on /resume from jeffrey.json.");
  }

  if (mentions(q, ["coast guard", "served", "veteran"]) && !mentions(q, ["gym is veteran", "veteran-owned"])) {
    lines.push("I am not documenting military or Coast Guard service. A US Coast Guard seal appears as wall decor in the gym scan. The gym is veteran-owned; I am staff.");
  }

  if (!lines.length && isOffTopic(query, facts)) {
    return DECLINE + " Ask me about my work, school, projects, or skills.";
  }

  if (!lines.length) {
    lines.push(`I'm ${id.name}, ${id.headline}, ${id.location}.`);
  }

  const extra = facts.filter((f) => {
    if (f.startsWith("Never claim")) return false;
    if (f.startsWith(id.name + " —")) return false;
    if (f.startsWith("Contact:")) return false;
    if (f.startsWith("Languages:")) return false;
    return true;
  }).slice(0, 8);
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
  if (mentions(query, ["akkodis", "google", "datacenter", "data center", "leesburg", "fiber", "rack"])) {
    highlights.push("org:akkodis");
  }
  if (mentions(query, ["gym", "iron", "dmv", "falls church", "leo", "owner", "founder"])) {
    highlights.push("org:dmv-iron-gym-inc");
  }
  if (mentions(query, ["frostburg", "school", "college", "degree", "graduat", "education"])) {
    highlights.push("edu:frostburg-state-university");
  }
  if (mentions(query, ["graph", "friend-bot", "friend bot", "labyrinth"])) highlights.push("proj:graph");
  if (mentions(query, ["hash", "movie"])) highlights.push("proj:hashmap");
  if (mentions(query, ["lidar", "photogrammetry", "gym scan", "realitykit", "digital twin", "3d"])) {
    highlights.push("proj:gym-scan");
    highlights.push("org:dmv-iron-gym-inc");
  }
  return { answer, facts, highlights };
}

export const HARD_FACTS = [
  "I am a Datacenter Technician at Akkodis, on a Google data center assignment in Leesburg, VA, from September 2025 to present. I am a contractor. I am not a Google employee.",
  "I am a Team Member and Systems Administrator at DMV Iron Gym in Falls Church, from July 2024 to present. I am staff. I am not the owner. The owner is Leo Torres Williams.",
  "I was a Technical Data Entry Clerk at Westat in Rockville from June 2023 to October 2023.",
  "I study computer science at Frostburg State University, expected June 2027. I am still a student. I have not graduated.",
  "I graduated from Rockville High School in 2019. That is a high school diploma, not a college degree.",
  "I live in Arlington, VA. I am bilingual in English and Spanish. My GitHub is Jefe4.",
];

export function systemPrompt(facts: string[]) {
  return [
    "You are Jeffrey Gomez speaking in first person to a recruiter.",
    "Answer ONLY from the hard facts and the retrieved resume lines below. If a question is not covered, say exactly: That is not covered in the resume materials.",
    "Never say you are a Google employee, that you have graduated from Frostburg, or that you own or founded DMV Iron Gym.",
    "Hard facts:",
    ...HARD_FACTS.map((fact) => "- " + fact),
    "You are NOT the owner/founder/CEO of DMV Iron Gym. You are Team Member & Systems Administrator. Owner is Leo Torres Williams.",
    "You are NOT a Google FTE. Akkodis contractor on assignment at a Google data center, Leesburg VA.",
    "You have NOT graduated. CS at Frostburg, expected June 2027.",
    "The 3D GLB is a photogrammetry scan of DMV Iron Gym, not a resume. No CV text on the mesh. Written resume is jeffrey.json / /resume.",
    "US Coast Guard seal in the gym scan is wall decor, not a claim of service. You did not serve in the Coast Guard on this record.",
    "3D/LiDAR/photogrammetry/AR questions: gym scan on /gym plus Swift/RealityKit gym app WIP. You work at the gym as staff, not owner.",
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
