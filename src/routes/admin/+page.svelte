<script>
import { isAuthenticated, archiePages } from '$lib/stores';
import ArchieML from 'archieml';
let password = '';
import { get } from 'svelte/store';
let content = '';
let page = 'index';
let error = '';
let showInMenu = true;
let menuLabel = '';
let buildResult = '';
let previewResult = '';
let previewLoading = false;

// LOGIN DESABILITADO TEMPORARIAMENTE
isAuthenticated.set(true);
// const ADMIN_PASSWORD = 'fabios'; // Troque para uma senha segura
// function login() {
//   if (password === ADMIN_PASSWORD) {
//     isAuthenticated.set(true);
//     error = '';
//   } else {
//     error = 'Senha incorreta';
//   }
// }

async function saveContent() {
  try {
    ArchieML.load(content); // Valida o formato
    archiePages.update(pages => {
      pages[page] = { content, showInMenu, menuLabel };
      return pages;
    });
    // Salva no JSON via API em dev
    if (import.meta.env.DEV) {
      const res = await fetch('/api/archiePages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(get(archiePages))
      });
      if (res.ok) {
        error = 'Conteúdo salvo no arquivo archiePages.json!';
        await archiePages.reload(); // <-- força reload do JSON atualizado
      } else {
        error = 'Erro ao salvar no arquivo: ' + (await res.text());
      }
    } else {
      error = 'Conteúdo salvo localmente!';
    }
  } catch (e) {
    error = 'Erro no formato ArchieML: ' + e;
  }
}

function loadContent() {
  const pages = get(archiePages);
  const data = pages[page];
  if (typeof data === 'object' && data !== null) {
    content = data.content || '';
    showInMenu = data.showInMenu !== false; // default true
    menuLabel = data.menuLabel || '';
  } else {
    content = data || '';
    showInMenu = true;
    menuLabel = '';
  }
}

function clearPage() {
  if (page && $archiePages[page]) {
    archiePages.update(pages => {
      delete pages[page];
      return pages;
    });
    content = '';
    error = `Página "${page}" removida.`;
    // Volta para main se deletar a atual
    page = 'index';
    loadContent();
  }
}
async function buildSite() {
  buildResult = 'Gerando build...';
  try {
    const res = await fetch('/api/build', { method: 'POST' });
    const text = await res.text();
    buildResult = res.ok ? 'Build finalizado com sucesso!' : `Erro: ${text}`;
  } catch (e) {
    buildResult = 'Erro ao chamar build: ' + e;
  }
}

async function previewSite() {
  previewResult = 'Iniciando preview do build...';
  try {
    const res = await fetch('/api/preview', { method: 'POST' });
    if (!res.ok) {
      previewResult = 'Erro ao iniciar preview: ' + (await res.text());
      return;
    }
    const data = await res.json();
    const url = data.url || 'http://localhost:4173';
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      previewResult = `Não foi possível abrir o preview automaticamente. Abra manualmente: ${url}`;
    } else {
      previewResult = 'Preview aberto em nova aba!';
    }
  } catch (e) {
    previewResult = 'Erro ao iniciar preview: ' + e;
  }
}
function exportJson() {
  const data = JSON.stringify(get(archiePages), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'archiePages.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
let newPageName = '';
// Carregar conteúdo ao trocar de página
$: if ($isAuthenticated) loadContent();
</script>

{#if $isAuthenticated}
  <h2>Editor ArchieML</h2>
  <label>Página:
    <select bind:value={page} on:change={() => {
      if (page === '__nova__') {
        newPageName = '';
        content = '';
        showInMenu = true;
      } else {
        loadContent();
      }
    }}>
      {#each Object.keys($archiePages) as p}
        <option value={p}>{p}</option>
      {/each}
      <option value="__nova__">Nova página...</option>
    </select>
    {#if page === '__nova__'}
      <input
        type="text"
        bind:value={newPageName}
        placeholder="Nome da nova página"
        on:keydown={(e) => {
          if (e.key === 'Enter' && newPageName && newPageName !== '__nova__') {
            page = newPageName;
            loadContent();
            e.target.blur();
          }
        }}
        on:blur={() => {
          if (newPageName && newPageName !== '__nova__') {
            page = newPageName;
            loadContent();
          }
        }}
        autofocus
      />
    {/if}
    <button
      on:click={() => {
        if (page === '__nova__' && newPageName && newPageName !== '__nova__') {
          page = newPageName;
          // Garante que a nova página já existe no store para edição
          archiePages.update(pages => {
            if (!pages[page]) {
              pages[page] = { content: '', showInMenu: true };
            }
            return pages;
          });
          loadContent();
        } else if (page !== '__nova__') {
          loadContent();
        }
      }}
      type="button"
    >Carregar</button>
  </label>
  <br>
  <textarea bind:value={content} rows="20" cols="60" placeholder="Digite o conteúdo ArchieML aqui..."></textarea>
  <br>
  <label style="display:inline-block;margin:0.5em 0;">
    <input type="checkbox" bind:checked={showInMenu}>
    Mostrar no menu
  </label>
  <br>
  <label style="display:inline-block;margin:0.5em 0;">
    Título do menu:
    <input type="text" bind:value={menuLabel} placeholder="Texto do menu (opcional)" style="margin-left:0.5em;">
  </label>
  <button on:click={saveContent} type="button">Salvar</button>
  <button on:click={clearPage} type="button" style="margin-left:1em;color:#b00">Limpar página</button>
  <p>{error}</p>
  <!-- Botões de build e preview removidos, use o terminal para essas ações -->
{:else}
  <!-- Login desabilitado temporariamente -->
  <!--
  <h2>Login Admin</h2>
  <input type="password" bind:value={password} placeholder="Senha" />
  <button on:click={login}>Entrar</button>
  <p>{error}</p>
  -->
{/if}

