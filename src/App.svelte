<script>
  import { PLAYERS, TAB_KEYS, getTabRadarData } from './lib/data.js';
  import RadarChart from './lib/RadarChart.svelte';
  import StatBars from './lib/StatBars.svelte';
  import StatRowsMobile from './lib/StatRowsMobile.svelte';
  import PlayerSelector from './lib/PlayerSelector.svelte';
  import { UI, LANG_META, getLangFromURL, setLangInURL } from './lib/i18n.js';

  const C1 = '#0d8652';
  const C2 = '#E58F65';

  // Giocatori: nessuna selezione di default; la scelta vive solo nell'URL
  // (?p1=jannik-sinner&p2=carlos-alcaraz) così ogni confronto ha un link
  // salvabile nei segnalibri.
  function slugify(name) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function rankFromSlug(slug) {
    if (!slug) return null;
    return PLAYERS.find(p => slugify(p.full) === slug)?.rank ?? null;
  }

  const initParams = new URLSearchParams(window.location.search);
  let p1rank = rankFromSlug(initParams.get('p1'));
  let p2rank = rankFromSlug(initParams.get('p2'));

  let tab = (() => {
    const t = localStorage.getItem('atpb50_tab');
    return TAB_KEYS.includes(t) ? t : TAB_KEYS[0];
  })();

  let lang = getLangFromURL();
  document.documentElement.lang = lang;

  let showMeth = false;
  let langOpen = false;
  let langWrap;

  // layout mobile (modello V1 "Editorial" da Claude Design) sotto i 760px
  const mqMobile = window.matchMedia('(max-width: 760px)');
  let isMobile = mqMobile.matches;
  mqMobile.addEventListener('change', (e) => (isMobile = e.matches));

  $: t = UI[lang];
  $: p1 = p1rank == null ? null : (PLAYERS.find(p => p.rank === p1rank) ?? null);
  $: p2 = p2rank == null ? null : (PLAYERS.find(p => p.rank === p2rank) ?? null);
  $: landing = !p1 && !p2; // nessuna selezione = schermata di benvenuto
  $: radarData = getTabRadarData(tab, lang);

  $: { localStorage.setItem('atpb50_tab', tab); }

  function syncPlayersURL() {
    const url = new URL(window.location);
    const s1 = p1rank == null ? null : PLAYERS.find(p => p.rank === p1rank);
    const s2 = p2rank == null ? null : PLAYERS.find(p => p.rank === p2rank);
    if (s1) url.searchParams.set('p1', slugify(s1.full)); else url.searchParams.delete('p1');
    if (s2) url.searchParams.set('p2', slugify(s2.full)); else url.searchParams.delete('p2');
    history.replaceState({}, '', url);
  }

  function selectP1(e) { p1rank = e.detail; syncPlayersURL(); }
  function selectP2(e) { p2rank = e.detail; syncPlayersURL(); }

  // click sul titolo → torna alla landing (nessun giocatore selezionato)
  function goHome() {
    p1rank = null;
    p2rank = null;
    syncPlayersURL();
  }

  function changeLang(l) {
    lang = l;
    setLangInURL(l);
    document.documentElement.lang = l;
    langOpen = false;
  }

  function onWindowMousedown(e) {
    if (langWrap && !langWrap.contains(e.target)) langOpen = false;
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      showMeth = false;
      langOpen = false;
    }
  }
</script>

<svelte:window
  on:mousedown={onWindowMousedown}
  on:keydown={onKeydown}
  on:resize={() => (isMobile = mqMobile.matches)}
/>

<div class="app">
  <main>
    <!-- MASTHEAD (in landing: niente titolo, metodologia né filetto) -->
    <header class="masthead" class:bare={landing}>
      {#if !landing}
        <div class="masthead-title">
          {#if isMobile}
            <div class="m-kicker">{t.mobileKicker}</div>
            <button class="title-link m-title" on:click={goHome}>ATP Top 100</button>
          {:else}
            <button class="title-link" on:click={goHome}>{t.titleMain}</button><span class="masthead-title-sub">{t.titleSub}</span>
          {/if}
        </div>
      {/if}
      <div class="masthead-right">
        <div class="lang-wrap" bind:this={langWrap}>
          <button class="lang-btn" on:click={() => (langOpen = !langOpen)}>
            <span class="lang-flag">{LANG_META[lang].flag}</span>
            <span class="lang-name">{LANG_META[lang].name}</span>
            <span class="lang-arrow" class:rotated={langOpen}>▾</span>
          </button>
          {#if langOpen}
            <div class="lang-menu">
              {#each Object.entries(LANG_META) as [code, meta] (code)}
                <button
                  class="lang-item"
                  class:active={lang === code}
                  on:click={() => changeLang(code)}
                >
                  <span class="lang-flag">{meta.flag}</span>
                  <span>{meta.name}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
        {#if !landing && !isMobile}
          <button class="meth-btn" on:click={() => (showMeth = true)}>{t.methodology}</button>
        {/if}
      </div>
    </header>

    {#if landing}
      <!-- LANDING: benvenuto centrato + selettori, niente altro -->
      <div class="welcome">
        <h1 class="welcome-title">{t.welcomeTitle}</h1>
        <p class="welcome-sub">{t.welcomeSub}</p>
        <!-- un solo selettore: la prima scelta è automaticamente P1 -->
        <div class="welcome-selectors">
          <PlayerSelector player={p1} color={C1} otherRank={p2rank} align="left" dropAlign="center" {lang} on:select={selectP1} />
        </div>
      </div>
    {:else}
      <!-- ROW 1: selettori -->
      {#if isMobile}
        <div class="m-players">
          <div class="m-player">
            <PlayerSelector compact player={p1} color={C1} otherRank={p2rank} align="left" {lang} on:select={selectP1} />
          </div>
          <div class="m-vdiv"></div>
          <div class="m-player">
            <PlayerSelector compact player={p2} color={C2} otherRank={p1rank} align="right" {lang} on:select={selectP2} />
          </div>
        </div>
      {:else}
        <div class="row row-selectors">
          <PlayerSelector player={p1} color={C1} otherRank={p2rank} align="left" {lang} on:select={selectP1} />
          <PlayerSelector player={p2} color={C2} otherRank={p1rank} align="right" {lang} on:select={selectP2} />
        </div>
      {/if}

      <!-- ROW 2: tab -->
      <div class="row row-tabs">
        <div class="tabs">
          {#each TAB_KEYS as tk (tk)}
            <button
              class="tab-btn"
              class:active={tab === tk}
              on:click={() => (tab = tk)}
            >{t.tabs[tk]}</button>
          {/each}
        </div>
      </div>

      {#if isMobile}
        <!-- MOBILE: radar centrale + righe stat a specchio -->
        <div class="m-radar">
          <RadarChart
            {p1} {p2} c1={C1} c2={C2}
            axes={radarData.axes} avgVals={radarData.avg}
            size={320}
            fsLabel={15}
            labelDist={184}
            emptyText={t.noRadar}
            avgLabel={t.avgShort}
          />
          <div class="radar-footer">
            <div class="radar-legend">
              <svg width="22" height="6">
                <line x1="0" y1="3" x2="22" y2="3" stroke="var(--avg)" stroke-width="1.4" stroke-dasharray="5 3" />
              </svg>
              <span class="legend-label">{t.legend}</span>
            </div>
            <span class="radar-hint">{t.hintTap}</span>
          </div>
        </div>

        <StatRowsMobile {p1} {p2} c1={C1} c2={C2} {tab} {lang} />

        <button class="m-meth" on:click={() => (showMeth = true)}>{t.methodology}</button>
      {:else}
        <!-- ROW 3: stat P1 | radar | stat P2 -->
        <div class="row row-main">
          <div class="col-stats">
            <StatBars player={p1} color={C1} {tab} {lang} align="left" />
          </div>

          <div class="col-radar">
            <RadarChart
              {p1} {p2} c1={C1} c2={C2}
              axes={radarData.axes} avgVals={radarData.avg}
              size={510}
              fsLabel={15}
              emptyText={t.noRadar}
              avgLabel={t.avgShort}
            />
            <div class="radar-footer">
              <div class="radar-legend">
                <svg width="22" height="6">
                  <line x1="0" y1="3" x2="22" y2="3" stroke="var(--avg)" stroke-width="1.4" stroke-dasharray="5 3" />
                </svg>
                <span class="legend-label">{t.legend}</span>
              </div>
              <span class="radar-hint">{t.hint}</span>
            </div>
          </div>

          <div class="col-stats">
            <StatBars player={p2} color={C2} {tab} {lang} align="right" />
          </div>
        </div>
      {/if}
    {/if}
  </main>

  <!-- MODALE METODOLOGIA -->
  {#if showMeth}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
      class="modal-overlay"
      role="presentation"
      on:mousedown={(e) => { if (e.target === e.currentTarget) showMeth = false; }}
    >
      <div class="modal" role="dialog" aria-modal="true" aria-label={t.methTitle}>
        <button class="modal-close" on:click={() => (showMeth = false)} aria-label="Close">×</button>
        <h2 class="modal-title">{t.methTitle}</h2>
        <p class="modal-text">{@html t.methP1}</p>
        <p class="modal-text">{@html t.methP2}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── TEMA ──
     Colori: sfondo = --bg qui sotto; colori giocatori = costanti
     C1 (P1 blu) e C2 (P2 ocra) in cima al <script> di questo file.
     Font: --serif (display/valori) e --serif-text (testo/corsivi) qui sotto
     + il <link> Google Fonts in index.html. */
  :global(:root) {
    --bg:    #eeeeee;       /* carta */
    --surf2: #e4e7e5;
    --bord:  #dde0de;       /* hairline chiara */
    --rule:  #d4d7d5;       /* hairline scura */
    --ink:   #1b1d1c;
    --avg:   #929e9a;
    --txt:   #1b1d1c;
    --muted: #717a76;
    --muted2:#9aa39e;
    --label: #565e5a;
    --serif:       'Lora', serif;
    --serif-text:  'Lora', serif;
    --fs-bar-label: 18px;
    --fs-bar-value: 28px;
    --fs-player:    29px;
    --fs-tabs:      18px;
  }

  /* Schermi piccoli (es. portatili 13"): stessi rapporti, misure ridotte */
  @media (max-width: 1500px) {
    :global(:root) {
      --fs-bar-label: 16px;
      --fs-bar-value: 23px;
      --fs-player:    25px;
      --fs-tabs:      16px;
    }
  }

  :global(html, body) {
    min-height: 100%;
    background: var(--bg);
    color: var(--txt);
    font-family: var(--serif-text);
    font-size: 16px;
  }

  :global(html) {
    /* scrollbar sempre presente: la sua comparsa nei tab con più righe
       non sposta il centro del radar */
    overflow-y: scroll;
  }

  :global(::-webkit-scrollbar) { width: 5px; background: var(--surf2); }
  :global(::-webkit-scrollbar-thumb) { background: var(--rule); border-radius: 3px; }
  :global(button) { cursor: pointer; border: none; background: transparent; color: inherit; font-family: inherit; }
  :global(input)  { font-family: inherit; }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── MAIN ── */
  main {
    flex: 1;
    max-width: 1660px;
    width: 100%;
    margin: 0 auto;
    padding: 26px 36px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
  }

  /* Sotto i 1500px i margini laterali AUMENTANO (60px): su 13" il layout
     full-width risultava schiacciato ai bordi — richiesta dell'utente */
  @media (max-width: 1500px) {
    main { padding: 18px 60px 14px; gap: 7px; }
  }

  /* ── MASTHEAD ── */
  .masthead {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 2px solid var(--ink);
    padding-bottom: 12px;
    flex-shrink: 0;
  }

  .masthead-title {
    font-family: var(--serif);
    font-size: 27px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  /* il titolo è un bottone che riporta alla landing */
  .title-link {
    font: inherit;
    letter-spacing: inherit;
    color: inherit;
    padding: 0;
    cursor: pointer;
  }

  .title-link:hover { text-decoration: underline 1px dotted var(--muted2); text-underline-offset: 5px; }

  .masthead-title-sub {
    font-size: 18px;
    font-weight: 400;
    color: var(--muted);
    margin-left: 10px;
  }

  @media (max-width: 1500px) {
    .masthead-title { font-size: 23px; }
    .masthead-title-sub { font-size: 15px; }
  }

  /* landing: resta solo il dropdown lingua in alto a destra */
  .masthead.bare {
    border-bottom: none;
    justify-content: flex-end;
    padding-bottom: 0;
  }

  /* ── WELCOME (landing) ── */
  .welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-bottom: 6vh; /* compensa otticamente la riga lingua in alto */
  }

  .welcome-title {
    font-family: var(--serif);
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--ink);
    line-height: 1.1;
  }

  .welcome-sub {
    font-family: var(--serif-text);
    font-size: 21px;
    font-style: italic;
    color: var(--muted);
    margin-top: 10px;
  }

  .welcome-selectors {
    display: flex;
    justify-content: center;
    margin-top: 44px;
  }

  /* il selettore non deve allargarsi a tutta pagina: solo il trigger */
  .welcome-selectors :global(.selector-wrap) { width: auto; }

  @media (max-width: 1500px) {
    .welcome-title { font-size: 36px; }
    .welcome-sub { font-size: 18px; }
    .welcome-selectors { margin-top: 36px; }
  }

  .masthead-right {
    display: flex;
    align-items: center;
    gap: 22px;
  }

  .meth-btn {
    font-family: var(--serif);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--label);
    padding: 6px 0;
    border-bottom: 1px dotted var(--muted2);
    transition: color 0.15s, border-color 0.15s;
  }

  .meth-btn:hover { color: var(--ink); border-bottom-color: var(--ink); }

  .lang-wrap { position: relative; }

  .lang-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--serif);
    font-size: 13px;
    font-weight: 500;
    color: var(--label);
    padding: 5px 10px;
    border: 1px solid var(--rule);
    transition: color 0.15s, border-color 0.15s;
  }

  .lang-btn:hover { color: var(--ink); border-color: var(--muted2); }

  .lang-flag { font-size: 14px; line-height: 1; }

  .lang-arrow {
    font-size: 10px;
    color: var(--muted);
    transition: transform 0.2s;
  }

  .lang-arrow.rotated { transform: rotate(180deg); }

  .lang-menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 100%;
    background: var(--bg);
    border: 1px solid var(--rule);
    box-shadow: 0 10px 32px rgba(28, 26, 23, 0.14);
    z-index: 400;
  }

  .lang-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--serif);
    font-size: 13px;
    color: var(--label);
    padding: 7px 12px;
    white-space: nowrap;
    text-align: left;
  }

  .lang-item:hover { background: var(--surf2); color: var(--ink); }
  .lang-item.active { color: var(--ink); font-weight: 600; }
  .lang-item + .lang-item { border-top: 1px solid var(--bord); }

  .row { display: grid; gap: 10px; }

  /* fascia nomi+tab ridotta al minimo per far stare la pagina su 13"
     senza scrollbar: a questa altezza il nome non può essere centrato
     esattamente (servirebbe sopra almeno l'altezza dei tab), il bianco
     è distribuito attorno al nome */
  .row-selectors {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 24px;
    flex-shrink: 0;
  }

  /* avvicina i tab al nome (riduce l'altezza totale della sezione) */
  .row-tabs { margin-top: -4px; }

  .row-tabs {
    grid-template-columns: 1fr;
    flex-shrink: 0;
  }

  .tabs {
    display: flex;
    gap: 0;
    justify-content: center;
    border-bottom: 1px solid var(--rule);
  }

  .tab-btn {
    font-family: var(--serif);
    font-size: var(--fs-tabs, 19px);
    font-weight: 400;
    color: var(--muted2);
    padding: 1px 34px 3px;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s;
  }

  @media (max-width: 1500px) {
    .tab-btn { padding: 1px 26px 3px; }
  }

  .tab-btn:not(.active):hover { color: var(--txt); }

  .tab-btn.active {
    font-weight: 600;
    color: var(--ink);
    border-bottom-color: var(--ink);
  }

  /* Row 3: fills remaining height */
  .row-main {
    grid-template-columns: 330px 1fr 330px;
    gap: 30px;
    align-items: stretch;
    flex: 1;
    min-height: 0;
  }

  @media (max-width: 1500px) {
    .row-main { grid-template-columns: 280px 1fr 280px; gap: 22px; }
  }

  /* niente overflow: taglierebbe i tooltip info e farebbe comparire
     scrollbar interne; se mai il contenuto sborda, scrolla la pagina */
  .col-stats {
    display: flex;
    flex-direction: column;
  }

  /* Il radar (margin: auto sull'SVG) si centra verticalmente nella fascia
     sotto la linea grigia dei tab; la legenda resta in fondo. Il min-height
     garantisce che i valori hover dell'asse in basso (che sbordano dal box
     SVG) non tocchino la legenda. Il centro coincide nei 4 tab finché le
     colonne stat stanno nell'altezza della finestra. */
  .col-radar {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 12px 8px;
    min-height: 745px;
  }

  @media (max-width: 1500px) {
    .col-radar { min-height: 635px; }
    .col-radar :global(.radar-svg) { width: 430px; height: 430px; }
  }

  .radar-footer {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    flex-shrink: 0;
  }

  .radar-legend {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .legend-label {
    font-family: var(--serif-text);
    font-size: 17px;
    font-style: italic;
    color: var(--muted);
  }

  .radar-hint {
    font-family: var(--serif-text);
    font-size: 15px;
    font-style: italic;
    color: var(--muted2);
  }

  /* ── MODALE ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(28, 26, 23, 0.35);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 500;
    padding: 24px;
  }

  .modal {
    position: relative;
    background: var(--bg);
    border: 1px solid var(--rule);
    box-shadow: 0 24px 64px rgba(28, 26, 23, 0.3);
    max-width: 580px;
    width: 100%;
    padding: 30px 36px 28px;
  }

  .modal-close {
    position: absolute;
    top: 10px;
    right: 14px;
    font-family: var(--serif);
    font-size: 26px;
    line-height: 1;
    color: var(--muted);
    padding: 4px;
    transition: color 0.15s;
  }

  .modal-close:hover { color: var(--ink); }

  .modal-title {
    font-family: var(--serif);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 2px solid var(--ink);
    padding-bottom: 10px;
    margin-bottom: 14px;
  }

  .modal-text {
    font-family: var(--serif-text);
    font-size: 15px;
    color: var(--label);
    line-height: 1.65;
  }

  .modal-text + .modal-text { margin-top: 10px; }

  .modal-text :global(strong) { color: var(--txt); font-weight: 500; }

  /* ── MOBILE (modello V1 "Editorial") ── */
  @media (max-width: 760px) {
    main { padding: 14px 18px 32px; gap: 0; }

    .masthead { align-items: flex-start; padding-bottom: 10px; }
    .masthead.bare { padding-bottom: 0; }

    .m-kicker {
      font-family: var(--serif);
      font-size: 10px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .m-title {
      display: block;
      font-family: var(--serif);
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.15;
      margin-top: 2px;
    }

    .lang-btn { padding: 4px 8px; font-size: 12px; }
    .lang-name { display: none; }

    /* due selettori affiancati divisi da hairline verticale */
    .m-players {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-top: 15px;
    }

    .m-player { flex: 1; min-width: 0; }

    .m-vdiv {
      width: 1px;
      align-self: stretch;
      background: var(--bord);
      flex-shrink: 0;
    }

    /* tab scrollabili, centrati quando ci stanno */
    .row-tabs { margin-top: 13px; }

    .tabs {
      justify-content: flex-start;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tabs::-webkit-scrollbar { display: none; }

    .tab-btn {
      padding: 8px 0 9px;
      margin: 0 12px -1px;
      font-size: 16px;
    }

    .tab-btn:first-child { margin-left: auto; }
    .tab-btn:last-child { margin-right: auto; }

    /* padding-top e margine legenda assorbono i valori tap dei label in
       alto/in basso, che sbordano dal box SVG: niente sovrapposizioni */
    .m-radar {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 42px 0 4px;
    }

    .m-radar :global(.radar-svg) { max-width: 100%; height: auto; }

    .m-radar .radar-footer { margin-top: 50px; }
    .legend-label { font-size: 13px; }
    .radar-hint { font-size: 12px; }

    .m-meth {
      display: block;
      margin: 28px auto 0;
      font-family: var(--serif);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--label);
      border-bottom: 1px dotted var(--muted2);
      padding: 4px 0;
    }

    .welcome-title { font-size: 30px; }
    .welcome-sub { font-size: 16px; }
    .welcome-selectors { margin-top: 30px; }

    .modal { padding: 24px 22px 22px; }
  }
</style>
