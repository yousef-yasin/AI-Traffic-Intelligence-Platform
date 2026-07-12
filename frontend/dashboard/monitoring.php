<?php
$pageTitle = 'حالة الطرق';
$activePage = 'roads';
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP — حالة الطرق</title>
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

    <section class="grid-2col">
      <div class="card map-card">
        <div class="card-header">
          <h2>خريطة حالة الطرق - تفصيلية</h2>
          <div class="legend">
            <span><i class="dot excellent"></i> ممتاز</span>
            <span><i class="dot good"></i> جيد</span>
            <span><i class="dot average"></i> متوسط</span>
            <span><i class="dot poor"></i> سيء</span>
            <span><i class="dot critical"></i> خطير</span>
          </div>
        </div>
        <div id="road-map"></div>
      </div>

      <?php include __DIR__ . '/components/alerts.php'; ?>
    </section>

<?php include __DIR__ . '/../includes/footer.php'; ?>
