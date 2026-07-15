/**
 * domain/worldPulse/warReasons.js — W-PEACE-1: THE CAUSAL REASONS LAYER (war side)
 * + the shared reason substrate both sides ride (DESIGN_PEACE_ENGINE.md §14).
 *
 * REASONS FOR WAR are typed, bounded, receipted contributors — the causalState
 * per-contributor idiom extended to war willingness (§14 ARCHITECTURE). Every
 * reason is recomputed each tick FROM EXISTING STATE (state-derived, so decay is
 * inherent: when the underlying state clears, the record drops — §14.2 "REASONS
 * DECAY AND RESOLVE"), folded into a conditionally-materialized ledger
 * (spatialLedgers.warReasons) keyed by DIRECTED pair `${from}>${to}` — from's
 * accumulated case for war against to. `sinceTick` survives the refold so the
 * irony surface can say how long a reason has stood.
 *
 * THE SYMMETRY LAW (§14.3): war and peace reasons are equally robust, equally
 * typed, equally receipted. The shared substrate here (record shape, fold,
 * aggregate, factor) is imported by peaceReasons.js so the two sides CANNOT
 * drift in shape; REASON_MIRRORS is the §14.3 walker table (wave-1 provisional
 * pairing — see the note on the table) and tests assert totality + bijection +
 * count parity.
 *
 * CONSTITUTIONAL POSTURE (design §8 + the wave-1 brief):
 *   - GATE: peaceCausalActive(worldState) — warLayerEnabled === true AND
 *     peaceEngineEnabled === true, both read fail-closed off
 *     worldState.simulationRules. peaceEngineEnabled is a VIRTUAL flag: NO
 *     default is added to DEFAULT_SIMULATION_RULES (the constructiveFlowsActive
 *     idiom), so every existing golden — including the warLayerEnabled: true
 *     belief/spatial goldens — is byte-identical. Gate absent ⇒ immediate
 *     no-op: zero forks, zero ledger keys.
 *   - ACCUMULATION IS DETERMINISTIC: no rng anywhere in this module — reasons
 *     are reads, not rolls. The §H loaded draw that CONSUMES them is the
 *     existing settlementStrategy softmax (the weights ARE the reasons).
 *   - Ledger writes ride getSpatialLedger/setSpatialLedger/dropSpatialLedger
 *     (drop-when-empty at every level; absent ⇒ byte-identical; zero eager
 *     first-paint bytes — the spatialLedgers family carries the name).
 *
 * REGISTRATION SEAMS (typed now, fed later — both CONFIRMED absent upstream):
 *   - treaty_default: no treaties ledger exists yet (the W-PEACE treaty waves
 *     build it). scoreTreatyDefault is the registered scorer; the kernel passes
 *     `undefined` today ⇒ 0 ⇒ no record. When the treaties ledger lands, feed
 *     it through collectWarReasonInputs.treaties.
 *   - corruption_exposed: the W-DOCTRINE hook. scoreCorruptionExposed is the
 *     registered scorer; the kernel passes `undefined` today ⇒ 0 ⇒ no record.
 *     W-DOCTRINE feeds revealed foreign-corruption magnitudes through
 *     collectWarReasonInputs.exposedCorruption01.
 */

import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { ensureRelationshipState, relationshipKeyFromEdge, normalizeRelationshipType } from './relationshipState.js';
// W-DOCTRINE-3b §4 — the exposed-foreign-corruption magnitude read (the corruption_exposed
// casus's fuel). One-directional: corruptionWeb never imports warReasons (its pair key is
// inlined). Absent ledger ⇒ 0 ⇒ byte-identical (no corruption_exposed reason materializes).
import { exposedCorruptionForPair } from './corruptionWeb.js';
import { buildPressureSummary } from './relationshipEvolution.js';
import { buildThreatByCid } from './martialReadiness.js';
import { clamp01 } from '../../kernel/math.js';

// ── Tuning (bounded named constants — owner-retunable per design §8) ────────

export const REASON_TUNING = Object.freeze({
  /** A reason below this score does not materialize (and a materialized one drops). */
  MIN_SCORE: 0.05,
  /** Σ(scores) that saturates the aggregate — ~2.5 strong reasons = a full case. */
  AGGREGATE_SATURATION: 2.5,
  /** Max lift the war-reason factor applies to a war-willingness weight (×1.30). */
  WAR_FACTOR_W: 0.3,
  /** Max lift the peace-reason factor applies to a peace-willingness weight (×1.35). */
  PEACE_FACTOR_W: 0.35,
  /** Grievance blend: fresh resentment vs the decayed relationship memoryScore. */
  GRIEVANCE_RESENTMENT_W: 0.65,
  GRIEVANCE_MEMORY_W: 0.35,
  /** Revanchism: a war-typed incident must be at least this many ticks old to count. */
  REVANCHISM_MIN_AGE_TICKS: 8,
  /** Revanchism per-old-wound contribution (capped at 1 by clamp). */
  REVANCHISM_PER_WOUND: 0.35,
  /** Revanchism requires a live grudge (resentment floor) — no grudge, no revanche. */
  REVANCHISM_RESENTMENT_FLOOR: 0.2,
  /** Resource envy gain on the (own − foe) pressure gradient. */
  RESOURCE_ENVY_GAIN: 1.2,
  /** Legitimacy below this score is hunger for a rallying war (the diversionary read). */
  LEGITIMACY_HUNGER_CEILING: 45,
  /** How many peace reasons present reads as "this war is dying" on the irony surface. */
  IRONY_DYING_AT: 3,
});

// ── The typed catalogs + the §14.3 mirror table ─────────────────────────────

/** The wave-1 casus belli taxonomy (design §14.1, the brief's seven). */
export const WAR_REASON_TYPES = Object.freeze([
  'grievance',
  'revanchism',
  'resource_pressure',
  'treaty_default',
  'encirclement',
  'legitimacy_hunger',
  'corruption_exposed',
]);

/** The wave-1 casus pacis taxonomy (design §14.2, the brief's seven). */
export const PEACE_REASON_TYPES = Object.freeze([
  'exhaustion',
  'belief_convergence',
  'economic_strangulation',
  'coalition_fracture',
  'mediation',
  'harvest_pressure',
  'realignment',
]);

/**
 * THE §14.3 MIRROR TABLE — every war reason names its peace mirror; the walker
 * test asserts totality + bijection so a future reason added to either side
 * without its mirror is a caught design defect ("equally robust", permanent).
 *
 * WAVE-1 PROVISIONAL PAIRING. Anchored on the design's canonical family pairs
 * where both members exist in wave 1:
 *   encirclement↔realignment (security↔common-threat), resource_pressure↔
 *   economic_strangulation (hunger↔bleeding), legitimacy_hunger↔exhaustion
 *   (diversionary entry↔war-weary exit), treaty_default↔coalition_fracture
 *   (the pact dissolves), corruption_exposed↔belief_convergence (the
 *   information family: revelation drives war, convergence drives peace).
 * The remaining two are provisional until satisfaction/war-guilt land in a
 * later wave: grievance↔mediation (the grudge and the broker who dissolves it)
 * and revanchism↔harvest_pressure (the two clock-driven reasons — the decade
 * clock of memory, the season clock of the fields). Re-pair consciously when
 * the taxonomy grows; the walker forces the update.
 */
export const REASON_MIRRORS = Object.freeze({
  grievance: 'mediation',
  revanchism: 'harvest_pressure',
  resource_pressure: 'economic_strangulation',
  treaty_default: 'coalition_fracture',
  encirclement: 'realignment',
  legitimacy_hunger: 'exhaustion',
  corruption_exposed: 'belief_convergence',
});

// ── The shared substrate (imported by peaceReasons.js — shape law) ──────────

/**
 * One typed, receipted reason record — THE shared shape, both sides.
 * @typedef {Object} ReasonRecord
 * @property {string} type       one of WAR_REASON_TYPES | PEACE_REASON_TYPES
 * @property {number} score      bounded 0..1 (rounded to 4 places)
 * @property {number} sinceTick  the tick this reason FIRST materialized (survives refolds)
 * @property {number} tick       the tick of the latest recompute
 * @property {string} receipt    the human-voice why-line (§14.4 legibility of motive)
 * @property {Record<string, number>} [evidence]  optional bounded numeric evidence
 *   (e.g. coalition_fracture's peakAllies/nowAllies) — allowed on both sides
 */

/**
 * One directed pair's reason bundle.
 * @typedef {Object} ReasonPairEntry
 * @property {Record<string, ReasonRecord>} reasons  keyed by reason type
 * @property {number} updatedTick
 * @property {Record<string, number>} [memo]  entry-level bounded numeric memory
 *   that must survive score-0 folds (e.g. the coalition peak-ally count — a
 *   reason RECORD only exists while its score clears MIN_SCORE, so memory that
 *   precedes presence lives here; dropped with the entry when the pair dies)
 */

/** @typedef {Record<string, ReasonPairEntry>} ReasonLedger keyed by pairKey */

/** The directed pair key: `from`'s reasons regarding `to`.
 * @param {unknown} fromId @param {unknown} toId @returns {string} */
export function reasonPairKey(fromId, toId) {
  return `${String(fromId)}>${String(toId)}`;
}

/** @param {number} n @returns {number} */
function round4(n) { return Math.round(n * 10000) / 10000; }

/**
 * Build the shared-shape record. Score is clamped + rounded; evidence values
 * are rounded so the serialized ledger stays byte-stable across recomputes.
 * @param {{ type: string, score: number, tick: number, sinceTick?: number,
 *           receipt: string, evidence?: Record<string, number> }} args
 * @returns {ReasonRecord}
 */
export function reasonRecord({ type, score, tick, sinceTick, receipt, evidence }) {
  /** @type {ReasonRecord} */
  const rec = {
    type,
    score: round4(clamp01(score)),
    sinceTick: Number.isFinite(sinceTick) ? Number(sinceTick) : tick,
    tick,
    receipt: String(receipt || ''),
  };
  if (evidence && typeof evidence === 'object') {
    /** @type {Record<string, number>} */
    const ev = {};
    for (const k of Object.keys(evidence).sort()) {
      const v = evidence[k];
      if (Number.isFinite(v)) ev[k] = round4(Number(v));
    }
    if (Object.keys(ev).length) rec.evidence = ev;
  }
  return rec;
}

/**
 * Fold one pair's freshly-computed reasons over its prior entry: presence is
 * state-derived (a computed score < MIN_SCORE drops the type — inherent decay);
 * sinceTick survives while the type persists; codepoint-ordered keys keep the
 * serialization deterministic. `memo` is entry-level memory that persists even
 * when no reason clears the threshold (the peak-before-the-peel class).
 * Returns null when nothing materializes AND no memo is held.
 * @param {ReasonPairEntry | null | undefined} prevEntry
 * @param {Array<{ type: string, score: number, receipt: string, evidence?: Record<string, number> }>} computed
 * @param {number} tick
 * @param {Record<string, number> | null} [memo]
 * @returns {ReasonPairEntry | null}
 */
export function foldPairReasons(prevEntry, computed, tick, memo = null) {
  /** @type {Record<string, ReasonRecord>} */
  const reasons = {};
  const sorted = [...computed].sort((a, b) => (a.type < b.type ? -1 : a.type > b.type ? 1 : 0));
  for (const c of sorted) {
    if (!c || !Number.isFinite(c.score) || clamp01(c.score) < REASON_TUNING.MIN_SCORE) continue;
    const prior = prevEntry?.reasons?.[c.type];
    reasons[c.type] = reasonRecord({
      type: c.type,
      score: c.score,
      tick,
      sinceTick: prior?.sinceTick,
      receipt: c.receipt,
      evidence: c.evidence,
    });
  }
  /** @type {Record<string, number> | null} */
  let memoOut = null;
  if (memo && typeof memo === 'object') {
    /** @type {Record<string, number>} */
    const m = {};
    for (const k of Object.keys(memo).sort()) {
      const v = memo[k];
      if (Number.isFinite(v)) m[k] = round4(Number(v));
    }
    if (Object.keys(m).length) memoOut = m;
  }
  if (Object.keys(reasons).length === 0 && !memoOut) return null;
  return { reasons, updatedTick: tick, ...(memoOut ? { memo: memoOut } : {}) };
}

/**
 * The bounded aggregate of one pair entry's scores: 0 (no case) .. 1 (a full,
 * saturated case). ~AGGREGATE_SATURATION worth of strong reasons saturates.
 * @param {ReasonPairEntry | null | undefined} entry @returns {number}
 */
export function aggregateReasons01(entry) {
  if (!entry || !entry.reasons) return 0;
  let sum = 0;
  for (const key of Object.keys(entry.reasons)) sum += clamp01(Number(entry.reasons[key]?.score) || 0);
  return clamp01(sum / REASON_TUNING.AGGREGATE_SATURATION);
}

/**
 * The top-N reasons of a pair entry (score-desc, type-codepoint tiebreak) —
 * the decision-receipt read ("the TOP contributors are NAMED", §14).
 * @param {ReasonPairEntry | null | undefined} entry @param {number} [n]
 * @returns {ReasonRecord[]}
 */
export function topReasons(entry, n = 3) {
  if (!entry || !entry.reasons) return [];
  return Object.keys(entry.reasons)
    .map((k) => entry.reasons[k])
    .sort((a, b) => (b.score - a.score) || (a.type < b.type ? -1 : a.type > b.type ? 1 : 0))
    .slice(0, Math.max(0, n));
}

// ── The gate (fail-closed; the constructiveFlowsActive idiom) ───────────────

/**
 * THE PEACE-ENGINE GATE: warLayerEnabled === true AND peaceEngineEnabled ===
 * true, both explicit booleans off worldState.simulationRules. ABSENT ⇒ false
 * ⇒ DORMANT. peaceEngineEnabled is virtual — no DEFAULT_SIMULATION_RULES entry,
 * so no golden moves; normalizeSimulationRules spreads unknown keys through,
 * so an explicitly-lit rules blob survives normalization (the
 * constructiveFlowsEnabled precedent, empirically load-bearing).
 * @param {{ simulationRules?: Record<string, unknown> | null } | null | undefined} worldState
 * @returns {boolean}
 */
export function peaceCausalActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  if (!rules || typeof rules !== 'object') return false;
  const r = /** @type {Record<string, unknown>} */ (rules);
  return r.warLayerEnabled === true && r.peaceEngineEnabled === true;
}

// ── The war-side scorers (pure, individually pinned) ────────────────────────

/**
 * GRIEVANCE (§14.1): the relationshipMemory ledger as fuel — fresh resentment
 * (which the E1b credit-default seam and the lever nudges feed) blended with
 * the decayed incident memoryScore, both already 0..1 on the edge state.
 * @param {{ resentment?: number, memoryScore?: number } | null | undefined} relState
 * @returns {{ score: number, receipt: string }}
 */
export function scoreGrievance(relState) {
  const resentment = clamp01(Number(relState?.resentment) || 0);
  const memory = clamp01(Number(relState?.memoryScore) || 0);
  const score = clamp01(REASON_TUNING.GRIEVANCE_RESENTMENT_W * resentment + REASON_TUNING.GRIEVANCE_MEMORY_W * memory);
  return { score, receipt: `A ledger of grievances stands open — resentment ${resentment.toFixed(2)}, memory ${memory.toFixed(2)}.` };
}

/**
 * REVANCHISM (§14.1 / §5): OLD war-typed wounds still held under a live grudge —
 * the decade clock. Counts war/betrayal/tribute/conquest/sack-typed incidents
 * at least REVANCHISM_MIN_AGE_TICKS old; requires a resentment floor (no
 * grudge, no revanche). Harsh-treaty grievances join this read when the treaty
 * waves land.
 * @param {{ resentment?: number, recentIncidents?: Array<{ type?: string, tick?: number }> } | null | undefined} relState
 * @param {number} tick
 * @returns {{ score: number, receipt: string }}
 */
export function scoreRevanchism(relState, tick) {
  const resentment = clamp01(Number(relState?.resentment) || 0);
  if (resentment < REASON_TUNING.REVANCHISM_RESENTMENT_FLOOR) return { score: 0, receipt: '' };
  const incidents = Array.isArray(relState?.recentIncidents) ? relState.recentIncidents : [];
  let wounds = 0;
  for (const inc of incidents) {
    const type = String(inc?.type || '');
    if (!/war|betray|tribute|conquest|occupation|sack|raid/i.test(type)) continue;
    const at = Number(inc?.tick);
    if (!Number.isFinite(at)) continue;
    if (tick - at >= REASON_TUNING.REVANCHISM_MIN_AGE_TICKS) wounds += 1;
  }
  if (wounds === 0) return { score: 0, receipt: '' };
  const score = clamp01(wounds * REASON_TUNING.REVANCHISM_PER_WOUND) * resentment;
  return { score, receipt: `Old wounds unforgotten — ${wounds} mark${wounds === 1 ? '' : 's'} in the ledger, and the grudge still burns.` };
}

/**
 * RESOURCE PRESSURE (§14.1 economic hunger): my depleted stores against their
 * intact ones — the envy gradient on the SAME pressure index the war layer
 * reads. own/foe are 0..1 blended pressures (food-weighted).
 * @param {{ own01: number, foe01: number }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreResourcePressure({ own01, foe01 }) {
  const gap = clamp01(Number(own01) || 0) - clamp01(Number(foe01) || 0);
  const score = clamp01(gap * REASON_TUNING.RESOURCE_ENVY_GAIN);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: 'Their granaries stand full while ours thin — hunger is faster than patience.' };
}

/**
 * TREATY DEFAULT (§14.1 grievance family) — REGISTRATION SEAM. No treaties
 * ledger exists yet; the kernel passes `undefined` ⇒ 0. When the treaty waves
 * land: a treaty between the pair whose complianceState marks `toId` as the
 * defaulter scores by the recorded default severity.
 * @param {{ treaties?: Array<{ parties?: unknown[], complianceState?: string,
 *           defaultedBy?: unknown, defaultSeverity01?: number }> | null,
 *           fromId: string, toId: string }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreTreatyDefault({ treaties, fromId, toId }) {
  if (!Array.isArray(treaties) || treaties.length === 0) return { score: 0, receipt: '' };
  let worst = 0;
  for (const t of treaties) {
    const parties = Array.isArray(t?.parties) ? t.parties.map(String) : [];
    if (!parties.includes(String(fromId)) || !parties.includes(String(toId))) continue;
    if (String(t?.defaultedBy || '') !== String(toId)) continue;
    if (String(t?.complianceState || '') !== 'defaulted') continue;
    worst = Math.max(worst, clamp01(Number(t?.defaultSeverity01) || 0.6));
  }
  if (worst <= 0) return { score: 0, receipt: '' };
  return { score: worst, receipt: 'The treaty lies broken and the promised wagons never came — oathbreach is casus.' };
}

/**
 * ENCIRCLEMENT FEAR (§14.1 security): the settlement's threat environment
 * (fronts/occupations/war stressors on self + neighbours, the existing
 * martialReadiness index), given a hostile face to fear.
 * @param {{ threat01: number, hostile: boolean }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreEncirclement({ threat01, hostile }) {
  if (!hostile) return { score: 0, receipt: '' };
  const score = clamp01(Number(threat01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: 'War stands at the borders on more sides than one — better to strike than be ringed.' };
}

/**
 * LEGITIMACY HUNGER (§14.1 domestic — the diversionary war): a shaky seat
 * under pressure rallies against an external enemy. Reads the causal
 * public_legitimacy substrate score (0..100); hunger scales as it falls under
 * the ceiling. Only a hostile pair offers a rallying target.
 * @param {{ legitimacyScore: number, hostile: boolean }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreLegitimacyHunger({ legitimacyScore, hostile }) {
  if (!hostile) return { score: 0, receipt: '' };
  const legit = Number.isFinite(legitimacyScore) ? Number(legitimacyScore) : 50;
  const ceiling = REASON_TUNING.LEGITIMACY_HUNGER_CEILING;
  if (legit >= ceiling) return { score: 0, receipt: '' };
  const score = clamp01((ceiling - legit) / ceiling);
  return { score, receipt: 'The seat is contested at home — a foreign enemy is cheaper than a domestic answer.' };
}

/**
 * EXPOSED FOREIGN CORRUPTION (§14.1 ideology/moral) — REGISTRATION SEAM for
 * W-DOCTRINE. The kernel passes `undefined` today ⇒ 0. When W-DOCTRINE lands
 * its hook, it feeds the REVEALED foreign-corruption magnitude (0..1) that
 * `fromId` holds against `toId` through collectWarReasonInputs.
 * @param {{ exposedCorruption01?: number | null }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreCorruptionExposed({ exposedCorruption01 }) {
  const score = clamp01(Number(exposedCorruption01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: 'Their court is rotten and the rot is now public — someone must answer for it.' };
}

// ── The factor (the consumption read — bounded, centered on 1.0) ────────────

/**
 * The war-reason modulator for a directed pair: 1.0 exactly when the gate is
 * dark, the ledger is absent, or the pair holds no case; up to
 * 1 + WAR_FACTOR_W when the case saturates. Consumed at the settlementStrategy
 * deploy-weight seam and warDeployment's conquest-margin seam.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} fromId @param {unknown} toId
 * @returns {number}
 */
export function warReasonFactor(worldState, fromId, toId) {
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) return 1;
  const ledger = /** @type {ReasonLedger | null} */ (getSpatialLedger(worldState, 'warReasons'));
  if (!ledger) return 1;
  const entry = ledger[reasonPairKey(fromId, toId)];
  const aggregate = aggregateReasons01(entry);
  if (aggregate <= 0) return 1;
  return 1 + REASON_TUNING.WAR_FACTOR_W * aggregate;
}

/**
 * The pair's war-reason entry (for receipts/stamps). Null when dark/absent.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} fromId @param {unknown} toId
 * @returns {ReasonPairEntry | null}
 */
export function warReasonsFor(worldState, fromId, toId) {
  const ledger = /** @type {ReasonLedger | null} */ (getSpatialLedger(worldState, 'warReasons'));
  if (!ledger) return null;
  return ledger[reasonPairKey(fromId, toId)] || null;
}

// ── The mover ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} WarReasonsAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

/**
 * Advance the war-reason ledger one tick. DETERMINISTIC (no rng); gate absent
 * ⇒ immediate no-op. Iterates the relationship graph's edges in both
 * orientations (codepoint-ordered), recomputes each directed pair's typed
 * casus scores from existing state, folds, and persists only on real change
 * (serialize-compare; drop-when-empty).
 *
 * Wave-1 emits NO news from accumulation (deliberate: the irony surface reads
 * the ledger; decision receipts name the top reasons — accumulation beats
 * would be noise). Documented deferral, not an omission.
 *
 * @param {{ snapshot: { byId?: Map<string, { id: string, name?: string,
 *                         settlement?: import('../settlement.schema.js').SimSettlement,
 *                         causal?: { scores?: Record<string, number> } }>,
 *                       regionalGraph?: { edges?: Array<Record<string, unknown>> } },
 *           worldState: Record<string, unknown>,
 *           graph?: { edges?: Array<Record<string, unknown>> } | null,
 *           pIndex?: Record<string, unknown> | null,
 *           tick: number }} args
 * @returns {WarReasonsAdvanceResult}
 */
export function advanceWarReasons({ snapshot, worldState, graph, pIndex = null, tick }) {
  // ── DORMANCY GATE (§8): absent ⇒ an immediate no-op. No key, no read. ──
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) {
    return { worldState, changed: false, newsEntries: [] };
  }

  const edges = (graph?.edges && Array.isArray(graph.edges) ? graph.edges : null)
    || (Array.isArray(snapshot?.regionalGraph?.edges) ? snapshot.regionalGraph.edges : []);
  const states = /** @type {Record<string, unknown>} */ (worldState.relationshipStates && typeof worldState.relationshipStates === 'object' ? worldState.relationshipStates : {});
  const prevLedger = /** @type {ReasonLedger | null} */ (getSpatialLedger(worldState, 'warReasons'));

  // The threat-environment index (existing martialReadiness read), built once.
  const threatByCid = buildThreatByCid(snapshot, worldState);

  // W-PEACE-2: the TREATY_DEFAULT feed — CLOSING this module's registration seam.
  // The treaties ledger (built by advanceTreaties, which runs THIS tick before the
  // war-reason mover) carries {parties, complianceState, defaultedBy, defaultSeverity01}
  // at each treaty's top level — exactly scoreTreatyDefault's shape. Read directly
  // (no peaceTerms import ⇒ no cycle: peaceTerms imports this module's gate). Absent
  // (dark / no treaty) ⇒ []  ⇒ scoreTreatyDefault returns 0 ⇒ byte-identical.
  const treatiesLedger = /** @type {Record<string, Record<string, unknown>> | undefined} */ (getSpatialLedger(worldState, 'treaties'));
  const treatiesList = /** @type {Array<{ parties?: unknown[], complianceState?: string, defaultedBy?: unknown, defaultSeverity01?: number }>} */ (
    treatiesLedger && typeof treatiesLedger === 'object' ? Object.values(treatiesLedger) : []);

  // Directed candidate pairs from the edge list, both orientations, deduped,
  // codepoint-ordered for a deterministic serialization.
  /** @type {Map<string, { fromId: string, toId: string, edge: Record<string, unknown> }>} */
  const pairs = new Map();
  for (const edge of edges) {
    const a = edge?.from != null ? String(edge.from) : '';
    const b = edge?.to != null ? String(edge.to) : '';
    if (!a || !b || a === b) continue;
    if (!pairs.has(reasonPairKey(a, b))) pairs.set(reasonPairKey(a, b), { fromId: a, toId: b, edge });
    if (!pairs.has(reasonPairKey(b, a))) pairs.set(reasonPairKey(b, a), { fromId: b, toId: a, edge });
  }
  const orderedKeys = [...pairs.keys()].sort();

  /** @type {ReasonLedger} */
  const nextLedger = {};
  for (const key of orderedKeys) {
    const { fromId, toId, edge } = /** @type {{ fromId: string, toId: string, edge: Record<string, unknown> }} */ (pairs.get(key));
    const relKey = relationshipKeyFromEdge(edge);
    const relState = ensureRelationshipState(edge, /** @type {Record<string, unknown>} */(states[relKey]) || {});
    const hostile = normalizeRelationshipType(relState.relationshipType) === 'hostile';
    const fromItem = snapshot?.byId?.get?.(fromId);

    const ownPressure = pressureBlend(pIndex, fromId);
    const foePressure = pressureBlend(pIndex, toId);

    const computed = [
      { type: 'grievance', ...scoreGrievance(relState) },
      { type: 'revanchism', ...scoreRevanchism(relState, tick) },
      { type: 'resource_pressure', ...scoreResourcePressure({ own01: ownPressure, foe01: foePressure }) },
      { type: 'treaty_default', ...scoreTreatyDefault({ treaties: treatiesList, fromId, toId }) },
      { type: 'encirclement', ...scoreEncirclement({ threat01: threatByCid.get(fromId) || 0, hostile }) },
      {
        type: 'legitimacy_hunger',
        ...scoreLegitimacyHunger({
          legitimacyScore: Number(fromItem?.causal?.scores?.public_legitimacy),
          hostile,
        }),
      },
      { type: 'corruption_exposed', ...scoreCorruptionExposed({ exposedCorruption01: exposedCorruptionForPair(worldState, fromId, toId, tick) }) },
    ];

    const entry = foldPairReasons(prevLedger?.[key], computed, tick);
    if (entry) nextLedger[key] = entry;
  }

  const hasNext = Object.keys(nextLedger).length > 0;
  const prevSerialized = JSON.stringify(prevLedger || null);
  const nextSerialized = JSON.stringify(hasNext ? nextLedger : null);
  if (prevSerialized === nextSerialized) {
    return { worldState, changed: false, newsEntries: [] };
  }
  const nextWorldState = hasNext
    ? setSpatialLedger(worldState, 'warReasons', nextLedger)
    : dropSpatialLedger(worldState, 'warReasons');
  return { worldState: nextWorldState, changed: true, newsEntries: [] };
}

/**
 * The 0..1 resource-pressure blend for the envy gradient — food-weighted, off
 * the SAME pressure index the relationship contests read.
 * @param {Record<string, unknown> | null} pIndex @param {string} id @returns {number}
 */
function pressureBlend(pIndex, id) {
  const summary = buildPressureSummary(pIndex, id);
  return clamp01(0.6 * clamp01(Number(summary?.food) || 0) + 0.4 * clamp01(Number(summary?.economy) || 0));
}

// ── THE FORCEABLE VERB: DECLARE_CASUS (the counterpart criterion) ────────────
//
// W-PEACE-1 ships the verb as a PURE, GATED worldState mutation — the exact
// function a composer manifest entry must wrap under the SAME-FUNCTION LAW.
// It is NOT registered in src/domain/events/affordanceManifest.js this wave:
// the manifest walker's own scope note parks realm verbs ("the trunk layer —
// registered MACRO ops gaining manifest entries — lands with W-COMPOSER-2's
// realm verbs... Documented deferral, not a gap"), and the applyEvent pipeline
// (runEventPipeline(settlement, event)) has NO worldState channel, so a
// settlement-scoped entry provably could not reach this ledger. W-COMPOSER-2
// lifts declareCasus into its manifest entry verbatim: the veto codes below are
// its coversVetoCodes, CASUS_VETO_PROSE its VETO_PROSE lines, and the severity
// clamp its band dial (clampAtCommit). Preview≡apply holds by construction —
// the function is pure and deterministic.

/** The DM-facing refusal prose per veto code (W-COMPOSER-2's VETO_PROSE feed). */
export const CASUS_VETO_PROSE = Object.freeze({
  casus_gate_dark: 'The causal reasons layer is not active in this campaign (warLayerEnabled + peaceEngineEnabled).',
  casus_unknown_type: 'That is not a typed reason for war this engine tracks.',
  casus_self: 'A court cannot hold a casus belli against itself.',
});

/**
 * DECLARE_CASUS: mint (or renew) a typed reason for war on the directed pair
 * by decree. Severity is dial-clamped into [MIN_SCORE, 1] at commit; a
 * standing reason of the same type keeps its sinceTick (the decree renews,
 * never re-births). Pure: same input ⇒ same output (preview ≡ apply).
 * @param {Record<string, unknown>} worldState
 * @param {{ fromId: unknown, toId: unknown, type: string, severity01?: number,
 *           receipt?: string, tick?: number }} args
 * @returns {{ ok: true, worldState: Record<string, unknown> }
 *         | { ok: false, code: keyof typeof CASUS_VETO_PROSE, detail: string }}
 */
export function declareCasus(worldState, { fromId, toId, type, severity01 = 0.6, receipt = '', tick = 0 }) {
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) {
    return { ok: false, code: 'casus_gate_dark', detail: 'peace-engine gate absent' };
  }
  if (!WAR_REASON_TYPES.includes(String(type))) {
    return { ok: false, code: 'casus_unknown_type', detail: String(type) };
  }
  const from = String(fromId);
  const to = String(toId);
  if (from === to) return { ok: false, code: 'casus_self', detail: from };
  // The severity band dial, clamped at commit: a decree can never mint a
  // sub-threshold ghost record or an out-of-bounds score.
  const score = Math.max(REASON_TUNING.MIN_SCORE, clamp01(Number.isFinite(severity01) ? Number(severity01) : 0.6));
  const key = reasonPairKey(from, to);
  const ledger = /** @type {ReasonLedger | null} */ (getSpatialLedger(worldState, 'warReasons'));
  const prevEntry = ledger?.[key] || null;
  const record = reasonRecord({
    type: String(type),
    score,
    tick: Number.isFinite(tick) ? Number(tick) : 0,
    sinceTick: prevEntry?.reasons?.[String(type)]?.sinceTick,
    receipt: String(receipt || '').trim() || `Declared by decree: ${String(type)} against ${to}.`,
  });
  /** @type {ReasonPairEntry} */
  const nextEntry = {
    ...(prevEntry || {}),
    reasons: { ...(prevEntry?.reasons || {}), [record.type]: record },
    updatedTick: record.tick,
  };
  // Codepoint-stable reason ordering inside the entry (the fold discipline).
  /** @type {Record<string, ReasonRecord>} */
  const orderedReasons = {};
  for (const t of Object.keys(nextEntry.reasons).sort()) orderedReasons[t] = nextEntry.reasons[t];
  nextEntry.reasons = orderedReasons;
  const nextLedger = { ...(ledger || {}), [key]: nextEntry };
  /** @type {ReasonLedger} */
  const orderedLedger = {};
  for (const k of Object.keys(nextLedger).sort()) orderedLedger[k] = nextLedger[k];
  return { ok: true, worldState: setSpatialLedger(worldState, 'warReasons', orderedLedger) };
}
