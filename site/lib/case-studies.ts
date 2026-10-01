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
