<script>
	import { base } from '$app/paths';
	import ArchieRenderer from '$lib/components/ArchieRenderer.svelte';
	import pages from '$lib/archiePages.json';
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
						// Prefer AVIF, then WebP, then original
						if (isProd) {
							const avif = withBase(`/imgs/${baseName}.avif`, base);
							const webp = withBase(`/imgs/${baseName}.webp`, base);
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
						if (isProd) {
							const avif = withBase(`/imgs/${baseName}.avif`, base);
							const webp = withBase(`/imgs/${baseName}.webp`, base);
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

	// Enhance the first paragraph on the index page with width M and per-line/word animation
		onMount(() => {
			if (typeof window === 'undefined' || typeof document === 'undefined') return;
			const container = document.querySelector('.main-content');
			if (!container) return;

			function wrapWords(node) {
				// Avoid referencing NodeFilter directly to keep SSR/import safer
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

		function setupAndAnimate(p, { hero } = { hero: true }) {
			if (!p || p.dataset.introProcessed === '1') return true;
			p.dataset.introProcessed = '1';
			// Do NOT restructure DOM to avoid hydration mismatches; apply classes only
			// Both first and second paragraphs get hero treatment and width M
			p.classList.add('intro-paragraph', 'text-m');

			wrapWords(p);
			const words = Array.from(p.querySelectorAll('.word'));
			if (!words.length) return true;

			// compute lines by offsetTop
			const tops = words.map((w) => w.offsetTop);
			const uniqueTops = Array.from(new Set(tops)).sort((a, b) => a - b);
			const lineIndexByTop = new Map(uniqueTops.map((t, i) => [t, i]));

			const wordCounterByLine = new Map();
			for (const w of words) {
				const top = w.offsetTop;
				const lineIdx = lineIndexByTop.get(top) || 0;
				const pos = wordCounterByLine.get(lineIdx) || 0;
				wordCounterByLine.set(lineIdx, pos + 1);
				const lineDelay = 360; // slower narration pace per line
				const wordDelay = 90; // slower per word
				const totalDelay = lineIdx * lineDelay + pos * wordDelay;
				w.style.transitionDelay = `${totalDelay}ms`;
			}

			const reveal = () => {
				p.classList.add('reveal');
			};

			// Measure to aid vertical centering via CSS var (only for hero)
			const h = p.offsetHeight;
			p.style.setProperty('--intro-p-height', `${h}px`);

			// Ensure transitions apply: force a reflow, then reveal in next frame(s)
			// Initial reveal after two frames
			requestAnimationFrame(() => requestAnimationFrame(reveal));

			// Replay on scroll: toggle reveal when (re)entering/leaving viewport
			if (!p._introObserver && 'IntersectionObserver' in window) {
				const toggle = (visible) => {
					if (visible) p.classList.add('reveal');
					else p.classList.remove('reveal');
				};
				const io = new IntersectionObserver(
					(entries) => {
						for (const e of entries) {
							const vis = e.isIntersecting && e.intersectionRatio > 0.35;
							toggle(vis);
						}
					},
					{ threshold: [0, 0.2, 0.35, 0.6, 0.8] }
				);
				io.observe(p);
				p._introObserver = io;
				// Set initial state based on current visibility
				const r = p.getBoundingClientRect();
				const initialVisible = r.top < window.innerHeight * 0.65 && r.bottom > window.innerHeight * 0.15;
				toggle(initialVisible);
			}

			return true;
		}

		function tryInitOnce() {
			const allP = Array.from(container.querySelectorAll('p'));
			// pick first two substantial paragraphs
			const candidates = allP.filter((el) => (el.textContent || '').trim().length > 20).slice(0, 2);
			if (!candidates.length) return false;
			const first = candidates[0];
			const second = candidates[1];
			let ok = false;
			if (first) ok = setupAndAnimate(first, { hero: true }) || ok;
			if (second) {
				// reveal second on intersection (if not already visible)
				const processSecond = () => setupAndAnimate(second, { hero: true });
				const rect = second.getBoundingClientRect();
				const visible = rect.top < window.innerHeight && rect.bottom > 0;
				if (visible) {
					ok = processSecond() || ok;
				} else if ('IntersectionObserver' in window) {
					const io2 = new IntersectionObserver((entries) => {
						for (const e of entries) {
							if (e.isIntersecting) {
								processSecond();
								io2.disconnect();
								break;
							}
						}
					}, { threshold: 0.15 });
					io2.observe(second);
					ok = true;
				} else {
					ok = processSecond() || ok;
				}
			}
			return ok;
		}

		if (!tryInitOnce()) {
			// Content may render slightly after mount; observe DOM for a short window
			const start = Date.now();
			const mo = new MutationObserver(() => {
				if (tryInitOnce()) {
					mo.disconnect();
					return;
				}
				if (Date.now() - start > 5000) mo.disconnect();
			});
			mo.observe(container, { childList: true, subtree: true });
			// Also retry a couple times as backup
			setTimeout(tryInitOnce, 250);
			setTimeout(tryInitOnce, 1000);
			setTimeout(tryInitOnce, 3000);
		}
	});
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
