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

document.addEventListener("DOMContentLoaded", async () => {
  dashboardData = await fetchDashboardData();
  if (!dashboardData) return;
  renderAll();
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
      const tr = tKpi(kpi);
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

  const labels = tLabelsList("trendLabels", trend.labels);

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
