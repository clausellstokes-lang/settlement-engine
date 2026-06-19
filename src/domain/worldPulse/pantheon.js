/**
 * domain/worldPulse/pantheon.js — Feature D / R4: the per-DEITY faith ledger.
 *
 * This is the SAME ratcheted-disposition shape `dispositionLedger.js` instantiates
 * for settlements, instantiated here for DEITIES. An entry accumulates a deity's
 * conversion fortunes and a lazily-derived tier:
 *
 *     worldState.pantheon[deityId] = { wins, losses, seats, tier, tierHeld }
 *
 *  - wins/losses — ratcheted from R2's deity-contest outcomes (a deity that wins a
 *    conversion banks a win; the displaced deity a loss). Reuses the F4 fold idiom:
 *    immutable, bounded, commutative (sorted by deityId so apply order can't change
 *    the result).
 *  - seats — `seatsControlled`: the count of settlements whose embedded
 *    config.primaryDeitySnapshot is this deity, aggregated from the PRE-TICK
 *    snapshot in codepoint-sorted save-id order. NEVER read this-tick's freshly
 *    re-embedded conversions (no intra-tick read-after-write).
 *  - tier — major/minor/cult, a LAZY VIEW of seats (NOT a global per-tick
 *    rebalance). Tier is derived, never the source of truth.
 *  - tierHeld — hysteresis bookkeeping: how many consecutive ticks the deity has
 *    qualified for a DIFFERENT tier than its current one (the dwell counter).
 *
 * CONDITIONAL MATERIALIZATION (byte-identity, sacred). The pantheon is ABSENT from
 * worldState while religion is dormant (no deity / religion off). It exists ONLY
 * when religion is active. An empty pantheon normalizes equal to absent under the
 * dormancy oracle. So a legacy/deity-free campaign carries no `pantheon` key and
 * stays byte-identical. (worldState.js deep-clones a PRESENT pantheon and leaves an
 * ABSENT one absent — never materializes it unconditionally.)
 *
 * DETERMINISM (THE danger zone — religion is MORE connective than war, so cascade
 * and oscillation are the real risks):
 *  - PRE-TICK aggregation only (seats read from the pre-tick snapshot).
 *  - Codepoint-sorted deity-id iteration everywhere output order matters; ties in
 *    tiering broken by codepoint deity ref, never Object.keys() order.
 *  - HYSTERESIS: a deity must clear a tier threshold by a MARGIN and hold the new
 *    qualification for ≥ TIER_HOLD_TICKS before its tier actually changes — a
 *    1-seat swing across a boundary does NOT flip a tier.
 *  - CONTAINMENT CAP: at most MAX_TIER_CHANGES_PER_TICK promotions/demotions land
 *    in any single tick (lowest-magnitude qualifying changes deferred, codepoint
 *    tie-break) so one cult cannot "eat the map" in a tick. The deferred changes do
 *    NOT lose their dwell — they keep their qualifying streak and land on a later
 *    tick, so the pantheon CONVERGES rather than oscillates.
 *
 * Pure: no rng, no wall-clock, no mutation of inputs.
 */

// ── Tier thresholds + hysteresis margins ────────────────────────────────────
// A deity's tier is a lazy view of its seat count. The PROMOTE thresholds are the
// seat counts at which a deity qualifies UP; the DEMOTE thresholds (lower, by the
// hysteresis MARGIN) are where it qualifies DOWN. The gap between them is the
// hysteresis band — inside it the tier is sticky and a 1-seat swing changes
// nothing. (e.g. with MAJOR_PROMOTE 4 / MAJOR_DEMOTE 2, a major at 3 seats holds
// major; it only falls when it drops to ≤2.)
const MINOR_PROMOTE = 2; // cult → minor at ≥2 seats
const MINOR_DEMOTE = 1; //  minor → cult at ≤1 seat
const MAJOR_PROMOTE = 4; // minor → major at ≥4 seats
const MAJOR_DEMOTE = 2; //  major → minor at ≤2 seats

// HYSTERESIS dwell: a deity must hold its new tier QUALIFICATION for this many
// consecutive ticks before the tier actually changes. Combined with the margin
// band above, this is belt-and-suspenders against oscillation — a brief multi-seat
// swing that reverts before the dwell elapses never flips the tier.
const TIER_HOLD_TICKS = 2;

// CONTAINMENT CAP: the maximum number of tier promotions/demotions that may land
// across the WHOLE pantheon in a single tick. Bounds the realm-wide reshuffle so
// one ascendant cult cannot cascade the entire map's tiers in one tick. Excess
// qualifying changes are DEFERRED (they keep their dwell streak, so they converge
// on later ticks) — never dropped.
const MAX_TIER_CHANGES_PER_TICK = 2;

// Per-outcome win/loss step bound, mirroring dispositionLedger's SCORE_MAX so a
// long conversion streak saturates rather than runs away. (The pantheon does not
// expose a centered multiplier — seats drive tiering — but we still bound the
// accumulated counters so the ledger stays finite over a long campaign.)
const COUNT_MAX = 9999;

/** @type {Record<string, number>} */
const TIER_RANK = Object.freeze({ cult: 0, minor: 1, major: 2 });
const TIER_FOR_RANK = Object.freeze(['cult', 'minor', 'major']);

/**
 * The numeric rank of a tier label (cult 0 / minor 1 / major 2). Unknown labels
 * resolve to the cult floor. Total + typed so strict indexing never implies any.
 * @param {string} tier
 * @returns {number}
 */
function tierRank(tier) {
  const r = TIER_RANK[tier];
  return Number.isFinite(r) ? r : 0;
}

/**
 * Whether a tier label is a known tier (vs. a stray/undefined value).
 * @param {string} tier
 * @returns {boolean}
 */
function isKnownTier(tier) {
  return TIER_RANK[tier] != null;
}

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/**
 * A fresh pantheon entry. `tier` defaults to 'cult' (the floor — a deity holding a
 * single seat is a cult until it earns more); tierHeld is the dwell counter.
 * @returns {{ wins: number, losses: number, seats: number, tier: string, tierHeld: number }}
 */
export function createPantheonEntry() {
  return { wins: 0, losses: 0, seats: 0, tier: 'cult', tierHeld: 0 };
}

/**
 * The stable pantheon key for a deity snapshot: its `_deityRef` (the same id
 * SET_PRIMARY_DEITY embeds). Falls back to a stable name-derived ref so a snapshot
 * minted before refs existed still keys consistently. Null for a non-deity.
 * @param {any} deity
 * @returns {string|null}
 */
export function deityIdOf(deity) {
  if (!deity || typeof deity !== 'object') return null;
  const ref = deity._deityRef || deity.primaryDeityRef;
  if (ref) return String(ref);
  const name = String(deity.name || '').trim();
  return name ? `deity:${name}` : null;
}

/**
 * The QUALIFYING tier a deity's seat count argues for, given its CURRENT tier (the
 * hysteresis is current-tier-relative: the promote/demote thresholds differ by the
 * margin band). Pure function of (seats, currentTier) — no dwell, no cap; the
 * dwell/cap discipline is applied by `ratchetPantheonTiers`.
 * @param {number} seats
 * @param {string} currentTier
 * @returns {string}
 */
export function qualifyingTier(seats, currentTier) {
  const n = Number.isFinite(seats) ? Math.max(0, Math.floor(seats)) : 0;
  const cur = isKnownTier(currentTier) ? currentTier : 'cult';
  // Promote checks first (qualify UP only on a decisive seat lead), then demote
  // checks (qualify DOWN only after falling BELOW the lower margin) — the gap
  // between the two thresholds is the sticky hysteresis band.
  if (cur === 'cult') {
    if (n >= MAJOR_PROMOTE) return 'major';
    if (n >= MINOR_PROMOTE) return 'minor';
    return 'cult';
  }
  if (cur === 'minor') {
    if (n >= MAJOR_PROMOTE) return 'major';
    if (n <= MINOR_DEMOTE) return 'cult';
    return 'minor';
  }
  // cur === 'major'
  if (n <= MAJOR_DEMOTE) {
    // A major that collapses straight past the minor band lands at the tier its
    // seats argue for (a hard fall to cult is possible), but never skips the dwell.
    return n <= MINOR_DEMOTE ? 'cult' : 'minor';
  }
  return 'major';
}

/**
 * Accumulate ONE resolved conversion outcome into the pantheon (immutably — returns
 * a NEW ledger). Mirrors `ratchetDisposition`: bounded counters, never mutates.
 * Seats/tier are NOT touched here — they are recomputed from the pre-tick snapshot
 * by `applyPantheonSeats`/`ratchetPantheonTiers`.
 * @param {Record<string, any>} ledger
 * @param {string} deityId
 * @param {{ outcome: 'win'|'loss' }} delta
 * @returns {Record<string, any>}
 */
export function ratchetFaith(ledger, deityId, delta) {
  if (deityId == null || !delta || (delta.outcome !== 'win' && delta.outcome !== 'loss')) return ledger || {};
  const key = String(deityId);
  const prev = (ledger && ledger[key]) || createPantheonEntry();
  return {
    ...(ledger || {}),
    [key]: {
      ...prev,
      wins: Math.min(COUNT_MAX, (Number(prev.wins) || 0) + (delta.outcome === 'win' ? 1 : 0)),
      losses: Math.min(COUNT_MAX, (Number(prev.losses) || 0) + (delta.outcome === 'loss' ? 1 : 0)),
    },
  };
}

/**
 * Fold a list of faith deltas into the pantheon in a deterministic, order-stable
 * way (sorted by deityId so apply order can't change the result — commutative
 * accumulation). Each delta: { deityId, outcome:'win'|'loss' }. Returns a NEW
 * ledger; empty deltas ⇒ the input unchanged (byte-neutral).
 * @param {Record<string, any>} ledger
 * @param {Array<{deityId:string, outcome:'win'|'loss'}>} deltas
 * @returns {Record<string, any>}
 */
export function applyFaithDeltas(ledger, deltas = []) {
  if (!Array.isArray(deltas) || deltas.length === 0) return ledger || {};
  const ordered = [...deltas]
    .filter((d) => d && d.deityId != null && (d.outcome === 'win' || d.outcome === 'loss'))
    .sort((a, b) => codepoint(a.deityId, b.deityId));
  if (!ordered.length) return ledger || {};
  return ordered.reduce((acc, d) => ratchetFaith(acc, d.deityId, d), ledger || {});
}

/**
 * The faith win/loss deltas implied by ONE tick's religious-contest conversions.
 * From each conversion outcome: the WINNING deity (the re-embedded snapshot) banks
 * a win; the DISPLACED deity (the convert's PRE-TICK embedded deity, read from the
 * pre-tick snapshot — NEVER this tick's fresh re-embed) banks a loss. A convert
 * with no prior deity yields only a win (an unclaimed seat, no incumbent to
 * displace). Codepoint-sorted by convert so the delta stream is deterministic.
 *
 * @param {{ outcomes?: any[] }} religion - evaluateReligiousContest result.
 * @param {any} preTickSnapshot - the snapshot the contest ran against (pre re-embed).
 * @returns {Array<{deityId:string, outcome:'win'|'loss'}>}
 */
export function collectFaithDeltas(religion = {}, preTickSnapshot = null) {
  const outcomes = Array.isArray(religion?.outcomes) ? religion.outcomes : [];
  const conversions = outcomes
    .filter((o) => o && o.deityReembed?.snapshot && o.targetSaveId != null)
    .sort((a, b) => codepoint(a.targetSaveId, b.targetSaveId));
  if (!conversions.length) return [];
  /** @type {Array<{deityId:string, outcome:'win'|'loss'}>} */
  const deltas = [];
  for (const o of conversions) {
    const winnerId = deityIdOf(o.deityReembed.snapshot);
    if (winnerId) deltas.push({ deityId: winnerId, outcome: 'win' });
    // The displaced incumbent: the convert's PRE-TICK deity (pre re-embed). Read it
    // off the pre-tick snapshot, never the just-converted settlement state.
    const priorDeity = preTickDeityFor(preTickSnapshot, o.targetSaveId);
    const loserId = deityIdOf(priorDeity);
    // A no-op self-displacement (re-converting to the same deity) is not a loss.
    if (loserId && loserId !== winnerId) deltas.push({ deityId: loserId, outcome: 'loss' });
  }
  return deltas;
}

/**
 * The embedded deity snapshot for a settlement id on the PRE-TICK snapshot (never
 * customContent, never post-tick state). Mirrors religiousContest's reader.
 * @param {any} snapshot
 * @param {any} id
 * @returns {any}
 */
function preTickDeityFor(snapshot, id) {
  const item = snapshot?.byId?.get?.(String(id));
  return item?.settlement?.config?.primaryDeitySnapshot || null;
}

/**
 * Count seatsControlled per deity from the PRE-TICK snapshot, in codepoint-sorted
 * save-id order (deterministic). A seat is a settlement carrying that deity's
 * embedded snapshot. Returns { deityId → seatCount }, only for deities with ≥1
 * seat. Pure; reads only the snapshot.
 * @param {any} snapshot
 * @returns {Record<string, number>}
 */
export function countSeats(snapshot) {
  /** @type {Record<string, number>} */
  const seats = {};
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  // Codepoint-sort the save ids so the iteration order is stable (the counts are
  // commutative, but a sorted scan keeps the aggregation deterministic by contract).
  const sortedIds = items
    .map((/** @type {any} */ item) => String(item?.id))
    .filter((/** @type {string} */ id) => id && id !== 'undefined')
    .sort(codepoint);
  for (const id of sortedIds) {
    const item = snapshot?.byId?.get?.(id);
    const deity = item?.settlement?.config?.primaryDeitySnapshot;
    const did = deityIdOf(deity);
    if (!did) continue;
    seats[did] = (seats[did] || 0) + 1;
  }
  return seats;
}

/**
 * Write the freshly-counted seatsControlled onto the pantheon (immutably). A deity
 * that has a ledger entry but no current seats is set to 0 (it lost its last seat);
 * a deity with seats but no entry yet is materialized with a fresh entry. The tier
 * is NOT recomputed here — `ratchetPantheonTiers` does that with dwell/cap.
 * @param {Record<string, any>} ledger
 * @param {Record<string, number>} seatsByDeity
 * @returns {Record<string, any>}
 */
export function applyPantheonSeats(ledger, seatsByDeity = {}) {
  const base = ledger && typeof ledger === 'object' ? ledger : {};
  /** @type {Record<string, any>} */
  const next = {};
  // Union of existing deity keys + deities holding seats this tick, codepoint-sorted
  // so the object key insertion order is deterministic (byte-stable under stringify).
  const allIds = [...new Set([...Object.keys(base), ...Object.keys(seatsByDeity)])].sort(codepoint);
  for (const id of allIds) {
    const prev = base[id] || createPantheonEntry();
    const seats = Math.max(0, Math.floor(Number(seatsByDeity[id]) || 0));
    next[id] = { ...prev, seats };
  }
  return next;
}

/**
 * Re-derive each deity's tier as a LAZY VIEW of its seatsControlled, applying the
 * HYSTERESIS dwell and the per-tick CONTAINMENT CAP. Returns a NEW ledger.
 *
 *  - For each deity, compute its qualifying tier from (seats, currentTier). If it
 *    equals the current tier, the dwell counter resets to 0 (stable).
 *  - If it differs, the dwell counter increments. The tier only CHANGES once the
 *    dwell reaches TIER_HOLD_TICKS — and only if the per-tick change budget has
 *    room. Changes beyond the cap are DEFERRED: their dwell is preserved (clamped
 *    so it doesn't run away), so they land on a subsequent tick — the pantheon
 *    converges rather than oscillates or cascades.
 *  - The cap prioritizes the LARGEST tier jumps first (a 2-rank collapse before a
 *    1-rank drift), codepoint deity-ref tie-break — never Object.keys() order.
 *
 * @param {Record<string, any>} ledger
 * @returns {{ ledger: Record<string, any>, changes: Array<{deityId:string, from:string, to:string}> }}
 */
export function ratchetPantheonTiers(ledger) {
  const base = ledger && typeof ledger === 'object' ? ledger : {};
  const ids = Object.keys(base).sort(codepoint);

  // Pass 1: compute each deity's qualifying tier + the next dwell counter, WITHOUT
  // applying any change yet. Collect the deities whose dwell has matured to a real
  // pending tier change.
  /** @type {Record<string, { entry: any, qualifies: string, dwell: number, matured: boolean }>} */
  const plan = {};
  /** @type {Array<{ deityId: string, from: string, to: string, jump: number }>} */
  const pending = [];
  for (const id of ids) {
    const prev = base[id] || createPantheonEntry();
    const curTier = isKnownTier(prev.tier) ? prev.tier : 'cult';
    const qualifies = qualifyingTier(prev.seats, curTier);
    if (qualifies === curTier) {
      plan[id] = { entry: prev, qualifies, dwell: 0, matured: false };
      continue;
    }
    // Different qualifying tier — increment the dwell (clamp so a long-deferred
    // change can't ratchet the counter to infinity).
    const dwell = Math.min(TIER_HOLD_TICKS + MAX_TIER_CHANGES_PER_TICK + 1, (Number(prev.tierHeld) || 0) + 1);
    const matured = dwell >= TIER_HOLD_TICKS;
    plan[id] = { entry: prev, qualifies, dwell, matured };
    if (matured) {
      pending.push({ deityId: id, from: curTier, to: qualifies, jump: Math.abs(tierRank(qualifies) - tierRank(curTier)) });
    }
  }

  // Pass 2: apply the CONTAINMENT CAP. Order matured changes by largest jump first
  // (decisive collapses/ascents before minor drift), codepoint deity-ref tie-break.
  // Only the first MAX_TIER_CHANGES_PER_TICK land THIS tick; the rest keep their
  // matured dwell and land on a later tick (convergence, not oscillation).
  pending.sort((a, b) => (b.jump - a.jump) || codepoint(a.deityId, b.deityId));
  const applying = new Set(pending.slice(0, MAX_TIER_CHANGES_PER_TICK).map((p) => p.deityId));

  /** @type {Record<string, any>} */
  const next = {};
  /** @type {Array<{deityId:string, from:string, to:string}>} */
  const changes = [];
  for (const id of ids) {
    const { entry, qualifies, dwell } = plan[id];
    const curTier = isKnownTier(entry.tier) ? entry.tier : 'cult';
    if (applying.has(id)) {
      next[id] = { ...entry, tier: qualifies, tierHeld: 0 };
      changes.push({ deityId: id, from: curTier, to: qualifies });
    } else {
      // No change this tick: keep the current tier; carry the dwell forward (0 if
      // stable, the matured-but-deferred streak otherwise).
      next[id] = { ...entry, tier: curTier, tierHeld: dwell };
    }
  }
  return { ledger: next, changes: changes.sort((a, b) => codepoint(a.deityId, b.deityId)) };
}

/**
 * The full per-tick pantheon write, post-apply (READ-LAST/WRITE-NEXT, mirroring the
 * dispositionStats seam): ratchet this tick's conversion wins/losses, re-count
 * seats from the PRE-TICK snapshot, then re-derive tiers with dwell + cap. Returns
 * the next pantheon and the tier changes (for realm-arc synthesis). Pure.
 *
 * @param {Object} args
 * @param {Record<string, any>} [args.pantheon] - the current (pre-tick) pantheon, or undefined.
 * @param {any} args.snapshot - the PRE-TICK snapshot seats are aggregated from.
 * @param {Array<{deityId:string, outcome:'win'|'loss'}>} [args.faithDeltas]
 * @returns {{ pantheon: Record<string, any>, changes: Array<{deityId:string, from:string, to:string}> }}
 */
export function advancePantheon({ pantheon = {}, snapshot, faithDeltas = [] }) {
  let next = applyFaithDeltas(pantheon, faithDeltas);
  next = applyPantheonSeats(next, countSeats(snapshot));
  const tiered = ratchetPantheonTiers(next);
  return { pantheon: tiered.ledger, changes: tiered.changes };
}

export const PANTHEON_TUNING = Object.freeze({
  MINOR_PROMOTE, MINOR_DEMOTE, MAJOR_PROMOTE, MAJOR_DEMOTE,
  TIER_HOLD_TICKS, MAX_TIER_CHANGES_PER_TICK, TIER_RANK, TIER_FOR_RANK,
});
