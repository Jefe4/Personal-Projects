#!/usr/bin/env node
import fs from "node:fs";
import { addEquipment, dueOn, emptyDb, markServiced } from "./lib.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return "";
  return process.argv[index + 1] || "";
}

const command = process.argv[2];
const file = arg("--file");
if (!command || !file || command === "--help") {
  console.error("usage: node cli.mjs <add|service|due|list> --file db.json [--id ID] [--name NAME] [--every DAYS] [--on YYYY-MM-DD] [--note TEXT]");
  process.exit(2);
}

const db = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : emptyDb();

if (command === "add") {
  const next = addEquipment(db, { id: arg("--id"), name: arg("--name"), everyDays: Number(arg("--every")) });
  fs.writeFileSync(file, JSON.stringify(next, null, 2));
  console.log(`added ${arg("--id")}`);
} else if (command === "service") {
  const next = markServiced(db, arg("--id"), arg("--on"), arg("--note"));
  fs.writeFileSync(file, JSON.stringify(next, null, 2));
  console.log(`serviced ${arg("--id")} on ${arg("--on")}`);
} else if (command === "due") {
  const rows = dueOn(db, arg("--on"));
  console.log(JSON.stringify(rows, null, 2));
  if (rows.length) process.exitCode = 1;
} else if (command === "list") {
  console.log(JSON.stringify(db.equipment, null, 2));
} else {
  console.error(`unknown command ${command}`);
  process.exit(2);
}
