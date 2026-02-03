<script>
	import { archiePages } from '$lib/stores';
	import { stripCommentLines } from '$lib/parsers/content.js';
	import { derived } from 'svelte/store';
    import { onDestroy } from 'svelte';
    import Button from '$lib/components/ui/Button.svelte';

	// bindable selected tag
	export let selected = '';

	// optional externally provided list of tags
	export let tags = null;

	// derive a unique sorted list of tags from archiePages when tags not provided
	const allTags = derived(archiePages, ($archiePages) => {
		const map = Object.create(null);
		if (!$archiePages) return [];
		for (const key of Object.keys($archiePages)) {
			const item = $archiePages[key];
			let content = '';
			if (item) content = item.content || '';
			if (!content) continue;
			const lines = stripCommentLines(content)
				.split(/\n+/)
				.map((l) => l.trim())
				.filter(Boolean);
			for (let i = 0; i < lines.length; i++) {
				const m = lines[i].match(/^tags:\s*(.+)$/i);
				if (m) {
					m[1]
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean)
						.forEach((t) => (map[t.toLowerCase()] = true));
				}
			}
		}
		return Object.keys(map).sort();
	});

	let derivedTags = [];
    const unsubscribe = allTags.subscribe((v) => (derivedTags = v));
    onDestroy(() => unsubscribe());

	$: visibleTags = tags && Array.isArray(tags) ? tags : derivedTags;

	function toggle(t) {
		selected = selected === t ? '' : t;
	}
</script>

<div class="tag-selector">
	<Button on:click={() => (selected = '')} active={selected === ''}>All</Button>
	{#if visibleTags && visibleTags.length}
		{#each visibleTags as t (t)}
			<Button on:click={() => toggle(t)} active={selected === t}>{t}</Button>
		{/each}
	{/if}
</div>

<style>
    .tag-selector {
        display: flex;
        gap: calc(var(--grid) * 0.5);
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        margin: calc(var(--grid) * 1) auto calc(var(--grid) * 3) auto;
        width: calc(100% - (var(--grid) * 4));
        max-width: calc(var(--grid) * 70);
        opacity: 1;
        transition: opacity 360ms ease;
    }
	:global(html.has-intro-h2:not(.intro-h2-exited)) .tag-selector {
		opacity: 0;
		pointer-events: none;
	}
	:global(html.has-intro-h2.intro-h2-exited) .tag-selector {
		opacity: 1;
		pointer-events: auto;
	}
    /* Style underlying .btn from Button component */
    .tag-selector :global(.btn) {
        text-transform: uppercase;
    }
	.tag-selector :global(.btn.primary),
	.tag-selector :global(.btn.active) {
		background: var(--color-primary);
		color: #fff;
	}
	.tag-selector :global(.btn:hover:not(.active):not(.primary)) {
		background: color-mix(in srgb, var(--color-primary) 12%, var(--color-light));
		color: var(--color-primary);
	}

    /* Mobile: smaller chips */
    @media (max-width: 600px) {
        .tag-selector {
            gap: calc(var(--grid) * 0.35);
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            width: 100%;
            max-width: 100%;
            padding: 0 calc(var(--grid) * 2) calc(var(--grid) * 1) calc(var(--grid) * 2);
        }
        .tag-selector::-webkit-scrollbar {
            display: none;
        }
        .tag-selector :global(.btn) {
            padding: 0.35rem 0.7rem;
            font-size: calc(var(--grid) * 0.9);
            flex: 0 0 auto;
            white-space: nowrap;
        }
    }
	@media (min-width: 900px) {
		.tag-selector {
			max-width: 875px;
		}
	}
</style>
