/**
 * domain/events/undoEvent.js — scrub an undone event's durable artifacts
 * off the settlement.
 *
 * undoLastEvent (settlementSlice) restores systemState from the log entry
 * and strips causeEventId-tagged impairments — but events ALSO promote
 * activeConditions and write authored records into settlement.config +
 * settlement._config (eventConditions / resourceEdits / customTradeGoods /
 * stressorEdits / _cutRoutes / the annotation ledgers). Before config.eventConditions
 * existed those ghosts were transient — the next regeneration dropped them;
 * now the records are deliberately re-applied by EVERY regeneration
 * (reapplyEventConditions, resolveResources' overlay, generateEconomy's
 * customTradeGoods pass), so an undone event haunted the settlement
 * permanently. This module is the undo-side mirror of mutate.js:
 *
 *   - everything mutate writes WITH provenance (condition causes, stress
 *     entries' addedByEventId, the annotation ledgers' atEventId, the
 *     destruction stamps) is scrubbed by that provenance — works for log
 *     entries persisted long before this module existed;
 *   - the records whose writes are not exactly reversible from provenance
 *     (resourceEdits / customTradeGoods, consumed as plain keys by the
 *     generators, plus their live outputs; stressorEdits, whose handlers
 *     cross-write the added/resolved lists) are restored from the pre-event
 *     snapshot applyEvent stamps onto the log entry
 *     (captureEventUndoSnapshot). A legacy entry without the snapshot
 *     degrades to today's behavior: the record stays.
 *
 * Pure functions — no store, no React, no I/O.
 */

import { deriveActiveCondition, withEventConditionsSynced } from '../activeConditions.js';

// ── Pre-event snapshot (applyEvent stamps it onto logEntry.undo) ─────────

// Live resolved outputs + the authored delta record the resource events
// write (mutate.js withResourceEdits). The live keys are snapshotted
// alongside the record so the undo is honest NOW, not only after the next
// regeneration re-resolves them.
const RESOURCE_CONFIG_KEYS = Object.freeze([
  'resourceEdits',
  'nearbyResources',
  'nearbyResourcesState',
  'nearbyResourcesDepleted',
  'nearbyResourcesCustom',
]);

// Every list a trade-good label can sit in (mutate.js removeTradeGood's
// sweep), so the live strip/append reverts exactly.
const TRADE_ECONOMIC_KEYS = Object.freeze([
  'primaryExports', 'primaryImports', 'transit', 'exports', 'imports',
]);

const SNAPSHOT_CONFIG_KEYS = Object.freeze({
  DEPLETE_RESOURCE:   RESOURCE_CONFIG_KEYS,
  RECOVERED_RESOURCE: RESOURCE_CONFIG_KEYS,
  ADD_RESOURCE:       RESOURCE_CONFIG_KEYS,
  REMOVE_RESOURCE:    RESOURCE_CONFIG_KEYS,
  ADD_TRADE_GOOD:     Object.freeze(['customTradeGoods']),
  REMOVE_TRADE_GOOD:  Object.freeze(['customTradeGoods']),
  // stressorEdits' added entries DO carry addedByEventId, but the record's
  // cross-writes (an APPLY clears the type's `resolved` suppression, a
  // RESOLVE strikes the type's `added` entry) are only exactly reversible
  // from the pre-event copy — undoing a RESOLVE must bring the struck
  // authored entry back, and undoing an APPLY must restore the suppression
  // it cleared.
  APPLY_STRESSOR:     Object.freeze(['stressorEdits']),
  RESOLVE_STRESSOR:   Object.freeze(['stressorEdits']),
});

const SNAPSHOT_ECONOMIC_KEYS = Object.freeze({
  ADD_TRADE_GOOD:    TRADE_ECONOMIC_KEYS,
  REMOVE_TRADE_GOOD: TRADE_ECONOMIC_KEYS,
});

// Top-level settlement subtrees whose event writes are NOT exactly reversible
// from provenance, so the pre-event copy is the only way back:
//  - CHANGE_RULING_POWER rewrites the whole powerStructure (factions,
//    publicLegitimacy, governingName/government, relationships); scrubbing only
//    the condition left the entire government transfer in place.
//  - The relationship events overwrite a neighbourNetwork link's relationshipType
//    (the _relationshipEventId stamp they wrote was read nowhere), so undo never
//    reverted them.
// The NPC/institution/faction graph an event can rewrite without leaving a
// scrubbable provenance trail. Factions live on powerStructure.factions but
// replaceFaction falls back to the legacy s.factions, so both are snapshotted.
const ENTITY_GRAPH_KEYS = Object.freeze(['npcs', 'institutions', 'powerStructure', 'factions']);
// Roster-only events that mutate NPC records in place (no impairment
// propagation, no condition) — only the npcs subtree needs the pre-event copy.
const NPC_ROSTER_KEYS = Object.freeze(['npcs']);

const SNAPSHOT_SETTLEMENT_KEYS = Object.freeze({
  CHANGE_RULING_POWER: Object.freeze(['powerStructure']),
  BROKERED_ALLIANCE:   Object.freeze(['neighbourNetwork']),
  SETTLEMENT_DISPUTE:  Object.freeze(['neighbourNetwork']),
  OPENED_TRADE_ROUTE:  Object.freeze(['neighbourNetwork']),
  // EXPOSE_CORRUPTION irreversibly swaps in a successor NPC and impairs the tied
  // institution/faction with SYNTHETIC causeEventIds the impairment-strip can't
  // reach — snapshot the affected subtrees so undo restores them exactly.
  EXPOSE_CORRUPTION:   ENTITY_GRAPH_KEYS,
  // The rest of the NPC/corruption family had the SAME gap — they write durable
  // entity state with neither provenance nor a snapshot, so undo left it in
  // place and the divergence compounded through world-pulse on later ticks:
  //  - IMPOSE_CORRUPTION turns a clean NPC (corrupt/corruptionVector/corruptTies);
  //  - PROMOTE_NPC / DEMOTE_NPC swap two NPCs' standing (importance/influence/
  //    structuralRank) and stamp factionId — all in-place npc edits;
  //  - KILL_NPC / KILL_LEADER mark the NPC dead and propagate staffing
  //    impairments onto linked institutions and factions;
  //  - REMOVE_INSTITUTION closes the institution AND severs the corruption ties
  //    (corrupt:false / ousted) of NPCs bound to it, plus propagates impairments.
  // killNpc/removeInstitution stamp removedByEventId but nothing un-deads/
  // un-removes by it, and status 'dead'/'removed' is not the 'impaired' the
  // strip resets — so the snapshot is the only exact way back.
  IMPOSE_CORRUPTION:   NPC_ROSTER_KEYS,
  PROMOTE_NPC:         NPC_ROSTER_KEYS,
  DEMOTE_NPC:          NPC_ROSTER_KEYS,
  KILL_NPC:            ENTITY_GRAPH_KEYS,
  KILL_LEADER:         ENTITY_GRAPH_KEYS,
  REMOVE_INSTITUTION:  ENTITY_GRAPH_KEYS,
});

// The dual-written record keys mirrored into the raw _config. The handlers
// write config and _config in lockstep, so the pre-event config copy IS the
// pre-event _config copy — one snapshot restores both.
const MIRRORED_RECORD_KEYS = Object.freeze(['resourceEdits', 'customTradeGoods', 'stressorEdits']);

const clone = (v) => JSON.parse(JSON.stringify(v));

/** { keys: every key audited, values: only the keys present (cloned) } —
 *  presence matters: a key the event GREW must be deleted on undo, not
 *  emptied, so an undone settlement stays byte-identical to one that never
 *  saw the event. */
function snapshotKeys(source, keys) {
  const values = {};
  if (source && typeof source === 'object') {
    for (const k of keys) {
      if (k in source) values[k] = clone(source[k]);
    }
  }
  return { keys: [...keys], values };
}

/**
 * Capture the pre-event values of the provenance-free authored records the
 * event is about to write. Returns null for every event type whose writes
 * are provenance-scrubable (the common case) — only the resource/trade-good
 * family needs a snapshot.
 *
 * @param {Object} settlement  the BEFORE settlement
 * @param {import('../types.js').Event} event
 * @returns {Object|null}
 */
export function captureEventUndoSnapshot(settlement, event) {
  if (!settlement) return null;
  const configKeys = SNAPSHOT_CONFIG_KEYS[event?.type];
  const settlementKeys = SNAPSHOT_SETTLEMENT_KEYS[event?.type];
  if (!configKeys && !settlementKeys) return null;
  const snapshot = {};
  if (configKeys) snapshot.config = snapshotKeys(settlement.config, configKeys);
  const economicKeys = SNAPSHOT_ECONOMIC_KEYS[event?.type];
  if (economicKeys) snapshot.economicState = snapshotKeys(settlement.economicState, economicKeys);
  if (settlementKeys) snapshot.settlement = snapshotKeys(settlement, settlementKeys);
  return snapshot;
}

function restoreKeys(target, snap) {
  const next = { ...(target || {}) };
  for (const k of snap?.keys || []) {
    if (snap.values && k in snap.values) next[k] = clone(snap.values[k]);
    else delete next[k];
  }
  return next;
}

function restoreSnapshottedRecords(s, snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return s;
  let next = s;
  if (snapshot.config) {
    next = { ...next, config: restoreKeys(next.config, snapshot.config) };
    if (next._config && typeof next._config === 'object') {
      const mirrored = (snapshot.config.keys || []).filter(k => MIRRORED_RECORD_KEYS.includes(k));
      if (mirrored.length) {
        next = {
          ...next,
          _config: restoreKeys(next._config, {
            keys: mirrored,
            values: Object.fromEntries(mirrored
              .filter(k => snapshot.config.values && k in snapshot.config.values)
              .map(k => [k, snapshot.config.values[k]])),
          }),
        };
      }
    }
  }
  if (snapshot.economicState) {
    next = { ...next, economicState: restoreKeys(next.economicState, snapshot.economicState) };
  }
  if (snapshot.settlement) {
    // Restore top-level subtrees (powerStructure / neighbourNetwork) to their
    // exact pre-event copy. restoreKeys deletes a key absent pre-event and
    // restores a present one, so an undone settlement matches one that never
    // saw the event.
    next = restoreKeys(next, snapshot.settlement);
  }
  return next;
}

// ── Provenance scrubs ─────────────────────────────────────────────────────

/**
 * The only path that APPENDS an event cause to a surviving condition is the
 * RESOLVE_STRESSOR wind-down (status → 'easing', expiry clamped to
 * elapsed+2), so stripping such a cause must also un-ease. Status and expiry
 * return to the archetype template defaults — exact in practice, because
 * every event/generation onset takes the template's cap (no producer passes
 * a custom duration) and ticking never moves it. Status is the one judgment
 * call: a condition that had ALREADY drifted to 'easing' on its own comes
 * back at the template default, and the next tick's pre-expiry window
 * re-eases it — the drift self-corrects.
 */
function unEase(condition, strippedCauses) {
  const restored = deriveActiveCondition({
    ...condition,
    status: undefined,
    duration: { ...(condition.duration || {}), expiresAtTicks: undefined },
    causes: strippedCauses,
  });
  // Never IMMORTALIZE via undo: a template-less archetype derives a null
  // cap — keep the wind-down's clamped cap instead.
  if (restored.duration.expiresAtTicks === null
    && typeof condition?.duration?.expiresAtTicks === 'number') {
    return {
      ...restored,
      duration: { ...restored.duration, expiresAtTicks: condition.duration.expiresAtTicks },
    };
  }
  return restored;
}

/**
 * Drop conditions the event PROMOTED (their ONSET cause — causes[0], the
 * provenance discipline mutate.js and conditionPromotion.js share — names
 * this event) and strip the event's appended receipts from survivors.
 * Campaign-owned conditions (channel / world_pulse origins) never match:
 * their causes carry no event ids from this settlement's timeline.
 *
 * Known limitation, mirrored from withActiveCondition's replace-by-id: a
 * second onset of the same archetype+target OVERWROTE the first event's
 * condition, so undoing the second cannot restore the first's copy — the
 * crisis drops entirely. Same class as re-authoring a stressor then undoing.
 */
function withoutEventConditions(s, eventId) {
  const list = Array.isArray(s.activeConditions) ? s.activeConditions : [];
  if (!list.length) return s;
  let changed = false;
  const kept = [];
  for (const c of list) {
    const causes = Array.isArray(c?.causes) ? c.causes : [];
    if (causes[0]?.source === 'event' && causes[0]?.eventId === eventId) {
      changed = true;
      continue;
    }
    const stripped = causes.filter((cause, i) =>
      i === 0 || cause?.source !== 'event' || cause?.eventId !== eventId);
    if (stripped.length === causes.length) {
      kept.push(c);
      continue;
    }
    changed = true;
    kept.push(unEase(c, stripped));
  }
  return changed ? { ...s, activeConditions: kept } : s;
}

/**
 * APPLY_STRESSOR stamps addedByEventId on the entry it upserts — drop it.
 * (When it UPDATED a pre-existing entry the stamp was overwritten, so undo
 * drops the whole entry; a generation-rolled one returns on the next
 * regeneration, and an earlier event's entry via the restored
 * stressorEdits record.) RESOLVE_STRESSOR's live removal is NOT restored —
 * the un-eased condition above is the engine truth NOW, and the restored
 * stressorEdits.added record brings the authored entry back on the next
 * regeneration.
 */
function withoutEventStressEntries(s, eventId) {
  let next = s;
  for (const key of ['stressors', 'stress', 'stresses']) {
    const arr = next[key];
    if (!Array.isArray(arr)) continue;
    const filtered = arr.filter(st => st?.addedByEventId !== eventId);
    if (filtered.length !== arr.length) next = { ...next, [key]: filtered };
  }
  return next;
}

/**
 * The append-only config annotation ledgers, every entry of which carries
 * its atEventId. _cutRoutes is dual-written to _config (deriveRegionalState
 * reads it across regenerations) — the same scrub runs on both copies; the
 * others live on config only. _activePlague is last-writer-takes-all, so it
 * clears only when the popped event wrote it (an earlier plague's
 * overwritten annotation is unrecoverable — same overwrite class as the
 * condition limitation above).
 */
function scrubConfigAnnotations(config, eventId) {
  if (!config || typeof config !== 'object') return config;
  let next = config;
  for (const key of ['_cutRoutes', '_refugeeWaves', '_raidHistory']) {
    const arr = next[key];
    if (!Array.isArray(arr)) continue;
    const filtered = arr.filter(e => e?.atEventId !== eventId);
    if (filtered.length !== arr.length) next = { ...next, [key]: filtered };
  }
  if (next._activePlague?.atEventId === eventId) {
    const { _activePlague, ...rest } = next;
    next = rest;
  }
  return next;
}

function withoutEventAnnotations(s, eventId) {
  let next = s;
  const config = scrubConfigAnnotations(s.config, eventId);
  if (config !== s.config) next = { ...next, config };
  const raw = scrubConfigAnnotations(s._config, eventId);
  if (raw !== s._config) next = { ...next, _config: raw };
  return next;
}

/**
 * DESTROY_SETTLEMENT stamps its event id on both the settlement and the
 * config flag, so the revival is exact. Status restores to 'active' —
 * destruction is the only settlement-level status writer.
 */
function withoutEventDestruction(s, eventId) {
  if (s.destroyedByEventId !== eventId) return s;
  const { destroyedAt: _a, destroyedByEventId: _b, destroyedCause: _c, destroyedReason: _d, ...rest } = s;
  let next = { ...rest, status: 'active' };
  if (next.config?._destroyedByEventId === eventId) {
    const { _destroyed, _destroyedByEventId, ...cfg } = next.config;
    next = { ...next, config: cfg };
  }
  return next;
}

/**
 * Drop entities the popped event CREATED — ADD_NPC / ADD_INSTITUTION /
 * ADD_FACTION stamp createdByEventId on the new record (mirroring the
 * destroyedByEventId/removedByEventId idiom). Without this, an added entity
 * survived its own undo. Re-add of a pre-existing entity (the idempotent
 * un-remove branch) carries no createdByEventId, so it is left intact.
 */
function withoutEventCreations(s, eventId) {
  let next = s;
  const dropCreated = (arr) => arr.filter(e => e?.createdByEventId !== eventId);
  if (Array.isArray(next.npcs) && next.npcs.some(n => n?.createdByEventId === eventId)) {
    next = { ...next, npcs: dropCreated(next.npcs) };
  }
  if (Array.isArray(next.institutions) && next.institutions.some(i => i?.createdByEventId === eventId)) {
    next = { ...next, institutions: dropCreated(next.institutions) };
  }
  const psFactions = next.powerStructure?.factions;
  if (Array.isArray(psFactions) && psFactions.some(f => f?.createdByEventId === eventId)) {
    next = { ...next, powerStructure: { ...next.powerStructure, factions: dropCreated(psFactions) } };
  }
  if (Array.isArray(next.factions) && next.factions.some(f => f?.createdByEventId === eventId)) {
    next = { ...next, factions: dropCreated(next.factions) };
  }
  return next;
}

// ── Entry point ───────────────────────────────────────────────────────────

/**
 * Scrub everything the popped event wrote that outlives its systemState
 * delta: promoted conditions, appended condition receipts, stress entries,
 * annotation ledgers, destruction stamps, created entities, and the
 * snapshotted records.
 * Finishes with withEventConditionsSynced so config.eventConditions (and
 * its _config mirror) stops naming the undone event — without that re-sync,
 * reapplyEventConditions re-promoted the ghost on every regeneration.
 *
 * @param {Object} settlement  the settlement AFTER the impairment strip
 * @param {import('../types.js').EventLogEntry} logEntry  the popped entry
 * @returns {Object} new settlement (or the input when nothing matched)
 */
export function scrubUndoneEvent(settlement, logEntry) {
  const eventId = logEntry?.event?.id;
  if (!settlement || !eventId) return settlement;
  let next = settlement;
  next = withoutEventConditions(next, eventId);
  next = withoutEventStressEntries(next, eventId);
  next = withoutEventAnnotations(next, eventId);
  next = withoutEventDestruction(next, eventId);
  next = withoutEventCreations(next, eventId);
  next = restoreSnapshottedRecords(next, logEntry.undo);
  return withEventConditionsSynced(next);
}
