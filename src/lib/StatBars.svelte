<script>
  import { STAT_TABS } from './data.js';

  export let player;
  export let color;
  export let tab;
</script>

<div class="stats-panel">
  {#each STAT_TABS[tab] as stat (stat.key)}
    {@const raw = player[stat.key]}
    {@const isPercent = stat.unit === '%'}
    {@const mn = stat.min ?? 0}
    {@const mx = stat.max ?? 100}
    {@const pct = isPercent
      ? Math.max(0, Math.min(100, raw))
      : Math.max(0, Math.min(100, ((raw - mn) / (mx - mn)) * 100))}
    <!-- flip: lower is better — invert bar length -->
    {@const barPct = stat.flip ? Math.max(0, Math.min(100, 100 - pct)) : pct}

    <div class="stat-row">
      <div class="stat-meta">
        <span class="stat-label">{stat.label}</span>
        <span class="stat-value" style="color: {color}">
          {raw}{stat.unit}
        </span>
      </div>
      <div class="bar-track" style="background: {color}18">
        <div
          class="bar-fill"
          style="width: {barPct}%; background: {color};"
        />
      </div>
    </div>
  {/each}
</div>

<style>
  .stats-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
  }

  .stat-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .stat-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    color: var(--muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .stat-value {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
  }

  .bar-track {
    height: 7px;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }
</style>
