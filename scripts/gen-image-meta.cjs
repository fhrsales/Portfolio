/*
  Generate src/lib/imageMeta.json with width/height/ratio for static/imgs/*.
*/
const fsp = require('node:fs/promises');
const path = require('node:path');

async function main() {
	let sharp;
	try {
		sharp = require('sharp');
	} catch {
		console.error('gen-image-meta: sharp not installed');
		process.exit(0);
	}
	const imgsDir = path.resolve('static', 'imgs');
	const outFile = path.resolve('src', 'lib', 'imageMeta.json');
	const map = {};
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
		try {
			const meta = await sharp(file).metadata();
			const w = meta.width || 0;
			const h = meta.height || 0;
			const ratio = w && h ? Number((w / h).toFixed(6)) : 0;
			map[ent.name] = { width: w, height: h, ratio };
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
