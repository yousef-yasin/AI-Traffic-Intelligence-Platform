<!-- الخريطة الحية وتحليلات أضرار الطرق -->
<section class="live-road-section">
  <div class="section-heading">
    <div>
      <h2>الخريطة الذكية لمراقبة الطرق</h2>
      <p>بيانات مباشرة من وحدة الكاميرا والذكاء الاصطناعي</p>
    </div>
    <span class="live-indicator"><i></i> تحديث مباشر</span>
  </div>

  <div class="road-stats-grid">
    <div class="road-stat-card">
      <span class="road-stat-icon">🛣️</span>
      <div><small>إجمالي الأضرار</small><strong id="live-total">0</strong></div>
    </div>
    <div class="road-stat-card danger">
      <span class="road-stat-icon">🔴</span>
      <div><small>أولوية عالية</small><strong id="live-high">0</strong></div>
    </div>
    <div class="road-stat-card warning">
      <span class="road-stat-icon">🟠</span>
      <div><small>أولوية متوسطة</small><strong id="live-medium">0</strong></div>
    </div>
    <div class="road-stat-card success">
      <span class="road-stat-icon">🟢</span>
      <div><small>أولوية منخفضة</small><strong id="live-low">0</strong></div>
    </div>
    <div class="road-stat-card health-card">
      <div class="health-ring" id="health-ring"><span id="live-health">100%</span></div>
      <div><small>صحة الطريق</small><strong id="live-status">ممتاز</strong></div>
    </div>
  </div>

  <div class="grid-2col live-map-layout">
    <div class="card map-card live-map-card">
      <div class="card-header">
        <h2>مواقع الأضرار المكتشفة</h2>
        <div class="legend">
          <span><i class="damage-dot high"></i> عالية</span>
          <span><i class="damage-dot medium"></i> متوسطة</span>
          <span><i class="damage-dot low"></i> منخفضة</span>
        </div>
      </div>
      <div id="road-map"></div>
      <div class="map-message" id="map-message">جاري الاتصال بنظام المراقبة...</div>
    </div>

    <div class="card priority-card">
      <div class="card-header">
        <h2>أعلى الطرق أولوية للصيانة</h2>
        <a href="maintenance.php" class="link">عرض الكل</a>
      </div>
      <ul class="priority-list" id="priority-list">
        <li class="empty-priority">جاري تحميل التحليلات...</li>
      </ul>

      <div class="live-analysis-box">
        <h3>ملخص التحليل الذكي</h3>
        <div class="analysis-row"><span>معدل الضرر العالي</span><strong id="high-rate">0%</strong></div>
        <div class="analysis-progress"><i id="high-rate-bar"></i></div>
        <div class="analysis-row"><span>آخر تحديث</span><strong id="last-update">--:--:--</strong></div>
      </div>
    </div>
  </div>
</section>
