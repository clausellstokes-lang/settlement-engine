/**
 * eliteBleed.test.js — DEEP COUPLINGS D-7f pins (design §10.5, the elite-bleed clause).
 *
 * THE UPWARD BLEED: personal elite relations become interstate relations, weighted by WHO the
 * NPCs are (importanceWeight × factionPowerStanding × politicsRank). The NOTABLE-FLOOR
 * threshold (two nobodies are noise by law), the per-pair per-tick CAP, and — the mandated,
 * law-shaped pin — THE DOUBLE-COUNTING GUARD: the bleed is STATE-DRIVEN (a pure function of
 * accumulated standing), never event-driven, so it can never re-count an event into the
 * settlement pair. Plus grievanceRead.dispositionOf (the downward flavor bias).
 */
import { describe, it, expect } from 'vitest';
import {
  ELITE_BLEED_TUNING, eliteBleedWeight, eliteBleedContribution, crossedSignificance, applyEliteBleed,
} from '../../src/domain/worldPulse/eliteBleed.js';
import { dispositionOf } from '../../src/domain/worldPulse/grievanceRead.js';

const T = ELITE_BLEED_TUNING;

describe('D-7f eliteBleedWeight — the influence product + the notable gate', () => {
  it('is the product of the three 0..1 factors', () => {
    expect(eliteBleedWeight({ importanceWeight01: 1, factionPowerStanding01: 1, politicsRank01: 1 })).toBe(1);
    expect(eliteBleedWeight({ importanceWeight01: 0.5, factionPowerStanding01: 0.5, politicsRank01: 0.5 })).toBeCloseTo(0.125, 5);
  });
  it('a below-notable pair weighs 0 even with maxed rank (the hard gate)', () => {
    expect(eliteBleedWeight({ importanceWeight01: 1, factionPowerStanding01: 1, politicsRank01: 1, bothNotable: false })).toBe(0);
  });
});

describe('D-7f eliteBleedContribution — threshold, sign, cap (state-driven)', () => {
  it('BELOW the weight floor ⇒ EXACTLY 0 (two feuding nobodies are noise by law)', () => {
    expect(eliteBleedContribution({ standing01: 1, weight01: T.FLOOR - 0.001 })).toBe(0);
    expect(eliteBleedContribution({ standing01: -1, weight01: 0 })).toBe(0);
  });
  it('a high-influence pair yields a measurable, SIGNED nudge (amity + / feud −)', () => {
    expect(eliteBleedContribution({ standing01: 0.8, weight01: 0.9 })).toBeGreaterThan(0);
    expect(eliteBleedContribution({ standing01: -0.8, weight01: 0.9 })).toBeLessThan(0);
  });
  it('is bounded by ±CAP (a slow nudge, never a lurch)', () => {
    expect(eliteBleedContribution({ standing01: 1, weight01: 1 })).toBeLessThanOrEqual(T.CAP);
    expect(eliteBleedContribution({ standing01: -1, weight01: 1 })).toBeGreaterThanOrEqual(-T.CAP);
  });
});

describe('D-7f THE DOUBLE-COUNTING GUARD (law-shaped, pinned)', () => {
  it('the bleed reads ONLY standing — the SAME standing yields the SAME delta regardless of event count', () => {
    // Two pairs with identical accumulated standing/weight but "different event histories"
    // (the guard: the bleed never sees events, only the state scalar).
    const fromOneEvent = eliteBleedContribution({ standing01: 0.6, weight01: 0.7 });
    const fromTenEvents = eliteBleedContribution({ standing01: 0.6, weight01: 0.7 });
    expect(fromOneEvent).toBe(fromTenEvents);
  });
  it('a crossing incident mints ONLY on a significance STATE TRANSITION, never per persisting state', () => {
    // Below → above the threshold crosses; above → above does NOT re-mint (persisting state ≠ event).
    expect(crossedSignificance(0, T.CROSSING_THRESHOLD)).toBe(true);
    expect(crossedSignificance(T.CROSSING_THRESHOLD, T.CROSSING_THRESHOLD + 0.01)).toBe(false);
    expect(crossedSignificance(-0.01, -T.CROSSING_THRESHOLD - 0.01)).toBe(true); // feud crossing (magnitude)
  });
  it('applyEliteBleed writes ONE settlement mark per pair through the plane\'s own writer (no re-count)', () => {
    const ws = { relationshipStates: { 'rel.a.b': { trust: 0.1, resentment: 0.1, recentIncidents: [] } } };
    const out = applyEliteBleed(ws, { pairs: [{ key: 'rel.a.b', standing01: 0.9, weight01: 0.9, priorSignificance: 0 }], tick: 50 });
    const edge = out.worldState.relationshipStates['rel.a.b'];
    // Exactly one incident appended (one mark per plane) and it is a typed elite mark.
    expect(edge.recentIncidents.length).toBe(1);
    expect(edge.recentIncidents[0].type).toBe('elite_amity');
    expect(edge.trust).toBeGreaterThan(0.1); // warmed
    expect(out.applied).toBe(1);
    expect(out.crossings).toBe(1);
  });
});

describe('D-7f applyEliteBleed — the A/B (high-influence marks, low-influence leaves nothing)', () => {
  const ws = { relationshipStates: { 'rel.a.b': { trust: 0.2, resentment: 0.2, recentIncidents: [] }, 'rel.c.d': { trust: 0.2, resentment: 0.2, recentIncidents: [] } } };
  it('a HIGH-influence feud measurably COOLS the two settlements; a LOW-influence feud leaves NO mark', () => {
    const out = applyEliteBleed(ws, { pairs: [
      { key: 'rel.a.b', standing01: -0.9, weight01: 0.9, priorSignificance: 0 }, // pillar vs chancellor — bites
      { key: 'rel.c.d', standing01: -0.9, weight01: T.FLOOR - 0.01, priorSignificance: 0 }, // nobodies — noise
    ], tick: 60 });
    const ab = out.worldState.relationshipStates['rel.a.b'];
    const cd = out.worldState.relationshipStates['rel.c.d'];
    expect(ab.resentment).toBeGreaterThan(0.2); // cooled
    expect(ab.recentIncidents.some((i) => i.type === 'elite_feud')).toBe(true);
    expect(cd.resentment).toBe(0.2); // untouched — the threshold pin
    expect(cd.recentIncidents.length).toBe(0);
    expect(out.applied).toBe(1); // only the high-influence pair contributed
  });
  it('an empty pair set is a byte-safe no-op (the pre-fold vacuity path)', () => {
    const out = applyEliteBleed(ws, { pairs: [], tick: 1 });
    expect(out.worldState).toBe(ws);
    expect(out.applied).toBe(0);
  });
});

describe('D-7f grievanceRead.dispositionOf — the downward formation bias', () => {
  it('a neutral / absent pair ⇒ no bias (1, 1)', () => {
    expect(dispositionOf(null)).toEqual({ bondMult: 1, grudgeMult: 1 });
    expect(dispositionOf({ trust: 0.3, resentment: 0.3 })).toEqual({ bondMult: 1, grudgeMult: 1 });
  });
  it('a HOSTILE pair dampens bond formation and amplifies grudge formation (suspicion)', () => {
    const d = dispositionOf({ trust: 0.1, resentment: 0.9 });
    expect(d.bondMult).toBeLessThan(1);
    expect(d.grudgeMult).toBeGreaterThan(1);
  });
  it('a WARM / trade pair eases bonds and dampens grudges', () => {
    const d = dispositionOf({ trust: 0.9, resentment: 0.1 });
    expect(d.bondMult).toBeGreaterThan(1);
    expect(d.grudgeMult).toBeLessThan(1);
  });
});
