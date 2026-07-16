/**
 * JRIP persistent dashboard data layer.
 *
 * The dashboard API runs independently on port 5001 and reads the permanent
 * SQLite database. The camera can therefore stop without removing old data.
 */
const API_BASE = "http://127.0.0.1:5001/api";
const DASHBOARD_CACHE_KEY = "jrip_dashboard_last_success";

function saveDashboardCache(data) {
  try {
    localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("[api.js] Could not cache dashboard data:", err);
  }
}

function readDashboardCache() {
  try {
    const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.warn("[api.js] Could not read cached dashboard data:", err);
    return null;
  }
}

async function fetchDashboardData() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Dashboard API returned ${res.status}`);
    }

    const data = await res.json();
    saveDashboardCache(data);
    return data;
  } catch (err) {
    console.error("[api.js] fetchDashboardData error:", err);

    // Keep the last successful data visible instead of clearing the dashboard.
    const cachedData = readDashboardCache();
    if (cachedData) {
      console.warn("[api.js] Showing the last saved dashboard snapshot.");
      return cachedData;
    }

    const container = document.getElementById("kpi-grid");
    if (container) {
      container.innerHTML = `
        <div class="kpi-card">
          <div class="kpi-label">Dashboard API is offline</div>
          <div class="kpi-value-row"><span class="kpi-value">—</span></div>
          <span class="kpi-status trend-down">Run api_server.py on port 5001</span>
        </div>`;
    }

    return null;
  }
}

async function postIncident(payload) {
  try {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Incident API returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("[api.js] postIncident error:", err);
    return null;
  }
}
