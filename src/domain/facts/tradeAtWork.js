/**
 * domain/facts/tradeAtWork.js — A TRADE THE SCENE SHOWS IS AT WORK (BAR4-SCENES-2, kind A1's `house at work` remainder,
 * 2026-11-16; the chair's ruling HW1 of 12:26 UTC; BRIEF-BAR4 amendment 5b: an atom beside its family, vetoable by the
 * owner, on the veto list as new vocabulary).
 *
 *   tradeAtWorkOf(record, key)   `trade at work: <key>`: some house of the arrival sense's trade stands on the live roster
 *                                and is not short (`houseInputAtHand.js :: housesShortOf`, THE ONE FACT "this house is
 *                                short", which the page's own mark reads: "Short of fish.", "Short of clay."). A town whose
 *                                trade is reached by its export words alone (no such house) holds it. "Half of Bellanovum
 *                                seems to be gutting, salting or selling fish." printed where the only fish house is
 *                                "Short of fish." (r2r-hamlet-10; 16 towns of the census's 720 and 11 of the fresh 300 at
 *                                f19c3b28b, with the crisis marks the scene's lines declare by their crises).
 *
 * TRADE_HOUSES is the arrival picker's own house words for the four trades whose houses the record can call short
 * (`data/arrivalProse.js :: ARRIVAL_SENSES[].institutions`), copied so that the fact (eager) does not carry the arrival
 * pool; the guard pins the copy to the pool, word for word (`tests/generators/bar4ScenePresumption.test.js`). A house is of
 * the trade where one of its words starts a word of the house's native name (the picker's rule,
 * `narrative/arrivalScene.js :: anyAtWordStart`).
 *
 * TWO THINGS FOR ONE WORD (BAR5-THINGS, LAW 4 "the kilns", 2026-11-16; BRIEF-BAR5 seat BAR5-THINGS (d)): a charcoal burner's
 * kilns answered `trade at work: kilns`, and the scene "Kiln smoke hangs over …, and the dust of fired clay is on
 * everything" printed in a hamlet whose only kiln house burns charcoal (REVIEW-BAR-5 C15951). The kiln trade is split by
 * what its kilns fire (`KILN_KINDS`, each a part of the kilns' house words): `trade at work: clay kilns` (a potter or a
 * brickmaker) and `trade at work: charcoal kilns` (a charcoal burner). A kind's atom is UNANSWERED (undefined: a draw door
 * refuses both its `needs` and its `excludes`) where no house of that kind stands, so neither a kind's line nor its twin
 * ("no fresh pots", "the clamps stand cold") prints in a town that has no such house; true where one stands and is not
 * short; false where every one is short. `trade at work: kilns` keeps its reading for the lines any kiln answers.
 *
 * Layer 2 (over the roster, the resources and the economy). Pure: no randomness, no clock, no write.
 * @enforced-by tests/generators/bar4ScenePresumption.test.js
 */
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { housesShortOf } from './houseInputAtHand.js';

/** The arrival picker's house words, by trade (a copy of `ARRIVAL_SENSES[].institutions`, pinned). */
export const TRADE_HOUSES = Object.freeze({
  fish: Object.freeze(['fish market', 'fishmonger', 'fishing', 'fisher', 'fishers']),
  kilns: Object.freeze(['potter', 'pottery', 'kiln', 'brickmaker', 'charcoal', 'glassblower', 'glassmaker', 'glassmakers', 'lime']),
  stone: Object.freeze(['quarry', 'stone quarry', 'mason', 'mine', 'mines', 'stonecutter']),
  arcane: Object.freeze(['mage', 'mages', 'wizard', 'arcane', 'alchemist', 'alchemy', 'enchanter', 'enchanting', 'sorcer', 'magelight', 'spellcast']),
});

/** BAR5-THINGS (LAW 4 "the kilns"): the kiln trade's kinds, by what the kilns fire (each a part of `TRADE_HOUSES.kilns`, pinned). */
export const KILN_KINDS = Object.freeze({
  'clay kilns': Object.freeze(['potter', 'pottery', 'kiln', 'brickmaker']),
  'charcoal kilns': Object.freeze(['charcoal']),
});

/** A word at a word start of a name (the picker's rule). @param {string} word @param {string} name */
const atWordStart = (word, name) => new RegExp(`(^|[^a-z])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(name);

/**
 * THE ONE READER of `trade at work: <key>`.
 * @param {unknown} record the settlement record
 * @param {string} key a trade of `TRADE_HOUSES`
 * @returns {boolean | undefined} undefined where there is no record or no such trade
 */
export function tradeAtWorkOf(record, key) {
  if (!record || typeof record !== 'object') return undefined;
  const kind = /** @type {Record<string, ReadonlyArray<string>>} */ (KILN_KINDS)[key];
  const words = kind ?? /** @type {Record<string, ReadonlyArray<string>>} */ (TRADE_HOUSES)[key];
  if (!words) return undefined;
  const houses = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)).filter((inst) => {
    const name = String(nativeSemanticName(/** @type {object} */ (inst)) || /** @type {{ name?: unknown }} */ (inst)?.name || '').toLowerCase();
    return words.some((w) => atWordStart(w, name));
  });
  if (houses.length === 0) return kind ? undefined : true; // BAR5-THINGS: a kiln kind no house of which stands is unanswered
  const short = housesShortOf(record);
  return houses.some((h) => !short.has(String(/** @type {{ name?: unknown }} */ (h)?.name ?? '')));
}
