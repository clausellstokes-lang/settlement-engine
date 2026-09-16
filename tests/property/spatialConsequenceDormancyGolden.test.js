/**
 * spatialConsequenceDormancyGolden.test.js — DOOR 1, THE SPATIAL CONSEQUENCE LAYER
 * dormancy proof + lit anti-vacuity (owner ruling #8).
 *
 * THE CENTREPIECE (the constitutional dormancy law): the spatial-consequence reader
 * (advanceSpatialConsequence at pulseKernel's post-fabric mover seam) is DORMANT behind
 * the virtual spatialConsequenceEnabled flag. With the gate ABSENT it must be a pure
 * no-op — zero read, zero beat, zero spatialSubstrate ledger, byte-identical to the
 * pre-wire engine. (The substrate is derived at CANONIZE, outside the pulse, so a pulse
 * driven dark carries no substrate key regardless.)
 *
 * Pinned two ways (the fabric/npcGrowth golden pattern):
 *   1. A FULL-ADVANCE dormancy golden: a world driven N real pulse ticks with the gate
 *      absent, projected to a MECHANICAL summary (the spatialSubstrate ledger + the
 *      consequence-news count), ORACLE-NORMALIZED and hashed. Any drift trips it.
 *   2. A dormancy CONTRACT assertion: the dormant world carries NO spatialSubstrate
 *      ledger and emits NO spatial_consequence beat.
 *
 * THE LIT-PATH ANTI-VACUITY: a world with the gate ON, a SUBSTRATE pre-seeded (as the
 * canonize body would write it), and a FRESH calamity must actually emit the
 * WHERE-not-HOW-MUCH beat — a pin that never fires would be worthless. (The consumers'
 * full behaviour is pinned in tests/domain/spatialConsequenceKernel.test.js.)
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/spatialConsequenceDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { deriveSpatialSubstrate } from '../../src/domain/spatial/spatialSubstrate.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'spatial-consequence-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

/** A walled, recently-struck city whose consequence layer WOULD fire if lit. */
function walledCity(name) {
  return {
    name, tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade', terrainType: 'plains' },
    defenseProfile: { hasWalls: true, fortificationLevel: 'walled' },
    spatialLayout: { quarters: [
      { name: 'Temple Ward', location: 'central', category: 'religious' },
      { name: 'Merchant Row', location: 'east', category: 'merchant' },
      { name: 'The Tanneries', location: 'south', category: 'industrial' },
      { name: 'Shadow Docks', location: 'west', category: 'criminal' },
    ] },
    institutions: [
      { name: 'Grand Temple', category: 'religious', status: 'active' },
      { name: 'Town hall', required: true, category: 'civic' },
    ],
    economicState: { prosperity: 'Comfortable', primaryExports: ['leather'], incomeSources: ['Trade tariffs'] },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Accepted' }, factions: [{ name: 'Guild', isGoverning: true, power: 60 }], conflicts: [] },
    calamityHistory: [],
    npcs: [],
    activeConditions: [],
  };
}
const plainTown = (name) => ({
  name, tier: 'town', population: 1400, config: { economicBase: 'agrarian' },
  institutions: [{ name: 'Market', category: 'trade' }],
  economicState: { prosperity: 'Comfortable' },
  powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
  activeConditions: [], npcs: [],
});
const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** @param {string} seed @param {boolean} lit */
function makeCampaignAndSaves(seed, lit) {
  const city = walledCity('Ashford');
  if (lit) {
    // Canonize-body substrate + a FRESH calamity. The pulse processes tick = input+1
    // (260 → 261), and the reader reads freshness as stamp.tick === the processed tick,
    // so the stamp is stamped at 261 to read fresh on the first driven pulse.
    city.calamityHistory = [{ type: 'fire', name: 'The Calamity', year: 5, tick: 261, deaths: 300, exodus: 150, k: 1, targets: ['Tannery'] }];
  }
  const saves = [save('a', 'Ashford', city), save('b', 'Briarwatch', plainTown('Briarwatch'))];
  const simulationRules = lit
    ? { warLayerEnabled: false, spatialConsequenceEnabled: true }
    : { warLayerEnabled: false };
  /** @type {Record<string, unknown>} */
  const spatialLedgers = {};
  if (lit) spatialLedgers.spatialSubstrate = { a: deriveSpatialSubstrate(buildTownMapModel(city, null)) };
  const campaign = {
    id: 'consequence-pulse', name: 'Consequence Pulse', settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: seed, tick: 260, simulationRules,
      calendar: { elapsedWeeks: 260, year: 5 },
      stressors: [],
      ...(lit ? { spatialLedgers } : {}),
    },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }] }),
    wizardNews: { currentTick: 260, entries: [] },
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

/** The mechanical projection — everything the reader would touch/emit if lit. */
function projectionHash({ campaign, newsKinds }) {
  const ledgers = campaign.worldState?.spatialLedgers || {};
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    spatialSubstrate: ledgers.spatialSubstrate || {},
    consequenceNews: newsKinds.spatial_consequence || 0,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'consequence-a', ticks: 6, interval: 'one_week' },
    { seed: 'consequence-b', ticks: 10, interval: 'one_week' },
    { seed: 'consequence-c', ticks: 8, interval: 'one_month' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('spatial-consequence reader — dormancy golden (wired-but-dormant is byte-identical)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the spatial-consequence dormancy manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = dormantHashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    });
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
  }, 30_000);

  it('dormancy CONTRACT: the gate absent adds NO spatialSubstrate ledger and NO beat', () => {
    const { campaign, newsKinds } = driveTicks('consequence-b', false, 10, 'one_week');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.spatialSubstrate, 'spatialSubstrate ledger must be absent when dormant').toBeUndefined();
    expect(newsKinds.spatial_consequence || 0, 'no spatial_consequence beat when dormant').toBe(0);
  });
});

describe('spatial-consequence reader — lit-path anti-vacuity (the stone shapes events)', () => {
  it('gate ON + substrate + a fresh calamity ⇒ a WHERE beat reaches the Chronicle', () => {
    const lit = driveTicks('consequence-b', true, 1, 'one_week');
    expect(lit.newsKinds.spatial_consequence || 0, 'a spatial_consequence beat when lit').toBeGreaterThan(0);
  });
});
