<script>
	export let value = '';
	import { resolve } from '$app/paths';
	// Caminho base dos PDFs (usa resolve para respeitar base em produção)
	const path = `/pdfs/${value}`;
	const src = resolve(path);
</script>

<div class="pdf-viewer">
	<iframe
		{src}
		width="100%"
		height="600px"
		style="border:none;"
		allowfullscreen
		title={`PDF: ${value}`}
	></iframe>
	<p style="text-align:center; margin-top:0.5em;">
		<a href={src} target="_blank" rel="noopener">Abrir PDF em nova aba</a>
	</p>
</div>

<style>
	.pdf-viewer {
		width: 100%;
		max-width: 900px;
		margin: 2em auto;
	}
</style>
