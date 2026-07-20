/**
 * npcCredibility.test.js — DEEP COUPLINGS D-2 leaf pins (design §6).
 *
 * The pure state layer for per-NPC credibility: the centered-on-1.0 weight, the steeper-
 * than-a-court personal fall, the composite weight clamp, the ladder-consumed lieExposure
 * deposit with its one-tick lag, roster-scan prune, and the dormancy no-op. The kernel-level
 * anti-vacuity + dormancy byte-identity live in the property golden.
 */
import { describe, it, expect } from 'vitest';
import {
  NPC_CREDIBILITY_TUNING, npcCredibilityWeight, decayedNpcCredibilityScore,
  npcCredibilityScoreOf, npcCredibilityWeightOf, compositeCredibilityWeight,
  advanceNpcCredibility, freshLieExposureFor, npcCredibilityActive,
} from '../../src/domain/worldPulse/npcCredibility.js';

const LIT = { npcCredibilityEnabled: true };
const ws = (spatialLedgers, rules = LIT) => ({ simulationRules: rules, spatialLedgers });

describe('D-2 npcCredibility — the weight curve', () => {
  it('a neutral / absent stock weighs EXACTLY 1.0 (byte-identity anchor)', () => {
    expect(npcCredibilityWeight(0)).toBe(1.0);
    expect(npcCredibilityScoreOf(ws({}), 'x:reeve', 10)).toBe(0);
    expect(npcCredibilityWeightOf(ws({}), 'x:reeve', 10)).toBe(1.0);
  });
  it('a proven liar is discounted toward the floor; a trusted broker boosted toward the ceiling', () => {
    const T = NPC_CREDIBILITY_TUNING;
    expect(npcCredibilityWeight(-T.SCORE_SAT)).toBeCloseTo(T.WEIGHT_FLOOR, 6);
    expect(npcCredibilityWeight(T.SCORE_SAT)).toBeCloseTo(T.WEIGHT_CEIL, 6);
    expect(npcCredibilityWeight(-2)).toBeLessThan(1);
    expect(npcCredibilityWeight(2)).toBeGreaterThan(1);
  });
  it('the personal fall is STEEPER than a court\'s (design §6 — trust dies faster at soul scale)', () => {
    // The settlement LIE_FALL is 5; the NPC override is one notch steeper.
    expect(NPC_CREDIBILITY_TUNING.LIE_FALL).toBeGreaterThan(5);
  });
});

describe('D-2 npcCredibility — the composite weight (settlementCred × npcCred, clamped)', () => {
  it('a neutral pair ⇒ EXACTLY 1.0 (byte-identity)', () => {
    expect(compositeCredibilityWeight(1, 1)).toBe(1.0);
  });
  it('two discounts COMPOUND but never below the floor', () => {
    const T = NPC_CREDIBILITY_TUNING;
    expect(compositeCredibilityWeight(0.7, 0.7)).toBeCloseTo(0.49, 6);
    expect(compositeCredibilityWeight(0.1, 0.1)).toBe(T.COMPOSITE_FLOOR);
    expect(compositeCredibilityWeight(1.15, 1.15)).toBeLessThanOrEqual(T.COMPOSITE_CEIL);
  });
});

describe('D-2 npcCredibility — the fold', () => {
  it('an exposed lie sinks the mouthpiece; a second exposure COMPOUNDS (boy-who-cried-wolf)', () => {
    const one = advanceNpcCredibility({ worldState: ws({}), tick: 10, deltas: [{ id: 'x:liar', kind: 'deception', magnitude01: 1 }] });
    const s1 = npcCredibilityScoreOf(one.worldState, 'x:liar', 10);
    expect(s1).toBeLessThan(0);
    const two = advanceNpcCredibility({ worldState: one.worldState, tick: 11, deltas: [{ id: 'x:liar', kind: 'deception', magnitude01: 1 }] });
    const s2 = npcCredibilityScoreOf(two.worldState, 'x:liar', 11);
    expect(s2).toBeLessThan(s1); // deeper in the red — the discount compounds
  });
  it('a proven-true telling rises SLOWLY (asymmetric to the sharp fall)', () => {
    const r = advanceNpcCredibility({ worldState: ws({}), tick: 5, deltas: [{ id: 'x:true', kind: 'proven_true', magnitude01: 1 }] });
    expect(npcCredibilityScoreOf(r.worldState, 'x:true', 5)).toBeCloseTo(NPC_CREDIBILITY_TUNING.TRUE_RISE, 4);
  });
  it('fold order is permutation-independent (determinism)', () => {
    const ds = [{ id: 'x:b', kind: 'deception' }, { id: 'x:a', kind: 'proven_true' }, { id: 'x:b', kind: 'proven_true' }];
    const a = advanceNpcCredibility({ worldState: ws({}), tick: 3, deltas: ds });
    const b = advanceNpcCredibility({ worldState: ws({}), tick: 3, deltas: [...ds].reverse() });
    expect(JSON.stringify(a.worldState.spatialLedgers.npcCredibility)).toBe(JSON.stringify(b.worldState.spatialLedgers.npcCredibility));
  });
  it('roster-scan prune: an npcId absent from liveNpcIds is dropped (remove_npc ⇒ no dangling key)', () => {
    const seeded = advanceNpcCredibility({ worldState: ws({}), tick: 1, deltas: [{ id: 'x:gone', kind: 'deception' }, { id: 'x:here', kind: 'deception' }] });
    expect(Object.keys(seeded.worldState.spatialLedgers.npcCredibility).sort()).toEqual(['x:gone', 'x:here']);
    const pruned = advanceNpcCredibility({ worldState: seeded.worldState, tick: 2, deltas: [], liveNpcIds: new Set(['x:here']) });
    expect(Object.keys(pruned.worldState.spatialLedgers.npcCredibility)).toEqual(['x:here']);
  });
});

describe('D-2 npcCredibility — the ladder deposit (lieExposure) + one-tick lag', () => {
  it('a deception delta bearing a band stamps the lieExposure deposit', () => {
    const r = advanceNpcCredibility({ worldState: ws({}), tick: 20, deltas: [{ id: 'x:m', kind: 'deception', lieExposedBand: 3 }] });
    const dep = r.worldState.spatialLedgers.npcCredibility['x:m'].lieExposure;
    expect(dep).toEqual({ band: 3, tick: 20 });
  });
  it('the ladder reads it only on a LATER tick (never same-tick), and only once past `since`', () => {
    const r = advanceNpcCredibility({ worldState: ws({}), tick: 20, deltas: [{ id: 'x:m', kind: 'deception', lieExposedBand: 2 }] });
    // Same tick as exposure ⇒ NOT yet visible (the scandal takes a week).
    expect(freshLieExposureFor(r.worldState, 'x:m', -1, 20)).toBeNull();
    // A later tick ⇒ fresh.
    expect(freshLieExposureFor(r.worldState, 'x:m', -1, 21)).toEqual({ tick: 20, band: 2 });
    // Already stigmatized at 20 (since >= 20) ⇒ not fresh again.
    expect(freshLieExposureFor(r.worldState, 'x:m', 20, 25)).toBeNull();
  });
});

describe('D-2 npcCredibility — dormancy', () => {
  it('flag dark ⇒ advanceNpcCredibility is a no-op (no ledger key materializes)', () => {
    expect(npcCredibilityActive(ws({}, {}))).toBe(false);
    const r = advanceNpcCredibility({ worldState: ws({}, {}), tick: 1, deltas: [{ id: 'x:liar', kind: 'deception' }] });
    expect(r.changed).toBe(false);
    expect(r.worldState.spatialLedgers?.npcCredibility).toBeUndefined();
  });
  it('a decayed-to-neutral entry with no live deposit prunes (drop-when-empty)', () => {
    const seeded = advanceNpcCredibility({ worldState: ws({}), tick: 0, deltas: [{ id: 'x:fade', kind: 'proven_true', magnitude01: 0.1 }] });
    expect(seeded.worldState.spatialLedgers.npcCredibility['x:fade']).toBeTruthy();
    // Advance far past the lookback ⇒ the mark is fully spent ⇒ the key drops entirely.
    const faded = advanceNpcCredibility({ worldState: seeded.worldState, tick: NPC_CREDIBILITY_TUNING.MAX_LOOKBACK_TICKS + 5, deltas: [] });
    expect(faded.worldState.spatialLedgers?.npcCredibility).toBeUndefined();
  });
});
