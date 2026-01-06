<script>
	export let value = '';
</script>

<h1 class="heading heading-1">
	{#if value}{value}{:else}<slot />{/if}
</h1>

<style>
	.heading {
		font-family: var(--font-primary);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.15;
		color: var(--color-text);
		margin: 0 auto calc(var(--grid) * 2) auto;
		width: calc(100% - (var(--grid) * 4));
		max-width: calc(var(--grid) * 50);
	}
	.heading-1 {
		font-size: calc(var(--grid) * 3.2);
	}
	@media (max-width: 600px) {
		.heading-1 {
			font-size: calc(var(--grid) * 2.6);
		}
	}
</style>
