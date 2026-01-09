<script>
	import { base } from '$app/paths';
	import ArchieRenderer from '$lib/components/ArchieRenderer.svelte';
	import pages from '$lib/archiePages.json';
	import imageMeta from '$lib/imageMeta.json';
	import { normalizeParsedToBlocks, buildBlockObjects } from '$lib/parsers/content.js';
	import { parseImage as parseImageHelper } from '$lib/parsers/image.js';
	import { withBase } from '$lib/paths.js';
	import { onMount } from 'svelte';
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

	function runWhenIdle(fn, timeout = 1200) {
		if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
			window.requestIdleCallback(fn, { timeout });
		} else {
			setTimeout(fn, 200);
		}
	}

	function wrapWords(node) {
		const SHOW_TEXT = 4; // NodeFilter.SHOW_TEXT
		const FILTER_ACCEPT = 1; // NodeFilter.FILTER_ACCEPT
		const FILTER_REJECT = 2; // NodeFilter.FILTER_REJECT
		const walker = document.createTreeWalker(node, SHOW_TEXT, {
			acceptNode(n) {
				if (!n.nodeValue) return FILTER_REJECT;
				return /\S/.test(n.nodeValue) ? FILTER_ACCEPT : FILTER_REJECT;
			}
		});
		const textNodes = [];
		while (walker.nextNode()) textNodes.push(walker.currentNode);
		for (const tn of textNodes) {
			const parent = tn.parentNode;
			const parts = String(tn.nodeValue).split(/(\s+)/);
			const frag = document.createDocumentFragment();
			for (const part of parts) {
				if (!part) continue;
				if (/^\s+$/.test(part)) {
					frag.appendChild(document.createTextNode(part));
				} else {
					const span = document.createElement('span');
					span.className = 'word';
					span.textContent = part;
					frag.appendChild(span);
				}
			}
			parent.replaceChild(frag, tn);
		}
	}

	function setupIntro(el) {
		if (!el || el.dataset.introProcessed === '1') return true;
		el.dataset.introProcessed = '1';
		el.classList.add('intro-paragraph', 'text-m');

		runWhenIdle(() => {
			const logoSrc = base ? `${base}/imgs/fabio_sales.svg` : '/imgs/fabio_sales.svg';
			const logoTick = Date.now();
			el.querySelectorAll('.inline-logo').forEach((node) => {
				node.style.setProperty('--inline-logo-url', `url('${logoSrc}?v=${logoTick}')`);
			});
			wrapWords(el);
			const words = Array.from(el.querySelectorAll('.word'));
			if (!words.length) return;

			const tops = words.map((w) => w.offsetTop);
			const uniqueTops = Array.from(new Set(tops)).sort((a, b) => a - b);
			const lineIndexByTop = new Map(uniqueTops.map((t, i) => [t, i]));

			const wordCounterByLine = new Map();
			for (const w of words) {
				const top = w.offsetTop;
				const lineIdx = lineIndexByTop.get(top) || 0;
				const pos = wordCounterByLine.get(lineIdx) || 0;
				wordCounterByLine.set(lineIdx, pos + 1);
				const lineDelay = 360;
				const wordDelay = 90;
				const totalDelay = lineIdx * lineDelay + pos * wordDelay;
				w.style.transitionDelay = `${totalDelay}ms`;
			}

			const revealOnce = () => {
				if (el.dataset.introAnimated === '1') return;
				el.dataset.introAnimated = '1';
				el.classList.add('reveal');
			};

			const r = el.getBoundingClientRect();
			const initialVisible = r.top < window.innerHeight * 0.65 && r.bottom > window.innerHeight * 0.15;
			if (initialVisible) {
				requestAnimationFrame(() => requestAnimationFrame(revealOnce));
			}

			if (!el._introObserver && 'IntersectionObserver' in window) {
				const io = new IntersectionObserver(
					(entries) => {
						for (const e of entries) {
							const vis = e.isIntersecting && e.intersectionRatio > 0.35;
							if (vis) revealOnce();
						}
					},
					{ threshold: [0, 0.2, 0.35, 0.6, 0.8] }
				);
				io.observe(el);
				el._introObserver = io;
			}
		});
		return true;
	}

	onMount(() => {
		if (typeof window === 'undefined' || typeof document === 'undefined') return;
		const container = document.querySelector('.main-content');
		if (!container) return;

		function tryInitOnce() {
			let candidates = Array.from(container.querySelectorAll('.intro-animated'));
			if (!candidates.length) {
				const allP = Array.from(container.querySelectorAll('p'));
				candidates = allP.filter((el) => (el.textContent || '').trim().length > 20).slice(0, 2);
			}
			if (!candidates.length) return false;
			let ok = false;
			if (candidates[0]) ok = setupIntro(candidates[0]) || ok;
			if (candidates[1]) ok = setupIntro(candidates[1]) || ok;
			return ok;
		}

		if (!tryInitOnce()) {
			const start = Date.now();
			const mo = new MutationObserver(() => {
				if (tryInitOnce()) {
					mo.disconnect();
					return;
				}
				if (Date.now() - start > 5000) mo.disconnect();
			});
			mo.observe(container, { childList: true, subtree: true });
			setTimeout(tryInitOnce, 250);
			setTimeout(tryInitOnce, 1000);
			setTimeout(tryInitOnce, 3000);
		}
	});

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
