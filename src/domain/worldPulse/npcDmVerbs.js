/**
 * domain/worldPulse/npcDmVerbs.js — W-H4: THE THREE DM VERBS.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §7 DM VERBS, §8 HERALD SURFACES; laws 1
 * NEVER-KILL / DM-SOVEREIGN, 5 DORMANCY, 6 CONSERVATION, 7 AUDIENCE PROJECTION.)
 *
 * THE WHOLE SUBSYSTEM EXISTS SO THAT THESE THREE VERBS ARE THE ONLY PLACE A FATE IS
 * RESOLVED. Every other lane in W-H produces a STATE: a verdict is a state, roaming is
 * a state, a shut door is a state. The engine never decides that somebody dies, never
 * decides that a banishment is over, and never overrules a town's edict. A DM does, by
 * pressing a button, and gets a receipt they can reverse.
 *
 *   ASSIGN  — put a wanderer into a settlement. SOVEREIGN: it may override the
 *             exclusion edges a court wrote, and when it does, the override is NAMED in
 *             the receipt (design §7 is explicit about that, and it is the difference
 *             between a DM's ruling and a bug). Address-chain news: "X takes up
 *             residence in Y."
 *   KILL    — the ONLY death in the system. DM-explicit, receipt-carried, undoable.
 *   PARDON  — the mercy verb: lift the edicts shut against a person, release a jail
 *             hold, and say so in the paper.
 *
 * ── UNDO IS A TYPED INVERSE, NOT A SECOND MECHANISM ──────────────────────────────
 * Design §7 asks for "snapshot undo". Every verb here returns an `undo` payload that IS
 * the snapshot of exactly what it disturbed: KILL carries the removed record verbatim
 * (a snapshot of the soul, since §3b freezes the ledger at three maps and forbids a
 * tombstone) plus the exact pre-loss envoy rows its death closed; ASSIGN carries the
 * prior placement; PARDON carries the lifted edges verbatim. `undoDmVerb` replays it.
 * ONE mechanism rather than a snapshot ring beside a typed inverse, because two
 * mechanisms for one guarantee is how an undo path drifts out of agreement with the
 * write path it is supposed to reverse. It composes better too: a replayed inverse
 * survives an unrelated ledger write between the act and the undo, where a whole-
 * worldState snapshot would silently roll that write back as well.
 *
 * ── AUDIENCE PROJECTION (law 7) ──────────────────────────────────────────────────
 * Each news item carries its DM receipt under the SAME `dmTruth` key H2 used, so the
 * ledger projection's allowlist and publicSafe.js's recursive denylist both hold it out
 * without either learning a second spelling. What a player reads is the headline, the
 * summary and the reasons, in world words; what the DM reads additionally is which
 * override ran, what the prior state was, and what the inverse would restore.
 *
 * ── DORMANCY (law 5) ─────────────────────────────────────────────────────────────
 * Every entry point is a whole-entry-point early return when `npcConsequencesEnabled`
 * is dark, returning the CALLER'S OWN worldState reference so a dark pass cannot mint a
 * fresh object and defeat a change detector upstream.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation. The
 * verbs are total on garbage: an unknown durable id, a nameless settlement or a dark
 * world all produce a typed refusal rather than a throw or a half-write.
 *
 * @enforced-by tests/domain/npcDmVerbs.test.js
 */

import {
  npcConsequencesActive,
  npcLedgerOf,
  moveNpcRecord,
  removeNpcRecord,
  restoreNpcRecord,
  liftExclusionEdges,
  addExclusionEdge,
} from './npcLedger.js';
import { EDICT_EXCLUSION_KINDS, exclusionActiveAt } from './npcLedgerFacets.js';
// THE RULING REGISTER is its own single-writer leaf (see its header for the walker
// hazard that forced the split): the address-chain items these verbs hand down land
// there, and the inverse withdraws them from there.
import { recordNpcRuling, withdrawNpcRuling } from './npcRulingRegister.js';
// THE TWO PURE LEAVES OF THIS WRITER FAMILY (ruling R-BLD-4). This file stays the family
// HEAD and the only writer; the leaves answer questions and build shapes. `…Records`
// owns the address-chain item and the roster mark (and therefore the DM_TRUTH_KEY and
// NPC_CONSEQUENCE_KEY imports, which are never re-spelled anywhere); `…Authority` owns
// the identity read and the custody predicates that decide whether an act may proceed.
import {
  ASSIGN_NEWS_TYPE,
  DEATH_NEWS_TYPE,
  PARDON_NEWS_TYPE,
  assignmentNewsItem,
  clearJailHold,
  deathNewsItem,
  markRosterDeath,
  nameOf,
  pardonNewsItem,
  placeWord,
} from './npcDmVerbRecords.js';
import {
  assignmentOrigin,
  findIdentity,
  h1SupportsForeignHold,
  heldErrandFor,
  npcOwnsReleasedLeg,
  restoreRuleConfiguration,
  sameNpcSnapshot,
  sameTransit,
  withEnvoyCleanupAuthority,
} from './npcDmVerbAuthority.js';
import {
  hasActiveEnvoyForNpc,
  loseEnvoyForNpc,
  releaseHeldEnvoy,
  restoreEnvoyErrands,
  restoreReleasedEnvoy,
} from './envoyErrand.js';
import {
  closeForeignGuestHold,
  foreignGuestHoldForNpc,
  restoreForeignGuestHold,
} from './foreignGuestHold.js';
import { buildEnvoyRoutePlan, syncEnvoyNpcTransit } from './envoyDiplomacy.js';
import { routeLifecycleActive } from './routeNetworkLedger.js';
import { advanceLivedTraveller } from './routeNetworkConsumersTransit.js';

/** The closed verb vocabulary. A fourth verb is a design amendment, not a call site. */
export const DM_VERBS = Object.freeze(['assign', 'kill', 'pardon']);

// The address-chain candidate types live with the items that carry them, and are
// re-exported here so this module's public surface is unchanged by the decomposition.
export { ASSIGN_NEWS_TYPE, DEATH_NEWS_TYPE, PARDON_NEWS_TYPE };

/** The typed refusal vocabulary. Closed, so a surface can phrase every one of them. */
export const DM_VERB_REFUSALS = Object.freeze([
  'dormant',
  'unknown_identity',
  'no_settlement',
  'excluded_without_override',
  'nothing_to_lift',
  'already_there',
  'no_route',
  'active_errand',
  'foreign_hold_conflict',
]);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/**
 * @typedef {Object} DmVerbUndo
 * @property {string} verb        a DM_VERBS member
 * @property {string} wnpcId
 * @property {string} rulingId    the address-chain item to withdraw from the register
 * @property {string|null} hostSettlementId  ASSIGN: where they were before (null = roaming)
 * @property {number} sinceTick              ASSIGN: the state clock to restore
 * @property {Record<string, unknown>|null} record  ASSIGN/KILL: the prior record
 * @property {boolean} wasPlaced                    ASSIGN/KILL: its prior map
 * @property {Record<string, unknown>|null} assignmentTransit ASSIGN: exact opened leg
 * @property {string} assignmentTargetSettlementId ASSIGN: exact destination token
 * @property {number} assignmentTick                ASSIGN: exact episode token
 * @property {ReadonlyArray<Record<string, unknown>>} edges  KILL/PARDON: the edges to re-write
 * @property {ReadonlyArray<Record<string, unknown>>} envoyPriorErrands KILL: exact
 *   pre-loss rows returned by envoyErrand's one writer
 * @property {ReadonlyArray<Record<string, unknown>>} envoyEvictedErrands KILL:
 *   terminal archive rows displaced by the loss closures
 * @property {number} envoyKilledAtTick KILL: conflict token for restoring those rows
 * @property {Record<string, unknown>} [foreignGuestHoldClosure] KILL/PARDON:
 *   exact one-writer closure token for restoring custody
 */

/**
 * @typedef {Object} DmVerbResult
 * @property {Record<string, unknown>} worldState
 * @property {unknown} settlement            the (possibly) patched settlement, or the caller's own
 * @property {string} verb
 * @property {Record<string, unknown>|null} news
 * @property {Record<string, unknown>|null} receipt
 * @property {DmVerbUndo|null} undo
 * @property {ReadonlyArray<Record<string, unknown>>} [envoyEvidence] governed loss
 *   evidence emitted by envoyErrand's one writer
 * @property {string|null} refusal           a DM_VERB_REFUSALS member when nothing happened
 * @property {boolean} changed
 */

/**
 * The no-op result. Returns the caller's OWN references (law 5's change-detector rule).
 * @param {Record<string, unknown>} worldState
 * @param {unknown} settlement
 * @param {string} verb
 * @param {string} refusal
 * @returns {DmVerbResult}
 */
function refuse(worldState, settlement, verb, refusal) {
  return {
    worldState,
    settlement,
    verb,
    news: null,
    receipt: null,
    undo: null,
    refusal,
    changed: false,
  };
}

/** One generic placement call keeps the legal already-there/legacy arms out of the
 *  Law-M bypass signature: callers decide WHY direct placement is valid, this helper
 *  only applies the already-decided host.
 * @param {Record<string,unknown>} worldState @param {string} wnpcId
 * @param {string|null} placementHost @param {number} sinceTick
 * @param {Record<string,unknown>} [patch]
 * @returns {ReturnType<typeof moveNpcRecord>} */
function placeNpcRecord(worldState, wnpcId, placementHost, sinceTick, patch = {}) {
  return moveNpcRecord({
    worldState,
    wnpcId,
    hostSettlementId: placementHost,
    patch,
    sinceTick,
  });
}

// ── ASSIGN ────────────────────────────────────────────────────────────────────
/**
 * PUT A WANDERER INTO A SETTLEMENT, BY THE DM'S OWN HAND.
 *
 * THE SOVEREIGNTY RULE, and why it is not simply "ignore the exclusions". A DM may
 * absolutely walk a banished person back through the gate they were thrown out of;
 * design §7 says so. But an override that happens SILENTLY is indistinguishable from a
 * bug that forgot to check, and the person who has to tell them apart is a GM six months
 * later reading their own campaign. So the two are separated: without
 * `overrideExclusions` the verb REFUSES and names the doors that are shut; with it, the
 * verb proceeds and the receipt NAMES every edge it overrode. The refusal is what makes
 * the override meaningful.
 *
 * A COOLDOWN IS NOT A DOOR. Only EDICT kinds gate this verb: a rehost cooldown is
 * circulation bookkeeping (the wanderer has not knocked again yet), never a legal fact,
 * and refusing a DM's assignment because of one would be the engine overruling them on a
 * technicality it invented for its own pacing.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {string} args.settlementId
 * @param {string} [args.settlementName]
 * @param {number} args.tick
 * @param {boolean} [args.overrideExclusions]  the DM says "anyway", explicitly
 * @returns {DmVerbResult}
 */
export function assignRoamer({
  worldState,
  wnpcId,
  settlementId,
  settlementName = '',
  tick,
  overrideExclusions = false,
}) {
  if (!npcConsequencesActive(worldState)) return refuse(worldState, null, 'assign', 'dormant');
  const target = text(settlementId);
  if (!target) return refuse(worldState, null, 'assign', 'no_settlement');
  const found = findIdentity(worldState, wnpcId);
  if (!found) return refuse(worldState, null, 'assign', 'unknown_identity');
  // A parlay is a physical state, not a placement vacancy. The active errand remains
  // the person's positional authority through travelling, parlaying, and returning;
  // opening a DM assignment beside it would create two lifecycle owners and whichever
  // pulse ran last would appear to teleport the person. Terminal archive rows release
  // this hold through the envoy writer's single active-state read.
  if (hasActiveEnvoyForNpc(worldState, text(wnpcId))) {
    return refuse(worldState, null, 'assign', 'active_errand');
  }
  if (found.wasPlaced && found.host === target) {
    return refuse(worldState, null, 'assign', 'already_there');
  }

  const at = tickOf(tick);
  // THE SHUT DOORS AT THIS SETTLEMENT, edict kinds only, still live at this tick.
  const shut = found.edges.filter((edge) => (
    text(edge.settlementId) === target
    && EDICT_EXCLUSION_KINDS.includes(text(edge.kind))
    && exclusionActiveAt(edge, at)
  ));
  if (shut.length > 0 && overrideExclusions !== true) {
    return refuse(worldState, null, 'assign', 'excluded_without_override');
  }

  const origin = assignmentOrigin(found);
  const livedTransit = routeLifecycleActive(worldState) && origin !== target;
  /** @type {Record<string, unknown>|null} */
  let assignmentTransit = null;
  /** @type {ReturnType<typeof moveNpcRecord>} */
  let moved;
  if (livedTransit) {
    // An existing leg has no exact settlement from which a new ruling can honestly
    // depart. Likewise, a missing/unreachable lived route is a refusal of the WHOLE
    // command: no ruling, receipt, override, or partial ledger write survives.
    if (!origin || Object.keys(asObject(found.record.dmAssignment)).length > 0) {
      return refuse(worldState, null, 'assign', 'no_route');
    }
    const departure = advanceLivedTraveller({
      worldState,
      atSettlementId: origin,
      leg: null,
      destId: target,
      kind: 'wanderer',
      tick: at,
    });
    if (departure.verdict !== 'departed' || !departure.leg) {
      return refuse(worldState, null, 'assign', 'no_route');
    }
    assignmentTransit = /** @type {Record<string,unknown>} */ (
      /** @type {unknown} */ (departure.leg)
    );
    moved = placeNpcRecord(worldState, text(wnpcId), null, at, {
      residency: null,
      transit: departure.leg,
      whereaboutsUnknown: null,
      dmAssignment: {
        targetSettlementId: target,
        atSettlementId: '',
        issuedTick: at,
      },
    });
  } else {
    // Legacy-dark is byte-faithful, and an already-present roamer needs no journey.
    moved = placeNpcRecord(worldState, text(wnpcId), target, at, {
      residency: null,
      transit: null,
      whereaboutsUnknown: null,
      dmAssignment: null,
    });
  }
  if (!moved.changed) return refuse(worldState, null, 'assign', 'already_there');

  const who = nameOf(found.record);
  const where = placeWord(target, settlementName);
  const overrides = shut.map((edge) => `${text(edge.kind)} at ${text(edge.settlementId)}`);
  /** @type {Record<string, unknown>} */
  const receipt = {
    verb: 'assign',
    wnpcId: text(wnpcId),
    settlementId: target,
    tick: at,
    priorHostSettlementId: found.wasPlaced ? found.host : null,
    assignmentState: assignmentTransit ? 'in_transit' : 'resident',
    ...(assignmentTransit ? { firstLegArrivalTick: tickOf(assignmentTransit.arrivalTick) } : {}),
    // THE OVERRIDE, NAMED. Empty when no door was shut, which is the honest reading:
    // the DM did not override anything, they placed somebody nobody had barred.
    overrodeExclusions: Object.freeze(overrides),
  };
  const news = assignmentNewsItem({
    wnpcId: text(wnpcId),
    who,
    where,
    settlementId: target,
    originSettlementId: text(asObject(found.record.originRef).settlementId),
    departureSettlementId: origin,
    overrides,
    tick: at,
    inTransit: assignmentTransit != null,
  });
  return {
    worldState: recordNpcRuling(moved.worldState, news),
    settlement: null,
    verb: 'assign',
    news,
    receipt: Object.freeze(receipt),
    undo: Object.freeze({
      verb: 'assign',
      wnpcId: text(wnpcId),
      rulingId: text(news.id),
      hostSettlementId: found.wasPlaced ? found.host : null,
      sinceTick: tickOf(found.record.sinceTick),
      record: found.record,
      wasPlaced: found.wasPlaced,
      assignmentTransit,
      assignmentTargetSettlementId: target,
      assignmentTick: at,
      edges: Object.freeze([]),
    }),
    refusal: null,
    changed: true,
  };
}

/**
 * Advance every live DM assignment over at most one lived-route transition this tick.
 * The current leg remains the shared H3/J4 shape; `dmAssignment` carries only the final
 * destination and an intermediate rest point. Arrival places the person exactly once.
 *
 * @param {{worldState:Record<string,unknown>,tick:number,season?:string|null}} args
 * @returns {{worldState:Record<string,unknown>,changed:boolean,arrivedNpcIds:ReadonlyArray<string>}}
 */
export function advanceAssignedNpcTransits({ worldState, tick, season = null }) {
  if (!npcConsequencesActive(worldState)) {
    return { worldState, changed: false, arrivedNpcIds: Object.freeze([]) };
  }
  let state = worldState;
  /** @type {string[]} */
  const arrivedNpcIds = [];
  const ids = Object.keys(npcLedgerOf(state).roamers).sort();
  for (const wnpcId of ids) {
    const current = asObject(npcLedgerOf(state).roamers[wnpcId]);
    const assignment = asObject(current.dmAssignment);
    const target = text(assignment.targetSettlementId);
    if (!target) continue;
    const leg = Object.keys(asObject(current.transit)).length > 0 ? current.transit : null;
    const step = advanceLivedTraveller({
      worldState: state,
      atSettlementId: text(assignment.atSettlementId),
      leg: /** @type {any} */ (leg),
      destId: target,
      kind: 'wanderer',
      tick: tickOf(tick),
      season,
    });
    if (step.arrived && step.atSettlementId === target) {
      const placed = placeNpcRecord(state, wnpcId, target, tickOf(tick), {
        residency: null, transit: null, dmAssignment: null,
      });
      if (placed.changed) {
        state = placed.worldState;
        arrivedNpcIds.push(wnpcId);
      }
      continue;
    }
    if (step.arrived) {
      const rested = placeNpcRecord(state, wnpcId, null, tickOf(tick), {
        residency: null,
        transit: null,
        dmAssignment: {
          targetSettlementId: target,
          atSettlementId: step.atSettlementId,
          issuedTick: tickOf(assignment.issuedTick),
        },
      });
      if (rested.changed) state = rested.worldState;
      continue;
    }
    if (step.verdict === 'departed' && step.leg) {
      const departed = placeNpcRecord(state, wnpcId, null, tickOf(tick), {
        residency: null,
        transit: step.leg,
        dmAssignment: {
          targetSettlementId: target,
          atSettlementId: '',
          issuedTick: tickOf(assignment.issuedTick),
        },
      });
      if (departed.changed) state = departed.worldState;
    }
  }
  return {
    worldState: state,
    changed: state !== worldState,
    arrivedNpcIds: Object.freeze(arrivedNpcIds),
  };
}

// ── KILL ──────────────────────────────────────────────────────────────────────
/**
 * THE ONLY DEATH IN THE SYSTEM (design §7, law 1).
 *
 * No engine path reaches this function and none ever may: the verdict table produces
 * states, circulation produces movements, the lifecycle kernel produces dispersal, and
 * every one of them composes with the others precisely because none of them is
 * terminal. A death is the DM's sentence and nobody else's, so it lives behind a verb
 * they have to press and a receipt they can reverse.
 *
 * WHAT IT TOUCHES. The campaign world only: the durable record leaves the pool and its
 * exclusion edges go with it (an edict against a dead person is not an edict). When the
 * complete WR-7a conjunction is lit, the same durable id's active errands close lost
 * through envoyErrand's one writer; a terms-bearing loss emits its governed evidence.
 * The settlement roster is DELIBERATELY NOT REMOVED here and that is documented rather
 * than forgotten: the roster lives on a different persistence surface (a saved
 * settlement, not the campaign world), so removing somebody from it is a save-scoped
 * transaction belonging to the slice that owns that write. The verb instead stamps a
 * `npcConsequence` mark on the roster record when a settlement is supplied, which is the
 * SAME key H2's relinquishment writes, so a dossier reading that key sees the death
 * without this leaf inventing a second spelling for it.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {number} args.tick
 * @param {unknown} [args.settlement]      the host settlement, when the caller has it
 * @param {string} [args.settlementName]
 * @returns {DmVerbResult}
 */
export function killNamedNpc({ worldState, wnpcId, tick, settlement = null, settlementName = '' }) {
  const activeForeignHold = foreignGuestHoldForNpc(worldState, text(wnpcId));
  if (!npcConsequencesActive(worldState) && !activeForeignHold) {
    return refuse(worldState, settlement, 'kill', 'dormant');
  }
  const operationWorldState = activeForeignHold
    ? withEnvoyCleanupAuthority(worldState)
    : worldState;
  const found = findIdentity(operationWorldState, wnpcId);
  if (!found) return refuse(worldState, settlement, 'kill', 'unknown_identity');

  const at = tickOf(tick);
  if (activeForeignHold && worldState.tick !== undefined
    && tickOf(worldState.tick) !== at) {
    return refuse(worldState, settlement, 'kill', 'foreign_hold_conflict');
  }
  // A normalized hold without its exact held envoy is split authority. Publishing only
  // half of a death would leave either a living errand owned by no soul or custody of a
  // soul the ledger says is dead, so the sovereign act refuses as one transaction.
  if (activeForeignHold && !heldErrandFor(worldState, activeForeignHold)) {
    return refuse(worldState, settlement, 'kill', 'foreign_hold_conflict');
  }
  const removal = removeNpcRecord(operationWorldState, text(wnpcId));
  if (!removal.changed) return refuse(worldState, settlement, 'kill', 'unknown_identity');

  let stateAfterCustody = removal.worldState;
  /** @type {Record<string, unknown>|null} */
  let foreignGuestHoldClosure = null;
  if (activeForeignHold) {
    const closedHold = closeForeignGuestHold({
      worldState: stateAfterCustody,
      expectedHold: activeForeignHold,
      tick: at,
      reason: 'death',
    });
    if (closedHold.changed !== true || !closedHold.closure) {
      return refuse(worldState, settlement, 'kill', 'foreign_hold_conflict');
    }
    stateAfterCustody = closedHold.worldState;
    foreignGuestHoldClosure = closedHold.closure;
  }

  // A durable envoy is the same soul as the H1 ledger row. Death therefore closes
  // every live errand before the ruling lands, through envoyErrand's sole writer.
  // Dark/partial WR-7 configurations return the removal state by identity, preserving
  // the pre-WR-7 KILL bytes exactly.
  const envoyLoss = loseEnvoyForNpc({
    worldState: stateAfterCustody,
    npcId: text(wnpcId),
    tick: at,
    cause: 'killed',
  });
  if (activeForeignHold && (envoyLoss.changed !== true
    || !(envoyLoss.priorErrands || []).some((errand) => (
      text(errand.id) === text(activeForeignHold.errandId)
      && text(errand.npcId) === text(activeForeignHold.npcId)
    )))) {
    return refuse(worldState, settlement, 'kill', 'foreign_hold_conflict');
  }

  const who = nameOf(found.record);
  const originSettlementId = text(asObject(found.record.originRef).settlementId);
  const lastSeenId = activeForeignHold
    ? originSettlementId
    : found.wasPlaced
      ? found.host
      : text(asObject(found.record.residency).settlementId) || originSettlementId;
  const where = activeForeignHold ? 'the realm' : placeWord(lastSeenId, settlementName);
  const rosterId = text(asObject(found.record.originRef).rosterId);
  const marked = markRosterDeath(settlement, rosterId, at);

  const news = deathNewsItem({
    wnpcId: text(wnpcId),
    who,
    where,
    settlementId: lastSeenId,
    rosterId,
    locationKnown: !activeForeignHold,
    foreignGuestHoldClosed: !!activeForeignHold,
    tick: at,
  });
  return {
    // The envoy loss is mechanical DM truth. A remote court cannot publish that truth
    // until a later observation carrier reaches it, so KILL records only the locally
    // witnessed death ruling here and returns the loss evidence privately to its caller.
    worldState: recordNpcRuling(
      restoreRuleConfiguration(envoyLoss.worldState, worldState),
      news,
    ),
    settlement: marked,
    verb: 'kill',
    news,
    receipt: Object.freeze({
      verb: 'kill',
      wnpcId: text(wnpcId),
      settlementId: lastSeenId,
      tick: at,
      wasPlaced: found.wasPlaced,
      doorsClosed: removal.exclusions.length,
      ...(activeForeignHold ? { foreignGuestHoldClosed: true } : {}),
    }),
    // THE SNAPSHOT: the record verbatim, which is the only thing that can restore a soul
    // the three-map ledger keeps no tombstone for.
    undo: Object.freeze({
      verb: 'kill',
      wnpcId: text(wnpcId),
      rulingId: text(news.id),
      hostSettlementId: found.wasPlaced ? found.host : null,
      sinceTick: tickOf(found.record.sinceTick),
      record: found.record,
      wasPlaced: found.wasPlaced,
      edges: /** @type {ReadonlyArray<Record<string, unknown>>} */ (
        /** @type {unknown} */ (removal.exclusions)
      ),
      ...(envoyLoss.reason === 'dark' ? {} : {
        envoyPriorErrands: /** @type {ReadonlyArray<Record<string, unknown>>} */ (
          /** @type {unknown} */ (envoyLoss.priorErrands || [])
        ),
        envoyEvictedErrands: /** @type {ReadonlyArray<Record<string, unknown>>} */ (
          /** @type {unknown} */ (envoyLoss.evictedErrands || [])
        ),
        envoyKilledAtTick: at,
      }),
      ...(foreignGuestHoldClosure ? { foreignGuestHoldClosure } : {}),
    }),
    ...(envoyLoss.reason === 'dark'
      ? {}
      : {
          envoyEvidence: Object.freeze([...(envoyLoss.evidence || [])]),
        }),
    refusal: null,
    changed: true,
  };
}

// ── PARDON ────────────────────────────────────────────────────────────────────
/**
 * THE MERCY VERB (design §7): lift the edicts, release the hold, and say so.
 *
 * ONE VERB, TWO HALVES, because they are one act in the fiction and the design names
 * them together. LIFT EXCLUSION works on the world ledger: the edict edges shut against
 * this person, either everywhere or at one named door. RELEASE works on the settlement:
 * a jailed person's hold is the `npcConsequence.jailUntilTick` mark H2 stamped on their
 * roster record, so a release clears exactly that field and leaves the rest of the mark
 * standing (the disgrace happened; the sentence is over).
 *
 * THE SETTLEMENT IS OPTIONAL, AND ITS ABSENCE IS NOT A FAILURE. A pardon issued from the
 * realm register may reach somebody whose host save the caller does not have in hand;
 * the ledger half still runs and the receipt records that no hold was reachable, rather
 * than the verb refusing an act the DM is entitled to perform.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {number} args.tick
 * @param {string} [args.settlementId]  narrow the pardon to ONE door; absent = every door
 * @param {string} [args.settlementName]
 * @param {unknown} [args.settlement]   the host save, when the caller has it (the release half)
 * @returns {DmVerbResult}
 */
export function pardonNpc({
  worldState,
  wnpcId,
  tick,
  settlementId = '',
  settlementName = '',
  settlement = null,
}) {
  const activeForeignHold = foreignGuestHoldForNpc(worldState, text(wnpcId));
  if (!npcConsequencesActive(worldState) && !activeForeignHold) {
    return refuse(worldState, settlement, 'pardon', 'dormant');
  }
  const operationWorldState = activeForeignHold
    ? withEnvoyCleanupAuthority(worldState)
    : worldState;
  const found = findIdentity(operationWorldState, wnpcId);
  if (!found) return refuse(worldState, settlement, 'pardon', 'unknown_identity');

  const at = tickOf(tick);
  if (activeForeignHold && worldState.tick !== undefined
    && tickOf(worldState.tick) !== at) {
    return refuse(worldState, settlement, 'pardon', 'foreign_hold_conflict');
  }
  const priorHeldErrand = activeForeignHold
    ? heldErrandFor(worldState, activeForeignHold)
    : null;
  if (activeForeignHold && !priorHeldErrand) {
    return refuse(worldState, settlement, 'pardon', 'foreign_hold_conflict');
  }
  if (activeForeignHold && !h1SupportsForeignHold(found, activeForeignHold)) {
    return refuse(worldState, settlement, 'pardon', 'foreign_hold_conflict');
  }

  // A pardon opens a FRESH lived journey from the exact custody venue to the
  // interruption capsule's carried destination. The old leg is evidence of where the
  // traveller was stopped, never reusable movement authority after release.
  const continuation = asObject(activeForeignHold?.continuation);
  const releaseRoute = activeForeignHold ? buildEnvoyRoutePlan({
    worldState: operationWorldState,
    fromId: text(activeForeignHold.venueId),
    toId: text(continuation.destinationId),
    tick: at,
    journey: /** @type {'outbound'|'return'} */ (text(continuation.journey)),
    season: text(operationWorldState.season) || null,
  }) : null;
  if (activeForeignHold && !releaseRoute) {
    return refuse(worldState, settlement, 'pardon', 'no_route');
  }

  const lift = liftExclusionEdges(operationWorldState, text(wnpcId), {
    settlementId,
    kinds: EDICT_EXCLUSION_KINDS,
  });
  const rosterId = text(asObject(found.record.originRef).rosterId);
  const released = clearJailHold(settlement, rosterId);
  const releasedLocalHold = released !== settlement;
  let pardonWorldState = lift.worldState;
  /** @type {Record<string, unknown>|null} */
  let foreignGuestHoldClosure = null;
  /** @type {Record<string, unknown>|null} */
  let releasedErrand = null;

  if (activeForeignHold && priorHeldErrand && releaseRoute) {
    const closedHold = closeForeignGuestHold({
      worldState: pardonWorldState,
      expectedHold: activeForeignHold,
      tick: at,
      reason: 'pardon',
    });
    if (closedHold.changed !== true || !closedHold.closure) {
      return refuse(worldState, settlement, 'pardon', 'foreign_hold_conflict');
    }
    const resumed = releaseHeldEnvoy({
      worldState: closedHold.worldState,
      errandId: text(activeForeignHold.errandId),
      encounterId: text(activeForeignHold.encounterId),
      routePlan: releaseRoute,
      expectedErrand: priorHeldErrand,
      tick: at,
    });
    if (resumed.changed !== true || !resumed.errand) {
      return refuse(worldState, settlement, 'pardon', 'foreign_hold_conflict');
    }
    let synced = syncEnvoyNpcTransit(resumed.worldState, resumed.errand, at);
    // The shared sync helper owns ordinary pulse movement. A DM pardon additionally
    // has the exact stale-authority trio (hold row, prior H1 row, fresh route) and may
    // perform this one release transition through H1's canonical writer when the
    // ordinary helper quite properly declines a leg that did not begin at home.
    if (!npcOwnsReleasedLeg(synced, text(wnpcId), releaseRoute, at)
      && sameNpcSnapshot(synced, text(wnpcId), found)) {
      const firstLeg = asObject(releaseRoute.legs[0]);
      synced = placeNpcRecord(synced, text(wnpcId), null, at, {
        residency: null,
        transit: firstLeg,
        whereaboutsUnknown: null,
        dmAssignment: null,
      }).worldState;
    }
    if (!npcOwnsReleasedLeg(synced, text(wnpcId), releaseRoute, at)) {
      return refuse(worldState, settlement, 'pardon', 'foreign_hold_conflict');
    }
    pardonWorldState = synced;
    foreignGuestHoldClosure = closedHold.closure;
    releasedErrand = resumed.errand;
  }

  const releasedForeignHold = foreignGuestHoldClosure != null;
  const releasedHold = releasedLocalHold || releasedForeignHold;
  if (lift.lifted.length === 0 && !releasedHold) {
    return refuse(worldState, settlement, 'pardon', 'nothing_to_lift');
  }

  const who = nameOf(found.record);
  const doors = lift.lifted.map((edge) => text(edge.settlementId));
  const originSettlementId = text(asObject(found.record.originRef).settlementId);
  const newsSettlementId = activeForeignHold
    ? settlementId || doors[0] || originSettlementId
    : settlementId || found.host || doors[0] || '';
  const where = activeForeignHold
    ? 'the realm'
    : placeWord(newsSettlementId, settlementName);
  const news = pardonNewsItem({
    wnpcId: text(wnpcId),
    who,
    where,
    settlementId: newsSettlementId,
    doors,
    releasedHold,
    releasedForeignHold,
    tick: at,
  });
  const releasedNpcSnapshot = releasedForeignHold
    ? findIdentity(pardonWorldState, text(wnpcId))
    : null;
  if (releasedForeignHold && !releasedNpcSnapshot) {
    return refuse(worldState, settlement, 'pardon', 'foreign_hold_conflict');
  }
  return {
    worldState: recordNpcRuling(
      restoreRuleConfiguration(pardonWorldState, worldState),
      news,
    ),
    settlement: released,
    verb: 'pardon',
    news,
    receipt: Object.freeze({
      verb: 'pardon',
      wnpcId: text(wnpcId),
      // The NARROWING scope the caller asked for (empty = every door)...
      settlementId: text(settlementId),
      // ...and, separately, where a jail hold could live. The two are different
      // questions and conflating them is what makes a release half silently miss: a
      // pardon issued against every door names no settlement, while the person it
      // frees is held at exactly one.
      hostSettlementId: found.wasPlaced ? found.host : '',
      tick: at,
      doorsOpened: Object.freeze(doors),
      releasedFromHold: releasedHold,
      ...(releasedForeignHold ? { releasedFromForeignCustody: true } : {}),
    }),
    undo: Object.freeze({
      verb: 'pardon',
      wnpcId: text(wnpcId),
      rulingId: text(news.id),
      hostSettlementId: found.wasPlaced ? found.host : null,
      sinceTick: tickOf(found.record.sinceTick),
      record: null,
      wasPlaced: found.wasPlaced,
      // THE SNAPSHOT: the lifted edges verbatim, windows and all, so re-shutting a door
      // restores the exact sentence rather than a fresh indefinite one.
      edges: /** @type {ReadonlyArray<Record<string, unknown>>} */ (
        /** @type {unknown} */ (lift.lifted)
      ),
      ...(foreignGuestHoldClosure && priorHeldErrand && releasedErrand ? {
        foreignGuestHoldClosure,
        foreignGuestPriorErrand: priorHeldErrand,
        foreignGuestReleasedErrand: releasedErrand,
        foreignGuestReleaseTick: at,
        foreignGuestReleaseTransit: asObject(releaseRoute?.legs?.[0]),
        foreignGuestPriorHostSettlementId: found.wasPlaced ? found.host : null,
        foreignGuestPriorSinceTick: tickOf(found.record.sinceTick),
        foreignGuestPriorRecord: found.record,
        foreignGuestReleasedNpcWasPlaced: releasedNpcSnapshot?.wasPlaced === true,
        foreignGuestReleasedNpcRecord: releasedNpcSnapshot?.record,
      } : {}),
    }),
    refusal: null,
    changed: lift.changed || releasedHold,
  };
}

// ── THE INVERSE ───────────────────────────────────────────────────────────────
/**
 * REVERSE ONE DM VERB from the `undo` payload it handed back.
 *
 * Total over the closed verb vocabulary: assign puts the person back where they were;
 * kill atomically restores the record, every edge, and any exact envoy rows its loss
 * closed; pardon re-shuts the exact doors it opened. An unknown verb, a dark world or a
 * stale payload is a no-op returning the caller's own worldState.
 *
 * NOT TOTAL OVER THE SETTLEMENT HALF, and it says so rather than pretending: the roster
 * marks KILL and PARDON write live on a saved settlement, and this pure inverse only
 * restores the WORLD LEDGER. The caller that wrote the settlement is the caller that
 * must restore it, which is why every verb returns the settlement it patched.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {unknown} args.undo
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, verb: string }}
 */
export function undoDmVerb({ worldState, undo }) {
  const payload = asObject(undo);
  const verb = text(payload.verb);
  const hasForeignCleanup = ['kill', 'pardon'].includes(verb)
    && Object.keys(asObject(payload.foreignGuestHoldClosure)).length > 0;
  if ((!npcConsequencesActive(worldState) && !hasForeignCleanup) || !DM_VERBS.includes(verb)) {
    return { worldState, changed: false, verb };
  }
  const operationWorldState = hasForeignCleanup
    ? withEnvoyCleanupAuthority(worldState)
    : worldState;
  const wnpcId = text(payload.wnpcId);
  if (!wnpcId) return { worldState, changed: false, verb };

  // KILL is a two-ledger inverse once the slain person was an envoy. Compose both
  // pure restores speculatively and publish neither unless both accept their conflict
  // tokens. That keeps a stale undo from reviving a soul without their errand, or an
  // errand without its soul. The death ruling is withdrawn only after the state is whole.
  if (verb === 'kill') {
    const back = restoreNpcRecord({
      worldState: operationWorldState,
      wnpcId,
      record: payload.record,
      wasPlaced: payload.wasPlaced === true,
      exclusions: Array.isArray(payload.edges) ? payload.edges : [],
    });
    if (back.restored !== true) return { worldState, changed: false, verb };

    let restored = back.worldState;
    const priorErrands = Array.isArray(payload.envoyPriorErrands)
      ? payload.envoyPriorErrands
      : [];
    if (priorErrands.length > 0) {
      const envoyBack = restoreEnvoyErrands({
        worldState: restored,
        priorErrands,
        evictedErrands: Array.isArray(payload.envoyEvictedErrands)
          ? payload.envoyEvictedErrands
          : [],
        killedAtTick: tickOf(payload.envoyKilledAtTick),
      });
      if (envoyBack.changed !== true) return { worldState, changed: false, verb };
      restored = envoyBack.worldState;
    }
    if (Object.keys(asObject(payload.foreignGuestHoldClosure)).length > 0) {
      const holdBack = restoreForeignGuestHold({
        worldState: restored,
        closure: payload.foreignGuestHoldClosure,
        tick: tickOf(payload.envoyKilledAtTick),
      });
      if (holdBack.changed !== true) return { worldState, changed: false, verb };
      restored = holdBack.worldState;
    }
    restored = withdrawNpcRuling(restored, text(payload.rulingId));
    restored = restoreRuleConfiguration(restored, worldState);
    return { worldState: restored, changed: restored !== worldState, verb };
  }

  if (verb === 'assign') {
    const current = findIdentity(operationWorldState, wnpcId);
    if (!current) return { worldState, changed: false, verb };
    const expectedLeg = Object.keys(asObject(payload.assignmentTransit)).length > 0
      ? asObject(payload.assignmentTransit)
      : null;
    const currentAssignment = asObject(current.record.dmAssignment);
    const expectedTarget = text(payload.assignmentTargetSettlementId);
    const assignmentStillExact = expectedLeg
      ? !current.wasPlaced
        && text(currentAssignment.targetSettlementId) === expectedTarget
        && tickOf(currentAssignment.issuedTick) === tickOf(payload.assignmentTick)
        && sameTransit(current.record.transit, expectedLeg)
      : current.wasPlaced
        && current.host === expectedTarget
        && tickOf(current.record.sinceTick) === tickOf(payload.assignmentTick);
    if (!assignmentStillExact) return { worldState, changed: false, verb };
    const priorRecord = asObject(payload.record);
    const back = moveNpcRecord({
      worldState: operationWorldState,
      wnpcId,
      hostSettlementId: payload.hostSettlementId == null ? null : text(payload.hostSettlementId),
      patch: {
        residency: Object.keys(asObject(priorRecord.residency)).length > 0
          ? priorRecord.residency
          : null,
        transit: Object.keys(asObject(priorRecord.transit)).length > 0
          ? priorRecord.transit
          : null,
        dmAssignment: Object.keys(asObject(priorRecord.dmAssignment)).length > 0
          ? priorRecord.dmAssignment
          : null,
        whereaboutsUnknown: priorRecord.whereaboutsUnknown === true ? true : null,
      },
      sinceTick: tickOf(payload.sinceTick),
    });
    if (!back.changed) return { worldState, changed: false, verb };
    const next = withdrawNpcRuling(back.worldState, text(payload.rulingId));
    return { worldState: next, changed: next !== worldState, verb };
  }

  if (verb === 'pardon' && hasForeignCleanup) {
    const releaseTick = tickOf(payload.foreignGuestReleaseTick);
    const current = findIdentity(operationWorldState, wnpcId);
    const releasedNpcRecord = asObject(payload.foreignGuestReleasedNpcRecord);
    if (!current
      || current.wasPlaced !== (payload.foreignGuestReleasedNpcWasPlaced === true)
      || JSON.stringify(current.record) !== JSON.stringify(releasedNpcRecord)) {
      return { worldState, changed: false, verb };
    }

    // Three speculative one-writer inverses; publish none unless all three accept
    // their exact witnesses. Envoy comes first because its released row is the most
    // likely state to have advanced since the ruling. Custody and H1 follow only after
    // that conflict token proves the journey is still untouched.
    const envoyBack = restoreReleasedEnvoy({
      worldState: operationWorldState,
      priorErrand: payload.foreignGuestPriorErrand,
      releasedErrand: payload.foreignGuestReleasedErrand,
      releaseTick,
    });
    if (envoyBack.changed !== true) return { worldState, changed: false, verb };
    const holdBack = restoreForeignGuestHold({
      worldState: envoyBack.worldState,
      closure: payload.foreignGuestHoldClosure,
      tick: releaseTick,
    });
    if (holdBack.changed !== true) return { worldState, changed: false, verb };

    const priorRecord = asObject(payload.foreignGuestPriorRecord);
    const h1Back = moveNpcRecord({
      worldState: holdBack.worldState,
      wnpcId,
      hostSettlementId: payload.foreignGuestPriorHostSettlementId == null
        ? null
        : text(payload.foreignGuestPriorHostSettlementId),
      patch: {
        residency: Object.keys(asObject(priorRecord.residency)).length > 0
          ? priorRecord.residency
          : null,
        transit: Object.keys(asObject(priorRecord.transit)).length > 0
          ? priorRecord.transit
          : null,
        dmAssignment: Object.keys(asObject(priorRecord.dmAssignment)).length > 0
          ? priorRecord.dmAssignment
          : null,
        whereaboutsUnknown: priorRecord.whereaboutsUnknown === true ? true : null,
      },
      sinceTick: tickOf(payload.foreignGuestPriorSinceTick),
    });
    const restoredNpc = findIdentity(h1Back.worldState, wnpcId);
    if (h1Back.changed !== true || !restoredNpc
      || restoredNpc.wasPlaced !== (payload.wasPlaced === true)
      || JSON.stringify(restoredNpc.record) !== JSON.stringify(priorRecord)) {
      return { worldState, changed: false, verb };
    }

    let restored = withdrawNpcRuling(h1Back.worldState, text(payload.rulingId));
    for (const edge of Array.isArray(payload.edges) ? payload.edges : []) {
      restored = addExclusionEdge(restored, wnpcId, asObject(edge)).worldState;
    }
    restored = restoreRuleConfiguration(restored, worldState);
    return { worldState: restored, changed: restored !== worldState, verb };
  }

  // PARDON withdraws the one address-chain ruling before replaying its original
  // exclusion writes. KILL and ASSIGN validate their multi-part inverses first above.
  let next = withdrawNpcRuling(operationWorldState, text(payload.rulingId));

  // pardon: re-shut every door, with its original window.
  for (const edge of Array.isArray(payload.edges) ? payload.edges : []) {
    next = addExclusionEdge(next, wnpcId, asObject(edge)).worldState;
  }
  next = restoreRuleConfiguration(next, worldState);
  return { worldState: next, changed: next !== worldState, verb };
}
