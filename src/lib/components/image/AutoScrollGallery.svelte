<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { resolve } from '$app/paths';
  import PlayIcon from '$lib/components/icons/Play.svelte';
  import PauseIcon from '$lib/components/icons/Pause.svelte';

  // Directory under static (e.g., 'imgs/galeria1' or '/imgs/galeria1')
  export let dir = '';
  // Interval between scroll steps (ms)
  export let intervalMs = 3000;
  // Enable/disable auto-scroll
  export let autoScroll = true;
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
  // Respect original sizes (when manifest includes width/height)
  export let respectSizes = true;
  // Max height for the largest item, as vh (number)
  export let maxHeightVh = 70;
  // Extra padding around PDF thumbnails (for newspaper page look)
  export let pdfPadding = '24px';

  let containerEl; // scroll container (with overflow hidden)
  let trackEl; // inner flex track
  let timer = null;
  let isPaused = false;
  let hasFocus = true;
  let error = '';
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragPointerId = null;
  let wasAutoRunning = false;

  /** @type {Array<{ url: string, type: 'image'|'pdf', loaded: boolean, width?: number, height?: number, previewIdx?: number, previewSrc?: string }>} */
  let items = [];
  let observer = null;
  let sizeScale = 1;
  let maxImageHeight = 0;
  let targetHeightPx = 0;
  let hasSizeData = false;
  let viewportWidth = 0;
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
      computeScale();
      updateViewportWidth();
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
    if (typeof window !== 'undefined' && _resizeHandler) {
      window.removeEventListener('resize', _resizeHandler);
    }
  });

  async function loadManifest() {
    error = '';
    items = [];
    hasSizeData = false;
    try {
      const res = await fetch(manifestUrl, { headers: { 'cache-control': 'no-cache' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const defaultWidth = Number(data?.defaultWidth ?? data?.width) || 0;
      const defaultHeight = Number(data?.defaultHeight ?? data?.height) || 0;
      const rawList = Array.isArray(data) ? data : Array.isArray(data.files) ? data.files : [];
      const list = rawList
        .map((entry) => (typeof entry === 'string' ? { name: entry } : entry))
        .filter((entry) => entry && entry.name);
      if (!list.length) {
        error = 'manifest.json vazio. Gere a lista de arquivos.';
        return;
      }
      const allowed = list
        .map((entry) => ({
          name: String(entry.name),
          width: Number(entry.width) || defaultWidth || 0,
          height: Number(entry.height) || defaultHeight || 0
        }))
        .filter((entry) => /\.(jpe?g|png|webp|avif|svg|pdf)$/i.test(entry.name))
        .map((entry) => {
          const extMatch = entry.name.match(/\.([a-z0-9]+)$/i);
          const ext = (extMatch ? extMatch[1] : '').toLowerCase();
          const base = ext ? entry.name.slice(0, -(ext.length + 1)) : entry.name;
          return { name: entry.name, base, ext, width: entry.width, height: entry.height };
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
      items = chosen.map(({ name, ext, width, height }) => {
        const enc = encodeURIComponent(name);
        const url = resolve(`${normalizedDir}/${enc}`);
        const type = ext === 'pdf' ? 'pdf' : 'image';
        return { url, type, loaded: false, width, height, previewIdx: -1, previewSrc: '' };
      });
      hasSizeData = items.some((it) => it.width && it.height);
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
    if (!autoScroll || timer || isPaused || !items.length) return;
    timer = setInterval(step, Math.max(600, Number(intervalMs) || 3000));
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function togglePause() {
    if (!autoScroll) return;
    isPaused = !isPaused;
    if (isPaused) stop();
    else start();
  }

  function onPointerDown(e) {
    if (!containerEl) return;
    if (typeof e.button === 'number' && e.button !== 0) return;
    isDragging = true;
    dragPointerId = e.pointerId;
    dragStartX = e.clientX;
    dragStartScroll = containerEl.scrollLeft || 0;
    wasAutoRunning = !isPaused;
    if (wasAutoRunning) stop();
    try { containerEl.setPointerCapture && containerEl.setPointerCapture(e.pointerId); } catch {}
  }

  function onPointerMove(e) {
    if (!isDragging || e.pointerId !== dragPointerId || !containerEl) return;
    const dx = e.clientX - dragStartX;
    containerEl.scrollLeft = Math.max(0, dragStartScroll - dx);
  }

  function endDrag(e) {
    if (!isDragging) return;
    if (containerEl && dragPointerId !== null) {
      try { containerEl.releasePointerCapture && containerEl.releasePointerCapture(dragPointerId); } catch {}
    }
    isDragging = false;
    dragPointerId = null;
    if (wasAutoRunning && !isPaused) start();
    wasAutoRunning = false;
  }

  function step() {
    if (!containerEl) return;
    const vw = containerEl.clientWidth || 0;
    const maxScroll = Math.max(0, containerEl.scrollWidth - vw);

    // Mobile: snap to center of nearest next card (single or double page)
    const isMobile = typeof window !== 'undefined' ? (window.innerWidth || 0) <= 600 : false;
    if (isMobile && trackEl && trackEl.children && trackEl.children.length) {
      const cards = Array.from(trackEl.children);
      const currentCenter = (containerEl.scrollLeft || 0) + vw / 2;
      // Find next card center strictly after current center
      let targetLeft = 0;
      let found = false;
      for (const el of cards) {
        const left = el.offsetLeft || 0;
        const width = el.offsetWidth || 0;
        const center = left + width / 2;
        if (center > currentCenter + 1) {
          targetLeft = Math.min(maxScroll, Math.max(0, Math.round(center - vw / 2)));
          found = true;
          break;
        }
      }
      if (!found) {
        // wrap to beginning
        targetLeft = 0;
      }
      try { containerEl.scrollTo({ left: targetLeft, behavior: 'smooth' }); } catch { containerEl.scrollLeft = targetLeft; }
      return;
    }

    // Desktop: keep fractional shift, then loop
    const dx = Math.max(24, Math.round(vw * Math.max(0.1, Math.min(1, stepViewportFraction))));
    const next = Math.min(maxScroll, (containerEl.scrollLeft || 0) + dx);
    if (next >= maxScroll - 2) {
      try { containerEl.scrollTo({ left: next, behavior: 'smooth' }); } catch { containerEl.scrollLeft = next; }
      setTimeout(() => { try { containerEl.scrollTo({ left: 0 }); } catch { containerEl.scrollLeft = 0; } }, 280);
    } else {
      try { containerEl.scrollBy({ left: dx, behavior: 'smooth' }); } catch { containerEl.scrollLeft = (containerEl.scrollLeft || 0) + dx; }
    }
  }

  let _resizeHandler = null;
  function computeScale() {
    if (!respectSizes || !hasSizeData || typeof window === 'undefined') {
      sizeScale = 1;
      updateViewportWidth();
      return;
    }
    if (isMobile()) {
      sizeScale = 1;
      targetHeightPx = 0;
      updateViewportWidth();
      return;
    }
    const maxH = Math.max(
      0,
      ...items
        .filter((it) => it.type === 'image' && it.height)
        .map((it) => Number(it.height) || 0)
    );
    maxImageHeight = maxH;
    if (!maxH) {
      sizeScale = 1;
      return;
    }
    const vh = Number(maxHeightVh);
    const target = Math.max(120, Math.round((Number.isFinite(vh) ? vh : 70) * window.innerHeight / 100));
    targetHeightPx = target;
    sizeScale = Math.min(1, target / maxH);

    if (!_resizeHandler) {
      _resizeHandler = () => computeScale();
      window.addEventListener('resize', _resizeHandler);
    }
    updateViewportWidth();
  }

  function updateViewportWidth() {
    if (typeof window === 'undefined' || !containerEl) return;
    const styles = window.getComputedStyle(containerEl);
    const padL = parseFloat(styles.paddingLeft || '0') || 0;
    const padR = parseFloat(styles.paddingRight || '0') || 0;
    const inner = (containerEl.clientWidth || 0) - padL - padR;
    viewportWidth = Math.max(0, Math.round(inner));
  }

  function isMobile() {
    return typeof window !== 'undefined' ? (window.innerWidth || 0) <= 600 : false;
  }

  function candidatesFor(it) {
    if (!it || it.type !== 'pdf') return [];
    const base = it.url.replace(/\.pdf(?:[#?].*)?$/i, '');
    return pdfPreviewExts.map((ext) => `${base}${ext}`);
  }

  function scaledSize(it) {
    if (!it || it.type !== 'image' || height) return null;
    if (!respectSizes || !hasSizeData || !it.width || !it.height) return null;
    if (isMobile() && it.width > it.height && targetHeightPx > 0) {
      let h = Math.round(targetHeightPx);
      let w = Math.round((it.width / it.height) * h);
      const maxW = viewportWidth > 0 ? Math.round(viewportWidth * 0.92) : 0;
      if (maxW > 0 && w > maxW) {
        const fitScale = maxW / w;
        w = Math.round(w * fitScale);
        h = Math.round(h * fitScale);
      }
      return { w, h };
    }
    let w = Math.round(it.width * sizeScale);
    let h = Math.round(it.height * sizeScale);
    if (isMobile() && viewportWidth > 0 && w > viewportWidth) {
      const fitScale = viewportWidth / w;
      w = Math.round(w * fitScale);
      h = Math.round(h * fitScale);
    }
    return { w, h };
  }

  function imageStyle(it, size) {
    if (size) return 'width:100%; height:100%;';
    return respectSizes && hasSizeData && it.width && it.height
      ? `width:${Math.round(it.width * sizeScale)}px; height:${Math.round(it.height * sizeScale)}px;`
      : '';
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
    class:dragging={isDragging}
    class:hasHeight={!!height}
    class:respectSizes={respectSizes && hasSizeData}
    style={`gap:${gap}px; ${height ? `height:${height};` : ''} ${background ? `background:${background};` : ''} ${padding || paddingTop ? `padding-top:${paddingTop || padding};` : ''} ${padding || paddingBottom ? `padding-bottom:${paddingBottom || padding};` : ''}`}
    on:pointerdown={onPointerDown}
    on:pointermove={onPointerMove}
    on:pointerup={endDrag}
    on:pointerleave={endDrag}
    on:pointercancel={endDrag}
  >
    <div bind:this={trackEl} class="scroll-track" style={`gap:${gap}px`}>
      {#each items as it, i (i)}
        {@const size = scaledSize(it)}
        <div
          class={`card ${shadow ? 'shadow-1' : ''} ${size ? 'fixed-size' : ''}`}
          data-index={i}
          style={`${height ? `height:${height};` : ''}${size ? `width:${size.w}px; height:${size.h}px;` : ''}`}
        >
          {#if it.type === 'image'}
            {#if it.loaded}
              <img
                src={it.url}
                alt={`Imagem ${i + 1}`}
                loading="lazy"
                width={it.width || undefined}
                height={it.height || undefined}
                style={imageStyle(it, size)}
                draggable="false"
              />
            {:else}
              <div class="placeholder" aria-hidden="true"></div>
            {/if}
          {:else}
            {#if it.loaded}
              {#if pdfAsImage}
                {#if it.previewSrc}
                  <div class="pdf-thumb" style={`padding:${pdfPadding};`}>
                    <img
                      src={it.previewSrc}
                      alt={`PDF ${i + 1}`}
                      loading="lazy"
                      draggable="false"
                      on:error={() => onPreviewError(i)}
                    />
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

  {#if autoScroll}
    <div class="controls">
      <button type="button" class="icon-btn" on:click={togglePause} aria-label={isPaused ? 'Reproduzir' : 'Pausar'} title={isPaused ? 'Reproduzir' : 'Pausar'}>
        {#if isPaused}
          <PlayIcon size={18} />
        {:else}
          <PauseIcon size={18} />
        {/if}
      </button>
    </div>
  {/if}

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
    cursor: grab;
    margin: 0 auto;
  }
  .scroll-viewport.dragging {
    cursor: grabbing;
    user-select: none;
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
  .card.fixed-size img {
    max-height: none;
    max-width: none;
  }
  .card.fixed-size .placeholder,
  .card.fixed-size .pdf-thumb {
    width: 100%;
    height: 100%;
    min-height: 0;
  }
  .card img {
    height: auto;
    width: auto;
    max-height: 65vh; /* fallback */
    object-fit: contain;
    display: block;
  }
  .scroll-viewport.respectSizes .card img {
    max-height: none;
    max-width: none;
  }
  @supports (height: 100svh) {
    .card img { max-height: 65svh; }
  }
  .scroll-viewport.hasHeight .card img {
    height: 100%;
    max-height: none;
  }

  /* Mobile: show a bit more context by reducing height */
  @media (max-width: 600px) {
    .scroll-viewport.size-GG {
      width: 92vw;
      max-width: 92vw;
    }
    .scroll-viewport:not(.hasHeight) .card.fixed-size img {
      max-height: none;
      max-width: none;
    }
    /* Allow swipe with native snapping */
    .scroll-viewport {
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none; /* Firefox */
    }
    .scroll-viewport::-webkit-scrollbar { display: none; }
    .scroll-viewport .card {
      scroll-snap-align: center;
      scroll-snap-stop: always;
    }
    .scroll-viewport .card img { pointer-events: none; }
  }
  /* Reduce double-page width only on mobile */
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
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 160ms ease, visibility 160ms ease;
  }
  .auto-scroll-gallery:hover .controls,
  .auto-scroll-gallery:focus-within .controls {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
  @media (hover: none) {
    .controls {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
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
