/**
 * ESP32 serial-monitor parser.
 * Understands ROM reset lines and ESP-IDF log lines:
 *   I (1234) tag: message
 * State changes look like: state IDLE -> ARM
 */

const IDF = /^(?:\[(\d+)\]\s+)?([IWE])\s+\((\d+)\)\s+([^:]+):\s+(.*)$/;
const RESET = /^rst:0x([0-9a-fA-F]+)\s+\(([^)]+)\)/;
const TRANSITION = /\bstate\s+([A-Za-z0-9_]+)\s*(?:->|→)\s*([A-Za-z0-9_]+)/;

export function parseEsp32Log(text) {
  const events = [];
  const lines = String(text).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const lineNo = i + 1;

    const reset = line.match(RESET);
    if (reset) {
      events.push({ kind: "reset", line: lineNo, code: "0x" + reset[1].toLowerCase(), reason: reset[2] });
      continue;
    }

    if (/^ets\s+/i.test(line) || /^ESP-ROM:/i.test(line)) {
      events.push({ kind: "boot", line: lineNo, message: line });
      continue;
    }

    if (/Guru Meditation Error/i.test(line) || /panic'ed/i.test(line)) {
      events.push({ kind: "panic", line: lineNo, message: line });
      continue;
    }

    const idf = line.match(IDF);
    if (idf) {
      const level = idf[2];
      const message = idf[5];
      const move = message.match(TRANSITION);
      if (move) {
        events.push({
          kind: "transition",
          line: lineNo,
          level,
          ms: Number(idf[3]),
          tag: idf[4],
          from: move[1],
          to: move[2],
          message,
        });
        continue;
      }
      events.push({
        kind: level === "E" ? "error" : "log",
        line: lineNo,
        level,
        ms: Number(idf[3]),
        tag: idf[4],
        message,
      });
      continue;
    }
  }
  return events;
}

export function summarizeEsp32Log(events) {
  const transitions = events.filter((e) => e.kind === "transition");
  return {
    resets: events.filter((e) => e.kind === "reset").length,
    boots: events.filter((e) => e.kind === "boot").length,
    errors: events.filter((e) => e.kind === "error" || e.kind === "panic").length,
    transitions,
    lastState: transitions.length ? transitions[transitions.length - 1].to : null,
  };
}
