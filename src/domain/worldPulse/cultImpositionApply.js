/**
 * domain/worldPulse/cultImpositionApply.js — the cult-imposition APPLIER, as a
 * TRUE dependency-free leaf (imports nothing).
 *
 * Extracted VERBATIM from religionState.js (W2b byte-budget extraction — the
 * domain/deityConstants.js pattern). The IMPOSE_CULT event handler
 * (domain/events/mutateEntities.js) reuses the sim's single-source
 * reconcileCultImposition, and that handler is statically reachable from the
 * eager store via the mutate.js router — so whatever this applier imports lands
 * in the FIRST-PAINT closure. religionState.js pulls relationshipState and the
 * pantheon kernel; the applier needs none of it — only the niche key, the
 * tier-slot table, and the rank-strength table, so those two SMALL data tables
 * are single-sourced HERE and folded back by their original homes:
 *
 *   - SLOTS_BY_TIER       → religionState.js folds it into RELIGION_TUNING
 *   - DEITY_RANK_STRENGTH → pantheon.js folds it into PANTHEON_TUNING
 *
 * religionState.js imports + re-exports every function here verbatim, so every
 * sim consumer (religiousContest, religionLegitimacy, tests) is unchanged and
 * each function/table keeps exactly one source.
 */

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** A deity's niche key — its temperament × alignment. @param {any} d @returns {string} */
export function nicheOf(d) {
  return `${d?.temperamentAxis || 'neutral'}:${d?.alignmentAxis || 'neutral'}`;
}

// Slot capacity per settlement tier (how many faiths the populace sustains).
// Single-sourced here; religionState.js folds it into RELIGION_TUNING so every
// tuning consumer reads the same table.
export const SLOTS_BY_TIER = Object.freeze({ thorp: 1, hamlet: 2, village: 2, town: 3, city: 5, metropolis: 7 });

/** Slot capacity for a settlement tier (how many faiths the populace sustains). @param {string} tier */
export function capacityForTier(tier) {
  return /** @type {Record<string, number>} */ (SLOTS_BY_TIER)[tier] ?? 2;
}

// 0..1 global-rank strength by deity rank (major > minor > cult). Single-sourced
// here; pantheon.js folds it into PANTHEON_TUNING (keyed identically for `tier`
// — the pantheon ledger — and `rankAxis` — the deity snapshot).
export const DEITY_RANK_STRENGTH = Object.freeze({ major: 0.95, minor: 0.6, cult: 0.35 });

/** 0..1 global-rank strength of a deity (major > minor > cult). @param {any} d */
export function deityRankStrength(d) {
  return /** @type {Record<string,number>} */ (DEITY_RANK_STRENGTH)[d?.rankAxis] ?? DEITY_RANK_STRENGTH.minor;
}

/**
 * Reconcile a DM-imposed CULT into a settlement's persistent cult list, honoring
 * tier capacity (the patron reserves one slot) and the one-deity-per-niche rule
 * (temperament × alignment). A large settlement (more slots) hosts cults across the
 * full niche grid; a small one (few slots) reconciles by refusing or evicting the
 * weakest existing cult. PURE: returns the next cult array + an outcome tag; never
 * touches the patron. The incoming `deity` must already be embed-shaped + frozen
 * (the handler owns the field discipline, mirroring setPrimaryDeity).
 * @param {{ patron?: any, cults?: any[], tier?: string, deity: any }} args
 * @returns {{ cults: any[], action: 'added'|'replaced'|'evicted'|'refused', reason: string, evicted: (string|null) }}
 */
export function reconcileCultImposition({ patron = null, cults = [], tier = 'village', deity }) {
  const list = Array.isArray(cults) ? cults.filter(Boolean) : [];
  const ref = String(deity?._deityRef || deity?.name || '');
  if (!ref) return { cults: list, action: 'refused', reason: 'invalid', evicted: null };
  // A deity cannot be both patron and cult.
  if (patron && String(patron._deityRef || patron.name || '') === ref) {
    return { cults: list, action: 'refused', reason: 'is_patron', evicted: null };
  }
  const niche = nicheOf(deity);
  // NOTE: a cult imposed in the PATRON's niche is NOT refused — it enters as a
  // contestant and triggers the seeded patron contest (resolvePatronContest) in the
  // pulse. It still occupies a cult slot, so capacity/eviction below applies.
  // Same-niche existing cult → replace it (idempotent refresh, or a niche swap).
  const sameNicheIdx = list.findIndex((c) => nicheOf(c) === niche);
  if (sameNicheIdx >= 0) {
    const replaced = String(list[sameNicheIdx]?._deityRef || list[sameNicheIdx]?.name || '');
    const next = list.slice();
    next[sameNicheIdx] = deity;
    return { cults: next, action: 'replaced', reason: replaced === ref ? 'refresh' : 'niche_swap', evicted: replaced === ref ? null : replaced };
  }
  // Capacity: total deities (patron + cults) ≤ tier slots ⇒ cult slots = slots − patron.
  const cultCapacity = Math.max(0, capacityForTier(tier) - (patron ? 1 : 0));
  if (list.length < cultCapacity) {
    return { cults: [...list, deity], action: 'added', reason: 'open_slot', evicted: null };
  }
  if (cultCapacity === 0) {
    return { cults: list, action: 'refused', reason: 'no_cult_slots', evicted: null };
  }
  // Capacity full → evict the WEAKEST existing cult (lowest global rank; codepoint
  // tiebreak) so the imposition seats (a small settlement reconciles by displacement).
  const weakest = list.slice().sort((a, b) =>
    (deityRankStrength(a) - deityRankStrength(b)) || codepoint(String(a?._deityRef || a?.name || ''), String(b?._deityRef || b?.name || '')))[0];
  const weakestRef = String(weakest?._deityRef || weakest?.name || '');
  const next = list.filter((c) => String(c?._deityRef || c?.name || '') !== weakestRef);
  return { cults: [...next, deity], action: 'evicted', reason: 'capacity_full', evicted: weakestRef };
}
