import { describe, it, expect } from 'vitest';
import { parseVideo } from './video.js';

describe('parseVideo', () => {
	it('parses string video line with size and caption tokens', () => {
		const r = parseVideo('video: clip.mp4, M, Um teaser, destaque');
		expect(r.nome).toBe('clip.mp4');
		expect(r.tamanho).toBe('M');
		expect(r.tags).toContain('destaque');
	});

	it('parses object video entry', () => {
		const r = parseVideo({ video: { nome: 'v.mp4', tamanho: 'G', legenda: 'leg', tags: 'x,y' } });
		expect(r.nome).toBe('v.mp4');
		expect(r.tamanho).toBe('G');
		expect(r.tags).toEqual(['x', 'y']);
	});
});
