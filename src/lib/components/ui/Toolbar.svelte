<script>
	export let ariaLabel = 'Ferramentas';
	export let align = 'end'; // 'start' | 'center' | 'end'
</script>

<div class={`toolbar ${align}`} role="toolbar" aria-label={ariaLabel}>
	<slot />
</div>

<style>
	.toolbar {
		display: flex;
		gap: calc(var(--grid) * 0.75);
		align-items: center;
		flex-wrap: wrap;
	}
	.toolbar.start { justify-content: flex-start; }
	.toolbar.center { justify-content: center; }
	.toolbar.end { justify-content: flex-end; }
</style>
