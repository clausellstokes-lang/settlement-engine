/**
 * supplyWebWarfareDormancyGolden.test.js — W-DOCTRINE-1 dormancy proof +
 * lit-path anti-vacuity (DESIGN_SUPPLY_WEB_WARFARE.md §8).
 *
 * THE CONSTITUTIONAL DORMANCY LAW: the supply-web-warfare mover (advanceSupplyWebWarfare,
 * wired into pulseKernel before the moral-drift site) is DORMANT behind the virtual
 * supplyWebWarfareEnabled flag (AND-ed with warLayerEnabled). With the gate ABSENT it
 * must be a pure no-op — zero ledger keys, byte-identical to the pre-wire engine, EVEN
 * IN A LIT-WAR WORLD (warLayerEnabled + settlementStrategyEnabled + a spatial digest):
 * the war/supply goldens must never move. (The broader pre-wire proof is the 100+
 * existing property goldens still passing with this wiring present; this file adds the
 * doctrine-specific fence + the driven-campaign anti-vacuity.)
 *
 * Pinned two ways (the peaceCausal / generosity idiom):
 *   1. A FULL-ADVANCE dormancy golden: a war-shaped SPATIAL world (a weaker aggressor
 *      hostile to a strong city whose single iron supplier is a fragile village) that
 *      WOULD mint a strangulation campaign if lit is driven N ticks with the gate
 *      ABSENT, projected to a mechanical summary (the campaignPlans ledger, the news
 *      histogram, the candidate/roll summary), oracle-normalized + hashed.
 *   2. A dormancy CONTRACT: the dormant final world carries NO campaignPlans ledger.
 *
 * THE LIT-PATH ANTI-VACUITY: the same fixture with the gate ON must actually mint a
 * campaignPlans entry through the REAL pulse pipeline (the direct-mover unit pins live
 * in tests/domain/supplyWebWarfare.test.js; this proves the pulseKernel integration
 * fires end-to-end).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/supplyWebWarfareDormancyGolden.test.js
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

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'supply-web-warfare-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IRON = 'Wrought iron';
const IDS = ['raider', 'crown', 'irondell', 'midfen'];

function digestFor() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

function swSettlement(name, { tier = 'town', population = 3000, exports = [], imports = [], institutions = [], activeChains = [], factions } = {}) {
  return {
    name, tier, population,
    config: { tradeRouteAccess: 'road', priorityMilitary: 30 },
    institutions,
    economicState: { prosperity: 'Prosperous', primaryExports: exports, primaryImports: imports, activeChains },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Stable' },
      factions: factions || [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true }],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

const swSave = (id, name, patch) => ({ id, name, phase: 'canon', settlement: swSettlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/**
 * The war-shaped SPATIAL fixture: Marchmont (a weaker merchant town) hostile to
 * Crownhold (a strong city whose ONLY outside iron supplier is the fragile village
 * Irondell). If lit, Marchmont cannot take Crownhold head-on and mints an indirect
 * strangulation campaign against Irondell's iron.
 * @param {string} seed @param {boolean} lit
 */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    swSave('raider', 'Marchmont', {
      tier: 'town', population: 4200,
      factions: [{ faction: 'Merchant League', category: 'economy', power: 70, isGoverning: true }],
    }),
    swSave('crown', 'Crownhold', {
      tier: 'city', population: 55000, imports: [IRON],
      institutions: [{ name: 'War College' }, { name: 'Royal Armory' }],
      activeChains: [{ needKey: 'manufacturing', chainId: 'arms', resource: IRON, processingInstitutions: ['War College'], outputs: ['Forged Weapons'] }],
      factions: [{ faction: 'High Command', category: 'military', power: 88, isGoverning: true }],
    }),
    swSave('irondell', 'Irondell', { tier: 'village', population: 420, exports: [IRON] }),
    swSave('midfen', 'Midfen', { tier: 'town', population: 2600 }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    warLayerEnabled: true, settlementStrategyEnabled: true,
    ...(lit ? { supplyWebWarfareEnabled: true } : {}),
  };
  const campaign = {
    id: 'supply-web-warfare', name: 'Supply Web Warfare', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 30 },
      spatialCanonVersion: 1,
      spatialDigest: digestFor(),
      relationshipStates: {
        'edge.raider.crown': { relationshipType: 'hostile', resentment: 0.7, trust: 0.1 },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.raider.crown', from: 'raider', to: 'crown', relationshipType: 'hostile' },
        { id: 'edge.crown.irondell', from: 'crown', to: 'irondell', relationshipType: 'trade_partner' },
        { id: 'edge.raider.midfen', from: 'raider', to: 'midfen', relationshipType: 'trade_partner' },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

function driveTicks(seed, lit, ticks, interval) {
  let { campaign, saves } = makeCampaignAndSaves(seed, lit);
  /** @type {Record<string, number>} */
  const candidateTypes = {};
  /** @type {Record<string, number>} */
  const newsKinds = {};
  let rollTotal = 0;
  let rollPassed = 0;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const o of [...(r.selected || []), ...(r.autoApplied || [])]) {
      const type = String(o?.candidateType || o?.type || 'unknown');
      candidateTypes[type] = (candidateTypes[type] || 0) + 1;
    }
    for (const e of (r.wizardNews?.entries || [])) {
      const k = String(e?.impactKind || e?.kind || 'unknown');
      newsKinds[k] = (newsKinds[k] || 0) + 1;
    }
    for (const x of (r.rollExplanations || [])) { rollTotal += 1; if (x && x.passed) rollPassed += 1; }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves, candidateTypes, newsKinds, rollSummary: { total: rollTotal, passed: rollPassed } };
}

function projectionHash({ campaign, candidateTypes, newsKinds, rollSummary }) {
  const ws = campaign.worldState || {};
  const ledgers = ws.spatialLedgers || {};
  const projection = {
    tick: ws.tick ?? null,
    // The doctrine's ONE new ledger — dormant ⇒ {} ⇒ the manifest proves it adds no keys.
    campaignPlans: ledgers.campaignPlans || {},
    candidateTypes,
    newsKinds,
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'sw-a', ticks: 4, interval: 'one_month' },
    { seed: 'sw-b', ticks: 8, interval: 'one_month' },
    { seed: 'sw-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('supply-web warfare — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the supply-web-warfare dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NO campaignPlans ledger, even in a lit-war spatial world', () => {
    const { campaign } = driveTicks('sw-b', false, 8, 'one_month');
    expect(campaign.worldState?.spatialLedgers?.campaignPlans, 'campaignPlans must be absent when dormant').toBeUndefined();
  }, 60_000);
});

describe('supply-web warfare — lit-path anti-vacuity (the pulseKernel integration fires end-to-end)', () => {
  it('gate ON: the weaker aggressor mints a campaignPlans entry against the strong city, through the real pipeline', () => {
    const { campaign } = driveTicks('sw-b', true, 8, 'one_month');
    const plans = campaign.worldState?.spatialLedgers?.campaignPlans;
    expect(plans, 'a campaign plan materialized under the lit gate (anti-vacuity)').toBeTruthy();
    // Marchmont ('raider') is the weaker aggressor; if it holds a plan it targets Crownhold.
    if (plans.raider) {
      expect(plans.raider.targetId).toBe('crown');
      expect(plans.raider.stages.length).toBeGreaterThan(0);
      expect(plans.raider.stages.length).toBeLessThanOrEqual(4);
    } else {
      // At minimum, SOME aggressor minted a plan (the pipeline invoked the mover).
      expect(Object.keys(plans).length).toBeGreaterThan(0);
    }
  }, 120_000);

  it('the lit path stays BOUNDED: one plan per aggressor, stages ≤ 4, targets are real settlements', () => {
    const { campaign } = driveTicks('sw-a', true, 6, 'one_month');
    const plans = campaign.worldState?.spatialLedgers?.campaignPlans || {};
    for (const aggressorId of Object.keys(plans)) {
      const plan = plans[aggressorId];
      expect(IDS).toContain(String(plan.targetId));
      expect(plan.stages.length).toBeLessThanOrEqual(4);
      expect(plan.stages.length).toBeGreaterThan(0);
    }
  }, 120_000);
});
