"use client";

import { useMemo, useState } from "react";
import { KnowledgeGraphView } from "@/components/KnowledgeGraphView";
import {
  containsWalk,
  findBooks,
  LIST_CHAIN,
  nextInterval,
  SEED_BOOKS,
  SQL_TABLES,
  STUDY_CARDS,
  type ShelfBook,
} from "@/lib/interactive";

export function FlashcardDemo() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [box, setBox] = useState(1);
  const [days, setDays] = useState(0);
  const card = STUDY_CARDS[index % STUDY_CARDS.length];

  function grade(knew: boolean) {
    const step = nextInterval(box, knew);
    setBox(step.box);
    setDays(step.days);
    setFlipped(false);
    setIndex((n) => n + 1);
  }

  return (
    <div className="demo">
      <div className="box-meter" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n === box ? "on" : ""}>
            Box {n}
          </span>
        ))}
      </div>
      <button type="button" className="flash-face" onClick={() => setFlipped((f) => !f)}>
        <span className="mono">{flipped ? "Back" : "Front"} · tap to flip</span>
        <strong>{flipped ? card.back : card.front}</strong>
      </button>
      <div className="demo-bar">
        <button type="button" onClick={() => grade(false)}>
          Missed it
        </button>
        <button type="button" onClick={() => grade(true)}>
          Knew it
        </button>
        <p className="mono">
          Current box {box}
          {days ? ` · next wait ${days} day${days === 1 ? "" : "s"}` : " · due now"}
        </p>
      </div>
    </div>
  );
}

type Peer = { nick: string };
type Line = { from: string; text: string };

export function TcpDemo() {
  const [peers, setPeers] = useState<Peer[]>([{ nick: "Jefe" }, { nick: "floor" }]);
  const [speaker, setSpeaker] = useState("Jefe");
  const [text, setText] = useState("");
  const [log, setLog] = useState<Line[]>([{ from: "server", text: "listen 1234 · select() waiting on the listen socket" }]);

  function push(from: string, line: string) {
    setLog((prev) => [...prev, { from, text: line }]);
  }

  function send(raw: string) {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith("/nick ")) {
      const nick = line.slice(6).trim() || speaker;
      setPeers((list) => list.map((p) => (p.nick === speaker ? { nick } : p)));
      setSpeaker(nick);
      push("server", `${speaker} is now ${nick}`);
    } else if (line === "/who") {
      push("server", `online (${peers.length}): ${peers.map((p) => p.nick).join(" ")}`);
    } else if (line === "/quit") {
      setPeers((list) => list.filter((p) => p.nick !== speaker));
      push("server", `${speaker} quit`);
      const left = peers.filter((p) => p.nick !== speaker);
      if (left[0]) setSpeaker(left[0].nick);
    } else {
      peers
        .filter((p) => p.nick !== speaker)
        .forEach((p) => push(p.nick, `${speaker}: ${line}`));
      push(speaker, line);
    }
    setText("");
  }

  return (
    <div className="demo">
      <div className="demo-bar">
        <label className="mono">
          Speaking as{" "}
          <select value={speaker} onChange={(e) => setSpeaker(e.target.value)} aria-label="Which local peer is typing">
            {peers.map((p) => (
              <option key={p.nick}>{p.nick}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => send("/who")}>
          /who
        </button>
        <button type="button" onClick={() => send("/quit")}>
          /quit
        </button>
      </div>
      <div className="chat-log demo-log" aria-live="polite">
        {log.map((line, i) => (
          <div key={i} className="bubble">
            <span className="mono">{line.from}</span> {line.text}
          </div>
        ))}
      </div>
      <form
        className="demo-bar"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="A line, or /nick NAME"
          aria-label="Chat line"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export function LibraryDemo() {
  const [books, setBooks] = useState<ShelfBook[]>(SEED_BOOKS);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("2020");
  const hits = useMemo(() => findBooks(books, q), [books, q]);

  return (
    <div className="demo">
      <label className="mono">
        Search{" "}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title or author" aria-label="Search the shelf" />
      </label>
      <ul className="shelf">
        {hits.map((b) => (
          <li key={b.title}>
            <strong>{b.title}</strong>
            <span className="muted">
              {" "}
              {b.author}, {b.year}
            </span>
          </li>
        ))}
        {hits.length === 0 ? <li className="muted">No title matched.</li> : null}
      </ul>
      <form
        className="demo-bar"
        onSubmit={(e) => {
          e.preventDefault();
          const name = title.trim();
          if (!name) return;
          if (books.some((b) => b.title.toLowerCase() === name.toLowerCase())) return;
          setBooks((list) => [...list, { title: name, author: author.trim() || "Unknown", year: Number(year) || 0 }]);
          setTitle("");
          setAuthor("");
        }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" aria-label="Title" />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" aria-label="Author" />
        <input value={year} onChange={(e) => setYear(e.target.value)} aria-label="Year" inputMode="numeric" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export function ListDemo() {
  const [target, setTarget] = useState(2);
  const seen = containsWalk(LIST_CHAIN, target);
  const found = LIST_CHAIN[seen[seen.length - 1]] === target;
  return (
    <div className="demo">
      <div className="chain" aria-label="Integer chain">
        {LIST_CHAIN.map((n, i) => (
          <span key={n} className={seen.includes(i) ? "on" : ""}>
            {n}
            {i < LIST_CHAIN.length - 1 ? <i> → </i> : null}
          </span>
        ))}
      </div>
      <div className="demo-bar">
        {LIST_CHAIN.map((n) => (
          <button key={n} type="button" aria-pressed={target === n} onClick={() => setTarget(n)}>
            contains {n}
          </button>
        ))}
        <button type="button" aria-pressed={target === 5} onClick={() => setTarget(5)}>
          contains 5
        </button>
      </div>
      <p className="mono">
        Walked {seen.length} node{seen.length === 1 ? "" : "s"}. {found ? "True." : "False. Reached null."}
      </p>
    </div>
  );
}

export function SqlDemo() {
  const [name, setName] = useState(SQL_TABLES[1].name);
  const table = SQL_TABLES.find((t) => t.name === name) || SQL_TABLES[0];
  return (
    <div className="demo">
      <div className="chips">
        {SQL_TABLES.map((t) => (
          <button key={t.name} type="button" aria-pressed={t.name === name} onClick={() => setName(t.name)}>
            {t.name}
          </button>
        ))}
      </div>
      <article className="job-panel">
        <h3>mydb.{table.name}</h3>
        <p>{table.keys}</p>
        <p className="muted">{table.links}</p>
      </article>
    </div>
  );
}

export function KnowledgeDemo() {
  return (
    <div className="demo">
      <KnowledgeGraphView />
      <p>
        <a href="/graph">Open the full graph</a>
      </p>
    </div>
  );
}
