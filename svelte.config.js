import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';


/** @type {import('@sveltejs/kit').Config} */




// Sempre base vazio para dev e produção

// Gera entradas estáticas para todas as páginas ArchieML
import fs from 'fs';
let archiePages = ['index'];
try {
  const json = fs.readFileSync('./static/archiePages.json', 'utf-8');
  const parsed = JSON.parse(json);
  archiePages = Object.keys(parsed);
} catch {}

const base = '';
const entries = [
  '/',
  ...archiePages.filter(p => p !== 'index').map(p => `/${p}`)
];

const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
      strict: false
    }),
    paths: {
      base
    },
    prerender: {
      entries
    }
  },
  preprocess: [mdsvex()],
  extensions: ['.svelte', '.svx']
};

export default config;
