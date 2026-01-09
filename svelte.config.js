import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */

const isProd = process.env.NODE_ENV === 'production';
const base = isProd ? '/Portfolio' : '';

const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			strict: false
		}),
		paths: {
			base
		},
		prerender: {
			entries: ['*']
		}
	},
	// no additional preprocessors; using plain Svelte
	extensions: ['.svelte']
};

export default config;
