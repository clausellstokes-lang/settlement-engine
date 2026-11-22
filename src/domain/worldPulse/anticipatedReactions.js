/**
 * anticipatedReactions.js — W-SEAT D5 (SEAT-4): before a court takes a major decision, it
 * asks how the powers that matter will answer — and it asks its OWN picture of them, not
 * the world's.
 *
 * The owner's §741 directive: "each settlement's (or competing power's) risk assessment for
 * any major decision considers how each relevant foreign power — or its counterpart seat in
 * that settlement — will react." The payoff is a decision that gets HELD BACK, with a
 * receipt naming whose answer was feared.
 *
 * ── THE VOCABULARY IS THE ONE THE BELIEF RECORD CAN ACTUALLY COMPUTE (A1.1.3) ─────
 * The volume proposed `{approves, indifferent, protests, sanctions, casus_grade}`. The
 * panel struck it: the belief record holds `readiness`, `strengthBand`, `allianceLabel`,
 * `faithLabel`, `confidence01` and `lastUpdateTick` — there is no believed disposition, no
 * believed treaty stance, no believed war appetite. A five-band vocabulary would have been
 * four bands of fiction over one band of data. So the vocabulary SHRINKS to what those
 * inputs support, and the casus flag is derived from TRUE treaty structure only.
 *
 * ── ⚠ A CONFLICT BETWEEN THE AMENDMENT AND THE ESTATE'S OWN LAW, RESOLVED AND RECORDED ──
 * A1.1.3 rules "entry-absent ⇒ `indifferent` at low confidence". The estate's own belief
 * law says the opposite for this exact axis: `readBeliefRelationship` returns GROUND TRUTH
 * on `source:'unknown'`, and its docstring gives the reason — "the declared relationship is
 * public, so absence is NON-paranoid: the label the observer knows". Both cannot hold.
 *
 * THE RULING (chair-vetoable): the ESTATE wins on the LABEL and the AMENDMENT wins on the
 * CONFIDENCE. A court that has heard nothing recently about a neighbour still knows whether
 * it is sworn to it — that is a declared, public fact and pretending otherwise would
 * fabricate ignorance about something no court could actually forget. What it does NOT know
 * is that neighbour's STATE, so readiness falls to the max-uncertainty neutral and the
 * confidence is floored low. For the neutral labels that dominate a real map the two rules
 * then AGREE — an unknown neighbour reads `indifferent` at low confidence, exactly as
 * A1.1.3 wants — and they diverge only where the amendment would have been wrong.
 *
 * ── K3/K4 (law §2.5) ──────────────────────────────────────────────────────────────
 * Every reaction here is ONE COURT'S picture. Two courts are two calls; nothing merges, and
 * no reaction is ever computed from a third party's belief. The dormant/omniscient fallback
 * is `belief()`'s own — ground truth verbatim, forking no rng — so a world without the
 * spatial marker reads exactly as it always did.
 *
 * PURE: no rng, no wall clock, no writes, no mutation of any input. Codepoint-ordered.
 */

import { clamp01 } from '../../kernel/math.js';
import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { belief, BELIEF_TUNING } from './beliefMap.js';
import { treatyOrientationOf } from './treatyOrientation.js';
import { SUBORDINATING_TERM_TYPES } from './hegemony.js';
import { foreignSeatOf } from '../rulingPowerSeat.js';

/**
 * THE CLOSED REACTION VOCABULARY, ordered from friendliest to sharpest so a consumer can
 * compare two reactions without a second table. Four members, and every one of them is
 * computable from `allianceLabel` + `readiness` + `confidence01`.
 * @type {ReadonlyArray<string>}
 */
export const REACTION_BANDS = Object.freeze(['supportive', 'indifferent', 'wary', 'opposed']);

export const REACTION_TUNING = Object.freeze({
  /**
   * Below this confidence a court will not ACT on a forecast — it may hold the picture, but
   * it does not let it change a decision. The lord who never hears of the siege never
   * marches: this is `BELIEF_TUNING.SIEGE_AWARENESS_CONFIDENCE`'s sibling and is
   * deliberately set to the same value, because "fresh enough to act on" is one question
   * and the estate already answered it once.
   */
  ACT_CONFIDENCE: 0.35,
  /**
   * The confidence a court has in a picture it holds NO record for. Floored at the belief
   * ledger's own prune threshold — the point below which the estate says an observer has
   * effectively forgotten — because a forecast built on nothing must not outrank one built
   * on a stale but real telling.
   */
  UNKNOWN_CONFIDENCE: BELIEF_TUNING.MIN_CONFIDENCE,
  /** Believed war readiness at or above which a wary power reads as outright opposed. */
  MOBILIZED_AT: 0.5,
});

/**
 * Relationship labels that read as friendly, hostile, or neither. Mirrors the war layer's
 * own sets rather than sharing them: those are module-private in `convergence.js`, and a
 * cross-module import for two frozen sets would couple the belief layer to the war kernel.
 * Pinned in the suite so the two can never drift apart.
 *
 * ⛔ `REACTION_`-PREFIXED ON THE RN-A0 PRECEDENT, AND THE PREFIX IS LOAD-BEARING. These were
 * first written as the bare `FRIENDLY_LABELS` / `HOSTILE_LABELS`, which COLLIDE across
 * modules with DIFFERENT MEMBERSHIP — `FRIENDLY_LABELS` is also bound in `beliefMap.js`
 * (which carries `client`, this set does not) and `HOSTILE_LABELS` in
 * `informationStatecraft.js` and `brokerageServicesRules.js` (neither carries
 * `criminal_network`, this set does). RN-A0 renamed `conquestDoctrineStage.js`'s pair to
 * `COALITION_*` for exactly this reason and left the other declarations their names;
 * `tests/lint/postureNameCollision.walker.test.js` pins that disposition, so a fourth bare
 * declaration REDS rather than drifting. The collision has no runtime symptom — every module
 * is internally consistent — which is precisely why it must be caught by name: the damage
 * lands later, on the reader who carries one site's meaning to another (§711.6's lesson in
 * its identifier form). The prefix names WHOSE census this is.
 *
 * ⚠ THE SUFFIX IS `_REL`, NOT `_LABELS`, BECAUSE THAT NAMES THE ACTUAL SOURCE. The membership
 * is mirrored from `convergence.js`'s `FRIENDLY_REL` / `HOSTILE_REL` — the war layer's
 * relationship sets — and the suite asserts it against those, not against the belief layer's
 * similarly-named-but-different pair. The original `_LABELS` spelling pointed the reader at
 * the wrong ancestor.
 */
const REACTION_FRIENDLY_REL = Object.freeze(['allied', 'trade_partner', 'vassal', 'patron']);
const REACTION_HOSTILE_REL = Object.freeze(['hostile', 'cold_war', 'rival', 'criminal_network']);

/** The one empty array every dark path returns, so "no forecast" is reference-identical
 *  across calls and a consumer's own byte-identity pin survives by construction.
 *  @type {ReadonlyArray<{ powerId: string, band: string, confidence01: number, casus: boolean, basis: string }>} */
const EMPTY = Object.freeze([]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} v @param {number} f @returns {number} */
function num(v, f) { return Number.isFinite(Number(v)) ? Number(v) : f; }

/**
 * ⛔ The positive `=== true` spelling is the engine-gated-key census's only discoverable
 * form; a negative-polarity early return is invisible to it. D5 rides `foreignSeatEnabled`
 * by §820's Q-S3 ruling — the reactions are the seat's own forecast layer and were
 * chartered under its key, so no second flag is minted.
 * @param {unknown} worldState
 */
export function reactionsLit(worldState) {
  return asObject(asObject(worldState).simulationRules).foreignSeatEnabled === true;
}

/**
 * THE BOUNDED RELEVANT SET — who a court actually consults, and why it is bounded at all.
 *
 * A forecast over every power on the map is both a cost problem and a fiction problem: a
 * thorp does not weigh the opinion of an empire it has never heard of. The set is the union
 * of three substrates a court demonstrably knows about — the powers it holds a RELATIONSHIP
 * EDGE with, the powers it is bound to by TREATY, and the power that holds its own SEAT —
 * which is the same three-substrate union `foreignSeatOf` resolves over, read here for a
 * different question.
 *
 * ⚠ NEIGHBOURS-BY-GRAPH ARE THE EDGE SET, NOT A FOURTH SUBSTRATE. The volume lists
 * "neighbors-by-graph" separately; in this tree the regional graph's edges ARE the
 * relationship edges (`neighborsOf` reads exactly that array), so listing them twice would
 * have made the set look wider than it is and invited a reader to hunt for a fourth source
 * that does not exist.
 *
 * @param {unknown} worldState @param {unknown} snapshot @param {string} deciderId
 * @returns {string[]} codepoint-sorted, never containing the decider itself
 */
export function relevantPowersFor(worldState, snapshot, deciderId) {
  const self = String(deciderId || '');
  if (!self) return [];
  /** @type {Set<string>} */
  const set = new Set();

  const graph = asObject(asObject(snapshot).regionalGraph);
  const edges = Array.isArray(graph.edges) ? graph.edges
    : Array.isArray(asObject(snapshot).relationships) ? /** @type {unknown[]} */ (asObject(snapshot).relationships) : [];
  for (const rawEdge of edges) {
    const edge = asObject(rawEdge);
    const from = String(edge.from ?? '');
    const to = String(edge.to ?? '');
    if (from === self && to) set.add(to);
    else if (to === self && from) set.add(from);
  }

  const treaties = asObject(getSpatialLedger(/** @type {Record<string, unknown>} */ (asObject(worldState)), 'treaties'));
  for (const key of Object.keys(treaties).sort(compareCodepoint)) {
    const orientation = treatyOrientationOf(asObject(treaties[key]));
    if (!orientation) continue;
    const obligor = String(orientation.obligorId || '');
    const obligee = String(orientation.obligeeId || '');
    if (obligor === self && obligee) set.add(obligee);
    else if (obligee === self && obligor) set.add(obligor);
  }

  const seat = foreignSeatOf(worldState, snapshot, self);
  if (seat?.patronSettlementId) set.add(String(seat.patronSettlementId));

  set.delete(self);
  return [...set].sort(compareCodepoint);
}

/**
 * Does `powerId` hold a live SUBORDINATING treaty tie over `deciderId`?
 *
 * ⛔ TRUE STRUCTURE, DELIBERATELY NOT BELIEVED (A1.1.3, on the A3 lord-knows-his-vassals
 * precedent). A formal compact is a contract, and contracts read true: a court does not
 * forget that it owes tribute, and a casus grade computed from a STALE picture of a treaty
 * would let a court talk itself out of an obligation it demonstrably has. The belief fog
 * covers the other court's STATE, never the compact between them.
 * @param {unknown} worldState @param {string} deciderId @param {string} powerId
 */
function holdsCompactOver(worldState, deciderId, powerId) {
  const treaties = asObject(getSpatialLedger(/** @type {Record<string, unknown>} */ (asObject(worldState)), 'treaties'));
  for (const key of Object.keys(treaties).sort(compareCodepoint)) {
    const treaty = asObject(treaties[key]);
    const orientation = treatyOrientationOf(treaty);
    if (!orientation || orientation.resolved !== true) continue;
    if (String(orientation.obligorId) !== String(deciderId)) continue;
    if (String(orientation.obligeeId) !== String(powerId)) continue;
    const terms = Array.isArray(treaty.terms) ? treaty.terms : [];
    for (const rawTerm of terms) {
      if (SUBORDINATING_TERM_TYPES.includes(String(asObject(rawTerm).type))) return true;
    }
  }
  return false;
}

/**
 * ONE court's forecast of ONE power's answer. The whole derivation is three inputs wide,
 * because three inputs is what the belief record holds.
 *
 * @param {unknown} worldState @param {unknown} snapshot
 * @param {string} deciderId @param {string} powerId
 * @param {string} trueLabel the DECLARED relationship label (public — see the header's ruling)
 * @returns {{ powerId: string, band: string, confidence01: number, casus: boolean, basis: string }}
 */
export function reactionOf(worldState, snapshot, deciderId, powerId, trueLabel) {
  const resolution = belief(String(deciderId), String(powerId), /** @type {Parameters<typeof belief>[2]} */ (asObject(worldState)));
  const record = asObject(/** @type {Record<string, unknown>} */ (resolution).record);
  const believed = resolution.source === 'belief';

  // THE LABEL: believed when a record carries one, otherwise the declared truth. Absence is
  // NOT ignorance about a public fact — see the header's ruling on A1.1.3.
  const label = believed && typeof record.allianceLabel === 'string' && record.allianceLabel
    ? String(record.allianceLabel)
    : String(trueLabel || '');

  // THE STATE: believed readiness when held; the estate's own max-uncertainty neutral when
  // not (a court assumes an unknown neighbour is average and calm — BELIEF_TUNING's word,
  // not this file's invention).
  const readiness = believed
    ? clamp01(num(record.readiness, BELIEF_TUNING.NEUTRAL_READINESS))
    : BELIEF_TUNING.NEUTRAL_READINESS;

  // THE CONFIDENCE: the record's own when held; the ledger's prune threshold when not, so a
  // forecast built on nothing can never outrank one built on a stale but real telling.
  // A `truth` resolution (dormant, omniscient, or a self-read) is CERTAIN by construction.
  const confidence01 = resolution.source === 'truth'
    ? 1
    : believed
      ? clamp01(num(record.confidence01, REACTION_TUNING.UNKNOWN_CONFIDENCE))
      : REACTION_TUNING.UNKNOWN_CONFIDENCE;

  let band = 'indifferent';
  if (REACTION_FRIENDLY_REL.includes(label)) band = 'supportive';
  else if (REACTION_HOSTILE_REL.includes(label)) {
    // A hostile power that is also believed to be MOBILIZED is not merely wary of the
    // decision — it is looking for one. Readiness is the one STATE axis the record holds
    // that bears on how an answer is likely to be delivered.
    band = readiness >= REACTION_TUNING.MOBILIZED_AT ? 'opposed' : 'wary';
  }

  return {
    powerId: String(powerId),
    band,
    confidence01: Math.round(confidence01 * 10000) / 10000,
    casus: holdsCompactOver(worldState, deciderId, powerId),
    basis: resolution.source,
  };
}

/**
 * THE FORECAST — every relevant power's answer, as THIS court believes it.
 *
 * Returns the EMPTY ARRAY when dark, when the decider is unnamed, or when no power is
 * relevant. Never throws on a garbage ledger.
 *
 * @param {unknown} worldState @param {unknown} snapshot @param {string} deciderId
 * @returns {ReadonlyArray<{ powerId: string, band: string, confidence01: number, casus: boolean, basis: string }>}
 */
export function anticipatedReactionsFor(worldState, snapshot, deciderId) {
  if (!reactionsLit(worldState)) return EMPTY;
  const self = String(deciderId || '');
  if (!self) return EMPTY;
  const powers = relevantPowersFor(worldState, snapshot, self);
  if (!powers.length) return EMPTY;
  const labels = declaredLabelsFor(snapshot, self);
  return powers.map((powerId) => reactionOf(worldState, snapshot, self, powerId, labels.get(powerId) || ''));
}

/** The DECLARED relationship label toward each neighbour, off the regional graph.
 *  @param {unknown} snapshot @param {string} self @returns {Map<string, string>} */
function declaredLabelsFor(snapshot, self) {
  /** @type {Map<string, string>} */
  const out = new Map();
  const graph = asObject(asObject(snapshot).regionalGraph);
  const edges = Array.isArray(graph.edges) ? graph.edges
    : Array.isArray(asObject(snapshot).relationships) ? /** @type {unknown[]} */ (asObject(snapshot).relationships) : [];
  for (const rawEdge of edges) {
    const edge = asObject(rawEdge);
    const from = String(edge.from ?? '');
    const to = String(edge.to ?? '');
    const label = String(edge.relationshipType ?? edge.type ?? '');
    if (from === self && to) out.set(to, label);
    else if (to === self && from) out.set(from, label);
  }
  return out;
}

/**
 * THE ONE FORECAST THAT CHANGES AN OUTCOME — a court holds back a decision it believes will
 * bring an answer it cannot afford.
 *
 * ⛔ THE BAR IS DELIBERATELY NARROW AND ALL THREE CONDITIONS ARE LOAD-BEARING. A forecast
 * moves a decision only when the power is `opposed`, holds a live SUBORDINATING COMPACT
 * over the decider (so its objection has formal standing rather than being mere dislike),
 * and the court is confident enough to act on the picture at all. Drop the casus condition
 * and every hostile neighbour vetoes everything; drop the confidence condition and a court
 * acts on a rumour it has half-forgotten, which is the exact failure the estate's
 * info-starvation tragedy exists to model rather than to cause.
 *
 * @param {ReadonlyArray<{ band: string, casus: boolean, confidence01: number, powerId: string }>} reactions
 * @returns {{ powerId: string, confidence01: number } | null} the sharpest blocking answer
 */
export function heldBackBy(reactions) {
  if (!Array.isArray(reactions) || !reactions.length) return null;
  /** @type {{ powerId: string, confidence01: number } | null} */
  let worst = null;
  for (const r of reactions) {
    if (r.band !== 'opposed' || r.casus !== true) continue;
    if (clamp01(num(r.confidence01, 0)) < REACTION_TUNING.ACT_CONFIDENCE) continue;
    if (!worst || r.confidence01 > worst.confidence01
      || (r.confidence01 === worst.confidence01 && compareCodepoint(r.powerId, worst.powerId) < 0)) {
      worst = { powerId: String(r.powerId), confidence01: clamp01(num(r.confidence01, 0)) };
    }
  }
  return worst;
}

/**
 * THE CONSUMPTION — a second, flag-gated pass at the `candidateEvents` choke, beside the
 * primacy pass and after it.
 *
 * ⛔ WHY HERE AND NOT AT THE CHOOSER, MEASURED. §3-D5 names three consumption points; the
 * first is "chooser terms" in `settlementStrategy.js`, and that file is size-baselined at
 * EXACTLY 812 effective lines with ZERO tolerance in BOTH directions. It cannot take one
 * line. (The same wall already blocks SEAT-2a's §H chooser term, which is RULED and
 * unbuilt for the same reason — one decomposition would unblock both, and that is recorded
 * as a single chartered follow-on rather than two.) The choke is the point where the whole
 * context is present and where the estate already routes decisions, and `isMajorOutcome`
 * is a real invocation gate here in a way `deriveDecisionTier` is NOT at the chooser: a
 * chooser has no outcome yet to classify.
 *
 * ⛔ IT RETURNS THE SAME ARRAY REFERENCE when dark or when nothing is held, so the choke's
 * reference-preserving discipline and its byte-identity pin survive by construction rather
 * than by arithmetic — the `applyForeignPrimacy` contract verbatim.
 *
 * WHAT A HELD DECISION LOOKS LIKE: it does not vanish. It routes to the authority lane as a
 * PROPOSAL carrying a typed record of WHY, so the receipt can say the one sentence §741 is
 * for — the court held back, fearing whose answer.
 *
 * @param {unknown[]} candidates the choke's already-routed list
 * @param {unknown} snapshot carries `worldState` and the settlement index
 * @param {((candidate: unknown) => boolean) | null | undefined} isMajor the choke's OWN
 *   `isMajorOutcome`, INJECTED rather than imported: this leaf must not pull the decision-
 *   tier module (and through it the whole candidate vocabulary) into the belief layer for
 *   one predicate, and injecting it keeps the invocation gate the CALLER's choice — a
 *   consumer that wants a narrower class of major supplies one.
 * @returns {unknown[]} the same reference when nothing is held
 */
export function applyAnticipatedReactions(candidates, snapshot, isMajor) {
  if (!Array.isArray(candidates) || candidates.length === 0) return candidates;
  const shaped = asObject(snapshot);
  const worldState = shaped.worldState;
  if (!reactionsLit(worldState)) return candidates;

  /** @type {Map<string, ReturnType<typeof heldBackBy>>} */
  const cache = new Map();
  /** Forecast once per DECIDER, not once per candidate — the pass sees hundreds. */
  const heldFor = (/** @type {string} */ sid) => {
    if (!cache.has(sid)) cache.set(sid, heldBackBy(anticipatedReactionsFor(worldState, snapshot, sid)));
    return cache.get(sid) || null;
  };

  let heldAny = false;
  /** @type {unknown[]} */
  const out = [];
  for (const candidate of candidates) {
    const row = asObject(candidate);
    // The state-only bypass the choke installs must survive this pass, exactly as it must
    // survive the primacy one: a mechanical condition refresh is reducer bookkeeping, not a
    // political choice, and turning one into a proposal is the failure that comment exists
    // to prevent.
    const eligible = candidate
      && row.recordMode !== 'state_only'
      && typeof isMajor === 'function'
      && isMajor(candidate) === true;
    const sid = eligible ? String(row.targetSaveId ?? asObject(row.metadata).settlementId ?? '') : '';
    const held = sid ? heldFor(sid) : null;
    if (!held) { out.push(candidate); continue; }
    heldAny = true;
    out.push({
      ...row,
      applyMode: 'proposal',
      anticipatedReaction: Object.freeze({
        heldBy: held.powerId,
        confidence01: held.confidence01,
        band: 'opposed',
        casus: true,
      }),
    });
  }
  return heldAny ? out : candidates;
}
