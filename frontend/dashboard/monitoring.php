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

    <main class="monitoring-page">
      <section class="monitoring-hero">
        <div>
          <span class="monitoring-eyebrow">JRIP Intelligence Center</span>
          <h1>Road Monitoring &amp; Simulation</h1>
          <p>Live camera detections, GPS incidents and SUMO traffic-impact analysis in one operational view.</p>
        </div>
        <div class="monitoring-live-badge" id="monitoring-live-badge">
          <span class="monitoring-live-dot"></span>
          <span>Live monitoring</span>
        </div>
      </section>

      <section class="monitoring-summary-grid" aria-label="Road monitoring summary">
        <article class="monitoring-summary-card">
          <span class="summary-icon"><i data-lucide="road"></i></span>
          <div><small>Monitored roads</small><strong id="monitoring-road-count">0</strong></div>
        </article>
        <article class="monitoring-summary-card">
          <span class="summary-icon"><i data-lucide="triangle-alert"></i></span>
          <div><small>Detected incidents</small><strong id="monitoring-incident-count">0</strong></div>
        </article>
        <article class="monitoring-summary-card">
          <span class="summary-icon"><i data-lucide="activity"></i></span>
          <div><small>Average road health</small><strong id="monitoring-health-score">—</strong></div>
        </article>
        <article class="monitoring-summary-card">
          <span class="summary-icon"><i data-lucide="radio"></i></span>
          <div><small>Data status</small><strong id="monitoring-data-status">Stored</strong></div>
        </article>
      </section>

      <section class="monitoring-top-grid">
        <article class="card monitoring-map-card">
          <div class="monitoring-card-heading">
            <div>
              <span class="section-kicker">Real-world data</span>
              <h2>Live Road Condition Map</h2>
            </div>
            <div class="legend monitoring-legend">
              <span><i class="dot excellent"></i>Excellent</span>
              <span><i class="dot good"></i>Good</span>
              <span><i class="dot average"></i>Average</span>
              <span><i class="dot poor"></i>Poor</span>
              <span><i class="dot critical"></i>Critical</span>
            </div>
          </div>
          <div id="road-map" class="monitoring-map"></div>
          <div class="monitoring-map-footer">
            <span><i data-lucide="database"></i> Data is loaded from the persistent JRIP database</span>
            <span id="monitoring-last-update">Waiting for data…</span>
          </div>
        </article>

        <article class="card monitoring-alert-card">
          <div class="monitoring-card-heading compact">
            <div>
              <span class="section-kicker">Camera &amp; GPS</span>
              <h2>Latest Alerts</h2>
            </div>
            <span class="soft-pill" id="alert-count-pill">0 active</span>
          </div>
          <div id="alerts-list" class="monitoring-alert-list"></div>
        </article>
      </section>

      <section class="card simulation-workspace">
        <div class="simulation-header">
          <div>
            <span class="section-kicker">Scenario analysis</span>
            <h2>Traffic Simulation — SUMO</h2>
            <p>Simulate how detected road damage affects speed, congestion and travel delay before maintenance decisions are made.</p>
          </div>
          <div class="simulation-status" id="simulation-status"><span></span>Ready</div>
        </div>

        <div class="simulation-toolbar">
          <label class="simulation-field">
            <span>Scenario</span>
            <select id="simulation-scenario">
              <option value="detected">Latest detected incident</option>
              <option value="pothole">Pothole lane impact</option>
              <option value="closure">Partial lane closure</option>
              <option value="maintenance">Maintenance diversion</option>
            </select>
          </label>
          <label class="simulation-field">
            <span>Duration</span>
            <select id="simulation-duration">
              <option value="300">5 minutes</option>
              <option value="600" selected>10 minutes</option>
              <option value="900">15 minutes</option>
            </select>
          </label>
          <div class="simulation-actions">
            <button class="simulation-btn primary" id="simulation-start" type="button"><i data-lucide="play"></i>Start Simulation</button>
            <button class="simulation-btn" id="simulation-stop" type="button" disabled><i data-lucide="square"></i>Stop</button>
            <button class="simulation-btn ghost" id="simulation-reset" type="button"><i data-lucide="rotate-ccw"></i>Reset</button>
          </div>
        </div>

        <div class="simulation-grid">
          <div class="simulation-canvas-wrap">
            <div class="simulation-canvas" id="sumo-simulation-canvas">
              <div class="sim-road sim-road-horizontal"></div>
              <div class="sim-road sim-road-vertical"></div>
              <div class="sim-junction"></div>
              <div class="sim-incident-marker"><i data-lucide="construction"></i><span>Detected damage</span></div>
              <span class="sim-car car-a"></span>
              <span class="sim-car car-b"></span>
              <span class="sim-car car-c"></span>
              <span class="sim-car car-d"></span>
              <div class="simulation-placeholder-copy">
                <strong>SUMO Simulation View</strong>
                <span>The Python simulation API will stream scenario status here.</span>
              </div>
            </div>
            <div class="simulation-progress"><span id="simulation-progress-bar"></span></div>
          </div>

          <aside class="simulation-metrics">
            <article><span><i data-lucide="car-front"></i>Vehicles</span><strong id="sim-vehicles">—</strong></article>
            <article><span><i data-lucide="gauge"></i>Average speed</span><strong id="sim-speed">—</strong></article>
            <article><span><i data-lucide="traffic-cone"></i>Congestion</span><strong id="sim-congestion">Ready</strong></article>
            <article><span><i data-lucide="clock-3"></i>Estimated delay</span><strong id="sim-delay">—</strong></article>
          </aside>
        </div>
      </section>

      <section class="monitoring-analysis-grid">
        <article class="card comparison-card">
          <div class="monitoring-card-heading compact">
            <div><span class="section-kicker">Decision support</span><h2>Real Data vs Simulation</h2></div>
          </div>
          <div class="comparison-columns">
            <div class="comparison-pane real-data-pane">
              <span class="comparison-label"><i data-lucide="camera"></i>Real data</span>
              <dl>
                <div><dt>Detected incidents</dt><dd id="comparison-incidents">0</dd></div>
                <div><dt>Average road health</dt><dd id="comparison-health">—</dd></div>
                <div><dt>Affected location</dt><dd id="comparison-location">Not available</dd></div>
              </dl>
            </div>
            <div class="comparison-divider"><i data-lucide="arrow-right-left"></i></div>
            <div class="comparison-pane simulation-data-pane">
              <span class="comparison-label"><i data-lucide="route"></i>Simulation result</span>
              <dl>
                <div><dt>Traffic impact</dt><dd id="comparison-impact">Run simulation</dd></div>
                <div><dt>Predicted delay</dt><dd id="comparison-delay">—</dd></div>
                <div><dt>Suggested diversion</dt><dd id="comparison-diversion">—</dd></div>
              </dl>
            </div>
          </div>
        </article>

        <article class="card recommendation-card">
          <span class="recommendation-icon"><i data-lucide="sparkles"></i></span>
          <div>
            <span class="section-kicker">AI recommendation</span>
            <h2>Recommended Action</h2>
            <p id="simulation-recommendation">Select a scenario and start the simulation to generate a traffic-aware maintenance recommendation.</p>
          </div>
          <span class="recommendation-priority" id="recommendation-priority">Pending analysis</span>
        </article>
      </section>
    </main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
