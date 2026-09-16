/**
 * domain/worldPulse/magicRegimeModel.js — W-K slice K2: THE ECONOMY REGIME LADDER
 * and THE ONE GATE FORMULA (binding law docs/DESIGN_MAGIC_ECONOMY.md §3a, §4, §10,
 * §11; constitutional laws 2 PRESENCE IS MAGIC-GATED EXPLOITATION ECONOMY-GATED,
 * 3 ONE GATE FORMULA, 4 THRESHOLDS WITH BANDS + HYSTERESIS, 7 FINITE SEMANTICS).
 *
 * K1 answered "is this institution working". K2 answers the other half: "what can
 * this settlement DO with its magic", and the answer is an ECONOMIC one all the way
 * down. Nothing in this file reads the magic profile at all, and that is the design's
 * central split rather than an oversight: PRESENCE keys off magic (magicForms.js owns
 * the floor), EXPLOITATION keys off the economy (this file owns the ceiling).
 *
 * ── THE LADDER IS CLOSED, AND ITS RUNGS ARE ECONOMIC WORDS ──────────────────
 * `subsistence | funded | patronized | industrial` (§3a; names owner-vetoable under
 * law 7). They describe WHO PAYS, not how much magic there is: nobody pays
 * (subsistence), the town pays (funded), a patron pays (patronized), the work pays
 * for itself (industrial). A pervasively magical thorp is `subsistence` and that is
 * the right word for it.
 *
 * ── THE ECONOMY READING IS NOT A NEW NUMBER ─────────────────────────────────
 * `economyHealthScore` (institutionLifecycle.js) is the estate's existing 0..1
 * composite over the four causal economy scores, and it is ALREADY the gate the
 * institution build/close lifecycle reads. K2 imports it rather than deriving a
 * sibling composite, so the regime ladder and the economic close can never disagree
 * about whether a settlement is poor. That matters concretely here, because §3c's
 * shell is minted by that very lifecycle and K2 must be able to demote INTO it.
 *
 * The two lower thresholds are the SAME NUMBERS that lifecycle already uses
 * (INSTITUTION_LIFECYCLE_TUNING.thresholds: declining 0.4, prosperous 0.62), so
 * "the town can fund its own magic" begins exactly where the estate stops calling
 * the economy failing, and "a patron appears" begins exactly where the estate starts
 * calling it prosperous. Only the top rung's threshold is new, and it is new because
 * the top rung is new (§9 RARITY).
 *
 * ── HYSTERESIS IS TWO MECHANISMS, NOT ONE (law 4) ───────────────────────────
 * A promotion threshold strictly above its demotion threshold gives a DEAD BAND: an
 * economy oscillating inside the band produces no crossing at all. A minimum DWELL
 * on top of that bounds how often an economy oscillating ACROSS the band can cross.
 * Both are needed and they answer different fixtures: the band kills jitter, the
 * dwell kills a genuine but rapid swing. "No flapping foundries" is the design's
 * phrase and it is pinned against both shapes.
 *
 * ── THE ONE GATE FORMULA (law 3, §4) ────────────────────────────────────────
 * `magicExploitationGate` is the SINGLE definition of how much a settlement can
 * exploit its magic, and every magic-derived output in W-K reads it: the form
 * ceiling and the output scale here in K2, the disaster buffer in K3, substitution
 * capacity in K4. It is CONTINUOUS in the economy within a regime (the "banded
 * gradation" half of law 4) and, for a settlement entering fresh, continuous ACROSS
 * regime boundaries too, because each regime's band is entered at exactly the point
 * the one below it leaves off. The discontinuity a crossing produces is therefore
 * purely the HYSTERESIS, which is the honest place for it: a settlement that fell
 * carries its old ceiling until it falls far enough to lose it.
 *
 * The gate never reads subscription tier, party state, or a wall clock (§4).
 *
 * ── DORMANCY (law 8; §10) ───────────────────────────────────────────────────
 * The K1 gate is reused verbatim: `magicEconomyActive` off the VIRTUAL
 * `magicEconomyEnabled` rule. One gate for the whole wave, not a second switch.
 * The ledger nests under the `spatialLedgers` conditional namespace and drops when
 * empty, and a world whose settlements all sit at the base regime stores nothing at
 * all, because the base regime is the absence of a record rather than a recorded
 * word.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation, no store. The
 * advance consumes ZERO draws, so it cannot perturb the pulse stream even when lit.
 *
 * @enforced-by tests/domain/magicRegimeModel.test.js,
 *   tests/domain/magicRegimeLifecycle.test.js
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import { economyHealthScore } from './institutionLifecycle.js';
import { magicEconomyActive } from './institutionStatusModel.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';

/**
 * The conditional sub-ledger key under worldState.spatialLedgers. Named with the
 * `_LEDGER` suffix so the spatialLedgers coverage walker
 * (tests/lib/spatialLedgerCoverage.walker.test.js) resolves the constant to its
 * string value and can hold the src/lib/spatialUsage.js manifest honest.
 * @type {string}
 */
export const MAGIC_REGIME_LEDGER = 'magicRegime';

/**
 * THE CLOSED REGIME LADDER (§3a, law 7). Ordered from the bottom rung up; the index
 * in this array IS the rung, and every comparison in the wave goes through
 * `regimeRank` rather than through a string compare, so a future re-ordering cannot
 * half-land.
 * @type {ReadonlyArray<string>}
 */
export const MAGIC_REGIMES = Object.freeze([
  'subsistence', 'funded', 'patronized', 'industrial',
]);

export const REGIME_SUBSISTENCE = 'subsistence';
export const REGIME_FUNDED = 'funded';
export const REGIME_PATRONIZED = 'patronized';
export const REGIME_INDUSTRIAL = 'industrial';

/**
 * THE BASE RUNG. A settlement at the base regime carries NO ledger record: the base
 * is the absence of a record rather than a recorded word, which is what makes a world
 * that never grew past subsistence byte-identical to a world with no ledger at all.
 * @type {string}
 */
export const BASE_MAGIC_REGIME = REGIME_SUBSISTENCE;

/**
 * A terse in-world label per regime, for receipts and headlines. Total over
 * MAGIC_REGIMES. These are the words a Herald beat uses, so a surface never has to
 * spell the vocabulary itself.
 * @type {Readonly<Record<string, string>>}
 */
export const MAGIC_REGIME_LABELS = Object.freeze({
  subsistence: 'what the practitioners can do unpaid',
  funded: 'what the town itself pays for',
  patronized: 'what a patron underwrites',
  industrial: 'work that pays for itself',
});

/**
 * TUNING (§11: "regime thresholds (hysteresis pairs), within-regime bands"). Every
 * entry is PROPOSED and soak-vetoable per the R-15 shape.
 *
 * ENTER is the economy reading at or above which a settlement PROMOTES into the
 * regime; LEAVE is the reading strictly below which it DEMOTES out of it. ENTER is
 * strictly greater than LEAVE for every rung, and that gap IS the dead band.
 *
 * THE TWO LOWER PAIRS ARE NOT INVENTED. `funded.enter` is exactly
 * INSTITUTION_LIFECYCLE_TUNING.thresholds.declining and `patronized.enter` is exactly
 * its `.prosperous`, so the ladder's lower half is the estate's own reading of a
 * failing and a thriving economy, restated as a magic question. The equality is
 * pinned rather than commented (tests/domain/magicRegimeModel.test.js), so a tuning
 * pass that moves the lifecycle's numbers reds here instead of silently splitting the
 * two readings apart.
 *
 * `industrial.enter` at 0.84 is the one genuinely new number, and it is high on
 * purpose: §9's RARITY law says that if every third city is industrial-magic then
 * none are wondrous. The FORMS side enforces the other half of that rarity (the
 * foundry rung is metropolis-only and top-magic-only), so this threshold governs
 * only how rich a place must be, not how many places qualify.
 *
 * BAND is the slice of the 0..1 exploitation gate the regime occupies. The four
 * bands tile [0,1] exactly and in ladder order, which is what makes the gate
 * monotone by construction rather than by tuning care.
 */
export const MAGIC_REGIME_TUNING = Object.freeze({
  thresholds: Object.freeze({
    // The base rung has no entry threshold: everything that is not funded is
    // subsistence, so its span starts at zero.
    subsistence: Object.freeze({ enter: 0, leave: 0 }),
    funded: Object.freeze({ enter: 0.4, leave: 0.34 }),
    patronized: Object.freeze({ enter: 0.62, leave: 0.55 }),
    industrial: Object.freeze({ enter: 0.84, leave: 0.76 }),
  }),
  bands: Object.freeze({
    subsistence: Object.freeze({ floor: 0, ceiling: 0.25 }),
    funded: Object.freeze({ floor: 0.25, ceiling: 0.5 }),
    patronized: Object.freeze({ floor: 0.5, ceiling: 0.75 }),
    industrial: Object.freeze({ floor: 0.75, ceiling: 1 }),
  }),
  /**
   * The minimum number of ticks a regime must hold before another crossing may
   * fire. The dead band alone stops JITTER; this stops a genuine but rapid swing
   * from rebuilding and closing the same foundry inside a year. Four ticks against
   * the institution lifecycle's own multi-tick streak requirement means a regime
   * change is always slower than the closure it causes is allowed to be.
   */
  minDwellTicks: 4,
});

/**
 * @typedef {Object} MagicRegimeRecord
 * The DURABLE half of one settlement's regime. The regime WORD must be stored (it is
 * path-dependent through hysteresis and cannot be re-derived from the economy alone),
 * and `sinceTick` must be stored for the dwell. Nothing else is: the economy reading,
 * the gate and the available forms are all re-derived every advance.
 * @property {string} regime     a member of MAGIC_REGIMES
 * @property {number} sinceTick  the tick this regime was entered
 */

/** @typedef {Record<string, MagicRegimeRecord>} MagicRegimeLedger */

/**
 * @typedef {Object} MagicRegimeReading
 * The full derived answer for one settlement. `regime` is the word, `economy01` the
 * reading it came from, and `gate01` THE ONE GATE every magic-derived output reads.
 * @property {string} regime
 * @property {number} economy01
 * @property {number} gate01
 * @property {number} sinceTick
 * @property {string} label
 */

/**
 * A loose settlement snapshot row. CONVERGES ON THE ESTATE'S EXISTING SPELLING: this
 * is causeLifecycle.js / causeVocabulary.js's `SnapshotItem` shape verbatim, narrowed
 * to the two fields this leaf reads. Declared rather than imported because those two
 * files spell it inline as well, and a third inline copy of the SAME shape is the
 * convergence the cross-slice rule asks for.
 * @typedef {Object} SnapshotItem
 * @property {string|number} [id]
 * @property {{ institutions?: unknown, tier?: unknown, config?: unknown }} [settlement]
 * @property {{ scores?: Record<string, number> }} [causal]
 */

/** @param {unknown} value @param {number} fallback @returns {number} */
const num = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

/**
 * The rung index of a regime, or the base rung's index for anything outside the
 * closed vocabulary. An unknown word answers the FLOOR rather than -1, so a typo
 * degrades a settlement to subsistence instead of poisoning every comparison with a
 * negative rank.
 *
 * @param {string} regime
 * @returns {number}
 */
export function regimeRank(regime) {
  const index = MAGIC_REGIMES.indexOf(String(regime));
  return index >= 0 ? index : 0;
}

/**
 * THE ECONOMY READING for one snapshot row, 0..1, high = healthy. Delegates to
 * `economyHealthScore` (institutionLifecycle.js) rather than restating it, so this
 * lane and the institution build/close lifecycle read one number.
 *
 * A row with no causal scores answers the neutral 0.5 that `economyHealthScore`
 * already defaults each missing score to, which lands in `funded` and not in
 * `subsistence`: an unread economy is neutral, not destitute.
 *
 * @param {SnapshotItem|null|undefined} item
 * @returns {number}
 */
export function regimeEconomyReading(item) {
  return clamp01(economyHealthScore(asRecord(asRecord(item).causal).scores || {}));
}

/**
 * THE REGIME A FRESH SETTLEMENT ENTERS at a given economy reading, with no history to
 * be sticky about. This is the ladder read PURELY, and it is the function the
 * monotonicity pin exercises: every hysteresis question is answered by
 * `resolveMagicRegime` on top of this.
 *
 * @param {number} economy01
 * @returns {string}
 */
export function regimeForEconomy(economy01) {
  const value = clamp01(num(economy01, 0));
  const { thresholds } = MAGIC_REGIME_TUNING;
  let regime = BASE_MAGIC_REGIME;
  for (const candidate of MAGIC_REGIMES) {
    if (value >= thresholds[/** @type {keyof typeof thresholds} */ (candidate)].enter) {
      regime = candidate;
    }
  }
  return regime;
}

/**
 * The economy span a regime occupies: from its own entry threshold up to the entry
 * threshold of the rung above it (or 1 at the top). The gate normalizes the economy
 * reading within this span, which is what makes the grading CONTINUOUS inside a
 * regime and seamless across a fresh crossing.
 *
 * @param {string} regime
 * @returns {{ from: number, to: number }}
 */
export function regimeEconomySpan(regime) {
  const { thresholds } = MAGIC_REGIME_TUNING;
  // `regimeRank` already folds an unknown word to the base rung, so `self` is always
  // a real member and the lookups below cannot miss.
  const rank = regimeRank(regime);
  const self = MAGIC_REGIMES[rank];
  const above = MAGIC_REGIMES[rank + 1];
  return {
    from: thresholds[/** @type {keyof typeof thresholds} */ (self)].enter,
    to: above ? thresholds[/** @type {keyof typeof thresholds} */ (above)].enter : 1,
  };
}

/**
 * ⭐ THE ONE GATE FORMULA (law 3, §4). The single definition of magic exploitation,
 * 0..1, read by EVERY magic-derived output in W-K:
 *
 *   K2  the form ceiling (magicForms.js) and the output scale.
 *   K3  the disaster buffer's magic term (§5).
 *   K4  substitution capacity and the reagent demand scale (§6, §7).
 *
 * There is exactly one definition and it lives here. A consumer that computed its own
 * band from the economy would be a second gate, and law 3 exists because the estate
 * has been bitten by exactly that shape before.
 *
 * THE SHAPE: the regime picks a band, the economy's position INSIDE that regime's own
 * economy span grades continuously within it. A settlement holding a regime it could
 * no longer newly enter (hysteresis) reads at the BOTTOM of its band rather than
 * dropping out of it, which is the honest rendering of a place living on the
 * reputation of a richer decade.
 *
 * @param {{ regime?: string, economy01?: number }} input
 * @returns {number} 0..1
 */
export function magicExploitationGate({ regime = BASE_MAGIC_REGIME, economy01 = 0 } = {}) {
  const word = MAGIC_REGIMES.includes(String(regime)) ? String(regime) : BASE_MAGIC_REGIME;
  const band = MAGIC_REGIME_TUNING.bands[/** @type {keyof typeof MAGIC_REGIME_TUNING.bands} */ (word)];
  const span = regimeEconomySpan(word);
  const width = span.to - span.from;
  const within = width > 0
    ? clamp01((clamp01(num(economy01, 0)) - span.from) / width)
    : 0;
  return clamp01(band.floor + (band.ceiling - band.floor) * within);
}

/**
 * RESOLVE ONE SETTLEMENT'S REGIME for this tick, applying both halves of the
 * hysteresis (law 4).
 *
 * THE DEAD BAND: a promotion needs the economy at or above the higher rung's `enter`;
 * a demotion needs it strictly below the CURRENT rung's `leave`. Between the two the
 * settlement holds what it has, whichever direction it is drifting.
 *
 * THE DWELL: no crossing at all until the current regime has held `minDwellTicks`.
 * A settlement with no prior record has held the base regime forever, so its first
 * crossing is never dwell-blocked; that is deliberate, because the alternative would
 * make every world's first four ticks silently unpromotable.
 *
 * ONE RUNG AT A TIME. A settlement that gets suddenly rich promotes one rung per
 * crossing rather than leaping from subsistence to industrial, because §9's arc is a
 * story of stages and a leap would skip the Herald beats that make it one.
 *
 * @param {{ prior?: MagicRegimeRecord|null, economy01?: number, tick?: number }} input
 * @returns {{ regime: string, sinceTick: number, changed: boolean, direction: string|null, blockedByDwell: boolean }}
 */
export function resolveMagicRegime({ prior = null, economy01 = 0, tick = 0 } = {}) {
  const now = Math.trunc(num(tick, 0));
  const value = clamp01(num(economy01, 0));
  const held = prior && MAGIC_REGIMES.includes(String(prior.regime))
    ? String(prior.regime)
    : BASE_MAGIC_REGIME;
  const heldSince = prior ? Math.trunc(num(prior.sinceTick, 0)) : 0;
  const hasHistory = Boolean(prior);
  const rank = regimeRank(held);
  const { thresholds, minDwellTicks } = MAGIC_REGIME_TUNING;

  const above = MAGIC_REGIMES[rank + 1];
  const wantsPromotion = Boolean(above)
    && value >= thresholds[/** @type {keyof typeof thresholds} */ (above)].enter;
  const wantsDemotion = rank > 0
    && value < thresholds[/** @type {keyof typeof thresholds} */ (held)].leave;

  if (!wantsPromotion && !wantsDemotion) {
    return {
      regime: held,
      // A settlement with NO history has held the base regime FOREVER, so its dwell
      // tick is 0 and not `now`. Stamping `now` here would make a never-crossed
      // settlement look freshly arrived on every single advance, which would keep its
      // base-regime record permanently inside the dwell window and permanently
      // un-droppable: an all-subsistence world would grow a ledger entry per
      // settlement and the non-obvious zero would be lost.
      sinceTick: hasHistory ? heldSince : 0,
      changed: false,
      direction: null,
      blockedByDwell: false,
    };
  }

  // THE DWELL, checked only when a crossing is actually wanted, so a settlement
  // sitting still is never reported as dwell-blocked.
  if (hasHistory && now - heldSince < minDwellTicks) {
    return {
      regime: held, sinceTick: heldSince, changed: false, direction: null, blockedByDwell: true,
    };
  }

  const nextRank = wantsPromotion ? rank + 1 : rank - 1;
  return {
    regime: MAGIC_REGIMES[clamp(nextRank, 0, MAGIC_REGIMES.length - 1)],
    sinceTick: now,
    changed: true,
    direction: wantsPromotion ? 'promoted' : 'demoted',
    blockedByDwell: false,
  };
}

/**
 * The full derived reading for one settlement: the word, the economy it came from,
 * and THE GATE. The accessor every consumer outside this file calls, so nobody has to
 * remember to compose the gate themselves.
 *
 * @param {{ record?: MagicRegimeRecord|null, item?: SnapshotItem|null }} input
 * @returns {MagicRegimeReading}
 */
export function readMagicRegime({ record = null, item = null }) {
  const economy01 = regimeEconomyReading(item);
  const regime = record && MAGIC_REGIMES.includes(String(record.regime))
    ? String(record.regime)
    : BASE_MAGIC_REGIME;
  return {
    regime,
    economy01,
    gate01: magicExploitationGate({ regime, economy01 }),
    sinceTick: record ? Math.trunc(num(record.sinceTick, 0)) : 0,
    label: MAGIC_REGIME_LABELS[regime] || '',
  };
}

/**
 * Read the regime ledger off a world, DEFENSIVELY. A world that never had one, a
 * world whose ledger was dropped, and a world persisted before this layer existed all
 * answer the same way: null.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @returns {MagicRegimeLedger|null}
 */
export function readMagicRegimeLedger(worldState) {
  const raw = getSpatialLedger(
    /** @type {Record<string, unknown>} */ (worldState || {}),
    MAGIC_REGIME_LEDGER,
  );
  if (!raw || typeof raw !== 'object') return null;
  return /** @type {MagicRegimeLedger} */ (raw);
}

/**
 * One settlement's regime record off a world, or null.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @param {string|number} cid
 * @returns {MagicRegimeRecord|null}
 */
export function readMagicRegimeRecord(worldState, cid) {
  const ledger = readMagicRegimeLedger(worldState);
  if (!ledger) return null;
  const record = ledger[String(cid)];
  return record && typeof record === 'object'
    ? /** @type {MagicRegimeRecord} */ (record)
    : null;
}

/**
 * True when a record carries nothing worth persisting. A settlement at the BASE
 * regime whose dwell has expired is exactly that: the base rung is the absence of a
 * record, so keeping one would mean a healed world could never return to byte
 * identity with a world that never grew.
 *
 * The dwell is why the predicate needs the tick: a settlement that JUST fell back to
 * subsistence still owes the dwell, and dropping its record would let it re-promote
 * on the very next tick.
 *
 * @param {MagicRegimeRecord|null|undefined} record
 * @param {number} tick
 * @returns {boolean}
 */
export function isMagicRegimeRecordEmpty(record, tick) {
  if (!record || typeof record !== 'object') return true;
  const regime = String(record.regime || '');
  if (regime !== BASE_MAGIC_REGIME) return false;
  const since = Math.trunc(num(record.sinceTick, 0));
  // A base-regime record at tick 0 CANNOT be the result of a demotion: a demotion
  // requires a prior record, and at tick 0 no settlement has one. So sinceTick 0 at
  // the base rung means "never crossed", which owes no dwell and must not be stored.
  if (since <= 0) return true;
  return Math.trunc(num(tick, 0)) - since >= MAGIC_REGIME_TUNING.minDwellTicks;
}

/**
 * Fold a ledger onto a world, DROP-WHEN-EMPTY.
 *
 * An empty ledger is not written as `{}`; the key is dropped outright, and
 * `dropSpatialLedger` drops the whole `spatialLedgers` namespace with it when this
 * was the last sub-ledger. A world every settlement of which sits at subsistence is
 * therefore indistinguishable from a world that never had this layer, which is the
 * byte-identity half of dormancy.
 *
 * Keys fold in codepoint-sorted order so a rebuilt ledger serializes byte-identically
 * to a persisted one.
 *
 * Returns a NEW worldState, or the SAME REFERENCE when there was nothing to drop.
 *
 * @param {Record<string, unknown>} worldState
 * @param {MagicRegimeLedger|null|undefined} ledger
 * @param {number} tick
 * @returns {Record<string, unknown>}
 */
export function writeMagicRegimeLedger(worldState, ledger, tick) {
  /** @type {MagicRegimeLedger} */
  const kept = {};
  for (const cid of Object.keys(asRecord(ledger)).sort()) {
    const record = /** @type {MagicRegimeRecord} */ (
      /** @type {MagicRegimeLedger} */ (ledger)[cid]
    );
    if (isMagicRegimeRecordEmpty(record, tick)) continue;
    kept[cid] = {
      regime: String(record.regime),
      sinceTick: Math.trunc(num(record.sinceTick, 0)),
    };
  }
  if (Object.keys(kept).length === 0) {
    return dropSpatialLedger(worldState, MAGIC_REGIME_LEDGER);
  }
  return setSpatialLedger(worldState, MAGIC_REGIME_LEDGER, kept);
}

/**
 * THE VOCABULARY AUDIT, walker-style and total. A ledger that arrived from disk (or
 * from a save whose vocabulary moved on) can carry a regime word this build does not
 * know, and every rank comparison would silently grade it as the base rung. The audit
 * says so out loud instead.
 *
 * @param {MagicRegimeLedger|null|undefined} ledger
 * @returns {{ ok: boolean, invalid: Array<{ cid: string, regime: string, reason: string }> }}
 */
export function auditMagicRegimeLedger(ledger) {
  /** @type {Array<{ cid: string, regime: string, reason: string }>} */
  const invalid = [];
  for (const cid of Object.keys(asRecord(ledger)).sort()) {
    const record = /** @type {MagicRegimeRecord} */ (
      /** @type {MagicRegimeLedger} */ (ledger)[cid]
    );
    const regime = String(asRecord(record).regime || '');
    if (!MAGIC_REGIMES.includes(regime)) {
      invalid.push({ cid, regime, reason: 'regime is outside the closed ladder' });
      continue;
    }
    if (regime === BASE_MAGIC_REGIME) {
      // A stored base-regime record is legal only while the dwell is unexpired; a
      // permanent one would be the ledger remembering an absence.
      if (!Number.isFinite(Number(asRecord(record).sinceTick))) {
        invalid.push({ cid, regime, reason: 'a base-regime record carries no dwell tick' });
      }
    }
  }
  return { ok: invalid.length === 0, invalid };
}

/**
 * Is the magic economy lane lit for this world? RE-EXPORTED from K1 rather than
 * re-implemented: W-K has ONE gate, and a second `=== true` read in this file would
 * be a second switch that could drift from the first.
 */
export { magicEconomyActive };
