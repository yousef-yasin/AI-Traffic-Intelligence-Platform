<?php
$pageTitleKey = 'page_title_maintenance';
$activePage = 'maintenance';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP — Maintenance</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/variables.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/layout.css">
<link rel="stylesheet" href="../assets/css/dashboard.css">
<link rel="stylesheet" href="../assets/css/maintenance.css">
</head>
<body>

<div class="layout">

  <?php include __DIR__ . '/../includes/sidebar.php'; ?>

  <div class="main">

    <?php include __DIR__ . '/../includes/navbar.php'; ?>

    <!-- KPI cards -->
    <section class="maint-kpi-grid" id="maint-kpi-grid">
      <div class="maint-kpi-card"><div class="kpi-label">Loading...</div></div>
    </section>

    <section class="grid-2col">

      <!-- Main table card -->
      <div class="card">
        <div class="card-header">
          <h2 data-i18n="all_priority_title">All Roads - Sorted by Maintenance Priority</h2>
        </div>

        <div class="maint-toolbar">
          <div class="maint-search">
            <span class="search-icon"><i data-lucide="search"></i></span>
            <input type="text" id="maintSearch" data-i18n-placeholder="maint_search_placeholder" placeholder="Search by road name...">
          </div>

          <select class="maint-filter" id="maintPriorityFilter">
            <option value="all" data-i18n="maint_filter_priority_all">All Priorities</option>
            <option value="high" data-i18n="maint_filter_priority_high">High</option>
            <option value="medium" data-i18n="maint_filter_priority_medium">Medium</option>
            <option value="low" data-i18n="maint_filter_priority_low">Low</option>
          </select>

          <select class="maint-filter" id="maintStatusFilter">
            <option value="all" data-i18n="maint_filter_status_all">All Statuses</option>
            <option value="pending" data-i18n="maint_filter_status_pending">Pending</option>
            <option value="scheduled" data-i18n="maint_filter_status_scheduled">Scheduled</option>
            <option value="in_progress" data-i18n="maint_filter_status_in_progress">In Progress</option>
            <option value="completed" data-i18n="maint_filter_status_completed">Completed</option>
          </select>
        </div>

        <div class="maint-table-wrap">
          <table class="maint-table">
            <thead>
              <tr>
                <th data-i18n="maint_table_road">Road</th>
                <th data-i18n="maint_table_score">Health Score</th>
                <th data-i18n="maint_table_condition">Condition</th>
                <th data-i18n="maint_table_priority">Priority</th>
                <th data-i18n="maint_table_status">Status</th>
                <th data-i18n="maint_table_action">Action</th>
              </tr>
            </thead>
            <tbody id="maint-table-body">
              <!-- built dynamically -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Side column: critical roads + recent activity -->
      <div style="display:flex; flex-direction:column; gap:20px;">

        <div class="card">
          <div class="card-header">
            <h2 data-i18n="maint_critical_title">Critical Roads</h2>
          </div>
          <div class="critical-list" id="critical-roads-list">
            <!-- built dynamically -->
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 data-i18n="maint_activity_title">Recent Activity</h2>
          </div>
          <div class="activity-list" id="maint-activity-list">
            <!-- built dynamically -->
          </div>
        </div>

      </div>

    </section>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script>
(function () {
  const CONDITION_COLORS = {
    excellent: "#10b981",
    good: "#22c55e",
    average: "#f59e0b",
    poor: "#f97316",
    critical: "#ef4444",
  };

  let maintData = null;
  let maintFiltersState = { search: "", priority: "all", status: "all" };

  document.addEventListener("DOMContentLoaded", async () => {
    maintData = await fetchDashboardData();
    if (!maintData) return;
    renderMaintenancePage();

    document.getElementById("maintSearch").addEventListener("input", (e) => {
      maintFiltersState.search = e.target.value.trim().toLowerCase();
      renderMaintTable();
    });
    document.getElementById("maintPriorityFilter").addEventListener("change", (e) => {
      maintFiltersState.priority = e.target.value;
      renderMaintTable();
    });
    document.getElementById("maintStatusFilter").addEventListener("change", (e) => {
      maintFiltersState.status = e.target.value;
      renderMaintTable();
    });
  });

  window.addEventListener("langchange", () => {
    if (maintData) renderMaintenancePage();
  });

  function renderMaintenancePage() {
    renderMaintKpis();
    renderMaintTable();
    renderCriticalRoads();
    renderRecentActivity();
  }

  /* ===== KPI cards ===== */
  function renderMaintKpis() {
    const container = document.getElementById("maint-kpi-grid");
    if (!container) return;

    const list = maintData.maintenancePriority || [];
    const roads = maintData.roads || [];
    const total = list.length;
    const critical = roads.filter((r) => r.condition === "poor" || r.condition === "critical").length;
    const avgScore = list.length
      ? Math.round(list.reduce((sum, r) => sum + r.score, 0) / list.length)
      : 0;
    const readinessKpi = (maintData.kpis || []).find((k) => k.id === "maintenance_ratio");
    const readiness = readinessKpi ? readinessKpi.value : "--";

    container.innerHTML = `
      <div class="maint-kpi-card">
        <span class="maint-kpi-icon total"><i data-lucide="clipboard-list"></i></span>
        <div class="maint-kpi-body">
          <div class="kpi-label">${t("maint_kpi_total")}</div>
          <div class="kpi-value-row"><span class="kpi-value">${total}</span></div>
        </div>
      </div>
      <div class="maint-kpi-card">
        <span class="maint-kpi-icon critical"><i data-lucide="triangle-alert"></i></span>
        <div class="maint-kpi-body">
          <div class="kpi-label">${t("maint_kpi_critical")}</div>
          <div class="kpi-value-row"><span class="kpi-value">${critical}</span></div>
        </div>
      </div>
      <div class="maint-kpi-card">
        <span class="maint-kpi-icon score"><i data-lucide="activity"></i></span>
        <div class="maint-kpi-body">
          <div class="kpi-label">${t("maint_kpi_avg_score")}</div>
          <div class="kpi-value-row"><span class="kpi-value">${avgScore}</span><span class="kpi-max">/100</span></div>
        </div>
      </div>
      <div class="maint-kpi-card">
        <span class="maint-kpi-icon budget"><i data-lucide="wallet"></i></span>
        <div class="maint-kpi-body">
          <div class="kpi-label">${t("maint_kpi_budget")}</div>
          <div class="kpi-value-row"><span class="kpi-value">${readiness}</span><span class="kpi-max">/100</span></div>
        </div>
      </div>`;

    if (window.lucide) lucide.createIcons();
  }

  /* ===== Table ===== */
  function renderMaintTable() {
    const tbody = document.getElementById("maint-table-body");
    if (!tbody || !maintData) return;

    const roadsById = {};
    (maintData.roads || []).forEach((r) => (roadsById[r.id] = r));

    let rows = (maintData.maintenancePriority || []).map((item) => {
      const road = roadsById[item.roadId] || {};
      const status = getMaintenanceStatus(item.roadId);
      return { ...item, condition: road.condition || "average", status };
    });

    if (maintFiltersState.search) {
      rows = rows.filter((r) =>
        tRoadName(r).toLowerCase().includes(maintFiltersState.search)
      );
    }
    if (maintFiltersState.priority !== "all") {
      rows = rows.filter((r) => r.priority === maintFiltersState.priority);
    }
    if (maintFiltersState.status !== "all") {
      rows = rows.filter((r) => r.status === maintFiltersState.status);
    }

    if (!rows.length) {
      tbody.innerHTML = `<tr class="maint-empty-row"><td colspan="6">${t("maint_table_empty")}</td></tr>`;
      return;
    }

    tbody.innerHTML = rows
      .map((r) => {
        const color = CONDITION_COLORS[r.condition] || "#999";
        return `
        <tr>
          <td>
            <div class="maint-road-cell">
              <span class="dot ${r.condition}"></span>
              <span>${tRoadName(r)}</span>
            </div>
          </td>
          <td>
            <div class="maint-score-cell">
              <span>${r.score}</span>
              <span class="maint-score-bar">
                <span class="maint-score-bar-fill" style="width:${r.score}%; background:${color};"></span>
              </span>
            </div>
          </td>
          <td>${tCondition(r.condition)}</td>
          <td><span class="badge badge-${r.priority}">${tPriority(r.priority)}</span></td>
          <td><span class="badge-status ${r.status}">${tStatus(r.status)}</span></td>
          <td><button class="maint-view-btn" data-road-id="${r.roadId}">${t("maint_view_btn")}</button></td>
        </tr>`;
      })
      .join("");
  }

  /* ===== Critical roads panel ===== */
  function renderCriticalRoads() {
    const container = document.getElementById("critical-roads-list");
    if (!container || !maintData) return;

    const critical = (maintData.roads || []).filter(
      (r) => r.condition === "poor" || r.condition === "critical"
    );

    if (!critical.length) {
      container.innerHTML = `<p style="color:var(--color-text-muted); font-size:13px;">${t("maint_critical_empty")}</p>`;
      return;
    }

    container.innerHTML = critical
      .map(
        (r) => `
      <div class="critical-item">
        <span class="critical-icon"><i data-lucide="triangle-alert"></i></span>
        <div class="critical-info">
          <strong>${tRoadName(r)}</strong>
          <small>${tCondition(r.condition)}</small>
        </div>
        <span class="critical-score">${r.healthScore}</span>
      </div>`
      )
      .join("");

    if (window.lucide) lucide.createIcons();
  }

  /* ===== Recent activity panel (derived from alerts feed) ===== */
  function renderRecentActivity() {
    const container = document.getElementById("maint-activity-list");
    if (!container || !maintData) return;

    const alerts = maintData.alerts || [];
    if (!alerts.length) {
      container.innerHTML = `<p style="color:var(--color-text-muted); font-size:13px;">${t("maint_activity_empty")}</p>`;
      return;
    }

    container.innerHTML = alerts
      .map((a) => {
        const tr = tAlert(a);
        return `
        <div class="activity-item">
          <span class="activity-dot"></span>
          <div class="activity-info">
            <strong>${tr.title}</strong>
            <small>${tr.location} &middot; ${tr.time}</small>
          </div>
        </div>`;
      })
      .join("");
  }
})();
</script>
