// Image parsing helpers

export function parseImageObject(input) {
	if (!input || typeof input !== 'object') {
		return {
			nome: '',
			tamanho: 'M',
			legenda: '',
			classes: '',
			radius: '',
			tags: [],
			multiply: false
		};
	}
	let obj = input;
	if (obj.imagem && typeof obj.imagem === 'object') obj = obj.imagem;
	const nome = obj.nome || obj.name || '';
	const tamanho = (obj.tamanho || obj.size || 'M').toString().toUpperCase();
	const legenda = obj.legenda || obj.caption || obj.legend || '';
	const classes = Array.isArray(obj.classes) ? obj.classes.join(' ') : obj.classes || '';
	const tags = Array.isArray(obj.tags)
		? obj.tags.map((t) => String(t).trim().toLowerCase())
		: typeof obj.tags === 'string'
			? obj.tags
					.split(',')
					.map((t) => t.trim().toLowerCase())
					.filter(Boolean)
			: [];
	const multiply = obj.multiply || obj.multiplay || obj.mix || false;
	const borda = obj.borda || obj.radius || obj.raio || obj.border || '';
	return { nome, tamanho, legenda, classes, radius: borda || '', tags, multiply };
}

export function parseImageLine(line) {
	if (typeof line !== 'string') return parseImageObject(line);
	const rest = line.trim().replace(/^imagem:\s*/i, '');
	const parts = rest
		.split(',')
		.map((p) => p.trim())
		.filter(Boolean);
	const nome = parts[0] || '';
	let tamanho = 'M';
	let legenda = '';
	let radius = '';
	const classLike = [];
	const tags = [];
	for (let i = 1; i < parts.length; i++) {
		const p = parts[i];
		if (!p) continue;
		if (i === 1 && /^(?:P{1,2}|M|G|GG)$/i.test(p)) {
			tamanho = p.toUpperCase();
			continue;
		}
		if (/^\d+(?:\.\d+)?(?:[a-z%]+)?$/i.test(p)) {
			radius = /^\d+$/.test(p) ? p + 'px' : p;
			continue;
		}
		// if caption not yet set, treat this entire part as caption (don't split)
		if (!legenda) {
			legenda = p;
			continue;
		}
		// otherwise interpret remaining parts as space-separated class-like tokens
		const tokens = p.split(/\s+/).filter(Boolean);
		for (const t of tokens) {
			if (/^var\(|^--[\w-]+$/.test(t)) {
				classLike.push(t);
			} else if (/^shadow[-_\w]*$/i.test(t) || /^[\w-]+$/.test(t)) {
				if (/multiply/i.test(t) || /var\(|--/.test(t)) classLike.push(t);
				else {
					classLike.push(t);
					tags.push(t.toLowerCase());
				}
			}
		}
	}
	const classes = classLike.join(' ');
	return { nome, tamanho, legenda, classes, radius, tags };
}

export function parseImage(any) {
	return typeof any === 'string' ? parseImageLine(any) : parseImageObject(any);
}
