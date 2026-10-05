# Personal Projects Showcase

Java, Python, C++, SQL, and a small flashcard app. This is a **coursework and learning** repo. It is **not** a trading platform, broker integration, or source of investment advice.

## Quant literacy path (paper research)

Synthetic bars only. No live orders.

1. [Python/ml_math_toolkit.py](Python/ml_math_toolkit.py) — returns, z-score, Sharpe, drawdown, costs, educational Kelly.
2. [Python/paper_research_demo.py](Python/paper_research_demo.py) — always-long vs a toy rule, with costs and walk-forward.
3. [Java/ArrayList/src/SimpleKNNClassifier.java](Java/ArrayList/src/SimpleKNNClassifier.java) — chronological k-NN on [knn_regime.csv](Java/ArrayList/src/knn_regime.csv) (train-only z-score).
4. [TCP/Chat/Chat/](TCP/Chat/Chat/) — mock `score_features` / `risk_check` sidecar with a stable JSON schema.
5. [sql_project_web_ui/](sql_project_web_ui/) — sales reports and concentration views (same grouping idea as a P&L book). SQLite demo: `python seed_sqlite.py` then `flask --app app run`.
6. [Flashcard_App/](Flashcard_App/) — Leitner SRS. CS cards plus a Markets education deck (vocabulary, not signals).

## Other projects

| Path | Status |
| --- | --- |
| `Graph/` | Partial DFS / friend-bot lab |
| `HashMap/` | Incomplete custom hash map |
| `Library_Books/` | Console book list |
| `Java/Lab2`–`Lab5`, `Linked_List` | Course labs |
| `FinalProject.sql` | Game-library schema + views |

## Disclaimer

Software in this repository cannot make you money in markets. Beginner backtests are usually overfit, ignore costs, or leak the future. Use these files to learn measurement and programming, not to trade.

## License

Provided as-is. Third-party libraries keep their own licenses.
