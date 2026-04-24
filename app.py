from flask import Flask, jsonify , request
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app)


def get_connection():
    return pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=localhost;"
        "DATABASE=Cinema;"
        "Trusted_Connection=yes;"
    )


# Home route to check whether the backend is running
@app.route("/")
def home():
    return "Cinema backend is running!"


# Fetch all movies
@app.route("/movies")
def get_movies():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, title, duration_min, genre
        FROM dbo.Movies
        ORDER BY id
    """)

    movies = []
    for row in cursor.fetchall():
        movies.append({
            "id": row.id,
            "title": row.title,
            "duration_min": row.duration_min,
            "genre": row.genre
        })

    cursor.close()
    conn.close()

    return jsonify(movies)


# Fetch one specific movie by its id
@app.route("/movies/<int:movie_id>")
def get_movie(movie_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, title, duration_min, genre
        FROM dbo.Movies
        WHERE id = ?
    """, movie_id)

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if row is None:
        return jsonify({"error": "Movie not found"}), 404

    movie = {
        "id": row.id,
        "title": row.title,
        "duration_min": row.duration_min,
        "genre": row.genre
    }

    return jsonify(movie)


# Fetch all showings for a specific movie
@app.route("/movies/<int:movie_id>/showings")
def get_showings(movie_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            s.id,
            s.hall_id,
            s.start_time,
            s.end_time,
            s.base_price_cents,
            s.status,
            m.title
        FROM dbo.Showings s
        JOIN dbo.Movies m ON s.movie_id = m.id
        WHERE s.movie_id = ?
        ORDER BY s.start_time
    """, movie_id)

    showings = []
    for row in cursor.fetchall():
        showings.append({
            "id": row.id,
            "title": row.title,
            "hall_id": row.hall_id,
            "start_time": str(row.start_time),
            "end_time": str(row.end_time),
            "base_price_cents": row.base_price_cents,
            "status": row.status
        })

    cursor.close()
    conn.close()

    return jsonify(showings)
#---------------------------------------------
# Fetch one specific showing by its id
@app.route("/showings/<int:showing_id>")
def get_showing(showing_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            s.id,
            s.hall_id,
            s.start_time,
            s.end_time,
            s.base_price_cents,
            s.status,
            m.title
        FROM dbo.Showings s
        JOIN dbo.Movies m ON s.movie_id = m.id
        WHERE s.id = ?
    """, showing_id)

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if row is None:
        return jsonify({"error": "Showing not found"}), 404

    showing = {
        "id": row.id,
        "title": row.title,
        "hall_id": row.hall_id,
        "start_time": str(row.start_time),
        "end_time": str(row.end_time),
        "base_price_cents": row.base_price_cents,
        "status": row.status
    }

    return jsonify(showing)

# ------------Booked seats---------------
@app.route("/showings/<int:showing_id>/seats")
def get_booked_seats(showing_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT seat_row, seat_col
        FROM dbo.Booking_seats
        WHERE showing_id = ?
    """, showing_id)

    seats = []
    for row in cursor.fetchall():
        seat_label = f"{row.seat_row}{row.seat_col}"
        seats.append(seat_label)

    cursor.close()
    conn.close()

    return jsonify(seats)

#-------------------------------------

# Create a booking and save selected seats
@app.route("/bookings", methods=["POST"])
def create_booking():
    data = request.get_json()

    showing_id = data.get("showing_id")
    seats = data.get("seats", [])

    if not showing_id or not seats:
        return jsonify({"error": "showing_id and seats are required"}), 400

    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get ticket price for this showing
        cursor.execute("""
            SELECT base_price_cents
            FROM dbo.Showings
            WHERE id = ?
        """, showing_id)

        row = cursor.fetchone()

        if row is None:
            cursor.close()
            conn.close()
            return jsonify({"error": "Showing not found"}), 404

        base_price_cents = row.base_price_cents
        total_price_cents = base_price_cents * len(seats)

        # Prevent double booking:
        # check whether any requested seat is already booked for this showing
        for seat_label in seats:
            seat_row = seat_label[0]
            seat_col = int(seat_label[1:])

            cursor.execute("""
                SELECT COUNT(*) AS seat_count
                FROM dbo.Booking_seats
                WHERE showing_id = ? AND seat_row = ? AND seat_col = ?
            """, showing_id, seat_row, seat_col)

            existing = cursor.fetchone()

            if existing.seat_count > 0:
                cursor.close()
                conn.close()
                return jsonify({
                    "error": f"Seat {seat_label} is already booked"
                }), 409

        # Insert into Bookings
        cursor.execute("""
            INSERT INTO dbo.Bookings (user_id, showing_id, status, total_price_cents, reserved_until)
            OUTPUT INSERTED.id
            VALUES (?, ?, ?, ?, ?)
        """, None, showing_id, "confirmed", total_price_cents, None)

        booking_id = cursor.fetchone().id

        # Insert all selected seats into Booking_seats
        for seat_label in seats:
            seat_row = seat_label[0]
            seat_col = int(seat_label[1:])

            cursor.execute("""
                INSERT INTO dbo.Booking_seats (booking_id, showing_id, seat_row, seat_col)
                VALUES (?, ?, ?, ?)
            """, booking_id, showing_id, seat_row, seat_col)

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Booking created successfully",
            "booking_id": booking_id,
            "total_price_cents": total_price_cents
        }), 201

    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)