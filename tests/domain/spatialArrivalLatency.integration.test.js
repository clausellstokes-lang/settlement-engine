/**
 * spatialArrivalLatency.integration.test.js — Phase 5.5 MODULATION item 4, the
 * arrival-queue WIRING inside the real apply path.
 *
 * The pure park/drain module is unit-tested in spatialArrival.test.js; this pins
 * the two gated seams in applyWorldPulse:
 *   - PARK (full sim): with the marker, a shock's cross-settlement impacts are
 *     held in worldState.spatialArrivals (delayed) instead of queued instantly;
 *     without the marker they queue to the regional graph the same tick (aspatial).
 *   - DRAIN (direct): a due arrival is released into the regional queue at tick
 *     start and removed from the ledger — and NOT drained on the aspatial path.
 */
import { describe, expect, it } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

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

function makeCampaign(spatial) {
  return {
    id: 'sp', name: 'sp', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'sp-int', tick: 1,
      simulationRules: { propagationMode: 'first_order' },
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

function driveAndObserve(spatial, ticks = 6) {
  let campaign = makeCampaign(spatial);
  let s = saves();
  let sawParked = false;
  let sawQueuedWhileNoLedger = false;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves: s, interval: 'one_month', now: NOW });
    const arr = r.worldState?.spatialArrivals;
    const queued = (r.regionalGraph?.queuedImpacts || []).length;
    if (arr && Object.keys(arr).length) sawParked = true;
    if (queued > 0 && (!arr || !Object.keys(arr).length)) sawQueuedWhileNoLedger = true;
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    s = s.map((x) => (updates.has(x.id) ? { ...x, settlement: updates.get(x.id) } : x));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { sawParked, sawQueuedWhileNoLedger };
}

describe('MODULATION — arrival latency wiring', () => {
  it('PARK: the marker holds cross-settlement impacts in the arrival queue; aspatial queues instantly', () => {
    const spatial = driveAndObserve(true);
    const aspatial = driveAndObserve(false);
    // Under the marker the front materializes (impacts are in transit).
    expect(spatial.sawParked).toBe(true);
    // Aspatial NEVER materializes a spatial arrival ledger, and its impacts land
    // straight into the regional queue (the byte-identical instant path).
    expect(aspatial.sawParked).toBe(false);
    expect(aspatial.sawQueuedWhileNoLedger).toBe(true);
  });

  it('DRAIN: a due arrival is released into the regional queue at tick start (marker only)', () => {
    const digest = digestForIds();
    const dueImpact = {
      id: 'regional_impact.parked',
      conditionId: 'cond.parked',
      kind: 'import_shortage',
      sourceSettlementId: 'a',
      targetSettlementId: 'b',
      channelId: 'ch.a.b',
      channelType: 'trade_dependency',
      goods: [{ id: 'grain', label: GRAIN }],
      severity: 0.6,
      status: 'queued',
      delayTicks: 0,
      pathSettlementIds: ['a', 'b'],
      explanation: 'Grain from Ashford is delayed.',
      createdAt: NOW,
    };
    const ledger = { 'regional_impact.parked': { arrivalTick: 5, targetId: 'b', sourceId: 'a', impact: dueImpact } };
    const worldState = {
      tick: 5, rngSeed: 'sp-int', simulationRules: { propagationMode: 'first_order' },
      spatialCanonVersion: 1, spatialDigest: digest, spatialArrivals: ledger,
    };
    const snapshot = {
      worldState,
      regionalGraph: ensureRegionalGraph({ channels: [grainChannel('b')] }),
      settlements: saves().map((sv) => ({ id: sv.id, settlement: sv.settlement })),
      byId: new Map(saves().map((sv) => [sv.id, { id: sv.id, settlement: sv.settlement }])),
    };
    const result = applyWorldPulseOutcomes({
      snapshot, worldState,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: new Map(saves().map((sv) => [sv.id, { saveId: sv.id, settlement: sv.settlement }])),
      outcomes: [], tick: 5, now: NOW,
      simulationRules: worldState.simulationRules,
    });
    // The due arrival drained into the regional queue and left the ledger.
    expect(result.regionalGraph.queuedImpacts.some((i) => i.id === 'regional_impact.parked')).toBe(true);
    expect(result.worldState.spatialArrivals?.['regional_impact.parked']).toBeUndefined();

    // Aspatial control (no marker): the same pre-seeded ledger is NOT drained.
    const aspatialWs = { ...worldState };
    delete aspatialWs.spatialCanonVersion;
    delete aspatialWs.spatialDigest;
    const aspatialResult = applyWorldPulseOutcomes({
      snapshot: { ...snapshot, worldState: aspatialWs }, worldState: aspatialWs,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: new Map(saves().map((sv) => [sv.id, { saveId: sv.id, settlement: sv.settlement }])),
      outcomes: [], tick: 5, now: NOW,
      simulationRules: aspatialWs.simulationRules,
    });
    expect(aspatialResult.regionalGraph.queuedImpacts.some((i) => i.id === 'regional_impact.parked')).toBe(false);
  });
});
