// spw = serve points won % (derived)
function spw(s1, s1w, s2w) {
  return +(s1 / 100 * s1w + (1 - s1 / 100) * s2w).toFixed(0);
}

export const PLAYERS = [
  { rank: 1,  full: 'Jannik Sinner',       nat: 'ITA', s1: 67, s1w: 77, s2w: 58, hold: 88, r1w: 35, r2w: 54, ret: 42, brk: 38, ace: 5.2, df: 2.1, bpsaved: 69, bpconv: 46, bpfaced: 5.2, bpcreated: 4.8, setwon: 68, tie: 60, decset: 72 },
  { rank: 2,  full: 'Carlos Alcaraz',       nat: 'ESP', s1: 63, s1w: 74, s2w: 60, hold: 85, r1w: 38, r2w: 57, ret: 45, brk: 43, ace: 3.8, df: 2.8, bpsaved: 65, bpconv: 49, bpfaced: 6.1, bpcreated: 5.3, setwon: 67, tie: 55, decset: 70 },
  { rank: 3,  full: 'Novak Djokovic',       nat: 'SRB', s1: 64, s1w: 74, s2w: 59, hold: 86, r1w: 37, r2w: 58, ret: 46, brk: 45, ace: 3.2, df: 2.4, bpsaved: 68, bpconv: 47, bpfaced: 5.8, bpcreated: 5.0, setwon: 69, tie: 62, decset: 75 },
  { rank: 4,  full: 'Alexander Zverev',     nat: 'GER', s1: 62, s1w: 75, s2w: 56, hold: 84, r1w: 34, r2w: 53, ret: 41, brk: 38, ace: 5.5, df: 3.1, bpsaved: 63, bpconv: 44, bpfaced: 5.5, bpcreated: 4.5, setwon: 65, tie: 54, decset: 68 },
  { rank: 5,  full: 'Daniil Medvedev',      nat: 'RUS', s1: 65, s1w: 73, s2w: 57, hold: 85, r1w: 36, r2w: 55, ret: 43, brk: 40, ace: 4.0, df: 2.6, bpsaved: 66, bpconv: 45, bpfaced: 5.6, bpcreated: 4.9, setwon: 64, tie: 58, decset: 67 },
  { rank: 6,  full: 'Taylor Fritz',         nat: 'USA', s1: 66, s1w: 76, s2w: 55, hold: 85, r1w: 32, r2w: 51, ret: 39, brk: 35, ace: 6.8, df: 2.9, bpsaved: 64, bpconv: 41, bpfaced: 5.0, bpcreated: 4.2, setwon: 63, tie: 56, decset: 64 },
  { rank: 7,  full: 'Hubert Hurkacz',       nat: 'POL', s1: 64, s1w: 78, s2w: 57, hold: 86, r1w: 32, r2w: 50, ret: 39, brk: 34, ace: 7.4, df: 2.3, bpsaved: 67, bpconv: 40, bpfaced: 4.8, bpcreated: 4.0, setwon: 62, tie: 57, decset: 63 },
  { rank: 8,  full: 'Holger Rune',          nat: 'DEN', s1: 61, s1w: 72, s2w: 56, hold: 82, r1w: 36, r2w: 54, ret: 43, brk: 41, ace: 3.5, df: 3.3, bpsaved: 60, bpconv: 47, bpfaced: 6.2, bpcreated: 5.2, setwon: 61, tie: 52, decset: 65 },
  { rank: 9,  full: 'Grigor Dimitrov',      nat: 'BUL', s1: 63, s1w: 73, s2w: 57, hold: 83, r1w: 35, r2w: 53, ret: 41, brk: 38, ace: 4.5, df: 2.7, bpsaved: 63, bpconv: 43, bpfaced: 5.5, bpcreated: 4.6, setwon: 61, tie: 53, decset: 63 },
  { rank: 10, full: 'Alex De Minaur',       nat: 'AUS', s1: 64, s1w: 72, s2w: 58, hold: 82, r1w: 37, r2w: 56, ret: 44, brk: 41, ace: 3.0, df: 2.2, bpsaved: 64, bpconv: 46, bpfaced: 6.0, bpcreated: 5.1, setwon: 62, tie: 55, decset: 66 },
  { rank: 11, full: 'Stefanos Tsitsipas',   nat: 'GRE', s1: 62, s1w: 73, s2w: 57, hold: 82, r1w: 35, r2w: 53, ret: 41, brk: 39, ace: 4.8, df: 3.5, bpsaved: 61, bpconv: 44, bpfaced: 5.9, bpcreated: 4.8, setwon: 61, tie: 52, decset: 64 },
  { rank: 12, full: 'Casper Ruud',          nat: 'NOR', s1: 61, s1w: 71, s2w: 56, hold: 80, r1w: 36, r2w: 54, ret: 42, brk: 40, ace: 2.8, df: 2.5, bpsaved: 61, bpconv: 45, bpfaced: 6.1, bpcreated: 5.0, setwon: 60, tie: 50, decset: 62 },
  { rank: 13, full: 'Tommy Paul',           nat: 'USA', s1: 63, s1w: 73, s2w: 55, hold: 81, r1w: 34, r2w: 52, ret: 40, brk: 37, ace: 4.2, df: 2.8, bpsaved: 62, bpconv: 42, bpfaced: 5.7, bpcreated: 4.4, setwon: 60, tie: 51, decset: 61 },
  { rank: 14, full: 'Ben Shelton',          nat: 'USA', s1: 65, s1w: 77, s2w: 54, hold: 84, r1w: 31, r2w: 49, ret: 37, brk: 33, ace: 8.5, df: 4.1, bpsaved: 60, bpconv: 39, bpfaced: 5.2, bpcreated: 3.9, setwon: 59, tie: 53, decset: 59 },
  { rank: 15, full: 'Lorenzo Musetti',      nat: 'ITA', s1: 61, s1w: 71, s2w: 56, hold: 79, r1w: 35, r2w: 53, ret: 41, brk: 39, ace: 3.2, df: 2.9, bpsaved: 59, bpconv: 44, bpfaced: 6.3, bpcreated: 5.0, setwon: 59, tie: 49, decset: 61 },
  { rank: 16, full: 'Jack Draper',          nat: 'GBR', s1: 62, s1w: 72, s2w: 57, hold: 81, r1w: 35, r2w: 53, ret: 41, brk: 38, ace: 4.5, df: 3.2, bpsaved: 60, bpconv: 44, bpfaced: 5.9, bpcreated: 4.7, setwon: 59, tie: 51, decset: 62 },
  { rank: 17, full: 'Alexander Bublik',     nat: 'KAZ', s1: 64, s1w: 75, s2w: 50, hold: 80, r1w: 32, r2w: 50, ret: 38, brk: 35, ace: 9.2, df: 5.0, bpsaved: 57, bpconv: 40, bpfaced: 5.8, bpcreated: 4.1, setwon: 57, tie: 55, decset: 57 },
  { rank: 18, full: 'Matteo Berrettini',    nat: 'ITA', s1: 65, s1w: 78, s2w: 56, hold: 84, r1w: 31, r2w: 49, ret: 37, brk: 33, ace: 7.8, df: 2.8, bpsaved: 63, bpconv: 40, bpfaced: 5.1, bpcreated: 4.0, setwon: 60, tie: 54, decset: 62 },
  { rank: 19, full: 'Frances Tiafoe',       nat: 'USA', s1: 62, s1w: 72, s2w: 54, hold: 79, r1w: 34, r2w: 52, ret: 40, brk: 38, ace: 4.8, df: 3.0, bpsaved: 58, bpconv: 43, bpfaced: 6.0, bpcreated: 4.8, setwon: 57, tie: 49, decset: 59 },
  { rank: 20, full: 'Cameron Norrie',       nat: 'GBR', s1: 62, s1w: 70, s2w: 55, hold: 79, r1w: 35, r2w: 53, ret: 41, brk: 38, ace: 2.5, df: 2.3, bpsaved: 60, bpconv: 43, bpfaced: 6.2, bpcreated: 4.9, setwon: 58, tie: 49, decset: 60 },
  { rank: 21, full: 'G.M. Perricard',       nat: 'FRA', s1: 66, s1w: 80, s2w: 55, hold: 84, r1w: 29, r2w: 47, ret: 35, brk: 30, ace: 10.2, df: 4.2, bpsaved: 59, bpconv: 37, bpfaced: 4.9, bpcreated: 3.6, setwon: 58, tie: 52, decset: 57 },
  { rank: 22, full: 'Jakub Mensik',         nat: 'CZE', s1: 63, s1w: 73, s2w: 55, hold: 80, r1w: 33, r2w: 51, ret: 39, brk: 36, ace: 5.5, df: 3.3, bpsaved: 59, bpconv: 41, bpfaced: 5.6, bpcreated: 4.3, setwon: 57, tie: 50, decset: 58 },
  { rank: 23, full: 'F. Cerundolo',         nat: 'ARG', s1: 60, s1w: 70, s2w: 55, hold: 78, r1w: 35, r2w: 53, ret: 41, brk: 39, ace: 2.8, df: 2.7, bpsaved: 58, bpconv: 44, bpfaced: 6.4, bpcreated: 5.1, setwon: 57, tie: 48, decset: 60 },
  { rank: 24, full: 'Nuno Borges',          nat: 'POR', s1: 62, s1w: 71, s2w: 55, hold: 79, r1w: 34, r2w: 52, ret: 40, brk: 37, ace: 3.6, df: 2.8, bpsaved: 59, bpconv: 42, bpfaced: 5.9, bpcreated: 4.6, setwon: 57, tie: 48, decset: 59 },
  { rank: 25, full: 'Flavio Cobolli',       nat: 'ITA', s1: 61, s1w: 70, s2w: 54, hold: 77, r1w: 34, r2w: 52, ret: 40, brk: 37, ace: 3.4, df: 2.9, bpsaved: 57, bpconv: 42, bpfaced: 6.2, bpcreated: 4.7, setwon: 56, tie: 47, decset: 58 },
  { rank: 26, full: 'Nicolas Jarry',        nat: 'CHI', s1: 63, s1w: 73, s2w: 55, hold: 80, r1w: 32, r2w: 50, ret: 38, brk: 34, ace: 5.8, df: 3.1, bpsaved: 58, bpconv: 40, bpfaced: 5.8, bpcreated: 4.2, setwon: 56, tie: 49, decset: 57 },
  { rank: 27, full: 'Mariano Navone',       nat: 'ARG', s1: 60, s1w: 69, s2w: 54, hold: 77, r1w: 34, r2w: 52, ret: 40, brk: 38, ace: 2.2, df: 2.6, bpsaved: 57, bpconv: 43, bpfaced: 6.5, bpcreated: 5.0, setwon: 56, tie: 46, decset: 58 },
  { rank: 28, full: 'Fabian Marozsan',      nat: 'HUN', s1: 60, s1w: 69, s2w: 54, hold: 77, r1w: 34, r2w: 51, ret: 39, brk: 37, ace: 2.5, df: 2.7, bpsaved: 56, bpconv: 42, bpfaced: 6.5, bpcreated: 4.9, setwon: 55, tie: 46, decset: 57 },
  { rank: 29, full: 'Zizou Bergs',          nat: 'BEL', s1: 61, s1w: 70, s2w: 54, hold: 77, r1w: 33, r2w: 51, ret: 39, brk: 36, ace: 3.5, df: 2.9, bpsaved: 56, bpconv: 41, bpfaced: 6.3, bpcreated: 4.7, setwon: 55, tie: 46, decset: 57 },
  { rank: 30, full: 'Dominic Stricker',     nat: 'SUI', s1: 62, s1w: 71, s2w: 54, hold: 78, r1w: 33, r2w: 51, ret: 39, brk: 36, ace: 4.2, df: 3.0, bpsaved: 57, bpconv: 41, bpfaced: 6.1, bpcreated: 4.5, setwon: 54, tie: 47, decset: 56 },
  { rank: 31, full: 'Arthur Fils',          nat: 'FRA', s1: 61, s1w: 70, s2w: 53, hold: 76, r1w: 33, r2w: 51, ret: 39, brk: 36, ace: 4.0, df: 3.1, bpsaved: 55, bpconv: 41, bpfaced: 6.3, bpcreated: 4.6, setwon: 54, tie: 46, decset: 56 },
  { rank: 32, full: 'Mattia Arnaldi',       nat: 'ITA', s1: 61, s1w: 70, s2w: 53, hold: 76, r1w: 33, r2w: 51, ret: 39, brk: 36, ace: 3.8, df: 2.9, bpsaved: 55, bpconv: 41, bpfaced: 6.2, bpcreated: 4.6, setwon: 54, tie: 45, decset: 55 },
  { rank: 33, full: 'T.M. Etcheverry',      nat: 'ARG', s1: 59, s1w: 68, s2w: 53, hold: 75, r1w: 34, r2w: 52, ret: 40, brk: 38, ace: 2.0, df: 2.5, bpsaved: 55, bpconv: 43, bpfaced: 6.6, bpcreated: 5.1, setwon: 54, tie: 44, decset: 57 },
  { rank: 34, full: 'F. Auger-Aliassime',   nat: 'CAN', s1: 63, s1w: 73, s2w: 55, hold: 80, r1w: 32, r2w: 50, ret: 38, brk: 34, ace: 6.5, df: 3.4, bpsaved: 57, bpconv: 39, bpfaced: 5.7, bpcreated: 4.2, setwon: 56, tie: 50, decset: 57 },
  { rank: 35, full: 'Tallon Griekspoor',    nat: 'NED', s1: 63, s1w: 72, s2w: 54, hold: 79, r1w: 32, r2w: 50, ret: 38, brk: 33, ace: 5.0, df: 2.8, bpsaved: 57, bpconv: 39, bpfaced: 5.8, bpcreated: 4.1, setwon: 55, tie: 49, decset: 56 },
  { rank: 36, full: 'Sebastian Baez',       nat: 'ARG', s1: 58, s1w: 65, s2w: 52, hold: 74, r1w: 35, r2w: 54, ret: 42, brk: 40, ace: 1.5, df: 2.3, bpsaved: 54, bpconv: 45, bpfaced: 6.8, bpcreated: 5.3, setwon: 55, tie: 43, decset: 58 },
  { rank: 37, full: 'Brandon Nakashima',    nat: 'USA', s1: 63, s1w: 72, s2w: 54, hold: 79, r1w: 32, r2w: 50, ret: 38, brk: 34, ace: 4.8, df: 2.7, bpsaved: 57, bpconv: 40, bpfaced: 5.7, bpcreated: 4.2, setwon: 55, tie: 48, decset: 56 },
  { rank: 38, full: 'Jaume Munar',          nat: 'ESP', s1: 60, s1w: 68, s2w: 53, hold: 75, r1w: 33, r2w: 51, ret: 39, brk: 37, ace: 2.6, df: 2.8, bpsaved: 54, bpconv: 42, bpfaced: 6.5, bpcreated: 4.8, setwon: 53, tie: 43, decset: 55 },
  { rank: 39, full: 'Alexei Popyrin',       nat: 'AUS', s1: 62, s1w: 72, s2w: 53, hold: 78, r1w: 31, r2w: 49, ret: 37, brk: 33, ace: 5.8, df: 3.5, bpsaved: 55, bpconv: 38, bpfaced: 5.9, bpcreated: 4.0, setwon: 53, tie: 47, decset: 54 },
  { rank: 40, full: 'Sebastian Korda',      nat: 'USA', s1: 63, s1w: 72, s2w: 54, hold: 78, r1w: 32, r2w: 50, ret: 38, brk: 34, ace: 5.2, df: 3.2, bpsaved: 56, bpconv: 40, bpfaced: 5.9, bpcreated: 4.3, setwon: 54, tie: 48, decset: 55 },
  { rank: 41, full: 'Adrian Mannarino',     nat: 'FRA', s1: 59, s1w: 68, s2w: 53, hold: 74, r1w: 35, r2w: 53, ret: 41, brk: 38, ace: 1.8, df: 1.9, bpsaved: 55, bpconv: 43, bpfaced: 6.6, bpcreated: 5.0, setwon: 53, tie: 44, decset: 56 },
  { rank: 42, full: 'Stan Wawrinka',        nat: 'SUI', s1: 62, s1w: 73, s2w: 57, hold: 79, r1w: 31, r2w: 49, ret: 37, brk: 33, ace: 5.0, df: 3.0, bpsaved: 57, bpconv: 39, bpfaced: 5.7, bpcreated: 4.1, setwon: 53, tie: 48, decset: 55 },
  { rank: 43, full: 'Otto Virtanen',        nat: 'FIN', s1: 62, s1w: 71, s2w: 53, hold: 77, r1w: 31, r2w: 49, ret: 37, brk: 33, ace: 5.5, df: 3.3, bpsaved: 55, bpconv: 38, bpfaced: 5.9, bpcreated: 4.0, setwon: 52, tie: 47, decset: 53 },
  { rank: 44, full: 'Giulio Zeppieri',      nat: 'ITA', s1: 61, s1w: 70, s2w: 53, hold: 76, r1w: 32, r2w: 50, ret: 38, brk: 35, ace: 4.2, df: 3.1, bpsaved: 54, bpconv: 40, bpfaced: 6.2, bpcreated: 4.5, setwon: 52, tie: 45, decset: 54 },
  { rank: 45, full: 'T. Kokkinakis',        nat: 'AUS', s1: 64, s1w: 74, s2w: 53, hold: 79, r1w: 30, r2w: 48, ret: 36, brk: 31, ace: 8.0, df: 4.0, bpsaved: 55, bpconv: 37, bpfaced: 5.5, bpcreated: 3.8, setwon: 51, tie: 48, decset: 52 },
  { rank: 46, full: 'Luciano Darderi',      nat: 'ITA', s1: 60, s1w: 69, s2w: 53, hold: 75, r1w: 33, r2w: 51, ret: 39, brk: 37, ace: 2.8, df: 2.7, bpsaved: 54, bpconv: 42, bpfaced: 6.5, bpcreated: 4.8, setwon: 54, tie: 44, decset: 56 },
  { rank: 47, full: 'Reilly Opelka',        nat: 'USA', s1: 70, s1w: 82, s2w: 56, hold: 88, r1w: 26, r2w: 44, ret: 33, brk: 27, ace: 14.5, df: 3.8, bpsaved: 60, bpconv: 32, bpfaced: 4.5, bpcreated: 3.2, setwon: 52, tie: 56, decset: 50 },
  { rank: 48, full: 'A. Rinderknech',       nat: 'FRA', s1: 63, s1w: 72, s2w: 53, hold: 78, r1w: 31, r2w: 49, ret: 37, brk: 32, ace: 6.0, df: 3.5, bpsaved: 55, bpconv: 38, bpfaced: 5.8, bpcreated: 4.0, setwon: 51, tie: 47, decset: 52 },
  { rank: 49, full: 'Quentin Halys',        nat: 'FRA', s1: 62, s1w: 71, s2w: 53, hold: 77, r1w: 31, r2w: 49, ret: 37, brk: 33, ace: 5.2, df: 3.0, bpsaved: 55, bpconv: 39, bpfaced: 5.9, bpcreated: 4.1, setwon: 51, tie: 46, decset: 52 },
  { rank: 50, full: 'Roman Safiullin',      nat: 'RUS', s1: 62, s1w: 71, s2w: 54, hold: 77, r1w: 31, r2w: 49, ret: 37, brk: 33, ace: 4.8, df: 2.9, bpsaved: 55, bpconv: 39, bpfaced: 6.0, bpcreated: 4.2, setwon: 51, tie: 46, decset: 52 },
].map(p => ({ ...p, spw: spw(p.s1, p.s1w, p.s2w) }));

// Radar axes (8 key stats, normalised on top-50 min-max)
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

// Stat bar sections (matching Tennis Abstract tabs: Serve / Return / Breaks / More)
// Excluded: M (partite), M W-L (record partite), M% (vittorie partite)
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
    { key: 'ret',  label: 'Punti Rit Vinti',  unit: '%', flip: false },
    { key: 'r1w',  label: '1° Rit Vinti',     unit: '%', flip: false },
    { key: 'r2w',  label: '2° Rit Vinti',     unit: '%', flip: false },
    { key: 'brk',  label: 'Break Conv',       unit: '%', flip: false },
  ],
  'Palle Break': [
    { key: 'bpsaved',   label: 'PB Salvate',      unit: '%', flip: false },
    { key: 'bpconv',    label: 'PB Convertite',   unit: '%', flip: false },
    { key: 'bpfaced',   label: 'PB Subite / game', unit: '', flip: true,  min: 4,   max: 7.5 },
    { key: 'bpcreated', label: 'PB Create / game', unit: '', flip: false, min: 3,   max: 5.5 },
  ],
  Altro: [
    { key: 'setwon', label: 'Set Vinti',      unit: '%', flip: false },
    { key: 'tie',    label: 'Tiebreak Vinti', unit: '%', flip: false },
    { key: 'decset', label: '3° Set Vinto',   unit: '%', flip: false },
  ],
};

export const TAB_KEYS = Object.keys(STAT_TABS);

// Pre-computed top-50 averages per radar axis
export function computeAvg() {
  return RADAR_AXES.map(ax => {
    const vals = PLAYERS.map(p => p[ax.key]);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  });
}

export const TOP50_AVG = computeAvg();

export function norm(v, min, max) {
  return Math.max(0, Math.min(1, (v - min) / (max - min)));
}
