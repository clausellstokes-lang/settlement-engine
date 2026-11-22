/**
 * commodityFlow.kernel.integration.test.js — M6a COMMODITY CONTINUITY, kernel-wired.
 *
 * The pure engine is proven in commodityFlow.test.js; THIS drives the real kernel
 * (simulateCampaignWorldPulse) with a frozen spatial digest + a NON-FOOD supply web
 * (a smithy at the consumer importing IRON that two producer settlements export) and
 * asserts:
 *   - under the marker AND the commodity-flow opt-in, BOTH sub-ledgers materialize:
 *     commodityStocks (finite origin + consumer stockpiles) and supplyShipments;
 *   - PRE-M6a BYTE-IDENTITY: the SAME campaign with the opt-in OFF runs the M2
 *     time-buffer path verbatim (supplyShipments materializes, commodityStocks does
 *     NOT) — the reconciliation is one representation, gated, never both;
 *   - DORMANT: the marker removed ⇒ neither ledger (aspatial byte-identity);
 *   - FOOD stays out: a food-only web materializes no commodity ledger;
 *   - determinism across two runs.
 */
import { describe, it, expect } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['forge_town', 'iron_vale', 'coal_hollow'];
const IRON = 'Wrought iron';

function digestFor() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

function settlement(name, { exports = [], imports = [] } = {}) {
  return {
    name, tier: 'town', population: 1600,
    config: { tradeRouteAccess: 'road' },
    institutions: [{ name: 'The Smithy' }],
    economicState: {
      primaryExports: exports, primaryImports: imports,
      activeChains: imports.length
        ? [{ needKey: 'manufacturing', chainId: 'smithing', resource: imports[0], processingInstitutions: ['The Smithy'], outputs: ['Tools'] }]
        : (exports.length ? [{ needKey: 'extraction', chainId: 'mining', resource: exports[0], exportable: true, outputs: [exports[0]] }] : []),
    },
    powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}

const save = (id, name, opts) => ({ id, name, phase: 'canon', settlement: settlement(name, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function build({ spatial, commodity, food = false }) {
  const input = food ? 'Bulk grain and foodstuffs' : IRON;
  const saves = [
    save('forge_town', 'Forge Town', { imports: [input] }),
    save('iron_vale', 'Iron Vale', { exports: [input] }),
    save('coal_hollow', 'Coal Hollow', { exports: [input] }),
  ];
  const worldState = {
    rngSeed: 'm6a-commodity', tick: 1,
    simulationRules: { warLayerEnabled: true, ...(commodity ? { commodityFlowEnabled: true } : {}) },
    stressors: [],
    ...(spatial ? { spatialCanonVersion: 1, spatialDigest: digestFor() } : {}),
  };
  const campaign = {
    id: 'm6a-commodity', name: 'Commodity', settlementIds: [...IDS], worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'e.f.i', from: 'forge_town', to: 'iron_vale', relationshipType: 'trade_partner' },
        { id: 'e.f.c', from: 'forge_town', to: 'coal_hollow', relationshipType: 'trade_partner' },
      ],
      channels: [],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

function run({ spatial, commodity, food = false, ticks = 4 }) {
  let { campaign, saves } = build({ spatial, commodity, food });
  let last = null;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph };
    last = r;
  }
  return last.worldState;
}

describe('M6a commodity continuity — kernel integration', () => {
  it('under the marker + opt-in, BOTH commodityStocks and supplyShipments materialize', () => {
    const ws = run({ spatial: true, commodity: true });
    expect(ws.spatialCanonVersion).toBe(1);
    const stocks = ws.spatialLedgers?.commodityStocks;
    const ship = ws.spatialLedgers?.supplyShipments;
    expect(stocks && typeof stocks === 'object').toBe(true);
    expect(ship && typeof ship === 'object').toBe(true);
    // The producers (iron_vale, coal_hollow) hold a finite iron stock; the consumer
    // (forge_town) holds a quantity stockpile — sparse, only where iron is made/used.
    expect(stocks.iron_vale).toBeTruthy();
    expect(stocks.coal_hollow).toBeTruthy();
    expect(stocks.forge_town).toBeTruthy();
    // A caravan record is for the CONSUMER (forge_town), keyed settlement:institution:input.
    for (const key of Object.keys(ship)) {
      expect(key.startsWith('forge_town:')).toBe(true);
      expect(ship[key].settlementId).toBe('forge_town');
    }
  });

  it('PRE-M6a byte-identity: opt-in OFF ⇒ M2 path (supplyShipments, NO commodityStocks)', () => {
    const ws = run({ spatial: true, commodity: false });
    expect(ws.spatialLedgers?.supplyShipments && typeof ws.spatialLedgers.supplyShipments === 'object').toBe(true);
    expect(ws.spatialLedgers?.commodityStocks).toBeUndefined(); // the M2 representation, never both
  });

  it('DORMANT: no marker ⇒ neither ledger (aspatial byte-identity)', () => {
    const ws = run({ spatial: false, commodity: true });
    expect('spatialCanonVersion' in ws).toBe(false);
    expect(ws.spatialLedgers?.commodityStocks).toBeUndefined();
    expect(ws.spatialLedgers?.supplyShipments).toBeUndefined();
  });

  it('FOOD stays with foodStockpile: a food-only web materializes no commodity ledger', () => {
    const ws = run({ spatial: true, commodity: true, food: true });
    expect(ws.spatialLedgers?.commodityStocks).toBeUndefined();
    expect(ws.spatialLedgers?.supplyShipments).toBeUndefined();
  });

  it('is deterministic: two commodity runs produce byte-identical ledgers', () => {
    const a = run({ spatial: true, commodity: true });
    const b = run({ spatial: true, commodity: true });
    expect(JSON.stringify(a.spatialLedgers?.commodityStocks || null)).toBe(JSON.stringify(b.spatialLedgers?.commodityStocks || null));
    expect(JSON.stringify(a.spatialLedgers?.supplyShipments || null)).toBe(JSON.stringify(b.spatialLedgers?.supplyShipments || null));
  });
});
