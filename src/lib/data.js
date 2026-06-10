import rawPlayers from '../data/players.json';

export const PLAYERS = rawPlayers;

// Sezioni barre — nessun min/max hardcoded: vengono calcolati da STAT_RANGES.
// Ogni stat ha label/short in italiano e `en: { label, short }` per l'inglese.
// `flip: true` = valore basso è meglio (usato SOLO dal radar; le barre
// riempiono sempre in proporzione al valore reale).
export const STAT_TABS = {
  Servizio: [
    { key: 'spw',     label: 'Punti vinti al servizio',                          short: '% punti srv',     unit: '%', flip: false, en: { label: 'Serve points won',                          short: 'Srv pts won' } },
    { key: 'ace',     label: 'Ace %',                                            short: 'Ace %',           unit: '%', flip: false, en: { label: 'Ace %',                                     short: 'Ace %' } },
    { key: 'df',      label: 'Doppi Falli %',                                    short: 'DF %',            unit: '%', flip: true,  en: { label: 'Double faults %',                           short: 'DF %' } },
    { key: 'df2s',    label: 'Doppi Falli % sulla seconda',                      short: 'DF % 2ª srv',     unit: '%', flip: true,  en: { label: 'Double faults % on 2nd serve',              short: 'DF % 2nd srv' } },
    { key: 's1',      label: 'Prime in campo %',                                 short: 'Prime in campo',  unit: '%', flip: false, en: { label: '1st serves in %',                           short: '1st srv in' } },
    { key: 's1w',     label: 'Punti vinti con la prima %',                       short: '% vinti 1ª srv',  unit: '%', flip: false, en: { label: '1st serve points won %',                    short: 'Won on 1st' } },
    { key: 's2w',     label: 'Punti vinti con la seconda %',                     short: '% vinti 2ª srv',  unit: '%', flip: false, en: { label: '2nd serve points won %',                    short: 'Won on 2nd' } },
    { key: 's2w_inp', label: 'Punti vinti con la seconda (escl. doppi falli) %', short: '% 2ª pressione',  unit: '%', flip: false, en: { label: '2nd serve points won (excl. DFs) %',        short: '2nd srv pressure' } },
    { key: 'hold',    label: 'Game vinti al servizio %',                         short: 'Hold %',          unit: '%', flip: false, en: { label: 'Service games held %',                      short: 'Hold %' } },
    { key: 'pts_sg',  label: 'Punti giocati per game al servizio',               short: 'Punti/game srv',  unit: '',  flip: false, en: { label: 'Points per service game',                   short: 'Pts/srv game' } },
    { key: 'ptsl_sg', label: 'Punti persi per game al servizio',                 short: 'Persi/game srv',  unit: '',  flip: true,  en: { label: 'Points lost per service game',              short: 'Lost/srv game' } },
  ],
  Risposta: [
    { key: 'ret',     label: 'Punti in risposta vinti %',                           short: '% punti risp',    unit: '%', flip: false, en: { label: 'Return points won %',                       short: 'Ret pts won' } },
    { key: 'ret_inp', label: 'Punti in risposta vinti % (escl. Ace e Doppi falli)', short: '% risp pressione', unit: '%', flip: false, en: { label: 'Return points won % (excl. aces & DFs)',    short: 'Ret pressure' } },
    { key: 'vace',    label: 'Ace % avversari',                                     short: 'Ace % avv.',      unit: '%', flip: true,  en: { label: 'Opponent ace %',                            short: 'Opp ace %' } },
    { key: 'vdf',     label: 'Doppi falli % avversari',                             short: 'DF % avv.',       unit: '%', flip: false, en: { label: 'Opponent double faults %',                  short: 'Opp DF %' } },
    { key: 'r1w',     label: 'Punti vinti in risposta alla prima %',                short: '% vinti vs 1ª',   unit: '%', flip: false, en: { label: 'Points won returning 1st serve %',          short: 'vs 1st srv' } },
    { key: 'r2w',     label: 'Punti vinti in risposta alla seconda %',              short: '% vinti vs 2ª',   unit: '%', flip: false, en: { label: 'Points won returning 2nd serve %',          short: 'vs 2nd srv' } },
    { key: 'brk',     label: 'Break %',                                             short: 'Break %',         unit: '%', flip: false, en: { label: 'Break %',                                   short: 'Break %' } },
    { key: 'pts_rg',  label: 'Punti giocati per game in risposta',                  short: 'Punti/game risp', unit: '',  flip: false, en: { label: 'Points per return game',                    short: 'Pts/ret game' } },
    { key: 'ptsw_rg', label: 'Punti vinti per game in risposta',                    short: 'Vinti/game risp', unit: '',  flip: false, en: { label: 'Points won per return game',                short: 'Won/ret game' } },
  ],
  'Palle Break': [
    { key: 'bpconv',  label: 'Palle break convertite %',       short: '% PB conv.',     unit: '%', flip: false, en: { label: 'Break points converted %',      short: 'BP conv. %' } },
    { key: 'bp_g',    label: 'Palle break per game',           short: 'PB/game',        unit: '',  flip: false, en: { label: 'Break points per game',         short: 'BP/game' } },
    { key: 'bp_s',    label: 'Palle break per set',            short: 'PB/set',         unit: '',  flip: false, en: { label: 'Break points per set',          short: 'BP/set' } },
    { key: 'bp_m',    label: 'Palle break per match',          short: 'PB/match',       unit: '',  flip: false, en: { label: 'Break points per match',        short: 'BP/match' } },
    { key: 'bks_s',   label: 'Break per set',                  short: 'Break/set',      unit: '',  flip: false, en: { label: 'Breaks per set',                short: 'Breaks/set' } },
    { key: 'bks_m',   label: 'Break per match',                short: 'Break/match',    unit: '',  flip: false, en: { label: 'Breaks per match',              short: 'Breaks/match' } },
    { key: 'bpsaved', label: 'Palle break salvate %',          short: '% PB salvate',   unit: '%', flip: false, en: { label: 'Break points saved %',          short: 'BP saved %' } },
    { key: 'bpfaced', label: 'Palle break concesse per game',  short: 'PB conc./game',  unit: '',  flip: true,  en: { label: 'Break points faced per game',   short: 'BP faced/game' } },
    { key: 'bpvs_s',  label: 'Palle break concesse per set',   short: 'PB conc./set',   unit: '',  flip: true,  en: { label: 'Break points faced per set',    short: 'BP faced/set' } },
    { key: 'bpvs_m',  label: 'Palle break concesse per match', short: 'PB conc./match', unit: '',  flip: true,  en: { label: 'Break points faced per match',  short: 'BP faced/match' } },
    { key: 'bkn_s',   label: 'Break subiti per set',           short: 'Broken/set',     unit: '',  flip: true,  en: { label: 'Times broken per set',          short: 'Broken/set' } },
    { key: 'bkn_m',   label: 'Break subiti per match',         short: 'Broken/match',   unit: '',  flip: true,  en: { label: 'Times broken per match',        short: 'Broken/match' } },
  ],
  Altro: [
    { key: 'dr',          label: 'Dominance Ratio',              short: 'Dom. Ratio',        unit: '',  flip: false, en: { label: 'Dominance Ratio',          short: 'Dom. Ratio' } },
    { key: 'tpw',         label: 'Punti vinti %',                short: '% punti totali',    unit: '%', flip: false, en: { label: 'Total points won %',       short: 'Total pts won' } },
    { key: 'tie',         label: 'Tiebreak vinti %',             short: '% TB vinti',        unit: '%', flip: false, en: { label: 'Tiebreaks won %',          short: 'TBs won' } },
    { key: 'setwon',      label: 'Set vinti %',                  short: '% set vinti',       unit: '%', flip: false, en: { label: 'Sets won %',               short: 'Sets won' } },
    { key: 'gwon',        label: 'Game vinti %',                 short: '% game vinti',      unit: '%', flip: false, en: { label: 'Games won %',              short: 'Games won' } },
    { key: 'opp_rnk_med', label: 'Classifica mediana avversari', short: 'Rank avv. mediano', unit: '',  flip: false, en: { label: 'Median opponent ranking',  short: 'Median opp rank' } },
    { key: 'opp_rnk_avg', label: 'Classifica media avversari',   short: 'Rank avv. medio',   unit: '',  flip: false, en: { label: 'Average opponent ranking', short: 'Avg opp rank' } },
    { key: 'dur_m',       label: 'Durata match (min.)',          short: 'Durata match',      unit: '',  flip: false, en: { label: 'Match duration (min.)',    short: 'Match dur.' } },
    { key: 'dur_s',       label: 'Durata set (min.)',            short: 'Durata set',        unit: '',  flip: false, en: { label: 'Set duration (min.)',      short: 'Set dur.' } },
    { key: 'dur_pt',      label: 'Durata punti (sec.)',          short: 'Durata punto',      unit: '',  flip: false, en: { label: 'Point duration (sec.)',    short: 'Point dur.' } },
  ],
};

export const TAB_KEYS = Object.keys(STAT_TABS);

// Etichetta localizzata di una stat ('it' default)
export function statLabel(stat, lang) {
  return lang === 'en' && stat.en ? stat.en.label : stat.label;
}

// Min/max calcolati dai dati reali del top-50 per ogni stat non-%
// Usati da StatBars (barre) e getTabRadarData (radar)
export const STAT_RANGES = (() => {
  const ranges = {};
  for (const stats of Object.values(STAT_TABS)) {
    for (const stat of stats) {
      if (stat.unit === '%') continue;
      const vals = PLAYERS.map(p => p[stat.key]).filter(v => v != null);
      if (vals.length > 0) {
        ranges[stat.key] = { min: Math.min(...vals), max: Math.max(...vals) };
      }
    }
  }
  return ranges;
})();

export function norm(v, min, max) {
  return Math.max(0, Math.min(1, (v - min) / (max - min)));
}

// Restituisce { axes, avg } per il tab corrente, da passare a RadarChart.
// `lang` sceglie le etichette ('it' | 'en').
export function getTabRadarData(tabKey, lang = 'it') {
  const stats = STAT_TABS[tabKey] ?? [];
  const axes = stats.map(stat => {
    let min, max;
    if (stat.unit === '%') {
      // Per le % usiamo il range reale del top-50, non 0-100
      const vals = PLAYERS.map(p => p[stat.key]).filter(v => v != null);
      if (vals.length === 0) return null;
      min = Math.min(...vals);
      max = Math.max(...vals);
    } else {
      const range = STAT_RANGES[stat.key];
      if (!range) return null;
      min = range.min;
      max = range.max;
    }
    if (max <= min) return null;
    const loc = lang === 'en' && stat.en ? stat.en : stat;
    return { key: stat.key, label: loc.label, short: loc.short, unit: stat.unit ?? '', min, max, flip: stat.flip ?? false };
  }).filter(Boolean);

  const avg = axes.map(ax => {
    const vals = PLAYERS.map(p => p[ax.key]).filter(v => v != null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  });

  return { axes, avg };
}
