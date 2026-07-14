/**
 * Real JRIP data layer.
 * The Flask AI service stores every accepted camera detection in SQLite
 * and exposes the dashboard-ready JSON at /api/dashboard.
 */
const API_BASE = "http://127.0.0.1:5000/api";

async function fetchDashboardData() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Dashboard API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[api.js] fetchDashboardData error:", err);

    const container = document.getElementById("kpi-grid");
    if (container) {
      container.innerHTML = `
        <div class="kpi-card">
          <div class="kpi-label">AI service is offline</div>
          <div class="kpi-value-row"><span class="kpi-value">—</span></div>
          <span class="kpi-status trend-down">Run camera_stream.py on port 5000</span>
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
    return await res.json();
  } catch (err) {
    console.error("[api.js] postIncident error:", err);
    return null;
  }
}
