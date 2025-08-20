
<script>
import { archiePages } from '$lib/stores';
import ArchieML from 'archieml';
import { derived } from 'svelte/store';
import { page } from '$app/stores';
import Title from '$lib/components/Title.svelte';
import ImageBlock from '$lib/components/ImageBlock.svelte';

// Detecta a página pela rota ou usa 'index', mesmo em subpasta
import { base } from '$app/paths';
const currentPage = derived(page, $page => {
  // Remove base path e barras extras
  let path = $page.url.pathname.replace(base, '').replace(/^\/+|\/+$/g, '');
  // Trata /, /index e vazio como 'index'
  if (!path || path === 'index') return 'index';
  return path;
});

const parsed = derived(
  [archiePages, currentPage],
  ([$archiePages, $currentPage]) => {
    try {
      // Corrige para pegar apenas o campo .content
      const result = ArchieML.load(($archiePages[$currentPage]?.content) || '');
      // Se não houver body, divide todo o conteúdo em blocos por uma ou mais quebras de linha
      if (!result.body && $archiePages[$currentPage]?.content) {
        const content = $archiePages[$currentPage].content.trim();
        if (content) {
          result.body = content.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
        }
      }
      return result;
    } catch {
      return { erro: 'Conteúdo ArchieML inválido' };
    }
  }
);

// Corrige links internos para usar a base correta
function fixLinks(html, base) {
  if (!base) return html;
  return html.replace(/href=['"]\/(?!\/)([^'"#?]*)['"]/g, `href='${base}/$1'`);
}
</script>

<!-- <h1>Página Renderizada: {$currentPage}</h1> -->

<!-- Diagnóstico: mensagens de erro e debug -->
{#if $parsed.erro}
  <div style="color: red; font-weight: bold;">Erro: {$parsed.erro}</div>
{/if}
{#if !$parsed.titulo && !$parsed.body && !$parsed.erro}
  <div style="color: orange;">Nenhum conteúdo encontrado para a página <b>{$currentPage}</b>. Verifique se o JSON está correto e se o fetch funcionou.</div>
{/if}
<!-- Renderiza campos nomeados com componentes específicos -->
{#if $parsed.titulo}
  <Title value={$parsed.titulo} />
{/if}

<!-- Renderiza blocos anônimos (body) como parágrafos -->
{#if !$parsed.erro}
  <div class="corpo">
    {#each (
      $parsed.body
        ? Array.isArray($parsed.body) ? $parsed.body : [$parsed.body]
        : archiePages && $currentPage && $archiePages[$currentPage] && typeof $archiePages[$currentPage] === 'object' && $archiePages[$currentPage].content
          ? $archiePages[$currentPage].content.split(/\n\n+/)
          : []
    ) as bloco, i}
      {#if bloco.trim().match(/^ai2html: (.+)$/i)}
        <Ai2Html dir={`${base}/ai2html/${bloco.trim().match(/^ai2html: (.+)$/i)[1]}/ai2html-output`} />
      {:else if bloco.trim().match(/^imagem: ([^,]+)(?:,\s*([PMG]{1,2}|GG))?(?:,\s*(.+))?$/i)}
        {#key i}
          {#await Promise.resolve((() => {
            const match = bloco.trim().match(/^imagem:\s*([^,\n]+)\s*(?:,\s*([PMG]{1,2}|GG))?\s*(?:,\s*(.+))?$/i);
            return {
              nome: match && match[1] ? match[1].trim() : '',
              tamanho: match && match[2] ? match[2].trim() : 'M',
              legenda: (match && typeof match[3] === 'string') ? match[3].trim() : ''
            };
          })()) then img}
            <ImageBlock
              src={`${base}/imgs/${img.nome}`}
              alt={img.nome}
              size={img.tamanho}
              caption={img.legenda}
            />
          {/await}
        {/key}
      {:else if bloco.trim().match(/^pdf: (.+)$/i)}
        <PdfViewer value={bloco.trim().match(/^pdf: (.+)$/i)[1]} />
      {:else if bloco.trim().match(/^embedWrapper: (.+)$/i)}
        <EmbedWrapper value={bloco.trim().match(/^embedWrapper: (.+)$/i)[1]} />
      {:else if bloco.trim().match(/^<a\b/i)}
        <p>{@html fixLinks(bloco, base)}</p>
      {:else if bloco.trim().startsWith('<')}
        {@html fixLinks(bloco, base)}
      {:else}
        <p>{@html fixLinks(bloco, base)}</p>
      {/if}
    {/each}
  </div>
{/if}


