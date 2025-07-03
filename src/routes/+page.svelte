
<script>
import { archiePages } from '$lib/stores';
import ArchieML from 'archieml';
import { derived } from 'svelte/store';
import { page } from '$app/stores';
import Title from '$lib/components/Title.svelte';

// Detecta a página pela rota ou usa 'index', mesmo em subpasta
import { base } from '$app/paths';
const currentPage = derived(page, $page => {
  // Remove base path e barras extras
  let path = $page.url.pathname.replace(base, '').replace(/^\/+|\/+$/g, '');
  // Se vazio, retorna 'index'
  return (!path) ? 'index' : path;
});

const parsed = derived(
  [archiePages, currentPage],
  ([$archiePages, $currentPage]) => {
    try {
      // Corrige para pegar apenas o campo .content
      const result = ArchieML.load(($archiePages[$currentPage]?.content) || '');
      // Se não houver body, tenta gerar manualmente a partir do texto anônimo
      if (!result.body && $archiePages[$currentPage]?.content) {
        // Remove campos nomeados
        const content = $archiePages[$currentPage].content;
        const semCampos = content.replace(/^\w+:.*$/gm, '').trim();
        if (semCampos) {
          result.body = semCampos.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
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
    {/each}
  </div>
{/if}


