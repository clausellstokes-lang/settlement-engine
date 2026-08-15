/**
 * domain/worldPulse/narrativeTempo.js — E0, THE NARRATIVE TEMPO GOVERNOR.
 *
 * The realm-level pacing layer over the composed drama engines
 * (docs/DESIGN_PACING_GOVERNOR.md, frozen). THE ONE LAW: throttle SPONTANEITY,
 * never CAUSALITY. The governor gates INDEPENDENT arc BIRTHS only; a receipted
 * consequence chain (a war-born famine, a famine-born exodus) is never censored.
 * A deferred birth is DELAYED, never denied — its causal pressure persists and
 * fires when a slot opens (design §1: "quiet before the storm, for free").
 *
 * CONSTITUTIONAL POSTURE:
 *  - DETERMINISTIC: pure ledger reads + codepoint priority, ZERO rng.
 *  - DORMANT DEFAULT: absent/garbage `narrativeTempo` axis ⇒ narrativeTempoOf===null
 *    ⇒ every budget ∞ ⇒ the seam is byte-identical to today. This module is LAZY
 *    (imported only by candidateEvents.js / pulseKernel.js) and adds ZERO eager bytes.
 *  - CONDITIONALLY MATERIALIZED: the worldState.narrativeTempo ledger self-prunes to
 *    undefined when drained, so a flag-off/drained campaign is byte-identical-dormant.
 *
 * The DRAMA_CLASS_REGISTRY + DRAMA_CLASS_PRIORITY (the taxonomy) live in
 * decisionTier.js (the structural-classification sibling); this module is the pure
 * governor MECHANISM over that taxonomy.
 */

import {
  DRAMA_CLASS_REGISTRY,
  DRAMA_CLASS_PRIORITY,
} from './decisionTier.js';
import { sublinearBonus, REALM_SCALING } from './realmScaling.js';
// Re-exported so the pulse (already importing this module) reaches the decision-budget
// scaler without a second import line into the size-capped pulseKernel (D2).
export { sublinearBudget, REALM_SCALING } from './realmScaling.js';

/** @typedef {import('./decisionTier.js').DramaClass} DramaClass */

/**
 * @typedef {'quiet_local'|'realistic_regional'|'dramatic_campaign'|'full_simulation'} TempoTier
 */

/**
 * A per-tier budget triple (design §4). classMax is non-decreasing across the tiers
 * (dial monotonicity holds by construction). All owner-retunable.
 * @typedef {Object} TempoBudget
 * @property {number} classMax    max in-window spontaneous births per drama class (realm-wide)
 * @property {number} arcMax      max simultaneous live major arcs before simultaneity deferral kicks in
 * @property {number} graceWeeks  post-major grace window a settlement is exempt from NEW independent majors
 */

/**
 * A candidate as the governor reads it — the loosely-shaped world-pulse candidate,
 * narrowed to the fields the governor consults. Every field optional (a stub
 * candidate reads as "not a governed birth").
 * @typedef {Object} TempoCandidate
 * @property {string} [candidateType]
 * @property {string} [ruleId]
 * @property {string} [ruleFamily]
 * @property {number} [probability]
 * @property {string|number} [targetSaveId]
 * @property {{ causes?: Array<{ source?: string }> }} [condition]
 */

/**
 * A live stressor record as the governor reads it (for the simultaneity arc count).
 * @typedef {Object} TempoStressor
 * @property {string} [type]
 * @property {string} [lifecycleStage]
 */

/**
 * The narrativeTempo ledger (worldState.narrativeTempo). Interval-invariant
 * week-stamps, self-pruning, "absence = zero".
 * @typedef {Object} TempoLedger
 * @property {Record<string, number[]>} [realm]                              birth week-stamps by drama class, in-window only
 * @property {Record<string, { lastMajorWeek: number }>} [settlement]       per-settlement post-major grace clock
 * @property {Record<string, Array<{ week: number, settlementId: string|null }>>} [deferred]  held storms (the deferral queue) for the DM receipt
 */

/**
 * The minimal worldState shape the governor reads (pre-tick).
 * @typedef {Object} TempoWorldState
 * @property {TempoStressor[]} [stressors]
 * @property {{ elapsedWeeks?: number }} [calendar]
 * @property {TempoLedger} [narrativeTempo]
 */

/**
 * A pruned ledger snapshot the seam reads once per tick (pure; prunes at read).
 * @typedef {Object} TempoSnapshot
 * @property {number} elapsedWeeks
 * @property {Record<string, number>} classCounts    in-window birth counts by drama class
 * @property {number} liveArcs                        live major arcs realm-wide (countLiveMajorArcs)
 * @property {(settlementId: string) => (number|null)} lastMajorWeekOf   the settlement's most recent major week, or null
 */

/**
 * The seam-injected tempo context (buildTempoContext). `active:false` ⇒ dormant ⇒
 * the seam skips ALL governor logic.
 * @typedef {Object} TempoContext
 * @property {boolean} active
 * @property {TempoBudget} [budgets]
 * @property {TempoSnapshot} [snapshot]
 */

/**
 * A seam-emitted deferral record (the DM-receipt payload + test observability).
 * @typedef {Object} TempoDeferral
 * @property {DramaClass} class
 * @property {string|null} settlementId
 * @property {'class_budget'|'grace'|'simultaneity'} reason
 */

/** The tempo window: one game year. A week-stamp expires when elapsedWeeks - w >= this. */
export const TEMPO_WINDOW_WEEKS = 52;

/** The valid tempo tiers, in ascending loudness (design §3). */
export const TEMPO_TIERS = Object.freeze(
  /** @type {ReadonlyArray<TempoTier>} */ (['quiet_local', 'realistic_regional', 'dramatic_campaign', 'full_simulation']),
);

/**
 * Starting budgets (design §4) — named, frozen, owner-retunable. classMax is
 * MONOTONE non-decreasing across the tiers so the dial-monotonicity pin holds by
 * construction (louder tempo ⇒ ≥ as many births).
 * @type {Readonly<Record<TempoTier, TempoBudget>>}
 */
export const TEMPO_BUDGETS = Object.freeze({
  quiet_local: Object.freeze({ classMax: 1, arcMax: 2, graceWeeks: 26 }),
  realistic_regional: Object.freeze({ classMax: 2, arcMax: 4, graceWeeks: 13 }),
  dramatic_campaign: Object.freeze({ classMax: 3, arcMax: 7, graceWeeks: 8 }),
  full_simulation: Object.freeze({ classMax: 4, arcMax: 10, graceWeeks: 4 }),
});

/** The stressor lifecycle stages that count as a LIVE arc (mirrors chronicle.js). */
const ACTIVE_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

/**
 * Effective narrativeTempo read (fail-closed string-enum; mirrors infoModeOf). An
 * explicit valid tier lights the governor; absent/garbage ⇒ null ⇒ DORMANT (budget ∞).
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {TempoTier | null}
 */
export function narrativeTempoOf(rules) {
  const v = rules && typeof rules === 'object' ? rules.narrativeTempo : null;
  return typeof v === 'string' && TEMPO_TIERS.includes(/** @type {TempoTier} */ (v))
    ? /** @type {TempoTier} */ (v)
    : null;
}

/**
 * The drama class of a stressor TYPE (e.g. 'famine' → 'economic_shock'), via the
 * registry's stressor_birth_<type> entry. null ⇒ un-governed (exempt or unknown).
 * @param {string | null | undefined} type
 * @returns {DramaClass | null}
 */
function dramaClassForStressorType(type) {
  if (!type) return null;
  const entry = DRAMA_CLASS_REGISTRY[`stressor_birth_${type}`];
  return entry && entry.birthKind === 'spontaneous' && entry.wired ? entry.class : null;
}

/**
 * The drama class of a candidate (registry lookup by candidateType, with the
 * strategy/war ruleFamily disambiguation). Returns a class ONLY for WIRED spontaneous
 * seam producers; null for consequences, unknown types, and deferred bypass producers.
 * @param {TempoCandidate | null | undefined} candidate
 * @returns {DramaClass | null}
 */
export function dramaClassOf(candidate) {
  if (!candidate) return null;
  const entry = DRAMA_CLASS_REGISTRY[String(candidate.candidateType || '')];
  if (!entry || entry.birthKind !== 'spontaneous' || !entry.wired) return null;
  if (entry.ruleFamily && String(candidate.ruleFamily || '') !== entry.ruleFamily) return null;
  return entry.class;
}

/**
 * Is this candidate a RECEIPTED consequence the governor must NEVER throttle
 * (design §1 chain immunity; plan §1.1)? True when ANY hold:
 *  - candidateType is a residual / spread / escalate (the receipted chain paths),
 *  - ruleFamily is a mobilization reaction,
 *  - ANY condition.causes[].source is an upstream stressor id (world_stressor.*).
 *
 * NOT keyed on probability. `probability >= 1` is NOT a reliable proxy for "chained":
 * `strategy_deploy` (settlementStrategy.js, prob 1) is a SPONTANEOUS opportunistic-war
 * birth the design §1 explicitly names as governor-eligible — treating it as chained
 * would let opportunistic wars escape the governor entirely. The prob-1 CONSEQUENCES
 * that reach this predicate are either caught by a positive marker (a residual carries
 * candidateType 'stressor_residual') or are off-seam with a null drama-class
 * (coup_succeeded / population_emigration bypass rollCandidates AND dramaClassOf → null,
 * so the fold's second guard drops them). The maxAuto `guaranteed` exemption in
 * rollCandidates is a SEPARATE gate and is unaffected.
 *
 * NOTE (deviation from the plan's literal §1.1 regex): the plan wrote
 * `/_(residual|spread|escalate)$/.test(ruleId)`, but the real candidateTypes are
 * `stressor_spread_<type>` / `stressor_escalate_<type>` (they END in the type, not
 * the verb), so a `$`-anchored match would MISS them and BREAK immunity. This uses a
 * PREFIX match on candidateType. The causes check scans ALL causes (not just [0]) so a
 * receipt at any index is honoured.
 * @param {TempoCandidate | null | undefined} candidate
 * @returns {boolean}
 */
export function isChainedConsequence(candidate) {
  if (!candidate) return false;
  const ct = String(candidate.candidateType || '');
  if (/^stressor_(residual|spread|escalate)(_|$)/.test(ct)) return true;
  if (String(candidate.ruleFamily || '') === 'mobilization_reaction') return true;
  const causes = candidate.condition?.causes;
  if (Array.isArray(causes)
    && causes.some((c) => typeof c?.source === 'string' && c.source.startsWith('world_stressor.'))) return true;
  return false;
}

/**
 * Count LIVE major arcs realm-wide: worldState.stressors in an ACTIVE lifecycle stage
 * whose type maps to a governed drama class. One stressor record = one arc (spread
 * extends its footprint, never its count). Zero rng.
 * @param {TempoWorldState | null | undefined} worldState
 * @returns {number}
 */
export function countLiveMajorArcs(worldState) {
  const stressors = Array.isArray(worldState?.stressors) ? worldState.stressors : [];
  let n = 0;
  for (const s of stressors) {
    if (!ACTIVE_STAGES.has(String(s?.lifecycleStage || 'active'))) continue;
    if (dramaClassForStressorType(s?.type) !== null) n += 1;
  }
  return n;
}

/**
 * Read the tempo ledger into a pruned snapshot (pure — prunes expired stamps at read,
 * mutates nothing). "Absence = zero".
 * @param {TempoWorldState | null | undefined} worldState
 * @param {number} elapsedWeeks
 * @returns {TempoSnapshot}
 */
export function readTempoLedger(worldState, elapsedWeeks) {
  const ledger = worldState && typeof worldState === 'object' ? worldState.narrativeTempo : null;
  const realm = ledger && typeof ledger === 'object' ? ledger.realm : null;
  const settlement = ledger && typeof ledger === 'object' ? ledger.settlement : null;

  /** @type {Record<string, number>} */
  const classCounts = {};
  if (realm && typeof realm === 'object') {
    for (const cls of Object.keys(realm)) {
      const stamps = realm[cls];
      if (!Array.isArray(stamps)) continue;
      let count = 0;
      for (const w of stamps) {
        if (Number.isFinite(w) && elapsedWeeks - w < TEMPO_WINDOW_WEEKS) count += 1;
      }
      if (count > 0) classCounts[cls] = count;
    }
  }

  return {
    elapsedWeeks,
    classCounts,
    liveArcs: countLiveMajorArcs(worldState),
    lastMajorWeekOf(settlementId) {
      const rec = settlement && typeof settlement === 'object' ? settlement[settlementId] : null;
      const w = rec && typeof rec === 'object' ? rec.lastMajorWeek : null;
      return Number.isFinite(w) ? /** @type {number} */ (w) : null;
    },
  };
}

/**
 * The lowest-priority (highest priority-index) governed spontaneous class among a
 * tick's pending candidates — the class the simultaneity rule defers first when the
 * realm is saturated. Pure + codepoint-deterministic (the priority list is fixed).
 * @param {ReadonlyArray<TempoCandidate>} candidates
 * @returns {DramaClass | null}
 */
export function computeLowestPendingClass(candidates) {
  /** @type {DramaClass | null} */
  let lowest = null;
  let lowestIdx = -1;
  for (const candidate of candidates || []) {
    if (isChainedConsequence(candidate)) continue;
    const cls = dramaClassOf(candidate);
    if (cls === null) continue;
    const idx = DRAMA_CLASS_PRIORITY.indexOf(cls);
    if (idx > lowestIdx) {
      lowestIdx = idx;
      lowest = cls;
    }
  }
  return lowest;
}

/**
 * THE GOVERNOR DECISION (pure function of the ledger + codepoint priority; ZERO rng).
 * Order of checks: dormant/exempt/unknown → pass; else grace → class budget →
 * simultaneity. A pass returns { defer:false }; a defer names its reason + class.
 * @param {Object} args
 * @param {TempoCandidate} args.candidate
 * @param {TempoSnapshot} args.snapshot
 * @param {{ active: boolean, budgets: TempoBudget, lowestPendingClass: (DramaClass|null) }} args.config
 * @returns {{ defer: false, reason: null, class: (DramaClass|null) } | { defer: true, reason: ('class_budget'|'grace'|'simultaneity'), class: DramaClass }}
 *   A discriminated union: `defer:true` GUARANTEES a non-null class + reason (a deferral
 *   always names the storm it held), so the seam can push a TempoDeferral without a cast.
 */
export function governBirth({ candidate, snapshot, config }) {
  if (!config || !config.active) return { defer: false, reason: null, class: null };
  // CAUSALITY IS NEVER THROTTLED (design §1): a receipted consequence always passes.
  if (isChainedConsequence(candidate)) return { defer: false, reason: null, class: null };
  const cls = dramaClassOf(candidate);
  if (cls === null) return { defer: false, reason: null, class: null };

  const budget = config.budgets;
  const sid = candidate.targetSaveId != null ? String(candidate.targetSaveId) : null;

  // GRACE: a settlement inside its post-major grace window emits no NEW independent
  // major (chained consequences still land — they short-circuited above).
  if (sid !== null) {
    const last = snapshot.lastMajorWeekOf(sid);
    if (last !== null && (snapshot.elapsedWeeks - last) < budget.graceWeeks) {
      return { defer: true, reason: 'grace', class: cls };
    }
  }

  // CLASS BUDGET: this class already hit classMax in-window births (realm-wide).
  if ((snapshot.classCounts[cls] || 0) >= budget.classMax) {
    return { defer: true, reason: 'class_budget', class: cls };
  }

  // SIMULTANEITY: the realm is saturated AND this is the lowest-priority pending class.
  if (snapshot.liveArcs >= budget.arcMax && config.lowestPendingClass === cls) {
    return { defer: true, reason: 'simultaneity', class: cls };
  }

  return { defer: false, reason: null, class: cls };
}

/**
 * Build the seam-injected tempo context from the PRE-TICK worldState (design §7.2
 * READ hook). Dormant ⇒ { active:false } ⇒ the seam is byte-identical to today.
 *
 * D2a THE SCALING LAW: `realmSize` (N settlements) sublinearly raises classMax so a large
 * realm's per-settlement attention density stays realm-size-invariant (design §D2a). At
 * N ≤ BASE_REALM the bonus is exactly 0 and the FROZEN budgets object is returned
 * unchanged (byte-identical). realmSize defaults to 0 ⇒ existing callers are unaffected.
 * @param {TempoWorldState | null | undefined} worldState
 * @param {Record<string, unknown> | null | undefined} rules
 * @param {number} [realmSize] realm settlement count (N)
 * @returns {TempoContext}
 */
export function buildTempoContext(worldState, rules, realmSize = 0) {
  const tier = narrativeTempoOf(rules);
  if (tier === null) return { active: false };
  const baseBudgets = TEMPO_BUDGETS[tier];
  const classBonus = sublinearBonus(realmSize, REALM_SCALING.BASE_REALM, REALM_SCALING.TEMPO_SCALE_PER_ROOT);
  const budgets = classBonus > 0
    ? Object.freeze({ ...baseBudgets, classMax: baseBudgets.classMax + classBonus })
    : baseBudgets;
  const elapsedWeeks = Number(worldState?.calendar?.elapsedWeeks);
  const weeks = Number.isFinite(elapsedWeeks) ? elapsedWeeks : 0;
  return {
    active: true,
    budgets,
    snapshot: readTempoLedger(worldState, weeks),
  };
}

// ── The WRITE side (design §7.2 WRITE hook / §6 record*) ─────────────────────────
// Interval-invariant, self-pruning, conditionally materialized. foldNarrativeTempo
// returns the next ledger, or NULL when it drains to empty (the caller drops the key).

/** Deep-ish structural clone of a ledger (plain objects/arrays/numbers only). */
/**
 * @param {TempoLedger | null | undefined} ledger
 * @returns {{ realm: Record<string, number[]>, settlement: Record<string, { lastMajorWeek: number }>, deferred: Record<string, Array<{ week: number, settlementId: string|null }>> }}
 */
function draftFrom(ledger) {
  /** @type {Record<string, number[]>} */
  const realm = {};
  /** @type {Record<string, { lastMajorWeek: number }>} */
  const settlement = {};
  /** @type {Record<string, Array<{ week: number, settlementId: string|null }>>} */
  const deferred = {};
  const src = ledger && typeof ledger === 'object' ? ledger : null;
  if (src && src.realm && typeof src.realm === 'object') {
    for (const cls of Object.keys(src.realm)) {
      const stamps = src.realm[cls];
      if (Array.isArray(stamps)) realm[cls] = stamps.filter(Number.isFinite).slice();
    }
  }
  if (src && src.settlement && typeof src.settlement === 'object') {
    for (const sid of Object.keys(src.settlement)) {
      const rec = src.settlement[sid];
      if (rec && typeof rec === 'object' && Number.isFinite(rec.lastMajorWeek)) {
        settlement[sid] = { lastMajorWeek: rec.lastMajorWeek };
      }
    }
  }
  if (src && src.deferred && typeof src.deferred === 'object') {
    for (const cls of Object.keys(src.deferred)) {
      const rows = src.deferred[cls];
      if (Array.isArray(rows)) {
        deferred[cls] = rows
          .filter((r) => r && typeof r === 'object' && Number.isFinite(r.week))
          .map((r) => ({ week: r.week, settlementId: r.settlementId != null ? String(r.settlementId) : null }));
      }
    }
  }
  return { realm, settlement, deferred };
}

/**
 * Fold this tick's landed births + deferrals into the next narrativeTempo ledger,
 * pruning expired stamps and self-dropping to undefined when drained. Returns null
 * when dormant (unlit rules) OR when the ledger is empty after the fold — so the
 * caller drops the key and the world stays byte-identical-dormant.
 *
 * @param {TempoLedger | null | undefined} prevLedger   the pre-fold ledger (memoryState.narrativeTempo)
 * @param {ReadonlyArray<TempoCandidate>} selectedForApply   this tick's landed outcomes
 * @param {ReadonlyArray<TempoDeferral>} deferrals        the seam's deferral records this tick
 * @param {number} elapsedWeeks                            the pre-tick window basis (worldState.calendar.elapsedWeeks)
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {TempoLedger | null}
 */
export function foldNarrativeTempo(prevLedger, selectedForApply, deferrals, elapsedWeeks, rules) {
  const tier = narrativeTempoOf(rules);
  if (tier === null) return null; // DORMANT: the key never materializes.
  const weeks = Number.isFinite(elapsedWeeks) ? elapsedWeeks : 0;

  const draft = draftFrom(prevLedger);

  // Record this tick's landed spontaneous major births (skip consequences/unknown).
  /** @type {Set<string>} */
  const bornClasses = new Set();
  for (const outcome of selectedForApply || []) {
    if (isChainedConsequence(outcome)) continue;
    const cls = dramaClassOf(outcome);
    if (cls === null) continue;
    bornClasses.add(cls);
    if (!Array.isArray(draft.realm[cls])) draft.realm[cls] = [];
    draft.realm[cls].push(weeks);
    const sid = outcome.targetSaveId != null ? String(outcome.targetSaveId) : null;
    if (sid !== null) draft.settlement[sid] = { lastMajorWeek: weeks };
  }

  // Record this tick's deferrals (the held-storm queue). A class whose birth landed
  // this tick clears its deferral queue (the storm broke).
  for (const d of deferrals || []) {
    if (!d || typeof d !== 'object') continue;
    const cls = String(d.class || '');
    if (!cls) continue;
    if (bornClasses.has(cls)) continue; // its storm broke this tick.
    if (!Array.isArray(draft.deferred[cls])) draft.deferred[cls] = [];
    draft.deferred[cls].push({ week: weeks, settlementId: d.settlementId != null ? String(d.settlementId) : null });
  }
  for (const cls of bornClasses) delete draft.deferred[cls];

  // ── PRUNE to dormant ──
  // realm stamps + deferred rows expire at the window; settlement grace clocks expire
  // at the window too (>= any graceWeeks, so grace correctness is preserved).
  for (const cls of Object.keys(draft.realm)) {
    draft.realm[cls] = draft.realm[cls].filter((w) => weeks - w < TEMPO_WINDOW_WEEKS);
    if (draft.realm[cls].length === 0) delete draft.realm[cls];
  }
  for (const sid of Object.keys(draft.settlement)) {
    if (weeks - draft.settlement[sid].lastMajorWeek >= TEMPO_WINDOW_WEEKS) delete draft.settlement[sid];
  }
  for (const cls of Object.keys(draft.deferred)) {
    draft.deferred[cls] = draft.deferred[cls].filter((r) => weeks - r.week < TEMPO_WINDOW_WEEKS);
    if (draft.deferred[cls].length === 0) delete draft.deferred[cls];
  }

  /** @type {TempoLedger} */
  const next = {};
  if (Object.keys(draft.realm).length) next.realm = draft.realm;
  if (Object.keys(draft.settlement).length) next.settlement = draft.settlement;
  if (Object.keys(draft.deferred).length) next.deferred = draft.deferred;
  return Object.keys(next).length ? next : null; // empty ⇒ drop the key (dormant).
}

/**
 * Build the DM-visibility receipt entries for this tick's deferrals (design §2:
 * "pressure builds in the west"). Aggregate/regional, DM-only. Empty deferrals ⇒
 * empty array ⇒ wizardNews byte-identical (load-bearing: wizardNews IS a golden
 * surface). Caller gates strictly behind an ACTIVE governor.
 * @param {ReadonlyArray<TempoDeferral>} deferrals
 * @param {number} tick
 * @returns {Array<{ id: string, kind: string, scope: string, significance: string, severity: number, tick: number, headline: string, summary: string, settlementIds: string[] }>}
 */
export function tempoReceiptEntries(deferrals, tick) {
  if (!Array.isArray(deferrals) || deferrals.length === 0) return [];
  /** @type {Record<string, number>} */
  const byClass = {};
  /** @type {Set<string>} */
  const settlementIds = new Set();
  for (const d of deferrals) {
    const cls = String(d?.class || 'unknown');
    byClass[cls] = (byClass[cls] || 0) + 1;
    if (d?.settlementId != null) settlementIds.add(String(d.settlementId));
  }
  const classes = Object.keys(byClass).sort();
  const label = classes.map((c) => c.replace(/_/g, ' ')).join(', ');
  return [{
    id: `tempo_pressure.${tick}`,
    kind: 'tempo_pressure',
    scope: 'regional',
    significance: 'notable',
    severity: 0.4,
    tick,
    headline: 'Pressure builds beneath the calm',
    summary: `The realm holds ${deferrals.length} gathering ${deferrals.length === 1 ? 'storm' : 'storms'} (${label}) — the tempo governor is pacing their arrival.`,
    settlementIds: [...settlementIds].sort(),
  }];
}
