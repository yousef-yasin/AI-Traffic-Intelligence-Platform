import csv
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FILE_NAME = BASE_DIR / "trip_data.csv"


def save_trip_data(class_name, confidence, latitude, longitude, speed):
    file_exists = FILE_NAME.is_file()

    with FILE_NAME.open("a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "time",
                "class",
                "confidence",
                "latitude",
                "longitude",
                "speed",
            ])

        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            class_name,
            confidence,
            latitude,
            longitude,
            speed,
        ])
