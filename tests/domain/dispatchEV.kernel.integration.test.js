/**
 * dispatchEV.kernel.integration.test.js — M6c THE DISPATCH EV, kernel-wired.
 *
 * The pure engine + orchestrator are proven in dispatchEV*.test.js; THIS drives the
 * real kernel (simulateCampaignWorldPulse) to exercise buildDispatchEV end-to-end —
 * the live alignment / merchant-faction / occupation / belief reads:
 *   - a PEACEFUL commodity campaign materializes NO appetite / willingness ledger
 *     (danger 0 everywhere ⇒ M6a-verbatim dispatch, sparse EV ledgers stay absent);
 *   - beliefs LIVE (infoMode perfect_delayed) drives the belief-gated deterrent through
 *     real cold-started belief records WITHOUT error (the wiring is sound);
 *   - the merchant-faction strength read (merchantStrength01Of).
 */
import { describe, it, expect } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { merchantStrength01Of } from '../../src/domain/worldPulse/supplyKernel.js';
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

function settlement(name, { exports = [], imports = [], factions = [] } = {}) {
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
    powerStructure: { publicLegitimacy: { score: 40 }, factions, conflicts: [] },
    factions,
    npcs: [], activeConditions: [],
  };
}

const save = (id, name, opts) => ({ id, name, phase: 'canon', settlement: settlement(name, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function build({ infoMode = 'omniscient' } = {}) {
  const saves = [
    save('forge_town', 'Forge Town', { imports: [IRON] }),
    save('iron_vale', 'Iron Vale', { exports: [IRON], factions: [{ name: "Merchants' Guild", category: 'merchant', power: 80 }] }),
    save('coal_hollow', 'Coal Hollow', { exports: [IRON] }),
  ];
  const worldState = {
    rngSeed: 'm6c-dispatch', tick: 1,
    simulationRules: { warLayerEnabled: true, commodityFlowEnabled: true, infoMode },
    stressors: [],
    spatialCanonVersion: 1, spatialDigest: digestFor(),
  };
  const campaign = {
    id: 'm6c-dispatch', name: 'Dispatch', settlementIds: [...IDS], worldState,
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

function run({ infoMode = 'omniscient', ticks = 4 } = {}) {
  let { campaign, saves } = build({ infoMode });
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

describe('M6c dispatch EV — kernel integration', () => {
  it('a PEACEFUL commodity campaign materializes commodity ledgers but NO EV ledgers', () => {
    const ws = run({ infoMode: 'omniscient' });
    // The M6a commodity substrate is live...
    expect(ws.spatialLedgers?.commodityStocks && typeof ws.spatialLedgers.commodityStocks === 'object').toBe(true);
    // ...but with danger 0 everywhere the EV never refuses / emboldens ⇒ sparse EV
    // ledgers stay ABSENT (the appetite sits at baseline; willingness stays willing).
    expect(ws.spatialLedgers?.merchantAppetite).toBeUndefined();
    expect(ws.spatialLedgers?.dispatchWillingness).toBeUndefined();
  });

  it('beliefs LIVE (perfect_delayed) drives the belief-gated deterrent WITHOUT error', () => {
    // Exercises buildDispatchEV's full path: real cold-started belief records feed
    // believedDestinationDanger, alignment feeds caution, factions feed the baseline.
    const ws = run({ infoMode: 'perfect_delayed' });
    expect(ws.spatialCanonVersion).toBe(1);
    expect(ws.spatialLedgers?.beliefMaps && typeof ws.spatialLedgers.beliefMaps === 'object').toBe(true);
    expect(ws.spatialLedgers?.commodityStocks && typeof ws.spatialLedgers.commodityStocks === 'object').toBe(true);
    // Peaceful even with beliefs on ⇒ still no EV ledger churn.
    expect(ws.spatialLedgers?.merchantAppetite).toBeUndefined();
  });

  it('is deterministic across two commodity runs', () => {
    const a = run({ infoMode: 'perfect_delayed' });
    const b = run({ infoMode: 'perfect_delayed' });
    expect(JSON.stringify(a.spatialLedgers?.commodityStocks || null)).toBe(JSON.stringify(b.spatialLedgers?.commodityStocks || null));
  });
});

describe('M6c — the merchant-faction strength read (appetite baseline driver)', () => {
  it('reads the max MERCHANT-archetype faction power, normalized; none ⇒ 0', () => {
    expect(merchantStrength01Of({ factions: [{ name: "Merchants' Guild", category: 'merchant', power: 80 }] })).toBeCloseTo(0.8, 5);
    expect(merchantStrength01Of({ powerStructure: { factions: [{ name: 'Trade House', power: 60 }] } })).toBeCloseTo(0.6, 5);
    expect(merchantStrength01Of({ factions: [{ name: 'The Watch', category: 'military', power: 90 }] })).toBe(0);
    expect(merchantStrength01Of(null)).toBe(0);
  });
});
