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
    nav_simulation: "Road Simulation",
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
    page_title_simulation: "Road Simulation",
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

    // Maintenance page
    maint_kpi_total: "Roads Needing Maintenance",
    maint_kpi_critical: "Critical Roads",
    maint_kpi_avg_score: "Average Health Score",
    maint_kpi_budget: "Maintenance Readiness",
    maint_search_placeholder: "Search by road name...",
    maint_filter_priority_all: "All Priorities",
    maint_filter_priority_high: "High",
    maint_filter_priority_medium: "Medium",
    maint_filter_priority_low: "Low",
    maint_filter_status_all: "All Statuses",
    maint_filter_status_pending: "Pending",
    maint_filter_status_scheduled: "Scheduled",
    maint_filter_status_in_progress: "In Progress",
    maint_filter_status_completed: "Completed",
    maint_table_road: "Road",
    maint_table_score: "Health Score",
    maint_table_condition: "Condition",
    maint_table_priority: "Priority",
    maint_table_status: "Status",
    maint_table_action: "Action",
    maint_table_empty: "No roads match your search/filters.",
    maint_view_btn: "View",
    maint_critical_title: "Critical Roads",
    maint_critical_empty: "No critical roads right now.",
    maint_activity_title: "Recent Activity",
    maint_activity_empty: "No recent activity.",
    maint_activity_reported: "reported on",

    status_pending: "Pending",
    status_scheduled: "Scheduled",
    status_in_progress: "In Progress",
    status_completed: "Completed",

    // Sub-nav
    settings_nav_system: "System Configuration",
    settings_nav_users: "User & Roles Management",
    settings_nav_security: "Security & Access Control",
    settings_nav_taxi: "Taxi Operations Settings",
    settings_nav_tracking: "Tracking & Geofencing",
    settings_nav_alerts: "Alerts Management",
    settings_nav_reports: "Reports & Data Management",
    settings_nav_compliance: "Compliance & Audit",

    // 1. System Configuration
    settings_system_title: "System Configuration",
    settings_system_desc: "General platform identity, language, and regional defaults.",
    settings_system_platform_name: "Platform Name",
    settings_system_default_lang: "Default Language",
    settings_system_timezone: "Timezone",
    settings_system_units: "Measurement Units",
    settings_system_maintenance_mode: "Maintenance Mode",
    settings_system_maintenance_mode_hint: "Temporarily disable public/driver access during updates",
    settings_system_api_toggle: "Live Data Source",
    settings_system_api_toggle_hint: "Switch between mock data and the live backend API",

    // 2. Users & Roles
    settings_users_title: "User & Roles Management",
    settings_users_desc: "Manage who can access the platform and what they're allowed to do.",
    settings_users_add: "Add User",
    settings_users_col_name: "Name",
    settings_users_col_email: "Email",
    settings_users_col_role: "Role",
    settings_users_col_status: "Status",
    settings_role_admin: "Admin",
    settings_role_operator: "Operator",
    settings_role_viewer: "Viewer",
    settings_status_active: "Active",
    settings_status_pending: "Pending",

    // 3. Security
    settings_security_title: "Security & Access Control",
    settings_security_desc: "Authentication rules and access protection for the dashboard.",
    settings_security_2fa: "Two-Factor Authentication",
    settings_security_2fa_hint: "Require an extra verification step for all government accounts",
    settings_security_session: "Auto Session Timeout",
    settings_security_session_hint: "Automatically sign users out after a period of inactivity",
    settings_security_ip: "IP Whitelisting",
    settings_security_ip_hint: "Restrict dashboard access to approved government networks",
    settings_security_session_length: "Session Timeout Duration",
    settings_security_password_policy: "Password Policy",

    // 4. Taxi Ops
    settings_taxi_title: "Taxi Operations Settings",
    settings_taxi_desc: "Controls for the driver-facing reporting app and image capture pipeline.",
    settings_taxi_capture_interval: "Auto-Capture Interval",
    settings_taxi_capture_interval_hint: "How often the driver app captures a road frame automatically",
    settings_taxi_image_quality: "Image Upload Quality",
    settings_taxi_min_score: "Minimum Confidence Score",
    settings_taxi_min_score_hint: "Minimum AI confidence (%) required to log a detection",
    settings_taxi_manual_report: "Manual Reporting",
    settings_taxi_manual_report_hint: "Allow drivers to manually report a pothole/crack via the app button",
    settings_taxi_bg_upload: "Background Upload",
    settings_taxi_bg_upload_hint: "Queue and upload captured images even when the app is minimized",

    // 5. Tracking & Geofencing
    settings_tracking_title: "Tracking & Geofencing",
    settings_tracking_desc: "GPS tracking behavior and monitored regional boundaries.",
    settings_tracking_gps_accuracy: "GPS Accuracy Mode",
    settings_tracking_ping_rate: "Location Ping Rate",
    settings_tracking_geofence: "Amman Metro Geofence",
    settings_tracking_geofence_hint: "Restrict data collection and alerts to the defined monitoring zone",
    settings_tracking_outside_alert: "Alert on Zone Exit",
    settings_tracking_outside_alert_hint: "Notify admins when a tracked vehicle leaves the geofenced zone",

    // 6. Alerts Management
    settings_alerts_title: "Alerts Management",
    settings_alerts_desc: "Choose which events trigger notifications, and how they're delivered.",
    settings_alerts_pothole: "Pothole Detected",
    settings_alerts_pothole_hint: "Notify when the AI service confirms a new pothole",
    settings_alerts_critical_score: "Critical Road Score",
    settings_alerts_critical_score_hint: "Notify when a road's health score drops below 40",
    settings_alerts_congestion: "Congestion Spike",
    settings_alerts_congestion_hint: "Notify on sudden traffic congestion increases",
    settings_alerts_channel: "Delivery Channel",

    // 7. Reports & Data
    settings_reports_title: "Reports & Data Management",
    settings_reports_desc: "Scheduling, retention, and export options for collected road data.",
    settings_reports_frequency: "Automated Report Frequency",
    settings_reports_retention: "Data Retention Period",
    settings_reports_export_format: "Default Export Format",
    settings_reports_auto_backup: "Automatic Backups",
    settings_reports_auto_backup_hint: "Back up collected road/incident data on a nightly schedule",

    // 8. Compliance & Audit
    settings_compliance_title: "Compliance & Audit",
    settings_compliance_desc: "Audit trail and regulatory compliance controls.",
    settings_compliance_audit_log: "Audit Logging",
    settings_compliance_audit_log_hint: "Record every configuration change with user, time, and action",
    settings_compliance_data_privacy: "Driver Data Anonymization",
    settings_compliance_data_privacy_hint: "Strip identifying driver metadata from stored road images",
    settings_compliance_col_action: "Action",
    settings_compliance_col_user: "User",
    settings_compliance_col_date: "Date",
    settings_audit_1: "Updated maintenance threshold",
    settings_audit_2: "Added new operator account",
    settings_audit_3: "Enabled IP whitelisting",

    // Shared option labels
    settings_opt_english: "English",
    settings_opt_arabic: "Arabic",
    settings_opt_metric: "Metric (km, °C)",
    settings_opt_imperial: "Imperial (mi, °F)",
    settings_opt_standard: "Standard",
    settings_opt_strong: "Strong (12+ chars, symbols)",
    settings_opt_low: "Low (fast upload)",
    settings_opt_medium: "Medium",
    settings_opt_high: "High (best AI accuracy)",
    settings_opt_battery_saver: "Battery Saver",
    settings_opt_balanced: "Balanced",
    settings_opt_high_accuracy: "High Accuracy",
    settings_opt_dashboard_only: "Dashboard Only",
    settings_opt_dashboard_email: "Dashboard + Email",
    settings_opt_dashboard_sms: "Dashboard + SMS",
    settings_opt_weekly: "Weekly",
    settings_opt_monthly: "Monthly",
    settings_opt_quarterly: "Quarterly",

    // Buttons
    settings_btn_cancel: "Cancel",
    settings_btn_save: "Save Changes",
  },
  ar: {
    app_name: "JRIP",
    app_tagline: "Jordan Road Intelligence Platform",

    nav_overview: "لوحة التحكم",
    nav_simulation: "محاكتاة الطرق",
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
    page_title_simulation: "محاكاة الطرق",
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

    // Maintenance page
    maint_kpi_total: "طرق بحاجة لصيانة",
    maint_kpi_critical: "طرق حرجة",
    maint_kpi_avg_score: "متوسط مؤشر الصحة",
    maint_kpi_budget: "جاهزية الصيانة",
    maint_search_placeholder: "ابحث باسم الطريق...",
    maint_filter_priority_all: "كل الأولويات",
    maint_filter_priority_high: "عالي",
    maint_filter_priority_medium: "متوسط",
    maint_filter_priority_low: "منخفض",
    maint_filter_status_all: "كل الحالات",
    maint_filter_status_pending: "قيد الانتظار",
    maint_filter_status_scheduled: "مجدولة",
    maint_filter_status_in_progress: "قيد التنفيذ",
    maint_filter_status_completed: "مكتملة",
    maint_table_road: "الطريق",
    maint_table_score: "مؤشر الصحة",
    maint_table_condition: "الحالة",
    maint_table_priority: "الأولوية",
    maint_table_status: "حالة الصيانة",
    maint_table_action: "إجراء",
    maint_table_empty: "لا توجد طرق مطابقة للبحث/الفلاتر.",
    maint_view_btn: "عرض",
    maint_critical_title: "الطرق الحرجة",
    maint_critical_empty: "لا توجد طرق حرجة حاليًا.",
    maint_activity_title: "أحدث النشاطات",
    maint_activity_empty: "لا يوجد نشاط حديث.",
    maint_activity_reported: "تم الإبلاغ",

    status_pending: "قيد الانتظار",
    status_scheduled: "مجدولة",
    status_in_progress: "قيد التنفيذ",
    status_completed: "مكتملة",

    settings_nav_system: "إعدادات النظام",
    settings_nav_users: "إدارة المستخدمين والصلاحيات",
    settings_nav_security: "الأمان والتحكم بالوصول",
    settings_nav_taxi: "إعدادات عمليات التكسي",
    settings_nav_tracking: "التتبع والسياج الجغرافي",
    settings_nav_alerts: "إدارة التنبيهات",
    settings_nav_reports: "التقارير وإدارة البيانات",
    settings_nav_compliance: "الامتثال والتدقيق",

    settings_system_title: "إعدادات النظام",
    settings_system_desc: "هوية المنصة العامة، اللغة، والإعدادات الإقليمية الافتراضية.",
    settings_system_platform_name: "اسم المنصة",
    settings_system_default_lang: "اللغة الافتراضية",
    settings_system_timezone: "المنطقة الزمنية",
    settings_system_units: "وحدات القياس",
    settings_system_maintenance_mode: "وضع الصيانة",
    settings_system_maintenance_mode_hint: "تعطيل وصول السائقين/العامة مؤقتًا أثناء التحديثات",
    settings_system_api_toggle: "مصدر البيانات الحي",
    settings_system_api_toggle_hint: "التبديل بين البيانات التجريبية وواجهة البرمجة الفعلية",

    settings_users_title: "إدارة المستخدمين والصلاحيات",
    settings_users_desc: "إدارة من يمكنه الوصول للمنصة وما المسموح له بفعله.",
    settings_users_add: "إضافة مستخدم",
    settings_users_col_name: "الاسم",
    settings_users_col_email: "البريد الإلكتروني",
    settings_users_col_role: "الدور",
    settings_users_col_status: "الحالة",
    settings_role_admin: "مسؤول",
    settings_role_operator: "مشغّل",
    settings_role_viewer: "مشاهد",
    settings_status_active: "نشط",
    settings_status_pending: "قيد الانتظار",

    settings_security_title: "الأمان والتحكم بالوصول",
    settings_security_desc: "قواعد التحقق وحماية الوصول للوحة التحكم.",
    settings_security_2fa: "التحقق بخطوتين",
    settings_security_2fa_hint: "طلب خطوة تحقق إضافية لكل حسابات الحكومة",
    settings_security_session: "إنهاء الجلسة تلقائيًا",
    settings_security_session_hint: "تسجيل خروج المستخدمين تلقائيًا بعد فترة من عدم النشاط",
    settings_security_ip: "القائمة البيضاء لعناوين IP",
    settings_security_ip_hint: "تقييد الوصول للوحة التحكم على الشبكات الحكومية المعتمدة",
    settings_security_session_length: "مدة انتهاء الجلسة",
    settings_security_password_policy: "سياسة كلمة المرور",

    settings_taxi_title: "إعدادات عمليات التكسي",
    settings_taxi_desc: "أدوات التحكم بتطبيق السائق وخط معالجة الصور.",
    settings_taxi_capture_interval: "فاصل الالتقاط التلقائي",
    settings_taxi_capture_interval_hint: "عدد مرات التقاط تطبيق السائق لصورة الطريق تلقائيًا",
    settings_taxi_image_quality: "جودة رفع الصور",
    settings_taxi_min_score: "الحد الأدنى لدرجة الثقة",
    settings_taxi_min_score_hint: "أقل نسبة ثقة للذكاء الاصطناعي (%) لتسجيل الاكتشاف",
    settings_taxi_manual_report: "الإبلاغ اليدوي",
    settings_taxi_manual_report_hint: "السماح للسائقين بالإبلاغ يدويًا عن حفرة/تشقق عبر زر التطبيق",
    settings_taxi_bg_upload: "الرفع بالخلفية",
    settings_taxi_bg_upload_hint: "رفع الصور الملتقطة حتى عند تصغير التطبيق",

    settings_tracking_title: "التتبع والسياج الجغرافي",
    settings_tracking_desc: "سلوك تتبع GPS والحدود الإقليمية المراقبة.",
    settings_tracking_gps_accuracy: "وضع دقة GPS",
    settings_tracking_ping_rate: "معدل إرسال الموقع",
    settings_tracking_geofence: "السياج الجغرافي لعمّان الكبرى",
    settings_tracking_geofence_hint: "تقييد جمع البيانات والتنبيهات على منطقة المراقبة المحددة",
    settings_tracking_outside_alert: "تنبيه عند مغادرة المنطقة",
    settings_tracking_outside_alert_hint: "إشعار المسؤولين عند مغادرة مركبة متتبَّعة للمنطقة المحددة",

    settings_alerts_title: "إدارة التنبيهات",
    settings_alerts_desc: "اختيار الأحداث التي تُطلق التنبيهات وطريقة إيصالها.",
    settings_alerts_pothole: "اكتشاف حفرة",
    settings_alerts_pothole_hint: "التنبيه عند تأكيد خدمة الذكاء الاصطناعي لحفرة جديدة",
    settings_alerts_critical_score: "درجة طريق حرجة",
    settings_alerts_critical_score_hint: "التنبيه عند انخفاض درجة صحة الطريق عن 40",
    settings_alerts_congestion: "ارتفاع مفاجئ بالازدحام",
    settings_alerts_congestion_hint: "التنبيه عند حدوث زيادة مفاجئة بالازدحام المروري",
    settings_alerts_channel: "قناة الإيصال",

    settings_reports_title: "التقارير وإدارة البيانات",
    settings_reports_desc: "الجدولة، مدة الاحتفاظ، وخيارات تصدير بيانات الطرق.",
    settings_reports_frequency: "تكرار التقارير التلقائية",
    settings_reports_retention: "مدة الاحتفاظ بالبيانات",
    settings_reports_export_format: "صيغة التصدير الافتراضية",
    settings_reports_auto_backup: "النسخ الاحتياطي التلقائي",
    settings_reports_auto_backup_hint: "نسخ بيانات الطرق/الحوادث احتياطيًا كل ليلة",

    settings_compliance_title: "الامتثال والتدقيق",
    settings_compliance_desc: "سجل التدقيق وضوابط الامتثال التنظيمي.",
    settings_compliance_audit_log: "سجل التدقيق",
    settings_compliance_audit_log_hint: "تسجيل كل تغيير بالإعدادات مع المستخدم والوقت والإجراء",
    settings_compliance_data_privacy: "إخفاء هوية بيانات السائق",
    settings_compliance_data_privacy_hint: "إزالة البيانات التعريفية للسائق من صور الطرق المخزّنة",
    settings_compliance_col_action: "الإجراء",
    settings_compliance_col_user: "المستخدم",
    settings_compliance_col_date: "التاريخ",
    settings_audit_1: "تحديث حد أولوية الصيانة",
    settings_audit_2: "إضافة حساب مشغّل جديد",
    settings_audit_3: "تفعيل القائمة البيضاء لعناوين IP",

    settings_opt_english: "الإنجليزية",
    settings_opt_arabic: "العربية",
    settings_opt_metric: "متري (كم، °م)",
    settings_opt_imperial: "إمبراطوري (ميل، °ف)",
    settings_opt_standard: "قياسي",
    settings_opt_strong: "قوي (12+ حرف، رموز)",
    settings_opt_low: "منخفضة (رفع سريع)",
    settings_opt_medium: "متوسطة",
    settings_opt_high: "عالية (أفضل دقة للذكاء الاصطناعي)",
    settings_opt_battery_saver: "توفير البطارية",
    settings_opt_balanced: "متوازن",
    settings_opt_high_accuracy: "دقة عالية",
    settings_opt_dashboard_only: "لوحة التحكم فقط",
    settings_opt_dashboard_email: "لوحة التحكم + البريد الإلكتروني",
    settings_opt_dashboard_sms: "لوحة التحكم + الرسائل النصية",
    settings_opt_weekly: "أسبوعي",
    settings_opt_monthly: "شهري",
    settings_opt_quarterly: "ربع سنوي",

    settings_btn_cancel: "إلغاء",
    settings_btn_save: "حفظ التغييرات",
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
  /* Synthetic maintenance status per road (demo only, until the backend
     provides a real "status" field on mock.json / the API). Keyed by
     roadId, same pattern as the rest of DATA_TRANSLATIONS. */
  maintenanceStatus: {
    r1: "pending",
    r2: "scheduled",
    r3: "in_progress",
    r4: "in_progress",
    r5: "completed",
  },
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

/* Maintenance status helpers (synthetic until backend provides real data) */
function getMaintenanceStatus(roadId) {
  return DATA_TRANSLATIONS.maintenanceStatus[roadId] || "pending";
}

function tStatus(statusKey) {
  return t("status_" + statusKey);
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
    langBtn.setAttribute("data-lang", lang);
    langBtn.setAttribute("role", "switch");
    langBtn.setAttribute("aria-checked", lang === "ar" ? "true" : "false");
    langBtn.setAttribute("aria-label", "Toggle language / تبديل اللغة");
    // Build the switch markup once; afterwards just update state via data-lang.
    if (!langBtn.querySelector(".lang-toggle-knob")) {
      langBtn.innerHTML = `
        <span class="lang-toggle-knob"></span>
        <span class="lang-toggle-labels">
          <span>EN</span>
          <span>AR</span>
        </span>`;
    }
  }
}

function toggleLang() {
  setLang(getLang() === "en" ? "ar" : "en");
  applyStaticTranslations();
  // Let page-specific scripts (dashboard.js / taxi.js / maintenance.php inline)
  // know they should re-render any dynamic content that came from mock.json.
  window.dispatchEvent(new CustomEvent("langchange"));
}

document.addEventListener("DOMContentLoaded", () => {
  applyStaticTranslations();
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.addEventListener("click", toggleLang);
});
