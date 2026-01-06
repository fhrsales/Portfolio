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
  // vh per second of video when autoHeight is active (fallback mode)
  export let vhPerSecond = 80;
  // Frame-aware height: if fps > 0 and pxPerFrame > 0 and no explicit height, compute px height
  export let fps = 0; // frames per second (provide from content when known)
  export let pxPerFrame = 0; // pixels of scroll per frame (e.g., 3-6)
  // sticky offset (top), usually 0
  export let offsetTop = 0;
  // fit: 'cover' | 'contain'
  export let objectFit = 'cover';
  // If provided, easing factor for scrubbing (0..1); when omitted, scrub is immediate
  export let ease = undefined;
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
  // Optional: limit per-frame time jump when scrubbing (seconds)
  export let maxStepSec = undefined;
  // Preload mode override: 'metadata' | 'auto'
  export let preloadMode = 'metadata';

  // Consume deprecated/legacy props to avoid Svelte unused export warnings when parents pass them
  $: void windowSize;
  $: void travelVh;
  $: void speedVh;

  let containerEl; // tall wrapper
  let stickyEl; // viewport-sized sticky area
  let videoEl; // video element
  let chosenSrc = '';
  let _fallbackTried = false;
  let shouldLoad = false;
  let hasAppeared = false; // stage fade-in
  let dirUp = false; // scroll direction: true when scrolling up
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
  let _lastTarget = 0;
  let viewH = 0;
  let containerHeightPx = 0;
  let measuredFps = 0;
  let measuringFps = false;
  let _measureCancel = null;
  // Fade plateau model (no fade-out):
  // - Bottom entry: 90vh -> 65vh ramps 0 -> 1
  // - Plateau full: 65vh -> 35vh stays at 1
  // - Top entry: 10vh -> 35vh ramps 0 -> 1 (when entering from top)
  const fadeInStartVH = 94;  // bottom entry start (more down)
  const fadeInEndVH   = 74;  // bottom entry end (full sooner after entering)
  const topInStartVH  = 6;   // top entry start (closer to the top)
  const topInEndVH    = 26;  // top entry end (full sooner after entering)
  const maxOffsetPx = 14;    // max translateY at edges

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function computeProgress() {
    if (!containerEl) return 0;
    const rect = containerEl.getBoundingClientRect();
    viewH = window.innerHeight || document.documentElement.clientHeight || 0;
    containerHeightPx = rect.height;
    const total = Math.max(0, rect.height - viewH);
    const advanced = clamp01(total === 0 ? 0 : Math.min(total, -rect.top) / total);
    return advanced;
  }

  // rAF loop for smooth easing toward target progress
  let target = 0;
  function loop() {
    _raf = requestAnimationFrame(loop);
    target = externalProgress != null ? clamp01(externalProgress) : computeProgress();
    // detect direction (up when target decreases)
    dirUp = target < _lastTarget - 0.0005 ? true : target > _lastTarget + 0.0005 ? false : dirUp;
    // Immediate mapping by default (no easing) for precise scrub
    if (typeof ease === 'number' && ease >= 0 && ease < 1) {
      progress = progress + (target - progress) * clamp01(ease);
      if (Math.abs(target - progress) < 0.0005) progress = target;
    } else {
      progress = target;
    }

    if (videoEl && duration) {
      // set currentTime based on progress without playing
      try {
        const t = clamp01(progress) * duration;
        const curr = videoEl.currentTime || 0;
        if (maxStepSec && Number(maxStepSec) > 0) {
          const diff = t - curr;
          const cap = Math.abs(diff) > maxStepSec ? Math.sign(diff) * maxStepSec : diff;
          if (Math.abs(cap) > 0.0005) videoEl.currentTime = curr + cap;
        } else {
          // tiny threshold to allow frame-precise scrubbing
          if (Math.abs(curr - t) > 0.0005) videoEl.currentTime = t;
        }
      } catch {
        /* ignore */
      }
    }

    _lastTarget = target;
  }

  function onLoadedMetadata() {
    try {
      duration = videoEl?.duration || 0;
      if (!Number.isFinite(duration)) duration = 0;
      // Dynamic FPS measurement using requestVideoFrameCallback when fps not provided
      if (!fps && typeof videoEl.requestVideoFrameCallback === 'function' && !measuredFps && duration > 0) {
        measureFps();
      }
    } catch {
      duration = 0;
    }
  }

  function measureFps() {
    if (measuringFps || !videoEl) return;
    try {
      measuringFps = true;
      let frames = 0;
      let t0 = 0;
      let t1 = 0;
      const prevPaused = videoEl.paused;
      const prevTime = videoEl.currentTime || 0;
      const finish = () => {
        try { videoEl.pause(); } catch {}
        try { videoEl.currentTime = prevTime; } catch {}
        measuringFps = false;
        _measureCancel = null;
      };
      const cb = (_now, meta) => {
        const mt = meta?.mediaTime || videoEl.currentTime || 0;
        if (frames === 0) {
          t0 = mt;
        }
        frames++;
        t1 = mt;
        if (frames < 15) {
          videoEl.requestVideoFrameCallback(cb);
        }
      };
      videoEl.muted = true;
      videoEl.playbackRate = 1;
      videoEl.requestVideoFrameCallback(cb);
      videoEl.play().catch(() => {});
      // Stop after ~300ms or 15 frames
      _measureCancel = setTimeout(() => {
        const dt = Math.max(0.0001, t1 - t0);
        const f = frames > 1 ? (frames - 1) / dt : 0;
        measuredFps = Number.isFinite(f) && f > 0 ? Math.round(f) : 0;
        finish();
      }, 320);
    } catch {
      measuringFps = false;
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
    if (_measureCancel) {
      clearTimeout(_measureCancel);
      _measureCancel = null;
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
  $: computedPxHeight = (() => {
    if (height && String(height).trim()) return 0; // explicit height provided; not frame mode
    if (!autoHeight || !duration) return 0;
    const effFps = fps > 0 ? fps : (measuredFps > 0 ? measuredFps : 0);
    const effPpf = pxPerFrame > 0 ? pxPerFrame : (typeof window !== 'undefined' ? Math.max(3, Math.round((window.devicePixelRatio || 1) * 3)) : 4);
    if (effFps > 0 && effPpf > 0) {
      const frames = Math.max(1, Math.round(duration * effFps));
      const vh = (typeof window !== 'undefined') ? (window.innerHeight || document.documentElement.clientHeight || 0) : 0;
      return Math.max(vh * 2, Math.round(frames * effPpf) + vh); // include 1 viewport to scroll through contents
    }
    return 0;
  })();

  $: appliedHeight = (() => {
    if (height && String(height).trim()) return String(height).trim();
    if (computedPxHeight > 0) return `${computedPxHeight}px`;
    if (autoHeight && duration) return `${Math.max(150, Math.round(duration * vhPerSecond))}vh`;
    return '300vh';
  })();

  // Moving model tied to video fraction: a text with `at` sits exactly on the line `at` when progress == at,
  // and moves naturally with the container as the user scrolls.
  function parseVh(str) {
    const m = String(str || '').match(/([0-9.]+)\s*vh/i);
    return m ? parseFloat(m[1]) : NaN;
  }
  $: containerVh = (() => {
    const n = parseVh(appliedHeight);
    if (Number.isFinite(n)) return n;
    // if appliedHeight is px, approximate VH based on current viewport height
    if (containerHeightPx && viewH) return (containerHeightPx / viewH) * 100;
    return 300;
  })();
  $: textStates = normalizedTexts.map((item) => {
    // Compute top position in vh (within sticky viewport)
    const totalPx = Math.max(0, containerHeightPx - viewH);
    let topPx;
    if (item.top && String(item.top).trim()) {
      const m = String(item.top).match(/([0-9.]+)\s*vh/i);
      topPx = m ? (parseFloat(m[1]) / 100) * viewH : 0.5 * viewH;
    } else {
      topPx = item.at * containerHeightPx - progress * totalPx;
    }
    const topCss = `${topPx.toFixed(1)}px`;
    // convert to vh for opacity thresholds
    const topVh = viewH ? (topPx / viewH) * 100 : 50;
    // Piecewise opacity without fade-out: bottom entry ramp, plateau, top entry ramp
    let op = 0;
    if (topVh >= fadeInStartVH) {
      // below viewport: hidden
      op = 0;
    } else if (topVh > fadeInEndVH && topVh < fadeInStartVH) {
      // bottom entry ramp
      op = (fadeInStartVH - topVh) / (fadeInStartVH - fadeInEndVH);
    } else if (topVh >= topInEndVH && topVh <= fadeInEndVH) {
      // plateau full
      op = 1;
    } else if (topVh > topInStartVH && topVh < topInEndVH) {
      // top entry ramp (entering from top)
      op = (topVh - topInStartVH) / (topInEndVH - topInStartVH);
    } else if (topVh <= topInStartVH) {
      // above viewport: hidden
      op = 0;
    }
    if (op < 0) op = 0; if (op > 1) op = 1;
    // Direction-based subtle offset (up/down)
    const sign = dirUp ? -1 : 1;
    const off = (1 - op) * maxOffsetPx * sign;
    return { key: item.key, text: item.text, class: item.class, topCss, op, off, active: true };
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
        preload={shouldLoad ? preloadMode : 'none'}
        on:loadedmetadata={onLoadedMetadata}
        on:error={onVideoError}
        on:canplay={onLoadedMetadata}
        on:durationchange={onLoadedMetadata}
        style={`object-fit:${objectFit};`}
      ></video>

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
        {#each textStates as item, i (item.key)}
          {#if item.active}
            <div
              class={`overlay-text ${item.class || ''}`}
              style={`top:${item.topCss}; left:50%; transform: translate(-50%, ${item.off.toFixed(2)}px); opacity: ${item.op.toFixed(3)};`}
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
    will-change: top, opacity, transform;
    /* Common paragraph layout constraints */
    width: calc(100% - (var(--grid) * 4));
    /* Width P (~500px) */
    max-width: 500px;
  }

  /* Base style matching common paragraph, but light color */
  .overlay-text {
    color: var(--color-light);
    font-family: var(--font-primary);
    font-weight: 300;
    font-size: calc(var(--grid) * 2.2);
    line-height: 1.5;
    letter-spacing: -0.035em;
    text-align: center;
    margin: 0 auto;
    /* transform/opacity fully controlled via inline style tied to scroll */
    will-change: transform, opacity, top;
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
  /* Remove keyframes; transitions handle the entrance */
</style>
