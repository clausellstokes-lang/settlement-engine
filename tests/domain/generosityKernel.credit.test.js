/**
 * generosityKernel.credit.test.js — E1b: the CREDIT instrument goes live (§3.4) + the
 * §9 SMUGGLE-premium coupling pin.
 *
 * Credit maturity is exercised by INJECTING a matured kind:'credit' obligation into the
 * obligation sub-ledger and driving one advance: the maturity scan resolves it to REPAYMENT
 * (a solvent, non-malicious debtor — trust + the debt clears) or DEFAULT (an insolvent
 * debtor — the grievance ratchet = casus-belli seam + the lender's hardened heart). The
 * debtor's SOLVENCY is the food headroom above the reserve floor (storageMonths), read
 * INDEPENDENTLY of the pIndex "need" that drives candidate enumeration — so the scan is
 * isolated from any organic ask.
 *
 * SMUGGLE-premium pin (§9, "a coupling pin, not new code"): a REFUSE verdict moves NO food,
 * so the receiver's shortage — the unmet need-premium the M7 smuggle tail reads — persists
 * exactly. Mercy-smuggling emerges free.
 */
import { describe, it, expect } from 'vitest';
import { advanceGenerosity } from '../../src/domain/worldPulse/generosityKernel.js';
import { REACTION_TUNING, lendAppetiteOf } from '../../src/domain/spatial/generosityReactions.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { createPRNG } from '../../src/kernel/prng.js';

/** A minimal agrarian town (cap 2.0 months; no granary institution). */
function town(storageMonths) {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian' },
    institutions: [],
    economicState: {
      economicBase: 'agrarian',
      foodSecurity: { storageMonths, deficitPct: storageMonths < 1 ? 60 : 0, surplusPct: 0 },
    },
    powerStructure: { publicLegitimacy: { score: 44, label: 'Contested' }, factions: [{ faction: 'Gentry', category: 'noble', power: 60 }] },
  };
}

const EDGE = { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' };

/**
 * Drive one advance with an injected credit obligation b→a (debtor b owes creditor a).
 * @param {{ debtorStorageMonths: number, tick: number, seed?: string, needScore?: number, giverStorageMonths?: number }} o
 */
function driveWithInjectedCredit({ debtorStorageMonths, tick, seed = 'credit', needScore = 0, giverStorageMonths = 6 }) {
  const giver = town(giverStorageMonths);   // a = creditor
  const debtor = town(debtorStorageMonths); // b = debtor
  const snapshot = {
    settlements: [{ id: 'a', name: 'Ashford', settlement: giver }, { id: 'b', name: 'Briarwatch', settlement: debtor }],
  };
  const settlementUpdates = [
    { saveId: 'a', settlement: giver },
    { saveId: 'b', settlement: debtor },
  ];
  const worldState = {
    simulationRules: { constructiveFlowsEnabled: true, warLayerEnabled: false },
    calendar: { elapsedWeeks: 30 },
    relationshipStates: {},
    stressors: [],
    spatialLedgers: {
      obligations: { 'b:a:credit': { from: 'b', to: 'a', kind: 'credit', magnitude: 0.5, mintTick: 0, lastTick: 0 } },
    },
  };
  const pIndex = { get: () => ({ score: needScore }) };
  const graph = { edges: [EDGE] };
  return advanceGenerosity({
    snapshot, worldState, settlementUpdates, pIndex, graph,
    rng: createPRNG(seed), tick, now: '2026-01-01T00:00:00.000Z',
  });
}

describe('CREDIT maturity (§3.4) — the instrument goes live', () => {
  it('an INSOLVENT debtor DEFAULTS at maturity: debt clears, grievance ratchets (casus-belli), lender hardens', () => {
    const r = driveWithInjectedCredit({ debtorStorageMonths: 0.2, tick: REACTION_TUNING.CREDIT_TERM + 1 });
    expect(r.changed).toBe(true);

    // The credit obligation resolved (consumed → the ledger drops it).
    const obl = getSpatialLedger(r.worldState, 'obligations') || {};
    expect(obl['b:a:credit'], 'the matured credit is cleared from the ledger').toBeUndefined();

    // The grievance ratchet on the edge = the casus-belli seam.
    const rel = r.worldState.relationshipStates['edge.a.b'];
    expect(rel, 'the edge relationship state exists').toBeTruthy();
    const incs = (rel.recentIncidents || []).map((/** @type {{type?:string}} */ i) => i.type);
    expect(incs, 'a credit_defaulted incident was banked').toContain('credit_defaulted');
    expect(rel.resentment, 'resentment ratcheted up (the casus-belli grievance)').toBeGreaterThan(0.12);

    // The lender's hardened heart (appetite-to-lend decayed).
    const lend = getSpatialLedger(r.worldState, 'lendAppetite') || {};
    expect(lendAppetiteOf(lend, 'a'), "the lender's appetite-to-lend decayed below full").toBeLessThan(1);

    // The default reached the Chronicle.
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_credit_default'), 'a credit-default news beat was emitted').toBe(true);
  });

  it('a SOLVENT, non-malicious debtor REPAYS at maturity: debt clears, trust deepens, no grievance', () => {
    const r = driveWithInjectedCredit({ debtorStorageMonths: 8, tick: REACTION_TUNING.CREDIT_TERM + 1 });
    expect(r.changed).toBe(true);

    const obl = getSpatialLedger(r.worldState, 'obligations') || {};
    expect(obl['b:a:credit'], 'the repaid credit is cleared from the ledger').toBeUndefined();

    const rel = r.worldState.relationshipStates['edge.a.b'];
    const incs = (rel.recentIncidents || []).map((/** @type {{type?:string}} */ i) => i.type);
    expect(incs, 'a credit_repaid incident was banked').toContain('credit_repaid');
    expect(incs, 'a clean repayment banks no grievance').not.toContain('credit_defaulted');
    expect(rel.trust, 'trust deepened on repayment').toBeGreaterThan(0);

    // No default ⇒ no hardening (the lender ledger stays absent — byte-identical-dormant).
    expect(getSpatialLedger(r.worldState, 'lendAppetite'), 'no hardening on a clean repayment').toBeFalsy();
  });

  it('BEFORE maturity a credit obligation is untouched (still pending)', () => {
    const r = driveWithInjectedCredit({ debtorStorageMonths: 0.2, tick: REACTION_TUNING.CREDIT_TERM - 2 });
    const obl = getSpatialLedger(r.worldState, 'obligations') || {};
    // The record decays slowly but is NOT resolved (still present, still a credit).
    expect(obl['b:a:credit'], 'a pre-maturity credit is still on the ledger').toBeTruthy();
    expect(obl['b:a:credit'].kind).toBe('credit');
  });
});

describe('§9 SMUGGLE-premium coupling pin — a REFUSE moves no food (the shortage persists for M7)', () => {
  it('a refused ask leaves the receiver food EXACTLY unchanged (the unmet premium the smuggle tail reads)', () => {
    // Giver at the reserve floor (storageMonths ~1) cannot spare ⇒ REFUSE; receiver deeply
    // needy (high pIndex food pressure) ⇒ the ask qualifies + fires. Iterate seeds to land a
    // fired-and-refused tick (non-vacuous), then assert the receiver food is byte-unchanged.
    let refusedRun = null;
    for (let s = 0; s < 40 && !refusedRun; s++) {
      const r = driveWithInjectedCredit({
        debtorStorageMonths: 0.2, giverStorageMonths: 1, tick: 3, seed: `refuse-${s}`, needScore: 0.95,
      });
      // Clear the injected obligation's influence: we only care about a→b refuse here.
      const refuse = r.receipts.find((x) => x.giverId === 'a' && x.receiverId === 'b' && x.verdict === 'refuse');
      if (refuse) refusedRun = r;
    }
    expect(refusedRun, 'a fired-and-refused a→b tick was produced (non-vacuous)').toBeTruthy();
    const b = refusedRun.settlementUpdates.find((/** @type {{saveId:string}} */ u) => u.saveId === 'b');
    expect(b.settlement.economicState.foodSecurity.storageMonths, 'the receiver food is unchanged by a refusal ⇒ the shortage/premium persists for M7')
      .toBe(0.2);
  });
});
