// servicesData.js — Static service and goods data
// Extracted from servicesGenerator.js (was inline module-scope data)

import {GOODS_CATEGORIES as _GC} from '../data/tradeGoodsData.js';

// ── Locale service overrides ──────────────────────────────────────────────────
// Maps institution name variants → canonical INSTITUTION_SERVICES key
export const LOCALE_SERVICE_OVERRIDES = {"smuggling network":"Smuggling Operation","hospitality district":"Inn/Tavern District","inns and taverns (district)":"Inn/Tavern District","inn (multiple)":"Inn/Tavern","adventurers' charter hall":"Adventurers' Charter Hall","hospitality district":"Inn/Tavern District","inns and taverns (district)":"Inn/Tavern District","inn (multiple)":"Inn/Tavern","taverns (5-20)":"Inn/Tavern",tavern:"Inn/Tavern","inn/tavern district":"Inn/Tavern District","travelers' inn":"Inn/Tavern","ale house":"Inn/Tavern","resident smith (part-time)":"Blacksmith","carpenter (part-time)":"Blacksmith","carpenters (5-15)":"Blacksmith",carpenter:"Blacksmith",thatcher:"Craft Guild District",cooper:"Craft Guild District","weavers/textile workers":"Craft Guild District",tanners:"Craft Guild District","butchers (3-8)":"Craft Guild District","bakers (5-15)":"Mill","specialized metalworkers":"Specialist Craftsmen",glassmakers:"Specialist Craftsmen","priest (resident)":"Church/Temple","healer (divine, 1st level)":"Church/Temple","cathedral (10,000+ only)":"Church/Temple","great cathedral":"Church/Temple","multiple cathedrals":"Church/Temple","major monasteries (5-10)":"Monastery","multiple monasteries":"Monastery","resurrection services (10,000+ only)":"Church/Temple","curse breaking":"Church/Temple","small hospital":"Hospital","major hospital":"Hospital","hospital network":"Hospital","annual fair":"Market","major annual fairs":"Market","international trade center":"Market","weekly market":"Market","market square":"Market","multiple market squares":"Market","daily markets":"Market","district markets (5-10)":"Market","money changers":"Banking House","banking houses":"Banking House","stock exchange (early)":"Banking District","town hall":"Courthouse","city hall":"Courthouse","multiple court buildings":"Courthouse","large prison":"Courthouse","massive prison":"Courthouse","palace/government complex":"Courthouse","professional guard (hundreds)":"Garrison","multiple garrisons":"Garrison","citizen militia":"Garrison","town watch":"Town Watch","professional city watch":"Town Watch",barracks:"Garrison","free company hall":"Free Company Hall","veteran's lodge":"Veteran's Lodge","citizen militia":"Citizen Militia","adventurers' charter hall":"Adventurers' Charter Hall","hireling hall":"Hireling Hall","mercenary company hq":"Mercenary Quarter","scroll scribe":"Wizard Tower","wizard's tower":"Wizard Tower","multiple wizard towers":"Wizard Tower","mages' guild":"Mages District","enchanter's shop":"Enchanter","alchemist shop":"Alchemist","alchemist quarter":"Alchemist","academy of magic":"Academy","hedge wizard":"Hedge Wizard","teleportation circle":"Airship","message network (high magic)":"Message Network","airship docking (high magic)":"Airship","magic item consignment":"Magic Item","magical banking (high magic)":"Banking District","fighting pits":"Arena","professional arena":"Arena","colosseum/arena":"Arena","charlatan fortune tellers":"Theater","traveling performers":"Theater","multiple theaters":"Theater","opera house":"Theater",theater:"Theater",theaters:"Theater","bardic college":"Bardic College","great library":"Great Library","sage/library":"Great Library","sage's quarter":"Great Library","printing house":"Great Library",brothel:"Red Light District","red light district":"Red Light District","gambling halls":"Gambling District","gambling den":"Gambling Den","black market bazaar":"Black Market","underground city":"Underground City","thieves' guild (powerful)":"Thieves Guild","assassins' guild":"Assassins Guild","dream parlors (high magic)":"Dream Parlor","docks/port facilities":"Docks/Port Facilities","major port":"Major Port","navy (if coastal)":"Navy","merchant warehouses":"Merchant Warehouses","spellcasting services (1st-4th level)":"Spellcasting Services","spellcasting services (1st-6th level)":"Spellcasting Services","spellcasting services (1st-8th level)":"Spellcasting Services","planar embassy":"Planar Embassy","planar traders":"Planar Traders","dragon resident":"Dragon Resident","golem workforce":"Golem Workforce","undead labor":"Undead Labor","monster part dealers":"Monster Part Dealers","exotic beast trainers":"Exotic Beast Trainers","beast trainers":"Exotic Beast Trainers","smuggling operation":"Smuggling Operation","thieves' guild chapter":"Thieves Guild","thieves' guild (powerful)":"Thieves Guild","assassins' guild":"Assassins Guild","multiple criminal factions":"Multiple Criminal Factions","black market":"Black Market","black market bazaar":"Black Market","underground city":"Underground City","gambling den":"Gambling Den","gambling halls":"Gambling District","gambling district":"Gambling District","front businesses":"Front Business","front business":"Front Business","street gang":"Street Gang","red light district":"Red Light District","dream parlors (high magic)":"Dream Parlor","message network (high magic)":"Message Network","airship docking (high magic)":"Airship","magic item consignment":"Magic Item","wayside shrine":"Church/Temple",shrine:"Church/Temple","parish church":"Church/Temple","monastery or friary":"Monastery","informal elder consensus":"Courthouse","mayor and council":"Courthouse","guild governance":"Courthouse","lord's appointee":"Courthouse","guild consortium":"Courthouse","noble governor":"Courthouse","village reeve":"Courthouse","lord's steward":"Courthouse","head-of-household consensus":"Courthouse","multiple courthouses":"Courthouse","multiple court buildings":"Courthouse","lord's appointee":"Courthouse","town hall":"Courthouse","city hall":"Courthouse","merchant guilds (3-8)":"Guild Hall","merchant guilds (15-40)":"Guild Hall","merchant guilds (50-100+)":"Guild Hall","merchant guilds (100+)":"Guild Hall","craft guilds (5-15)":"Craft Guild District","craft guilds (30-80)":"Craft Guild District","craft guilds (100-150+)":"Craft Guild District","blacksmiths (3-10)":"Blacksmith","luxury goods quarter":"Specialist Craftsmen","specialist craftsmen quarters":"Specialist Craftsmen","banking district":"Banking District","stock exchange (early)":"Banking District","hireling hall":"Adventurers Guild","adventurers' guild hall":"Adventurers Guild","multiple adventurers' guilds":"Adventurers Guild","brothel (red light district)":"Red Light District","dungeon delving supply district":"Mercenary Quarter","traveling hedge wizard":"Hedge Wizard",

  // Crafts
  "apothecary": "Alchemist",
  "apothecary (established)": "Alchemist",
  "apothecary district": "Alchemist",
  "blacksmith": "Blacksmith",
  "bowyer & fletcher": "Specialist Craftsmen",
  "bowyers & fletchers (guild)": "Specialist Craftsmen",
  "carpenter": "Craft Guild District",
  "cooper": "Craft Guild District",
  "glassmakers": "Specialist Craftsmen",
  "tanners": "Craft Guild District",
  "thatcher": "Craft Guild District",
  // Criminal
  "bandit affiliate": "Street Gang",
  "fence (word of mouth)": "Black Market",
  "human trafficking network": "Multiple Criminal Factions",
  "kidnapping ring": "Assassins Guild",
  "local fence": "Black Market",
  "outlaw shelter": "Front Business",
  "smuggling waypoint": "Smuggling Operation",
  // Defense
  "barracks": "Garrison",
  "citadel": "Garrison",
  "garrison": "Garrison",
  "gates (if walled)": "Garrison",
  "palisade or earthworks": "Garrison",
  // Economy transport & trade
  "alehouse": "Inn/Tavern",
  "barge and river transport company": "Docks/Port Facilities",
  "caravan masters' exchange": "Merchant Warehouses",
  "carriers' guild": "Docks/Port Facilities",
  "carriers' hiring hall": "Docks/Port Facilities",
  "cartographer's guild": "Great Library",
  "cartographer's workshop": "Great Library",
  "coaching inn": "Inn/Tavern",
  "periodic market": "Market",
  "river boatyard": "Docks/Port Facilities",
  "river ferry": "Docks/Port Facilities",
  "shipyard": "Major Port",
  "slave market": "Black Market",
  "slave market district": "Multiple Criminal Factions",
  "warehouse district": "Merchant Warehouses",
  "wayside inn": "Inn/Tavern",
  // Entertainment
  "brothel": "Red Light District",
  "colosseum/arena": "Arena",
  "multiple theaters": "Theater",
  "opera house": "Theater",
  // Essential infrastructure
  "access to external mill": "Mill",
  "aqueduct or water system": "Inn/Tavern",
  "city granaries": "Merchant Warehouses",
  "city walls and gates": "Garrison",
  "common grazing land": "Mill",
  "dwellings (17-80)": "Inn/Tavern",
  "dwellings (4-16)": "Inn/Tavern",
  "dwellings (80-180)": "Inn/Tavern",
  "farmland": "Mill",
  "housing (180-1000 structures)": "Inn/Tavern District",
  "mill": "Mill",
  "mills (2-5)": "Mill",
  "multiple water sources": "Inn/Tavern",
  "subsistence farming": "Mill",
  "town granary": "Merchant Warehouses",
  "town walls": "Garrison",
  "water source": "Inn/Tavern",
  // Government
  "city-state government": "Courthouse",
  "democratic assembly": "Courthouse",
  "merchant oligarchy": "Banking House",
  "royal seat": "Courthouse",
  // Infrastructure
  "courthouse": "Courthouse",
  "small prison/stocks": "Courthouse",
  // Metropolis Scale
  "advanced water infrastructure": "Inn/Tavern District",
  "housing (1000-5000 structures)": "Inn/Tavern District",
  "mages' district": "Mages District",
  "massive walls and fortifications": "Garrison",
  "mercenary quarter": "Mercenary Quarter",
  "parish churches (50-100+)": "Church/Temple",
  "sewage system": "Inn/Tavern District",
  "state granary complex": "Merchant Warehouses",
  "university": "University",
  // Religious
  "access to parish church": "Church/Temple",
  "graveyard": "Church/Temple",
  "parish churches (10-30)": "Church/Temple",
  "parish churches (2-5)": "Church/Temple"

};

// ── Category string constants (raw strings used in goods arrays) ──────────────

// ── Goods by tier ─────────────────────────────────────────────────────────────
// tier → [{name, category, defaultEnabled, baseChance, desc}]

// ── Commodity category map ────────────────────────────────────────────────────
export const COMMODITY_CATEGORY_MAP = {
  fish:   "fish",
  salt:   "salt",
  salt_flat:   "salt",
  iron:   "iron",
  metalwork:   "iron",
  stone:   "stone",
  pottery:   "stone",
  timber:   "timber",
  grain:   "grain",
  flour:   "grain",
  livestock:   "grain",
  dairy:   "grain",
  wool:   "grain",
  furs:   "timber",
  honey:   "herbs",
  medicinal_herbs:   "herbs",
  herbs:   "herbs",
  peat:   "fuel",
  coal:   "fuel",
  luxury:   "gems",
  gems:   "gems",
  processed_textiles:   "cloth",
  maritime_access:   null,
  trade_access:   null

};
