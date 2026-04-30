<script>
  import { norm, TOP50_AVG, RADAR_AXES } from './data.js';

  export let p1;
  export let p2;
  export let c1;
  export let c2;

  const SIZE = 420;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 148;
  const LABEL_DIST = R + 54;
  const TIP_DIST = R + 108;
  const N = RADAR_AXES.length;

  let hovered = null;

  function ang(i) {
    return (i / N) * 2 * Math.PI - Math.PI / 2;
  }

  function pt(i, r) {
    return [CX + Math.cos(ang(i)) * r, CY + Math.sin(ang(i)) * r];
  }

  function polyPoints(vs) {
    return vs
      .map((v, i) => {
        const [x, y] = pt(i, R * v);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  function pathD(vs) {
    return vs
      .map((v, i) => {
        const [x, y] = pt(i, R * v);
        return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join('') + 'Z';
  }

  $: v1 = RADAR_AXES.map(ax => norm(p1[ax.key], ax.min, ax.max));
  $: v2 = RADAR_AXES.map(ax => norm(p2[ax.key], ax.min, ax.max));
  $: vAvg = RADAR_AXES.map((ax, i) => norm(TOP50_AVG[i], ax.min, ax.max));

  // grid rings
  const rings = [0.25, 0.5, 0.75, 1];

  // tooltip: when hovering axis i, show values
  $: tipAxis = hovered !== null ? RADAR_AXES[hovered] : null;
  $: tipVal1 = tipAxis ? p1[tipAxis.key] : null;
  $: tipVal2 = tipAxis ? p2[tipAxis.key] : null;
  $: tipAvg = tipAxis ? +TOP50_AVG[hovered].toFixed(1) : null;
  $: tipUnit = tipVal1 !== null && tipVal1 > 10 ? '%' : '';

  $: tipPos = hovered !== null
    ? { x: CX + Math.cos(ang(hovered)) * TIP_DIST, y: CY + Math.sin(ang(hovered)) * TIP_DIST }
    : null;
</script>

<svg
  width={SIZE}
  height={SIZE}
  style="overflow: visible; display: block; margin: 0 auto;"
>
  <!-- Grid rings -->
  {#each rings as rv}
    <polygon
      points={RADAR_AXES.map((_, i) => pt(i, R * rv).join(',')).join(' ')}
      fill="none"
      stroke={rv === 1 ? '#b8ccc0' : '#ddeae2'}
      stroke-width={rv === 1 ? 1.5 : 0.7}
    />
  {/each}

  <!-- Spokes -->
  {#each RADAR_AXES as _, i}
    {@const [x, y] = pt(i, R)}
    <line x1={CX} y1={CY} x2={x} y2={y} stroke="#ccddd4" stroke-width="0.8" />
  {/each}

  <!-- Avg line -->
  <path
    d={pathD(vAvg)}
    fill="none"
    stroke="var(--avg)"
    stroke-width="1.8"
    stroke-dasharray="4 3"
    stroke-linejoin="round"
  />

  <!-- P2 polygon -->
  <path
    d={pathD(v2)}
    fill={c2}
    fill-opacity="0.08"
    stroke={c2}
    stroke-width="2.5"
    stroke-linejoin="round"
  />

  <!-- P1 polygon -->
  <path
    d={pathD(v1)}
    fill={c1}
    fill-opacity="0.08"
    stroke={c1}
    stroke-width="2.5"
    stroke-linejoin="round"
  />

  <!-- P1 dots -->
  {#each v1 as v, i}
    {@const [x, y] = pt(i, R * v)}
    <circle cx={x} cy={y} r="4.5" fill={c1} stroke="white" stroke-width="1.5" />
  {/each}

  <!-- P2 dots -->
  {#each v2 as v, i}
    {@const [x, y] = pt(i, R * v)}
    <circle cx={x} cy={y} r="4.5" fill={c2} stroke="white" stroke-width="1.5" />
  {/each}

  <!-- Labels + hover areas -->
  {#each RADAR_AXES as ax, i}
    {@const a = ang(i)}
    {@const [lx, ly] = [CX + Math.cos(a) * LABEL_DIST, CY + Math.sin(a) * LABEL_DIST]}
    {@const isH = hovered === i}
    <g
      on:mouseenter={() => (hovered = i)}
      on:mouseleave={() => (hovered = null)}
      style="cursor: default;"
      role="img"
      aria-label={ax.label}
    >
      <!-- hit area -->
      <rect x={lx - 46} y={ly - 15} width={92} height={30} fill="transparent" />
      <text
        x={lx}
        y={ly}
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="'Barlow Condensed', sans-serif"
        font-size={isH ? 14 : 12}
        font-weight={isH ? 800 : 600}
        fill={isH ? 'var(--accent)' : 'var(--muted)'}
      >{ax.label}</text>
    </g>
  {/each}

  <!-- Tooltip card (anchored radially outward) -->
  {#if hovered !== null && tipPos}
    {@const TW = 88}
    {@const TH = 68}
    {@const tx = tipPos.x}
    {@const ty = tipPos.y}
    <rect
      x={tx - TW / 2}
      y={ty - TH / 2}
      width={TW}
      height={TH}
      rx="6"
      fill="white"
      stroke="var(--bord)"
      stroke-width="1.5"
      filter="url(#tip-shadow)"
    />
    <text x={tx} y={ty - TH / 2 + 16} text-anchor="middle"
      font-family="'Barlow Condensed', sans-serif" font-size="13" fill={c1} font-weight="700">
      {tipVal1}{tipUnit}
    </text>
    <text x={tx} y={ty - TH / 2 + 33} text-anchor="middle"
      font-family="'Barlow Condensed', sans-serif" font-size="13" fill={c2} font-weight="700">
      {tipVal2}{tipUnit}
    </text>
    <text x={tx} y={ty - TH / 2 + 50} text-anchor="middle"
      font-family="'Barlow Condensed', sans-serif" font-size="11" fill="var(--avg)" font-weight="600">
      ⌀ {tipAvg}{tipUnit}
    </text>
  {/if}

  <defs>
    <filter id="tip-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="rgba(0,0,0,0.1)" />
    </filter>
  </defs>
</svg>
