/**
 * memoryHorizon.test.js — D5 LIFESPAN-SCALED MEMORY pins (DESIGN_SIM_DEPTH_R2 §D5).
 *
 * The memory horizon derives from a settlement's demographic character via THE FACET
 * LAW (facetOf), scaling the grievance/warmth mean-reversion in relaxRelationshipStates.
 * generational (1.0) is byte-identical to today; both signs (trust AND resentment) scale;
 * contracts never scale; the undying band erodes only through reconciliation events.
 *
 * Design pins (§D5): (1) default-band byte-identical; (2) declared overrides inference +
 * clamp to band table; (3) undying erodes via reconciliation only; (4) the multiplier is
 * clamped to the band table (no freetext scaling).
 */
import { describe, it, expect } from 'vitest';
import {
  MEMORY_HORIZON_BANDS,
  DEFAULT_MEMORY_HORIZON_BAND,
  memoryHorizonBandOf,
  memoryHorizonMultiplierOf,
  combineMemoryHorizon,
  relaxRelationshipStates,
  applyRelationshipPatch,
} from '../../src/domain/worldPulse/relationshipEvolution.js';

const hostileEdge = (resentment = 0.9, trust = 0.5, fear = 0.5) => ({
  relationshipStates: { 'edge.a.b': { relationshipType: 'hostile', resentment, trust, fear } },
  tick: 5,
});
const resentmentAfterRelax = (ws, horizonForKey) =>
  relaxRelationshipStates(ws, horizonForKey).relationshipStates['edge.a.b'].resentment;

describe('D5 — memoryHorizon facet (declared ?? inferred ?? generational)', () => {
  it('PIN 2/4: a declared facet WINS and is clamped to the band table', () => {
    // facets{} form and facet:<kind>:<value> tag form both declare (facet-law parity).
    expect(memoryHorizonBandOf({ facets: { memoryHorizon: 'long' } })).toBe('long');
    expect(memoryHorizonBandOf({ tags: ['facet:memoryHorizon:undying'] })).toBe('undying');
    expect(memoryHorizonMultiplierOf({ facets: { memoryHorizon: 'long' } })).toBe(3);
    expect(memoryHorizonMultiplierOf({ facets: { memoryHorizon: 'fleeting' } })).toBe(0.5);
    // Unrecognized declaration ⇒ default band (no freetext scaling).
    expect(memoryHorizonBandOf({ facets: { memoryHorizon: 'eternal_grudge' } })).toBe(DEFAULT_MEMORY_HORIZON_BAND);
    expect(memoryHorizonMultiplierOf({ facets: { memoryHorizon: 123 } })).toBe(MEMORY_HORIZON_BANDS.generational);
  });

  it('an undeclared / genre-blind settlement infers to generational (1.0)', () => {
    expect(memoryHorizonBandOf({ name: 'Thornwall' })).toBe('generational');
    expect(memoryHorizonMultiplierOf({})).toBe(1);
    expect(memoryHorizonMultiplierOf(null)).toBe(1);
  });

  it('combineMemoryHorizon keeps the LONGER memory (the elves keep the ledger open)', () => {
    expect(combineMemoryHorizon(1, 3)).toBe(3);
    expect(combineMemoryHorizon(0.5, 1)).toBe(1);
    expect(combineMemoryHorizon(Infinity, 1)).toBe(Infinity);
  });
});

describe('D5 — relaxRelationshipStates scaling (both signs, dormant-by-construction)', () => {
  it('PIN 1: no resolver ⇒ byte-identical to a resolver returning generational (1.0)', () => {
    const ws = hostileEdge();
    const bare = relaxRelationshipStates(ws);
    const generational = relaxRelationshipStates(ws, () => 1);
    expect(JSON.stringify(generational)).toBe(JSON.stringify(bare));
  });

  it('BOTH SIGNS: a long horizon reverts trust AND resentment slower; fleeting faster', () => {
    const ws = hostileEdge(0.9, 0.9, 0.5); // resentment above baseline, trust above baseline
    const base = relaxRelationshipStates(ws).relationshipStates['edge.a.b'];
    const long = relaxRelationshipStates(ws, () => MEMORY_HORIZON_BANDS.long).relationshipStates['edge.a.b'];
    const fleeting = relaxRelationshipStates(ws, () => MEMORY_HORIZON_BANDS.fleeting).relationshipStates['edge.a.b'];
    // hostile baseline resentment 0.78 (< 0.9): reversion pulls DOWN. Slower ⇒ stays higher.
    expect(long.resentment).toBeGreaterThan(base.resentment);
    expect(fleeting.resentment).toBeLessThan(base.resentment);
    // hostile baseline trust 0.05 (< 0.9): reversion pulls DOWN too. Slower ⇒ stays higher.
    expect(long.trust).toBeGreaterThan(base.trust);
    expect(fleeting.trust).toBeLessThan(base.trust);
  });

  it('PIN 3: undying suppresses time-reversion entirely (no absorbing decay via the clock)', () => {
    const ws = hostileEdge(0.9, 0.5, 0.5);
    const undying = relaxRelationshipStates(ws, () => MEMORY_HORIZON_BANDS.undying).relationshipStates['edge.a.b'];
    expect(undying.resentment).toBe(0.9); // unchanged — undying never forgets via the clock
    expect(undying.trust).toBe(0.5);
    expect(undying.fear).toBe(0.5);
  });

  it('PIN 3: an undying grudge STILL erodes through a reconciliation event (applyRelationshipPatch)', () => {
    // The undying band suppresses only generational (time) decay; the climb-down/mediation
    // lane (a resentment-reducing patch) still lands — D5 never scales applyRelationshipPatch.
    let ws = hostileEdge(0.9, 0.5, 0.5);
    ws = relaxRelationshipStates(ws, () => MEMORY_HORIZON_BANDS.undying); // no time decay
    expect(ws.relationshipStates['edge.a.b'].resentment).toBe(0.9);
    const reconciliation = { relationshipKey: 'edge.a.b', relationshipPatch: { resentment: 0.85 } };
    ws = applyRelationshipPatch(ws, reconciliation, '2026-01-01T00:00:00.000Z');
    expect(ws.relationshipStates['edge.a.b'].resentment).toBeCloseTo(0.85, 10);
  });
});
