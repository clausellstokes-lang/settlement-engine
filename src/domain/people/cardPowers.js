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
 * THE CARD'S POWER LINE: "first of X · second of Y" ('' for a card in no power).
 * @param {unknown} card @param {string[]} [powerOrder] @returns {string}
 */
export function cardPowerLine(card, powerOrder = []) {
  return cardPowerParts(card, powerOrder).map((p) => p.label).join(' · ');
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
 * (kind 'power'), or null (a DM's person, a pre-car card).
 * @param {unknown} card @returns {{ kind: 'house' | 'power', name: string, title: string } | null}
 */
export function cardInstitutionOf(card) {
  const inst = recordOf(recordOf(card).institution);
  const kind = inst.kind === 'house' || inst.kind === 'power' ? inst.kind : null;
  const name = String(inst.key || inst.name || '');
  if (!kind || !name) return null;
  return { kind, name, title: String(inst.title || '') };
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
