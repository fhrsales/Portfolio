<script>
	// An edge-to-edge row of work that drifts sideways; it stops when someone points at it.
	// items: [{ src, alt, width, height, smallSrc, smallWidth }]
	export let items = [];
	// seconds for one full pass
	export let duration = 80;

	// the strip's height is set in CSS, so each image's width on screen is that height times its ratio
	const sizes = (item) => {
		const ratio = (item.width / item.height).toFixed(3);
		return `(max-width: 600px) calc(42vh * ${ratio}), calc(clamp(240px, 46vh, 440px) * ${ratio})`;
	};
</script>

<div class="work-strip" style={`--duration:${duration}s`}>
	<div class="track">
		{#each [0, 1] as copy (copy)}
			<div class="set" aria-hidden={copy === 1 ? 'true' : undefined}>
				{#each items as item, i (i)}
					<img
						src={item.src}
						srcset={item.smallSrc && item.width && item.height
							? `${item.smallSrc} ${item.smallWidth}w, ${item.src} ${item.width}w`
							: undefined}
						sizes={item.smallSrc && item.width && item.height ? sizes(item) : undefined}
						alt={copy === 0 ? item.alt : ''}
						width={item.width || undefined}
						height={item.height || undefined}
						loading={copy === 0 && i < 2 ? 'eager' : 'lazy'}
						fetchpriority={copy === 0 && i === 0 ? 'high' : undefined}
						decoding="async"
						draggable="false"
					/>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.work-strip {
		--strip-h: clamp(240px, 46vh, 440px);
		--gap: 10px;
		width: 100%;
		overflow: hidden;
		margin: calc(var(--grid) * 4) 0 calc(var(--grid) * 6);
	}
	.track {
		display: flex;
		width: max-content;
		animation: strip-drift var(--duration) linear infinite;
	}
	.work-strip:hover .track {
		animation-play-state: paused;
	}
	.set {
		display: flex;
		gap: var(--gap);
		padding-right: var(--gap);
	}
	img {
		display: block;
		height: var(--strip-h);
		width: auto;
		background: color-mix(in srgb, var(--color-dark) 6%, transparent);
	}
	@keyframes strip-drift {
		to {
			transform: translateX(-50%);
		}
	}
	@media (max-width: 600px) {
		.work-strip {
			--strip-h: 42vh;
			--gap: 6px;
		}
	}
	/* Without motion it becomes a row the reader scrolls by hand. */
	@media (prefers-reduced-motion: reduce) {
		.work-strip {
			overflow-x: auto;
		}
		.track {
			animation: none;
		}
		.set[aria-hidden='true'] {
			display: none;
		}
	}
</style>
