/**
 * roadsDormancyGolden.test.js — THE ROADS dormancy proof + lit anti-vacuity
 * (ENGINE LIFT #5: named-NPC travel; DESIGN_THE_ROADS.md §16).
 *
 * THE CONSTITUTIONAL DORMANCY LAW: the roads mover (advanceRoads, composed after the
 * traditions kernel inside advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions-
 * AndRoads at pulseKernel's last per-settlement mover seam) is DORMANT behind the virtual
 * roadsEnabled flag AND the spatial-canon gate. With the gate ABSENT it must be a pure
 * no-op — zero roads ledger, zero npc.whereabouts mirror, zero roads news — byte-identical
 * to the pre-wire engine, EVEN IN A LIT-WAR SPATIAL WORLD (warLayerEnabled + a spatial
 * digest): the war/spatial goldens must never move. (The broader pre-wire proof is the
 * 100+ existing property goldens still passing with this wiring present; this file adds the
 * roads-specific fence + the driven-campaign anti-vacuity.)
 *
 * Pinned the traditions/supplyWeb way:
 *   1. A FULL-ADVANCE dormancy golden: a war-shaped SPATIAL world whose notables WOULD
 *      travel if lit, driven N real pulse ticks with the gate absent, projected to a
 *      MECHANICAL summary (the roads ledger, the whereabouts mirror count, the roads-news
 *      count), oracle-normalized + hashed. Any drift trips it.
 *   2. A dormancy CONTRACT: the dormant world carries NO 'roads' ledger, no npc.whereabouts
 *      on any save, and emits NO roads news, even lit-war.
 *
 * THE LIT-PATH ANTI-VACUITY block (§16 block c) lands with mission genesis in R-2 — it is
 * a NO-OP under the R-1 skeleton (the lit body mints nothing yet), so it is added, not
 * stubbed-red, when genesis exists (the "behavioral pins extended, never rewritten" rule).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/roadsDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'roads-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['s000', 's001', 's002', 's003'];

function digestFor() {
  const pack = makeGridPack({ cols: 8, rows: 6 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

/** A settlement carrying a court of travellable notables (real tier + a stable seed). */
function roadsSettlement(name, { tier = 'town', population = 3000, prosperity = 'Comfortable', factions, npcs } = {}) {
  return {
    name, tier, population,
    config: { tradeRouteAccess: 'road', economicBase: 'trade', terrainType: 'plains', culture: 'lowland' },
    institutions: [{ name: 'Town hall', required: true, category: 'civic', status: 'active' }, { name: 'Market', category: 'trade' }],
    economicState: { prosperity, primaryExports: [], incomeSources: ['Trade tariffs'] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Accepted' },
      factions: factions || [{ faction: 'Town Council', category: 'civic', power: 55, isGoverning: true }],
      conflicts: [],
    },
    calamityHistory: [],
    activeConditions: [],
    npcs: npcs || [
      { id: `${name}_seat`, name: `Lord ${name}`, importance: 'pillar', category: 'government', personality: { dominant: 'cautious', flaw: 'prideful' } },
      { id: `${name}_envoy`, name: `Envoy of ${name}`, importance: 'notable', category: 'government', personality: { dominant: 'bold' } },
      { id: `${name}_merchant`, name: `Factor of ${name}`, importance: 'key', category: 'economy', personality: { dominant: 'calculating', flaw: 'greedy' } },
    ],
  };
}
const save = (id, name, patch) => ({ id, name, phase: 'canon', settlement: roadsSettlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/**
 * A war-shaped SPATIAL fixture: four neighbouring towns on a compact grid; Ashford and
 * Briar are trade partners; Ashford and Corvin are rivals (a diplomacy purpose); a lit-war
 * marker (warLayerEnabled) so T1/T2 threats WOULD be live if roads ran. Notables of every
 * importance band populate the courts — genesis WOULD dispatch if lit.
 * @param {string} seed @param {boolean} lit
 */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    save('s000', 'Ashford'),
    save('s001', 'Briar'),
    save('s002', 'Corvin'),
    save('s003', 'Dunmoor'),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    warLayerEnabled: true,
    ...(lit ? { roadsEnabled: true } : {}),
  };
  const campaign = {
    id: 'roads-pulse', name: 'Roads Pulse', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 20, year: 1 },
      spatialCanonVersion: 1,
      spatialDigest: digestFor(),
      relationshipStates: {
        'edge.s000.s002': { relationshipType: 'rival', resentment: 0.55, trust: 0.24 },
      },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.s000.s001', from: 's000', to: 's001', relationshipType: 'trade_partner' },
        { id: 'edge.s000.s002', from: 's000', to: 's002', relationshipType: 'rival' },
        { id: 'edge.s001.s003', from: 's001', to: 's003', relationshipType: 'trade_partner' },
        { id: 'edge.s002.s003', from: 's002', to: 's003', relationshipType: 'trade_partner' },
      ],
      channels: [
        { from: 's000', to: 's001', type: 'trade_route', status: 'confirmed', strength: 0.6 },
        { from: 's001', to: 's003', type: 'trade_route', status: 'confirmed', strength: 0.5 },
        { from: 's002', to: 's003', type: 'trade_route', status: 'confirmed', strength: 0.5 },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** Drive N ticks; return the final { campaign, saves, newsKinds }. */
function driveTicks(seed, lit, ticks, interval) {
  let { campaign, saves } = makeCampaignAndSaves(seed, lit);
  /** @type {Record<string, number>} */
  const newsKinds = {};
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const e of (r.wizardNews?.entries || [])) {
      const k = String(e?.impactKind || e?.kind || 'unknown');
      newsKinds[k] = (newsKinds[k] || 0) + 1;
    }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves, newsKinds };
}

/** Count npc.whereabouts mirrors across every save's roster. */
function whereaboutsCount(saves) {
  let n = 0;
  for (const s of saves) for (const npc of (s.settlement?.npcs || [])) if (npc && npc.whereabouts != null) n += 1;
  return n;
}

/** The mechanical projection — everything the roads mover would touch if lit. */
function projectionHash({ campaign, saves, newsKinds }) {
  const ledgers = campaign.worldState?.spatialLedgers || {};
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    roads: ledgers.roads || {},
    whereabouts: whereaboutsCount(saves),
    roadsNews: newsKinds.roads || 0,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'roads-a', ticks: 6, interval: 'one_week' },
    { seed: 'roads-b', ticks: 10, interval: 'one_week' },
    { seed: 'roads-c', ticks: 8, interval: 'one_month' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('roads mover — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the roads dormancy manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = dormantHashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    }, 120_000);
    return;
  }

  it('the dormancy manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full dormant corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every dormant config reproduces the golden projection (any drift ⇒ dormancy broke)', () => {
    const drift = [];
    for (const c of rows) if (manifest[keyOf(c)] !== dormantHashFor(c)) drift.push(keyOf(c));
    expect(drift).toEqual([]);
  }, 120_000);

  it('dormancy CONTRACT: the gate absent adds NO roads ledger, NO whereabouts, NO roads news, even lit-war spatial', () => {
    const { campaign, saves, newsKinds } = driveTicks('roads-b', false, 10, 'one_week');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.roads, 'roads ledger must be absent when dormant').toBeUndefined();
    expect(whereaboutsCount(saves), 'no npc.whereabouts when dormant').toBe(0);
    expect(newsKinds.roads || 0, 'no roads news when dormant').toBe(0);
  }, 60_000);
});
