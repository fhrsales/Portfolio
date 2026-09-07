import { it, expect } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { savePage } from './editor.js';

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
