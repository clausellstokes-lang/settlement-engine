/**
 * routeNetworkCharterDanger.js — SAFETY VS GREED (W-J slice J3; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §5b).
 *
 * §5 gave the charter a COST term and named the seam this file extends
 * (`corridorCost01`). §5b prices the other half of what a road costs: not the
 * weeks it takes, but what the weeks are worth risking. Four rules, and each one
 * is a function here rather than a paragraph.
 *
 * ── DANGER IS THE M1 VOCABULARY, NOT A SECOND ONE ───────────────────────────
 * The army planner already speaks danger: `embattlement.js` carries the
 * continuous 0..1 region scalar (war fronts, occupation, war exhaustion, crime,
 * minus the security counterforce), and `chooseRoute` already re-scores the k
 * frozen candidate routes against it. This module DOES NOT re-derive any of that.
 * It calls the same scorer the movers call, which is the only way the charter
 * evaluation and the caravan that would ride the road can agree about what the
 * road is worth. A second danger model would drift within one wave.
 *
 * ── ROUTING READS THE BELIEVED PICTURE ──────────────────────────────────────
 * The roads engine's law (§5b, and DESIGN_THE_ROADS.md §5): route by the KNOWN
 * picture, roll outcomes against TRUTH. `knownEmbattlementView` already returns a
 * minimal synthetic worldState whose embattlement ledger holds the observer's
 * BELIEFS, precisely so the existing scorer can read it unchanged. So a corridor
 * merely FEARED dangerous suppresses its own charter, and a corridor genuinely
 * dangerous that nobody has heard about charters anyway and pays for it later.
 * That asymmetry is the epistemics layer pricing safety, and it costs this file
 * one function call.
 *
 * WHOSE BELIEF? Both endpoints', and the FRIGHTENED one governs. A road needs two
 * willing ends; if either end believes the way is a war zone, no caravan leaves
 * from that side, and the corridor is not walked. Taking the maximum is also the
 * only reading that is symmetric in (a, b), which the edge identity law requires:
 * a corridor must score the same whichever endpoint the derivation reached first.
 *
 * ── EMBATTLED DEFERS, IT NEVER REMOVES (Law 4) ──────────────────────────────
 * A war zone DEFERS a charter (the slow lifecycle waits out the fast layer) and
 * steps up the effective cost of the edges already there. It never takes a road
 * away. `trade_route_disruption` is the fast layer and it already exists; organic
 * removal is the slow verdict and it belongs to J3's decay ladder, whose floor is
 * hidden rather than absence.
 *
 * ── THE GREED OVERRIDE, AND THE PRICE OF IT ─────────────────────────────────
 * A corridor whose material profit clears the RISK PREMIUM band charters through
 * the danger anyway. That is not a loophole: the resulting edge carries a LOSS
 * RATE, and the loss rate discounts the usage the decay ladder reads. Greed that
 * keeps losing caravans therefore starves its own road honestly, without any new
 * mover, any new ledger key, or any second opinion about what moved.
 *
 * SMUGGLER EXTREME (§5b's last clause) is two dials, because the sentence has two
 * halves. A hidden path TOLERATES danger: its traffic under-weights the danger
 * term in the route re-score, which is exactly what `riskTolerance` means to the
 * existing scorer, so the overgrown road stays walkable when the highway does not.
 * And it pays the STEEPEST PREMIUM: the same grade carries the largest loss
 * multiplier, so the dangerous goods take the dangerous road and lose the most of
 * it in transit.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store. Every read is a
 * pure function of the world it is handed.
 */

import { clamp01 } from '../../kernel/math.js';
import { activeSpatialDigest } from '../spatial/distanceRead.js';
import { chooseRoute, embattlementLevel, routeDangerLevel } from '../spatial/embattlement.js';
import { knownEmbattlementView } from '../roads/knownWorld.js';

/**
 * ROUTE_LIFECYCLE_TUNING, the danger half (§12: every entry a band, soak-vetoable).
 *
 * DANGER_WEIGHT is how loudly a fully dangerous road speaks against a cost term
 * that already lives on 0..1. At 0.45 a maximally embattled corridor read by a
 * danger-trusting mover nearly doubles the cost of a middling road, which is the
 * intended feel: danger is expensive, and it is not a wall.
 *
 * EMBATTLED_DEFER_LEVEL is deliberately the same rung the M1 hysteresis latch
 * enters at (EMBATTLEMENT_TUNING.ENTER_THRESHOLD, 0.55). A region the war layer
 * calls embattled is the region the charter waits out; picking a different number
 * here would create a second, silently disagreeing definition of a war zone.
 *
 * RISK_PREMIUM_BASE plus RISK_PREMIUM_PER_DANGER is THE GREED OVERRIDE's bar, and
 * it RISES with danger: a slightly risky road needs a good profit, a war road
 * needs an extraordinary one. A flat bar would let a marginal trade buy a road
 * through a siege.
 *
 * GRADE_RISK_TOLERANCE is the danger-READING fidelity per grade, in the sense
 * embattlement.js already uses: 1 reads danger true, 0 ignores it. GRADE_LOSS_
 * PREMIUM is the multiplier on what that grade's traffic LOSES. Hidden is the
 * extreme of both, in opposite directions, which is what a smuggler is.
 *
 * @type {Readonly<Record<string, unknown>>}
 */
export const ROUTE_DANGER_TUNING = Object.freeze({
  DANGER_WEIGHT: 0.45,
  EMBATTLED_DEFER_LEVEL: 0.55,
  RISK_PREMIUM_BASE: 0.35,
  RISK_PREMIUM_PER_DANGER: 0.45,
  LOSS_RATE_PER_DANGER: 0.5,
  LOSS_RATE_MAX: 0.45,
  GRADE_RISK_TOLERANCE: Object.freeze({
    highway: 1,
    road: 0.85,
    track: 0.6,
    hidden: 0.25,
  }),
  GRADE_LOSS_PREMIUM: Object.freeze({
    highway: 0.6,
    road: 0.8,
    track: 1,
    hidden: 1.6,
  }),
  /**
   * The grade a corridor with NO edge yet is scored as. A corridor is a want, not
   * a road, and the caravan that would prove it is the unproven-track kind rather
   * than a highway convoy or a smuggler.
   */
  CORRIDOR_GRADE: 'track',
});

/** @param {number} value @returns {number} */
function round4(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10000) / 10000 : 0;
}

/**
 * The danger-READING fidelity for a grade, in the sense embattlement.js means it:
 * the multiplier on the danger surcharge a mover of this class pays attention to.
 * An unknown grade reads as the track rung, which is the middle, because a grade
 * this module has never heard of must not silently become the smuggler.
 *
 * @param {string|null|undefined} grade
 * @returns {number} 0..1
 */
export function routeRiskTolerance(grade) {
  const table = /** @type {Record<string, number>} */ (ROUTE_DANGER_TUNING.GRADE_RISK_TOLERANCE);
  const found = table[String(grade)];
  return clamp01(Number.isFinite(found) ? found : table.track);
}

/**
 * The loss multiplier for a grade. Same fail-safe reading as the tolerance: an
 * unknown grade pays the track premium, never the smuggler's.
 *
 * @param {string|null|undefined} grade
 * @returns {number}
 */
export function routeLossPremium(grade) {
  const table = /** @type {Record<string, number>} */ (ROUTE_DANGER_TUNING.GRADE_LOSS_PREMIUM);
  const found = table[String(grade)];
  return Number.isFinite(found) && found >= 0 ? found : table.track;
}

/**
 * The observer's BELIEVED world, for the existing route scorer to read unchanged.
 * A null observer returns the world itself, which is the omniscient reading and
 * the one every non-belief caller wants; `knownEmbattlementView` already collapses
 * to the same thing when beliefs are dormant, so this wrapper adds a default and
 * nothing else.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string|null|undefined} observerId
 * @returns {Record<string, unknown>}
 */
export function believedDangerView(worldState, observerId) {
  const id = observerId == null ? '' : String(observerId);
  if (!id) return worldState;
  return knownEmbattlementView(worldState, id);
}

/**
 * What ONE observer believes about the danger at ONE settlement, on 0..1.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string|null|undefined} observerId
 * @param {string} settlementId
 * @returns {number}
 */
export function believedDangerAt(worldState, observerId, settlementId) {
  return clamp01(embattlementLevel(believedDangerView(worldState, observerId), String(settlementId)));
}

/**
 * @typedef {Object} CorridorDangerReading
 * @property {number} danger01          the danger a caravan on the believed-best route faces
 * @property {number} endpointDanger01  the worse of the two endpoints' believed danger
 * @property {number} tolerance         the grade's danger-reading fidelity
 * @property {string} fearedBy          the endpoint whose belief governed, or ''
 * @property {ReadonlyArray<string>} path  the believed-best route, empty when aspatial
 */

/**
 * READ THE DANGER ON A CORRIDOR, through both endpoints' eyes, and keep the
 * frightened one (see the header).
 *
 * TWO NUMBERS, NOT ONE, and the split is load-bearing. `danger01` is what a
 * caravan on the route the mover would actually choose has to walk through, so it
 * is what the COST term prices; the chosen route has already dodged what it could
 * dodge, and pricing the corridor's worst node instead would charge the road for
 * a danger nobody would ride into. `endpointDanger01` is whether the PLACES
 * themselves are war zones, and that is the deferral question: an endpoint under
 * siege has no one at home to charter anything, however safe the road to it is.
 * Collapsing the two would make either the cost or the deferral wrong, and the
 * wrong one would look right.
 *
 * ASPATIAL REALMS have no geometry to route over, so both readings fall back to
 * the endpoints' believed levels. That is honest rather than a stub: with no
 * geometry there is no third place to be in danger.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   a: string, b: string,
 *   grade?: string|null,
 *   season?: string|null,
 * }} input
 * @returns {CorridorDangerReading}
 */
export function corridorDanger01(input) {
  const worldState = input.worldState || {};
  const a = String(input.a);
  const b = String(input.b);
  const tolerance = routeRiskTolerance(
    input.grade || /** @type {string} */ (ROUTE_DANGER_TUNING.CORRIDOR_GRADE),
  );
  const season = input.season || null;
  const digest = activeSpatialDigest(worldState);

  let danger01 = 0;
  let endpointDanger01 = 0;
  let fearedBy = '';
  /** @type {ReadonlyArray<string>} */
  let path = Object.freeze([]);

  // Codepoint-ordered observer scan with a strict improvement test, so the
  // frightened endpoint wins and a tie breaks on the codepoint-low observer.
  for (const observerId of [a, b].sort()) {
    const view = believedDangerView(worldState, observerId);
    const ends = Math.max(
      clamp01(embattlementLevel(view, a)),
      clamp01(embattlementLevel(view, b)),
    );
    let route01 = ends;
    /** @type {ReadonlyArray<string>} */
    let routePath = Object.freeze([]);
    if (digest) {
      const chosen = chooseRoute(digest, view, a, b, tolerance, season);
      if (chosen) {
        route01 = clamp01(routeDangerLevel(chosen));
        routePath = Object.freeze([...chosen.path].map(String));
      }
    }
    if (route01 > danger01 || (route01 === danger01 && !fearedBy)) {
      danger01 = route01;
      fearedBy = observerId;
      path = routePath;
    }
    if (ends > endpointDanger01) endpointDanger01 = ends;
  }

  return {
    danger01: round4(danger01),
    endpointDanger01: round4(endpointDanger01),
    tolerance: round4(tolerance),
    fearedBy,
    path,
  };
}

/**
 * THE DANGER-ADJUSTED COST (§5b's first sentence). The §5 cost term, plus what
 * the danger on it is worth to a mover of this grade's fidelity. Bounded to 0..1
 * like the term it extends, so nothing downstream has to learn a new scale.
 *
 * A zero-danger reading returns the input cost EXACTLY, which is what makes this
 * safe to put in front of every existing caller: a peaceful realm prices its
 * roads today the way it did before §5b existed.
 *
 * @param {number} cost01 the §5 cost term
 * @param {CorridorDangerReading} reading
 * @returns {number} 0..1
 */
export function dangerAdjustedCost01(cost01, reading) {
  const base = clamp01(Number(cost01));
  const danger = reading ? clamp01(Number(reading.danger01)) : 0;
  if (danger <= 0) return round4(base);
  const tolerance = reading ? clamp01(Number(reading.tolerance)) : 1;
  const weight = Number(ROUTE_DANGER_TUNING.DANGER_WEIGHT);
  return round4(clamp01(base + weight * tolerance * danger));
}

/**
 * Does an active war zone DEFER this charter (§5b)? Reads the endpoints, not the
 * route, for the reason stated on `corridorDanger01`.
 *
 * @param {CorridorDangerReading|null|undefined} reading
 * @returns {boolean}
 */
export function defersForEmbattlement(reading) {
  if (!reading) return false;
  return clamp01(Number(reading.endpointDanger01))
    >= Number(ROUTE_DANGER_TUNING.EMBATTLED_DEFER_LEVEL);
}

/**
 * THE RISK PREMIUM BAR: the material score a corridor must clear to buy its way
 * through danger. Rises with the danger, so the override is a steep purchase and
 * never a flat exemption.
 *
 * @param {number} danger01
 * @returns {number}
 */
export function riskPremiumBar(danger01) {
  const danger = clamp01(Number(danger01));
  return round4(Number(ROUTE_DANGER_TUNING.RISK_PREMIUM_BASE)
    + Number(ROUTE_DANGER_TUNING.RISK_PREMIUM_PER_DANGER) * danger);
}

/**
 * THE GREED OVERRIDE (§5b): does this corridor's profit carry a road through the
 * danger? A corridor with no danger at all is NOT an override case and answers
 * false, because there is nothing to override; the ordinary objective bar governs
 * it. That distinction matters to the receipt: a charter marked as a risk-premium
 * charter is a story about traders' greed, and marking every safe charter that
 * way would make the word meaningless.
 *
 * @param {number} score the §5 material objective score
 * @param {CorridorDangerReading|null|undefined} reading
 * @returns {boolean}
 */
export function clearsRiskPremium(score, reading) {
  if (!reading) return false;
  const danger = clamp01(Number(reading.danger01));
  if (danger <= 0) return false;
  return Number(score) >= riskPremiumBar(danger);
}

/**
 * THE LOSS RATE a dangerous route's flows carry (§5b's feedback). Bounded, so a
 * road through a war never loses everything: a caravan through a war zone is
 * nicked, not annihilated, which is the same non-catastrophic reading M1's
 * banditry already takes.
 *
 * @param {number} danger01
 * @param {string|null|undefined} grade
 * @returns {number} 0..1
 */
export function dangerLossRate01(danger01, grade) {
  const danger = clamp01(Number(danger01));
  if (danger <= 0) return 0;
  const raw = danger
    * Number(ROUTE_DANGER_TUNING.LOSS_RATE_PER_DANGER)
    * routeLossPremium(grade);
  return round4(Math.min(Number(ROUTE_DANGER_TUNING.LOSS_RATE_MAX), clamp01(raw)));
}

/**
 * THE FEEDBACK, applied (§5b): the usage tally that SURVIVED the road's losses.
 *
 * This is the whole mechanism by which greed starves its own road, and it is
 * deliberately a READ rather than a write. The ledger keeps the honest count of
 * what walked the way; the decay ladder asks this function what ARRIVED. Writing
 * a discounted number into the ledger instead would corrupt the receipt J2 exists
 * to produce, and the discount would then compound every pulse into a number
 * meaning nothing.
 *
 * FLOOR-ROUNDED, so the survivors stay exact integers and the accumulator can
 * never drift (§4's integers-not-weights law).
 *
 * @param {Record<string, number>|null|undefined} tally
 * @param {number} lossRate01
 * @returns {Record<string, number>}
 */
export function survivingUsageTally(tally, lossRate01) {
  const source = tally && typeof tally === 'object' ? tally : {};
  const loss = clamp01(Number(lossRate01));
  /** @type {Record<string, number>} */
  const out = {};
  for (const key of Object.keys(source).sort()) {
    const raw = Number(source[key]);
    if (!Number.isFinite(raw) || raw <= 0) continue;
    out[key] = Math.max(0, Math.floor(raw * (1 - loss)));
  }
  return out;
}
