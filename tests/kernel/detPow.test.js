/**
 * detPow pins — VAR-1's deterministic power kernel (DESIGN_FMG_WEAVE D7).
 *
 * Two things need proving, and only one of them is accuracy.
 *
 * ACCURACY is measured against the platform `Math.pow` across the heightmap
 * interpreter's REAL domain rather than a tidy sample: every published blob and line
 * power, against heights spanning the Uint8 range. `Math.pow` is legitimate HERE —
 * `tests/` is outside the trees the transcendental ratchet scans, and the built-in is
 * the reference being compared against, not a shipped path.
 *
 * PURITY is the claim that actually carries the determinism argument, and it cannot be
 * shown by sampling outputs: the kernel is engine-independent because it is assembled
 * only from correctly-rounded IEEE-754 operations. A source scan asserts exactly that,
 * so the property survives someone later "simplifying" a line back into `Math.pow`.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { detPow, __internals } from '../../src/kernel/detPow.js';

// The interpreter's own published tables — the exponents this kernel actually sees.
const BLOB_POWERS = [0.93, 0.95, 0.97, 0.98, 0.99, 0.991, 0.993, 0.994, 0.995, 0.9955, 0.996, 0.9964, 0.9973];
const LINE_POWERS = [0.75, 0.77, 0.79, 0.81, 0.82, 0.83, 0.84, 0.86, 0.87, 0.88, 0.91, 0.92, 0.93];

function worstRelativeError(bases, exponents) {
  let worst = 0;
  let at = null;
  for (const b of bases) {
    for (const e of exponents) {
      const mine = detPow(b, e);
      const ref = Math.pow(b, e);
      if (ref === 0) continue;
      const rel = Math.abs(mine - ref) / Math.abs(ref);
      if (rel > worst) { worst = rel; at = { b, e, mine, ref }; }
    }
  }
  return { worst, at };
}

describe('detPow — accuracy over the interpreter\'s real domain', () => {
  test('matches Math.pow to better than 1e-12 relative across every published power', () => {
    const bases = [];
    for (let h = 1; h <= 255; h++) bases.push(h);
    // Fractional heights occur too: a blob's change value is a float before clamping.
    for (let h = 1; h < 100; h += 0.5) bases.push(h);
    const { worst, at } = worstRelativeError(bases, [...BLOB_POWERS, ...LINE_POWERS]);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(1e-12);
  });

  test('holds across a wide exponent sweep, not only the published tables', () => {
    const bases = [0.001, 0.5, 1.5, 2, 7, 42, 100, 255, 1e6];
    const exps = [-8, -2.5, -1, -0.3, 0.25, 0.5, 1.7, 3, 8.25];
    const { worst, at } = worstRelativeError(bases, exps);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(1e-12);
  });

  test('the two halves are individually sound', () => {
    for (const x of [0.5, 1, 1.4142, 2, 3, 10, 100, 1024, 1e-6]) {
      expect(Math.abs(__internals.log2Det(x) - Math.log2(x))).toBeLessThan(1e-13);
    }
    for (const y of [-10.5, -1, -0.25, 0, 0.25, 1, 6.75, 20]) {
      const ref = Math.pow(2, y);
      expect(Math.abs(__internals.exp2Det(y) - ref) / ref).toBeLessThan(1e-13);
    }
  });
});

describe('detPow — the defined boundary branches (A1.2.14)', () => {
  test('an exponent of zero is 1 for every base, zero and non-finite included', () => {
    for (const x of [0, 1, 2, -3, Infinity, -Infinity, NaN]) expect(detPow(x, 0)).toBe(1);
    // The platform agrees — the branch is chosen so swapping in for ** is invisible.
    for (const x of [0, 1, 2, -3]) expect(detPow(x, 0)).toBe(Math.pow(x, 0));
  });

  test('a zero base is 0 for a positive exponent and Infinity for a negative one', () => {
    expect(detPow(0, 0.5)).toBe(0);
    expect(detPow(0, 3)).toBe(0);
    expect(detPow(0, -1)).toBe(Infinity);
    expect(detPow(0, 0.5)).toBe(Math.pow(0, 0.5));
    expect(detPow(0, -1)).toBe(Math.pow(0, -1));
  });

  test('an exponent of one is EXACT, not merely close', () => {
    for (const x of [0.1, 1 / 3, 7.7, 99.999]) expect(detPow(x, 1)).toBe(x);
  });

  test('a negative base is REFUSED rather than guessed', () => {
    // Real exponentiation of a negative base is defined only at integer exponents,
    // and this kernel's caller raises non-negative heights only. NaN makes a
    // negative base loud at first use instead of quietly becoming terrain.
    expect(Number.isNaN(detPow(-2, 0.5))).toBe(true);
    expect(Number.isNaN(detPow(-2, 3))).toBe(true);
  });

  test('NaN in, NaN out (except the exponent-zero rule above)', () => {
    expect(Number.isNaN(detPow(NaN, 2))).toBe(true);
    expect(Number.isNaN(detPow(2, NaN))).toBe(true);
  });
});

describe('detPow — determinism is STRUCTURAL, and the scan is the proof', () => {
  const source = readFileSync(fileURLToPath(new URL('../../src/kernel/detPow.js', import.meta.url)), 'utf8');
  // Strip comments so the prose describing the ban does not trip the scan for it.
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

  // THE LIVENESS ANCHOR BOTH SOURCE-SCAN ARMS BELOW STAND ON. A scan over a FILE has a
  // vacuity mode the outputs do not: if the read moved, the module were renamed, or the
  // comment-strip above over-matched and returned nothing, `code` would be empty and
  // EVERY absence claim about it would pass while proving nothing at all. So each arm
  // first pins that `code` is the live kernel it means. The pin is deliberately the
  // module's own export line rather than a length floor: a length floor survives the
  // wrong file being read, and this cannot.
  const KERNEL_SIGNATURE = 'export function detPow(x, y)';

  test('the kernel calls NO implementation-approximated Math function', () => {
    // The ES2026 list the house ratchet uses, minus sqrt (correctly rounded by spec).
    const banned = /\bMath\s*\.\s*(acos|acosh|asin|asinh|atan|atan2|atanh|cbrt|cos|cosh|exp|expm1|hypot|log|log10|log1p|log2|pow|sin|sinh|tan|tanh)\s*\(/;
    expect(code).toContain(KERNEL_SIGNATURE);
    // The pin above proves `code` is the live detPow source, so a drifted read or an
    // over-eager comment-strip reds THERE rather than passing vacuously here.
    // anchored: `code` is pinned to contain the kernel's own export line on the line above
    expect(code).not.toMatch(banned);
  });

  test('the kernel uses NO `**` operator — the very thing it replaces', () => {
    expect(code).toContain(KERNEL_SIGNATURE);
    // anchored: same pin, same reason — an empty `code` cannot satisfy the assertion above
    expect(code).not.toMatch(/\*\*/);
  });

  test('the only Math it touches is floor, which is exact', () => {
    const calls = [...code.matchAll(/\bMath\s*\.\s*(\w+)/g)].map(m => m[1]);
    expect([...new Set(calls)].sort()).toEqual(['NaN', 'floor', 'isFinite', 'isNaN'].filter(n => calls.includes(n)).sort());
    for (const c of calls) expect(['floor']).toContain(c);
  });

  test('repeated calls agree with themselves (no hidden state)', () => {
    const once = BLOB_POWERS.map(p => detPow(37.5, p));
    const twice = BLOB_POWERS.map(p => detPow(37.5, p));
    expect(once).toEqual(twice);
  });
});
