/**
 * beliefAxesTransitivity.test.js — D-1b (deep-couplings): THE DEMOGRAPHIC FEEDER, end-to-end.
 *
 * The transitive chain the axes are built on (DESIGN_DEEP_COUPLINGS §5 feeder A):
 *   migration column → (D-0) migration_flight rumor → relays hop-by-hop → (D-1) a distant
 *   observer's DEMOGRAPHIC belief about the origin.
 *
 * Driven through the whole pulse kernel (simulateCampaignWorldPulse) on a 4-settlement chain
 * a—b—c—d with both flags lit. A refugee column leaves 'a' (which is actually GROWING); three
 * hops away, 'd' — with no declared tie to 'a' — comes to believe 'a' is EMPTYING purely from the
 * road-worn telling. The fog made the belief WRONG. Flag OFF ⇒ no axis field anywhere (dormancy).
 */
import { describe, expect, it } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { trendBandFromHistory } from '../../src/domain/worldPulse/beliefAxes.js';

const IDS = ['a', 'b', 'c', 'd'];
function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}
const edge = (id, from, to) => ({ id, type: 'trade_route', from, to, status: 'confirmed', relationshipType: 'neutral' });
function save(id, name, populationHistory = []) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1680, config: { tradeRouteAccess: 'road' }, institutions: [],
      economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
      npcs: [], activeConditions: [], populationHistory,
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

/** Drive the chain N ticks with the two flags set as given; return the final beliefMaps. */
function drive({ axes }) {
  let campaign = {
    id: 'axes-trans', name: 'axes-trans', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'axes-trans', tick: 1,
      simulationRules: { propagationMode: 'first_order', infoMode: 'unreliable', migrationRumorsEnabled: true, ...(axes ? { beliefAxesEnabled: true } : {}) },
      spatialCanonVersion: 1, spatialDigest: spatialDigest(),
      spatialLedgers: { migration: { 'a:b:1': { originId: 'a', destId: 'b', arrivals: 600, departTick: 1, arrivalTick: 40 } } },
    },
    regionalGraph: ensureRegionalGraph({ channels: [edge('ch.ab', 'a', 'b'), edge('ch.bc', 'b', 'c'), edge('ch.cd', 'c', 'd')] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  // 'a' is GROWING — the ground-truth trend is POSITIVE (the belief 'd' forms will be wrong).
  let saves = [
    save('a', 'Ashford', [{ tick: 0, delta: 80, population: 1600 }, { tick: 1, delta: 80, population: 1680 }]),
    save('b', 'Briarwatch'), save('c', 'Crownhold'), save('d', 'Deepmoor'),
  ];
  for (let t = 0; t < 12; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: '2026-01-01T00:00:00.000Z' });
    const u = new Map((r.settlementUpdates || []).map((x) => [String(x.saveId), x.settlement]));
    saves = saves.map((s) => (u.has(s.id) ? { ...s, settlement: u.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
  }
  return campaign.worldState?.spatialLedgers?.beliefMaps || {};
}

describe('D-1b — migration → rumor → belief transitivity (the demographic feeder)', () => {
  it("a 3-hop observer forms a WRONG 'emptying' belief about a growing origin", () => {
    const bm = drive({ axes: true });
    const dBelievesA = bm?.d?.seat?.a;
    expect(dBelievesA, "'d' formed a belief about 'a' three hops away").toBeTruthy();
    // The transitivity: 'd' believes 'a' is EMPTYING (negative demographic trend).
    expect(dBelievesA.populationTrendBand).toBeLessThan(0);
    // The WRONG-belief case: 'a' is actually GROWING — ground truth is positive.
    const trueTrend = trendBandFromHistory([{ delta: 80, population: 1600 }, { delta: 80, population: 1680 }]);
    expect(trueTrend).toBeGreaterThan(0);
    // Fog made the belief diverge from truth (believed emptying, truly swelling).
    expect(Math.sign(dBelievesA.populationTrendBand)).not.toBe(Math.sign(trueTrend));
  }, 30_000);

  it('DORMANT: flag OFF ⇒ no populationTrendBand / observanceLabel anywhere (byte-shape identical)', () => {
    const bm = drive({ axes: false });
    let axisFields = 0;
    for (const obs of Object.keys(bm)) {
      for (const slot of Object.values(bm[obs] || {})) {
        for (const rec of Object.values(slot || {})) {
          if (rec && typeof rec === 'object' && ('populationTrendBand' in rec || 'observanceLabel' in rec)) axisFields += 1;
        }
      }
    }
    expect(axisFields, 'no belief record carries an axis field when the flag is dark').toBe(0);
  }, 30_000);
});
