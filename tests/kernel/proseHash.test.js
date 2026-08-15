/**
 * tests/kernel/proseHash.test.js — the pure draw-free variant picker used by the
 * CONTENT-GT-DOSSIER content-volume lane. These guards pin the two laws the lane
 * relies on: PURITY (no rng, no clock — a variant selection consumes ZERO PRNG draws)
 * and CANONICAL-AT-ZERO (a falsy seed selects index 0, so seedless callers are
 * byte-identical to the single-template baseline).
 */
import { describe, it, expect } from 'vitest';
import { fnv1a32, pickVariant } from '../../src/kernel/proseHash.js';

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
