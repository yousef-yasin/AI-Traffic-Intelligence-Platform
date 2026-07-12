<?php
// taxi/index.php — driver interface. Same data source (data/mock.json) until the API is ready
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP Taxi — Driver App</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/variables.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/taxi.css">
</head>
<body>

<div class="taxi-shell">

  <div class="taxi-topbar">
    <strong data-i18n="taxi_welcome">Welcome, Driver</strong>
    <div>
      <span>🔔</span>
      <button id="langBtn" class="lang-toggle">🌐 عربي</button>
    </div>
  </div>

  <div class="taxi-card">
    <div class="kpi-label" data-i18n="taxi_current_road">Current Road Status</div>
    <div class="kpi-value-row">
      <span class="kpi-value" id="taxi-road-score">--</span>
      <span class="kpi-max">/100</span>
    </div>
  </div>

  <div class="taxi-card">
    <p style="margin-bottom:12px; color:var(--color-text-muted); font-size:13px;" data-i18n="taxi_report_text">
      Saw a pothole or crack on the road? Report it now and help the team improve the map.
    </p>
    <button class="taxi-report-btn" id="reportBtn" data-i18n="taxi_report_btn">📷 Report a Pothole Now</button>
  </div>

  <div class="taxi-card">
    <div class="card-header"><h2 data-i18n="latest_alerts_area">Latest Alerts in Your Area</h2></div>
    <div id="alerts-list"></div>
  </div>

</div>

<script src="../assets/js/i18n.js"></script>
<script src="../assets/js/api.js"></script>
<script src="../assets/js/taxi.js"></script>
</body>
</html>
