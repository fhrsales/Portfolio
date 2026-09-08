import { expect, test } from 'vitest';
import pages from './archiePages.json';
import pt from './pt.json';
import { translateContent } from './i18n.js';

test('Portuguese preserves media, notation, links and English source', () => {
  const markup = text => text.match(/\{[^\n]*\}|(?:href|src)=['"][^'"]+['"]|^[ \t]*(?:nome|video(?:-mobile|-desktop)?|pasta|imagem|tags|tamanho|altura|top|fixar):[^\n]*/gm);
  for (const page of Object.values(pages)) {
    const en = page.content || '';
    const translated = translateContent(en, 'pt');
    expect(translateContent(en, 'en')).toBe(en);
    expect(markup(translated)).toEqual(markup(en));
    for (const line of en.split('\n')) {
      if (pt[line.trim()]) expect(translated).toContain(pt[line.trim()]);
    }
  }
  expect(translateContent(pages.index.content, 'pt')).toContain('Olá, sou');
  expect(translateContent(pages.archive.content, 'pt')).toContain('h1: Acervo');
});
