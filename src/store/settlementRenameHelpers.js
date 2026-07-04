/**
 * settlementRenameHelpers.js — the rename / canon-flavor / neighbour-sync action
 * bodies extracted from settlementSlice (WS4 decomposition).
 *
 * These are the identity-edit actions:
 *   • renameNPCImpl / renameFactionImpl — draft-only entity renames (canon-locked).
 *   • syncActiveNeighbourFieldsImpl     — flush-only neighbour-field reconcile.
 *   • renameSettlementImpl              — the always-allowed town rename (+ canon
 *                                         flavor entry when the save is canon).
 *   • recordCanonFlavorEntryImpl        — append a canon-only flavor timeline line.
 *
 * They hold no store state: each takes the slice's `get`/`set` pair and mutates
 * the same fields the inline bodies did, honouring the SAME flush-suppression
 * invariant (renameSettlement / syncActiveNeighbourFields consult
 * get().flushSuppressPersist). Moving them here shrinks settlementSlice with no
 * behaviour change — the slice keeps thin action methods that delegate straight
 * through, so the public API (names, signatures, return values, persist ordering)
 * is byte-identical.
 *
 * The module never imports settlementSlice, so there is no cycle.
 */
import { cloneJson, persistSaveUpdate } from './settlementSliceHelpers.js';

/**
 * Rename an NPC by index. Draft-only: NPC names freeze at canonization (the UI
 * hides the affordance post-canon; this guards it too).
 *
 * @param {Function} set  the slice's set() (Immer producer)
 * @param {number} npcIndex
 * @param {string} newName
 * @returns {void}
 */
export function renameNPCImpl(set, npcIndex, newName) {
  set(state => {
    // Campaign-clock identity lock: NPC names freeze at canonization. Renames
    // are a draft-only affordance (the UI hides them post-canon; guard here too).
    if (state.phase === 'canon') return;
    if (!state.settlement?.npcs?.[npcIndex]) return;
    state.settlement.npcs[npcIndex].name = newName;
  });
}

/**
 * Rename a faction by index. Draft-only (faction names freeze at canonization).
 * Resolves the canonical powerStructure.factions list first, falling back to the
 * legacy settlement.factions mirror, and keeps both label keys (.name / .faction)
 * in sync so every reader sees the new name.
 *
 * @param {Function} set  the slice's set() (Immer producer)
 * @param {number} factionIndex
 * @param {string} newName
 * @returns {void}
 */
export function renameFactionImpl(set, factionIndex, newName) {
  set(state => {
    // Campaign-clock identity lock: faction names freeze at canonization.
    if (state.phase === 'canon') return;
    // Canonical factions live on powerStructure.factions; settlement.factions
    // is a usually-empty legacy mirror. The old code only saw the mirror, so
    // a rename silently no-opped on every generated settlement. Resolve the
    // canonical list first, falling back to the legacy array.
    const list = state.settlement?.powerStructure?.factions?.length
      ? state.settlement.powerStructure.factions
      : state.settlement?.factions;
    const fac = list?.[factionIndex];
    if (!fac) return;
    // Faction records label on `.faction` (generated) or `.name` (edited/
    // legacy); keep both in sync so every reader (findFaction checks both)
    // sees the new name.
    fac.name = newName;
    if ('faction' in fac) fac.faction = newName;
  });
}

/**
 * Flush-only seam: reconcile the active store settlement's NEIGHBOUR fields
 * (neighbourNetwork + interSettlementRelationships) from a panel cascade's
 * result, so an event order replayed AFTER a link/unlink in the same commit
 * builds on the link's network (and vice-versa). No-op unless a flush is in
 * progress.
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
