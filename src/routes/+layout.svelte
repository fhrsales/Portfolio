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

    function updateHeaderVar() {
        try {
            const header = document.querySelector('.menu-bar');
            let h = header ? header.offsetHeight : 0;
            if (header) {
                const cs = getComputedStyle(header);
                const mb = parseFloat(cs.marginBottom || '0') || 0;
                h += mb;
            }
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
        let last = showMenu;
        const onScroll = () => {
            if (!secondParagraph) return;
            const r = secondParagraph.getBoundingClientRect();
            // Show menu only after the 2nd paragraph has fully passed above the viewport
            const next = r.bottom <= 0;
            if (next !== last) {
                showMenu = next;
                last = next;
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(updateHeaderVar);
            }
        };
        // Prime state and listen
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Initial path-based setup (runs in SSR too)
    const initial = get(page);
    const homePath = `${base || ''}/`;
    isHome = initial?.url?.pathname === homePath;
    showMenu = isHome ? false : true;

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
	{#if showMenu}
		<Menu fadeIn={isHome} />
	{/if}
{/if}
{#if $page.url.pathname?.startsWith('/admin')}
	{@render children?.()}
{:else}
	<div class="main-content">
		{@render children?.()}
	</div>
{/if}
{#if !$page.url.pathname?.startsWith('/admin')}
	<Footer />
{/if}
