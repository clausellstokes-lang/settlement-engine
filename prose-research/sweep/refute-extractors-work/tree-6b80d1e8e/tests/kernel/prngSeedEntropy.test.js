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
 * ── THE 10,000-MINT BURST IS NO LONGER A FLAKE (T7 · HYGIENE, ODQ §766.2) ──
 * It used to be, and it was ruled one: a hard EQUALITY over a birthday problem, measured at
 * ~0.072% and parked at §429/§753.2(a) with "re-run, never bank" — the habit this estate
 * otherwise forbids, and a gate that trains operators to wave off reds. The cause is gone,
 * not the assertion: mints inside one millisecond used to be told apart ONLY by their
 * entropy, and now carry a per-millisecond SEQUENCE. Two mints in a millisecond differ in
 * the sequence; two in different milliseconds differ in the prefix. Within one module
 * instance a repeat is IMPOSSIBLE, and the arm below asserts that structure directly rather
 * than trusting the burst to keep getting lucky.
 *
 * WHAT IS PINNED: shape (base36 alphabet, fixed length, wall-clock prefix), a
 * collision-free burst AND the structural reason it is collision-free, and that BOTH
 * branches mint the same shape.
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
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import {
  SEED_ENTROPY_LEN, SEED_SEQUENCE_LEN, SEED_SUFFIX_LEN, generateSeed,
} from '../../src/kernel/prng.js';

/**
 * The widths are IMPORTED, never restated. The earlier draft carried its own `= 6` beside a
 * comment saying it mirrored the source — the writer/reader spelling-drift class, and it
 * would have gone stale the moment the suffix grew (it did, in this very wave).
 */
const SUFFIX_LEN = SEED_SUFFIX_LEN;
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

  test('…and it is BY CONSTRUCTION: mints sharing a millisecond carry distinct sequences', () => {
    // The arm that makes the burst above a structural claim instead of a lucky one. Group the
    // burst by wall-clock prefix and assert every group's SEQUENCE field is collision-free.
    // If the sequence were removed, two mints in one millisecond would be distinguishable
    // only by entropy — the birthday problem this test used to be a ~0.072% flake over.
    const mints = mint(10_000);
    const sequenceOf = (s) => s.slice(-SUFFIX_LEN, -SEED_ENTROPY_LEN);
    const prefixOf = (s) => s.slice(0, s.length - SUFFIX_LEN);

    /** @type {Map<string, string[]>} */
    const byMillisecond = new Map();
    for (const seed of mints) {
      const key = prefixOf(seed);
      if (!byMillisecond.has(key)) byMillisecond.set(key, []);
      /** @type {string[]} */ (byMillisecond.get(key)).push(sequenceOf(seed));
    }

    const collisions = [...byMillisecond.entries()]
      .filter(([, seqs]) => new Set(seqs).size !== seqs.length)
      .map(([ms, seqs]) => `${ms}: ${seqs.length} mints, ${new Set(seqs).size} distinct sequences`);
    expect(collisions, 'two mints in one millisecond shared a sequence — the guarantee is gone')
      .toEqual([]);

    // ANTI-VACUITY: the grouping must actually have found crowded milliseconds, or the
    // assertion above is a check over singletons. A 10,000-mint burst takes far fewer than
    // 10,000 milliseconds on any machine that can run this suite.
    const busiest = Math.max(...[...byMillisecond.values()].map((v) => v.length));
    expect(busiest, 'no millisecond held two mints — this burst proved nothing').toBeGreaterThan(1);

    // Every sequence is fixed-width base36, so the seed length cannot move with the counter.
    // COLLECTED, not asserted inline: an inline loop stops at the first bad mint, so its
    // failure count is a lower bound and every later mint goes unrun — which is exactly the
    // habit this file's own header says it does not keep.
    const widthFailures = collectSeedFailures(mints.slice(0, 200), (seed) => {
      expect(sequenceOf(seed)).toHaveLength(SEED_SEQUENCE_LEN);
      expect(sequenceOf(seed)).toMatch(BASE36_RE);
    });
    expectNoSeedFailures(widthFailures, 'every minted sequence is fixed-width base36');
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
      // Only the ENTROPY tail is the fallback draw's; the sequence sits ahead of it.
      expect(generateSeed().slice(-SEED_ENTROPY_LEN)).toBe('i'.repeat(SEED_ENTROPY_LEN));
    } finally {
      Math.random = originalRandom;
      if (originalCrypto) Object.defineProperty(globalThis, 'crypto', originalCrypto);
      else delete globalThis.crypto;
    }
  });
});
