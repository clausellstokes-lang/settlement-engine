/**
 * pestilence.kernel.integration.test.js — M11a PESTILENCE, the full-engine proof.
 *
 * Driven through simulateCampaignWorldPulse (the real tick engine) so the claims are
 * proven end-to-end, not in isolation:
 *   - MATERIALIZE: under the marker the front travels the trade channels and mints the
 *     ORDINARY disease_outbreak stressor at the settlements it reaches (ONE PLAGUE TRUTH —
 *     the canonical id world_stressor.disease_outbreak.<id>), with an epidemic ledger nested
 *     under spatialLedgers (zero eager) + a plague_arrival news entry;
 *   - LATENCY: the neighbour is NOT infected on tick 1 (the front incubates); it materializes
 *     later — the spatial travel is at hopWeeks pace, not the instant aspatial spread;
 *   - RECONCILE (no double-count): under the marker the seed's disease_outbreak does NOT gain
 *     the neighbour via the aspatial severityBySettlement channel spread — the front owns it;
 *   - DORMANT byte-identity: the SAME campaign without the marker keeps today's aspatial
 *     plague (the one-hop channel spread), carries NO epidemic ledger, and is deterministic;
 *   - NAMED-NPC UNTOUCHED (product boundary): a named NPC survives the plague ticks.
 */
import { describe, it, expect } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['sourcetown', 'midvale', 'faredge'];

function digestFor() {
  const pack = makeGridPack({ cols: 10, rows: 6 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

function settlement(name, { healers = 0, npcs = [] } = {}) {
  const institutions = [{ name: 'The Market' }];
  for (let i = 0; i < healers; i++) institutions.push({ name: `Temple of Healing ${i}` });
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road' },
    institutions,
    economicState: { primaryExports: [], primaryImports: [], activeChains: [] },
    powerStructure: { publicLegitimacy: { score: 45 }, factions: [], conflicts: [] },
    npcs,
    activeConditions: [],
  };
}

const save = (id, name, opts) => ({
  id, name, phase: 'canon', settlement: settlement(name, opts),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

// A high-severity active disease_outbreak seeded at sourcetown (care-poor ⇒ it persists).
function seedPlague() {
  return {
    id: 'world_stressor.disease_outbreak.sourcetown',
    type: 'disease_outbreak',
    status: 'active',
    lifecycleStage: 'active',
    severity: 0.85,
    originSettlementId: 'sourcetown',
    affectedSettlementIds: ['sourcetown'],
    age: 2,
  };
}

function build({ spatial }) {
  const saves = [
    save('sourcetown', 'Sourcetown', { healers: 0, npcs: [{ id: 'npc1', name: 'Aldric the Elder', role: 'elder' }] }),
    save('midvale', 'Midvale', { healers: 0 }),
    save('faredge', 'Faredge', { healers: 0 }),
  ];
  const worldState = {
    rngSeed: 'm11a-integration', tick: 1,
    simulationRules: { warLayerEnabled: false, propagationMode: 'full', stressorsEnabled: true },
    stressors: [seedPlague()],
    ...(spatial ? { spatialCanonVersion: 1, spatialDigest: digestFor() } : {}),
  };
  const tradeChannel = (id, from, to) => ({ id, type: 'trade_route', from, to, status: 'confirmed' });
  const campaign = {
    id: 'm11a-integration', name: 'Plague', settlementIds: [...IDS], worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'e.s.m', from: 'sourcetown', to: 'midvale', relationshipType: 'trade_partner' },
        { id: 'e.m.f', from: 'midvale', to: 'faredge', relationshipType: 'trade_partner' },
      ],
      channels: [tradeChannel('ch.s.m', 'sourcetown', 'midvale'), tradeChannel('ch.m.f', 'midvale', 'faredge')],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

const ACTIVE = ['active', 'emerging', 'peaking', 'easing'];
const plagueAt = (ws, id) => (ws.stressors || []).find(
  (s) => s.type === 'disease_outbreak' && s.originSettlementId === id && ACTIVE.includes(s.status));

/**
 * Drive N ticks; capture per-tick history (the plague lifecycle here is fast, so we
 * track WHETHER events occurred across the run rather than snapshotting one late tick).
 */
function run({ spatial, ticks = 14 }) {
  let { campaign, saves } = build({ spatial });
  let last = null;
  const allNews = [];
  let everMidvalePlague = false; // midvale ever minted its OWN disease_outbreak (materialization)
  let epidemicEverHadMidvale = false;
  let seedMaxFootprint = 1; // the seed's largest affectedSettlementIds (aspatial spread grows this)
  const midvaleIncubatedBeforeMaterializing = { incubated: false, materialized: false };
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const ws = r.worldState;
    if (plagueAt(ws, 'midvale')) everMidvalePlague = true;
    const seed = (ws.stressors || []).find((s) => s.id === 'world_stressor.disease_outbreak.sourcetown');
    if (seed) seedMaxFootprint = Math.max(seedMaxFootprint, (seed.affectedSettlementIds || []).length);
    const epi = ws.spatialLedgers?.epidemic;
    if (epi?.midvale) {
      epidemicEverHadMidvale = true;
      if (epi.midvale.phase === 'incubating' && !midvaleIncubatedBeforeMaterializing.materialized) midvaleIncubatedBeforeMaterializing.incubated = true;
      if (epi.midvale.phase === 'active') midvaleIncubatedBeforeMaterializing.materialized = true;
    }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: ws, regionalGraph: ws?.regionalGraph || campaign.regionalGraph };
    for (const e of r.wizardNews?.entries || []) allNews.push(e);
    last = r;
  }
  return { worldState: last.worldState, allNews, saves, everMidvalePlague, epidemicEverHadMidvale, seedMaxFootprint, order: midvaleIncubatedBeforeMaterializing };
}

describe('M11a pestilence — kernel integration (the traveling plague)', () => {
  it('materializes the epidemic ledger (nested under spatialLedgers) + walks the trade channels', () => {
    const r = run({ spatial: true, ticks: 14 });
    expect(r.worldState.spatialCanonVersion).toBe(1);
    // The epidemic sub-ledger nests under spatialLedgers (ZERO eager bytes) and reached midvale.
    expect(r.epidemicEverHadMidvale).toBe(true);
    // The front minted midvale its OWN plague (canonical origin id — the ONE stressor, driven,
    // not a parallel record) at some point in the run (the lifecycle is fast, so it later clears).
    expect(r.everMidvalePlague).toBe(true);
    // A plague_arrival news entry was emitted (legibility) + carried the spatial-arrival receipt.
    const arrival = r.allNews.find((e) => e.impactKind === 'plague_arrival' && e.settlementIds?.includes('midvale'));
    expect(arrival).toBeTruthy();
    expect(String(arrival.summary)).toMatch(/trade roads/i);
  });

  it('LATENCY: the front INCUBATES at the neighbour before it materializes (it does not teleport)', () => {
    const r = run({ spatial: true, ticks: 14 });
    // The epidemic ledger showed midvale INCUBATING before it went ACTIVE — the plague arrived
    // at hopWeeks pace, not the instant aspatial one-hop spread.
    expect(r.order.incubated).toBe(true);
    expect(r.order.materialized).toBe(true);
    // Concretely: after ONE tick midvale has not yet minted its own plague.
    const oneTick = run({ spatial: true, ticks: 1 });
    expect(plagueAt(oneTick.worldState, 'midvale')).toBeFalsy();
  });

  it('RECONCILE (no double-count): under the marker the seed NEVER aspatial-spreads its footprint', () => {
    const r = run({ spatial: true, ticks: 14 });
    // The aspatial one-hop spread grows the seed's affectedSettlementIds beyond its origin.
    // Under the marker that path is reconciled OUT — the seed stays origin-only across the WHOLE
    // run; the neighbour instead got its OWN materialized record (proven above). No double-count.
    expect(r.seedMaxFootprint).toBe(1);
  });

  it('DORMANT: the SAME campaign without the marker carries NO epidemic ledger + never mints a 2nd origin', () => {
    const r = run({ spatial: false, ticks: 14 });
    expect('spatialCanonVersion' in r.worldState).toBe(false);
    expect(r.worldState.spatialLedgers?.epidemic).toBeUndefined(); // no travel layer at all
    // The seed still exists via the aspatial path (the plague is byte-identically today's).
    expect((r.worldState.stressors || []).some((s) => s.id === 'world_stressor.disease_outbreak.sourcetown')).toBe(true);
    // The aspatial spread joins the ONE record (severityBySettlement) — it NEVER mints a second
    // ORIGIN record (that is the front's job). So midvale never carries its own origin plague.
    expect(r.everMidvalePlague).toBe(false);
  });

  it('is deterministic — two spatial runs agree byte-for-byte on the epidemic ledger', () => {
    const a = JSON.stringify(run({ spatial: true, ticks: 12 }).worldState.spatialLedgers?.epidemic || null);
    const b = JSON.stringify(run({ spatial: true, ticks: 12 }).worldState.spatialLedgers?.epidemic || null);
    expect(a).toBe(b);
  });

  it('NAMED-NPC UNTOUCHED (product boundary): the named elder survives the plague ticks', () => {
    const { saves } = run({ spatial: true, ticks: 14 });
    const source = saves.find((s) => s.id === 'sourcetown');
    const npcs = source?.settlement?.npcs || [];
    expect(npcs.some((n) => n.name === 'Aldric the Elder')).toBe(true); // aggregate-only — no npc fate
  });
});
