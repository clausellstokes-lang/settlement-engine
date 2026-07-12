/**
 * supplyShipments.kernel.integration.test.js — M2 CARAVANS, kernel-wired.
 *
 * The pure engine is proven in supplyShipments.test.js; THIS drives the real kernel
 * (simulateCampaignWorldPulse) with a frozen spatial digest + a NON-FOOD supply web
 * (a smithy at the consumer importing IRON that a producer settlement exports) and
 * asserts:
 *   - the AGGREGATE shipment ledger materializes on worldState under the marker;
 *   - DORMANT: the SAME campaign with the marker removed carries NO supplyShipments
 *     key (byte-identical dormancy — the aspatial control);
 *   - FOOD stays with foodStockpile: a food-only web never materializes a ledger.
 */
import { describe, it, expect } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['forge_town', 'iron_vale', 'coal_hollow'];
const IRON = 'Wrought iron';
const COAL = 'Coal';

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
        : [],
    },
    powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}

const save = (id, name, opts) => ({ id, name, phase: 'canon', settlement: settlement(name, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function build({ spatial, food = false }) {
  const input = food ? 'Bulk grain and foodstuffs' : IRON;
  const saves = [
    // forge_town imports the input; iron_vale + coal_hollow export it (≥2 sources).
    save('forge_town', 'Forge Town', { imports: [input] }),
    save('iron_vale', 'Iron Vale', { exports: [input] }),
    save('coal_hollow', 'Coal Hollow', { exports: [input, COAL] }),
  ];
  const worldState = {
    rngSeed: 'm2-caravan', tick: 1,
    simulationRules: { warLayerEnabled: true },
    stressors: [],
    ...(spatial ? { spatialCanonVersion: 1, spatialDigest: digestFor() } : {}),
  };
  const campaign = {
    id: 'm2-caravan', name: 'Caravan', settlementIds: [...IDS], worldState,
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

/** Drive N ticks; return the final worldState. */
function run({ spatial, food = false, ticks = 4 }) {
  let { campaign, saves } = build({ spatial, food });
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

describe('M2 caravans — kernel integration', () => {
  it('materializes the AGGREGATE shipment ledger under the spatial marker (non-food web)', () => {
    const ws = run({ spatial: true });
    expect(ws.spatialCanonVersion).toBe(1);
    const ledger = ws.supplyShipments;
    expect(ledger && typeof ledger === 'object').toBe(true);
    const keys = Object.keys(ledger);
    expect(keys.length).toBeGreaterThan(0);
    // Every record is for the CONSUMER (forge_town) — the only importer — and its
    // key is the composite settlement:institution:input (one record per active link).
    for (const key of keys) {
      expect(key.startsWith('forge_town:')).toBe(true);
      expect(ledger[key].settlementId).toBe('forge_town');
    }
    // AGGREGATE: at most one record per (institution,input) — never per-wagon.
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('DORMANT: the same campaign without the marker carries NO supplyShipments key', () => {
    const ws = run({ spatial: false });
    expect('spatialCanonVersion' in ws).toBe(false);
    expect('supplyShipments' in ws).toBe(false); // byte-identical dormancy
  });

  it('FOOD stays with foodStockpile: a food-only web never materializes a ledger', () => {
    const ws = run({ spatial: true, food: true });
    expect(ws.spatialCanonVersion).toBe(1);
    expect('supplyShipments' in ws).toBe(false); // food excluded — no double-count
  });

  it('is deterministic: two spatial runs produce byte-identical ledgers', () => {
    expect(JSON.stringify(run({ spatial: true }).supplyShipments || null))
      .toBe(JSON.stringify(run({ spatial: true }).supplyShipments || null));
  });
});
