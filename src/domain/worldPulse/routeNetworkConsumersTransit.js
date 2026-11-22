/**
 * routeNetworkConsumersTransit.js — THE TRAVEL PHYSICS CONSUMER (W-J slice J4;
 * binding law docs/DESIGN_ROUTE_LIFECYCLE.md §9, with DESIGN_NPC_CONSEQUENCES.md §6
 * TRAVEL PHYSICS, which W-H slice H3 implements).
 *
 * §9 in one sentence: armies use the existing armyTransit, roamers move ONE HOP PER
 * TICK on routes CONNECTED to where they stand, may be MID-ROUTE at any pause, and
 * wanderers and smugglers may take hidden paths at a grade penalty while armies may
 * not. H3 built the physics of being a walker; this module is what that walker walks
 * ON once the network is alive.
 *
 * ── THE DIVISION OF LABOUR, AND WHY IT IS NOT A FORK ────────────────────────
 * THE SHARED NAMED-PERSON KERNEL OWNS POSITION. `namedPersonLegPosition` decides
 * whether a leg has landed and where the walker is while it has not, and this module
 * calls it rather than re-deriving it: a second answer to "where is the walker" would
 * be the kind of drift that shows up a wave later as a roamer standing in two places.
 *
 * J4 OWNS SELECTION AND PRICE. Which way leaves this settlement is a question about
 * the LIVED network, which did not exist when H3 was written, and what the way costs
 * is a question about its GRADE, which is J3's ladder. H3's own hop reader walks the
 * frozen digest's routing adjacency, and after J3 that is the realm's BIRTH graph
 * rather than its present one (Law 2 makes the divergence expected and permanent).
 * So the hop comes from here.
 *
 * THE LEG RECORD IS H3'S SHAPE, EXACTLY: `{ fromId, toId, departTick, arrivalTick,
 * hidden? }`. Not a superset. H3 persists that record on the roamer's own ledger
 * entry, so a leg carrying a key H3 has never heard of would either be dropped on the
 * next round trip or become a second program's field inside a first program's record.
 * The extra readings this module has (which edge, what grade) ride the STEP RESULT,
 * which is returned and never stored.
 *
 * ── ONE HOP MEANS ONE HOP ───────────────────────────────────────────────────
 * The tick a leg completes, the walker lands and takes NO further hop. That is the
 * same shape H3's `advanceWanderer` takes, and it is what stops "one hop per tick"
 * from being laundered into several by a walker whose legs happen to be short.
 *
 * ── DORMANT IS A REFUSAL, NOT A FALLBACK ────────────────────────────────────
 * On a dark world this module moves nobody and returns the input leg untouched. It
 * does NOT quietly fall back to the digest reading, because falling back would make a
 * dark world behave differently from a world without the file, which is exactly what
 * Law 7 forbids. The roamer lane's dark behaviour is H3's, reached by H3's own call.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store, no mutation, and
 * ZERO rng draws.
 */

import { activeSpatialDigest, hopWeeks } from '../spatial/distanceRead.js';
import { livedRouteToward, mayUseHiddenPaths } from './routeNetworkConsumers.js';
import { routeLifecycleActive } from './routeNetworkLedger.js';
import {
  NAMED_PERSON_TRANSIT_TUNING,
  namedPersonLegPosition,
  namedPersonLegTicks,
  openNamedPersonLeg,
} from './namedPersonTransit.js';

/** @typedef {import('./npcCirculationTransit.js').WanderLeg} WanderLeg */
/** @typedef {import('./routeNetworkConsumers.js').LivedHop} LivedHop */

/**
 * ROUTE_LIFECYCLE_TUNING, the transit half (§12: every entry a band, soak-vetoable).
 *
 * GRADE_LEG_MULTIPLIER is §9's "grade penalty" as a number, and the ladder is the
 * whole point of the route lifecycle showing up in somebody's travel time: a highway
 * is the realm's spine and moves people faster than the ordinary road, a track is a
 * way that has been earned but not yet proven, and a hidden path is an overgrown
 * remnant that a person can still push through slowly.
 *
 * THE HIDDEN RUNG IS 2 BECAUSE H3'S IS. `NPC_CONSEQUENCES_TUNING.HIDDEN_PATH_SLOWDOWN`
 * is 2, and two programs disagreeing about what an overgrown road costs a walker
 * would be visible as a roamer who arrives on a different tick depending on which
 * lane advanced them. The number is repeated rather than imported on purpose: these
 * are two independently vetoable tuning surfaces that happen to agree today, and a
 * shared import would make a future owner ruling about one silently retune the other.
 * The agreement is pinned instead, which is the honest way to hold two bands equal.
 *
 * MIN_LEG_TICKS is the floor H3 also keeps: a leg can never resolve on the tick it
 * opened, so no walker crosses two edges in one advance.
 *
 * @type {Readonly<Record<string, unknown>>}
 */
export const ROUTE_TRANSIT_TUNING = Object.freeze({
  GRADE_LEG_MULTIPLIER: Object.freeze({
    highway: 0.75,
    road: 1,
    track: 1.5,
    hidden: 2,
  }),
  MIN_LEG_TICKS: NAMED_PERSON_TRANSIT_TUNING.MIN_LEG_TICKS,
  /**
   * The weeks a lived edge costs when the frozen geometry cannot price the pair at
   * all. Only a USER route can reach this rung: genesis derives from the digest's
   * own k-nearest selection and the charter refuses anything past the
   * expedition-worth ceiling, so an unpriceable pair is the DM asserting a road the
   * geometry does not know about. The floor is the honest reading of that assertion.
   */
  UNPRICED_LEG_WEEKS: NAMED_PERSON_TRANSIT_TUNING.UNPRICED_LEG_WEEKS,
});

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value);
}

/** @param {unknown} value @returns {number} a non-negative integer tick */
function tickOf(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/**
 * The leg multiplier for a grade. An unrecognized grade pays the ROAD rung, which is
 * the neutral one: a word this module has never heard of must be neither a free
 * highway nor a smuggler's penalty.
 *
 * @param {string|null|undefined} grade
 * @returns {number}
 */
export function gradeLegMultiplier(grade) {
  const table = /** @type {Record<string, number>} */ (ROUTE_TRANSIT_TUNING.GRADE_LEG_MULTIPLIER);
  const found = table[text(grade)];
  return Number.isFinite(found) && found > 0 ? found : table.road;
}

/**
 * WHAT ONE LIVED HOP COSTS A TRAVELLER, in whole ticks. The frozen geometry's own
 * week count for the pair, priced by the grade of the way that actually carries it.
 *
 * FLOORED to a whole number and then floored again at MIN_LEG_TICKS, so the cost is
 * an integer a save can round-trip and a leg can never resolve on its departure tick.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   fromId: string,
 *   hop: LivedHop,
 *   season?: string|null,
 * }} input
 * @returns {number}
 */
export function livedLegTicks(input) {
  const digest = activeSpatialDigest(input.worldState);
  const nominal = digest
    ? hopWeeks(digest, text(input.fromId), text(input.hop.toId), input.season || null)
    : null;
  return namedPersonLegTicks({
    nominalWeeks: nominal,
    gradeMultiplier: gradeLegMultiplier(input.hop.grade),
    unpricedWeeks: ROUTE_TRANSIT_TUNING.UNPRICED_LEG_WEEKS,
  });
}

/**
 * @typedef {Object} LivedLegPlan
 * @property {WanderLeg} leg   H3's leg record, byte-compatible with H3's own
 * @property {LivedHop} hop    which edge it rides, returned and never stored
 * @property {number} ticks    the leg's duration
 */

/**
 * OPEN ONE LEG over one lived hop. The walker commits to exactly one edge and is
 * MID-ROUTE until its arrival tick.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   fromId: string,
 *   hop: LivedHop,
 *   tick: number,
 *   season?: string|null,
 * }} input
 * @returns {LivedLegPlan}
 */
export function openLivedLeg(input) {
  const ticks = livedLegTicks(input);
  const leg = openNamedPersonLeg({
    fromId: text(input.fromId),
    toId: text(input.hop.toId),
    departTick: tickOf(input.tick),
    nominalWeeks: ticks,
    hidden: input.hop.hidden === true,
  });
  return { leg: /** @type {WanderLeg} */ (leg), hop: input.hop, ticks };
}

/**
 * @typedef {Object} HopReading
 * @property {import('./routeNetworkConsumers.js').LivedHop|null} hop
 * @property {string} verdict  one of HOP_VERDICTS
 * @property {number} ticks    the whole journey's cost from here, 0 when there is none
 * @property {ReadonlyArray<string>} route  the cheapest whole way, empty when there is none
 */

/**
 * @param {string} verdict
 * @param {import('./routeNetworkConsumers.js').LivedHop|null} hop
 * @param {number} ticks
 * @param {ReadonlyArray<string>} route
 * @returns {HopReading}
 */
function hopReading(verdict, hop, ticks, route) {
  return { hop, verdict, ticks, route };
}

/**
 * ONE HOP TOWARD A DESTINATION, over the LIVED network, as THIS KIND may walk it
 * (§9's connected-only rule and J-D9 (d)'s access law, together).
 *
 * The hop is the first step of the cheapest whole journey, solved over the lived
 * graph with this module's grade pricing (see `livedRouteToward` for why routing
 * rather than proximity is the correct rule here).
 *
 * REFUSED_HIDDEN IS MEASURED, NOT ASSUMED, and it is a separate word from
 * `unconnected` on purpose. When the kind-restricted solve finds nothing, the
 * PERMISSIVE solve runs: if the destination is reachable once hidden ways are
 * allowed, the traveller is not stranded, they are REFUSED, and §9 is a rule about
 * exactly that. A column that cannot march because the last open way decayed to a
 * track is a different fact about the world from a column with nowhere to go, and a
 * receipt that spelled them the same would hide the law working. The second solve is
 * paid only on failure.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   fromId: string,
 *   destId: string,
 *   kind: string,
 *   season?: string|null,
 * }} input
 * @returns {HopReading}
 */
export function livedHopToward(input) {
  const worldState = input.worldState || {};
  if (!routeLifecycleActive(worldState)) return hopReading('dormant', null, 0, Object.freeze([]));
  const from = text(input.fromId);
  const dest = text(input.destId);
  if (!from || !dest) return hopReading('unconnected', null, 0, Object.freeze([]));
  if (from === dest) return hopReading('arrived', null, 0, Object.freeze([]));

  const kind = text(input.kind);
  const season = input.season || null;
  const allowed = mayUseHiddenPaths(kind);
  /**
   * @param {boolean} permissive
   * @returns {(fromId: string, hop: import('./routeNetworkConsumers.js').LivedHop) => number|null}
   */
  const priceHop = (permissive) => (fromId, hop) => {
    if (hop.hidden && !permissive && !allowed) return null;
    return livedLegTicks({ worldState, fromId, hop, season });
  };

  const route = livedRouteToward({ worldState, fromId: from, destId: dest, costOf: priceHop(false) });
  if (route.reachable && route.hop) {
    return hopReading('hop', route.hop, route.ticks, route.path);
  }
  const permissive = livedRouteToward({
    worldState, fromId: from, destId: dest, costOf: priceHop(true),
  });
  return hopReading(
    permissive.reachable ? 'refused_hidden' : 'unconnected', null, 0, Object.freeze([]),
  );
}

/**
 * The closed TRANSIT VERDICT vocabulary. Every outcome, including every way of not
 * moving, has a word.
 * @type {ReadonlyArray<string>}
 */
export const TRANSIT_VERDICTS = Object.freeze([
  'departed', 'in_transit', 'arrived', 'at_rest', 'unconnected', 'refused_hidden', 'dormant',
]);

/**
 * @typedef {Object} TransitStep
 * @property {WanderLeg|null} leg   the leg to carry after this tick, null at rest
 * @property {string} atSettlementId  where the walker is, empty while mid-route
 * @property {boolean} arrived      the walker completed a leg this tick
 * @property {boolean} changed
 * @property {string} verdict       one of TRANSIT_VERDICTS
 * @property {LivedHop|null} hop    the hop opened this tick, when one was
 * @property {number} progress01    0..1 along the current leg
 */

/**
 * @param {Partial<TransitStep> & { verdict: string }} fields
 * @returns {TransitStep}
 */
function stepOf(fields) {
  return {
    leg: fields.leg || null,
    atSettlementId: text(fields.atSettlementId),
    arrived: fields.arrived === true,
    changed: fields.changed === true,
    verdict: fields.verdict,
    hop: fields.hop || null,
    progress01: Number.isFinite(fields.progress01) ? Number(fields.progress01) : 0,
  };
}

/**
 * ADVANCE ONE TRAVELLER ONE TICK OVER THE LIVED NETWORK (§9).
 *
 *   - MID-ROUTE  the walker stays on the leg. No new hop, which is the one-hop
 *                rule's teeth, and the position comes from H3.
 *   - ARRIVING   the walker lands at the far end and CLOSES the leg, taking no
 *                further hop this tick.
 *   - AT REST    at most one new leg opens, over a lived edge the traveller's kind
 *                is allowed to use, toward the destination.
 *
 * A walker already at their destination gets a null leg and stays put, which is how
 * a journey ends without a terminal state anybody has to remember to write.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   atSettlementId: string,
 *   leg?: WanderLeg|null,
 *   destId: string,
 *   kind: string,
 *   tick: number,
 *   season?: string|null,
 * }} input
 * @returns {TransitStep}
 */
export function advanceLivedTraveller(input) {
  const worldState = input.worldState || {};
  const now = tickOf(input.tick);
  const leg = input.leg || null;

  // MID-ROUTE first, and BEFORE the dormancy gate, deliberately. A walker already on
  // a leg when the flag went dark must still be able to finish it; stranding them
  // mid-road would be a lifecycle hole rather than a dormancy guarantee, and the
  // guarantee Law 7 actually asks for is that a dark world never STARTS anything.
  if (leg && text(leg.toId)) {
    const position = namedPersonLegPosition(leg, now);
    if (!position.arrived) {
      return stepOf({
        leg, atSettlementId: '', verdict: 'in_transit', progress01: position.progress01,
      });
    }
    return stepOf({
      leg: null,
      atSettlementId: text(leg.toId),
      arrived: true,
      changed: true,
      verdict: 'arrived',
      progress01: 1,
    });
  }

  const here = text(input.atSettlementId);
  if (!here) return stepOf({ verdict: 'unconnected' });
  const reading = livedHopToward({
    worldState,
    fromId: here,
    destId: text(input.destId),
    kind: text(input.kind),
    season: input.season || null,
  });
  if (reading.verdict !== 'hop' || !reading.hop) {
    return stepOf({
      atSettlementId: here,
      verdict: reading.verdict === 'arrived' ? 'at_rest' : reading.verdict,
    });
  }
  const plan = openLivedLeg({
    worldState, fromId: here, hop: reading.hop, tick: now, season: input.season || null,
  });
  return stepOf({
    leg: plan.leg, atSettlementId: '', changed: true, verdict: 'departed', hop: plan.hop,
  });
}

/**
 * @typedef {Object} JourneyReading
 * @property {number} ticks     ticks spent, from departure to arrival
 * @property {number} hops      lived edges crossed
 * @property {ReadonlyArray<string>} path  the settlements actually stood in
 * @property {ReadonlyArray<string>} grades  the grade of each edge crossed
 * @property {boolean} arrived
 * @property {string} verdict   the last verdict the walk saw
 */

/**
 * WALK A WHOLE JOURNEY, one tick at a time, and report what it cost.
 *
 * SIMULATED RATHER THAN SOLVED, and the distinction is the point. A shortest-path
 * solve would answer what the network COULD do; the reputation race and the tuning
 * pass both need to know what a traveller subject to the one-hop rule and the
 * hidden-path law ACTUALLY does, including dead-ending on a network whose cheapest
 * direction is behind a way this kind may not walk.
 *
 * TOTAL BY CONSTRUCTION: the walk is capped, so a fixture that cannot arrive returns
 * a reading rather than spinning. The cap is stated by the caller because the
 * sensible ceiling is a property of the realm rather than of this function.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   fromId: string,
 *   destId: string,
 *   kind: string,
 *   tick?: number,
 *   season?: string|null,
 *   maxTicks?: number,
 * }} input
 * @returns {JourneyReading}
 */
export function walkLivedJourney(input) {
  const start = tickOf(input.tick);
  const cap = Number.isFinite(input.maxTicks) && Number(input.maxTicks) > 0
    ? Math.floor(Number(input.maxTicks))
    : 520;
  const dest = text(input.destId);
  /** @type {Array<string>} */
  const path = [text(input.fromId)];
  /** @type {Array<string>} */
  const grades = [];
  /** @type {WanderLeg|null} */
  let leg = null;
  let at = text(input.fromId);
  let verdict = 'at_rest';

  if (at === dest) {
    return {
      ticks: 0, hops: 0, path: Object.freeze(path), grades: Object.freeze(grades),
      arrived: true, verdict: 'at_rest',
    };
  }
  for (let offset = 0; offset <= cap; offset += 1) {
    const step = advanceLivedTraveller({
      worldState: input.worldState,
      atSettlementId: at,
      leg,
      destId: dest,
      kind: text(input.kind),
      tick: start + offset,
      season: input.season || null,
    });
    verdict = step.verdict;
    leg = step.leg;
    if (step.hop) grades.push(step.hop.grade);
    if (step.arrived) {
      at = step.atSettlementId;
      path.push(at);
      if (at === dest) {
        return {
          ticks: offset,
          hops: grades.length,
          path: Object.freeze(path),
          grades: Object.freeze(grades),
          arrived: true,
          verdict: 'arrived',
        };
      }
      continue;
    }
    if (!leg && step.verdict !== 'departed') break;
    if (step.verdict === 'departed') at = '';
  }
  return {
    ticks: cap,
    hops: grades.length,
    path: Object.freeze(path),
    grades: Object.freeze(grades),
    arrived: false,
    verdict,
  };
}

/**
 * MAY THIS KIND WALK THIS WAY? The one-line question a surface or a sibling lane
 * asks without needing the hop machinery, re-exported from the shared reads so the
 * access law has exactly one implementation in the estate.
 *
 * @param {string} kind
 * @param {{ hidden?: boolean }|null|undefined} hop
 * @returns {boolean}
 */
export function travellerMayWalk(kind, hop) {
  if (!hop || typeof hop !== 'object') return false;
  return hop.hidden !== true || mayUseHiddenPaths(kind);
}
