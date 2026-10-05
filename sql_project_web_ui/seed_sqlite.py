"""Create a SQLite demo DB so the Flask UI can run without MySQL.

Usage:
    python seed_sqlite.py
Writes sql_project_web_ui/demo.db
"""
from __future__ import annotations

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "demo.db"


def seed(path=DB_PATH):
    if path.exists():
        path.unlink()
    conn = sqlite3.connect(path)
    cur = conn.cursor()
    cur.executescript(
        """
        CREATE TABLE Library (
            idLibrary INTEGER PRIMARY KEY,
            Number_Games INTEGER
        );
        CREATE TABLE User (
            idUser INTEGER,
            First_name TEXT NOT NULL,
            M_I TEXT,
            Last_name TEXT NOT NULL,
            Username TEXT PRIMARY KEY,
            Email TEXT NOT NULL UNIQUE,
            Phone_number TEXT NOT NULL,
            DOB TEXT NOT NULL,
            Password TEXT NOT NULL,
            Address TEXT,
            Country TEXT,
            idLibrary INTEGER NOT NULL UNIQUE,
            FOREIGN KEY (idLibrary) REFERENCES Library(idLibrary)
        );
        CREATE TABLE Publisher (
            idPublisher INTEGER PRIMARY KEY,
            Publisher_name TEXT
        );
        CREATE TABLE Game (
            idGame INTEGER PRIMARY KEY,
            Title TEXT,
            idPublisher INTEGER,
            Release_year INTEGER,
            FOREIGN KEY (idPublisher) REFERENCES Publisher(idPublisher)
        );
        CREATE TABLE Genre (
            idGenre INTEGER PRIMARY KEY,
            Genre_name TEXT
        );
        CREATE TABLE Region (
            idRegion INTEGER PRIMARY KEY,
            Region_name TEXT
        );
        CREATE TABLE Region_Sale (
            idRegion_Sale INTEGER PRIMARY KEY,
            Genre_id INTEGER,
            Num_Sales INTEGER,
            idRegion INTEGER,
            FOREIGN KEY (Genre_id) REFERENCES Genre(idGenre),
            FOREIGN KEY (idRegion) REFERENCES Region(idRegion)
        );
        CREATE TABLE Store (
            idStore INTEGER,
            Games_N_sold INTEGER NOT NULL,
            Games_owned INTEGER NOT NULL,
            Games_price REAL NOT NULL,
            Game_release TEXT NOT NULL,
            Game_id INTEGER NOT NULL UNIQUE,
            PRIMARY KEY (idStore, Game_id),
            FOREIGN KEY (Game_id) REFERENCES Game(idGame)
        );
        CREATE TABLE Game_Genre (
            idGameGenre INTEGER PRIMARY KEY AUTOINCREMENT,
            idGame INTEGER NOT NULL,
            idGenre INTEGER NOT NULL,
            UNIQUE (idGame, idGenre)
        );
        CREATE TABLE Game_Region (
            idGameRegion INTEGER PRIMARY KEY AUTOINCREMENT,
            idGame INTEGER NOT NULL,
            idRegion INTEGER NOT NULL,
            UNIQUE (idGame, idRegion)
        );
        """
    )

    cur.executemany("INSERT INTO Library VALUES (?,?)", [(i, n) for i, n in enumerate([20, 8, 34, 4, 18, 43, 9, 14, 22], start=1)])
    cur.executemany(
        "INSERT INTO User VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [
            (1, "Jessica", "A", "William", "LadyBug", "JAWilliam@goojoo.com", "302-343-9638", "1998-08-12", "********", "2718 Park Place Dr.", "USA", 6),
            (2, "Alex", "S", "Jefferson", "Squadboy", "JeffAlex@bing.com", "301-564-3241", "1973-02-28", "********", "4627 Landover Mills St.", "Brazil", 2),
            (3, "Lewis", "P", "Suh", "Suh321", "SuhLewis@google.com", "302-649-0000", "1993-08-04", "********", "8425 Northpoint CT", "Japan", 5),
        ],
    )
    publishers = [
        (1, "Take-Two Interactive"),
        (2, "Activision"),
        (4, "Ubisoft"),
        (5, "Sony Computer Entertainment"),
        (11, "CD Projekt"),
    ]
    cur.executemany("INSERT INTO Publisher VALUES (?,?)", publishers)
    games = [
        (1, "NBA 2K14", 1, 2013),
        (2, "Grand Theft Auto IV", 1, 2008),
        (4, "FIFA 17", 2, 2016),
        (8, "The Division 2", 4, 2019),
        (10, "Assassin's Creed 4", 4, 2013),
        (16, "God of War Ragnarok", 5, 2022),
        (17, "The Last of Us Part II", 5, 2020),
        (67, "The Witcher 3: Wild Hunt", 11, 2015),
    ]
    cur.executemany("INSERT INTO Game VALUES (?,?,?,?)", games)
    genres = [
        (1, "Action"),
        (2, "FPS"),
        (4, "Sports"),
        (5, "Platform"),
        (7, "Action Adventure"),
        (9, "Role-Playing"),
        (10, "Battle Royale"),
        (13, "RPG"),
    ]
    cur.executemany("INSERT INTO Genre VALUES (?,?)", genres)
    regions = [
        (1, "All Regions"),
        (2, "North America"),
        (3, "Europe / Japan"),
        (4, "East Asia"),
    ]
    cur.executemany("INSERT INTO Region VALUES (?,?)", regions)
    sales = [
        (12, 2, 534984, 1),
        (110, 10, 837132, 1),
        (29, 9, 129483, 2),
        (25, 5, 373948, 2),
        (34, 4, 493582, 3),
        (37, 7, 234958, 3),
        (41, 1, 145483, 4),
        (49, 9, 589583, 4),
    ]
    cur.executemany("INSERT INTO Region_Sale VALUES (?,?,?,?)", sales)
    stores = [
        (1, 30923, 37128, 60.00, "2007-01-07", 2),
        (2, 9847, 10843, 70.00, "2022-09-23", 16),
        (3, 18281, 21382, 60.00, "2016-08-19", 4),
        (4, 9273, 11394, 70.00, "2020-06-28", 17),
        (5, 8347, 9482, 60.00, "2019-09-18", 8),
        (7, 8238, 8508, 60.00, "2013-05-23", 1),
        (9, 20238, 23387, 60.00, "2013-11-10", 10),
        (10, 15000, 16000, 40.00, "2015-05-19", 67),
    ]
    cur.executemany("INSERT INTO Store VALUES (?,?,?,?,?,?)", stores)
    cur.executemany("INSERT INTO Game_Genre (idGame, idGenre) VALUES (?,?)", [(1, 4), (2, 1), (4, 4), (8, 7), (10, 7), (16, 7), (17, 7), (67, 13)])
    cur.executemany("INSERT INTO Game_Region (idGame, idRegion) VALUES (?,?)", [(1, 1), (2, 2), (16, 1), (67, 3)])

    cur.executescript(
        """
        CREATE VIEW GameDetailsView AS
        SELECT
            g.idGame,
            g.Title,
            g.Release_year,
            p.Publisher_name,
            (
                SELECT GROUP_CONCAT(gn.Genre_name, ', ')
                FROM Game_Genre gg
                JOIN Genre gn ON gg.idGenre = gn.idGenre
                WHERE gg.idGame = g.idGame
            ) AS Genres
        FROM Game g
        JOIN Publisher p ON g.idPublisher = p.idPublisher;

        CREATE VIEW UserLibrarySummaryView AS
        SELECT
            u.idUser,
            u.Username,
            u.First_name,
            u.M_I,
            u.Last_name,
            u.Email,
            l.Number_Games
        FROM User u
        JOIN Library l ON u.idLibrary = l.idLibrary;

        CREATE VIEW SalesConcentrationView AS
        SELECT
            r.Region_name,
            SUM(rs.Num_Sales) AS TotalSales,
            ROUND(100.0 * SUM(rs.Num_Sales) / (SELECT SUM(Num_Sales) FROM Region_Sale), 2) AS PctOfBook
        FROM Region_Sale rs
        JOIN Region r ON rs.idRegion = r.idRegion
        GROUP BY r.Region_name;
        """
    )
    conn.commit()
    conn.close()
    print(f"Wrote {path}")


if __name__ == "__main__":
    seed()
