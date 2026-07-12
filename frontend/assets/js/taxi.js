/**
 * taxi.js
 * Driver app logic: road status, nearby alerts, and the pothole-report button.
 */

const TAXI_ALERT_ICONS = { pothole: "\ud83d\udd73\ufe0f", crack: "\u26a0\ufe0f", congestion: "\ud83d\udea6", accident: "\ud83d\udea8" };

let taxiData = null;

document.addEventListener("DOMContentLoaded", async () => {
  taxiData = await fetchDashboardData();
  if (!taxiData) return;
  renderTaxi();
});

window.addEventListener("langchange", () => {
  if (taxiData) renderTaxi();
});

function renderTaxi() {
  const roadHealthKpi = taxiData.kpis.find((k) => k.id === "road_health");
  const scoreEl = document.getElementById("taxi-road-score");
  if (scoreEl && roadHealthKpi) scoreEl.textContent = roadHealthKpi.value;

  renderTaxiAlerts(taxiData.alerts);
}

function renderTaxiAlerts(alerts) {
  const container = document.getElementById("alerts-list");
  if (!container || !alerts) return;

  container.innerHTML = alerts
    .map((a) => {
      const tr = tAlert(a);
      return `
      <div class="alert-item">
        <span class="alert-icon">${TAXI_ALERT_ICONS[a.type] || "\u26a0\ufe0f"}</span>
        <div class="alert-info">
          <strong>${tr.title}</strong>
          <small>${tr.location} - ${tr.time}</small>
        </div>
      </div>`;
    })
    .join("");
}

// "Report a pothole" button — for now opens the camera/gallery picker,
// later it will upload the photo to the ai-service.
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("reportBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = async () => {
      if (!input.files.length) return;
      // TODO: use real GPS + upload the photo to ai-service instead of this alert.
      alert(t("taxi_captured"));
    };
    input.click();
  });
});
