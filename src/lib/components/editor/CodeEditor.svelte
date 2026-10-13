<!-- eslint-disable svelte/no-at-html-tags -->
<script>
	/* eslint-disable svelte/no-at-html-tags */
	import { createEventDispatcher } from 'svelte';
	import { highlight } from './editorSchema.js';

	export let value = '';
	// exposed so the page can focus it and move the selection
	export let textarea = undefined;
	// { start, end }: the lines of the block open in the inspector, shown as a band
	export let active = null;

	const dispatch = createEventDispatcher();
	let mirror;

	function syncScroll() {
		if (mirror && textarea) mirror.scrollTop = textarea.scrollTop;
	}
	function reportCursor() {
		if (!textarea) return;
		dispatch('cursor', { line: value.slice(0, textarea.selectionStart).split('\n').length - 1 });
	}
</script>

<div class="code-editor">
	<pre class="mirror" aria-hidden="true" bind:this={mirror}>{@html highlight(value, active)}</pre>
	<textarea
		bind:this={textarea}
		bind:value
		spellcheck="false"
		autocapitalize="off"
		autocomplete="off"
		aria-label="Conteúdo da página"
		placeholder="Digite o conteúdo aqui..."
		on:scroll={syncScroll}
		on:keyup={reportCursor}
		on:click={reportCursor}
		on:focus={reportCursor}
		on:input={reportCursor}
		on:keydown
	></textarea>
</div>

<style>
	.code-editor {
		position: relative;
		flex: 1;
		min-height: 320px;
		background: var(--color-tertiary);
		border: 1px solid color-mix(in srgb, var(--color-dark) 30%, transparent);
		border-radius: 10px;
		overflow: hidden;
	}
	.code-editor:focus-within {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 22%, transparent);
	}
	/* The two layers must wrap identically: same font, padding and scrollbar space. */
	.mirror,
	textarea {
		position: absolute;
		inset: 0;
		margin: 0;
		padding: calc(var(--grid) * 2);
		border: none;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 14px;
		line-height: 1.7;
		letter-spacing: 0;
		tab-size: 2;
		white-space: pre-wrap;
		overflow-wrap: break-word;
		overflow-y: scroll;
		scrollbar-gutter: stable;
	}
	.mirror {
		color: var(--color-dark);
		pointer-events: none;
		scrollbar-color: transparent transparent;
	}
	textarea {
		width: 100%;
		height: 100%;
		resize: none;
		outline: none;
		background: transparent;
		color: transparent;
		caret-color: var(--color-dark);
	}
	textarea::placeholder {
		color: color-mix(in srgb, var(--color-dark) 45%, transparent);
	}
	textarea::selection {
		background: color-mix(in srgb, var(--color-primary) 25%, transparent);
	}
	.mirror :global(.tk-block) {
		color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 10%, transparent);
		border-radius: 3px;
	}
	.mirror :global(.ln-active) {
		margin: 0 calc(var(--grid) * -2);
		padding: 0 calc(var(--grid) * 2);
		background: color-mix(in srgb, var(--color-primary) 7%, transparent);
		box-shadow: inset 3px 0 0 var(--color-primary);
	}
	.mirror :global(.tk-key) {
		color: color-mix(in srgb, var(--color-dark) 58%, transparent);
	}
	.mirror :global(.tk-value) {
		color: var(--color-success);
	}
	.mirror :global(.tk-comment) {
		color: color-mix(in srgb, var(--color-dark) 45%, transparent);
		font-style: italic;
	}
	@media (max-width: 600px) {
		.mirror,
		textarea {
			font-size: 16px; /* avoids the automatic zoom on iOS */
			padding: calc(var(--grid) * 1.5);
		}
	}
</style>
