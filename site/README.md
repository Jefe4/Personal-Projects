# Resume site (`site/`)

Next.js App Router site for Jeffrey Gomez. Recruiter briefing at `/`. Chat dock works **without** `OPENAI_API_KEY` (retrieval from `content/jeffrey.json`). Facts come from the Aug 27 2026 resume + LinkedIn export — not from older files that claimed a 2023/2024 graduation or gym ownership.

## Run locally

```bash
cd site
npm install
npm test
npm run dev
```

Open http://localhost:3000

## Production (Vercel)

Import `https://github.com/Jefe4/Personal-Projects`, set **Root Directory** to `site`. Optional env: `OPENAI_API_KEY` (chat still works if unset). Do not require Origin.

GitHub Pages can host a static export of marketing pages only; the chat API needs a Node host (Vercel).

## Routes

| Path | What |
| --- | --- |
| `/` | Recruiter briefing, live code excerpts |
| `/founder` | Operator narrative: gym **staff** + datacenter tech (not founder) |
| `/projects`, `/projects/[slug]` | Repo projects + WIP labels |
| `/fit` | Paste a JD → must / stretch / missing |
| `/graph` | Provenance graph |
| `/gym` | Photogrammetry scan of DMV Iron Gym (not a resume). `/3d` redirects here. |
| `/resume` | Printable one-pager from jeffrey.json |

## UI directions

Three live layouts share `content/jeffrey.json`. They have equal weight in the header: Studio, Spatial, Editorial. None of them is the only site.

A first visit with no saved choice opens a short picker. Choosing one writes `localStorage` (`jefe-ui`) and a `jefe-ui` cookie, and puts `?ui=` on the URL so the page can be shared. “Look around first” does not save a direction. A link with `?ui=studio`, `?ui=spatial`, or `?ui=editorial` opens that direction and remembers it.

| Direction | URL | What you should notice |
| --- | --- | --- |
| Studio | `/?ui=studio` | Large type, sticky section titles, light or dark, project cards that lift on hover |
| Spatial | `/?ui=spatial` | Dark glass, a live preview of the `/gym` scan, projects as a shelf |
| Editorial | `/?ui=editorial` | Paper grid, numbered sections, serif headlines, long case studies |

Until a direction is saved, the canvas behind the picker is Studio. That is only a starting surface. Studio and Editorial also have Light / Dark (`jefe-scheme`). Spatial stays dark. `prefers-reduced-motion` turns off the scroll progress spring, card springs, autoplay, scroll reveals, and the gym orbit.

Project pages (`/projects/[slug]`) scroll through Problem, What I built, Stack, a code excerpt from this repo when one exists, an interactive model (graph fuel, hash probe, flashcard boxes, TCP commands, library shelf, linked-list walk, SQL tables, provenance graph, or the gym scan), how to run it, and related work. WIP items stay labeled and do not grow a fake demo.

For Jeffrey: open `/`, `/projects/graph`, and `/gym` in each direction before picking one. Facts are still the Aug 27 resume. The chat dock stays on every page.

## Gym scan mesh

Place the GLB at `site/public/gym.glb` (about 19MB — Git LFS). Until then `/gym` shows a dark-gym lighting rig and schematic dollhouse (floor letters, yellow DON'T QUIT wall). The file is an interior scan of the gym Jeffrey works in, **not** a 3D paper resume and not ownership of the gym. Written CV text comes only from `content/jeffrey.json`.
