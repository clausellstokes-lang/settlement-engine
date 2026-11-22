/**
 * tests/domain/spatialDigestMemo.test.js — performance-scale-2 / performance-scale-3 pins.
 *
 * THE FIX (F5): ensureWorldState no longer deep-clones the immutable spatialDigest
 * on each of its ~11 calls per tick. The digest is authored ONCE at the canonize
 * seam, deep-frozen, and SHARED BY REFERENCE — so:
 *   • performance-scale-2: the 47-400KB digest is not structuredClone'd 11×/tick;
 *   • performance-scale-3: the digest keeps a STABLE object identity across ticks,
 *     so distanceRead's per-digest WeakMap route memos (CANDIDATE/ADJ/…) HIT every
 *     tick instead of missing on a fresh clone-identity — restoring the design's
 *     "cached at canonize, never re-pathfound per tick" law.
 *
 * These pins assert the OBSERVABLE contract (identity + freeze + memo reuse), and a
 * NEGATIVE CONTROL shows that a fresh-identity digest (the pre-fix per-tick clone)
 * would have missed the memo — i.e. the bug these fixes close.
 */
import { describe, expect, it } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { candidateRoutes } from '../../src/domain/spatial/distanceRead.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { ensureWorldState, deepFreeze } from '../../src/domain/worldPulse/worldState.js';
import { deepClone } from '../../src/domain/clone.js';

function fixtureDigest(count = 8) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, count);
  return buildSpatialDigest({ pack, placements });
}

/** A canonized worldState carrying the digest under the spatial marker. */
function spatialWorldState(digest) {
  return { rngSeed: 'memo-pin', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z', spatialCanonVersion: 1, spatialDigest: digest };
}

describe('performance-scale-2/3 — spatial digest is frozen + shared by reference', () => {
  it('ensureWorldState shares the SAME frozen digest object (no per-call deep clone)', () => {
    const digest = fixtureDigest();
    const ensured = ensureWorldState(spatialWorldState(digest));
    // Reference-shared, not cloned: identical object identity.
    expect(ensured.spatialDigest).toBe(digest);
    // Deep-frozen (the no-alias contract is now an enforced guarantee).
    expect(Object.isFrozen(ensured.spatialDigest)).toBe(true);
    expect(Object.isFrozen(ensured.spatialDigest.gates)).toBe(true);
    expect(Object.isFrozen(ensured.spatialDigest.distanceMatrix)).toBe(true);
  });

  it('digest identity is STABLE across ticks (re-ensuring ensureWorldState output)', () => {
    const digest = fixtureDigest();
    const tick1 = ensureWorldState(spatialWorldState(digest));
    // "Next tick": the engine threads worldState forward via spreads that carry the
    // digest by reference, then re-ensures. Identity must survive.
    const tick2 = ensureWorldState({ ...tick1, tick: 1 });
    expect(tick2.spatialDigest).toBe(tick1.spatialDigest);
    expect(tick2.spatialDigest).toBe(digest);
  });

  it('MEMO HIT: candidateRoutes cached across two ticks reuses the SAME routes array', () => {
    const digest = fixtureDigest();
    const [a, b] = [String(digest.settlementIds[0]), String(digest.settlementIds[digest.settlementIds.length - 1])];

    const tick1 = ensureWorldState(spatialWorldState(digest));
    const routesTick1 = candidateRoutes(tick1.spatialDigest, a, b);
    expect(routesTick1.length).toBeGreaterThan(0); // the pair is reachable

    // A second tick over the SAME (reference-shared) digest identity is a cache HIT:
    // distanceRead's CANDIDATE_MEMO WeakMap returns the identical array it cached on
    // tick 1 — the routes are DERIVED ONCE, never re-Dijkstra'd per tick.
    const tick2 = ensureWorldState({ ...tick1, tick: 1 });
    const routesTick2 = candidateRoutes(tick2.spatialDigest, a, b);
    expect(routesTick2).toBe(routesTick1); // same array reference ⇒ memo reused
  });

  it('NEGATIVE CONTROL: a fresh-identity clone (the pre-fix per-tick clone) MISSES the memo', () => {
    const digest = fixtureDigest();
    const [a, b] = [String(digest.settlementIds[0]), String(digest.settlementIds[digest.settlementIds.length - 1])];
    const routesA = candidateRoutes(digest, a, b);
    // A deep clone is a NEW identity — exactly what ensureWorldState produced every
    // tick before the fix — so the WeakMap memo misses and a fresh array is computed.
    const clonedDigest = deepFreeze(deepClone(digest));
    const routesClone = candidateRoutes(clonedDigest, a, b);
    expect(routesClone).not.toBe(routesA); // different identity ⇒ memo miss (re-solved)
    // …but the routes are byte-equal: reference-sharing changes COST, never OUTPUT.
    expect(routesClone).toEqual(routesA);
  });
});
