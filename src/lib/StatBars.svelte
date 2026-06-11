<script>
  import { STAT_TABS, STAT_RANGES, statLabel } from './data.js';

  export let player = null; // null = nessun giocatore selezionato
  export let color;
  export let tab;
  export let align = 'left'; // 'left' | 'right' — colonna specchiata per P2
  export let lang = 'it';

  // tooltip info aperto via click/tap (su desktop basta l'hover CSS)
  let infoOpen = null;
  function toggleInfo(key) {
    infoOpen = infoOpen === key ? null : key;
  }
</script>

<div class="stats-panel">
  {#each STAT_TABS[tab] as stat (stat.key)}
    {@const raw = player?.[stat.key]}
    {@const isPercent = stat.unit === '%'}
    {@const range = STAT_RANGES[stat.key]}
    {@const mn = range?.min ?? 0}
    {@const mx = range?.max ?? 1}
    <!-- Il riempimento riflette sempre il valore reale (niente inversione
         per le stat flip: 2.2% di doppi falli riempie il 2.2%).
         Minimo 2%: il migliore nelle stat non-% avrebbe barra vuota,
         che sembrerebbe un dato mancante. -->
    {@const barPct = raw == null ? 0 : Math.max(2, isPercent
      ? Math.max(0, Math.min(100, raw))
      : Math.max(0, Math.min(100, ((raw - mn) / (mx - mn)) * 100)))}

    {@const info = lang === 'en' && stat.en?.info ? stat.en.info : stat.info}

    <div class="stat-row">
      <div class="stat-meta" class:reversed={align === 'right'}>
        <span class="stat-label">
          {statLabel(stat, lang)}{#if info}<span class="info-wrap" class:open={infoOpen === stat.key}>
            <button
              class="info-btn"
              on:click={() => toggleInfo(stat.key)}
              aria-label={info}
            >i</button>
            <span class="info-tip" class:from-right={align === 'right'}>{info}</span>
          </span>{/if}
        </span>
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
    /* margini auto (non justify-content): centra verticalmente nella
       colonna ma degrada bene se il contenuto sborda (overflow-y) */
    margin: auto 0;
  }

  .stat-row {
    padding: 11px 0;
    border-bottom: 1px solid var(--bord);
  }

  /* su 13" il tab con più righe (Palle Break) decide l'altezza pagina:
     righe più compatte = niente scrollbar */
  @media (max-width: 1500px) {
    .stat-row { padding: 8px 0 9px; }
  }

  .stat-meta {
    display: flex;
    justify-content: space-between;
    /* il valore si aggancia all'ULTIMA riga del label: nei label su due
       righe resta appena sopra la barra come in tutti gli altri */
    align-items: last baseline;
    gap: 14px;
  }

  .stat-meta.reversed { flex-direction: row-reverse; }

  /* label su più righe: il testo segue l'allineamento della colonna */
  .stat-meta.reversed .stat-label { text-align: right; }

  .stat-label {
    font-family: var(--serif-text);
    font-size: var(--fs-bar-label, 18px);
    font-style: italic;
    color: var(--label);
  }

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
    vertical-align: 2px;
    cursor: help;
    padding: 0;
  }

  .info-wrap:hover .info-btn,
  .info-wrap.open .info-btn {
    color: var(--ink);
    border-color: var(--ink);
  }

  .info-tip {
    display: none;
    position: absolute;
    bottom: calc(100% + 6px);
    left: -4px;
    width: max-content;
    max-width: 190px;
    background: var(--bg);
    border: 1px solid var(--rule);
    box-shadow: 0 8px 24px rgba(28, 26, 23, 0.16);
    padding: 5px 9px;
    font-family: var(--serif-text);
    font-size: 12px;
    font-style: italic;
    line-height: 1.4;
    color: var(--label);
    z-index: 100;
  }

  .info-tip.from-right {
    left: auto;
    right: -4px;
  }

  .info-wrap:hover .info-tip,
  .info-wrap.open .info-tip {
    display: block;
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
