<?php
// taxi/index.php — واجهة السائق. نفس نمط البيانات (data/mock.json) لحد ما يجهز الـ API
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP Taxi — واجهة السائق</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/variables.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/taxi.css">
</head>
<body>

<div class="taxi-shell">

  <div class="taxi-topbar">
    <strong>مرحبًا، السائق</strong>
    <span>🔔</span>
  </div>

  <div class="taxi-card">
    <div class="kpi-label">حالة الطريق الحالي</div>
    <div class="kpi-value-row">
      <span class="kpi-value" id="taxi-road-score">--</span>
      <span class="kpi-max">/100</span>
    </div>
  </div>

  <div class="taxi-card">
    <p style="margin-bottom:12px; color:var(--color-text-muted); font-size:13px;">
      شفت حفرة أو تشقق بالطريق؟ بلّغ فورًا وساعد الفريق يحسّن الخريطة.
    </p>
    <button class="taxi-report-btn" id="reportBtn">📷 بلّغ عن حفرة الآن</button>
  </div>

  <div class="taxi-card">
    <div class="card-header"><h2>أحدث التنبيهات بمنطقتك</h2></div>
    <div id="alerts-list"></div>
  </div>

</div>

<script src="../assets/js/api.js"></script>
<script src="../assets/js/taxi.js"></script>
</body>
</html>
