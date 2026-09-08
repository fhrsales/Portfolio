import { it, expect } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { savePage, saveSamples } from './editor.js';

it('saves only the edited page and rejects stale or invalid edits', () => {
	const dir = mkdtempSync(join(tmpdir(), 'portfolio-editor-'));
	const file = join(dir, 'pages.json');
	const original = { content: 'old', menuLabel: 'Archive', showInMenu: true, order: 2 };
	const data = { content: 'new', menuLabel: 'Archive', showInMenu: true };
	try {
		writeFileSync(file, JSON.stringify({ archive: original, index: { content: 'home' } }));
		expect(savePage(file, { page: 'archive', original, data })).toEqual({ ...original, ...data });
		expect(JSON.parse(readFileSync(file)).index).toEqual({ content: 'home' });
		expect(() => savePage(file, { page: 'archive', original, data })).toThrow('mudou');
		expect(() => savePage(file, { page: '../file', data })).toThrow('inválida');
	} finally {
		rmSync(dir, { recursive: true });
	}
});


it('hides and restores samples without removing entries and rejects stale selections', () => {
	const dir = mkdtempSync(join(tmpdir(), 'portfolio-samples-'));
	const file = join(dir, 'manifest.json');
	const original = { files: [{ id: 'a', name: 'a.png' }, { id: 'b', name: 'b.png' }] };
	try {
		writeFileSync(file, JSON.stringify(original));
		expect(() => saveSamples(file, { original, hiddenIds: ['missing'] })).toThrow('inválida');
		const saved = saveSamples(file, { original, hiddenIds: ['a'] });
		expect(saved.files).toEqual([{ ...original.files[0], hidden: true }, original.files[1]]);
		expect(JSON.parse(readFileSync(file))).toEqual(saved);
		expect(() => saveSamples(file, { original, hiddenIds: [] })).toThrow('mudou');
		expect(saveSamples(file, { original: saved, hiddenIds: [] })).toEqual(original);
	} finally {
		rmSync(dir, { recursive: true });
	}
});

it('sorts dates within each publication, puts undated pages last, and validates dates', () => {
 const dir = mkdtempSync(join(tmpdir(), 'portfolio-dates-'));
 const file = join(dir, 'manifest.json');
 const original = { files: [
  {id:'a',publication:'one'}, {id:'b',publication:'one',hidden:true},
  {id:'c',publication:'two'}, {id:'d',publication:'one'}
 ]};
 try {
  writeFileSync(file, JSON.stringify(original));
  expect(() => saveSamples(file,{original,hiddenIds:['b'],dates:{a:'2001-02-30'}})).toThrow('Data inválida');
  const saved=saveSamples(file,{original,hiddenIds:['b'],dates:{a:'2002-01-01',b:'2001-01-01',c:'1999-01-01'}});
  expect(saved.files.map(f=>f.id)).toEqual(['b','a','d','c']);
  expect(saved.files[0].hidden).toBe(true);
  const cleared=saveSamples(file,{original:saved,hiddenIds:['b'],dates:{b:''}});
  expect(cleared.files.map(f=>f.id)).toEqual(['a','b','d','c']);
  expect(cleared.files[1].date).toBeUndefined();
 } finally { rmSync(dir,{recursive:true}); }
});

it('keeps World Cup pages together when saving dates and visibility', () => {
 const dir=mkdtempSync(join(tmpdir(),'portfolio-groups-'));
 const file=join(dir,'manifest.json');
 const original={files:[
  {id:'a',publication:'correio',date:'2002-06-12',group:'copas'},
  {id:'b',publication:'correio',date:'2002-08-09'},
  {id:'c',publication:'correio',group:'copas',hidden:true},
  {id:'d',publication:'correio',group:'copas'}
 ]};
 try {
  writeFileSync(file,JSON.stringify(original));
  const saved=saveSamples(file,{original,hiddenIds:['c']});
  expect(saved.files.map(f=>f.id)).toEqual(['a','c','d','b']);
  expect(saved.files.find(f=>f.id==='c').hidden).toBe(true);
  expect(saveSamples(file,{original:saved,hiddenIds:['c']}).files).toEqual(saved.files);
 } finally {rmSync(dir,{recursive:true});}
});
