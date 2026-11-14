/**
 * domain/facts/sharedPower.js — THE SHARED-POWER HOME (R2-CODE-A-14, the chair's ruling (s1) of 2026-11-14:
 * "THE WORD IS GRANTED": ONE atom, `shared power`, a PAIR's fact). A line about a bloc presumes that the two
 * people it names sit in one power together; the vocabulary held no fact about a pair, so the tie line
 * "share a council bloc and a list of enemies" printed for pairs that share none (487 of its 1,101 prints on
 * the reader's 3,048 births).
 *
 *   sharesPower(a, b)            whether two cards share a power (any membership in common): the tie
 *                                generator's own rule (`people/ties.js` weights a target by it), moved here
 *                                VERBATIM so the draw's weight and the line's condition are one reading;
 *                                `people/ties.js` re-exports it
 *   pairSharesPower(record, pair) THE ONE READER of the atom: the pair `[from, to]` (the cards the tie names),
 *                                each read as the record's own card of that id when the record holds a roster
 *                                (the final record: the birth self-check re-asserts against it), else as handed
 *                                (a birth in progress, whose partial record carries no roster);
 *                                `undefined` when the pair is not two cards (unanswered: fail-closed)
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/facts/sharedPower.test.js
 */

/** The powers a card belongs to. @param {Record<string, any> | null | undefined} card @returns {Set<string>} */
const powersOf = (card) => new Set((Array.isArray(card?.memberships) ? card.memberships : [])
  .map((/** @type {any} */ m) => String(m?.power || '')).filter(Boolean));

/**
 * Whether two cards share a power (any membership in common).
 * @param {Record<string, any> | null | undefined} a @param {Record<string, any> | null | undefined} b
 * @returns {boolean}
 */
export function sharesPower(a, b) {
  const mine = powersOf(a);
  if (!mine.size) return false;
  for (const p of powersOf(b)) if (mine.has(p)) return true;
  return false;
}

/**
 * THE ONE READER of `shared power`.
 * @param {{ npcs?: unknown } | null | undefined} record
 * @param {unknown} pair the two cards the line names, `[from, to]`
 * @returns {boolean | undefined}
 */
export function pairSharesPower(record, pair) {
  if (!Array.isArray(pair) || pair.length !== 2) return undefined;
  const roster = Array.isArray(record?.npcs) ? /** @type {Array<Record<string, any>>} */ (record.npcs) : null;
  /** @param {unknown} card @returns {Record<string, any> | null} */
  const cardOf = (card) => {
    if (!card || typeof card !== 'object') return null;
    const id = /** @type {{ id?: unknown }} */ (card).id;
    const held = roster && id != null ? roster.find((n) => n && String(n.id) === String(id)) : null;
    return held || /** @type {Record<string, any>} */ (card);
  };
  const a = cardOf(pair[0]); const b = cardOf(pair[1]);
  if (!a || !b) return undefined;
  return sharesPower(a, b);
}
