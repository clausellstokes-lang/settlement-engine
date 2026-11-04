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

/**
 * THE STARVING RULE (lane F3 FOOD-WORDS, 2026-11-04; docs/SOAK_1000_RUNG1B_2026-11-04.md §5 F3).
 * A line that says people are starving is a claim on the food record: it holds only where the
 * band is deficit or famine. A place that grows less than it eats but whose imports and stores
 * cover the gap (importDependent, pressured) is short of its own food, not starving. Read by the
 * stress-secret pool (npcGenerator.js :: generateCrimeLevel) and by the food-words instrument
 * (domain/coherence/foodWordsFindings.js). A missing record keeps the legacy behaviour.
 */
export const CLAIMS_STARVING = /\bstarving\b/i;

/** @param {{ band?: string } | null | undefined} foodRecord */
export const recordAllowsStarving = (foodRecord) => (
  !foodRecord || foodRecord.band === 'deficit' || foodRecord.band === 'famine'
);

/**
 * The stress secrets a place may draw, read against its food record: a secret or stakes line
 * that says people are starving is dropped where the record does not go hungry. Draw-neutral —
 * the caller picks once from whatever remains.
 * @template {{ secret: string, stakes: string }} T
 * @param {T[]} effects
 * @param {{ band?: string } | null | undefined} foodRecord
 * @returns {T[]}
 */
export const secretsHeldByFoodRecord = (effects, foodRecord) => (
  recordAllowsStarving(foodRecord) ? effects : effects.filter((e) => !CLAIMS_STARVING.test(`${e.secret} ${e.stakes}`))
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
