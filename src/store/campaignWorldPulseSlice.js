/**
 * campaignWorldPulseSlice — world-pulse simulation actions extracted from
 * campaignSlice (WS4 decomposition, increment 6).
 *
 * The "world pulse" is the campaign-level simulation that ages a canonized world
 * forward: preview/advance a tick, apply or dismiss the proposals it surfaces,
 * record first-class party impacts, edit the simulation rules, and (Phase C2)
 * snapshot + reverse a pulse via the session-scoped pulse-undo stack. These
 * actions were scattered through the campaignSlice megafile; grouping them here
 * shrinks that file and gives the pulse surface a single home.
 *
 * Composed into the same store as a spread sub-slice (store/index.js) so it
 * shares one set/get with campaignSlice — every cross-action call already goes
 * through get(), so nothing about call semantics changes. The slice owns the
 * session-scoped `pulseUndoStack` state (NOT persisted; a reload clears it).
 *
 * Imports only leaf helpers (shared persistence, pulse helpers, the
 * region/worldPulse domains, and the fingerprint/analytics libs) and never
 * campaignSlice, so there is no cycle.
 */
import {
  ensureRegionalGraph,
  ensureWizardNewsFeed,
} from '../domain/region/index.js';
import {
  advanceCampaignWorld as domainAdvanceCampaignWorld,
  applyPartyImpact as domainApplyPartyImpact,
  applyWorldPulseProposal as domainApplyWorldPulseProposal,
  canonizeWorldState,
  ensureWorldState,
  normalizeSimulationRules,
  previewCampaignWorldPulse as domainPreviewCampaignWorldPulse,
  updateProposalStatus as domainUpdateWorldPulseProposalStatus,
} from '../domain/worldPulse/index.js';
import {
  cloneJson, cacheCampaignState, syncCampaignSnapshot,
  flushWorldPulsePersist, findActiveCampaign, campaignSettlements,
} from './campaignSliceShared.js';
import {
  capturePulseSnapshot, applyWorldPulseResultToState, drainCampaignQueueIntoState,
} from './campaignPulseHelpers.js';
import { track, EVENTS } from '../lib/analytics.js';
import { captureFingerprint } from '../lib/researchCapture.js';
import { getConsent } from '../lib/consent.js';
import { enqueuePulseEffect } from '../lib/analyticsQueue.js';
import {
  extractPulseSummary, extractPulseEffects, extractStressorTransitions,
  extractProposalDecision, extractPartyImpact, extractSimulationRules,
} from '../lib/pulseFingerprint.js';
import {
  extractRegionalGraphSnapshot, extractRegionalArcs, extractRegionalPropagation,
} from '../lib/regionalFingerprint.js';

// Per-campaign cap on retained pre-pulse snapshots (multi-step undo depth).
const PULSE_UNDO_CAP = 10;

export const createCampaignWorldPulseSlice = (set, get) => ({
  // Campaign-clock (Phase C2): session-scoped stack of pre-pulse snapshots, one
  // per advance, capped PER campaign. NOT persisted — a reload clears it.
  pulseUndoStack: [],

  previewCampaignWorldPulse: (campaignId, interval = 'one_month', options = {}) => {
    const state = get();
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return null;
    const previewCampaign = cloneJson(campaign);
    if (options.simulationRules) {
      previewCampaign.worldState = {
        ...(previewCampaign.worldState || {}),
        simulationRules: normalizeSimulationRules(options.simulationRules),
      };
    }
    const settlements = campaignSettlements(state, campaignId);
    const preview = domainPreviewCampaignWorldPulse({
      campaign: previewCampaign,
      saves: cloneJson(settlements),
      interval,
      now: options.now,
    });
    track(EVENTS.WORLD_PULSE_PREVIEWED, {
      interval,
      settlement_count: settlements.length,
      proposal_count: Array.isArray(preview?.proposals) ? preview.proposals.length : 0,
    });
    return preview;
  },

  canonizeCampaignWorld: async (campaignId) => {
    let campaignPersist = /** @type {any} */ (null);
    let settlementCount = 0;
    let regionalSnapshot = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      settlementCount = campaignSettlements(state, campaignId).length;
      c.worldState = canonizeWorldState(c.worldState, now, c);
      // Compute the regional-topology snapshot while the graph draft is live.
      regionalSnapshot = extractRegionalGraphSnapshot(c.regionalGraph);
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (campaignPersist) {
      track(EVENTS.WORLD_CANONIZED, { settlement_count: settlementCount });
      if (regionalSnapshot) track(EVENTS.REGIONAL_GRAPH_SNAPSHOT, regionalSnapshot);
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return campaignPersist?.snapshot?.find(c => c.id === campaignId)?.worldState || null;
  },

  updateCampaignSimulationRules: async (campaignId, patch = {}) => {
    let campaignPersist = /** @type {any} */ (null);
    let normalizedRules = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const worldState = ensureWorldState(c.worldState, c);
      // Build the plain rules object first so the telemetry read below is NOT an
      // Immer draft proxy (which would be revoked once set() returns).
      normalizedRules = normalizeSimulationRules({
        ...(worldState.simulationRules || {}),
        ...(patch || {}),
      });
      c.worldState = { ...worldState, simulationRules: normalizedRules };
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (campaignPersist) {
      // Emit the rule VALUES, not just the changed keys — this is the join from
      // simulation config to every subsequent pulse outcome (variance per config).
      track(EVENTS.SIMULATION_RULES_UPDATED, extractSimulationRules(normalizedRules, Object.keys(patch || {})));
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return campaignPersist?.snapshot?.find(c => c.id === campaignId)?.worldState?.simulationRules || null;
  },

  advanceCampaignWorld: async (campaignId, interval = 'one_month', options = {}) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    /** Saves to fingerprint after a successful pulse (cap 5). Collected inside
     *  set() but used after, so the snapshot reflects post-apply settlements. */
    let fingerprintSaves = [];
    /** The campaign's live NPC sim-state (cloned plain inside set), so the
     *  fingerprint can surface per-settlement NPC goal/role evolution. */
    let campaignNpcStates = /** @type {any} */ (null);
    /** Queued-impact ids present BEFORE this pulse, so we can diff out the new
     *  cross-settlement propagation impacts this pulse produced. */
    let priorQueuedIds = /** @type {Set<string>} */ (null);
    /** Party-impact actions surfaced by draining party-caused queued events —
     *  replayed through recordPartyImpact AFTER the pulse (mirroring the
     *  immediate path's rippleEventThroughWorld party branch). */
    let drainedPartyImpacts = [];
    const now = options.now || new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const worldState = ensureWorldState(c.worldState, c);
      if (!worldState.canonizedAt) {
        result = { ok: false, reason: 'world_not_canonized' };
        return;
      }
      // Campaign-clock C2: snapshot the full pre-pulse state (campaign world +
      // every member save + the live active view) BEFORE anything mutates, so
      // the advance can be reversed by undoLastPulse. Pushed to the stack only
      // after the pulse is confirmed below.
      const preSnapshot = capturePulseSnapshot(state, c, now);
      // Campaign-clock C1: drain queued player intentions into the member
      // settlements (and inject any crisis twins into worldState) BEFORE the
      // organic pulse, so every settlement's events resolve simultaneously at
      // this tick and the pulse simulates the post-intervention world. The
      // augmented worldState is written onto the draft campaign so the pulse's
      // cloneJson(c) carries the injected stressors + the cleared queue.
      const drained = drainCampaignQueueIntoState(state, c, worldState, now);
      c.worldState = drained.worldState;
      drainedPartyImpacts = drained.partyImpacts || [];
      result = domainAdvanceCampaignWorld({
        campaign: cloneJson(c),
        saves: cloneJson(campaignSettlements(state, campaignId)),
        interval,
        now,
      });
      if (!result) return;
      // The pulse landed — retain the pre-pulse snapshot for multi-step undo.
      // Cap PER campaign so churn in one campaign can't evict another's history:
      // drop only this campaign's oldest snapshot when it exceeds the cap.
      {
        const next = [...(state.pulseUndoStack || []), preSnapshot];
        const mineCount = next.reduce((n, s) => n + (s.campaignId === campaignId ? 1 : 0), 0);
        if (mineCount > PULSE_UNDO_CAP) {
          const oldestIdx = next.findIndex(s => s.campaignId === campaignId);
          if (oldestIdx !== -1) next.splice(oldestIdx, 1);
        }
        state.pulseUndoStack = next;
      }
      // Snapshot the pre-pulse queued-impact ids (primitive Set — safe to read
      // outside set) so we can isolate this pulse's NEW propagation impacts.
      priorQueuedIds = new Set((c.regionalGraph?.queuedImpacts || []).map(i => String(i.id)));
      persistUpdates = applyWorldPulseResultToState(state, c, result, now, drained.authoredEventBySave);
      campaignPersist = cacheCampaignState(state);
      // Collect the affected saves (post-apply) for the research fingerprint,
      // capped at 5 per pulse so a large constellation doesn't flood capture.
      const affectedIds = (Array.isArray(result.settlementUpdates) ? result.settlementUpdates : [])
        .map(u => String(u.saveId));
      const affected = new Set(affectedIds);
      fingerprintSaves = (state.savedSettlements || [])
        .filter(save => affected.has(String(save.id)))
        .slice(0, 5)
        .map(save => ({ id: save.id, settlement: cloneJson(save.settlement), save: { id: save.id, campaignState: cloneJson(save.campaignState) } }));
      campaignNpcStates = cloneJson(c.worldState?.npcStates) || null;
    });

    // Fire-and-forget analytics — additive, after state has settled.
    if (result && result.ok === false && result.reason === 'world_not_canonized') {
      track(EVENTS.WORLD_PULSE_BLOCKED, { reason: 'world_not_canonized' });
    } else if (result && campaignPersist) {
      // Enriched per-effect-family summary (fixes the always-0 new_stressor_count
      // bug; events_applied_count retained for back-compat with existing reads).
      track(EVENTS.WORLD_PULSE_ADVANCED, {
        ...extractPulseSummary(result, interval),
        events_applied_count: Array.isArray(result.autoApplied) ? result.autoApplied.length : 0,
      });
      // Per-type stressor transitions (research-class; gated inside track()).
      track(EVENTS.WORLD_STRESSOR_TRANSITIONS, extractStressorTransitions(result));
      // Exhaustive per-effect mutation ledger → world_pulse_effects (research only).
      if (getConsent().research) {
        const { rows } = extractPulseEffects(result);
        for (const row of rows) enqueuePulseEffect(row);
      }
      // Regional structure snapshot (research) + realm/compound arc emergence.
      const regionalSnapshot = extractRegionalGraphSnapshot(result.regionalGraph);
      if (regionalSnapshot) track(EVENTS.REGIONAL_GRAPH_SNAPSHOT, regionalSnapshot);
      const arcs = extractRegionalArcs(result);
      if (arcs.length) track(EVENTS.REGIONAL_ARC_EMERGED, { tick: Number.isFinite(result.tick) ? result.tick : null, arc_count: arcs.length, arcs });
      // Cross-settlement propagation that occurred during this pulse — the NEW
      // queued impacts (diffed against the pre-pulse graph).
      if (result.regionalGraph && priorQueuedIds) {
        const newImpacts = (result.regionalGraph.queuedImpacts || []).filter(i => !priorQueuedIds.has(String(i.id)));
        const prop = extractRegionalPropagation({ impacts: newImpacts, genesis: 'world_pulse' });
        if (prop) track(EVENTS.REGIONAL_PROPAGATION_APPLIED, prop);
      }
      for (const entry of fingerprintSaves) {
        captureFingerprint('pulse_advanced', entry.settlement, {
          save: entry.save,
          settlementUuid: String(entry.id),
          worldState: campaignNpcStates ? { npcStates: campaignNpcStates } : undefined,
        });
      }
    }

    await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    // Replay party-caused queued events through the party-impact pipeline — the
    // drain surfaced them; this mirrors the immediate path's rippleEventThroughWorld
    // party branch (faction/NPC world state, condition resolution, Wizard News).
    // Best-effort: the world half never blocks the advance, and the pre-pulse
    // snapshot already covers these for undo (they land after the snapshot).
    if (result && result.ok !== false && drainedPartyImpacts.length
        && typeof get().recordPartyImpact === 'function') {
      for (const pi of drainedPartyImpacts) {
        try { await get().recordPartyImpact(campaignId, pi.action); } catch { /* best-effort */ }
      }
    }
    return result;
  },

  applyWorldPulseProposal: async (campaignId, proposalId) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    let appliedDecision = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      // Build the decision telemetry INSIDE set() — the proposal is an Immer
      // draft proxy that is revoked once set() returns; the extractor flattens
      // it to a plain enum/band object that survives.
      const proposal = (c.worldState?.proposals || []).find(p => p.id === proposalId) || null;
      appliedDecision = extractProposalDecision(proposal, 'applied');
      result = domainApplyWorldPulseProposal({
        campaign: cloneJson(c),
        saves: cloneJson(campaignSettlements(state, campaignId)),
        proposalId,
        now,
      });
      if (!result) return;
      persistUpdates = applyWorldPulseResultToState(state, c, result, now);
      campaignPersist = cacheCampaignState(state);
    });

    if (result && campaignPersist) {
      track(EVENTS.WORLD_PULSE_PROPOSAL_APPLIED, appliedDecision);
    }
    await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    return result;
  },

  // Party as first-class actor: inject the consequences of a party action
  // (resolve a stressor, broker/inflame a relationship, clear/impose a
  // condition, move a faction/NPC) as an authoritative, party-tagged pulse
  // input. Persists like advanceCampaignWorld.
  recordPartyImpact: async (campaignId, action) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      result = domainApplyPartyImpact({
        campaign: cloneJson(c),
        saves: cloneJson(campaignSettlements(state, campaignId)),
        action,
        now,
      });
      if (!result) return;
      persistUpdates = applyWorldPulseResultToState(state, c, result, now);
      campaignPersist = cacheCampaignState(state);
    });

    if (result && campaignPersist) {
      track(EVENTS.PARTY_IMPACT_RECORDED, {
        action_type: action?.kind || 'unknown', // retained for back-compat
        ...extractPartyImpact(action, result),
      });
    }
    await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    return result;
  },

  dismissWorldPulseProposal: async (campaignId, proposalId) => {
    let proposal = /** @type {any} */ (null);
    let dismissDecision = /** @type {any} */ (null);
    let campaignPersist = /** @type {any} */ (null);
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      c.worldState = domainUpdateWorldPulseProposalStatus(
        ensureWorldState(c.worldState, c),
        proposalId,
        'dismissed',
        { dismissedAt: now },
      );
      proposal = c.worldState.proposals.find(item => item.id === proposalId) || null;
      // Flatten the draft proxy to plain telemetry before set() revokes it.
      dismissDecision = proposal ? extractProposalDecision(proposal, 'dismissed') : null;
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (dismissDecision && campaignPersist) {
      // The BLOCK half of the permission flow — previously emitted nothing, so
      // accept-vs-block ratio (what DMs let in vs reject) was unmeasurable.
      track(EVENTS.WORLD_PULSE_PROPOSAL_DISMISSED, dismissDecision);
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return proposal;
  },

  getCampaignWorldState: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    return ensureWorldState(c?.worldState, c);
  },

  /** Campaign-clock (Phase C2): is there a pre-pulse snapshot to undo for this
   *  campaign this session? Drives the "Undo last advance" affordance. */
  canUndoLastPulse: (campaignId) =>
    (get().pulseUndoStack || []).some(s => s.campaignId === campaignId),

  /**
   * Campaign-clock (Phase C2): reverse the most recent world-pulse advance for
   * this campaign, restoring the campaign world + every member settlement (and
   * the live active view) from the pre-pulse snapshot. Multi-step — each call
   * pops one snapshot, so repeated calls walk back tick by tick. Returns true if
   * an advance was undone. Session-scoped: a reload clears the stack.
   */
  undoLastPulse: async (campaignId) => {
    const persistUpdates = [];
    let campaignPersist = null;
    let didUndo = false;
    set(state => {
      const stack = state.pulseUndoStack || [];
      let idx = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].campaignId === campaignId) { idx = i; break; }
      }
      if (idx === -1) return;
      const snap = stack[idx];
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const stamp = new Date().toISOString();
      // Restore the campaign world (world state, regional graph, wizard news).
      c.worldState = ensureWorldState(snap.worldState, c);
      c.regionalGraph = ensureRegionalGraph(snap.regionalGraph, { now: stamp });
      c.wizardNews = ensureWizardNewsFeed(snap.wizardNews, { now: stamp });
      c.updatedAt = stamp;
      // Restore each member save to its pre-pulse settlement + campaignState —
      // but only members that still belong to this campaign (a save detached
      // since the advance must not be silently reverted).
      const memberIds = new Set((c.settlementIds || []).map(String));
      for (const s of snap.saves || []) {
        if (!memberIds.has(String(s.id))) continue;
        const sidx = state.savedSettlements.findIndex(x => String(x.id) === String(s.id));
        if (sidx === -1) continue;
        const restoredSettlement = cloneJson(s.settlement);
        const restoredCampaignState = cloneJson(s.campaignState);
        state.savedSettlements[sidx] = {
          ...state.savedSettlements[sidx],
          settlement: restoredSettlement,
          campaignState: restoredCampaignState,
          timestamp: stamp,
        };
        persistUpdates.push({
          saveId: s.id,
          settlement: cloneJson(restoredSettlement),
          campaignState: cloneJson(restoredCampaignState),
        });
      }
      // Re-hydrate the LIVE active view to whichever member is open now — so the
      // on-screen settlement reflects the reverted state even if the DM switched
      // members (or the open member isn't the one captured at advance time)
      // between advancing and undoing. If no member of THIS campaign is open,
      // the live view is left untouched (a different campaign's settlement, or
      // a closed detail view, must not be clobbered).
      if (state.activeSaveId != null) {
        if (snap.active && String(state.activeSaveId) === snap.active.saveId) {
          // Same member that was open at advance time — restore its view verbatim.
          state.settlement = cloneJson(snap.active.settlement);
          state.systemState = cloneJson(snap.active.systemState);
          state.eventLog = cloneJson(snap.active.eventLog);
          state.phase = snap.active.phase;
          state.editedAt = stamp;
        } else {
          const activeSnap = (snap.saves || []).find(s => String(s.id) === String(state.activeSaveId));
          if (activeSnap && memberIds.has(String(activeSnap.id))) {
            const cs = activeSnap.campaignState || {};
            state.settlement = cloneJson(activeSnap.settlement);
            state.systemState = cs.systemState != null ? cloneJson(cs.systemState) : null;
            state.eventLog = Array.isArray(cs.eventLog) ? cloneJson(cs.eventLog) : [];
            state.phase = cs.phase || state.phase;
            state.editedAt = stamp;
          }
        }
      }
      // Pop just this snapshot — multi-step undo walks back one tick per call.
      state.pulseUndoStack = stack.filter((_, i) => i !== idx);
      campaignPersist = cacheCampaignState(state);
      didUndo = true;
    });
    await flushWorldPulsePersist({ result: didUndo, campaignPersist, persistUpdates, campaignId });
    return didUndo;
  },
});
