/**
 * domain/facts/houseKinds.js — THE KIND OF A HOUSE BY WHAT IT DOES WITH ITS MATERIAL (BIRTH-1, the chair's ruling BR2 of
 * 2026-11-17 on the audit BIRTH-AUDIT's table `out/q2.table.md`; THE OWNER'S TABLE: strike a row and the house leaves the
 * rule; vetoable by the owner). Catalogue ids.
 *
 *   (i)  BUYS_AND_WORKS   a house that buys its material and works it (a potter and clay, a fuller and wool, a smith and
 *                         iron, a vintner and grapes). Where nothing here answers its input and a connected road no siege
 *                         shuts reaches the town, the input is BROUGHT IN: the birth writes it on the imports list
 *                         (`resourceGenerator.js :: importsBroughtAtBirth`), in the list's own words (IMPORT_WORD).
 *   (ii) SOURCE_GROUNDS   a house that IS the source of its material (a stone quarry, a charcoal burner, a dairy farmer, a
 *                         salt works, the mines and landings), with the grounds that give it. AN IMPORT FEEDS A BUYER,
 *                         NEVER THE WORK ON THE GROUND (`houseInputAtHand.js`). On a coast the sea is the salt works' brine.
 *   (iii) every other house: as before (the route houses and markets, the stores and walls, the commons, the services).
 *
 * An import-free leaf (EG1: the eager facts read it; it reaches no module the build pins lazy). Pure data.
 *
 * @enforced-by tests/domain/birthKindsLaw.test.js
 */

/**
 * (i) A HOUSE THAT BUYS AND WORKS ITS MATERIAL: catalogue id -> the one line of reason (the audit's, from the catalogue's
 * own description where it speaks).
 * @type {Readonly<Record<string, string>>}
 */
export const BUYS_AND_WORKS_REASONS = Object.freeze({
  blacksmith: 'a forge works bought iron; ore and bar iron travel by any road',
  blacksmiths_3_10: 'the same forge, more of them',
  resident_smith_part_time: 'the same forge, part-time',
  specialized_metalworkers: 'fine metalwork from bought metal',
  smelter: 'its line: "converts raw ore … whenever ore can be had"; ore is bought from the mines',
  brewer: 'brews bought malt and grain',
  brewery: 'the same, larger',
  maltster: 'malts bought grain',
  mill: 'grinds the grain brought to it',
  mills_2_5: 'the same, more of them',
  bakers_5_15: 'bakes bought flour',
  alehouse: 'brews or buys ale',
  butchers_3_8: 'buys beasts at market',
  carpenter: 'works bought planks',
  carpenter_part_time: 'the same, part-time',
  carpenters_5_15: 'the same, more of them',
  cooper: 'staves are bought',
  woodcarver: 'carves bought wood',
  shipyard: 'ship timber is the classic import',
  river_boatyard: 'the same, for river boats',
  bowyer_fletcher: 'bow staves and shafts are bought',
  thatcher: 'buys reed and straw',
  sawmill: 'its line: "converts raw logs … whenever logs can be had"; logs are floated and carted to the saw',
  sawmill_commercial: 'it saws logs brought to it, as the plain sawmill does',
  cobbler: 'works bought leather',
  cobbler_s_guild: 'the same, a guild',
  tanner_established: 'buys hides from the butchers and the herds',
  tanners: 'the same',
  tannery: 'its line: "converts hides … whenever hides can be had"',
  furrier_s_district: 'buys pelts',
  fuller: 'fulls cloth woven of bought wool',
  weavers_textile_workers: 'weave bought yarn and wool',
  tailor: 'sews bought cloth',
  tailor_s_guild: 'the same, a guild',
  dyer: 'dyes bought cloth',
  ropemaker: 'buys hemp and reed',
  chandler: 'buys tallow and wax',
  potter: 'its line: "made whenever clay can be had"; clay is carted to the wheel',
  brickmaker: 'its line: "whenever clay can be had … requires clay and fuel"; clay is carted to the kilns',
  vintner: 'its line: "from local grapes or imported must": it presses what reaches the cellar',
  glassblower: 'its line: "when sand can be had"; sand travels by any route',
  glassmakers: 'the same',
  apothecary: 'buys herbs and drugs',
  alchemist_shop: 'buys reagents',
  luxury_goods_quarter: 'a quarter that sells what is brought',
  fish_market: 'it sells the catch brought to it',
  fishmonger: 'the same',
});

/** (i) the ids. @type {ReadonlySet<string>} */
export const BUYS_AND_WORKS = new Set(Object.keys(BUYS_AND_WORKS_REASONS));

/**
 * (ii) A HOUSE THAT IS THE SOURCE OF ITS MATERIAL: catalogue id -> the grounds (resource keys) that give it, and the one
 * line of reason. The salt works also stands on a coast (a port route or coastal terrain): the sea is its brine.
 * @type {Readonly<Record<string, Readonly<{ grounds: ReadonlyArray<string>, reason: string }>>>}
 */
export const SOURCE_GROUNDS = Object.freeze({
  charcoal_burner: Object.freeze({ grounds: Object.freeze(['managed_forest', 'mountain_timber', 'shipbuilding_timber']), reason: 'its line: "operates kilns in nearby woodland": charcoal is not burnt from bought logs' }),
  woodcutter_s_camp: Object.freeze({ grounds: Object.freeze(['managed_forest', 'mountain_timber', 'shipbuilding_timber']), reason: 'it fells the wood it stands in' }),
  dairy_farmer: Object.freeze({ grounds: Object.freeze(['grazing_land', 'alpine_pasture', 'fertile_floodplain', 'camel_herds']), reason: 'it keeps the herd it milks; milk does not travel and a herd grazes daily' }),
  shepherd: Object.freeze({ grounds: Object.freeze(['grazing_land', 'alpine_pasture']), reason: 'it keeps the flock on its pasture' }),
  stone_quarry: Object.freeze({ grounds: Object.freeze(['stone_quarry']), reason: 'its line: "the only source of proper building stone the place has had"' }),
  mine: Object.freeze({ grounds: Object.freeze(['iron_deposits', 'precious_metals', 'gemstone_deposits', 'coal_deposits']), reason: 'it cuts the seam it stands on' }),
  mine_open_cast: Object.freeze({ grounds: Object.freeze(['iron_deposits', 'precious_metals', 'gemstone_deposits', 'coal_deposits']), reason: 'the same, open-cast' }),
  peat_cutter: Object.freeze({ grounds: Object.freeze(['marshlands']), reason: 'it cuts the bog it stands on' }),
  salt_works: Object.freeze({ grounds: Object.freeze(['salt_flats', 'desert_salt', 'fishing_grounds']), reason: 'its line: "evaporates saline brine … where brine lies near": the brine is its ground (on a coast, the sea)' }),
  fisher_s_landing: Object.freeze({ grounds: Object.freeze(['fishing_grounds', 'river_fish']), reason: 'the boats fish the water off the landing' }),
  fishing_community: Object.freeze({ grounds: Object.freeze(['fishing_grounds', 'river_fish']), reason: 'the same' }),
  hunter_s_lodge: Object.freeze({ grounds: Object.freeze(['hunting_grounds']), reason: 'it hunts the grounds it stands in' }),
  wildfowler: Object.freeze({ grounds: Object.freeze(['marshlands', 'hunting_grounds']), reason: 'it hunts the marsh and the grounds' }),
});

/** Whether a catalogue id is a house that is the source of its material. @param {unknown} id @returns {boolean} */
export const isSourceHouse = (id) => typeof id === 'string' && Object.prototype.hasOwnProperty.call(SOURCE_GROUNDS, id);

/**
 * THE IMPORTS LIST'S OWN WORDS for the good of a chain key (`houseInputAtHand.js :: CHAIN_INPUTS`), or of the luxury
 * trade (`crisisDependence.js :: HOUSE_TRADE_INPUT`'s `luxury`): what the birth writes where a house of kind (i) has its
 * material brought in. Each word is read back by the one reader of an input as importing that good by its own name.
 * @type {Readonly<Record<string, string>>}
 */
export const IMPORT_WORD = Object.freeze({
  wool: 'Wool', // the fuller's and the weavers' wool
  alpineWool: 'Wool', // the same wool, off the high pasture
  timber: 'Timber', // the carpenter's planks, the cooper's staves, the sawmill's logs
  mountainTimber: 'Timber', // the same timber, off the mountain
  ironOre: 'Iron ore', // the list's own word (`computeActiveChains.js :: UPSTREAM_IMPORT_LABELS`): the smith's and the smelter's iron
  copperOre: 'Copper ore', // the copper chain's own name of its ore
  preciousMetals: 'Precious metals and bullion', // the list's own word for bought gold and silver
  hides: 'Raw hides and animal products', // the list's own word: the tanner's and the cobbler's hides
  grain: 'Grain', // the crises' own necessity word, the miller's and the brewer's grain
  clay: 'Clay and raw materials', // the list's own word: the potter's and the brickmaker's clay
  grapes: 'Grapes and must', // the vintner's line: "from local grapes or imported must"
  livestock: 'Livestock', // the butcher's beasts
  sand: 'Glass sand', // the glassmakers' sand
  desertGlass: 'Glass sand', // the same sand, off the desert
  herbs: 'Medicinal herbs', // the crises' own necessity word, the apothecary's herbs
  fish: 'Salted fish', // the shortage list's own word, the fish market's catch
  luxury: 'Luxury goods', // the luxury goods quarter: the goods its own need line names
});

/** The words the birth writes for the buyers (`IMPORT_WORD`'s values): bought for a buyer, they feed no source house. @type {ReadonlySet<string>} */
export const BUYER_IMPORT_WORDS = new Set(Object.values(IMPORT_WORD));
