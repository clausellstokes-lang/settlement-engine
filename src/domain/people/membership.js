/**
 * people/membership.js — THE MEMBERSHIP READER: a card's standing in the powers, read from its
 * `memberships` (the people car, PEOPLE-2 CAST-DERIVED, 2026-11-07; the chair's rulings M-1b and
 * M-2 in docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §2).
 *
 * The owner removed the factions (ODQ §934.105): a representative "belongs to one or more powers
 * now", ranked first, second or third in each from what its house backs
 * (src/generators/people/castPowers.js writes `memberships: [{ power, rank: 1|2|3|null, share }]`).
 * The birth readers that read `factionAffiliation` (the shim's derived field, removed by PEOPLE-5)
 * read through these instead: the crisis cast, the seat rows, the crisis hooks' party and the
 * structural standing. Pure, draw-free, total over any input (a record with no `memberships`
 * array — a pre-car NPC, a DM-authored person — holds no membership: PEOPLE-5's migration, M-7,
 * gives a save its memberships).
 */

/** @typedef {{ power: string, rank: 1 | 2 | 3 | null, share?: number }} Membership */

/** @param {unknown} v @returns {Record<string, unknown>} */
const recordOf = (v) => (v && typeof v === 'object' ? /** @type {Record<string, unknown>} */ (v) : {});
/** @param {unknown} m @returns {m is Membership} */
const isMembership = (m) => { const p = recordOf(m).power; return typeof p === 'string' && !!p; };
/** @param {Membership} m @returns {number} a rank's sort key: 1, 2, 3, then the unranked */
const rankKey = (m) => (Number.isInteger(m.rank) ? /** @type {number} */ (m.rank) : Number.MAX_SAFE_INTEGER);

/**
 * The card's well-formed memberships, as written.
 * @param {unknown} card @returns {Membership[]}
 */
export function membershipsOf(card) {
  const ms = recordOf(card).memberships;
  return Array.isArray(ms) ? ms.filter(isMembership) : [];
}

/**
 * The card's membership in `power`, or null.
 * @param {unknown} card @param {string} power @returns {Membership | null}
 */
export function membershipIn(card, power) {
  if (typeof power !== 'string' || !power) return null;
  return membershipsOf(card).find((m) => m.power === power) || null;
}

/**
 * True when the card holds a membership in `power`.
 * @param {unknown} card @param {string} power @returns {boolean}
 */
export function holdsMembership(card, power) {
  return membershipIn(card, power) !== null;
}

/**
 * The card's rank in `power`: 1, 2 or 3; null when a member ranked nowhere; undefined when no member.
 * @param {unknown} card @param {string} power @returns {1 | 2 | 3 | null | undefined}
 */
export function rankIn(card, power) {
  const m = membershipIn(card, power);
  if (!m) return undefined;
  return Number.isInteger(m.rank) ? m.rank : null;
}

/**
 * The card's powers, the best-ranked first: rank 1 before 2 before 3 before none; a tie broken by
 * the power's place in `powerOrder` (the powers' roster order, the governing seat first), then by
 * the memberships' own order. The same order the shim (people/legacyShim.js) derives the two old
 * fields by, so `powersByRankOf(card, order)[0]` is the card's FIRST-RANK power.
 * @param {unknown} card @param {string[]} [powerOrder]
 * @returns {Membership[]}
 */
export function powersByRankOf(card, powerOrder = []) {
  const order = Array.isArray(powerOrder) ? powerOrder : [];
  const place = (/** @type {string} */ p) => { const i = order.indexOf(p); return i < 0 ? order.length : i; };
  return membershipsOf(card)
    .map((m, at) => ({ m, at }))
    .sort((x, y) => (rankKey(x.m) - rankKey(y.m)) || (place(x.m.power) - place(y.m.power)) || (x.at - y.at))
    .map(({ m }) => m);
}

/**
 * The card's FIRST-RANK power (its best standing; ties by `powerOrder`), or null when it holds no
 * membership.
 * @param {unknown} card @param {string[]} [powerOrder] @returns {Membership | null}
 */
export function firstRankMembershipOf(card, powerOrder = []) {
  return powersByRankOf(card, powerOrder)[0] || null;
}

/**
 * The powers' tie-break order: the governing seat first, then the roster's (the order the shim,
 * narrativeGenerator.js :: enrichNpcCoherence, derives the old fields by).
 * @param {unknown} settlement @returns {string[]}
 */
export function powerOrderOf(settlement) {
  const fs = recordOf(recordOf(settlement).powerStructure).factions;
  const list = (Array.isArray(fs) ? fs : []).map(recordOf);
  const roster = list.map((f) => String(f.faction || f.name || '')).filter(Boolean);
  const governing = String(list.find((f) => f.isGoverning)?.faction || '');
  return governing ? [governing, ...roster.filter((n) => n !== governing)] : roster;
}

/**
 * The members of `power` in `roster`, ORDERED BY RANK: the first, second and third, then the
 * unranked in roster order.
 * @template T @param {T[]} roster @param {string} power @returns {T[]}
 */
export function membersByRank(roster, power) {
  return (Array.isArray(roster) ? roster : [])
    .map((card, at) => ({ card, at, m: membershipIn(card, power) }))
    .filter((x) => x.m !== null)
    .sort((a, b) => (rankKey(/** @type {Membership} */ (a.m)) - rankKey(/** @type {Membership} */ (b.m))) || (a.at - b.at))
    .map(({ card }) => card);
}

/** The structural standings, from the first-rank power's rank (the chair's ruling, 2026-11-07). */
export const STANDING = Object.freeze({
  head: 'head',
  inner: 'inner_circle',
  member: 'member',
  unaffiliated: 'unaffiliated',
});

/**
 * The card's STRUCTURAL STANDING, from its first-rank power: rank 1 = head, 2–3 = inner circle,
 * a member ranked nowhere = member, no membership = unaffiliated.
 * @param {unknown} card @param {string[]} [powerOrder]
 * @returns {{ standing: string, power: string | null, rank: 1 | 2 | 3 | null }}
 */
export function structuralStandingOf(card, powerOrder = []) {
  const first = firstRankMembershipOf(card, powerOrder);
  if (!first) return { standing: STANDING.unaffiliated, power: null, rank: null };
  const rank = Number.isInteger(first.rank) ? first.rank : null;
  const standing = rank === 1 ? STANDING.head : (rank === 2 || rank === 3) ? STANDING.inner : STANDING.member;
  return { standing, power: first.power, rank };
}
