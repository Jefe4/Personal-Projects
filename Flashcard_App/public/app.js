const meta = document.getElementById("meta");
const cardEl = document.getElementById("card");
const empty = document.getElementById("empty");
const deck = document.getElementById("deck");
const prompt = document.getElementById("prompt");
const answer = document.getElementById("answer");
const flip = document.getElementById("flip");
const miss = document.getElementById("miss");
const got = document.getElementById("got");
const deckFilter = document.getElementById("deckFilter");

let queue = [];
let current = null;
let allDecks = [];

function due(progress, id) {
  const p = progress[id];
  if (!p || !p.due) return true;
  return new Date(p.due).getTime() <= Date.now();
}

function show(card) {
  current = card;
  deck.textContent = card.deck;
  prompt.textContent = card.front;
  answer.textContent = card.back;
  answer.hidden = true;
  miss.hidden = true;
  got.hidden = true;
  flip.hidden = false;
  cardEl.hidden = false;
  empty.hidden = true;
}

function next() {
  current = queue.shift();
  if (!current) {
    cardEl.hidden = true;
    empty.hidden = false;
    return;
  }
  show(current);
}

flip.addEventListener("click", () => {
  answer.hidden = false;
  miss.hidden = false;
  got.hidden = false;
  flip.hidden = true;
});

async function review(knew) {
  if (!current) return;
  await fetch("/api/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: current.id, knew: knew })
  });
  next();
}
miss.addEventListener("click", () => review(false));
got.addEventListener("click", () => review(true));

function load(deckName) {
  const q = deckName ? "?deck=" + encodeURIComponent(deckName) : "";
  return fetch("/api/deck" + q)
    .then((r) => r.json())
    .then((data) => {
      const cards = data.cards || [];
      const progress = data.progress || {};
      allDecks = data.decks || [];
      if (deckFilter.options.length <= 1) {
        allDecks.forEach((name) => {
          const opt = document.createElement("option");
          opt.value = name;
          opt.textContent = name;
          deckFilter.appendChild(opt);
        });
      }
      queue = cards.filter((c) => due(progress, c.id));
      if (queue.length === 0) queue = cards.slice();
      const dueToday = typeof data.dueToday === "number" ? data.dueToday : queue.length;
      meta.textContent = dueToday + " due today · " + queue.length + " in this session · " + cards.length + " in view";
      next();
    })
    .catch((err) => {
      meta.textContent = "Could not load deck. Is the server running?";
      console.error(err);
    });
}

deckFilter.addEventListener("change", () => load(deckFilter.value));
load("");
