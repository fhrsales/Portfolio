<script>
    import { archiePages } from '$lib/stores';
    import ArchieML from 'archieml';
    import { derived } from 'svelte/store';
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    import ArchieRenderer from '$lib/components/ArchieRenderer.svelte';
</script>

<ArchieRenderer {base} />