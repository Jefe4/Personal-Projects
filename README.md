# Personal Projects — Jeffrey Gomez

Java, Python, C++, and SQL work, plus a recruiter site in `site/`.

**Site:** from `site/` run `npm install && npm run dev`. Production: Vercel, root directory `site`.

I am a datacenter technician (Akkodis, Google data center assignment in Leesburg) and a CS student at Frostburg State University (expected June 2027), based in Arlington / DC metro. Public proof of code is this repository.

## Flagship

| Folder | Language | What | Run |
| --- | --- | --- | --- |
| [`Graph/`](Graph/) | Java | Room labyrinth, FRIEND-BOT expensive-first DFS, cheapest-fuel path | `cd Graph && javac -d out src/*.java && java -cp out Room` |
| [`HashMap/`](HashMap/) | Java | Linear-probing movie catalog + collision stats | `cd HashMap && javac -d out src/*.java && java -cp out Main_class` |
| [`TCP/Chat/Chat/`](TCP/Chat/Chat/) | C++ | Multi-client newline-framed chat | `cd TCP/Chat/Chat && make && ./chat_server` |
| [`Flashcard_App/`](Flashcard_App/) | JS | Study deck for this repo, spaced boxes | `cd Flashcard_App && npm start` |
| [`FinalProject.sql`](FinalProject.sql) + [`sql_project_web_ui/`](sql_project_web_ui/) | SQL / Flask | Game library schema + table UI | see `sql_project_web_ui/README.md` |
| [`Library_Books/`](Library_Books/) | Java | File-backed book list | `cd Library_Books && javac -d out src/work/*.java && java -cp out work.BookManagementSystem` |
| [`Java/Linked_List/`](Java/Linked_List/) | Java | Integer chain: contains / swap / insert | `cd Java/Linked_List && javac -d out *.java && java -ea -cp out IntChainTest` |
| [`KnowledgeGraph/`](KnowledgeGraph/) | Python | Provenance graph | `python3 KnowledgeGraph/graph.py` |

Tests: `Graph` `RoomTest`, `HashMap` `Hash_MTest`, `Java/Linked_List` `IntChainTest`, `Library_Books` `BookTest`, `Flashcard_App` `npm test`, `site` `npm test`.

## Also in the tree

- `Java/Lab2`, `Lab3`, `Lab5`, `ArrayList` — class labs. Kept, not headlined.
- `Python/` — small utilities (`pass_gen.py` and friends).
- `Java/ArrayList/SimpleKNNClassifier.java` — later overlay; the original `TwoInput` word-distance program is the personal one.

## Site extras

Recruiter chat, job-fit paste, knowledge graph, gym photogrammetry scan at `/gym`, printable `/resume`, operator page at `/founder` (gym **staff** + datacenter — not founder/CEO).
