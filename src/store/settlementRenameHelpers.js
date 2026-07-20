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

// ── DESIGN_NPC_LIFECYCLE §2 — the three typed NPC ops (delegated bodies) ─────────
// commitPendingEdits' default case routes the NPC-lifecycle committable kinds here
// (settlementSlice is AT its max-lines ceiling, so the bodies live in this delegated-
// impl helper — the renameSettlementImpl precedent). CANON-TOLERANT: NPC lifecycle
// edits change the FUTURE, never the past (no rename-style identity lock). Each writes
// a DECLARED facet (npc.facets) so it is a permanent citizen of THE FACET LAW. Kept
// eager-cheap for the tight first-paint budget: NO lazy-npcOps import (which would
// pull the bank + PRNG into first paint), and the covenant UI resolves the seat
// patch — the pure/canonical bodies + propagation model + all pins live in
// domain/npc/npcOps.js, kept in lockstep with this thin dispatcher. The full bank
// validation (facet vocab, stasis reasons) lives in that lazy spec + the covenant UI;
// this eager dispatcher trusts the covenant payload (light presence guards only).

/**
 * Apply one typed NPC op to the live settlement (edit-npc / reassign-npc / stasis-npc
 * / return-npc). Mutates through the slice's Immer set(); persists so the op survives
 * reload. No-op-safe on a missing NPC / bad payload.
 * @param {Function} get @param {Function} set @param {{ kind: string, payload?: any }} edit
 */
export function applyNpcOp(get, set, edit) {
  const k = edit?.kind;
  const p = edit?.payload || {};
  let changed = false;
  // DESIGN_THE_ROADS §11 — a rescue also worsens the captor↔home edge; captured here (the
  // captor id read inside set()) and fired AFTER the sync commit, since recordPartyImpact is
  // async + campaign-scoped. Null unless a rescue landed on a live hostage.
  let rescueCaptorId = null;
  set(state => {
    const npc = state.settlement?.npcs?.[p.npcIndex];
    if (!npc) return;
    if (k === 'edit-npc') {
      if (!['alignment', 'temperament', 'role', 'goal'].includes(p.facetKind)) return;
      npc.facets = { ...(npc.facets || {}), [p.facetKind]: p.value };
      // Sync the live native field the engine/display reads (npcOps PROPAGATION MODEL).
      if (p.facetKind === 'temperament') npc.personality = { ...(npc.personality || {}), dominant: p.value };
      else if (p.facetKind === 'goal') npc.goal = { ...(npc.goal || {}), short: p.value };
    } else if (k === 'reassign-npc' && p.target && typeof p.target === 'object') {
      // Seat-held ties move to the new posting (the covenant UI passes ONLY seat
      // fields); people-held relationship edges keyed by npc id travel untouched.
      Object.assign(npc, p.target);
    } else if (k === 'stasis-npc') {
      if (!p.reason) return;
      npc.stasis = { reason: p.reason };
    } else if (k === 'return-npc') {
      delete npc.stasis;
    } else if (k === 'ransom-npc' || k === 'rescue-npc') {
      // DESIGN_THE_ROADS §11 — THE PARTY'S HAND. Stamp the release marker the roads mover
      // consumes on its next tick (the §3 stasis-collision precedent: the DM writes the npc,
      // the mover reacts). Only a LIVE HOSTAGE can be intervened on. The pure body + all pins
      // live in domain/roads/ops.js, kept in lockstep with this thin eager dispatcher.
      const wa = npc.whereabouts;
      if (!wa || wa.state !== 'hostage') return;
      npc.whereabouts = { ...wa, partyRelease: k === 'ransom-npc' ? 'ransom' : 'rescue' };
      if (k === 'rescue-npc') rescueCaptorId = String(wa.placeId || '');
    } else if (k === 'champion-npc') {
      // DESIGN_DEEP_COUPLINGS §8 D-4e — THE PLAYER SIDING. Stamp the contestBacking marker the
      // ladder-contest pass folds into ContestRec.backedBy on its next advance (the roads
      // whereabouts.partyRelease precedent: the DM writes the npc, the mover reacts). The marker
      // is scoped to a SPECIFIC contest id, so a stale mark never re-fires on a later contest.
      // The op writes NO ladder ledger directly; the pure marker contract (contestBackingMark)
      // and its consume (the carry-forward fold in advanceContests) live in
      // domain/worldPulse/npcLadderContest.js. The consume VALIDATES (a bogus id with no matching
      // live contest is a byte-safe no-op), so
      // this eager dispatcher stamps trustingly (the covenant UI offers it only to contestants).
      if (!p.contestId || typeof p.contestId !== 'string') return;
      npc.contestBacking = p.contestId;
    } else if (k === 'recall-npc') {
      // DESIGN_VISION_WAVE V-24a — THE RECALL RIDER. Stamp the recall marker the roads mover
      // consumes on its next tick (the whereabouts.partyRelease precedent: the DM writes the
      // npc, the mover reacts by engaging the return leg early). Only a currently-traveling NPC
      // (mirror state 'traveling' = outbound, or 'visiting') can be recalled — a 'returning'
      // traveller is already homeward, a hostage uses the party-release ops, and a non-traveller
      // has nowhere to be recalled from (the graceful no-op). The pure body + pins live in
      // domain/roads/ops.js (applyRoadsRecall / RECALLABLE_STATES), kept in lockstep with this
      // thin dispatcher. Self-clearing: the mover rewrites whereabouts from the ledger each tick.
      const wa = npc.whereabouts;
      if (!wa || (wa.state !== 'traveling' && wa.state !== 'visiting')) return;
      npc.whereabouts = { ...wa, recall: true };
    } else { return; }
    changed = true;
  });
  if (changed) get().persistActiveSaveEdit?.();
  // The rescue's inflame rides the EXISTING inflame_relationship party impact (no new
  // relationship writer). It lives in a LAZY leaf (roadsRescueInflame) dynamic-imported ONLY
  // when a rescue lands — the cold path stays OFF the eager first-paint store closure (§16).
  // Same undo semantics as every manual party impact (undoLastEvent/persist for the marker;
  // the impact reverts by its own path).
  if (changed && rescueCaptorId) {
    import('./roadsRescueInflame.js').then(m => m.fireRescueInflame(get, rescueCaptorId)).catch(() => {});
  }
}

/**
 * Flush-only seam: reconcile the active store settlement's NEIGHBOUR fields
 * (neighbourNetwork + interSettlementRelationships) from a panel cascade's
 * result, so an event order replayed AFTER a link/unlink in the same commit
 * builds on the link's network (and vice-versa). No-op unless a flush is in
 * progress (get().flushSuppressPersist truthy).
 *
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @param {{ neighbourNetwork?: any[], interSettlementRelationships?: any[] }} neighbourFields
 * @returns {void}
 */
export function syncActiveNeighbourFieldsImpl(get, set, neighbourFields) {
  if (!get().flushSuppressPersist) return;
  set(state => {
    if (!state.settlement || !neighbourFields) return;
    if (Array.isArray(neighbourFields.neighbourNetwork)) {
      state.settlement.neighbourNetwork = neighbourFields.neighbourNetwork;
    }
    if (Array.isArray(neighbourFields.interSettlementRelationships)) {
      state.settlement.interSettlementRelationships = neighbourFields.interSettlementRelationships;
    }
  });
}

/**
 * Rename a saved settlement (town). Unlike NPC/faction names, a settlement's own
 * name is NEVER canon-locked. Before canon it is a plain name edit; after canon
 * the rename is ALSO appended to the timeline as a RENAME_SETTLEMENT flavor entry
 * (flavor only — no systemState delta, no entity mutation, no PRNG draw).
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
 * @param {{ type: string, narrativeSummary: string, targetId?: string|null }} entry
 * @returns {boolean} true when an entry was appended.
 */
export function recordCanonFlavorEntryImpl(get, set, { type, narrativeSummary, targetId = null }) {
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
