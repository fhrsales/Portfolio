<script>
	import { onMount } from 'svelte';

	// A row of figures that count up once, when they first come into view.
	// items: [{ value: '6,359', label }]  — the value keeps its own separators, prefix and suffix.
	export let items = [];
	export let note = '';

	let el;
	// 1 = final values. It only drops to 0 once the script knows it can animate them back up.
	let t = 1;

	// Split '97.4%' into the number and what surrounds it, remembering how it was written.
	function read(value) {
		const match = String(value).match(/^(\D*)([\d.,]+)(.*)$/);
		if (!match) return null;
		const [, prefix, digits, suffix] = match;
		const last = Math.max(digits.lastIndexOf('.'), digits.lastIndexOf(','));
		// a separator followed by exactly three digits groups thousands; anything else marks decimals
		const decimals = last >= 0 && digits.length - last - 1 !== 3 ? digits.length - last - 1 : 0;
		const decimalMark = decimals ? digits[last] : '';
		const groupMark = (digits.slice(0, decimals ? last : undefined).match(/[.,]/) || [''])[0];
		const number = Number(digits.replace(/[.,]/g, (mark) => (mark === decimalMark ? '.' : '')));
		return { prefix, suffix, number, decimals, decimalMark, groupMark };
	}

	function show(value, progress) {
		const parts = read(value);
		if (!parts || progress >= 1) return value;
		const [whole, fraction] = (parts.number * progress).toFixed(parts.decimals).split('.');
		const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, parts.groupMark);
		return parts.prefix + grouped + (fraction ? parts.decimalMark + fraction : '') + parts.suffix;
	}

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let frame = 0;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				io.disconnect();
				const started = performance.now();
				const tick = (now) => {
					const linear = Math.min(1, (now - started) / 1400);
					t = 1 - Math.pow(1 - linear, 3); // fast at first, settling at the end
					if (linear < 1) frame = requestAnimationFrame(tick);
				};
				t = 0;
				frame = requestAnimationFrame(tick);
			},
			{ threshold: 0.4 }
		);
		io.observe(el);
		return () => {
			io.disconnect();
			if (frame) cancelAnimationFrame(frame);
		};
	});
</script>

<figure class="figures" class:many={items.length > 4} bind:this={el} style={`--count:${items.length}; --half:${Math.ceil(items.length / 2)}`}>
	<dl>
		{#each items as item, i (i)}
			<div class="figure">
				<dt aria-label={item.value}>{show(item.value, t)}</dt>
				<dd>{item.label}</dd>
			</div>
		{/each}
	</dl>
	{#if note}<figcaption>{note}</figcaption>{/if}
</figure>

<style>
	.figures {
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-page);
		margin: calc(var(--grid) * 5) auto;
		font-family: var(--font-primary);
		color: var(--color-dark);
	}
	dl {
		display: grid;
		/* every figure on one line; narrower screens split them into even rows */
		grid-template-columns: repeat(var(--count), minmax(0, 1fr));
		border-top: 2px solid var(--color-dark);
	}
	.figure {
		padding: calc(var(--grid) * 2) calc(var(--grid) * 2.5) calc(var(--grid) * 2.5) 0;
		border-bottom: 1px solid var(--color-rule);
	}
	dt {
		font-family: var(--font-display);
		font-size: clamp(34px, 4.2vw, 54px);
		font-weight: 500;
		line-height: 1;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		color: var(--color-primary);
	}
	dd {
		margin-top: calc(var(--grid) * 1);
		font-size: calc(var(--grid) * 1.7);
		line-height: 1.4;
		color: color-mix(in srgb, var(--color-dark) 75%, transparent);
		max-width: 18em;
	}
	.many dt {
		font-size: clamp(30px, 3.5vw, 44px);
	}
	.many dd {
		font-size: calc(var(--grid) * 1.6);
	}
	@media (max-width: 1000px) {
		dl {
			grid-template-columns: repeat(var(--half), minmax(0, 1fr));
		}
	}
	@media (max-width: 560px) {
		dl {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	figcaption {
		margin-top: calc(var(--grid) * 1.5);
		font-size: 14px;
		line-height: 1.45;
		color: color-mix(in srgb, var(--color-dark) 65%, transparent);
	}
</style>
