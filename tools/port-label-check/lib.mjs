/**
 * Copper / fiber drop-label checker.
 * One drop per line:
 *   SW-A12:24 copper RK-03-U40-NIC1
 *   SW-A12:25 fiber RK-03-U40-NIC2
 *
 * Switch name, port 1-48, medium (copper or fiber), and the far-end label.
 * A switch port cannot be used twice. The far end cannot be used twice.
 */

const LINE = /^(SW-[A-Z0-9]+):(\d+)\s+(copper|fiber)\s+([A-Z0-9][A-Z0-9-]*)$/i;

export function checkPorts(text) {
  const issues = [];
  const seenPort = new Map();
  const seenFar = new Map();
  const drops = [];
  const lines = String(text).split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw || raw.startsWith("#")) continue;
    const line = i + 1;
    const match = raw.match(LINE);
    if (!match) {
      issues.push({ line, code: "format", detail: raw });
      continue;
    }
    const sw = match[1].toUpperCase();
    const port = Number(match[2]);
    const medium = match[3].toLowerCase();
    const far = match[4].toUpperCase();
    const key = `${sw}:${port}`;

    if (port < 1 || port > 48) issues.push({ line, code: "port-range", detail: String(port) });
    if (seenPort.has(key)) issues.push({ line, code: "duplicate-port", detail: `${key} also on line ${seenPort.get(key)}` });
    else seenPort.set(key, line);
    if (seenFar.has(far)) issues.push({ line, code: "duplicate-far-end", detail: `${far} also on line ${seenFar.get(far)}` });
    else seenFar.set(far, line);

    drops.push({ line, switch: sw, port, medium, far });
  }

  return { ok: issues.length === 0, drops, issues };
}

export function countByMedium(drops) {
  return drops.reduce(
    (counts, drop) => {
      counts[drop.medium] += 1;
      return counts;
    },
    { copper: 0, fiber: 0 },
  );
}
