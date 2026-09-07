<script>
	import ImageBlock from './image/ImageBlock.svelte';
	import H3 from './heading/H3.svelte';
	import Text from './text/Text.svelte';
	import InlineTags from './InlineTags.svelte';

	export let src = '';
	export let alt = '';
	export let title = '';
	export let text = '';
	export let tags = [];
	export let imageRight = false;
	export let classes = '';
</script>

<section class="image-text" class:image-right={imageRight}>
	<div class="visual"><ImageBlock {src} {alt} {classes} size="GG" /></div>
	<div class="copy">
		<H3 value={title} />
		<Text value={{ body: text }} />
		{#if tags.length}
			<footer><InlineTags {tags} /></footer>
		{/if}
	</div>
</section>

<style>
	.image-text {
		display: grid;
		grid-template-columns: minmax(0, 620px) minmax(0, 450px);
		align-items: center;
		gap: 36px;
		max-width: 1106px;
		width: calc(100% - var(--grid) * 4);
		margin: 36px auto;
	}
	.visual, .copy { min-width: 0; }
	footer { margin-top: 24px; }
	footer :global(.inline-tags) { width: 100%; max-width: none; margin: 0; }
	.visual :global(.image-block) { margin: 0; width: 100%; }
	.copy :global(h3), .copy :global(p) { width: 100%; max-width: none; }
	.copy :global(h3) { margin-top: 0; }
	.copy :global(p:last-child) { margin-bottom: 0; }
	@media (min-width: 768px) {
		.image-text.image-right { grid-template-columns: minmax(0, 450px) minmax(0, 620px); }
		.image-right .copy { grid-column: 1; grid-row: 1; }
		.image-right .visual { grid-column: 2; grid-row: 1; }
	}
	@media (max-width: 767px) {
		.image-text { grid-template-columns: minmax(0, 1fr); gap: 24px; }
	}
</style>
