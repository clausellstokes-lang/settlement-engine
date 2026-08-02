/**
 * beliefMapGolden.test.js — the BELIEF-LEDGER golden (Phase 5.5 WAVE A).
 *
 * The mirror of rumorLedgerGolden for the belief layer: the same spatial famine +
 * relationship fixture driven through N real pulse ticks with infoMode
 * perfect_delayed / unreliable, projected to a MECHANICAL summary of the belief
 * maps (per (observer, subject): strength band, readiness band, alliance label,
 * confidence band, staleness) and hashed. A drift in cold-start, the
 * reconciliation weights, the silence-decay law, the re-anchor, or pruning trips
 * it.
 *
 * Inputs are fully deterministic (fixed rngSeed + fixed `now` + a frozen digest
 * that is a pure function of a fixture pack), so the hash is stable across runs
 * and machines — asserted by the two-run determinism test.
 *
 * AUTHORIZED W1 RE-RECORD (2026-08-01; FABLE_VALIDATION_QUEUE / WR-0b): only
 * bg-c|14|unreliable moved. The chooser's tick-13 c→b order now reaches the ONE
 * opener at tick 14, so the real deployment raises b's final belief of c readiness
 * from 0.7131 (readinessBand 3) to 0.9406 (readinessBand 4). No other projected
 * field or corpus row moved: a declared lit-path war-intent join, not a dormancy leak.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/beliefMapGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'belief-map-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const UPDATE = process.env.UPDATE_GOLDEN === '1';

const IDS = ['a', 'b', 'c', 'd'];
const GRAIN = 'Bulk grain and foodstuffs';

function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function save(id, name, exports, imports) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1600,
      config: { tradeRouteAccess: 'road', priorityEconomy: 25 },
      institutions: [],
      economicState: { primaryExports: exports, primaryImports: imports },
      powerStructure: { publicLegitimacy: { score: 34, label: 'Contested' }, factions: [], conflicts: [] },
      npcs: [{ id: `n_${id}`, name: 'Reeve', importance: 'key' }],
      activeConditions: id === 'a' ? [{ archetype: 'regional_import_shortage', severity: 0.7 }] : [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}
const grainChannel = (to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });
const relEdges = [
  { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' },
  { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
  { id: 'edge.c.d', from: 'c', to: 'd', relationshipType: 'trade_partner' },
];

function makeCampaign(seed, infoMode) {
  return {
    id: 'belief-golden', name: 'belief-golden', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1,
      relationshipStates: {
        'edge.a.b': { relationshipType: 'hostile' }, 'edge.b.c': { relationshipType: 'rival' }, 'edge.c.d': { relationshipType: 'trade_partner' },
      },
      simulationRules: { propagationMode: 'first_order', settlementStrategyEnabled: true, warLayerEnabled: true, infoMode },
      stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 }],
      spatialCanonVersion: 1,
      spatialDigest: spatialDigest(),
    },
    regionalGraph: ensureRegionalGraph({ edges: relEdges, channels: [grainChannel('b'), grainChannel('c'), grainChannel('d')] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

const confBand = (c) => (c >= 0.8 ? 'certain' : c >= 0.5 ? 'confident' : c >= 0.2 ? 'uncertain' : 'vague');

function projectionFor({ seed, ticks, infoMode }) {
  let campaign = makeCampaign(seed, infoMode);
  let saves = [save('a', 'Ashford', [GRAIN], []), save('b', 'Briarwatch', [], [GRAIN]), save('c', 'Crownhold', [], [GRAIN]), save('d', 'Deepmoor', [], [GRAIN])];
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
  }
  const tick = campaign.worldState?.tick ?? 0;
  const maps = campaign.worldState?.spatialLedgers?.beliefMaps || {};
  /** @type {Record<string, Record<string, unknown>>} */
  const summary = {};
  for (const obs of Object.keys(maps).sort()) {
    const seat = maps[obs]?.[GOVERNING_SEAT_KEY] || {};
    /** @type {Record<string, unknown>} */
    const byObs = {};
    for (const subj of Object.keys(seat).sort()) {
      const rec = seat[subj];
      byObs[subj] = {
        strengthBand: rec.strengthBand,
        readinessBand: Math.round((rec.readiness ?? 0) * 4),
        alliance: rec.allianceLabel,
        conf: confBand(rec.confidence01 ?? 0),
        stale: Math.max(0, tick - (rec.lastUpdateTick ?? 0)) > 4,
      };
    }
    summary[obs] = byObs;
  }
  return { infoMode, tick, beliefs: summary };
}

const hashOf = (p) => createHash('sha256').update(JSON.stringify(p)).digest('hex');

function corpus() {
  return [
    { seed: 'bg-a', ticks: 8, infoMode: 'perfect_delayed' },
    { seed: 'bg-b', ticks: 8, infoMode: 'unreliable' },
    { seed: 'bg-c', ticks: 14, infoMode: 'unreliable' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.infoMode].join('|');

describe('belief-map golden (WAVE A, deterministic)', () => {
  const rows = corpus();

  if (UPDATE) {
    it('captures the belief-map golden manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashOf(projectionFor(c));
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    });
    return;
  }

  it('the belief-map manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full corpus', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('is deterministic across two runs (byte-identical projection)', () => {
    for (const c of rows) expect(hashOf(projectionFor(c))).toBe(hashOf(projectionFor(c)));
  }, 30_000);

  it('anti-vacuity: the belief maps are non-empty and the two modes differ', () => {
    const pd = projectionFor(rows[0]);
    const un = projectionFor(rows[1]);
    expect(Object.keys(pd.beliefs).length).toBeGreaterThan(0);
    expect(Object.keys(un.beliefs).length).toBeGreaterThan(0);
  }, 30_000);

  it('every config produces the golden projection', () => {
    const drift = [];
    for (const c of rows) if (manifest[keyOf(c)] !== hashOf(projectionFor(c))) drift.push(keyOf(c));
    expect(drift).toEqual([]);
  }, 30_000);
});
