<script>
	import { reveal } from '$lib/reveal';
	// Two lines of work that meet in one result: each lane is a column of steps, and both
	// feed the steps listed in `end`. left / right / end: [{ name, text }]
	export let title = '';
	export let leftLabel = '';
	export let rightLabel = '';
	export let left = [];
	export let right = [];
	export let end = [];
	export let note = '';
</script>

<figure class="pipeline" use:reveal>
	{#if title}<h2>{title}</h2>{/if}
	<div class="lanes">
		{#each [[leftLabel, left], [rightLabel, right]] as [label, steps], lane (lane)}
			<div class="lane">
				{#if label}<p class="lane-label">{label}</p>{/if}
				<ol>
					{#each steps as step, i (i)}
						<li style={`--i:${i}`}>
							<span class="node">{step.name}</span>
							{#if step.text}<span class="about">{step.text}</span>{/if}
						</li>
					{/each}
				</ol>
				<span class="rest" aria-hidden="true"></span>
			</div>
		{/each}
	</div>
	<div class="join" aria-hidden="true"></div>
	<ol class="end">
		{#each end as step, i (i)}
			<li class:last={i === end.length - 1}>
				<span class="node">{step.name}</span>
				{#if step.text}<span class="about">{step.text}</span>{/if}
			</li>
		{/each}
	</ol>
	{#if note}<figcaption>{note}</figcaption>{/if}
</figure>

<style>
	.pipeline {
		--line: color-mix(in srgb, var(--color-dark) 55%, transparent);
		width: calc(100% - (var(--grid) * 4));
		max-width: 760px;
		margin: calc(var(--grid) * 6) auto;
		font-family: var(--font-primary);
		color: var(--color-dark);
	}
	h2 {
		font-family: var(--font-display);
		font-size: calc(var(--grid) * 2.8);
		font-weight: 500;
		line-height: 1.15;
		letter-spacing: -0.015em;
		text-align: center;
		margin-bottom: calc(var(--grid) * 4);
	}
	.lanes {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.lane {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 0 calc(var(--grid) * 1.5);
	}
	.lane-label {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-primary);
		margin-bottom: calc(var(--grid) * 2);
	}
	ol {
		list-style: none;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	li {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	/* the line that carries one step into the next */
	.lane li::after,
	.end li:not(.last)::after {
		content: '';
		width: 2px;
		height: calc(var(--grid) * 3);
		background: var(--line);
	}
	.rest {
		flex: 1;
		width: 2px;
		min-height: 0;
		background: var(--line);
	}
	.node {
		display: inline-block;
		padding: 7px 16px;
		border: 2px solid var(--color-dark);
		border-radius: 999px;
		font-size: 15px;
		font-weight: 600;
		line-height: 1.2;
		background: var(--color-light);
	}
	.about {
		display: block;
		max-width: 20em;
		margin-top: 6px;
		font-size: 13px;
		line-height: 1.35;
		color: color-mix(in srgb, var(--color-dark) 68%, transparent);
	}
	.lane li:has(.about)::after {
		margin-top: 6px;
	}
	/* both lanes drop into one line */
	.join {
		position: relative;
		width: 50%;
		height: calc(var(--grid) * 3);
		margin: 0 auto;
		border: 2px solid var(--line);
		border-top: none;
		border-radius: 0 0 14px 14px;
	}
	.join::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 100%;
		width: 2px;
		height: calc(var(--grid) * 3);
		margin-left: -1px;
		background: var(--line);
	}
	.end {
		margin-top: calc(var(--grid) * 3);
		text-align: center;
	}
	.end .node {
		background: var(--color-dark);
		color: var(--color-light);
	}
	.end .last .node {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: var(--color-on-primary);
	}
	figcaption {
		margin-top: calc(var(--grid) * 3);
		font-size: 14px;
		line-height: 1.45;
		color: color-mix(in srgb, var(--color-dark) 65%, transparent);
	}

	/* Scroll-driven where supported: the steps arrive in order, then the two lanes join. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.lane li {
				animation: step-in linear both;
				animation-timeline: view();
				animation-range: entry 0% entry 80%;
			}
			.join {
				animation: join-in linear both;
				animation-timeline: view();
				animation-range: entry 0% cover 30%;
			}
			.end li {
				animation: step-in linear both;
				animation-timeline: view();
				animation-range: entry 20% entry 100%;
			}
		}
	}
	/* without a scroll timeline: the steps arrive once, in order, on arrival (see $lib/reveal.js) */
	:global(html.reveal-fallback) .lane li,
	:global(html.reveal-fallback) .end li,
	:global(html.reveal-fallback) .join {
		opacity: 0;
		transition:
			opacity 500ms ease,
			transform 500ms ease;
		transition-delay: calc(var(--i, 0) * 140ms);
	}
	:global(html.reveal-fallback) .lane li,
	:global(html.reveal-fallback) .end li {
		transform: translateY(-14px);
	}
	:global(html.reveal-fallback) .join {
		transition-delay: 450ms;
	}
	:global(html.reveal-fallback) .end li {
		transition-delay: 700ms;
	}
	:global(html.reveal-fallback) .pipeline:global(.revealed) .lane li,
	:global(html.reveal-fallback) .pipeline:global(.revealed) .end li,
	:global(html.reveal-fallback) .pipeline:global(.revealed) .join {
		opacity: 1;
		transform: none;
	}
	@keyframes step-in {
		from {
			opacity: 0;
			transform: translateY(-14px);
		}
	}
	@keyframes join-in {
		from {
			opacity: 0;
			clip-path: inset(0 0 100% 0);
		}
		to {
			clip-path: inset(0 0 -40px 0);
		}
	}
	@media (max-width: 600px) {
		.node {
			font-size: 13px;
			padding: 6px 11px;
		}
		.lane {
			padding: 0 4px;
		}
		.about {
			font-size: 12px;
		}
	}
</style>
