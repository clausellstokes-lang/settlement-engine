/**
 * domain/worldPulse/settlementStrategy.js — the SETTLEMENT-tier
 * strategy chooser. A deliberative "enumerate candidate moves, score each, pick
 * one" agent — the same idiom as npcAgency.evaluateNpcRules (the NPC-tier chooser),
 * lifted to the settlement tier and made RNG-VARIED via a softmax sample (so a
 * strong move is most likely but not certain — controlled variety) rather than a
 * hard argmax.
 *
 * Each settlement gets AT MOST ONE strategy candidate per tick (the loop runs ONCE
 * per settlement — codepoint-sorted — NOT per edge, so a settlement on N hostile
 * edges does not emit N candidates and starve the per-settlement auto budget).
 *
 * DETERMINISM CONTRACT (sacred):
 *   - GATED behind `simulationRules.settlementStrategyEnabled` (default FALSE).
 *     When OFF this returns [] — no candidate, no rng draw — so a legacy / layer-off
 *     campaign is BYTE-IDENTICAL.
 *   - No Date.now / Math.random / argless new Date. The move is SAMPLED via an
 *     injected `rng` forked on a STABLE key (`strategy:<S>:<tick>`), never a
 *     list-order stream. The hard-override return-home bypasses the sample entirely
 *     (it is DETERMINISTIC — an emergency recall cannot be out-competed by a high
 *     deploy weight).
 *   - Every iteration that feeds output is over a CODEPOINT-SORTED key list — the
 *     settlement loop AND the legal-move enumeration — never a Map/Set/Object
 *     insertion order. Reversing the saves/edges array yields identical chosen moves.
 *   - All cross-settlement reads come from the SINGLE pre-tick snapshot.
 *
 * PROBABILITY-1, NO DOUBLE-RANDOMIZE: the chosen move was ALREADY sampled here by
 * the softmax draw. It is emitted at probability 1 so `rollCandidates` treats it as
 * a guaranteed consequence — a second Bernoulli would double-randomize it.
 *
 * EXCLUSIVE-TAG DE-CONFLICT: every strategy candidate carries a `strategy:<S>`
 * exclusive tag. The reactive per-edge war candidates (hostileRules raid /
 * occupation pressure) where S is the state-decided aggressor ALSO resolve to
 * `strategy:<S>` (derived from their `metadata.aggressorSaveId` in
 * candidateEvents.exclusiveTags), so resolveCandidateConflicts admits exactly ONE
 * — and the strategy move WINS because it is emitted with the highest severity in
 * the exclusive group. This is what makes the hard-override return-home actually
 * SUPPRESS the reactive escalation for S (no double-fire) without weakening the
 * reactive rules themselves.
 */

import {
  settlementStrength,
  buildPressureSummary,
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
  relationshipRoles,
} from './relationshipEvolution.js';
import { computeAggressiveness } from './disposition.js';
import { deityPressureOf, thresholdFactorOf } from './dispositionProfile.js';
import { humanizeToken } from '../display/humanizeEngineTokens.js';
import { softmaxWeights, stableSampleByWeight, clamp01, hash01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';
import { warFrontsInto, warFrontsFrom } from './warFrontReads.js';
import { chaosPullOf, fidelityFactor } from './fidelityNoise.js';
import { rustOf } from './martialReadiness.js';
import { treatyEligibleWarTargets } from './warIntent.js';
// W-UPSWING stage 4 — MOTIVE INTEGRATION. The extraction-upswing EV term for the deploy
// score reads the target's economic worth (conquestFeeds) + the conqueror's OWN
// corruption conversion leak (corruptionWeb foreignGrip). Both lazy worldPulse leaves.
import { economicStrength01 } from './conquestFeeds.js';
import { foreignGripOf, corruptionWebActive } from './corruptionWeb.js';
import { upswingArcsActive } from './upswingKernel.js';
// Phase 5.5 WAVE A — THE BELIEF MAP. The three cross-settlement reads below route
// through the belief selector; the identity fallback (marker absent / omniscient /
// self) returns ground truth verbatim, forking no rng ⇒ byte-exact today.
import {
  beliefsActive, belief, readBeliefStrength, readBeliefRelationship,
  strengthBandOf, detectMisjudgment, BELIEF_TUNING, governingCoalition,
} from './beliefMap.js';
// The scorer (VI.3 down-payment → M9a two-step completion): the base-move formulas
// live in a DEFAULT descriptor (reconstructed byte-identical below); M9a adds the
// per-archetype objective SETS + the non-war MOVE LEVERS, selected by the governing
// seat's archetype when the political-depth marker (beliefsActive) is live.
import { DEFAULT_SCORING_OBJECTIVE, objectiveForArchetype } from './scoringObjective.js';
// W-PEACE-1 (§14/§H): the CAUSAL REASONS layer's consumption seam. The typed
// war/peace reason ledgers load the deploy / sue_for_peace weights (bounded,
// centered-on-1.0 factors — ×1 exactly when the peace-engine gate is dark or no
// case stands, so the dormant chooser is byte-identical), and the CHOSEN move's
// receipt names the top reasons — the weights ARE the reasons.
import { peaceCausalActive, topReasons } from './warReasons.js';
import { peaceReasonFactor, peaceReasonsFor } from './peaceReasons.js';
// §11b R-8 THE EMBASSY SUIT: a peace embassy that reached the venue deposits a bounded peace
// modifier into the roads-owned roadsEmbassies ledger; sue_for_peace CONSUMES it here. The
// reader returns ×1 EXACTLY when the ledger is absent / no live suit stands ⇒ byte-identical
// (roads deposits, the war system consumes; roads never writes war state).
import { embassySuitPeaceMult, EMBASSY_LEDGER_KEY } from '../roads/embassyLedger.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
// W-DOCTRINE-4 §3: the OVERT twin of the causal war-load — the ruling bloc loads the
// settlement's decision weights toward its END (the SAME §H kernel, receipted in the
// visible record). Dormant / no ruling bloc ⇒ factor 1.0 ⇒ byte-identical scoring.
import { settlementPoliticsActive, blocDecisionFactor } from './settlementPolitics.js';
import { makeCommitmentLoad, moveCourseRelation } from './momentum.js'; import { makeCurrentWarCasusRead, terminationPeaceReasonLines, warFactorForCasusRead } from './warTermination.js';
import { inheritedWarDemandFor } from './warPeaceDecision.js';
import { MARTIAL_HISTORY_MOVES } from './strategyMoves.js';

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** Parse a persisted tick without allowing null/blank input to masquerade as 0. */
function inputTick(value) {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : null;
}

/** @typedef {{ fork?: (key: string) => { random: () => number } }|null} RngLike */

// The hostile/adversarial axis a settlement can act on (besiege / escalate).
const HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);

// Sue-for-peace winds an edge ONE step DOWN the hostility ladder, landing on the
// SAME labels the reactive de-escalation levers use (hostile_truce → cold_war,
// cold_war_thaw → rival, rival_detente → trade_partner). Hard-coding
// hostile→cold_war here mislabeled the proposal's fromType on non-hostile edges
// AND *escalated* a mere rivalry into a cold war — a "peace" move that worsened
// the relationship.
const PEACE_STEP = Object.freeze({
  hostile: 'cold_war',
  cold_war: 'rival',
  rival: 'trade_partner',
});

// Softmax temperature (decisiveness). Load-bearing: too high collapses to a hard
// argmax (the RNG never varies the move, defeating the "controlled variety"
// requirement); too low routs/sues at random. Mid-range — the best move is most
// likely, upsets happen.
const STRATEGY_K = 3.5;

// Severity floor that guarantees a strategy move outranks the reactive war
// candidates it shares the `strategy:<S>` exclusive tag with (hostileRules raid
// severity tops out ≈0.64). The hard override sits even higher so an emergency
// recall always wins its group.
const MOVE_SEVERITY = 0.72;
const OVERRIDE_SEVERITY = 0.95;

// ── W-UPSWING stage 4 — the extraction-upswing EV term (constitution §0.5) ────
// "An empire seeks to conquer to improve their upswings." The deploy score gains a
// bounded, signed term = what THIS conquest buys (the target's extractable worth),
// AFTER a flat occupation burden and — the LEAK in the pipe (§0.3c) — scaled DOWN by
// the conqueror's OWN corruption grip (foreignGripOf: a corruption-heavy empire skims
// its own spoils, so fewer reach the citizens the upswing serves). 0-WHEN-DARK: the
// term is built only when upswingArcsEnabled is lit (the caller passes null otherwise)
// ⇒ the dormant deploy expression is untouched, byte-identity holds.
const EXTRACTION_EV_WEIGHT = 0.14;   // the max benefit weight (bounded)
const EXTRACTION_OCCUPATION_BURDEN = 0.05; // the flat occupation-cost subtrahend
const EXTRACTION_EV_BOUND = 0.14;    // clamp the signed term to a small band

/**
 * The bounded, signed extraction-upswing adjustment for conquering `targetId`. Reads the
 * target's economic worth (conquestFeeds.economicStrength01) and the conqueror's OWN
 * corruption conversion leak (corruptionWeb.foreignGripOf, 0 when the corruption web is
 * dark). Bounded to ±EXTRACTION_EV_BOUND. Pure over the reads.
 * @param {{ worldState: Record<string, unknown>|null|undefined,
 *   snapshot: { byId?: { get?: (id: string) => ({ settlement?: unknown }|undefined) },
 *     settlements?: Array<{ id?: unknown, settlement?: unknown }> },
 *   conquerorId: string, targetId: string }} args
 * @returns {number}
 */
export function extractionUpswingAdj({ worldState, snapshot, conquerorId, targetId }) {
  const byId = snapshot?.byId?.get ? snapshot.byId.get(String(targetId)) : (snapshot?.settlements || []).find((it) => String(it?.id) === String(targetId));
  const target = byId?.settlement;
  if (!target) return 0;
  const targetValue01 = clamp01(economicStrength01(/** @type {import('./conquestFeeds.js').SettlementLike} */ (target)));
  // The conqueror's own corruption leak (0 when the corruption web is dark).
  const leak01 = corruptionWebActive(worldState)
    ? clamp01(foreignGripOf(worldState, /** @type {import('./corruptionWeb.js').WebSnapshot} */ (/** @type {unknown} */ (snapshot)), String(conquerorId)))
    : 0;
  const raw = EXTRACTION_EV_WEIGHT * targetValue01 * (1 - leak01) - EXTRACTION_OCCUPATION_BURDEN;
  return Math.max(-EXTRACTION_EV_BOUND, Math.min(EXTRACTION_EV_BOUND, raw));
}

// M9a NON-WAR LEVERS — the house-voice copy for the merchant / church / warlord
// moves. war-5: they no longer emit as INERT posture markers — each carries a BOUNDED,
// AUTO relationship nudge (LEVER_EFFECT below) applied through applyRelationshipPatch,
// so a merchant/church/warlord seat that reaches for a lever both wins the strategy:<S>
// exclusive group AND moves real diplomatic state (a bounded scalar + a recentIncidents
// entry the drift reads) — differentiated by archetype: merchant/church levers build or
// dampen ties, warlord levers menace. Bounded + gated behind the belief map + an
// archetype seat (O.levers present) ⇒ a dormant / no-archetype world never emits one.
const LEVER_COPY = Object.freeze({
  reroute: { headline: (/** @type {string} */ n) => `${n} reroutes its trade`, summary: (/** @type {string} */ n) => `${n}'s merchants steer their caravans around the danger rather than answer it with steel.` },
  embargo: { headline: (/** @type {string} */ n, /** @type {string} */ t) => `${n} closes its markets to ${t}`, summary: (/** @type {string} */ n, /** @type {string} */ t) => `${n} answers ${t} with an embargo — economic pressure in the place of a march.` },
  credit: { headline: (/** @type {string} */ n) => `${n} extends its credit`, summary: (/** @type {string} */ n) => `${n}'s houses underwrite their partners, buying influence with coin instead of arms.` },
  missionize: { headline: (/** @type {string} */ n) => `${n} sends out missionaries`, summary: (/** @type {string} */ n) => `${n} spreads its faith outward rather than its soldiers.` },
  legitimacy: { headline: (/** @type {string} */ n) => `${n} shores up its legitimacy`, summary: (/** @type {string} */ n) => `${n}'s clergy consolidate the seat's authority at home.` },
  prestige: { headline: (/** @type {string} */ n) => `${n} seeks a stroke of prestige`, summary: (/** @type {string} */ n, /** @type {string} */ t) => `${n} eyes a glorious blow against ${t}.` },
  opportunity: { headline: (/** @type {string} */ n) => `${n} weighs an opportunity`, summary: (/** @type {string} */ n, /** @type {string} */ t) => `${n} marks ${t} as ripe — a chance more than a grievance.` },
});

// M9a LEVER APPLY EFFECTS (war-5). Each lever nudges ONE-or-two bounded diplomatic
// scalars on the relevant edge (the hostile target for the war-adjacent levers; the
// strongest NON-hostile neighbour for the outward/build levers) + stamps a typed
// recentIncidents entry the relationship drift reads. The deltas are GENTLE
// (mean-reversion pulls them back over time) so one lever is a pressure, not a shove.
// `targetKind`: 'hostile' addresses ctx.hostileTargets[0]; 'partner' the strongest
// non-hostile neighbour. Absent a valid edge, the lever falls back to its inert marker.
const LEVER_NUDGE = 0.05;      // the standard bounded nudge magnitude
const LEVER_NUDGE_SOFT = 0.04; // a gentler secondary nudge
/** @type {Readonly<Record<string, { targetKind: string, incident: string, nudges: Readonly<Record<string, number>> }>>} */
const LEVER_EFFECT = Object.freeze({
  reroute:     { targetKind: 'hostile', incident: 'trade_reroute',            nudges: Object.freeze({ dependency: -LEVER_NUDGE }) },
  embargo:     { targetKind: 'hostile', incident: 'embargo',                  nudges: Object.freeze({ resentment: +LEVER_NUDGE, tradeBalance: -LEVER_NUDGE }) },
  credit:      { targetKind: 'partner', incident: 'credit_extended',          nudges: Object.freeze({ trust: +LEVER_NUDGE, dependency: +LEVER_NUDGE_SOFT }) },
  missionize:  { targetKind: 'partner', incident: 'missionary_outreach',      nudges: Object.freeze({ trust: +LEVER_NUDGE }) },
  legitimacy:  { targetKind: 'partner', incident: 'legitimacy_consolidation', nudges: Object.freeze({ trust: +LEVER_NUDGE_SOFT, dependency: +LEVER_NUDGE_SOFT }) },
  prestige:    { targetKind: 'hostile', incident: 'prestige_display',         nudges: Object.freeze({ fear: +LEVER_NUDGE }) },
  opportunity: { targetKind: 'hostile', incident: 'opportunity_marking',      nudges: Object.freeze({ resentment: +LEVER_NUDGE }) },
});

// warFrontsInto / warFrontsFrom are the PROVENANCE-GATED reads from ./warFrontReads.js
// (imported above). The local copies here used to treat ANY confirmed war_front as a
// siege, so a hostile-relationship label (same war_front id, no army) made the strategy
// chooser misread a merely-hostile home as besieged and a merely-hostile neighbour as a
// besieging target. The shared gate skips relationship-minted fronts.

/**
 * A settlement is besieged/occupied if any (live, war-layer) war_front points AT it.
 * @param {any} graph @param {any} id @returns {boolean}
 */
function isBesieged(graph, id) {
  return warFrontsInto(graph, id).length > 0;
}

/**
 * The observer's belief about whether `subject` is besieged. SELF (observer ===
 * subject) and the DORMANT path read ground truth verbatim (byte-exact). When
 * beliefs are live: a held, CONFIDENT belief lets the observer know a real siege;
 * an info-starved observer (no belief record) is UNAWARE (the lord who never
 * hears his vassal is besieged, so never marches to relieve it). Never invents a
 * siege that is not real (Wave A: no false-siege belief — that field is Wave B).
 * @param {unknown} observer @param {unknown} subject @param {unknown} graph
 * @param {import('./beliefMap.js').BeliefWorldState} worldState @param {boolean} active @returns {boolean}
 */
function beliefAwareBesieged(observer, subject, graph, worldState, active) {
  const truth = isBesieged(graph, subject);
  if (!active || String(observer) === String(subject)) return truth; // self / dormant ⇒ byte-exact
  const b = belief(String(observer), String(subject), worldState);
  if (b.source === 'truth') return truth;
  if (b.source === 'unknown') return false;             // absence-as-information: unaware
  return truth && b.record.confidence01 >= BELIEF_TUNING.SIEGE_AWARENESS_CONFIDENCE;
}

/** The GROUND-TRUTH relationship label between two settlements (for misjudgment
 *  divergence), 'neutral' when no edge pairs them.
 * @param {{ worldState?: { relationshipStates?: Record<string, unknown> } }} snapshot @param {unknown} a @param {unknown} b @returns {string} */
function trueRelationshipType(snapshot, a, b) {
  const rawEdge = hostileEdgeBetween(snapshot, a, b);
  if (!rawEdge) return 'neutral';
  const relState = ensureRelationshipState(
    normalizeRelationshipEdge(rawEdge),
    snapshot?.worldState?.relationshipStates?.[relationshipKeyFromEdge(rawEdge)],
  );
  return relState.relationshipType;
}

/** The misjudgment (or null) an observer commits by marching on `target`: its
 *  BELIEVED strength band + relationship vs the GROUND TRUTH. Reads the raw
 *  ground-truth strength lookup (`trueStrengthFor`), never the belief-wrapped one.
 * @param {string} observer @param {string} target @param {import('./beliefMap.js').BeliefWorldState} worldState
 * @param {{ worldState?: { relationshipStates?: Record<string, unknown> } }} snapshot @param {((id: string) => number)|null} trueStrengthFor */
function misjudgmentFor(observer, target, worldState, snapshot, trueStrengthFor) {
  const b = belief(observer, target, worldState);
  const believedStrengthBand = b.source === 'belief' ? b.record.strengthBand : BELIEF_TUNING.NEUTRAL_STRENGTH_BAND;
  const believedRelationship = b.source === 'belief' ? b.record.allianceLabel : 'unknown';
  const confidence01 = b.source === 'belief' ? b.record.confidence01 : 0;
  return detectMisjudgment({
    observerId: observer,
    subjectId: target,
    believedStrengthBand,
    trueStrengthBand: strengthBandOf(trueStrengthFor ? trueStrengthFor(target) : 0.5),
    believedRelationship,
    trueRelationship: trueRelationshipType(snapshot, observer, target),
    confidence01,
  });
}

/** A concise chooser-side reason line naming the misjudgment (the fuller receipt
 *  is the wizardNews entry beliefMisjudgmentNewsEntries composes).
 * @param {import('./beliefMap.js').Misjudgment} mis @param {string} name @param {string} targetName */
function misjudgmentReason(mis, name, targetName) {
  const parts = [];
  if (mis.kinds.includes('strength')) parts.push("a stale read of its rival’s strength");
  if (mis.kinds.includes('relationship')) parts.push('a hostility the world has already left behind');
  return `${name} marches on ${targetName} through ${parts.join(' and ')} (confidence ${mis.confidence01.toFixed(2)}) — a misjudgment.`;
}

/**
 * Per-settlement strength lookup from the SINGLE pre-tick snapshot, using the SAME
 * pressure index the relationship contests + the war layer read — so the chooser's
 * "do I out-muscle this target?" can never diverge from the deploy gate.
 * @param {any} snapshot @param {any} pressureIdx @returns {(id: any) => number}
 */
function buildStrengthLookup(snapshot, pressureIdx) {
  const cache = new Map();
  return (/** @type {any} */ id) => {
    const key = String(id);
    if (cache.has(key)) return cache.get(key);
    const item = snapshot?.byId?.get?.(key);
    if (!item) {
      cache.set(key, 0);
      return 0;
    }
    const strength = settlementStrength(item, buildPressureSummary(pressureIdx, key));
    cache.set(key, strength);
    return strength;
  };
}

/**
 * The observer's BELIEF-SOURCED strength lookup: the raw ground-truth `strengthFor`
 * for a SELF read, else the observer's banded belief (or the neutral mid band when
 * it holds no belief — max-uncertainty). Used ONLY when beliefs are live; the
 * dormant path passes the raw `strengthFor` unchanged (byte-exact, zero forks).
 * @param {(id: string) => number} strengthFor @param {string} observer @param {import('./beliefMap.js').BeliefWorldState} worldState
 * @returns {(id: unknown) => number}
 */
function makeBeliefStrengthFor(strengthFor, observer, worldState) {
  return (subject) => readBeliefStrength(observer, String(subject), worldState, strengthFor(String(subject)));
}

/**
 * Economic exhaustion of a settlement in 0..1 (higher = more drained). Reads the
 * LIVE economic_capacity causal score (0..100, the Phase-0 / homeostasis dial), so
 * sue-for-peace weight tracks war bankruptcy. Missing score ⇒ 0 (not exhausted).
 * @param {any} item @returns {number}
 */
function economicExhaustion(item) {
  const cap = item?.causal?.scores?.economic_capacity;
  if (!Number.isFinite(cap)) return 0;
  return clamp01(1 - cap / 100);
}

/**
 * The PERCEIVED war-bankruptcy at the peace threshold (W-C1 item 1b). The sue-for-peace
 * decision reads its own economic exhaustion (war bankruptcy) through the SAME alignment-
 * conditioned fidelity noise as the war-entry siege classify: a lawful/seasoned realm
 * reads the calculator TRUE, a chaotic-devout one mis-reads, and strategic RUST worsens
 * everyone — so rust/chaos yield a DELAYED or PREMATURE suit. The per-decision fork is
 * seeded (site `sue_for_peace`, key `peace_threshold`) ⇒ replay-identical, and returns the
 * TRUE exhaustion (factor 1, NO rng forked) when chaosPull 0 AND rust 0 — every deity-free /
 * lawful / no-martial-record actor is byte-identical. Pure given the injected rng.
 * @param {{ exhaustion: number, rng: RngLike, tick: number, sId: string|number, chaosPull: number, rust: number }} args
 * @returns {number}
 */
function perceivedPeaceExhaustion({ exhaustion, rng, tick, sId, chaosPull, rust }) {
  if (!(chaosPull > 0) && !(rust > 0)) return exhaustion;   // true reading ⇒ byte-identical (no fork)
  return clamp01(exhaustion * fidelityFactor({
    rng, site: 'sue_for_peace', tick, cid: String(sId), decisionKey: 'peace_threshold', chaosPull, rust,
  }));
}

/**
 * Resolve, from the pre-tick edges + relationshipStates, the geopolitical context
 * a single settlement S reasons about: its hostile targets, its vassals, whether it
 * (or any vassal) is besieged/occupied. All sets codepoint-sorted / order-free.
 * @param {any} snapshot @param {any} graph @param {any} sId
 * @param {boolean} [active] @param {number|null} [tick] the pulse tick, when the caller has one
 */
function contextFor(snapshot, graph, sId, active = false, tick = null) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const worldState = snapshot?.worldState;
  const id = String(sId);
  const hostileTargets = new Set();
  const vassalIds = new Set();

  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a !== id && b !== id) continue;
    const other = a === id ? b : a;
    if (!snapshot?.byId?.has?.(other)) continue;

    // WAVE A: the observer targets on the relationship it BELIEVES (possibly a
    // STALE hostility — the ally-confusion war). Dormant / no-belief ⇒ the true
    // (declared, public) label verbatim ⇒ byte-exact + non-paranoid.
    const perceivedType = active
      ? readBeliefRelationship(id, other, worldState, relState.relationshipType)
      : relState.relationshipType;
    if (HOSTILE_TYPES.has(perceivedType)) {
      hostileTargets.add(other);
    }
    // A vassal obligation reads the TRUE label — a vassalage is a formal, known
    // bond (the lord knows his own vassals); the belief fogs their STATE, not the
    // contract. (beliefAwareBesieged below fogs whether he knows they are besieged.)
    if (relState.relationshipType === 'vassal') {
      const { seniorId, juniorId } = relationshipRoles(edge, relState);
      if (String(seniorId) === id) vassalIds.add(String(juniorId));
    }
  }

  const homeBesieged = beliefAwareBesieged(id, id, graph, worldState, active); // self ⇒ truth
  const vassalBesieged = [...vassalIds].some((vid) => beliefAwareBesieged(id, vid, graph, worldState, active));

  const sortedHostileTargets = [...hostileTargets].sort(codepoint);
  return {
    hostileTargets: treatyEligibleWarTargets(worldState, id, sortedHostileTargets, tick),
    vassalIds: [...vassalIds].sort(codepoint),
    homeBesieged,
    vassalBesieged,
    besieging: warFrontsFrom(graph, id),
  };
}

/** Exact public helper for WR-6's pre-decision hard-override parity.
 *  @param {number|null} [tick] a real pulse tick, not just the `null` its default implies:
 *  typed here because an inferred `null`-only parameter reds every annotated caller. */
export function strategyEmergencyRecallFor(snapshot, settlementId, tick = null) {
  const worldState = snapshot?.worldState || {};
  const context = contextFor(
    snapshot,
    snapshot?.regionalGraph || {},
    String(settlementId),
    beliefsActive(worldState),
    tick,
  );
  return context.homeBesieged || context.vassalBesieged;
}

/**
 * The relationship edge between two settlements (raw), for a sue-for-peace proposal.
 * @param {any} snapshot @param {any} a @param {any} b
 */
function hostileEdgeBetween(snapshot, a, b) {
  const aId = String(a);
  const bId = String(b);
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const s = getRelationshipSettlements(edge);
    const paired = (String(s.from) === aId && String(s.to) === bId)
      || (String(s.from) === bId && String(s.to) === aId);
    if (paired) return rawEdge;
  }
  return null;
}

// Loose sim shapes for the war-5 lever helpers below (zero any-holes: the looseness
// lives in pulseShapes.js's own baseline). StrategyContext mirrors contextFor's return.
/** @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot */
/** @typedef {import('./pulseShapes.js').RelationshipNudge} RelationshipNudge */
/** @typedef {{ hostileTargets: string[], vassalIds: string[], homeBesieged: boolean, vassalBesieged: boolean, besieging: string[] }} StrategyContext */

/**
 * The strongest NON-hostile neighbour of `sId` — the target for the outward/build M9a
 * levers (credit / missionize / legitimacy). Codepoint-stable tie-break; null when the
 * settlement has no non-hostile edge. Reads only the pre-tick snapshot (order-free).
 * @param {PulseSnapshot} snapshot @param {string|number} sId @param {(id:string)=>number} strengthFor @returns {string|null}
 */
function strongestNonHostileNeighbour(snapshot, sId, strengthFor) {
  const id = String(sId);
  const states = snapshot?.worldState?.relationshipStates || {};
  /** @type {string|null} */
  let best = null;
  let bestStrength = -Infinity;
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    if (HOSTILE_TYPES.has(relState.relationshipType)) continue;
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a !== id && b !== id) continue;
    const other = a === id ? b : a;
    if (!snapshot?.byId?.has?.(other)) continue;
    const s = strengthFor(other);
    if (s > bestStrength || (s === bestStrength && (best == null || other < best))) {
      bestStrength = s;
      best = other;
    }
  }
  return best;
}

/**
 * Build a BOUNDED, AUTO relationship nudge for a chosen M9a lever (war-5): pick the edge
 * (the hostile target, or the strongest non-hostile neighbour), read its CURRENT state,
 * and apply the lever's gentle scalar deltas as clamped ABSOLUTE values
 * (applyRelationshipPatch SETS, not deltas — so we read-then-clamp here). Returns null
 * when there is no valid edge ⇒ the lever falls back to its inert marker (byte-safe).
 * @param {string} move @param {PulseSnapshot} snapshot @param {string|number} sId @param {StrategyContext} ctx @param {(id:string)=>number} strengthFor
 * @returns {(RelationshipNudge & { targetId: string })|null}
 */
function leverNudgeFor(move, snapshot, sId, ctx, strengthFor) {
  const eff = LEVER_EFFECT[move];
  if (!eff) return null;
  const target = eff.targetKind === 'hostile'
    ? ctx.hostileTargets[0]
    : strongestNonHostileNeighbour(snapshot, sId, strengthFor);
  if (!target) return null;
  const edge = hostileEdgeBetween(snapshot, sId, target);
  if (!edge) return null;
  const key = relationshipKeyFromEdge(edge);
  const relState = ensureRelationshipState(
    normalizeRelationshipEdge(edge),
    snapshot?.worldState?.relationshipStates?.[key],
  );
  /** @type {Record<string, number>} */
  const patch = {};
  const relRec = /** @type {Record<string, unknown>} */ (relState);
  for (const [scalar, delta] of Object.entries(eff.nudges)) {
    patch[scalar] = clamp01((Number(relRec[scalar]) || 0) + delta);
  }
  return { relationshipKey: key, relationshipPatch: patch, incidentType: eff.incident, targetId: String(target) };
}

/**
 * Build a probability-1 strategy candidate. The `strategy:<S>` exclusive tag is what
 * the reactive escalation for S contends with; severity is set ABOVE the reactive
 * war candidates so the strategy move wins the exclusive group.
 *
 * @param {{ move: string, sId: string, tick: number, severity: number, headline: string,
 *   summary: string, reasons: string[], proposal?: any, condition?: any, metadata?: any,
 *   relationshipNudge?: RelationshipNudge|null }} args
 */
function strategyCandidate({ move, sId, tick, severity, headline, summary, reasons, proposal, condition, metadata, relationshipNudge = null }) {
  const inertLever = Object.prototype.hasOwnProperty.call(LEVER_COPY, move)
    && !relationshipNudge;
  const base = {
    id: `candidate.strategy.${move}.${stablePart(sId)}.${tick}`,
    type: (proposal || condition) ? (proposal ? 'relationship' : 'condition') : 'condition',
    candidateType: `strategy_${move}`,
    ruleId: `settlement_strategy_${move}`,
    ruleFamily: 'strategy',
    targetSaveId: String(sId),
    severity,
    probability: 1, // ALREADY sampled here — no second roll.
    applyMode: proposal ? 'proposal' : 'auto',
    headline,
    summary,
    reasons,
    metadata: { settlementId: String(sId), strategyMove: move, ...(metadata || {}) },
    // Defend / hold and a relationship-less archetype lever have only one job:
    // win the strategy:<S> exclusive group. The central cadence partition drops
    // them after arbitration because they carry no state mutation or Chronicle beat.
    ...(move === 'defend' || move === 'hold' || inertLever
      ? { recordMode: 'suppression_only' }
      : {}),
    // `strategy:<S>` is the exclusive tag (allow-listed in candidateEvents). The
    // reactive raid/occupation candidates where S is the aggressor resolve to the
    // SAME tag (via their metadata.aggressorSaveId) — exactly one is admitted.
    conflictTags: [`strategy:${String(sId)}`],
    generatedAtTick: tick,
  };
  if (proposal) {
    return {
      ...base,
      relationshipKey: proposal.relationshipKey,
      relationshipPatch: proposal.relationshipPatch,
      proposalPayload: proposal.proposalPayload,
      conflictTags: [...base.conflictTags, `label:${proposal.relationshipKey}`],
    };
  }
  // M9a LEVER APPLY (war-5): a bounded, AUTO relationship nudge (NOT a DM proposal —
  // no label change, no wind-down). It rides applyRelationshipPatch (the same path
  // sue_for_peace uses) so the lever mutates real state — a diplomatic scalar + a
  // recentIncidents entry the relationship drift reads — instead of an inert marker.
  if (relationshipNudge) {
    return {
      ...base,
      type: 'relationship',
      relationshipKey: relationshipNudge.relationshipKey,
      relationshipPatch: relationshipNudge.relationshipPatch,
      metadata: { ...base.metadata, incidentType: relationshipNudge.incidentType },
    };
  }
  // condition is OPT-IN (only the `deploy` move carries army_deployed). defend /
  // hold / return_home emit an INERT marker (no `condition`) so they win the
  // exclusive group + suppress the reactive escalation WITHOUT a stray
  // defense/economy debuff — a status-quo decision has no world-state cost.
  return condition ? { ...base, condition } : base;
}

/**
 * Persist only the qualitative, identity-addressed half of WR-5's live
 * termination read on a held peace proposal. Approval may happen on a later
 * pulse; this compact row records whose books actually made the offer without
 * freezing any control scalar or copying the full pulse receipt into the
 * proposal docket.
 * @param {any} termination
 */
function compactWarRulingRead(termination) {
  const receipt = termination?.receipt && typeof termination.receipt === 'object'
    ? termination.receipt
    : null;
  if (!receipt) return null;
  const keys = [
    'id', 'tick', 'attackerId', 'targetId', 'authoritySignature',
    'booksInterest', 'booksDirection', 'booksReason', 'booksPublicReason',
    'rulerId', 'rulerName', 'factionId', 'factionName', 'patronId', 'patronName',
    'rulerSecurityBand', 'rulerLawfulnessBand', 'rulerMoralityBand',
    'rivalTriumphBand', 'trajectory', 'trajectoryMarginBand', 'momentumBroken',
    'decidingTerm', 'causeState', 'dissolvedCauseTypes', 'authorityDissolvedCauseTypes', 'reason',
  ];
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const key of keys) {
    if (receipt[key] !== undefined && receipt[key] !== null && receipt[key] !== '') {
      out[key] = receipt[key];
    }
  }
  if (receipt.bands && typeof receipt.bands === 'object') out.bands = { ...receipt.bands };
  return Object.keys(out).length ? out : null;
}

/**
 * The legal move set for a settlement, codepoint-sorted, each with a deterministic
 * utility score. The move space mirrors the spec's enumeration (defend / deploy /
 * relieve-ally / liberate / hold / attrition / rout / sue-for-peace); we ship the
 * subset that maps onto built levers (defend / deploy / hold / sue_for_peace),
 * scored from aggressiveness, strength vs targets, current war/siege state, vassal
 * status, and economic exhaustion. Returns scored rows sorted by move key (NOT by
 * score) so the softmax input order is canonical and order-free; the deploy row also
 * carries the exact best-margin target identity that its score was computed against.
 * M9a: `objective` selects the coefficient set (DEFAULT ⇒ byte-identical Wave-A
 * scoring; a per-archetype set shifts the base-move balance AND adds its non-war
 * levers). A default objective has NO `levers`, so the lever block never runs and
 * the returned move set is IDENTICAL to Wave A's.
 * @param {{ sId: any, ctx: any, aggressiveness: number, peaceAggressiveness?:number,
 *   strengthFor: (id: any) => number, exhaustion: number,
 *   rng?: RngLike, tick?: number, chaosPull?: number, rust?: number,
 *   objective?: import('./scoringObjective.js').ScoringObjective,
 *   causal?: { warFor: (id: string) => number, peaceFor: (id: string) => number } | null,
 *   coalitionLoad?: { factorFor: (move: string) => number } | null,
 *   commitmentLoad?: { factorFor: (move: string, targetId?: string|null) => number } | null,
 *   extractionEV?: { adjFor: (targetId: string) => number } | null,
 *   embassy?: { suitFor: (foes: string[]) => number } | null,
 *   termination?: { suePressure01:number } | null,
 *   dispositionThresholds?: { martial:number, mercantile:number, diplomatic:number,
 *     insular:number, deityWar:number, martialInAggressiveness?:boolean,
 *     receipts?:Record<string,string> } | null }} args
 * @returns {Array<{ move:string, score:number, bestTargetId?:string, dispositionReasons?:string[] }>}
 */
function enumerateMoves({ sId, ctx, aggressiveness, peaceAggressiveness = aggressiveness, strengthFor, exhaustion, rng = null, tick = 0, chaosPull = 0, rust = 0, objective = DEFAULT_SCORING_OBJECTIVE, causal = null, coalitionLoad = null, commitmentLoad = null, extractionEV = null, embassy = null, termination = null, dispositionThresholds = null }) {
  const sStrength = strengthFor(sId);
  const aggr = aggressiveness - 1; // signed drive ∈ ~[-0.5, 0.5]
  const peaceAggr = peaceAggressiveness - 1;
  // The scorer (VI.3 / M9a): the move coefficients live in the OBJECTIVE descriptor;
  // the arithmetic below is the SAME expression in the SAME order, so a DEFAULT
  // objective is byte-identical to Wave A (M9a's per-archetype sets re-tune it).
  const O = objective || DEFAULT_SCORING_OBJECTIVE;
  /** @type {Record<string, number>} */
  const scored = {};

  // The best strength margin over any hostile target (−Infinity when none). Hoisted
  // so both `deploy` and the warlord levers read the SAME value; calling strengthFor
  // regardless of siege state is a pure cached lookup (no scored-output change).
  // W-PEACE-1: the best-margin TARGET is tracked alongside (a pure record — no
  // scored-output change) so the causal deploy factor reads the right pair.
  let bestMargin = -Infinity;
  let bestTargetId = null;
  for (const targetId of ctx.hostileTargets) {
    const margin = sStrength - strengthFor(targetId);
    if (margin > bestMargin) { bestMargin = margin; bestTargetId = targetId; }
  }

  // defend — always legal. Strong when besieged or when the settlement is weak.
  scored.defend = clamp01(O.defend.base + (ctx.homeBesieged ? O.defend.besiegedBonus : 0) + (0.5 - sStrength) * O.defend.weaknessBonus - aggr * O.defend.aggrDamp);

  // hold — passive status-quo. The baseline fallback; mildly favored by a pacific
  // disposition and an exhausted economy that can't afford a new front.
  scored.hold = clamp01(O.hold.base - aggr * O.hold.aggrDamp + exhaustion * O.hold.exhaustionBonus);

  // deploy — only legal if NOT besieged at home, confident, and there's a hostile
  // target it clearly out-muscles. Scaled by aggressiveness; damped by exhaustion.
  // WAVE A: `strengthFor(targetId)` is the observer's BELIEVED strength of the
  // target (banded) when beliefs are live — so an over-confident misjudgment
  // marches, and a misinformed one holds.
  if (!ctx.homeBesieged && bestMargin > -Infinity && bestMargin > 0.05) {
    let deployScore = clamp01(O.deploy.base + bestMargin * O.deploy.marginGain + aggr * O.deploy.aggrGain - exhaustion * O.deploy.exhaustionDamp);
    // W-PEACE-1 §H: the accumulated CASUS ledger loads the deploy weight against
    // the best-margin target (bounded ≤ ×(1+WAR_FACTOR_W); ×1 exactly when the
    // gate is dark or no case stands — the dormant expression above is untouched,
    // so byte-identity holds).
    const warMult = causal && bestTargetId != null
      ? causal.warFor(String(bestTargetId))
      : 1;
    // A treaty block is LEGALITY, not a weak preference. A zero-scored softmax row
    // still has positive probability, so factor 0 omits deploy from the move space.
    if (warMult !== 0) {
      if (warMult !== 1) deployScore = clamp01(deployScore * warMult);
      // W-UPSWING §0.5: the bounded, signed extraction-upswing EV term — what this
      // conquest BUYS after burden + the conqueror's corruption leak. NULL (⇒ +0) when
      // the upswing gate is dark, so the dormant expression above is untouched.
      if (extractionEV && bestTargetId != null) {
        const adj = extractionEV.adjFor(String(bestTargetId));
        if (adj !== 0) deployScore = clamp01(deployScore + adj);
      }
      scored.deploy = deployScore;
    }
  }

  // sue_for_peace — GATED: S and ALL its vassals must be free (not besieged/
  // occupied), and S must actually be in a hostile posture (a target or a front).
  // WEIGHTED by economic exhaustion (war bankruptcy → seek peace) and a pacific
  // disposition. Pulls the EXISTING de-escalation levers on apply.
  const peaceGateOpen = !ctx.homeBesieged && !ctx.vassalBesieged;
  const inConflict = ctx.hostileTargets.length > 0 || ctx.besieging.length > 0;
  if (peaceGateOpen && inConflict) {
    // W-C1 item 1b: the peace-threshold reading is MISREAD toward chaos + rust (a delayed
    // or premature suit); read true (byte-identical) for a lawful, seasoned, deity-free realm.
    const perceived = termination ? clamp01(Number(termination.suePressure01) || 0) : perceivedPeaceExhaustion({ exhaustion, rng, tick, sId, chaosPull, rust });
    let peaceScore = clamp01(O.sueForPeace.base + perceived * O.sueForPeace.exhaustionGain - peaceAggr * O.sueForPeace.aggrDamp);
    // W-PEACE-1 §H: the accumulated CASUS PACIS ledger loads the peace weight —
    // the strongest case across the conflicts S is actually in (codepoint-stable
    // max; bounded ≤ ×(1+PEACE_FACTOR_W); ×1 exactly when dark ⇒ byte-identical).
    if (causal) {
      let peaceMult = 1;
      for (const foeId of [...ctx.hostileTargets, ...ctx.besieging].map(String).sort()) {
        const m = causal.peaceFor(foeId);
        if (m > peaceMult) peaceMult = m;
      }
      if (peaceMult !== 1) peaceScore = clamp01(peaceScore * peaceMult);
    }
    // §11b R-8 THE EMBASSY SUIT: a heard peace embassy loads the sue_for_peace weight the same
    // bounded way as the causal ledger — roads DEPOSITED, the war system CONSUMES. NULL (⇒ the
    // ledger is absent, roads dark / no suit) ⇒ ×1 ⇒ byte-identical. Codepoint-stable max.
    if (embassy) {
      const m = embassy.suitFor([...ctx.hostileTargets, ...ctx.besieging].map(String).sort());
      if (m !== 1) peaceScore = clamp01(peaceScore * m);
    }
    scored.sue_for_peace = peaceScore;
  }

  // M9a NON-WAR LEVERS — enumerate the archetype's own moves (merchant reroute/
  // embargo/credit; church missionize/legitimacy; warlord prestige/opportunity).
  // ONLY present when the objective carries a `levers` bag (a per-archetype set), so
  // a DEFAULT-scored settlement never reaches here ⇒ byte-identical. Scores are pure
  // functions of the same signals; the formulas own the arithmetic (VI.3 pattern).
  if (O.levers) {
    const posMargin = bestMargin > -Infinity ? Math.max(0, bestMargin) : 0;
    const hostile = ctx.hostileTargets.length > 0 ? 1 : 0;
    const peace = 1 - hostile;
    const besieged = ctx.homeBesieged ? 1 : 0;
    for (const name of Object.keys(O.levers)) {
      const L = /** @type {Record<string, number>} */ (O.levers[name]);
      let v;
      switch (name) {
        case 'reroute': v = L.base + exhaustion * L.exhaustionGain + besieged * L.besiegedBonus; break;
        case 'embargo': v = L.base + hostile * L.hostileGain - exhaustion * L.exhaustionDamp; break;
        case 'credit': v = L.base + peace * L.peaceGain - aggr * L.aggrDamp; break;
        case 'missionize': v = L.base + peace * L.peaceGain - aggr * L.aggrDamp; break;
        case 'legitimacy': v = L.base + besieged * L.besiegedBonus + exhaustion * L.exhaustionGain; break;
        case 'prestige': v = L.base + aggr * L.aggrGain + hostile * L.hostileGain; break;
        case 'opportunity': v = L.base + posMargin * L.marginGain + aggr * L.aggrGain; break;
        default: continue;
      }
      scored[name] = clamp01(v);
    }
  }

  // W-DOCTRINE-4 §3: the RULING-BLOC decision load — a bounded, clamped multiplier
  // toward the governing coalition's END (the warReasonFactor idiom, one arena in). ×1
  // exactly for every move when politics is dormant OR no ruling bloc commands the court
  // ⇒ the expression above is untouched ⇒ byte-identity holds.
  if (coalitionLoad) {
    for (const move of Object.keys(scored)) {
      const mult = coalitionLoad.factorFor(move);
      if (mult !== 1) scored[move] = clamp01(scored[move] * mult);
    }
  }

  // W-MOMENTUM §3.1: the COMMITMENT LOAD (the coalitionLoad idiom, one target in). A move
  // consistent with a committed war/campaign course (deploy toward the best-margin target)
  // is weighted UP; a course-REVERSING move (sue_for_peace) DOWN and, past the cliff, DIVIDED
  // by the LIMIT CLAUSE (up to ÷CLIFF_MULT — the order-of-magnitude wall, finite). NULL when
  // momentum is dormant OR the actor holds no committed course ⇒ every mult is 1 ⇒ the
  // expression above is untouched ⇒ a below-cliff/uncommitted actor produces today's bytes.
  if (commitmentLoad) {
    for (const move of Object.keys(scored)) {
      if (termination && move === 'sue_for_peace') continue;
      const relation = moveCourseRelation(move);
      if (relation === 'neutral') continue;
      // A consistent move binds to the best-margin target it is pursuing; a reversal reads
      // the strongest committed course (targetId null ⇒ the deepest commitment resists).
      const targetId = relation === 'consistent' ? bestTargetId : null;
      const mult = commitmentLoad.factorFor(move, targetId);
      if (mult !== 1) scored[move] = clamp01(scored[move] * mult);
    }
  }

  // WR-2: dispositions colour ACTION BARS only after the ordinary move space and
  // best target have already been resolved. This placement is structural: no
  // channel can add a target, turn a friend hostile, or bypass a legality gate.
  // A factor below one lowers the bar (score rises); above one raises it. The
  // insular channel deliberately points the other way for outward acts.
  if (dispositionThresholds) {
    const D = dispositionThresholds;
    const outwardInsular = 2 - D.insular;
    /** @type {Record<string, string[]>} */
    const dispositionReasons = {};
    const addReason = (move, key, factor) => {
      const receipt = D.receipts?.[key];
      if (factor === 1 || !receipt) return;
      if (!dispositionReasons[move]) dispositionReasons[move] = [];
      if (!dispositionReasons[move].includes(receipt)) dispositionReasons[move].push(receipt);
    };
    for (const move of Object.keys(scored)) {
      let bar = 1;
      if (D.martialInAggressiveness === true && MARTIAL_HISTORY_MOVES.includes(move)
        && !(move === 'sue_for_peace' && termination)) {
        // Martial history already entered this move through computeAggressiveness.
        // Record that single consumption here; never multiply the bar by it again.
        addReason(move, 'martial', D.martial);
      }
      if (move === 'deploy' || move === 'prestige' || move === 'opportunity') {
        bar *= D.deityWar * outwardInsular;
        addReason(move, 'deityWar', D.deityWar);
        addReason(move, 'insular', D.insular);
      } else if (move === 'sue_for_peace') {
        // A live WR-1 termination read owns ALL four disposition inputs and its
        // receipt. Reapplying any of them here would double diplomatic pressure,
        // contradict insularity, and silently consume martial history twice.
        if (!termination) {
          // An inward-looking court is read consistently on both peace paths:
          // withdrawal is an inward act, so insularity lowers (not raises) its
          // bar just as it does in warTermination's WR-1-owned exit read.
          bar *= D.diplomatic * D.insular * (2 - D.deityWar);
          addReason(move, 'diplomatic', D.diplomatic);
          addReason(move, 'insular', D.insular);
          addReason(move, 'deityWar', D.deityWar);
        }
      } else if (move === 'reroute' || move === 'embargo' || move === 'credit') {
        bar *= D.mercantile * outwardInsular;
        addReason(move, 'mercantile', D.mercantile);
        addReason(move, 'insular', D.insular);
      } else if (move === 'missionize') {
        bar *= D.diplomatic * outwardInsular;
        addReason(move, 'diplomatic', D.diplomatic);
        addReason(move, 'insular', D.insular);
      } else if (move === 'defend' || move === 'hold' || move === 'legitimacy') {
        bar *= D.insular;
        addReason(move, 'insular', D.insular);
      }
      if (bar !== 1) scored[move] = clamp01(scored[move] / Math.max(0.25, bar));
    }
    for (const [move, reasons] of Object.entries(dispositionReasons)) {
      if (reasons.length) dispositionReasons[move] = [...new Set(reasons)];
    }
    // Attach below after canonical move sorting. The sidecar is deliberately local
    // to this scorer; it never enters target enumeration.
    return Object.keys(scored)
      .sort(codepoint)
      .map((move) => ({
        move,
        score: scored[move],
        ...(move === 'deploy' && bestTargetId != null ? { bestTargetId: String(bestTargetId) } : {}),
        ...(dispositionReasons[move]?.length
          ? { dispositionReasons: dispositionReasons[move] }
          : {}),
      }));
  }

  return Object.keys(scored)
    .sort(codepoint)
    .map((move) => move === 'deploy' && bestTargetId != null
      ? { move, score: scored[move], bestTargetId: String(bestTargetId) }
      : { move, score: scored[move] });
}

/**
 * W-PEACE-1 §14.4 (legibility of motive): the top typed reasons of a causal
 * ledger entry, rendered as receipt lines for the decision that consumed them.
 * Empty when the entry is null (gate dark / no case) ⇒ dormant receipts are
 * byte-identical.
 * @param {import('./warReasons.js').ReasonPairEntry | null} entry @param {string} label
 * @returns {string[]}
 */
function causalReasonLines(entry, label) {
  if (!entry) return [];
  return topReasons(entry, 3).map((r) => `${label}: ${r.type} (${r.score.toFixed(2)}) — ${r.receipt}`);
}

/**
 * Emit the chosen move as a probability-1 candidate. `deploy` carries an
 * army_deployed condition; `sue_for_peace` carries a relationship_label_change
 * proposal (pulling the existing de-escalation levers); `defend` / `hold` emit an
 * INERT marker (no condition, no patch) that still wins the `strategy:<S>`
 * exclusive group and so suppresses the reactive escalation for S — the chooser
 * decided NOT to escalate this tick, with no stray world-state cost.
 * @param {{ move: string, bestTargetId?:string|null, sId: any, item: any, ctx: any, tick: number, exhaustion: number, snapshot: any, strengthFor: (id: any) => number, rng?: RngLike, chaosPull?: number, rust?: number, worldState?: import('./beliefMap.js').BeliefWorldState, beliefActive?: boolean, trueStrengthFor?: ((id: string) => number)|null, termination?: { suePressure01:number, dissolvedCauseTypes?:string[], receipt?:{reason?:string}, targetId?:string }|null, warCasusFor?: ReturnType<typeof makeCurrentWarCasusRead>|null }} args
 */
function emitMove({ move, bestTargetId = null, sId, item, ctx, tick, exhaustion, snapshot, strengthFor, rng = null, chaosPull = 0, rust = 0, worldState = null, beliefActive = false, trueStrengthFor = null, termination = null, warCasusFor = null }) {
  const name = item?.name || item?.settlement?.name || String(sId);
  const warRulingsLit = worldState?.simulationRules?.warLayerEnabled === true
    && worldState?.simulationRules?.warTerminationEnabled === true;

  if (move === 'sue_for_peace') {
    // Wind down the war we are ACTUALLY fighting: prefer the settlement we besiege that
    // has a de-escalable edge (so the label change AND the physical siege withdrawal —
    // war-3, executed on apply — address the SAME conflict), else the codepoint-first
    // hostile edge. (Fixes the old comment/code mismatch: "strongest hostile edge" was
    // really codepoint-first.)
    const terminationTarget = termination?.targetId != null && hostileEdgeBetween(snapshot, sId, termination.targetId)
      ? String(termination.targetId) : null;
    const besiegingTarget = ctx.besieging.find((/** @type {string} */ t) => hostileEdgeBetween(snapshot, sId, t));
    const target = terminationTarget || besiegingTarget || ctx.hostileTargets[0] || ctx.besieging[0];
    const edge = target ? hostileEdgeBetween(snapshot, sId, target) : null;
    if (!edge) return null; // no edge to de-escalate — fall through to nothing
    // Read the edge's ACTUAL current label (the relationshipStates overlay wins over
    // the raw edge) and step it ONE rung down the PEACE_STEP ladder. An edge that is
    // not on the hostile axis has nothing to wind down.
    const relState = ensureRelationshipState(
      normalizeRelationshipEdge(edge),
      snapshot?.worldState?.relationshipStates?.[relationshipKeyFromEdge(edge)],
    );
    const fromType = relState.relationshipType;
    const toType = PEACE_STEP[/** @type {keyof typeof PEACE_STEP} */ (fromType)];
    if (!toType) return null;
    const key = relationshipKeyFromEdge(edge);
    // W-C1 item 1b legibility: name the war-bankruptcy reading + any chaos/rust misread of it.
    const perceived = termination ? clamp01(Number(termination.suePressure01) || 0) : perceivedPeaceExhaustion({ exhaustion, rng, tick, sId, chaosPull, rust });
    const peaceEntry = peaceCausalActive(worldState)
      ? peaceReasonsFor(worldState, String(sId), String(target), termination?.dissolvedCauseTypes)
      : null;
    const reasons = termination ? [
      ...(termination.receipt?.reason ? [termination.receipt.reason] : []),
      ...(termination.receipt?.booksPublicReason ? [termination.receipt.booksPublicReason] : []),
      ...(Array.isArray(termination.receipt?.dispositionReasons)
        ? termination.receipt.dispositionReasons
        : []),
      ...terminationPeaceReasonLines(peaceEntry),
    ] : [
      `Economic exhaustion ${exhaustion.toFixed(2)} drives ${name} to the table.`,
      'Sue-for-peace pulls the existing de-escalation levers (hostile_truce / wind-down).',
      ...causalReasonLines(peaceEntry, 'Casus pacis'),
    ];
    if (!termination && perceived !== exhaustion) {
      const driver = chaosPull > 0 && rust > 0 ? "its patron's chaos and a rusty army"
        : chaosPull > 0 ? "its patron's chaos"
        : 'a rusty army';
      reasons.push(
        `A misread of war-bankruptcy — ${driver} distorted the reading (perceived ${perceived.toFixed(2)} vs true ${exhaustion.toFixed(2)}), so the suit came ${perceived > exhaustion ? 'early' : 'late'}.`,
      );
    }
    const warRulingRead = warRulingsLit ? compactWarRulingRead(termination) : null;
    const peaceFront = worldState?.deployments?.[String(sId)];
    const peaceFrontSinceTick = inputTick(peaceFront?.sinceTick);
    const bilateralOffer = warRulingsLit
      && !!termination
      && String(peaceFront?.targetId || '') === String(target)
      && peaceFrontSinceTick != null;
    return strategyCandidate({
      move,
      sId,
      tick,
      severity: MOVE_SEVERITY,
      headline: `${name} sues for peace`,
      summary: `War-weary and economically drained, ${name} seeks to wind the conflict down.`,
      reasons,
      metadata: {
        ...(warRulingRead ? { warRulingRead } : {}),
      },
      proposal: {
        relationshipKey: key,
        relationshipPatch: { proposedRelationshipType: toType, trajectory: 'transitioning' },
        proposalPayload: {
          kind: 'relationship_label_change',
          relationshipKey: key,
          fromType,
          toType,
          // WR-5 G2: approval is the OFFERER'S yes, not bilateral peace by
          // itself. The apply mouth resolves the named target court's second
          // decision before this existing label/recall/treaty writer may run.
          ...(bilateralOffer ? {
            peaceOffer: true,
            offererId: String(sId),
            targetId: String(target),
            peaceFrontOwnerId: String(sId),
            peaceFrontSinceTick,
          } : {}),
          reason: `${name} sued for peace; the sponsored hostility winds down.`,
        },
      },
    });
  }

  if (move === 'deploy') {
    // The deploy DECISION; the war layer owns the actual front mint when its
    // own gate passes. We emit a guaranteed army_deployed-flavored marker so the
    // posture is visible AND it wins the exclusive group over the reactive raid.
    // JOIN 1 — THE RESOLVED MARCH: the target below is no longer prose only. It rides
    // out as `metadata.deployTargetId` (the machine-readable twin of the recall
    // override's `metadata.recallTargetId`), the apply pass deposits it as an ORDER
    // (warIntent.stampWarIntent), and the ONE opener — warDeployment step 4 — reads
    // that order next tick. This module still mints no front and seeds no deployment.
    const target = bestTargetId != null ? String(bestTargetId) : null;
    if (!target) return null;
    // WAVE A misjudgment-as-cause: the chooser committed to an offensive on a
    // BELIEF about the target. If that belief diverges from ground truth beyond
    // the band (a stale strength read, or a hostility the world has left behind),
    // stamp the misjudgment — the fog of war made a legible, DM-visible cause.
    // Null (byte-neutral) when the belief is sound OR beliefs are dormant.
    const misjudgment = beliefActive && target
      ? misjudgmentFor(String(sId), String(target), worldState, snapshot, trueStrengthFor)
      : null;
    const targetName = target ? (snapshot?.byId?.get?.(String(target))?.name || target) : 'its rival';
    return strategyCandidate({
      move,
      sId,
      tick,
      severity: MOVE_SEVERITY,
      headline: `${name} resolves to march`,
      summary: `${name} commits to an offensive posture against ${targetName}.`,
      reasons: [
        `${name}'s strategy chooser selected an offensive deployment.`,
        ...(misjudgment ? [misjudgmentReason(misjudgment, name, targetName)] : []),
        // W-PEACE-1 §14.4: name the typed war reasons this march consumed (empty when dark).
        ...causalReasonLines(
          peaceCausalActive(worldState) && target && warCasusFor ? warCasusFor(String(sId), String(target)).entry : null,
          'Casus belli',
        ),
      ],
      // APPEND-ONLY key order: `deployTargetId` sits AFTER `misjudgment`, so an
      // existing metadata bag's serialized key order is untouched. Target identity
      // is mandatory for deploy: a malformed row without one returned null above.
      metadata: {
        ...(misjudgment ? { misjudgment } : {}),
        deployTargetId: target,
      },
      condition: {
        archetype: 'army_deployed',
        severity: clamp01(MOVE_SEVERITY * 0.6),
        triggeredAt: { tick, sourceEventType: 'SETTLEMENT_STRATEGY', sourceEventTargetId: String(sId) },
        causes: [
          { source: String(sId), effect: 'army_deployed', reason: `${name} mustered its army for an offensive.` },
          ...(misjudgment ? [{ source: String(sId), effect: 'misjudged_war', reason: `${name} acted on a mistaken belief about ${targetName}.` }] : []),
        ],
      },
    });
  }

  // M9a NON-WAR LEVER (merchant/church/warlord) — war-5: no longer inert. It carries a
  // BOUNDED, AUTO relationship nudge (leverNudgeFor) applied through
  // applyRelationshipPatch, so the settlement's economic / religious / opportunistic
  // move moves real diplomatic state instead of only the feed. It still wins the
  // strategy:<S> exclusive group. When no valid edge exists, the nudge is null and the
  // lever falls back to the inert marker (byte-safe).
  if (/** @type {Record<string, unknown>} */ (LEVER_COPY)[move]) {
    const copy = /** @type {{ headline: (n: string, t: string) => string, summary: (n: string, t: string) => string }} */ (
      /** @type {Record<string, unknown>} */ (LEVER_COPY)[move]);
    const nudge = leverNudgeFor(move, snapshot, sId, ctx, strengthFor);
    // Name the edge the lever actually addresses (its nudge target); else the hostile
    // rival for the house-voice copy.
    const target = (nudge && nudge.targetId) || ctx.hostileTargets[0];
    const targetName = target ? (snapshot?.byId?.get?.(String(target))?.name || String(target)) : 'its rivals';
    return strategyCandidate({
      move,
      sId,
      tick,
      severity: MOVE_SEVERITY,
      headline: copy.headline(name, targetName),
      summary: copy.summary(name, targetName),
      reasons: [
        `${name}'s strategy chooser reached for the ${move} lever rather than a war move.`,
        ...(nudge ? [`The ${move} lever presses ${targetName} — a bounded ${Object.keys(nudge.relationshipPatch).map(humanizeToken).join('/')} nudge.`] : []),
      ],
      relationshipNudge: nudge
        ? { relationshipKey: nudge.relationshipKey, relationshipPatch: nudge.relationshipPatch, incidentType: nudge.incidentType }
        : null,
    });
  }

  // defend / hold — a benign, guaranteed posture marker. It carries the
  // strategy:<S> exclusive tag so the reactive escalation for S is suppressed (the
  // settlement chose NOT to escalate this tick), but applies a low-severity
  // army_deployed=0 marker condition (no economic/defense hit) so it is inert.
  return strategyCandidate({
    move,
    sId,
    tick,
    severity: MOVE_SEVERITY,
    headline: move === 'defend' ? `${name} stands to its walls` : `${name} holds its posture`,
    summary: move === 'defend'
      ? `${name} marshals to defend rather than escalate this tick.`
      : `${name} holds the status quo rather than open a new front.`,
    reasons: [`${name}'s strategy chooser selected ${move}.`],
  });
}

/**
 * Evaluate the settlement strategy layer for one tick.
 *
 * @param {any} snapshot       the SINGLE pre-tick world snapshot.
 * @param {any} pressureIdx    the derived pressure index (settlementStrength input).
 * @param {Object} context
 * @param {number} [context.tick]
 * @param {{ settlementStrategyEnabled?: boolean, dispositionChannelsEnabled?: boolean }} [context.simulationRules]
 * @param {{ random: () => number, fork: (label:string) => any }} [context.rng]
 * @param {Map<string, { targetId:string, suePressure01:number, dissolvedCauseTypes?:string[], receipt?:{reason?:string} }>|null} [context.warTerminationByAttacker]
 * @param {Map<string, { partyId:string, targetId:string, decision:'stay'|'exit' }>|null} [context.coalitionDecisionByParty]
 * @returns {any[]} at most ONE probability-1 candidate per settlement.
 */
export function evaluateSettlementStrategyRules(snapshot, pressureIdx, context = {}) {
  const rules = context.simulationRules || {};
  // WR-6's standing allied-front ruling has its own exact four-flag activation
  // law. It may reuse this chooser's existing hold/peace writers without making
  // `settlementStrategyEnabled` a hidden fifth gate. When the generic chooser is
  // dark, only explicitly supplied joined-party decisions enter the pass.
  const coalitionOnly = rules.settlementStrategyEnabled !== true
    && rules.warLayerEnabled === true
    && rules.warTerminationEnabled === true
    && rules.peaceEngineEnabled === true
    && rules.coalitionLedgerEnabled === true
    && context.coalitionDecisionByParty instanceof Map
    && context.coalitionDecisionByParty.size > 0;
  // ── Gate: byte-identical no-op (no candidate, no rng draw) when OFF. ──────────
  if (!rules.settlementStrategyEnabled && !coalitionOnly) return [];

  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const graph = snapshot?.regionalGraph || {};
  const worldState = snapshot?.worldState || {}; const warCasusFor = makeCurrentWarCasusRead({ snapshot, worldState, graph, rules });
  const deployments = worldState.deployments || {};
  const rng = context.rng;
  const terminationByAttacker = context.warTerminationByAttacker instanceof Map ? context.warTerminationByAttacker : null;
  const coalitionDecisionByParty = context.coalitionDecisionByParty instanceof Map
    ? context.coalitionDecisionByParty
    : null;
  const strengthFor = buildStrengthLookup(snapshot, pressureIdx);
  // WAVE A: are beliefs live for this campaign? The gate is ORTHOGONAL to
  // settlementStrategyEnabled (spatialCanonVersion + a non-omniscient infoMode).
  // FALSE ⇒ every cross-settlement read below falls back to ground truth verbatim
  // ⇒ byte-identical to the pre-Wave-A chooser.
  const beliefActive = beliefsActive(worldState);

  const out = [];

  // ONE pass per settlement, codepoint-sorted (NOT per edge — avoids N-edge
  // double-fire + per-settlement budget starvation).
  const settlementIds = (snapshot?.settlements || [])
    .map((/** @type {any} */ item) => String(item.id))
    .sort(codepoint);

  for (const sId of settlementIds) {
    const item = snapshot?.byId?.get?.(sId);
    if (!item) continue;
    const ctx = contextFor(snapshot, graph, sId, beliefActive, tick);
    const termination = terminationByAttacker?.get(sId) || null;
    const coalitionDecision = coalitionDecisionByParty?.get(sId) || null;
    if (coalitionOnly && !coalitionDecision) continue;
    // The observer's belief-sourced strength lookup (self ⇒ truth). Dormant ⇒ the
    // raw ground-truth lookup unchanged (byte-exact).
    const strengthForObs = beliefActive ? makeBeliefStrengthFor(strengthFor, sId, worldState) : strengthFor;
    const deployment = deployments[sId];
    const hasArmyAbroad = !!deployment?.targetId;

    // ── HARD-OVERRIDE: return-home. If S has its army committed ABROAD while its
    // home (or a vassal obligation) is compromised — besieged/occupied — it ORDERS
    // the army home, deterministically (probability 1, BYPASSING the softmax). An
    // emergency recall cannot be out-competed by a high deploy weight. The
    // strategy:<S> exclusive tag SUPPRESSES the reactive escalation for S (no
    // double-fire). NOTE: this candidate is the recall DECISION — it carries
    // metadata.recallTargetId for the war layer, but the deployment itself is only
    // physically withdrawn by warDeployment's withdrawal path; until that consumer
    // is wired, the order (correctly) re-fires each tick the predicament persists,
    // and its only world effect is suppressing S's reactive escalation. ───────────
    if (hasArmyAbroad && (ctx.homeBesieged || ctx.vassalBesieged)) {
      // DEDUP (war-4): the recall order is now EXECUTED by the war layer (it stamps
      // `deployment.recalled`, marches the army home next tick). If the order is already
      // pending on this army, the recall is in flight — do NOT re-fire the headline every
      // tick (the feed-spam the finding names). No `continue` past this leaves S's
      // exclusive slot free; the committed army blocks any new front regardless.
      if (deployment.recalled) continue;
      const name = item?.name || item?.settlement?.name || sId;
      out.push(strategyCandidate({
        move: 'return_home',
        sId,
        tick,
        severity: OVERRIDE_SEVERITY,
        metadata: { recallTargetId: String(deployment.targetId) },
        headline: `${name} recalls its army`,
        summary: ctx.homeBesieged
          ? `${name} is itself besieged. Its army abroad is recalled to defend the home walls.`
          : `A vassal of ${name} is under siege. ${name} recalls its army to relieve it.`,
        reasons: [
          ctx.homeBesieged
            ? `${name} is besieged at home while its army is committed against ${deployment.targetId}.`
            : `${name} has an army abroad while a vassal is besieged (an emergency recall).`,
          'Hard override: deterministic, bypasses the softmax sample (probability 1).',
        ],
      }));
      continue; // exactly one candidate for S; skip the sample.
    }

    // ── Else: enumerate → score → softmax → sample ONE move. ─────────────────────
    const aggressiveness = computeAggressiveness(item, worldState);
    // When WR-1 already owns the peace read, remove only WR-2's martial-history
    // contribution from the strategy scorer's sue arm. Government, personality,
    // and the older deity-temperament term remain part of the court's character.
    const peaceAggressiveness = termination && rules.dispositionChannelsEnabled === true
      ? computeAggressiveness(item, worldState, { historyMultiplier: 1 })
      : aggressiveness;
    const exhaustion = economicExhaustion(item);
    // W-C1 item 1b: the fidelity pulls on the peace-threshold reading (0 for a lawful/
    // seasoned/deity-free settlement ⇒ enumerate/emit read the TRUE exhaustion, byte-identical).
    const settlement = item?.settlement;
    const chaosPull = chaosPullOf(settlement);
    const rust = rustOf(settlement);
    // M9a: the objective SET the governing seat scores over. DORMANT (beliefs off) OR
    // a seat archetype with no override ⇒ DEFAULT ⇒ byte-identical Wave-A scoring;
    // a merchant/church/warlord seat re-tunes the balance + adds its non-war levers.
    const objective = beliefActive ? objectiveForArchetype(governingCoalition(item).governing) : DEFAULT_SCORING_OBJECTIVE;
    // W-PEACE-1 §H: the causal reason ledgers load the deploy / sue_for_peace
    // weights. NULL when the peace-engine gate is dark (peaceCausalActive reads
    // the SAME worldState the ledgers live on) ⇒ the scorer is byte-identical.
    const causal = peaceCausalActive(worldState)
      ? {
        warFor: (/** @type {string} */ targetId) => warFactorForCasusRead(worldState, sId, targetId, warCasusFor(sId, targetId)),
        peaceFor: (/** @type {string} */ foeId) => peaceReasonFactor(
          worldState,
          sId,
          foeId,
          termination && String(termination.targetId) === String(foeId) ? termination.dissolvedCauseTypes : null,
        ),
      }
      : null;
    // W-DOCTRINE-4 §3: the ruling-bloc decision load (null ⇒ dormant ⇒ byte-identical).
    const coalitionLoad = settlementPoliticsActive(worldState)
      ? { factorFor: (/** @type {string} */ move) => blocDecisionFactor(worldState, String(sId), item, move) }
      : null;
    // W-MOMENTUM §3.1: the commitment load (self-gating — NULL when momentum is dormant OR
    // this actor holds no committed war/campaign course ⇒ the scorer is byte-identical).
    // Its cliff folds the court's temperament (member TRAIT_MOMENTUM, importance-weighted).
    const commitmentLoad = makeCommitmentLoad(worldState, item, String(sId), tick);
    // W-UPSWING §0.5: the extraction-upswing EV term loads the deploy score. NULL when
    // the upswing gate is dark (upswingArcsActive reads the SAME worldState) ⇒ the
    // deploy score is byte-identical dormant.
    const extractionEV = upswingArcsActive(worldState)
      ? { adjFor: (/** @type {string} */ targetId) => extractionUpswingAdj({ worldState, snapshot, conquerorId: String(sId), targetId }) }
      : null;
    // §11b R-8: a heard peace embassy's suit loads sue_for_peace. NULL when the roads-owned
    // roadsEmbassies ledger is absent (roads dark / no suit) ⇒ the scorer is byte-identical.
    const embassy = getSpatialLedger(worldState, EMBASSY_LEDGER_KEY)
      ? { suitFor: (/** @type {string[]} */ foes) => embassySuitPeaceMult(worldState, String(sId), foes) }
      : null;
    const dispositionThresholds = rules.dispositionChannelsEnabled === true
      ? (() => {
        const entry = worldState.dispositionStats?.[sId];
        const martial = thresholdFactorOf(entry, 'martial');
        const mercantile = thresholdFactorOf(entry, 'mercantile');
        const diplomatic = thresholdFactorOf(entry, 'diplomatic');
        const insular = thresholdFactorOf(entry, 'insular');
        const deityWar = deityPressureOf(item, entry);
        return {
          martial: martial.factor,
          mercantile: mercantile.factor,
          diplomatic: diplomatic.factor,
          insular: insular.factor,
          deityWar: deityWar.thresholdFactor,
          martialInAggressiveness: true,
          receipts: {
            martial: martial.receipt,
            mercantile: mercantile.receipt,
            diplomatic: diplomatic.receipt,
            insular: insular.receipt,
            deityWar: deityWar.receipt,
          },
        };
      })()
      : null;
    const moves = enumerateMoves({ sId, ctx, aggressiveness, peaceAggressiveness, strengthFor: strengthForObs, exhaustion, rng, tick, chaosPull, rust, objective, causal, coalitionLoad, commitmentLoad, extractionEV, embassy, termination, dispositionThresholds });
    if (!moves.length) continue;

    // WR-5 H — the faction that actually installed this still-current seat gets
    // the war decision it organized around. The demand controls only the legal
    // move set: it cannot invent a hostile edge or bypass an emergency recall.
    // Peace is deterministic when that legal arm exists; a continue charge
    // removes only sue_for_peace and leaves the ordinary chooser to decide how
    // the court continues. A later seat transition retires the demand.
    const inheritedDemand = termination?.targetId
      ? inheritedWarDemandFor(worldState, String(sId), String(termination.targetId), snapshot)
      : null;
    let decisionMoves = moves;
    // No `= null` initializer: every arm below assigns before the read at
    // `chosen.move`, so the initializer was dead (eslint no-useless-assignment,
    // a gate-step-11 ERROR that had been dark behind the red step above it).
    let chosen;
    if (coalitionDecision
      && String(coalitionDecision.partyId || '') === sId
      && String(coalitionDecision.targetId || '') === String(termination?.targetId || '')) {
      // WR-6 G/G2: a joined ally's standing choice is the decision, not one
      // more softmax input.  Staying is the existing mutation-free hold arm;
      // exiting is the existing bilateral sue-for-peace proposal and therefore
      // still needs the opponent's separate assent before any edge closes.
      chosen = moves.find((move) => move.move === (
        coalitionDecision.decision === 'exit' ? 'sue_for_peace' : 'hold'
      )) || null;
      if (!chosen) continue;
    } else if (inheritedDemand?.desiredAction === 'peace') {
      chosen = moves.find((move) => move.move === 'sue_for_peace') || null;
      if (!chosen) continue;
    } else {
      if (inheritedDemand?.desiredAction === 'continue') {
        decisionMoves = moves.filter((move) => move.move !== 'sue_for_peace');
        if (!decisionMoves.length) continue;
      }
      const weights = softmaxWeights(decisionMoves.map((m) => m.score), STRATEGY_K);
      // Sample ONCE on a stable per-settlement fork. A missing rng/fork (test stubs)
      // falls back to the canonical top (index 0) — deterministic either way.
      let idx = 0;
      if (rng && typeof rng.fork === 'function') {
        idx = stableSampleByWeight(weights, rng.fork(`strategy:${stablePart(sId)}:${tick}`));
      } else if (weights.length) {
        // No rng: pick the argmax (canonical), tie-broken by the codepoint move key.
        let best = -Infinity;
        for (let i = 0; i < weights.length; i += 1) {
          if (weights[i] > best) { best = weights[i]; idx = i; }
        }
      }
      if (idx < 0 || idx >= decisionMoves.length) idx = 0;
      chosen = decisionMoves[idx];
    }

    const candidate = emitMove({
      move: chosen.move, bestTargetId: chosen.bestTargetId, sId, item, ctx, tick, exhaustion, snapshot,
      strengthFor: strengthForObs, rng, chaosPull, rust,
      worldState, beliefActive, trueStrengthFor: strengthFor, termination, warCasusFor,
    });
    if (candidate) {
      const dispositionReasons = Array.isArray(chosen.dispositionReasons)
        ? chosen.dispositionReasons.filter(Boolean)
        : [];
      const withDemand = inheritedDemand
        ? { ...candidate, metadata: { ...(candidate.metadata || {}), inheritedWarDemand: inheritedDemand } }
        : candidate;
      const withCoalitionDecision = coalitionDecision
        ? {
            ...withDemand,
            metadata: {
              ...(withDemand.metadata || {}),
              coalitionStandingDecision: {
                partyId: String(coalitionDecision.partyId || ''),
                callerId: String(coalitionDecision.callerId || ''),
                targetId: String(coalitionDecision.targetId || ''),
                decision: coalitionDecision.decision,
              },
            },
            reasons: [
              ...(withDemand.reasons || []),
              coalitionDecision.decision === 'exit'
                ? 'The allied court chose to seek a bilateral exit from this front.'
                : 'The allied court chose to keep this front standing.',
            ],
          }
        : withDemand;
      out.push(dispositionReasons.length
        ? { ...withCoalitionDecision, reasons: [...new Set([...(withCoalitionDecision.reasons || []), ...dispositionReasons])] }
        : withCoalitionDecision);
    }
  }

  return out;
}

export const STRATEGY_TUNING = Object.freeze({ STRATEGY_K, MOVE_SEVERITY, OVERRIDE_SEVERITY });
// `hash01` is imported for parity with the contest fork recipe; re-exported so
// tests can assert the fork-key discipline without reaching into contestMath.
export { hash01 };
// M9a: the pure move-enumeration core, exported so the scorer tests can assert the
// objective-parameterization (default byte-identity + per-archetype ranking + the
// non-war levers) without driving the softmax/candidate machinery.
export { enumerateMoves };
