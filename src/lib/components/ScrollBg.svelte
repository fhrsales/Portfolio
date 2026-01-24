<script>
    import { onMount, onDestroy } from 'svelte';
    export let color = '';
    export let height = '';
    export let intro = false;
    let el;

    // Shared registry to choose the closest marker to viewport center
    const registry = (typeof window !== 'undefined') ? (window.__scrollBgRegistry ||= {
        items: [],
        listening: false,
        schedule: null,
        apply() {
        const viewH = window.innerHeight || document.documentElement.clientHeight || 0;
        const center = viewH * 0.5;
        let best = null;
        for (const it of this.items) {
            if (!it.visible) continue;
            const r = it.el.getBoundingClientRect();
            const mid = (r.top + r.bottom) / 2;
            const d = Math.abs(mid - center);
            if (!best || d < best.d) best = { it, d };
        }
        if (best) {
            const c = best.it.color || 'var(--color-light)';
            document.body.style.setProperty('--body-bg', c.startsWith('var(') ? c : c);
        } else {
            document.body.style.setProperty('--body-bg', 'var(--color-light)');
        }
        },
        requestApply() {
        if (this.schedule) return;
        this.schedule = requestAnimationFrame(() => {
            this.schedule = null;
            this.apply();
        });
        },
        ensureListeners() {
        if (this.listening) return;
        window.addEventListener('scroll', () => this.requestApply(), { passive: true });
        window.addEventListener('resize', () => this.requestApply(), { passive: true });
        this.listening = true;
        }
    }) : null;

    let io;
    onMount(() => {
        if (!registry) return;
        const item = { el, color, visible: false };
        registry.items.push(item);
        registry.ensureListeners();
        try {
        io = new IntersectionObserver((entries) => {
            for (const e of entries) {
            if (e.target === el) {
                item.visible = e.isIntersecting;
            }
            }
            registry.requestApply();
        }, { root: null, threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] });
        io.observe(el);
        } catch {
        // fallback: always apply on mount
        item.visible = true;
        registry.requestApply();
        }
        // Initial
        registry.requestApply();
        return () => {
        if (io) io.disconnect();
        const idx = registry.items.indexOf(item);
        if (idx >= 0) registry.items.splice(idx, 1);
        registry.requestApply();
        };
    });
    onDestroy(() => {});
</script>

<div
    class="scroll-bg-marker"
    bind:this={el}
    aria-hidden="true"
    data-intro={intro ? 'true' : undefined}
    style={`height:${height ? height : '1px'};`}
></div>

<style>
    .scroll-bg-marker {
        height: 1px;
        width: 100%;
        opacity: 0;
        pointer-events: none;
    }
</style>
