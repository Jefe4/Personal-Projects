# Flashcard app

Study deck for **this repo**. Cards live in `data/cards.json` (graph fuel, linear probing, TCP framing, SQL keys, list walks). Progress is written to `data/progress.json`. Misses fall back to box 1; hits stretch the next due date.

The original commit had axios, a VS Code launch config on port 8080, and no app source. This is that missing game.

## Run

```bash
cd Flashcard_App
npm start
# http://localhost:8080
npm test
```

No extra npm packages required for the server (Node `http` + `fs`). Axios stays in package.json because it was already here.

Author: Jeffrey Gomez
