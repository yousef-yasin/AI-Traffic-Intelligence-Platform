<?php
// login.php — entry gate for both government users and drivers
// Later: submits the form to the Node.js backend via POST and routes accordingly
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRIP — Login</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/variables.css">
<link rel="stylesheet" href="assets/css/base.css">
<style>
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--color-sidebar);
  }
  .login-box {
    background: var(--color-surface);
    width: 100%;
    max-width: 380px;
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    text-align: center;
    position: relative;
  }
  .login-box .lang-toggle {
    position: absolute;
    top: var(--space-4);
    inset-inline-end: var(--space-4);
  }
  .login-box .logo-mark {
    width: 48px; height: 48px;
    background: var(--color-primary);
    color: #fff;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 20px;
    margin: 0 auto var(--space-4);
  }
  .login-box h1 { font-size: 18px; margin-bottom: var(--space-1); }
  .login-box p { color: var(--color-text-muted); margin-bottom: var(--space-5); font-size: 13px; }
  .login-box input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    margin-bottom: var(--space-3);
  }
  .login-box button[type="submit"] {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: var(--radius-sm);
    background: var(--color-primary);
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    margin-top: var(--space-2);
  }
  .role-switch {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
  }
  .role-switch label {
    flex: 1;
    padding: 8px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: 12.5px;
    cursor: pointer;
  }
</style>
</head>
<body>

  <div class="login-box">
    <button id="langBtn" class="lang-toggle">🌐 عربي</button>
    <div class="logo-mark">R</div>
    <h1 data-i18n="login_title">Welcome to ROYOSO</h1>
    <p data-i18n="login_subtitle">Sign in to track road conditions and smart decisions</p>

    <div class="role-switch">
      <label><input type="radio" name="role" value="gov" checked> <span data-i18n="role_gov">Government</span></label>
      <label><input type="radio" name="role" value="taxi"> <span data-i18n="role_taxi">Driver</span></label>
    </div>

    <form action="#" method="post" id="loginForm">
      <input type="email" name="email" data-i18n-placeholder="email_placeholder" placeholder="Email" required>
      <input type="password" name="password" data-i18n-placeholder="password_placeholder" placeholder="Password" required>
      <button type="submit" data-i18n="login_button">Log In</button>
    </form>
  </div>

<script src="assets/js/i18n.js"></script>
<script>
  // For now: route based on the selected role (until real backend auth is ready)
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const role = document.querySelector('input[name="role"]:checked').value;
    window.location.href = role === 'gov' ? 'dashboard/index.php' : 'taxi/index.php';
  });
</script>
</body>
</html>
