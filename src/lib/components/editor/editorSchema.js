// What the editor knows about the content notation: blocks, their usual keys,
// starter snippets, and helpers to read the text as structure.

const SIZES = ['PP', 'P', 'M', 'G', 'GG'];
const YES_NO = ['sim', 'nao'];

export const BLOCKS = {
	imagem: {
		label: 'Imagem',
		keys: ['nome', 'tamanho', 'alt', 'legenda', 'borda', 'classes', 'tags'],
		snippet: '{imagem}\n  nome: arquivo.png\n  tamanho: M\n  alt: \n  tags: \n{}'
	},
	video: {
		label: 'Vídeo',
		keys: ['nome', 'tamanho', 'legenda', 'borda', 'classes', 'tags'],
		snippet: '{video}\n  nome: arquivo.mp4\n  tamanho: M\n  tags: \n{}'
	},
	scrollerVideo: {
		label: 'Vídeo de scroll',
		keys: [
			'video',
			'video-mobile',
			'video-desktop',
			'tamanho',
			'fixar',
			'altura',
			'proporcao',
			'fit',
			'top',
			'fps',
			'guia',
			'vinheta',
			'preload',
			'borda',
			'intro-title',
			'intro-text',
			'fundir',
			'tags'
		],
		snippet:
			'{scrollerVideo}\n  video: arquivo.mp4\n  tamanho: G\n  fixar: sim\n  altura: 300vh\n  proporcao: 16 / 9\n  fit: contain\n  guia: nao\n  vinheta: nao\n{}'
	},
	slider: {
		label: 'Galeria',
		keys: [
			'pasta',
			'publicacao',
			'tamanho',
			'tempo',
			'espaco',
			'padding',
			'altura',
			'fundo',
			'auto',
			'classes',
			'tags'
		],
		snippet:
			'{slider}\n  pasta: samples\n  tamanho: GG\n  tempo: 3\n  espaco: 32px\n  padding: 40px\n{}'
	},
	carrossel: {
		label: 'Carrossel',
		keys: ['pasta', 'tamanho', 'tempo', 'fade', 'classes', 'tags'],
		snippet: '{carrossel}\n  pasta: pasta-das-imagens\n  tempo: 6s\n  fade: 1.5s\n  tamanho: G\n{}'
	},
	imagemTexto: {
		label: 'Imagem + texto',
		keys: ['imagem', 'alt', 'chapeu', 'titulo', 'texto', 'lado', 'classes', 'tags'],
		snippet:
			'{imagemTexto}\n  imagem: arquivo.png\n  alt: \n  chapeu: \n  titulo: \n  texto: \n  tags: \n{}'
	},
	abertura: {
		label: 'Abertura',
		keys: ['chapeu', 'titulo', 'texto', 'numero_1', 'numero_2', 'numero_3', 'numero_4'],
		snippet: '{abertura}\n  chapeu: \n  titulo: \n  texto: \n  numero_1: valor | legenda\n{}'
	},
	telas: {
		label: 'Telas com rolagem',
		keys: [
			'pasta',
			'imagem_1',
			'chapeu_1',
			'titulo_1',
			'texto_1',
			'imagem_2',
			'chapeu_2',
			'titulo_2',
			'texto_2',
			'imagem_3',
			'chapeu_3',
			'titulo_3',
			'texto_3',
			'imagem_4',
			'chapeu_4',
			'titulo_4',
			'texto_4',
			'imagem_5',
			'chapeu_5',
			'titulo_5',
			'texto_5',
			'imagem_6',
			'chapeu_6',
			'titulo_6',
			'texto_6',
			'imagem_7',
			'chapeu_7',
			'titulo_7',
			'texto_7',
			'imagem_8',
			'chapeu_8',
			'titulo_8',
			'texto_8',
			'imagem_9',
			'chapeu_9',
			'titulo_9',
			'texto_9',
			'imagem_10',
			'chapeu_10',
			'titulo_10',
			'texto_10'
		],
		snippet:
			'{telas}\n  pasta: \n  imagem_1: tela.jpg\n  chapeu_1: \n  titulo_1: \n  texto_1: \n  imagem_2: tela.jpg\n  titulo_2: \n  texto_2: \n{}'
	},
	faixa: {
		label: 'Faixa de imagens',
		keys: [
			'pasta',
			'tempo',
			'imagem_1',
			'imagem_2',
			'imagem_3',
			'imagem_4',
			'imagem_5',
			'imagem_6',
			'imagem_7',
			'imagem_8',
			'imagem_9',
			'imagem_10',
			'imagem_11',
			'imagem_12',
			'imagem_13',
			'imagem_14',
			'imagem_15',
			'imagem_16'
		],
		snippet:
			'{faixa}\n  pasta: \n  imagem_1: arquivo.jpg | descrição\n  imagem_2: arquivo.jpg | descrição\n{}'
	},
	fragmento: {
		label: 'Fragmento',
		keys: ['nome', 'alt', 'legenda', 'altura'],
		snippet: '{fragmento}\n  nome: fragmentos/arquivo.jpg\n  alt: \n  legenda: \n{}'
	},
	trajetoria: {
		label: 'Gráfico de trajetória',
		keys: [
			'titulo',
			'nota',
			'inicio',
			'fim',
			'periodo_1',
			'periodo_2',
			'periodo_3',
			'periodo_4',
			'periodo_5',
			'periodo_6',
			'periodo_7',
			'periodo_8',
			'marco_1',
			'marco_2',
			'marco_3',
			'marco_4',
			'marco_5',
			'marco_6',
			'marco_7',
			'marco_8',
			'marco_9',
			'marco_10',
			'marco_11',
			'marco_12',
			'marco_13',
			'marco_14',
			'marco_15',
			'marco_16'
		],
		snippet:
			'{trajetoria}\n  titulo: \n  inicio: 1997\n  fim: 2026\n  periodo_1: 1997-2000 | lugar\n  marco_1: 2011 | 1 | o que foi\n{}'
	},
	capitulos: {
		label: 'Linha do tempo',
		keys: [
			'titulo',
			'capitulo_1',
			'imagem_1',
			'legenda_1',
			'papel_1',
			'marca_1',
			'capitulo_2',
			'imagem_2',
			'legenda_2',
			'papel_2',
			'marca_2',
			'capitulo_3',
			'imagem_3',
			'legenda_3',
			'papel_3',
			'marca_3',
			'capitulo_4',
			'imagem_4',
			'legenda_4',
			'papel_4',
			'marca_4',
			'capitulo_5',
			'imagem_5',
			'legenda_5',
			'papel_5',
			'marca_5',
			'capitulo_6',
			'imagem_6',
			'legenda_6',
			'papel_6',
			'marca_6',
			'capitulo_7',
			'imagem_7',
			'legenda_7',
			'papel_7',
			'marca_7',
			'capitulo_8',
			'imagem_8',
			'legenda_8',
			'papel_8',
			'marca_8',
			'capitulo_9',
			'imagem_9',
			'legenda_9',
			'papel_9',
			'marca_9',
			'capitulo_10',
			'imagem_10',
			'legenda_10',
			'papel_10',
			'marca_10'
		],
		snippet:
			'{capitulos}\n  titulo: \n  capitulo_1: lugar | período | texto\n  imagem_1: arquivo.jpg\n  legenda_1: \n{}'
	},
	sistema: {
		label: 'Diagrama de sistema',
		keys: [
			'titulo_cima',
			'titulo_baixo',
			'nota',
			'visivel_1',
			'visivel_2',
			'visivel_3',
			'visivel_4',
			'oculto_1',
			'oculto_2',
			'oculto_3',
			'oculto_4',
			'oculto_5',
			'oculto_6',
			'oculto_7',
			'oculto_8',
			'oculto_9'
		],
		snippet:
			'{sistema}\n  titulo_cima: \n  visivel_1: nome | texto\n  titulo_baixo: \n  oculto_1: nome | texto\n  nota: \n{}'
	},
	fluxo: {
		label: 'Fluxo em duas trilhas',
		keys: ['titulo', 'titulo_esquerda', 'titulo_direita', 'nota', 'esquerda_1', 'esquerda_2', 'esquerda_3', 'esquerda_4', 'direita_1', 'direita_2', 'direita_3', 'fim_1', 'fim_2'],
		snippet:
			'{fluxo}\n  titulo_esquerda: \n  esquerda_1: etapa | texto\n  titulo_direita: \n  direita_1: etapa | texto\n  fim_1: resultado\n  nota: \n{}'
	},
	celular: {
		label: 'Celular com telas',
		keys: ['pasta', 'entrada', 'entrada_alt', 'cor', 'alt', 'tela_1', 'tela_2', 'tela_3', 'tela_4'],
		snippet:
			'{celular}\n  pasta: \n  entrada: tela-de-entrada.jpg\n  tela_1: tela.jpg | descrição\n  tela_2: tela.jpg | descrição\n{}'
	},
	numeros: {
		label: 'Números',
		keys: ['nota', 'numero_1', 'numero_2', 'numero_3', 'numero_4', 'numero_5', 'numero_6'],
		snippet: '{numeros}\n  numero_1: 1.234 | o que o número conta\n  nota: \n{}'
	},
	lista: {
		label: 'Lista em linhas',
		keys: [
			'titulo',
			'texto',
			'item_1',
			'item_2',
			'item_3',
			'item_4',
			'item_5',
			'item_6',
			'item_7',
			'item_8',
			'item_9',
			'item_10',
			'item_11',
			'item_12',
			'item_13',
			'item_14',
			'item_15',
			'item_16'
		],
		snippet: '{lista}\n  titulo: \n  item_1: nome | descrição\n{}'
	},
	intro: {
		label: 'Introdução em telas',
		keys: ['fundo_1', 'altura_1', 'texto_1', 'fundo_2', 'altura_2', 'texto_2'],
		snippet: '{intro}\n  texto_1: \n  texto_2: \n{}'
	},
	fundo: {
		label: 'Fundo',
		keys: ['cor', 'altura'],
		snippet: '{fundo}\n  cor: var(--color-light)\n{}'
	},
	cronologia: { label: 'Cronologia', keys: ['titulo', 'item', 'periodo', 'texto'] },
	passo: { label: 'Passo de texto', keys: ['posicao', 'texto', 'classe', 'top'] },
	bloco: { label: 'Grupo', keys: ['classes', 'fundo', 'tags', 'display', 'align', 'gap'], container: true },
	divisor: { label: 'Divisor', keys: [], single: true, snippet: '{divisor}' },
	tagSelector: { label: 'Filtro de tags', keys: [], single: true, snippet: '{tagSelector}' }
};

// Buttons shown in the "Inserir" row, in this order.
export const INSERTABLE = [
	{ label: 'Título', snippet: 'chapeu: \nh3: ' },
	...[
		'imagem',
		'video',
		'scrollerVideo',
		'telas',
		'slider',
		'imagemTexto',
		'abertura',
		'divisor'
	].map((name) => ({ label: BLOCKS[name].label, snippet: BLOCKS[name].snippet }))
];

// How the inspector edits a value: a fixed list becomes buttons, the rest a text field.
export const OPTIONS = {
	tamanho: SIZES,
	fixar: YES_NO,
	guia: YES_NO,
	vinheta: YES_NO,
	fundir: YES_NO,
	auto: YES_NO,
	fit: ['contain', 'cover'],
	lado: ['esquerda', 'direita'],
	preload: ['metadata', 'auto']
};

export const KEY_LABELS = {
	nome: 'Arquivo',
	video: 'Arquivo',
	imagem: 'Arquivo',
	pasta: 'Pasta',
	publicacao: 'Publicação',
	tamanho: 'Tamanho',
	alt: 'Descrição da imagem',
	legenda: 'Legenda',
	borda: 'Canto arredondado',
	classes: 'Estilos',
	tags: 'Tags',
	fixar: 'Fixar na tela',
	altura: 'Altura da rolagem',
	proporcao: 'Proporção',
	fit: 'Ajuste no palco',
	top: 'Distância do topo',
	fps: 'Quadros por segundo',
	guia: 'Guia de posição',
	vinheta: 'Vinheta',
	preload: 'Carregamento',
	tempo: 'Tempo por página',
	espaco: 'Espaço entre páginas',
	padding: 'Respiro',
	fundo: 'Fundo',
	fade: 'Transição',
	chapeu: 'Chapéu',
	titulo: 'Título',
	texto: 'Texto',
	lado: 'Lado da imagem',
	'video-mobile': 'Arquivo para celular',
	'video-desktop': 'Arquivo para desktop',
	'intro-title': 'Título de entrada',
	'intro-text': 'Texto de entrada',
	fundir: 'Fundir com a página',
	auto: 'Rolagem automática'
};

// Line prefixes that are notation even outside a block.
const LINE_PREFIXES = [
	'chapeu',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'titulo',
	'imagem',
	'video',
	'pdf',
	'embedwrapper',
	'ai2html'
];

// Aliases the parser also accepts; never reported as unknown.
const ALIASES = new Set(
	(
		'align align-items at background bg class classe color cor dir display folder gap gutter height html item ' +
		'linha multiply periodo posicao radius scroll size text title transicao mobile desktop src nome_mobile ' +
		'nome_desktop objectfit autoscroll autoplay padding-top padding-bottom espaço fundo1 fundo2 altura1 altura2 ' +
		'texto1 texto2 passos'
	).split(' ')
);

const OPEN = /^\{(\.?)([a-zA-Z]+)\}\s*$/;
const KEY_VALUE = /^(\s*)([\w.-]+):(\s?)(.*)$/;

const blockOf = (name) =>
	BLOCKS[Object.keys(BLOCKS).find((id) => id.toLowerCase() === name.toLowerCase())];

// Walks the text once and describes each line.
// kind: 'open' | 'close' | 'single' | 'key' | 'prose' | 'blank' | 'comment'
export function readLines(content) {
	const stack = [];
	return String(content || '')
		.split('\n')
		.map((text, index) => {
			const trimmed = text.trim();
			const top = stack[stack.length - 1];
			if (!trimmed) return { index, text, kind: 'blank', block: top };
			if (trimmed.startsWith('//')) return { index, text, kind: 'comment', block: top };
			if (trimmed === '{}') return { index, text, kind: 'close', block: stack.pop() };
			const open = trimmed.match(OPEN);
			if (open) {
				const def = blockOf(open[2]);
				const block = { name: open[2], def, start: index };
				if (def?.single) return { index, text, kind: 'single', block };
				stack.push(block);
				return { index, text, kind: 'open', block };
			}
			const pair = text.match(KEY_VALUE);
			const key = pair?.[2].toLowerCase();
			const inData = top && !top.def?.container;
			if (pair && (inData || LINE_PREFIXES.includes(key))) {
				return {
					index,
					text,
					kind: 'key',
					block: inData ? top : undefined,
					key: pair[2],
					value: pair[4],
					pair
				};
			}
			return { index, text, kind: 'prose', block: top };
		});
}

const escapeHtml = (text) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Same characters as the source, wrapped in spans, so it can sit under the textarea.
export function highlight(content) {
	return (
		readLines(content)
			.map((line) => {
				const text = escapeHtml(line.text);
				if (line.kind === 'open' || line.kind === 'close' || line.kind === 'single')
					return `<span class="tk-block">${text}</span>`;
				if (line.kind === 'comment') return `<span class="tk-comment">${text}</span>`;
				if (line.kind === 'key') {
					const [, indent, key, space, value] = line.pair;
					return `${indent}<span class="tk-key">${escapeHtml(key)}:</span>${space}<span class="tk-value">${escapeHtml(value)}</span>`;
				}
				return text;
			})
			.join('\n') + '\n'
	);
}

// Problems worth showing before saving. Wording is cautious: the parser accepts more than the editor lists.
export function lint(content) {
	const lines = readLines(content);
	const issues = [];
	const open = [];
	for (const line of lines) {
		if (line.kind === 'open') {
			open.push(line.block);
			if (!line.block.def)
				issues.push({ line: line.index, message: `Bloco {${line.block.name}} não reconhecido.` });
		} else if (line.kind === 'single' && !line.block.def) {
			issues.push({ line: line.index, message: `Bloco {${line.block.name}} não reconhecido.` });
		} else if (line.kind === 'close') {
			if (line.block) open.pop();
			else issues.push({ line: line.index, message: 'Fechamento {} sem bloco aberto.' });
		} else if (line.kind === 'key' && line.block?.def) {
			const key = line.key.toLowerCase();
			const known = line.block.def.keys.some((k) => k.toLowerCase() === key) || ALIASES.has(key);
			if (!known) {
				const near = line.block.def.keys.find(
					(k) => k[0] === key[0] && Math.abs(k.length - key.length) <= 2
				);
				issues.push({
					line: line.index,
					message: `Chave “${line.key}” não reconhecida em {${line.block.name}}.${near ? ` Seria “${near}”?` : ''}`
				});
			}
			const options = OPTIONS[key];
			if (
				known &&
				options &&
				line.value.trim() &&
				!options.some((o) => o.toLowerCase() === line.value.trim().toLowerCase())
			) {
				issues.push({
					line: line.index,
					message: `“${line.value.trim()}” não é um valor de ${line.key}. Use: ${options.join(', ')}.`
				});
			}
		}
	}
	for (const block of open)
		issues.push({ line: block.start, message: `Bloco {${block.name}} sem o fechamento {}.` });
	return issues.sort((a, b) => a.line - b.line);
}

// The data block around a line, with its fields, or null when the cursor is in prose.
export function blockAt(content, lineIndex) {
	const lines = readLines(content);
	const current = lines[lineIndex];
	if (!current) return null;
	const block = current.kind === 'single' ? null : current.block;
	if (!block || block.def?.container) return null;
	const end = lines.findIndex(
		(l) => l.index > block.start && l.kind === 'close' && l.block === block
	);
	const fields = lines
		.filter((l) => l.kind === 'key' && l.block === block)
		.map((l) => ({ key: l.key, value: l.value, line: l.index }));
	return {
		name: block.name,
		def: block.def,
		start: block.start,
		end: end === -1 ? lines.length - 1 : end,
		fields
	};
}

export function setField(content, block, key, value) {
	const lines = content.split('\n');
	const field = block.fields.find((f) => f.key === key);
	if (field) lines[field.line] = lines[field.line].replace(/^(\s*[\w.-]+:)\s?.*$/, `$1 ${value}`);
	else lines.splice(block.end, 0, `  ${key}: ${value}`);
	return lines.join('\n');
}

export function removeField(content, block, key) {
	const field = block.fields.find((f) => f.key === key);
	if (!field) return content;
	const lines = content.split('\n');
	lines.splice(field.line, 1);
	return lines.join('\n');
}
