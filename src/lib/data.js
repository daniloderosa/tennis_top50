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

// Sezioni barre — stesse di Tennis Abstract (Serve/Return/Breaks/More), esclusi M, M W-L, M%
export const STAT_TABS = {
  Servizio: [
    { key: 'spw',  label: 'Punti Srv Vinti', unit: '%', flip: false },
    { key: 's1',   label: '1° Srv In',        unit: '%', flip: false },
    { key: 's1w',  label: '1° Srv Vinti',     unit: '%', flip: false },
    { key: 's2w',  label: '2° Srv Vinti',     unit: '%', flip: false },
    { key: 'hold', label: 'Hold',             unit: '%', flip: false },
    { key: 'ace',  label: 'Ace / game',       unit: '',  flip: false, min: 1,   max: 15  },
    { key: 'df',   label: 'DF / game',        unit: '',  flip: true,  min: 1.5, max: 5.5 },
  ],
  Risposta: [
    { key: 'r1w',  label: '1° Rit Vinti',     unit: '%', flip: false },
    { key: 'r2w',  label: '2° Rit Vinti',     unit: '%', flip: false },
    { key: 'ret',  label: 'Punti Rit',        unit: '%', flip: false },
    { key: 'brk',  label: 'Break Conv',       unit: '%', flip: false },
  ],
  'Palle Break': [
    { key: 'bpsaved',   label: 'PB Salvate',       unit: '%', flip: false },
    { key: 'bpconv',    label: 'PB Convertite',    unit: '%', flip: false },
    { key: 'bpfaced',   label: 'PB Subite / game', unit: '',  flip: true,  min: 4, max: 7.5 },
    { key: 'bpcreated', label: 'PB Create / game', unit: '',  flip: false, min: 3, max: 5.5 },
  ],
  Altro: [
    { key: 'setwon', label: 'Set Vinti',      unit: '%', flip: false },
    { key: 'tie',    label: 'Tiebreak Vinti', unit: '%', flip: false },
    { key: 'decset', label: '3° Set Vinto',   unit: '%', flip: false },
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
