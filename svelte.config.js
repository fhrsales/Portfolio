import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';


/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    paths: {
      base: process.env.NODE_ENV === 'development' ? '' : '/Portfolio'
    }
  },
  preprocess: [mdsvex()],
  extensions: ['.svelte', '.svx']
};

export default config;
