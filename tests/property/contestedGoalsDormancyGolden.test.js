/**
 * contestedGoalsDormancyGolden.test.js — DEEP COUPLINGS D-4 dormancy proof + lit anti-vacuity
 * (DESIGN_DEEP_COUPLINGS.md §8, §13; the constitutional dormancy law, per-flag).
 *
 * THE CENTREPIECE (law 2): the settlement-wide contest pass is DORMANT behind the virtual
 * contestedGoalsEnabled flag (ABSENT from DEFAULT_SIMULATION_RULES). With the flag absent — even
 * with the ladder itself LIT — the ladder run is byte-identical to a world with no contest
 * machinery: zero contests sub-key, zero mirror contests, zero npc_contest / npc_support beat.
 *
 * Pinned three ways (the ladder dormancy-golden pattern):
 *   1. A FULL-ADVANCE dormancy manifest: a court whose contests WOULD form (two same-faction
 *      high-ambition rivals colliding on one signal) driven N ticks with the flag ABSENT
 *      (ladder LIT), projected to a mechanical summary, oracle-normalized and hashed.
 *   2. The dormancy CONTRACT: the dark run carries NO contests sub-key, NO mirror contests,
 *      NO npc_contest / npc_support beat.
 *   3. The LIT-PATH ANTI-VACUITY: with the flag ON the contest actually forms, and two lit
 *      runs are hash-equal (determinism), and the rung roster stays a permutation (no-death).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/contestedGoalsDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'contested-goals-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

/** A court whose two senior merchants share a high, non-suppressive ambition ⇒ they collide on
 *  the merchant domain signal (economic_capacity) and a convergent contest WOULD form if lit. */
function contestTown(name) {
  return {
    name, tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade' },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic', status: 'active' },
      { name: 'Grand bazaar', category: 'trade', status: 'active' },
    ],
    economicState: { prosperity: 'Struggling', primaryExports: [], incomeSources: ['Trade tariffs'] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Accepted' },
      factions: [
        { name: "Merchants' Guild", isGoverning: true, power: 60 },
        { name: 'The Watch', power: 35 },
      ],
      conflicts: [],
    },
    calamityHistory: [],
    npcs: [
      { id: 'n_master', name: 'Guildmaster Aldric', role: 'Guildmaster', importance: 'pillar', factionAffiliation: "Merchants' Guild", structuralRank: 'dominant', dots: 3, personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'ambitious' } },
      { id: 'n_second', name: 'Factor Maera', role: 'Factor', importance: 'key', factionAffiliation: "Merchants' Guild", structuralRank: 'subordinate', dots: 2, personality: { dominant: 'bold', flaw: 'ambitious', modifier: 'proud' } },
      { id: 'n_third', name: 'Clerk Bevin', role: 'Clerk', importance: 'notable', factionAffiliation: "Merchants' Guild", structuralRank: 'minor', dots: 1, personality: { dominant: 'cautious', flaw: 'timid', modifier: 'loyal' } },
    ],
    activeConditions: [],
  };
}
const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** @param {string} seed @param {boolean} contestsLit */
function makeCampaignAndSaves(seed, contestsLit) {
  const saves = [save('a', 'Ashford', contestTown('Ashford'))];
  const simulationRules = { warLayerEnabled: false, factionCompetitionEnabled: true, npcLadderEnabled: true };
  if (contestsLit) simulationRules.contestedGoalsEnabled = true;
  const campaign = {
    id: 'contest-pulse', name: 'Contest Pulse', settlementIds: ['a'],
    worldState: {
      rngSeed: seed, tick: 260, simulationRules,
      calendar: { elapsedWeeks: 260, year: 5 },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({ edges: [] }),
    wizardNews: { currentTick: 260, entries: [] },
  };
  return { campaign, saves };
}

/** Drive N ticks; return { campaign, saves, newsKinds, rungHistory }. */
function driveTicks(seed, contestsLit, ticks, interval) {
  let { campaign, saves } = makeCampaignAndSaves(seed, contestsLit);
  /** @type {Record<string, number>} */
  const newsKinds = {};
  /** @type {string[][]} the guild rung roster (sorted) each tick — conservation witness */
  const rungHistory = [];
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const e of (r.wizardNews?.entries || [])) {
      const k = String(e?.impactKind || e?.kind || 'unknown');
      newsKinds[k] = (newsKinds[k] || 0) + 1;
    }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
    const rec = campaign.worldState?.spatialLedgers?.npcLadder?.a;
    if (rec?.factions) {
      const guild = Object.values(rec.factions).find((f) => Array.isArray(f.rungs) && f.rungs.includes('a:n_master'));
      if (guild) rungHistory.push([...guild.rungs].sort());
    }
  }
  return { campaign, saves, newsKinds, rungHistory };
}

/** Everything the contest machinery would touch, projected mechanically. */
function projectionHash({ campaign, newsKinds }) {
  const ledgers = campaign.worldState?.spatialLedgers || {};
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    npcLadder: ledgers.npcLadder || {},
    contestNews: newsKinds.npc_contest || 0,
    supportNews: newsKinds.npc_support || 0,
  };
  return createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex');
}

/** Count contests sub-keys across all npcLadder records + mirror contests fields. */
function contestFootprint(campaign, saves) {
  let ledgerContests = 0;
  const led = campaign.worldState?.spatialLedgers?.npcLadder || {};
  for (const rec of Object.values(led)) if (rec?.contests) ledgerContests += Object.keys(rec.contests).length;
  let mirrorContests = 0;
  for (const s of saves) if (Array.isArray(s.settlement?.npcLadder?.contests)) mirrorContests += s.settlement.npcLadder.contests.length;
  return { ledgerContests, mirrorContests };
}

function corpus() {
  return [
    { seed: 'contest-a', ticks: 8, interval: 'one_week' },
    { seed: 'contest-b', ticks: 6, interval: 'one_month' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const darkHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval));

describe('contested-goals — dormancy golden (flag absent ⇒ byte-identical, ladder still lit)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the contested-goals dormancy manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = darkHashFor(c);
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

  it('covers the full dark corpus', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every dark config reproduces the golden (flag-off contest code never leaks)', () => {
    const drift = [];
    for (const c of rows) if (manifest[keyOf(c)] !== darkHashFor(c)) drift.push(keyOf(c));
    expect(drift).toEqual([]);
  }, 30_000);

  it('dormancy CONTRACT: flag absent ⇒ NO contests sub-key, NO mirror contests, NO contest beat', () => {
    const run = driveTicks('contest-a', false, 8, 'one_week');
    const fp = contestFootprint(run.campaign, run.saves);
    expect(fp.ledgerContests, 'no contests sub-key when dormant').toBe(0);
    expect(fp.mirrorContests, 'no mirror contests when dormant').toBe(0);
    expect(run.newsKinds.npc_contest || 0, 'no npc_contest beat when dormant').toBe(0);
    expect(run.newsKinds.npc_support || 0, 'no npc_support beat when dormant').toBe(0);
  });
});

describe('contested-goals — lit anti-vacuity (the class forms; determinism; no-death conservation)', () => {
  it('gate ON: a convergent contest forms between the two colliding rivals', () => {
    const lit = driveTicks('contest-a', true, 8, 'one_week');
    const fp = contestFootprint(lit.campaign, lit.saves);
    expect(fp.ledgerContests, 'a contest sub-key materializes when lit').toBeGreaterThan(0);
    // the contest pairs the two senior merchants on the merchant domain signal.
    const rec = lit.campaign.worldState.spatialLedgers.npcLadder.a;
    const contests = Object.values(rec.contests);
    const c = contests[0];
    expect([c.a.nid, c.b.nid].sort()).toEqual(['a:n_master', 'a:n_second']);
    expect(c.kind).toBe('convergent');
  }, 30_000);

  it('gate ON: two identical lit runs are hash-equal (determinism — the seeded contest draws)', () => {
    expect(projectionHash(driveTicks('contest-a', true, 8, 'one_week')))
      .toBe(projectionHash(driveTicks('contest-a', true, 8, 'one_week')));
  }, 30_000);

  it('NO-DEATH: the guild rung roster stays a PERMUTATION every tick (contests move goals, not seats)', () => {
    const lit = driveTicks('contest-a', true, 8, 'one_week');
    expect(lit.rungHistory.length).toBeGreaterThan(0);
    const first = lit.rungHistory[0];
    for (const roster of lit.rungHistory) expect(roster).toEqual(first); // same membership set, always
  }, 30_000);
});
