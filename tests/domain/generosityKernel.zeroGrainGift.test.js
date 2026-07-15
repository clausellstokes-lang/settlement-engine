/**
 * generosityKernel.zeroGrainGift.test.js — E1a's ZERO-GRAIN-GIFT sibling of the E1d
 * zero-grain-SALE bug (flagged by the E1d adversarial verifier for the FP-G3+verbs wave).
 *
 * A willing giver a SLIVER above the reserve floor DECIDES to give (the strategic override
 * — a shared besieger makes relief "defense spending" — flips the thin-margin refuse to a
 * GIVE_PARTIAL), but the conserved grain sink FLOORS the transfer to the tenth-month ⇒ ZERO
 * grain actually moves (computeSackFoodTransfer returns null). The bug: the kernel still
 * minted the obligation, the widow's-mite gratitude, the succor beat, and the moral-hazard
 * decay for a gift that moved nothing — "aid" that changed history without any aid. The fix
 * (mirroring the purchase fall-through's `sold` gate) reacts ONLY when grain actually moves.
 *
 * The pins: (1) LIT + sliver-above-floor ⇒ a give fires but zero grain moves ⇒ NO obligation,
 * NO relief_given/received incident, NO succor beat, food unchanged, receipt magnitude 0;
 * (2) CONTROL — a comfortable giver moves REAL grain ⇒ the reactions DO fire (non-vacuity);
 * (3) DORMANCY — gate absent ⇒ no give, byte-identical.
 */
import { describe, it, expect } from 'vitest';
import { advanceGenerosity } from '../../src/domain/worldPulse/generosityKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

/** A minimal agrarian town (cap ~2.0 months; no granary — reserve floor ~1 month). */
function town({ storageMonths }) {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian' },
    institutions: [],
    economicState: {
      economicBase: 'agrarian',
      prosperity: 'Moderate',
      foodSecurity: { storageMonths, deficitPct: storageMonths < 1 ? 60 : 0, surplusPct: 0 },
    },
    powerStructure: { publicLegitimacy: { score: 50, label: 'Stable' }, factions: [{ faction: 'Gentry', category: 'noble', power: 60 }] },
  };
}

const EDGE = { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' };

/**
 * Drive one advance. Giver 'a' (allied) is asked to relieve needy 'b'. A shared besieger
 * 'raiders' holds a war_front INTO BOTH a and b, so the war-strategic read (sharesEnemy +
 * receiverBesieged ⇒ warStrategic01 0.9 ≥ OVERRIDE_AT) RELAXES the reserve floor and flips
 * a thin-margin refuse into a GIVE_PARTIAL — the reliable "give despite a razor margin" lever.
 * @param {{ lit: boolean, giverStorageMonths?: number, tick?: number, seed?: string }} o
 */
function drive({ lit, giverStorageMonths = 1.05, tick = 5, seed = 'gift' }) {
  const giver = town({ storageMonths: giverStorageMonths });  // a = giver (sliver above the floor by default)
  const receiver = town({ storageMonths: 0.3 });              // b = needy receiver
  const snapshot = {
    settlements: [{ id: 'a', name: 'Ashford', settlement: giver }, { id: 'b', name: 'Briarwatch', settlement: receiver }],
  };
  const settlementUpdates = [{ saveId: 'a', settlement: giver }, { saveId: 'b', settlement: receiver }];
  const worldState = {
    simulationRules: lit ? { constructiveFlowsEnabled: true, warLayerEnabled: false } : { warLayerEnabled: false },
    calendar: { elapsedWeeks: 30 },
    relationshipStates: { 'edge.a.b': { trust: 0.75, pactStrength: 0.6, recentIncidents: [] } },
    stressors: [{ id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 3 }],
  };
  // b is needy (candidate receiver + high desperation); a is not food-needy (never a receiver).
  const pIndex = { get: (id) => ({ score: id === 'b' ? 0.9 : 0 }) };
  // A shared besieger 'raiders' fronts INTO both a and b (bare confirmed war_fronts ⇒ live).
  const graph = {
    edges: [EDGE],
    channels: [
      { type: 'war_front', status: 'confirmed', from: 'raiders', to: 'a' },
      { type: 'war_front', status: 'confirmed', from: 'raiders', to: 'b' },
    ],
  };
  return advanceGenerosity({ snapshot, worldState, settlementUpdates, pIndex, graph, rng: createPRNG(seed), tick, now: NOW });
}

/** Iterate seeds until an a→b GIVE fires (the ask firing is seeded). */
function firstGive(opts) {
  for (let s = 0; s < 80; s++) {
    const r = drive({ ...opts, seed: `${opts.seed || 'g'}-${s}` });
    if (r.receipts.some((x) => x.giverId === 'a' && x.receiverId === 'b' && String(x.verdict).startsWith('give'))) return r;
  }
  return null;
}

describe('ZERO-GRAIN GIFT — a willing give that moves no grain reacts to NOTHING (E1a sibling of the E1d sale fix)', () => {
  it('LIT: a sliver-above-floor giver GIVES but moves ZERO grain ⇒ no obligation, no gratitude, no succor, food unchanged', () => {
    const r = firstGive({ lit: true, giverStorageMonths: 1.05, seed: 'sliver' });
    expect(r, 'an a→b give fired (non-vacuous)').toBeTruthy();
    // The give receipt carries magnitude 0 (the ask fired; nothing material moved).
    const giveReceipt = r.receipts.find((x) => x.giverId === 'a' && x.receiverId === 'b' && String(x.verdict).startsWith('give'));
    expect(giveReceipt.magnitude, 'a zero-grain give records magnitude 0').toBe(0);
    // NO grain moved: both granaries are byte-unchanged.
    const a = r.settlementUpdates.find((u) => u.saveId === 'a');
    const b = r.settlementUpdates.find((u) => u.saveId === 'b');
    expect(a.settlement.economicState.foodSecurity.storageMonths, 'the giver drew down NOTHING').toBe(1.05);
    expect(b.settlement.economicState.foodSecurity.storageMonths, 'the receiver gained NOTHING').toBe(0.3);
    // NO obligation minted (no aid changed history).
    const obl = r.worldState.spatialLedgers?.obligations || {};
    expect(Object.keys(obl).length, 'a zero-grain give mints no obligation').toBe(0);
    // NO gratitude / relief incidents banked.
    const incs = (r.worldState.relationshipStates?.['edge.a.b']?.recentIncidents || []).map((i) => i.type);
    expect(incs, 'no relief_given for a zero-grain give').not.toContain('relief_given');
    expect(incs, 'no relief_received for a zero-grain give').not.toContain('relief_received');
    // NO succor beat reached the Chronicle.
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_relief'), 'no succor beat for a zero-grain give').toBe(false);
    // NO moral-hazard discipline decay for the receiver: the buffer step fires ONCE per give
    // keyed on grain actually moving (reliefThisTick: lostMonths > 0). A zero-grain give passes
    // reliefThisTick:false ⇒ bufferDisciplineStep recovers-and-prunes ⇒ no bufferDiscipline entry.
    // (A regression of that line back to reliefThisTick:true would decay 'b' and fail this pin.)
    const buf = r.worldState.spatialLedgers?.bufferDiscipline || {};
    expect(buf.b, 'a zero-grain give decays no moral-hazard discipline for the receiver').toBeUndefined();
  });

  it('CONTROL: a comfortable giver moves REAL grain ⇒ the obligation, gratitude, and succor DO fire (non-vacuity)', () => {
    const r = firstGive({ lit: true, giverStorageMonths: 8, seed: 'realgift' });
    expect(r, 'an a→b give fired (non-vacuous)').toBeTruthy();
    expect(r.changed).toBe(true);
    // Grain MOVED: the giver drew down its granary.
    const a = r.settlementUpdates.find((u) => u.saveId === 'a');
    expect(a.settlement.economicState.foodSecurity.storageMonths, 'the giver drew down real grain').toBeLessThan(8);
    // The obligation, the gratitude incident, and the succor beat all fire for a REAL gift.
    const obl = r.worldState.spatialLedgers?.obligations || {};
    expect(Object.keys(obl).length, 'a real gift mints an obligation').toBeGreaterThan(0);
    const incs = (r.worldState.relationshipStates?.['edge.a.b']?.recentIncidents || []).map((i) => i.type);
    expect(incs, 'a real gift banks a relief_given incident').toContain('relief_given');
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_relief'), 'a real gift reaches the Chronicle').toBe(true);
    // CONTROL for the buffer assertion above: a REAL gift DOES decay the receiver's moral-hazard
    // discipline (reliefThisTick:true) — proving the LIT "no decay" check is non-vacuous.
    const buf = r.worldState.spatialLedgers?.bufferDiscipline || {};
    expect(buf.b?.discipline, 'a real gift decays the receiver moral-hazard discipline below full').toBeLessThan(1);
  });

  it('DORMANCY: the gate absent ⇒ NO give, no food change (byte-identical)', () => {
    const r = drive({ lit: false, giverStorageMonths: 1.05, tick: 5, seed: 'dormant' });
    expect(r.changed).toBe(false);
    expect(r.receipts.length).toBe(0);
    const a = r.settlementUpdates.find((u) => u.saveId === 'a');
    const b = r.settlementUpdates.find((u) => u.saveId === 'b');
    expect(a.settlement.economicState.foodSecurity.storageMonths).toBe(1.05);
    expect(b.settlement.economicState.foodSecurity.storageMonths).toBe(0.3);
  });
});
