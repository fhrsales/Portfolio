<script>
    export let value = '';
</script>

<p class="corpo" >{@html value}</p>

<style>
    .corpo > a {
    color: var(--cor-primaria);
    text-decoration: underline;
    font-weight: bold;
    }
</style>
