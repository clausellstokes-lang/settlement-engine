/**
 * pactStrainBandFp44.test.js — FP-44 (FPQ-67), THE PACT STRAIN BAND.
 *
 * THE DEFECT. PASS 2 of `advanceTreaties` banded every clause's delivery capacity against ONE
 * pair of floors, `PEACE_TERMS_TUNING.HONORED_FLOOR` 0.75 and `DEFAULT_FLOOR` 0.4. Those floors
 * were authored for a dictated war settlement, where the loser is expected to be strained. The
 * capacity is the obligor COURT's (1 minus 0.6 economy plus 0.4 food pressure), so the line read
 * the weather rather than the clause: the measurement seat (findings/PACT-STRAIN-MEASURE.md)
 * found 18 of 27 pacts reading strained on the day they were signed, because an ordinary year's
 * hardship (burden 0.15 to 0.40) already crossed 0.25.
 *
 * THE BAND (the chair's signature FP-44 under ODQ §934.89, applied exactly as measured): a
 * NEGOTIATED clause (one carrying a `beneficiary`) reads strained only once its obligor is more
 * than half spent (capacity under PACT_HONORED_FLOOR 0.5) and broken only past four fifths
 * (capacity under PACT_DEFAULT_FLOOR 0.2). A war-door clause keeps today's line, byte for byte.
 *
 * The pact here is minted through the REAL drafter and signer; the war treaty is the ledger
 * shape the war door writes (no beneficiary on any term).
 */
import { describe, expect, test } from 'vitest';
import { advanceTreaties, treatyPairKey, TERM_CATALOG } from '../../src/domain/worldPulse/peaceTerms.js';
import { PEACE_TERMS_TUNING } from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { evolveCompliance } from '../../src/domain/worldPulse/peaceTermsAppraisal.js';
import { makeTermRoleReader } from '../../src/domain/worldPulse/treatyTermRoles.js';
import { draftPactSheet, signPactProposal } from '../../src/domain/worldPulse/pactFormation.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { clamp01 } from '../../src/kernel/math.js';

const T = PEACE_TERMS_TUNING;
const LIT = { warLayerEnabled: true, peaceEngineEnabled: true };
const KEY = treatyPairKey('iron', 'weak');

/** A snapshot member with enough texture for the strength and monitoring reads. */
function item(id, population) {
  return {
    id, name: id,
    settlement: {
      name: id, tier: 'town', population,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
      powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: 'military seat', category: 'military', power: 78, isGoverning: true }], conflicts: [] },
      npcs: [], activeConditions: [],
    },
  };
}
const ITEMS = [item('iron', 4000), item('weak', 3000)];
const EDGES = [{ id: 'edge.iron.weak', from: 'iron', to: 'weak', relationshipType: 'neutral' }];

/** The obligor's hardship: economy and food at the same severity, so burden01 === severity. */
const hardshipOn = (id, severity) => ({
  bySettlement: { [id]: [{ type: 'economy', severity }, { type: 'food', severity }] },
});

/** The pact: a one-sided trade clause `weak` owes `iron`, through the real drafter and signer. */
function mintedPact() {
  const sheet = draftPactSheet({ trigger: 'trade_demand', fromId: 'iron', toId: 'weak', reciprocal: false, tick: 6 });
  const signed = signPactProposal({
    worldState: { rngSeed: 'fp44', simulationRules: { pactFormationEnabled: true }, relationshipStates: {}, spatialLedgers: {} },
    proposal: { from: 'iron', to: 'weak', sheet },
    tick: 10,
  });
  return JSON.parse(JSON.stringify(getSpatialLedger(signed.worldState, 'treaties')[KEY]));
}

/** The war door's shape: a dictated settlement, iron the victor, no beneficiary on any term. */
function warTreaty() {
  const spec = TERM_CATALOG.non_aggression;
  return {
    parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', mintedTick: 0, believedMarginAtSignature: 0.35,
    budgetGranted: 3, budgetSpent: 1, complianceState: 'honored', treatyTicksPerYear: 52, receipts: ['pin'],
    terms: [{
      type: 'non_aggression', family: spec.family, magnitude: 1, mintedTick: 0, expiresTick: 500,
      weightSpent: spec.weight, complianceState: 'honored', trueState: 'honored', burden01: 0, receipt: 'war-door clause',
    }],
  };
}

/** One PASS 2 tick over a ledger holding `treaty`, with `pIndex` as the tick's pressure. */
function advanceOnce(treaty, pIndex, tick = 11) {
  const worldState = {
    tick, simulationRules: { ...LIT }, calendar: { elapsedWeeks: 30 }, deployments: {}, relationshipStates: {},
    spatialLedgers: { treaties: { [KEY]: treaty } },
  };
  const out = advanceTreaties({
    snapshot: { byId: new Map(ITEMS.map((i) => [i.id, i])), regionalGraph: { edges: EDGES } },
    worldState, settlementUpdates: [], graph: { edges: EDGES }, pIndex, tick, now: '2026-01-01T00:00:00.000Z',
  });
  return getSpatialLedger(out.worldState, 'treaties')[KEY];
}

describe('FP-44 — a pact clause reads strained only when its obligor is past half spent; war treaties keep their line', () => {
  test('A1 the band is the measured one, and the war floors are untouched', () => {
    expect(T.PACT_HONORED_FLOOR, 'honored at capacity 0.5 and above (burden at most one half)').toBe(0.5);
    expect(T.PACT_DEFAULT_FLOOR, 'broken only under capacity 0.2 (burden past four fifths)').toBe(0.2);
    // The derivation: the ordinary year's hump is burden 0.15 to 0.40 (capacity 0.60 to 0.85) and
    // the famine year's is 0.65 to 0.90 (capacity 0.10 to 0.35). The honored line sits BETWEEN them.
    expect(1 - T.PACT_HONORED_FLOOR, 'the honored line is above the ordinary hump').toBeGreaterThan(0.40);
    expect(1 - T.PACT_HONORED_FLOOR, 'and below the famine hump').toBeLessThan(0.65);
    expect(T.HONORED_FLOOR, 'the war door keeps 0.75').toBe(0.75);
    expect(T.DEFAULT_FLOOR, 'and 0.4').toBe(0.4);
  });

  test('A2 evolveCompliance bands a capacity against the floors it is handed, and against the war floors when handed none', () => {
    const pact = { honored: T.PACT_HONORED_FLOOR, defaulted: T.PACT_DEFAULT_FLOOR };
    expect(evolveCompliance({ loserCapacity01: 0.6, monitorReach01: 1, floors: pact }).trueState).toBe('honored');
    expect(evolveCompliance({ loserCapacity01: 0.3, monitorReach01: 1, floors: pact }).trueState).toBe('strained');
    expect(evolveCompliance({ loserCapacity01: 0.15, monitorReach01: 1, floors: pact }).trueState).toBe('defaulted');
    // The same capacities with no floors handed in read the war door's line.
    expect(evolveCompliance({ loserCapacity01: 0.6, monitorReach01: 1 }).trueState).toBe('strained');
    expect(evolveCompliance({ loserCapacity01: 0.3, monitorReach01: 1 }).trueState).toBe('defaulted');
    // The fog is unchanged: a blind obligee still believes the clause kept.
    expect(evolveCompliance({ loserCapacity01: 0.15, monitorReach01: 0.1, floors: pact }).observedState).toBe('honored');
    // Delivery is the capacity, whatever the floors.
    expect(evolveCompliance({ loserCapacity01: 0.6, monitorReach01: 1, floors: pact }).trueDelivery01).toBe(0.6);
  });

  test('A3 the role reader hands a negotiated clause the pact floors and a war-door clause the war floors', () => {
    const pact = mintedPact();
    const clause = pact.terms.find((t) => t.beneficiary === 'iron');
    expect(clause, 'the real mint wrote a clause running to iron').toBeTruthy();
    const read = (treaty, term) => makeTermRoleReader({
      treaty, orientation: { resolved: true, obligorId: 'weak', obligeeId: 'iron' },
      pressureFor: () => ({ economy: 0.4, food: 0.4 }), worldState: {}, truthFor: () => 0.5,
    }).forTerm(term);
    expect(read(pact, clause).floors).toEqual({ honored: T.PACT_HONORED_FLOOR, defaulted: T.PACT_DEFAULT_FLOOR });
    const war = warTreaty();
    expect(read(war, war.terms[0]).floors).toEqual({ honored: T.HONORED_FLOOR, defaulted: T.DEFAULT_FLOOR });
    // The figures themselves are the obligor's, unchanged by the band.
    expect(read(pact, clause).burden01).toBeCloseTo(0.4, 10);
  });

  test('A4 at burden 0.4 a war-door clause still reads strained and a pact clause reads honored', () => {
    const war = advanceOnce(warTreaty(), hardshipOn('weak', 0.4));
    expect(war.terms[0].burden01).toBe(0.4);
    expect(war.terms[0].trueState, 'capacity 0.6 is under the war door\'s 0.75').toBe('strained');
    expect(war.terms[0].complianceState).toBe('strained');
    const pact = advanceOnce(mintedPact(), hardshipOn('weak', 0.4));
    const clause = pact.terms.find((t) => t.beneficiary === 'iron');
    expect(clause.burden01).toBe(0.4);
    expect(clause.trueState, 'capacity 0.6 clears the pact line of 0.5').toBe('honored');
    expect(clause.complianceState).toBe('honored');
    expect(pact.complianceState, 'and the instrument reads kept').toBe('honored');
  });

  test('A5 a pact clause breaks only past four fifths: burden 0.7 strains it where the war door defaults, 0.85 breaks it', () => {
    const strained = advanceOnce(mintedPact(), hardshipOn('weak', 0.7)).terms.find((t) => t.beneficiary === 'iron');
    expect(strained.trueState, 'capacity 0.3 is under 0.5 and above 0.2').toBe('strained');
    expect(advanceOnce(warTreaty(), hardshipOn('weak', 0.7)).terms[0].trueState, 'the war door reads the same court as defaulted').toBe('defaulted');
    const broken = advanceOnce(mintedPact(), hardshipOn('weak', 0.85));
    expect(broken.terms.find((t) => t.beneficiary === 'iron').trueState, 'capacity 0.15 is under 0.2').toBe('defaulted');
    expect(broken.defaultedBy, 'and the obligor is named').toBe('weak');
  });

  test('A6 the war door is byte-identical: across a hardship grid every war-door clause reads the shared floors exactly', () => {
    const states = [];
    for (let step = 0; step <= 20; step += 1) {
      const severity = step / 20;
      const burden = clamp01(0.6 * clamp01(severity) + 0.4 * clamp01(severity));
      const capacity = clamp01(1 - burden);
      const oracle = capacity >= T.HONORED_FLOOR ? 'honored' : capacity >= T.DEFAULT_FLOOR ? 'strained' : 'defaulted';
      const clause = advanceOnce(warTreaty(), hardshipOn('weak', severity)).terms[0];
      expect(clause.trueState, `war-door clause at hardship ${severity}`).toBe(oracle);
      states.push(clause.trueState);
    }
    // anchored: the grid crosses both war floors, so the oracle above is not one constant word.
    expect(new Set(states)).toEqual(new Set(['honored', 'strained', 'defaulted']));
  });
});
