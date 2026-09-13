import { writable } from 'svelte/store';
import pages from '$lib/archiePages.json';
import homeContent from '$lib/homeContent.js';

export const isAuthenticated = writable(false);

// Dev and production start from the same tracked content; editor drafts stay in memory.
// Keep the large Archie content JSON untouched; the home editorial revision is isolated
// so changes to the landing page cannot accidentally truncate other portfolio pages.
const initialPages = structuredClone(pages);
initialPages.index = {
	...(initialPages.index || {}),
	content: homeContent
};

export const archiePages = writable(initialPages);
