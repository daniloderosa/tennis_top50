# ATP Best 50 — Dashboard statistiche tennis

Dashboard di confronto statistico tra i top 50 giocatori ATP (ultime 52 settimane), dati da Tennis Abstract.

## Stack

- **Vite + Svelte 4** (SPA pura, niente SvelteKit)
- D3 non usato direttamente: il radar è SVG fatto a mano
- Font: Spectral (serif display/valori) + Newsreader (serif testo/corsivi) — Barlow resta solo come fallback
- Lingua UI: **bilingue IT/EN** (`src/lib/i18n.js`), default **inglese**; l'italiano via `?lang=it` nell'URL (link bookmarkabili, cambio lingua = `history.replaceState`)

## Struttura

```
src/
  App.svelte              # layout, masthead, tab, modale metodologia, lang switch, tema CSS
  lib/
    data.js               # STAT_TABS (con label EN per stat), STAT_RANGES, getTabRadarData(tab, lang)
    i18n.js               # stringhe UI IT/EN, getLangFromURL/setLangInURL
    RadarChart.svelte     # radar SVG con hover inline sui label
    StatBars.svelte       # barre orizzontali per giocatore
    PlayerSelector.svelte # dropdown con ricerca
  data/players.json       # dati top-50 (generato da fetch script)
scripts/fetch_data.mjs    # fetch da Google Sheets (gviz/tq CSV)
.github/workflows/deploy.yml  # deploy automatico GitHub Pages
```

## Pipeline dati

1. Google Apps Script (lato utente) prende i dati da Tennis Abstract e li mette in un Google Sheet
2. `npm run fetch-data` legge il foglio via endpoint gviz/tq CSV e genera `src/data/players.json`
3. Tennis Abstract blocca gli IP cloud → il fetch va eseguito **dalla macchina locale dell'utente**

Mapping colonne particolari: `MdOppRk`→opp_rnk_med, `MnOppRk`→opp_rnk_avg, `Time/Mt`→dur_m, `Min/Set`→dur_s, `Sec/Pt`→dur_pt.
`Time/Mt` arriva in formato `h:mm` (es. "1:45") → convertito in **minuti totali** da `durMin()` nello script di fetch.

## Architettura dati (decisioni chiave)

- **Nessun min/max hardcoded**: `STAT_RANGES` in `data.js` calcola min/max a runtime dai dati reali dei top-50 per tutte le stat non-%. Le stat % usano anch'esse il range reale del top-50 (non 0–100) nel radar.
- `getTabRadarData(tabKey, lang)` genera assi + media top-50 per il tab corrente: il radar mostra le stat della sezione attiva, con etichette localizzate.
- 4 sezioni (`STAT_TABS`): Servizio, Risposta, Palle Break, Altro (chiavi italiane = ID interni, anche in localStorage; i nomi mostrati passano da `UI[lang].tabs`). Ogni stat ha `label`/`short` (IT), `en: { label, short }`, `unit`, `flip`.
- **`flip` vale solo per il radar** (valore basso = raggio lungo). Stat flip: df, df2s, vace, ptsl_sg, bpfaced, bpvs_s/m, bkn_s/m, **pts_sg, opp_rnk_med, opp_rnk_avg, dur_m, dur_s, dur_pt**. Le **barre** riempiono sempre in proporzione al valore reale (2.2% DF → barra al 2.2%; non-% normalizzate min–max senza inversione), con **riempimento minimo 2%** quando il dato c'è (il migliore nelle non-% avrebbe barra vuota = sembrerebbe dato mancante) — scelte esplicite dell'utente.
- `spw_inp` ("Punti vinti al servizio escl. Ace e DF") **rimossa** dalla UI su richiesta utente; classifica mediana/media avversari stanno nella sezione **Altro**.

## Layout / UI — direzione "Editoriale" (B, da Claude Design)

Stile data-journalism serif su carta calda (mockup: direzione B di "ATP Best 50 - Direzioni").

- max-width main: **1660px**, padding orizzontale 36px (**60px sotto i 1500px**: su 13" l'utente vuole più margine ai lati, non meno)
- colonne stat: **330px** (grid `330px 1fr 330px`, gap 30px); sotto i **1500px**: 280px, gap 22px
- **Breakpoint 1500px** (portatili 13"): stessi rapporti, misure ridotte via media query sulle CSS vars (--fs-bar-value 28→23, --fs-player 34→28, --fs-tabs 17→15, --fs-bar-label 16→14) e radar 510→430 (override CSS su `.radar-svg`)
- Palette: carta `#f4efe6`, inchiostro `#1c1a17`, P1 blu `#2f5d8a`, P2 ocra `#b8722c`, media `#9a8f7a`, hairline `#e6dfd2` (CSS vars in `:root` di App.svelte)
- Masthead: titolo "ATP Top 50 - Player Performance / Performance Giocatori" + suffisso "- Last 52 weeks / Ultime 52 settimane" più piccolo, non bold, attenuato (`.masthead-title-sub`); filetto 2px inchiostro; a destra **dropdown lingua** con bandierine e poi bottone **Metodologia** (apre modale con backdrop blur — il footer è stato rimosso)
- Selettori giocatore: nome grande serif con sottolineatura puntinata, eyebrow "N°rank · NAZ" colorata; dropdown su carta con hairline (P2 allineato/specchiato a destra, prop `align`)
- Righe stat: label Newsreader corsivo, valore Spectral inchiostro, barra 3px su track hairline; colonna P2 specchiata (prop `align` su StatBars)
- Tab: serif centrati su filetto, attivo = 600 + underline inchiostro, inattivi = 400 attenuati (mai corsivo)
- radar: `size={510}`, `fsLabel={15}` — viewBox interno fisso 420×420, scala via attributi width/height; tratti sottili (1.6), fill 0.07, dot r=3 bordo carta; font dei testi SVG via `var(--serif)` (regola CSS nel componente, niente font hardcoded)
- **Barre e radar centrati verticalmente** nella fascia sotto la linea grigia dei tab: `.stats-panel { margin: auto 0 }` e SVG radar con `margin: auto` (legenda in fondo); min-height su `.col-radar` (700px / 600px small) evita che i valori hover dell'asse in basso tocchino la legenda. Il centro del radar coincide nei 4 tab finché le colonne stat stanno nella finestra. `html { overflow-y: scroll }` resta (la scrollbar custom 5px comparirebbe solo nei tab con più righe spostando tutto di 5px; `scrollbar-gutter` non funziona con le scrollbar webkit custom)
- Label radar: tutte a distanza standard tranne **bpvs_m** ("PB concesse/match", +14 unità): il suo label lungo toccava il poligono esterno
- Sezione nomi: nome **centrato** nella fascia filetto nero → linea grigia con l'altezza minima possibile (`.row-selectors` margin-top 25px/21px ≈ spazio sotto + altezza tab; `.row-tabs` margin-top -6px; tab padding 2/4) — il centro esatto richiede quell'altezza, non si può comprimere oltre senza rimpicciolire nome o tab
- Tab mai in corsivo (nemmeno gli inattivi)
- **Landing senza giocatori**: niente masthead-titolo/filetto/metodologia (resta solo il dropdown lingua, `.masthead.bare`); al centro pagina `welcomeTitle` + "Select a player to begin" + **un solo selettore** (la prima scelta è P1); alla prima selezione si passa al layout classico (`landing = !p1 && !p2`)
- Il **titolo in grassetto del masthead è cliccabile** (`goHome()`: azzera p1/p2 e l'URL → torna alla landing)
- Le CSS vars `--surf` e `--accent` sono state rimosse (inutilizzate)
- Radar hover: ordine visivo sempre P1, P2, media anche sugli assi nella metà alta (slot invertiti quando i valori si impilano verso l'alto); media etichettata "Avg: "/"Media: " (prop `avgLabel` + ": ")
- **Dominance Ratio ha un info button** (ⓘ) accanto al label nelle barre: tooltip su hover CSS + click/tap (testo nei campi `info`/`en.info` della stat in data.js; ancorato a destra nella colonna P2). Per questo `.col-stats` NON ha overflow: lo clippa e fa comparire scrollbar interne
- Legenda radar 17px + hint 15px (min-height col-radar alzato a 720/620 per l'ingombro extra)
- Titolo masthead: main + sub senza trattino, distanziati via margin-left
- Radar hover: i 3 valori (P1, P2, media ⌀) compaiono inline sotto/sopra il label, sempre centrati (`text-anchor="middle"`)
- Legenda "media dei primi 50" + hint mouse: in fondo alla colonna radar; l'SVG ha `margin: auto` e `.col-radar` un min-height che evita l'accavallamento con i valori hover dell'asse in basso (che sbordano dal box SVG)
- **H2H rimosso** (niente dati; l'utente deciderà in futuro come reperirli)
- Ignorati dal mockup (per scelta utente): filtri superficie (Tutte/Cemento/Terra/Erba)
- **Giocatori: nessuna selezione di default** (barre vuote, radar con sola media top-50). La selezione vive **solo nell'URL** come slug dei nomi (`?p1=jannik-sinner&p2=carlos-alcaraz`, `history.replaceState`) per link bookmarkabili — niente localStorage per i giocatori. Solo il tab è persistito (`atpb50_tab`); la lingua vive nell'URL (`?lang=`)
- Sezione nomi+tab compatta (main gap 8px / 7px small; trigger selector senza padding; freccia selector 18px); tab 19px (17px small)
- **Tema in un punto solo**: sfondo e font = CSS vars in `:root` di App.svelte (`--bg`, `--surf`, `--serif`, `--serif-text`) + link Google Fonts in index.html; colori giocatori = costanti `C1`/`C2` in cima allo `<script>` di App.svelte (le vars `--p1`/`--p2` sono state rimosse perché inutilizzate)

## Deploy

- Repo: `daniloderosa/tennis_top50`, branch di lavoro: **main** (l'utente vuole che si lavori direttamente su main, senza branch feature)
- GitHub Pages via **GitHub Actions** (`.github/workflows/deploy.yml`): ogni push su main fa build+deploy automatico
- Source in Settings → Pages deve essere "GitHub Actions" (non più gh-pages branch)
- `vite.config.js` ha `base: '/tennis_top50/'` — non rimuoverlo
- `npm run deploy` (gh-pages) esiste ancora ma non serve più

## Flusso di lavoro con l'utente

- L'utente lavora in VS Code su Windows, in italiano
- L'utente preferisce istruzioni passo-passo per i comandi git (non eseguirli al posto suo se chiede solo spiegazioni)

## Cose in sospeso / possibili sviluppi

- H2H reale (dati head-to-head non ancora disponibili)
- Eventuale aggiornamento automatico dei dati (oggi manuale via `npm run fetch-data` dalla macchina locale)
