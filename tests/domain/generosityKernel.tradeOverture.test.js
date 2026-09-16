/**
 * generosityKernel.tradeOverture.test.js — E1d: the TRADE_OVERTURE instrument goes live
 * (§9 TRADE / design A4).
 *
 * The per-pair GIVE-STREAM warms a corridor: a dwell-bounded tradeOverture sub-ledger (the
 * merchantAppetite idiom, drop-when-cold ⇒ byte-neutral) rises on each gift the pair exchanges.
 * When warmth crosses the open threshold WITH dwell, the giver opens a trade overture ONCE: a
 * byte-neutral trust-nudge into the pair's relationship-state so the EXISTING
 * neutral_to_trade_partner rule can promote the label — NEVER an autonomous edge. Initiation
 * routes through authorityFor: it auto-applies under routine (the default) and is WITHHELD
 * under dm_only. Pins cover accumulation, the gated initiation, and DORMANCY.
 */
import { describe, it, expect } from 'vitest';
import { advanceGenerosity } from '../../src/domain/worldPulse/generosityKernel.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';
const deity = (ref, align, law) => ({ _deityRef: ref, name: ref, alignmentAxis: align, lawAxis: law, rankAxis: 'major' });

/** A grain-rich, lawful-good, temple town — a willing giver (produces a GIVE). */
function giverTown() {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian', primaryDeitySnapshot: deity('gen_dawn', 'good', 'lawful') },
    institutions: [{ name: 'Temple of the Dawn', category: 'religious' }],
    economicState: { economicBase: 'agrarian', foodSecurity: { storageMonths: 8, deficitPct: 0, surplusPct: 20 } },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Stable' }, factions: [{ faction: 'Gentry', category: 'noble', power: 60 }] },
  };
}
/** A famine town — the needy receiver. */
function needyTown() {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian', primaryDeitySnapshot: deity('gen_dawn', 'good', 'lawful') },
    institutions: [],
    economicState: { economicBase: 'agrarian', foodSecurity: { storageMonths: 0.3, deficitPct: 60, surplusPct: 0 } },
    powerStructure: { publicLegitimacy: { score: 40, label: 'Contested' }, factions: [{ faction: 'Gentry', category: 'noble', power: 60 }] },
  };
}

const EDGE = { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' };

/**
 * Drive one advance where a (grain-rich) gives to needy b.
 * @param {{ lit: boolean, tick?: number, seed?: string, priorOverture?: Record<string, unknown>, autonomy?: string }} o
 */
function drive({ lit, tick = 8, seed = 'overture', priorOverture, autonomy }) {
  const giver = giverTown();
  const needy = needyTown();
  const snapshot = { settlements: [{ id: 'a', name: 'Ashford', settlement: giver }, { id: 'b', name: 'Briarwatch', settlement: needy }] };
  const settlementUpdates = [{ saveId: 'a', settlement: giver }, { saveId: 'b', settlement: needy }];
  const rules = lit ? { constructiveFlowsEnabled: true, warLayerEnabled: false } : { warLayerEnabled: false };
  if (autonomy) rules.politicalAutonomy = autonomy;
  const worldState = {
    simulationRules: rules,
    calendar: { elapsedWeeks: 30 },
    relationshipStates: { 'edge.a.b': { trust: 0.75, pactStrength: 0.6, recentIncidents: [] } },
    stressors: [{ id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 3 }],
    ...(priorOverture ? { spatialLedgers: { tradeOverture: priorOverture } } : {}),
  };
  const pIndex = { get: (id) => ({ score: id === 'b' ? 0.9 : 0 }) };
  const graph = { edges: [EDGE] };
  return advanceGenerosity({ snapshot, worldState, settlementUpdates, pIndex, graph, rng: createPRNG(seed), tick, now: NOW });
}

/** Iterate seeds until an a→b GIVE fires (the ask firing is seeded). */
function firstGive(opts) {
  const gives = new Set(['give_full', 'give_partial', 'give_as_credit']);
  for (let s = 0; s < 60; s++) {
    const r = drive({ ...opts, seed: `${opts.seed || 'g'}-${s}` });
    if (r.receipts.some((x) => x.giverId === 'a' && x.receiverId === 'b' && gives.has(x.verdict))) return r;
  }
  return null;
}

describe('TRADE OVERTURE — the give-stream warms a corridor (design §4 / A4)', () => {
  it('LIT: a gift accumulates give-stream warmth in the drop-when-cold tradeOverture ledger', () => {
    const r = firstGive({ lit: true, seed: 'accum' });
    expect(r, 'an a→b gift fired (non-vacuous)').toBeTruthy();
    const led = getSpatialLedger(r.worldState, 'tradeOverture') || {};
    expect(led['a:b'], 'a give-stream warmth record a→b was written').toBeTruthy();
    expect(led['a:b'].warmth, 'a single gift is below the open threshold ⇒ warm but not yet an overture').toBeGreaterThan(0);
    expect(led['a:b'].initiated, 'one gift does not open an overture (below threshold/dwell)').not.toBe(true);
  });

  it('LIT: a WARM, dwelled corridor OPENS an overture — trust-nudge + trade_warmth + a beat (auto under routine)', () => {
    // Inject a nearly-open, long-dwelled prior warmth; one more gift crosses the threshold.
    const prior = { 'a:b': { warmth: 0.7, sinceTick: 0, lastTick: 6 } };
    const r = firstGive({ lit: true, tick: 8, seed: 'open', priorOverture: prior });
    expect(r, 'an a→b gift fired').toBeTruthy();
    const led = getSpatialLedger(r.worldState, 'tradeOverture') || {};
    expect(led['a:b'].initiated, 'the overture opened (initiated latch set)').toBe(true);
    expect(led['a:b'].warmth).toBeGreaterThanOrEqual(0.7);
    // The byte-neutral trust-nudge landed on the relationship-state (feeds neutral_to_trade_partner).
    const rel = r.worldState.relationshipStates['edge.a.b'];
    expect(rel.trust, 'trust nudged upward by the overture').toBeGreaterThan(0.75);
    const incs = (rel.recentIncidents || []).map((i) => i.type);
    expect(incs, 'a trade_warmth incident was banked on the overture').toContain('trade_warmth');
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_trade_overture'), 'an overture beat reached the Chronicle').toBe(true);
  });

  it('authorityFor gating: under dm_only the trust-nudge is WITHHELD (warmth accrues; no overture)', () => {
    const prior = { 'a:b': { warmth: 0.7, sinceTick: 0, lastTick: 6 } };
    const r = firstGive({ lit: true, tick: 8, seed: 'dmonly', priorOverture: prior, autonomy: 'dm_only' });
    expect(r, 'an a→b gift fired').toBeTruthy();
    const led = getSpatialLedger(r.worldState, 'tradeOverture') || {};
    // The warmth still accumulates (the corridor is real), but the overture did NOT open.
    expect(led['a:b'], 'the warmth ledger still updated').toBeTruthy();
    expect(led['a:b'].initiated, 'no autonomous overture under dm_only (the DM proposal flow governs)').not.toBe(true);
    const rel = r.worldState.relationshipStates['edge.a.b'];
    expect(rel.trust, 'trust NOT autonomously nudged under dm_only').toBe(0.75);
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_trade_overture'), 'no overture beat under dm_only').toBe(false);
  });

  it('DORMANCY: the gate absent ⇒ NO tradeOverture ledger (byte-identical)', () => {
    const r = drive({ lit: false, tick: 8, seed: 'dormant' });
    expect(getSpatialLedger(r.worldState, 'tradeOverture'), 'no trade-overture ledger when dormant').toBeFalsy();
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_trade_overture')).toBe(false);
  });
});
