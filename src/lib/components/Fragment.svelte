<script>
	// A detail cut from a larger piece, shown edge to edge. It drifts sideways as the page scrolls.
	export let src = '';
	export let alt = '';
	export let caption = '';
	export let height = '';
</script>

<figure class="fragment">
	<div class="window" style={height ? `height:${height}` : undefined}>
		<img {src} {alt} loading="lazy" decoding="async" draggable="false" />
	</div>
	{#if caption}<figcaption>{caption}</figcaption>{/if}
</figure>

<style>
	.fragment {
		width: 100%;
		margin: calc(var(--grid) * 7) 0;
	}
	.window {
		height: clamp(200px, 42vh, 460px);
		overflow: hidden;
		background: #fbfaf7;
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 50%;
	}
	figcaption {
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-text);
		margin: calc(var(--grid) * 1.25) auto 0;
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 1.6);
		line-height: 1.4;
		color: color-mix(in srgb, var(--color-dark) 65%, transparent);
	}
	/* Scroll-driven pan where the browser supports it; a still image everywhere else. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			img {
				animation: fragment-pan linear both;
				animation-timeline: view();
			}
		}
	}
	@keyframes fragment-pan {
		from {
			object-position: 20% 50%;
		}
		to {
			object-position: 80% 50%;
		}
	}
</style>
