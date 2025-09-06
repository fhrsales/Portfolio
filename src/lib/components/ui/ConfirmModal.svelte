<!-- eslint-disable svelte/no-at-html-tags -->
<script>
	/* eslint-disable svelte/no-at-html-tags */
	import { createEventDispatcher } from 'svelte';
	export let open = false;
	export let title = '';
	export let message = '';
	export let confirmLabel = 'Apagar';
	export let cancelLabel = 'Cancelar';

	const dispatch = createEventDispatcher();

	function onCancel() {
		dispatch('cancel');
	}
	function onConfirm() {
		dispatch('confirm');
	}

	function backdropClick(e) {
		// click no backdrop fecha o modal
		if (e.target === e.currentTarget) onCancel();
	}
</script>

{#if open}
	<div class="mm-modal-backdrop" role="presentation" on:click={backdropClick}>
		<div
			class="mm-modal"
			role="dialog"
			aria-modal="true"
			aria-label={title || 'Confirmação'}
			tabindex="0"
			on:click|stopPropagation
			on:keydown={(e) => {
				if (e.key === 'Escape') {
					onCancel();
				}
			}}
		>
			{#if title}
				<h4>{title}</h4>
			{/if}
			{#if message}
				<p>{@html message}</p>
			{:else}
				<slot />
			{/if}
			<div class="mm-modal-actions">
				<button class="button-outline" on:click={onCancel}>{cancelLabel}</button>
				<button class="button" on:click={onConfirm}>{confirmLabel}</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.mm-modal-backdrop {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	.mm-modal {
		background: white;
		padding: 1.25rem;
		border-radius: 4px;
		width: 90%;
		max-width: 420px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
	}
	.mm-modal-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
		margin-top: 1rem;
	}
</style>
