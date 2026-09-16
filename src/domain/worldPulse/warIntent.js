/**
 * domain/worldPulse/warIntent.js — THE RESOLVED MARCH (join 1).
 *
 * The one seam between the SETTLEMENT-TIER STRATEGY CHOOSER (settlementStrategy.js —
 * a deliberative agent that enumerates up to six legal moves, scores them over ~10
 * signals and five bounded multipliers, and softmax-samples one) and the ONE war
 * opener (warDeployment.evaluateWarLayer step 4, which mints the deployment record
 * and the war_front channel).
 *
 * THE DEFECT THIS CLOSES: the chooser's `deploy` move was a HEADLINE. It emitted an
 * `army_deployed` posture marker and a feed line, and nothing else — no deployments
 * entry, no war_front, no warPosture touch — while `evaluateWarLayer` never read
 * `strategyMove` or anything else the chooser produced. A settlement's seat could
 * resolve to march on a named rival and the war layer would, in the same world,
 * besiege whichever hostile neighbour happened to sort first, or none at all.
 *
 * THE SHAPE: the chooser's deploy decision deposits an ORDER — a per-besieger record
 * naming the target its seat resolved on — and the war layer CONSUMES that order when
 * it opens wars. There is still exactly ONE opener: this module mints no front, seeds
 * no deployment, and writes no posture. It only carries the decision across the tick
 * boundary (the chooser runs at rollCandidates, AFTER evaluateWarLayer, so its order
 * is first legible to the opener on the NEXT tick) and tells the opener two things:
 *
 *   1. WHOM  — `intentTargetOrder` pulls the resolved target to the FRONT of the
 *              codepoint-sorted candidate list, so the war that opens is the war the
 *              seat decided on rather than an alphabetical accident.
 *   2. WHETHER — `intentNamesTarget` lets the opener waive the CONQUEST_MARGIN
 *              relationship-confidence PRE-FILTER for that one named target. That
 *              filter is a heuristic stand-in for deliberation ("do not deploy on a
 *              coin-flip strength edge"); when a real deliberation has happened the
 *              stand-in has been superseded. The HARD gates are untouched and still
 *              run for a named target exactly as for any other: the one-army
 *              constraint, the intervention-column constraint, the besieged-at-home
 *              constraint, the occupation constraint, the mobilization POSTURE gate
 *              (no settlement sieges from peace), the HOSTILE_CONFIDENCE floor, and —
 *              the keystone — classifyFeasibility. A HOPELESS WAR STILL DOES NOT OPEN.
 *
 * DETERMINISM CONTRACT (sacred):
 *   - NO rng. Not one fork, not one draw, on either the write or the read side. The
 *     chooser's stream is therefore UNMOVED: this seam consumes a decision the softmax
 *     had already made and stores its target, so no new consumer can steal a draw.
 *   - The ledger is CONDITIONAL and DROP-WHEN-EMPTY (spatialLedgers.warIntents, the
 *     same namespace `interventions` / `commitments` / `campaignPlans` use). Absent
 *     when no producer (the chooser or a routed escalation) has resolved on a march
 *     ⇒ a legacy / layer-off campaign serializes byte-identically.
 *   - Every reader is TOTAL over a missing/garbage ledger (⇒ null ⇒ the opener runs
 *     its pre-existing expression verbatim), and `intentTargetOrder` returns the
 *     INPUT ARRAY REFERENCE unchanged when no order applies — so the dormant loop is
 *     byte-identical, not merely equal.
 *   - The order EXPIRES (WAR_INTENT_TTL_TICKS). A seat that resolved to march three
 *     ticks ago and has since chosen otherwise does not keep an army marching on a
 *     stale grudge; the chooser re-resolves every tick and re-stamps if it still means
 *     it. Writes PRUNE expired rows, so the ledger cannot accumulate.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports. Pure over its
 * arguments (it returns new worldStates; it never mutates one).
 */

import {
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
} from './relationshipEvolution.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { treatyBlocksWar } from './treatyEnforcement.js';
import { conquestMarchOrder } from './conquestDoctrineStage.js';

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The spatialLedgers sub-key the orders live under. EXEMPT (not TRACKED) on the
 * spatialUsage manifest: an order is an instruction in flight for at most
 * WAR_INTENT_TTL_TICKS, not an exercised mover, and the lane's adoption is already
 * legible through the tracked `settlementStrategyEnabled` / `warLayerEnabled` flags
 * while the movement it causes is legible as `deployments` / armyTransit.
 */
export const WAR_INTENT_LEDGER_KEY = 'warIntents';

/**
 * How many ticks a resolved march stays legible to the opener. TWO is the floor that
 * works, not a padding: the chooser runs AFTER the war layer within a tick, so an
 * order stamped at T is first READ at T+1 (age 1). Age 2 buys the order exactly one
 * retry — the tick after a would-be besieger was blocked by a transient (it had just
 * cleared an army, or its posture ramped a tick late) — and no more. Beyond that the
 * seat must decide again.
 */
export const WAR_INTENT_TTL_TICKS = 2;

/** The hostile/adversarial axis a settlement may open a siege on. A vassal/patron
 *  hierarchy edge is never a besiege candidate. Mirrors settlementStrategy's own
 *  HOSTILE_TYPES (the chooser and the opener must agree on what "hostile" means, or
 *  the seat can resolve on a target the opener does not recognise). */
const HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);

/**
 * @typedef {{ targetId: string, tick: number }} WarIntentRecord
 * @typedef {Record<string, WarIntentRecord>} WarIntentLedger
 */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? /** @type {Record<string, unknown>} */ (v)
    : {};
}

/** The raw (unexpired-unchecked) ledger. Total: {} for absent/garbage.
 *  @param {Record<string, unknown>|null|undefined} worldState @returns {Record<string, unknown>} */
function intentLedger(worldState) {
  return asObject(getSpatialLedger(asObject(worldState), WAR_INTENT_LEDGER_KEY));
}

/** Normalize one stored row, or null when it is not a usable order.
 *  @param {unknown} raw @returns {WarIntentRecord|null} */
function normalizeIntent(raw) {
  const rec = asObject(raw);
  const targetId = rec.targetId != null ? String(rec.targetId) : '';
  const tick = Number(rec.tick);
  if (!targetId || !Number.isFinite(tick)) return null;
  return { targetId, tick };
}

/**
 * Is a stored order still live at `tick`? An order from the FUTURE (a re-ordered or
 * rewound clock) is treated as live rather than discarded — the alternative silently
 * drops a decision on a clock artefact.
 * @param {WarIntentRecord} rec @param {number} tick @returns {boolean}
 */
function isLive(rec, tick) {
  const now = Number.isFinite(tick) ? tick : 0;
  return now - rec.tick <= WAR_INTENT_TTL_TICKS;
}

/**
 * THE READ the opener uses: the live order `besiegerId`'s seat resolved on, or null.
 * TOTAL — an absent ledger, an absent row, a garbage row, or an EXPIRED row all read
 * null, and null makes every consumer below a no-op, so the opener's pre-existing
 * expression runs verbatim.
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string|number} besiegerId
 * @param {number} tick
 * @returns {WarIntentRecord|null}
 */
export function warIntentFor(worldState, besiegerId, tick) {
  const rec = normalizeIntent(intentLedger(worldState)[String(besiegerId)]);
  return rec && isLive(rec, tick) ? rec : null;
}

/**
 * Does this order name `targetId`? The opener asks this to decide whether the
 * CONQUEST_MARGIN pre-filter has been superseded by a real deliberation for this one
 * target. False for a null order ⇒ the pre-filter applies to everyone, as today.
 * @param {WarIntentRecord|null|undefined} intent @param {string|number} targetId @returns {boolean}
 */
export function intentNamesTarget(intent, targetId) {
  return !!intent && intent.targetId === String(targetId);
}

/**
 * The opener's candidate list with the resolved target pulled to the FRONT. Order-
 * stable: the remaining targets keep their incoming (codepoint-sorted) order, so the
 * result is a pure function of the input list and the order — reversing the authored
 * edges cannot change it.
 *
 * BYTE-IDENTICAL WHEN DORMANT: returns the INPUT REFERENCE unchanged when there is no
 * order, or the order names a target the opener is not offering (an edge that has
 * since de-escalated, a target that left the world). No copy, no re-sort.
 * @param {string[]} targets @param {WarIntentRecord|null|undefined} intent @returns {string[]}
 */
export function intentTargetOrder(targets, intent) {
  if (!intent || !Array.isArray(targets) || targets.length < 2) return targets;
  const idx = targets.indexOf(intent.targetId);
  if (idx <= 0) return targets;
  return [targets[idx], ...targets.slice(0, idx), ...targets.slice(idx + 1)];
}

/**
 * Fold a rebuilt row set back onto the worldState, CODEPOINT-KEYED (the serialized key
 * order is a function of the besieger ids alone, never of write order — reversing the
 * authored saves yields the identical ledger bytes), and dropping the whole key (and,
 * when it was the last sub-ledger, the whole spatialLedgers namespace) once it empties
 * — so a world whose orders have all been obeyed or expired is byte-identical to one
 * that never issued any.
 * @param {Record<string, unknown>} worldState @param {WarIntentLedger} rows @returns {Record<string, unknown>}
 */
function foldLedger(worldState, rows) {
  const ids = Object.keys(rows).sort(codepoint);
  if (!ids.length) return dropSpatialLedger(worldState, WAR_INTENT_LEDGER_KEY);
  /** @type {WarIntentLedger} */
  const sorted = {};
  for (const id of ids) sorted[id] = rows[id];
  return setSpatialLedger(worldState, WAR_INTENT_LEDGER_KEY, sorted);
}

/**
 * Every still-live row of the ledger. Expired and malformed rows are dropped here,
 * which is what makes every write a prune.
 * @param {Record<string, unknown>} worldState @param {number} tick @returns {WarIntentLedger}
 */
function liveRows(worldState, tick) {
  const raw = intentLedger(worldState);
  /** @type {WarIntentLedger} */
  const out = {};
  for (const id of Object.keys(raw)) {
    const rec = normalizeIntent(raw[id]);
    if (rec && isLive(rec, tick)) out[id] = rec;
  }
  return out;
}

/**
 * THE WRITE: record that `besiegerId`'s seat has resolved to march on `targetId`.
 * Called from the apply pass on the chooser's own deploy outcome — the exact seam
 * (and shape) the return_home recall already uses to reach the war layer.
 *
 * Prune-as-you-go: every write drops rows that have aged past the TTL, so the ledger
 * cannot accumulate dead orders, and the rebuilt row set is codepoint-keyed (a
 * function of the ids, never of write order). A blank besieger, a blank target, or a
 * settlement ordered to march on ITSELF is a no-op that returns the SAME reference.
 * @param {Record<string, unknown>} worldState
 * @param {string|number|null|undefined} besiegerId
 * @param {string|number|null|undefined} targetId
 * @param {number} [tick]   optional, matching the apply pass's own loose clock
 * @returns {Record<string, unknown>}
 */
export function stampWarIntent(worldState, besiegerId, targetId, tick) {
  const from = besiegerId != null ? String(besiegerId) : '';
  const to = targetId != null ? String(targetId) : '';
  if (!from || !to || from === to) return worldState;
  const at = Number.isFinite(tick) ? Number(tick) : 0;
  const next = liveRows(asObject(worldState), at);
  next[from] = { targetId: to, tick: at };
  return foldLedger(asObject(worldState), next);
}

/**
 * THE CONSUME: the order has been OBEYED (the opener minted this besieger's siege), so
 * retire it. Deliberately clears only an order stamped on an EARLIER tick, which makes
 * the call ORDER-INDEPENDENT inside a single apply pass: a fresh order the chooser
 * resolved on THIS tick survives whether the war layer's own opener outcome is applied
 * before or after it. A no-op (same reference) when there is nothing to retire.
 * @param {Record<string, unknown>} worldState
 * @param {string|number|null|undefined} besiegerId
 * @param {number} [tick]   optional, matching the apply pass's own loose clock
 * @returns {Record<string, unknown>}
 */
export function consumeWarIntent(worldState, besiegerId, tick) {
  const from = besiegerId != null ? String(besiegerId) : '';
  if (!from) return worldState;
  const rec = normalizeIntent(intentLedger(worldState)[from]);
  const at = Number.isFinite(tick) ? Number(tick) : 0;
  if (!rec || !(rec.tick < at)) return worldState;
  const next = liveRows(asObject(worldState), at);
  delete next[from];
  return foldLedger(asObject(worldState), next);
}

/**
 * THE ONE APPLY-SIDE INTENT JOIN. It accepts both the chooser's original metadata
 * (`strategyMove:'deploy'` + `deployTargetId`) and the generic producer contract
 * (`metadata.warIntent:{fromId,targetId}`) used by non-chooser escalation lanes.
 * The war layer's own siege-initiation outcome consumes an earlier order here too.
 *
 * SAME-TICK ORDER INDEPENDENCE is inherited from consumeWarIntent: a fresh order
 * stamped at T is never consumed at T. Therefore chooser/trade intent then opener,
 * or opener then chooser/trade intent, both leave the same fresh row. Irrelevant or
 * malformed outcomes return the input reference unchanged.
 *
 * @param {Record<string, unknown>} state
 * @param {Record<string, unknown>|null|undefined} outcome
 * @param {number} tick
 * @returns {Record<string, unknown>}
 */
export function applyWarIntentOutcome(state, outcome, tick) {
  const row = asObject(outcome);
  const metadata = asObject(row.metadata);
  const generic = asObject(metadata.warIntent);
  let next = state;

  if (generic.fromId != null && generic.targetId != null) {
    next = stampWarIntent(next, String(generic.fromId), String(generic.targetId), tick);
  } else if (metadata.strategyMove === 'deploy' && metadata.deployTargetId != null) {
    next = stampWarIntent(
      next,
      row.targetSaveId == null ? null : String(row.targetSaveId),
      String(metadata.deployTargetId),
      tick,
    );
  }

  if (row.candidateType === 'strategy_deploy' && row.ruleFamily === 'stressor') {
    next = consumeWarIntent(next, row.targetSaveId == null ? null : String(row.targetSaveId), tick);
  }
  return next;
}

/**
 * Stamp a STRATEGIC-WITHDRAWAL order onto a live deployment (war-3 sue-for-peace /
 * war-4 return-home). The chooser's OTHER order to the war layer, and the precedent
 * this module generalizes: the war layer consumes the `recalled` stamp at the top of
 * its NEXT tick, resolving the deployment as an outcome:'withdrawal' through the
 * existing deploymentReturn homecoming (→ contextual siege relief / occupation lift).
 * Rides the EXISTING `deployments` ledger (deep-cloned by ensureWorldState) — no new
 * worldState key. Byte-identical no-op unless `attackerId` actually holds a live
 * deployment against `targetId`, so a peace/recall with no matching siege changes
 * nothing. (Moved here verbatim from applyWorldPulse.js, its only caller.)
 * @param {{ deployments?: Record<string, { targetId?: unknown, recalled?: unknown }> }} state
 * @param {string|number} attackerId @param {string|number} targetId @param {string} cause @param {number} [tick]
 */
export function stampDeploymentRecall(state, attackerId, targetId, cause, tick) {
  const a = String(attackerId);
  const dep = state?.deployments?.[a];
  if (!dep || dep.targetId == null || String(dep.targetId) !== String(targetId)) return state;
  if (dep.recalled) return state; // already ordered — idempotent, no re-stamp
  return {
    ...state,
    deployments: {
      ...state.deployments,
      [a]: { ...dep, recalled: { cause, tick: Number.isFinite(tick) ? tick : null } },
    },
  };
}

/**
 * Remove treaty-blocked pairs from an already-canonical target list. This is the
 * shared eligibility seam for BOTH the ground-truth opener and the belief-aware
 * chooser: beliefs may disagree about hostility, but they cannot make an honored
 * non-aggression pact disappear.
 *
 * DORMANT / NO-BLOCK IDENTITY: when the peace-engine gate is dark, no treaty ledger
 * exists, or no pair is blocked, return the INPUT ARRAY REFERENCE unchanged. When a
 * block applies, preserve the incoming order exactly among the surviving targets.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string|number} fromId
 * @param {string[]} targets
 * @param {number|null} [tick]
 * @returns {string[]}
 */
export function treatyEligibleWarTargets(worldState, fromId, targets, tick = null) {
  if (!Array.isArray(targets) || targets.length === 0) return targets;
  const rules = asObject(asObject(worldState).simulationRules);
  if (rules.warLayerEnabled !== true || rules.peaceEngineEnabled !== true) return targets;
  const at = tick == null || !Number.isFinite(Number(tick))
    ? (Number(asObject(worldState).tick) || 0)
    : Number(tick);
  /** @type {string[]|null} */
  let survivors = null;
  for (let i = 0; i < targets.length; i += 1) {
    const targetId = String(targets[i]);
    if (treatyBlocksWar(worldState, fromId, targetId, at)) {
      if (survivors == null) survivors = targets.slice(0, i);
    } else if (survivors != null) {
      survivors.push(targets[i]);
    }
  }
  return survivors || targets;
}

/**
 * Hostile targets of a settlement, read from the pre-tick relationshipStates + edges.
 * Returns codepoint-sorted target ids the settlement could besiege, excluding pairs
 * held shut by a live honored non-aggression pact.
 *
 * Lives here rather than inside the opener because it is the OTHER half of the same
 * question this module answers — the set of wars a settlement may open is exactly the
 * set an order may name — and because the opener is at its size ceiling.
 * @param {{ worldState?: { relationshipStates?: Record<string, unknown> },
 *   regionalGraph?: { edges?: unknown[] }, relationships?: unknown[],
 *   byId?: { has?: (id: string) => boolean } }} snapshot
 * @param {string|number} fromId
 * @param {number|null} [tick] current tick; omitted reads snapshot.worldState.tick
 * @returns {string[]}
 */
export function hostileTargetsOf(snapshot, fromId, tick = null) {
  const states = snapshot?.worldState?.relationshipStates || {};
  /** @type {Set<string>} */
  const out = new Set();
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    if (!HOSTILE_TYPES.has(relState.relationshipType)) continue;
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a === String(fromId) && snapshot?.byId?.has?.(b)) out.add(b);
    else if (b === String(fromId) && snapshot?.byId?.has?.(a)) out.add(a);
  }
  const sorted = [...out].sort(codepoint);
  const eligible = treatyEligibleWarTargets(snapshot?.worldState, fromId, sorted, tick);
  // WR-8 (N2) — THE MOVEMENT CONSUMER OF THE FEASIBILITY BELIEF, on the STRATEGY
  // CHOOSER's arm of the opener.
  //
  // ⚠️ CORRECTED (lane W8-C, finding F1). This comment used to claim that this
  // function is "the ONE chokepoint both war-opening consumers already pass
  // through". IT IS NOT, and the claim was load-bearing enough that half the
  // consumer shipped unwired behind it: the opener's coalition arm short-circuits
  // to an empty target list and reads its enemy off the join decision, so it never
  // reaches this line. What both arms genuinely share is `treatyEligibleWarTargets`
  // above — a treaty filter, not a belief. The coalition arm is now wired on its
  // own seam, through the SAME derivation (`conquestMarchAdvisedFor`), inside
  // `warCoalitionDecision.readCoalitionJoinDecisions`.
  //
  // ORDERING, NEVER ADMISSION. The stage may only move a target forward; the set
  // is what this function already decided it was. Every hard gate downstream
  // still runs, `classifyFeasibility` included, so a hopeless war still does not
  // open. Dark — and `conquestDoctrineEnabled` is dark by default and lights last
  // in the whole WR chain — the stage returns THIS EXACT ARRAY REFERENCE, so the
  // dormant path is byte-identical rather than merely equal.
  return conquestMarchOrder({
    worldState: snapshot?.worldState,
    snapshot,
    fromId,
    targets: eligible,
  });
}

export const WAR_INTENT_TUNING = Object.freeze({ WAR_INTENT_TTL_TICKS });
