/**
 * formatNumber.test.js — pins for the determinism-critical number formatter.
 *
 * formatCount replaced the host-locale toLocaleString() calls that persisted
 * settlement output (foodBalance / viability warnings, world-pulse candidate
 * summaries, the AI-layer prompt, the dossier view model). Two contracts:
 *
 *   1. BYTE-EQUALITY with Number.prototype.toLocaleString('en-US') over the
 *      integer domain the engine emits — this is what made the swap
 *      golden-master-preserving (the manifest was captured on an
 *      en-US-grouping host, so identical bytes ⇒ identical sha256 hashes).
 *   2. HOST-LOCALE INDEPENDENCE by construction: pure string transform, no
 *      Intl, no toLocale*, so tr_TR/de_DE/ar_EG hosts produce the same bytes.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import fc from 'fast-check';
import { formatCount } from '../../src/domain/formatNumber.js';

describe('formatCount — en-US byte-equality (the golden-preserving contract)', () => {
  test('matches toLocaleString("en-US") on hand-picked boundary integers', () => {
    const cases = [
      0, 1, 9, 10, 99, 100, 999, 1000, 1001, 8000, 9999, 10000, 99999,
      100000, 999999, 1000000, 1234567, 987654321,
      -1, -999, -1000, -1234567,
    ];
    for (const n of cases) {
      expect(formatCount(n), `formatCount(${n})`).toBe(n.toLocaleString('en-US'));
    }
  });

  test('property: matches toLocaleString("en-US") for every integer the engine can emit', () => {
    fc.assert(
      fc.property(fc.integer({ min: -10_000_000, max: 10_000_000 }), (n) => {
        expect(formatCount(n)).toBe(n.toLocaleString('en-US'));
      }),
      { numRuns: 2000 },
    );
  });

  test('fractional values group the integer part and keep ≤3 decimals (defensive path)', () => {
    expect(formatCount(1234.5)).toBe('1,234.5');
    expect(formatCount(1234.567)).toBe('1,234.567');
    expect(formatCount(0.25)).toBe('0.25');
    expect(formatCount(-1234.5)).toBe('-1,234.5');
  });

  test('non-finite input returns a stable token instead of host-locale glyphs', () => {
    expect(formatCount(NaN)).toBe('NaN');
    expect(formatCount(Infinity)).toBe('Infinity');
    expect(formatCount('not a number')).toBe('NaN');
  });
});

describe('formatCount — locale-independent by construction', () => {
  test('the module is pure and table-free: no imports, no Intl, no toLocale*', () => {
    const src = readFileSync(
      fileURLToPath(new URL('../../src/domain/formatNumber.js', import.meta.url)),
      'utf8',
    );
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    // domain-kernel style: no imports (pure, self-contained).
    expect(code).not.toMatch(/^\s*import\s/m);
    // Must not itself reach for the host locale.
    expect(code).not.toMatch(/toLocale/);
    expect(code).not.toMatch(/\bIntl\b/);
  });
});
