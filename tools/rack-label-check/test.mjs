import { test } from "node:test";
import assert from "node:assert/strict";
import { checkLabels, parseSlot } from "./lib.mjs";

test("accepts a unique in-range label", () => {
  const result = checkLabels("IAD-H1-A-12-U24 AST-00018421\n");
  assert.equal(result.ok, true);
  assert.equal(result.issues.length, 0);
  assert.deepEqual(parseSlot("IAD-H1-A-12-U24"), { site: "IAD", hall: 1, row: "A", rack: 12, u: 24 });
});

test("rejects a bad slot, a U above 42, and a short asset tag", () => {
  const result = checkLabels("RACK12 AST-12\nIAD-H1-A-12-U99 AST-00018421\n");
  const codes = result.issues.map((issue) => issue.code);
  assert.equal(result.ok, false);
  assert.ok(codes.includes("slot-format"));
  assert.ok(codes.includes("asset-format"));
  assert.ok(codes.includes("u-range"));
});

test("catches a repeated asset tag and a repeated slot", () => {
  const result = checkLabels(
    ["IAD-H1-A-12-U24 AST-00018421", "IAD-H1-A-12-U25 AST-00018421", "IAD-H1-A-12-U24 AST-00018422"].join("\n"),
  );
  const codes = result.issues.map((issue) => issue.code);
  assert.ok(codes.includes("duplicate-asset"));
  assert.ok(codes.includes("duplicate-slot"));
});
