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
 * Events that write a SECOND settlement row. This undo is settlement-scoped: it
 * can reverse the active save and nothing else. Reversing one endpoint of a user
 * route would therefore leave exactly the half-edge migration 193 exists to make
 * unrepresentable, so these types are a hard barrier rather than a partial undo.
 *
 * DELIBERATELY DEFERRED (documented, not a bug to re-find): a bilateral undo is a
 * second command with its own journal identity and its own two-row transaction.
 * The domain inverse already exists and is pinned per endpoint
 * (tests/domain/events/undoRoundTrip.test.js); what is missing is the transaction
 * that applies it to both rows at once.
 */
const BILATERAL_EVENT_TYPES = new Set(['CREATE_ROUTE']);

/**
 * Locate the event an Undo command may actually reverse.
 *
 * Flavor rows are durable chronicle records, not state transitions. They stay
 * in the timeline while the search walks past them. The first non-flavor row
 * is a barrier: it is undoable only when it carries the pre-event state needed
 * by undoLastEvent; otherwise callers must refuse rather than reach further
 * back and reorder mechanical history.
 *
 * @param {any[]} eventLog
 * @returns {{ok:boolean, targetIndex:number, skippedFlavorEntries:number, reason:string|null}}
 */
export function planTimelineUndo(eventLog) {
  const log = Array.isArray(eventLog) ? eventLog : [];
  let targetIndex = log.length - 1;
  while (targetIndex >= 0 && log[targetIndex]?.flavor === true) targetIndex -= 1;
  const skippedFlavorEntries = log.length - 1 - targetIndex;
  if (targetIndex < 0) {
    return { ok: false, targetIndex: -1, skippedFlavorEntries, reason: 'no_undoable_entry' };
  }
  if (log[targetIndex]?.beforeState === undefined) {
    return { ok: false, targetIndex, skippedFlavorEntries, reason: 'entry_not_undoable' };
  }
  if (BILATERAL_EVENT_TYPES.has(String(log[targetIndex]?.event?.type || ''))) {
    return {
      ok: false,
      targetIndex,
      skippedFlavorEntries,
      reason: 'entry_not_undoable_bilateral',
    };
  }
  return { ok: true, targetIndex, skippedFlavorEntries, reason: null };
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
 * THE MISSING-TARGET SNAPSHOT REFUSAL (Track K §C1 envelope honesty).
 *
 * recordSnapshot resolves its target as `opts.saveId || activeSaveId`, and the
 * save chokepoints stamp activeSaveId on a row the savedSettlements cache does not
 * hold yet (setActiveSaveId's header explains the byte constitution behind that,
 * and activeSaveId is outside the persist partialize, so the window is not a
 * hydration blip — a post-save Create session sits in it). With no row there is no
 * timeline to append to and nothing to persist, so `ok` must say so: the envelope
 * used to report ok:true carrying an `after.snapshotId` for a snapshot that exists
 * nowhere, and commitPendingEditScope mints its batch undo token off exactly that
 * field. `after` stays null — an id nothing recorded is the thing to withhold.
 *
 * @param {string|number} targetSaveId
 * @returns {ReturnType<typeof makeActionResult>}
 */
export function snapshotTargetMissingRefusal(targetSaveId) {
  return makeActionResult('recordSnapshot', {
    ok: false,
    before: { targetSaveId: String(targetSaveId), timeline: 'saved', reason: 'save_not_loaded' },
    userMessage: 'This settlement is not open in the library yet, so no snapshot was recorded.',
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
 * THE PIN-SURVIVES-ITS-OWN-REGEN STEP (lifecycle: REGEN) — the aiData twin of
 * remapLocksAfterRegen.
 *
 * `aiData.pinnedNpcs` is the SECOND npc-id-keyed store a roster reroll can strand,
 * and the only one that crosses a persistence boundary: the pins live on the save
 * row, ride every narrative request (aiSlice's pinned-NPC header), and reach
 * Supabase. A preserved keeper does not rejoin the roster, it TAKES OVER a fresh
 * slot and inherits that slot's id — so a pin left naming the old id protects
 * whoever the roll put there and stops protecting the character the DM pinned.
 *
 * ONE ALGEBRA, not two: a pin list is the same id-keyed shape as `locks.npcs`, so
 * it goes through `remapNpcLocks` under an `npcs` key rather than growing a second
 * remap rule that can drift from the first. Unknown ids are therefore left alone
 * for the reason that leaf documents (a revert can restore an older blob whose
 * roster ids match the pins again).
 *
 * WHY THIS HAS NO GENERATE TWIN: a full generate mints a NEW town and resets
 * activeSaveId to null without touching any save row, so the previous save keeps
 * both its own roster and its own pins — remapping them there would break the
 * correct pins rather than fix stale ones.
 *
 * Dormant by construction: no active save, no pins, or nothing moved, and neither
 * the draft nor the network is touched. The write rides `aiData` through
 * persistSaveUpdate — already on the outbox column map and on
 * SAVED_SETTLEMENT_PATCH_KEYS — so it widens no allowlist and mints no schema.
 *
 * @param {() => any} get
 * @param {(fn: (draft: any) => void) => void} set
 * @param {{ preserved?: Array<{id?: string, fromId?: string}> }|null|undefined} preservation
 * @returns {Promise<boolean>|undefined} the persist promise when pins actually moved
 */
export function remapPinnedNpcsAfterRegen(get, set, preservation) {
  const saveId = get().activeSaveId;
  if (!saveId) return undefined;
  const entry = (get().savedSettlements || []).find(e => String(e.id) === String(saveId));
  const pinned = entry?.aiData?.pinnedNpcs;
  if (!Array.isArray(pinned) || pinned.length === 0) return undefined;
  // The dormancy contract is by REFERENCE: remapNpcLocks hands back the very
  // wrapper it was given when no locked id moved.
  const wrapper = { npcs: pinned };
  const remapped = remapNpcLocks(wrapper, preservation?.preserved);
  if (remapped === wrapper) return undefined;
  const nextAiData = { ...(entry.aiData || {}), pinnedNpcs: remapped.npcs };
  set(s => {
    const idx = s.savedSettlements.findIndex(e => String(e.id) === String(saveId));
    if (idx !== -1) s.savedSettlements[idx].aiData = nextAiData;
  });
  return persistSaveUpdate(saveId, { aiData: nextAiData });
}

/**
 * THE DRAFT-TIMELINE HAND-OFF (lifecycle: CREATE) — the body of setActiveSaveId.
 *
 * An unsaved session records its snapshots into the `draftVersionHistory` sibling
 * (recordSnapshot with no saveId). Saving to the library minted the new row with
 * `versionHistory: []` and the draft timeline then died at the next identity reset,
 * so every checkpoint a DM took while building a town was destroyed by the act of
 * keeping the town. This carries them across.
 *
 * IT LIVES HERE, NOT IN THE COMPONENTS: there are three create chokepoints (the
 * wizard's Save to Library, BuyThisDossier's save-it-first rung, the surveyor's
 * construction panel) plus the post-signup SAVE_SETTLEMENT intent, and all of them
 * already funnel through setActiveSaveId to stamp the new id. Putting the hand-off
 * inside the store action means a fourth chokepoint inherits it for free, which is
 * exactly what the four-way split cost the FIRST time.
 *
 * GATED ON THE TRANSITION, not merely on a non-empty draft: only a stamp made while
 * `activeSaveId` is still null is a draft becoming a save. Re-stamping between two
 * existing saves must never pour one row's history into another.
 *
 * THE WRITE IS persistSaveUpdate, NOT updateSavedSettlement, for two independent
 * reasons: `versionHistory` is deliberately absent from SAVED_SETTLEMENT_PATCH_KEYS
 * (the patch writer would refuse it), and the freshly-saved row is not in the
 * savedSettlements cache yet anyway (see setActiveSaveId's byte-constitution note) —
 * it arrives with its timeline on the next hydration.
 *
 * THE CONSEQUENCE, ACCEPTED: a transferred snapshot predates the save, so reverting
 * to one after saving rewrites the row with pre-save content. That is what a
 * timeline is for, and revertToSnapshot records a `pre-revert` checkpoint first, so
 * the post-save state is recoverable rather than overwritten.
 *
 * @param {() => any} get
 * @param {(fn: (draft: any) => void) => void} set
 * @param {string|number|null|undefined} saveId the id savesService.save() returned
 * @returns {Promise<boolean>|undefined} the transfer's persist promise, when one ran
 */
export function bindActiveSaveId(get, set, saveId) {
  if (saveId == null) return undefined;
  const draftTimeline = get().draftVersionHistory;
  const transfers = get().activeSaveId == null
    && Array.isArray(draftTimeline) && draftTimeline.length > 0;
  const versionHistory = transfers ? cappedVersionHistory(cloneJson(draftTimeline)) : null;
  set(state => {
    state.activeSaveId = saveId;
    // Cleared in the SAME set() that stamps the id: a draft timeline surviving
    // alongside a bound save id is a second, unreachable history the pending-edit
    // owner scope has already stopped resolving receipts against.
    if (transfers) state.draftVersionHistory = [];
  });
  return transfers ? persistSaveUpdate(saveId, { versionHistory }) : undefined;
}

/**
 * THE ROSTER FOLD — the one step that lands a reroll's three outputs together.
 *
 * regenNPCsPipeline returns the new roster PARTS plus an out-of-band preservation
 * report, and two separate id-keyed maps depend on that report: `state.locks` and
 * the active save's `aiData.pinnedNpcs`. Folding them from one place is what keeps
 * "the roster moved but its map did not" impossible — the roster and the lock map
 * land in a single `set()`, and the pin remap follows immediately with its own
 * durable write (the pin is save-row state, so an in-memory-only rewrite would
 * ghost on reload).
 *
 * @param {() => any} get
 * @param {(fn: (draft: any) => void) => void} set
 * @param {Record<string, any>} parts  the regenerated roster fields
 * @param {{ preserved?: Array<{id?: string, fromId?: string}> }|null|undefined} preservation
 * @returns {Promise<boolean>|undefined} the pin persist promise when pins moved
 */
export function foldRegeneratedRoster(get, set, parts, preservation) {
  set(s => { Object.assign(s.settlement, parts); remapLocksAfterRegen(s, preservation); });
  return remapPinnedNpcsAfterRegen(get, set, preservation);
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
