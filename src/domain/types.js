/**
 * domain/types.js — JSDoc shapes for the campaign-state engine.
 *
 * No runtime exports. This file exists so editors and reviewers have a
 * single, named source of truth for the contracts that flow between
 * `domain/state/`, `domain/events/`, `domain/coherence/`, and the
 * Zustand store. Every public domain function references these typedefs
 * in its own JSDoc — keep them in sync here when shapes evolve.
 *
 * Architectural rule: domain code is pure JS — no React, no Zustand. The
 * store calls into domain; domain never imports back. These types are the
 * boundary contract.
 */

/** @typedef {'draft' | 'canon'} Phase
 *
 * Settlement lifecycle. Draft = authoring/tinkering, edits are
 * authorial. Canon = deployed into a campaign, changes are diegetic
 * events with consequences and timeline entries.
 */

/** @typedef {Object} StateDimension
 *  @property {number} value         0-100, source of truth
 *  @property {Band}   band          coarse label for the UI
 *  @property {string[]} drivers     human-readable reasons for the current value
 *  @property {string[]} risks       what would push it lower
 */

/** @typedef {'Stable' | 'Strained' | 'Vulnerable' | 'Critical'} Band */

/** @typedef {Object} SystemState
 *
 * Four dimensions, intentionally minimal. Each is derived from the
 * existing pipeline output (economicState, factions, stresses, etc.) —
 * no new generation logic, just a unified read of what the engine
 * already produces. Adding a fifth dimension requires a UI consumer
 * for it; do not add speculatively.
 *
 *  @property {StateDimension} resilience       can the place absorb shocks?
 *  @property {StateDimension} volatility       how close is internal conflict?
 *  @property {StateDimension} externalThreat   pressure from outside
 *  @property {StateDimension} resourcePressure are key materials strained?
 */

/** @typedef {Object} Locks
 *
 * Sparse — omit a key entirely to mean "not locked". Lock targets are
 * either booleans (whole sections) or arrays of stable IDs (specific
 * items). The locks engine consults this before any reroll or
 * destructive edit; locked items survive verbatim.
 *
 *  @property {boolean=} identity      name, founding lore
 *  @property {boolean=} geography     terrain, trade access, regional placement
 *  @property {string[]=} factions     faction identifiers to preserve
 *  @property {string[]=} institutions institution identifiers to preserve
 *  @property {string[]=} npcs         NPC identifiers to preserve
 */

/** @typedef {'ADD_INSTITUTION' | 'REMOVE_INSTITUTION' | 'DAMAGE_INSTITUTION'
 *           | 'DEPLETE_RESOURCE' | 'CUT_TRADE_ROUTE'
 *           | 'ADD_NPC' | 'KILL_NPC' | 'ASSIGN_NPC_TO_ROLE'
 *           | 'IMPAIR_INSTITUTION' | 'RESTORE_INSTITUTION'
 *           | 'IMPAIR_FACTION' | 'RESTORE_FACTION'
 *           | 'KILL_LEADER' | 'EXPOSE_CORRUPTION' | 'REFUGEE_WAVE'
 *           | 'PLAGUE' | 'RAID_OR_MONSTER_ATTACK'
 *           | 'REMOVED_THREAT' | 'BROKERED_ALLIANCE' | 'STARTED_RIOT'
 *           | 'OPENED_TRADE_ROUTE' | 'RECOVERED_RESOURCE' | 'DESTROY_SETTLEMENT'
 *           | 'SETTLEMENT_DISPUTE'
 *           | 'APPLY_STRESSOR' | 'CHANGE_RULING_POWER'
 *           | 'RESOLVE_STRESSOR' | 'ADD_TRADE_GOOD' | 'REMOVE_TRADE_GOOD'
 *           | 'ADD_RESOURCE' | 'REMOVE_RESOURCE'
 *           | 'PROMOTE_NPC' | 'DEMOTE_NPC'} EventType
 *
 * The full canonical event vocabulary across both shipping waves.
 *   Foundation (v1):      ADD/REMOVE/DAMAGE_INSTITUTION, DEPLETE_RESOURCE, CUT_TRADE_ROUTE
 *   NPC (v2):             ADD_NPC, KILL_NPC, ASSIGN_NPC_TO_ROLE
 *   Impairment (v2):      IMPAIR/RESTORE_INSTITUTION, IMPAIR/RESTORE_FACTION
 *   Extended (Wave 2+):   KILL_LEADER, EXPOSE_CORRUPTION, REFUGEE_WAVE, PLAGUE, RAID_OR_MONSTER_ATTACK
 *   Player intervention (Phase 24): REMOVED_THREAT, BROKERED_ALLIANCE, STARTED_RIOT, OPENED_TRADE_ROUTE, RECOVERED_RESOURCE, DESTROY_SETTLEMENT
 *   Coup d'état wave:     APPLY_STRESSOR (authored crisis onset, full catalog + custom), CHANGE_RULING_POWER (user-permissioned transfer of the governing seat)
 *   Editor roster wave:   RESOLVE_STRESSOR (authored crisis wind-down, the inverse of APPLY_STRESSOR),
 *                         ADD/REMOVE_TRADE_GOOD (export/import/transit labels, incl. entrepôt suffixing),
 *                         ADD/REMOVE_RESOURCE (nearby-resource roster, dual-format config writes),
 *                         PROMOTE/DEMOTE_NPC (same-faction influence/position swap; polarity is narrative)
 *
 * When adding a new event: add the literal here, add the spec in
 * events/registry.js, add the rerun-keys mapping, add the mutation
 * handler in events/mutate.js, and add a faction response branch per
 * relevant archetype.
 */

/** @typedef {Object} Event
 *  @property {string}    id             uuid
 *  @property {EventType} type
 *  @property {string}    targetId       e.g. "institution.granary" — looked up by name match for v1
 *  @property {Object}    payload        type-specific extras
 *  @property {'authoring' | 'player_action' | 'world_event'} cause
 *  @property {string=}   inWorldDate    free-form string, e.g. "17 Harvestwane"
 *  @property {string=}   description    DM's plain-English context
 */

/** @typedef {Object} Delta
 *  @property {keyof SystemState} key
 *  @property {number} before
 *  @property {number} after
 *  @property {number} change
 *  @property {'minor' | 'moderate' | 'major'} severity
 *  @property {string} explanation
 */

/** @typedef {Object} FactionResponse
 *  @property {string} factionId
 *  @property {string} factionName
 *  @property {'opportunity' | 'threat' | 'opportunity_and_threat' | 'neutral'} stance
 *  @property {string} response   short prose: what they do about it
 *  @property {string=} hookSeed  optional adventure seed produced by the response
 */

/** @typedef {Object} EventLogEntry
 *  @property {Event} event
 *  @property {string} appliedAt              ISO timestamp
 *  @property {SystemState} beforeState
 *  @property {SystemState} afterState
 *  @property {Delta[]} deltas
 *  @property {FactionResponse[]} factionResponses
 *  @property {string} narrativeSummary       short DM-facing summary
 *  @property {Array<Object>=} causalStateDeltas          Phase 18 substrate-layer diff
 *  @property {Array<Object>=} factionRelationshipDeltas  Phase 14 structured faction deltas
 *  @property {Object=} undo  pre-event snapshot of the provenance-free authored
 *                            records (undoEvent.captureEventUndoSnapshot);
 *                            undoLastEvent restores from it — resource/trade events only
 */

/** @typedef {Object} CoherenceWarning
 *  @property {'warning' | 'mismatch' | 'suggestion'} severity
 *  @property {string} message
 *  @property {string[]=} suggestedFixes
 */

/** @typedef {Object} EventPreview
 *
 * Returned by `previewEvent`. Same shape as a committed log entry minus
 * the timestamp — the UI shows this as "if applied, here's what would
 * happen" before the user confirms. `applyEvent` materializes it into a
 * real EventLogEntry.
 *
 * Phase 18 (Tier 2.2): preview now also exposes the substrate-layer
 * diff and the projected mutated settlement so consumers can build
 * counterfactual surfaces without re-running the pipeline.
 *
 *  @property {Event} event
 *  @property {SystemState} beforeState
 *  @property {SystemState} afterState
 *  @property {Delta[]} deltas
 *  @property {FactionResponse[]} factionResponses
 *  @property {string} narrativeSummary
 *  @property {string[]} affectedSteps        which pipeline steps would re-run
 *  @property {CoherenceWarning[]} warnings   coherence issues introduced by the event
 *  @property {Array<Object>=} causalStateDeltas          Phase 18 substrate diff
 *  @property {Array<Object>=} factionRelationshipDeltas  Phase 14 structured faction deltas
 *
 * Note: the projected nextSettlement is intentionally NOT on the
 * preview shape — mutateSettlement embeds Date.now() timestamps in
 * impairments, which would break the preview-is-pure contract.
 * Consumers wanting the projected settlement should call
 * runEventPipeline directly.
 */

// No runtime exports — this file is for JSDoc reference only.
export {};
