/**
 * settlementRenameHelpers.js — the identity-edit + canon-lifecycle-by-id action
 * bodies adopted into settlementSlice (Wave 4a store composition, WS4 split).
 *
 * These are the always-allowed settlement-name edit + the Settlements-list
 * canonize affordance + the change-queue flavor/neighbour companions:
 *   • renameSettlementImpl         — the town rename (+ a canon flavor entry when
 *                                    the save is already canon).
 *   • canonizeSavedSettlementImpl  — canonize a saved settlement BY ID (list row).
 *   • recordCanonFlavorEntryImpl   — append a canon-only flavor timeline line.
 *   • syncActiveNeighbourFieldsImpl — flush-only neighbour-field reconcile.
 *   • renameFactionImpl            — the CONVERGED faction rename (queue #14).
 *                                    ASYNC: it fetches its cascade module at the
 *                                    call seam to keep it off first paint.
 *
 * The NPC rename stays INLINE in settlementSlice (renameNPC) — it writes one
 * field on one entity and needs no cascade. The FACTION rename moved here when
 * it gained one: it now walks eleven name-keyed surfaces plus every neighbour
 * save, which is an action body, not a two-line write, and settlementSlice sits
 * at its frozen max-lines ceiling.
 *
 * Wave 4a composition note: recordCanonFlavorEntry and syncActiveNeighbourFields
 * consult `get().flushSuppressPersist`, and renameSettlement defers its cloud
 * write while that flag is set. OUR store does not yet mount the change-queue flush
 * (proposeChange/applyChange + changeQueueSlice land in a follow-up), so
 * flushSuppressPersist reads `undefined` (falsy) and these actions behave as
 * correct, un-suppressed direct writes — exactly the standalone semantics. When the
 * change-queue lands, the same reads pick up the suppression with no change here.
 *
 * They hold no store state: each takes the slice's `get`/`set` pair. The module
 * never imports settlementSlice, so there is no cycle.
 */
import { cloneJson, persistSaveUpdate } from './settlementSliceHelpers.js';

// NO STATIC IMPORT OF ../domain/factionRename.js — see the FIRST-PAINT note on
// renameFactionImpl. This module is reached from the EAGER settlementSlice, so a
// static edge here drags the whole cascade (~8.6 kB minified) into the entry's
// first-paint closure. It is fetched at the action seam instead.

// RETIRED (R-5b, owner queue #21): `syncActiveNeighbourFieldsImpl` and its store
// wrapper `syncActiveNeighbourFields`. DEAD IN BOTH HALVES — neither the Impl nor
// the registered action had a caller anywhere in src. It was also unreachable by
// construction: its first line returned unless `get().flushSuppressPersist` was
// truthy, and the change-queue flush that would set that flag was never mounted
// (see the composition note above). A permanent no-op behind an unmounted flag,
// registered as a real operation. If the change-queue flush lands and needs this
// reconcile, it is six lines written against a live caller instead of ahead of one.

/**
 * Rename a saved settlement (town). Unlike NPC/faction names, a settlement's own
 * name is NEVER canon-locked. Before canon it is a plain name edit; after canon
 * the rename is ALSO appended to the timeline as a RENAME_SETTLEMENT flavor entry
 * (flavor only — no systemState delta, no entity mutation, no PRNG draw).
 * undoLastEvent leaves that chronicle row in place and reaches past it to the
 * newest mechanical event.
 * Honours the flush-suppression invariant: a change-queue flush owns the single
 * atomic commit, so the row's cloud write is deferred while suppressed.
 *
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @param {string|number} id
 * @param {string} newName
 * @returns {boolean} true when a canon flavor entry was recorded.
 */
export function renameSettlementImpl(get, set, id, newName) {
  const trimmed = String(newName || '').trim();
  if (!trimmed) return false;
  const now = new Date().toISOString();
  let recorded = false;
  let persist = null;
  set(state => {
    const idx = state.savedSettlements.findIndex(s => String(s.id) === String(id));
    const isActive = String(state.activeSaveId || '') === String(id);
    const save = idx !== -1 ? state.savedSettlements[idx] : null;
    const oldName = save?.settlement?.name || save?.name
      || (isActive ? state.settlement?.name : '') || '';
    if (trimmed === oldName) return;
    const currentCampaignState = save?.campaignState
      || (isActive ? { phase: state.phase, eventLog: state.eventLog } : {});
    const isCanon = (currentCampaignState.phase || (isActive ? state.phase : 'draft')) === 'canon';

    const eventLog = Array.isArray(currentCampaignState.eventLog)
      ? [...currentCampaignState.eventLog]
      : [];
    // Keep the per-settlement before/after stamp for save-shape compatibility.
    // The explicit flavor marker below now owns undo eligibility: the shared
    // planner leaves this row in history and searches beneath it.
    const rowSystemState = (isActive ? state.systemState : currentCampaignState.systemState) || null;
    if (isCanon) {
      eventLog.push({
        id: `rename.${id}.${Date.now()}`,
        type: 'RENAME_SETTLEMENT',
        targetId: oldName || null,
        timestamp: now,
        // Flavor only: a recorded line of in-world history, no afterState delta.
        narrativeSummary: oldName
          ? `${oldName} is now known as ${trimmed}.`
          : `The settlement is now known as ${trimmed}.`,
        // Shared with recordCanonFlavorEntryImpl so every flavor row is skipped
        // through one predicate.
        flavor: true,
        ...(rowSystemState ? { beforeState: rowSystemState, afterState: rowSystemState } : {}),
      });
      recorded = true;
    }

    if (save) {
      const nextSettlement = { ...(save.settlement || {}), name: trimmed };
      const campaignState = isCanon
        ? { ...currentCampaignState, phase: currentCampaignState.phase || 'canon', eventLog, editedAt: now }
        : save.campaignState;
      state.savedSettlements[idx] = {
        ...save,
        name: trimmed,
        settlement: nextSettlement,
        ...(isCanon ? { campaignState, timestamp: now } : {}),
      };
      persist = {
        // The row `name` COLUMN — the in-memory entry sets name:trimmed above, but
        // the persist partial omitted it, so the cloud row kept the OLD name forever
        // and the library list / campaign folders / blob-less meta list all showed
        // the pre-rename name after reload (store-hooks-state-5 / state-lifecycle-1).
        // supabaseUpdate maps partial.name -> updates.name only when present.
        name: trimmed,
        settlement: cloneJson(nextSettlement),
        ...(isCanon ? { campaignState: cloneJson(campaignState), timestamp: now } : {}),
      };
    }

    if (isActive && state.settlement) {
      state.settlement = { ...state.settlement, name: trimmed };
      if (isCanon) {
        state.eventLog = eventLog;
        state.editedAt = now;
      }
    }
  });
  // R2: a change-queue flush replays renameSettlement and owns the single
  // atomic commit, so defer this row's cloud write while suppressed.
  if (persist && !get().flushSuppressPersist) persistSaveUpdate(id, persist);
  return recorded;
}

/**
 * Record a CANON-only flavor entry on the active settlement's timeline,
 * generalizing the RENAME_SETTLEMENT precedent so every committed change-queue
 * order leaves a chronicle line. Flavor-only (no systemState delta, no entity
 * mutation, no PRNG draw); stamps the current systemState as beforeState/
 * afterState for save-shape compatibility, while undoLastEvent uses the flavor
 * marker to leave it in history and target a real event beneath it. No-op unless
 * the active settlement is in canon phase. Does NOT persist on its own — the
 * caller (flush) owns the single atomic commit; the mutated eventLog rides along
 * in that save's campaignState.
 *
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @param {{ type: string, narrativeSummary: string, targetId?: string|null,
 *   source?: string|null, sourceIntentId?: string|null }} entry
 * @returns {boolean} true when an entry was appended.
 */
export function recordCanonFlavorEntryImpl(get, set, {
  type,
  narrativeSummary,
  targetId = null,
  source = null,
  sourceIntentId = null,
}) {
  if (get().phase !== 'canon') return false;
  const now = new Date().toISOString();
  let recorded = false;
  set(state => {
    if (state.phase !== 'canon' || !Array.isArray(state.eventLog)) return;
    state.eventLog.push({
      id: `flavor.${type}.${Date.now()}.${state.eventLog.length}`,
      type,
      targetId,
      timestamp: now,
      // R-1 provenance: table-authored chronicle lines carry source:'table' so
      // receipts distinguish table- from world-authored history (the soak
      // excludes 'table'). Additive — omitted when null, so every existing
      // caller's entry is byte-identical.
      ...(source ? { source } : {}),
      // Optional queue correlation. Existing non-queue flavor entries retain
      // their byte-for-byte shape.
      ...(sourceIntentId ? { sourceIntentId } : {}),
      // Flavor only — a recorded line of in-world history, no afterState delta.
      narrativeSummary,
      // A flavor entry carries no real state transition. Keep the legacy state
      // stamps, but mark it so undo skips the row without deleting it.
      flavor: true,
      beforeState: state.systemState,
      afterState: state.systemState,
    });
    state.editedAt = now;
    recorded = true;
  });
  return recorded;
}

/**
 * Canonize a saved settlement BY ID — the Settlements-list affordance. Mirrors
 * canonize()'s semantics exactly: phase→canon, the draft event log resets to an
 * empty timeline, and canonizedAt is stamped. If the save is the one currently
 * loaded, the live slice is kept in sync. No-ops on a missing or already-canon
 * save. Returns whether anything changed.
 *
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @param {string|number} id
 * @returns {boolean}
 */
export function canonizeSavedSettlementImpl(get, set, id) {
  const now = new Date().toISOString();
  let changed = false;
  let fromPhase = 'draft';
  let campaignStateOut = null;
  let settlementSnapshot = null;
  set(state => {
    const idx = state.savedSettlements.findIndex(s => String(s.id) === String(id));
    if (idx === -1) return;
    const save = state.savedSettlements[idx];
    const current = save.campaignState || {};
    fromPhase = typeof current.phase === 'string' ? current.phase : 'draft';
    if (fromPhase === 'canon') return; // already canon — nothing to do
    const campaignState = { ...current, phase: 'canon', eventLog: [], canonizedAt: now, editedAt: now };
    state.savedSettlements[idx] = { ...save, campaignState, timestamp: now };
    if (String(state.activeSaveId || '') === String(id)) {
      state.phase = 'canon';
      state.eventLog = [];
      state.canonizedAt = now;
    }
    changed = true;
    campaignStateOut = cloneJson(campaignState);
    settlementSnapshot = save.settlement ? cloneJson(save.settlement) : null;
  });
  if (!changed) return false;
  // Single persist path — the campaign_state column carries canon; the panel's
  // savedSettlements subscription refreshes the row, so no optimistic re-read.
  persistSaveUpdate(id, { campaignState: campaignStateOut, timestamp: now });
  // Analytics — fire-and-forget, identical to canonize().
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.CANON_PHASE_CHANGED, { from_phase: fromPhase, to_phase: 'canon' });
  }).catch(() => {});
  if (settlementSnapshot) {
    import('../lib/researchCapture.js').then(({ captureFingerprint }) => {
      captureFingerprint('canonized', settlementSnapshot, { settlementUuid: String(id) });
    }).catch(() => {});
  }
  return true;
}

/**
 * THE CONVERGED FACTION RENAME (atlas presentation-scene gaps 1 / 1b / 2, owner
 * queue #14). One call now does what the two divergent lanes each did half of:
 *
 *   1. resolve on the CANONICAL `powerStructure.factions` list (legacy
 *      `settlement.factions` only as the pre-pipeline fallback) — the store
 *      lane's contribution, and the reason the gallery rename used to no-op on
 *      every generated settlement;
 *   2. cascade the new name through every in-settlement surface enumerated in
 *      domain/factionRename.js FACTION_RENAME_SURFACES, dual-writing `.faction`
 *      and `.name` so no reader sees a half-renamed record;
 *   3. cascade into every NEIGHBOUR save whose links point back at this
 *      settlement — the library lane's contribution;
 *   4. persist the active save and each touched neighbour row, then hand the
 *      ai_data narrative to its own registered writer (applyCosmeticRename).
 *
 * Canon-locked: faction names freeze at canonization, matching renameNPC. The
 * caller sees a typed-ish result rather than a bare boolean because the queue
 * writer needs the OLD name for its receipt.
 *
 * DELIBERATELY DEFERRED — documented, not a bug to re-find. UNDO IS
 * SINGLE-SAVE. When this rename is committed through the pending-edits queue,
 * the Change Dock's snapshot undo (revertToSnapshot, settlementSlice) reads ONE
 * save's versionHistory and restores ONE settlement. The neighbour rows this
 * function rewrote keep the NEW name after that undo, and the compensating
 * action is to rename back. Widening undo to span saves means a cross-save
 * snapshot, which is a persistence-shape change and owner-gated. This is not a
 * regression: the library lane cascaded to neighbours with no undo at all, so
 * the host settlement gaining one is strictly more recovery than existed.
 *
 * FIRST-PAINT: ASYNC BY CONSTRUCTION (2026-07-28). domain/factionRename.js is a
 * ~8.6 kB minified cascade whose only eager path into the bundle was the static
 * import this module used to carry, so the whole surface census rode the entry
 * chunk for every visitor who never renames anything. It is now fetched at the
 * call seam — the same idiom settlementSlice uses for loadEngine and
 * setPrimaryDeity — which makes this function return a PROMISE. That is sound
 * here and nowhere near a hot path: a faction rename is an explicit, one-at-a-
 * time user action, already routed through the staged-change queue. The await
 * happens AFTER the two cheap refusals (so a refused call fetches nothing) and
 * BEFORE any work begins, so every cascade call below is byte-identical and
 * still fully synchronous inside the Immer producer. The producer's own
 * re-resolve guard (`target.currentName !== oldName`) was already the defense
 * against the roster moving under this call, and it now also covers the await
 * window: a concurrent write can only make this rename REFUSE, never misfire.
 *
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @param {number} factionIndex  position in the resolved faction list
 * @param {string} newName
 * @returns {Promise<{ changed: boolean, oldName: string|null, newName: string|null,
 *   touched: string[], modifiedSaveIds: string[] }>}
 */
export async function renameFactionImpl(get, set, factionIndex, newName) {
  const idle = { changed: false, oldName: null, newName: null, touched: [], modifiedSaveIds: [] };
  const trimmed = String(newName || '').trim();
  const before = get();
  // Campaign-clock identity lock: faction names freeze at canonization.
  if (!trimmed || before.phase === 'canon') return idle;
  const {
    applyFactionRenameToPartner,
    applyFactionRenameToSettlement,
    resolveFactionForRename,
  } = await import('../domain/factionRename.js');
  // Re-read after the await: `before` is a pre-fetch snapshot, and resolving
  // against the CURRENT settlement is what keeps the oldName this call commits
  // to honest.
  const resolved = resolveFactionForRename(get().settlement, factionIndex);
  if (!resolved || resolved.currentName === trimmed) return idle;
  const oldName = resolved.currentName;

  /** @type {string[]} */
  let touched = [];
  // RAW save ids, not stringified: applyCosmeticRename matches with `===`, so a
  // stringified numeric id would silently skip the narrative cascade.
  /** @type {any[]} */
  const modifiedSaves = [];
  set(state => {
    // Re-resolve inside the producer: the index is only a stable target for as
    // long as the roster has not moved under a concurrent write.
    const target = resolveFactionForRename(state.settlement, factionIndex);
    if (!target || target.currentName !== oldName) return;
    const result = applyFactionRenameToSettlement(state.settlement, oldName, trimmed);
    if (!result.changed) return;
    touched = result.touched;
    const hostName = String(state.settlement?.name || '');
    const activeId = String(state.activeSaveId || '');
    const saves = Array.isArray(state.savedSettlements) ? state.savedSettlements : [];
    for (let i = 0; i < saves.length; i += 1) {
      const save = saves[i];
      if (!save || String(save.id) === activeId) continue;
      const next = applyFactionRenameToPartner(save.settlement, hostName, oldName, trimmed);
      if (!next.changed) continue;
      saves[i] = { ...save, settlement: next.settlement };
      modifiedSaves.push(save.id);
    }
  });
  if (!touched.length) return idle;

  get().persistActiveSaveEdit?.();
  // Read the finalized rows back out of the store rather than closing over the
  // Immer drafts: a draft is revoked the moment its producer returns, so
  // cloning one here would throw.
  const after = get();
  for (const saveId of modifiedSaves) {
    const row = (after.savedSettlements || []).find(s => String(s?.id) === String(saveId));
    if (row?.settlement) persistSaveUpdate(row.id, { settlement: cloneJson(row.settlement) });
  }
  // AI-2 cosmetic tier: the narrative blob is renamed by its own registered
  // operation, which no-ops on a save with no narrative. The active save is
  // included because its ai_data is a sibling column, not part of the
  // settlement blob persistActiveSaveEdit just wrote.
  const activeSaveId = after.activeSaveId;
  const cosmeticTargets = activeSaveId != null
    ? [activeSaveId, ...modifiedSaves]
    : modifiedSaves;
  for (const saveId of cosmeticTargets) {
    get().applyCosmeticRename?.({ saveId, oldName, newName: trimmed });
  }
  return {
    changed: true,
    oldName,
    newName: trimmed,
    touched,
    modifiedSaveIds: modifiedSaves.map(String),
  };
}
