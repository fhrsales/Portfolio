import { describe, it, expect } from 'vitest';
import { normalizeParsedToBlocks, buildBlockObjects, annotateBlocks } from './content.js';

describe('content parsers', () => {
	it('normalizes usedParsed into blocks', () => {
		const blocks = normalizeParsedToBlocks({
			titulo: 'Hello',
			embedWrapper: 'https://x',
			pdf: 'doc.pdf',
			body: 'line1\nline2',
			orderedContent: ['extra']
		});
		expect(blocks[0]).toMatch(/^titulo:/);
		expect(blocks).toContain('extra');
	});

	it('builds block objects and tags from imagem lines and trailing tags', () => {
		const blocks = ['imagem: a.jpg, M, cap, destaque', 'tags: extra', 'tagSelector: ["capa"]'];
		const objs = buildBlockObjects(blocks);
		expect(objs[0].tags).toContain('destaque');
		expect(objs[0].tags).toContain('extra');
		expect(objs.at(-1).selector).toBe(true);
	});

	it('annotates blocks after selector', () => {
		const objs = [{ raw: 'x' }, { raw: 'y', selector: true }, { raw: 'z' }];
		const ann = annotateBlocks(objs);
		expect(ann[0].isAfterSelector).toBe(false);
		expect(ann[2].isAfterSelector).toBe(true);
	});
});
