<script>
  import { PLAYERS } from './data.js';
  import { UI } from './i18n.js';
  import { createEventDispatcher, onMount } from 'svelte';

  export let player = null; // null = nessuna selezione
  export let color;
  export let otherRank;
  export let align = 'left'; // 'left' | 'right'
  export let lang = 'it';
  export let compact = false; // variante mobile: nome più piccolo, a capo
  export let dropAlign = null; // 'left' | 'right' | 'center' — default = align

  const dispatch = createEventDispatcher();

  let open = false;
  let query = '';
  let container;
  let listMaxH = 280;

  $: da = dropAlign ?? align;

  function toggleOpen() {
    open = !open;
    if (open && container) {
      // la lista si accorcia per restare interamente dentro la finestra
      // (~80px = campo di ricerca + bordi + margine dal fondo)
      const r = container.getBoundingClientRect();
      listMaxH = Math.max(160, Math.min(280, window.innerHeight - r.bottom - 80));
    }
  }

  $: filtered = PLAYERS.filter(p => {
    const q = query.toLowerCase();
    return (
      p.full.toLowerCase().includes(q) ||
      p.nat.toLowerCase().includes(q) ||
      String(p.rank).includes(q)
    );
  });

  function select(p) {
    if (p.rank !== otherRank) {
      dispatch('select', p.rank);
    }
    open = false;
    query = '';
  }

  function handleOutside(e) {
    if (container && !container.contains(e.target)) {
      open = false;
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  });
</script>

<div class="selector-wrap" class:right={align === 'right'} class:compact bind:this={container}>
  <button class="trigger" class:right={align === 'right'} on:click={toggleOpen}>
    <span class="player-eyebrow" style="color: {color}">{player ? `N°${player.rank} · ${player.nat}` : ' '}</span>
    <span class="player-line">
      <span class="player-name" class:placeholder={!player}>{player ? player.full : UI[lang].selectPlayer}</span>
      <span class="arrow" class:rotated={open}>▾</span>
    </span>
  </button>

  {#if open}
    <div class="dropdown" class:right={da === 'right'} class:center={da === 'center'}>
      <div class="search-wrap">
        <!-- svelte-ignore a11y-autofocus -->
        <input
          autofocus
          bind:value={query}
          placeholder={lang === 'en' ? 'Search…' : 'Cerca…'}
          class="search-input"
        />
      </div>
      <div class="list" style="max-height: {listMaxH}px">
        {#each filtered as p (p.rank)}
          <button
            class="list-item"
            class:active={p.rank === player?.rank}
            style="border-left-color: {p.rank === player?.rank ? color : 'transparent'};
                   background: {p.rank === player?.rank ? color + '14' : 'transparent'}"
            on:click={() => select(p)}
            on:mouseenter={e => { e.currentTarget.style.background = color + '14'; }}
            on:mouseleave={e => { e.currentTarget.style.background = p.rank === player?.rank ? color + '14' : 'transparent'; }}
          >
            <span class="list-rank">N°{p.rank}</span>
            <span class="list-name">{p.full}</span>
            <span class="list-nat">{p.nat}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .selector-wrap {
    position: relative;
    width: 100%;
  }

  .selector-wrap.right { display: flex; justify-content: flex-end; }

  .trigger {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    text-align: left;
    padding: 0;
    cursor: pointer;
  }

  .trigger.right {
    align-items: flex-end;
    text-align: right;
  }

  .player-eyebrow {
    font-family: var(--serif);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1.1;
  }

  .player-line {
    display: flex;
    align-items: baseline;
    gap: 9px;
  }

  .trigger.right .player-line { flex-direction: row-reverse; }

  .player-name {
    font-family: var(--serif);
    font-size: var(--fs-player, 34px);
    font-weight: 600;
    color: var(--ink);
    line-height: 0.98;
    letter-spacing: -0.01em;
    white-space: nowrap;
    border-bottom: 1px dotted var(--muted2);
  }

  .player-name.placeholder {
    color: var(--muted2);
    font-weight: 500;
    font-style: italic;
  }

  /* variante mobile */
  .compact .player-eyebrow { font-size: 11px; }
  .compact .player-name {
    font-size: 21px;
    white-space: normal;
    line-height: 1.1;
  }
  .compact .arrow { font-size: 13px; }
  .compact .dropdown { min-width: 250px; max-width: 84vw; }

  .arrow {
    color: var(--muted);
    font-size: 18px;
    transition: transform 0.2s;
    display: inline-block;
  }

  .arrow.rotated {
    transform: rotate(180deg);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 7px);
    left: 0;
    width: max-content;
    min-width: 280px;
    background: var(--bg);
    border: 1px solid var(--rule);
    z-index: 300;
    overflow: hidden;
    box-shadow: 0 10px 32px rgba(28, 26, 23, 0.14);
  }

  .dropdown.right { left: auto; right: 0; }

  /* centrato rispetto al trigger (landing): non sborda mai ai lati */
  .dropdown.center {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    max-width: 92vw;
  }

  .search-wrap {
    padding: 8px;
    border-bottom: 1px solid var(--bord);
  }

  .search-input {
    width: 100%;
    background: var(--surf2);
    border: 1px solid var(--bord);
    padding: 6px 10px;
    font-family: var(--serif-text);
    font-style: italic;
    font-size: 14px;
    outline: none;
    color: var(--txt);
  }

  .search-input::placeholder { color: var(--muted2); }

  /* iOS Safari zooma la pagina se un input col focus ha font < 16px:
     su mobile il campo di ricerca deve stare ad almeno 16px */
  @media (max-width: 760px) {
    .search-input { font-size: 16px; }
  }

  .list {
    max-height: 280px;
    overflow-y: auto;
  }

  .list-item {
    width: 100%;
    padding: 8px 14px;
    cursor: pointer;
    display: flex;
    align-items: baseline;
    gap: 10px;
    border-left: 3px solid transparent;
    border-top: none;
    border-right: none;
    border-bottom: 1px solid var(--bord);
    font-family: inherit;
    text-align: left;
    transition: background 0.1s;
  }

  .list-item:last-child { border-bottom: none; }

  .list-rank {
    font-family: var(--serif);
    font-size: 12px;
    color: var(--muted);
    min-width: 34px;
  }

  .list-name {
    font-family: var(--serif);
    font-size: 16px;
    font-weight: 500;
    color: var(--txt);
  }

  .list-nat {
    margin-left: auto;
    font-family: var(--serif);
    font-size: 12px;
    color: var(--muted);
    padding-left: 12px;
  }
</style>
