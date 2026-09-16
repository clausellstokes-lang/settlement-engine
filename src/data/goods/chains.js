/**
 * data/goods/chains.js — the LAZY half of the goods namespace: what a resource
 * BECOMES (chains), who wants it (demand), and how it is priced by tier.
 *
 * ONE OF TWO physical index surfaces (WEAVE ST-2, per DESIGN_FMG_WEAVE A1.1.4).
 * The namespace's typed record vocabulary is `src/domain/goods.schema.js`; the
 * other surface is `./identity.js`. Read the vocabulary module first — it
 * carries the surface law, the nine-module accounting, and the migration roster.
 *
 * ⛔ THE ONE RULE: NO MODULE IN THE EAGER FIRST-PAINT GRAPH MAY IMPORT THIS FILE.
 * ─────────────────────────────────────────────────────────────────────────────
 * Five of the six tables below ride the lazy `data-lazy` chunk today, and they
 * do so because nothing eager reaches them. vite.config.js derives that
 * classification from the import graph rather than a curated list, so a single
 * eager importer of THIS file re-classifies all of them as first-paint data:
 * ~390 kB into a closure with ~13 kB of headroom. That is the failure
 * `data/resourceChains.js:1-17` describes in the tree's own words, arriving
 * through an index instead of a re-export.
 *
 * The one eager consumer of a chains-half table — `domain/region/tradeLinks.js`,
 * which needs `finishedGoodsCategoryOf` — keeps its DIRECT import of
 * `finishedGoodsCategory.js` forever. That is not an oversight: FP-G4 split
 * that leaf out of `economicData.js` precisely so this single first-paint edge
 * would stop dragging the 21 kB TRADE_DEPENDENCY_NEEDS table along with it.
 * @enforced-by tests/build/vendorPdfLazy.test.js (the surface-law arms) +
 *              tests/joins/goods.test.js (re-export identity + the roster).
 *
 * WHY AN EAGER TABLE MAY APPEAR ON THE LAZY SURFACE
 * ─────────────────────────────────────────────────────────────────────────────
 * `finishedGoodsCategory.js` is physically eager and semantically demand, so it
 * is re-exported here. lazy → eager is the SAFE direction (the `custom-registry`
 * chunk does the same thing with the whale tables): a lazy chunk importing an
 * eager one adds no first-paint bytes, because the eager chunk is already in the
 * closure. Only the reverse direction is fatal.
 *
 * SYMBOLS
 *   RESOURCE_CHAINS                  Record<string, ResourceChainRecord>
 *   INDUSTRY_WATER_NEEDS             Record<InstitutionName, IndustryWaterNeed>
 *   TRADE_DEPENDENCY_NEEDS           Record<InstitutionName, TradeDependencyNeed>
 *   INSTITUTION_FINISHED_GOODS_DEMAND Record<string, FinishedGoodsDemandRecord>
 *   finishedGoodsCategoryOf          (label) => FinishedGoodsCategory
 *   GOODS_CATEGORIES                 Record<string, GoodsCategory>
 *   IMPORT_GOODS_BY_TIER             Record<Tier, Record<string, ImportGoodRecord[]>>
 *   GOODS_MODIFIERS_BY_TIER          Record<Tier, Record<string, GoodsModifierRecord>>
 *   COMMODITY_CATEGORY_MAP           Record<string, string>
 *   SUPPLY_CHAIN_NEEDS               Record<string, SupplyChainNeed>
 *   RESOURCE_TO_CHAINS               Record<ResourceKey, ChainAddress[]>
 *   RETIRED_CHAIN_ALIASES            Record<ChainAddress, ChainAddress>
 *   REAGENT_CHAIN_SPINE              Record<ChainAddress, ReagentChainRung>
 *   REAGENT_STAPLE_LABEL             string
 *
 * NOT HERE, ON PURPOSE: `domain/resourceSemantics.js` and
 * `generators/tradeCommodity.js` are namespace members with no surface door —
 * the `src/data/**` eslint purity rule bans a data module from importing the
 * generators layer, and a data → domain import would invert the layering every
 * other data table honours. They are typed in the vocabulary and imported where
 * they live.
 *
 * @see src/domain/goods.schema.js
 * @see src/data/goods/identity.js
 */

export { RESOURCE_CHAINS, INDUSTRY_WATER_NEEDS } from '../resourceChains.js';
export { TRADE_DEPENDENCY_NEEDS } from '../economicData.js';
export { INSTITUTION_FINISHED_GOODS_DEMAND, finishedGoodsCategoryOf } from '../finishedGoodsCategory.js';
export {
  GOODS_CATEGORIES,
  IMPORT_GOODS_BY_TIER,
  GOODS_MODIFIERS_BY_TIER,
  COMMODITY_CATEGORY_MAP,
} from '../tradeGoodsData.js';
export { SUPPLY_CHAIN_NEEDS } from '../supplyChainData.js';
export {
  RESOURCE_TO_CHAINS,
  RETIRED_CHAIN_ALIASES,
  REAGENT_CHAIN_SPINE,
  REAGENT_STAPLE_LABEL,
} from '../supplyChainResourceIndex.js';
