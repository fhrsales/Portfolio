<script>
	export let value = '';
	// the outline level can differ from the look: a subhead with no section above it is an h2
	export let level = 3;
</script>

<svelte:element this={`h${level}`} class="heading heading-3">
	{#if value}{value}{:else}<slot />{/if}
</svelte:element>

<style>
	.heading {
		font-family: var(--font-display);
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.15;
		color: var(--color-dark);
		margin: calc(var(--grid) * 3) auto calc(var(--grid) * 1.5) auto;
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-text);
		/* text-align: center; */
	}
	.heading-3 {
		font-size: calc(var(--grid) * 2.8);
	}
	@media (max-width: 600px) {
		.heading-3 {
			font-size: calc(var(--grid) * 2.6);
		}
	}
</style>
