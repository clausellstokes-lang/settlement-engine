/**
 * domain/facts/pairPlace.js — `shared place`'s ONE READER and its two pair tests, MOVED VERBATIM from
 * `generators/people/pairPlace.js` (BAR4-CLOSE-SWEEP, the chair's PD1b of 2026-11-16, vetoable by the owner) so the tie
 * line's twin (`data/npcData.js :: mentor_legacy.desc#7`) reads the same answer the draw reads: data reads domain, never
 * generators. `generators/people/pairPlace.js` re-exports all three, so no caller changes. BAR4-PEOPLE's words (the
 * chair's TI1): `shared place` = the two can stand in one place, so one may be named the other's successor: they stand for
 * houses of ONE FAMILY or wear ONE FACE, or the first holds the FIRST RANK of a power the second sits in. Undefined where
 * a card carries no institution. Pure; no draw; no import.
 */

/** @typedef {{ id?: unknown, institution?: { kind?: unknown, family?: unknown, title?: unknown } | null, memberships?: unknown }} PlaceCard */

/** @param {unknown} card @returns {PlaceCard | null} */
export const cardOf = (card) => (card && typeof card === 'object' ? /** @type {PlaceCard} */ (card) : null);
/** @param {PlaceCard | null} c @returns {Array<{ power?: unknown, rank?: unknown }>} */
const membershipsOf = (c) => (Array.isArray(c?.memberships) ? c.memberships : []);

/**
 * The first card holds the first rank of a power the second sits in.
 * @param {unknown} a @param {unknown} b @returns {boolean}
 */
export function leadsPowerOf(a, b) {
  const theirs = membershipsOf(cardOf(b));
  return membershipsOf(cardOf(a)).some((m) => m?.rank === 1 && m.power && theirs.some((n) => n?.power === m.power));
}

/**
 * The two stand for houses of one family, or wear one face.
 * @param {unknown} a @param {unknown} b @returns {boolean}
 */
export function pairOfOneHouse(a, b) {
  const ia = cardOf(a)?.institution, ib = cardOf(b)?.institution;
  if (ia?.kind === 'house' && ib?.kind === 'house' && ia.family && ia.family === ib.family) return true;
  return typeof ia?.title === 'string' && ia.title === ib?.title;
}

/**
 * THE ONE READER of `shared place`: the first card of the pair may name the second its successor.
 * @param {{ npcs?: unknown } | null | undefined} record @param {unknown} pair `[from, to]`
 * @returns {boolean | undefined}
 */
export function pairSharesPlaceOf(record, pair) {
  if (!Array.isArray(pair) || pair.length !== 2) return undefined;
  const roster = Array.isArray(record?.npcs) ? /** @type {Array<PlaceCard | null | undefined>} */ (record.npcs) : null;
  /** @param {unknown} card */
  const held = (card) => {
    const c = cardOf(card);
    const found = c && roster && c.id != null ? roster.find((n) => n && String(n.id) === String(c.id)) : null;
    return found || c;
  };
  const a = held(pair[0]), b = held(pair[1]);
  if (!a?.institution || !b?.institution) return undefined;
  return pairOfOneHouse(a, b) || leadsPowerOf(a, b);
}
