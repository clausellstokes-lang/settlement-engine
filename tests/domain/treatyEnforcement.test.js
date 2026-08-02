/**
 * treatyEnforcement.test.js — JOIN 3: THE TERMS MUST ACTUALLY TRANSFER SOMETHING.
 *
 * DESIGN_PEACE_ENGINE.md §11 declares six term executors. Three of them —
 * readiness_cap (demilitarization), war_block (non_aggression) and occupation_hold
 * (occupation_continuation) — were pure reads with ZERO src consumers: they were
 * referenced only by their own battery, which asked them what they returned rather
 * than whether anything obeyed them. A treaty was a document that did nothing.
 *
 * So every pin here drives the REAL CONSUMER, not the read:
 *   readiness_cap  → mobilization.evaluateMobilization (does the beaten court's war
 *                    footing actually stop climbing?)
 *   war_block      → warReasons.warReasonFactor (does the deploy weight the strategy
 *                    multiplies by actually collapse?)
 *   occupation_hold→ occupation.evaluateOccupations (does the ceded occupation actually
 *                    survive the army going home?)
 *
 * Each join carries its NEGATIVE CONTROL in the same shape: identical world, treaty
 * removed or term expired ⇒ the pre-wire behaviour returns exactly. A pin that only
 * showed the bound case would pass just as happily against a hardcoded constant.
 */

import { describe, it, expect } from 'vitest';

import {
  demilitarizationCapFor, treatyBlocksWar, occupationHoldFor,
  streamInstallmentFraction, TREATY_ENFORCEMENT_TUNING,
} from '../../src/domain/worldPulse/treatyEnforcement.js';
import { PEACE_TERMS_TUNING, treatyPairKey, TERM_CATALOG } from '../../src/domain/worldPulse/peaceTerms.js';
import { evaluateMobilization, isWarReady, cappedRampIndex, RAMP } from '../../src/domain/worldPulse/mobilization.js';
import { warReasonFactor } from '../../src/domain/worldPulse/warReasons.js';
import { evaluateOccupations } from '../../src/domain/worldPulse/occupation.js';

const LIT = { warLayerEnabled: true, peaceEngineEnabled: true };

/** One treaty term, minimally well-formed for the enforcement reads. */
function term(type, { magnitude = 0.5, expiresTick = 100 } = {}) {
  return {
    type, family: TERM_CATALOG[type].family, magnitude,
    mintedTick: 0, expiresTick, weightSpent: TERM_CATALOG[type].weight,
    complianceState: 'honored', trueState: 'honored', burden01: 0, receipt: `${type} term`,
  };
}

/** A lit world carrying ONE treaty: victor `iron` over loser `weak`. */
function treatyWorld(terms, { tick = 10, treatyPatch = {}, ...extra } = {}) {
  return {
    tick,
    simulationRules: { ...LIT },
    spatialLedgers: {
      treaties: {
        [treatyPairKey('iron', 'weak')]: {
          parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak',
          mintedTick: 0, believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
          complianceState: 'honored', terms, receipts: ['pin'], ...treatyPatch,
        },
      },
    },
    ...extra,
  };
}

/** The same world with NO treaties ledger at all — the negative control. */
function untreatiedWorld(extra = {}) {
  return { tick: 10, simulationRules: { ...LIT }, ...extra };
}

// ── A) THE TUNING MUST NOT DRIFT ────────────────────────────────────────────

describe('JOIN 3 substrate', () => {
  it('the installment clock matches the duration clock (a term priced for N years pays across exactly its ticks)', () => {
    // The two constants are duplicated on purpose (peaceTerms imports the leaf, so the
    // leaf can never import peaceTerms back). This is the guard that keeps the fork honest.
    expect(TREATY_ENFORCEMENT_TUNING.INSTALLMENTS_PER_YEAR).toBe(PEACE_TERMS_TUNING.TICKS_PER_YEAR);
  });

  it('streamInstallmentFraction: one tick draws one installment of the yearly share, scaled by what the payer can deliver', () => {
    const full = streamInstallmentFraction({ magnitude: 0.6 }, 1);
    expect(full).toBeCloseTo(0.6 / TREATY_ENFORCEMENT_TUNING.INSTALLMENTS_PER_YEAR, 9);
    // A half-capacity payer delivers half the installment (the §12 under-delivery signal).
    expect(streamInstallmentFraction({ magnitude: 0.6 }, 0.5)).toBeCloseTo(full / 2, 9);
    // NEGATIVE: no capacity, or no term, draws nothing at all.
    expect(streamInstallmentFraction({ magnitude: 0.6 }, 0)).toBe(0);
    expect(streamInstallmentFraction({ magnitude: 0 }, 1)).toBe(0);
    expect(streamInstallmentFraction(null, 1)).toBe(0);
  });
});

// ── B) readiness_cap — THE POLARITY, THEN THE CONSUMER ──────────────────────

describe('JOIN 3 readiness_cap — a demilitarization term caps the war footing', () => {
  it('the ceiling is the term SEVERITY\'S COMPLEMENT, and the harshest live term governs', () => {
    // A crushing demilitarization (magnitude 0.9) must be a TIGHT ceiling (0.1), not a
    // loose one. The old reader returned the magnitude itself, which inverted the term.
    expect(demilitarizationCapFor(treatyWorld([term('demilitarization', { magnitude: 0.9 })]), 'weak', 10)).toBeCloseTo(0.1, 9);
    expect(demilitarizationCapFor(treatyWorld([term('demilitarization', { magnitude: 0.2 })]), 'weak', 10)).toBeCloseTo(0.8, 9);
    // NEGATIVE (unbound): past expiry, wrong settlement, and no ledger all read null.
    expect(demilitarizationCapFor(treatyWorld([term('demilitarization', { magnitude: 0.9 })]), 'weak', 200)).toBeNull();
    expect(demilitarizationCapFor(treatyWorld([term('demilitarization', { magnitude: 0.9 })]), 'iron', 10)).toBeNull();
    expect(demilitarizationCapFor(untreatiedWorld(), 'weak', 10)).toBeNull();
  });

  it('cappedRampIndex: the ceiling maps onto the ramp, and an absent ceiling is the top rung', () => {
    expect(cappedRampIndex(null)).toBe(RAMP.length - 1);
    expect(cappedRampIndex(1)).toBe(RAMP.length - 1);
    expect(cappedRampIndex(0)).toBe(0);
    expect(cappedRampIndex(0.1)).toBeLessThan(RAMP.length - 1);
  });

  it('CONSUMER: a demilitarized court cannot climb to `mobilized`, so the deploy gate refuses it', () => {
    const item = mobItem('weak');
    const snapshot = { settlements: [{ id: 'weak' }], byId: new Map([['weak', item]]) };
    const wantsWarFor = () => true;

    // BOUND: a live, crushing demilitarization term. Ramp from `mobilized` for many ticks.
    let ws = treatyWorld([term('demilitarization', { magnitude: 0.9 })], {
      warPosture: { weak: { state: 'mobilized', progress: 1, sinceTick: 0 } },
    });
    let state = ws;
    for (let t = 0; t < 12; t += 1) {
      const out = evaluateMobilization({ snapshot, worldState: state, tick: 10, wantsWarFor });
      state = { ...state, warPosture: out.warPosture };
    }
    const capped = state.warPosture.weak;
    expect(isWarReady(capped?.state), 'a treaty-capped court is NOT war-ready').toBe(false);
    expect(RAMP.indexOf(capped?.state ?? 'peace')).toBeLessThanOrEqual(cappedRampIndex(0.1));

    // NEGATIVE CONTROL: the identical world with the treaty REMOVED climbs right back to
    // `mobilized` and IS war-ready. Same fixture, same ticks — only the treaty differs.
    let free = untreatiedWorld({ warPosture: { weak: { state: 'mobilized', progress: 1, sinceTick: 0 } } });
    for (let t = 0; t < 12; t += 1) {
      const out = evaluateMobilization({ snapshot, worldState: free, tick: 10, wantsWarFor });
      free = { ...free, warPosture: out.warPosture };
    }
    expect(isWarReady(free.warPosture.weak?.state), 'without the treaty it rearms freely').toBe(true);
  });

  it('CONSUMER (expiry lifts it): past its expiresTick the same term stops capping', () => {
    const item = mobItem('weak');
    const snapshot = { settlements: [{ id: 'weak' }], byId: new Map([['weak', item]]) };
    let state = treatyWorld([term('demilitarization', { magnitude: 0.9, expiresTick: 5 })], {
      warPosture: { weak: { state: 'war_preparation', progress: 0.9, sinceTick: 0 } },
    });
    for (let t = 0; t < 12; t += 1) {
      const out = evaluateMobilization({ snapshot, worldState: state, tick: 10, wantsWarFor: () => true });
      state = { ...state, warPosture: out.warPosture };
    }
    expect(isWarReady(state.warPosture.weak?.state), 'a lapsed cap binds nothing').toBe(true);
  });
});

/** A snapshot item that ramps freely: solvent, legitimate, fed, no cool trigger. */
function mobItem(id) {
  return {
    id,
    causal: { scores: { economic_capacity: 80 } },
    settlement: {
      name: id, tier: 'town', population: 1800,
      powerStructure: { publicLegitimacy: { score: 70 }, factions: [], conflicts: [] },
      economicState: { foodSecurity: { storageMonths: 6, dailyNeed: 100, dailyProduction: 100 } },
      institutions: [], npcs: [], activeConditions: [], config: {},
    },
  };
}

// ── C) war_block — THE CONSUMER IS THE DEPLOY-WEIGHT MULTIPLIER ─────────────

describe('JOIN 3 war_block — a live non-aggression pact collapses the war lane', () => {
  it('CONSUMER: warReasonFactor returns 0 for a pact-bound pair (the strategy multiplies its deployScore by this)', () => {
    const bound = treatyWorld([term('non_aggression')]);
    expect(warReasonFactor(bound, 'iron', 'weak')).toBe(0);
    expect(warReasonFactor(bound, 'weak', 'iron'), 'a pact binds BOTH directions').toBe(0);
  });

  it('NEGATIVE CONTROL: no pact, an EXPIRED pact, and a REPUDIATED pact all leave the lane open at the identity', () => {
    expect(warReasonFactor(untreatiedWorld(), 'iron', 'weak'), 'no treaty ⇒ the pre-wire identity').toBe(1);
    // Expired: the same term, read from a world whose clock has moved past it.
    expect(warReasonFactor(treatyWorld([term('non_aggression', { expiresTick: 5 })], { tick: 10 }), 'iron', 'weak')).toBe(1);
    // Repudiated (§12.4): a defaulted treaty stops blocking — and the SAME default mints
    // the treaty_default casus, so the oathbreaker is attackable rather than protected.
    const repudiated = treatyWorld([term('non_aggression')], { treatyPatch: { complianceState: 'defaulted' } });
    expect(treatyBlocksWar(repudiated, 'iron', 'weak', 10)).toBe(false);
    expect(warReasonFactor(repudiated, 'iron', 'weak')).toBe(1);
  });

  it('NEGATIVE CONTROL (wrong pair / dark gate): the pact protects only its own signatories', () => {
    const bound = treatyWorld([term('non_aggression')]);
    expect(warReasonFactor(bound, 'iron', 'stranger'), 'a third party is not covered').toBe(1);
    // Dark gate ⇒ the factor short-circuits to the identity before any treaty read.
    const dark = { ...bound, simulationRules: { warLayerEnabled: true } };
    expect(warReasonFactor(dark, 'iron', 'weak')).toBe(1);
  });

  it('a treaty carrying NO non_aggression term blocks nothing (the term, not the treaty, is the block)', () => {
    expect(warReasonFactor(treatyWorld([term('tribute')]), 'iron', 'weak')).toBe(1);
  });
});

// ── D) occupation_hold — THE CONSUMER IS THE OCCUPATION LADDER ──────────────

describe('JOIN 3 occupation_hold — a ceded occupation survives the army going home', () => {
  /** An occupied settlement whose resistance will collapse the occupation outright:
   *  intact, populous, loyalist, with NO occupier army anywhere near it. */
  const occupiedItem = {
    id: 'weak',
    settlement: {
      name: 'weak', tier: 'city', population: 9000,
      powerStructure: { publicLegitimacy: { score: 80 }, factions: [], conflicts: [] },
      economicState: {}, institutions: [], npcs: [], activeConditions: [],
    },
  };
  const ironItem = { id: 'iron', settlement: { name: 'iron', tier: 'town', population: 1500, powerStructure: { factions: [] }, institutions: [], npcs: [] } };
  const snapshot = { byId: new Map([['weak', occupiedItem], ['iron', ironItem]]), regionalGraph: { edges: [] } };
  // A collapsing occupation: contested, high resistance, no garrison in the field.
  const occ = { occupierId: 'iron', state: 'contested', sinceTick: 0, stateHeld: 0, resistance: 0.95, benefitYield: 0, lastTick: 0 };

  function run(worldState) {
    return evaluateOccupations({
      snapshot, worldState, graph: { edges: [] }, deployments: {},
      warOutcomes: [], returnOutcomes: [], tick: 10, rules: { warLayerEnabled: true },
    });
  }

  it('the hold read is DIRECTIONAL: only the victor named in the treaty gains the right', () => {
    const ws = treatyWorld([term('occupation_continuation')]);
    expect(occupationHoldFor(ws, 'weak', 'iron', 10), 'the victor holds the loser').toBe(true);
    expect(occupationHoldFor(ws, 'iron', 'weak', 10), 'the loser holds nothing').toBe(false);
    expect(occupationHoldFor(ws, 'weak', 'iron', 200), 'and the right expires').toBe(false);
    expect(occupationHoldFor(untreatiedWorld(), 'weak', 'iron', 10)).toBe(false);
  });

  it('CONSUMER: the occupation that WOULD collapse is held while the term runs', () => {
    const held = run(treatyWorld([term('occupation_continuation')], { occupations: { weak: { ...occ } } }));
    expect(held.occupations.weak, 'the ceded occupation stands').toBeTruthy();
    expect(held.outcomes.some((o) => String(o.id || '').startsWith('world_outcome.occupation_collapsed.')), 'and no collapse beat fires').toBe(false);
  });

  it('NEGATIVE CONTROL: the identical occupation with NO treaty collapses and exits the ledger', () => {
    const free = run(untreatiedWorld({ occupations: { weak: { ...occ } } }));
    expect(free.occupations.weak, 'without the treaty it is thrown off').toBeFalsy();
    expect(free.outcomes.some((o) => String(o.id || '').startsWith('world_outcome.occupation_collapsed.')), 'and the collapse beat fires').toBe(true);
  });

  it('NEGATIVE CONTROL (expiry): the day the term lapses, the same occupation collapses', () => {
    const lapsed = run(treatyWorld([term('occupation_continuation', { expiresTick: 5 })], { occupations: { weak: { ...occ } } }));
    expect(lapsed.occupations.weak, 'an expired hold holds nothing').toBeFalsy();
    expect(lapsed.outcomes.some((o) => String(o.id || '').startsWith('world_outcome.occupation_collapsed.'))).toBe(true);
  });

  it('NEGATIVE CONTROL (wrong term): a treaty whose only term is tribute does not hold an occupation', () => {
    const wrong = run(treatyWorld([term('tribute')], { occupations: { weak: { ...occ } } }));
    expect(wrong.occupations.weak).toBeFalsy();
  });
});
