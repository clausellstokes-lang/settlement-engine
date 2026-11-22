// supplyChainResourceIndex.js
// Resource → chain reverse-lookup index, split out of supplyChainData.js so it
// rides the lazy 'data-lazy' chunk instead of the first-paint 'data' chunk. Its
// only consumers are the lazy generator (computeActiveChains) and the lazy
// worldPulse tick modules (tierResourceDynamics, institutionLifecycle) — never
// first-paint code. supplyChainData.js keeps SUPPLY_CHAIN_NEEDS, which is reached
// eagerly via lib/customRegistry and is what anchors that module in the eager
// 'data' chunk; co-locating this reverse index there made it pay first-paint
// bytes for zero eager consumer. Pure data (zero imports), moved verbatim from
// supplyChainData.js — byte-identical values.
// @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).

// Shared phrases hoisted once (train EM-T14's worker buy-back, judgment 191): each is spelled here and referenced below; the exported tables are byte-identical.
const ARCANE_MAGICAL_ALCHEMY = 'arcane_magical.alchemy';
const ARCANE_MAGICAL_MAGICAL_GOODS = 'arcane_magical.magical_goods';
const ARCANE_MAGICAL_SPELLCASTING = 'arcane_magical.spellcasting';
const FOOD_SECURITY_ANIMAL_HUSBANDRY = 'food_security.animal_husbandry';
const FOOD_SECURITY_BREWING = 'food_security.brewing';
const FOOD_SECURITY_FISHING = 'food_security.fishing';
const FOOD_SECURITY_FORAGE = 'food_security.forage';
const FOOD_SECURITY_GRAIN = 'food_security.grain';
const FOOD_SECURITY_LIVESTOCK = 'food_security.livestock';
const FOOD_SECURITY_SALT = 'food_security.salt';
const HEALING_MEDICINE_HERBALISM = 'healing_medicine.herbalism';
const MANUFACTURING_BEEKEEPING_WAX = 'manufacturing.beekeeping_wax';
const MANUFACTURING_CERAMICS_BRICK = 'manufacturing.ceramics_brick';
const MANUFACTURING_FOOD_PROCESSING = 'manufacturing.food_processing';
const MANUFACTURING_LEATHER = 'manufacturing.leather';
const MANUFACTURING_LEATHER_GOODS = 'manufacturing.leather_goods';
const MANUFACTURING_LUXURY_GOODS = 'manufacturing.luxury_goods';
const MANUFACTURING_TEXTILES = 'manufacturing.textiles';
const MANUFACTURING_TEXTILE_FINISHING = 'manufacturing.textile_finishing';
const RAW_EXTRACTION_FUEL = 'raw_extraction.fuel';
const RAW_EXTRACTION_PETTY_MINING = 'raw_extraction.petty_mining';
const RAW_EXTRACTION_PRECIOUS_METALS_MINING = 'raw_extraction.precious_metals_mining';
const RAW_EXTRACTION_SHIPBUILDING = 'raw_extraction.shipbuilding';
const RAW_EXTRACTION_SMELTING = 'raw_extraction.smelting';
const RAW_EXTRACTION_TIMBER = 'raw_extraction.timber';
const TRADE_ENTREPOT_CARAVAN_TRADE = 'trade_entrepot.caravan_trade';
const TRADE_ENTREPOT_SPICES_DYES = 'trade_entrepot.spices_dyes';
const TRADE_ENTREPOT_TRANSIT_FINANCE = 'trade_entrepot.transit_finance';
const TRADE_ENTREPOT_WAREHOUSE_LOGISTICS = 'trade_entrepot.warehouse_logistics';

// ── RESOURCE → CHAIN LOOKUP ───────────────────────────────────────────────────
// Quick lookup: given a nearby resource key, which chains does it enable?

export const RESOURCE_TO_CHAINS = {
  grain_fields: [FOOD_SECURITY_GRAIN, FOOD_SECURITY_BREWING, MANUFACTURING_FOOD_PROCESSING],
  fertile_floodplain: [
    FOOD_SECURITY_GRAIN,
    FOOD_SECURITY_LIVESTOCK,
    FOOD_SECURITY_BREWING,
    FOOD_SECURITY_ANIMAL_HUSBANDRY,
    MANUFACTURING_FOOD_PROCESSING,
    'raw_extraction.floodplain_agriculture',
  ],
  grazing_land: [
    FOOD_SECURITY_LIVESTOCK,
    FOOD_SECURITY_BREWING,
    FOOD_SECURITY_ANIMAL_HUSBANDRY,
    MANUFACTURING_TEXTILES,
    MANUFACTURING_LEATHER,
    MANUFACTURING_TEXTILE_FINISHING,
    MANUFACTURING_LEATHER_GOODS,
  ],
  hunting_grounds: [
    FOOD_SECURITY_FORAGE,
    'food_security.hunting',
    'trade_entrepot.furs_north',
    MANUFACTURING_LEATHER,
    MANUFACTURING_LEATHER_GOODS,
  ],
  managed_forest: [
    RAW_EXTRACTION_TIMBER,
    RAW_EXTRACTION_FUEL,
    RAW_EXTRACTION_SHIPBUILDING,
    'manufacturing.bowyer_fletcher',
  ],
  shipbuilding_timber: [
    RAW_EXTRACTION_TIMBER,
    RAW_EXTRACTION_SHIPBUILDING,
    'raw_extraction.coastal_shipbuilding',
  ],
  // data-tables-5: fishing_grounds/river_fish each mapped to BOTH the thin 'fish'
  // chain AND the richer 'fishing'/'river_fishing' chain, so a coastal town showed
  // two near-identical fishing industries. Map each resource to its ONE richer
  // chain; the retired 'fish' chain id survives on pre-fix persisted saves and is
  // resolved by RETIRED_CHAIN_ALIASES (below) — the reconcile drops the orphan.
  fishing_grounds: [FOOD_SECURITY_FISHING],
  river_fish: [
    'food_security.river_fishing',
    FOOD_SECURITY_FISHING,
  ],
  river_mills: [
    'raw_extraction.river_milling',
    MANUFACTURING_FOOD_PROCESSING,
    MANUFACTURING_TEXTILES,
    MANUFACTURING_TEXTILE_FINISHING,
    MANUFACTURING_CERAMICS_BRICK,
  ],
  deep_harbour: [
    'raw_extraction.harbour_trade',
    TRADE_ENTREPOT_WAREHOUSE_LOGISTICS,
    TRADE_ENTREPOT_TRANSIT_FINANCE,
  ],
  stone_quarry: ['raw_extraction.stone', RAW_EXTRACTION_PETTY_MINING, 'defense_security.fortification'],
  iron_deposits: [
    'raw_extraction.iron',
    RAW_EXTRACTION_SMELTING,
    RAW_EXTRACTION_PETTY_MINING,
    'manufacturing.weapons_armor',
  ],
  coal_deposits: [RAW_EXTRACTION_FUEL, RAW_EXTRACTION_SMELTING, RAW_EXTRACTION_PETTY_MINING],
  salt_flats: [FOOD_SECURITY_SALT],
  precious_metals: [
    MANUFACTURING_LUXURY_GOODS,
    RAW_EXTRACTION_PRECIOUS_METALS_MINING,
    TRADE_ENTREPOT_TRANSIT_FINANCE,
  ],
  gemstone_deposits: [MANUFACTURING_LUXURY_GOODS, RAW_EXTRACTION_PRECIOUS_METALS_MINING],
  river_clay: [MANUFACTURING_CERAMICS_BRICK, 'raw_extraction.clay'],
  foraging_areas: [
    FOOD_SECURITY_FORAGE,
    MANUFACTURING_BEEKEEPING_WAX,
    HEALING_MEDICINE_HERBALISM,
    ARCANE_MAGICAL_ALCHEMY,
  ],
  ancient_grove: [
    'religion_civic.parish',
    HEALING_MEDICINE_HERBALISM,
    FOOD_SECURITY_FORAGE,
    MANUFACTURING_BEEKEEPING_WAX,
  ],
  marshlands: [FOOD_SECURITY_FORAGE, 'raw_extraction.reed_marsh', RAW_EXTRACTION_FUEL],
  crossroads_position: [
    'trade_entrepot.crossroads_trade',
    TRADE_ENTREPOT_WAREHOUSE_LOGISTICS,
    TRADE_ENTREPOT_TRANSIT_FINANCE,
    TRADE_ENTREPOT_SPICES_DYES,
    TRADE_ENTREPOT_CARAVAN_TRADE,
  ],
  defended_pass: [
    'trade_entrepot.mountain_pass_trade',
    TRADE_ENTREPOT_WAREHOUSE_LOGISTICS,
    TRADE_ENTREPOT_CARAVAN_TRADE,
    'defense_security.garrison',
  ],
  ancient_ruins: [
    'knowledge_information.scholarship',
    'knowledge_information.intelligence',
    ARCANE_MAGICAL_SPELLCASTING,
  ],
  hot_springs: ['healing_medicine.divine_healing', 'religion_civic.pilgrimage'],
  magical_node: [ARCANE_MAGICAL_ALCHEMY, ARCANE_MAGICAL_SPELLCASTING, ARCANE_MAGICAL_MAGICAL_GOODS],

  // ── Desert resources ──────────────────────────────────────────────
  // Every id below must be a real `${needKey}.${chainId}` in SUPPLY_CHAIN_NEEDS
  // (there is no 'agricultural' or 'services' need group) — tests/joins/chains.test.js
  // pins this. Each terrain resource lists its dedicated terrain chain first.
  oasis_water: ['raw_extraction.oasis_agriculture', TRADE_ENTREPOT_CARAVAN_TRADE],
  date_palms: [
    'raw_extraction.date_palm_harvest',
    MANUFACTURING_FOOD_PROCESSING,
    FOOD_SECURITY_BREWING,
  ],
  glass_sand: ['raw_extraction.desert_glasswork', 'manufacturing.glass_print'],
  desert_salt: [
    FOOD_SECURITY_SALT,
    MANUFACTURING_FOOD_PROCESSING,
    TRADE_ENTREPOT_SPICES_DYES,
  ],
  camel_herds: [
    'trade_entrepot.camel_caravan',
    TRADE_ENTREPOT_CARAVAN_TRADE,
    FOOD_SECURITY_LIVESTOCK,
    FOOD_SECURITY_ANIMAL_HUSBANDRY,
  ],

  // ── Mountain resources ─────────────────────────────────────────────
  alpine_pasture: [
    'raw_extraction.alpine_wool',
    FOOD_SECURITY_LIVESTOCK,
    FOOD_SECURITY_ANIMAL_HUSBANDRY,
    MANUFACTURING_TEXTILES,
  ],
  mountain_timber: [
    'raw_extraction.mountain_timber_harvest',
    RAW_EXTRACTION_TIMBER,
    RAW_EXTRACTION_FUEL,
  ],
  hot_springs_mineral: [ARCANE_MAGICAL_ALCHEMY, 'healing_medicine.hospital'],
};

// ── RETIRED CHAIN ALIASES ─────────────────────────────────────────────────────
// [data-tables-3] The keeper the data-tables-5 comment promised (and never wrote):
// a retired chainId → its canonical successor. A pre-fix persisted save stamped the
// thin 'food_security.fish' chain (and often its richer 'food_security.fishing'
// twin) into economicState.activeChains; the current catalog no longer produces
// 'fish', so the surgical reconcile — which diffs before/after over the CURRENT
// vocabulary — never sees 'fish' in either set and would keep the orphan forever
// (still exporting 'Preserved foods'). reconcileProductionAfterResourceChange
// consults this map to drop a retired-alias chain when its successor is present
// (dedup) or was just removed (co-remove the orphan), never losing a live industry.
//
// Keys/values are full `${needKey}.${chainId}` ids (the reconcile's cidOf form).
/** @type {Readonly<Record<string, string>>} */
export const RETIRED_CHAIN_ALIASES = Object.freeze({
  'food_security.fish': FOOD_SECURITY_FISHING,
});

// == THE REAGENT CHAIN SPINE (W-K slice K4; binding law docs/DESIGN_MAGIC_ECONOMY.md
// section 7, "REAGENT SUPPLY CHAINS") ========================================
//
// Section 7 asks that magic's hunger be DENOMINATED IN THE GOODS CATALOG so that
// reagent corridors join the flow ledger and anti-magic siegecraft becomes economic
// warfare by construction. This constant is that denomination, and the shape it takes
// is a NAMING rather than an authoring, for a reason that was measured before it was
// written.
//
// THE CHAINS ALREADY EXIST. arcane_magical.alchemy is literally titled 'Alchemy and
// Reagents' and already declares 'Arcane reagents' among its rawInputs; magical_goods
// and planar declare the same input; spellcasting is the service the reagents pay for.
// So section 7's "reagent chains join supplyChainData" was already true of the raw
// input half. What was missing is the SPINE: a single place that says which of the
// estate's existing chains are the magic economy's material dependency, and which
// goods-catalog id each one hungers for. Without it every K4 consumer would hand-roll
// a fifth spelling of "which chains are magical", which is the faction-key defect
// class with the serial numbers filed off.
//
// WHY NOT A NEW CHAIN IN SUPPLY_CHAIN_NEEDS, MEASURED RATHER THAN ASSUMED. A new
// entry in that table GENERATES. cascadeGenerator builds an institution adjacency map
// from every chain's processingInstitutions and gives each neighbour a boosted second
// chance whose acceptance costs one draw off the seeded ambient stream. Adding one
// reagent chain whose processors are the magic institutions that actually appear on
// rosters was measured on 2026-08-01 to mutate the adjacency of 'alchemist' and
// "mages' guild" and to add six edges to the map, which is six new boost candidates,
// which is up to six extra draws, which TRANSLATES the seeded stream for every
// downstream generator. It also adds a seventy-fifth prebuilt registry row. That is
// the I1 lesson exactly, and it would have cost an owner-signed golden re-record for
// data that no dark world is allowed to feel. So the spine NAMES chains instead of
// minting one, and generation is untouched by construction: nothing in this constant
// is read by computeActiveChains, cascadeGenerator, the viability scan or the
// prebuilt-registry enumerator.
//
// It lives in this file rather than in supplyChainData.js for the reason stated in
// this file's own header: its only consumers are the lazy worldPulse tick modules, so
// co-locating it in the eager first-paint chunk would pay first-paint bytes for zero
// eager consumer. That is the split this file exists to be.
//
// LABELS, NOT IDS, on purpose. The values are catalog LABELS because they are fed to
// goodsCatalog normalizeGood, which is the estate's one denominator and which resolves
// 'Arcane reagents' and 'Alchemical reagents' onto the same arcane_reagents id. Naming
// the id here would be a second spelling of a mapping the catalog already owns.
//
// @enforced-by tests/domain/magicSubstitutionReagents.test.js (every key resolves to a
//   real chain in SUPPLY_CHAIN_NEEDS; every good resolves to a non-custom catalog id).

/**
 * The chains that make the magic economy MATERIAL, keyed by the same
 * `${needKey}.${chainId}` id the engine stamps into economicState.activeChains.
 *
 * `consumes` is the reagent hunger: the goods a settlement running this chain must
 * obtain, which is what generates corridor demand and what an interdiction denies.
 * `produces` is what the chain puts back into the ledger, which is what makes a
 * reagent-producing neighbour a supplier worth chartering a road to.
 * `demandWeight` is the RELATIVE hunger of the rung, an integer band: a hedge
 * alchemist's bench and a planar entrepot do not eat the same amount. The absolute
 * scale is the regime's business (section 7: "scaled by regime") and lives in
 * MAGIC_SUBSTITUTION_TUNING, never here, so this table stays a fact about chains.
 * @type {Readonly<Record<string, Readonly<{ consumes: ReadonlyArray<string>, produces: ReadonlyArray<string>, demandWeight: number }>>>}
 */
export const REAGENT_CHAIN_SPINE = Object.freeze({
  [ARCANE_MAGICAL_ALCHEMY]: Object.freeze({
    consumes: Object.freeze(['Arcane reagents', 'Medicinal herbs']),
    produces: Object.freeze(['Alchemical reagents']),
    demandWeight: 1,
  }),
  [ARCANE_MAGICAL_SPELLCASTING]: Object.freeze({
    consumes: Object.freeze(['Arcane reagents']),
    produces: Object.freeze([]),
    demandWeight: 2,
  }),
  [ARCANE_MAGICAL_MAGICAL_GOODS]: Object.freeze({
    consumes: Object.freeze(['Arcane reagents', 'Extraplanar goods']),
    produces: Object.freeze(['Extraplanar goods']),
    demandWeight: 3,
  }),
  'arcane_magical.planar': Object.freeze({
    consumes: Object.freeze(['Arcane reagents', 'Extraplanar goods']),
    produces: Object.freeze(['Extraplanar goods']),
    demandWeight: 4,
  }),
});

/**
 * The ONE good every rung of the spine hungers for, and therefore the good an
 * interdiction denies when it wants to reach the magic economy rather than a
 * particular workshop. Stated as a label for the same reason the spine is: the
 * catalog owns the mapping onto an id.
 * @type {string}
 */
export const REAGENT_STAPLE_LABEL = 'Arcane reagents';
