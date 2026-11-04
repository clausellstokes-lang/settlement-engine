/**
 * domain/foodSurplus.js — THE FOOD-SURPLUS RULE (lane food-exports, 2026-11-04;
 * docs/SOAK_1000_2026-11-03.md §4b R4). One rule, read by the export writers
 * (computeActiveChains.js :: deriveExportsFromChains, economicState.js's chain outputs) and by
 * the readers that would otherwise grade food "Surplus" on their own (SubstrateTab's
 * Foundations Food row). Pure.
 */

// The goods that SAY the place grows more food than it eats. A trade good, a chain output
// or an export row with one of these names is a claim on the food record, so it is offered
// only when the record holds it: `growsMoreThanEats`, and not a famine (FOOD-3's failing
// source has taken the harvest). A place short of food still sells its crafts, its goods
// and its milled flour; it never sells a food surplus.
const FOOD_SURPLUS_GOODS = new Set(['grain surplus', 'agricultural surplus', 'food surplus', 'date surplus', 'bulk food exports']);
const TRADE_SUFFIX = / \((?:transit|naval route only|taxed by occupation)\)$/;

/**
 * May a writer offer a food-surplus good? A missing record (a direct caller with no food
 * model — the world-pulse resource kernel) keeps the legacy behaviour.
 * @param {{ growsMoreThanEats?: boolean, band?: string } | null | undefined} foodRecord
 */
export const offersFoodSurplus = (foodRecord) => (
  !foodRecord || (foodRecord.growsMoreThanEats === true && foodRecord.band !== 'famine')
);

/** @param {unknown} label */
export const isFoodSurplusGood = (label) => FOOD_SURPLUS_GOODS.has(String(label).replace(TRADE_SUFFIX, '').toLowerCase());

/**
 * The goods a place may offer, read against its food record.
 * @template T
 * @param {T[]} goods
 * @param {{ growsMoreThanEats?: boolean, band?: string } | null | undefined} foodRecord
 * @returns {T[]}
 */
export const goodsHeldByFoodRecord = (goods, foodRecord) => (
  offersFoodSurplus(foodRecord) ? goods : goods.filter((good) => !isFoodSurplusGood(good))
);
