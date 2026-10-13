// Entrances are tied to the scroll position with CSS (animation-timeline: view()).
// Where the browser cannot do that, this action plays them once, when the element comes into view:
// it marks <html> with `reveal-fallback` and the element with `revealed`.
let fallback;
let io;

function needsFallback() {
	if (fallback !== undefined) return fallback;
	fallback =
		typeof window !== 'undefined' &&
		'IntersectionObserver' in window &&
		!(window.CSS && CSS.supports('animation-timeline: view()')) &&
		!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (fallback) document.documentElement.classList.add('reveal-fallback');
	return fallback;
}

export function reveal(node) {
	if (!needsFallback()) return {};
	io ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add('revealed');
				io.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -12% 0px', threshold: 0 }
	);
	io.observe(node);
	return { destroy: () => io.unobserve(node) };
}
