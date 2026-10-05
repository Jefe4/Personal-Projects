# SQL project web UI

Flask browser for the game-library schema in `../FinalProject.sql`.

Default backend is **SQLite** so you can demo without MySQL:

```bash
cd sql_project_web_ui
python seed_sqlite.py
python app.py
```

Set `DB_BACKEND=mysql` plus `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` to use MySQL.

Reports:

* GameDetailsView / UserLibrarySummaryView (defined at the bottom of `FinalProject.sql`)
* Sales by genre and region
* SalesConcentrationView — region share of unit sales (same grouping pattern as a simple P&L book)

The game schema is unchanged; the concentration report is an analytics analogy only.
