// institutionalCatalog.js — THE INSTITUTION REGISTRY: one definition per institution family.
//
// ── THE SHAPE (the urban-band rebuild, owner-approved 2026-09-30) ─────────────────────────────
// Each FAMILY is one function at every tier it exists (a smithy is a part-time smith at a
// hamlet, a blacksmith at a village, several smiths at a town). A family names ONE shelf, so a
// function can never be filed on two shelves at two scales again (Merchant warehouses sat on
// Adventuring while its city rung, Warehouse district, sat on Economy). `at` holds each tier's
// entry; `shared` holds the fields every entry agrees on.
//
// ── THE TWO CUMULATIVE LAWS (the owner, 2026-09-30) ───────────────────────────────────────────
//   "i think of towns as simply small cities intuitively rather than a slightly larger village.
//    it is where society and civizliation actually start to coalesce"
//   "make sure this also remains true from hamlet to village in terms of cumulative"
// 1. HAMLET → VILLAGE: every family with a hamlet entry has a village entry.
// 2. TOWN → CITY → METROPOLIS: every family with a town entry has city and metropolis entries,
//    and every city family has a metropolis entry.
// A family may stop only by declaring `ceiling: { tier, reason }` (and, where its function passes
// to another family's row, `successor`). Village → town is the one change of KIND; thorp keeps
// its own list. tests/lint/institutionRegistry.walker.test.js holds both laws.
//
// ── WHAT THE BUILDER DERIVES ──────────────────────────────────────────────────────────────────
// `institutionalCatalog[tier][shelf][name]` keeps the exact shape every reader already takes,
// and each tier block is now COMPLETE: the metropolis block no longer needs the city block
// merged in (that merge is retired in assembleInstitutions, the UI lookups and viability).
// Shelves iterate in SHELF_ORDER and rows in registry order — that order is the generation
// draw order, so re-ordering this file re-rolls every seed (THE PROMISE; a signed shift).
//
// Two row guards are new and are honoured by every pass that adds a catalog row (assemble,
// cascade, faction correlation) through `institutionRowGuardsPass(tier, name, …)`. They live in
// the registry and are looked up at the roll; they never ride onto a row or a save:
//   `minPopulation` — the row's own text states a population floor ("Cathedral (10,000+
//                     only)" rolled in cities under 10,000, 14 of 58 before this).
//   `requiresAny`   — the row needs one of the named institutions already seated
//                     ("Gates (if walled)" rolled without walls in 46 of 123 towns).

import { slugify as kernelSlugify } from '../kernel/slugify.js';

export const INSTITUTION_TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/** The display/cascade shelves in draw order (the same order cascadeGenerator walks). */
export const SHELF_ORDER = Object.freeze([
  'Economy', 'Crafts', 'Religious', 'Government', 'Infrastructure', 'Defense',
  'Magic', 'Adventuring', 'Criminal', 'Entertainment', 'Exotic',
]);

/** Every key a derived row may carry, in the order the builder writes them. */
const ROW_KEYS = Object.freeze([
  'required', 'baseChance', 'exclusiveGroup', 'exclusiveGroupCoexists',
  'tradeRouteRequired', 'terrainAccess', 'terrainRequired', 'forbiddenTradeRoutes', 'forbiddenResources',
  'exclusionConditions', 'desc', 'tags', 'magicLicense', 'priorityCategory', 'serviceKeys', 'facets',
]);
/** The keys a tier entry may declare that stay in the registry and never ride onto a row. */
const GUARD_KEYS = Object.freeze(['minPopulation', 'requiresAny']);
const ENTRY_KEYS = new Set(['name', ...ROW_KEYS, ...GUARD_KEYS]);

/**
 * @typedef {{ tier: string, reason: string }} FamilyCeiling
 * @typedef {{ shelf: string, shared?: Record<string, unknown>, at: Record<string, Record<string, unknown>>,
 *   ceiling?: FamilyCeiling, successor?: string }} InstitutionFamily
 */

/** @param {string} shelf @param {Omit<InstitutionFamily, 'shelf'>} spec @returns {InstitutionFamily} */
function family(shelf, spec) {
  return Object.freeze({ shelf, ...spec });
}

/** @type {ReadonlyArray<InstitutionFamily>} */
export const INSTITUTION_FAMILIES = Object.freeze([

  // ══════════════════════ ECONOMY ══════════════════════
  family('Economy', {
    shared: { required: true, baseChance: 1, tags: ['essential', 'agriculture'], priorityCategory: 'economy' },
    at: {
      thorp: { name: 'Subsistence farming', desc: 'Each household farms ~12-16 acres for survival.' },
      hamlet: { name: 'Subsistence farming', desc: 'Strip farming in open fields.' },
      village: { name: 'Farmland', desc: 'Open-field agriculture with crop rotation.' },
    },
    ceiling: { tier: 'village', reason: 'A town is fed by its hinterland: the granary and the market carry farming in the town roster.' },
  }),
  family('Economy', {
    shared: { name: 'Common grazing land', required: true, baseChance: 1, tags: ['essential', 'agriculture'], priorityCategory: 'economy' },
    at: {
      hamlet: { desc: 'Shared pasture for village livestock.' },
      village: { desc: 'Shared pasture for village livestock, held in common alongside the open fields.' },
    },
    ceiling: { tier: 'village', reason: 'Commons are a rural institution; towns graze on leased or enclosed land outside the walls.' },
  }),
  family('Economy', {
    shared: { name: 'Communal root cellar' },
    at: {
      thorp: { required: false, baseChance: 0.25, desc: 'A shared underground store for grain, roots, and preserved food. Vital buffer against a bad harvest.', tags: ['food', 'agriculture', 'essential'], priorityCategory: 'economy' },
    },
    ceiling: { tier: 'thorp', reason: 'A hamlet stores household by household; the granary is the town rung.' },
  }),
  family('Economy', {
    shared: { required: false, tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'], priorityCategory: 'economy' },
    at: {
      thorp: { name: 'Fishing community', baseChance: 0.72, desc: "Nets, traps, and drying racks. The settlement's economy is inseparable from the water.", tags: ['food', 'water', 'economy'] },
      hamlet: { name: "Fisher's landing", baseChance: 0.55, desc: 'A rough landing with racks for drying and salting fish. Primary protein source near water.', tags: ['trade'] },
      village: { name: "Fisher's landing", baseChance: 0.55, desc: 'A rough landing with racks for drying and salting fish. Primary protein source near water.', tags: ['trade'] },
    },
    ceiling: { tier: 'village', reason: 'At town scale the catch lands at the docks and is sold through the fish market.' },
    successor: 'Docks/port facilities',
  }),
  family('Economy', {
    shared: { name: 'Fishmonger' },
    at: {
      village: { required: false, baseChance: 0.35, forbiddenTradeRoutes: ['isolated'], desc: 'Buys, salts, and sells fish. The link between fishing and consumption. Near water: fresh. Inland: dried or salted.', tags: ['trade'], priorityCategory: 'economy' },
    },
    ceiling: { tier: 'village', reason: 'Absorbed by the fish market at town scale.' },
    successor: 'Fish market',
  }),
  family('Economy', {
    shared: { name: 'Fish market', required: false, tags: ['market', 'trade'], priorityCategory: 'government' },
    at: {
      village: { baseChance: 0.3, desc: "An open-air stall or small covered market where the day's catch is sold. Prices drop fast. Fish doesn't wait." },
      town: { baseChance: 0.45, desc: "A covered fish market under the market wardens. The morning's catch or the week's salted barrels, sold by weight and inspected for rot." },
      city: { baseChance: 0.55, desc: "A covered fish market under the market wardens. The morning's catch or the week's salted barrels, sold by weight and inspected for rot." },
      metropolis: { baseChance: 0.6, desc: "A covered fish market under the market wardens. The morning's catch or the week's salted barrels, sold by weight and inspected for rot." },
    },
  }),
  family('Economy', {
    shared: { required: false, priorityCategory: 'economy' },
    at: {
      thorp: { name: 'Shepherd collective', baseChance: 0.35, tradeRouteRequired: ['road', 'isolated', 'crossroads'], terrainRequired: ['plains', 'hills'], desc: 'Communal flock management. The rhythms of the settlement follow the grazing calendar.', tags: ['food', 'agriculture'] },
      hamlet: { name: 'Shepherd', baseChance: 0.22, desc: 'Manages sheep flocks for wool and meat. Seasonal transhumance. Moves flocks between lowland winter pasture and upland summer grazing. Key supplier to the textile trade.', tags: ['trade', 'textile'] },
      village: { name: 'Shepherd', baseChance: 0.22, desc: 'Manages sheep flocks for wool and meat. Seasonal transhumance. Moves flocks between lowland winter pasture and upland summer grazing. Key supplier to the textile trade.', tags: ['trade', 'textile'] },
    },
    ceiling: { tier: 'village', reason: 'Flocks graze the countryside; towns buy wool through the weavers and the market.' },
  }),
  family('Economy', {
    shared: { name: 'Dairy farmer', required: false, tags: ['food', 'trade'], priorityCategory: 'economy' },
    at: {
      hamlet: { baseChance: 0.25, desc: 'Keeps cattle or goats for milk, butter, and cheese. The only reliable fat and protein source during grain shortages. Seasonal. Production peaks in summer.' },
      village: { baseChance: 0.22, desc: 'Keeps cattle or goats for milk, butter, and soft cheese. Essential protein and fat during lean grain seasons. Sells surplus at the weekly market.' },
    },
    ceiling: { tier: 'village', reason: 'Dairying is rural; towns buy milk, butter, and cheese at market.' },
  }),
  family('Economy', {
    shared: { name: 'Beekeeper' },
    at: {
      village: { required: false, baseChance: 0.2, desc: 'Maintains hives for honey and beeswax. Honey sweetens; beeswax makes candles, wax seals, and polish.', tags: ['trade'], priorityCategory: 'economy' },
    },
    ceiling: { tier: 'village', reason: 'Hives are kept in the countryside; the town chandler buys the wax.' },
  }),
  family('Economy', {
    shared: { name: 'Wildfowler' },
    at: {
      village: { required: false, baseChance: 0.15, desc: 'Catches waterfowl and game birds using nets, traps, and trained birds. Supplies the market with ducks, geese, and pigeons.', tags: ['trade'], priorityCategory: 'economy' },
    },
    ceiling: { tier: 'village', reason: 'Fowling is a marsh and field trade; towns buy the birds at market.' },
  }),
  family('Economy', {
    shared: { name: "Woodcutter's camp", terrainRequired: ['forest'], tags: ['economy', 'timber'], priorityCategory: 'economy' },
    at: {
      thorp: { required: false, baseChance: 0.55, desc: 'Seasonal felling and timber stacking. The whole settlement smells of fresh sawdust and pine resin.' },
      hamlet: { baseChance: 0.45, desc: 'Felling crews and a stacking yard at the forest edge. The settlement lives on timber, charcoal wood, and the carting of both.' },
      village: { baseChance: 0.45, desc: 'Felling crews and a stacking yard at the forest edge. The settlement lives on timber, charcoal wood, and the carting of both.' },
    },
    ceiling: { tier: 'village', reason: 'Timber reaches towns as sawn stock; the commercial sawmill is the town rung of the trade.' },
  }),
  family('Economy', {
    shared: { name: 'Charcoal burner', required: false, tags: ['trade'], priorityCategory: 'economy' },
    at: {
      hamlet: { baseChance: 0.2, desc: 'Operates kilns in nearby woodland. Supplies fuel for smithing and baking. Essential intermediate step between forest and forge.' },
      village: { baseChance: 0.18, desc: "Operates kilns in the surrounding woodland, supplying fuel for smithing, baking, and heating. The settlement's most reliable fuel source when timber is abundant." },
      town: { baseChance: 0.2, desc: 'Kiln crews in the surrounding woodland supply charcoal to the smelters, smiths, and bakers. Metalworking here burns through a forest a generation.' },
      city: { baseChance: 0.15, desc: 'Kiln crews in the surrounding woodland supply charcoal to the smelters, smiths, and bakers. Metalworking here burns through a forest a generation.' },
      metropolis: { baseChance: 0.15, desc: 'Kiln crews in the surrounding woodland supply charcoal to the smelters, smiths, and bakers. Metalworking here burns through a forest a generation.' },
    },
  }),
  family('Economy', {
    shared: { name: 'Peat cutter', required: false, baseChance: 0.18, desc: 'Cuts and dries peat blocks from nearby marshland for domestic fuel. Seasonal. Sells winter warmth.', tags: ['trade'], priorityCategory: 'economy' },
    at: {
      hamlet: {},
      village: {},
    },
    ceiling: { tier: 'village', reason: 'Peat is cut for the household hearth; towns buy fuel through the charcoal and coal trade.' },
  }),
  family('Economy', {
    shared: { required: false, tags: ['trade'], priorityCategory: 'economy' },
    at: {
      hamlet: { name: 'Mine (open cast)', baseChance: 0.2, desc: 'A shallow excavation or shaft dug to extract iron ore, coal, or stone. Employs the poorest labourers. Dangerous, dirty, and essential.' },
      village: { name: 'Mine', baseChance: 0.12, desc: 'A shaft or excavation to extract iron ore, coal, or stone. Requires capital and organisation a thorp cannot sustain, but a village near deposits can. Employs the poorest labourers.' },
      town: { name: 'Mine', baseChance: 0.12, desc: 'A worked shaft or adit with hired crews, winding gear, and ore carts. Where the deposits run deep, the mine is the reason the settlement grew.' },
      city: { name: 'Mine', baseChance: 0.08, desc: 'A worked shaft or adit with hired crews, winding gear, and ore carts. Where the deposits run deep, the mine is the reason the settlement grew.' },
      metropolis: { name: 'Mine', baseChance: 0.08, desc: 'A worked shaft or adit with hired crews, winding gear, and ore carts. Where the deposits run deep, the mine is the reason the settlement grew.' },
    },
  }),
  family('Economy', {
    shared: { name: 'Stone quarry', required: false, tags: ['trade'], priorityCategory: 'economy' },
    at: {
      hamlet: { baseChance: 0.18, desc: 'Cuts and dresses stone blocks for construction. A crew of quarrymen with picks and wedges. Slow but the only way to get proper building material.' },
      village: { baseChance: 0.15, desc: "Systematic extraction of building stone. A village on good quarry land can supply half a region's construction needs, and the quarry master knows it." },
      town: { baseChance: 0.15, desc: 'A working quarry with dressed-stone yards and a crew of masons. Builds the walls and churches of half the region.' },
      city: { baseChance: 0.1, desc: 'A working quarry with dressed-stone yards and a crew of masons. Builds the walls and churches of half the region.' },
      metropolis: { baseChance: 0.1, desc: 'A working quarry with dressed-stone yards and a crew of masons. Builds the walls and churches of half the region.' },
    },
  }),
  family('Economy', {
    shared: { name: 'Salt works', required: false, tags: ['trade'], priorityCategory: 'economy' },
    at: {
      hamlet: { baseChance: 0.2, desc: 'Evaporates naturally saline brine into the raw salt used for preservation. Viable only where salt flats, springs, or other workable brine deposits provide a local supply.' },
      village: { baseChance: 0.14, tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'], desc: "Evaporation pans or brine processing along the coast or riverbank. Salt is the settlement's most traded commodity by weight. Every household needs it." },
      town: { baseChance: 0.15, tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'], desc: "Evaporation pans or brine processing along the coast or riverbank. Salt is the settlement's most traded commodity by weight. Every household needs it." },
      city: { baseChance: 0.12, tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'], desc: "Evaporation pans or brine processing along the coast or riverbank. Salt is the settlement's most traded commodity by weight. Every household needs it." },
      metropolis: { baseChance: 0.12, tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'], desc: "Evaporation pans or brine processing along the coast or riverbank. Salt is the settlement's most traded commodity by weight. Every household needs it." },
    },
  }),
  family('Economy', {
    shared: { name: "Hunter's lodge", required: false, tags: ['trade', 'military'], priorityCategory: 'economy' },
    at: {
      hamlet: { baseChance: 0.25, desc: 'Hunters pool knowledge, prepare game, and sell pelts. Tracks routes, seasons, and dangerous animals.' },
      village: { baseChance: 0.18, desc: "Organises hunting parties across the surrounding territory. Sells venison, pelts, and game to market. Doubles as a source of local wilderness knowledge: which trails are safe, which aren't." },
      town: { baseChance: 0.15, desc: "Organises hunting parties across the surrounding territory. Sells venison, pelts, and game to market. Doubles as a source of local wilderness knowledge: which trails are safe, which aren't." },
    },
    ceiling: { tier: 'town', reason: 'Cities buy game and pelts through the furriers rather than keeping their own hunters.' },
    successor: "Furrier's district",
  }),
  family('Economy', {
    shared: { name: "Furrier's district", required: false, baseChance: 0.35, desc: 'Fur processors, traders, and retailers concentrated in one area. High-value trade. Quality furs are luxury goods.', tags: ['trade', 'guild'], priorityCategory: 'economy' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Economy', {
    shared: { exclusiveGroup: 'marketScale', priorityCategory: 'economy' },
    at: {
      hamlet: { name: 'Periodic market', required: false, baseChance: 0.12, desc: 'Monthly or seasonal trading day. No charter. Just habit, proximity, and a flat piece of ground.', tags: ['market', 'trade'] },
      village: { name: 'Weekly market', required: false, baseChance: 0.6, desc: 'Local produce and goods. Requires royal/noble charter.', tags: ['market', 'trade'] },
      town: { name: 'Weekly market', required: true, baseChance: 1, desc: 'Royal charter required. Major economic driver.', tags: ['essential', 'market', 'trade'] },
      city: { name: 'Daily markets', required: true, baseChance: 1, desc: 'Permanent market activity in multiple locations.', tags: ['essential', 'market', 'trade'] },
      metropolis: { name: 'District markets (5-10)', required: true, baseChance: 1, desc: 'Five to ten permanent specialized market districts: grain, livestock, cloth, metals, exotica.', tags: ['essential', 'market', 'trade'] },
    },
  }),
  family('Economy', {
    shared: { required: true, baseChance: 1, tags: ['essential', 'market'], priorityCategory: 'economy' },
    at: {
      town: { name: 'Market square', desc: 'Central plaza for weekly markets and fairs. 50-100 yards per side.' },
      city: { name: 'Multiple market squares', desc: 'Multiple permanent market squares serve different districts.' },
      metropolis: { name: 'Multiple market squares', desc: 'Multiple permanent market squares serve different districts.' },
    },
  }),
  family('Economy', {
    shared: { required: false, tags: ['market', 'trade'], priorityCategory: 'economy' },
    at: {
      town: { name: 'Annual fair', baseChance: 0.7, desc: 'Regional merchants. Luxury goods available.' },
      city: { name: 'Major annual fairs', baseChance: 0.9, desc: 'International merchants. Letters of credit accepted.' },
      metropolis: { name: 'Major annual fairs', baseChance: 0.9, desc: 'International merchants. Letters of credit accepted.' },
    },
  }),
  family('Economy', {
    shared: { name: 'International trade center' },
    at: {
      metropolis: { required: false, baseChance: 0.55, desc: 'Hub for international merchant representatives, trade arbitration, and commodity exchange.', tags: ['trade', 'market'], priorityCategory: 'economy' },
    },
  }),
  family('Economy', {
    shared: { required: false, tags: ['guild', 'trade'], priorityCategory: 'economy' },
    at: {
      town: { name: 'Merchant guilds (3-8)', baseChance: 0.8, desc: 'Control trade in specific goods.' },
      city: { name: 'Merchant guilds (15-40)', baseChance: 0.95, desc: 'Powerful political force.' },
      metropolis: { name: 'Merchant guilds (50-100+)', baseChance: 0.95, desc: 'Dozens of merchant guilds representing every major trade good and route. A formal guild parliament.' },
    },
  }),
  family('Economy', {
    shared: { required: false, tags: ['banking', 'trade'], priorityCategory: 'economy' },
    at: {
      town: { name: 'Money changers', baseChance: 0.5, minPopulation: 3000, desc: 'Exchange foreign currency. Early banking (3,000+ population).' },
      city: { name: 'Banking houses', baseChance: 0.7, desc: 'Loans, currency exchange, letters of credit. Basic banking (5,000+).' },
      metropolis: { name: 'Banking district', baseChance: 0.8, desc: 'Consolidated financial quarter: international banking, letters of credit, currency speculation at scale.' },
    },
  }),
  family('Economy', {
    shared: { name: 'Pawnbroker', required: false, tags: ['banking'], priorityCategory: 'government' },
    at: {
      hamlet: { baseChance: 0.15, desc: 'Lending against pledged goods. High interest, no questions. The only credit available to peasants and small craftsmen.' },
      village: { baseChance: 0.2, desc: 'Lending against pledged goods. High interest, no questions. The only credit available to peasants and small craftsmen.' },
      town: { baseChance: 0.3, desc: 'Lends against pledged goods at high interest and asks no questions. The only credit open to labourers, journeymen, and anyone the banks turn away.' },
      city: { baseChance: 0.35, desc: 'Lends against pledged goods at high interest and asks no questions. The only credit open to labourers, journeymen, and anyone the banks turn away.' },
      metropolis: { baseChance: 0.4, desc: 'Lends against pledged goods at high interest and asks no questions. The only credit open to labourers, journeymen, and anyone the banks turn away.' },
    },
  }),
  family('Economy', {
    shared: { priorityCategory: 'economy' },
    at: {
      hamlet: { name: 'Wayside inn', required: false, baseChance: 0.2, desc: 'A room above a stable and a common meal for travelers passing through. Exists because the road does.', tags: ['trade', 'lodging'] },
      village: { name: "Travelers' inn", required: false, baseChance: 0.6, desc: 'A single inn serving traders, pilgrims, and travelers passing through. Rooms, stabling, and a common meal.', tags: ['trade', 'lodging'] },
      town: { name: 'Inn (multiple)', required: true, baseChance: 1, desc: 'Lodging for traveling merchants.', tags: ['trade'] },
      city: { name: 'Inns and taverns (district)', required: true, baseChance: 1, desc: 'Multiple inn districts catering to merchants, travelers, and long-term visitors.', tags: ['trade', 'lodging'] },
      metropolis: { name: 'Inns and taverns (district)', required: true, baseChance: 1, desc: 'Multiple inn districts catering to merchants, travelers, and long-term visitors.', tags: ['trade', 'lodging'] },
    },
  }),
  family('Economy', {
    shared: { priorityCategory: 'economy' },
    at: {
      hamlet: { name: 'Alehouse', required: false, baseChance: 0.55, desc: "Home-brewed ale sold from someone's back room. The hamlet's main gathering place. News, disputes, and arrangements all happen here.", tags: ['food', 'trade'] },
      village: { name: 'Ale house', required: false, baseChance: 0.8, desc: 'Home-based. Women brew and sell ale.', tags: ['food'] },
      town: { name: 'Taverns (5-20)', required: true, baseChance: 1, desc: 'Drinking establishments. Social hubs.', tags: ['food'] },
    },
    ceiling: { tier: 'town', reason: 'At city scale drink and lodging share one district row.' },
    successor: 'Inns and taverns (district)',
  }),
  family('Economy', {
    shared: { name: 'Coaching inn', required: false, forbiddenTradeRoutes: ['isolated', 'port'], desc: 'Purpose-built for road travellers: stabling for relay horses, scheduled coach departures, meals served at fixed hours, and a passenger waiting room. Horses changed here, not just rested.', tags: ['transport', 'lodging'], priorityCategory: 'economy' },
    at: {
      town: { baseChance: 0.5 },
      city: { baseChance: 0.55 },
      metropolis: { baseChance: 0.55 },
    },
  }),
  family('Economy', {
    shared: { name: 'Caravanserai', required: false, terrainRequired: ['desert'], tags: ['trade', 'lodging', 'transport'], priorityCategory: 'economy' },
    at: {
      hamlet: { baseChance: 0.15, desc: 'A walled waystation providing secure overnight lodging for merchants, animals, and goods. The centre of desert trade: water, fodder, and protection available for a fee. Without one, caravans cannot safely cross the surrounding terrain.' },
      village: { baseChance: 0.2, desc: 'A substantial walled compound for desert merchants: stabling for camels, locked storage, a well, and sleeping quarters for fifty. The economic hub of any desert settlement that sees caravan traffic.' },
      town: { baseChance: 0.3, desc: 'A substantial walled compound for desert merchants: stabling for camels, locked storage, a well, and sleeping quarters for fifty. The economic hub of any desert settlement that sees caravan traffic.' },
      city: { baseChance: 0.35, desc: 'A substantial walled compound for desert merchants: stabling for camels, locked storage, a well, and sleeping quarters for fifty. The economic hub of any desert settlement that sees caravan traffic.' },
      metropolis: { baseChance: 0.35, desc: 'A substantial walled compound for desert merchants: stabling for camels, locked storage, a well, and sleeping quarters for fifty. The economic hub of any desert settlement that sees caravan traffic.' },
    },
  }),
  family('Economy', {
    shared: { required: false },
    at: {
      village: { name: 'Waystation', baseChance: 0.25, desc: 'A fortified overnight stop with stabling, a well, and basic provisions. Serves merchant caravans and long-distance travellers. Distinct from the inn. Built for animals and loaded wagons, not comfort.', tags: ['transport', 'lodging'], priorityCategory: 'economy' },
      town: { name: "Caravaneer's post", baseChance: 0.3, forbiddenTradeRoutes: ['isolated'], desc: "Coordinates regional caravan assembly, departure schedules, and route intelligence. Merchants register goods, hire guards, and arrange joint ventures here. The town-scale predecessor to the city's Caravan masters' exchange.", tags: ['transport', 'guild', 'trade'], priorityCategory: 'government' },
      city: { name: "Caravan masters' exchange", baseChance: 0.6, forbiddenTradeRoutes: ['isolated', 'port'], desc: 'The city-scale version: permanent offices where caravan masters, merchants, and armed escorts transact. Bonded freight, route intelligence, armed convoy assembly, and commercial dispute resolution.', tags: ['transport', 'trade', 'military'], priorityCategory: 'economy' },
      metropolis: { name: "Caravan masters' exchange", baseChance: 0.6, forbiddenTradeRoutes: ['isolated', 'port'], desc: 'The city-scale version: permanent offices where caravan masters, merchants, and armed escorts transact. Bonded freight, route intelligence, armed convoy assembly, and commercial dispute resolution.', tags: ['transport', 'trade', 'military'], priorityCategory: 'economy' },
    },
  }),
  // The hiring hall sat at town beside the carriers' guild it is the lesser form of, and never
  // survived there (0 of 200 towns). It is the village rung.
  family('Economy', {
    shared: { required: false, priorityCategory: 'economy' },
    at: {
      village: { name: "Carriers' hiring hall", baseChance: 0.3, forbiddenTradeRoutes: ['isolated', 'port', 'river'], desc: 'A yard where carters, teamsters, and pack-animal drivers can be hired for the road. Returning drivers share road conditions and bandit reports over a cup of ale. Transactional, not institutional.', tags: ['transport', 'trade'] },
      town: { name: "Carriers' guild", baseChance: 0.65, desc: 'A guild of professional carters, teamsters, and pack-animal drivers who move goods overland for hire. They know every road, every toll, every seasonal closure, and they charge accordingly.', tags: ['transport', 'trade', 'guild'] },
    },
    ceiling: { tier: 'town', reason: 'City haulage is bonded through the caravan masters.' },
    successor: "Caravan masters' exchange",
  }),
  family('Economy', {
    shared: { name: 'Pack animal trader', required: false, desc: 'Buys and sells mules, donkeys, and draft horses. Rents animals to travellers and merchants who need load-carrying capacity for the road.', tags: ['trade', 'transport'], priorityCategory: 'economy' },
    at: {
      hamlet: { baseChance: 0.2 },
      village: { baseChance: 0.25 },
    },
    ceiling: { tier: 'village', reason: "Absorbed by the caravaneer's post at town scale." },
    successor: "Caravaneer's post",
  }),
  family('Economy', {
    shared: { required: false, tags: ['trade'] },
    at: {
      hamlet: { name: 'Stable yard', baseChance: 0.25, desc: 'Communal stable where travelers can leave horses. Stableman provides basic farriery and fodder.', priorityCategory: 'economy' },
      village: { name: 'Stable master', baseChance: 0.4, desc: 'Maintains stabling, trains horses for riding and draft work. Essential for any settlement on a road.', priorityCategory: 'economy' },
      town: { name: 'Stable district', baseChance: 0.4, desc: 'Concentrated stabling, horse trading, and farriery. Serves merchants, military, and travelers needing fresh mounts.', priorityCategory: 'government' },
      city: { name: 'Stable district', baseChance: 0.5, desc: 'Concentrated stabling, horse trading, and farriery. Serves merchants, military, and travelers needing fresh mounts.', priorityCategory: 'government' },
      metropolis: { name: 'Stable district', baseChance: 0.5, desc: 'Concentrated stabling, horse trading, and farriery. Serves merchants, military, and travelers needing fresh mounts.', priorityCategory: 'government' },
    },
  }),
  // The town rung of the animal-trade ladder (Stable yard → Stable master → Beast trainers) in
  // supplyChainData; filed on Adventuring until 2026-09-30.
  family('Economy', {
    shared: { name: 'Beast trainers', required: false, desc: 'Common animals only. Horses, dogs, falcons.', tags: [], priorityCategory: 'adventuring' },
    at: {
      town: { baseChance: 0.3 },
      city: { baseChance: 0.45 },
      metropolis: { baseChance: 0.5 },
    },
  }),
  family('Economy', {
    shared: { name: 'Post relay station', required: false, requiresAny: ['Coaching inn'], desc: 'Maintains a team of horses for rapid message relay out of the coaching inn. Letters and small packages travel far faster than foot traffic.', tags: ['trade'], priorityCategory: 'government' },
    at: {
      town: { baseChance: 0.3 },
      city: { baseChance: 0.45 },
      metropolis: { baseChance: 0.5 },
    },
  }),
  family('Economy', {
    shared: { name: 'River ferry', required: false, tradeRouteRequired: ['river', 'port'], terrainAccess: ['riverside'], desc: "A flat-bottomed ferry crossing the river. The ferryman's family has held the crossing rights for generations. Essential for anyone who doesn't want a long walk to the nearest bridge.", tags: ['transport', 'trade'], priorityCategory: 'economy' },
    at: {
      village: { baseChance: 0.45 },
      town: { baseChance: 0.4 },
      city: { baseChance: 0.3 },
      metropolis: { baseChance: 0.3 },
    },
  }),
  family('Economy', {
    shared: { name: 'River boatyard', required: false, tradeRouteRequired: ['river', 'port'], terrainAccess: ['riverside'], desc: 'Builds and repairs flat-bottomed river craft: barges, punts, ferries, fishing boats. Specialist knowledge of river construction: shallow draft, flexible hull, replaceable parts.', tags: ['transport', 'shipbuilding'], priorityCategory: 'crafts' },
    at: {
      village: { baseChance: 0.3 },
      town: { baseChance: 0.4 },
      city: { baseChance: 0.4 },
      metropolis: { baseChance: 0.4 },
    },
  }),
  family('Economy', {
    shared: { name: 'Shipyard', required: false, forbiddenTradeRoutes: ['road', 'crossroads', 'mountain_pass', 'isolated', 'river'], priorityCategory: 'crafts' },
    at: {
      town: { baseChance: 0.35, desc: 'Constructs and repairs ocean-going merchant vessels. Requires steady timber supply, iron fittings, and specialist shipwright labour. A major employer and a significant capital investment.', tags: ['transport', 'shipbuilding', 'port'] },
      city: { baseChance: 0.45, desc: 'City-scale shipyard constructing large merchant and war vessels. Multiple dry docks, ropewalk, sail loft, and dedicated ironworks. A major employer and a strategic military asset.', tags: ['transport', 'shipbuilding', 'port', 'military'] },
      metropolis: { baseChance: 0.45, desc: 'City-scale shipyard constructing large merchant and war vessels. Multiple dry docks, ropewalk, sail loft, and dedicated ironworks. A major employer and a strategic military asset.', tags: ['transport', 'shipbuilding', 'port', 'military'] },
    },
  }),
  family('Economy', {
    shared: { name: 'Barge and river transport company', required: false, forbiddenTradeRoutes: ['road', 'crossroads', 'mountain_pass', 'isolated', 'port'], desc: 'Operates a fleet of river barges on scheduled and commissioned runs. Carries bulk cargo, passengers, and military supply along the river network.', tags: ['transport', 'trade', 'port'], priorityCategory: 'economy' },
    at: {
      town: { baseChance: 0.3 },
      city: { baseChance: 0.55 },
      metropolis: { baseChance: 0.55 },
    },
  }),
  family('Economy', {
    shared: { name: 'Docks/port facilities', required: false, tradeRouteRequired: ['port', 'river'], tags: ['port', 'trade'], priorityCategory: 'economy' },
    at: {
      town: { baseChance: 0.55, desc: 'River or coastal dock. Essential for bulk water trade and river transport.' },
      city: { baseChance: 0.6, desc: 'If coastal or river access. Essential for bulk trade.' },
      metropolis: { baseChance: 0.6, desc: 'If coastal or river access. Essential for bulk trade.' },
    },
  }),
  family('Economy', {
    shared: { name: "Harbour master's office", required: false, tradeRouteRequired: ['port', 'river'], desc: 'Regulates harbour and river-port traffic, collects anchorage fees, assigns berths, and enforces port law. Navigable-water cities only.', tags: ['law_enforcement', 'port'], priorityCategory: 'economy' },
    at: {
      town: { baseChance: 0.25 },
      city: { baseChance: 0.4 },
      metropolis: { baseChance: 0.4 },
    },
  }),
  family('Economy', {
    shared: { name: 'Toll bridge', required: false, desc: 'A bridge with a toll house. The keeper collects passage fees and performs basic maintenance. Minor but steady revenue.', tags: ['trade'], priorityCategory: 'government' },
    at: {
      village: { baseChance: 0.2 },
      town: { baseChance: 0.3 },
      city: { baseChance: 0.3 },
      metropolis: { baseChance: 0.25 },
    },
  }),
  family('Economy', {
    shared: { name: 'Customs house', required: false, desc: 'Levies duties on goods entering and leaving via the port or main roads. Run by royal or municipal officials.', tags: ['guild', 'law_enforcement'], priorityCategory: 'government' },
    at: {
      town: { baseChance: 0.35 },
      city: { baseChance: 0.55 },
      metropolis: { baseChance: 0.65 },
    },
  }),
  family('Economy', {
    shared: { required: true, baseChance: 1, tags: ['essential', 'food'], priorityCategory: 'economy' },
    at: {
      town: { name: 'Town granary', desc: 'Communal grain storage. Buffers harvests, prevents famine.' },
      city: { name: 'City granaries', desc: 'Multiple large grain stores distribute food across the city. State managed.' },
      metropolis: { name: 'State granary complex', desc: 'State-administered granary network holding strategic reserves.' },
    },
  }),
  // One function at two scales: filed on Adventuring at town and Economy at city until 2026-09-30.
  family('Economy', {
    shared: { priorityCategory: 'economy' },
    at: {
      town: { name: 'Merchant warehouses', required: false, baseChance: 0.65, desc: 'Warehouse facilities for merchants storing goods awaiting sale, transit, or seasonal distribution. Essential infrastructure for any trade route settlement.', tags: ['trade', 'trade'] },
      city: { name: 'Warehouse district', required: true, baseChance: 1, desc: 'Storage for merchant goods.', tags: ['warehouse', 'trade'] },
      metropolis: { name: 'Warehouse district', required: true, baseChance: 1, desc: 'Storage for merchant goods.', tags: ['warehouse', 'trade'] },
    },
  }),
  family('Economy', {
    shared: { name: 'Public bathhouse', required: false, tags: ['trade', 'sanitation'], priorityCategory: 'government' },
    at: {
      town: { baseChance: 0.3, desc: 'Communal bathing facility with heated water. In some cultures a social hub; in others suspect as a venue for vice. Either way, the best place in the town to hear rumour and news.' },
      city: { baseChance: 0.5, desc: 'Communal bathing facility with heated water. In some cultures a social hub; in others suspect as a venue for vice. Either way, the best place in the district to hear rumour and news.' },
      metropolis: { baseChance: 0.6, desc: 'Communal bathing facility with heated water. In some cultures a social hub; in others suspect as a venue for vice. Either way, the best place in the district to hear rumour and news.' },
    },
  }),
  family('Economy', {
    shared: { name: 'Slave market', required: false, tags: ['trade', 'trade'], priorityCategory: 'economy' },
    at: {
      town: { baseChance: 0.1, desc: 'Public auction of enslaved persons: war captives, debtors, convicted criminals, and trafficked individuals. Where slavery is legally sanctioned, this is civic commercial infrastructure.' },
      city: { baseChance: 0.3, desc: 'Established auction block with holding facilities, registered brokers, and provenance documentation. Legally sanctioned commerce in persons: taxed, regulated, and embedded in the city economy.' },
      metropolis: { baseChance: 0.3, desc: 'Established auction block with holding facilities, registered brokers, and provenance documentation. Legally sanctioned commerce in persons: taxed, regulated, and embedded in the city economy.' },
    },
  }),
  family('Economy', {
    shared: { name: 'Slave market district', required: false, baseChance: 0.25, desc: 'A permanent, licensed district for commerce in persons: auction halls, holding compounds, broker offices, and associated legal and financial infrastructure. Operates at a scale beyond a single market block.', tags: ['trade', 'trade'], priorityCategory: 'economy' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Economy', {
    shared: { name: 'Auction house', required: false, desc: "Formal venue for selling high-value goods: estates, ships, livestock, art, and occasionally persons. Charges buyer's and seller's premiums.", tags: ['market', 'guild'], priorityCategory: 'economy' },
    at: {
      town: { baseChance: 0.1 },
      city: { baseChance: 0.35 },
      metropolis: { baseChance: 0.4 },
    },
  }),
  family('Economy', {
    shared: { name: 'Assay office', required: false, tags: ['banking', 'guild'], priorityCategory: 'government' },
    at: {
      town: { baseChance: 0.2, desc: 'Tests the purity of precious metals brought to the town. Essential infrastructure for banking and minting. Charges fees per assay.' },
      city: { baseChance: 0.3, desc: 'Tests the purity of precious metals brought to market. Essential infrastructure for banking and minting. Charges fees per assay.' },
      metropolis: { baseChance: 0.3, desc: 'Tests the purity of precious metals brought to market. Essential infrastructure for banking and minting. Charges fees per assay.' },
    },
  }),
  // The town Mint was filed on Crafts and the city's Mint (official) on Economy until 2026-09-30.
  family('Economy', {
    shared: { required: false, tags: ['banking', 'guild'] },
    at: {
      town: { name: 'Mint', baseChance: 0.15, desc: 'Converts refined precious metal into standardised coinage. Requires noble or royal charter. Significant revenue for the granting authority.', priorityCategory: 'government' },
      city: { name: 'Mint (official)', baseChance: 0.4, desc: 'State or noble-chartered coin production. Standardises currency across the region. Significant ongoing revenue via seigniorage.', priorityCategory: 'economy' },
      metropolis: { name: 'Mint (official)', baseChance: 0.4, desc: 'State or noble-chartered coin production. Standardises currency across the region. Significant ongoing revenue via seigniorage.', priorityCategory: 'economy' },
    },
  }),
  // [W-I INFORMATION BROKERAGES] I1, the legal MINOR form (design §3). A brokerage is HOW TALK IS
  // WEIGHED, never where it happens: the rumour-source houses (inns, bathhouses, fences) keep their
  // own role and are tagged separately in data/informationBrokerageTuning.js. `serviceKeys` is the
  // closed capability vocabulary every effect reads (never the name) so custom brokerage-class
  // content declaring the same keys behaves identically. Route-gated because information follows
  // roads. The city keeps BOTH legal forms on purpose: the subsumption pass collapses the minor
  // house into the guild form when both land.
  family('Economy', {
    shared: { name: 'Listening post', required: false, forbiddenTradeRoutes: ['isolated', 'none'], desc: 'A licensed house that pays for road news and keeps the register: who arrived, from where, and what they carried word of. Cheap to run and openly taxed, which is why it appears wherever traffic does and nowhere that it does not.', tags: ['legal', 'information', 'brokerage'], priorityCategory: 'economy', serviceKeys: ['info_calibration', 'info_query'] },
    at: {
      town: { baseChance: 0.22 },
      city: { baseChance: 0.28 },
      metropolis: { baseChance: 0.28 },
    },
  }),
  family('Economy', {
    shared: { name: "Chroniclers' exchange", required: false, baseChance: 0.3, forbiddenTradeRoutes: ['isolated', 'none'], desc: 'The guild form of the listening house: paid correspondents on several roads, an archive that cross-checks one road against another, and a standing rate for a written answer. Expensive to keep, and the only counter in the city where a claim is graded before it is sold.', tags: ['legal', 'information', 'brokerage'], priorityCategory: 'economy', serviceKeys: ['info_calibration', 'info_query', 'info_feed'] },
    at: {
      city: {},
      metropolis: {},
    },
  }),

  // ══════════════════════ CRAFTS ══════════════════════
  // One identity name ('Mills (2-5)') from town up; the display seam drops the count so a city never
  // reads 'Mills (2-5)'.
  family('Crafts', {
    shared: { required: true, baseChance: 1 },
    at: {
      thorp: { name: 'Access to external mill', desc: 'Must travel to manor/village mill. Home grinding often illegal.', tags: ['essential', 'agriculture'], priorityCategory: 'economy' },
      hamlet: { name: 'Access to external mill', desc: 'Manor mill with milling monopoly (banalité).', tags: ['essential', 'agriculture'], priorityCategory: 'economy' },
      village: { name: 'Mill', desc: 'Water or windmill with monopoly milling rights. The miller is often the wealthiest and most resented figure in the village.', tags: ['essential', 'food'], priorityCategory: 'crafts' },
      town: { name: 'Mills (2-5)', desc: 'Multiple mills for grain, fulling cloth.', tags: ['essential'], priorityCategory: 'economy' },
      city: { name: 'Mills (2-5)', desc: 'Grain, fulling, and saw mills along every usable watercourse, many under guild or civic licence.', tags: ['essential'], priorityCategory: 'economy' },
      metropolis: { name: 'Mills (2-5)', desc: 'Grain, fulling, and saw mills along every usable watercourse, many under guild or civic licence.', tags: ['essential'], priorityCategory: 'economy' },
    },
  }),
  family('Crafts', {
    shared: { name: 'Maltster', required: false, baseChance: 0.15, desc: 'Converts barley into malt for brewing. Small operation supplying local alehouses. Requires grain surplus.', tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      hamlet: {},
      village: {},
    },
    ceiling: { tier: 'village', reason: 'Malting moves inside the brewery at town scale.' },
    successor: 'Brewery',
  }),
  family('Crafts', {
    shared: { required: false, tags: ['metalwork'], priorityCategory: 'crafts' },
    at: {
      hamlet: { name: 'Resident smith (part-time)', baseChance: 0.4, desc: 'Repairs tools, shoes horses. Farms also.' },
      village: { name: 'Blacksmith', baseChance: 0.9, desc: 'Full-time metalworker. Essential for tools and horseshoes.' },
      town: { name: 'Blacksmiths (3-10)', baseChance: 0.95, desc: 'Multiple smiths with specializations.' },
      city: { name: 'Blacksmiths (3-10)', baseChance: 0.9, desc: 'Farriers, toolsmiths, and general forges in every quarter.' },
      metropolis: { name: 'Blacksmiths (3-10)', baseChance: 0.9, desc: 'Farriers, toolsmiths, and general forges in every quarter.' },
    },
  }),
  family('Crafts', {
    shared: { name: 'Specialized metalworkers', required: false, baseChance: 0.9, desc: 'Armorers, swordsmiths, jewelers. Separate guilds.', tags: ['metalwork', 'luxury'], priorityCategory: 'crafts' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Crafts', {
    shared: { name: 'Jeweller' },
    at: {
      town: { required: false, baseChance: 0.3, desc: 'Works precious metals and gemstones into rings, necklaces, seals, and luxury items. Accepts commissions, appraises stones, and occasionally buys stolen goods from discreet customers.', tags: ['luxury', 'trade'], priorityCategory: 'government' },
    },
    ceiling: { tier: 'town', reason: "At city scale jewellers sit inside the specialized metalworkers' guilds (their row names them)." },
    successor: 'Specialized metalworkers',
  }),
  family('Crafts', {
    shared: { name: 'Luxury goods quarter', required: false, baseChance: 0.8, desc: 'Silks, spices, precious goods.', tags: ['luxury', 'trade'], priorityCategory: 'crafts' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Crafts', {
    shared: { required: false, tags: [], priorityCategory: 'crafts' },
    at: {
      hamlet: { name: 'Carpenter (part-time)', baseChance: 0.5, desc: 'Builds/repairs buildings and tools.' },
      village: { name: 'Carpenter', baseChance: 0.7, desc: 'Builds houses, carts, furniture.' },
      town: { name: 'Carpenters (5-15)', baseChance: 0.9, desc: 'Construction and furniture makers.' },
      city: { name: 'Carpenters (5-15)', baseChance: 0.9, desc: 'Construction carpenters, joiners, and furniture makers, organised by guild.' },
      metropolis: { name: 'Carpenters (5-15)', baseChance: 0.9, desc: 'Construction carpenters, joiners, and furniture makers, organised by guild.' },
    },
  }),
  family('Crafts', {
    shared: { name: 'Thatcher' },
    at: {
      village: { required: false, baseChance: 0.6, desc: 'Roof repair and construction.', tags: [], priorityCategory: 'crafts' },
    },
    ceiling: { tier: 'village', reason: 'Towns roof in tile and slate, and many forbid thatch for fear of fire.' },
  }),
  family('Crafts', {
    shared: { name: 'Cooper', required: false, desc: 'Makes barrels for storage and transport.', tags: [], priorityCategory: 'crafts' },
    at: {
      village: { baseChance: 0.3 },
      town: { baseChance: 0.5 },
      city: { baseChance: 0.55 },
      metropolis: { baseChance: 0.6 },
    },
  }),
  family('Crafts', {
    shared: { required: false, tags: ['healing', 'trade'] },
    at: {
      village: { name: 'Apothecary', baseChance: 0.45, desc: 'Sells herbal medicines, poultices, and common remedies. Distinct from the alchemist. No magical compounds, no acid flasks. Knows which roots treat fever and which mushrooms kill. Stocked with herbalism supplies.', priorityCategory: 'crafts' },
      town: { name: 'Apothecary (established)', baseChance: 0.8, desc: 'A proper shop with a trained herbalist, stocked inventory, and a back room for consultations. Sells herbalism kit supplies, common antidotes, medicinal herbs, and basic surgical dressings. Some double as chirurgeons.', priorityCategory: 'crafts' },
      city: { name: 'Apothecary district', baseChance: 0.7, desc: 'Multiple apothecary shops clustered together. Competition drives specialization. Some focus on chirurgery, others on herbal preparations, others on imported medicines. Herbalism kits, medicinal herbs, surgical supplies, and basic antidotes all available.', priorityCategory: 'economy' },
      metropolis: { name: 'Apothecary district', baseChance: 0.75, desc: 'Multiple apothecary shops clustered together. Competition drives specialization. Some focus on chirurgery, others on herbal preparations, others on imported medicines. Herbalism kits, medicinal herbs, surgical supplies, and basic antidotes all available.', priorityCategory: 'economy' },
    },
  }),
  family('Crafts', {
    shared: { required: false, tags: ['military', 'trade'], priorityCategory: 'crafts' },
    at: {
      village: { name: 'Bowyer & fletcher', baseChance: 0.6, desc: 'Makes bows, crossbows, and arrows. Sells finished ammunition and takes custom bow commissions. The first stop for any adventurer whose quiver is empty.' },
      town: { name: 'Bowyers & fletchers (guild)', baseChance: 0.75, desc: 'Multiple craftsmen organized under a guild. Standard arrows by the sheaf, specialty broadheads, composite bows to commission. Restocks merchant caravans and outfits town militias.' },
      city: { name: 'Bowyers & fletchers (guild)', baseChance: 0.6, desc: 'Guild bowyers and fletchers: standard arrows by the sheaf, specialty broadheads, composite bows to commission. Supplies the watch, the garrison, and the caravans.' },
      metropolis: { name: 'Bowyers & fletchers (guild)', baseChance: 0.6, desc: 'Guild bowyers and fletchers: standard arrows by the sheaf, specialty broadheads, composite bows to commission. Supplies the watch, the garrison, and the caravans.' },
    },
  }),
  family('Crafts', {
    shared: { required: false, tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      village: { name: 'Sawmill', baseChance: 0.35, desc: 'Water- or ox-powered saw. Converts raw logs to planks and beams. Expands construction and furniture output.' },
      town: { name: 'Sawmill (commercial)', baseChance: 0.28, desc: "A water- or ox-powered mill producing planks and beams for the construction trade. A town near timber can supply an entire region's building needs. Employs a permanent crew." },
      city: { name: 'Sawmill (commercial)', baseChance: 0.3, desc: 'A water- or ox-powered mill producing planks and beams for the construction trade. Employs a permanent crew.' },
      metropolis: { name: 'Sawmill (commercial)', baseChance: 0.3, desc: 'A water- or ox-powered mill producing planks and beams for the construction trade. Employs a permanent crew.' },
    },
  }),
  family('Crafts', {
    shared: { required: false, tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      village: { name: 'Brewer', baseChance: 0.45, desc: 'Converts malted grain to ale in quantity. The largest consumer of grain after bread. Supplies alehouses and households.' },
      town: { name: 'Brewery', baseChance: 0.45, desc: "Commercial-scale ale and beer production. Supplies the town's taverns and regional distribution. Major grain consumer and employer." },
      city: { name: 'Brewery', baseChance: 0.55, desc: 'Commercial-scale ale and beer production supplying taverns and regional distribution. Major grain consumer and employer.' },
      metropolis: { name: 'Brewery', baseChance: 0.6, desc: 'Commercial-scale ale and beer production supplying taverns and regional distribution. Major grain consumer and employer.' },
    },
  }),
  family('Crafts', {
    shared: { name: 'Vintner', required: false, desc: 'Produces and ages wine, either from local grapes or imported must. Sells in bulk to taverns and directly to wealthy clients. A vintner in a non-wine region is an importer-blender.', tags: ['food', 'trade'], priorityCategory: 'government' },
    at: {
      town: { baseChance: 0.2 },
      city: { baseChance: 0.3 },
      metropolis: { baseChance: 0.35 },
    },
  }),
  family('Crafts', {
    shared: { required: false, priorityCategory: 'crafts' },
    at: {
      village: { name: 'Tannery', baseChance: 0.3, desc: 'Converts hides into leather using oak bark. Foul-smelling. Placed downstream. Essential for shoes, harness, and straps.', tags: ['trade'] },
      town: { name: 'Tanners', baseChance: 0.7, exclusiveGroup: 'tanneryScale', desc: 'Leather production. Foul-smelling; sited by water and toward the settlement edge where the ground allows.', tags: ['leather'] },
      city: { name: 'Tanners', baseChance: 0.4, exclusiveGroup: 'tanneryScale', desc: 'Leather production. Foul-smelling; sited by water and toward the settlement edge where the ground allows.', tags: ['leather'] },
      metropolis: { name: 'Tanners', baseChance: 0.4, exclusiveGroup: 'tanneryScale', desc: 'Leather production. Foul-smelling; sited by water and toward the settlement edge where the ground allows.', tags: ['leather'] },
    },
  }),
  family('Crafts', {
    shared: { name: 'Tanner (established)', required: false, exclusiveGroup: 'tanneryScale', desc: 'Full-scale tannery with multiple vats and a guild-trained workforce. Produces high-quality leather for shoes, armour, and saddlery.', tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      town: { baseChance: 0.55 },
      city: { baseChance: 0.7 },
      metropolis: { baseChance: 0.75 },
    },
  }),
  family('Crafts', {
    shared: { name: 'Fuller', required: false, desc: 'Finishes woven cloth by cleaning and thickening it. Often water-powered. Transforms raw weave into durable textile.', tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      village: { baseChance: 0.2 },
      town: { baseChance: 0.3 },
      city: { baseChance: 0.35 },
      metropolis: { baseChance: 0.35 },
    },
  }),
  family('Crafts', {
    shared: { name: 'Dyer', required: false, desc: 'Applies colour to raw or woven cloth. Essential for producing anything beyond undyed grey wool.', tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      village: { baseChance: 0.2 },
      town: { baseChance: 0.35 },
      city: { baseChance: 0.45 },
      metropolis: { baseChance: 0.5 },
    },
  }),
  family('Crafts', {
    shared: { name: 'Weavers/Textile workers', required: false, desc: 'Cloth production. Often guild-organized.', tags: ['textile'], priorityCategory: 'crafts' },
    at: {
      town: { baseChance: 0.8 },
      city: { baseChance: 0.85 },
      metropolis: { baseChance: 0.85 },
    },
  }),
  family('Crafts', {
    shared: { name: 'Potter', required: false, desc: 'Wheel-thrown pottery for domestic use. Plates, jugs, storage vessels. Fired in a small kiln.', tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      village: { baseChance: 0.35 },
      town: { baseChance: 0.5 },
      city: { baseChance: 0.55 },
      metropolis: { baseChance: 0.6 },
    },
  }),
  family('Crafts', {
    shared: { name: 'Brickmaker', required: false, desc: 'Moulds and fires clay bricks for construction. Enables more permanent buildings. Requires clay deposits and fuel.', tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      village: { baseChance: 0.25 },
      town: { baseChance: 0.4 },
      city: { baseChance: 0.45 },
      metropolis: { baseChance: 0.45 },
    },
  }),
  family('Crafts', {
    shared: { required: false, priorityCategory: 'crafts' },
    at: {
      village: { name: 'Cobbler', baseChance: 0.45, desc: 'Makes and repairs shoes and boots. Every person needs footwear. One of the most reliable and consistent trades.', tags: ['trade'] },
      town: { name: "Cobbler's guild", baseChance: 0.5, desc: 'Organised shoemakers producing boots, shoes, and sandals for the urban population. Strictly regulated quality.', tags: ['guild', 'trade'] },
      city: { name: "Cobbler's guild", baseChance: 0.55, desc: 'Organised shoemakers producing boots, shoes, and sandals for the urban population. Strictly regulated quality.', tags: ['guild', 'trade'] },
      metropolis: { name: "Cobbler's guild", baseChance: 0.6, desc: 'Organised shoemakers producing boots, shoes, and sandals for the urban population. Strictly regulated quality.', tags: ['guild', 'trade'] },
    },
  }),
  family('Crafts', {
    shared: { required: false, priorityCategory: 'crafts' },
    at: {
      village: { name: 'Tailor', baseChance: 0.35, desc: 'Cuts and sews finished cloth into garments. Serves the middle tier between home seamstress and master clothier.', tags: ['trade'] },
      town: { name: "Tailor's guild", baseChance: 0.55, desc: 'Master clothiers producing garments from finished cloth. Produces everything from working clothes to livery.', tags: ['guild', 'trade'] },
      city: { name: "Tailor's guild", baseChance: 0.6, desc: 'Master clothiers producing garments from finished cloth. Produces everything from working clothes to livery.', tags: ['guild', 'trade'] },
      metropolis: { name: "Tailor's guild", baseChance: 0.65, desc: 'Master clothiers producing garments from finished cloth. Produces everything from working clothes to livery.', tags: ['guild', 'trade'] },
    },
  }),
  family('Crafts', {
    shared: { name: 'Butchers (3-8)', required: false, tags: ['food'], priorityCategory: 'crafts' },
    at: {
      town: { baseChance: 0.85, desc: 'Meat processing. Strictly regulated.' },
      city: { baseChance: 0.9, desc: 'Shambles and meat markets under strict civic regulation.' },
      metropolis: { baseChance: 0.9, desc: 'Shambles and meat markets under strict civic regulation.' },
    },
  }),
  family('Crafts', {
    shared: { name: 'Bakers (5-15)', required: false, tags: ['food'], priorityCategory: 'crafts' },
    at: {
      town: { baseChance: 0.9, desc: 'Bread production. Guild-regulated prices.' },
      city: { baseChance: 0.95, desc: 'Bakehouses in every ward. Guild-regulated weights and prices.' },
      metropolis: { baseChance: 0.95, desc: 'Bakehouses in every ward. Guild-regulated weights and prices.' },
    },
  }),
  family('Crafts', {
    shared: { name: 'Smelter', required: false, baseChance: 0.35, desc: 'Converts raw ore to refined metal using charcoal-fueled furnaces. The industrial intermediate between mine and smithy.', tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      town: {},
      city: {},
      metropolis: {},
    },
  }),
  family('Crafts', {
    shared: { name: 'Chandler', required: false, desc: 'Makes candles from tallow and beeswax. Also produces soap and rope from similar raw materials. Essential for lighting.', tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      town: { baseChance: 0.3 },
      city: { baseChance: 0.45 },
      metropolis: { baseChance: 0.5 },
    },
  }),
  family('Crafts', {
    shared: { required: false, priorityCategory: 'crafts' },
    at: {
      town: { name: 'Glassblower', baseChance: 0.25, desc: 'Small-scale glasswork: bottles, window panes, goblets. Requires silica sand, potash, and a skilled furnace operator.', tags: ['trade'] },
      city: { name: 'Glassmakers', baseChance: 0.5, desc: 'Windows, vessels, mirrors. Requires expertise.', tags: ['luxury'] },
      metropolis: { name: 'Glassmakers', baseChance: 0.55, desc: 'Windows, vessels, mirrors. Requires expertise.', tags: ['luxury'] },
    },
  }),
  family('Crafts', {
    shared: { name: 'Ropemaker', required: false, desc: 'Twists fibres (hemp, flax, or plant matter) into rope and cordage. Essential for ships, construction, and agriculture.', tags: ['trade'], priorityCategory: 'crafts' },
    at: {
      town: { baseChance: 0.3 },
      city: { baseChance: 0.45 },
      metropolis: { baseChance: 0.5 },
    },
  }),
  family('Crafts', {
    shared: { name: 'Midwife', required: false, desc: 'Assists with births, manages difficult labours, and provides basic gynecological care. The most-used medical service in any settlement.', tags: ['healing'], priorityCategory: 'crafts' },
    at: {
      village: { baseChance: 0.5 },
      town: { baseChance: 0.5 },
      city: { baseChance: 0.55 },
      metropolis: { baseChance: 0.55 },
    },
  }),
  family('Crafts', {
    shared: { name: 'Woodcarver', required: false, desc: 'Carves functional and decorative items from wood: tool handles, religious figures, furniture inlays. Produces sacred images and reliquaries for the church.', tags: ['trade', 'religious'], priorityCategory: 'crafts' },
    at: {
      village: { baseChance: 0.25 },
      town: { baseChance: 0.3 },
      city: { baseChance: 0.35 },
      metropolis: { baseChance: 0.35 },
    },
  }),
  family('Crafts', {
    shared: { name: 'Village scribe' },
    at: {
      village: { required: false, baseChance: 0.15, desc: "Can read and write. Copies letters, draws up simple contracts, reads documents for the illiterate. Often the priest's assistant or a monastery-educated lay person.", tags: ['guild'], priorityCategory: 'government' },
    },
    ceiling: { tier: 'village', reason: "Town record-keeping sits with guild clerks and the crier; the printing house is the city's writing trade." },
  }),
  family('Crafts', {
    shared: { name: 'Printing house', required: false, desc: 'Books and broadsheets (if technology exists).', tags: ['education'], priorityCategory: 'crafts' },
    at: {
      town: { baseChance: 0.1 },
      city: { baseChance: 0.3 },
      metropolis: { baseChance: 0.35 },
    },
  }),
  // Filed on Crafts at village and Economy at town and city until 2026-09-30; one family, one shelf.
  family('Crafts', {
    shared: { required: false, tags: ['education', 'trade'] },
    at: {
      village: { name: "Cartographer's workshop", baseChance: 0.15, desc: "A craftsman who draws and sells maps: regional road maps, property surveys, and rough wilderness sketches from traveler accounts. Rare enough that most villages don't have one.", priorityCategory: 'crafts' },
      town: { name: "Cartographer's workshop", baseChance: 0.4, desc: 'Sells road maps, regional surveys, and coastal charts. Takes commissions for estate surveys and dungeon sketching. Maintains a reference collection of older maps for consultation. Standard stop for adventurers, merchants, and military scouts.', priorityCategory: 'crafts' },
      city: { name: "Cartographer's guild", baseChance: 0.65, desc: "A guild of professional cartographers producing regional maps, sea charts, property surveys, and military reconnaissance maps. Sells off-the-shelf maps and takes commissions. The city's maps are the most accurate in the region.", priorityCategory: 'economy' },
      metropolis: { name: "Cartographer's guild", baseChance: 0.65, desc: "A guild of professional cartographers producing regional maps, sea charts, property surveys, and military reconnaissance maps. Sells off-the-shelf maps and takes commissions. The city's maps are the most accurate in the region.", priorityCategory: 'economy' },
    },
  }),
  // Filed on Economy at town and city and Crafts at metropolis until 2026-09-30.
  family('Crafts', {
    shared: { required: true, baseChance: 1, tags: ['guild'], priorityCategory: 'crafts' },
    at: {
      town: { name: 'Craft guilds (5-15)', desc: 'Regulate quality, prices, and apprenticeships.' },
      city: { name: 'Craft guilds (30-80)', desc: 'Extreme specialization (gold-beaters, mirror-makers).' },
      metropolis: { name: 'Craft guilds (100-150+)', desc: 'Over a hundred distinct craft specializations. A guild for every conceivable trade.' },
    },
  }),
  // ALCHEMY IS A TRADE (TE-CH-5 / ODQ §541): licensed `none`, tagged `alchemy` (TRADE_INST_TAGS),
  // and filed on Crafts from 2026-09-30 so the display shelf agrees with the licence.
  family('Crafts', {
    shared: { required: false, forbiddenTradeRoutes: ['isolated'], tags: ['alchemy'], magicLicense: 'none', priorityCategory: 'magic' },
    at: {
      town: { name: 'Alchemist shop', baseChance: 0.4, desc: 'Potions and alchemical wares. A basic healing draught costs about what a labourer earns in a week.' },
      city: { name: 'Alchemist quarter', baseChance: 0.5, desc: 'Multiple alchemical workshops. Guild organization.' },
      metropolis: { name: 'Alchemist quarter', baseChance: 0.5, desc: 'Multiple alchemical workshops. Guild organization.' },
    },
  }),

  // ══════════════════════ RELIGIOUS ══════════════════════
  // A shrine is a complement to the parish, not its lesser form: it left the religiousCenter group
  // (where the required parish row blocked it at hamlet, 0 of 200) on 2026-09-30.
  family('Religious', {
    shared: { name: 'Wayside shrine', required: false, tags: ['religious'], priorityCategory: 'religion' },
    at: {
      thorp: { baseChance: 0.3, desc: 'Simple prayer marker. No resident clergy.' },
      hamlet: { baseChance: 0.5, desc: 'Simple prayer location. No clergy.' },
      village: { baseChance: 0.3, desc: 'A roadside prayer marker at the parish edge. No clergy of its own.' },
    },
    ceiling: { tier: 'village', reason: 'Inside a town every street is in reach of a parish church.' },
  }),
  family('Religious', {
    at: {
      thorp: { name: 'Access to parish church', required: false, baseChance: 0.78, desc: 'Walk 2-5km to the village house of worship for services.', tags: ['essential', 'religious', 'church'], priorityCategory: 'religion' },
      hamlet: { name: 'Access to parish church', required: true, baseChance: 1, desc: 'Travel to the village house of worship. 2-5km distance typical.', tags: ['essential', 'religious', 'church'], priorityCategory: 'religion' },
      village: { name: 'Parish church', required: true, baseChance: 1, exclusiveGroup: 'religiousCenter', desc: 'Center of village life. Stone construction. Mandatory tithes.', tags: ['essential', 'religious', 'church'], priorityCategory: 'religion' },
      town: { name: 'Parish churches (2-5)', required: true, baseChance: 1, desc: 'Several houses of worship within town.', tags: ['essential', 'religious', 'church'], priorityCategory: 'religion' },
      city: { name: 'Parish churches (10-30)', required: true, baseChance: 1, desc: 'One per neighborhood.', tags: ['essential', 'religious', 'church'], priorityCategory: 'religion' },
      metropolis: { name: 'Parish churches (50-100+)', required: true, baseChance: 1, desc: 'Hundreds of houses of worship across all districts. The faith is woven into every neighbourhood.', tags: ['religious', 'church'], priorityCategory: 'infrastructure' },
    },
  }),
  family('Religious', {
    shared: { required: true, baseChance: 1, tags: ['essential', 'religious'] },
    at: {
      thorp: { name: 'Burial ground', desc: 'A corner of the holding left out of the plough, banked with turf and marked with fieldstones. No clergy lives near enough to speak over anyone, so the words are said by whoever knew the dead best. The oldest markers have lost their names to the weather and are kept clear anyway.', priorityCategory: 'religion' },
      hamlet: { name: 'Burial ground', desc: 'A walled plot at the edge of the settlement, gated against livestock and kept by the households in turn. The rite is held when a priest comes through, and the burial itself does not wait for one. Families lie in rows by household rather than by standing, which is custom here rather than poverty.', priorityCategory: 'religion' },
      village: { name: 'Graveyard', desc: 'Consecrated ground beside the house of worship, on its own plot, with a resident priest to close it. The rite keeps to the day of the death rather than waiting on a clergyman who comes through, and the congregation has begun keeping the names in the same book as the births. The ground nearest the wall is spoken for generations ahead, and everyone here can say who holds it.', priorityCategory: 'religion' },
      town: { name: 'Parish burial grounds', desc: "Each congregation keeps its own ground beside its house of worship, and one that has filled its ground buries beyond the gate instead. The sexton holds the register of who lies where, which is the town's longest unbroken record and the one it reaches for in an inheritance dispute. Guilds buy plots together so their members lie among their trade.", priorityCategory: 'religion' },
      city: { name: 'Burial grounds and charnel house', desc: "The old grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next. New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening. Who is lifted and who is left where they lie is settled by what a family endowed.", priorityCategory: 'religion' },
      metropolis: { name: 'Cemetery network', desc: 'Burial has left the walls entirely: grounds beyond every gate, each with its own road, its own gatekeepers, and a trade in plots that the revenue office watches. The local registers are copied into a central roll because no single ground can any longer say where its own dead are. Wards are assigned to grounds, so a family that moves across the city can find itself divided by the assignment.', priorityCategory: 'infrastructure' },
    },
  }),
  family('Religious', {
    shared: { name: 'Priest (resident)' },
    at: {
      village: { required: true, baseChance: 1, desc: 'Performs sacraments, collects tithes. Often only literate person.', tags: ['essential', 'religious'], priorityCategory: 'religion' },
    },
    ceiling: { tier: 'village', reason: "At town scale the clergy are held inside the parish churches' row." },
  }),
  family('Religious', {
    shared: { required: false, exclusiveGroup: 'religiousCenter', tags: ['religious', 'monastery'] },
    at: {
      town: { name: 'Monastery or friary', baseChance: 0.4, desc: 'Religious community. May operate hospital/school.', priorityCategory: 'religion' },
      city: { name: 'Multiple monasteries', baseChance: 0.6, exclusiveGroupCoexists: true, desc: 'Different religious orders.', priorityCategory: 'religion' },
      metropolis: { name: 'Major monasteries (5-10)', baseChance: 0.6, exclusiveGroupCoexists: true, desc: 'Five to ten major monastic houses: scholarly, contemplative, and charitable functions at scale.', priorityCategory: 'infrastructure' },
    },
  }),
  family('Religious', {
    shared: { required: false, exclusiveGroup: 'religiousCenter', exclusiveGroupCoexists: true, tags: ['religious', 'church'] },
    at: {
      city: { name: 'Cathedral (10,000+ only)', baseChance: 0.3, minPopulation: 10000, desc: "Bishop's seat. Requires 10,000+ population minimum. Defines major city status.", priorityCategory: 'religion' },
      metropolis: { name: 'Great cathedral', baseChance: 0.6, desc: 'Metropolitan cathedral. Seat of the highest regional religious authority. Pilgrimage destination.', priorityCategory: 'infrastructure' },
    },
  }),
  family('Religious', {
    shared: { required: false },
    at: {
      town: { name: 'Small hospital', baseChance: 0.3, desc: 'Care for sick poor. Usually religious-run.', tags: ['religious', 'healing'], priorityCategory: 'religion' },
      city: { name: 'Major hospital', baseChance: 0.5, desc: 'Large facility for sick poor. 50-100 beds.', tags: ['religious', 'healing'], priorityCategory: 'religion' },
      metropolis: { name: 'Hospital network', baseChance: 0.6, desc: 'Multiple hospitals and infirmaries across districts. Organized medical care at population scale.', tags: ['healing', 'religious'], priorityCategory: 'infrastructure' },
    },
  }),
  family('Religious', {
    shared: { name: 'Almshouse', required: false, desc: 'Charitable house for the destitute poor, aged, and disabled who cannot work. Funded by church endowment and wealthy donors. Residents receive food and shelter; in return they pray for their benefactors.', tags: ['religious', 'healing'], priorityCategory: 'religion' },
    at: {
      town: { baseChance: 0.3 },
      city: { baseChance: 0.35 },
      metropolis: { baseChance: 0.35 },
    },
  }),
  family('Religious', {
    shared: { name: 'Foundling home', required: false, desc: 'Receives abandoned infants and young children, providing basic care until they can be apprenticed, placed with families, or raised within the institution. Usually church-run. The wheel in the wall allows anonymous deposit at night.', tags: ['religious', 'healing'], priorityCategory: 'religion' },
    at: {
      town: { baseChance: 0.1 },
      city: { baseChance: 0.2 },
      metropolis: { baseChance: 0.25 },
    },
  }),
  // FAITH IS NOT MAGIC (TE-CH-6): licensed `none`, tagged `religious`; filed on Magic until
  // 2026-09-30.
  family('Religious', {
    shared: { name: 'Druid Circle' },
    at: {
      village: { required: false, baseChance: 0.2, desc: 'A circle of druids tied to the land. They regulate the seasons, mediate disputes with wild creatures, and know which streams run clean. More common in forested or isolated settlements, but they adapt. Some circles tend city gardens or hidden urban groves.', tags: ['religious'], magicLicense: 'none', priorityCategory: 'magic' },
    },
    ceiling: { tier: 'village', reason: 'In towns and cities the druids speak through the Elder Grove Council.' },
  }),
  // Its own text says it is found in cities; it was listed at town only, and on the Magic shelf,
  // until 2026-09-30.
  family('Religious', {
    shared: { name: 'Elder Grove Council', required: false, desc: "A council of senior druids who govern their circle's relationship with the city. They may maintain a hidden grove beneath the streets, mediate between urban expansion and wild places, or serve as ecological advisors to the ruling authority. Found in cities that have made peace with nature magic.", tags: ['religious'], magicLicense: 'none', priorityCategory: 'military' },
    at: {
      town: { baseChance: 0.15 },
      city: { baseChance: 0.2 },
      metropolis: { baseChance: 0.15 },
    },
  }),

  // ══════════════════════ GOVERNMENT ══════════════════════
  family('Government', {
    shared: { name: 'Informal elder consensus', required: false, exclusiveGroup: 'government', tags: ['civic'], priorityCategory: 'government' },
    at: {
      thorp: { baseChance: 0.5, desc: 'The eldest or most respected farmer guides communal decisions by consensus.' },
      hamlet: { baseChance: 0.85, desc: "A free hamlet with no lord's representative. Communal elder consensus governs shared affairs." },
      village: { baseChance: 0.4, desc: 'The village elders decide shared affairs together. No reeve, no steward: the old families settle it among themselves.' },
    },
    ceiling: { tier: 'village', reason: 'A town governs through a council or an appointee.' },
  }),
  family('Government', {
    shared: { name: 'Head-of-household consensus' },
    at: {
      thorp: { required: false, baseChance: 0.82, exclusiveGroup: 'government', desc: 'All family heads hold equal voice on shared concerns. Slower but more egalitarian.', tags: ['civic'], priorityCategory: 'government' },
    },
    ceiling: { tier: 'thorp', reason: 'Only a handful of households can all sit at one table.' },
  }),
  family('Government', {
    shared: { name: "Lord's reeve" },
    at: {
      thorp: { required: false, baseChance: 0.3, exclusiveGroup: 'government', desc: 'A steward appointed by a distant lord to oversee the settlement. Authority is formal but often resented.', tags: ['civic', 'legal'], priorityCategory: 'government' },
    },
    ceiling: { tier: 'thorp', reason: "Larger holdings get a lord's steward." },
    successor: "Lord's steward",
  }),
  family('Government', {
    shared: { name: 'Household elder' },
    at: {
      thorp: { required: false, baseChance: 0.9, exclusiveGroup: 'government', desc: 'One household head acts as de facto voice for the settlement. No formal appointment, no title. Just the person everyone goes to when something needs deciding.', tags: ['civic'], priorityCategory: 'government' },
    },
    ceiling: { tier: 'thorp', reason: 'A single household head speaks for a thorp; larger places need a headman or elders.' },
  }),
  family('Government', {
    shared: { required: false, exclusiveGroup: 'government', tags: ['civic'], priorityCategory: 'military' },
    at: {
      hamlet: { name: "Lord's steward", baseChance: 0.55, desc: "A lord's agent manages the hamlet's lands, collects rents, and enforces noble authority." },
      village: { name: "Lord's steward", baseChance: 0.3, desc: "A lord's steward collects rents and enforces manor authority over a bound village." },
      town: { name: "Lord's appointee", baseChance: 0.45, desc: "A lord's appointed official governs; noble authority supersedes local custom." },
      city: { name: 'Noble governor', baseChance: 0.55, desc: 'A royal or ducal appointee governs; the city operates as a noble fief.' },
      metropolis: { name: 'Noble governor', baseChance: 0.55, desc: 'A royal or ducal appointee governs; the city operates as a noble fief.' },
    },
  }),
  family('Government', {
    shared: { name: 'Village headman', required: false, exclusiveGroup: 'government', desc: 'A single respected figure acts as de facto authority. Not elected, not appointed, simply acknowledged. Decisions are practical rather than formal.', tags: ['civic'], priorityCategory: 'government' },
    at: {
      hamlet: { baseChance: 0.9 },
      village: { baseChance: 0.5 },
    },
    ceiling: { tier: 'village', reason: 'A town governs through a council or an appointee.' },
  }),
  family('Government', {
    shared: { required: false, exclusiveGroup: 'government', tags: ['civic'], priorityCategory: 'government' },
    at: {
      village: { name: 'Village reeve', baseChance: 0.92, desc: 'Elected from the peasantry. Organises labour obligations, mediates disputes, and represents the village to outside authority.' },
      town: { name: 'Town council', baseChance: 0.9, desc: 'An informal council of prominent citizens manages town affairs in the absence of formal authority. Less accountable than an elected council, more stable than nothing.' },
      city: { name: 'City administration', baseChance: 0.92, desc: 'An administrative apparatus of officials, clerks, and ward officers manages city affairs. Less formally constituted than a council but functional. Governance by bureaucratic inertia.' },
      metropolis: { name: 'City administration', baseChance: 0.92, desc: 'An administrative apparatus of officials, clerks, and ward officers manages city affairs. Less formally constituted than a council but functional. Governance by bureaucratic inertia.' },
    },
  }),
  family('Government', {
    shared: { name: 'Village elder' },
    at: {
      village: { required: false, baseChance: 0.95, exclusiveGroup: 'government', desc: 'The oldest or most respected resident guides village decisions in the absence of formal authority. Less official than a reeve, more stable than nothing.', tags: ['civic'], priorityCategory: 'government' },
    },
    ceiling: { tier: 'village', reason: 'A town governs through a council or an appointee.' },
  }),
  family('Government', {
    shared: { name: 'Mayor and council', required: false, baseChance: 0.5, exclusiveGroup: 'government', tags: ['civic'], priorityCategory: 'government' },
    at: {
      town: { desc: 'Elected or appointed town leadership.' },
      city: { desc: 'Elected civic council with full administrative apparatus.' },
      metropolis: { desc: 'Elected civic council with full administrative apparatus.' },
    },
  }),
  family('Government', {
    shared: { required: false, exclusiveGroup: 'government', tags: ['civic', 'guild'], priorityCategory: 'economy' },
    at: {
      town: { name: 'Guild governance', baseChance: 0.8, desc: 'Guilds control town politics. The guildmasters sit on the council.' },
      city: { name: 'Guild consortium', baseChance: 0.6, desc: 'A consortium of guild masters holds effective civic power.' },
      metropolis: { name: 'Guild consortium', baseChance: 0.6, desc: 'A consortium of guild masters holds effective civic power.' },
    },
  }),
  family('Government', {
    shared: { name: 'Merchant oligarchy', required: false, exclusiveGroup: 'government', desc: 'Wealthy merchant families hold exclusive civic power; political office is effectively purchased.', tags: ['civic', 'trade'], priorityCategory: 'economy' },
    at: {
      town: { baseChance: 0.25 },
      city: { baseChance: 0.5 },
      metropolis: { baseChance: 0.5 },
    },
  }),
  family('Government', {
    shared: { name: 'City-state government', required: false, baseChance: 0.25, exclusiveGroup: 'government', desc: 'The settlement governs itself and its surrounding territory as an independent polity. No higher lord, no external charter.', tags: ['civic'], priorityCategory: 'government' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Government', {
    shared: { name: 'Democratic assembly', required: false, baseChance: 0.2, exclusiveGroup: 'government', desc: 'A citizen assembly holds formal authority; eligible voters debate and vote on major ordinances and appointments.', tags: ['civic'], priorityCategory: 'government' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Government', {
    shared: { name: 'Royal seat', required: false, baseChance: 0.2, exclusiveGroup: 'government', desc: 'A royal governor or viceroy administers directly on behalf of the crown. High status, high scrutiny.', tags: ['civic'], priorityCategory: 'military' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  // Filed on Crafts until 2026-09-30; a civic office, not a craft.
  family('Government', {
    shared: { name: 'Town crier', required: false, tags: ['guild'], priorityCategory: 'government' },
    at: {
      town: { baseChance: 0.45, desc: 'Official announcer who reads proclamations, market prices, and news at fixed times in the market square. Employed by the town or a guild.' },
      city: { baseChance: 0.4, desc: 'Official announcer who reads proclamations, market prices, and news at fixed times in the market squares. Employed by the city or a guild.' },
      metropolis: { baseChance: 0.4, desc: 'Official announcer who reads proclamations, market prices, and news at fixed times in the market squares. Employed by the city or a guild.' },
    },
  }),

  // ══════════════════════ INFRASTRUCTURE ══════════════════════
  // Every metropolis read 'Housing (1000-5000 structures)' (inherited from city) until 2026-09-30.
  family('Infrastructure', {
    shared: { required: true, baseChance: 1, tags: ['essential', 'housing'], priorityCategory: 'infrastructure' },
    at: {
      thorp: { name: 'Dwellings (4-16)', desc: 'Wattle-and-daub or timber. 1-2 rooms per household.' },
      hamlet: { name: 'Dwellings (17-80)', desc: 'Timber-frame with thatched roofs.' },
      village: { name: 'Dwellings (80-180)', desc: 'Timber construction with stone foundations.' },
      town: { name: 'Housing (180-1000 structures)', desc: 'Multi-story timber and stone buildings.' },
      city: { name: 'Housing (1000-5000 structures)', desc: 'Multi-story buildings. Tenements for poor.' },
      metropolis: { name: 'Housing (5000+ structures)', desc: 'Dense multi-story blocks, tenement courts, and suburbs spilling past the walls.' },
    },
  }),
  family('Infrastructure', {
    shared: { required: true, baseChance: 1, exclusiveGroup: 'waterSupply', tags: ['essential', 'water'], priorityCategory: 'infrastructure' },
    at: {
      thorp: { name: 'Water source', desc: 'Well or spring. 2-4 gallons/person/day minimum.' },
      hamlet: { name: 'Water source', desc: 'Well or spring access.' },
      village: { name: 'Multiple water sources', desc: 'Wells and springs throughout village.' },
      town: { name: 'Multiple water sources', desc: 'Wells, fountains, or piped water.' },
      city: { name: 'Aqueduct or water system', desc: 'Engineered water supply. Conduits, cisterns, fountains.' },
      metropolis: { name: 'Advanced water infrastructure', desc: 'Multiple aqueducts, cisterns, and distributed fountains. City-wide water management at scale.' },
    },
  }),
  family('Infrastructure', {
    shared: { required: true, baseChance: 1, tags: ['civic'], priorityCategory: 'infrastructure' },
    at: {
      town: { name: 'Town hall', desc: 'Meeting place and administrative center.' },
      city: { name: 'City hall', desc: 'Impressive civic building.' },
      metropolis: { name: 'City hall', desc: 'Impressive civic building.' },
    },
  }),
  // Filed on Government until 2026-09-30; the building complex sits with Town hall and City hall.
  family('Infrastructure', {
    shared: { name: 'Palace/government complex' },
    at: {
      metropolis: { required: false, baseChance: 0.75, desc: 'Seat of metropolitan or state government: palace, ministries, audience halls, administrative bureaux.', tags: ['civic', 'legal'], priorityCategory: 'infrastructure' },
    },
  }),
  // The metropolis rung was filed on Government while Courthouse and Multiple courthouses sat on
  // Infrastructure, until 2026-09-30.
  family('Infrastructure', {
    shared: { priorityCategory: 'infrastructure' },
    at: {
      town: { name: 'Courthouse', required: false, baseChance: 0.6, desc: 'Borough court for local justice.', tags: ['civic', 'legal'] },
      city: { name: 'Multiple courthouses', required: true, baseChance: 1, desc: 'Commercial, criminal, and ecclesiastical courts.', tags: ['civic', 'legal'] },
      metropolis: { name: 'Multiple court buildings', required: true, baseChance: 1, desc: 'Specialized courts (commercial, criminal, appellate, ecclesiastical) operating simultaneously.', tags: ['legal', 'civic'] },
    },
  }),
  family('Infrastructure', {
    shared: { required: false, baseChance: 0.7, priorityCategory: 'infrastructure' },
    at: {
      town: { name: 'Small prison/stocks', desc: 'Holding cells and public punishment.', tags: ['legal', 'law_enforcement'] },
      city: { name: 'Large prison', desc: 'Debtors, criminals, political prisoners.', tags: ['legal', 'law_enforcement'] },
      metropolis: { name: 'Massive prison', desc: 'State prison complex: political prisoners, debtors, convicted criminals held separately.', tags: ['civic'] },
    },
  }),
  family('Infrastructure', {
    shared: { name: 'Workhouse', required: false, desc: 'The able-bodied poor receive shelter and food in exchange for compulsory labour: textile work, grinding, construction. Not a prison but the line is blurry. Reduces vagrancy and produces goods. Conditions are deliberately harsh to discourage dependency.', tags: ['civic', 'trade'], priorityCategory: 'infrastructure' },
    at: {
      town: { baseChance: 0.1 },
      city: { baseChance: 0.25 },
      metropolis: { baseChance: 0.3 },
    },
  }),
  family('Infrastructure', {
    shared: { name: 'Sewage system', required: false, desc: 'Underground drainage. Rare but critical for health.', tags: ['sanitation'], priorityCategory: 'infrastructure' },
    at: {
      city: { baseChance: 0.4 },
      metropolis: { baseChance: 0.5 },
    },
  }),
  // Licensed `none`: a library needs no magic. Filed on Magic until 2026-09-30, which deleted it
  // from every magic-free world.
  family('Infrastructure', {
    shared: { name: 'Great library' },
    at: {
      metropolis: { required: false, baseChance: 0.4, desc: 'Largest repository of knowledge in the region: thousands of volumes, map archives, historical records.', tags: ['education', 'education'], magicLicense: 'none', priorityCategory: 'exotic' },
    },
  }),

  // ══════════════════════ DEFENSE ══════════════════════
  // Massive walls could never generate (0 of 200 metropolises): the inherited required City walls
  // row held the defenseLevel group first. The metropolis rung is now the family's own.
  family('Defense', {
    shared: { exclusiveGroup: 'defenseLevel' },
    at: {
      thorp: { name: 'Palisade', required: false, baseChance: 0.3, desc: 'Sharpened stakes encircling the settlement. Offers minimal protection but enough to deter casual raiders.', tags: ['defense', 'fortification'], priorityCategory: 'defense' },
      hamlet: { name: 'Palisade or earthworks', required: false, baseChance: 0.12, desc: 'Basic wooden palisade or earthwork berm. Slows raids and creature incursions.', tags: ['defense', 'fortification'] },
      village: { name: 'Palisade or earthworks', required: false, baseChance: 0.18, desc: 'Perimeter palisade or earthwork berm. Controls approach, slows attackers.', tags: ['defense', 'fortification'] },
      town: { name: 'Town walls', required: false, baseChance: 0.5, desc: 'Stone fortifications with gates. Expensive to build and maintain.', tags: ['defense', 'fortification'], priorityCategory: 'military' },
      city: { name: 'City walls and gates', required: true, baseChance: 1, desc: 'Masonry walls with towers. Multiple gatehouses.', tags: ['essential', 'defense', 'fortification'], priorityCategory: 'military' },
      metropolis: { name: 'Massive walls and fortifications', required: true, baseChance: 1, desc: 'Layered wall systems: outer wall, inner wall, citadel ring. Multiple garrison zones and gatehouses.', tags: ['essential', 'defense', 'fortification'], priorityCategory: 'military' },
    },
  }),
  // Rolled without walls in 46 of 123 towns until 2026-09-30; `requiresAny` now enforces the
  // condition its name states.
  family('Defense', {
    shared: { name: 'Gates (if walled)' },
    at: {
      town: { required: false, baseChance: 0.5, requiresAny: ['Town walls'], desc: 'Controlled entry points with gatekeepers.', tags: ['fortification', 'defense'], priorityCategory: 'military' },
    },
    ceiling: { tier: 'town', reason: 'City walls carry their gates in their own row.' },
  }),
  // The town Citizen militia row (0 of 200 towns: blocked by the required Town watch in its own
  // group) is retired; the militia is the hamlet and village rung.
  family('Defense', {
    shared: { priorityCategory: 'military' },
    at: {
      thorp: { name: 'Household levy', required: false, baseChance: 0.18, desc: 'One able-bodied adult from each household musters with hunting bows, spears, and farm tools when danger reaches the fields.', tags: ['defense', 'military'] },
      hamlet: { name: 'Citizen militia', required: false, baseChance: 0.15, desc: 'Able-bodied residents drill and muster against local threats. Part-time service.', tags: ['defense', 'military'] },
      village: { name: 'Citizen militia', required: false, baseChance: 0.22, desc: 'Organised community defense. Musters for raids and monster incursions. More reliable than hamlet levies.', tags: ['defense', 'military'] },
      town: { name: 'Town watch', required: true, baseChance: 1, exclusiveGroup: 'civilianDefense', desc: 'Part-time guards. Night patrol and gate duty.', tags: ['law_enforcement', 'defense'] },
      city: { name: 'Professional city watch', required: true, baseChance: 1, desc: 'Full-time law enforcement. ~1% of population.', tags: ['law_enforcement', 'defense'] },
      metropolis: { name: 'Professional city watch', required: true, baseChance: 1, desc: 'Full-time law enforcement. ~1% of population.', tags: ['law_enforcement', 'defense'] },
    },
  }),
  family('Defense', {
    shared: { priorityCategory: 'military' },
    at: {
      town: { name: 'Barracks', required: false, baseChance: 0.3, desc: 'Housing for guards or small garrison.', tags: ['military'] },
      city: { name: 'Garrison', required: true, baseChance: 1, desc: 'Professional soldiers. Noble or royal.', tags: ['military', 'defense'] },
      metropolis: { name: 'Multiple garrisons', required: true, baseChance: 1, desc: 'Garrison forces distributed across quarters. No single barracks can secure a metropolis.', tags: ['military', 'defense'] },
    },
  }),
  family('Defense', {
    shared: { name: 'Citadel', required: false, desc: 'Inner fortress. Last refuge in siege.', tags: ['fortification', 'defense'], priorityCategory: 'military' },
    at: {
      town: { baseChance: 0.2 },
      city: { baseChance: 0.4 },
      metropolis: { baseChance: 0.45 },
    },
  }),
  // The city Mercenary quarter was filed on Adventuring until 2026-09-30; soldiers for hire are one
  // family.
  family('Defense', {
    shared: { required: false },
    at: {
      town: { name: 'Free company hall', baseChance: 0.3, desc: 'A billet and contracting office for a band of professional soldiers available between campaigns. Offers caravan escort, garrison contracts, and short-term military hire at day-wage rates. Cheaper than a standing army, more reliable than a mob. These men fight in formation on salary, not for treasure.', tags: ['military', 'guild'], priorityCategory: 'military' },
      city: { name: 'Mercenary quarter', baseChance: 0.6, desc: 'Organized sellsword companies. Major forces (hundreds to thousands).', tags: ['military'], priorityCategory: 'adventuring' },
      metropolis: { name: 'Mercenary quarter', baseChance: 0.6, desc: 'Organized sellsword companies. Major forces (hundreds to thousands).', tags: ['military'], priorityCategory: 'adventuring' },
    },
  }),
  family('Defense', {
    shared: { name: "Veteran's lodge", required: false, desc: 'A drinking hall where retired soldiers and mercenaries gather. Informal security, bar brawls, and the occasional job offer for a group needing swords.', tags: ['military', 'guild'], priorityCategory: 'military' },
    at: {
      village: { baseChance: 0.15 },
      town: { baseChance: 0.2 },
      city: { baseChance: 0.2 },
      metropolis: { baseChance: 0.2 },
    },
  }),
  // Licensed `none` (TE-CH-5): a ranger station needs no magic. Filed on Magic until 2026-09-30.
  family('Defense', {
    shared: { name: "Warden's Lodge" },
    at: {
      town: { required: false, baseChance: 0.2, desc: 'A ranger station or druid waypost. They monitor the surrounding wilderness, maintain trails, and keep tabs on beast migrations. In times of crisis they serve as emergency scouts and trackers.', tags: ['military'], magicLicense: 'none', priorityCategory: 'magic' },
    },
    ceiling: { tier: 'town', reason: 'A wilderness post; cities have no wild country inside their reach.' },
  }),

  // ══════════════════════ MAGIC ══════════════════════
  family('Magic', {
    shared: { required: false, tags: ['arcane'], priorityCategory: 'magic' },
    at: {
      hamlet: { name: 'Traveling hedge wizard', baseChance: 0.2, desc: 'Occasional visits. The smallest spells only.', magicLicense: 'low' },
      village: { name: 'Hedge wizard', baseChance: 0.3, exclusiveGroup: 'magicalAuthority', desc: 'A resident caster of modest reach. Minor spells only.', magicLicense: 'low' },
      town: { name: "Wizard's tower", baseChance: 0.2, exclusiveGroup: 'magicalAuthority', minPopulation: 1000, forbiddenTradeRoutes: ['isolated'], desc: 'Individual wizard residence. 1,000+ population viable.', magicLicense: 'medium' },
      city: { name: "Wizard's tower", baseChance: 0.4, exclusiveGroup: 'magicalAuthority', forbiddenTradeRoutes: ['isolated'], desc: 'High-level spellcaster residence. Multiple towers possible.', magicLicense: 'medium' },
      metropolis: { name: "Wizard's tower", baseChance: 0.4, exclusiveGroup: 'magicalAuthority', forbiddenTradeRoutes: ['isolated'], desc: 'High-level spellcaster residence. Multiple towers possible.', magicLicense: 'medium' },
    },
  }),
  family('Magic', {
    shared: { required: false },
    at: {
      town: { name: "Mages' guild", baseChance: 0.1, minPopulation: 2000, forbiddenTradeRoutes: ['isolated'], desc: 'Organization of magic users. 2,000-5,000 population for chapter.', tags: ['arcane', 'guild'], magicLicense: 'medium', priorityCategory: 'magic' },
      city: { name: "Mages' guild", baseChance: 0.3, forbiddenTradeRoutes: ['isolated'], desc: 'Organization of magic users. 2,000-5,000 population for chapter.', tags: ['arcane', 'guild'], magicLicense: 'medium', priorityCategory: 'magic' },
      metropolis: { name: "Mages' district", baseChance: 0.5, desc: 'Quarter inhabited by arcane practitioners: towers, workshops, libraries, reagent merchants.', tags: ['arcane'], magicLicense: 'high', priorityCategory: 'exotic' },
    },
  }),
  family('Magic', {
    shared: { name: 'Academy of magic' },
    at: {
      metropolis: { required: false, baseChance: 0.4, desc: 'Formal institution of arcane learning. Full curriculum, research facilities, visiting scholars.', tags: ['arcane', 'education'], magicLicense: 'high', priorityCategory: 'exotic' },
    },
  }),
  family('Magic', {
    shared: { name: "Enchanter's shop", required: false, forbiddenTradeRoutes: ['isolated'], desc: 'Magic item creation. 5,000+ population typically.', tags: ['arcane', 'enchanting'], magicLicense: 'high', priorityCategory: 'magic' },
    at: {
      city: { baseChance: 0.4, minPopulation: 5000 },
      metropolis: { baseChance: 0.45 },
    },
  }),
  family('Magic', {
    shared: { name: 'Scroll scribe', required: false, forbiddenTradeRoutes: ['isolated'], desc: 'Spell scrolls for sale. The smallest charm costs what a craftsman earns in a month; a greater working, a merchant’s year.', tags: ['arcane'], magicLicense: 'medium', priorityCategory: 'magic' },
    at: {
      town: { baseChance: 0.2 },
      city: { baseChance: 0.5 },
      metropolis: { baseChance: 0.5 },
    },
  }),
  family('Magic', {
    shared: { name: 'Teleportation circle', required: false, tags: ['arcane', 'exotic'], magicLicense: 'high', priorityCategory: 'magic' },
    at: {
      town: { baseChance: 0.08, desc: 'Rare permanent circle. Extremely expensive to construct and maintain. Requires magical expertise beyond typical town resources.' },
      city: { baseChance: 0.15, forbiddenTradeRoutes: ['isolated'], desc: 'Permanent teleportation circle. Access is controlled and expensive to maintain. Transformative infrastructure for any settlement lucky enough to have one.' },
      metropolis: { baseChance: 0.2, forbiddenTradeRoutes: ['isolated'], desc: 'Permanent teleportation circle. Access is controlled and expensive to maintain. Transformative infrastructure for any settlement lucky enough to have one.' },
    },
  }),
  // ⚠ LICENCE HELD AT `low` BY MEASUREMENT, NOT BY OMISSION (TE-CH-6, ODQ §541.8). The row is a
  // first-level SPELLCASTER (`textAssertsFunctionalMagic('Basic healing spells…')`), so a world
  // where spells do not work cannot hold it and `low` says exactly that. THE DOCTRINE GAP IS A
  // CONTENT GAP: the catalog holds no CULTURAL divine healer for a magic-free world to keep; filling
  // it is a new row and the owner's call. The tag/licence disagreement is pinned in
  // tests/lint/magicLicenceCensus.walker.test.js. The price in its text became relative on
  // 2026-09-30 (the price-heuristics law, ODQ §776).
  family('Magic', {
    shared: { name: 'Healer (divine, 1st level)' },
    at: {
      village: { required: false, baseChance: 0.4, desc: 'Basic healing spells. A closed wound costs more than most households see in a month.', tags: ['divine', 'healing'], magicLicense: 'low', priorityCategory: 'religion' },
    },
    ceiling: { tier: 'village', reason: 'Healing in towns runs through the hospitals and the apothecaries.' },
  }),
  family('Magic', {
    shared: { name: 'Planar embassy' },
    at: {
      metropolis: { required: false, baseChance: 0.15, desc: 'Formal diplomatic mission from a planar power. Trade, information, occasional intervention.', tags: ['arcane', 'planar', 'exotic'], magicLicense: 'high', priorityCategory: 'exotic' },
    },
  }),

  // ══════════════════════ ADVENTURING ══════════════════════
  // The hamlet and village halls were filed on Magic (and so vanished from magic-free worlds) while
  // the town hall sat on Adventuring, until 2026-09-30. Licensed `none`.
  family('Adventuring', {
    shared: { required: false },
    at: {
      hamlet: { name: "Adventurers' charter hall", baseChance: 0.12, desc: "A rough hall operating under a regional adventurers' charter. Posts bounties, shelters monster hunters, and coordinates local defense when the garrison cannot. Common on dangerous frontiers.", tags: ['military', 'adventuring'], magicLicense: 'none', priorityCategory: 'military' },
      village: { name: "Adventurers' charter hall", baseChance: 0.2, desc: 'A licensed charter hall providing bounties, monster-hunting coordination, and emergency armed response for the surrounding territory. More common in frontier regions.', tags: ['military', 'adventuring'], magicLicense: 'none', priorityCategory: 'military' },
      town: { name: "Adventurers' charter hall", baseChance: 0.3, desc: 'A chartered hall serving as the primary adventuring hub for the region. Posts contracts, grades monster threats, maintains gear, and coordinates large-scale operations that militia cannot handle.', tags: ['military', 'adventuring'], priorityCategory: 'military' },
      city: { name: "Multiple adventurers' guilds", baseChance: 0.7, desc: 'Competing organizations.', tags: [], priorityCategory: 'adventuring' },
      metropolis: { name: "Multiple adventurers' guilds", baseChance: 0.7, desc: 'Competing organizations.', tags: [], priorityCategory: 'adventuring' },
    },
  }),
  family('Adventuring', {
    shared: { name: 'Hireling hall', required: false, baseChance: 0.5, desc: 'Job board for torchbearers and porters, hired by the session at a day labourer’s wage.', tags: [], priorityCategory: 'adventuring' },
    at: {
      town: {},
      city: {},
      metropolis: {},
    },
  }),
  // Filed on Entertainment until 2026-09-30.
  family('Adventuring', {
    shared: { name: 'Hired blades', required: false, desc: 'Individual or small groups of professional fighters available for private contracts: bodyguard work, debt enforcement, or quiet removal of problems.', tags: ['military', 'guild'], priorityCategory: 'government' },
    at: {
      town: { baseChance: 0.25 },
      city: { baseChance: 0.35 },
      metropolis: { baseChance: 0.35 },
    },
  }),
  family('Adventuring', {
    shared: { name: 'Dungeon delving supply district', required: false, baseChance: 0.5, desc: 'Specialized adventuring gear. Warded weapons, silver weapons, etc.', tags: [], priorityCategory: 'adventuring' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Adventuring', {
    shared: { name: "Sage's quarter", required: false, desc: 'Multiple scholars and researchers.', tags: ['education'], priorityCategory: 'adventuring' },
    at: {
      city: { baseChance: 0.5 },
      metropolis: { baseChance: 0.55 },
    },
  }),

  // ══════════════════════ CRIMINAL ══════════════════════
  family('Criminal', {
    shared: { required: false, priorityCategory: 'criminal' },
    at: {
      thorp: { name: 'Local fence', baseChance: 0.1, desc: 'Somebody in this settlement buys things without asking where they came from. Everyone knows who. Nobody says it directly.', tags: ['criminal'] },
      hamlet: { name: 'Fence (word of mouth)', baseChance: 0.12, desc: 'Stolen goods move through this hamlet quietly. The contact is known by face, not name.', tags: ['criminal'] },
      village: { name: 'Fence (word of mouth)', baseChance: 0.15, desc: 'Local contact for moving stolen goods quietly. Operates behind another trade.', tags: ['criminal', 'economy'] },
      town: { name: 'Fence (word of mouth)', baseChance: 0.2, desc: 'Local contact for moving stolen goods quietly. Operates behind another trade.', tags: ['criminal', 'economy'] },
    },
    ceiling: { tier: 'town', reason: 'City fencing runs through the black market and the thieves.' },
    successor: 'Black market',
  }),
  family('Criminal', {
    shared: { name: 'Outlaw shelter' },
    at: {
      thorp: { required: false, baseChance: 0.08, desc: "Someone here provides cover for people who need to disappear. A barn, a cellar, an arrangement that isn't discussed.", tags: ['criminal'], priorityCategory: 'criminal' },
    },
    ceiling: { tier: 'thorp', reason: 'Larger places hide outlaws through bandit ties and smugglers.' },
  }),
  family('Criminal', {
    shared: { name: 'Bandit affiliate', required: false, baseChance: 0.1, desc: 'One or more households here have ties to bandit groups operating the surrounding roads. Information, shelter, and supply flow both ways.', tags: ['criminal'], priorityCategory: 'criminal' },
    at: {
      hamlet: {},
      village: {},
    },
    ceiling: { tier: 'village', reason: 'Towns deal with the road gangs through smugglers and fences.' },
  }),
  // The village row 'Smuggling network' (gated to city by minTier, so it never rolled at village) is
  // retired; the village rung is the waypoint.
  family('Criminal', {
    shared: { required: false, priorityCategory: 'criminal' },
    at: {
      hamlet: { name: 'Smuggling waypoint', baseChance: 0.09, desc: 'Goods pass through here to avoid toll roads or customs checkpoints. The hamlet benefits from fees paid in kind.', tags: ['criminal'] },
      village: { name: 'Smuggling waypoint', baseChance: 0.1, desc: 'Goods pass through here to avoid toll roads or customs checkpoints. The hamlet benefits from fees paid in kind.', tags: ['criminal'] },
      town: { name: 'Smuggling operation', baseChance: 0.45, desc: 'Illicit goods trade. Tax evasion.', tags: ['criminal', 'smuggling'] },
      city: { name: 'Smuggling network', baseChance: 0.6, desc: 'Organized contraband trade.', tags: ['criminal', 'smuggling'] },
      metropolis: { name: 'Smuggling network', baseChance: 0.6, desc: 'Organized contraband trade.', tags: ['criminal', 'smuggling'] },
    },
  }),
  family('Criminal', {
    shared: { required: false, tags: ['criminal'], priorityCategory: 'criminal' },
    at: {
      town: { name: 'Street gang', baseChance: 0.55, desc: 'Organized pickpockets and thugs. 10-30 members.' },
      city: { name: 'Multiple criminal factions', baseChance: 0.5, exclusiveGroup: 'criminalPower', desc: 'Competing gangs. Turf disputes.' },
      metropolis: { name: 'Multiple criminal factions', baseChance: 0.5, exclusiveGroup: 'criminalPower', desc: 'Competing gangs. Turf disputes.' },
    },
  }),
  family('Criminal', {
    shared: { required: false, exclusiveGroup: 'criminalPower', tags: ['criminal'], priorityCategory: 'criminal' },
    at: {
      city: { name: "Thieves' guild chapter", baseChance: 0.6, minPopulation: 10000, desc: 'Organized crime chapter. 10,000+ population for viable operation. 30-100 members.' },
      metropolis: { name: "Thieves' guild (powerful)", baseChance: 0.55, desc: 'Dominant criminal syndicate. Tolerated because the alternative (gang war) is worse.' },
    },
  }),
  family('Criminal', {
    shared: { name: 'Front businesses', required: false, tags: ['criminal'], priorityCategory: 'criminal' },
    at: {
      town: { baseChance: 0.45, desc: 'Legitimate covers for criminal activity.' },
      city: { baseChance: 0.7, desc: 'Warehouses, taverns, shops as criminal covers.' },
      metropolis: { baseChance: 0.7, desc: 'Warehouses, taverns, shops as criminal covers.' },
    },
  }),
  // [D6 THE UNDERWAYS] Excavated tunnels beneath the settlement for discreet passage, untaxed
  // storage, and no-questions transport. Its EXISTENCE is public knowledge; its OPERATIONS run
  // through the covert seams. `facets` declare it clandestine + subterranean so the covert engine
  // couplings resolve it through facetOf. `forbiddenResources` makes it impossible atop
  // marsh/floodplain (tunnels flood). id `underground_network`.
  family('Criminal', {
    shared: { name: 'Underground network', required: false, forbiddenResources: ['marshlands', 'fertile_floodplain'], tags: ['criminal', 'smuggling', 'underground'], priorityCategory: 'criminal', facets: { clandestine: 'clandestine', subterranean: 'subterranean' } },
    at: {
      village: { baseChance: 0.08, desc: 'Dug smuggling passages beneath the village.' },
      town: { baseChance: 0.15, desc: 'A dug network of smuggling tunnels and cellars.' },
      city: { baseChance: 0.22, desc: 'An extensive warren of smuggling tunnels beneath the city.' },
      metropolis: { baseChance: 0.22, desc: 'An extensive warren of smuggling tunnels beneath the city.' },
    },
  }),
  family('Criminal', {
    shared: { name: 'Underground city' },
    at: {
      metropolis: { required: false, baseChance: 0.25, desc: 'Extensive tunnels and catacombs repurposed as criminal and refugee sanctuary.', tags: ['criminal', 'underground'], priorityCategory: 'criminal', facets: { subterranean: 'subterranean' } },
    },
  }),
  // [W-I INFORMATION BROKERAGES] I1, the illegal MINOR form (design §3). Its criminal-organization
  // precondition and rumour-source weighting are POWER-STRUCTURE reads that live in
  // data/informationBrokerageTuning.js.
  family('Criminal', {
    shared: { name: 'Rookery', required: false, desc: 'A loft of message birds kept by people who file no returns. Word arrives unsigned and ahead of the watch. Only a standing criminal organization can protect a loft like this, so one never appears without that backing.', tags: ['criminal', 'information', 'brokerage'], priorityCategory: 'criminal', serviceKeys: ['info_calibration', 'info_query'] },
    at: {
      town: { baseChance: 0.16 },
      city: { baseChance: 0.2 },
      metropolis: { baseChance: 0.2 },
    },
  }),
  // `info_plant` is declared HERE and nowhere else, so the lie-selling capability is illegal-major
  // by construction.
  family('Criminal', {
    shared: { name: 'Whisper market', required: false, desc: 'The covert guild form: brokers who buy and sell knowledge by the piece, grade what they sell, and will manufacture a claim for a patron who pays enough. It sites itself where the talk already is, among the fences, the late houses, and the inns that ask nothing.', tags: ['criminal', 'information', 'brokerage'], priorityCategory: 'criminal', serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'] },
    at: {
      city: { baseChance: 0.18 },
      metropolis: { baseChance: 0.2 },
    },
  }),
  family('Criminal', {
    shared: { required: false, tags: ['criminal', 'underground'], priorityCategory: 'criminal' },
    at: {
      city: { name: 'Black market', baseChance: 0.6, desc: 'Illicit goods trade. Hidden locations.' },
      metropolis: { name: 'Black market bazaar', baseChance: 0.5, desc: 'Permanent underground market: contraband, forged documents, illegal services.', facets: { subterranean: 'subterranean' } },
    },
  }),
  family('Criminal', {
    shared: { name: 'Contract killer', required: false, baseChance: 0.25, desc: 'An individual or small cell operating beneath the assassins guild threshold. Accepts contracts through criminal intermediaries. Less reliable but deniable.', tags: ['guild', 'military'], priorityCategory: 'criminal' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Criminal', {
    shared: { name: "Assassins' guild" },
    at: {
      metropolis: { required: false, baseChance: 0.2, desc: 'Professional contract killing. Operates through cutouts, never acknowledged officially.', tags: ['criminal'], priorityCategory: 'criminal' },
    },
  }),
  family('Criminal', {
    shared: { name: 'Kidnapping ring', required: false, baseChance: 0.15, exclusionConditions: ['Slave market', 'Slave market district'], desc: 'Targets free persons for fraudulent insertion into slavery through forged provenance documents. Where no lawful market exists to absorb the traffic, it runs its own holding, its own escorts, and its own silence.', tags: ['criminal', 'underground'], priorityCategory: 'criminal' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Criminal', {
    shared: { name: 'Human trafficking network', required: false, baseChance: 0.2, exclusionConditions: ['Slave market', 'Slave market district'], desc: 'Fully clandestine operation moving persons across jurisdictions outside legal channels. Only fires where no legal slave market exists. Distinct logistics, safe houses, and corrupt border infrastructure.', tags: ['criminal', 'underground', 'smuggling'], priorityCategory: 'criminal' },
    at: {
      city: {},
      metropolis: {},
    },
  }),

  // ══════════════════════ ENTERTAINMENT ══════════════════════
  // The village musician was filed on Religious (tagged religious) until 2026-09-30.
  family('Entertainment', {
    shared: { required: false, tags: [], priorityCategory: 'entertainment' },
    at: {
      village: { name: 'Village musician', baseChance: 0.25, desc: 'A resident singer, fiddler, or piper. Plays at festivals and weddings. Also a keeper of local history through song.' },
      town: { name: 'Traveling performers', baseChance: 0.8, desc: 'Bards, jugglers, acrobats visit during fairs.' },
    },
    ceiling: { tier: 'town', reason: 'Cities keep permanent theaters.' },
    successor: 'Theaters',
  }),
  family('Entertainment', {
    shared: { required: false, exclusiveGroup: 'theaterScale', tags: [], priorityCategory: 'entertainment' },
    at: {
      town: { name: 'Theaters', baseChance: 0.15, desc: 'Permanent performance venues.' },
      city: { name: 'Theaters', baseChance: 0.5, desc: 'Permanent performance venues.' },
      metropolis: { name: 'Multiple theaters', baseChance: 0.7, desc: 'Permanent venues. Professional companies.' },
    },
  }),
  family('Entertainment', {
    shared: { name: 'Opera house' },
    at: {
      metropolis: { required: false, baseChance: 0.3, desc: 'High culture. Elite patronage.', tags: ['luxury'], priorityCategory: 'entertainment' },
    },
  }),
  family('Entertainment', {
    shared: { name: 'Bardic college', required: false, desc: 'Formal musical education. Amphitheater, dormitories. 10,000+ for small campus.', tags: ['education'], priorityCategory: 'entertainment' },
    at: {
      city: { baseChance: 0.4, minPopulation: 10000 },
      metropolis: { baseChance: 0.45 },
    },
  }),
  family('Entertainment', {
    shared: { required: false, tags: [], priorityCategory: 'entertainment' },
    at: {
      town: { name: 'Gambling den', baseChance: 0.4, desc: 'Dice, cards, simple games of chance.' },
      city: { name: 'Gambling halls', baseChance: 0.6, exclusiveGroup: 'gamblingScale', desc: 'Dedicated establishments. Some illegal.' },
      metropolis: { name: 'Gambling district', baseChance: 0.8, exclusiveGroup: 'gamblingScale', desc: 'Concentrated gaming houses. Play kept honest by compelled truth.' },
    },
  }),
  family('Entertainment', {
    shared: { required: false, tags: [], priorityCategory: 'entertainment' },
    at: {
      town: { name: 'Brothel', baseChance: 0.5, desc: 'Tolerated or regulated prostitution.' },
      city: { name: 'Brothel (red light district)', baseChance: 0.7, exclusiveGroup: 'redLightScale', desc: 'Legal or tolerated prostitution quarter.' },
      metropolis: { name: 'Brothel (red light district)', baseChance: 0.7, exclusiveGroup: 'redLightScale', desc: 'Legal or tolerated prostitution quarter.' },
    },
  }),
  family('Entertainment', {
    shared: { name: 'Red light district', required: false, baseChance: 0.9, exclusiveGroup: 'redLightScale', desc: 'Large organized prostitution quarter.', tags: [], priorityCategory: 'entertainment' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Entertainment', {
    shared: { name: 'Fighting pits', required: false, desc: 'Illegal or semi-legal combat. Underground locations.', tags: [], priorityCategory: 'entertainment' },
    at: {
      town: { baseChance: 0.2 },
      city: { baseChance: 0.3 },
      metropolis: { baseChance: 0.3 },
    },
  }),
  family('Entertainment', {
    shared: { name: 'Gladiatorial school', required: false, desc: 'Trains fighters for public spectacle. Recruits from prisoners, debtors, and volunteers. Feeds the arena circuit.', tags: ['military'], priorityCategory: 'government' },
    at: {
      town: { baseChance: 0.15 },
      city: { baseChance: 0.2 },
      metropolis: { baseChance: 0.25 },
    },
  }),
  family('Entertainment', {
    shared: { name: 'Colosseum/arena' },
    at: {
      metropolis: { required: false, baseChance: 0.4, desc: 'Gladiatorial games or monster fights. Massive scale.', tags: [], priorityCategory: 'entertainment' },
    },
  }),
  // Filed on Adventuring until 2026-09-30.
  family('Entertainment', {
    shared: { name: 'Charlatan fortune tellers', required: false, desc: "Non-magical 'divination' worked by Deception, for a few coins a reading.", tags: [], priorityCategory: 'adventuring' },
    at: {
      town: { baseChance: 0.3 },
      city: { baseChance: 0.4 },
      metropolis: { baseChance: 0.45 },
    },
  }),

  // ══════════════════════ EXOTIC ══════════════════════
  family('Exotic', {
    shared: { name: 'Planar traders' },
    at: {
      metropolis: { required: false, baseChance: 0.3, desc: 'Goods from other planes of existence.', tags: ['planar', 'trade'], magicLicense: 'high', priorityCategory: 'exotic' },
    },
  }),
  family('Exotic', {
    shared: { name: 'Dragon resident' },
    at: {
      metropolis: { required: false, baseChance: 0.1, desc: 'Ancient wyrm living in city.', tags: [], magicLicense: 'none', priorityCategory: 'exotic' },
    },
  }),
  family('Exotic', {
    shared: { name: 'Golem workforce', required: false, baseChance: 0.2, desc: 'Constructed servants if magic permits.', tags: ['arcane'], magicLicense: 'high', priorityCategory: 'exotic' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Exotic', {
    shared: { name: 'Undead labor', required: false, baseChance: 0.1, desc: 'Animated corpses working. Controversial.', tags: ['arcane'], magicLicense: 'high', priorityCategory: 'exotic' },
    at: {
      city: {},
      metropolis: {},
    },
  }),
  family('Exotic', {
    shared: { name: 'Dream parlors (high magic)' },
    at: {
      metropolis: { required: false, baseChance: 0.2, desc: 'Dream-walking magic sold as experience. Lucid shared dreams, communication.', tags: ['arcane', 'exotic'], magicLicense: 'high', priorityCategory: 'exotic' },
    },
  }),
  family('Exotic', {
    shared: { name: 'Airship docking (high magic)' },
    at: {
      metropolis: { required: false, baseChance: 0.1, desc: 'Mooring towers with magical weather protection.', tags: ['arcane', 'exotic'], magicLicense: 'high', priorityCategory: 'exotic' },
    },
  }),
  family('Exotic', {
    shared: { name: 'Message network (high magic)' },
    at: {
      metropolis: { required: false, baseChance: 0.3, desc: 'Paired Speaking Stones set in a network. Each station costs as much as a merchant house, and only the crown or the great guilds keep one.', tags: ['arcane', 'exotic'], magicLicense: 'high', priorityCategory: 'exotic' },
    },
  }),
]);

const clonePlain = (value) => (value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value);

/**
 * One family's entry at one tier, as the catalog row every reader takes. Throws on an unknown
 * key so a typo'd field can never ride silently into generation.
 * @param {InstitutionFamily} fam @param {string} tier
 * @returns {{ name: string, row: Record<string, unknown> }}
 */
function deriveRow(fam, tier) {
  const merged = { ...(fam.shared || {}), ...fam.at[tier] };
  for (const key of Object.keys(merged)) {
    if (!ENTRY_KEYS.has(key)) throw new Error(`institutionalCatalog: unknown key "${key}" on ${tier} / ${merged.name}`);
  }
  const name = /** @type {string} */ (merged.name);
  const row = /** @type {Record<string, unknown>} */ ({});
  row.required = merged.required === true;
  row.baseChance = typeof merged.baseChance === 'number' ? merged.baseChance : (row.required ? 1 : 0);
  for (const key of ROW_KEYS.slice(2)) {
    if (merged[key] !== undefined) row[key] = clonePlain(merged[key]);
  }
  /** @type {{ minPopulation?: number, requiresAny?: string[] } | null} */
  let guards = null;
  for (const key of GUARD_KEYS) {
    if (merged[key] !== undefined) guards = { ...(guards || {}), [key]: clonePlain(merged[key]) };
  }
  return { name, row, guards };
}

/**
 * THE ROW GUARDS LIVE IN THE REGISTRY, NOT ON THE ROW. Every adding pass spreads a catalog row
 * onto the settlement record it creates, so a guard written on the row would ride into every
 * save — and `requiresAny` names institutions, which would hand the rename cascade a stored
 * path it does not own (tests/domain/institutionRename.test.js caught exactly that). The guard
 * is a rule about whether a row may roll, so it is looked up by (tier, name) at the roll.
 * @type {Map<string, { minPopulation?: number, requiresAny?: string[] }>}
 */
const GUARDS_BY_ROW = new Map();
const guardKey = (tier, name) => `${tier}\u0000${name}`;

/** @returns {Record<string, Record<string, Record<string, Record<string, any>>>>} */
function buildCatalog() {
  /** @type {Record<string, Record<string, Record<string, Record<string, any>>>>} */
  const out = {};
  for (const tier of INSTITUTION_TIERS) {
    /** @type {Record<string, Record<string, Record<string, any>>>} */
    const block = {};
    for (const shelf of SHELF_ORDER) {
      for (const fam of INSTITUTION_FAMILIES) {
        if (fam.shelf !== shelf || !fam.at[tier]) continue;
        const { name, row, guards } = deriveRow(fam, tier);
        if (guards) GUARDS_BY_ROW.set(guardKey(tier, name), Object.freeze(guards));
        if (!block[shelf]) block[shelf] = {};
        for (const other of Object.values(block)) {
          if (other[name]) throw new Error(`institutionalCatalog: "${name}" listed twice at ${tier}`);
        }
        block[shelf][name] = row;
      }
    }
    out[tier] = block;
  }
  return out;
}

export const institutionalCatalog = buildCatalog();

const INSTITUTION_CATALOG = institutionalCatalog;

/**
 * The family's name at each tier it exists, in tier order.
 * @param {InstitutionFamily} fam @returns {Array<{ tier: string, name: string }>}
 */
export function familyNamesByTier(fam) {
  return INSTITUTION_TIERS
    .filter(tier => fam.at[tier])
    .map(tier => ({ tier, name: /** @type {string} */ (fam.at[tier].name ?? fam.shared?.name) }));
}

/**
 * THE DERIVED SCALE LADDER. Consecutive distinct names of one family are the same function at
 * two scales, so the greater replaces the lesser (the UPGRADE_CHAINS contract); a family that
 * declares a `successor` hands its last name to that row. institutionLadders.js unions these with
 * its hand-authored cross-family pairs, so a new scale rung can never be left out of the ladder
 * (the omission that let 'Mill' sit beside 'Mills (2-5)' in 87 of 200 towns).
 * @returns {ReadonlyArray<readonly [string, string]>}
 */
export function familyLadderPairs() {
  /** @type {Array<readonly [string, string]>} */
  const pairs = [];
  const seen = new Set();
  const push = (lesser, greater) => {
    const key = `${lesser}\u0000${greater}`;
    if (lesser === greater || seen.has(key)) return;
    seen.add(key);
    pairs.push(Object.freeze([lesser, greater]));
  };
  for (const fam of INSTITUTION_FAMILIES) {
    const names = familyNamesByTier(fam).map(e => e.name);
    for (let i = 1; i < names.length; i++) push(names[i - 1], names[i]);
    if (fam.successor && names.length) push(names[names.length - 1], fam.successor);
  }
  return Object.freeze(pairs);
}

/**
 * The guards a catalog row declares at a tier, or null.
 * @param {string} tier @param {string} name
 * @returns {{ minPopulation?: number, requiresAny?: string[] } | null}
 */
export function institutionRowGuards(tier, name) {
  return GUARDS_BY_ROW.get(guardKey(tier, name)) ?? null;
}

/**
 * THE ROW GUARDS every adding pass honours: a population floor the row's text states, and an
 * institution it cannot stand without. A row that declares no guard passes.
 * @param {string} tier the catalog tier the row is read from
 * @param {string} name the catalog row's name
 * @param {{ population?: number | null, presentNames?: Set<string> | null }} context
 * @returns {boolean}
 */
export function institutionRowGuardsPass(tier, name, { population = null, presentNames = null } = {}) {
  const guards = institutionRowGuards(tier, name);
  if (!guards) return true;
  if (typeof guards.minPopulation === 'number' && typeof population === 'number' && population < guards.minPopulation) return false;
  if (Array.isArray(guards.requiresAny) && guards.requiresAny.length > 0) {
    if (!presentNames || !guards.requiresAny.some(required => presentNames.has(required))) return false;
  }
  return true;
}

// ── Catalog identity (Cohesion Wave 8 — structural prevention) ───────────────
// Every catalog entry has a stable id: the deterministic slug of its canonical
// name. Entries appearing at multiple tiers under the SAME name share the id
// (same name → same slug); distinct entries ('Merchant guilds (3-8)' vs
// 'Merchant guilds (15-40)') get distinct ids. The id is the JOIN key that
// replaces identity-by-label: institutions stamped with catalogId
// (assembleInstitutions) are matched by id, and only unstamped content
// (legacy saves, custom/DM institutions) falls back to name matching.

/** Deterministic slug of a canonical institution name. */
export function slugifyInstitutionName(name) {
  return kernelSlugify(name, { sep: '_', raw: true });
}

// normalized name → id. Collision-checked at module load: two DIFFERENT
// canonical names must never slug to the same id, or id-joins would alias
// them the way the old 12-char-prefix matcher did.
function buildCatalogIdIndex() {
  const byName = new Map();
  const nameForId = new Map();
  for (const tierCatalog of Object.values(INSTITUTION_CATALOG)) {
    for (const group of Object.values(tierCatalog)) {
      for (const name of Object.keys(group)) {
        const key = name.toLowerCase();
        if (byName.has(key)) continue; // same name at another tier shares the id
        const id = slugifyInstitutionName(name);
        const holder = nameForId.get(id);
        if (holder && holder !== key) {
          throw new Error(
            `institutionalCatalog id collision: "${name}" and "${holder}" both slug to "${id}". Rename one`,
          );
        }
        nameForId.set(id, key);
        byName.set(key, id);
      }
    }
  }
  return byName;
}

const CATALOG_ID_BY_NAME = buildCatalogIdIndex();

/**
 * Stable catalog id for an institution name — EXACT normalized (lowercase,
 * trimmed) lookup, no fuzzy matching. Returns null for unknown names: custom
 * and DM-authored institutions carry no catalogId, and every id-first join
 * falls back to the legacy name matcher for them.
 */
export function catalogIdForName(name) {
  if (name == null) return null;
  return CATALOG_ID_BY_NAME.get(String(name).trim().toLowerCase()) ?? null;
}
