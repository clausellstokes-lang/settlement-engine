/**
 * npcCirculationBelief.test.js — W-H3 §6b: REPUTATION AS BELIEF.
 *
 * THE CLAIM THIS FILE MEASURES: a wanderer OUTRUNS THEIR STORY on a long road and does
 * NOT on a short one. The ledger's truth is one thing; what a settlement believes is
 * derived through the information layer, and admission runs against the belief.
 *
 * WHY THE TWO ROADS ARE IN ONE TEST. A far observer believing nothing is a negative
 * assertion, and on its own it is satisfied just as well by a derivation that returns
 * neutral for everybody. The NEAR observer, reading the SAME truth through the SAME
 * function at the SAME tick, is the anchor: their belief must carry the scandal. Only the
 * pair distinguishes "the story faded over distance" from "the derivation is dead".
 *
 * THE ENGINEERING GUARD IS PINNED TOO: a belief is derived on demand and never stored, so
 * the world is byte-identical before and after a derivation, and the module exports no
 * writer at all.
 */
import { describe, test, expect } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import * as beliefModule from '../../src/domain/worldPulse/npcCirculationBelief.js';
import {
  beliefFadeSteps,
  believedReputation,
  rumourReinforcesAt,
} from '../../src/domain/worldPulse/npcCirculationBelief.js';
import {
  NEUTRAL_REPUTATION_FACETS,
  normalizeReputationFacets,
  notorietyRank,
} from '../../src/domain/worldPulse/npcLedgerFacets.js';
import { NPC_CONSEQUENCES_TUNING } from '../../src/domain/worldPulse/npcConsequencesTuning.js';

/**
 * FOUR SETTLEMENTS ON ONE ROAD. `a` is where the scandal happened; `b` is one primary hop
 * away; `far` is thirty weeks of walking past it. The tiers mark the two short hops as
 * primary, so the digest's calibration reads a median hop cost of 100 and a far road
 * genuinely prices as far rather than as an artifact of a lopsided matrix.
 */
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

const worldWith = (infoMode) => ({
  spatialCanonVersion: 1,
  spatialDigest: roadDigest(),
  simulationRules: { npcConsequencesEnabled: true, infoMode },
});

/** The truth the ledger holds: a banished, notorious conspirator. */
const TRUTH = normalizeReputationFacets({
  notorietyBand: 'notorious',
  edictMark: 'banishment_edict',
  scandalClass: 'conspiracy',
  alignmentRead: 'evil',
  competenceRead: 'capable',
});

const believe = (worldState, observerId, elapsedTicks = 0) => believedReputation({
  worldState, originId: 'a', observerId, roamerId: 'wnpc_00000001', truth: TRUTH, elapsedTicks,
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6b — the wanderer outruns their story on a long road', () => {
  test('a far settlement believes nothing while a near one believes the scandal', () => {
    const world = worldWith('perfect_delayed');
    const near = believe(world, 'b');
    const distant = believe(world, 'far');

    // THE ANCHOR: the same derivation, the same truth, the same tick, one hop away.
    expect(near.receipt.arrived).toBe(true);
    expect(near.believed.scandalClass).toBe('conspiracy');
    expect(notorietyRank(near.believed.notorietyBand)).toBeGreaterThan(0);

    // THE CLAIM: thirty weeks up the road the story has not survived the journey.
    expect(distant.receipt.arrived).toBe(false);
    expect(distant.believed).toBe(NEUTRAL_REPUTATION_FACETS);
    expect(distant.believed.scandalClass).toBe('none');
    expect(distant.receipt.hopDelayTicks).toBeGreaterThan(near.receipt.hopDelayTicks);
  });

  test('the belief fade is monotone in BOTH distance and elapsed time', () => {
    const rows = [];
    for (const delay of [0, 3, 6, 12, 30]) {
      for (const elapsed of [0, 40, 200]) {
        rows.push({ delay, elapsed });
      }
    }
    const failures = collectSeedFailures(rows, ({ delay, elapsed }) => {
      const here = beliefFadeSteps({
        infoMode: 'perfect_delayed', hopDelayTicks: delay, elapsedTicks: elapsed,
        observerId: 'b', roamerId: 'w',
      }).fadeSteps;
      const farther = beliefFadeSteps({
        infoMode: 'perfect_delayed', hopDelayTicks: delay + 3, elapsedTicks: elapsed,
        observerId: 'b', roamerId: 'w',
      }).fadeSteps;
      const later = beliefFadeSteps({
        infoMode: 'perfect_delayed', hopDelayTicks: delay, elapsedTicks: elapsed + 40,
        observerId: 'b', roamerId: 'w',
      }).fadeSteps;
      expect(farther).toBeGreaterThanOrEqual(here);
      expect(later).toBeGreaterThanOrEqual(here);
    });
    expectNoSeedFailures(failures, 'the belief fade never decreases with distance or time');
  });

  test('time alone fades a story even next door', () => {
    const world = worldWith('perfect_delayed');
    const fresh = believe(world, 'b', 0);
    const ancient = believe(world, 'b', NPC_CONSEQUENCES_TUNING.BELIEF_FADE_TICKS * 5);
    expect(fresh.believed.notorietyBand).toBe('notorious');
    expect(ancient.believed).toBe(NEUTRAL_REPUTATION_FACETS);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6b — infoMode complicates the decay', () => {
  test('omniscient returns the truth unchanged, which is the dormant identity case', () => {
    const world = worldWith('omniscient');
    for (const observerId of ['a', 'b', 'c', 'far']) {
      const read = believe(world, observerId, 10_000);
      expect(read.believed).toEqual(TRUTH);
      expect(read.receipt.fadeSteps).toBe(0);
      expect(read.receipt.arrived).toBe(true);
    }
  });

  test('an unreliable telling both REINFORCES and COUNTERS across the pairs', () => {
    const readings = { reinforced: 0, countered: 0 };
    for (let i = 0; i < 400; i += 1) {
      if (rumourReinforcesAt({ observerId: `s${i}`, roamerId: 'wnpc_1', elapsedTicks: 3 })) {
        readings.reinforced += 1;
      } else {
        readings.countered += 1;
      }
    }
    // BOTH ARMS REACHABLE. A one-sided reading would make 'unreliable' just a slower
    // 'perfect_delayed', which is precisely the failure the design's wording rules out.
    expect(readings.reinforced).toBeGreaterThan(0);
    expect(readings.countered).toBeGreaterThan(0);
    // And the share is near the declared band rather than anywhere at all.
    const share = readings.reinforced / 400;
    expect(Math.abs(share - NPC_CONSEQUENCES_TUNING.BELIEF_REINFORCE_SHARE)).toBeLessThan(0.1);
  });

  test('a reinforced rumour never grows louder than the verdict actually was', () => {
    const world = worldWith('unreliable');
    const failures = collectSeedFailures(['a', 'b', 'c', 'far'], (observerId) => {
      const read = believe(world, observerId, 0);
      expect(notorietyRank(read.believed.notorietyBand))
        .toBeLessThanOrEqual(notorietyRank(TRUTH.notorietyBand));
    });
    expectNoSeedFailures(failures, 'an unreliable telling is bounded above by the truth');
  });

  test('the unreliable reading is deterministic and consumes no rng', () => {
    const world = worldWith('unreliable');
    expect(believe(world, 'b', 7)).toEqual(believe(world, 'b', 7));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6b — the engineering guard: derived, never stored', () => {
  test('the module exports reads only, and no writer of any shape', () => {
    const exported = Object.keys(beliefModule).sort();
    expect(exported).toEqual(['BELIEF_FORK_LABEL', 'beliefFadeSteps', 'believedReputation', 'rumourReinforcesAt']);
    // anchored: the list above is exact, so a future setter cannot slip in unnoticed.
    expect(exported.filter((name) => /^(set|store|write|persist|save)/i.test(name))).toEqual([]);
  });

  test('deriving a belief leaves the world byte-identical', () => {
    const world = worldWith('unreliable');
    const before = JSON.stringify(world);
    for (const observerId of ['a', 'b', 'c', 'far']) believe(world, observerId, 55);
    expect(JSON.stringify(world)).toBe(before);
  });

  test('the derivation is total on garbage', () => {
    for (const junk of [null, undefined, {}, { simulationRules: null }, { spatialDigest: 'no' }]) {
      const read = believedReputation({
        worldState: junk, originId: 'a', observerId: 'b', roamerId: 'w', truth: null, elapsedTicks: -5,
      });
      expect(read.believed).toBe(NEUTRAL_REPUTATION_FACETS);
      expect(read.receipt.elapsedTicks).toBe(0);
    }
  });
});
