<?php
$pageTitleKey = 'page_title_simulation';
$activePage = 'simulation';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP — Road Simulation</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="../assets/css/variables.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/layout.css">
<link rel="stylesheet" href="../assets/css/dashboard.css">
<link rel="stylesheet" href="../assets/css/simulation.css">
</head>
<body>

<div class="layout">

  <?php include __DIR__ . '/../includes/sidebar.php'; ?>

  <div class="main">

    <?php include __DIR__ . '/../includes/navbar.php'; ?>

    <?php include __DIR__ . '/components/simulation-control.php'; ?>

    <section class="grid-2col">
      <div class="card map-card">
        <div class="card-header">
          <h2 data-i18n="sim_map_title">Live Simulated Road Map</h2>
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

      <?php include __DIR__ . '/components/simulation-feed.php'; ?>
    </section>

  </div><!-- /.main -->
</div><!-- /.layout -->

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
<script src="../assets/js/i18n.js"></script>
<script src="../assets/js/api.js"></script>
<script src="../assets/js/dashboard.js"></script>
<script src="../assets/js/simulation.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
</body>
</html>

