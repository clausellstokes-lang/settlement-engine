/**
 * vengeanceLicense.js — WR-8 amendment R2: THE VENGEANCE LICENSE, and the ledger
 * that remembers it.
 *
 * "A razing mints a durable world fact — a license held by every settlement whose
 * relationship to the VICTIM stands at or above the adequacy band. The license
 * legitimizes ONE war of retribution whose razing intent is unlocked for the
 * license-holder REGARDLESS of alignment — ONE PER COALITION prosecuting it,
 * executed ONCE."
 *
 * ── WHY THIS MODULE MAY WRITE PERSISTENT STATE AT ALL (chair ruling CR-WR8-E,
 * 2026-08-03, vetoable) ────────────────────────────────────────────────────────
 * The same chair block that opened WR-8's gate REFUSED the D5 `undying`
 * memoryHorizon arm, on the ground that the razing must not become the engine's
 * first author of a new persistence surface. That refusal does NOT cover this
 * ledger, and the distinguishing test is stated rather than assumed:
 * memoryHorizon had NO ratified lifecycle spec, while the vengeance license's
 * persistence is volume-architected IN FULL — the spatialLedgers family, a JSON
 * round-trip, regen and undo carrying the license WITH the record rather than
 * re-deriving it from the chronicle, import validating it, and expiry as a READ
 * against `heldSince` ticks rather than a stored countdown. A persistence
 * surface whose complete lifecycle the owner-ratified volume specifies may build
 * dark and vetoable; one it never specified may not.
 *
 * THAT RULING IS ALSO A CEILING, and this file is written to sit under it. Every
 * lifecycle path below is one the volume named. Nothing here versions, migrates,
 * compacts, or re-derives — because the volume said nothing about any of those,
 * and inventing them is exactly what the ruling forbids.
 *
 * ── THE FIVE LIFECYCLE PATHS, EACH TRACED ───────────────────────────────────
 * CREATE   `mintVengeanceLicenses` on a razing, to victim-adequate holders only.
 * READ     `readVengeanceLicenses` / `heldLicense` — both VALIDATING (below).
 * PERSIST  the ledger is a `spatialLedgers` sub-ledger, so it rides the world
 *          state's own JSON serialization with no bespoke save code at all.
 * REGEN +  the pulse-undo snapshot parks a copy of `worldState`, and regeneration
 * UNDO     carries `worldState` forward, so the ledger travels WITH the record.
 *          Nothing in this file reads the chronicle, so nothing can re-derive a
 *          license — which is the volume's own words, made structural.
 * IMPORT   `validateVengeanceLicense` refuses malformed and forged records.
 *
 * ⚠️ VALIDATION IS AT THE READ, NOT ONLY AT THE DOOR. The volume says "import
 * validates it", and an import-only validator is a guarantee that holds exactly
 * as long as every future loader remembers to call it. So the validator runs
 * inside `readVengeanceLicenses`, which every consumer goes through: a forged
 * record cannot arm anybody no matter which road put it in the save. This is
 * strictly stronger than the spec and costs one filter.
 *
 * ── THE CLOSED LOOP IS THE LOAD-BEARING REFUSAL ─────────────────────────────
 * "A JUST razing discharges the license and MINTS NO NEW ONE — the sacked
 * razer's allies gain nothing, vengeance is a settlement not a chain reaction,
 * and the eye-for-an-eye cascade is structurally impossible." `mintVengeanceLicenses`
 * therefore takes the razing's ROAD and returns the world state UNCHANGED — the
 * same reference — when the road is `vengeance`. The cascade is not damped; it
 * cannot start.
 *
 * ── DORMANCY (constitutional §6) ────────────────────────────────────────────
 * The sub-ledger nests under `spatialLedgers.vengeanceLicenses` — absent means
 * byte-identical. Behind the VIRTUAL `conquestDoctrineEnabled` flag, which has no
 * entry in DEFAULT_SIMULATION_RULES. THE CALLER COMPOSES THE FULL CHAIN: WR-8
 * lights only behind WR-1/WR-2/WR-6/WR-7 and demographics, and
 * `conquestDoctrineActive` in `conquestDoctrineStage.js` is the single source for
 * that conjunction. This leaf checks only its OWN flag — the npcCredibility
 * idiom — so that it does not drag the belief map into its closure; a pin holds
 * the two together rather than a comment.
 *
 * PURE + deterministic: no rng, no wall-clock, no mutation of any input. Every
 * fold is codepoint-sorted so a ledger serializes identically on every machine.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { INTERVAL_WEEKS } from './intervalWeeks.js';

/** The sub-ledger's key. Registered in `src/lib/spatialUsage.js`'s manifest. */
export const VENGEANCE_LICENSE_LEDGER_KEY = 'vengeanceLicenses';

/** Why a license is no longer live, as a closed vocabulary. */
export const LICENSE_DEAD_REASONS = Object.freeze([
  'consumed', 'expired', 'extinguished',
]);

export const VENGEANCE_LICENSE_TUNING = Object.freeze({
  // ⚠️ THE SAME ONE BAND R's extremity composite uses (CR-WR8-B: "one band
  // reused, none minted"). Spelled here rather than imported so this module
  // keeps its light closure; a pin holds the two numbers equal, which is the
  // conquestExecution/occupation-ladder precedent for a re-declared constant.
  ADEQUACY_01: 0.6,
  // THE GENERATIONAL BAND. "Vengeance is patient but not eternal; an heir may
  // collect what a father was owed, and a century-old license is a legend, not a
  // law." Two generations, on the canonical 52-week year (WR-9's own ruling on
  // which constant defines a year) — long enough for the heir, short enough that
  // the century mark is out of reach, in a product whose scope is sub-century.
  EXPIRY_YEARS: 60,
  TICKS_PER_YEAR: INTERVAL_WEEKS.one_year,
  EXPIRY_TICKS: 60 * INTERVAL_WEEKS.one_year,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {boolean} a whole tick index, zero allowed */
function isTick(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/** @param {unknown} value @returns {boolean} a tick index, or an honest null */
function isTickOrNull(value) {
  return value === null || isTick(value);
}

// ── THE GATE ──────────────────────────────────────────────────────────────────

/**
 * Is the license layer LIT? Reads `conquestDoctrineEnabled === true`,
 * defensively — ABSENT means false means DORMANT, because the flag has no entry
 * in DEFAULT_SIMULATION_RULES and goldens must not move.
 *
 * THE CALLER COMPOSES THE REST. WR-8's full lighting order lives in
 * `conquestDoctrineStage.conquestDoctrineActive`, and duplicating its eight-flag
 * conjunction here would create a second spelling that could drift. This checks
 * only the layer's own flag.
 * @param {unknown} worldStateOrRules
 * @returns {boolean}
 */
export function vengeanceLicensesActive(worldStateOrRules) {
  const root = asObject(worldStateOrRules);
  const rules = Object.prototype.hasOwnProperty.call(root, 'simulationRules')
    ? asObject(root.simulationRules)
    : root;
  return rules.conquestDoctrineEnabled === true;
}

// ── THE RECORD, AND WHAT MAKES ONE FORGED ────────────────────────────────────

/**
 * @typedef {Object} VengeanceLicense
 * @property {string} id
 * @property {string} razerId          who burned
 * @property {string} victimId         what was burned
 * @property {number} heldSince        the tick the razing happened
 * @property {string[]} holders        victim-adequate ids, codepoint-sorted
 * @property {string|null} consumedBy  the ONE coalition that prosecuted it
 * @property {number|null} consumedAtTick
 * @property {number|null} extinguishedAtTick
 */

/**
 * THE IMPORT REFUSAL. A license is a capability — it unlocks the razing intent
 * for a court that could not otherwise reach it, at ANY alignment — so a forged
 * one is the single most valuable thing an edited save could contain. This
 * checks SHAPE and INTERNAL COHERENCE, both:
 *
 *   shape      every field present and of its own type; holders a non-empty
 *              array of non-empty strings.
 *   coherence  a razer is not its own victim; a razer does not hold a license
 *              against itself; consumption is ALL-OR-NOTHING (a record with a
 *              consuming coalition but no tick, or the reverse, is incoherent
 *              and is exactly the shape a hand-edit produces); and no timestamp
 *              precedes the razing that minted it.
 *
 * The coherence half is what makes this more than a type check. A forger who
 * gets the shape right still has to get the story right.
 *
 * @param {unknown} raw
 * @returns {boolean}
 */
export function validateVengeanceLicense(raw) {
  const row = asObject(raw);
  const id = text(row.id);
  const razerId = text(row.razerId);
  const victimId = text(row.victimId);
  if (!id || !razerId || !victimId) return false;
  if (razerId === victimId) return false;
  if (!isTick(row.heldSince)) return false;
  if (!Array.isArray(row.holders) || row.holders.length === 0) return false;
  for (const holder of row.holders) {
    if (!text(holder)) return false;
    // A razer cannot hold the right of vengeance for its own atrocity.
    if (holder === razerId) return false;
  }
  const consumedBy = row.consumedBy;
  if (consumedBy !== null && !text(consumedBy)) return false;
  // W8-D F1 — THE CONSUMER MUST BE A HOLDER. A license is a CAPABILITY, and a
  // capability is spent by whoever holds it or by nobody. Without this line a record
  // could name any court as its consumer, so "executed ONCE" was enforced against the
  // wrong party: the writer refused a second spend, but the first spend needed no
  // entitlement at all, and a stranger — or the razer's own friend — could burn the
  // avengers' right without ever having been minted it. The story has to be as
  // coherent as the shape.
  if (consumedBy !== null && !row.holders.includes(consumedBy)) return false;
  if (!isTickOrNull(row.consumedAtTick)) return false;
  // ALL-OR-NOTHING: both, or neither.
  if ((consumedBy === null) !== (row.consumedAtTick === null)) return false;
  if (!isTickOrNull(row.extinguishedAtTick)) return false;
  const heldSince = /** @type {number} */ (row.heldSince);
  if (row.consumedAtTick !== null && /** @type {number} */ (row.consumedAtTick) < heldSince) return false;
  if (row.extinguishedAtTick !== null
    && /** @type {number} */ (row.extinguishedAtTick) < heldSince) return false;
  return true;
}

// ── READ ─────────────────────────────────────────────────────────────────────

/**
 * EVERY READ IS A VALIDATING READ. Returns a codepoint-sorted map of the records
 * that survive validation; a malformed or forged record is simply not there, so
 * no consumer can be armed by one.
 * @param {unknown} worldState
 * @returns {Record<string, VengeanceLicense>}
 */
export function readVengeanceLicenses(worldState) {
  const ledger = asObject(getSpatialLedger(
    /** @type {Record<string, unknown>} */ (asObject(worldState)),
    VENGEANCE_LICENSE_LEDGER_KEY,
  ));
  /** @type {Record<string, VengeanceLicense>} */
  const out = {};
  for (const key of Object.keys(ledger).sort(compareCodepoint)) {
    const row = ledger[key];
    if (!validateVengeanceLicense(row)) continue;
    out[key] = /** @type {VengeanceLicense} */ (row);
  }
  return out;
}

/**
 * EXPIRY IS A READ, NEVER A STORED COUNTDOWN (the volume's own words). Nothing
 * ticks this ledger down; the age is computed from `heldSince` whenever somebody
 * asks, which is why a license survives a save, a load, an undo and a
 * regeneration without anybody having to remember to age it.
 * @param {{ heldSince?: unknown }|null|undefined} license @param {unknown} tick
 * @returns {boolean}
 */
export function licenseExpired(license, tick) {
  const heldSince = asObject(license).heldSince;
  if (!isTick(heldSince)) return true;
  const now = Number(tick);
  if (!Number.isFinite(now)) return true;
  return now - /** @type {number} */ (heldSince) > VENGEANCE_LICENSE_TUNING.EXPIRY_TICKS;
}

/**
 * Why this license is not live, or null when it is.
 * @param {VengeanceLicense|null|undefined} license @param {unknown} tick
 * @returns {string|null} one of LICENSE_DEAD_REASONS
 */
export function licenseDeadReason(license, tick) {
  const row = asObject(license);
  if (row.consumedBy != null) return 'consumed';
  if (row.extinguishedAtTick != null) return 'extinguished';
  if (licenseExpired(/** @type {VengeanceLicense} */ (license), tick)) return 'expired';
  return null;
}

/**
 * THE LIVE LICENSE one holder carries against one razer, or null.
 *
 * This is the boolean `razingGate` consumes as `licenseHeld`, and the separation
 * is deliberate: the GATE decides what a license unlocks and knows nothing about
 * persistence, while THIS decides whether one exists and knows nothing about
 * razing. Neither can quietly become the other.
 *
 * @param {unknown} worldState
 * @param {{ holderId?: unknown, razerId?: unknown, tick?: unknown }} query
 * @returns {VengeanceLicense|null}
 */
export function heldLicense(worldState, query) {
  const q = asObject(query);
  const holderId = text(q.holderId);
  const razerId = text(q.razerId);
  if (!holderId || !razerId) return null;
  const licenses = readVengeanceLicenses(worldState);
  for (const key of Object.keys(licenses).sort(compareCodepoint)) {
    const license = licenses[key];
    if (license.razerId !== razerId) continue;
    if (!license.holders.includes(holderId)) continue;
    if (licenseDeadReason(license, q.tick) !== null) continue;
    return license;
  }
  return null;
}

// ── CREATE ───────────────────────────────────────────────────────────────────

/**
 * WHO IS MINTED A LICENSE. Two filters, and the second is CR-WR8-A's:
 *
 *   (1) adequacy to the VICTIM at or above the one band — allies, close friends,
 *       patrons; lineage kin qualify, because the same edge that mints the
 *       lineage claim carries the right of vengeance.
 *   (2) AN EXISTING EDGE WITH THE RAZER. "A razing mints no edge to strangers."
 *       Relationship states exist per regional-graph neighbour edge, and a
 *       would-be avenger with no edge to the razer has no object that could ever
 *       reach the coupled extreme — so arming it would be arming a court that
 *       structurally cannot collect. The candidate is refused at the mint rather
 *       than left to fail silently at the gate.
 *
 * The razer is never a holder, whatever the caller hands in.
 * @param {Array<{ holderId?: unknown, adequacyToVictim01?: unknown,
 *   sharesEdgeWithRazer?: unknown }>} candidates
 * @param {string} razerId
 * @returns {string[]} codepoint-sorted holder ids
 */
export function licenseHoldersFrom(candidates, razerId) {
  const T = VENGEANCE_LICENSE_TUNING;
  const rows = Array.isArray(candidates) ? candidates : [];
  /** @type {Set<string>} */
  const holders = new Set();
  for (const raw of rows) {
    const row = asObject(raw);
    const holderId = text(row.holderId);
    if (!holderId || holderId === razerId) continue;
    const adequacy = Number(row.adequacyToVictim01);
    if (!Number.isFinite(adequacy) || adequacy < T.ADEQUACY_01) continue;
    if (row.sharesEdgeWithRazer !== true) continue;
    holders.add(holderId);
  }
  return [...holders].sort(compareCodepoint);
}

/**
 * MINT, on a razing. Returns a NEW world state, or THE SAME REFERENCE when
 * nothing is minted — so a dormant or refusing pass is byte-identical rather
 * than merely equal.
 *
 * ⚠️⚠️ THE CLOSED LOOP LIVES HERE AND NOWHERE ELSE. A razing whose road is
 * `vengeance` mints NOTHING: "the sacked razer's allies gain nothing... the
 * eye-for-an-eye cascade is structurally impossible." This is a refusal at the
 * only door that can create a license, so the cascade cannot start rather than
 * being damped after it does.
 *
 * @param {{ worldState?: unknown, razerId?: unknown, victimId?: unknown,
 *   tick?: unknown, road?: unknown, candidates?: unknown }} input
 * @returns {Record<string, unknown>} the world state, new or unchanged
 */
export function mintVengeanceLicenses(input) {
  const row = asObject(input);
  const worldState = /** @type {Record<string, unknown>} */ (asObject(row.worldState));
  if (!vengeanceLicensesActive(worldState)) return worldState;
  // THE CLOSED LOOP.
  if (text(row.road) === 'vengeance') return worldState;
  if (text(row.road) !== 'initiation') return worldState;
  const razerId = text(row.razerId);
  const victimId = text(row.victimId);
  if (!razerId || !victimId || razerId === victimId) return worldState;
  if (!isTick(row.tick)) return worldState;
  const tick = /** @type {number} */ (row.tick);
  const holders = licenseHoldersFrom(
    /** @type {Array<Record<string, unknown>>} */ (row.candidates), razerId,
  );
  // Nobody loved the victim enough, or nobody who did shares a border with the
  // razer. A friendless settlement is cheap to burn — which is honest, dark, and
  // exactly the incentive landscape the amendment named.
  if (holders.length === 0) return worldState;

  const id = `vengeance_license.${razerId}.${victimId}.${tick}`;
  const existing = asObject(getSpatialLedger(worldState, VENGEANCE_LICENSE_LEDGER_KEY));
  // IDEMPOTENT: the same razing re-processed on a replayed tick does not mint a
  // second license, and does not widen the first one's holders behind the world's
  // back.
  if (Object.prototype.hasOwnProperty.call(existing, id)) return worldState;

  /** @type {VengeanceLicense} */
  const license = {
    id,
    razerId,
    victimId,
    heldSince: tick,
    holders,
    consumedBy: null,
    consumedAtTick: null,
    extinguishedAtTick: null,
  };
  /** @type {Record<string, unknown>} */
  const next = {};
  for (const key of [...Object.keys(existing), id].sort(compareCodepoint)) {
    next[key] = key === id ? license : existing[key];
  }
  return setSpatialLedger(worldState, VENGEANCE_LICENSE_LEDGER_KEY, next);
}

// ── CONSUME, EXTINGUISH, PRUNE ───────────────────────────────────────────────

/**
 * CONSUME: one HOLDER coalition, once. "The license is CONSUMED on use."
 *
 * A second attempt — by the same coalition or any other — returns the world state
 * UNCHANGED, which is what "ONE PER COALITION prosecuting it, executed ONCE"
 * means when it is a fact about a writer rather than a convention.
 *
 * W8-D F1 — AND THE CONSUMER MUST HOLD IT. The one-shot was enforced against the
 * wrong party: any coalition id at all could spend the license, so a court that was
 * never minted the right could burn it and every real avenger would find it dead.
 * A capability is spent by its holder or by nobody. This gate and the matching
 * coherence line in validateVengeanceLicense MUST move together — the validator
 * refuses a non-holder consumption on READ, so a writer that still minted one would
 * produce a record the next validating read silently DROPS, taking the license out
 * of the world entirely and reopening the gate it was supposed to have closed.
 *
 * @param {{ worldState?: unknown, licenseId?: unknown, coalitionId?: unknown,
 *   tick?: unknown }} input
 * @returns {Record<string, unknown>}
 */
export function consumeVengeanceLicense(input) {
  const row = asObject(input);
  const worldState = /** @type {Record<string, unknown>} */ (asObject(row.worldState));
  const licenseId = text(row.licenseId);
  const coalitionId = text(row.coalitionId);
  if (!licenseId || !coalitionId || !isTick(row.tick)) return worldState;
  const tick = /** @type {number} */ (row.tick);
  const licenses = readVengeanceLicenses(worldState);
  const license = licenses[licenseId];
  if (!license) return worldState;
  if (!license.holders.includes(coalitionId)) return worldState; // not yours to spend
  if (licenseDeadReason(license, tick) !== null) return worldState;
  if (tick < license.heldSince) return worldState;

  /** @type {Record<string, unknown>} */
  const next = { ...licenses };
  next[licenseId] = { ...license, consumedBy: coalitionId, consumedAtTick: tick };
  return setSpatialLedger(worldState, VENGEANCE_LICENSE_LEDGER_KEY, next);
}

/**
 * EXTINGUISH: "or extinguished if the razer is destroyed by any other road."
 * The debt dies with the debtor; a court cannot collect vengeance from a realm
 * somebody else already ended.
 * @param {{ worldState?: unknown, razerId?: unknown, tick?: unknown }} input
 * @returns {Record<string, unknown>}
 */
export function extinguishLicensesAgainst(input) {
  const row = asObject(input);
  const worldState = /** @type {Record<string, unknown>} */ (asObject(row.worldState));
  const razerId = text(row.razerId);
  if (!razerId || !isTick(row.tick)) return worldState;
  const tick = /** @type {number} */ (row.tick);
  const licenses = readVengeanceLicenses(worldState);
  /** @type {Record<string, unknown>} */
  const next = {};
  let touched = false;
  for (const key of Object.keys(licenses).sort(compareCodepoint)) {
    const license = licenses[key];
    if (license.razerId === razerId && licenseDeadReason(license, tick) === null) {
      next[key] = { ...license, extinguishedAtTick: tick };
      touched = true;
    } else {
      next[key] = license;
    }
  }
  if (!touched) return worldState;
  return setSpatialLedger(worldState, VENGEANCE_LICENSE_LEDGER_KEY, next);
}

/**
 * PRUNE the dead. Drops consumed, expired and extinguished records, and DROPS
 * THE WHOLE SUB-LEDGER when nothing live remains — so a world that has finished
 * with vengeance is byte-identical to one that never knew it. That identity is
 * the dormancy law applied to the ledger's own end of life, not just its start.
 * @param {{ worldState?: unknown, tick?: unknown }} input
 * @returns {Record<string, unknown>}
 */
export function pruneVengeanceLicenses(input) {
  const row = asObject(input);
  const worldState = /** @type {Record<string, unknown>} */ (asObject(row.worldState));
  const raw = asObject(getSpatialLedger(worldState, VENGEANCE_LICENSE_LEDGER_KEY));
  const rawKeys = Object.keys(raw);
  if (rawKeys.length === 0) return worldState;
  const licenses = readVengeanceLicenses(worldState);
  /** @type {Record<string, unknown>} */
  const next = {};
  for (const key of Object.keys(licenses).sort(compareCodepoint)) {
    if (licenseDeadReason(licenses[key], row.tick) === null) next[key] = licenses[key];
  }
  const nextKeys = Object.keys(next);
  if (nextKeys.length === rawKeys.length && rawKeys.every((k) => next[k] === raw[k])) {
    return worldState;
  }
  if (nextKeys.length === 0) return dropSpatialLedger(worldState, VENGEANCE_LICENSE_LEDGER_KEY);
  return setSpatialLedger(worldState, VENGEANCE_LICENSE_LEDGER_KEY, next);
}
