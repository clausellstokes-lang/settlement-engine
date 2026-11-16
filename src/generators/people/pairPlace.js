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

/** @typedef {{ id?: unknown, institution?: { kind?: unknown, family?: unknown, title?: unknown } | null, memberships?: unknown }} PlaceCard */

/** @param {unknown} card @returns {PlaceCard | null} */
const cardOf = (card) => (card && typeof card === 'object' ? /** @type {PlaceCard} */ (card) : null);
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
