<script>
	import { base } from '$app/paths';
	import ArchieRenderer from '$lib/components/ArchieRenderer.svelte';
	import pages from '$lib/archiePages.json';
	import imageMeta from '$lib/imageMeta.json';
	import { normalizeParsedToBlocks, buildBlockObjects } from '$lib/parsers/content.js';
	import { parseImage as parseImageHelper } from '$lib/parsers/image.js';
	import { withBase } from '$lib/paths.js';
	const isProd = import.meta.env && import.meta.env.PROD;

	// Find first image on index to preload as LCP
	let lcpHref = '';
	let lcpImagesrcset = '';
	let lcpImagesizes = '';
	{
		try {
			const raw = pages.index?.content || '';
			const usedParsed = raw
				? {
						orderedContent: String(raw)
							.split(/\n\n+/)
							.map((s) => s.trim())
							.filter(Boolean)
					}
				: null;
			const blocks = usedParsed ? normalizeParsedToBlocks(usedParsed) : [];
			const objs = buildBlockObjects(blocks);
			for (const o of objs) {
				const bloco = o.raw;
				if (typeof bloco === 'object' && (bloco.nome || (bloco.imagem && bloco.imagem.nome))) {
					const img = parseImageHelper(bloco);
					if (img && img.nome) {
						const baseName = String(img.nome).replace(/\.(png|jpg|jpeg)$/i, '');
						const meta = imageMeta[img.nome];
						const hasAvif = !!(meta && meta.avif);
						const hasWebp = !!(meta && meta.webp);
						// Prefer AVIF, then WebP, then original
						if (isProd) {
							const avif = hasAvif ? withBase(`/imgs/${baseName}.avif`, base) : '';
							const webp = hasWebp ? withBase(`/imgs/${baseName}.webp`, base) : '';
							lcpHref = avif || webp || withBase(`/imgs/${img.nome}`, base);
						} else {
							lcpHref = withBase(`/imgs/${img.nome}`, base);
						}
						lcpImagesrcset = '';
						lcpImagesizes = '(max-width: 860px) 100vw, 860px';
						break;
					}
				} else if (typeof bloco === 'string' && /^imagem:/i.test(bloco)) {
					const img = parseImageHelper(bloco);
					if (img && img.nome) {
						const baseName = String(img.nome).replace(/\.(png|jpg|jpeg)$/i, '');
						const meta = imageMeta[img.nome];
						const hasAvif = !!(meta && meta.avif);
						const hasWebp = !!(meta && meta.webp);
						if (isProd) {
							const avif = hasAvif ? withBase(`/imgs/${baseName}.avif`, base) : '';
							const webp = hasWebp ? withBase(`/imgs/${baseName}.webp`, base) : '';
							lcpHref = avif || webp || withBase(`/imgs/${img.nome}`, base);
						} else {
							lcpHref = withBase(`/imgs/${img.nome}`, base);
						}
						lcpImagesrcset = '';
						lcpImagesizes = '(max-width: 860px) 100vw, 860px';
						break;
					}
				}
			}
		} catch {
			// ignore
		}
	}

	// Background color now controlled by {fundo} blocks via ScrollBg component
</script>

<svelte:head>
	{#if lcpHref}
		<link
			rel="preload"
			as="image"
			href={lcpHref}
			imagesrcset={lcpImagesrcset}
			imagesizes={lcpImagesizes}
		/>
	{/if}
</svelte:head>

<ArchieRenderer {base} />
