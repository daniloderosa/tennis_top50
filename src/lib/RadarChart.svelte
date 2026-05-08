<script>
  import { norm } from './data.js';

  export let p1;
  export let p2;
  export let c1;
  export let c2;
  export let axes = [];
  export let avgVals = [];

  const SIZE = 420;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 148;
  const LABEL_DIST = R + 52;
  const TIP_DIST = R + 104;

  const rings = [0.25, 0.5, 0.75, 1];

  let hovered = null;

  $: N = axes.length;
  $: angles = Array.from({ length: N }, (_, i) => (i / N) * 2 * Math.PI - Math.PI / 2);

  function normV(raw, ax) {
    if (raw == null) return 0;
    const n = norm(raw, ax.min, ax.max);
    return ax.flip ? 1 - n : n;
  }

  $: v1 = axes.map(ax => normV(p1[ax.key], ax));
  $: v2 = axes.map(ax => normV(p2[ax.key], ax));
  $: vAvg = axes.map((ax, i) => normV(avgVals[i] ?? 0, ax));

  function makePath(vs, angs) {
    if (!vs.length) return '';
    return vs.map((v, i) => {
      const x = (CX + Math.cos(angs[i]) * R * v).toFixed(1);
      const y = (CY + Math.sin(angs[i]) * R * v).toFixed(1);
      return `${i ? 'L' : 'M'}${x},${y}`;
    }).join('') + 'Z';
  }

  $: path1 = makePath(v1, angles);
  $: path2 = makePath(v2, angles);
  $: pathAvg = makePath(vAvg, angles);

  $: ringPolys = rings.map(rv =>
    angles.map(a =>
      `${(CX + Math.cos(a) * R * rv).toFixed(1)},${(CY + Math.sin(a) * R * rv).toFixed(1)}`
    ).join(' ')
  );

  $: tipAxis = hovered !== null ? axes[hovered] : null;
  $: tipVal1 = tipAxis ? p1[tipAxis.key] : null;
  $: tipVal2 = tipAxis ? p2[tipAxis.key] : null;
  $: tipAvg = hovered !== null ? +(avgVals[hovered] ?? 0).toFixed(1) : null;
  $: tipUnit = tipAxis?.unit ?? '';
  $: tipPos = hovered !== null
    ? { x: CX + Math.cos(angles[hovered]) * TIP_DIST, y: CY + Math.sin(angles[hovered]) * TIP_DIST }
    : null;
</script>

{#if N >= 3}
<svg
  width={SIZE}
  height={SIZE}
  style="overflow: visible; display: block; margin: 0 auto;"
>
  <!-- Grid rings -->
  {#each ringPolys as pts, ri}
    <polygon
      points={pts}
      fill="none"
      stroke={ri === rings.length - 1 ? '#b8ccc0' : '#ddeae2'}
      stroke-width={ri === rings.length - 1 ? 1.5 : 0.7}
    />
  {/each}

  <!-- Spokes -->
  {#each angles as a}
    <line
      x1={CX} y1={CY}
      x2={(CX + Math.cos(a) * R).toFixed(1)}
      y2={(CY + Math.sin(a) * R).toFixed(1)}
      stroke="#ccddd4" stroke-width="0.8"
    />
  {/each}

  <!-- Avg line -->
  <path
    d={pathAvg}
    fill="none"
    stroke="var(--avg)"
    stroke-width="1.8"
    stroke-dasharray="4 3"
    stroke-linejoin="round"
  />

  <!-- P2 polygon -->
  <path
    d={path2}
    fill={c2}
    fill-opacity="0.08"
    stroke={c2}
    stroke-width="2.5"
    stroke-linejoin="round"
  />

  <!-- P1 polygon -->
  <path
    d={path1}
    fill={c1}
    fill-opacity="0.08"
    stroke={c1}
    stroke-width="2.5"
    stroke-linejoin="round"
  />

  <!-- P1 dots -->
  {#each v1 as v, i}
    <circle
      cx={(CX + Math.cos(angles[i]) * R * v).toFixed(1)}
      cy={(CY + Math.sin(angles[i]) * R * v).toFixed(1)}
      r="4.5" fill={c1} stroke="white" stroke-width="1.5"
    />
  {/each}

  <!-- P2 dots -->
  {#each v2 as v, i}
    <circle
      cx={(CX + Math.cos(angles[i]) * R * v).toFixed(1)}
      cy={(CY + Math.sin(angles[i]) * R * v).toFixed(1)}
      r="4.5" fill={c2} stroke="white" stroke-width="1.5"
    />
  {/each}

  <!-- Labels + hover areas -->
  {#each axes as ax, i}
    {@const lx = CX + Math.cos(angles[i]) * LABEL_DIST}
    {@const ly = CY + Math.sin(angles[i]) * LABEL_DIST}
    {@const isH = hovered === i}
    <g
      on:mouseenter={() => (hovered = i)}
      on:mouseleave={() => (hovered = null)}
      style="cursor: default;"
      role="img"
      aria-label={ax.short ?? ax.label}
    >
      <rect x={lx - 46} y={ly - 15} width={92} height={30} fill="transparent" />
      <text
        x={lx}
        y={ly}
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="'Barlow Condensed', sans-serif"
        font-size={isH ? 13 : 11}
        font-weight={isH ? 800 : 600}
        fill={isH ? 'var(--accent)' : 'var(--muted)'}
      >{ax.short ?? ax.label}</text>
    </g>
  {/each}

  <!-- Tooltip card -->
  {#if hovered !== null && tipPos && tipAxis}
    {@const TW = 100}
    {@const TH = 68}
    {@const tx = tipPos.x}
    {@const ty = tipPos.y}
    <rect
      x={tx - TW / 2} y={ty - TH / 2}
      width={TW} height={TH}
      rx="6" fill="white" stroke="var(--bord)" stroke-width="1.5"
      filter="url(#tip-shadow)"
    />
    <text x={tx} y={ty - TH / 2 + 16} text-anchor="middle"
      font-family="'Barlow Condensed', sans-serif" font-size="13" fill={c1} font-weight="700">
      {tipVal1 != null ? `${tipVal1}${tipUnit}` : '—'}
    </text>
    <text x={tx} y={ty - TH / 2 + 33} text-anchor="middle"
      font-family="'Barlow Condensed', sans-serif" font-size="13" fill={c2} font-weight="700">
      {tipVal2 != null ? `${tipVal2}${tipUnit}` : '—'}
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
{:else}
<div class="no-radar">
  <span>Statistiche insufficienti per il grafico radar</span>
</div>
{/if}

<style>
  .no-radar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 260px;
    color: var(--muted);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    text-align: center;
    padding: 0 24px;
  }
</style>
