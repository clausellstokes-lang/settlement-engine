/**
 * generosityKernel.purchase.test.js — E1d: the PURCHASE instrument goes live (design §4 / A2).
 *
 * The MARKET TWIN, wired as the post-REFUSE BONDED FALL-THROUGH ("you won't give? I'll pay").
 * A deterministic REFUSE is forced by INJECTING a refusing willingness latch whose dwell has
 * not elapsed (so the pair stays refusing regardless of the favourable give-math); the needy,
 * SOLVENT buyer then BUYS the grain the seller would not give. The pins cover the conserved
 * grain leg, the prosperity BAND-STEP payment (buyer debit + bounded seller nudge), the typed
 * trade_warmth incident, the beat — and the constitutional core: the §9 smuggle premium is
 * untouched when the buyer is too poor to pay (no food moves), and DORMANCY (gate absent ⇒ no
 * purchase, byte-identical).
 */
import { describe, it, expect } from 'vitest';
import { advanceGenerosity } from '../../src/domain/worldPulse/generosityKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

/** A minimal agrarian town with a readable prosperity band (cap ~2.0 months; no granary). */
function town({ storageMonths, prosperity }) {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian' },
    institutions: [],
    economicState: {
      economicBase: 'agrarian',
      prosperity,
      foodSecurity: { storageMonths, deficitPct: storageMonths < 1 ? 60 : 0, surplusPct: 0 },
    },
    powerStructure: { publicLegitimacy: { score: 50, label: 'Stable' }, factions: [{ faction: 'Gentry', category: 'noble', power: 60 }] },
  };
}

const EDGE = { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' };

/**
 * Drive one advance. Seller 'a' (grain-rich) is ALLIED to needy buyer 'b'. A refusing
 * willingness latch (dwell not met) forces a→b to REFUSE; the buyer's prosperity + the seller's
 * spareable then decide the purchase fall-through.
 * @param {{ lit: boolean, buyerProsperity?: string, sellerProsperity?: string, sellerStorageMonths?: number, tick?: number, seed?: string, forceRefuse?: boolean }} o
 */
function drive({ lit, buyerProsperity = 'Prosperous', sellerProsperity = 'Moderate', sellerStorageMonths = 8, tick = 5, seed = 'purchase', forceRefuse = true }) {
  const seller = town({ storageMonths: sellerStorageMonths, prosperity: sellerProsperity });   // a = seller
  const buyer = town({ storageMonths: 0.3, prosperity: buyerProsperity });   // b = needy buyer
  const snapshot = {
    settlements: [{ id: 'a', name: 'Ashford', settlement: seller }, { id: 'b', name: 'Briarwatch', settlement: buyer }],
  };
  const settlementUpdates = [{ saveId: 'a', settlement: seller }, { saveId: 'b', settlement: buyer }];
  const worldState = {
    simulationRules: lit ? { constructiveFlowsEnabled: true, warLayerEnabled: false } : { warLayerEnabled: false },
    calendar: { elapsedWeeks: 30 },
    relationshipStates: { 'edge.a.b': { trust: 0.75, pactStrength: 0.6, recentIncidents: [] } },
    stressors: [{ id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 3 }],
    // Force a→b REFUSE: a refusing latch whose dwell (>=4) has NOT elapsed at `tick`.
    ...(forceRefuse ? { spatialLedgers: { generosityWillingness: { 'a:b:grain_relief': { phase: 'refusing', sinceTick: tick - 1, lastTick: tick - 1 } } } } : {}),
  };
  // b is needy (candidate receiver + high desperation); a is comfortable (not a candidate receiver).
  const pIndex = { get: (id) => ({ score: id === 'b' ? 0.9 : 0 }) };
  const graph = { edges: [EDGE] };
  return advanceGenerosity({ snapshot, worldState, settlementUpdates, pIndex, graph, rng: createPRNG(seed), tick, now: NOW });
}

/** Iterate seeds until an a→b PURCHASE fires (the ask firing is seeded). */
function firstPurchase(opts) {
  for (let s = 0; s < 60; s++) {
    const r = drive({ ...opts, seed: `${opts.seed || 'p'}-${s}` });
    if (r.receipts.some((x) => x.giverId === 'a' && x.receiverId === 'b' && x.verdict === 'purchase')) return r;
  }
  return null;
}

describe('PURCHASE — the market twin goes live (design §4 / A2)', () => {
  it('LIT: a refused gift becomes a SALE — grain moves conserved, the buyer pays a prosperity band', () => {
    const r = firstPurchase({ lit: true, seed: 'buy' });
    expect(r, 'an a→b purchase fired (non-vacuous)').toBeTruthy();
    expect(r.changed).toBe(true);
    // The grain leg MOVED (seller a drew down, buyer b filled) — conserved through the pure sink.
    const a = r.settlementUpdates.find((u) => u.saveId === 'a');
    const b = r.settlementUpdates.find((u) => u.saveId === 'b');
    expect(b.settlement.economicState.foodSecurity.storageMonths, 'the buyer gained grain').toBeGreaterThan(0.3);
    expect(a.settlement.economicState.foodSecurity.storageMonths, 'the seller drew down its granary').toBeLessThan(8);
    // The PAYMENT: the buyer's prosperity stepped DOWN a band (Prosperous → Comfortable).
    expect(b.settlement.economicState.prosperity, 'the buyer paid a prosperity band-step').not.toBe('Prosperous');
  });

  it('LIT: the sale banks a trade_warmth incident + a purchase beat, and NO obligation (debt-free)', () => {
    const r = firstPurchase({ lit: true, seed: 'warmth' });
    expect(r).toBeTruthy();
    const incs = (r.worldState.relationshipStates['edge.a.b'].recentIncidents || []).map((i) => i.type);
    expect(incs, 'a trade_warmth incident was banked').toContain('trade_warmth');
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_purchase'), 'a purchase beat reached the Chronicle').toBe(true);
    // A sale is debt-free: no obligation minted from the purchase.
    const obl = r.worldState.spatialLedgers?.obligations || {};
    expect(Object.keys(obl).length, 'a sale mints no obligation').toBe(0);
  });

  it('§9 smuggle premium: a buyer too POOR to pay moves NO food (the shortage persists for M7)', () => {
    // A subsistence buyer (below the afford floor) cannot pay ⇒ REFUSE stands, no food moves.
    let refusedRun = null;
    for (let s = 0; s < 60 && !refusedRun; s++) {
      const r = drive({ lit: true, buyerProsperity: 'Subsistence', tick: 5, seed: `poor-${s}` });
      if (r.receipts.some((x) => x.giverId === 'a' && x.receiverId === 'b' && x.verdict === 'refuse')) refusedRun = r;
    }
    expect(refusedRun, 'a fired-and-refused a→b tick was produced (non-vacuous)').toBeTruthy();
    // No purchase fired for a subsistence buyer.
    expect(refusedRun.receipts.some((x) => x.giverId === 'a' && x.receiverId === 'b' && x.verdict === 'purchase')).toBe(false);
    const b = refusedRun.settlementUpdates.find((u) => u.saveId === 'b');
    expect(b.settlement.economicState.foodSecurity.storageMonths, 'a poor buyer buys nothing ⇒ the shortage/premium persists').toBe(0.3);
  });

  it('a seller a SLIVER above the reserve floor moves ZERO grain ⇒ NO sale (no coin for nothing; the grudge stands)', () => {
    // storageMonths 1.05 (reserve floor ~1): the buy gate clears on the NORMALISED above-floor
    // headroom, but the conserved grain sink FLOORS to the tenth-month ⇒ 0 grain. This must be a
    // NO-SALE (no prosperity debit, no "buys grain" beat, no trade_warmth) — the refusal grudge stands.
    let refusedRun = null;
    for (let s = 0; s < 80 && !refusedRun; s++) {
      const r = drive({ lit: true, sellerStorageMonths: 1.05, tick: 5, seed: `sliver-${s}` });
      if (r.receipts.some((x) => x.giverId === 'a' && x.receiverId === 'b' && x.verdict === 'refuse')) refusedRun = r;
    }
    expect(refusedRun, 'a fired-and-refused (no-sale) tick was produced (non-vacuous)').toBeTruthy();
    // NO purchase completed: no purchase receipt, no purchase beat, no trade_warmth incident.
    expect(refusedRun.receipts.some((x) => x.verdict === 'purchase')).toBe(false);
    expect(refusedRun.newsEntries.some((e) => e.impactKind === 'generosity_purchase')).toBe(false);
    const incs = (refusedRun.worldState.relationshipStates['edge.a.b'].recentIncidents || []).map((i) => i.type);
    expect(incs, 'no trade_warmth for a zero-grain non-sale').not.toContain('trade_warmth');
    // The buyer paid NOTHING (prosperity unchanged) and got no grain; the refusal grudge is banked.
    const b = refusedRun.settlementUpdates.find((u) => u.saveId === 'b');
    expect(b.settlement.economicState.prosperity, 'the buyer paid no prosperity band for a non-sale').toBe('Prosperous');
    expect(b.settlement.economicState.foodSecurity.storageMonths, 'no grain moved').toBe(0.3);
    expect(incs, 'the refusal grudge stands (not swallowed by a phantom sale)').toContain('relief_refused');
  });

  it('DORMANCY: the gate absent ⇒ NO purchase, no prosperity change (byte-identical)', () => {
    const r = drive({ lit: false, tick: 5, seed: 'dormant' });
    expect(r.changed).toBe(false);
    const b = r.settlementUpdates.find((u) => u.saveId === 'b');
    expect(b.settlement.economicState.prosperity).toBe('Prosperous');
    expect(b.settlement.economicState.foodSecurity.storageMonths).toBe(0.3);
    expect(r.receipts.length).toBe(0);
  });
});
