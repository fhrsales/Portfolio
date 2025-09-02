<script>
import { isAuthenticated, archiePages } from '$lib/stores';
import { get } from 'svelte/store';
import { onMount, onDestroy } from 'svelte';
import ArchieML from 'archieml';

import Button from '$lib/components/ui/Button.svelte';
import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';

// let password = '';
let content = '';
let page = 'index';
let error = '';
let showInMenu = true;
let menuLabel = '';
// let buildResult = '';
// let previewResult = '';
let previewLoading = false;
let newPageName = '';
let newValue = '';
// Carregar conteúdo ao trocar de página
$: if ($isAuthenticated) loadContent();

// LOGIN DESABILITADO TEMPORARIAMENTE
//isAuthenticated.set(true);
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
            return true;
            } else {
                error = 'Erro ao salvar no arquivo: ' + (await res.text());
            return false;
            }
            } else {
                error = 'Conteúdo salvo localmente!';
            return true;
            }
        } catch (e) {
            error = 'Erro no formato ArchieML: ' + e;
    return false;
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

    // Modal-driven delete flow
    let showDeleteModal = false;
    let deleteTarget = null;

    // chamado pelo Button: apenas abre o modal e retorna false (para evitar alteração de label)
    function openDeleteModal() {
        if (!page || !$archiePages[page]) return false;
        deleteTarget = page;
        showDeleteModal = true;
        return false;
    }

    // cancela o modal
    function cancelDelete() {
        showDeleteModal = false;
        deleteTarget = null;
        return false;
    }

    // chamado quando o usuário confirma no modal
    function deletePage() {
        if (!deleteTarget || !$archiePages[deleteTarget]) {
            showDeleteModal = false;
            deleteTarget = null;
            return false;
        }
        archiePages.update(pages => {
            delete pages[deleteTarget];
            return pages;
        });
        content = '';
        error = `Página "${deleteTarget}" removida.`;
        // volta para nova página
        page = '__nova__';
        newPageName = '';
        showDeleteModal = false;
        deleteTarget = null;
        return true;
    }

// Esconder o footer do site enquanto esta rota/admin estiver montada
// Esconder o footer e o nav do site enquanto esta rota/admin estiver montada
let _archie_admin_prev_footer_display;
let _archie_admin_prev_nav_display;
onMount(() => {
    const f = document.querySelector('footer');
    if (f) {
        _archie_admin_prev_footer_display = f.style.display;
        f.style.display = 'none';
    }
    const n = document.querySelector('nav');
    if (n) {
        _archie_admin_prev_nav_display = n.style.display;
        n.style.display = 'none';
    }
});

onDestroy(() => {
    const f = document.querySelector('footer');
    if (f) {
        // restaura o estilo anterior (ou vazio para voltar ao padrão)
        f.style.display = _archie_admin_prev_footer_display || '';
    }
    const n = document.querySelector('nav');
    if (n) {
        n.style.display = _archie_admin_prev_nav_display || '';
    }
});
</script>

<!-- {#if $isAuthenticated} -->
<main>
    <!-- <header>
        <div>fabIA editor</div>
        <a style='position: relative; top: 5px' href='/' class='button'>Sair</a>
    </header> -->
    <div class="row">
        <div class="column" style="flex:0 0 200px;">
            <div>FAB.io ou Fabbric</div>
            <label>
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
            </label>
            <div>
                <label>
                    <input type="checkbox" bind:checked={showInMenu}> Título do menu
                </label>
                <input type="text" bind:value={menuLabel} placeholder='Título (opcional)' style="display:block;margin-top:-1.15rem; width:100%">
            </div>
        </div>
        <!--  -->
        <div class="column" style="flex:1; padding-left:1rem;">
            <textarea class='text' bind:value={content} rows="20" cols="60" placeholder="Digite o conteúdo aqui..." style="width:100%"/>
            <div class='saveContent-container'>
                <!-- criar um botao que muda o texto ao concluir a acao -->
                <Button classe='button-outline' estilo='width: 150px' handleClick={saveContent} value='Salvar' newValue='Salvo!'/>
                {#if page !== '__nova__'}
                    <Button classe='button-outline' handleClick={openDeleteModal} value='Apagar página'/>
                {/if}
                <!-- <span style="color:#b00;margin-left:0.5rem;">{error}</span> -->
                <a href='/' class='button'>Sair</a>
            </div>
        </div>
    </div>
</main>

<!-- Confirm modal component -->
<ConfirmModal
    open={showDeleteModal}
    title="Confirmar exclusão"
    message={`Tem certeza que deseja apagar a página "${deleteTarget}"? Esta ação não pode ser desfeita.`}
    on:cancel={cancelDelete}
    on:confirm={deletePage}
    confirmLabel="Apagar"
    cancelLabel="Cancelar"
/>
<!-- {:else} -->
    <!-- Login desabilitado temporariamente -->
    <!--
    <h2>Login Admin</h2>
    <input type="password" bind:value={password} placeholder="Senha" />
    <button on:click={login}>Entrar</button>
    <p>{error}</p>
    -->
<!-- {/if} -->


<style>
    main {
        width: 100%;
        max-width: 960px;
        margin: 30px auto 0 auto;
        justify-content: flex-start;
    }

    header {
        position: fixed;
        top: 0;
        z-index: 300;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border-bottom: 1px solid #eee;
        width: 100%;
        max-width: inherit;
        height: 53px;
    }

    .text {
        height: 80vh;
        overflow-y: auto;
        font-family: monospace;
        word-wrap: break-word;
        overflow-wrap: break-word;
        font-size: 12px;
        line-height: 1.6;
        color: var(--color-dark);
    }

    .saveContent-container {
        display: flex;
        gap: calc(var(--grid) * 1);
        align-items: center;
        justify-content: flex-end;
    }
</style>
