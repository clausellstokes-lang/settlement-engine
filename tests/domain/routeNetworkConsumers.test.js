/**
 * routeNetworkConsumers.test.js — W-J slice J4, THE TRAVEL PHYSICS CONSUMERS
 * (binding law docs/DESIGN_ROUTE_LIFECYCLE.md §9 and §10, with §1 Law 5 and Law 7,
 * and DESIGN_NPC_CONSEQUENCES.md §6, which W-H slice H3 implements).
 *
 * The claims this file is responsible for:
 *
 *   CONNECTED-ONLY MEANS THE LIVED NETWORK. The decisive fixture is a pair the
 *   FROZEN DIGEST connects directly and the LIVED network does not: H3's own hop
 *   reader takes it, and this lane refuses it. A pin that only walked a network
 *   whose edges matched the digest would pass on either implementation and prove
 *   nothing about which graph was consulted.
 *
 *   ONE HOP PER TICK. Proved by the arithmetic that would break if it were two: a
 *   walker crossing two eight-tick legs arrives at seventeen and not at sixteen,
 *   because the tick a leg lands is a tick no new leg opens.
 *
 *   ARMIES MAY NOT TAKE HIDDEN PATHS AND WANDERERS MAY (§9, J-D9 (d)). The same
 *   world, the same origin, the same gate: the wanderer takes the overgrown
 *   shortcut and the column walks the long way round. The negative control is the
 *   fixture, and the second control charts the shortcut back into a road, after
 *   which the column takes it.
 *
 *   DORMANT IS ABSENT (Law 7). Every read answers empty and every advance refuses,
 *   and the H3 seam is handed a NULL callback, which is what makes the roamer lane
 *   byte-identical to the world in which this file does not exist.
 *
 * Sibling files: routeNetworkConsumersStrategic.test.js (§7's garrison asymmetry),
 * routeNetworkConsumersInterdiction.test.js (§13's interdiction pin),
 * routeNetworkConsumersRace.test.js (§9's reputation race).
 */
import { describe, expect, it } from 'vitest';
import {
  ARTERIAL_AUDIENCES,
  COVERT_ENVOY_KIND,
  HIDDEN_PATH_KINDS,
  HOP_VERDICTS,
  TRAVELLER_KINDS,
  arterialSeedsFor,
  arterialWeight,
  consumableRouteNetwork,
  hiddenHopsFor,
  livedAdjacency,
  livedDegree,
  livedNeighbours,
  mayUseHiddenPaths,
} from '../../src/domain/worldPulse/routeNetworkConsumers.js';
import {
  ROUTE_TRANSIT_TUNING,
  TRANSIT_VERDICTS,
  advanceLivedTraveller,
  gradeLegMultiplier,
  livedHopToward,
  livedLegTicks,
  openLivedLeg,
  travellerMayWalk,
  walkLivedJourney,
} from '../../src/domain/worldPulse/routeNetworkConsumersTransit.js';
import {
  emptyRouteNetwork,
  routeEdge,
  withRouteEdges,
  writeRouteNetwork,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { nextHopToward, planWanderLeg } from '../../src/domain/worldPulse/npcCirculationTransit.js';
import { NPC_CONSEQUENCES_TUNING } from '../../src/domain/worldPulse/npcConsequencesTuning.js';

/**
 * THE VALE. Five seats on one frozen digest, and every pair is priced, so the
 * geometry can never be the reason a traveller fails to move. `crossford` exists
 * only to anchor the digest's own week calibration at a tier-one hop, which is what
 * keeps the other pairs at readable multi-week costs.
 */
const VALE_DISTANCES = {
  ashfen: { brackwater: 2400, dunmoor: 1200, farholt: 3600, crossford: 300 },
  brackwater: { ashfen: 2400, dunmoor: 2400, farholt: 2400, crossford: 2700 },
  dunmoor: { ashfen: 1200, brackwater: 2400, farholt: 4800, crossford: 1500 },
  farholt: { ashfen: 3600, brackwater: 2400, dunmoor: 4800, crossford: 3900 },
  crossford: { ashfen: 300, brackwater: 2700, dunmoor: 1500, farholt: 3900 },
};
const VALE_TIERS = {
  ashfen: { brackwater: 2, dunmoor: 2, farholt: 2, crossford: 1 },
  brackwater: { ashfen: 2, dunmoor: 2, farholt: 2, crossford: 2 },
  dunmoor: { ashfen: 2, brackwater: 2, farholt: 3, crossford: 2 },
  farholt: { ashfen: 2, brackwater: 2, dunmoor: 3, crossford: 3 },
  crossford: { ashfen: 1, brackwater: 2, dunmoor: 2, farholt: 3 },
};

/**
 * The digest's own routing GATES join every pair directly, and that is the whole
 * point: the frozen geometry says a traveller can reach anywhere from anywhere, so
 * when this lane refuses a hop the refusal can only have come from the LIVED
 * network. A sparse gate list would let a pin pass because the geometry happened to
 * agree, which proves nothing about which graph was consulted.
 *
 * @returns {Record<string, unknown>} the frozen digest every fixture below shares
 */
function valeDigest() {
  /** @type {Array<{ between: [string, string], cost: number }>} */
  const gates = [];
  const seats = Object.keys(VALE_DISTANCES).sort();
  for (let i = 0; i < seats.length; i += 1) {
    for (let j = i + 1; j < seats.length; j += 1) {
      const a = seats[i];
      const b = seats[j];
      gates.push({ between: [a, b], cost: VALE_DISTANCES[a][b] });
    }
  }
  return {
    settlementIds: ['ashfen', 'brackwater', 'crossford', 'dunmoor', 'farholt'],
    gates,
    distanceMatrix: VALE_DISTANCES,
    tiers: VALE_TIERS,
  };
}

/** @param {string} a @param {string} b @param {string} grade */
function edgeAt(a, b, grade) {
  return routeEdge({
    a, b, grade, mode: 'land', provenance: 'generated', flavor: 'genesis', tick: 0,
  });
}

/**
 * THE VALE, WIRED. Brackwater is the hub every open road runs through; the two
 * shortcuts out of Ashfen are the ways whose grade the pins vary.
 *
 * @param {{ shortcut?: string, lit?: boolean, edges?: ReadonlyArray<unknown> }} [options]
 * @returns {Record<string, unknown>}
 */
function valeWorld(options = {}) {
  const shortcut = options.shortcut || 'hidden';
  const edges = options.edges || [
    edgeAt('ashfen', 'brackwater', 'road'),
    edgeAt('brackwater', 'dunmoor', 'road'),
    edgeAt('brackwater', 'farholt', 'road'),
    edgeAt('ashfen', 'dunmoor', shortcut),
    edgeAt('ashfen', 'farholt', 'hidden'),
  ];
  const base = {
    simulationRules: options.lit === false ? {} : { routeLifecycleEnabled: true },
    spatialCanonVersion: 1,
    spatialDigest: valeDigest(),
    tick: 0,
  };
  return writeRouteNetwork(
    base,
    withRouteEdges(emptyRouteNetwork(), /** @type {never} */ (edges)),
  );
}

describe('J4 §9 the hidden-path law is a predicate, and it fails closed', () => {
  it('wanderers, smugglers and covert envoys hold the franchise and nobody else does', () => {
    expect(mayUseHiddenPaths('wanderer')).toBe(true);
    expect(mayUseHiddenPaths('smuggler')).toBe(true);
    expect(mayUseHiddenPaths(COVERT_ENVOY_KIND)).toBe(true);
    expect(mayUseHiddenPaths('army')).toBe(false);
    expect(mayUseHiddenPaths('caravan')).toBe(false);
    // ES-1's HALF THAT MATTERS MOST, and it is a negative: the ORDINARY envoy is still
    // refused. A covert mission may take a forgotten way; an open embassy may not, because
    // an embassy nobody can witness arriving is not an embassy. The two differ by exactly
    // one member of a closed set, so this pair is the whole content of the franchise
    // widening — and it reds if a later lane admits `envoy` "for symmetry".
    expect(mayUseHiddenPaths('envoy')).toBe(false);
    // The exported constant IS the member, not a lookalike literal a rename could orphan.
    expect(HIDDEN_PATH_KINDS).toContain(COVERT_ENVOY_KIND);
    expect(TRAVELLER_KINDS).toContain(COVERT_ENVOY_KIND);
    expect([...HIDDEN_PATH_KINDS].sort()).toEqual([...HIDDEN_PATH_KINDS]);
    // Every franchise member is a lawful traveller kind: a hidden-path word outside the
    // vocabulary would be a franchise nobody could ever be.
    for (const kind of HIDDEN_PATH_KINDS) expect(TRAVELLER_KINDS).toContain(kind);
  });

  it('a kind this estate has never heard of is refused, not admitted', () => {
    // FAIL-CLOSED, and it is the direction that matters: the failure mode of the
    // other default is a column marching down a road the design says it cannot find.
    for (const kind of ['', 'pilgrim', 'dragon', 'undefined', 'null']) {
      expect(mayUseHiddenPaths(kind)).toBe(false);
    }
    expect(mayUseHiddenPaths(null)).toBe(false);
    expect(mayUseHiddenPaths(undefined)).toBe(false);
  });

  it('the closed vocabulary is exactly the four kinds, codepoint-sorted', () => {
    // ES-1 admitted a FIFTH kind, `covert_envoy`, and the franchise below admitted it to
    // the hidden ways. The count moved; the LAW did not — an unrecognised kind is still
    // refused the overgrown road, which the fail-closed negatives in this file re-measure.
    expect([...TRAVELLER_KINDS]).toEqual(['army', 'caravan', 'covert_envoy', 'smuggler', 'wanderer']);
    expect([...TRAVELLER_KINDS].sort()).toEqual([...TRAVELLER_KINDS]);
  });

  it('travellerMayWalk states the same law for a single hop', () => {
    const open = { hidden: false };
    const overgrown = { hidden: true };
    expect(travellerMayWalk('army', open)).toBe(true);
    expect(travellerMayWalk('army', overgrown)).toBe(false);
    expect(travellerMayWalk('wanderer', overgrown)).toBe(true);
    expect(travellerMayWalk('army', null)).toBe(false);
  });
});

describe('J4 §9 the H3 seam: the callback exists for the franchise and for nobody else', () => {
  it('a wanderer is handed a callback and an army is handed null', () => {
    const world = valeWorld();
    expect(typeof hiddenHopsFor(world, 'wanderer')).toBe('function');
    expect(typeof hiddenHopsFor(world, 'smuggler')).toBe('function');
    expect(hiddenHopsFor(world, 'army')).toBeNull();
    expect(hiddenHopsFor(world, 'caravan')).toBeNull();
  });

  it('the callback yields exactly the hidden neighbours, codepoint-sorted', () => {
    const hook = hiddenHopsFor(valeWorld(), 'wanderer');
    expect(hook).toBeTruthy();
    const yielded = /** @type {(id: string) => ReadonlyArray<string>} */ (hook)('ashfen');
    expect([...yielded]).toEqual(['dunmoor', 'farholt']);
    // Brackwater's roads are all open, so a wanderer standing there is offered none.
    expect([...(/** @type {(id: string) => ReadonlyArray<string>} */ (hook)('brackwater'))]).toEqual([]);
  });

  it('a DARK world hands even a wanderer null, so H3 is byte-identical', () => {
    const dark = valeWorld({ lit: false });
    expect(hiddenHopsFor(dark, 'wanderer')).toBeNull();
    // And H3, given that null, plans exactly the leg it plans with no argument at
    // all. This is the property that makes the seam a convention rather than a
    // dependency: lighting W-J is what turns it on.
    const digest = valeDigest();
    const bare = planWanderLeg({
      digest: /** @type {never} */ (digest), fromId: 'ashfen', destId: 'dunmoor', tick: 3,
    });
    const seamed = planWanderLeg({
      digest: /** @type {never} */ (digest),
      fromId: 'ashfen',
      destId: 'dunmoor',
      tick: 3,
      hiddenHopsOf: hiddenHopsFor(dark, 'wanderer'),
    });
    expect(seamed).toEqual(bare);
  });
});

describe('J4 §9 connected-only means the LIVED network, not the frozen digest', () => {
  /**
   * THE DECISIVE FIXTURE. Ashfen and Dunmoor are twelve hundred cost apart on the
   * digest and DIRECTLY connected there; the lived network joins neither of them to
   * the other nor to anything that reaches the other.
   */
  function severedVale() {
    return valeWorld({
      edges: [
        edgeAt('ashfen', 'brackwater', 'road'),
        edgeAt('brackwater', 'farholt', 'road'),
      ],
    });
  }

  it('H3 takes the digest hop that this lane refuses', () => {
    // The two readings are compared side by side ON THE SAME WORLD, so the pin
    // cannot pass by both consulting the same graph.
    const digestHop = nextHopToward({
      digest: /** @type {never} */ (valeDigest()), fromId: 'ashfen', destId: 'dunmoor',
    });
    expect(digestHop).toEqual({ toId: 'dunmoor', hidden: false });

    const lived = livedHopToward({
      worldState: severedVale(), fromId: 'ashfen', destId: 'dunmoor', kind: 'wanderer',
    });
    expect(lived.verdict).toBe('unconnected');
    expect(lived.hop).toBeNull();
  });

  it('a traveller on the severed network does not move at all', () => {
    const step = advanceLivedTraveller({
      worldState: severedVale(),
      atSettlementId: 'ashfen',
      leg: null,
      destId: 'dunmoor',
      kind: 'wanderer',
      tick: 0,
    });
    expect(step.verdict).toBe('unconnected');
    expect(step.leg).toBeNull();
    expect(step.changed).toBe(false);
    expect(step.atSettlementId).toBe('ashfen');
  });

  it('restoring one lived edge is all it takes, so the refusal was the network', () => {
    // The negative control for the pin above, and it differs by exactly one edge.
    const joined = valeWorld({
      edges: [
        edgeAt('ashfen', 'brackwater', 'road'),
        edgeAt('brackwater', 'farholt', 'road'),
        edgeAt('brackwater', 'dunmoor', 'road'),
      ],
    });
    const lived = livedHopToward({
      worldState: joined, fromId: 'ashfen', destId: 'dunmoor', kind: 'wanderer',
    });
    expect(lived.verdict).toBe('hop');
    expect(lived.hop && lived.hop.toId).toBe('brackwater');
    expect([...lived.route]).toEqual(['ashfen', 'brackwater', 'dunmoor']);
  });
});

describe('J4 §9 one hop per tick, and mid-route is a real place to be', () => {
  it('the walker stands in every seat on the way and in no others', () => {
    const journey = walkLivedJourney({
      worldState: valeWorld(), fromId: 'ashfen', destId: 'farholt', kind: 'caravan', tick: 0,
    });
    expect(journey.arrived).toBe(true);
    expect([...journey.path]).toEqual(['ashfen', 'brackwater', 'farholt']);
    expect(journey.hops).toBe(2);
  });

  it('two eight-tick legs take SEVENTEEN ticks, because landing costs the hop', () => {
    // The arithmetic IS the one-hop rule. Sixteen would mean a walker who arrived
    // at eight opened the next leg on the same tick, which is how "one hop per
    // tick" gets laundered into several.
    const world = valeWorld();
    expect(livedLegTicks({
      worldState: world,
      fromId: 'ashfen',
      hop: { toId: 'brackwater', edgeId: 'route.ashfen.brackwater.land', grade: 'road', mode: 'land', hidden: false },
    })).toBe(8);
    const journey = walkLivedJourney({
      worldState: world, fromId: 'ashfen', destId: 'farholt', kind: 'caravan', tick: 0,
    });
    expect(journey.ticks).toBe(17);
  });

  it('mid-route the walker is nowhere, with a bounded progress reading', () => {
    const world = valeWorld();
    const opened = advanceLivedTraveller({
      worldState: world, atSettlementId: 'ashfen', leg: null, destId: 'farholt', kind: 'caravan', tick: 0,
    });
    expect(opened.verdict).toBe('departed');
    expect(opened.atSettlementId).toBe('');
    const half = advanceLivedTraveller({
      worldState: world, atSettlementId: '', leg: opened.leg, destId: 'farholt', kind: 'caravan', tick: 4,
    });
    expect(half.verdict).toBe('in_transit');
    expect(half.atSettlementId).toBe('');
    expect(half.progress01).toBe(0.5);
    expect(half.leg).toBe(opened.leg);
  });

  it('the tick a leg lands, it lands and takes no further hop', () => {
    const world = valeWorld();
    const opened = advanceLivedTraveller({
      worldState: world, atSettlementId: 'ashfen', leg: null, destId: 'farholt', kind: 'caravan', tick: 0,
    });
    const landed = advanceLivedTraveller({
      worldState: world, atSettlementId: '', leg: opened.leg, destId: 'farholt', kind: 'caravan', tick: 8,
    });
    expect(landed.verdict).toBe('arrived');
    expect(landed.atSettlementId).toBe('brackwater');
    expect(landed.leg).toBeNull();
    expect(landed.hop).toBeNull();
  });

  it('the leg record is H3 shape exactly, with hidden as the only conditional key', () => {
    const world = valeWorld();
    const open = openLivedLeg({
      worldState: world,
      fromId: 'ashfen',
      hop: { toId: 'brackwater', edgeId: 'route.ashfen.brackwater.land', grade: 'road', mode: 'land', hidden: false },
      tick: 2,
    });
    expect(Object.keys(open.leg).sort()).toEqual(['arrivalTick', 'departTick', 'fromId', 'toId']);
    const secret = openLivedLeg({
      worldState: world,
      fromId: 'ashfen',
      hop: { toId: 'dunmoor', edgeId: 'route.ashfen.dunmoor.land', grade: 'hidden', mode: 'land', hidden: true },
      tick: 2,
    });
    expect(Object.keys(secret.leg).sort()).toEqual(['arrivalTick', 'departTick', 'fromId', 'hidden', 'toId']);
    expect(secret.leg.hidden).toBe(true);
  });

  it('the verdict vocabularies are closed and every word this file saw is in them', () => {
    expect([...TRANSIT_VERDICTS].sort()).toEqual([
      'arrived', 'at_rest', 'departed', 'dormant', 'in_transit', 'refused_hidden', 'unconnected',
    ]);
    expect([...HOP_VERDICTS].sort()).toEqual([
      'arrived', 'dormant', 'hop', 'refused_hidden', 'unconnected',
    ]);
  });
});

describe('J4 §9 armies may NOT take hidden paths and wanderers may', () => {
  it('the same world, the same gate: the wanderer takes the shortcut, the column does not', () => {
    const world = valeWorld({ shortcut: 'hidden' });
    const wanderer = walkLivedJourney({
      worldState: world, fromId: 'ashfen', destId: 'dunmoor', kind: 'wanderer', tick: 0,
    });
    const column = walkLivedJourney({
      worldState: world, fromId: 'ashfen', destId: 'dunmoor', kind: 'army', tick: 0,
    });
    expect([...wanderer.path]).toEqual(['ashfen', 'dunmoor']);
    expect([...wanderer.grades]).toEqual(['hidden']);
    expect(wanderer.ticks).toBe(8);

    expect([...column.path]).toEqual(['ashfen', 'brackwater', 'dunmoor']);
    expect([...column.grades]).toEqual(['road', 'road']);
    expect(column.ticks).toBe(17);
  });

  it('charter the shortcut back into a road and the column takes it', () => {
    // THE NEGATIVE CONTROL, and it is the fixture: one grade word changes and the
    // army's refusal disappears. A pin that only showed the army taking the long way
    // would also pass on an implementation that had no hidden-path law at all.
    const world = valeWorld({ shortcut: 'road' });
    const column = walkLivedJourney({
      worldState: world, fromId: 'ashfen', destId: 'dunmoor', kind: 'army', tick: 0,
    });
    expect([...column.path]).toEqual(['ashfen', 'dunmoor']);
    expect(column.ticks).toBe(4);
  });

  it('when the ONLY way is overgrown the column is REFUSED, which is not the same as stranded', () => {
    const world = valeWorld({
      edges: [edgeAt('ashfen', 'dunmoor', 'hidden')],
    });
    const refused = livedHopToward({
      worldState: world, fromId: 'ashfen', destId: 'dunmoor', kind: 'army',
    });
    expect(refused.verdict).toBe('refused_hidden');
    expect(refused.hop).toBeNull();

    const allowed = livedHopToward({
      worldState: world, fromId: 'ashfen', destId: 'dunmoor', kind: 'smuggler',
    });
    expect(allowed.verdict).toBe('hop');
    expect(allowed.hop && allowed.hop.toId).toBe('dunmoor');

    // And a place no road reaches at all reads the OTHER word, so the two are
    // genuinely distinguished rather than spelled the same.
    const stranded = livedHopToward({
      worldState: world, fromId: 'ashfen', destId: 'crossford', kind: 'army',
    });
    expect(stranded.verdict).toBe('unconnected');
  });
});

describe('J4 §9 the grade penalty is real and agrees with H3 about the overgrown road', () => {
  it('the ladder prices a way in the order the design states', () => {
    const hop = (/** @type {string} */ grade) => ({
      toId: 'brackwater', edgeId: 'route.ashfen.brackwater.land', grade, mode: 'land', hidden: grade === 'hidden',
    });
    const world = valeWorld();
    const ticks = (/** @type {string} */ grade) => livedLegTicks({
      worldState: world, fromId: 'ashfen', hop: hop(grade),
    });
    expect(ticks('highway')).toBe(6);
    expect(ticks('road')).toBe(8);
    expect(ticks('track')).toBe(12);
    expect(ticks('hidden')).toBe(16);
    expect(ticks('highway')).toBeLessThan(ticks('road'));
    expect(ticks('road')).toBeLessThan(ticks('track'));
    expect(ticks('track')).toBeLessThan(ticks('hidden'));
  });

  it('an unknown grade pays the ROAD rung, never the highway and never the smuggler', () => {
    expect(gradeLegMultiplier('imperial_causeway')).toBe(gradeLegMultiplier('road'));
    expect(gradeLegMultiplier('')).toBe(gradeLegMultiplier('road'));
    expect(gradeLegMultiplier(null)).toBe(gradeLegMultiplier('road'));
  });

  it('the two programs agree about what an overgrown road costs a walker', () => {
    // Two independently vetoable tuning surfaces that happen to hold the same band.
    // Pinned rather than shared, so a future owner ruling about one is visible as a
    // red here instead of silently retuning the other.
    const multipliers = /** @type {Record<string, number>} */ (
      ROUTE_TRANSIT_TUNING.GRADE_LEG_MULTIPLIER);
    expect(multipliers.hidden).toBe(NPC_CONSEQUENCES_TUNING.HIDDEN_PATH_SLOWDOWN);
  });

  it('a leg can never resolve on the tick it opened', () => {
    const world = valeWorld();
    const plan = openLivedLeg({
      worldState: world,
      fromId: 'ashfen',
      hop: { toId: 'crossford', edgeId: 'route.ashfen.crossford.land', grade: 'highway', mode: 'land', hidden: false },
      tick: 11,
    });
    expect(plan.leg.arrivalTick).toBeGreaterThan(plan.leg.departTick);
    expect(plan.ticks).toBeGreaterThanOrEqual(Number(ROUTE_TRANSIT_TUNING.MIN_LEG_TICKS));
  });
});

describe('J4 §10 the arterial seeds are the cartography field stage boundary conditions', () => {
  it('the DM sees every way out, weighted by grade', () => {
    const seeds = arterialSeedsFor(valeWorld(), 'ashfen', { audience: 'dm' });
    expect(seeds.map(s => s.toId)).toEqual(['brackwater', 'dunmoor', 'farholt']);
    expect(seeds.map(s => s.grade)).toEqual(['road', 'hidden', 'hidden']);
    expect(seeds.map(s => s.weight)).toEqual([2, 0, 0]);
  });

  it('a player sees the overgrown nothing', () => {
    const dm = arterialSeedsFor(valeWorld(), 'ashfen', { audience: 'dm' });
    const player = arterialSeedsFor(valeWorld(), 'ashfen', { audience: 'player' });
    expect(dm.length).toBe(3);
    expect(player.map(s => s.toId)).toEqual(['brackwater']);
    expect(player.every(s => s.hidden === false)).toBe(true);
    expect([...ARTERIAL_AUDIENCES]).toEqual(['dm', 'player']);
  });

  it('the road weight is the ladder rank and an unknown grade weighs nothing', () => {
    expect(arterialWeight('highway')).toBe(3);
    expect(arterialWeight('road')).toBe(2);
    expect(arterialWeight('track')).toBe(1);
    expect(arterialWeight('hidden')).toBe(0);
    expect(arterialWeight('viaduct')).toBe(0);
  });

  it('degree counts the living roads and never the remnants', () => {
    // The §5d amendment (a) reading: a hidden path is not a living route and must
    // not inflate a network role.
    expect(livedDegree(valeWorld(), 'ashfen')).toBe(1);
    expect(livedDegree(valeWorld({ shortcut: 'road' }), 'ashfen')).toBe(2);
    expect(livedDegree(valeWorld(), 'brackwater')).toBe(3);
    expect(livedDegree(valeWorld(), 'crossford')).toBe(0);
  });
});

describe('J4 Law 7 dormancy: a dark world has no network for a consumer to read', () => {
  it('every read answers empty and every advance refuses', () => {
    const dark = valeWorld({ lit: false });
    expect(consumableRouteNetwork(dark)).toEqual(emptyRouteNetwork());
    expect(livedAdjacency(consumableRouteNetwork(dark)).size).toBe(0);
    expect(livedNeighbours(dark, 'ashfen', {}).length).toBe(0);
    expect(arterialSeedsFor(dark, 'ashfen', { audience: 'dm' }).length).toBe(0);
    expect(livedDegree(dark, 'ashfen')).toBe(0);
    expect(livedHopToward({
      worldState: dark, fromId: 'ashfen', destId: 'dunmoor', kind: 'wanderer',
    }).verdict).toBe('dormant');
  });

  it('an advance on a dark world moves nobody and mints no leg', () => {
    const dark = valeWorld({ lit: false });
    const step = advanceLivedTraveller({
      worldState: dark, atSettlementId: 'ashfen', leg: null, destId: 'dunmoor', kind: 'wanderer', tick: 0,
    });
    expect(step.verdict).toBe('dormant');
    expect(step.leg).toBeNull();
    expect(step.changed).toBe(false);
  });

  it('a walker already on the road may still finish, because stranding is not dormancy', () => {
    // The lifecycle hole this closes: a leg opened while the flag was lit must land
    // when it goes dark. Law 7 asks that a dark world never STARTS anything, which
    // is a different sentence from abandoning somebody mid-road.
    const lit = valeWorld();
    const opened = advanceLivedTraveller({
      worldState: lit, atSettlementId: 'ashfen', leg: null, destId: 'farholt', kind: 'caravan', tick: 0,
    });
    const dark = valeWorld({ lit: false });
    const landed = advanceLivedTraveller({
      worldState: dark, atSettlementId: '', leg: opened.leg, destId: 'farholt', kind: 'caravan', tick: 8,
    });
    expect(landed.verdict).toBe('arrived');
    expect(landed.atSettlementId).toBe('brackwater');
    // And having landed, they take no further step on a dark world.
    const after = advanceLivedTraveller({
      worldState: dark, atSettlementId: 'brackwater', leg: null, destId: 'farholt', kind: 'caravan', tick: 9,
    });
    expect(after.verdict).toBe('dormant');
  });

  it('the walk on a dark world is a no-op that returns rather than spinning', () => {
    const journey = walkLivedJourney({
      worldState: valeWorld({ lit: false }),
      fromId: 'ashfen',
      destId: 'dunmoor',
      kind: 'wanderer',
      tick: 0,
      maxTicks: 40,
    });
    expect(journey.arrived).toBe(false);
    expect(journey.hops).toBe(0);
    expect(journey.verdict).toBe('dormant');
  });
});
