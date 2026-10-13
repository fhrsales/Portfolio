<script>
	import { onMount } from 'svelte';

	// A career on one time axis: a bar per period and a dot per distinction.
	// periods: [{ from, to, label }]   marks: [{ year, count, label }]
	export let title = '';
	export let note = '';
	export let start = 1997;
	export let end = 2026;
	export let periods = [];
	export let marks = [];

	let el;
	let shown = false;
	// the distinction being read: the last one until a dot is pointed at, focused or tapped
	let picked = -1;
	$: active = picked >= 0 && picked < marks.length ? picked : marks.length - 1;

	$: span = Math.max(1, end - start);
	const pct = (year) => ((year - start) / span) * 100;
	$: ticks = Array.from(
		{ length: Math.floor(end / 5) - Math.ceil(start / 5) + 1 },
		(_, i) => (Math.ceil(start / 5) + i) * 5
	);
	$: total = marks.reduce((sum, mark) => sum + mark.count, 0);

	onMount(() => {
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					shown = true;
					io.disconnect();
				}
			},
			{ threshold: 0.25 }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<figure class="career" class:shown bind:this={el}>
	{#if title}<h2>{title}</h2>{/if}
	<div
		class="chart"
		role="img"
		aria-label={`${title}. ${periods.map((p) => `${p.label}, ${p.from} a ${p.to}`).join('; ')}. ${total} distinções entre ${marks[0]?.year} e ${marks[marks.length - 1]?.year}.`}
	>
		<div class="row marks">
			<span class="label">{total}</span>
			<div class="track">
				{#each marks as mark, i (i)}
					<button
						type="button"
						class="mark"
						class:active={i === active}
						style={`left:${pct(mark.year)}%; --i:${i}`}
						aria-label={`${mark.year}: ${mark.label}`}
						aria-pressed={i === active}
						on:mouseenter={() => (picked = i)}
						on:focus={() => (picked = i)}
						on:click={() => (picked = i)}
					>
						{#each Array.from({ length: mark.count }, (_, n) => n) as n (n)}
							<span class="dot"></span>
						{/each}
						<span class="year">{String(mark.year).slice(2)}</span>
					</button>
				{/each}
			</div>
		</div>
		{#if marks[active]}
			<div class="row readout" aria-live="polite">
				<span class="label"></span>
				<p><strong>{marks[active].year}</strong> {marks[active].label}</p>
			</div>
		{/if}
		{#each periods as period, i (i)}
			<div class="row" class:current={marks[active] && marks[active].year >= period.from && marks[active].year <= period.to}>
				<span class="label">{period.label}</span>
				<div class="track">
					<span
						class="bar"
						style={`left:${pct(period.from)}%; width:${pct(period.to) - pct(period.from)}%; --i:${i}`}
					></span>
				</div>
			</div>
		{/each}
		<div class="row axis" aria-hidden="true">
			<span class="label"></span>
			<div class="track">
				{#each ticks as tick (tick)}
					<span class="tick" style={`left:${pct(tick)}%`}>{tick}</span>
				{/each}
			</div>
		</div>
	</div>
	{#if note}<figcaption>{note}</figcaption>{/if}
</figure>

<style>
	.career {
		width: calc(100% - (var(--grid) * 4));
		max-width: 860px;
		margin: calc(var(--grid) * 8) auto;
		font-family: var(--font-primary);
		color: var(--color-dark);
	}
	h2 {
		font-family: var(--font-display);
		font-size: calc(var(--grid) * 3);
		font-weight: 500;
		line-height: 1.15;
		letter-spacing: -0.015em;
		margin-bottom: calc(var(--grid) * 3);
	}
	.row {
		display: grid;
		grid-template-columns: 190px minmax(0, 1fr);
		align-items: center;
		gap: calc(var(--grid) * 2);
		min-height: 30px;
	}
	.label {
		font-size: 14px;
		line-height: 1.25;
	}
	.track {
		position: relative;
		height: 100%;
		min-height: 30px;
		border-left: 1px solid var(--color-rule);
	}
	.bar {
		position: absolute;
		top: 50%;
		height: 10px;
		margin-top: -5px;
		background: var(--color-dark);
		transform-origin: left center;
	}
	/* dots stack upward from the baseline of their year */
	.marks {
		align-items: end;
		margin-bottom: calc(var(--grid) * 1);
	}
	.marks .label {
		font-family: var(--font-display);
		font-size: 44px;
		line-height: 1;
		color: var(--color-primary);
	}
	.marks .track {
		height: 110px;
		border-left: none;
		border-bottom: 1px solid var(--color-dark);
	}
	.mark {
		position: absolute;
		bottom: 0;
		width: 10px;
		border: 0;
		background: none;
		font: inherit;
		cursor: pointer;
		/* a finger-sized target around a 10px column of dots */
		box-sizing: content-box;
		padding: 0 9px 4px;
		margin-left: -14px;
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		gap: 3px;
		min-height: 40px;
	}
	.mark:focus-visible {
		outline: 2px solid var(--color-dark);
		outline-offset: 2px;
	}
	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--color-primary);
		opacity: 0.45;
		transition:
			opacity 180ms ease,
			transform 180ms ease;
	}
	.mark.active .dot {
		opacity: 1;
		transform: scale(1.15);
	}
	.mark.active .year {
		color: var(--color-dark);
	}
	.readout {
		min-height: 0;
		margin: calc(var(--grid) * 2.5) 0 calc(var(--grid) * 1.5);
		align-items: start;
	}
	.readout p {
		font-size: 15px;
		line-height: 1.4;
		min-height: 2.8em;
	}
	.readout strong {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 500;
		color: var(--color-primary);
		margin-right: 6px;
	}
	.bar {
		opacity: 0.35;
		transition: opacity 220ms ease;
	}
	.current .bar {
		opacity: 1;
	}
	.current .label {
		font-weight: 600;
	}
	.year {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		padding-top: 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-primary);
	}
	.axis {
		min-height: 24px;
		margin-top: calc(var(--grid) * 1.5);
	}
	.axis .track {
		min-height: 24px;
		border-left: none;
		border-top: 1px solid var(--color-rule);
	}
	.tick {
		position: absolute;
		top: 6px;
		transform: translateX(-50%);
		font-size: 12px;
		color: color-mix(in srgb, var(--color-dark) 65%, transparent);
	}
	figcaption {
		margin-top: calc(var(--grid) * 2);
		font-size: 14px;
		line-height: 1.45;
		color: color-mix(in srgb, var(--color-dark) 65%, transparent);
		max-width: var(--w-text);
	}

	/* entrance: bars draw from the left, then the dots land year by year */
	@media (prefers-reduced-motion: no-preference) {
		.bar {
			transform: scaleX(0);
			transition:
				transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1) calc(var(--i) * 110ms),
				opacity 220ms ease;
		}
		.mark {
			opacity: 0;
			transform: translateY(-10px);
			transition:
				opacity 360ms ease,
				transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
			transition-delay: calc(600ms + var(--i) * 90ms);
		}
		.shown .bar {
			transform: none;
		}
		.shown .mark {
			opacity: 1;
			transform: none;
		}
	}
	@media (max-width: 700px) {
		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 2px;
			margin-bottom: calc(var(--grid) * 1);
		}
		.track,
		.row {
			min-height: 18px;
		}
		.marks .label {
			font-size: 36px;
			margin-bottom: calc(var(--grid) * 1);
		}
		.marks .track {
			height: 96px;
		}
		/* room for the year labels that hang under the baseline */
		.row.marks {
			margin-bottom: calc(var(--grid) * 3);
		}
		.year {
			font-size: 10px;
		}
		.dot,
		.mark {
			width: 8px;
		}
		.dot {
			height: 8px;
		}
		.mark {
			padding: 0 7px 4px;
			margin-left: -11px;
		}
		.readout {
			margin-top: calc(var(--grid) * 4);
		}
		.axis .label {
			display: none;
		}
	}
</style>
