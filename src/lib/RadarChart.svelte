<script>
  import { norm } from './data.js';

  export let p1;
  export let p2;
  export let c1;
  export let c2;
  export let axes = [];
  export let avgVals = [];
  export let size = 420;    // rendered px width/height (viewBox stays 0 0 420 420)
  export let fsLabel = 11;  // font size for axis labels (in SVG user units)

  // Internal coordinate system is always 420×420
  const SZ  = 420;
  const CX  = SZ / 2;
  const CY  = SZ / 2;
  const R   = 148;
  const LABEL_DIST = R + 52;
  const LINE_H = 20;

  const rings = [0.25, 0.5, 0.75, 1];

  let hovered = null;

  $: N = axes.length;
  $: angles = Array.from({ length: N }, (_, i) => (i / N) * 2 * Math.PI - Math.PI / 2);

  function normV(raw, ax) {
    if (raw == null) return 0;
    const n = norm(raw, ax.min, ax.max);
    return ax.flip ? 1 - n : n;
  }

  $: v1   = axes.map(ax => normV(p1[ax.key], ax));
  $: v2   = axes.map(ax => normV(p2[ax.key], ax));
  $: vAvg = axes.map((ax, i) => normV(avgVals[i] ?? 0, ax));

  function makePath(vs, angs) {
    if (!vs.length) return '';
    return vs.map((v, i) => {
      const x = (CX + Math.cos(angs[i]) * R * v).toFixed(1);
      const y = (CY + Math.sin(angs[i]) * R * v).toFixed(1);
      return `${i ? 'L' : 'M'}${x},${y}`;
    }).join('') + 'Z';
  }

  $: path1   = makePath(v1, angles);
  $: path2   = makePath(v2, angles);
  $: pathAvg = makePath(vAvg, angles);

  $: ringPolys = rings.map(rv =>
    angles.map(a =>
      `${(CX + Math.cos(a) * R * rv).toFixed(1)},${(CY + Math.sin(a) * R * rv).toFixed(1)}`
    ).join(' ')
  );

  function anchor(a) {
    const c = Math.cos(a);
    return c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
  }
  function valDir(a) {
    return Math.sin(a) >= 0 ? 1 : -1;
  }
</script>

{#if N >= 3}
<svg
  viewBox="0 0 {SZ} {SZ}"
  width={size}
  height={size}
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
  <path d={pathAvg} fill="none" stroke="var(--avg)" stroke-width="1.8"
    stroke-dasharray="4 3" stroke-linejoin="round" />

  <!-- P2 polygon -->
  <path d={path2} fill={c2} fill-opacity="0.08" stroke={c2}
    stroke-width="2.5" stroke-linejoin="round" />

  <!-- P1 polygon -->
  <path d={path1} fill={c1} fill-opacity="0.08" stroke={c1}
    stroke-width="2.5" stroke-linejoin="round" />

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

  <!-- Labels + inline hover values -->
  {#each axes as ax, i}
    {@const a    = angles[i]}
    {@const lx   = CX + Math.cos(a) * LABEL_DIST}
    {@const ly   = CY + Math.sin(a) * LABEL_DIST}
    {@const isH  = hovered === i}
    {@const anch = anchor(a)}
    {@const dir  = valDir(a)}
    <g
      on:mouseenter={() => (hovered = i)}
      on:mouseleave={() => (hovered = null)}
      style="cursor: default;"
      role="img"
      aria-label={ax.short ?? ax.label}
    >
      <!-- hit area -->
      <rect x={lx - 48} y={ly - 16} width={96} height={32} fill="transparent" />
      <!-- axis label -->
      <text
        x={lx} y={ly}
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="'Barlow Condensed', sans-serif"
        font-size={isH ? fsLabel + 2 : fsLabel}
        font-weight={isH ? 800 : 600}
        fill={isH ? 'var(--accent)' : 'var(--muted)'}
      >{ax.short ?? ax.label}</text>

      <!-- inline values on hover, stacked outward from chart -->
      {#if isH}
        {@const val1 = p1[ax.key]}
        {@const val2 = p2[ax.key]}
        {@const avgV = avgVals[i]}
        <text x={lx} y={ly + dir * LINE_H}
          text-anchor={anch} dominant-baseline="middle"
          font-family="'Barlow Condensed', sans-serif"
          font-size={fsLabel + 2} font-weight="700" fill={c1}
        >{val1 != null ? `${val1}${ax.unit}` : '—'}</text>
        <text x={lx} y={ly + dir * LINE_H * 2}
          text-anchor={anch} dominant-baseline="middle"
          font-family="'Barlow Condensed', sans-serif"
          font-size={fsLabel + 2} font-weight="700" fill={c2}
        >{val2 != null ? `${val2}${ax.unit}` : '—'}</text>
        <text x={lx} y={ly + dir * LINE_H * 3}
          text-anchor={anch} dominant-baseline="middle"
          font-family="'Barlow Condensed', sans-serif"
          font-size={fsLabel} font-weight="600" fill="var(--avg)"
        >⌀ {avgV != null ? (+avgV).toFixed(1) + ax.unit : '—'}</text>
      {/if}
    </g>
  {/each}
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
