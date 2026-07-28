/**
 * tickScanBudget.test.js — CYCLE-3 WAVE 4 asymptotic ratchet (sibling of tickOpBudget / E-F).
 *
 * E-F counts OP-COUNT from the simulate result and records its own blind spot: "this bounds
 * OP-COUNT, not PER-OP COST. A kernel that goes O(n²) INSIDE one evaluation while emitting the
 * same receipts is invisible here." That is EXACTLY the class Wave 4 fixed — the per-advance
 * pairwise/edge/channel rescans in npcAgency (H17), roadsKernel (H18/M17), and stressorDynamics
 * (M18), which changed no receipt but scanned the whole graph per pair. This gate closes that
 * blind spot by measuring the PER-OP scan cost directly: the tickIndices instrumentation counts the
 * elements the per-advance indices visit while building, so a regression that reverts a site to a
 * per-pair full scan (or otherwise reintroduces super-linear scanning THROUGH the indices) blows the
 * scan count up super-linearly and reds here, while normal tuning drift stays flat.
 *
 * WHAT IT ASSERTS (machine-independent — a count of graph-element visits, not a clock):
 *   1. RATCHET — scanOps(S=8) / scanOps(S=4) <= 2.6. A quadratic scan doubles-squared (~4x) when
 *      the settlement count doubles; the indices keep it near-linear (~1.8x measured). The ceiling
 *      sits deliberately between linear and quadratic.
 *   2. ENGAGEMENT — fallbacks === 0 (every hot site used an index; none fell back to a raw scan)
 *      and consults > 0 (the indices are actually on the hot path, not dead code).
 *   3. DETERMINISM — same drive ⇒ the same counters, exactly (a pure function of the fixture).
 *   4. SELF-PROVING — a faithful model of the PRE-index access pattern (all-pairs × graph size) is
 *      measured at both scales; its ratio EXCEEDS the ceiling, proving the workload is genuinely
 *      quadratic-prone and that the 2.6x ceiling discriminates the fix from the bug it replaced.
 *
 * The byte-identity receipt (same-seed full-pulse output unchanged before/after) is the correctness
 * proof; THIS gate is the asymptotic proof. Together they pin "same output, sub-quadratic cost".
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import {
  __tickIndexStats,
  __resetTickIndexStats,
  relationshipTypeBetweenIdx,
} from '../../src/domain/worldPulse/tickIndices.js';
import { relationshipTypeBetween } from '../../src/domain/roads/embassyHazard.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICKS = 12;
const SEED = 'tick-scan-budget-seed';
const FULL = SIMULATION_RULE_PRESETS.full_simulation.rules;
const RATIO_CEILING = 2.6;

const GRAIN = 'Bulk grain and foodstuffs';
const POOL = 'abcdefghijklmnop'.split('');
const deity = (ref, name, align, law, rank) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = {
  lg: deity('custom:ob_dawn', 'Dawnfather', 'good', 'lawful', 'major'),
  ce: deity('custom:ob_maw', 'The Maw', 'evil', 'chaotic', 'major'),
};

// A rich settlement: 3 NPCs (one shelved on every 3rd town ⇒ the off-stage participation path),
// factions, and trade posture — enough to drive npc agency, roads GENESIS, and stressor counterforce.
function settlementFor(id, name, patron, exports, imports, shelve) {
  return {
    name, tier: 'town', population: 1600,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
    },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 38, label: 'Contested' },
      factions: [
        { faction: 'Temple Wardens', category: 'religious', power: 58 },
        { faction: 'Merchant League', category: 'economy', power: 55 },
        { faction: 'City Watch', category: 'military', power: 44 },
      ],
      conflicts: [],
    },
    npcs: [
      { id: `reeve_${id}`, name: `Reeve ${name}`, importance: 'key', category: 'government' },
      { id: `merchant_${id}`, name: `Factor ${name}`, importance: 'notable', category: 'economy' },
      { id: `captain_${id}`, name: `Captain ${name}`, importance: 'notable', category: 'military', ...(shelve ? { stasis: true } : {}) },
    ],
    activeConditions: [],
  };
}
const saveFor = (id, name, patron, exports, imports, shelve) => ({
  id, name, phase: 'canon', settlement: settlementFor(id, name, patron, exports, imports, shelve),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});
const tradeChannel = (from, to) => ({
  id: `ch.${from}.${to}`, type: 'trade_dependency', from, to,
  goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed',
});
const warFront = (from, to) => ({ id: `wf.${from}.${to}`, type: 'war_front', from, to, status: 'confirmed' });

function spatialDigest(ids) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, ids.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: ids[i], cellId: p.cellId })) });
}

function makeFixture(n) {
  const ids = POOL.slice(0, n);
  const saves = ids.map((id, i) => saveFor(
    id, `Town_${id.toUpperCase()}`, i % 2 === 0 ? D.lg : D.ce,
    i === 0 ? [GRAIN] : [], i === 0 ? [] : [GRAIN], i % 3 === 2,
  ));
  const channels = [];
  for (let i = 0; i < n; i++) channels.push(tradeChannel(ids[i], ids[(i + 1) % n]));
  if (n >= 4) channels.push(warFront(ids[1], ids[3])); // ⇒ atOpenWar / warTargets fires
  const edges = [];
  const kinds = ['trade_partner', 'rival', 'hostile', 'ally'];
  for (let i = 0; i < n; i++) edges.push({ id: `edge.${ids[i]}.${ids[(i + 1) % n]}`, from: ids[i], to: ids[(i + 1) % n], relationshipType: kinds[i % kinds.length] });
  const occupations = n >= 3 ? { [ids[2]]: { occupierId: ids[0] } } : {}; // ⇒ dominionTargets fires
  const campaign = {
    id: `scan-${n}`, name: `scan ${n}`, settlementIds: [...ids],
    worldState: {
      rngSeed: SEED, tick: 1, simulationRules: { ...FULL },
      stressors: [
        { id: 'ws.famine', type: 'famine', severity: 0.9, affectedSettlementIds: [ids[0]], age: 3 },
        ...(n >= 4 ? [{ id: 'ws.siege', type: 'siege', severity: 0.8, affectedSettlementIds: [ids[3]], age: 2 }] : []),
      ],
      occupations, spatialCanonVersion: 1, spatialDigest: spatialDigest(ids),
    },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** Drive TICKS advances at scale n; return the accumulated tickIndex counters. */
function measure(n) {
  let { campaign, saves } = makeFixture(n);
  __resetTickIndexStats();
  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews };
  }
  return __tickIndexStats();
}

/**
 * A faithful model of the PRE-index access pattern (the bug this gate guards). The old hot sites
 * scanned the WHOLE edge + channel arrays for EVERY ordered settlement pair (warTargets/atWarWith),
 * plus the whole edge array and settlement list per NPC state (dominantRelationshipContext /
 * settlementForState). Its cost is ~pairs × graphSize — genuinely super-linear.
 */
function rawScanProxy(n) {
  const { campaign } = makeFixture(n);
  const graph = campaign.regionalGraph;
  const E = (graph.edges || []).length;
  const C = (graph.channels || []).length;
  const S = n;
  const pairs = S * (S - 1);
  return pairs * (E + C) + S * (E + S); // warTargets/atWarWith + dominantRel/settlementForState
}

describe('tick SCAN BUDGET — the per-advance graph scans stay sub-quadratic (Wave 4)', () => {
  it('the relationship-state pair index preserves raw-edge precedence and legacy key order', () => {
    const graph = {
      edges: [
        // The first non-empty RAW edge wins before any relationship-state row.
        { id: 'edge.alpha.beta.empty', from: 'alpha', to: 'beta', relationshipType: '' },
        { id: 'edge.alpha.beta.rival', from: 'alpha', to: 'beta', relationshipType: 'rival' },
      ],
      channels: [],
    };
    const keys = {
      // Keep an empty first match to prove the cached list preserves key order
      // while the reader still skips blank relationshipType values.
      'legacy.alpha.gamma.0': { relationshipType: '' },
      'legacy.alpha.gamma.1': { relationshipType: 'cold_war' },
      'legacy.alpha.gamma.2': { relationshipType: 'hostile' },
      // Deliberately overlaps the short id "alpha"; matching remains the
      // legacy String.includes predicate, not a newly parsed id grammar.
      'legacy.alphabet.delta': { relationshipType: 'allied' },
    };
    const first = { relationshipStates: keys };
    const changed = {
      relationshipStates: {
        ...keys,
        'legacy.alpha.gamma.1': { relationshipType: 'allied' },
      },
    };
    const pairs = [
      ['alpha', 'beta'],
      ['alpha', 'gamma'],
      ['alpha', 'delta'],
      ['missing', 'pair'],
    ];

    __resetTickIndexStats();
    for (const [a, b] of pairs) {
      expect(relationshipTypeBetweenIdx(graph, first, a, b))
        .toBe(relationshipTypeBetween(graph, first, a, b));
      expect(relationshipTypeBetweenIdx(graph, changed, a, b))
        .toBe(relationshipTypeBetween(graph, changed, a, b));
    }
    expect(relationshipTypeBetweenIdx(graph, first, 'alpha', 'beta')).toBe('rival');
    expect(relationshipTypeBetweenIdx(graph, first, 'alpha', 'gamma')).toBe('cold_war');
    expect(relationshipTypeBetweenIdx(graph, changed, 'alpha', 'gamma')).toBe('allied');
  });

  it('a cached non-edge pair does not rescan the relationship-state key set', () => {
    const graph = {
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }],
      channels: [],
    };
    const worldState = {
      relationshipStates: Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => [`edge.a.b.${i}`, { relationshipType: 'neutral' }]),
      ),
    };

    __resetTickIndexStats();
    expect(relationshipTypeBetweenIdx(graph, worldState, 'not-here', 'nor-here')).toBe('');
    const afterBuild = __tickIndexStats().scanOps;
    for (let i = 0; i < 40; i += 1) {
      expect(relationshipTypeBetweenIdx(graph, worldState, 'not-here', 'nor-here')).toBe('');
    }
    expect(__tickIndexStats().scanOps).toBe(afterBuild);
  });

  it('scanOps(S=8) / scanOps(S=4) stays under the near-linear ceiling, indices engaged, no fallbacks', () => {
    const s4 = measure(4);
    const s8 = measure(8);
    if (process.env.TICK_SCAN_BUDGET_REPORT === '1') {
      console.log(JSON.stringify({ s4, s8, ratio: s8.scanOps / s4.scanOps }, null, 2));
    }

    // Anti-vacuity: the drive actually exercised the indexed paths at both scales.
    expect(s4.scanOps, 'S=4 did no scan work — the fixture went dark').toBeGreaterThan(50);
    expect(s8.scanOps, 'S=8 did no scan work — the fixture went dark').toBeGreaterThan(50);
    expect(s4.consults, 'the indices were never consulted at S=4 — they are dead code').toBeGreaterThan(0);
    expect(s8.consults, 'the indices were never consulted at S=8 — they are dead code').toBeGreaterThan(0);
    expect(s4.builds, 'no index was built at S=4').toBeGreaterThan(0);

    // ENGAGEMENT: every hot site used an index; none fell back to a raw linear scan.
    expect(s4.fallbacks, 'a hot site fell back to a raw scan at S=4 — an index failed to engage').toBe(0);
    expect(s8.fallbacks, 'a hot site fell back to a raw scan at S=8 — an index failed to engage').toBe(0);

    // THE RATCHET: doubling the settlement count must not multiply scan work quadratically.
    const ratio = s8.scanOps / s4.scanOps;
    expect(
      ratio,
      `scanOps grew ${ratio.toFixed(3)}x (${s4.scanOps} -> ${s8.scanOps}) when S doubled (> ${RATIO_CEILING}) — `
      + 'a per-advance graph scan has gone super-linear again; find the reverted index before touching this ceiling',
    ).toBeLessThanOrEqual(RATIO_CEILING);
  });

  it('SELF-PROVING: the pre-index access pattern IS quadratic-prone, so the ceiling has teeth', () => {
    // The workload the indices linearize genuinely scales super-linearly: prove the raw proxy
    // exceeds the ceiling at the same S=4->S=8 step where the indexed count stays under it.
    const rawRatio = rawScanProxy(8) / rawScanProxy(4);
    expect(
      rawRatio,
      `the pre-index proxy ratio was ${rawRatio.toFixed(3)} — if it does not exceed ${RATIO_CEILING}, this gate cannot distinguish the fix from the bug`,
    ).toBeGreaterThan(RATIO_CEILING);

    const indexedRatio = measure(8).scanOps / measure(4).scanOps;
    expect(indexedRatio, 'the indexed ratio should be well under the raw ratio').toBeLessThan(rawRatio);
  });

  it('the scan count is DETERMINISTIC: same fixture ⇒ the same counters, exactly', () => {
    expect(measure(4)).toEqual(measure(4));
  });

  // HABITAT GUARD (zero runtime cost): the asymptotic ratchet above measures cost THROUGH the
  // indices, so a revert of a flagged site back to a raw per-pair scan would slip past it (and past
  // the byte-identity goldens, since raw and indexed produce identical output). This source scan
  // pins each flagged site to its index accessor, so the bug's habitat cannot silently return.
  it('the flagged hot sites still route through the per-advance indices (revert guard)', () => {
    const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
    const read = (rel) => readFileSync(join(ROOT, 'src/domain/worldPulse', rel), 'utf8');
    const REQUIRED = {
      'npcAgency.js': ['./tickIndices.js', 'settlementByIdIndex(', 'edgeAdjacencyIndex('],
      'roadsKernel.js': ['./tickIndices.js', 'atWarWithIdx(', 'relationshipTypeBetweenIdx(', 'tradeNeighbourIndex(', 'occupiedByIndex('],
      'stressorDynamics.js': ['./tickIndices.js', 'edgeAdjacencyIndex(', 'channelsByToIndex('],
    };
    for (const [file, needles] of Object.entries(REQUIRED)) {
      const src = read(file);
      for (const needle of needles) {
        expect(
          src.includes(needle),
          `${file} no longer uses ${needle} — a Wave-4 index site was reverted to a raw scan; `
          + 'restore the index call (see tickIndices.js) rather than deleting this pin',
        ).toBe(true);
      }
    }
  });
});
