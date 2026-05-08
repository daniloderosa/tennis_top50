import rawPlayers from '../data/players.json';

export const PLAYERS = rawPlayers;

// Radar axes (8 chiavi, normalizzate sul range min-max top-50) — usate come fallback
export const RADAR_AXES = [
  { key: 's1',   label: '1° Srv In',    min: 55, max: 72 },
  { key: 's1w',  label: '1° Srv Vinti', min: 64, max: 82 },
  { key: 's2w',  label: '2° Srv Vinti', min: 48, max: 62 },
  { key: 'hold', label: 'Hold',         min: 73, max: 93 },
  { key: 'brk',  label: 'Break',        min: 26, max: 50 },
  { key: 'ret',  label: 'Ret Pts',      min: 33, max: 47 },
  { key: 'r2w',  label: '2° Ret',       min: 43, max: 59 },
  { key: 'r1w',  label: '1° Ret',       min: 25, max: 39 },
];

// Sezioni barre — label: nome completo nelle barre, short: etichetta radar
export const STAT_TABS = {
  Servizio: [
    { key: 'spw',     label: 'Punti vinti al servizio',                  short: '% punti srv',      unit: '%', flip: false },
    { key: 'spw_inp', label: 'Punti vinti al servizio (escl. Ace e DF)', short: '% srv pressione',  unit: '%', flip: false },
    { key: 's1',      label: 'Prime in campo',                           short: 'Prime in campo',   unit: '%', flip: false },
    { key: 's1w',     label: 'Punti vinti con la prima',                 short: '% vinti 1ª srv',   unit: '%', flip: false },
    { key: 's2w',     label: 'Punti vinti con la seconda',               short: '% vinti 2ª srv',   unit: '%', flip: false },
    { key: 's2w_inp', label: 'Punti vinti con la seconda (escl. DF)',    short: '% 2ª pressione',   unit: '%', flip: false },
    { key: 'hold',    label: 'Game vinti al servizio',                   short: 'Hold %',           unit: '%', flip: false },
    { key: 'df2s',    label: 'Doppi Falli % sulla seconda',              short: 'DF % 2ª srv',      unit: '%', flip: true  },
    { key: 'pts_sg',  label: 'Punti giocati per game al servizio',       short: 'Punti/game srv',   unit: '',  flip: false, min: 3.5, max: 5.5 },
    { key: 'ptsl_sg', label: 'Punti persi per game al servizio',         short: 'Persi/game srv',   unit: '',  flip: true,  min: 1.5, max: 3.5 },
  ],
  Risposta: [
    { key: 'ret',     label: 'Punti in risposta vinti',                  short: '% punti risp',     unit: '%', flip: false },
    { key: 'ret_inp', label: 'Punti in risposta vinti (escl. Ace e DF)', short: '% risp pressione', unit: '%', flip: false },
    { key: 'r1w',     label: 'Punti vinti in risposta alla prima',       short: '% vinti vs 1ª',    unit: '%', flip: false },
    { key: 'r2w',     label: 'Punti vinti in risposta alla seconda',     short: '% vinti vs 2ª',    unit: '%', flip: false },
    { key: 'brk',     label: 'Break',                                    short: 'Break %',          unit: '%', flip: false },
    { key: 'vace',    label: 'Ace % avversari',                          short: 'Ace % avv.',       unit: '%', flip: true  },
    { key: 'vdf',     label: 'Doppi falli % avversari',                  short: 'DF % avv.',        unit: '%', flip: false },
    { key: 'pts_rg',  label: 'Punti giocati per game in risposta',       short: 'Punti/game risp',  unit: '',  flip: false, min: 3.0, max: 5.0 },
    { key: 'ptsw_rg', label: 'Punti vinti per game in risposta',         short: 'Vinti/game risp',  unit: '',  flip: false, min: 1.0, max: 3.0 },
  ],
  'Palle Break': [
    { key: 'bks_s',   label: 'Break per set',                            short: 'Break/set',        unit: '',  flip: false, min: 0.2, max: 1.2 },
    { key: 'bkn_s',   label: 'Break subiti per set',                     short: 'Broken/set',       unit: '',  flip: true,  min: 0.1, max: 0.8 },
  ],
  Altro: [
    { key: 'tpw',    label: 'Punti vinti',                               short: '% punti totali',   unit: '%', flip: false },
    { key: 'dr',     label: 'Dominance Ratio',                           short: 'Dom. Ratio',       unit: '',  flip: false, min: 0.7, max: 1.5 },
    { key: 'setwon', label: 'Set vinti',                                 short: '% set vinti',      unit: '%', flip: false },
    { key: 'gwon',   label: 'Game vinti',                                short: '% game vinti',     unit: '%', flip: false },
    { key: 'tie',    label: 'Tiebreak vinti',                            short: '% TB vinti',       unit: '%', flip: false },
  ],
};

export const TAB_KEYS = Object.keys(STAT_TABS);

// Media top-50 per ogni asse radar (legacy)
export const TOP50_AVG = RADAR_AXES.map(ax => {
  const vals = PLAYERS.map(p => p[ax.key]).filter(v => v != null);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
});

export function norm(v, min, max) {
  return Math.max(0, Math.min(1, (v - min) / (max - min)));
}

// Restituisce { axes, avg } per il tab corrente, da passare a RadarChart
export function getTabRadarData(tabKey) {
  const stats = STAT_TABS[tabKey] ?? [];
  const axes = stats.map(stat => {
    let min = stat.min;
    let max = stat.max;
    if (min == null || max == null) {
      const vals = PLAYERS.map(p => p[stat.key]).filter(v => v != null);
      if (vals.length === 0) return null;
      min = Math.min(...vals);
      max = Math.max(...vals);
    }
    if (max <= min) return null;
    return { key: stat.key, label: stat.label, short: stat.short, unit: stat.unit ?? '', min, max, flip: stat.flip ?? false };
  }).filter(Boolean);

  const avg = axes.map(ax => {
    const vals = PLAYERS.map(p => p[ax.key]).filter(v => v != null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  });

  return { axes, avg };
}
