<script>
  import { PLAYERS, TAB_KEYS } from './lib/data.js';
  import RadarChart from './lib/RadarChart.svelte';
  import StatBars from './lib/StatBars.svelte';
  import PlayerSelector from './lib/PlayerSelector.svelte';

  const C1 = '#2563eb';
  const C2 = '#d97706';
  const ACCENT = '#2d7a45';

  let p1rank = +(localStorage.getItem('atpb50_p1') || 1);
  let p2rank = +(localStorage.getItem('atpb50_p2') || 2);
  let tab = (() => {
    const t = localStorage.getItem('atpb50_tab');
    return TAB_KEYS.includes(t) ? t : TAB_KEYS[0];
  })();

  $: p1 = PLAYERS.find(p => p.rank === p1rank) ?? PLAYERS[0];
  $: p2 = PLAYERS.find(p => p.rank === p2rank) ?? PLAYERS[1];

  $: { localStorage.setItem('atpb50_p1', p1rank); }
  $: { localStorage.setItem('atpb50_p2', p2rank); }
  $: { localStorage.setItem('atpb50_tab', tab); }

  function selectP1(e) {
    p1rank = e.detail;
  }

  function selectP2(e) {
    p2rank = e.detail;
  }
</script>

<div class="app">
  <!-- HEADER -->
  <header>
    <div class="header-title">
      <span class="title-atp" style="color: {ACCENT}">ATP</span>
      <span class="title-rest">BEST 50</span>
    </div>
    <span class="header-sub">Ultime 52 settimane</span>
  </header>

  <main>
    <!-- ROW 1: selettori + H2H placeholder -->
    <div class="row row-selectors">
      <PlayerSelector player={p1} color={C1} otherRank={p2rank} on:select={selectP1} />

      <div class="h2h-box">
        <span class="h2h-label">Head to Head</span>
        <div class="h2h-scores">
          <span class="h2h-name" style="color: {C1}">{p1.full.split(' ').at(-1).toUpperCase()}</span>
          <div class="h2h-numbers">
            <span class="h2h-num" style="color: {C1}">—</span>
            <span class="h2h-dash">–</span>
            <span class="h2h-num" style="color: {C2}">—</span>
          </div>
          <span class="h2h-name" style="color: {C2}">{p2.full.split(' ').at(-1).toUpperCase()}</span>
        </div>
        <span class="h2h-note">dati non disponibili</span>
      </div>

      <PlayerSelector player={p2} color={C2} otherRank={p1rank} on:select={selectP2} />
    </div>

    <!-- ROW 2: tab selezione sezione — riga intera -->
    <div class="row row-tabs">
      <div class="tabs">
        {#each TAB_KEYS as t (t)}
          <button
            class="tab-btn"
            class:active={tab === t}
            style={tab === t ? `background: ${ACCENT}; color: #fff;` : ''}
            on:click={() => (tab = t)}
          >
            {t}
          </button>
        {/each}
      </div>
    </div>

    <!-- ROW 3: stat P1 | radar | stat P2 -->
    <div class="row row-main">
      <!-- P1 stats -->
      <div class="col-stats card">
        <StatBars player={p1} color={C1} {tab} />
      </div>

      <!-- Radar + legend -->
      <div class="col-radar card radar-col">
        <RadarChart {p1} {p2} c1={C1} c2={C2} />
        <div class="radar-legend">
          <svg width="22" height="6">
            <line x1="0" y1="3" x2="22" y2="3" stroke="var(--avg)" stroke-width="2" stroke-dasharray="4 3" />
          </svg>
          <span class="legend-label">Media Top 50</span>
        </div>
        <span class="radar-hint">Passa il mouse sulle etichette per i valori</span>
      </div>

      <!-- P2 stats -->
      <div class="col-stats card">
        <StatBars player={p2} color={C2} {tab} />
      </div>
    </div>
  </main>

  <!-- FOOTER -->
  <footer>
    <div class="footer-inner">
      <div class="footer-title" style="color: {ACCENT}">FONTE E METODOLOGIA</div>
      <p class="footer-text">
        Dati basati su statistiche ATP Top 50 tratte da <strong>Tennis Abstract</strong>
        (tennisabstract.com, Jeff Sackmann). I valori sono placeholder realistici aggiornati alla stagione 2025–26.
      </p>
      <p class="footer-text">
        <strong>Radar:</strong> ogni asse è normalizzato sul range min–max del top 50
        (es. Hold% 73–93%), evidenziando la posizione relativa tra pari.
        <strong>H2H:</strong> dati non ancora disponibili — segnaposto in attesa di integrazione.
      </p>
    </div>
  </footer>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(:root) {
    --bg: #f4f7f5;
    --surf: #ffffff;
    --surf2: #edf3ef;
    --bord: #ccddd4;
    --accent: #2d7a45;
    --p1: #2563eb;
    --p2: #d97706;
    --avg: #9aada0;
    --txt: #1a2e20;
    --muted: #7a9882;
  }

  :global(html, body) {
    min-height: 100%;
    background: var(--bg);
    color: var(--txt);
    font-family: 'Barlow', sans-serif;
    font-size: 16px;
  }

  :global(::-webkit-scrollbar) { width: 5px; background: var(--surf2); }
  :global(::-webkit-scrollbar-thumb) { background: var(--bord); border-radius: 3px; }

  :global(button) {
    cursor: pointer;
    border: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
  }

  :global(input) { font-family: inherit; }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── HEADER ── */
  header {
    border-bottom: 1px solid var(--bord);
    padding: 0 20px;
    display: flex;
    align-items: center;
    height: 54px;
    background: var(--surf);
    flex-shrink: 0;
    gap: 12px;
    white-space: nowrap;
  }

  .header-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .title-rest { color: var(--txt); }

  .header-sub {
    font-family: 'Barlow', sans-serif;
    font-size: 13px;
    color: var(--muted);
  }

  /* ── MAIN ── */
  main {
    flex: 1;
    max-width: 1340px;
    width: 100%;
    margin: 0 auto;
    padding: 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .row {
    display: grid;
    gap: 10px;
  }

  /* Row 1: selectors + H2H */
  .row-selectors {
    grid-template-columns: 1fr 320px 1fr;
    align-items: stretch;
  }

  /* H2H box */
  .h2h-box {
    background: var(--surf);
    border-radius: 10px;
    padding: 12px 16px;
    border: 1px solid var(--bord);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .h2h-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .h2h-scores {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .h2h-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 700;
  }

  .h2h-numbers {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .h2h-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 34px;
    font-weight: 800;
    line-height: 1;
  }

  .h2h-dash {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    color: var(--muted);
  }

  .h2h-note {
    font-family: 'Barlow', sans-serif;
    font-size: 11px;
    color: var(--muted);
    font-style: italic;
  }

  /* Row 2: tabs */
  .row-tabs {
    grid-template-columns: 1fr;
  }

  .tabs {
    display: flex;
    gap: 3px;
    justify-content: center;
    background: var(--surf);
    border-radius: 10px;
    padding: 6px;
    border: 1px solid var(--bord);
  }

  .tab-btn {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 7px 28px;
    border-radius: 7px;
    color: var(--muted);
    transition: background 0.15s, color 0.15s;
  }

  .tab-btn:not(.active):hover {
    background: var(--surf2);
    color: var(--txt);
  }

  /* Row 3: stats + radar */
  .row-main {
    grid-template-columns: 240px 1fr 240px;
    align-items: stretch;
  }

  .card {
    background: var(--surf);
    border-radius: 10px;
    border: 1px solid var(--bord);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  }

  .col-stats {
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
  }

  .col-radar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 12px 16px;
    gap: 10px;
  }

  .radar-col {
    min-height: 480px;
  }

  .radar-legend {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 4px;
  }

  .legend-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    color: var(--muted);
    font-weight: 600;
  }

  .radar-hint {
    font-family: 'Barlow', sans-serif;
    font-size: 11px;
    color: var(--muted);
    text-align: center;
  }

  /* ── FOOTER ── */
  footer {
    background: var(--surf2);
    border-top: 1px solid var(--bord);
    padding: 20px 28px;
  }

  .footer-inner {
    max-width: 1080px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .footer-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.06em;
    margin-bottom: 3px;
  }

  .footer-text {
    font-family: 'Barlow', sans-serif;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
  }

  .footer-text strong {
    color: var(--txt);
  }
</style>
