/**
 * settlementSliceHelpers.js — pure / leaf helpers extracted from settlementSlice
 * (WS4 decomposition, increment 7).
 *
 * These hold no store state: they operate on plain values, on the Immer draft
 * `state` passed in, or on a save/settlement object. Extracting them shrinks the
 * settlementSlice megafile and gives a single import home for the shared
 * transform/persist surface. The module never imports settlementSlice, so there
 * is no cycle.
 *
 * NOTE: rippleEventThroughWorld (the world-ripple half of applyEvent)
 * deliberately stays in settlementSlice — it is the one place the store obeys
 * the crisis-twin directive, and the crisisTripleSync structural pins assert
 * that the twin actions are referenced from settlementSlice itself.
 */
import { saves as savesService } from '../lib/saves.js';
import { inferSuccessors } from '../domain/entities/successors.js';
import { inferImportance } from '../domain/entities/npcs.js';

const MAX_VERSION_HISTORY = 50;

export function cloneJson(value) {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value));
}

export function persistSaveUpdate(saveId, partial) {
  if (!saveId || !partial) return;
  savesService.update(saveId, partial).catch(e => {
    console.warn('[settlementSlice] save update failed', e);
  });
}

export function cappedVersionHistory(history) {
  return Array.isArray(history) ? history.slice(-MAX_VERSION_HISTORY) : [];
}

export function saveEnvelopeFor(saveId, save, settlement, campaignState) {
  return {
    ...(save || {}),
    id: saveId || save?.id || settlement?.id || null,
    name: save?.name || settlement?.name || 'Untitled Settlement',
    tier: save?.tier || settlement?.tier || 'unknown',
    settlement,
    campaignState: campaignState || save?.campaignState || null,
  };
}

export function visibleSettlementIdsForCampaign(state, campaign) {
  const placements = campaign?.mapState?.placements || state.mapState?.placements || {};
  return Object.values(placements)
    .map(p => p?.settlementId)
    .filter(Boolean);
}

// ── Per-entity-kind nested array resolver ──────────────────────────────
//
// Mirrors the layout used by domain/userEdits.js#walkUserEdits and
// aiOverlayVerifier#locateEntity. Centralized so a future schema move
// (e.g. factions out of powerStructure) touches one map, not three.
const ENTITY_ARRAY_PATH_BY_KIND = Object.freeze({
  npc:             ['npcs'],
  institution:     ['institutions'],
  faction:         ['powerStructure', 'factions'],
  conflict:        ['powerStructure', 'conflicts'],
  hook:            ['hooks'],
  plotHook:        ['plotHooks'],
  condition:       ['activeConditions'],
  supplyChain:     ['supplyChains'],
  historicalEvent: ['history', 'historicalEvents'],
  currentTension:  ['history', 'currentTensions'],
});

export function _resolveEntity(settlement, kind, entityIndex) {
  if (kind === 'settlement') return settlement;
  const segs = ENTITY_ARRAY_PATH_BY_KIND[kind];
  if (!segs) return null;
  let ref = settlement;
  for (const seg of segs) {
    if (ref == null || typeof ref !== 'object') return null;
    ref = ref[seg];
  }
  if (!Array.isArray(ref)) return null;
  return ref[entityIndex] || null;
}

/**
 * Build a `campaignState` snapshot from the live slice for persistence
 * into a save record. Centralizing the shape means the round-trip
 * (save → reload → hydrateFromSave) is symmetric and a single edit
 * keeps both sides in step.
 */
export function pickleCampaignState(state) {
  return {
    phase:         state.phase || 'draft',
    eventLog:      Array.isArray(state.eventLog) ? [...state.eventLog] : [],
    systemState:   state.systemState ? JSON.parse(JSON.stringify(state.systemState)) : null,
    locks:         state.locks ? { ...state.locks } : {},
    generatedAt:   state.generatedAt || null,
    editedAt:      new Date().toISOString(),
    canonizedAt:   state.canonizedAt || null,
    lastExportAt:  state.lastExportAt || null,
    narrativeDrift: null,
    exportState:   null,
  };
}

/**
 * Curried predicate-flavored helper for undoLastEvent: returns a map
 * function that strips any impairment whose causeEventId matches the
 * supplied event id, and resets `status` to 'active' if no impairments
 * remain. Centralizing here keeps the undo logic consistent across
 * institution, faction, and npc entity lists.
 */
export const stripImpairmentsForEvent = (eventId) => (entity) => {
  if (!entity) return entity;
  const impairments = (entity.impairments || []).filter(i => i.causeEventId !== eventId);
  const next = { ...entity, impairments };
  // If undo also reversed a removal/destruction caused by the same
  // event, restore status. We track removedByEventId on entities for this.
  if (entity.removedByEventId === eventId) {
    next.status = 'active';
    delete next.removedByEventId;
  } else if (entity.status === 'impaired' && impairments.length === 0) {
    next.status = 'active';
  }
  return next;
};

/**
 * Successor detection for applyEvent: when a pillar-tier NPC dies, surface the
 * engine's ranked successor list so the DM doesn't have to invent a replacement
 * from scratch. The prompt is informational and dismissible; it does not block
 * other UI flow. Pure — reads the PRE-mutation settlement (the source of truth
 * for "who was alive and linked to whom"; the post-mutation copy already shows
 * the NPC as removed/dead). Returns null when no prompt is warranted.
 */
export function computePendingSuccession(settlement, event) {
  if (event?.type !== 'KILL_NPC') return null;
  const outgoing = (settlement.npcs || []).find(n =>
    (n.id && n.id === event.targetId) ||
    (n.name && n.name.toLowerCase() === String(event.targetId || '').toLowerCase()),
  );
  const importance = event.payload?.importance || (outgoing ? inferImportance(outgoing) : 'notable');
  if (importance !== 'pillar' || !outgoing) return null;
  return {
    outgoingNpcId:   outgoing.id || outgoing.name,
    outgoingNpcName: outgoing.name || 'Unknown',
    outgoingRole:    outgoing.role || '',
    linkedInstitutionIds: outgoing.linkedInstitutionIds || [],
    suggestedSuccessorIds: inferSuccessors({ outgoing, settlement, limit: 3 }),
    originEventId:   event.id,
  };
}
