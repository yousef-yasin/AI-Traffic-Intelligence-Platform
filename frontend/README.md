# frontend

داشبورد الحكومة + واجهة السائق (تكسي)، مبنية بـ **HTML/CSS/JS** مع **PHP** كـ templating
(includes/components) — بدون أي framework.

## كيف تشغليه محليًا (XAMPP)

المشروع أصلًا داخل `D:\XAMPP\htdocs\JSYP-ROYOSO`، فبس شغّلي Apache من XAMPP وافتحي:

```
http://localhost/JSYP-ROYOSO/frontend/login.php
```

اختاري "حكومة" وبتوجهك على `dashboard/index.php`، أو "سائق" وبتوجهك على `taxi/index.php`.

## البيانات (مهم)

- كل الصفحات حاليًا بتقرأ من `data/mock.json` عن طريق `assets/js/api.js`.
- لما يجهز الـ backend (Node.js — `index.js` بجذر المشروع)، بس غيّري بملف
  `assets/js/api.js`:
  ```js
  const USE_MOCK = false;
  const API_BASE = "http://localhost:3000/api"; // أو رابط السيرفر الفعلي
  ```
  المهم يرجّع الـ backend نفس **شكل** الـ JSON الموجود بـ `mock.json` بالضبط، وإلا لازم تعدّلي
  دوال العرض بـ `dashboard.js` / `taxi.js` معه.

## هيكلية الملفات

```
frontend/
├── login.php               → بوابة الدخول (حكومة / سائق)
├── includes/
│   ├── sidebar.php          → السايدبار المشترك (يستخدم $activePage)
│   ├── navbar.php            → الشريط العلوي المشترك (يستخدم $pageTitle)
│   └── footer.php             → إغلاق HTML + روابط JS
│
├── dashboard/
│   ├── index.php             → لوحة التحكم الرئيسية
│   ├── monitoring.php         → حالة الطرق + التنبيهات
│   ├── maintenance.php         → أولويات الصيانة الكاملة
│   ├── reports.php              → الرسوم البيانية
│   ├── settings.php              → إعدادات (placeholder)
│   └── components/
│       ├── cards.php            → كروت المؤشرات (KPIs)
│       ├── map.php               → الخريطة + قائمة الأولويات المختصرة
│       ├── chart.php              → الرسوم البيانية الثلاثة
│       └── alerts.php              → قائمة التنبيهات
│
├── taxi/
│   └── index.php              → واجهة السائق (حالة الطريق، زر الإبلاغ، تنبيهات قريبة)
│
├── assets/
│   ├── css/
│   │   ├── variables.css      → الألوان والمقاسات (عدّلي هون لو بدك تغيّري الهوية البصرية)
│   │   ├── base.css            → reset + عناصر عامة (كروت، badges)
│   │   ├── layout.css           → سايدبار/توب بار/الشبكة
│   │   ├── dashboard.css         → تنسيقات خاصة بمكونات الداشبورد
│   │   └── taxi.css               → تنسيقات واجهة السائق
│   └── js/
│       ├── api.js               → طبقة جلب البيانات (mock الآن → API لاحقًا)
│       ├── dashboard.js          → يرسم كل مكونات الداشبورد (كروت، خريطة، رسوم بيانية)
│       └── taxi.js                → منطق واجهة السائق
│
└── data/
    └── mock.json               → ⚠️ العقد (contract) المتفق عليه بين Frontend وBackend
```

## قواعد مهمة قبل ما تبنوا الـ backend

1. أي endpoint بالـ backend لازم يرجّع نفس **شكل** البيانات الموجود بـ `mock.json` تمامًا
   (نفس أسماء الحقول، نفس أنواع البيانات) — هيك التبديل من mock لـ API حقيقي بيصير بسطر واحد
   بدون تعديل أي كود عرض.
2. الخريطة تستخدم مكتبة **Leaflet** (مجانية، بدون API key) بدل Google Maps — أسهل وأسرع للهاكاثون.
3. الرسوم البيانية تستخدم **Chart.js**.
4. كل الصفحات جاهزة لدعم PHP `include` — إذا ضفتي صفحة جديدة، انسخي نفس الهيكل من
   `dashboard/reports.php` (أبسط مثال).
