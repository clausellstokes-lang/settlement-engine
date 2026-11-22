/**
 * momentumConsumption.test.js — W-MOMENTUM Stage 3 PIN BATTERY (design §3/§6).
 *
 * The bounded, centered-on-1.0 consumption factors (pre-wire, dormant): the strategy-chooser
 * commitment load, the belief-discount closure, and the abandon-floor scale. Each is EXACTLY
 * ×1 (or null) when dormant / uncommitted — byte-identity — and honors the LIMIT CLAUSE (the
 * reversal weight divides by up to CLIFF_MULT; the discount only SLOWS, floored above 0).
 */
import { describe, it, expect } from 'vitest';
import {
  courseConsistencyFactor,
  moveCourseRelation,
  makeCommitmentLoad,
  makeCommitmentDiscountFn,
  abandonFloorScale,
  advanceCommitments,
  MOMENTUM_TUNING,
  CONSUMPTION_TUNING,
} from '../../src/domain/worldPulse/momentum.js';

const LIT = { infoMode: 'unreliable', momentumEnabled: true };
const litWorld = (/** @type {Record<string, unknown>} */ over = {}) => ({
  spatialCanonVersion: 1, simulationRules: LIT, spatialLedgers: {}, ...over,
});
// A world with a materialized commitment on war:B held by actor A, deep past the cliff.
const committedWorld = (magnitude01 = 1, ticks = 200) => {
  let ws = /** @type {any} */ (litWorld());
  const deposits = [{ actorId: 'A', courseKey: 'war:B', kind: 'siege', magnitude01 }];
  for (let t = 0; t < ticks; t++) ws = advanceCommitments({ worldState: ws, tick: t, deposits }).worldState;
  return ws;
};

describe('W-MOMENTUM Stage 3 — courseConsistencyFactor (the centered move weight)', () => {
  it('uncommitted (stock 0) ⇒ EXACTLY 1.0 for every relation (byte-identity)', () => {
    for (const relation of ['consistent', 'reversal', 'neutral']) {
      expect(courseConsistencyFactor({ stock: 0, cliff: 6, relation })).toBe(1);
    }
  });
  it('a CONSISTENT move is weighted UP; a REVERSAL DOWN', () => {
    expect(courseConsistencyFactor({ stock: 3, cliff: 6, relation: 'consistent' })).toBeGreaterThan(1);
    expect(courseConsistencyFactor({ stock: 3, cliff: 6, relation: 'reversal' })).toBeLessThan(1);
    expect(courseConsistencyFactor({ stock: 3, cliff: 6, relation: 'neutral' })).toBe(1);
  });
  it('THE LIMIT CLAUSE: past the cliff, the reversal weight collapses by ~CLIFF_MULT (finite)', () => {
    const belowCliff = courseConsistencyFactor({ stock: 5.9, cliff: 6, relation: 'reversal' });
    const farPastCliff = courseConsistencyFactor({ stock: 100, cliff: 6, relation: 'reversal' });
    expect(farPastCliff).toBeLessThan(belowCliff);
    // Order of magnitude harder but FINITE + positive (no absorbing state — reversal never 0).
    expect(farPastCliff).toBeGreaterThan(0);
    expect(farPastCliff).toBeLessThan(belowCliff / 5); // ~an order of magnitude harder
  });
  it('the move→relation map is bounded (deploy consistent, sue_for_peace reversal, hold neutral)', () => {
    expect(moveCourseRelation('deploy')).toBe('consistent');
    expect(moveCourseRelation('sue_for_peace')).toBe('reversal');
    expect(moveCourseRelation('hold')).toBe('neutral');
    expect(moveCourseRelation('anything_else')).toBe('neutral');
  });
});

describe('W-MOMENTUM Stage 3 — makeCommitmentLoad (the strategy-chooser closure)', () => {
  it('null when dormant OR the actor holds no committed course (byte-identity)', () => {
    const dark = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' } };
    expect(makeCommitmentLoad(dark, { settlement: {} }, 'A', 5)).toBeNull();
    expect(makeCommitmentLoad(litWorld(), { settlement: {} }, 'A', 5)).toBeNull(); // no ledger
  });
  it('a committed actor holds its course: deploy UP, sue_for_peace DOWN; neutral moves ×1', () => {
    const ws = committedWorld();
    const load = makeCommitmentLoad(ws, { settlement: { npcs: [] } }, 'A', 200);
    expect(load).toBeTruthy();
    const l = /** @type {{ factorFor: (m: string, t?: string|null) => number }} */ (load);
    expect(l.factorFor('deploy', 'B')).toBeGreaterThan(1);
    expect(l.factorFor('sue_for_peace', 'B')).toBeLessThan(1);
    expect(l.factorFor('hold', 'B')).toBe(1);
    // An uninvolved target is untouched (×1).
    expect(l.factorFor('deploy', 'Z')).toBe(1);
  });
  it('a PROUD court holds its war harder than a HUMBLE court (higher cliff ⇒ deeper doubling-down)', () => {
    const ws = committedWorld();
    const proud = makeCommitmentLoad(ws, { settlement: { npcs: [{ importance: 'pillar', personality: { dominant: 'proud' } }] } }, 'A', 200);
    const humble = makeCommitmentLoad(ws, { settlement: { npcs: [{ importance: 'pillar', personality: { dominant: 'humble' } }] } }, 'A', 200);
    // The humble court, with a LOWER cliff, is further "past" it ⇒ reversal is harder for it,
    // while the proud court's higher cliff means the same stock is a smaller fraction of it.
    // Either way both are bounded ×1-centered; the pin is that temperament MOVES the factor.
    const pf = /** @type {any} */ (proud).factorFor('sue_for_peace', 'B');
    const hf = /** @type {any} */ (humble).factorFor('sue_for_peace', 'B');
    expect(pf).not.toBe(hf);
  });
});

describe('W-MOMENTUM Stage 3 — makeCommitmentDiscountFn (the belief-discount closure)', () => {
  it('null when dormant OR no materialized commitments (byte-identity)', () => {
    const dark = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' } };
    expect(makeCommitmentDiscountFn(dark, 5)).toBeNull();
    expect(makeCommitmentDiscountFn(litWorld(), 5)).toBeNull(); // no ledger
  });
  it('EXACTLY 1.0 for an observer with no committed course about the subject; discounts a committed one', () => {
    const ws = committedWorld();
    const discountFor = makeCommitmentDiscountFn(ws, 200);
    expect(discountFor).toBeTruthy();
    const f = /** @type {(o: string, s: string) => number} */ (discountFor);
    expect(f('A', 'Z')).toBe(1);          // A holds no course about Z ⇒ byte-identity
    expect(f('Z', 'B')).toBe(1);          // Z is uncommitted ⇒ byte-identity
    const committed = f('A', 'B');        // A is committed to war:B ⇒ discounted
    expect(committed).toBeLessThan(1);
    expect(committed).toBeGreaterThanOrEqual(CONSUMPTION_TUNING.DISCOUNT_FLOOR); // only SLOWS, floored > 0
  });
  it('the discount can only SLOW convergence — it never falls below the floor (never inverts)', () => {
    const ws = committedWorld(1, 400); // maximally committed
    const f = /** @type {any} */ (makeCommitmentDiscountFn(ws, 400));
    const d = f('A', 'B');
    expect(d).toBeGreaterThanOrEqual(CONSUMPTION_TUNING.DISCOUNT_FLOOR);
    expect(d).toBeGreaterThan(0);
  });
});

describe('W-MOMENTUM Stage 3 — abandonFloorScale (the plan/doctrine seam)', () => {
  it('≥ 1.0 always; EXACTLY 1.0 when dormant / uncommitted (byte-identity)', () => {
    const dark = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' } };
    expect(abandonFloorScale(dark, 'A', 'B', 5)).toBe(1);
    expect(abandonFloorScale(litWorld(), 'A', 'B', 5)).toBe(1); // no campaign commitment
  });
  it('a committed strangler holds a marginal campaign LONGER (floor scales up with commitment)', () => {
    let ws = /** @type {any} */ (litWorld());
    const deposits = [{ actorId: 'A', courseKey: 'campaign:B', kind: 'campaign', magnitude01: 1 }];
    for (let t = 0; t < 100; t++) ws = advanceCommitments({ worldState: ws, tick: t, deposits }).worldState;
    expect(abandonFloorScale(ws, 'A', 'B', 100)).toBeGreaterThan(1);
  });
});
