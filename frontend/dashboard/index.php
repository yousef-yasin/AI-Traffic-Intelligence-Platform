<?php
$pageTitle = 'لوحة التحكم';
$activePage = 'overview';
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP — لوحة التحكم</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
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

    <?php include __DIR__ . '/components/cards.php'; ?>

    <?php include __DIR__ . '/components/map.php'; ?>

    <?php include __DIR__ . '/components/chart.php'; ?>

<?php include __DIR__ . '/../includes/footer.php'; ?>
