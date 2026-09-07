/**
 * warStance.js — THE FIVE-RUNG WAR STANCE LADDER (WC-0A, the war-circulation family's
 * first code).
 *
 * A party's stance in a war EPISODE, keyed per (party, warEpisodeKey) and never per
 * anchor — `DESIGN_FP_ARCH_WC.md` §1.2.2, corrected in the volume's round 2. "Realized
 * share" throughout means EPISODE share: the party's committed headcount over its SIDE's
 * total committed headcount, time-integrated, summed across every deployment on that
 * side. Nothing here computes that share; this leaf is the VOCABULARY the computation
 * will be graded against, and the derivation over live deployments lands at WC-2.
 *
 * ⭐ SEMANTIC ORDER IS CARRIED BY AN EXPLICIT RANK MAP, NEVER BY ARRAY POSITION. This is
 * the TAP_DEPTH lesson, applied before it can bite: a ladder whose meaning is its index
 * silently re-grades every consumer the day somebody sorts the array, adds a rung in the
 * middle, or serializes it through anything that does not promise order. `WAR_STANCE_RANK`
 * is the meaning; `WAR_STANCE_LADDER` is only the roster. The acceptance file shuffles a
 * copy of the roster and requires every rank to survive, and the mutant that re-keys
 * `warStanceOf` on `indexOf` is convicted by exactly that.
 *
 * ⛔ NO DECLARER DISJUNCT EXISTS, AND ITS ABSENCE IS ASSERTED RATHER THAN LEFT TO
 * INSPECTION (§7.A.1, directive (f)). No export, member or branch of this module names a
 * DECLARED label. A rung reachable by declaration would make priced shielding purchasable
 * at declaration time — a party could buy `principal`'s protection by saying the word
 * instead of by fielding the majority realized share — which the directive forbids in
 * terms. Every rung here is a fact about contribution, and `principal` in particular is
 * the MAJORITY realized-share contributor to its side, at most one per side per episode,
 * with a side legally allowed to have NONE (the three-way split, pinned at WC-2).
 *
 * ⛔⛔ THE SCALAR AXES LAND HERE; THEIR VALUES DO NOT, AND THAT IS THE WHOLE REASON THE
 * SHAPE IS SEPARABLE FROM ITS CONTENT. WC-0's own closing line reads "TUNING: none", and
 * multipliers are constants — owner-signature surface under THE PROMISE's versioned-tuning
 * carve-out. The volume schedules the values with their movers ("stanceScalars at the
 * three sites", WC-2), exactly as the law-band table's curves land with theirs rather than
 * in the registration wave. So `STANCE_SCALAR_AXES` is closed at three and
 * `stanceScalars` is total over the ladder, while every value reads `null` for
 * UNREGISTERED. The acceptance file asserts that no numeric scalar is declared anywhere in
 * this module, so "TUNING: none" is a measurement rather than a claim.
 *
 * ⚠ ZERO IMPORTS, DELIBERATELY, and a needed import is a STOP rather than a registry
 * edit. A vocabulary leaf that reaches for anything re-parents every module that spells a
 * stance word into whatever it reached for — `lawWord.js`'s standing argument, applied.
 *
 * ⚠ DARK-COMPLETE BY ABSENCE OF CALLERS. Nothing under `src/` imports this module at this
 * member; its first consumer arrives with WC-2.
 *
 * PURE: no rng, no clock, no store, no world read.
 */

/**
 * The five rungs, in SEMANTIC order for readability only. ⛔ Meaning lives in
 * `WAR_STANCE_RANK`; nothing may key on a position in this array.
 * @type {ReadonlyArray<string>}
 */
export const WAR_STANCE_LADDER = Object.freeze([
  'neutral',
  'materiel',
  'auxiliary',
  'belligerent',
  'principal',
]);

/**
 * THE MEANING OF THE LADDER. A higher rank is a deeper commitment to the episode:
 * `neutral` is not in this episode at all (no army, no troops, no live credit);
 * `materiel` joined in supplies only, carrying the weakest grievance against her and the
 * thinnest terms weight; `auxiliary` joined in troops without fielding an army, her blocks
 * serving under another party's banner at minority realized share; `belligerent` fields
 * her own army at minority realized share — the rung a nominal owner or an original
 * declarer FALLS TO when its own contribution thins, and the rung every party on a
 * no-majority side reads; `principal` is the majority realized-share contributor to its
 * side, owner or reinforcer alike, ties breaking toward the holder of the side's origin
 * anchor.
 * @type {Readonly<Record<string, number>>}
 */
export const WAR_STANCE_RANK = Object.freeze({
  neutral: 0,
  materiel: 1,
  auxiliary: 2,
  belligerent: 3,
  principal: 4,
});

/**
 * The scalar axes a stance modulates, codepoint-sorted and closed at three. `casus` is the
 * grievance weight the stance earns against her, `exhaustion` the war-weariness she
 * accrues, `terms` her weight at the table.
 * @type {ReadonlyArray<string>}
 */
export const STANCE_SCALAR_AXES = Object.freeze(['casus', 'exhaustion', 'terms']);

/** The unregistered-value marker: an axis DECLARED at WC-0A and SUPPLIED at WC-2. */
const UNREGISTERED = null;

const STANCE_SCALARS = Object.freeze(
  Object.fromEntries(
    WAR_STANCE_LADDER.map((rung) => [
      rung,
      Object.freeze(
        Object.fromEntries(STANCE_SCALAR_AXES.map((axis) => [axis, UNREGISTERED])),
      ),
    ]),
  ),
);

/**
 * The canonical stance record for a rung: its name and its RANK, read from the rank map.
 *
 * ⛔ THIS FUNCTION MUST NEVER CONSULT `WAR_STANCE_LADDER.indexOf`. The roster's order is
 * presentational; re-keying on it is the mutant this member plants and convicts.
 *
 * @param {unknown} rung one of `WAR_STANCE_LADDER`.
 * @returns {{ rung: string, rank: number }} frozen.
 * @throws {TypeError} on any non-member — the ladder is closed and total, and a silent
 *   default would grade an unknown party as `neutral`, which is a real stance.
 */
export function warStanceOf(rung) {
  const key = /** @type {PropertyKey} */ (rung);
  const rank = Object.prototype.hasOwnProperty.call(WAR_STANCE_RANK, key)
    ? WAR_STANCE_RANK[/** @type {string} */ (rung)]
    : undefined;
  if (rank === undefined) {
    throw new TypeError(
      `warStanceOf: unknown war stance ${JSON.stringify(rung)} — the ladder is closed at ${WAR_STANCE_LADDER.join('|')}`,
    );
  }
  return Object.freeze({ rung: /** @type {string} */ (rung), rank });
}

/**
 * The scalar row for a rung — TOTAL over the ladder, closed at the three declared axes,
 * every value UNREGISTERED until its mover lands (WC-2).
 *
 * @param {unknown} rung one of `WAR_STANCE_LADDER`.
 * @returns {Readonly<Record<string, null>>} frozen; one key per `STANCE_SCALAR_AXES`.
 * @throws {TypeError} on any non-member.
 */
export function stanceScalars(rung) {
  const key = /** @type {PropertyKey} */ (rung);
  const row = Object.prototype.hasOwnProperty.call(STANCE_SCALARS, key)
    ? STANCE_SCALARS[/** @type {string} */ (rung)]
    : undefined;
  if (row === undefined) {
    throw new TypeError(
      `stanceScalars: unknown war stance ${JSON.stringify(rung)} — the ladder is closed at ${WAR_STANCE_LADDER.join('|')}`,
    );
  }
  return row;
}
