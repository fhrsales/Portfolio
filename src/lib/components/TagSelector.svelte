<script>
    import { archiePages } from '$lib/stores';
    import { derived } from 'svelte/store';
    import { onMount } from 'svelte';
    import Button from '$lib/components/ui/Button.svelte';

    // bindable selected tag
    export let selected = '';

    // optional externally provided list of tags
    export let tags = null;

    // derive a unique sorted list of tags from archiePages when tags not provided
    const allTags = derived(archiePages, $archiePages => {
        const set = new Set();
        if (!$archiePages) return [];
        for (const key of Object.keys($archiePages)) {
            const item = $archiePages[key];
            let content = '';
            if (item) content = item.content || '';
            if (!content) continue;
            const lines = String(content).split(/\n+/).map(l => l.trim()).filter(Boolean);
            for (let i = 0; i < lines.length; i++) {
                const m = lines[i].match(/^tags:\s*(.+)$/i);
                if (m) {
                    m[1].split(',').map(t => t.trim()).filter(Boolean).forEach(t => set.add(t.toLowerCase()));
                }
            }
        }
        return Array.from(set).sort();
    });

    let derivedTags = [];
    const unsubscribe = allTags.subscribe(v => derivedTags = v);
    onMount(() => {
        return () => unsubscribe();
    });

    $: visibleTags = tags && Array.isArray(tags) ? tags : derivedTags;

    function toggle(t) {
        selected = (selected === t) ? '' : t;
    }
</script>

<div class="tag-selector">
    <Button on:click={() => selected = ''} active={selected === ''}>All</Button>
    {#if visibleTags && visibleTags.length}
        {#each visibleTags as t}
            <Button on:click={() => toggle(t)} active={selected === t}>{t}</Button>
        {/each}
    {/if}
</div>

<style>
    .tag-selector {
        position: sticky;
        top: calc(var(--grid) * 12);
        display: flex;
        gap: calc(var(--grid) * 0.5);
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        z-index: 2;
        margin: 0 auto calc(var(--grid) * 3) auto;
        width: calc(100% - (var(--grid) * 4));
        max-width: calc(var(--grid) * 70);
    }
    .tag-selector button {
        background: var(--color-light);
        border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);;
        padding: 0.35rem 1rem;
        border-radius: 999px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: var(--shadow-2);
        font-size: calc(var(--grid) * 1.18);
        text-transform: uppercase;
        color: var(--color-primary);
    }
    .tag-selector button.active {
        background: var(--color-primary);
        color: white;
    }
</style>
