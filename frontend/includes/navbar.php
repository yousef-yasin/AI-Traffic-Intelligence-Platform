<?php
// $pageTitleKey must be defined in the page that includes this file
// (an i18n key from assets/js/i18n.js UI_STRINGS), e.g. 'page_title_overview'
if (!isset($pageTitleKey)) { $pageTitleKey = 'page_title_overview'; }
?>
<header class="topbar">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
  <h1 data-i18n="<?= $pageTitleKey ?>">Dashboard</h1>
  <div class="topbar-actions">
    <span class="date-picker" id="current-date"></span>

    <span class="region-picker" data-i18n="all_regions">All Regions</span>

  <span class="notif">
      <i class="fa-regular fa-bell"></i>
  </span>

    <div class="user-chip">
      <div class="avatar">A</div>
      <div class="user-info">
        <strong data-i18n="user_name">Eng. Ahmad</strong>
        <small data-i18n="user_role">Ministry of Transport</small>
      </div>
    </div>
    <nav class="navbar">
      <div class="nav-actions">
        <button id="langBtn" class="lang-toggle">🌐 عربي</button>
      </div>
    </nav>
  </div>
</header>
