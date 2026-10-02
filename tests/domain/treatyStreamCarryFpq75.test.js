/**
 * treatyStreamCarryFpq75.test.js — FPQ-75, CLAUSES THAT DELIVER.
 *
 * THE DEFECT, MEASURED. A stream clause's magnitude is its nominal YEARLY share of the payer's
 * spareable granary (`treatyEnforcement.js :: streamInstallmentFraction`), so one installment on
 * the current 52-tick clock asks for a fifty-second of it: a 0.5 clause on 4.5 spareable months
 * asks 0.043 months a week. The conserved sink (`foodStockpile.js :: computeSackFoodTransfer`)
 * moves grain in tenth-months and FLOORS every request, which is its stated conservation law,
 * and the treaty path dropped the residue every week. Measured: 0 of 18,211 pact stream
 * clause-ticks on the eight brief worlds moved any grain, and 0 of 156 war-door stream ticks in
 * the war door's probe.
 *
 * THE CURE (the chair's shape, in the treaty's OWN path): `treatyTransfer.js ::
 * drawStreamInstallment` carries what a clause owes but the floor could not move on the clause
 * itself (`installmentCarryMonths`, drop-when-absent) until it reaches the primitive's grain,
 * in a lot the obligee can receive (the sink floors the credit in the obligee's months too).
 * The shared primitive, and every caller that is not a treaty stream, is untouched.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { advanceTreaties, treatyPairKey, TERM_CATALOG } from '../../src/domain/worldPulse/peaceTerms.js';
import { computeTreatyGrainDraw, drawStreamInstallment, TREATY_TRANSFER_TUNING } from '../../src/domain/worldPulse/treatyTransfer.js';
import { computeSackFoodTransfer } from '../../src/domain/worldPulse/foodStockpile.js';
import { draftPactSheet, signPactProposal } from '../../src/domain/worldPulse/pactFormation.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LIT = { warLayerEnabled: true, peaceEngineEnabled: true };
const KEY = treatyPairKey('iron', 'weak');
const PAYER_MONTHS = 6;
const PAYER_POP = 3000;
const PAYEE_MONTHS = 1;
const PAYEE_POP = 1500;
const SPAREABLE = PAYER_MONTHS - TREATY_TRANSFER_TUNING.RESERVE_MONTHS;

/** A member with a REAL granary (a State Granary gives it an eight-month ceiling). */
function item(id, population, storageMonths) {
  return {
    id, name: id,
    settlement: {
      name: id, tier: 'town', population,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: storageMonths == null ? [] : [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
        ...(storageMonths == null ? {} : { foodSecurity: { storageMonths, dailyNeed: 100, dailyProduction: 100, deficitPct: 0, surplusPct: 0, resilienceScore: 50 } }),
      },
      powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: 'military seat', category: 'military', power: 78, isGoverning: true }], conflicts: [] },
      npcs: [], activeConditions: [],
    },
  };
}
const FED = [item('iron', PAYEE_POP, PAYEE_MONTHS), item('weak', PAYER_POP, PAYER_MONTHS)];
const EDGES = [{ id: 'edge.iron.weak', from: 'iron', to: 'weak', relationshipType: 'neutral' }];

/** The pact: `weak` owes `iron` a grain clause, through the REAL drafter and signer. */
function mintedPact() {
  const sheet = draftPactSheet({ trigger: 'trade_demand', fromId: 'iron', toId: 'weak', reciprocal: false, tick: 6 });
  const signed = signPactProposal({
    worldState: { rngSeed: 'fpq75', simulationRules: { pactFormationEnabled: true }, relationshipStates: {}, spatialLedgers: {} },
    proposal: { from: 'iron', to: 'weak', sheet },
    tick: 10,
  });
  return JSON.parse(JSON.stringify(getSpatialLedger(signed.worldState, 'treaties')[KEY]));
}

/** The war door's shape: a dictated tribute on the current clock, no beneficiary. */
function warTribute(magnitude = 0.25) {
  const spec = TERM_CATALOG.tribute;
  return {
    parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', mintedTick: 10, believedMarginAtSignature: 0.35,
    budgetGranted: 3, budgetSpent: 1, complianceState: 'honored', treatyTicksPerYear: 52, receipts: ['pin'],
    terms: [{
      type: 'tribute', family: spec.family, magnitude, mintedTick: 10, expiresTick: 10 + 52 * 4,
      weightSpent: spec.weight, complianceState: 'honored', trueState: 'honored', burden01: 0,
      receipt: 'war-door tribute', deliveredToVictor: 0, extractedFromLoser: 0,
    }],
  };
}

/**
 * Drive PASS 2 from `from` to `to` (exclusive) over a FIXED snapshot: the granaries are read
 * fresh each week rather than folded back, so every installment prices against the same
 * spareable stock and the expected total is exact arithmetic. The ledger (and its carry) is
 * carried week to week, exactly as the pulse carries it.
 */
function driveWeeks(treaty, from, to, items = FED) {
  let worldState = {
    tick: from, simulationRules: { ...LIT }, calendar: { elapsedWeeks: 30 }, deployments: {}, relationshipStates: {},
    spatialLedgers: { treaties: { [KEY]: treaty } },
  };
  const weeks = [];
  for (let tick = from; tick < to; tick += 1) {
    const out = advanceTreaties({
      snapshot: { byId: new Map(items.map((i) => [i.id, i])), regionalGraph: { edges: EDGES } },
      worldState: { ...worldState, tick },
      settlementUpdates: items.map((i) => ({ saveId: i.id, settlement: i.settlement })),
      graph: { edges: EDGES }, pIndex: null, tick, now: '2026-01-01T00:00:00.000Z',
    });
    worldState = out.worldState;
    const live = getSpatialLedger(worldState, 'treaties')?.[KEY];
    weeks.push({ tick, term: live ? JSON.parse(JSON.stringify(live.terms.find((t) => TERM_CATALOG[t.type].stream))) : null });
  }
  return weeks;
}
const lastLive = (weeks) => weeks.filter((w) => w.term).at(-1).term;

describe('FPQ-75 — a stream clause delivers its catalogue magnitude over its span', () => {
  test('B1 a pact grain clause delivers grain within a season, where every weekly installment used to round away', () => {
    const pact = mintedPact();
    const clause = pact.terms.find((t) => TERM_CATALOG[t.type].stream);
    expect(clause, 'the real mint drafted a stream clause').toBeTruthy();
    const weekly = (clause.magnitude * SPAREABLE) / 52;
    expect(weekly, 'one week asks for less than the granary moves at once').toBeLessThan(0.1);
    const season = lastLive(driveWeeks(pact, 10, 23));
    expect(season.extractedFromLoser, 'the obligor paid within thirteen weeks').toBeGreaterThan(0);
    expect(season.deliveredToVictor, 'and the obligee received').toBeGreaterThan(0);
  });

  test('B2 over its whole span the clause delivers its magnitude, short by less than one tenth-month', () => {
    const pact = mintedPact();
    const clause = pact.terms.find((t) => TERM_CATALOG[t.type].stream);
    const span = clause.expiresTick - clause.mintedTick;
    const weeks = driveWeeks(pact, clause.mintedTick, clause.expiresTick);
    const final = lastLive(weeks);
    const owed = clause.magnitude * SPAREABLE * (span / 52);
    expect(final.extractedFromLoser, 'never more than the clause asked').toBeLessThanOrEqual(owed + 1e-6);
    expect(owed - final.extractedFromLoser, 'and short only by the last sub-tenth remainder').toBeLessThan(0.1 + 1e-6);
    for (const { tick, term } of weeks) {
      if (!term) continue;
      const carry = Number(term.installmentCarryMonths ?? 0);
      expect(carry, `week ${tick}: the carry is what is owed and not yet moved`).toBeGreaterThanOrEqual(0);
      expect(carry, `week ${tick}: and it never holds a whole tenth-month the granary could move`).toBeLessThan(0.1);
      // CONSERVED: absolute food gained never exceeds absolute food lost.
      expect(term.deliveredToVictor * PAYEE_POP, `week ${tick}: no grain is minted`).toBeLessThanOrEqual(term.extractedFromLoser * PAYER_POP + 1e-9);
    }
  });

  test('B3 a war-door tribute on the weekly clock delivers too: the same defect, the same cure', () => {
    const weeks = driveWeeks(warTribute(0.25), 10, 23);
    const season = lastLive(weeks);
    expect((0.25 * SPAREABLE) / 52, 'a quarter-share tribute asks a fiftieth of a month a week').toBeLessThan(0.1);
    expect(season.extractedFromLoser, 'the bound court paid within the season').toBeGreaterThan(0);
    expect(season.deliveredToVictor).toBeGreaterThan(0);
  });

  test('B4 the carry is drop-when-absent: a payer at its reserve floor or with no granary carries nothing', () => {
    const atFloor = [item('iron', PAYEE_POP, PAYEE_MONTHS), item('weak', PAYER_POP, TREATY_TRANSFER_TUNING.RESERVE_MONTHS)];
    const floored = lastLive(driveWeeks(mintedPact(), 10, 23, atFloor));
    // anchored: the clause itself is live and present (lastLive found it), so the key's absence is a measured fact.
    expect(floored).not.toHaveProperty('installmentCarryMonths');
    expect(floored.extractedFromLoser, 'and a court at its floor pays nothing').toBe(0);
    const unfed = [item('iron', PAYEE_POP, null), item('weak', PAYER_POP, PAYER_MONTHS)];
    const noGranary = lastLive(driveWeeks(mintedPact(), 10, 23, unfed));
    // anchored: the same live clause, a payee with no food model, so nothing can be owed toward it.
    expect(noGranary).not.toHaveProperty('installmentCarryMonths');
    expect(noGranary.extractedFromLoser).toBe(0);
  });

  test('B5 the installment door itself: a sub-tenth week carries, the week it crosses moves one tenth and carries the rest', () => {
    const payer = FED[1].settlement;
    const payee = FED[0].settlement;
    const first = drawStreamInstallment({ payer, payee, takeFraction: 0.01 });
    expect(first.draw, '0.045 months owed: nothing moves yet').toBeNull();
    expect(first.carriedMonths).toBeCloseTo(0.045, 10);
    const second = drawStreamInstallment({ carriedMonths: first.carriedMonths, payer, payee, takeFraction: 0.01 });
    expect(second.draw).toBeNull();
    expect(second.carriedMonths).toBeCloseTo(0.09, 10);
    const third = drawStreamInstallment({ carriedMonths: second.carriedMonths, payer, payee, takeFraction: 0.01 });
    expect(third.draw?.lostMonths, '0.135 owed: one tenth moves').toBe(0.1);
    expect(third.carriedMonths, 'and the rest is still owed').toBeCloseTo(0.035, 10);
    // No installment due this tick (a court at zero capacity): nothing moves and the owed months stay.
    expect(drawStreamInstallment({ carriedMonths: 0.09, payer, payee, takeFraction: 0 })).toEqual({ draw: null, carriedMonths: 0.09 });
  });

  test('B7 between two courts of a size the owed months wait for a lot the obligee can receive; a metropolis still takes the trickle', () => {
    const even = [item('iron', PAYER_POP, PAYEE_MONTHS), item('weak', PAYER_POP, PAYER_MONTHS)];
    const payer = even[1].settlement;
    const payee = even[0].settlement;
    // A tenth-month between equals credits 0.06 of a month, which floors to nothing: the lot waits.
    const tenth = drawStreamInstallment({ carriedMonths: 0.06, payer, payee, takeFraction: 0.01 });
    expect(tenth.draw, 'a lot that would spoil whole on the road is not sent').toBeNull();
    expect(tenth.carriedMonths).toBeCloseTo(0.105, 10);
    const lot = drawStreamInstallment({ carriedMonths: 0.16, payer, payee, takeFraction: 0.01 });
    expect(lot.draw, 'two tenths reach the obligee as one').toEqual({ lostMonths: 0.2, gainedMonths: 0.1 });
    expect(lot.carriedMonths).toBeCloseTo(0.005, 10);
    const season = lastLive(driveWeeks(mintedPact(), 10, 23, even));
    expect(season.deliveredToVictor, 'so an even pact\'s obligee receives grain within the season').toBeGreaterThan(0);
    expect(season.deliveredToVictor * PAYER_POP, 'conserved').toBeLessThanOrEqual(season.extractedFromLoser * PAYER_POP + 1e-9);
    // The road's honest physics is kept: a village's tenth reaches a metropolis as nothing, and it is
    // still sent, because no lot the village could ever pay would reach that granary.
    const metro = [item('iron', 60000, PAYEE_MONTHS), item('weak', 280, PAYER_MONTHS)];
    const trickle = drawStreamInstallment({ carriedMonths: 0.06, payer: metro[1].settlement, payee: metro[0].settlement, takeFraction: 0.01 });
    expect(trickle.draw).toEqual({ lostMonths: 0.1, gainedMonths: 0 });
  });

  test('B6 the shared primitive and every non-treaty caller are untouched', () => {
    const request = { conqueredStorageMonths: SPAREABLE, conqueredPopulation: PAYER_POP, victorStorageMonths: 1, victorPopulation: PAYEE_POP, victorCapMonths: 8, takeFraction: 0.01, captureFraction: 0.6 };
    expect(computeSackFoodTransfer(request), 'the sink still floors a sub-tenth request to nothing').toBeNull();
    expect(computeTreatyGrainDraw({ payer: FED[1].settlement, payee: FED[0].settlement, takeFraction: 0.01 }),
      'and the coalition settlement door, which shares computeTreatyGrainDraw, still reads it the same').toBeNull();
    // THE CENSUS: the carrying door has exactly one caller, the treaty stream in PASS 2.
    const callers = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.(js|jsx|mjs)$/.test(name) && /drawStreamInstallment\(/.test(readFileSync(path, 'utf8'))) callers.push(path.slice(ROOT.length + 1));
      }
    };
    walk(join(ROOT, 'src'));
    expect(callers.sort()).toEqual(['src/domain/worldPulse/peaceTerms.js', 'src/domain/worldPulse/treatyTransfer.js']);
    for (const file of ['foodStockpile.js', 'generosityKernel.js', 'warHomeCosts.js', 'warDeployment.js', 'warCoalitionSettlement.js']) {
      // anchored: each file is read whole and is non-empty, so the absence is of the name and not of the source.
      expect(readFileSync(join(ROOT, 'src/domain/worldPulse', file), 'utf8')).not.toMatch(/drawStreamInstallment|installmentCarryMonths/);
    }
  });
});
