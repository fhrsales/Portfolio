<script>
	import { archiePages } from '$lib/stores';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
    export let fadeIn = false;
    export let hidden = false;
    let open = false;
	let logoTick = 0;
	const logoSrc = resolve('/imgs/fabio_sales.svg');
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
	$: current = $page.url.pathname.replace(/^\/|\/$/g, '');
	const replayLogo = () => {
		logoTick = (logoTick + 1) % 10000;
	};
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

	// close mobile menu when navigating to a new route
	$: if (typeof current === 'string') {
		open = false;
	}
</script>

<nav class="menu-bar" class:fadeIn class:hidden>
	<div class="menu-container">
		<a class="logo" href={resolve('/')} on:mouseenter={replayLogo} on:focus={replayLogo}>
			<img
				src={`${logoSrc}?v=${logoTick}`}
				alt="Fabio Sales"
				class="logo-img"
				width="169"
				height="46"
				decoding="async"
			/>
		</a>
		<div class="menu-actions">
			<button
				class="menu-toggle"
				class:open
				on:click={() => (open = !open)}
				aria-label={open ? 'Fechar menu' : 'Abrir menu'}
				aria-expanded={open}
			>
				<svg viewBox="1 1 24 18" aria-hidden="true" focusable="false">
					<rect class="line l1" x="0" y="4" width="24" height="2" rx="2" />
					<!-- <rect class="line l2" x="0" y="8" width="24" height="2" rx="1" /> -->
					<rect class="line l3" x="0" y="12" width="24" height="2" rx="2" />
				</svg>
			</button>
			<span class="menu-sep" aria-hidden="true"></span>
			<button
				class="theme-toggle theme-toggle-mobile"
				type="button"
				aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo noturno'}
				on:click={toggleTheme}
			>
				{#if isDark}
					<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a.9.9 0 0 1 .96 1.2A6.5 6.5 0 0 0 20.8 13.5a.9.9 0 0 1 .2 1z" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<circle cx="12" cy="12" r="4.2" />
						<path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
					</svg>
				{/if}
			</button>
		</div>
		{#if pages.length || import.meta.env.DEV}
			<ul class="desktop-menu">
				{#each pages as p (p)}
					<li
						class:active={current === p ||
							(p === 'index' && (current === '' || current === 'index'))}
					>
						<a href={p === 'index' ? resolve('/') : resolve(`/${p}`)}>{menuLabels[p]}</a>
					</li>
				{/each}
				<li class="theme-item">
					<button
						class="theme-toggle theme-toggle-desktop"
						type="button"
						aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo noturno'}
						on:click={toggleTheme}
					>
						{#if isDark}
							<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a.9.9 0 0 1 .96 1.2A6.5 6.5 0 0 0 20.8 13.5a.9.9 0 0 1 .2 1z" />
							</svg>
						{:else}
							<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<circle cx="12" cy="12" r="4.2" />
								<path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
							</svg>
						{/if}
					</button>
				</li>
				{#if import.meta.env.DEV}
					<li class="admin-link">
						<a href={resolve('/admin')} style="color:#0070f3;font-weight:bold;">Admin</a>
					</li>
				{/if}
			</ul>
		{/if}
	</div>
	{#if pages.length || import.meta.env.DEV}
		<ul class:open class="mobile-menu">
			{#each pages as p (p)}
				<li
					class:active={current === p || (p === 'index' && (current === '' || current === 'index'))}
				>
					<a href={p === 'index' ? resolve('/') : resolve(`/${p}`)}>{menuLabels[p]}</a>
				</li>
			{/each}
			{#if import.meta.env.DEV}
				<li class="admin-link">
					<a href={resolve('/admin')} style="color:#0070f3;font-weight:bold;">Admin</a>
				</li>
			{/if}
		</ul>
	{/if}
</nav>

<style>
	.menu-bar {
		width: 100vw;
		background: var(--glass-1);
		backdrop-filter: blur(14px) saturate(160%);
		-webkit-backdrop-filter: blur(14px) saturate(160%);
		/* border-bottom: 1px solid #eee; */
		position: sticky;
		top: env(safe-area-inset-top, 0px);
		padding-top: env(safe-area-inset-top, 0px);
		z-index: 1000;
		/* margin-bottom: calc(var(--grid) * 5); */
		opacity: 1;
		transition: opacity 360ms ease;
	}

	:global(html.has-intro-h2:not(.intro-h2-exited)) .menu-bar {
		opacity: 0;
		pointer-events: none;
	}
	:global(html.has-intro-h2.intro-h2-exited) .menu-bar {
		opacity: 1;
		pointer-events: auto;
	}

	/* optional fade-in on mount (home only) */
	.menu-bar.fadeIn {
		animation: menu-fade-in 360ms ease-out both;
	}
	.menu-bar.hidden {
		opacity: 0;
		pointer-events: none;
	}

	@keyframes menu-fade-in {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.menu-container {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 1em;
		position: relative;
	}
	/* .logo {
  font-weight: bold;
  font-size: 1.2em;
} */
	.logo-img {
		height: 46px;
		display: block;
		margin-right: 8px;
	}
	:global(html.theme-dark) .logo-img {
		filter: invert(1) brightness(1.1);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	ul.desktop-menu {
		display: flex;
		/* gap: 1em; */
	}
	/* bolinha antes de cada item de menu */
	ul.desktop-menu li::before,
	ul.mobile-menu li::before {
		position: relative;
		top: -2px;
		content: '';
		display: inline-block;
		width: 1px;
		height: 1em;
		background: var(--color-dark);
		border-radius: 1px;
		margin: 0 calc(var(--grid) * 1);
		vertical-align: middle;
        opacity: 0.3;
	}

	ul.mobile-menu {
		/* curtain animation: keep in DOM and animate max-height */
		display: block;
		max-height: 0;
		overflow: hidden;
		transition:
			max-height 340ms cubic-bezier(0.2, 0.9, 0.3, 1),
			box-shadow 220ms ease;
		transform-origin: top center;
		box-shadow: none;
	}

	li a {
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 2);
		font-weight: 500;
		letter-spacing: -0.025em;
		color: var(--color-dark);
		text-decoration: none;
		margin: 0 calc(var(--grid) * 1);
		position: relative;
		transition: color 180ms ease;
	}

	li.active a {
		color: var(--color-primary);
	}
	ul.desktop-menu li a::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -3px;
		height: 2px;
		width: 0;
		background: currentColor;
		transition: width 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	ul.mobile-menu li a::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -3px;
		height: 2px;
		width: 0;
		background: currentColor;
		transition: width 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	ul.desktop-menu li a:hover,
	ul.desktop-menu li a:focus {
		color: var(--color-primary);
		outline: none;
	}
	ul.desktop-menu li a:hover::after,
	ul.desktop-menu li a:focus::after {
		width: 100%;
	}
	ul.mobile-menu li a:hover,
	ul.mobile-menu li a:focus {
		color: var(--color-primary);
		outline: none;
	}
	ul.mobile-menu li a:hover::after,
	ul.mobile-menu li a:focus::after {
		width: 100%;
	}
	.menu-toggle {
		display: none;
		background: none;
		border: none;
		font-size: 2em;
		cursor: pointer;
        margin-right: 0.4em;
	}
	.menu-actions {
		display: none;
		position: absolute;
		right: 1em;
		top: 50%;
		transform: translateY(-50%);
		align-items: center;
		gap: 0.5em;
	}
	.menu-sep {
		display: inline-block;
		width: 1px;
		height: 1em;
		background: var(--color-dark);
		border-radius: 1px;
		opacity: 0.3;
	}
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: none;
		background: transparent;
		cursor: pointer;
		transition: background 180ms ease;
		position: relative;
		top: -2px;
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
	li.theme-item {
		display: flex;
		align-items: center;
	}
	.theme-toggle-desktop {
		width: 30px;
		height: 30px;
	}
	.theme-toggle:hover,
	.theme-toggle:focus-visible {
		background: color-mix(in srgb, var(--color-primary) 10%, transparent);
		outline: none;
	}
	/* Hamburger SVG styles */
	.menu-toggle svg {
		width: 26px;
		height: 20px;
		display: block;
	}
	.menu-toggle .line {
		fill: var(--color-dark);
		transition:
			transform 220ms cubic-bezier(0.2, 0.9, 0.3, 1),
			opacity 180ms ease;
		transform-origin: 12px 9px;
	}
	.menu-toggle.open .l1 {
		transform: translateY(4px) rotate(45deg);
	}
	/* .menu-toggle.open .l2 {
		opacity: 0;
		transform: scaleX(0);
	} */
	.menu-toggle.open .l3 {
		transform: translateY(-2px) rotate(-45deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-toggle .line {
			transition: none;
		}
	}
	@media (max-width: 700px) {
		.menu-container {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding: 0.5em 1em;
		}
		.logo {
			margin-bottom: 0;
		}
		ul.desktop-menu {
			display: none;
		}
		li.theme-item {
			display: none;
		}
		ul.mobile-menu {
			flex-direction: column;
			width: 100%;
			margin-top: 0.5em;
			padding-left: 1.5em;
			padding-right: 1.5em;
			box-sizing: border-box;
			line-height: 1.5;
		}
		ul.mobile-menu li + li {
			margin-top: calc(var(--grid) * 1);
		}
		ul.mobile-menu li::before {
			display: none;
		}
		ul.mobile-menu.open {
			max-height: 400px; /* tall enough for menu content; adjust if necessary */
			box-shadow: 4px 20px 30px rgba(0, 0, 0, 0.12);
		}
		/* space after last mobile menu item */
		ul.mobile-menu li:last-child {
			margin-bottom: calc(var(--grid) * 4);
		}
		.menu-toggle {
			display: block;
		}
		.menu-actions {
			display: inline-flex;
		}
		.theme-toggle-mobile {
			position: relative;
			top: 1px;
		}
		.theme-toggle {
			margin-left: 0;
		}
		.admin-link {
			margin-left: 0 !important;
		}
	}
</style>
