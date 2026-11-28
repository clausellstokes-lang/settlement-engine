// BIRTH-AUDIT Q2 · THE KIND OF EACH HOUSE the fact can mark short (catalogue id -> kind, reason). THE OWNER'S TO VETO.
//   (i)   BUYS AND WORKS its material: it could stand in any town a road reaches.
//   (ii)  IS THE SOURCE of its material and stands on it: `grounds` are the resource keys of the record
//         (`config.nearbyResources`) that give its material; `coast: true` where the sea itself gives it.
//   (iii) other, named.
// Every id of `HOUSE_TRADE_INPUT`, every house `RESOURCE_CHAINS` names that has a catalogue id, `SPENT_GROUND_WORKERS`,
// `GROUNDS_WORKED_OFF_CHAIN`, and every id the census's 720, the 150 and the fresh 300 saw marked at cfc2b680a.
export const KINDS = Object.freeze({
  // the smiths and the metal trades: iron bars and ore are carted and shipped everywhere
  blacksmith: ['i', 'iron', 'a forge works bought iron; ore and bar iron travel by any road'],
  blacksmiths_3_10: ['i', 'iron', 'the same forge, more of them'],
  resident_smith_part_time: ['i', 'iron', 'the same forge, part-time'],
  specialized_metalworkers: ['i', 'iron', 'fine metalwork from bought metal'],
  smelter: ['i', 'ore', 'its catalogue line: "converts raw ore … whenever ore can be had"; ore is bought from the mines'],
  // the grain trades
  brewer: ['i', 'grain', 'brews bought malt and grain'], brewery: ['i', 'grain', 'the same, larger'], maltster: ['i', 'grain', 'malts bought grain'],
  mill: ['i', 'grain', 'grinds the grain brought to it'], mills_2_5: ['i', 'grain', 'the same, more of them'], bakers_5_15: ['i', 'grain', 'bakes bought flour'],
  alehouse: ['i', 'grain', 'brews or buys ale'], town_granary: ['iii', 'grain', 'a store: it holds what is brought, it works nothing'],
  butchers_3_8: ['i', 'livestock', 'buys beasts at market'],
  access_to_external_mill: ['iii', 'grain', 'not a house: the right to use a neighbour\'s mill; the grain is the town\'s own fields'],
  subsistence_farming: ['iii', 'land', 'not a workshop: the households\' own plots, which every settled place has (the spent-ground reading marks it on a chain it is listed on)'],
  // the wood trades
  carpenter: ['i', 'timber', 'works bought planks'], carpenter_part_time: ['i', 'timber', 'the same, part-time'], carpenters_5_15: ['i', 'timber', 'the same, more of them'],
  cooper: ['i', 'timber', 'staves are bought'], woodcarver: ['i', 'timber', 'carves bought wood'], shipyard: ['i', 'timber', 'ship timber is the classic import'],
  river_boatyard: ['i', 'timber', 'the same, for river boats'], bowyer_fletcher: ['i', 'timber', 'bow staves and shafts are bought'], thatcher: ['i', 'reeds', 'buys reed and straw'],
  sawmill: ['i', 'timber', 'its line: "converts raw logs … whenever logs can be had"; logs are floated and carted to the saw'],
  sawmill_commercial: ['i', 'timber', 'its line: "a town near timber can supply …": it saws logs brought to it, as the plain sawmill does'],
  charcoal_burner: ['ii', 'wood', 'its line: "operates kilns in nearby woodland": the burner works in the wood; charcoal is not burnt from bought logs', ['managed_forest', 'mountain_timber', 'shipbuilding_timber']],
  woodcutter_s_camp: ['ii', 'wood', 'it fells the wood it stands in', ['managed_forest', 'mountain_timber', 'shipbuilding_timber']],
  // the leather and cloth trades
  cobbler: ['i', 'hides', 'works bought leather'], cobbler_s_guild: ['i', 'hides', 'the same, a guild'],
  tanner_established: ['i', 'hides', 'buys hides from the butchers and the herds'], tanners: ['i', 'hides', 'the same'], tannery: ['i', 'hides', 'its line: "converts hides … whenever hides can be had"'],
  furrier_s_district: ['i', 'furs', 'buys pelts'],
  fuller: ['i', 'wool', 'fulls cloth woven of bought wool'], weavers_textile_workers: ['i', 'wool', 'weave bought yarn and wool'],
  tailor: ['i', 'cloth', 'sews bought cloth'], tailor_s_guild: ['i', 'cloth', 'the same, a guild'], dyer: ['i', 'cloth', 'dyes bought cloth'], ropemaker: ['i', 'fibre', 'buys hemp and reed'],
  chandler: ['i', 'tallow and wax', 'buys tallow and wax'],
  // the clay trades
  potter: ['i', 'clay', 'its line: "made whenever clay can be had"; clay is carted to the wheel ("Clay and raw materials" is the imports list\'s own word)'],
  brickmaker: ['i', 'clay', 'its line: "whenever clay can be had … requires clay and fuel"; clay is the commonest subsoil and is carted to the kilns'],
  craft_guilds_5_15: ['iii', 'materials', 'a guild of many trades: no one material'],
  // drink and glass
  vintner: ['i', 'grapes', 'its line: "from local grapes or imported must": it presses what reaches the cellar'],
  glassblower: ['i', 'glass sand', 'its line: "when sand can be had"; sand travels by any route (TAIL-DEFECON-R M-V)'], glassmakers: ['i', 'glass sand', 'the same'],
  // the remedies
  apothecary: ['i', 'herbs', 'buys herbs and drugs'], alchemist_shop: ['i', 'reagents', 'buys reagents'], midwife: ['iii', 'herbs', 'a service: herbs are a sideline of her work, not her material'],
  // the luxury trade
  luxury_goods_quarter: ['i', 'luxury goods', 'a quarter that sells what is brought'],
  // the herds
  dairy_farmer: ['ii', 'livestock', 'it keeps the herd it milks; milk does not travel and a herd grazes daily', ['grazing_land', 'alpine_pasture', 'fertile_floodplain', 'camel_herds']],
  shepherd: ['ii', 'livestock', 'it keeps the flock on its pasture', ['grazing_land', 'alpine_pasture']],
  common_grazing_land: ['iii', 'pasture', 'not a workshop: the commons is itself the pasture (the spent-ground reading marks it where the grazing is spent)'],
  stable_master: ['iii', 'livestock', 'a service on bought horses: the mark reads a chain it is listed on'], stable_yard: ['iii', 'livestock', 'the same'],
  stable_district: ['iii', 'livestock', 'the same'], pack_animal_trader: ['iii', 'livestock', 'a trader in beasts: what it sells is brought'],
  beast_trainers: ['iii', 'livestock', 'a service on bought beasts'],
  // the extractors
  stone_quarry: ['ii', 'stone', 'its line: "the only source of proper building stone the place has had"', ['stone_quarry']],
  mine: ['ii', 'ore', 'it cuts the seam it stands on', ['iron_deposits', 'precious_metals', 'gemstone_deposits', 'coal_deposits']],
  mine_open_cast: ['ii', 'ore', 'the same, open-cast', ['iron_deposits', 'precious_metals', 'gemstone_deposits', 'coal_deposits']],
  peat_cutter: ['ii', 'peat', 'it cuts the bog it stands on', ['marshlands']],
  salt_works: ['ii', 'salt', 'its line: "evaporates saline brine … where brine lies near": the brine is its ground (on a coast, the sea)', ['salt_flats', 'desert_salt', 'fishing_grounds'], true],
  // the catch
  fisher_s_landing: ['ii', 'fish', 'the boats fish the water off the landing', ['fishing_grounds', 'river_fish']],
  fishing_community: ['ii', 'fish', 'the same', ['fishing_grounds', 'river_fish']],
  hunter_s_lodge: ['ii', 'game', 'it hunts the grounds it stands in', ['hunting_grounds']],
  wildfowler: ['ii', 'fowl', 'it hunts the marsh and the grounds', ['marshlands', 'hunting_grounds']],
  fish_market: ['i', 'fish', 'it sells the catch brought to it'], fishmonger: ['i', 'fish', 'the same'],
  // the route houses and the markets
  caravanserai: ['iii', 'camels', 'its trade IS the route (the reader answers it `route` already)'], weekly_market: ['iii', 'goods', 'a market: its trade IS the route'],
  merchant_guilds_3_8: ['iii', 'goods', 'merchants: what they deal in is brought'], merchant_guilds_15_40: ['iii', 'goods', 'the same'],
  // the walls and the magic (marked by the spent-ground reading only, on a chain they are listed on)
  citadel: ['iii', 'stone', 'a wall: built once, of stone already cut'], palisade: ['iii', 'timber or stone', 'the same'],
  academy_of_magic: ['iii', 'arcana', 'the mark reads a spent magical ground it is listed on'], mages_district: ['iii', 'arcana', 'the same'],
  enchanter_s_shop: ['iii', 'arcana', 'the same'], scroll_scribe: ['iii', 'arcana', 'the same'], sage_s_quarter: ['iii', 'arcana', 'the same (ruins)'],
  wizard_s_tower: ['iii', 'arcana', 'the same'], elder_grove_council: ['iii', 'herbs', 'a council: the grove is its seat, not its material'],
});
export const kindOf = (id) => (KINDS[id] ? KINDS[id][0] : null);
export const groundsOf = (id) => (KINDS[id] && KINDS[id][3]) || null;
export const coastGives = (id) => !!(KINDS[id] && KINDS[id][4]);
