// Publishes editor content straight to the repository through the GitHub Contents API.
// A commit on `main` triggers the existing deploy workflow.
const REPO = 'fhrsales/portfolio';
const BRANCH = 'main';
const FILE = 'src/lib/archiePages.json';
const TOKEN_KEY = 'editorGithubToken';
const API = `https://api.github.com/repos/${REPO}/contents/${FILE}`;

export function getToken() {
	try {
		return localStorage.getItem(TOKEN_KEY) || '';
	} catch {
		return '';
	}
}

export function setToken(token) {
	try {
		if (token) localStorage.setItem(TOKEN_KEY, token.trim());
		else localStorage.removeItem(TOKEN_KEY);
	} catch {
		/* storage unavailable: token lasts for this session only */
	}
}

export function encodeContent(text) {
	const bytes = new TextEncoder().encode(text);
	let binary = '';
	for (let i = 0; i < bytes.length; i += 0x8000) {
		binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
	}
	return btoa(binary);
}

export function decodeContent(base64) {
	const binary = atob(base64.replace(/\s/g, ''));
	return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

async function request(token, options = {}) {
	const response = await fetch(options.method ? API : `${API}?ref=${BRANCH}`, {
		...options,
		cache: 'no-store',
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${token}`,
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});
	if (response.status === 401 || response.status === 403) {
		throw new Error('O GitHub recusou o token. Confira se ele vale para este repositório.');
	}
	if (response.status === 409 || response.status === 422) {
		throw new Error('O conteúdo mudou no GitHub. Recarregue o editor antes de publicar.');
	}
	if (!response.ok) throw new Error(`O GitHub respondeu com erro ${response.status}.`);
	return response.json();
}

// Returns the pages as they are on `main` now, plus the sha needed to update them.
export async function fetchPages(token) {
	const file = await request(token);
	return { pages: JSON.parse(decodeContent(file.content)), sha: file.sha };
}

// Commits the pages; fails if `sha` is no longer the latest version of the file.
export async function publishPages(token, pages, sha, message) {
	const result = await request(token, {
		method: 'PUT',
		body: JSON.stringify({
			message,
			branch: BRANCH,
			sha,
			content: encodeContent(JSON.stringify(pages, null, 2) + '\n')
		})
	});
	return result.content.sha;
}
