/**
 * detMath IDENTITY WALKER — the structural half of T13's kernel proof.
 *
 * `detMath.test.js` measures ACCURACY. This file proves the two things accuracy sampling
 * can never show:
 *
 *   1. DETERMINISM IS STRUCTURAL. The kernel is engine-independent because it is
 *      assembled only from correctly-rounded IEEE-754 operations — not because a sample
 *      of outputs looked right. A source scan asserts exactly that, so the property
 *      survives someone later "simplifying" a Horner line back into `Math.exp`. This is
 *      the detPow.test.js idiom, liveness anchor and all.
 *
 *   2. THE WRAPPERS HAVE NOT DRIFTED FROM THE CORE. §5's consolidation law: one shared
 *      primitive core with thin named wrappers, so a precision fix lands in ONE place.
 *      A wrapper that quietly grows its own arithmetic breaks that promise silently —
 *      the fnv1a32 lesson (J-T7-I), where twenty-two hand-copies of one hash drifted
 *      apart unnoticed. Each wrapper is pinned to its defining relation over a probe set.
 *
 *   3. THE detPow COPY IS POLICED. `src/kernel/detPow.js` keeps its own copy of the two
 *      series because its suite's liveness anchor pins its own `export function detPow`
 *      line, so folding it onto this core would cost the very guard that proves it
 *      deterministic. The copies therefore coexist — and the arms below pin that they
 *      agree to within 1e-13 AND that this core is never the less accurate of the two,
 *      so a drift between them cannot land silently in either direction.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { log2Det, detExp, detExpm1, detLn, detLog10, __internals } from '../../src/kernel/detMath.js';
import { exp2Det, detTanh, halfLifeKeep, detIntPow } from '../../src/kernel/detMathDecay.js';
import { __internals as detPowInternals } from '../../src/kernel/detPow.js';

/** A probe set spanning every real domain the cured sites present. */
const POSITIVE_PROBES = [
  1e-6, 1e-4, 0.002, 0.06, 0.09, 0.25, 0.5, 0.75, 0.85, 0.9375, 0.94, 0.98, 0.999,
  1, 1.0001, 1.5, 2, Math.SQRT2, 3, 10, 52, 104, 156, 260, 312, 1000, 65536, 1e6, 1e7,
];
const REAL_PROBES = [
  -100, -50, -40, -20, -10, -5, -2, -1, -0.5, -0.1, -0.01, -1e-4, -1e-8,
  0, 1e-8, 1e-4, 0.01, 0.1, 0.5, 1, 2, 5, 10, 20, 40, 50,
];

describe('detMath — determinism is STRUCTURAL, and the scan is the proof', () => {
  const read = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
  const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  // BOTH halves of the split kernel are scanned. Asserting over both inside each test
  // rather than minting a second describe keeps the title count flat and makes it
  // impossible to add a third kernel file that quietly escapes the scan.
  const source = read('../../src/kernel/detMath.js');
  const decaySource = read('../../src/kernel/detMathDecay.js');
  const code = strip(source);
  const decayCode = strip(decaySource);

  // THE LIVENESS ANCHOR BOTH SOURCE-SCAN ARMS BELOW STAND ON. A scan over a FILE has a
  // vacuity mode the outputs do not: if the read moved, the module were renamed, or the
  // comment-strip over-matched and returned nothing, `code` would be empty and EVERY
  // absence claim about it would pass while proving nothing at all. The pin is the
  // module's own export line rather than a length floor — a length floor survives the
  // wrong file being read, and this cannot.
  const KERNEL_SIGNATURE = 'export function detExp(x)';
  const DECAY_SIGNATURE = 'export function exp2Det(y)';

  test('the kernel calls NO implementation-approximated Math function', () => {
    // The ES2026 list the house ratchet uses, minus sqrt (correctly rounded by spec).
    const banned = /\bMath\s*\.\s*(acos|acosh|asin|asinh|atan|atan2|atanh|cbrt|cos|cosh|exp|expm1|hypot|log|log10|log1p|log2|pow|sin|sinh|tan|tanh)\s*\(/;
    expect(code).toContain(KERNEL_SIGNATURE);
    expect(decayCode).toContain(DECAY_SIGNATURE);
    // anchored: each source is pinned to contain its own export line on the lines above
    expect(code).not.toMatch(banned);
    // anchored: the decay source is pinned to contain its own export line two lines above — an empty or wrong file cannot satisfy that pin, so this assertion cannot outlive its subject
    expect(decayCode).not.toMatch(banned);
  });

  test('the kernel uses NO `**` operator — the very thing it replaces', () => {
    expect(code).toContain(KERNEL_SIGNATURE);
    expect(decayCode).toContain(DECAY_SIGNATURE);
    // anchored: same pins, same reason — an empty source cannot satisfy them
    expect(code).not.toMatch(/\*\*/);
    // anchored: the same two pins above hold this line up — the decay source must contain its own export line before this can pass on an empty read
    expect(decayCode).not.toMatch(/\*\*/);
  });

  test('the only Math member the kernel touches is the EXACT floor', () => {
    expect(code).toContain(KERNEL_SIGNATURE);
    expect(decayCode).toContain(DECAY_SIGNATURE);
    // \b matters: without it this matches `Math.js` inside the import specifier
    // `./detMath.js` and reports a Math member that does not exist. Measured — the
    // split introduced exactly that false positive on its first run.
    const membersOf = (t) => [...new Set((t.match(/\bMath\s*\.\s*[A-Za-z0-9_]+/g) || []).map((m) => m.replace(/\s+/g, '')))];
    expect(membersOf(code)).toEqual(['Math.floor']);
    expect(membersOf(decayCode)).toEqual(['Math.floor']);
  });

  test('the counter that governs the ratchet scores this file at ZERO sites', async () => {
    const counter = await import('../../scripts/count-transcendental-math.mjs');
    expect(counter.countText(source)).toBe(0);
    expect(counter.countText(decaySource)).toBe(0);
  });
});

describe('detMath — the wrappers still delegate to the ONE core', () => {
  test('detExp agrees with the core relation e^x = 2^(x/ln2) across the probe set', () => {
    let worst = 0;
    for (const x of REAL_PROBES) {
      const viaWrapper = detExp(x);
      const viaCore = exp2Det(x * __internals.LOG2E);
      if (viaCore === 0 || !Number.isFinite(viaCore)) continue;
      const rel = Math.abs(viaWrapper - viaCore) / Math.abs(viaCore);
      if (rel > worst) worst = rel;
    }
    // The wrapper is DELIBERATELY the more accurate route (Cody-Waite reduction), so it
    // is pinned to AGREE with the core, not to equal it bit-for-bit.
    expect(worst).toBeLessThan(1e-13);
  });

  test('detLn is exactly log2Det scaled by ln2 — no second implementation', () => {
    for (const x of POSITIVE_PROBES) {
      if (x === 1) continue;
      expect(detLn(x)).toBe(log2Det(x) * __internals.LN2);
    }
  });

  test('detLog10 is exactly log2Det scaled by log10(2) — no second implementation', () => {
    for (const x of POSITIVE_PROBES) {
      if (x === 1) continue;
      expect(detLog10(x)).toBe(log2Det(x) * __internals.LOG10_2);
    }
  });

  test('halfLifeKeep is exactly exp2Det on the negated ratio — no second implementation', () => {
    for (const h of [52, 104, 156, 260, 312]) {
      for (const age of [0, 1, 7, 52, 100, 260, 1000, 5200]) {
        expect(halfLifeKeep(age, h)).toBe(exp2Det(-(age / h)));
      }
    }
  });

  test('detTanh is exactly the expm1 form of its defining relation', () => {
    for (const x of REAL_PROBES) {
      if (x === 0) continue;
      const negative = x < 0;
      const a = negative ? -x : x;
      const m = detExpm1(-2 * a);
      const expected = negative ? -(-m / (m + 2)) : -m / (m + 2);
      expect(detTanh(x)).toBe(expected);
    }
  });

  test('detExpm1 delegates to detExp EXACTLY on its far branch — no second exp', () => {
    // Outside the cancellation-prone band the function is DEFINED as `detExp(x) - 1`, so
    // the identity is bit-exact and a second implementation appearing here would red.
    // (The round trip `expm1(x) + 1 === exp(x)` is deliberately NOT asserted: re-adding
    // the 1 destroys exactly the digits expm1 exists to preserve, so it measures the
    // round trip's loss, not this module's delegation.)
    for (const x of REAL_PROBES) {
      if (x > -0.35 && x < 0.35) continue;
      expect(detExpm1(x)).toBe(detExp(x) - 1);
    }
  });

  test('detExpm1 beats the naive `exp(x) - 1` on the near band it exists for', () => {
    let worstMine = 0;
    let worstNaive = 0;
    for (let i = 1; i <= 2000; i += 1) {
      const x = -0.2 + (0.4 * i) / 2000;
      const ref = Math.expm1(x);
      if (ref === 0) continue;
      const mine = Math.abs(detExpm1(x) - ref) / Math.abs(ref);
      const naive = Math.abs((detExp(x) - 1) - ref) / Math.abs(ref);
      if (mine > worstMine) worstMine = mine;
      if (naive > worstNaive) worstNaive = naive;
    }
    expect(worstMine).toBeLessThan(1e-14);
    expect(worstNaive).toBeGreaterThan(worstMine);
  });

  test('detIntPow agrees with the general route at the integer exponents they share', () => {
    let worst = 0;
    for (const b of [0.5, 0.75, 0.85, 0.94, 0.98]) {
      for (const n of [2, 3, 5, 8, 13, 21, 34]) {
        const viaLadder = detIntPow(b, n);
        const viaSeries = exp2Det(n * log2Det(b));
        const rel = Math.abs(viaLadder - viaSeries) / viaSeries;
        if (rel > worst) worst = rel;
      }
    }
    expect(worst).toBeLessThan(1e-13);
  });
});

describe('detMath — the detPow copy is policed, in BOTH directions', () => {
  test('the two log2 copies are BIT-IDENTICAL — detPow`s body was taken verbatim', () => {
    for (const x of POSITIVE_PROBES) {
      expect(log2Det(x)).toBe(detPowInternals.log2Det(x));
    }
  });

  test('the two exp2 copies agree to within 1e-13 across the probe set', () => {
    let worst = 0;
    for (const y of REAL_PROBES) {
      const mine = exp2Det(y);
      const theirs = detPowInternals.exp2Det(y);
      if (theirs === 0 || !Number.isFinite(theirs)) continue;
      const rel = Math.abs(mine - theirs) / theirs;
      if (rel > worst) worst = rel;
    }
    expect(worst).toBeLessThan(1e-13);
  });

  test('this core is NEVER the less accurate of the two exp2 implementations', () => {
    // The improvement (round-to-nearest reduction) must be durable: if someone reverts it,
    // this reds rather than silently returning the kernel to detPow's grade.
    let mineWorst = 0;
    let theirsWorst = 0;
    for (let i = 0; i <= 20000; i += 1) {
      const y = -200 + (400 * i) / 20000;
      const ref = Math.pow(2, y);
      if (ref === 0 || !Number.isFinite(ref)) continue;
      const a = Math.abs(exp2Det(y) - ref) / ref;
      const b = Math.abs(detPowInternals.exp2Det(y) - ref) / ref;
      if (a > mineWorst) mineWorst = a;
      if (b > theirsWorst) theirsWorst = b;
    }
    expect(mineWorst).toBeLessThanOrEqual(theirsWorst);
    // And the improvement is not marginal — it is the reason the §3 budgets are met.
    // Stated as a STRICT improvement rather than against a fixed figure for the other
    // copy: the loser's worst case is sampling-dependent, and pinning a number for it
    // would make this arm red on a denser grid for no reason of substance.
    expect(mineWorst).toBeLessThan(1e-14);
    expect(theirsWorst).toBeGreaterThan(mineWorst);
  });
});
