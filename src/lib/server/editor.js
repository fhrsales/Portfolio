import { readFileSync, writeFileSync, renameSync } from 'node:fs';

export function savePage(file, { page, data, original }) {
	if (!/^[a-z0-9][a-z0-9_-]*$/i.test(page || '') || page === '__nova__' ||
		!data || typeof data.content !== 'string' || typeof data.menuLabel !== 'string' || typeof data.showInMenu !== 'boolean') {
		throw new Error('Página inválida.');
	}
	const pages = JSON.parse(readFileSync(file, 'utf8'));
	if (JSON.stringify(pages[page]) !== JSON.stringify(original)) {
		throw new Error('Esta página mudou no arquivo. Recarregue o editor antes de salvar.');
	}
	const updated = { ...pages[page], ...data };
	if (JSON.stringify(pages[page]) === JSON.stringify(updated)) return updated;
	pages[page] = updated;
	const temporary = `${file}.tmp`;
	writeFileSync(temporary, JSON.stringify(pages, null, 2) + '\n');
	renameSync(temporary, file);
	return pages[page];
}

export function saveSamples(file, { original, hiddenIds, dates = {} }) {
	const manifest = JSON.parse(readFileSync(file, 'utf8'));
	if (JSON.stringify(manifest) !== JSON.stringify(original)) throw new Error('A seleção mudou. Recarregue o índice antes de salvar.');
	const ids = new Set(manifest.files.map(item => item.id));
	if (!Array.isArray(hiddenIds) || new Set(hiddenIds).size !== hiddenIds.length || hiddenIds.some(id => !ids.has(id))) throw new Error('Seleção inválida.');
	if (!dates || typeof dates !== 'object' || Array.isArray(dates) || Object.entries(dates).some(([id, date]) =>
		!ids.has(id) || typeof date !== 'string' || (date !== '' && (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
		!Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)))) throw new Error('Data inválida.');
	for (const item of manifest.files) {
		if (Object.hasOwn(dates, item.id) && dates[item.id] !== (item.date || '')) {
			if (dates[item.id]) item.date = dates[item.id];
			else delete item.date;
			delete item.dateSource;
		}
		if (hiddenIds.includes(item.id)) item.hidden = true;
		else delete item.hidden;
	}
	const publications = [...new Set(manifest.files.map(item => item.publication))];
	manifest.files.sort((a, b) => publications.indexOf(a.publication) - publications.indexOf(b.publication) ||
		(a.date || '9999').localeCompare(b.date || '9999'));
	// Keep editorial sequences together after sorting their dates.
	const grouped = new Set();
	manifest.files = manifest.files.flatMap(item => {
		if (!item.group) return [item];
		const key = `${item.publication}:${item.group}`;
		if (grouped.has(key)) return [];
		grouped.add(key);
		return manifest.files.filter(other => other.publication === item.publication && other.group === item.group);
	});
	if (JSON.stringify(manifest) !== JSON.stringify(original)) {
		writeFileSync(`${file}.tmp`, JSON.stringify(manifest, null, 2) + '\n');
		renameSync(`${file}.tmp`, file);
	}
	return manifest;
}

export function editorSave() {
	return {
		name: 'local-editor-save',
		apply: 'serve',
		configureServer(server) {
			for (const [route, file, save] of [
				['save', 'src/lib/archiePages.json', savePage],
				['samples', 'static/imgs/samples/manifest.json', saveSamples]
			]) server.middlewares.use(`/__editor/${route}`, (req, res) => {
				res.setHeader('Content-Type', 'application/json');
				if (req.method !== 'POST' || req.headers.origin !== `http://${req.headers.host}` ||
					!req.headers['content-type']?.startsWith('application/json')) {
					res.statusCode = 403;
					res.end(JSON.stringify({ error: 'Requisição não permitida.' }));
					return;
				}
				let body = '';
				req.on('data', chunk => {
					body += chunk;
					if (body.length > 2_000_000) req.destroy();
				});
				req.on('end', () => {
					try {
						const data = save(`${server.config.root}/${file}`, JSON.parse(body));
						res.end(JSON.stringify({ data }));
					} catch (error) {
						res.statusCode = 400;
						res.end(JSON.stringify({ error: error.message }));
					}
				});
			});
		}
	};
}
