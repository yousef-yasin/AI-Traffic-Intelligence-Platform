<?php
$pageTitleKey = 'page_title_settings';
$activePage = 'settings';

// Each settings section: id, i18n key for its label, and a lucide icon
$settingsSections = [
    'system'      => ['key' => 'settings_nav_system',      'icon' => 'settings-2'],
    'users'       => ['key' => 'settings_nav_users',       'icon' => 'users'],
    'security'    => ['key' => 'settings_nav_security',    'icon' => 'shield-check'],
    'taxi'        => ['key' => 'settings_nav_taxi',        'icon' => 'car-front'],
    'tracking'    => ['key' => 'settings_nav_tracking',    'icon' => 'map-pinned'],
    'alerts'      => ['key' => 'settings_nav_alerts',      'icon' => 'bell-ring'],
    'reports'     => ['key' => 'settings_nav_reports',     'icon' => 'database'],
    'compliance'  => ['key' => 'settings_nav_compliance',  'icon' => 'file-check-2'],
];
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP — Settings</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/variables.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/layout.css">
<link rel="stylesheet" href="../assets/css/dashboard.css">
<style>
  /* ===== Settings page — scoped styles (kept local so no other page is affected) ===== */
  .settings-shell{
    display:grid;
    grid-template-columns: 250px 1fr;
    gap: var(--space-5);
    align-items:start;
  }
  @media (max-width: 900px){
    .settings-shell{ grid-template-columns: 1fr; }
  }

  .settings-nav{
    background: var(--color-surface);
    border:1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    padding: var(--space-3);
    display:flex;
    flex-direction:column;
    gap:2px;
    position: sticky;
    top: var(--space-5);
  }

  .settings-nav-item{
    display:flex;
    align-items:center;
    gap:10px;
    padding:10px 12px;
    border-radius: var(--radius-sm);
    font-size:13.5px;
    font-weight:600;
    color: var(--color-text-muted);
    cursor:pointer;
    border:none;
    background:transparent;
    width:100%;
    text-align: inherit;
    font-family: inherit;
  }
  .settings-nav-item:hover{
    background: var(--color-bg);
    color: var(--color-text);
  }
  .settings-nav-item.active{
    background: rgba(37,99,235,.1);
    color: var(--color-primary);
  }
  .settings-nav-item i{ width:16px; height:16px; flex-shrink:0; }

  .settings-panels{ min-width:0; }
  .settings-panel{ display:none; }
  .settings-panel.active{ display:block; }

  .settings-section-desc{
    color: var(--color-text-muted);
    font-size:13px;
    margin-bottom: var(--space-4);
  }

  .settings-group{
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }
  .settings-group:last-child{ margin-bottom:0; }

  .settings-field label{
    display:block;
    font-size:12.5px;
    font-weight:700;
    margin-bottom:6px;
    color: var(--color-text);
  }
  .settings-field .field-hint{
    display:block;
    font-size:11.5px;
    font-weight:400;
    color: var(--color-text-muted);
    margin-top:4px;
  }
  .settings-field input[type="text"],
  .settings-field input[type="number"],
  .settings-field input[type="email"],
  .settings-field select{
    width:100%;
    padding:10px 12px;
    border:1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-bg);
    color: var(--color-text);
  }

  .settings-row{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap: var(--space-4);
    padding: 14px 0;
    border-bottom:1px solid var(--color-border);
  }
  .settings-row:last-child{ border-bottom:none; }
  .settings-row-info strong{ display:block; font-size:14px; margin-bottom:3px; }
  .settings-row-info small{ color: var(--color-text-muted); font-size:12.5px; }

  /* Toggle switch */
  .switch{
    position:relative;
    display:inline-block;
    width:42px;
    height:24px;
    flex-shrink:0;
  }
  .switch input{ opacity:0; width:0; height:0; }
  .switch .slider{
    position:absolute; inset:0;
    background: var(--color-border);
    border-radius:999px;
    cursor:pointer;
    transition:.2s;
  }
  .switch .slider::before{
    content:"";
    position:absolute;
    width:18px; height:18px;
    left:3px; top:3px;
    background:#fff;
    border-radius:50%;
    transition:.2s;
    box-shadow:0 1px 3px rgba(0,0,0,.2);
  }
  .switch input:checked + .slider{ background: var(--color-primary); }
  .switch input:checked + .slider::before{ transform: translateX(18px); }
  html[dir="rtl"] .switch input:checked + .slider::before{ transform: translateX(-18px); }

  .settings-table{ width:100%; border-collapse:collapse; }
  .settings-table th{
    text-align: start;
    font-size:11.5px;
    text-transform:uppercase;
    letter-spacing:.03em;
    color: var(--color-text-muted);
    padding:0 12px 10px;
    border-bottom:1px solid var(--color-border);
  }
  .settings-table td{
    padding:12px;
    border-bottom:1px solid var(--color-border);
    font-size:13.5px;
    vertical-align:middle;
  }
  .settings-table tr:last-child td{ border-bottom:none; }

  .role-pill{
    display:inline-block;
    padding:3px 10px;
    border-radius:999px;
    font-size:11.5px;
    font-weight:700;
  }
  .role-admin{ background:rgba(239,68,68,.12); color:#ef4444; }
  .role-operator{ background:rgba(37,99,235,.12); color:#2563eb; }
  .role-viewer{ background:rgba(34,197,94,.12); color:#22c55e; }

  .icon-btn{
    border:1px solid var(--color-border);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    width:30px; height:30px;
    display:inline-flex; align-items:center; justify-content:center;
    cursor:pointer;
    color: var(--color-text-muted);
  }
  .icon-btn:hover{ border-color: var(--color-primary); color: var(--color-primary); }
  .icon-btn i{ width:14px; height:14px; }

  .settings-actions{
    display:flex;
    justify-content:flex-end;
    gap: var(--space-3);
    margin-top: var(--space-5);
  }
  .btn{
    padding:10px 18px;
    border-radius: var(--radius-sm);
    font-weight:700;
    font-size:13px;
    cursor:pointer;
    border:1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
  }
  .btn-primary{
    background: var(--color-primary);
    border-color: var(--color-primary);
    color:#fff;
  }
  .btn-add{
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 14px;
    border-radius: var(--radius-sm);
    background: var(--color-primary);
    color:#fff;
    border:none;
    font-weight:700;
    font-size:12.5px;
    cursor:pointer;
  }
  .btn-add i{ width:14px; height:14px; }
</style>
</head>
<body>

<div class="layout">

  <?php include __DIR__ . '/../includes/sidebar.php'; ?>

  <div class="main">

    <?php include __DIR__ . '/../includes/navbar.php'; ?>

    <div class="settings-shell">

      <!-- ===== Settings sub-navigation ===== -->
      <nav class="settings-nav" id="settingsNav">
        <?php $first = true; foreach ($settingsSections as $id => $s): ?>
          <button type="button" class="settings-nav-item <?= $first ? 'active' : '' ?>" data-target="<?= $id ?>">
            <i data-lucide="<?= $s['icon'] ?>"></i>
            <span data-i18n="<?= $s['key'] ?>"><?= $s['key'] ?></span>
          </button>
        <?php $first = false; endforeach; ?>
      </nav>

      <!-- ===== Settings panels ===== -->
      <div class="settings-panels">

        <!-- 1. System Configuration -->
        <div class="settings-panel active card" data-panel="system">
          <div class="card-header"><h2 data-i18n="settings_system_title">System Configuration</h2></div>
          <p class="settings-section-desc" data-i18n="settings_system_desc">General platform identity, language, and regional defaults.</p>

          <div class="settings-group">
            <div class="settings-field">
              <label data-i18n="settings_system_platform_name">Platform Name</label>
              <input type="text" value="JRIP — Jordan Road Intelligence Platform">
            </div>
            <div class="settings-field">
              <label data-i18n="settings_system_default_lang">Default Language</label>
              <select id="defaultLangSelect">
                <option value="en" data-i18n="settings_opt_english">English</option>
                <option value="ar" data-i18n="settings_opt_arabic">Arabic</option>
              </select>
            </div>
            <div class="settings-field">
              <label data-i18n="settings_system_timezone">Timezone</label>
              <select>
                <option>GMT+3 — Amman</option>
                <option>GMT+0 — UTC</option>
              </select>
            </div>
            <div class="settings-field">
              <label data-i18n="settings_system_units">Measurement Units</label>
              <select>
                <option data-i18n="settings_opt_metric">Metric (km, °C)</option>
                <option data-i18n="settings_opt_imperial">Imperial (mi, °F)</option>
              </select>
            </div>
          </div>

          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_system_maintenance_mode">Maintenance Mode</strong>
              <small data-i18n="settings_system_maintenance_mode_hint">Temporarily disable public/driver access during updates</small>
            </div>
            <label class="switch"><input type="checkbox"><span class="slider"></span></label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_system_api_toggle">Live Data Source</strong>
              <small data-i18n="settings_system_api_toggle_hint">Switch between mock data and the live backend API</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
        </div>

        <!-- 2. User & Roles Management -->
        <div class="settings-panel card" data-panel="users">
          <div class="card-header">
            <h2 data-i18n="settings_users_title">User &amp; Roles Management</h2>
            <button class="btn-add"><i data-lucide="user-plus"></i> <span data-i18n="settings_users_add">Add User</span></button>
          </div>
          <p class="settings-section-desc" data-i18n="settings_users_desc">Manage who can access the platform and what they're allowed to do.</p>

          <table class="settings-table">
            <thead>
              <tr>
                <th data-i18n="settings_users_col_name">Name</th>
                <th data-i18n="settings_users_col_email">Email</th>
                <th data-i18n="settings_users_col_role">Role</th>
                <th data-i18n="settings_users_col_status">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eng. Ahmad Khalil</td>
                <td>ahmad.khalil@mot.gov.jo</td>
                <td><span class="role-pill role-admin" data-i18n="settings_role_admin">Admin</span></td>
                <td><span class="badge badge-low" data-i18n="settings_status_active">Active</span></td>
                <td><button class="icon-btn"><i data-lucide="pencil"></i></button></td>
              </tr>
              <tr>
                <td>Lina Odeh</td>
                <td>lina.odeh@mot.gov.jo</td>
                <td><span class="role-pill role-operator" data-i18n="settings_role_operator">Operator</span></td>
                <td><span class="badge badge-low" data-i18n="settings_status_active">Active</span></td>
                <td><button class="icon-btn"><i data-lucide="pencil"></i></button></td>
              </tr>
              <tr>
                <td>Sami Barakat</td>
                <td>sami.barakat@mot.gov.jo</td>
                <td><span class="role-pill role-viewer" data-i18n="settings_role_viewer">Viewer</span></td>
                <td><span class="badge badge-medium" data-i18n="settings_status_pending">Pending</span></td>
                <td><button class="icon-btn"><i data-lucide="pencil"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 3. Security & Access Control -->
        <div class="settings-panel card" data-panel="security">
          <div class="card-header"><h2 data-i18n="settings_security_title">Security &amp; Access Control</h2></div>
          <p class="settings-section-desc" data-i18n="settings_security_desc">Authentication rules and access protection for the dashboard.</p>

          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_security_2fa">Two-Factor Authentication</strong>
              <small data-i18n="settings_security_2fa_hint">Require an extra verification step for all government accounts</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_security_session">Auto Session Timeout</strong>
              <small data-i18n="settings_security_session_hint">Automatically sign users out after a period of inactivity</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_security_ip">IP Whitelisting</strong>
              <small data-i18n="settings_security_ip_hint">Restrict dashboard access to approved government networks</small>
            </div>
            <label class="switch"><input type="checkbox"><span class="slider"></span></label>
          </div>

          <div class="settings-group" style="margin-top:var(--space-4)">
            <div class="settings-field">
              <label data-i18n="settings_security_session_length">Session Timeout Duration</label>
              <select>
                <option>15 min</option>
                <option selected>30 min</option>
                <option>60 min</option>
              </select>
            </div>
            <div class="settings-field">
              <label data-i18n="settings_security_password_policy">Password Policy</label>
              <select>
                <option data-i18n="settings_opt_standard">Standard</option>
                <option data-i18n="settings_opt_strong">Strong (12+ chars, symbols)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 4. Taxi Operations Settings -->
        <div class="settings-panel card" data-panel="taxi">
          <div class="card-header"><h2 data-i18n="settings_taxi_title">Taxi Operations Settings</h2></div>
          <p class="settings-section-desc" data-i18n="settings_taxi_desc">Controls for the driver-facing reporting app and image capture pipeline.</p>

          <div class="settings-group">
            <div class="settings-field">
              <label data-i18n="settings_taxi_capture_interval">Auto-Capture Interval</label>
              <select>
                <option>Every 30s</option>
                <option selected>Every 60s</option>
                <option>Every 120s</option>
              </select>
              <span class="field-hint" data-i18n="settings_taxi_capture_interval_hint">How often the driver app captures a road frame automatically</span>
            </div>
            <div class="settings-field">
              <label data-i18n="settings_taxi_image_quality">Image Upload Quality</label>
              <select>
                <option data-i18n="settings_opt_low">Low (fast upload)</option>
                <option selected data-i18n="settings_opt_medium">Medium</option>
                <option data-i18n="settings_opt_high">High (best AI accuracy)</option>
              </select>
            </div>
            <div class="settings-field">
              <label data-i18n="settings_taxi_min_score">Minimum Confidence Score</label>
              <input type="number" value="70" min="0" max="100">
              <span class="field-hint" data-i18n="settings_taxi_min_score_hint">Minimum AI confidence (%) required to log a detection</span>
            </div>
          </div>

          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_taxi_manual_report">Manual Reporting</strong>
              <small data-i18n="settings_taxi_manual_report_hint">Allow drivers to manually report a pothole/crack via the app button</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_taxi_bg_upload">Background Upload</strong>
              <small data-i18n="settings_taxi_bg_upload_hint">Queue and upload captured images even when the app is minimized</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
        </div>

        <!-- 5. Tracking & Geofencing -->
        <div class="settings-panel card" data-panel="tracking">
          <div class="card-header"><h2 data-i18n="settings_tracking_title">Tracking &amp; Geofencing</h2></div>
          <p class="settings-section-desc" data-i18n="settings_tracking_desc">GPS tracking behavior and monitored regional boundaries.</p>

          <div class="settings-group">
            <div class="settings-field">
              <label data-i18n="settings_tracking_gps_accuracy">GPS Accuracy Mode</label>
              <select>
                <option data-i18n="settings_opt_battery_saver">Battery Saver</option>
                <option selected data-i18n="settings_opt_balanced">Balanced</option>
                <option data-i18n="settings_opt_high_accuracy">High Accuracy</option>
              </select>
            </div>
            <div class="settings-field">
              <label data-i18n="settings_tracking_ping_rate">Location Ping Rate</label>
              <select>
                <option>5s</option>
                <option selected>10s</option>
                <option>30s</option>
              </select>
            </div>
          </div>

          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_tracking_geofence">Amman Metro Geofence</strong>
              <small data-i18n="settings_tracking_geofence_hint">Restrict data collection and alerts to the defined monitoring zone</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_tracking_outside_alert">Alert on Zone Exit</strong>
              <small data-i18n="settings_tracking_outside_alert_hint">Notify admins when a tracked vehicle leaves the geofenced zone</small>
            </div>
            <label class="switch"><input type="checkbox"><span class="slider"></span></label>
          </div>
        </div>

        <!-- 6. Alerts Management -->
        <div class="settings-panel card" data-panel="alerts">
          <div class="card-header"><h2 data-i18n="settings_alerts_title">Alerts Management</h2></div>
          <p class="settings-section-desc" data-i18n="settings_alerts_desc">Choose which events trigger notifications, and how they're delivered.</p>

          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_alerts_pothole">Pothole Detected</strong>
              <small data-i18n="settings_alerts_pothole_hint">Notify when the AI service confirms a new pothole</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_alerts_critical_score">Critical Road Score</strong>
              <small data-i18n="settings_alerts_critical_score_hint">Notify when a road's health score drops below 40</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_alerts_congestion">Congestion Spike</strong>
              <small data-i18n="settings_alerts_congestion_hint">Notify on sudden traffic congestion increases</small>
            </div>
            <label class="switch"><input type="checkbox"><span class="slider"></span></label>
          </div>

          <div class="settings-group" style="margin-top:var(--space-4)">
            <div class="settings-field">
              <label data-i18n="settings_alerts_channel">Delivery Channel</label>
              <select>
                <option data-i18n="settings_opt_dashboard_only">Dashboard Only</option>
                <option selected data-i18n="settings_opt_dashboard_email">Dashboard + Email</option>
                <option data-i18n="settings_opt_dashboard_sms">Dashboard + SMS</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 7. Reports & Data Management -->
        <div class="settings-panel card" data-panel="reports">
          <div class="card-header"><h2 data-i18n="settings_reports_title">Reports &amp; Data Management</h2></div>
          <p class="settings-section-desc" data-i18n="settings_reports_desc">Scheduling, retention, and export options for collected road data.</p>

          <div class="settings-group">
            <div class="settings-field">
              <label data-i18n="settings_reports_frequency">Automated Report Frequency</label>
              <select>
                <option data-i18n="settings_opt_weekly">Weekly</option>
                <option selected data-i18n="settings_opt_monthly">Monthly</option>
                <option data-i18n="settings_opt_quarterly">Quarterly</option>
              </select>
            </div>
            <div class="settings-field">
              <label data-i18n="settings_reports_retention">Data Retention Period</label>
              <select>
                <option>6 months</option>
                <option selected>12 months</option>
                <option>24 months</option>
              </select>
            </div>
            <div class="settings-field">
              <label data-i18n="settings_reports_export_format">Default Export Format</label>
              <select>
                <option>PDF</option>
                <option>CSV</option>
                <option>Excel</option>
              </select>
            </div>
          </div>

          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_reports_auto_backup">Automatic Backups</strong>
              <small data-i18n="settings_reports_auto_backup_hint">Back up collected road/incident data on a nightly schedule</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
        </div>

        <!-- 8. Compliance & Audit -->
        <div class="settings-panel card" data-panel="compliance">
          <div class="card-header"><h2 data-i18n="settings_compliance_title">Compliance &amp; Audit</h2></div>
          <p class="settings-section-desc" data-i18n="settings_compliance_desc">Audit trail and regulatory compliance controls.</p>

          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_compliance_audit_log">Audit Logging</strong>
              <small data-i18n="settings_compliance_audit_log_hint">Record every configuration change with user, time, and action</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <strong data-i18n="settings_compliance_data_privacy">Driver Data Anonymization</strong>
              <small data-i18n="settings_compliance_data_privacy_hint">Strip identifying driver metadata from stored road images</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
          </div>

          <table class="settings-table" style="margin-top:var(--space-4)">
            <thead>
              <tr>
                <th data-i18n="settings_compliance_col_action">Action</th>
                <th data-i18n="settings_compliance_col_user">User</th>
                <th data-i18n="settings_compliance_col_date">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr><td data-i18n="settings_audit_1">Updated maintenance threshold</td><td>Eng. Ahmad Khalil</td><td>2026-07-14</td></tr>
              <tr><td data-i18n="settings_audit_2">Added new operator account</td><td>Eng. Ahmad Khalil</td><td>2026-07-11</td></tr>
              <tr><td data-i18n="settings_audit_3">Enabled IP whitelisting</td><td>Lina Odeh</td><td>2026-07-05</td></tr>
            </tbody>
          </table>
        </div>

        <div class="settings-actions">
          <button class="btn" data-i18n="settings_btn_cancel">Cancel</button>
          <button class="btn btn-primary" data-i18n="settings_btn_save">Save Changes</button>
        </div>

      </div><!-- /.settings-panels -->
    </div><!-- /.settings-shell -->

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script>
  // Tab switching for the settings sub-navigation.
  // Purely local to this page — doesn't touch dashboard.js or i18n.js internals.
  document.querySelectorAll('.settings-nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-item').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.settings-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`.settings-panel[data-panel="${btn.dataset.target}"]`).classList.add('active');
    });
  });

  // ===== "Default Language" select — wired to the real i18n system =====
  // Uses the same getLang()/setLang()/applyStaticTranslations() from
  // assets/js/i18n.js that the 🌐 navbar toggle uses, so picking a language
  // here actually changes (and persists, via localStorage) the whole app's
  // default language — not just this page.
  const defaultLangSelect = document.getElementById('defaultLangSelect');
  if (defaultLangSelect) {
    // Reflect the current app language when the page loads.
    defaultLangSelect.value = getLang();

    defaultLangSelect.addEventListener('change', () => {
      setLang(defaultLangSelect.value);       // persist as the new default
      applyStaticTranslations();               // re-apply static [data-i18n] text + dir/lang
      window.dispatchEvent(new CustomEvent('langchange')); // re-render any dynamic content
    });
  }

  // Keep the select in sync if the language is changed elsewhere on this
  // page (e.g. the 🌐 button in the navbar), so the two never disagree.
  window.addEventListener('langchange', () => {
    if (defaultLangSelect) defaultLangSelect.value = getLang();
  });
</script>