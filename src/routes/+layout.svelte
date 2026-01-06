<script>
	import '../app.css';
    import Menu from '$lib/components/header/Menu.svelte';
    import Footer from '$lib/components/footer/Footer.svelte';
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';
    let { children } = $props();
    let showMenu = $state(true);
    let isHome = $state(false);
    let secondParagraph = null;
    let rafId;
    let anchorBottom = 0;
    let scrollHandler;
    let resizeHandler;

    function updateHeaderVar() {
        try {
            const header = document.querySelector('.menu-bar');
            // Use only the actual header height; exclude margins to avoid scroll jank
            const h = header ? header.offsetHeight : 0;
            document.documentElement.style.setProperty('--header-h', `${h}px`);
        } catch {
            /* ignore */
        }
    }

    function findSecondParagraph() {
        const container = document.querySelector('.main-content');
        if (!container) return null;
        const allP = Array.from(container.querySelectorAll('p'));
        const candidates = allP.filter((el) => (el.textContent || '').trim().length > 20).slice(0, 2);
        return candidates[1] || null;
    }

    function setupHomeMenuReveal() {
        // Only for home: hide initially and reveal after passing the 2nd paragraph
        showMenu = false;
        secondParagraph = findSecondParagraph();
        // If content not ready yet, observe briefly
        if (!secondParagraph) {
            const start = Date.now();
            const mo = new MutationObserver(() => {
                secondParagraph = findSecondParagraph();
                if (secondParagraph) {
                    mo.disconnect();
                    attachScrollWatcher();
                } else if (Date.now() - start > 5000) {
                    mo.disconnect();
                    // Safety: show menu if we never found the paragraph
                    showMenu = true;
                    cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(updateHeaderVar);
                }
            });
            const container = document.querySelector('.main-content');
            if (container) mo.observe(container, { childList: true, subtree: true });
        } else {
            attachScrollWatcher();
        }
    }

    function attachScrollWatcher() {
        // Stronger hysteresis to prevent threshold tug-of-war when layout shifts
        const SHOW_MARGIN = 40; // show only after the paragraph is clearly above
        const HIDE_MARGIN = 20; // hide only after it re-enters clearly
        let last = showMenu;
        const measureAnchor = () => {
            if (!secondParagraph) return;
            const r = secondParagraph.getBoundingClientRect();
            anchorBottom = (window.scrollY || window.pageYOffset || 0) + r.bottom;
        };
        const onScroll = () => {
            if (!secondParagraph) return;
            const y = window.scrollY || window.pageYOffset || 0;
            const shouldShow = y >= anchorBottom + SHOW_MARGIN;
            const shouldHide = y <= anchorBottom - HIDE_MARGIN;
            let next = last;
            if (!last && shouldShow) next = true;
            else if (last && shouldHide) next = false;
            if (next !== last) {
                showMenu = next;
                last = next;
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(updateHeaderVar);
            }
        };
        const onResize = () => {
            measureAnchor();
            onScroll();
        };
        // Prime state and listen
        measureAnchor();
        onScroll();
        if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        scrollHandler = onScroll;
        resizeHandler = onResize;
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', resizeHandler);
    }

    // Initial path-based setup (runs in SSR too)
    const initial = get(page);
    const homePath = `${base || ''}/`;
    const initialIsHome = initial?.url?.pathname === homePath;
    isHome = initialIsHome;
    showMenu = initialIsHome ? false : true;

    function handleRouteChange(v) {
        const nowHome = v?.url?.pathname === homePath;
        isHome = nowHome;
        if (typeof window !== 'undefined') {
            if (isHome) {
                setupHomeMenuReveal();
            } else {
                showMenu = true;
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(updateHeaderVar);
            }
        }
    }

    onMount(() => {
        // Initial compute (may be 0 on home if hidden)
        updateHeaderVar();
        // Subscribe to route changes
        const unsubscribe = page.subscribe((v) => handleRouteChange(v));
        // Run once for client side to configure watchers
        handleRouteChange(get(page));
        return () => unsubscribe();
    });
</script>

{#if !$page.url.pathname?.startsWith('/admin')}
	<Menu hidden={!showMenu} fadeIn={isHome && showMenu} />
{/if}
{#if $page.url.pathname?.startsWith('/admin')}
	{@render children?.()}

{:else}
	<main class="main-content" class:home-initial={isHome && !showMenu} class:is-home={isHome}>
		{@render children?.()}
	</main>
{/if}
{#if !$page.url.pathname?.startsWith('/admin')}
	<Footer />
{/if}
