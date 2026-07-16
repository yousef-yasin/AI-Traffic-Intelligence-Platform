const CONDITION_COLORS = {
  excellent: "#10b981",
  good: "#22c55e",
  average: "#f59e0b",
  poor: "#f97316",
  critical: "#ef4444",
};

let dashboardData = null;
let charts = { trend: null, distribution: null, incidents: null };
let leafletMap = null;

function updateCurrentDate() {
  const dateElement = document.getElementById("current-date");

  const today = new Date();

  const options = {
   // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  if (dateElement) dateElement.textContent = today.toLocaleDateString("en-US", options);
}
updateCurrentDate();

document.addEventListener("DOMContentLoaded", async () => {
  dashboardData = await fetchDashboardData();
  if (!dashboardData) return;
  renderAll();

  // Keep the dashboard synchronized with detections saved by the camera.
  setInterval(async () => {
    const freshData = await fetchDashboardData();
    if (freshData) {
      dashboardData = freshData;
      renderAll();
    }
  }, 5000);
});

// Re-render dynamic (mock.json-driven) content when the language toggles.
// Static chrome is already handled by i18n.js's applyStaticTranslations().
window.addEventListener("langchange", () => {
  if (dashboardData) renderAll();
});

function renderAll() {
  renderKpis(dashboardData.kpis);
  renderPriorityList(dashboardData.maintenancePriority, "priority-list", 4);
  renderPriorityList(dashboardData.maintenancePriority, "priority-list-full");
  renderMap(dashboardData.roads);
  renderAlerts(dashboardData.alerts);
  renderTrendChart(dashboardData.roadHealthTrend);
  renderDistributionChart(dashboardData.roadConditionDistribution);
  renderIncidentsChart(dashboardData.incidentsByType);
  renderMonitoringSummary(dashboardData);
  renderMonitoringAlerts(dashboardData.alerts);
}

/* ===== KPI Cards ===== */
function renderKpis(kpis) {
  const container = document.getElementById("kpi-grid");
  if (!container || !kpis) return;

  container.innerHTML = kpis
    .map((kpi) => {
      const tr = { label: kpi.label || tKpi(kpi).label, status: kpi.status || tKpi(kpi).status };
      return `
      <div class="kpi-card">
        <div class="kpi-label">${tr.label}</div>
        <div class="kpi-value-row">
          <span class="kpi-value">${kpi.value}</span>
          ${kpi.max ? `<span class="kpi-max">/${kpi.max}</span>` : ""}
        </div>
        <span class="kpi-status ${kpi.trend === "up" ? "trend-up" : "trend-down"}">${tr.status}</span>
      </div>`;
    })
    .join("");
}

/* ===== Priority list (used on index.php short version and maintenance.php full version) ===== */
function renderPriorityList(list, targetId, limit = null) {
  const container = document.getElementById(targetId);
  if (!container || !list) return;

  const items = limit ? list.slice(0, limit) : list;

  container.innerHTML = items
    .map(
      (item, i) => `
      <li class="priority-item">
        <span class="priority-rank">${i + 1}</span>
        <div class="priority-info">
          <strong>${tRoadName(item)}</strong>
          <small>${t("road_health_label")} ${item.score}/100</small>
        </div>
        <span class="badge badge-${item.priority}">${tPriority(item.priority)}</span>
      </li>`
    )
    .join("");
}

/* ===== Map (Leaflet) ===== */
function renderMap(roads) {
  const el = document.getElementById("road-map");
  if (!el || !roads) return;

  // Re-rendering on language change: reuse the existing map instance
  // instead of re-initializing Leaflet on the same container.
  if (!leafletMap) {
    leafletMap = L.map(el).setView([31.9539, 35.9106], 12); // Amman center
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(leafletMap);
    leafletMap._markers = [];
  }

  leafletMap._markers.forEach((m) => leafletMap.removeLayer(m));
  leafletMap._markers = [];

  roads.forEach((road) => {
    const color = CONDITION_COLORS[road.condition] || "#999";
    const marker = L.circleMarker([road.lat, road.lng], {
      radius: 9,
      fillColor: color,
      color: "#fff",
      weight: 2,
      fillOpacity: 0.9,
    })
      .addTo(leafletMap)
      .bindPopup(`<strong>${tRoadName(road)}</strong><br>${t("road_health_label")} ${road.healthScore}/100`);
    leafletMap._markers.push(marker);
  });

  if (roads.length > 0) {
    const bounds = L.latLngBounds(roads.map((road) => [road.lat, road.lng]));
    leafletMap.fitBounds(bounds.pad(0.25), { maxZoom: 16 });
  }
}

/* ===== Alerts list ===== */
const ALERT_ICONS = { pothole: "\ud83d\udd73\ufe0f", crack: "\u26a0\ufe0f", congestion: "\ud83d\udea6", accident: "\ud83d\udea8" };

function renderAlerts(alerts) {
  const container = document.getElementById("alerts-list");
  if (!container || !alerts) return;

  container.innerHTML = alerts
    .map((a) => {
      const tr = tAlert(a);
      return `
      <div class="alert-item">
        <span class="alert-icon">${ALERT_ICONS[a.type] || "\u26a0\ufe0f"}</span>
        <div class="alert-info">
          <strong>${tr.title}</strong>
          <small>${tr.location} - ${tr.time}</small>
        </div>
      </div>`;
    })
    .join("");
}

/* ===== Charts (Chart.js) ===== */
function renderTrendChart(trend) {
  const el = document.getElementById("trendChart");
  if (!el || !trend) return;

  const labels = trend.labels;

  if (charts.trend) charts.trend.destroy();
  charts.trend = new Chart(el, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          data: trend.values,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,.08)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 100 } },
    },
  });
}

function renderDistributionChart(dist) {
  const el = document.getElementById("distributionChart");
  if (!el || !dist) return;

  const labels = tLabelsList("distributionLabels", dist.labels);

  if (charts.distribution) charts.distribution.destroy();
  charts.distribution = new Chart(el, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: dist.values,
          backgroundColor: [
            CONDITION_COLORS.excellent,
            CONDITION_COLORS.good,
            CONDITION_COLORS.average,
            CONDITION_COLORS.poor,
            CONDITION_COLORS.critical,
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "70%",
      plugins: { legend: { position: "bottom", labels: { font: { size: 10 } } } },
    },
  });

  const totalEl = document.getElementById("donut-total");
  if (totalEl) {
    totalEl.innerHTML = `<strong>${dist.total.toLocaleString()}</strong>${t("total_roads")}`;
  }
}

function renderIncidentsChart(incidents) {
  const el = document.getElementById("incidentsChart");
  if (!el || !incidents) return;

  const labels = tLabelsList("incidentLabels", incidents.labels);

  if (charts.incidents) charts.incidents.destroy();
  charts.incidents = new Chart(el, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data: incidents.values,
          backgroundColor: "#2563eb",
          borderRadius: 6,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { font: { size: 10 } } } },
    },
  });
}

/* ========================================================================== 
   MONITORING PAGE + REAL SUMO API WORKSPACE
   Stage 3: Start / Stop / Reset now control the Python SUMO service on port
   5002. Metrics are polled automatically and rendered without page refresh.
   ========================================================================== */

const SUMO_API_BASE = "http://127.0.0.1:5002";
let sumoPollTimer = null;

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function getIncidentTotal(data) {
  if (!data) return 0;
  const incidentKpi = Array.isArray(data.kpis)
    ? data.kpis.find((item) => /incident/i.test(String(item.label || item.key || "")))
    : null;
  if (incidentKpi && Number.isFinite(Number(incidentKpi.value))) return Number(incidentKpi.value);
  if (data.incidentsByType && Array.isArray(data.incidentsByType.values)) {
    return data.incidentsByType.values.reduce((sum, value) => sum + Number(value || 0), 0);
  }
  return Array.isArray(data.alerts) ? data.alerts.length : 0;
}

function getAverageHealth(data) {
  if (!data) return null;
  const healthKpi = Array.isArray(data.kpis)
    ? data.kpis.find((item) => /health/i.test(String(item.label || item.key || "")))
    : null;
  if (healthKpi && Number.isFinite(Number(healthKpi.value))) return Number(healthKpi.value);
  if (Array.isArray(data.roads) && data.roads.length) {
    const values = data.roads.map((road) => Number(road.healthScore)).filter(Number.isFinite);
    if (values.length) return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }
  return null;
}

function renderMonitoringSummary(data) {
  if (!document.querySelector(".monitoring-page") || !data) return;
  const roads = Array.isArray(data.roads) ? data.roads : [];
  const alerts = Array.isArray(data.alerts) ? data.alerts : [];
  const incidents = getIncidentTotal(data);
  const health = getAverageHealth(data);

  setText("monitoring-road-count", roads.length);
  setText("monitoring-incident-count", incidents);
  setText("monitoring-health-score", health === null ? "—" : `${health}/100`);
  setText("monitoring-data-status", "Stored & live");
  setText("alert-count-pill", `${alerts.length} active`);
  setText("comparison-incidents", incidents);
  setText("comparison-health", health === null ? "—" : `${health}/100`);

  const latestRoad = roads[roads.length - 1];
  const latestAlert = alerts[0];
  const location = latestRoad?.name || latestRoad?.name_en || latestAlert?.location || "Not available";
  setText("comparison-location", location);
  setText("monitoring-last-update", `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`);

  const badge = document.getElementById("monitoring-live-badge");
  if (badge) {
    badge.classList.add("is-online");
    const label = badge.querySelector("span:last-child");
    if (label) label.textContent = "Database connected";
  }
}

function renderMonitoringAlerts(alerts) {
  const container = document.getElementById("alerts-list");
  if (!container) return;
  const list = Array.isArray(alerts) ? alerts : [];
  if (!list.length) {
    container.innerHTML = `<div class="monitoring-empty-state"><span>✓</span><strong>No active alerts</strong><small>Stored incidents will appear here automatically.</small></div>`;
    return;
  }
  container.innerHTML = list.slice(0, 8).map((alert) => {
    const translated = typeof tAlert === "function" ? tAlert(alert) : alert;
    const title = translated.title || alert.title || "Road incident";
    const location = translated.location || alert.location || "GPS unavailable";
    const time = translated.time || alert.time || "Recently";
    const icon = ALERT_ICONS[alert.type] || "⚠️";
    return `<div class="alert-item"><span class="alert-icon">${icon}</span><div class="alert-info"><strong>${title}</strong><small>${location} · ${time}</small></div></div>`;
  }).join("");
}

function setSimulationStatus(label, mode = "ready") {
  const status = document.getElementById("simulation-status");
  if (!status) return;
  status.className = `simulation-status ${mode}`;
  status.innerHTML = `<span></span>${label}`;
}

function setSimulationButtons(running) {
  const start = document.getElementById("simulation-start");
  const stop = document.getElementById("simulation-stop");
  if (start) start.disabled = running;
  if (stop) stop.disabled = !running;
}

function renderSumoState(state) {
  if (!state) return;
  const status = String(state.status || "ready").toLowerCase();
  const isRunning = ["starting", "running", "stopping"].includes(status);
  setSimulationButtons(isRunning);
  setSimulationStatus(status.charAt(0).toUpperCase() + status.slice(1), status);

  const canvas = document.getElementById("sumo-simulation-canvas");
  canvas?.classList.toggle("is-running", status === "running");

  setText("sim-vehicles", Number(state.vehicles || 0));
  setText("sim-speed", `${Number(state.average_speed || 0).toFixed(1)} km/h`);
  setText("sim-congestion", state.congestion || "Ready");
  setText("sim-delay", `${Number(state.estimated_delay || 0).toFixed(1)} min`);
  setText("comparison-impact", state.congestion ? `${state.congestion} congestion` : "Run simulation");
  setText("comparison-delay", `${Number(state.estimated_delay || 0).toFixed(1)} min`);
  setText("comparison-diversion", state.diversion || "—");
  setText("simulation-recommendation", state.error || state.recommendation || "Waiting for SUMO analysis.");
  setText("recommendation-priority", state.priority || "Pending analysis");

  const progress = document.getElementById("simulation-progress-bar");
  if (progress) progress.style.width = `${Math.max(0, Math.min(100, Number(state.progress || 0)))}%`;
}

async function callSumoApi(path, options = {}) {
  const response = await fetch(`${SUMO_API_BASE}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || `SUMO API error ${response.status}`);
  return data;
}

async function pollSumoStatus() {
  try {
    const state = await callSumoApi("/api/simulation/status");
    renderSumoState(state);
    if (["completed", "stopped", "ready", "error"].includes(String(state.status).toLowerCase())) {
      clearInterval(sumoPollTimer);
      sumoPollTimer = null;
    }
  } catch (error) {
    clearInterval(sumoPollTimer);
    sumoPollTimer = null;
    setSimulationButtons(false);
    setSimulationStatus("SUMO API offline", "error");
    setText("simulation-recommendation", `Run python ai/simulation/sumo_server.py. ${error.message}`);
    setText("recommendation-priority", "Service offline");
    document.getElementById("sumo-simulation-canvas")?.classList.remove("is-running");
  }
}

async function startMonitoringSimulation() {
  const scenario = document.getElementById("simulation-scenario")?.value || "detected";
  const duration = Number(document.getElementById("simulation-duration")?.value || 600);
  const incidents = getIncidentTotal(dashboardData);
  try {
    setSimulationButtons(true);
    setSimulationStatus("Starting", "starting");
    const result = await callSumoApi("/api/simulation/start", {
      method: "POST",
      body: JSON.stringify({ scenario, duration, incidents }),
    });
    renderSumoState(result.state);
    clearInterval(sumoPollTimer);
    sumoPollTimer = setInterval(pollSumoStatus, 1000);
    pollSumoStatus();
  } catch (error) {
    setSimulationButtons(false);
    setSimulationStatus("Cannot start", "error");
    setText("simulation-recommendation", error.message);
    setText("recommendation-priority", "Configuration required");
  }
}

async function stopMonitoringSimulation() {
  try {
    const result = await callSumoApi("/api/simulation/stop", { method: "POST", body: "{}" });
    renderSumoState(result.state);
    if (!sumoPollTimer) sumoPollTimer = setInterval(pollSumoStatus, 1000);
  } catch (error) {
    setSimulationStatus("Stop failed", "error");
    setText("simulation-recommendation", error.message);
  }
}

async function resetMonitoringSimulation() {
  clearInterval(sumoPollTimer);
  sumoPollTimer = null;
  try {
    const result = await callSumoApi("/api/simulation/reset", { method: "POST", body: "{}" });
    renderSumoState(result.state);
  } catch (error) {
    renderSumoState({ status: "ready", vehicles: 0, average_speed: 0, congestion: "Ready", estimated_delay: 0, progress: 0, diversion: "—", recommendation: "Start the SUMO API to enable real simulation.", priority: "Service offline" });
  }
}

function initializeMonitoringWorkspace() {
  if (!document.querySelector(".monitoring-page")) return;
  document.getElementById("simulation-start")?.addEventListener("click", startMonitoringSimulation);
  document.getElementById("simulation-stop")?.addEventListener("click", stopMonitoringSimulation);
  document.getElementById("simulation-reset")?.addEventListener("click", resetMonitoringSimulation);
  pollSumoStatus();
}

document.addEventListener("DOMContentLoaded", initializeMonitoringWorkspace);
