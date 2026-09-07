import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import ImageText from './ImageText.svelte';
import { buildBlockObjects } from '../parsers/content.js';
import pages from '../archiePages.json';

it('parses Favela as one image/text block with its link and filter tags intact', () => {
 const blocks = buildBlockObjects(pages.archive.content.split(/\n\n+/));
 const block = blocks.find((b) => b.raw?.imagemTexto?.imagem === 'favela_amazonia.png');
 expect(block.raw.imagemTexto.imagem).toBe('favela_amazonia.png');
 expect(block.tags).toEqual(['art direction', 'editorial design', 'storytelling']);
 const { titulo, texto } = block.raw.imagemTexto;
 const { body } = render(ImageText, { props: { src: '/imgs/favela_amazonia.png', title: titulo, text: texto, tags: block.tags } });
 expect(body).toContain(titulo);
 expect(body).toContain('https://infograficos.estadao.com.br/especiais/favela-amazonia/');
 expect(body.indexOf('image-block')).toBeLessThan(body.indexOf('<h3'));
 expect(body).toContain('What I did:');
 expect(body.indexOf('<footer')).toBeGreaterThan(body.indexOf('View the project'));
 expect(body).toContain('editorial design');
 const split = buildBlockObjects('{imagemTexto}\nimagem: a.png\n\ntitulo: A\ntexto: A: B\n{}'.split(/\n\n+/));
 expect(split).toHaveLength(1);
 expect(split[0].raw.imagemTexto.texto).toBe('A: B');
});


it('allows the Tapuiassauro spread to use the reversed desktop layout', () => {
 const blocks = buildBlockObjects(pages.archive.content.split(/\n\n+/));
 const conf = blocks.find((b) => b.raw?.imagemTexto?.imagem === 'tapuiassauro.png').raw.imagemTexto;
 expect(conf.lado).toBe('direita');
 expect(conf.classes).toBe('shadow-1');
 const { body } = render(ImageText, { props: { imageRight: conf.lado === 'direita', title: conf.titulo, text: conf.texto } });
 expect(body).toContain('image-right');
 expect(body).toContain('Tapuiassauro — Malofiej Gold Medal');
});
