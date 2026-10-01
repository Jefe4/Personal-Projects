import { describe, expect, it } from "vitest";
import { allStudyText } from "../lib/case-studies";
import { cheapestPath, friendBot, nextInterval, ProbeTable } from "../lib/interactive";

describe("FRIEND-BOT matches Room.java rules", () => {
  it("hunts room 11 by the expensive door and charges 66 L", () => {
    const walk = friendBot(0, 11);
    expect(walk.order).toEqual([0, 1, 2, 6, 4, 5, 7, 9, 10, 11]);
    expect(walk.fuel).toBe(66);
    expect(walk.found).toBe(true);
  });

  it("cheapest fuel from 0 to 11 is 18 L via 0-1-7-10-11", () => {
    const path = cheapestPath(0, 11);
    expect(path.fuel).toBe(18);
    expect(path.rooms).toEqual([0, 1, 7, 10, 11]);
  });
});

describe("flashcard intervals match server.js", () => {
  it("misses reset, hits climb to a 14-day cap", () => {
    expect(nextInterval(3, false)).toEqual({ box: 1, days: 0 });
    expect(nextInterval(1, true)).toEqual({ box: 2, days: 1 });
    expect(nextInterval(2, true)).toEqual({ box: 3, days: 3 });
    expect(nextInterval(3, true)).toEqual({ box: 4, days: 7 });
    expect(nextInterval(4, true)).toEqual({ box: 5, days: 14 });
    expect(nextInterval(5, true)).toEqual({ box: 5, days: 14 });
  });
});

describe("linear probe keeps walking after a tombstone", () => {
  it("finds a later key after the home slot is deleted", () => {
    const table = new ProbeTable(5);
    const home = table.hash("alpha");
    let other = "beta";
    let guard = 0;
    while (table.hash(other) !== home && guard < 200) {
      other = "beta" + guard;
      guard++;
    }
    expect(table.hash(other)).toBe(home);
    table.put("alpha", "one");
    table.put(other, "two");
    expect(table.collisions).toBeGreaterThan(0);
    table.remove("alpha");
    const found = table.get(other);
    expect(found.value).toBe("two");
    expect(found.trace.probes.length).toBeGreaterThan(1);
    expect(table.table[home]).toBe("DEFUNCT");
  });
});

describe("case-study copy stays recruiter-safe", () => {
  const text = allStudyText();
  const lower = text.toLowerCase();

  it("does not claim gym ownership, a hedge fund, or the wrong email", () => {
    expect(lower).not.toMatch(/i am the (owner|founder|ceo)/);
    expect(lower).not.toContain("jeffgomez.dev");
    expect(lower).not.toContain("hedge fund");
    expect(lower).toContain("not a job, not a fund");
    expect(lower).toContain("not the owner");
  });

  it("describes the real graph and hash mechanisms", () => {
    expect(lower).toContain("adjacency matrix");
    expect(lower).toContain("linear probing");
  });
});
