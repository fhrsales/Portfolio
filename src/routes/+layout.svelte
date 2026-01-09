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
    let tagMutation;
    let contentMutation;
    let tagAnchor;
    let scrollHandler;
    let resizeHandler;
    let menuLocked = false;
    let anchorTop = 0;
    let headerH = 0;
    let scrollFadeTimer;
    let scrollFadeHandler;
    let tagFixed = false;

    function applyMenuState() {
        if (typeof document === 'undefined') return;
        document.documentElement.classList.toggle('menu-hidden', !showMenu);
        if (!showMenu) {
            document.documentElement.style.setProperty('--header-h', '0px');
        } else {
            requestAnimationFrame(updateHeaderVar);
        }
    }

    function disconnectTagObserver(resetTagFixed = true) {
        if (tagMutation) {
            tagMutation.disconnect();
            tagMutation = null;
        }
        if (contentMutation) {
            contentMutation.disconnect();
            contentMutation = null;
        }
        if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        scrollHandler = null;
        resizeHandler = null;
        menuLocked = false;
        tagFixed = resetTagFixed ? false : tagFixed;
        if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('has-tag-selector');
            if (resetTagFixed) document.documentElement.classList.remove('tag-fixed');
        }
    }

    function measureAnchor() {
        if (!tagAnchor) return;
        const rect = tagAnchor.getBoundingClientRect();
        anchorTop = rect.top + (window.scrollY || window.pageYOffset || 0);
        const header = document.querySelector('.menu-bar');
        headerH = header ? header.offsetHeight : 0;
    }

    function evaluateMenu() {
        const y = window.scrollY || window.pageYOffset || 0;
        const threshold = anchorTop - headerH - 8;
        const shouldFixTag = y >= anchorTop - headerH;
        if (tagFixed !== shouldFixTag) {
            tagFixed = shouldFixTag;
            document.documentElement.classList.toggle('tag-fixed', tagFixed);
        }
        const shouldShow = y >= threshold;
        if (isHome) {
            if (showMenu !== shouldShow) {
                showMenu = shouldShow;
                requestAnimationFrame(updateHeaderVar);
            }
        } else {
            if (menuLocked) return;
            if (showMenu !== shouldShow) {
                showMenu = shouldShow;
                if (shouldShow) {
                    menuLocked = true;
                    requestAnimationFrame(updateHeaderVar);
                }
            }
        }
    }

    function attachScrollWatcher() {
        measureAnchor();
        evaluateMenu();
        scrollHandler = () => requestAnimationFrame(evaluateMenu);
        resizeHandler = () => {
            measureAnchor();
            evaluateMenu();
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', resizeHandler);
    }

    function observeTagSelector() {
        if (typeof window === 'undefined') return;
        disconnectTagObserver();
        tagAnchor = document.querySelector('.tag-selector-anchor');
        if (!tagAnchor) {
            tagMutation = new MutationObserver(() => {
                tagAnchor = document.querySelector('.tag-selector-anchor');
                if (tagAnchor) {
                    tagMutation.disconnect();
                    tagMutation = null;
                    document.documentElement.classList.add('has-tag-selector');
                    attachScrollWatcher();
                }
            });
            const container = document.querySelector('.main-content');
            if (container) tagMutation.observe(container, { childList: true, subtree: true });
            return;
        }
        document.documentElement.classList.add('has-tag-selector');
        attachScrollWatcher();
        const container = document.querySelector('.main-content');
        if (container) {
            contentMutation = new MutationObserver(() => {
                requestAnimationFrame(() => {
                    measureAnchor();
                    evaluateMenu();
                });
            });
            contentMutation.observe(container, { childList: true, subtree: true });
        }
    }

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

    $effect(() => {
        applyMenuState();
    });

    // Initial path-based setup (runs in SSR too)
    const initial = get(page);
    const homePath = `${base || ''}/`;
    const initialIsHome = initial?.url?.pathname === homePath;
    isHome = initialIsHome;
    showMenu = initialIsHome ? false : true;

    function handleRouteChange(v) {
        const nowHome = v?.url?.pathname === homePath;
        isHome = nowHome;
        disconnectTagObserver();
        if (isHome) {
            showMenu = false;
            menuLocked = false;
            observeTagSelector();
        } else {
            showMenu = true;
            if (typeof window !== 'undefined') requestAnimationFrame(updateHeaderVar);
        }
    }

    onMount(() => {
        // Initial compute
        updateHeaderVar();
        // Subscribe to route changes
        const unsubscribe = page.subscribe((v) => handleRouteChange(v));
        // Run once for client side to configure watchers
        handleRouteChange(get(page));
        // Fade menu/tag selector while scrolling
        scrollFadeHandler = () => {
            document.documentElement.classList.add('is-scrolling');
            if (scrollFadeTimer) clearTimeout(scrollFadeTimer);
            scrollFadeTimer = setTimeout(() => {
                document.documentElement.classList.remove('is-scrolling');
            }, 180);
        };
        window.addEventListener('scroll', scrollFadeHandler, { passive: true });
        return () => {
            unsubscribe();
            disconnectTagObserver();
            if (scrollFadeHandler) window.removeEventListener('scroll', scrollFadeHandler);
            if (scrollFadeTimer) clearTimeout(scrollFadeTimer);
        };
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
