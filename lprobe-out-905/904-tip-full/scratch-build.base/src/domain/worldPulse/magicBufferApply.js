/**
 * domain/worldPulse/magicBufferApply.js — W-K slice K3: THE DISASTER BUFFER,
 * settlement half (binding law docs/DESIGN_MAGIC_ECONOMY.md §5; law 5 DAMAGE
 * TRANSMUTES, NEVER VANISHES; law 8 DORMANCY + DETERMINISM).
 *
 * The model leaf (magicBufferModel.js) owns the arithmetic and has never heard of
 * a settlement. THIS leaf is where the arithmetic meets the world: it reads the two
 * axes off a real settlement, holds the ward reserve in a conditional world ledger,
 * converts one calamity strike, and DRAWS THE NAMED STOCKS THAT PAID FOR IT.
 *
 * ── THE STOCKS ARE REAL, AND THAT IS THE WHOLE POINT (law 5) ────────────────
 * §5 requires that reduced structural loss be "paid for in named stocks drawn down
 * in the same outcome". Two stocks are named here, and both are things the world
 * already has:
 *
 *   THE GRANARY   `economicState.foodSecurity.storageMonths`, drawn down in months
 *                 through the same clamped, tenth-rounded idiom the generosity
 *                 mover uses (generosityUpdates.applyFoodDeltasToUpdates), so the
 *                 buffer spends food the same way every other layer spends it.
 *   THE RESERVE   the ward charge in this slice's own ledger, which is what makes
 *                 the second-shock window a fact about state rather than a story.
 *
 * REAGENTS ARE DELIBERATELY ABSENT, and this is the honest half. §5 names reagent
 * stocks among the payers and §7 puts them in the goods catalog, but slice K4 owns
 * reagent chains and none exist in the tree today. Pricing a stock that does not
 * exist would be a fabricated ledger entry dressed as conservation, so K3 bills the
 * two stocks the world can actually feel and leaves the third to the slice that
 * mints it. Recorded here so a later reader finds a deferral, not a gap.
 *
 * ── THE GATE IS READ, NEVER DERIVED (law 3) ─────────────────────────────────
 * `gate01` is supplied by the caller and used as given. §4's `regimeBand(economy)`
 * is slice K2's single formula; K3 is a consumer of it. Until K2 publishes its
 * export, callers pass nothing, the gate reads 0, and the buffer runs on its
 * ECONOMY TERM ALONE, which is exactly what §5 says a settlement with no exploitable
 * regime should get. The lane is therefore correct while K2 is in flight rather than
 * approximated, and lighting it is a one-line change at the pulse call site.
 *
 * ── DORMANCY (law 8; §10) ───────────────────────────────────────────────────
 * Everything here is gated on `magicEconomyActive`, K1's single reader of the
 * virtual `magicEconomyEnabled` rule. There is no second spelling of the gate. The
 * ledger nests under the `spatialLedgers` conditional namespace and drops when
 * empty, and a FULL reserve counts as empty: a realm whose buffers have all
 * recovered is byte-identical to a realm that never spent one.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation of inputs, no
 * store. The buffer consumes ZERO draws, so a lit buffer cannot shift the calamity
 * stream by so much as one sample.
 *
 * @enforced-by tests/domain/magicBufferIntegration.test.js,
 *   tests/domain/magicBufferModel.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { magicLedger } from '../magicLedger.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { magicEconomyActive } from './institutionStatusModel.js';
// LAW 3, THE ONE GATE FORMULA. K3 is a CONSUMER of K2's gate and of K2's economy
// reading; it derives neither. Importing the readers rather than the constants is what
// makes that structural: there is no expression in this file that could disagree with
// the regime ladder about how exploitable a settlement's magic is.
import { readMagicRegime, readMagicRegimeRecord } from './magicRegimeModel.js';
import {
  MAGIC_BUFFER_TUNING, affordableRelief, recoverCharge01, repairAcceleration01,
  bufferReceiptLine, bufferShortfallLine,
} from './magicBufferModel.js';

/**
 * The conditional sub-ledger key under worldState.spatialLedgers. Named with the
 * `_LEDGER` suffix so the spatialLedgers coverage walker
 * (tests/lib/spatialLedgerCoverage.walker.test.js) resolves the constant to its
 * string value and can hold the src/lib/spatialUsage.js manifest honest.
 * @type {string}
 */
export const MAGIC_BUFFER_LEDGER = 'magicBuffer';

/**
 * A reserve within this of full counts as full, and its record is dropped. Float
 * arithmetic on the recovery dwell lands a hair under 1 rather than on it, and a
 * ledger that kept a 0.9999 record forever would defeat drop-when-empty.
 */
const FULL_CHARGE_EPSILON = 1e-6;

/** @param {unknown} value @param {number} fallback @returns {number} */
const num = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

// ── The settlement read shape (0-hole discipline: no `any` holes) ────────────
/**
 * @typedef {Object} BufferSettlement
 * DELIBERATELY `unknown`-typed rather than structured. This seam is called with the
 * calamity kernel's own read shape (CalSettlement), whose `config` is `unknown` and
 * whose `economicState` declares only the fields THAT kernel reads, so any structured
 * declaration here would be a second, narrower opinion about a settlement that the
 * caller could not satisfy without a cast. Every field below is narrowed at its point
 * of use instead, which is where the narrowing is checkable.
 * @property {unknown} [economicState]
 * @property {unknown} [config]
 * @property {unknown} [magicLevel]
 */

/**
 * @typedef {Object} BufferRecord
 * The DURABLE half of one settlement's reserve. `charge01` is the reserve as of
 * `year`, and recovery is applied lazily on read rather than swept every tick, so a
 * world that sat unopened for a decade reads the same reserve as one that ticked
 * through it.
 * @property {number} charge01
 * @property {number} year  the year the reserve was last written
 */

/** @typedef {Record<string, BufferRecord>} MagicBufferLedger */

/**
 * THE MAGIC AXIS. `magicLedger` is the estate's single canonical magic quantity and
 * already folds the legacy band vocabulary, the granular dial and the dead-magic
 * world into one answer, so this is a read of the existing source rather than a
 * second opinion about how magical a place is.
 *
 * A dead-magic world answers 0, which zeroes the magic term outright: §5's wards
 * cannot hold where magic does not function, however rich the treasury.
 *
 * The three fields are PROJECTED explicitly rather than cast across, which keeps the
 * exact read surface of the magic axis visible at the seam and keeps this file free
 * of type assertions over a settlement shape it does not own.
 *
 * @param {BufferSettlement|null|undefined} settlement
 * @returns {number} 0..1
 */
export function bufferMagic01(settlement) {
  const config = asRecord(settlement?.config);
  const legacyBand = settlement?.magicLevel;
  const ledger = magicLedger({
    config: {
      magicLevel: typeof config.magicLevel === 'string' ? config.magicLevel : undefined,
      priorityMagic: Number.isFinite(Number(config.priorityMagic))
        ? Number(config.priorityMagic) : undefined,
      magicExists: config.magicExists === false ? false : undefined,
    },
    magicLevel: typeof legacyBand === 'string' ? legacyBand : undefined,
  });
  if (!ledger.present || !ledger.magicExists) return 0;
  return clamp01(num(ledger.priorityMagic, 0) / 100);
}

/**
 * THE GRANARY, in months. Answers null when the settlement carries no readable
 * granary at all, which is different from carrying an empty one: a settlement with
 * no food ledger has no stock to bill, and billing it anyway would invent one.
 * @param {BufferSettlement|null|undefined} settlement
 * @returns {number|null}
 */
export function bufferStoresMonths(settlement) {
  const foodSecurity = asRecord(asRecord(settlement?.economicState).foodSecurity);
  const months = Number(foodSecurity.storageMonths);
  return Number.isFinite(months) ? Math.max(0, months) : null;
}

/**
 * Read the buffer ledger off a world, DEFENSIVELY. A world that never had one, a
 * world whose ledger was dropped, and a world persisted before this layer existed
 * all answer the same way: null.
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @returns {MagicBufferLedger|null}
 */
export function readMagicBufferLedger(worldState) {
  const raw = getSpatialLedger(
    /** @type {Record<string, unknown>} */ (worldState || {}),
    MAGIC_BUFFER_LEDGER,
  );
  if (!raw || typeof raw !== 'object') return null;
  return /** @type {MagicBufferLedger} */ (raw);
}

/**
 * ONE SETTLEMENT'S RESERVE AS OF `year`, with the banded dwell applied on read.
 *
 * Recovery is lazy on purpose. A swept recovery would need the buffer to run on
 * every tick of every world whether or not a disaster was ever possible, and it
 * would drift the moment a tick was skipped, a save was reloaded mid-year, or the
 * disasters flag was toggled. Reading the dwell from the stored year makes the
 * reserve a pure function of (stored charge, stored year, asked year), which is the
 * same shape the calamity cooldown already uses: the stamp IS the record.
 *
 * An absent record answers a FULL reserve, which is the drop-when-empty contract
 * read from the other side.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @param {string|number} id
 * @param {{ year: number, economy01: number }} at
 * @returns {number} 0..1
 */
export function readBufferCharge01(worldState, id, { year, economy01 }) {
  const ledger = readMagicBufferLedger(worldState);
  const record = ledger ? asRecord(ledger[String(id)]) : null;
  if (!record || !Number.isFinite(Number(record.charge01))) return 1;
  const storedYear = num(record.year, 0);
  const years = Math.max(0, num(year, 0) - storedYear);
  return recoverCharge01({ charge01: num(record.charge01, 1), economy01, years });
}

/**
 * True when a record carries nothing worth persisting. A reserve at full is the
 * empty case: it is what an untouched settlement already reads, so storing it would
 * be storing the default.
 * @param {BufferRecord|null|undefined} record
 * @returns {boolean}
 */
export function isBufferRecordEmpty(record) {
  if (!record || typeof record !== 'object') return true;
  return num(record.charge01, 1) >= 1 - FULL_CHARGE_EPSILON;
}

/**
 * Fold a ledger onto a world, DROP-WHEN-EMPTY.
 *
 * A ledger with no drawn reserves is not written as `{}`; the key is dropped
 * outright, and `dropSpatialLedger` takes the whole `spatialLedgers` namespace with
 * it when this was the last sub-ledger. That is the byte-identity half of dormancy,
 * and it is also the drains-as-well-as-fills invariant: a realm whose every buffer
 * recovered is indistinguishable from a realm that never spent one.
 *
 * Records fold in codepoint-sorted key order, so a rebuilt ledger serializes
 * byte-identically to a persisted one.
 *
 * @param {Record<string, unknown>} worldState
 * @param {MagicBufferLedger|null|undefined} ledger
 * @returns {Record<string, unknown>}
 */
export function writeMagicBufferLedger(worldState, ledger) {
  /** @type {MagicBufferLedger} */
  const kept = {};
  for (const id of Object.keys(asRecord(ledger)).sort()) {
    const record = /** @type {BufferRecord} */ (
      /** @type {MagicBufferLedger} */ (ledger)[id]
    );
    if (isBufferRecordEmpty(record)) continue;
    kept[id] = { charge01: num(record.charge01, 1), year: Math.trunc(num(record.year, 0)) };
  }
  if (Object.keys(kept).length === 0) {
    return dropSpatialLedger(worldState, MAGIC_BUFFER_LEDGER);
  }
  return setSpatialLedger(worldState, MAGIC_BUFFER_LEDGER, kept);
}

/**
 * @typedef {Object} BufferInput
 * What `advanceCalamity` hands the strike resolver. NULL means the buffer is dark,
 * and a dark buffer is a complete no-op: no relief, no draw, no receipt, no key.
 * @property {number} gate01    §4's exploitation gate, read from K2, never derived here
 * @property {number} economy01 K2's economy reading, so the lane has ONE economy axis
 * @property {number} charge01  the reserve as of this year, dwell already applied
 * @property {number} year
 */

/**
 * @typedef {Object} DisasterRelief
 * The settled §5 answer for one strike, in the shape the calamity resolver needs.
 * @property {string[]} sparedTargets   institution names the wards kept standing
 * @property {string[]} struckTargets   the names that still fall
 * @property {number} deaths            the mitigated death toll
 * @property {number} exodus            the mitigated departure count
 * @property {number} mitigation01
 * @property {number} chargeAfter01
 * @property {number} storesMonthsDrawn
 * @property {number} repairAccel01
 * @property {import('./magicBufferModel.js').BufferRelief} relief
 * @property {string|null} receiptLine
 * @property {string|null} shortfallLine
 */

/**
 * RESOLVE THE BUFFER FOR ONE STRIKE.
 *
 * WHICH INSTITUTIONS THE WARDS REACH: the spared set is the codepoint-LAST N of the
 * already codepoint-sorted target list. Any deterministic rule would satisfy
 * determinism; this one is chosen so that the single target of a one-institution
 * strike is the same name whether or not a buffer exists, which keeps the smallest
 * strikes comparable across a lit and a dark world. The count FLOORS in the model,
 * so a one-target strike spares nothing at any mitigation below the ceiling, which
 * is §5's tail risk showing up as arithmetic rather than as a special case.
 *
 * @param {{ settlement: BufferSettlement, targets: ReadonlyArray<string>,
 *   deaths: number, exodus: number, buffer: BufferInput }} input
 * @returns {DisasterRelief|null} null when nothing was absorbed at all
 */
export function resolveDisasterRelief({ settlement, targets, deaths, exodus, buffer }) {
  const names = Array.isArray(targets) ? targets.map(String) : [];
  const economy01 = clamp01(num(buffer?.economy01, 0));
  const magic01 = bufferMagic01(settlement);
  const storesMonths = bufferStoresMonths(settlement);
  const charge01 = clamp01(num(buffer?.charge01, 1));
  const relief = affordableRelief({
    axes: { economy01, magic01, gate01: num(buffer?.gate01, 0), charge01 },
    loss: {
      institutions: names.length,
      deaths: Math.max(0, Math.trunc(num(deaths, 0))),
      exodus: Math.max(0, Math.trunc(num(exodus, 0))),
    },
    stocks: { storesMonths: storesMonths == null ? 0 : storesMonths, charge01 },
  });
  if (relief.reliefUnits <= 0) return null;

  const spared = relief.conversion.institutionsSpared;
  const sparedTargets = spared > 0 ? names.slice(names.length - spared) : [];
  const sparedSet = new Set(sparedTargets);
  const chargeAfter01 = clamp01(charge01 - relief.payment.chargeDrawn01);
  return {
    sparedTargets,
    struckTargets: names.filter((name) => !sparedSet.has(name)),
    deaths: Math.max(0, Math.trunc(num(deaths, 0)) - relief.conversion.deathsAvoided),
    exodus: Math.max(0, Math.trunc(num(exodus, 0)) - relief.conversion.exodusAvoided),
    mitigation01: relief.mitigation01,
    chargeAfter01,
    storesMonthsDrawn: relief.payment.storesMonthsDrawn,
    repairAccel01: repairAcceleration01({
      economy01, magic01, gate01: num(buffer?.gate01, 0), charge01: chargeAfter01,
    }),
    relief,
    receiptLine: bufferReceiptLine(relief),
    shortfallLine: bufferShortfallLine(relief),
  };
}

/**
 * DRAW THE GRANARY, in the same outcome (§5). Clamped at zero and rounded to the
 * tenth-month, which is the applyFoodStockpileOutcome idiom the generosity mover
 * already writes this field with, so a buffer draw and a relief shipment leave the
 * granary in the same shape.
 *
 * Returns the SAME REFERENCE when there is nothing to draw, so a caller can use
 * identity to prove a dark buffer touched nothing.
 *
 * @template {BufferSettlement} S
 * @param {S} settlement
 * @param {number} monthsDrawn
 * @returns {S}
 */
export function drawBufferStores(settlement, monthsDrawn) {
  const draw = Math.max(0, num(monthsDrawn, 0));
  if (draw <= 0) return settlement;
  const economicState = asRecord(settlement?.economicState);
  const foodSecurity = asRecord(economicState.foodSecurity);
  const current = Number(foodSecurity.storageMonths);
  if (!Number.isFinite(current)) return settlement;
  const next = Math.round(Math.max(0, current - draw) * 10) / 10;
  if (next === current) return settlement;
  return /** @type {S} */ ({
    ...settlement,
    economicState: {
      ...economicState,
      foodSecurity: { ...foodSecurity, storageMonths: next },
    },
  });
}

/**
 * THE RECEIPT BLOCK for a strike the buffer touched (§5: receipts that read like
 * "the wards held; the granaries paid"). Structured for the DM surface and prosaic
 * for the reader, and it names WHAT WAS PAID beside what was saved, because a
 * receipt that only reported the saving would be exactly the nullification §5
 * forbids.
 *
 * @param {DisasterRelief} resolved
 * @returns {Record<string, unknown>}
 */
export function bufferReceipt(resolved) {
  return {
    // Presentation rounding lives HERE, at the one boundary a human reads, and both
    // numbers round the same way so a receipt can never show a mitigation exceeding the
    // demand that produced it.
    mitigation: Math.round(resolved.mitigation01 * 10000) / 10000,
    demand: Math.round(resolved.relief.demand01 * 10000) / 10000,
    rationed: resolved.relief.rationed,
    spared: resolved.sparedTargets,
    deathsAvoided: resolved.relief.conversion.deathsAvoided,
    exodusAvoided: resolved.relief.conversion.exodusAvoided,
    reliefUnits: resolved.relief.reliefUnits,
    paidStoresMonths: resolved.storesMonthsDrawn,
    paidWardCharge: resolved.relief.payment.chargeDrawn01,
    chargeAfter: resolved.chargeAfter01,
    repairAcceleration: resolved.repairAccel01,
    note: resolved.receiptLine,
    ...(resolved.shortfallLine ? { shortfall: resolved.shortfallLine } : {}),
  };
}

/**
 * THE ONE PLACE THAT DECIDES WHETHER A SETTLEMENT HAS A BUFFER AT ALL.
 *
 * Gated on K1's `magicEconomyActive` and nothing else, so the lane has ONE gate
 * reader in the tree. Answers null when the lane is dark, and a null buffer makes
 * every downstream step a no-op by construction rather than by a second flag check.
 *
 * The RULES arrive separately from the WORLD STATE because the calamity kernel holds
 * them separately: it is handed `simulationRules` as its own argument and reads the
 * pulse's memory state for ledgers. Wrapping the rules for `magicEconomyActive` here
 * keeps K1's reader canonical instead of inlining a second `=== true` test.
 *
 * BOTH AXES COME FROM K2 (law 3). `readMagicRegime` composes the settlement's regime
 * record with its economy reading and hands back the gate ALREADY COMPOSED, so this
 * seam neither knows nor can express how a regime becomes a number. A world with no
 * regime ledger reads the base rung, whose gate floor is the honest answer for a
 * settlement that has never funded anything.
 *
 * @param {{ rules: Record<string, unknown>|null|undefined,
 *   worldState: { spatialLedgers?: unknown }|null|undefined,
 *   item: Parameters<typeof readMagicRegime>[0]['item'],
 *   id: string|number, year: number }} input
 * @returns {BufferInput|null}
 */
export function bufferInputFor({ rules, worldState, item, id, year }) {
  if (!magicEconomyActive({ simulationRules: rules })) return null;
  const reading = readMagicRegime({
    record: readMagicRegimeRecord(worldState, id),
    item: item || null,
  });
  return {
    gate01: clamp01(num(reading.gate01, 0)),
    economy01: clamp01(num(reading.economy01, 0)),
    charge01: readBufferCharge01(worldState, id, {
      year: num(year, 0), economy01: clamp01(num(reading.economy01, 0)),
    }),
    year: num(year, 0),
  };
}

export { MAGIC_BUFFER_TUNING };
