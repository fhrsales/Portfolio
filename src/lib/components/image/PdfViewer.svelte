<script>
  export let value = '';
  import { base } from '$app/paths';
  // Caminho base dos PDFs
  const src = `${base}/pdfs/${value}`;
</script>

<div class="pdf-viewer">
  <iframe src={src} width="100%" height="600px" style="border:none;" allowfullscreen title={`PDF: ${value}`}></iframe>
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
