import { writable } from 'svelte/store';
import { base } from '$app/paths';

export const isAuthenticated = writable(false);

async function fetchArchiePages() {
	if (typeof window === 'undefined') {
		// SSR: não faz fetch, retorna vazio
		return {};
	}
	// Busca usando o base path para funcionar em produção (GitHub Pages)
	const url = `${base}/archiePages.json?_=${Date.now()}`;
	//console.log('Fetching ArchiePages from:', url);
	const res = await fetch(url);
	if (!res.ok) {
		//console.error('Failed to fetch ArchiePages:', res.status, res.statusText);
		return {};
	}
	const data = await res.json();
	//console.log('ArchiePages loaded:', Object.keys(data));
	return data;
}

function createArchiePagesStore() {
	const { subscribe, set, update } = writable({});

	// Sempre busca do arquivo ao iniciar, sem cache localStorage
	if (typeof window !== 'undefined') {
		//console.log('Initial fetch of ArchiePages...');
		fetchArchiePages()
			.then((data) => {
				//console.log('Initial ArchiePages loaded:', Object.keys(data));
				set(data);
			})
			.catch(() => {
				//console.error('Failed to load initial ArchiePages');
			});
	}

	return {
		subscribe,
		set: (value) => {
			//console.log('Setting ArchiePages:', Object.keys(value));
			set(value);
		},
		update: (fn) => {
			update((current) => fn(current));
		},
		reload: async () => {
			if (typeof window !== 'undefined') {
				//console.log('Reloading ArchiePages...');
				try {
					const data = await fetchArchiePages();
					//console.log('Reloaded ArchiePages:', Object.keys(data));
					set(data);
					return data;
				} catch (error) {
					console.error('Failed to reload ArchiePages:', error);
					throw error;
				}
			}
		}
	};
}

export const archiePages = createArchiePagesStore();
