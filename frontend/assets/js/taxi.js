/**
 * taxi.js
 * منطق واجهة السائق: عرض حالة الطريق، التنبيهات القريبة، وزر الإبلاغ عن حفرة.
 */

const TAXI_ALERT_ICONS = { pothole: "🕳️", crack: "⚠️", congestion: "🚦", accident: "🚨" };

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchDashboardData();
  if (!data) return;

  // نعرض مؤشر صحة الطريق العام كمثال (لاحقًا: أقرب طريق لموقع السائق الفعلي عبر GPS)
  const roadHealthKpi = data.kpis.find((k) => k.id === "road_health");
  const scoreEl = document.getElementById("taxi-road-score");
  if (scoreEl && roadHealthKpi) scoreEl.textContent = roadHealthKpi.value;

  renderTaxiAlerts(data.alerts);
});

function renderTaxiAlerts(alerts) {
  const container = document.getElementById("alerts-list");
  if (!container || !alerts) return;

  container.innerHTML = alerts
    .map(
      (a) => `
      <div class="alert-item">
        <span class="alert-icon">${TAXI_ALERT_ICONS[a.type] || "⚠️"}</span>
        <div class="alert-info">
          <strong>${a.title}</strong>
          <small>${a.location} - ${a.time}</small>
        </div>
      </div>`
    )
    .join("");
}

// زر "بلّغ عن حفرة" — مبدئيًا يفتح كاميرا/معرض الصور، لاحقًا يرسل الصورة لـ ai-service
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
      // TODO: ربط GPS الفعلي + رفع الصورة لـ ai-service بدل التنبيه التالي
      alert("تم التقاط الصورة. لاحقًا رح تنرفع تلقائيًا لخدمة الذكاء الاصطناعي للتحقق.");
    };
    input.click();
  });
});
