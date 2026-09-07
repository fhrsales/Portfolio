import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import ScrollerVideo from './ScrollerVideo.svelte';
import pages from '../archiePages.json';
import { buildBlockObjects } from '../parsers/content.js';

it('keeps the Archive introduction and viewport-filling video in one immersive section', () => {
	const blocks = buildBlockObjects(pages.archive.content.split(/\n\n+/));
	const conf = blocks.find((block) => block.raw?.scrollerVideo).raw.scrollerVideo;
	const { body } = render(ScrollerVideo, { props: {
		introTitle: conf['intro-title'], introText: conf['intro-text'], objectFit: conf.fit
	} });
	expect(body).toContain('immersive');
	expect(body).toContain(conf['intro-title']);
	expect(body).toContain(conf['intro-text']);
	expect(body).toContain('object-fit:cover');
	expect(render(ScrollerVideo).body).not.toContain('<header');
});


it('keeps the ATBL scroll video in the normal page flow without a tall spacer', () => {
 const blocks = buildBlockObjects(pages.index.content.split(/\n\n+/));
 const conf = blocks.find((block) => block.raw?.scrollerVideo).raw.scrollerVideo;
 expect(conf.fixar).toBe('nao');
 const { body } = render(ScrollerVideo, { props: {
  pin: conf.fixar !== 'nao', stageRatio: conf.proporcao, size: conf.tamanho
 } });
 expect(body).toContain('height:auto');
 expect(body).toContain('aspect-ratio: 16 / 9');
 expect(body).not.toContain('position: sticky');
});
