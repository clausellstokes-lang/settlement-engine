/**
 * tokenizeProse — splits token-bearing prose into text/ref segments, and
 * degrades gracefully on malformed / token-free / non-string input.
 */
import { describe, it, expect } from 'vitest';
import { tokenizeProse } from '../../src/lib/entityRefTokenizer.js';

describe('tokenizeProse', () => {
  it('splits a single entity token from surrounding text', () => {
    const out = tokenizeProse('Before ⟦entity:npc.jon|Jon⟧ after.');
    expect(out).toEqual([
      { type: 'text', value: 'Before ' },
      { type: 'ref', value: 'Jon', id: 'npc.jon', displayText: 'Jon' },
      { type: 'text', value: ' after.' },
    ]);
  });

  it('handles multiple tokens and adjacent tokens', () => {
    const out = tokenizeProse('⟦entity:faction.iron_guild|Iron Guild⟧ and ⟦entity:npc.mara|Mara⟧');
    expect(out.filter(s => s.type === 'ref').map(s => s.id)).toEqual([
      'faction.iron_guild',
      'npc.mara',
    ]);
    expect(out.find(s => s.type === 'text' && s.value === ' and ')).toBeTruthy();
  });

  it('returns a single text segment for prose with no tokens (old narratives)', () => {
    expect(tokenizeProse('A quiet harbour town.')).toEqual([
      { type: 'text', value: 'A quiet harbour town.' },
    ]);
  });

  it('treats a malformed/unterminated token as plain text, never throws', () => {
    // No closing ⟧ anywhere -> the pattern cannot match -> all plain text.
    const malformed = 'edge ⟦entity:npc.jon|Jon never closes here';
    expect(() => tokenizeProse(malformed)).not.toThrow();
    const out = tokenizeProse(malformed);
    expect(out.every(s => s.type === 'text')).toBe(true);
    expect(out.map(s => s.value).join('')).toBe(malformed);
  });

  it('a token missing the pipe separator does not parse as a ref', () => {
    const noPipe = 'stray ⟦entity:npc.jon Jon⟧ here';
    const out = tokenizeProse(noPipe);
    expect(out.every(s => s.type === 'text')).toBe(true);
    expect(out.map(s => s.value).join('')).toBe(noPipe);
  });

  it('returns [] for non-string / empty input', () => {
    expect(tokenizeProse(null)).toEqual([]);
    expect(tokenizeProse(undefined)).toEqual([]);
    expect(tokenizeProse(42)).toEqual([]);
    expect(tokenizeProse('')).toEqual([]);
  });

  it('round-trips: joining segment values reproduces the display prose', () => {
    const prose = 'The ⟦entity:faction.watch|Watch⟧ answers to ⟦entity:npc.aldric|Aldric⟧.';
    const out = tokenizeProse(prose);
    const display = out.map(s => s.value).join('');
    expect(display).toBe('The Watch answers to Aldric.');
  });
});
