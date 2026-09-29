import sqlite3


DATABASE_NAME = "database.db"


# ==========================================
# DATABASE CONNECTION
# ==========================================

def get_connection():

    connection = sqlite3.connect(DATABASE_NAME)

    connection.row_factory = sqlite3.Row

    return connection


# ==========================================
# INITIALIZE DATABASE
# ==========================================

def initialize_database():

    connection = get_connection()

    cursor = connection.cursor()


    # ======================================
    # USERS TABLE
    # ======================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL,

            role TEXT NOT NULL

        )
    """)


    # ======================================
    # GAME RESULTS TABLE
    # ======================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS game_results (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            game_name TEXT NOT NULL,

            score INTEGER DEFAULT 0,

            attempts INTEGER DEFAULT 0,

            time_taken INTEGER DEFAULT 0,

            matches INTEGER DEFAULT 0,

            played_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)


    # ======================================
    # REMINDERS TABLE
    # ======================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reminders (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            title TEXT NOT NULL,

            reminder_type TEXT NOT NULL,

            reminder_time TEXT NOT NULL,

            reminder_date TEXT,

            notes TEXT,

            is_completed INTEGER DEFAULT 0,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)

        # -----------------------------
    # MEDICATIONS TABLE
    # -----------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            medicine_name TEXT NOT NULL,
            dosage TEXT NOT NULL,
            medicine_time TEXT NOT NULL,
            frequency TEXT NOT NULL,
            is_taken INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users(id)
        )
    """)

    

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS wellness_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            mood TEXT,
            water_glasses INTEGER DEFAULT 0,
            activity_minutes INTEGER DEFAULT 0,
            sleep_hours REAL DEFAULT 0,
            meals_completed INTEGER DEFAULT 0,
            notes TEXT,
            record_date DATE DEFAULT CURRENT_DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    reminder_columns = {
        row["name"]
        for row in cursor.execute(
            "PRAGMA table_info(reminders)"
        ).fetchall()
    }

    if "reminder_type" not in reminder_columns:
        cursor.execute(
            "ALTER TABLE reminders ADD COLUMN reminder_type TEXT NOT NULL DEFAULT 'activity'"
        )
        if "type" in reminder_columns:
            cursor.execute(
                'UPDATE reminders SET reminder_type = "type" WHERE "type" IS NOT NULL'
            )

    if "reminder_date" not in reminder_columns:
        cursor.execute(
            "ALTER TABLE reminders ADD COLUMN reminder_date TEXT"
        )

    if "notes" not in reminder_columns:
        cursor.execute(
            "ALTER TABLE reminders ADD COLUMN notes TEXT"
        )

    if "is_completed" not in reminder_columns:
        cursor.execute(
            "ALTER TABLE reminders ADD COLUMN is_completed INTEGER NOT NULL DEFAULT 0"
        )
        if "completed" in reminder_columns:
            cursor.execute(
                "UPDATE reminders SET is_completed = COALESCE(completed, 0)"
            )

    if "created_at" not in reminder_columns:
        cursor.execute(
            "ALTER TABLE reminders ADD COLUMN created_at TEXT"
        )
        cursor.execute(
            "UPDATE reminders SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"
        )


    connection.commit()

    connection.close()


# ==========================================
# RESET REMINDERS TABLE
# ==========================================
#
# This function is only for development.
# Do NOT call it automatically when the
# application starts.
#

def reset_reminders_table():

    connection = get_connection()

    cursor = connection.cursor()


    cursor.execute(
        "DROP TABLE IF EXISTS reminders"
    )


    cursor.execute("""
        CREATE TABLE reminders (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            title TEXT NOT NULL,

            reminder_type TEXT NOT NULL,

            reminder_time TEXT NOT NULL,

            reminder_date TEXT,

            notes TEXT,

            is_completed INTEGER DEFAULT 0,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)


    connection.commit()

    connection.close()

    print(
        "Reminders table recreated successfully."
    )


# ==========================================
# RUN DATABASE INITIALIZATION
# ==========================================

if __name__ == "__main__":

    initialize_database()

    print(
        "MemoryCare database initialized successfully."
    )