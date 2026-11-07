/**
 * domain/facts/storesMonths.js — THE STORES-MONTHS HOME (CENSUS-1 wave 0, fact 2; the design's
 * §1 row "stores in months / granary", Appendix A competing reading 5).
 *
 * THE DRIFT IT RETIRES. The food writer (`foodGenerator.js :: generateFoodSecurity`) put the
 * months in store in TWO homes, `foodSecurity.storageMonths` and
 * `foodSecurity.foodRecord.storageMonths` — equal at birth (585 of 585 births measured,
 * 2026-11-04: the 525 golden configurations and soak1k-0..59) — and every later writer (the
 * pulse's stockpile tick, the war sack's granary transfer, generosity's food deltas, the magic
 * buffer's draw, the grain-sent event) moved only the first. After one tick the Defense tab's
 * endurance line, X-49 and the food-words check read the birth figure while the Defense facts,
 * the food ledger and hook-truth read the live one.
 *
 * ONE WRITER, ONE READER.
 *   `withStoresMonths(foodSecurity, months)` is the only way a writer sets the months: it
 *     writes the food record's figure and its mirror on the food security block together.
 *   `storesMonthsOf(record)` is the only way a reader gets them: the live mirror first (on a
 *     save written before this lane it is the figure the pulse kept current), the food
 *     record's figure when the mirror is absent, null when the record carries neither.
 *
 * Pure: no randomness, no clock; the writer returns a new object and mutates nothing.
 */

/**
 * The months the food security block carries, in its two homes (either may be absent).
 * @typedef {{ storageMonths?: unknown, foodRecord?: { storageMonths?: unknown } | null }} FoodSecurityMonths
 */

/** @param {unknown} v @returns {v is number} */
const isMonths = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * The food security block of a record (a generated settlement, or a sim settlement that
 * carries it at the top level, as `foodLedger` reads it).
 * @param {unknown} record
 * @returns {FoodSecurityMonths | null}
 */
function foodSecurityOf(record) {
  const r = /** @type {{ economicState?: { foodSecurity?: unknown } | null, foodSecurity?: unknown } | null | undefined} */ (record);
  const fs = r?.economicState?.foodSecurity || r?.foodSecurity || null;
  return fs && typeof fs === 'object' ? /** @type {FoodSecurityMonths} */ (fs) : null;
}

/**
 * THE ONE READER: the record's months of food in store, or null when it carries none.
 * @param {unknown} record
 * @returns {number | null}
 */
export function storesMonthsOf(record) {
  const fs = foodSecurityOf(record);
  if (!fs) return null;
  if (isMonths(fs.storageMonths)) return fs.storageMonths;
  const inRecord = fs.foodRecord?.storageMonths;
  return isMonths(inRecord) ? inRecord : null;
}

/**
 * THE ONE WRITER: the food security block with its months set in both homes. A block with no
 * food record gains none.
 * @template {Record<string, any>} T
 * @param {T} foodSecurity
 * @param {number} months
 * @returns {T}
 */
export function withStoresMonths(foodSecurity, months) {
  const foodRecord = foodSecurity?.foodRecord;
  return /** @type {T} */ ({
    ...foodSecurity,
    storageMonths: months,
    ...(foodRecord && typeof foodRecord === 'object' ? { foodRecord: { ...foodRecord, storageMonths: months } } : {}),
  });
}
