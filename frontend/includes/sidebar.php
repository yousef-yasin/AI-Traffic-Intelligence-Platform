<?php
// $activePage لازم تكون متعرّفة بالصفحة يلي بتستدعي هاد الملف قبل include
// مثال: $activePage = 'overview';
if (!isset($activePage)) { $activePage = ''; }

$navItems = [
    'overview'    => ['label' => 'لوحة التحكم',        'icon' => '📊', 'href' => 'index.php'],
    'roads'       => ['label' => 'الطرق',                'icon' => '🛣️', 'href' => 'monitoring.php'],
    'maintenance' => ['label' => 'الصيانة',               'icon' => '🔧', 'href' => 'maintenance.php'],
    'reports'     => ['label' => 'التقارير',              'icon' => '📄', 'href' => 'reports.php'],
    'settings'    => ['label' => 'الإعدادات',              'icon' => '⚙️', 'href' => 'settings.php'],
];
?>
<aside class="sidebar">
  <div class="sidebar-logo">
    <span class="logo-mark">R</span>
    <div class="logo-text">
      <strong>ROYOSO</strong>
      <small>Jordan Road Intelligence Platform</small>
    </div>
  </div>

  <nav class="sidebar-nav">
    <?php foreach ($navItems as $key => $item): ?>
      <a href="<?= $item['href'] ?>" class="nav-item <?= $activePage === $key ? 'active' : '' ?>">
        <span class="nav-icon"><?= $item['icon'] ?></span> <?= $item['label'] ?>
      </a>
    <?php endforeach; ?>
  </nav>
</aside>
