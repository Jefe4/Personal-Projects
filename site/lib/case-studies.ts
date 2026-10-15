export type DemoKind = "graph" | "hash" | "flash" | "tcp" | "library" | "list" | "sql" | "kg" | "gym";

export type StudyCopy = {
  problem: string;
  built: string[];
  probe: string[];
  demo: DemoKind | null;
  demoNote: string;
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
      "A local-first Mac AI harness: a coding agent in the style of Cursor, plus training a model on the machine. It is work in progress.",
    built: [
      "Work in progress. The source is not in this repository, so this page does not show a code excerpt and does not invent one.",
      "Not a shipped product. No public URL.",
    ],
    probe: ["No run steps. The source is not in this checkout."],
    demo: null,
    demoNote: "",
  },
  "kicad-board": {
    problem:
      "In progress, source coming. A KiCad board. The schematic and the board file were not in the Jefe4 repositories this site can read.",
    built: [
      "No excerpt. This page does not draw a schematic, name a part, or quote a net.",
      "Searched the public Jefe4 repositories this checkout can read. No .kicad_pcb or .kicad_sch file was there.",
    ],
    probe: ["No board file in this checkout.", "Do not treat this page as a schematic."],
    demo: null,
    demoNote: "",
  },
  tinyml: {
    problem:
      "In progress, source coming. TinyML means small machine learning on a device. No training code or model file was in the Jefe4 repositories this site can read.",
    built: ["No excerpt. This page does not name a model, a dataset, a framework, or a chip."],
    probe: ["No TinyML source in this checkout."],
    demo: null,
    demoNote: "",
  },
  "mcp-servers": {
    problem:
      "In progress, source coming. MCP servers let a coding agent call tools. No server source was in the Jefe4 repositories this site can read.",
    built: ["No excerpt. This page does not list tools or quote a server file."],
    probe: ["No MCP server source in this checkout."],
    demo: null,
    demoNote: "",
  },
  "esp32-serial-log": {
    problem: "A serial-monitor capture is a long text file. Restarts, state changes, and faults should be listed without reading every line by hand.",
    built: [
      "parseEsp32Log reads ROM reset lines (rst:0x1 (POWERON_RESET)), ESP-IDF log lines, state FROM -> TO messages, errors, and Guru Meditation panics.",
      "summarizeEsp32Log counts resets and faults and keeps the last state.",
      "Labeled private repo. The code is in this checkout under tools/esp32-serial-log because a private GitHub repository could not be created here.",
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
    .flatMap((s) => [s.problem, s.demoNote, ...s.built, ...s.probe])
    .join("\n");
}
