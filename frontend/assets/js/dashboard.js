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
  if (data) {
    renderKpis(data.kpis);
  renderPriorityList(data.maintenancePriority, "priority-list", 3);
  renderPriorityList(data.maintenancePriority, "priority-list-full");
  renderMap(data.roads);
  renderAlerts(data.alerts);
  renderTrendChart(data.roadHealthTrend);
  renderDistributionChart(data.roadConditionDistribution);
    renderIncidentsChart(data.incidentsByType);
  }

  initLiveRoadMonitoring();
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


/* ===== Live AI road map (/road_stats + /potholes) ===== */
const LIVE_API_BASE = "http://127.0.0.1:5000";
let liveRoadMap = null;
let livePotholeLayer = null;

function severityFromConfidence(confidence) {
  const value = Number(confidence) || 0;
  if (value >= 0.80) return { key: "high", label: "أولوية عالية", color: "#ef4444", radius: 15 };
  if (value >= 0.60) return { key: "medium", label: "أولوية متوسطة", color: "#f59e0b", radius: 12 };
  return { key: "low", label: "أولوية منخفضة", color: "#22c55e", radius: 9 };
}

function initLiveRoadMonitoring() {
  const mapElement = document.getElementById("road-map");
  if (!mapElement || typeof L === "undefined") return;

  // يمنع إنشاء خريطتين في حال كانت بيانات mock موجودة.
  if (mapElement._leaflet_id) {
    const oldMap = Object.values(window).find(v => v && v._container === mapElement);
    try { oldMap && oldMap.remove(); } catch (_) {}
    mapElement._leaflet_id = null;
    mapElement.innerHTML = "";
  }

  liveRoadMap = L.map(mapElement).setView([32.03619239017797, 35.87200139587166], 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 20,
  }).addTo(liveRoadMap);
  livePotholeLayer = L.layerGroup().addTo(liveRoadMap);

  refreshLiveRoadDashboard();
  setInterval(refreshLiveRoadDashboard, 3000);
}

async function refreshLiveRoadDashboard() {
  await Promise.allSettled([loadLiveRoadStats(), loadLivePotholes()]);
  const updateEl = document.getElementById("last-update");
  if (updateEl) updateEl.textContent = new Date().toLocaleTimeString("ar-JO");
}

async function loadLiveRoadStats() {
  try {
    const response = await fetch(`${LIVE_API_BASE}/road_stats`, { cache: "no-store" });
    if (!response.ok) throw new Error("road_stats unavailable");
    const stats = await response.json();

    setText("live-total", stats.total ?? 0);
    setText("live-high", stats.high ?? 0);
    setText("live-medium", stats.medium ?? 0);
    setText("live-low", stats.low ?? 0);

    const health = Math.max(0, Math.min(100, Number(stats.road_health ?? 100)));
    setText("live-health", `${Math.round(health)}%`);
    setText("live-status", translateRoadStatus(stats.status));
    const ring = document.getElementById("health-ring");
    if (ring) ring.style.background = `conic-gradient(${healthColor(health)} ${health}%, #e5e7eb 0)`;

    const total = Number(stats.total) || 0;
    const rate = total ? Math.round(((Number(stats.high) || 0) / total) * 100) : 0;
    setText("high-rate", `${rate}%`);
    const rateBar = document.getElementById("high-rate-bar");
    if (rateBar) rateBar.style.width = `${rate}%`;
  } catch (error) {
    showMapMessage("شغّلي camera_stream.py لعرض البيانات المباشرة", false);
  }
}

async function loadLivePotholes() {
  try {
    const response = await fetch(`${LIVE_API_BASE}/potholes`, { cache: "no-store" });
    if (!response.ok) throw new Error("potholes unavailable");
    const points = await response.json();
    if (!Array.isArray(points)) return;

    livePotholeLayer.clearLayers();
    const bounds = [];
    const priorityItems = [];

    points.forEach((point, index) => {
      const lat = Number(point.latitude);
      const lng = Number(point.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const severity = severityFromConfidence(point.confidence);
      L.circleMarker([lat, lng], {
        radius: severity.radius,
        color: "#fff",
        weight: 2,
        fillColor: severity.color,
        fillOpacity: 0.88,
      }).addTo(livePotholeLayer).bindPopup(`
        <div dir="rtl" style="font-family:Cairo,sans-serif;min-width:170px">
          <strong>ضرر في الطريق</strong><br>
          النوع: حفرة<br>
          الأولوية: ${severity.label}<br>
          دقة الكشف: ${Math.round((Number(point.confidence) || 0) * 100)}%<br>
          الإحداثيات: ${lat.toFixed(5)}, ${lng.toFixed(5)}
        </div>`);

      bounds.push([lat, lng]);
      priorityItems.push({
        roadName: point.road_name || point.street || `موقع الضرر ${index + 1}`,
        score: Math.max(0, Math.round(100 - (Number(point.confidence) || 0) * 100)),
        priority: severity.key,
      });
    });

    if (bounds.length) {
      liveRoadMap.fitBounds(bounds, { padding: [35, 35], maxZoom: 17 });
      showMapMessage(`تم عرض ${bounds.length} موقع ضرر`, true);
    } else {
      showMapMessage("لا توجد أضرار مسجلة حاليًا", false);
    }

    priorityItems.sort((a, b) => a.score - b.score);
    if (priorityItems.length) renderPriorityList(priorityItems, "priority-list", 5);
  } catch (error) {
    showMapMessage("تعذر الاتصال بخادم الذكاء الاصطناعي على المنفذ 5000", false);
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function translateRoadStatus(status) {
  const labels = { Excellent: "ممتاز", Good: "جيد", Fair: "متوسط", Poor: "سيئ", Critical: "خطير" };
  return labels[status] || status || "ممتاز";
}

function healthColor(value) {
  if (value >= 80) return "#22c55e";
  if (value >= 60) return "#f59e0b";
  return "#ef4444";
}

function showMapMessage(message, autoHide) {
  const element = document.getElementById("map-message");
  if (!element) return;
  element.textContent = message;
  element.classList.remove("hidden");
  if (autoHide) setTimeout(() => element.classList.add("hidden"), 1800);
}
