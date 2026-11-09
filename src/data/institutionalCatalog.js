// institutionalCatalog.js — THE INSTITUTION REGISTRY: one definition per institution family.
//
// ── THE SHAPE (the urban-band rebuild, owner-approved 2026-09-30) ─────────────────────────────
// Each FAMILY is one function at every tier it exists (a smithy is a part-time smith at a
// hamlet, a blacksmith at a village, several smiths at a town). A family names ONE shelf, so a
// function can never be filed on two shelves at two scales again (Merchant warehouses sat on
// Adventuring while its city rung, Warehouse district, sat on Economy). `at` holds each tier's
// entry; `shared` holds a field's common value, and an entry that differs carries its own (an
// override); a number goes to `shared` only when every entry agrees. Families are grouped by shelf.
// An entry is optional unless it says `required: true`, and its `baseChance` defaults to 1 when
// required and 0 otherwise; neither default is spelled out (deriveRow supplies both). Spelling
// each value once is what keeps this eager module inside the first-paint closure budget
// (tests/build/vendorPdfLazy.test.js).
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
//
// THE FABRIC (X-46 car 3, docs/DESIGN_X46_SCALE_TRAIN.md §4): `fabric: true` marks a row that is
// the place rather than a house with a power behind it — the Dwellings family, the well-level
// water source, the walk to another settlement's church and to another's mill. The rule (the
// chair's ruling, 2026-11-04): no power behind it (X-45 weight 0), no service, no seat. It is a registry key like the guards
// (read through `isFabricRow` / `isFabricInstitution`, never riding onto a row or a save). A
// fabric row rolls and prints exactly as before; it is not counted in the institution budget.
//
// THE AUTHORED RARITY (the chair's addendum to the rung-1 pins, 2026-11-04): `rare: true` marks a
// row whose chance the catalogue authored as a rarity ("a resident dragon stays occasional"), so
// the institution budget's density factor never scales it (institutionBudget.js ::
// isDensityExempt). Registry-only like the fabric (read through `isRareRow`); never on a row.
//
// THE FACE (the people car, PEOPLE-1 CAST, 2026-11-07; the chair's ruling R-P1 in
// docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md on PEOPLE-0's table, the owner's charter in
// ODQ §934.105: "for every appropriate institution, we generate one NPC … just one person per
// institution. They act as the face"): `face: '<title>'` marks a family whose house has ONE
// keeper the representative generator births as its face, under that title ("the miller", "the
// castellan"); `face: null` marks a family with no face — a place of many stalls or trades with no
// single keeper (a market, a fair, a quarter, the docks), the fabric, the commons; `face: 'seat'`
// marks the two government buildings (City hall, Palace/government complex) whose face is the
// SEAT where no Government-shelf house rolls beside them, and no face where one does. Every
// family declares it (a family that does not throws at load: a silent miss would be a house with
// no keeper and no ruling). A FABRIC tier row resolves to no face whatever its family says
// (R-P1 a). `noPower: true` beside it flags the three weight-0 persons (the musician, the fortune
// teller, the dragon) that are a face in NO power (R-P1 e: weight 0 lands no share). Registry-only
// like the fabric (read through `faceOfRow` / `faceOfInstitution`); never on a row or a save.

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
/** The registry-only marks a tier entry may declare (the fabric and the rarity, X-46 car 3; the face
 *  and its no-power flag, the people car); never on a row. */
const MARK_KEYS = Object.freeze(['fabric', 'rare', 'face', 'noPower', 'front']); const NOTE_KEYS = Object.freeze(['thresholdNote']); // CENSUS-4 R8: the designer's threshold note ("viable above 5,000 souls"), registry-only, never on a row or a page
/**
 * THE FRONT MARK (the allegiance train, car 1, ALLEGIANCE-CAR1, 2026-11-08; the design §1.4 and the
 * chair's ruling J-7): a legitimate family whose house's face can carry a hidden allegiance AS A FRONT
 * — a house whose trade can carry the guild's business (launder its coin, move its goods, house its
 * people). `front: 'prime'` (cash moves, goods move, strangers come and go: drink, travel, storage,
 * cash, crowds) or `front: 'front'` (materials come in and goods go out, so something extra can
 * travel with them). Registry-only, like the face and the fabric (read through
 * `frontClassOfInstitution` / `isFrontCapableInstitution`); never on a row or a save. A family the
 * mark does not name is not front-capable (J-7's default) and is listed by
 * tests/generators/people/allegiance.test.js for the chair.
 */
export const FRONT_CLASSES = Object.freeze(['prime', 'front']);
/** The one word a `face` mark may carry besides a title or null: the seat's building (R-P1 c). */
export const FACE_SEAT = 'seat';
const ENTRY_KEYS = new Set(['name', ...ROW_KEYS, ...GUARD_KEYS, ...MARK_KEYS, ...NOTE_KEYS]);

/**
 * @typedef {{ tier: string, reason: string }} FamilyCeiling
 * @typedef {{ shelf: string, shared?: Record<string, unknown>, at: Record<string, Record<string, unknown>>,
 *   ceiling?: FamilyCeiling, successor?: string }} InstitutionFamily
 */

/**
 * One shelf's families, in registry order (the draw order within the shelf).
 * @param {string} name @param {Array<Omit<InstitutionFamily, 'shelf'>>} specs
 * @returns {InstitutionFamily[]}
 */
function shelf(name, specs) {
  return specs.map(spec => Object.freeze({ shelf: name, ...spec }));
}

/** @type {ReadonlyArray<InstitutionFamily>} */
export const INSTITUTION_FAMILIES = Object.freeze([

  // ══════════════════════ ECONOMY ══════════════════════
  ...shelf('Economy', [
    {
      shared: { name: 'Subsistence farming', face: null, required: true, tags: ['essential', 'agriculture'], priorityCategory: 'economy' },
      at: {
        thorp: { desc: 'Each household farms just enough land to feed itself.' },
        hamlet: { desc: 'Strip farming in open fields.' },
        village: { name: 'Farmland', desc: 'Open-field agriculture with crop rotation.' },
      },
      ceiling: { tier: 'village', reason: 'A town is fed by its hinterland: the granary and the market carry farming in the town roster.' },
    },
    {
      shared: { name: 'Common grazing land', face: null, required: true, tags: ['essential', 'agriculture'], priorityCategory: 'economy' },
      at: {
        hamlet: { desc: 'Shared pasture for village livestock.' },
        village: { desc: 'Shared pasture for village livestock, held in common alongside the open fields.' },
      },
      ceiling: { tier: 'village', reason: 'Commons are a rural institution; towns graze on leased or enclosed land outside the walls.' },
    },
    {
      shared: { name: 'Communal root cellar', face: null },
      at: {
        thorp: { baseChance: 0.25, desc: 'A shared underground store for grain, roots, and preserved food. Vital buffer against a bad harvest.', tags: ['food', 'agriculture', 'essential'], priorityCategory: 'economy' },
      },
      ceiling: { tier: 'thorp', reason: 'A hamlet stores household by household; the granary is the town rung.' },
    },
    {
      shared: { name: "Fisher's landing", face: 'the boat-headman', tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'], desc: 'A rough landing with racks for drying and salting fish. Primary protein source near water.', tags: ['trade'], priorityCategory: 'economy' },
      at: {
        thorp: { name: 'Fishing community', baseChance: 0.72, desc: "Nets, traps, and drying racks. The settlement's economy is inseparable from the water.", tags: ['food', 'water', 'economy'] },
        hamlet: { baseChance: 0.55 },
        village: { baseChance: 0.55 },
      },
      ceiling: { tier: 'village', reason: 'At town scale the catch lands at the docks and is sold through the fish market.' },
      successor: 'Docks/port facilities',
    },
    {
      shared: { name: 'Fishmonger', face: 'the fishmonger' },
      at: {
        village: { baseChance: 0.35, forbiddenTradeRoutes: ['isolated'], desc: 'Buys, salts, and sells fish. The link between fishing and consumption. Near water: fresh. Inland: dried or salted.', tags: ['trade'], priorityCategory: 'economy' },
      },
      ceiling: { tier: 'village', reason: 'Absorbed by the fish market at town scale.' },
      successor: 'Fish market',
    },
    {
      shared: { front: 'prime', name: 'Fish market', face: 'the master fishmonger', desc: "A covered fish market under the market wardens. The morning's catch or the week's salted barrels, sold by weight and inspected for rot.", tags: ['market', 'trade'], priorityCategory: 'government' },
      at: {
        village: { baseChance: 0.3, desc: "An open-air stall or small covered market where the day's catch is sold. Prices drop fast. Fish doesn't wait." },
        town: { baseChance: 0.45 },
        city: { baseChance: 0.55 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { name: 'Shepherd', face: 'the head shepherd', desc: 'Manages sheep flocks for wool and meat. Seasonal transhumance. Moves flocks between lowland winter pasture and upland summer grazing. Key supplier to the textile trade.', tags: ['trade', 'textile'], priorityCategory: 'economy' },
      at: {
        thorp: { name: 'Shepherd collective', baseChance: 0.35, tradeRouteRequired: ['road', 'isolated', 'crossroads'], terrainRequired: ['plains', 'hills'], desc: 'Communal flock management. The rhythms of the settlement follow the grazing calendar.', tags: ['food', 'agriculture'] },
        hamlet: { baseChance: 0.22 },
        village: { baseChance: 0.22 },
      },
      ceiling: { tier: 'village', reason: 'Flocks graze the countryside; towns buy wool through the weavers and the market.' },
    },
    {
      shared: { name: 'Dairy farmer', face: 'the dairy farmer', tags: ['food', 'trade'], priorityCategory: 'economy' },
      at: {
        hamlet: { baseChance: 0.25, desc: 'Keeps cattle or goats for milk, butter, and cheese. The only reliable fat and protein source during grain shortages. Seasonal. Production peaks in summer.' },
        village: { baseChance: 0.22, desc: 'Keeps cattle or goats for milk, butter, and soft cheese. Essential protein and fat during lean grain seasons. Sells surplus at the weekly market.' },
      },
      ceiling: { tier: 'village', reason: 'Dairying is rural; towns buy milk, butter, and cheese at market.' },
    },
    {
      shared: { name: 'Beekeeper', face: 'the beekeeper' },
      at: {
        village: { baseChance: 0.2, desc: 'Maintains hives for honey and beeswax. Honey sweetens; beeswax makes candles, wax seals, and polish.', tags: ['trade'], priorityCategory: 'economy' },
      },
      ceiling: { tier: 'village', reason: 'Hives are kept in the countryside; the town chandler buys the wax.' },
    },
    {
      shared: { name: 'Wildfowler', face: 'the wildfowler' },
      at: {
        village: { baseChance: 0.15, desc: 'Catches waterfowl and game birds using nets, traps, and trained birds. Supplies the market with ducks, geese, and pigeons.', tags: ['trade'], priorityCategory: 'economy' },
      },
      ceiling: { tier: 'village', reason: 'Fowling is a marsh and field trade; towns buy the birds at market.' },
    },
    {
      shared: { name: "Woodcutter's camp", face: 'the camp foreman', terrainRequired: ['forest'], desc: 'Felling crews and a stacking yard at the forest edge. The settlement lives on timber, charcoal wood, and the carting of both.', tags: ['economy', 'timber'], priorityCategory: 'economy' },
      at: {
        thorp: { baseChance: 0.55, desc: 'Seasonal felling and timber stacking. The whole settlement smells of fresh sawdust and pine resin.' },
        hamlet: { baseChance: 0.45 },
        village: { baseChance: 0.45 },
      },
      ceiling: { tier: 'village', reason: 'Timber reaches towns as sawn stock; the commercial sawmill is the town rung of the trade.' },
    },
    {
      shared: { front: 'front', name: 'Charcoal burner', face: 'the collier', desc: 'Kiln crews in the surrounding woodland supply charcoal to the smelters, smiths, and bakers. Metalworking here burns through a forest a generation.', tags: ['trade'], priorityCategory: 'economy' },
      at: {
        hamlet: { baseChance: 0.2, desc: 'Operates kilns in nearby woodland. Supplies fuel for smithing and baking. Essential intermediate step between forest and forge.' },
        village: { baseChance: 0.18, desc: "Operates kilns in the surrounding woodland, supplying fuel for smithing, baking, and heating. The settlement's most reliable fuel source when timber is abundant." },
        town: { baseChance: 0.2 },
        city: { baseChance: 0.15 },
        metropolis: { baseChance: 0.15 },
      },
    },
    {
      shared: { name: 'Peat cutter', face: 'the peat-reeve', baseChance: 0.18, desc: 'Cuts and dries peat blocks from nearby marshland for domestic fuel. Seasonal. Sells winter warmth.', tags: ['trade'], priorityCategory: 'economy' },
      at: {
        hamlet: {},
        village: {},
      },
      ceiling: { tier: 'village', reason: 'Peat is cut for the household hearth; towns buy fuel through the charcoal and coal trade.' },
    },
    {
      shared: { name: 'Mine', face: 'the mine captain', desc: 'A worked shaft or adit with hired crews, winding gear, and ore carts. Where the deposits run deep, the mine is the reason the settlement grew.', tags: ['trade'], priorityCategory: 'economy' },
      at: {
        hamlet: { name: 'Mine (open cast)', baseChance: 0.2, desc: 'A shallow excavation or shaft dug to extract iron ore, coal, or stone. Employs the poorest labourers. Dangerous, dirty, and essential.' },
        village: { baseChance: 0.12, desc: 'A shaft or excavation to extract iron ore, coal, or stone. Requires capital and organisation a thorp cannot sustain, but a village near deposits can. Employs the poorest labourers.' },
        town: { baseChance: 0.12 },
        city: { baseChance: 0.08 },
        metropolis: { baseChance: 0.08 },
      },
    },
    {
      shared: { name: 'Stone quarry', face: 'the quarry master', desc: 'A working quarry with dressed-stone yards and a crew of masons. Builds the walls and churches of half the region.', tags: ['trade'], priorityCategory: 'economy' },
      at: {
        hamlet: { baseChance: 0.18, desc: 'Cuts and dresses stone blocks for construction. A crew of quarrymen with picks and wedges. Slow but the only way to get proper building material.' },
        village: { baseChance: 0.15, desc: "Systematic extraction of building stone. A village on good quarry land can supply half a region's construction needs, and the quarry master knows it." },
        town: { baseChance: 0.15 },
        city: { baseChance: 0.1 },
        metropolis: { baseChance: 0.1 },
      },
    },
    {
      shared: { name: 'Salt works', face: 'the salt master', desc: "Evaporation pans or brine processing along the coast or riverbank. Salt is the settlement's most traded commodity by weight. Every household needs it.", tags: ['trade'], priorityCategory: 'economy' },
      at: {
        hamlet: { baseChance: 0.2, desc: 'Evaporates naturally saline brine into the raw salt used for preservation. Viable only where salt flats, springs, or other workable brine deposits provide a local supply.' },
        village: { baseChance: 0.14, tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'] },
        town: { baseChance: 0.15, tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'] },
        city: { baseChance: 0.12, tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'] },
        metropolis: { baseChance: 0.12, tradeRouteRequired: ['port', 'river'], terrainAccess: ['coastal', 'riverside'] },
      },
    },
    {
      shared: { name: "Hunter's lodge", face: 'the master of the hunt', desc: "Organises hunting parties across the surrounding territory. Sells venison, pelts, and game to market. Doubles as a source of local wilderness knowledge: which trails are safe, which aren't.", tags: ['trade', 'military'], priorityCategory: 'economy' },
      at: {
        hamlet: { baseChance: 0.25, desc: 'Hunters pool knowledge, prepare game, and sell pelts. Tracks routes, seasons, and dangerous animals.' },
        village: { baseChance: 0.18 },
        town: { baseChance: 0.15 },
      },
      ceiling: { tier: 'town', reason: 'Cities buy game and pelts through the furriers and keep no hunters of their own.' },
      successor: "Furrier's district",
    },
    {
      shared: { front: 'front', name: "Furrier's district", face: 'the master furrier', baseChance: 0.35, desc: 'Fur processors, traders, and retailers concentrated in one area. High-value trade. Quality furs are luxury goods.', tags: ['trade', 'guild'], priorityCategory: 'economy' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Weekly market', face: null, exclusiveGroup: 'marketScale', tags: ['essential', 'market', 'trade'], priorityCategory: 'economy' },
      at: {
        hamlet: { name: 'Periodic market', baseChance: 0.12, desc: 'Monthly or seasonal trading day. No charter. Just habit, proximity, and a flat piece of ground.', tags: ['market', 'trade'] },
        village: { baseChance: 0.6, desc: 'Local produce and goods. Requires royal/noble charter.', tags: ['market', 'trade'] },
        town: { required: true, desc: 'Royal charter required. Major economic driver.' },
        city: { name: 'Daily markets', required: true, desc: 'Permanent market activity in multiple locations.' },
        metropolis: { name: 'District markets (5-10)', required: true, desc: 'Five to ten permanent specialized market districts: grain, livestock, cloth, metals, exotica.' },
      },
    },
    {
      shared: { name: 'Multiple market squares', face: null, required: true, desc: 'Multiple permanent market squares serve different districts.', tags: ['essential', 'market'], priorityCategory: 'economy' },
      at: {
        town: { name: 'Market square', desc: 'Central plaza for weekly markets and fairs.' },
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Major annual fairs', face: null, desc: 'International merchants. Letters of credit accepted.', tags: ['market', 'trade'], priorityCategory: 'economy' },
      at: {
        town: { name: 'Annual fair', baseChance: 0.7, desc: 'Regional merchants. Luxury goods available.' },
        city: { baseChance: 0.9 },
        metropolis: { baseChance: 0.9 },
      },
    },
    {
      shared: { name: 'International trade center', face: 'the exchange master' },
      at: {
        metropolis: { baseChance: 0.55, desc: 'Hub for international merchant representatives, trade arbitration, and commodity exchange.', tags: ['trade', 'market'], priorityCategory: 'economy' },
      },
    },
    {
      shared: { front: 'prime', face: 'the senior guild master', tags: ['guild', 'trade'], priorityCategory: 'economy' },
      at: {
        town: { name: 'Merchant guilds (3-8)', baseChance: 0.8, desc: 'Control trade in specific goods.' },
        city: { name: 'Merchant guilds (15-40)', baseChance: 0.95, desc: 'Powerful political force.' },
        metropolis: { name: 'Merchant guilds (50-100+)', baseChance: 0.95, desc: 'Dozens of merchant guilds representing every major trade good and route. A formal guild parliament.' },
      },
    },
    {
      shared: { front: 'prime', face: 'the banker', tags: ['banking', 'trade'], priorityCategory: 'economy' },
      at: {
        // X-46 car 2: the owner's bands put a town at 300–2,500; the row stays a town row with its
        // chain; the floor moves to the band's top fifth (the design's recorded exception, ODQ §934.104).
        town: { name: 'Money changers', baseChance: 0.5, minPopulation: 2000, desc: 'Exchange foreign currency. Early banking.', thresholdNote: 'Early banking (2,000+ population).' },
        city: { name: 'Banking houses', baseChance: 0.7, desc: 'Loans, currency exchange, letters of credit. Basic banking.', thresholdNote: 'Basic banking (5,000+).' },
        metropolis: { name: 'Banking district', baseChance: 0.8, desc: 'Consolidated financial quarter: international banking, letters of credit, currency speculation at scale.' },
      },
    },
    {
      shared: { front: 'prime', name: 'Pawnbroker', face: 'the pawnbroker', desc: 'Lends against pledged goods at high interest and asks no questions. The only credit open to labourers, journeymen, and anyone the banks turn away.', tags: ['banking'], priorityCategory: 'government' },
      at: {
        hamlet: { baseChance: 0.15, desc: 'Lending against pledged goods. High interest, no questions. The only credit available to peasants and small craftsmen.' },
        village: { baseChance: 0.2, desc: 'Lending against pledged goods. High interest, no questions. The only credit available to peasants and small craftsmen.' },
        town: { baseChance: 0.3 },
        city: { baseChance: 0.35 },
        metropolis: { baseChance: 0.4 },
      },
    },
    {
      shared: { front: 'prime', name: 'Inns and taverns (district)', face: 'the innkeeper', desc: 'Multiple inn districts catering to merchants, travelers, and long-term visitors.', tags: ['trade', 'lodging'], priorityCategory: 'economy' },
      at: {
        hamlet: { name: 'Wayside inn', baseChance: 0.2, desc: 'A room above a stable and a common meal for travelers passing through. Exists because the road does.' },
        village: { name: "Travelers' inn", baseChance: 0.6, desc: 'A single inn serving traders, pilgrims, and travelers passing through. Rooms, stabling, and a common meal.' },
        town: { name: 'Inn (multiple)', required: true, desc: 'Lodging for traveling merchants.', tags: ['trade'] },
        city: { required: true },
        metropolis: { required: true },
      },
    },
    {
      shared: { face: 'the alewife', tags: ['food'], priorityCategory: 'economy' },
      at: {
        hamlet: { name: 'Alehouse', baseChance: 0.55, desc: "Home-brewed ale sold from someone's back room. The hamlet's main gathering place. News, disputes, and arrangements all happen here.", tags: ['food', 'trade'] },
        village: { name: 'Ale house', baseChance: 0.8, desc: 'Home-based. Women brew and sell ale.' },
        town: { face: 'the tavern keeper', name: 'Taverns (5-20)', required: true, desc: 'Drinking establishments. Social hubs.' },
      },
      ceiling: { tier: 'town', reason: 'At city scale drink and lodging share one district row.' },
      successor: 'Inns and taverns (district)',
    },
    {
      shared: { front: 'prime', name: 'Coaching inn', face: 'the coaching-inn keeper', forbiddenTradeRoutes: ['isolated', 'port'], desc: 'Purpose-built for road travellers: stabling for relay horses, scheduled coach departures, meals served at fixed hours, and a passenger waiting room. Horses changed here, not just rested.', tags: ['transport', 'lodging'], priorityCategory: 'economy' },
      at: {
        town: { baseChance: 0.5 },
        city: { baseChance: 0.55 },
        metropolis: { baseChance: 0.55 },
      },
    },
    {
      shared: { front: 'prime', name: 'Caravanserai', face: 'the caravanserai keeper', terrainRequired: ['desert'], desc: 'A substantial walled compound for desert merchants: stabling for camels, locked storage, a well, and sleeping quarters for fifty. The economic hub of any desert settlement that sees caravan traffic.', tags: ['trade', 'lodging', 'transport'], priorityCategory: 'economy' },
      at: {
        hamlet: { baseChance: 0.15, desc: 'A walled waystation providing secure overnight lodging for merchants, animals, and goods. The centre of desert trade: water, fodder, and protection available for a fee. Without one, caravans cannot safely cross the surrounding terrain.' },
        village: { baseChance: 0.2 },
        town: { baseChance: 0.3 },
        city: { baseChance: 0.35 },
        metropolis: { baseChance: 0.35 },
      },
    },
    {
      shared: { front: 'prime', name: "Caravan masters' exchange", face: 'the exchange\'s steward', desc: 'Permanent offices where caravan masters, merchants, and armed escorts transact. Bonded freight, route intelligence, armed convoy assembly, and commercial dispute resolution.', tags: ['transport', 'trade', 'military'], priorityCategory: 'economy' },
      at: {
        village: { face: 'the waystation keeper', name: 'Waystation', baseChance: 0.25, desc: 'A fortified overnight stop with stabling, a well, and basic provisions. Serves merchant caravans and long-distance travellers. Distinct from the inn. Built for animals and loaded wagons, not comfort.', tags: ['transport', 'lodging'] },
        town: { face: 'the post\'s master', name: "Caravaneer's post", baseChance: 0.3, forbiddenTradeRoutes: ['isolated'], desc: "Coordinates regional caravan assembly, departure schedules, and route intelligence. Merchants register goods, hire guards, and arrange joint ventures here.", tags: ['transport', 'guild', 'trade'], priorityCategory: 'government' },
        city: { baseChance: 0.6, forbiddenTradeRoutes: ['isolated', 'port'] },
        metropolis: { baseChance: 0.6, forbiddenTradeRoutes: ['isolated', 'port'] },
      },
    },
    // The hiring hall sat at town beside the carriers' guild it is the lesser form of, and never
    // survived there (0 of 200 towns). It is the village rung.
    {
      shared: { face: 'the carriers\' master', priorityCategory: 'economy' },
      at: {
        village: { name: "Carriers' hiring hall", baseChance: 0.3, forbiddenTradeRoutes: ['isolated', 'port', 'river'], desc: 'A yard where carters, teamsters, and pack-animal drivers can be hired for the road. Returning drivers share road conditions and bandit reports over a cup of ale. Transactional, not institutional.', tags: ['transport', 'trade'] },
        town: { name: "Carriers' guild", baseChance: 0.65, desc: 'A guild of professional carters, teamsters, and pack-animal drivers who move goods overland for hire. They know every road, every toll, every seasonal closure, and they charge accordingly.', tags: ['transport', 'trade', 'guild'] },
      },
      ceiling: { tier: 'town', reason: 'City haulage is bonded through the caravan masters.' },
      successor: "Caravan masters' exchange",
    },
    {
      shared: { name: 'Pack animal trader', face: 'the horse-coper', desc: 'Buys and sells mules, donkeys, and draft horses. Rents animals to travellers and merchants who need load-carrying capacity for the road.', tags: ['trade', 'transport'], priorityCategory: 'economy' },
      at: {
        hamlet: { baseChance: 0.2 },
        village: { baseChance: 0.25 },
      },
      ceiling: { tier: 'village', reason: "Absorbed by the caravaneer's post at town scale." },
      successor: "Caravaneer's post",
    },
    {
      shared: { front: 'prime', name: 'Stable district', face: 'the stable master', desc: 'Concentrated stabling, horse trading, and farriery. Serves merchants, military, and travelers needing fresh mounts.', tags: ['trade'], priorityCategory: 'government' },
      at: {
        hamlet: { face: 'the stable keeper', name: 'Stable yard', baseChance: 0.25, desc: 'Communal stable where travelers can leave horses. Stableman provides basic farriery and fodder.', priorityCategory: 'economy' },
        village: { face: 'the stable keeper', name: 'Stable master', baseChance: 0.4, desc: 'Maintains stabling, trains horses for riding and draft work. Essential for any settlement on a road.', priorityCategory: 'economy' },
        town: { baseChance: 0.4 },
        city: { baseChance: 0.5 },
        metropolis: { baseChance: 0.5 },
      },
    },
    // The town rung of the animal-trade ladder (Stable yard → Stable master → Beast trainers) in
    // supplyChainData; filed on Adventuring until 2026-09-30.
    {
      shared: { front: 'front', name: 'Beast trainers', face: 'the beast master', desc: 'Common animals only. Horses, dogs, falcons.', tags: [], priorityCategory: 'adventuring' },
      at: {
        town: { baseChance: 0.3 },
        city: { baseChance: 0.45 },
        metropolis: { baseChance: 0.5 },
      },
    },
    {
      shared: { name: 'Post relay station', face: 'the postmaster', requiresAny: ['Coaching inn'], desc: 'Maintains a team of horses for rapid message relay out of the coaching inn. Letters and small packages travel far faster than foot traffic.', tags: ['trade'], priorityCategory: 'government' },
      at: {
        town: { baseChance: 0.3 },
        city: { baseChance: 0.45 },
        metropolis: { baseChance: 0.5 },
      },
    },
    {
      shared: { name: 'River ferry', face: 'the ferryman', tradeRouteRequired: ['river', 'port'], terrainAccess: ['riverside'], desc: "A flat-bottomed ferry crossing the river. The ferryman's family has held the crossing rights for generations. Essential for anyone who doesn't want a long walk to the nearest bridge.", tags: ['transport', 'trade'], priorityCategory: 'economy' },
      at: {
        village: { baseChance: 0.45 },
        town: { baseChance: 0.4 },
        city: { baseChance: 0.3 },
        metropolis: { baseChance: 0.3 },
      },
    },
    {
      shared: { name: 'River boatyard', face: 'the boatwright', tradeRouteRequired: ['river', 'port'], terrainAccess: ['riverside'], desc: 'Builds and repairs flat-bottomed river craft: barges, punts, ferries, fishing boats. Specialist knowledge of river construction: shallow draft, flexible hull, replaceable parts.', tags: ['transport', 'shipbuilding'], priorityCategory: 'crafts' },
      at: {
        village: { baseChance: 0.3 },
        town: { baseChance: 0.4 },
        city: { baseChance: 0.4 },
        metropolis: { baseChance: 0.4 },
      },
    },
    {
      shared: { name: 'Shipyard', face: 'the master shipwright', forbiddenTradeRoutes: ['road', 'crossroads', 'mountain_pass', 'isolated', 'river'], desc: 'City-scale shipyard constructing large merchant and war vessels. Multiple dry docks, ropewalk, sail loft, and dedicated ironworks. A major employer and a strategic military asset.', tags: ['transport', 'shipbuilding', 'port', 'military'], priorityCategory: 'crafts' },
      at: {
        town: { baseChance: 0.35, desc: 'Constructs and repairs ocean-going merchant vessels. Requires steady timber supply, iron fittings, and specialist shipwright labour. A major employer and a significant capital investment.', tags: ['transport', 'shipbuilding', 'port'] },
        city: { baseChance: 0.45 },
        metropolis: { baseChance: 0.45 },
      },
    },
    {
      shared: { name: 'Barge and river transport company', face: 'the barge master', forbiddenTradeRoutes: ['road', 'crossroads', 'mountain_pass', 'isolated', 'port'], desc: 'Operates a fleet of river barges on scheduled and commissioned runs. Carries bulk cargo, passengers, and military supply along the river network.', tags: ['transport', 'trade', 'port'], priorityCategory: 'economy' },
      at: {
        town: { baseChance: 0.3 },
        city: { baseChance: 0.55 },
        metropolis: { baseChance: 0.55 },
      },
    },
    {
      shared: { name: 'Docks/port facilities', face: 'the wharfinger', tradeRouteRequired: ['port', 'river'], desc: 'If coastal or river access. Essential for bulk trade.', tags: ['port', 'trade'], priorityCategory: 'economy' },
      at: {
        town: { baseChance: 0.55, desc: 'River or coastal dock. Essential for bulk water trade and river transport.' },
        city: { baseChance: 0.6 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { name: "Harbour master's office", face: 'the harbour master', tradeRouteRequired: ['port', 'river'], desc: 'Regulates harbour and river-port traffic, collects anchorage fees, assigns berths, and enforces port law.', thresholdNote: 'Navigable-water cities only.', tags: ['law_enforcement', 'port'], priorityCategory: 'economy' },
      at: {
        town: { baseChance: 0.25 },
        city: { baseChance: 0.4 },
        metropolis: { baseChance: 0.4 },
      },
    },
    {
      shared: { front: 'prime', name: 'Toll bridge', face: 'the toll-keeper', desc: 'A bridge with a toll house. The keeper collects passage fees and performs basic maintenance. Minor but steady revenue.', tags: ['trade'], priorityCategory: 'government' },
      at: {
        village: { baseChance: 0.2 },
        town: { baseChance: 0.3 },
        city: { baseChance: 0.3 },
        metropolis: { baseChance: 0.25 },
      },
    },
    {
      shared: { name: 'Customs house', face: 'the customs collector', desc: 'Levies duties on goods entering and leaving via the port or main roads. Run by royal or municipal officials.', tags: ['law_enforcement'], priorityCategory: 'government' },
      at: {
        town: { baseChance: 0.35 },
        city: { baseChance: 0.55 },
        metropolis: { baseChance: 0.65 },
      },
    },
    {
      shared: { face: 'the granary reeve', required: true, tags: ['essential', 'food'], priorityCategory: 'economy' },
      at: {
        town: { name: 'Town granary', desc: 'Communal grain storage. Buffers harvests, prevents famine.' },
        city: { face: 'the master of granaries', name: 'City granaries', desc: 'Multiple large grain stores distribute food across the city. State managed.' },
        metropolis: { face: 'the master of granaries', name: 'State granary complex', desc: 'State-administered granary network holding strategic reserves.' },
      },
    },
    // One function at two scales: filed on Adventuring at town and Economy at city until 2026-09-30.
    {
      shared: { front: 'prime', name: 'Warehouse district', face: 'the warehouse factor', desc: 'Storage for merchant goods.', tags: ['warehouse', 'trade'], priorityCategory: 'economy' },
      at: {
        town: { name: 'Merchant warehouses', baseChance: 0.65, desc: 'Warehouse facilities for merchants storing goods awaiting sale, transit, or seasonal distribution. Essential infrastructure for any trade route settlement.', tags: ['trade', 'trade'] },
        city: { required: true },
        metropolis: { required: true },
      },
    },
    {
      shared: { front: 'prime', name: 'Public bathhouse', face: 'the bath-keeper', desc: 'Communal bathing facility with heated water. In some cultures a social hub; in others suspect as a venue for vice. Either way, the best place in the district to hear rumour and news.', tags: ['trade', 'sanitation'], priorityCategory: 'government' },
      at: {
        town: { baseChance: 0.3, desc: 'Communal bathing facility with heated water. In some cultures a social hub; in others suspect as a venue for vice. Either way, the best place in the town to hear rumour and news.' },
        city: { baseChance: 0.5 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { name: 'Slave market', face: 'the slaver', desc: 'Established auction block with holding facilities, registered brokers, and provenance documentation. Legally sanctioned commerce in persons: taxed, regulated, and embedded in the city economy.', tags: ['trade', 'trade'], priorityCategory: 'economy' },
      at: {
        town: { baseChance: 0.1, desc: 'Public auction of enslaved persons: war captives, debtors, convicted criminals, and trafficked individuals. Where slavery is legally sanctioned, this is civic commercial infrastructure.' },
        city: { baseChance: 0.3 },
        metropolis: { baseChance: 0.3 },
      },
    },
    {
      shared: { name: 'Slave market district', face: 'the slave-market master', baseChance: 0.25, desc: 'A permanent, licensed district for commerce in persons: auction halls, holding compounds, broker offices, and associated legal and financial infrastructure. Operates at a scale beyond a single market block.', tags: ['trade', 'trade'], priorityCategory: 'economy' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Auction house', face: 'the auctioneer', desc: "Formal venue for selling high-value goods: estates, ships, livestock, art, and occasionally persons. Charges buyer's and seller's premiums.", tags: ['market'], priorityCategory: 'economy' },
      at: {
        town: { baseChance: 0.1 },
        city: { baseChance: 0.35 },
        metropolis: { baseChance: 0.4 },
      },
    },
    {
      shared: { name: 'Assay office', face: 'the assayer', desc: 'Tests the purity of precious metals brought to market. Essential infrastructure for banking and minting. Charges fees per assay.', tags: ['banking'], priorityCategory: 'government' },
      at: {
        town: { baseChance: 0.2, desc: 'Tests the purity of precious metals brought to the town. Essential infrastructure for banking and minting. Charges fees per assay.' },
        city: { baseChance: 0.3 },
        metropolis: { baseChance: 0.3 },
      },
    },
    // The town Mint was filed on Crafts and the city's Mint (official) on Economy until 2026-09-30.
    {
      shared: { name: 'Mint (official)', face: 'the mint master', desc: 'State or noble-chartered coin production. Standardises currency across the region. Significant ongoing revenue via seigniorage.', tags: ['banking'], priorityCategory: 'economy' },
      at: {
        town: { name: 'Mint', baseChance: 0.15, desc: 'Converts refined precious metal into standardised coinage. Requires noble or royal charter. Significant revenue for the granting authority.', priorityCategory: 'government' },
        city: { baseChance: 0.4 },
        metropolis: { baseChance: 0.4 },
      },
    },
    // [W-I INFORMATION BROKERAGES] I1, the legal MINOR form (design §3). A brokerage is HOW TALK IS
    // WEIGHED, never where it happens: the rumour-source houses (inns, bathhouses, fences) keep their
    // own role and are tagged separately in data/informationBrokerageTuning.js. `serviceKeys` is the
    // closed capability vocabulary every effect reads (never the name) so custom brokerage-class
    // content declaring the same keys behaves identically. Route-gated because information follows
    // roads. The city keeps BOTH legal forms on purpose: the subsumption pass collapses the minor
    // house into the guild form when both land.
    {
      shared: { name: 'Listening post', face: 'the watcher', forbiddenTradeRoutes: ['isolated', 'none'], desc: 'A licensed house that pays for road news and keeps the register: who arrived, from where, and what they carried word of. Cheap to run and openly taxed, and found wherever the roads bring traffic.', tags: ['legal', 'information', 'brokerage'], priorityCategory: 'economy', serviceKeys: ['info_calibration', 'info_query'] },
      at: {
        town: { baseChance: 0.22 },
        city: { baseChance: 0.28 },
        metropolis: { baseChance: 0.28 },
      },
    },
    {
      shared: { name: "Chroniclers' exchange", face: 'the chronicler', baseChance: 0.3, forbiddenTradeRoutes: ['isolated', 'none'], desc: 'A guild house for news: paid correspondents on several roads, an archive that cross-checks one road against another, and a standing rate for a written answer. Expensive to keep, and the only counter in the city where a claim is graded before it is sold.', tags: ['legal', 'information', 'brokerage'], priorityCategory: 'economy', serviceKeys: ['info_calibration', 'info_query', 'info_feed'] },
      at: {
        city: {},
        metropolis: {},
      },
    },
  ]),

  // ══════════════════════ CRAFTS ══════════════════════
  ...shelf('Crafts', [
    // One identity name ('Mills (2-5)') from town up; the display seam drops the count so a city never
    // reads 'Mills (2-5)'.
    {
      shared: { front: 'prime', name: 'Mills (2-5)', face: 'the miller', required: true, desc: 'Grain, fulling, and saw mills along every usable watercourse, many under guild or civic licence.', tags: ['essential'], priorityCategory: 'economy' },
      at: {
        thorp: { name: 'Access to external mill', fabric: true, desc: 'Must travel to manor/village mill. Home grinding often illegal.', tags: ['essential', 'agriculture'] },
        hamlet: { name: 'Access to external mill', fabric: true, desc: 'Manor mill with milling monopoly (banalité).', tags: ['essential', 'agriculture'] },
        village: { name: 'Mill', desc: 'Water or windmill with monopoly milling rights. The miller is often the wealthiest and most resented figure in the village.', tags: ['essential', 'food'], priorityCategory: 'crafts' },
        town: { desc: 'Multiple mills for grain, fulling cloth.' },
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Maltster', face: 'the maltster', baseChance: 0.15, desc: 'Converts barley into malt for brewing. Small operation supplying local alehouses. Requires grain surplus.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        hamlet: {},
        village: {},
      },
      ceiling: { tier: 'village', reason: 'Malting moves inside the brewery at town scale.' },
      successor: 'Brewery',
    },
    {
      shared: { front: 'front', name: 'Blacksmiths (3-10)', face: 'the master smith', desc: 'Farriers, toolsmiths, and general forges in every quarter.', tags: ['metalwork'], priorityCategory: 'crafts' },
      at: {
        hamlet: { face: 'the smith', name: 'Resident smith (part-time)', baseChance: 0.4, desc: 'Repairs tools, shoes horses. Farms also.' },
        village: { face: 'the smith', name: 'Blacksmith', baseChance: 0.9, desc: 'Full-time metalworker. Essential for tools and horseshoes.' },
        town: { baseChance: 0.95, desc: 'Multiple smiths with specializations.' },
        city: { baseChance: 0.9 },
        metropolis: { baseChance: 0.9 },
      },
    },
    {
      shared: { front: 'front', name: 'Specialized metalworkers', face: 'the master metalworker', baseChance: 0.9, desc: 'Armorers, swordsmiths, jewelers. Separate guilds.', tags: ['metalwork', 'luxury'], priorityCategory: 'crafts' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Jeweller', face: 'the jeweller' },
      at: {
        town: { baseChance: 0.3, desc: 'Works precious metals and gemstones into rings, necklaces, seals, and luxury items. Accepts commissions, appraises stones, and occasionally buys stolen goods from discreet customers.', tags: ['luxury', 'trade'], priorityCategory: 'government' },
      },
      ceiling: { tier: 'town', reason: "At city scale jewellers sit inside the specialized metalworkers' guilds (their row names them)." },
      successor: 'Specialized metalworkers',
    },
    {
      shared: { front: 'prime', name: 'Luxury goods quarter', face: 'the luxury merchant', baseChance: 0.8, desc: 'Silks, spices, precious goods.', tags: ['luxury', 'trade'], priorityCategory: 'crafts' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { front: 'front', name: 'Carpenters (5-15)', face: 'the master carpenter', desc: 'Construction carpenters, joiners, and furniture makers, organised by guild.', tags: [], priorityCategory: 'crafts' },
      at: {
        hamlet: { face: 'the carpenter', name: 'Carpenter (part-time)', baseChance: 0.5, desc: 'Builds/repairs buildings and tools.' },
        village: { face: 'the carpenter', name: 'Carpenter', baseChance: 0.7, desc: 'Builds houses, carts, furniture.' },
        town: { baseChance: 0.9, desc: 'Construction and furniture makers.' },
        city: { baseChance: 0.9 },
        metropolis: { baseChance: 0.9 },
      },
    },
    {
      shared: { name: 'Thatcher', face: 'the thatcher' },
      at: {
        village: { baseChance: 0.6, desc: 'Roof repair and construction.', tags: [], priorityCategory: 'crafts' },
      },
      ceiling: { tier: 'village', reason: 'Towns roof in tile and slate, and many forbid thatch for fear of fire.' },
    },
    {
      shared: { front: 'front', name: 'Cooper', face: 'the cooper', desc: 'Makes barrels for storage and transport.', tags: [], priorityCategory: 'crafts' },
      at: {
        village: { baseChance: 0.3 },
        town: { baseChance: 0.5 },
        city: { baseChance: 0.55 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { name: 'Apothecary district', face: 'the apothecary', desc: 'Multiple apothecary shops clustered together. Competition drives specialization. Some focus on chirurgery, others on herbal preparations, others on imported medicines. Herbalism kits, medicinal herbs, surgical supplies, and basic antidotes all available.', tags: ['healing', 'trade'], priorityCategory: 'crafts' },
      at: {
        village: { name: 'Apothecary', baseChance: 0.45, desc: 'Sells herbal medicines, poultices, and common remedies. Distinct from the alchemist. No magical compounds, no acid flasks. Knows which roots treat fever and which mushrooms kill. Stocked with herbalism supplies.' },
        town: { name: 'Apothecary (established)', baseChance: 0.8, desc: 'A proper shop with a trained herbalist, stocked inventory, and a back room for consultations. Sells herbalism kit supplies, common antidotes, medicinal herbs, and basic surgical dressings. Some double as chirurgeons.' },
        city: { baseChance: 0.7, priorityCategory: 'economy' },
        metropolis: { baseChance: 0.75, priorityCategory: 'economy' },
      },
    },
    {
      shared: { name: 'Bowyers & fletchers (guild)', face: 'the bowyer', desc: 'Guild bowyers and fletchers: standard arrows by the sheaf, specialty broadheads, composite bows to commission. Supplies the watch, the garrison, and the caravans.', tags: ['military', 'trade'], priorityCategory: 'crafts' },
      at: {
        village: { name: 'Bowyer & fletcher', baseChance: 0.6, desc: 'Makes bows, crossbows, and arrows. Sells finished ammunition and takes custom bow commissions. The first stop for any adventurer whose quiver is empty.' },
        town: { baseChance: 0.75, desc: 'Multiple craftsmen organized under a guild. Standard arrows by the sheaf, specialty broadheads, composite bows to commission. Restocks merchant caravans and outfits town militias.' },
        city: { baseChance: 0.6 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { front: 'front', name: 'Sawmill (commercial)', face: 'the sawyer', desc: 'A water- or ox-powered mill producing planks and beams for the construction trade. Employs a permanent crew.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        village: { name: 'Sawmill', baseChance: 0.35, desc: 'Water- or ox-powered saw. Converts raw logs to planks and beams. Expands construction and furniture output.' },
        town: { baseChance: 0.28, desc: "A water- or ox-powered mill producing planks and beams for the construction trade. A town near timber can supply an entire region's building needs. Employs a permanent crew." },
        city: { baseChance: 0.3 },
        metropolis: { baseChance: 0.3 },
      },
    },
    {
      shared: { front: 'prime', name: 'Brewery', face: 'the brewer', desc: 'Commercial-scale ale and beer production supplying taverns and regional distribution. Major grain consumer and employer.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        village: { name: 'Brewer', baseChance: 0.45, desc: 'Converts malted grain to ale in quantity. The largest consumer of grain after bread. Supplies alehouses and households.' },
        town: { baseChance: 0.45, desc: "Commercial-scale ale and beer production. Supplies the town's taverns and regional distribution. Major grain consumer and employer." },
        city: { baseChance: 0.55 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { front: 'prime', name: 'Vintner', face: 'the vintner', desc: 'Produces and ages wine, either from local grapes or imported must. Sells in bulk to taverns and directly to wealthy clients. A vintner in a non-wine region is an importer-blender.', tags: ['food', 'trade'], priorityCategory: 'government' },
      at: {
        town: { baseChance: 0.2 },
        city: { baseChance: 0.3 },
        metropolis: { baseChance: 0.35 },
      },
    },
    {
      shared: { front: 'front', name: 'Tanners', face: 'the tanner', desc: 'Leather production. Foul-smelling; sited by water and toward the settlement edge where the ground allows.', tags: ['leather'], priorityCategory: 'crafts' },
      at: {
        village: { name: 'Tannery', baseChance: 0.3, desc: 'Converts hides into leather using oak bark. Foul-smelling. Placed downstream. Essential for shoes, harness, and straps.', tags: ['trade'] },
        town: { baseChance: 0.7, exclusiveGroup: 'tanneryScale' },
        city: { baseChance: 0.4, exclusiveGroup: 'tanneryScale' },
        metropolis: { baseChance: 0.4, exclusiveGroup: 'tanneryScale' },
      },
    },
    {
      shared: { front: 'front', name: 'Tanner (established)', face: 'the master tanner', exclusiveGroup: 'tanneryScale', desc: 'Full-scale tannery with multiple vats and a guild-trained workforce. Produces high-quality leather for shoes, armour, and saddlery.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        town: { baseChance: 0.55 },
        city: { baseChance: 0.7 },
        metropolis: { baseChance: 0.75 },
      },
    },
    {
      shared: { name: 'Fuller', face: 'the fuller', desc: 'Finishes woven cloth by cleaning and thickening it. Often water-powered. Transforms raw weave into durable textile.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        village: { baseChance: 0.2 },
        town: { baseChance: 0.3 },
        city: { baseChance: 0.35 },
        metropolis: { baseChance: 0.35 },
      },
    },
    {
      shared: { front: 'front', name: 'Dyer', face: 'the dyer', desc: 'Applies colour to raw or woven cloth. Essential for producing anything beyond undyed grey wool.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        village: { baseChance: 0.2 },
        town: { baseChance: 0.35 },
        city: { baseChance: 0.45 },
        metropolis: { baseChance: 0.5 },
      },
    },
    {
      shared: { front: 'front', name: 'Weavers/Textile workers', face: 'the master weaver', desc: 'Cloth production. Often guild-organized.', tags: ['textile'], priorityCategory: 'crafts' },
      at: {
        town: { baseChance: 0.8 },
        city: { baseChance: 0.85 },
        metropolis: { baseChance: 0.85 },
      },
    },
    {
      shared: { front: 'front', name: 'Potter', face: 'the potter', desc: 'Wheel-thrown pottery for domestic use. Plates, jugs, storage vessels. Fired in a small kiln.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        village: { baseChance: 0.35 },
        town: { baseChance: 0.5 },
        city: { baseChance: 0.55 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { front: 'front', name: 'Brickmaker', face: 'the brickmaker', desc: 'Moulds and fires clay bricks for construction. Enables more permanent buildings. Requires clay deposits and fuel.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        village: { baseChance: 0.25 },
        town: { baseChance: 0.4 },
        city: { baseChance: 0.45 },
        metropolis: { baseChance: 0.45 },
      },
    },
    {
      shared: { front: 'front', name: "Cobbler's guild", face: 'the cobbler', desc: 'Organised shoemakers producing boots, shoes, and sandals for the urban population. Strictly regulated quality.', tags: ['guild', 'trade'], priorityCategory: 'crafts' },
      at: {
        village: { name: 'Cobbler', baseChance: 0.45, desc: 'Makes and repairs shoes and boots. Every person needs footwear. One of the most reliable and consistent trades.', tags: ['trade'] },
        town: { baseChance: 0.5 },
        city: { baseChance: 0.55 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { front: 'front', name: "Tailor's guild", face: 'the tailor', desc: 'Master clothiers producing garments from finished cloth. Produces everything from working clothes to livery.', tags: ['guild', 'trade'], priorityCategory: 'crafts' },
      at: {
        village: { name: 'Tailor', baseChance: 0.35, desc: 'Cuts and sews finished cloth into garments. Serves the middling sort between home seamstress and master clothier.', tags: ['trade'] },
        town: { baseChance: 0.55 },
        city: { baseChance: 0.6 },
        metropolis: { baseChance: 0.65 },
      },
    },
    {
      shared: { front: 'front', name: 'Butchers (3-8)', face: 'the master butcher', desc: 'Shambles and meat markets under strict civic regulation.', tags: ['food'], priorityCategory: 'crafts' },
      at: {
        town: { baseChance: 0.85, desc: 'Meat processing. Strictly regulated.' },
        city: { baseChance: 0.9 },
        metropolis: { baseChance: 0.9 },
      },
    },
    {
      shared: { front: 'front', name: 'Bakers (5-15)', face: 'the master baker', desc: 'Bakehouses in every ward. Guild-regulated weights and prices.', tags: ['food'], priorityCategory: 'crafts' },
      at: {
        town: { baseChance: 0.9, desc: 'Bread production. Guild-regulated prices.' },
        city: { baseChance: 0.95 },
        metropolis: { baseChance: 0.95 },
      },
    },
    {
      shared: { front: 'front', name: 'Smelter', face: 'the smelt master', baseChance: 0.35, desc: 'Converts raw ore to refined metal using charcoal-fueled furnaces. The industrial intermediate between mine and smithy.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        town: {},
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { front: 'front', name: 'Chandler', face: 'the chandler', desc: 'Makes candles from tallow and beeswax. Also produces soap and rope from similar raw materials. Essential for lighting.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        town: { baseChance: 0.3 },
        city: { baseChance: 0.45 },
        metropolis: { baseChance: 0.5 },
      },
    },
    {
      shared: { front: 'front', name: 'Glassmakers', face: 'the glassmaker', desc: 'Windows, vessels, mirrors. Requires expertise.', tags: ['luxury'], priorityCategory: 'crafts' },
      at: {
        town: { name: 'Glassblower', baseChance: 0.25, desc: 'Small-scale glasswork: bottles, window panes, goblets. Requires silica sand, potash, and a skilled furnace operator.', tags: ['trade'] },
        city: { baseChance: 0.5 },
        metropolis: { baseChance: 0.55 },
      },
    },
    {
      shared: { front: 'front', name: 'Ropemaker', face: 'the ropemaker', desc: 'Twists fibres (hemp, flax, or plant matter) into rope and cordage. Essential for ships, construction, and agriculture.', tags: ['trade'], priorityCategory: 'crafts' },
      at: {
        town: { baseChance: 0.3 },
        city: { baseChance: 0.45 },
        metropolis: { baseChance: 0.5 },
      },
    },
    {
      shared: { name: 'Midwife', face: 'the midwife', desc: 'Assists with births, manages difficult labours, and provides basic gynecological care. The most-used medical service in any settlement.', tags: ['healing'], priorityCategory: 'crafts' },
      at: {
        village: { baseChance: 0.5 },
        town: { baseChance: 0.5 },
        city: { baseChance: 0.55 },
        metropolis: { baseChance: 0.55 },
      },
    },
    {
      shared: { name: 'Woodcarver', face: 'the woodcarver', desc: 'Carves functional and decorative items from wood: tool handles, religious figures, furniture inlays. Produces sacred images and reliquaries for the church.', tags: ['trade', 'religious'], priorityCategory: 'crafts' },
      at: {
        village: { baseChance: 0.25 },
        town: { baseChance: 0.3 },
        city: { baseChance: 0.35 },
        metropolis: { baseChance: 0.35 },
      },
    },
    {
      shared: { name: 'Village scribe', face: 'the scribe' },
      at: {
        village: { baseChance: 0.15, desc: "Can read and write. Copies letters, draws up simple contracts, reads documents for the illiterate. Often the priest's assistant or a monastery-educated lay person.", tags: [], priorityCategory: 'government' },
      },
      ceiling: { tier: 'village', reason: "Town record-keeping sits with guild clerks and the crier; the printing house is the city's writing trade." },
    },
    {
      shared: { name: 'Printing house', face: 'the printer', desc: 'Books and broadsheets.', thresholdNote: 'If technology exists.', tags: ['education'], priorityCategory: 'crafts' },
      at: {
        town: { baseChance: 0.1 },
        city: { baseChance: 0.3 },
        metropolis: { baseChance: 0.35 },
      },
    },
    // Filed on Crafts at village and Economy at town and city until 2026-09-30; one family, one shelf.
    {
      shared: { name: "Cartographer's workshop", face: 'the cartographer', desc: "A guild of professional cartographers producing regional maps, sea charts, property surveys, and military reconnaissance maps. Sells off-the-shelf maps and takes commissions. The city's maps are the most accurate in the region.", tags: ['education', 'trade'], priorityCategory: 'crafts' },
      at: {
        // `rare` (the chair's ruling, 2026-11-04, rung-1 pins unit 6): the row's own text calls it rare.
        village: { baseChance: 0.15, rare: true, desc: "A craftsman who draws and sells maps: regional road maps, property surveys, and rough wilderness sketches from traveler accounts. Rare enough that most villages don't have one." },
        town: { baseChance: 0.4, desc: 'Sells road maps, regional surveys, and coastal charts. Takes commissions for estate surveys and dungeon sketching. Maintains a reference collection of older maps for consultation. Standard stop for adventurers, merchants, and military scouts.' },
        city: { name: "Cartographer's guild", baseChance: 0.65, priorityCategory: 'economy' },
        metropolis: { name: "Cartographer's guild", baseChance: 0.65, priorityCategory: 'economy' },
      },
    },
    // Filed on Economy at town and city and Crafts at metropolis until 2026-09-30.
    {
      shared: { front: 'front', face: 'the senior craft-guild master', required: true, tags: ['guild'], priorityCategory: 'crafts' },
      at: {
        town: { name: 'Craft guilds (5-15)', desc: 'Regulate quality, prices, and apprenticeships.' },
        city: { name: 'Craft guilds (30-80)', desc: 'Extreme specialization (gold-beaters, mirror-makers).' },
        metropolis: { name: 'Craft guilds (100-150+)', desc: 'Over a hundred distinct craft specializations. A guild for every conceivable trade.' },
      },
    },
    // ALCHEMY IS A TRADE (TE-CH-5 / ODQ §541): licensed `none`, tagged `alchemy` (TRADE_INST_TAGS),
    // and filed on Crafts from 2026-09-30 so the display shelf agrees with the licence.
    {
      shared: { name: 'Alchemist quarter', face: 'the alchemist', forbiddenTradeRoutes: ['isolated'], desc: 'Multiple alchemical workshops. Guild organization.', tags: ['alchemy'], magicLicense: 'none', priorityCategory: 'magic' },
      at: {
        town: { name: 'Alchemist shop', baseChance: 0.4, desc: 'Potions and alchemical wares. A basic healing draught costs about what a labourer earns in a week.' },
        city: { baseChance: 0.5 },
        metropolis: { baseChance: 0.5 },
      },
    },
  ]),

  // ══════════════════════ RELIGIOUS ══════════════════════
  ...shelf('Religious', [
    // A shrine is a complement to the parish, not its lesser form: it left the religiousCenter group
    // (where the required parish row blocked it at hamlet, 0 of 200) on 2026-09-30.
    {
      shared: { name: 'Wayside shrine', face: null, tags: ['religious'], priorityCategory: 'religion' },
      at: {
        thorp: { baseChance: 0.3, desc: 'Simple prayer marker. No resident clergy.' },
        hamlet: { baseChance: 0.5, desc: 'Simple prayer location. No clergy.' },
        village: { baseChance: 0.3, desc: 'A roadside prayer marker at the parish edge. No clergy of its own.' },
      },
      ceiling: { tier: 'village', reason: 'Inside a town every street is in reach of a parish church.' },
    },
    {
      shared: { name: 'Access to parish church', face: 'the dean', tags: ['essential', 'religious', 'church'], priorityCategory: 'religion' },
      at: {
        thorp: { baseChance: 0.78, fabric: true, desc: 'A walk of a few miles to the village house of worship for services.' },
        hamlet: { required: true, fabric: true, desc: 'Services mean the walk to the village house of worship, usually a few miles off.' },
        village: { face: 'the priest', name: 'Parish church', required: true, exclusiveGroup: 'religiousCenter', desc: 'Center of village life. Stone construction. Mandatory tithes.' },
        town: { name: 'Parish churches (2-5)', required: true, desc: 'Several houses of worship within town.' },
        city: { name: 'Parish churches (10-30)', required: true, desc: 'One per neighborhood.' },
        metropolis: { name: 'Parish churches (50-100+)', required: true, desc: 'Hundreds of houses of worship across all districts. The faith is woven into every neighbourhood.', tags: ['religious', 'church'], priorityCategory: 'infrastructure' },
      },
    },
    {
      shared: { name: 'Burial ground', face: null, required: true, tags: ['essential', 'religious'], priorityCategory: 'religion' },
      at: {
        thorp: { desc: 'A corner of the holding left out of the plough, banked with turf and marked with fieldstones. No clergy lives near enough to speak over anyone, so the words are said by whoever knew the dead best. The oldest markers have lost their names to the weather and are kept clear anyway.' },
        hamlet: { desc: 'A walled plot at the edge of the settlement, gated against livestock and kept by the households in turn. The rite is held when a priest comes through, and the burial itself does not wait for one. Families lie in rows by household, whatever their standing. That is the custom here, and has nothing to do with being poor.' },
        village: { name: 'Graveyard', desc: 'Consecrated ground beside the house of worship, on its own plot, with a resident priest to close it. The rite is held on the day of the death, with no wait for a travelling clergyman, and the congregation has begun keeping the names in the same book as the births. The ground nearest the wall is spoken for generations ahead, and everyone here can say who holds it.' },
        town: { name: 'Parish burial grounds', desc: "Each congregation keeps its own ground beside its house of worship, and one that has filled its ground buries beyond the gate instead. The sexton holds the register of who lies where, which is the town's longest unbroken record and the one it reaches for in an inheritance dispute. Guilds buy plots together so their members lie among their trade." },
        city: { name: 'Burial grounds and charnel house', desc: "The old grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next. New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening. Who is lifted and who is left where they lie is settled by what a family endowed." },
        metropolis: { name: 'Cemetery network', desc: 'Burial has left the walls entirely: grounds beyond every gate, each with its own road, its own gatekeepers, and a trade in plots that the revenue office watches. The local registers are copied into a central roll because no single ground can any longer say where its own dead are. Wards are assigned to grounds, so a family that moves across the city can find itself divided by the assignment.', priorityCategory: 'infrastructure' },
      },
    },
    {
      shared: { name: 'Priest (resident)', face: 'the priest' },
      at: {
        village: { required: true, desc: 'Performs sacraments, collects tithes. Often only literate person.', tags: ['essential', 'religious'], priorityCategory: 'religion' },
      },
      ceiling: { tier: 'village', reason: "At town scale the clergy are held inside the parish churches' row." },
    },
    {
      shared: { face: 'the abbot', exclusiveGroup: 'religiousCenter', tags: ['religious', 'monastery'], priorityCategory: 'religion' },
      at: {
        town: { name: 'Monastery or friary', baseChance: 0.4, desc: 'Religious community. May operate hospital/school.' },
        city: { face: 'the senior abbot', name: 'Multiple monasteries', baseChance: 0.6, exclusiveGroupCoexists: true, desc: 'Different religious orders.' },
        metropolis: { face: 'the senior abbot', name: 'Major monasteries (5-10)', baseChance: 0.6, exclusiveGroupCoexists: true, desc: 'Five to ten major monastic houses: scholarly, contemplative, and charitable functions at scale.', priorityCategory: 'infrastructure' },
      },
    },
    {
      shared: { face: 'the bishop', exclusiveGroup: 'religiousCenter', exclusiveGroupCoexists: true, tags: ['religious', 'church'] },
      at: {
        city: { name: 'Cathedral (10,000+ only)', baseChance: 0.3, minPopulation: 10000, desc: "Bishop's seat. Defines major city status.", thresholdNote: 'Requires 10,000+ population minimum.', priorityCategory: 'religion' },
        metropolis: { name: 'Great cathedral', baseChance: 0.6, desc: 'Metropolitan cathedral. Seat of the highest regional religious authority. Pilgrimage destination.', priorityCategory: 'infrastructure' },
      },
    },
    {
      shared: { face: 'the hospitaller', tags: ['religious', 'healing'], priorityCategory: 'religion' },
      at: {
        town: { name: 'Small hospital', baseChance: 0.3, desc: 'Care for sick poor. Usually religious-run.' },
        city: { face: 'the hospital\'s master', name: 'Major hospital', baseChance: 0.5, desc: 'Large facility for sick poor. 50-100 beds.' },
        metropolis: { face: 'the hospital\'s master', name: 'Hospital network', baseChance: 0.6, desc: 'Multiple hospitals and infirmaries across districts. Organized medical care at population scale.', tags: ['healing', 'religious'], priorityCategory: 'infrastructure' },
      },
    },
    {
      shared: { name: 'Almshouse', face: 'the almoner', desc: 'Charitable house for the destitute poor, aged, and disabled who cannot work. Funded by church endowment and wealthy donors. Residents receive food and shelter; in return they pray for their benefactors.', tags: ['religious', 'healing'], priorityCategory: 'religion' },
      at: {
        town: { baseChance: 0.3 },
        city: { baseChance: 0.35 },
        metropolis: { baseChance: 0.35 },
      },
    },
    {
      shared: { name: 'Foundling home', face: 'the foundling-mother', desc: 'Receives abandoned infants and young children, providing basic care until they can be apprenticed, placed with families, or raised within the institution. Usually church-run. The wheel in the wall allows anonymous deposit at night.', tags: ['religious', 'healing'], priorityCategory: 'religion' },
      at: {
        town: { baseChance: 0.1 },
        city: { baseChance: 0.2 },
        metropolis: { baseChance: 0.25 },
      },
    },
    // FAITH IS NOT MAGIC (TE-CH-6): licensed `none`, tagged `religious`; filed on Magic until
    // 2026-09-30.
    {
      shared: { name: 'Druid Circle', face: 'the archdruid' },
      at: {
        village: { baseChance: 0.2, desc: 'A circle of druids tied to the land. They regulate the seasons, mediate disputes with wild creatures, and know which streams run clean. More common in forested or isolated settlements, but they adapt. Some circles tend city gardens or hidden urban groves.', tags: ['religious'], magicLicense: 'none', priorityCategory: 'magic' },
      },
      ceiling: { tier: 'village', reason: 'In towns and cities the druids speak through the Elder Grove Council.' },
    },
    // Its own text says it is found in cities; it was listed at town only, and on the Magic shelf,
    // until 2026-09-30.
    {
      shared: { name: 'Elder Grove Council', face: 'the grove elder', desc: "A council of senior druids who govern their circle's relationship with the city. They may maintain a hidden grove beneath the streets, mediate between urban expansion and wild places, or serve as ecological advisors to the ruling authority. Found in cities that have made their peace with the wild.", tags: ['religious'], magicLicense: 'none', priorityCategory: 'military' },
      at: {
        town: { baseChance: 0.15 },
        city: { baseChance: 0.2 },
        metropolis: { baseChance: 0.15 },
      },
    },
  ]),

  // ══════════════════════ GOVERNMENT ══════════════════════
  ...shelf('Government', [
    {
      shared: { name: 'Informal elder consensus', face: 'the eldest', exclusiveGroup: 'government', tags: ['civic'], priorityCategory: 'government' },
      at: {
        thorp: { baseChance: 0.5, desc: 'The eldest or most respected farmer guides communal decisions by consensus.' },
        hamlet: { baseChance: 0.85, desc: "A free hamlet with no lord's representative. Communal elder consensus governs shared affairs." },
        village: { baseChance: 0.4, desc: 'The village elders decide shared affairs together. No reeve, no steward: the old families settle it among themselves.' },
      },
      ceiling: { tier: 'village', reason: 'A town governs through a council or an appointee.' },
    },
    {
      shared: { name: 'Head-of-household consensus', face: 'the eldest householder' },
      at: {
        thorp: { baseChance: 0.82, exclusiveGroup: 'government', desc: 'All family heads hold equal voice on shared concerns. Slower but more egalitarian.', tags: ['civic'], priorityCategory: 'government' },
      },
      ceiling: { tier: 'thorp', reason: 'Only a handful of households can all sit at one table.' },
    },
    {
      shared: { name: "Lord's reeve", face: 'the reeve' },
      at: {
        thorp: { baseChance: 0.3, exclusiveGroup: 'government', desc: 'A steward appointed by a distant lord to oversee the settlement. Authority is formal but often resented.', tags: ['civic', 'legal'], priorityCategory: 'government' },
      },
      ceiling: { tier: 'thorp', reason: "Larger holdings get a lord's steward." },
      successor: "Lord's steward",
    },
    {
      shared: { name: 'Household elder', face: 'the household elder' },
      at: {
        thorp: { baseChance: 0.9, exclusiveGroup: 'government', desc: 'One household head acts as de facto voice for the settlement. No formal appointment, no title. Just the person everyone goes to when something needs deciding.', tags: ['civic'], priorityCategory: 'government' },
      },
      ceiling: { tier: 'thorp', reason: 'A single household head speaks for a thorp; larger places need a headman or elders.' },
    },
    {
      shared: { name: "Lord's steward", face: 'the steward', exclusiveGroup: 'government', desc: 'A royal or ducal appointee governs; the city operates as a noble fief.', tags: ['civic'], priorityCategory: 'military' },
      at: {
        hamlet: { baseChance: 0.55, desc: "A lord's agent manages the hamlet's lands, collects rents, and enforces noble authority." },
        village: { baseChance: 0.3, desc: "A lord's steward collects rents and enforces manor authority over a bound village." },
        town: { face: 'the lord\'s appointee', name: "Lord's appointee", baseChance: 0.45, desc: "A lord's appointed official governs; noble authority supersedes local custom." },
        city: { face: 'the governor', name: 'Noble governor', baseChance: 0.55 },
        metropolis: { face: 'the governor', name: 'Noble governor', baseChance: 0.55 },
      },
    },
    {
      shared: { name: 'Village headman', face: 'the headman', exclusiveGroup: 'government', desc: 'A single respected figure acts as de facto authority. Not elected, not appointed, simply acknowledged. Decisions are practical, made without ceremony.', tags: ['civic'], priorityCategory: 'government' },
      at: {
        hamlet: { baseChance: 0.9 },
        village: { baseChance: 0.5 },
      },
      ceiling: { tier: 'village', reason: 'A town governs through a council or an appointee.' },
    },
    {
      shared: { name: 'City administration', face: 'the chief administrator', exclusiveGroup: 'government', desc: 'An administrative apparatus of officials, clerks, and ward officers manages city affairs. Less formally constituted than a council but functional. Governance by bureaucratic inertia.', tags: ['civic'], priorityCategory: 'government' },
      at: {
        village: { face: 'the reeve', name: 'Village reeve', baseChance: 0.92, desc: 'Elected from the peasantry. Organises labour obligations, mediates disputes, and represents the village to outside authority.' },
        town: { face: 'the first councillor', name: 'Town council', baseChance: 0.9, desc: 'An informal council of prominent citizens manages town affairs in the absence of formal authority. Less accountable than an elected council, more stable than nothing.' },
        city: { baseChance: 0.92 },
        metropolis: { baseChance: 0.92 },
      },
    },
    {
      shared: { name: 'Village elder', face: 'the village elder' },
      at: {
        village: { baseChance: 0.95, exclusiveGroup: 'government', desc: 'The oldest or most respected resident guides village decisions in the absence of formal authority. Less official than a reeve, more stable than nothing.', tags: ['civic'], priorityCategory: 'government' },
      },
      ceiling: { tier: 'village', reason: 'A town governs through a council or an appointee.' },
    },
    {
      shared: { name: 'Mayor and council', face: 'the mayor', baseChance: 0.5, exclusiveGroup: 'government', desc: 'Elected civic council with full administrative apparatus.', tags: ['civic'], priorityCategory: 'government' },
      at: {
        town: { desc: 'Elected or appointed town leadership.' },
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Guild consortium', face: 'the consortium speaker', exclusiveGroup: 'government', desc: 'A consortium of guild masters holds effective civic power.', tags: ['civic', 'guild'], priorityCategory: 'economy' },
      at: {
        town: { name: 'Guild governance', baseChance: 0.8, desc: 'Guilds control town politics. The guildmasters sit on the council.' },
        city: { baseChance: 0.6 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { name: 'Merchant oligarchy', face: 'the first magnate', exclusiveGroup: 'government', desc: 'Wealthy merchant families hold exclusive civic power; political office is effectively purchased.', tags: ['civic', 'trade'], priorityCategory: 'economy' },
      at: {
        town: { baseChance: 0.25 },
        city: { baseChance: 0.5 },
        metropolis: { baseChance: 0.5 },
      },
    },
    {
      shared: { name: 'City-state government', face: 'the doge', baseChance: 0.25, exclusiveGroup: 'government', desc: 'The settlement governs itself and its surrounding territory as an independent polity. No higher lord, no external charter.', tags: ['civic'], priorityCategory: 'government' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Democratic assembly', face: 'the speaker of the assembly', baseChance: 0.2, exclusiveGroup: 'government', desc: 'A citizen assembly holds formal authority; eligible voters debate and vote on major ordinances and appointments.', tags: ['civic'], priorityCategory: 'government' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Royal seat', face: 'the monarch', baseChance: 0.2, exclusiveGroup: 'government', desc: 'A royal governor or viceroy administers directly on behalf of the crown. High status, high scrutiny.', tags: ['civic'], priorityCategory: 'military' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    // Filed on Crafts until 2026-09-30; a civic office, not a craft.
    {
      shared: { name: 'Town crier', face: 'the crier', desc: 'Official announcer who reads proclamations, market prices, and news at fixed times in the market squares. Employed by the city or a guild.', tags: [], priorityCategory: 'government' },
      at: {
        town: { baseChance: 0.45, desc: 'Official announcer who reads proclamations, market prices, and news at fixed times in the market square. Employed by the town or a guild.' },
        city: { baseChance: 0.4 },
        metropolis: { baseChance: 0.4 },
      },
    },
  ]),

  // ══════════════════════ INFRASTRUCTURE ══════════════════════
  ...shelf('Infrastructure', [
    // Every metropolis read the city's housing row (inherited from city) until 2026-09-30.
    {
      shared: { face: null, required: true, fabric: true, tags: ['essential', 'housing'], priorityCategory: 'infrastructure' },
      at: {
        thorp: { name: 'Dwellings (1-8)', desc: 'Wattle-and-daub or timber. 1-2 rooms per household.' },
        hamlet: { name: 'Dwellings (5-25)', desc: 'Timber-frame with thatched roofs.' },
        village: { name: 'Dwellings (15-100)', desc: 'Timber construction with stone foundations.' },
        town: { name: 'Housing (75-650 households)', desc: 'Multi-story timber and stone buildings.' },
        city: { name: 'Housing (500-4000 households)', desc: 'Multi-story buildings. Tenements for poor.' },
        metropolis: { name: 'Housing (3500+ households)', desc: 'Dense multi-story blocks, tenement courts, and suburbs spilling past the walls.' },
      },
    },
    {
      shared: { name: 'Water source', face: null, required: true, exclusiveGroup: 'waterSupply', tags: ['essential', 'water'], priorityCategory: 'infrastructure' },
      at: {
        thorp: { fabric: true, desc: 'Well or spring. At least a bucketful a person each day.' },
        hamlet: { fabric: true, desc: 'Well or spring access.' },
        village: { name: 'Multiple water sources', fabric: true, desc: 'Wells and springs throughout village.' },
        town: { name: 'Multiple water sources', fabric: true, desc: 'Wells, fountains, or piped water.' },
        city: { name: 'Aqueduct or water system', desc: 'Engineered water supply. Conduits, cisterns, fountains.' },
        metropolis: { name: 'Advanced water infrastructure', desc: 'Multiple aqueducts, cisterns, and distributed fountains. City-wide water management at scale.' },
      },
    },
    {
      shared: { name: 'City hall', face: 'seat', required: true, desc: 'Impressive civic building.', tags: ['civic'], priorityCategory: 'infrastructure' },
      at: {
        town: { name: 'Town hall', desc: 'Meeting place and administrative center.' },
        city: {},
        metropolis: {},
      },
    },
    // Filed on Government until 2026-09-30; the building complex sits with Town hall and City hall.
    {
      shared: { name: 'Palace/government complex', face: 'seat' },
      at: {
        metropolis: { baseChance: 0.75, desc: 'Seat of metropolitan or state government: palace, ministries, audience halls, administrative bureaux.', tags: ['civic', 'legal'], priorityCategory: 'infrastructure' },
      },
    },
    // The metropolis rung was filed on Government while Courthouse and Multiple courthouses sat on
    // Infrastructure, until 2026-09-30.
    {
      shared: { face: 'the magistrate', tags: ['civic', 'legal'], priorityCategory: 'infrastructure' },
      at: {
        town: { name: 'Courthouse', baseChance: 0.6, desc: 'Borough court for local justice.' },
        city: { face: 'the chief magistrate', name: 'Multiple courthouses', required: true, desc: 'Commercial, criminal, and ecclesiastical courts.' },
        metropolis: { face: 'the chief magistrate', name: 'Multiple court buildings', required: true, desc: 'Specialized courts (commercial, criminal, appellate, ecclesiastical) operating simultaneously.', tags: ['legal', 'civic'] },
      },
    },
    {
      shared: { face: 'the gaoler', baseChance: 0.7, tags: ['legal', 'law_enforcement'], priorityCategory: 'infrastructure' },
      at: {
        town: { name: 'Small prison/stocks', desc: 'Holding cells and public punishment.' },
        city: { face: 'the prison warden', name: 'Large prison', desc: 'Debtors, criminals, political prisoners.' },
        metropolis: { face: 'the prison warden', name: 'Massive prison', desc: 'State prison complex: political prisoners, debtors, convicted criminals held separately.', tags: ['civic'] },
      },
    },
    {
      shared: { name: 'Workhouse', face: 'the workhouse master', desc: 'The able-bodied poor receive shelter and food in exchange for compulsory labour: textile work, grinding, construction. Not a prison but the line is blurry. Reduces vagrancy and produces goods. Conditions are deliberately harsh to discourage dependency.', tags: ['civic', 'trade'], priorityCategory: 'infrastructure' },
      at: {
        town: { baseChance: 0.1 },
        city: { baseChance: 0.25 },
        metropolis: { baseChance: 0.3 },
      },
    },
    {
      shared: { name: 'Sewage system', face: null, desc: 'Underground drainage. Rare but critical for health.', tags: ['sanitation'], priorityCategory: 'infrastructure' },
      at: {
        // `rare` at both tiers (the chair's ruling, 2026-11-04, rung-1 pins unit 6): "Rare but critical".
        city: { baseChance: 0.4, rare: true },
        metropolis: { baseChance: 0.5, rare: true },
      },
    },
    // Licensed `none`: a library needs no magic. Filed on Magic until 2026-09-30, which deleted it
    // from every magic-free world.
    {
      shared: { name: 'Great library', face: 'the librarian' },
      at: {
        metropolis: { baseChance: 0.4, desc: 'Largest repository of knowledge in the region: thousands of volumes, map archives, historical records.', tags: ['education', 'education'], magicLicense: 'none', priorityCategory: 'exotic' },
      },
    },
  ]),

  // ══════════════════════ DEFENSE ══════════════════════
  ...shelf('Defense', [
    // Massive walls could never generate (0 of 200 metropolises): the inherited required City walls
    // row held the defenseLevel group first. The metropolis rung is now the family's own.
    {
      shared: { name: 'Palisade or earthworks', face: null, exclusiveGroup: 'defenseLevel', tags: ['defense', 'fortification'] },
      at: {
        thorp: { name: 'Palisade', baseChance: 0.3, desc: 'Sharpened stakes encircling the settlement. Offers minimal protection but enough to deter casual raiders.', priorityCategory: 'defense' },
        hamlet: { baseChance: 0.12, desc: 'Basic wooden palisade or earthwork berm. Slows raids and creature incursions.' },
        village: { baseChance: 0.18, desc: 'Perimeter palisade or earthwork berm. Controls approach, slows attackers.' },
        town: { name: 'Town walls', baseChance: 0.5, desc: 'Stone fortifications with gates. Expensive to build and maintain.', priorityCategory: 'military' },
        city: { name: 'City walls and gates', required: true, desc: 'Masonry walls with towers. Multiple gatehouses.', tags: ['essential', 'defense', 'fortification'], priorityCategory: 'military' },
        metropolis: { name: 'Massive walls and fortifications', required: true, desc: 'Layered wall systems: outer wall, inner wall, citadel ring. Multiple garrison zones and gatehouses.', tags: ['essential', 'defense', 'fortification'], priorityCategory: 'military' },
      },
    },
    // Rolled without walls in 46 of 123 towns until 2026-09-30; `requiresAny` now enforces the
    // condition its name states.
    {
      shared: { name: 'Gates (if walled)', face: null },
      at: {
        town: { baseChance: 0.5, requiresAny: ['Town walls'], desc: 'Controlled entry points with gatekeepers.', tags: ['fortification', 'defense'], priorityCategory: 'military' },
      },
      ceiling: { tier: 'town', reason: 'City walls carry their gates in their own row.' },
    },
    // The town Citizen militia row (0 of 200 towns: blocked by the required Town watch in its own
    // group) is retired; the militia is the hamlet and village rung.
    {
      shared: { name: 'Citizen militia', face: 'the militia captain', desc: 'Full-time law enforcement. About one officer for every hundred people.', tags: ['defense', 'military'], priorityCategory: 'military' },
      at: {
        thorp: { face: null, name: 'Household levy', baseChance: 0.18, desc: 'One able-bodied adult from each household musters with hunting bows, spears, and farm tools when danger reaches the fields.' },
        hamlet: { baseChance: 0.15, desc: 'Able-bodied residents drill and muster against local threats. Part-time service.' },
        village: { baseChance: 0.22, desc: 'Organised community defense. Musters for raids and monster incursions. More reliable than hamlet levies.' },
        town: { face: 'the watch captain', name: 'Town watch', required: true, exclusiveGroup: 'civilianDefense', desc: 'Part-time guards. Night patrol and gate duty.', tags: ['law_enforcement', 'defense'] },
        city: { face: 'the watch commander', name: 'Professional city watch', required: true, tags: ['law_enforcement', 'defense'] },
        metropolis: { face: 'the watch commander', name: 'Professional city watch', required: true, tags: ['law_enforcement', 'defense'] },
      },
    },
    // F1 (rung 1B, 2026-11-04): the village may raise a watch. Rolled, never required, weighted by
    // the military slider like every defence row (`institutionProbability.js :: getBaseChance`, the
    // `watch` name). Name and text VETOABLE (the owner's content class).
    {
      shared: { name: 'Village watch', face: 'the watch sergeant', desc: 'Householders who take turns walking the lanes after dark, keep a lantern at the crossroads, and raise the alarm. Unpaid; the rota is their own.', tags: ['law_enforcement', 'defense'], priorityCategory: 'military' },
      at: {
        village: { baseChance: 0.2 },
      },
    },
    {
      shared: { face: 'the garrison commander', tags: ['military', 'defense'], priorityCategory: 'military' },
      at: {
        town: { name: 'Barracks', baseChance: 0.3, desc: 'Housing for guards or small garrison.', tags: ['military'] },
        city: { name: 'Garrison', required: true, desc: 'Professional soldiers. Noble or royal.' },
        metropolis: { name: 'Multiple garrisons', required: true, desc: 'Garrison forces distributed across quarters. No single barracks can secure a metropolis.' },
      },
    },
    {
      shared: { name: 'Citadel', face: 'the castellan', desc: 'Inner fortress. Last refuge in siege.', tags: ['fortification', 'defense'], priorityCategory: 'military' },
      at: {
        town: { baseChance: 0.2 },
        city: { baseChance: 0.4 },
        metropolis: { baseChance: 0.45 },
      },
    },
    // The city Mercenary quarter was filed on Adventuring until 2026-09-30; soldiers for hire are one
    // family.
    {
      shared: { name: 'Mercenary quarter', face: 'the company captain', desc: 'Organized sellsword companies. Major forces (hundreds to thousands).', tags: ['military'], priorityCategory: 'adventuring' },
      at: {
        town: { name: 'Free company hall', baseChance: 0.3, desc: 'A billet and contracting office for a band of professional soldiers available between campaigns. Offers caravan escort, garrison contracts, and short-term military hire at day-wage rates. Cheaper than a standing army, more reliable than a mob. These men fight in formation on salary, not for treasure.', tags: ['military', 'guild'], priorityCategory: 'military' },
        city: { baseChance: 0.6 },
        metropolis: { baseChance: 0.6 },
      },
    },
    {
      shared: { name: "Veteran's lodge", face: 'the lodge master', desc: 'A drinking hall where retired soldiers and mercenaries gather. Informal security, bar brawls, and the occasional job offer for a group needing swords.', tags: ['military'], priorityCategory: 'military' },
      at: {
        village: { baseChance: 0.15 },
        town: { baseChance: 0.2 },
        city: { baseChance: 0.2 },
        metropolis: { baseChance: 0.2 },
      },
    },
    // Licensed `none` (TE-CH-5): a ranger station needs no magic. Filed on Magic until 2026-09-30.
    {
      shared: { name: "Warden's Lodge", face: 'the warden' },
      at: {
        town: { baseChance: 0.2, desc: 'A ranger station. They monitor the surrounding wilderness, maintain trails, and keep tabs on beast migrations. In times of crisis they serve as emergency scouts and trackers.', tags: ['military'], magicLicense: 'none', priorityCategory: 'military' },
      },
      ceiling: { tier: 'town', reason: 'A wilderness post; cities have no wild country inside their reach.' },
    },
  ]),

  // ══════════════════════ MAGIC ══════════════════════
  ...shelf('Magic', [
    {
      shared: { name: "Wizard's tower", face: 'the wizard', desc: 'High-level spellcaster residence. Multiple towers possible.', tags: ['arcane'], magicLicense: 'medium', priorityCategory: 'magic' },
      at: {
        hamlet: { name: 'Traveling hedge wizard', face: 'the hedge wizard', baseChance: 0.2, desc: 'Occasional visits. The smallest spells only.', magicLicense: 'low' },
        village: { name: 'Hedge wizard', face: 'the hedge wizard', baseChance: 0.3, exclusiveGroup: 'magicalAuthority', desc: 'A resident caster of modest reach. Minor spells only.', magicLicense: 'low' },
        town: { baseChance: 0.2, exclusiveGroup: 'magicalAuthority', minPopulation: 1000, forbiddenTradeRoutes: ['isolated'], desc: 'Individual wizard residence.', thresholdNote: '1,000+ population viable.' },
        city: { baseChance: 0.4, exclusiveGroup: 'magicalAuthority', forbiddenTradeRoutes: ['isolated'] },
        metropolis: { baseChance: 0.4, exclusiveGroup: 'magicalAuthority', forbiddenTradeRoutes: ['isolated'] },
      },
    },
    {
      shared: { name: "Mages' guild", face: 'the guild archmage', desc: 'Organization of magic users.', thresholdNote: '2,000-5,000 population for chapter.', tags: ['arcane', 'guild'], magicLicense: 'medium', priorityCategory: 'magic' },
      at: {
        town: { baseChance: 0.1, minPopulation: 2000, forbiddenTradeRoutes: ['isolated'] },
        city: { baseChance: 0.3, forbiddenTradeRoutes: ['isolated'] },
        metropolis: { name: "Mages' district", baseChance: 0.5, desc: 'Quarter inhabited by arcane practitioners: towers, workshops, libraries, reagent merchants.', tags: ['arcane'], magicLicense: 'high', priorityCategory: 'exotic' },
      },
    },
    {
      shared: { name: 'Academy of magic', face: 'the chancellor' },
      at: {
        metropolis: { baseChance: 0.4, desc: 'Formal institution of arcane learning. Full curriculum, research facilities, visiting scholars.', tags: ['arcane', 'education'], magicLicense: 'high', priorityCategory: 'exotic' },
      },
    },
    {
      shared: { name: "Enchanter's shop", face: 'the enchanter', forbiddenTradeRoutes: ['isolated'], desc: 'Magic item creation.', thresholdNote: '5,000+ population typically.', tags: ['arcane', 'enchanting'], magicLicense: 'high', priorityCategory: 'magic' },
      at: {
        city: { baseChance: 0.4, minPopulation: 5000 },
        metropolis: { baseChance: 0.45 },
      },
    },
    {
      shared: { name: 'Scroll scribe', face: 'the scroll scribe', forbiddenTradeRoutes: ['isolated'], desc: 'Spell scrolls for sale. The smallest charm costs what a craftsman earns in a month; a greater working, a merchant’s year.', tags: ['arcane'], magicLicense: 'medium', priorityCategory: 'magic' },
      at: {
        town: { baseChance: 0.2 },
        city: { baseChance: 0.5 },
        metropolis: { baseChance: 0.5 },
      },
    },
    {
      shared: { name: 'Teleportation circle', face: 'the circle-keeper', desc: 'Permanent teleportation circle. Access is controlled and expensive to maintain. Transformative infrastructure for any settlement lucky enough to have one.', tags: ['arcane', 'exotic'], magicLicense: 'high', priorityCategory: 'magic' },
      at: {
        // `rare` (the chair's ruling, 2026-11-04, rung-1 pins unit 6): "Rare permanent circle".
        town: { baseChance: 0.08, rare: true, desc: 'Rare permanent circle. Extremely expensive to construct and maintain. Requires magical expertise beyond typical town resources.' },
        city: { baseChance: 0.15, forbiddenTradeRoutes: ['isolated'] },
        metropolis: { baseChance: 0.2, forbiddenTradeRoutes: ['isolated'] },
      },
    },
    // ⚠ LICENCE HELD AT `low` BY MEASUREMENT, NOT BY OMISSION (TE-CH-6, ODQ §541.8). The row is a
    // first-level SPELLCASTER (`textAssertsFunctionalMagic('Basic healing spells…')`), so a world
    // where spells do not work cannot hold it and `low` says exactly that. THE DOCTRINE GAP IS A
    // CONTENT GAP: the catalog holds no CULTURAL divine healer for a magic-free world to keep; filling
    // it is a new row and the owner's call. The tag/licence disagreement is pinned in
    // tests/lint/magicLicenceCensus.walker.test.js. The price in its text became relative on
    // 2026-09-30 (the price-heuristics law, ODQ §776).
    {
      shared: { name: 'Healer (divine, 1st level)', face: 'the healer' },
      at: {
        village: { baseChance: 0.4, desc: 'Basic healing spells. A closed wound costs more than most households see in a month.', tags: ['divine', 'healing'], magicLicense: 'low', priorityCategory: 'religion' },
      },
      ceiling: { tier: 'village', reason: 'Healing in towns runs through the hospitals and the apothecaries.' },
    },
    {
      shared: { name: 'Planar embassy', face: 'the envoy' },
      at: {
        metropolis: { baseChance: 0.15, desc: 'Formal diplomatic mission from a planar power. Trade, information, occasional intervention.', tags: ['arcane', 'planar', 'exotic'], magicLicense: 'high', priorityCategory: 'exotic' },
      },
    },
  ]),

  // ══════════════════════ ADVENTURING ══════════════════════
  ...shelf('Adventuring', [
    // The hamlet and village halls were filed on Magic (and so vanished from magic-free worlds) while
    // the town hall sat on Adventuring, until 2026-09-30. Licensed `none`.
    {
      shared: { name: "Adventurers' charter hall", face: 'the charter master', desc: 'Competing organizations.', tags: ['military', 'adventuring'], priorityCategory: 'military' },
      at: {
        hamlet: { baseChance: 0.12, desc: "A rough hall operating under a regional adventurers' charter. Posts bounties, shelters monster hunters, and coordinates local defense where no garrison stands. Common on dangerous frontiers.", magicLicense: 'none' },
        village: { baseChance: 0.2, desc: 'A licensed charter hall providing bounties, monster-hunting coordination, and emergency armed response for the surrounding territory. More common in frontier regions.', magicLicense: 'none' },
        town: { baseChance: 0.3, desc: 'A chartered hall serving as the primary adventuring hub for the region. Posts contracts, grades monster threats, maintains gear, and coordinates large-scale operations that militia cannot handle.' },
        city: { face: 'the senior charter master', name: "Multiple adventurers' guilds", baseChance: 0.7, tags: [], priorityCategory: 'adventuring' },
        metropolis: { face: 'the senior charter master', name: "Multiple adventurers' guilds", baseChance: 0.7, tags: [], priorityCategory: 'adventuring' },
      },
    },
    {
      shared: { name: 'Hireling hall', face: 'the hiring master', baseChance: 0.5, desc: 'Job board for torchbearers and porters, hired by the session at a day labourer’s wage.', tags: [], priorityCategory: 'adventuring' },
      at: {
        town: {},
        city: {},
        metropolis: {},
      },
    },
    // Filed on Entertainment until 2026-09-30.
    {
      shared: { name: 'Hired blades', face: 'the blade captain', desc: 'Individual or small groups of professional fighters available for private contracts: bodyguard work, debt enforcement, or quiet removal of problems.', tags: ['military'], priorityCategory: 'government' },
      at: {
        town: { baseChance: 0.25 },
        city: { baseChance: 0.35 },
        metropolis: { baseChance: 0.35 },
      },
    },
    {
      shared: { front: 'front', name: 'Dungeon delving supply district', face: 'the outfitter', baseChance: 0.5, desc: 'Specialized adventuring gear. Warded weapons, silver weapons, etc.', tags: [], priorityCategory: 'adventuring' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: "Sage's quarter", face: 'the sage', desc: 'Multiple scholars and researchers.', tags: ['education'], priorityCategory: 'adventuring' },
      at: {
        city: { baseChance: 0.5 },
        metropolis: { baseChance: 0.55 },
      },
    },
  ]),

  // ══════════════════════ CRIMINAL ══════════════════════
  ...shelf('Criminal', [
    {
      shared: { name: 'Fence (word of mouth)', face: 'the fence', desc: 'Local contact for moving stolen goods quietly. Operates behind another trade.', tags: ['criminal'], priorityCategory: 'criminal' },
      at: {
        thorp: { name: 'Local fence', baseChance: 0.1, desc: 'Somebody in this settlement buys things without asking where they came from. Everyone knows who. Nobody says it directly.' },
        hamlet: { baseChance: 0.12, desc: 'Stolen goods move through this hamlet quietly. The contact is known by face, not name.' },
        village: { baseChance: 0.15, tags: ['criminal', 'economy'] },
        town: { baseChance: 0.2, tags: ['criminal', 'economy'] },
      },
      ceiling: { tier: 'town', reason: 'City fencing runs through the black market and the thieves.' },
      successor: 'Black market',
    },
    {
      shared: { name: 'Outlaw shelter', face: 'the outlaw host' },
      at: {
        thorp: { baseChance: 0.08, desc: "Someone here provides cover for people who need to disappear. A barn, a cellar, an arrangement that isn't discussed.", tags: ['criminal'], priorityCategory: 'criminal' },
      },
      ceiling: { tier: 'thorp', reason: 'Larger places hide outlaws through bandit ties and smugglers.' },
    },
    {
      shared: { name: 'Bandit affiliate', face: 'the bandit contact', baseChance: 0.1, desc: 'One or more households here have ties to bandit groups operating the surrounding roads. Information, shelter, and supply flow both ways.', tags: ['criminal'], priorityCategory: 'criminal' },
      at: {
        hamlet: {},
        village: {},
      },
      ceiling: { tier: 'village', reason: 'Towns deal with the road gangs through smugglers and fences.' },
    },
    // The village row 'Smuggling network' (gated to city by minTier, so it never rolled at village) is
    // retired; the village rung is the waypoint.
    {
      shared: { name: 'Smuggling waypoint', face: 'the smuggler', desc: 'Goods pass through here to avoid toll roads or customs checkpoints. The hamlet benefits from fees paid in kind.', tags: ['criminal', 'smuggling'], priorityCategory: 'criminal' },
      at: {
        hamlet: { baseChance: 0.09, tags: ['criminal'] },
        village: { baseChance: 0.1, tags: ['criminal'] },
        town: { name: 'Smuggling operation', baseChance: 0.45, desc: 'Illicit goods trade. Tax evasion.' },
        city: { face: 'the network\'s head', name: 'Smuggling network', baseChance: 0.6, desc: 'Organized contraband trade.' },
        metropolis: { face: 'the network\'s head', name: 'Smuggling network', baseChance: 0.6, desc: 'Organized contraband trade.' },
      },
    },
    {
      shared: { name: 'Multiple criminal factions', face: 'the gang boss', desc: 'Competing gangs. Turf disputes.', tags: ['criminal'], priorityCategory: 'criminal' },
      at: {
        town: { name: 'Street gang', baseChance: 0.55, desc: 'Organized pickpockets and thugs. 10-30 members.' },
        city: { baseChance: 0.5, exclusiveGroup: 'criminalPower' },
        metropolis: { baseChance: 0.5, exclusiveGroup: 'criminalPower' },
      },
    },
    {
      shared: { face: 'the guildmaster of thieves', exclusiveGroup: 'criminalPower', tags: ['criminal'], priorityCategory: 'criminal' },
      at: {
        city: { name: "Thieves' guild chapter", baseChance: 0.6, minPopulation: 10000, desc: 'Organized crime chapter. 30-100 members.', thresholdNote: '10,000+ population for viable operation.' },
        metropolis: { name: "Thieves' guild (powerful)", baseChance: 0.55, desc: 'Dominant criminal syndicate. Tolerated because the alternative (gang war) is worse.' },
      },
    },
    {
      shared: { name: 'Front businesses', face: 'the front man', desc: 'Warehouses, taverns, shops as criminal covers.', tags: ['criminal'], priorityCategory: 'criminal' },
      at: {
        town: { baseChance: 0.45, desc: 'Legitimate covers for criminal activity.' },
        city: { baseChance: 0.7 },
        metropolis: { baseChance: 0.7 },
      },
    },
    // [D6 THE UNDERWAYS] Excavated tunnels beneath the settlement for discreet passage, untaxed
    // storage, and no-questions transport. Its EXISTENCE is public knowledge; its OPERATIONS run
    // through the covert seams. `facets` declare it clandestine + subterranean so the covert engine
    // couplings resolve it through facetOf. `forbiddenResources` makes it impossible atop
    // marsh/floodplain (tunnels flood). id `underground_network`.
    {
      shared: { name: 'Underground network', face: 'the network\'s spider', forbiddenResources: ['marshlands', 'fertile_floodplain'], desc: 'An extensive warren of smuggling tunnels beneath the city.', tags: ['criminal', 'smuggling', 'underground'], priorityCategory: 'criminal', facets: { clandestine: 'clandestine', subterranean: 'subterranean' } },
      at: {
        village: { baseChance: 0.08, desc: 'Dug smuggling passages beneath the village.' },
        town: { baseChance: 0.15, desc: 'A dug network of smuggling tunnels and cellars.' },
        city: { baseChance: 0.22 },
        metropolis: { baseChance: 0.22 },
      },
    },
    {
      shared: { name: 'Underground city', face: 'the undercity boss' },
      at: {
        metropolis: { baseChance: 0.25, desc: 'Extensive tunnels and catacombs repurposed as criminal and refugee sanctuary.', tags: ['criminal', 'underground'], priorityCategory: 'criminal', facets: { subterranean: 'subterranean' } },
      },
    },
    // [W-I INFORMATION BROKERAGES] I1, the illegal MINOR form (design §3). Its criminal-organization
    // precondition and rumour-source weighting are POWER-STRUCTURE reads that live in
    // data/informationBrokerageTuning.js.
    {
      shared: { name: 'Rookery', face: 'the rookery boss', desc: 'A loft of message birds kept by people who file no returns. Word arrives unsigned and ahead of the watch. Only a standing criminal organization can protect a loft like this.', tags: ['criminal', 'information', 'brokerage'], priorityCategory: 'criminal', serviceKeys: ['info_calibration', 'info_query'] },
      at: {
        town: { baseChance: 0.16 },
        city: { baseChance: 0.2 },
        metropolis: { baseChance: 0.2 },
      },
    },
    // `info_plant` is declared HERE and nowhere else, so the lie-selling capability is illegal-major
    // by construction.
    {
      shared: { name: 'Whisper market', face: 'the whisper broker', desc: 'A covert guild of brokers who buy and sell knowledge by the piece, grade what they sell, and will manufacture a claim for a patron who pays enough. It sites itself where the talk already is, among the fences, the late houses, and the inns that ask nothing.', tags: ['criminal', 'information', 'brokerage'], priorityCategory: 'criminal', serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'] },
      at: {
        city: { baseChance: 0.18 },
        metropolis: { baseChance: 0.2 },
      },
    },
    {
      shared: { face: 'the black marketeer', tags: ['criminal', 'underground'], priorityCategory: 'criminal' },
      at: {
        city: { name: 'Black market', baseChance: 0.6, desc: 'Illicit goods trade. Hidden locations.' },
        metropolis: { name: 'Black market bazaar', baseChance: 0.5, desc: 'Permanent underground market: contraband, forged documents, illegal services.', facets: { subterranean: 'subterranean' } },
      },
    },
    {
      shared: { name: 'Contract killer', face: 'the killer', baseChance: 0.25, desc: 'An individual or small cell with no guild behind it. Accepts contracts through criminal intermediaries. Less reliable but deniable.', tags: ['military'], priorityCategory: 'criminal' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: "Assassins' guild", face: 'the guild\'s master' },
      at: {
        metropolis: { baseChance: 0.2, desc: 'Professional contract killing. Operates through cutouts, never acknowledged officially.', tags: ['criminal'], priorityCategory: 'criminal' },
      },
    },
    {
      shared: { name: 'Kidnapping ring', face: 'the ringleader', baseChance: 0.15, exclusionConditions: ['Slave market', 'Slave market district'], desc: 'Targets free persons for fraudulent insertion into slavery through forged provenance documents. Where no lawful market exists to absorb the traffic, it runs its own holding, its own escorts, and its own silence.', tags: ['criminal', 'underground'], priorityCategory: 'criminal' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Human trafficking network', face: 'the trafficker', baseChance: 0.2, exclusionConditions: ['Slave market', 'Slave market district'], thresholdNote: 'Only fires where no legal slave market exists.', desc: 'Fully clandestine operation moving persons across jurisdictions outside legal channels. Distinct logistics, safe houses, and corrupt border infrastructure.', tags: ['criminal', 'underground', 'smuggling'], priorityCategory: 'criminal' },
      at: {
        city: {},
        metropolis: {},
      },
    },
  ]),

  // ══════════════════════ ENTERTAINMENT ══════════════════════
  ...shelf('Entertainment', [
    // The village musician was filed on Religious (tagged religious) until 2026-09-30.
    {
      shared: { face: 'the musician', noPower: true, tags: [], priorityCategory: 'entertainment' },
      at: {
        village: { name: 'Village musician', baseChance: 0.25, desc: 'A resident singer, fiddler, or piper. Plays at festivals and weddings. Also a keeper of local history through song.' },
        town: { face: 'the troupe leader', name: 'Traveling performers', baseChance: 0.8, desc: 'Bards, jugglers, acrobats visit during fairs.' },
      },
      ceiling: { tier: 'town', reason: 'Cities keep permanent theaters.' },
      successor: 'Theaters',
    },
    {
      shared: { front: 'prime', name: 'Theaters', face: 'the theatre manager', exclusiveGroup: 'theaterScale', desc: 'Permanent performance venues.', tags: [], priorityCategory: 'entertainment' },
      at: {
        town: { baseChance: 0.15 },
        city: { baseChance: 0.5 },
        metropolis: { name: 'Multiple theaters', baseChance: 0.7, desc: 'Permanent venues. Professional companies.' },
      },
    },
    {
      shared: { name: 'Opera house', face: 'the impresario' },
      at: {
        metropolis: { baseChance: 0.3, desc: 'High culture. Elite patronage.', tags: ['luxury'], priorityCategory: 'entertainment' },
      },
    },
    {
      shared: { name: 'Bardic college', face: 'the college master', desc: 'Formal musical education. Amphitheater, dormitories.', thresholdNote: '10,000+ for small campus.', tags: ['education'], priorityCategory: 'entertainment' },
      at: {
        city: { baseChance: 0.4, minPopulation: 10000 },
        metropolis: { baseChance: 0.45 },
      },
    },
    {
      shared: { face: 'the house boss', tags: [], priorityCategory: 'entertainment' },
      at: {
        town: { name: 'Gambling den', baseChance: 0.4, desc: 'Dice, cards, simple games of chance.' },
        city: { name: 'Gambling halls', baseChance: 0.6, exclusiveGroup: 'gamblingScale', desc: 'Dedicated establishments. Some illegal.' },
        metropolis: { name: 'Gambling district', baseChance: 0.8, exclusiveGroup: 'gamblingScale', desc: 'Concentrated gaming houses. Play kept honest by compelled truth.' },
      },
    },
    {
      shared: { name: 'Brothel (red light district)', face: 'the madam', desc: 'Legal or tolerated prostitution quarter.', tags: [], priorityCategory: 'entertainment' },
      at: {
        town: { name: 'Brothel', baseChance: 0.5, desc: 'Tolerated or regulated prostitution.' },
        city: { baseChance: 0.7, exclusiveGroup: 'redLightScale' },
        metropolis: { baseChance: 0.7, exclusiveGroup: 'redLightScale' },
      },
    },
    {
      shared: { name: 'Red light district', face: 'the district madam', baseChance: 0.9, exclusiveGroup: 'redLightScale', desc: 'Large organized prostitution quarter.', tags: [], priorityCategory: 'entertainment' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Fighting pits', face: 'the pit boss', desc: 'Illegal or semi-legal combat. Underground locations.', tags: [], priorityCategory: 'entertainment' },
      at: {
        town: { baseChance: 0.2 },
        city: { baseChance: 0.3 },
        metropolis: { baseChance: 0.3 },
      },
    },
    {
      shared: { name: 'Gladiatorial school', face: 'the lanista', desc: 'Trains fighters for public spectacle. Recruits from prisoners, debtors, and volunteers. Feeds the arena circuit.', tags: ['military'], priorityCategory: 'government' },
      at: {
        town: { baseChance: 0.15 },
        city: { baseChance: 0.2 },
        metropolis: { baseChance: 0.25 },
      },
    },
    {
      shared: { name: 'Colosseum/arena', face: 'the arena master' },
      at: {
        metropolis: { baseChance: 0.4, desc: 'Gladiatorial games or monster fights. Massive scale.', tags: [], priorityCategory: 'entertainment' },
      },
    },
    // Filed on Adventuring until 2026-09-30.
    {
      shared: { name: 'Charlatan fortune tellers', face: 'the fortune teller', noPower: true, desc: "Non-magical 'divination' worked by Deception, for a few coins a reading.", tags: [], priorityCategory: 'adventuring' },
      at: {
        town: { baseChance: 0.3 },
        city: { baseChance: 0.4 },
        metropolis: { baseChance: 0.45 },
      },
    },
  ]),

  // ══════════════════════ EXOTIC ══════════════════════
  ...shelf('Exotic', [
    {
      shared: { name: 'Planar traders', face: 'the planar factor' },
      at: {
        metropolis: { baseChance: 0.3, desc: 'Goods from other planes of existence.', tags: ['planar', 'trade'], magicLicense: 'high', priorityCategory: 'exotic' },
      },
    },
    {
      shared: { name: 'Dragon resident', face: 'the dragon', noPower: true },
      at: {
        // A dragon is a creature of magic in this world; "magic off" is the historical mode (chair
        // ruling 2, 2026-11-04). Licensed as the shelf's other explicitly magical rows are.
        // 2026-11-04 (chair ruling, round 3, 2): the licence joined the exotic scaler (×1.8 at
        // priorityMagic ≥ 66), so the row's draw is 0.1 / 1.8 ≈ 0.06 — a resident dragon stays occasional.
        // `rare` (the chair's addendum to the rung-1 pins, 2026-11-04): the 0.06 is an authored
        // rarity, so the density factor never scales it (34 of 80 drew it at d up to 4 on the window).
        metropolis: { baseChance: 0.06, rare: true, desc: 'Ancient wyrm living in city.', tags: [], magicLicense: 'high', priorityCategory: 'exotic' },
      },
    },
    {
      shared: { name: 'Golem workforce', face: 'the golem-master', baseChance: 0.2, desc: 'Constructed servants.', thresholdNote: 'If magic permits.', tags: ['arcane'], magicLicense: 'high', priorityCategory: 'exotic' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Undead labor', face: 'the necromancer-overseer', baseChance: 0.1, desc: 'Animated corpses working. Controversial.', tags: ['arcane'], magicLicense: 'high', priorityCategory: 'exotic' },
      at: {
        city: {},
        metropolis: {},
      },
    },
    {
      shared: { name: 'Dream parlors (high magic)', face: 'the dream-keeper' },
      at: {
        metropolis: { baseChance: 0.2, desc: 'Dream-walking magic sold as experience. Lucid shared dreams, communication.', tags: ['arcane', 'exotic'], magicLicense: 'high', priorityCategory: 'exotic' },
      },
    },
    {
      shared: { name: 'Airship docking (high magic)', face: 'the skydock master' },
      at: {
        metropolis: { baseChance: 0.1, desc: 'Mooring towers with magical weather protection.', tags: ['arcane', 'exotic'], magicLicense: 'high', priorityCategory: 'exotic' },
      },
    },
    {
      shared: { name: 'Message network (high magic)', face: 'the message-master' },
      at: {
        metropolis: { baseChance: 0.3, desc: 'Paired Speaking Stones set in a network. Each station costs as much as a merchant house, and only the crown or the great guilds keep one.', tags: ['arcane', 'exotic'], magicLicense: 'high', priorityCategory: 'exotic' },
      },
    },
  ]),
]);

const clonePlain = (value) => (value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value);

/**
 * One family's entry at one tier, as the catalog row every reader takes. Throws on an unknown
 * key so a typo'd field can never ride silently into generation.
 * @param {InstitutionFamily} fam @param {string} tier
 * @returns {{ name: string, row: Record<string, unknown>, guards: { minPopulation?: number, requiresAny?: string[] } | null, fabric: boolean, rare: boolean, face: string | null, noPower: boolean, front: string | null }}
 */
function deriveRow(fam, tier) {
  const merged = { ...(fam.shared || {}), ...fam.at[tier] };
  for (const key of Object.keys(merged)) {
    if (!ENTRY_KEYS.has(key)) throw new Error(`institutionalCatalog: unknown key "${key}" on ${tier} / ${merged.name}`);
  }
  const name = /** @type {string} */ (merged.name);
  // THE FACE IS DECLARED, NEVER DEFAULTED (the people car): a title, null, or the seat word.
  if (!Object.hasOwn(merged, 'face')) throw new Error(`institutionalCatalog: no face declared on ${tier} / ${name} (a title, null or 'seat')`);
  const face = merged.face;
  if (face !== null && !(typeof face === 'string' && face.trim() && (face === FACE_SEAT || face.startsWith('the ')))) {
    throw new Error(`institutionalCatalog: face on ${tier} / ${name} must be null, 'seat' or a title of the form "the …"`);
  }
  if (merged.noPower !== undefined && merged.noPower !== true) throw new Error(`institutionalCatalog: noPower on ${tier} / ${name} must be true or absent`);
  if (merged.noPower === true && !(typeof face === 'string' && face !== FACE_SEAT)) throw new Error(`institutionalCatalog: noPower on ${tier} / ${name} needs a titled face`);
  if (merged.front !== undefined && !FRONT_CLASSES.includes(/** @type {string} */ (merged.front))) throw new Error(`institutionalCatalog: front on ${tier} / ${name} must be 'prime', 'front' or absent`);
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
  // A FABRIC ROW HAS NO FACE WHATEVER ITS FAMILY SAYS (R-P1 a): the walk to another's mill is not a miller.
  const fabric = merged.fabric === true;
  return { name, row, guards, fabric, rare: merged.rare === true, face: fabric ? null : /** @type {string | null} */ (face), noPower: merged.noPower === true, front: typeof merged.front === 'string' ? merged.front : null };
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
/** THE FABRIC, by (tier, name) and by name. Registry-only, like the guards. @type {Set<string>} */
const FABRIC_ROWS = new Set();
/** @type {Set<string>} */
const FABRIC_NAMES = new Set();
/** THE AUTHORED RARITY, by (tier, name). Registry-only, like the fabric. @type {Set<string>} */
const RARE_ROWS = new Set();
/** THE FACE, by (tier, name): a title, the seat word, or null. Registry-only, like the fabric. @type {Map<string, string | null>} */
const FACE_BY_ROW = new Map();
/** THE FACE by name alone, for a roster row (a name's face is the same at every tier it is written;
 *  a fabric name resolves null, as `isFabricInstitution` reads it). @type {Map<string, string | null>} */
const FACE_BY_NAME = new Map();
/** The names flagged `noPower` (a face in no power). @type {Set<string>} */
const NO_POWER_NAMES = new Set();
/** THE FRONT MARK by name (ALLEGIANCE-CAR1, J-7): 'prime' | 'front'. Registry-only. @type {Map<string, string>} */
const FRONT_BY_NAME = new Map();

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
        const { name, row, guards, fabric, rare, face, noPower, front } = deriveRow(fam, tier);
        if (guards) GUARDS_BY_ROW.set(guardKey(tier, name), Object.freeze(guards));
        if (fabric) { FABRIC_ROWS.add(guardKey(tier, name)); FABRIC_NAMES.add(name); }
        if (rare) RARE_ROWS.add(guardKey(tier, name));
        FACE_BY_ROW.set(guardKey(tier, name), face);
        // One name, one face: a name written at two tiers under different faces would be two
        // keepers for one roster row, which no reader could resolve. Loud, never silent.
        if (FACE_BY_NAME.has(name) && FACE_BY_NAME.get(name) !== face) throw new Error(`institutionalCatalog: "${name}" carries two faces across tiers`);
        FACE_BY_NAME.set(name, face);
        if (noPower) NO_POWER_NAMES.add(name);
        if (front) FRONT_BY_NAME.set(name, front);
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

/**
 * Is this catalog row FABRIC at this tier (X-46 car 3)? The place, not a house: rolled and
 * printed as before, never counted in the institution budget.
 * @param {string} tier @param {string} name
 * @returns {boolean}
 */
export function isFabricRow(tier, name) {
  return FABRIC_ROWS.has(guardKey(tier, name));
}

/**
 * Is this roster row fabric? Read by the catalogue name the generator wrote (every fabric name is
 * fabric at each tier it is written); a custom or DM-authored institution is never fabric.
 * @param {{ name?: unknown, isCustom?: unknown, source?: unknown } | null | undefined} institution
 * @returns {boolean}
 */
export function isFabricInstitution(institution) {
  if (isStrangerHouse(institution)) return false;
  return FABRIC_NAMES.has(String(institution.name ?? ''));
}

/**
 * A custom or DM-authored roster row (or none): no registry mark reads it. ONE read of the
 * custom marks for every catalogue lookup, so the observed-shape register's `isCustom on
 * institutions` row (a key the generator never writes) stays at its one site.
 * @param {{ isCustom?: unknown, source?: unknown } | null | undefined} institution
 * @returns {boolean}
 */
function isStrangerHouse(institution) {
  return !institution || institution.isCustom === true || institution.source === 'custom';
}

/** Every fabric row, `{ tier, name }`, in tier then draw order (for the walker and the report). */
export function fabricRows() {
  return INSTITUTION_TIERS.flatMap(tier => Object.values(institutionalCatalog[tier])
    .flatMap(group => Object.keys(group))
    .filter(name => FABRIC_ROWS.has(guardKey(tier, name)))
    .map(name => Object.freeze({ tier, name })));
}

/**
 * Does the catalogue author this row's chance as a RARITY at this tier (`rare: true`)? The density
 * factor never scales such a row (the chair's addendum, 2026-11-04).
 * @param {string} tier @param {string} name
 * @returns {boolean}
 */
export function isRareRow(tier, name) {
  return RARE_ROWS.has(guardKey(tier, name));
}

/** Every rare row, `{ tier, name }`, in tier then draw order (for the walker and the report). */
export function rareRows() {
  return INSTITUTION_TIERS.flatMap(tier => Object.values(institutionalCatalog[tier])
    .flatMap(group => Object.keys(group))
    .filter(name => RARE_ROWS.has(guardKey(tier, name)))
    .map(name => Object.freeze({ tier, name })));
}

/**
 * THE FACE of a catalog row at a tier (the people car, R-P1): the keeper's title ("the miller"),
 * `FACE_SEAT` for the seat's building, or null for a row with no face (a place, the fabric, the
 * commons). Undefined for a name the catalogue does not place at that tier.
 * @param {string} tier @param {string} name
 * @returns {string | null | undefined}
 */
export function faceOfRow(tier, name) {
  return FACE_BY_ROW.get(guardKey(tier, name));
}

/**
 * THE FACE of a roster row, by the catalogue name the generator wrote (one name, one face at every
 * tier it is written); null for a custom or DM-authored institution (a stranger's house has no
 * registry face — PEOPLE-5's migration makes a DM's person a face of no house) and for a name
 * the catalogue does not place.
 * @param {{ name?: unknown, isCustom?: unknown, source?: unknown } | null | undefined} institution
 * @returns {string | null}
 */
export function faceOfInstitution(institution) {
  if (isStrangerHouse(institution)) return null;
  return FACE_BY_NAME.get(String(institution.name ?? '')) ?? null;
}

/**
 * Is this roster row's house a face in NO power (R-P1 e: the three weight-0 persons)?
 * @param {{ name?: unknown, isCustom?: unknown, source?: unknown } | null | undefined} institution
 * @returns {boolean}
 */
export function isNoPowerInstitution(institution) {
  if (isStrangerHouse(institution)) return false;
  return NO_POWER_NAMES.has(String(institution.name ?? ''));
}

/**
 * THE FRONT CLASS of a roster row's house (ALLEGIANCE-CAR1, J-7): 'prime', 'front', or null — for a
 * family the mark does not name, a custom or DM-authored house, or a name the catalogue does not place.
 * @param {{ name?: unknown, isCustom?: unknown, source?: unknown } | null | undefined} institution
 * @returns {'prime' | 'front' | null}
 */
export function frontClassOfInstitution(institution) {
  if (isStrangerHouse(institution)) return null;
  return /** @type {'prime' | 'front' | null} */ (FRONT_BY_NAME.get(String(institution?.name ?? '')) ?? null);
}

/**
 * Is this roster row's house FRONT-CAPABLE (J-7: a PRIME or a FRONT family)?
 * @param {{ name?: unknown, isCustom?: unknown, source?: unknown } | null | undefined} institution
 * @returns {boolean}
 */
export function isFrontCapableInstitution(institution) {
  return frontClassOfInstitution(institution) !== null;
}

/** family key (the name the generator writes at the family's first tier) and shelf, by any tier name. @type {Map<string, { key: string, shelf: string }>} */
const FAMILY_BY_NAME = new Map();
for (const fam of INSTITUTION_FAMILIES) {
  const names = familyNamesByTier(fam);
  const key = String(fam.shared?.name || names[0]?.name || '');
  for (const { name } of names) if (!FAMILY_BY_NAME.has(name.toLowerCase())) FAMILY_BY_NAME.set(name.toLowerCase(), Object.freeze({ key, shelf: fam.shelf }));
}

/**
 * The catalogue family a roster row belongs to — its key (the name the backing catalogue and the
 * face table row are keyed by) and its shelf — by the name the generator wrote, any tier's
 * spelling, case-insensitive. Null for a custom or DM-authored house and for a name the
 * catalogue does not place.
 * @param {{ name?: unknown, isCustom?: unknown, source?: unknown } | null | undefined} institution
 * @returns {{ key: string, shelf: string } | null}
 */
export function familyOfInstitution(institution) {
  if (isStrangerHouse(institution)) return null;
  return FAMILY_BY_NAME.get(String(institution.name ?? '').trim().toLowerCase()) ?? null;
}

/** Every catalog row's face, `{ tier, name, face, noPower }`, in tier then draw order (for the walker and the report). */
export function faceRows() {
  return INSTITUTION_TIERS.flatMap(tier => Object.values(institutionalCatalog[tier])
    .flatMap(group => Object.keys(group))
    .map(name => Object.freeze({ tier, name, face: FACE_BY_ROW.get(guardKey(tier, name)) ?? null, noPower: NO_POWER_NAMES.has(name) })));
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
