<script>
  import { onMount } from 'svelte';
  export let dir = '';
  export let file = 'index.html';
  let html = '';
  let error = '';

  onMount(() => {
    if (dir && file) {
      fetch(`${dir}/${file}`)
        .then(res => {
          if (!res.ok) throw new Error('Não foi possível carregar o ai2html');
          return res.text();
        })
        .then(data => {
          // Corrige caminhos relativos de imagens/scripts
          html = data.replace(/(src|href)=["'](?!https?:|data:|\/)/g, `$1=\"${dir}/`);
          error = '';
          // Executa scripts do ai2html, se houver
          setTimeout(() => {
            document.querySelectorAll('.ai2html-wrapper script').forEach(script => {
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
        .catch(e => {
          html = '';
          error = e.message;
        });
    }
  });
 
</script>

{#if error}
  <div style="color:red">Erro ao carregar ai2html: {error}</div>
{:else if html}
  <div class="ai2html-wrapper">{@html html}</div>
{:else}
  <div>Carregando ai2html...</div>
{/if}

<style>
.ai2html-wrapper {
  width: 100%;
  overflow-x: auto;
}
</style>
