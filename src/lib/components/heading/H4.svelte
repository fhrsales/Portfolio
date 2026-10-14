<script>
	export let value = '';
	// the outline level can differ from the look, as in H3
	export let level = 4;
</script>

<svelte:element this={`h${level}`} class="heading heading-4">
	{#if value}{value}{:else}<slot />{/if}
</svelte:element>

<style>
	.heading {
		font-family: var(--font-display);
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.18;
		color: var(--color-dark);
		margin: 0 auto calc(var(--grid) * 1.2) auto;
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-text);
	}
	.heading-4 {
		font-size: calc(var(--grid) * 2.5);
	}
	@media (max-width: 600px) {
		.heading-4 {
			font-size: calc(var(--grid) * 2.3);
		}
	}
</style>
