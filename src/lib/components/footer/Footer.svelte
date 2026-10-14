<script>
 import { language } from '$lib/i18n';
	import { resolve } from '$app/paths';
</script>
<footer>
	<a
		class="signature"
		href="#top"
		aria-label={$language === 'pt' ? 'Voltar ao topo' : 'Back to top'}
		on:click|preventDefault={() =>
			window.scrollTo({
				top: 0,
				behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
			})}
	>
		<img src={resolve('/imgs/fabio_sales.svg')} alt="" width="129" height="35" decoding="async" />
	</a>
	<div class="contacts">
		{$language === 'pt' ? 'Precisa de um parceiro que entenda de design e código? Vamos conversar e dar vida ao seu produto digital!' : 'Need a partner who speaks both design and code? Let’s talk and bring your digital product to life!'} <br/> <a href="mailto:fabio.sales@me.com" title="Email" target="_blank" rel="noopener"
			>fabio.sales@me.com</a>
		|
		<a
			href="https://www.linkedin.com/in/fabiohrsales/"
			title="LinkedIn"
			target="_blank"
			rel="noopener">LinkedIn</a>
        |
        <a
            href="https://github.com/fhrsales"
            title="GitHub"
            target="_blank"
            rel="noopener">GitHub</a>
		|
		<a
			href={resolve(`/pdfs/cv-fabio-sales-${$language === 'pt' ? 'pt' : 'en'}.pdf`)}
			title={$language === 'pt' ? 'Currículo (PDF)' : 'CV (PDF)'}
			target="_blank"
			rel="noopener">{$language === 'pt' ? 'Currículo' : 'CV'}&nbsp;<span class="ext-arrow" aria-hidden="true"></span></a>
	</div>
	<div class="copyright">© {new Date().getFullYear()} Fabio Sales</div>
	<div class="rights">{$language === 'pt' ? 'Todos os direitos reservados' : 'All rights reserved'}</div>
</footer>

<style>
	footer::before {
		content: '';
		display: block;
		height: 1px;
		background: color-mix(in srgb, var(--color-dark) 30%, transparent);
		margin: calc(var(--grid) * 2) auto;
		width: 60px;
	}

	footer {
		width: calc(100% - (var(--grid) * 4));
        max-width: calc(var(--grid) * 70);
		padding: calc(var(--grid) * 3) 0 calc(var(--grid) * 2) 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		margin: 0 auto calc(var(--grid) * 4) auto;
		text-align: center;
		/* even lines, so the invitation never ends on a single orphaned word */
		text-wrap: balance;
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 1.5);
        line-height: 1.4;
		/* text-transform: uppercase; */
		/* softened through the colour, not opacity, so the red links keep their full contrast */
		color: color-mix(in srgb, var(--color-dark) 80%, var(--color-tertiary));
	}

	footer a {
		color: var(--color-primary);
		text-decoration: none;
		position: relative;
		display: inline-block;
		padding: 9px 2px;
		transition: color 220ms ease;
	}

	/* animated underline: starts scaled to 0 and grows on hover/focus */
	footer a::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-primary);
		bottom: -4px;
		transform: scaleX(0);
		transform-origin: left center;
		transition:
			transform 320ms cubic-bezier(0.2, 0.9, 0.2, 1),
			opacity 220ms ease;
		opacity: 0;
	}

	footer a:hover,
	footer a:focus-visible {
		color: var(--color-primary);
		outline: none;
	}

	footer a:hover::after,
	footer a:focus-visible::after {
		transform: scaleX(1);
		opacity: 1;
	}

	footer a.signature {
		align-self: center;
		padding: 0;
		margin-bottom: calc(var(--grid) * 2);
	}
	footer a.signature::after {
		display: none;
	}
	.signature img {
		display: block;
		height: 35px;
		width: auto;
	}
	:global(html.theme-dark) .signature img {
		filter: invert(1) brightness(1.1);
	}

	footer .contacts {
		margin-bottom: calc(var(--grid) * 2);
		font-weight: 500;
	}

	footer .copyright,
	footer .rights {
		font-size: calc(var(--grid) * 1.2);
	}

	/* Respect reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
		footer a {
			transition: none;
		}
		footer a::after {
			transition: none;
			transform: none;
			opacity: 1;
		}
	}
</style>
