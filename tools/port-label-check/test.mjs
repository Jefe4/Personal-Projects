import { test } from "node:test";
import assert from "node:assert/strict";
import { checkPorts, countByMedium } from "./lib.mjs";

test("accepts copper and fiber drops and counts them", () => {
  const text = "SW-A12:24 copper RK-03-U40-NIC1\nSW-A12:25 fiber RK-03-U40-NIC2\n";
  const result = checkPorts(text);
  assert.equal(result.ok, true);
  assert.deepEqual(countByMedium(result.drops), { copper: 1, fiber: 1 });
});

test("rejects port 0, port 49, a duplicate port, and a duplicate far end", () => {
  const text = ["SW-A12:0 copper RK-1", "SW-A12:49 fiber RK-2", "SW-B1:3 copper RK-3", "SW-B1:3 fiber RK-3"].join("\n");
  const codes = checkPorts(text).issues.map((issue) => issue.code);
  assert.ok(codes.includes("port-range"));
  assert.ok(codes.includes("duplicate-port"));
  assert.ok(codes.includes("duplicate-far-end"));
});

test("rejects a line with no medium", () => {
  const result = checkPorts("SW-A12:1 RK-03-U40-NIC1");
  assert.equal(result.ok, false);
  assert.equal(result.issues[0].code, "format");
});
