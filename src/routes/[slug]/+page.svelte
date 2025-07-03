<script>
  import { archiePages } from '$lib/stores';
  import ArchieML from 'archieml';
  import { derived } from 'svelte/store';
  import { page } from '$app/stores';
import Title from '$lib/components/Title.svelte';
import EmbedWrapper from '$lib/components/EmbedWrapper.svelte';
import PdfViewer from '$lib/components/PdfViewer.svelte';

  const currentPage = derived(page, $page => $page.url.pathname.slice(1) || 'index');

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


<!-- Renderiza campo embedWrapper com componente -->
{#if $parsed.embedWrapper}
  <EmbedWrapper value={$parsed.embedWrapper} />
{/if}

<!-- Renderiza campo pdf com componente -->
{#if $parsed.pdf}
  <PdfViewer value={$parsed.pdf} />
{/if}

{#if $parsed.titulo}
  <Title value={$parsed.titulo} />
{/if}

{#if $parsed.body}
  <div class="corpo">
    {#each Array.isArray($parsed.body) ? $parsed.body : [$parsed.body] as bloco}
      {#if bloco.trim().match(/^<a\b/i)}
        <p>{@html bloco}</p>
      {:else if bloco.trim().startsWith('<')}
        {@html bloco}
      {:else}
        <p>{@html bloco}</p>
      {/if}
    {/each}
  </div>
{/if}
