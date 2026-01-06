#!/usr/bin/env node
/*
  Generate AVIF and WebP variants for selected images under static/.

  Usage:
    node scripts/gen-modern-images.cjs imgs/atbl-app.png imgs/atbl-app-m.png
*/
const fsp = require('node:fs/promises');
const path = require('node:path');

let sharp;
try {
	sharp = require('sharp');
} catch {
	console.error('gen-modern-images: sharp not installed');
	process.exit(1);
}

const inputArgs = process.argv.slice(2);
if (!inputArgs.length) {
	console.error('gen-modern-images: provide one or more image paths (relative to static/)');
	process.exit(1);
}

const qualityAvif = 55;
const qualityWebp = 78;

async function exists(p) {
	try {
		await fsp.access(p);
		return true;
	} catch {
		return false;
	}
}

async function convertOne(relPath) {
	const clean = String(relPath).replace(/^\/*/, '');
	const srcPath = path.resolve('static', clean);
	const ext = path.extname(srcPath).toLowerCase();
	if (!['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(ext)) {
		console.log('skip (unsupported):', relPath);
		return;
	}
	if (!(await exists(srcPath))) {
		console.log('skip (missing):', relPath);
		return;
	}
	const base = srcPath.slice(0, -ext.length);
	const outAvif = `${base}.avif`;
	const outWebp = `${base}.webp`;

	if (!(await exists(outAvif))) {
		await sharp(srcPath).avif({ quality: qualityAvif }).toFile(outAvif);
		console.log('wrote', outAvif);
	}
	if (!(await exists(outWebp))) {
		await sharp(srcPath).webp({ quality: qualityWebp }).toFile(outWebp);
		console.log('wrote', outWebp);
	}
}

async function main() {
	for (const rel of inputArgs) {
		await convertOne(rel);
	}
}

main().catch((err) => {
	console.error('gen-modern-images error:', err);
	process.exit(1);
});
