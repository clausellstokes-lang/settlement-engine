/**
 * rumorLedgerGolden.test.js — the RUMOR-LEDGER golden (Phase 5.5 STEP 3.5).
 *
 * The mirror of worldpulseSpatialGolden for the information layer: the same
 * spatial famine fixture driven through N real pulse ticks with infoMode
 * perfect_delayed / unreliable, projected to a MECHANICAL summary of the rumor
 * ledgers (per-settlement event keys, hop counts, arrival ticks, lineage
 * roots, independence counts, fidelity bands) and hashed — a drift in the
 * seeding gate, hop budget, latency law, degradation distribution, merge rule,
 * or expiry trips it.
 *
 * Inputs are fully deterministic (fixed rngSeed + fixed `now` + a frozen
 * digest that is a pure function of a fixture pack), so the hash is stable
 * across runs and machines — asserted by the two-run determinism test.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/rumorLedgerGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'rumor-ledger-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const UPDATE = process.env.UPDATE_GOLDEN === '1';

const IDS = ['a', 'b', 'c', 'd'];
const GRAIN = 'Bulk grain and foodstuffs';

function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function save(id, name, exports, imports, patch = {}) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1600,
      config: { tradeRouteAccess: 'road', priorityEconomy: 25 },
      institutions: [],
      economicState: { primaryExports: exports, primaryImports: imports },
      powerStructure: { publicLegitimacy: { score: 34, label: 'Contested' }, factions: [], conflicts: [] },
      npcs: [{ id: `n_${id}`, name: 'Reeve', importance: 'key' }],
      activeConditions: patch.activeConditions || [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

const grainChannel = (to) => ({
  id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to,
  goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed',
});

function makeCampaign(seed, infoMode) {
  return {
    id: 'rumor-golden', name: 'rumor-golden', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1,
      simulationRules: { propagationMode: 'first_order', infoMode },
      stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 }],
      spatialCanonVersion: 1,
      spatialDigest: spatialDigest(),
    },
    regionalGraph: ensureRegionalGraph({ channels: [grainChannel('b'), grainChannel('c'), grainChannel('d')] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

/** Drive N one-week ticks; project the ledgers to the mechanical summary. */
function projectionFor({ seed, ticks, infoMode }) {
  let campaign = makeCampaign(seed, infoMode);
  let saves = [
    save('a', 'Ashford', [GRAIN], [], { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] }),
    save('b', 'Briarwatch', [], [GRAIN]),
    save('c', 'Crownhold', [], [GRAIN]),
    save('d', 'Deepmoor', [], [GRAIN]),
  ];
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
  }
  /** @type {Record<string, Record<string, unknown>>} */
  const ledgerSummary = {};
  const ledgers = campaign.worldState?.rumorLedgers || {};
  for (const sid of Object.keys(ledgers).sort()) {
    /** @type {Record<string, unknown>} */
    const bySid = {};
    for (const [key, rec] of Object.entries(ledgers[sid]).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
      bySid[key] = {
        hop: rec.hopCount,
        arrival: rec.arrivalTick,
        eventTick: rec.eventTick,
        root: rec.lineageIds?.[1] ?? null,
        lineageLen: rec.lineageIds?.length ?? 0,
        independence: rec.corroborationRoots?.length ?? 0,
        // Banded fidelity (stable under tiny float-law retunes; a real
        // distribution change still moves bands).
        completenessBand: Math.round((rec.completeness01 ?? 0) * 10),
        accuracyBand: Math.round((rec.accuracy01 ?? 0) * 10),
        magnitude: rec.content?.magnitude ?? null,
        relayed: rec.relayedTick != null,
      };
    }
    ledgerSummary[sid] = bySid;
  }
  return { infoMode, tick: campaign.worldState?.tick ?? null, ledgers: ledgerSummary };
}

const hashOf = (p) => createHash('sha256').update(JSON.stringify(p)).digest('hex');

function corpus() {
  return [
    { seed: 'rl-a', ticks: 8, infoMode: 'perfect_delayed' },
    { seed: 'rl-b', ticks: 8, infoMode: 'unreliable' },
    { seed: 'rl-c', ticks: 14, infoMode: 'unreliable' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.infoMode].join('|');

describe('rumor-ledger golden (STEP 3.5, deterministic)', () => {
  const rows = corpus();

  if (UPDATE) {
    it('captures the rumor-ledger golden manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashOf(projectionFor(c));
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    });
    return;
  }

  it('the rumor-ledger manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full corpus', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('is deterministic across two runs (byte-identical projection)', () => {
    for (const c of rows) {
      expect(hashOf(projectionFor(c))).toBe(hashOf(projectionFor(c)));
    }
  }, 30_000);

  it('anti-vacuity: the ledgers are non-empty and the two modes differ', () => {
    const pd = projectionFor(rows[0]);
    const un = projectionFor(rows[1]);
    expect(Object.keys(pd.ledgers).length).toBeGreaterThan(0);
    expect(Object.keys(un.ledgers).length).toBeGreaterThan(0);
    expect(hashOf(pd)).not.toBe(hashOf(un));
  }, 30_000);

  it('every config produces the golden projection', () => {
    const drift = [];
    for (const c of rows) {
      if (manifest[keyOf(c)] !== hashOf(projectionFor(c))) drift.push(keyOf(c));
    }
    expect(drift).toEqual([]);
  }, 30_000);
});
