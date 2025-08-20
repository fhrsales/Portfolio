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

const isProd = process.env.NODE_ENV === 'production';
const base = isProd ? '/Portfolio' : '';
const entries = [
  '/',
  ...archiePages.filter(p => p !== 'index').map(p => `/${p}`)
];

console.log('Entradas para prerender:', entries);
const config = {
  kit: {
    // trailingSlash: 'always',
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
      entries,
      handleUnseenRoutes: (route, opts) => {
        // Ignora rotas não encontradas para evitar erro de build
        if (route === '/demo/lucia/login') return 'ignore';
        return 'error';
      }
    }
  },
  preprocess: [mdsvex()],
  extensions: ['.svelte', '.svx']
};

export default config;
