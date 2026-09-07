import { expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

it('keeps every gallery image and imported source in the versioned manifest', () => {
	const { files } = JSON.parse(readFileSync('static/imgs/samples/manifest.json', 'utf8'));
	const sources = JSON.parse(readFileSync('static/imgs/samples/source-map.json', 'utf8'));
	const names = new Set(files.map((file) => file.name));
	expect(names.size).toBe(files.length);
	expect(files.every((file) => file.width > 0 && file.height > 0 && existsSync(`static/imgs/samples/${file.name}`))).toBe(true);
	expect(sources.files.every((file) => names.has(file.name))).toBe(true);
});
