
<script>
import { archiePages } from '$lib/stores';
import ArchieML from 'archieml';
import { derived } from 'svelte/store';
import { page } from '$app/stores';
import Title from '$lib/components/Title.svelte';
import Body from '$lib/components/Body.svelte';

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
      return ArchieML.load(($archiePages[$currentPage]?.content) || '');
    } catch {
      return { erro: 'Conteúdo ArchieML inválido' };
    }
  }
);
</script>

<!-- <h1>Página Renderizada: {$currentPage}</h1> -->

<!-- Diagnóstico: mensagens de erro e debug -->
{#if $parsed.erro}
  <div style="color: red; font-weight: bold;">Erro: {$parsed.erro}</div>
{/if}
{#if !$parsed.title && !$parsed.body && !$parsed.erro}
  <div style="color: orange;">Nenhum conteúdo encontrado para a página <b>{$currentPage}</b>. Verifique se o JSON está correto e se o fetch funcionou.</div>
{/if}
{#if $parsed.title}
  <Title value={$parsed.title} />
{/if}
{#if $parsed.body}
  <Body value={$parsed.body} />
{/if}

