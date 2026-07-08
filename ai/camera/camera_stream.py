import cv2
import time
from flask import Flask, Response, jsonify

app = Flask(__name__)

CAMERA_INDEX = 0

latest_metrics = {
    "camera": "Disconnected",
    "ai": "Ready",
    "gps": "Waiting",
    "fps": 0,
    "resolution": "640x480",
    "trip": "Stopped",
    "frames_recorded": 0
}

trip_running = False
frames_recorded = 0


def generate_frames():
    global latest_metrics, trip_running, frames_recorded

    cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)

    if not cap.isOpened():
        latest_metrics["camera"] = "Disconnected"
        print("❌ Failed to open camera")
        return

    latest_metrics["camera"] = "Connected"

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)

    prev_time = time.time()

    while True:
        success, frame = cap.read()

        if not success:
            print("❌ Failed to read frame")
            time.sleep(0.1)
            continue

        current_time = time.time()
        fps = 1 / (current_time - prev_time)
        prev_time = current_time

        latest_metrics["fps"] = round(fps, 1)

        if trip_running:
            frames_recorded += 1

        latest_metrics["trip"] = "Running" if trip_running else "Stopped"
        latest_metrics["frames_recorded"] = frames_recorded

        cv2.putText(
            frame,
            "JRIP Smart Vehicle Unit",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"FPS: {latest_metrics['fps']}",
            (20, 75),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.putText(
            frame,
            f"Trip: {latest_metrics['trip']}",
            (20, 110),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 255) if trip_running else (0, 0, 255),
            2
        )

        ok, buffer = cv2.imencode(".jpg", frame)

        if not ok:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" +
            buffer.tobytes() +
            b"\r\n"
        )


@app.route("/")
def index():
    return """
    <html>
        <head>
            <title>JRIP Smart Vehicle Unit</title>
            <style>
                body {
                    background: #f5f7fb;
                    font-family: Arial;
                    margin: 0;
                    padding: 30px;
                    color: #111827;
                }

                .container {
                    max-width: 1100px;
                    margin: auto;
                }

                .header {
                    margin-bottom: 25px;
                }

                .title {
                    font-size: 32px;
                    font-weight: bold;
                }

                .subtitle {
                    color: #6b7280;
                    margin-top: 6px;
                }

                .grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 24px;
                }

                .card {
                    background: white;
                    border-radius: 18px;
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                }

                img {
                    width: 100%;
                    border-radius: 16px;
                }

                .status {
                    display: flex;
                    justify-content: space-between;
                    padding: 14px 0;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 16px;
                }

                .ok {
                    color: #16a34a;
                    font-weight: bold;
                }

                .wait {
                    color: #f59e0b;
                    font-weight: bold;
                }

                .danger {
                    color: #dc2626;
                    font-weight: bold;
                }

                .buttons {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                button {
                    padding: 12px 18px;
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 14px;
                }

                .start {
                    background: #2563eb;
                }

                .stop {
                    background: #dc2626;
                }

                .badge {
                    display: inline-block;
                    padding: 6px 10px;
                    border-radius: 999px;
                    background: #eff6ff;
                    color: #2563eb;
                    font-size: 13px;
                    font-weight: bold;
                    margin-top: 10px;
                }
            </style>
        </head>

        <body>
            <div class="container">
                <div class="header">
                    <div class="title">JRIP Smart Vehicle Unit</div>
                    <div class="subtitle">Live road sensing prototype using vehicle-mounted camera</div>
                    <div class="badge">Camera + AI + GPS Pipeline Prototype</div>
                </div>

                <div class="grid">
                    <div class="card">
                        <h2>Live Camera Feed</h2>
                        <img src="/video_feed">
                    </div>

                    <div class="card">
                        <h2>Trip Control</h2>

                        <div class="buttons">
                            <button class="start" onclick="startTrip()">Start Trip</button>
                            <button class="stop" onclick="stopTrip()">Stop Trip</button>
                        </div>

                        <h2>System Status</h2>

                        <div class="status">
                            <span>Camera</span>
                            <span id="camera" class="wait">Loading...</span>
                        </div>

                        <div class="status">
                            <span>AI Engine</span>
                            <span id="ai" class="ok">Ready</span>
                        </div>

                        <div class="status">
                            <span>GPS</span>
                            <span id="gps" class="wait">Waiting</span>
                        </div>

                        <div class="status">
                            <span>FPS</span>
                            <span id="fps">0</span>
                        </div>

                        <div class="status">
                            <span>Resolution</span>
                            <span id="resolution">640x480</span>
                        </div>

                        <div class="status">
                            <span>Trip</span>
                            <span id="trip" class="danger">Stopped</span>
                        </div>

                        <div class="status">
                            <span>Frames Recorded</span>
                            <span id="frames_recorded">0</span>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                async function updateMetrics() {
                    const res = await fetch('/metrics');
                    const data = await res.json();

                    document.getElementById('camera').innerText = data.camera;
                    document.getElementById('ai').innerText = data.ai;
                    document.getElementById('gps').innerText = data.gps;
                    document.getElementById('fps').innerText = data.fps;
                    document.getElementById('resolution').innerText = data.resolution;
                    document.getElementById('trip').innerText = data.trip;
                    document.getElementById('frames_recorded').innerText = data.frames_recorded;

                    const tripEl = document.getElementById('trip');

                    if (data.trip === "Running") {
                        tripEl.className = "ok";
                    } else {
                        tripEl.className = "danger";
                    }
                }

                async function startTrip() {
                    await fetch('/start_trip', { method: 'POST' });
                    updateMetrics();
                }

                async function stopTrip() {
                    await fetch('/stop_trip', { method: 'POST' });
                    updateMetrics();
                }

                setInterval(updateMetrics, 1000);
                updateMetrics();
            </script>
        </body>
    </html>
    """


@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )


@app.route("/metrics")
def metrics():
    return jsonify(latest_metrics)


@app.route("/start_trip", methods=["POST"])
def start_trip():
    global trip_running, frames_recorded

    trip_running = True
    frames_recorded = 0

    latest_metrics["trip"] = "Running"
    latest_metrics["frames_recorded"] = frames_recorded

    return jsonify({"status": "started"})


@app.route("/stop_trip", methods=["POST"])
def stop_trip():
    global trip_running

    trip_running = False
    latest_metrics["trip"] = "Stopped"

    return jsonify({"status": "stopped"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)