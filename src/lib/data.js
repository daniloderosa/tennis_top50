import rawPlayers from '../data/players.json';

export const PLAYERS = rawPlayers;

// Radar axes legacy — non più usato direttamente da RadarChart
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

// Sezioni barre — ordine = ordine colonne foglio Google, solo campi Y
export const STAT_TABS = {
  Servizio: [
    { key: 'spw',     label: 'Punti vinti al servizio',                         short: '% punti srv',       unit: '%', flip: false },
    { key: 'spw_inp', label: 'Punti vinti al servizio (escl. Ace e Doppi falli)',short: '% srv pressione',   unit: '%', flip: false },
    { key: 'ace',     label: 'Ace %',                                            short: 'Ace %',             unit: '%', flip: false },
    { key: 'df',      label: 'Doppi Falli %',                                    short: 'DF %',              unit: '%', flip: true  },
    { key: 'df2s',    label: 'Doppi Falli % sulla seconda',                      short: 'DF % 2ª srv',       unit: '%', flip: true  },
    { key: 's1',      label: 'Prime in campo %',                                 short: 'Prime in campo',    unit: '%', flip: false },
    { key: 's1w',     label: 'Punti vinti con la prima %',                       short: '% vinti 1ª srv',    unit: '%', flip: false },
    { key: 's2w',     label: 'Punti vinti con la seconda %',                     short: '% vinti 2ª srv',    unit: '%', flip: false },
    { key: 's2w_inp', label: 'Punti vinti con la seconda (escl. doppi falli) %', short: '% 2ª pressione',    unit: '%', flip: false },
    { key: 'hold',    label: 'Game vinti al servizio %',                         short: 'Hold %',            unit: '%', flip: false },
    { key: 'pts_sg',  label: 'Punti giocati per game al servizio',               short: 'Punti/game srv',    unit: '',  flip: false, min: 3.5, max: 5.5 },
    { key: 'ptsl_sg', label: 'Punti persi per game al servizio',                 short: 'Persi/game srv',    unit: '',  flip: true,  min: 1.5, max: 3.5 },
  ],
  Risposta: [
    { key: 'ret',         label: 'Punti in risposta vinti %',                        short: '% punti risp',       unit: '%', flip: false },
    { key: 'ret_inp',     label: 'Punti in risposta vinti % (escl. Ace e Doppi falli)', short: '% risp pressione', unit: '%', flip: false },
    { key: 'vace',        label: 'Ace % avversari',                                  short: 'Ace % avv.',         unit: '%', flip: true  },
    { key: 'vdf',         label: 'Doppi falli % avversari',                          short: 'DF % avv.',          unit: '%', flip: false },
    { key: 'r1w',         label: 'Punti vinti in risposta alla prima %',             short: '% vinti vs 1ª',      unit: '%', flip: false },
    { key: 'r2w',         label: 'Punti vinti in risposta alla seconda %',           short: '% vinti vs 2ª',      unit: '%', flip: false },
    { key: 'brk',         label: 'Break %',                                          short: 'Break %',            unit: '%', flip: false },
    { key: 'pts_rg',      label: 'Punti giocati per game in risposta',               short: 'Punti/game risp',    unit: '',  flip: false, min: 3.0, max: 5.0 },
    { key: 'ptsw_rg',     label: 'Punti vinti per game in risposta',                 short: 'Vinti/game risp',    unit: '',  flip: false, min: 1.0, max: 3.0 },
    { key: 'opp_rnk_med', label: 'Classifica mediana avversari',                     short: 'Rank avv. mediano',  unit: '',  flip: false },
    { key: 'opp_rnk_avg', label: 'Classifica media avversari',                       short: 'Rank avv. medio',    unit: '',  flip: false },
  ],
  'Palle Break': [
    { key: 'bpconv',  label: 'Palle break convertite %',          short: '% PB conv.',        unit: '%', flip: false },
    { key: 'bp_g',    label: 'Palle break per game',              short: 'PB/game',           unit: '',  flip: false, min: 0.2, max: 0.9 },
    { key: 'bp_s',    label: 'Palle break per set',               short: 'PB/set',            unit: '',  flip: false, min: 0.8, max: 3.5 },
    { key: 'bp_m',    label: 'Palle break per match',             short: 'PB/match',          unit: '',  flip: false },
    { key: 'bks_s',   label: 'Break per set',                     short: 'Break/set',         unit: '',  flip: false, min: 0.2, max: 1.2 },
    { key: 'bks_m',   label: 'Break per match',                   short: 'Break/match',       unit: '',  flip: false },
    { key: 'bpsaved', label: 'Palle break salvate %',             short: '% PB salvate',      unit: '%', flip: false },
    { key: 'bpfaced', label: 'Palle break concesse per game',     short: 'PB conc./game',     unit: '',  flip: true,  min: 0.2, max: 0.9 },
    { key: 'bpvs_s',  label: 'Palle break concesse per set',      short: 'PB conc./set',      unit: '',  flip: true,  min: 0.8, max: 3.5 },
    { key: 'bpvs_m',  label: 'Palle break concesse per match',    short: 'PB conc./match',    unit: '',  flip: true  },
    { key: 'bkn_s',   label: 'Break subiti per set',              short: 'Broken/set',        unit: '',  flip: true,  min: 0.1, max: 0.8 },
    { key: 'bkn_m',   label: 'Break subiti per match',            short: 'Broken/match',      unit: '',  flip: true  },
  ],
  Altro: [
    { key: 'dr',     label: 'Dominance Ratio',      short: 'Dom. Ratio',     unit: '',  flip: false, min: 0.7, max: 1.5 },
    { key: 'tpw',    label: 'Punti vinti %',         short: '% punti totali', unit: '%', flip: false },
    { key: 'tie',    label: 'Tiebreak vinti %',      short: '% TB vinti',     unit: '%', flip: false },
    { key: 'setwon', label: 'Set vinti %',            short: '% set vinti',    unit: '%', flip: false },
    { key: 'gwon',   label: 'Game vinti %',           short: '% game vinti',   unit: '%', flip: false },
    { key: 'dur_m',  label: 'Durata match',           short: 'Durata match',   unit: '',  flip: false },
    { key: 'dur_s',  label: 'Durata set (min.)',       short: 'Durata set',     unit: '',  flip: false },
    { key: 'dur_pt', label: 'Durata punti (sec.)',     short: 'Durata punto',   unit: '',  flip: false },
  ],
};

export const TAB_KEYS = Object.keys(STAT_TABS);

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
