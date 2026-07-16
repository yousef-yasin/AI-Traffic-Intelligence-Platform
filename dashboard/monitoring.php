<?php
$pageTitleKey = 'page_title_roads';
$activePage = 'roads';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP — Road Monitoring & Simulation</title>
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

    <div class="roads-page-heading">
      <div>
        <h1>Road Monitoring &amp; Simulation Dashboard</h1>
        <p>Real-time road conditions, alerts, and traffic simulation</p>
      </div>
      <div class="live-status-chip">
        <span class="status-dot"></span>
        Live data
      </div>
    </div>

    <section class="monitoring-top-grid">
      <div class="card map-card monitoring-map-card">
        <div class="card-header">
          <h2>Detailed Road Condition Map</h2>
          <div class="legend">
            <span><i class="dot excellent"></i> Excellent</span>
            <span><i class="dot good"></i> Good</span>
            <span><i class="dot average"></i> Average</span>
            <span><i class="dot poor"></i> Poor</span>
            <span><i class="dot critical"></i> Critical</span>
          </div>
        </div>
        <div id="road-map"></div>
      </div>

      <div class="monitoring-side-column">
        <?php include __DIR__ . '/components/alerts.php'; ?>

        <div class="monitoring-mini-stats">
          <div class="mini-stat-card">
            <span class="mini-stat-icon danger"><i data-lucide="triangle-alert"></i></span>
            <strong id="monitor-alerts-count">0</strong>
            <small>Total Alerts</small>
          </div>
          <div class="mini-stat-card">
            <span class="mini-stat-icon warning"><i data-lucide="circle-dot"></i></span>
            <strong id="monitor-potholes-count">0</strong>
            <small>Potholes Stored</small>
          </div>
          <div class="mini-stat-card">
            <span class="mini-stat-icon success"><i data-lucide="shield-check"></i></span>
            <strong id="monitor-health-score">100</strong>
            <small>Avg. Road Health</small>
          </div>
          <div class="mini-stat-card">
            <span class="mini-stat-icon info"><i data-lucide="route"></i></span>
            <strong id="monitor-roads-count">0</strong>
            <small>Roads Monitored</small>
          </div>
        </div>
      </div>
    </section>

    <section class="simulation-layout">
      <div class="card simulation-card">
        <div class="simulation-header">
          <div class="simulation-title-row">
            <h2>Traffic Simulation (SUMO)</h2>
            <span id="simulation-status" class="simulation-status ready">Ready</span>
          </div>
          <div class="simulation-actions">
            <button id="simulation-start" class="simulation-btn primary" type="button">
              <i data-lucide="play"></i> Start Simulation
            </button>
            <button id="simulation-stop" class="simulation-btn danger" type="button" disabled>
              <i data-lucide="square"></i> Stop
            </button>
            <button id="simulation-reset" class="simulation-btn" type="button">
              <i data-lucide="rotate-ccw"></i> Reset
            </button>
            <select id="simulation-scenario" class="simulation-select" aria-label="Simulation scenario">
              <option value="detected">With Detected Potholes</option>
              <option value="normal">Normal Traffic</option>
              <option value="closure">Lane Closure</option>
            </select>
          </div>
        </div>

        <div class="simulation-content">
          <div class="simulation-metrics">
            <div class="simulation-metric">
              <span><i data-lucide="car-front"></i></span>
              <div><small>Vehicles on Road</small><strong id="sim-vehicles">0</strong></div>
            </div>
            <div class="simulation-metric">
              <span><i data-lucide="gauge"></i></span>
              <div><small>Average Speed</small><strong><span id="sim-speed">0</span> km/h</strong></div>
            </div>
            <div class="simulation-metric">
              <span><i data-lucide="chart-no-axes-column-increasing"></i></span>
              <div><small>Congestion Level</small><strong id="sim-congestion" class="metric-medium">—</strong></div>
            </div>
            <div class="simulation-metric">
              <span><i data-lucide="clock-3"></i></span>
              <div><small>Estimated Delay</small><strong><span id="sim-delay">0</span> min</strong></div>
            </div>
          </div>

          <div id="sumo-visual" class="sumo-visual">
            <div class="sumo-road road-horizontal"></div>
            <div class="sumo-road road-vertical"></div>
            <div class="sumo-road road-diagonal"></div>
            <div id="sumo-cars" class="sumo-cars"></div>
            <div id="sumo-hazard" class="sumo-hazard" title="Detected pothole">
              <i data-lucide="triangle-alert"></i>
            </div>
            <div class="sumo-overlay">
              <strong>SUMO Traffic View</strong>
              <small id="sumo-overlay-text">Press Start Simulation</small>
            </div>
            <div class="speed-legend"><span>Speed</span><i class="slow"></i>0–25 <i class="medium"></i>25–60 <i class="fast"></i>60+</div>
          </div>
        </div>
      </div>

      <div class="card comparison-card">
        <div class="card-header"><h2>Real Data vs Simulation</h2></div>

        <div class="comparison-columns">
          <div class="comparison-panel">
            <h3>Real (Camera &amp; GPS)</h3>
            <div class="comparison-row"><span><i data-lucide="circle-check"></i> Detected Potholes</span><strong id="real-potholes">0</strong></div>
            <div class="comparison-row"><span><i data-lucide="map-pinned"></i> Affected Roads</span><strong id="real-roads">0</strong></div>
            <div class="comparison-row"><span><i data-lucide="heart-pulse"></i> Road Health</span><strong><span id="real-health">100</span>/100</strong></div>
            <div class="comparison-row"><span><i data-lucide="clock"></i> Last Update</span><strong id="real-last-update">—</strong></div>
          </div>

          <div class="comparison-panel simulation-result-panel">
            <h3>Simulation Result</h3>
            <div class="comparison-row"><span><i data-lucide="activity"></i> Traffic Impact</span><strong id="result-impact">Not run</strong></div>
            <div class="comparison-row"><span><i data-lucide="gauge"></i> Avg. Speed</span><strong><span id="result-speed">0</span> km/h</strong></div>
            <div class="comparison-row"><span><i data-lucide="timer"></i> Delay</span><strong><span id="result-delay">0</span> min</strong></div>
            <div class="comparison-row"><span><i data-lucide="car"></i> Affected Vehicles</span><strong id="result-vehicles">0</strong></div>
          </div>
        </div>

        <div class="recommendation-box">
          <div class="recommendation-icon"><i data-lucide="wrench"></i></div>
          <div>
            <small>Recommended Action</small>
            <strong id="recommended-action">Run the simulation to generate a recommendation.</strong>
            <span id="recommended-priority">Priority: —</span>
          </div>
        </div>
      </div>
    </section>

    <section class="monitoring-bottom-grid">
      <div class="card">
        <div class="card-header"><h2>Road Health Trend</h2><small>Last 7 Days</small></div>
        <canvas id="trendChart"></canvas>
      </div>

      <div class="card distribution-card">
        <div class="card-header"><h2>Road Condition Distribution</h2></div>
        <canvas id="distributionChart"></canvas>
        <div class="donut-center" id="donut-total"></div>
      </div>

      <div class="card">
        <div class="card-header"><h2>Incidents by Type</h2></div>
        <canvas id="incidentsChart"></canvas>
      </div>

      <div class="card priority-card-compact">
        <div class="card-header"><h2>Top Priority Roads</h2><a href="maintenance.php" class="link">View All</a></div>
        <ul id="priority-list" class="priority-list"></ul>
      </div>
    </section>

<?php include __DIR__ . '/../includes/footer.php'; ?>
