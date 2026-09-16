/**
 * beliefDivergenceObservation.test.js — the per-year belief-versus-ground-truth
 * metric added to the soak receipt on 2026-07-31.
 *
 * WHY IT EXISTS. infoMode is the one unlocked simulation-profile axis, and until
 * this metric landed the receipt envelope observed NO consequence of it: a run
 * could carry `infoMode: 'full'` with a fully materialized belief map while every
 * belief in it was either perfectly true or permanently wrong, and no field could
 * tell those apart. The obvious proxy is a trap, because the `knowledge` mover
 * family is a residual bucket that fifteen unrelated impactKinds fall into.
 *
 * WHAT IS PINNED HERE. Every assertion drives the metric with a fixture that
 * differs from its control in exactly one field, so a passing number names a
 * cause: a wrong alliance label raises the relationship rate and nothing else; a
 * wrong faith raises the faith rate and nothing else; a dormant realm reports
 * null rather than a flattering zero.
 */
import { describe, expect, it } from 'vitest';
import {
  observeBeliefDivergence,
  observeBehavioralYear,
} from '../../scripts/audit/behavioral-observation.mjs';

const TICK = 520;

/** One belief record in the engine's persisted shape (beliefMap.js BeliefRecord). */
const belief = ({
  allianceLabel = 'trade_partner',
  faithLabel = 'Vareth',
  confidence01 = 0.8,
  lastUpdateTick = TICK - 4,
} = {}) => ({ readiness: 0.25, strengthBand: 2, allianceLabel, faithLabel, confidence01, lastUpdateTick });

/**
 * A world whose declared truth is fixed: a-b are trade partners, a-c are rivals,
 * and every settlement worships Vareth. Fixtures then vary only the BELIEF.
 */
function result({ beliefMaps = null, infoMode = 'full', spatialCanonVersion = 1 } = {}) {
  return {
    tick: TICK,
    worldState: {
      tick: TICK,
      spatialCanonVersion,
      simulationRules: { infoMode },
      relationshipStates: {},
      ...(beliefMaps ? { spatialLedgers: { beliefMaps } } : {}),
    },
    regionalGraph: {
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'rival' },
      ],
    },
  };
}

const saves = ['a', 'b', 'c'].map((id) => ({
  id,
  settlement: { config: { primaryDeitySnapshot: { name: 'Vareth' } } },
}));

describe('observeBeliefDivergence', () => {
  it('reads zero divergence when every belief matches the declared truth', () => {
    const observed = observeBeliefDivergence({
      result: result({
        beliefMaps: {
          a: { seat: { b: belief(), c: belief({ allianceLabel: 'rival' }) } },
        },
      }),
      afterSaves: saves,
    });
    expect(observed).toMatchObject({
      infoMode: 'full',
      spatialCanonized: true,
      observers: 1,
      slots: 1,
      records: 2,
      relationshipComparable: 2,
      relationshipMismatched: 0,
      faithComparable: 2,
      faithMismatched: 0,
      divergence01: 0,
    });
    expect(observed.axes).toEqual(['relationship', 'faith']);
    expect(observed.meanConfidence01).toBe(0.8);
    expect(observed.meanStalenessTicks).toBe(4);
    expect(observed.maxStalenessTicks).toBe(4);
  });

  it('a STALE alliance label raises the relationship rate and only that rate', () => {
    // One belief differs from the control above in exactly one field: `a` still
    // counts `c` a trade partner, though the declared truth is `rival`. That is
    // the fog this metric exists to measure.
    const observed = observeBeliefDivergence({
      result: result({
        beliefMaps: {
          a: { seat: { b: belief(), c: belief({ allianceLabel: 'trade_partner' }) } },
        },
      }),
      afterSaves: saves,
    });
    expect(observed.relationshipComparable).toBe(2);
    expect(observed.relationshipMismatched).toBe(1);
    expect(observed.faithMismatched).toBe(0);
    // Mean of the two axis rates: relationship 0.5, faith 0.
    expect(observed.divergence01).toBe(0.25);
  });

  it('a stale faith label raises the faith rate, including a belief in a faith since lost', () => {
    const observed = observeBeliefDivergence({
      result: result({
        beliefMaps: {
          a: { seat: { b: belief({ faithLabel: 'Old Kel' }), c: belief({ allianceLabel: 'rival', faithLabel: null }) } },
        },
      }),
      afterSaves: saves,
    });
    expect(observed.faithComparable).toBe(2);
    // Both are wrong: one names a superseded deity, one believes there is none.
    expect(observed.faithMismatched).toBe(2);
    expect(observed.relationshipMismatched).toBe(0);
    expect(observed.divergence01).toBe(0.5);
  });

  it('counts per-faction slots across observers', () => {
    const observed = observeBeliefDivergence({
      result: result({
        beliefMaps: {
          // The sentinel sits BESIDE the observer ids and carries the canon
          // version, a NUMBER. It must not inflate any cardinality here.
          __seededAt: 1,
          a: {
            seat: { b: belief() },
            merchant: { b: belief() },
            public: { c: belief({ allianceLabel: 'rival' }) },
          },
          b: { seat: { a: belief() } },
        },
      }),
      afterSaves: saves,
    });
    expect(observed.observers).toBe(2);
    expect(observed.slots).toBe(4);
    expect(observed.records).toBe(4);
    expect(observed.relationshipComparable).toBe(4);
    expect(observed.relationshipMismatched).toBe(0);
  });

  it('skips the seed sentinel by NAME, not by the shape it happens to hold today', () => {
    // The sentinel is a number today, so a shape-only defence would be vacuous:
    // an object coercion already swallows it. This fixture gives the sentinel a
    // MAP shape, which is the only case in which the explicit name check is what
    // keeps it out of the census. `a` is the liveness anchor: it travels the same
    // loop and IS counted, so a zero here would be a broken observer, not a skip.
    const observed = observeBeliefDivergence({
      result: result({
        beliefMaps: {
          __seededAt: { seat: { b: belief({ allianceLabel: 'hostile' }) } },
          a: { seat: { b: belief() } },
        },
      }),
      afterSaves: saves,
    });
    expect(observed.observers).toBe(1);
    expect(observed.records).toBe(1);
    // The sentinel's belief was wrong; counting it would have shown a mismatch.
    expect(observed.relationshipComparable).toBe(1);
    expect(observed.relationshipMismatched).toBe(0);
    expect(observed.divergence01).toBe(0);
  });

  it('reports an honest null when the belief lane never materialized', () => {
    // The omniscient / uncanonized realm: beliefsActive is false, so no belief map
    // exists. A zero here would read as "perfectly informed" and would be a lie.
    const observed = observeBeliefDivergence({
      result: result({ beliefMaps: null, infoMode: 'omniscient', spatialCanonVersion: 0 }),
      afterSaves: saves,
    });
    expect(observed).toMatchObject({
      infoMode: 'omniscient',
      spatialCanonized: false,
      observers: 0,
      records: 0,
      relationshipComparable: 0,
      faithComparable: 0,
      divergence01: null,
      meanConfidence01: null,
      meanStalenessTicks: null,
      maxStalenessTicks: null,
    });
    expect(observed.axes).toEqual([]);
  });

  it('drops an axis with no comparable pairs instead of averaging a zero into it', () => {
    // The subject is not a settlement this run carries, so faith is uncomparable
    // while the graph edge still makes the relationship comparable.
    const observed = observeBeliefDivergence({
      result: result({ beliefMaps: { a: { seat: { b: belief({ allianceLabel: 'hostile' }) } } } }),
      afterSaves: [{ id: 'a', settlement: { config: {} } }],
    });
    expect(observed.faithComparable).toBe(0);
    expect(observed.axes).toEqual(['relationship']);
    expect(observed.relationshipMismatched).toBe(1);
    // One axis, fully wrong: the mean must be that axis alone, not halved by a
    // phantom faith axis that measured nothing.
    expect(observed.divergence01).toBe(1);
  });

  it('is deterministic and total on a garbage receipt', () => {
    const input = { result: result({ beliefMaps: { a: { seat: { b: belief() } } } }), afterSaves: saves };
    expect(observeBeliefDivergence(input)).toEqual(observeBeliefDivergence(input));
    expect(observeBeliefDivergence({ result: null, afterSaves: null })).toMatchObject({
      infoMode: null,
      spatialCanonized: false,
      records: 0,
      divergence01: null,
    });
  });
});

describe('the per-year observation carries the metric', () => {
  it('observeBehavioralYear surfaces beliefDivergence on the yearly row', () => {
    const observed = observeBehavioralYear({
      year: 3,
      result: result({ beliefMaps: { a: { seat: { c: belief({ allianceLabel: 'trade_partner' }) } } } }),
      beforeSaves: saves,
      afterSaves: saves,
    });
    expect(observed.year).toBe(3);
    expect(observed.beliefDivergence).toMatchObject({
      infoMode: 'full',
      spatialCanonized: true,
      records: 1,
      relationshipComparable: 1,
      relationshipMismatched: 1,
      divergence01: 0.5,
    });
    // The addition is ADDITIVE: the v4 fields a completed receipt already carries
    // keep their exact meaning alongside it.
    expect(Object.keys(observed)).toEqual(expect.arrayContaining([
      'eventTypeCounts', 'moverCounts', 'selectedMoverCounts', 'postApplyMoverCounts',
      'arcCounts', 'motion', 'attentionCounts', 'succession', 'causal',
      'chronicleSample', 'stateVectors', 'beliefDivergence',
    ]));
  });
});
