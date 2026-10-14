# Resume JSON checker

Private tool. It reads a resume JSON file and checks the facts the recruiter site is allowed to say:

- Datacenter Technician at Akkodis, Leesburg VA, Sep 2025 to present, contractor on a Google data center assignment, not a Google employee.
- Team Member and Systems Administrator at DMV Iron Gym, Falls Church, Jul 2024 to present. Staff. The owner named in the file is Leo Torres Williams.
- Technical Data Entry Clerk at Westat, Rockville, Jun 2023 to Oct 2023.
- Frostburg State computer science, status enrolled, expected 2027. Not graduated.
- Rockville High School diploma in 2019.
- Lives in Arlington. English and Spanish. GitHub `Jefe4`.

## Run

```bash
node cli.mjs ../../site/content/jeffrey.json
```

## Test

```bash
npm test
```
