<script>
	export let value = '';
</script>

<!-- the page title is set word by word: each one rises and sharpens in turn -->
<h1 class="heading heading-1" aria-label={value || undefined}>
	{#if value}
		{#each value.split(' ') as word, i (i)}
			<span class="word" aria-hidden="true" style={`--w:${i}`}>{word}</span>
		{/each}
	{:else}<slot />{/if}
</h1>

<style>
	.heading {
		font-family: var(--font-display);
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.08;
		color: var(--color-dark);
		margin: 0 auto calc(var(--grid) * 2) auto;
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-text);
	}
	.heading-1 {
		font-size: calc(var(--grid) * 4.2);
	}
	@media (max-width: 600px) {
		.heading-1 {
			font-size: calc(var(--grid) * 3.4);
		}
	}
	.word {
		display: inline-block;
		margin-right: 0.24em;
		animation: title-word-in 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(120ms + var(--w) * 70ms);
	}
	@keyframes title-word-in {
		from {
			opacity: 0;
			transform: translateY(0.5em);
			filter: blur(6px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.word {
			animation: none;
		}
	}
</style>
