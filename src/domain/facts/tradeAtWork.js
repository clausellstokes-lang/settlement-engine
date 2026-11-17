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
 * THE GOOD A SCENE SHOWS (BAR6-SCENES, LAW 6 rule 6b, 2026-11-16; BRIEF-BAR6 seat BAR6-SCENES (a); amendment 5b: keys
 * beside the trades, vetoable by the owner, on the veto list as new vocabulary). The arrival sense pools are opened by a
 * loose match on a house's name ("Common grazing land" opens the butter scene; "Mine (open cast)" the chisels; an income
 * share "Spice" nowhere), so a line that shows a GOOD declares the good itself: `trade at work: <good>` (`GOOD_TRADES`)
 * is read from the page's own lists: a house that makes the good stands on the live roster and is not short, or the
 * economy's Produced locally or Exports name the good; a good the town buys in (`imported`: the spices) counts while
 * no siege holds the road. The chisels are the stone CUTTERS' (`cut stone`: a quarry, a mason, a stonecutter; a mine
 * digs, it does not dress stone: bar0-hamlet-calm-rand-32 printed "The chink of chisels on stone" beside "No one here
 * works the stone").
 *
 * Layer 2 (over the roster, the resources and the economy). Pure: no randomness, no clock, no write.
 * @enforced-by tests/generators/bar4ScenePresumption.test.js
 * @enforced-by tests/domain/bar6ScenesGoods.test.js
 */
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { housesShortOf } from './houseInputAtHand.js';
import { canonExports, canonImports } from '../canonicalAccessors.js';
import { crisisOf } from './crisisKind.js';

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

/**
 * BAR6-SCENES (LAW 6 rule 6b): the goods a scene shows, each with the houses that make it (`houses`, the picker's
 * word-start rule), the words the economy's lists name it by (`listed`), and whether a good bought in counts
 * (`imported`, while no siege holds the road). A good with no `listed` words is read from its houses alone.
 * @type {Readonly<Record<string, Readonly<{ houses: ReadonlyArray<string>, listed?: RegExp, imported?: boolean }>>>}
 */
export const GOOD_TRADES = Object.freeze({
  // the butter churn: a house that keeps milk animals, or a dairy good made or sold (not "Common grazing land")
  dairy: Object.freeze({ houses: Object.freeze(['dairy', 'cheese', 'cattle', 'cow', 'goat', 'herd', 'shepherd', 'livestock']), listed: /\b(dairy|butter|cheese|milk)\b/i }),
  // the loom, the dye vats and the fulling stocks: a house that makes cloth (a tailor or a draper sews or sells it)
  cloth: Object.freeze({ houses: Object.freeze(['weaver', 'weavers', 'textile', 'fuller', 'dyer']), listed: /\b(cloth|textiles?|linen|silk)\b/i }),
  // the ironwork at the forge: a smith's house with its iron (the mark "Short of iron." is the page's own)
  ironwork: Object.freeze({ houses: Object.freeze(['blacksmith', 'smith', 'smelter', 'foundry', 'armourer', 'armorer', 'weaponsmith', 'bladesmith', 'metalworker', 'specialized metalworker']) }),
  // drying herbs: a house that dries or doses them, or herbs gathered, made or sold
  herbs: Object.freeze({ houses: Object.freeze(['apothecary', 'herbalist', 'physician', 'healer']), listed: /\b(herbs?|herbal|medicinal|remed\w*)\b/i }),
  // spice in sacks and on the stalls: a spice house, spice made or sold, or spice brought in while the road is open
  spice: Object.freeze({ houses: Object.freeze(['spice']), listed: /\bspices?\b/i, imported: true }),
  // the saw and the mallet: a house that works wood (the chair's TW1: the wood trades, read through the short mark)
  woodwork: Object.freeze({ houses: Object.freeze(['carpenter', 'carpenters', 'sawmill', 'woodcutter', 'lumber', 'joiner', 'cooper', 'shipwright', 'wheelwright', 'woodcarver']) }),
  // chisels on stone: the stone's cutters (a mine digs; it does not dress stone)
  'cut stone': Object.freeze({ houses: Object.freeze(['quarry', 'stone quarry', 'mason', 'stonecutter']) }),
});

/** A word at a word start of a name (the picker's rule). @param {string} word @param {string} name */
const atWordStart = (word, name) => new RegExp(`(^|[^a-z])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(name);

/** @param {unknown} v @returns {unknown[]} */
const arr = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} x @returns {string} a list item's own words */
const itemText = (x) => (typeof x === 'string' ? x : String(/** @type {{ name?: unknown, good?: unknown, source?: unknown }} */ (x)?.name
  ?? /** @type {{ good?: unknown }} */ (x)?.good ?? /** @type {{ source?: unknown }} */ (x)?.source ?? ''));

/**
 * BAR6-SCENES: a good of `GOOD_TRADES` at work (see the header).
 * @param {object} record @param {Readonly<{ houses: ReadonlyArray<string>, listed?: RegExp, imported?: boolean }>} good
 * @returns {boolean}
 */
function goodAtWork(record, good) {
  if (good.houses.length) {
    const short = housesShortOf(record);
    const makers = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)).filter((inst) => {
      const name = String(nativeSemanticName(/** @type {object} */ (inst)) || /** @type {{ name?: unknown }} */ (inst)?.name || '').toLowerCase();
      return !name.startsWith('access to') && good.houses.some((w) => atWordStart(w, name));
    });
    if (makers.some((h) => !short.has(String(/** @type {{ name?: unknown }} */ (h)?.name ?? '')))) return true;
    // the chair's ruling TW1: where the good's houses stand and EVERY one is marked short, the page says so ("Short of iron.");
    // no list overrides the mark (the four trades' own rule: a trade reached by its words alone holds only where no house stands)
    if (makers.length) return false;
  }
  const listed = good.listed;
  // the Exports only: the record's raw Produced-locally list is not the page's (the page keeps an item only where a working
  // chain or a house makes it: bar0-hamlet-under_siege-rand-38's raw "dairy" printed as "Produced locally: (none)")
  if (listed && arr(canonExports(/** @type {Parameters<typeof canonExports>[0]} */ (record))).some((x) => listed.test(itemText(x)))) return true;
  if (listed && good.imported && !crisisOf(record).has('under_siege') && arr(canonImports(/** @type {Parameters<typeof canonImports>[0]} */ (record))).some((x) => listed.test(itemText(x)))) return true;
  return false;
}

/**
 * THE ONE READER of `trade at work: <key>`.
 * @param {unknown} record the settlement record
 * @param {string} key a trade of `TRADE_HOUSES`
 * @returns {boolean | undefined} undefined where there is no record or no such trade
 */
export function tradeAtWorkOf(record, key) {
  if (!record || typeof record !== 'object') return undefined;
  const good = Object.prototype.hasOwnProperty.call(GOOD_TRADES, key) ? /** @type {Record<string, Parameters<typeof goodAtWork>[1]>} */ (GOOD_TRADES)[key] : undefined;
  if (good) return goodAtWork(record, good); // BAR6-SCENES (6b): the good itself, from the page's own lists
  const kind =/** @type {Record<string, ReadonlyArray<string>>} */ (KILN_KINDS)[key];
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
