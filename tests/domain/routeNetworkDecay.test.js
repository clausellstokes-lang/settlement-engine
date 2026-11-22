/**
 * routeNetworkDecay.test.js — W-J slice J3, THE SLOW VERDICT (binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §7, with §1 Law 4, Law 5, Law 7, §5's mercy,
 * §6's earned grades, §13's stability envelope).
 *
 * The claims this file is responsible for:
 *
 *   NOTHING IS FORGOTTEN (Law 5). Proved twice over: `hidden` steps nowhere, and
 *   across a 400-tick soak the EDGE ID SET never shrinks by one member. A pin that
 *   only checked the floor word would survive a future removal path; a pin that
 *   only ran the soak would survive a floor that quietly changed. Both.
 *
 *   THE LADDER CANNOT FLAP (Law 4, §13's anti-flap envelope). An oscillating-demand
 *   fixture is run over a soak horizon and the TRANSITION SEQUENCE is inspected: a
 *   down step following an up step is the flap signature, and it never appears.
 *
 *   THE GARRISON ASYMMETRY (§7). The same edge, with and without a live strategic
 *   need, on the same silence: one holds at road, the other falls to hidden. The
 *   negative control is the fixture, not a comment.
 *
 * Sibling files: routeNetworkCharter.test.js (§6), routeNetworkDanger.test.js
 * (§5b and §5c, including the loss-rate feedback this ladder reads).
 */
import { describe, expect, it } from 'vitest';
import {
  accrueRouteFlows,
  flowMembersFromSnapshot,
} from '../../src/domain/worldPulse/routeNetworkFlows.js';
import { ensureGenesisRouteNetwork } from '../../src/domain/worldPulse/routeNetworkGenesis.js';
import {
  readRouteNetwork,
  routeEdge,
  withRouteEdges,
  writeRouteNetwork,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { buildMaterialIndex } from '../../src/domain/worldPulse/routeNetworkFlowsMaterial.js';
import {
  ROUTE_CHARTER_TUNING,
  applyRouteCharter,
  evaluateRouteCharters,
} from '../../src/domain/worldPulse/routeNetworkCharter.js';
import {
  DECAY_VERDICTS,
  GRADE_STEP_KEY,
  ROUTE_DECAY_TUNING,
  edgeObjectiveScore,
  evaluateEdgeDecay,
  garrisonFloorGrade,
  gradeRank,
  gradeStepHeraldItem,
  lastActivityTick,
  stepGradeDown,
  stepGradeUp,
  sweepRouteDecay,
} from '../../src/domain/worldPulse/routeNetworkDecay.js';
import {
  hideDestroyedSettlementEdges,
  reviveHiddenCorridors,
} from '../../src/domain/worldPulse/routeNetworkDecayLifecycle.js';

const NAMES = { ashfen: 'Ashfen', brackwater: 'Brackwater', dunmoor: 'Dunmoor' };
const GENESIS_EDGE = 'route.ashfen.brackwater.land';

/**
 * A PAIR THAT WANTS NOTHING. Two seats exporting the same good and importing
 * none: the objective is pure cost, and the removal counterfactual strands
 * nothing, so neither the objective gate nor the dual-benefit mercy can hold the
 * road up. That is the fixture the ladder's DOWN arm needs, and building it out
 * of wants rather than out of a tuning override is what keeps the pin honest.
 */
function barrenRealm() {
  const members = flowMembersFromSnapshot([
    {
      id: 'ashfen',
      settlement: {
        config: { tradeRouteAccess: 'crossroads' },
        economicState: { primaryImports: [], primaryExports: ['grain'] },
      },
    },
    {
      id: 'brackwater',
      settlement: {
        config: { tradeRouteAccess: 'road' },
        economicState: { primaryImports: [], primaryExports: ['grain'] },
      },
    },
  ]);
  const world = ensureGenesisRouteNetwork(
    { simulationRules: { routeLifecycleEnabled: true }, tick: 0, campaignId: 'route-decay' },
    members.map(m => ({ id: m.id, config: m.config })), 0,
  );
  return { world, members };
}

/**
 * A PAIR THAT NEEDS EACH OTHER. Complementary goods across the pair, so removing
 * the road would strand a material loop and §5's mercy applies.
 */
function needfulRealm() {
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
        economicState: { primaryImports: ['grain'], primaryExports: ['iron'] },
      },
    },
  ]);
  const world = ensureGenesisRouteNetwork(
    { simulationRules: { routeLifecycleEnabled: true }, tick: 0, campaignId: 'route-decay' },
    members.map(m => ({ id: m.id, config: m.config })), 0,
  );
  return { world, members };
}

/** Grade of one edge on a world. */
const gradeOf = (world, id = GENESIS_EDGE) => readRouteNetwork(world).edges[id].grade;

/** Run the ladder at a list of ticks, collecting each sweep's verdict word. */
function ladder(world, members, ticks) {
  const steps = [];
  let current = world;
  for (const tick of ticks) {
    const out = sweepRouteDecay({ worldState: current, members, tick, names: NAMES });
    steps.push({
      tick,
      verdict: out.verdicts[0] ? out.verdicts[0].verdict : 'none',
      grade: gradeOf(out.worldState),
      stepped: out.stepped,
      news: out.news.length,
    });
    current = out.worldState;
  }
  return { world: current, steps };
}

describe('J3 §7 the ladder runs down, one rung at a time, on long silence', () => {
  const { world, members } = barrenRealm();

  it('a quiet, unwanted road falls road to track to hidden, and each step is an event', () => {
    expect(gradeOf(world)).toBe('road');
    const run = ladder(world, members, [40, 80, 160, 240]);
    expect(run.steps.map(s => `${s.verdict}:${s.grade}`)).toEqual([
      'hold:road', 'demote:track', 'abandon:hidden', 'floor:hidden',
    ]);
    // Every step that moved a grade emitted exactly one Herald item, and the one
    // that did not moved nothing: §7's "every step is an event with receipts".
    expect(run.steps.map(s => s.news)).toEqual([0, 1, 1, 0]);
  });

  it('the hold before the dwell is the dwell holding, not the objective', () => {
    const early = sweepRouteDecay({ worldState: world, members, tick: 40 });
    expect(early.verdicts[0].verdict).toBe('hold');
    expect(early.verdicts[0].quietTicks)
      .toBeLessThan(Number(ROUTE_DECAY_TUNING.DEMOTE_DWELL_TICKS));
    expect(early.changed).toBe(false);
    expect(early.worldState).toBe(world);
  });

  it('the last step is ABANDONMENT, and the Herald mourns rather than reports', () => {
    const run = ladder(world, members, [80, 160]);
    const abandon = run.steps[1];
    expect(abandon.verdict).toBe('abandon');
    const verdicts = sweepRouteDecay({
      worldState: ladder(world, members, [80]).world, members, tick: 160, names: NAMES,
    });
    const item = gradeStepHeraldItem(verdicts.verdicts[0], { tick: 160, names: NAMES });
    expect(item.candidateType).toBe('route_abandoned');
    expect([...item.settlementIds]).toEqual(['ashfen', 'brackwater']);
    expect([...item.settlementNames]).toEqual(['Ashfen', 'Brackwater']);
    expect(item.summary).toContain('remembers');
  });

  it('every verdict word the sweep produces is in the closed vocabulary', () => {
    const run = ladder(world, members, [40, 80, 160, 240, 320]);
    for (const step of run.steps) expect(DECAY_VERDICTS).toContain(step.verdict);
    expect(run.steps).toHaveLength(5);
  });
});

describe('J3 Law 5 NOTHING IS FORGOTTEN: hidden is the floor and there is no absence', () => {
  it('hidden steps nowhere, and the rank ladder is total on nonsense', () => {
    expect(stepGradeDown('hidden')).toBe('hidden');
    expect(stepGradeDown('highway')).toBe('road');
    expect(stepGradeUp('highway')).toBe('highway');
    expect(stepGradeUp('hidden')).toBe('track');
    expect(gradeRank('not_a_grade')).toBe(0);
    expect(gradeRank('highway')).toBeGreaterThan(gradeRank('hidden'));
  });

  it('across a 400-tick soak the edge id set never loses a member', () => {
    const { world, members } = barrenRealm();
    const before = Object.keys(readRouteNetwork(world).edges).sort();
    expect(before.length).toBeGreaterThan(0);
    let current = world;
    /** @type {Array<string>} */
    const shrinkages = [];
    for (let tick = 0; tick <= 400; tick += 20) {
      current = sweepRouteDecay({ worldState: current, members, tick }).worldState;
      const now = Object.keys(readRouteNetwork(current).edges).sort();
      if (now.join('|') !== before.join('|')) shrinkages.push(`t=${tick}: ${now.join(',')}`);
    }
    expect(shrinkages).toEqual([]);
    // ANTI-VACUITY: the soak really did drive the road to the floor, so the
    // constant id set is persistence rather than a ladder that never ran.
    expect(gradeOf(current)).toBe('hidden');
  });

  it('a USER route may be downgraded with a notice, and is still never removed', () => {
    const { world, members } = barrenRealm();
    const network = readRouteNetwork(world);
    const withUser = writeRouteNetwork(world, withRouteEdges(network, [routeEdge({
      a: 'ashfen', b: 'dunmoor', grade: 'road', mode: 'land',
      provenance: 'user', flavor: 'user', tick: 0,
    })]));
    let current = withUser;
    for (let tick = 0; tick <= 400; tick += 40) {
      current = sweepRouteDecay({ worldState: current, members, tick, names: NAMES }).worldState;
    }
    const edges = readRouteNetwork(current).edges;
    expect(Object.keys(edges).sort()).toEqual(['route.ashfen.brackwater.land', 'route.ashfen.dunmoor.land']);
    expect(edges['route.ashfen.dunmoor.land'].grade).toBe('hidden');
    expect(edges['route.ashfen.dunmoor.land'].lifecycleImmune).toBe(true);
    const stepped = sweepRouteDecay({ worldState: withUser, members, tick: 100, names: NAMES });
    const userVerdict = stepped.verdicts.find(v => v.edgeId === 'route.ashfen.dunmoor.land');
    expect(userVerdict.lifecycleImmune).toBe(true);
    const item = gradeStepHeraldItem(userVerdict, { tick: 100, names: NAMES });
    expect(item.reasons.join(' ')).toContain('will not be struck');
  });
});

describe('J3 §6 the ladder runs UP: roads are earned by being walked', () => {
  /** A chartered track, then sustained traffic on it. */
  function walkedTrack({ throughTick }) {
    const { world, members } = needfulRealm();
    const column = (w, tick) => ({
      ...w,
      spatialLedgers: {
        ...(w.spatialLedgers || {}),
        migration: { 'col.a': { originId: 'ashfen', destId: 'brackwater', arrivals: 640 } },
      },
      tick,
    });
    let current = world;
    for (let tick = 1; tick <= throughTick; tick += 1) {
      current = accrueRouteFlows({ worldState: column(current, tick), members, tick }).worldState;
    }
    return { world: current, members };
  }

  it('sustained recent traffic promotes a road to a highway, on a dwell', () => {
    const { world, members } = walkedTrack({ throughTick: 60 });
    expect(gradeOf(world)).toBe('road');
    const usage = readRouteNetwork(world).edges[GENESIS_EDGE].usage;
    expect(usage.tally.population).toBeGreaterThanOrEqual(
      Number(ROUTE_DECAY_TUNING.PROMOTE_TALLY.highway),
    );
    const swept = sweepRouteDecay({ worldState: world, members, tick: 60, names: NAMES });
    expect(swept.verdicts[0].verdict).toBe('promote');
    expect(gradeOf(swept.worldState)).toBe('highway');
    const item = gradeStepHeraldItem(swept.verdicts[0], { tick: 60, names: NAMES });
    expect(item.candidateType).toBe('route_promoted');
  });

  it('a busy road below the cumulative bar stays busy rather than climbing', () => {
    const { world, members } = walkedTrack({ throughTick: 20 });
    const usage = readRouteNetwork(world).edges[GENESIS_EDGE].usage;
    expect(usage.tally.population).toBeLessThan(Number(ROUTE_DECAY_TUNING.PROMOTE_TALLY.highway));
    const swept = sweepRouteDecay({ worldState: world, members, tick: 20 });
    expect(swept.verdicts[0].verdict).toBe('busy');
    expect(swept.changed).toBe(false);
  });

  it('the promotion dwell is real: the same tally one week after a step waits', () => {
    const { world, members } = walkedTrack({ throughTick: 60 });
    const promoted = sweepRouteDecay({ worldState: world, members, tick: 60 }).worldState;
    // A second sweep the very next week: the traffic is still fresh and the tally
    // is still over every bar, but the dwell since the step has not elapsed.
    const again = sweepRouteDecay({ worldState: promoted, members, tick: 61 });
    expect(again.verdicts[0].verdict).toBe('busy');
    expect(gradeOf(again.worldState)).toBe('highway');
  });
});

describe('J3 Law 4 the ladder CANNOT FLAP (the anti-flap stability envelope, §13)', () => {
  it('promotion and demotion are structurally exclusive, by the clocks alone', () => {
    // The whole guarantee in one line: the freshness window a promotion needs is
    // strictly inside the silence a demotion needs, so no edge can satisfy both.
    expect(Number(ROUTE_DECAY_TUNING.ACTIVE_WINDOW_TICKS))
      .toBeLessThan(Number(ROUTE_DECAY_TUNING.DEMOTE_DWELL_TICKS));
  });

  it('an OSCILLATING demand over a soak horizon never reverses a step', () => {
    // Twenty weeks of traffic, twenty of silence, for four hundred weeks. This is
    // the fixture a flapping ladder fails: the grade would saw up and down with
    // the demand. THE FLAP SIGNATURE is a DOWN step that follows an UP step (or
    // the reverse) anywhere in the sequence.
    const { world, members } = needfulRealm();
    let current = world;
    /** @type {Array<{ tick: number, from: string, to: string }>} */
    const transitions = [];
    for (let tick = 1; tick <= 400; tick += 1) {
      const walking = Math.floor((tick - 1) / 20) % 2 === 0;
      if (walking) {
        current = accrueRouteFlows({
          worldState: {
            ...current,
            spatialLedgers: {
              ...(current.spatialLedgers || {}),
              migration: { 'col.a': { originId: 'ashfen', destId: 'brackwater', arrivals: 640 } },
            },
          },
          members,
          tick,
        }).worldState;
      }
      const before = gradeOf(current);
      current = sweepRouteDecay({ worldState: current, members, tick }).worldState;
      const after = gradeOf(current);
      if (after !== before) transitions.push({ tick, from: before, to: after });
    }
    const directions = transitions.map(t => (gradeRank(t.to) > gradeRank(t.from) ? 'up' : 'down'));
    const reversals = directions.filter((d, i) => i > 0 && d !== directions[i - 1]);
    expect(reversals).toEqual([]);
    // NETWORK STABILITY: the grade moved at all (so the envelope is measuring a
    // live ladder), and it moved a bounded number of times over four hundred weeks.
    expect(transitions.length).toBeGreaterThan(0);
    expect(transitions.length).toBeLessThanOrEqual(3);
  });
});

describe('J3 §7 the garrison asymmetry: a live strategic need floors an edge at road', () => {
  /** The same barren realm, with and without a garrison on its one road. */
  function garrisoned(band) {
    const { world, members } = barrenRealm();
    const network = readRouteNetwork(world);
    const edge = network.edges[GENESIS_EDGE];
    const next = writeRouteNetwork(world, {
      ...network,
      edges: { [GENESIS_EDGE]: band ? { ...edge, strategicNeed: band } : edge },
    });
    return { world: next, members };
  }

  it('the garrisoned road holds at road while its ungarrisoned twin falls to hidden', () => {
    const held = garrisoned('garrison');
    const free = garrisoned(null);
    let a = held.world;
    let b = free.world;
    for (let tick = 0; tick <= 320; tick += 40) {
      a = sweepRouteDecay({ worldState: a, members: held.members, tick }).worldState;
      b = sweepRouteDecay({ worldState: b, members: free.members, tick }).worldState;
    }
    expect(gradeOf(a)).toBe('road');
    expect(gradeOf(b)).toBe('hidden');
  });

  it('a below-band need is no floor at all', () => {
    expect(garrisonFloorGrade({ strategicNeed: 'watch' })).toBeNull();
    expect(garrisonFloorGrade({ strategicNeed: 'garrison' })).toBe('road');
    expect(garrisonFloorGrade({ strategicNeed: 'front' })).toBe('road');
    expect(garrisonFloorGrade({})).toBeNull();
    expect(garrisonFloorGrade(null)).toBeNull();
  });

  it('a floor is a floor: a hidden edge that gains a garrison rises to road', () => {
    const free = garrisoned(null);
    let hidden = free.world;
    for (let tick = 0; tick <= 320; tick += 40) {
      hidden = sweepRouteDecay({ worldState: hidden, members: free.members, tick }).worldState;
    }
    expect(gradeOf(hidden)).toBe('hidden');
    const network = readRouteNetwork(hidden);
    const armed = writeRouteNetwork(hidden, {
      ...network,
      edges: { [GENESIS_EDGE]: { ...network.edges[GENESIS_EDGE], strategicNeed: 'front' } },
    });
    const swept = sweepRouteDecay({ worldState: armed, members: free.members, tick: 400 });
    expect(swept.verdicts[0].verdict).toBe('garrison_floor');
    expect(gradeOf(swept.worldState)).toBe('road');
  });
});

describe('J3 §5 the dual-benefit mercy resists the last demotion', () => {
  it('a road whose removal would strand a material loop is held by MERCY', () => {
    const { world, members } = needfulRealm();
    const swept = sweepRouteDecay({ worldState: world, members, tick: 200 });
    expect(swept.verdicts[0].verdict).toBe('mercy');
    expect(swept.verdicts[0].systemCritical).toBe(true);
    expect(gradeOf(swept.worldState)).toBe('road');
  });

  it('the identical silence on a pair that needs nothing DOES demote', () => {
    // The negative control for the mercy, and it differs from the fixture above
    // only in what the two seats want from each other.
    const { world, members } = barrenRealm();
    const swept = sweepRouteDecay({ worldState: world, members, tick: 200 });
    expect(swept.verdicts[0].verdict).toBe('demote');
    expect(swept.verdicts[0].systemCritical).toBe(false);
  });
});

describe('J3 §7 destruction drops every edge to hidden in the SAME outcome', () => {
  it('one call, one worldState, every edge of the dead settlement', () => {
    const { world } = barrenRealm();
    const network = readRouteNetwork(world);
    const wider = writeRouteNetwork(world, withRouteEdges(network, [routeEdge({
      a: 'ashfen', b: 'dunmoor', grade: 'highway', mode: 'land',
      provenance: 'generated', flavor: 'genesis', tick: 0,
    })]));
    const dead = hideDestroyedSettlementEdges({
      worldState: wider, settlementId: 'ashfen', tick: 50,
    });
    expect(dead.changed).toBe(true);
    expect([...dead.hidden].sort()).toEqual(['route.ashfen.brackwater.land', 'route.ashfen.dunmoor.land']);
    const edges = readRouteNetwork(dead.worldState).edges;
    expect(Object.values(edges).map(e => e.grade)).toEqual(['hidden', 'hidden']);
    expect(edges['route.ashfen.dunmoor.land'][GRADE_STEP_KEY].reason).toBe('settlement_destroyed');
  });

  it('an untouched settlement keeps its roads, so the cascade is scoped', () => {
    const { world } = needfulRealm();
    const dead = hideDestroyedSettlementEdges({
      worldState: world, settlementId: 'dunmoor', tick: 50,
    });
    expect(dead.changed).toBe(false);
    expect(dead.worldState).toBe(world);
    expect(gradeOf(world)).toBe('road');
  });

  it('a garrisoned road survives the death of the town at one end', () => {
    const { world } = barrenRealm();
    const network = readRouteNetwork(world);
    const armed = writeRouteNetwork(world, {
      ...network,
      edges: { [GENESIS_EDGE]: { ...network.edges[GENESIS_EDGE], strategicNeed: 'front' } },
    });
    const dead = hideDestroyedSettlementEdges({
      worldState: armed, settlementId: 'ashfen', tick: 50,
    });
    expect(dead.changed).toBe(false);
    expect(gradeOf(dead.worldState)).toBe('road');
  });
});

describe('J3 §7 revival re-evaluates hidden corridors FIRST, with a warm start', () => {
  /** A realm whose one road has been abandoned to hidden. */
  function abandoned(realmFn) {
    const { world, members } = realmFn();
    let current = world;
    for (let tick = 0; tick <= 320; tick += 40) {
      current = sweepRouteDecay({ worldState: current, members, tick }).worldState;
    }
    return { world: current, members };
  }

  it('THE BONUS IS DECISIVE: the bare score fails the bar and the warm start clears it', () => {
    // Without this pin the revival above passes on a corridor whose objective was
    // already good enough, so zeroing WARM_START_BONUS would change nothing and
    // "the old road remembers" would be an untested sentence. Measured against the
    // very score the revival reads.
    const barren = abandoned(barrenRealm);
    // A MARGINAL resettlement: the reborn seat wants five things and its one
    // neighbour makes exactly one of them, so the corridor is worth something and
    // not much. That is the only fixture in which the bonus can be the deciding
    // term, and building it out of wants rather than out of a tuning override is
    // what keeps the pin measuring the design.
    const members = flowMembersFromSnapshot([
      {
        id: 'ashfen',
        settlement: {
          config: { tradeRouteAccess: 'crossroads' },
          economicState: {
            primaryImports: ['iron', 'timber', 'wool', 'salt', 'spice'],
            primaryExports: [],
          },
        },
      },
      {
        id: 'brackwater',
        settlement: {
          config: { tradeRouteAccess: 'road' },
          economicState: { primaryImports: [], primaryExports: ['iron'] },
        },
      },
    ]);
    const bare = edgeObjectiveScore({
      worldState: barren.world,
      index: buildMaterialIndex({ members, network: readRouteNetwork(barren.world) }),
      a: 'ashfen',
      b: 'brackwater',
      grade: 'hidden',
      tick: 400,
    });
    const bar = Number(ROUTE_CHARTER_TUNING.OBJECTIVE_BAR);
    expect(bare).toBeLessThan(bar);
    expect(bare + Number(ROUTE_DECAY_TUNING.WARM_START_BONUS)).toBeGreaterThanOrEqual(bar);
    const revived = reviveHiddenCorridors({
      worldState: barren.world, members, settlementId: 'ashfen', tick: 400,
    });
    expect([...revived.revived]).toEqual([GENESIS_EDGE]);
  });

  it('the old road is walked again when the realm still needs it', () => {
    const barren = abandoned(barrenRealm);
    expect(gradeOf(barren.world)).toBe('hidden');
    // The remnant is resettled into a realm that now has complementary wants.
    const { members } = needfulRealm();
    const revived = reviveHiddenCorridors({
      worldState: barren.world, members, settlementId: 'ashfen', tick: 400, names: NAMES,
    });
    expect([...revived.revived]).toEqual([GENESIS_EDGE]);
    expect(gradeOf(revived.worldState)).toBe('track');
    expect(revived.news[0].candidateType).toBe('route_revived');
    expect([...revived.news[0].settlementNames]).toEqual(['Ashfen', 'Brackwater']);
    expect(readRouteNetwork(revived.worldState).edges[GENESIS_EDGE][GRADE_STEP_KEY].reason)
      .toBe('revival_warm_start');
  });

  it('the bonus is a bonus: a realm that no longer needs the road stays unconnected', () => {
    const barren = abandoned(barrenRealm);
    const revived = reviveHiddenCorridors({
      worldState: barren.world, members: barren.members, settlementId: 'ashfen', tick: 400,
    });
    expect([...revived.considered]).toEqual([GENESIS_EDGE]);
    expect([...revived.revived]).toEqual([]);
    expect(revived.changed).toBe(false);
    expect(gradeOf(revived.worldState)).toBe('hidden');
  });

  it('the warm start looks at HIDDEN corridors only, and only the revived seat', () => {
    const { world, members } = needfulRealm();
    const revived = reviveHiddenCorridors({
      worldState: world, members, settlementId: 'ashfen', tick: 400,
    });
    // The one road is at 'road', not hidden, so nothing is even considered.
    expect([...revived.considered]).toEqual([]);
    expect(revived.worldState).toBe(world);
  });
});

describe('J3 the conditional gradeStep key, and the persistence path', () => {
  it('a network that never stepped a grade carries no gradeStep key at all', () => {
    const { world } = barrenRealm();
    const edge = readRouteNetwork(world).edges[GENESIS_EDGE];
    // anchored: the stepped twin below carries this key on the same edge id, so its absence here is the drop-when-absent rule rather than a renamed field.
    expect(edge).not.toHaveProperty(GRADE_STEP_KEY);
  });

  it('a stepped edge carries a dated, directed, reasoned receipt that round trips', () => {
    const { world, members } = barrenRealm();
    const swept = sweepRouteDecay({ worldState: world, members, tick: 200, names: NAMES });
    const edge = readRouteNetwork(swept.worldState).edges[GENESIS_EDGE];
    expect(edge[GRADE_STEP_KEY]).toEqual({ tick: 200, direction: 'down', reason: 'demote' });
    const reloaded = JSON.parse(JSON.stringify(swept.worldState));
    expect(readRouteNetwork(reloaded).edges[GENESIS_EDGE]).toEqual(edge);
    expect(JSON.stringify(reloaded)).toBe(JSON.stringify(swept.worldState));
  });

  it('the dwell clock is derived from what already exists, never from a new key', () => {
    const { world } = barrenRealm();
    const edge = readRouteNetwork(world).edges[GENESIS_EDGE];
    expect(lastActivityTick(edge)).toBe(0);
    expect(lastActivityTick({ ...edge, usage: { lastTick: 30 } })).toBe(30);
    expect(lastActivityTick({ ...edge, [GRADE_STEP_KEY]: { tick: 44 } })).toBe(44);
    expect(lastActivityTick({})).toBe(0);
  });
});

describe('J3 Law 7 DORMANCY across every §7 entry point', () => {
  const dark = (() => {
    const { world, members } = barrenRealm();
    return { world: { ...world, simulationRules: {} }, members };
  })();

  it('the ladder sweep returns the INPUT world by reference and steps nothing', () => {
    const out = sweepRouteDecay({ worldState: dark.world, members: dark.members, tick: 400 });
    expect(out.worldState).toBe(dark.world);
    expect(out.verdicts).toHaveLength(0);
    expect(out.news).toHaveLength(0);
    expect(out.stepped).toBe(0);
  });

  it('destruction and revival both refuse by reference on a dark world', () => {
    const dead = hideDestroyedSettlementEdges({
      worldState: dark.world, settlementId: 'ashfen', tick: 50,
    });
    expect(dead.worldState).toBe(dark.world);
    expect(dead.hidden).toHaveLength(0);
    const revived = reviveHiddenCorridors({
      worldState: dark.world, members: dark.members, settlementId: 'ashfen', tick: 50,
    });
    expect(revived.worldState).toBe(dark.world);
    expect(revived.considered).toHaveLength(0);
  });

  it('a dark world is byte-identical after a four-hundred-week ladder soak', () => {
    const before = JSON.stringify(dark.world);
    let current = dark.world;
    for (let tick = 0; tick <= 400; tick += 20) {
      current = sweepRouteDecay({ worldState: current, members: dark.members, tick }).worldState;
    }
    expect(JSON.stringify(current)).toBe(before);
    // ANTI-VACUITY: the LIT twin of the same fixture moved under the same soak.
    const lit = barrenRealm();
    let litWorld = lit.world;
    for (let tick = 0; tick <= 400; tick += 20) {
      litWorld = sweepRouteDecay({ worldState: litWorld, members: lit.members, tick }).worldState;
    }
    expect(JSON.stringify(litWorld)).not.toBe(JSON.stringify(lit.world));
  });
});

describe('J3 the charter and the ladder agree about one world', () => {
  it('a chartered track is a track the ladder can then promote or abandon', () => {
    const members = flowMembersFromSnapshot([
      { id: 'ashfen', settlement: { config: { tradeRouteAccess: 'crossroads' }, economicState: { primaryImports: ['iron'], primaryExports: ['grain'] } } },
      { id: 'dunmoor', settlement: { config: { tradeRouteAccess: 'isolated' }, economicState: { primaryImports: ['grain'], primaryExports: ['iron'] } } },
    ]);
    let world = ensureGenesisRouteNetwork(
      { simulationRules: { routeLifecycleEnabled: true }, tick: 0 },
      members.map(m => ({ id: m.id, config: m.config })), 0,
    );
    for (let tick = 1; tick <= 16; tick += 1) {
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
    const swept = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    const applied = applyRouteCharter({
      worldState: swept.worldState, verdict: swept.verdicts[0], tick: 20,
    });
    const id = 'route.ashfen.dunmoor.land';
    expect(readRouteNetwork(applied.worldState).edges[id].grade).toBe('track');
    // The mercy holds it (it is the only road closing the loop), which is the
    // correct verdict and also proves the ladder is reading the chartered edge.
    const decayed = sweepRouteDecay({ worldState: applied.worldState, members, tick: 200 });
    const verdict = decayed.verdicts.find(v => v.edgeId === id);
    expect(verdict.verdict).toBe('mercy');
    expect(evaluateEdgeDecay({
      worldState: applied.worldState,
      members,
      index: { memberIds: [], importsOf: new Map(), exportsOf: new Map(), suppliersOf: new Map(), consumersOf: new Map(), components: new Map(), criticalGoods: new Set() },
      network: readRouteNetwork(applied.worldState),
      edgeId: id,
      edge: readRouteNetwork(applied.worldState).edges[id],
      tick: 200,
    }).from).toBe('track');
  });
});
