<script>
  import { onMount, onDestroy } from 'svelte';
  import { base } from '$app/paths';

  let sectionEl;
  let videoEl;
  let duration = 0;
  let progress = 0;
  let raf = 0;

  function clamp(v, min = 0, max = 1) {
    return Math.max(min, Math.min(max, v));
  }

  function update() {
    if (!sectionEl) return;
    const rect = sectionEl.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const travel = Math.max(1, rect.height - vh);
    progress = clamp(-rect.top / travel);
    if (videoEl && duration > 0) {
      const target = progress * Math.max(0, duration - 0.04);
      if (Math.abs((videoEl.currentTime || 0) - target) > 0.015) {
        try { videoEl.currentTime = target; } catch {}
      }
    }
    raf = requestAnimationFrame(update);
  }

  function captionOpacity(center, width = 0.18) {
    const d = Math.abs(progress - center);
    return clamp(1 - d / width);
  }

  onMount(() => {
    const onMeta = () => {
      duration = Number.isFinite(videoEl?.duration) ? videoEl.duration : 0;
      try { videoEl.currentTime = 0.01; } catch {}
    };
    videoEl?.addEventListener('loadedmetadata', onMeta);
    videoEl?.load();
    raf = requestAnimationFrame(update);
    return () => videoEl?.removeEventListener('loadedmetadata', onMeta);
  });

  onDestroy(() => {
    if (raf) cancelAnimationFrame(raf);
  });
</script>

<section class="tapui-scrolly" bind:this={sectionEl}>
  <div class="sticky-stage">
    <video
      bind:this={videoEl}
      src={`${base}/videos/tapui-scrolly.mp4`}
      muted
      playsinline
      preload="auto"
      aria-label="Tapuiassauro reconstruction sequence"
    ></video>
    <div class="scrim"></div>

    <div class="caption caption-a" style={`opacity:${captionOpacity(0.16)}`}>
      <strong>A few fragments are evidence.<br />Not an image.</strong>
    </div>
    <div class="caption caption-b" style={`opacity:${captionOpacity(0.50)}`}>
      <strong>Design connects what science knows<br />with what people can understand.</strong>
    </div>
    <div class="caption caption-c" style={`opacity:${captionOpacity(0.84)}`}>
      <strong>The reconstruction becomes<br />a hypothesis you can see.</strong>
    </div>

    <div class="progress" aria-hidden="true"><span style={`transform:scaleX(${progress})`}></span></div>
  </div>
</section>

<style>
  .tapui-scrolly {
    position: relative;
    width: 100%;
    height: 330vh;
    margin: calc(var(--grid) * 5) 0 calc(var(--grid) * 8);
  }
  .sticky-stage {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #101010;
  }
  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #101010;
  }
  .scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.04) 45%, rgba(0,0,0,.42));
    pointer-events: none;
  }
  .caption {
    position: absolute;
    left: 50%;
    bottom: 10vh;
    transform: translateX(-50%);
    width: min(900px, calc(100% - 40px));
    text-align: center;
    color: #fff;
    font-family: var(--font-primary);
    font-size: clamp(2rem, 6vw, 5.5rem);
    line-height: .98;
    letter-spacing: -.045em;
    text-shadow: 0 2px 24px rgba(0,0,0,.45);
    transition: opacity 80ms linear;
    pointer-events: none;
  }
  .progress {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 20px;
    height: 2px;
    background: rgba(255,255,255,.22);
    overflow: hidden;
  }
  .progress span {
    display: block;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,.92);
    transform-origin: left center;
  }
  @media (max-width: 768px) {
    .tapui-scrolly { height: 300vh; }
    .caption { bottom: 12vh; font-size: clamp(2rem, 10vw, 4rem); }
  }
</style>
