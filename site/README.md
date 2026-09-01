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

Visual language toggle: Briefing vs Editorial (header).

## Gym scan mesh

Place the GLB at `site/public/gym.glb` (about 19MB — Git LFS). Until then `/gym` shows a dark-gym lighting rig and schematic dollhouse (floor letters, yellow DON'T QUIT wall). The file is an interior scan of the gym Jeffrey works in, **not** a 3D paper resume and not ownership of the gym. Written CV text comes only from `content/jeffrey.json`.
