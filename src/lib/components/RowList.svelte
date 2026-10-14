<script>
	// A plain list of ruled rows: a name and a line about it. Used for recognition and similar facts.
	// rows: [{ label, text }]
	export let title = '';
	export let text = '';
	export let rows = [];
</script>

<section class="row-list">
	{#if title}<h2>{title}</h2>{/if}
	{#if text}<p class="lead">{text}</p>{/if}
	<dl>
		{#each rows as row, i (i)}
			<div class="row">
				<dt>{row.label}</dt>
				<dd>{@html row.text}</dd>
			</div>
		{/each}
	</dl>
</section>

<style>
	.row-list {
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-text);
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
	}
	.lead {
		margin-top: calc(var(--grid) * 1);
		font-size: calc(var(--grid) * 2);
		line-height: 1.5;
		color: color-mix(in srgb, var(--color-dark) 75%, transparent);
	}
	dl {
		margin-top: calc(var(--grid) * 3);
		border-top: 1px solid var(--color-dark);
	}
	.row {
		padding: calc(var(--grid) * 1.75) 0;
		border-bottom: 1px solid var(--color-rule);
	}
	dt {
		font-size: calc(var(--grid) * 2);
		font-weight: 500;
	}
	dd {
		margin-top: 4px;
		font-size: calc(var(--grid) * 1.7);
		line-height: 1.45;
		color: color-mix(in srgb, var(--color-dark) 70%, transparent);
	}
	/* a title linked inside a row: ink, with the site's red underline */
	dd :global(a) {
		color: inherit;
		font-weight: 500;
		text-decoration: underline;
		text-decoration-color: var(--color-primary);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}
	dd :global(a:hover),
	dd :global(a:focus-visible) {
		color: var(--color-primary);
	}
</style>
