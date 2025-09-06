<footer>
	<div class="contacts">
		Contacts • <a href="mailto:fabio.sales@me.com" title="Email" target="_blank" rel="noopener"
			>fabio.sales@me.com</a
		>
		|
		<a
			href="https://www.linkedin.com/in/fabiohrsales/"
			title="LinkedIn"
			target="_blank"
			rel="noopener">LinkedIn</a
		>
	</div>
	<div class="copyright">© {new Date().getFullYear()} Fabio Sales</div>
	<div class="rights">All rights reserved</div>
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
		width: 100vw;
		padding: calc(var(--grid) * 3) 0 calc(var(--grid) * 2) 0;
		width: 100vw;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		margin: 0 auto calc(var(--grid) * 4) auto;
		text-align: center;
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 1.5);
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-dark) 70%, transparent);
	}

	footer a {
		color: inherit;
		text-decoration: none;
		position: relative;
		padding-bottom: 2px;
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
