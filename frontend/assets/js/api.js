/**
 * api.js
 * طبقة موحّدة لجلب البيانات.
 * حاليًا: بتقرأ من data/mock.json (بيانات وهمية).
 * لما يجهز الـ backend (Node.js): غيّري USE_MOCK لـ false وحطي رابط الـ API الصحيح بـ API_BASE.
 * شكل البيانات المتوقع من الـ API لازم يطابق mock.json بالضبط.
 */

const USE_MOCK = true;
const API_BASE = "http://localhost:3000/api"; // رابط الـ backend لاحقًا
const MOCK_URL = "/JSYP-ROYOSO/frontend/data/mock.json"; // عدّلي المسار حسب مكان تشغيل XAMPP عندك

async function fetchDashboardData() {
  try {
    if (USE_MOCK) {
      const res = await fetch(MOCK_URL);
      if (!res.ok) throw new Error("تعذر تحميل mock.json");
      return await res.json();
    }
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error("تعذر تحميل البيانات من الـ API");
    return await res.json();
  } catch (err) {
    console.error("[api.js] fetchDashboardData error:", err);
    return null;
  }
}

// دالة عامة لإرسال بلاغ جديد (تُستخدم لاحقًا من تطبيق التكسي)
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
