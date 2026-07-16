/**
 * rumorDormancy.byteIdentity.test.js — STEP 3.5 dormancy contract + the full-
 * kernel integration of the rumor network.
 *
 * THE CONSTITUTIONAL PIN: a campaign on the omniscient default (or without the
 * spatial-canon marker) must gain ZERO new keys from this wave — the whole
 * rumor layer is invisible until a DM dials infoMode on a canonized realm.
 * Driven through the REAL kernel (simulateCampaignWorldPulse) on the same
 * spatial fixture the 5.5-M golden uses, so the pin covers the wiring, not
 * just the pure module.
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
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

function save(id, name, exports, imports, patch = {}) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1600,
      config: { tradeRouteAccess: 'road', priorityEconomy: 25 },
      institutions: [],
      economicState: { primaryExports: exports, primaryImports: imports },
      powerStructure: { publicLegitimacy: { score: 34, label: 'Contested' }, factions: [], conflicts: [] },
      npcs: [{ id: `n_${id}`, name: 'Reeve', importance: 'key' }],
      activeConditions: patch.activeConditions || [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

const grainChannel = (to) => ({
  id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to,
  goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed',
});

/**
 * The 5.5-M famine fixture, parameterized on the spatial marker + infoMode.
 * infoMode === null ⇒ the VIRTUAL profile (an untouched campaign — the
 * omniscient legacy default with no profile keys persisted).
 */
function makeCampaign({ spatial, infoMode = null }) {
  return {
    id: 'sp-rumor', name: 'sp-rumor', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'sp-rumor', tick: 1,
      simulationRules: {
        propagationMode: 'first_order',
        ...(infoMode ? { infoMode } : {}),
      },
      stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 }],
      ...(spatial ? { spatialCanonVersion: 1, spatialDigest: digestForIds() } : {}),
    },
    regionalGraph: ensureRegionalGraph({ channels: [grainChannel('b'), grainChannel('c'), grainChannel('d')] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

const saves = () => [
  save('a', 'Ashford', [GRAIN], [], { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] }),
  save('b', 'Briarwatch', [], [GRAIN]),
  save('c', 'Crownhold', [], [GRAIN]),
  save('d', 'Deepmoor', [], [GRAIN]),
];

/** Drive N one-week ticks; return the final worldState. */
function driveTicks(campaign, ticks = 10) {
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

describe('STEP 3.5 dormancy — omniscient / no-marker ⇒ zero new keys', () => {
  it('ensureWorldState adds no rumor key to any save without one', () => {
    const ws = ensureWorldState({ rngSeed: 's', tick: 3 }, { id: 'c1' });
    expect('spatialLedgers' in ws).toBe(false);
    // An empty/garbage spatialLedgers namespace never materializes either.
    for (const bad of [{}, [], null, 'x']) {
      const w = ensureWorldState({ rngSeed: 's', tick: 3, spatialLedgers: bad }, { id: 'c1' });
      expect('spatialLedgers' in w).toBe(false);
    }
  });

  it('a present, non-empty ledger round-trips through the conditional clone', () => {
    const ledger = { a: { 'trade:evt1': { eventRef: 'evt1', arrivalTick: 4, hopCount: 0 } } };
    const ws = ensureWorldState({ rngSeed: 's', tick: 3, spatialLedgers: { rumorLedgers: ledger } }, { id: 'c1' });
    expect(ws.spatialLedgers.rumorLedgers).toEqual(ledger);
    expect(ws.spatialLedgers.rumorLedgers).not.toBe(ledger); // deep-cloned, never aliased
  });

  it('SPATIAL + omniscient (virtual profile): the kernel materializes NO rumor key over 10 ticks', () => {
    const ws = driveTicks(makeCampaign({ spatial: true, infoMode: null }), 10);
    expect(ws.spatialLedgers?.rumorLedgers).toBeUndefined();
  });

  it('ASPATIAL + a live infoMode: still NO rumor key (word needs roads)', () => {
    const ws = driveTicks(makeCampaign({ spatial: false, infoMode: 'perfect_delayed' }), 6);
    expect(ws.spatialLedgers?.rumorLedgers).toBeUndefined();
  });

  it('the omniscient spatial run is byte-identical to the same run under the dormancy oracle', () => {
    const one = driveTicks(makeCampaign({ spatial: true, infoMode: null }), 8);
    const two = driveTicks(makeCampaign({ spatial: true, infoMode: null }), 8);
    expect(JSON.stringify(normalizeForDormancy(one))).toBe(JSON.stringify(normalizeForDormancy(two)));
  });
});

describe('STEP 3.5 live — the kernel wires the rumor network (anti-vacuity)', () => {
  it('SPATIAL + perfect_delayed materializes rumor ledgers, deterministic across two runs', () => {
    const one = driveTicks(makeCampaign({ spatial: true, infoMode: 'perfect_delayed' }), 10);
    const oneRumors = one.spatialLedgers?.rumorLedgers;
    expect(oneRumors && typeof oneRumors).toBe('object');
    expect(Object.keys(oneRumors).length).toBeGreaterThan(0);
    // Perfect-but-Delayed two-run determinism at the WHOLE-worldState level.
    const two = driveTicks(makeCampaign({ spatial: true, infoMode: 'perfect_delayed' }), 10);
    expect(JSON.stringify(one)).toBe(JSON.stringify(two));
    // Lineage rooting holds all the way through the real kernel.
    for (const ledger of Object.values(oneRumors)) {
      for (const record of Object.values(ledger)) {
        expect(record.lineageIds[0]).toBe(record.eventRef);
        expect(record.carrier).toBe('trade');
        expect(record.corroborationRoots.length).toBeGreaterThanOrEqual(1);
        expect('createdAt' in record).toBe(false);
      }
    }
  });

  it('perfect_delayed fidelity is perfect; unreliable same-seed identical + cross-seed divergent', () => {
    const pd = driveTicks(makeCampaign({ spatial: true, infoMode: 'perfect_delayed' }), 10);
    for (const ledger of Object.values(pd.spatialLedgers.rumorLedgers)) {
      for (const record of Object.values(ledger)) {
        expect(record.completeness01).toBe(1);
        expect(record.accuracy01).toBe(1);
      }
    }
    const un1 = driveTicks(makeCampaign({ spatial: true, infoMode: 'unreliable' }), 10);
    const un2 = driveTicks(makeCampaign({ spatial: true, infoMode: 'unreliable' }), 10);
    expect(JSON.stringify(un1.spatialLedgers.rumorLedgers)).toBe(JSON.stringify(un2.spatialLedgers.rumorLedgers));
    const seeded = makeCampaign({ spatial: true, infoMode: 'unreliable' });
    seeded.worldState.rngSeed = 'sp-rumor-other';
    const un3 = driveTicks(seeded, 10);
    expect(JSON.stringify(un1.spatialLedgers.rumorLedgers)).not.toBe(JSON.stringify(un3.spatialLedgers.rumorLedgers));
  });

  it('a settlement hears a distant event LATER than the witness (latency through the kernel)', () => {
    const ws = driveTicks(makeCampaign({ spatial: true, infoMode: 'perfect_delayed' }), 10);
    let sawLag = false;
    for (const ledger of Object.values(ws.spatialLedgers.rumorLedgers)) {
      for (const record of Object.values(ledger)) {
        if (record.hopCount > 0) {
          expect(record.arrivalTick).toBeGreaterThan(record.eventTick);
          sawLag = true;
        }
      }
    }
    expect(sawLag).toBe(true); // the fixture must actually exercise a relay
  });
});
