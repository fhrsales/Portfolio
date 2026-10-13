<script>
	export let value = '';
</script>

<h4 class="heading heading-4">
	{#if value}{value}{:else}<slot />{/if}
</h4>

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
