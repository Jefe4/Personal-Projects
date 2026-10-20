import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

it("ships an app icon so browsers don't 404 on the favicon", () => {
  expect(existsSync(join(__dirname, "..", "app", "icon.svg"))).toBe(true);
});
