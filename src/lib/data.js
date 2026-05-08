import rawPlayers from '../data/players.json';

export const PLAYERS = rawPlayers;

// Radar axes (8 chiavi, normalizzate sul range min-max top-50)
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

// Sezioni barre (tutte le colonne di Tennis Abstract, esclusi M, M W-L, M W% e conteggi grezzi)
export const STAT_TABS = {
  Servizio: [
    { key: 'spw',     label: 'Punti vinti al servizio',                       unit: '%', flip: false },
    { key: 'spw_inp', label: 'Punti vinti al servizio (escl. Ace e DF)',       unit: '%', flip: false },
    { key: 's1',      label: 'Prime in campo',                                 unit: '%', flip: false },
    { key: 's1w',     label: 'Punti vinti con la prima',                       unit: '%', flip: false },
    { key: 's2w',     label: 'Punti vinti con la seconda',                     unit: '%', flip: false },
    { key: 's2w_inp', label: 'Punti vinti con la seconda (escl. DF)',          unit: '%', flip: false },
    { key: 'hold',    label: 'Game vinti al servizio',                         unit: '%', flip: false },
    { key: 'ace',     label: 'Ace',                                            unit: '%', flip: false },
    { key: 'df',      label: 'Doppi Falli',                                    unit: '%', flip: true  },
    { key: 'df2s',    label: 'Doppi Falli % sulla seconda',                    unit: '%', flip: true  },
    { key: 'pts_sg',  label: 'Punti giocati per game al servizio',             unit: '',  flip: false, min: 3.5, max: 5.5 },
    { key: 'ptsl_sg', label: 'Punti persi per game al servizio',               unit: '',  flip: true,  min: 1.5, max: 3.5 },
  ],
  Risposta: [
    { key: 'ret',     label: 'Punti in risposta vinti',                        unit: '%', flip: false },
    { key: 'ret_inp', label: 'Punti in risposta vinti (escl. Ace e DF)',       unit: '%', flip: false },
    { key: 'r1w',     label: 'Punti vinti in risposta alla prima',             unit: '%', flip: false },
    { key: 'r2w',     label: 'Punti vinti in risposta alla seconda',           unit: '%', flip: false },
    { key: 'brk',     label: 'Break',                                          unit: '%', flip: false },
    { key: 'vace',    label: 'Ace % avversari',                                unit: '%', flip: true  },
    { key: 'vdf',     label: 'Doppi falli % avversari',                        unit: '%', flip: false },
    { key: 'pts_rg',  label: 'Punti giocati per game in risposta',             unit: '',  flip: false, min: 3.0, max: 5.0 },
    { key: 'ptsw_rg', label: 'Punti vinti per game in risposta',               unit: '',  flip: false, min: 1.0, max: 3.0 },
  ],
  'Palle Break': [
    { key: 'bpconv',  label: 'Palle break convertite',                         unit: '%', flip: false },
    { key: 'bp_g',    label: 'Palle break per game',                           unit: '',  flip: false, min: 0.2, max: 0.9 },
    { key: 'bp_s',    label: 'Palle break per set',                            unit: '',  flip: false, min: 0.8, max: 3.5 },
    { key: 'bks_s',   label: 'Break per set',                                  unit: '',  flip: false, min: 0.2, max: 1.2 },
    { key: 'bpsaved', label: 'Palle break salvate',                            unit: '%', flip: false },
    { key: 'bpfaced', label: 'Palle break concesse per game',                  unit: '',  flip: true,  min: 0.2, max: 0.9 },
    { key: 'bpvs_s',  label: 'Palle break concesse per set',                   unit: '',  flip: true,  min: 0.8, max: 3.5 },
    { key: 'bkn_s',   label: 'Break subiti per set',                           unit: '',  flip: true,  min: 0.1, max: 0.8 },
  ],
  Altro: [
    { key: 'tpw',    label: 'Punti vinti',                                     unit: '%', flip: false },
    { key: 'dr',     label: 'Dominance Ratio',                                 unit: '',  flip: false, min: 0.7, max: 1.5 },
    { key: 'setwon', label: 'Set vinti',                                       unit: '%', flip: false },
    { key: 'gwon',   label: 'Game vinti',                                      unit: '%', flip: false },
    { key: 'tie',    label: 'Tiebreak vinti',                                  unit: '%', flip: false },
    { key: 'tb_s',   label: 'Tiebreak per set',                                unit: '',  flip: false, min: 0.1, max: 0.5 },
  ],
};

export const TAB_KEYS = Object.keys(STAT_TABS);

// Media top-50 per ogni asse radar
export const TOP50_AVG = RADAR_AXES.map(ax => {
  const vals = PLAYERS.map(p => p[ax.key]).filter(v => v != null);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
});

export function norm(v, min, max) {
  return Math.max(0, Math.min(1, (v - min) / (max - min)));
}
