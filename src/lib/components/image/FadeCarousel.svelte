<script>
	import { onMount, onDestroy } from 'svelte';
	import { resolve } from '$app/paths';

	// Directory under static (e.g., 'imgs/galeria1' or '/imgs/galeria1')
	export let dir = '';
	// Interval between image changes (ms)
	export let intervalMs = 3000;
	// Fade duration between images (ms)
	export let fadeMs = 1000;
	// Component height (CSS string). Example: '420px', '50vh'. If empty, height adapts to content.
	export let height = '';
	// Optional background color
	export let background = '';
	// Optional size keyword for max-width presets (PP,P,M,G,GG). Defaults to full width when empty.
	export let size = '';
	// Extra classes applied to wrapper
	export let classes = '';

	let error = '';
	/** @type {Array<{ url: string, name: string, width?: number, height?: number }>} */
	let items = [];
	let currentIdx = 0;
	let timer = null;
	let hasFocus = true;
	let naturalSizes = new Map();
	let aspectRatio = '';
	let rootEl;
	let visibilityObserver = null;
	let isInView = false;
	let hasLoaded = false;
	let isLoading = false;
	let hasShown = false;

	$: sizeClass =
		size === 'PP'
			? 'img-pp'
			: size === 'P'
				? 'img-p'
				: size === 'M'
					? 'img-m'
					: size === 'G'
						? 'img-g'
						: size === 'GG'
							? 'img-gg'
							: '';

	$: normalizedDir = (() => {
		let d = String(dir || '').trim();
		if (!d) return '';
		if (d.startsWith('imgs')) d = '/' + d;
		if (!d.startsWith('/')) d = '/' + d;
		return d.replace(/\/+$/, '');
	})();

	$: manifestUrl = normalizedDir ? resolve(`${normalizedDir}/manifest.json`) : '';
	$: safeFade = Math.max(200, Number(fadeMs) || 600);
	$: safeInterval = Math.max(safeFade + 200, Number(intervalMs) || 3000);
	$: aspectRatio = getAspectRatio(currentIdx) || getAspectRatio(0) || '';

	async function ensureLoaded() {
		if (hasLoaded || isLoading) return;
		isLoading = true;
		if (!normalizedDir) {
			error = 'Defina a propriedade dir (ex.: "imgs/galeria").';
			isLoading = false;
			return;
		}
		await loadManifest();
		if (hasFocus && isInView) start();
		hasLoaded = true;
		isLoading = false;
	}

	onMount(() => {
		const onVis = () => {
			hasFocus = document.visibilityState === 'visible';
			if (!hasFocus) stop();
			else if (isInView) start();
		};
		document.addEventListener('visibilitychange', onVis);

		if (typeof window !== 'undefined' && rootEl) {
			visibilityObserver = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							isInView = true;
							hasShown = true;
							ensureLoaded();
							if (hasLoaded && hasFocus) start();
						} else {
							isInView = false;
							stop();
						}
					}
				},
				{
					root: null,
					rootMargin: '200px',
					threshold: 0.1
				}
			);
			visibilityObserver.observe(rootEl);
		} else if (!normalizedDir) {
			error = 'Defina a propriedade dir (ex.: "imgs/galeria").';
		}

		return () => document.removeEventListener('visibilitychange', onVis);
	});

	onDestroy(() => {
		stop();
		if (visibilityObserver) visibilityObserver.disconnect();
	});

	async function loadManifest() {
		error = '';
		items = [];
		try {
			const res = await fetch(manifestUrl, { headers: { 'cache-control': 'no-cache' } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			const rawList = Array.isArray(data) ? data : Array.isArray(data.files) ? data.files : [];
			const list = rawList
				.map((entry) => (typeof entry === 'string' ? { name: entry } : entry))
				.filter((entry) => entry && entry.name);
			if (!list.length) {
				error = 'manifest.json vazio. Gere a lista de arquivos.';
				return;
			}
			const allowed = list
				.map((entry) => ({
					name: String(entry.name),
					width: Number(entry.width) || 0,
					height: Number(entry.height) || 0
				}))
				.filter((entry) => /\.(jpe?g|png|webp|avif|svg)$/i.test(entry.name))
				.map((entry) => {
					const extMatch = entry.name.match(/\.([a-z0-9]+)$/i);
					const ext = (extMatch ? extMatch[1] : '').toLowerCase();
					const base = ext ? entry.name.slice(0, -(ext.length + 1)) : entry.name;
					return { name: entry.name, base, ext, width: entry.width, height: entry.height };
				});

			// Prefer a single entry per base name; priority by extension (png first)
			const order = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'svg'];
			const byBase = new Map();
			for (const it of allowed) {
				const curr = byBase.get(it.base);
				if (!curr) {
					byBase.set(it.base, it);
					continue;
				}
				const a = order.indexOf(it.ext);
				const b = order.indexOf(curr.ext);
				if ((a !== -1 ? a : 999) < (b !== -1 ? b : 999)) {
					byBase.set(it.base, it);
				}
			}

			const chosen = Array.from(byBase.values());
			items = chosen.map(({ name, width, height }) => {
				const enc = encodeURIComponent(name);
				const url = resolve(`${normalizedDir}/${enc}`);
				return { url, name, width, height };
			});
			currentIdx = 0;
			naturalSizes = new Map();
		} catch (e) {
			error = `Não foi possível carregar ${manifestUrl}. Crie um manifest.json nessa pasta.`;
		}
	}

	function getAspectRatio(idx) {
		const it = items[idx];
		if (!it) return '';
		const w = Number(it.width) || Number(naturalSizes.get(idx)?.width) || 0;
		const h = Number(it.height) || Number(naturalSizes.get(idx)?.height) || 0;
		if (w > 0 && h > 0) return `${w} / ${h}`;
		return '';
	}

	function start() {
		if (timer || !hasFocus || !isInView || items.length < 2) return;
		timer = setInterval(() => {
			currentIdx = (currentIdx + 1) % items.length;
		}, safeInterval);
	}

	function stop() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}
</script>

<div
	bind:this={rootEl}
	class={`fade-carousel ${sizeClass} ${classes || ''}`.trim()}
	class:show={hasShown}
	style={`--fade-ms:${safeFade}ms;${height ? `height:${height};` : ''}${
		background ? `background:${background};` : ''
	}`}
>
	{#if error}
		<div class="error">{error}</div>
	{:else if items.length}
		<div class="frame" style={`${aspectRatio ? `aspect-ratio:${aspectRatio};` : ''}`}>
			{#each items as item, idx (item.url)}
				<img
					src={item.url}
					alt={item.name || 'carousel image'}
					class:active={idx === currentIdx}
					style={`z-index:${idx === currentIdx ? 2 : 1};`}
					loading="eager"
					decoding="async"
					on:load={(e) => {
						const w = e.currentTarget?.naturalWidth || 0;
						const h = e.currentTarget?.naturalHeight || 0;
						if (w && h && !naturalSizes.has(idx)) {
							naturalSizes.set(idx, { width: w, height: h });
						}
					}}
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.fade-carousel {
		width: calc(100% - (var(--grid) * 4));
		margin: 0 auto calc(var(--grid) * 6) auto;
		opacity: 0;
		transition: opacity 600ms ease;
	}
	.fade-carousel.show {
		opacity: 1;
	}
	.fade-carousel .frame {
		position: relative;
		width: 100%;
		background: color-mix(in srgb, var(--color-dark) 4%, transparent);
		border-radius: 8px;
		overflow: hidden;
	}
	.fade-carousel[style*='height'] .frame {
		height: 100%;
	}
	.fade-carousel img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0;
		transition: opacity var(--fade-ms) ease-in-out;
		will-change: opacity;
	}
	.fade-carousel img.active {
		opacity: 1;
	}
	.fade-carousel.img-pp {
		max-width: 250px;
	}
	.fade-carousel.img-p {
		max-width: 450px;
	}
	.fade-carousel.img-m {
		max-width: 640px;
	}
	.fade-carousel.img-g {
		max-width: 875px;
	}
	.fade-carousel.img-gg {
		max-width: 100vw;
		border-radius: 0;
	}
	@media (max-width: 600px) {
		.fade-carousel {
			width: calc(100% - (var(--grid) * 4));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fade-carousel img {
			transition: none;
		}
	}
	.fade-carousel .error {
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 1.4);
		color: #b00;
	}
</style>
