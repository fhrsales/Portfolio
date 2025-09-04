<script>
    import Title from '$lib/components/heading/Title.svelte';
    import Text from '$lib/components/text/Text.svelte';
    import EmbedWrapper from '$lib/components/embed/EmbedWrapper.svelte';
    import PdfViewer from '$lib/components/image/PdfViewer.svelte';
    import Ai2Html from '$lib/components/image/Ai2Html.svelte';
    import ImageBlock from '$lib/components/image/ImageBlock.svelte';
    import VideoBlock from '$lib/components/video/VideoBlock.svelte';
    import TagSelector from '$lib/components/TagSelector.svelte';

    import { archiePages } from '$lib/stores';
    import { page } from '$app/stores';
    import { derived } from 'svelte/store';

    export let parsed = undefined; // optional prop; if omitted the component derives it from stores
    export let base = '';
    // local selection when TagSelector is rendered inside the content
    let localSelectedTag = '';

    // derive currentPage from $page
    const currentPage = derived(page, $page => {
        let path = $page.url.pathname.replace(base, '').replace(/^\/+|\/+$/g, '');
        if (!path || path === 'index') return 'index';
        return path;
    });

    // derive parsed from archiePages + currentPage when parsed prop not provided
    const internalParsed = derived([archiePages, currentPage], ([$archiePages, $currentPage]) => {
        if (!$archiePages || !$currentPage) return { erro: 'Store não carregado' };
        if (!$archiePages[$currentPage]) return { erro: `Página '${$currentPage}' não encontrada no store` };

        let raw = $archiePages[$currentPage];
        if (typeof raw === 'object' && raw !== null) raw = raw.content || '';

        if (raw && typeof raw === 'string') {
        const content = raw.trim();
        if (content) {
            const blocos = content.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
            return { orderedContent: blocos };
        }
        }

        return { erro: 'Nenhum conteúdo encontrado' };
    });

    // chosen parsed value: prop takes precedence
    $: usedParsed = (parsed !== undefined) ? parsed : $internalParsed;
    $: usedCurrentPage = $currentPage;

        // normalize all possible fields into a single ordered blocks array
        $: blocks = [];
        $: if (usedParsed && !usedParsed.erro) {
            const arr = [];
            if (usedParsed.titulo) arr.push(`titulo: ${usedParsed.titulo}`);
            if (usedParsed.embedWrapper) arr.push(`embedWrapper: ${usedParsed.embedWrapper}`);
            if (usedParsed.pdf) arr.push(`pdf: ${usedParsed.pdf}`);
            if (usedParsed.body) {
                const bodyArr = Array.isArray(usedParsed.body) ? usedParsed.body : String(usedParsed.body).split(/\n+/);
                arr.push(...bodyArr.filter(Boolean));
            }
            if (usedParsed.orderedContent) arr.push(...usedParsed.orderedContent);
            blocks = arr;
        }

    // build block objects and attach tags/selector markers
    $: blockObjects = [];
    $: if (blocks && blocks.length) {
        const objs = [];
        for (let i = 0; i < blocks.length; i++) {
            let raw = blocks[i];
            let trimmed = String(raw).trim();

            // support {imagem} ... {} inline block syntax.
            // Two situations are possible depending on how the content was split:
            // 1) the whole {imagem} block is a single multi-line entry in `blocks` (common when the block is separated by blank lines)
            // 2) the block is split across multiple consecutive entries (older logic)
            if (/^\{imagem\}[\s\S]*\{\}$/i.test(trimmed)) {
                // entire multi-line block contained in this single `raw`
                const lines = String(raw).split(/\r?\n/).map(l => l.trim());
                const inner = lines.slice(1, -1).map(l => l).filter(Boolean);
                const obj = {};
                for (const line of inner) {
                    const m = String(line).match(/^([^:]+):\s*(.*)$/);
                    if (m) {
                        const key = m[1].trim().toLowerCase();
                        const val = m[2].trim();
                        if (key === 'tags' && val) {
                            obj.tags = val.split(',').map(t => t.trim()).filter(Boolean);
                        } else if (key === 'classes' && val) {
                            obj.classes = val.split(',').map(t => t.trim()).filter(Boolean);
                        } else if (key === 'multiply') {
                            obj.multiply = /^(?:1|true|yes|sim|multiply)$/i.test(val) ? val : val;
                        } else if (key === 'borda' || key === 'radius') {
                            obj.borda = val;
                        } else {
                            obj[key] = val;
                        }
                    }
                }
                objs.push({ raw: obj, tags: (obj.tags || []).map(t => t.toLowerCase()) });
                continue;
            } else if (/^\{imagem\}$/i.test(trimmed)) {
                // fallback: collect following `blocks` entries until a closing {} marker
                const obj = {};
                const inner = [];
                let j = i + 1;
                for (; j < blocks.length; j++) {
                    const line = String(blocks[j]).trim();
                    if (/^\{\}$/i.test(line)) {
                        break;
                    }
                    inner.push(line);
                }
                for (const line of inner) {
                    const m = String(line).match(/^([^:]+):\s*(.*)$/);
                    if (m) {
                        const key = m[1].trim().toLowerCase();
                        const val = m[2].trim();
                        if (key === 'tags' && val) {
                            obj.tags = val.split(',').map(t => t.trim()).filter(Boolean);
                        } else if (key === 'classes' && val) {
                            obj.classes = val.split(',').map(t => t.trim()).filter(Boolean);
                        } else if (key === 'multiply') {
                            obj.multiply = /^(?:1|true|yes|sim|multiply)$/i.test(val) ? val : val;
                        } else if (key === 'borda' || key === 'radius') {
                            obj.borda = val;
                        } else {
                            obj[key] = val;
                        }
                    }
                }
                objs.push({ raw: obj, tags: (obj.tags || []).map(t => t.toLowerCase()) });
                i = j;
                continue;
            }

                // support {video} ... {} multi-line and split block format
                if (/^\{video\}[\s\S]*\{\}$/i.test(trimmed)) {
                    const lines = String(raw).split(/\r?\n/).map(l => l.trim());
                    const inner = lines.slice(1, -1).map(l => l).filter(Boolean);
                    const obj = {};
                    for (const line of inner) {
                        const m = String(line).match(/^([^:]+):\s*(.*)$/);
                        if (m) {
                            const key = m[1].trim().toLowerCase();
                            const val = m[2].trim();
                            if (key === 'tags' && val) {
                                obj.tags = val.split(',').map(t => t.trim()).filter(Boolean);
                            } else if (key === 'classes' && val) {
                                obj.classes = val.split(',').map(t => t.trim()).filter(Boolean);
                            } else if (key === 'borda' || key === 'radius') {
                                obj.borda = val;
                            } else {
                                obj[key] = val;
                            }
                        }
                    }
                    objs.push({ raw: { video: obj }, tags: (obj.tags || []).map(t => t.toLowerCase()) });
                    continue;
                } else if (/^\{video\}$/i.test(trimmed)) {
                    const obj = {};
                    const inner = [];
                    let j = i + 1;
                    for (; j < blocks.length; j++) {
                        const line = String(blocks[j]).trim();
                        if (/^\{\}$/i.test(line)) {
                            break;
                        }
                        inner.push(line);
                    }
                    for (const line of inner) {
                        const m = String(line).match(/^([^:]+):\s*(.*)$/);
                        if (m) {
                            const key = m[1].trim().toLowerCase();
                            const val = m[2].trim();
                            if (key === 'tags' && val) {
                                obj.tags = val.split(',').map(t => t.trim()).filter(Boolean);
                            } else if (key === 'classes' && val) {
                                obj.classes = val.split(',').map(t => t.trim()).filter(Boolean);
                            } else if (key === 'borda' || key === 'radius') {
                                obj.borda = val;
                            } else {
                                obj[key] = val;
                            }
                        }
                    }
                    objs.push({ raw: { video: obj }, tags: (obj.tags || []).map(t => t.toLowerCase()) });
                    i = j;
                    continue;
                }

            // support: "tagSelector" or "tagSelector: <json>" or HTML-like "<tagSelector />"
            if (/^tagSelector(?:\s*:\s*)?/i.test(trimmed) || /^<tagSelector\b/i.test(trimmed)) {
                // try parse JSON payload after ':' or inside tag
                let cfg = null;
                const m = trimmed.match(/^tagSelector(?:\s*:\s*(.+))?$/i);
                if (m && m[1]) {
                    try { cfg = JSON.parse(m[1]); } catch (e) { /* ignore */ }
                } else {
                    const m2 = trimmed.match(/^<tagSelector(?:\s*:\s*(.+))?\s*\/?>(?:\s*<\/tagSelector>)?$/i);
                    if (m2 && m2[1]) {
                        try { cfg = JSON.parse(m2[1]); } catch (e) { /* ignore */ }
                    }
                }
                objs.push({ raw, tags: [], selector: true, selectorConfig: cfg });
                continue;
            }

            // trailing tags: attach to last (and penultimate) blocks
            const tagMatch = trimmed.match(/^tags:\s*(.+)$/i);
            if (tagMatch) {
                const tags = tagMatch[1].split(',').map(t => t.trim()).filter(Boolean).map(t => t.toLowerCase());
                if (objs.length) {
                    objs[objs.length - 1].tags = Array.from(new Set([...(objs[objs.length - 1].tags || []), ...tags]));
                    if (objs.length > 1) objs[objs.length - 2].tags = Array.from(new Set([...(objs[objs.length - 2].tags || []), ...tags]));
                }
                continue;
            }

            // if image block, extract class-like tokens as initial tags
            const initialTags = [];
            if (/^imagem:\s*/i.test(trimmed)) {
                try {
                    const parsedImg = parseImagem(raw);
                    if (parsedImg && parsedImg.classes) {
                        parsedImg.classes.split(/\s+/).map(t => t.trim()).filter(Boolean).forEach(t => initialTags.push(t.toLowerCase()));
                    }
                } catch (e) { /* ignore */ }
            }
            objs.push({ raw, tags: initialTags });
        }
        blockObjects = objs;
    }

    // annotate blocks: mark whether they appear after a selector (so filtering only affects blocks after it)
    $: annotatedBlocks = [];
    $: if (blockObjects && blockObjects.length) {
        const arr = [];
        let seenSelector = false;
        for (let i = 0; i < blockObjects.length; i++) {
            const o = { ...blockObjects[i], isAfterSelector: seenSelector };
            arr.push(o);
            if (blockObjects[i].selector) seenSelector = true;
        }
        annotatedBlocks = arr;
    }

    function parseImagem(bloco) {
        // support object-style blocks coming from ArchieML structured content
        if (typeof bloco === 'object' && bloco !== null) {
            // allow either { nome: ..., tags: [...], ... } or { imagem: { nome: ..., ... } }
            let obj = bloco;
            if (obj.imagem && typeof obj.imagem === 'object') obj = obj.imagem;
            const nome = obj.nome || obj.name || '';
            const tamanho = (obj.tamanho || obj.size || 'M').toString().toUpperCase();
            const legenda = obj.legenda || obj.caption || obj.legend || '';
            const classes = Array.isArray(obj.classes) ? obj.classes.join(' ') : (obj.classes || '');
            const tags = Array.isArray(obj.tags) ? obj.tags.map(t => String(t).trim().toLowerCase()) : (typeof obj.tags === 'string' ? obj.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []);
            const multiply = obj.multiply || obj.multiplay || obj.mix || false;
            const borda = obj.borda || obj.radius || obj.raio || obj.border || '';
            return { nome, tamanho, legenda, classes, radius: borda || '', tags, multiply };
        }

        // legacy: string-based 'imagem: filename, tokens...' parsing
        if (typeof bloco !== 'string') return { nome: '', tamanho: 'M', legenda: '', classes: '', radius: '', tags: [], multiply: false };
        const rest = bloco.trim().replace(/^imagem:\s*/i, '');
        const parts = rest.split(',').map(p => p.trim()).filter(Boolean);
        const nome = parts[0] || '';
        let tamanho = 'M';
        let legenda = '';
        let radius = '';
        const classLike = [];
        const tags = [];
        for (let i = 1; i < parts.length; i++) {
            const p = parts[i];
            if (!p) continue;
            if (i === 1 && /^(?:P{1,2}|M|G|GG)$/i.test(p)) {
                tamanho = p.toUpperCase();
                continue;
            }
            if (/^\d+(?:\.\d+)?(?:[a-z%]+)?$/i.test(p)) {
                radius = /^\d+$/.test(p) ? p + 'px' : p;
                continue;
            }
            // var(...) or --var tokens
            if (/^var\(|^--[\w-]+$/.test(p)) {
                classLike.push(p);
                continue;
            }
            // shadow or other class-like tokens
            if (/^shadow[-_\w]*$/i.test(p) || /^[\w-]+$/.test(p)) {
                // treat known 'multiply' indicators as multiply flag
                if (/multiply/i.test(p) || /var\(|--/.test(p)) {
                    classLike.push(p);
                } else {
                    // ambiguous token: add to both classes and tags
                    classLike.push(p);
                    tags.push(p.toLowerCase());
                }
                continue;
            }
            // fallback: treat as caption fragment
            legenda = legenda ? (legenda + ' ' + p) : p;
        }
        const classes = classLike.join(' ');
        return { nome, tamanho, legenda, classes, radius, tags, multiply: false };
    }

    function parseVideo(bloco) {
        if (typeof bloco === 'object' && bloco !== null) {
            let obj = bloco.video && typeof bloco.video === 'object' ? bloco.video : bloco;
            const nome = obj.nome || obj.name || '';
            const tamanho = (obj.tamanho || obj.size || 'M').toString().toUpperCase();
            const legenda = obj.legenda || obj.caption || '';
            const classes = Array.isArray(obj.classes) ? obj.classes.join(' ') : (obj.classes || '');
            const tags = Array.isArray(obj.tags) ? obj.tags.map(t => String(t).trim().toLowerCase()) : (typeof obj.tags === 'string' ? obj.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []);
            const radius = obj.borda || obj.radius || '';
            return { nome, tamanho, legenda, classes, radius, tags };
        }
        if (typeof bloco !== 'string') return { nome: '', tamanho: 'M', legenda: '', classes: '', radius: '', tags: [] };
        const rest = bloco.trim().replace(/^video:\s*/i, '');
        const parts = rest.split(',').map(p => p.trim()).filter(Boolean);
        const nome = parts[0] || '';
        let tamanho = 'M';
        let legenda = '';
        let radius = '';
        const classLike = [];
        const tags = [];
        for (let i = 1; i < parts.length; i++) {
            const p = parts[i];
            if (!p) continue;
            if (i === 1 && /^(?:P{1,2}|M|G|GG)$/i.test(p)) {
                tamanho = p.toUpperCase();
                continue;
            }
            if (/^\d+(?:\.\d+)?(?:[a-z%]+)?$/i.test(p)) {
                radius = /^\d+$/.test(p) ? p + 'px' : p;
                continue;
            }
            if (/^var\(|^--[\w-]+$/.test(p)) {
                classLike.push(p);
                continue;
            }
            if (/^shadow[-_\w]*$/i.test(p) || /^[\w-]+$/.test(p)) {
                if (/multiply/i.test(p) || /var\(|--/.test(p)) {
                    classLike.push(p);
                } else {
                    classLike.push(p);
                    tags.push(p.toLowerCase());
                }
                continue;
            }
            legenda = legenda ? (legenda + ' ' + p) : p;
        }
        const classes = classLike.join(' ');
        return { nome, tamanho, legenda, classes, radius, tags };
    }

    function fixLinks(html, base) {
        if (!base) return html;
        return html.replace(/href=['"]\/(?!\/)([^'"#?]*)['"]/g, `href='${base}/$1'`);
    }
</script>

{#if usedParsed?.erro}
    <!-- <div style="color: red; font-weight: bold;">Erro: {usedParsed.erro}</div> -->
{:else}
    {#if annotatedBlocks && annotatedBlocks.length}
        {#each annotatedBlocks as obj, i}
            {#if obj.selector}
                {#key i}
                    <TagSelector bind:selected={localSelectedTag} tags={obj.selectorConfig && Array.isArray(obj.selectorConfig) ? obj.selectorConfig : undefined} />
                {/key}
            {:else}
                {@const bloco = obj.raw}
                {@const blocoStr = (typeof bloco === 'string') ? bloco.trim() : ''}
                {#if !obj.isAfterSelector || !localSelectedTag || (obj.tags && obj.tags.map(t => t.toLowerCase()).includes(localSelectedTag.toLowerCase()))}
                    {#if blocoStr.match(/^titulo: (.+)$/i)}
                        <Title value={blocoStr.replace(/^titulo: /i, '')} />
                    {:else if blocoStr.match(/^embedWrapper: (.+)$/i)}
                        <EmbedWrapper value={blocoStr.replace(/^embedWrapper: /i, '')} />
                    {:else if blocoStr.match(/^pdf: (.+)$/i)}
                        <PdfViewer value={blocoStr.replace(/^pdf: /i, '')} />
                    {:else if blocoStr.match(/^ai2html: (.+)$/i)}
                        <Ai2Html dir={`${base}/ai2html/${blocoStr.replace(/^ai2html: /i, '')}/ai2html-output`} />
                    {:else if typeof bloco === 'object' && (bloco.nome || (bloco.imagem && bloco.imagem.nome))}
                        {#key i}
                            {#await Promise.resolve(parseImagem(bloco)) then img}
                                <ImageBlock
                                    src={`${base}/imgs/${img.nome}`}
                                    nome_mobile={img.nome_mobile ? `${base}/imgs/${img.nome_mobile}` : ''}
                                    alt={img.nome}
                                    size={img.tamanho}
                                    caption={img.legenda}
                                    classes={img.classes}
                                    radius={img.radius}
                                    borda={img.radius}
                                    tags={img.tags}
                                    multiply={img.multiply}
                                />
                            {/await}
                        {/key}
                    {:else if typeof bloco === 'object' && bloco.video}
                        {#key i}
                            {#await Promise.resolve(parseImagem(bloco.video || bloco)) then vid}
                                <VideoBlock
                                    src={`${base}/videos/${vid.nome || vid.name}`}
                                    sources={vid.sources ? (Array.isArray(vid.sources) ? vid.sources.map(s => (s.startsWith('http') ? s : `${base}/videos/${s}`)) : String(vid.sources).split(',').map(s => s.trim()).filter(Boolean).map(s => (s.startsWith('http') ? s : `${base}/videos/${s}`))) : []}
                                    size={vid.tamanho || vid.size || 'M'}
                                    caption={vid.legenda || vid.caption || ''}
                                    classes={vid.classes}
                                    radius={vid.radius || vid.borda}
                                    tags={vid.tags}
                                />
                            {/await}
                        {/key}
                    {:else if blocoStr.match(/^imagem: ([^,]+)(?:,\s*([PMG]{1,2}|GG))?(?:,\s*(.+))?$/i)}
                        {#key i}
                            {#await Promise.resolve(parseImagem(bloco)) then img}
                                <ImageBlock
                                    src={`${base}/imgs/${img.nome}`}
                                    alt={img.nome}
                                    size={img.tamanho}
                                    caption={img.legenda}
                                    classes={img.classes}
                                    radius={img.radius}
                                    tags={img.tags}
                                    multiply={img.multiply}
                                />
                            {/await}
                        {/key}
                    {:else if blocoStr.match(/^video: ([^,]+)(?:,\s*([PMG]{1,2}|GG))?(?:,\s*(.+))?$/i)}
                        {#key i}
                            {#await Promise.resolve(parseVideo(bloco)) then vid}
                                <VideoBlock
                                    src={`${base}/videos/${vid.nome}`}
                                    sources={vid.sources ? (Array.isArray(vid.sources) ? vid.sources.map(s => (s.startsWith('http') ? s : `${base}/videos/${s}`)) : String(vid.sources).split(',').map(s => s.trim()).filter(Boolean).map(s => (s.startsWith('http') ? s : `${base}/videos/${s}`))) : []}
                                    size={vid.tamanho}
                                    caption={vid.legenda}
                                    classes={vid.classes}
                                    radius={vid.radius}
                                    tags={vid.tags}
                                />
                            {/await}
                        {/key}
                    {:else}
                        <Text value={{ body: Array.isArray(bloco) ? bloco : (typeof bloco === 'string' ? bloco.split(/\n+/) : ['']) }} />
                    {/if}
                {/if}
            {/if}
        {/each}
        
    {:else}
        <!-- Fallback: show page name when available -->
        <!-- <div style="color: orange; text-align: center; padding: 2rem;">Nenhum conteúdo encontrado para a página <b>{usedCurrentPage}</b>.</div> -->
    {/if}
{/if}
