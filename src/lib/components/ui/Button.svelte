<script>
	// reusable button component with backward compatibility (admin uses older props)
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// modern props
	export let variant = 'default'; // 'default' | 'primary' | 'link'
	export let active = false;
	export let type = 'button';
	export let disabled = false;
	export let ariaLabel = '';
	export let title = '';

	// legacy props (used by admin page)
	export let classe = '';
	export let estilo = '';
	export let handleClick = null; // optional function returning true on success
	export let value = ''; // text value used instead of slot
	export let newValue = '';
	export let resetAfter = 1000;

	// internal state for legacy value swapping
	let displayed = value;
	let original = value;
	let revertTimer;

	// keep displayed in sync if parent changes `value` externally
	$: if (value !== undefined && value !== null && value !== original) {
		original = value;
		displayed = value;
	}

	// compute classes merging legacy 'classe' and any passed class
	$: extraClass = $$restProps && $$restProps.class ? $$restProps.class : '';
	$: classes =
		`btn ${variant === 'primary' ? 'primary' : ''} ${variant === 'link' ? 'link' : ''} ${active ? 'active' : ''} ${classe || ''} ${extraClass}`.trim();

	function dispatchClick(e) {
		dispatch('click', e);
	}

	async function onClickHandler(e) {
		// Always dispatch a click event so parent listeners work
		dispatchClick(e);
		// If legacy handleClick exists, call it and manage displayed label
		if (typeof handleClick === 'function') {
			let ok = false;
			try {
				const res = handleClick(e);
				ok = res && typeof res.then === 'function' ? await res : res;
			} catch {
				ok = false;
			}
			if (ok === true && newValue) {
				displayed = newValue;
				if (revertTimer) clearTimeout(revertTimer);
				revertTimer = setTimeout(() => {
					displayed = original;
					revertTimer = null;
				}, resetAfter);
			}
		}
	}
	import { onDestroy } from 'svelte';
	onDestroy(() => {
		if (revertTimer) clearTimeout(revertTimer);
	});
</script>

<button
	{...$$restProps}
	{type}
	class={classes}
	{disabled}
	aria-label={ariaLabel}
	{title}
	style={estilo}
	on:click={onClickHandler}
>
	{#if value}
		{displayed}
	{:else}
		<slot />
	{/if}
</button>

<style>
	.btn {
		background: var(--color-light);
		border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
		padding: 0.3rem 1rem;
		border-radius: 999px;
		cursor: pointer;
		font-weight: 600;
		box-shadow: var(--shadow-2);
		font-size: calc(var(--grid) * 1.18);
		text-transform: uppercase;
		color: var(--color-primary);
		transition:
			background 160ms ease,
			color 160ms ease,
			transform 120ms ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
	}
	.btn.link {
		background: transparent;
		border: none;
		box-shadow: none;
		padding: 0;
		border-radius: 0;
		text-transform: none;
		color: var(--color-primary);
		font-weight: 600;
	}
	.btn.link:hover {
		text-decoration: underline;
	}
	.btn.primary {
		background: var(--color-primary);
		color: white;
	}
	.btn.active {
		background: var(--color-primary);
		color: white;
	}
	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
