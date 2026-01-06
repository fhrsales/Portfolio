<script>
	import { onMount } from 'svelte';

	export let rootMargin = '800px';
	export let minHeight = '';
	let host;
	let show = false;

	onMount(() => {
		if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
			show = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						show = true;
						io.disconnect();
						break;
					}
				}
			},
			{ rootMargin, threshold: 0.01 }
		);
		if (host) io.observe(host);
		return () => io.disconnect();
	});
</script>

<div bind:this={host} style={minHeight ? `min-height: ${minHeight};` : ''}>
	{#if show}
		<slot />
	{/if}
</div>
