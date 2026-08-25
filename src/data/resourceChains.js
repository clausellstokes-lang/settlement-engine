/**
 * resourceChains.js — the resource → processing → export chain vocabulary
 * and the industry water-requirement table.
 *
 * FIRST-PAINT LAW (@enforced-by tests/build/vendorPdfLazy.test.js): these two
 * tables are LAZY-ONLY. Their only consumers are the generation engine
 * (resourceGenerator, economy/viability), the PDF view-model, and the display
 * layer (institutionProfile) — all reached via dynamic import(), never at first
 * paint. They were extracted out of resourceData.js (whose RESOURCE_DATA /
 * SPECIAL_RESOURCES tables ARE eagerly reached by customRegistry /
 * structuralValidator, dragging these ~245 lines into the first-paint 'data'
 * chunk for nothing). Kept here they ride 'data-lazy' with the surface that
 * needs them. DO NOT re-export these from resourceData.js — an eager re-export
 * would re-drag them into first paint. (npcTraitWeights / finishedGoodsCategory
 * idiom.) src/data → src/data import of TAG is permitted by the data-purity lint.
 */
import { TAG } from './entityTags.js';

// RESOURCE_CHAINS — raw-resource → processing → export chains.
//
// `processingTags` is the mechanical matcher: an institution processes a chain
// if it carries any of these canonical capability tags (resourceGenerator's
// institutionSupportsChain). Tags decouple the analysis from institution *labels*
// — "Weavers/Textile workers" processes wool because it carries TAG.TEXTILE, not
// because its name string equals "Weavers' guild". Every value MUST be a tag the
// institutional catalog actually declares (pinned by tests/joins/resourceChainCatalog.test.js;
// invented tags fail the gate). A few chains have no distinct catalog capability
// tag (stone masonry, desert salt) — they carry an empty processingTags and lean
// on the exact-name fallback against REAL catalog names.
//
// `processingInstitutions` stays the human-readable gap-row vocabulary. It must
// resolve under the same resolver runtime uses (catalog name ∨ keyword-backfill
// tag) — the pin that would have caught the old 'granar'/'Salt merchant'/
// 'Cheesemaker' phantoms, now fixed to real catalog institutions.
export const RESOURCE_CHAINS = {
  wool: {
    rawResource: "wool",
    processingTags: [TAG.TEXTILE],
    processingInstitutions: ["Weavers' guild", "Dyers' guild", "Fulling mill"],
    intermediateGoods: ["cloth", "dyed fabric"],
    finalProducts: ["clothing", "tapestries", "sails"],
    exportValue: "high",
    dependsOn: ["sheep", "grazing land"],
  },
  flax: {
    rawResource: "flax",
    processingTags: [TAG.TEXTILE],
    processingInstitutions: ["Weavers' guild", "Linen workshop"],
    intermediateGoods: ["linen thread", "linen cloth"],
    finalProducts: ["clothing", "bedding", "canvas"],
    exportValue: "medium",
    dependsOn: ["farmland"],
  },
  grain: {
    rawResource: "grain",
    processingTags: [TAG.FOOD, TAG.AGRICULTURE],
    // 'granar' (typo) → 'Town granary'; 'Baker' → 'Bakers (5-15)' (real catalog names).
    processingInstitutions: ["Mill", "Town granary", "Bakers (5-15)", "Access to external mill"],
    intermediateGoods: ["flour", "stored grain"],
    finalProducts: ["bread", "beer", "animal feed"],
    exportValue: "medium",
    dependsOn: ["farmland", "water source"],
  },
  grapes: {
    rawResource: "grapes",
    processingTags: [TAG.FOOD],
    // 'Winery' → 'Vintner' (the catalog institution that makes wine).
    processingInstitutions: ["Vintner", "Vintners' guild"],
    intermediateGoods: ["wine"],
    finalProducts: ["aged wine", "vinegar"],
    exportValue: "high",
    dependsOn: ["hillside vineyards"],
  },
  livestock: {
    rawResource: "livestock",
    processingTags: [TAG.FOOD, TAG.LEATHER],
    // 'Cheesemaker' → 'Dairy farmer' (real catalog name).
    processingInstitutions: ["Butcher", "Tannery", "Dairy farmer"],
    intermediateGoods: ["meat", "hides", "dairy"],
    finalProducts: ["leather goods", "cheese", "preserved meat"],
    exportValue: "medium",
    dependsOn: ["grazing land"],
  },
  ironOre: {
    rawResource: "iron ore",
    processingTags: [TAG.METALWORK],
    processingInstitutions: ["Mine", "Smelter", "Blacksmiths' guild"],
    intermediateGoods: ["pig iron", "iron bars"],
    finalProducts: ["tools", "weapons", "armor", "nails"],
    exportValue: "very high",
    dependsOn: ["ore deposits", "charcoal/fuel"],
  },
  copperOre: {
    rawResource: "copper ore",
    processingTags: [TAG.METALWORK],
    processingInstitutions: ["Mine", "Smelter", "Coppersmiths' guild"],
    intermediateGoods: ["copper bars"],
    finalProducts: ["cookware", "wire", "decorative items"],
    exportValue: "high",
    dependsOn: ["ore deposits"],
  },
  preciousMetals: {
    rawResource: "gold/silver ore",
    processingTags: [TAG.METALWORK, TAG.LUXURY],
    processingInstitutions: ["Mine", "Smelter", "Goldsmiths' guild"],
    intermediateGoods: ["gold/silver bars"],
    finalProducts: ["jewelry", "coins", "religious items"],
    exportValue: "very high",
    dependsOn: ["rare ore deposits"],
  },
  timber: {
    rawResource: "timber",
    processingTags: [TAG.TIMBER],
    processingInstitutions: ["Sawmill", "Carpenters' guild"],
    intermediateGoods: ["lumber", "planks"],
    finalProducts: ["furniture", "ships", "buildings", "barrels"],
    exportValue: "medium",
    dependsOn: ["forest"],
  },
  stone: {
    rawResource: "stone",
    // No distinct masonry capability tag exists in the catalog (quarries/masons
    // are tagged only 'trade', too broad to mean "processes stone") — matched by
    // exact name against the real catalog quarry instead.
    processingTags: [],
    processingInstitutions: ["Stone quarry", "Stonemasons' guild"],
    intermediateGoods: ["cut stone", "stone blocks"],
    finalProducts: ["buildings", "monuments", "sculpture"],
    exportValue: "medium",
    dependsOn: ["quarry site"],
  },
  hides: {
    rawResource: "animal hides",
    processingTags: [TAG.LEATHER],
    processingInstitutions: ["Tannery", "Leatherworkers' guild"],
    intermediateGoods: ["leather"],
    finalProducts: ["boots", "armor", "belts", "saddles"],
    exportValue: "high",
    dependsOn: ["livestock", "game"],
  },
  fish: {
    rawResource: "fish",
    processingTags: [TAG.FOOD],
    processingInstitutions: ["Fishmonger", "Salters' guild"],
    intermediateGoods: ["fresh fish", "salted fish"],
    finalProducts: ["preserved fish", "fish oil"],
    exportValue: "medium",
    dependsOn: ["water access", "fishing grounds"],
  },
  gemstones: {
    rawResource: "gemstones",
    processingTags: [TAG.LUXURY, TAG.METALWORK],
    processingInstitutions: ["Mine", "Jewelers' guild"],
    intermediateGoods: ["cut gems"],
    finalProducts: ["jewelry", "decorative items"],
    exportValue: "very high",
    dependsOn: ["gem deposits"],
  },
  sand: {
    rawResource: "glass sand",
    processingTags: [TAG.LUXURY],
    processingInstitutions: ["Glassblower"],
    intermediateGoods: ["glass"],
    finalProducts: ["windows", "bottles", "decorative glass"],
    exportValue: "high",
    dependsOn: ["sand deposits", "fuel"],
  },
  herbs: {
    rawResource: "medicinal herbs",
    processingTags: [TAG.ALCHEMY, TAG.HEALING],
    // 'Herbalist' → 'Apothecary'; 'Alchemist' → 'Alchemist shop' (real catalog names).
    processingInstitutions: ["Apothecary", "Alchemist shop"],
    intermediateGoods: ["potions", "tinctures"],
    finalProducts: ["healing potions", "antidotes"],
    exportValue: "very high",
    dependsOn: ["herb gathering areas"],
  },
  // ── Terrain-specific chains ──────────────────────────────────────────────────
  alpineWool: {
    rawResource: "alpine_pasture",
    processingTags: [TAG.TEXTILE],
    processingInstitutions: ["Weavers' guild", "Fulling mill", "Dyers' guild"],
    intermediateGoods: ["raw wool", "washed fleece", "cloth"],
    finalProducts: ["highland wool", "woolen cloth", "felt"],
    exportValue: "high",
    dependsOn: ["highland pasture", "water source"],
  },
  mountainTimber: {
    rawResource: "mountain_timber",
    processingTags: [TAG.TIMBER],
    processingInstitutions: ["Sawmill", "Carpenters' guild", "Charcoal burner"],
    intermediateGoods: ["lumber", "planks", "charcoal"],
    finalProducts: ["building timber", "charcoal fuel", "furniture"],
    exportValue: "medium",
    dependsOn: ["mountain forest", "logging routes"],
  },
  desertSalt: {
    rawResource: "desert_salt",
    // No 'salt' capability tag in the catalog — matched by exact name against the
    // real salt works + market that produce/distribute it.
    processingTags: [],
    // 'Salt merchant' → 'Salt works'; 'Market' → 'Market square' (real catalog names).
    processingInstitutions: ["Salt works", "Market square"],
    intermediateGoods: ["raw salt", "purified salt"],
    finalProducts: ["table salt", "salt for preservation", "salt for trade"],
    exportValue: "high",
    dependsOn: ["salt deposits", "dry conditions"],
  },
  desertGlass: {
    rawResource: "glass_sand",
    processingTags: [TAG.LUXURY],
    processingInstitutions: ["Glassblower", "Artisan workshop"],
    intermediateGoods: ["glass", "coloured glass"],
    finalProducts: ["blown glass", "windows", "glass vessels", "mirrors"],
    exportValue: "high",
    dependsOn: ["pure silica sand", "fuel source"],
  },
  camelCaravan: {
    rawResource: "camel_herds",
    processingTags: [TAG.TRANSPORT, TAG.LEATHER],
    // 'Stable' → 'Stable yard' (real catalog name).
    processingInstitutions: ["Caravanserai", "Stable yard", "Leather tanner"],
    intermediateGoods: ["hides", "wool", "transport capacity"],
    finalProducts: ["camel leather", "caravan services", "riding animals"],
    exportValue: "very high",
    dependsOn: ["desert pasture", "water access"],
  },
  oasisDate: {
    rawResource: "oasis_water",
    processingTags: [TAG.FOOD, TAG.MARKET],
    processingInstitutions: ["Market", "Granary", "Merchant"],
    intermediateGoods: ["fresh produce", "dates", "water supply"],
    finalProducts: ["dried dates", "date wine", "water rights"],
    exportValue: "high",
    dependsOn: ["oasis", "water source"],
  },
  mineralHot: {
    rawResource: "hot_springs_mineral",
    processingTags: [TAG.HEALING, TAG.ALCHEMY],
    // 'Alchemist' → 'Alchemist shop'; 'Herbalist' → 'Apothecary'; 'Bathhouse' →
    // 'Public bathhouse' (real catalog names).
    processingInstitutions: ["Alchemist shop", "Apothecary", "Public bathhouse"],
    intermediateGoods: ["mineral water", "salts", "therapeutic pools"],
    finalProducts: ["medicines", "restorative treatments", "mineral salts"],
    exportValue: "high",
    dependsOn: ["hot spring source", "knowledge of properties"],
  },
};

export const INDUSTRY_WATER_NEEDS = {
  Tannery: {
    required: !0,
    alternatives: ["Aqueduct", "Multiple wells", "Water system"],
    reason: "Tanning requires large amounts of water for processing hides",
  },
  "Dyers' guild": {
    required: !0,
    alternatives: ["Aqueduct", "Multiple wells"],
    reason: "Dyeing textiles requires significant water for preparation and rinsing",
  },
  "Fulling mill": {
    required: !0,
    alternatives: ["Water wheel", "River access"],
    reason: "Fulling uses water-powered hammers to clean and thicken cloth",
  },
  Mill: {
    required: !0,
    alternatives: ["Windmill", "Horse mill"],
    reason: "Traditional mills require water power for grinding grain",
  },
  Brewery: {
    required: !0,
    alternatives: ["Deep well", "Spring access"],
    reason: "Brewing requires clean water for production",
  },
  "Paper mill": {
    required: !0,
    alternatives: [],
    reason: "Paper production requires water for pulping and processing",
  },
};
