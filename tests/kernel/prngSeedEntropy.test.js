/**
 * prngSeedEntropy.test.js — what generateSeed() must guarantee about a fresh mint.
 *
 * generateSeed() is the ONE ambient-entropy seam in the product: eslint.config.js
 * sanctions Date.now() + Math.random() inside src/kernel/prng.js and nowhere else,
 * and tests/lint/determinismBanCoverage.test.js pins that sanction. The suffix used
 * to come from Math.random alone, whose `toString(36).slice(2, 8)` form returns FEWER
 * than six characters when the draw's base36 expansion is short (a k/36^n double) —
 * a silently shorter seed. It now draws from WebCrypto wherever the host exposes it,
 * with the historical draw kept as the fallback for hosts that do not (bare workers,
 * some test environments).
 *
 * WHAT IS PINNED: shape (base36 alphabet, fixed length, wall-clock prefix), a
 * collision-free burst, and that BOTH branches mint the same shape.
 * WHAT IS NOT: distribution. A uniformity assertion over a live entropy source is a
 * flake generator; the rejection ceiling that keeps the byte fold unbiased is a
 * code-level property, not a statistical claim this suite could settle.
 *
 * NOT A DETERMINISM SHIFT: minting only. An existing seed's stream belongs to
 * seedrandom and is untouched here, so THE PROMISE is unaffected.
 *
 * No `for` loops here on purpose — Array.from keeps every case in the report rather
 * than dying on the first (tests/lint/seedLoopTotality.walker.test.js's class).
 */
import { describe, test, expect, vi } from 'vitest';
import { generateSeed } from '../../src/kernel/prng.js';

/** Characters of entropy after the wall-clock prefix — mirrors SEED_SUFFIX_LEN. */
const SUFFIX_LEN = 6;
const BASE36_RE = /^[0-9a-z]+$/;

/** Mint n seeds without a loop, so a malformed one is reported rather than thrown past. */
const mint = (n) => Array.from({ length: n }, () => generateSeed());

/** The mints whose shape is wrong, as a list the failure message can print. */
const malformed = (mints) => mints.filter(
  (s) => !BASE36_RE.test(s) || s.length !== mints[0].length || s.slice(-SUFFIX_LEN).length !== SUFFIX_LEN,
);

describe('generateSeed mints a well-shaped seed', () => {
  test('base36 throughout, with the mint wall-clock as its prefix', () => {
    const before = Date.now();
    const seed = generateSeed();
    const after = Date.now();

    expect(seed).toMatch(BASE36_RE);
    expect(seed.length).toBeGreaterThan(SUFFIX_LEN);

    // The prefix stays the wall-clock in base36: it is what gives a seed read by eye
    // a coarse mint-order, and consumers that display one rely on nothing else.
    const minted = parseInt(seed.slice(0, seed.length - SUFFIX_LEN), 36);
    expect(minted).toBeGreaterThanOrEqual(before);
    expect(minted).toBeLessThanOrEqual(after);

    expect(seed.slice(-SUFFIX_LEN)).toHaveLength(SUFFIX_LEN);
    expect(seed.slice(-SUFFIX_LEN)).toMatch(BASE36_RE);
  });

  test('every mint has the same length — a short base36 expansion cannot shorten one', () => {
    const mints = mint(2000);
    expect(malformed(mints)).toEqual([]);
    expect(new Set(mints.map((s) => s.length)).size).toBe(1);
  });
});

describe('generateSeed does not repeat itself', () => {
  test('a burst of 10,000 mints produces 10,000 distinct seeds', () => {
    const mints = mint(10_000);
    // Same-millisecond mints share a prefix, so this measures the SUFFIX: a suffix
    // that collapsed to a constant (a broken draw, an empty buffer) reds here.
    expect(new Set(mints).size).toBe(mints.length);
  });
});

describe('the suffix comes from WebCrypto where the host has it', () => {
  test('generateSeed draws through crypto.getRandomValues', () => {
    const spy = vi.spyOn(globalThis.crypto, 'getRandomValues');
    try {
      const seed = generateSeed();
      expect(spy, 'the mint must reach the host entropy source, not Math.random').toHaveBeenCalled();
      expect(seed.slice(-SUFFIX_LEN)).toHaveLength(SUFFIX_LEN);
    } finally {
      spy.mockRestore();
    }
  });
});

describe('the fallback branch, for hosts that expose no WebCrypto', () => {
  test('mints the same shape and stays collision-free with crypto absent', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true });
    try {
      // Liveness: the branch under test is the one that actually ran.
      expect(globalThis.crypto).toBeUndefined();
      const mints = mint(2000);
      expect(malformed(mints)).toEqual([]);
      expect(new Set(mints).size).toBe(mints.length);
    } finally {
      if (original) Object.defineProperty(globalThis, 'crypto', original);
      else delete globalThis.crypto;
    }
  });

  test('a short base36 draw is topped up rather than shortening the seed', () => {
    const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    const originalRandom = Math.random;
    Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true });
    // (0.5).toString(36) is "0.i" — ONE character survives the historical
    // `.slice(2, 8)`. That form returned it as the whole suffix, so the seed lost
    // five characters of entropy and changed shape with nothing to notice.
    Math.random = () => 0.5;
    try {
      expect(generateSeed().slice(-SUFFIX_LEN)).toBe('iiiiii');
    } finally {
      Math.random = originalRandom;
      if (originalCrypto) Object.defineProperty(globalThis, 'crypto', originalCrypto);
      else delete globalThis.crypto;
    }
  });
});
