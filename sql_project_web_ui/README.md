# Game library SQL schema + Flask UI

`FinalProject.sql` is a MySQL schema for a game library (`mydb`): users, libraries, games, publishers, genres, regions, stores, junction tables, seed data, and two views (`GameDetailsView`, `UserLibrarySummaryView`).

`SQL Project1.mwb` is the MySQL Workbench model that generated the original script.

`sql_project_web_ui/` is a Flask table/report viewer over that schema.

## Flask UI

```bash
cd sql_project_web_ui
python3 -m pip install -r requirements.txt
export DB_HOST=localhost DB_USER=... DB_PASSWORD=... DB_NAME=mydb
python3 app.py
```

Needs a running MySQL instance loaded with `FinalProject.sql`. Table names are allow-listed in `app.py` before `SELECT`.

Author: Jeffrey Gomez
