<!-- eslint-disable svelte/no-at-html-tags -->
<script>
	/* eslint-disable svelte/no-at-html-tags */
	import { onMount } from 'svelte';

	// A phone stays fixed while the text steps scroll past; each step swaps the screen.
	// steps: [{ src, eyebrow, title, text }]
	export let steps = [];
	// 'phone' or 'desktop': the frame the screens sit in
	export let device = 'phone';

	let active = 0;
	let stepEls = [];

	onMount(() => {
		const narrow = window.matchMedia('(max-width: 900px)').matches;
		// The step crossing the reading line is the active one.
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) active = Number(entry.target.dataset.index);
				}
			},
			// wide: the middle of the viewport; narrow: the middle of the text area under the phone
			{ rootMargin: narrow ? '-72% 0px -22% 0px' : '-50% 0px -50% 0px', threshold: 0 }
		);
		stepEls.forEach((el) => el && io.observe(el));
		return () => io.disconnect();
	});
</script>

<section class="sticky-screens" class:desktop={device === 'desktop'}>
	<div class="stage">
		<div class="frame">
		<div class="phone">
			{#each steps as step, i (i)}
				<img
					src={step.src}
					alt={i === active ? step.title || step.eyebrow || '' : ''}
					aria-hidden={i === active ? undefined : 'true'}
					class:active={i === active}
					loading="lazy"
					decoding="async"
					draggable="false"
				/>
			{/each}
		</div>
		<p class="counter" aria-hidden="true">{active + 1} / {steps.length}</p>
		</div>
	</div>
	<ol class="steps">
		{#each steps as step, i (i)}
			<li class="step" class:active={i === active} data-index={i} bind:this={stepEls[i]}>
				<div class="card">
					{#if step.eyebrow}<p class="eyebrow">{step.eyebrow}</p>{/if}
					{#if step.title}<h3>{step.title}</h3>{/if}
					{#if step.text}<p class="text">{@html step.text}</p>{/if}
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	.sticky-screens {
		--phone-h: min(68svh, 660px);
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: calc(var(--grid) * 6);
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-page);
		margin: calc(var(--grid) * 4) auto;
		font-family: var(--font-primary);
		color: var(--color-dark);
	}
	.stage {
		position: sticky;
		top: 0;
		height: 100vh;
		height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: calc(var(--grid) * 1.5);
	}
	.phone {
		position: relative;
		height: var(--phone-h);
		aspect-ratio: 420 / 913;
		border-radius: calc(var(--phone-h) * 0.06);
		overflow: hidden;
		background: var(--color-tertiary);
		border: 1px solid rgba(128, 128, 128, 0.3);
		/* surface shadow: translucent black, so it holds on light and dark */
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.1),
			0 18px 30px -10px rgba(0, 0, 0, 0.3),
			0 44px 60px -30px rgba(0, 0, 0, 0.4);
	}
	.phone img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.phone img.active {
		opacity: 1;
	}
	/* the frame holds the screen and its counter; only the screen counts for centring */
	.frame {
		position: relative;
	}
	.desktop .frame {
		width: 100%;
	}
	.counter {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: calc(var(--grid) * 1.5);
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: color-mix(in srgb, var(--color-dark) 60%, transparent);
	}
	.steps {
		list-style: none;
	}
	.step {
		min-height: 80vh;
		min-height: 80svh;
		display: flex;
		align-items: center;
	}
	.step:first-child {
		padding-top: 10svh;
	}
	.step:last-child {
		padding-bottom: 10svh;
	}
	.card {
		max-width: 26em;
		opacity: 0.3;
		transition: opacity 360ms ease;
	}
	.step.active .card {
		opacity: 1;
	}
	/* a link that closes the last step reads as part of the sentence */
	.text :global(a.sublinks) {
		display: inline;
		padding: 0;
		color: var(--color-dark);
		font-weight: 500;
	}
	.eyebrow {
		font-size: calc(var(--grid) * 1.5);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-primary);
		margin-bottom: calc(var(--grid) * 1);
	}
	h3 {
		font-family: var(--font-display);
		font-size: clamp(26px, 3vw, 36px);
		font-weight: 500;
		line-height: 1.12;
		letter-spacing: -0.015em;
		margin-bottom: calc(var(--grid) * 1.5);
	}
	.text {
		font-size: calc(var(--grid) * 2.1);
		font-weight: 300;
		line-height: 1.5;
		letter-spacing: -0.02em;
	}

	/* Small screens: the phone holds the top of the screen and the steps scroll underneath it. */
	@media (max-width: 900px) {
		.sticky-screens {
			--phone-h: 50svh;
			display: block;
			width: 100%;
		}
		.stage {
			top: var(--header-h, 56px);
			height: calc(var(--phone-h) + (var(--grid) * 5));
			z-index: 2;
			justify-content: flex-start;
			padding-top: calc(var(--grid) * 1.5);
			background: linear-gradient(var(--color-light) 92%, transparent);
		}
		.counter {
			display: none;
		}
		.step,
		.step:first-child,
		.step:last-child {
			min-height: 44svh;
			align-items: flex-start;
			padding: calc(var(--grid) * 2) calc(var(--grid) * 2) 0;
		}
		.step:last-child {
			min-height: 30svh;
		}
		.card {
			max-width: none;
		}
		h3 {
			font-size: 24px;
			margin-bottom: calc(var(--grid) * 1);
		}
		.text {
			font-size: 18px;
		}
	}
	/* Desktop screens: a wide window takes most of the row, the steps run in a narrow column. */
	.desktop {
		max-width: 1320px;
		grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
		gap: calc(var(--grid) * 5);
	}
	.desktop .phone {
		height: auto;
		width: 100%;
		aspect-ratio: 16 / 10;
		border-radius: 10px;
		background: #111;
	}
	.desktop .phone img {
		object-fit: cover;
		object-position: top left;
	}
	@media (max-width: 900px) {
		.desktop .stage {
			height: auto;
			padding: calc(var(--grid) * 1.5) calc(var(--grid) * 2) calc(var(--grid) * 3);
		}
		.desktop .phone {
			border-radius: 6px;
		}
		.desktop .step,
		.desktop .step:first-child {
			min-height: 52svh;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.phone img,
		.card {
			transition: none;
		}
	}
</style>
