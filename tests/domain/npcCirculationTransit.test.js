/**
 * npcCirculationTransit.test.js — W-H3: THE TRAVEL PHYSICS OF A WANDERER.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §6 TRAVEL PHYSICS, owner amendment 2026-07-31.)
 *
 * ONE HOP PER TICK, CONNECTED ONLY, MID-ROUTE AT ANY PAUSE. The one-hop rule is asserted
 * two ways on purpose, because each catches a different way of breaking it:
 *   - STRUCTURALLY, by proving the chosen next node is DIRECTLY connected (its cheapest
 *     route from the walker's current settlement is a two-node path, which can only be
 *     true of an adjacent node);
 *   - BEHAVIOURALLY, by walking a whole journey tick by tick and asserting the visited
 *     sequence is the road's own node order with nothing skipped.
 * A teleporting implementation passes neither; an implementation that walks the right
 * road but takes two edges in one advance passes the first and fails the second.
 *
 * THE HIDDEN-PATH SEAM IS PINNED AS A SEAM: absent the callback the module is byte-
 * identical to the road-only reading, which is what makes it a convention between the H
 * and J programs rather than a dependency of one on the other.
 */
import { describe, test, expect } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import {
  advanceWanderer,
  nextHopToward,
  planWanderLeg,
  wanderPosition,
} from '../../src/domain/worldPulse/npcCirculationTransit.js';
import { candidateRoutes } from '../../src/domain/spatial/distanceRead.js';
import { NPC_CONSEQUENCES_TUNING } from '../../src/domain/worldPulse/npcConsequencesTuning.js';

/** A four-town road: a - b - c - far, with the last leg a long haul. */
function roadDigest() {
  return {
    settlementIds: ['a', 'b', 'c', 'far'],
    gates: [
      { between: ['a', 'b'], cost: 100 },
      { between: ['b', 'c'], cost: 100 },
      { between: ['c', 'far'], cost: 2800 },
    ],
    distanceMatrix: {
      a: { b: 100, c: 200, far: 3000 },
      b: { a: 100, c: 100, far: 2900 },
      c: { a: 200, b: 100, far: 2800 },
      far: { a: 3000, b: 2900, c: 2800 },
    },
    tiers: {
      a: { b: 1, c: 2, far: 3 },
      b: { a: 1, c: 1, far: 3 },
      c: { a: 2, b: 1, far: 3 },
      far: { a: 3, b: 3, c: 3 },
    },
  };
}

/** Is `to` DIRECTLY connected to `from` in the digest's own routing graph? A two-node
 *  cheapest path is the estate's own answer, read through the estate's own function. */
function directlyConnected(digest, from, to) {
  const routes = candidateRoutes(digest, from, to, 1);
  return routes.length > 0 && Array.isArray(routes[0].path) && routes[0].path.length === 2;
}

/** Walk a whole journey one tick at a time and report the settlements actually stood in. */
function walk({ digest, fromId, destId, ticks, hiddenHopsOf = null }) {
  let leg = null;
  let at = fromId;
  const visited = [fromId];
  const midRouteTicks = [];
  for (let tick = 0; tick < ticks; tick += 1) {
    const step = advanceWanderer({ digest, atSettlementId: at, leg, destId, tick, hiddenHopsOf });
    leg = step.leg;
    at = step.atSettlementId;
    if (!at) midRouteTicks.push(tick);
    else if (visited[visited.length - 1] !== at) visited.push(at);
    if (at === destId) break;
  }
  return { visited, midRouteTicks, at, leg };
}

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6 — ONE HOP PER TICK, on connected routes only', () => {
  test('the tuning declares one hop, and the chosen node is directly connected', () => {
    expect(NPC_CONSEQUENCES_TUNING.TRAVEL_HOPS_PER_TICK).toBe(1);
    const digest = roadDigest();
    const failures = collectSeedFailures(
      [['a', 'far'], ['a', 'c'], ['far', 'a'], ['b', 'far'], ['c', 'a']],
      ([from, dest]) => {
        const hop = nextHopToward({ digest, fromId: from, destId: dest });
        expect(hop).not.toBeNull();
        expect(hop.hidden).toBe(false);
        expect(directlyConnected(digest, from, hop.toId)).toBe(true);
      },
    );
    expectNoSeedFailures(failures, 'every planned hop lands on a directly connected settlement');
  });

  test('a whole journey visits every intermediate town in road order, skipping none', () => {
    const digest = roadDigest();
    const journey = walk({ digest, fromId: 'a', destId: 'far', ticks: 200 });
    expect(journey.visited).toEqual(['a', 'b', 'c', 'far']);
    expect(journey.at).toBe('far');
  });

  test('the walker is MID-ROUTE at a pause on the long haul', () => {
    const digest = roadDigest();
    const journey = walk({ digest, fromId: 'a', destId: 'far', ticks: 200 });
    // The c-to-far leg is thirty weeks, so there are real ticks with the walker nowhere.
    expect(journey.midRouteTicks.length).toBeGreaterThan(10);
    const leg = planWanderLeg({ digest, fromId: 'c', destId: 'far', tick: 5 });
    expect(leg).toEqual({ fromId: 'c', toId: 'far', departTick: 5, arrivalTick: 5 + 28 });
    const half = wanderPosition(leg, 19);
    expect(half.arrived).toBe(false);
    expect(half.atSettlementId).toBeNull();
    expect(half.progress01).toBeGreaterThan(0);
    expect(half.progress01).toBeLessThan(1);
    expect(wanderPosition(leg, 33)).toEqual({ arrived: true, atSettlementId: 'far', progress01: 1 });
  });

  test('a leg never resolves on the tick it opened', () => {
    const digest = roadDigest();
    const failures = collectSeedFailures([['a', 'b'], ['b', 'c'], ['c', 'far']], ([from, to]) => {
      const leg = planWanderLeg({ digest, fromId: from, destId: to, tick: 0 });
      expect(leg.arrivalTick).toBeGreaterThan(leg.departTick);
      expect(wanderPosition(leg, 0).arrived).toBe(false);
    });
    expectNoSeedFailures(failures, 'every leg costs at least one tick');
  });

  test('an arrival tick takes no further hop: two edges can never fall in one advance', () => {
    const digest = roadDigest();
    // The walker is one tick from finishing a-to-b, still bound for far.
    const leg = planWanderLeg({ digest, fromId: 'a', destId: 'far', tick: 0 });
    const step = advanceWanderer({
      digest, atSettlementId: '', leg, destId: 'far', tick: leg.arrivalTick,
    });
    expect(step.arrived).toBe(true);
    expect(step.atSettlementId).toBe('b');
    // THE TEETH: the advance that landed them at b did NOT also open the b-to-c leg.
    expect(step.leg).toBeNull();
  });

  test('an unreachable or unmapped destination plans nothing rather than teleporting', () => {
    const digest = roadDigest();
    for (const dest of ['nowhere', '', 'a']) {
      expect(nextHopToward({ digest, fromId: 'a', destId: dest })).toBeNull();
      expect(planWanderLeg({ digest, fromId: 'a', destId: dest, tick: 1 })).toBeNull();
    }
    expect(nextHopToward({ digest: null, fromId: 'a', destId: 'far' })).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6 — hidden paths: a seam for wanderers, never for armies', () => {
  test('WITHOUT the callback the reading is the road-only one, byte-identical', () => {
    const digest = roadDigest();
    const failures = collectSeedFailures([['a', 'far'], ['b', 'far'], ['far', 'a']], ([from, dest]) => {
      expect(nextHopToward({ digest, fromId: from, destId: dest }))
        .toEqual(nextHopToward({ digest, fromId: from, destId: dest, hiddenHopsOf: null }));
      const leg = planWanderLeg({ digest, fromId: from, destId: dest, tick: 3 });
      expect(leg.hidden).toBeUndefined();
    });
    expectNoSeedFailures(failures, 'the hidden-path seam is inert when nobody supplies it');
  });

  test('WITH the callback a strictly closer hidden way is taken, and it costs more', () => {
    const digest = roadDigest();
    const hiddenHopsOf = (from) => (from === 'a' ? ['c'] : []);
    const road = planWanderLeg({ digest, fromId: 'a', destId: 'far', tick: 0 });
    const secret = planWanderLeg({ digest, fromId: 'a', destId: 'far', tick: 0, hiddenHopsOf });
    expect(road.toId).toBe('b');
    expect(secret.toId).toBe('c');
    expect(secret.hidden).toBe(true);
    // SLOWLY, per the design: the hidden way prices at the declared slowdown.
    const nominal = secret.arrivalTick - secret.departTick;
    expect(nominal).toBe(2 * NPC_CONSEQUENCES_TUNING.HIDDEN_PATH_SLOWDOWN);
  });

  test('a hidden way that is not closer is refused: a wanderer never walks backwards', () => {
    const digest = roadDigest();
    const backwards = (from) => (from === 'b' ? ['a'] : []);
    const hop = nextHopToward({ digest, fromId: 'b', destId: 'far', hiddenHopsOf: backwards });
    expect(hop.toId).toBe('c');
    expect(hop.hidden).toBe(false);
  });

  test('a callback that offers nothing leaves the road hop exactly as it was', () => {
    const digest = roadDigest();
    for (const hook of [() => [], () => null, () => ['nowhere', '']]) {
      expect(nextHopToward({ digest, fromId: 'a', destId: 'far', hiddenHopsOf: hook }))
        .toEqual({ toId: 'b', hidden: false });
    }
  });
});
