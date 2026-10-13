<script>
	import { onMount } from 'svelte';

	// A phone starts alone in the middle; as the page scrolls it moves to the end of a row
	// while the app screens slide out beside it. The phone shows the app's sign-in screen.
	// screens: [{ src, alt }]
	export let screens = [];
	export let signin = '';
	export let signinAlt = '';
	export let signinSmall = '';
	export let color = '#353460';
	export let label = '';

	let el;
	// 0 = phone alone, facing front; 1 = screens fully out. Starts at 1 so it reads without scripts or motion.
	let progress = 1;

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let frame = 0;
		const update = () => {
			frame = 0;
			const rect = el.getBoundingClientRect();
			const view = window.innerHeight || 1;
			// runs while the scene crosses the middle band of the viewport
			const start = view * 0.9;
			const end = view * 0.2;
			progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	});
</script>

<figure
	class="phone-reveal"
	bind:this={el}
	style={`--p:${progress.toFixed(4)}; --brand:${color}; --count:${screens.length}`}
	aria-label={label || undefined}
>
	<div class="scene">
		{#each screens as screen, i (i)}
			<img
				class="screen"
				src={screen.src}
				alt={screen.alt || ''}
				style={`--i:${i}; --d:${((screens.length - 1 - i) * 0.16).toFixed(2)}`}
				loading="lazy"
				decoding="async"
				draggable="false"
			/>
		{/each}
		<div class="phone">
			{#if signin}<img src={signin} srcset={signinSmall ? `${signinSmall} 320w, ${signin} 612w` : undefined} sizes={signinSmall ? '(max-width: 760px) 140px, 236px' : undefined} alt={signinAlt} loading="lazy" decoding="async" draggable="false" />{/if}
		</div>
	</div>
</figure>

<style>
	.phone-reveal {
		--u: clamp(150px, 17vw, 236px); /* width of one screen */
		--step: calc(var(--u) + (var(--grid) * 3)); /* distance between neighbours */
		width: 100%;
		margin: calc(var(--grid) * 6) 0;
		/* clip sideways only: the shadows need room below */
		overflow-x: clip;
		padding: calc(var(--grid) * 4) 0 calc(var(--grid) * 8);
	}
	.scene {
		position: relative;
		height: calc(var(--u) * 2.174);
		perspective: 1800px;
	}
	.phone,
	.screen {
		position: absolute;
		top: 0;
		left: 50%;
		width: var(--u);
		aspect-ratio: 420 / 913;
		margin-left: calc(var(--u) * -0.5);
		border-radius: calc(var(--u) * 0.13);
		will-change: transform;
	}
	/* the phone moves to the right end of the row and turns slightly */
	.phone {
		z-index: 9;
		overflow: hidden;
		border: calc(var(--u) * 0.026) solid color-mix(in srgb, var(--brand) 70%, #9a98c8);
		background: #10111d;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.16),
			0 22px 34px -12px rgba(0, 0, 0, 0.36),
			0 50px 70px -34px rgba(0, 0, 0, 0.46);
		transform: translateX(calc(var(--p) * var(--count) * 0.5 * var(--step)))
			rotateY(calc(var(--p) * -14deg));
	}
	.phone img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	/* each screen slides out to its place in the row, the nearest to the phone first */
	.screen {
		--e: clamp(0, calc((var(--p) - var(--d)) / (1 - var(--d))), 1);
		z-index: calc(1 + var(--i));
		object-fit: cover;
		background: var(--color-tertiary);
		box-shadow: var(--shadow-surface);
		opacity: clamp(0, calc(var(--e) * 3), 1);
		transform: translateX(
				calc((var(--count) * 0.5 - (var(--count) - var(--i)) * var(--e)) * var(--step))
			)
			scale(calc(0.9 + var(--e) * 0.06));
	}
	/* narrow screens: the row overlaps like a hand of cards so it still fits */
	@media (max-width: 760px) {
		.phone-reveal {
			--u: 34vw;
			--step: calc(var(--u) * 0.56);
		}
	}
</style>
