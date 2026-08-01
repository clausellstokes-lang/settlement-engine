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
// W-CONVERGENCE — the foreign_clash intensity between two sponsors backing opposing
// sides of one internal contest. 0 when the intervention layer is dark ⇒ byte-identical
// (no foreign_clash reason materializes). One-directional: convergence never imports warReasons.
import { foreignClashIntensityOf } from './convergence.js';
import { buildPressureSummary } from './relationshipEvolution.js';
import { buildThreatByCid } from './martialReadiness.js';
// D4 (DESIGN_SIM_DEPTH_R2): fear_of_dominance reads the hegemony sphere topology (belief-side).
// no sphere ⇒ 0 everywhere ⇒ byte-identical. One-directional: hegemonyFear never imports this module.
import { makeHegemonyFear } from './hegemonyFear.js';
// THE VULTURE WAR (§14.1 OPPORTUNISM) + its §14.3-named mirror. The mirror-image of
// fear_of_dominance: appetite for a neighbour BELIEVED weak, routed through the same
// belief estate. Both signs of one gradient live in the leaf, so warReasons and
// peaceReasons share ONE measurement. No substrate ⇒ 0 ⇒ byte-identical.
// One-directional: opportunism never imports this module.
import { makeOpportunismRead } from './opportunism.js';
// THE RELIGIOUS CASUS (§14.1 IDEOLOGY/FAITH) + its mirror, off the CLOSED faith×alignment
// quadrant. Faith flag dark or either town patronless ⇒ 0 ⇒ byte-identical.
// One-directional: sacredClaim never imports this module.
import { makeSacredClaimRead } from './sacredClaim.js';
// D7 THE REFRAME LAYER (DESIGN_SIM_DEPTH_R2 §D7): the reframe interpretation mover runs at the
// TOP of advanceWarReasons behind its OWN gate (reframeActive), and its dark-aid read feeds the
// ingratitude_debt casus. reframeKernel is a pure leaf (never imports back — the reasons DAG
// stays acyclic). Absent flag / absent ledger ⇒ 0 ⇒ byte-identical.
import { advanceReframe, reframeActive, debtClaim01, dependencyByDesign01 } from './reframeKernel.js';
// D7: the proven-liar tilt — a low-credibility subject's past acts reframe darker. Injected as a
// liar01 closure into advanceReframe; one-directional (informationStatecraft never imports this).
import { credibilityScoreOf, credibilityDiscount } from './informationStatecraft.js';
import { clamp01 } from '../../kernel/math.js';
// WAVE P4 (THE WORLD'S HAND, docs/DESIGN_DEMOGRAPHIC_ENGINE.md law 6 and §6): the
// endogenous demographic motive, its capability split, and the perceived-scarcity read.
// It feeds the EXISTING resource_pressure casus belli and mints no reason type of its
// own, because the casus taxonomy is walker-enforced for totality AND bijection. Dark
// (demographicsEnabled absent) ⇒ never called ⇒ byte-identical.
import { demographicsActive } from './demographicsRates.js';
import { demographicWarTermsFor } from './demographicsWar.js';
import { demographyMembersFromSnapshot, measureRealmDemography } from './demographicsObservation.js';
import { warReceipt, pickLine, DECREE_DEFAULT_RECEIPTS } from './eventProse.js';

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
  /** DECLARE_CASUS decree decay (r2 worldpulse-war-military-5): a decreed reason is carried
   *  through the state-derived fold as a source-of-truth override, linearly RAMPING DOWN to zero
   *  over this many ticks (max-merged with the organic score each tick), so `force ≡ organic`
   *  holds by construction — the decree lasts, decays visibly, and is never immortal. */
  DECREE_RAMP_TICKS: 8,
});

// ── The typed catalogs + the §14.3 mirror table ─────────────────────────────

/** The casus belli taxonomy (design §14.1, the brief's seven + W-CONVERGENCE's clash). */
export const WAR_REASON_TYPES = Object.freeze([
  'grievance',
  'revanchism',
  'resource_pressure',
  'treaty_default',
  'encirclement',
  'legitimacy_hunger',
  'corruption_exposed',
  // W-CONVERGENCE: two sponsors backing OPPOSING sides of one internal contest are
  // minting their next war BETWEEN themselves (proxy-stays-proxy — the reasons layer
  // decides escalation; 0 when the intervention layer is dark ⇒ byte-identical).
  'foreign_clash',
  // D4 (DESIGN_SIM_DEPTH_R2): fear of a dominant power — Blainey's own first-class cause.
  // A free settlement fears the BELIEVED strength-share of a hegemony sphere it neighbours
  // (subordinates excluded — v1 balances, never bandwagons). 0 when no sphere / peaceEngine
  // dark ⇒ byte-identical.
  'fear_of_dominance',
  // D7 THE REFRAME LAYER: the aid we gave, now re-read as a debt unpaid (gift → debt_unpaid →
  // tribute_extracted). The reframe casus — motive attribution as belief. 0 when reframe dark ⇒
  // byte-identical. Its DISTINCT mirror is debt_forgiven (the aid re-read as a gift again).
  'ingratitude_debt',
  // D7: our trade-dependence, re-read as a leash built on purpose (commerce → dependency_by_design).
  // 0 when reframe dark ⇒ byte-identical. Its DISTINCT mirror is bonds_of_commerce.
  'dependency_by_design',
  // THE VULTURE WAR (§14.1 OPPORTUNISM, "weakness smelled"): the taxonomy modelled fear of
  // the STRONG and had no appetite for the WEAK, which taught players that being harmless
  // is safe. EPISTEMIC exactly as fear_of_dominance is — the foe half routes through the
  // belief selector, so a court can covet a neighbour that is not actually weak. 0 when the
  // pair publishes no vulnerability substrate ⇒ byte-identical. Mirror: hopelessness.
  'opportunism',
  // THE RELIGIOUS CASUS (§14.1 IDEOLOGY/FAITH): the engine ran live faith machinery and no
  // court ever went to war over a god. Scored off the CLOSED faith×alignment quadrant the
  // engine already bands. 0 when the faith flag is dark or either town names no patron ⇒
  // byte-identical. Mirror: common_rite.
  'sacred_claim',
]);

/** The casus pacis taxonomy (design §14.2, the brief's seven + W-CONVERGENCE's spheres). */
export const PEACE_REASON_TYPES = Object.freeze([
  'exhaustion',
  'belief_convergence',
  'economic_strangulation',
  'coalition_fracture',
  'mediation',
  'harvest_pressure',
  'realignment',
  // W-CONVERGENCE: the mirror of foreign_clash — two clashing sponsors settling zones
  // of influence (the mutual-disengagement ground) instead of fighting.
  'spheres_understanding',
  // D4: the distinct mirror of fear_of_dominance — the war-reason DIES when the believed
  // imbalance does. When a once-feared sphere CRUMBLES, its free neighbours reconcile (the
  // empire falls, the balance is restored). Feeds détente, NOT foreign_clash's mirror.
  'balance_restored',
  // D7: the distinct mirror of ingratitude_debt — the debt is FORGIVEN back into a gift (the
  // both-signs reconciliation lane reverses debt_unpaid → gift_forgiven), and the casus loses
  // its cause. A distinct peace kind (never a reuse — the walker stays strict + bijective).
  'debt_forgiven',
  // D7: the distinct mirror of dependency_by_design — the same trade tie re-read as a MUTUAL
  // bond that makes war too costly (commercial interdependence, Blainey-adjacent). Distinct kind.
  'bonds_of_commerce',
  // The distinct mirror of opportunism, and the pairing §14.3 itself names
  // ("opportunism↔hopelessness"): the SAME believed vulnerability gradient, read from the
  // losing end. One measurement, two signs — the mirror cannot drift from the casus because
  // there is only one number. 0 when the gradient favours the reader ⇒ byte-identical.
  'hopelessness',
  // The distinct mirror of sacred_claim: the SAME faith quadrant, read the other way — the
  // ground two courts already share. Distinct from `mediation` (a THIRD party standing
  // between them); this is the two of them standing on one floor.
  'common_rite',
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
  // W-CONVERGENCE: the clash of sponsors and its mutual-disengagement mirror.
  foreign_clash: 'spheres_understanding',
  // D4: fear of a hegemon ↔ the balance restored when it crumbles (a DISTINCT peace kind,
  // NOT a reuse of spheres_understanding — ruling 2: the walker stays strict + bijective).
  fear_of_dominance: 'balance_restored',
  // D7 (DESIGN_SIM_DEPTH_R2 §D7): the two reframe casus and their DISTINCT mirrors. The design
  // names the war reasons + the both-signs reversal (debt_unpaid → gift_forgiven); it under-
  // specifies the peace-REASON mirrors, so these are minted Blainey-consistent (JUDGMENT,
  // vetoable): a debt is forgiven back into a gift; a dependence is re-read as a binding mutual
  // commerce. Both distinct peace kinds (the strict bijection walker forbids reuse).
  ingratitude_debt: 'debt_forgiven',
  dependency_by_design: 'bonds_of_commerce',
  // §14.3 names this pairing itself ("opportunism↔hopelessness") and it is the strongest
  // mirror in the table: both sides are the SIGN of one believed vulnerability gradient,
  // so they are the same evidence read the other way by construction, not by convention.
  opportunism: 'hopelessness',
  // The faith pair: one closed quadrant, two columns. Divergence presses a claim,
  // convergence offers a floor; no quadrant scores on both.
  sacred_claim: 'common_rite',
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
 * @property {Record<string, { score: number, decreedAtTick: number, decreedUntilTick: number, sinceTick: number, receipt: string }>} [decreedReasons]
 *   r2 worldpulse-war-military-5: DECLARE_CASUS decrees, carried verbatim through the
 *   state-derived fold (max-merged, ramping down over DECREE_RAMP_TICKS) so `force ≡ organic`
 *   holds; pruned when a decree passes its decreedUntilTick.
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
  // r2 worldpulse-war-military-5 — carry DECREED reasons through the fold. A DECLARE_CASUS decree
  // is a source-of-truth override that RAMPS DOWN over DECREE_RAMP_TICKS and is MAX-merged with
  // the organic (state-derived) score for its type each tick: the decree lasts (survives the
  // rebuild that used to drop it), decays visibly, and expires — never immortal. When the pair
  // holds no decree (the common case) this whole block is inert ⇒ byte-identical.
  const nextDecreed = carryDecreedReasons(prevEntry?.decreedReasons, reasons, tick);
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
  if (Object.keys(reasons).length === 0 && !memoOut && !nextDecreed) return null;
  return {
    reasons,
    updatedTick: tick,
    ...(memoOut ? { memo: memoOut } : {}),
    ...(nextDecreed ? { decreedReasons: nextDecreed } : {}),
  };
}

/**
 * Fold the surviving DECREED reasons into `reasons` (MUTATING it, max-merge) and return the
 * carried-forward decree sub-ledger (or null when none survive). A decree ramps linearly from
 * its `score` at `decreedAtTick` to 0 at `decreedUntilTick`; while its decayed value is ≥
 * MIN_SCORE and ≥ the organic score it OVERRIDES the reason record (force ≡ organic — the
 * decreed grievance stands on the ledger as the world's own would). Expired decrees are pruned.
 * @param {Record<string, { score?: number, decreedAtTick?: number, decreedUntilTick?: number, sinceTick?: number, receipt?: string }> | null | undefined} decreed
 * @param {Record<string, ReasonRecord>} reasons  MUTATED in place
 * @param {number} tick
 * @returns {Record<string, { score: number, decreedAtTick: number, decreedUntilTick: number, sinceTick: number, receipt: string }> | null}
 */
function carryDecreedReasons(decreed, reasons, tick) {
  if (!decreed || typeof decreed !== 'object') return null;
  /** @type {Record<string, { score: number, decreedAtTick: number, decreedUntilTick: number, sinceTick: number, receipt: string }>} */
  const nextDecreed = {};
  for (const type of Object.keys(decreed).sort()) {
    const d = decreed[type];
    const until = Number(d?.decreedUntilTick);
    const at = Number(d?.decreedAtTick);
    const base = clamp01(Number(d?.score));
    if (!Number.isFinite(until) || !Number.isFinite(at) || tick >= until) continue; // expired ⇒ pruned
    // Carry the decree forward verbatim while it is still live.
    nextDecreed[type] = {
      score: base,
      decreedAtTick: at,
      decreedUntilTick: until,
      sinceTick: Number.isFinite(d?.sinceTick) ? Number(d.sinceTick) : at,
      receipt: String(d?.receipt || ''),
    };
    const ramp = Math.max(1, until - at);
    const decayed = clamp01(base * clamp01((until - tick) / ramp));
    if (decayed < REASON_TUNING.MIN_SCORE) continue; // still live but no longer above the floor
    const organic = reasons[type] ? Number(reasons[type].score) : 0;
    if (decayed >= organic) {
      reasons[type] = reasonRecord({
        type,
        score: decayed,
        tick,
        sinceTick: reasons[type]?.sinceTick ?? nextDecreed[type].sinceTick,
        receipt: nextDecreed[type].receipt || reasons[type]?.receipt,
        evidence: reasons[type]?.evidence,
      });
    }
  }
  return Object.keys(nextDecreed).length ? nextDecreed : null;
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
 * @param {string} [seed] the directed-pair phrasing seed (absent ⇒ canonical wording)
 * @returns {{ score: number, receipt: string }}
 */
export function scoreGrievance(relState, seed) {
  const resentment = clamp01(Number(relState?.resentment) || 0);
  const memory = clamp01(Number(relState?.memoryScore) || 0);
  const score = clamp01(REASON_TUNING.GRIEVANCE_RESENTMENT_W * resentment + REASON_TUNING.GRIEVANCE_MEMORY_W * memory);
  return { score, receipt: warReceipt('grievance', seed, { resentment: resentment.toFixed(2), memory: memory.toFixed(2) }) };
}

/**
 * REVANCHISM (§14.1 / §5): OLD war-typed wounds still held under a live grudge —
 * the decade clock. Counts war/betrayal/tribute/conquest/sack-typed incidents
 * at least REVANCHISM_MIN_AGE_TICKS old; requires a resentment floor (no
 * grudge, no revanche). Harsh-treaty grievances join this read when the treaty
 * waves land.
 * @param {{ resentment?: number, recentIncidents?: Array<{ type?: string, tick?: number }> } | null | undefined} relState
 * @param {number} tick
 * @param {string} [seed] the directed-pair phrasing seed (absent ⇒ canonical wording)
 * @returns {{ score: number, receipt: string }}
 */
export function scoreRevanchism(relState, tick, seed) {
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
  return { score, receipt: warReceipt('revanchism', seed, { wounds, s: wounds === 1 ? '' : 's' }) };
}

/**
 * RESOURCE PRESSURE (§14.1 economic hunger): my depleted stores against their
 * intact ones — the envy gradient on the SAME pressure index the war layer
 * reads. own/foe are 0..1 blended pressures (food-weighted).
 *
 * WAVE P4 adds two OPTIONAL terms, and their optionality IS the contract: an absent
 * `capability01` reads 1 and an absent `note` appends nothing, so every pre-P4 caller
 * — and every world whose demographic engine is dark — scores and reads byte-identically
 * (the dormancy pins hold that). demographicsWar.js supplies both together or neither.
 * @param {{ own01: number, foe01: number, capability01?: number, note?: string }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreResourcePressure({ own01, foe01, capability01, note }, /** @type {string | undefined} */ seed) {
  const gap = clamp01(Number(own01) || 0) - clamp01(Number(foe01) || 0);
  // WAVE P4 (design law 6, §6): MOTIVE vs CAPABILITY. Scarcity creates the motive the
  // gradient above measures; surplus creates the CAPABILITY to act on it, because
  // armies eat. A starving fractured realm therefore WANTS war and cannot wage it: the
  // gradient stays high and the score it produces is damped by what the granaries can
  // actually put in the field. ABSENT ⇒ 1 ⇒ byte-identical, which is what keeps every
  // dark world and every existing caller exactly where it was. There is no second cap
  // here: RESOURCE_ENVY_GAIN and the x1.30 war-factor cap remain the only two.
  const capability = Number.isFinite(Number(capability01)) ? clamp01(Number(capability01)) : 1;
  const score = clamp01(gap * REASON_TUNING.RESOURCE_ENVY_GAIN) * capability;
  if (score <= 0) return { score: 0, receipt: '' };
  // The receipt says what the court acted on, including when the court was wrong.
  return { score, receipt: `${warReceipt('resource_pressure', seed)}${typeof note === 'string' ? note : ''}` };
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
export function scoreTreatyDefault({ treaties, fromId, toId }, /** @type {string | undefined} */ seed) {
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
  return { score: worst, receipt: warReceipt('treaty_default', seed) };
}

/**
 * ENCIRCLEMENT FEAR (§14.1 security): the settlement's threat environment
 * (fronts/occupations/war stressors on self + neighbours, the existing
 * martialReadiness index), given a hostile face to fear.
 * @param {{ threat01: number, hostile: boolean }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreEncirclement({ threat01, hostile }, /** @type {string | undefined} */ seed) {
  if (!hostile) return { score: 0, receipt: '' };
  const score = clamp01(Number(threat01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: warReceipt('encirclement', seed) };
}

/**
 * FOREIGN CLASH (W-CONVERGENCE §2/§4): two sponsors backing OPPOSING sides of the same
 * internal (coup) contest are minting their next war BETWEEN themselves. PROXY STAYS
 * PROXY — this is only a typed casus; the reasons machinery decides escalation, never an
 * auto-declared war. 0 when the intervention layer is dark ⇒ byte-identical.
 * @param {{ clash01: number }} args @returns {{ score: number, receipt: string }}
 */
export function scoreForeignClash({ clash01 }, /** @type {string | undefined} */ seed) {
  const score = clamp01(Number(clash01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: warReceipt('foreign_clash', seed) };
}

/**
 * LEGITIMACY HUNGER (§14.1 domestic — the diversionary war): a shaky seat
 * under pressure rallies against an external enemy. Reads the causal
 * public_legitimacy substrate score (0..100); hunger scales as it falls under
 * the ceiling. Only a hostile pair offers a rallying target.
 * @param {{ legitimacyScore: number, hostile: boolean }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreLegitimacyHunger({ legitimacyScore, hostile }, /** @type {string | undefined} */ seed) {
  if (!hostile) return { score: 0, receipt: '' };
  const legit = Number.isFinite(legitimacyScore) ? Number(legitimacyScore) : 50;
  const ceiling = REASON_TUNING.LEGITIMACY_HUNGER_CEILING;
  if (legit >= ceiling) return { score: 0, receipt: '' };
  const score = clamp01((ceiling - legit) / ceiling);
  return { score, receipt: warReceipt('legitimacy_hunger', seed) };
}

/**
 * EXPOSED FOREIGN CORRUPTION (§14.1 ideology/moral) — REGISTRATION SEAM for
 * W-DOCTRINE. The kernel passes `undefined` today ⇒ 0. When W-DOCTRINE lands
 * its hook, it feeds the REVEALED foreign-corruption magnitude (0..1) that
 * `fromId` holds against `toId` through collectWarReasonInputs.
 * @param {{ exposedCorruption01?: number | null }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreCorruptionExposed({ exposedCorruption01 }, /** @type {string | undefined} */ seed) {
  const score = clamp01(Number(exposedCorruption01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: warReceipt('corruption_exposed', seed) };
}

/**
 * INGRATITUDE DEBT (§D7, the reframe casus) — REFRAME-FED. `from` (the giver) has re-read the
 * aid it once gave `to` as a debt unpaid (the dark-aid reframe reading, 0..1). The reframe layer
 * is the fuel: 0 when reframe is dark ⇒ no record ⇒ byte-identical. The mint intent is frozen;
 * only the MEANING moved — a war from a kindness misremembered (the layer's crown emergent).
 * @param {{ debt01?: number }} args @returns {{ score: number, receipt: string }}
 */
export function scoreIngratitudeDebt({ debt01 }, /** @type {string | undefined} */ seed) {
  const score = clamp01(Number(debt01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: warReceipt('ingratitude_debt', seed) };
}

/**
 * DEPENDENCY BY DESIGN (§D7, the reframe casus) — REFRAME-FED. `from` (the dependent) has re-read
 * its trade-dependence on `to` as a leash built on purpose (commerce → dependency_by_design). 0
 * when reframe is dark ⇒ byte-identical.
 * @param {{ design01?: number }} args @returns {{ score: number, receipt: string }}
 */
export function scoreDependencyByDesign({ design01 }, /** @type {string | undefined} */ seed) {
  const score = clamp01(Number(design01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: warReceipt('dependency_by_design', seed) };
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
 * ONE snapshot member, as this module reads it. `buildWorldSnapshot` derives `byId`
 * FROM `settlements` (worldSnapshot.js: `new Map(settlements.map(...))`), so the two
 * views carry the SAME records and must never be spelled apart here: the per-pair loop
 * reads members through `byId` and the P4 realm reading walks `settlements`, and a
 * divergence between those two spellings would be a silent disagreement about what a
 * member is.
 * @typedef {{ id: string, name?: string,
 *   settlement?: import('../settlement.schema.js').SimSettlement,
 *   causal?: { scores?: Record<string, number> } }} WarSnapItem
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
 * @param {{ snapshot: { byId?: Map<string, WarSnapItem>,
 *                       settlements?: WarSnapItem[],
 *                       regionalGraph?: { edges?: Array<Record<string, unknown>> } },
 *           worldState: Record<string, unknown>,
 *           graph?: { edges?: Array<Record<string, unknown>> } | null,
 *           pIndex?: Record<string, unknown> | null,
 *           tick: number }} args
 * @returns {WarReasonsAdvanceResult}
 */
export function advanceWarReasons({ snapshot, worldState, graph, pIndex = null, tick }) {
  // ── D7 THE REFRAME LAYER runs FIRST, behind its OWN gate (reframeActive), independent of the
  // peace engine: its deterministic transition mover folds the interpretation ledger, and the
  // reframe casus scorers below read THIS tick's fresh reads (facts frozen, meaning derived).
  // BOTH gates dark ⇒ an immediate no-op (no reframe key, no war-reason key) ⇒ byte-identical —
  // the historic §8 dormancy gate, widened to admit the reframe layer's independent gate. ──
  const reframeLit = reframeActive(worldState);
  const peaceLit = peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState));
  if (!reframeLit && !peaceLit) {
    return { worldState, changed: false, newsEntries: [] };
  }
  // D4: the hegemony fear context, built ONCE and shared by the reframe mover (a fear tilt on
  // gift/tribute readings) and the fear_of_dominance scorer. hasSphere is a cheap ground-truth
  // gate — no hegemony ⇒ every fearOf(...) returns 0 without per-observer work ⇒ byte-identical
  // (the negative-control pin). Belief-side share is memoized per observer inside.
  const hegemonyFear = makeHegemonyFear({ worldState, snapshot });
  let ws = /** @type {Record<string, unknown>} */ (worldState);
  let reframeChanged = false;
  if (reframeLit) {
    // A proven liar's past acts reframe darker: liar01 = 1 − credibilityDiscount (0 for an
    // honest/neutral or absent-ledger subject ⇒ neutral). Injected as a closure so reframeKernel
    // stays a pure leaf that never imports the info-statecraft engine.
    const credibilityOf = (/** @type {string} */ subjectId) => 1 - credibilityDiscount(credibilityScoreOf(ws, subjectId, tick));
    const reframe = advanceReframe({ snapshot, worldState: ws, graph, hegemonyFear, credibilityOf, tick });
    if (reframe.changed) { ws = reframe.worldState; reframeChanged = true; }
  }
  if (!peaceLit) {
    return { worldState: ws, changed: reframeChanged, newsEntries: [] };
  }

  const edges = (graph?.edges && Array.isArray(graph.edges) ? graph.edges : null)
    || (Array.isArray(snapshot?.regionalGraph?.edges) ? snapshot.regionalGraph.edges : []);
  const states = /** @type {Record<string, unknown>} */ (ws.relationshipStates && typeof ws.relationshipStates === 'object' ? ws.relationshipStates : {});
  const prevLedger = /** @type {ReasonLedger | null} */ (getSpatialLedger(ws, 'warReasons'));

  // The threat-environment index (existing martialReadiness read), built once.
  const threatByCid = buildThreatByCid(snapshot, ws);

  // The predation + faith contexts, built ONCE per pass (both memoize their per-settlement
  // truth reads inside; both are cheap no-ops when their own substrate is dark).
  const opportunismRead = makeOpportunismRead({ snapshot, worldState: ws });
  const sacredClaimRead = makeSacredClaimRead({ snapshot, worldState: ws });

  // WAVE P4: the REALM's carrying-capacity divergence, measured ONCE per pass rather
  // than per pair (it is a realm reading, and a per-pair recomputation would be the
  // same number N squared times). This is a MOTIVE input, which is what law 6 says it
  // is; it never reaches a risk incidence deriver, which is what law 5 forbids.
  const demographicsLit = demographicsActive(ws);
  const realmPressure01 = demographicsLit
    ? measureRealmDemography(demographyMembersFromSnapshot(snapshot), ws).realmPressure01
    : 0;

  // W-PEACE-2: the TREATY_DEFAULT feed — CLOSING this module's registration seam.
  // The treaties ledger (built by advanceTreaties, which runs THIS tick before the
  // war-reason mover) carries {parties, complianceState, defaultedBy, defaultSeverity01}
  // at each treaty's top level — exactly scoreTreatyDefault's shape. Read directly
  // (no peaceTerms import ⇒ no cycle: peaceTerms imports this module's gate). Absent
  // (dark / no treaty) ⇒ []  ⇒ scoreTreatyDefault returns 0 ⇒ byte-identical.
  const treatiesLedger = /** @type {Record<string, Record<string, unknown>> | undefined} */ (getSpatialLedger(ws, 'treaties'));
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
    // WAVE P4: the motive blend, the perceived foe reading and the capability damper,
    // assembled in demographicsWar.js so this loop gains one call rather than an engine.
    // Null when dark ⇒ the two terms below are the pressure blend verbatim and the
    // capability is absent ⇒ the score is byte-identical to every pre-P4 world.
    const demoTerms = demographicsLit
      ? demographicWarTermsFor({
        worldState: ws,
        fromId,
        toId,
        fromSettlement: fromItem?.settlement,
        toSettlement: snapshot?.byId?.get?.(toId)?.settlement,
        base01: ownPressure,
        baseFoe01: foePressure,
        realmPressure01,
      })
      : null;

    const computed = [
      { type: 'grievance', ...scoreGrievance(relState, key) },
      { type: 'revanchism', ...scoreRevanchism(relState, tick, key) },
      {
        type: 'resource_pressure',
        ...scoreResourcePressure(demoTerms
          ? {
            own01: demoTerms.own01,
            foe01: demoTerms.foe01,
            capability01: demoTerms.capability01,
            note: demoTerms.note,
          }
          : { own01: ownPressure, foe01: foePressure }, key),
      },
      { type: 'treaty_default', ...scoreTreatyDefault({ treaties: treatiesList, fromId, toId }, key) },
      { type: 'encirclement', ...scoreEncirclement({ threat01: threatByCid.get(fromId) || 0, hostile }, key) },
      {
        type: 'legitimacy_hunger',
        ...scoreLegitimacyHunger({
          legitimacyScore: Number(fromItem?.causal?.scores?.public_legitimacy),
          hostile,
        }, key),
      },
      { type: 'corruption_exposed', ...scoreCorruptionExposed({ exposedCorruption01: exposedCorruptionForPair(ws, fromId, toId, tick) }, key) },
      // W-CONVERGENCE: two sponsors on opposing sides of one internal contest (0 when dark).
      { type: 'foreign_clash', ...scoreForeignClash({ clash01: foreignClashIntensityOf(ws, fromId, toId) }, key) },
      // D4: fromId (observer) fears toId's hegemony sphere if it centres one (0 when toId
      // centres no sphere, when fromId is toId's subordinate, or no hegemony ⇒ byte-identical).
      { type: 'fear_of_dominance', ...hegemonyFear.fearOf(fromId, toId) },
      // D7: fromId (the giver) re-reads the aid it gave toId as a debt unpaid (ingratitude), and
      // fromId (the dependent) re-reads its trade tie with toId as a leash by design. 0 when the
      // reframe layer is dark / no such reading ⇒ byte-identical. This IS the crown emergent:
      // a war from a kindness misremembered.
      { type: 'ingratitude_debt', ...scoreIngratitudeDebt({ debt01: debtClaim01(ws, fromId, toId) }, key) },
      { type: 'dependency_by_design', ...scoreDependencyByDesign({ design01: dependencyByDesign01(ws, fromId, toId) }, key) },
      // THE VULTURE WAR: fromId covets toId because it BELIEVES toId could not resist.
      // The own-side means term is P4's capability verbatim (armies eat — a court that
      // cannot feed a march does not get to act on the appetite); absent ⇒ 1 ⇒ the
      // pre-P4 reading. 0 when the pair publishes no vulnerability substrate, when the
      // gradient runs the other way (that is hopelessness, on the peace side), or when
      // fromId is the weaker ⇒ byte-identical.
      { type: 'opportunism', ...opportunismRead.opportunismOf(fromId, toId, demoTerms?.capability01) },
      // THE RELIGIOUS CASUS: fromId's church holds a claim on toId's altars. 0 when the
      // faith flag is dark, when either town names no patron, or when the quadrant is a
      // common-ground one (that is common_rite, on the peace side) ⇒ byte-identical.
      { type: 'sacred_claim', ...sacredClaimRead.sacredClaimOf(fromId, toId) },
    ];

    const entry = foldPairReasons(prevLedger?.[key], computed, tick);
    if (entry) nextLedger[key] = entry;
  }

  // r2 worldpulse-war-military-5: carry forward any pair that holds a LIVE decree but has NO edge
  // this tick (the state loop above never visits it, so the rebuild would erase the decree). Fold
  // it with an EMPTY organic set — the decayed decree carries itself; an expired one drops. Inert
  // (no such pair) when nothing was decreed ⇒ byte-identical.
  for (const key of Object.keys(prevLedger || {}).sort()) {
    if (nextLedger[key]) continue; // already produced via an edge
    if (!prevLedger?.[key]?.decreedReasons) continue;
    const entry = foldPairReasons(prevLedger[key], [], tick);
    if (entry) nextLedger[key] = entry;
  }

  const hasNext = Object.keys(nextLedger).length > 0;
  const prevSerialized = JSON.stringify(prevLedger || null);
  const nextSerialized = JSON.stringify(hasNext ? nextLedger : null);
  if (prevSerialized === nextSerialized) {
    // No war-reason change — but a reframe transition may still have moved ws this tick.
    return { worldState: ws, changed: reframeChanged, newsEntries: [] };
  }
  const nextWorldState = hasNext
    ? setSpatialLedger(ws, 'warReasons', nextLedger)
    : dropSpatialLedger(ws, 'warReasons');
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
// REGISTERED (W-COMPOSER-2): realmManifest.js DECLARE_CASUS wraps this fn
// verbatim; the realm arm applies it (realmVerbExecution.js). Historical note:
// it was NOT registered in affordanceManifest.js at the W-PEACE-1 wave:
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
  casus_gate_dark: 'The causal reasons layer is not active in this campaign. Pick the Dramatic Campaign or Full Simulation preset, or light War and “Causes of war and peace” under Simulation rules → Engine waves.',
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
    receipt: String(receipt || '').trim() || pickLine(DECREE_DEFAULT_RECEIPTS, `${key}#decree`, { type: String(type), to }),
  });
  // r2 worldpulse-war-military-5: write the decree into a DECREED sub-ledger so the next tick's
  // state-derived fold carries it (max-merged, ramping down) instead of dropping it — `force ≡
  // organic` by construction. The immediate `reasons` write below stands this tick; the decree
  // sub-record keeps it alive (decaying) for DECREE_RAMP_TICKS thereafter.
  const decreedUntilTick = record.tick + REASON_TUNING.DECREE_RAMP_TICKS;
  /** @type {ReasonPairEntry} */
  const nextEntry = {
    ...(prevEntry || {}),
    reasons: { ...(prevEntry?.reasons || {}), [record.type]: record },
    decreedReasons: {
      ...(prevEntry?.decreedReasons || {}),
      [record.type]: {
        score, decreedAtTick: record.tick, decreedUntilTick,
        sinceTick: record.sinceTick, receipt: record.receipt,
      },
    },
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
