<script>
	import { onMount, onDestroy } from 'svelte';
	export let items = [];
	export let title = '';
	export let classes = '';

	let io;
	let pending = [];

	function reveal(node) {
		if (io) {
			io.observe(node);
		} else {
			pending.push(node);
		}
		return {
			destroy() {
				if (io) io.unobserve(node);
				pending = pending.filter((n) => n !== node);
			}
		};
	}

	onMount(() => {
		if (typeof IntersectionObserver === 'undefined') return;
		io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						e.target.classList.add('is-visible');
						io.unobserve(e.target);
					}
				}
			},
			{ threshold: 0.25 }
		);
		pending.forEach((node) => io.observe(node));
		pending = [];
	});

	onDestroy(() => {
		if (io) io.disconnect();
		io = null;
		pending = [];
	});
</script>

<section class={`timeline ${classes || ''}`.trim()}>
	{#if title}
		<h2 class="timeline-title">{title}</h2>
	{/if}
	<ol class="timeline-list">
		{#each items as item, i (i)}
			<li class="timeline-item" use:reveal>
				<span class="timeline-dot" aria-hidden="true"></span>
				<div class="timeline-content">
					{@html item}
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	.timeline {
		width: calc(100% - (var(--grid) * 4));
		max-width: calc(var(--grid) * 50);
		margin: 0 auto calc(var(--grid) * 6) auto;
	}
	.timeline-title {
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 2.2);
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--color-dark);
		margin-bottom: calc(var(--grid) * 3);
	}
	.timeline-list {
		position: relative;
		list-style: none;
		margin: 0;
		padding: 0;
		--dot-size: calc(var(--grid) * 1.1);
		--line-x: 0px;
	}
	.timeline-list::before {
		content: none;
	}
	.timeline-item {
		position: relative;
		padding: 0 0 calc(var(--grid) * 4.5) calc(var(--dot-size) + (var(--grid) * 1.4));
		opacity: 0;
		transition: opacity 420ms ease;
	}
	.timeline-item.is-visible {
		opacity: 1;
	}
	.timeline-item::before {
		content: '';
		position: absolute;
		/* left: var(--line-x); */
        left: -2px;
		top: calc(1.65em + (var(--dot-size) / 10));
		bottom: 0;
		width: 0;
		border-left: 2px solid color-mix(in srgb, var(--color-dark) 100%, transparent);
		opacity: 0.1;
	}
	.timeline-item:last-child::before {
		content: none;
	}
	.timeline-item:last-child {
		padding-bottom: 0;
	}
	.timeline-dot {
		position: absolute;
		left: calc(var(--line-x) - (var(--dot-size) / 2));
		top: 0.55em;
		width: var(--dot-size);
		height: var(--dot-size);
		border-radius: 999px;
		background: var(--color-primary);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary) 10%, transparent);
		z-index: 1;
		animation: timeline-dot-blink 0.8s ease-in-out infinite;
	}
	@keyframes timeline-dot-blink {
		0%,
		100% {
			box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent);
		}
		50% {
			box-shadow:
				0 0 0 7px color-mix(in srgb, var(--color-primary) 10%, transparent),
				0 0 16px color-mix(in srgb, var(--color-primary) 10%, transparent);
		}
	}
	.timeline-content {
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 2.2);
		font-weight: 300;
		line-height: 1.5;
		letter-spacing: -0.035em;
		color: var(--color-dark);
	}
	.timeline-content strong {
		font-weight: 700;
	}

	@media (max-width: 600px) {
		.timeline-item {
			padding-left: calc(var(--dot-size) + (var(--grid) * 1.1));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.timeline-item {
			transition: none;
		}
		.timeline-dot {
			animation: none;
		}
	}
</style>
