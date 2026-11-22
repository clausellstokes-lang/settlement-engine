/**
 * tests/kernel/proseHash.test.js — the pure draw-free variant picker used by the
 * CONTENT-GT-DOSSIER content-volume lane. These guards pin the two laws the lane
 * relies on: PURITY (no rng, no clock — a variant selection consumes ZERO PRNG draws)
 * and CANONICAL-AT-ZERO (a falsy seed selects index 0, so seedless callers are
 * byte-identical to the single-template baseline).
 */
import { describe, it, expect } from 'vitest';
import { fnv1a32, mix32, pickVariant, pickVariantMixed } from '../../src/kernel/proseHash.js';

describe('proseHash.fnv1a32 — pure, deterministic, well-distributed', () => {
  it('is deterministic and unsigned-32-bit', () => {
    expect(fnv1a32('Thornwood')).toBe(fnv1a32('Thornwood'));
    expect(fnv1a32('Thornwood')).toBeGreaterThanOrEqual(0);
    expect(fnv1a32('Thornwood')).toBeLessThanOrEqual(0xffffffff);
    expect(fnv1a32('a')).not.toBe(fnv1a32('b'));
  });
  it('spreads a diverse seed space across all indices of a small pool (surjective)', () => {
    for (const len of [2, 3, 4, 5, 6]) {
      const hit = new Set();
      for (let i = 0; i < 3000 && hit.size < len; i += 1) hit.add(fnv1a32(`seed-${i}`) % len);
      expect(hit.size, `pool of ${len} fully reachable`).toBe(len);
    }
  });
});

describe('proseHash.pickVariant — canonical-at-zero + determinism', () => {
  const pool = ['CANON', 'v1', 'v2', 'v3'];
  it('a falsy seed selects index 0 (the canonical string)', () => {
    for (const seed of [null, undefined, '', 0]) {
      expect(pickVariant(pool, seed)).toBe('CANON');
    }
  });
  it('same seed → same pick (stable); different seeds spread', () => {
    expect(pickVariant(pool, 'Ashford:Market')).toBe(pickVariant(pool, 'Ashford:Market'));
    const seen = new Set(Array.from({ length: 60 }, (_, i) => pickVariant(pool, `s${i}`)));
    expect(seen.size, 'variety fires across seeds').toBeGreaterThan(1);
  });
  it('a single-entry pool always returns that entry; empty/non-array → undefined', () => {
    expect(pickVariant(['only'], 'anySeed')).toBe('only');
    expect(pickVariant([], 'x')).toBeUndefined();
    expect(pickVariant(null, 'x')).toBeUndefined();
  });
  it('draws NO randomness — result depends only on (pool, seed), not call order', () => {
    // If pickVariant touched an rng, interleaving calls would perturb each other.
    const a = pickVariant(pool, 'k1');
    pickVariant(pool, 'noise');
    const b = pickVariant(pool, 'k1');
    expect(a).toBe(b);
  });
});

/**
 * THE LOW-BIT FAULT and its cure. FNV-1a's low bits never mix: the low two bits of
 * fnv1a32 depend only on the low two bits of each key character, in order. So for a pool
 * of four, keys that differ only in the HIGH bits of their characters all take one line.
 * (a) pins that property on the unchanged pickVariant so nobody "fixes" it silently
 * (births in production draw their prose with it); (b)–(e) pin pickVariantMixed.
 */
describe('proseHash.pickVariantMixed — the mixed keyed pick for new pools', () => {
  // Every char here has char code ≡ 1 (mod 4): 'a','e','i','m','q','u','y' are all …01.
  const ALPHABET = ['a', 'e', 'i', 'm', 'q', 'u', 'y'];
  const FAMILY = [];
  for (const x of ALPHABET) {
    for (const y of ALPHABET) {
      for (const z of ALPHABET) FAMILY.push(`${x}${y}${z}::feast`);
    }
  }
  const POOL4 = ['L0', 'L1', 'L2', 'L3'];

  it('(a) THE FAULT: pickVariant gives ONE line to a whole high-bit-only key family', () => {
    expect(new Set(FAMILY).size).toBeGreaterThanOrEqual(200);
    const lines = new Set(FAMILY.map((k) => pickVariant(POOL4, k)));
    expect(lines.size, 'pickVariant reads only the low two bits of each char').toBe(1);
  });

  it('(b) THE CURE: pickVariantMixed reaches all 4 lines, none over 40% of the family', () => {
    const counts = new Map();
    for (const k of FAMILY) {
      const line = pickVariantMixed(POOL4, k);
      counts.set(line, (counts.get(line) ?? 0) + 1);
    }
    expect(counts.size).toBe(4);
    const top = Math.max(...counts.values()) / FAMILY.length;
    expect(top, `top share ${top.toFixed(3)}`).toBeLessThanOrEqual(0.4);
  });

  it('(c) contract parity with pickVariant: falsy seeds, empty/non-array, single entry', () => {
    const pool = ['CANON', 'v1', 'v2', 'v3'];
    // Collected, not asserted per case: every case runs and the one assertion lists them all.
    const falsy = [null, undefined, '', 0, NaN, false].map((s) => [
      pickVariantMixed(pool, s),
      pickVariant(pool, s),
    ]);
    expect(falsy).toEqual(falsy.map(() => ['CANON', 'CANON']));
    const bad = [[], null, undefined, 'abc', 7, {}].map((p) => [
      pickVariantMixed(p, 'x'),
      pickVariant(p, 'x'),
    ]);
    expect(bad).toEqual(bad.map(() => [undefined, undefined]));
    const single = ['anySeed', 'k1', 42, null].map((s) => [
      pickVariantMixed(['only'], s),
      pickVariant(['only'], s),
    ]);
    expect(single).toEqual(single.map(() => ['only', 'only']));
  });

  it('(d) spread on varied keys: commonest line ≤ 1.6 × 1/n for every pool size', () => {
    const SIZE_WORDS = ['tiny', 'small', 'modest', 'large', 'grand', 'vast'];
    for (const n of [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16]) {
      const pool = Array.from({ length: n }, (_, i) => i);
      const counts = new Array(n).fill(0);
      let total = 0;
      for (const size of SIZE_WORDS) {
        for (let i = 0; i < 200; i += 1) {
          const key = `hxd-${size}-${i}::some.label::npc_${i % 7}`;
          counts[pickVariantMixed(pool, key)] += 1;
          total += 1;
        }
      }
      expect(total).toBe(1200);
      const top = Math.max(...counts) / total;
      expect(top, `pool of ${n}: top share ${top.toFixed(3)}`).toBeLessThanOrEqual(1.6 / n);
    }
  });

  it('(e) determinism: same seed → same pick; mix32 is an unsigned 32-bit integer', () => {
    const pool = ['CANON', 'v1', 'v2', 'v3', 'v4'];
    expect(pickVariantMixed(pool, 'Ashford:Market')).toBe(pickVariantMixed(pool, 'Ashford:Market'));
    const a = pickVariantMixed(pool, 'k1');
    pickVariantMixed(pool, 'noise');
    expect(pickVariantMixed(pool, 'k1')).toBe(a);
    for (const h of [0, 1, 0x7fffffff, 0x80000000, 0xffffffff, fnv1a32('Thornwood')]) {
      const m = mix32(h);
      expect(Number.isInteger(m)).toBe(true);
      expect(m).toBeGreaterThanOrEqual(0);
      expect(m).toBeLessThanOrEqual(0xffffffff);
      expect(mix32(h)).toBe(m);
    }
  });
});
