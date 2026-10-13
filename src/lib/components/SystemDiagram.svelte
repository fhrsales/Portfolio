<script>
	import { reveal } from '$lib/reveal';
	// Two lanes split by the interface: what people see on top, what the system absorbs underneath.
	// seen / hidden: [{ name, text }]
	export let seenLabel = '';
	export let hiddenLabel = '';
	export let seen = [];
	export let hidden = [];
	export let note = '';
</script>

<figure class="system" use:reveal>
	<div class="lane seen">
		<p class="lane-label">{seenLabel}</p>
		<ol class="steps">
			{#each seen as step, i (i)}
				<li class="step">
					<span class="number">{i + 1}</span>
					<h3>{step.name}</h3>
					<p>{step.text}</p>
				</li>
			{/each}
		</ol>
	</div>
	<div class="interface" aria-hidden="true"><span class="line"></span></div>
	<div class="lane under">
		<p class="lane-label">{hiddenLabel}</p>
		<ul class="parts">
			{#each hidden as part, i (i)}
				<li class="part" style={`--i:${i}`}>
					<strong>{part.name}</strong>
					{#if part.text}<span>{part.text}</span>{/if}
				</li>
			{/each}
		</ul>
	</div>
	{#if note}<figcaption>{note}</figcaption>{/if}
</figure>

<style>
	.system {
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-page);
		margin: calc(var(--grid) * 6) auto;
		font-family: var(--font-primary);
		color: var(--color-dark);
	}
	.lane {
		padding: calc(var(--grid) * 4) calc(var(--grid) * 4);
	}
	.lane.seen {
		padding-bottom: calc(var(--grid) * 5);
		border: 1px solid var(--color-rule);
		border-bottom: none;
	}
	.lane.under {
		background: color-mix(in srgb, var(--color-dark) 92%, var(--color-light));
		color: var(--color-light);
	}
	.lane-label {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-primary);
		margin-bottom: calc(var(--grid) * 3);
	}
	.lane.under .lane-label {
		color: color-mix(in srgb, var(--color-light) 70%, transparent);
	}
	.steps {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: calc(var(--grid) * 7);
	}
	.step {
		position: relative;
	}
	/* arrow from one step to the next */
	.step + .step::before {
		content: '';
		position: absolute;
		top: 13px;
		left: calc(var(--grid) * -6);
		width: calc(var(--grid) * 4.5);
		height: 2px;
		background: var(--color-primary);
	}
	.step + .step::after {
		content: '';
		position: absolute;
		top: 9px;
		left: calc(var(--grid) * -2.2);
		width: 8px;
		height: 8px;
		border-top: 2px solid var(--color-primary);
		border-right: 2px solid var(--color-primary);
		transform: rotate(45deg);
	}
	.number {
		display: block;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-primary);
		margin-bottom: calc(var(--grid) * 1);
	}
	h3 {
		font-family: var(--font-display);
		font-size: clamp(24px, 2.6vw, 32px);
		font-weight: 500;
		line-height: 1.1;
		letter-spacing: -0.015em;
	}
	.step p {
		margin-top: calc(var(--grid) * 1);
		font-size: calc(var(--grid) * 1.8);
		line-height: 1.45;
		color: color-mix(in srgb, var(--color-dark) 75%, transparent);
	}
	/* the interface: the accent line everything above rests on */
	.interface {
		height: 4px;
		background: var(--color-rule);
	}
	.interface .line {
		display: block;
		height: 100%;
		background: var(--color-primary);
		transform-origin: left center;
	}
	.parts {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0 calc(var(--grid) * 4);
	}
	.part {
		padding: calc(var(--grid) * 1.5) 0;
		border-top: 1px solid color-mix(in srgb, var(--color-light) 28%, transparent);
		font-size: calc(var(--grid) * 1.7);
		line-height: 1.4;
	}
	.part strong {
		display: block;
		font-weight: 600;
	}
	.part span {
		color: color-mix(in srgb, var(--color-light) 72%, transparent);
	}
	figcaption {
		margin-top: calc(var(--grid) * 2);
		font-family: var(--font-display);
		font-size: calc(var(--grid) * 2.4);
		line-height: 1.3;
		max-width: 26em;
	}

	/* Scroll-driven where supported: the interface draws, then what is underneath surfaces. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.interface .line {
				animation: interface-draw linear both;
				animation-timeline: view();
				animation-range: entry 20% cover 45%;
			}
			.part {
				animation: part-rise linear both;
				animation-timeline: view();
				animation-range: entry 0% entry 70%;
			}
		}
	}
	/* without a scroll timeline: drawn once, on arrival (see $lib/reveal.js) */
	:global(html.reveal-fallback) .interface .line {
		transform: scaleX(0);
		transition: transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	:global(html.reveal-fallback) .part {
		opacity: 0;
		transform: translateY(18px);
		transition:
			opacity 500ms ease,
			transform 500ms ease;
		transition-delay: calc(500ms + var(--i, 0) * 90ms);
	}
	:global(html.reveal-fallback) .system:global(.revealed) .interface .line,
	:global(html.reveal-fallback) .system:global(.revealed) .part {
		opacity: 1;
		transform: none;
	}
	@keyframes interface-draw {
		from {
			transform: scaleX(0);
		}
	}
	@keyframes part-rise {
		from {
			opacity: 0;
			transform: translateY(18px);
		}
	}
	@media (max-width: 760px) {
		.lane {
			padding: calc(var(--grid) * 3) calc(var(--grid) * 2);
		}
		.steps {
			grid-template-columns: minmax(0, 1fr);
			gap: calc(var(--grid) * 5);
		}
		/* stacked: the arrow points down */
		.step + .step::before {
			top: calc(var(--grid) * -4);
			left: 6px;
			width: 2px;
			height: calc(var(--grid) * 2.5);
		}
		.step + .step::after {
			top: calc(var(--grid) * -2.3);
			left: 2px;
			transform: rotate(135deg);
		}
		.parts {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0 calc(var(--grid) * 2);
		}
	}
</style>
