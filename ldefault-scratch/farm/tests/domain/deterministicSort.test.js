/**
 * deterministicSort.test.js — the determinism-critical string comparator (F13).
 *
 * compareCodepoint is the ONLY string order safe to feed the seeded pipeline:
 * it compares by UTF-16 code unit via the built-in relational operators, a
 * fixed table-free order that is identical on every device and in every locale.
 * localeCompare is banned in src/generators/** + src/domain/** precisely because
 * its ICU/CLDR collation is host- and locale-dependent (see the ban in
 * eslint.config.js + tests/lint/localeCompareGuard.test.js).
 */
import { describe, it, expect } from 'vitest';
import { compareCodepoint, byNameCodepoint } from '../../src/domain/deterministicSort.js';

describe('compareCodepoint — the cross-device-stable string order', () => {
  it('returns a negative / zero / positive number matching < = > codepoint order', () => {
    expect(compareCodepoint('a', 'b')).toBeLessThan(0);
    expect(compareCodepoint('b', 'a')).toBeGreaterThan(0);
    expect(compareCodepoint('a', 'a')).toBe(0);
  });

  it('orders by raw code unit — uppercase (U+0041…) sorts before lowercase (U+0061…)', () => {
    // localeCompare would typically fold case (a < B); codepoint does NOT.
    expect(compareCodepoint('B', 'a')).toBeLessThan(0); // 'B'=66 < 'a'=97
    expect(compareCodepoint('Z', 'a')).toBeLessThan(0);
  });

  it('is byte-stable for non-ASCII: Zurich sorts BEFORE Åby (Z=U+005A < Å=U+00C5)', () => {
    // This is the whole point of F13: a Swedish locale collates Å last (Zurich <
    // Åby), an English locale collates Å like A (Åby < Zurich) — localeCompare
    // would disagree across hosts. Codepoint gives ONE answer everywhere.
    expect(compareCodepoint('Åby', 'Zurich')).toBeGreaterThan(0);
    expect(compareCodepoint('Zurich', 'Åby')).toBeLessThan(0);
  });

  it('coerces null/undefined to the empty string (never throws, always total)', () => {
    expect(compareCodepoint(null, null)).toBe(0);
    expect(compareCodepoint(undefined, undefined)).toBe(0);
    expect(compareCodepoint(null, undefined)).toBe(0);     // '' === ''
    expect(compareCodepoint(null, 'a')).toBeLessThan(0);   // '' < 'a'
    expect(compareCodepoint('a', undefined)).toBeGreaterThan(0);
  });

  it('coerces non-strings deterministically (numbers, etc.)', () => {
    expect(compareCodepoint(2, 10)).toBeGreaterThan(0); // '2' > '10' as strings
    expect(compareCodepoint(1, 2)).toBeLessThan(0);
  });

  it('produces a stable total order when used as a sort comparator', () => {
    const input = ['banana', 'Apple', 'Zebra', 'åpple', 'apple', ''];
    const sorted = input.slice().sort(compareCodepoint);
    // codepoint order: '' , 'A'(65)pple, 'Z'(90)ebra, 'a'(97)pple, 'b'anana, 'å'(229)pple
    expect(sorted).toEqual(['', 'Apple', 'Zebra', 'apple', 'banana', 'åpple']);
    // Sorting the already-sorted array is a fixpoint.
    expect(sorted.slice().sort(compareCodepoint)).toEqual(sorted);
    // Order is independent of input permutation (determinism).
    expect(input.slice().reverse().sort(compareCodepoint)).toEqual(sorted);
  });
});

describe('byNameCodepoint — codepoint order on the { name } shape', () => {
  it('sorts objects by their name field in codepoint order', () => {
    const out = [{ name: 'Zeta' }, { name: 'Beta' }, { name: 'Alpha' }].sort(byNameCodepoint);
    expect(out.map((o) => o.name)).toEqual(['Alpha', 'Beta', 'Zeta']);
  });

  it('treats a missing/nullish name as the empty string (no throw)', () => {
    const out = [{ name: 'b' }, {}, { name: null }, { name: 'a' }].sort(byNameCodepoint);
    // the two nameless entries ('') sort first, then 'a', then 'b'
    expect(out[out.length - 1].name).toBe('b');
    expect(out[0].name ?? '').toBe('');
  });
});
