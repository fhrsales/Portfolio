import { describe, it, expect } from 'vitest';

describe('jsdom sanity', () => {
  it('can create and query headings', () => {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Hello Test</h1>';
    document.body.appendChild(div);
    const h1 = document.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1?.textContent).toContain('Hello Test');
  });
});

