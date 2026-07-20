/**
 * institutionRoster.js — the ONE canonical live-institution filter (the RUIN-FILTER
 * accessor; coherence audit R3).
 *
 * A calamity (calamityKernel.ruin), an abandonment (settlementLifecycleFirstClass),
 * or an economic close (institutionLifecycle) leaves a destroyed/closed institution
 * SITTING in `settlement.institutions` — it is never spliced out — but stamped
 * `_worldPulseInactive: true` and a non-active `status` ('ruined' | 'removed' |
 * 'destroyed' | 'remnant'). Every consumer that reads the roster as a set of LIVE
 * FUNCTIONAL PROVIDERS (martial force, faith backing, plague care, reform rolls, …)
 * MUST exclude those, or it credits a flattened building with full function — the
 * ruin-filter defect class. The `_worldPulseInactive` flag is stamped by every
 * inactivating path and is the primary signal; the status-name set is a
 * belt-and-suspenders backstop (mirrors convergence.isStandingInst /
 * institutionLifecycle.activeInstitutions / foodStockpile.transportIsDown, unifying
 * their slightly-divergent spellings into one predicate).
 *
 * NOTE: 'impaired' (corruption) is NOT inactive — an impaired institution still
 * stands and still functions (corruptly), so it stays LIVE here.
 *
 * Pure. No store import. Import this instead of re-spelling the predicate inline; the
 * ruinFilterRoster.walker ratchet forces every new roster aggregator to route here.
 */

/** @typedef {{ status?: unknown, _worldPulseInactive?: unknown, [key: string]: unknown }} InstLike
 *  the loosely-typed institution record (the index signature admits any roster row —
 *  callers hold richer shapes like `{ name, tags, … }` that share no required field). */

/** Non-active statuses that read as a destroyed/closed (non-standing) institution. */
const INACTIVE_STATUS = new Set(['ruined', 'removed', 'destroyed', 'remnant']);

/**
 * True iff an institution is currently STANDING — not calamity-ruined, abandoned, or
 * economically closed. The canonical functional-liveness predicate.
 * @param {InstLike | null | undefined} inst
 * @returns {boolean}
 */
export function isLiveInstitution(inst) {
  if (!inst || typeof inst !== 'object') return false;
  if (inst._worldPulseInactive === true) return false;
  return !INACTIVE_STATUS.has(String(inst.status || 'active').toLowerCase());
}

/**
 * The settlement's institutions filtered to the LIVE ones (calamity-ruined /
 * abandoned / economically-closed rows removed). Use for any functional aggregation
 * over the roster. A non-array roster yields an empty array. Elements are returned as
 * `any` (the institution record shape is loosely typed across the domain — callers
 * read `.name`/`.tags`/`.priorityCategory`/… as they already do on the raw roster).
 * @param {{ institutions?: unknown, [key: string]: unknown } | null | undefined} settlement
 * @returns {any[]}
 */
export function liveInstitutions(settlement) {
  const list = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  return list.filter(isLiveInstitution);
}
