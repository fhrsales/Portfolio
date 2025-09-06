import { archieContent } from '$lib/stores';
import ArchieML from 'archieml';
import { derived } from 'svelte/store';

export const getParsedArchieML = derived(archieContent, ($archieContent) => {
	try {
		return ArchieML.load($archieContent);
	} catch {
		return { erro: 'Conteúdo inválido' };
	}
});
