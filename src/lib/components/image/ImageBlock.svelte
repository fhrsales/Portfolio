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
	export let priority = false; // when true, treat as LCP: eager + high fetch priority
	export let decoding = 'async';
	export let size = 'M'; // P, M, G, GG
	export let shadow = false; // legacy: can be boolean or string (e.g. 'shadow-1')
	export let classes = ''; // new: space-separated classes or var(...) tokens
	export let radius = ''; // e.g. '8px' or '50%'
	export let tags = []; // array of tag strings (lowercase)
	export let multiply = false; // accept boolean or 'sim' or string token
	export let borda = ''; // alternative border radius from ArchieML (e.g. '8px')

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
	$: {
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
	$: appliedClasses = showVisuals
		? [shadowClass, typeof classes === 'string' ? classes : ''].filter(Boolean).join(' ')
		: '';
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
	<div class="image-inner" style="width:100%;">
		{#if currentSrc}
			<img
				bind:this={imgEl}
				src={currentSrc}
				srcset={(srcset && srcset.trim()) ||
					(nome_mobile ? `${nome_mobile} 600w, ${currentSrc} 1200w` : undefined)}
				sizes={sizes || (nome_mobile ? '(max-width: 600px) 600px, 1200px' : undefined)}
				{alt}
				{width}
				{height}
				loading={priority ? 'eager' : 'lazy'}
				fetchpriority={priority ? 'high' : 'auto'}
				{decoding}
				on:load={() => (imgLoaded = true)}
				on:transitionend={onImgTransitionEnd}
				style={`width: 100%; max-width: 100%; ${effectiveRadius ? `border-radius: ${effectiveRadius};` : ''} ${shadowStyle} ${mixBlendStyle}`}
			/>
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
		max-width: 500px;
	}
	.image-block-wrapper.img-m {
		max-width: 620px;
	}
	.image-block-wrapper.img-g {
		max-width: 860px;
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
