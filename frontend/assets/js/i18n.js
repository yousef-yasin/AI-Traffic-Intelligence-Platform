/**
 * i18n.js
 * Central translation + language/direction switcher.
 * Default language: English (LTR). A toggle button (#langBtn) in the
 * navbar switches to Arabic (RTL) and back, persisted in localStorage.
 *
 * Two layers of translation:
 *  1. UI_STRINGS  -> static chrome (menus, headers, buttons, labels)
 *                    applied via [data-i18n] / [data-i18n-placeholder]
 *  2. DATA_TRANSLATIONS -> translated copies of the dynamic mock.json
 *                    content (kpi labels, road names, alerts, chart
 *                    labels...), looked up by the same id/index used
 *                    in mock.json so the JSON "contract" itself never
 *                    changes shape.
 */

const LANG_KEY = "jrip_lang";
const DEFAULT_LANG = "en";

function getLang() {
  return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

/* ===================== Static UI strings ===================== */
const UI_STRINGS = {
  en: {
    app_name: "JRIP",
    app_tagline: "Jordan Road Intelligence Platform",

    // Sidebar
    nav_overview: "Dashboard",
    nav_roads: "Roads",
    nav_maintenance: "Maintenance",
    nav_reports: "Reports",
    nav_settings: "Settings",

    // Login
    login_title: "Welcome to JRIP",
    login_subtitle: "Sign in to track road conditions and smart decisions",
    role_gov: "Government",
    role_taxi: "Driver",
    email_placeholder: "Email",
    password_placeholder: "Password",
    login_button: "Log In",

    // Navbar
    page_title_overview: "Dashboard",
    page_title_roads: "Road Status",
    page_title_maintenance: "Maintenance",
    page_title_reports: "Reports",
    page_title_settings: "Settings",
    all_regions: "All Regions",
    user_name: "Eng. Ahmad",
    user_role: "Ministry of Transport",

    // Cards / sections
    map_title: "Road Condition Map",
    map_title_detailed: "Detailed Road Condition Map",
    top_priority_title: "Top Priority Roads for Maintenance",
    all_priority_title: "All Roads - Sorted by Maintenance Priority",
    view_all: "View All",
    latest_alerts: "Latest Alerts",
    latest_alerts_area: "Latest Alerts in Your Area",
    trend_title: "Road Condition Trend",
    distribution_title: "Road Condition Distribution",
    incidents_title: "Incidents by Type",
    total_roads: "Total Roads",
    road_health_label: "Road Health:",

    // Legend
    legend_excellent: "Excellent",
    legend_good: "Good",
    legend_average: "Average",
    legend_poor: "Poor",
    legend_critical: "Critical",

    // Settings
    account_settings: "Account Settings",
    settings_placeholder: "This page is a placeholder — build it according to the team's needs (password change, user permissions...)",

    // Taxi
    taxi_welcome: "Welcome, Driver",
    taxi_current_road: "Current Road Status",
    taxi_report_text: "Saw a pothole or crack on the road? Report it now and help the team improve the map.",
    taxi_report_btn: "\ud83d\udcf7 Report a Pothole Now",
    taxi_captured: "Photo captured. It will soon be uploaded automatically to the AI verification service.",
  },
  ar: {
    app_name: "JRIP",
    app_tagline: "Jordan Road Intelligence Platform",

    nav_overview: "لوحة التحكم",
    nav_roads: "الطرق",
    nav_maintenance: "الصيانة",
    nav_reports: "التقارير",
    nav_settings: "الإعدادات",

    login_title: "مرحبًا بك في JRIP",
    login_subtitle: "سجّل الدخول لمتابعة حالة الطرق والقرارات الذكية",
    role_gov: "حكومة",
    role_taxi: "سائق",
    email_placeholder: "البريد الإلكتروني",
    password_placeholder: "كلمة السر",
    login_button: "تسجيل الدخول",

    page_title_overview: "لوحة التحكم",
    page_title_roads: "حالة الطرق",
    page_title_maintenance: "الصيانة",
    page_title_reports: "التقارير",
    page_title_settings: "الإعدادات",
    all_regions: "كل المناطق",
    user_name: "المهندس أحمد",
    user_role: "وزارة النقل",

    map_title: "خريطة حالة الطرق",
    map_title_detailed: "خريطة حالة الطرق - تفصيلية",
    top_priority_title: "أعلى الطرق أولوية للصيانة",
    all_priority_title: "كل الطرق - مرتبة حسب أولوية الصيانة",
    view_all: "عرض الكل",
    latest_alerts: "أحدث التنبيهات",
    latest_alerts_area: "أحدث التنبيهات بمنطقتك",
    trend_title: "تطور حالة الطريق",
    distribution_title: "توزيع حالة الطريق",
    incidents_title: "الحوادث حسب النوع",
    total_roads: "إجمالي الطرق",
    road_health_label: "صحة الطريق:",

    legend_excellent: "ممتاز",
    legend_good: "جيد",
    legend_average: "متوسط",
    legend_poor: "سيء",
    legend_critical: "خطير",

    account_settings: "إعدادات الحساب",
    settings_placeholder: "هاي الصفحة placeholder — تُبنى حسب احتياج الفريق (تغيير كلمة السر، صلاحيات المستخدمين...)",

    taxi_welcome: "مرحبًا، السائق",
    taxi_current_road: "حالة الطريق الحالي",
    taxi_report_text: "شفت حفرة أو تشقق بالطريق؟ بلّغ فورًا وساعد الفريق يحسّن الخريطة.",
    taxi_report_btn: "\ud83d\udcf7 بلّغ عن حفرة الآن",
    taxi_captured: "تم التقاط الصورة. لاحقًا رح تنرفع تلقائيًا لخدمة الذكاء الاصطناعي للتحقق.",
  },
};

/* ================= Dynamic data translations ================= */
/* Keyed by the same ids/indices used in data/mock.json, so mock.json
   itself is left untouched (keeps the Frontend/Backend contract intact). */
const DATA_TRANSLATIONS = {
  kpis: {
    road_health:       { en: { label: "Road Health Index",     status: "Good" },              ar: { label: "مؤشر صحة الطريق",     status: "جيد" } },
    congestion:         { en: { label: "Overall Congestion",     status: "Average" },           ar: { label: "الازدحام العام",       status: "متوسط" } },
    safety:             { en: { label: "Traffic Safety",         status: "Good" },              ar: { label: "السلامة المرورية",     status: "جيد" } },
    incidents_today:    { en: { label: "Incidents Today",        status: "+12% vs. yesterday" },ar: { label: "الحوادث اليوم",        status: "+12% عن أمس" } },
    maintenance_ratio:  { en: { label: "Maintenance Readiness",  status: "On budget" },         ar: { label: "جاهزية الصيانة",        status: "من الميزانية" } },
  },
  roads: {
    r1: { en: "University of Jordan St.",  ar: "شارع الجامعة الأردنية" },
    r2: { en: "Mecca St.",                 ar: "شارع مكة" },
    r3: { en: "Al Madina Al Munawwara St.",ar: "شارع المدينة المنورة" },
    r4: { en: "King Abdullah I St.",       ar: "شارع عبدالله الأول" },
    r5: { en: "Independence St.",          ar: "شارع الاستقلال" },
  },
  conditions: {
    excellent: { en: "Excellent", ar: "ممتاز" },
    good:      { en: "Good",      ar: "جيد" },
    average:   { en: "Average",   ar: "متوسط" },
    poor:      { en: "Poor",      ar: "سيء" },
    critical:  { en: "Critical",  ar: "خطير" },
  },
  priority: {
    high:   { en: "High",   ar: "عالي" },
    medium: { en: "Medium", ar: "متوسط" },
    low:    { en: "Low",    ar: "منخفض" },
  },
  alerts: {
    a1: { en: { title: "Pothole on road",     location: "Airport Rd - Eastbound", time: "30 minutes ago" }, ar: { title: "حفرة في الطريق",   location: "شارع المطار - باتجاه الشرق", time: "منذ 30 دقيقة" } },
    a2: { en: { title: "Traffic congestion",  location: "Station Roundabout",     time: "45 minutes ago" }, ar: { title: "ازدحام مروري",     location: "دوار المحطة",                time: "منذ 45 دقيقة" } },
  },
  trendLabels: [
    { en: "Jan", ar: "كانون الثاني" },
    { en: "Feb", ar: "شباط" },
    { en: "Mar", ar: "آذار" },
    { en: "Apr", ar: "نيسان" },
    { en: "May", ar: "أيار" },
    { en: "Jun", ar: "حزيران" },
  ],
  distributionLabels: [
    { en: "Excellent", ar: "ممتاز" },
    { en: "Good",      ar: "جيد" },
    { en: "Average",   ar: "متوسط" },
    { en: "Poor",       ar: "سيء" },
    { en: "Critical",   ar: "خطير" },
  ],
  incidentLabels: [
    { en: "Potholes",       ar: "حفر" },
    { en: "Cracks",         ar: "تشققات" },
    { en: "Congestion",     ar: "ازدحام" },
    { en: "Accidents",      ar: "حوادث" },
    { en: "Broken signals", ar: "إشارات معطلة" },
  ],
};

/* ===================== Translation helpers ===================== */
function t(key) {
  const lang = getLang();
  return (UI_STRINGS[lang] && UI_STRINGS[lang][key]) || UI_STRINGS[DEFAULT_LANG][key] || key;
}

function tKpi(kpi) {
  const lang = getLang();
  const tr = DATA_TRANSLATIONS.kpis[kpi.id];
  return tr ? tr[lang] : { label: kpi.label, status: kpi.status };
}

function tRoadName(idOrObj) {
  const lang = getLang();
  const id = typeof idOrObj === "string" ? idOrObj : idOrObj.id || idOrObj.roadId;
  const fallback = typeof idOrObj === "object" ? (idOrObj.name || idOrObj.roadName) : id;
  const tr = DATA_TRANSLATIONS.roads[id];
  return tr ? tr[lang] : fallback;
}

function tCondition(cond) {
  const lang = getLang();
  const tr = DATA_TRANSLATIONS.conditions[cond];
  return tr ? tr[lang] : cond;
}

function tPriority(p) {
  const lang = getLang();
  const tr = DATA_TRANSLATIONS.priority[p];
  return tr ? tr[lang] : p;
}

function tAlert(alert) {
  const lang = getLang();
  const tr = DATA_TRANSLATIONS.alerts[alert.id];
  return tr ? tr[lang] : alert;
}

function tLabelsList(namespace, labels) {
  const lang = getLang();
  const set = DATA_TRANSLATIONS[namespace];
  if (!set) return labels;
  return labels.map((label, i) => (set[i] ? set[i][lang] : label));
}

/* ===================== Apply / toggle ===================== */
function applyStaticTranslations() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });

  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.textContent = lang === "en" ? "\ud83c\udf10 عربي" : "\ud83c\udf10 EN";
  }
}

function toggleLang() {
  setLang(getLang() === "en" ? "ar" : "en");
  applyStaticTranslations();
  // Let page-specific scripts (dashboard.js / taxi.js) know they should
  // re-render any dynamic content that came from mock.json.
  window.dispatchEvent(new CustomEvent("langchange"));
}

document.addEventListener("DOMContentLoaded", () => {
  applyStaticTranslations();
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.addEventListener("click", toggleLang);
});
