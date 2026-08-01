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

// ── RESOURCE → CHAIN LOOKUP ───────────────────────────────────────────────────
// Quick lookup: given a nearby resource key, which chains does it enable?

export const RESOURCE_TO_CHAINS = {
  grain_fields: ['food_security.grain', 'food_security.brewing', 'manufacturing.food_processing'],
  fertile_floodplain: [
    'food_security.grain',
    'food_security.livestock',
    'food_security.brewing',
    'food_security.animal_husbandry',
    'manufacturing.food_processing',
    'raw_extraction.floodplain_agriculture',
  ],
  grazing_land: [
    'food_security.livestock',
    'food_security.brewing',
    'food_security.animal_husbandry',
    'manufacturing.textiles',
    'manufacturing.leather',
    'manufacturing.textile_finishing',
    'manufacturing.leather_goods',
  ],
  hunting_grounds: [
    'food_security.forage',
    'food_security.hunting',
    'trade_entrepot.furs_north',
    'manufacturing.leather',
    'manufacturing.leather_goods',
  ],
  managed_forest: [
    'raw_extraction.timber',
    'raw_extraction.fuel',
    'raw_extraction.shipbuilding',
    'manufacturing.bowyer_fletcher',
  ],
  shipbuilding_timber: [
    'raw_extraction.timber',
    'raw_extraction.shipbuilding',
    'raw_extraction.coastal_shipbuilding',
  ],
  // data-tables-5: fishing_grounds/river_fish each mapped to BOTH the thin 'fish'
  // chain AND the richer 'fishing'/'river_fishing' chain, so a coastal town showed
  // two near-identical fishing industries. Map each resource to its ONE richer
  // chain; the retired 'fish' chain id survives on pre-fix persisted saves and is
  // resolved by RETIRED_CHAIN_ALIASES (below) — the reconcile drops the orphan.
  fishing_grounds: ['food_security.fishing'],
  river_fish: [
    'food_security.river_fishing',
    'food_security.fishing',
  ],
  river_mills: [
    'raw_extraction.river_milling',
    'manufacturing.food_processing',
    'manufacturing.textiles',
    'manufacturing.textile_finishing',
    'manufacturing.ceramics_brick',
  ],
  deep_harbour: [
    'raw_extraction.harbour_trade',
    'trade_entrepot.warehouse_logistics',
    'trade_entrepot.transit_finance',
  ],
  stone_quarry: ['raw_extraction.stone', 'raw_extraction.petty_mining', 'defense_security.fortification'],
  iron_deposits: [
    'raw_extraction.iron',
    'raw_extraction.smelting',
    'raw_extraction.petty_mining',
    'manufacturing.weapons_armor',
  ],
  coal_deposits: ['raw_extraction.fuel', 'raw_extraction.smelting', 'raw_extraction.petty_mining'],
  salt_flats: ['food_security.salt'],
  precious_metals: [
    'manufacturing.luxury_goods',
    'raw_extraction.precious_metals_mining',
    'trade_entrepot.transit_finance',
  ],
  gemstone_deposits: ['manufacturing.luxury_goods', 'raw_extraction.precious_metals_mining'],
  river_clay: ['manufacturing.ceramics_brick', 'raw_extraction.clay'],
  foraging_areas: [
    'food_security.forage',
    'manufacturing.beekeeping_wax',
    'healing_medicine.herbalism',
    'arcane_magical.alchemy',
  ],
  ancient_grove: [
    'religion_civic.parish',
    'healing_medicine.herbalism',
    'food_security.forage',
    'manufacturing.beekeeping_wax',
  ],
  marshlands: ['food_security.forage', 'raw_extraction.reed_marsh', 'raw_extraction.fuel'],
  crossroads_position: [
    'trade_entrepot.crossroads_trade',
    'trade_entrepot.warehouse_logistics',
    'trade_entrepot.transit_finance',
    'trade_entrepot.spices_dyes',
    'trade_entrepot.caravan_trade',
  ],
  defended_pass: [
    'trade_entrepot.mountain_pass_trade',
    'trade_entrepot.warehouse_logistics',
    'trade_entrepot.caravan_trade',
    'defense_security.garrison',
  ],
  ancient_ruins: [
    'knowledge_information.scholarship',
    'knowledge_information.intelligence',
    'arcane_magical.spellcasting',
  ],
  hot_springs: ['healing_medicine.divine_healing', 'religion_civic.pilgrimage'],
  magical_node: ['arcane_magical.alchemy', 'arcane_magical.spellcasting', 'arcane_magical.magical_goods'],

  // ── Desert resources ──────────────────────────────────────────────
  // Every id below must be a real `${needKey}.${chainId}` in SUPPLY_CHAIN_NEEDS
  // (there is no 'agricultural' or 'services' need group) — tests/joins/chains.test.js
  // pins this. Each terrain resource lists its dedicated terrain chain first.
  oasis_water: ['raw_extraction.oasis_agriculture', 'trade_entrepot.caravan_trade'],
  date_palms: [
    'raw_extraction.date_palm_harvest',
    'manufacturing.food_processing',
    'food_security.brewing',
  ],
  glass_sand: ['raw_extraction.desert_glasswork', 'manufacturing.glass_print'],
  desert_salt: [
    'food_security.salt',
    'manufacturing.food_processing',
    'trade_entrepot.spices_dyes',
  ],
  camel_herds: [
    'trade_entrepot.camel_caravan',
    'trade_entrepot.caravan_trade',
    'food_security.livestock',
    'food_security.animal_husbandry',
  ],

  // ── Mountain resources ─────────────────────────────────────────────
  alpine_pasture: [
    'raw_extraction.alpine_wool',
    'food_security.livestock',
    'food_security.animal_husbandry',
    'manufacturing.textiles',
  ],
  mountain_timber: [
    'raw_extraction.mountain_timber_harvest',
    'raw_extraction.timber',
    'raw_extraction.fuel',
  ],
  hot_springs_mineral: ['arcane_magical.alchemy', 'healing_medicine.hospital'],
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
  'food_security.fish': 'food_security.fishing',
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
  'arcane_magical.alchemy': Object.freeze({
    consumes: Object.freeze(['Arcane reagents', 'Medicinal herbs']),
    produces: Object.freeze(['Alchemical reagents']),
    demandWeight: 1,
  }),
  'arcane_magical.spellcasting': Object.freeze({
    consumes: Object.freeze(['Arcane reagents']),
    produces: Object.freeze([]),
    demandWeight: 2,
  }),
  'arcane_magical.magical_goods': Object.freeze({
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
