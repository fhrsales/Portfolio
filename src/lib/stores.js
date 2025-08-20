
import { writable } from 'svelte/store';


export const isAuthenticated = writable(false);

// Store ArchieML pages from static JSON (SSR friendly)



import { base } from '$app/paths';
async function fetchArchiePages() {
  if (typeof window === 'undefined') {
    // SSR: não faz fetch, retorna vazio
    return {};
  }
  // Busca sempre do static, ignorando base
  const res = await fetch('/archiePages.json?_=' + Date.now());
  if (!res.ok) return {};
  return await res.json();
}


function createArchiePagesStore() {
  const { subscribe, set, update } = writable({});

  // Sempre busca do arquivo ao iniciar, sem cache localStorage
  if (typeof window !== 'undefined') {
    fetchArchiePages().then(data => {
      set(data);
    });
  }

  return {
    subscribe,
    set: (value) => {
      set(value);
    },
    update: (fn) => {
      update(current => fn(current));
    },
    reload: async () => {
      if (typeof window !== 'undefined') {
        const data = await fetchArchiePages();
        set(data);
      }
    }
  };
}

export const archiePages = createArchiePagesStore();
