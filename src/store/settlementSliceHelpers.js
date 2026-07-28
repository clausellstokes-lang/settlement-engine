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
import { deepClone } from '../domain/clone.js';
import { inferSuccessors } from '../domain/entities/successors.js';
import { inferImportance } from '../domain/entities/npcs.js';
import { makeActionResult } from './actionResult.js';
import { remapNpcLocks, locksAfterFullGenerate } from '../domain/locksPreservation.js';
import { persistSaveUpdate } from './campaignSliceShared.js';

// A+ P0.1: persistSaveUpdate is UNIFIED. The canon settlement path (applyEvent,
// undoLastEvent, recordSnapshot, revertToSnapshot, destroySavedSettlement) imports
// persistSaveUpdate from here; re-exporting the single failure-reporting impl from
// campaignSliceShared means those writes report cloud-save failures into
// campaignSyncError (the CampaignSyncBanner) instead of silently console.warn-ing
// and drifting from Supabase. There must be exactly ONE persistSaveUpdate definition.
export { persistSaveUpdate } from './campaignSliceShared.js';
export { loadSettlementContentRuntimeOptions } from './settlementContentRuntime.js';
// The LOCKS ENGINE read side (domain/locksPreservation.js), re-exported through this
// leaf so settlementSlice keeps its single helper import home and gains no new static
// import of its own — the eager-closure rule the lock leaf's header explains.
export { sectionLocked, carryLockedSections, geographyLockedConfig } from '../domain/locksPreservation.js';

const MAX_VERSION_HISTORY = 50;

export function cloneJson(value) {
  if (value === undefined || value === null) return value;
  // P3.1 clone-seam centralization: delegate to the SINGLE sanctioned seam
  // (domain/clone.js `deepClone`) — structuredClone-primary with a DataCloneError-only
  // JSON fallback — instead of hand-rolling the same round-trip. Correct for the large
  // settlement/versionHistory payloads this path clones and for the Immer draft proxies
  // / function-carrying values it may see. The name + null short-circuit stay so callers
  // are untouched; the hand-rolled JSON round-trip leaves the store tree.
  return deepClone(value);
}

export function cappedVersionHistory(history) {
  return Array.isArray(history) ? history.slice(-MAX_VERSION_HISTORY) : [];
}

/**
 * Build a snapshot payload from a settlement: a deep clone with its OWN
 * versionHistory stripped. A snapshot records CONTENT, never the timeline —
 * embedding the history inside every snapshot made each new snapshot carry all
 * prior ones (size ≈ base × 2^N). Stripping here guarantees payloads can never
 * nest, whichever timeline (draft sibling or saved-entry sibling) they land in.
 */
export function snapshotSettlement(settlement) {
  if (!settlement) return null;
  const clone = cloneJson(settlement);
  if (clone && typeof clone === 'object') delete clone.versionHistory;
  return clone;
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
export function pickleCampaignState(state, { now = null } = {}) {
  return {
    phase:         state.phase || 'draft',
    eventLog:      Array.isArray(state.eventLog) ? [...state.eventLog] : [],
    systemState:   state.systemState ? deepClone(state.systemState) : null,
    locks:         state.locks ? { ...state.locks } : {},
    generatedAt:   state.generatedAt || null,
    editedAt:      now || new Date().toISOString(),
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
/**
 * The SESSION-ONLY uncanonize-tombstone identity key (Wave R-1, atlas queue #25).
 * uncanonize() irreversibly wiped the canon eventLog while the registry advertises
 * canonize as its inverse; the tombstone lets canonize restore the log WITHIN the
 * session when — and only when — it is the same world: same active save (or the
 * same unsaved draft), same settlement name, same generation stamp. The tombstone
 * lives in store state OUTSIDE every persistence whitelist (persist partialize +
 * pickleCampaignState), so it dies with the session by construction — across
 * reload the pair honestly stays 'action-partial', exactly what the operation
 * registry claims.
 * @param {{ activeSaveId?: unknown, settlement?: { name?: string }|null, generatedAt?: string|null }} state
 * @returns {string}
 */
export function uncanonizeTombstoneKey(state) {
  return [
    state.activeSaveId != null ? String(state.activeSaveId) : '',
    state.settlement?.name || '',
    state.generatedAt || '',
  ].join('::');
}

/**
 * Wave R-1 (atlas queue #4 / VI.10 #148): the type-the-name confirm gate for the
 * registry-reachable settlement-death lane. The composer lane demands typing the
 * settlement's name (ApplyControls §9c) and the realm lane demands staged-proposal
 * review; `destroySavedSettlement` demanded nothing. Returns a refusal ActionResult
 * when the confirm is missing or wrong, or null to proceed. An unknown save id
 * returns null so the action's existing not-found envelope stays the answer there.
 * Nameless saves fall back to the save id, so the gate never fails open. The gate
 * sits at the action boundary because the operations/command registry is that
 * lane's only surface (no component calls it).
 * @param {{ savedSettlements?: Array<{ id?: unknown, name?: string, settlement?: { name?: string } }> }} state
 * @param {{ id: string|number, reason: string, confirmName?: string }} args
 * @returns {ReturnType<typeof makeActionResult>|null}
 */
export function destroySettlementConfirmRefusal(state, { id, reason, confirmName }) {
  const doomed = (state.savedSettlements || []).find(s => String(s.id) === String(id));
  if (!doomed) return null;
  const expectedName = String(doomed.settlement?.name || doomed.name || '').trim() || String(id);
  if (String(confirmName ?? '').trim() === expectedName) return null;
  return makeActionResult('destroySavedSettlement', {
    ok: false,
    before: { id: String(id), reason },
    userMessage: 'Destroying a settlement is a one-way canon act: pass its exact name as confirmName to confirm. Nothing was changed.',
  });
}

/**
 * updateSavedSettlement patch-key allowlist — Wave R-3 (atlas VI.12 #163b).
 * THE CENSUS IS THE CONTRACT: exactly the top-level keys the writer's 21 real
 * call sites patch today — settlementSlice lifecycle folds x6 (settlement /
 * campaignState / timestamp / aiData), aiSlice narrative writes x9 (aiData),
 * ShareToGallery share metadata x6 (the is_public / slug / visibility /
 * gallery_* family). A NEW patch key must be added here deliberately; an
 * unlisted key is a typed refusal at the writer plus a dev-mode error, never a
 * silent save-row widening. (Sibling writers updateSavedCampaign/updateConfig
 * get the same cure in their own slices — the R-3 three-member class.)
 */
export const SAVED_SETTLEMENT_PATCH_KEYS = Object.freeze([
  'settlement', 'campaignState', 'timestamp', 'aiData',
  'is_public', 'public_slug', 'visibility', 'unlisted_slug',
  'gallery_description', 'gallery_title', 'gallery_image_url', 'gallery_image_alt',
  'gallery_tags', 'gallery_share_dm', 'gallery_share_narrated', 'gallery_importable',
  'gallery_member_overrides',
]);

/**
 * Non-empty array of refused patch keys, or null when the patch is clean.
 * The dev-mode error lives here so every refusal is loud in development while
 * production stays a silent typed refusal (the envelope carries the keys).
 * @param {Object|null|undefined} partial
 * @returns {string[]|null}
 */
export function unknownSavedSettlementPatchKeys(partial) {
  const unknown = Object.keys(partial || {}).filter(
    key => !SAVED_SETTLEMENT_PATCH_KEYS.includes(key),
  );
  if (unknown.length === 0) return null;
  if (import.meta.env?.DEV) {
    console.error('[settlementSlice] updateSavedSettlement refused unknown patch keys:', unknown);
  }
  return unknown;
}

/**
 * THE LOCK-SURVIVES-ITS-OWN-REGEN STEP (locks engine Phase A, lifecycle: REGEN).
 *
 * regenNPCsPipeline reports which keepers survived and which ids they inherited.
 * A locked `npc_3` that took over slot `npc_7` leaves the lock naming whoever the
 * roll put in `npc_3` — a stranger. Rewriting the map here, inside the same `set()`
 * that folds the new roster in, is what stops the lock ghosting on the second
 * reroll. Dormant by construction: no report, or nothing moved, and the draft is
 * not written at all.
 *
 * @param {{ locks?: Record<string, any> }} state  the Immer draft
 * @param {{ preserved?: Array<{id?: string, fromId?: string}> }|null|undefined} preservation
 */
export function remapLocksAfterRegen(state, preservation) {
  const current = state.locks || {};
  const next = remapNpcLocks(current, preservation?.preserved);
  if (next !== current) state.locks = next;
}

/**
 * THE FULL-GENERATE LOCK TAIL (locks engine Phase B, lifecycle: GENERATE).
 *
 * The engine's `carryLockedRosterThroughGenerate` has already carried the locked
 * characters bodily into the new town and reported which fresh slot each one
 * landed on. This rewrites the map to match: locked NPC ids become the ids their
 * subjects inherited, a locked id nothing preserved is pruned, and the name-keyed
 * faction / institution arrays plus every boolean are kept. Dormant by
 * construction — an untouched map is never written back to the draft.
 *
 * This helper takes the REPORT, never the engine: settlementSliceHelpers must stay
 * free of generator imports or the lazy engine chunk re-parents into first paint.
 *
 * @param {{ locks?: Record<string, any> }} state  the Immer draft
 * @param {{ preserved?: Array<{id?: string, fromId?: string}> }|null|undefined} preservation
 */
export function remapLocksAfterGenerate(state, preservation) {
  const current = state.locks || {};
  const next = locksAfterFullGenerate(current, preservation?.preserved);
  if (next !== current) state.locks = next;
}

/**
 * THE LOCK PERSIST (locks engine Phase A, lifecycle: PERSIST).
 *
 * Before this, `state.locks` was durable ONLY BY PIGGYBACK: it rides inside
 * `campaignState`, so it reached the cloud whenever some OTHER canon-path write
 * happened to pickle the slice, and a session that set a lock and then reloaded
 * lost it. setLock/clearLocks now adopt regenSection's own persist pattern
 * (settlementSlice regenSection tail): stamp editedAt, update the in-memory save
 * entry, and durably write the re-derived campaignState.
 *
 * `campaignState` and `timestamp` are already in SAVED_SETTLEMENT_PATCH_KEYS above,
 * so this widens no allowlist. No settlement blob is written — a lock is intent
 * ABOUT the settlement, not a change to it.
 *
 * @param {() => any} get
 * @param {(fn: (draft: any) => void) => void} set
 * @returns {Promise<boolean>|undefined} the persist promise when there was a save to write
 */
export function persistLocksToActiveSave(get, set) {
  const saveId = get().activeSaveId;
  if (!saveId) return undefined;
  const now = new Date().toISOString();
  set(s => { s.editedAt = now; });
  const after = get();
  const campaignState = pickleCampaignState(after, { now });
  if (typeof after.updateSavedSettlement === 'function') {
    after.updateSavedSettlement(saveId, { campaignState, timestamp: now });
  }
  return persistSaveUpdate(saveId, { campaignState });
}

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
