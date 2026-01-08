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
	function parseBlocoInner(inner) {
		const bloco = { items: [], tags: [] };
		let textLines = [];
		for (let k = 0; k < inner.length; k++) {
			const rawLine = inner[k];
			const line = String(rawLine).trim().replace(/^\ufeff/, '');
			if (/^\{\.?bloco\}$/i.test(line)) continue;
			const headingMatch = line.match(/^h([1-5]):\s*(.+)$/i);
			if (headingMatch) {
				if (textLines.length) {
					bloco.items.push({ type: 'text', text: textLines.join('\n') });
					textLines = [];
				}
				bloco.items.push({
					type: 'heading',
					level: Number(headingMatch[1]),
					text: headingMatch[2].trim()
				});
				continue;
			}
			const m = String(line).match(/^([^:]+):\s*(.*)$/);
			if (m && !bloco.items.length && !textLines.length) {
				const key = m[1].trim().toLowerCase();
				const val = m[2].trim();
				if (key === 'display' && val) {
					bloco.display = val;
					continue;
				}
				if (key === 'classes' && val) {
					bloco.classes = val
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean)
						.join(' ');
					continue;
				}
				if (key === 'gap' && val) {
					bloco.gap = val;
					continue;
				}
				if ((key === 'align' || key === 'align-items') && val) {
					bloco.align = val;
					continue;
				}
				if (key === 'tags' && val) {
					bloco.tags = val
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean);
					continue;
				}
			}

			if (/^\{imagem\}$/i.test(line)) {
				if (textLines.length) {
					bloco.items.push({ type: 'text', text: textLines.join('\n') });
					textLines = [];
				}
				const imageLines = [];
				let m = k + 1;
				for (; m < inner.length; m++) {
					const l2 = inner[m].trim();
					if (/^\{\}$/i.test(l2)) break;
					imageLines.push(l2);
				}
				const imgObj = {};
				for (const l2 of imageLines) {
					const mm = String(l2).match(/^([^:]+):\s*(.*)$/);
					if (mm) {
						const key = mm[1].trim().toLowerCase();
						const val = mm[2].trim();
						if (key === 'tags' && val) {
							imgObj.tags = val
								.split(',')
								.map((t) => t.trim())
								.filter(Boolean);
						} else if (key === 'classes' && val) {
							imgObj.classes = val
								.split(',')
								.map((t) => t.trim())
								.filter(Boolean)
								.join(' ');
						} else if (key === 'multiply') {
							imgObj.multiply = /^(?:1|true|yes|sim|multiply)$/i.test(val) ? val : val;
						} else if (key === 'borda' || key === 'radius') {
							imgObj.borda = val;
						} else {
							imgObj[key] = val;
						}
					}
				}
				bloco.items.push({ type: 'image', data: imgObj });
				k = m;
				continue;
			}

			if (/^\{video\}$/i.test(line)) {
				if (textLines.length) {
					bloco.items.push({ type: 'text', text: textLines.join('\n') });
					textLines = [];
				}
				const videoLines = [];
				let m = k + 1;
				for (; m < inner.length; m++) {
					const l2 = inner[m].trim();
					if (/^\{\}$/i.test(l2)) break;
					videoLines.push(l2);
				}
				const vidObj = {};
				for (const l2 of videoLines) {
					const mm = String(l2).match(/^([^:]+):\s*(.*)$/);
					if (mm) {
						const key = mm[1].trim().toLowerCase();
						const val = mm[2].trim();
						if (key === 'tags' && val) {
							vidObj.tags = val
								.split(',')
								.map((t) => t.trim())
								.filter(Boolean);
						} else if (key === 'classes' && val) {
							vidObj.classes = val
								.split(',')
								.map((t) => t.trim())
								.filter(Boolean)
								.join(' ');
						} else if (key === 'multiply') {
							vidObj.multiply = /^(?:1|true|yes|sim|multiply)$/i.test(val) ? val : val;
						} else if (key === 'borda' || key === 'radius') {
							vidObj.borda = val;
						} else {
							vidObj[key] = val;
						}
					}
				}
				bloco.items.push({ type: 'video', data: { video: vidObj } });
				k = m;
				continue;
			}

			if (line) textLines.push(line);
		}
		if (textLines.length) bloco.items.push({ type: 'text', text: textLines.join('\n') });
		if (bloco.tags && bloco.tags.length) {
			for (const item of bloco.items) {
				if (item.type === 'image') {
					if (!item.data.tags || !item.data.tags.length) item.data.tags = bloco.tags;
				} else if (item.type === 'video') {
					if (!item.data.video) item.data.video = {};
					if (!item.data.video.tags || !item.data.video.tags.length) item.data.video.tags = bloco.tags;
				}
			}
		}
		const tagSet = new Set(
			(bloco.tags || [])
				.concat(
					bloco.items
						.filter((item) => item.type === 'image' && item.data && item.data.tags)
						.flatMap((item) => item.data.tags)
				)
				.concat(
					bloco.items
						.filter((item) => item.type === 'video' && item.data && item.data.video && item.data.video.tags)
						.flatMap((item) => item.data.video.tags)
				)
				.map((t) => String(t).toLowerCase())
				.filter(Boolean)
		);
		const allTags = Array.from(tagSet);
		return { bloco, allTags };
	}

	function parseBlocoFromBlocks(startIndex) {
		const inner = [];
		let nested = false;
		let done = false;
		let endIndex = startIndex;
		for (let j = startIndex; j < blocks.length && !done; j++) {
			endIndex = j;
			const lines = String(blocks[j])
				.split(/\r?\n/)
				.map((l) => l.trim().replace(/^\ufeff/, ''))
				.filter((l) => l.length > 0);
			for (const line of lines) {
				if (/^\{\.?bloco\}$/i.test(line)) {
					continue;
				}
				if (/^\{imagem\}$/i.test(line) || /^\{video\}$/i.test(line)) {
					nested = true;
					inner.push(line);
					continue;
				}
				if (nested && /^\{\}$/i.test(line)) {
					nested = false;
					inner.push(line);
					continue;
				}
				if (!nested && /^\{\}$/i.test(line)) {
					done = true;
					break;
				}
				inner.push(line);
			}
		}
		const parsed = parseBlocoInner(inner);
		return { parsed, endIndex: done ? endIndex : startIndex };
	}
  for (let i = 0; i < blocks.length; i++) {
    const raw = blocks[i];
    const trimmed = String(raw).trim().replace(/^\ufeff/, '');

    // {cronologia} multi-line
    if (/^\{cronologia\}[\s\S]*\{\}$/i.test(trimmed)) {
      const lines = String(raw)
        .split(/\r?\n/)
        .map((l) => l.trim());
      const inner = lines
        .slice(1, -1)
        .map((l) => l)
        .filter((l) => l.length > 0);
      const obj = { itens: [], tags: [] };
      for (const line of inner) {
        const m = String(line).match(/^([^:]+):\s*([\s\S]*)$/);
        if (m) {
          const key = m[1].trim().toLowerCase();
          const val = m[2];
          if ((key === 'periodo' || key === 'item' || key === 'linha') && val) {
            obj.itens.push(val.trim());
          } else if (key === 'titulo' || key === 'title') {
            obj.titulo = val.trim();
          } else if (key === 'classes' && val) {
            obj.classes = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
              .join(' ');
          } else if (key === 'tags' && val) {
            obj.tags = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else {
            obj[key] = val.trim();
          }
        }
      }
      objs.push({ raw: { cronologia: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      continue;
    }
    // {cronologia} single-line (open block)
    else if (/^\{cronologia\}$/i.test(trimmed)) {
      const obj = { itens: [], tags: [] };
      const inner = [];
      let j = i + 1;
      for (; j < blocks.length; j++) {
        const line = String(blocks[j]).trim();
        if (/^\{\}$/i.test(line)) break;
        inner.push(line);
      }
      for (const line of inner) {
        const m = String(line).match(/^([^:]+):\s*([\s\S]*)$/);
        if (m) {
          const key = m[1].trim().toLowerCase();
          const val = m[2];
          if ((key === 'periodo' || key === 'item' || key === 'linha') && val) {
            obj.itens.push(val.trim());
          } else if (key === 'titulo' || key === 'title') {
            obj.titulo = val.trim();
          } else if (key === 'classes' && val) {
            obj.classes = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
              .join(' ');
          } else if (key === 'tags' && val) {
            obj.tags = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else {
            obj[key] = val.trim();
          }
        }
      }
      objs.push({ raw: { cronologia: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      i = j;
      continue;
    }
    // {slider} multi-line
    if (/^\{slider\}[\s\S]*\{\}$/i.test(trimmed)) {
      const lines = String(raw)
        .split(/\r?\n/)
        .map((l) => l.trim());
      const inner = lines
        .slice(1, -1)
        .map((l) => l)
        .filter((l) => l.length > 0);
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
              .filter(Boolean)
              .join(' ');
          } else if (key === 'tempo') {
            obj.tempo = val; // seconds; convert later
          } else if (key === 'altura' || key === 'height') {
            obj.altura = val;
          } else if (key === 'fundo' || key === 'bg' || key === 'background') {
            obj.fundo = val;
          } else if (key === 'pasta' || key === 'dir' || key === 'folder') {
            obj.pasta = val;
          } else if (key === 'tamanho' || key === 'size') {
            obj.tamanho = val;
          } else if (key === 'espaco' || key === 'espaço' || key === 'gap' || key === 'gutter') {
            obj.espaco = val;
          } else {
            obj[key] = val;
          }
        }
      }
      objs.push({ raw: { slider: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      continue;
    }
    // {slider} single-line open block
    else if (/^\{slider\}$/i.test(trimmed)) {
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
              .filter(Boolean)
              .join(' ');
          } else if (key === 'tempo') {
            obj.tempo = val;
          } else if (key === 'altura' || key === 'height') {
            obj.altura = val;
          } else if (key === 'fundo' || key === 'bg' || key === 'background') {
            obj.fundo = val;
          } else if (key === 'pasta' || key === 'dir' || key === 'folder') {
            obj.pasta = val;
          } else if (key === 'tamanho' || key === 'size') {
            obj.tamanho = val;
          } else if (key === 'espaco' || key === 'espaço' || key === 'gap' || key === 'gutter') {
            obj.espaco = val;
          } else {
            obj[key] = val;
          }
        }
      }
      objs.push({ raw: { slider: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      i = j;
      continue;
    }
    // {carrossel} multi-line
    if (/^\{carrossel\}[\s\S]*\{\}$/i.test(trimmed)) {
      const lines = String(raw)
        .split(/\r?\n/)
        .map((l) => l.trim());
      const inner = lines
        .slice(1, -1)
        .map((l) => l)
        .filter((l) => l.length > 0);
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
              .filter(Boolean)
              .join(' ');
          } else if (key === 'tempo') {
            obj.tempo = val;
          } else if (key === 'altura' || key === 'height') {
            obj.altura = val;
          } else if (key === 'fundo' || key === 'bg' || key === 'background') {
            obj.fundo = val;
          } else if (key === 'pasta' || key === 'dir' || key === 'folder') {
            obj.pasta = val;
          } else if (key === 'tamanho' || key === 'size') {
            obj.tamanho = val;
          } else if (key === 'fade' || key === 'transicao' || key === 'transição') {
            obj.fade = val;
          } else {
            obj[key] = val;
          }
        }
      }
      objs.push({ raw: { carrossel: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      continue;
    }
    // {carrossel} single-line open block
    else if (/^\{carrossel\}$/i.test(trimmed)) {
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
              .filter(Boolean)
              .join(' ');
          } else if (key === 'tempo') {
            obj.tempo = val;
          } else if (key === 'altura' || key === 'height') {
            obj.altura = val;
          } else if (key === 'fundo' || key === 'bg' || key === 'background') {
            obj.fundo = val;
          } else if (key === 'pasta' || key === 'dir' || key === 'folder') {
            obj.pasta = val;
          } else if (key === 'tamanho' || key === 'size') {
            obj.tamanho = val;
          } else if (key === 'fade' || key === 'transicao' || key === 'transição') {
            obj.fade = val;
          } else {
            obj[key] = val;
          }
        }
      }
      objs.push({ raw: { carrossel: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      i = j;
      continue;
    }
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
      obj.tags = [];
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
              } else if (skey === 'tags') {
                const arr = String(sval)
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);
                passo.tags = arr;
                obj.tags = Array.from(new Set([...(obj.tags || []), ...arr]));
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
    // {fundo} multi-line
    if (/^[\ufeff]?\{fundo\}[\s\S]*\{\}$/i.test(trimmed)) {
      const lines = String(raw)
        .split(/\r?\n/)
        .map((l) => l.trim());
      const inner = lines
        .slice(1, -1)
        .map((l) => l)
        .filter((l) => l.length > 0);
      const obj = {};
      for (const line of inner) {
        const m = String(line).match(/^([^:]+):\s*(.*)$/);
        if (m) {
          const key = m[1].trim().toLowerCase();
          const val = m[2].trim();
          if (key === 'cor' || key === 'color' || key === 'bg' || key === 'fundo') {
            obj.cor = val;
          } else if (key === 'tags' && val) {
            obj.tags = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else {
            obj[key] = val;
          }
        }
      }
      objs.push({ raw: { fundo: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      continue;
    }
    // {fundo} single-line (open block)
    else if (/^[\ufeff]?\{fundo\}$/i.test(trimmed)) {
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
          if (key === 'cor' || key === 'color' || key === 'bg' || key === 'fundo') {
            obj.cor = val;
          } else if (key === 'tags' && val) {
            obj.tags = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else {
            obj[key] = val;
          }
        }
      }
      objs.push({ raw: { fundo: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      i = j;
      continue;
    }
    // {scrollerVideo} single-line (open block)
    else if (/^\{scrollerVideo\}$/i.test(trimmed)) {
      const obj = {};
      obj.tags = [];
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
              } else if (skey === 'tags') {
                const arr = String(sval)
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);
                passo.tags = arr;
                obj.tags = Array.from(new Set([...(obj.tags || []), ...arr]));
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

    // {bloco} block (open or inline)
    if (/^\{\.?bloco\}/i.test(trimmed)) {
      const { parsed, endIndex } = parseBlocoFromBlocks(i);
      if (parsed && parsed.bloco) {
        objs.push({ raw: { bloco: parsed.bloco }, tags: parsed.allTags });
        i = endIndex;
        continue;
      }
    }

    // {intro} multi-line
    if (/^\{intro\}[\s\S]*\{\}$/i.test(trimmed)) {
      const lines = String(raw)
        .split(/\r?\n/)
        .map((l) => l.trim());
      const inner = lines
        .slice(1, -1)
        .map((l) => l)
        .filter((l) => l.length > 0);
      const obj = {};
      for (const line of inner) {
        const m = String(line).match(/^([^:]+):\s*(.*)$/);
        if (m) {
          const key = m[1].trim().toLowerCase();
          const val = m[2];
          if (key === 'tags' && val) {
            obj.tags = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else if (
            key === 'fundo_1' ||
            key === 'fundo1' ||
            key === 'cor_1' ||
            key === 'color_1' ||
            key === 'bg_1' ||
            key === 'background_1'
          ) {
            obj.fundo1 = val.trim();
          } else if (
            key === 'fundo_2' ||
            key === 'fundo2' ||
            key === 'cor_2' ||
            key === 'color_2' ||
            key === 'bg_2' ||
            key === 'background_2'
          ) {
            obj.fundo2 = val.trim();
          } else if (key === 'texto_1' || key === 'texto1' || key === 'text_1' || key === 'text1') {
            obj.texto1 = val;
          } else if (key === 'texto_2' || key === 'texto2' || key === 'text_2' || key === 'text2') {
            obj.texto2 = val;
          } else if (
            key === 'altura_1' ||
            key === 'height_1' ||
            key === 'vh_1' ||
            key === 'height1' ||
            key === 'altura1'
          ) {
            obj.altura1 = val.trim();
          } else if (
            key === 'altura_2' ||
            key === 'height_2' ||
            key === 'vh_2' ||
            key === 'height2' ||
            key === 'altura2'
          ) {
            obj.altura2 = val.trim();
          } else {
            obj[key] = val.trim();
          }
        }
      }
      objs.push({ raw: { intro: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
      continue;
    }
    // {intro} single-line (open block)
    else if (/^\{intro\}$/i.test(trimmed)) {
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
          const val = m[2];
          if (key === 'tags' && val) {
            obj.tags = val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
          } else if (
            key === 'fundo_1' ||
            key === 'fundo1' ||
            key === 'cor_1' ||
            key === 'color_1' ||
            key === 'bg_1' ||
            key === 'background_1'
          ) {
            obj.fundo1 = val.trim();
          } else if (
            key === 'fundo_2' ||
            key === 'fundo2' ||
            key === 'cor_2' ||
            key === 'color_2' ||
            key === 'bg_2' ||
            key === 'background_2'
          ) {
            obj.fundo2 = val.trim();
          } else if (key === 'texto_1' || key === 'texto1' || key === 'text_1' || key === 'text1') {
            obj.texto1 = val;
          } else if (key === 'texto_2' || key === 'texto2' || key === 'text_2' || key === 'text2') {
            obj.texto2 = val;
          } else if (
            key === 'altura_1' ||
            key === 'height_1' ||
            key === 'vh_1' ||
            key === 'height1' ||
            key === 'altura1'
          ) {
            obj.altura1 = val.trim();
          } else if (
            key === 'altura_2' ||
            key === 'height_2' ||
            key === 'vh_2' ||
            key === 'height2' ||
            key === 'altura2'
          ) {
            obj.altura2 = val.trim();
          } else {
            obj[key] = val.trim();
          }
        }
      }
      objs.push({ raw: { intro: obj }, tags: (obj.tags || []).map((t) => t.toLowerCase()) });
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
		if (
			/^tagSelector(?:\s*:\s*)?/i.test(trimmed) ||
			/^<tagSelector\b/i.test(trimmed) ||
			/^\{tagSelector(?:\s*:\s*)?.*\}$/i.test(trimmed)
		) {
			let cfg = null;
			const m = trimmed.match(/^tagSelector(?:\s*:\s*(.+))?$/i);
			if (m && m[1]) {
				try {
					cfg = JSON.parse(m[1]);
				} catch {
					/* ignore */
				}
			} else {
				const m2 = trimmed.match(
					/^<tagSelector(?:\s*:\s*(.+))?\s*\/?>(?:\s*<\/tagSelector>)?$/i
				);
				if (m2 && m2[1]) {
					try {
						cfg = JSON.parse(m2[1]);
					} catch {
						/* ignore */
					}
				}
				const m3 = trimmed.match(/^\{tagSelector(?:\s*:\s*(.+))?\}$/i);
				if (m3 && m3[1]) {
					try {
						cfg = JSON.parse(m3[1]);
					} catch {
						/* ignore */
					}
				}
			}
			objs.push({ raw, tags: [], selector: true, selectorConfig: cfg });
			continue;
		}

		function isTextParagraphString(value) {
			const s = String(value || '').trim();
			if (!s) return false;
			if (/^h[1-5]:\s*/i.test(s)) return false;
			if (/^<divisor\b/i.test(s)) return false;
			if (/^\{divisor\}$/i.test(s)) return false;
			if (/^<tagSelector\b/i.test(s) || /^tagSelector(?:\s*:\s*)?/i.test(s)) return false;
			if (/^\{tagSelector(?:\s*:\s*)?.*\}$/i.test(s)) return false;
			if (/^titulo:\s*/i.test(s)) return false;
			if (/^embedWrapper:\s*/i.test(s)) return false;
			if (/^pdf:\s*/i.test(s)) return false;
			if (/^ai2html:\s*/i.test(s)) return false;
			if (/^imagem:\s*/i.test(s)) return false;
			if (/^video:\s*/i.test(s)) return false;
			return true;
		}

		function isMediaBlock(value) {
			if (!value || typeof value !== 'object') return false;
			if (value.video) return true;
			if (value.nome || (value.imagem && value.imagem.nome)) return true;
			if (value.slider || value.carrossel || value.scrollerVideo) return true;
			return false;
		}

		function isTaggableBlock(block) {
			if (!block || block.selector) return false;
			if (typeof block.raw === 'string') {
				const s = String(block.raw || '').trim();
				if (/^imagem:\s*/i.test(s) || /^video:\s*/i.test(s)) return true;
				return isTextParagraphString(s);
			}
			return isMediaBlock(block.raw);
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
				let hitMedia = false;
				for (let k = objs.length - 1; k >= 0; k--) {
					if (!isTaggableBlock(objs[k])) break;
					objs[k].tags = Array.from(new Set([...(objs[k].tags || []), ...tags]));
					if (isMediaBlock(objs[k].raw)) {
						hitMedia = true;
						break;
					}
				}
				if (hitMedia) {
					// stop here; do not apply tags to text before the media block
				}
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
