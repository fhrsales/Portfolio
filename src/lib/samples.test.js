import { expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { galleryCrop } from './components/image/galleryCrop.js';

it('keeps publication pages, crops and physical formats valid without changing originals', () => {
	const { files } = JSON.parse(readFileSync('static/imgs/samples/manifest.json', 'utf8'));
	const formats = { standard: [898, 1579], 'standard-double': [1794, 1579], tabloid: [736, 894], 'tabloid-double': [1718, 894] };
	expect(new Set(files.map(f => f.id)).size).toBe(files.length);
	expect(new Set(files.map(f => `${f.name}:${f.crop.join(',')}`)).size).toBe(files.length);
	for (const file of files) {
		expect(existsSync(`static/imgs/samples/${file.name}`)).toBe(true);
		expect(['o-dia', 'correio', 'estadao', 'diario-de-noticias']).toContain(file.publication);
		const dimensions = [...formats[file.format]];
		if (file.rotation === 90) dimensions.reverse();
		expect([file.width, file.height]).toEqual(dimensions);
		const [x, y, w, h] = file.crop;
		expect(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= file.sourceWidth && y + h <= file.sourceHeight).toBe(true);
		expect(galleryCrop(file).image).not.toMatch(/NaN|Infinity/);
	}
	const page = { width: 100, height: 200, sourceWidth: 400, sourceHeight: 600, crop: [100, 100, 200, 400] };
	expect(galleryCrop(page)).toEqual({ frame: 'width:100%;height:100%;transform:translate(-50%,-50%) rotate(0deg);', image: 'position:absolute;max-width:none;max-height:none;width:200%;height:150%;left:-50%;top:-25%;' });
});
