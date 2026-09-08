<script>
	import '../app.css';
    import Menu from '$lib/components/header/Menu.svelte';
    import Footer from '$lib/components/footer/Footer.svelte';
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { language } from '$lib/i18n';
    onMount(() => {
        language.set('en');
        return language.subscribe(value => {
            document.documentElement.lang = value === 'pt' ? 'pt-BR' : 'en';
        });
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

{#if !$page.url.pathname?.startsWith('/admin')}
	<Menu />
{/if}
{#if $page.url.pathname?.startsWith('/admin')}
	{@render children?.()}

{:else}
	<main class="main-content" class:is-home={$page.url.pathname === `${base || ''}/`}>
		{#key $language}
			{@render children?.()}
		{/key}
	</main>
{/if}
{#if !$page.url.pathname?.startsWith('/admin')}
	<Footer />
{/if}
