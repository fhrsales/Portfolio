<script>
	import { archiePages } from '$lib/stores';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
    export let fadeIn = false;
    export let hidden = false;
    let open = false;
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

	// close mobile menu when navigating to a new route
	$: if (typeof current === 'string') {
		open = false;
	}
</script>

<nav class="menu-bar" class:fadeIn class:hidden>
	<div class="menu-container">
		<a class="logo" href={resolve('/')}>
			<img
				src={resolve('/imgs/fabio_sales.svg')}
				alt="Fabio Sales"
				class="logo-img"
				width="169"
				height="46"
				decoding="async"
			/>
		</a>
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
		background: #fff;
		/* border-bottom: 1px solid #eee; */
		position: sticky;
		top: 0;
		z-index: 1000;
		margin-bottom: calc(var(--grid) * 5);
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
		padding: 20px 1em;
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
		width: 3px;
		height: 3px;
		background: var(--color-dark);
		border-radius: 50%;
		margin: 0 calc(var(--grid) * 1);
		vertical-align: middle;
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
	}

	li.active a {
		color: var(--color-primary);
	}
	.menu-toggle {
		display: none;
		background: none;
		border: none;
		font-size: 2em;
		cursor: pointer;
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
		ul.mobile-menu {
			flex-direction: column;
			width: 100%;
			margin-top: 0.5em;
			padding-left: 1.5em;
			padding-right: 1.5em;
			box-sizing: border-box;
			line-height: 1.5;
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
			margin-left: 1em;
		}
		.admin-link {
			margin-left: 0 !important;
		}
	}
</style>
