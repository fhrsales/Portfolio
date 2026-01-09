<script>
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
	let currentSrc = '';
	// eslint-disable-next-line no-unused-vars
	let lastSrcChecked = '';
	// eslint-disable-next-line no-unused-vars
	let isMobile = false;
	let observer;
	let onResize;
	let preloaded = false;
	let inViewport = false;
	let show = false; // when true, image opacity goes to 1
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

	// Derive mobile candidate: explicit prop or inferred from src using -m suffix
	$: mobileCandidate = nome_mobile || (src ? withMobileSuffix(src) : '');

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
	let showVisuals = false;
	let _visualsTimer;
	$: if (!show) {
		showVisuals = false;
		if (_visualsTimer) {
			clearTimeout(_visualsTimer);
			_visualsTimer = null;
		}
	}
	$: appliedClasses = showVisuals ? [shadowClass, effectiveClasses].filter(Boolean).join(' ') : '';
	// removed fade transition imports to disable fade-in effect

	function getResponsiveSrcSync() {
		if (typeof window !== 'undefined') {
			const mobile = window.matchMedia('(max-width: 600px)').matches;
			isMobile = mobile;
			if (mobile && src) {
				const dotIndex = src.lastIndexOf('.');
				if (dotIndex !== -1) {
					return `${src.slice(0, dotIndex)}-m${src.slice(dotIndex)}`;
				}
			}
		}
		return src;
	}

	function updateSrc() {
		const srcToUse = getResponsiveSrcSync();
		lastSrcChecked = srcToUse;
		currentSrc = srcToUse;
	}

	onMount(() => {
		updateSrc();
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
		if (imgLoaded && inViewport) {
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
	$: if (inViewport && preloaded) {
		updateSrc();
	}
</script>

<figure
	bind:this={wrapperEl}
	class={`image-block image-block-wrapper ${sizeClass} ${appliedClasses}`}
	class:show
>
	<div
		class="image-inner"
		style={`width:100%; ${!height && numericRatio ? `aspect-ratio: ${numericRatio};` : ''}`}
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
						width={width || (numericRatio ? defaultWidthForSize(size) : undefined)}
						height={height ||
							(numericRatio ? Math.round(defaultWidthForSize(size) / numericRatio) : undefined)}
						loading={priority ? 'eager' : 'lazy'}
						fetchpriority={priority ? 'high' : 'auto'}
						{decoding}
						on:load={() => (imgLoaded = true)}
						on:transitionend={onImgTransitionEnd}
						style={`width: 100%; max-width: 100%; ${effectiveRadius ? `border-radius: ${effectiveRadius};` : ''} ${shadowStyle} ${mixBlendStyle}`}
					/>
				</picture>
			{:else}
				<img
					bind:this={imgEl}
					src={currentSrc}
					srcset={(srcset && srcset.trim()) ||
						(mobileCandidate ? `${mobileCandidate} 600w, ${currentSrc} 1200w` : undefined)}
					sizes={computedSizes}
					{alt}
					width={width || (numericRatio ? defaultWidthForSize(size) : undefined)}
					height={height ||
						(numericRatio ? Math.round(defaultWidthForSize(size) / numericRatio) : undefined)}
					loading={priority ? 'eager' : 'lazy'}
					fetchpriority={priority ? 'high' : 'auto'}
					{decoding}
					on:load={() => (imgLoaded = true)}
					on:transitionend={onImgTransitionEnd}
					style={`width: 100%; max-width: 100%; ${effectiveRadius ? `border-radius: ${effectiveRadius};` : ''} ${shadowStyle} ${mixBlendStyle}`}
				/>
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

	.image-inner {
		position: relative;
		display: block;
		width: 100%;
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
		font-size: 0.95em;
		color: #555;
		margin-top: 0.5em;
	}

	.image-block-wrapper.img-pp {
		max-width: 250px;
	}
	.image-block-wrapper.img-p {
		max-width: 450px;
	}
	.image-block-wrapper.img-m {
		max-width: 640px;
	}
	.image-block-wrapper.img-g {
		max-width: 875px;
	}
	.image-block-wrapper.img-gg {
		max-width: 100vw;
		border-radius: 0;
	}

	.image-block-wrapper.img-pp,
	.image-block-wrapper.img-p,
	.image-block-wrapper.img-m,
	.image-block-wrapper.img-g {
		/* Desktop: sem padding extra */
	}

	@media (max-width: 600px) {
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

	.image-block.show.shadow-1 img {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
	}

	/* Override global .shadow-1 pseudo-elements so they appear only after the image is shown
   (global rules may place :before/:after as soon as class is present; we delay them until .show) */
	.image-block.shadow-1:before,
	.image-block.shadow-1:after {
		display: none !important;
	}
	.image-block.show.shadow-1:before,
	.image-block.show.shadow-1:after {
		/* mirror global shadow styles but only after .show is active */
		content: '';
		position: absolute;
		z-index: -1;
		bottom: 15px;
		height: 17px;
		width: 50%;
		box-shadow: 0 10px 5px rgba(0, 0, 0, 0.3);
		display: block !important;
	}
	.image-block.show.shadow-1:before {
		left: 10px;
		transform: rotate(-5deg);
	}
	.image-block.show.shadow-1:after {
		right: 10px;
		transform: rotate(5deg);
	}
</style>
