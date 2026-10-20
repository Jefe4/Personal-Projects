#!/usr/bin/env node
import fs from "node:fs";
import { checkLabels } from "./lib.mjs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node cli.mjs <labels.txt>");
  process.exit(2);
}

const result = checkLabels(fs.readFileSync(file, "utf8"));
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
