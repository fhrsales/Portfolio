<script>
	import '../app.css';
    import Menu from '$lib/components/header/Menu.svelte';
    import Footer from '$lib/components/footer/Footer.svelte';
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { onNavigate } from '$app/navigation';
    import { language } from '$lib/i18n';
    import { archiePages } from '$lib/stores';
    // cross-fade between pages where the browser supports view transitions
    onNavigate((navigation) => {
        if (!document.startViewTransition) return;
        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });

    onMount(() => {
        language.set('en');
        return language.subscribe(value => {
            document.documentElement.lang = value === 'pt' ? 'pt-BR' : 'en';
        });
    });
    // Inside the editor's preview frame, show the draft the editor sends instead of the saved page.
    onMount(() => {
        if (window.parent === window) return;
        const onDraft = (event) => {
            if (event.origin !== window.location.origin || event.source !== window.parent) return;
            const { type, page: name, content } = event.data || {};
            if (type !== 'editor-draft' || typeof name !== 'string' || typeof content !== 'string') return;
            archiePages.update((pages) => ({ ...pages, [name]: { ...pages[name], content } }));
        };
        window.addEventListener('message', onDraft);
        return () => window.removeEventListener('message', onDraft);
    });
    let { children } = $props();
    let scrollFadeTimer;
    let scrollFadeHandler;

    onMount(() => {
        // Fade tag selector while scrolling
        scrollFadeHandler = () => {
            document.documentElement.classList.add('is-scrolling');
            if (scrollFadeTimer) clearTimeout(scrollFadeTimer);
            scrollFadeTimer = setTimeout(() => {
                document.documentElement.classList.remove('is-scrolling');
            }, 180);
        };
        window.addEventListener('scroll', scrollFadeHandler, { passive: true });
        return () => {
            if (scrollFadeHandler) window.removeEventListener('scroll', scrollFadeHandler);
            if (scrollFadeTimer) clearTimeout(scrollFadeTimer);
        };
    });
</script>

{#if !$page.route.id?.startsWith('/admin')}
	<Menu />
{/if}
{#if $page.route.id?.startsWith('/admin')}
	{@render children?.()}

{:else}
	<main class="main-content" class:is-home={$page.url.pathname === `${base || ''}/`}>
		{#key $language}
			{@render children?.()}
		{/key}
	</main>
{/if}
{#if !$page.route.id?.startsWith('/admin')}
	<Footer />
{/if}
