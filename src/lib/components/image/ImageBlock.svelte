<script>
    import { onMount, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';

    export let src = '';
    export let nome_mobile = '';
    export let alt = '';
    export let caption = '';
    export let width = '';
    export let height = '';
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
    let isIntersecting = false;
    let imgLoaded = false;
    let currentSrc = '';
    // Store reativo para largura da tela
    const screenWidth = writable(typeof window !== 'undefined' ? window.innerWidth : 1024);
    let isMobile = false;
    let observer;
    let preloaded = false;
    let inViewport = false;
    let show = false; // when true, image opacity goes to 1
    let preloader;
    let prefetchObserver;

    // Determina a classe CSS baseada no tamanho
    $: sizeClass =
        size === 'PP' ? 'img-pp'
        : size === 'P' ? 'img-p'
        : size === 'M' ? 'img-m'
        : size === 'G' ? 'img-g'
        : size === 'GG' ? 'img-gg'
        : 'img-m';

    // support multiple classes or a variable for shadow
    $: shadowClass = '';
    $: shadowStyle = '';
    $: mixBlendStyle = '';
    $: normalizedTags = Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);
    $: effectiveRadius = radius || borda || '';
    $: {
        const source = (typeof classes === 'string' && classes.trim()) ? classes.trim() : (typeof shadow === 'string' && shadow.trim() ? shadow.trim() : (shadow ? 'shadow-1' : ''));
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
        if (_visualsTimer) { clearTimeout(_visualsTimer); _visualsTimer = null; }
    }
    $: appliedClasses = showVisuals ? [shadowClass, (typeof classes === 'string' ? classes : '')].filter(Boolean).join(' ') : '';
    // removed fade transition imports to disable fade-in effect

    // Atualiza store ao redimensionar
    function handleResize() {
        if (typeof window !== 'undefined') {
            screenWidth.set(window.innerWidth);
        }
    }

    function pickSrc() {
        if (isMobile && nome_mobile) return nome_mobile;
        return src;
    }


    // Atualiza isMobile reativamente
    $: unsubscribe = screenWidth.subscribe(w => {
        isMobile = w <= 600;
    });

    // Troca reativa do src sempre que isMobile, src ou nome_mobile mudam
    $: {
        const nextSrc = pickSrc();
        if (currentSrc !== nextSrc) {
            imgLoaded = false;
            show = false;
            showVisuals = false;
            preloaded = false;
            currentSrc = nextSrc;
            // Prefetch novo src
            if (typeof window !== 'undefined') {
                preloader = new Image();
                preloader.src = nextSrc;
                preloader.onload = () => { preloaded = true; };
                preloader.onerror = () => { preloaded = true; };
            }
        }
    }

    onMount(() => {
        currentSrc = pickSrc();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            screenWidth.set(window.innerWidth);
        }
        // create a prefetch observer that starts the preload a bit earlier
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
            prefetchObserver = new IntersectionObserver(entries => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        // start preloading in background
                        try {
                            preloader = new Image();
                            preloader.src = pickSrc();
                            preloader.onload = () => { preloaded = true; };
                            preloader.onerror = () => { preloaded = true; };
                        } catch (e) { preloaded = false; }
                        if (prefetchObserver) {
                            prefetchObserver.disconnect();
                            prefetchObserver = null;
                        }
                        break;
                    }
                }
            }, { rootMargin: '400px', threshold: 0 });
            if (wrapperEl) prefetchObserver.observe(wrapperEl);

            // observe actual viewport entry to trigger display
            observer = new IntersectionObserver(entries => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        inViewport = true;
                        if (observer) {
                            observer.disconnect();
                            observer = null;
                        }
                    }
                }
            }, { rootMargin: '0px', threshold: 0.08 });
            if (wrapperEl) observer.observe(wrapperEl);
        } else {
            // Fallback: immediately preload and mark in viewport
            try {
                preloader = new Image();
                preloader.src = pickSrc();
                preloader.onload = () => { preloaded = true; };
                preloader.onerror = () => { preloaded = true; };
            } catch (e) { preloaded = false; }
            currentSrc = pickSrc();
            inViewport = true;
        }
    });

    onDestroy(() => {
        if (observer) observer.disconnect();
        if (prefetchObserver) prefetchObserver.disconnect();
        if (typeof window !== 'undefined') window.removeEventListener('resize', handleResize);
        if (unsubscribe) unsubscribe();
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
            if (_visualsTimer) { clearTimeout(_visualsTimer); _visualsTimer = null; }
        }
    }

    $: if (show) {
        // safety fallback: if transitionend doesn't fire, enable visuals after transition duration (600ms) + small buffer
        if (_visualsTimer) { clearTimeout(_visualsTimer); _visualsTimer = null; }
    _visualsTimer = setTimeout(() => { showVisuals = true; _visualsTimer = null; }, 600);
    }

    // quando preloaded e inViewport, atualiza currentSrc para o correto
    $: if (inViewport && preloaded && !currentSrc) {
        currentSrc = pickSrc();
    }
</script>

<figure bind:this={wrapperEl} class={`image-block image-block-wrapper ${sizeClass} ${appliedClasses}`} class:show={show}>
    
    <div class="image-inner" style="width:100%;">
        {#if currentSrc}
            <img bind:this={imgEl}
                src={currentSrc}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                on:load={() => imgLoaded = true}
                on:transitionend={onImgTransitionEnd}
                style={`width: 100%; max-width: 100%; ${effectiveRadius ? `border-radius: ${effectiveRadius};` : ''} ${shadowStyle} ${mixBlendStyle}` } />
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
/*
 * Adicione nome_mobile="..." para alternar a imagem automaticamente em mobile (<=600px).
 * O src alterna dinamicamente ao redimensionar a tela.
 * Exemplo ArchieML:
 * {imagem}
 * nome: caro_leitor.png
 * nome_mobile: caro_leitor_mobile.png
 * {}
 */
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

.image-inner { position: relative; display: block; width: 100%; }

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
    background: linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.02));
    /* subtle shimmer */
    background-size: 200% 100%;
    animation: shimmer 1.2s linear infinite;
    border-radius: inherit;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.image-block figcaption {
    font-size: 0.95em;
    color: #555;
    margin-top: 0.5em;
}

.image-block-wrapper.img-pp { max-width: 250px; }
.image-block-wrapper.img-p  { max-width: 500px; }
.image-block-wrapper.img-m  { max-width: 620px; }
.image-block-wrapper.img-g  { max-width: 860px; }
.image-block-wrapper.img-gg { max-width: 100vw; border-radius: 0; }

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
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
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
    content: "";
    position: absolute;
    z-index: -1;
    bottom: 15px;
    height: 17px;
    width: 50%;
    box-shadow: 0 10px 5px rgba(0, 0, 0, 0.3);
    display: block !important;
}
.image-block.show.shadow-1:before { left: 10px; transform: rotate(-5deg); }
.image-block.show.shadow-1:after  { right: 10px; transform: rotate(5deg); }

</style>
