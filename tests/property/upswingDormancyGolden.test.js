/**
 * upswingDormancyGolden.test.js — the W-UPSWING dormancy proof + lit-path anti-vacuity.
 *
 * THE CENTREPIECE (design §6, the constitutional dormancy law): the upswing mover
 * (advanceUpswing, wired into pulseKernel at the constructive-flow seam) is DORMANT
 * behind the virtual upswingArcsEnabled flag. With the gate ABSENT it must be a pure
 * no-op — zero forks, zero ledger keys, byte-identical to the pre-wire engine.
 *
 * Pinned two ways:
 *   1. A FULL-ADVANCE dormancy golden: a world whose settlement WOULD reconstruct (a
 *      recent calamity stamp) is driven N real pulse ticks with the gate absent,
 *      projected to a MECHANICAL summary (the upswing ledger, reconstruction-condition
 *      counts, legitimacy scores, reconstruction-news histogram), ORACLE-NORMALIZED and
 *      hashed. The manifest was captured BEFORE the pulseKernel wiring landed (the mover
 *      existed but was unimported ⇒ the pristine pre-wire engine); it holding AFTER the
 *      wiring proves the wired-but-dormant mover is byte-identical. Any drift trips it.
 *   2. A dormancy CONTRACT assertion: the dormant world carries NO 'upswing' ledger.
 *
 * THE LIT-PATH ANTI-VACUITY (design B1 — "an upswing that plants a story"): the same
 * fixture with the gate ON must actually run the arc — the upswing ledger populates,
 * the reconstruction condition mints, and (given enough ticks) the arc completes with a
 * legitimacy dividend + a history beat. A pin that never fires would be worthless.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/upswingDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../domain/religionDormancy.byteIdentity.test.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'upswing-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

/** A struck town with a RECENT calamity stamp + a builder roster (rebuilds if lit). */
function struckTown(name) {
  return {
    name, tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road', economicBase: 'agrarian' },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },
      { name: 'Carpenter', category: 'crafts' },
      { name: 'Blacksmith', category: 'crafts' },
      { name: "Wizard's tower", category: 'magic' },
    ],
    economicState: { prosperity: 'Comfortable', primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 45, label: 'Contested' }, factions: [], conflicts: [] },
    calamityHistory: [{ type: 'fire', name: 'The Great Calamity of Ashford, year 4', year: 4, tick: 208, deaths: 90, exodus: 200, k: 1, targets: ['Tannery'] }],
    npcs: [{ id: `steward_${name}`, name: `Steward ${name}`, importance: 'key' }],
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
    ? { warLayerEnabled: false, upswingArcsEnabled: true }
    : { warLayerEnabled: false };
  const campaign = {
    id: 'up-pulse', name: 'Upswing Pulse', settlementIds: ['a', 'b'],
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

/** Count active reconstruction conditions across saves. */
function reconConditionCount(saves) {
  let n = 0;
  for (const s of saves) for (const c of (s.settlement?.activeConditions || [])) if (c?.archetype === 'reconstruction') n += 1;
  return n;
}

/** The mechanical projection — everything the upswing mover would touch if lit. */
function projectionHash({ campaign, saves, newsKinds }) {
  /** @type {Record<string, number|null>} */
  const legitimacy = {};
  for (const s of saves) {
    const sc = Number(s.settlement?.powerStructure?.publicLegitimacy?.score);
    legitimacy[s.id] = Number.isFinite(sc) ? sc : null;
  }
  const ledgers = campaign.worldState?.spatialLedgers || {};
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    upswing: ledgers.upswing || {},
    reconConditions: reconConditionCount(saves),
    legitimacy,
    reconNews: newsKinds.reconstruction || 0,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'up-a', ticks: 4, interval: 'one_month' },
    { seed: 'up-b', ticks: 8, interval: 'one_month' },
    { seed: 'up-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('upswing mover — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the upswing dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NO upswing ledger', () => {
    const { campaign } = driveTicks('up-b', false, 8, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.upswing, 'upswing ledger must be absent when dormant').toBeUndefined();
    expect(reconConditionCount(driveTicks('up-b', false, 8, 'one_month').saves), 'no reconstruction conditions when dormant').toBe(0);
  });
});

describe('upswing mover — lit-path anti-vacuity (design B1: the rebuild race runs) [soak seed]', () => {
  it('gate ON: the reconstruction arc runs — the upswing ledger populates + the condition mints', () => {
    // A few ticks in, the arc is IN PROGRESS (condition minted, ledger carries the record).
    const mid = driveTicks('up-b', true, 2, 'one_month');
    const midLedger = mid.campaign.worldState?.spatialLedgers?.upswing;
    expect(midLedger?.reconstruction?.a, 'a reconstruction record is carried when lit').toBeTruthy();
    expect(reconConditionCount(mid.saves), 'the reconstruction condition minted when lit').toBeGreaterThan(0);
  }, 30_000);

  it('gate ON: given enough ticks the arc COMPLETES — a legitimacy dividend + a reconstruction beat', () => {
    const done = driveTicks('up-b', true, 12, 'one_month');
    // The arc completed ⇒ the ledger record dropped, the condition cleared.
    const doneLedger = done.campaign.worldState?.spatialLedgers?.upswing;
    expect(doneLedger?.reconstruction?.a, 'the completed arc drops its ledger record').toBeFalsy();
    // A reconstruction news beat reached the Chronicle.
    expect(done.newsKinds.reconstruction || 0, 'a reconstruction completion beat when lit').toBeGreaterThan(0);
    // The legitimacy dividend landed (Ashford's legitimacy rose above its dormant baseline).
    const litScore = Number(done.saves.find((s) => s.id === 'a')?.settlement?.powerStructure?.publicLegitimacy?.score);
    const dark = driveTicks('up-b', false, 12, 'one_month');
    const darkScore = Number(dark.saves.find((s) => s.id === 'a')?.settlement?.powerStructure?.publicLegitimacy?.score);
    expect(litScore, "the completion legitimacy dividend raised Ashford above its dark baseline").toBeGreaterThan(darkScore);
  }, 30_000);
});
