"""
JRIP persistent dashboard API.

Run this service independently from the camera process so the dashboard can
continue showing all saved SQLite data while the camera is stopped.
"""

from flask import Flask, jsonify

from database import DB_PATH, build_dashboard_payload, init_db

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Cache-Control"] = "no-store"
    return response


@app.route("/")
def index():
    return jsonify(
        {
            "service": "JRIP Dashboard API",
            "status": "online",
            "dashboard": "/api/dashboard",
            "health": "/api/health",
        }
    )


@app.route("/api/dashboard")
def dashboard_api():
    """Return all persistent detections in the dashboard-ready structure."""
    return jsonify(build_dashboard_payload())


@app.route("/api/health")
def api_health():
    return jsonify(
        {
            "status": "ok",
            "database": str(DB_PATH),
            "camera_required": False,
        }
    )


if __name__ == "__main__":
    init_db()
    print("JRIP Dashboard API is running independently from the camera.")
    print("Dashboard endpoint: http://127.0.0.1:5001/api/dashboard")
    app.run(host="0.0.0.0", port=5001, debug=False)
