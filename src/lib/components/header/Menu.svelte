<script>
	import { archiePages } from '$lib/stores';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { language, translateLabel } from '$lib/i18n';
	import LanguageSwitch from './LanguageSwitch.svelte';
	const signatureSrc = resolve('/imgs/fabio_sales.svg');
	let isDark = false;
	let pages = [];
	let menuLabels = {};
	let current = '';

	onMount(() => {
		const unsubscribe = archiePages.subscribe((val) => {
			const filtered = Object.entries(val).filter(([, v]) =>
				typeof v === 'object' ? v.showInMenu !== false : true
			);
			pages = filtered.map(([k]) => k);
			menuLabels = Object.fromEntries(filtered.map(([k, v]) => [k, v.menuLabel || k]));
		});
		return unsubscribe;
	});
	// From the route, not the URL: the published site lives under a base path.
	$: current = $page.params.slug ?? ($page.route.id || '').slice(1);
	$: isHome = $page.route.id === '/';
	function applyTheme(next) {
		isDark = next === 'dark';
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		root.classList.toggle('theme-dark', isDark);
		root.classList.toggle('theme-light', !isDark);
		root.style.colorScheme = isDark ? 'dark' : 'light';
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) meta.setAttribute('content', isDark ? '#0f1116' : '#ffffff');
		try {
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		} catch {
			// ignore
		}
	}
	function toggleTheme() {
		applyTheme(isDark ? 'light' : 'dark');
	}

	onMount(() => {
		applyTheme('light');
	});
</script>

<header class="site-header" class:home={isHome}>
	<a class="signature" href={resolve('/')} aria-label="Fabio Sales, início">
		<img src={signatureSrc} alt="Fabio Sales" width="169" height="46" decoding="async" />
	</a>
	<nav aria-label="Principal">
		{#each pages as p, i (p)}
			<a
				style={`--i:${i}`}
				href={p === 'index' ? resolve('/') : resolve(`/${p}`)}
				aria-current={current === p || (p === 'index' && isHome)
					? 'page'
					: undefined}>{translateLabel(menuLabels[p], $language)}</a
			>
		{/each}
		{#if import.meta.env.DEV}
			<a style={`--i:${pages.length}`} href={resolve('/admin')}>Admin</a>
		{/if}
	</nav>
	<div class="prefs" style={`--i:${pages.length + 1}`}>
		<LanguageSwitch />
		<button
			class="theme-toggle"
			type="button"
			aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo noturno'}
			on:click={toggleTheme}
		>
			{#if isDark}
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path
						d="M21 14.5A8.5 8.5 0 1 1 9.5 3a.9.9 0 0 1 .96 1.2A6.5 6.5 0 0 0 20.8 13.5a.9.9 0 0 1 .2 1z"
					/>
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<circle cx="12" cy="12" r="4.2" />
					<path
						d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"
					/>
				</svg>
			{/if}
		</button>
	</div>
</header>

<style>
	/* A quiet masthead that scrolls away with the page: signature, three links, two preferences. */
	.site-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: calc(var(--grid) * 1) calc(var(--grid) * 2);
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--w-text);
		margin: 0 auto;
		padding-top: calc(env(safe-area-inset-top, 0px) + (var(--grid) * 4));
		font-family: var(--font-primary);
	}
	.signature {
		display: block;
		margin-right: auto;
	}
	/* on the home page the signature is in the title, so the masthead keeps only the menu */
	.home .signature {
		display: none;
	}
	.home nav {
		margin-right: auto;
	}
	.signature img {
		display: block;
		height: 46px;
		width: auto;
	}
	:global(html.theme-dark) .signature img {
		filter: invert(1) brightness(1.1);
	}
	nav {
		display: flex;
		gap: calc(var(--grid) * 2);
	}
	nav a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-size: calc(var(--grid) * 1.7);
		font-weight: 500;
		color: var(--color-dark);
		text-decoration: none;
		text-underline-offset: 6px;
		text-decoration-thickness: 2px;
	}
	nav a:hover,
	nav a:focus-visible {
		text-decoration: underline;
		outline: none;
	}
	nav a[aria-current='page'] {
		text-decoration: underline;
		text-decoration-color: var(--color-primary);
	}
	/* On arrival the signature writes itself (about a second), then the menu follows,
	   one item at a time from left to right. */
	@media (prefers-reduced-motion: no-preference) {
		nav a,
		.prefs {
			animation: menu-in 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
			animation-delay: calc(850ms + var(--i, 0) * 110ms);
		}
	}
	/* on the home page there is no signature to wait for: the menu comes in with the title
	   (whose last word lands at about 1.5s) and finishes with it */
	@media (prefers-reduced-motion: no-preference) {
		.home nav a,
		.home .prefs {
			animation-delay: calc(120ms + var(--i, 0) * 190ms);
		}
	}
	@keyframes menu-in {
		from {
			opacity: 0;
			transform: translateX(-14px);
		}
	}
	.prefs {
		display: flex;
		align-items: center;
		gap: calc(var(--grid) * 0.5);
	}
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border: none;
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
	}
	.theme-toggle svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: var(--color-dark);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.theme-toggle:hover,
	.theme-toggle:focus-visible {
		background: color-mix(in srgb, var(--color-dark) 8%, transparent);
		outline: none;
	}
	@media (max-width: 600px) {
		.site-header {
			padding-top: calc(env(safe-area-inset-top, 0px) + (var(--grid) * 2.5));
		}
		.signature {
			flex-basis: 100%;
		}
		.signature img {
			height: 40px;
		}
		.prefs {
			margin-left: auto;
		}
	}
</style>
