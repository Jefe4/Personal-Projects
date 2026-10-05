from flask import Flask, render_template
import os
import sqlite3

try:
    import mysql.connector as mysql_connector
except ImportError:
    mysql_connector = None

app = Flask(__name__)

DB_BACKEND = os.environ.get("DB_BACKEND", "sqlite").lower()
SQLITE_PATH = os.environ.get("SQLITE_PATH", os.path.join(os.path.dirname(__file__), "demo.db"))
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_USER = os.environ.get("DB_USER", "your_db_user")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "your_db_password")
DB_NAME = os.environ.get("DB_NAME", "mydb")

ALLOWED_TABLES = [
    "User",
    "Game",
    "Publisher",
    "Genre",
    "Library",
    "Region",
    "Store",
    "Game_Genre",
    "Game_Region",
    "Region_Sale",
]


class QueryError(Exception):
    pass


def get_db_connection():
    if DB_BACKEND == "sqlite":
        if not os.path.exists(SQLITE_PATH):
            print(f"SQLite file missing at {SQLITE_PATH}. Run: python seed_sqlite.py")
            return None
        conn = sqlite3.connect(SQLITE_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    if mysql_connector is None:
        print("mysql-connector-python is not installed.")
        return None
    try:
        return mysql_connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
        )
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None


def run_query(query, params=None):
    conn = get_db_connection()
    if not conn:
        raise QueryError("Error connecting to database")
    cursor = conn.cursor()
    headers, rows = [], []
    try:
        cursor.execute(query, params or [])
        if cursor.description:
            headers = [desc[0] for desc in cursor.description]
        fetched = cursor.fetchall()
        rows = [tuple(row) for row in fetched]
    except Exception as err:
        raise QueryError(str(err)) from err
    finally:
        cursor.close()
        conn.close()
    return headers, rows


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/view_table/<table_name>")
def view_table(table_name):
    if table_name not in ALLOWED_TABLES:
        return "Table not found or not allowed", 404
    try:
        headers, rows = run_query(f"SELECT * FROM {table_name} LIMIT 100")
        return render_template(
            "table_view.html", table_name=table_name, headers=headers, rows=rows, error=None
        )
    except QueryError as err:
        return render_template(
            "table_view.html", table_name=table_name, headers=[], rows=[], error=str(err)
        ), 500


@app.route("/reports/game_details")
def reports_game_details():
    report_title = "Game Details (View)"
    try:
        headers, rows = run_query("SELECT * FROM GameDetailsView LIMIT 100")
        return render_template(
            "table_view.html", table_name=report_title, headers=headers, rows=rows, error=None
        )
    except QueryError as err:
        return render_template(
            "table_view.html",
            table_name=report_title,
            headers=[],
            rows=[],
            error=f"{err}. Create the view or run python seed_sqlite.py.",
        )


@app.route("/reports/user_library_summary")
def reports_user_library_summary():
    report_title = "User Library Summary (View)"
    try:
        headers, rows = run_query("SELECT * FROM UserLibrarySummaryView LIMIT 100")
        return render_template(
            "table_view.html", table_name=report_title, headers=headers, rows=rows, error=None
        )
    except QueryError as err:
        return render_template(
            "table_view.html",
            table_name=report_title,
            headers=[],
            rows=[],
            error=f"{err}. Create the view or run python seed_sqlite.py.",
        )


@app.route("/reports/sales_by_genre_region")
def reports_sales_by_genre_region():
    report_title = "Sales by Genre and Region"
    query = """
        SELECT
            g.Genre_name,
            r.Region_name,
            SUM(rs.Num_Sales) AS TotalSales
        FROM Region_Sale rs
        JOIN Genre g ON rs.Genre_id = g.idGenre
        JOIN Region r ON rs.idRegion = r.idRegion
        GROUP BY g.Genre_name, r.Region_name
        ORDER BY TotalSales DESC
    """
    try:
        headers, rows = run_query(query)
        return render_template(
            "table_view.html", table_name=report_title, headers=headers, rows=rows, error=None
        )
    except QueryError as err:
        return render_template(
            "table_view.html", table_name=report_title, headers=[], rows=[], error=str(err)
        )


@app.route("/reports/sales_concentration")
def reports_sales_concentration():
    report_title = "Sales Concentration by Region"
    try:
        headers, rows = run_query("SELECT * FROM SalesConcentrationView ORDER BY TotalSales DESC")
        return render_template(
            "table_view.html", table_name=report_title, headers=headers, rows=rows, error=None
        )
    except QueryError as err:
        return render_template(
            "table_view.html", table_name=report_title, headers=[], rows=[], error=str(err)
        )


if __name__ == "__main__":
    if DB_BACKEND == "sqlite" and not os.path.exists(SQLITE_PATH):
        from seed_sqlite import seed

        seed(SQLITE_PATH)
    app.run(debug=True)
