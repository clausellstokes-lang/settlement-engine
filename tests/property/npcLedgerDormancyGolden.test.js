/**
 * npcLedgerDormancyGolden.test.js — W-H1 DORMANCY PROOF (design law 5, §12).
 *
 * THE CONSTITUTIONAL DORMANCY LAW: the whole NPC-consequence economy sits behind the
 * virtual `npcConsequencesEnabled` flag, and dark it must be a pure no-op — byte-
 * identical generation and pulse, no ledger key, no bytes.
 *
 * WHAT THIS FILE HONESTLY PROVES AT H1, stated plainly because a golden that overclaims
 * is worse than none. H1 ships identity and state only: NO kernel calls graduateNpc yet,
 * so the full-advance arm below cannot fail for an H1 reason. It is a FENCE, captured
 * now so that the moment H2 wires the verdict lane, any leak into the dark path reds
 * against a baseline recorded before the wiring existed. That is the whole point of
 * capturing it early, and it is why the projection hashes the npcLedger key ALONGSIDE
 * its neighbouring personal-state sidecars: a dark H2 that touched the ladder or the
 * credibility stock instead would move this hash too.
 *
 * THE TEETH THAT BITE TODAY are the gate arms: the same fixture driven through the real
 * graduation entry point dark and lit, proving the flag is the only thing between a
 * byte-identical world and a materialized ledger, and that a drained ledger returns to
 * byte-identity rather than leaving a ghost key.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/npcLedgerDormancyGolden.test.js
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';
import {
  graduateNpc,
  setNpcLedger,
  emptyNpcLedger,
  npcLedgerOf,
  hasNpcLedger,
  graduatedNpcIds,
} from '../../src/domain/worldPulse/npcLedger.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'npc-ledger-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['aldermoor', 'crowmarch', 'fenwick'];

/** A court with a governing faction and a notable roster, so the people lanes engage. */
function isSettlement(name, { tier = 'town', population = 3200, faction = 'Town Council' } = {}) {
  return {
    name, tier, population,
    config: { tradeRouteAccess: 'road', priorityMilitary: 30 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [], activeChains: [] },
    powerStructure: {
      publicLegitimacy: { score: 52, label: 'Stable' },
      factions: [{ faction, category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [
      { id: 'npc_1', name: `Warden of ${name}`, importance: 'pillar', structuralRank: 'dominant', factionAffiliation: faction, personality: { dominant: 'shrewd', flaw: 'greedy', modifier: 'bold' } },
      { id: 'npc_2', name: `Reeve of ${name}`, importance: 'key', structuralRank: 'subordinate', factionAffiliation: faction, personality: { dominant: 'proud', flaw: 'ambitious', modifier: 'patient' } },
      { id: 'npc_3', name: `Magistrate of ${name}`, importance: 'key', structuralRank: 'subordinate', factionAffiliation: faction, personality: { dominant: 'stern', flaw: 'deceitful', modifier: 'cautious' } },
    ],
    activeConditions: [],
  };
}

const isSave = (id, name, patch) => ({
  id, name, phase: 'canon',
  settlement: isSettlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

function makeCampaignAndSaves(seed, lit) {
  const saves = [
    isSave('aldermoor', 'Aldermoor', { tier: 'town', population: 4200, faction: 'Merchant League' }),
    isSave('crowmarch', 'Crowmarch', { tier: 'city', population: 41000, faction: 'High Command' }),
    isSave('fenwick', 'Fenwick', { tier: 'town', population: 2400 }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    warLayerEnabled: true,
    settlementStrategyEnabled: true,
    npcLadderEnabled: true,
    npcGrowthEnabled: true,
    corruptionWebEnabled: true,
    ...(lit ? { npcConsequencesEnabled: true } : {}),
  };
  const campaign = {
    id: 'npc-ledger', name: 'NPC Ledger', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 30 },
      relationshipStates: {
        'edge.aldermoor.crowmarch': { relationshipType: 'hostile', resentment: 0.65, trust: 0.15 },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.aldermoor.crowmarch', from: 'aldermoor', to: 'crowmarch', relationshipType: 'hostile' },
        { id: 'edge.aldermoor.fenwick', from: 'aldermoor', to: 'fenwick', relationshipType: 'trade_partner' },
        { id: 'edge.crowmarch.fenwick', from: 'crowmarch', to: 'fenwick', relationshipType: 'trade_route' },
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
    // The H1 ledger AND its neighbouring personal-state sidecars: a dark consequence
    // lane must not move the ladder, the growth stock or the exposure ledger either.
    npcLedger: ledgers.npcLedger || {},
    npcLadder: ledgers.npcLadder || {},
    npcGrowth: ledgers.npcGrowth || {},
    exposedCorruption: ledgers.exposedCorruption || {},
    newsKinds,
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'nl-a', ticks: 4, interval: 'one_month' },
    { seed: 'nl-b', ticks: 6, interval: 'one_month' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('npc ledger — dormancy golden (the fence H2 will be measured against)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the npc-ledger dormancy manifest', () => {
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

  it('every dormant config reproduces the golden projection (any drift means dormancy broke)', () => {
    const drift = [];
    for (const c of rows) if (manifest[keyOf(c)] !== dormantHashFor(c)) drift.push(keyOf(c));
    expect(drift).toEqual([]);
  }, 120_000);

  it('dormancy CONTRACT: a dark advance writes no npcLedger key at any depth', () => {
    const { campaign } = driveTicks('nl-b', false, 6, 'one_month');
    expect(hasNpcLedger(campaign.worldState)).toBe(false);
    const ledgers = campaign.worldState?.spatialLedgers || {};
    expect(ledgers.npcLedger, 'npcLedger must be absent when dormant').toBeUndefined();
    expect(graduatedNpcIds(campaign.worldState)).toEqual([]);
  }, 60_000);

  it('lit-path anti-vacuity: the gate ON, the advance still completes and stays well-shaped', () => {
    const { campaign } = driveTicks('nl-b', true, 6, 'one_month');
    expect(campaign.worldState?.tick, 'the lit run must actually advance').toBeGreaterThan(1);
    // H1 wires no kernel, so the lit advance legitimately materializes nothing. Asserted
    // rather than assumed, so H2's wiring changes this line visibly and deliberately.
    expect(hasNpcLedger(campaign.worldState)).toBe(false);
  }, 60_000);
});

describe('npc ledger — the gate arms (the teeth that bite at H1)', () => {
  /** The one fixture both arms share, so the comparison is like for like. */
  const rosterIdentity = { rosterId: 'npc_3', name: 'Magistrate of Aldermoor', role: 'Magistrate' };
  const worldFor = (lit) => ({
    rngSeed: 'gate', tick: 7,
    calendar: { elapsedWeeks: 30 },
    simulationRules: { npcLadderEnabled: true, ...(lit ? { npcConsequencesEnabled: true } : {}) },
  });

  it('the FLAG is the only thing between byte-identity and a materialized ledger', () => {
    const dark = worldFor(false);
    const darkBefore = JSON.stringify(dark);
    const darkOut = graduateNpc({
      worldState: dark, settlementSeed: 'seed-aldermoor', settlementId: 'aldermoor',
      rosterIdentity, tick: 7, verdictCause: 'banished', dmTruth: { compromiseSource: 'rival_power' },
    });
    expect(darkOut.worldState).toBe(dark);
    expect(JSON.stringify(darkOut.worldState)).toBe(darkBefore);
    expect(darkOut.wnpcId).toBe(null);

    // THE ANTI-VACUITY ANCHOR: the SAME call on the SAME fixture with only the flag
    // flipped DOES materialize, so the byte-identity above measures the gate rather
    // than a graduation path that never worked.
    const lit = worldFor(true);
    const litOut = graduateNpc({
      worldState: lit, settlementSeed: 'seed-aldermoor', settlementId: 'aldermoor',
      rosterIdentity, tick: 7, verdictCause: 'banished', dmTruth: { compromiseSource: 'rival_power' },
    });
    expect(litOut.minted).toBe(true);
    expect(hasNpcLedger(litOut.worldState)).toBe(true);
    expect(graduatedNpcIds(litOut.worldState)).toHaveLength(1);

    // And graduation's ONLY effect on the lit world is the one conditional key: compared
    // against the LIT world's own pre-graduation bytes (not the dark world's, which
    // legitimately differ by the flag itself), everything outside spatialLedgers is
    // untouched. This is the structural half of the non-disturbance claim.
    const strip = (w) => { const { spatialLedgers: _d, ...rest } = w; return rest; };
    expect(JSON.stringify(strip(litOut.worldState))).toBe(JSON.stringify(strip(lit)));
  });

  it('a DRAINED ledger returns to byte-identity rather than leaving a ghost key', () => {
    const lit = worldFor(true);
    const litBefore = JSON.stringify(lit);
    const filled = graduateNpc({
      worldState: lit, settlementSeed: 'seed-aldermoor', settlementId: 'aldermoor',
      rosterIdentity, tick: 7,
    }).worldState;
    expect(JSON.stringify(filled)).not.toBe(litBefore);
    const drained = setNpcLedger(filled, emptyNpcLedger());
    expect(JSON.stringify(drained)).toBe(litBefore);
    expect(npcLedgerOf(drained)).toEqual(emptyNpcLedger());
  });
});
