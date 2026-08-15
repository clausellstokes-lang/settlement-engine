/**
 * resourceDynamicsDormancyGolden.test.js — W-DISCOVERY dormancy proof + lit anti-vacuity.
 *
 * THE CENTREPIECE (the constitutional dormancy law): the resource-dynamics mover
 * (evaluateResourceDynamics, wired into pulseKernel on the tierResourceDynamics
 * candidate lane) is DORMANT behind the virtual `resourceDynamicsEnabled` flag.
 * With the gate ABSENT it is a pure no-op — zero candidates, zero settlementTickStates
 * keys, zero forks, byte-identical to the pre-wire engine.
 *
 * Pinned two ways:
 *   1. A FULL-ADVANCE dormancy golden: a world whose settlement WOULD churn its
 *      roster if lit (a long-depleted nonrenewable + a discovery-primed plains town)
 *      is driven N real pulse ticks with the gate absent, projected to a MECHANICAL
 *      summary (per-settlement resourceDynamics tick-state, roster membership,
 *      resourceEdits, and the resource_strike/vein_exhausted condition counts),
 *      oracle-normalized + hashed. The mover early-returns worldState UNCHANGED when
 *      dark, so the wired-but-dormant engine reproduces the pristine projection.
 *   2. A dormancy CONTRACT: the gate absent adds NO resourceDynamics tick-state key
 *      and NO resource_strike/vein_exhausted condition.
 *
 * THE LIT-PATH ANTI-VACUITY: with the gate ON, a nonrenewable that has DWELLED
 * depleted past REMOVAL_DWELL (seeded via settlementTickStates.depletedSince at a
 * high tick) mints a `resource_removal` candidate — the mover actually fires. A pin
 * that never fired would be worthless.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/resourceDynamicsDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';
import { RESOURCE_DYNAMICS_TUNING } from '../../src/domain/worldPulse/resourceDynamicsKernel.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'resource-dynamics-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

/** A mining town whose nonrenewable is already worked to depletion (removal-primed if lit). */
function miningTown(name) {
  return {
    name, tier: 'town', population: 1600,
    config: {
      terrainType: 'mountain', tradeRouteAccess: 'road',
      nearbyResources: ['iron_deposits', 'stone_quarry', 'alpine_pasture'],
      nearbyResourcesDepleted: ['iron_deposits'],
    },
    tradeRoute: 'road',
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },
      { name: 'Iron mine', category: 'industry' },
      { name: 'Blacksmith', category: 'crafts' },
    ],
    economicState: { prosperity: 'Comfortable', primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 48 }, factions: [], conflicts: [] },
    activeConditions: [], npcs: [],
  };
}
/** A plains town with a thin roster (discovery-primed if lit + prosperous pressure). */
const plainsTown = (name) => ({
  name, tier: 'town', population: 1400,
  config: { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: ['grain_fields'] },
  tradeRoute: 'road',
  institutions: [{ name: 'Market', category: 'trade' }, { name: 'Quarry', category: 'industry' }],
  economicState: { prosperity: 'Comfortable', primaryExports: [], primaryImports: [] },
  powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
  activeConditions: [], npcs: [],
});

const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** @param {string} seed @param {boolean} lit @param {object} [seedTickStates] */
function makeCampaignAndSaves(seed, lit, seedTickStates) {
  const saves = [save('a', 'Ashford', miningTown('Ashford')), save('b', 'Briarwatch', plainsTown('Briarwatch'))];
  const simulationRules = lit
    ? { warLayerEnabled: false, resourceDynamicsEnabled: true }
    : { warLayerEnabled: false };
  const campaign = {
    id: 'rd-pulse', name: 'Resource Dynamics Pulse', settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: seed, tick: 260, simulationRules,
      calendar: { elapsedWeeks: 260, year: 5 },
      stressors: [],
      ...(seedTickStates ? { settlementTickStates: seedTickStates } : {}),
    },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }] }),
    wizardNews: { currentTick: 260, entries: [] },
  };
  return { campaign, saves };
}

/** Drive N ticks; return { campaign, saves, candidateTypes }. */
function driveTicks(seed, lit, ticks, interval, seedTickStates) {
  let { campaign, saves } = makeCampaignAndSaves(seed, lit, seedTickStates);
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

/** Count active resource-dynamics conditions across saves. */
function resourceConditionCount(saves) {
  let n = 0;
  for (const s of saves) for (const c of (s.settlement?.activeConditions || [])) {
    if (c?.archetype === 'resource_strike' || c?.archetype === 'vein_exhausted') n += 1;
  }
  return n;
}

/** The mechanical projection — everything the resource-dynamics mover would touch. */
function projectionHash({ campaign, saves }) {
  /** @type {Record<string, any>} */
  const rosters = {};
  /** @type {Record<string, any>} */
  const edits = {};
  for (const s of saves) {
    rosters[s.id] = (s.settlement?.config?.nearbyResources || []).slice().sort();
    edits[s.id] = s.settlement?.config?.resourceEdits || null;
  }
  const tickStates = campaign.worldState?.settlementTickStates || {};
  const resourceDyn = {};
  for (const [cid, st] of Object.entries(tickStates)) {
    if (st && st.resourceDynamics) resourceDyn[cid] = st.resourceDynamics;
  }
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    resourceDyn,
    rosters,
    edits,
    resourceConditions: resourceConditionCount(saves),
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'rd-a', ticks: 4, interval: 'one_month' },
    { seed: 'rd-b', ticks: 8, interval: 'one_month' },
    { seed: 'rd-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('resource-dynamics mover — dormancy golden (wired-but-dormant is byte-identical)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the resource-dynamics dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NO resourceDynamics tick-state key + NO resource conditions', () => {
    const { campaign, saves } = driveTicks('rd-b', false, 8, 'one_month');
    const tickStates = campaign.worldState?.settlementTickStates || {};
    for (const st of Object.values(tickStates)) {
      expect(st?.resourceDynamics, 'no resourceDynamics tick-state when dormant').toBeUndefined();
    }
    expect(resourceConditionCount(saves), 'no resource_strike/vein_exhausted when dormant').toBe(0);
  });
});

describe('resource-dynamics mover — lit-path anti-vacuity (the mover actually fires)', () => {
  it('gate ON: a nonrenewable dwelled past REMOVAL_DWELL mints a resource_removal candidate', () => {
    // Seed the depletion stamp far in the past so the very first lit pulse meets the
    // dwell wall (tick 260 − since 0 = 260 ≥ REMOVAL_DWELL).
    const since = 260 - RESOURCE_DYNAMICS_TUNING.REMOVAL_DWELL - 4;
    const seedTickStates = { a: { resourceDynamics: { depletedSince: { iron_deposits: since } } } };
    const { candidateTypes } = driveTicks('rd-lit', true, 1, 'one_week', seedTickStates);
    expect(candidateTypes.resource_removal || 0, 'the mover minted a resource_removal when lit').toBeGreaterThan(0);
  }, 30_000);
});
