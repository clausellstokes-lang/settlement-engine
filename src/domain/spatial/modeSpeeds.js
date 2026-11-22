/**
 * modeSpeeds.js — THE SCALE CHARTER'S PURE LEAF (FP WY-1; J-D11(b) activated and
 * amended — docs/DESIGN_FP_ARCH_WY.md §1a, its §5 WY-1 spec and its §8 tuning rows).
 *
 * THE LAW (the owner's 2026-08-05 absolute-distance directive, as WY §1a quotes its
 * intent): realm distance is ABSOLUTE, derived from the map's declared scale. Tens of
 * miles and thousands of miles are different worlds, and the 2-8 march-week
 * normalization dies for SCALED worlds. The declared scale is a per-world DATUM,
 * `spatialDigest.kmScale` (km per map-coordinate unit), never a flag: a world without
 * it keeps the legacy normalized read byte-identically, forever, because carry-forward
 * of absence is absence.
 *
 * This leaf owns exactly what the datum needs, and nothing that reads a world:
 *   1. THE CLOSED MODE SET and THE ONE MODE-SPEED TABLE (km per week per mode). The
 *      numbers are raw-authored DRAFT tuning, owner-signed at the tuning sitting and
 *      never by a wave (THE PROMISE; the §8 rows). `foot` is the base denomination
 *      every mover inherits through `distanceRead.hopWeeks`; the other modes are read
 *      only by a caller that names one.
 *   2. THE ADMISSION of a raw scale value. It is total: a finite positive number is
 *      admitted, and anything else reads ABSENT with a typed refusal. That refusal is
 *      the import heal's receipt: an imported world whose datum is not a scale reads
 *      as the legacy world it would otherwise have been, never as a broken clock.
 *   3. THE CANONIZE RULE. The creation flow supplies the scale on the FIRST canonize;
 *      every receipted re-canonize RE-RECEIVES the prior digest's value, so the datum
 *      can never ghost the rebuild. A re-canonize never mints a scale for a legacy
 *      world: that is owner-elective future work (WY §1a.1), not built here.
 *   4. THE REACH BANDS: the closed vocabulary a distance in weeks falls into, cut at
 *      the canonical campaign intervals. It is total over every input and monotone in
 *      weeks, so it is monotone over the km scale too (weeks rise with the scale).
 *
 * DATA-GATED, NEVER FLAG-GATED. WY §1a rules the mode table decoupled from the port
 * program's flag (which stays J-D11 (a)/(c)'s), so nothing here reads a rule key.
 *
 * PURE and TOTAL. The only import is the dependency-free interval leaf, and the test
 * suite pins that list, because `distanceRead.js` imports this module and anything
 * heavy here would ride every reader of the frozen digest.
 */

import { INTERVAL_WEEKS } from '../worldPulse/intervalWeeks.js';

/** The closed mode set, in J-D11(b)'s own order. */
export const MODES = Object.freeze(/** @type {const} */ (['foot', 'cart', 'river', 'coastal', 'sea']));

/** @typedef {typeof MODES[number]} TravelMode */

/**
 * THE ONE MODE-SPEED TABLE: km per week, per mode. DRAFT: raw-authored and unsigned
 * (tests/lint/.tuning-register.json carries the row). A week is seven days of travel.
 */
export const MODE_SPEED_TUNING = Object.freeze({
  MODE_SPEEDS: Object.freeze({
    // A walker's day of about twenty-one km, every day of the week. This is the base
    // denomination: `hopWeeks` reads every mover on foot unless a caller names a mode.
    foot: 150,
    // Loaded wagons and ox-teams, which are slower than the walker who drives them.
    cart: 110,
    // Barge and keel on a navigable river.
    river: 280,
    // Coast-hugging sail that anchors by night.
    coastal: 450,
    // Open-water sail, by day and by night.
    sea: 900,
  }),
});

/** The mode table itself. The tuning table above is its one home. */
export const MODE_SPEEDS = MODE_SPEED_TUNING.MODE_SPEEDS;

/**
 * THE DEFAULT SCALE: km per map-coordinate unit, for a map that exposes no scale of its
 * own. DRAFT. The value is FMG's own default distance scale (its distance-scale slider
 * defaults to three km per map pixel). Only the creation flow reads it, through
 * `creationKmScale`; no canonize applies it by itself, so the wave stays dark until
 * the creation flow ships the datum.
 */
export const KM_SCALE_TUNING = Object.freeze({
  DEFAULT_KM_SCALE: 3,
});

/** The default scale itself. The tuning table above is its one home. */
export const DEFAULT_KM_SCALE = KM_SCALE_TUNING.DEFAULT_KM_SCALE;

/**
 * THE FROZEN COST LAW'S DISTANCE UNIT, by `costLawVersion`: how many digest cost units
 * one map-coordinate unit of the cheapest-terrain walk costs. Cost law 1 prices an edge
 * as the quantized cell cost (spatialCost COST_SCALE, a float cost times one hundred)
 * times the quantized euclidean step (DIST_SCALE, one), so one map unit costs one
 * hundred units at a terrain factor of one. This is NOT tuning: it is a property of the
 * frozen cost law, pinned equal to spatialCost's own two constants by the test suite
 * (this leaf may not import spatialCost, whose chunk it would drag behind every reader).
 * A digest built under a cost law this table does not know reads unscaled.
 * @type {Readonly<Record<number, number>>}
 */
export const COST_UNITS_PER_MAP_UNIT = Object.freeze({ 1: 100 });

/** Why a raw scale value was not admitted. Closed. */
export const KM_SCALE_REFUSALS = Object.freeze(/** @type {const} */ ([
  'not_a_number',
  'not_finite',
  'not_positive',
  'unknown_cost_law',
]));

/** @typedef {typeof KM_SCALE_REFUSALS[number]} KmScaleRefusal */

/**
 * The receipt a canonize carries when it healed a scale to ABSENT.
 * @typedef {Object} KmScaleHealReceipt
 * @property {'kmScale_healed_to_absent'} kind
 * @property {'prior_digest'|'supplied'} from   where the refused value came from
 * @property {KmScaleRefusal} refusal
 * @property {string} rawType                    `typeof` the refused value (never its text)
 */

/**
 * Admit a raw scale value. ABSENT (`undefined` or `null`) is not a refusal: absence is
 * the legacy world's identity. Anything else that is not a finite positive number is
 * refused with a typed reason and reads absent.
 * @param {unknown} raw
 * @returns {{ kmScale: number|null, refusal: KmScaleRefusal|null }}
 */
export function admitKmScale(raw) {
  if (raw === undefined || raw === null) return { kmScale: null, refusal: null };
  if (typeof raw !== 'number') return { kmScale: null, refusal: 'not_a_number' };
  if (!Number.isFinite(raw)) return { kmScale: null, refusal: 'not_finite' };
  if (!(raw > 0)) return { kmScale: null, refusal: 'not_positive' };
  return { kmScale: raw, refusal: null };
}

/**
 * Cost units per map unit under a digest's frozen cost law, or null for a law this
 * table does not know. A digest with no stamp reads as cost law 1, the builder's default.
 * @param {unknown} costLawVersion
 * @returns {number|null}
 */
export function costUnitsPerMapUnit(costLawVersion) {
  const version = costLawVersion === undefined ? 1 : costLawVersion;
  if (typeof version !== 'number' || !Number.isInteger(version)) return null;
  const units = COST_UNITS_PER_MAP_UNIT[version];
  return typeof units === 'number' && units > 0 ? units : null;
}

/**
 * THE CANONIZE RULE: the scale a canonize stamps. A receipted re-canonize (a prior
 * digest exists) RE-RECEIVES that digest's value, and a supplied value is ignored,
 * because minting a scale for a legacy world is owner-elective. The FIRST canonize
 * stamps the supplied value. Either way a refused value heals to ABSENT and the
 * receipt says so.
 * @param {{ priorDigest?: unknown, supplied?: unknown }|null|undefined} input
 * @returns {{ kmScale: number|null, receipt: KmScaleHealReceipt|null }}
 */
export function kmScaleForCanonize(input) {
  const prior = input ? input.priorDigest : undefined;
  const recanonize = prior !== null && typeof prior === 'object';
  const raw = recanonize
    ? /** @type {{ kmScale?: unknown }} */ (prior).kmScale
    : (input ? input.supplied : undefined);
  const { kmScale, refusal } = admitKmScale(raw);
  if (refusal === null) return { kmScale, receipt: null };
  return {
    kmScale: null,
    receipt: {
      kind: 'kmScale_healed_to_absent',
      from: recanonize ? 'prior_digest' : 'supplied',
      refusal,
      rawType: typeof raw,
    },
  };
}

/**
 * The creation flow's one seam: the map's own scale when the bridge exposes an
 * admissible one, else the owner-signed default. Nothing calls it until the creation
 * flow ships the datum (WY-1's Lane B slice).
 * @param {unknown} mapScale
 * @returns {number}
 */
export function creationKmScale(mapScale) {
  const { kmScale } = admitKmScale(mapScale);
  return kmScale === null ? DEFAULT_KM_SCALE : kmScale;
}

/**
 * A mode's speed, with an unknown or absent mode read on foot (the base denomination).
 * @param {unknown} mode
 * @returns {number}
 */
export function modeSpeedOf(mode) {
  const known = typeof mode === 'string' && Object.prototype.hasOwnProperty.call(MODE_SPEEDS, mode);
  return known ? MODE_SPEEDS[/** @type {TravelMode} */ (mode)] : MODE_SPEEDS.foot;
}

/**
 * THE REACH BANDS: the closed vocabulary a distance in weeks falls into, cut at the
 * canonical campaign intervals (INTERVAL_WEEKS). `beyond_a_year` is the far shore past
 * the one-year cap every hop is clamped to ("The far shore is beyond a year's march.").
 */
export const REACH_BANDS = Object.freeze(/** @type {const} */ ([
  'within_a_week',
  'within_a_month',
  'within_a_season',
  'within_a_year',
  'beyond_a_year',
]));

/** @typedef {typeof REACH_BANDS[number]} ReachBand */

/**
 * The reach band of a distance in weeks. TOTAL: a non-number, NaN, or an unreachable
 * (infinite) distance reads `beyond_a_year`, the band that promises nothing; anything
 * at or under one week, zero and negatives included, reads `within_a_week`. MONOTONE:
 * more weeks never read a nearer band.
 * @param {unknown} weeks
 * @returns {ReachBand}
 */
export function reachBandOf(weeks) {
  if (typeof weeks !== 'number' || Number.isNaN(weeks)) return 'beyond_a_year';
  if (weeks <= INTERVAL_WEEKS.one_week) return 'within_a_week';
  if (weeks <= INTERVAL_WEEKS.one_month) return 'within_a_month';
  if (weeks <= INTERVAL_WEEKS.one_season) return 'within_a_season';
  if (weeks <= INTERVAL_WEEKS.one_year) return 'within_a_year';
  return 'beyond_a_year';
}
