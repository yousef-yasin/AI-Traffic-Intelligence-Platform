<?php
// $activePage must be defined in the page that includes this file
// e.g. $activePage = 'overview';
if (!isset($activePage)) { $activePage = ''; }

$navItems = [
    'overview' => [
        'key'  => 'nav_overview',
        'icon' => 'layout-dashboard',
        'href' => 'index.php'
    ],
    'roads' => [
        'key'  => 'nav_roads',
        'icon' => 'route',
        'href' => 'monitoring.php'
    ],
    'maintenance' => [
        'key'  => 'nav_maintenance',
        'icon' => 'wrench',
        'href' => 'maintenance.php'
    ],
    'reports' => [
        'key'  => 'nav_reports',
        'icon' => 'file-text',
        'href' => 'reports.php'
    ],
    'settings' => [
        'key'  => 'nav_settings',
        'icon' => 'settings',
        'href' => 'settings.php'
    ],
];
?>
<aside class="sidebar">
  <div class="sidebar-logo">
    <span class="logo-mark">R</span>
    <div class="logo-text">
      <strong data-i18n="app_name">JRIP</strong>
      <small data-i18n="app_tagline">Jordan Road Intelligence Platform</small>
    </div>
  </div>

  <nav class="sidebar-nav">
    <?php foreach ($navItems as $key => $item): ?>
      <a href="<?= $item['href'] ?>" class="nav-item <?= $activePage === $key ? 'active' : '' ?>">
        <span class="nav-icon">
            <i data-lucide="<?= $item['icon'] ?>"></i>
        </span> <span data-i18n="<?= $item['key'] ?>"><?= $item['key'] ?></span>
      </a>
    <?php endforeach; ?>

  </nav>
</aside>
