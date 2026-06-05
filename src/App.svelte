<script>
  import { PLAYERS, TAB_KEYS, getTabRadarData } from './lib/data.js';
  import RadarChart from './lib/RadarChart.svelte';
  import StatBars from './lib/StatBars.svelte';
  import PlayerSelector from './lib/PlayerSelector.svelte';

  const C1    = '#2563eb';
  const C2    = '#d97706';
  const ACCENT = '#2d7a45';

  let p1rank = +(localStorage.getItem('atpb50_p1') || 1);
  let p2rank = +(localStorage.getItem('atpb50_p2') || 2);
  let tab = (() => {
    const t = localStorage.getItem('atpb50_tab');
    return TAB_KEYS.includes(t) ? t : TAB_KEYS[0];
  })();

  $: p1 = PLAYERS.find(p => p.rank === p1rank) ?? PLAYERS[0];
  $: p2 = PLAYERS.find(p => p.rank === p2rank) ?? PLAYERS[1];
  $: radarData = getTabRadarData(tab);

  $: { localStorage.setItem('atpb50_p1', p1rank); }
  $: { localStorage.setItem('atpb50_p2', p2rank); }
  $: { localStorage.setItem('atpb50_tab', tab); }

  function selectP1(e) { p1rank = e.detail; }
  function selectP2(e) { p2rank = e.detail; }

  // ── Debug panel ──────────────────────────────────────────────
  let showDebug   = true;
  let padH        = 0;
  let maxW        = 1660;
  let fsBarLabel  = 17;
  let fsBarValue  = 28;
  let fsPlayer    = 27;
  let fsTabs      = 18;
  let fsRadar     = 15;   // SVG user-unit font size for radar labels
  let colW        = 330;  // px width of each stats column
  let radarSize   = 510;  // px rendered size of radar SVG

  $: cssVars = [
    `--pad-h:${padH}px`,
    `--max-w:${maxW}px`,
    `--fs-bar-label:${fsBarLabel}px`,
    `--fs-bar-value:${fsBarValue}px`,
    `--fs-player:${fsPlayer}px`,
    `--fs-tabs:${fsTabs}px`,
    `--col-w:${colW}px`,
  ].join(';');
</script>

<div class="app" style={cssVars}>
  <!-- HEADER -->
  <header>
    <div class="header-title">
      <span class="title-atp" style="color: {ACCENT}">ATP</span>
      <span class="title-rest">BEST 50</span>
    </div>
    <span class="header-sub">Ultime 52 settimane</span>
  </header>

  <main>
    <!-- ROW 1: selettori + H2H -->
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

    <!-- ROW 2: tab -->
    <div class="row row-tabs">
      <div class="tabs">
        {#each TAB_KEYS as t (t)}
          <button
            class="tab-btn"
            class:active={tab === t}
            style={tab === t ? `background: ${ACCENT}; color: #fff;` : ''}
            on:click={() => (tab = t)}
          >{t}</button>
        {/each}
      </div>
    </div>

    <!-- ROW 3: stat P1 | radar | stat P2 -->
    <div class="row row-main">
      <div class="col-stats card">
        <StatBars player={p1} color={C1} {tab} />
      </div>

      <div class="col-radar card radar-col">
        <RadarChart
          {p1} {p2} c1={C1} c2={C2}
          axes={radarData.axes} avgVals={radarData.avg}
          size={radarSize}
          fsLabel={fsRadar}
        />
        <div class="radar-footer">
          <div class="radar-legend">
            <svg width="22" height="6">
              <line x1="0" y1="3" x2="22" y2="3" stroke="var(--avg)" stroke-width="2" stroke-dasharray="4 3" />
            </svg>
            <span class="legend-label">Media Top 50</span>
          </div>
          <span class="radar-hint">Passa il mouse sulle etichette per i valori</span>
        </div>
      </div>

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
        (tennisabstract.com, Jeff Sackmann). Aggiornati all'ultima esecuzione di <code>npm run fetch-data</code>.
      </p>
      <p class="footer-text">
        <strong>Radar:</strong> ogni asse è normalizzato sul range min–max del top 50.
        Le stat con flip (es. Doppi Falli) sono invertite: raggio più lungo = prestazione migliore.
        <strong>H2H:</strong> dati non ancora disponibili.
      </p>
    </div>
  </footer>

  <!-- DEBUG PANEL -->
  {#if showDebug}
  <div class="debug-panel">
    <div class="debug-header">
      <span>⚙ Debug layout</span>
      <button class="debug-close" on:click={() => (showDebug = false)}>×</button>
    </div>

    <div class="debug-group">
      <div class="debug-group-title">Layout</div>
      <div class="debug-row">
        <label>Margine H <strong>{padH}px</strong></label>
        <input type="range" min="0" max="80" step="2" bind:value={padH} />
      </div>
      <div class="debug-row">
        <label>Max width <strong>{maxW}px</strong></label>
        <input type="range" min="800" max="1800" step="20" bind:value={maxW} />
      </div>
      <div class="debug-row">
        <label>Largh. colonne stat <strong>{colW}px</strong></label>
        <input type="range" min="160" max="480" step="10" bind:value={colW} />
      </div>
    </div>

    <div class="debug-group">
      <div class="debug-group-title">Font barre</div>
      <div class="debug-row">
        <label>Etichetta stat <strong>{fsBarLabel}px</strong></label>
        <input type="range" min="9" max="20" bind:value={fsBarLabel} />
      </div>
      <div class="debug-row">
        <label>Valore stat <strong>{fsBarValue}px</strong></label>
        <input type="range" min="12" max="34" bind:value={fsBarValue} />
      </div>
    </div>

    <div class="debug-group">
      <div class="debug-group-title">Font selettori / tab</div>
      <div class="debug-row">
        <label>Nome giocatore <strong>{fsPlayer}px</strong></label>
        <input type="range" min="14" max="36" bind:value={fsPlayer} />
      </div>
      <div class="debug-row">
        <label>Tab <strong>{fsTabs}px</strong></label>
        <input type="range" min="10" max="24" bind:value={fsTabs} />
      </div>
    </div>

    <div class="debug-group">
      <div class="debug-group-title">Radar</div>
      <div class="debug-row">
        <label>Dimensione <strong>{radarSize}px</strong></label>
        <input type="range" min="260" max="600" step="10" bind:value={radarSize} />
      </div>
      <div class="debug-row">
        <label>Font etichette <strong>{fsRadar}</strong></label>
        <input type="range" min="7" max="18" bind:value={fsRadar} />
      </div>
    </div>

    <div class="debug-values">
      padH={padH} · maxW={maxW} · colW={colW}<br/>
      fsBarLabel={fsBarLabel} · fsBarValue={fsBarValue}<br/>
      fsPlayer={fsPlayer} · fsTabs={fsTabs}<br/>
      radarSize={radarSize} · fsRadar={fsRadar}
    </div>
  </div>
  {:else}
  <button class="debug-toggle" on:click={() => (showDebug = true)}>⚙</button>
  {/if}
</div>

<style>
  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }

  :global(:root) {
    --bg:    #f4f7f5;
    --surf:  #ffffff;
    --surf2: #edf3ef;
    --bord:  #ccddd4;
    --accent:#2d7a45;
    --p1:    #2563eb;
    --p2:    #d97706;
    --avg:   #9aada0;
    --txt:   #1a2e20;
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
  :global(button) { cursor: pointer; border: none; background: transparent; color: inherit; font-family: inherit; }
  :global(input)  { font-family: inherit; }

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
    max-width: var(--max-w, 1660px);
    width: 100%;
    margin: 0 auto;
    padding: 12px var(--pad-h, 0px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
  }

  .row { display: grid; gap: 10px; }

  .row-selectors {
    grid-template-columns: 1fr 320px 1fr;
    align-items: stretch;
    flex-shrink: 0;
  }

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

  .h2h-scores { display: flex; align-items: center; gap: 10px; }

  .h2h-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 700;
  }

  .h2h-numbers { display: flex; align-items: center; gap: 6px; }

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

  .row-tabs {
    grid-template-columns: 1fr;
    flex-shrink: 0;
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
    font-size: var(--fs-tabs, 18px);
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

  /* Row 3: fills remaining height */
  .row-main {
    grid-template-columns: var(--col-w, 240px) 1fr var(--col-w, 240px);
    align-items: stretch;
    flex: 1;
    min-height: 0;
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
    overflow-y: auto;
  }

  .col-radar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 12px 16px;
    position: relative;
  }

  .radar-col { min-height: 480px; }

  .radar-footer {
    position: absolute;
    bottom: 14px;
    right: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .radar-legend {
    display: flex;
    align-items: center;
    gap: 7px;
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
    text-align: right;
  }

  /* ── FOOTER ── */
  footer {
    background: var(--surf2);
    border-top: 1px solid var(--bord);
    padding: 20px 28px;
    flex-shrink: 0;
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

  .footer-text strong { color: var(--txt); }
  .footer-text code {
    font-size: 12px;
    background: var(--bord);
    padding: 1px 5px;
    border-radius: 3px;
    color: var(--txt);
  }

  /* ── DEBUG PANEL ── */
  .debug-panel {
    position: fixed;
    bottom: 16px;
    right: 16px;
    background: var(--surf);
    border: 1.5px solid var(--bord);
    border-radius: 10px;
    padding: 12px 14px;
    z-index: 1000;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.13);
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 240px;
    max-height: 90vh;
    overflow-y: auto;
    font-family: 'Barlow', sans-serif;
  }

  .debug-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    color: var(--txt);
    margin-bottom: 2px;
  }

  .debug-close { font-size: 18px; color: var(--muted); line-height: 1; padding: 0 2px; }

  .debug-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-top: 1px solid var(--surf2);
    padding-top: 6px;
  }

  .debug-group-title {
    font-size: 10px;
    font-weight: 700;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .debug-row { display: flex; flex-direction: column; gap: 1px; }

  .debug-row label {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--muted);
  }

  .debug-row label strong { color: var(--txt); }

  .debug-row input[type="range"] {
    width: 100%;
    cursor: pointer;
    accent-color: var(--accent);
  }

  .debug-values {
    font-size: 10px;
    color: var(--muted);
    background: var(--surf2);
    border-radius: 5px;
    padding: 6px 8px;
    line-height: 1.8;
    font-family: monospace;
    user-select: all;
    margin-top: 2px;
  }

  .debug-toggle {
    position: fixed;
    bottom: 16px;
    right: 16px;
    background: var(--surf);
    border: 1.5px solid var(--bord);
    border-radius: 8px;
    width: 36px;
    height: 36px;
    cursor: pointer;
    z-index: 1000;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
</style>
