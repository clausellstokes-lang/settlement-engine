/**
 * settlementCanonHelpers.js — the canon-lifecycle action bodies extracted from
 * settlementSlice (WS4 decomposition).
 *
 * These four functions are the draft⇄canon lifecycle:
 *   • canonizeImpl / uncanonizeImpl — flip the LIVE settlement's phase.
 *   • canonizeSavedSettlementImpl   — canonize a saved settlement BY ID.
 *   • persistActiveSaveLifecycleImpl — flush the live lifecycle to the active save.
 *
 * They hold no store state: each takes the slice's `get`/`set` pair and mutates
 * the same fields (phase / eventLog / canonizedAt / savedSettlements) the inline
 * bodies did, then fires the same fire-and-forget analytics + research-capture.
 * Moving them here shrinks settlementSlice without any behaviour change — the
 * slice keeps thin action methods that delegate straight through, so the public
 * API (names, signatures, return values, persist ordering) is byte-identical.
 *
 * NOTE: none of these touch the crisis-twin directive tokens
 * (twinDirectiveForEvent / crisisTwinFor / crisisWithdraw), which the
 * crisisTripleSync structural pins require to stay referenced FROM
 * settlementSlice itself — those live in applyEvent / undoLastEvent, which
 * remain in the main file.
 *
 * The module never imports settlementSlice, so there is no cycle.
 */
import {
  cloneJson, persistSaveUpdate, pickleCampaignState,
} from './settlementSliceHelpers.js';

/**
 * Move the live settlement from draft to canon. Resets the event log to an
 * empty timeline starting now and stamps canonizedAt. Persists via the slice's
 * persistActiveSaveLifecycle so canon sticks across reload; fires
 * CANON_PHASE_CHANGED + a 'canonized' research fingerprint (both fire-and-forget).
 *
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @returns {void}
 */
export function canonizeImpl(get, set) {
  const fromPhase = get().phase;
  set(state => {
    state.phase = 'canon';
    state.eventLog = [];
    state.canonizedAt = new Date().toISOString();
  });
  // Persist so canon sticks across reload and the library reflects it.
  get().persistActiveSaveLifecycle?.();
  // Analytics — fire-and-forget. CANON_PHASE_CHANGED records the transition;
  // captureFingerprint('canonized') snapshots the structural shape at canon
  // (skips silently without a stable settlement uuid / consent).
  const after = get();
  const activeSaveId = after.activeSaveId || null;
  const save = activeSaveId
    ? after.savedSettlements.find(s => String(s.id) === String(activeSaveId))
    : null;
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.CANON_PHASE_CHANGED, { from_phase: fromPhase, to_phase: 'canon' });
  }).catch(() => {});
  if (after.settlement && activeSaveId) {
    import('../lib/researchCapture.js').then(({ captureFingerprint }) => {
      captureFingerprint('canonized', after.settlement, { save, settlementUuid: activeSaveId });
    }).catch(() => {});
  }
}

/**
 * Drop the live settlement back to draft. Discards any prior event log and
 * clears canonizedAt; persists + fires the canon→draft transition analytics.
 *
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @returns {void}
 */
export function uncanonizeImpl(get, set) {
  const fromPhase = get().phase;
  set(state => {
    state.phase = 'draft';
    state.eventLog = [];
    state.canonizedAt = null;
  });
  get().persistActiveSaveLifecycle?.();
  // Analytics — fire-and-forget; the canon→draft transition.
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.CANON_PHASE_CHANGED, { from_phase: fromPhase, to_phase: 'draft' });
  }).catch(() => {});
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
 * Persist the live lifecycle (phase / eventLog / canonizedAt) + settlement to
 * the active save, so deliberate lifecycle changes (canonize, uncanonize)
 * survive reload and the library reflects them. Mirrors applyEvent's persist.
 *
 * @param {Function} get  the slice's get()
 * @returns {void}
 */
export function persistActiveSaveLifecycleImpl(get) {
  const s = get();
  const activeSaveId = s.activeSaveId;
  if (!activeSaveId || !s.settlement) return;
  const campaignState = pickleCampaignState(s);
  const savePartial = {
    settlement: cloneJson(s.settlement),
    campaignState,
    timestamp: new Date().toISOString(),
  };
  if (typeof s.updateSavedSettlement === 'function') {
    s.updateSavedSettlement(activeSaveId, savePartial);
  }
  persistSaveUpdate(activeSaveId, {
    settlement: savePartial.settlement,
    campaignState: savePartial.campaignState,
  });
}
