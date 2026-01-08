<script>
	export let value = '';
</script>

<h4 class="heading heading-4">
	{#if value}{value}{:else}<slot />{/if}
</h4>

<style>
	.heading {
		font-family: var(--font-primary);
		font-weight: 600;
		letter-spacing: -0.01em;
		line-height: 1.3;
		color: var(--color-primary);
		margin: 0 auto calc(var(--grid) * 1.2) auto;
		width: calc(100% - (var(--grid) * 4));
		max-width: calc(var(--grid) * 50);
	}
	.heading-4 {
		font-size: calc(var(--grid) * 1.9);
	}
	@media (max-width: 600px) {
		.heading-4 {
			font-size: calc(var(--grid) * 1.6);
		}
	}
</style>
