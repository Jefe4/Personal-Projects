import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkResume } from "./lib.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));

function base() {
  return {
    identity: {
      location: "Arlington, Virginia / DC metro",
      languages: ["English", "Spanish"],
      github: "https://github.com/Jefe4",
    },
    doNotClaim: [
      "owner, founder, or CEO of DMV Iron Gym",
      "Google employee / Google FTE",
      "completed bachelor's degree",
    ],
    experience: [
      {
        org: "Akkodis",
        title: "Datacenter Technician",
        assignment: "On assignment at a Google data center (contractor via Akkodis, not a Google FTE)",
        location: "Leesburg, VA",
        start: "Sep 2025",
        end: "Present",
      },
      {
        org: "DMV Iron Gym Inc",
        title: "Team Member & Systems Administrator",
        titleNote: "Not owner, founder, or CEO.",
        owner: "Leo Torres Williams (founder/CEO). Jeffrey is staff, not a documented veteran.",
        location: "Falls Church, VA",
        start: "Jul 2024",
        end: "Present",
      },
      {
        org: "Westat",
        title: "Technical Data Entry Clerk",
        location: "Rockville, MD",
        start: "Jun 2023",
        end: "Oct 2023",
      },
    ],
    education: [
      { school: "Frostburg State University", status: "enrolled", expected: "Jun 2027", line: "expected June 2027" },
      { school: "Rockville High School", graduated: "Jun 2019" },
    ],
  };
}

test("the site resume file passes", () => {
  const file = path.join(here, "../../site/content/jeffrey.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = checkResume(data);
  assert.deepEqual(result.errors, []);
  assert.equal(result.ok, true);
});

test("rejects a Google-employee title, a conferred degree, and an owner title", () => {
  const data = base();
  data.experience[0].title = "Google employee";
  data.experience[0].assignment = "Works at Google";
  data.experience[1].title = "Owner";
  data.experience[1].owner = "";
  data.experience[1].titleNote = "";
  data.education[0].status = "graduated";
  data.education[0].expected = "May 2024";
  const result = checkResume(data);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => /google/i.test(error)));
  assert.ok(result.errors.some((error) => /owner/i.test(error)));
  assert.ok(result.errors.some((error) => /frostburg/i.test(error)));
});
