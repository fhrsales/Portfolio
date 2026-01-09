<script>
	export let texto = '';
	export let cor = '';
	export let renderOnlyStyle = false;
</script>

{#if !renderOnlyStyle}
	<span class="bullet" style={cor ? `--bullet-bg: ${cor};` : ''}>
		{texto}
	</span>
{/if}

<style>
	:global(.bullet) {
		--bullet-bg: var(--color-danger);
		--bullet-fg: var(--color-light);
		position: relative;
        top: -5px;
		display: inline-flex;
		align-items: center;
		padding: 4px 14px 3px 16px;
		background: var(--bullet-bg);
		color: var(--bullet-fg);
		border-radius: 12px 0 0 12px;
        font-size: 55%;
		font-weight: 600;
		letter-spacing: 0.02em;
		line-height: 1.1;
		text-transform: uppercase;
        margin-right: 10px;
	}
	:global(.bullet)::after {
		content: '';
		position: absolute;
		top: 50%;
		right: -6px;
        border-radius: 2px;
		width: 13px;
		height: 13px;
		background: inherit;
		transform: translateY(-50%) rotate(45deg);
	}
</style>
