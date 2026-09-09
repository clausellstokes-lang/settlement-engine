/**
 * tradeFlow.kernel.integration.test.js — M6d FLOW-DERIVED ECONOMICS, kernel-wired.
 *
 * The pure tally is proven in tradeFlow.test.js; THIS drives the real kernel
 * (simulateCampaignWorldPulse) over a NON-FOOD supply web (a forge importing IRON
 * from two producers) and asserts the arrivals the supply kernel used to DISCARD are
 * now a sparse windowed `tradeFlow` sub-ledger (goods in at the consumer, out at the
 * producers), under the M6-family DOUBLE gate:
 *   - marker AND commodity-flow opt-in ⇒ tradeFlow materializes with in/out;
 *   - opt-in OFF (the M2 path) ⇒ NO tradeFlow key (byte-identity — the tally is an M6
 *     feature, dormant even in a spatial campaign);
 *   - no marker ⇒ NO tradeFlow (aspatial byte-identity);
 *   - the generation baseline (economicState) is NEVER mutated by the tally;
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
  const pack = makeGridPack({ cols: 10, rows: 8 });
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

function build({ spatial, commodity }) {
  const saves = [
    save('forge_town', 'Forge Town', { imports: [IRON] }),
    save('iron_vale', 'Iron Vale', { exports: [IRON] }),
    save('coal_hollow', 'Coal Hollow', { exports: [IRON] }),
  ];
  const worldState = {
    rngSeed: 'm6d-flow', tick: 1,
    simulationRules: { warLayerEnabled: true, ...(commodity ? { commodityFlowEnabled: true } : {}) },
    stressors: [],
    ...(spatial ? { spatialCanonVersion: 1, spatialDigest: digestFor() } : {}),
  };
  const campaign = {
    id: 'm6d-flow', name: 'Flow', settlementIds: [...IDS], worldState,
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

function run({ spatial, commodity, ticks = 24 }) {
  let { campaign, saves } = build({ spatial, commodity });
  let last = null;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph };
    last = r;
  }
  return { worldState: last.worldState, saves };
}

describe('M6d flow-derived economics — kernel integration', () => {
  it('under the marker + opt-in, the arrivals TALLY materializes (goods in at consumer, out at producers)', () => {
    const { worldState: ws } = run({ spatial: true, commodity: true });
    const flow = ws.spatialLedgers?.tradeFlow;
    expect(flow && typeof flow === 'object').toBe(true);
    // The consumer registers INBOUND throughput; at least one producer registers OUTBOUND.
    expect(flow.forge_town).toBeTruthy();
    expect(flow.forge_town.in).toBeGreaterThan(0);
    const producerOut = ['iron_vale', 'coal_hollow'].some((p) => flow[p] && flow[p].out > 0);
    expect(producerOut).toBe(true);
    // Sparse + windowed record shape.
    for (const sid of Object.keys(flow)) {
      expect(typeof flow[sid].in).toBe('number');
      expect(typeof flow[sid].out).toBe('number');
      expect(Number.isInteger(flow[sid].lastTick)).toBe(true);
    }
  });

  it('opt-in OFF (M2 path) ⇒ NO tradeFlow key (the tally is an M6 feature, dormant off it)', () => {
    const { worldState: ws } = run({ spatial: true, commodity: false });
    expect(ws.spatialLedgers?.supplyShipments && typeof ws.spatialLedgers.supplyShipments === 'object').toBe(true);
    expect(ws.spatialLedgers?.tradeFlow).toBeUndefined();
  });

  it('DORMANT: no marker ⇒ NO tradeFlow key (aspatial byte-identity)', () => {
    const { worldState: ws } = run({ spatial: false, commodity: true });
    expect(ws.spatialLedgers?.tradeFlow).toBeUndefined();
  });

  it('GENERATION IS SACRED: the seeded economicState is never mutated by the tally', () => {
    const { saves } = run({ spatial: true, commodity: true });
    const forge = saves.find((s) => s.id === 'forge_town');
    // The seeded trade profile survives verbatim — the drift is display-only.
    expect(forge.settlement.economicState.primaryImports).toEqual([IRON]);
    const vale = saves.find((s) => s.id === 'iron_vale');
    expect(vale.settlement.economicState.primaryExports).toEqual([IRON]);
  });

  it('is deterministic: two flow runs produce byte-identical tallies', () => {
    const a = run({ spatial: true, commodity: true });
    const b = run({ spatial: true, commodity: true });
    expect(JSON.stringify(a.worldState.spatialLedgers?.tradeFlow || null))
      .toBe(JSON.stringify(b.worldState.spatialLedgers?.tradeFlow || null));
  });
});
