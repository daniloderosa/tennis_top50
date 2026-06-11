<script>
  import { STAT_TABS, STAT_RANGES, statLabel } from './data.js';

  export let p1 = null;
  export let p2 = null;
  export let c1;
  export let c2;
  export let tab;
  export let lang = 'it';

  let infoOpen = null;
  function toggleInfo(key) {
    infoOpen = infoOpen === key ? null : key;
  }

  // stessa logica delle barre desktop: % = valore reale, non-% = min–max
  // del top-50 senza inversione, minimo 2% quando il dato c'è
  function fill(stat, raw) {
    if (raw == null) return 0;
    if (stat.unit === '%') return Math.max(2, Math.min(100, raw));
    const r = STAT_RANGES[stat.key];
    if (!r || r.max <= r.min) return 0;
    return Math.max(2, Math.min(100, ((raw - r.min) / (r.max - r.min)) * 100));
  }

  // 1 | 2 | 0 — chi è messo meglio (per il grassetto); flip = basso è meglio
  function leader(stat, v1, v2) {
    if (v1 == null || v2 == null || v1 === v2) return 0;
    const firstBetter = stat.flip ? v1 < v2 : v1 > v2;
    return firstBetter ? 1 : 2;
  }
</script>

<div class="m-stats">
  {#each STAT_TABS[tab] as stat (stat.key)}
    {@const v1 = p1?.[stat.key]}
    {@const v2 = p2?.[stat.key]}
    {@const ld = leader(stat, v1, v2)}
    {@const info = lang === 'en' && stat.en?.info ? stat.en.info : stat.info}

    <div class="m-row">
      <div class="m-label">
        {statLabel(stat, lang)}{#if info}<span class="info-wrap" class:open={infoOpen === stat.key}>
          <button class="info-btn" on:click={() => toggleInfo(stat.key)} aria-label={info}>i</button>
          <span class="info-tip">{info}</span>
        </span>{/if}
      </div>
      <div class="m-bars">
        <span class="m-val left" class:lead={ld === 1} style="color: {v1 == null ? 'var(--muted)' : c1}">{v1 ?? '—'}</span>
        <div class="m-track p1side">
          <div class="m-fill" style="width: {fill(stat, v1)}%; background: {c1}; opacity: {v1 == null ? 0.3 : 1};"></div>
        </div>
        <div class="m-div"></div>
        <div class="m-track">
          <div class="m-fill" style="width: {fill(stat, v2)}%; background: {c2}; opacity: {v2 == null ? 0.3 : 1};"></div>
        </div>
        <span class="m-val right" class:lead={ld === 2} style="color: {v2 == null ? 'var(--muted)' : c2}">{v2 ?? '—'}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .m-stats {
    margin-top: 14px;
    border-top: 2px solid var(--ink);
  }

  .m-row {
    padding: 12px 0 13px;
    border-bottom: 1px solid var(--bord);
  }

  .m-label {
    text-align: center;
    font-family: var(--serif-text);
    font-style: italic;
    font-size: 14px;
    color: var(--label);
    margin-bottom: 8px;
  }

  .m-bars {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .m-val {
    width: 52px;
    flex-shrink: 0;
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 500;
    line-height: 1;
  }

  .m-val.left  { text-align: right; }
  .m-val.right { text-align: left; }
  .m-val.lead  { font-weight: 700; }

  .m-track {
    flex: 1;
    height: 4px;
    background: var(--bord);
    display: flex;
  }

  /* la barra di P1 cresce dal centro verso sinistra */
  .m-track.p1side { justify-content: flex-end; }

  .m-fill { height: 100%; }

  .m-div {
    width: 1px;
    height: 12px;
    background: var(--rule);
    flex-shrink: 0;
    margin: 0 -3px;
  }

  /* info button (ⓘ) con tooltip — tap per aprire, centrato sul label */
  .info-wrap {
    position: relative;
    display: inline-block;
    margin-left: 6px;
  }

  .info-btn {
    width: 15px;
    height: 15px;
    border: 1px solid var(--muted2);
    border-radius: 50%;
    font-family: var(--serif);
    font-size: 10px;
    font-style: normal;
    line-height: 1;
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: 1px;
    cursor: help;
    padding: 0;
  }

  .info-wrap.open .info-btn {
    color: var(--ink);
    border-color: var(--ink);
  }

  .info-tip {
    display: none;
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    max-width: 210px;
    background: var(--bg);
    border: 1px solid var(--rule);
    box-shadow: 0 8px 24px rgba(27, 29, 28, 0.16);
    padding: 5px 9px;
    font-family: var(--serif-text);
    font-size: 12px;
    font-style: italic;
    line-height: 1.4;
    color: var(--label);
    z-index: 100;
  }

  .info-wrap:hover .info-tip,
  .info-wrap.open .info-tip {
    display: block;
  }
</style>
