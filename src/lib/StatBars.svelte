<script>
  import { STAT_TABS, STAT_RANGES, statLabel } from './data.js';

  export let player;
  export let color;
  export let tab;
  export let align = 'left'; // 'left' | 'right' — colonna specchiata per P2
  export let lang = 'it';
</script>

<div class="stats-panel">
  {#each STAT_TABS[tab] as stat (stat.key)}
    {@const raw = player[stat.key]}
    {@const isPercent = stat.unit === '%'}
    {@const range = STAT_RANGES[stat.key]}
    {@const mn = range?.min ?? 0}
    {@const mx = range?.max ?? 1}
    <!-- Il riempimento riflette sempre il valore reale (niente inversione
         per le stat flip: 2.2% di doppi falli riempie il 2.2%) -->
    {@const barPct = raw == null ? 0 : isPercent
      ? Math.max(0, Math.min(100, raw))
      : Math.max(0, Math.min(100, ((raw - mn) / (mx - mn)) * 100))}

    <div class="stat-row">
      <div class="stat-meta" class:reversed={align === 'right'}>
        <span class="stat-label">{statLabel(stat, lang)}</span>
        <span class="stat-value" style="color: {raw == null ? 'var(--muted)' : 'var(--ink)'}">
          {#if raw == null}—{:else}{raw}<span class="stat-unit">{stat.unit}</span>{/if}
        </span>
      </div>
      <div class="bar-track" class:reversed={align === 'right'}>
        <div
          class="bar-fill"
          style="width: {barPct}%; background: {color}; opacity: {raw == null ? 0.3 : 1};"
        />
      </div>
    </div>
  {/each}
</div>

<style>
  .stats-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .stat-row {
    padding: 11px 0;
    border-bottom: 1px solid var(--bord);
  }

  .stat-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 14px;
  }

  .stat-meta.reversed { flex-direction: row-reverse; }

  .stat-label {
    font-family: var(--serif-text);
    font-size: var(--fs-bar-label, 16px);
    font-style: italic;
    color: var(--label);
  }

  .stat-value {
    font-family: var(--serif);
    font-size: var(--fs-bar-value, 28px);
    font-weight: 600;
    line-height: 1;
  }

  .stat-unit {
    font-size: 15px;
    color: var(--avg);
  }

  .bar-track {
    height: 3px;
    background: var(--bord);
    margin-top: 7px;
    display: flex;
  }

  .bar-track.reversed { flex-direction: row-reverse; }

  .bar-fill {
    height: 100%;
    transition: width 0.3s ease;
  }
</style>
