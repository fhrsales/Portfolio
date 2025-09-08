// Video parsing helpers

export function parseVideoObject(input) {
	if (!input || typeof input !== 'object') {
		return { nome: '', tamanho: 'M', legenda: '', classes: '', radius: '', tags: [] };
	}
	let obj = input.video && typeof input.video === 'object' ? input.video : input;
	const nome = obj.nome || obj.name || '';
	const tamanho = (obj.tamanho || obj.size || 'M').toString().toUpperCase();
	const legenda = obj.legenda || obj.caption || '';
	const classes = Array.isArray(obj.classes) ? obj.classes.join(' ') : obj.classes || '';
	// Aceita tags como array, string separada por vírgula, ou string única
	let tags = [];
	if (Array.isArray(obj.tags)) {
		tags = obj.tags.map((t) => String(t).trim()).filter(Boolean);
	} else if (typeof obj.tags === 'string') {
		tags = obj.tags
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
	} else if (typeof obj.tags === 'object' && obj.tags !== null) {
		tags = Object.values(obj.tags)
			.map((t) => String(t).trim())
			.filter(Boolean);
	}
	const radius = obj.borda || obj.radius || '';
	return { nome, tamanho, legenda, classes, radius, tags };
}

export function parseVideoLine(line) {
	if (typeof line !== 'string') return parseVideoObject(line);
	const rest = line.trim().replace(/^video:\s*/i, '');
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
		// first unrecognized part is caption; subsequent are class-like tokens
		if (!legenda) {
			legenda = p;
			continue;
		}
		const tokens = p.split(/\s+/).filter(Boolean);
		for (const t of tokens) {
			if (/^var\(|^--[\w-]+$/.test(t)) classLike.push(t);
			else if (/^shadow[-_\w]*$/i.test(t) || /^[\w-]+$/.test(t)) {
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

export function parseVideo(any) {
	return typeof any === 'string' ? parseVideoLine(any) : parseVideoObject(any);
}
