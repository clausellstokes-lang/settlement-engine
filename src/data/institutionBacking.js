/**
 * data/institutionBacking.js — THE BACKING CATALOGUE: which power each house stands behind.
 *
 * THE OWNER'S WORD (2026-11-02, X-45): "every institution backs powers, some inherently back
 * multiple where appropriate, and we need to also just make sure that it still balances out to
 * the power ranking and influences. We just need to make sure that we balance it on our end and
 * it doesn't end up becoming redundant or a double counting. So what you should do is catalog
 * every institution and make those judgment calls individually."
 *
 * ONE ROW PER CATALOGUE FAMILY, a judgment call each, keyed by the family's own name (the name
 * the generator writes at the family's first tier; the other tiers' names resolve to the same
 * row through `institutionalCatalog.js`). A tier whose nature differs from its family's has its
 * own entry under `at`, keyed by that tier's name.
 *
 * THE ARITHMETIC THAT CANNOT DOUBLE COUNT:
 *   shares   the house's loyalty, split over power ARCHETYPES, summing to exactly one. A house
 *            is spent once, however many powers it backs. A share goes to the leading faction
 *            of its archetype in that settlement (the highest power figure).
 *   fallback the one archetype that takes a share whose own archetype has no faction seated
 *            in that settlement; it may be one of the named archetypes, in which case the
 *            lapsed share merges into it (the seat takes the lord's share where no lord is
 *            seated). With no fallback, or the fallback absent too, the share lapses: nothing
 *            is pushed onto another power, because that would inflate it. A house whose every
 *            share lapsed answers to the ruling power at NO weight.
 *   weight   the house's political weight, 0 to 3: 0 for a house with no leverage of its own
 *            (a well, the dwellings, a travelling fiddler), 1 ordinary, 2 notable, 3 a
 *            landmark (a cathedral, a citadel, a guild hall, the seat itself).
 * No reason line per row (the owner, 2026-11-02: "No 'a one-line reason.' That the user receipt
 * just simply saying which ones they back in that row is plenty enough"). The user sees the
 * Backs row naming the powers; the Power tab captions a group with the typed archetype phrase
 * (`domain/dossier/powerSupport.js :: SUPPORT_BASIS`).
 *
 * THE EXACT MARK WINS: a house whose generated `factionSource` names the power that raised it
 * backs that power whole (`powerSupport.js :: houseBacksOf`), and the DM's own list (the
 * `backs` edit) replaces every derived reason. This table is the rule for every other house.
 *
 * The walker (tests/domain/dossier/powerSupport.test.js) holds: every placeable name resolves
 * to a row, no row is an orphan, every share set sums to one over known archetypes, every
 * fallback is a known archetype and never the row's only share, every weight is an integer 0 to 3.
 */

import { INSTITUTION_FAMILIES, INSTITUTION_TIERS } from './institutionalCatalog.js';

/** The archetypes a share may name, as `domain/factionArchetypes.js` spells them. */
export const BACKING_ARCHETYPES = Object.freeze([
  'government', 'noble', 'merchant', 'military', 'religious', 'criminal', 'arcane', 'craft',
]);

const G = 'government';
const N = 'noble';
const M = 'merchant';
const W = 'military';
const R = 'religious';
const C = 'criminal';
const A = 'arcane';
const K = 'craft';

/**
 * @typedef {Object} BackingRow
 * @property {Readonly<Record<string, number>>} shares  archetype -> share of the house, summing to one
 * @property {number} weight                             0 to 3
 * @property {string} [fallback]                         the archetype that takes a lapsed share
 */

/** @type {Readonly<Record<string, BackingRow & { at?: Readonly<Record<string, Partial<BackingRow>>> }>>} */
const ROWS = Object.freeze({
  // ── Economy ─────────────────────────────────────────────────────────────────────────────
  'Subsistence farming': { shares: { [N]: 0.6, [G]: 0.4 }, fallback: G, weight: 1 },
  'Common grazing land': { shares: { [N]: 0.5, [G]: 0.5 }, fallback: G, weight: 1 },
  'Communal root cellar': { shares: { [G]: 1 }, weight: 1 },
  "Fisher's landing": { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Fishmonger': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Fish market': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Shepherd': { shares: { [N]: 0.6, [M]: 0.4 }, fallback: G, weight: 1 },
  'Dairy farmer': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Beekeeper': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Wildfowler': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  "Woodcutter's camp": { shares: { [N]: 0.5, [M]: 0.5 }, fallback: G, weight: 1 },
  'Charcoal burner': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Peat cutter': { shares: { [N]: 1 }, fallback: G, weight: 1 },
  'Mine': { shares: { [N]: 0.5, [M]: 0.5 }, fallback: G, weight: 2 },
  'Stone quarry': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Salt works': { shares: { [G]: 0.5, [M]: 0.5 }, fallback: G, weight: 2 },
  "Hunter's lodge": { shares: { [N]: 0.6, [W]: 0.4 }, fallback: M, weight: 1 },
  "Furrier's district": { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Weekly market': {
    shares: { [M]: 1 }, fallback: G, weight: 1,
    at: { 'Daily markets': { weight: 2 }, 'District markets (5-10)': { weight: 3 } },
  },
  'Multiple market squares': { shares: { [M]: 1 }, fallback: G, weight: 2 },
  'Major annual fairs': { shares: { [M]: 1 }, fallback: G, weight: 2 },
  'International trade center': { shares: { [M]: 1 }, fallback: G, weight: 3 },
  'Merchant guilds (3-8)': {
    shares: { [M]: 1 }, fallback: G, weight: 2,
    at: { 'Merchant guilds (15-40)': { weight: 3 }, 'Merchant guilds (50-100+)': { weight: 3 } },
  },
  'Money changers': {
    shares: { [M]: 1 }, fallback: G, weight: 1,
    at: { 'Banking houses': { weight: 2 }, 'Banking district': { weight: 3 } },
  },
  'Pawnbroker': { shares: { [M]: 0.7, [C]: 0.3 }, fallback: M, weight: 1 },
  'Inns and taverns (district)': {
    shares: { [M]: 1 }, fallback: G, weight: 2,
    at: { 'Wayside inn': { weight: 1 }, "Travelers' inn": { weight: 1 }, 'Inn (multiple)': { weight: 1 } },
  },
  'Alehouse': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Coaching inn': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Caravanserai': { shares: { [M]: 1 }, fallback: G, weight: 2 },
  "Caravan masters' exchange": {
    shares: { [M]: 0.7, [W]: 0.3 }, fallback: G, weight: 2,
    at: { 'Waystation': { weight: 1 }, "Caravaneer's post": { weight: 1 } },
  },
  "Carriers' hiring hall": { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Pack animal trader': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Stable district': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Beast trainers': { shares: { [M]: 1 }, fallback: W, weight: 1 },
  'Post relay station': { shares: { [G]: 1 }, weight: 1 },
  'River ferry': { shares: { [G]: 1 }, fallback: M, weight: 1 },
  'River boatyard': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Shipyard': { shares: { [K]: 0.5, [M]: 0.5 }, fallback: G, weight: 2 },
  'Barge and river transport company': { shares: { [M]: 1 }, fallback: G, weight: 2 },
  'Docks/port facilities': { shares: { [M]: 0.6, [G]: 0.4 }, fallback: G, weight: 2 },
  "Harbour master's office": { shares: { [G]: 1 }, fallback: M, weight: 2 },
  'Toll bridge': { shares: { [G]: 1 }, fallback: N, weight: 1 },
  'Customs house': { shares: { [G]: 1 }, weight: 2 },
  'Town granary': {
    shares: { [G]: 1 }, weight: 2,
    at: { 'State granary complex': { weight: 3 } },
  },
  'Warehouse district': { shares: { [M]: 1 }, fallback: G, weight: 2 },
  'Public bathhouse': { shares: { [G]: 1 }, fallback: M, weight: 1 },
  'Slave market': { shares: { [M]: 0.7, [C]: 0.3 }, fallback: G, weight: 2 },
  'Slave market district': { shares: { [M]: 0.7, [C]: 0.3 }, fallback: G, weight: 3 },
  'Auction house': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  'Assay office': { shares: { [G]: 1 }, fallback: M, weight: 1 },
  'Mint (official)': { shares: { [G]: 1 }, weight: 3 },
  'Listening post': { shares: { [C]: 0.5, [G]: 0.5 }, fallback: G, weight: 1 },
  "Chroniclers' exchange": { shares: { [M]: 1 }, fallback: G, weight: 1 },

  // ── Crafts ──────────────────────────────────────────────────────────────────────────────
  'Mills (2-5)': {
    shares: { [N]: 1 }, fallback: G, weight: 1,
    at: { 'Access to external mill': { weight: 0 } },
  },
  'Maltster': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Blacksmiths (3-10)': {
    shares: { [K]: 1 }, fallback: M, weight: 2,
    at: { 'Resident smith (part-time)': { weight: 1 }, 'Blacksmith': { weight: 1 } },
  },
  'Specialized metalworkers': { shares: { [K]: 1 }, fallback: M, weight: 2 },
  'Jeweller': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Luxury goods quarter': { shares: { [M]: 1 }, fallback: K, weight: 2 },
  'Carpenters (5-15)': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Thatcher': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Cooper': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Apothecary district': {
    shares: { [K]: 1 }, fallback: M, weight: 2,
    at: { 'Apothecary': { weight: 1 }, 'Apothecary (established)': { weight: 1 } },
  },
  'Bowyers & fletchers (guild)': { shares: { [K]: 0.6, [W]: 0.4 }, fallback: G, weight: 1 },
  'Sawmill (commercial)': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Brewery': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Vintner': { shares: { [M]: 0.5, [N]: 0.5 }, fallback: M, weight: 1 },
  'Tanners': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Tanner (established)': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Fuller': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Dyer': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Weavers/Textile workers': { shares: { [K]: 0.6, [M]: 0.4 }, fallback: G, weight: 2 },
  'Potter': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Brickmaker': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  "Cobbler's guild": { shares: { [K]: 1 }, fallback: G, weight: 1 },
  "Tailor's guild": { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Butchers (3-8)': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Bakers (5-15)': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Smelter': { shares: { [K]: 1 }, fallback: M, weight: 2 },
  'Chandler': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Glassmakers': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Ropemaker': { shares: { [K]: 1 }, fallback: G, weight: 1 },
  'Midwife': { shares: { [R]: 1 }, fallback: G, weight: 1 },
  'Woodcarver': { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Village scribe': { shares: { [G]: 1 }, fallback: R, weight: 1 },
  'Printing house': { shares: { [K]: 0.5, [M]: 0.5 }, fallback: G, weight: 2 },
  "Cartographer's workshop": { shares: { [K]: 1 }, fallback: M, weight: 1 },
  'Craft guilds (5-15)': {
    shares: { [K]: 1 }, fallback: M, weight: 2,
    at: { 'Craft guilds (30-80)': { weight: 3 }, 'Craft guilds (100-150+)': { weight: 3 } },
  },
  'Alchemist quarter': {
    shares: { [A]: 1 }, fallback: K, weight: 2,
    at: { 'Alchemist shop': { weight: 1 } },
  },

  // ── Religious ───────────────────────────────────────────────────────────────────────────
  'Wayside shrine': { shares: { [R]: 1 }, weight: 1 },
  'Access to parish church': {
    shares: { [R]: 1 }, weight: 0,
    at: { 'Parish church': { weight: 2 }, 'Parish churches (2-5)': { weight: 2 }, 'Parish churches (10-30)': { weight: 3 }, 'Parish churches (50-100+)': { weight: 3 } },
  },
  'Burial ground': { shares: { [R]: 1 }, fallback: G, weight: 1 },
  'Priest (resident)': { shares: { [R]: 1 }, weight: 1 },
  'Monastery or friary': {
    shares: { [R]: 1 }, weight: 2,
    at: { 'Multiple monasteries': { weight: 3 }, 'Major monasteries (5-10)': { weight: 3 } },
  },
  'Cathedral (10,000+ only)': { shares: { [R]: 1 }, weight: 3 },
  'Small hospital': {
    shares: { [R]: 1 }, fallback: G, weight: 1,
    at: { 'Major hospital': { weight: 2 }, 'Hospital network': { weight: 3 } },
  },
  'Almshouse': { shares: { [R]: 1 }, fallback: G, weight: 1 },
  'Foundling home': { shares: { [R]: 1 }, fallback: G, weight: 1 },
  'Druid Circle': { shares: { [R]: 1 }, weight: 2 },
  'Elder Grove Council': { shares: { [R]: 0.6, [G]: 0.4 }, fallback: G, weight: 2 },

  // ── Government ──────────────────────────────────────────────────────────────────────────
  'Informal elder consensus': { shares: { [G]: 1 }, weight: 2 },
  'Head-of-household consensus': { shares: { [G]: 1 }, weight: 2 },
  "Lord's reeve": { shares: { [N]: 0.6, [G]: 0.4 }, fallback: G, weight: 2 },
  'Household elder': { shares: { [G]: 1 }, weight: 2 },
  "Lord's steward": {
    shares: { [N]: 0.7, [G]: 0.3 }, fallback: G, weight: 3,
    at: { "Lord's appointee": { weight: 2 } },
  },
  'Village headman': { shares: { [G]: 1 }, weight: 2 },
  'City administration': {
    shares: { [G]: 1 }, weight: 3,
    at: { 'Village reeve': { weight: 2 } },
  },
  'Village elder': { shares: { [G]: 1 }, weight: 2 },
  'Mayor and council': { shares: { [G]: 1 }, weight: 3 },
  'Guild consortium': { shares: { [K]: 0.5, [G]: 0.5 }, fallback: M, weight: 3 },
  'Merchant oligarchy': { shares: { [M]: 0.6, [G]: 0.4 }, fallback: G, weight: 3 },
  'City-state government': { shares: { [G]: 1 }, weight: 3 },
  'Democratic assembly': { shares: { [G]: 1 }, weight: 3 },
  'Royal seat': { shares: { [G]: 0.6, [N]: 0.4 }, fallback: G, weight: 3 },
  'Town crier': { shares: { [G]: 1 }, weight: 1 },

  // ── Infrastructure ──────────────────────────────────────────────────────────────────────
  'Dwellings (1-8)': { shares: { [G]: 1 }, weight: 0 },
  'Water source': {
    shares: { [G]: 1 }, weight: 0,
    at: { 'Aqueduct or water system': { weight: 2 }, 'Advanced water infrastructure': { weight: 2 } },
  },
  'City hall': { shares: { [G]: 1 }, weight: 3 },
  'Palace/government complex': { shares: { [G]: 0.7, [N]: 0.3 }, fallback: G, weight: 3 },
  'Courthouse': {
    shares: { [G]: 1 }, weight: 2,
    at: { 'Multiple courthouses': { weight: 3 }, 'Multiple court buildings': { weight: 3 } },
  },
  'Small prison/stocks': {
    shares: { [G]: 0.6, [W]: 0.4 }, fallback: G, weight: 1,
    at: { 'Large prison': { weight: 2 }, 'Massive prison': { weight: 2 } },
  },
  'Workhouse': { shares: { [G]: 1 }, fallback: M, weight: 1 },
  'Sewage system': { shares: { [G]: 1 }, weight: 1 },
  'Great library': { shares: { [A]: 0.4, [R]: 0.3, [G]: 0.3 }, fallback: G, weight: 3 },

  // ── Defense ─────────────────────────────────────────────────────────────────────────────
  'Palisade or earthworks': {
    shares: { [G]: 0.6, [W]: 0.4 }, fallback: G, weight: 1,
    at: { 'Town walls': { weight: 2 }, 'City walls and gates': { weight: 3 }, 'Massive walls and fortifications': { weight: 3 } },
  },
  'Gates (if walled)': { shares: { [G]: 0.5, [W]: 0.5 }, fallback: G, weight: 1 },
  'Citizen militia': {
    shares: { [G]: 0.7, [W]: 0.3 }, fallback: G, weight: 1,
    at: {
      'Household levy': { shares: { [G]: 1 }, fallback: W },
      'Town watch': { shares: { [W]: 0.6, [G]: 0.4 }, weight: 2 },
      'Professional city watch': { shares: { [W]: 0.8, [G]: 0.2 }, weight: 3 },
    },
  },
  'Village watch': { shares: { [G]: 0.6, [W]: 0.4 }, fallback: G, weight: 1 }, // F1: the village rung
  'Barracks': {
    shares: { [W]: 1 }, fallback: G, weight: 2,
    at: { 'Garrison': { weight: 3 }, 'Multiple garrisons': { weight: 3 } },
  },
  'Citadel': { shares: { [W]: 0.6, [G]: 0.4 }, fallback: G, weight: 3 },
  'Mercenary quarter': { shares: { [W]: 0.5, [M]: 0.5 }, fallback: G, weight: 2 },
  "Veteran's lodge": { shares: { [W]: 1 }, fallback: G, weight: 1 },
  "Warden's Lodge": { shares: { [W]: 0.5, [N]: 0.5 }, fallback: G, weight: 1 },

  // ── Magic ───────────────────────────────────────────────────────────────────────────────
  "Wizard's tower": {
    shares: { [A]: 1 }, weight: 2,
    at: { 'Traveling hedge wizard': { weight: 0 }, 'Hedge wizard': { weight: 1 } },
  },
  "Mages' guild": { shares: { [A]: 1 }, weight: 3 },
  'Academy of magic': { shares: { [A]: 1 }, weight: 3 },
  "Enchanter's shop": { shares: { [A]: 1 }, fallback: M, weight: 1 },
  'Scroll scribe': { shares: { [A]: 1 }, weight: 1 },
  'Teleportation circle': { shares: { [A]: 0.6, [G]: 0.4 }, fallback: G, weight: 2 },
  'Healer (divine, 1st level)': { shares: { [R]: 1 }, weight: 1 },
  'Planar embassy': { shares: { [G]: 0.5, [A]: 0.5 }, fallback: G, weight: 3 },

  // ── Adventuring ─────────────────────────────────────────────────────────────────────────
  "Adventurers' charter hall": {
    shares: { [W]: 0.5, [G]: 0.5 }, fallback: M, weight: 1,
    at: { "Multiple adventurers' guilds": { weight: 2 } },
  },
  'Hireling hall': { shares: { [M]: 1 }, fallback: W, weight: 1 },
  'Hired blades': { shares: { [W]: 0.6, [C]: 0.4 }, fallback: M, weight: 1 },
  'Dungeon delving supply district': { shares: { [M]: 1 }, fallback: G, weight: 1 },
  "Sage's quarter": { shares: { [A]: 0.6, [R]: 0.4 }, fallback: G, weight: 2 },

  // ── Criminal ────────────────────────────────────────────────────────────────────────────
  'Fence (word of mouth)': { shares: { [C]: 1 }, weight: 1 },
  'Outlaw shelter': { shares: { [C]: 1 }, weight: 1 },
  'Bandit affiliate': { shares: { [C]: 1 }, weight: 1 },
  'Smuggling waypoint': {
    shares: { [C]: 1 }, fallback: M, weight: 1,
    at: { 'Smuggling operation': { weight: 2 }, 'Smuggling network': { weight: 3 } },
  },
  'Multiple criminal factions': {
    shares: { [C]: 1 }, weight: 2,
    at: { 'Street gang': { weight: 1 } },
  },
  "Thieves' guild chapter": { shares: { [C]: 1 }, weight: 3 },
  'Front businesses': { shares: { [C]: 0.7, [M]: 0.3 }, fallback: C, weight: 1 },
  'Underground network': { shares: { [C]: 1 }, weight: 2 },
  'Underground city': { shares: { [C]: 1 }, weight: 3 },
  'Rookery': { shares: { [C]: 1 }, weight: 2 },
  'Whisper market': { shares: { [C]: 1 }, weight: 2 },
  'Black market': {
    shares: { [C]: 1 }, fallback: M, weight: 2,
    at: { 'Black market bazaar': { weight: 3 } },
  },
  'Contract killer': { shares: { [C]: 1 }, weight: 1 },
  "Assassins' guild": { shares: { [C]: 1 }, weight: 3 },
  'Kidnapping ring': { shares: { [C]: 1 }, weight: 1 },
  'Human trafficking network': { shares: { [C]: 1 }, fallback: M, weight: 2 },

  // ── Entertainment ───────────────────────────────────────────────────────────────────────
  'Village musician': { shares: { [G]: 1 }, weight: 0 },
  'Theaters': {
    shares: { [M]: 0.5, [N]: 0.5 }, fallback: G, weight: 1,
    at: { 'Multiple theaters': { weight: 2 } },
  },
  'Opera house': { shares: { [N]: 0.6, [M]: 0.4 }, fallback: G, weight: 3 },
  'Bardic college': { shares: { [N]: 0.6, [A]: 0.4 }, fallback: G, weight: 2 },
  'Gambling den': {
    shares: { [C]: 0.6, [M]: 0.4 }, fallback: M, weight: 1,
    at: { 'Gambling halls': { weight: 2 }, 'Gambling district': { weight: 3 } },
  },
  'Brothel (red light district)': {
    shares: { [C]: 0.6, [M]: 0.4 }, fallback: G, weight: 2,
    at: { 'Brothel': { weight: 1 } },
  },
  'Red light district': { shares: { [C]: 0.6, [M]: 0.4 }, fallback: G, weight: 2 },
  'Fighting pits': { shares: { [C]: 0.5, [M]: 0.5 }, fallback: M, weight: 1 },
  'Gladiatorial school': { shares: { [W]: 0.6, [N]: 0.4 }, fallback: M, weight: 2 },
  'Colosseum/arena': { shares: { [G]: 0.6, [N]: 0.4 }, fallback: M, weight: 3 },
  'Charlatan fortune tellers': { shares: { [C]: 1 }, fallback: M, weight: 0 },

  // ── Exotic ──────────────────────────────────────────────────────────────────────────────
  'Planar traders': { shares: { [M]: 0.6, [A]: 0.4 }, fallback: M, weight: 2 },
  'Dragon resident': { shares: { [G]: 1 }, weight: 0 },
  'Golem workforce': { shares: { [A]: 1 }, fallback: M, weight: 2 },
  'Undead labor': { shares: { [A]: 1 }, fallback: M, weight: 2 },
  'Dream parlors (high magic)': { shares: { [A]: 1 }, fallback: M, weight: 1 },
  'Airship docking (high magic)': { shares: { [M]: 0.6, [G]: 0.4 }, fallback: A, weight: 3 },
  'Message network (high magic)': { shares: { [G]: 0.6, [A]: 0.4 }, fallback: M, weight: 2 },
});

// ── Resolution: a house name -> its family row -> the tier's own entry ───────────────────
/** lower-cased tier name -> the family key (its row in ROWS) */
const FAMILY_KEY_BY_NAME = new Map();
/** family key -> every tier name of that family, in tier order */
const NAMES_BY_FAMILY = new Map();
for (const fam of INSTITUTION_FAMILIES) {
  /** @type {string[]} */ const names = [];
  for (const tier of INSTITUTION_TIERS) {
    const at = fam.at?.[tier];
    if (!at) continue;
    const n = String(at.name || fam.shared?.name || '');
    if (n && !names.includes(n)) names.push(n);
  }
  const key = String(fam.shared?.name || names[0] || '');
  if (!key) continue;
  NAMES_BY_FAMILY.set(key, names);
  for (const n of names) if (!FAMILY_KEY_BY_NAME.has(n.toLowerCase())) FAMILY_KEY_BY_NAME.set(n.toLowerCase(), key);
}

/** @param {Readonly<Record<string, Partial<BackingRow>>> | undefined} at @param {string} name */
function tierEntry(at, name) {
  if (!at) return null;
  const want = name.trim().toLowerCase();
  for (const [k, v] of Object.entries(at)) if (k.toLowerCase() === want) return v;
  return null;
}

/**
 * The backing row for a house, by its name (any tier's spelling, case-insensitive), the
 * tier's own entry laid over its family's. Null for a name the catalogue does not place.
 * @param {unknown} name @returns {BackingRow | null}
 */
export function backingRowFor(name) {
  const key = String(name ?? '').trim();
  if (!key) return null;
  const famKey = FAMILY_KEY_BY_NAME.get(key.toLowerCase());
  const fam = famKey ? ROWS[famKey] : undefined;
  if (!fam) return null;
  const over = tierEntry(fam.at, key);
  const { at: _at, ...base } = fam;
  return over ? { ...base, ...over } : base;
}

/** Every family key the table holds, for the walker. @returns {string[]} */
export function backingFamilyKeys() { return Object.keys(ROWS); }

/** Every placeable name, family by family, for the walker. @returns {Map<string, string[]>} */
export function catalogueNamesByFamily() { return new Map(NAMES_BY_FAMILY); }

/** The raw rows, frozen, for the walker to check shares, weights and fallbacks. */
export const BACKING_ROWS = ROWS;
