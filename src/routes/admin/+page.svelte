<script>
	import { archiePages } from '$lib/stores';
	import { get } from 'svelte/store';
	import ArchieML from 'archieml';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import CodeEditor from '$lib/components/editor/CodeEditor.svelte';
	import BlockInspector from '$lib/components/editor/BlockInspector.svelte';
	import PagePreview from '$lib/components/editor/PagePreview.svelte';
	import {
		INSERTABLE,
		lint,
		blockAt,
		setField,
		removeField
	} from '$lib/components/editor/editorSchema.js';
	import { getToken, setToken, fetchPages, publishPages } from '$lib/githubPublish';

	let content = '';
	let page = 'index';
	let error = '';
	let originalPage;
	let showInMenu = true;
	let menuLabel = '';
	let newPageName = '';
	let creating = false;
	let _fadeIn = false;
	let textarea;
	let cursorLine = 0;
	// small screens show one of these at a time
	let tab = 'write';
	// Desktop: which side panels are open. Remembered between visits.
	let panels = { side: true, block: true, preview: true };
	const PANELS = [
		['side', 'Páginas'],
		['block', 'Bloco'],
		['preview', 'Prévia']
	];
	function togglePanel(id) {
		panels = { ...panels, [id]: !panels[id] };
		try {
			localStorage.setItem('editorPanels', JSON.stringify(panels));
		} catch {
			/* storage unavailable */
		}
	}
	$: colsWide = [
		panels.side && '232px',
		'minmax(0, 1fr)',
		panels.block && '288px',
		panels.preview && 'minmax(320px, 400px)'
	]
		.filter(Boolean)
		.join(' ');
	$: colsMid = [
		panels.side && '212px',
		'minmax(0, 1fr)',
		(panels.block || panels.preview) && 'minmax(300px, 360px)'
	]
		.filter(Boolean)
		.join(' ');

	// Load the first page once the store has content. Kept above the statements that read
	// the loaded values: they run once per update, in source order.
	let _initialized = false;
	$: if (!_initialized && typeof $archiePages === 'object' && Object.keys($archiePages).length) {
		_initialized = true;
		if (!page) page = 'index';
		loadContent();
	}

	$: issues = lint(content);
	$: block = blockAt(content, cursorLine);
	$: dirty =
		!originalPage ||
		content !== (originalPage.content || '') ||
		showInMenu !== (originalPage.showInMenu !== false) ||
		menuLabel !== (originalPage.menuLabel || '');

	// Outside the dev server the editor reads from and publishes to GitHub.
	const remote = !import.meta.env.DEV;
	let githubToken = '';
	let tokenInput = '';
	let remoteSha = '';

	async function connectGithub(token) {
		try {
			error = 'Carregando o conteúdo do GitHub…';
			const result = await fetchPages(token);
			archiePages.set(result.pages);
			remoteSha = result.sha;
			githubToken = token;
			setToken(token);
			tokenInput = '';
			if (!result.pages[page]) page = Object.keys(result.pages)[0] || 'index';
			loadContent();
			error = 'Conectado ao GitHub.';
		} catch (e) {
			error = e.message;
		}
		return false;
	}

	function disconnectGithub() {
		setToken('');
		githubToken = '';
		remoteSha = '';
		error = 'Token removido deste aparelho.';
		return false;
	}

	function wrapSelection(open, close, fallback = '') {
		if (!textarea) return;
		textarea.focus();
		const start = textarea.selectionStart ?? 0;
		const end = textarea.selectionEnd ?? 0;
		const inserted = `${open}${content.slice(start, end) || fallback}${close}`;
		content = content.slice(0, start) + inserted + content.slice(end);
		const pos = start + inserted.length;
		requestAnimationFrame(() => textarea.setSelectionRange(pos, pos));
	}
	const makeBold = () => wrapSelection('<strong>', '</strong>');
	const makeItalic = () => wrapSelection('<em>', '</em>');

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
		if (textarea) {
			textarea.focus();
			const start = textarea.selectionStart ?? 0;
			const end = textarea.selectionEnd ?? 0;
			const before = content.slice(0, start);
			const selected = content.slice(start, end) || 'link';
			const after = content.slice(end);
			const inserted = `<a href="${url}" target="_blank">${selected}</a>`;
			content = before + inserted + after;
			const pos = (before + inserted).length;
			requestAnimationFrame(() => textarea.setSelectionRange(pos, pos));
		}
	}

	function clearFormatting() {
		if (textarea) {
			textarea.focus();
			const start = textarea.selectionStart ?? 0;
			const end = textarea.selectionEnd ?? 0;
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
			requestAnimationFrame(() => textarea.setSelectionRange(pos, pos));
		}
	}

	function insertSnippet(snippet) {
		const pos = textarea?.selectionEnd ?? content.length;
		const before = content.slice(0, pos).replace(/\s*$/, '');
		const after = content.slice(pos).replace(/^\s*/, '');
		const start = before ? before.length + 2 : 0;
		content = (before ? before + '\n\n' : '') + snippet + (after ? '\n\n' + after : '\n');
		tab = 'write';
		cursorLine = content.slice(0, start).split('\n').length;
		requestAnimationFrame(() => {
			const caret = start + snippet.split('\n')[0].length;
			textarea?.focus();
			textarea?.setSelectionRange(caret, caret);
		});
	}

	function goToLine(line) {
		const lines = content.split('\n');
		const start = lines.slice(0, line).join('\n').length + (line ? 1 : 0);
		tab = 'write';
		cursorLine = line;
		requestAnimationFrame(() => {
			textarea?.focus();
			textarea?.setSelectionRange(start, start + lines[line].length);
			if (textarea) textarea.scrollTop = Math.max(0, line * 24 - 96);
		});
	}

	function onEditorKeydown(e) {
		const k = (e.key || '').toLowerCase();
		if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
		const action = { b: makeBold, i: makeItalic, k: makeLink, 0: clearFormatting, s: saveContent }[
			k
		];
		if (!action) return;
		e.preventDefault();
		action();
	}

	function selectPage(name) {
		page = name;
		creating = false;
		loadContent();
	}

	function createPage() {
		const name = newPageName.trim();
		if (!/^[a-z0-9][a-z0-9_-]*$/i.test(name)) {
			error = 'Nome de página: use só letras, números, hífen e sublinhado.';
			return;
		}
		archiePages.update((pages) => {
			if (!pages[name]) pages[name] = { content: '', showInMenu: true, menuLabel: '' };
			return pages;
		});
		page = name;
		newPageName = '';
		creating = false;
		loadContent();
		originalPage = undefined;
	}

	onMount(() => {
		try {
			panels = { ...panels, ...JSON.parse(localStorage.getItem('editorPanels') || '{}') };
		} catch {
			/* storage unavailable */
		}
		try {
			const saved = JSON.parse(sessionStorage.getItem('editorSaved') || 'null');
			sessionStorage.removeItem('editorSaved');
			if (saved && Date.now() - saved.at < 10000 && $archiePages[saved.page]) {
				page = saved.page;
				loadContent();
				error = 'Salvo no arquivo do projeto.';
			}
		} catch {
			/* storage unavailable */
		}
		if (remote && getToken()) connectGithub(getToken());
		// a timer, not a frame callback: frames do not run while the tab is in the background
		setTimeout(() => (_fadeIn = true), 0);
	});

	async function saveContent() {
		try {
			ArchieML.load(content); // Valida o formato
			const data = { content, showInMenu, menuLabel };
			if (import.meta.env.DEV) {
				const response = await fetch('/__editor/save', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ page, data, original: originalPage })
				});
				const result = await response.json();
				if (!response.ok) throw new Error(result.error);
				originalPage = result.data;
				try {
					sessionStorage.setItem('editorSaved', JSON.stringify({ page, at: Date.now() }));
				} catch {
					/* storage unavailable */
				}
			}
			archiePages.update((pages) => ({ ...pages, [page]: { ...pages[page], ...data } }));
			if (import.meta.env.DEV) {
				error = 'Salvo no arquivo do projeto.';
				return true;
			}
			if (!githubToken) throw new Error('conecte o editor ao GitHub antes de publicar.');
			error = 'Publicando…';
			remoteSha = await publishPages(
				githubToken,
				get(archiePages),
				remoteSha,
				`editor: update ${page}`
			);
			originalPage = structuredClone(get(archiePages)[page]);
			error = 'Publicado no GitHub. O site atualiza em alguns minutos.';
			return true;
		} catch (e) {
			error = 'Não foi possível salvar: ' + e.message;
			return false;
		}
	}

	// Dev server only: commit the whole project and push it, which starts the deploy.
	let publishing = false;
	async function gitPublish(body) {
		const response = await fetch('/__editor/publish', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error);
		return result.data;
	}
	async function publishSite() {
		if (publishing) return;
		if (dirty && !(await saveContent())) return;
		publishing = true;
		try {
			const pending = await gitPublish({ dryRun: true });
			if (!pending.files.length && !pending.ahead) {
				error = 'Nada novo para publicar.';
				return;
			}
			const list = pending.files.slice(0, 12).join('\n');
			const more = pending.files.length > 12 ? `\n… e mais ${pending.files.length - 12}` : '';
			const message = window.prompt(
				`Publicar ${pending.files.length} arquivo(s) no GitHub?\n\n${list}${more}\n\nDescreva a mudança:`,
				`editor: update ${page}`
			);
			if (message === null) return;
			error = 'Publicando…';
			const done = await gitPublish({ message });
			error = `Publicado (${done.commit}). O site atualiza em alguns minutos.`;
		} catch (e) {
			error = 'Não foi possível publicar: ' + e.message;
		} finally {
			publishing = false;
		}
	}

	function loadContent() {
		const pages = get(archiePages);
		const data = pages[page];
		originalPage = data === undefined ? undefined : structuredClone(data);
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
		page = Object.keys(get(archiePages))[0] || 'index';
		loadContent();
		showDeleteModal = false;
		deleteTarget = null;
		return true;
	}
</script>

<div class="editor" class:loaded={_fadeIn}>
	<header class="bar">
		<a class="name" href={resolve('/')} aria-label="Fabio Sales — voltar ao site">
			<img src={resolve('/imgs/fabio_sales.svg')} alt="" />
		</a>
		<span class="tag">Editor</span>
		<div class="panel-toggles" role="group" aria-label="Painéis">
			{#each PANELS as [id, label] (id)}
				<button
					type="button"
					aria-pressed={panels[id]}
					title={panels[id] ? `Recolher ${label}` : `Abrir ${label}`}
					on:click={() => togglePanel(id)}>{label}</button
				>
			{/each}
		</div>
		<span class="spacer"></span>
		<span class="status" role="status">
			<span class="dot" class:dirty></span>
			{error || (dirty ? 'Alterações não salvas' : 'Tudo salvo')}
		</span>
		<a
			class="ghost"
			href={resolve(page === 'index' ? '/' : `/${page}`)}
			target="_blank"
			rel="noopener">Ver página</a
		>
		<Button
			variant="primary"
			handleClick={saveContent}
			value={remote ? 'Publicar' : 'Salvar'}
			newValue={remote ? 'Publicado!' : 'Salvo!'}
		/>
		{#if !remote}
			<button class="ghost" type="button" on:click={publishSite} disabled={publishing}>
				{publishing ? 'Publicando…' : 'Publicar no GitHub'}
			</button>
		{/if}
	</header>

	<nav class="tabs" aria-label="Áreas do editor">
		{#each [['write', 'Escrever'], ['block', 'Bloco'], ['preview', 'Prévia'], ['pages', 'Páginas']] as [id, label] (id)}
			<button type="button" aria-pressed={tab === id} on:click={() => (tab = id)}>{label}</button>
		{/each}
	</nav>

	<div
		class="body"
		class:no-side={!panels.side}
		class:no-block={!panels.block}
		class:no-preview={!panels.preview}
		data-tab={tab}
		style={`--cols-wide:${colsWide}; --cols-mid:${colsMid}`}
	>
		<aside class="side">
			<h2>Páginas</h2>
			<ul class="pages">
				{#each Object.keys($archiePages) as p (p)}
					<li>
						<button
							type="button"
							class="page"
							aria-current={p === page ? 'page' : undefined}
							on:click={() => selectPage(p)}
						>
							<span>{p}</span>
							{#if $archiePages[p]?.showInMenu !== false}<small>no menu</small>{/if}
						</button>
					</li>
				{/each}
			</ul>
			{#if creating}
				<form class="new-page" on:submit|preventDefault={createPage}>
					<label for="new-page">Nome da nova página</label>
					<input id="new-page" type="text" bind:value={newPageName} placeholder="ex.: novo-caso" />
					<Button variant="primary" type="submit" value="Criar" />
				</form>
			{:else}
				<button type="button" class="add-page" on:click={() => (creating = true)}
					>+ Nova página</button
				>
			{/if}

			{#if !remote}
				<h2>Acervo</h2>
				<a
					class="tool-link"
					href={resolve('/imgs/samples/INDEX.html')}
					target="_blank"
					rel="noopener"
				>
					Escolher páginas das galerias
				</a>
			{/if}

			<h2>Esta página</h2>
			<label class="check"
				><input type="checkbox" bind:checked={showInMenu} /> Mostrar no menu</label
			>
			<div class="field">
				<label for="menu-label">Título no menu</label>
				<input id="menu-label" type="text" bind:value={menuLabel} placeholder="Opcional" />
			</div>

			{#if remote}
				<h2>GitHub</h2>
				<div class="github">
					{#if githubToken}
						<p>Conectado neste aparelho.</p>
						<Button variant="link" handleClick={disconnectGithub} value="Remover token" />
					{:else}
						<div class="field">
							<label for="github-token">Token do GitHub</label>
							<input
								id="github-token"
								type="password"
								autocomplete="off"
								bind:value={tokenInput}
								placeholder="github_pat_…"
							/>
						</div>
						<Button
							variant="primary"
							handleClick={() => connectGithub(tokenInput.trim())}
							value="Conectar"
						/>
						<p>
							Fica guardado só neste aparelho. Use um token restrito a este repositório, com
							permissão de conteúdo.
						</p>
					{/if}
				</div>
			{/if}

			<button type="button" class="delete" on:click={openDeleteModal}>Apagar esta página</button>
		</aside>

		<section class="write">
			<div class="tools">
				<IconButton size="lg" title="Negrito (Ctrl/Cmd+B)" ariaLabel="Negrito" on:click={makeBold}
					><strong>B</strong></IconButton
				>
				<IconButton size="lg" title="Itálico (Ctrl/Cmd+I)" ariaLabel="Itálico" on:click={makeItalic}
					><em>I</em></IconButton
				>
				<IconButton size="lg" title="Link (Ctrl/Cmd+K)" ariaLabel="Link" on:click={makeLink}>
					<svg
						width="18"
						height="18"
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
					size="lg"
					title="Remover formatação (Ctrl/Cmd+0)"
					ariaLabel="Limpar formatação"
					on:click={clearFormatting}
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M6 5h12M12 5v14M9 19h6M4 4l16 16" />
					</svg>
				</IconButton>
				<span class="sep" aria-hidden="true"></span>
				<span class="tools-label">Inserir</span>
				{#each INSERTABLE as item (item.label)}
					<button type="button" class="chip" on:click={() => insertSnippet(item.snippet)}
						>{item.label}</button
					>
				{/each}
			</div>

			<CodeEditor
				bind:value={content}
				bind:textarea
				on:cursor={(e) => (cursorLine = e.detail.line)}
				on:keydown={onEditorKeydown}
			/>

			{#if issues.length}
				<ul class="issues" aria-label="Avisos do conteúdo">
					{#each issues as issue (issue.line + issue.message)}
						<li>
							<button type="button" on:click={() => goToLine(issue.line)}
								><b>Linha {issue.line + 1}</b> {issue.message}</button
							>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="ok">Nenhum aviso no conteúdo.</p>
			{/if}
		</section>

		<aside class="block">
			<BlockInspector
				{block}
				on:set={(e) => (content = setField(content, block, e.detail.key, e.detail.value))}
				on:remove={(e) => (content = removeField(content, block, e.detail.key))}
			/>
		</aside>

		<aside class="preview">
			<PagePreview {page} {content} />
		</aside>
	</div>
</div>

<ConfirmModal
	open={showDeleteModal}
	title="Confirmar exclusão"
	message={`Tem certeza que deseja apagar a página "${deleteTarget}"? Esta ação não pode ser desfeita.`}
	on:cancel={cancelDelete}
	on:confirm={deletePage}
	confirmLabel="Apagar"
	cancelLabel="Cancelar"
/>

<style>
	.editor {
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		font-family: var(--font-primary);
		color: var(--color-dark);
		background: color-mix(in srgb, var(--color-dark) 4%, var(--color-light));
		opacity: 0;
	}
	.editor.loaded {
		opacity: 1;
		transition: opacity 360ms ease;
	}

	/* top bar */
	.bar {
		flex-shrink: 0;
		min-height: 64px;
		display: flex;
		align-items: center;
		gap: calc(var(--grid) * 1.5);
		padding: 8px calc(var(--grid) * 2.5);
		background: var(--color-tertiary);
		border-bottom: 1px solid var(--color-rule);
	}
	.name {
		display: inline-flex;
		align-items: center;
	}
	.name img {
		display: block;
		height: 34px;
		width: auto;
	}
	:global(html.theme-dark) .name img {
		filter: invert(1);
	}
	.tag {
		padding: 4px 10px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-primary) 12%, transparent);
		color: var(--color-primary);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.spacer {
		flex: 1;
	}
	.status {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: color-mix(in srgb, var(--color-dark) 72%, transparent);
	}
	.dot {
		flex-shrink: 0;
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: var(--color-success);
	}
	.dot.dirty {
		background: #b26a00;
	}
	.ghost {
		display: inline-flex;
		align-items: center;
		min-height: 36px;
		padding: 0 14px;
		border: 1px solid color-mix(in srgb, var(--color-dark) 30%, transparent);
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-dark);
		text-decoration: none;
		white-space: nowrap;
		background: none;
		font-family: inherit;
		cursor: pointer;
	}
	.ghost:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.bar :global(.btn) {
		min-height: 36px;
		font-size: 12px;
		letter-spacing: 0.06em;
	}

	/* columns */
	.body {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: var(--cols-wide);
	}
	/* panels folded away from the top bar (desktop only; small screens use the tabs) */
	@media (min-width: 901px) {
		.no-side > .side,
		.no-block > .block,
		.no-preview > .preview {
			display: none;
		}
	}
	.panel-toggles {
		display: inline-flex;
		border: 1px solid color-mix(in srgb, var(--color-dark) 22%, transparent);
		border-radius: 999px;
		overflow: hidden;
	}
	.panel-toggles button {
		height: 30px;
		padding: 0 12px;
		border: 0;
		border-left: 1px solid color-mix(in srgb, var(--color-dark) 22%, transparent);
		background: none;
		font-family: inherit;
		font-size: 12px;
		font-weight: 600;
		color: color-mix(in srgb, var(--color-dark) 55%, transparent);
		cursor: pointer;
	}
	.panel-toggles button:first-child {
		border-left: 0;
	}
	.panel-toggles button[aria-pressed='true'] {
		background: color-mix(in srgb, var(--color-dark) 8%, transparent);
		color: var(--color-dark);
	}
	.panel-toggles button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
	.side,
	.block {
		overflow-y: auto;
		padding: calc(var(--grid) * 2);
		background: var(--color-tertiary);
	}
	.side {
		display: flex;
		flex-direction: column;
		gap: calc(var(--grid) * 1);
		border-right: 1px solid var(--color-rule);
	}
	.block {
		border-left: 1px solid var(--color-rule);
	}
	.write {
		min-width: 0;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: calc(var(--grid) * 1.25);
		padding: calc(var(--grid) * 2);
	}
	.preview {
		min-height: 0;
		padding: calc(var(--grid) * 2);
	}
	h2 {
		margin-top: calc(var(--grid) * 1.5);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-dark) 65%, transparent);
	}
	.side h2:first-child {
		margin-top: 0;
	}

	/* pages */
	.pages {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.page {
		width: 100%;
		min-height: 44px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		padding: 0 10px;
		border: none;
		border-radius: 10px;
		background: transparent;
		font-family: inherit;
		font-size: 16px;
		color: var(--color-dark);
		text-align: left;
		cursor: pointer;
	}
	.page span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.page small {
		flex-shrink: 0;
		font-size: 12px;
		color: color-mix(in srgb, var(--color-dark) 60%, transparent);
	}
	.page:hover {
		background: color-mix(in srgb, var(--color-dark) 6%, transparent);
	}
	.page[aria-current='page'] {
		background: color-mix(in srgb, var(--color-primary) 12%, transparent);
		color: var(--color-primary);
		font-weight: 600;
	}
	.add-page,
	.delete {
		min-height: 44px;
		padding: 0 10px;
		border-radius: 10px;
		background: transparent;
		font-family: inherit;
		font-size: 14px;
		font-weight: 600;
		text-align: left;
		cursor: pointer;
	}
	.tool-link {
		display: flex;
		align-items: center;
		min-height: 44px;
		padding: 0 10px;
		border: 1px solid color-mix(in srgb, var(--color-dark) 30%, transparent);
		border-radius: 10px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-dark);
		text-decoration: none;
	}
	.tool-link:hover {
		background: color-mix(in srgb, var(--color-dark) 6%, transparent);
	}
	.add-page {
		border: 1px dashed color-mix(in srgb, var(--color-primary) 50%, transparent);
		color: var(--color-primary);
	}
	.delete {
		margin-top: auto;
		border: none;
		color: var(--color-danger);
	}
	.new-page,
	.field,
	.github {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}
	.github p {
		font-size: 13px;
		line-height: 1.4;
		color: color-mix(in srgb, var(--color-dark) 72%, transparent);
	}
	label {
		font-size: 14px;
		font-weight: 500;
	}
	.check {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		font-size: 15px;
		font-weight: 400;
	}
	input[type='checkbox'] {
		width: 20px;
		height: 20px;
		accent-color: var(--color-primary);
	}
	input[type='text'],
	input[type='password'] {
		width: 100%;
		height: 44px;
		padding: 0 12px;
		font-family: inherit;
		font-size: 16px;
		color: var(--color-dark);
		background: var(--color-tertiary);
		border: 1px solid color-mix(in srgb, var(--color-dark) 45%, transparent);
		border-radius: 10px;
	}
	input[type='text']:focus,
	input[type='password']:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 22%, transparent);
	}
	button:focus-visible,
	.ghost:focus-visible,
	.name:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	/* writing tools */
	.tools {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px;
	}
	.sep {
		width: 1px;
		height: 24px;
		margin: 0 6px;
		background: var(--color-rule);
	}
	.tools-label {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-dark) 65%, transparent);
	}
	.chip {
		min-height: 36px;
		padding: 0 12px;
		border: 1px solid color-mix(in srgb, var(--color-primary) 35%, transparent);
		border-radius: 999px;
		background: var(--color-tertiary);
		font-family: inherit;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-primary);
		cursor: pointer;
	}
	.chip:hover {
		background: color-mix(in srgb, var(--color-primary) 10%, var(--color-tertiary));
	}
	.issues {
		flex-shrink: 0;
		max-height: 132px;
		overflow-y: auto;
		list-style: none;
		background: var(--color-tertiary);
		border: 1px solid color-mix(in srgb, var(--color-danger) 45%, transparent);
		border-radius: 10px;
	}
	.issues button {
		width: 100%;
		min-height: 40px;
		padding: 6px 12px;
		border: none;
		background: transparent;
		font-family: inherit;
		font-size: 14px;
		line-height: 1.4;
		color: var(--color-dark);
		text-align: left;
		cursor: pointer;
	}
	.issues li + li {
		border-top: 1px solid var(--color-rule);
	}
	.issues b {
		color: var(--color-danger);
		margin-right: 6px;
	}
	.ok {
		font-size: 13px;
		color: color-mix(in srgb, var(--color-dark) 65%, transparent);
	}

	/* small-screen tabs */
	.tabs {
		display: none;
	}
	@media (max-width: 1360px) {
		.body {
			grid-template-columns: var(--cols-mid);
			grid-template-rows: auto minmax(0, 1fr);
		}
		/* with one of the stacked panels folded, the other takes the whole column */
		.no-block > .preview,
		.no-preview > .block {
			grid-row: 1 / 3;
			max-height: none;
			border-bottom: none;
		}
		.side {
			grid-row: 1 / 3;
		}
		.write {
			grid-row: 1 / 3;
		}
		.block {
			max-height: 42vh;
			border-bottom: 1px solid var(--color-rule);
		}
	}
	@media (max-width: 900px) {
		.bar {
			flex-wrap: wrap;
			padding: 8px calc(var(--grid) * 1.5);
		}
		.tag,
		.ghost,
		.panel-toggles {
			display: none;
		}
		.status {
			order: 3;
			flex-basis: 100%;
		}
		.tabs {
			flex-shrink: 0;
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			background: var(--color-tertiary);
			border-bottom: 1px solid var(--color-rule);
		}
		.tabs button {
			height: 44px;
			border: none;
			border-bottom: 3px solid transparent;
			background: transparent;
			font-family: inherit;
			font-size: 14px;
			font-weight: 600;
			color: color-mix(in srgb, var(--color-dark) 70%, transparent);
		}
		.tabs button[aria-pressed='true'] {
			border-bottom-color: var(--color-primary);
			color: var(--color-primary);
		}
		.body {
			display: block;
			overflow: hidden;
		}
		.body > * {
			display: none;
			height: 100%;
			max-height: none;
			border: none;
		}
		.body[data-tab='write'] > .write,
		.body[data-tab='pages'] > .side {
			display: flex;
		}
		.body[data-tab='block'] > .block,
		.body[data-tab='preview'] > .preview {
			display: block;
		}
		.write,
		.preview {
			padding: calc(var(--grid) * 1.25);
		}
		.tools {
			flex-wrap: nowrap;
			overflow-x: auto;
			scrollbar-width: none;
		}
		.tools > :global(*) {
			flex-shrink: 0;
		}
	}
</style>
