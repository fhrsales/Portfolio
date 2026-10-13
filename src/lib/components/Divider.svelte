<script>
	export let classes = '';
</script>

<div class={`divider ${classes || ''}`.trim()} aria-hidden="true"></div>

<style>
	/* A section break: a full rule across the text column, with clear air above it and less below,
	   so the rule reads as the top edge of what follows. */
	.divider {
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-text);
		height: 0;
		margin: calc(var(--grid) * 11) auto calc(var(--grid) * 5);
		border-top: 2px solid var(--color-dark);
	}
	/* drawn from the left as it comes into view, where the browser can follow the scroll */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.divider {
				transform-origin: left center;
				animation: divider-draw linear both;
				animation-timeline: view();
				animation-range: entry 10% entry 90%;
			}
		}
	}
	@keyframes divider-draw {
		from {
			transform: scaleX(0);
		}
	}
	@media (max-width: 600px) {
		.divider {
			margin: calc(var(--grid) * 8) auto calc(var(--grid) * 4);
		}
	}
</style>
