<script>
  export let value = {};
</script>

{#if value.titulo}
  <h1>{value.titulo}</h1>
{/if}

<div class="corpo">
  {#if value.body}
    {#each Array.isArray(value.body) ? value.body : [value.body] as bloco}
      {#if bloco.trim().startsWith('<')}
        {@html bloco}
      {:else}
        <p>{@html bloco}</p>
      {/if}
    {/each}
  {/if}
</div>

<style>
    .corpo {
        max-width: 600px;
        width: 100%;
        margin: 0 auto 24px auto;
        text-align: left;
        font-size: 1.1rem;
        line-height: 1.6;
    }

    .corpo > p a {
    color: var(--cor-primaria);
    text-decoration: underline;
    font-weight: bold;
    }

    @media (max-width: 600px) {
        .corpo > p {
            padding: 1rem;
        }
    }
</style>
