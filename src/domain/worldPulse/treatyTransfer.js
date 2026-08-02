/**
 * domain/worldPulse/treatyTransfer.js — TRIBUTE THAT ACTUALLY MOVES (the peace
 * engine's material executor).
 *
 * The four STREAM terms (tribute · reparations · restitution · resource_share) were
 * declared as `executor: 'transfer'` and executed as bookkeeping: each tick they added
 * an abstract number to `deliveredToVictor` / `extractedFromLoser` and moved no stock
 * in the world. Nothing read those counters, so a dictated peace changed nothing a
 * settlement could feel. This module is the channel that makes them bite.
 *
 * THE DENOMINATION, and why it is grain (a recorded judgment — DESIGN_PEACE_ENGINE
 * §11's prose says "coin", the engine has none):
 *   - There is NO treasury and NO conserved-coin primitive anywhere in the estate. The
 *     only `treasury` in src/domain is faction-scale flavour prose plus the factions'
 *     0..100 `wealth` SCORE, which is an opinion about a faction, not a stock that can
 *     be moved without minting. generosityEV.js records the standing ruling verbatim:
 *     payment is "a prosperity BAND-STEP debit ... (the sim's prosperity vocabulary —
 *     NO conserved-coin primitive, per the f3cf639e ruling X/Z)".
 *   - `economicState.foodSecurity.storageMonths` IS a conserved, tick-advanced material
 *     stock, and it already owns a proven SINK-ONLY transfer primitive:
 *     foodStockpile.computeSackFoodTransfer, whose contract is that the recipient's
 *     gain in ABSOLUTE food can never exceed the payer's loss (both floors, never
 *     rounds, so rounding can only under-credit).
 *   - That primitive already has a SECOND, non-violent consumer: the generosity
 *     engine's gift and market lanes call it with gentler fractions, and its own
 *     docstring names the case — "a gentler pair models a voluntary levy (F2) drawing
 *     grain from a willing vassal". A tribute stream IS that levy, taken rather than
 *     offered. So this is the primitive's declared third use, not a fork of it.
 *   - The granary already has five writers (fieldManifest FROZEN-VS-LIVE names
 *     advanceFoodStockpile as the pulse writer for the whole foodSecurity family), so
 *     this module does NOT become a sixth: it emits DELTAS and hands them to
 *     generosityUpdates.applyFoodDeltasToUpdates, the existing single applicator that
 *     clamps to the granary capacity and rounds to the tenth-month.
 *
 * THE RESERVE FLOOR. A treaty may impoverish a court; it may not starve it out of
 * existence, and a levy that drove storageMonths to zero would collide with the food
 * engine's own drawdown/tithe hysteresis. So the levy draws ONLY from the payer's
 * stock ABOVE a reserve floor — the generosity engine's `spareableMonths` discipline,
 * with the floor set to mobilization's own untenable-war-footing threshold. A payer at
 * or under the floor delivers NOTHING, which is exactly the §12 default the compliance
 * machinery is watching for.
 *
 * PURE + DETERMINISTIC: no rng, no wall clock, no mutation (every applicator returns a
 * new array or the input unchanged). Lazy leaf — imported only by the (lazy) peace
 * mover, so it adds zero eager first-paint bytes.
 */

import { computeSackFoodTransfer, storageCapacityMonths } from './foodStockpile.js';
import { applyFoodDeltasToUpdates } from './generosityUpdates.js';

export const TREATY_TRANSFER_TUNING = Object.freeze({
  /** The payer's untouchable granary reserve, in storage-months. Mirrors
   *  MOBILIZATION_TUNING.COOL_FOOD_MONTHS_FLOOR (1.5): below that a settlement cannot
   *  hold a war footing at all, and a peace term that pushed a court past it would be
   *  extracting from a famine rather than from a surplus. */
  RESERVE_MONTHS: 1.5,
  /** The share of a levied load that reaches the victor's own granary; the remainder
   *  spoils on the road. Strictly < 1 so the channel is a SINK: absolute food is
   *  reduced by the transfer, never created. Matches the sack path's capture band. */
  CAPTURE: 0.6,
});

/** @typedef {{ population?: unknown, economicState?: { foodSecurity?: { storageMonths?: unknown } } }} TransferSettlement */

/** @param {TransferSettlement | null | undefined} s @returns {number} */
function monthsOf(s) {
  const m = Number(s?.economicState?.foodSecurity?.storageMonths);
  return Number.isFinite(m) ? Math.max(0, m) : 0;
}

/** @param {TransferSettlement | null | undefined} s @returns {number} */
function popOf(s) {
  const p = Number(s?.population);
  return Number.isFinite(p) ? Math.max(0, p) : 0;
}

/**
 * The conserved granary draw ONE stream installment takes, in storage-months. The payer
 * loses `takeFraction` of its SPAREABLE stock (everything above the reserve floor); the
 * payee gains the captured share re-expressed in its own months and capped at its own
 * granary headroom. Null when nothing moves — no ledger, no population, a payer at or
 * under the reserve floor, or a draw that floors to zero at the tenth-month.
 *
 * Conservation is inherited whole from computeSackFoodTransfer: `gained × payeePop` is
 * always ≤ `lost × payerPop`, because both legs floor rather than round. The absent
 * `foodSecurity` case returns null rather than 0/0, so a settlement with no food model
 * is untouched instead of being handed a fabricated granary.
 *
 * SAME-TICK COMPOSITION: a settlement can owe two victors, or be paid by two losers,
 * within one tick. `committedDebit` / `committedCredit` carry what THIS tick's earlier
 * installments already reserved, so the second draw sees the granary the first one left
 * behind. Without them each term would price against the same untouched stock and the
 * pair could jointly over-drain a payer past its reserve floor — the exact class the
 * generosity mover's `spareableMonths` subtraction already guards against.
 *
 * @param {{ payer?: TransferSettlement | null, payee?: TransferSettlement | null,
 *           takeFraction?: number, committedDebit?: number, committedCredit?: number }} args
 * @returns {{ lostMonths: number, gainedMonths: number } | null}
 */
export function computeTreatyGrainDraw({ payer, payee, takeFraction = 0, committedDebit = 0, committedCredit = 0 } = {}) {
  const fraction = Number(takeFraction);
  if (!(fraction > 0)) return null;
  if (!Number.isFinite(Number(payer?.economicState?.foodSecurity?.storageMonths))) return null;
  if (!Number.isFinite(Number(payee?.economicState?.foodSecurity?.storageMonths))) return null;
  const owed = Math.max(0, Number(committedDebit) || 0);
  const held = Math.max(0, Number(committedCredit) || 0);
  const spareable = Math.max(0, monthsOf(payer) - TREATY_TRANSFER_TUNING.RESERVE_MONTHS - owed);
  if (spareable <= 0) return null;                     // at the floor ⇒ the term defaults, nothing moves
  return computeSackFoodTransfer({
    conqueredStorageMonths: spareable,                 // ONLY the above-floor headroom can be levied
    conqueredPopulation: popOf(payer),
    victorStorageMonths: monthsOf(payee) + held,       // this tick's earlier credits already fill the granary
    victorPopulation: popOf(payee),
    victorCapMonths: storageCapacityMonths(/** @type {Parameters<typeof storageCapacityMonths>[0]} */ (/** @type {unknown} */ (payee))),
    takeFraction: fraction,
    captureFraction: TREATY_TRANSFER_TUNING.CAPTURE,
  });
}

/**
 * Fold the accumulated per-settlement storageMonths deltas onto settlementUpdates
 * through the EXISTING single applicator (generosityUpdates.applyFoodDeltasToUpdates —
 * clamped to the granary capacity, rounded to the tenth-month). Builds the saveId index
 * the applicator wants so the peace mover never has to spell that indexing itself.
 * Empty deltas ⇒ the input array, by reference (the unchanged-tick identity).
 * @param {Array<{ saveId?: unknown }>} settlementUpdates @param {Map<string, number>} foodDeltas
 * @returns {Array<{ saveId?: unknown }>}
 */
export function applyTreatyFoodDeltas(settlementUpdates, foodDeltas) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  if (!foodDeltas || foodDeltas.size === 0) return settlementUpdates;
  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u?.saveId), i));
  return /** @type {Array<{ saveId?: unknown }>} */ (
    applyFoodDeltasToUpdates(/** @type {Parameters<typeof applyFoodDeltasToUpdates>[0]} */ (updates), updateIndex, foodDeltas));
}

/**
 * The FRESHEST settlement for an id: the pending tick update if this tick already wrote
 * one (the food stockpile pass runs long before the peace mover), else the pre-tick
 * snapshot member. Reading the stale snapshot here would let a levy draw grain a siege
 * already ate earlier in the same tick.
 * @param {Array<{ saveId?: unknown, settlement?: unknown }>} settlementUpdates
 * @param {{ byId?: { get?: (id: string) => unknown } } | null | undefined} snapshot
 * @param {string} id
 * @returns {TransferSettlement | null}
 */
export function freshestSettlement(settlementUpdates, snapshot, id) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  for (const u of updates) {
    if (String(u?.saveId) === String(id) && u?.settlement) return /** @type {TransferSettlement} */ (u.settlement);
  }
  const item = /** @type {{ settlement?: unknown } | undefined} */ (snapshot?.byId?.get?.(String(id)));
  return item?.settlement ? /** @type {TransferSettlement} */ (item.settlement) : null;
}
