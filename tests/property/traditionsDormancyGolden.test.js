/**
 * traditionsDormancyGolden.test.js — THE TRADITIONS dormancy proof + lit anti-vacuity
 * (ENGINE LIFT #4: culture; DESIGN_TRADITIONS.md §12).
 *
 * THE CENTREPIECE (the constitutional dormancy law): the traditions mover (advanceTraditions,
 * composed after the ladder inside advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions
 * at pulseKernel's last per-settlement mover seam) is DORMANT behind the virtual
 * traditionsEnabled flag. With the gate ABSENT it must be a pure no-op — zero mint, zero
 * traditions ledger, zero settlement.traditions mirror, zero tradition beat, byte-identical to
 * the pre-wire engine.
 *
 * Pinned the ladder way:
 *   1. A FULL-ADVANCE dormancy golden: a world whose settlements WOULD mint + hold festivals
 *      (real tier/economy) is driven N real pulse ticks with the gate absent, projected to a
 *      MECHANICAL summary (the traditions ledger, the mirror count, the tradition-news count),
 *      ORACLE-NORMALIZED and hashed. Any drift trips it.
 *   2. A dormancy CONTRACT assertion: the dormant world carries NO 'traditions' ledger and no
 *      settlement carries a traditions field, and emits NO tradition beat.
 *
 * THE LIT-PATH ANTI-VACUITY (the same file's later describe block): the gate ON must actually
 * mint the founding set, open the calendar windows, resolve outcomes, and narrate — and two lit
 * runs must be byte-identical (deep determinism).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/traditionsDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'traditions-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

/** A settlement that WOULD mint founding traditions and hold them (real tier + a stable seed). */
function festivalTown(name, seed) {
  return {
    _seed: seed,
    name, tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade', culture: 'lowland', terrainType: 'plains' },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic', status: 'active' },
      { name: 'Grand bazaar', category: 'trade', status: 'active' },
    ],
    economicState: { prosperity: 'Comfortable', primaryExports: [], incomeSources: ['Trade tariffs'] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Accepted' },
      factions: [{ name: "Merchants' Guild", isGoverning: true, power: 60 }],
      conflicts: [],
    },
    calamityHistory: [],
    npcs: [],
    activeConditions: [],
  };
}
const plainTown = (name, seed) => ({
  _seed: seed,
  name, tier: 'town', population: 1400, config: { economicBase: 'agrarian', terrainType: 'hills', culture: 'upland' },
  institutions: [{ name: 'Market', category: 'trade' }],
  economicState: { prosperity: 'Comfortable' },
  powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
  activeConditions: [], npcs: [],
});
const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** @param {string} seed @param {boolean} lit */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    save('a', 'Ashford', festivalTown('Ashford', `${seed}:a`)),
    save('b', 'Briarwatch', plainTown('Briarwatch', `${seed}:b`)),
  ];
  const simulationRules = lit
    ? { warLayerEnabled: false, traditionsEnabled: true }
    : { warLayerEnabled: false };
  const campaign = {
    id: 'trad-pulse', name: 'Tradition Pulse', settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: seed, tick: 0, simulationRules,
      calendar: { elapsedWeeks: 0, year: 1 },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }] }),
    wizardNews: { currentTick: 0, entries: [] },
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

/** Count settlement.traditions mirrors across every save. */
function mirrorCount(saves) {
  let n = 0;
  for (const s of saves) if (s.settlement?.traditions != null) n += 1;
  return n;
}

/** The mechanical projection — everything the traditions mover would touch if lit. */
function projectionHash({ campaign, saves, newsKinds }) {
  const ledgers = campaign.worldState?.spatialLedgers || {};
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    traditions: ledgers.traditions || {},
    mirrors: mirrorCount(saves),
    traditionNews: newsKinds.tradition || 0,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'trad-a', ticks: 6, interval: 'one_week' },
    { seed: 'trad-b', ticks: 10, interval: 'one_week' },
    { seed: 'trad-c', ticks: 8, interval: 'one_month' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('traditions mover — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the traditions dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NO traditions ledger, NO mirror, NO beat', () => {
    const { campaign, saves, newsKinds } = driveTicks('trad-b', false, 10, 'one_week');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.traditions, 'traditions ledger must be absent when dormant').toBeUndefined();
    expect(mirrorCount(saves), 'no settlement.traditions when dormant').toBe(0);
    expect(newsKinds.tradition || 0, 'no tradition beat when dormant').toBe(0);
  });
});

describe('traditions mover — lit-path anti-vacuity (the town keeps its festivals)', () => {
  // A full year sweep (weeks 1..52) so every founding window opens at least once.
  const YEAR_TICKS = 54;
  const OUTCOMES = new Set(['triumph', 'good', 'modest', 'troubled', 'failure', 'cancelled']);

  it('gate ON: the ledger mints, the mirror lands, and observances resolve outcomes', () => {
    const lit = driveTicks('trad-lit', true, YEAR_TICKS, 'one_week');
    const ledger = lit.campaign.worldState?.spatialLedgers?.traditions;
    expect(ledger && Object.keys(ledger).length, 'the traditions ledger populates when lit').toBeGreaterThan(0);
    // The city minted a founding set (city band ⇒ several observances).
    const recA = ledger?.a;
    expect(Array.isArray(recA) && recA.length, 'the city carries a founding tradition set').toBeGreaterThan(0);
    // Its singular founding core persists (index 0, scaleBand at the city tier).
    expect(recA[0].coreMotif && recA[0].coreMotif.element, 'the founding core has a motif').toBeTruthy();
    // At least one observance held its window this year and stamped an outcome.
    const held = recA.filter((r) => r.lastHeldYear === 1 && OUTCOMES.has(r.lastOutcome));
    expect(held.length, 'at least one observance resolved an outcome in year 1').toBeGreaterThan(0);
    // The read-model mirror landed on the settlement and matches the ledger.
    const ashford = lit.saves.find((s) => s.id === 'a')?.settlement;
    expect(Array.isArray(ashford?.traditions) && ashford.traditions.length, 'the mirror carries the set').toBeGreaterThan(0);
    expect(JSON.stringify(ashford.traditions), 'the mirror equals the ledger set').toBe(JSON.stringify(recA));
    // The occurrences narrated at least one tradition beat.
    expect(lit.newsKinds.tradition || 0, 'lit occurrences emit tradition beats').toBeGreaterThan(0);
  }, 60_000);

  it('gate ON: the first-lit mint is byte-identical to the pure view-time preview', async () => {
    // The mint calls the SAME deriveFoundingTraditions the dossier preview calls; a
    // one-tick lit run (before any window necessarily opens) mints the founding set,
    // whose records must equal the pure preview for the SAME settlement object.
    const { deriveFoundingTraditions } = await import('../../src/domain/traditions/genesis.js');
    const seedSettlement = festivalTown('Ashford', 'trad-lit:a');
    const preview = deriveFoundingTraditions(seedSettlement);
    const lit1 = driveTicks('trad-lit', true, 1, 'one_week');
    const minted = lit1.campaign.worldState?.spatialLedgers?.traditions?.a;
    // The minted set carries the same founding records (id/motif/name/window/scaleBand);
    // year-1 fields (lastHeldYear/lastOutcome) may have stamped if week 1 opened a window,
    // so compare the timeless spine.
    const spine = (rs) => rs.map((r) => ({ id: r.id, coreMotif: r.coreMotif, name: r.name, foundedYear: r.foundedYear, window: r.window, scaleBand: r.scaleBand }));
    expect(spine(minted)).toEqual(spine(preview));
  }, 30_000);

  it('gate ON: two lit runs are byte-identical (deep determinism)', () => {
    const a = projectionHash(driveTicks('trad-det', true, YEAR_TICKS, 'one_week'));
    const b = projectionHash(driveTicks('trad-det', true, YEAR_TICKS, 'one_week'));
    expect(a.hash).toBe(b.hash);
  }, 90_000);
});
