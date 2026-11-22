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

describe('tokenizeProse — pronoun links (the contract extension)', () => {
  it('parses a pronoun token as a ref carrying verbatim:true and the wrapped word', () => {
    const out = tokenizeProse('Aldric rules; ⟦pronoun:npc.aldric|he⟧ answers to no one.');
    expect(out).toEqual([
      { type: 'text', value: 'Aldric rules; ' },
      { type: 'ref', value: 'he', id: 'npc.aldric', displayText: 'he', verbatim: true },
      { type: 'text', value: ' answers to no one.' },
    ]);
  });

  it('does NOT put a verbatim key on a name (entity) ref — its shape is unchanged', () => {
    const [ref] = tokenizeProse('⟦entity:npc.jon|Jon⟧').filter(s => s.type === 'ref');
    expect(ref).toEqual({ type: 'ref', value: 'Jon', id: 'npc.jon', displayText: 'Jon' });
    expect('verbatim' in ref).toBe(false);
  });

  it('parses entity and pronoun tokens together, preserving order', () => {
    const out = tokenizeProse('⟦entity:faction.guild|the Guild⟧ took the mint; ⟦pronoun:faction.guild|they⟧ hold it.');
    const refs = out.filter(s => s.type === 'ref');
    expect(refs.map(r => [r.id, r.value, !!r.verbatim])).toEqual([
      ['faction.guild', 'the Guild', false],
      ['faction.guild', 'they', true],
    ]);
  });

  it('round-trips a pronoun token to its bare word (de-tokenized display)', () => {
    const prose = 'The seat is empty and ⟦pronoun:npc.mara|she⟧ knows it.';
    const display = tokenizeProse(prose).map(s => s.value).join('');
    expect(display).toBe('The seat is empty and she knows it.');
  });

  it('treats a malformed pronoun token as plain text, never throws', () => {
    const malformed = 'stray ⟦pronoun:npc.jon he⟧ here'; // no pipe → not a ref
    const out = tokenizeProse(malformed);
    expect(out.every(s => s.type === 'text')).toBe(true);
    expect(out.map(s => s.value).join('')).toBe(malformed);
  });
});
