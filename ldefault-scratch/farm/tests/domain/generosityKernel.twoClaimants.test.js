/**
 * generosityKernel.twoClaimants.test.js — the MOVER-level "two claimants, one granary" floor
 * pin (r2 economy-upswing-2 / DESIGN_GENEROSITY_ENGINE §2.2 pin 4).
 *
 * THE BUG (reproduce-then-clear, confirmed pre-fix): a single giver can appear in ≥2 candidate
 * asks in one tick. freshSettlement reads the PRE-tick settlement (foodDeltas apply only after
 * the decide loop), so before the fix every ask re-priced the SAME full above-floor headroom.
 * Two full GIVE verdicts to one giver therefore each drained the entire spareable, the summed
 * debits crossed the hard reserve floor (giver → 0), and when the receivers had capacity the
 * clamp minted food (total OUT > total IN). Measured pre-fix at S=2.6: aFinal=0 (floor 1.0
 * crossed) and total 3.4 > init 3.2 (0.2 months minted).
 *
 * THE FIX: a per-giver committed-headroom map nets each real debit (gift AND sale) out of the
 * next same-giver ask's spareableMonths, so cumulative same-giver debits never exceed the real
 * above-floor stock. The second full give then moves zero grain instead of overdrawing.
 *
 * THE PINS: (1) two same-tick gives from one giver ⇒ the giver never crosses the reserve floor
 * AND no food is minted (both symptoms); (2) the pure-kernel unit test only ever covered the
 * single-edge case — this exercises the mover with a genuine two-claimant tick, which is where
 * the overdraw lived.
 */
import { describe, it, expect } from 'vitest';
import { advanceGenerosity } from '../../src/domain/worldPulse/generosityKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { STOCKPILE_TUNING } from '../../src/domain/worldPulse/foodStockpile.js';

const NOW = '2026-01-01T00:00:00.000Z';
const FLOOR = Number(STOCKPILE_TUNING.reserveTitheFloorMonths) || 1;

/** A minimal agrarian town (reserve floor ~1 month). */
function town({ storageMonths }) {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian' },
    institutions: [],
    economicState: {
      economicBase: 'agrarian', prosperity: 'Moderate',
      foodSecurity: { storageMonths, deficitPct: storageMonths < 1 ? 60 : 0, surplusPct: 0 },
    },
    powerStructure: { publicLegitimacy: { score: 50, label: 'Stable' }, factions: [{ faction: 'Gentry', category: 'noble', power: 60 }] },
  };
}

/**
 * One giver 'a' (allied to BOTH needy 'b' and 'c'). A shared besieger 'raiders' fronts into all
 * three, so the war-strategic override relaxes the give-decision floor and both a→b and a→c fire
 * strong gives — the reliable two-claimant lever. (The hard reserve floor in the conserved sink
 * is NOT relaxed by the override — it is honoured per-transfer via spareableMonths; the bug was
 * purely the CUMULATIVE same-tick overdraw across the two asks.)
 */
function drive({ giverStorageMonths, seed }) {
  const giver = town({ storageMonths: giverStorageMonths });
  const b = town({ storageMonths: 0.3 });
  const c = town({ storageMonths: 0.3 });
  const snapshot = { settlements: [
    { id: 'a', name: 'Ashford', settlement: giver },
    { id: 'b', name: 'Briarwatch', settlement: b },
    { id: 'c', name: 'Cresthollow', settlement: c },
  ] };
  const settlementUpdates = [
    { saveId: 'a', settlement: giver }, { saveId: 'b', settlement: b }, { saveId: 'c', settlement: c },
  ];
  const worldState = {
    simulationRules: { constructiveFlowsEnabled: true, warLayerEnabled: false },
    calendar: { elapsedWeeks: 30 },
    relationshipStates: {
      'edge.a.b': { trust: 0.8, pactStrength: 0.7, recentIncidents: [] },
      'edge.a.c': { trust: 0.8, pactStrength: 0.7, recentIncidents: [] },
    },
    stressors: [
      { id: 'world_stressor.famine.b', type: 'famine', severity: 0.9, affectedSettlementIds: ['b'], age: 3 },
      { id: 'world_stressor.famine.c', type: 'famine', severity: 0.9, affectedSettlementIds: ['c'], age: 3 },
    ],
  };
  const pIndex = { get: (id) => ({ score: (id === 'b' || id === 'c') ? 0.9 : 0 }) };
  const graph = {
    edges: [
      { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
      { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'allied' },
    ],
    channels: [
      { type: 'war_front', status: 'confirmed', from: 'raiders', to: 'a' },
      { type: 'war_front', status: 'confirmed', from: 'raiders', to: 'b' },
      { type: 'war_front', status: 'confirmed', from: 'raiders', to: 'c' },
    ],
  };
  return advanceGenerosity({ snapshot, worldState, settlementUpdates, pIndex, graph, rng: createPRNG(seed), tick: 5, now: NOW });
}

const storageOf = (r, id) => r.settlementUpdates.find((u) => u.saveId === id).settlement.economicState.foodSecurity.storageMonths;

/** Find an advance where giver 'a' issues ≥2 GIVE verdicts in the same tick (the two-claimant tick). */
function firstDoubleAsk({ giverStorageMonths }) {
  for (let s = 0; s < 200; s++) {
    const r = drive({ giverStorageMonths, seed: `twin-${s}` });
    const gives = r.receipts.filter((x) => x.giverId === 'a' && String(x.verdict).startsWith('give'));
    if (gives.length >= 2) return { r, gives };
  }
  return null;
}

describe('generosity r2 — two claimants, one granary: the reserve floor is never crossed (economy-upswing-2)', () => {
  it('a giver relieving TWO needy neighbours in one tick keeps its hard reserve floor AND mints no food', () => {
    // S=2.6 ⇒ init total 3.2; pre-fix this exact scenario drained the giver to 0 (floor crossed)
    // and minted 0.2 months. The two-claimant tick fires reliably (~46% of seeds pre/post-fix).
    const init = 2.6;
    const found = firstDoubleAsk({ giverStorageMonths: init });
    expect(found, 'a two-claimant tick fired: giver a issued ≥2 gives (non-vacuous)').toBeTruthy();
    const { r, gives } = found;
    expect(gives.length, 'giver a issued at least two GIVE verdicts in one tick').toBeGreaterThanOrEqual(2);

    const aFinal = storageOf(r, 'a');
    // (1) THE FLOOR HELD — pre-fix this was 0; the fix keeps the giver at/above the reserve floor.
    expect(aFinal, 'the giver never overdrew below its hard reserve floor').toBeGreaterThanOrEqual(FLOOR - 1e-9);

    // (2) NO FOOD MINTED — total food OUT ≤ total food IN (pre-fix the clamp minted the overdraw).
    const initTotal = init + 0.3 + 0.3;
    const finalTotal = aFinal + storageOf(r, 'b') + storageOf(r, 'c');
    expect(finalTotal, 'no food is minted across the two same-tick gives').toBeLessThanOrEqual(initTotal + 1e-9);
  });

  it('CONTROL — a lone comfortable giver still moves real grain (the fix is a floor guard, not an off-switch)', () => {
    // A single give to one needy neighbour must still draw the granary down (non-vacuity: the
    // committed-headroom net does not suppress the first, legitimate transfer).
    let moved = false;
    for (let s = 0; s < 80 && !moved; s++) {
      const r = drive({ giverStorageMonths: 8, seed: `solo-${s}` });
      const give = r.receipts.find((x) => x.giverId === 'a' && String(x.verdict).startsWith('give') && x.magnitude > 0);
      if (give && storageOf(r, 'a') < 8) moved = true;
    }
    expect(moved, 'a comfortable giver still moves real grain on a single ask').toBe(true);
  });
});
