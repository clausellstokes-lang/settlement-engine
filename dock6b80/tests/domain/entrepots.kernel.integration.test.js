/**
 * entrepots.kernel.integration.test.js — M6b ENTREPÔTS/TOLLS, kernel-wired.
 *
 * The pure engine is proven in entrepots.test.js; THIS drives the real kernel
 * (simulateCampaignWorldPulse) with a STAR digest — two producers + two consumers whose
 * every supply caravan must cross the central HUB — and asserts:
 *   - under the marker AND the commodity-flow opt-in, the `entrepots` ledger materializes
 *     and the hub EARNS centrality + a toll from the real crossings;
 *   - DORMANT byte-identity: opt-in OFF (M2 path) ⇒ NO entrepots ledger; marker removed
 *     ⇒ NO entrepots ledger (aspatial);
 *   - determinism across two runs;
 *   - the transshipment-institution UNLOCK (the kernel adapter): a sustained-centrality
 *     hub founds warehouse → customs house → carriers' guild, in order, bounded to three.
 */
import { describe, it, expect } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { advanceEntrepotLayer } from '../../src/domain/worldPulse/entrepotKernel.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IRON = 'Wrought iron';
// STAR: prod1/prod2 (iron exporters) — HUB — consA/consB (iron importers). Every
// producer→consumer road runs [prod, hub, cons], so HUB is the earned crossroads.
const IDS = ['prod1', 'prod2', 'hub', 'consA', 'consB'];

function starDigest() {
  const D = (from, entries) => entries; // readability
  return {
    spatialCanonVersion: 1,
    settlementIds: [...IDS],
    gates: [
      { between: ['prod1', 'hub'], cost: 100 }, { between: ['prod2', 'hub'], cost: 100 },
      { between: ['hub', 'consA'], cost: 100 }, { between: ['hub', 'consB'], cost: 100 },
    ],
    distanceMatrix: {
      prod1: D('prod1', { hub: 100, prod2: 200, consA: 200, consB: 200 }),
      prod2: D('prod2', { hub: 100, prod1: 200, consA: 200, consB: 200 }),
      hub: D('hub', { prod1: 100, prod2: 100, consA: 100, consB: 100 }),
      consA: D('consA', { hub: 100, prod1: 200, prod2: 200, consB: 200 }),
      consB: D('consB', { hub: 100, prod1: 200, prod2: 200, consA: 200 }),
    },
    tiers: {
      prod1: { hub: 1, prod2: 2, consA: 2, consB: 2 },
      prod2: { hub: 1, prod1: 2, consA: 2, consB: 2 },
      hub: { prod1: 1, prod2: 1, consA: 1, consB: 1 },
      consA: { hub: 1, prod1: 2, prod2: 2, consB: 2 },
      consB: { hub: 1, prod1: 2, prod2: 2, consA: 2 },
    },
  };
}

function settlement(name, { exports = [], imports = [] } = {}) {
  return {
    name, tier: 'town', population: 1600,
    config: { tradeRouteAccess: 'road' },
    institutions: [{ name: 'The Works' }],
    economicState: {
      primaryExports: exports, primaryImports: imports,
      activeChains: imports.length
        ? [{ needKey: 'manufacturing', chainId: 'smithing', resource: imports[0], processingInstitutions: ['The Works'], outputs: ['Tools'] }]
        : (exports.length ? [{ needKey: 'extraction', chainId: 'mining', resource: exports[0], exportable: true, outputs: [exports[0]] }] : []),
    },
    powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}

const save = (id, name, opts) => ({ id, name, phase: 'canon', settlement: settlement(name, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function build({ spatial = true, commodity = true } = {}) {
  const saves = [
    save('prod1', 'Iron Vale', { exports: [IRON] }),
    save('prod2', 'Ore Reach', { exports: [IRON] }),
    save('hub', 'Crossgate', {}),                       // the pure waypoint — the earned entrepôt
    save('consA', 'Forge Town', { imports: [IRON] }),
    save('consB', 'Anvil Ford', { imports: [IRON] }),
  ];
  const worldState = {
    rngSeed: 'm6b-entrepot', tick: 1,
    simulationRules: { ...(commodity ? { commodityFlowEnabled: true } : {}) },
    stressors: [],
    ...(spatial ? { spatialCanonVersion: 1, spatialDigest: starDigest() } : {}),
  };
  const campaign = {
    id: 'm6b-entrepot', name: 'Entrepot', settlementIds: [...IDS], worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'e.p1.h', from: 'prod1', to: 'hub', relationshipType: 'trade_partner' },
        { id: 'e.p2.h', from: 'prod2', to: 'hub', relationshipType: 'trade_partner' },
        { id: 'e.h.a', from: 'hub', to: 'consA', relationshipType: 'trade_partner' },
        { id: 'e.h.b', from: 'hub', to: 'consB', relationshipType: 'trade_partner' },
      ],
      channels: [],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

function run({ spatial = true, commodity = true, ticks = 30 } = {}) {
  let { campaign, saves } = build({ spatial, commodity });
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

describe('M6b entrepôts — kernel integration', () => {
  it('under the marker + opt-in, the HUB earns centrality + a toll from real crossings', () => {
    const ws = run({ spatial: true, commodity: true });
    const led = ws.spatialLedgers?.entrepots;
    expect(led && typeof led === 'object').toBe(true);
    // The earned crossroads is the HUB — the pure waypoint every caravan crosses. The
    // producers/consumers (endpoints) do NOT earn centrality from their own shipments.
    expect(led.hub).toBeTruthy();
    expect(led.hub.centrality).toBeGreaterThan(0);
    expect(led.hub.toll).toBeGreaterThan(0);
    expect(led.hub.toll).toBeLessThanOrEqual(1); // rent cap
    expect(led.prod1).toBeUndefined();
    expect(led.consA).toBeUndefined();
    // The supply layer still rides (the entrepôt layer reads its crossings).
    expect(ws.spatialLedgers?.supplyShipments && typeof ws.spatialLedgers.supplyShipments === 'object').toBe(true);
  });

  it('DORMANT: opt-in OFF ⇒ NO entrepôt ledger (the M2 path is byte-untouched)', () => {
    const ws = run({ spatial: true, commodity: false });
    expect(ws.spatialLedgers?.entrepots).toBeUndefined();
    // M2 supply still materializes (the entrepôt layer is off, trade is not).
    expect(ws.spatialLedgers?.supplyShipments && typeof ws.spatialLedgers.supplyShipments === 'object').toBe(true);
  });

  it('DORMANT: no marker ⇒ NO entrepôt ledger (aspatial byte-identity)', () => {
    const ws = run({ spatial: false, commodity: true });
    expect('spatialCanonVersion' in ws).toBe(false);
    expect(ws.spatialLedgers?.entrepots).toBeUndefined();
  });

  it('is deterministic: two entrepôt runs produce byte-identical ledgers', () => {
    const a = run({ spatial: true, commodity: true });
    const b = run({ spatial: true, commodity: true });
    expect(JSON.stringify(a.spatialLedgers?.entrepots || null)).toBe(JSON.stringify(b.spatialLedgers?.entrepots || null));
  });
});

describe('M6b entrepôts — the transshipment-institution UNLOCK (the W-C3 founding lane)', () => {
  const digest = starDigest();
  // A worldState whose HUB is already a SUSTAINED entrepôt (centrality well above the
  // unlock floor, sustained past the streak) + a live shipment crossing it.
  const sustainedWorld = (extraLedger = {}) => ({
    spatialCanonVersion: 1,
    simulationRules: { commodityFlowEnabled: true },
    spatialLedgers: {
      supplyShipments: { 'consA:The Works:wrought iron': { institutionId: 'The Works', settlementId: 'consA', input: 'wrought iron', sourceId: 'prod1', arrivalTick: 40, starving: false } },
      entrepots: { hub: { centrality: 0.9, toll: 0.9, since: 0, lastTick: 19 }, ...extraLedger },
    },
  });

  function foundOn(settlementInstitutions, tick = 20) {
    const hub = { name: 'Crossgate', tier: 'town', institutions: settlementInstitutions };
    const local = new Map([['hub', hub]]);
    const out = advanceEntrepotLayer({
      localSettlements: local,
      settlements: [{ id: 'hub', settlement: hub }],
      worldState: sustainedWorld(),
      digest, tick,
    });
    return { local, out };
  }

  it('a sustained hub founds the WAREHOUSE first (the ordered unlock begins)', () => {
    const { local, out } = foundOn([{ name: 'The Works' }]);
    expect(out.foundings.length).toBe(1);
    const names = local.get('hub').institutions.map((i) => i.name);
    expect(names).toContain('Warehouse');
    // A legible built-object on the W-C3 shape (history recorded, not required, active).
    const wh = local.get('hub').institutions.find((i) => i.name === 'Warehouse');
    expect(wh.status).toBe('active');
    expect(wh.required).toBe(false);
    expect(local.get('hub').institutionHistory.some((h) => h.name === 'Warehouse' && h.fate === 'built')).toBe(true);
  });

  it('founds a native warehouse beside a current custom namesake', () => {
    const customWarehouse = {
      name: 'Warehouse',
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'institutions',
      customDefinitionId: 'definition:institutions:warehouse-namesake',
    };
    const { local, out } = foundOn([
      { name: 'The Works' },
      customWarehouse,
    ]);
    const warehouses = local.get('hub').institutions
      .filter((institution) => institution.name === 'Warehouse');

    expect(out.foundings).toHaveLength(1);
    expect(warehouses).toHaveLength(2);
    expect(warehouses).toContain(customWarehouse);
    expect(warehouses).toContainEqual(expect.objectContaining({
      name: 'Warehouse',
      _worldPulseEconomyBuilt: true,
    }));
  });

  it('unlocks the CUSTOMS HOUSE next, then the CARRIERS\' GUILD (in order)', () => {
    const withWarehouse = foundOn([{ name: 'The Works' }, { name: 'Warehouse' }]);
    expect(withWarehouse.local.get('hub').institutions.map((i) => i.name)).toContain('Customs House');

    const withCustoms = foundOn([{ name: 'The Works' }, { name: 'Warehouse' }, { name: 'Customs House' }]);
    expect(withCustoms.local.get('hub').institutions.map((i) => i.name)).toContain("Carriers' Guild");
  });

  it('is BOUNDED: once all three stand, no further founding', () => {
    const { out } = foundOn([{ name: 'Warehouse' }, { name: 'Customs House' }, { name: "Carriers' Guild" }]);
    expect(out.foundings.length).toBe(0);
  });

  it('a NON-sustained hub founds nothing (the unlock needs sustained centrality)', () => {
    const hub = { name: 'Crossgate', tier: 'town', institutions: [{ name: 'The Works' }] };
    const local = new Map([['hub', hub]]);
    const world = {
      spatialCanonVersion: 1,
      simulationRules: { commodityFlowEnabled: true },
      spatialLedgers: {
        supplyShipments: { 'consA:The Works:wrought iron': { institutionId: 'The Works', settlementId: 'consA', input: 'wrought iron', sourceId: 'prod1', arrivalTick: 40, starving: false } },
        // centrality above the floor but `since` too recent (not yet sustained past the streak).
        entrepots: { hub: { centrality: 0.9, toll: 0.9, since: 19, lastTick: 19 } },
      },
    };
    const out = advanceEntrepotLayer({ localSettlements: local, settlements: [{ id: 'hub', settlement: hub }], worldState: world, digest, tick: 20 });
    expect(out.foundings.length).toBe(0);
    expect(local.get('hub').institutions.map((i) => i.name)).not.toContain('Warehouse');
  });
});
