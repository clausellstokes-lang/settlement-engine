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
import { advanceSettlementPestilence } from '../../src/domain/worldPulse/pestilenceKernel.js';
import { evaluateWorldPulseRules } from '../../src/domain/worldPulse/candidateEvents.js';
import { normalizeStressor } from '../../src/domain/worldPulse/stressors.js';
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

// ── FIX #1 — the materialization dedup keys on the REAL minted id (UUID-safe) ──
// The kernel mints `world_stressor.disease_outbreak.<stablePart(id)>` (idFor slugs the origin,
// [^a-z0-9]+→_). The dedup guard used to key on the RAW settlement id — for a production UUID
// (hyphens) that MISSES the real minted id (underscores), so a settlement that already carries an
// active disease_outbreak got a SECOND identical-id record when the front onset there, breaking
// ONE PLAGUE TRUTH (and byte-drift: duplicate-id arrays collapse order-dependently). Clean-slug
// fixtures (sourcetown/midvale) hid it because stablePart(slug) === slug.
describe('M11a pestilence — FIX #1: UUID-shaped id dedup (no double-mint)', () => {
  const UUID = '3f2a9b1c-7d4e-4a1b-9c2d-1e2f3a4b5c6d';
  const ALWAYS = { fork: () => ({ random: () => 0 }) }; // onset always takes hold

  it('a UUID settlement already carrying an active disease_outbreak is NOT double-minted when the front onsets', () => {
    // The settlement already has an active disease_outbreak (its canonical, stablePart-slugged id)
    // AND the epidemic front independently landed here (incubating, incubation elapsed) with a
    // source — so this tick the front ONSETS and tries to materialize the plague that is already here.
    const existing = { ...normalizeStressor({ type: 'disease_outbreak', originSettlementId: UUID, severity: 0.7, affectedSettlementIds: [UUID] }), status: 'active', lifecycleStage: 'active' };
    const worldState = {
      spatialCanonVersion: 1, tick: 2,
      stressors: [existing],
      spatialLedgers: { epidemic: { [UUID]: {
        phase: 'incubating', level: 0, arrivedTick: 0, incubateUntil: 1, sinceTick: 0,
        lastTick: 0, activeSince: 0, refractoryUntil: 0, sourceId: 'src-town',
      } } },
    };
    const snapshot = { settlements: [{ id: UUID, name: 'Ashford', settlement: { tier: 'town', population: 1800, institutions: [] } }] };
    const r = advanceSettlementPestilence({ snapshot, worldState, digest: null, graph: null, rng: ALWAYS, season: null, tick: 2, now: NOW });
    const plagues = (r.worldState.stressors || []).filter((s) => s.type === 'disease_outbreak' && s.originSettlementId === UUID);
    // ONE PLAGUE TRUTH: exactly one record, and one distinct stored id (pre-fix this was TWO,
    // both id `world_stressor.disease_outbreak.<uuid-underscores>` under different Map keys).
    expect(plagues.length).toBe(1);
    expect(new Set(plagues.map((p) => String(p.id))).size).toBe(1);
  });
});

// ── FIX #2 — the reconcile drops ONLY the trade spread the front replaces ─────
// disease_outbreak.spreadChannels = [trade_route, migration_pressure, service_dependency]; the
// spatial front travels ONLY trade-type channels + M2 shipments. The old reconcile dropped EVERY
// aspatial disease spread under the marker, so the migration_pressure + service_dependency vectors
// (refugee + service routes) silently vanished — on-marker reach was STRICTLY LESS than aspatial.
// Now only the front-carried TRADE spread is dropped; migration/service spread is preserved.
describe('M11a pestilence — FIX #2: reconcile preserves the non-trade spread the front never carries', () => {
  const snap = (marker) => ({
    worldState: {
      tick: 5,
      ...(marker ? { spatialCanonVersion: 1 } : {}),
      simulationRules: { stressorsEnabled: true, propagationMode: 'full' },
      stressors: [{ id: 'world_stressor.disease_outbreak.a', type: 'disease_outbreak', status: 'active', lifecycleStage: 'active', severity: 0.9, originSettlementId: 'a', affectedSettlementIds: ['a'] }],
    },
    // B reachable from the infected A ONLY via migration_pressure; C ONLY via trade_route.
    regionalGraph: ensureRegionalGraph({ channels: [
      { id: 'ch.ab', type: 'migration_pressure', from: 'a', to: 'b', status: 'confirmed' },
      { id: 'ch.ac', type: 'trade_route', from: 'a', to: 'c', status: 'confirmed' },
    ] }),
    byId: new Map([
      ['a', { id: 'a', name: 'A', settlement: { population: 2000 }, activeConditions: [] }],
      ['b', { id: 'b', name: 'B', settlement: { population: 1500 }, activeConditions: [] }],
      ['c', { id: 'c', name: 'C', settlement: { population: 1500 }, activeConditions: [] }],
    ]),
    settlements: [
      { id: 'a', name: 'A', activeConditions: [], causal: { scores: {} } },
      { id: 'b', name: 'B', activeConditions: [], causal: { scores: {} } },
      { id: 'c', name: 'C', activeConditions: [], causal: { scores: {} } },
    ],
  });
  const spreadTo = (cands, id) => cands.filter((c) => c?.candidateType === 'stressor_spread_disease_outbreak' && c.targetSaveId === id);

  it('OFF the marker: BOTH the migration (B) and trade (C) aspatial spread candidates fire (byte-identical legacy)', () => {
    const cands = evaluateWorldPulseRules(snap(false), { tick: 5, pressureIndex: new Map() });
    expect(spreadTo(cands, 'b').length).toBe(1);
    expect(spreadTo(cands, 'c').length).toBe(1);
  });

  it('ON the marker: the migration spread (B) is PRESERVED (front never carries it); the trade spread (C) is reconciled out', () => {
    const cands = evaluateWorldPulseRules(snap(true), { tick: 5, pressureIndex: new Map() });
    expect(spreadTo(cands, 'b').length).toBe(1); // refugee vector preserved — reach ≥ aspatial
    expect(spreadTo(cands, 'c').length).toBe(0); // the front replaces the trade spread (no double-count)
  });
});
