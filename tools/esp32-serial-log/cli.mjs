#!/usr/bin/env node
import fs from "node:fs";
import { parseEsp32Log, summarizeEsp32Log } from "./lib.mjs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node cli.mjs <serial-log.txt>");
  process.exit(2);
}

const events = parseEsp32Log(fs.readFileSync(file, "utf8"));
const summary = summarizeEsp32Log(events);
console.log(JSON.stringify({ summary, events }, null, 2));
if (summary.errors > 0) process.exitCode = 1;
