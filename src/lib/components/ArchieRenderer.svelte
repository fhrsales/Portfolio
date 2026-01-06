<script>
	import Title from '$lib/components/heading/Title.svelte';
	import H1 from '$lib/components/heading/H1.svelte';
	import H2 from '$lib/components/heading/H2.svelte';
	import H3 from '$lib/components/heading/H3.svelte';
	import H4 from '$lib/components/heading/H4.svelte';
	import H5 from '$lib/components/heading/H5.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import Text from '$lib/components/text/Text.svelte';
	import EmbedWrapper from '$lib/components/embed/EmbedWrapper.svelte';
	import PdfViewer from '$lib/components/image/PdfViewer.svelte';
	import Ai2Html from '$lib/components/image/Ai2Html.svelte';
	import ImageBlock from '$lib/components/image/ImageBlock.svelte';
	import VideoBlock from '$lib/components/video/VideoBlock.svelte';
	import ScrollerVideo from '$lib/components/ScrollerVideo.svelte';
    import AutoScrollGallery from '$lib/components/image/AutoScrollGallery.svelte';
    import ScrollBg from '$lib/components/ScrollBg.svelte';
	import LazyMount from '$lib/components/LazyMount.svelte';
	import TagSelector from '$lib/components/TagSelector.svelte';

	import { archiePages } from '$lib/stores';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { parseImage as parseImageHelper } from '$lib/parsers/image.js';
	import { parseVideo as parseVideoHelper } from '$lib/parsers/video.js';
	import { withBase } from '$lib/paths.js';
	import imageMeta from '$lib/imageMeta.json';
	const isProd = import.meta.env && import.meta.env.PROD;
	import {
		normalizeParsedToBlocks,
		buildBlockObjects,
		annotateBlocks
	} from '$lib/parsers/content.js';

	export let parsed = undefined; // optional prop; if omitted the component derives it from stores
	export let base = '';
	// local selection when TagSelector is rendered inside the content
	let localSelectedTag = '';

	// derive currentPage from $page
	const currentPage = derived(page, ($page) => {
		let path = $page.url.pathname.replace(base, '').replace(/^\/+|\/+$/g, '');
		if (!path || path === 'index') return 'index';
		return path;
	});

	// derive parsed from archiePages + currentPage when parsed prop not provided
	const internalParsed = derived([archiePages, currentPage], ([$archiePages, $currentPage]) => {
		if (!$archiePages || !$currentPage) return { erro: 'Store não carregado' };
		if (!$archiePages[$currentPage])
			return { erro: `Página '${$currentPage}' não encontrada no store` };

		let raw = $archiePages[$currentPage];
		if (typeof raw === 'object' && raw !== null) raw = raw.content || '';

		if (raw && typeof raw === 'string') {
			const content = raw.trim();
			if (content) {
				const blocos = content
					.split(/\n\n+/)
					.map((s) => s.trim())
					.filter(Boolean);
				return { orderedContent: blocos };
			}
		}

		return { erro: 'Nenhum conteúdo encontrado' };
	});

	// chosen parsed value: prop takes precedence
	$: usedParsed = parsed !== undefined ? parsed : $internalParsed;

	// normalize all possible fields into a single ordered blocks array
	$: blocks = normalizeParsedToBlocks(usedParsed);

	// build block objects and attach tags/selector markers
	$: blockObjects = buildBlockObjects(blocks);

	// inline parsing code removed (logic moved to parsers)

	// annotate blocks: mark whether they appear after a selector (so filtering only affects blocks after it)
	$: annotatedBlocks = annotateBlocks(blockObjects);

	function parseImagem(bloco) {
		return parseImageHelper(bloco);
	}

	function parseVideo(bloco) {
		return parseVideoHelper(bloco);
	}

	// mark the first image on the page as priority (helps LCP)
	let _firstImageMarked = false;
	function nextImagePriority() {
		if (_firstImageMarked) return false;
		_firstImageMarked = true;
		return true;
	}
</script>

{#if usedParsed?.erro}
	<!-- <div style="color: red; font-weight: bold;">Erro: {usedParsed.erro}</div> -->
{:else if annotatedBlocks && annotatedBlocks.length}
	{#each annotatedBlocks as obj, i (i)}
		{#if obj.selector}
			{#key i}
				<div class="tag-selector-anchor">
					<TagSelector
						bind:selected={localSelectedTag}
						tags={obj.selectorConfig && Array.isArray(obj.selectorConfig)
							? obj.selectorConfig
							: undefined}
					/>
				</div>
			{/key}
		{:else}
			{@const bloco = obj.raw}
			{@const blocoStr = typeof bloco === 'string' ? bloco.trim() : ''}
			{#if !obj.isAfterSelector || !localSelectedTag || (obj.tags && obj.tags
						.map((t) => t.toLowerCase())
						.includes(localSelectedTag.toLowerCase()))}
				{#if blocoStr.match(/^h1:\s*(.+)$/i)}
					<H1 value={blocoStr.replace(/^h1:\s*/i, '')} />
				{:else if blocoStr.match(/^h2:\s*(.+)$/i)}
					<H2 value={blocoStr.replace(/^h2:\s*/i, '')} />
				{:else if blocoStr.match(/^h3:\s*(.+)$/i)}
					<H3 value={blocoStr.replace(/^h3:\s*/i, '')} />
				{:else if blocoStr.match(/^h4:\s*(.+)$/i)}
					<H4 value={blocoStr.replace(/^h4:\s*/i, '')} />
				{:else if blocoStr.match(/^h5:\s*(.+)$/i)}
					<H5 value={blocoStr.replace(/^h5:\s*/i, '')} />
				{:else if blocoStr.match(/^titulo: (.+)$/i)}
					<Title value={blocoStr.replace(/^titulo: /i, '')} />
				{:else if blocoStr.match(/^embedWrapper: (.+)$/i)}
					<EmbedWrapper value={blocoStr.replace(/^embedWrapper: /i, '')} />
				{:else if blocoStr.match(/^pdf: (.+)$/i)}
					<PdfViewer value={blocoStr.replace(/^pdf: /i, '')} />
				{:else if blocoStr.match(/^ai2html: (.+)$/i)}
					<Ai2Html
						dir={withBase(`/ai2html/${blocoStr.replace(/^ai2html: /i, '')}/ai2html-output`, base)}
					/>
				{:else if typeof bloco === 'object' && bloco.fundo}
					{#key i}
						<ScrollBg
							color={(bloco.fundo.cor || bloco.fundo.color || bloco.fundo.bg || '').trim() || 'var(--color-light)'}
							height={(bloco.fundo.altura || bloco.fundo.height || bloco.fundo.vh || '').trim()}
						/>
					{/key}
				{:else if typeof bloco === 'object' && bloco.cronologia}
					{#key i}
						<Timeline
							items={Array.isArray(bloco.cronologia.itens) ? bloco.cronologia.itens : []}
							title={bloco.cronologia.titulo || ''}
							classes={bloco.cronologia.classes || ''}
						/>
					{/key}
				{:else if typeof bloco === 'object' && (bloco.nome || (bloco.imagem && bloco.imagem.nome))}
					{#key i}
						{#await Promise.resolve(parseImagem(bloco)) then img}
							{@const _baseName = String(img.nome || '').replace(/\.(png|jpg|jpeg)$/i, '')}
							{@const _meta = imageMeta[img.nome]}
							{@const _hasAvif = !!(_meta && _meta.avif)}
							{@const _hasWebp = !!(_meta && _meta.webp)}
							<ImageBlock
								src={withBase(`/imgs/${img.nome}`, base)}
								nome_mobile={img.nome_mobile ? withBase(`/imgs/${img.nome_mobile}`, base) : ''}
								alt={img.nome}
								size={img.tamanho}
								caption={img.legenda}
								classes={img.classes}
								radius={img.radius}
								borda={img.radius}
								tags={img.tags}
								multiply={img.multiply}
								width={img.width || (_meta && _meta.width) || ''}
								height={img.height || (_meta && _meta.height) || ''}
								ratio={img.ratio || (_meta && _meta.ratio) || ''}
								srcset={img.srcset}
								sizes={img.sizes}
								webp={
									isProd && _hasWebp ? withBase(`/imgs/${img.webp || `${_baseName}.webp`}`, base) : ''
								}
								avif={
									isProd && _hasAvif ? withBase(`/imgs/${img.avif || `${_baseName}.avif`}`, base) : ''
								}
								sources={img.sources}
								priority={nextImagePriority()}
							/>
						{/await}
					{/key}
				{:else if typeof bloco === 'object' && bloco.slider}
					{#key i}
						{@const conf = bloco.slider}
						{@const dir = (conf.pasta || conf.dir || '').trim()}
						{@const size = (conf.tamanho || conf.size || '').trim()}
						{@const intervalMs = conf.tempo ? Math.max(200, Math.round(Number(conf.tempo) * 1000)) : 3000}
						<AutoScrollGallery
							dir={dir ? `imgs/${dir}` : 'imgs'}
							intervalMs={intervalMs}
							height={(conf.altura || conf.height || '').trim()}
							background={(conf.fundo || conf.bg || '').trim()}
							size={size}
							classes={conf.classes}
							gap={(conf.espaco || conf['espaço'] || conf.gap || conf.gutter) ? Number(String(conf.espaco || conf['espaço'] || conf.gap || conf.gutter).replace(/px$/,'').trim()) : undefined}
							pdfAsImage={true}
							padding={(conf.padding || '').trim()}
							paddingTop={(conf['padding-top'] || conf.paddingtop || '').trim()}
							paddingBottom={(conf['padding-bottom'] || conf.paddingbottom || '').trim()}
						/>
					{/key}
				{:else if typeof bloco === 'object' && bloco.video}
					{#key i}
						{#await Promise.resolve(parseVideo(bloco.video || bloco)) then vid}
							<VideoBlock
								src={withBase(`/videos/${vid.nome || vid.name}`, base)}
								sources={vid.sources
									? Array.isArray(vid.sources)
										? vid.sources.map((s) =>
												s.startsWith('http') ? s : withBase(`/videos/${s}`, base)
											)
										: String(vid.sources)
												.split(',')
												.map((s) => s.trim())
												.filter(Boolean)
												.map((s) => (s.startsWith('http') ? s : withBase(`/videos/${s}`, base)))
									: []}
								size={vid.tamanho || vid.size || 'M'}
								caption={vid.legenda || vid.caption || ''}
								classes={vid.classes}
								radius={vid.radius || vid.borda}
								tags={vid.tags}
							/>
						{/await}
					{/key}
				{:else if typeof bloco === 'object' && bloco.scrollerVideo}
					{#key i}
						{@const conf = bloco.scrollerVideo}
						{@const file = conf.video || conf.nome || conf.src || ''}
						{@const _extMatch = String(file).match(/\.([a-z0-9]+)$/i)}
						{@const _ext = _extMatch ? _extMatch[1] : ''}
						{@const _base = _ext ? String(file).slice(0, -(_ext.length + 1)) : String(file)}
						{@const fileMobile = conf['video-mobile'] || conf.mobile || conf.nome_mobile || (_base ? `${_base}-mobile${_ext ? `.${_ext}` : ''}` : '')}
						{@const fileDesktop = conf['video-desktop'] || conf.desktop || conf.nome_desktop || (_base ? `${_base}-desktop${_ext ? `.${_ext}` : ''}` : '')}
						{@const guide = conf.guia !== undefined ? !!conf.guia : true}
						{@const height = conf.altura || conf.scroll || '300vh'}
						{@const texts = conf.passos && Array.isArray(conf.passos)
							? conf.passos.map((p) => ({
								at: parseFloat(p.posicao || p.at || 0),
								text: p.texto || p.text || '',
								class: p.classe || p.class || ''
							}))
							: Array.isArray(conf.textos)
							? conf.textos
							: conf.texto
								? Array.isArray(conf.texto)
									? conf.texto
									: [conf.texto]
								: []}
						<ScrollerVideo
							src={withBase(`/videos/${file}`, base)}
							srcMobile={fileMobile ? withBase(`/videos/${fileMobile}`, base) : ''}
							srcDesktop={fileDesktop ? withBase(`/videos/${fileDesktop}`, base) : ''}
							size={(conf.tamanho || conf.size || 'M')}
							texts={texts}
							showGuide={guide}
							height={height}
							objectFit={conf.fit || conf.objectfit || 'cover'}
							ease={conf.ease !== undefined ? Number(conf.ease) : undefined}
							offsetTop={conf.top ? Number(conf.top) : 0}
							vhPerSecond={conf.vhpersecond ? Number(conf.vhpersecond) : conf.vhps ? Number(conf.vhps) : undefined}
							fps={conf.fps ? Number(conf.fps) : undefined}
							pxPerFrame={(conf.pxperframe ? Number(conf.pxperframe) : (conf.ppf ? Number(conf.ppf) : undefined))}
							windowSize={conf.windowsize ? Number(conf.windowsize) : conf.janela ? Number(conf.janela) : undefined}
							travelVh={conf.travelvh ? Number(conf.travelvh) : undefined}
							overlayVAlign={(conf.overlay || conf.alinhamento || conf.valign || '').toLowerCase() || undefined}
							showVignette={conf.vignette !== undefined ? !!conf.vignette : conf.vinheta !== undefined ? !!conf.vinheta : undefined}
							speedVh={conf.speedvh ? Number(conf.speedvh) : 100}
							maxStepSec={(conf.maxstepsec ? Number(conf.maxstepsec) : (conf.maxstep ? Number(conf.maxstep) : undefined))}
							preloadMode={conf.preload ? String(conf.preload) : undefined}
						/>
					{/key}
				{:else if blocoStr.match(/^imagem: ([^,]+)(?:,\s*([PMG]{1,2}|GG))?(?:,\s*(.+))?$/i)}
					{#key i}
						{#await Promise.resolve(parseImagem(bloco)) then img}
							{@const _baseName2 = String(img.nome || '').replace(/\.(png|jpg|jpeg)$/i, '')}
							{@const _meta2 = imageMeta[img.nome]}
							{@const _hasAvif2 = !!(_meta2 && _meta2.avif)}
							{@const _hasWebp2 = !!(_meta2 && _meta2.webp)}
							<ImageBlock
								src={withBase(`/imgs/${img.nome}`, base)}
								alt={img.nome}
								size={img.tamanho}
								caption={img.legenda}
								classes={img.classes}
								radius={img.radius}
								tags={img.tags}
								multiply={img.multiply}
								width={img.width || (_meta2 && _meta2.width) || ''}
								height={img.height || (_meta2 && _meta2.height) || ''}
								ratio={img.ratio || (_meta2 && _meta2.ratio) || ''}
								srcset={img.srcset}
								sizes={img.sizes}
								webp={
									isProd && _hasWebp2
										? withBase(`/imgs/${img.webp || `${_baseName2}.webp`}`, base)
										: ''
								}
								avif={
									isProd && _hasAvif2
										? withBase(`/imgs/${img.avif || `${_baseName2}.avif`}`, base)
										: ''
								}
								sources={img.sources}
								priority={nextImagePriority()}
							/>
						{/await}
					{/key}
				{:else if blocoStr.match(/^video: ([^,]+)(?:,\s*([PMG]{1,2}|GG))?(?:,\s*(.+))?$/i)}
					{#key i}
						{#await Promise.resolve(parseVideo(bloco)) then vid}
							<VideoBlock
								src={withBase(`/videos/${vid.nome}`, base)}
								sources={vid.sources
									? Array.isArray(vid.sources)
										? vid.sources.map((s) =>
												s.startsWith('http') ? s : withBase(`/videos/${s}`, base)
											)
										: String(vid.sources)
												.split(',')
												.map((s) => s.trim())
												.filter(Boolean)
												.map((s) => (s.startsWith('http') ? s : withBase(`/videos/${s}`, base)))
									: []}
								size={vid.tamanho}
								caption={vid.legenda}
								classes={vid.classes}
								radius={vid.radius}
								tags={vid.tags}
							/>
						{/await}
					{/key}
				{:else}
					<Text
						value={{
							body: Array.isArray(bloco)
								? bloco
								: typeof bloco === 'string'
									? bloco.split(/\n+/)
									: ['']
						}}
					/>
					{#if typeof bloco === 'string' && obj.tags && obj.tags.length}
						<div class="inline-tags">
                        <div class="inline-tags__label">What I did:</div>
                    <div class="inline-tags__chips">
                        {#each obj.tags as t (t)}
                            <span class="chip">{t}</span>
                        {/each}
                    </div>
						</div>
					{/if}
				{/if}
			{/if}
		{/if}
	{/each}
{:else}
	<!-- Fallback: show page name when available -->
	<!-- <div style="color: orange; text-align: center; padding: 2rem;">Nenhum conteúdo encontrado para a página <b>{usedCurrentPage}</b>.</div> -->
{/if}

<style>
  /* Inline, non-interactive tag chips displayed after text blocks */
  .inline-tags {
    width: calc(100% - (var(--grid) * 4));
    max-width: calc(var(--grid) * 50);
    margin: calc(var(--grid) * -3.5) auto calc(var(--grid) * 4) auto; /* pull closer to the paragraph above */
  }
  .inline-tags__label {
    font-family: var(--font-primary);
    font-size: calc(var(--grid) * 1.2);
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--color-dark);
    background: color-mix(in srgb, var(--color-tertiary) 92%, transparent);
    padding: 0.2rem 0.45rem 0.15rem;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    margin-bottom: calc(var(--grid) * 1);
    text-transform: uppercase;
    opacity: 1;
  }
  .inline-tags__chips {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--grid) * 0.5);
  }
  .chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.30rem 0.50rem 0.20rem; /* top slightly larger to visually center on iOS */
    border-radius: 999px;
    background: var(--color-primary); /* dark blue */
    color: #fff; /* white text */
    font-family: var(--font-primary);
    font-weight: 700;
    font-size: calc(var(--grid) * 0.95); /* smaller text */
    line-height: 1.12; /* improves vertical balance on iOS */
    text-transform: uppercase;
    letter-spacing: 0.06em; /* increased spacing */
    border: 1px solid color-mix(in srgb, #000 12%, transparent);
    box-shadow: none;
    vertical-align: middle;
  }
</style>
