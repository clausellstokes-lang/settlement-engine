/**
 * routeNetworkConsumersRace.test.js — W-J slice J4, THE REPUTATION RACE (binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §9's integration property and §5d's carriers clause,
 * with DESIGN_NPC_CONSEQUENCES.md §6 and §6b, and DESIGN_INFORMATION_BROKERAGES.md §5).
 *
 * THIS IS THE DESIGN SIGNATURE PROPERTY, and the pins are built to be DECISIVE about
 * it rather than merely green. Three documents say the same sentence: whether the
 * wanderer or the story reaches a gate first is a deterministic function of ROUTE
 * GRADE, DISTANCE, and LISTENERS at the gate. So the file demonstrates BOTH OUTCOMES
 * on ONE FIXTURE, three times over, changing exactly one of those three things each
 * time and nothing else:
 *
 *   GRADE      the shortcut out of Ashfen is hidden, and the wanderer beats the
 *              story; charter that same shortcut into a highway and the story wins.
 *   DISTANCE   the same hidden-shortcut topology, the same grades, a farther gate:
 *              the story wins.
 *   LISTENERS  the same hidden shortcut and the same near gate, with an information
 *              house standing at the gate: the story wins.
 *
 * A pin that only showed one outcome would be satisfied by an implementation in which
 * the story always wins, which is what a naive reading produces (news travels at half
 * the week count and a walker still pays a tick a hop). The mechanism that makes the
 * race real is that the story CANNOT RIDE A HIDDEN PATH, because a road nobody walks
 * has nobody on it to carry word. That is pinned directly as well.
 */
import { describe, expect, it } from 'vitest';
import {
  RACE_OUTCOMES,
  ROUTE_RACE_TUNING,
  listenerShare01,
  newsGradeImpedance,
  newsHopTicks,
  reputationRace,
  storyArrivalTicks,
} from '../../src/domain/worldPulse/routeNetworkConsumersRace.js';
import {
  emptyRouteNetwork,
  routeEdge,
  withRouteEdges,
  writeRouteNetwork,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { brokerageChannelCompetence } from '../../src/data/informationBrokerageTuning.js';

/** The same Vale the transit pins walk: five seats, every pair priced and gated. */
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

/** @returns {Record<string, unknown>} */
function valeDigest() {
  /** @type {Array<{ between: [string, string], cost: number }>} */
  const gates = [];
  const seats = Object.keys(VALE_DISTANCES).sort();
  for (let i = 0; i < seats.length; i += 1) {
    for (let j = i + 1; j < seats.length; j += 1) {
      gates.push({ between: [seats[i], seats[j]], cost: VALE_DISTANCES[seats[i]][seats[j]] });
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
 * THE VALE, WIRED. Brackwater is the hub every OPEN road runs through, and the two
 * ways straight out of Ashfen are the shortcuts whose grade the pins vary.
 *
 * @param {{ shortcut?: string, lit?: boolean, edges?: ReadonlyArray<unknown> }} [options]
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
  return writeRouteNetwork(
    {
      simulationRules: options.lit === false ? {} : { routeLifecycleEnabled: true },
      spatialCanonVersion: 1,
      spatialDigest: valeDigest(),
      tick: 0,
    },
    withRouteEdges(emptyRouteNetwork(), /** @type {never} */ (edges)),
  );
}

/** The competence a major illegal house holds in the PERSONS channel (the I1 table). */
const WHISPER_MARKET_PERSONS = brokerageChannelCompetence('illegal', 'major', 'persons');

describe('J4 §9 THE REPUTATION RACE: grade alone decides who reaches the gate first', () => {
  it('the wanderer takes the overgrown shortcut and beats the story to Dunmoor', () => {
    const race = reputationRace({
      worldState: valeWorld({ shortcut: 'hidden' }),
      originId: 'ashfen',
      gateId: 'dunmoor',
      kind: 'wanderer',
    });
    expect(race.winner).toBe('person');
    expect(race.personTicks).toBe(8);
    expect(race.storyTicks).toBe(10);
    expect([...race.personPath]).toEqual(['ashfen', 'dunmoor']);
    expect([...race.grades]).toEqual(['hidden']);
    // The story had to go the long way round, because no telling rides a hidden way.
    expect([...race.storyPath]).toEqual(['ashfen', 'brackwater', 'dunmoor']);
  });

  it('CHARTER THE SAME SHORTCUT INTO A HIGHWAY AND THE STORY WINS', () => {
    // THE NEGATIVE CONTROL, and it is one word of the fixture: the grade of a single
    // edge. Everything else, the digest, the seats, the traveller, is identical.
    const race = reputationRace({
      worldState: valeWorld({ shortcut: 'highway' }),
      originId: 'ashfen',
      gateId: 'dunmoor',
      kind: 'wanderer',
    });
    expect(race.winner).toBe('story');
    expect(race.personTicks).toBe(3);
    expect(race.storyTicks).toBe(2);
    expect([...race.storyPath]).toEqual(['ashfen', 'dunmoor']);
  });

  it('the whole grade ladder moves both clocks, and the story is always the faster rider', () => {
    for (const grade of ['highway', 'road', 'track']) {
      const race = reputationRace({
        worldState: valeWorld({ shortcut: grade }),
        originId: 'ashfen',
        gateId: 'dunmoor',
        kind: 'wanderer',
      });
      expect(race.winner).toBe('story');
      expect(race.storyTicks).toBeLessThan(race.personTicks);
    }
  });
});

describe('J4 §9 THE REPUTATION RACE: distance alone decides it too', () => {
  it('the same hidden-shortcut topology at a farther gate goes to the story', () => {
    // Ashfen reaches BOTH Dunmoor and Farholt by a hidden shortcut, and both gates
    // sit two open road hops away through Brackwater. The ONLY difference is how far
    // the shortcut runs: twelve hundred to Dunmoor, three thousand six hundred to
    // Farholt. Near, the wanderer wins; far, the overgrown road costs more than the
    // road round and the story is there first.
    const world = valeWorld({ shortcut: 'hidden' });
    const near = reputationRace({
      worldState: world, originId: 'ashfen', gateId: 'dunmoor', kind: 'wanderer',
    });
    const far = reputationRace({
      worldState: world, originId: 'ashfen', gateId: 'farholt', kind: 'wanderer',
    });
    expect(near.winner).toBe('person');
    expect(far.winner).toBe('story');
    expect(near.storyTicks).toBe(far.storyTicks);
    expect(far.personTicks).toBeGreaterThan(near.personTicks);
  });
});

describe('J4 §9 THE REPUTATION RACE: listeners at the gate decide it as well', () => {
  it('a whisper market at the gate takes the same race off the wanderer', () => {
    // Identical world, identical traveller, identical distance and grade. The only
    // thing that changed is who was listening when the telling arrived.
    const world = valeWorld({ shortcut: 'hidden' });
    const quiet = reputationRace({
      worldState: world, originId: 'ashfen', gateId: 'dunmoor', kind: 'wanderer',
    });
    const listening = reputationRace({
      worldState: world,
      originId: 'ashfen',
      gateId: 'dunmoor',
      kind: 'wanderer',
      listeners01: WHISPER_MARKET_PERSONS,
    });
    expect(quiet.winner).toBe('person');
    expect(listening.winner).toBe('story');
    expect(listening.personTicks).toBe(quiet.personTicks);
    expect(listening.storyTicks).toBeLessThan(quiet.storyTicks);
    expect(listening.listeners).toBe(WHISPER_MARKET_PERSONS);
  });

  it('a house at half competence makes it a dead heat, which is a real outcome', () => {
    const race = reputationRace({
      worldState: valeWorld({ shortcut: 'hidden' }),
      originId: 'ashfen',
      gateId: 'dunmoor',
      kind: 'wanderer',
      listeners01: 0.5,
    });
    expect(race.winner).toBe('together');
    expect(race.personTicks).toBe(race.storyTicks);
  });

  it('the listeners term is bounded, never negative, and zero by default', () => {
    expect(listenerShare01(undefined)).toBe(0);
    expect(listenerShare01(null)).toBe(0);
    expect(listenerShare01('loud')).toBe(0);
    expect(listenerShare01(-3)).toBe(0);
    expect(listenerShare01(7)).toBe(1);
    expect(listenerShare01(0.42)).toBe(0.42);

    const world = valeWorld({ shortcut: 'hidden' });
    const saturated = storyArrivalTicks({
      worldState: world, originId: 'ashfen', gateId: 'dunmoor', listeners01: 1,
    });
    expect(saturated.ticks).toBeGreaterThanOrEqual(0);
    expect(saturated.ticks).toBeLessThan(saturated.rawTicks);
    expect(saturated.rawTicks - saturated.ticks)
      .toBe(Math.floor(saturated.rawTicks * Number(ROUTE_RACE_TUNING.LISTENER_SPEEDUP)));
  });
});

describe('J4 §5d the story rides the roads, weighted by grade, and never a hidden one', () => {
  it('a hidden way carries no telling at all', () => {
    expect(newsGradeImpedance('hidden')).toBeNull();
    expect(newsGradeImpedance('highway')).toBe(1);
    expect(newsGradeImpedance('road')).toBe(1.25);
    expect(newsGradeImpedance('track')).toBe(2);
    // An unknown grade reads the middle rung rather than a silence or a highway.
    expect(newsGradeImpedance('viaduct')).toBe(newsGradeImpedance('track'));

    const world = valeWorld();
    expect(newsHopTicks({
      worldState: world, fromId: 'ashfen', toId: 'dunmoor', grade: 'hidden',
    })).toBeNull();
    expect(newsHopTicks({
      worldState: world, fromId: 'ashfen', toId: 'dunmoor', grade: 'highway',
    })).toBe(2);
  });

  it('a worse grade slows the same telling over the same ground', () => {
    const world = valeWorld();
    const ticks = (/** @type {string} */ grade) => newsHopTicks({
      worldState: world, fromId: 'ashfen', toId: 'brackwater', grade,
    });
    expect(ticks('highway')).toBe(4);
    expect(ticks('road')).toBe(5);
    expect(ticks('track')).toBe(8);
  });

  it('when the ONLY way is overgrown the story never arrives, and the person wins by default', () => {
    const world = valeWorld({ edges: [edgeAt('ashfen', 'dunmoor', 'hidden')] });
    const race = reputationRace({
      worldState: world, originId: 'ashfen', gateId: 'dunmoor', kind: 'wanderer',
    });
    expect(race.storyArrives).toBe(false);
    expect(race.personArrives).toBe(true);
    expect(race.winner).toBe('person');
  });

  it('and when nobody can get there at all the outcome is NEITHER, which is isolation as fate', () => {
    const world = valeWorld({ edges: [edgeAt('ashfen', 'dunmoor', 'hidden')] });
    const race = reputationRace({
      worldState: world, originId: 'ashfen', gateId: 'dunmoor', kind: 'army',
    });
    expect(race.personArrives).toBe(false);
    expect(race.storyArrives).toBe(false);
    expect(race.winner).toBe('neither');
    expect([...RACE_OUTCOMES].sort()).toEqual(['neither', 'person', 'story', 'together']);
  });
});

describe('J4 §9 the race is deterministic and reads the world it is handed', () => {
  it('the same world and the same question always answer the same way', () => {
    const world = valeWorld({ shortcut: 'hidden' });
    const first = reputationRace({
      worldState: world, originId: 'ashfen', gateId: 'dunmoor', kind: 'wanderer',
    });
    const second = reputationRace({
      worldState: valeWorld({ shortcut: 'hidden' }),
      originId: 'ashfen',
      gateId: 'dunmoor',
      kind: 'wanderer',
    });
    expect(second).toEqual(first);
  });

  it('the traveller kind is part of the race, so the column runs a different one', () => {
    const world = valeWorld({ shortcut: 'hidden' });
    const wanderer = reputationRace({
      worldState: world, originId: 'ashfen', gateId: 'dunmoor', kind: 'wanderer',
    });
    const column = reputationRace({
      worldState: world, originId: 'ashfen', gateId: 'dunmoor', kind: 'army',
    });
    expect(wanderer.winner).toBe('person');
    expect(column.winner).toBe('story');
    expect(column.personTicks).toBeGreaterThan(wanderer.personTicks);
    expect(column.storyTicks).toBe(wanderer.storyTicks);
  });
});

describe('J4 Law 7 dormancy: a dark world runs no race', () => {
  it('nobody arrives and the outcome is neither', () => {
    const race = reputationRace({
      worldState: valeWorld({ lit: false }),
      originId: 'ashfen',
      gateId: 'dunmoor',
      kind: 'wanderer',
      maxTicks: 40,
    });
    expect(race.winner).toBe('neither');
    expect(race.personArrives).toBe(false);
    expect(race.storyArrives).toBe(false);
    expect(race.personTicks).toBe(40);
    expect(race.storyTicks).toBe(0);
  });

  it('the story arrival on a dark world is an explicit non-arrival, not a zero', () => {
    const story = storyArrivalTicks({
      worldState: valeWorld({ lit: false }), originId: 'ashfen', gateId: 'dunmoor',
    });
    expect(story.arrives).toBe(false);
    expect(story.hops).toBe(0);
    expect([...story.path]).toEqual([]);
  });
});
