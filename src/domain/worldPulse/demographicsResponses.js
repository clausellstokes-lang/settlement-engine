/**
 * demographicsResponses.js — WAVE P3, THE COMPETING RESPONSES.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §5 (overflow — satellites before ascension),
 * §5c's opening clause (the draw fires on a band CROSSING) and §11 P3's own words —
 * "overflow responses as WEIGHTED COMPETING options ... the owner's 'where reasonable
 * and appropriate', never a fixed order" — are this file's contract.
 *
 * Pure, total, zero-PRNG, zero-write. It scores and it selects; it changes nothing.
 *
 * ── WHY A COMPETITION AND NOT A LADDER ──────────────────────────────────────
 * The cheap build is an if-chain: try to send people, else found a steading, else
 * promote. That produces one realm, played once, forever — every crowded town in
 * every campaign answers its pressure the same way in the same order, and the
 * owner's three sentences all become false at once. The design names them, and each
 * one is a DIFFERENT response to the SAME reading:
 *   • a wealthy centralized trade town becomes a city   (promotion)
 *   • a farm town with open land spins off steadings    (satellite)
 *   • a walled metropolis with no ground imports, and intensifies
 *                                                       (imports + infrastructure)
 * So the responses are WEIGHTED BY CONDITIONS and drawn between. The three sentences
 * are not special cases in the code; they are what the weights below make likely, and
 * each one is a pinned fixture rather than a comment.
 *
 * ── ASK P2 FIRST, AND LET THE ANSWER CARRY A WEIGHT ─────────────────────────
 * `send` — moving people to capacity that already exists — is not a precondition
 * bolted in front of the competition; it is a competitor whose weight comes from
 * what P2's `competeForDestinations` ALREADY answered this tick. When the homeostat
 * placed everyone, `send` carries almost the whole weight and wins, and no founding
 * can be justified because there is nothing left over to justify it. When the realm
 * had nowhere to put anybody, `send` carries nothing. That is design §11 P2's
 * "existing settlements compete with and usually beat new foundings" expressed as
 * arithmetic rather than as an ordering rule, and it is the acceptance contract's
 * claim 6.
 *
 * ── THE DRAW CANNOT BE STOLEN (§5c, the wave-E stream-theft law) ────────────
 * "Draws are keyed by (realm, settlement, episode, response) so an unrelated
 * candidate's appearance cannot steal a draw from another settlement's history."
 * Taken literally: there is NO stream here at all. Each response gets its OWN keyed
 * hash and the largest `weight x draw` wins, so the selection is INDEPENDENT OF THE
 * ORDER the responses are considered in, and a new response appearing in the menu
 * cannot move any other response's draw — no response's draw was ever a position in a
 * sequence, in this settlement or in any other. See `selectResponse` for why the race
 * is a product rather than the textbook power (a cross-engine determinism ruling).
 *
 * FINITE SEMANTICS: every dial is a closed authored table keyed by the response
 * vocabulary or a named band. Design §10 tuning-pass property, owner-signed at the
 * soak redo.
 *
 * @enforced-by tests/domain/demographicsPlans.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { POPULATION_RANGES, TIER_ORDER } from '../../data/constants.js';
import { hash01 } from '../region/contestMath.js';
// WAVE P4 (design §7b): the viability ladder gates the founding mover. Pure read.
import { gradeFromReading, moverPermitted } from './demographicsLadder.js';

/** @typedef {import('./demographicsPushPull.js').DemographicReadings} DemographicReadings */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {number} v @returns {number} 4dp, so a receipt compares by value across machines */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** A ramp from `ease` (0) to `full` (1), in whichever direction the pair runs.
 *  @param {number} reading @param {number} ease @param {number} full @returns {number} */
function ramp(reading, ease, full) {
  const span = full - ease;
  if (!Number.isFinite(span) || span === 0) return reading === ease ? 0 : 1;
  return clamp01((num(reading, ease) - ease) / span);
}

/**
 * THE OVERFLOW BAND VOCABULARY over pressure01 (population / min(K_food, D_tier)),
 * ordered emptiest first. P1 MEASURED the natural equilibrium at 76 to 83 percent of
 * the bound, so `filling` opens just under that band and `pressed` — the first rung
 * that demands an answer — opens just above it: a settlement sitting at its own
 * fixed point is not in trouble and must not spend a plan on it.
 * @type {ReadonlyArray<string>}
 */
export const OVERFLOW_BANDS = Object.freeze(['easy', 'filling', 'pressed', 'overflowing']);

/** The rung at and above which a pressure episode demands a response. */
export const OVERFLOW_DEMAND_BAND = 'pressed';

export const OVERFLOW_THRESHOLDS = Object.freeze({ filling: 0.70, pressed: 0.88, overflowing: 1.05 });

/** The band a pressure reading falls in. Total; nothing below `easy`.
 *  @param {number} pressure01 @returns {string} */
export function overflowBandOf(pressure01) {
  const p = num(pressure01, 0);
  if (p >= OVERFLOW_THRESHOLDS.overflowing) return 'overflowing';
  if (p >= OVERFLOW_THRESHOLDS.pressed) return 'pressed';
  if (p >= OVERFLOW_THRESHOLDS.filling) return 'filling';
  return 'easy';
}

/** The band's rung, for comparing two readings. @param {string} band @returns {number} */
export function overflowRankOf(band) {
  const i = OVERFLOW_BANDS.indexOf(String(band));
  return i >= 0 ? i : 0;
}

/** Does this reading demand an answer? @param {string} band @returns {boolean} */
export function bandDemandsResponse(band) {
  return overflowRankOf(band) >= overflowRankOf(OVERFLOW_DEMAND_BAND);
}

/**
 * THE CLOSED RESPONSE VOCABULARY, codepoint-ordered. Six, and the six the owner
 * named. Nothing outside this list may reach a record, a receipt or a news line.
 * @type {ReadonlyArray<string>}
 */
export const RESPONSES = Object.freeze([
  'emigration', 'imports', 'infrastructure', 'promotion', 'satellite', 'send',
]);

/**
 * THE CLOSED UNAVAILABILITY VOCABULARY — why a response was not even on the menu.
 * An unavailable response is a REFUSAL with a name, never a silent zero, because
 * "the metropolis could not promote" and "the metropolis chose not to promote" are
 * different worlds and P4's Herald must be able to say which.
 * @type {ReadonlyArray<string>}
 */
export const RESPONSE_REFUSALS = Object.freeze([
  'absorbed', 'available', 'lane_dark', 'no_ground', 'no_headroom', 'no_next_tier',
  // WAVE P4 (design §7b, THE VIABILITY LADDER): a settlement whose own ground and
  // granaries no longer support the grade it wears may not go and start another one.
  // The ladder gates the mover; the refusal has a name so the Herald can say it.
  'nonviable',
  'nowhere_to_go', 'parent_tier', 'unfed',
]);

/**
 * THE AUTHORED CONDITION WEIGHTS. Each response's weight is the sum of its named
 * contributions, every contribution a 0..1 reading times its authored weight, so a
 * response saturating everything reaches roughly 1 and the six are commensurable.
 * The names are the receipt's reasons — a person reads WHY the town chose what it
 * chose, never a number (the legibility law).
 * @type {Readonly<Record<string, Readonly<Record<string, number>>>>}
 */
export const RESPONSE_WEIGHTS = Object.freeze({
  emigration: Object.freeze({ pressure: 0.30, poverty: 0.22, thin_reserves: 0.18, somewhere_to_go: 0.30 }),
  imports: Object.freeze({ granary_is_the_wall: 0.34, deficit: 0.26, connectivity: 0.22, saturated: 0.18 }),
  infrastructure: Object.freeze({ walls_are_the_wall: 0.32, grade: 0.20, prosperity: 0.22, saturated: 0.26 }),
  promotion: Object.freeze({ prosperity: 0.26, connectivity: 0.20, at_threshold: 0.32, saturated: 0.22 }),
  satellite: Object.freeze({ open_land: 0.34, food_surplus: 0.24, unplaced: 0.24, room_to_sprawl: 0.18 }),
  send: Object.freeze({ placed: 0.70, reachable: 0.30 }),
});

export const RESPONSE_TUNING = Object.freeze({
  /** How many legal sites count as "open land" saturating the satellite lean. Wave
   *  E's own candidate cap is 16, so a parent with a quarter of that still has real
   *  frontier and a parent with one site is scraping. */
  OPEN_LAND_FULL: 4,
  /** The food-flow ratio at which a settlement's own fields read as genuine surplus
   *  ("a farm town with open land"): the granary makes half again what it eats. */
  SURPLUS_EASE: 1.00,
  SURPLUS_FULL: 1.50,
  /** How close to the next tier's authored minimum a settlement must be for the
   *  promotion lean to saturate. Below the ease point ascension is a daydream. */
  THRESHOLD_EASE: 0.70,
  /** Unplaced people, as a share of the settlement's own head count, at which the
   *  founding lean saturates. A hundredth of a town is a real overflow at town
   *  scale and the lane is deliberately not hair-triggered below it. */
  UNPLACED_FULL: 0.01,
  /** The prosperity and connectivity readings a settlement with no causal scores
   *  takes: NEUTRAL, never destitute and never rich (the pushPull idiom). */
  NEUTRAL_SCORE: 0.5,
});

const T = RESPONSE_TUNING;

/** The tier above this one, or null at the top of the ladder. @param {string} tier */
export function nextTierOf(tier) {
  const i = TIER_ORDER.indexOf(String(tier || ''));
  return i >= 0 ? (TIER_ORDER[i + 1] || null) : null;
}

/** A tier's authored population minimum. @param {string|null} tier @returns {number} */
function tierFloorOf(tier) {
  return num(asObject(/** @type {Record<string, unknown>} */ (POPULATION_RANGES)[String(tier || '')]).min, 0);
}

/**
 * EARNED ASCENSION'S FOOD TEST (J-P4: "your food base must afford the city you're
 * becoming"). K_food — the FLOW, never the reserves — must already cover the next
 * tier's whole authored minimum. An unfed settlement (no food physics on the record)
 * cannot be tested, and an absent measurement is never evidence, so it reads as
 * headroom present exactly as P1a's viability read refuses to call absence a failure.
 * @param {DemographicReadings} readings @param {string} tier @returns {boolean}
 */
export function nextTierHeadroom(readings, tier) {
  const next = nextTierOf(tier);
  if (!next) return false;
  if (readings.foodKnown !== true) return true;
  return num(readings.foodCapacity, 0) >= tierFloorOf(next);
}

/**
 * @typedef {Object} ResponseScore
 * @property {string} response      one of RESPONSES
 * @property {number} weight        0 when unavailable or unmotivated
 * @property {boolean} available
 * @property {string} refusal       one of RESPONSE_REFUSALS
 * @property {ReadonlyArray<{ reason: string, reading: number, weight: number }>} contributions
 */

/**
 * @typedef {Object} ResponseInput
 * @property {DemographicReadings} readings
 * @property {number} pressure01
 * @property {string} tier
 * @property {number} prosperity01
 * @property {number} connectivity01
 * @property {{ placed: number, unplaced: number, considered: number }} homeostat  P2's OWN answer this tick
 * @property {{ applicable: boolean, saturated: boolean, sites: number }} ground   the §5b law's answer
 * @property {boolean} satelliteLaneLit
 * @property {number} satelliteCap    wave E's cap for this parent's tier (0 = may not seed)
 */

/**
 * SCORE EVERY RESPONSE (§5). Availability first — a refusal with a name — then the
 * weight, as a sum of named contributions.
 * @param {ResponseInput} input @returns {ReadonlyArray<ResponseScore>}
 */
export function scoreResponses(input) {
  const r = input.readings;
  const pop = Math.max(1, num(r.population, 1));
  const saturated01 = input.ground.applicable && input.ground.saturated ? 1 : 0;
  const moved = Math.max(0, num(input.homeostat.placed, 0));
  const stuck = Math.max(0, num(input.homeostat.unplaced, 0));
  const wanted = moved + stuck;
  // WAVE P4: the §7b grade, from readings already in hand. `deficit01` is deliberately
  // not threaded: the founding gate turns on the nonviable branch (the bound has fallen
  // through the tier's own floor), and a hungry-but-viable town keeps its frontier.
  const foundingPermitted = moverPermitted(gradeFromReading({
    population: num(r.population, 0),
    bound: num(r.bound, 0),
    tierFloor: tierFloorOf(input.tier),
    foodKnown: r.foodKnown === true,
    deficit01: 0,
    remnant: false,
  }).grade, 'founding');

  /** @type {Array<{ response: string, available: boolean, refusal: string,
   *   terms: Record<string, number> }>} */
  const raw = [
    {
      response: 'emigration',
      available: true,
      refusal: 'available',
      terms: {
        pressure: ramp(num(input.pressure01, 0), OVERFLOW_THRESHOLDS.pressed, OVERFLOW_THRESHOLDS.overflowing),
        poverty: 1 - clamp01(num(input.prosperity01, T.NEUTRAL_SCORE)),
        thin_reserves: 1 - clamp01(num(r.reserveCoverage, 0)),
        // Encouraging people to leave for NOWHERE is not a policy. The realm must
        // have been able to see somewhere, which is P2's own `considered` count.
        somewhere_to_go: num(input.homeostat.considered, 0) > 0 ? 1 : 0,
      },
    },
    {
      response: 'imports',
      // An unfed record cannot be diagnosed as hungry, so it cannot buy its way out.
      available: r.foodKnown === true,
      refusal: r.foodKnown === true ? 'available' : 'unfed',
      terms: {
        granary_is_the_wall: r.binding === 'granary' ? 1 : 0,
        deficit: 1 - clamp01(num(r.foodFlowRatio, 1)),
        connectivity: clamp01(num(input.connectivity01, T.NEUTRAL_SCORE)),
        saturated: saturated01,
      },
    },
    {
      response: 'infrastructure',
      available: true,
      refusal: 'available',
      terms: {
        walls_are_the_wall: r.binding === 'walls' ? 1 : 0,
        // A bigger place has more to build with and more worth building.
        grade: clamp01(Math.max(0, TIER_ORDER.indexOf(String(input.tier))) / Math.max(1, TIER_ORDER.length - 1)),
        prosperity: clamp01(num(input.prosperity01, T.NEUTRAL_SCORE)),
        saturated: saturated01,
      },
    },
    {
      response: 'promotion',
      available: !!nextTierOf(input.tier) && nextTierHeadroom(r, input.tier),
      refusal: !nextTierOf(input.tier) ? 'no_next_tier'
        : nextTierHeadroom(r, input.tier) ? 'available' : 'no_headroom',
      terms: {
        prosperity: clamp01(num(input.prosperity01, T.NEUTRAL_SCORE)),
        connectivity: clamp01(num(input.connectivity01, T.NEUTRAL_SCORE)),
        at_threshold: ramp(pop / Math.max(1, tierFloorOf(nextTierOf(input.tier))), T.THRESHOLD_EASE, 1),
        saturated: saturated01,
      },
    },
    {
      response: 'satellite',
      // THE ABSORPTION REFUSAL, and it is the acceptance contract's claim 6 made
      // STRUCTURAL rather than merely likely. Design §11 P2: the homeostat's leftover
      // "is the ONLY thing that could ever justify a founding". So when the realm was
      // asked this tick, answered, and took EVERYONE — considered destinations, placed
      // people, and left nobody over — the founding lane is not on the menu at all. A
      // weighted lean would have made "existing settlements usually beat new
      // foundings" a matter of luck; this makes it a matter of law. A settlement that
      // raised no column at all (nobody wanted to leave) is NOT absorbed and keeps the
      // frontier as an honest answer to its own crowding.
      // WAVE P4, THE LADDER GATE (design §7b): a settlement graded below `viable` may
      // not found. A place that can no longer support the town it already is has no
      // business planting another one, and the refusal is NAMED rather than weighted
      // away, exactly as the absorption refusal above is. The grade is read through the
      // ONE grade predicate (demographicsLadder.gradeFromReading) from readings this
      // function already holds, so no second food read and no second definition.
      available: input.satelliteLaneLit
        && input.satelliteCap > 0
        && foundingPermitted
        && !(input.ground.applicable && input.ground.saturated)
        && !(num(input.homeostat.considered, 0) > 0 && moved > 0 && stuck === 0),
      refusal: !input.satelliteLaneLit ? 'lane_dark'
        : input.satelliteCap <= 0 ? 'parent_tier'
          : !foundingPermitted ? 'nonviable'
            : (input.ground.applicable && input.ground.saturated) ? 'no_ground'
              : (num(input.homeostat.considered, 0) > 0 && moved > 0 && stuck === 0) ? 'absorbed'
                : 'available',
      terms: {
        // An aspatial world has no map to read, so open land is UNKNOWN rather than
        // absent, and the lean takes the neutral reading instead of a false zero.
        open_land: input.ground.applicable
          ? clamp01(num(input.ground.sites, 0) / T.OPEN_LAND_FULL)
          : T.NEUTRAL_SCORE,
        food_surplus: r.foodKnown ? ramp(num(r.foodFlowRatio, 1), T.SURPLUS_EASE, T.SURPLUS_FULL) : 0,
        unplaced: clamp01((stuck / pop) / T.UNPLACED_FULL),
        room_to_sprawl: r.binding === 'walls' ? 1 : 0,
      },
    },
    {
      response: 'send',
      // P2 already ran. `send` is available whenever the realm saw anywhere at all.
      available: num(input.homeostat.considered, 0) > 0,
      refusal: num(input.homeostat.considered, 0) > 0 ? 'available' : 'nowhere_to_go',
      terms: {
        placed: wanted > 0 ? clamp01(moved / wanted) : 0,
        reachable: clamp01(num(input.homeostat.considered, 0) > 0 ? 1 : 0),
      },
    },
  ];

  /** @type {Array<ResponseScore>} */
  const scored = [];
  for (const entry of raw.slice().sort((a, b) => (a.response < b.response ? -1 : a.response > b.response ? 1 : 0))) {
    const weights = /** @type {Record<string, number>} */ (
      asObject(RESPONSE_WEIGHTS[/** @type {keyof typeof RESPONSE_WEIGHTS} */ (entry.response)]));
    /** @type {Array<{ reason: string, reading: number, weight: number }>} */
    const contributions = [];
    let weight = 0;
    for (const reason of Object.keys(weights).sort()) {
      const reading = entry.available ? clamp01(num(entry.terms[reason], 0)) : 0;
      const w = num(weights[reason], 0);
      weight += w * reading;
      contributions.push({ reason, reading: round4(reading), weight: w });
    }
    scored.push({
      response: entry.response,
      weight: entry.available ? round4(weight) : 0,
      available: entry.available,
      refusal: entry.refusal,
      contributions: Object.freeze(contributions),
    });
  }
  return Object.freeze(scored);
}

/**
 * @typedef {Object} ResponseSelection
 * @property {string|null} response  the winner, or null when nothing was motivated
 * @property {number} weight
 * @property {ReadonlyArray<string>} because  the winner's contributing reasons, strongest first
 * @property {ReadonlyArray<ResponseScore>} scored
 */

/**
 * SELECT ONE RESPONSE — the exponential race over per-response keyed hashes.
 *
 * `u_r ** (1 / w_r)` with independent uniforms and the largest key winning is exactly
 * weighted sampling without replacement, and it has the property §5c actually asks
 * for: the result does not depend on the ORDER responses are visited in, and no
 * response's draw is a position in any sequence, so nothing can be stolen. Ties (two
 * identical keys, which needs two identical hashes) break codepoint-wise so the
 * function stays total and device-stable.
 *
 * @param {Object} input
 * @param {ReadonlyArray<ResponseScore>} input.scored
 * @param {string} input.realmId
 * @param {string} input.settlementId
 * @param {string} input.episode     the episode identity (tick + band; §5c)
 * @returns {ResponseSelection}
 */
export function selectResponse(input) {
  // Annotated rather than inferred: `Array.isArray` widens a ReadonlyArray<T> to any[],
  // which would hand every callback below an implicit any and cost the domain-strict
  // ceiling four errors.
  const scored = /** @type {ReadonlyArray<ResponseScore>} */ (
    Array.isArray(input.scored) ? input.scored : []);
  /** @type {{ response: string, weight: number, key: number }|null} */
  let best = null;
  for (const entry of scored) {
    if (!entry.available || !(entry.weight > 0)) continue;
    const u = hash01(
      `demographics.plan.${input.realmId}.${input.settlementId}.${input.episode}.${entry.response}`,
    );
    // THE RACE IS A PRODUCT, NOT A POWER, AND THAT IS A DETERMINISM RULING RATHER THAN
    // a simplification. The textbook weighted-sampling race is `u ** (1 / w)`, which is
    // exactly proportional to the weights — and `Math.pow` is implementation-
    // approximated per the ECMAScript spec, so its last bit may differ between engines.
    // The last bit here CHOOSES WHAT A CITY DOES for the rest of a campaign, and THE
    // PROMISE says a seed is a world on every device, forever. Multiplication is
    // required to be correctly rounded, so the race is `w * u`: still per-response
    // keyed, still order-independent, still monotone in the weight (a heavier response
    // wins more often), and merely SHARPER than proportional rather than exactly
    // proportional. The owner's standard is "it increases the chances", which this
    // meets; exact proportionality was never the requirement and cross-engine replay is.
    const key = entry.weight * u;
    if (!best || key > best.key
      || (key === best.key && entry.response < best.response)) {
      best = { response: entry.response, weight: entry.weight, key };
    }
  }
  if (!best) {
    return { response: null, weight: 0, because: Object.freeze([]), scored: Object.freeze(scored) };
  }
  const winner = scored.find((s) => s.response === best.response);
  const because = winner
    ? winner.contributions
      .filter((c) => c.reading > 0)
      .slice()
      .sort((a, b) => ((b.reading * b.weight) - (a.reading * a.weight)) || (a.reason < b.reason ? -1 : 1))
      .map((c) => c.reason)
    : [];
  return {
    response: best.response,
    weight: best.weight,
    because: Object.freeze(because),
    scored: Object.freeze(scored),
  };
}

/**
 * THE RESPONSE'S OWN SENTENCE (the legibility law: translate, never show the
 * formula). Total over the closed vocabulary.
 * @param {string} response @param {string} name @returns {string}
 */
export function responseLine(response, name) {
  switch (String(response)) {
    case 'emigration': return `${name} stops holding its people and lets them take the road.`;
    case 'imports': return `${name} looks to the roads for grain it cannot grow.`;
    case 'infrastructure': return `${name} builds: wells, wharves, and room inside the walls.`;
    case 'promotion': return `${name} sets about becoming a greater place than it was.`;
    case 'satellite': return `${name} sends families out to break new ground.`;
    case 'send': return `${name} sends its overflow to places that already have room.`;
    default: return `${name} does nothing in particular.`;
  }
}
