<script>
	export let classes = '';
</script>

<div class={`divider ${classes || ''}`.trim()} aria-hidden="true"></div>

<style>
	.divider {
		width: calc(100% - (var(--grid) * 4));
		max-width: calc(var(--grid) * 150);
		height: 1px;
		margin: calc(var(--grid) * 4) auto;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--color-dark) 55%, transparent),
			transparent
		);
	}
	@media (max-width: 600px) {
		.divider {
			margin: calc(var(--grid) * 3) auto;
		}
	}
</style>
