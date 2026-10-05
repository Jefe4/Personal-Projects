const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8080);
const ROOT = path.join(__dirname, "public");
const DATA = path.join(__dirname, "data");
const CARDS = path.join(DATA, "cards.json");
const MARKETS = path.join(DATA, "decks", "markets.json");
const PROGRESS = path.join(DATA, "progress.json");

function send(res, code, body, type) {
  res.writeHead(code, { "Content-Type": type || "text/plain; charset=utf-8" });
  res.end(body);
}

function mime(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/plain; charset=utf-8";
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return fallback;
  }
}

function loadCards() {
  const base = readJson(CARDS, []);
  const markets = readJson(MARKETS, []);
  return base.concat(markets);
}

function nextInterval(box, knewIt) {
  if (!knewIt) return { box: 1, days: 0 };
  const nextBox = Math.min(5, (box || 1) + 1);
  const days = nextBox === 2 ? 1 : nextBox === 3 ? 3 : nextBox === 4 ? 7 : 14;
  return { box: nextBox, days: days };
}

function isDue(progress, id) {
  const p = progress[id];
  if (!p || !p.due) return true;
  return new Date(p.due).getTime() <= Date.now();
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (req.method === "GET" && url.pathname === "/api/deck") {
    const cards = loadCards();
    const progress = readJson(PROGRESS, {});
    const deckFilter = url.searchParams.get("deck");
    const filtered = deckFilter
      ? cards.filter((c) => String(c.deck).toLowerCase() === deckFilter.toLowerCase())
      : cards;
    const dueToday = filtered.filter((c) => isDue(progress, c.id)).length;
    send(
      res,
      200,
      JSON.stringify({
        cards: filtered,
        progress: progress,
        dueToday: dueToday,
        decks: Array.from(new Set(cards.map((c) => c.deck)))
      }),
      "application/json; charset=utf-8"
    );
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/review") {
    let raw = "";
    req.on("data", (c) => { raw += c; });
    req.on("end", () => {
      let body = {};
      try { body = JSON.parse(raw || "{}"); } catch (e) { body = {}; }
      const id = String(body.id || "");
      const knew = !!body.knew;
      const progress = readJson(PROGRESS, {});
      const prev = progress[id] || { box: 1 };
      const step = nextInterval(prev.box || 1, knew);
      const due = new Date();
      due.setDate(due.getDate() + step.days);
      progress[id] = {
        box: step.box,
        due: due.toISOString(),
        last: new Date().toISOString(),
        knew: knew
      };
      if (!fs.existsSync(DATA)) fs.mkdirSync(DATA);
      fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
      send(res, 200, JSON.stringify(progress[id]), "application/json; charset=utf-8");
    });
    return;
  }
  let file = url.pathname === "/" ? "/index.html" : url.pathname;
  const abs = path.normalize(path.join(ROOT, file));
  if (!abs.startsWith(ROOT)) {
    send(res, 403, "no");
    return;
  }
  fs.readFile(abs, (err, data) => {
    if (err) {
      send(res, 404, "not found");
      return;
    }
    send(res, 200, data, mime(abs));
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log("Flashcards on http://localhost:" + PORT);
  });
}

module.exports = { nextInterval, server, loadCards, isDue };
