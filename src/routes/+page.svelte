
<script>
import { archiePages } from '$lib/stores';
import ArchieML from 'archieml';
import { derived } from 'svelte/store';
import { page } from '$app/stores';
import Title from '$lib/components/Title.svelte';
import Body from '$lib/components/Body.svelte';

// Detecta a página pela rota ou usa 'index'
const currentPage = derived(page, $page => $page.url.pathname.slice(1) || 'index');

const parsed = derived(
  [archiePages, currentPage],
  ([$archiePages, $currentPage]) => {
    try {
      // Corrige para pegar apenas o campo .content
      return ArchieML.load(($archiePages[$currentPage]?.content) || '');
    } catch {
      return { erro: 'Conteúdo ArchieML inválido' };
    }
  }
);
</script>

<!-- <h1>Página Renderizada: {$currentPage}</h1> -->
{#if $parsed.title}
  <Title value={$parsed.title} />
{/if}
{#if $parsed.body}
  <Body value={$parsed.body} />
{/if}

