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
    'raw_extraction.petty_mining',
  ],
  shipbuilding_timber: ['raw_extraction.timber', 'raw_extraction.coastal_shipbuilding'],
  // data-tables-5: fishing_grounds/river_fish each mapped to BOTH the thin 'fish'
  // chain AND the richer 'fishing'/'river_fishing' chain, so a coastal town showed
  // two near-identical fishing industries. Map each resource to its ONE richer
  // chain; the retired 'fish' chain id survives on pre-fix persisted saves and is
  // resolved by RETIRED_CHAIN_ALIASES (below) — the reconcile drops the orphan.
  fishing_grounds: ['food_security.fishing'],
  river_fish: ['food_security.river_fishing'],
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
  salt_flats: ['food_security.salt', 'food_security.fishing'],
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
  ],

  // ── Mountain resources ─────────────────────────────────────────────
  alpine_pasture: [
    'raw_extraction.alpine_wool',
    'food_security.livestock',
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
