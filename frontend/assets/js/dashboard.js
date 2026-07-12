const CONDITION_COLORS = {
  excellent: "#10b981",
  good: "#22c55e",
  average: "#f59e0b",
  poor: "#f97316",
  critical: "#ef4444",
};

const PRIORITY_LABELS = { high: "عالي", medium: "متوسط", low: "منخفض" };

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchDashboardData();
  if (!data) return;

  renderKpis(data.kpis);
  renderPriorityList(data.maintenancePriority, "priority-list", 3);
  renderPriorityList(data.maintenancePriority, "priority-list-full");
  renderMap(data.roads);
  renderAlerts(data.alerts);
  renderTrendChart(data.roadHealthTrend);
  renderDistributionChart(data.roadConditionDistribution);
  renderIncidentsChart(data.incidentsByType);
});

/* ===== KPI Cards ===== */
function renderKpis(kpis) {
  const container = document.getElementById("kpi-grid");
  if (!container || !kpis) return;

  container.innerHTML = kpis
    .map(
      (kpi) => `
      <div class="kpi-card">
        <div class="kpi-label">${kpi.label}</div>
        <div class="kpi-value-row">
          <span class="kpi-value">${kpi.value}</span>
          ${kpi.max ? `<span class="kpi-max">/${kpi.max}</span>` : ""}
        </div>
        <span class="kpi-status ${kpi.trend === "up" ? "trend-up" : "trend-down"}">${kpi.status}</span>
      </div>`
    )
    .join("");
}

/* ===== Priority list (يُستخدم بصفحة index.php مختصر وصفحة maintenance.php كامل) ===== */
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
          <strong>${item.roadName}</strong>
          <small>صحة الطريق: ${item.score}/100</small>
        </div>
        <span class="badge badge-${item.priority}">${PRIORITY_LABELS[item.priority]}</span>
      </li>`
    )
    .join("");
}

/* ===== Map (Leaflet) ===== */
function renderMap(roads) {
  const el = document.getElementById("road-map");
  if (!el || !roads) return;

  const map = L.map(el).setView([31.9539, 35.9106], 12); // مركز عمّان

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  roads.forEach((road) => {
    const color = CONDITION_COLORS[road.condition] || "#999";
    L.circleMarker([road.lat, road.lng], {
      radius: 9,
      fillColor: color,
      color: "#fff",
      weight: 2,
      fillOpacity: 0.9,
    })
      .addTo(map)
      .bindPopup(`<strong>${road.name}</strong><br>صحة الطريق: ${road.healthScore}/100`);
  });
}

/* ===== Alerts list ===== */
const ALERT_ICONS = { pothole: "🕳️", crack: "⚠️", congestion: "🚦", accident: "🚨" };

function renderAlerts(alerts) {
  const container = document.getElementById("alerts-list");
  if (!container || !alerts) return;

  container.innerHTML = alerts
    .map(
      (a) => `
      <div class="alert-item">
        <span class="alert-icon">${ALERT_ICONS[a.type] || "⚠️"}</span>
        <div class="alert-info">
          <strong>${a.title}</strong>
          <small>${a.location} - ${a.time}</small>
        </div>
      </div>`
    )
    .join("");
}

/* ===== Charts (Chart.js) ===== */
function renderTrendChart(trend) {
  const el = document.getElementById("trendChart");
  if (!el || !trend) return;

  new Chart(el, {
    type: "line",
    data: {
      labels: trend.labels,
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

  new Chart(el, {
    type: "doughnut",
    data: {
      labels: dist.labels,
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
    totalEl.innerHTML = `<strong>${dist.total.toLocaleString()}</strong>إجمالي الطرق`;
  }
}

function renderIncidentsChart(incidents) {
  const el = document.getElementById("incidentsChart");
  if (!el || !incidents) return;

  new Chart(el, {
    type: "bar",
    data: {
      labels: incidents.labels,
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
