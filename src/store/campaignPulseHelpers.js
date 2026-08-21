/**
 * campaignPulseHelpers.js — world-pulse + regional state-application helpers
 * extracted from campaignSlice (WS4 decomposition, increment 3).
 *
 * Pure-ish transforms: they read/mutate the Immer draft `state` / `campaign`
 * passed in and return plain values. No store wiring. Both campaignSlice and the
 * (future) campaign sub-slices import from here. Never imports the slice → no cycle.
 */
import {
  appendWizardNewsEntries,
  deriveWizardNewsEntriesFromGraphChange,
  ensureRegionalGraph,
  ensureWizardNewsFeed,
} from '../domain/region/index.js';
// Leaf-module imports (not the `export *` barrel). Light world-state helpers
// come from worldState.js; normalizeStressor/resolveStressorById live in the
// stressor cluster and are used synchronously inside the drain path, which runs
// inside advanceCampaignWorld's set() callback — kept static (that cluster is
// already anchored to first paint by campaignRegionalSlice's sync stressor
// actions). The heavy advance/AI simulation graph stays out of the barrel path.
import { ensureWorldState } from '../domain/worldPulse/worldState.js';
import { drainQueuedEvents, queueRefusalNews, applyTwinDirectivesToWorld } from '../domain/events/drainQueuedEvents.js';
import { layerAuthoredDeltas } from '../domain/events/eventPipeline.js';
import { withOrganicStressorResolution } from '../domain/worldPulse/stressorAftermath.js';
import { deriveSystemState } from '../domain/state/deriveSystemState.js';
import { cloneJson, campaignSettlements } from './campaignSliceShared.js';

export function campaignStateForRegionalImpact(state, save, systemState, now) {
  const isActive = state.activeSaveId && String(state.activeSaveId) === String(save.id);
  const current = save.campaignState || {};
  return {
    phase: isActive ? (state.phase || current.phase || 'draft') : (current.phase || 'draft'),
    eventLog: isActive
      ? cloneJson(Array.isArray(state.eventLog) ? state.eventLog : [])
      : cloneJson(Array.isArray(current.eventLog) ? current.eventLog : []),
    systemState: cloneJson(systemState || current.systemState || null),
    locks: isActive ? cloneJson(state.locks || {}) : cloneJson(current.locks || {}),
    generatedAt: isActive ? (state.generatedAt || current.generatedAt || null) : (current.generatedAt || null),
    editedAt: now,
    canonizedAt: isActive ? (state.canonizedAt || current.canonizedAt || null) : (current.canonizedAt || null),
    lastExportAt: isActive ? (state.lastExportAt || current.lastExportAt || null) : (current.lastExportAt || null),
    narrativeDrift: current.narrativeDrift || null,
    exportState: current.exportState || null,
  };
}

export function campaignStateForWorldPulse(state, save, systemState, now, result) {
  const base = campaignStateForRegionalImpact(state, save, systemState, now);
  return {
    ...base,
    worldPulse: {
      lastTick: result?.tick ?? null,
      lastInterval: result?.interval || null,
      updatedAt: now,
    },
  };
}

export function appendWizardNewsForGraphChange(campaign, beforeGraph, afterGraph, options = {}) {
  if (!campaign) return;
  const feed = ensureWizardNewsFeed(campaign.wizardNews);
  const entries = deriveWizardNewsEntriesFromGraphChange(beforeGraph, afterGraph, {
    tick: feed.currentTick,
    ...options,
  });
  // Reuse the action's timestamp (threaded as createdAt) so one store action
  // stamps one instant everywhere instead of several wall-clock reads.
  campaign.wizardNews = appendWizardNewsEntries(feed, entries, { now: options.createdAt });
}

export function ensureCampaignWizardNews(campaign) {
  if (!campaign) return null;
  campaign.wizardNews = ensureWizardNewsFeed(campaign.wizardNews);
  return campaign.wizardNews;
}

// The honest clock for stamping a regionally-applied condition's
// triggeredAt.tick: a canonized world's authoritative worldState.tick,
// otherwise the impact-aging feed clock (pulses resync the two, so the
// feed clock is the best available pre-canon source).
export function campaignClockTick(campaign) {
  if (!campaign) return 0;
  if (campaign.worldState?.canonizedAt) {
    const tick = Number(campaign.worldState.tick);
    if (Number.isFinite(tick)) return Math.max(0, Math.floor(tick));
  }
  return ensureWizardNewsFeed(campaign.wizardNews).currentTick;
}

export function applyWorldPulseResultToState(state, campaign, result, now, authoredEventBySave = null) {
  const persistUpdates = [];
  const updates = Array.isArray(result?.settlementUpdates) ? result.settlementUpdates : [];
  const births = Array.isArray(result?.memberBirths) ? result.memberBirths : [];
  /** @type {Map<string, Record<string, unknown>>} */
  const birthPersistById = new Map();
  // WR-3: materialize first-class births BEFORE ordinary updates.  A long
  // interval may update a child on a later tick, and the composed result then
  // legitimately contains both lanes.  One deterministic id + one upsert
  // envelope keeps retry and pause/resume idempotent.
  if (!Array.isArray(campaign.settlementIds)) campaign.settlementIds = [];
  const memberIds = new Set(campaign.settlementIds.map(String));
  for (const birth of births) {
    const saveId = String(birth?.saveId || birth?.save?.id || '');
    const incoming = birth?.save;
    if (!saveId || !incoming?.settlement) continue;
    const incomingBirthId = String(incoming.settlement?.parentRef?.birthId || '');
    if (!incomingBirthId || incomingBirthId !== String(birth.birthId || '')) {
      throw new Error(`Invalid lineage member birth envelope for ${saveId}`);
    }
    let saveIdx = state.savedSettlements.findIndex(save => String(save.id) === saveId);
    if (saveIdx !== -1) {
      const heldBirthId = String(state.savedSettlements[saveIdx]?.settlement?.parentRef?.birthId || '');
      // Replay may converge only on the SAME child while it is still attached
      // to THIS campaign.  An unrelated row with the same deterministic id —
      // or the exact child after a DM deliberately detached/rehomed it — is
      // user-owned library state, not scratch space for the pulse to reclaim.
      if (heldBirthId !== incomingBirthId || !memberIds.has(saveId)) {
        throw new Error(`Lineage member id collision for ${saveId}`);
      }
    }
    let systemState = incoming.campaignState?.systemState || null;
    try {
      systemState = deriveSystemState(incoming.settlement);
    } catch (e) {
      console.warn('[campaignSlice] deriveSystemState failed for lineage member birth', e);
    }
    const campaignState = campaignStateForWorldPulse(
      state,
      incoming,
      systemState,
      now,
      result,
    );
    const nextSave = {
      ...incoming,
      id: saveId,
      phase: 'canon',
      settlement: cloneJson(incoming.settlement),
      campaignState,
      timestamp: now,
    };
    if (saveIdx === -1) {
      state.savedSettlements.push(nextSave);
      saveIdx = state.savedSettlements.length - 1;
    } else {
      state.savedSettlements[saveIdx] = {
        ...state.savedSettlements[saveIdx],
        ...nextSave,
      };
    }
    if (!memberIds.has(saveId)) {
      memberIds.add(saveId);
      campaign.settlementIds.push(saveId);
    }
    const persist = {
      saveId,
      createSave: cloneJson(state.savedSettlements[saveIdx]),
    };
    persistUpdates.push(persist);
    birthPersistById.set(saveId, persist);
  }
  // Crisis-triple sync (Wave 8 #4 — the asymmetry the D-wave deferred, owner
  // decision: SYNC IT): roaming stressors the pulse resolved ORGANICALLY
  // wind down their origin settlement's local representations — the stress
  // entry, the promoted condition (eased per the event-resolution
  // semantics), and the stressorEdits suppression — through the same
  // lifecycle the RESOLVE_STRESSOR event uses, applied here through the
  // pulse's settlementUpdates mechanism BEFORE systemState derives, so the
  // dossier stops showing a crisis the world already ended. Only the pulse
  // result carries resolvedStressors; proposal/party results pass through
  // untouched. Deterministic; identity no-op for settlements with no local
  // match (most pulse-born crises never had one).
  const resolvedRoaming = Array.isArray(result?.resolvedStressors) ? result.resolvedStressors : [];
  for (const update of updates) {
    const saveIdx = state.savedSettlements.findIndex(save =>
      String(save.id) === String(update.saveId)
    );
    if (saveIdx === -1) continue;

    const save = state.savedSettlements[saveIdx];
    let nextSettlement = update.settlement || save.settlement;
    if (resolvedRoaming.length && nextSettlement) {
      nextSettlement = withOrganicStressorResolution(nextSettlement, resolvedRoaming, save.id);
    }
    let systemState = save.campaignState?.systemState || null;
    try {
      systemState = deriveSystemState(nextSettlement);
    } catch (e) {
      console.warn('[campaignSlice] deriveSystemState failed for world pulse', e);
    }
    // Campaign-clock #4: a drained queued event's authored systemState deltas
    // (which deriveSystemState alone cannot reproduce — e.g. CUT_TRADE_ROUTE's
    // resilience/resourcePressure/externalThreat) are re-layered ONCE onto the
    // post-pulse derive for that save, so the dossier matches the eventLog entry
    // recorded for this tick. Drained saves only; null for proposal/party paths
    // and non-drained members, so their systemState is unaffected. They decay
    // next tick (no drained event → bare derive), mirroring the immediate path.
    const authoredEvent = authoredEventBySave && authoredEventBySave.get(String(update.saveId));
    if (authoredEvent && systemState) {
      try {
        systemState = layerAuthoredDeltas(systemState, authoredEvent, nextSettlement);
      } catch (e) {
        console.warn('[campaignSlice] re-layering queued authored deltas failed', e);
      }
    }
    const campaignState = campaignStateForWorldPulse(state, save, systemState, now, result);
    const nextSave = {
      ...save,
      settlement: nextSettlement,
      campaignState,
      timestamp: now,
    };
    state.savedSettlements[saveIdx] = nextSave;

    if (state.activeSaveId && String(state.activeSaveId) === String(save.id)) {
      state.settlement = nextSettlement;
      state.systemState = systemState;
      state.editedAt = now;
    }

    const birthPersist = birthPersistById.get(String(save.id));
    if (birthPersist) {
      birthPersist.createSave = cloneJson(nextSave);
    } else {
      persistUpdates.push({
        saveId: save.id,
        settlement: cloneJson(nextSettlement),
        campaignState: cloneJson(campaignState),
      });
    }
  }

  campaign.worldState = ensureWorldState(result.worldState, campaign);
  campaign.regionalGraph = ensureRegionalGraph(result.regionalGraph, { now });
  campaign.wizardNews = ensureWizardNewsFeed(result.wizardNews, { now });
  campaign.updatedAt = now;
  return persistUpdates;
}

/**
 * Campaign-clock (Phase C2): capture the campaign's full pre-pulse state so the
 * next advance can be reversed. Pure read — returns a deep-cloned snapshot
 * (campaign world + every member save + the live active settlement view) without
 * mutating anything. The caller pushes it onto pulseUndoStack only after the
 * pulse is confirmed.
 */
export function capturePulseSnapshot(state, campaign, now) {
  const memberSaves = campaignSettlements(state, campaign.id);
  return {
    campaignId: campaign.id,
    now,
    tick: campaign.worldState?.tick ?? 0,
    worldState: cloneJson(campaign.worldState),
    regionalGraph: cloneJson(campaign.regionalGraph),
    wizardNews: cloneJson(campaign.wizardNews),
    saves: memberSaves.map(s => ({
      id: s.id,
      settlement: cloneJson(s.settlement),
      campaignState: cloneJson(s.campaignState),
    })),
    active: state.activeSaveId
      ? {
          saveId: String(state.activeSaveId),
          settlement: cloneJson(state.settlement),
          systemState: cloneJson(state.systemState),
          eventLog: cloneJson(state.eventLog),
          phase: state.phase,
        }
      : null,
  };
}

/**
 * Campaign-clock (Phase C1): drain the campaign's queued player intentions into
 * its member settlements BEFORE the organic pulse, so they resolve
 * simultaneously at this tick. Mutates the draft `state` (savedSettlements +
 * the live settlement/eventLog when the active save is among the drained) and
 * returns the next worldState (crisis twins injected into stressors, queue
 * cleared) plus the touched saveIds. The caller writes the returned worldState
 * onto the draft campaign so the pulse's cloneJson(campaign) carries it.
 */
export function drainCampaignQueueIntoState(state, campaign, worldState, now) {
  const queue = worldState.pendingEvents || [];
  if (!queue.length) return { worldState, touched: [] };

  const memberSaves = campaignSettlements(state, campaign.id);
  const { updates, twinDirectives, partyImpacts, refusals } = drainQueuedEvents({
    queue,
    saves: memberSaves,
    now,
    tick: worldState.tick ?? null,
  });
  // §10 (W-COMPOSER-2): a refused queue entry surfaces VISIBLY in the advance
  // digest — the session folds these into the result's news feed.
  const nameById = new Map(memberSaves.map(s => [String(s.id), s.settlement?.name || s.name || String(s.id)]));
  const refusalNews = (refusals || []).map(r =>
    queueRefusalNews(r, nameById.get(String(r.saveId)) || String(r.saveId), worldState.tick ?? null, now));

  const touched = [];
  // saveId → the last drained event, so the pulse write can re-layer its
  // authored systemState deltas onto the post-pulse derive (see #4 fix).
  const authoredEventBySave = new Map();
  for (const u of updates) {
    const idx = state.savedSettlements.findIndex(s => String(s.id) === String(u.saveId));
    if (idx === -1) continue;
    const save = state.savedSettlements[idx];
    state.savedSettlements[idx] = {
      ...save,
      settlement: u.settlement,
      campaignState: { ...(save.campaignState || {}), eventLog: u.eventLog, systemState: u.systemState },
    };
    if (state.activeSaveId && String(state.activeSaveId) === String(u.saveId)) {
      state.settlement = u.settlement;
      state.systemState = u.systemState;
      state.eventLog = u.eventLog;
    }
    if (u.authoredEvent) authoredEventBySave.set(String(u.saveId), u.authoredEvent);
    touched.push(String(u.saveId));
  }

  // Apply crisis-twin directives to the world — the same forward path
  // settlementSlice.rippleEventThroughWorld uses for immediate events — so the
  // pulse ages/propagates roaming crises that a queued event spawned this tick.
  // Thread the whole worldState (not just stressors) so a queued RESOLVE can
  // upsert its residual-aftermath proposals exactly as resolveCampaignStressor
  // does for the immediate path.
  // The world-side twin fold lives in the DOMAIN (applyTwinDirectivesToWorld)
  // so the forecast's clone-run replays the EXACT same path — one source.
  const tick = Math.max(0, Math.floor(Number(worldState.tick) || 0));
  const ws = applyTwinDirectivesToWorld(worldState, twinDirectives, { tick, now });

  return { worldState: { ...ws, pendingEvents: [] }, touched, partyImpacts, authoredEventBySave, refusalNews };
}
