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
  swapNpcStanding, setPrimaryDeity, imposeCult,
} from './mutateEntities.js';
import {
  depleteResource, recoveredResource,
  removedThreat, startedRiot,
  setNeighbourRelationship, cutTradeRoute,
  refugeeWave, plague, raidOrMonsterAttack,
  applyStressor, changeRulingPower, resolveStressor,
  addTradeGood, removeTradeGood, addResource, removeResource,
} from './mutateWorld.js';

/** @typedef {import('../types.js').Event} Event */

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
const MUTATION_HANDLERS = /** @type {Record<string, (s: any, event: any) => any>} */ ({
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
});

/**
 * Apply an event's patches to the settlement. Returns a new settlement
 * (never mutates input). The function understands every event type
 * shipped in the registry; unknown types are no-ops on the settlement
 * (state-only events still land via applyEvent's state-delta path).
 *
 * @param {Object} args
 * @param {Object} args.settlement
 * @param {Event} args.event
 * @param {string|null} [args.now] deterministic ISO timestamp for replay/tests
 * @returns {Object} mutated settlement
 */
export function mutateSettlement({ settlement, event, now = null }) {
  if (!settlement || !event) return settlement;
  const timedEvent = /** @type {any} */ (event);
  // Deterministic by construction (A+ domain.6): the timestamp is a pure
  // function of (event, now). No wall-clock fallback — a caller that wants a
  // real apply time threads `now` (the store does); preview/replay with no now
  // get a stable null, mirroring status.js's deliberate appliedAt:null so the
  // projected nextSettlement is reproducible and preview≡apply holds.
  const timestamp = timedEvent.timestamp || timedEvent.createdAt || now || null;
  const stampedEvent = timedEvent.timestamp ? timedEvent : { ...event, timestamp };
  const base = { ...settlement };

  const handler = MUTATION_HANDLERS[stampedEvent.type];
  const next = handler ? handler(base, stampedEvent) : base;

  // One projection chokepoint for the whole dispatch: whatever event-sourced
  // conditions the handler promoted, wound down, or left alone, the authored
  // config.eventConditions record (dual-written to _config — the
  // customTradeGoods / resourceEdits discipline) follows. This is what lets
  // a full regeneration re-promote them instead of silently dropping them.
  return withEventConditionsSynced(next);
}
