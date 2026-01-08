<script>
	export let value = '';
</script>

<h3 class="heading heading-3">
	{#if value}{value}{:else}<slot />{/if}
</h3>

<style>
	.heading {
		font-family: var(--font-primary);
		font-weight: 600;
		letter-spacing: -0.015em;
		line-height: 1.25;
		color: var(--color-dark);
		margin: calc(var(--grid) * 3) auto calc(var(--grid) * 1.5) auto;
		width: calc(100% - (var(--grid) * 4));
		max-width: calc(var(--grid) * 50);
		/* text-align: center; */
	}
	.heading-3 {
		font-size: calc(var(--grid) * 2.3);
	}
	@media (max-width: 600px) {
		.heading-3 {
			font-size: calc(var(--grid) * 2.0);
		}
	}
</style>
