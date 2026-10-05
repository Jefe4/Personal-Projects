# Flashcard app

Leitner spaced-repetition for **this repo**. CS cards live in `data/cards.json`. Markets education cards live in `data/decks/markets.json` (definitions and research hygiene, not trade recommendations). Progress is written to `data/progress.json`. Misses fall back to box 1.

## Run

```bash
cd Flashcard_App
npm start
# http://localhost:8080
npm test
```

No extra npm packages are required (Node `http` + `fs`).
