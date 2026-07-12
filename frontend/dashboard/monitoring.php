<?php
$pageTitleKey = 'page_title_roads';
$activePage = 'roads';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP — Road Status</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="../assets/css/variables.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/layout.css">
<link rel="stylesheet" href="../assets/css/dashboard.css">
</head>
<body>

<div class="layout">

  <?php include __DIR__ . '/../includes/sidebar.php'; ?>

  <div class="main">

    <?php include __DIR__ . '/../includes/navbar.php'; ?>

    <section class="grid-2col">
      <div class="card map-card">
        <div class="card-header">
          <h2 data-i18n="map_title_detailed">Detailed Road Condition Map</h2>
          <div class="legend">
            <span><i class="dot excellent"></i> <span data-i18n="legend_excellent">Excellent</span></span>
            <span><i class="dot good"></i> <span data-i18n="legend_good">Good</span></span>
            <span><i class="dot average"></i> <span data-i18n="legend_average">Average</span></span>
            <span><i class="dot poor"></i> <span data-i18n="legend_poor">Poor</span></span>
            <span><i class="dot critical"></i> <span data-i18n="legend_critical">Critical</span></span>
          </div>
        </div>
        <div id="road-map"></div>
      </div>

      <?php include __DIR__ . '/components/alerts.php'; ?>
    </section>

<?php include __DIR__ . '/../includes/footer.php'; ?>
