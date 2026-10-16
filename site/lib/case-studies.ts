export type DemoKind = "graph" | "hash" | "flash" | "tcp" | "library" | "list" | "sql" | "kg" | "gym";

export type StudyQuote = { caption: string; code: string };

export type StudyCopy = {
  problem: string;
  built: string[];
  probe: string[];
  demo: DemoKind | null;
  demoNote: string;
  /** Limits that must stay on the page. */
  caveats?: string[];
  constraints?: string[];
  /** When set, the built list is titled Decisions. */
  decisions?: boolean;
  result?: string[];
  history?: string[];
  quotes?: StudyQuote[];
};

const STUDIES: Record<string, StudyCopy> = {
  graph: {
    problem:
      "The labyrinth is directed. A door weight is liters of fuel. The notes ask for a search that opens the most expensive unused door first. That is not the cheapest route. Backtracking is free, which is why a separate fuel-aware path has to sit next to the search.",
    built: [
      "Room stores doors in an adjacency matrix. adj[i][j] is liters from room i to room j, or 0 when there is no door.",
      "neighborsExpensiveFirst sorts by liters descending, then by room index. friendBotSearch charges fuel only on the walk into a new room.",
      "cheapestPath is an array Dijkstra on the same matrix. FRIEND_BOT_DFS1 drives the built-in 12-room labyrinth (start 0, target 11) and can load graph_example.",
    ],
    probe: [
      "cd Graph && javac -d out src/*.java && java -cp out FRIEND_BOT_DFS1",
      "java -cp out Room",
      "java -ea -cp out RoomTest",
    ],
    demo: "graph",
    demoNote:
      "Weights are Room.assignmentLabyrinth(). Stepping the bot uses the same expensive-first rule as friendBotSearch. Cheapest is cheapestPath. Backtracking is not drawn, because it does not burn fuel.",
  },
  hashmap: {
    problem:
      "A movie catalog is only useful here if you can see the probe. java.util.HashMap would hide the collision. The point is the walk: home slot, next slot, tombstone after a delete, resize when the table gets half full.",
    built: [
      "Hash_M is open addressing with linear probing. findSlot walks from the home index until the key or an empty slot. DEFUNCT marks a deleted slot so a later lookup can keep walking.",
      "A collision is counted when the home slot is already a different live key. AbstractHashMap resizes when n would pass capacity/2, to 2*capacity-1. The hash is MAD (scale and shift); those factors are random per run.",
      "The loader reads a movie CSV (name, genre, year, director) from the project folder. Main_class loads it, prints collision stats, and looks up The Shining. --repl is find / add / delete / print / stats.",
    ],
    probe: [
      "cd HashMap && javac -d out src/*.java && java -cp out Hash_M",
      "java -cp out Main_class --repl",
      "java -ea -cp out Hash_MTest",
    ],
    demo: "hash",
    demoNote:
      "Same probe rules as Hash_M.findSlot, on a fixed 11-slot table. The hash here is a polynomial so the picture stays put. Java's MAD hash uses a random scale and shift, so slot numbers in the JVM will differ.",
  },
  tcp: {
    problem:
      "The first upload was a one-shot hello between one client and one server. A chat needs partial reads, more than one person, and a way to leave.",
    built: [
      "POSIX sockets. The server listens (default port 1234), sets SO_REUSEADDR, and backlog 10.",
      "Each peer has an fd, a nick, and an inbuf. A line is handled only after a newline. select() watches the listen socket and every client fd.",
      "Commands: /nick, /who, /quit. Any other line is broadcast to the other peers. The client retries connect and sets send/recv timeouts.",
    ],
    probe: [
      "cd TCP/Chat/Chat && make && ./chat_server 1234",
      "./chat_client localhost 1234 Jefe",
    ],
    demo: "tcp",
    demoNote:
      "Both peers are local. This is the command behavior from Server.cpp (newline lines, /nick /who /quit, broadcast to the others). It is not a live socket.",
  },
  flashcards: {
    problem:
      "The original folder had a port and a launch config and no app. I needed a deck about this repo, with misses that fall back and hits that wait longer.",
    built: [
      "Node http server, no extra packages required to run. Cards live in data/cards.json. Progress is data/progress.json.",
      "nextInterval: a miss returns to box 1 due today. A hit moves up one box, capped at 5, with waits of 1, 3, 7, then 14 days.",
      "The deck covers rooms, hashing, TCP framing, SQL keys, and list walks.",
    ],
    probe: ["cd Flashcard_App && npm start", "npm test"],
    demo: "flash",
    demoNote: "Knew it / Missed it calls the same nextInterval as server.js. Progress on this page stays in the browser.",
  },
  sql: {
    problem:
      "A game library needs users, games, publishers, genres, regions, and stores without a pile of repeated columns. The course schema was a Workbench model. I wanted a viewer that cannot run arbitrary SQL.",
    built: [
      "FinalProject.sql is the MySQL schema mydb: Library, User, Genre, Game, Publisher, Region, Region_Sale, Store, Game_Genre, Game_Region, plus seed data and two views (GameDetailsView, UserLibrarySummaryView).",
      "User's primary key is Username. Email and idLibrary are unique. idLibrary references Library.",
      "sql_project_web_ui is a Flask table viewer. Table names are allow-listed in app.py before SELECT. It needs MySQL loaded with that script. No public hosted URL.",
    ],
    probe: [
      "Load FinalProject.sql into MySQL (schema mydb).",
      "cd sql_project_web_ui && python3 app.py  (needs DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)",
    ],
    demo: "sql",
    demoNote: "Click a table to read the keys and foreign keys from FinalProject.sql. This does not connect to a database.",
  },
  library: {
    problem: "A short Java shelf: add a title, find it later, change it, delete it, and still have it after a rerun.",
    built: [
      "BookManagement keeps an ArrayList and a text file. Seed titles load when the file is missing. Equals is by title only, same as the original Book class.",
      "add, search, edit, delete. Titles with spaces use nextLine. Search-by-author is extra.",
    ],
    probe: [
      "cd Library_Books && javac -d out src/work/*.java",
      "java -cp out work.BookManagementSystem",
      "java -ea -cp out work.BookTest",
    ],
    demo: "library",
    demoNote: "The five seed titles are BookManagement.seedDefaults. Search matches title or author. This page does not write booklist.txt.",
  },
  "linked-list": {
    problem: "The early drills were a node with num and next, plus a walk that prints whether a value is there.",
    built: [
      "IntChain is that node: contains, swapValues, and sorted insert in one place so they can be tested.",
      "contains walks temp = temp.next until null. It is O(n). Sorted insert is O(n). No extra libraries.",
    ],
    probe: [
      "cd Java/Linked_List && javac -d out *.java",
      "java -cp out IntChain",
      "java -ea -cp out IntChainTest",
    ],
    demo: "list",
    demoNote: "The chain is a sample of the IntChain shape (num, next), not a recording of a specific run.",
  },
  "knowledge-graph": {
    problem: "I wanted a graph I can explain in an interview: nodes, labeled edges, and a source on every fact so a recruiter can see where a line came from.",
    built: [
      "graph.py stores nodes and edges. add_edge refuses an edge whose ends are not already nodes. Every edge keeps source and an optional note.",
      "If site/content/jeffrey.json is present, that file is the resume half. FRIEND-BOT rooms, Hash_M movies, and library books are mixed in from the repo.",
    ],
    probe: ["cd KnowledgeGraph && python3 graph.py", "python3 -m unittest test_graph.py"],
    demo: "kg",
    demoNote: "The drawing on /graph is the same provenance graph the chat can highlight.",
  },
  "gym-scan": {
    problem:
      "I wanted a spatial capture of the Falls Church floor I work on, toward QR and AR gym software. The mesh is the room. It is not a résumé and it has no CV text on it.",
    built: [
      "Photogrammetry glTF at site/public/gym.glb (Git LFS), shown with Three.js on /gym. Orbit and a top-down view.",
      "Open-ceiling dollhouse of connected bays: racks, dumbbells, benches, vending, brick. Floor letters DMV IRON GYM. Yellow DON'T QUIT mural that also reads DO IT. Pink wall graphic. EXIT signs. Flag and service-seal decor is wall art, not a service claim.",
      "I am staff at DMV Iron Gym (Team Member and Systems Administrator), not the owner. Leo Torres Williams is founder/CEO. If gym.glb is missing, the page shows a schematic with those same captions.",
    ],
    probe: ["Open /gym.", "Written CV facts are /resume and content/jeffrey.json, not the mesh."],
    demo: "gym",
    demoNote: "The viewer is the same one as /gym. Nothing on the mesh is resume text.",
  },
  "gymapp-github": {
    problem: "A public GitHub pointer for gym app work, separate from this monorepo.",
    built: [
      "At inspection, Jefe4/GymApp is an early README-only repository. Treat it as a pointer, not a shipped product.",
      "The modular iOS app on the resume (Swift + Firestore) is still work in progress. No App Store URL.",
    ],
    probe: ["https://github.com/Jefe4/GymApp"],
    demo: null,
    demoNote: "",
  },
  "gym-master": {
    problem:
      "The gym needs a member app and a manager app on top of the floor I already captured: equipment, QR tutorials, and a 3D view. I am the developer. The gym is the client.",
    built: [
      "Work in progress: SwiftUI, RealityKit, ARKit, and Firestore. No public live App Store URL.",
      "The public spatial piece you can open today is the photogrammetry scan on /gym.",
    ],
    probe: ["Open /gym for the scan.", "Do not expect an App Store listing."],
    demo: null,
    demoNote: "",
  },
  cardio: {
    problem: "A treadmill companion aimed at Life Fitness equipment on the gym floor. I do not own that brand.",
    built: [
      "Work in progress: React, TypeScript, Express, Socket.io. No public live URL.",
    ],
    probe: ["No public repository is listed for this item."],
    demo: null,
    demoNote: "",
  },
  "trading-graph": {
    problem:
      "Personal research on my own machine: a small strategy graph with a paper-trading default. This is not a job, not a fund, and not a performance record.",
    built: [
      "Local tooling only (not a public repo): Tkinter, Flask, SQLite. Binance testnet is the default. Alpaca is listed. Polymarket is marked coming soon. Paper trading is the default, with a kill switch.",
      "Work in progress. Do not quote returns. I do not claim finance employment.",
    ],
    probe: ["No public repository is listed for this item."],
    demo: null,
    demoNote: "",
  },
  "event-tracker": {
    problem: "A resume line for a real-time event tracker still in development: a 3D earth, news aggregation, and filtering.",
    built: ["Work in progress. No public repository is listed here, so this page does not invent a demo or a live URL."],
    probe: ["No public repository is listed for this item."],
    demo: null,
    demoNote: "",
  },
  spatial: {
    problem:
      "Hardware and spatial mapping experiments: custom PCBs, LiDAR, photogrammetry. The only public spatial artifact is the gym interior scan.",
    built: [
      "Work in progress. Not a production hardware product.",
      "The gym scan on /gym is photogrammetry of the floor I work on. It is not a LiDAR product and not a resume mesh.",
    ],
    probe: ["Open /gym.", "No public hardware repository is listed."],
    demo: null,
    demoNote: "",
  },
  "esp32-firmware": {
    problem:
      "Dispenser firmware for an ESP32 lives in Jefe4/husky-watchdog-firmware on branch firmware/dispense-fsm. This checkout could not read that repository.",
    built: [
      "Placeholder. GitHub returned 404, which is also what a private repository looks like when this credential cannot see it.",
      "No firmware source is quoted on this page. Nothing was copied from the internet to fill the gap.",
      "The separate tool at tools/esp32-serial-log parses serial-monitor captures. It is not the firmware.",
    ],
    probe: ["Private repo: Jefe4/husky-watchdog-firmware, branch firmware/dispense-fsm.", "Do not treat this page as a firmware listing."],
    demo: null,
    demoNote: "",
  },
  novum: {
    problem:
      "Novum is a local-first Electron desktop app. It teaches AI through lessons, and finishing a lesson unlocks a feature. It has also grown into a coding harness. Model calls run on the machine by default. This page is work in progress.",
    caveats: [
      "Work in progress. Nothing in the Oct 15, 2026 verify note was pushed or published.",
      "The 0.9.0 name is from that verify report and the installed app. This page does not take the version from package.json.",
      "The full tree is not in this website repo. The two code blocks are the quotes recorded from electron/router.cjs at commit 29bde88.",
    ],
    constraints: [
      "Local by default: Ollama on port 11434 and MLX on port 8080. Secrets in the notes vault are never indexed.",
      "The task runner runs one task at a time, each in its own git worktree on a runner/<id> branch. It never pushes. A merge is a local fast-forward and needs explicit approval.",
      "Each command has a timeout, and a task has a 30-minute limit.",
    ],
    decisions: true,
    built: [
      "Electron ^33.2 with a Vite and React renderer. The main process is CommonJS: main.cjs, router.cjs, harness.cjs, runner.cjs, lenses.cjs, vaultIndex.cjs, lora.cjs, kgraph.cjs, engineering.cjs. The renderer is React, Vite, and TypeScript.",
      "Ollama Dual route: gemma4:e4b (fast) hands off to gemma4:26b (preferred body). MLX serves a Qwen2.5-3B-Instruct-4bit LoRA adapter trained in the app.",
      "Vault retrieval is BM25 plus nomic-embed-text vectors. Lite mode is e4b, 2048 context, and a 768-token cap. Performance mode is the default.",
      "Lessons unlock features. Progress only merges forward and is never wiped.",
      "Harness tab: repo tree, search, and index, then propose, diff, and apply a changeset with rollback, plus a local agent loop.",
      "Self-QA and self-repair. Repair proposals run in git worktrees and wait for approval in a Builder view. A nightly run is optional.",
      "MLX LoRA training uses its own process group, shows a live loss curve, and serves on port 8080.",
      "Vault chat cites notes. A knowledge graph of notes, tags, and wikilinks is read-only.",
      "Engineering tab: read-only discovery of KiCad, Unreal, and ESP32 projects, with a scoped index.",
      "Local task runner, new in 0.9.0, is a CLI and a Runner tab.",
      "Lens QA, new in 0.9.0, runs npm run gate first, then 3 of 10 rotating review lenses, starting with what changed. Each lens returns its top 3 issues by impact. Issues that are not quick wins become draft task specs.",
      "The verify note also records LOCAL-HANDOFF.md and 20 task specs (3 P1, 8 P2, 9 P3). Each spec has an automated check, and all 20 checks fail on main as intended. Every spec prompt fits in gemma4:26b's 8192-token context.",
    ],
    result: [
      "verify:all printed 56 ok lines. New suites include runner (11), lenses (5), and tasks. Typecheck passes. npm run gate passes: typecheck 1.5 s, verify:all 35 s, self-QA 49 s.",
      "Cold start is 2.0 s, 4 processes, about 300 MB, and quit in 0.24 s.",
      "Runner with real gemma: 10 distinct seeded tasks over 13 real runs. 6/10 were ready on the first run. 9/10 completed after spec and runner bugs were fixed. One example was a 3-line diff in 13 s on gemma4:26b. The one remaining failure is real: e4b's search text did not match in Lite mode. 4 runner bugs were found and fixed along the way.",
      "Live lens pass: gemma4:26b at 8192 context, 3 lenses in 40.8 s, 9 issues (5 quick wins).",
      "Vault retrieval, 20 questions, strict grading, correct / partial / wrong: base model alone 0 / 7 / 13. Base plus retrieval 11 / 7 / 2. QA LoRA plus retrieval 5 / 10 / 5. Retrieval, not fine-tuning, is what made the model answer from the notes.",
      "Full-tab QA from the 0.8.4 verify, not a new 0.9.0 UI pass: 18/18 tabs passed in both Performance and Lite, with 0 problems. Chat took 16.1 s in Performance (Dual) and 6.5 s in Lite.",
    ],
    history: [
      "Older live-coach QA, Novum 0.3.7, Oct 7 2026, gemma4:e4b on Ollama 0.34.4. Verdict: Not done. The repeated app line was fixed (0/40). Two blockers were still open: the action line doubled in 3/9 lessons, and the 40-token cap cut off 34/35 desk and unlock replies. That run is history. It is not the 0.9.0 result.",
    ],
    quotes: [
      {
        caption: "electron/router.cjs at commit 29bde88 — Lite mode routing. Quoted from the Oct 15, 2026 verify note. The file is not in this website repo.",
        code: `const LITE = { model: 'gemma4:e4b', numCtx: 2048, maxTokens: 768 };
const LITE_HINT = 'Lite mode: answer in under 300 words. Lead with the answer; skip preamble.';
function applyPerfMode(settings, body) {
  if (!settings || settings.perfMode !== 'lite') return body;
  const out = { ...body };
  if (out.provider !== 'mlx') { out.model = settings.liteModel || LITE.model; out.provider = 'ollama'; if (out.role === 'cloud') out.role = 'body'; }
  out.num_ctx = Math.min(Number(out.num_ctx) || LITE.numCtx, LITE.numCtx);
  out.max_tokens = Math.min(Number(out.max_tokens) || LITE.maxTokens, LITE.maxTokens);
  // ...injects LITE_HINT into the system prompt
  out.lite = true;
  return out;
}`,
      },
      {
        caption: "electron/router.cjs at commit 29bde88 — trim a Lite reply at the token cap. Quoted from the same verify note.",
        code: `/** A Lite reply cut off by the token cap ends at its last full sentence (or list item), with a short note. */
function trimAtCap(text, cap) {
  const t = String(text || '').replace(/\\s+$/, '');
  const cut = Math.max(t.lastIndexOf('. '), t.lastIndexOf('.\\n'), t.lastIndexOf('\\n\\n'), t.lastIndexOf('\\n- '), t.lastIndexOf('\\n* '), t.lastIndexOf('\`\`\`\\n'));
  const fenceOpen = (t.slice(0, cut > 0 ? cut : t.length).match(/\`\`\`/g) || []).length % 2 === 1;
  let body = cut > t.length * 0.5 ? t.slice(0, cut + 1).replace(/\\s+$/, '') : t;
  if (fenceOpen || (body.match(/\`\`\`/g) || []).length % 2 === 1) body += '\\n\`\`\`';
  return \`\${body}\\n\\n_(Trimmed at the Lite limit of \${cap} tokens. Say "continue" for more, or switch to Performance.)_\`;
}`,
      },
    ],
    probe: [
      "Read the Oct 15, 2026 verify note. The label 0.9.0 is that report and the installed app.",
      "Do not treat 0.3.7 as the current result. Its verdict was Not done.",
    ],
    demo: null,
    demoNote: "",
  },
  "kicad-board": {
    problem:
      "A carrier PCB for an ESP32 DevKit that drives an SG90 servo treat dispenser, with an IMU, a PIR, a treat beam-break, and a hardware e-stop. It is part of a supervised Husky companion (watch the dog, interpret behavior, dispense a treat). Dispensing is supervised only (unsupervised_dispense is false). Work in progress.",
    caveats: [
      "Not fabricated or ordered.",
      "DevKit pin order is assumed (DevKitC order). The 25.4 mm row spacing is assumed and still needs measuring on the ELEGOO board.",
      "A fuse and reverse-polarity protection on the power input are not on the v2 board. They are queued QA findings.",
      "The NC mushroom e-stop is not purchased. PIR on GPIO34 is proposed and is not in the firmware yet.",
    ],
    constraints: [
      "Local repo only: ~/Documents/Projects/husky-dispenser-hw, branch pcb/layout-v2 at 3168a08. The v2 layout commit is 9435cf7. Nothing was pushed, and nothing was bought.",
      "KiCad 10 (kicad-cli). A script generated and routed the board (tools/gen_pcb.py).",
      "The servo has an external 5 V rail. The ESP32 5V/VIN pin is not tied to that rail. The board has a common ground.",
    ],
    decisions: true,
    built: [
      "Board outline on Edge.Cuts is 100 × 72 mm. Two copper layers (F.Cu and B.Cu). 55 track segments, 2 vias, 14 footprints.",
      "v1 was an 80 × 55 mm board with 469 track pieces and a generic 1x8 header. The schematic starter on main is 6033362. The v1 layout is 2ba1a3c.",
      "Pinout checked against the firmware: servo GPIO18, I2C SDA 21 and SCL 22 at 400 kHz, e-stop GPIO26 as INPUT_PULLUP (an open or broken wire means stop), treat beam GPIO27.",
      "Parts from docs/bom.csv at 3168a08: J1 and J8 are two 1x19 2.54 mm sockets for a 38-pin ESP32 DevKit. J2 is a 5 V 3 A screw terminal. J3 is the SG90 header. J4 is the GY-6500 I2C header. J5 is the PIR HC-SR501 header. J6 is the IR beam-break header. J7 is a header for the NC mushroom e-stop. C1 is 470 µF 16 V. C2 is 100 nF.",
    ],
    result: [
      "bash tools/verify.sh on 2026-10-16: ERC found 0 violations. DRC found 0 violations, 0 unconnected items, and 0 schematic parity issues. VERIFY OK.",
      "Gerbers and a drill file are in outputs/gerbers/, with outputs/pcb_render_top.png and top and bottom SVGs. Those files are not in this website repo, so this page does not show a picture of the board.",
    ],
    quotes: [
      {
        caption: "docs/bom.csv at 3168a08. Two rows from the verified note.",
        code: `J7,1,2-pin header + NC mushroom e-stop,"22mm panel e-stop, red mushroom, latching ...",PinHeader_1x02,"NOT PURCHASED - to buy. Wire NC contact J7-1 to J7-2 (GND). Kit tactile buttons are NO: bench-only via ESTOP_UNSAFE_NO_BENCH_BUTTON (unsafe, broken wire does not stop)..."
C1,1,Electrolytic cap,470uF 16V,CP_Radial_D10.0mm_P5.00mm,Bulk across servo rail; observe polarity`,
      },
    ],
    probe: [
      "The checks were ERC and DRC on 2026-10-16, not a fabricated board.",
      "Do not describe a purpose beyond the carrier listed above, and do not say it was fabricated.",
    ],
    demo: null,
    demoNote: "",
  },
  tinyml: {
    problem:
      "Classify dog motion from a collar or IMU window into four classes: rest, walk, play, and shake. The intended board is an ESP32 plus a GY-6500 (MPU-6500) IMU on I2C pins 21 and 22. Work in progress.",
    caveats: [
      "Held-out accuracy of 1.0 is on synthetic data (data/synthetic.npz, n_test = 320, diagonal confusion matrix). It is not real-dog accuracy. No real IMU data has been recorded.",
      "Not compiled for the ESP32. PlatformIO is not installed.",
      "The branch's old esp32_dispense copy is marked DO NOT FLASH (commit 19132de).",
    ],
    constraints: [
      "Local branch tinyml/motion-classifier at 108a13e in ~/Documents/Projects/husky-watchdog-firmware. The initial classifier is eaac87b. The NaN/Inf guard is f2b0923.",
      "Host tests only: C++17 with -Wall -Wextra -Werror, ASan, and UBSan.",
    ],
    decisions: true,
    built: [
      "A small MLP trained in numpy: 15 features, 16 hidden units, 4 classes. tools/train.py exports the weights to lib/motion_core/src/model_weights.h.",
      "classify_window refuses a window that is not finite, then extracts features and classifies. The comment in the quote says an I2C read glitch is an example.",
      "The weight header says it was generated by tools/train.py and records held_out_acc=1.000 on data/synthetic.npz.",
    ],
    result: [
      "make test on 2026-10-16: features worst absolute error 7.63e-06. C++ and Python predictions agree on 24/24. 584 checks, 0 failed.",
    ],
    quotes: [
      {
        caption: "firmware/motion_classifier/lib/motion_core/src/motion_core.cpp at f2b0923.",
        code: `int classify_window(const float* window, float* probs) {
  for (int i = 0; i < kWindow * kAxes; ++i)
    if (!isfinite(window[i])) return kInvalidInput;  // e.g. I2C read glitch
  float f[kFeatures];
  extract_features(window, f);
  return classify_features(f, probs);
}`,
      },
      {
        caption: "lib/motion_core/src/model_weights.h header lines. The accuracy note is in the file.",
        code: `// GENERATED by tools/train.py -- do not edit.
#pragma once
#include "motion_core.h"
// data=data/synthetic.npz held_out_acc=1.000 (synthetic data unless noted)
namespace motion {
static const float kFeatMean[kFeatures] = { ... };`,
      },
    ],
    probe: [
      "Host make test: 584 checks, and C++ agrees with Python on 24/24.",
      "Do not quote 1.0 as accuracy on real dogs.",
    ],
    demo: null,
    demoNote: "",
  },
  "mcp-servers": {
    problem:
      "Give an assistant read-only access to three of my own apps: Iron Desk (the gym and 3D app API), Novum, and a trading desk. Work in progress. Not published.",
    caveats: [
      "Read-only. Written in JavaScript (TypeScript sources) on Node 22, stdio, with zod schemas.",
      "npm test on 2026-10-16: 15 tests, 14 passed, 0 failed, 1 skipped. The skip is the Iron Desk live smoke test, because Iron Desk was not running on 127.0.0.1:4000.",
      "Local branch only: ~/Documents/Projects/app-mcp-servers, branch mcp/read-only at 6af55de. Not published.",
    ],
    constraints: [
      "Iron Desk sends only GET requests, with an 8 second timeout, and refuses any base URL that is not localhost.",
      "Files go through a root allowlist. .. escapes are rejected. Symlinks whose real path leaves the root are rejected. A denylist blocks secrets and cache paths.",
      "Only text, json, jsonl, md, txt, log, and csv files can be read. JSON keys matching api_key, secret, token, password, and similar names are redacted. Files over 8 MB are refused. Output is truncated at about 64 KB.",
    ],
    decisions: true,
    built: [
      "get_strategies is commit 39466d5. The symlink escape fix is 8ce1abe. List and search skip symlinks at 5576956. The localhost-only test is 2dd1338. The 8 MB cap is 2a413a0.",
      "strategiesView, the function behind get_strategies, read trading-platform-electron/src/data/strategies.json and returned 65 nodes and 74 edges in the summary view.",
    ],
    result: [
      "14 tests passed and 1 was skipped. 0 failed.",
    ],
    quotes: [
      {
        caption: "lib/files.js at 8ce1abe — symlink escape guard.",
        code: `const full = path.resolve(base, rel);
if (full !== base && !full.startsWith(base + path.sep)) throw new Error('path escapes root');
if (fs.existsSync(full)) {  // follow symlinks: the real target must stay inside the root too
  const real = fs.realpathSync(full);
  if (real !== base && !real.startsWith(base + path.sep)) throw new Error('path escapes root (symlink)');
}
if (DENY.some((d) => d.test(path.relative(base, full)))) throw new Error('path denied (secrets/cache)');`,
      },
      {
        caption: "servers/iron-desk.js — localhost-only GET.",
        code: `const BASE = process.env.GYM3D_URL || 'http://127.0.0.1:4000';
if (!/^http:\\/\\/(127\\.0\\.0\\.1|localhost)(:\\d+)?$/.test(BASE)) throw new Error('GYM3D_URL must be localhost');
const r = await fetch(u, { method: 'GET', signal: AbortSignal.timeout(8000) });`,
      },
      {
        caption: "lib/files.js — redaction.",
        code: `const SECRET_KEYS = /(api[_-]?key|secret|token|password|passphrase|private|credential|auth)/i;
export function redact(v) {
  if (Array.isArray(v)) return v.map(redact);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, SECRET_KEYS.test(k) ? '[redacted]' : redact(x)]));
  return v;
}`,
      },
    ],
    probe: [
      "14 passed, 1 skipped, on 2026-10-16. The skip needs Iron Desk on 127.0.0.1:4000.",
      "Do not list tools that are not in this note.",
    ],
    demo: null,
    demoNote: "",
  },
  "estop-firmware": {
    problem:
      "Dispense firmware with a fail-safe, normally-closed e-stop, for the same supervised treat dispenser. unsupervised_dispense is false. Work in progress.",
    caveats: [
      "186 host checks passed and 0 failed (make test on 2026-10-16).",
      "Not compiled for the ESP32 and not tested on hardware.",
      "The NC e-stop button has not been bought.",
    ],
    constraints: [
      "Local branch firmware/estop-nc at 91af525 in husky-watchdog-firmware. This is not the unread firmware/dispense-fsm placeholder elsewhere on this site.",
      "EstopGuard boots stopped. A broken wire means stop. A remote enable cannot override a pressed button.",
    ],
    decisions: true,
    built: [
      "A hardware-independent dispense state machine with limits and jam detection.",
      "The servo is detached while Disabled or Jammed, to stop creep (84de5b3).",
      "A task watchdog (esp_task_wdt, 2 s) is fed only if the e-stop was polled within 500 ms (16771ae).",
      "Wi-Fi reconnects without blocking, with a 1–60 s exponential backoff (073e29f).",
    ],
    result: [
      "Host make test on 2026-10-16: 186 checks, 0 failed. That is not an on-device test.",
    ],
    quotes: [
      {
        caption: "firmware/esp32_dispense/lib/dispense_core/src/dispense_core.h — EstopGuard.",
        code: `class EstopGuard {
 public:
  explicit EstopGuard(EstopWiring w, uint32_t releaseMs = 50)
      : wiring_(w), releaseMs_(releaseMs) {}
  // Feed the raw pin level every loop. Returns enabled().
  bool update(bool pinHigh, uint32_t nowMs);
  void remoteDisable() { remoteOk_ = false; }
  // Returns false (and changes nothing) if the hardware switch is stopping.
  bool remoteEnable();`,
      },
    ],
    probe: [
      "186 host checks. Do not say it was flashed or tried on a board.",
    ],
    demo: null,
    demoNote: "",
  },
  "esp32-serial-log": {
    problem: "A serial-monitor capture is a long text file. Restarts, state changes, and faults should be listed without reading every line by hand.",
    built: [
      "parseEsp32Log reads ROM reset lines (rst:0x1 (POWERON_RESET)), ESP-IDF log lines, state FROM -> TO messages, errors, and Guru Meditation panics.",
      "summarizeEsp32Log counts resets and faults and keeps the last state.",
      "Labeled private repo. The code is in this checkout under tools/esp32-serial-log because a private GitHub repository could not be created here.",
      "test.mjs has 3 tests (node --test).",
    ],
    probe: ["cd tools/esp32-serial-log && npm test", "node cli.mjs capture.txt"],
    demo: null,
    demoNote: "",
  },
  "rack-label-check": {
    problem: "A floor checklist of rack positions is only useful if a bad label or a repeated asset tag is caught before it is applied.",
    built: [
      "One line is SITE-HALL-ROW-RACK-U## plus an AST-######## tag. Example: IAD-H1-A-12-U24 AST-00018421.",
      "U must be 1 through 42. Duplicate slots and duplicate asset tags are errors.",
      "This is a personal checklist format, not an employer or Google asset schema. Labeled private repo.",
      "test.mjs has 3 tests (node --test).",
    ],
    probe: ["cd tools/rack-label-check && npm test", "node cli.mjs labels.txt"],
    demo: null,
    demoNote: "",
  },
  "resume-json-check": {
    problem: "The recruiter site reads a JSON resume. That file should fail a check if it starts calling me a Google employee, a graduate, or the gym owner.",
    built: [
      "checkResume requires Akkodis, Datacenter Technician, Leesburg, Sep 2025 to present, and a contractor note that says not a Google employee.",
      "It requires DMV Iron Gym staff, Leo Torres Williams as owner, Westat Jun–Oct 2023, Frostburg enrolled and expected 2027, Rockville High School 2019, Arlington, English and Spanish, and GitHub Jefe4.",
      "Labeled private repo. tools/resume-json-check.",
      "test.mjs has 2 tests (node --test).",
    ],
    probe: ["cd tools/resume-json-check && npm test", "node cli.mjs ../../site/content/jeffrey.json"],
    demo: null,
    demoNote: "",
  },
  "gym-maint": {
    problem: "Gym equipment needs a due date, not a memory. I am staff at the gym, so this is a checklist, not an ownership claim.",
    built: [
      "Each machine has an id, a name, and how many days between service.",
      "dueOn lists machines that were never serviced, or whose last service plus the interval is on or before the day you ask about.",
      "Labeled private repo. tools/gym-maint.",
      "test.mjs has 3 tests (node --test).",
    ],
    probe: [
      "cd tools/gym-maint && npm test",
      "node cli.mjs add --file maint.json --id TM-01 --name \"Treadmill 1\" --every 30",
      "node cli.mjs due --file maint.json --on 2026-10-14",
    ],
    demo: null,
    demoNote: "",
  },
  "port-label-check": {
    problem: "A copper or fiber drop needs one switch port and one far end. A duplicated port is a mislabel.",
    built: [
      "One line: SW-A12:24 copper RK-03-U40-NIC1. Medium is copper or fiber. Ports are 1 through 48.",
      "Duplicate switch ports and duplicate far ends are errors. countByMedium totals each kind of cable.",
      "Labeled private repo. tools/port-label-check.",
      "test.mjs has 3 tests (node --test).",
    ],
    probe: ["cd tools/port-label-check && npm test", "node cli.mjs drops.txt"],
    demo: null,
    demoNote: "",
  },
};

export function studyFor(slug: string): StudyCopy {
  return (
    STUDIES[slug] || {
      problem: "Documented from the resume notes. No extra product is implied.",
      built: ["Work in progress or a pointer. This page does not invent a live demo."],
      probe: ["No public run steps are listed for this item."],
      demo: null,
      demoNote: "",
    }
  );
}

export function allStudyText(): string {
  return Object.values(STUDIES)
    .flatMap((s) => [
      s.problem,
      s.demoNote,
      ...(s.caveats || []),
      ...(s.constraints || []),
      ...s.built,
      ...(s.result || []),
      ...(s.history || []),
      ...(s.quotes || []).flatMap((quote) => [quote.caption, quote.code]),
      ...s.probe,
    ])
    .join("\n");
}
