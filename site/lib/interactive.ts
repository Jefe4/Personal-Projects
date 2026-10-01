/**
 * Browser stand-ins for algorithms in this repo.
 * Graph edges are Room.assignmentLabyrinth() in Graph/src/Room.java.
 * Hash rules follow Hash_M.findSlot (linear probe + DEFUNCT), with a fixed
 * polynomial hash so the picture does not change between reloads.
 * Flashcard intervals match Flashcard_App/server.js nextInterval.
 */

export const LABYRINTH_EDGES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 5],
  [0, 3, 1],
  [0, 4, 4],
  [1, 2, 7],
  [1, 7, 4],
  [2, 6, 11],
  [3, 2, 3],
  [4, 5, 1],
  [5, 1, 3],
  [6, 4, 17],
  [6, 7, 6],
  [6, 9, 4],
  [7, 8, 5],
  [7, 9, 9],
  [7, 10, 7],
  [8, 4, 12],
  [9, 10, 8],
  [10, 11, 2],
  [11, 8, 5],
];

export const ROOM_COUNT = 12;

export type FuelStep = { from: number; to: number; liters: number };

export type BotWalk = {
  order: number[];
  steps: FuelStep[];
  fuel: number;
  found: boolean;
};

export function adjacencyMatrix(): number[][] {
  const m = Array.from({ length: ROOM_COUNT }, () => Array(ROOM_COUNT).fill(0));
  for (const [i, j, w] of LABYRINTH_EDGES) m[i][j] = w;
  return m;
}

function neighborsExpensiveFirst(m: number[][], v: number): { to: number; w: number }[] {
  const nbrs: { to: number; w: number }[] = [];
  for (let i = 0; i < ROOM_COUNT; i++) {
    if (m[v][i] !== 0) nbrs.push({ to: i, w: m[v][i] });
  }
  nbrs.sort((a, b) => (a.w !== b.w ? b.w - a.w : a.to - b.to));
  return nbrs;
}

/** FRIEND-BOT: costliest unused door first. Fuel only when entering a new room. */
export function friendBot(start = 0, target: number | null = 11): BotWalk {
  const m = adjacencyMatrix();
  const visited = Array(ROOM_COUNT).fill(false);
  const order: number[] = [];
  const steps: FuelStep[] = [];
  let fuel = 0;
  let found = false;

  function dfs(v: number, from: number) {
    visited[v] = true;
    order.push(v);
    if (from >= 0) steps.push({ from, to: v, liters: m[from][v] });
    if (target !== null && v === target) {
      found = true;
      return;
    }
    for (const nb of neighborsExpensiveFirst(m, v)) {
      if (visited[nb.to]) continue;
      if (found) return;
      fuel += nb.w;
      dfs(nb.to, v);
    }
  }

  dfs(start, -1);
  return { order, steps, fuel, found };
}

export type CheapPath = { rooms: number[]; steps: FuelStep[]; fuel: number };

/** Array Dijkstra, same rule as Room.cheapestPath. */
export function cheapestPath(start = 0, goal = 11): CheapPath {
  const m = adjacencyMatrix();
  const inf = Number.MAX_SAFE_INTEGER / 4;
  const dist = Array(ROOM_COUNT).fill(inf);
  const prev = Array(ROOM_COUNT).fill(-1);
  const used = Array(ROOM_COUNT).fill(false);
  dist[start] = 0;
  for (let k = 0; k < ROOM_COUNT; k++) {
    let u = -1;
    let best = inf;
    for (let i = 0; i < ROOM_COUNT; i++) {
      if (!used[i] && dist[i] < best) {
        best = dist[i];
        u = i;
      }
    }
    if (u < 0) break;
    used[u] = true;
    for (let v = 0; v < ROOM_COUNT; v++) {
      const w = m[u][v];
      if (w !== 0 && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }
  if (dist[goal] >= inf) return { rooms: [], steps: [], fuel: -1 };
  const rev: number[] = [];
  let cur = goal;
  while (cur !== -1) {
    rev.push(cur);
    if (cur === start) break;
    cur = prev[cur];
  }
  rev.reverse();
  const steps: FuelStep[] = [];
  for (let i = 0; i < rev.length - 1; i++) {
    const a = rev[i];
    const b = rev[i + 1];
    steps.push({ from: a, to: b, liters: m[a][b] });
  }
  return { rooms: rev, steps, fuel: dist[goal] };
}

export function roomPoint(i: number, cx = 280, cy = 210, r = 158) {
  const a = -Math.PI / 2 + (i / ROOM_COUNT) * Math.PI * 2;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export type Cell = { key: string; value: string } | "DEFUNCT" | null;

export type ProbeTrace = { probes: number[]; found: boolean; index: number };

/** Open addressing, linear probing, tombstones. Capacity stays fixed in the demo. */
export class ProbeTable {
  table: Cell[];
  n = 0;
  collisions = 0;
  constructor(public capacity = 11) {
    this.table = Array(capacity).fill(null);
  }

  hash(key: string) {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = Math.imul(h, 33) + key.charCodeAt(i);
    return Math.abs(h | 0) % this.capacity;
  }

  findSlot(key: string): ProbeTrace {
    const h = this.hash(key);
    const probes: number[] = [];
    let available = -1;
    let j = h;
    do {
      probes.push(j);
      const cell = this.table[j];
      if (cell === null || cell === "DEFUNCT") {
        if (available === -1) available = j;
        if (cell === null) break;
      } else if (cell.key === key) {
        return { probes, found: true, index: j };
      }
      j = (j + 1) % this.capacity;
    } while (j !== h);
    return { probes, found: false, index: available };
  }

  put(key: string, value: string): ProbeTrace {
    const home = this.table[this.hash(key)];
    const slot = this.findSlot(key);
    if (!slot.found && home && home !== "DEFUNCT") this.collisions++;
    if (slot.found) {
      const cell = this.table[slot.index];
      if (cell && cell !== "DEFUNCT") cell.value = value;
      return slot;
    }
    if (slot.index < 0) return slot;
    this.table[slot.index] = { key, value };
    this.n++;
    return slot;
  }

  get(key: string): { value: string | null; trace: ProbeTrace } {
    const trace = this.findSlot(key);
    if (!trace.found) return { value: null, trace };
    const cell = this.table[trace.index];
    return { value: cell && cell !== "DEFUNCT" ? cell.value : null, trace };
  }

  remove(key: string): ProbeTrace {
    const slot = this.findSlot(key);
    if (!slot.found) return slot;
    this.table[slot.index] = "DEFUNCT";
    this.n--;
    return slot;
  }
}

export const SAMPLE_MOVIES: { key: string; value: string }[] = [
  { key: "The Shining", value: "Drama" },
  { key: "Raging Bull", value: "Biography" },
  { key: "Airplane!", value: "Comedy" },
  { key: "Popeye", value: "Adventure" },
  { key: "Caddyshack", value: "Comedy" },
];

/** Box intervals from Flashcard_App/server.js. Miss returns to box 1. */
export function nextInterval(box: number, knewIt: boolean): { box: number; days: number } {
  if (!knewIt) return { box: 1, days: 0 };
  const nextBox = Math.min(5, (box || 1) + 1);
  const days = nextBox === 2 ? 1 : nextBox === 3 ? 3 : nextBox === 4 ? 7 : 14;
  return { box: nextBox, days };
}

export const STUDY_CARDS: { id: string; front: string; back: string }[] = [
  {
    id: "graph-dfs",
    front: "In the room graph, what does FRIEND-BOT try first?",
    back: "The most expensive unused door (highest liters). Backtracking does not add fuel.",
  },
  {
    id: "hash-probe",
    front: "Hash_M uses which collision strategy?",
    back: "Linear probing. A deleted slot is marked DEFUNCT so the probe walk can continue.",
  },
  {
    id: "tcp-frame",
    front: "How does the TCP chat know a message is complete?",
    back: "Newline framing. Each client has an inbuf; a line is handled only after '\\n' arrives.",
  },
  {
    id: "sql-user",
    front: "What is the primary key on mydb.User in FinalProject.sql?",
    back: "Username, with unique Email and idLibrary. Library is a separate table keyed by idLibrary.",
  },
];

export type ShelfBook = { title: string; author: string; year: number };

/** Seed list from Library_Books BookManagement.seedDefaults. Match is by title. */
export const SEED_BOOKS: ShelfBook[] = [
  { title: "The Hunger Games", author: "Suzanne Collins", year: 2008 },
  { title: "Harry Potter and the Order of the Phoenix", author: "J.K. Rowling", year: 2003 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960 },
  { title: "Twilight", author: "Stephanie Meyer", year: 2005 },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", year: 2008 },
];

export function findBooks(books: ShelfBook[], query: string): ShelfBook[] {
  const q = query.trim().toLowerCase();
  if (!q) return books;
  return books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
}

export type SqlTable = { name: string; keys: string; links: string };

export const SQL_TABLES: SqlTable[] = [
  { name: "Library", keys: "PK idLibrary", links: "Referenced by User.idLibrary" },
  { name: "User", keys: "PK Username · unique Email, idLibrary", links: "FK idLibrary → Library" },
  { name: "Genre", keys: "PK idGenre", links: "Game_Genre, Region_Sale" },
  { name: "Publisher", keys: "PK idPublisher", links: "Game.idPublisher" },
  { name: "Game", keys: "PK idGame", links: "FK idPublisher → Publisher" },
  { name: "Region", keys: "PK idRegion", links: "Region_Sale, Game_Region" },
  { name: "Region_Sale", keys: "PK idRegion_Sale", links: "FK Genre_id → Genre · FK idRegion → Region" },
  { name: "Store", keys: "PK (idStore, Game_id)", links: "FK Game_id → Game" },
  { name: "Game_Genre", keys: "PK idGameGenre · unique (idGame, idGenre)", links: "FK to Game and Genre" },
  { name: "Game_Region", keys: "PK idGameRegion · unique (idGame, idRegion)", links: "FK to Game and Region" },
];

export const LIST_CHAIN = [4, 9, 2, 7];

/** Walk like IntChain.contains: temp = temp.next until null or equal. */
export function containsWalk(chain: number[], target: number): number[] {
  const seen: number[] = [];
  for (let i = 0; i < chain.length; i++) {
    seen.push(i);
    if (chain[i] === target) break;
  }
  return seen;
}
