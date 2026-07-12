<?php
$pageTitle = 'الإعدادات';
$activePage = 'settings';
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP — الإعدادات</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
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
      <div class="card-header"><h2>إعدادات الحساب</h2></div>
      <p style="color:var(--color-text-muted)">هاي الصفحة placeholder — تُبنى حسب احتياج الفريق (تغيير كلمة السر، صلاحيات المستخدمين...)</p>
    </div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
