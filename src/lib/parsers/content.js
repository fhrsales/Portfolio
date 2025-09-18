import { parseImage } from './image.js';

export function normalizeParsedToBlocks(usedParsed) {
	const arr = [];
	if (!usedParsed || usedParsed.erro) return arr;
	if (usedParsed.titulo) arr.push(`titulo: ${usedParsed.titulo}`);
	if (usedParsed.embedWrapper) arr.push(`embedWrapper: ${usedParsed.embedWrapper}`);
	if (usedParsed.pdf) arr.push(`pdf: ${usedParsed.pdf}`);
	if (usedParsed.body) {
		const bodyArr = Array.isArray(usedParsed.body)
			? usedParsed.body
			: String(usedParsed.body).split(/\n+/);
		arr.push(...bodyArr.filter(Boolean));
	}
	if (usedParsed.orderedContent) arr.push(...usedParsed.orderedContent);
	return arr;
}

// Build array of block descriptors from freeform blocks array
export function buildBlockObjects(blocks) {
	if (!blocks || !blocks.length) return [];
	const objs = [];
	for (let i = 0; i < blocks.length; i++) {
		const raw = blocks[i];
		const trimmed = String(raw).trim();

    // {scrollerVideo} multi-line
    if (/^\{scrollerVideo\}[\s\S]*\{\}$/i.test(trimmed)) {
      const lines = String(raw)
        .split(/\r?\n/)
        .map((l) => l.trim());
      const inner = lines
        .slice(1, -1)
        .map((l) => l)
        .filter((l) => l.length > 0);
      const obj = {};
      obj.passos = [];
      for (let k = 0; k < inner.length; k++) {
        const line = inner[k];
        if (/^\{\.passo\}$/i.test(line)) {
          const passo = {};
          const stepLines = [];
          let m = k + 1;
          for (; m < inner.length; m++) {
            const l2 = inner[m];
            if (/^\{\}$/i.test(l2)) break;
            stepLines.push(l2);
          }
          for (const sl of stepLines) {
            const mm = String(sl).match(/^([^:]+):\s*([\s\S]*)$/);
            if (mm) {
              const skey = mm[1].trim().toLowerCase();
              const sval = mm[2]; // keep raw (allow html)
              if (skey === 'posicao' || skey === 'posição' || skey === 'at') {
                passo.posicao = sval.trim();
              } else if (skey === 'texto' || skey === 'text' || skey === 'html') {
                passo.texto = sval; // raw html allowed
              } else if (skey === 'classe' || skey === 'class') {
                passo.classe = sval.trim();
              } else {
                passo[skey] = sval.trim();
              }
            }
          }
          obj.passos.push(passo);
          k = m; // jump to closing
          continue;
        }
        const m = String(line).match(/^([^:]+):\s*(.*)$/);
        if (m) {
          const key = m[1].trim().toLowerCase();
          const val = m[2].trim();
          if (key === 'tags' && val) {
            obj.tags = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else if (key === 'classes' && val) {
            obj.classes = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else if (key === 'texto') {
            if (!obj.textos) obj.textos = [];
            obj.textos.push(val);
          } else if (key === 'guia') {
            obj.guia = /^(?:1|true|yes|sim|ligado|on)$/i.test(val);
          } else if (key === 'altura' || key === 'scroll' || key === 'height') {
            obj.altura = val;
          } else {
            obj[key] = val;
          }
        }
      }
      objs.push({ raw: { scrollerVideo: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      continue;
    }
    // {scrollerVideo} single-line (open block)
    else if (/^\{scrollerVideo\}$/i.test(trimmed)) {
      const obj = {};
      obj.passos = [];
      const inner = [];
      let j = i + 1;
      for (; j < blocks.length; j++) {
        const line = String(blocks[j]).trim();
        if (/^\{\}$/i.test(line)) break;
        inner.push(line);
      }
      for (let k = 0; k < inner.length; k++) {
        const line = inner[k];
        if (/^\{\.passo\}$/i.test(line)) {
          const passo = {};
          const stepLines = [];
          let m = k + 1;
          for (; m < inner.length; m++) {
            const l2 = String(inner[m]).trim();
            if (/^\{\}$/i.test(l2)) break;
            stepLines.push(l2);
          }
          for (const sl of stepLines) {
            const mm = String(sl).match(/^([^:]+):\s*([\s\S]*)$/);
            if (mm) {
              const skey = mm[1].trim().toLowerCase();
              const sval = mm[2];
              if (skey === 'posicao' || skey === 'posição' || skey === 'at') {
                passo.posicao = sval.trim();
              } else if (skey === 'texto' || skey === 'text' || skey === 'html') {
                passo.texto = sval;
              } else if (skey === 'classe' || skey === 'class') {
                passo.classe = sval.trim();
              } else {
                passo[skey] = sval.trim();
              }
            }
          }
          obj.passos.push(passo);
          k = m;
          continue;
        }
        const m = String(line).match(/^([^:]+):\s*(.*)$/);
        if (m) {
          const key = m[1].trim().toLowerCase();
          const val = m[2].trim();
          if (key === 'tags' && val) {
            obj.tags = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else if (key === 'classes' && val) {
            obj.classes = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else if (key === 'texto') {
            if (!obj.textos) obj.textos = [];
            obj.textos.push(val);
          } else if (key === 'guia') {
            obj.guia = /^(?:1|true|yes|sim|ligado|on)$/i.test(val);
          } else if (key === 'altura' || key === 'scroll' || key === 'height') {
            obj.altura = val;
          } else {
            obj[key] = val;
          }
        }
      }
      objs.push({ raw: { scrollerVideo: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      i = j;
      continue;
    }

    // {imagem} multi-line
		// {video} multi-line
		if (/^\{video\}[\s\S]*\{\}$/i.test(trimmed)) {
			const lines = String(raw)
				.split(/\r?\n/)
				.map((l) => l.trim());
			const inner = lines
				.slice(1, -1)
				.map((l) => l)
				.filter(Boolean);
			const obj = {};
			for (const line of inner) {
				const m = String(line).match(/^([^:]+):\s*(.*)$/);
				if (m) {
					const key = m[1].trim().toLowerCase();
					const val = m[2].trim();
					if (key === 'tags' && val) {
						obj.tags = val
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean);
					} else if (key === 'classes' && val) {
						obj.classes = val
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean);
					} else if (key === 'multiply') {
						obj.multiply = /^(?:1|true|yes|sim|multiply)$/i.test(val) ? val : val;
					} else if (key === 'borda' || key === 'radius') {
						obj.borda = val;
					} else {
						obj[key] = val;
					}
				}
			}
			// Wrap under video to signal type to renderer
			objs.push({ raw: { video: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
			continue;
		}
		// {video} single-line (open block)
		else if (/^\{video\}$/i.test(trimmed)) {
			const obj = {};
			const inner = [];
			let j = i + 1;
			for (; j < blocks.length; j++) {
				const line = String(blocks[j]).trim();
				if (/^\{\}$/i.test(line)) break;
				inner.push(line);
			}
			for (const line of inner) {
				const m = String(line).match(/^([^:]+):\s*(.*)$/);
				if (m) {
					const key = m[1].trim().toLowerCase();
					const val = m[2].trim();
					if (key === 'tags' && val) {
						obj.tags = val
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean);
					} else if (key === 'classes' && val) {
						obj.classes = val
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean);
					} else if (key === 'multiply') {
						obj.multiply = /^(?:1|true|yes|sim|multiply)$/i.test(val) ? val : val;
					} else if (key === 'borda' || key === 'radius') {
						obj.borda = val;
					} else {
						obj[key] = val;
					}
				}
			}
			// Wrap under video to signal type to renderer
			objs.push({ raw: { video: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
			i = j;
			continue;
		}

		// {imagem} multi-line
		if (/^\{imagem\}[\s\S]*\{\}$/i.test(trimmed)) {
			const lines = String(raw)
				.split(/\r?\n/)
				.map((l) => l.trim());
			const inner = lines
				.slice(1, -1)
				.map((l) => l)
				.filter(Boolean);
			const obj = {};
			for (const line of inner) {
				const m = String(line).match(/^([^:]+):\s*(.*)$/);
				if (m) {
					const key = m[1].trim().toLowerCase();
					const val = m[2].trim();
					if (key === 'tags' && val) {
						obj.tags = val
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean);
					} else if (key === 'classes' && val) {
						obj.classes = val
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean);
					} else if (key === 'multiply') {
						obj.multiply = /^(?:1|true|yes|sim|multiply)$/i.test(val) ? val : val;
					} else if (key === 'borda' || key === 'radius') {
						obj.borda = val;
					} else {
						obj[key] = val;
					}
				}
			}
			objs.push({ raw: obj, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
			continue;
		} else if (/^\{imagem\}$/i.test(trimmed)) {
			const obj = {};
			const inner = [];
			let j = i + 1;
			for (; j < blocks.length; j++) {
				const line = String(blocks[j]).trim();
				if (/^\{\}$/i.test(line)) break;
				inner.push(line);
			}
			for (const line of inner) {
				const m = String(line).match(/^([^:]+):\s*(.*)$/);
				if (m) {
					const key = m[1].trim().toLowerCase();
					const val = m[2].trim();
					if (key === 'tags' && val) {
						obj.tags = val
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean);
					} else if (key === 'classes' && val) {
						obj.classes = val
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean);
					} else if (key === 'multiply') {
						obj.multiply = /^(?:1|true|yes|sim|multiply)$/i.test(val) ? val : val;
					} else if (key === 'borda' || key === 'radius') {
						obj.borda = val;
					} else {
						obj[key] = val;
					}
				}
			}
			objs.push({ raw: obj, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
			i = j;
			continue;
		}

		// tagSelector
		if (/^tagSelector(?:\s*:\s*)?/i.test(trimmed) || /^<tagSelector\b/i.test(trimmed)) {
			let cfg = null;
			const m = trimmed.match(/^tagSelector(?:\s*:\s*(.+))?$/i);
			if (m && m[1]) {
				try {
					cfg = JSON.parse(m[1]);
				} catch {
					/* ignore */
				}
			} else {
				const m2 = trimmed.match(/^<tagSelector(?:\s*:\s*(.+))?\s*\/?>(?:\s*<\/tagSelector>)?$/i);
				if (m2 && m2[1]) {
					try {
						cfg = JSON.parse(m2[1]);
					} catch {
						/* ignore */
					}
				}
			}
			objs.push({ raw, tags: [], selector: true, selectorConfig: cfg });
			continue;
		}

		// trailing tags
		const tagMatch = trimmed.match(/^tags:\s*(.+)$/i);
		if (tagMatch) {
			const tags = tagMatch[1]
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean)
				.map((t) => t.toLowerCase());
			if (objs.length) {
				objs[objs.length - 1].tags = Array.from(
					new Set([...(objs[objs.length - 1].tags || []), ...tags])
				);
				if (objs.length > 1)
					objs[objs.length - 2].tags = Array.from(
						new Set([...(objs[objs.length - 2].tags || []), ...tags])
					);
			}
			continue;
		}

		// if image line, collect class-like tokens as initial tags
		const initialTags = [];
		if (/^imagem:\s*/i.test(trimmed)) {
			try {
				const parsedImg = parseImage(raw);
				if (parsedImg && parsedImg.classes) {
					parsedImg.classes
						.split(/\s+/)
						.map((t) => t.trim())
						.filter(Boolean)
						.forEach((t) => initialTags.push(t.toLowerCase()));
				}
			} catch {
				/* ignore */
			}
		}
		objs.push({ raw, tags: initialTags });
	}
	return objs;
}

export function annotateBlocks(blockObjects) {
	if (!blockObjects || !blockObjects.length) return [];
	const arr = [];
	let seenSelector = false;
	for (let i = 0; i < blockObjects.length; i++) {
		const o = { ...blockObjects[i], isAfterSelector: seenSelector };
		arr.push(o);
		if (blockObjects[i].selector) seenSelector = true;
	}
	return arr;
}
