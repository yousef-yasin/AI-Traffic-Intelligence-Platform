import csv
import os
from datetime import datetime


FILE_NAME = "trip_data.csv"


def save_trip_data(class_name, confidence, latitude, longitude, speed):

    file_exists = os.path.isfile(FILE_NAME)

    with open(FILE_NAME, "a", newline="") as file:

        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "time",
                "class",
                "confidence",
                "latitude",
                "longitude",
                "speed"
            ])

        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            class_name,
            confidence,
            latitude,
            longitude,
            speed
        ])