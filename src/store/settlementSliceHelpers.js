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
import { persistCampaignState, persistSaveUpdate } from './campaignSliceShared.js';

// A+ P0.1: persistSaveUpdate is UNIFIED. The canon settlement path (applyEvent,
// undoLastEvent, recordSnapshot, revertToSnapshot, destroySavedSettlement) imports
// persistSaveUpdate from here; re-exporting the single failure-reporting impl from
// campaignSliceShared means those writes report cloud-save failures into
// campaignSyncError (the CampaignSyncBanner) instead of silently console.warn-ing
// and drifting from Supabase. There must be exactly ONE persistSaveUpdate definition.
export { persistSaveUpdate } from './campaignSliceShared.js';
// `loadSettlementContentRuntimeOptions` is NOT re-exported here any more. This
// leaf is EAGER, so a re-export kept settlementContentRuntime.js statically
// reachable from the entry chunk no matter which lazy module actually used it.
// Its one consumer is the generation lane, which now imports it directly, and
// the module leaves first paint with the lane.
// The LOCKS ENGINE read side (domain/locksPreservation.js), re-exported through this
// leaf so settlementSlice keeps its single helper import home and gains no new static
// import of its own — the eager-closure rule the lock leaf's header explains.
export { sectionLocked, carryLockedSections } from '../domain/locksPreservation.js';
// ⛔ THE CREATE BOUNDARY (ODQ §822) IS NOT RE-EXPORTED HERE ANY MORE, AND THE
// REASON IS THE ONE THE `loadSettlementContentRuntimeOptions` NOTE ABOVE GIVES.
// This leaf is EAGER, and the re-export was this file's SOLE static edge into
// `domain/density/densityCreateBoundary.js` — so the boundary module sat in
// src/main.jsx's static closure no matter which lazy module actually called it.
// MEASURED (lane L-MAT): its only consumer is the generation lane
// (settlementGenerateAction.js), which is itself reached only through
// settlementSlice.js's dynamic import, and the realm composer already imported
// the boundary directly. Moving the lane to a direct import takes the main.jsx
// closure 239 -> 238 modules and drops the boundary out of it; `densityLaw.js`
// stays eager on its own engine-core path, so the density law costs the same.
// The size-ratchet reason the locks re-export above exists does NOT apply: the
// consumer here is the LANE, not `settlementSlice.js`, and the lane carries no
// size-baseline row at all.

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
    // THE WORLD IS NOW A ROW IN THE ACCOUNT'S LIBRARY, so it stops being this
    // device's anonymous draft. Deliberately NOT gated on `transfers`: that
    // transition is about a draft TIMELINE, while this is about a save existing
    // at all, and a save made from a world with no snapshots is just as much the
    // account's. See claimSettlementForAccount for why one field beats a flag.
    claimSettlementForAccount(state);
  });
  return transfers ? persistSaveUpdate(saveId, { versionHistory }) : undefined;
}

/**
 * claimSettlementForAccount — the world in the editor became THIS ACCOUNT'S, so
 * its origin stamp says so from here on (store/persistProjection.js reads it and
 * stops writing the device's anonymous-draft envelope for it).
 *
 * A world born anonymous is persisted as this device's draft. Saving it, opening
 * it from the library, and making it canon while signed in are the same act in
 * product terms: a deliberate one that makes the world the account's. After it
 * the device must stop offering that world to the next anonymous visitor — and
 * the design this replaced needed a separate sign-out-time bar (`signedInWorld`)
 * to arrange exactly that. Re-stamping the world keeps ONE fact in ONE place, on
 * the object it describes, where a swap replaces it and immer copies it forward.
 *
 * GUARDED ON A REAL USER, never on the tier: sign-out sets tier 'anon' while
 * leaving the world standing, and an anonymous visitor's own canon draft is
 * still the device's to keep.
 *
 * ⛔ IT WRITES A STORE-ROOT FIELD, NOT A KEY ON THE WORLD (ODQ §934.8). Stamping
 * the settlement would put a session fact into every save row and into the
 * observed-shape corpus, and an earlier cut of this helper that did so also had
 * to re-assign the whole object rather than write in place: at the hydrateFromSave
 * door the world is the plain — immer-FROZEN — object the cache holds, so an
 * in-place write throws "Cannot assign to read only property". A root field has
 * neither problem.
 *
 * @param {*} state the Immer store draft
 */
export function claimSettlementForAccount(state) {
  if (!state?.auth?.user || !state.settlement) return;
  state.draftOrigin = 'account';
}

/**
 * THE WORLD-IDENTITY STEP (lifecycle: REGEN) — the campaign twin of the two
 * settlement-scoped remaps above.
 *
 * `locks.npcs` and `aiData.pinnedNpcs` are SELECTIONS the user made about a
 * settlement. The campaign's `worldState` holds two more id-keyed homes for the
 * same people — `npcStates` (every roster member's simulation row: corruption,
 * exposures, momentum, rivalries) and the npcLedger's `originRef` — and NEITHER
 * was in this fold. `npcStates` was the worse of the two: its key stays live
 * across a reroll, so a dead person's corruption record silently became the
 * record of whichever stranger inherited the slot, invisible to `pruneNpcStates`
 * (the key never leaves the roster) and to any existence census (the row exists).
 * The algebra and the reason a keeper is re-keyed while everybody else is dropped
 * live in the pure leaf; this function is the reach.
 *
 * DYNAMIC IMPORT, on the npcVerbsSlice → npcVerbsBody precedent: the leaf pulls
 * the ledger's spatial graph, and this module is EAGER, so a static edge would
 * make every one of those bytes a first-paint byte for a step that runs only on a
 * roster reroll.
 *
 * SCOPED TO THE ACTIVE SAVE'S OWN CAMPAIGNS. npcStates keys are built from the
 * SAVE id, so a draft with no `activeSaveId` has no rows anywhere and returns
 * immediately — the same guard, for the same reason, that remapPinnedNpcsAfterRegen
 * carries. The fold runs INSIDE the `set()` so it reads the same draft it writes,
 * and the campaign write is persisted exactly like a DM verb's.
 *
 * Dormant by construction: a campaign whose world state holds nothing for this
 * settlement gets back the same reference and is never written.
 *
 * @param {() => any} get
 * @param {(fn: (draft: any) => void) => void} set
 * @param {{ preserved?: Array<{id?: string, fromId?: string, name?: string}> }|null|undefined} preservation
 * @returns {Promise<boolean>} true when a campaign world state actually moved
 */
export async function foldRegenIdentityAfterRegen(get, set, preservation) {
  const settlementId = String(get().activeSaveId || '');
  if (!settlementId) return false;
  const holds = (/** @type {any} */ c) => (c?.settlementIds || []).some((/** @type {any} */ id) => String(id) === settlementId);
  if (!(get().campaigns || []).some(holds)) return false;
  const { foldRegenIdentity } = await import('../domain/npc/regenIdentityFold.js');
  /** @type {string[]} */
  const movedIds = [];
  set(s => {
    for (const campaign of s.campaigns || []) {
      if (!holds(campaign) || !campaign.worldState) continue;
      const folded = foldRegenIdentity({
        worldState: campaign.worldState,
        settlementId,
        preserved: preservation?.preserved,
      });
      if (!folded.changed) continue;
      campaign.worldState = folded.worldState;
      movedIds.push(String(campaign.id));
    }
    // One persist for the whole fold. `changedId` is the hint the persist layer
    // uses to name the row it touched, so it is only honest with a single mover.
    if (movedIds.length > 0) persistCampaignState(s, movedIds.length === 1 ? movedIds[0] : null);
  });
  return movedIds.length > 0;
}

/**
 * THE ROSTER FOLD — the one step that lands a reroll's outputs together.
 *
 * regenNPCsPipeline returns the new roster PARTS plus an out-of-band preservation
 * report, and FOUR id-keyed homes depend on that report: `state.locks`, the active
 * save's `aiData.pinnedNpcs`, and — through foldRegenIdentityAfterRegen — the
 * owning campaign's `worldState.npcStates` and npcLedger `originRef`s. Folding them
 * from one place is what keeps "the roster moved but its map did not" impossible:
 * the roster and the lock map land in a single `set()`, the pin remap follows
 * immediately with its own durable write (the pin is save-row state, so an
 * in-memory-only rewrite would ghost on reload), and the world-identity step lands
 * in its own `set()` against the campaign it belongs to.
 *
 * @param {() => any} get
 * @param {(fn: (draft: any) => void) => void} set
 * @param {Record<string, any>} parts  the regenerated roster fields
 * @param {{ preserved?: Array<{id?: string, fromId?: string, name?: string}> }|null|undefined} preservation
 * @returns {Promise<boolean|undefined>} settles when the pin write and the
 *   world-identity fold have both landed; resolves to the pin persist's own result
 */
export function foldRegeneratedRoster(get, set, parts, preservation) {
  set(s => { Object.assign(s.settlement, parts); remapLocksAfterRegen(s, preservation); });
  const pins = remapPinnedNpcsAfterRegen(get, set, preservation);
  const identity = foldRegenIdentityAfterRegen(get, set, preservation);
  return Promise.all([pins, identity]).then(([pinned]) => pinned);
}

/**
 * THE FULL-GENERATE LOCK TAIL (locks engine Phase B, lifecycle: GENERATE).
 *
 * The engine's `carryLockedRosterThroughGenerate` has already carried the locked
 * characters bodily into the new town and reported which fresh slot each one
 * landed on. This rewrites the map to match: locked NPC ids become the ids their
 * subjects inherited, a locked id nothing preserved is pruned, and every other key
 * (the booleans, and any retired key an old save still carries) is kept verbatim. Dormant by
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
 * ⛔ THE LOCK PERSIST (`persistLocksToActiveSave`) IS RETIRED with its only caller, the
 * store's `setLock`, whose last controls (the NPCs and History section locks and the
 * roster-row padlock) the owner ordered removed on 2026-09-17. A save's stored lock
 * map still rides every other campaignState write through `pickleCampaignState`.
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
