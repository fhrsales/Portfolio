<script>
  import { archiePages } from '$lib/stores';
  import ArchieML from 'archieml';
  import { derived } from 'svelte/store';
  import { page } from '$app/stores';
import Title from '$lib/components/Title.svelte';
import EmbedWrapper from '$lib/components/EmbedWrapper.svelte';
import PdfViewer from '$lib/components/PdfViewer.svelte';

  import { base } from '$app/paths';
  const currentPage = derived(page, $page => {
    // Remove base path e barras extras
    let path = $page.url.pathname.replace(base, '').replace(/^\/+|\/+$/g, '');
    return (!path) ? 'index' : path;
  });

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


<!-- Diagnóstico: mensagens de erro e debug -->
{#if $parsed.erro}
  <div style="color: red; font-weight: bold;">Erro: {$parsed.erro}</div>
{/if}
{#if !$parsed.titulo && !$parsed.body && !$parsed.embedWrapper && !$parsed.pdf && !$parsed.erro}
  <div style="color: orange;">Nenhum conteúdo encontrado para a página <b>{$currentPage}</b>. Verifique se o JSON está correto e se o fetch funcionou.</div>
{/if}


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
        <p>{@html fixLinks(bloco, base)}</p>
      {:else if bloco.trim().startsWith('<')}
        {@html fixLinks(bloco, base)}
      {:else}
        <p>{@html fixLinks(bloco, base)}</p>
      {/if}
<script>
  // ...existing code...
  function fixLinks(html, base) {
    if (!base) return html;
    return html.replace(/href=['"]\/(?!\/)([^'"#?]*)['"]/g, `href='${base}/$1'`);
  }
</script>
    {/each}
  </div>
{/if}
