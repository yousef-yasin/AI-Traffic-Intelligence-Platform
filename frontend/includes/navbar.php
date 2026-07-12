<?php
// $pageTitle لازم تكون متعرّفة بالصفحة يلي بتستدعي هاد الملف
if (!isset($pageTitle)) { $pageTitle = 'لوحة التحكم'; }
?>
<header class="topbar">
  <h1><?= htmlspecialchars($pageTitle) ?></h1>
  <div class="topbar-actions">
    <span class="date-picker" id="date-picker">31 مايو 2025</span>
    <span class="region-picker">كل المناطق ⌄</span>
    <span class="notif">🔔</span>
    <div class="user-chip">
      <div class="avatar">أ</div>
      <div class="user-info">
        <strong>المهندس أحمد</strong>
        <small>وزارة النقل</small>
      </div>
    </div>
    <nav class="navbar">
        <div class="nav-actions">
            <button id="langBtn">🌐 EN</button>
        </div>
    </nav>
  </div>
</header>
