#!/usr/bin/env node
import fs from "node:fs";
import { checkPorts, countByMedium } from "./lib.mjs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node cli.mjs <drops.txt>");
  process.exit(2);
}

const result = checkPorts(fs.readFileSync(file, "utf8"));
console.log(JSON.stringify({ ...result, counts: countByMedium(result.drops) }, null, 2));
if (!result.ok) process.exitCode = 1;
