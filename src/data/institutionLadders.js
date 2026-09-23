/**
 * institutionLadders.js — side-effect-free institution scale vocabulary.
 *
 * Both generation normalizers and structural validation need the same answer
 * to one question: when a larger institution is seated, which smaller
 * institution may lawfully disappear? Keep that answer in this data leaf.
 * Importing it must never register a pipeline step.
 */

// Shared phrases hoisted once (train EM-T15's worker buy-back, judgment 203): each is spelled here and referenced below; the exported tables are byte-identical.
const ADVENTURERS_CHARTER_HALL = 'adventurers\' charter hall';
const APOTHECARY_DISTRICT = "Apothecary district";
const APOTHECARY_ESTABLISHED = "Apothecary (established)";
const BOWYERS_FLETCHERS_GUILD = "Bowyers & fletchers (guild)";
const CARAVAN_MASTERS_EXCHANGE = "Caravan masters' exchange";
const CARAVAN_MASTERS_EXCHANGE_2 = "caravan masters' exchange";
const CARRIERS_HIRING_HALL = "Carriers' hiring hall";
const CRAFT_GUILDS_30_80 = 'craft guilds (30-80)';
const CRAFT_GUILDS_5_15 = 'craft guilds (5-15)';
const FENCE_WORD_OF_MOUTH = 'fence (word of mouth)';
const MERCHANT_GUILDS_15_40 = 'merchant guilds (15-40)';
const MERCHANT_GUILDS_3_8 = 'merchant guilds (3-8)';
const PACK_ANIMAL_TRADER = 'pack animal trader';
const PARISH_CHURCHES_10_30 = "Parish churches (10-30)";
const PARISH_CHURCHES_2_5 = "Parish churches (2-5)";
const PROFESSIONAL_CITY_WATCH = "Professional city watch";
const TRAVELING_PERFORMERS = "Traveling performers";

// Pairs are scale tiers of the SAME function. Complementary infrastructure
// must not appear here: the greater replaces the lesser.
export const UPGRADE_CHAINS = Object.freeze([
  ["Parish church", PARISH_CHURCHES_2_5],
  ["Parish church", PARISH_CHURCHES_10_30],
  [PARISH_CHURCHES_2_5, PARISH_CHURCHES_10_30],
  ["Wayside shrine", "Parish church"],
  ["Water source", "Multiple water sources"],
  ["Citizen militia", "Town watch"],
  ["Citizen militia", PROFESSIONAL_CITY_WATCH],
  ["Town watch", PROFESSIONAL_CITY_WATCH],
  ["Palisade or earthworks", "Town walls"],
  ["Town walls", "City walls and gates"],
  ["Barracks", "Garrison"],
  ["Street gang", "Multiple criminal factions"],
  ["Gambling den", "Gambling halls"],
  ["Gambling halls", "Gambling district"],
  ["Gambling den", "Gambling district"],
  [TRAVELING_PERFORMERS, "Theaters"],
  ["Theaters", "Multiple theaters"],
  [TRAVELING_PERFORMERS, "Multiple theaters"],
  ["River boatyard", "Shipyard"],
  ["Hedge wizard", "Wizard's tower"],
  ["Traveling hedge wizard", "Hedge wizard"],
  ["Alchemist shop", "Alchemist quarter"],
  ["Wizard's tower", "Mages' guild"],
  ["Town granary", "City granaries"],
  ["Town hall", "City hall"],
  ["Blacksmith", "Blacksmiths (3-10)"],
  ["Carpenter", "Carpenters (5-15)"],
  [CARRIERS_HIRING_HALL, "Carriers' guild"],
  ["Carriers' guild", CARAVAN_MASTERS_EXCHANGE],
  [CARRIERS_HIRING_HALL, CARAVAN_MASTERS_EXCHANGE],
  ["Small prison/stocks", "Large prison"],
  ["Courthouse", "Multiple courthouses"],
  ["Craft guilds (5-15)", "Craft guilds (30-80)"],
  ["Merchant guilds (3-8)", "Merchant guilds (15-40)"],
  ["Adventurers' charter hall", "Multiple adventurers' guilds"],
  [BOWYERS_FLETCHERS_GUILD, "Dungeon delving supply district"],
  ["Apothecary", APOTHECARY_ESTABLISHED],
  [APOTHECARY_ESTABLISHED, APOTHECARY_DISTRICT],
  ["Apothecary", APOTHECARY_DISTRICT],
  ["Cartographer's workshop", "Cartographer's guild"],
  ["Bowyer & fletcher", BOWYERS_FLETCHERS_GUILD],
  ["Small hospital", "Major hospital"],
  ["Slave market", "Slave market district"],
]);

// Same-function collapse rules used by subsumptionPass. Greaters use the
// pass's historical case-insensitive substring match; lessers are exact.
export const SUBSUMPTION_RULES = Object.freeze([
  { greater: 'banking district', lesser: ['banking houses', 'money changers'] },
  { greater: 'banking houses', lesser: ['money changers'] },
  { greater: 'mages\' guild', lesser: ['wizard\'s tower', 'alchemist shop'] },
  { greater: 'mages\' district', lesser: ['wizard\'s tower', 'mages\' guild', 'alchemist shop', 'alchemist quarter'] },
  { greater: 'academy of magic', lesser: ['wizard\'s tower', 'mages\' guild'] },
  { greater: 'multiple adventurers\' guild', lesser: [ADVENTURERS_CHARTER_HALL, 'hireling hall'] },
  { greater: 'adventurers\' guild', lesser: [ADVENTURERS_CHARTER_HALL, 'hireling hall'] },
  { greater: 'cathedral', lesser: ['parish church', 'priest (resident)', 'wayside shrine'] },
  { greater: 'major hospital', lesser: ['small hospital'] },
  { greater: 'professional city watch', lesser: ['town watch', 'citizen militia'] },
  { greater: 'multiple courthouses', lesser: ['courthouse'] },
  { greater: 'major port', lesser: ['docks/port facilities', 'river boatyard', 'river ferry'] },
  { greater: CRAFT_GUILDS_30_80, lesser: [CRAFT_GUILDS_5_15] },
  { greater: 'craft guilds (100-150+)', lesser: [CRAFT_GUILDS_30_80, CRAFT_GUILDS_5_15] },
  { greater: MERCHANT_GUILDS_15_40, lesser: [MERCHANT_GUILDS_3_8] },
  { greater: 'merchant guilds (50-100+)', lesser: [MERCHANT_GUILDS_15_40, MERCHANT_GUILDS_3_8] },
  { greater: 'thieves\' guild chapter', lesser: [FENCE_WORD_OF_MOUTH, 'local fence', 'bandit affiliate'] },
  { greater: 'black market', lesser: [FENCE_WORD_OF_MOUTH, 'local fence'] },
  { greater: 'brewery', lesser: ['brewer'] },
  { greater: "cobbler's guild", lesser: ['cobbler'] },
  { greater: "tailor's guild", lesser: ['tailor'] },
  { greater: 'mint (official)', lesser: ['mint', 'assay office'] },
  { greater: 'stable district', lesser: ['stable master', 'stable yard'] },
  { greater: 'fish market', lesser: ['fishmonger'] },
  { greater: "assassins' guild", lesser: ['contract killer', 'hired blades'] },
  { greater: "thieves' guild (powerful)", lesser: ["thieves' guild chapter", 'black market bazaar', 'contract killer'] },
  { greater: 'auction house', lesser: ['slave market'] },
  { greater: 'gladiatorial school', lesser: ['fighting pits'] },
  { greater: 'printing house', lesser: ['village scribe'] },
  { greater: 'great library', lesser: ['village scribe', 'printing house'] },
  { greater: 'banking houses', lesser: ['pawnbroker'] },
  { greater: 'banking district', lesser: ['pawnbroker', 'banking houses'] },
  { greater: 'major hospital', lesser: ['almshouse'] },
  { greater: 'hospital network', lesser: ['almshouse', 'foundling home'] },
  { greater: CARAVAN_MASTERS_EXCHANGE_2, lesser: ["caravaneer's post", 'waystation', PACK_ANIMAL_TRADER] },
  { greater: "caravaneer's post", lesser: ['waystation', PACK_ANIMAL_TRADER] },
  { greater: 'international trade center', lesser: [CARAVAN_MASTERS_EXCHANGE_2, "caravaneer's post"] },
  { greater: 'luxury goods quarter', lesser: ['jeweller'] },
  { greater: 'specialized metalworkers', lesser: ['jeweller'] },
  // [W-I INFORMATION BROKERAGES] I1 (design §3): the guild form of each information
  // house replaces its minor form. Legal and illegal ladders stay separate on purpose
  // (a Whisper market does not absorb a Listening post, and vice versa) because the two
  // families answer to different patrons and grade by different competences.
  { greater: "chroniclers' exchange", lesser: ['listening post'] },
  { greater: 'whisper market', lesser: ['rookery'] },
]);

function normalizedName(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * True when `greaterName` is the centralized ladder reason that
 * `lesserName` may be absent from a normalized roster.
 */
export function institutionLadderEvicts(greaterName, lesserName) {
  const greater = String(greaterName || '');
  const lesser = String(lesserName || '');
  if (!greater || !lesser) return false;

  if (UPGRADE_CHAINS.some(([candidateLesser, candidateGreater]) => (
    candidateGreater === greater && candidateLesser === lesser
  ))) {
    return true;
  }

  const normalizedGreater = normalizedName(greater);
  const normalizedLesser = normalizedName(lesser);
  return SUBSUMPTION_RULES.some(rule => (
    normalizedGreater.includes(normalizedName(rule.greater))
    && rule.lesser.some(candidate => normalizedName(candidate) === normalizedLesser)
  ));
}

/**
 * True when adding an unprotected candidate to this native roster would make
 * either scale normalizer immediately remove it.
 */
export function institutionWouldBeImmediatelyEvicted(rosterNames, candidateName) {
  return (Array.isArray(rosterNames) ? rosterNames : [])
    .some(greaterName => institutionLadderEvicts(greaterName, candidateName));
}
