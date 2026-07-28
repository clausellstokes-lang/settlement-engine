/**
 * institutionLadders.js — side-effect-free institution scale vocabulary.
 *
 * Both generation normalizers and structural validation need the same answer
 * to one question: when a larger institution is seated, which smaller
 * institution may lawfully disappear? Keep that answer in this data leaf.
 * Importing it must never register a pipeline step.
 */

// Pairs are scale tiers of the SAME function. Complementary infrastructure
// must not appear here: the greater replaces the lesser.
export const UPGRADE_CHAINS = Object.freeze([
  ["Parish church", "Parish churches (2-5)"],
  ["Parish church", "Parish churches (10-30)"],
  ["Parish churches (2-5)", "Parish churches (10-30)"],
  ["Wayside shrine", "Parish church"],
  ["Water source", "Multiple water sources"],
  ["Citizen militia", "Town watch"],
  ["Citizen militia", "Professional city watch"],
  ["Town watch", "Professional city watch"],
  ["Palisade or earthworks", "Town walls"],
  ["Town walls", "City walls and gates"],
  ["Barracks", "Garrison"],
  ["Street gang", "Multiple criminal factions"],
  ["Gambling den", "Gambling halls"],
  ["Gambling halls", "Gambling district"],
  ["Gambling den", "Gambling district"],
  ["Traveling performers", "Theaters"],
  ["Theaters", "Multiple theaters"],
  ["Traveling performers", "Multiple theaters"],
  ["River boatyard", "Shipyard"],
  ["Hedge wizard", "Wizard's tower"],
  ["Traveling hedge wizard", "Hedge wizard"],
  ["Alchemist shop", "Alchemist quarter"],
  ["Wizard's tower", "Mages' guild"],
  ["Town granary", "City granaries"],
  ["Town hall", "City hall"],
  ["Blacksmith", "Blacksmiths (3-10)"],
  ["Carpenter", "Carpenters (5-15)"],
  ["Carriers' hiring hall", "Carriers' guild"],
  ["Carriers' guild", "Caravan masters' exchange"],
  ["Carriers' hiring hall", "Caravan masters' exchange"],
  ["Small prison/stocks", "Large prison"],
  ["Courthouse", "Multiple courthouses"],
  ["Craft guilds (5-15)", "Craft guilds (30-80)"],
  ["Merchant guilds (3-8)", "Merchant guilds (15-40)"],
  ["Adventurers' charter hall", "Multiple adventurers' guilds"],
  ["Bowyers & fletchers (guild)", "Dungeon delving supply district"],
  ["Apothecary", "Apothecary (established)"],
  ["Apothecary (established)", "Apothecary district"],
  ["Apothecary", "Apothecary district"],
  ["Cartographer's workshop", "Cartographer's guild"],
  ["Bowyer & fletcher", "Bowyers & fletchers (guild)"],
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
  { greater: 'multiple adventurers\' guild', lesser: ['adventurers\' charter hall', 'hireling hall'] },
  { greater: 'adventurers\' guild', lesser: ['adventurers\' charter hall', 'hireling hall'] },
  { greater: 'cathedral', lesser: ['parish church', 'priest (resident)', 'wayside shrine'] },
  { greater: 'major hospital', lesser: ['small hospital'] },
  { greater: 'professional city watch', lesser: ['town watch', 'citizen militia'] },
  { greater: 'multiple courthouses', lesser: ['courthouse'] },
  { greater: 'major port', lesser: ['docks/port facilities', 'river boatyard', 'river ferry'] },
  { greater: 'craft guilds (30-80)', lesser: ['craft guilds (5-15)'] },
  { greater: 'craft guilds (100-150+)', lesser: ['craft guilds (30-80)', 'craft guilds (5-15)'] },
  { greater: 'merchant guilds (15-40)', lesser: ['merchant guilds (3-8)'] },
  { greater: 'merchant guilds (50-100+)', lesser: ['merchant guilds (15-40)', 'merchant guilds (3-8)'] },
  { greater: 'thieves\' guild chapter', lesser: ['fence (word of mouth)', 'local fence', 'bandit affiliate'] },
  { greater: 'black market', lesser: ['fence (word of mouth)', 'local fence'] },
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
  { greater: "caravan masters' exchange", lesser: ["caravaneer's post", 'waystation', 'pack animal trader'] },
  { greater: "caravaneer's post", lesser: ['waystation', 'pack animal trader'] },
  { greater: 'international trade center', lesser: ["caravan masters' exchange", "caravaneer's post"] },
  { greater: 'luxury goods quarter', lesser: ['jeweller'] },
  { greater: 'specialized metalworkers', lesser: ['jeweller'] },
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
