/**
 * routeNetworkDanger.test.js — W-J slice J3, SAFETY VS GREED and BYPASS GEOMETRY
 * (binding law docs/DESIGN_ROUTE_LIFECYCLE.md §5b and §5c, with §1 Law 1 and
 * Law 4).
 *
 * The claims this file is responsible for:
 *
 *   ROUTING READS THE BELIEVED PICTURE. The sharp version of §5b, proved in both
 *   directions on one fixture: a corridor merely FEARED dangerous suppresses its
 *   own charter while the truth ledger says calm, and a corridor genuinely
 *   dangerous that nobody has heard about charters anyway. A pin that only tested
 *   the first direction would pass against a layer that read truth and happened to
 *   have a scared fixture.
 *
 *   GREED IS A PURCHASE, NOT AN EXEMPTION. The same danger, two objectives: the
 *   strong one buys its way through and is MARKED as having done so; the weak one
 *   defers. And the bar rises with the danger, so a war zone costs more than a
 *   nervous road.
 *
 *   THE BYPASS FEEDBACK IS A NUMBER. §5c's gift is that an unsafe settlement
 *   LOSES ITS THROUGH-TRAFFIC. That is measured here, before and after, on a
 *   spatially canonized realm: the count falls to zero for the feared town and
 *   RISES for the town the wagons swing through instead, which is the same
 *   traffic arriving somewhere else rather than a census that stopped counting.
 *
 * Sibling files: routeNetworkCharter.test.js (§6), routeNetworkDecay.test.js (§7).
 */
import { describe, expect, it } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import {
  accrueRouteFlows,
  flowMembersFromSnapshot,
} from '../../src/domain/worldPulse/routeNetworkFlows.js';
import { ensureGenesisRouteNetwork } from '../../src/domain/worldPulse/routeNetworkGenesis.js';
import {
  emptyRouteNetwork,
  readRouteNetwork,
  routeEdge,
  withRouteEdges,
  writeRouteNetwork,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import {
  ROUTE_DANGER_TUNING,
  believedDangerAt,
  clearsRiskPremium,
  corridorDanger01,
  dangerAdjustedCost01,
  dangerLossRate01,
  defersForEmbattlement,
  riskPremiumBar,
  routeLossPremium,
  routeRiskTolerance,
  survivingUsageTally,
} from '../../src/domain/worldPulse/routeNetworkCharterDanger.js';
import {
  ROUTE_BYPASS_KEY,
  ROUTE_BYPASS_TUNING,
  deriveBypass,
  fearedDangerAt,
  readEdgeBypass,
  sweepBypassGeometry,
  throughTrafficAt,
  throughTrafficCensus,
} from '../../src/domain/worldPulse/routeNetworkCharterBypass.js';
import { evaluateRouteCharters } from '../../src/domain/worldPulse/routeNetworkCharter.js';
import {
  ROUTE_DECAY_TUNING,
  demoteDwellFor,
  survivingEdgeUsage,
  sweepRouteDecay,
} from '../../src/domain/worldPulse/routeNetworkDecay.js';

// ── §5b: THE ASPATIAL DANGER FIXTURE ─────────────────────────────────────────
// Aspatial by design for the objective arms: with no geometry the danger reading
// is the endpoints' own, which is the smallest fixture that can express "this
// place is a war zone" without also dragging a travel-cost matrix into the pin.

/**
 * A realm whose ashfen-dunmoor corridor has accumulated demand. `brackwaterIron`
 * is the knob that decides whether ashfen's iron want is already served, which is
 * the only difference between the strong and weak objective arms.
 */
function dangerRealm({ brackwaterIron = false, passes = 16 } = {}) {
  const members = flowMembersFromSnapshot([
    {
      id: 'ashfen',
      settlement: {
        config: { tradeRouteAccess: 'crossroads' },
        economicState: { primaryImports: ['iron'], primaryExports: ['grain'] },
      },
    },
    {
      id: 'brackwater',
      settlement: {
        config: { tradeRouteAccess: 'road' },
        economicState: { primaryImports: [], primaryExports: brackwaterIron ? ['iron'] : [] },
      },
    },
    {
      id: 'dunmoor',
      settlement: {
        config: { tradeRouteAccess: 'isolated' },
        economicState: { primaryImports: ['grain'], primaryExports: ['iron'] },
      },
    },
  ]);
  let world = ensureGenesisRouteNetwork(
    { simulationRules: { routeLifecycleEnabled: true }, tick: 0, campaignId: 'route-danger' },
    members.map(m => ({ id: m.id, config: m.config })), 0,
  );
  for (let tick = 1; tick <= passes; tick += 1) {
    world = accrueRouteFlows({
      worldState: {
        ...world,
        spatialLedgers: {
          ...(world.spatialLedgers || {}),
          migration: { 'col.a': { originId: 'ashfen', destId: 'dunmoor', arrivals: 640 } },
        },
      },
      members,
      tick,
    }).worldState;
  }
  return { world, members };
}

/** The M1 embattlement ledger, planted on one seat. */
const withEmbattlement = (world, id, level) => ({
  ...world,
  spatialLedgers: {
    ...(world.spatialLedgers || {}),
    embattlement: { [id]: { level, phase: 'embattled', sinceTick: 0, lastTick: 0 } },
  },
});

const CORRIDOR = 'corridor.ashfen.dunmoor';
const verdictFor = (world, members, tick = 20) => evaluateRouteCharters({ worldState: world, members, tick })
  .verdicts.find(v => v.corridorId === CORRIDOR);

describe('J3 §5b danger is the M1 vocabulary, priced onto the §5 cost term', () => {
  it('zero danger returns the input cost EXACTLY, so a peaceful realm is unchanged', () => {
    const calm = { danger01: 0, tolerance: 1, endpointDanger01: 0, fearedBy: '', path: [] };
    expect(dangerAdjustedCost01(0.35, calm)).toBe(0.35);
    expect(dangerAdjustedCost01(0.35, null)).toBe(0.35);
  });

  it('danger raises the cost, monotonically, and stays bounded at one', () => {
    const at = (danger01) => dangerAdjustedCost01(0.35, {
      danger01, tolerance: 1, endpointDanger01: danger01, fearedBy: '', path: [],
    });
    expect(at(0.25)).toBeGreaterThan(at(0));
    expect(at(0.75)).toBeGreaterThan(at(0.25));
    expect(dangerAdjustedCost01(1, { danger01: 1, tolerance: 1, endpointDanger01: 1, fearedBy: '', path: [] }))
      .toBeLessThanOrEqual(1);
  });

  it('the SMUGGLER EXTREME is two dials in opposite directions', () => {
    // Tolerates danger: a hidden path weights the danger term least of any grade.
    expect(routeRiskTolerance('hidden')).toBeLessThan(routeRiskTolerance('track'));
    expect(routeRiskTolerance('track')).toBeLessThan(routeRiskTolerance('highway'));
    // At the steepest premium: and loses the most of what it carries.
    expect(routeLossPremium('hidden')).toBeGreaterThan(routeLossPremium('road'));
    expect(routeLossPremium('road')).toBeGreaterThan(routeLossPremium('highway'));
    // An unrecognized grade is the middle rung, never the smuggler.
    expect(routeRiskTolerance('not_a_grade')).toBe(routeRiskTolerance('track'));
    expect(routeLossPremium('not_a_grade')).toBe(routeLossPremium('track'));
  });

  it('the reading is symmetric in its endpoints and keeps the frightened one', () => {
    const scared = withEmbattlement(dangerRealm().world, 'dunmoor', 0.8);
    const forward = corridorDanger01({ worldState: scared, a: 'ashfen', b: 'dunmoor', grade: 'track' });
    const backward = corridorDanger01({ worldState: scared, a: 'dunmoor', b: 'ashfen', grade: 'track' });
    expect(backward.danger01).toBe(forward.danger01);
    expect(backward.endpointDanger01).toBe(forward.endpointDanger01);
    expect(forward.endpointDanger01).toBe(0.8);
  });
});

describe('J3 §5b routing reads the BELIEVED picture, in BOTH directions', () => {
  /** A spatially canonized, non-omniscient realm: beliefs are live. */
  function believingRealm() {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    const placements = placeSettlements(pack, 4, 's');
    const digest = buildSpatialDigest({ pack, placements });
    return {
      simulationRules: { routeLifecycleEnabled: true, infoMode: 'unreliable' },
      tick: 10,
      spatialCanonVersion: 1,
      spatialDigest: digest,
    };
  }

  const dangerRumour = (whereId) => ({
    'r.1': {
      arrivalTick: 10,
      content: { what: 'siege_opened', magnitude: 3, whereId, partyIds: [] },
    },
  });

  it('a corridor merely FEARED dangerous reads danger while the truth is calm', () => {
    const world = {
      ...believingRealm(),
      spatialLedgers: { rumorLedgers: { s000: dangerRumour('s001'), s001: dangerRumour('s001') } },
    };
    // No embattlement ledger at all: the region is genuinely calm.
    expect(believedDangerAt({ ...world, simulationRules: { routeLifecycleEnabled: true } }, null, 's001'))
      .toBe(0);
    const reading = corridorDanger01({ worldState: world, a: 's000', b: 's001', grade: 'track' });
    expect(reading.endpointDanger01).toBeGreaterThan(0);
    expect(defersForEmbattlement(reading)).toBe(true);
  });

  it('a corridor genuinely dangerous that nobody has heard about reads CALM', () => {
    const world = {
      ...believingRealm(),
      spatialLedgers: {
        embattlement: { s001: { level: 0.9, phase: 'embattled', sinceTick: 0, lastTick: 10 } },
        rumorLedgers: {},
      },
    };
    // The truth is loud, and the observers are ignorant, so the charter proceeds
    // and the caravans find out the hard way. That asymmetry IS the epistemics.
    expect(believedDangerAt(world, null, 's001')).toBe(0.9);
    const reading = corridorDanger01({ worldState: world, a: 's000', b: 's001', grade: 'track' });
    expect(reading.endpointDanger01).toBe(0);
    expect(defersForEmbattlement(reading)).toBe(false);
  });
});

describe('J3 §5b embattled regions DEFER, and greed carries a road through anyway', () => {
  it('a war zone defers a charter that the identical calm corridor would win', () => {
    const { world, members } = dangerRealm();
    expect(verdictFor(world, members).verdict).toBe('charter');
    const scared = withEmbattlement(world, 'dunmoor', 0.95);
    const deferred = verdictFor(scared, members);
    expect(deferred.verdict).toBe('deferred_embattled');
    expect(deferred.danger01).toBeGreaterThanOrEqual(
      Number(ROUTE_DANGER_TUNING.EMBATTLED_DEFER_LEVEL),
    );
  });

  it('a deferral REMOVES NOTHING: the corridor and its demand are untouched', () => {
    const { world, members } = dangerRealm();
    const scared = withEmbattlement(world, 'dunmoor', 0.95);
    const swept = evaluateRouteCharters({ worldState: scared, members, tick: 20 });
    const before = readRouteNetwork(scared).corridor[CORRIDOR];
    const after = readRouteNetwork(swept.worldState).corridor[CORRIDOR];
    expect(after.tally).toEqual(before.tally);
    expect(Object.keys(readRouteNetwork(swept.worldState).edges))
      .toEqual(Object.keys(readRouteNetwork(scared).edges));
  });

  it('THE GREED OVERRIDE: a strong objective buys its way through, and is marked', () => {
    const strong = dangerRealm({ brackwaterIron: false });
    const scared = withEmbattlement(strong.world, 'dunmoor', 0.6);
    const verdict = verdictFor(scared, strong.members);
    expect(verdict.verdict).toBe('charter');
    expect(verdict.riskPremium).toBe(true);
    expect(verdict.score).toBeGreaterThanOrEqual(riskPremiumBar(verdict.danger01));
  });

  it('the SAME danger on a weaker objective defers: the override is a purchase', () => {
    // The only difference from the arm above is that brackwater also exports iron,
    // so ashfen's want is already served and the corridor is worth less.
    const weak = dangerRealm({ brackwaterIron: true });
    const scared = withEmbattlement(weak.world, 'dunmoor', 0.6);
    const verdict = verdictFor(scared, weak.members);
    expect(verdict.verdict).toBe('deferred_embattled');
    expect(verdict.riskPremium).toBe(false);
    expect(verdict.score).toBeLessThan(riskPremiumBar(verdict.danger01));
  });

  it('the bar RISES with danger, so a war zone costs more than a nervous road', () => {
    expect(riskPremiumBar(0.9)).toBeGreaterThan(riskPremiumBar(0.4));
    expect(riskPremiumBar(0)).toBe(Number(ROUTE_DANGER_TUNING.RISK_PREMIUM_BASE));
    // A corridor with NO danger is not an override case at all: the ordinary bar
    // governs it, and calling a safe charter a risk-premium one would make the
    // word meaningless in every receipt that carries it.
    expect(clearsRiskPremium(0.9, { danger01: 0, tolerance: 1, endpointDanger01: 0, fearedBy: '', path: [] }))
      .toBe(false);
    expect(clearsRiskPremium(0.9, { danger01: 0.4, tolerance: 1, endpointDanger01: 0.4, fearedBy: '', path: [] }))
      .toBe(true);
  });
});

describe('J3 §5b the loss feedback: greed that keeps losing caravans starves its road', () => {
  it('the loss rate rises with danger, is steepest on hidden, and is bounded', () => {
    expect(dangerLossRate01(0, 'road')).toBe(0);
    expect(dangerLossRate01(0.8, 'road')).toBeGreaterThan(dangerLossRate01(0.3, 'road'));
    expect(dangerLossRate01(0.8, 'hidden')).toBeGreaterThan(dangerLossRate01(0.8, 'highway'));
    expect(dangerLossRate01(1, 'hidden')).toBeLessThanOrEqual(
      Number(ROUTE_DANGER_TUNING.LOSS_RATE_MAX),
    );
  });

  it('the surviving tally is floored to exact integers (no float accumulator)', () => {
    const survived = survivingUsageTally({ goods: 7, population: 100, military: 0 }, 0.45);
    expect(survived).toEqual({ goods: 3, population: 55 });
    for (const value of Object.values(survived)) expect(Number.isInteger(value)).toBe(true);
    expect(survivingUsageTally({ goods: 10 }, 0)).toEqual({ goods: 10 });
    expect(survivingUsageTally(null, 0.5)).toEqual({});
  });

  it('the LEDGER keeps the true count while the ladder reads what arrived', () => {
    const { world, members } = dangerRealm({ passes: 0 });
    const network = readRouteNetwork(world) || emptyRouteNetwork();
    const withUsage = writeRouteNetwork(world, {
      ...network,
      edges: {
        ...network.edges,
        'route.ashfen.brackwater.land': {
          ...network.edges['route.ashfen.brackwater.land'],
          usage: { flows: { goods: 'established' }, tally: { goods: 100 }, receipts: { goods: ['shipment'] }, lastTick: 5 },
        },
      },
    });
    const scared = withEmbattlement(withUsage, 'brackwater', 0.9);
    const edge = readRouteNetwork(scared).edges['route.ashfen.brackwater.land'];
    const reading = survivingEdgeUsage({ worldState: scared, edge });
    expect(reading.lossRate01).toBeGreaterThan(0);
    expect(reading.peak).toBeLessThan(100);
    // The persisted receipt is UNTOUCHED: the discount is a reading, never a write.
    expect(readRouteNetwork(scared).edges['route.ashfen.brackwater.land'].usage.tally.goods).toBe(100);
    // And the calm twin reads the full hundred.
    const calmEdge = readRouteNetwork(withUsage).edges['route.ashfen.brackwater.land'];
    expect(survivingEdgeUsage({ worldState: withUsage, edge: calmEdge }).peak).toBe(100);
  });
});

// ── §5c: BYPASS GEOMETRY ─────────────────────────────────────────────────────

/**
 * THE SPATIAL BYPASS FIXTURE. An eight-seat grid whose cheapest road from s000 to
 * s002 runs THROUGH s001, with a genuine alternate through s003. Everything §5c
 * claims is expressed on that one geometry.
 */
function bypassRealm() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, 8, 's');
  const digest = buildSpatialDigest({ pack, placements });
  const ids = ['s000', 's001', 's002', 's003', 's004', 's005', 's006', 's007'];
  const members = flowMembersFromSnapshot(ids.map(id => ({
    id,
    settlement: {
      config: { tradeRouteAccess: 'crossroads' },
      economicState: { primaryImports: [], primaryExports: [] },
    },
  })));
  let world = ensureGenesisRouteNetwork(
    {
      simulationRules: { routeLifecycleEnabled: true },
      tick: 0,
      spatialCanonVersion: 1,
      spatialDigest: digest,
    },
    members.map(m => ({ id: m.id, config: m.config })), 0,
  );
  // The THROUGH edge: s000 to s002, whose geometry runs across s001's vicinity.
  world = writeRouteNetwork(world, withRouteEdges(readRouteNetwork(world), [routeEdge({
    a: 's000', b: 's002', grade: 'road', mode: 'land',
    provenance: 'generated', flavor: 'genesis', tick: 0,
  })]));
  return { world, members };
}

const THROUGH_EDGE = 'route.s000.s002.land';

describe('J3 §5c the wagons swing wide of a place they fear', () => {
  const { world } = bypassRealm();
  const scared = withEmbattlement(world, 's001', 0.9);

  it('a calm realm runs straight, and names the verdict clear', () => {
    const derived = deriveBypass({ worldState: world, a: 's000', b: 's002', tick: 10 });
    expect(derived.verdict).toBe('clear');
    expect(derived.bypass).toBeNull();
    expect([...derived.path]).toEqual(['s000', 's001', 's002']);
  });

  it('a feared intermediate is skirted, and the detour is paid for', () => {
    const derived = deriveBypass({ worldState: scared, a: 's000', b: 's002', tick: 10 });
    expect(derived.verdict).toBe('bypassed');
    expect([...derived.bypass.avoid]).toEqual(['s001']);
    expect([...derived.path]).toEqual(['s000', 's003', 's002']);
    expect(derived.bypass.detourPremium01)
      .toBeGreaterThanOrEqual(Number(ROUTE_BYPASS_TUNING.DETOUR_PREMIUM_FLOOR));
    expect(derived.bypass.detourPremium01)
      .toBeLessThanOrEqual(Number(ROUTE_BYPASS_TUNING.DETOUR_PREMIUM_CAP));
  });

  it('the fear is read through BOTH endpoints, and a calm town is not skirted', () => {
    expect(fearedDangerAt(scared, ['s000', 's002'], 's001')).toBe(0.9);
    expect(fearedDangerAt(scared, ['s000', 's002'], 's003')).toBe(0);
    expect(fearedDangerAt(world, ['s000', 's002'], 's001')).toBe(0);
  });

  it('LAW 1: a bypass mints no node, no edge and no corridor', () => {
    const before = readRouteNetwork(scared);
    const swept = sweepBypassGeometry({ worldState: scared, network: before, tick: 10 });
    expect(Object.keys(swept.network.edges)).toEqual(Object.keys(before.edges));
    expect(swept.network.corridor).toEqual(before.corridor);
    // The waypoints are GEOMETRY: no seat gained an edge it did not already have,
    // and every bypass is one conditional key on one existing edge.
    expect(swept.bypassed).toBeGreaterThan(0);
    expect(Object.keys(swept.avoidedBy)).toContain(THROUGH_EDGE);
    for (const avoid of Object.values(swept.avoidedBy)) expect([...avoid]).toEqual(['s001']);
    expect(readEdgeBypass(swept.network.edges[THROUGH_EDGE]).avoid).toEqual(['s001']);
    // ANTI-VACUITY: the calm twin of this sweep bypasses nothing at all.
    const calm = sweepBypassGeometry({ worldState: world, network: before, tick: 10 });
    expect(calm.bypassed).toBe(0);
    expect(calm.changed).toBe(false);
  });

  it('BOTH EDGES COEXIST: the road TO the feared town is untouched', () => {
    const swept = sweepBypassGeometry({
      worldState: scared, network: readRouteNetwork(scared), tick: 10,
    });
    const toTheTown = swept.network.edges['route.s000.s001.land'];
    // Its genesis grade, unchanged: the bypass layer never re-grades anything.
    expect(toTheTown.grade).toBe(readRouteNetwork(world).edges['route.s000.s001.land'].grade);
    // anchored: the through edge in the same swept network DID take the key (asserted in the pin above), so an absent key here is coexistence rather than a sweep that wrote nothing.
    expect(toTheTown).not.toHaveProperty(ROUTE_BYPASS_KEY);
  });

  it('a lapsed bypass leaves NO key behind (drop-when-absent)', () => {
    const swept = sweepBypassGeometry({
      worldState: scared, network: readRouteNetwork(scared), tick: 10,
    });
    expect(readEdgeBypass(swept.network.edges[THROUGH_EDGE])).toBeTruthy();
    const calmed = sweepBypassGeometry({
      worldState: world,
      network: swept.network,
      tick: 10 + Number(ROUTE_BYPASS_TUNING.BYPASS_HYSTERESIS_TICKS),
    });
    expect(calmed.lapsed).toBe(swept.bypassed);
    // anchored: the same edge id carried the key in the assertion two lines above, so this absence is the drop rather than a renamed edge.
    expect(calmed.network.edges[THROUGH_EDGE]).not.toHaveProperty(ROUTE_BYPASS_KEY);
  });
});

describe('J3 §5c hysteresis applies to geometry too (roads remember fear)', () => {
  const { world } = bypassRealm();
  const scared = withEmbattlement(world, 's001', 0.9);
  const worn = deriveBypass({ worldState: scared, a: 's000', b: 's002', tick: 10 }).bypass;

  it('a worn bypass persists after the danger clears, inside the dwell', () => {
    const held = deriveBypass({ worldState: world, a: 's000', b: 's002', tick: 20, prior: worn });
    expect(held.verdict).toBe('bypassed');
    expect([...held.path]).toEqual(['s000', 's003', 's002']);
    expect([...held.feared]).toEqual([]);
  });

  it('and lapses once the dwell elapses, so it is a memory and not a scar', () => {
    const lapsed = deriveBypass({
      worldState: world,
      a: 's000',
      b: 's002',
      tick: 10 + Number(ROUTE_BYPASS_TUNING.BYPASS_HYSTERESIS_TICKS),
      prior: worn,
    });
    expect(lapsed.verdict).toBe('clear');
    expect([...lapsed.path]).toEqual(['s000', 's001', 's002']);
  });

  it('fresh fear refreshes the clock rather than restarting the bypass', () => {
    const again = deriveBypass({ worldState: scared, a: 's000', b: 's002', tick: 30, prior: worn });
    expect(again.bypass.sinceTick).toBe(worn.sinceTick);
    expect(again.bypass.lastDangerTick).toBe(30);
  });
});

describe('J3 §5c THE FEEDBACK: an unsafe settlement loses its through-traffic', () => {
  const { world } = bypassRealm();
  const scared = withEmbattlement(world, 's001', 0.9);

  it('the count falls to zero for the feared town and RISES for its replacement', () => {
    const calm = throughTrafficCensus({
      worldState: world, network: readRouteNetwork(world), tick: 10,
    });
    const swept = sweepBypassGeometry({
      worldState: scared, network: readRouteNetwork(scared), tick: 10,
    });
    const afraid = throughTrafficCensus({ worldState: scared, network: swept.network, tick: 10 });

    expect(throughTrafficAt(calm, 's001')).toBeGreaterThan(0);
    expect(throughTrafficAt(afraid, 's001')).toBe(0);
    // THE SAME WAGONS ARRIVE SOMEWHERE ELSE. Without this second half the pin
    // would also pass against a census that simply stopped counting.
    expect(throughTrafficAt(afraid, 's003')).toBeGreaterThan(throughTrafficAt(calm, 's003'));
    expect(afraid.corridors).toBe(calm.corridors);
    expect(afraid.bypassed).toBeGreaterThan(calm.bypassed);
  });

  it('the census counts WAYPOINTS, so a settlement never transits its own roads', () => {
    const network = readRouteNetwork(world);
    const calm = throughTrafficCensus({ worldState: world, network, tick: 10 });
    // s000 owns several edges here and is an endpoint on every one of them, so
    // nothing it owns may inflate its through-traffic.
    const ownEdges = Object.values(network.edges).filter(e => e.a === 's000' || e.b === 's000');
    expect(ownEdges.length).toBeGreaterThan(0);
    expect(throughTrafficAt(calm, 's000')).toBe(0);
    // THE MECHANISM, stated rather than assumed: a derivation returns the whole
    // walked road, and the census reads only its INTERMEDIATES. A census reading
    // the whole path would credit both endpoints of every edge, so this comparison
    // is what makes the pin above measure the rule instead of the fixture.
    const derived = deriveBypass({ worldState: world, a: 's000', b: 's002', tick: 10 });
    expect([...derived.path]).toContain('s000');
    // anchored: the path assertion above proves the derivation is live and names s000, so this absence is the waypoint slice rather than an empty list.
    expect([...derived.waypoints]).not.toContain('s000');
    expect([...derived.waypoints]).toEqual(derived.path.slice(1, -1));
  });

  it('recovering the safety recovers the trade, once the memory fades', () => {
    const swept = sweepBypassGeometry({
      worldState: scared, network: readRouteNetwork(scared), tick: 10,
    });
    const later = sweepBypassGeometry({
      worldState: world,
      network: swept.network,
      tick: 10 + Number(ROUTE_BYPASS_TUNING.BYPASS_HYSTERESIS_TICKS),
    });
    const recovered = throughTrafficCensus({
      worldState: world, network: later.network, tick: 10 + Number(ROUTE_BYPASS_TUNING.BYPASS_HYSTERESIS_TICKS),
    });
    expect(throughTrafficAt(recovered, 's001')).toBeGreaterThan(0);
  });
});

describe('J3 §5c totality and the recorded gaps', () => {
  it('an ASPATIAL realm has no third place to fear, and says so', () => {
    const { world } = dangerRealm();
    const derived = deriveBypass({ worldState: world, a: 'ashfen', b: 'dunmoor', tick: 10 });
    expect(derived.verdict).toBe('aspatial');
    expect(derived.bypass).toBeNull();
  });

  it('an UNREACHABLE pair yields no geometry at all', () => {
    const { world } = bypassRealm();
    const derived = deriveBypass({ worldState: world, a: 's000', b: 'nowhere', tick: 10 });
    expect(derived.verdict).toBe('unreachable');
    expect(derived.path).toHaveLength(0);
  });

  it('when every road passes a feared place the town IS a wall, and it is named', () => {
    const { world } = bypassRealm();
    // Fear BOTH the primary intermediate and the alternate: no candidate is clear.
    const walled = {
      ...world,
      spatialLedgers: {
        embattlement: {
          s001: { level: 0.9, phase: 'embattled', sinceTick: 0, lastTick: 10 },
          s003: { level: 0.9, phase: 'embattled', sinceTick: 0, lastTick: 10 },
        },
      },
    };
    const derived = deriveBypass({ worldState: walled, a: 's000', b: 's002', tick: 10 });
    expect(derived.verdict).toBe('no_way_around');
    expect(derived.bypass).toBeNull();
    // BOTH feared towns are named, which is the fix for the defect this pin found:
    // the fear is read across every candidate road, so a detour cannot be chosen
    // into a second war zone merely because that zone was not on the cheapest road.
    expect([...derived.feared]).toEqual(['s001', 's003']);
  });

  it('WATER edges are not swept, which is the recorded gap rather than a wrong map', () => {
    const { world } = bypassRealm();
    const network = readRouteNetwork(world);
    const wet = writeRouteNetwork(world, {
      ...network,
      edges: { ...network.edges, 'route.s000.s002.water': routeEdge({
        a: 's000', b: 's002', grade: 'road', mode: 'water',
        provenance: 'generated', flavor: 'genesis', tick: 0,
      }) },
    });
    const scaredWet = withEmbattlement(wet, 's001', 0.9);
    const swept = sweepBypassGeometry({
      worldState: scaredWet, network: readRouteNetwork(scaredWet), tick: 10,
    });
    // anchored: the LAND edge between the same two seats did take a bypass in this very sweep, so the water edge's absence is the mode skip rather than a sweep that did nothing.
    expect(swept.network.edges['route.s000.s002.water']).not.toHaveProperty(ROUTE_BYPASS_KEY);
    expect(readEdgeBypass(swept.network.edges[THROUGH_EDGE])).toBeTruthy();
  });

  it('an empty network sweeps to itself, by reference', () => {
    const swept = sweepBypassGeometry({ worldState: {}, network: null, tick: 0 });
    expect(swept.changed).toBe(false);
    expect(swept.bypassed).toBe(0);
    expect(throughTrafficCensus({ worldState: {}, network: null, tick: 0 }).corridors).toBe(0);
    expect(readEdgeBypass(null)).toBeNull();
    expect(readEdgeBypass({ bypass: { avoid: [] } })).toBeNull();
  });
});

describe('J3 the danger layer and the decay ladder read one world', () => {
  it('a dangerous road decays where its calm twin is still held by its sunk cost', () => {
    // The same edge, the same persisted tally, the same silence: only the danger
    // differs. The calm road's traffic clears the removal bar, so Law 4's sunk
    // cost buys it a longer patience; the dangerous road's traffic does NOT clear
    // it once the losses are taken off, so the ladder judges it sooner. That is
    // §5b's feedback, end to end, with no rule of its own.
    const { world, members } = dangerRealm({ passes: 0 });
    const network = readRouteNetwork(world);
    const withUsage = (base) => writeRouteNetwork(base, {
      ...readRouteNetwork(base),
      edges: {
        ...readRouteNetwork(base).edges,
        'route.ashfen.brackwater.land': {
          ...network.edges['route.ashfen.brackwater.land'],
          usage: { flows: { goods: 'steady' }, tally: { goods: 10 }, receipts: { goods: ['shipment'] }, lastTick: 5 },
        },
      },
    });
    const calm = withUsage(world);
    const scared = withUsage(withEmbattlement(world, 'brackwater', 0.9));
    const calmVerdict = sweepRouteDecay({ worldState: calm, members, tick: 65 }).verdicts[0];
    const scaredVerdict = sweepRouteDecay({ worldState: scared, members, tick: 65 }).verdicts[0];
    expect(calmVerdict.peakUsage).toBeGreaterThan(scaredVerdict.peakUsage);
    expect(calmVerdict.lossRate01).toBe(0);
    expect(scaredVerdict.lossRate01).toBeGreaterThan(0);
    expect(demoteDwellFor(scaredVerdict.peakUsage, scaredVerdict.lossRate01))
      .toBeLessThan(demoteDwellFor(calmVerdict.peakUsage, calmVerdict.lossRate01));
    expect(calmVerdict.verdict).toBe('hold');
    expect(scaredVerdict.verdict).toBe('demote');
  });

  it('the demote dwell is a live function of both dials, and floors', () => {
    // The pin that would have caught the unreachable conjunction this arm
    // replaced: each dial must MOVE the dwell on its own.
    const base = demoteDwellFor(0, 0);
    expect(demoteDwellFor(100, 0)).toBeGreaterThan(base);
    expect(demoteDwellFor(0, 0.4)).toBeLessThan(base);
    expect(demoteDwellFor(0, 1)).toBe(Number(ROUTE_DECAY_TUNING.MIN_DEMOTE_DWELL_TICKS));
    expect(demoteDwellFor(NaN, NaN)).toBe(base);
  });
});
