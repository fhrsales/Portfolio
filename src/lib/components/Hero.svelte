<!-- eslint-disable svelte/no-at-html-tags -->
<script>
	/* eslint-disable svelte/no-at-html-tags */
	export let eyebrow = '';
	export let title = '';
	export let text = '';
	// stats: [{ value: 'R$7M', label: '...' }]
	export let stats = [];

	import { base } from '$app/paths';
	// The name in the title is drawn as the signature: "Fabio Sales." becomes one piece,
	// keeping whatever punctuation followed it.
	$: pieces = title.split(' ').reduce((list, word) => {
		const last = list[list.length - 1];
		const tail = word.match(/^Sales([.,;:!?]*)$/);
		if (last && last.text === 'Fabio' && tail) {
			list[list.length - 1] = { signature: true, after: tail[1] };
		} else {
			list.push({ text: word });
		}
		return list;
	}, []);
</script>

<header class="hero">
	{#if eyebrow}<p class="hero-eyebrow">{eyebrow}</p>{/if}
	<h1 class="hero-title" aria-label={title}>
		{#each pieces as piece, i (i)}
			{#if piece.signature}
				<span class="word signed" aria-hidden="true" style={`--w:${i}`}
					><img src={`${base}/imgs/fabio_sales.svg`} alt="" width="169" height="46" />{piece.after}</span
				>
			{:else}
				<span class="word" aria-hidden="true" style={`--w:${i}`}>{piece.text}</span>
			{/if}
		{/each}
	</h1>
	{#if text}<p class="hero-text">{@html text}</p>{/if}
	{#if stats.length}
		<dl class="hero-stats">
			{#each stats as stat, i (i)}
				<div class="hero-stat" style={`--i:${i}`}>
					<dt>{stat.value}</dt>
					<dd>{stat.label}</dd>
				</div>
			{/each}
		</dl>
	{/if}
</header>

<style>
	.hero {
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-text);
		margin: calc(var(--grid) * 7) auto calc(var(--grid) * 3);
		font-family: var(--font-primary);
		color: var(--color-dark);
	}
	.hero-eyebrow {
		font-size: calc(var(--grid) * 1.5);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-primary);
		margin-bottom: calc(var(--grid) * 3);
	}
	.hero-title {
		font-family: var(--font-display);
		font-size: clamp(28px, 3.2vw, 38px);
		font-weight: 500;
		line-height: 1.16;
		letter-spacing: -0.02em;
		max-width: 14em;
	}
	/* the signature sits on the baseline of the title, a little taller than the type */
	.signed img {
		display: inline-block;
		height: 1.55em;
		width: auto;
		margin: -0.5em 0.04em -0.42em 0;
		vertical-align: baseline;
		transform: translateY(0.12em);
	}
	:global(html.theme-dark) .signed img {
		filter: invert(1) brightness(1.1);
	}
	.hero-text {
		font-family: var(--font-display);
		font-size: clamp(20px, 2.2vw, 25px);
		line-height: 1.4;
		max-width: 31em;
		margin-top: calc(var(--grid) * 3);
		color: color-mix(in srgb, var(--color-dark) 82%, transparent);
	}
	.hero-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		margin-top: calc(var(--grid) * 6);
		border-top: 1px solid var(--color-dark);
	}
	.hero-stat {
		padding: calc(var(--grid) * 2) calc(var(--grid) * 2.5) calc(var(--grid) * 2.5);
		border-left: 1px solid var(--color-rule);
	}
	.hero-stat:first-child {
		padding-left: 0;
		border-left: none;
	}
	.hero-stat dt {
		font-family: var(--font-display);
		font-size: clamp(30px, 3.6vw, 44px);
		font-weight: 500;
		line-height: 1;
		white-space: nowrap;
	}
	.hero-stat dd {
		font-size: calc(var(--grid) * 1.6);
		line-height: 1.4;
		margin-top: calc(var(--grid) * 1);
		color: color-mix(in srgb, var(--color-dark) 70%, transparent);
	}

	/* entrance: title, text and stats rise in sequence, with no script involved */
	.hero-eyebrow,
	.hero-title,
	.hero-text,
	.hero-stat {
		animation: hero-rise 600ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	/* the title is set word by word: each one rises and sharpens in turn */
	.hero-title {
		animation: none;
	}
	.word {
		display: inline-block;
		margin-right: 0.24em;
		animation: word-in 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(120ms + var(--w) * 70ms);
	}
	@keyframes word-in {
		from {
			opacity: 0;
			transform: translateY(0.5em);
			filter: blur(6px);
		}
	}
	.hero-text {
		animation-delay: 1100ms;
	}
	.hero-stat {
		animation-delay: calc(360ms + var(--i) * 80ms);
	}
	@keyframes hero-rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}

	@media (max-width: 900px) {
		.hero-stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.hero-stat:nth-child(odd) {
			padding-left: 0;
			border-left: none;
		}
		.hero-stat:nth-child(n + 3) {
			border-top: 1px solid var(--color-rule);
		}
	}
	@media (max-width: 600px) {
		.hero {
			margin-top: calc(var(--grid) * 5);
		}
		.hero-stats {
			margin-top: calc(var(--grid) * 4);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hero-eyebrow,
		.hero-title,
		.hero-text,
		.hero-stat,
		.word {
			animation: none;
		}
	}
</style>
