<!-- مكوّن الخريطة + قائمة أولويات الصيانة -->
<section class="grid-2col">

  <div class="card map-card">
    <div class="card-header">
      <h2>خريطة حالة الطرق</h2>
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

  <div class="card priority-card">
    <div class="card-header">
      <h2>أعلى الطرق أولوية للصيانة</h2>
      <a href="maintenance.php" class="link">عرض الكل</a>
    </div>
    <ul class="priority-list" id="priority-list">
      <!-- تُبنى ديناميكيًا عبر assets/js/dashboard.js -->
    </ul>
  </div>

</section>
