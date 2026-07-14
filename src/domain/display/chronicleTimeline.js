/**
 * domain/display/chronicleTimeline.js — read-side projection that merges a
 * campaign's `chronicles[]` (AI prose) and `pulseHistory[]` (the per-tick world
 * pulse records) into ONE scrubbable, tick-indexed timeline for the Realm
 * Chronicle scrollback.
 *
 * Today the Chronicle surface shows only `chronicles[0]` (the latest prose) and
 * the latest pulse. This selector exposes the FULL history, grouped by tick, so the
 * scrollback can scrub across every advance. For each tick it surfaces:
 *   - the prose chronicle entries authored at that tick (if any)
 *   - the pulse record's headline outcomes + impact digest ("what changed & why")
 *   - the AFFECTED settlement ids (for click → highlight on the map)
 *
 * Per-variable causal diffs use the engine's `compareCausalState` directly via
 * `tickCausalDiff` — applied only when before/after causal snapshots are supplied.
 *
 * INERT WHEN DORMANT. A fresh campaign (no chronicles, no pulse history) yields an
 * EMPTY timeline ⇒ the scrollback renders its empty state ⇒ byte-identical
 * off-state. Pure, rng-free, no mutation. Newest-tick-first ordering is stable.
 */

import { compareCausalState, deriveCausalState } from '../causalState.js';

/** @param {any} v @returns {number} */
const tickOf = (v) => (Number.isFinite(v?.tick) ? Number(v.tick) : 0);

/**
 * The merged, tick-grouped timeline (newest tick first). Each entry collects the
 * prose chronicles + the pulse record + the affected settlement ids for that tick.
 *
 * @param {Object} args
 * @param {Array<{ id?: string, tick?: number, prose?: string, createdAt?: string }>} [args.chronicles]
 * @param {Array<any>} [args.pulseHistory]  the worldState.pulseHistory records
 * @returns {Array<{
 *   tick: number,
 *   chronicles: Array<{ id?: string, tick?: number, prose?: string, createdAt?: string }>,
 *   pulse: any | null,
 *   headlines: Array<{ id?: string, headline: string, summary: string, settlementIds: string[], severity: number|null }>,
 *   affectedSettlementIds: string[],
 * }>}
 */
export function chronicleTimeline({ chronicles, pulseHistory } = /** @type {any} */ ({})) {
  const proseList = Array.isArray(chronicles) ? chronicles : [];
  const pulses = Array.isArray(pulseHistory) ? pulseHistory : [];

  /** @type {Map<number, { tick: number, chronicles: any[], pulse: any, headlines: any[], affected: Set<string> }>} */
  const byTick = new Map();
  const slot = (/** @type {number} */ tick) => {
    let s = byTick.get(tick);
    if (!s) { s = { tick, chronicles: [], pulse: null, headlines: [], affected: new Set() }; byTick.set(tick, s); }
    return s;
  };

  for (const entry of proseList) {
    if (!entry?.prose) continue;
    slot(tickOf(entry)).chronicles.push(entry);
  }

  for (const pulse of pulses) {
    const s = slot(tickOf(pulse));
    // Last write wins for a given tick (one pulse record per tick).
    s.pulse = pulse;
    // Headlines: the pulse's selected outcomes (most material first) + the impact
    // digest. Each carries the settlements it touched so a click can highlight them.
    const outcomes = Array.isArray(pulse?.selectedOutcomes) ? pulse.selectedOutcomes : [];
    for (const o of outcomes) {
      const settlementIds = collectSettlementIds(o);
      settlementIds.forEach(id => s.affected.add(id));
      s.headlines.push({
        id: o.id,
        headline: o.headline || 'World pulse outcome',
        summary: o.summary || '',
        settlementIds,
        severity: Number.isFinite(o.severity) ? o.severity : null,
      });
    }
    const digest = Array.isArray(pulse?.impactDigest) ? pulse.impactDigest : [];
    for (const d of digest) {
      const ids = (Array.isArray(d.settlementIds) ? d.settlementIds : []).map((/** @type {any} */ x) => String(x));
      ids.forEach((/** @type {string} */ id) => s.affected.add(id));
    }
  }

  return [...byTick.values()]
    .map(s => ({
      tick: s.tick,
      chronicles: s.chronicles,
      pulse: s.pulse,
      headlines: s.headlines.slice(0, 12),
      affectedSettlementIds: [...s.affected].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
    }))
    .sort((a, b) => b.tick - a.tick);
}

/**
 * The settlement ids one pulse outcome touched — its direct target plus its
 * population-delta keys. Deduped, string-typed. Deliberately does NOT source ids
 * from `powerTransfer.losers`: those entries are display NAMES (warDeployment.js
 * mints them via settlementNameFor), not save ids, so folding them in poisoned
 * affectedSettlementIds — the click-to-highlight received names as ids and no-oped.
 * Mirrors worldSnapshotPublic.collectAffectedIds, its public sibling. (domain-readmodels-1)
 * @param {any} outcome
 * @returns {string[]}
 */
function collectSettlementIds(outcome) {
  const ids = new Set();
  if (outcome?.targetSaveId != null) ids.add(String(outcome.targetSaveId));
  const popDeltas = outcome?.populationDeltas;
  if (popDeltas && typeof popDeltas === 'object') {
    for (const key of Object.keys(popDeltas)) ids.add(String(key));
  }
  return [...ids];
}

/**
 * The per-variable causal diff for one tick — a thin pass-through to the engine's
 * `compareCausalState` so the scrollback's "what changed & why" reads the SAME
 * deltas + reason strings the dossier "What changed" panel uses. Returns [] when
 * either snapshot is absent (the common case for a tick with no causal capture).
 *
 * @param {any} beforeCausal  a deriveCausalState result (scores/bands)
 * @param {any} afterCausal   a deriveCausalState result (scores/bands)
 * @returns {ReturnType<typeof compareCausalState>}
 */
export function tickCausalDiff(beforeCausal, afterCausal) {
  return compareCausalState(beforeCausal, afterCausal);
}

/**
 * components-dossier-7: build the ChronicleScrollback's per-tick causal-diff supplier
 * (`Map<tick, { before, after }>`) from EXISTING SESSION data — the pulse undo stack —
 * with ZERO engine, persist, or schema change. Each undo snapshot is the PRE-pulse
 * member-settlement state at its tick; the current live saves are the "after" of the
 * latest advance. Consecutive frames (each snapshot's saves, then the live saves)
 * bracket each advance, and we derive the causal state of the member whose state moved
 * the MOST that advance — the shift worth showing — keyed by the pulse's RESULTING
 * tick so it aligns with the timeline.
 *
 * Because the undo stack is capped and one snapshot covers a whole multi-tick advance,
 * coverage is the recent, bracketable ticks only; every other tick's diff self-hides
 * (compareCausalState over an absent frame ⇒ []), exactly as before. Pure — deriving
 * causal state is memoized on settlement identity, so cloned snapshot settlements
 * simply miss the memo and re-derive (byte-identical to a fresh derive).
 *
 * @param {{ snapshots?: Array<{ tick?: number, saves?: CausalSave[] }>,
 *   liveSaves?: CausalSave[], currentTick?: number }} [args]
 * @returns {Map<number, CausalFramePair>}
 */
export function causalByTickFromSnapshots(args = {}) {
  const { snapshots, liveSaves, currentTick } = args || {};
  /** @type {Map<number, CausalFramePair>} */
  const map = new Map();
  const snaps = Array.isArray(snapshots) ? snapshots : [];
  const frames = snaps.map(sn => ({ tick: tickOf(sn), saves: Array.isArray(sn?.saves) ? sn.saves : [] }));
  frames.push({ tick: Number.isFinite(currentTick) ? Number(currentTick) : 0, saves: Array.isArray(liveSaves) ? liveSaves : [] });
  for (let i = 0; i < frames.length - 1; i++) {
    const entry = pickMaxCausalChange(frames[i].saves, frames[i + 1].saves);
    // The advance from frame i lands ON frame i+1's tick — key the diff there.
    if (entry) map.set(frames[i + 1].tick, entry);
  }
  return map;
}

/**
 * @typedef {{ id?: string|number, settlement?: object }} CausalSave  one member save frame.
 * @typedef {{ before: object, after: object }} CausalFramePair  before/after causal states.
 */

/**
 * The member whose causal state moved the MOST between two frames, as
 * `{ before, after }` causal states (or null when nothing moved / no member matched
 * by id across both frames). Deterministic — ties resolve to the first max by id order.
 * @param {CausalSave[]} beforeSaves
 * @param {CausalSave[]} afterSaves
 * @returns {CausalFramePair | null}
 */
function pickMaxCausalChange(beforeSaves, afterSaves) {
  const beforeById = new Map((beforeSaves || []).map(sv => [String(sv?.id), sv?.settlement]));
  /** @type {CausalFramePair | null} */
  let best = null;
  let bestScore = 0;
  for (const a of afterSaves || []) {
    const beforeSettlement = beforeById.get(String(a?.id));
    if (!beforeSettlement || !a?.settlement) continue;
    const before = deriveCausalState(beforeSettlement);
    const after = deriveCausalState(a.settlement);
    const score = compareCausalState(before, after).reduce((n, dlt) => n + Math.abs(Number(dlt?.change) || 0), 0);
    if (score > bestScore) { bestScore = score; best = { before, after }; }
  }
  return best;
}

/**
 * Whether a campaign has ANY timeline content (prose or pulse history) — the gate
 * the scrollback uses to decide between the live timeline and its empty state. A
 * fresh campaign yields false ⇒ empty ⇒ byte-identical.
 * @param {Object} args
 * @param {Array<any>} [args.chronicles]
 * @param {Array<any>} [args.pulseHistory]
 * @returns {boolean}
 */
export function hasTimeline({ chronicles, pulseHistory } = /** @type {any} */ ({})) {
  const proseList = Array.isArray(chronicles) ? chronicles : [];
  const pulses = Array.isArray(pulseHistory) ? pulseHistory : [];
  return proseList.some(c => c?.prose) || pulses.length > 0;
}
