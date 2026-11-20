/**
 * generators/people/pairPlace.js — BAR4-PEOPLE (BRIEF-BAR4's kind "the pair's ties"; the chair's ruling TI1 of 2026-11-16,
 * vetoable by the owner): TWO PAIR FACTS a tie line presumes, each read off the two cards the line names (`ctx.pair`).
 * HOMED BESIDE THE TIE DRAW, not under domain/facts/ (the chair's ceiling ruling of 09:29): only the tie draw answers them
 * (`ties.js :: withPairTies`), so the eager engine core and the first paint never carry them.
 *
 *   `shared place` (`pairSharesPlaceOf`): the two can stand in one place, so one may be named the other's successor:
 *     they stand for houses of ONE FAMILY or wear ONE FACE (a tanner's yard does not pass to a carpenter, though both
 *     are craft: `npcData.js :: pairSharesTrade`'s category is too loose for a succession), or the first holds the
 *     FIRST RANK of a power the second sits in (the place is the head's seat; two members of one council are no
 *     succession: the second already sits there). Undefined where a card carries no institution.
 *   `lone tie` (`pairIsLoneOf`): the record's relationships hold no other tie between the two (either way round); a
 *     line that claims the two do not speak needs it. Undefined where the record holds no relationships (the tie draw
 *     answers it from the ties it has drawn: `people/ties.js`).
 *
 * Pure; no draw. One home each; the vocabulary's two atoms read them through the facts the tie draw hands its lines.
 */

// BAR4-CLOSE-SWEEP (the chair's PD1b): `shared place`'s reader and its two pair tests live in `domain/facts/pairPlace.js` (moved verbatim)
import { cardOf, leadsPowerOf, pairOfOneHouse, pairSharesPlaceOf } from '../../domain/facts/pairPlace.js';

export { leadsPowerOf, pairOfOneHouse, pairSharesPlaceOf };

/**
 * THE ONE READER of `lone tie`: the two cards carry at most one tie between them, either way round.
 * @param {{ relationships?: unknown } | null | undefined} record @param {unknown} pair `[from, to]`
 * @returns {boolean | undefined}
 */
export function pairIsLoneOf(record, pair) {
  if (!Array.isArray(pair) || pair.length !== 2 || !Array.isArray(record?.relationships)) return undefined;
  const [a, b] = pair.map((c) => String(cardOf(c)?.id ?? ''));
  if (!a || !b) return undefined;
  return record.relationships.filter((t) => {
    const r = /** @type {{ from?: unknown, to?: unknown } | null} */ (t && typeof t === 'object' ? t : null);
    return r && ((String(r.from) === a && String(r.to) === b) || (String(r.from) === b && String(r.to) === a));
  }).length <= 1;
}
