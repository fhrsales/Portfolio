<script>
	import { onMount, onDestroy } from 'svelte';
	import { resolve } from '$app/paths';
	export let value = '';
	let rootEl;
	let shouldLoad = false;
	let hasShown = false;
	let observer;
	// Caminho base dos PDFs (usa resolve para respeitar base em produção)
	const path = `/pdfs/${value}`;
	const src = resolve(path);

	onMount(() => {
		if (typeof window === 'undefined') {
			shouldLoad = true;
			hasShown = true;
			return;
		}
		try {
			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							shouldLoad = true;
							hasShown = true;
							if (observer) observer.disconnect();
							break;
						}
					}
				},
				{ root: null, rootMargin: '200px', threshold: 0.1 }
			);
			if (rootEl) observer.observe(rootEl);
		} catch {
			shouldLoad = true;
			hasShown = true;
		}
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
	});
</script>

<div class="pdf-viewer" bind:this={rootEl} class:show={hasShown}>
	{#if shouldLoad}
		<iframe
			{src}
			width="100%"
			height="600px"
			style="border:none;"
			allowfullscreen
			title={`PDF: ${value}`}
		></iframe>
	{/if}
	<p style="text-align:center; margin-top:0.5em;">
		<a href={src} target="_blank" rel="noopener">Abrir PDF em nova aba</a>
	</p>
</div>

<style>
	.pdf-viewer {
		width: 100%;
		max-width: 900px;
		margin: 2em auto;
		opacity: 0;
		transition: opacity 600ms ease;
	}
	.pdf-viewer.show {
		opacity: 1;
	}
</style>
