import pages from '$lib/archiePages.json';

export const prerender = true;

export function entries() {
	if (!pages || typeof pages !== 'object') return [];
	return Object.keys(pages)
		.filter((slug) => slug && slug !== 'index')
		.map((slug) => ({ slug }));
}
