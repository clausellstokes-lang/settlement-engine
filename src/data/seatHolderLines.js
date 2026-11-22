/**
 * data/seatHolderLines.js — A HOLDER IS NOT "UNDER" THE OFFICE IT HOLDS (SEAT-10's U6, CS12; the chair's rulings of
 * 2026-11-22 07:21Z and 07:37Z, the wordings the chair's, verbatim).
 *
 * Under the seat law (`domain/seat/seatLaw.js :: seatsByHolder`) the power that holds the seat can stand apart from the
 * form (the governing row). Where it does, and it is not veiled (`domain/seat/seatTable.js :: isVeiledRow`), the
 * form<->holder relation row and the holder's own standing say that it holds the office, never that it works under it:
 *
 *   `relation`  W1, the form<->holder relation row (`generators/factionDynamics.js :: computeFactionRelationships`), a pool of six;
 *   `licensed`  W2, appended to W1 ONLY on a licensed pair (`seatTable.js :: pairLicense(kind, form).pair === 'licensed'`);
 *   `standing`  W3, the holder row's standing (`generators/power/factionStanding.js :: annotateFactionStanding`), a pool
 *               of five, in place of that row's "in the shadow of", "The gap between them" and "Behind" lines.
 *
 * WHERE THE SEAT STANDS EMPTY (CLOSE-3 unit (1), "VACANT"; the chair's E131 of 2026-11-22, the wordings the chair's,
 * verbatim): the governance account says no one holds the seat (`domain/display/governanceAccount.js ::
 * governanceAccountOf`, on the chain's `missing_seat`), so the holder's lines say that it HELD the seat, and that the seat
 * is empty now, never that it sits in it. The vacancy is read by its one reader (`domain/people/seatKeeper.js ::
 * isSeatVacant`, through `factionDynamics.js :: seatHolderApartOf`), and each twin is drawn in place of its pool through
 * the SAME mixed key, the key naming the base pool (`factionDynamics.js :: seatHolderLineOf`):
 *
 *   `relationVacant`  W1v, in place of `relation` on the form<->holder row, a pool of three (W2 still follows it on a
 *                     licensed pair);
 *   `standingVacant`  W3v, in place of `standing` on the holder row, a pool of three.
 *
 * Every verb on the holder in the two twins is past tense, so neither needs `{holder|one|many}`, and no possessive is
 * put on `{holder}`.
 *
 * The slots: `{form}` is the governing row's name after its article (the line writes its own "The"/"the"), `{form's}` its
 * possessive; `{holder}` is the holder's name with its article; `{holder|one|many}` is the verb in the holder's number
 * (`data/people/powerSentenceName.js :: fillAgreement`). Drawn ONLY through `kernel/proseHash.js :: pickVariantMixed`,
 * keyed by the record's seed and the two names (`factionDynamics.js :: seatHolderLineOf`). Under law 1 nothing here is read.
 *
 * @enforced-by tests/generators/seat/seatHolderLines.test.js
 */

/** @type {Readonly<{ relation: ReadonlyArray<string>, licensed: ReadonlyArray<string>, standing: ReadonlyArray<string>, relationVacant: ReadonlyArray<string>, standingVacant: ReadonlyArray<string> }>} */
export const SEAT_HOLDER_LINES = Object.freeze({
  relation: Object.freeze([
    'The {form} is the office here, and {holder} {holder|holds|hold} it.',
    '{holder} {holder|sits|sit} in the {form} and {holder|makes|make} its rulings.',
    "The {form's} seats are filled by {holder}.",
    'Whoever comes before the {form} comes before {holder}.',
    'The {form} is how this place is ruled, and {holder} {holder|rules|rule} through it.',
    'It is {holder} who {holder|sits|sit} in the {form}.',
  ]),
  licensed: Object.freeze([
    'They came to it by trade, and the money that runs this place passes through their hands.',
  ]),
  standing: Object.freeze([
    "They hold the {form's} seat, and answer for what it does.",
    'They sit in the {form} themselves, and its rulings are their own.',
    'They govern through the {form}, and what it orders is their order.',
    'They hold the {form}, and nothing it decides is decided without them.',
    'They are the ones who sit in the {form}, and its word is theirs.',
  ]),
  relationVacant: Object.freeze([
    'The {form} is the office here, and the seat {holder} held in it stands empty.',
    '{holder} sat in the {form} until its seat fell empty.',
    "The {form's} seat was filled by {holder}, and no one fills it now.",
  ]),
  standingVacant: Object.freeze([
    "They held the {form's} seat, and it stands empty now.",
    'They sat in the {form} until its seat fell empty.',
    'The {form} was theirs, and no one sits in its seat today.',
  ]),
});
