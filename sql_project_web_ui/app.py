from flask import Flask, render_template, url_for
import mysql.connector
import os # For environment variables later, if needed

app = Flask(__name__)

# Database configuration (placeholders - will need actual credentials)
# For local development, you might set these directly or use environment variables
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_USER = os.environ.get('DB_USER', 'your_db_user') # Replace with your user
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'your_db_password') # Replace with your password
DB_NAME = os.environ.get('DB_NAME', 'mydb') # The schema name from FinalProject.sql

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None # Or handle error appropriately

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/view_table/<table_name>')
def view_table(table_name):
    conn = get_db_connection()
    if not conn:
        return "Error connecting to database", 500
    
    cursor = conn.cursor() 
    
    allowed_tables = ['User', 'Game', 'Publisher', 'Genre', 'Library', 'Region', 'Store', 'Game_Genre', 'Game_Region', 'Region_Sale']
    if table_name not in allowed_tables:
        cursor.close()
        conn.close()
        return "Table not found or not allowed", 404

    headers = []
    rows = []
    error_message = None
    try:
        query = f"SELECT * FROM `{table_name}` LIMIT 100"
        cursor.execute(query)
        
        if cursor.description:
            headers = [desc[0] for desc in cursor.description]
        
        rows = cursor.fetchall()

    except mysql.connector.Error as err:
        error_message = f"Error fetching data for table {table_name}: {err}"
        print(error_message)
    finally:
        cursor.close()
        conn.close()

    return render_template('table_view.html', table_name=table_name, headers=headers, rows=rows, error=error_message)

@app.route('/reports/game_details')
def reports_game_details():
    conn = get_db_connection()
    if not conn:
        return "Error connecting to database", 500
    
    cursor = conn.cursor()
    headers = []
    rows = []
    report_title = "Game Details (View)"
    error_message = None
    try:
        # This view is not yet created in DB, but we code against its expected existence
        query = "SELECT * FROM GameDetailsView LIMIT 100;"
        cursor.execute(query)
        
        if cursor.description:
            headers = [desc[0] for desc in cursor.description]
        
        rows = cursor.fetchall()

    except mysql.connector.Error as err:
        error_message = f"Error fetching data for {report_title}: {err}. (Note: The SQL VIEW 'GameDetailsView' might not exist yet in the database.)"
        print(error_message)
    finally:
        cursor.close()
        conn.close()

    return render_template('table_view.html', table_name=report_title, headers=headers, rows=rows, error=error_message)

@app.route('/reports/user_library_summary')
def reports_user_library_summary():
    conn = get_db_connection()
    if not conn:
        return "Error connecting to database", 500
    
    cursor = conn.cursor()
    headers = []
    rows = []
    report_title = "User Library Summary (View)"
    error_message = None
    try:
        # This view is not yet created in DB, but we code against its expected existence
        query = "SELECT * FROM UserLibrarySummaryView LIMIT 100;"
        cursor.execute(query)
        
        if cursor.description:
            headers = [desc[0] for desc in cursor.description]
        
        rows = cursor.fetchall()

    except mysql.connector.Error as err:
        error_message = f"Error fetching data for {report_title}: {err}. (Note: The SQL VIEW 'UserLibrarySummaryView' might not exist yet in the database.)"
        print(error_message)
    finally:
        cursor.close()
        conn.close()

    return render_template('table_view.html', table_name=report_title, headers=headers, rows=rows, error=error_message)

@app.route('/reports/sales_by_genre_region')
def reports_sales_by_genre_region():
    conn = get_db_connection()
    if not conn:
        return "Error connecting to database", 500
    
    cursor = conn.cursor()
    headers = []
    rows = []
    report_title = "Sales by Genre and Region"
    error_message = None
    try:
        query = """
            SELECT
                g.Genre_name,
                r.Region_name,
                SUM(rs.Num_Sales) AS TotalSales
            FROM Region_Sale rs
            JOIN Genre g ON rs.Genre_id = g.idGenre
            JOIN Region r ON rs.idRegion = r.idRegion
            GROUP BY g.Genre_name, r.Region_name
            ORDER BY TotalSales DESC;
        """
        cursor.execute(query)
        
        if cursor.description:
            headers = [desc[0] for desc in cursor.description]
        
        rows = cursor.fetchall()

    except mysql.connector.Error as err:
        error_message = f"Error fetching data for {report_title}: {err}."
        print(error_message)
    finally:
        cursor.close()
        conn.close()

    return render_template('table_view.html', table_name=report_title, headers=headers, rows=rows, error=error_message)

if __name__ == '__main__':
    # Note: For development, use flask run. For production, use a proper WSGI server.
    app.run(debug=True)
