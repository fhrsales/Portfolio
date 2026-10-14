<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import ArchieRenderer from '$lib/components/ArchieRenderer.svelte';
	import pages from '$lib/archiePages.json';

	// The page's first paragraph of prose becomes its search and share description.
	const stripHtml = (value) =>
		String(value || '')
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
	function describe(slug) {
		const entry = pages[slug];
		const raw = typeof entry === 'object' && entry ? entry.content : entry;
		let inBlock = false;
		for (const line of String(raw || '').split(/\n+/)) {
			const text = line.trim();
			if (/^\{[^}]+\}$/.test(text)) inBlock = text !== '{}';
			if (inBlock || !text || /^(\{|h\d:|chapeu:|pdf:|<a |<bullet|<strong>Role|\w+:\s)/i.test(text)) continue;
			const plain = stripHtml(text);
			if (plain.length < 60) continue;
			return plain.length > 158 ? `${plain.slice(0, 155).replace(/\s+\S*$/, '')}…` : plain;
		}
		return '';
	}
	$: description = describe($page.params.slug);
</script>

<svelte:head>
	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
		<meta name="twitter:description" content={description} />
	{/if}
</svelte:head>

<ArchieRenderer {base} />
