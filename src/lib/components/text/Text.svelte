<!-- eslint-disable svelte/no-at-html-tags -->
<script>
	/* eslint-disable svelte/no-at-html-tags */
	import { base } from '$app/paths';
	import Bullet from '$lib/components/Bullet.svelte';
	export let value = {};

	function fixLinks(html, base) {
		if (!base) return html;
		return html.replace(/href=['"]\/(?!\/)([^'"#?]*)['"]/g, `href='${base}/$1'`);
	}

	function sanitizeHtml(html) {
		if (!html) return html;
		// remove inline event handlers and javascript: URLs
		return String(html)
			.replace(/\son[a-z]+\s*=\s*(["']).*?\1/gi, '')
			.replace(/(href|src)=(['"])javascript:[^\2]*\2/gi, '$1="#"');
	}

	function injectBullet(html) {
		if (!html) return html;
		return String(html).replace(/<bullet\b([^>]*)\/?>/gi, (match, attrs) => {
			const textoMatch = String(attrs).match(/texto\s*[:=]\s*(['"])(.*?)\1/i);
			const corMatch = String(attrs).match(/cor\s*[:=]\s*(['"])(.*?)\1/i);
			const texto = textoMatch ? textoMatch[2].trim() : '';
			const cor = corMatch ? corMatch[2].trim() : '';
			const style = cor ? ` style="--bullet-bg: ${cor};"` : '';
			return `<span class="bullet"${style}>${texto}</span>`;
		});
	}

	function injectInlineLogo(html) {
		if (!html) return html;
		const logoSrc = base ? `${base}/imgs/fabio_sales.svg` : '/imgs/fabio_sales.svg';
		return String(html).replace(
			/<strong>\s*Fabio\s+Sales(\.)?\s*<\/strong>/gi,
			(_, dot) =>
				`<span class="inline-logo" role="img" aria-label="Fabio Sales" style="--inline-logo-url: url('${logoSrc}')">Fabio Sales</span>` +
				(dot ? '.' : '')
		);
	}

	function renderHtml(html) {
		return sanitizeHtml(injectInlineLogo(injectBullet(fixLinks(html, base))));
	}
</script>

{#if value.titulo}
	<h1>{value.titulo}</h1>
{/if}

<Bullet renderOnlyStyle={true} />

{#if value.body}
	{#each Array.isArray(value.body) ? value.body : [value.body] as bloco, i (i)}
		{@const blocoStr = typeof bloco === 'string' ? bloco.trim() : ''}
		{#if blocoStr.startsWith('<')}
			{#if blocoStr.match(/^<(a|span|strong|em|b|i|img|bullet)(\s|>)/i)}
				<!-- Inline HTML (anchor, strong, etc.) — wrap in paragraph -->
				<p>{@html renderHtml(bloco)}</p>
			{:else}
				<!-- Block-level HTML (figure, iframe, etc.) — render as-is -->
				{@html renderHtml(bloco)}
			{/if}
		{:else}
			<p>{@html renderHtml(bloco)}</p>
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
		margin: 0 auto calc(var(--grid) * 2) auto;
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
