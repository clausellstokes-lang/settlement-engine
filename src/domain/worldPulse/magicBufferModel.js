/**
 * domain/worldPulse/magicBufferModel.js — W-K slice K3: THE DISASTER BUFFER,
 * model half (binding law docs/DESIGN_MAGIC_ECONOMY.md §5, and constitutional
 * law 5 DAMAGE TRANSMUTES, NEVER VANISHES).
 *
 * §5 in one line: `mitigation = economy_term + magic_term × gate`, both terms
 * BANDED, the sum CEILING-CAPPED, and the mitigation CONVERTS damage rather than
 * deleting it. This leaf owns that arithmetic and nothing else. It is pure and
 * numeric: it never sees a settlement, a roster, a world, or a name. The
 * settlement-shaped half (which stocks exist, what they are called, what the
 * receipt says) lives in magicBufferApply.js.
 *
 * ── THE FIVE THINGS THE ARITHMETIC HAS TO GET RIGHT ─────────────────────────
 *
 * 1. THE GATE IS NOT DERIVED HERE (law 3, ONE GATE FORMULA). `gate01` arrives as
 *    a number in 0..1 and is used exactly as given. §4 defines it as
 *    `regimeBand(economy)` and slice K2 is its single writer; a second derivation
 *    in this file would be a fork of the one formula the design forbids forking.
 *    A caller with no gate passes 0, which is not a fallback guess but the honest
 *    reading: a settlement whose regime is unknown can exploit nothing, so the
 *    magic term is zero and the economy term stands alone.
 *
 * 2. THE GATING ASYMMETRY IS THE POINT, NOT A SIDE EFFECT. Because the magic term
 *    is MULTIPLIED by the gate and the economy term is not, a high-magic pauper
 *    mitigates almost exactly like a mundane pauper: their gates are both near
 *    zero, so both are left with the same economy term. That is the amendment's
 *    central claim, and it is a property of the SHAPE of this expression rather
 *    than of any constant in it. Magic eats materials.
 *
 * 3. THE CEILING IS A HARD CAP ON THE SUM, NOT ON EACH TERM. ECONOMY_TERM_MAX +
 *    MAGIC_TERM_MAX deliberately EXCEEDS MITIGATION_CEILING, so the cap BINDS at
 *    the top of both axes. Without that overhang the ceiling would be decorative:
 *    it would only ever be approached, never reached, and no test could tell a
 *    real cap from an accident of the addends. Tail risk therefore survives at
 *    every wealth level by construction, not by tuning.
 *
 * 4. NOTHING IS MITIGATED THAT IS NOT PAID FOR (law 5). Relief is denominated in
 *    RELIEF UNITS, the settlement's stocks are priced in the same unit, and
 *    `affordableRelief` walks the mitigation DOWN until the bill fits the stocks.
 *    A settlement with empty granaries and a spent reserve mitigates nothing at
 *    all, however rich its regime looks on paper. That is the strongest available
 *    form of "damage transmutes, never vanishes": the conversion cannot run on
 *    credit.
 *
 * 5. A DRAWN BUFFER IS A WEAKER BUFFER (§5, THE SECOND-SHOCK WINDOW). The capped
 *    sum is scaled by `charge01`, the ward reserve, which the payment draws down
 *    and `recoverCharge01` refills on BANDED DWELLS keyed to the economy. A poor
 *    realm refills over roughly twenty years and a rich one over five, so the
 *    vulnerability window outlasts the calamity cooldown for the poor and closes
 *    inside it for the rich. That asymmetry is designed, and it is the second
 *    place in this file where poverty compounds rather than merely persists.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation, no store.
 * Every export is a function of its arguments alone, so the buffer consumes ZERO
 * draws and cannot perturb the calamity stream even when lit.
 *
 * @enforced-by tests/domain/magicBufferModel.test.js,
 *   tests/domain/magicBufferIntegration.test.js
 */

import { clamp01 } from '../../kernel/math.js';

/** @param {unknown} value @param {number} fallback @returns {number} */
const num = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

/** Round to three decimals, the estate's combineSeverities precision. @param {number} v */
const r3 = (v) => Number(num(v, 0).toFixed(3));

/**
 * TUNING (§11 names "buffer terms + ceiling + recovery dwells" as this lane's
 * entries). Every value is PROPOSED and soak-vetoable per the R-15 shape.
 *
 * UNLIKE K1's severity table, NONE of these can be lifted from an existing
 * producer, because no layer in the estate mitigates a disaster today. They are
 * therefore argued rather than inherited, and the argument is written beside each
 * one so a soak can veto the reasoning and not just the digit.
 */
export const MAGIC_BUFFER_TUNING = Object.freeze({
  /**
   * How many rungs a term is banded into (law 4: "continuous banded gradation").
   * Five rungs put the band edges at 0.2 intervals of the underlying axis, which
   * is coarse enough that a one-point prosperity wobble cannot move the mitigation
   * and fine enough that the ordering envelope has something to order.
   */
  BANDS: 5,
  /**
   * The wealthiest settlement's own material term. Stone walls, deep granaries and
   * a treasury that can hire every mason in the province blunt roughly a sixth of a
   * calamity. Deliberately the SMALLER of the two terms: the design's thesis is that
   * exploited magic outperforms bare wealth, and inverting these would quietly
   * invert the thesis.
   */
  ECONOMY_TERM_MAX: 0.18,
  /**
   * The fully exploited magic term, reached only at the top of BOTH the magic axis
   * and the gate. Larger than the economy term because §5 makes the wards the
   * strongest single answer to a disaster, and smaller than the ceiling because no
   * single term may reach the cap alone.
   */
  MAGIC_TERM_MAX: 0.30,
  /**
   * THE HARD CAP ON THE SUM. 0.18 + 0.30 = 0.48 overshoots it by 0.08, so the cap
   * genuinely binds at the summit rather than being approached asymptotically. The
   * richest, most magical, top-regime city on the best day of its life still eats
   * sixty percent of every calamity that finds it.
   */
  MITIGATION_CEILING: 0.40,
  /**
   * THE RELIEF UNIT EXCHANGE. One institution kept standing is one relief unit; one
   * hundred people neither killed nor driven out is also one relief unit. The rate
   * is an accounting convention, not a claim about worth, and it exists so that the
   * conservation pin can compare a saved building against a saved crowd in a single
   * honest sum.
   */
  PEOPLE_PER_UNIT: 100,
  /**
   * WHAT A RELIEF UNIT COSTS, in each named stock. A quarter of a month of stored
   * food, or eight percent of the ward reserve. The granary is priced cheaper
   * because it is the stock a settlement can actually refill from a harvest, and
   * the reserve dearer because refilling it is the slow dwell of §5.
   */
  STORES_MONTHS_PER_UNIT: 0.25,
  WARD_CHARGE_PER_UNIT: 0.08,
  /**
   * The resolution of the affordability descent. The search walks the mitigation
   * down from what the regime WOULD buy to what the stocks can actually pay for; a
   * hundred steps make the answer stable to a percent of the demand, which is finer
   * than the banded terms that produced the demand in the first place.
   */
  AFFORDABILITY_STEPS: 100,
  /**
   * THE BANDED DWELL (§5: "a drawn-down buffer recovers on banded dwells"). The
   * fraction of the ward reserve that returns per year, banded by the economy. At
   * the floor a full reserve takes twenty years to come back, which is longer than
   * calamity's eight-year cooldown, so a poor settlement can be struck a second time
   * while still spent. At the ceiling it takes five, which closes inside the cooldown.
   * The second-shock window is therefore a POVERTY window, which is the design's
   * intent stated as a number.
   */
  RECOVERY_PER_YEAR_MIN: 0.05,
  RECOVERY_PER_YEAR_MAX: 0.20,
  /**
   * REPAIR ACCELERATION (§5: "repair acceleration follows the same shape after the
   * event"). Expressed as a MULTIPLE of the mitigation shape rather than as its own
   * expression, which is what makes "the same shape" a literal, testable claim
   * instead of a resemblance. Above one because rebuilding is where a magical
   * economy shows its advantage most plainly, and because the reserve it draws on
   * has already been spent down by the strike itself.
   */
  REPAIR_SHAPE_MULTIPLE: 1.5,
});

/**
 * THE BAND (law 4). Quantize a 0..1 axis into MAGIC_BUFFER_TUNING.BANDS rungs and
 * answer the rung's own 0..1 value, so the top rung is exactly 1 and the bottom
 * exactly 0. Floor rather than round, so a settlement never gets credit for a band
 * it has not actually reached.
 *
 * @param {number} axis01
 * @returns {number} the rung value in 0..1
 */
export function bandOf(axis01) {
  const bands = MAGIC_BUFFER_TUNING.BANDS;
  const index = Math.min(bands - 1, Math.floor(clamp01(num(axis01, 0)) * bands));
  return index / (bands - 1);
}

/**
 * @typedef {Object} BufferAxes
 * @property {number} economy01  the settlement's own wealth, 0..1
 * @property {number} magic01    the settlement's magic investment, 0..1
 * @property {number} gate01     THE EXPLOITATION GATE (§4), 0..1. Slice K2's
 *   `regimeBand(economy)` and nothing else; 0 when no regime is known.
 * @property {number} charge01   the ward reserve remaining, 0..1
 */

/**
 * THE ECONOMY TERM. Banded wealth, ungated: a settlement's own stone and coin work
 * whether or not it has a magical regime to speak of.
 * @param {number} economy01
 * @returns {number}
 */
export function economyTerm(economy01) {
  return MAGIC_BUFFER_TUNING.ECONOMY_TERM_MAX * bandOf(economy01);
}

/**
 * THE MAGIC TERM, BEFORE THE GATE. Banded magic on its own is only a potential;
 * §5 multiplies it by the gate at the call site below, and this function exists
 * separately so a receipt can name the potential the regime failed to unlock.
 * @param {number} magic01
 * @returns {number}
 */
export function magicTerm(magic01) {
  return MAGIC_BUFFER_TUNING.MAGIC_TERM_MAX * bandOf(magic01);
}

/**
 * THE MITIGATION §5 WOULD BUY, before anyone checks whether it can be paid for.
 *
 *   min(CEILING, economy_term + magic_term × gate) × charge
 *
 * The cap is applied to the SUM and the charge scales what survives the cap, in
 * that order: the ceiling is a statement about how much a disaster can ever be
 * blunted, and the charge is a statement about how much of that capacity is left
 * in hand today. Reversing them would let a fully drawn buffer creep back up to
 * the cap, which would erase the second-shock window.
 *
 * @param {BufferAxes} axes
 * @returns {number} 0..1
 */
export function mitigationDemand01({ economy01, magic01, gate01, charge01 }) {
  const raw = economyTerm(economy01) + magicTerm(magic01) * clamp01(num(gate01, 0));
  const capped = Math.min(MAGIC_BUFFER_TUNING.MITIGATION_CEILING, raw);
  return clamp01(capped * clamp01(num(charge01, 0)));
}

/**
 * @typedef {Object} StrikeLoss
 * @property {number} institutions  how many institutions the strike would fell
 * @property {number} deaths        how many it would kill
 * @property {number} exodus        how many it would drive out
 */

/**
 * @typedef {Object} StrikeConversion
 * @property {number} institutionsSpared
 * @property {number} deathsAvoided
 * @property {number} exodusAvoided
 */

/**
 * CONVERT one strike at a given mitigation. The institution count FLOORS, which is
 * why a one-institution strike survives even a strong buffer: §5's tail risk is not
 * only a ceiling on the fraction, it is also the arithmetic of small numbers. The
 * population terms round, because a person is not a building and a half-saved crowd
 * is not a meaningful quantity.
 *
 * @param {{ mitigation01: number, loss: StrikeLoss }} input
 * @returns {StrikeConversion}
 */
export function convertStrike({ mitigation01, loss }) {
  const m = clamp01(num(mitigation01, 0));
  const institutions = Math.max(0, Math.trunc(num(loss?.institutions, 0)));
  const deaths = Math.max(0, Math.trunc(num(loss?.deaths, 0)));
  const exodus = Math.max(0, Math.trunc(num(loss?.exodus, 0)));
  return {
    institutionsSpared: Math.floor(m * institutions),
    deathsAvoided: Math.round(m * deaths),
    exodusAvoided: Math.round(m * exodus),
  };
}

/**
 * PRICE a conversion in relief units, the one currency in which a saved building
 * and a saved crowd are commensurable.
 * @param {StrikeConversion} conversion
 * @returns {number}
 */
export function reliefUnitsFor(conversion) {
  const people = Math.max(0, num(conversion?.deathsAvoided, 0))
    + Math.max(0, num(conversion?.exodusAvoided, 0));
  const institutions = Math.max(0, num(conversion?.institutionsSpared, 0));
  return r3(institutions + people / MAGIC_BUFFER_TUNING.PEOPLE_PER_UNIT);
}

/**
 * @typedef {Object} BufferStocks
 * @property {number} storesMonths  months of food in the granary
 * @property {number} charge01      the ward reserve remaining, 0..1
 */

/**
 * HOW MANY RELIEF UNITS THE NAMED STOCKS CAN COVER. The two stocks are additive
 * because they are spent in sequence, not in proportion.
 * @param {BufferStocks} stocks
 * @returns {number}
 */
export function payableUnits(stocks) {
  const T = MAGIC_BUFFER_TUNING;
  const stores = Math.max(0, num(stocks?.storesMonths, 0)) / T.STORES_MONTHS_PER_UNIT;
  const wards = clamp01(num(stocks?.charge01, 0)) / T.WARD_CHARGE_PER_UNIT;
  return r3(stores + wards);
}

/**
 * @typedef {Object} BufferPayment
 * @property {number} storesUnits      relief units billed to the granary
 * @property {number} wardUnits        relief units billed to the reserve
 * @property {number} storesMonthsDrawn
 * @property {number} chargeDrawn01
 */

/**
 * BILL a settled relief total to the named stocks, GRANARY FIRST. The order is the
 * receipt's order and it is deliberate: the granary is the stock a harvest refills,
 * so spending it first leaves the slow stock intact wherever the fast one suffices.
 *
 * Conservation is exact by construction: `storesUnits + wardUnits` equals the input
 * total, because the ward share is defined as the remainder rather than computed
 * from a second rate. Callers must pass a total that `payableUnits` already covers
 * (`affordableRelief` guarantees this); a total beyond the stocks would overdraw the
 * reserve, and the caller-side pin says so.
 *
 * @param {{ reliefUnits: number, stocks: BufferStocks }} input
 * @returns {BufferPayment}
 */
export function billRelief({ reliefUnits, stocks }) {
  const T = MAGIC_BUFFER_TUNING;
  const total = Math.max(0, num(reliefUnits, 0));
  const storesMonths = Math.max(0, num(stocks?.storesMonths, 0));
  const charge01 = clamp01(num(stocks?.charge01, 0));
  const storesCapacity = storesMonths / T.STORES_MONTHS_PER_UNIT;
  const storesUnits = Math.min(total, storesCapacity);
  const wardUnits = total - storesUnits;
  // THE DRAWN QUANTITIES ARE CLAMPED TO THE STOCKS, and the clamp is load-bearing
  // rather than defensive. In exact arithmetic `storesUnits × rate` can never exceed
  // `storesMonths`, because storesUnits is bounded by that same quotient. The
  // three-decimal rounding can, and does: a granary holding 0.2268 months was billed
  // 0.227, a two-ten-thousandth overdraw that is nonetheless the world spending what it
  // does not have, which is precisely what law 5 forbids. Caught by the conservation
  // sweep in tests/domain/magicBufferModel.test.js, case 15 of 96.
  return {
    storesUnits: r3(storesUnits),
    wardUnits: r3(wardUnits),
    storesMonthsDrawn: Math.min(storesMonths, r3(storesUnits * T.STORES_MONTHS_PER_UNIT)),
    chargeDrawn01: Math.min(charge01, r3(wardUnits * T.WARD_CHARGE_PER_UNIT)),
  };
}

/**
 * @typedef {Object} BufferRelief
 * @property {number} demand01     what the regime and the reserve WOULD have bought
 * @property {number} mitigation01 what the stocks could actually pay for
 * @property {number} reliefUnits  the settled total, in relief units
 * @property {number} capacityUnits the stocks' ceiling, for the receipt
 * @property {boolean} rationed    true when affordability bound the mitigation
 * @property {StrikeConversion} conversion
 * @property {BufferPayment} payment
 */

/**
 * THE WHOLE §5 ANSWER FOR ONE STRIKE: what is absorbed, and what it costs.
 *
 * The affordability descent is a DOWNWARD scan rather than a division because the
 * conversion is not linear: the institution term floors and the population terms
 * round, so scaling the mitigation by a ratio does not scale the bill by that
 * ratio, and a naive division can leave a settlement billed past its stocks. The
 * scan walks from the full demand down to zero and takes the FIRST affordable rung,
 * which is the largest one; it terminates at worst at zero, where the bill is zero
 * and every stock covers it. Bounded, deterministic, and exact.
 *
 * @param {{ axes: BufferAxes, loss: StrikeLoss, stocks: BufferStocks }} input
 * @returns {BufferRelief}
 */
export function affordableRelief({ axes, loss, stocks }) {
  const T = MAGIC_BUFFER_TUNING;
  const demand01 = mitigationDemand01({
    economy01: num(axes?.economy01, 0),
    magic01: num(axes?.magic01, 0),
    gate01: num(axes?.gate01, 0),
    charge01: num(stocks?.charge01, 0),
  });
  const capacityUnits = payableUnits(stocks);
  for (let step = T.AFFORDABILITY_STEPS; step >= 0; step -= 1) {
    const mitigation01 = demand01 * (step / T.AFFORDABILITY_STEPS);
    const conversion = convertStrike({ mitigation01, loss });
    const reliefUnits = reliefUnitsFor(conversion);
    if (reliefUnits > capacityUnits) continue;
    return {
      // UNROUNDED, deliberately. Rounding the demand to three decimals let a receipt
      // report `demand 0` beside `rationed true`, which reads as nonsense to the DM and
      // made the two fields disagree about whether the regime promised anything at all.
      // Presentation rounding belongs at the receipt boundary (bufferReceipt), not on a
      // value the rest of the model compares against.
      demand01,
      mitigation01,
      reliefUnits,
      capacityUnits,
      rationed: step < T.AFFORDABILITY_STEPS,
      conversion,
      payment: billRelief({ reliefUnits, stocks }),
    };
  }
  // Unreachable: step 0 converts nothing, bills nothing, and zero is payable from
  // any stock including an empty one. Kept as an explicit total answer rather than
  // a throw, because a disaster resolver must never be the thing that fails.
  return {
    demand01: r3(demand01),
    mitigation01: 0,
    reliefUnits: 0,
    capacityUnits,
    rationed: true,
    conversion: { institutionsSpared: 0, deathsAvoided: 0, exodusAvoided: 0 },
    payment: { storesUnits: 0, wardUnits: 0, storesMonthsDrawn: 0, chargeDrawn01: 0 },
  };
}

/**
 * THE BANDED DWELL (§5). Refill the ward reserve over a span of years at a rate
 * banded by the economy. Pure in the years, so a caller that skipped ticks recovers
 * the same amount as one that did not.
 *
 * @param {{ charge01: number, economy01: number, years: number }} input
 * @returns {number} 0..1
 */
export function recoverCharge01({ charge01, economy01, years }) {
  const T = MAGIC_BUFFER_TUNING;
  const perYear = T.RECOVERY_PER_YEAR_MIN
    + (T.RECOVERY_PER_YEAR_MAX - T.RECOVERY_PER_YEAR_MIN) * bandOf(economy01);
  const elapsed = Math.max(0, num(years, 0));
  return r3(clamp01(clamp01(num(charge01, 0)) + perYear * elapsed));
}

/**
 * THE YEARS a fully spent reserve needs to come back at this economy. Reported so
 * a receipt and a soak can both name the second-shock window in years rather than
 * inferring it from a rate.
 * @param {number} economy01
 * @returns {number}
 */
export function fullRechargeYears(economy01) {
  const T = MAGIC_BUFFER_TUNING;
  const perYear = T.RECOVERY_PER_YEAR_MIN
    + (T.RECOVERY_PER_YEAR_MAX - T.RECOVERY_PER_YEAR_MIN) * bandOf(economy01);
  return r3(1 / perYear);
}

/**
 * REPAIR ACCELERATION (§5). Literally the mitigation shape times a constant, so
 * "follows the same shape" is a checkable identity rather than a family resemblance.
 * Read at the charge REMAINING after the strike has been paid for, because a realm
 * that spent its reserve holding the wards has less left over for the rebuilding.
 *
 * NO CONSUMER IN THIS SLICE, DELIBERATELY, and recorded here so a later reader does
 * not re-find it as a gap: nothing in the estate carries a repair CLOCK for a
 * calamity-felled institution today, so there is no duration for this factor to
 * shorten. K1's `damage` cause lifts when its cause resolves rather than on a timer,
 * and the reconstruction path (upswingKernel) is another slice's ownership. The
 * factor is emitted on the receipt so the number exists and is pinned to the shape;
 * wiring it belongs to whichever slice first gives a repair a duration.
 *
 * @param {BufferAxes} axes  read with the POST-payment charge
 * @returns {number}
 */
export function repairAcceleration01(axes) {
  return r3(mitigationDemand01(axes) * MAGIC_BUFFER_TUNING.REPAIR_SHAPE_MULTIPLE);
}

/**
 * THE RECEIPT SENTENCE (§5: receipts read like "the wards held; the granaries
 * paid"). Total over the payment shapes, and honest in each: it names only the
 * stocks that were actually drawn, and answers null when nothing was absorbed so a
 * surface cannot print a boast about a buffer that did nothing.
 *
 * @param {BufferRelief|null|undefined} relief
 * @returns {string|null}
 */
export function bufferReceiptLine(relief) {
  if (!relief || relief.reliefUnits <= 0) return null;
  const stores = num(relief.payment?.storesMonthsDrawn, 0) > 0;
  const wards = num(relief.payment?.chargeDrawn01, 0) > 0;
  const held = relief.conversion.institutionsSpared > 0
    ? 'The wards held over what they could reach'
    : 'The wards blunted the worst of it';
  if (stores && wards) {
    return `${held}; the granaries paid, and the reserve is spent down behind them.`;
  }
  if (stores) return `${held}; the granaries paid for it.`;
  if (wards) return `${held}, and the reserve paid for it alone.`;
  return `${held}, and it cost nothing anyone can name.`;
}

/**
 * THE UNRATIONED-DEMAND NOTE. When affordability bound the mitigation, the
 * settlement had a regime that promised more than its stocks could buy, which is
 * the §5 conversion law biting in public. Answers null when nothing was rationed.
 * @param {BufferRelief|null|undefined} relief
 * @returns {string|null}
 */
export function bufferShortfallLine(relief) {
  if (!relief || !relief.rationed) return null;
  if (relief.reliefUnits <= 0) {
    return 'The wards had nothing behind them: no stores to spend and no reserve to call on.';
  }
  return 'The wards reached further than the stores could pay for, and stopped where the coin stopped.';
}

/**
 * THE GATE CONTRACT, stated once so a consumer never has to guess. Exported as data
 * rather than prose so a test can assert the bounds a caller must respect.
 *
 * K2 (`magicRegimeModel`) is the single writer of the value this describes; K3 is a
 * READER and holds no opinion about how a regime becomes a number.
 */
export const EXPLOITATION_GATE_CONTRACT = Object.freeze({
  key: 'gate01',
  min: 0,
  max: 1,
  owner: 'K2',
  meaning: 'regimeBand(economy) per design section 4, the ONE gate formula every consumer reads',
  absent: 0,
  absentMeaning: 'no regime is known, so nothing can be exploited and the magic term is zero',
});
