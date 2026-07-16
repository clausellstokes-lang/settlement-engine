/**
 * settlementLifecycleDormancyGolden.test.js — W-LIFECYCLE dormancy proof + lit anti-vacuity.
 *
 * THE CENTREPIECE (the constitutional dormancy law): the settlement-lifecycle
 * layer (advanceSettlementLifecycle at the pulse mover seam + the stage-2
 * candidate evaluator) is DORMANT behind the virtual `settlementLifecycleEnabled`
 * flag. With the gate ABSENT it is a pure no-op — no `satellites` ledger key, no
 * peakTier writes, no lifecycleStatus, no steading_tributary condition, zero
 * candidates, zero forks — byte-identical to the pre-wire engine.
 *
 * FENCED PRE-WIRE (the design §4 dormancy pin, aspatial AND spatial): the
 * manifest was captured BEFORE the pulseKernel wiring landed, so the
 * wired-but-dormant engine must reproduce the pre-wire projection byte-for-byte.
 *
 * THE LIT-PATH ANTI-VACUITY: with the gate ON, a prosperous booming town whose
 * seeding integrator is primed founds a satellite steading — the lane actually
 * fires. A pin that never fired would be worthless.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/settlementLifecycleDormancyGolden.test.js
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

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'settlement-lifecycle-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

const IDS = ['a', 'b', 'c'];

/** A prosperous BOOMING town — the satellite lane WOULD arm here if lit. */
function boomTown(name) {
  return {
    name, tier: 'town', population: 4800, culture: 'germanic',
    config: {
      terrainType: 'plains', tradeRouteAccess: 'crossroads', tier: 'town', settType: 'town',
      nearbyResources: ['grain_fields', 'iron_deposits'],
    },
    tradeRoute: 'crossroads',
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },
      { name: 'Market', category: 'trade' },
    ],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 62 }, factions: [], conflicts: [] },
    activeConditions: [{
      id: 'condition.boom.fixture', archetype: 'boom', label: 'Boom', severity: 0.4,
      affectedSystems: ['public_legitimacy', 'trade_connectivity'],
      description: 'A trade boom.',
    }],
    npcs: [],
  };
}
/** A struggling THORP — the stage-2 terminal-decline dwell WOULD arm here if lit. */
function failingThorp(name) {
  return {
    name, tier: 'thorp', population: 11, culture: 'germanic',
    config: { terrainType: 'hills', tradeRouteAccess: 'road', tier: 'thorp', settType: 'thorp', peakTier: 'city' },
    tradeRoute: 'road',
    institutions: [],
    economicState: { prosperity: 'Struggling', primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 18 }, factions: [], conflicts: [] },
    activeConditions: [], npcs: [],
  };
}
/** A quiet village (control). */
const quietVillage = (name) => ({
  name, tier: 'village', population: 600, culture: 'germanic',
  config: { terrainType: 'plains', tradeRouteAccess: 'road', tier: 'village', settType: 'village' },
  tradeRoute: 'road',
  institutions: [{ name: 'Shrine', category: 'religious' }],
  economicState: { prosperity: 'Moderate', primaryExports: [], primaryImports: [] },
  powerStructure: { publicLegitimacy: { score: 45 }, factions: [], conflicts: [] },
  activeConditions: [], npcs: [],
});

const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** The frozen digest whose settlement ids are the campaign's node ids (a..c). */
function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  const placements = placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

/** @param {string} seed @param {boolean} lit @param {boolean} spatial @param {object} [seedLedgers] */
function makeCampaignAndSaves(seed, lit, spatial, seedLedgers) {
  const saves = [
    save('a', 'Ashford', boomTown('Ashford')),
    save('b', 'Briarwatch', failingThorp('Briarwatch')),
    save('c', 'Cindervale', quietVillage('Cindervale')),
  ];
  const simulationRules = lit
    ? { warLayerEnabled: false, settlementLifecycleEnabled: true }
    : { warLayerEnabled: false };
  const campaign = {
    id: 'lc-pulse', name: 'Lifecycle Pulse', settlementIds: IDS,
    worldState: {
      rngSeed: seed, tick: 260, simulationRules,
      calendar: { elapsedWeeks: 260, year: 5 },
      stressors: [],
      ...(spatial ? { spatialCanonVersion: 1, spatialDigest: spatialDigest() } : {}),
      ...(seedLedgers ? { spatialLedgers: seedLedgers } : {}),
    },
    regionalGraph: ensureRegionalGraph({ edges: [
      { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
      { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'trade_partner' },
    ] }),
    wizardNews: { currentTick: 260, entries: [] },
  };
  return { campaign, saves };
}

/** Drive N ticks; return { campaign, saves, candidateTypes }. */
function driveTicks(seed, lit, spatial, ticks, interval, seedLedgers) {
  let { campaign, saves } = makeCampaignAndSaves(seed, lit, spatial, seedLedgers);
  /** @type {Record<string, number>} */
  const candidateTypes = {};
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const c of (r.candidates || [])) {
      const k = String(c?.candidateType || 'unknown');
      candidateTypes[k] = (candidateTypes[k] || 0) + 1;
    }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves, candidateTypes };
}

/** Count lifecycle-owned conditions across saves (steading_tributary). */
function lifecycleConditionCount(saves) {
  let n = 0;
  for (const s of saves) for (const c of (s.settlement?.activeConditions || [])) {
    if (c?.archetype === 'steading_tributary') n += 1;
  }
  return n;
}

/** The mechanical projection — everything the lifecycle layer would touch. */
function projectionHash({ campaign, saves }) {
  /** @type {Record<string, unknown>} */
  const perSave = {};
  for (const s of saves) {
    perSave[s.id] = {
      // peakTier: the fixture thorp CARRIES one from generation; the projection
      // pins that the dormant engine neither adds one elsewhere nor moves it.
      peakTier: s.settlement?.config?.peakTier ?? null,
      lifecycleStatus: s.settlement?.lifecycleStatus ?? s.settlement?.config?.lifecycleStatus ?? null,
      population: s.settlement?.population ?? null,
      tier: s.settlement?.tier ?? null,
    };
  }
  const tickStates = campaign.worldState?.settlementTickStates || {};
  /** @type {Record<string, unknown>} */
  const lifecycleTickStates = {};
  for (const [cid, st] of Object.entries(tickStates)) {
    if (st && st.settlementLifecycle) lifecycleTickStates[cid] = st.settlementLifecycle;
  }
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    satellites: campaign.worldState?.spatialLedgers?.satellites ?? null,
    lifecycleTickStates,
    perSave,
    lifecycleConditions: lifecycleConditionCount(saves),
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'lc-a', spatial: false, ticks: 4, interval: 'one_month' },
    { seed: 'lc-b', spatial: false, ticks: 8, interval: 'one_month' },
    { seed: 'lc-c', spatial: false, ticks: 6, interval: 'one_week' },
    { seed: 'lc-sa', spatial: true, ticks: 4, interval: 'one_month' },
    { seed: 'lc-sb', spatial: true, ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.spatial ? 'spatial' : 'aspatial', c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.spatial, c.ticks, c.interval)).hash;

describe('settlement-lifecycle — dormancy golden (wired-but-dormant is byte-identical, aspatial + spatial)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the settlement-lifecycle dormancy manifest', () => {
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
  }, 60_000);

  it('dormancy CONTRACT: the gate absent adds NO satellites key, NO lifecycle tick-state, NO tributary condition, NO peakTier materialization', () => {
    const { campaign, saves, candidateTypes } = driveTicks('lc-b', false, false, 8, 'one_month');
    expect(campaign.worldState?.spatialLedgers?.satellites, 'no satellites ledger when dormant').toBeUndefined();
    const tickStates = campaign.worldState?.settlementTickStates || {};
    for (const st of Object.values(tickStates)) {
      expect(st?.settlementLifecycle, 'no settlementLifecycle tick-state when dormant').toBeUndefined();
    }
    expect(lifecycleConditionCount(saves), 'no steading_tributary when dormant').toBe(0);
    // peakTier: only the fixture's own generation-time stamp survives; nobody GAINS one.
    expect(saves.find((s) => s.id === 'a')?.settlement?.config?.peakTier).toBeUndefined();
    expect(saves.find((s) => s.id === 'c')?.settlement?.config?.peakTier).toBeUndefined();
    for (const k of Object.keys(candidateTypes)) {
      expect(k.startsWith('settlement_terminal_death') || k.startsWith('settlement_resettled'), `no lifecycle candidate when dormant (saw ${k})`).toBe(false);
    }
  });
});

describe('settlement-lifecycle — lit-path anti-vacuity (the satellite lane actually fires)', () => {
  it('gate ON: a primed booming town founds a satellite steading (conserved: the parent is debited)', () => {
    // Seed the seeding integrator near the floor so the first lit pulse arms it
    // (the accumulator idiom — years-scale organically, primed here for the pin).
    const seedLedgers = { satellites: { a: { seedAcc: 0.75, steadings: {} } } };
    const before = 4800;
    const { campaign, saves } = driveTicks('lc-lit', true, false, 2, 'one_week', seedLedgers);
    const sats = campaign.worldState?.spatialLedgers?.satellites?.a?.steadings || {};
    const ids = Object.keys(sats);
    expect(ids.length, 'the lane founded a steading when lit').toBeGreaterThan(0);
    const rec = sats[ids[0]];
    expect(rec.tier).toBe('thorp');
    expect(rec.population).toBeGreaterThan(0);
    expect(rec.parentId).toBe('a');
    expect(typeof rec.name).toBe('string');
    // CONSERVATION AT BIRTH: every settler in orbit came out of the parent.
    const parentPop = saves.find((s) => s.id === 'a')?.settlement?.population ?? 0;
    const orbitPop = Object.values(sats).reduce((s, r) => s + (r.population || 0), 0);
    // The parent also moves under organic populationDynamics; assert the founding
    // DEBIT is visible in its populationHistory receipt (exactness is pinned at the
    // kernel level in settlementLifecycleKernel.test.js).
    const history = saves.find((s) => s.id === 'a')?.settlement?.populationHistory || [];
    const foundingReceipt = history.find((e) => String(e.outcomeId || '').startsWith('lifecycle.found.'));
    expect(foundingReceipt, 'the parent carries the founding debit receipt').toBeTruthy();
    expect(foundingReceipt.delta).toBeLessThan(0);
    // Post-founding growth is parent→steading transfers, so the orbit only ever
    // holds people the parent gave up (founding debit + receipted grow transfers).
    expect(orbitPop).toBeGreaterThanOrEqual(-foundingReceipt.delta);
    const growReceipts = history.filter((e) => String(e.outcomeId || '').startsWith('lifecycle.grow.'));
    const transferred = -foundingReceipt.delta + growReceipts.reduce((s, e) => s - e.delta, 0);
    expect(orbitPop).toBe(transferred);
    expect(parentPop).toBeLessThan(before);
  }, 30_000);
});
