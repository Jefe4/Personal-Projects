# Knowledge graph (provenance demo)

A tiny graph Jeffrey can actually explain: nodes + labeled edges, and every edge remembers where it came from (a resume line or a file in this repo).

It is not a cloned NetworkX tutorial and not a generic “AI engineer” knowledge base.

## Run

```bash
cd KnowledgeGraph
python3 graph.py
python3 -m unittest test_graph.py
```

If `site/content/jeffrey.json` exists, that file is the resume half of the graph. Repo examples (FRIEND-BOT rooms, Hash_M movies, library books) are always mixed in.

Author: Jeffrey Gomez
