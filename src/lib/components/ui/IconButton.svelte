<script>
	import { createEventDispatcher } from 'svelte';

	export let ariaLabel = '';
	export let title = '';
	export let disabled = false;
	export let active = false;
	export let size = 'md'; // 'sm' | 'md' | 'lg'

	const dispatch = createEventDispatcher();
	function onClick(e) {
		dispatch('click', e);
	}
</script>

<button
	class={`icon-btn ${active ? 'active' : ''} ${size}`}
	{disabled}
	aria-label={ariaLabel || title}
	{title}
	on:click={onClick}
>
	<slot />
</button>

<style>
	.icon-btn {
		appearance: none;
		border: none;
		border-radius: 8px;
		background: color-mix(in srgb, var(--color-primary) 8%, transparent);
		color: var(--color-primary);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition:
			background 160ms ease,
			transform 120ms ease,
			color 160ms ease;
	}
	.icon-btn.sm {
		width: 28px;
		height: 28px;
	}
	.icon-btn.md {
		width: 34px;
		height: 34px;
	}
	.icon-btn.lg {
		width: 40px;
		height: 40px;
	}

	.icon-btn:hover {
		filter: brightness(1.05);
	}
	.icon-btn:active {
		transform: translateY(1px);
	}
	.icon-btn.active {
		background: var(--color-primary);
		color: #fff;
	}
	.icon-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
