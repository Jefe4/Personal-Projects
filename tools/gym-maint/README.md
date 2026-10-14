# Gym equipment maintenance tracker

Private command-line tracker for gym-floor equipment. It keeps a JSON file on disk: an id, a name, how many days between service, the last service date, and a note.

A machine is due when it has never been serviced, or when the last service date plus the interval is on or before the day you ask about.

This is a staff checklist. It does not say who owns the gym.

## Run

```bash
node cli.mjs add --file maint.json --id TM-01 --name "Treadmill 1" --every 30
node cli.mjs service --file maint.json --id TM-01 --on 2026-10-01 --note "belt tension"
node cli.mjs due --file maint.json --on 2026-10-14
node cli.mjs list --file maint.json
```

`due` exits 1 when something is due, so a morning check can fail a script on purpose.

## Test

```bash
npm test
```
