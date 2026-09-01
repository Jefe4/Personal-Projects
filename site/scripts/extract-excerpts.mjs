import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(here, "..");
const repoRoot = path.join(siteRoot, "..");

const pulls = [
  {
    slug: "graph",
    file: "Graph/src/Room.java",
    start: "neighborsExpensiveFirst",
    fallbackStart: "public List<int[]> neighborsExpensiveFirst",
    maxLines: 45,
  },
  {
    slug: "hashmap",
    file: "HashMap/src/Hash_M.java",
    start: "private int findSlot",
    maxLines: 40,
  },
  {
    slug: "tcp",
    file: "TCP/Chat/Chat/Server.cpp",
    start: "static void broadcast",
    maxLines: 50,
  },
  {
    slug: "flashcards",
    file: "Flashcard_App/server.js",
    start: "function nextInterval",
    maxLines: 40,
  },
  {
    slug: "sql",
    file: "FinalProject.sql",
    start: "CREATE TABLE IF NOT EXISTS `mydb`.`User`",
    maxLines: 28,
  },
  {
    slug: "library",
    file: "Library_Books/src/work/BookManagement.java",
    start: "public boolean addBook(String bookName",
    maxLines: 28,
  },
  {
    slug: "linked-list",
    file: "Java/Linked_List/IntChain.java",
    start: "public static boolean contains",
    maxLines: 25,
  },
  {
    slug: "knowledge-graph",
    file: "KnowledgeGraph/graph.py",
    start: "def add_edge",
    maxLines: 28,
  },
];

function extract(abs, start, maxLines) {
  if (!fs.existsSync(abs)) return null;
  const text = fs.readFileSync(abs, "utf8");
  const idx = text.indexOf(start);
  if (idx < 0) {
    const lines = text.split("\n").slice(0, maxLines);
    return lines.join("\n");
  }
  const before = text.slice(0, idx).split("\n").length - 1;
  const lines = text.split("\n");
  const slice = lines.slice(before, before + maxLines);
  const startLine = before + 1;
  return { code: slice.join("\n"), startLine, endLine: before + slice.length };
}

const dest = path.join(siteRoot, "content", "excerpts.json");
let prev = {};
try {
  prev = JSON.parse(fs.readFileSync(dest, "utf8"));
} catch (e) {
  prev = {};
}

const out = {};
for (const p of pulls) {
  const abs = path.join(repoRoot, p.file);
  const got = extract(abs, p.start, p.maxLines);
  if (!got) {
    out[p.slug] = prev[p.slug] || {
      path: p.file,
      code: "// source not available in this build",
      startLine: 1,
      endLine: 1,
    };
    continue;
  }
  if (typeof got === "string") {
    out[p.slug] = { path: p.file, code: got, startLine: 1, endLine: got.split("\n").length };
  } else {
    out[p.slug] = { path: p.file, ...got };
  }
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
console.log("wrote", dest, Object.keys(out).join(", "));
