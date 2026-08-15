/**
 * intelTradeDormancyGolden.test.js — the deep-couplings D-3 dormancy proof.
 *
 * THE CONSTITUTIONAL DORMANCY LAW: the intel sell/gift lane is DORMANT behind the virtual
 * intelTradeEnabled flag. With the gate ABSENT it must be a pure no-op — zero ledger keys,
 * zero news — EVEN IN A FULLY-LIT SUBSTRATE (beliefs + info-statecraft + constructive flows
 * all on, bonded + trade edges present — a world that WOULD trade intelligence if lit). The
 * generosity + statecraft dormancy goldens fence their own surfaces; this file fences the
 * intel-specific ledgers (intelTransfers + intelCooldown) + the intel_transfer news kind.
 *
 * Pinned two ways (the generosity/statecraft dormancy idiom):
 *   1. A FULL-ADVANCE dormancy golden: a belief-active world (bonded + trade allies) driven N
 *      ticks with the intel gate ABSENT, projected to a mechanical summary (the two intel
 *      ledgers, the news histogram, the roll summary), oracle-normalized + hashed.
 *   2. A dormancy CONTRACT: the dormant final world carries NEITHER intel ledger and NO
 *      intel_transfer beat, even with beliefs + statecraft + constructive flows all lit.
 *
 * (The lit-path anti-vacuity — the gift deposits + injects a belief, the sale mints a
 * consideration — is the deterministic mover-level walkthrough in tests/domain/intelActs.test.js;
 * a full-kernel transfer is trigger + cadence gated, so this file's lit assertion is the softer
 * integration check that the substrate still forms under the lit gate.)
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/intelTradeDormancyGolden.test.js
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

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'intel-trade-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['harbor', 'crown', 'midfen'];

function digestFor() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

function itSettlement(name, { tier = 'town', population = 3000, factions } = {}) {
  return {
    name, tier, population,
    config: { tradeRouteAccess: 'road', economicBase: 'agrarian' },
    institutions: [],
    economicState: { prosperity: 'Prosperous', economicBase: 'agrarian', foodSecurity: { storageMonths: 7, deficitPct: 0, surplusPct: 15 }, primaryExports: [], primaryImports: [], activeChains: [] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Stable' },
      factions: factions || [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true }],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}
const itSave = (id, name, patch) => ({ id, name, phase: 'canon', settlement: itSettlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/**
 * A belief-active, allied SPATIAL fixture: Harbor is allied to Crownhold and a trade-partner of
 * Midfen — the substrate an intel gift/sale would ride. With the intel gate absent it stays silent.
 * @param {string} seed @param {boolean} lit
 */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    itSave('harbor', 'Harbor', { tier: 'town', population: 4200 }),
    itSave('crown', 'Crownhold', { tier: 'city', population: 40000 }),
    itSave('midfen', 'Midfen', { tier: 'town', population: 2600 }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    warLayerEnabled: false, infoMode: 'unreliable',
    infoStatecraftEnabled: true, constructiveFlowsEnabled: true,
    ...(lit ? { intelTradeEnabled: true } : {}),
  };
  const campaign = {
    id: 'intel-trade', name: 'Intel Trade', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 30 },
      spatialCanonVersion: 1,
      spatialDigest: digestFor(),
      relationshipStates: {
        'edge.harbor.crown': { relationshipType: 'allied', trust: 0.8, pactStrength: 0.7 },
        'edge.harbor.midfen': { relationshipType: 'trade_partner', trust: 0.6, pactStrength: 0.5 },
        'edge.crown.midfen': { relationshipType: 'allied', trust: 0.7, pactStrength: 0.6 },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.harbor.crown', from: 'harbor', to: 'crown', relationshipType: 'allied' },
        { id: 'edge.harbor.midfen', from: 'harbor', to: 'midfen', relationshipType: 'trade_partner' },
        { id: 'edge.crown.midfen', from: 'crown', to: 'midfen', relationshipType: 'allied' },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

function driveTicks(seed, lit, ticks, interval) {
  let { campaign, saves } = makeCampaignAndSaves(seed, lit);
  /** @type {Record<string, number>} */
  const newsKinds = {};
  let rollTotal = 0;
  let rollPassed = 0;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const e of (r.wizardNews?.entries || [])) {
      const k = String(e?.impactKind || e?.kind || 'unknown');
      newsKinds[k] = (newsKinds[k] || 0) + 1;
    }
    for (const x of (r.rollExplanations || [])) { rollTotal += 1; if (x && x.passed) rollPassed += 1; }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves, newsKinds, rollSummary: { total: rollTotal, passed: rollPassed } };
}

function projectionHash({ campaign, newsKinds, rollSummary }) {
  const ws = campaign.worldState || {};
  const ledgers = ws.spatialLedgers || {};
  const projection = {
    tick: ws.tick ?? null,
    // The D-3 ledgers — dormant ⇒ {} ⇒ the manifest proves they add no keys.
    intelTransfers: ledgers.intelTransfers || {},
    intelCooldown: ledgers.intelCooldown || {},
    intelNews: newsKinds.intel_transfer || 0,
    newsKinds,
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'it-a', ticks: 4, interval: 'one_month' },
    { seed: 'it-b', ticks: 8, interval: 'one_month' },
    { seed: 'it-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('intel trade — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the intel-trade dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NEITHER intel ledger and NO intel beat, even in a lit substrate', () => {
    const { campaign, newsKinds } = driveTicks('it-b', false, 8, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.intelTransfers, 'intelTransfers must be absent when dormant').toBeUndefined();
    expect(ledgers.intelCooldown, 'intelCooldown must be absent when dormant').toBeUndefined();
    expect(newsKinds.intel_transfer || 0, 'no intel_transfer beat when dormant').toBe(0);
  }, 60_000);
});

describe('intel trade — lit-path integration (the wiring does not break the substrate)', () => {
  it('gate ON: the run completes and belief maps still form (the hard deposit/consume proof lives in tests/domain/intelActs.test.js)', () => {
    const { campaign } = driveTicks('it-b', true, 8, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.beliefMaps, 'belief maps still form under the lit intel gate').toBeTruthy();
    // If intel transfers materialized, they are well-shaped (bounded to the fixture's ids).
    for (const rec of Object.values(ledgers.intelTransfers || {})) {
      expect(IDS).toContain(String(rec.sellerId));
      expect(IDS).toContain(String(rec.receiverId));
      expect(['gift', 'sale']).toContain(String(rec.mode));
    }
  }, 120_000);
});
