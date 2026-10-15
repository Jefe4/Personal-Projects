# LOCAL-HANDOFF

This file is for a small local model (Gemma or Qwen in Ollama on an M4 Mac) continuing Jeffrey Gomez's recruiter site. Stay on branch `cursor/scroll-recruiter-tools-839d`. That branch is draft pull request https://github.com/Jefe4/Personal-Projects/pull/7. Do not merge it. Do not deploy it. Do not create GitHub repos.

Read the files named below before editing. Paths are from the repository root.

## 1. Repo map

The git root holds older coursework plus two trees this site uses.

Coursework the excerpts quote (do not rewrite these to invent resume facts):

- `Graph/src/Room.java` — FRIEND-BOT maze
- `HashMap/src/Hash_M.java` — movie hash table
- `TCP/Chat/Chat/Server.cpp` — TCP chat
- `Flashcard_App/server.js` — flashcard intervals
- `FinalProject.sql` — game-library schema
- `Library_Books/src/work/BookManagement.java`
- `Java/Linked_List/IntChain.java`
- `KnowledgeGraph/graph.py`
- `sql_project_web_ui/` — Flask table viewer
- `Python/` — small class scripts

### `site/`

Next.js 15 App Router, React 19. Package name `jefe-site` in `site/package.json`.

| Path | Role |
| --- | --- |
| `site/app/page.tsx` | Home. Passes `publicProjects()` into the three layouts. |
| `site/app/layout.tsx` | Fonts, `UiProvider`, `Shell`. |
| `site/app/globals.css` | All visual CSS, including `.scroll-reel` and the three `data-ui` themes. |
| `site/app/projects/page.tsx` | Project index. |
| `site/app/projects/[slug]/page.tsx` | One page per project whose `visibility` is not `"omit"`. |
| `site/app/api/chat/route.ts` | `POST` recruiter chat. |
| `site/app/api/fit/route.ts` | Job-description fit. |
| `site/app/resume/page.tsx` | Printable one-pager. |
| `site/app/gym/page.tsx` | Gym scan. `site/app/3d/page.tsx` redirects here. |
| `site/app/graph/page.tsx` | Provenance graph. |
| `site/app/fit/page.tsx` | Paste a job description. |
| `site/app/founder/page.tsx` | Ops page. Staff, not founder. |
| `site/middleware.ts` | Copies `?ui=` into the `x-jefe-ui` header and the `jefe-ui` cookie. |
| `site/content/jeffrey.json` | Resume facts and the project list. Source of truth. |
| `site/content/excerpts.json` | Generated. Do not edit by hand. |
| `site/scripts/extract-excerpts.mjs` | Writes `excerpts.json` from files in this repo. |
| `site/lib/profile.ts` | `getProfile`, `publicProjects`, `projectBySlug`. |
| `site/lib/scroll-chapters.ts` | Homepage scroll copy. `SCROLL_CHAPTERS`. |
| `site/lib/case-studies.ts` | Problem / built / probe text. `studyFor(slug)`. |
| `site/lib/excerpts.ts` | `excerptFor(slug)` reads `excerpts.json`. |
| `site/lib/retrieve.ts` | Rule-based answers and `HARD_FACTS`. |
| `site/lib/answer-guard.ts` | Post-answer fact guard. |
| `site/lib/webllm.ts` | On-device model id. |
| `site/lib/ui.ts` | `studio` / `spatial` / `editorial`. No ranking. |
| `site/components/Shell.tsx` | Header. Three equal direction buttons. |
| `site/components/UiProvider.tsx` | Saves the direction. Opens the picker on a first visit. |
| `site/components/DirectionPicker.tsx` | Three equal cards. |
| `site/components/home/HomeExperience.tsx` | Picks `StudioHome`, `SpatialHome`, or `EditorialHome`. |
| `site/components/home/ScrollReel.tsx` | Scroll chapters. Used by all three homes. |
| `site/components/home/StudioHome.tsx` | Studio frame around the reel. |
| `site/components/home/SpatialHome.tsx` | Spatial frame. Gym preview. |
| `site/components/home/EditorialHome.tsx` | Editorial frame. |
| `site/components/ChatDock.tsx` | Browser chat. |
| `site/components/projects/CaseStudy.tsx` | Project page body. |
| `site/components/projects/ProjectCard.tsx` | Card on `/projects`. |
| `site/components/CodeExhibit.tsx` | Renders one excerpt. |
| `site/tests/*.test.ts` | Vitest. Node environment. See `site/vitest.config.ts`. |
| `site/public/` | Static files. `gym.glb` is not in this checkout; `/gym` still has a labeled placeholder. |

### `tools/`

Five private-repo tools. They live here because `gh repo create` could not create private repos. Each tool is a folder with `lib.mjs`, `cli.mjs`, `test.mjs`, `package.json`, and `README.md`. No extra npm dependencies. Tests use `node --test`.

| Folder | What `lib.mjs` does |
| --- | --- |
| `tools/esp32-serial-log` | `parseEsp32Log`, `summarizeEsp32Log` |
| `tools/rack-label-check` | `checkLabels`, `parseSlot` |
| `tools/resume-json-check` | `checkResume` against the hard facts |
| `tools/gym-maint` | `addEquipment`, `markServiced`, `dueOn` |
| `tools/port-label-check` | `checkPorts`, `countByMedium` |

These tools are not the ESP32 dispenser firmware. The firmware repo was not readable. See backlog item 4.

## 2. How to run, test, build, and lint

From the repo root, with Node 20 or newer (checked with Node 22):

```bash
cd site
npm install
npm test
npx tsc --noEmit
npm run build
node scripts/extract-excerpts.mjs
```

`site/package.json` has no `lint` script, and the repo has no ESLint config. Do not invent `npm run lint`. Next's `npm run build` prints "Linting and checking validity of types" and fails the build on type errors. `npx tsc --noEmit` is the standalone typecheck.

Run the dev server (leave it running):

```bash
cd site
npm run dev
```

Open http://localhost:3000/?ui=studio — also `?ui=spatial` and `?ui=editorial`.

Production server after a build:

```bash
cd site
npm run build
npm start
```

Tool tests, one directory at a time:

```bash
cd tools/esp32-serial-log && npm test
cd tools/rack-label-check && npm test
cd tools/resume-json-check && npm test
cd tools/gym-maint && npm test
cd tools/port-label-check && npm test
```

Resume fact check (must print `ok`):

```bash
cd tools/resume-json-check
node cli.mjs ../../site/content/jeffrey.json
```

`npm run dev` and `npm run build` both run `node scripts/extract-excerpts.mjs` first (`predev` / `prebuild`). That rewrites `site/content/excerpts.json`. Commit that file when the excerpt inputs change.

## 3. Adding a project page

A project page appears when `site/content/jeffrey.json` has a `projects` entry whose `visibility` is not `"omit"`. `site/app/projects/[slug]/page.tsx` calls `publicProjects()` and `projectBySlug`. You do not add a new route file.

Touch these files, in this order:

1. `site/content/jeffrey.json` — the record.
2. `site/scripts/extract-excerpts.mjs` — only if Jeffrey's own source file is in this repo.
3. `site/lib/case-studies.ts` — `STUDIES[slug]`.
4. `site/lib/scroll-chapters.ts` — one `SCROLL_CHAPTERS` item.
5. `site/lib/retrieve.ts` — one `facts.push` when the question words match, if the chat should mention it.
6. `site/tests/scroll-chapters.test.ts` — an assertion.

Then run:

```bash
cd site
node scripts/extract-excerpts.mjs
npm test
npx tsc --noEmit
npm run build
```

### Excerpt rules

Quote only code that is already in this repository and that Jeffrey wrote. The excerpt script reads a file path relative to the repo root. It does not download anything.

- If the file is not on disk, do not add a `pulls` entry. Do not paste code from the internet, from memory, or from another person's gist.
- Set `sourceComing: true` and `placeholder: true` on the JSON record. Leave `excerptFile` off. Leave `slug` off the scroll chapter so `ScrollReel` does not look up an excerpt.
- Say "In progress, source coming." Name no part, net, model, dataset, chip, or server tool that you did not read in a file.
- `CodeExhibit` hides the GitHub link when `privateRepo` is true. Tools under `tools/` use that flag.
- Missing files become the comment `// source not available in this build` in `excerpts.json`. Do not ship that string as if it were source. Fix the path or remove the pull.

`extract` in `site/scripts/extract-excerpts.mjs` finds the `start` string and keeps `maxLines` lines. If `start` is missing it keeps the top of the file instead. Prefer a real function name so the quote is the function, not the file header.

### Worked example: `rack-label-check`

This project is already wired. Copy this shape. Do not create a second copy of it.

JSON record in `site/content/jeffrey.json` (inside `projects`):

- `slug`: `"rack-label-check"`
- `path`: `"tools/rack-label-check/"`
- `github`: `null` (there is no public repo)
- `visibility`: `"private"`
- `flagship`: `true`
- `privateRepo`: `true`
- `excerptFile`: `"tools/rack-label-check/lib.mjs"`
- `summary`: one plain sentence a recruiter can read

Excerpt pull in `site/scripts/extract-excerpts.mjs`, array `pulls`:

```js
{
  slug: "rack-label-check",
  file: "tools/rack-label-check/lib.mjs",
  start: "export function checkLabels",
  maxLines: 34,
}
```

That `start` string is in `tools/rack-label-check/lib.mjs`. The generated block lands in `site/content/excerpts.json` under the key `rack-label-check`.

Case study: `STUDIES["rack-label-check"]` in `site/lib/case-studies.ts`. Fields used by `CaseStudy`: `problem` (string), `built` (string array), `probe` (string array), `demo` (`null` for this tool), `demoNote` (string).

Scroll chapter in `site/lib/scroll-chapters.ts`:

- `id`: `"rack-label-check"` (also the DOM id `chapter-rack-label-check`)
- `slug`: `"rack-label-check"` so `excerptFor` finds the code
- `href`: `"/projects/rack-label-check"`
- `badge`: `"private repo"`
- `plain`: plain English, no new claims

Test already in `site/tests/scroll-chapters.test.ts`: the id is in the required list, and `badge === "private repo"` chapters count to 5. If you add a sixth private-repo badge, update that count in the same commit.

Page URL after `npm run build`: `/projects/rack-label-check`.

### When there is no source yet

Follow `kicad-board` in the same files. JSON has `sourceComing: true`, `placeholder: true`, `wip: true`, `path: null`, `github: null`, and no `excerptFile`. The scroll chapter has `badge: "In progress, source coming"`, a `placeholder` string, and no `slug`. `site/tests/scroll-chapters.test.ts` checks that those three chapters (`kicad-board`, `tinyml`, `mcp-servers`) have no `slug` and do not contain `#include`, `kicad_pcb`, `def train`, `@modelcontextprotocol`, or `gpio_set`.

## 4. Recruiter chat and fact guardrails

Two paths. Both end in `guardRecruiterAnswer` from `site/lib/answer-guard.ts`.

Rule-based path (always available):

1. `site/components/ChatDock.tsx` sends `POST /api/chat` with `{ messages }`.
2. `site/app/api/chat/route.ts` takes the last user message.
3. `answerFromRetrieval` in `site/lib/retrieve.ts` picks lines from `site/content/jeffrey.json`.
4. If `OPENAI_API_KEY` is set, `maybeOpenAI` may replace that text. If it is unset, the rule-based answer is kept. The site must work with the key unset.
5. `guardRecruiterAnswer` rewrites the reply. The JSON field `flags` lists what was caught.

On-device path (only after the user clicks the load button):

1. `ChatDock` checks `navigator.gpu`. No WebGPU means the rule-based path only.
2. The button calls `CreateMLCEngine` from `@mlc-ai/web-llm` with `WEBLLM_MODEL` in `site/lib/webllm.ts`: `SmolLM2-360M-Instruct-q4f16_1-MLC`.
3. The system prompt is `systemPrompt(retrieveFacts(query))`.
4. The model reply goes through `guardRecruiterAnswer` in the browser before it is shown.
5. If that call throws, the dock falls back to `POST /api/chat`.

The dock starts closed (`useState(false)` in `ChatDock.tsx`). The button label is "Ask about Jeffrey".

Guard flags, and the sentence that replaces a bad claim:

| Flag | Caught claim | Replacement starts with |
| --- | --- | --- |
| `google-employee` | Affirmative Google employment | "I am not a Google employee." |
| `graduated` | A finished college degree | "I have not graduated." |
| `gym-owner` | Owner, founder, or CEO of the gym | "I am not the owner or founder of DMV Iron Gym." |

A denial is allowed ("I am not a Google employee"). Rockville High School, 2019, is a high-school diploma and must stay allowed. Tests: `site/tests/answer-guard.test.ts` and `site/tests/retrieve.test.ts`.

### Hard facts that must never change

These sentences are `HARD_FACTS` in `site/lib/retrieve.ts`. The same facts are enforced by `checkResume` in `tools/resume-json-check/lib.mjs` against `site/content/jeffrey.json`.

- Datacenter Technician at Akkodis, on a Google data center assignment in Leesburg, VA, September 2025 to present. Contractor. Not a Google employee.
- Team Member and Systems Administrator at DMV Iron Gym, Falls Church, July 2024 to present. Staff. Not the owner. The owner is Leo Torres Williams.
- Technical Data Entry Clerk at Westat, Rockville, June 2023 to October 2023.
- Computer science at Frostburg State University, expected June 2027. Still a student. Has not graduated.
- Rockville High School diploma, 2019. That graduation is high school only.
- Lives in Arlington, VA. Bilingual English and Spanish. GitHub user Jefe4.

Also do not claim: Coast Guard or other military service (the gym scan seal is wall decor), a completed bachelor's degree, gym founder or CEO, or that `gym.glb` is a 3D résumé. `doNotClaim` in `site/content/jeffrey.json` lists these. The system prompt also says not to mention interview overlays, screen or audio capture, JefeAi, or a different person named Jeffrey G. Gomez.

If a question is not in the facts, the prompt tells the model to say: "That is not covered in the resume materials."

## 5. UI directions stay equal

The only directions are `studio`, `spatial`, and `editorial`, declared in `site/lib/ui.ts` as `UI_DIRECTIONS`. Do not add a fourth direction. Do not make one the default preference.

- `site/components/Shell.tsx` renders the three buttons in one `role="group"` with equal grid columns (`.ui-switch.directions` in `site/app/globals.css` is `repeat(3, minmax(4.7rem, 1fr))`).
- `HomeExperience` shows `SpatialHome`, `EditorialHome`, or `StudioHome`. Each one renders the same `ScrollReel`.
- A first visit with no `?ui=`, no `localStorage` key `jefe-ui`, no legacy `jefe-theme=editorial`, and no session key `jefe-ui-defer` shows `DirectionPicker`. "Look around first" sets `jefe-ui-defer` and saves nothing.
- Until a choice is saved, `UiProvider` paints Studio behind the picker. That is a starting surface, not a chosen default. Do not skip the picker or write `jefe-ui` on load.
- `?ui=studio`, `?ui=spatial`, or `?ui=editorial` selects that direction and saves it (`middleware.ts` plus `writePref` in `UiProvider.tsx`).
- Spatial forces the dark scheme. Studio and Editorial use Light / Dark (`jefe-scheme`).
- Below 800px, and when `prefers-reduced-motion` is set, `ScrollReel` stacks every chapter instead of pinning one. Do not remove that. The class hook is `data-stacked` and the CSS is in `site/app/globals.css`.

## 6. Backlog

Do these one at a time. After each, run the site test, typecheck, and build from section 2. Leave the pull request as a draft.

1. KiCad board, source coming. Files: `kicad-board` in `site/content/jeffrey.json`, `site/lib/scroll-chapters.ts`, and `site/lib/case-studies.ts`. Acceptance: when a `.kicad_sch` or `.kicad_pcb` file exists in this repo or in a Jefe4 repo you can actually read, add an excerpt pull whose `file` path exists on disk, show that excerpt, and change the scroll test so this id is no longer a "source coming" chapter with no slug. Until that file exists, keep the current card. Do not draw a schematic.

2. TinyML, source coming. Same three files, id `tinyml`. Acceptance: an excerpt only from training or inference code you opened in this checkout. The page must not name a model, dataset, or chip that is not in that file. Until then, keep "In progress, source coming."

3. MCP servers, source coming. Same three files, id `mcp-servers`. Acceptance: an excerpt only from server source you opened. Do not list tools that are not in that file. Until then, keep the current card.

4. ESP32 dispenser firmware placeholder. Id `esp32-firmware`. The unread repo is `Jefe4/husky-watchdog-firmware`, branch `firmware/dispense-fsm`. Acceptance: if you can read that branch, quote a real function in an excerpt pull and delete the placeholder wording. If GitHub still returns 404, leave the placeholder. Do not treat `tools/esp32-serial-log` as the firmware.

5. Novum. Id `novum` in the same three files. It is a local-first Mac AI harness (a coding agent plus local model training) and it is work in progress. Acceptance: quote Novum source only after the files are in the checkout. No public URL. No claim that it has shipped.

6. Move the five `tools/` folders to private GitHub repos later. Acceptance: `gh repo create Jefe4/<folder> --private` succeeds for each name (`esp32-serial-log`, `rack-label-check`, `resume-json-check`, `gym-maint`, `port-label-check`), the tool files are pushed there, and the site still says "private repo". If create fails, leave the folders in this repo. Never pass `--public`. Never use `npm publish`.

7. Keep the fact checks green when you edit copy. Acceptance: `cd tools/resume-json-check && node cli.mjs ../../site/content/jeffrey.json` prints `ok`, and `cd site && npm test` still passes `answer-guard.test.ts` and `retrieve.test.ts`.

## 7. Do-not rules

- Do not fabricate employers, dates, degrees, skills, schematics, models, datasets, or server tools.
- Do not say Jeffrey is a Google employee, that he graduated from Frostburg, or that he owns or founded DMV Iron Gym.
- Do not merge the pull request. Do not deploy. Do not run a production host setup.
- Do not create a GitHub repo. If a later task says to try a private repo and the command fails, stop. Do not create a public repo.
- Do not move or rename `tools/`.
- Do not add a fourth UI direction or preselect Studio, Spatial, or Editorial.
- Do not edit `site/content/excerpts.json` by hand. Run `node scripts/extract-excerpts.mjs`.
- Do not paste code from the internet into a chapter, a case study, or an excerpt.
- Do not mention interview overlays, screen or audio capture, or JefeAi on the site.
