<!-- Map + maintenance priority list component -->
<section class="grid-2col">

  <div class="card map-card">
    <div class="card-header">
      <h2 data-i18n="map_title">Road Condition Map</h2>
      <div class="legend">
        <span><i class="dot excellent"></i> <span data-i18n="legend_excellent">Excellent</span></span>
        <span><i class="dot good"></i> <span data-i18n="legend_good">Good</span></span>
        <span><i class="dot average"></i> <span data-i18n="legend_average">Average</span></span>
        <span><i class="dot poor"></i> <span data-i18n="legend_poor">Poor</span></span>
        <span><i class="dot critical"></i> <span data-i18n="legend_critical">Critical</span></span>
      </div>
    </div>
    <div id="road-map"></div>
  </div>

  <div class="card priority-card">
    <div class="card-header">
      <h2 data-i18n="top_priority_title">Top Priority Roads for Maintenance</h2>
      <a href="maintenance.php" class="link" data-i18n="view_all">View All</a>
    </div>
    <ul class="priority-list" id="priority-list">
      <!-- built dynamically via assets/js/dashboard.js -->
    </ul>
  </div>

</section>
