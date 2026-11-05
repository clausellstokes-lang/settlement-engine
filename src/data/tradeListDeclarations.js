/**
 * data/tradeListDeclarations.js — THE TRADE LISTS' DECLARED ROWS (CENSUS-3b unit 3; the vocabulary
 * rulings §7; `docs/CENSUS_3_LANE_2026-11-04.md` rulings 1 and 3).
 *
 * The Economics tab's Exports and Imports are KIND A (a whole list printed): no draw to protect,
 * so each item is filtered by its own declaration (`facts/drawDeclared.js :: filterDeclared`) at
 * ONE display reader (`domain/display/tradeListDisplay.js`). The record's lists are untouched (no
 * persisted shape moves; the generator's goods tables keep their bare strings).
 *
 * LUXURY_CLASS — the luxury class, declared ONCE with its band `tier: ≥ village` (the chair's
 * ruling 1: a thorp or a hamlet does not trade in luxury goods). The labels are the phase-A
 * ledger's 28 (`docs/census/declarations/_eco_tables_summary.json :: luxuryClass`) plus the
 * spellings the record actually prints for the same goods (`geographyData.js` mustImport's
 * "Quality textiles", the import tier's bare "Spices", the camel-herd resource as it reads on the
 * page): the instrument's list (`readerBattery.js :: LUXURY`) is the chair's. Matched exactly,
 * case-folded, on the item's label with its trade mark stripped.
 *
 * NOT_A_GOOD — the category errors that LEAVE the trade lists (the vocabulary rulings §7): a
 * revenue, a fee or a service is income, not a good shipped. Their income home already carries
 * them where one exists (Toll Revenue, Entrepôt Trade, Military Contracts); the lane doc records
 * the rest. Matched exactly, case-folded, after the mark is stripped.
 *
 * Pure data.
 */

/** @typedef {{ text: string, needs?: ReadonlyArray<string>, excludes?: ReadonlyArray<string> }} DeclaredLine */

const LUXURY_BAND = Object.freeze(['tier: ≥ village']);

/** @type {ReadonlyArray<string>} */
const LUXURY_LABELS = Object.freeze([
  // the phase-A ledger's 28
  'Camel Herds', 'Cut gemstones', 'Dyed cloth', 'Exotic imports', 'Extreme luxury goods', 'Fine textiles',
  'Fine wool cloth', 'Gem Mining & Lapidary', 'Gem appraisal', 'Gemstones', 'Highest luxury goods',
  'Luxury Goods', 'Luxury goods', 'Luxury imports', 'Luxury manufactured goods', 'Luxury materials',
  'Luxury textiles', 'Luxury textiles and exotic goods', 'Metal ore + gems', 'Rare materials',
  'Rare spices and dyes', 'Rare spices and exotic dyes', 'Raw gemstones', 'Silk & Luxury Textiles',
  'Silk, fine dyes, and imported cloth', 'Silk, fine dyes, exotic textiles, and finished luxury garments',
  'Spices & Dyes', 'Spices and exotic dyes',
  // the spellings the page prints for the same goods (CENSUS-3b)
  'Spices', 'Silk', 'Gems', 'Exotic goods', 'Fine cloth', 'Quality textiles', 'Quality textiles and cloth',
  'camel_herds',
]);

/** @type {ReadonlyArray<DeclaredLine>} */
export const LUXURY_CLASS = Object.freeze(LUXURY_LABELS.map((text) => Object.freeze({ text, needs: LUXURY_BAND })));

/** @type {ReadonlyArray<string>} */
export const NOT_A_GOOD = Object.freeze([
  'Transit trade', 'Toll revenue', 'Pass transit trade', 'Toll income', 'Market taxes', 'Transit trade profit',
  'Strategic control', 'Trade access fees', 'Coin minting', 'Cultural tourism revenue', 'Planar trade access',
  'Warehousing and logistics services', 'Route maps and intelligence', 'Massive food requirements',
  'Political legitimacy', 'Banking services', 'International banking', 'Legal services',
  'Advanced legal expertise', 'Advanced medical care', 'Overland freight revenue',
]);
