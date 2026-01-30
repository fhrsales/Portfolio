<!-- eslint-disable svelte/no-at-html-tags -->
<script>
	/* eslint-disable svelte/no-at-html-tags */
	/* eslint-disable no-useless-escape */
	import { onMount, onDestroy } from 'svelte';
	export let dir = '';
	export let file = 'index.html';
	let html = '';
	let error = '';
	let rootEl;
	let shouldLoad = false;
	let hasShown = false;
	let observer;

	function sanitizeHtml(str) {
		if (!str) return str;
		return String(str)
			.replace(/\son[a-z]+\s*=\s*(["']).*?\1/gi, '')
			.replace(/(href|src)=(['"])javascript:[^\2]*\2/gi, '$1="#"');
	}

	function loadAi2Html() {
		if (!dir || !file) return;
		fetch(`${dir}/${file}`)
			.then((res) => {
				if (!res.ok) throw new Error('Não foi possível carregar o ai2html');
				return res.text();
			})
			.then((data) => {
				// Corrige caminhos relativos de imagens/scripts
				html = data.replace(/(src|href)=["'](?!https?:|data:|\/)/g, `$1=\"${dir}/`);
				html = sanitizeHtml(html);
				error = '';
				// Executa scripts do ai2html, se houver
				setTimeout(() => {
					document.querySelectorAll('.ai2html-wrapper script').forEach((script) => {
						const newScript = document.createElement('script');
						if (script.src) {
							newScript.src = script.src;
						} else {
							newScript.text = script.text;
						}
						script.replaceWith(newScript);
					});
				}, 0);
			})
			.catch((e) => {
				html = '';
				error = e.message;
			});
	}

	onMount(() => {
		if (typeof window === 'undefined') {
			shouldLoad = true;
			hasShown = true;
			loadAi2Html();
			return;
		}
		try {
			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							shouldLoad = true;
							hasShown = true;
							loadAi2Html();
							if (observer) observer.disconnect();
							break;
						}
					}
				},
				{ root: null, rootMargin: '200px', threshold: 0.1 }
			);
			if (rootEl) observer.observe(rootEl);
		} catch {
			shouldLoad = true;
			hasShown = true;
			loadAi2Html();
		}
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
	});
</script>

<div class="ai2html-container" bind:this={rootEl} class:show={hasShown}>
	{#if error}
		<div style="color:red">Erro ao carregar ai2html: {error}</div>
	{:else if html}
		<div class="ai2html-wrapper">{@html html}</div>
	{:else if shouldLoad}
		<div>Carregando ai2html...</div>
	{/if}
</div>

<style>
	.ai2html-container {
		opacity: 0;
		transition: opacity 600ms ease;
	}
	.ai2html-container.show {
		opacity: 1;
	}
	.ai2html-wrapper {
		width: 100%;
		overflow-x: auto;
	}
</style>
