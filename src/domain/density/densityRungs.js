/**
 * densityRungs.js — §810.2 R11's ROSTERED RUNGS, and the ONE-RESOLVER mapping
 * the chair owed this car (ODQ §817-Q5).
 *
 * ════════════════════════════════════════════════════════════════════════════
 * THE MAPPING, STATED ONCE (this is the answer to Q5)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * The law rolls RUNG OCCUPANCY — head / middle / lowest, any rung vacant at
 * birth. The pulse derives rungs from NOTABILITY at tick time
 * (`npcAgency.dotRankFor` → `notability(npc)`; `npcLadderState.eligibleMembersOf`
 * → `importanceWeight(npc) >= RUNG_ELIGIBLE_FLOOR`). Two representations, one
 * world — so one of them has to be the resolver, and the chair ruled it is the
 * derived one.
 *
 * ⭐ **ROLLED RUNGS EXPRESS THROUGH NOTABILITY PLACEMENT.** The roll does not
 * store a rung; it STAMPS `npc.importance`. `inferImportance` (domain/entities/
 * npcs.js) short-circuits on an explicit, known `importance` before it reaches
 * its role-regex fallback, and every rung consumer in the estate — `notability`,
 * `dotRankFor`, `importanceWeight`, `eligibleMembersOf`, `clergyTraitPlane`'s
 * ORG_POWER — reads through that one function. So `dotRankFor` stays THE SINGLE
 * RESOLVER, unchanged, and a rolled vacancy survives pulse-time re-derivation
 * because the pulse never re-derives importance: it reads what generation wrote.
 *
 * ⛔ THE INVARIANT THAT MAKES THAT TRUE: the v2 roll must stamp `importance` on
 * EVERY named figure it places. MEASURED at b85044099 — only **318 of 3,338**
 * generated NPCs (9.5%) carry an explicit `importance` field today; the other
 * 90.5% are classified by `inferImportance`'s role regex, and that regex reads a
 * town's **Mayor** and a metropolis's **Governor** as `minor` (weight 0.0), so
 * **211 of 360 settlements have a governing faction with ZERO ladder-eligible
 * members** and 940 of 2,140 power factions hold no rung at all. Leaving a
 * member unstamped is therefore not a cosmetic omission — it is how the ruling
 * seat goes ladder-invisible. `densityRoll.js` stamps every member and
 * `tests/generators/densityRungMapping.test.js` asserts it.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * THE BANDS, AND WHY THEY AGREE WITH `RUNG_CAP_BY_TIER` WITHOUT TOUCHING IT
 * ════════════════════════════════════════════════════════════════════════════
 *
 *   head   = the tier's rank ceiling, floored at HEAD_RUNG_FLOOR (Q3: an
 *            OCCUPIED head always rolls ≥ notable)
 *   middle = one band below head
 *   lowest = one band below middle
 *   (each floored at `minor`, so small tiers collapse the lower two)
 *
 *      tier        head     middle   lowest    ladder-eligible  RUNG_CAP_BY_TIER
 *      thorp       notable  minor    minor     1                1
 *      hamlet      notable  minor    minor     1                2
 *      village     key      notable  minor     2                3
 *      town        pillar   key      notable   3                3
 *      city        pillar   key      notable   3                4
 *      metropolis  pillar   key      notable   3                5
 *
 * Census consumer #8 asked how a thorp's ONE-rung ladder could represent a
 * middle or lowest occupant. It does not need to: under this law a thorp's
 * lower two rungs are `minor` and therefore DELIBERATELY ladder-invisible — the
 * thorp's single rung is its head, which is exactly what `RUNG_CAP_BY_TIER`
 * already says. The mapping was chosen to agree with that table rather than to
 * renegotiate it, so no bridge is owed and `npcLadderState` is untouched. Where
 * a tier's cap EXCEEDS the distinct bands (city 4, metropolis 5), extra members
 * share the `notable` floor band and the ladder orders them by its own
 * structural-rank + codepoint tiebreak — which is what that tiebreak is for.
 *
 * Pure. No RNG (the roll lives in densityRoll.js), no store, no React.
 */

import {
  HEAD_RUNG_FLOOR,
  IMPORTANCE_ORDER,
  clampImportanceToTier,
  importanceIndex,
  rankCeilingForTier,
} from './densityBands.js';

/** The law's rung vocabulary, top first. THREE rungs at every tier (§810.2b:
 *  "R10/R11 apply at EVERY tier … tier only sets the bands"). */
export const RUNG_KEYS = Object.freeze(['head', 'middle', 'lowest']);

/**
 * ⚠ CANDIDATE REGISTER (finite semantics; frozen only by the owner's pen).
 * The typed rung role a v2-born figure carries. `yearner` is §810.2's
 * over-weighted vacancy pattern — the one who aches for an empty seat.
 * @type {ReadonlyArray<string>}
 */
export const DENSITY_RUNG_ROLES = Object.freeze([
  'head', 'middle', 'lowest', 'yearner',
]);

/** The field a v2-born figure carries its rung role on. Absent on every
 *  pre-law world (v1 stamps nothing), so every consumer of it is dormant until
 *  the dial flips. */
export const RUNG_ROLE_FIELD = 'densityRungRole';

/**
 * The importance band each rung occupies at a tier. Frozen per call, cheap,
 * and derived — never a second hard-coded table.
 *
 * @param {string|null|undefined} tier
 * @returns {{head: string, middle: string, lowest: string}}
 */
export function rungBandsForTier(tier) {
  const head = clampImportanceToTier(rankCeilingForTier(tier), tier, HEAD_RUNG_FLOOR);
  const headIdx = importanceIndex(head);
  return Object.freeze({
    head,
    middle: IMPORTANCE_ORDER[Math.max(0, headIdx - 1)],
    lowest: IMPORTANCE_ORDER[Math.max(0, headIdx - 2)],
  });
}

/**
 * The band a YEARNER sits at: one below the head band, floored at `minor`.
 * "No head priest, but one who aches for the seat" — the yearner is visibly
 * NOT the head, which is the whole story.
 *
 * @param {string|null|undefined} tier
 * @returns {string}
 */
export function yearnerBandForTier(tier) {
  return rungBandsForTier(tier).middle;
}

/**
 * DERIVED rung occupancy for a roster — computed from `importance` alone, by
 * exactly the arithmetic the pulse uses. This is the function the
 * vacancy-survives-re-derivation fixture calls on BOTH sides: once on the
 * plan's intent and once on the settlement the pulse would read.
 *
 * A rung is OCCUPIED when some member sits at or above its band AND no
 * higher-priced rung claims that member — expressed simply: head is occupied
 * when any member reaches the head band; middle when any member reaches the
 * middle band; lowest when any member reaches the lowest band. Where two rungs
 * share a band (small tiers), they are occupied together, which is the honest
 * reading of a collapsed ladder rather than a fiction of three distinct seats.
 *
 * @param {Array<{importance?: unknown}>} members
 * @param {string|null|undefined} tier
 * @returns {{head: boolean, middle: boolean, lowest: boolean}}
 */
export function derivedRungOccupancy(members, tier) {
  const bands = rungBandsForTier(tier);
  const top = topImportanceIndex(members);
  return Object.freeze({
    head:   top >= importanceIndex(bands.head),
    middle: top >= importanceIndex(bands.middle),
    lowest: top >= importanceIndex(bands.lowest),
  });
}

/**
 * ⭐ THE LOAD-BEARING PREDICATE. A faction's head rung is VACANT when no member
 * reaches the tier's head band. Pure notability placement — no stored flag, no
 * second resolver, nothing for the pulse to silently re-fill.
 *
 * @param {Array<{importance?: unknown}>} members
 * @param {string|null|undefined} tier
 * @returns {boolean}
 */
export function isHeadRungVacant(members, tier) {
  return !derivedRungOccupancy(members, tier).head;
}

/**
 * The highest importance index present in a roster, or -1 for an empty one.
 * Reads the RAW `importance` field only: a v2 member is always stamped, and
 * reading the role-regex fallback here would let an unstamped figure
 * accidentally satisfy a rung the roll deliberately left vacant.
 *
 * @param {Array<{importance?: unknown}>} members
 * @returns {number}
 */
export function topImportanceIndex(members) {
  let top = -1;
  for (const m of members || []) {
    const idx = importanceIndex(m?.importance);
    if (idx > top) top = idx;
  }
  return top;
}

/**
 * The importance band to stamp for a rung at a tier, tier-ceiling-clamped.
 * The ONE place a rolled rung becomes a written band.
 *
 * @param {string} rung  one of RUNG_KEYS, or 'yearner'
 * @param {string|null|undefined} tier
 * @returns {string}
 */
export function importanceForRung(rung, tier) {
  const bands = rungBandsForTier(tier);
  if (rung === 'yearner') return yearnerBandForTier(tier);
  const band = bands[/** @type {'head'|'middle'|'lowest'} */ (rung)] || bands.lowest;
  return clampImportanceToTier(band, tier);
}
