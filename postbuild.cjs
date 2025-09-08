// Duplicate SvelteKit SPA fallback to index.html for GitHub Pages
// Rationale: with adapter-static and no prerendered pages, only the fallback
// HTML is emitted (we use 404.html for deep-link support on GitHub Pages).
// GitHub Pages also requires an index.html at the root, so we copy 404.html
// to index.html after build when needed.

const { copyFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

const buildDir = resolve('build');
const fallback = resolve(buildDir, '404.html');
const index = resolve(buildDir, 'index.html');

try {
	if (existsSync(fallback) && !existsSync(index)) {
		copyFileSync(fallback, index);
		console.log('postbuild: copied build/404.html -> build/index.html');
	} else {
		console.log('postbuild: nothing to do');
	}
} catch (err) {
	console.error('postbuild: failed to ensure index.html', err);
	process.exitCode = 1;
}
