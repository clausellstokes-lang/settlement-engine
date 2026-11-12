/**
 * people/cardPowers.js — THE CARD'S POWERS FOR THE SURFACES: the power line, the house, the
 * tab's grouping and the powers list, read from the card's `memberships` and `institution` and
 * from the powers (`powerStructure.factions`) — never from the shim's derived fields or the NPC
 * grouping `settlement.factions` (the people car, PEOPLE-5A DISPLAY, 2026-11-07; the chair's
 * rulings M-1b and M-2 in docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §2).
 *
 * M-1b: a representative's ROLE is its institution's title and its standing in each power is its
 * RANK there, so the card's power line reads "first of X · second of Y" and no faction role is
 * printed. Pure, draw-free, total over any input: a record with no `memberships` (a DM-authored
 * person, a pre-car save before PEOPLE-5's migration) holds no power and shows none.
 */
import { powersByRankOf, powerOrderOf, membershipsOf, holdsMembership } from './membership.js';
import { compareCodepoint } from '../deterministicSort.js';

/** @param {unknown} v @returns {Record<string, unknown>} */
const recordOf = (v) => (v && typeof v === 'object' ? /** @type {Record<string, unknown>} */ (v) : {});

/** The rank words the card line prints (M-1b: standing is rank). */
export const RANK_WORD = Object.freeze({ 1: 'first', 2: 'second', 3: 'third' });
/** The word for a membership the power ranked nowhere. */
export const UNRANKED_WORD = 'member';

/**
 * THE POWERS: `powerStructure.factions`, the only faction roster — no grouping fallback.
 * @param {unknown} settlement @returns {Record<string, unknown>[]}
 */
export function powersOf(settlement) {
  const fs = recordOf(recordOf(settlement).powerStructure).factions;
  return Array.isArray(fs) ? fs.filter((f) => f && typeof f === 'object') : [];
}

/** @param {unknown} power @returns {string} the power's name (`faction`, else `name`) */
export function powerNameOf(power) {
  const p = recordOf(power);
  return String(p.faction || p.name || '');
}

/**
 * The governing power's name (the row marked `isGoverning`, else the record's `governingName`), or null.
 * @param {unknown} settlement @returns {string | null}
 */
export function governingNameOf(settlement) {
  const row = powersOf(settlement).find((f) => f.isGoverning === true);
  const name = row ? powerNameOf(row) : String(recordOf(recordOf(settlement).powerStructure).governingName || '');
  return name || null;
}

/** @param {unknown} settlement @returns {string[]} the powers' names, roster order */
export function powerNamesOf(settlement) {
  return powersOf(settlement).map(powerNameOf).filter(Boolean);
}

/**
 * The card's powers as the surfaces print them, best rank first (ties by the powers' order):
 * `{ power, rank, word, label }` where label is "first of X" / "member of X".
 * @param {unknown} card @param {string[]} [powerOrder]
 * @returns {{ power: string, rank: 1|2|3|null, word: string, label: string }[]}
 */
export function cardPowerParts(card, powerOrder = []) {
  return powersByRankOf(card, powerOrder).map((m) => {
    const rank = Number.isInteger(m.rank) ? /** @type {1|2|3} */ (m.rank) : null;
    const word = (rank && RANK_WORD[rank]) || UNRANKED_WORD;
    return { power: m.power, rank, word, label: `${word} of ${m.power}` };
  });
}

/**
 * THE CARD'S POWER LINE: "first of X · second of Y" ('' for a card in no power). The dual-hat leader's
 * first rank in the governing power prints its office (COHERENCE-POWERS): "Reeve, first of Elected Reeve"; the
 * keeper of an empty seat its caretaker's form (COHERENCE-POWERS-3, F7: "Acting Reeve, first of Elected Reeve").
 * @param {unknown} card @param {string[]} [powerOrder] @param {string | null} [governing] the governing power's name
 * @param {boolean} [keeper] the card keeps the governing power's seat while it stands empty (seatKeeper.js :: seatKeeperOf)
 * @returns {string}
 */
export function cardPowerLine(card, powerOrder = [], governing = null, keeper = false) {
  const held = cardOfficeOf(card);
  // COHERENCE-POWERS-3 (F7): the keeper of an empty seat holds its office in the caretaker's form
  const office = held && keeper ? caretakerFormOf(held, governing) : held;
  const parts = cardPowerParts(card, powerOrder);
  const seat = office && governing ? parts.find((p) => p.power === governing && p.rank === 1) : null;
  // the office leads the line: the seat, then the card's other standings in their order
  return (seat ? [`${office}, ${seat.label}`, ...parts.filter((p) => p !== seat).map((p) => p.label)] : parts.map((p) => p.label))
    .join(' · ');
}

/** The crown's offices: an empty crown is kept by a regent (COHERENCE-POWERS-3, F7; the chair's ruling of 2026-11-12). */
const CROWN_OFFICES = Object.freeze(['King', 'Queen', 'Monarch']);
/** Titles that describe the person, not an office (the exempt small place's eldest): the acting form takes the
 *  government's own office word (the chair's refinement of 2026-11-12), never "Acting Eldest". */
const DESCRIPTIVE_TITLES = Object.freeze({
  Eldest: (/** @type {string | null} */ government) => (government === 'Household Council' ? 'Household Elder' : 'Elder'),
});

/**
 * THE CARETAKER'S FORM OF AN OFFICE (COHERENCE-POWERS-3, F7; the chair's ruling of 2026-11-12, the owner's to veto):
 * where the seat stands empty its keeper holds "Acting <the office>"; a crown's, "Regent"; a regent already keeps its
 * words. '' for no office.
 * @param {string | null | undefined} office the office or honorific as printed @param {string | null} [government]
 * @returns {string}
 */
export function caretakerFormOf(office, government = null) {
  const word = String(office || '').trim();
  if (!word) return '';
  if (CROWN_OFFICES.includes(word)) return 'Regent';
  if (/^Regent\b|^Acting\b/.test(word)) return word;
  const described = /** @type {Record<string, (g: string | null) => string>} */ (DESCRIPTIVE_TITLES)[word];
  return `Acting ${described ? described(government) : word}`;
}

/**
 * THE LEADER'S OFFICE (COHERENCE-POWERS, the dual hat): a house's face that leads the town carries the
 * office's title in its `role` beside its house's `title` (people/castPowers.js FLOOR 1); null for every
 * other card (M-1b: a face's role is its title; a minted face's and a DM's person's role is its own).
 * @param {unknown} card @returns {string | null}
 */
export function cardOfficeOf(card) {
  const c = recordOf(card);
  const inst = cardInstitutionOf(card);
  const role = String(c.role || '').trim();
  if (!inst || inst.kind !== 'house' || !role) return null;
  return role !== String(c.title || '').trim() && role !== inst.title ? role : null;
}

/**
 * THE TWO HATS, as one phrase: "the miller and Reeve" for the dual-hat leader, else the card's role
 * (the office's own face, a minted seat, a DM's person). The seat's lines read it (the Power tab's seat
 * row, the governance account).
 * @param {unknown} card @returns {string}
 */
export function cardHatsOf(card) {
  const c = recordOf(card);
  const office = cardOfficeOf(card);
  return office ? `${String(c.title || '').trim()} and ${office}` : String(c.role || '').trim();
}

/**
 * The card's FIRST-RANK power's name (its best standing), or null for a card in no power.
 * @param {unknown} card @param {string[]} [powerOrder] @returns {string | null}
 */
export function firstPowerOf(card, powerOrder = []) {
  return powersByRankOf(card, powerOrder)[0]?.power || null;
}

/**
 * Every power the card holds a membership in, best rank first.
 * @param {unknown} card @param {string[]} [powerOrder] @returns {string[]}
 */
export function cardPowerNames(card, powerOrder = []) {
  return powersByRankOf(card, powerOrder).map((m) => m.power);
}

/** True when the card holds a membership in `power` ("is this card in that power"). */
export const cardInPower = holdsMembership;

/**
 * THE CARD'S INSTITUTION: its house's name (kind 'house'), or the power it was minted from
 * (kind 'power'), or null (a DM's person, a pre-car card). `veiled` is the card's veil bit as
 * stamped at birth (FIX-PUBLIC-VEIL; true, false, or undefined on a card born before the bit).
 * @param {unknown} card @returns {{ kind: 'house' | 'power', name: string, title: string, veiled: unknown } | null}
 */
export function cardInstitutionOf(card) {
  const inst = recordOf(recordOf(card).institution);
  const kind = inst.kind === 'house' || inst.kind === 'power' ? inst.kind : null;
  const name = String(inst.key || inst.name || '');
  if (!kind || !name) return null;
  return { kind, name, title: String(inst.title || ''), veiled: inst.veiled };
}

/**
 * THE READER (the public projection's one question, FIX-PUBLIC-VEIL): a card's house as the public
 * projection reads it — 'public' (an `institution` record stamped `veiled: false`), 'veiled' (stamped
 * true, or not stamped: fail-closed), or 'none' (no record: a pre-car card, a DM's person).
 * @param {unknown} card @returns {'public' | 'veiled' | 'none'}
 */
export function cardInstitutionVeilOf(card) {
  // the card's house record as cardInstitutionOf reads it: a record of kind 'house' | 'power' with a key;
  // anything else (absent, null, a legacy string, a malformed object) is none
  const inst = cardInstitutionOf(card);
  if (!inst) return 'none';
  return inst.veiled === false ? 'public' : 'veiled';
}

/** May this card's house be named publicly? @param {unknown} card @returns {boolean} */
export function isHousePublic(card) {
  return cardInstitutionVeilOf(card) === 'public';
}

/**
 * The memberships a public house's face publishes: the entries stamped `veiled: false` (the same law
 * per entry); a hidden or criminal power's membership, or an unstamped one, is dropped; a non-array is
 * no list (undefined). Order kept.
 * @param {unknown} memberships @returns {unknown[] | undefined}
 */
export function publicMembershipsOf(memberships) {
  if (!Array.isArray(memberships)) return undefined;
  return memberships.filter((m) => !!m && typeof m === 'object' && !Array.isArray(m) && /** @type {Record<string, unknown>} */ (m).veiled === false);
}

/** @param {unknown} card @returns {string | null} the card's house (kind 'house' only) */
export function cardHouseOf(card) {
  const inst = cardInstitutionOf(card);
  return inst && inst.kind === 'house' ? inst.name : null;
}

/** The NPC tab's two groups outside the powers' own. */
export const UNRANKED_GROUP = 'Unranked members';
export const NO_POWER_GROUP = 'In no power';

/**
 * THE NPC TAB'S GROUPING: a card ranked in a power groups under its first-rank power; a card
 * holding only unranked memberships groups under UNRANKED_GROUP; a card in no power under
 * NO_POWER_GROUP. Groups ordered by the powers' order, then the two others.
 * @param {unknown[]} cards @param {unknown} settlement
 * @returns {{ key: string, power: string | null, cards: unknown[] }[]}
 */
export function groupCardsByFirstPower(cards, settlement) {
  const order = powerOrderOf(settlement);
  const roster = powerNamesOf(settlement);
  /** @type {Map<string, unknown[]>} */
  const groups = new Map();
  for (const card of Array.isArray(cards) ? cards : []) {
    const first = powersByRankOf(card, order)[0];
    const key = !first ? NO_POWER_GROUP : Number.isInteger(first.rank) ? first.power : UNRANKED_GROUP;
    if (!groups.has(key)) groups.set(key, []);
    /** @type {unknown[]} */ (groups.get(key)).push(card);
  }
  const place = (/** @type {string} */ k) => {
    if (k === UNRANKED_GROUP) return roster.length + 1;
    if (k === NO_POWER_GROUP) return roster.length + 2;
    const i = roster.indexOf(k);
    return i < 0 ? roster.length : i;
  };
  return [...groups.entries()]
    .sort(([a], [b]) => (place(a) - place(b)) || compareCodepoint(a, b))
    .map(([key, list]) => ({ key, power: key === UNRANKED_GROUP || key === NO_POWER_GROUP ? null : key, cards: list }));
}

/**
 * The faces holding a membership in `power`, in roster order (the Power tab's member count).
 * @param {unknown[]} cards @param {string} power @returns {unknown[]}
 */
export function facesInPower(cards, power) {
  return (Array.isArray(cards) ? cards : []).filter((c) => holdsMembership(c, power));
}

export { powerOrderOf, membershipsOf };

/**
 * THE HOUSE'S FACE (PEOPLE-6 LINKS, the owner's word of 2026-11-07: "a small row in each card
 * that has the name of their NPC that also acts as a link to the NPC's card"): roster row name →
 * the card that represents it (`institution.kind === 'house'`, `institution.key` the row's name).
 * A house with no face (the census's NONE, a fabric row) has no entry. ONE PERSON, ONE FACE: the
 * first card in roster order wins should a save ever carry two.
 * @param {unknown[]} cards @returns {Map<string, Record<string, unknown>>}
 */
export function facesByHouse(cards) {
  /** @type {Map<string, Record<string, unknown>>} */
  const out = new Map();
  for (const card of Array.isArray(cards) ? cards : []) {
    const name = cardHouseOf(card);
    if (name && !out.has(name)) out.set(name, recordOf(card));
  }
  return out;
}
