<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { resolve } from '$app/paths';
  import PlayIcon from '$lib/components/icons/Play.svelte';
  import PauseIcon from '$lib/components/icons/Pause.svelte';

  // Directory under static (e.g., 'imgs/galeria1' or '/imgs/galeria1')
  export let dir = '';
  // Interval between scroll steps (ms)
  export let intervalMs = 3000;
  // Component height (CSS string). Example: '420px', '50vh'. If empty, height adapts to content.
  export let height = '';
  // Optional background color
  export let background = '';
  // Optional size keyword for max-width presets (PP,P,M,G,GG). Defaults to full width when empty.
  export let size = '';
  // Extra classes applied to wrapper
  export let classes = '';
  // Shadow style: when truthy, applies newspaper-like shadow (uses global .shadow-1 helpers)
  export let shadow = true; // true | false
  // Optional vertical padding (CSS strings). If only padding is given it applies to top and bottom.
  export let padding = 'calc(var(--grid) * 5)';
  export let paddingTop = '';
  export let paddingBottom = '';
  // Horizontal gap between items (px)
  export let gap = 32;
  // Preload margin for lazy loading (px)
  export let preloadMargin = 400;
  // Scroll amount per step: fraction of viewport width (0..1). 0.9 means leave a bit of previous/next visible.
  export let stepViewportFraction = 0.9;
  // Extra padding around PDF thumbnails (for newspaper page look)
  export let pdfPadding = '24px';

  let containerEl; // scroll container (with overflow hidden)
  let trackEl; // inner flex track
  let timer = null;
  let isPaused = false;
  let hasFocus = true;
  let error = '';

  /** @type {Array<{ url: string, type: 'image'|'pdf', loaded: boolean, previewIdx?: number, previewSrc?: string }>} */
  let items = [];
  let observer = null;
  // Prefer to render PDFs as image thumbnails (if available) instead of embedding a viewer
  export let pdfAsImage = true;
  const pdfPreviewExts = ['.png', '.jpg', '.webp', '.avif'];

  // Build URL to manifest respecting base (for adapter-static deployments under /Portfolio)
  $: normalizedDir = (() => {
    let d = String(dir || '').trim();
    if (!d) return '';
    if (d.startsWith('imgs')) d = '/' + d; // ensure leading slash
    if (!d.startsWith('/')) d = '/' + d;
    return d.replace(/\/+$/, ''); // no trailing slash
  })();

  $: manifestUrl = normalizedDir ? resolve(`${normalizedDir}/manifest.json`) : '';

  onMount(async () => {
    // Pause when tab not visible
    const onVis = () => {
      hasFocus = document.visibilityState === 'visible';
      if (!hasFocus) stop();
      else start();
    };
    document.addEventListener('visibilitychange', onVis);

    if (!normalizedDir) {
      error = 'Defina a propriedade dir (ex.: "imgs/galeria").';
    } else {
      await loadManifest();
      await tick();
      setupObserver();
      start();
      // trigger initial lazy-load for items in view
      try { observer && observer.takeRecords && observer.takeRecords(); } catch {}
    }

    return () => {
      document.removeEventListener('visibilitychange', onVis);
    };
  });

  onDestroy(() => {
    stop();
    if (observer) observer.disconnect();
  });

  async function loadManifest() {
    error = '';
    items = [];
    try {
      const res = await fetch(manifestUrl, { headers: { 'cache-control': 'no-cache' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : Array.isArray(data.files) ? data.files : [];
      if (!list.length) {
        error = 'manifest.json vazio. Gere a lista de arquivos.';
        return;
      }
      const allowed = list
        .map((name) => String(name))
        .filter((n) => /\.(jpe?g|png|webp|avif|svg|pdf)$/i.test(n))
        .map((name) => {
          const extMatch = name.match(/\.([a-z0-9]+)$/i);
          const ext = (extMatch ? extMatch[1] : '').toLowerCase();
          const base = ext ? name.slice(0, -(ext.length + 1)) : name;
          return { name, base, ext };
        });

      // Prefer a single entry per base name; priority by extension (png first)
      const order = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'svg', 'pdf'];
      const byBase = new Map();
      for (const it of allowed) {
        const curr = byBase.get(it.base);
        if (!curr) {
          byBase.set(it.base, it);
          continue;
        }
        const a = order.indexOf(it.ext);
        const b = order.indexOf(curr.ext);
        if ((a !== -1 ? a : 999) < (b !== -1 ? b : 999)) {
          byBase.set(it.base, it);
        }
      }

      const chosen = Array.from(byBase.values());
      items = chosen.map(({ name, ext }) => {
        const enc = encodeURIComponent(name);
        const url = resolve(`${normalizedDir}/${enc}`);
        const type = ext === 'pdf' ? 'pdf' : 'image';
        return { url, type, loaded: false, previewIdx: -1, previewSrc: '' };
      });
    } catch (e) {
      error = `Não foi possível carregar ${manifestUrl}. Crie um manifest.json nessa pasta.`;
    }
  }

  function setupObserver() {
    if (observer) observer.disconnect();
    if (typeof window === 'undefined' || !containerEl) return;
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number(entry.target.getAttribute('data-index'));
          if (!Number.isFinite(idx) || idx < 0 || idx >= items.length) continue;
          if (entry.isIntersecting) {
            // mark item to load its src/iframe
            const it = items[idx];
            it.loaded = true;
            if (it.type === 'pdf' && pdfAsImage && (it.previewIdx ?? -1) === -1) {
              it.previewIdx = 0;
              const cands = candidatesFor(it);
              it.previewSrc = cands[0] || '';
            }
            items = items;
          }
        }
      },
      {
        root: containerEl,
        rootMargin: `${preloadMargin}px`,
        threshold: 0.02
      }
    );
    // observe each child card
    try {
      const cards = trackEl ? Array.from(trackEl.children) : [];
      for (const [i, el] of cards.entries()) {
        el.setAttribute('data-index', String(i));
        observer.observe(el);
      }
    } catch {}
  }

  function start() {
    if (timer || isPaused || !items.length) return;
    timer = setInterval(step, Math.max(600, Number(intervalMs) || 3000));
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) stop();
    else start();
  }

  function step() {
    if (!containerEl) return;
    const vw = containerEl.clientWidth || 0;
    const dx = Math.max(24, Math.round(vw * Math.max(0.1, Math.min(1, stepViewportFraction))));
    const maxScroll = containerEl.scrollWidth - vw;
    const next = Math.min(maxScroll, (containerEl.scrollLeft || 0) + dx);
    if (next >= maxScroll - 2) {
      // loop back to start after the smooth scroll completes
      try {
        containerEl.scrollTo({ left: next, behavior: 'smooth' });
      } catch {
        containerEl.scrollLeft = next;
      }
      // small delay so user perceives last step, then jump to 0 without animation
      setTimeout(() => {
        try {
          containerEl.scrollTo({ left: 0 });
        } catch {
          containerEl.scrollLeft = 0;
        }
      }, 280);
    } else {
      try {
        containerEl.scrollBy({ left: dx, behavior: 'smooth' });
      } catch {
        containerEl.scrollLeft = (containerEl.scrollLeft || 0) + dx;
      }
    }
  }

  function candidatesFor(it) {
    if (!it || it.type !== 'pdf') return [];
    const base = it.url.replace(/\.pdf(?:[#?].*)?$/i, '');
    return pdfPreviewExts.map((ext) => `${base}${ext}`);
  }

  function onPreviewError(i) {
    const it = items[i];
    if (!it || it.type !== 'pdf') return;
    const cands = candidatesFor(it);
    const next = (it.previewIdx || 0) + 1;
    if (next < cands.length) {
      it.previewIdx = next;
      it.previewSrc = cands[next];
    } else {
      // give up; leave placeholder
      it.previewSrc = '';
    }
    items = items;
  }
</script>

<div class="auto-scroll-gallery">
  <div
    bind:this={containerEl}
    class={`scroll-viewport ${size ? `size-${size}` : ''} ${classes || ''}`}
    class:hasHeight={!!height}
    style={`gap:${gap}px; ${height ? `height:${height};` : ''} ${background ? `background:${background};` : ''} ${padding || paddingTop ? `padding-top:${paddingTop || padding};` : ''} ${padding || paddingBottom ? `padding-bottom:${paddingBottom || padding};` : ''}`}
  >
    <div bind:this={trackEl} class="scroll-track" style={`gap:${gap}px`}>
      {#each items as it, i (i)}
        <div class={`card ${shadow ? 'shadow-1' : ''}`} data-index={i} style={height ? `height:${height};` : ''}>
          {#if it.type === 'image'}
            {#if it.loaded}
              <img src={it.url} alt={`Imagem ${i + 1}`} loading="lazy" />
            {:else}
              <div class="placeholder" aria-hidden="true"></div>
            {/if}
          {:else}
            {#if it.loaded}
              {#if pdfAsImage}
                {#if it.previewSrc}
                  <div class="pdf-thumb" style={`padding:${pdfPadding};`}>
                    <img src={it.previewSrc} alt={`PDF ${i + 1}`} loading="lazy" on:error={() => onPreviewError(i)} />
                  </div>
                {:else}
                  <div class="placeholder pdf" aria-hidden="true">PDF</div>
                {/if}
              {:else}
                <iframe class="pdf-frame" src={`${it.url}#toolbar=0&navpanes=0&scrollbar=0`} title={`PDF ${i + 1}`}></iframe>
              {/if}
            {:else}
              <div class="placeholder pdf" aria-hidden="true">PDF</div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <div class="controls">
    <button type="button" class="icon-btn" on:click={togglePause} aria-label={isPaused ? 'Reproduzir' : 'Pausar'} title={isPaused ? 'Reproduzir' : 'Pausar'}>
      {#if isPaused}
        <PlayIcon size={18} />
      {:else}
        <PauseIcon size={18} />
      {/if}
    </button>
  </div>

  {#if error}
    <p class="error">{error}</p>
    <p class="hint">
      Crie um <code>manifest.json</code> em <code>{normalizedDir}</code> com a lista de arquivos
      (ex.: ["foto1.jpg", "arquivo.pdf"]).<br />
      Opcional: rode <code>node scripts/gen-gallery-manifest.cjs {normalizedDir.slice(1)}</code>.
    </p>
  {/if}
</div>

<style>
  .auto-scroll-gallery {
    width: 100%;
    position: relative;
  }
  .scroll-viewport {
    width: 100%;
    overflow: hidden;
    position: relative;
    display: block;
  }
  .scroll-viewport.size-PP { max-width: 250px; }
  .scroll-viewport.size-P { max-width: 500px; }
  .scroll-viewport.size-M { max-width: 620px; }
  .scroll-viewport.size-G { max-width: 860px; }
  .scroll-viewport.size-GG { width: 100%; max-width: 100%; }
  .scroll-track {
    display: inline-flex;
    align-items: center;
    will-change: transform;
  }
  .card {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: auto;
    background: #fff;
  }
  /* add soft elevation on the card itself; corner shadows handled by global .shadow-1 */
  .card.shadow-1 {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }
  .card img {
    height: auto;
    width: auto;
    max-height: 65vh;
    object-fit: contain;
    display: block;
  }
  .scroll-viewport.hasHeight .card img {
    height: 100%;
    max-height: none;
  }

  /* Mobile: show a bit more context by reducing height */
  @media (max-width: 600px) {
    .scroll-viewport:not(.hasHeight) .card img {
      max-height: 50vh;
    }
  }
  .pdf-frame {
    height: 100%;
    width: min(80vw, 900px);
    border: none;
    background: #fff;
  }
  .pdf-thumb {
    background: #fff;
    display: inline-block;
    border: 1px solid #e8e8e8;
  }
  .placeholder {
    height: 100%;
    min-height: 140px;
    width: min(60vw, 600px);
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
    background-size: 400% 100%;
    animation: shimmer 1.2s infinite linear;
    border-radius: 6px;
  }
  .placeholder.pdf {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 12px;
    letter-spacing: 0.08em;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .controls {
    position: absolute; /* anchored to component, not viewport */
    right: 48px;
    bottom: 48px;
    z-index: 999;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
  .icon-btn {
    appearance: none;
    border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
    outline: none;
    padding: 10px;
    border-radius: 999px;
    background: var(--color-light);
    color: var(--color-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 120ms ease, color 120ms ease, transform 60ms ease;
    box-shadow: var(--shadow-2);
  }
  .icon-btn:hover {
    background: var(--color-primary);
    color: var(--color-light);
  }
  .icon-btn:active {
    background: rgba(255,255,255,0.9);
    color: var(--color-primary);
    transform: translateY(1px);
  }
  .error {
    color: #a00;
    margin-top: 0.6rem;
  }
  .hint { color: #666; font-size: 0.9em; }
  .hint code { background: #f3f3f3; padding: 0 4px; border-radius: 4px; }
</style>
