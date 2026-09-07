import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import ScrollerVideo from './ScrollerVideo.svelte';
import pages from '../archiePages.json';
import { buildBlockObjects } from '../parsers/content.js';

it('keeps the Archive introduction and uncropped video in one immersive section', () => {
	const blocks = buildBlockObjects(pages.archive.content.split(/\n\n+/));
	const conf = blocks.find((block) => block.raw?.scrollerVideo).raw.scrollerVideo;
	const { body } = render(ScrollerVideo, { props: {
		introTitle: conf['intro-title'], introText: conf['intro-text'], objectFit: conf.fit
	} });
	expect(body).toContain('immersive');
	expect(body).toContain(conf['intro-title']);
	expect(body).toContain(conf['intro-text']);
	expect(body).toContain('object-fit:contain');
	expect(render(ScrollerVideo).body).not.toContain('<header');
});
