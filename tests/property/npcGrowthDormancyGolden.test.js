/**
 * npcGrowthDormancyGolden.test.js — THE GROWTH LAYER dormancy proof + lit anti-vacuity.
 *
 * THE CENTREPIECE (the constitutional dormancy law): the growth mover (advanceNpcGrowth,
 * wired into pulseKernel after the per-settlement movers) is DORMANT behind the virtual
 * npcGrowthEnabled flag. With the gate ABSENT it must be a pure no-op — zero deposits, zero
 * npcGrowth ledger, zero acquiredTraits mirror, byte-identical to the pre-wire engine (the
 * overlay extractors return [] when no acquiredTraits field exists).
 *
 * Pinned two ways:
 *   1. A FULL-ADVANCE dormancy golden: a world whose steward WOULD grow cautious (a recent
 *      calamity) is driven N real pulse ticks with the gate absent, projected to a MECHANICAL
 *      summary (the npcGrowth ledger, the acquiredTraits histogram, the growth-news count),
 *      ORACLE-NORMALIZED and hashed. Any drift trips it.
 *   2. A dormancy CONTRACT assertion: the dormant world carries NO 'npcGrowth' ledger and no
 *      NPC carries an acquiredTraits field.
 *
 * THE LIT-PATH ANTI-VACUITY: the same fixture with the gate ON must actually run the arc —
 * the npcGrowth ledger populates, a steward grows cautious (mirrored onto the roster), and a
 * growth beat reaches the Chronicle. A pin that never fires would be worthless.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/npcGrowthDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'npc-growth-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

/** A struck town whose Mayor (a civic office-holder) WOULD grow cautious if lit. */
function struckTown(name) {
  return {
    name, tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road', economicBase: 'agrarian' },
    institutions: [{ name: 'Town hall', required: true, category: 'civic' }],
    economicState: { prosperity: 'Comfortable', primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 45, label: 'Contested' }, factions: [], conflicts: [] },
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
  const saves = [save('a', 'Ashford', struckTown('Ashford')), save('b', 'Briarwatch', plainTown('Briarwatch'))];
  const simulationRules = lit
    ? { warLayerEnabled: false, npcGrowthEnabled: true }
    : { warLayerEnabled: false };
  const campaign = {
    id: 'growth-pulse', name: 'Growth Pulse', settlementIds: ['a', 'b'],
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

/** Count acquiredTraits across every NPC in every save. */
function acquiredCount(saves) {
  let n = 0;
  for (const s of saves) for (const npc of (s.settlement?.npcs || [])) n += (Array.isArray(npc?.acquiredTraits) ? npc.acquiredTraits.length : 0);
  return n;
}

/** The mechanical projection — everything the growth mover would touch if lit. */
function projectionHash({ campaign, saves, newsKinds }) {
  const ledgers = campaign.worldState?.spatialLedgers || {};
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    npcGrowth: ledgers.npcGrowth || {},
    acquiredTraits: acquiredCount(saves),
    growthNews: newsKinds.npc_growth || 0,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'grow-a', ticks: 6, interval: 'one_week' },
    { seed: 'grow-b', ticks: 10, interval: 'one_week' },
    { seed: 'grow-c', ticks: 8, interval: 'one_month' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('growth mover — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the growth dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NO npcGrowth ledger and NO acquiredTraits', () => {
    const { campaign, saves } = driveTicks('grow-b', false, 10, 'one_week');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.npcGrowth, 'npcGrowth ledger must be absent when dormant').toBeUndefined();
    expect(acquiredCount(saves), 'no acquiredTraits when dormant').toBe(0);
  });
});

describe('growth mover — lit-path anti-vacuity (a person weathers into a trait) [soak seed]', () => {
  it('gate ON: the growth arc runs — the ledger populates, a steward grows cautious, a beat reaches the Chronicle', () => {
    const lit = driveTicks('grow-b', true, 24, 'one_week');
    const ledger = lit.campaign.worldState?.spatialLedgers?.npcGrowth;
    expect(ledger && Object.keys(ledger).length, 'the npcGrowth ledger populates when lit').toBeGreaterThan(0);
    // a steward carries an acquired `cautious` (mirrored onto the roster)
    const mayor = lit.saves.find((s) => s.id === 'a')?.settlement?.npcs?.find((n) => n.role === 'Mayor');
    expect(Array.isArray(mayor?.acquiredTraits) && mayor.acquiredTraits.some((a) => a.trait === 'cautious'), 'the mayor grew cautious').toBe(true);
    // a growth beat reached the Chronicle
    expect(lit.newsKinds.npc_growth || 0, 'a growth beat when lit').toBeGreaterThan(0);
  }, 30_000);
});
