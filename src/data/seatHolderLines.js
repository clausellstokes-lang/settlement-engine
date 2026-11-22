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
 * The slots: `{form}` is the governing row's name after its article (the line writes its own "The"/"the"), `{form's}` its
 * possessive; `{holder}` is the holder's name with its article; `{holder|one|many}` is the verb in the holder's number
 * (`data/people/powerSentenceName.js :: fillAgreement`). Drawn ONLY through `kernel/proseHash.js :: pickVariantMixed`,
 * keyed by the record's seed and the two names (`factionDynamics.js :: seatHolderLineOf`). Under law 1 nothing here is read.
 *
 * @enforced-by tests/generators/seat/seatHolderLines.test.js
 */

/** @type {Readonly<{ relation: ReadonlyArray<string>, licensed: ReadonlyArray<string>, standing: ReadonlyArray<string> }>} */
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
});
