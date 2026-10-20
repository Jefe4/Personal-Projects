import { test } from "node:test";
import assert from "node:assert/strict";
import { parseEsp32Log, summarizeEsp32Log } from "./lib.mjs";

const SAMPLE = `
ets Jul 29 2019 12:21:46
rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)
I (320) dispense: state IDLE -> ARM
I (880) dispense: state ARM -> DISPENSE
E (901) dispense: overcurrent on channel 2
Guru Meditation Error: Core 0 panic'ed (LoadProhibited)
`.trim();

test("reads reset, transitions, error, and panic", () => {
  const events = parseEsp32Log(SAMPLE);
  assert.equal(events.filter((e) => e.kind === "boot").length, 1);
  const reset = events.find((e) => e.kind === "reset");
  assert.equal(reset.reason, "POWERON_RESET");
  assert.equal(reset.code, "0x1");
  const moves = events.filter((e) => e.kind === "transition");
  assert.deepEqual(
    moves.map((m) => [m.from, m.to]),
    [
      ["IDLE", "ARM"],
      ["ARM", "DISPENSE"],
    ],
  );
  assert.equal(events.filter((e) => e.kind === "error").length, 1);
  assert.equal(events.filter((e) => e.kind === "panic").length, 1);
});

test("summary counts faults and the last state", () => {
  const summary = summarizeEsp32Log(parseEsp32Log(SAMPLE));
  assert.equal(summary.resets, 1);
  assert.equal(summary.errors, 2);
  assert.equal(summary.lastState, "DISPENSE");
  assert.equal(summary.transitions.length, 2);
});

test("ignores blank lines and unrelated text", () => {
  const events = parseEsp32Log("\nhello\n\n");
  assert.deepEqual(events, []);
});
