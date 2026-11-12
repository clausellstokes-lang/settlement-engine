/**
 * domain/people/seatKeeperDisplay.js — the card's honorific row and the seat's house's Connection row as the page prints
 * them (COHERENCE-POWERS-3, F7). The display half of seatKeeper.js: it reads the card's place guard (cardDoor.js), which
 * the engine core never imports.
 */
import { caretakerFormOf, cardOfficeOf } from './cardPowers.js';
import { cardHonorificOf, faceNameOf } from './cardDoor.js';
import { keeperHonorificOf, seatKeeperOf } from './seatKeeper.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { OFFICE_WORDS } from '../../data/officeTitles.js';

/** @param {unknown} settlement @returns {string | null} */
const governmentOf = (settlement) => nameOf(/** @type {any} */ (governingFactionOf(/** @type {any} */ (settlement)))) || null;

/**
 * The card's honorific row as the page prints it: the keeper of an empty seat whose office is its own face's prints
 * the caretaker's form (seatKeeper.js :: keeperHonorificOf, the same words as the seat row); the dual-hat leader whose
 * house's honorific is an office's title, its house's own words (F10); every other card its house's honorific
 * (cardDoor.js).
 * @param {unknown} card @param {unknown} settlement @param {unknown} [place] the place whose coast and culture pick the pool
 * @returns {string}
 */
export function shownHonorificOf(card, settlement, place = settlement) {
  const keeper = keeperHonorificOf(card, settlement);
  if (keeper) return keeper;
  const honorific = cardHonorificOf(card, place);
  // COHERENCE-POWERS-3 (F10): the dual-hat leader's card composes the two hats as the seat row does ("the boat-headman
  // and Elder"): where its house's honorific is itself an office's title ("Headman"), the row prints the house's own
  // words ("Boat-headman"), never a second office beside the one held
  if (honorific && cardOfficeOf(card) && OFFICE_WORDS.includes(honorific)) {
    const title = String(/** @type {any} */ (card)?.title || '').replace(/^(the|a|an)\s+/i, '').trim();
    if (title) return title.charAt(0).toUpperCase() + title.slice(1);
  }
  return honorific;
}

/**
 * THE SEAT'S HOUSE'S CONNECTION ROW, its name and its tail: the dual-hat leader names both hats ("Reeve Egilbert
 * Neumann" + ", the miller"), any other face its honorific and name; the keeper of an empty seat its caretaker's form.
 * The tail never repeats a title the name already carries (a disambiguated name, "Gebhard Schneider (the exchange
 * master)").
 * @param {Record<string, any>} face @param {unknown} settlement @param {boolean} seatFaced the face is the seat
 * holder's, not the house's own @returns {{ name: string, tail: string }}
 */
export function connectionOf(face, settlement, seatFaced) {
  const keeper = seatKeeperOf(settlement);
  const keeps = !!keeper && keeper.id === face?.id;
  if (seatFaced) {
    const office = cardOfficeOf(face);
    const shown = keeps ? caretakerFormOf(office, governmentOf(settlement)) : office;
    const title = String(face?.title || '');
    return { name: `${shown} ${face.name}`, tail: title && !String(face.name).includes(`(${title})`) ? `, ${title}` : '' };
  }
  if (!keeps) return { name: faceNameOf(face, settlement), tail: '' };
  const honorific = keeperHonorificOf(face, settlement);
  return { name: honorific ? `${honorific} ${face.name}` : String(face?.name || ''), tail: '' };
}

