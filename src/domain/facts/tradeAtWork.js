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
 * short; false where every one is short. `trade at work: kilns` keeps its reading for the lines any kiln answers
 * (BAR7-SCENES, 2026-11-17: a glass furnace answers it only where no house that fires a kiln stands; `KILN_FURNACE_ONLY`).
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
 * THE SEAM (SEAM-SCENES, 2026-11-17; BRIEF-BAR6-SEAM items 2 and 9; the chair's TW1): `trade at work: leather` (the tanners:
 * "The reek of the tanning pits hangs over …" printed in r2r-town-34 where every tanner was "Short of hides.") and the cloth
 * split by its kinds (`CLOTH_KINDS`: `cloth` is cloth made, `dyed cloth` the dyer's): two keys of the existing atom, vetoable
 * by the owner, on the veto list as new vocabulary.
 *
 * THE MARK'S WORST STATE (BAR8-SCENES, BRIEF-BAR8 seat SCENES item 1, 2026-11-17; the chair's ruling BR17: two keys of the
 * existing atom, vetoable by the owner, on the veto list as new vocabulary). The atom read the SHORT mark only, so three
 * scenes printed over a trade the page itself calls stopped or thin:
 *   (a) A HOUSE THE CRISIS STOPS OR IMPAIRS IS NOT AT WORK (`houseAtWork`). The page's mark leaf is read through its own
 *       readings (`display/crisisStoppedRow.js :: rowStoppedBy`, its words `STOPPED_WORD`): a house it marks "Stopped by the
 *       siege." or "Scarce in the famine." does no work; one it marks "Curtailed by …" works what it holds (K's `.mild`
 *       lines, "the clang of iron … carries", stay true there); a house it leaves bare under a siege, every chain of which the
 *       page prints Impaired (`display/chainStateShown.js :: chainStateShown`), does no work ("Stalls sell reagents in
 *       stoppered jars" beside a Wizard's tower whose every reagent chain was Impaired under the siege:
 *       bar0-city-under_siege+famine-rand-47, the seventh read's C5157).
 *   (b) `trade at work: <trade> in full` (`IN_FULL`): the trade is at work AND no house of it carries any mark of the leaf
 *       (`rowMarkText`: no crisis mark, no short mark). The boom scenes declare it ("running day and night", "racks of new
 *       ironwork … waiting for the carts", "never quite stops", "hangs over everything" printed over smiths every one
 *       "Curtailed by the war."/"… siege.": bar0-city-wartime-rand-45, C7246 and C7242). The mild scenes keep the plain key.
 *   (c) `trade at work: fish taken here` (`FISH_TAKEN_HERE`): a TAKER of fish (`houseKinds.js :: TAKERS`: a landing, a
 *       fishing community) is at work on a live ground (`supplyStory.js :: sourceStoryOf`, its story `local`); where no
 *       taker stands, no fish ground of the town is used up (`supplyStory.js :: usedGroundOf`). The fish market answers the
 *       plain key (it sells fish) but takes none: "Racks of drying fish line the way in" and "Half of … seems to be gutting,
 *       salting or selling fish." printed where the river fishery was exhausted and salted fish was bought in
 *       (bar0-town-occupied-rand-45, bar0-metropolis-calm-rand-45: C36591, C19722).
 *
 * Layer 2 (over the roster, the resources and the economy). Pure: no randomness, no clock, no write.
 * @enforced-by tests/generators/bar8Scenes.test.js
 * @enforced-by tests/generators/bar4ScenePresumption.test.js
 * @enforced-by tests/domain/bar6ScenesGoods.test.js
 * @enforced-by tests/generators/bar7Scenes.test.js
 */
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { housesShortOf } from './houseInputAtHand.js';
import { canonExports, canonImports } from '../canonicalAccessors.js';
import { crisisOf } from './crisisKind.js';
import { rowMarkText, rowStoppedBy, STOPPED_WORD } from '../display/crisisStoppedRow.js'; // BAR8-SCENES (item 1): the mark's worst state, through the leaf's own readings
import { chainStateShown } from '../display/chainStateShown.js'; // BAR8-SCENES (item 1): the chain card's state, the page's own word
import { GROUND_YIELD, idOfHouse, sourceStoryOf, usedGroundOf } from './supplyStory.js'; // BAR8-SCENES (item 1c): the fish story
import { SOURCE_GROUNDS, TAKERS } from './houseKinds.js';
import { resourceShortageImport } from '../resourceSemantics.js';

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
  // the loom, the fulling stocks and bolts of new cloth: a house that MAKES cloth (a tailor or a draper sews or sells it;
  // a dyer colours it: SEAM-SCENES item 9, 2026-11-17, below)
  cloth: Object.freeze({ houses: Object.freeze(['weaver', 'weavers', 'textile', 'fuller']), listed: /\b(cloth|textiles?|linen|silk)\b/i }),
  // SEAM-SCENES (item 9, 2026-11-17): the dye vats and cloth dyed: a dyer's house (the cloth trade's other kind, `CLOTH_KINDS`)
  'dyed cloth': Object.freeze({ houses: Object.freeze(['dyer']) }),
  // the ironwork at the forge: a smith's house with its iron (the mark "Short of iron." is the page's own). SEAM-SCENES (item 3,
  // 2026-11-17): a smelter MAKES the iron, it does not work it: "The hammering of the forges echoes through all of Anba." printed
  // where the Blacksmiths and the Specialized metalworkers were both "Short of iron." and only the Smelter was not (r2r-metropolis-20,
  // r2s-famine-city-3, r2s-insurgency-city-1 of the 720); the smith's own atom (`institution: smith`) does not count a smelter either
  ironwork: Object.freeze({ houses: Object.freeze(['blacksmith', 'smith', 'foundry', 'armourer', 'armorer', 'weaponsmith', 'bladesmith', 'metalworker', 'specialized metalworker']) }),
  // drying herbs: a house that dries or doses them, or herbs gathered, made or sold
  herbs: Object.freeze({ houses: Object.freeze(['apothecary', 'herbalist', 'physician', 'healer']), listed: /\b(herbs?|herbal|medicinal|remed\w*)\b/i }),
  // spice in sacks and on the stalls: a spice house, spice made or sold, or spice brought in while the road is open
  spice: Object.freeze({ houses: Object.freeze(['spice']), listed: /\bspices?\b/i, imported: true }),
  // the saw and the mallet: a house that works wood (the chair's TW1: the wood trades, read through the short mark)
  woodwork: Object.freeze({ houses: Object.freeze(['carpenter', 'carpenters', 'sawmill', 'woodcutter', 'lumber', 'joiner', 'cooper', 'shipwright', 'wheelwright', 'woodcarver']) }),
  // chisels on stone: the stone's cutters (a mine digs; it does not dress stone)
  'cut stone': Object.freeze({ houses: Object.freeze(['quarry', 'stone quarry', 'mason', 'stonecutter']) }),
  // SEAM-SCENES (item 2, 2026-11-17; the chair's TW1): the tanning pits at work: a tanner's or a leatherworker's house with its
  // hides (the page's own "Short of hides."), or leather on the Exports (a saddler or a furrier sews or sells it)
  leather: Object.freeze({ houses: Object.freeze(['tanner', 'tannery', 'tanners', 'leatherwork']), listed: /\bleather\b/i }),
});

/**
 * SEAM-SCENES (item 9, 2026-11-17; in the form of BAR5-THINGS's `KILN_KINDS`): the cloth trade's houses by what they do to
 * the cloth, each a part of the cloth sense's house words (`ARRIVAL_SENSES` cloth `institutions`, less the tailor, the
 * clothier and the draper, who sew and sell it): `trade at work: cloth` is cloth MADE (a weaver, a textile house, a fuller
 * not short: the loom, the fulling stocks, bolts of new cloth) and `trade at work: dyed cloth` is cloth DYED (a dyer: the
 * dye vats, the stained hands). A dyer answers only a line that shows dyeing: "Bolts of cloth hang drying in long bright
 * strips across the yards." printed where the weavers and the fuller were both "Short of wool." and a dyer alone worked
 * (bar0-city-wartime-rand-33, bar0-city-under_siege+famine-rand-35, bar0-metropolis-calm-rand-35). Pinned to `GOOD_TRADES`.
 */
export const CLOTH_KINDS = Object.freeze({
  cloth: GOOD_TRADES.cloth.houses,
  'dyed cloth': GOOD_TRADES['dyed cloth'].houses,
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
    if (makers.some((h) => houseAtWork(record, h, short))) return true; // BAR8-SCENES (item 1a): not short, stopped or impaired
    // the chair's ruling TW1: where the good's houses stand and EVERY one is marked short (BAR8-SCENES: or stopped, or impaired
    // under the siege), the page says so ("Short of iron.");
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
  if (key === FISH_TAKEN_HERE) return fishTakenHere(record); // BAR8-SCENES (item 1c)
  if (typeof key === 'string' && key.endsWith(IN_FULL)) return tradeInFullOf(record, key.slice(0, -IN_FULL.length)); // BAR8-SCENES (item 1b)
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
  // BAR7-SCENES (item 1, 2026-11-17): the generic `kilns` key answers by a house that FIRES A KILN; a glass furnace answers
  // only where no other kiln house stands (`KILN_FURNACE_ONLY`, below)
  const answering = key === 'kilns' ? kilnHousesAnswering(houses) : houses;
  return answering.some((h) => houseAtWork(record, h, short)); // BAR8-SCENES (item 1a): not short, stopped or impaired
}

/**
 * BAR7-SCENES (BRIEF-BAR7 seat BAR7-SCENES item 1, 2026-11-17; LAW 8 rule 8k.trade beyond the seam). "The kilns are lit all
 * through the day, and the heat of them is in every lane." (`trade at work: kilns`) printed in bar0-metropolis-calm-rand-32,
 * whose Potter, Brickmaker and Charcoal burner were all "Short of …": the generic key DID read the short mark (the brief's
 * premise, measured, is false there), and the house that answered it was the Glassmakers, whose furnace is not the town's
 * kilns. The generic key now reads the kiln houses as its kinds do: where a house that fires a kiln stands (a kind's, or a
 * lime burner's), those houses answer it, read through `housesShortOf`; a glass house answers it only where it is the only
 * kiln house of the town (then its furnace is the trade the sense was opened by, as before). The glass words are a part of
 * `TRADE_HOUSES.kilns` (pinned by the guard, `tests/generators/bar7Scenes.test.js`).
 */
export const KILN_FURNACE_ONLY = Object.freeze(['glassblower', 'glassmaker', 'glassmakers']);

/** @param {ReadonlyArray<unknown>} houses the kiln trade's houses on the live roster @returns {ReadonlyArray<unknown>} */
function kilnHousesAnswering(houses) {
  const nameOf = (/** @type {unknown} */ inst) => String(nativeSemanticName(/** @type {object} */ (inst)) || /** @type {{ name?: unknown }} */ (inst)?.name || '').toLowerCase();
  const firing = houses.filter((h) => TRADE_HOUSES.kilns.some((w) => !KILN_FURNACE_ONLY.includes(w) && atWordStart(w, nameOf(h))));
  return firing.length ? firing : houses;
}

/** BAR8-SCENES (item 1a): the leaf's words (`STOPPED_WORD`) under which a house does no work; "curtailed" works what it holds. */
const NO_WORK_WORDS = Object.freeze(['stopped', 'scarce']);

/** @param {unknown} inst @returns {string} */
const rosterName = (inst) => String(/** @type {{ name?: unknown }} */ (inst)?.name ?? '');

/**
 * BAR8-SCENES (item 1a): IS THIS HOUSE AT WORK? Not marked short (the one fact, `housesShortOf`); not stopped or scarce by the
 * crisis (the leaf's `rowStoppedBy`, its word `STOPPED_WORD`); and, where the leaf leaves it bare under a siege, not a house
 * every chain of which the page prints Impaired (`impairedUnderSiege`).
 * @param {object} record @param {unknown} house a row of the live roster @param {{ has: (name: string) => boolean }} short the houses marked short (`housesShortOf`)
 * @returns {boolean}
 */
function houseAtWork(record, house, short) {
  if (short.has(rosterName(house))) return false;
  const kind = rowStoppedBy(record, 'house', /** @type {Record<string, unknown>} */ (house));
  if (kind) return !NO_WORK_WORDS.includes(/** @type {Record<string, string>} */ (STOPPED_WORD)[kind] ?? '');
  return !impairedUnderSiege(record, house);
}

/**
 * BAR8-SCENES (item 1a): under a siege, a house that runs at least one chain of the record and every one of them the page's
 * chain card prints Impaired (`chainStateShown`). Outside a siege a chain's Impaired is the trade's own state, not a stop.
 * @param {object} record @param {unknown} house @returns {boolean}
 */
function impairedUnderSiege(record, house) {
  if (!crisisOf(record).has('under_siege')) return false;
  const name = rosterName(house);
  const chains = arr(/** @type {{ economicState?: { activeChains?: unknown } | null }} */ (record).economicState?.activeChains)
    .filter((c) => !!c && typeof c === 'object' && arr(/** @type {{ processingInstitutions?: unknown }} */ (c).processingInstitutions).includes(name));
  return chains.length > 0 && chains.every((c) => chainStateShown(c, record) === 'impaired');
}

/** BAR8-SCENES (item 1b; BR17): the key's suffix that asks for the trade IN FULL: no house of it carries any mark. */
export const IN_FULL = ' in full';

/**
 * BAR8-SCENES (item 1b): the houses of a trade key, as its reading above takes them (a good's makers, a kiln kind's or a
 * trade's houses).
 * @param {object} record @param {string} key @returns {ReadonlyArray<unknown>}
 */
function housesOfKey(record, key) {
  const good = Object.prototype.hasOwnProperty.call(GOOD_TRADES, key) ? /** @type {Record<string, { houses: ReadonlyArray<string> }>} */ (GOOD_TRADES)[key] : undefined;
  const words = good ? good.houses : (/** @type {Record<string, ReadonlyArray<string>>} */ (KILN_KINDS)[key] ?? /** @type {Record<string, ReadonlyArray<string>>} */ (TRADE_HOUSES)[key] ?? []);
  return liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)).filter((inst) => {
    const name = String(nativeSemanticName(/** @type {object} */ (inst)) || /** @type {{ name?: unknown }} */ (inst)?.name || '').toLowerCase();
    return !(good && name.startsWith('access to')) && words.some((w) => atWordStart(w, name));
  });
}

/**
 * BAR8-SCENES (item 1b): `trade at work: <key> in full`: the trade at work, and no house of it marked by the leaf
 * (`rowMarkText`: a crisis mark or a short mark) nor impaired under the siege.
 * @param {object} record @param {string} key @returns {boolean | undefined}
 */
function tradeInFullOf(record, key) {
  const atWork = tradeAtWorkOf(record, key);
  if (atWork !== true) return atWork;
  const short = housesShortOf(record);
  return housesOfKey(record, key).every((h) => houseAtWork(record, h, short) && rowMarkText(record, 'house', /** @type {Record<string, unknown>} */ (h)) === null);
}

/** BAR8-SCENES (item 1c; BR17): the fish story's key: a taker of fish at work on a live ground. */
export const FISH_TAKEN_HERE = 'fish taken here';

/** @param {string} id a catalogue id @returns {boolean} a house that takes fish from its own water (`TAKERS`, a ground that yields fish) */
const takesFish = (id) => TAKERS.has(id) && (/** @type {Record<string, ReadonlyArray<string>>} */ (SOURCE_GROUNDS)[id] ?? []).some((g) => GROUND_YIELD[g] === 'fish');

/**
 * BAR8-SCENES (item 1c): `trade at work: fish taken here`. The plain key holds (a fish house at work), and the fish is taken
 * here: a taker at work whose story is `local` (or tells none, where no fish ground of the town is used up); where no taker
 * stands, no fish ground of the town is used up (the market sells a catch of the town's own water).
 * @param {object} record @returns {boolean | undefined}
 */
function fishTakenHere(record) {
  const atWork = tradeAtWorkOf(record, 'fish');
  if (atWork !== true) return atWork;
  const story = /** @type {Parameters<typeof usedGroundOf>[0]} */ (record);
  const used = usedGroundOf(story, 'fish');
  const takers = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)).filter((h) => takesFish(idOfHouse(/** @type {{ catalogId?: unknown, name?: unknown }} */ (h))));
  if (takers.length === 0) return !used;
  const short = housesShortOf(record);
  return takers.some((h) => {
    if (!houseAtWork(record, h, short)) return false;
    const told = sourceStoryOf(story, /** @type {{ name?: unknown, catalogId?: unknown }} */ (h), resourceShortageImport)?.story;
    return told === 'local' || (told == null && !used);
  });
}
