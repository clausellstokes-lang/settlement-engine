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
 *
 * NPC / faction renames stay INLINE in settlementSlice (renameNPC / renameFaction)
 * — OUR slice already carries the canon-locked versions; they are not duplicated
 * here.
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
 * (flavor only — no systemState delta, no entity mutation, no PRNG draw); that
 * row stamps the settlement's own systemState so undoLastEvent pops it as a
 * no-op rather than jamming on it (see the per-lane note at the push site).
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
    // R-3 undo-safety (atlas VI.10 #148 follow-on). undoLastEvent inspects ONLY
    // the newest eventLog entry and refuses typed (`entry_not_undoable`) when it
    // carries no `beforeState`. An unstamped rename row parked on top of the log
    // therefore JAMMED undo for every real event beneath it, permanently — the
    // rename row can never be popped, so nothing below it can ever surface.
    // Stamp this settlement's own systemState as beforeState/afterState exactly
    // as recordCanonFlavorEntryImpl does below, and the row pops as a no-op
    // instead of blocking the stack.
    //
    // The stamp is chosen PER LANE because this one push feeds two destinations:
    // the live `state.eventLog` (when this save is the active one) and the saved
    // row's `campaignState.eventLog`. hydrateFromSave restores `cs.systemState`
    // alongside `cs.eventLog`, so a row written into a NON-ACTIVE save's log must
    // carry THAT save's snapshot; stamping the live one would swap a different
    // settlement's state in the moment that save is opened and the row undone.
    // When neither snapshot exists the field is omitted deliberately and the
    // `entry_not_undoable` refusal keeps guarding the row.
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
        // The same marker recordCanonFlavorEntryImpl sets, so a future undo
        // refinement can skip both flavor shapes through one predicate.
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
 * afterState so undoLastEvent pops it as a no-op. No-op unless the active
 * settlement is in canon phase. Does NOT persist on its own — the caller (flush)
 * owns the single atomic commit; the mutated eventLog rides along in that save's
 * campaignState.
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
      // R3 undo-safety: a flavor entry carries no real state transition. Stamp
      // the current systemState as beforeState so undoLastEvent's
      // `systemState = popped.beforeState` is a no-op, and mark it flavor so a
      // future undo refinement can skip it entirely.
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
