import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */

const isProd = process.env.NODE_ENV === 'production';
const base = isProd ? '/Portfolio' : '';

const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      strict: false
    }),
    paths: {
      base
    },
    prerender: {
      entries: []
    }
  },
  preprocess: [mdsvex()],
  extensions: ['.svelte', '.svx']
};

export default config;
