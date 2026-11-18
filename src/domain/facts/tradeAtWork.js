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
 *   (a) A HOUSE THE SIEGE IMPAIRS IS NOT AT WORK (`houseAtWork`): under a siege, a house the crisis table declares no
 *       dependence for (`data/crisisDependence.js :: houseDependenceOf`: the mark leaf can give it no mark, so the chain card
 *       is its only state) whose every chain the record stores Impaired does no work ("Stalls sell reagents in stoppered
 *       jars" beside a Wizard's tower whose every reagent chain was Impaired under the siege: bar0-city-under_siege+famine-
 *       rand-47, the seventh read's C5157). A house the table declares keeps the leaf's reading (its "Curtailed by …" works
 *       what it holds: K's `.mild` lines stay true). The leaf itself (`display/crisisStoppedRow.js`) is NOT imported here: it
 *       is a display leaf, and a static edge to it from this lazy home pulls it, `tradeListDisplay.js` and
 *       `validationOnPage.js` into the eager engine-core and closes a cycle through `factsOf.js`
 *       (`tests/architecture/engineCoreLazyEdge.test.js`, `factHomesLazy.test.js`, `layerBoundaries.test.js`, measured).
 *   (b) `trade at work: ironwork in full` (`IN_FULL`): the ironwork at work, no smiths' house short, and the crisis takes none
 *       of the smiths' iron: the iron is at hand (`ironAtHand.js`: worked here, or brought in past no siege: the leaf's
 *       "Curtailed by the siege." of a house on an imported input) and the war takes no iron (the iron hook's own predicate
 *       under a war in force, `warIronHook.js :: warHoldsIron`, as `warReach.js :: warTakesOf` reads it for the leaf's WM1
 *       "Curtailed by the war."; `warReach.js` itself is not imported: generator-reached, it would ride engine-core and import
 *       the lazily pinned `crisisKind.js`, measured by `tests/architecture/engineCoreLazyEdge.test.js`). The boom scenes declare it ("running day and night", "racks of new
 *       ironwork … waiting for the carts", "never quite stops", "hangs over everything" printed over smiths every one
 *       "Curtailed by the war."/"… siege.": bar0-city-wartime-rand-45, C7246 and C7242). The mild scenes keep the plain key.
 *   (c) `trade at work: fish taken here` (`FISH_TAKEN_HERE`): a TAKER of fish (`houseKinds.js :: TAKERS`: a landing, a
 *       fishing community) is at work on a live ground (`supplyStory.js :: sourceStoryOf`, its story `local`); where no
 *       taker stands, no fish ground of the town is used up (`supplyStory.js :: usedGroundOf`). The fish market answers the
 *       plain key (it sells fish) but takes none: "Racks of drying fish line the way in" and "Half of … seems to be gutting,
 *       salting or selling fish." printed where the river fishery was exhausted and salted fish was bought in
 *       (bar0-town-occupied-rand-45, bar0-metropolis-calm-rand-45: C36591, C19722).
 *
 * THE PAGE'S STOP AND THE CARD'S STATE (FAULTS-WATCH item 4, 2026-11-18; BR25 (5), left by name by SCENES: nothing printed
 * falsely in the 900, a fact's reading made true). Two readings of `houseAtWork` disagreed with the page; (a) is cured:
 *   (a) A HOUSE THE SIEGE STOPS IS NOT AT WORK (`houseStoppedBySiege`, exported for its guard): the atom answered "at work"
 *       for a house whose rows read "Stopped by the siege." (55 house-trade pairs in the 900 at the base: fish markets,
 *       fisher's landings, fishing communities, stone quarries). The page's mark (`display/crisisStoppedRow.js :: rowStoppedBy`, kind 'house') cannot
 *       be imported here (the header's (a) says why), so its verdict for a house is STATED HERE in the table's own words, in
 *       the form of `catchStopped.js`: the house's dependence (`houseDependenceOf`; GATES held where the record keeps its work
 *       beyond the gates, `GATES_WORK_HELD_BY_RECORD`, as the leaf's SV8b reads it) meets what the siege stops (travellers,
 *       goods, the gates; the herds where none are kept), and no row of its own goes on (SV7: a row the table declares free of
 *       what stops its house, or a siege twin on offer). The guard `tests/generators/faultsWatch.test.js` holds this verdict
 *       EQUAL to the page's on every house of its besieged towns (and the seat measured it equal on all 2,348 besieged houses
 *       of the 900): a change to the leaf's stop reds it. "Curtailed by the siege." is not a stop: it works what it holds.
 *   (b) CURED (LAST-DECLARE item 3, the chair's ruling LR5, 2026-11-18): `impairedUnderSiege` reads the chain status the
 *       card SHOWS (`chainCrisisStateShown`, moved whole into this module and re-exported by `display/chainStateShown.js`),
 *       no longer the stored one (before: the Dyer's textile chains, an Enchanter's shop's magical goods; 5 house-trade
 *       pairs in the 900, the stored "running" printed "impaired"). The rule lives here, not in the display leaf, because
 *       the static edge would put that leaf in engine-core beside its two lazily pinned imports (`crisisKind.js`,
 *       `institutions.js`: `tests/architecture/engineCoreLazyEdge.test.js`, measured); see the block above
 *       `chainCrisisStateShown` below. (Comment corrected at the last close, LASTCLOSE-DOORS: it still said "the STORED".)
 *
 * Layer 2 (over the roster, the resources and the economy). Pure: no randomness, no clock, no write.
 * @enforced-by tests/generators/bar8Scenes.test.js
 * @enforced-by tests/generators/faultsWatch.test.js
 * @enforced-by tests/generators/bar4ScenePresumption.test.js
 * @enforced-by tests/domain/bar6ScenesGoods.test.js
 * @enforced-by tests/generators/bar7Scenes.test.js
 */
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { housesShortOf } from './houseInputAtHand.js';
import { canonExports, canonImports } from '../canonicalAccessors.js';
import { crisisOf } from './crisisKind.js';
import { houseDependenceOf } from '../../data/crisisDependence.js'; // BAR8-SCENES (item 1a): the dependence table's own reader (the lazy table houseInputAtHand.js reads)
import { FIELD_WORK, GATES, GATES_WORK_HELD_BY_RECORD, GOODS, IMPORTED_INPUT, LIVESTOCK, SERVICE_DEPENDENCE, SERVICE_FREE_OF_HOUSE, SIEGE_TWINS_ON_OFFER, TRAVELLERS } from '../../data/crisisDependence.js'; // FAULTS-WATCH item 4 (a): the siege's stop, in the table's own words
import { ironAtHandOf } from './ironAtHand.js'; // BAR8-SCENES (item 1b): the iron the smiths work, the siege's reading
import { warHoldsIron } from './warIronHook.js'; // BAR8-SCENES (item 1b): the war's hold on the iron, the iron hook's own predicate (EG1: import-free)
import { GROUND_YIELD, idOfHouse, sourceStoryOf, usedGroundOf } from './supplyStory.js'; // BAR8-SCENES (item 1c): the fish story
import { SOURCE_GROUNDS, TAKERS } from './houseKinds.js';
import { chainCarrierOf } from './chainCarrier.js'; // LAST-DECLARE item 3 (LR5): the chain's crisis state lives here (below)
import { ACCESS_ONLY, liveInstitutionNames } from './institutions.js'; // LAST-DECLARE item 3 (LR5)
import { catalogIdForName } from '../../data/institutionalCatalog.js'; // BAR8-DESKS-2 (BR34): the building houses, by catalogue id

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
 * BAR8-DESKS-2 (2026-11-18; the chair's ruling BR34, new vocabulary: vetoable by the owner, on the veto list by name):
 * `trade at work: building`: a house whose OWN SERVICE is building (walls, houses, roofs) stands on the live roster and is
 * not short (`housesShortOf`, the one fact the page's mark reads); FALSE, not unanswered, where none stands or every one is
 * short. "In {settlement} the old buildings are patched and kept standing, and nothing new goes up." (DS-ECO-8 POOR v3)
 * printed beside a card that "knows every new wall going up" (K's 15e: bar0-city-wartime-rand-38, whose Carpenters (5-15)
 * do "Building construction"). THE HOUSES ARE TAKEN BY CATALOGUE ID, never by a name pattern (the stamped `catalogId`, or
 * the catalogue's own exact lookup of the house's name, as `catchStopped.js` joins). Read from the catalogue's own
 * services (`data/institutionServices.js`) and descriptions (`data/institutionalCatalog.js`):
 *   IN   carpenter_part_time  "Simple construction: Sheds, fences, and basic structures."
 *        carpenter            "Builds houses, carts, furniture." ("Building repairs: … patch roofs …")
 *        carpenters_5_15      "Building construction: Framing, roofing, flooring, and internal fitting-out of structures."
 *        thatcher             "Roof repair and construction." ("Thatching: Apply and maintain reed or straw thatch roofing.")
 *        golem_workforce      "Construction work: Tireless construction assistants."
 *        brickmaker           "Moulds and fires clay bricks for construction … Enables more permanent buildings." (the
 *                             first of the chair's three; its services are "Fired brick", "Roof tiles", "Drainage pipe",
 *                             so by the ruling's rule on suppliers it would be left: IT IS IN, by name and vetoable,
 *                             because its own card is the line's contradiction: "Talks about who is building what and
 *                             where; knows every new wall going up." beside v3 in bar0-town-occupied-rand-47, whose only
 *                             house of the trade is the brickmaker)
 *   LEFT (each SUPPLIES material, or builds no building, or keeps an office): potter ("Fired brick"), stone_quarry ("Cut stone"), sawmill and sawmill_commercial ("Lumber
 *        milling"), ropemaker, glassmakers ("Window glass"); shipyard and river_boatyard (vessels); town_council and
 *        city_administration ("Public works: Walls, wells, roads, and the watch": an office's charge, not a trade at work);
 *        town_hall (permits), workhouse (pauper labour; its services are textiles and vagrancy), banking_district (loans).
 *        No catalogue house is a mason's or a stonecutter's (those are words of `TRADE_HOUSES.stone`, not ids).
 */
export const BUILDING_HOUSE_IDS = Object.freeze(['carpenter_part_time', 'carpenter', 'carpenters_5_15', 'thatcher', 'golem_workforce', 'brickmaker']);

/** @param {object} record @returns {boolean} */
function buildingAtWork(record) {
  const builders = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)).filter((inst) => {
    const i = /** @type {{ catalogId?: unknown, name?: unknown }} */ (inst);
    const id = String((typeof i?.catalogId === 'string' && i.catalogId) || catalogIdForName(String(i?.name ?? '')) || '');
    return BUILDING_HOUSE_IDS.includes(id);
  });
  if (builders.length === 0) return false;
  const short = housesShortOf(record);
  return builders.some((h) => !short.has(String(/** @type {{ name?: unknown }} */ (h)?.name ?? '')));
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
  if (key === 'building') return buildingAtWork(record); // BAR8-DESKS-2 (BR34): a building house at work, by catalogue id
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

/** @param {unknown} inst @returns {string} */
const rosterName = (inst) => String(/** @type {{ name?: unknown }} */ (inst)?.name ?? '');

/**
 * BAR8-SCENES (item 1a): IS THIS HOUSE AT WORK? Not marked short (the one fact, `housesShortOf`), not a house the siege
 * impairs (`impairedUnderSiege`), and (FAULTS-WATCH item 4 (a)) not a house the siege stops (`houseStoppedBySiege`).
 * @param {object} record @param {unknown} house a row of the live roster @param {{ has: (name: string) => boolean }} short the houses marked short (`housesShortOf`)
 * @returns {boolean}
 */
function houseAtWork(record, house, short) {
  return !short.has(rosterName(house)) && !impairedUnderSiege(record, house) && !houseStoppedBySiege(record, house);
}

/** @param {unknown} row @returns {boolean} */
const isCustomRow = (row) => {
  const r = /** @type {{ custom?: unknown, source?: unknown, isCustom?: unknown } | null} */ (row);
  return r?.custom === true || r?.source === 'custom' || r?.isCustom === true;
};
/** @param {Readonly<Record<string, unknown>>} table @param {string} key @returns {boolean} */
const has = (table, key) => Object.prototype.hasOwnProperty.call(table, key);

/**
 * FAULTS-WATCH item 4 (a): no herds are kept here (the food ledger's pastoral chain off, no livestock among the food
 * sources, and no house of the town's own herds stands), so the siege stops what lives on them (the leaf's `noHerdsHere`).
 * @param {object} record @returns {boolean}
 */
function noHerdsHere(record) {
  const food = /** @type {{ economicState?: { foodSecurity?: { chains?: Record<string, unknown> | null, foodRecord?: { foodSources?: unknown } | null } | null } | null }} */ (record).economicState?.foodSecurity;
  const sources = food?.foodRecord?.foodSources;
  if (!(Array.isArray(sources) && !sources.includes('livestock') && food?.chains?.['Pastoral & livestock'] === false)) return false;
  return !liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record))
    .some((h) => h && typeof h.name === 'string' && !isCustomRow(h) && houseDependenceOf(h).includes(LIVESTOCK) && houseDependenceOf(h).includes(FIELD_WORK));
}

/**
 * FAULTS-WATCH item 4 (a): THE PAGE'S "Stopped by the siege." OF A HOUSE, stated in the table's own words (see the header).
 * @param {object} record the settlement record @param {unknown} house a row of the live roster @returns {boolean}
 */
export function houseStoppedBySiege(record, house) {
  if (!crisisOf(record).has('under_siege') || isCustomRow(house)) return false;
  const h = /** @type {{ catalogId?: unknown, name?: unknown }} */ (house);
  const name = rosterName(house);
  const id = idOfHouse(h);
  let deps = houseDependenceOf(h);
  const rule = id && has(GATES_WORK_HELD_BY_RECORD, id) ? GATES_WORK_HELD_BY_RECORD[/** @type {keyof typeof GATES_WORK_HELD_BY_RECORD} */ (id)] : null;
  if (rule && deps.includes(GATES)) {
    const s = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { foodSources?: unknown } | null } | null, activeChains?: unknown } | null }} */ (record);
    const r = /** @type {{ foodSource?: string, waterGrounds?: ReadonlyArray<string> }} */ (rule);
    const held = (!!r.foodSource && arr(s.economicState?.foodSecurity?.foodRecord?.foodSources).includes(r.foodSource))
      || (!!r.waterGrounds && arr(s.economicState?.activeChains).some((c) => !!c && typeof c === 'object'
        && (r.waterGrounds ?? []).includes(String(/** @type {{ resourceKey?: unknown }} */ (c).resourceKey))
        && arr(/** @type {{ processingInstitutions?: unknown }} */ (c).processingInstitutions).includes(name)));
    if (held) deps = deps.filter((d) => d !== GATES); // SV8b: the work beyond the gates goes on, curtailed or open
  }
  const stops = noHerdsHere(record) ? [TRAVELLERS, GOODS, GATES, LIVESTOCK] : [TRAVELLERS, GOODS, GATES];
  const hit = deps.filter((d) => stops.includes(d));
  if (hit.length === 0) return false;
  // SV7: a row of its own that goes on makes the house "Curtailed by the siege.", not stopped
  const free = id && has(SERVICE_FREE_OF_HOUSE, id) ? /** @type {Record<string, ReadonlyArray<string>>} */ (SERVICE_FREE_OF_HOUSE[/** @type {keyof typeof SERVICE_FREE_OF_HOUSE} */ (id)]) : {};
  const ownDeps = (/** @type {string} */ n) => (has(SERVICE_DEPENDENCE, n) ? /** @type {Record<string, ReadonlyArray<string>>} */ (SERVICE_DEPENDENCE)[n] : []);
  const services = /** @type {{ availableServices?: unknown }} */ (record).availableServices;
  const rows = Object.values(services && typeof services === 'object' ? services : {}).flatMap((v) => arr(v))
    .filter((row) => !!row && typeof row === 'object' && /** @type {{ institution?: unknown }} */ (row).institution === name && !isCustomRow(row));
  const goesOn = rows.some((row) => {
    const { name: n, desc } = /** @type {{ name?: unknown, desc?: unknown }} */ (row);
    if (typeof desc === 'string' && SIEGE_TWINS_ON_OFFER.includes(desc)) return true;
    const key = String(n ?? '');
    return has(free, key) && hit.every((d) => free[key].includes(d)) && !ownDeps(key).some((d) => stops.includes(d) || d === FIELD_WORK || d === IMPORTED_INPUT);
  });
  return !goesOn;
}

/**
 * BAR8-SCENES (item 1a): under a siege, a house the crisis table declares no dependence for, that runs at least one chain of
 * the record and every one of them the chain card SHOWS Impaired (`chainCrisisStateShown`, below: LAST-DECLARE item 3, LR5;
 * the stored status read here before, while the card printed the shown one).
 * @param {object} record @param {unknown} house @returns {boolean}
 */
function impairedUnderSiege(record, house) {
  if (!crisisOf(record).has('under_siege')) return false;
  if (houseDependenceOf(/** @type {{ catalogId?: unknown, name?: unknown }} */ (house)).length > 0) return false;
  const name = rosterName(house);
  const chains = arr(/** @type {{ economicState?: { activeChains?: unknown } | null }} */ (record).economicState?.activeChains)
    .filter((c) => !!c && typeof c === 'object' && arr(/** @type {{ processingInstitutions?: unknown }} */ (c).processingInstitutions).includes(name));
  return chains.length > 0 && chains.every((c) => chainCrisisStateShown(c, record) === 'impaired'); // LAST-DECLARE item 3 (LR5): the status the card SHOWS
}

/** BAR8-SCENES (item 1b; BR17): the key's suffix that asks for the trade IN FULL (answered for the ironwork). */
export const IN_FULL = ' in full';

/**
 * BAR8-SCENES (item 1b): `trade at work: ironwork in full` (see the header); unanswered for any other trade.
 * @param {object} record @param {string} key @returns {boolean | undefined}
 */
function tradeInFullOf(record, key) {
  if (key !== 'ironwork') return undefined;
  const atWork = tradeAtWorkOf(record, key);
  if (atWork !== true) return atWork;
  const short = housesShortOf(record);
  const smiths = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)).filter((inst) => {
    const name = String(nativeSemanticName(/** @type {object} */ (inst)) || /** @type {{ name?: unknown }} */ (inst)?.name || '').toLowerCase();
    return !name.startsWith('access to') && GOOD_TRADES.ironwork.houses.some((w) => atWordStart(w, name));
  });
  return smiths.every((h) => !short.has(rosterName(h))) && ironAtHandOf(record) === true && !warTakesIron(record);
}

/**
 * BAR8-SCENES (item 1b): the war in force holds the smiths' iron (`warReach.js :: warTakesOf`'s iron, by the same predicate
 * over the same kept fields). @param {object} record @returns {boolean}
 */
function warTakesIron(record) {
  if (!crisisOf(record).has('wartime')) return false;
  const v = /** @type {{ economicViability?: { dependencies?: unknown } | null, economicState?: { primaryImports?: unknown } | null }} */ (record);
  return warHoldsIron(arr(v.economicViability?.dependencies), arr(v.economicState?.primaryImports), 'at war');
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
    // a taker's used-up ground is idle by its kind (`sourceStoryOf`'s TAKERS arm), so no shortage word is ever asked of it
    const told = sourceStoryOf(story, /** @type {{ name?: unknown, catalogId?: unknown }} */ (h), () => '')?.story;
    return told === 'local' || (told == null && !used);
  });
}

// ── THE CHAIN'S CRISIS STATE (LAST-DECLARE item 3, the chair's ruling LR5, 2026-11-18; FAULTS-WATCH's 4b). Moved WHOLE, unchanged,
// from `display/chainStateShown.js`, which imports it back and re-exports it: ONE rule, read by the chain card and by
// `impairedUnderSiege` above, so the atom reads the status the card prints, not the stored one. It lives in this fact module
// because this module is already pinned lazy (vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN) beside the two lazily pinned modules
// the rule reads (`crisisKind.js`, `institutions.js`); importing the display module instead put it in eager engine-core
// (`tests/architecture/engineCoreLazyEdge.test.js`, measured red). Only `chainCarrier.js` (import-free) joins engine-core. ──
/** The state a card prints as nothing: no chip (W2-C-LEAVES-4 item 1). */
export const NO_STATE_SHOWN = '';

/** The ground each food source of the food record is grown, grazed, fished or hunted on (`generators/foodLand.js`). */
export const FOOD_SOURCE_GROUND = Object.freeze({
  grain: Object.freeze(['grain_fields', 'fertile_floodplain']),
  livestock: Object.freeze(['grazing_land']),
  fish: Object.freeze(['fishing_grounds', 'river_fish']),
  mill: Object.freeze(['river_mills']),
  game: Object.freeze(['hunting_grounds']),
});

/** The states a card prints as working. */
export const SHOWN_WORKING = new Set(['running', 'operational', 'entrepot']);

/**
 * @param {unknown} chain one of `economicState.activeChains`
 * @param {unknown} record the settlement record
 * @returns {string} the state a crisis leaves (a key of the flow card's status table); the card prints `chainStateShown`
 */
export function chainCrisisStateShown(chain, record) {
  const c = chain && typeof chain === 'object'
    ? /** @type {{ status?: unknown, resourceInputKey?: unknown, entrepot?: unknown, needKey?: unknown }} */ (chain)
    : {};
  const status = String(c.status ?? '');
  if (!SHOWN_WORKING.has(status) || !record || typeof record !== 'object') return status;
  const crisis = crisisOf(/** @type {object} */ (record));
  const carrier = chainCarrierOf(chain, record).kind;
  if (crisis.has('famine')) {
    const failed = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { failedSource?: unknown } | null } | null } | null }} */ (record)
      .economicState?.foodSecurity?.foodRecord?.failedSource;
    const ground = typeof failed === 'string' ? FOOD_SOURCE_GROUND[/** @type {keyof typeof FOOD_SOURCE_GROUND} */ (failed)] : undefined;
    if (carrier === 'own' && ground && ground.includes(String(c.resourceInputKey))) return 'impaired';
  }
  if (tradeStoppedHere(record) && c.needKey !== 'criminal_economy') {
    const fieldWork = carrier === 'own' && typeof c.resourceInputKey === 'string' && c.resourceInputKey !== '' && !seaOpenTo(c.resourceInputKey, record);
    const trade = c.entrepot === true || c.needKey === 'trade_entrepot' || carrier === 'transit' || carrier === 'bought';
    if (fieldWork || trade) return 'impaired';
    if (runsOnlyThroughAccess(chain, record)) return NO_STATE_SHOWN;
  }
  return status;
}

/**
 * THE SEA A LAND SIEGE DOES NOT TAKE (W2-C-LEAVES-4 item 1): a port's sea grounds (`SEA_GROUNDS`, the catalogue's
 * "water" grounds off the coast) lie outside no wall the siege holds; the record's own exports go out "by the naval
 * route only" (`computeActiveChains.js :: deriveExportsFromChains`). A river's fish is the land's.
 * @param {string} ground @param {unknown} record
 * @returns {boolean}
 */
function seaOpenTo(ground, record) {
  const access = /** @type {{ economicState?: { tradeAccess?: unknown } | null }} */ (record).economicState?.tradeAccess;
  return SEA_GROUNDS.has(ground) && access === 'port';
}
/** The sea grounds (`data/goods/identity.js :: RESOURCE_DATA`, kind "water", off the coast). */
const SEA_GROUNDS = new Set(['fishing_grounds', 'deep_harbour']);

/**
 * WHETHER A CHAIN'S ONLY HOUSE IS A NEIGHBOUR'S (W2-C-LEAVES-4 item 1): each of its houses is met on the live roster
 * only by an "Access to ..." row, by the flow card's own reading of a house as present (the house's first word in a
 * roster name, `SupplyChainsPanel.jsx :: chainFlowFacts`), and at least one is met so.
 * @param {unknown} chain @param {unknown} record
 * @returns {boolean}
 */
export function runsOnlyThroughAccess(chain, record) {
  const houses = chain && typeof chain === 'object' && Array.isArray(/** @type {{ processingInstitutions?: unknown }} */ (chain).processingInstitutions)
    ? /** @type {ReadonlyArray<unknown>} */ (/** @type {{ processingInstitutions: unknown[] }} */ (chain).processingInstitutions) : [];
  const roster = liveInstitutionNames(/** @type {Parameters<typeof liveInstitutionNames>[0]} */ (record)).map((n) => n.toLowerCase());
  const heads = houses.map((h) => String(h).toLowerCase().split(/[\s(]/)[0]).filter(Boolean);
  const met = (/** @type {boolean} */ access) => heads.some((w) => roster.some((n) => ACCESS_ONLY.test(n) === access && n.includes(w)));
  return heads.length > 0 && met(true) && !met(false);
}

/**
 * WHETHER TRADE COMES IN AT ALL (W2-C-LEAVES-3, #169): a siege in force stops field work and trade (the siege's own
 * record line, `data/stressTypes.js :: STRESS_TYPE_MAP.under_siege.viabilityNote`, printed on the page). The one home
 * the chain cards and the Economics tab's Imports list read.
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function tradeStoppedHere(record) {
  return !!record && typeof record === 'object' && crisisOf(/** @type {object} */ (record)).has('under_siege');
}
