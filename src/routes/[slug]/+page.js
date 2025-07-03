import archiePagesData from '$lib/archiePages.json';

export const prerender = true;

/**
 * Informa ao SvelteKit quais rotas dinâmicas devem ser geradas no build estático
 */
export function entries() {
  return Object.keys(archiePagesData).map(slug => ({ slug }));
}
