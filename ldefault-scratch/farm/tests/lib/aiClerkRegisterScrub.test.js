/**
 * tests/lib/aiClerkRegisterScrub.test.js — C2 (bar 8): THE CLERK'S REGISTER SCRUB.
 *
 * The AI is a bucketing clerk, never a writer with its own voice — and its two
 * most legible tells (the em dash and the exclamation point, VOICE_AND_TONE §3)
 * must not survive the stream into the store or ai_data. scrubClerkRegister is
 * the one gate; these pins hold its contract: every nested string cleaned, all
 * non-string values (numbers, booleans, null) untouched, arrays and objects
 * walked, prototype not polluted.
 */
import { describe, expect, it } from 'vitest';
import { scrubClerkRegister } from '../../src/lib/ai.js';

describe('scrubClerkRegister — the em dash and the exclamation point never land', () => {
  it('replaces an em dash join with a comma join', () => {
    expect(scrubClerkRegister('The mill turns — the town eats.')).toBe('The mill turns, the town eats.');
    expect(scrubClerkRegister('tight—join')).toBe('tight, join');
  });

  it('replaces exclamation points with full stops', () => {
    expect(scrubClerkRegister('The walls hold!')).toBe('The walls hold.');
  });

  it('walks arrays and nested objects; non-strings pass untouched', () => {
    const out = scrubClerkRegister({
      thesis: 'A town of salt — and grudges!',
      npcs: [{ name: 'Serra Voss', goal: { short: 'Rule the quay — alone' }, influence: 3 }],
      population: 2400,
      flag: true,
      nothing: null,
    });
    expect(out).toEqual({
      thesis: 'A town of salt, and grudges.',
      npcs: [{ name: 'Serra Voss', goal: { short: 'Rule the quay, alone' }, influence: 3 }],
      population: 2400,
      flag: true,
      nothing: null,
    });
  });

  it('leaves clean prose byte-identical', () => {
    const s = 'The chronicler set down the pen; the record stands.';
    expect(scrubClerkRegister(s)).toBe(s);
  });

  it('drops prototype-chain keys entirely (the setPath guard\'s sibling)', () => {
    const out = /** @type {Record<string, unknown>} */ (scrubClerkRegister(JSON.parse('{"a":"x—y","__proto__":{"polluted":"yes!"}}')));
    expect(out.a).toBe('x, y');
    expect(out.polluted).toBeUndefined(); // the grafted prototype never lands
    expect(/** @type {Record<string, unknown>} */ ({}).polluted).toBeUndefined();
  });
});
