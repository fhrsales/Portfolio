
import { writable } from 'svelte/store';


export const isAuthenticated = writable(false);

// Store ArchieML pages from static JSON (SSR friendly)



async function fetchArchiePages() {
  if (typeof window === 'undefined') {
    // SSR: não faz fetch, retorna vazio
    return {};
  }
  const res = await fetch('/archiePages.json?_=' + Date.now());
  if (!res.ok) return {};
  return await res.json();
}


function createArchiePagesStore() {
  const { subscribe, set, update } = writable({});

  // Sempre busca do arquivo ao iniciar (ignora localStorage como fonte principal)
  if (typeof window !== 'undefined') {
    fetchArchiePages().then(data => {
      set(data);
      localStorage.setItem('archiePages', JSON.stringify(data)); // cache opcional
    });
  }

  return {
    subscribe,
    set: (value) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('archiePages', JSON.stringify(value));
      }
      set(value);
    },
    update: (fn) => {
      update(current => {
        const updated = fn(current);
        if (typeof window !== 'undefined') {
          localStorage.setItem('archiePages', JSON.stringify(updated));
        }
        return updated;
      });
    },
    reload: async () => {
      if (typeof window !== 'undefined') {
        const data = await fetchArchiePages();
        set(data);
        localStorage.setItem('archiePages', JSON.stringify(data));
      }
    }
  };
}

export const archiePages = createArchiePagesStore();
