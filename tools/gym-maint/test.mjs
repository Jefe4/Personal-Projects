import { test } from "node:test";
import assert from "node:assert/strict";
import { addDays, addEquipment, dueOn, emptyDb, markServiced } from "./lib.mjs";

test("a new machine with no service date is due", () => {
  let db = emptyDb();
  db = addEquipment(db, { id: "TM-01", name: "Treadmill 1", everyDays: 30 });
  const due = dueOn(db, "2026-10-14");
  assert.equal(due.length, 1);
  assert.equal(due[0].id, "TM-01");
});

test("service pushes the next due date by the interval", () => {
  let db = addEquipment(emptyDb(), { id: "DB-04", name: "Dumbbell rack", everyDays: 14 });
  db = markServiced(db, "DB-04", "2026-10-01", "tightened bolts");
  assert.deepEqual(dueOn(db, "2026-10-14"), []);
  const later = dueOn(db, "2026-10-15");
  assert.equal(later.length, 1);
  assert.equal(later[0].due, "2026-10-15");
  assert.equal(addDays("2026-10-01", 14), "2026-10-15");
});

test("refuses a duplicate id and a bad date", () => {
  const db = addEquipment(emptyDb(), { id: "TM-01", name: "Treadmill 1", everyDays: 30 });
  assert.throws(() => addEquipment(db, { id: "TM-01", name: "Again", everyDays: 10 }));
  assert.throws(() => markServiced(db, "TM-01", "10/01/2026", ""));
  assert.throws(() => addEquipment(emptyDb(), { id: "X", name: "Y", everyDays: 0 }));
});
