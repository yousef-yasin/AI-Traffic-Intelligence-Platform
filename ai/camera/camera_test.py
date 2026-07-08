import cv2

# افتح الكاميرا
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not cap.isOpened():
    print("❌ Failed to open camera")
    exit()

print("✅ Camera opened successfully!")

while True:
    ret, frame = cap.read()

    if not ret:
        print("❌ Failed to read frame")
        break

    cv2.imshow("Studica Camera Test", frame)

    # اضغط Q للخروج
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()