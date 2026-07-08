import csv
from pathlib import Path
from datetime import datetime
import cv2

BASE_DIR = Path(__file__).resolve().parent
LOG_DIR = BASE_DIR / "logs"
IMG_DIR = LOG_DIR / "images"

LOG_DIR.mkdir(exist_ok=True)
IMG_DIR.mkdir(exist_ok=True)

CSV_PATH = LOG_DIR / "detections.csv"


def init_csv():
    if not CSV_PATH.exists():
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                "timestamp",
                "class_name",
                "confidence",
                "image_path"
            ])


def save_detection(frame, class_name, confidence):
    init_csv()

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    image_name = f"{timestamp}_{class_name}_{confidence:.2f}.jpg"
    image_path = IMG_DIR / image_name

    cv2.imwrite(str(image_path), frame)

    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            timestamp,
            class_name,
            round(confidence, 2),
            str(image_path)
        ])