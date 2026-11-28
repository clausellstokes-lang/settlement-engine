// PEOPLE-0 (2026-11-07) — the proposed face table: family key -> [verdict, title].
// verdict: 'face' (a house with a keeper), 'none' (a place, no keeper), 'judge' (the chair rules).
// A tier row the catalogue marks FABRIC is 'none' whatever its family says (measure.mjs applies it).
export const FACES = {
  // Economy
  'Subsistence farming': ['none', ''], 'Common grazing land': ['none', ''], 'Communal root cellar': ['none', ''],
  "Fisher's landing": ['judge', 'the boat-headman'], 'Fishmonger': ['face', 'the fishmonger'], 'Fish market': ['judge', 'the fish-market warden'],
  'Shepherd': ['face', 'the head shepherd'], 'Dairy farmer': ['face', 'the dairy farmer'], 'Beekeeper': ['face', 'the beekeeper'],
  'Wildfowler': ['face', 'the wildfowler'], "Woodcutter's camp": ['face', 'the camp foreman'], 'Charcoal burner': ['face', 'the collier'],
  'Peat cutter': ['face', 'the peat-reeve'], 'Mine': ['face', 'the mine captain'], 'Stone quarry': ['face', 'the quarry master'],
  'Salt works': ['face', 'the salt master'], "Hunter's lodge": ['face', 'the master of the hunt'], "Furrier's district": ['judge', 'the furriers\' warden'],
  'Weekly market': ['judge', 'the market warden'], 'Multiple market squares': ['judge', 'the clerk of the markets'], 'Major annual fairs': ['judge', 'the fair warden'],
  'International trade center': ['judge', 'the exchange master'], 'Merchant guilds (3-8)': ['face', 'the guild master'], 'Money changers': ['face', 'the banker'],
  'Pawnbroker': ['face', 'the pawnbroker'], 'Inns and taverns (district)': ['face', 'the innkeeper'], 'Alehouse': ['face', 'the alewife'],
  'Coaching inn': ['face', 'the coaching-inn keeper'], 'Caravanserai': ['face', 'the caravanserai keeper'], "Caravan masters' exchange": ['face', 'the caravan master'],
  "Carriers' hiring hall": ['face', 'the carriers\' master'], 'Pack animal trader': ['face', 'the horse-coper'], 'Stable district': ['judge', 'the stable master'],
  'Beast trainers': ['face', 'the beast trainer'], 'Post relay station': ['face', 'the postmaster'], 'River ferry': ['face', 'the ferryman'],
  'River boatyard': ['face', 'the boatwright'], 'Shipyard': ['face', 'the master shipwright'], 'Barge and river transport company': ['face', 'the barge master'],
  'Docks/port facilities': ['judge', 'the wharfinger'], "Harbour master's office": ['face', 'the harbour master'], 'Toll bridge': ['face', 'the toll-keeper'],
  'Customs house': ['face', 'the customs collector'], 'Town granary': ['face', 'the granary reeve'], 'Warehouse district': ['judge', 'the warehouse factor'],
  'Public bathhouse': ['face', 'the bath-keeper'], 'Slave market': ['face', 'the slaver'], 'Slave market district': ['face', 'the slave-market master'],
  'Auction house': ['face', 'the auctioneer'], 'Assay office': ['face', 'the assayer'], 'Mint (official)': ['face', 'the mint master'],
  'Listening post': ['judge', 'the watcher'], "Chroniclers' exchange": ['face', 'the chronicler'],
  // Crafts
  'Mills (2-5)': ['face', 'the miller'], 'Maltster': ['face', 'the maltster'], 'Blacksmiths (3-10)': ['face', 'the smith'],
  'Specialized metalworkers': ['face', 'the master metalworker'], 'Jeweller': ['face', 'the jeweller'], 'Luxury goods quarter': ['judge', 'the luxury-trade warden'],
  'Carpenters (5-15)': ['face', 'the carpenter'], 'Thatcher': ['face', 'the thatcher'], 'Cooper': ['face', 'the cooper'],
  'Apothecary district': ['face', 'the apothecary'], 'Bowyers & fletchers (guild)': ['face', 'the bowyer'], 'Sawmill (commercial)': ['face', 'the sawyer'],
  'Brewery': ['face', 'the brewer'], 'Vintner': ['face', 'the vintner'], 'Tanners': ['face', 'the tanner'], 'Tanner (established)': ['face', 'the master tanner'],
  'Fuller': ['face', 'the fuller'], 'Dyer': ['face', 'the dyer'], 'Weavers/Textile workers': ['face', 'the master weaver'], 'Potter': ['face', 'the potter'],
  'Brickmaker': ['face', 'the brickmaker'], "Cobbler's guild": ['face', 'the cobbler'], "Tailor's guild": ['face', 'the tailor'],
  'Butchers (3-8)': ['face', 'the master butcher'], 'Bakers (5-15)': ['face', 'the master baker'], 'Smelter': ['face', 'the smelt master'],
  'Chandler': ['face', 'the chandler'], 'Glassmakers': ['face', 'the glassmaker'], 'Ropemaker': ['face', 'the ropemaker'], 'Midwife': ['face', 'the midwife'],
  'Woodcarver': ['face', 'the woodcarver'], 'Village scribe': ['face', 'the scribe'], 'Printing house': ['face', 'the printer'],
  "Cartographer's workshop": ['face', 'the cartographer'], 'Craft guilds (5-15)': ['face', 'the craft-guild master'], 'Alchemist quarter': ['face', 'the alchemist'],
  // Religious
  'Wayside shrine': ['judge', 'the shrine-keeper'], 'Access to parish church': ['face', 'the priest'], 'Burial ground': ['none', ''],
  'Priest (resident)': ['face', 'the priest'], 'Monastery or friary': ['face', 'the abbot'], 'Cathedral (10,000+ only)': ['face', 'the bishop'],
  'Small hospital': ['face', 'the hospitaller'], 'Almshouse': ['face', 'the almoner'], 'Foundling home': ['face', 'the foundling-mother'],
  'Druid Circle': ['face', 'the archdruid'], 'Elder Grove Council': ['face', 'the grove elder'],
  // Government (the seat and its offices)
  'Informal elder consensus': ['face', 'the eldest'], 'Head-of-household consensus': ['face', 'the eldest householder'], "Lord's reeve": ['face', 'the reeve'],
  'Household elder': ['face', 'the household elder'], "Lord's steward": ['face', 'the steward'], 'Village headman': ['face', 'the headman'],
  'City administration': ['face', 'the chief administrator'], 'Village elder': ['face', 'the village elder'], 'Mayor and council': ['face', 'the mayor'],
  'Guild consortium': ['face', 'the consortium speaker'], 'Merchant oligarchy': ['face', 'the first magnate'], 'City-state government': ['face', 'the doge'],
  'Democratic assembly': ['face', 'the speaker of the assembly'], 'Royal seat': ['face', 'the monarch'], 'Town crier': ['face', 'the crier'],
  // Infrastructure
  'Dwellings (1-8)': ['none', ''], 'Water source': ['none', ''], 'City hall': ['judge', 'the town clerk'],
  'Palace/government complex': ['judge', 'the chamberlain'], 'Courthouse': ['face', 'the magistrate'], 'Small prison/stocks': ['face', 'the gaoler'],
  'Workhouse': ['face', 'the workhouse master'], 'Sewage system': ['none', ''], 'Great library': ['face', 'the librarian'],
  // Defense
  'Palisade or earthworks': ['none', ''], 'Gates (if walled)': ['none', ''], 'Citizen militia': ['face', 'the captain of the watch'],
  'Village watch': ['face', 'the watch sergeant'], 'Barracks': ['face', 'the garrison commander'], 'Citadel': ['face', 'the castellan'],
  'Mercenary quarter': ['face', 'the company captain'], "Veteran's lodge": ['face', 'the lodge master'], "Warden's Lodge": ['face', 'the warden'],
  // Magic
  "Wizard's tower": ['face', 'the wizard'], "Mages' guild": ['face', 'the guild archmage'], 'Academy of magic': ['face', 'the chancellor'],
  "Enchanter's shop": ['face', 'the enchanter'], 'Scroll scribe': ['face', 'the scroll scribe'], 'Teleportation circle': ['judge', 'the circle-keeper'],
  'Healer (divine, 1st level)': ['face', 'the healer'], 'Planar embassy': ['face', 'the envoy'],
  // Adventuring
  "Adventurers' charter hall": ['face', 'the charter master'], 'Hireling hall': ['face', 'the hiring master'], 'Hired blades': ['face', 'the blade captain'],
  'Dungeon delving supply district': ['judge', 'the outfitter'], "Sage's quarter": ['judge', 'the sage'],
  // Criminal
  'Fence (word of mouth)': ['face', 'the fence'], 'Outlaw shelter': ['face', 'the outlaw host'], 'Bandit affiliate': ['face', 'the bandit contact'],
  'Smuggling waypoint': ['face', 'the smuggler'], 'Multiple criminal factions': ['face', 'the gang boss'], "Thieves' guild chapter": ['face', 'the guildmaster of thieves'],
  'Front businesses': ['face', 'the front man'], 'Underground network': ['face', 'the network\'s spider'], 'Underground city': ['judge', 'the undercity boss'],
  'Rookery': ['judge', 'the rookery boss'], 'Whisper market': ['face', 'the whisper broker'], 'Black market': ['face', 'the black marketeer'],
  'Contract killer': ['face', 'the killer'], "Assassins' guild": ['face', 'the guild\'s master'], 'Kidnapping ring': ['face', 'the ringleader'],
  'Human trafficking network': ['face', 'the trafficker'],
  // Entertainment
  'Village musician': ['judge', 'the musician'], 'Theaters': ['face', 'the theatre manager'], 'Opera house': ['face', 'the impresario'],
  'Bardic college': ['face', 'the college master'], 'Gambling den': ['face', 'the house boss'], 'Brothel (red light district)': ['face', 'the madam'],
  'Red light district': ['judge', 'the district madam'], 'Fighting pits': ['face', 'the pit boss'], 'Gladiatorial school': ['face', 'the lanista'],
  'Colosseum/arena': ['face', 'the arena master'], 'Charlatan fortune tellers': ['judge', 'the fortune teller'],
  // Exotic
  'Planar traders': ['face', 'the planar factor'], 'Dragon resident': ['judge', 'the dragon'], 'Golem workforce': ['judge', 'the golem-master'],
  'Undead labor': ['judge', 'the necromancer-overseer'], 'Dream parlors (high magic)': ['face', 'the dream-keeper'],
  'Airship docking (high magic)': ['face', 'the skydock master'], 'Message network (high magic)': ['judge', 'the message-master'],
};
