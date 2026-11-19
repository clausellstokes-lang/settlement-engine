/**
 * domain/people/seatKeeper.js — WHO KEEPS AN EMPTY SEAT, AS THE PAGE PRINTS IT (COHERENCE-POWERS-3, F7; REVIEW-POWERS
 * F7; the chair's ruling of 2026-11-12, the owner's to veto). Where a succession leaves the seat empty (the governing
 * power's `vacant` modifier, stressFactions.js), the first of the governing power is its CARETAKER: the card, the seat's
 * house's Connection row and the Power tab's seat row print the caretaker's form of the office
 * (cardPowers.js :: caretakerFormOf), so the three agree that no one holds the office. Read at print time: no key is
 * written, and a seat filled in play prints the office again. ENGINE-SAFE: the seat row (powerStrata.js, engine core) reads
 * it, so the keeper's honorific reads the record's own culture and nothing lazily loaded (the card's place guard,
 * cardDoor.js, is the display module's: seatKeeperDisplay.js).
 */
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { caretakerFormOf, cardOfficeOf } from './cardPowers.js';
import { honorificOfTitle } from '../../data/faceHonorifics.js';

/** @typedef {import('../rulingPower.js').RulingPowerSettlement} RulingPowerSettlement */
/** The record as the seat's readers read it. @typedef {RulingPowerSettlement & { npcs?: unknown, culturalIdentity?: { key?: string | null } | null }} KeeperSettlement */
/**
 * A card as the seat's readers read it (the fields they touch).
 * @typedef {{ id?: string, name?: string, title?: string, gender?: string, institution?: { key?: string, title?: string } | null,
 *   memberships?: ReadonlyArray<{ power?: string, rank?: number } | null | undefined> }} KeeperCard
 */

/**
 * Does the governing power's seat stand empty (its `vacant` modifier)?
 * @param {unknown} settlement @returns {boolean}
 */
export function isSeatVacant(settlement) {
  const governing = governingFactionOf(/** @type {RulingPowerSettlement | null} */ (settlement));
  return !!governing && Array.isArray(governing.modifiers) && governing.modifiers.includes('vacant');
}

/**
 * The card that keeps the empty seat: the governing power's first; null where the seat is held or none stands.
 * @param {unknown} settlement @returns {KeeperCard | null}
 */
export function seatKeeperOf(settlement) {
  if (!isSeatVacant(settlement)) return null;
  const s = /** @type {KeeperSettlement | null} */ (settlement);
  const power = nameOf(governingFactionOf(s));
  const cards = /** @type {ReadonlyArray<KeeperCard | null | undefined>} */ (Array.isArray(s?.npcs) ? s.npcs : []);
  return cards.find((card) => !!card && Array.isArray(card.memberships) && card.memberships.some((m) => m?.power === power && m?.rank === 1)) || null;
}

/** @param {unknown} settlement @returns {string | null} */
const governmentOf = (settlement) => nameOf(governingFactionOf(/** @type {RulingPowerSettlement | null} */ (settlement))) || null;

/**
 * The keeper's honorific in the caretaker's form, as all three places print it: a face whose office is its own (one
 * hat: a monarch, a steward, the eldest) takes its title's honorific (data/faceHonorifics.js, read with the record's
 * own culture) in the caretaker's form; '' for a card that is not the keeper or wears the dual hat (its office is in
 * its power line).
 * @param {unknown} card @param {unknown} settlement @returns {string}
 */
export function keeperHonorificOf(card, settlement) {
  const keeper = seatKeeperOf(settlement);
  const c = /** @type {KeeperCard} */ (card || {});
  if (!keeper || keeper.id !== c.id || cardOfficeOf(card)) return '';
  const inst = c.institution && typeof c.institution === 'object' ? c.institution : null;
  if (!inst?.title) return '';
  const culture = /** @type {KeeperSettlement | null} */ (settlement)?.culturalIdentity?.key ?? null;
  const honorific = honorificOfTitle(inst.title, c.gender, `${String(c.id || c.name || '')}::${String(inst.key || '')}`, { culture });
  return caretakerFormOf(honorific, governmentOf(settlement));
}

/**
 * THE KEEPER'S WORDS (COHERENCE-POWERS-5, N7; REVIEW-POWERS-2 at e86d069be): the caretaker's form the seat row prints
 * before the keeper's name — "Acting Burgomaster" for a dual-hat keeper (its office in the caretaker's form), else its
 * title's honorific in that form ("Regent", "Acting Steward") — so the DM block's label and the seat row agree; '' where
 * the seat is held or the keeper has neither.
 * @param {unknown} settlement @returns {string}
 */
export function keeperFormOf(settlement) {
  const keeper = seatKeeperOf(settlement);
  if (!keeper) return '';
  const office = cardOfficeOf(keeper);
  return office ? caretakerFormOf(office, governmentOf(settlement)) : keeperHonorificOf(keeper, settlement);
}

/**
 * The seat row's keeper sentence: "Acting Burgomaster Tserenpuntsag Barlas, the senior guild master, keeps the seat
 * meanwhile." / "Regent Biljana Nikolić keeps the seat meanwhile."; '' where the seat is held or no one keeps it.
 * @param {unknown} settlement @returns {string}
 */
export function seatKeeperLineOf(settlement) {
  const keeper = seatKeeperOf(settlement);
  if (!keeper) return '';
  const form = keeperFormOf(settlement);
  if (cardOfficeOf(keeper)) {
    const title = String(keeper.title || '');
    const named = title && !String(keeper.name).includes(`(${title})`) ? `${keeper.name}, ${title},` : String(keeper.name);
    return `${form} ${named} keeps the seat meanwhile.`;
  }
  return `${form ? `${form} ` : ''}${keeper.name} keeps the seat meanwhile.`;
}

/**
 * THE KEEPER, STYLED, IN ONE CALL (COHERENCE-POWERS-8, for the chair's ruling of 2026-11-13: one home for how an empty
 * seat's keeper is styled; the Tonight sheet and the conflict card read it): "Acting Burgomaster Tserenpuntsag Barlas",
 * "Regent Biljana Nikolić" — the caretaker's form the seat row prints (keeperFormOf), then the name; the bare name where
 * the keeper has no form; '' where the seat is held or no one keeps it.
 * @param {unknown} settlement @returns {string}
 */
export function seatKeeperStyledNameOf(settlement) {
  const keeper = seatKeeperOf(settlement);
  if (!keeper) return '';
  const form = keeperFormOf(settlement);
  return form ? `${form} ${String(keeper.name || '')}` : String(keeper.name || '');
}
