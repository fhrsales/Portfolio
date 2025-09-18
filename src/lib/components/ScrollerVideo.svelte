<script>
  import { onMount, onDestroy } from 'svelte';

  // Props
  export let src = '';
  export let srcMobile = '';
  export let srcDesktop = '';
  // texts: [{ at: 0.2, text: '...', class: 'classe1' }]
  export let texts = [];
  // show guideline bar with ticks 0..1
  export let showGuide = true;
  // container size: 'P' | 'M' | 'G' | 'GG'
  export let size = 'M';
  // total scroll height (string), e.g. '300vh'. If empty, computed from duration
  export let height = '';
  // when height is not provided, compute proportional to video duration
  export let autoHeight = true;
  // vh per second of video when autoHeight is active
  export let vhPerSecond = 80;
  // sticky offset (top), usually 0
  export let offsetTop = 0;
  // fit: 'cover' | 'contain'
  export let objectFit = 'cover';
  // easing factor for scrubbing (0..1), 1 = immediate
  export let ease = 0.2;
  // whether to pin the viewport (sticky)
  export let pin = true;
  // overlay vertical alignment preserved for compatibility (unused in new flow)
  export let overlayVAlign = 'center';
  // vignette layer to enhance readability
  export let showVignette = true;
  // legacy animation controls are no longer used in the new model
  export let windowSize = 0.25; // deprecated
  export let travelVh = 80; // deprecated
  // Optional: progress from external scrolly lib (0..1)
  export let externalProgress = null;
  // Speed of text crossing in vh per unit progress (default 100vh)
  export let speedVh = 100; // used only in moving-text mode (when no fixed top)

  let containerEl; // tall wrapper
  let stickyEl; // viewport-sized sticky area
  let videoEl; // video element
  let chosenSrc = '';
  let _fallbackTried = false;
  let shouldLoad = false;
  let hasAppeared = false;
  $: sizeClass =
    size === 'GG'
      ? 'scroller-gg'
      : size === 'G'
      ? 'scroller-g'
      : size === 'P'
      ? 'scroller-p'
      : 'scroller-m';
  let duration = 0;
  let progress = 0; // 0..1 scroll progress
  let _raf = 0;
  let _scrollBind = null;

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function computeProgress() {
    if (!containerEl) return 0;
    const rect = containerEl.getBoundingClientRect();
    const viewH = window.innerHeight || document.documentElement.clientHeight || 0;
    const total = Math.max(0, rect.height - viewH);
    const advanced = clamp01(total === 0 ? 0 : Math.min(total, -rect.top) / total);
    return advanced;
  }

  // rAF loop for smooth easing toward target progress
  let target = 0;
  function loop() {
    _raf = requestAnimationFrame(loop);
    target = externalProgress != null ? clamp01(externalProgress) : computeProgress();
    if (ease >= 1) {
      progress = target;
    } else {
      // simple exponential smoothing
      progress = progress + (target - progress) * clamp01(ease);
      // snap when close to target to avoid jitter
      if (Math.abs(target - progress) < 0.0005) progress = target;
    }

    if (videoEl && duration) {
      // set currentTime based on progress without playing
      try {
        const t = clamp01(progress) * duration;
        if (Math.abs((videoEl.currentTime || 0) - t) > 0.02) {
          videoEl.currentTime = t;
        }
      } catch {
        /* ignore */
      }
    }
  }

  function onLoadedMetadata() {
    try {
      duration = videoEl?.duration || 0;
      if (!Number.isFinite(duration)) duration = 0;
    } catch {
      duration = 0;
    }
  }

  function onVideoError() {
    if (!videoEl) return;
    // Try fallback: if we chose desktop and it failed, try mobile, then base src
    if (_fallbackTried) return;
    _fallbackTried = true;
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const candidates = [];
    if (!isMobile && srcMobile) candidates.push(srcMobile);
    if (isMobile && srcDesktop) candidates.push(srcDesktop);
    if (src) candidates.push(src);
    for (const cand of candidates) {
      if (cand && cand !== chosenSrc) {
        try {
          chosenSrc = cand;
          videoEl.src = chosenSrc;
          videoEl.load();
          break;
        } catch {}
      }
    }
  }

  // Pick mobile/desktop video source
  function pickSourceForViewport() {
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const next = isMobile ? (srcMobile || src || srcDesktop) : (srcDesktop || src || srcMobile);
    if (next && next !== chosenSrc) {
      chosenSrc = next;
      if (videoEl) {
        const t = videoEl.currentTime || 0;
        try { videoEl.src = chosenSrc; } catch {}
        // try keep position (best-effort)
        videoEl.addEventListener('loadedmetadata', () => {
          try { videoEl.currentTime = Math.min(t, videoEl.duration || t); } catch {}
        }, { once: true });
        try { videoEl.load(); } catch {}
      }
    }
  }

  onMount(() => {
    // Start RAF loop when mounted
    _raf = requestAnimationFrame(loop);
    // Lazy-load: only pick and set src when near viewport
    try {
      const io = new IntersectionObserver((entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            shouldLoad = true;
            pickSourceForViewport();
            obs.disconnect();
            break;
          }
        }
      }, { root: null, rootMargin: '400px', threshold: 0 });
      if (containerEl) io.observe(containerEl);
    } catch {
      shouldLoad = true;
      pickSourceForViewport();
    }
    // Appear observer: fade from 0 -> 1 when sticky stage enters viewport
    try {
      const appear = new IntersectionObserver((entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            hasAppeared = true;
            obs.disconnect();
            break;
          }
        }
      }, { root: null, threshold: 0.01 });
      if (stickyEl) appear.observe(stickyEl);
    } catch {}
    _scrollBind = () => {
      // nudge loop by reading progress; loop will pick the new target
      target = computeProgress();
    };
    window.addEventListener('scroll', _scrollBind, { passive: true });
    window.addEventListener('resize', _scrollBind);
    window.addEventListener('resize', () => { if (shouldLoad) pickSourceForViewport(); });
  });

  onDestroy(() => {
    if (_raf) cancelAnimationFrame(_raf);
    if (_scrollBind) {
      window.removeEventListener('scroll', _scrollBind);
      window.removeEventListener('resize', _scrollBind);
    }
  });

  // derive active texts based on progress
  $: normalizedTexts = Array.isArray(texts)
    ? texts
        .map((t, i) => {
          let at = 0;
          let text = '';
          let klass = '';
          let top = '';
          if (typeof t === 'string') {
            // accept "0.2, some text, class"
            const parts = t.split(',').map((s) => s.trim());
            at = parseFloat(parts[0]) || 0;
            text = parts[1] || '';
            // third part may be class or top spec
            if (parts[2]) {
              const p = parts[2];
              const m = p.match(/^top\s*[:=]\s*([0-9.]+)(vh|%)?$/i);
              if (m) {
                const val = parseFloat(m[1]) || 0;
                top = `${val}${m[2] || 'vh'}`;
              } else {
                klass = p;
              }
            }
            // fourth part optional explicit top
            if (parts[3]) {
              const q = parts[3];
              const m2 = q.match(/^top\s*[:=]\s*([0-9.]+)(vh|%)?$/i);
              if (m2) {
                const val = parseFloat(m2[1]) || 0;
                top = `${val}${m2[2] || 'vh'}`;
              }
            }
          } else {
            at = Number(t.at || t.when || t.p || t.pos || 0);
            text = String(t.text || t.value || t.t || '');
            klass = String(t.class || t.klass || t.k || '');
            if (t.top != null) {
              if (typeof t.top === 'number') top = `${t.top}vh`;
              else if (typeof t.top === 'string') top = t.top.trim();
            }
          }
          return { at: clamp01(at), text, class: klass, top, key: i };
        })
        .sort((a, b) => a.at - b.at)
    : [];

  // computed container height
  $: appliedHeight = height && String(height).trim()
    ? String(height).trim()
    : autoHeight && duration
    ? `${Math.max(150, Math.round(duration * vhPerSecond))}vh`
    : '300vh';

  // Moving model tied to video fraction: a text with `at` sits exactly on the line `at` when progress == at,
  // and moves naturally with the container as the user scrolls.
  function parseVh(str) {
    const m = String(str || '').match(/([0-9.]+)\s*vh/i);
    return m ? parseFloat(m[1]) : NaN;
  }
  $: containerVh = (() => {
    const n = parseVh(appliedHeight);
    return Number.isFinite(n) ? n : 300;
  })();
  $: textStates = normalizedTexts.map((item) => {
    // If explicit top provided, use it (fixed). Otherwise compute viewport position for this fraction
    if (item.top && String(item.top).trim()) {
      return { key: item.key, text: item.text, class: item.class, topCss: item.top, active: true };
    }
    const total = Math.max(0, containerVh - 100);
    const topCss = `${(item.at * containerVh - progress * total).toFixed(3)}vh`;
    return { key: item.key, text: item.text, class: item.class, topCss, active: true };
  });

  $: overlayClass = `scroller-video__overlay overlay--${overlayVAlign === 'top' ? 'top' : overlayVAlign === 'bottom' ? 'bottom' : 'center'}`;

  // Guide ticks (fractions only)
  $: guideTicks = Array.from({ length: 11 }, (_, i) => ({ ratio: i / 10 }));
</script>

<section class={`scroller-video ${sizeClass}`} bind:this={containerEl} style={`height:${appliedHeight};`}>
  <div
    class="scroller-video__sticky"
    bind:this={stickyEl}
    style={pin ? `position: sticky; top: ${offsetTop}px;` : ''}
  >
    <div class="scroller-video__stage" class:visible={hasAppeared}>
      <video
        bind:this={videoEl}
        src={shouldLoad ? (chosenSrc || src || undefined) : undefined}
        playsinline
        muted
        preload={shouldLoad ? 'metadata' : 'none'}
        on:loadedmetadata={onLoadedMetadata}
        on:error={onVideoError}
        on:canplay={onLoadedMetadata}
        on:durationchange={onLoadedMetadata}
        style={`object-fit:${objectFit};`}
      />

      {#if showGuide}
        <div class="scroller-video__guide">
          {#each guideTicks as g, i (i)}
            {@const total = Math.max(0, containerVh - 100)}
            <div class="tick" style={`top:${(g.ratio * containerVh - progress * total).toFixed(3)}vh`}>
              <span class="tick__line"></span>
              <span class="tick__label">{g.ratio.toFixed(1)}</span>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Overlay texts -->
      {#if showVignette}
        <div class="scroller-video__vignette" class:visible={hasAppeared}></div>
      {/if}
      <div class="scroller-video__overlay" class:visible={hasAppeared}>
        {#each textStates as item (item.key)}
          {#if item.active}
            <div
              class={`overlay-text ${item.class || ''}`}
              style={`top:${item.topCss};`}
            >{@html item.text}</div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .scroller-video {
    width: 100%;
    position: relative;
  }
  /* width presets */
  .scroller-video.scroller-p { max-width: 500px; margin: calc(var(--grid) * 4) auto; }
  .scroller-video.scroller-m { max-width: 620px; margin: calc(var(--grid) * 4) auto; }
  .scroller-video.scroller-g { max-width: 860px; margin: calc(var(--grid) * 4) auto; }
  .scroller-video.scroller-gg { margin: calc(var(--grid) * 4) auto; }
  .scroller-video__sticky {
    height: 100vh;
    width: 100%;
  }
  .scroller-video__stage {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 0;
    transition: opacity 480ms ease;
  }
  .scroller-video__stage.visible { opacity: 1; }
  .scroller-video__stage > video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  /* Guide */
  .scroller-video__guide {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 3;
    pointer-events: none;
  }
  .tick {
    position: absolute;
    left: 0;
    right: 0;
  }
  .tick__line {
    display: block;
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.35);
    background: color-mix(in srgb, var(--color-danger) 80%, transparent);
    margin-left: 40px;
  }
  .tick__label {
    position: absolute;
    left: 8px;
    top: -10px;
    font-size: 15px;
    color: color-mix(in srgb, var(--color-danger) 80%, transparent);
    text-shadow: 0 1px 2px rgba(0,0,0,0.25);
  }

  /* Readability vignette */
  .scroller-video__vignette {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    /* background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.55),
        rgba(0, 0, 0, 0.15) 20%,
        rgba(0, 0, 0, 0.15) 80%,
        rgba(0, 0, 0, 0.6)
      ); */
    opacity: 0;
    transition: opacity 480ms ease;
  }
  .scroller-video__vignette.visible { opacity: 1; }

  /* Overlay texts */
  .scroller-video__overlay {
    position: absolute;
    inset: 0;
    z-index: 4;
    padding: 24px;
    opacity: 0;
    transition: opacity 480ms ease 80ms;
  }
  .scroller-video__overlay.visible { opacity: 1; }
  .scroller-video__overlay > .overlay-text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    will-change: top;
  }

  .overlay-text {
    color: #fff;
    font-size: clamp(18px, 4vw, 48px);
    line-height: 1.1;
    text-align: center;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
    animation: overlay-in 380ms ease both;
  }
  .overlay-text + .overlay-text { margin-top: 12px; }

  /* Apple-like presets */
  .overlay-text.headline {
    font-weight: 800;
    font-size: clamp(32px, 8vw, 88px);
    letter-spacing: -0.02em;
  }
  .overlay-text.sub {
    font-weight: 500;
    font-size: clamp(16px, 3vw, 28px);
    opacity: 0.92;
  }
  .overlay-text.destaque {
    display: inline-block;
    padding: 8px 14px;
    border-radius: 999px;
    background: color-mix(in srgb, #000 38%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-primary, #fff) 25%, transparent);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06);
    backdrop-filter: saturate(120%) blur(2px);
  }
  @keyframes overlay-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
