/**
 * satellitesLedger.js — THE STEADING PEN'S LEDGER HALF (chair ruling CR-WR10-I).
 *
 * `spatialLedgers.satellites` is where a parent's steadings live: a record keyed by
 * parent id, each cell holding its steading rows plus the seeding integrator's own
 * state. This leaf owns the LEDGER: how it is read, how a row moves between parents,
 * and — from this ruling forward — the ONE call that folds it back onto a worldState.
 * The RECORD is still the kernel's: `mintSteading` in settlementLifecycleKernel.js
 * authors what a steading row contains, and nothing here mints one.
 *
 * ── WHY IT LEFT THE KERNEL, MEASURED RATHER THAN ASSERTED ────────────────────────
 *
 * The WR-10 wiring wave mounts the sovereignty market stage inside
 * `settlementLifecycleKernel.js` (the demographics precedent: a plan-lane sibling,
 * its own flag read before the host's gate). That stage consults `sovereigntyIntent`,
 * and the import graph turns out to run all the way home:
 *
 *   sovereigntyIntent.js → peaceReasons.js → peaceTerms.js
 *                        → sovereigntyTransfer.js → settlementLifecycleKernel.js
 *
 * — a path executed against the tree, not inferred. `sovereigntyTransfer.js` was the
 * ONLY edge from the 35-module worldPulse cycle family back into the lifecycle kernel,
 * and it existed for exactly one symbol: `conveySteading`. Left in place, mounting the
 * stage would have pulled the kernel (and demography behind it) into that cycle family,
 * which is the dist chunk-cycle TDZ class this estate has already been made un-bootable
 * by once. Moving the ledger half here severs that single edge, so the kernel's
 * relationship to the cycle family becomes one-way and stays that way.
 *
 * ── AND WHY THIS IS A RATCHET-DOWN RATHER THAN A THIRD AUTHORITY ─────────────────
 *
 * `tests/lint/satellitesLedgerWriters.walker.test.js` is a SHRINK-ONLY census of which
 * files may call `setSpatialLedger(…, 'satellites', …)`, and its fear is precise: the
 * orbit rule (unique per parent), the parent key and the cell's drop-when-empty law are
 * authored in code and validated NOWHERE at load time, so a second authority is free to
 * disagree with all three and still produce a ledger that serializes, round-trips and
 * reads back. A naive extraction would have made this file a THIRD such authority and
 * widened a shrink-only ratchet — the thing that census exists to refuse.
 *
 * So the extraction went the other way: `foldSatellitesLedger` below is now the ONE
 * write, and the kernel's advance and the FORCE_FOUND_STEADING verb both route their
 * folds through it. The census RATCHETS DOWN from two authorities to one, and the
 * property it was defending stops being a count and becomes a fact.
 *
 * PURE + DEPENDENCY-FREE by design: it imports only the ledger namespace primitives
 * (`distanceRead.js`, itself import-free), so it can never be the module that closes a
 * cycle. No rng, no wall-clock, no mutation of its inputs.
 */
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';

/**
 * One satellite steading record (SUB-SETTLEMENT — never a digest member, never a
 * mover-loop member, no npc roster).
 * @typedef {Object} SatelliteRecord
 * @property {string} id            deterministic (`steading.<parent>.<tick>`)
 * @property {string} name          seeded from NAMING_DATA on the satellite fork
 * @property {string} parentId
 * @property {'thorp'|'hamlet'} tier the in-orbit ladder (village ⇒ CHARTER-PENDING)
 * @property {number} population    integer; every head debited from the parent
 * @property {number} foundedTick
 * @property {'growth'|'resource_strike'|'resettlement'|'forced'} provenance
 * @property {string} [resourceKey] the struck vein a mining-camp exists for
 * @property {{ cell: number, landform: string, cost: number, source: 'gate_terrain'|'cost_band' }} [site]
 *   W-E: the sampled ground. Present ONLY when a frozen spatial digest was active
 *   at the founding; the cell is a READ key into the frozen rasters and is never
 *   written back to them (a satellite is never a digest member).
 * @property {string[]} [resources] W-E: starting resources derived from `site`
 *   through the existing RESOURCE_DATA vocabulary (closed; absent when aspatial)
 * @property {number} orbit         cosmetic orbit slot (deterministic, unique per parent)
 * @property {{ fromId: string, tick: number }} [conveyed] WR-10: SALE PROVENANCE.
 *   Present ONLY on a steading that changed hands through a sovereignty transfer;
 *   drop-when-absent, so every steading that was never sold is byte-identical to
 *   pre-WR-10. A satellite has no relationship object, no seat and no legitimacy
 *   score, so "the sold settlement has an opinion" is structurally empty for it until
 *   graduation — this field is how the grievance survives the gap: at the charter it
 *   folds into `parentRef` and matures through the WR-3 seam.
 * @property {number} inflow        cumulative in-migration tally (people moved in)
 * @property {number} backing01     last computed backing read (display/receipt)
 * @property {number} [starvingSince] tick stamp — the decline dwell (catch-up-safe)
 * @property {boolean} [charterPending] village scale reached; awaits the V2 charter
 * @property {number} [charterPendingSince]
 * @property {string[]} history     bounded chronicle lines (slice cap)
 */
/** @typedef {{ seedAcc?: number, lastSeedTick?: number, steadings: Record<string, SatelliteRecord> }} ParentSatellites */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** Codepoint comparator (device/locale-stable ordering).
 *  @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The satellites ledger (`spatialLedgers.satellites`), or null when absent.
 *  @param {Record<string, unknown>|null|undefined} worldState
 *  @returns {Record<string, ParentSatellites>|null} */
export function satellitesLedgerOf(worldState) {
  const led = getSpatialLedger(/** @type {Record<string, unknown>} */ (worldState || {}), 'satellites');
  return led && typeof led === 'object' && !Array.isArray(led)
    ? /** @type {Record<string, ParentSatellites>} */ (led)
    : null;
}

/** Every satellite of one parent, codepoint-ordered by id (deterministic iteration).
 *  @param {Record<string, ParentSatellites>|null} ledger @param {string} parentId
 *  @returns {SatelliteRecord[]} */
export function satellitesOf(ledger, parentId) {
  const entry = ledger ? ledger[parentId] : null;
  const steadings = entry && entry.steadings && typeof entry.steadings === 'object' ? entry.steadings : {};
  return Object.keys(steadings).sort(codepoint).map((k) => steadings[k]).filter(Boolean);
}

/**
 * THE ONE WRITE (CR-WR10-I). Fold a rebuilt satellites ledger back onto a worldState,
 * dropping the namespace key entirely when nothing is left — the conditional-ledger
 * law this ledger has always obeyed (dormant ⇒ absent ⇒ prior bytes), now stated once
 * instead of at each call site.
 *
 * Every caller that used to spell the fold itself routes here, so the shrink-only
 * writer census has ONE member and the drop-when-empty rule cannot be forgotten by a
 * new call site. Callers that can never hand it an empty ledger (the force-found verb
 * just added a cell) get identical bytes: the branch simply does not fire.
 *
 * @param {Record<string, unknown>} worldState
 * @param {Record<string, unknown>|null|undefined} ledger the REBUILT ledger
 * @returns {Record<string, unknown>}
 */
export function foldSatellitesLedger(worldState, ledger) {
  return ledger && Object.keys(ledger).length
    ? setSpatialLedger(worldState, 'satellites', ledger)
    : dropSpatialLedger(worldState, 'satellites');
}

/**
 * Move ONE steading from its seller's cell to its buyer's, inside the existing
 * satellites ledger (WR-10 amendment S — the conveyance's satellite arm).
 *
 * ORBIT IS RE-DERIVED AT THE DESTINATION, and that is the whole reason a row-move is
 * not a key-move. `orbit` is unique per PARENT by mint-time search, and B3's
 * convergence scan folds pairs whose orbits differ by at most one — so a naive move
 * that carried the seller's slot across would collide with a steading the buyer
 * already holds and then mis-drive adjacency, merging two settlements that were never
 * neighbours. The search here is `mintSteading`'s, verbatim.
 *
 * The seller's cell is dropped only when it holds NOTHING — no steadings AND no
 * seeding integrator state. B5's fold keeps a cell alive for a live cooldown or a warm
 * accumulator, and deleting it here would hand the seller a free re-founding as a side
 * effect of a sale.
 *
 * Never written: the steading's population (people do not move because a deed did),
 * its founding tick, its history, or anything at all outside this ledger.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} assetId the steading's record id
 * @param {string} fromParentId @param {string} toParentId @param {number} tick
 * @returns {{ worldState: Record<string, unknown>, record: SatelliteRecord } | null}
 *   null when the row is not where the caller said it was, or the parents are the same.
 */
export function conveySteading(worldState, assetId, fromParentId, toParentId, tick) {
  const ledger = satellitesLedgerOf(worldState);
  const source = ledger ? ledger[fromParentId] : null;
  const prior = source?.steadings?.[assetId];
  if (!ledger || !prior || !toParentId || fromParentId === toParentId) return null;
  const usedOrbits = new Set(satellitesOf(ledger, toParentId).map((r) => num(r.orbit, 0)));
  let orbit = 0;
  while (usedOrbits.has(orbit)) orbit += 1;
  const record = /** @type {SatelliteRecord} */ ({
    ...prior, parentId: toParentId, orbit, conveyed: { fromId: fromParentId, tick },
  });
  const sellerSteadings = { ...(source.steadings || {}) };
  delete sellerSteadings[assetId];
  const next = { ...ledger, [toParentId]: {
    ...(ledger[toParentId] || { steadings: {} }),
    steadings: { ...(ledger[toParentId]?.steadings || {}), [assetId]: record },
  } };
  // Drop the seller's cell only when it holds NOTHING (B5's own law: a live cooldown
  // or a warm accumulator keeps a cell alive even with no steadings left).
  if (Object.keys(sellerSteadings).length || source.seedAcc !== undefined || source.lastSeedTick !== undefined) {
    next[fromParentId] = { ...source, steadings: sellerSteadings };
  } else delete next[fromParentId];
  return { worldState: foldSatellitesLedger(worldState, next), record };
}
