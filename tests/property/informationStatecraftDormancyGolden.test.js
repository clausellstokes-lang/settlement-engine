/**
 * informationStatecraftDormancyGolden.test.js — W-DOCTRINE-2 dormancy proof +
 * lit-path integration (DESIGN_INFORMATION_STATECRAFT.md §8).
 *
 * THE CONSTITUTIONAL DORMANCY LAW: the information-statecraft mover
 * (advanceInformationStatecraft, wired into pulseKernel right after advanceBeliefMaps)
 * is DORMANT behind the virtual infoStatecraftEnabled flag (AND-ed with beliefsActive —
 * a LIVE infoMode + a spatial marker). With the gate ABSENT it must be a pure no-op —
 * zero ledger keys, byte-identical to the pre-wire engine — EVEN IN A BELIEF-ACTIVE,
 * HOSTILE, war-shaped world (infoMode unreliable + warLayerEnabled + a spatial digest):
 * the belief / rumor / peace goldens must never move. (The broad pre-wire proof is the
 * belief/rumor/peace/deity tripwire goldens still passing with this wiring present; this
 * file adds the doctrine-specific fence.)
 *
 * Pinned two ways (the supplyWebWarfare / peaceCausal idiom):
 *   1. A FULL-ADVANCE dormancy golden: a belief-active hostile world (a weak, hostile
 *      neighbour that WOULD seed a garrison bluff if lit) driven N ticks with the gate
 *      ABSENT, projected to a mechanical summary (the credibility + disinfo ledgers, the
 *      news histogram, the candidate/roll summary), oracle-normalized + hashed.
 *   2. A dormancy CONTRACT: the dormant final world carries NEITHER a credibility NOR a
 *      disinfo ledger.
 *
 * (The lit-path anti-vacuity — the mover DOES seed a bluff, inflate a belief, expose it,
 * and charge credibility when lit — lives at the mover-unit level in
 * tests/domain/informationStatecraftPins.test.js; a full-kernel lie is rng-gated, so this
 * file's lit assertion is the softer integration check that beliefs still form under the
 * lit gate.)
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/informationStatecraftDormancyGolden.test.js
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

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'information-statecraft-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['raider', 'crown', 'midfen'];

function digestFor() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

function isSettlement(name, { tier = 'town', population = 3000, factions } = {}) {
  return {
    name, tier, population,
    config: { tradeRouteAccess: 'road', priorityMilitary: 30 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [], activeChains: [] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Stable' },
      factions: factions || [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true }],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

const isSave = (id, name, patch) => ({ id, name, phase: 'canon', settlement: isSettlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/**
 * A belief-active, hostile SPATIAL fixture: Marchmont (a weaker town) is mutually hostile
 * to Crownhold (a strong city). If the info-statecraft layer is lit, the weaker, hostile
 * Marchmont is a garrison-bluff candidate; with the gate absent it stays silent.
 * @param {string} seed @param {boolean} lit
 */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    isSave('raider', 'Marchmont', {
      tier: 'town', population: 4200,
      factions: [{ faction: 'Merchant League', category: 'economy', power: 70, isGoverning: true }],
    }),
    isSave('crown', 'Crownhold', {
      tier: 'city', population: 55000,
      factions: [{ faction: 'High Command', category: 'military', power: 88, isGoverning: true }],
    }),
    isSave('midfen', 'Midfen', { tier: 'town', population: 2600 }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    warLayerEnabled: true, settlementStrategyEnabled: true, infoMode: 'unreliable',
    ...(lit ? { infoStatecraftEnabled: true } : {}),
  };
  const campaign = {
    id: 'information-statecraft', name: 'Information Statecraft', settlementIds: [...IDS],
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
        { id: 'edge.raider.midfen', from: 'raider', to: 'midfen', relationshipType: 'trade_partner' },
        { id: 'edge.crown.midfen', from: 'crown', to: 'midfen', relationshipType: 'trade_route' },
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
    // The doctrine's new ledgers — dormant ⇒ {} ⇒ the manifest proves they add no keys.
    credibility: ledgers.credibility || {},
    disinfo: ledgers.disinfo || {},
    candidateTypes,
    newsKinds,
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'is-a', ticks: 4, interval: 'one_month' },
    { seed: 'is-b', ticks: 8, interval: 'one_month' },
    { seed: 'is-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('information statecraft — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the information-statecraft dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NEITHER a credibility NOR a disinfo ledger, even in a belief-active hostile world', () => {
    const { campaign } = driveTicks('is-b', false, 8, 'one_month');
    expect(campaign.worldState?.spatialLedgers?.credibility, 'credibility must be absent when dormant').toBeUndefined();
    expect(campaign.worldState?.spatialLedgers?.disinfo, 'disinfo must be absent when dormant').toBeUndefined();
  }, 60_000);
});

describe('information statecraft — lit-path integration (the pulseKernel wiring does not break belief formation)', () => {
  it('gate ON: the run completes and belief maps still form end-to-end (the mover-level lie/credibility anti-vacuity lives in the pins)', () => {
    const { campaign } = driveTicks('is-b', true, 8, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    // Beliefs still form (the info-statecraft wiring runs AFTER advanceBeliefMaps and must
    // not break it): a belief-active world holds a beliefMaps ledger.
    expect(ledgers.beliefMaps, 'belief maps still form under the lit gate').toBeTruthy();
    // If the info-statecraft ledgers materialized, they are well-shaped (bounded).
    if (ledgers.disinfo) {
      for (const k of Object.keys(ledgers.disinfo)) {
        expect(IDS).toContain(String(ledgers.disinfo[k].liarId));
        expect(IDS).toContain(String(ledgers.disinfo[k].audienceId));
      }
    }
    if (ledgers.credibility) {
      for (const k of Object.keys(ledgers.credibility)) {
        expect(typeof ledgers.credibility[k].score).toBe('number');
      }
    }
  }, 120_000);
});
