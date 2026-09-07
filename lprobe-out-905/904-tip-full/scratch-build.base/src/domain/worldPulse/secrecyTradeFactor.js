/**
 * domain/worldPulse/secrecyTradeFactor.js — [FP IN-0d] HIDE'S TRADE TAX, THE READ SIDE.
 *
 * THE SEAM THIS CLOSES, AND IT WAS RECORDED AS OPEN. informationStatecraft.js's own foot
 * notes have carried this since the SEE/HIDE movers landed: "a secrecy posture closes the
 * market to foreign merchants — a bounded trade-pressure penalty. The posture is legible +
 * the cost is narrated; wiring the actual merchantAppetite/tradeSalience penalty into the
 * trade read is a thin downstream hook, NOT a pinned effect." The posture has been real and
 * the toll has been prose. This is the toll, as a number a trade read can multiply by.
 *
 * ── WHAT THIS MODULE IS, AND WHAT IT DELIBERATELY IS NOT ────────────────────────
 *
 * It is a PURE READ. It has no writer, mints no key, and takes no tick. It answers exactly
 * one question — "how much is this settlement's market closed by its own secrecy?" — and
 * hands back a banded multiplier plus the word for it.
 *
 * IT DOES NOT APPLY ITSELF. The consuming join belongs to FP-TRADE (row 14, which builds
 * AFTER this one), per the WR-6/WR-8 pointer discipline: the wave that owns the trade read
 * is the wave that wires the penalty into it. Until then this export has ZERO consumers in
 * src/, and that is not an oversight — it is what makes "dark ⇒ trade bytes identical"
 * true by construction rather than by argument. `tests/property/secrecyTradeDormancyFence.js`
 * pins the zero-consumer fact itself, so TRADE's landing turns that pin RED and the seam
 * cannot be wired without someone reading this note.
 *
 * ── THE GATE IS THE FLAG, AND IT HAD TO BE (measured, IN-0d) ────────────────────
 *
 * The obvious shape — read `spatialLedgers.secrecyPostures` and let an absent ledger mean
 * "no secrecy" — is what corruptionWeb.js's own private secrecy read does, and for THIS
 * contract it is UNSOUND. `advanceInformationStatecraft` returns early when the layer is
 * dark and DOES NOT prune the posture ledger, so a world that ran lit and was then turned
 * dark keeps its postures verbatim. MEASURED BY EXECUTION 2026-08-06: a level-0.8 posture
 * on a world with `infoStatecraftEnabled` absent survives the advance untouched
 * (`changed: false`, ledger intact).
 *
 * A ledger-only read would therefore have returned a `choked` factor on a DARK world — the
 * exact opposite of the identity contract — and, once TRADE wires it, would have let a
 * stale posture move trade bytes with the layer switched off. So the gate is the flag, read
 * through the layer's OWN `infoStatecraftActive` rather than a second spelling of it. That
 * import runs leaf → head, which is the reverse of this family's usual direction; it is
 * chosen deliberately, because the alternative is a second gate spelling and a gate that
 * exists twice is a gate that drifts. Executed: informationStatecraft.js imports nothing
 * from here, so the direction closes no cycle.
 *
 * ── THE SECLUSION HUM IS NOT BUILT HERE, AND THAT IS A REPORTED STOP ────────────
 *
 * IN-0d's pin list asks for "the seclusion hum registered", and the volume gives it a
 * sentence ("The gates of [X] are shut to strangers; so are its markets, more than its
 * council admits"). The volume's own CORRECTED unpack then says this slice mints NO endings
 * of its own because "the toll rides HIDE's existing posture transitions (enter/hold/exit),
 * which are ALREADY RECEIPTED".
 *
 * MEASURED 2026-08-06, and that last clause is an OVERSTATEMENT: HIDE posture transitions
 * are receipted NOWHERE. `processSecrecy` returns the posture ledger and nothing else — no
 * news, no deltas — and `advanceInformationStatecraft` assembles its `newsEntries` from the
 * SEE, LIE and intel arms only. An executed scan finds no secrecy or gates kind anywhere
 * under src/. The world raises and lowers its gates in total silence today.
 *
 * So there is no existing beat for a toll line to ride, and the hum cannot be discharged as
 * a sentence on one. Building it properly is a NEWS PRODUCER — a pacing-gated, cooldown-
 * bounded mover under the anti-hum law, plus a new kind registered across all four surfaces
 * of §1c's mint-time rule — which is neither a pure read nor this slice's ~100-line budget.
 * And registering a kind that nothing mints is precisely what this estate's registries red
 * on, in both directions.
 *
 * THEREFORE: the read ships, pinned; the hum is REPORTED as owed rather than half-made or
 * silently dropped. Whether it lands as its own producer or as a receipt on a HIDE
 * transition beat that does not yet exist is a scoping call above this lane's authority.
 * Deliberately deferred — documented, not a bug to re-find.
 *
 * PURE, TOTAL, ZERO-DRAW: no rng, no clock, no mutation, no store, no tier read.
 */

import { clamp01 } from '../../kernel/math.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { infoStatecraftActive } from './informationStatecraft.js';

/**
 * THE CLOSURE LADDER, ascending in how shut the market is. A closed vocabulary; a surface
 * renders the word and never the multiplier (the legibility law, and the game-grade
 * doctrine's "translate formulas, never show them").
 *
 * ── A GENUINE MINT, AND WHAT WAS LOOKED FOR FIRST (J-WR-10-B's borrow-before-minting) ──
 *
 * bandFamilies.js owns the estate's two families and its header is explicit that a volume
 * ASSIGNS to a scale and never authors one. Neither fits: SIGNIFICANCE_CLASSES grades how
 * loudly the world should speak of a beat and SEVERITY_LADDER grades what an outcome cost,
 * while this grades HOW OPEN A MARKET IS — a standing condition, not a verdict and not a
 * volume. The nearest existing words were measured and rejected for the reason that file
 * rejects its own near-misses: `heraldFilter.js`'s {routine, strained, critical} shares its
 * bottom rung with the significance family, and the price and vagueness ladders in the
 * brokerage family grade a cost and a view, not a closure.
 *
 * All four rungs were measured to appear as quoted string literals ZERO times anywhere
 * under src/ before this constant (executed census, 2026-08-06), so reading the wrong
 * ladder is impossible by SPELLING rather than by discipline.
 * @type {readonly string[]}
 */
export const SECRECY_TRADE_BANDS = Object.freeze([
  'unhindered', 'curtailed', 'throttled', 'choked',
]);

/**
 * THE TOLL TUNING (PROPOSED, soak-vetoable in the I1 band idiom).
 *
 * BANDED, not continuous, and that is the contract's whole point: TRADE multiplies by one
 * of exactly four numbers, so a soak retune moves a rung rather than reshaping a curve, and
 * two settlements one hair apart in paranoia do not trade measurably differently.
 *
 * CAPPED at the bottom rung: a town that has sealed its gates still trades. A factor that
 * could reach zero would let one posture erase a settlement from the trade network
 * entirely, which is a far larger claim than "secrecy is bad for business" and is not what
 * the design's carrier=commerce clause says.
 *
 * The cut points are read against the posture's OWN hysteresis. A guarded settlement holds
 * at least SIGHT_TUNING.HIDE_EXIT (0.22) by construction, so the first cut sits BELOW that:
 * being guarded at all costs something, and `unhindered` is reserved for a town with no
 * posture standing rather than being a rung a guarded town can occupy.
 */
export const SECRECY_TRADE_TUNING = Object.freeze({
  /** Cut points over the secrecy level, ascending. Length is BANDS.length - 1. */
  BAND_CUTS: Object.freeze([0.20, 0.45, 0.70]),
  /** The multiplier at each rung, in BANDS order. Index 0 is exact identity. */
  BAND_FACTORS: Object.freeze([1, 0.9, 0.78, 0.65]),
});

/**
 * @typedef {Object} SecrecyTradeFactor
 * @property {string} band      one of SECRECY_TRADE_BANDS
 * @property {number} factor01  the multiplier TRADE applies; EXACTLY 1 outside HIDE
 */

/** The identity reading, returned wherever there is no secrecy to price. */
const UNHINDERED = Object.freeze({ band: 'unhindered', factor01: 1 });

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * The band a raw secrecy level falls in. TOTAL: an unreadable level reads as NO secrecy,
 * which is the fail-open direction and the correct one — a market is presumed open unless
 * something legible says it is shut.
 * @param {unknown} secrecy01 @returns {string}
 */
export function secrecyTradeBandOf(secrecy01) {
  const level = clamp01(typeof secrecy01 === 'number' && Number.isFinite(secrecy01) ? secrecy01 : 0);
  const cuts = SECRECY_TRADE_TUNING.BAND_CUTS;
  let band = 0;
  while (band < cuts.length && level >= cuts[band]) band += 1;
  return SECRECY_TRADE_BANDS[band];
}

/**
 * ⭐ SEAM 11 — THE EXPORT FP-TRADE CONSUMES. How much one settlement's HIDE posture closes
 * its market, as a banded multiplier and the word for it.
 *
 * IDENTITY OUTSIDE HIDE, three ways and all of them exact: a dark layer, a world with no
 * posture ledger, and a settlement with no posture of its own all return `factor01 === 1`,
 * which is multiplicatively neutral. TRADE can therefore apply this unconditionally at its
 * join without a branch, and a branch it does not have is a branch that cannot be written
 * backwards.
 *
 * @param {unknown} worldState
 * @param {string} settlementId
 * @returns {SecrecyTradeFactor}
 */
export function secrecyTradeFactorOf(worldState, settlementId) {
  // THE FLAG, not the ledger — a dark layer leaves stale postures standing (see header).
  if (!infoStatecraftActive(/** @type {never} */ (worldState))) return UNHINDERED;
  // ES-1 REPAIR R2 — NARROWED, NOT CAST. This module's parameter is `unknown` and
  // `getSpatialLedger` asks for `Record<string, unknown> | null | undefined`, which was
  // this file's one strict error (TS2345). The module's OWN total narrower closes it, and
  // it is behaviour-identity rather than a silencer: `asObject` hands a plain object
  // straight through by reference, and for every other input hands back `{}`, whose
  // `spatialLedgers` lookup makes `spatialLedgerNamespace` return null — the same null a
  // raw non-object produced — so `getSpatialLedger` still answers `undefined` and the
  // identity reading below is unchanged on every path.
  const postures = asObject(getSpatialLedger(asObject(worldState), 'secrecyPostures'));
  const level = asObject(postures[String(settlementId)]).level01;
  const band = secrecyTradeBandOf(level);
  const factor01 = SECRECY_TRADE_TUNING.BAND_FACTORS[SECRECY_TRADE_BANDS.indexOf(band)];
  return Object.freeze({ band, factor01 });
}

/**
 * THE LANDING RECORD of this contract's shape — what FP-TRADE was told to expect when it
 * pre-pinned against SEAM 11. A RECORD, never a policy: nothing reads it to decide
 * behaviour, and widening it would erase the very fact the tripwire exists to preserve.
 * @type {Readonly<{ bands: readonly string[], factors: readonly number[], cuts: readonly number[] }>}
 */
export const SECRECY_TRADE_CONTRACT_AT_IN0D = Object.freeze({
  bands: Object.freeze(['unhindered', 'curtailed', 'throttled', 'choked']),
  factors: Object.freeze([1, 0.9, 0.78, 0.65]),
  cuts: Object.freeze([0.20, 0.45, 0.70]),
});

/**
 * ⭐ THE SEAM 11 TRIPWIRE, in the shrink-only inventory-ratchet idiom `catalogGrewSinceWr10`
 * established. A shape census over the export's band vocabulary and its numbers: when any
 * of them moves away from what IN-0d published, this returns TRUE and the pin asserting
 * otherwise goes RED.
 *
 * That red is not a bug, it is the message: "the factor contract TRADE pre-pinned against
 * has moved — re-read FP-TRADE's join, re-pin it, and only then re-record this record."
 * Without it, retuning a rung here would silently change what a trade read computes in a
 * volume built by a different wave, months apart, with nothing connecting the two.
 * @returns {boolean}
 */
export function secrecyTradeContractChangedSinceIn0d() {
  const now = SECRECY_TRADE_CONTRACT_AT_IN0D;
  return String(SECRECY_TRADE_BANDS) !== String(now.bands)
    || String(SECRECY_TRADE_TUNING.BAND_FACTORS) !== String(now.factors)
    || String(SECRECY_TRADE_TUNING.BAND_CUTS) !== String(now.cuts);
}
