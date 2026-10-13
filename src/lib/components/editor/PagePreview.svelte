<script>
	import { onDestroy } from 'svelte';
	import { resolve } from '$app/paths';

	// The real page runs in a frame, so its own breakpoints apply; the draft reaches it by message.
	export let page = 'index';
	export let content = '';

	const DESKTOP_WIDTH = 1280;
	let mode = 'mobile';
	let frame;
	let stageWidth = 0;
	let stageHeight = 0;
	let timer;

	$: src = resolve(page === 'index' ? '/' : `/${page}`);
	$: scale = mode === 'desktop' && stageWidth ? Math.min(1, stageWidth / DESKTOP_WIDTH) : 1;

	function send() {
		frame?.contentWindow?.postMessage(
			{ type: 'editor-draft', page, content },
			window.location.origin
		);
	}
	// Debounced so typing stays smooth.
	function schedule() {
		clearTimeout(timer);
		timer = setTimeout(send, 300);
	}
	$: (page, content, schedule());
	onDestroy(() => clearTimeout(timer));
</script>

<section class="preview">
	<div class="preview-head">
		<h2>Prévia</h2>
		<div class="segmented" role="group" aria-label="Largura da prévia">
			<button type="button" aria-pressed={mode === 'mobile'} on:click={() => (mode = 'mobile')}
				>Celular</button
			>
			<button type="button" aria-pressed={mode === 'desktop'} on:click={() => (mode = 'desktop')}
				>Desktop</button
			>
		</div>
	</div>
	<div
		class="stage"
		class:desktop={mode === 'desktop'}
		bind:clientWidth={stageWidth}
		bind:clientHeight={stageHeight}
	>
		{#key src}
			<iframe
				bind:this={frame}
				{src}
				title="Prévia da página"
				on:load={send}
				style={mode === 'desktop'
					? `width:${DESKTOP_WIDTH}px; height:${stageHeight / scale}px; transform:scale(${scale});`
					: 'width:min(375px, 100%); height:100%;'}
			></iframe>
		{/key}
	</div>
</section>

<style>
	.preview {
		display: flex;
		flex-direction: column;
		gap: calc(var(--grid) * 1.25);
		min-height: 0;
		height: 100%;
		font-family: var(--font-primary);
	}
	.preview-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 44px;
	}
	h2 {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-dark) 65%, transparent);
	}
	.segmented {
		display: flex;
		padding: 3px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-dark) 9%, transparent);
	}
	.segmented button {
		min-height: 36px;
		padding: 0 14px;
		border: none;
		border-radius: 999px;
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
	.segmented button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	.stage {
		flex: 1;
		min-height: 360px;
		display: flex;
		justify-content: center;
		background: color-mix(in srgb, var(--color-dark) 9%, transparent);
		border-radius: 10px;
		overflow: hidden;
	}
	.stage.desktop {
		justify-content: flex-start;
	}
	iframe {
		flex-shrink: 0;
		border: none;
		background: var(--color-light);
		transform-origin: top left;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
	}
</style>
