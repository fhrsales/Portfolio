<script>
	/* eslint-disable svelte/no-at-html-tags */
	import { onMount } from 'svelte';

	// A page or infographic stays fixed while notes scroll past; each note moves in on the part
	// of the picture it talks about. The first view is always the whole picture.
	// steps: [{ x, y, zoom, text }]  — x and y are the centre of the detail, in % of the picture.
	export let src = '';
	export let alt = '';
	export let ratio = 0;
	export let steps = [];
	export let caption = '';

	let active = -1;
	let stepEls = [];

	// Where the picture has to sit so that (x, y) is in the middle at this zoom, without
	// ever showing past its own edges.
	function frame(step) {
		if (!step) return 'translate(0, 0) scale(1)';
		const zoom = Math.max(1, Number(step.zoom) || 1);
		const clamp = (v) => Math.min(0, Math.max(100 * (1 - zoom), v));
		const tx = clamp(50 - (Number(step.x) || 50) * zoom);
		const ty = clamp(50 - (Number(step.y) || 50) * zoom);
		return `translate(${tx}%, ${ty}%) scale(${zoom})`;
	}

	onMount(() => {
		const narrow = window.matchMedia('(max-width: 900px)').matches;
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const index = Number(entry.target.dataset.index);
					if (entry.isIntersecting) active = index;
					// scrolling back up past the first note returns to the whole picture
					else if (index === 0 && active === 0 && entry.boundingClientRect.top > 0) active = -1;
				}
			},
			{ rootMargin: narrow ? '-72% 0px -22% 0px' : '-50% 0px -50% 0px', threshold: 0 }
		);
		stepEls.forEach((el) => el && io.observe(el));
		return () => io.disconnect();
	});
</script>

<section class="tour">
	<figure class="stage">
		<div class="window" style={ratio ? `aspect-ratio:${ratio}` : undefined}>
			<img {src} {alt} style={`transform:${frame(steps[active])}`} decoding="async" draggable="false" />
		</div>
		<figcaption>
			{#if steps.length}
				<span class="count" aria-hidden="true"
					>{Math.max(active + 1, 0)} / {steps.length}</span
				>
			{/if}
			{#if caption}<span>{caption}</span>{/if}
		</figcaption>
	</figure>
	<ol class="notes">
		{#each steps as step, i (i)}
			<li bind:this={stepEls[i]} data-index={i} class:current={i === active}>
				<p>{@html step.text}</p>
			</li>
		{/each}
	</ol>
</section>

<style>
	.tour {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
		gap: calc(var(--grid) * 6);
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-page);
		margin: calc(var(--grid) * 8) auto;
		font-family: var(--font-primary);
		color: var(--color-dark);
	}
	.stage {
		position: sticky;
		top: 10vh;
		align-self: start;
		margin: 0;
	}
	.window {
		overflow: hidden;
		max-height: 76vh;
		background: #fbfaf7;
		box-shadow: var(--shadow-surface);
	}
	img {
		display: block;
		width: 100%;
		transform-origin: 0 0;
		transition: transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
		will-change: transform;
	}
	figcaption {
		display: flex;
		gap: calc(var(--grid) * 1.5);
		margin-top: calc(var(--grid) * 1.25);
		font-size: calc(var(--grid) * 1.6);
		line-height: 1.45;
		color: color-mix(in srgb, var(--color-dark) 68%, transparent);
	}
	.count {
		flex-shrink: 0;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--color-primary);
	}
	.notes {
		list-style: none;
	}
	.notes li {
		min-height: 80vh;
		display: flex;
		align-items: center;
		opacity: 0.35;
		transition: opacity 360ms ease;
	}
	.notes li.current {
		opacity: 1;
	}
	.notes p {
		font-size: calc(var(--grid) * 2.2);
		line-height: 1.5;
		letter-spacing: -0.01em;
	}
	.notes :global(strong) {
		display: block;
		margin-bottom: calc(var(--grid) * 0.75);
		font-family: var(--font-display);
		font-size: calc(var(--grid) * 2.8);
		font-weight: 500;
		line-height: 1.15;
		letter-spacing: -0.015em;
	}
	@media (max-width: 900px) {
		.tour {
			grid-template-columns: minmax(0, 1fr);
			gap: 0;
		}
		/* the picture holds the top of the screen and the notes pass underneath it */
		.stage {
			top: 0;
			z-index: 1;
			margin: 0 calc(var(--grid) * -2);
			padding: calc(var(--grid) * 2) calc(var(--grid) * 2) calc(var(--grid) * 1.5);
			background: var(--color-light);
		}
		.window {
			max-height: 52vh;
			max-height: 52svh;
		}
		.notes li {
			min-height: 62vh;
			min-height: 62svh;
			align-items: flex-start;
			padding-top: calc(var(--grid) * 4);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		img,
		.notes li {
			transition: none;
		}
	}
</style>
