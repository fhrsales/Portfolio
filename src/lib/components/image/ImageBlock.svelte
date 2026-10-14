<script>
	import imageMeta from '$lib/imageMeta.json';
	/* eslint-disable svelte/no-reactive-literals, svelte/no-immutable-reactive-statements, svelte/no-reactive-reassign, svelte/infinite-reactive-loop */
	import { onMount, onDestroy } from 'svelte';

	export let src = '';
	export let srcset = '';
	export let sizes = '';
	export let nome_mobile = '';
	export let alt = '';
	export let caption = '';
	export let width = '';
	export let height = '';
	export let ratio = '';
	export let priority = false; // when true, treat as LCP: eager + high fetch priority
	export let decoding = 'async';
	export let size = 'M'; // P, M, G, GG
	export let shadow = false; // legacy: can be boolean or string (e.g. 'shadow-1')
	export let classes = ''; // new: space-separated classes or var(...) tokens
	export let radius = ''; // e.g. '8px' or '50%'
	export let tags = []; // array of tag strings (lowercase)
	export let multiply = false; // accept boolean or 'sim' or string token
	export let borda = ''; // alternative border radius from ArchieML (e.g. '8px')

	// optional modern formats / <picture> support
	export let webp = '';
	export let avif = '';
	export let sources = [];

	// Lazy-loading / in-viewport state
	let wrapperEl;
	let imgEl;
	// eslint-disable-next-line no-unused-vars
	let isIntersecting = false;
	let imgLoaded = false;
	// the first picture on a page is in the HTML from the start and shown at once, without waiting for scripts
	let currentSrc = priority ? src : '';
	// eslint-disable-next-line no-unused-vars
	let lastSrcChecked = '';
	// eslint-disable-next-line no-unused-vars
	let isMobile = false;
	let observer;
	let onResize;
	let preloaded = false;
	let inViewport = false;
	let show = priority; // when true, image opacity goes to 1
	let preloader;
	let prefetchObserver;
	let themeObserver;
	let isDarkTheme = false;
	let effectiveClasses = '';

	// Determina a classe CSS baseada no tamanho
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
							: 'img-m';

	// support multiple classes or a variable for shadow
	$: shadowClass = '';
	$: shadowStyle = '';
	$: mixBlendStyle = '';
	// eslint-disable-next-line no-unused-vars
	$: normalizedTags = Array.isArray(tags)
		? tags
		: typeof tags === 'string' && tags.trim()
			? tags
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean)
			: [];
	$: effectiveRadius = radius || borda || '';
	$: numericRatio = (() => {
		if (!ratio) return 0;
		const r = Number(String(ratio));
		return Number.isFinite(r) && r > 0 ? r : 0;
	})();

	// width over height, from the ratio or from the image's own measures: it caps the figure to the screen height
	$: fitRatio = numericRatio || (Number(width) > 0 && Number(height) > 0 ? +(Number(width) / Number(height)).toFixed(4) : 0);

	function defaultWidthForSize(sz) {
		switch (sz) {
			case 'PP':
				return 250;
			case 'P':
				return 500;
			case 'M':
				return 620;
			case 'G':
				return 860;
			case 'GG':
				return 1200;
			default:
				return 620;
		}
	}

	function defaultSizesForSize(sz) {
		const px = defaultWidthForSize(sz);
		// mobile: occupy viewport width; otherwise clamp to designed width
		return `(max-width: 600px) 100vw, ${px}px`;
	}

	function replaceExt(u, ext) {
		if (!u) return '';
		return u.replace(/\.(?:png|jpg|jpeg|webp|avif)(?:\?.*)?$/i, `.${ext}`);
	}

	function withMobileSuffix(u) {
		if (!u) return '';
		// Insert -m before extension if not already present
		return u.replace(/([^\/]+?)(\.(?:png|jpg|jpeg|webp|avif))(?:\?.*)?$/i, (m, name, ext) => {
			return /-m$/i.test(name) ? `${name}${ext}` : `${name}-m${ext}`;
		});
	}

	// A very wide strip (a timeline, a row of screens) is unreadable squeezed into a phone's width.
	// There it keeps a readable height and scrolls sideways instead, unless a phone-shaped
	// version of the file exists.
	const metaKey = (u) => String(u || '').split('/imgs/')[1] || '';
	$: mobileMeta = imageMeta[metaKey(nome_mobile || withMobileSuffix(src))];
	// the file's own measures, so the browser knows its shape before it arrives
	$: ownMeta = imageMeta[metaKey(src)];
	$: attrWidth = width || ownMeta?.width || (numericRatio ? defaultWidthForSize(size) : undefined);
	$: attrHeight =
		height ||
		ownMeta?.height ||
		(numericRatio ? Math.round(defaultWidthForSize(size) / numericRatio) : undefined);
	$: panorama = numericRatio >= 2.5 && (!mobileMeta || mobileMeta.ratio >= 2.5);

	// Derive mobile candidate: explicit prop or inferred from src using -m suffix
	$: mobileCandidate = panorama ? '' : nome_mobile || (src && mobileMeta ? withMobileSuffix(src) : '');

	// Build srcset for avif/webp using mobileCandidate when available
	$: computedSizes = sizes || (mobileCandidate ? defaultSizesForSize(size) : undefined);
	$: avifSrcset = (() => {
		if (!avif) return '';
		if (mobileCandidate) {
			const avifMobile = replaceExt(mobileCandidate, 'avif');
			return `${avifMobile} 600w, ${avif} 1200w`;
		}
		return avif;
	})();
	$: webpSrcset = (() => {
		if (!webp) return '';
		if (mobileCandidate) {
			const webpMobile = replaceExt(mobileCandidate, 'webp');
			return `${webpMobile} 600w, ${webp} 1200w`;
		}
		return webp;
	})();

	// explicit mobile variants for art direction with <picture>
	$: mobileAvif = mobileCandidate ? replaceExt(mobileCandidate, 'avif') : '';
	$: mobileWebp = mobileCandidate ? replaceExt(mobileCandidate, 'webp') : '';
	$: {
		shadowClass = '';
		shadowStyle = '';
		mixBlendStyle = '';
		effectiveClasses = typeof classes === 'string' ? classes.trim() : '';
		const source =
			typeof classes === 'string' && classes.trim()
				? classes.trim()
				: typeof shadow === 'string' && shadow.trim()
					? shadow.trim()
					: shadow
						? 'shadow-1'
						: '';
		const tokens = source.split(/\s+/).filter(Boolean);
		const classTokens = [];
		let varToken = '';
		for (const t of tokens) {
			if (/^var\(/i.test(t) || /^--[\w-]+$/.test(t)) {
				varToken = t;
			} else {
				classTokens.push(t);
			}
		}
		const isMultiplyVar =
			/^var\(--multiply\)$/i.test(varToken) || /^--multiply$/i.test(varToken);
		if (isDarkTheme && isMultiplyVar) {
			varToken = '';
			effectiveClasses = effectiveClasses
				.replace(/(^|\s)(?:var\(--multiply\)|--multiply)(?=\s|$)/gi, ' ')
				.trim();
		}
		shadowClass = classTokens.join(' ');
		if (!varToken && classTokens.includes('blend-multiply')) {
			shadowStyle = `mix-blend-mode: multiply;`;
		}
		if (varToken) {
			if (/^--[\w-]+$/.test(varToken)) varToken = `var(${varToken})`;
			// if varToken refers to 'multiply' or classTokens request blend, apply mix-blend-mode instead
			const wantsMultiply = /multiply/i.test(varToken) || classTokens.includes('blend-multiply');
			if (wantsMultiply) {
				shadowStyle = `mix-blend-mode: ${varToken};`;
			} else {
				shadowStyle = `box-shadow: ${varToken};`;
			}
		}
		// apply multiply prop: accept true, 'sim', 'yes', or a token/var(...) string
		if (multiply) {
			if (typeof multiply === 'string') {
				const m = multiply.trim().toLowerCase();
				if (m === 'sim' || m === 'true' || m === 'yes' || m === 'multiply') {
					mixBlendStyle = 'mix-blend-mode: multiply;';
				} else if (/^var\(|^--/.test(multiply)) {
					mixBlendStyle = `mix-blend-mode: ${multiply};`;
				}
			} else if (multiply === true) {
				mixBlendStyle = 'mix-blend-mode: multiply;';
			}
		} else {
			mixBlendStyle = '';
		}
	}

	// only apply visual classes (shadow, custom classes) when the image is shown
	// visual classes (shadow/custom) should be applied only after the fade-in completes
	let showVisuals = priority;
	let _visualsTimer;
	$: if (!show) {
		showVisuals = false;
		if (_visualsTimer) {
			clearTimeout(_visualsTimer);
			_visualsTimer = null;
		}
	}
	$: appliedClasses = showVisuals ? [shadowClass, effectiveClasses].filter(Boolean).join(' ') : '';
	// Classes that change the layout apply at once; the visual ones above wait for the fade,
	// otherwise the figure is laid out one way and then jumps to another.
	$: layoutClasses = effectiveClasses
		.split(/\s+/)
		.filter((name) => name === 'legenda-lado')
		.join(' ');
	// removed fade transition imports to disable fade-in effect

	function getResponsiveSrcSync() {
		if (typeof window !== 'undefined') {
			const mobile = window.matchMedia('(max-width: 600px)').matches;
			isMobile = mobile;
			if (mobile && !panorama) {
				if (nome_mobile) return nome_mobile;
				// only ask for a -m file the site actually has (an SVG never has one)
				if (src && mobileMeta) {
					const dotIndex = src.lastIndexOf('.');
					if (dotIndex !== -1) {
						return `${src.slice(0, dotIndex)}-m${src.slice(dotIndex)}`;
					}
				}
			}
		}
		return src;
	}

	// A phone-sized file (`name-m.ext`) is assumed to exist; when it does not, show the full image.
	let mobileMissing = false;
	function useFullImage() {
		if (currentSrc && currentSrc !== src) {
			mobileMissing = true;
			currentSrc = src;
		}
	}

	function updateSrc() {
		const srcToUse = mobileMissing ? src : getResponsiveSrcSync();
		lastSrcChecked = srcToUse;
		currentSrc = srcToUse;
	}

	onMount(() => {
		// the priority picture keeps the file the browser already chose from srcset
		if (!priority) updateSrc();
		if (typeof window !== 'undefined') {
			isDarkTheme = document.documentElement.classList.contains('theme-dark');
			themeObserver = new MutationObserver(() => {
				isDarkTheme = document.documentElement.classList.contains('theme-dark');
			});
			themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
			let _resizeTimer;
			onResize = () => {
				if (_resizeTimer) clearTimeout(_resizeTimer);
				_resizeTimer = setTimeout(() => updateSrc(), 120);
			};
			window.addEventListener('resize', onResize);
		}
		// create a prefetch observer that starts the preload a bit earlier
		if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
			prefetchObserver = new IntersectionObserver(
				(entries) => {
					for (const e of entries) {
						if (e.isIntersecting) {
							// start preloading in background
							try {
								preloader = new Image();
								preloader.src = getResponsiveSrcSync();
								preloader.onload = () => {
									preloaded = true;
								};
								preloader.onerror = () => {
									preloaded = true;
								};
							} catch {
								preloaded = false;
							}
							if (prefetchObserver) {
								prefetchObserver.disconnect();
								prefetchObserver = null;
							}
							break;
						}
					}
				},
				{ rootMargin: '400px', threshold: 0 }
			);
			if (wrapperEl) prefetchObserver.observe(wrapperEl);

			// observe actual viewport entry to trigger display
			observer = new IntersectionObserver(
				(entries) => {
					for (const e of entries) {
						if (e.isIntersecting) {
							inViewport = true;
							if (observer) {
								observer.disconnect();
								observer = null;
							}
						}
					}
				},
				{ rootMargin: '0px', threshold: 0.08 }
			);
			if (wrapperEl) observer.observe(wrapperEl);
		} else {
			// Fallback: immediately preload and mark in viewport
			try {
				preloader = new Image();
				preloader.src = getResponsiveSrcSync();
				currentSrc = getResponsiveSrcSync();
				preloader.onload = () => {
					preloaded = true;
				};
				preloader.onerror = () => {
					preloaded = true;
				};
			} catch {
				preloaded = false;
			}
			inViewport = true;
		}
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
		if (prefetchObserver) prefetchObserver.disconnect();
		if (themeObserver) themeObserver.disconnect();
		if (typeof window !== 'undefined') {
			// remove both direct and debounced listeners
			try {
				window.removeEventListener('resize', updateSrc);
			} catch {
				/* ignore */
			}
			try {
				window.removeEventListener('resize', onResize);
			} catch {
				/* ignore */
			}
		}
	});

	// when image has loaded and the element is in viewport, show it (trigger opacity)
	let _showTimeout;
	$: {
		// clear existing timeout when dependencies change
		if (_showTimeout) {
			clearTimeout(_showTimeout);
			_showTimeout = null;
		}
		if (priority) {
			show = true;
		} else if (imgLoaded && inViewport) {
			// small delay to let the browser settle (especially for cached images)
			_showTimeout = setTimeout(() => {
				show = true;
				_showTimeout = null;
			}, 30);
		} else {
			show = false;
		}
	}

	// when show becomes true we wait for the CSS opacity transition to finish
	function onImgTransitionEnd(e) {
		if (e && e.propertyName === 'opacity') {
			showVisuals = true;
			if (_visualsTimer) {
				clearTimeout(_visualsTimer);
				_visualsTimer = null;
			}
		}
	}

	$: if (show) {
		// safety fallback: if transitionend doesn't fire, enable visuals after transition duration (600ms) + small buffer
		if (_visualsTimer) {
			clearTimeout(_visualsTimer);
			_visualsTimer = null;
		}
		_visualsTimer = setTimeout(() => {
			showVisuals = true;
			_visualsTimer = null;
		}, 600);
	}

	// when both preloaded and inViewport are true, assign currentSrc so the <img>
	// renders quickly (it will be served from cache because of preloader)
	$: if (inViewport && preloaded && !priority) {
		updateSrc();
	}
</script>

<figure
	bind:this={wrapperEl}
	class={`image-block image-block-wrapper ${sizeClass} ${layoutClasses} ${appliedClasses}`}
	class:show
	class:panorama
	class:fits={!!fitRatio}
	style={fitRatio ? `--ratio:${fitRatio}` : undefined}
>
	<div
		class="image-inner"
		style={`width:100%; ${fitRatio ? `--ar:${fitRatio};` : ''} ${mobileCandidate && mobileMeta?.ratio ? `--ar-m:${mobileMeta.ratio};` : ''}`}
	>
		{#if currentSrc}
			{#if (Array.isArray(sources) && sources.length) || webp || avif}
				<picture>
					{#if mobileCandidate}
						<!-- Force mobile asset on small viewports regardless of DPR -->
						{#if avif}
							<source media="(max-width: 600px)" srcset={mobileAvif} type="image/avif" />
						{/if}
						{#if webp}
							<source media="(max-width: 600px)" srcset={mobileWebp} type="image/webp" />
						{/if}
						<source media="(max-width: 600px)" srcset={mobileCandidate} />
					{/if}
					{#if avif}
						<source srcset={avifSrcset} type="image/avif" sizes={computedSizes} />
					{/if}
					{#if webp}
						<source srcset={webpSrcset} type="image/webp" sizes={computedSizes} />
					{/if}
					{#each Array.isArray(sources) ? sources : [] as s, i (i)}
						{#if typeof s === 'object'}
							<source srcset={s.srcset} type={s.type} sizes={s.sizes} />
						{:else}
							<source srcset={s} />
						{/if}
					{/each}
					<img
						bind:this={imgEl}
						src={currentSrc}
						srcset={(srcset && srcset.trim()) ||
							(mobileCandidate ? `${mobileCandidate} 600w, ${currentSrc} 1200w` : undefined)}
						sizes={computedSizes}
						{alt}
						width={attrWidth}
						height={attrHeight}
						loading={priority ? 'eager' : 'lazy'}
						fetchpriority={priority ? 'high' : 'auto'}
						{decoding}
						on:load={() => (imgLoaded = true)}
						on:error={useFullImage}
						on:transitionend={onImgTransitionEnd}
						style={`width: 100%; max-width: 100%; ${effectiveRadius ? `border-radius: ${effectiveRadius};` : ''} ${shadowStyle} ${mixBlendStyle}`}
					/>
				</picture>
			{:else}
				<!-- before any script runs, phones must still get the light file: the srcset alone would pick the large one -->
				<picture class="plain">
				{#if priority && mobileMeta && mobileCandidate}
					<source media="(max-width: 600px)" srcset={mobileCandidate} />
				{/if}
				<img
					bind:this={imgEl}
					src={currentSrc}
					srcset={(srcset && srcset.trim()) ||
						(mobileCandidate ? `${mobileCandidate} 600w, ${currentSrc} 1200w` : undefined)}
					sizes={computedSizes}
					{alt}
					width={attrWidth}
					height={attrHeight}
					loading={priority ? 'eager' : 'lazy'}
					fetchpriority={priority ? 'high' : 'auto'}
					{decoding}
					on:load={() => (imgLoaded = true)}
					on:error={useFullImage}
					on:transitionend={onImgTransitionEnd}
					style={`width: 100%; max-width: 100%; ${effectiveRadius ? `border-radius: ${effectiveRadius};` : ''} ${shadowStyle} ${mixBlendStyle}`}
				/>
				</picture>
			{/if}
		{/if}

		{#if !show}
			<div class="placeholder" aria-hidden="true"></div>
		{/if}
	</div>
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<!-- {#if normalizedTags && normalizedTags.length}
        <div class="block-tags">
            {#each normalizedTags as t}
                <span class="tag">{t}</span>
            {/each}
        </div>
    {/if} -->

<style>
	picture.plain {
		display: contents;
	}
	/* Layout and sizing */
	.image-block {
		margin: 3em auto 1rem auto;
		text-align: center;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	/* the box is reserved at the picture's own proportion before it loads; on phones the
	   phone version (a -m file or nome_mobile) may have another one */
	.image-inner {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: var(--ar, auto);
	}
	@media (max-width: 600px) {
		.image-inner {
			aspect-ratio: var(--ar-m, var(--ar, auto));
		}
	}

	/* Image base and transition for fade-in */
	.image-block img {
		max-width: 100%;
		height: auto;
		display: block;
		margin: 0 auto;
		opacity: 0;
		transition: opacity 600ms ease;
	}

	/* on a laptop no picture is taller than the screen: it is seen whole, without scrolling */
	@media (min-width: 601px) {
		.image-block.image-block-wrapper.fits {
			max-width: min(var(--mw, 100%), calc(86vh * var(--ratio)));
		}
	}

	/* When the component has both loaded and entered viewport, show image with 2s fade */
	.image-block.show img {
		opacity: 1;
	}

	.image-inner .placeholder {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.02));
		/* subtle shimmer */
		background-size: 200% 100%;
		animation: shimmer 1.2s linear infinite;
		border-radius: inherit;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.image-block figcaption {
		width: 100%;
		margin-top: calc(var(--grid) * 1.25);
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 1.6);
		line-height: 1.45;
		text-align: left;
		color: color-mix(in srgb, var(--color-dark) 68%, transparent);
	}

	.image-block-wrapper.img-pp {
		--mw: 250px;
		max-width: 250px;
	}
	.image-block-wrapper.img-p {
		--mw: 450px;
		max-width: 450px;
	}
	.image-block-wrapper.img-m {
		--mw: 640px;
		max-width: 640px;
	}
	.image-block-wrapper.img-g {
		--mw: 875px;
		max-width: 875px;
	}
	.image-block-wrapper.img-gg {
		max-width: 100%;
		border-radius: 0;
	}

	.image-block-wrapper.img-pp,
	.image-block-wrapper.img-p,
	.image-block-wrapper.img-m,
	.image-block-wrapper.img-g {
		/* Desktop: sem padding extra */
	}

	@media (max-width: 600px) {
		.image-block.panorama .image-inner {
			/* the strip keeps its own height here, not the proportion reserved for the whole picture */
			aspect-ratio: auto;
			overflow-x: auto;
			scrollbar-width: none;
			/* a first look at the strip, cut at the right edge so it reads as something to swipe */
			padding-left: calc(var(--grid) * 2);
		}
		.image-block.panorama .image-inner::-webkit-scrollbar {
			display: none;
		}
		.image-block.panorama img {
			height: min(60vh, 320px);
			width: auto !important;
			max-width: none !important;
			margin: 0;
		}
		.image-block.panorama figcaption {
			padding: 0 calc(var(--grid) * 2);
		}
		.image-block-wrapper.img-pp,
		.image-block-wrapper.img-p,
		.image-block-wrapper.img-m,
		.image-block-wrapper.img-g {
			/* padding-left: 1.5em;
        padding-right: 1.5em; */
			box-sizing: border-box;
			width: calc(100% - (var(--grid) * 4));
		}
	}

</style>
