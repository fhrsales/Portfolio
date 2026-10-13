<script>
	import { createEventDispatcher } from 'svelte';
	import { OPTIONS, KEY_LABELS } from './editorSchema.js';

	// block: result of blockAt(), or null when the cursor is in running text
	export let block = null;

	const dispatch = createEventDispatcher();
	let adding = '';

	$: used = new Set((block?.fields || []).map((f) => f.key.toLowerCase()));
	$: available = (block?.def?.keys || []).filter((key) => !used.has(key.toLowerCase()));
	const label = (key) => KEY_LABELS[key.toLowerCase()] || key;
	const options = (key) => OPTIONS[key.toLowerCase()];

	function add() {
		if (!adding) return;
		dispatch('set', { key: adding, value: options(adding)?.[0] || '' });
		adding = '';
	}
</script>

<section class="inspector" aria-label="Opções do bloco">
	{#if !block}
		<p class="hint">
			Coloque o cursor dentro de um bloco, como <code>{'{imagem}'}</code>, para editar as opções
			dele aqui.
		</p>
	{:else}
		<h2>Bloco · {block.def?.label || block.name}</h2>
		{#each block.fields as field (field.line)}
			<div class="field">
				<div class="field-head">
					<label for={`f-${field.line}`}>{label(field.key)}</label>
					<button
						type="button"
						class="remove"
						aria-label={`Remover ${label(field.key)}`}
						on:click={() => dispatch('remove', { key: field.key })}>Remover</button
					>
				</div>
				{#if options(field.key)}
					<div class="segmented" role="group" aria-label={label(field.key)}>
						{#each options(field.key) as option (option)}
							<button
								type="button"
								aria-pressed={field.value.trim().toLowerCase() === option.toLowerCase()}
								on:click={() => dispatch('set', { key: field.key, value: option })}>{option}</button
							>
						{/each}
					</div>
				{:else}
					<input
						id={`f-${field.line}`}
						type="text"
						value={field.value}
						on:input={(e) => dispatch('set', { key: field.key, value: e.currentTarget.value })}
					/>
				{/if}
			</div>
		{/each}
		{#if available.length}
			<div class="field">
				<label for="f-add">Adicionar opção</label>
				<div class="add">
					<select id="f-add" bind:value={adding}>
						<option value="">Escolha…</option>
						{#each available as key (key)}
							<option value={key}>{label(key)}</option>
						{/each}
					</select>
					<button type="button" class="add-btn" disabled={!adding} on:click={add}>Adicionar</button>
				</div>
			</div>
		{/if}
	{/if}
</section>

<style>
	.inspector {
		display: flex;
		flex-direction: column;
		gap: calc(var(--grid) * 1.75);
		font-family: var(--font-primary);
		color: var(--color-dark);
	}
	h2 {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-primary);
	}
	.hint {
		font-size: 14px;
		line-height: 1.5;
		color: color-mix(in srgb, var(--color-dark) 70%, transparent);
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.field-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 8px;
	}
	label {
		font-size: 14px;
		font-weight: 500;
	}
	.remove {
		border: none;
		background: none;
		padding: 0;
		font: inherit;
		font-size: 12px;
		color: color-mix(in srgb, var(--color-dark) 60%, transparent);
		cursor: pointer;
	}
	.remove:hover,
	.remove:focus-visible {
		color: var(--color-danger);
		text-decoration: underline;
	}
	input,
	select {
		width: 100%;
		height: 44px;
		padding: 0 12px;
		font-family: var(--font-primary);
		font-size: 16px;
		color: var(--color-dark);
		background: var(--color-tertiary);
		border: 1px solid color-mix(in srgb, var(--color-dark) 45%, transparent);
		border-radius: 10px;
	}
	/* the browser's own arrow sits against the border; this one is drawn with room around it */
	select {
		appearance: none;
		-webkit-appearance: none;
		padding-right: 36px;
		text-overflow: ellipsis;
		background-image:
			linear-gradient(45deg, transparent 50%, currentColor 50%),
			linear-gradient(135deg, currentColor 50%, transparent 50%);
		background-position:
			right 19px center,
			right 14px center;
		background-size: 5px 5px;
		background-repeat: no-repeat;
		cursor: pointer;
	}
	input:focus,
	select:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 22%, transparent);
	}
	.segmented {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(0, 1fr);
		padding: 3px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--color-dark) 9%, transparent);
	}
	.segmented button {
		height: 38px;
		border: none;
		border-radius: 8px;
		background: transparent;
		font-family: var(--font-primary);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-dark);
		cursor: pointer;
	}
	.segmented button[aria-pressed='true'] {
		background: var(--color-tertiary);
		color: var(--color-primary);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
	}
	.segmented button:focus-visible,
	.add-btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	/* stacked: beside the button the list is too narrow to show the option names */
	.add {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.add-btn {
		height: 44px;
		padding: 0 14px;
		border: 1px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
		border-radius: 10px;
		background: transparent;
		font-family: var(--font-primary);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-primary);
		cursor: pointer;
	}
	.add-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
	}
</style>
