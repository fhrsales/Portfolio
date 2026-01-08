<script>
	export let value = '';
</script>

<h5 class="heading heading-5">
	{#if value}{value}{:else}<slot />{/if}
</h5>

<style>
	.heading {
		font-family: var(--font-primary);
		font-weight: 600;
		letter-spacing: -0.01em;
		line-height: 1.35;
		color: var(--color-primary);
		margin: 0 auto calc(var(--grid) * 1) auto;
		width: calc(100% - (var(--grid) * 4));
		max-width: calc(var(--grid) * 50);
	}
	.heading-5 {
		font-size: calc(var(--grid) * 2.2);
	}
	@media (max-width: 600px) {
		.heading-5 {
			font-size: calc(var(--grid) * 2.2);
		}
	}
</style>
