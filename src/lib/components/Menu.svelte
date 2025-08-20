<script>
import { archiePages } from '$lib/stores';
import { page } from '$app/stores';
import { derived, get } from 'svelte/store';
import { base } from '$app/paths';
let open = false;
import { onDestroy } from 'svelte';
let pages = [];
let menuLabels = {};
let current = '';
import { onMount } from 'svelte';
// Atualiza as páginas e a página atual reativamente
onMount(() => {
  const unsubscribe = archiePages.subscribe(val => {
    // Filtra apenas páginas com showInMenu true (ou undefined para retrocompatibilidade)
    const filtered = Object.entries(val)
      .filter(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
          return v.showInMenu !== false;
        }
        return true; // retrocompatível: string = mostra
      });
    pages = filtered.map(([k]) => k);
    menuLabels = Object.fromEntries(filtered.map(([k, v]) => [k, v.menuLabel || k]));
  });
  return unsubscribe;
});
$: current = $page.url.pathname.replace(/^\//, '');

</script>

<nav class="menu-bar">
  <div class="menu-container">
    <a class="logo" href="{base}/">Fabio Sales</a>
    <button class="menu-toggle" on:click={() => open = !open} aria-label="Abrir menu">
      &#9776;
    </button>
  </div>
  {#if pages.length || import.meta.env.DEV}
    <ul class:open={open}>
      {#each pages as p}
        <li class:active={current === p || (p === 'main' && current === '')}>
          <a href={p === 'main' ? `${base}/` : `${base}/${p}`}>{menuLabels[p]}</a>
        </li>
      {/each}
      {#if import.meta.env.DEV}
        <li class="admin-link">
          <a href="/admin" style="color:#0070f3;font-weight:bold;">Admin</a>
        </li>
      {/if}
    </ul>
  {/if}
</nav>

<style>
.menu-bar {
  width: 100vw;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}
.menu-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 1em;
}
.logo {
  font-weight: bold;
  font-size: 1.2em;
}
ul {
  list-style: none;
  display: flex;
  gap: 1em;
  margin: 0;
  padding: 0;
}
li.active a {
  color: var(--cor-primaria, #0070f3);
  font-weight: bold;
}
.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 2em;
  cursor: pointer;
}
@media (max-width: 700px) {
  .menu-container {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5em 1em;
  }
  .logo {
    margin-bottom: 0;
  }
  ul {
    flex-direction: column;
    width: 100%;
    display: none;
    margin-top: 0.5em;
    padding-left: 1.5em;
    padding-right: 1.5em;
    box-sizing: border-box;
  }
  ul.open {
    display: flex;
  }
  .menu-toggle {
    display: block;
    margin-left: 1em;
  }
  .admin-link {
    margin-left: 0 !important;
  }
}
</style>
