/**
 * domain/events/mutate.js — Apply an event's entity patches to a
 * settlement object.
 *
 * The architecture fix the audit kept flagging: events must mutate
 * entities, not just SystemState. This module is where that wiring
 * lives. Given an event + the current settlement, it returns:
 *
 *   - mutated settlement (with status flips, impairments, NPC patches)
 *   - propagation chains computed and applied
 *   - removed/created/replaced npc records
 *
 * Pure function — no store, no React, no I/O. The store calls into
 * this from `applyEvent` and persists the result.
 *
 * The per-event-type handlers live in two cohesive sibling modules
 * (mutateEntities.js / mutateWorld.js) over a shared finder/replacer leaf
 * (mutateHelpers.js); this module is the thin router — a dispatch map keyed
 * by event type, plus the single condition-sync chokepoint. The split keeps
 * each module well under the file-size ratchet without changing behaviour.
 */

import { withEventConditionsSynced } from '../activeConditions.js';
import {
  destroySettlement,
  damageInstitution, removeInstitution, addInstitution,
  impairInstitution, restoreInstitution,
  impairFaction, restoreFaction, addFaction,
  addNpc, killNpcMutation, assignNpcMutation, killLeaderMutation,
  exposeCorruption, imposeCorruption,
  swapNpcStanding, setPrimaryDeity, imposeCult, shiftTier,
} from './mutateEntities.js';
import {
  depleteResource, recoveredResource,
  removedThreat, startedRiot,
  setNeighbourRelationship, cutTradeRoute,
  refugeeWave, plague, raidOrMonsterAttack,
  applyStressor, changeRulingPower, resolveStressor,
  addTradeGood, removeTradeGood, addResource, removeResource,
  forceRelief, offerCredit,
} from './mutateWorld.js';
import { makeReceipt } from '../trace.js';
import { mutationVetoOf } from './mutateHelpers.js';

/** @typedef {import('../types.js').Event} Event */
/** @typedef {import('../trace.js').Receipt} Receipt */
/** @typedef {import('../trace.js').TraceCause} TraceCause */
/** @typedef {import('../trace.js').TraceEffect} TraceEffect */
// Schemaless open objects at this layer (see mutateEntities.js).
/** @typedef {any} MutSettlement */
/** @typedef {any} MutateEvent */

/**
 * Event type → entity-mutation handler. Each handler has the uniform shape
 * (settlement, stampedEvent) => settlement and never mutates its input.
 * Several event types deliberately share one handler:
 *   - the three relationship events (SETTLEMENT_DISPUTE / BROKERED_ALLIANCE /
 *     OPENED_TRADE_ROUTE) → setNeighbourRelationship (the handler branches on
 *     event.type internally);
 *   - PROMOTE_NPC / DEMOTE_NPC → swapNpcStanding (the polarity is narrative).
 * Extended events reuse primitives too: KILL_LEADER is a KILL_NPC forced to
 * pillar importance; the population-shifting events (REFUGEE_WAVE, PLAGUE)
 * record themselves as durable conditions; RAID optionally damages a named
 * institution. A type absent from this map is a no-op on the settlement
 * (state-only events still land via applyEvent's state-delta path).
 */
const MUTATION_HANDLERS = /** @type {Record<string, (s: MutSettlement, event: MutateEvent) => MutSettlement>} */ ({
  DESTROY_SETTLEMENT: destroySettlement,
  DAMAGE_INSTITUTION: damageInstitution,
  REMOVE_INSTITUTION: removeInstitution,
  ADD_INSTITUTION: addInstitution,
  DEPLETE_RESOURCE: depleteResource,
  RECOVERED_RESOURCE: recoveredResource,
  REMOVED_THREAT: removedThreat,
  STARTED_RIOT: startedRiot,
  CUT_TRADE_ROUTE: cutTradeRoute,
  SETTLEMENT_DISPUTE: setNeighbourRelationship,
  BROKERED_ALLIANCE: setNeighbourRelationship,
  OPENED_TRADE_ROUTE: setNeighbourRelationship,

  ADD_NPC: addNpc,
  KILL_NPC: killNpcMutation,
  ASSIGN_NPC_TO_ROLE: assignNpcMutation,

  IMPAIR_INSTITUTION: impairInstitution,
  RESTORE_INSTITUTION: restoreInstitution,
  IMPAIR_FACTION: impairFaction,
  RESTORE_FACTION: restoreFaction,
  ADD_FACTION: addFaction,

  KILL_LEADER: killLeaderMutation,
  EXPOSE_CORRUPTION: exposeCorruption,
  IMPOSE_CORRUPTION: imposeCorruption,
  REFUGEE_WAVE: refugeeWave,
  PLAGUE: plague,
  RAID_OR_MONSTER_ATTACK: raidOrMonsterAttack,

  APPLY_STRESSOR: applyStressor,
  CHANGE_RULING_POWER: changeRulingPower,

  RESOLVE_STRESSOR: resolveStressor,
  ADD_TRADE_GOOD: addTradeGood,
  REMOVE_TRADE_GOOD: removeTradeGood,
  ADD_RESOURCE: addResource,
  REMOVE_RESOURCE: removeResource,
  PROMOTE_NPC: swapNpcStanding,
  DEMOTE_NPC: swapNpcStanding,
  SET_PRIMARY_DEITY: setPrimaryDeity,
  IMPOSE_CULT: imposeCult,
  SHIFT_TIER: shiftTier,
  FORCE_RELIEF: forceRelief,
  OFFER_CREDIT: offerCredit,
});

/**
 * Apply an event's patches to the settlement, surfacing handler vetoes
 * (Composer V2 §2 — the handler-veto channel). Returns the mutated settlement
 * PLUS the veto a gated handler raised: when `veto` is non-null the settlement
 * is unchanged (beyond the condition re-sync of an untouched copy) and the
 * pipeline must not commit deltas or narration. Unknown types remain no-ops
 * with no veto (state-only events still land via applyEvent's delta path).
 *
 * @param {Object} args
 * @param {Object} args.settlement
 * @param {Event} args.event
 * @param {string|null} [args.now] deterministic ISO timestamp for replay/tests
 * @returns {{ settlement: Object, veto: import('./mutateHelpers.js').MutationVeto|null }}
 */
export function mutateSettlementChecked({ settlement, event, now = null }) {
  if (!settlement || !event) return { settlement, veto: null };
  const timedEvent = /** @type {MutateEvent} */ (event);
  // Deterministic by construction (A+ domain.6): the timestamp this stamps is a
  // pure function of (event, now) — there is NO internal wall-clock read here
  // (the stale "embeds Date.now()" note elsewhere predates this). A caller that
  // wants a real apply time threads `now` (the store does, at the apply
  // boundary); preview/replay pass no `now` and get a stable null.
  //
  // Scope of the preview≡apply guarantee: the PIPELINE outputs preview compares
  // — afterState, deltas, causalStateDeltas — are byte-identical between preview
  // and apply (pinned by eventPipeline.test.js), because none of them read this
  // timestamp. The projected nextSettlement's EMBEDDED provenance stamps
  // (impairment/annotation `appliedAt`) do NOT match byte-for-byte when the event
  // carries no timestamp/createdAt: preview records `null`, apply records the
  // threaded real time. That asymmetry is deliberate (apply keeps real
  // provenance; preview stays reproducible), which is exactly why the projected
  // nextSettlement is kept OFF the preview shape (types.js) — no consumer diffs
  // those two settlements, so the asymmetry is never observed as a drift.
  const timestamp = timedEvent.timestamp || timedEvent.createdAt || now || null;
  const stampedEvent = timedEvent.timestamp ? timedEvent : { ...event, timestamp };
  const base = { ...settlement };

  const handler = MUTATION_HANDLERS[stampedEvent.type];
  const result = handler ? handler(base, stampedEvent) : base;
  const veto = mutationVetoOf(result);
  const next = veto ? base : result;

  // One projection chokepoint for the whole dispatch: whatever event-sourced
  // conditions the handler promoted, wound down, or left alone, the authored
  // config.eventConditions record (dual-written to _config — the
  // customTradeGoods / resourceEdits discipline) follows. This is what lets
  // a full regeneration re-promote them instead of silently dropping them.
  return { settlement: withEventConditionsSynced(next), veto };
}

/**
 * Legacy silent-no-op wrapper: byte-identical behavior to the pre-veto
 * mutateSettlement (a gated handler returns the settlement unchanged). Direct
 * callers that predate the veto channel (undo replay, tests) keep this
 * contract; pipeline-facing callers use mutateSettlementChecked above so the
 * refusal is visible.
 *
 * @param {Object} args
 * @param {Object} args.settlement
 * @param {Event} args.event
 * @param {string|null} [args.now] deterministic ISO timestamp for replay/tests
 * @returns {Object} mutated settlement
 */
export function mutateSettlement(args) {
  return mutateSettlementChecked(args).settlement;
}

// ── Receipts (Track K §C2) ──────────────────────────────────────────────────

/**
 * Derive a {@link Receipt} from a committed event's log entry — the 'event'
 * source lane of the unified receipt system. The event itself is the single
 * cause (its type is the source, an optional targetId its effect, the
 * narrativeSummary its reason); each SystemState delta on the entry becomes a
 * TraceEffect. Kind is always 'event' (a committed event, whatever it mutated,
 * is one receipt keyed on the event). Pure; the entry is never mutated.
 *
 * Accepts either a nested EventLogEntry ({ event, deltas, narrativeSummary })
 * or a flat entry that IS the event (the DESTROY_SETTLEMENT snapshot shape).
 *
 * @param {MutateEvent} entry
 * @param {number} [index]   position in the log — the receipt-id ordinal
 * @returns {Receipt | null}
 */
export function receiptFromEventLogEntry(entry, index = 0) {
  if (!entry || typeof entry !== 'object') return null;
  // Nested EventLogEntry ({ event, ... }) or a flat entry that is itself the event.
  const event = entry.event && typeof entry.event === 'object' ? entry.event : entry;
  const type = event.type || 'EVENT';
  const targetId = event.id || event.targetId || type;

  /** @type {TraceCause} */
  const cause = { source: String(type) };
  if (event.targetId) cause.effect = `targets ${event.targetId}`;
  if (entry.narrativeSummary) cause.reason = String(entry.narrativeSummary);

  /** @type {TraceEffect[]} */
  const effects = [];
  if (Array.isArray(entry.deltas)) {
    for (const d of entry.deltas) {
      if (!d || d.key == null) continue;
      /** @type {TraceEffect} */
      const effect = { target: String(d.key), effect: `${d.change > 0 ? '+' : ''}${d.change}` };
      if (d.explanation) effect.reason = String(d.explanation);
      effects.push(effect);
    }
  }

  return makeReceipt({ source: 'event', kind: 'event', targetId, n: index, causes: [cause], effects, tick: null });
}
