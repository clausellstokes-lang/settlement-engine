/**
 * npcLadderDormancyGolden.test.js — THE LADDER dormancy proof + lit anti-vacuity
 * (ENGINE LIFT #3; DESIGN_THE_LADDER.md §5).
 *
 * THE CENTREPIECE (the constitutional dormancy law): the ladder mover
 * (advanceNpcLadder, composed after the consequence reader inside
 * advanceNpcGrowthWithFabricAndConsequenceAndLadder at pulseKernel's last per-settlement
 * mover seam) is DORMANT behind the virtual npcLadderEnabled flag. With the gate ABSENT
 * it must be a pure no-op — zero derivation, zero npcLadder ledger, zero
 * settlement.npcLadder mirror, zero npc_ladder beat, byte-identical to the pre-wire
 * engine.
 *
 * Pinned two ways (the fabric/growth/spatial-consequence golden pattern):
 *   1. A FULL-ADVANCE dormancy golden: a world whose ladder WOULD move (a multi-member
 *      faction with ranked office-holders) is driven N real pulse ticks with the gate
 *      absent, projected to a MECHANICAL summary (the npcLadder ledger, the mirror count,
 *      the ladder-news count), ORACLE-NORMALIZED and hashed. Any drift trips it.
 *   2. A dormancy CONTRACT assertion: the dormant world carries NO 'npcLadder' ledger and
 *      no settlement carries an npcLadder field, and emits NO npc_ladder beat.
 *
 * THE LIT-PATH ANTI-VACUITY lives in the same file's later describe block (added with the
 * derivation mechanism) — the gate ON must actually populate a ladder.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/npcLadderDormancyGolden.test.js
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'npc-ladder-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';

/** A guild town with a multi-member governing faction whose ladder WOULD move if lit. */
function courtTown(name) {
  return {
    name, tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade' },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic', status: 'active' },
      { name: 'Grand bazaar', category: 'trade', status: 'active' },
    ],
    economicState: { prosperity: 'Comfortable', primaryExports: [], incomeSources: ['Trade tariffs'] },
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
      { id: 'n_second', name: 'Factor Maera', role: 'Factor', importance: 'key', factionAffiliation: "Merchants' Guild", structuralRank: 'subordinate', dots: 2, personality: { dominant: 'bold', flaw: 'ruthless', modifier: 'clever' } },
      { id: 'n_third', name: 'Clerk Bevin', role: 'Clerk', importance: 'notable', factionAffiliation: "Merchants' Guild", structuralRank: 'minor', dots: 1, personality: { dominant: 'cautious', flaw: 'timid', modifier: 'loyal' } },
    ],
    activeConditions: [],
  };
}
const plainTown = (name) => ({
  name, tier: 'town', population: 1400, config: { economicBase: 'agrarian' },
  institutions: [{ name: 'Market', category: 'trade' }],
  economicState: { prosperity: 'Comfortable' },
  powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
  activeConditions: [], npcs: [],
});
const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** @param {string} seed @param {boolean} lit */
function makeCampaignAndSaves(seed, lit) {
  const saves = [save('a', 'Ashford', courtTown('Ashford')), save('b', 'Briarwatch', plainTown('Briarwatch'))];
  const simulationRules = lit
    ? { warLayerEnabled: false, factionCompetitionEnabled: true, npcLadderEnabled: true }
    : { warLayerEnabled: false };
  const campaign = {
    id: 'ladder-pulse', name: 'Ladder Pulse', settlementIds: ['a', 'b'],
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

/** Count settlement.npcLadder mirrors across every save. */
function mirrorCount(saves) {
  let n = 0;
  for (const s of saves) if (s.settlement?.npcLadder != null) n += 1;
  return n;
}

/** The mechanical projection — everything the ladder mover would touch if lit. */
function projectionHash({ campaign, saves, newsKinds }) {
  const ledgers = campaign.worldState?.spatialLedgers || {};
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    npcLadder: ledgers.npcLadder || {},
    mirrors: mirrorCount(saves),
    ladderNews: newsKinds.npc_ladder || 0,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'ladder-a', ticks: 6, interval: 'one_week' },
    { seed: 'ladder-b', ticks: 10, interval: 'one_week' },
    { seed: 'ladder-c', ticks: 8, interval: 'one_month' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('ladder mover — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the ladder dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NO npcLadder ledger, NO mirror, NO beat', () => {
    const { campaign, saves, newsKinds } = driveTicks('ladder-b', false, 10, 'one_week');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.npcLadder, 'npcLadder ledger must be absent when dormant').toBeUndefined();
    expect(mirrorCount(saves), 'no settlement.npcLadder when dormant').toBe(0);
    expect(newsKinds.npc_ladder || 0, 'no npc_ladder beat when dormant').toBe(0);
  });
});

describe('ladder mover — lit-path anti-vacuity (the roster becomes a court)', () => {
  it('gate ON: the ledger populates, the mirror lands, the governing faction has an ordered ladder', () => {
    const lit = driveTicks('ladder-b', true, 6, 'one_week');
    // The authoritative sidecar populates for the court town (id 'a').
    const ledger = lit.campaign.worldState?.spatialLedgers?.npcLadder;
    expect(ledger && Object.keys(ledger).length, 'the npcLadder ledger populates when lit').toBeGreaterThan(0);
    const recA = ledger?.a;
    expect(recA?.factions, 'the court town carries per-faction ladders').toBeTruthy();
    // The Merchants' Guild ladder derived from the three ranked office-holders,
    // top rung first (Guildmaster → Factor → Clerk by importance/dots/structural rank).
    const fkeys = Object.keys(recA.factions);
    const guildKey = fkeys.find((k) => recA.factions[k].rungs.includes('a:n_master'));
    expect(guildKey, 'the guild ladder exists').toBeTruthy();
    const rungs = recA.factions[guildKey].rungs;
    expect(rungs, 'the ladder is ordered top-rung first by structural position')
      .toEqual(['a:n_master', 'a:n_second', 'a:n_third']);
    // Each rung carries a standing stock; the top rung seeds above the floor.
    expect(recA.npcs['a:n_master'].stock, 'the top rung seeds highest')
      .toBeGreaterThan(recA.npcs['a:n_third'].stock);
    // The read-model mirror landed on the settlement (the ladderRead contract).
    const ashford = lit.saves.find((s) => s.id === 'a')?.settlement;
    expect(ashford?.npcLadder?.factions, 'the mirror carries the faction ladders').toBeTruthy();
    const mRungs = ashford.npcLadder.factions[guildKey]?.rungs;
    expect(Array.isArray(mRungs) && mRungs.length, 'the mirror carries the ordered rungs').toBe(3);
    expect(mRungs[0].npcId).toBe('a:n_master');
    expect(typeof mRungs[0].standing, 'the mirror standing is a normalized number').toBe('number');
  }, 30_000);

  it('gate ON: the plain faction-less town grows NO ladder (drop-when-empty)', () => {
    const lit = driveTicks('ladder-b', true, 6, 'one_week');
    const ledger = lit.campaign.worldState?.spatialLedgers?.npcLadder || {};
    expect(ledger.b, 'a town with no ranked faction members carries no ladder record').toBeUndefined();
    const briar = lit.saves.find((s) => s.id === 'b')?.settlement;
    expect(briar?.npcLadder, 'no mirror on the faction-less town').toBeUndefined();
  }, 30_000);
});
