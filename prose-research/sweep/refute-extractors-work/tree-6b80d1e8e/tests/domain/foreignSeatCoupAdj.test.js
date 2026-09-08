/**
 * foreignSeatCoupAdj.test.js — W-SEAT D4's SUCCESS moment: the FIFTH signed
 * additive term in the coup verdict's `pHold` clamp, and the ADJ BUDGET that
 * five composing terms now make a real question rather than a rhetorical one.
 *
 * ⛔ THE BUDGET ARM IS THE ONE THAT WOULD NOT EXIST IF NOBODY LOOKED. F3 warned
 * that the clamp would carry six signed terms once SEAT-7 lands, and the failure
 * mode is NOT overflow — the clamp bounds that — it is SATURATION: enough adjs
 * pointing the same way pin `pHold` to a clamp edge, and `share`, the thing the
 * contest is actually about, stops mattering. A term added without measuring the
 * composition is exactly how that arrives with every existing test green.
 */
import { describe, expect, it } from 'vitest';

import { SEAT_TUNING, foreignSeatCoupAdj } from '../../src/domain/rulingPowerSeat.js';
import { resolveCoupVerdict } from '../../src/domain/rulingPowerCoup.js';

/** A settlement with a real contest: an incumbent and three live challengers. */
function contested() {
  return {
    name: 'Aster',
    powerStructure: {
      governingName: 'Crown',
      publicLegitimacy: { score: 35, govMultiplier: 1 },
      factions: [
        { faction: 'Crown', category: 'government', power: 40, isGoverning: true },
        { faction: 'Iron Company', category: 'military', power: 34 },
        { faction: 'House Vell', category: 'noble', power: 30 },
        { faction: 'The Guilds', category: 'merchant', power: 26 },
      ],
    },
  };
}

function item(id, name) {
  return { id, name, settlement: { ...contested(), name } };
}

function snapshotOf() {
  const items = [item('a', 'Aster'), item('o', 'Gloamhold')];
  return { settlements: items, byId: new Map(items.map((e) => [e.id, e])) };
}

/**
 * A vassal edge on which `a` is the junior of `o`.
 *
 * ⚠ THE EDGE/STATE SHAPE IS COPIED FROM `foreignSeatResolver.test.js:158-171`, NOT
 * INVENTED. The first draft of this fixture keyed `relationshipStates` by a
 * hand-made `'a|o'` and named the roles `seniorId`/`juniorId`; the resolver keys by
 * `relationshipKeyFromEdge` and reads `overlordSaveId`/`vassalSaveId`, so it
 * resolved NOTHING and the adj came back 0 — a fixture that produces a shape the
 * corpus never produces, which is the recorded hazard, arriving in a TEST. Three
 * assertions caught it. Keep this shape in step with the resolver suite.
 */
const VASSAL_EDGE = Object.freeze({ id: 'e1', from: 'o', to: 'a', relationshipType: 'vassal' });

function vassalWorld({ lit = true } = {}) {
  return {
    simulationRules: lit ? { foreignSeatEnabled: true } : {},
    relationshipStates: {
      e1: {
        relationshipType: 'vassal',
        overlordSaveId: 'o',
        vassalSaveId: 'a',
        leverage: 0.82,
        dependency: 0.82,
        pactStrength: 0.58,
        fear: 0.48,
        resentment: 0.2,
      },
    },
  };
}

function vassalSnapshot() {
  return { ...snapshotOf(), regionalGraph: { edges: [VASSAL_EDGE], channels: [] } };
}

/** A deterministic rng: every draw is the same value, so pHold is the only variable. */
const rngAt = (value) => ({ random: () => value });

describe('D4 SUCCESS — the fifth adj is 0 when dark', () => {
  it('returns exactly 0 with the flag absent, false, or truthy-not-true', () => {
    const snap = vassalSnapshot();
    expect(foreignSeatCoupAdj(vassalWorld({ lit: false }), snap, 'a')).toBe(0);
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      const w = vassalWorld({ lit: false });
      w.simulationRules.foreignSeatEnabled = truthy;
      expect(foreignSeatCoupAdj(w, snap, 'a'), `truthy ${JSON.stringify(truthy)}`).toBe(0);
    }
  });

  it('returns exactly 0 when lit but no seat resolves at all', () => {
    const world = { simulationRules: { foreignSeatEnabled: true } };
    expect(foreignSeatCoupAdj(world, snapshotOf(), 'a')).toBe(0);
  });

  it('is INERT on garbage rather than producing a NaN into the clamp', () => {
    for (const bad of [null, undefined, 7, 'world', []]) {
      expect(Number.isFinite(foreignSeatCoupAdj(bad, snapshotOf(), 'a')), `${bad}`).toBe(true);
    }
  });

  it('a zero adj reproduces the verdict BIT for BIT, not merely closely', () => {
    const args = { settlement: contested(), rng: rngAt(0.5), severity: 0.6, rulingAuthorityScore: 42 };
    const before = resolveCoupVerdict({ ...args });
    const after = resolveCoupVerdict({ ...args, foreignSeatAdj: 0 });
    expect(Object.is(after.pHold, before.pHold)).toBe(true);
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
  });
});

describe('D4 SUCCESS — the DISCOVERY: a lit seat defends the government it deals with', () => {
  it('resolves a positive adj over a vassal compact, bounded by the tuning', () => {
    const adj = foreignSeatCoupAdj(vassalWorld(), vassalSnapshot(), 'a');
    expect(adj).toBeGreaterThan(0);
    expect(adj).toBeLessThanOrEqual(SEAT_TUNING.COUP_PHOLD_WEIGHT);
    // anchored: the same read is 0 one line away with the flag down, so the
    // magnitude above is about the seat and not about the fixture.
    expect(foreignSeatCoupAdj(vassalWorld({ lit: false }), vassalSnapshot(), 'a')).toBe(0);
  });

  it('RAISES the incumbent hold-chance on the same seed — the term does work', () => {
    const args = { settlement: contested(), rng: rngAt(0.5), severity: 0.6, rulingAuthorityScore: 42 };
    const adj = foreignSeatCoupAdj(vassalWorld(), vassalSnapshot(), 'a');
    const bare = resolveCoupVerdict({ ...args });
    const seated = resolveCoupVerdict({ ...args, foreignSeatAdj: adj });
    expect(seated.pHold).toBeGreaterThan(bare.pHold);
  });

  it('is POSITIVE BY CONSTRUCTION, in both regimes — the ruling, executed', () => {
    // An occupier crowned the sitting row; an overlord's compact is written with
    // it. A coup threatens the arrangement either way, so the seat never lands on
    // the challenger's side. The "discard the client" case is D11/SEAT-8's typed
    // stake and is deliberately not a sign this scalar invents.
    const occupied = {
      simulationRules: { foreignSeatEnabled: true },
      occupations: { a: { occupierId: 'o', state: 'extractive', resistance: 0.1 } },
    };
    expect(foreignSeatCoupAdj(occupied, snapshotOf(), 'a')).toBeGreaterThan(0);
    expect(foreignSeatCoupAdj(vassalWorld(), vassalSnapshot(), 'a')).toBeGreaterThan(0);
  });
});

describe('D4 SUCCESS — THE ADJ BUDGET, measured rather than assumed', () => {
  // The five live magnitudes, named where they live. SEAT-7's forceRatioAdj is
  // chartered as a sixth and this table is where it must declare itself.
  const TERMS = Object.freeze([
    { name: 'authorityAdj', bound: 0.125, home: 'rulingPowerCoup.js (score − 50) / 400' },
    { name: 'warSentimentAdj', bound: 0.22, home: 'coup.js WAR_SENTIMENT_PHOLD_WEIGHT' },
    { name: 'interventionAdj', bound: 0.22, home: 'convergence.js CONVERGENCE_TUNING.PHOLD_WEIGHT' },
    { name: 'economicAdj', bound: 0.125, home: 'coup.js (score − 50) / 400' },
    { name: 'foreignSeatAdj', bound: SEAT_TUNING.COUP_PHOLD_WEIGHT, home: 'rulingPowerSeat.js SEAT_TUNING' },
  ]);
  /** The committed budget. Raising it is a tuning-signature act, not a lane's call. */
  const DECLARED_BUDGET = 0.82;

  it('the composed worst case stays inside the declared budget', () => {
    const worst = TERMS.reduce((sum, t) => sum + t.bound, 0);
    expect(worst).toBeLessThanOrEqual(DECLARED_BUDGET);
    // anchored: the budget is not slack — it is within a hair of the real sum, so
    // a sixth term cannot be added without this line failing and someone deciding.
    expect(worst).toBeGreaterThan(DECLARED_BUDGET - 0.05);
  });

  it('the seat term sits at the POLITICAL tier, strictly below the physical one', () => {
    // A foreign seat is standing and leverage; an army in the square is louder.
    // If these ever invert, the design has quietly changed and this line says so.
    const seat = SEAT_TUNING.COUP_PHOLD_WEIGHT;
    expect(seat).toBe(0.125);
    expect(seat).toBeLessThan(0.22);
  });

  it('SATURATION is possible and that is why the budget is declared, not hoped for', () => {
    // The honest statement of the risk: with every adj pointing one way the clamp
    // edge is reachable, and at the edge `share` stops mattering. This arm asserts
    // the reachability rather than pretending the clamp makes it safe.
    const args = { settlement: contested(), rng: rngAt(0.5), severity: 0.6 };
    const pinned = resolveCoupVerdict({
      ...args,
      rulingAuthorityScore: 100,
      warSentimentAdj: 0.22,
      interventionAdj: 0.22,
      economicAdj: 0.125,
      foreignSeatAdj: SEAT_TUNING.COUP_PHOLD_WEIGHT,
    });
    expect(pinned.pHold).toBe(0.9); // anchored: the upper clamp edge, reachable today
    const bare = resolveCoupVerdict({ ...args, rulingAuthorityScore: 100 });
    expect(bare.pHold).toBeLessThan(0.9); // and NOT reachable without the adjs
  });
});
