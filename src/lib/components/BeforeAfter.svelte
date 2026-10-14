<script>
	// Two versions of the same picture, one over the other, with a divider the reader drags.
	// The slider underneath is a real range input, so it also works from the keyboard.
	export let before = '';
	export let after = '';
	export let labelBefore = '';
	export let labelAfter = '';
	export let alt = '';
	export let caption = '';
	export let ratio = 0;
	export let size = 'G';
	// lighter copies for phones (the -m files), and whether this is the first picture on the page
	export let beforeSmall = '';
	export let afterSmall = '';
	export let priority = false;

	let position = 50;
	const WIDTHS = { PP: '250px', P: '450px', M: '640px', G: '875px', GG: '100%' };
</script>

<figure class="before-after" style={`--max:${WIDTHS[size] || WIDTHS.G}`}>
	<div class="stage" style={`--pos:${position}%; ${ratio ? `aspect-ratio:${ratio};` : ''}`}>
		<img
			class="after"
			src={after}
			srcset={afterSmall ? `${afterSmall} 600w, ${after} 1200w` : undefined}
			sizes={afterSmall ? `(max-width: 600px) 100vw, ${WIDTHS[size] || WIDTHS.G}` : undefined}
			{alt}
			loading={priority ? 'eager' : 'lazy'}
			fetchpriority={priority ? 'high' : undefined}
			decoding="async"
			draggable="false"
		/>
		<div class="clip" aria-hidden="true">
			<img
				src={before}
				srcset={beforeSmall ? `${beforeSmall} 600w, ${before} 1200w` : undefined}
				sizes={beforeSmall ? `(max-width: 600px) 100vw, ${WIDTHS[size] || WIDTHS.G}` : undefined}
				alt=""
				loading={priority ? 'eager' : 'lazy'}
				decoding="async"
				draggable="false"
			/>
		</div>
		{#if labelBefore}<span class="label label-before" aria-hidden="true">{labelBefore}</span>{/if}
		{#if labelAfter}<span class="label label-after" aria-hidden="true">{labelAfter}</span>{/if}
		<span class="divider" aria-hidden="true"><span class="knob"></span></span>
		<input
			type="range"
			min="0"
			max="100"
			step="1"
			bind:value={position}
			aria-label={`${labelBefore || 'Before'} / ${labelAfter || 'After'}`}
		/>
	</div>
	{#if caption}<figcaption>{caption}</figcaption>{/if}
</figure>

<style>
	.before-after {
		width: calc(100% - (var(--grid) * 4));
		max-width: var(--max);
		margin: calc(var(--grid) * 6) auto calc(var(--grid) * 3);
		font-family: var(--font-primary);
	}
	.stage {
		position: relative;
		overflow: hidden;
		box-shadow: var(--shadow-surface);
		user-select: none;
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.stage > .after {
		height: auto;
	}
	.stage[style*='aspect-ratio'] > .after {
		height: 100%;
	}
	/* the "before" picture is cut by a clip, not resized, so both stay registered */
	.clip {
		position: absolute;
		inset: 0;
		clip-path: inset(0 calc(100% - var(--pos)) 0 0);
	}
	.divider {
		position: absolute;
		top: 0;
		bottom: 0;
		left: var(--pos);
		width: 2px;
		margin-left: -1px;
		background: #fff;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
	}
	.knob {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 36px;
		height: 36px;
		margin: -18px 0 0 -18px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
	}
	.knob::before,
	.knob::after {
		content: '';
		position: absolute;
		top: 50%;
		width: 7px;
		height: 7px;
		border: solid #121214;
		border-width: 2px 2px 0 0;
	}
	.knob::before {
		left: 8px;
		transform: translateY(-50%) rotate(-135deg);
	}
	.knob::after {
		right: 8px;
		transform: translateY(-50%) rotate(45deg);
	}
	.label {
		position: absolute;
		top: calc(var(--grid) * 1.5);
		padding: 3px 8px;
		background: rgba(18, 18, 20, 0.78);
		color: #fff;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.label-before {
		left: calc(var(--grid) * 1.5);
	}
	.label-after {
		right: calc(var(--grid) * 1.5);
	}
	input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: ew-resize;
		touch-action: pan-y;
	}
	.stage:focus-within .knob {
		outline: 3px solid var(--color-primary);
		outline-offset: 2px;
	}
	figcaption {
		margin-top: calc(var(--grid) * 1.25);
		font-size: calc(var(--grid) * 1.6);
		line-height: 1.45;
		color: color-mix(in srgb, var(--color-dark) 68%, transparent);
	}
</style>
