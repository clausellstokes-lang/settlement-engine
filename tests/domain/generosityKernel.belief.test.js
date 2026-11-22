/**
 * generosityKernel.belief.test.js — E1d: THE RUMOR BELIEF-NUDGE (design §3.1 / §9 INFORMATION).
 *
 * "The deed broadcasts." A NOTABLE gift makes observers who ALREADY hold a belief about the
 * giver read them as richer (strengthBand ⇒ raiders' attention) and friendlier (allianceLabel
 * ⇒ allies' trust), routed through beliefMap.reconcileBelief. GATED on beliefsActive (spatial
 * marker + non-omniscient infoMode): an omniscient / unmarked / dormant world is byte-identical.
 * Only EXISTING belief slots are touched — no new keys minted.
 */
import { describe, it, expect } from 'vitest';
import { advanceGenerosity } from '../../src/domain/worldPulse/generosityKernel.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';
const deity = (ref, align, law) => ({ _deityRef: ref, name: ref, alignmentAxis: align, lawAxis: law, rankAxis: 'major' });

function giverTown() {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian', primaryDeitySnapshot: deity('gen_dawn', 'good', 'lawful') },
    institutions: [{ name: 'Temple of the Dawn', category: 'religious' }],
    economicState: { economicBase: 'agrarian', foodSecurity: { storageMonths: 9, deficitPct: 0, surplusPct: 25 } },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Stable' }, factions: [{ faction: 'Gentry', category: 'noble', power: 60 }] },
  };
}
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

/** Observer 'c' already holds a (neutral, low-strength) belief about giver 'a'. */
function priorBelief() {
  return { c: { seat: { a: { readiness: 0.2, strengthBand: 1, allianceLabel: 'neutral', faithLabel: null, confidence01: 0.2, lastUpdateTick: 0 } } } };
}

/** @param {{ beliefsLit: boolean, constructive?: boolean, tick?: number, seed?: string }} o */
function drive({ beliefsLit, constructive = true, tick = 4, seed = 'belief' }) {
  const giver = giverTown();
  const needy = needyTown();
  const snapshot = { settlements: [{ id: 'a', name: 'Ashford', settlement: giver }, { id: 'b', name: 'Briarwatch', settlement: needy }] };
  const settlementUpdates = [{ saveId: 'a', settlement: giver }, { saveId: 'b', settlement: needy }];
  /** @type {Record<string, unknown>} */
  const rules = { warLayerEnabled: false };
  if (constructive) rules.constructiveFlowsEnabled = true;
  // beliefsActive needs a non-omniscient infoMode + a positive spatialCanonVersion marker.
  rules.infoMode = beliefsLit ? 'perfect_delayed' : 'omniscient';
  const worldState = {
    simulationRules: rules,
    ...(beliefsLit ? { spatialCanonVersion: 1 } : {}),
    calendar: { elapsedWeeks: 30 },
    relationshipStates: { 'edge.a.b': { trust: 0.8, pactStrength: 0.7, recentIncidents: [] } },
    stressors: [{ id: 'world_stressor.famine.b', type: 'famine', severity: 0.9, affectedSettlementIds: ['b'], age: 3 }],
    spatialLedgers: { beliefMaps: priorBelief() },
  };
  const pIndex = { get: (id) => ({ score: id === 'b' ? 0.95 : 0 }) };
  const graph = { edges: [EDGE] };
  return advanceGenerosity({ snapshot, worldState, settlementUpdates, pIndex, graph, rng: createPRNG(seed), tick, now: NOW });
}

/** Iterate seeds until a notable a→b gift broadcasts (the observer's belief about a shifts). */
function firstBroadcast(opts) {
  for (let s = 0; s < 60; s++) {
    const r = drive({ ...opts, seed: `${opts.seed || 'b'}-${s}` });
    const belief = (getSpatialLedger(r.worldState, 'beliefMaps') || {})?.c?.seat?.a;
    if (belief && belief.allianceLabel === 'trade_partner') return r;
  }
  return null;
}

describe('RUMOR belief-nudge — the deed broadcasts (design §3.1 / §9)', () => {
  it('LIT (beliefs active): a notable gift raises believed WEALTH + warms believed CHARACTER of the giver', () => {
    const r = firstBroadcast({ beliefsLit: true, seed: 'nudge' });
    expect(r, 'a notable a→b gift broadcast to observer c (non-vacuous)').toBeTruthy();
    const belief = getSpatialLedger(r.worldState, 'beliefMaps').c.seat.a;
    // Believed CHARACTER warmed one rung friendlier (neutral → trade_partner).
    expect(belief.allianceLabel).toBe('trade_partner');
    // Believed WEALTH rose (strengthBand nudged up from the prior 1).
    expect(belief.strengthBand).toBeGreaterThan(1);
    // No spurious new observer/subject keys were minted (only c's existing slot moved).
    expect(Object.keys(getSpatialLedger(r.worldState, 'beliefMaps'))).toEqual(['c']);
  });

  it('DORMANCY (omniscient): beliefs inactive ⇒ the belief map is byte-identical even when constructive flows are LIT', () => {
    const r = drive({ beliefsLit: false, constructive: true, seed: 'omni' });
    const belief = getSpatialLedger(r.worldState, 'beliefMaps').c.seat.a;
    // Omniscient ⇒ beliefsActive false ⇒ NO nudge — the prior belief survives verbatim.
    expect(belief.allianceLabel).toBe('neutral');
    expect(belief.strengthBand).toBe(1);
    expect(belief.lastUpdateTick).toBe(0);
  });
});
