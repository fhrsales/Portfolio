<script>
	import { archiePages } from '$lib/stores';
	import { get } from 'svelte/store';
	import ArchieML from 'archieml';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';
	import Toolbar from '$lib/components/ui/Toolbar.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';

	// let password = '';
	let content = '';
	let page = 'index';
	let error = '';
	let showInMenu = true;
	let menuLabel = '';
	// let buildResult = '';
	// let previewResult = '';
	let newPageName = '';
	// visual notice removed by request
	let _fadeIn = false;
	// formatting helpers for textarea
	let editorEl;
	function makeBold() {
		if (editorEl) {
			editorEl.focus();
			const start = editorEl.selectionStart ?? 0;
			const end = editorEl.selectionEnd ?? 0;
			const before = content.slice(0, start);
			const selected = content.slice(start, end);
			const after = content.slice(end);
			const inserted = `<strong>${selected || ''}</strong>`;
			content = before + inserted + after;
			const pos = (before + inserted).length;
			requestAnimationFrame(() => editorEl.setSelectionRange(pos, pos));
		}
	}
	function makeItalic() {
		if (editorEl) {
			editorEl.focus();
			const start = editorEl.selectionStart ?? 0;
			const end = editorEl.selectionEnd ?? 0;
			const before = content.slice(0, start);
			const selected = content.slice(start, end);
			const after = content.slice(end);
			const inserted = `<em>${selected || ''}</em>`;
			content = before + inserted + after;
			const pos = (before + inserted).length;
			requestAnimationFrame(() => editorEl.setSelectionRange(pos, pos));
		}
	}

	function isSafeUrl(u) {
		try {
			const s = String(u || '').trim();
			if (!s) return false;
			// allow http, https, mailto, tel and relative URLs
			if (/^(https?:|mailto:|tel:)/i.test(s)) return true;
			if (s.startsWith('/') || s.startsWith('./') || s.startsWith('../') || s.startsWith('#'))
				return true;
			return false;
		} catch {
			return false;
		}
	}

	function makeLink() {
		const url = window.prompt(
			'URL do link (http(s)://, mailto:, tel:, ou caminho relativo):',
			'https://'
		);
		if (!isSafeUrl(url)) return;
		if (editorEl) {
			editorEl.focus();
			const start = editorEl.selectionStart ?? 0;
			const end = editorEl.selectionEnd ?? 0;
			const before = content.slice(0, start);
			const selected = content.slice(start, end) || 'link';
			const after = content.slice(end);
			const inserted = `<a href="${url}" target="_blank">${selected}</a>`;
			content = before + inserted + after;
			const pos = (before + inserted).length;
			requestAnimationFrame(() => editorEl.setSelectionRange(pos, pos));
		}
	}

	function clearFormatting() {
		if (editorEl) {
			editorEl.focus();
			const start = editorEl.selectionStart ?? 0;
			const end = editorEl.selectionEnd ?? 0;
			if (start === end) return;
			const before = content.slice(0, start);
			const selected = content.slice(start, end);
			const after = content.slice(end);
			const cleaned = selected
				.replace(/<\/?(?:strong|em|b|i)\s*>/gi, '')
				.replace(/<a\b[^>]*>/gi, '')
				.replace(/<\/a>/gi, '');
			content = before + cleaned + after;
			const pos = before.length + cleaned.length;
			requestAnimationFrame(() => editorEl.setSelectionRange(pos, pos));
		}
	}
	onMount(() => {
		// next frame to avoid flash
		if (typeof requestAnimationFrame === 'function') {
			requestAnimationFrame(() => (_fadeIn = true));
		} else {
			setTimeout(() => (_fadeIn = true), 0);
		}
	});
	// Inicializa conteúdo quando store for carregado (uma vez)
	let _initialized = false;
	$: if (!_initialized && typeof $archiePages === 'object' && Object.keys($archiePages).length) {
		_initialized = true;
		if (!page) page = 'index';
		loadContent();
	}

	// Log error messages in dev to mark it as used
	$: if (import.meta.env.DEV && error) console.debug('[admin] ', error);

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
			archiePages.update((pages) => {
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
		archiePages.update((pages) => {
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

	// Layout já esconde Menu/Footer via +layout.svelte quando em /admin
	// Mantemos imports de lifecycle se necessário futuramente
</script>

<!-- {#if $isAuthenticated} -->
<main class:loaded={_fadeIn}>
	<!-- <header>
        <div>fabIA editor</div>
        <a style='position: relative; top: 5px' href='/' class='button'>Sair</a>
    </header> -->
	<div class="row">
		<div class="column" style="flex:0 0 200px;">
			<div class="brand">
				<img src={resolve('/imgs/fabio_io.svg')} alt="FAB.io" width="120" height="24" />
			</div>
			<label>
				<select
					bind:value={page}
					on:change={() => {
						if (page === '__nova__') {
							newPageName = '';
							content = '';
							showInMenu = true;
						} else {
							loadContent();
						}
					}}
				>
					{#each Object.keys($archiePages) as p (p)}
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
								// Define a nova página e garante que exista no store para aparecer no select
								page = newPageName;
								archiePages.update((pages) => {
									if (!pages[page]) {
										pages[page] = { content: '', showInMenu: true, menuLabel: '' };
									}
									return pages;
								});
								loadContent();
								e.target.blur();
							}
						}}
						on:blur={() => {
							if (newPageName && newPageName !== '__nova__') {
								// Define a nova página e garante que exista no store para aparecer no select
								page = newPageName;
								archiePages.update((pages) => {
									if (!pages[page]) {
										pages[page] = { content: '', showInMenu: true, menuLabel: '' };
									}
									return pages;
								});
								loadContent();
							}
						}}
					/>
				{/if}
			</label>
			<div>
				<label>
					<input type="checkbox" bind:checked={showInMenu} /> Título do menu
				</label>
				<input type="text" bind:value={menuLabel} placeholder="Título (opcional)" />
			</div>
		</div>
		<!--  -->
		<div class="column" style="flex:1; padding-left:1rem;">
			<textarea
				class="text"
				bind:this={editorEl}
				bind:value={content}
				rows="20"
				cols="60"
				placeholder="Digite o conteúdo aqui..."
				style="width:100%"
				on:keydown={(e) => {
					const k = (e.key || '').toLowerCase();
					const mod = e.ctrlKey || e.metaKey;
					if (mod && !e.altKey && !e.shiftKey) {
						if (k === 'b') {
							e.preventDefault();
							makeBold();
						} else if (k === 'i') {
							e.preventDefault();
							makeItalic();
						} else if (k === 'k') {
							e.preventDefault();
							makeLink();
						} else if (k === '0') {
							e.preventDefault();
							clearFormatting();
						}
					}
				}}
			></textarea>
			<div class="saveContent-container">
				<Toolbar align="end" ariaLabel="Ferramentas do editor">
					<IconButton title="Negrito (Ctrl/Cmd+B)" ariaLabel="Negrito" on:click={makeBold}
						>B</IconButton
					>
					<IconButton title="Itálico (Ctrl/Cmd+I)" ariaLabel="Itálico" on:click={makeItalic}
						><em>I</em></IconButton
					>
					<IconButton title="Link (Ctrl/Cmd+K)" ariaLabel="Link" on:click={makeLink}>
						<!-- simple chain icon -->
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11 4" />
							<path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 20" />
						</svg>
					</IconButton>
					<IconButton
						title="Remover formatação (Ctrl/Cmd+0)"
						ariaLabel="Limpar formatação"
						on:click={clearFormatting}>⌫</IconButton
					>
				</Toolbar>
				<Button variant="primary" handleClick={saveContent} value="Salvar" newValue="Salvo!" />
				{#if page !== '__nova__'}
					<Button variant="primary" handleClick={openDeleteModal} value="Apagar página" />
				{/if}
				<!-- <span style="color:#b00;margin-left:0.5rem;">{error}</span> -->
				<a href={resolve('/')} class="button">Sair</a>
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
		opacity: 0;
		will-change: opacity;
	}
	main.loaded {
		opacity: 1;
		transition: opacity 420ms ease;
	}

	/* header styles removidos (markup não utilizado) */

	.text {
		height: 80vh;
		overflow-y: auto;
		font-family: monospace;
		word-wrap: break-word;
		overflow-wrap: break-word;
		font-size: 12px;
		line-height: 1.6;
		color: var(--color-dark);
		margin: 0 0 1rem 0;
		border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
		border-radius: 10px;
		padding: calc(var(--grid) * 1.2) calc(var(--grid) * 1.5);
		background: #fff;
	}

	/* toolbar buttons now live inside .saveContent-container as Button variant='link' */

	/* notice removed */

	.saveContent-container {
		display: flex;
		gap: calc(var(--grid) * 1);
		align-items: center;
		justify-content: flex-end;
	}

	.brand {
		margin: 0 0 2rem 0;
	}
	.brand img {
		display: block;
		width: 100%;
		height: auto;
	}

	/* Make Sair link visually match primary buttons */
	:global(.saveContent-container a.button) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--color-primary);
		color: #fff;
		text-decoration: none;
		padding: 0.6rem 1rem;
		border-radius: 999px;
		font-weight: 600;
		box-shadow: var(--shadow-2);
		font-size: calc(var(--grid) * 1.18);
		font-family: var(--font-primary);
		text-transform: uppercase;
		border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
		transition:
			background 160ms ease,
			color 160ms ease,
			transform 120ms ease;
	}
	:global(.saveContent-container a.button:hover) {
		filter: brightness(1.05);
	}
	.row {
		display: flex;
		align-items: flex-start;
		gap: calc(var(--grid) * 2);
		width: 100%;
	}
	.column {
		display: block;
	}
	@media (max-width: 700px) {
		.row {
			flex-direction: column;
		}
		.column[style] {
			/* ensure full width on small screens even if inline flex-basis is set */
			flex: 1 1 auto !important;
		}
	}

	/* Form styles (clean, material-like, using project variables) */
	label {
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 1.5);
		color: color-mix(in srgb, var(--color-dark) 80%, transparent);
		display: block;
		margin: 0 0 calc(var(--grid) * 0.75) 0;
	}

	input[type='text'],
	select,
	textarea {
		width: 100%;
		font-family: var(--font-primary);
		font-size: calc(var(--grid) * 1.6);
		color: var(--color-dark);
		background: #fff;
		border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
		border-radius: 10px;
		padding: calc(var(--grid) * 1.2) calc(var(--grid) * 1.5);
		outline: none;
		transition:
			border-color 160ms ease,
			box-shadow 160ms ease,
			background 160ms ease;
	}

	/* Better spacing for select arrow */
	select {
		padding-right: calc(var(--grid) * 4);
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>\
<polyline points='6 9 12 15 18 9'/></svg>");
		background-repeat: no-repeat;
		background-position: right calc(var(--grid) * 1) center;
		background-size: 12px 12px;
	}

	input[type='text']:focus,
	select:focus,
	textarea:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 22%, transparent);
		background: #fff;
	}

	input[type='text']::placeholder,
	textarea::placeholder {
		color: color-mix(in srgb, var(--color-dark) 45%, transparent);
	}

	input[type='text']:disabled,
	select:disabled,
	textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: color-mix(in srgb, #fff 90%, var(--color-light));
	}

	textarea {
		min-height: 240px;
		resize: vertical;
		line-height: 1.5;
	}

	input[type='checkbox'] {
		accent-color: var(--color-primary);
		transform: translateY(2px);
		margin-right: calc(var(--grid) * 0.75);
	}
</style>
