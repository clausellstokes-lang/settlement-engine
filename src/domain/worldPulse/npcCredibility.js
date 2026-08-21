/**
 * domain/worldPulse/npcCredibility.js — DEEP COUPLINGS D-2: PER-NPC CREDIBILITY.
 * (design DESIGN_DEEP_COUPLINGS.md §6 — informationStatecraft × the ladder.)
 *
 * The W-DOCTRINE-2 credibility stock is settlement/observer-scoped: a whole court is
 * discounted when its tellings are proven false. This leaf extends that reputation to
 * the NAMED SPOKESPERSON — the mouthpiece a lying court puts forward, the carrier of a
 * sold or gifted read (D-3). A person caught lying is personally discounted on his next
 * attributed telling (the boy who cried wolf, at soul scale) AND takes a ladder-standing
 * hit (the lie-stigma — a sibling of the corruption stigma), consumed by the ladder's own
 * writer one tick later.
 *
 * THE BOUNDARY (design §0.5, owner ruling 2026-07-19): a personal credibility charge + a
 * lie-stigma standing hit are REPUTATION costs, NOT fate resolutions. Nothing here removes,
 * kills, turns, or disappears the NPC — he lives, schemes, and may claw back to neutral on
 * the generational clock. The statecraft §6 "a named NPC is never burned/turned/executed"
 * law is amended in place (never crossed): per-NPC credibility is its sanctioned province.
 *
 * DORMANCY (constitutional §6): the sub-ledger nests under spatialLedgers.npcCredibility —
 * absent ⇒ byte-identical. Behind the VIRTUAL npcCredibilityEnabled flag (NO entry in
 * DEFAULT_SIMULATION_RULES — the infoStatecraft/ladder idiom). Composed with the statecraft
 * gate by the caller (this leaf's fold is only ever entered from the lit statecraft mover).
 * The weight is centered on 1.0 — EXACTLY 1.0 at a neutral/absent stock — so a materialized-
 * but-neutral ledger is byte-identical to consumers.
 *
 * SELF-CONTAINED (no import cycle): the credibility decay/weight curve is an NPC-SCALE
 * OVERRIDE of the settlement table (design §6 — "the CREDIBILITY_TUNING constants reused
 * with an NPC-scale override table"): the SAME centered-1.0 curve, but a caught lie hits a
 * person's stock one notch HARDER than a court's (personal trust dies faster). Deliberately
 * NOT imported from informationStatecraft.js — that module imports THIS one (the mover fold +
 * the composite weight), so the dependency runs one direction only.
 *
 * PURE + lazy: imported ONLY by lazy engine leaves (the statecraft mover + the ladder
 * kernel). No Date, no Math.random, no tier/auth reads; all folds codepoint-sorted.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger, hasSpatialLedger } from '../spatial/distanceRead.js';
import { clamp, clamp01 } from '../../kernel/math.js';

// ── Small pure helpers (the informationStatecraft idiom, duplicated to avoid the cycle) ──
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── THE GATE ──────────────────────────────────────────────────────────────────
/**
 * Is the per-NPC credibility layer LIT? Reads simulationRules.npcCredibilityEnabled ===
 * true, defensively — ABSENT ⇒ false ⇒ DORMANT (NO entry in DEFAULT_SIMULATION_RULES, so
 * goldens do not move). The caller composes this with infoStatecraftActive (D-2 requires
 * infoStatecraftEnabled ∧ beliefsActive) — this leaf checks only its OWN virtual flag.
 * @param {{ simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @returns {boolean}
 */
export function npcCredibilityActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).npcCredibilityEnabled === true);
}

// ── NPC-SCALE TUNING (the settlement CREDIBILITY_TUNING mirrored, personal-fall steepened) ─
/**
 * @typedef {Object} NpcCredibilityEntry
 * @property {number} score signed [-SCORE_MAX .. +SCORE_MAX]; NEUTRAL 0 ⇒ weight EXACTLY 1.0
 * @property {number} lastUpdateTick
 * @property {{ tick: number, band: number }} [lieExposure] the deposit the ladder consumes
 *   (a fresh lie fronted by this NPC was exposed at `tick`, magnitude `band` 0..4). One-tick
 *   lag by construction: the ladder mints the stigma the tick AFTER exposure (design §6/law 14).
 */
export const NPC_CREDIBILITY_TUNING = Object.freeze({
  // The centered-on-1.0 weight span at saturation (the settlement span, unchanged).
  SCORE_MAX: 12,
  SCORE_SAT: 8,
  // ASYMMETRY: proven-true rises are SLOW (the settlement TRUE_RISE, unchanged); an exposed
  // lie falls SHARP and — the design §6 personal charge — ONE NOTCH steeper than a court's
  // (settlement LIE_FALL 5): personal trust dies faster than a court's.
  TRUE_RISE: 0.6,
  LIE_FALL: 6.5,
  // Generational half-life (ticks) toward neutral, and the lookback past which the mark is
  // spent (the settlement values — a person's paper fades over generations, never forever).
  HALF_LIFE_TICKS: 52,
  MAX_LOOKBACK_TICKS: 260,
  // The read weight discount floor / boost ceiling (the settlement span).
  WEIGHT_FLOOR: 0.35,
  WEIGHT_CEIL: 1.15,
  // Prune an entry whose |decayed score| falls below this AND carries no live deposit.
  PRUNE_EPSILON: 0.05,
  // THE COMPOSITE CLAMP (design §6): an NPC-attributed telling is weighted settlementCred ×
  // npcCred, bounded so neither stock alone can drive belief to zero or to fantasy.
  COMPOSITE_FLOOR: 0.25,
  COMPOSITE_CEIL: 1.5,
});

/**
 * The decayed score of an entry as of `tick` (generational regression toward neutral). Pure,
 * rng-free. Past MAX_LOOKBACK the mark is fully spent (0). @param {NpcCredibilityEntry | null | undefined} entry
 * @param {number} tick @returns {number}
 */
export function decayedNpcCredibilityScore(entry, tick) {
  if (!entry || typeof entry !== 'object') return 0;
  const score = finiteNumber(entry.score, 0);
  if (!score) return 0;
  const age = Math.max(0, Math.floor(finiteNumber(tick, 0)) - Math.floor(finiteNumber(entry.lastUpdateTick, 0)));
  const T = NPC_CREDIBILITY_TUNING;
  if (age > T.MAX_LOOKBACK_TICKS) return 0;
  return score * Math.pow(0.5, age / Math.max(1, T.HALF_LIFE_TICKS));
}

/**
 * The centered-on-1.0 credibility WEIGHT for a signed score. NEUTRAL (0) ⇒ EXACTLY 1.0 (the
 * byte-identity anchor); positive → up to WEIGHT_CEIL; negative → down to WEIGHT_FLOOR.
 * @param {number} score @returns {number}
 */
export function npcCredibilityWeight(score) {
  const s = finiteNumber(score, 0);
  if (!s) return 1.0;
  const T = NPC_CREDIBILITY_TUNING;
  const t = clamp(s / T.SCORE_SAT, -1, 1);
  return t >= 0 ? 1 + (T.WEIGHT_CEIL - 1) * t : 1 + (1 - T.WEIGHT_FLOOR) * t;
}

/**
 * Read an NPC's decayed credibility score from the live ledger (0 when absent — the neutral
 * anchor). @param {{ spatialLedgers?: unknown } | null | undefined} worldState @param {string} nid
 * @param {number} tick @returns {number}
 */
export function npcCredibilityScoreOf(worldState, nid, tick) {
  const ledger = asObject(getSpatialLedger(worldState, 'npcCredibility'));
  const entry = /** @type {NpcCredibilityEntry | undefined} */ (ledger[String(nid)]);
  return decayedNpcCredibilityScore(entry, tick);
}

/**
 * The centered-on-1.0 WEIGHT of an NPC's live stock (1.0 when absent). @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} nid @param {number} tick @returns {number}
 */
export function npcCredibilityWeightOf(worldState, nid, tick) {
  return npcCredibilityWeight(npcCredibilityScoreOf(worldState, nid, tick));
}

/**
 * THE COMPOSITE WEIGHT (design §6 consumption): an NPC-attributed telling is weighted
 * settlementCred × npcCred, clamped [COMPOSITE_FLOOR, COMPOSITE_CEIL]. Both inputs are
 * centered-on-1.0 weights (1.0 = neutral) ⇒ a neutral pair ⇒ EXACTLY 1.0 (byte-identity).
 * @param {number} settlementWeight @param {number} npcWeight @returns {number}
 */
export function compositeCredibilityWeight(settlementWeight, npcWeight) {
  const T = NPC_CREDIBILITY_TUNING;
  const sw = finiteNumber(settlementWeight, 1);
  const nw = finiteNumber(npcWeight, 1);
  return clamp(sw * nw, T.COMPOSITE_FLOOR, T.COMPOSITE_CEIL);
}

/**
 * The fresh lie-exposure deposit the LADDER consumes for an NPC, or null. Returns the
 * {tick, band} ONLY when the deposit is (a) present, (b) NEWER than the last one the ladder
 * already stigmatized (`sinceTick`), and (c) STRICTLY BEFORE `nowTick` (the one-tick lag —
 * statecraft exposes the lie before the ladder runs in the same tick; the scandal reaches the
 * court a week later). Catch-up safe: a collapsed multi-week advance still fires once the
 * deposit tick predates the advance. PURE. @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} nid @param {number} sinceTick @param {number} nowTick
 * @returns {{ tick: number, band: number } | null}
 */
export function freshLieExposureFor(worldState, nid, sinceTick, nowTick) {
  const ledger = asObject(getSpatialLedger(worldState, 'npcCredibility'));
  const entry = /** @type {NpcCredibilityEntry | undefined} */ (ledger[String(nid)]);
  const dep = entry && typeof entry === 'object' ? asObject(entry.lieExposure) : {};
  if (!('tick' in dep)) return null;
  const t = Math.floor(finiteNumber(dep.tick, -1));
  const now = Math.floor(finiteNumber(nowTick, 0));
  const since = Math.floor(finiteNumber(sinceTick, -1));
  if (t <= since || t >= now) return null;
  return { tick: t, band: clamp(Math.round(finiteNumber(dep.band, 0)), 0, 4) };
}

/**
 * One signed NPC-credibility delta to fold this tick. A 'deception' delta that also carries
 * `lieExposedBand` deposits the ladder-consumed lieExposure marker (a lie this NPC fronted
 * was exposed). @typedef {{ id: string, kind: 'proven_true' | 'deception', magnitude01?: number,
 *   lieExposedBand?: number }} NpcCredibilityDelta
 */

/**
 * Fold this tick's NPC-credibility deltas into the ledger: decay every prior entry to `now`,
 * apply the deltas (proven-true SLOW rise, deception SHARP fall, clamped ±SCORE_MAX), stamp
 * the lieExposure deposit for exposed-lie deltas, prune spent marks + vanished NPCs (the
 * roster-scan pin — DM remove_npc leaves no dangling key), persist codepoint-sorted (drop-
 * when-empty ⇒ byte-identical-dormant). DORMANT (flag dark) ⇒ an immediate no-op.
 *
 * `liveNpcIds`, when provided, is the complete set of npcIds present across the roster this
 * tick: an entry whose id is ABSENT is pruned regardless of score (a removed NPC's paper is
 * discarded). Omitted ⇒ prune by decay only (the safe default).
 * @param {Object} args
 * @param {{ spatialLedgers?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} args.worldState
 * @param {number} args.tick
 * @param {NpcCredibilityDelta[]} [args.deltas]
 * @param {Set<string> | null} [args.liveNpcIds]
 * @returns {{ worldState: unknown, changed: boolean }}
 */
export function advanceNpcCredibility({ worldState, tick, deltas = [], liveNpcIds = null }) {
  if (!npcCredibilityActive(worldState)) {
    return { worldState, changed: false };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const T = NPC_CREDIBILITY_TUNING;
  const prior = asObject(getSpatialLedger(worldState, 'npcCredibility'));
  const roster = liveNpcIds instanceof Set ? liveNpcIds : null;

  // Decay every prior entry to `now`, carrying the decayed score + any live lieExposure
  // deposit forward. A vanished NPC (absent from the roster) is dropped outright.
  /** @type {Map<string, number>} */
  const scores = new Map();
  /** @type {Map<string, { tick: number, band: number }>} */
  const deposits = new Map();
  for (const id of Object.keys(prior).sort(compareCodepoint)) {
    if (roster && !roster.has(id)) continue; // roster-scan prune (remove_npc ⇒ no dangling key)
    const entry = /** @type {NpcCredibilityEntry} */ (prior[id]);
    const decayed = decayedNpcCredibilityScore(entry, now);
    if (decayed !== 0) scores.set(id, decayed);
    const dep = asObject(entry && entry.lieExposure);
    if ('tick' in dep) {
      deposits.set(id, { tick: Math.floor(finiteNumber(dep.tick, now)), band: clamp(Math.round(finiteNumber(dep.band, 0)), 0, 4) });
    }
  }

  // Fold the deltas, id-sorted then signed-magnitude (permutation-independent under the
  // ±SCORE_MAX clamp — the advanceCredibility discipline). Deception deltas that carry a
  // lieExposedBand overwrite the lieExposure deposit (the freshest exposure wins).
  const signedOf = (/** @type {NpcCredibilityDelta} */ d) => {
    const mag = clamp01(finiteNumber(d.magnitude01, 1));
    return d.kind === 'proven_true' ? T.TRUE_RISE * mag : -T.LIE_FALL * mag;
  };
  const ordered = (Array.isArray(deltas) ? deltas : [])
    .filter((d) => d && d.id != null && (d.kind === 'proven_true' || d.kind === 'deception'))
    .sort((a, b) => compareCodepoint(String(a.id), String(b.id)) || (signedOf(a) - signedOf(b)));
  for (const d of ordered) {
    const key = String(d.id);
    if (roster && !roster.has(key)) continue; // never resurrect a pruned NPC
    const next = clamp((scores.get(key) || 0) + signedOf(d), -T.SCORE_MAX, T.SCORE_MAX);
    scores.set(key, next);
    if (d.kind === 'deception' && d.lieExposedBand != null) {
      deposits.set(key, { tick: now, band: clamp(Math.round(finiteNumber(d.lieExposedBand, 0)), 0, 4) });
    }
  }

  // Rebuild codepoint-sorted; prune spent marks (|score| < epsilon AND no live deposit).
  /** @type {Record<string, NpcCredibilityEntry>} */
  const next = {};
  const ids = new Set([...scores.keys(), ...deposits.keys()]);
  for (const id of [...ids].sort(compareCodepoint)) {
    const score = round4(scores.get(id) || 0);
    const dep = deposits.get(id) || null;
    // A deposit lingers only until it has aged out of the lookback (else it is spent noise).
    const depLive = !!dep && (now - dep.tick) <= T.MAX_LOOKBACK_TICKS;
    if (Math.abs(score) < T.PRUNE_EPSILON && !depLive) continue;
    /** @type {NpcCredibilityEntry} */
    const entry = { score, lastUpdateTick: now };
    if (depLive && dep) entry.lieExposure = { band: dep.band, tick: dep.tick };
    next[id] = entry;
  }

  const hasNext = Object.keys(next).length > 0;
  const prevSerialized = JSON.stringify(Object.keys(prior).length ? prior : null);
  const nextSerialized = JSON.stringify(hasNext ? next : null);
  if (prevSerialized === nextSerialized) {
    return { worldState, changed: false };
  }
  const ws = /** @type {Record<string, unknown>} */ (worldState);
  const nextWorldState = hasNext
    ? setSpatialLedger(ws, 'npcCredibility', next)
    : dropSpatialLedger(ws, 'npcCredibility');
  return { worldState: nextWorldState, changed: true };
}

/** True when a materialized npcCredibility ledger exists (the ladder's cheap pre-check).
 *  @param {{ spatialLedgers?: unknown } | null | undefined} worldState @returns {boolean} */
export function hasNpcCredibilityLedger(worldState) {
  return hasSpatialLedger(worldState, 'npcCredibility');
}
