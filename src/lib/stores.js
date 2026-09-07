import { writable } from 'svelte/store';
import pages from '$lib/archiePages.json';

export const isAuthenticated = writable(false);

// Dev and production start from the same tracked content; editor drafts stay in memory.
export const archiePages = writable(structuredClone(pages));
