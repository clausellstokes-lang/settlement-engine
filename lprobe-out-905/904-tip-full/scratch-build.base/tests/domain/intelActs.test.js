/**
 * intelActs.test.js — THE INTEL SELL/GIFT LANE lit walkthrough (deep-couplings D-3).
 *
 * The deterministic mover-level anti-vacuity for the dark intelTradeEnabled lane (the
 * campaign-level dormancy proof lives in tests/property/intelTradeDormancyGolden.test.js):
 *   • GIFT: a bonded ally is GIFTED a fresh belief — generosity deposits the transfer + mints
 *     a 'warning' obligation of gratitude (the receiver owes the giver); statecraft INJECTS
 *     the belief into the receiver's map next tick (the receiver's belief UPDATES) + chronicles.
 *   • SALE: a trade-partner BUYS the belief — a reverse 'intel_sale' consideration is minted.
 *   • ANTI-HUM (design §1 law 4): no fresh trigger ⇒ zero deposits; dark flag ⇒ byte-identical.
 */
import { describe, it, expect } from 'vitest';
import { advanceGenerosity } from '../../src/domain/worldPulse/generosityKernel.js';
import { advanceInformationStatecraft } from '../../src/domain/worldPulse/informationStatecraft.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { enumerateIntelOpportunities, intelEligible, intelInjectionBelief } from '../../src/domain/spatial/intelActs.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICK = 60;

/** A comfortable town (full granary ⇒ the famine/relief lane never fires; only intel acts). */
function town() {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian' },
    institutions: [],
    economicState: { economicBase: 'agrarian', prosperity: 'Prosperous', foodSecurity: { storageMonths: 8, deficitPct: 0, surplusPct: 20 } },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Stable' }, factions: [{ faction: 'Gentry', category: 'noble', power: 60 }] },
  };
}

/** Seller 'sell' holds a FRESH, confident belief about subject 'subj'; the receiver holds none. */
function beliefMapWith(freshTick) {
  return { sell: { seat: { subj: { readiness: 0.5, strengthBand: 3, allianceLabel: 'neutral', faithLabel: null, confidence01: 0.8, lastUpdateTick: freshTick } } } };
}

/**
 * Drive one generosity tick with the intel lane lit (unless dark), for a GIFT (bonded sell→recv)
 * or a SALE (trade-channel sell→recv). recv holds a bond to subj (its "stakes").
 * @param {{ mode: 'gift'|'sale', seed: string, freshTick?: number, intelLit?: boolean, tick?: number }} o
 */
function driveGen({ mode, seed, freshTick = TICK, intelLit = true, tick = TICK }) {
  const settlements = [
    { id: 'sell', name: 'Sellford', settlement: town() },
    { id: 'recv', name: 'Recvton', settlement: town() },
    { id: 'subj', name: 'Subjhold', settlement: town() },
  ];
  const snapshot = { settlements };
  const settlementUpdates = settlements.map((s) => ({ saveId: s.id, settlement: s.settlement }));
  // recv→subj is always a bond (recv's stakes). sell→recv is a bond (gift) or a trade channel (sale).
  const edges = [{ id: 'edge.recv.subj', from: 'recv', to: 'subj', relationshipType: 'allied' }];
  const channels = [];
  if (mode === 'gift') edges.push({ id: 'edge.sell.recv', from: 'sell', to: 'recv', relationshipType: 'allied' });
  else channels.push({ id: 'chan.sell.recv', from: 'sell', to: 'recv', status: 'confirmed', type: 'trade_route' });
  const graph = { edges, channels };
  /** @type {Record<string, unknown>} */
  const rules = { warLayerEnabled: false, constructiveFlowsEnabled: true, infoStatecraftEnabled: true, infoMode: 'perfect_delayed' };
  if (intelLit) rules.intelTradeEnabled = true;
  const worldState = {
    simulationRules: rules,
    spatialCanonVersion: 1,
    rngSeed: seed,
    tick,
    calendar: { elapsedWeeks: 30 },
    relationshipStates: {
      'edge.recv.subj': { trust: 0.8, pactStrength: 0.7, recentIncidents: [] },
      'edge.sell.recv': { trust: 0.8, pactStrength: 0.7, recentIncidents: [] },
    },
    stressors: [],
    spatialLedgers: { beliefMaps: beliefMapWith(freshTick) },
  };
  const pIndex = { get: () => ({ score: 0 }) };
  return advanceGenerosity({ snapshot, worldState, settlementUpdates, pIndex, graph, rng: createPRNG(seed), tick, now: NOW });
}

/** Iterate seeds until the cadence eligibility draw fires (a deposit lands). */
function fireDeposit(mode) {
  for (let s = 0; s < 80; s++) {
    const r = driveGen({ mode, seed: `intel-${mode}-${s}` });
    const transfers = getSpatialLedger(r.worldState, 'intelTransfers');
    if (transfers && Object.keys(transfers).length) return { r, seed: `intel-${mode}-${s}` };
  }
  return null;
}

describe('intel lane — enumeration (pure, bounded, trigger-gated)', () => {
  it('finds a GIFT opportunity when a bonded ally holds a fresh belief the receiver lacks', () => {
    const beliefMaps = beliefMapWith(TICK);
    const edges = [
      { id: 'edge.sell.recv', from: 'sell', to: 'recv', relationshipType: 'allied' },
      { id: 'edge.recv.subj', from: 'recv', to: 'subj', relationshipType: 'allied' },
    ];
    const relStates = {
      'edge.sell.recv': { trust: 0.8, pactStrength: 0.7 },
      'edge.recv.subj': { trust: 0.8, pactStrength: 0.7 },
    };
    const opps = enumerateIntelOpportunities({ beliefMaps, edges, graph: { edges, channels: [] }, relStates, obligationLedger: null, atWar: () => false, tick: TICK });
    expect(opps.length).toBe(1);
    expect(opps[0]).toMatchObject({ sellerId: 'sell', receiverId: 'recv', subjectId: 'subj', mode: 'gift' });
    expect(opps[0].fidelity01).toBeCloseTo(0.8, 5);
  });

  it('emits NOTHING when the belief is stale (no fresh trigger ⇒ no whisper-war hum)', () => {
    const beliefMaps = beliefMapWith(TICK - 20); // outside FRESH_WINDOW
    const edges = [
      { id: 'edge.sell.recv', from: 'sell', to: 'recv', relationshipType: 'allied' },
      { id: 'edge.recv.subj', from: 'recv', to: 'subj', relationshipType: 'allied' },
    ];
    const relStates = { 'edge.sell.recv': { trust: 0.8, pactStrength: 0.7 }, 'edge.recv.subj': { trust: 0.8, pactStrength: 0.7 } };
    const opps = enumerateIntelOpportunities({ beliefMaps, edges, graph: { edges, channels: [] }, relStates, obligationLedger: null, atWar: () => false, tick: TICK });
    expect(opps).toEqual([]);
  });

  it('the yearly eligibility draw is TICK-INVARIANT (collapsed catch-up cannot shift who trades)', () => {
    // The draw keys on (seed, canonical pair, year) — never the tick — so it is stable.
    const a = intelEligible('seed-x', 'sell', 'recv', 3, 0.3);
    const b = intelEligible('seed-x', 'recv', 'sell', 3, 0.3); // orientation-independent
    expect(a).toBe(b);
  });
});

describe('intel lane — the GIFT (generosity deposits + obligation; statecraft injects belief)', () => {
  it('deposits the transfer + mints a "warning" obligation, then the receiver BELIEF UPDATES on consume', () => {
    const fired = fireDeposit('gift');
    expect(fired, 'a gift cadence fired within the seed sweep (non-vacuous)').toBeTruthy();
    const { r } = fired;

    // DEPOSIT: a pending intel transfer lands in the generosity-owned ledger.
    const transfers = getSpatialLedger(r.worldState, 'intelTransfers');
    const rec = Object.values(transfers)[0];
    expect(rec).toMatchObject({ sellerId: 'sell', receiverId: 'recv', subjectId: 'subj', mode: 'gift', depositTick: TICK });

    // FAVOR ECONOMY: the receiver owes the giver a 'warning' obligation of gratitude.
    const obligations = getSpatialLedger(r.worldState, 'obligations') || {};
    const owed = Object.values(obligations).find((o) => o.from === 'recv' && o.to === 'sell' && o.kind === 'warning');
    expect(owed, 'a warning obligation (recv owes sell) was minted').toBeTruthy();

    // A per-pair cooldown was recorded (the anti-hum gate).
    expect(Object.keys(getSpatialLedger(r.worldState, 'intelCooldown') || {}).length).toBeGreaterThan(0);

    // CONSUME (next tick): statecraft injects the belief into the receiver's map + chronicles.
    const consumeState = { ...r.worldState, tick: TICK + 1 };
    const info = advanceInformationStatecraft({
      snapshot: { byId: new Map(), settlements: [] },
      worldState: consumeState, graph: { edges: [] }, rng: createPRNG('consume'),
      tick: TICK + 1, now: NOW,
      strengthOf: () => 0.5, alignmentOf: () => ({ malice01: 0.4, lawfulness01: 0.6 }), nameFor: (id) => String(id),
    });
    const injected = (getSpatialLedger(info.worldState, 'beliefMaps') || {})?.recv?.seat?.subj;
    expect(injected, 'the receiver now holds a belief about the subject (it UPDATED)').toBeTruthy();
    // The receiver inherits the seller's certainty scaled by fidelity (0.8 * 0.8 = 0.64).
    expect(injected.confidence01).toBeCloseTo(0.64, 2);
    expect(injected.strengthBand).toBe(3);
    // The landing reached the Chronicle.
    const beat = info.newsEntries.find((n) => n.kind === 'intel_transfer');
    expect(beat, 'an intel_transfer news beat fired at the receiver').toBeTruthy();
    expect(beat.settlementIds).toEqual(['sell', 'recv', 'subj']);
  });
});

describe('intel lane — the SALE (a trade-partner buys the belief for a consideration)', () => {
  it('mints a reverse "intel_sale" obligation (buyer indebted) + deposits the transfer', () => {
    const fired = fireDeposit('sale');
    expect(fired, 'a sale cadence fired within the seed sweep (non-vacuous)').toBeTruthy();
    const { r } = fired;
    const transfers = getSpatialLedger(r.worldState, 'intelTransfers');
    expect(Object.values(transfers)[0]).toMatchObject({ mode: 'sale', sellerId: 'sell', receiverId: 'recv' });
    // The consideration: with no prior debt, the buyer (recv) becomes indebted to the seller.
    const obligations = getSpatialLedger(r.worldState, 'obligations') || {};
    const owed = Object.values(obligations).find((o) => o.from === 'recv' && o.to === 'sell' && o.kind === 'intel_sale');
    expect(owed, 'an intel_sale obligation (buyer owes seller) was minted').toBeTruthy();
  });
});

describe('intel lane — dormancy (dark ⇒ byte-identical, no keys)', () => {
  it('the flag ABSENT deposits nothing, even with a fresh-belief trigger and eligible seeds', () => {
    for (let s = 0; s < 20; s++) {
      const r = driveGen({ mode: 'gift', seed: `dark-${s}`, intelLit: false });
      expect(getSpatialLedger(r.worldState, 'intelTransfers'), 'no intelTransfers ledger when dark').toBeFalsy();
      expect(getSpatialLedger(r.worldState, 'intelCooldown'), 'no intelCooldown ledger when dark').toBeFalsy();
    }
  });

  it('injectionBelief scales the seller certainty by fidelity (the fog is inherited)', () => {
    const planted = intelInjectionBelief({ belief: { confidence01: 0.9, strengthBand: 2, allianceLabel: 'rival', readiness: 0.3, faithLabel: null }, fidelity01: 0.5 }, TICK);
    expect(planted.confidence01).toBeCloseTo(0.45, 5);
    expect(planted.lastUpdateTick).toBe(TICK);
  });
});
