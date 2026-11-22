/**
 * npcVerbsSlice.js — the DM's three verbs over the world NPC ledger, as store actions
 * (design DESIGN_NPC_CONSEQUENCES.md §7, wave W-H4).
 *
 * Law 1 (NEVER-KILL / DM-SOVEREIGN) says the engine resolves no fate and the DM's
 * authority is total. These four actions are where that authority is exercised: settle
 * a wanderer, record a death, pardon somebody, and walk any of the three back.
 *
 * THIN BY DESIGN. This module is EAGER (store/index.js composes it), so it imports
 * NOTHING from the consequence-economy leaf graph. The bodies live in ./npcVerbsBody.js
 * and load on first use through the memoized dynamic import below, which is the same
 * first-paint discipline campaignWorldPulseSlice's loadWorldEngine() follows. What
 * remains here is the session-scoped undo ring and four guarded wrappers.
 *
 * THE RING IS NOT PERSISTED. store/index.js's partialize is an allowlist, so a
 * session-only key needs no exclusion; a reload clears it, exactly as it clears
 * pulseUndoStack.
 *
 * ADVANCE GUARD, for the same reason the regional verbs carry one: these write
 * `campaign.worldState`, and a running or PARKED advance restores that wholesale from
 * its pre-interval snapshot, so a ruling handed down mid-advance would ghost. A refusal
 * the DM can read is a better answer than a write that silently disappears.
 *
 * @see src/store/operationRegistry.js — assignNpc / killNpc / pardonNpc / undoLastNpcVerb
 */

/** @type {Promise<any>|null} */
let _bodyPromise = null;
function loadNpcVerbs() {
  if (!_bodyPromise) _bodyPromise = import('./npcVerbsBody.js');
  return _bodyPromise;
}

/** The refusal a guarded verb returns, shaped like every other verb result. */
const ADVANCE_REFUSAL = Object.freeze({
  ok: false, verb: '', refusal: 'advance_in_flight', receipt: null, news: null,
});

export const createNpcVerbsSlice = (set, get) => ({
  // The session-scoped inverse ring: one entry per ruling, newest last, capped by the
  // body. Never persisted (see the header).
  npcVerbUndoStack: [],

  /**
   * Settle a wanderer at a settlement. Sovereign: pass overrideExclusions to overrule a
   * standing banishment, and the receipt will name what it set aside.
   * @param {string} campaignId
   * @param {{ wnpcId?: string, settlementId?: string, overrideExclusions?: boolean }} [args]
   */
  assignNpc: async (campaignId, { wnpcId, settlementId, overrideExclusions = false } = {}) => {
    if (typeof get().isAdvanceInFlight === 'function' && get().isAdvanceInFlight(campaignId)) return ADVANCE_REFUSAL;
    if (typeof get().getPausedAdvance === 'function' && get().getPausedAdvance(campaignId)) return ADVANCE_REFUSAL;
    const body = await loadNpcVerbs();
    return body.runAssignNpc({ set, get, campaignId, wnpcId, settlementId, overrideExclusions });
  },

  /**
   * Record a death. The only path in the whole system that removes a named person from
   * the world ledger, and it is undoable.
   * @param {string} campaignId
   * @param {{ wnpcId?: string }} [args]
   */
  killNpc: async (campaignId, { wnpcId } = {}) => {
    if (typeof get().isAdvanceInFlight === 'function' && get().isAdvanceInFlight(campaignId)) return ADVANCE_REFUSAL;
    if (typeof get().getPausedAdvance === 'function' && get().getPausedAdvance(campaignId)) return ADVANCE_REFUSAL;
    const body = await loadNpcVerbs();
    return body.runKillNpc({ set, get, campaignId, wnpcId });
  },

  /**
   * Pardon somebody: lift the edicts shut against them (all doors, or one named door)
   * and release a jail hold where the host save carries one.
   * @param {string} campaignId
   * @param {{ wnpcId?: string, settlementId?: string }} [args]
   */
  pardonNpc: async (campaignId, { wnpcId, settlementId = '' } = {}) => {
    if (typeof get().isAdvanceInFlight === 'function' && get().isAdvanceInFlight(campaignId)) return ADVANCE_REFUSAL;
    if (typeof get().getPausedAdvance === 'function' && get().getPausedAdvance(campaignId)) return ADVANCE_REFUSAL;
    const body = await loadNpcVerbs();
    return body.runPardonNpc({ set, get, campaignId, wnpcId, settlementId });
  },

  /**
   * Walk back the most recent ruling on this campaign.
   * @param {string} campaignId
   */
  undoLastNpcVerb: async (campaignId) => {
    if (typeof get().isAdvanceInFlight === 'function' && get().isAdvanceInFlight(campaignId)) return ADVANCE_REFUSAL;
    if (typeof get().getPausedAdvance === 'function' && get().getPausedAdvance(campaignId)) return ADVANCE_REFUSAL;
    const body = await loadNpcVerbs();
    return body.runUndoLastNpcVerb({ set, get, campaignId });
  },
});
