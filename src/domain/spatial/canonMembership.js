/**
 * canonMembership.js — WHO THE FROZEN CANON ACTUALLY MAPPED, as a zero-import leaf
 * (WEAVE SEAM-5, the S5 cheap half: docs/DESIGN_FMG_WEAVE.md §3 W-SEAM).
 *
 * ── THE QUESTION AND WHY IT NEEDED A LEAF ───────────────────────────────────
 * A spatial canonize freezes the realm's geography around THE SETTLEMENTS THAT
 * EXISTED AT THAT MOMENT. Found three more the next evening and they are simply
 * not in it: no territory, no gates, no row in the distance matrix. Every
 * modulation seam already handles that honestly — `mappedDistanceWeight` returns
 * 1.0 for an unmapped endpoint rather than attenuating a tie it cannot measure —
 * so nothing is broken. What was missing is that NOBODY WAS TOLD. The gate CTA
 * read "Geography mapped ✓" whether the canon covered every seat in the realm or
 * two thirds of them, and the only way to find out was to re-map and see.
 *
 * ⛔ AND THE READ COULD NOT LIVE WHERE THE ANSWER ALREADY WAS. `distanceRead.isMapped`
 * asks exactly this question of a digest, and `distanceRead.js` is the ~53 kB
 * frozen-digest reader whose own docblock says it "never reaches first paint":
 * importing ANY symbol from it pulls the whole module into the importer's chunk,
 * which is the recorded `warCoalitionLedger` incident. The consumer here is
 * `LivingWorldGates`, a Library/Realm settings control — squarely on the first-paint
 * side. So this is the house LEAF EXTRACTION (`spatialLedgerAccess.js`,
 * `deityConstants`, `stablePart`): move the FUNCTION, not a chunk pin.
 *
 * ⚠ TWO SPELLINGS OF ONE MEMBERSHIP IS THE HAZARD THIS FILE COULD CREATE, so it is
 * pinned rather than promised: a test asserts this leaf and `isMapped` return the
 * same verdict for every id on a real digest. If the canon's membership field ever
 * moves, that pin is what reds.
 *
 * PURE, TOTAL, DETERMINISTIC: property reads over a frozen record. Its ONE import is
 * the number-word table, itself a zero-import leaf, because the sentence this file
 * hands a surface must not mint a digit (§754.3).
 */
import { numberWord } from '../display/numberWords.js';

/**
 * The set of settlement ids the frozen canon mapped, or null when there is no
 * active canon at all.
 *
 * THE GATE IS THE SAME TWO CONDITIONS `activeSpatialDigest` USES — a positive
 * integer `spatialCanonVersion` (stamped only by an entitled canonize) and a real
 * digest — narrowed to the one field this leaf reads. Null means "this realm has
 * no canon", which is a different answer from an empty set ("a canon that mapped
 * nobody") and callers must not conflate them.
 *
 * @param {{ spatialCanonVersion?: unknown, spatialDigest?: unknown }|null|undefined} worldState
 * @returns {Set<string>|null}
 */
export function mappedSettlementIds(worldState) {
  const version = worldState == null ? null : worldState.spatialCanonVersion;
  if (!(typeof version === 'number' && Number.isInteger(version) && version > 0)) return null;
  const digest = worldState == null ? null : worldState.spatialDigest;
  if (!digest || typeof digest !== 'object') return null;
  const ids = /** @type {{ settlementIds?: unknown }} */ (digest).settlementIds;
  if (!Array.isArray(ids)) return null;
  const out = new Set();
  for (const id of ids) {
    if (id == null) continue;
    out.add(String(id));
  }
  return out;
}

/**
 * HOW MANY OF A CAMPAIGN'S SETTLEMENTS WERE FOUNDED AFTER ITS GEOGRAPHY WAS FROZEN.
 *
 * The count is a MEMBERSHIP DIFFERENCE and not a timestamp comparison, deliberately:
 * "founded since" is a phrase about time, but the honest evidence is that the canon
 * does not carry the seat, and that is true however the seat arrived — founded,
 * imported, moved in from another campaign. Nothing here reads a clock, so the
 * answer cannot drift with one.
 *
 * A realm with no canon returns 0 rather than "all of them": an unmapped realm is
 * not a realm behind on its mapping, and the CTA that consumes this says "Map
 * geography" there rather than counting anything.
 *
 * Duplicate ids count once. An id absent from the canon counts once even if the
 * membership list repeats it, because the reader's sentence is about places.
 *
 * @param {{ spatialCanonVersion?: unknown, spatialDigest?: unknown }|null|undefined} worldState
 * @param {ReadonlyArray<unknown>|null|undefined} settlementIds the campaign's membership
 * @returns {number}
 */
export function foundingsSinceMapped(worldState, settlementIds) {
  const mapped = mappedSettlementIds(worldState);
  if (!mapped) return 0;
  const seen = new Set();
  let count = 0;
  for (const raw of Array.isArray(settlementIds) ? settlementIds : []) {
    if (raw == null) continue;
    const id = String(raw);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    if (!mapped.has(id)) count += 1;
  }
  return count;
}

/**
 * THE SENTENCE, or null when there is nothing to say.
 *
 * The copy lives HERE and not in the JSX, on `distanceLegibility`'s precedent — a
 * spatial read that hands a surface a `phrase` — so the wording is pinnable without
 * rendering a component, and the control is left with a conditional and nothing to
 * get wrong.
 *
 * ⚠ THE COUNT IS CONCRETE AND SPELLED. That is the §754.3 boundary exactly as the
 * owner ruled it: abstract engine scalars die at mint, honest concrete counts in
 * world words stay. "Three settlements" is a fact a DM can act on; a band word
 * ("a few settlements") would be less true for no gain, since the number IS known.
 * No digit is minted anywhere on this path.
 *
 * @param {{ spatialCanonVersion?: unknown, spatialDigest?: unknown }|null|undefined} worldState
 * @param {ReadonlyArray<unknown>|null|undefined} settlementIds
 * @returns {{ count: number, phrase: string }|null}
 */
export function foundingsSinceMappedNote(worldState, settlementIds) {
  const count = foundingsSinceMapped(worldState, settlementIds);
  if (count <= 0) return null;
  const word = numberWord(count);
  const phrase = count === 1
    ? 'One settlement has been founded since this realm was mapped. Re-map to bring it into the canon.'
    : `${word.charAt(0).toUpperCase()}${word.slice(1)} settlements have been founded `
      + 'since this realm was mapped. Re-map to bring them into the canon.';
  return { count, phrase };
}
