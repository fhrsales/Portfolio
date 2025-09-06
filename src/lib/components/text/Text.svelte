<!-- eslint-disable svelte/no-at-html-tags -->
<script>
	/* eslint-disable svelte/no-at-html-tags */
	import { base } from '$app/paths';
	export let value = {};

	function fixLinks(html, base) {
		if (!base) return html;
		return html.replace(/href=['"]\/(?!\/)([^'"#?]*)['"]/g, `href='${base}/$1'`);
	}
</script>

{#if value.titulo}
	<h1>{value.titulo}</h1>
{/if}

{#if value.body}
	{#each Array.isArray(value.body) ? value.body : [value.body] as bloco, i (i)}
		{@const blocoStr = typeof bloco === 'string' ? bloco.trim() : ''}
		{#if blocoStr.startsWith('<')}
			{#if blocoStr.match(/^<(a|span|strong|em|b|i|img)(\s|>)/i)}
				<!-- Inline HTML (anchor, strong, etc.) — wrap in paragraph -->
				<p>{@html fixLinks(bloco, base)}</p>
			{:else}
				<!-- Block-level HTML (figure, iframe, etc.) — render as-is -->
				{@html fixLinks(bloco, base)}
			{/if}
		{:else}
			<p>{@html fixLinks(bloco, base)}</p>
		{/if}
	{/each}
{/if}

<style>
	p {
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 2.2);
		font-weight: 300;
		line-height: 1.5;
		letter-spacing: -0.035em;
		color: var(--color-dark);
		width: calc(100% - (var(--grid) * 4));
		max-width: calc(var(--grid) * 50);
		margin: 0 auto calc(var(--grid) * 3) auto;
	}

	p :global(a) {
		color: var(--color-dark);
		text-decoration: none;
		font-weight: 600;
		position: relative;
		transition: color 180ms ease;
	}

	/* animated underline */
	p :global(a)::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -3px;
		height: 2px;
		width: 0;
		background: currentColor;
		transition: width 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	p :global(a):hover,
	p :global(a):focus {
		color: var(--color-primary);
		outline: none;
	}

	p :global(a):hover::after,
	p :global(a):focus::after {
		width: 100%;
	}
</style>
