/*
  Generate src/lib/imageMeta.json with width/height/ratio for static/imgs/*.
*/
const fsp = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function parseSipsOutput(out) {
	const w = out.match(/pixelWidth:\s*(\d+)/i);
	const h = out.match(/pixelHeight:\s*(\d+)/i);
	return {
		width: w ? Number(w[1]) : 0,
		height: h ? Number(h[1]) : 0
	};
}

function getSizeWithSips(file) {
	try {
		const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], {
			encoding: 'utf8'
		});
		return parseSipsOutput(out);
	} catch {
		return { width: 0, height: 0 };
	}
}

async function main() {
	let sharp = null;
	try {
		sharp = require('sharp');
	} catch {
		sharp = null;
	}
	const imgsDir = path.resolve('static', 'imgs');
	const outFile = path.resolve('src', 'lib', 'imageMeta.json');
	const map = {};
	const files = new Set();
	let entries = [];
	try {
		entries = await fsp.readdir(imgsDir, { withFileTypes: true });
	} catch (e) {
		console.error('gen-image-meta: cannot read', imgsDir, e && e.message);
		process.exit(0);
	}
	for (const ent of entries) {
		if (!ent.isFile()) continue;
		const file = path.join(imgsDir, ent.name);
		const ext = path.extname(file).toLowerCase();
		if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue;
		files.add(ent.name);
	}
	for (const ent of entries) {
		if (!ent.isFile()) continue;
		const file = path.join(imgsDir, ent.name);
		const ext = path.extname(file).toLowerCase();
		if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue;
		const base = path.basename(ent.name, ext);
		const hasAvif = files.has(`${base}.avif`);
		const hasWebp = files.has(`${base}.webp`);
		try {
			let w = 0;
			let h = 0;
			if (sharp) {
				const meta = await sharp(file).metadata();
				w = meta.width || 0;
				h = meta.height || 0;
			} else {
				const meta = getSizeWithSips(file);
				w = meta.width || 0;
				h = meta.height || 0;
			}
			const ratio = w && h ? Number((w / h).toFixed(6)) : 0;
			map[ent.name] = { width: w, height: h, ratio, avif: hasAvif, webp: hasWebp };
		} catch {
			// ignore individual failures
		}
	}
	await fsp.writeFile(outFile, JSON.stringify(map, null, '\t'));
	console.log('gen-image-meta: wrote', outFile);
}

main().catch((e) => {
	console.error('gen-image-meta error:', e);
	process.exit(1);
});
