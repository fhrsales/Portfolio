<script>
  import { archiePages } from '$lib/stores';
  import ArchieML from 'archieml';
  import { derived } from 'svelte/store';
  import { page } from '$app/stores';
  import Title from '$lib/components/Title.svelte';
  import Body from '$lib/components/Body.svelte';

  const currentPage = derived(page, $page => $page.url.pathname.slice(1) || 'main');

  const parsed = derived(
    [archiePages, currentPage],
    ([$archiePages, $currentPage]) => {
      let raw = $archiePages[$currentPage];
      if (typeof raw === 'object' && raw !== null) {
        raw = raw.content || '';
      }
      try {
        return ArchieML.load(raw || '');
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
