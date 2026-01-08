<script>
	import Title from '$lib/components/heading/Title.svelte';
	import H1 from '$lib/components/heading/H1.svelte';
	import H2 from '$lib/components/heading/H2.svelte';
	import H3 from '$lib/components/heading/H3.svelte';
	import H4 from '$lib/components/heading/H4.svelte';
	import H5 from '$lib/components/heading/H5.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Text from '$lib/components/text/Text.svelte';
	import EmbedWrapper from '$lib/components/embed/EmbedWrapper.svelte';
	import PdfViewer from '$lib/components/image/PdfViewer.svelte';
	import Ai2Html from '$lib/components/image/Ai2Html.svelte';
	import ImageBlock from '$lib/components/image/ImageBlock.svelte';
	import VideoBlock from '$lib/components/video/VideoBlock.svelte';
	import ScrollerVideo from '$lib/components/ScrollerVideo.svelte';
	import AutoScrollGallery from '$lib/components/image/AutoScrollGallery.svelte';
	import FadeCarousel from '$lib/components/image/FadeCarousel.svelte';
    import ScrollBg from '$lib/components/ScrollBg.svelte';
	import LazyMount from '$lib/components/LazyMount.svelte';
	import TagSelector from '$lib/components/TagSelector.svelte';
	import InlineTags from '$lib/components/InlineTags.svelte';

	import { archiePages } from '$lib/stores';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { fade } from 'svelte/transition';
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
	const fadeIn = { duration: 220 };
	const fadeOut = { duration: 160 };
	const noFade = { duration: 0 };
	let enableFilterFade = false;
	let _lastFilter = '';

	$: if (localSelectedTag !== _lastFilter) {
		_lastFilter = localSelectedTag;
		enableFilterFade = true;
	}

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

	function parseDurationMs(value, fallbackMs) {
		const raw = String(value || '').trim().toLowerCase();
		if (!raw) return fallbackMs;
		if (/ms$/.test(raw)) {
			const ms = Number(raw.replace(/ms$/, '').trim());
			return Number.isFinite(ms) ? Math.max(200, Math.round(ms)) : fallbackMs;
		}
		if (/s$/.test(raw)) {
			const s = Number(raw.replace(/s$/, '').trim());
			return Number.isFinite(s) ? Math.max(200, Math.round(s * 1000)) : fallbackMs;
		}
		const n = Number(raw);
		return Number.isFinite(n) ? Math.max(200, Math.round(n * 1000)) : fallbackMs;
	}

	// annotate blocks: mark whether they appear after a selector (so filtering only affects blocks after it)
	$: annotatedBlocks = annotateBlocks(blockObjects);

	function parseImagem(bloco) {
		return parseImageHelper(bloco);
	}

	function parseVideo(bloco) {
		return parseVideoHelper(bloco);
	}

	function fixLinks(html, basePath) {
		if (!basePath) return html;
		return String(html).replace(/href=['"]\/(?!\/)([^'"#?]*)['"]/g, `href='${basePath}/$1'`);
	}

	function injectInlineLogo(html, basePath) {
		if (!html) return html;
		const logoSrc = basePath ? `${basePath}/imgs/fabio_sales.svg` : '/imgs/fabio_sales.svg';
		return String(html).replace(
			/<strong>\s*Fabio\s+Sales(\.)?\s*<\/strong>/gi,
			(_, dot) =>
				`<span class="inline-logo" role="img" aria-label="Fabio Sales" style="--inline-logo-url: url('${logoSrc}')">Fabio Sales</span>` +
				(dot ? '.' : '')
		);
	}

	function sanitizeHeadingHtml(html) {
		if (!html) return '';
		return String(html)
			.replace(/\son[a-z]+\s*=\s*(["']).*?\1/gi, '')
			.replace(/(href|src)=(['"])javascript:[^\2]*\2/gi, '$1="#"');
	}

	function renderIntroHtml(html) {
		return sanitizeHeadingHtml(injectInlineLogo(fixLinks(html, base), base));
	}

	function sameTags(a, b) {
		if (!Array.isArray(a) || !Array.isArray(b)) return false;
		if (a.length !== b.length) return false;
		const setA = new Set(a.map((t) => String(t).toLowerCase()));
		for (const t of b) {
			if (!setA.has(String(t).toLowerCase())) return false;
		}
		return true;
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
			{#if !localSelectedTag || obj.isAfterSelector}
				{#if !localSelectedTag || (obj.tags && obj.tags
							.map((t) => t.toLowerCase())
							.includes(localSelectedTag.toLowerCase()))}
				<div
					class="filtered-block"
					in:fade={enableFilterFade ? fadeIn : noFade}
					out:fade={enableFilterFade ? fadeOut : noFade}
				>
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
				{:else if blocoStr.match(/^<divisor\s*\/?>$/i) || blocoStr.match(/^<divisor\s*>\s*<\/divisor>$/i) || blocoStr.match(/^\{divisor\}$/i)}
					<Divider />
				{:else if blocoStr.match(/^titulo: (.+)$/i)}
					<Title value={blocoStr.replace(/^titulo: /i, '')} />
				{:else if blocoStr.match(/^embedWrapper: (.+)$/i)}
					<EmbedWrapper value={blocoStr.replace(/^embedWrapper: /i, '')} />
				{:else if blocoStr.match(/^pdf: (.+)$/i)}
					<PdfViewer value={blocoStr.replace(/^pdf: /i, '')} />
				{:else if blocoStr.match(/^ai2html: (.+)$/i)}
					<Ai2Html dir={withBase(`/ai2html/${blocoStr.replace(/^ai2html: /i, '')}/ai2html-output`, base)} />
				{:else if typeof bloco === 'object' && bloco.fundo}
					{#key i}
						<ScrollBg
							color={(bloco.fundo.cor || bloco.fundo.color || bloco.fundo.bg || '').trim() || 'var(--color-light)'}
							height={(bloco.fundo.altura || bloco.fundo.height || bloco.fundo.vh || '').trim()}
						/>
					{/key}
				{:else if typeof bloco === 'object' && bloco.intro}
					{#key i}
						{@const conf = bloco.intro}
						{#if conf.fundo1}
							<ScrollBg
								color={String(conf.fundo1 || '').trim() || 'var(--color-light)'}
								height={String(conf.altura1 || '').trim()}
							/>
						{/if}
						{#if conf.texto1}
							<h1 class="intro-paragraph text-m intro-animated intro-h1">
								{@html renderIntroHtml(conf.texto1)}
							</h1>
						{/if}
						{#if conf.fundo2}
							<ScrollBg
								color={String(conf.fundo2 || '').trim() || 'var(--color-light)'}
								height={String(conf.altura2 || '').trim()}
							/>
						{/if}
						{#if conf.texto2}
							<h2 class="intro-paragraph text-m intro-animated">
								{@html renderIntroHtml(conf.texto2)}
							</h2>
						{/if}
					{/key}
				{:else if typeof bloco === 'object' && bloco.bloco}
					{#key i}
						{@const conf = bloco.bloco}
						{@const blocoTags = conf.tags && conf.tags.length ? conf.tags : obj.tags}
						<div
							class={`content-block ${conf.display && conf.display.toLowerCase() === 'flex' ? 'is-flex' : ''} ${conf.classes || ''}`}
							style={`${conf.display ? `display:${conf.display};` : ''}${conf.gap ? `gap:${conf.gap};` : ''}${conf.align ? `align-items:${conf.align};` : ''}`}
						>
							{#each conf.items || [] as item, bi (bi)}
								{#if item.type === 'image'}
									{#await Promise.resolve(parseImagem(item.data)) then img}
										{@const _baseName3 = String(img.nome || '').replace(/\.(png|jpg|jpeg)$/i, '')}
										{@const _meta3 = imageMeta[img.nome]}
										{@const _hasAvif3 = !!(_meta3 && _meta3.avif)}
										{@const _hasWebp3 = !!(_meta3 && _meta3.webp)}
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
											width={img.width || (_meta3 && _meta3.width) || ''}
											height={img.height || (_meta3 && _meta3.height) || ''}
											ratio={img.ratio || (_meta3 && _meta3.ratio) || ''}
											srcset={img.srcset}
											sizes={img.sizes}
											webp={
												isProd && _hasWebp3
													? withBase(`/imgs/${img.webp || `${_baseName3}.webp`}`, base)
													: ''
											}
											avif={
												isProd && _hasAvif3
													? withBase(`/imgs/${img.avif || `${_baseName3}.avif`}`, base)
													: ''
											}
											sources={img.sources}
											priority={nextImagePriority()}
										/>
									{/await}
								{:else if item.type === 'video'}
									{#await Promise.resolve(parseVideo(item.data.video || item.data)) then vid}
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
								{:else if item.type === 'text'}
									<Text
										value={{
											body: String(item.text || '')
												.split(/\n+/)
												.map((s) => s.trim())
												.filter(Boolean)
										}}
									/>
								{:else if item.type === 'heading'}
									{#if item.level === 1}
										<H1 value={item.text || ''} />
									{:else if item.level === 2}
										<H2 value={item.text || ''} />
									{:else if item.level === 3}
										<H3 value={item.text || ''} />
									{:else if item.level === 4}
										<H4 value={item.text || ''} />
									{:else if item.level === 5}
										<H5 value={item.text || ''} />
									{:else}
										<Text
											value={{
												body: String(item.text || '')
													.split(/\n+/)
													.map((s) => s.trim())
													.filter(Boolean)
											}}
										/>
									{/if}
								{/if}
							{/each}
							{#if blocoTags && blocoTags.length}
								<InlineTags tags={blocoTags} />
							{/if}
						</div>
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
							{#if obj.tags && obj.tags.length}
								{#if !annotatedBlocks[i + 1] || !sameTags(obj.tags, annotatedBlocks[i + 1].tags)}
									<InlineTags tags={obj.tags} />
								{/if}
							{/if}
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
				{:else if typeof bloco === 'object' && bloco.carrossel}
					{#key i}
						{@const conf = bloco.carrossel}
						{@const dir = (conf.pasta || conf.dir || '').trim()}
						{@const size = (conf.tamanho || conf.size || '').trim()}
						{@const intervalMs = parseDurationMs(conf.tempo, 3000)}
						{@const fadeMs = parseDurationMs(conf.fade || conf.transicao || conf['transição'], 600)}
						<FadeCarousel
							dir={dir ? `imgs/${dir}` : 'imgs'}
							intervalMs={intervalMs}
							fadeMs={fadeMs}
							height={(conf.altura || conf.height || '').trim()}
							background={(conf.fundo || conf.bg || '').trim()}
							size={size}
							classes={conf.classes}
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
							{#if obj.tags && obj.tags.length}
								{#if !annotatedBlocks[i + 1] || !sameTags(obj.tags, annotatedBlocks[i + 1].tags)}
									<InlineTags tags={obj.tags} />
								{/if}
							{/if}
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
							{#if obj.tags && obj.tags.length}
								{#if !annotatedBlocks[i + 1] || !sameTags(obj.tags, annotatedBlocks[i + 1].tags)}
									<InlineTags tags={obj.tags} />
								{/if}
							{/if}
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
							{#if obj.tags && obj.tags.length}
								{#if !annotatedBlocks[i + 1] || !sameTags(obj.tags, annotatedBlocks[i + 1].tags)}
									<InlineTags tags={obj.tags} />
								{/if}
							{/if}
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
				{/if}
				</div>
				{/if}
			{/if}
		{/if}
	{/each}
{:else}
	<!-- Fallback: show page name when available -->
	<!-- <div style="color: orange; text-align: center; padding: 2rem;">Nenhum conteúdo encontrado para a página <b>{usedCurrentPage}</b>.</div> -->
{/if}

<style>
	.filtered-block {
		width: 100%;
	}
	.content-block {
		width: 100%;
		display: block;
	}
	.content-block.is-flex {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
</style>
