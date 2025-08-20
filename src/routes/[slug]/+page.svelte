<script>
    import { archiePages } from '$lib/stores';
    import ArchieML from 'archieml';
    import { derived } from 'svelte/store';
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    import Title from '$lib/components/Title.svelte';
    import Body from '$lib/components/Body.svelte';
    import EmbedWrapper from '$lib/components/EmbedWrapper.svelte';
    import PdfViewer from '$lib/components/PdfViewer.svelte';
    import Ai2Html from '$lib/components/Ai2Html.svelte';
    import ImageBlock from '$lib/components/ImageBlock.svelte';

    // Função utilitária para extrair dados da linha imagem: nome, tamanho, legenda
    function parseImagem(bloco) {
        // Aceita: nome, nome+tamanho, nome+tamanho+legenda, ignora espaços extras
        const match = bloco.trim().match(/^imagem:\s*([^,\n]+)\s*(?:,\s*([PMG]{1,2}|GG))?\s*(?:,\s*(.+))?$/i);
        return {
            nome: match && match[1] ? match[1].trim() : '',
            tamanho: match && match[2] ? match[2].trim() : 'M',
            legenda: (match && typeof match[3] === 'string') ? match[3].trim() : ''
        };
    }

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

    function fixLinks(html, base) {
        if (!base) return html;
        return html.replace(/href=['"]\/(?!\/)([^'"#?]*)['"]/g, `href='${base}/$1'`);
    }
</script>

<!-- Diagnóstico: mensagens de erro e debug -->
{#if $parsed.erro}
    <div style="color: red; font-weight: bold;">Erro: {$parsed.erro}</div>
{/if}

{#if !$parsed.titulo && !$parsed.body && !$parsed.embedWrapper && !$parsed.pdf && !$parsed.erro}
    {#if archiePages && $currentPage && $archiePages[$currentPage] && typeof $archiePages[$currentPage] === 'object' && $archiePages[$currentPage].content}
            <div class="corpo">
                        {#each $archiePages[$currentPage].content.split(/\n\n+/) as bloco, i}
                            {#if bloco.trim().match(/^ai2html: (.+)$/i)}
                                <Ai2Html dir={`${base}/ai2html/${bloco.trim().match(/^ai2html: (.+)$/i)[1]}/ai2html-output`} />
                            {:else if bloco.trim().match(/^imagem: ([^,]+)(?:,\s*([PMG]{1,2}|GG))?(?:,\s*(.+))?$/i)}
                                {#key i}
                                    {#await Promise.resolve(parseImagem(bloco)) then img}
                                        <ImageBlock
                                            src={`${base}/imgs/${img.nome}`}
                                            alt={img.nome}
                                            size={img.tamanho}
                                            caption={img.legenda}
                                        />
                                    {/await}
                                {/key}
                            {:else}
                                <p>{@html fixLinks(bloco, base)}</p>
                            {/if}
                        {/each}
            </div>
    {:else}
        <div style="color: orange;">Nenhum conteúdo encontrado para a página <b>{$currentPage}</b>. Verifique se o JSON está correto e se o fetch funcionou.</div>
    {/if}
{/if}
<!-- =========== -->

{#if $parsed.titulo}
    <Title value={$parsed.titulo} />
{/if}

{#if $parsed.embedWrapper}
    <EmbedWrapper value={$parsed.embedWrapper} />
{/if}

{#if $parsed.pdf}
    <PdfViewer value={$parsed.pdf} />
{/if}

{#if $parsed.body}
    <Body value={{ body: $parsed.body }} />
{/if}
