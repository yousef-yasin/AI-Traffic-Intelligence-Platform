/**
 * simulation.js
 * Drives the "Road Simulation" page (dashboard/monitoring.php).
 * Runs entirely client-side: on each tick it nudges each road's health
 * score according to the selected scenario, re-renders the shared map
 * (from dashboard.js), and streams a fake AI-detection event into the
 * live feed as if a driver's camera had just reported something.
 */

let simTimer = null;
let simRunning = false;
let simElapsedSeconds = 0;
let simScenarios = null;

const SIM_TICK_MS = 2000;
const SIM_EVENT_TYPES = ["pothole", "crack", "congestion", "clear"];
const SIM_EVENT_ICONS = { pothole: "\ud83d\udd73\ufe0f", crack: "\u26a0\ufe0f", congestion: "\ud83d\udea6", clear: "\u2705" };

function simRandBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function simClamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function conditionFromScore(score) {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "average";
  if (score >= 25) return "poor";
  return "critical";
}

async function initSimulation() {
  // Wait for dashboard.js to have fetched the shared mock/API data.
  let tries = 0;
  while (!dashboardData && tries < 40) {
    await new Promise((r) => setTimeout(r, 100));
    tries++;
  }
  if (!dashboardData) return;

  const res = await fetch(
    USE_MOCK ? MOCK_URL : `${API_BASE}/dashboard`
  ).catch(() => null);
  simScenarios = (res && res.ok ? await res.json() : dashboardData).simulationScenarios || [
    { id: "normal", roadDelta: [0, 1], eventRate: 0.15, eventSeverityBias: "low" },
    { id: "rain", roadDelta: [-3, -1], eventRate: 0.45, eventSeverityBias: "high" },
    { id: "rush", roadDelta: [-1, 0], eventRate: 0.35, eventSeverityBias: "medium" },
    { id: "closure", roadDelta: [-2, 0], eventRate: 0.25, eventSeverityBias: "medium" },
  ];

  const playBtn = document.getElementById("sim-play-btn");
  const resetBtn = document.getElementById("sim-reset-btn");
  if (playBtn) playBtn.addEventListener("click", toggleSimulation);
  if (resetBtn) resetBtn.addEventListener("click", resetSimulation);

  updateSimStatusBadge();
}

function currentScenario() {
  const select = document.getElementById("sim-scenario");
  const id = select ? select.value : "normal";
  return (simScenarios || []).find((s) => s.id === id) || { roadDelta: [0, 1], eventRate: 0.15, eventSeverityBias: "low" };
}

function currentSpeedMultiplier() {
  const select = document.getElementById("sim-speed");
  return select ? parseInt(select.value, 10) || 1 : 1;
}

function toggleSimulation() {
  simRunning ? pauseSimulation() : runSimulation();
}

function runSimulation() {
  if (simRunning) return;
  simRunning = true;
  updateSimStatusBadge();
  scheduleTick();
}

function scheduleTick() {
  clearTimeout(simTimer);
  if (!simRunning) return;
  const speed = currentSpeedMultiplier();
  simTimer = setTimeout(() => {
    simTick();
    scheduleTick();
  }, SIM_TICK_MS / speed);
}

function pauseSimulation() {
  simRunning = false;
  clearTimeout(simTimer);
  updateSimStatusBadge();
}

function resetSimulation() {
  pauseSimulation();
  simElapsedSeconds = 0;
  updateElapsedDisplay();
  const feedList = document.getElementById("sim-feed-list");
  const emptyMsg = document.getElementById("sim-feed-empty");
  if (feedList) {
    feedList.innerHTML = "";
    if (emptyMsg) feedList.appendChild(emptyMsg);
  }
  if (dashboardData) {
    fetchDashboardData().then((fresh) => {
      if (!fresh) return;
      dashboardData.roads = fresh.roads;
      renderMap(dashboardData.roads);
    });
  }
}

function updateSimStatusBadge() {
  const badge = document.getElementById("sim-status-badge");
  const playBtn = document.getElementById("sim-play-btn");
  if (!badge) return;
  badge.classList.remove("running", "paused");
  if (simRunning) {
    badge.classList.add("running");
    badge.textContent = t("sim_status_running");
    if (playBtn) playBtn.querySelector("span").textContent = t("sim_pause");
  } else {
    badge.classList.add("paused");
    badge.textContent = simElapsedSeconds > 0 ? t("sim_status_paused") : t("sim_status_idle");
    if (playBtn) playBtn.querySelector("span").textContent = t("sim_play");
  }
}

function updateElapsedDisplay() {
  const el = document.getElementById("sim-elapsed");
  if (!el) return;
  const m = String(Math.floor(simElapsedSeconds / 60)).padStart(2, "0");
  const s = String(simElapsedSeconds % 60).padStart(2, "0");
  el.textContent = `${m}:${s}`;
}

function simTick() {
  simElapsedSeconds += 2;
  updateElapsedDisplay();

  const scenario = currentScenario();
  if (!dashboardData || !dashboardData.roads) return;

  dashboardData.roads.forEach((road) => {
    const delta = simRandBetween(scenario.roadDelta[0], scenario.roadDelta[1]);
    road.healthScore = Math.round(simClamp(road.healthScore + delta, 5, 100));
    road.condition = conditionFromScore(road.healthScore);
  });

  renderMap(dashboardData.roads);

  if (Math.random() < scenario.eventRate) {
    emitSimEvent(scenario);
  }
}

function emitSimEvent(scenario) {
  if (!dashboardData.drivers || !dashboardData.drivers.length) return;
  const driver = dashboardData.drivers[Math.floor(Math.random() * dashboardData.drivers.length)];
  const road = dashboardData.roads.find((r) => r.id === driver.area) || dashboardData.roads[0];

  const type = SIM_EVENT_TYPES[Math.floor(Math.random() * SIM_EVENT_TYPES.length)];
  const severityMap = { low: "low", medium: "medium", high: "high" };
  const severity = severityMap[scenario.eventSeverityBias] || "low";

  renderFeedItem({ driver, road, type, severity });
}

function renderFeedItem({ driver, road, type, severity }) {
  const list = document.getElementById("sim-feed-list");
  if (!list) return;
  const emptyMsg = document.getElementById("sim-feed-empty");
  if (emptyMsg) emptyMsg.remove();

  const item = document.createElement("div");
  item.className = "sim-feed-item";
  const time = new Date().toLocaleTimeString(getLang() === "ar" ? "ar-JO" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  item.innerHTML = `
    <span class="sim-feed-icon">${SIM_EVENT_ICONS[type]}</span>
    <div class="sim-feed-info">
      <strong>${t("sim_event_" + type)}</strong>
      <small>${tRoadName(road)} \u2022 ${tDriverName(driver)}</small>
    </div>
    <span class="badge badge-${severity === "high" ? "high" : severity === "medium" ? "medium" : "low"}">${t("sim_severity_" + severity)}</span>
    <span class="sim-feed-time">${time}</span>
  `;

  list.prepend(item);
  while (list.children.length > 30) {
    list.removeChild(list.lastChild);
  }
}

document.addEventListener("DOMContentLoaded", initSimulation);
window.addEventListener("langchange", updateSimStatusBadge);
