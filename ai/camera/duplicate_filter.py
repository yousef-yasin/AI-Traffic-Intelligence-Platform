import time

last_class = None
last_time = 0

MIN_INTERVAL = 10   # ثواني


def should_save(class_name):

    global last_class, last_time

    current_time = time.time()

    if class_name == last_class:
        if current_time - last_time < MIN_INTERVAL:
            return False

    last_class = class_name
    last_time = current_time

    return True