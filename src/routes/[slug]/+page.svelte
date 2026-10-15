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
			// a bullet's label is decoration; the sentence after it is prose
			// role, team and period labels are metadata, not the page's description
			if (/^<bullet texto='(Role|Team|Period)'/i.test(line.trim())) continue;
			const text = line.trim().replace(/^<bullet[^>]*\/>\s*/i, '');
			if (/^\{[^}]*\}$/.test(text)) inBlock = text !== '{}';
			if (inBlock || !text || /^(\{|h\d:|chapeu:|pdf:|<a |<strong>Role|\w+:\s)/i.test(text)) continue;
			const plain = stripHtml(text);
			if (plain.length < 60) continue;
			return plain.length > 158 ? `${plain.slice(0, 155).replace(/\s+\S*$/, '')}…` : plain;
		}
		return '';
	}
	// The page's own title: its menu name when it has one, otherwise its headline.
	function titleOf(slug) {
		const entry = pages[slug];
		if (entry && typeof entry === 'object' && entry.showInMenu && entry.menuLabel)
			return `${entry.menuLabel} | Fabio Sales`;
		const raw = typeof entry === 'object' && entry ? entry.content : entry;
		const h1 = String(raw || '').match(/^h1:\s*(.+)$/m);
		return h1 ? `${stripHtml(h1[1])} | Fabio Sales` : 'Fabio Sales';
	}
	$: description = describe($page.params.slug);
	$: title = titleOf($page.params.slug);
	$: url = `https://fhrsales.github.io/Portfolio/${$page.params.slug}/`;
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:url" content={url} />
	<meta name="twitter:title" content={title} />
	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
		<meta name="twitter:description" content={description} />
	{/if}
</svelte:head>

<!-- Remount on every page change so blocks never keep the previous page's images -->
{#key $page.params.slug}
	<ArchieRenderer {base} />
{/key}
