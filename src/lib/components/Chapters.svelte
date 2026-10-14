<script>
	import { reveal } from '$lib/reveal';
	// A career as a vertical timeline: a spine that fills as the page scrolls,
	// and for each chapter a period, a few lines and, when there is one, a piece of work from those years.
	// chapters: [{ name, period, text, src, ratio, caption, paper, mark: { x, y, size, label } }]
	export let title = '';
	export let chapters = [];
</script>

<section class="chapters">
	{#if title}<h2>{title}</h2>{/if}
	<ol>
		<span class="spine" aria-hidden="true"><span class="fill"></span></span>
		{#each chapters as chapter, i (i)}
			<li class="chapter" class:with-media={!!chapter.src} use:reveal>
				<div class="copy">
					<p class="period">{chapter.period}</p>
					<h3>{chapter.name}</h3>
					<p class="text">{chapter.text}</p>
				</div>
				{#if chapter.src}
					<figure class:paper={chapter.paper}>
						<div
							class="shot"
							class:marked={!!chapter.mark}
							class:single={chapter.ratio > 0 && chapter.ratio < 1}
							style={chapter.ratio ? `--r:${chapter.ratio}` : undefined}
						>
							<img
								src={chapter.src}
								alt={chapter.caption || `${chapter.name}, ${chapter.period}`}
								loading="lazy"
								decoding="async"
								draggable="false"
							/>
							{#if chapter.mark}
								<span
									class="mark"
									style={`left:${chapter.mark.x}%; top:${chapter.mark.y}%; width:${chapter.mark.size}%`}
								>
									{#if chapter.mark.label}<span class="mark-label">{chapter.mark.label}</span>{/if}
								</span>
							{/if}
						</div>
						{#if chapter.caption}<figcaption>{chapter.caption}</figcaption>{/if}
					</figure>
				{/if}
			</li>
		{/each}
	</ol>
</section>

<style>
	.chapters {
		width: calc(100% - (var(--grid) * 4));
		max-width: 980px;
		margin: calc(var(--grid) * 8) auto;
		font-family: var(--font-primary);
		color: var(--color-dark);
	}
	h2 {
		font-family: var(--font-display);
		font-size: calc(var(--grid) * 3.4);
		font-weight: 500;
		line-height: 1.12;
		letter-spacing: -0.015em;
		margin-bottom: calc(var(--grid) * 5);
	}
	ol {
		position: relative;
		list-style: none;
		padding-left: calc(var(--grid) * 4);
	}
	.spine {
		position: absolute;
		left: 4px;
		top: 6px;
		bottom: 0;
		width: 2px;
		background: var(--color-rule);
	}
	.fill {
		position: absolute;
		inset: 0;
		background: var(--color-primary);
		transform-origin: top center;
	}
	.chapter {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: calc(var(--grid) * 3) calc(var(--grid) * 6);
		align-items: center;
		padding-bottom: calc(var(--grid) * 9);
	}
	.chapter.with-media {
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	}
	.chapter:last-child {
		padding-bottom: 0;
	}
	/* the dot that pins each chapter to the spine */
	.chapter::before {
		content: '';
		position: absolute;
		left: calc(var(--grid) * -4);
		top: 6px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--color-primary);
		box-shadow: 0 0 0 4px var(--color-light);
	}
	.copy {
		max-width: 30em;
	}
	.period {
		font-family: var(--font-display);
		font-size: clamp(30px, 4vw, 46px);
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--color-primary);
	}
	h3 {
		margin-top: calc(var(--grid) * 1.25);
		font-size: calc(var(--grid) * 2.2);
		font-weight: 600;
		line-height: 1.25;
	}
	.text {
		margin-top: calc(var(--grid) * 1);
		font-size: calc(var(--grid) * 2);
		line-height: 1.55;
		letter-spacing: -0.01em;
	}
	figure img {
		display: block;
		width: 100%;
		max-height: 420px;
		object-fit: contain;
		object-position: center;
	}
	/* an annotation pinned to a point of the picture: a ring on the spot and a label above it */
	.shot {
		position: relative;
	}
	.shot.marked img {
		max-height: none;
		height: auto;
	}
	.mark {
		position: absolute;
		aspect-ratio: 1;
		transform: translate(-50%, -50%);
		border: 2px solid #fff;
		border-radius: 50%;
		box-shadow:
			0 0 0 1px rgba(0, 0, 0, 0.35),
			inset 0 0 0 1px rgba(0, 0, 0, 0.35);
	}
	.mark-label {
		position: absolute;
		left: 50%;
		bottom: calc(100% + 14px);
		transform: translateX(-50%);
		padding: 3px 8px;
		background: #fff;
		color: #121214;
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}
	.mark-label::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 100%;
		width: 1px;
		height: 14px;
		background: #fff;
	}
	/* A printed page: the paper margin and shadow go on the frame, whose width follows the page's
	   own proportion, so no browser has to guess the width of a height-limited image. */
	figure.paper .shot {
		--page-h: 404px;
		width: min(100%, calc(var(--page-h) * var(--r, 1) + 16px));
		margin: 0 auto;
		border: 8px solid #fff;
		background: #fff;
		box-shadow: var(--shadow-surface);
	}
	/* single pages share one width, so a squarer page (a tabloid cover) does not look bigger
	   than a broadsheet; spreads keep the shared height */
	figure.paper .shot.single {
		width: min(100%, calc(var(--page-h) * 0.565 + 16px));
	}
	figure.paper img {
		height: auto;
		max-height: none;
	}
	figcaption {
		margin-top: calc(var(--grid) * 1.5);
		font-size: 14px;
		line-height: 1.45;
		color: color-mix(in srgb, var(--color-dark) 68%, transparent);
	}

	/* Scroll-driven where supported: the spine fills, chapters rise, images drift. Static everywhere else. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.fill {
				animation: spine-fill linear both;
				animation-timeline: view();
				animation-range: entry 30% exit 55%;
			}
			.copy {
				animation: chapter-rise linear both;
				animation-timeline: view();
				animation-range: entry 0% entry 45%;
			}
			figure {
				animation: chapter-drift linear both;
				animation-timeline: view();
			}
		}
	}
	/* without a scroll timeline: each chapter rises once, on arrival (see $lib/reveal.js) */
	:global(html.reveal-fallback) .copy {
		opacity: 0;
		transform: translateY(28px);
		transition:
			opacity 600ms ease,
			transform 600ms ease;
	}
	:global(html.reveal-fallback) .chapter:global(.revealed) .copy {
		opacity: 1;
		transform: none;
	}
	@keyframes spine-fill {
		from {
			transform: scaleY(0);
		}
	}
	@keyframes chapter-rise {
		from {
			opacity: 0;
			transform: translateY(28px);
		}
	}
	@keyframes chapter-drift {
		from {
			transform: translateY(36px);
		}
		to {
			transform: translateY(-36px);
		}
	}
	@media (max-width: 760px) {
		.chapter.with-media {
			grid-template-columns: minmax(0, 1fr);
		}
		.chapter {
			padding-bottom: calc(var(--grid) * 7);
		}
		figure img {
			max-height: 320px;
		}
		figure.paper .shot {
			--page-h: 304px;
		}
	}
</style>
