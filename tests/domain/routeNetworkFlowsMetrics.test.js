/**
 * routeNetworkFlowsMetrics.test.js — W-J slice J2, THE MATERIAL OBJECTIVE and
 * REALM SELF-SUFFICIENCY (docs/DESIGN_ROUTE_LIFECYCLE.md §5, §13).
 *
 * The metric is the thing the tuning pass will steer by, so the pins here are
 * about HONESTY before they are about arithmetic:
 *
 *   MONOTONICITY WITH A CAUSE. Closing a material loop must raise the metric, and
 *   the fixture pair differs in exactly one thing (one edge) so a rising number
 *   names its cause. This is the soak envelope §13 asks for, proved on a
 *   constructed realm where the answer is knowable by hand.
 *
 *   BOUNDED, ALWAYS. Every fixture in the family, including the degenerate ones,
 *   answers inside 0..1. `it.each` rather than a loop, so vitest reports the true
 *   count of failures instead of the first one.
 *
 *   THE COUNTERFACTUAL. §5's dual-benefit mercy asks whether REMOVING an edge
 *   would strand a loop. Asked of a network that still contains the edge, the
 *   answer is always no, and the mercy rule would never once fire. That trap is
 *   pinned directly.
 *
 *   GATED EMISSION. A dark world emits no key at all, not a zero. A zero in a
 *   self-sufficiency column reads as a starving realm; absence reads as an
 *   instrument that was never switched on, which is the truth.
 */
import { describe, it, expect } from 'vitest';
import {
  SELF_SUFFICIENCY_WEIGHTS,
  measureRealmSelfSufficiency,
  observeRealmSelfSufficiency,
  realmSustenance01,
  selfSufficiencyMembersFromSaves,
} from '../../src/domain/worldPulse/routeNetworkFlowsSelfSufficiency.js';
import {
  ROUTE_OBJECTIVE_TUNING,
  corridorCost01,
  isSystemCritical,
  scoreEdgeRemoval,
  scoreMaterialObjective,
} from '../../src/domain/worldPulse/routeNetworkFlowsObjective.js';
import { buildMaterialIndex, wantsAcross } from '../../src/domain/worldPulse/routeNetworkFlowsMaterial.js';
import {
  emptyRouteNetwork,
  routeEdge,
  withRouteEdges,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { observeBehavioralYear } from '../../scripts/audit/behavioral-observation.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** A settlement with declared trade and, optionally, a readable food ledger. */
const seat = (id, imports, exports, food = null) => ({
  id,
  settlement: {
    economicState: {
      primaryImports: imports,
      primaryExports: exports,
      ...(food ? { foodSecurity: food } : {}),
    },
  },
});

/**
 * THE TWO-SEATED REALM the monotonicity pin turns on: north grows the grain and
 * wants the iron, south digs the iron and wants the grain. Every want the realm
 * has is satisfiable from inside the realm, so the ONLY thing that can be wrong
 * is whether a road exists.
 */
const LOOP_MEMBERS = [
  seat('north', ['iron'], ['grain'], { dailyNeed: 100, dailyProduction: 140 }),
  seat('south', ['grain'], ['iron'], { dailyNeed: 100, dailyProduction: 40 }),
];

const road = (a, b, grade = 'road') => routeEdge({
  a, b, grade, mode: 'land', provenance: 'generated', flavor: 'genesis', tick: 0,
});

const SEVERED = emptyRouteNetwork();
const LINKED = withRouteEdges(SEVERED, [road('north', 'south')]);
const OVERGROWN = withRouteEdges(SEVERED, [road('north', 'south', 'hidden')]);

describe('J2 self-sufficiency rises when a material loop closes (the §13 envelope)', () => {
  const severed = measureRealmSelfSufficiency({ members: LOOP_MEMBERS, network: SEVERED });
  const linked = measureRealmSelfSufficiency({ members: LOOP_MEMBERS, network: LINKED });

  it('the two fixtures differ in exactly one edge, so a rising number names its cause', () => {
    expect(Object.keys(SEVERED.edges)).toEqual([]);
    expect(Object.keys(LINKED.edges)).toEqual(['route.north.south.land']);
  });

  it('the road RAISES the metric', () => {
    expect(linked.selfSufficiency01).toBeGreaterThan(severed.selfSufficiency01);
  });

  it('and it raises it through CIRCULATION, leaving the economy terms alone', () => {
    expect(severed.circulation01).toBe(0);
    expect(linked.circulation01).toBe(1);
    // Provision and sustenance are facts about production, not about roads: a road
    // that moved either of them would mean the metric was double counting.
    expect(linked.provision01).toBe(severed.provision01);
    expect(linked.sustenance01).toBe(severed.sustenance01);
  });

  it('the stranded-wants diagnosis separates a roads problem from an economy one', () => {
    expect(severed.strandedWants).toBe(2);
    expect(severed.providedGoods).toBe(severed.wantedGoods);
    expect(linked.strandedWants).toBe(0);
  });

  it('an OVERGROWN path is not a supply route (hidden is a remnant, not a road)', () => {
    const overgrown = measureRealmSelfSufficiency({ members: LOOP_MEMBERS, network: OVERGROWN });
    expect(overgrown.circulation01).toBe(0);
    expect(overgrown.selfSufficiency01).toBe(severed.selfSufficiency01);
    // anchored: the LINKED reading above proves the same two seats DO connect through
    // this same function when the edge is a real road, so the zero measures the grade
    // exclusion rather than a connectivity walk that never runs.
    expect(linked.circulation01).toBe(1);
  });

  it('a realm that cannot MAKE what it wants is diagnosed as economy, not roads', () => {
    const cannot = [
      seat('north', ['silk'], ['grain'], { dailyNeed: 100, dailyProduction: 140 }),
      seat('south', ['grain'], ['iron'], { dailyNeed: 100, dailyProduction: 40 }),
    ];
    const reading = measureRealmSelfSufficiency({ members: cannot, network: LINKED });
    expect(reading.wantedGoods).toBe(2);
    expect(reading.providedGoods).toBe(1);
    expect(reading.provision01).toBeLessThan(1);
    expect(reading.strandedWants).toBe(0);
  });
});

describe('J2 the metric is bounded on every realm, including the degenerate ones', () => {
  const FAMILY = [
    ['an empty realm', [], SEVERED],
    ['one seat, alone', [seat('only', [], [])], SEVERED],
    ['a realm that wants nothing', [seat('a', [], ['grain']), seat('b', [], ['iron'])], LINKED],
    ['a realm that wants everything and makes nothing', [seat('a', ['silk'], []), seat('b', ['silk'], [])], SEVERED],
    ['the severed loop', LOOP_MEMBERS, SEVERED],
    ['the closed loop', LOOP_MEMBERS, LINKED],
    ['a famine realm', [seat('a', [], [], { dailyNeed: 500, dailyProduction: 1 })], SEVERED],
    ['a glut realm', [seat('a', [], [], { dailyNeed: 10, dailyProduction: 9000 })], SEVERED],
  ];

  it.each(FAMILY)('%s answers inside 0..1', (_label, members, network) => {
    const reading = measureRealmSelfSufficiency({ members, network });
    expect(reading.selfSufficiency01).toBeGreaterThanOrEqual(0);
    expect(reading.selfSufficiency01).toBeLessThanOrEqual(1);
    for (const key of ['provision01', 'circulation01']) {
      expect(reading[key]).toBeGreaterThanOrEqual(0);
      expect(reading[key]).toBeLessThanOrEqual(1);
    }
    if (reading.sustenance01 != null) {
      expect(reading.sustenance01).toBeGreaterThanOrEqual(0);
      expect(reading.sustenance01).toBeLessThanOrEqual(1);
    }
  });

  it('a realm that wants nothing reads 1, and the reason is stated not stumbled into', () => {
    const nothing = measureRealmSelfSufficiency({
      members: [seat('a', [], ['grain'])], network: SEVERED,
    });
    expect(nothing.wantedGoods).toBe(0);
    expect(nothing.provision01).toBe(1);
    expect(nothing.circulation01).toBe(1);
  });

  it('a glut cannot push the food term past adequate', () => {
    expect(realmSustenance01([seat('a', [], [], { dailyNeed: 10, dailyProduction: 9000 })]))
      .toBe(1);
  });
});

describe('J2 an unreadable food ledger is an absent instrument, never a zero', () => {
  it('reports null rather than a starving realm when no settlement carries food', () => {
    expect(realmSustenance01([seat('a', ['iron'], ['grain'])])).toBe(null);
    const reading = measureRealmSelfSufficiency({ members: LOOP_MEMBERS.map(m => seat(m.id,
      [...(m.settlement.economicState.primaryImports)],
      [...(m.settlement.economicState.primaryExports)])), network: LINKED });
    expect(reading.sustenance01).toBe(null);
  });

  it('and the remaining weights renormalize instead of scoring the gap', () => {
    const foodless = LOOP_MEMBERS.map(m => seat(m.id,
      [...(m.settlement.economicState.primaryImports)],
      [...(m.settlement.economicState.primaryExports)]));
    const reading = measureRealmSelfSufficiency({ members: foodless, network: LINKED });
    // Provision 1 and circulation 1 with sustenance excluded is a perfect 1, NOT the
    // 0.6 a silently zeroed third component would produce.
    expect(reading.selfSufficiency01).toBe(1);
    expect(SELF_SUFFICIENCY_WEIGHTS.provision + SELF_SUFFICIENCY_WEIGHTS.circulation
      + SELF_SUFFICIENCY_WEIGHTS.sustenance).toBeCloseTo(1, 10);
  });
});

describe('J2 the material objective scores local, system, resilience and cost (§5)', () => {
  const index = buildMaterialIndex({ members: LOOP_MEMBERS, network: SEVERED });
  const score = scoreMaterialObjective({ index, a: 'north', b: 'south', worldState: null });

  it('names the wants in the goods vocabulary, in both directions', () => {
    const wants = wantsAcross(index, 'north', 'south');
    expect(wants.map(w => `${w.good}:${w.fromId}->${w.toId}`).sort())
      .toEqual(['grain:north->south', 'iron:south->north']);
    expect(wants.every(w => w.goodLabel.length > 0)).toBe(true);
  });

  it('carries the goods-denominated reason a Herald beat would quote', () => {
    expect([...score.reasonGoods].sort()).toEqual(['grain', 'iron']);
  });

  it('a corridor that closes every loop scores local and system at their ceiling', () => {
    expect(score.local01).toBe(1);
    expect(score.system01).toBe(1);
    expect(score.unservedWants).toBe(2);
  });

  it('a corridor whose wants a road already serves loses its SYSTEM term', () => {
    const served = buildMaterialIndex({ members: LOOP_MEMBERS, network: LINKED });
    const redundant = scoreMaterialObjective({ index: served, a: 'north', b: 'south', worldState: null });
    expect(redundant.local01).toBe(1);
    expect(redundant.system01).toBe(0);
    // The product is what makes appetite alone insufficient: a sum would still buy
    // this road on its local term.
    expect(redundant.local01 * redundant.system01).toBe(0);
    expect(redundant.score).toBeLessThan(score.score);
  });

  it('but it earns the RESILIENCE credit, which is why resilience is added not multiplied', () => {
    const served = buildMaterialIndex({ members: LOOP_MEMBERS, network: LINKED });
    const redundant = scoreMaterialObjective({ index: served, a: 'north', b: 'south', worldState: null });
    expect(redundant.resilience01).toBeGreaterThan(0);
    expect(score.resilience01).toBe(0);
  });

  it('a pair with nothing to trade scores its cost as a negative', () => {
    const barren = buildMaterialIndex({
      members: [seat('a', [], []), seat('b', [], [])], network: SEVERED,
    });
    const nothing = scoreMaterialObjective({ index: barren, a: 'a', b: 'b', worldState: null });
    expect(nothing.local01).toBe(0);
    expect(nothing.score).toBeLessThan(0);
  });

  it('an aspatial realm pays the stated middling cost, not a free road', () => {
    expect(corridorCost01(null, 'north', 'south'))
      .toBe(ROUTE_OBJECTIVE_TUNING.ASPATIAL_COST01);
    expect(ROUTE_OBJECTIVE_TUNING.ASPATIAL_COST01).toBeGreaterThan(0);
  });

  it('an UNREACHABLE pair pays the ceiling (isolation as fate reaches the objective)', () => {
    const spatial = { spatialCanonVersion: 1, spatialDigest: { distanceMatrix: { north: {} } } };
    expect(corridorCost01(spatial, 'north', 'faraway'))
      .toBe(ROUTE_OBJECTIVE_TUNING.UNREACHABLE_COST01);
  });
});

describe('J2 the dual-benefit mercy is a COUNTERFACTUAL, and asking it wrong never fires', () => {
  it('scoring the LIVE network says no edge is ever system critical (the trap)', () => {
    const served = buildMaterialIndex({ members: LOOP_MEMBERS, network: LINKED });
    const naive = scoreMaterialObjective({ index: served, a: 'north', b: 'south', worldState: null });
    expect(naive.unservedWants).toBe(0);
    expect(isSystemCritical(naive)).toBe(false);
  });

  it('scoring the network MINUS the edge is what makes the mercy fire', () => {
    const counterfactual = scoreEdgeRemoval({
      members: LOOP_MEMBERS, network: LINKED, edgeId: 'route.north.south.land', worldState: null,
    });
    expect(counterfactual).toBeTruthy();
    expect(counterfactual.unservedWants).toBe(2);
    expect(isSystemCritical(counterfactual)).toBe(true);
  });

  it('an edge whose loop another road also closes is NOT system critical', () => {
    const triangle = [
      seat('north', ['iron'], ['grain']),
      seat('south', ['grain'], ['iron']),
      seat('east', [], ['iron']),
    ];
    const twoWays = withRouteEdges(emptyRouteNetwork(), [
      road('north', 'south'), road('north', 'east'),
    ]);
    const cut = scoreEdgeRemoval({
      members: triangle, network: twoWays, edgeId: 'route.north.south.land', worldState: null,
    });
    // north still reaches iron through east, so removing this edge strands only the
    // grain that south wants.
    expect(cut.wants.filter(w => w.good === 'iron' && !w.alreadyServed)).toEqual([]);
    expect(cut.unservedWants).toBe(1);
  });

  it('asking about an edge that does not exist answers null, never a fabricated score', () => {
    expect(scoreEdgeRemoval({
      members: LOOP_MEMBERS, network: LINKED, edgeId: 'route.no.such.land', worldState: null,
    })).toBe(null);
  });
});

describe('J2 the observation emission is additive and gated (§5, §13)', () => {
  const saves = LOOP_MEMBERS.map(m => ({ id: m.id, settlement: m.settlement }));

  /** A minimal pulse result in the soak's own shape. */
  const resultFor = (lit, network) => ({
    tick: 52,
    worldState: {
      tick: 52,
      simulationRules: lit ? { routeLifecycleEnabled: true } : {},
      ...(network ? { spatialLedgers: { routeNetwork: network } } : {}),
    },
  });

  it('a DARK year record carries no self-sufficiency key at all', () => {
    const year = observeBehavioralYear({
      year: 1, result: resultFor(false, LINKED), beforeSaves: saves, afterSaves: saves,
    });
    expectAbsentWithAnchor(
      Object.keys(year), 'realmSelfSufficiency', 'beliefDivergence',
      'a dormant route lifecycle emitted a self-sufficiency reading, which would'
      + ' record a dark run as a measured one',
    );
    expect(observeRealmSelfSufficiency({ worldState: resultFor(false, LINKED).worldState, saves }))
      .toBe(null);
  });

  it('a LIT year record carries it, bounded, beside the v5 fields it did not touch', () => {
    const year = observeBehavioralYear({
      year: 1, result: resultFor(true, LINKED), beforeSaves: saves, afterSaves: saves,
    });
    expect(year.realmSelfSufficiency).toBeTruthy();
    expect(year.realmSelfSufficiency.selfSufficiency01).toBeGreaterThanOrEqual(0);
    expect(year.realmSelfSufficiency.selfSufficiency01).toBeLessThanOrEqual(1);
    // ADDITIVE: the fields the envelope already promised are still present and still
    // mean what they meant, which is the whole claim behind not bumping the version.
    for (const key of ['year', 'eventCount', 'moverCounts', 'motion', 'stateVectors',
      'beliefDivergence']) {
      expect(key in year, `the additive field displaced ${key}`).toBe(true);
    }
  });

  it('the emitted reading tracks the network, so the series can actually move', () => {
    const severed = observeBehavioralYear({
      year: 1, result: resultFor(true, SEVERED), beforeSaves: saves, afterSaves: saves,
    });
    const linked = observeBehavioralYear({
      year: 2, result: resultFor(true, LINKED), beforeSaves: saves, afterSaves: saves,
    });
    expect(linked.realmSelfSufficiency.selfSufficiency01)
      .toBeGreaterThan(severed.realmSelfSufficiency.selfSufficiency01);
  });

  it('the save adapter reads both save shapes, so no reading is silently empty', () => {
    expect(selfSufficiencyMembersFromSaves(saves).map(m => m.id)).toEqual(['north', 'south']);
    const bare = [{ id: 'north', economicState: { primaryImports: ['iron'] } }];
    expect(selfSufficiencyMembersFromSaves(bare)[0].settlement.economicState.primaryImports)
      .toEqual(['iron']);
    expect(selfSufficiencyMembersFromSaves(null)).toEqual([]);
  });
});
