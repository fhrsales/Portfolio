<script>
	/* eslint-disable svelte/infinite-reactive-loop */
	import { onMount, onDestroy } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';

	export let src = '';
	export let sources = []; // optional array of source filenames or absolute URLs or objects {src, width, bitrate}
	export let preview = ''; // optional small preview (video or image) used as poster/preview
	export let caption = '';
	export let controls = false;
	export let size = 'M';
	export let classes = '';
	export let radius = '';
	export let tags = [];
	// optional external caption track; if empty we'll inject a minimal data URI track for a11y compliance
	export let captionTrack = '';

	let wrapperEl;
	let videoEl;
	let observer;
	let prefetchObserver;
	// eslint-disable-next-line no-unused-vars
	let preloaded = false;
	let inViewport = false;
	let show = false;
	let currentSrc = '';
	let currentSources = [];
    let loaded = false; // whether we've assigned the heavy sources to the player
	let preloader;
	let isPlaying = false;
	let isMuted = true; // start muted for autoplay friendliness; user can unmute
	let error = '';
	let controlsVisible = false;
	let _controlsHideTimer;
	let userPaused = false; // when true, user explicitly paused and we should avoid auto-resume

	$: sizeClass =
		size === 'PP'
			? 'video-pp'
			: size === 'P'
				? 'video-p'
				: size === 'M'
					? 'video-m'
					: size === 'G'
						? 'video-g'
						: 'video-m';
	// compute poster attribute safely (avoid using template conditionals inside tag attributes)
	$: posterAttr =
		typeof preview === 'string' &&
		(preview.endsWith('.jpg') || preview.endsWith('.png') || preview.endsWith('.webp'))
			? preview
			: undefined;

	onMount(() => {
		if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
			prefetchObserver = new IntersectionObserver(
				(entries) => {
					for (const e of entries) {
						if (e.isIntersecting) {
							try {
								preloader = document.createElement('video');
								// prefer preview for lightweight metadata fetch if available
								preloader.preload = 'metadata';
								if (preview) {
									preloader.src = preview;
								} else if (Array.isArray(sources) && sources.length) {
									preloader.src =
										typeof sources[0] === 'string' ? sources[0] : sources[0].src || src;
								} else {
									preloader.src = src;
								}
								preloader.onloadeddata = () => {
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

			// larger rootMargin so mobile devices trigger loading earlier as user scrolls
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
				{ rootMargin: '200px', threshold: 0.12 }
			);
			if (wrapperEl) observer.observe(wrapperEl);
		} else {
			try {
				preloader = document.createElement('video');
				preloader.preload = 'metadata';
				if (Array.isArray(sources) && sources.length) preloader.src = sources[0];
				else preloader.src = src;
				preloader.onloadeddata = () => {
					preloaded = true;
				};
				preloader.onerror = () => {
					preloaded = true;
				};
			} catch {
				preloaded = false;
			}
			currentSrc = src;
			inViewport = true;
		}
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
		if (prefetchObserver) prefetchObserver.disconnect();
		if (preloader)
			try {
				preloader.src = '';
			} catch {
				/* ignore */
			}
		if (_controlsHideTimer) clearTimeout(_controlsHideTimer);
	});

	// keep isPlaying in sync with the actual video element events
	let _attachedCleanup = null;
	$: {
		// detach previous listeners if any
		if (_attachedCleanup) {
			try {
				_attachedCleanup();
			} catch {
				/* ignore */
			}
			_attachedCleanup = null;
		}
		if (videoEl) {
			const _onplay = () => {
				isPlaying = true;
			};
			const _onpause = () => {
				isPlaying = false;
			};
            const _onended = () => {
                isPlaying = false;
            };
            try {
                videoEl.addEventListener('play', _onplay);
                videoEl.addEventListener('pause', _onpause);
                videoEl.addEventListener('ended', _onended);
            } catch {
                /* ignore */
            }
            _attachedCleanup = () => {
                try {
                    videoEl.removeEventListener('play', _onplay);
                    videoEl.removeEventListener('pause', _onpause);
                    videoEl.removeEventListener('ended', _onended);
                } catch {
                    /* ignore */
                }
            };
        }
    }

	let _showTimeout;
	$: {
		if (_showTimeout) {
			clearTimeout(_showTimeout);
			_showTimeout = null;
		}
		// when the block enters viewport, proceed even if preloaded isn't finished
		if (inViewport) {
			// decide whether to auto-load heavy source depending on connection
			const conn =
				typeof navigator !== 'undefined' && navigator.connection ? navigator.connection : null;
			const saveData = conn && conn.saveData === true;
			const eff = conn && conn.effectiveType ? String(conn.effectiveType) : '';
			const slowNetwork = /2g|slow-2g/i.test(eff);

			const shouldAutoLoad = !saveData && !slowNetwork;

			// if we should auto load, pick the best source and assign; otherwise keep only preview/poster until user interacts
			if (shouldAutoLoad) {
				if (import.meta.env.DEV)
					console.debug('[VideoBlock] shouldAutoLoad=true — loading chosen sources');
				loadChosenSources();
			}

			// If there's no lightweight preview to show, assign sources so the video element renders (helps some mobile cases)
			if (!loaded && !preview) {
				if (import.meta.env.DEV)
					console.debug(
						'[VideoBlock] no preview available — forcing loadChosenSources on inViewport'
					);
				loadChosenSources();
			}

			if (!currentSources.length && !loaded && preview) {
				// keep empty sources so the poster/preview is shown and avoid assigning heavy files
			}

			if (!currentSrc && currentSources.length) currentSrc = currentSources[0];
			_showTimeout = setTimeout(() => {
				show = true;
				// try play when shown: muted first for autoplay; if user previously interacted unmute
				// do not auto-resume if the user explicitly paused the video
				if (!userPaused && shouldAutoLoad && videoEl && typeof videoEl.play === 'function') {
					videoEl.muted = isMuted;
					videoEl
						.play()
						.then(() => {
							isPlaying = true;
						})
						.catch(() => {
							isPlaying = false;
						});
				}
			}, 160);
		} else {
			show = false;
			if (videoEl && typeof videoEl.pause === 'function') {
				videoEl.pause();
				isPlaying = false;
			}
		}
	}

	// normalize sources to objects {src, width, bitrate}
	function normalizeSources(s) {
		if (!s) return [];
		if (!Array.isArray(s))
			s = String(s)
				.split(',')
				.map((x) => x.trim())
				.filter(Boolean);
		return s.map((item) => {
			if (typeof item === 'string') return { src: item };
			return { src: item.src || item, width: item.width, bitrate: item.bitrate, codec: item.codec };
		});
	}

// no explicit mime type assignment originally; rely on browser sniffing

	function pickSourceByProfile(sourcesArr) {
		const list = normalizeSources(sourcesArr);
		if (!list.length) return null;
		const conn =
			typeof navigator !== 'undefined' && navigator.connection ? navigator.connection : null;
		const saveData = conn && conn.saveData === true;
		const eff = conn && conn.effectiveType ? String(conn.effectiveType) : '';
		const slowNetwork = /2g|slow-2g/i.test(eff);
		if (saveData || slowNetwork) {
			// pick lowest bitrate or smallest width
			return list
				.slice()
				.sort(
					(a, b) => (a.bitrate || 1e9) - (b.bitrate || 1e9) || (a.width || 1e9) - (b.width || 1e9)
				)[0];
		}
		// prefer exact 500px if present
		const exact = list.find((x) => x.width === 500);
		if (exact) return exact;
		// prefer nearest width <= 500
		const le = list.filter((x) => x.width && x.width <= 500).sort((a, b) => b.width - a.width)[0];
		if (le) return le;
		// fallback to first
		return list[0];
	}

	function loadChosenSources(force = false) {
		if (loaded && !force) return;
        const normalized = normalizeSources(sources.length ? sources : [src]);
        const chosen = pickSourceByProfile(normalized) || normalized[0];
        if (!chosen) return;
        currentSources = [chosen.src];
        currentSrc = chosen.src;
        loaded = true;
        // if video element already present, reload and try to play if appropriate
        if (videoEl) {
            try {
                videoEl.load();
            } catch {
                /* ignore */
            }
        }
    }

	// user interaction to explicitly load / play the heavy source
	function ensureLoadedAndPlay() {
		if (!loaded) {
			loadChosenSources(true);
		}
		if (videoEl) {
			userPaused = false;
			videoEl.muted = isMuted;
			videoEl
				.play()
				.then(() => {
					isPlaying = !videoEl.paused;
				})
				.catch(() => {
					isPlaying = false;
				});
		}
	}

	function togglePlay() {
		if (import.meta.env.DEV)
			console.debug('togglePlay, videoEl:', !!videoEl, 'isPlaying:', isPlaying);
		if (!videoEl) return;
		if (isPlaying) {
			// user-initiated pause — mark userPaused to avoid auto-resume
			userPaused = true;
			try {
				videoEl.pause();
			} catch (e) {
				if (import.meta.env.DEV) console.debug('pause fail', e);
			}
			// ensure state reflects the element
			isPlaying = !videoEl.paused;
		} else {
			// user wants to play — clear userPaused
			userPaused = false;
			videoEl
				.play()
				.then(() => {
					isPlaying = !videoEl.paused;
				})
				.catch((err) => {
					if (import.meta.env.DEV) console.debug('play failed', err);
					isPlaying = false;
				});
		}
	}

	function toggleMute() {
		if (import.meta.env.DEV)
			console.debug('toggleMute, videoEl:', !!videoEl, 'isMuted before:', isMuted);
		if (!videoEl) return;
		isMuted = !isMuted;
		try {
			videoEl.muted = isMuted;
		} catch (e) {
			if (import.meta.env.DEV) console.debug('set muted failed', e);
		}
		if (!isMuted) {
			// ensure playing with sound
			videoEl.play().catch((e) => {
				if (import.meta.env.DEV) console.debug('play after unmute failed', e);
			});
		}
	}

	function showControlsTemporary() {
		controlsVisible = true;
		if (_controlsHideTimer) clearTimeout(_controlsHideTimer);
		_controlsHideTimer = setTimeout(() => {
			controlsVisible = false;
			_controlsHideTimer = null;
		}, 3000);
	}

	function onPointerDown(e) {
		// for touch devices, show controls when tapping the area
		try {
			const pt = e && e.pointerType ? e.pointerType : null;
			if (pt === 'touch') showControlsTemporary();
		} catch {
			/* ignore */
		}
	}

	function onTouchStart() {
		showControlsTemporary();
	}

	function onVideoError() {
		error = 'Erro ao carregar o vídeo.';
		// fallback: show native controls to allow manual load if possible
		if (videoEl) {
			try {
				videoEl.controls = true;
			} catch {
				/* ignore */
			}
		}
	}

	function onPlaceholderKeyDown(e) {
		const k = e && e.key ? e.key : '';
		if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
			e.preventDefault();
			ensureLoadedAndPlay();
		}
	}
</script>

<figure
	bind:this={wrapperEl}
	class={`video-block video-block-wrapper ${sizeClass} ${classes}`}
	class:show
	data-tags={tags && tags.length ? tags.join(' ') : undefined}
>
	<div class="video-inner">
		{#if currentSources && currentSources.length}
			<video
				bind:this={videoEl}
				playsinline
				{controls}
                preload="none"
				on:error={onVideoError}
				poster={posterAttr}
				style={`width:100%; height:auto; ${radius ? `border-radius:${radius};` : ''}`}
				aria-label={caption || 'Vídeo'}
			>
				<track
					kind="captions"
					src={captionTrack || 'data:text/vtt,WEBVTT'}
					srclang="pt"
					label="Português"
					default
				/>
				{#each currentSources as s, i (i)}
					<source src={s} />
				{/each}
				Seu navegador não suporta o elemento de vídeo.
			</video>
		{/if}

		{#if !loaded}
			{#if preview}
				<!-- show preview video or image as lightweight placeholder (interactive wrapped in button for a11y) -->
				{#if typeof preview === 'string' && (preview.endsWith('.mp4') || preview.endsWith('.webm'))}
					<button
						type="button"
						class="preview-wrapper"
						on:click|preventDefault={ensureLoadedAndPlay}
						on:keydown={onPlaceholderKeyDown}
						aria-label="Reproduzir vídeo"
					>
						<video
							class="placeholder-preview"
							src={preview}
							muted
							loop
							playsinline
							style={`width:100%; height:auto; ${radius ? `border-radius:${radius};` : ''}`}
						>
							<track
								kind="captions"
								src="data:text/vtt,WEBVTT"
								srclang="pt"
								label="Pré-visualização"
								default
							/>
						</video>
					</button>
				{:else}
					<button
						type="button"
						class="preview-wrapper"
						on:click|preventDefault={ensureLoadedAndPlay}
						on:keydown={onPlaceholderKeyDown}
						aria-label="Reproduzir vídeo"
					>
						<img
							class="placeholder-preview"
							src={preview}
							alt="Pré-visualização do vídeo"
							style={`width:100%; height:auto; ${radius ? `border-radius:${radius};` : ''}`}
						/>
					</button>
				{/if}
			{:else}
				<button
					type="button"
					class="placeholder"
					aria-label="Carregar e reproduzir vídeo"
					on:click|preventDefault={ensureLoadedAndPlay}
					on:keydown={onPlaceholderKeyDown}
				></button>
			{/if}
		{/if}

		<!-- overlay controls (bottom-right) -->
		<div
			class="video-controls"
			aria-hidden={!show}
			class:visible={controlsVisible}
			on:touchstart={onTouchStart}
			on:pointerdown={onPointerDown}
		>
			<Button
				on:click={() => {
					if (import.meta.env.DEV) console.debug('play clicked');
					togglePlay();
				}}
				variant={isPlaying ? 'primary' : 'default'}
				active={isPlaying}>{isPlaying ? 'Pause' : 'Play'}</Button
			>
			<Button
				on:click={() => {
					if (import.meta.env.DEV) console.debug('mute clicked');
					toggleMute();
				}}
				variant={isMuted ? 'default' : 'primary'}
				active={!isMuted}>{isMuted ? 'Unmute' : 'Mute'}</Button
			>
		</div>
		{#if error}
			<div class="video-error">{error}</div>
		{/if}
	</div>
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	.video-block {
		margin: 6em auto 1rem auto;
		text-align: center;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.video-inner {
		position: relative;
		width: 100%;
	}
	.video-block video {
		width: 100%;
		height: auto;
		display: block;
		opacity: 0;
		transition: opacity 1s ease;
	}
	.video-block.show video {
		opacity: 1;
	}
	.video-inner .placeholder {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.02));
		background-size: 200% 100%;
		animation: shimmer 1.2s linear infinite;
		border-radius: inherit;
		pointer-events: auto;
		border: none;
		cursor: pointer;
	}
	.preview-wrapper {
		display: block;
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		width: 100%;
	}
	.placeholder-preview {
		display: block;
		width: 100%;
	}
	.video-controls {
		position: absolute;
		right: 12px;
		bottom: 12px;
		display: flex;
		gap: 8px;
		z-index: 12;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 180ms ease,
			transform 180ms ease;
		pointer-events: auto;
	}
	.video-inner:hover .video-controls,
	.video-controls.visible {
		opacity: 1;
		transform: translateY(0);
	}
	.video-controls > * {
		display: inline-flex;
	}
	.video-error {
		position: absolute;
		left: 12px;
		bottom: 12px;
		background: rgba(180, 0, 0, 0.85);
		color: #fff;
		padding: 6px 10px;
		border-radius: 6px;
		z-index: 11;
	}
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
	.video-block figcaption {
		font-size: 0.95em;
		color: #555;
		margin-top: 0.5em;
	}

	.video-block-wrapper.video-pp {
		max-width: 250px;
	}
	.video-block-wrapper.video-p {
		max-width: 500px;
	}
	.video-block-wrapper.video-m {
		max-width: 620px;
	}
	.video-block-wrapper.video-g {
		max-width: 860px;
	}

	@media (max-width: 600px) {
		.video-block-wrapper.video-pp,
		.video-block-wrapper.video-p,
		.video-block-wrapper.video-m,
		.video-block-wrapper.video-g {
			width: calc(100% - (var(--grid) * 4));
			box-sizing: border-box;
		}
	}
</style>
