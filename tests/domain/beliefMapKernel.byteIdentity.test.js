/**
 * beliefMapKernel.byteIdentity.test.js — Phase 5.5 WAVE A dormancy contract +
 * the full-kernel integration of the belief map.
 *
 * THE CONSTITUTIONAL PIN (per flag): a campaign without the spatial marker, or on
 * the omniscient default, gains ZERO new keys from this wave — the belief layer
 * is invisible until a DM dials infoMode on a canonized realm. Driven through the
 * REAL kernel so the pin covers the wiring, not just the pure module. Also pins
 * cold-start-through-the-kernel (beliefs seed to ground truth) + determinism.
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['a', 'b', 'c', 'd'];
const GRAIN = 'Bulk grain and foodstuffs';

function digestForIds() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function save(id, name, exports, imports) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1600,
      config: { tradeRouteAccess: 'road', priorityEconomy: 25 },
      institutions: [],
      economicState: { primaryExports: exports, primaryImports: imports },
      powerStructure: { publicLegitimacy: { score: 34, label: 'Contested' }, factions: [], conflicts: [] },
      npcs: [{ id: `n_${id}`, name: 'Reeve', importance: 'key' }],
      activeConditions: id === 'a' ? [{ archetype: 'regional_import_shortage', severity: 0.7 }] : [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}
const grainChannel = (to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });
// A relationship neighbourhood so cold-start has edges to seed.
const relEdges = [
  { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' },
  { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
  { id: 'edge.c.d', from: 'c', to: 'd', relationshipType: 'trade_partner' },
];

function makeCampaign({ spatial, infoMode = null }) {
  return {
    id: 'sp-belief', name: 'sp-belief', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'sp-belief', tick: 1,
      relationshipStates: {
        'edge.a.b': { relationshipType: 'hostile' }, 'edge.b.c': { relationshipType: 'rival' }, 'edge.c.d': { relationshipType: 'trade_partner' },
      },
      simulationRules: { propagationMode: 'first_order', ...(infoMode ? { infoMode } : {}) },
      stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 }],
      ...(spatial ? { spatialCanonVersion: 1, spatialDigest: digestForIds() } : {}),
    },
    regionalGraph: ensureRegionalGraph({ edges: relEdges, channels: [grainChannel('b'), grainChannel('c'), grainChannel('d')] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

const saves = () => [
  save('a', 'Ashford', [GRAIN], []),
  save('b', 'Briarwatch', [], [GRAIN]),
  save('c', 'Crownhold', [], [GRAIN]),
  save('d', 'Deepmoor', [], [GRAIN]),
];

function driveTicks(campaign, ticks = 8) {
  let current = campaign;
  let s = saves();
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign: current, saves: s, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    s = s.map((x) => (updates.has(x.id) ? { ...x, settlement: updates.get(x.id) } : x));
    current = { ...current, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
  }
  return current.worldState;
}

describe('WAVE A dormancy — omniscient / no-marker ⇒ zero new belief keys', () => {
  it('ensureWorldState adds no spatialLedgers key to a save without one; garbage never materializes', () => {
    const ws = ensureWorldState({ rngSeed: 's', tick: 3 }, { id: 'c1' });
    expect('spatialLedgers' in ws).toBe(false);
    for (const bad of [{}, [], null, 'x']) {
      const w = ensureWorldState({ rngSeed: 's', tick: 3, spatialLedgers: bad }, { id: 'c1' });
      expect('spatialLedgers' in w).toBe(false);
    }
  });

  it('a present, non-empty 3-level belief ledger round-trips through the conditional clone', () => {
    const ledger = { a: { [GOVERNING_SEAT_KEY]: { b: { readiness: 0, strengthBand: 2, allianceLabel: 'hostile', faithLabel: null, confidence01: 1, lastUpdateTick: 0 } } } };
    const ws = ensureWorldState({ rngSeed: 's', tick: 3, spatialCanonVersion: 1, spatialLedgers: { beliefMaps: ledger } }, { id: 'c1' });
    expect(ws.spatialLedgers.beliefMaps).toEqual(ledger);
    expect(ws.spatialLedgers.beliefMaps).not.toBe(ledger); // deep-cloned, never aliased
    expect(ws.spatialLedgers.beliefMaps.a[GOVERNING_SEAT_KEY]).not.toBe(ledger.a[GOVERNING_SEAT_KEY]);
  });

  it('SPATIAL + omniscient (virtual profile): the kernel materializes NO belief key over 8 ticks', () => {
    const ws = driveTicks(makeCampaign({ spatial: true, infoMode: null }), 8);
    expect(ws.spatialLedgers?.beliefMaps).toBeUndefined();
  });

  it('ASPATIAL + a live infoMode: still NO belief key (beliefs need the spatial marker)', () => {
    const ws = driveTicks(makeCampaign({ spatial: false, infoMode: 'unreliable' }), 6);
    expect(ws.spatialLedgers?.beliefMaps).toBeUndefined();
  });

  it('the omniscient spatial run is byte-identical across two runs (dormancy oracle)', () => {
    const one = driveTicks(makeCampaign({ spatial: true, infoMode: null }), 6);
    const two = driveTicks(makeCampaign({ spatial: true, infoMode: null }), 6);
    expect(JSON.stringify(normalizeForDormancy(one))).toBe(JSON.stringify(normalizeForDormancy(two)));
  });
});

describe('WAVE A live — the kernel wires the belief map (anti-vacuity)', () => {
  it('SPATIAL + a live infoMode materializes belief maps (cold-start), deterministic across two runs', () => {
    const one = driveTicks(makeCampaign({ spatial: true, infoMode: 'perfect_delayed' }), 6);
    const oneBeliefs = one.spatialLedgers?.beliefMaps;
    expect(oneBeliefs && typeof oneBeliefs).toBe('object');
    expect(Object.keys(oneBeliefs).length).toBeGreaterThan(0);
    const two = driveTicks(makeCampaign({ spatial: true, infoMode: 'perfect_delayed' }), 6);
    expect(JSON.stringify(oneBeliefs)).toBe(JSON.stringify(two.spatialLedgers?.beliefMaps));
    // The faction dimension ('seat') is present from day one; beliefs are sparse
    // (only relationship-adjacent + heard-about subjects), never all-pairs.
    let entries = 0;
    for (const obs of Object.keys(oneBeliefs)) {
      expect(GOVERNING_SEAT_KEY in oneBeliefs[obs]).toBe(true);
      entries += Object.keys(oneBeliefs[obs][GOVERNING_SEAT_KEY]).length;
    }
    expect(entries).toBeGreaterThan(0);
    expect(entries).toBeLessThan(IDS.length * IDS.length); // sparse, not N^2
  });

  it('cold-start seeds beliefs at ground truth — the relationship label the observer declares', () => {
    // After ONE tick, a↔b is freshly cold-started to the hostile edge label.
    const ws = driveTicks(makeCampaign({ spatial: true, infoMode: 'perfect_delayed' }), 1);
    const ab = ws.spatialLedgers?.beliefMaps?.a?.[GOVERNING_SEAT_KEY]?.b;
    expect(ab).toBeTruthy();
    expect(ab.allianceLabel).toBe('hostile');
    expect(ab.confidence01).toBe(1);       // cold-start certainty
    expect('lastUpdateTick' in ab).toBe(true);
  });

  it('dialling infoMode BACK to omniscient PRESERVES an existing ledger (never deletes)', () => {
    const live = makeCampaign({ spatial: true, infoMode: 'perfect_delayed' });
    const afterLive = driveTicks(live, 3);
    expect(afterLive.spatialLedgers?.beliefMaps).toBeTruthy();
    // Now advance ONE omniscient tick on the built-up state.
    const dialledBack = {
      ...live,
      worldState: { ...afterLive, simulationRules: { ...afterLive.simulationRules, infoMode: 'omniscient' } },
    };
    const r = simulateCampaignWorldPulse({ campaign: dialledBack, saves: saves(), interval: 'one_week', now: NOW });
    expect(r.worldState.spatialLedgers?.beliefMaps).toBeTruthy(); // preserved, not dropped
  });
});
