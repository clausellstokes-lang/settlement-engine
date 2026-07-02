/**
 * domain/foodLedger.js — the canonical conserved food quantities for a settlement.
 *
 * The conserved-ledger foundation. The food physics already exist — foodGenerator computes them and
 * persists them on `economicState.foodSecurity`. The problem (see docs/P3_CONSERVED_LEDGER.md)
 * is that consumers read them inconsistently: the capacity model keeps a PARALLEL food
 * model, and two substrate derivers read fields foodGenerator never produces
 * (`deficitMonths`/`surplusMonths`) so their food contribution is silently dead.
 *
 * This is the ONE read-point for those conserved quantities. Every food lens — the
 * causal substrate, the capacity model, the dossier — should read `foodLedger(settlement)`
 * and interpret the SAME numbers, instead of re-deriving or reading stale field names.
 *
 * Pure; defensive; returns neutral defaults (with `present: false`) for an
 * un-generated / partial settlement so callers never see undefined.
 */

/**
 * @typedef {Object} FoodLedger
 * @property {number} dailyNeed
 * @property {number} dailyProduction
 * @property {number} foodRatio
 * @property {number} deficitPct
 * @property {number} surplusPct
 * @property {number} storageMonths
 * @property {number} importDependency
 * @property {number} magicSupplement
 * @property {number} resilienceScore
 * @property {boolean} present
 */

/** @type {FoodLedger} */
const NEUTRAL = Object.freeze({
  dailyNeed: 0,
  dailyProduction: 0,
  foodRatio: 1,          // 1.0 = exactly adequate
  deficitPct: 0,         // % of need unmet after imports + magic
  surplusPct: 0,         // % of need produced beyond demand
  storageMonths: 0,      // months of buffer
  importDependency: 0,   // 0..1 fraction of need met by imports
  magicSupplement: 0,    // % of pressure relieved by magic
  resilienceScore: 50,   // 0..100 composite (storage × diversity × adequacy)
  present: false,        // true once a real foodSecurity object backed it
});

/** @param {any} v @returns {boolean} */
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
/** @param {any} v @param {number} d @returns {number} */
const num = (v, d) => (isNum(v) ? v : d);

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {FoodLedger}
 */
export function foodLedger(settlement) {
  const fs = settlement?.economicState?.foodSecurity || settlement?.foodSecurity || null;
  if (!fs || typeof fs !== 'object') return NEUTRAL;
  return {
    dailyNeed:        num(fs.dailyNeed, 0),
    dailyProduction:  num(fs.dailyProduction, 0),
    foodRatio:        num(fs.foodRatio, 1),
    deficitPct:       num(fs.deficitPct, 0),
    surplusPct:       num(fs.surplusPct, 0),
    storageMonths:    num(fs.storageMonths, 0),
    importDependency: num(fs.importDependency, 0),
    magicSupplement:  num(fs.magicSupplement, 0),
    resilienceScore:  num(fs.resilienceScore, 50),
    present: true,
  };
}
