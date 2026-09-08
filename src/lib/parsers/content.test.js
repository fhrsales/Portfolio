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


it('places credits after the description and links without crossing into another project', () => {
 const media = { raw: { nome: 'a.png' }, tags: ['design'] };
 const input = [media, { raw: 'h3: Project' }, { raw: 'Description' },
  { raw: "<a href='/project'>View the project →</a>" }, { raw: '{divisor}' },
  { raw: { nome: 'b.png' }, tags: ['code'] }, { raw: 'h3: Other' }, { raw: 'Other description' }];
 const result = annotateBlocks(input);
 expect(result[0].footerTags).toBeUndefined();
 expect(result[3].footerTags).toEqual(['design']);
 expect(result[1].tags).toEqual(['design']);
 expect(result[4].tags).toBeUndefined();
 expect(result[7].footerTags).toEqual(['code']);
 expect(input[1].tags).toBeUndefined();
 const ownFooter = annotateBlocks([{ raw: { imagemTexto: {} }, tags: ['design'] }]);
 expect(ownFooter[0].footerTags).toBeUndefined();
});

 it('parses an editable eyebrow inside a content block', () => {
  const result = buildBlockObjects(['{bloco}\nchapeu: Blue\nh4: New interaction\n{}']);
  expect(result[0].raw.bloco.items).toEqual([
   { type: 'eyebrow', text: 'Blue' },
   { type: 'heading', level: 4, text: 'New interaction' }
  ]);
 });

 it('accepts an eyebrow and heading on consecutive lines outside a block', () => {
  for (const separator of ['\n', '\r\n']) {
   const result = buildBlockObjects([`chapeu: ATBL${separator}h4: Product title`]);
   expect(result.map(item => item.raw)).toEqual(['chapeu: ATBL', 'h4: Product title']);
  }
 });
