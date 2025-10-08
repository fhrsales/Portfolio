<script>
	import '../app.css';
	import Menu from '$lib/components/header/Menu.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let { children } = $props();

	onMount(() => {
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
	});
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
