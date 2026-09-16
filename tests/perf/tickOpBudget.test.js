/**
 * tickOpBudget.test.js — ENFORCER E-F: the DETERMINISTIC TICK OP-COUNT BUDGET (bar 5).
 *
 * Today the constitution deterministically budgets BYTES (CLOSURE_BUDGET_BYTES) and
 * the tick's wall-time only by a loose 10× TREND (worldTickCostEnvelope) — which
 * catches age-linear blowups but is structurally blind to a CONSTANT-FACTOR
 * regression (a kernel that quietly starts evaluating every candidate twice runs
 * "flat", just 2× hotter, and the trend bound never moves). Absolute-ms thresholds
 * are owner-REJECTED (machine-dependent, flaky). This gate is the third leg: the
 * townMapOpBudget OP_CEILING idiom generalized to the advance pipeline — a
 * machine-independent OP-COUNT proxy, counted per advance from the simulate
 * result, pinned under generous ceilings so a constant-factor blow-up in the tick
 * reds DETERMINISTICALLY while normal tuning drift passes.
 *
 * WHAT THE PROXY COUNTS (all from the simulateCampaignWorldPulse result — no src
 * instrumentation, no clock):
 *   FLOWS — receipts of work done THIS advance:
 *     · candidates        — candidate outcomes minted across every kernel family
 *     · rolls             — roll explanations emitted (candidate evaluations)
 *     · selected/applied  — outcomes selected + impacts auto-applied
 *     · proposals         — DM-facing proposals surfaced
 *     · settlementWrites  — per-settlement update payloads written
 *     · newsMints         — wizardNews entries stamped with THIS advance's tick
 *   STOCKS the pipeline ITERATES every advance (per-tick loop sizes — a stock of
 *   N stressors IS ~N ops of stressor aging each tick):
 *     · stressorLoad · queuedImpactLoad · arrivalLoad · rumorLoad · historyLoad
 *
 * The fixture mirrors moverCompositionSmoke's everything-on drive (the LITERAL
 * SIMULATION_RULE_PRESETS.full_simulation.rules — war stack + commodity flow +
 * seasons + faith + spatial modulation), 4 settlements × 24 weekly ticks, fixed
 * seed. That smoke separately pins the preset's flag coverage, ALIVE/BOUNDED
 * envelopes, and seed sensitivity; THIS file pins only the op budget + its
 * determinism. Same seed ⇒ same counts, exactly — the ceilings' ~1.4–2× headroom
 * exists so legitimate tuning/behavior drift passes review-visibly, while a
 * constant-factor explosion cannot.
 *
 * CANNOT-CATCH (honest limits): this bounds OP-COUNT, not PER-OP COST. A kernel
 * that goes O(n²) INSIDE one evaluation while emitting the same receipts is
 * invisible here (that is the wall-time trend's half); so is work that surfaces
 * nothing in the result (a pure internal recompute), and news minted then evicted
 * by the feed cap under-counts. The proxy is a floor on visibility, not a census
 * of cycles — the two gates together (op-count × time-trend) are the coverage.
 *
 * Set TICK_OP_BUDGET_REPORT=1 to print the measured per-component totals.
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICKS = 24;
const SEED = 'op-budget-seed';
const FULL_SIM_RULES = SIMULATION_RULE_PRESETS.full_simulation.rules;

// ── THE CEILINGS (measured on SEED @ 24 ticks on 2026-07-21, then pinned
// ~1.4–1.5× ABOVE — the class-catching philosophy: generous enough that tuning
// drift passes, tight enough that a ~1.5×+ constant-factor blow-up in any
// counted family reds). Measured totals are in the trailing comment on each
// line; same seed ⇒ these are EXACT, so any future drift is a real behavior
// change, not noise.
const COMPONENT_CEILINGS = {
  candidates: 1800, //     measured 1205
  rolls: 1500, //          measured 1054
  selected: 750, //        measured 502
  applied: 600, //         measured 410
  proposals: 140, //       measured 92
  settlementWrites: 140, // measured 96 (4 settlements × 24 ticks = the hard shape; a double-write per settlement ⇒ 192 ⇒ red)
  newsMints: 750, //       measured 513
  stressorLoad: 220, //    measured 150
  queuedImpactLoad: 300, // measured 207
  arrivalLoad: 70, //      measured 46
  rumorLoad: 140, //       measured 96
  historyLoad: 450, //     measured 300 (Σ 1..24 exactly — 1 record/tick, triangular; 2/tick ⇒ 600 ⇒ red)
};
// The grand total, pinned independently (Σ measured = 4671; ~1.4×).
const OP_CEILING = 6500;
// The worst single advance (measured max 256 @ tick 16; ~1.55× — one hot tick
// may not hide inside a quiet run's total).
const ADVANCE_CEILING = 400;
// Anti-vacuity floor: an everything-on 24-tick drive that "does" fewer ops than
// this has gone dark (a flag drop, a dead fixture) — the budget must never pass
// vacuously. Well under half of measured.
const OP_FLOOR = 2000;

// ── The fixture: moverCompositionSmoke's everything-on shape (kept in parallel
// deliberately — test files cannot share code without cross-registering suites).
const IDS = ['a', 'b', 'c', 'd'];
const GRAIN = 'Bulk grain and foodstuffs';
const deity = (ref, name, align, law, rank) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = {
  lg: deity('custom:ob_dawn', 'Dawnfather', 'good', 'lawful', 'major'),
  ce: deity('custom:ob_maw', 'The Maw', 'evil', 'chaotic', 'major'),
  le: deity('custom:ob_ledger', 'The Ledger', 'evil', 'lawful', 'minor'),
};

function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  const placements = placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function settlementFor(name, patron, cults, { exports = [], imports = [] } = {}) {
  return {
    name, tier: 'town', population: 1600,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
      ...(cults && cults.length ? { cultDeitySnapshots: cults } : {}),
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
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}
const saveFor = (id, name, patron, cults, opts) => ({
  id, name, phase: 'canon', settlement: settlementFor(name, patron, cults, opts),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});
const grainChannel = (to) => ({
  id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to,
  goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed',
});

function makeCampaignAndSaves(seed) {
  const saves = [
    saveFor('a', 'Ashford', D.lg, [], { exports: [GRAIN], imports: [] }),
    saveFor('b', 'Briarwatch', D.ce, [D.le], { imports: [GRAIN] }),
    saveFor('c', 'Crownhold', D.lg, [], { imports: [GRAIN] }),
    saveFor('d', 'Deepmoor', D.ce, [], { imports: [GRAIN] }),
  ];
  const campaign = {
    id: 'op-budget', name: 'Tick Op Budget', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1,
      simulationRules: { ...FULL_SIM_RULES },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 },
      ],
      spatialCanonVersion: 1,
      spatialDigest: spatialDigest(),
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        { id: 'edge.c.d', from: 'c', to: 'd', relationshipType: 'hostile' },
        { id: 'edge.a.d', from: 'a', to: 'd', relationshipType: 'ally' },
      ],
      channels: [grainChannel('b'), grainChannel('c'), grainChannel('d')],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** One advance's op row — every countable work receipt on the simulate result. */
function opRow(r) {
  const tick = r.worldState?.tick;
  return {
    tick,
    candidates: (r.candidates || []).length,
    rolls: (r.rollExplanations || []).length,
    selected: (r.selected || []).length,
    applied: (r.autoApplied || []).length,
    proposals: (r.proposals || []).length,
    settlementWrites: (r.settlementUpdates || []).length,
    newsMints: (r.wizardNews?.entries || []).filter((e) => e?.tick === tick).length,
    stressorLoad: (r.worldState?.stressors || []).length,
    queuedImpactLoad: (r.regionalGraph?.queuedImpacts || []).length,
    arrivalLoad: Object.keys(r.worldState?.spatialLedgers?.spatialArrivals || {}).length,
    rumorLoad: Object.keys(r.worldState?.spatialLedgers?.rumorLedgers || {}).length,
    historyLoad: (r.worldState?.pulseHistory || []).length,
  };
}
const rowOps = (row) => Object.entries(row).reduce((sum, [k, v]) => (k === 'tick' ? sum : sum + v), 0);

/** Drive TICKS everything-on pulses; return the per-advance op rows. */
function drive(seed) {
  let { campaign, saves } = makeCampaignAndSaves(seed);
  const rows = [];
  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    rows.push(opRow(r));
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews };
  }
  return rows;
}

const componentTotals = (rows) => {
  const totals = {};
  for (const key of Object.keys(COMPONENT_CEILINGS)) totals[key] = rows.reduce((s, row) => s + row[key], 0);
  return totals;
};

describe('tick OP BUDGET — the advance pipeline does not blow up by a constant factor', () => {
  it(`${TICKS} everything-on advances stay under the op ceilings (and above the vacuity floor)`, () => {
    const rows = drive(SEED);
    const totals = componentTotals(rows);
    const totalOps = rows.reduce((s, row) => s + rowOps(row), 0);
    const worst = rows.reduce((a, b) => (rowOps(b) > rowOps(a) ? b : a));

    if (process.env.TICK_OP_BUDGET_REPORT === '1') {
      console.log(JSON.stringify({ totals, totalOps, worstAdvance: { tick: worst.tick, ops: rowOps(worst) } }, null, 2));
    }

    // 1. Every counted family stays under its ceiling — component resolution so a
    // doubling in one family cannot hide behind a quiet run elsewhere.
    for (const [key, ceiling] of Object.entries(COMPONENT_CEILINGS)) {
      expect(
        totals[key],
        `${key} did ${totals[key]} ops over ${TICKS} advances (> ${ceiling}) — a constant-factor regression in this family; find the hot kernel before touching the ceiling`,
      ).toBeLessThanOrEqual(ceiling);
    }

    // 2. The grand total is bounded.
    expect(
      totalOps,
      `the advance pipeline did ${totalOps} ops over ${TICKS} ticks (> ${OP_CEILING}) — a constant-factor blow-up; re-measure and justify before raising`,
    ).toBeLessThanOrEqual(OP_CEILING);

    // 3. No single advance spikes past the per-advance ceiling.
    expect(
      rowOps(worst),
      `advance at tick ${worst.tick} did ${rowOps(worst)} ops (> ${ADVANCE_CEILING})`,
    ).toBeLessThanOrEqual(ADVANCE_CEILING);

    // 4. ANTI-VACUITY: the everything-on drive actually works — a dark fixture
    // (dropped flag, dead seed) must red, never pass an empty budget.
    expect(totalOps, 'the everything-on drive went dark — the budget is vacuous').toBeGreaterThan(OP_FLOOR);
    for (const key of ['candidates', 'rolls', 'applied', 'settlementWrites', 'newsMints']) {
      expect(totals[key], `${key} never happened over ${TICKS} everything-on ticks — coverage went dark`).toBeGreaterThan(0);
    }
  });

  it('the op count is DETERMINISTIC: same seed ⇒ the same per-advance rows, exactly', () => {
    // Machine-independence is only real if the count is a pure function of the
    // seed — no clock, no iteration-order leak, no environment sensitivity.
    expect(drive(SEED)).toEqual(drive(SEED));
  });
});
