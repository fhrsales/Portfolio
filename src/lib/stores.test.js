import { expect, it } from 'vitest';
import { get } from 'svelte/store';
import { readFileSync } from 'node:fs';
import { archiePages } from './stores.js';
import pages from './archiePages.json';
import { entries } from '../routes/[slug]/+page.js';

it('loads the tracked content immediately, including the Archive route and real MP4', () => {
	expect(get(archiePages)).toEqual(pages);
	expect(get(archiePages)).not.toBe(pages);
	expect(pages.archive.showInMenu).toBe(true);
	expect(pages.archive.content).toContain('video: tapui-scrolly.mp4');
	expect(pages.archive.content).toContain('video-mobile: tapui-scrolly.mp4');
	expect(pages.archive.content).toContain('video-desktop: tapui-scrolly.mp4');
	expect(entries()).toContainEqual({ slug: 'archive' });
	const video = readFileSync('static/videos/tapui-scrolly.mp4');
	expect(video.toString('ascii', 4, 8)).toBe('ftyp');
});
