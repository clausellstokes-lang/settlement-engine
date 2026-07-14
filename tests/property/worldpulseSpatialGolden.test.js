/**
 * worldpulseSpatialGolden.test.js — the SPATIAL-ON golden (Phase 5.5 MODULATION).
 *
 * The aspatial dormancy oracles pin that a campaign WITHOUT the spatial-canon
 * marker stays byte-identical. This is the mirror: a campaign WITH a frozen
 * spatial digest + the `spatialCanonVersion` marker, driven through N real pulse
 * ticks (simulateCampaignWorldPulse — the same kernel the other soaks use), so the
 * three modulation seams (trade channel-weight × distanceWeight, faith-spread
 * reach × distanceWeight, propagation ARRIVAL DELAY) all fire. The run is projected
 * to a MECHANICAL summary (candidate histogram, patron seats, the in-transit
 * arrival-queue keys, queued-impact count) and hashed, so a tuning/curve/calibration
 * drift in the spatial path trips it.
 *
 * Inputs are fully deterministic (fixed rngSeed + fixed `now` + a frozen digest
 * that is itself a pure function of a fixture pack), so the hash is stable across
 * runs and machines — asserted by the two-run determinism test below.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/worldpulseSpatialGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { normalizeForDormancy } from '../domain/religionDormancy.byteIdentity.test.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'worldpulse-spatial-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const UPDATE = process.env.UPDATE_GOLDEN === '1';

// Faith spread + war layer (trade salience) + first-order propagation — all three
// modulation seams live.
const RULES = { religionDynamicsEnabled: true, warLayerEnabled: true, propagationMode: 'first_order' };

const IDS = ['a', 'b', 'c', 'd'];

const deity = (ref, name, align, law, rank) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = {
  lg: deity('custom:sp_dawn', 'Dawnfather', 'good', 'lawful', 'major'),
  ce: deity('custom:sp_maw', 'The Maw', 'evil', 'chaotic', 'major'),
  le: deity('custom:sp_ledger', 'The Ledger', 'evil', 'lawful', 'minor'),
};

/** The frozen digest whose settlement ids are the campaign's node ids (a..d). */
function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  // Reuse placeSettlements' dispersed land cells, but re-key to a..d so the digest
  // aligns with the regionalGraph nodes the modulation reads.
  const placed = placeSettlements(pack, IDS.length);
  const placements = placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function pulseSettlement(name, patron, cults, { exports = [], imports = [], patch = {} } = {}) {
  return {
    name, tier: 'town', population: 1600,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
      ...(cults && cults.length ? { cultDeitySnapshots: cults } : {}),
    },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 34, label: 'Contested' },
      factions: [
        { faction: 'Temple Wardens', category: 'religious', power: 62 },
        { faction: 'Merchant League', category: 'economy', power: 55 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `priest_${name}`, name: `Priest ${name}`, importance: 'key' }],
    activeConditions: [],
    ...patch,
  };
}

const pulseSave = (id, name, patron, cults, opts) => ({
  id, name, phase: 'canon', settlement: pulseSettlement(name, patron, cults, opts),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

const GRAIN = 'Bulk grain and foodstuffs';
// A confirmed grain trade_dependency from supplier 'a' into each buyer — a famine
// at 'a' becomes an import_shortage that PROPAGATES to b/c/d (parked + delayed
// under the marker; queued instantly on the aspatial control).
const grainChannel = (to) => ({
  id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to,
  goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed',
});

function makeCampaignAndSaves(seed, { spatial }) {
  const saves = [
    // 'a' is the grain supplier (exports grain); the famine shocks it.
    pulseSave('a', 'Ashford', D.lg, [], { exports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] } }),
    pulseSave('b', 'Briarwatch', D.ce, [D.le], { imports: [GRAIN] }),
    pulseSave('c', 'Crownhold', D.lg, [], { imports: [GRAIN] }),
    pulseSave('d', 'Deepmoor', D.ce, [], { imports: [GRAIN] }),
  ];
  const worldState = {
    rngSeed: seed, tick: 1, simulationRules: RULES,
    stressors: [
      { id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 },
    ],
    // The spatial-canon marker + frozen digest (the modulation gate). Omitted in
    // the aspatial control run.
    ...(spatial ? { spatialCanonVersion: 1, spatialDigest: spatialDigest() } : {}),
  };
  const campaign = {
    id: 'spatial-pulse', name: 'Spatial Pulse', settlementIds: [...IDS],
    worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'trade_partner' },
        { id: 'edge.c.d', from: 'c', to: 'd', relationshipType: 'rival' },
        { id: 'edge.a.d', from: 'a', to: 'd', relationshipType: 'trade_partner' },
      ],
      channels: [grainChannel('b'), grainChannel('c'), grainChannel('d')],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** Drive N ticks and return the ORACLE-NORMALIZED mechanical projection. */
function projectionFor({ seed, ticks, interval, spatial }) {
  let { campaign, saves } = makeCampaignAndSaves(seed, { spatial });
  /** @type {Record<string, number>} */
  const candidateTypes = {};
  let arrivalTicksSeen = 0;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const o of [...(r.selected || []), ...(r.autoApplied || [])]) {
      const type = String(o?.candidateType || o?.type || 'unknown');
      candidateTypes[type] = (candidateTypes[type] || 0) + 1;
    }
    if (r.worldState?.spatialLedgers?.spatialArrivals && Object.keys(r.worldState.spatialLedgers.spatialArrivals).length) arrivalTicksSeen += 1;
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    // Thread the EVOLVED graph from the kernel's top-level `r.regionalGraph` (the
    // sibling idiom). worldState never carries a regionalGraph key, so the old
    // `r.worldState?.regionalGraph || …` froze the tick-0 graph and made the
    // queuedImpacts hash component inert — the exact propagation seam this golden
    // claims to pin. ([tests-2] harness-fidelity)
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  /** @type {Record<string, {patronRef: string|null, legit: number|null}>} */
  const patrons = {};
  for (const s of saves) {
    const cfg = s.settlement?.config || {};
    const leg = Number(s.settlement?.powerStructure?.publicLegitimacy?.score);
    patrons[s.id] = { patronRef: cfg.primaryDeityRef || null, legit: Number.isFinite(leg) ? leg : null };
  }
  return normalizeForDormancy({
    tick: campaign.worldState?.tick ?? null,
    marker: campaign.worldState?.spatialCanonVersion ?? null,
    arrivalKeys: Object.keys(campaign.worldState?.spatialLedgers?.spatialArrivals || {}).sort(),
    arrivalTicksSeen,
    // Read from the THREADED (evolved) graph now on campaign.regionalGraph — no
    // longer the always-undefined worldState.regionalGraph. This component is now a
    // live count that moves with propagation, not a frozen tick-0 constant.
    queuedImpacts: (campaign.regionalGraph?.queuedImpacts || []).length,
    patrons,
    candidateTypes,
  });
}

const hashOf = (p) => createHash('sha256').update(JSON.stringify(p)).digest('hex');

function spatialCorpus() {
  return [
    { seed: 'sp-a', ticks: 4, interval: 'one_week' },
    { seed: 'sp-b', ticks: 6, interval: 'one_month' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');

describe('worldPulse SPATIAL golden (the modulated path, deterministic)', () => {
  const rows = spatialCorpus();

  if (UPDATE) {
    it('captures the spatial-pulse golden manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashOf(projectionFor({ ...c, spatial: true }));
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    });
    return;
  }

  it('the spatial-pulse manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full spatial corpus', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('is deterministic across two runs (byte-identical projection)', () => {
    for (const c of rows) {
      expect(hashOf(projectionFor({ ...c, spatial: true }))).toBe(hashOf(projectionFor({ ...c, spatial: true })));
    }
  }, 30_000);

  it('the evolved regional graph is threaded from r.regionalGraph, not r.worldState (the stale-graph idiom can never resurface)', () => {
    // Guards the [tests-2] fix (see the deity golden's twin): the kernel returns the
    // evolved graph TOP-LEVEL; worldState.regionalGraph is (and must stay) undefined,
    // so the queuedImpacts / arrival-propagation hash component reads a live graph.
    const { campaign, saves } = makeCampaignAndSaves('sp-a', { spatial: true });
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    expect(r.regionalGraph, 'kernel must return the evolved graph top-level').toBeTruthy();
    expect(r.worldState?.regionalGraph, 'worldState must NOT carry a regionalGraph key (else the fallback idiom silently re-freezes tick 0)').toBeUndefined();
  });

  it('anti-vacuity: the spatial path DIFFERS from the aspatial control', () => {
    // Same campaign, marker removed ⇒ the modulation must measurably change the run
    // (else the seams are inert and the golden is worthless).
    const anyDiffers = rows.some((c) =>
      hashOf(projectionFor({ ...c, spatial: true })) !== hashOf(projectionFor({ ...c, spatial: false })));
    expect(anyDiffers).toBe(true);
  }, 30_000);

  it('every spatial config produces the golden mechanical projection', () => {
    const drift = [];
    for (const c of rows) {
      if (manifest[keyOf(c)] !== hashOf(projectionFor({ ...c, spatial: true }))) drift.push(keyOf(c));
    }
    expect(drift).toEqual([]);
  }, 30_000);
});
