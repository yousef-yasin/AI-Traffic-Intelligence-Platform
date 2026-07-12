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
</head>
<body>

<div class="layout">

  <?php include __DIR__ . '/../includes/sidebar.php'; ?>

  <div class="main">

    <?php include __DIR__ . '/../includes/navbar.php'; ?>

    <div class="card">
      <div class="card-header">
        <h2 data-i18n="all_priority_title">All Roads - Sorted by Maintenance Priority</h2>
      </div>
      <ul class="priority-list" id="priority-list-full">
        <!-- built dynamically via assets/js/dashboard.js (full mock.json data) -->
      </ul>
    </div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
