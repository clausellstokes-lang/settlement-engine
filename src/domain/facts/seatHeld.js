/**
 * domain/facts/seatHeld.js — THE SEAT A PAIR ALREADY HOLDS (BAR6-PEOPLE, LAW 10 rule 10d-seat; BRIEF-BAR6 fact (d), amendment
 * B6; vetoable by the owner; on the veto list as new vocabulary). A tie line in which one card asks for a seat on the
 * council presumes that card holds none: "Tlachtga O'Meara has asked for a seat on the council as a condition of the next
 * loan" printed where she sits, unveiled, on the Merchant City Council that governs (the wide read's C66115; 6 towns of the
 * census's 720). The asker of such a line is the pair's card that is not the government's own (the debtor is the
 * government's: `npcData.js :: STRESS_ECONOMIC_EFFECTS.gov_econ_dependence`, whose ends are the government's card and the
 * economy's).
 *
 *   pairSeatHeld(record, pair)   THE ONE READER of the atom `seat held`: whether a card of the pair `[from, to]` that is
 *                                not of the government's category holds an unveiled membership of the governing power;
 *                                each card read as the record's own card of that id when the record holds a roster, else
 *                                as handed (a birth in progress); `undefined` when the pair is not two cards (fail-closed)
 *
 * The governing power is the record's: its name as the birth hands it (`powerStructure.government`), else the governing
 * faction (`rulingPower.js :: governingFactionOf`). No governing power: no seat is held (false).
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar6PeopleLaw10.test.js
 */
import { governingFactionOf, nameOf } from '../rulingPower.js';

/** @typedef {{ id?: unknown, category?: unknown, memberships?: unknown }} SeatCard */

/** @param {unknown} record @returns {string} */
function governingNameOf(record) {
  const ps = /** @type {{ powerStructure?: { government?: unknown } } | null} */ (record)?.powerStructure;
  if (typeof ps?.government === 'string' && ps.government.trim()) return ps.government.trim();
  return nameOf(governingFactionOf(/** @type {import('../rulingPower.js').RulingPowerSettlement} */ (record)));
}

/**
 * @param {{ npcs?: unknown, powerStructure?: unknown } | null | undefined} record
 * @param {unknown} pair the two cards the line names, `[from, to]`
 * @returns {boolean | undefined}
 */
export function pairSeatHeld(record, pair) {
  if (!Array.isArray(pair) || pair.length !== 2) return undefined;
  const roster = Array.isArray(record?.npcs) ? /** @type {Array<SeatCard | null | undefined>} */ (record.npcs) : null;
  /** @param {unknown} card @returns {SeatCard | null} */
  const cardOf = (card) => {
    if (!card || typeof card !== 'object') return null;
    const id = /** @type {{ id?: unknown }} */ (card).id;
    const held = roster && id != null ? roster.find((n) => n && String(n.id) === String(id)) : null;
    return held || /** @type {SeatCard} */ (card);
  };
  const cards = [cardOf(pair[0]), cardOf(pair[1])];
  if (!cards[0] || !cards[1]) return undefined;
  const governing = governingNameOf(record);
  if (!governing) return false;
  return cards.some((c) => c && c.category !== 'government' && Array.isArray(c.memberships)
    && c.memberships.some((/** @type {{ power?: unknown, veiled?: unknown } | null} */ m) => m && String(m.power || '') === governing && m.veiled !== true));
}
