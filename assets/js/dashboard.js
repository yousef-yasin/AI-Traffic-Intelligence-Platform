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

  dateElement.textContent = today.toLocaleDateString("en-US", options);
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

/* ===== Roads monitoring page summary + SUMO simulation demo ===== */
let sumoTimer = null;
let sumoTick = 0;

function getKpiValue(id, fallback = 0) {
  const item = dashboardData?.kpis?.find((kpi) => kpi.id === id);
  return Number(item?.value ?? fallback);
}

function updateMonitoringSummary() {
  if (!document.getElementById("monitor-alerts-count") || !dashboardData) return;

  const potholes = Number(dashboardData.incidentsByType?.values?.[0] || 0);
  const roadHealth = getKpiValue("road_health", 100);
  const roads = dashboardData.roads?.length || 0;

  document.getElementById("monitor-alerts-count").textContent = dashboardData.alerts?.length || 0;
  document.getElementById("monitor-potholes-count").textContent = potholes;
  document.getElementById("monitor-health-score").textContent = roadHealth;
  document.getElementById("monitor-roads-count").textContent = roads;

  setText("real-potholes", potholes);
  setText("real-roads", roads);
  setText("real-health", roadHealth);
  setText("real-last-update", formatUpdateTime(dashboardData.lastUpdated));

  const hazard = document.getElementById("sumo-hazard");
  if (hazard) hazard.style.display = potholes > 0 ? "grid" : "none";
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatUpdateTime(value) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function initializeSumoCars() {
  const container = document.getElementById("sumo-cars");
  if (!container || container.children.length) return;

  for (let i = 0; i < 22; i += 1) {
    const car = document.createElement("span");
    car.className = `sumo-car ${i % 7 === 0 ? "slow" : i % 4 === 0 ? "medium" : ""}`;
    car.style.left = `${8 + ((i * 13) % 84)}%`;
    car.style.top = `${14 + ((i * 17) % 72)}%`;
    car.style.transform = `rotate(${i % 3 === 0 ? 20 : i % 2 === 0 ? 86 : -5}deg)`;
    container.appendChild(car);
  }
}

function calculateSimulationResult() {
  const potholes = Number(dashboardData?.incidentsByType?.values?.[0] || 0);
  const roads = Math.max(1, dashboardData?.roads?.length || 0);
  const scenario = document.getElementById("simulation-scenario")?.value || "detected";

  let vehicles = 80 + roads * 18 + potholes * 12;
  let speed = Math.max(16, 58 - potholes * 8);
  let delay = Math.max(1, potholes * 4);
  let impact = potholes === 0 ? "Low" : potholes <= 2 ? "Medium" : "High";

  if (scenario === "normal") {
    vehicles = 90 + roads * 12;
    speed = 52;
    delay = 1;
    impact = "Low";
  } else if (scenario === "closure") {
    vehicles += 35;
    speed = Math.max(12, speed - 14);
    delay += 8;
    impact = "High";
  }

  return { vehicles, speed, delay, impact, potholes };
}

function renderSimulationResult(result, running = false) {
  setText("sim-vehicles", result.vehicles);
  setText("sim-speed", result.speed);
  setText("sim-delay", result.delay);
  setText("sim-congestion", result.impact);
  setText("result-impact", result.impact);
  setText("result-speed", result.speed);
  setText("result-delay", result.delay);
  setText("result-vehicles", result.vehicles);

  const action = result.potholes > 0
    ? "Schedule maintenance for the affected road section and consider temporary rerouting."
    : "No urgent maintenance is required. Continue monitoring the road network.";
  setText("recommended-action", action);
  setText("recommended-priority", `Priority: ${result.impact}`);
  setText("sumo-overlay-text", running ? "Live simulation running" : "Simulation completed");
}

function animateSumoCars() {
  const cars = document.querySelectorAll(".sumo-car");
  sumoTick += 1;
  cars.forEach((car, index) => {
    const x = ((index * 13 + sumoTick * (index % 5 + 1)) % 88) + 5;
    const y = 14 + ((index * 17 + sumoTick * 2) % 70);
    car.style.left = `${x}%`;
    car.style.top = `${y}%`;
  });
}

function startSimulation() {
  if (sumoTimer) return;
  const status = document.getElementById("simulation-status");
  const start = document.getElementById("simulation-start");
  const stop = document.getElementById("simulation-stop");
  if (status) { status.textContent = "Running"; status.className = "simulation-status running"; }
  if (start) start.disabled = true;
  if (stop) stop.disabled = false;

  const result = calculateSimulationResult();
  renderSimulationResult(result, true);
  sumoTimer = setInterval(animateSumoCars, 450);
}

function stopSimulation() {
  if (sumoTimer) clearInterval(sumoTimer);
  sumoTimer = null;
  const status = document.getElementById("simulation-status");
  const start = document.getElementById("simulation-start");
  const stop = document.getElementById("simulation-stop");
  if (status) { status.textContent = "Stopped"; status.className = "simulation-status stopped"; }
  if (start) start.disabled = false;
  if (stop) stop.disabled = true;
  setText("sumo-overlay-text", "Simulation stopped");
}

function resetSimulation() {
  stopSimulation();
  const status = document.getElementById("simulation-status");
  if (status) { status.textContent = "Ready"; status.className = "simulation-status ready"; }
  ["sim-vehicles", "sim-speed", "sim-delay", "result-speed", "result-delay", "result-vehicles"].forEach((id) => setText(id, 0));
  setText("sim-congestion", "—");
  setText("result-impact", "Not run");
  setText("recommended-action", "Run the simulation to generate a recommendation.");
  setText("recommended-priority", "Priority: —");
  setText("sumo-overlay-text", "Press Start Simulation");
}

function initializeMonitoringPage() {
  if (!document.getElementById("simulation-start")) return;
  initializeSumoCars();
  updateMonitoringSummary();
  document.getElementById("simulation-start")?.addEventListener("click", startSimulation);
  document.getElementById("simulation-stop")?.addEventListener("click", stopSimulation);
  document.getElementById("simulation-reset")?.addEventListener("click", resetSimulation);
  document.getElementById("simulation-scenario")?.addEventListener("change", () => {
    if (sumoTimer) renderSimulationResult(calculateSimulationResult(), true);
  });
}

// Extend the existing renderer without changing other dashboard pages.
const originalRenderAll = renderAll;
renderAll = function extendedRenderAll() {
  originalRenderAll();
  updateMonitoringSummary();
};

document.addEventListener("DOMContentLoaded", initializeMonitoringPage);
