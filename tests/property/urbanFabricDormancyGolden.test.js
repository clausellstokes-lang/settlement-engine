/**
 * urbanFabricDormancyGolden.test.js — THE URBAN FABRIC LAYER dormancy proof +
 * lit anti-vacuity (owner commission #39).
 *
 * THE CENTREPIECE (the constitutional dormancy law): the fabric mover
 * (advanceUrbanFabric, composed after growth inside advanceNpcGrowthWithFabric
 * at pulseKernel's last per-settlement mover seam) is DORMANT behind the virtual
 * urbanFabricEnabled flag. With the gate ABSENT it must be a pure no-op — zero
 * deposits, zero urbanFabric ledger, zero settlement.urbanFabric mirror,
 * byte-identical to the pre-wire engine.
 *
 * Pinned two ways (the npcGrowth golden pattern):
 *   1. A FULL-ADVANCE dormancy golden: a world whose fabric WOULD move (a ruling
 *      merchant guild + a recent calamity) is driven N real pulse ticks with the
 *      gate absent, projected to a MECHANICAL summary (the urbanFabric ledger,
 *      the mirror count, the fabric-news count), ORACLE-NORMALIZED and hashed.
 *      Any drift trips it.
 *   2. A dormancy CONTRACT assertion: the dormant world carries NO 'urbanFabric'
 *      ledger and no settlement carries an urbanFabric field.
 *
 * THE LIT-PATH ANTI-VACUITY: the same fixture with the gate ON must actually run
 * the arc — the ledger populates, the mirror lands on the settlement, a district
 * class rises to dominance, and a fabric beat reaches the Chronicle. A pin that
 * never fires would be worthless.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/urbanFabricDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'urban-fabric-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

/** A guild-ruled, recently-struck town whose fabric WOULD move if lit. */
function guildTown(name) {
  return {
    name, tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road', economicBase: 'agrarian' },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },
      { name: 'Grand bazaar', category: 'trade' },
    ],
    economicState: { prosperity: 'Comfortable', primaryExports: [], primaryImports: [], incomeSources: ['Trade tariffs'] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Accepted' },
      factions: [{ name: "Merchants' Guild", isGoverning: true, power: 60 }],
      conflicts: [],
    },
    calamityHistory: [{ type: 'fire', name: 'The Great Fire of Ashford, year 4', year: 4, tick: 208, deaths: 90, exodus: 200, k: 1, targets: ['Tannery'] }],
    npcs: [{ id: `mayor_${name}`, name: `Mayor ${name}`, role: 'Mayor', importance: 'pillar', personality: { dominant: 'brave', flaw: 'reckless', modifier: 'proud' } }],
    activeConditions: [],
  };
}
const plainTown = (name) => ({
  name, tier: 'town', population: 1400, config: { economicBase: 'agrarian' },
  institutions: [{ name: 'Market', category: 'trade' }],
  economicState: { prosperity: 'Comfortable', primaryExports: [], primaryImports: [] },
  powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
  activeConditions: [], npcs: [],
});

const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** @param {string} seed @param {boolean} lit */
function makeCampaignAndSaves(seed, lit) {
  const saves = [save('a', 'Ashford', guildTown('Ashford')), save('b', 'Briarwatch', plainTown('Briarwatch'))];
  const simulationRules = lit
    ? { warLayerEnabled: false, urbanFabricEnabled: true }
    : { warLayerEnabled: false };
  const campaign = {
    id: 'fabric-pulse', name: 'Fabric Pulse', settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: seed, tick: 260, simulationRules,
      calendar: { elapsedWeeks: 260, year: 5 },
      stressors: [],
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

/** Count settlement.urbanFabric mirrors across every save. */
function mirrorCount(saves) {
  let n = 0;
  for (const s of saves) if (s.settlement?.urbanFabric != null) n += 1;
  return n;
}

/** The mechanical projection — everything the fabric mover would touch if lit. */
function projectionHash({ campaign, saves, newsKinds }) {
  const ledgers = campaign.worldState?.spatialLedgers || {};
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    urbanFabric: ledgers.urbanFabric || {},
    mirrors: mirrorCount(saves),
    fabricNews: newsKinds.urban_fabric || 0,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'fabric-a', ticks: 6, interval: 'one_week' },
    { seed: 'fabric-b', ticks: 10, interval: 'one_week' },
    { seed: 'fabric-c', ticks: 8, interval: 'one_month' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('fabric mover — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the fabric dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NO urbanFabric ledger and NO mirror', () => {
    const { campaign, saves } = driveTicks('fabric-b', false, 10, 'one_week');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.urbanFabric, 'urbanFabric ledger must be absent when dormant').toBeUndefined();
    expect(mirrorCount(saves), 'no settlement.urbanFabric when dormant').toBe(0);
  });
});

describe('fabric mover — lit-path anti-vacuity (stone answers, slowly) [soak seed]', () => {
  it('gate ON: the ledger populates, the mirror lands, a quarter rises, a beat reaches the Chronicle', () => {
    // Monthly advances so the masonry clock actually accumulates (24 months).
    const lit = driveTicks('fabric-b', true, 24, 'one_month');
    const ledger = lit.campaign.worldState?.spatialLedgers?.urbanFabric;
    expect(ledger && Object.keys(ledger).length, 'the urbanFabric ledger populates when lit').toBeGreaterThan(0);
    // The guild-ruled town's merchant quarter accumulated prominence…
    const recA = ledger?.a;
    expect(recA?.stocks?.merchant?.v, 'the ruling guild deposits merchant fabric').toBeGreaterThan(0);
    // …the read-model mirror landed on the settlement…
    const ashford = lit.saves.find((s) => s.id === 'a')?.settlement;
    expect(ashford?.urbanFabric?.stocks?.merchant, 'the mirror carries the merchant stock').toBeGreaterThan(0);
    expect(typeof ashford?.urbanFabric?.drift, 'the drift scalar rides the mirror').toBe('number');
    // …and a fabric beat reached the Chronicle (the rise of the merchant quarter).
    expect(lit.newsKinds.urban_fabric || 0, 'a fabric beat when lit').toBeGreaterThan(0);
  }, 60_000);
});
