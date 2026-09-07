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

export function editorSave() {
	return {
		name: 'local-editor-save',
		apply: 'serve',
		configureServer(server) {
			server.middlewares.use('/__editor/save', (req, res) => {
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
						const data = savePage(`${server.config.root}/src/lib/archiePages.json`, JSON.parse(body));
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
