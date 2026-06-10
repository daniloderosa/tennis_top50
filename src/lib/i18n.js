// Lingue UI: default inglese; l'italiano si attiva con ?lang=it nell'URL.
// Il cambio lingua riscrive l'URL (history.replaceState) così ogni lingua
// ha un link proprio, salvabile nei segnalibri.

export const LANG_META = {
  en: { flag: "🇬🇧", name: "English" },
  it: { flag: "🇮🇹", name: "Italiano" },
};

export function getLangFromURL() {
  const p = new URLSearchParams(window.location.search).get("lang");
  return p === "it" ? "it" : "en";
}

export function setLangInURL(lang) {
  const url = new URL(window.location);
  url.searchParams.set("lang", lang);
  history.replaceState({}, "", url);
}

export const UI = {
  en: {
    titleMain: "ATP Top 50 - Player Performance",
    titleSub: "Last 52 weeks",
    avgShort: "Avg",
    welcomeTitle: "Welcome to the ATP Top 50 Player Performance",
    welcomeSub: "Select a player to begin",
    methodology: "Methodology",
    methTitle: "Source & methodology",
    methP1:
      "Data based on ATP Top 50 statistics from <strong>Tennis Abstract</strong> (tennisabstract.com, Jeff Sackmann), covering the last 52 weeks. Data is updated periodically.",
    methP2:
      "<strong>Radar:</strong> each axis is normalized to the min-max range of the top 50. For stats where a lower value is better (e.g. double faults) the scale is inverted: a longer radius always means a better performance.",
    legend: "average of the top 50 players",
    hint: "hover the labels to see the values",
    noRadar: "Not enough statistics for the radar chart",
    search: "Search…",
    selectPlayer: "Select a player",
    tabs: {
      Servizio: "Serve",
      Risposta: "Return",
      "Palle Break": "Break Points",
      Altro: "Other",
    },
  },
  it: {
    titleMain: "ATP Top 50 - Performance Giocatori",
    titleSub: "Ultime 52 settimane",
    avgShort: "Media",
    welcomeTitle: "Benvenuto in ATP Top 50 - Performance Giocatori",
    welcomeSub: "Seleziona un giocatore per iniziare",
    methodology: "Metodologia",
    methTitle: "Fonte e metodologia",
    methP1:
      "Dati basati su statistiche ATP Top 50 tratte da <strong>Tennis Abstract</strong> (tennisabstract.com, Jeff Sackmann), riferite alle ultime 52 settimane. I dati vengono aggiornati periodicamente.",
    methP2:
      "<strong>Radar:</strong> ogni asse è normalizzato sul range min-max del top 50. Per le statistiche in cui un valore basso è meglio (es. doppi falli) la scala è invertita: raggio più lungo = prestazione migliore.",
    legend: "media dei primi 50 del ranking",
    hint: "passa il mouse sulle etichette per i valori",
    noRadar: "Statistiche insufficienti per il grafico radar",
    search: "Cerca…",
    selectPlayer: "Seleziona un giocatore",
    tabs: {
      Servizio: "Servizio",
      Risposta: "Risposta",
      "Palle Break": "Palle Break",
      Altro: "Altro",
    },
  },
};
