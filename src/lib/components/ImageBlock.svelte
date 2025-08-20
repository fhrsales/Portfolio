<script>
    export let src = '';
    export let alt = '';
    export let caption = '';
    export let width = '';
    export let height = '';
    export let size = 'M'; // P, M, G, GG

    // Determina a classe CSS baseada no tamanho
$: sizeClass =
    size === 'PP' ? 'img-pp'
    : size === 'P' ? 'img-p'
    : size === 'M' ? 'img-m'
    : size === 'G' ? 'img-g'
    : size === 'GG' ? 'img-gg'
    : 'img-m';
</script>

<figure class="image-block image-block-wrapper {sizeClass}">
    <img src={src} alt={alt} width={width} height={height} loading="lazy" style="width: 100%; max-width: 100%;" />
    {#if caption}
        <figcaption>{caption}</figcaption>
    {/if}
</figure>

<style>
.image-block {
    margin: 6em auto 1rem auto;
    text-align: center;
    max-width: 100%;
}
.image-block img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}
.image-block figcaption {
    font-size: 0.95em;
    color: #555;
    margin-top: 0.5em;
}

.image-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}
.image-block img {
    display: block;
    margin: 0 auto;
}
.image-block-wrapper.img-pp {
    max-width: 250px;
}

.image-block-wrapper.img-p {
    max-width: 500px;
}
.image-block-wrapper.img-m {
    max-width: 720px;
}
.image-block-wrapper.img-g {
    max-width: 860px;
}
.image-block-wrapper.img-gg {
    max-width: 100vw;
    border-radius: 0;
}
</style>
.image-block-wrapper.img-pp,
.image-block-wrapper.img-p,
.image-block-wrapper.img-m,
.image-block-wrapper.img-g {
        /* Desktop: sem padding extra */
}

@media (max-width: 600px) {
    .image-block-wrapper.img-pp,
    .image-block-wrapper.img-p,
    .image-block-wrapper.img-m,
    .image-block-wrapper.img-g {
        padding-left: 1.5em;
        padding-right: 1.5em;
        box-sizing: border-box;
    }
}
