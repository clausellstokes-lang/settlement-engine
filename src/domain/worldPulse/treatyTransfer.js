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

/** THE ONE SPELLING OF THE RESERVE FLOOR: the payer's stock above it, less what this tick's
 *  earlier installments already reserved. Both draws below read it, so the floor cannot drift.
 *  @param {TransferSettlement | null | undefined} payer @param {unknown} committedDebit @returns {number} */
function spareableMonthsOf(payer, committedDebit) {
  const owed = Math.max(0, Number(committedDebit) || 0);
  return Math.max(0, monthsOf(payer) - TREATY_TRANSFER_TUNING.RESERVE_MONTHS - owed);
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
  const held = Math.max(0, Number(committedCredit) || 0);
  const spareable = spareableMonthsOf(payer, committedDebit);
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
 * ONE STREAM INSTALLMENT, ITS REMAINDER CARRIED ON THE CLAUSE (FPQ-75). The treaty's OWN
 * installment path: `peaceTerms.js` PASS 2 is its only caller. The coalition settlement's lump
 * draws keep calling `computeTreatyGrainDraw` directly, and the conserved sink beneath both
 * (`foodStockpile.js :: computeSackFoodTransfer`) is untouched.
 *
 * WHY. A stream's magnitude is its nominal YEARLY share of the payer's spareable stock, so one
 * installment on the current 52-tick clock asks for a fifty-second of it: a 0.5 share of 4.5
 * spareable months is 0.043 months a week. The sink moves grain in tenth-months and FLOORS every
 * request (its conservation law: the source is never over-drained), so that request moved
 * nothing, every week, for the clause's whole span. MEASURED (the PACT-COMPLIANCE report in the
 * FP kit): 0 of 9,309 pact stream clause-ticks moved grain on the eight brief worlds (the largest
 * weekly ask was 0.0192 months), and 0 of 156 war-door stream ticks in the war door's probe. The
 * floor is the sink's law; dropping the residue every week was this path's defect, and the war
 * door shared it.
 *
 * THE CURE. What a clause owes accrues on the clause (`installmentCarryMonths`, payer
 * storage-months owed and not yet moved) and is drawn whole tenth-months at a time, never past
 * the reserve floor, in a lot the obligee can receive (below); the remainder carries to the next
 * installment. So a clause delivers its catalogue magnitude over its span, short only by its last
 * lot, and nothing is minted: every month that moves still moves through the sink.
 *
 * WHAT DOES NOT ACCRUE (each is today's "nothing moves", kept): no installment due this tick (a
 * court with no capacity left delivers nothing, and what it already owed waits); a payer at or
 * under its reserve floor; a pair whose granaries cannot trade at all (either side without a
 * food model or without people), which would otherwise pile up a lump the clause could never
 * deliver week by week. In each case the carry is returned exactly as it came in.
 *
 * THE DRAW LANDS ON THE TENTH IT MEANS. The sink computes `floor(fraction × spareable × 10)`, and
 * asking for exactly `k / 10` months can land one tenth short on a float (2.9999…); asking for the
 * MIDDLE of the k-th tenth, `(2k + 1) / 20` months, lands on `k / 10` exactly, and the floor still
 * guarantees no more than the owed months ever leave the granary. Whatever moves is subtracted
 * from what was owed, so any shortfall is carried rather than lost.
 *
 * @param {{ carriedMonths?: unknown, payer?: TransferSettlement | null, payee?: TransferSettlement | null,
 *           takeFraction?: number, committedDebit?: number, committedCredit?: number }} args
 * @returns {{ draw: { lostMonths: number, gainedMonths: number } | null, carriedMonths: number }}
 */
export function drawStreamInstallment({ carriedMonths = 0, payer, payee, takeFraction = 0, committedDebit = 0, committedCredit = 0 } = {}) {
  const carried = Math.max(0, Number(carriedMonths) || 0);
  const fraction = Number(takeFraction);
  const spareable = spareableMonthsOf(payer, committedDebit);
  const canTrade = Number.isFinite(Number(payer?.economicState?.foodSecurity?.storageMonths))
    && Number.isFinite(Number(payee?.economicState?.foodSecurity?.storageMonths))
    && popOf(payer) > 0 && popOf(payee) > 0;
  if (!(fraction > 0) || !(spareable > 0) || !canTrade) return { draw: null, carriedMonths: carried };
  const owed = carried + fraction * spareable;
  const tenths = Math.floor(Math.min(owed, spareable) * 10);
  if (tenths < 1) return { draw: null, carriedMonths: owed };
  const draw = computeTreatyGrainDraw({ payer, payee, takeFraction: (2 * tenths + 1) / 20 / spareable, committedDebit, committedCredit });
  if (draw && !(draw.gainedMonths > 0)) {
    // THE LOT THE OBLIGEE CAN RECEIVE. The sink floors the CREDIT in the obligee's own months
    // too, so between two courts of a size a tenth-month lot spoils whole on the road (0.06 of
    // a month floors to nothing) and the clause would drain one granary to fill none. If the
    // payer's whole spareable stock WOULD reach the obligee, the owed months wait for a lot
    // that does. If even that would not (a village paying a metropolis, or a granary already
    // full), the lot moves as it is: that trickle is the road's honest physics, unchanged.
    const whole = computeTreatyGrainDraw({ payer, payee, takeFraction: 1, committedDebit, committedCredit });
    if (whole && whole.gainedMonths > 0) return { draw: null, carriedMonths: owed };
  }
  return { draw, carriedMonths: Math.max(0, owed - (draw ? draw.lostMonths : 0)) };
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
