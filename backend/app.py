from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from database import initialize_database, get_connection


# ==========================================
# CREATE FLASK APP
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# INITIALIZE DATABASE
# ==========================================

initialize_database()


# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "MemoryCare Backend is running!",
        "version": "1.0"
    })


# ==========================================
# HEALTH CHECK
# ==========================================

@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "MemoryCare API",
        "database": "connected"
    })


# ==========================================
# REGISTER USER
# ==========================================

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is missing."
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "").strip().lower()

    if not name:
        return jsonify({
            "success": False,
            "message": "Name is required."
        }), 400

    if not email:
        return jsonify({
            "success": False,
            "message": "Email is required."
        }), 400

    # ------------------------------------------
    # Validate password
    # ------------------------------------------

    if len(password) < 6:

        return jsonify({
            "success": False,
            "message": "Password must contain at least 6 characters."
        }), 400


    # ------------------------------------------
    # Validate role
    # ------------------------------------------

    if role not in ["patient", "caregiver"]:

        return jsonify({
            "success": False,
            "message": "Role must be patient or caregiver."
        }), 400


    # ------------------------------------------
    # Connect to database
    # ------------------------------------------

    connection = get_connection()

    cursor = connection.cursor()


    # ------------------------------------------
    # Check existing email
    # ------------------------------------------

    cursor.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    )

    existing_user = cursor.fetchone()


    if existing_user:

        connection.close()

        return jsonify({
            "success": False,
            "message": "An account with this email already exists."
        }), 409


    # ------------------------------------------
    # Hash password
    # ------------------------------------------

    password_hash = generate_password_hash(password)


    # ------------------------------------------
    # Insert user
    # ------------------------------------------

    cursor.execute(
        """
        INSERT INTO users
        (name, email, password, role)
        VALUES (?, ?, ?, ?)
        """,
        (
            name,
            email,
            password_hash,
            role
        )
    )


    connection.commit()

    user_id = cursor.lastrowid

    connection.close()


    # ------------------------------------------
    # Return response
    # ------------------------------------------

    return jsonify({

        "success": True,

        "message": "Account created successfully.",

        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "role": role
        }

    }), 201


# ==========================================
# LOGIN USER
# ==========================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is missing."
        }), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email:
        return jsonify({
            "success": False,
            "message": "Email is required."
        }), 400

    if not password:
        return jsonify({
            "success": False,
            "message": "Password is required."
        }), 400

    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "SELECT id, name, email, password, role FROM users WHERE email = ?",
        (email,)
    )
    user = cursor.fetchone()

    if not user or not check_password_hash(user["password"], password):
        connection.close()
        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

    connection.close()
    return jsonify({
        "success": True,
        "message": "Login successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200

# ==========================================
# SAVE GAME RESULT
# ==========================================

@app.route("/api/game-results", methods=["POST"])
def save_game_result():

    data = request.get_json()

    # Check request data
    if not data:

        return jsonify({
            "success": False,
            "message": "Request data is missing."
        }), 400


    # Get data
    user_id = data.get("user_id")
    game_name = data.get("game_name", "").strip()
    score = data.get("score", 0)
    attempts = data.get("attempts", 0)
    time_taken = data.get("time_taken", 0)
    matches = data.get("matches", 0)


    # Validate user ID
    if not user_id:

        return jsonify({
            "success": False,
            "message": "User ID is required."
        }), 400


    # Validate game name
    if not game_name:

        return jsonify({
            "success": False,
            "message": "Game name is required."
        }), 400


    connection = get_connection()

    cursor = connection.cursor()


    # Check whether user exists
    cursor.execute(
        """
        SELECT id, name, role
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    user = cursor.fetchone()


    if not user:

        connection.close()

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404


    # Save result
    cursor.execute(
        """
        INSERT INTO game_results
        (
            user_id,
            game_name,
            score,
            attempts,
            time_taken,
            matches
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            user_id,
            game_name,
            score,
            attempts,
            time_taken,
            matches
        )
    )


    connection.commit()

    result_id = cursor.lastrowid

    connection.close()


    return jsonify({

        "success": True,

        "message": "Game result saved successfully.",

        "result": {
            "id": result_id,
            "user_id": user_id,
            "game_name": game_name,
            "score": score,
            "attempts": attempts,
            "time_taken": time_taken,
            "matches": matches
        }

    }), 201

# ==========================================
# GET GAME RESULTS FOR A USER
# ==========================================

@app.route("/api/game-results/<int:user_id>", methods=["GET"])
def get_game_results(user_id):

    connection = get_connection()
    cursor = connection.cursor()

    # Check user
    cursor.execute(
        """
        SELECT id, name, email, role
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:

        connection.close()

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404


    # Get game results
    cursor.execute(
        """
        SELECT
            id,
            game_name,
            score,
            attempts,
            time_taken,
            matches,
            played_at AS created_at
        FROM game_results
        WHERE user_id = ?
        ORDER BY id DESC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    connection.close()


    results = []

    for row in rows:

        results.append({

            "id": row["id"],
            "game_name": row["game_name"],
            "score": row["score"],
            "attempts": row["attempts"],
            "time_taken": row["time_taken"],
            "matches": row["matches"],
            "created_at": row["created_at"]

        })


    return jsonify({

        "success": True,

        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        },

        "results": results

    }), 200


# ==========================================
# CAREGIVER - GET ALL PATIENTS
# ==========================================

@app.route("/api/caregiver/patients", methods=["GET"])
def get_patients_for_caregiver():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            role
        FROM users
        WHERE role = ?
        ORDER BY id DESC
        """,
        ("patient",)
    )

    patients = cursor.fetchall()

    connection.close()

    patient_list = []

    for patient in patients:

        patient_list.append({
            "id": patient["id"],
            "name": patient["name"],
            "email": patient["email"],
            "role": patient["role"]
        })

    return jsonify({
        "success": True,
        "patients": patient_list
    }), 200

# ==========================================
# REMINDER SYSTEM
# ==========================================

# ==========================================
# CREATE REMINDER
# ==========================================

@app.route("/api/reminders", methods=["POST"])
def create_reminder():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is missing."
        }), 400


    user_id = data.get("user_id")
    title = data.get("title", "").strip()
    reminder_type = data.get(
        "reminder_type",
        ""
    ).strip().lower()

    reminder_time = data.get(
        "reminder_time",
        ""
    ).strip()

    reminder_date = data.get(
        "reminder_date"
    )

    notes = data.get(
        "notes",
        ""
    ).strip()


    # Validate user
    if not user_id:

        return jsonify({
            "success": False,
            "message": "User ID is required."
        }), 400


    # Validate title
    if not title:

        return jsonify({
            "success": False,
            "message": "Reminder title is required."
        }), 400


    # Validate type
    allowed_types = [
        "medicine",
        "hydration",
        "activity",
        "appointment"
    ]

    if reminder_type not in allowed_types:

        return jsonify({
            "success": False,
            "message":
                "Invalid reminder type."
        }), 400


    # Validate time
    if not reminder_time:

        return jsonify({
            "success": False,
            "message":
                "Reminder time is required."
        }), 400


    connection = get_connection()
    cursor = connection.cursor()


    # Check user exists
    cursor.execute(
        """
        SELECT id
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    user = cursor.fetchone()


    if not user:

        connection.close()

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404


    # Insert reminder
    cursor.execute(
        """
        INSERT INTO reminders
        (
            user_id,
            title,
            reminder_type,
            reminder_time,
            reminder_date,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            user_id,
            title,
            reminder_type,
            reminder_time,
            reminder_date,
            notes
        )
    )


    connection.commit()

    reminder_id = cursor.lastrowid

    connection.close()


    return jsonify({

        "success": True,

        "message":
            "Reminder created successfully.",

        "reminder": {

            "id": reminder_id,

            "user_id": user_id,

            "title": title,

            "reminder_type":
                reminder_type,

            "reminder_time":
                reminder_time,

            "reminder_date":
                reminder_date,

            "notes": notes,

            "is_completed": 0

        }

    }), 201


# ==========================================
# GET USER REMINDERS
# ==========================================

@app.route(
    "/api/reminders/<int:user_id>",
    methods=["GET"]
)
def get_reminders(user_id):

    connection = get_connection()
    cursor = connection.cursor()


    cursor.execute(
        """
        SELECT
            id,
            user_id,
            title,
            reminder_type,
            reminder_time,
            reminder_date,
            notes,
            is_completed,
            created_at

        FROM reminders

        WHERE user_id = ?

        ORDER BY
            reminder_date ASC,
            reminder_time ASC,
            id DESC
        """,
        (user_id,)
    )


    rows = cursor.fetchall()

    connection.close()


    reminders = []


    for row in rows:

        reminders.append({

            "id": row["id"],

            "user_id":
                row["user_id"],

            "title":
                row["title"],

            "reminder_type":
                row["reminder_type"],

            "reminder_time":
                row["reminder_time"],

            "reminder_date":
                row["reminder_date"],

            "notes":
                row["notes"],

            "is_completed":
                bool(row["is_completed"]),

            "created_at":
                row["created_at"]

        })


    return jsonify({

        "success": True,

        "reminders": reminders

    }), 200


# ==========================================
# COMPLETE / UNCOMPLETE REMINDER
# ==========================================

@app.route(
    "/api/reminders/<int:reminder_id>/complete",
    methods=["PUT"]
)
def complete_reminder(reminder_id):

    data = request.get_json() or {}

    completed = data.get(
        "completed",
        True
    )


    connection = get_connection()
    cursor = connection.cursor()


    cursor.execute(
        """
        SELECT id
        FROM reminders
        WHERE id = ?
        """,
        (reminder_id,)
    )


    reminder = cursor.fetchone()


    if not reminder:

        connection.close()

        return jsonify({

            "success": False,

            "message":
                "Reminder not found."

        }), 404


    cursor.execute(
        """
        UPDATE reminders

        SET is_completed = ?

        WHERE id = ?
        """,
        (
            1 if completed else 0,
            reminder_id
        )
    )


    connection.commit()

    connection.close()


    return jsonify({

        "success": True,

        "message":
            "Reminder status updated."

    }), 200


# ==========================================
# DELETE REMINDER
# ==========================================

@app.route(
    "/api/reminders/<int:reminder_id>",
    methods=["DELETE"]
)
def delete_reminder(reminder_id):

    connection = get_connection()
    cursor = connection.cursor()


    cursor.execute(
        """
        DELETE FROM reminders
        WHERE id = ?
        """,
        (reminder_id,)
    )


    if cursor.rowcount == 0:

        connection.close()

        return jsonify({

            "success": False,

            "message":
                "Reminder not found."

        }), 404


    connection.commit()

    connection.close()


    return jsonify({

        "success": True,

        "message":
            "Reminder deleted successfully."

    }), 200

# ==========================================
# START SERVER
# ==========================================

# ==========================================
# DAILY WELLNESS
# ==========================================


@app.route("/api/wellness", methods=["POST"])
def create_wellness():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is missing."
        }), 400


    user_id = data.get("user_id")

    mood = data.get(
        "mood",
        ""
    ).strip()

    water_glasses = data.get(
        "water_glasses",
        0
    )

    activity_minutes = data.get(
        "activity_minutes",
        0
    )

    sleep_hours = data.get(
        "sleep_hours",
        0
    )

    meals_completed = data.get(
        "meals_completed",
        0
    )

    notes = data.get(
        "notes",
        ""
    ).strip()

    record_date = data.get(
        "record_date"
    )


    # ======================================
    # VALIDATION
    # ======================================

    if not user_id:

        return jsonify({
            "success": False,
            "message": "User ID is required."
        }), 400


    try:

        water_glasses = int(
            water_glasses
        )

        activity_minutes = int(
            activity_minutes
        )

        sleep_hours = float(
            sleep_hours
        )

        meals_completed = int(
            meals_completed
        )

    except (ValueError, TypeError):

        return jsonify({
            "success": False,
            "message":
                "Wellness values must be numbers."
        }), 400


    if water_glasses < 0:
        water_glasses = 0

    if activity_minutes < 0:
        activity_minutes = 0

    if sleep_hours < 0:
        sleep_hours = 0

    if meals_completed < 0:
        meals_completed = 0


    # ======================================
    # DATABASE
    # ======================================

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE id = ?",
        (user_id,)
    )
    if not cursor.fetchone():
        connection.close()
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if record_date:
        cursor.execute(
            """
            INSERT INTO wellness_records
            (
                user_id,
                mood,
                water_glasses,
                activity_minutes,
                sleep_hours,
                meals_completed,
                notes,
                record_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                mood,
                water_glasses,
                activity_minutes,
                sleep_hours,
                meals_completed,
                notes,
                record_date
            )
        )

    else:

        cursor.execute(
            """
            INSERT INTO wellness_records
            (
                user_id,
                mood,
                water_glasses,
                activity_minutes,
                sleep_hours,
                meals_completed,
                notes
            )

            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,

            (
                user_id,
                mood,
                water_glasses,
                activity_minutes,
                sleep_hours,
                meals_completed,
                notes
            )
        )


    connection.commit()

    record_id = cursor.lastrowid

    connection.close()


    return jsonify({

        "success": True,

        "message":
            "Daily wellness saved successfully.",

        "wellness": {

            "id": record_id,

            "user_id": user_id,

            "mood": mood,

            "water_glasses":
                water_glasses,

            "activity_minutes":
                activity_minutes,

            "sleep_hours":
                sleep_hours,

            "meals_completed":
                meals_completed,

            "notes": notes,

            "record_date":
                record_date

        }

    }), 201


# ==========================================
# GET WELLNESS HISTORY
# ==========================================


@app.route(
    "/api/wellness/<int:user_id>",
    methods=["GET"]
)
def get_wellness(user_id):

    connection = get_connection()

    cursor = connection.cursor()


    cursor.execute(
        """
        SELECT

            id,

            user_id,

            mood,

            water_glasses,

            activity_minutes,

            sleep_hours,

            meals_completed,

            notes,

            record_date,

            created_at

        FROM wellness_records

        WHERE user_id = ?

        ORDER BY
            record_date DESC,
            id DESC

        LIMIT 30
        """,

        (user_id,)
    )


    rows = cursor.fetchall()

    connection.close()


    records = []


    for row in rows:

        records.append({

            "id":
                row["id"],

            "user_id":
                row["user_id"],

            "mood":
                row["mood"],

            "water_glasses":
                row["water_glasses"],

            "activity_minutes":
                row["activity_minutes"],

            "sleep_hours":
                row["sleep_hours"],

            "meals_completed":
                row["meals_completed"],

            "notes":
                row["notes"],

            "record_date":
                row["record_date"],

            "created_at":
                row["created_at"]

        })


    return jsonify({

        "success": True,

        "records": records

    }), 200


# ==========================================
# COGNITIVE PROGRESS
# ==========================================


@app.route(
    "/api/progress/<int:user_id>",
    methods=["GET"]
)
def get_progress(user_id):

    connection = get_connection()

    cursor = connection.cursor()


    # ======================================
    # CHECK USER
    # ======================================

    cursor.execute(
        """
        SELECT id, name, role
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    user = cursor.fetchone()


    if not user:

        connection.close()

        return jsonify({

            "success": False,

            "message":
                "User not found."

        }), 404


    # ======================================
    # GAME STATISTICS
    # ======================================

    cursor.execute(
        """
        SELECT

            COUNT(*) AS games_played,

            COALESCE(
                MAX(score),
                0
            ) AS best_score,

            COALESCE(
                AVG(score),
                0
            ) AS average_score,

            COALESCE(
                AVG(time_taken),
                0
            ) AS average_time,

            COALESCE(
                SUM(matches),
                0
            ) AS total_matches

        FROM game_results

        WHERE user_id = ?
        """,

        (user_id,)
    )


    stats = cursor.fetchone()


    # ======================================
    # RECENT GAME RESULTS
    # ======================================

    cursor.execute(
        """
        SELECT

            id,

            game_name,

            score,

            attempts,

            time_taken,

            matches,

            played_at

        FROM game_results

        WHERE user_id = ?

        ORDER BY played_at DESC

        LIMIT 10
        """,

        (user_id,)
    )


    game_rows = cursor.fetchall()


    recent_games = []


    for row in game_rows:

        recent_games.append({

            "id":
                row["id"],

            "game_name":
                row["game_name"],

            "score":
                row["score"],

            "attempts":
                row["attempts"],

            "time_taken":
                row["time_taken"],

            "matches":
                row["matches"],

            "played_at":
                row["played_at"]

        })


    # ======================================
    # WELLNESS SUMMARY
    # ======================================

    cursor.execute(
        """
        SELECT

            COUNT(*) AS wellness_days,

            COALESCE(
                AVG(water_glasses),
                0
            ) AS average_water,

            COALESCE(
                AVG(activity_minutes),
                0
            ) AS average_activity,

            COALESCE(
                AVG(sleep_hours),
                0
            ) AS average_sleep,

            COALESCE(
                AVG(meals_completed),
                0
            ) AS average_meals

        FROM wellness_records

        WHERE user_id = ?
        """,

        (user_id,)
    )


    wellness = cursor.fetchone()


    connection.close()


    return jsonify({

        "success": True,

        "user": {

            "id":
                user["id"],

            "name":
                user["name"],

            "role":
                user["role"]

        },

        "cognitive": {

            "games_played":
                stats["games_played"],

            "best_score":
                stats["best_score"],

            "average_score":
                round(
                    float(
                        stats["average_score"]
                    ),
                    2
                ),

            "average_time":
                round(
                    float(
                        stats["average_time"]
                    ),
                    2
                ),

            "total_matches":
                stats["total_matches"]

        },

        "recent_games":
            recent_games,

        "wellness": {

            "wellness_days":
                wellness["wellness_days"],

            "average_water":
                round(
                    float(
                        wellness["average_water"]
                    ),
                    2
                ),

            "average_activity":
                round(
                    float(
                        wellness["average_activity"]
                    ),
                    2
                ),

            "average_sleep":
                round(
                    float(
                        wellness["average_sleep"]
                    ),
                    2
                ),

            "average_meals":
                round(
                    float(
                        wellness["average_meals"]
                    ),
                    2
                )

        }

    }), 200

# ==========================================
# CAREGIVER - PATIENT LIST
# ==========================================

def get_caregiver_patients_basic(caregiver_id):

    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------
    # CHECK CAREGIVER
    # --------------------------------------

    cursor.execute(
        """
        SELECT id, name, email, role
        FROM users
        WHERE id = ?
        AND role = 'caregiver'
        """,
        (caregiver_id,)
    )

    caregiver = cursor.fetchone()

    if not caregiver:

        connection.close()

        return jsonify({
            "success": False,
            "message": "Caregiver not found."
        }), 404


    # --------------------------------------
    # GET PATIENTS
    # --------------------------------------

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            role
        FROM users
        WHERE role = 'patient'
        ORDER BY name ASC
        """
    )

    rows = cursor.fetchall()

    patients = []

    for row in rows:

        patients.append({
            "id": row["id"],
            "name": row["name"],
            "email": row["email"],
            "role": row["role"]
        })


    connection.close()


    return jsonify({
        "success": True,
        "patients": patients
    }), 200


# ==========================================
# CAREGIVER - PATIENT OVERVIEW
# ==========================================

@app.route(
    "/api/caregiver/patient/<int:patient_id>/overview",
    methods=["GET"]
)
def get_patient_overview(patient_id):

    connection = get_connection()
    cursor = connection.cursor()


    # --------------------------------------
    # PATIENT INFORMATION
    # --------------------------------------

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            role
        FROM users
        WHERE id = ?
        AND role = 'patient'
        """,
        (patient_id,)
    )

    patient = cursor.fetchone()


    if not patient:

        connection.close()

        return jsonify({
            "success": False,
            "message": "Patient not found."
        }), 404


    # --------------------------------------
    # GAME STATISTICS
    # --------------------------------------

    cursor.execute(
        """
        SELECT

            COUNT(*) AS games_played,

            COALESCE(
                MAX(score),
                0
            ) AS best_score,

            COALESCE(
                AVG(score),
                0
            ) AS average_score,

            COALESCE(
                AVG(time_taken),
                0
            ) AS average_time,

            COALESCE(
                SUM(matches),
                0
            ) AS total_matches

        FROM game_results

        WHERE user_id = ?
        """,
        (patient_id,)
    )

    cognitive = cursor.fetchone()


    # --------------------------------------
    # RECENT GAMES
    # --------------------------------------

    cursor.execute(
        """
        SELECT
            id,
            game_name,
            score,
            attempts,
            time_taken,
            matches,
            played_at

        FROM game_results

        WHERE user_id = ?

        ORDER BY played_at DESC

        LIMIT 10
        """,
        (patient_id,)
    )

    game_rows = cursor.fetchall()

    recent_games = []

    for row in game_rows:

        recent_games.append({
            "id": row["id"],
            "game_name": row["game_name"],
            "score": row["score"],
            "attempts": row["attempts"],
            "time_taken": row["time_taken"],
            "matches": row["matches"],
            "played_at": row["played_at"]
        })


    # --------------------------------------
    # WELLNESS STATISTICS
    # --------------------------------------

    cursor.execute(
        """
        SELECT

            COUNT(*) AS wellness_days,

            COALESCE(
                AVG(water_glasses),
                0
            ) AS average_water,

            COALESCE(
                AVG(activity_minutes),
                0
            ) AS average_activity,

            COALESCE(
                AVG(sleep_hours),
                0
            ) AS average_sleep,

            COALESCE(
                AVG(meals_completed),
                0
            ) AS average_meals

        FROM wellness_records

        WHERE user_id = ?
        """,
        (patient_id,)
    )

    wellness = cursor.fetchone()


    # --------------------------------------
    # RECENT WELLNESS
    # --------------------------------------

    cursor.execute(
        """
        SELECT

            id,
            mood,
            water_glasses,
            activity_minutes,
            sleep_hours,
            meals_completed,
            notes,
            record_date

        FROM wellness_records

        WHERE user_id = ?

        ORDER BY record_date DESC, id DESC

        LIMIT 7
        """,
        (patient_id,)
    )

    wellness_rows = cursor.fetchall()

    recent_wellness = []

    for row in wellness_rows:

        recent_wellness.append({
            "id": row["id"],
            "mood": row["mood"],
            "water_glasses":
                row["water_glasses"],
            "activity_minutes":
                row["activity_minutes"],
            "sleep_hours":
                row["sleep_hours"],
            "meals_completed":
                row["meals_completed"],
            "notes":
                row["notes"],
            "record_date":
                row["record_date"]
        })


    # --------------------------------------
    # REMINDER STATISTICS
    # --------------------------------------

    cursor.execute(
        """
        SELECT

            COUNT(*) AS total_reminders,

            COALESCE(
                SUM(
                    CASE
                        WHEN is_completed = 1
                        THEN 1
                        ELSE 0
                    END
                ),
                0
            ) AS completed_reminders

        FROM reminders

        WHERE user_id = ?
        """,
        (patient_id,)
    )

    reminder_stats = cursor.fetchone()


    connection.close()


    # --------------------------------------
    # RESPONSE
    # --------------------------------------

    return jsonify({

        "success": True,

        "patient": {
            "id": patient["id"],
            "name": patient["name"],
            "email": patient["email"],
            "role": patient["role"]
        },

        "cognitive": {

            "games_played":
                cognitive["games_played"],

            "best_score":
                cognitive["best_score"],

            "average_score":
                round(
                    float(
                        cognitive["average_score"]
                    ),
                    2
                ),

            "average_time":
                round(
                    float(
                        cognitive["average_time"]
                    ),
                    2
                ),

            "total_matches":
                cognitive["total_matches"]

        },

        "recent_games":
            recent_games,

        "wellness": {

            "wellness_days":
                wellness["wellness_days"],

            "average_water":
                round(
                    float(
                        wellness["average_water"]
                    ),
                    2
                ),

            "average_activity":
                round(
                    float(
                        wellness["average_activity"]
                    ),
                    2
                ),

            "average_sleep":
                round(
                    float(
                        wellness["average_sleep"]
                    ),
                    2
                ),

            "average_meals":
                round(
                    float(
                        wellness["average_meals"]
                    ),
                    2
                )

        },

        "recent_wellness":
            recent_wellness,

        "reminders": {

            "total":
                reminder_stats["total_reminders"],

            "completed":
                reminder_stats["completed_reminders"]

        }

    }), 200

# ==========================================
# ADAPTIVE DIFFICULTY
# ==========================================

@app.route(
    "/api/adaptive-difficulty/<int:user_id>",
    methods=["GET"]
)
def get_adaptive_difficulty(user_id):

    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------
    # CHECK USER
    # --------------------------------------

    cursor.execute(
        """
        SELECT id, name, role
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:

        connection.close()

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404


    # --------------------------------------
    # GET RECENT GAME RESULTS
    # --------------------------------------

    cursor.execute(
        """
        SELECT
            score,
            attempts,
            time_taken,
            matches,
            played_at

        FROM game_results

        WHERE user_id = ?

        ORDER BY played_at DESC

        LIMIT 5
        """,
        (user_id,)
    )

    results = cursor.fetchall()


    # --------------------------------------
    # NO PREVIOUS RESULTS
    # --------------------------------------

    if not results:

        connection.close()

        return jsonify({

            "success": True,

            "difficulty": "easy",

            "level": 1,

            "reason":
                "This is the patient's first game. Starting with an easy level.",

            "performance": {
                "games_analyzed": 0,
                "average_score": 0,
                "average_attempts": 0,
                "average_time": 0,
                "average_matches": 0
            }

        }), 200


    # --------------------------------------
    # CALCULATE AVERAGES
    # --------------------------------------

    total_score = 0
    total_attempts = 0
    total_time = 0
    total_matches = 0

    for result in results:

        total_score += result["score"] or 0

        total_attempts += result["attempts"] or 0

        total_time += result["time_taken"] or 0

        total_matches += result["matches"] or 0


    games_count = len(results)

    average_score = total_score / games_count
    average_attempts = total_attempts / games_count
    average_time = total_time / games_count
    average_matches = total_matches / games_count


    # --------------------------------------
    # ADAPTIVE SCORE
    # --------------------------------------

    performance_score = 0


    # Score contribution
    if average_score >= 80:
        performance_score += 3

    elif average_score >= 60:
        performance_score += 2

    elif average_score >= 40:
        performance_score += 1


    # Match contribution
    if average_matches >= 8:
        performance_score += 2

    elif average_matches >= 5:
        performance_score += 1


    # Attempt efficiency
    if average_attempts > 0:

        accuracy_ratio = (
            average_matches /
            average_attempts
        )

        if accuracy_ratio >= 0.80:
            performance_score += 2

        elif accuracy_ratio >= 0.60:
            performance_score += 1


    # Time contribution
    if average_time > 0:

        if average_time <= 30:
            performance_score += 2

        elif average_time <= 60:
            performance_score += 1


    # --------------------------------------
    # DETERMINE DIFFICULTY
    # --------------------------------------

    if games_count < 2:

        difficulty = "easy"
        level = 1

        reason = (
            "The patient is still getting "
            "familiar with the game."
        )

    elif performance_score <= 3:

        difficulty = "easy"
        level = 1

        reason = (
            "Recent performance suggests "
            "that an easier level is appropriate."
        )

    elif performance_score <= 6:

        difficulty = "medium"
        level = 2

        reason = (
            "The patient is showing steady "
            "performance. Difficulty increased "
            "to medium."
        )

    else:

        difficulty = "hard"
        level = 3

        reason = (
            "The patient is performing strongly. "
            "Difficulty increased to hard."
        )


    connection.close()


    # --------------------------------------
    # RESPONSE
    # --------------------------------------

    return jsonify({

        "success": True,

        "difficulty": difficulty,

        "level": level,

        "reason": reason,

        "performance": {

            "games_analyzed":
                games_count,

            "average_score":
                round(average_score, 2),

            "average_attempts":
                round(average_attempts, 2),

            "average_time":
                round(average_time, 2),

            "average_matches":
                round(average_matches, 2),

            "performance_score":
                performance_score
        }

    }), 200

# ==========================================
# CAREGIVER - GET PATIENTS
# ==========================================

@app.route(
    "/api/caregiver/patients/<int:caregiver_id>",
    methods=["GET"]
)
def get_caregiver_patients(caregiver_id):

    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------
    # CHECK CAREGIVER
    # --------------------------------------

    cursor.execute(
        """
        SELECT id, name, email, role
        FROM users
        WHERE id = ?
        AND role = 'caregiver'
        """,
        (caregiver_id,)
    )

    caregiver = cursor.fetchone()

    if not caregiver:

        connection.close()

        return jsonify({
            "success": False,
            "message": "Caregiver not found."
        }), 404


    # --------------------------------------
    # GET PATIENTS
    # --------------------------------------

    cursor.execute(
        """
        SELECT
            u.id,
            u.name,
            u.email,

            COUNT(g.id) AS games_played,

            COALESCE(
                ROUND(AVG(g.score), 2),
                0
            ) AS average_score,

            MAX(g.played_at) AS last_activity

        FROM users u

        LEFT JOIN game_results g
        ON u.id = g.user_id

        WHERE u.role = 'patient'

        GROUP BY
            u.id,
            u.name,
            u.email

        ORDER BY
            last_activity DESC
        """
    )

    patients = cursor.fetchall()

    connection.close()


    # --------------------------------------
    # FORMAT RESPONSE
    # --------------------------------------

    patient_list = []

    for patient in patients:

        patient_list.append({

            "id":
                patient["id"],

            "name":
                patient["name"],

            "email":
                patient["email"],

            "games_played":
                patient["games_played"] or 0,

            "average_score":
                patient["average_score"] or 0,

            "last_activity":
                patient["last_activity"]

        })


    return jsonify({

        "success": True,

        "caregiver": {

            "id":
                caregiver["id"],

            "name":
                caregiver["name"],

            "email":
                caregiver["email"]

        },

        "patients":
            patient_list

    }), 200

# =========================================================
# MEDICATION TRACKER APIs
# =========================================================

@app.route("/api/medications/<int:user_id>", methods=["GET"])
def get_medications(user_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                user_id,
                medicine_name,
                dosage,
                medicine_time,
                frequency,
                is_taken,
                created_at
            FROM medications
            WHERE user_id = ?
            ORDER BY medicine_time ASC
        """, (user_id,))

        medications = [dict(row) for row in cursor.fetchall()]

        connection.close()

        return jsonify({
            "success": True,
            "medications": medications
        }), 200

    except Exception as error:
        print("GET MEDICATION ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to load medications."
        }), 500


@app.route("/api/medications", methods=["POST"])
def add_medication():
    try:
        data = request.get_json()

        user_id = data.get("user_id")
        medicine_name = data.get("medicine_name")
        dosage = data.get("dosage")
        medicine_time = data.get("medicine_time")
        frequency = data.get("frequency")

        if not all([
            user_id,
            medicine_name,
            dosage,
            medicine_time,
            frequency
        ]):
            return jsonify({
                "success": False,
                "message": "All medication fields are required."
            }), 400

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO medications (
                user_id,
                medicine_name,
                dosage,
                medicine_time,
                frequency,
                is_taken
            )
            VALUES (?, ?, ?, ?, ?, 0)
        """, (
            user_id,
            medicine_name,
            dosage,
            medicine_time,
            frequency
        ))

        connection.commit()

        medication_id = cursor.lastrowid

        connection.close()

        return jsonify({
            "success": True,
            "message": "Medication added successfully.",
            "medication_id": medication_id
        }), 201

    except Exception as error:
        print("ADD MEDICATION ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to add medication."
        }), 500


@app.route("/api/medications/<int:medication_id>/toggle", methods=["PUT"])
def toggle_medication(medication_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT is_taken
            FROM medications
            WHERE id = ?
        """, (medication_id,))

        medication = cursor.fetchone()

        if medication is None:
            connection.close()

            return jsonify({
                "success": False,
                "message": "Medication not found."
            }), 404

        new_status = 0 if medication["is_taken"] else 1

        cursor.execute("""
            UPDATE medications
            SET is_taken = ?
            WHERE id = ?
        """, (
            new_status,
            medication_id
        ))

        connection.commit()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Medication status updated.",
            "is_taken": new_status
        }), 200

    except Exception as error:
        print("TOGGLE MEDICATION ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to update medication."
        }), 500


@app.route("/api/medications/<int:medication_id>", methods=["DELETE"])
def delete_medication(medication_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            DELETE FROM medications
            WHERE id = ?
        """, (medication_id,))

        connection.commit()

        deleted = cursor.rowcount

        connection.close()

        if deleted == 0:
            return jsonify({
                "success": False,
                "message": "Medication not found."
            }), 404

        return jsonify({
            "success": True,
            "message": "Medication deleted successfully."
        }), 200

    except Exception as error:
        print("DELETE MEDICATION ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to delete medication."
        }), 500

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )