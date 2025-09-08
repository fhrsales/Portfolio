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
	import { parseImage as parseImageHelper } from '$lib/parsers/image.js';
	import { parseVideo as parseVideoHelper } from '$lib/parsers/video.js';
	import { withBase } from '$lib/paths.js';
	import imageMeta from '$lib/imageMeta.json';
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
				<TagSelector
					bind:selected={localSelectedTag}
					tags={obj.selectorConfig && Array.isArray(obj.selectorConfig)
						? obj.selectorConfig
						: undefined}
				/>
			{/key}
		{:else}
			{@const bloco = obj.raw}
			{@const blocoStr = typeof bloco === 'string' ? bloco.trim() : ''}
			{#if !obj.isAfterSelector || !localSelectedTag || (obj.tags && obj.tags
						.map((t) => t.toLowerCase())
						.includes(localSelectedTag.toLowerCase()))}
				{#if blocoStr.match(/^titulo: (.+)$/i)}
					<Title value={blocoStr.replace(/^titulo: /i, '')} />
				{:else if blocoStr.match(/^embedWrapper: (.+)$/i)}
					<EmbedWrapper value={blocoStr.replace(/^embedWrapper: /i, '')} />
				{:else if blocoStr.match(/^pdf: (.+)$/i)}
					<PdfViewer value={blocoStr.replace(/^pdf: /i, '')} />
				{:else if blocoStr.match(/^ai2html: (.+)$/i)}
					<Ai2Html
						dir={withBase(`/ai2html/${blocoStr.replace(/^ai2html: /i, '')}/ai2html-output`, base)}
					/>
				{:else if typeof bloco === 'object' && (bloco.nome || (bloco.imagem && bloco.imagem.nome))}
					{#key i}
						{#await Promise.resolve(parseImagem(bloco)) then img}
							{@const _baseName = String(img.nome || '').replace(/\.(png|jpg|jpeg)$/i, '')}
							{@const _meta = imageMeta[img.nome]}
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
								webp={withBase(`/imgs/${img.webp || `${_baseName}.webp`}`, base)}
								avif={withBase(`/imgs/${img.avif || `${_baseName}.avif`}`, base)}
								sources={img.sources}
								priority={nextImagePriority()}
							/>
						{/await}
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
				{:else if blocoStr.match(/^imagem: ([^,]+)(?:,\s*([PMG]{1,2}|GG))?(?:,\s*(.+))?$/i)}
					{#key i}
						{#await Promise.resolve(parseImagem(bloco)) then img}
							{@const _baseName2 = String(img.nome || '').replace(/\.(png|jpg|jpeg)$/i, '')}
							{@const _meta2 = imageMeta[img.nome]}
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
								webp={withBase(`/imgs/${img.webp || `${_baseName2}.webp`}`, base)}
								avif={withBase(`/imgs/${img.avif || `${_baseName2}.avif`}`, base)}
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
				{/if}
			{/if}
		{/if}
	{/each}
{:else}
	<!-- Fallback: show page name when available -->
	<!-- <div style="color: orange; text-align: center; padding: 2rem;">Nenhum conteúdo encontrado para a página <b>{usedCurrentPage}</b>.</div> -->
{/if}
