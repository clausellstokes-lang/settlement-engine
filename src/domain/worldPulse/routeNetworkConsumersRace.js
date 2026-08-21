/**
 * routeNetworkConsumersRace.js — THE REPUTATION RACE (W-J slice J4; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §9's integration property, with
 * DESIGN_NPC_CONSEQUENCES.md §6 TRAVEL PHYSICS and §6b REPUTATION AS BELIEF, and
 * DESIGN_INFORMATION_BROKERAGES.md §5's listeners, and §5d's carriers clause).
 *
 * THE DESIGN SIGNATURE PROPERTY, stated by three documents in the same words: a
 * person travels at ROAD SPEED while their story travels at NEWS SPEED, and whether
 * the wanderer or the story reaches a gate first is a DETERMINISTIC FUNCTION of route
 * grade, distance, and who is listening when it gets there. Everything else in the
 * circulation and information programs is machinery; this is the thing the machinery
 * is for.
 *
 * ── THE STORY RIDES THE SAME NETWORK, WEIGHTED BY GRADE ─────────────────────
 * §5d, in its own words: religion spread and information propagation WEIGHT BY EDGE
 * GRADE, because the roads are the arteries of faith and news as much as goods, and a
 * severed route slows a god and a story alike. So the story does not fly: it walks the
 * LIVED network, hop by hop, at the estate's one distance-to-staleness curve
 * (`hopDelayTicks`, which the belief engine and the rumour display already share),
 * impeded by the grade of each way it must use.
 *
 * ── AND IT CANNOT RIDE A HIDDEN PATH, WHICH IS WHAT MAKES THE RACE A RACE ───
 * At news speed the story is structurally FASTER than any traveller: the curve halves
 * the week count, and a walker still pays at least one tick per hop. If both used the
 * same ways, the story would win every time and the "race" would be a foregone
 * conclusion with a receipt attached.
 *
 * It is the HIDDEN PATH that makes both outcomes real, and it is real for a reason
 * rather than as a tuning fix. A hidden way is, by Law 5, the road the realm has
 * FORGOTTEN: nobody walks it, nobody keeps it, so nobody carries word along it. §9
 * gives that road to the wanderer and the smuggler and denies it to everyone else. A
 * wanderer who takes the overgrown shortcut is therefore travelling a corridor the
 * story physically cannot follow, and the story has to go the long way round or not
 * arrive at all. THAT is how a person outruns their own reputation, and it is why the
 * same fixture flips to the story simply by charting the shortcut back into a road.
 *
 * ── LISTENERS AT THE GATE ───────────────────────────────────────────────────
 * The brokerages doc's own sentence: stories are harder to outrun where listeners
 * live. The gate's information houses are read through I2's existing presence gate
 * (`brokerageHousesOf`) at the PERSONS channel, which the brokerages doc §8 names as
 * the mechanical bridge to wanderer reputation, and the competence they hold CUTS the
 * story's journey. Dark (no brokerage layer, no houses, or no statecraft) buys exactly
 * zero, so the race on an ordinary world is the two-term one and this module adds
 * nothing to it.
 *
 * ── WHAT THIS MODULE DELIBERATELY DOES NOT DO ───────────────────────────────
 * It does not decide what the gate BELIEVES. That is H3's `believedReputation`, which
 * already fades a story by elapsed time and hop delay against the closed notoriety
 * ladder. This module hands the caller the ELAPSED the traveller actually spent, and
 * the belief read takes it from there. Two answers to "what does this town think of
 * him" would be one answer too many.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store, no mutation.
 */

import { activeSpatialDigest } from '../spatial/distanceRead.js';
import { clamp01 } from '../../kernel/math.js';
import { hopDelayTicks } from './distancePricedNews.js';
import {
  consumableRouteNetwork,
  livedAdjacency,
} from './routeNetworkConsumers.js';
import { routeLifecycleActive } from './routeNetworkLedger.js';
import { walkLivedJourney } from './routeNetworkConsumersTransit.js';

/**
 * ROUTE_LIFECYCLE_TUNING, the race half (§12: every entry a band, soak-vetoable).
 *
 * NEWS_GRADE_IMPEDANCE is §5d's weighting: a highway carries word at the geometric
 * rate, an ordinary road a little slower, a track slower again, and a HIDDEN path not
 * at all. The hidden rung is NULL rather than a large number on purpose. A big number
 * would make the story merely slow on a forgotten road, and a forgotten road has no
 * travellers to carry it; the refusal is the mechanism, so it is spelled as an absence
 * of a value rather than as a discouraging one.
 *
 * LISTENER_SPEEDUP is the largest share of the journey a fully competent house at the
 * gate can cut. It is bounded well below 1 because Law 1 of the brokerages design says
 * distance decay is BENT by a house and never abolished.
 *
 * The PERSONS channel is the one read, because that is the channel the brokerages
 * design assigns to wanderer reputation.
 *
 * @type {Readonly<Record<string, unknown>>}
 */
export const ROUTE_RACE_TUNING = Object.freeze({
  NEWS_GRADE_IMPEDANCE: Object.freeze({
    highway: 1,
    road: 1.25,
    track: 2,
    hidden: null,
  }),
  LISTENER_SPEEDUP: 0.5,
  LISTENER_CHANNEL: 'persons',
  /** The ceiling on the walk, so a fixture that cannot arrive returns rather than spins. */
  MAX_RACE_TICKS: 520,
});

/**
 * The closed RACE OUTCOME vocabulary. `neither` is a real outcome and not an error:
 * a gate that no road and no telling can reach is the isolation-as-fate law (§0)
 * showing up in the information layer.
 * @type {ReadonlyArray<string>}
 */
export const RACE_OUTCOMES = Object.freeze(['person', 'story', 'together', 'neither']);

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value);
}

/**
 * The news impedance of a grade, or NULL when word cannot travel that way at all.
 * An unrecognized grade reads as the TRACK rung, which is the middle: a word this
 * module has never heard of must be neither a highway nor a silence.
 *
 * @param {string|null|undefined} grade
 * @returns {number|null}
 */
export function newsGradeImpedance(grade) {
  const table = /** @type {Record<string, number|null>} */ (ROUTE_RACE_TUNING.NEWS_GRADE_IMPEDANCE);
  const key = text(grade);
  if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
  return table.track;
}

/**
 * WHAT ONE HOP COSTS A STORY, in whole ticks, or null when it cannot cross at all.
 * The distance price is `hopDelayTicks`, which is the estate's ONE curve, reused
 * rather than re-derived: a second distance-to-staleness model for people would drift
 * from the one for facts within a wave.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   fromId: string, toId: string, grade: string,
 * }} input
 * @returns {number|null}
 */
export function newsHopTicks(input) {
  const impedance = newsGradeImpedance(input.grade);
  if (impedance == null) return null;
  const digest = activeSpatialDigest(input.worldState);
  const base = hopDelayTicks(
    /** @type {Parameters<typeof hopDelayTicks>[0]} */ (digest),
    text(input.fromId),
    text(input.toId),
  );
  return Math.max(0, Math.floor(base * impedance));
}

/**
 * THE LISTENERS AT A GATE, on 0..1, normalized. Absent, unreadable, or out of range
 * reads ZERO, which is the no-house world and the byte-inert case.
 *
 * ── WHY THIS IS AN INJECTED NUMBER AND NOT A ROSTER READ ────────────────────
 * The value the caller should pass is the best PERSONS-channel competence any
 * information house at the gate holds, which the brokerage program derives from a
 * settlement's institution roster behind its own dormancy gate. This module takes the
 * NUMBER rather than the roster, and the choice is the same one H3 made when it took
 * a `hiddenHopsOf` callback instead of importing the route network: two programs
 * coordinate by a stated seam, not by one reaching into the other's files. The
 * consequences are the ones that matter here. A caller that has no information layer
 * passes nothing and this whole term is zero, so the race on an ordinary world is the
 * two-term one. A caller that has one supplies the value already gated, so the
 * brokerage layer's own dormancy governs it and cannot be accidentally bypassed from
 * this side. And neither program can break the other by refactoring.
 *
 * The channel is named in the tuning above rather than left to the caller's judgment,
 * because the brokerages design assigns wanderer reputation to the PERSONS channel
 * specifically and a caller reading a different one would be answering a different
 * question with this function's name on it.
 *
 * @param {unknown} value
 * @returns {number} 0..1
 */
export function listenerShare01(value) {
  const raw = Number(value);
  return Number.isFinite(raw) ? clamp01(raw) : 0;
}

/**
 * @typedef {Object} StoryArrival
 * @property {number} ticks     ticks until the telling reaches the gate
 * @property {number} rawTicks  before the listeners at the gate cut it
 * @property {number} hops      lived edges the telling crossed
 * @property {ReadonlyArray<string>} path
 * @property {boolean} arrives  false when no open way carries it at all
 * @property {number} listeners 0..1
 */

/**
 * HOW LONG THE STORY TAKES TO REACH THE GATE (§5d's carriers clause).
 *
 * A cheapest-telling walk over the LIVED network, excluding hidden ways for the reason
 * in the header. Deterministic by construction: the frontier is scanned in codepoint
 * order and a tie keeps the codepoint-low seat, so the same world always produces the
 * same telling path.
 *
 * BOUNDED: the network is bounded by §3's candidate-set law, and the walk visits each
 * seat once.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   originId: string,
 *   gateId: string,
 *   listeners01?: unknown,
 * }} input
 * @returns {StoryArrival}
 */
export function storyArrivalTicks(input) {
  const worldState = input.worldState || {};
  const origin = text(input.originId);
  const gate = text(input.gateId);
  const listeners = listenerShare01(input.listeners01);
  /** @type {StoryArrival} */
  const nowhere = {
    ticks: 0, rawTicks: 0, hops: 0, path: Object.freeze([]), arrives: false, listeners,
  };
  if (!routeLifecycleActive(worldState) || !origin || !gate) return nowhere;
  if (origin === gate) {
    return { ticks: 0, rawTicks: 0, hops: 0, path: Object.freeze([origin]), arrives: true, listeners };
  }

  const adjacency = livedAdjacency(consumableRouteNetwork(worldState));
  /** @type {Map<string, number>} */
  const best = new Map([[origin, 0]]);
  /** @type {Map<string, string>} */
  const cameFrom = new Map();
  /** @type {Set<string>} */
  const settled = new Set();

  for (;;) {
    /** @type {string} */
    let cursor = '';
    let cursorCost = 0;
    for (const seat of [...best.keys()].sort()) {
      if (settled.has(seat)) continue;
      const cost = /** @type {number} */ (best.get(seat));
      if (!cursor || cost < cursorCost) { cursor = seat; cursorCost = cost; }
    }
    if (!cursor) break;
    if (cursor === gate) break;
    settled.add(cursor);
    for (const hop of adjacency.get(cursor) || []) {
      if (hop.hidden) continue;
      const step = newsHopTicks({
        worldState, fromId: cursor, toId: hop.toId, grade: hop.grade,
      });
      if (step == null) continue;
      const total = cursorCost + step;
      const prior = best.get(hop.toId);
      if (prior == null || total < prior) {
        best.set(hop.toId, total);
        cameFrom.set(hop.toId, cursor);
      }
    }
  }

  const rawTicks = best.get(gate);
  if (rawTicks == null) return nowhere;
  /** @type {Array<string>} */
  const path = [gate];
  let cursor = gate;
  while (cursor !== origin) {
    const prior = cameFrom.get(cursor);
    if (!prior) break;
    path.unshift(prior);
    cursor = prior;
  }
  // THE LISTENERS CUT, applied once at the end rather than per hop: the houses stand
  // at the GATE, and what they buy is hearing sooner, not a faster road.
  const bonus = Math.floor(rawTicks * Number(ROUTE_RACE_TUNING.LISTENER_SPEEDUP) * listeners);
  return {
    ticks: Math.max(0, rawTicks - bonus),
    rawTicks,
    hops: Math.max(0, path.length - 1),
    path: Object.freeze(path),
    arrives: true,
    listeners,
  };
}

/**
 * @typedef {Object} RaceReading
 * @property {string} winner    one of RACE_OUTCOMES
 * @property {number} personTicks
 * @property {number} storyTicks
 * @property {boolean} personArrives
 * @property {boolean} storyArrives
 * @property {number} hops      lived edges the traveller crossed
 * @property {ReadonlyArray<string>} grades  the grade of each way they walked
 * @property {ReadonlyArray<string>} personPath
 * @property {ReadonlyArray<string>} storyPath
 * @property {number} listeners
 * @property {string} kind
 */

/**
 * RUN THE RACE (§9's integration property).
 *
 * The traveller half is SIMULATED through the real one-hop physics, including the
 * hidden-path law, so an army and a wanderer starting from the same seat genuinely
 * take different roads and genuinely arrive on different ticks. The story half is the
 * cheapest telling over the open network. Neither half is allowed to answer for the
 * other.
 *
 * `together` is a real outcome: on a short road, word and walker can reach a gate on
 * the same tick, and reporting a false winner would put a coin flip inside a function
 * whose whole contract is determinism.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   originId: string,
 *   gateId: string,
 *   kind: string,
 *   tick?: number,
 *   season?: string|null,
 *   listeners01?: unknown,
 *   maxTicks?: number,
 * }} input
 * @returns {RaceReading}
 */
export function reputationRace(input) {
  const worldState = input.worldState || {};
  const kind = text(input.kind);
  const maxTicks = Number.isFinite(input.maxTicks) && Number(input.maxTicks) > 0
    ? Math.floor(Number(input.maxTicks))
    : Number(ROUTE_RACE_TUNING.MAX_RACE_TICKS);
  const journey = walkLivedJourney({
    worldState,
    fromId: text(input.originId),
    destId: text(input.gateId),
    kind,
    tick: Number.isFinite(input.tick) ? Number(input.tick) : 0,
    season: input.season || null,
    maxTicks,
  });
  const story = storyArrivalTicks({
    worldState,
    originId: text(input.originId),
    gateId: text(input.gateId),
    listeners01: input.listeners01,
  });

  const winner = !journey.arrived && !story.arrives ? 'neither'
    : !story.arrives ? 'person'
      : !journey.arrived ? 'story'
        : journey.ticks < story.ticks ? 'person'
          : story.ticks < journey.ticks ? 'story'
            : 'together';

  return {
    winner,
    personTicks: journey.ticks,
    storyTicks: story.ticks,
    personArrives: journey.arrived,
    storyArrives: story.arrives,
    hops: journey.hops,
    grades: journey.grades,
    personPath: journey.path,
    storyPath: story.path,
    listeners: story.listeners,
    kind,
  };
}
