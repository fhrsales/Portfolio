<script>
	export let value = '';
</script>

<h2 class="heading heading-2">
	{#if value}{value}{:else}<slot />{/if}
</h2>

<style>
	.heading {
		font-family: var(--font-primary);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.2;
		color: var(--color-primary);
		margin: 0 auto calc(var(--grid) * 2) auto;
		width: calc(100% - (var(--grid) * 4));
		max-width: calc(var(--grid) * 70);
		text-align: center;
	}
	.heading-2 {
		font-size: calc(var(--grid) * 2.8);
	}
	@media (max-width: 600px) {
		.heading-2 {
			font-size: calc(var(--grid) * 2.3);
		}
	}
</style>
