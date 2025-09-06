import { describe, it, expect } from 'vitest';
import { parseImage, parseImageLine } from './image.js';

describe('parseImage', () => {
	it('parses string image line with size, caption, class and tag', () => {
		const r = parseImage('imagem: foto.jpg, G, Uma legenda, destaque shadow-1');
		expect(r.nome).toBe('foto.jpg');
		expect(r.tamanho).toBe('G');
		expect(r.legenda).toContain('Uma legenda');
		expect(r.classes).toContain('destaque');
		expect(r.tags).toContain('destaque');
	});

	it('parses object image entry', () => {
		const r = parseImage({ imagem: { nome: 'a.jpg', tamanho: 'P', legenda: 'cap', tags: ['x'] } });
		expect(r.nome).toBe('a.jpg');
		expect(r.tamanho).toBe('P');
		expect(r.tags).toEqual(['x']);
	});

	it('handles radius token', () => {
		const r = parseImageLine('imagem: a.jpg, 12px, cap');
		expect(r.radius).toBe('12px');
	});
});
