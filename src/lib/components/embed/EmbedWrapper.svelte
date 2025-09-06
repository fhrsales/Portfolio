<!-- eslint-disable svelte/no-at-html-tags -->
<script>
	/* eslint-disable svelte/no-at-html-tags */
	import { onMount } from 'svelte';
	export let value = '';

	onMount(() => {
		// Seleciona todos os scripts dentro do componente
		const container = document.querySelector('.embed-wrapper');
		if (container) {
			container.querySelectorAll('script').forEach((oldScript) => {
				const newScript = document.createElement('script');
				// Copia atributos
				for (const attr of oldScript.attributes) {
					newScript.setAttribute(attr.name, attr.value);
				}
				// Copia conteúdo
				newScript.textContent = oldScript.textContent;
				// Substitui
				oldScript.replaceWith(newScript);
			});
		}
	});
</script>

<div class="embed-wrapper">
	<div class="embed-container">
		<div class="embed-container">
			{@html value}
		</div>
	</div>
</div>

<style>
	.embed-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.embed-container {
		width: 100%;
		position: relative;
	}
</style>
