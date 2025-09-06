<script>
	import '../app.css';
	import Menu from '$lib/components/header/Menu.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import { page } from '$app/stores';
	let { children } = $props();
</script>

{#if !$page.url.pathname?.startsWith('/admin')}
	<Menu />
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
