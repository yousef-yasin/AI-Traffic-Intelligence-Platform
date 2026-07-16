<!-- Simulation control panel -->
<div class="card sim-control-card">
  <div class="card-header">
    <div>
      <h2 data-i18n="sim_panel_title">Simulation Control</h2>
      <p class="sim-subtitle" data-i18n="sim_panel_subtitle">Model how road conditions evolve under different scenarios using live AI-detection data</p>
    </div>
    <span class="sim-status-badge" id="sim-status-badge" data-i18n="sim_status_idle">Idle</span>
  </div>

  <div class="sim-control-row">
    <div class="sim-field">
      <label data-i18n="sim_scenario_label">Scenario</label>
      <select id="sim-scenario">
        <option value="normal" data-i18n="sim_scenario_normal">Normal Traffic</option>
        <option value="rain" data-i18n="sim_scenario_rain">Heavy Rain</option>
        <option value="rush" data-i18n="sim_scenario_rush">Rush Hour</option>
        <option value="closure" data-i18n="sim_scenario_closure">Partial Road Closure</option>
      </select>
    </div>

    <div class="sim-field">
      <label data-i18n="sim_speed_label">Simulation Speed</label>
      <select id="sim-speed">
        <option value="1" data-i18n="sim_speed_1x">1x</option>
        <option value="2" data-i18n="sim_speed_2x">2x</option>
        <option value="4" data-i18n="sim_speed_4x">4x</option>
      </select>
    </div>

    <div class="sim-field sim-elapsed">
      <label data-i18n="sim_elapsed_label">Elapsed simulated time</label>
      <div class="sim-elapsed-value" id="sim-elapsed">00:00</div>
    </div>

    <div class="sim-actions">
      <button id="sim-play-btn" class="sim-btn sim-btn-primary">
        <span data-i18n="sim_play">Run Simulation</span>
      </button>
      <button id="sim-reset-btn" class="sim-btn sim-btn-ghost" data-i18n="sim_reset">Reset</button>
    </div>
  </div>
</div>
