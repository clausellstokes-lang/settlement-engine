/**
 * demographicsObservation.js — WAVE P4 (THE WORLD'S HAND), THE INSTRUMENT.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §6 (realm self-sufficiency, realmPressure) is this
 * file's contract, and the certification row for `demographicsEnabled` is its reason.
 *
 * THE ROW HAD NO CHANNEL, AND THIS FILE IS WHY IT NOW DOES. Wave P3 declared
 * `spatialLedgers.demographicPlans` on that row and the corpus guard refused it,
 * correctly: a channel declared a slice before its reader exists is a claim rather
 * than evidence. This file is the reader. Two halves:
 *
 *   1. THE CENSUS HALF, which needed no new code and needed to be VERIFIED rather than
 *      assumed: `censusWorldStateKeys` (scripts/audit/behavioral-observation.mjs) walks
 *      one level into `spatialLedgers`, so the plan ledger the P3 writer materializes
 *      is enumerated into `subsystems.stateKeys` as `spatialLedgers.demographicPlans`
 *      by every v5 envelope, with `stateKeysComplete: true` making its ABSENCE
 *      dispositive too. The channel is readable the moment a v5 receipt exists.
 *   2. THE REALM HALF, which is this module: the demographic step's per-settlement
 *      receipts are dropped at applyPulseMover (that seam forwards `newsEntries` and
 *      nothing else), so the numbers the step settled were unobservable at realm scale.
 *      `observeRealmDemography` re-derives them from the SAME pure reads the kernel
 *      used and emits them as ONE additive yearly field, exactly as J2's
 *      `realmSelfSufficiency` does and for the same stated reason.
 *
 * ADDITIVE, CONDITIONAL, AND NULL WHEN DARK. A dormant world returns null and the
 * observation drops the key entirely rather than recording a zero, because a
 * realmPressure of 0 would read as a realm with infinite slack rather than as an
 * instrument that was never switched on. That is the J2 precedent verbatim, and it is
 * what the certification row's gated-emission invariant checks for.
 *
 * REALM PRESSURE IS A MOTIVE INPUT AND NEVER A RISK INPUT. Design law 6 says
 * carrying-capacity pressure feeds the war, trade and expansion MOTIVE weights inside
 * authored caps; design law 5 says a curb is a world event with incidence coupled to
 * DEMOGRAPHIC STATE, never a hidden balancing hand. The two must not be confused, so
 * this module's realm total is read by demographicsWar.js (motive) and by nothing in
 * demographicsRisk.js (incidence) — a source scan pins that separation, because a
 * realm-total term inside an incidence deriver IS the hidden governor the law forbids.
 *
 * Pure leaf: no store, no React, no clock, no randomness, no I/O, no writes.
 *
 * @enforced-by tests/domain/demographicsWorldsHand.test.js
 */

import { clamp } from '../../kernel/math.js';
import {
  DEMOGRAPHIC_TUNING,
  demographicsActive,
  densityCeilingOf,
  effectiveBoundOf,
  foodCapacityOf,
} from './demographicsRates.js';
import { ladderCensus } from './demographicsLadder.js';

/** @typedef {import('./demographicsRates.js').DemoSettlement} DemoSettlement */
/** @typedef {{ id: string, settlement: DemoSettlement|null }} DemoMember */

/** The observation's own schema version, bumped only on a breaking shape change. */
export const REALM_DEMOGRAPHY_VERSION = 1;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4dp, so the field compares by value across machines */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** Codepoint comparator (device/locale-stable ordering). @param {string} a @param {string} b */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * @typedef {Object} RealmDemography
 * @property {number} schemaVersion
 * @property {string} kind                 always 'realm_demography'
 * @property {number} settlements          how many members carried a readable head count
 * @property {number} population           Sigma population
 * @property {number} capacity             Sigma K_food over the members whose food is known
 * @property {number} bound                Sigma min(K_food, D_tier)
 * @property {number} realmPressure01       Sigma pop / Sigma K_food, bounded to [0, PRESSURE_MAX]
 * @property {number} loadRatio01          Sigma pop / Sigma bound, bounded the same way
 * @property {number} foodKnownSettlements how many members carried real food physics
 * @property {Record<string, number>} binding  how many members each bound is the wall for
 * @property {Record<string, number>} ladder   the §7b viability census
 */

/**
 * THE BOUNDED REALM METRIC (design §6): `realmPressure01 = Sigma pop / Sigma K_food`.
 *
 * BOUNDED BY CONSTRUCTION, on the same clamp the per-settlement read uses, so the
 * realm reading and the settlement reading share one scale and one ceiling. An empty
 * denominator (no member carries food physics) reads 0 rather than dividing: a realm
 * whose food is unknown is not a realm under infinite pressure.
 *
 * @param {ReadonlyArray<DemoMember>} members
 * @param {{ spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined} worldState
 * @returns {RealmDemography}
 */
export function measureRealmDemography(members, worldState) {
  const list = Array.isArray(members) ? members : [];
  /** @type {Record<string, number>} */
  const binding = { granary: 0, walls: 0 };
  let population = 0;
  let capacity = 0;
  let boundTotal = 0;
  let counted = 0;
  let foodKnown = 0;

  for (const member of [...list].sort((a, b) => codepoint(String(asObject(a).id), String(asObject(b).id)))) {
    const id = asObject(member).id != null ? String(asObject(member).id) : '';
    if (!id) continue;
    const settlement = /** @type {DemoSettlement|null} */ (asObject(member).settlement || null);
    const pop = Math.max(0, Math.round(num(asObject(settlement).population, 0)));
    const food = foodCapacityOf(settlement, worldState, id);
    const bound = effectiveBoundOf(food, densityCeilingOf(settlement, worldState, id));
    counted += 1;
    population += pop;
    boundTotal += bound.bound;
    binding[bound.binding] = num(binding[bound.binding], 0) + 1;
    if (bound.foodKnown) {
      foodKnown += 1;
      capacity += bound.foodCapacity;
    }
  }

  return {
    schemaVersion: REALM_DEMOGRAPHY_VERSION,
    kind: 'realm_demography',
    settlements: counted,
    population,
    capacity,
    bound: boundTotal,
    realmPressure01: capacity > 0
      ? round4(clamp(population / capacity, 0, DEMOGRAPHIC_TUNING.PRESSURE_MAX))
      : 0,
    loadRatio01: boundTotal > 0
      ? round4(clamp(population / boundTotal, 0, DEMOGRAPHIC_TUNING.PRESSURE_MAX))
      : 0,
    foodKnownSettlements: foodKnown,
    binding,
    ladder: ladderCensus(list, worldState),
  };
}

/**
 * Normalize the soak harness's save rows into the member shape this module reads. The
 * same tolerant shape J2's `selfSufficiencyMembersFromSaves` accepts, so one harness
 * row feeds both observers without either owning the other's spelling.
 * @param {ReadonlyArray<unknown>|null|undefined} saves
 * @returns {DemoMember[]}
 */
export function demographyMembersFromSaves(saves) {
  /** @type {DemoMember[]} */
  const out = [];
  for (const entry of Array.isArray(saves) ? saves : []) {
    const save = asObject(entry);
    const id = save.id != null ? String(save.id) : save.saveId != null ? String(save.saveId) : '';
    if (!id) continue;
    const settlement = /** @type {DemoSettlement} */ (
      save.settlement && typeof save.settlement === 'object' ? save.settlement : save);
    out.push({ id, settlement });
  }
  return out;
}

/**
 * Normalize a pulse snapshot's settlement items into the same member shape, so the
 * in-pulse motive read and the out-of-pulse observation read cannot diverge.
 * @param {{ settlements?: ReadonlyArray<{ id?: string|number, settlement?: DemoSettlement|null }> }|null|undefined} snapshot
 * @returns {DemoMember[]}
 */
export function demographyMembersFromSnapshot(snapshot) {
  /** @type {DemoMember[]} */
  const out = [];
  for (const item of Array.isArray(asObject(snapshot).settlements)
    ? /** @type {Array<Record<string, unknown>>} */ (asObject(snapshot).settlements)
    : []) {
    const id = asObject(item).id != null ? String(asObject(item).id) : '';
    if (!id) continue;
    out.push({ id, settlement: /** @type {DemoSettlement|null} */ (asObject(item).settlement || null) });
  }
  return out;
}

/**
 * THE PER-PULSE EMISSION (design §6). Returns null on a DARK world, which is how the
 * observation surface drops the key entirely rather than recording a zero.
 * @param {{ worldState: Record<string, unknown>|null|undefined,
 *   saves: ReadonlyArray<unknown>|null|undefined }} input
 * @returns {RealmDemography|null}
 */
export function observeRealmDemography(input) {
  // The defensive `asObject` read erases the declared shape, so every field is restored
  // to the type this function's own @param already contracts for — the idiom the
  // worldState argument below has used since P4 landed, applied to all three reads.
  if (!demographicsActive(
    /** @type {Record<string, unknown>|null|undefined} */ (asObject(input).worldState))) return null;
  return measureRealmDemography(
    demographyMembersFromSaves(
      /** @type {ReadonlyArray<unknown>|null|undefined} */ (asObject(input).saves)),
    /** @type {Record<string, unknown>} */ (asObject(input).worldState),
  );
}
