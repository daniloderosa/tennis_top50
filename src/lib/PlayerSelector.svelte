<script>
  import { PLAYERS } from './data.js';
  import { createEventDispatcher, onMount } from 'svelte';

  export let player;
  export let color;
  export let otherRank;

  const dispatch = createEventDispatcher();

  let open = false;
  let query = '';
  let container;

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

<div class="selector-wrap" bind:this={container}>
  <div class="selector-card" style="border-color: {color}25; box-shadow: 0 1px 4px rgba(0,0,0,0.05)">
    <button
      class="trigger"
      on:click={() => (open = !open)}
      style="border-color: {open ? color + '80' : color + '30'}"
    >
      <span class="player-name" style="color: {color}">{player.full}</span>
      <span class="player-meta">#{player.rank} · {player.nat}</span>
      <span class="arrow" class:rotated={open}>▼</span>
    </button>

    {#if open}
      <div class="dropdown">
        <div class="search-wrap">
          <!-- svelte-ignore a11y-autofocus -->
          <input
            autofocus
            bind:value={query}
            placeholder="Cerca…"
            class="search-input"
          />
        </div>
        <div class="list">
          {#each filtered as p (p.rank)}
            <button
              class="list-item"
              class:active={p.rank === player.rank}
              style="border-left-color: {p.rank === player.rank ? color : 'transparent'};
                     background: {p.rank === player.rank ? color + '10' : 'transparent'}"
              on:click={() => select(p)}
              on:mouseenter={e => { e.currentTarget.style.background = color + '10'; }}
              on:mouseleave={e => { e.currentTarget.style.background = p.rank === player.rank ? color + '10' : 'transparent'; }}
            >
              <span class="list-rank">#{p.rank}</span>
              <span class="list-name">{p.full}</span>
              <span class="list-nat">{p.nat}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .selector-wrap {
    position: relative;
    width: 100%;
  }

  .selector-card {
    background: var(--surf);
    border-radius: 10px;
    padding: 12px 14px;
    border: 1.5px solid;
  }

  .trigger {
    width: 100%;
    background: transparent;
    border-radius: 7px;
    padding: 9px 12px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.5px solid;
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.15s;
  }

  .player-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
  }

  .player-meta {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    color: var(--muted);
  }

  .arrow {
    margin-left: auto;
    color: var(--muted);
    font-size: 10px;
    transition: transform 0.2s;
    display: inline-block;
  }

  .arrow.rotated {
    transform: rotate(180deg);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: max-content;
    min-width: 100%;
    background: var(--surf);
    border: 1.5px solid var(--bord);
    border-radius: 8px;
    z-index: 300;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }

  .search-wrap {
    padding: 8px;
    border-bottom: 1px solid var(--bord);
  }

  .search-input {
    width: 100%;
    background: var(--surf2);
    border: 1px solid var(--bord);
    border-radius: 5px;
    padding: 6px 10px;
    font-size: 14px;
    outline: none;
    color: var(--txt);
    font-family: inherit;
  }

  .list {
    max-height: 260px;
    overflow-y: auto;
  }

  .list-item {
    width: 100%;
    padding: 8px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    border-left: 3px solid transparent;
    border-top: none;
    border-right: none;
    border-bottom: none;
    font-family: inherit;
    text-align: left;
    transition: background 0.1s;
  }

  .list-rank {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    color: var(--muted);
    min-width: 24px;
  }

  .list-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--txt);
  }

  .list-nat {
    margin-left: auto;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    color: var(--muted);
    padding-left: 12px;
  }
</style>
