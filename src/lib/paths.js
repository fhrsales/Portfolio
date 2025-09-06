// Lightweight path helpers. Prefer passing `base` explicitly from Svelte.

export function withBase(path, base = '') {
	if (!path) return path;
	const p = String(path);
	const b = base || '';
	if (!b) return p; // dev or root
	if (p.startsWith(b)) return p;
	if (p.startsWith('/')) return `${b}${p}`;
	return `${b}/${p}`;
}
