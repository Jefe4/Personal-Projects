#!/usr/bin/env node
import fs from "node:fs";
import { checkResume } from "./lib.mjs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node cli.mjs <resume.json>");
  process.exit(2);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}

const result = checkResume(data);
if (result.ok) console.log("ok");
else {
  for (const error of result.errors) console.error(error);
}
if (!result.ok) process.exitCode = 1;
