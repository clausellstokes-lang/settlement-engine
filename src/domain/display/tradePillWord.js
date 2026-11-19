/**
 * domain/display/tradePillWord.js — THE WORD A TRADE PILL PRINTS, ON EVERY SURFACE (SURFACES-3 item 2; the chair's
 * ruling (r3) of 2026-11-14: THE TAB'S WORD GOVERNS).
 *
 * The Economics tab's Trade Profile prints an export as the list carries it ("River fish") and an import through the
 * native-resource label seam (`resourceDisplayName.js`, §934.22 item 2: a raw RESOURCE_DATA key on the imports). The
 * PDF's EXPORTS column and the journal's Exports row sent the exports through the seam as well, which re-spells a
 * trade good as the terrain resource it comes from: "River fisheries" for "River fish", "Precious metal veins" for
 * "Precious metals", "Coastal timber" for "Shipbuilding timber" (83 of the 772 births of SURFACES-1's table). The tab,
 * the PDF and the journal each print this leaf.
 *
 * Pure: no randomness, no clock, no write.
 */
import { resourceDisplayName } from './resourceDisplayName.js';

/**
 * @param {unknown} item the list's entry as printed (`tradeListDisplay.js :: tradeListsAsPrinted`)
 * @param {'exports' | 'imports'} side the list it prints on
 * @returns {string} the pill's word
 */
export function tradePillWord(item, side) {
  return side === 'imports' ? resourceDisplayName(item) : String(item ?? '');
}
