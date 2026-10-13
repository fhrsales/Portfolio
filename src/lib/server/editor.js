import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

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

// Commit everything that changed in the project and push it; the push starts the site's deploy.
// With { dryRun: true } it only reports what would go.
export function publishProject(root, { message, dryRun } = {}) {
	const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trimEnd();
	const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
	const files = git('status', '--porcelain').split('\n').filter(Boolean).map(line => line.slice(3));
	const ahead = Number(git('rev-list', '--count', `origin/${branch}..HEAD`));
	if (dryRun) return { branch, files, ahead };
	if (branch !== 'main') throw new Error(`O projeto está no ramo "${branch}". A publicação sai do ramo main.`);
	if (!files.length && !ahead) throw new Error('Nada novo para publicar.');
	if (files.length) {
		git('add', '-A');
		git('commit', '-m', String(message || '').trim().slice(0, 200) || 'editor: update site');
	}
	try {
		git('push', 'origin', branch);
	} catch (error) {
		throw new Error('O commit foi feito, mas o envio ao GitHub falhou: ' + String(error.stderr || error.message).trim().split('\n').pop());
	}
	return { branch, files, commit: git('rev-parse', '--short', 'HEAD'), sha: git('rev-parse', 'HEAD') };
}

// Where the deploy of a pushed commit stands: the build workflow first, then the GitHub Pages one it triggers.
export function deployStatus(root, { sha } = {}) {
	if (!/^[0-9a-f]{40}$/.test(sha || '')) throw new Error('Commit inválido.');
	const runs = (...args) => JSON.parse(execFileSync('gh', ['run', 'list', '--limit', '1', '--json', 'status,conclusion,createdAt,url', ...args],
		{ cwd: root, encoding: 'utf8' }));
	const [build] = runs('--workflow', 'deploy.yml', '--commit', sha);
	if (!build) return { state: 'waiting' };
	if (build.status !== 'completed') return { state: 'building', url: build.url };
	if (build.conclusion !== 'success') return { state: 'failed', url: build.url, conclusion: build.conclusion };
	const [pages] = runs('--workflow', 'pages-build-deployment');
	if (!pages || pages.createdAt < build.createdAt || pages.status !== 'completed') return { state: 'deploying', url: build.url };
	if (pages.conclusion !== 'success') return { state: 'failed', url: pages.url, conclusion: pages.conclusion };
	return { state: 'published', url: build.url };
}

export function editorSave() {
	return {
		name: 'local-editor-save',
		apply: 'serve',
		configureServer(server) {
			for (const [route, file, save] of [
				['save', 'src/lib/archiePages.json', savePage],
				['samples', 'static/imgs/samples/manifest.json', saveSamples],
				['publish', '', publishProject],
				['deploy', '', deployStatus]
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
						const data = save(file ? `${server.config.root}/${file}` : server.config.root, JSON.parse(body));
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
