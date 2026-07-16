import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "jrip_data.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS detections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                detected_at TEXT NOT NULL,
                class_name TEXT NOT NULL,
                confidence REAL NOT NULL,
                latitude REAL,
                longitude REAL,
                speed REAL,
                image_path TEXT
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_detections_time ON detections(detected_at)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_detections_class ON detections(class_name)")
        conn.commit()


def save_detection_record(
    class_name: str,
    confidence: float,
    latitude: Any = None,
    longitude: Any = None,
    speed: Any = None,
    image_path: Optional[str] = None,
) -> int:
    init_db()

    def to_float(value: Any) -> Optional[float]:
        try:
            if value in (None, "", "N/A"):
                return None
            return float(value)
        except (TypeError, ValueError):
            return None

    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO detections
            (detected_at, class_name, confidence, latitude, longitude, speed, image_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                datetime.now().isoformat(timespec="seconds"),
                class_name,
                float(confidence),
                to_float(latitude),
                to_float(longitude),
                to_float(speed),
                image_path,
            ),
        )
        conn.commit()
        return int(cursor.lastrowid)


def _severity(confidence: float) -> str:
    if confidence >= 0.80:
        return "critical"
    if confidence >= 0.65:
        return "poor"
    if confidence >= 0.50:
        return "average"
    return "good"


def _priority(score: int) -> str:
    if score < 50:
        return "high"
    if score < 70:
        return "medium"
    return "low"


def _condition(score: int) -> str:
    if score >= 85:
        return "excellent"
    if score >= 70:
        return "good"
    if score >= 55:
        return "average"
    if score >= 35:
        return "poor"
    return "critical"


def build_dashboard_payload() -> Dict[str, Any]:
    init_db()
    now = datetime.now()
    today = now.date().isoformat()
    yesterday = (now.date() - timedelta(days=1)).isoformat()

    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM detections ORDER BY detected_at ASC").fetchall()

    records = [dict(row) for row in rows]
    total = len(records)
    today_count = sum(1 for r in records if str(r["detected_at"]).startswith(today))
    yesterday_count = sum(1 for r in records if str(r["detected_at"]).startswith(yesterday))

    pothole_like = [r for r in records if "pothole" in r["class_name"].lower()]
    weighted_damage = sum(max(1.0, float(r["confidence"]) * 10) for r in pothole_like)
    road_health = max(0, min(100, round(100 - weighted_damage)))
    safety = max(0, min(100, round(100 - total * 2.5)))
    maintenance_readiness = max(0, min(100, round(100 - len(pothole_like) * 3)))

    delta = today_count - yesterday_count
    delta_text = f"{delta:+d} vs. yesterday"

    # Group nearby GPS points (roughly 100 m cells) so detections stay visible as road/location records.
    groups: Dict[str, Dict[str, Any]] = {}
    for r in records:
        lat, lng = r.get("latitude"), r.get("longitude")
        if lat is None or lng is None:
            continue
        key = f"{round(float(lat), 3):.3f},{round(float(lng), 3):.3f}"
        group = groups.setdefault(
            key,
            {
                "lat_sum": 0.0,
                "lng_sum": 0.0,
                "count": 0,
                "damage": 0.0,
                "classes": {},
            },
        )
        group["lat_sum"] += float(lat)
        group["lng_sum"] += float(lng)
        group["count"] += 1
        group["damage"] += max(2, float(r["confidence"]) * 12)
        name = r["class_name"]
        group["classes"][name] = group["classes"].get(name, 0) + 1

    roads: List[Dict[str, Any]] = []
    for index, (key, group) in enumerate(sorted(groups.items(), key=lambda item: item[1]["damage"], reverse=True), 1):
        score = max(0, min(100, round(100 - group["damage"])))
        dominant_class = max(group["classes"], key=group["classes"].get)
        roads.append(
            {
                "id": f"live-{index}",
                "name": f"Camera location {index} ({dominant_class})",
                "healthScore": score,
                "condition": _condition(score),
                "lat": round(group["lat_sum"] / group["count"], 6),
                "lng": round(group["lng_sum"] / group["count"], 6),
                "detections": group["count"],
            }
        )

    maintenance = [
        {
            "roadId": road["id"],
            "roadName": road["name"],
            "score": road["healthScore"],
            "priority": _priority(road["healthScore"]),
        }
        for road in sorted(roads, key=lambda x: x["healthScore"])
    ]

    # Last 7 calendar days, based only on saved camera detections.
    trend_labels: List[str] = []
    trend_values: List[int] = []
    for offset in range(6, -1, -1):
        day = now.date() - timedelta(days=offset)
        day_prefix = day.isoformat()
        day_rows = [r for r in records if str(r["detected_at"]).startswith(day_prefix)]
        damage = sum(max(1.0, float(r["confidence"]) * 6) for r in day_rows)
        trend_labels.append(day.strftime("%b %d"))
        trend_values.append(max(0, min(100, round(100 - damage))))

    distribution_labels = ["Excellent", "Good", "Average", "Poor", "Critical"]
    distribution_map = {label.lower(): 0 for label in distribution_labels}
    for road in roads:
        distribution_map[road["condition"]] += 1
    distribution_values = [distribution_map[label.lower()] for label in distribution_labels]

    category_counts = {"Potholes": 0, "Cracks": 0, "Congestion": 0, "Accidents": 0, "Broken signals": 0}
    for r in records:
        cls = r["class_name"].lower()
        if "pothole" in cls or "hole" in cls:
            category_counts["Potholes"] += 1
        elif "crack" in cls:
            category_counts["Cracks"] += 1
        elif "congestion" in cls or "traffic" in cls:
            category_counts["Congestion"] += 1
        elif "accident" in cls or "collision" in cls:
            category_counts["Accidents"] += 1
        elif "signal" in cls or "sign" in cls:
            category_counts["Broken signals"] += 1

    latest = list(reversed(records[-8:]))
    alerts = []
    for r in latest:
        location = "GPS unavailable"
        if r.get("latitude") is not None and r.get("longitude") is not None:
            location = f"{float(r['latitude']):.5f}, {float(r['longitude']):.5f}"
        alerts.append(
            {
                "id": f"live-alert-{r['id']}",
                "type": "pothole" if "pothole" in r["class_name"].lower() else "crack",
                "title": r["class_name"].replace("_", " ").title(),
                "location": location,
                "time": str(r["detected_at"]).replace("T", " "),
            }
        )

    status = "No camera data" if total == 0 else ("Good" if road_health >= 70 else "Needs attention")
    return {
        "source": "camera_sqlite",
        "lastUpdated": now.isoformat(timespec="seconds"),
        "kpis": [
            {"id": "road_health", "label": "Road Health Index", "value": road_health, "max": 100, "status": status, "trend": "up" if road_health >= 60 else "down"},
            {"id": "congestion", "label": "Detected Road Load", "value": min(100, today_count * 5), "max": 100, "status": f"{today_count} detections today", "trend": "down"},
            {"id": "safety", "label": "Traffic Safety", "value": safety, "max": 100, "status": status, "trend": "up" if safety >= 60 else "down"},
            {"id": "incidents_today", "label": "Incidents Today", "value": today_count, "max": None, "status": delta_text, "trend": "up" if delta >= 0 else "down"},
            {"id": "maintenance_ratio", "label": "Maintenance Readiness", "value": maintenance_readiness, "max": 100, "status": f"{len(pothole_like)} potholes stored", "trend": "up" if maintenance_readiness >= 60 else "down"},
        ],
        "roads": roads,
        "maintenancePriority": maintenance,
        "roadHealthTrend": {"labels": trend_labels, "values": trend_values},
        "roadConditionDistribution": {
            "labels": distribution_labels,
            "values": distribution_values,
            "total": len(roads),
        },
        "incidentsByType": {
            "labels": list(category_counts.keys()),
            "values": list(category_counts.values()),
        },
        "alerts": alerts,
    }


init_db()
