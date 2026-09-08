import { writable } from 'svelte/store';
import portuguese from './pt.json';

export const language = writable('en');

// Translate prose only; assets, editor notation, ordering and filter IDs stay canonical.
export function translateContent(content, lang) {
  if (lang !== 'pt') return content;
  return content.split('\n').map(line => {
    const text = line.trim();
    return portuguese[text] ? line.replace(text, portuguese[text]) : line;
  }).join('\n');
}

const labels = {
  works: 'Trabalhos', archive: 'Acervo', about: 'Sobre', all: 'Todos',
  'what i did:': 'Minha participação:', 'art direction': 'Direção de arte',
  code: 'Código', 'data visualization': 'Visualização de dados',
  'editorial design': 'Design editorial', 'information design': 'Design da informação',
  'interaction design': 'Design de interação', motion: 'Animação', storytelling: 'Narrativas',
  'product design': 'Design de produto', 'systems thinking': 'Pensamento sistêmico',
  'information architecture': 'Arquitetura da informação', 'product strategy': 'Estratégia de produto',
  'data analysis': 'Análise de dados', 'project management': 'Gestão de projetos',
  'business strategy': 'Estratégia de negócios', graphics: 'Infografia'
};
export function translateLabel(text, lang) {
  return lang === 'pt' ? labels[String(text).toLowerCase()] || text : text;
}
