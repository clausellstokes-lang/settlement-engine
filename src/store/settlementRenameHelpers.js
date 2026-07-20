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

// R-1 THE SESSION LEDGER — the eager commit dispatcher for table-authored
// events. THE FINITE-SEMANTICS LAW is enforced by the SCHEMA WALL in
// domain/tableLedger.js (validateTableEvent + buildTableEffect), which runs in
// the LAZY TableLedgerPanel at QUEUE time — so this eager dispatcher never
// imports tableLedger.js (keeping the finite-semantics core OFF the first-paint
// closure, the applyNpcOp precedent). The queued payload carries the ALREADY-
// VALIDATED, ALREADY-BUILT directive; this dispatcher light-guards it (source
// stamp + closed event-type set) and executes it through EXISTING store actions
// (applyEvent / recordCanonFlavorEntry) — never a bypass. The string 'table'
// mirrors TABLE_EVENT_SOURCE in domain/tableLedger.js (pinned equal in
// tests/store/tableEventCommit.test.js so the two can never drift).
const TABLE_SOURCE = 'table';
// The closed set of engine event types a table event may commit — the eager
// twin of tableLedger.KIND_SPEC's eventTypes (pinned equal). A directive naming
// any other type is refused here, so even a corrupted queue can only reach the
// existing, bounded table-authorable effects.
const TABLE_AUTHORABLE_EVENT_TYPES = new Set(['RESOLVE_STRESSOR', 'APPLY_STRESSOR', 'EXPOSE_CORRUPTION']);

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
 * @param {Function} get @param {Function} set @param {{ kind?: string, payload?: any }} edit
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
 * R-1 THE SESSION LEDGER — commit ONE table-authored event to the live
 * settlement. The payload carries a directive already built + validated by the
 * schema wall (domain/tableLedger.buildTableEffect) in the lazy panel. This
 * eager dispatcher LIGHT-GUARDS (the source stamp + the closed event-type set)
 * and executes through EXISTING store actions:
 *   • dispatch:'flavor'     → recordCanonFlavorEntry (a canon chronicle line,
 *                             the DM's verbatim words as history; no delta).
 *   • dispatch:'applyEvent' → the canonical applyEvent action (a typed, bounded
 *                             RESOLVE/APPLY_STRESSOR or EXPOSE_CORRUPTION event),
 *                             which logs the source:'table' receipt + persists.
 * Free text lives ONLY on the directive's narrativeSummary / tableFlavor — never
 * a mechanical field — so a table event can never smuggle prose into mechanics.
 * @param {Function} get @param {Function} set @param {{ payload?: any }} edit
 */
export function applyTableEvent(get, set, edit) {
  const directive = edit?.payload?.directive;
  if (!directive || typeof directive !== 'object') return;
  if (directive.dispatch === 'flavor') {
    const e = directive.entry || {};
    if (e.source !== TABLE_SOURCE) return; // provenance is mandatory (fail closed)
    const recorded = recordCanonFlavorEntryImpl(get, set, {
      type: typeof e.type === 'string' ? e.type : 'TABLE_INCIDENT',
      narrativeSummary: typeof e.narrativeSummary === 'string' ? e.narrativeSummary : '',
      source: TABLE_SOURCE,
    });
    // recordCanonFlavorEntry mutates the live eventLog but does not persist on
    // its own (the flush owns that); the table ledger has no flush, so persist
    // here so the incident survives reload (state-lifecycle).
    if (recorded) get().persistActiveSaveEdit?.();
    return;
  }
  if (directive.dispatch === 'applyEvent') {
    const ev = directive.event || {};
    if (ev.source !== TABLE_SOURCE) return;               // provenance mandatory
    if (!TABLE_AUTHORABLE_EVENT_TYPES.has(ev.type)) return; // closed-vocab guard
    // The canonical committer persists + logs the receipt (with ev.source:'table'
    // preserved on logEntry.event) + threads the campaign clock (a clock-bound
    // canon settlement queues it as a pending intention, exactly like any event).
    get().applyEvent?.(ev);
  }
}

/**
 * The commit-dispatch router for commitPendingEdits' default arm: a table event
 * routes to applyTableEvent; every other committable kind is an NPC-lifecycle op
 * (applyNpcOp). Keeps the at-ceiling settlementSlice net-zero — the routing lives
 * here, not in a grown switch.
 * @param {Function} get @param {Function} set @param {{ kind?: string, payload?: any }} edit
 */
export function applyEditOp(get, set, edit) {
  if (edit?.kind === 'table-event') return applyTableEvent(get, set, edit);
  return applyNpcOp(get, set, edit);
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
 * @param {{ type: string, narrativeSummary: string, targetId?: string|null, source?: string|null }} entry
 * @returns {boolean} true when an entry was appended.
 */
export function recordCanonFlavorEntryImpl(get, set, { type, narrativeSummary, targetId = null, source = null }) {
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
