/**
 * domain/worldPulse/dispositionLedger.js — the ONE ratcheted disposition ledger.
 *
 * A single shape + ratchet, instantiated TWICE:
 *  - worldState.dispositionStats — per settlement (Feature C: aggressiveness memory)
 *  - worldState.pantheon         — per deity     (Feature D / R4: faith fortunes)
 *
 * An entry accumulates a signed win/loss `score`; `readDispositionMultiplier` turns
 * it into a centered-on-1.0 multiplier — EXACTLY 1.0 when the entry is absent or
 * net-zero, which is what keeps a legacy campaign (empty ledger) byte-identical at
 * the candidateBase chokepoint. Pure: no rng, no wall-clock, no mutation of inputs.
 *
 * Read/write timing (pinned across the substrate): callers READ last-tick ledger at
 * candidate-build and WRITE next-tick post-apply, so a contest that resolves on tick
 * N only colours behaviour from tick N+1 — never a half-updated mid-tick read.
 */

// Multiplier shape: ±MULTIPLIER_SPAN at full saturation, reached as |score| → SCORE_SAT.
const MULTIPLIER_SPAN = 0.5;
const SCORE_SAT = 8;
// Per-outcome score step; bounded accumulation so a long win streak saturates
// rather than exploding (determinism + balance: no runaway disposition).
const SCORE_MAX = 12;

export function createLedgerEntry() {
  return { wins: 0, losses: 0, score: 0 };
}

/**
 * @param {any} entry
 * @returns {number}
 */
function entryScore(entry) {
  if (!entry) return 0;
  if (Number.isFinite(entry.score)) return entry.score;
  return (Number(entry.wins) || 0) - (Number(entry.losses) || 0);
}

/**
 * Centered-on-1.0 disposition multiplier for an entity. Absent / net-zero ⇒ exactly
 * 1.0. A positive score (won its contests / aggressive history) yields > 1.0; a
 * negative score yields < 1.0. Saturates smoothly toward 1 ± MULTIPLIER_SPAN.
 * @param {Record<string, any>} ledger
 * @param {string} id
 * @returns {number}
 */
export function readDispositionMultiplier(ledger, id) {
  const entry = ledger && id != null ? ledger[String(id)] : null;
  const score = entryScore(entry);
  if (!score) return 1.0;
  const t = Math.max(-1, Math.min(1, score / SCORE_SAT));
  return 1.0 + MULTIPLIER_SPAN * t;
}

/**
 * Accumulate one resolved outcome into the ledger (immutably — returns a NEW
 * ledger). magnitude defaults to 1; the running score is clamped to ±SCORE_MAX so
 * disposition saturates rather than runs away.
 * @param {Record<string, any>} ledger
 * @param {string} id
 * @param {{ outcome: 'win'|'loss', magnitude?: number }} delta
 * @returns {Record<string, any>}
 */
export function ratchetDisposition(ledger, id, delta) {
  if (id == null || !delta || (delta.outcome !== 'win' && delta.outcome !== 'loss')) return ledger || {};
  const key = String(id);
  const prev = (ledger && ledger[key]) || createLedgerEntry();
  const mag = Number.isFinite(delta.magnitude) ? Math.max(0, Number(delta.magnitude)) : 1;
  const signed = delta.outcome === 'win' ? mag : -mag;
  const nextScore = Math.max(-SCORE_MAX, Math.min(SCORE_MAX, entryScore(prev) + signed));
  return {
    ...(ledger || {}),
    [key]: {
      wins: (Number(prev.wins) || 0) + (delta.outcome === 'win' ? 1 : 0),
      losses: (Number(prev.losses) || 0) + (delta.outcome === 'loss' ? 1 : 0),
      score: nextScore,
    },
  };
}

/**
 * Fold a list of disposition deltas into the ledger in a deterministic, order-
 * stable way (sorted by id so apply order can't change the result for commutative
 * accumulation). Each delta: { id, outcome:'win'|'loss', magnitude? }. Returns a
 * NEW ledger. Empty deltas ⇒ the input ledger unchanged (byte-neutral) — this is
 * the no-op the F4 post-apply seam relies on until contests (C1+) emit deltas.
 * @param {Record<string, any>} ledger
 * @param {Array<{id:string, outcome:'win'|'loss', magnitude?:number}>} deltas
 * @returns {Record<string, any>}
 */
export function applyDispositionDeltas(ledger, deltas = []) {
  if (!Array.isArray(deltas) || deltas.length === 0) return ledger || {};
  const ordered = [...deltas]
    .filter((d) => d && d.id != null)
    .sort((a, b) => (String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0));
  return ordered.reduce((acc, d) => ratchetDisposition(acc, d.id, d), ledger || {});
}

/**
 * Build the per-entity factor map consumed at candidate-build: { id → multiplier }.
 * Only entities whose multiplier differs from 1.0 are included, so a legacy/empty
 * (or net-zero) ledger yields {} — and every candidate factor defaults to exactly
 * 1.0, keeping the pulse byte-identical. Pure, order-independent (object).
 * @param {Record<string, any>} ledger
 * @returns {Record<string, number>}
 */
export function dispositionFactorMap(ledger) {
  /** @type {Record<string, number>} */
  const out = {};
  if (!ledger || typeof ledger !== 'object') return out;
  for (const id of Object.keys(ledger)) {
    const m = readDispositionMultiplier(ledger, id);
    if (m !== 1.0) out[id] = m;
  }
  return out;
}

export const DISPOSITION_TUNING = Object.freeze({ MULTIPLIER_SPAN, SCORE_SAT, SCORE_MAX });
