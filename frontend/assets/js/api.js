/**
 * api.js
 * Unified data-fetching layer.
 * Currently: reads from data/mock.json (dummy data).
 * Once the backend (Node.js) is ready: set USE_MOCK to false and point
 * API_BASE at the real server. The API response shape must match
 * mock.json exactly (see README).
 */

const USE_MOCK = true;
const API_BASE = "http://localhost:3000/api"; // backend URL, once ready
const MOCK_URL = "/JSYP-ROYOSO/frontend/data/mock.json"; // adjust to your XAMPP path

async function fetchDashboardData() {
  try {
    if (USE_MOCK) {
      const res = await fetch(MOCK_URL);
      if (!res.ok) throw new Error("Could not load mock.json");
      return await res.json();
    }
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error("Could not load data from the API");
    return await res.json();
  } catch (err) {
    console.error("[api.js] fetchDashboardData error:", err);
    return null;
  }
}

// Generic helper to submit a new incident report (used by the taxi app)
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
