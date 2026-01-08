<script>
	export let label = 'What I did:';
	export let tags = [];
</script>

{#if tags && tags.length}
	<div class="inline-tags">
		<div class="inline-tags__label">{label}</div>
		<div class="inline-tags__chips">
			{#each tags as t (t)}
				<span class="chip">{t}</span>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Inline, non-interactive tag chips displayed after text blocks */
	.inline-tags {
		width: calc(100% - (var(--grid) * 4));
		max-width: calc(var(--grid) * 50);
		margin: calc(var(--grid) * 0) auto calc(var(--grid) * 4) auto; /* pull closer to the paragraph above */
	}
	.inline-tags__label {
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 1.2);
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--color-dark);
		background: color-mix(in srgb, var(--color-tertiary) 92%, transparent);
		padding: 0.2rem 0.45rem 0.15rem;
		border-radius: 6px;
		display: inline-flex;
		align-items: center;
		margin-bottom: calc(var(--grid) * 1);
		text-transform: uppercase;
		opacity: 1;
	}
	.inline-tags__chips {
		display: flex;
		flex-wrap: wrap;
		gap: calc(var(--grid) * 0.5);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.30rem 0.50rem 0.20rem; /* top slightly larger to visually center on iOS */
		border-radius: 999px;
		background: var(--color-primary); /* dark blue */
		color: #fff; /* white text */
		font-family: var(--font-primary);
		font-weight: 700;
		font-size: calc(var(--grid) * 0.95); /* smaller text */
		line-height: 1.12; /* improves vertical balance on iOS */
		text-transform: uppercase;
		letter-spacing: 0.06em; /* increased spacing */
		border: 1px solid color-mix(in srgb, #000 12%, transparent);
		box-shadow: none;
		vertical-align: middle;
	}
</style>
