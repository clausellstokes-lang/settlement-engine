/**
 * npcCredibilityDormancyGolden.test.js — DEEP COUPLINGS D-2 dormancy proof (design §6 + §13).
 *
 * THE CONSTITUTIONAL DORMANCY LAW: per-NPC credibility (the leaf + the statecraft attribution
 * + the ladder lie-stigma hook) is DORMANT behind the virtual npcCredibilityEnabled flag. With
 * the gate ABSENT it must be a pure no-op — byte-identical to the pre-D-2 engine — EVEN IN A
 * WORLD WHERE STATECRAFT AND THE LADDER ARE BOTH LIT (a weak, hostile court that WOULD seed a
 * mouthpieced bluff, and a court whose ladder WOULD consume a lie-stigma if the flag were up).
 *
 * Pinned three ways (the informationStatecraft / npcLadder idiom):
 *   1. A FULL-ADVANCE dormancy golden: a belief-active, lit-statecraft, lit-ladder hostile
 *      world driven N ticks with npcCredibilityEnabled ABSENT, projected to a mechanical
 *      summary (the D-2 ledger npcCredibility + its neighbours credibility/disinfo/npcLadder,
 *      the news histogram, the roll summary), oracle-normalized + hashed.
 *   2. A dormancy CONTRACT: the dormant world carries NO npcCredibility ledger, and no
 *      DisinfoRecord carries a spokespersonNpcId, and no LadderStanding carries lastLieSeen.
 *   3. LIT-PATH ANTI-VACUITY: the gate ON, the run completes and (if the ledgers materialize)
 *      they are well-shaped. The HARD anti-vacuity — the mouthpiece discount, the personal
 *      charge, the band-scaled stigma with its tax + the exposed_liar window — lives at the
 *      unit level (tests/domain/npcCredibilityAttribution + npcCredibilityLadderHook).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/npcCredibilityDormancyGolden.test.js
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

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'npc-credibility-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['raider', 'crown', 'midfen'];

function digestFor() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

/** A court with a notable+ roster affiliated to the governing faction (so a ladder forms and a
 *  mouthpiece can be drawn). */
function isSettlement(name, { tier = 'town', population = 3000, faction = 'Town Council' } = {}) {
  return {
    name, tier, population,
    config: { tradeRouteAccess: 'road', priorityMilitary: 30 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [], activeChains: [] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Stable' },
      factions: [{ faction, category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [
      { id: `head_${name}`, name: `Head of ${name}`, importance: 'pillar', structuralRank: 'dominant', factionAffiliation: faction, personality: { dominant: 'shrewd', flaw: 'deceitful', modifier: 'bold' } },
      { id: `deputy_${name}`, name: `Deputy of ${name}`, importance: 'key', structuralRank: 'subordinate', factionAffiliation: faction, personality: { dominant: 'proud', flaw: 'ambitious', modifier: 'patient' } },
    ],
    activeConditions: [],
  };
}

const isSave = (id, name, patch) => ({ id, name, phase: 'canon', settlement: isSettlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function makeCampaignAndSaves(seed, lit) {
  const saves = [
    isSave('raider', 'Marchmont', { tier: 'town', population: 4200, faction: 'Merchant League' }),
    isSave('crown', 'Crownhold', { tier: 'city', population: 55000, faction: 'High Command' }),
    isSave('midfen', 'Midfen', { tier: 'town', population: 2600 }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    warLayerEnabled: true, settlementStrategyEnabled: true, infoMode: 'unreliable',
    infoStatecraftEnabled: true, npcLadderEnabled: true,
    ...(lit ? { npcCredibilityEnabled: true } : {}),
  };
  const campaign = {
    id: 'npc-credibility', name: 'NPC Credibility', settlementIds: [...IDS],
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
  return { campaign, newsKinds, rollSummary: { total: rollTotal, passed: rollPassed } };
}

function projectionHash({ campaign, newsKinds, rollSummary }) {
  const ws = campaign.worldState || {};
  const ledgers = ws.spatialLedgers || {};
  const projection = {
    tick: ws.tick ?? null,
    // The D-2 ledger + its neighbours (a dark D-2 must not move the ladder or the stock either).
    npcCredibility: ledgers.npcCredibility || {},
    credibility: ledgers.credibility || {},
    disinfo: ledgers.disinfo || {},
    npcLadder: ledgers.npcLadder || {},
    newsKinds,
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'nc-a', ticks: 4, interval: 'one_month' },
    { seed: 'nc-b', ticks: 8, interval: 'one_month' },
    { seed: 'nc-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('npc credibility — dormancy golden (wired-but-dormant is byte-identical to pre-D-2)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the npc-credibility dormancy manifest', () => {
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

  it('dormancy CONTRACT: the gate absent adds NO npcCredibility ledger, no spokesperson, no lastLieSeen', () => {
    const { campaign } = driveTicks('nc-b', false, 8, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.npcCredibility, 'npcCredibility must be absent when dormant').toBeUndefined();
    for (const rec of Object.values(ledgers.disinfo || {})) {
      expect(rec.spokespersonNpcId, 'no DisinfoRecord carries a spokesperson when dormant').toBeUndefined();
    }
    for (const town of Object.values(ledgers.npcLadder || {})) {
      for (const st of Object.values(town.npcs || {})) {
        expect(st.lastLieSeen, 'no LadderStanding carries lastLieSeen when dormant').toBeUndefined();
      }
    }
  }, 60_000);
});

describe('npc credibility — lit-path anti-vacuity (the wiring does not break the kernel)', () => {
  it('gate ON: the run completes; any materialized D-2 ledger is well-shaped', () => {
    const { campaign } = driveTicks('nc-b', true, 8, 'one_month');
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.beliefMaps, 'belief maps still form under the lit gate').toBeTruthy();
    if (ledgers.npcCredibility) {
      for (const k of Object.keys(ledgers.npcCredibility)) {
        expect(typeof ledgers.npcCredibility[k].score).toBe('number');
      }
    }
  }, 120_000);
});
