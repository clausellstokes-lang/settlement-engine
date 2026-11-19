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
 * (i) A HOUSE THAT BUYS AND WORKS ITS MATERIAL: catalogue ids, each with the one line of reason (the audit's, from the
 * catalogue's own description where it speaks) beside it.
 * @type {ReadonlySet<string>}
 */
export const BUYS_AND_WORKS = new Set([
  'blacksmith', // a forge works bought iron; ore and bar iron travel by any road
  'blacksmiths_3_10', // the same forge, more of them
  'resident_smith_part_time', // the same forge, part-time
  'specialized_metalworkers', // fine metalwork from bought metal
  'smelter', // its line: "converts raw ore … whenever ore can be had"; ore is bought from the mines
  'brewer', // brews bought malt and grain
  'brewery', // the same, larger
  'maltster', // malts bought grain
  'mill', // grinds the grain brought to it
  'mills_2_5', // the same, more of them
  'bakers_5_15', // bakes bought flour
  'alehouse', // brews or buys ale
  'butchers_3_8', // buys beasts at market
  'carpenter', // works bought planks
  'carpenter_part_time', // the same, part-time
  'carpenters_5_15', // the same, more of them
  'cooper', // staves are bought
  'woodcarver', // carves bought wood
  'shipyard', // ship timber is the classic import
  'river_boatyard', // the same, for river boats
  'bowyer_fletcher', // bow staves and shafts are bought
  'thatcher', // buys reed and straw
  'sawmill', // its line: "converts raw logs … whenever logs can be had"; logs are floated and carted to the saw
  'sawmill_commercial', // it saws logs brought to it, as the plain sawmill does
  'cobbler', // works bought leather
  'cobbler_s_guild', // the same, a guild
  'tanner_established', // buys hides from the butchers and the herds
  'tanners', // the same
  'tannery', // its line: "converts hides … whenever hides can be had"
  'furrier_s_district', // buys pelts
  'fuller', // fulls cloth woven of bought wool
  'weavers_textile_workers', // weave bought yarn and wool
  'tailor', // sews bought cloth
  'tailor_s_guild', // the same, a guild
  'dyer', // dyes bought cloth
  'ropemaker', // buys hemp and reed
  'chandler', // buys tallow and wax
  'potter', // its line: "made whenever clay can be had"; clay is carted to the wheel
  'brickmaker', // its line: "whenever clay can be had … requires clay and fuel"; clay is carted to the kilns
  'vintner', // its line: "from local grapes or imported must": it presses what reaches the cellar
  'glassblower', // its line: "when sand can be had"; sand travels by any route
  'glassmakers', // the same
  'apothecary', // buys herbs and drugs
  'alchemist_shop', // buys reagents
  'luxury_goods_quarter', // a quarter that sells what is brought
  'fish_market', // it sells the catch brought to it
  'fishmonger', // the same
]);

/**
 * (ii) A HOUSE THAT IS THE SOURCE OF ITS MATERIAL: catalogue id -> the grounds (resource keys) that give it, with the one
 * line of reason beside it. The salt works also stands on a coast (a port route or coastal terrain): the sea is its brine.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const SOURCE_GROUNDS = Object.freeze({
  charcoal_burner: Object.freeze(['managed_forest', 'mountain_timber', 'shipbuilding_timber']), // its line: "operates kilns in nearby woodland": charcoal is not burnt from bought logs
  woodcutter_s_camp: Object.freeze(['managed_forest', 'mountain_timber', 'shipbuilding_timber']), // it fells the wood it stands in
  dairy_farmer: Object.freeze(['grazing_land', 'alpine_pasture', 'fertile_floodplain', 'camel_herds']), // it keeps the herd it milks; milk does not travel and a herd grazes daily
  shepherd: Object.freeze(['grazing_land', 'alpine_pasture']), // it keeps the flock on its pasture
  stone_quarry: Object.freeze(['stone_quarry']), // its line: "the only source of proper building stone the place has had"
  mine: Object.freeze(['iron_deposits', 'precious_metals', 'gemstone_deposits', 'coal_deposits']), // it cuts the seam it stands on
  mine_open_cast: Object.freeze(['iron_deposits', 'precious_metals', 'gemstone_deposits', 'coal_deposits']), // the same, open-cast
  peat_cutter: Object.freeze(['marshlands']), // it cuts the bog it stands on
  salt_works: Object.freeze(['salt_flats', 'desert_salt']), // its line: "evaporates saline brine … where brine lies near": the brine is its ground (on a coast, the sea). BIRTH-2 (2026-11-17): the fishing grounds struck from this row (a fishery is no salt works' ground: "worked out … (Fishing grounds)." in r2s-wartime-city-1); on a coast the coast rule answers it
  fisher_s_landing: Object.freeze(['fishing_grounds', 'river_fish']), // the boats fish the water off the landing
  fishing_community: Object.freeze(['fishing_grounds', 'river_fish']), // the same
  hunter_s_lodge: Object.freeze(['hunting_grounds']), // it hunts the grounds it stands in
  wildfowler: Object.freeze(['marshlands', 'hunting_grounds']), // it hunts the marsh and the grounds
  // FAULTS-BIRTH FR23 (2) (the sixth chair's ruling, 2026-11-18; vetoable by the owner): THE COMMON IS ITS PASTURE. "Shared pasture
  // for the hamlet's livestock": where the record stores its pasture spent, it reads as every house on a spent ground of its own
  // (idle, marked short, its worked-out line). It proves no ground (not in `IMPLIED_GROUND`: it keeps one, `supplyStory.js ::
  // GROUND_KEPT_BY`) and buys nothing in (not in `RUNS_ON_BOUGHT`)
  common_grazing_land: Object.freeze(['grazing_land', 'alpine_pasture']),
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

// ─── BIRTH-2 (the chair's rulings BR4 and BR5 of 2026-11-17, the owner's rule: THE SEED PICKS THE STORY; vetoable by the
// owner) ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
// Read by the one reading of a town's grounds and of each material's story (`supplyStory.js`).

/**
 * A TAKER: a source house that takes its material from the ground itself and CANNOT BUY IN WHAT IT TAKES. On its own used-up
 * ground (stored or implied) it is worked out, whatever the town buys. Catalogue ids, each with its one line of reason.
 * @type {ReadonlySet<string>}
 */
export const TAKERS = new Set([
  'stone_quarry', // it cuts the stone of the hill it stands on: bought stone is no quarry's work
  'mine', // it cuts the seam: bought ore digs no gallery
  'mine_open_cast', // the same, open-cast
  'peat_cutter', // it cuts the bog it stands on
  'woodcutter_s_camp', // it fells the wood it stands in
  'shepherd', // it keeps a flock on its own pasture
  'fisher_s_landing', // its boats fish the water off the landing
  'fishing_community', // the same
  'hunter_s_lodge', // it hunts the grounds it stands in
  'wildfowler', // it hunts the marsh and the grounds
]);

/**
 * A SOURCE HOUSE THAT CAN RUN ON BOUGHT-IN MATERIAL: catalogue id -> the word the imports list already holds for that
 * material. Where its ground does not answer it, it follows its material's story like any buyer.
 * @type {Readonly<Record<string, string>>}
 */
export const RUNS_ON_BOUGHT = Object.freeze({
  salt_works: 'Salt', // it boils and refines salt brought to its pans ("Salt": the economy's necessity word, `economy/primaryTradeLists.js`, `economy/tradeGoods.js`)
  charcoal_burner: 'Timber', // its kilns burn cordwood carted in ("Timber": `IMPORT_WORD.timber`, above)
  dairy_farmer: 'Livestock', // it keeps beasts bought at market ("Livestock": `IMPORT_WORD.livestock`, above)
});

/**
 * THE GROUND A SOURCE HOUSE PROVES where none of its own grounds (`SOURCE_GROUNDS`) is on the record, live or spent (the
 * owner: "Doesn't the stone quary here in and of itself stipulate that there is stone in the ground?"). A reading of the
 * page, stored nowhere. The salt works proves none: off the coast its salt is bought in. FAULTS-BIRTH (the sixth chair's FR8 (a),
 * 2026-11-18; vetoable by the owner): THE SECOND RING IS READ AS THE FIRST: the six takers BIRTH-2 left (the landings, the
 * woodcutter, the hunters, the shepherd, the wildfowler) prove their ground by the same seeded pick (`SECOND_RING`, below).
 * @type {Readonly<Record<string, string>>}
 */
export const IMPLIED_GROUND = Object.freeze({
  stone_quarry: 'stone_quarry', // a quarry proves its stone
  mine: 'iron_deposits', // a mine proves its ore (the iron, the commonest seam of the catalogue)
  mine_open_cast: 'iron_deposits', // the same, open-cast
  peat_cutter: 'marshlands', // a peat cutter proves its bog
  dairy_farmer: 'grazing_land', // a dairy proves its pasture
  charcoal_burner: 'managed_forest', // a burner's kilns stand in the wood that feeds them
  // FAULTS-BIRTH (FR8 (a)): the second ring
  woodcutter_s_camp: 'managed_forest', // a camp proves the wood it fells
  shepherd: 'grazing_land', // a shepherd proves the pasture of its flock
  fisher_s_landing: 'fishing_grounds', // a landing proves the water its boats fish
  fishing_community: 'fishing_grounds', // the same
  hunter_s_lodge: 'hunting_grounds', // a lodge proves the grounds it hunts
  wildfowler: 'hunting_grounds', // a wildfowler proves the grounds it hunts (its game; the marsh's yield is reeds)
  // FAULTS-BIRTH FR24 (2) (the chair's ruling, 2026-11-18): the common proves its pasture, there for every reader (`supplyStory.js ::
  // GROUND_KEPT_BY` holds the pick there): one reading of the pasture for the land list, the input reader and the isolated buyers
  common_grazing_land: 'grazing_land',
});

/**
 * FAULTS-BIRTH (FR8 (a)): THE SECOND RING, catalogue ids: takers that prove their ground as the first ring does
 * (`IMPLIED_GROUND`) and are NEVER PICKED THE FAILED VENTURE (no venture's line was written for them: the owner's rule, no
 * new text and no new story; the venture's pick keeps the candidates it had).
 * @type {ReadonlySet<string>}
 */
export const SECOND_RING = new Set(['woodcutter_s_camp', 'shepherd', 'fisher_s_landing', 'fishing_community', 'hunter_s_lodge', 'wildfowler']);

/**
 * FAULTS-BIRTH (FR8 (b); the eighth read's r2r-hamlet-27: a dairy "failing: no livestock lies near" beside a Shepherd, Common
 * grazing land and a Stable yard): THE HOUSES THAT KEEP OR YIELD A MATERIAL OF `MATERIAL_OF` outside its users: read only when
 * the birth counts the houses of a town that use, keep or yield a material, so that no venture is picked beside its own
 * material. Catalogue ids -> the families, each with its one line of reason (the catalogue's own description).
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const KEEPS_OR_YIELDS = Object.freeze({
  shepherd: Object.freeze(['livestock']), // "Manages sheep flocks for wool and meat": it keeps the flock
  shepherd_collective: Object.freeze(['livestock', 'wool']), // "Communal flock management"
  common_grazing_land: Object.freeze(['livestock']), // "Shared pasture for the hamlet's livestock"
  stable_yard: Object.freeze(['livestock']), // "Communal stable where travelers can leave horses"
  stable_master: Object.freeze(['livestock']), // "Maintains stabling, trains horses"
  stable_district: Object.freeze(['livestock']), // "Concentrated stabling, horse trading"
  pack_animal_trader: Object.freeze(['livestock']), // "Buys and sells mules, donkeys, and draft horses"
  hunter_s_lodge: Object.freeze(['hides']), // "prepare game, and sell pelts"
});

/**
 * THE MATERIAL OF A HOUSE, by family (the town buys it or it does not: every house of one family shares the answer). The
 * family's word is `IMPORT_WORD`'s (or `RUNS_ON_BOUGHT`'s). Catalogue ids; a house of no family is outside the story.
 * @type {Readonly<Record<string, string>>}
 */
export const MATERIAL_OF = Object.freeze({
  blacksmith: 'ironOre', blacksmiths_3_10: 'ironOre', resident_smith_part_time: 'ironOre', specialized_metalworkers: 'ironOre', smelter: 'ironOre', mine: 'ironOre', mine_open_cast: 'ironOre',
  brewer: 'grain', brewery: 'grain', maltster: 'grain', mill: 'grain', mills_2_5: 'grain', bakers_5_15: 'grain',
  carpenter: 'timber', carpenter_part_time: 'timber', carpenters_5_15: 'timber', cooper: 'timber', woodcarver: 'timber', shipyard: 'timber', sawmill: 'timber', sawmill_commercial: 'timber', charcoal_burner: 'timber', woodcutter_s_camp: 'timber',
  cobbler: 'hides', cobbler_s_guild: 'hides', tanner_established: 'hides', tanners: 'hides', tannery: 'hides',
  fuller: 'wool', weavers_textile_workers: 'wool', shepherd: 'wool',
  glassmakers: 'sand', glassblower: 'sand',
  potter: 'clay', brickmaker: 'clay',
  vintner: 'grapes',
  apothecary: 'herbs', alchemist_shop: 'herbs',
  luxury_goods_quarter: 'luxury',
  fish_market: 'fish', fishmonger: 'fish', fisher_s_landing: 'fish', fishing_community: 'fish',
  dairy_farmer: 'livestock',
  stone_quarry: 'stone', peat_cutter: 'peat', salt_works: 'desertSalt',
});

/**
 * BIRTH-3 (BR6, "never a whole trade"; the second reader's M2): THE OTHER HOUSES THAT BUY AND WORK A MATERIAL OF `MATERIAL_OF`,
 * outside it (their reader answers them by their own trade): read only when the birth counts the houses of a town that use a
 * material, so that a lone dairy, burner or tanner is no failed venture beside the butcher, the bowyer or the furrier who
 * works the same material. Catalogue ids, each with its one line of reason.
 * @type {Readonly<Record<string, string>>}
 */
export const ALSO_USES = Object.freeze({
  butchers_3_8: 'livestock', // buys beasts at market
  chandler: 'livestock', // its tallow is the beasts' fat
  bowyer_fletcher: 'timber', // bow staves and shafts are wood
  river_boatyard: 'timber', // river boats are built of timber
  thatcher: 'peat', // its reed is the marsh's (the peat cutter's ground)
  furrier_s_district: 'hides', // pelts are the hides' trade
  tailor: 'wool', // sews the cloth woven of wool
  tailor_s_guild: 'wool', // the same, a guild
  dyer: 'wool', // dyes the cloth woven of wool
  alehouse: 'grain', // brews of grain
});

/**
 * THE STARTING ODDS, THE OWNER'S TO CHANGE (each "N in 60"; the seed's own hash picks, and takes no draw):
 *   groundThere  a source house where the land list holds no ground of its kind: the ground is there (else used up)
 *   boughtIn     the ground used up and the town can trade: the material is bought in (else the house stands idle)
 *   abandoned    a house that could be a failed venture (the only house of its material, which the land never had):
 *                it is one (about one town in fifty shows one; never two in a town)
 * A house that uses a material the land never had is bought in wherever the town can trade (no odds).
 */
export const SUPPLY_ODDS = Object.freeze({
  groundThere: 45, // 3 times in 4
  boughtIn: 45, // 3 times in 4
  abandoned: 3, // 1 time in 20 of the houses that could be one (calibrated over the census's 720: BIRTH-2's hand-back)
  outOf: 60,
});
