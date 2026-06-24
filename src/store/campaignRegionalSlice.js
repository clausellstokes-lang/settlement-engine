/**
 * campaignRegionalSlice — regional-impact + roaming-stressor actions extracted
 * from campaignSlice (WS4 decomposition, increment 4).
 *
 * These actions all operate on a campaign's regionalGraph / worldState stressors
 * and the settlements they touch. They were scattered through the campaignSlice
 * megafile; grouping them here shrinks that file and gives the regional surface a
 * single home. They are composed into the same store as a spread sub-slice
 * (store/index.js), so they share one set/get with campaignSlice — every
 * cross-action call already goes through get(), so nothing about call semantics
 * changes.
 *
 * The module imports only leaf helpers (shared persistence, pulse helpers, and
 * the region/worldPulse domains) and never campaignSlice, so there is no cycle.
 */
import {
  advanceRegionalImpacts,
  advanceWizardNewsFeed,
  applyRegionalImpact,
  conditionFromRegionalImpact,
  deriveGraphWithDiscoveredCandidates,
  deriveRegionalGraphFromSaves,
  ensureRegionalGraph,
  isRegionalImpactAvailable,
  queueRegionalImpacts,
  setRegionalChannelStatus as domainSetRegionalChannelStatus,
  setRegionalChannelVisibility as domainSetRegionalChannelVisibility,
  setRegionalImpactStatus as domainSetRegionalImpactStatus,
} from '../domain/region/index.js';
import {
  ensureWorldState,
  normalizeStressor,
  proposalIdFor,
  resolveStressorById,
  upsertProposal,
} from '../domain/worldPulse/index.js';
import { pulseTypeForStressorKey } from '../domain/stressorPicker.js';
import { withoutActiveCondition } from '../domain/activeConditions.js';
import { deriveSystemState } from '../domain/state/deriveSystemState.js';
import {
  cloneJson, persistCampaignState, persistSaveUpdate,
  channelTypesFromImpacts, findActiveCampaign, campaignSettlements,
} from './campaignSliceShared.js';
import {
  campaignStateForRegionalImpact, appendWizardNewsForGraphChange,
  ensureCampaignWizardNews, campaignClockTick, applyWarFrontSeed,
} from './campaignPulseHelpers.js';
import { track, EVENTS } from '../lib/analytics.js';
import { extractRegionalImpactDecision, extractRegionalChannelChange } from '../lib/regionalFingerprint.js';

// ── Cross-slice contract ──────────────────────────────────────────────────
// All 14 slices share ONE Immer store, so coupling is by shared state on the
// draft + get() method calls — not imports. This slice's contract:
//
// PROVIDES (read via get() by other slices): setCampaignRegionalGraph,
//   injectCampaignStressor, resolveCampaignStressor — driven by
//   settlementSlice.rippleEventThroughWorld on canon edits; the crisisTripleSync
//   TWIN_ACTION_FILES pin enforces those three are referenced only here + by that
//   one consumer. undoCampaignStressorBridge is called by settlementSlice's
//   undoLastEvent. The rest of the regional surface is consumed by UI components.
// CONSUMES shared state, owned elsewhere, read/written on the draft:
//   • campaigns                      — campaignSlice
//   • savedSettlements + the live active view (activeSaveId, settlement,
//     systemState, editedAt) — settlementSlice
// Intra-slice fan-out (ignore/applyAll → get().setRegionalImpactStatus etc.) is
// SAME-slice. Graph/news mechanics live in campaignPulseHelpers.js + domain/region.
export const createCampaignRegionalSlice = (set, get) => ({
  /** Ensure a campaign has the current regional graph envelope. */
  ensureCampaignRegionalGraph: (campaignId) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.regionalGraph = ensureRegionalGraph(c.regionalGraph);
      ensureCampaignWizardNews(c);
      c.updatedAt = new Date().toISOString();
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  /**
   * Rebuild the structural graph from campaign settlements. Existing channel
   * curation (status — confirmed/dormant/disabled all sticky — visibility,
   * confirmedAt, original discoveredAt) is preserved; discovery only refreshes
   * measurements and adds suggested P0 channels for new pairs.
   */
  rebuildCampaignRegionalGraph: (campaignId, options = {}) => {
    const { discover = true } = options;
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const saves = campaignSettlements(state, campaignId);
      c.regionalGraph = discover
        ? deriveGraphWithDiscoveredCandidates(saves, c.regionalGraph, { now })
        : deriveRegionalGraphFromSaves(saves, c.regionalGraph, { now });
      ensureCampaignWizardNews(c);
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  discoverCampaignRegionalChannels: (campaignId) => {
    return get().rebuildCampaignRegionalGraph(campaignId, { discover: true });
  },

  setRegionalChannelStatus: (campaignId, channelId, status) => {
    let graph = null;
    let channelEvent = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      const before = (beforeGraph.channels || []).find(ch => ch.id === channelId);
      // Build telemetry from the draft INSIDE set() (the channel proxy is revoked
      // after set returns). was_dm_action: this action is DM-initiated curation.
      if (before) channelEvent = extractRegionalChannelChange(before, before.status, status, true);
      c.regionalGraph = domainSetRegionalChannelStatus(c.regionalGraph, channelId, status, { now });
      ensureCampaignWizardNews(c);
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    if (channelEvent) track(EVENTS.REGIONAL_CHANNEL_STATUS_CHANGED, channelEvent);
    return graph;
  },

  setRegionalChannelVisibility: (campaignId, channelId, visibility) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      c.regionalGraph = domainSetRegionalChannelVisibility(c.regionalGraph, channelId, visibility, { now });
      ensureCampaignWizardNews(c);
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  /**
   * Register an authored stressor as a ROAMING world-pulse stressor. The
   * APPLY_STRESSOR canon event bridges here (settlementSlice.applyEvent) so
   * an authored crisis doesn't just sit on the dossier — the world pulse
   * ages it: decay, counterforces, synergies, spread, echoes, aftermath.
   * Upserts by stable stressor id (same byId pattern applyWorldPulse uses),
   * so re-applying the same crisis at the same settlement overwrites rather
   * than stacks.
   */
  injectCampaignStressor: (campaignId, stressor) => {
    let injected = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const worldState = ensureWorldState(c.worldState, c);
      const normalized = normalizeStressor({ ...stressor, createdAt: now, updatedAt: now });
      const byId = new Map((worldState.stressors || []).map(s => [s.id, s]));
      byId.set(normalized.id, normalized);
      c.worldState = { ...worldState, stressors: [...byId.values()] };
      c.updatedAt = now;
      injected = normalized;
      persistCampaignState(state, campaignId);
    });
    return injected;
  },

  /**
   * #2 — SEED a cross-settlement WAR FRONT from a DM-authored siege / occupation
   * stressor that names an instigating neighbour, in a campaign with the war layer
   * ON. The named INSTIGATOR deploys its army against the TARGET (this settlement),
   * minting the exact ledger shape the war layer resolves on the next Advance:
   *
   *   1. a LIGHT deployment record on worldState.deployments[instigatorId]
   *      ({ targetId, sinceTick, role:'siege' }) — the war layer's own
   *      ensureStatefulRecord enriches it from the live capacity model on first
   *      contact, so attrition / reinforcement / retirement all run unchanged;
   *   2. a war_front channel instigator → target with WAR-LAYER provenance
   *      (source:'war_layer_deploy'), so isLiveWarFront reads it as a real siege
   *      rather than a phantom relationship front;
   *   3. warPosture[instigatorId] = { state:'deployed' } so the posture ledger is
   *      consistent (the army does not look like it sieges from peace).
   *
   * GATED on simulationRules.warLayerEnabled — a war-off campaign is a NO-OP
   * (byte-identical, the dormancy oracle is preserved). IDEMPOTENT + honours the
   * ENGINE'S ONE-ARMY INVARIANT: if the instigator already fields an army (already
   * deployed) the seed is skipped entirely, never overwriting the live ledger.
   *
   * @param {string} campaignId
   * @param {{ instigatorId?: string|number, targetId?: string|number, sinceTick?: number, now?: string|null }} [args]
   * @returns {boolean} true when a fresh front was seeded; false on any no-op.
   */
  seedCampaignWarFront: (campaignId, { instigatorId, targetId, sinceTick = 0, now = null } = {}) => {
    let seeded = false;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const stamp = now || new Date().toISOString();
      // Delegate the ledger + graph + posture mutation to the SHARED seed primitive
      // (applyWarFrontSeed in campaignPulseHelpers) — the SAME code the deferred
      // Advance drain runs, so the immediate and deferred seeds cannot drift. All
      // of the guards (war-off, one-army invariant, self-target) live in there.
      seeded = applyWarFrontSeed(c, { instigatorId, targetId, sinceTick, now: stamp });
      if (!seeded) return;
      c.updatedAt = stamp;
      persistCampaignState(state, campaignId);
    });
    return seeded;
  },

  /**
   * Resolve the ROAMING twin of an authored stressor. The RESOLVE_STRESSOR
   * canon event bridges here (settlementSlice.applyEvent), mirroring
   * injectCampaignStressor: the authored type is alias-mapped through
   * pulseTypeForStressorKey, the matching ACTIVE stressor affecting the
   * settlement resolves through the same directed path the party-impact hook
   * uses (resolveStressorById — no roll, echo retained), and its residual
   * aftermath is queued as pending world-pulse proposals (the outcome shape
   * applyWorldPulseProposal already consumes) rather than silently written
   * onto saves. `now` is threaded from the caller's minted timestamp so the
   * apply stamps one instant everywhere.
   *
   * @param {string} campaignId
   * @param {{ type?: string, settlementId?: string|number, now?: string|null }} [args]
   */
  resolveCampaignStressor: (campaignId, { type, settlementId, now = null } = {}) => {
    let resolved = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const stamp = now || new Date().toISOString();
      const worldState = ensureWorldState(c.worldState, c);
      const roamingType = pulseTypeForStressorKey(type) || type;
      if (!roamingType) return;
      const sid = String(settlementId || '');
      const match = (worldState.stressors || [])
        .map(raw => normalizeStressor(raw))
        .find(st => st.status === 'active'
          && String(st.type).toLowerCase() === String(roamingType).toLowerCase()
          && (String(st.originSettlementId || '') === sid
            || (st.affectedSettlementIds || []).map(String).includes(sid)));
      if (!match) return;
      const tick = Math.max(0, Math.floor(Number(worldState.tick) || 0));
      const result = resolveStressorById(worldState.stressors, match.id, {
        tick,
        now: stamp,
        reason: 'Resolved by DM authoring',
        emitResidual: true,
      });
      if (!result.found) return;
      let nextWorldState = { ...worldState, stressors: result.stressors };
      for (const outcome of result.residualOutcomes) {
        nextWorldState = upsertProposal(nextWorldState, {
          id: proposalIdFor(outcome, tick),
          status: 'pending',
          createdAt: stamp,
          updatedAt: stamp,
          tick,
          outcome: cloneJson(outcome),
          headline: outcome.headline,
          summary: outcome.summary,
          severity: outcome.severity,
          reasons: outcome.reasons || [],
        });
      }
      c.worldState = nextWorldState;
      c.updatedAt = stamp;
      resolved = result.resolved[0] || null;
      persistCampaignState(state, campaignId);
    });
    return resolved;
  },

  /**
   * The crisis twin directive's INVERSE, for undoLastEvent: put the roaming
   * twin back the way it was before the undone event's directive touched it.
   * The caller passes the declarative withdrawal crisisLifecycle.crisisWithdraw
   * composed from the popped log entry ({ action, type, twin }); the legacy
   * eventType vocabulary is still accepted for older callers.
   *
   * 'withdraw' (onset undone) — the inject directive upserted the twin:
   * withdraw it, but ONLY while it still looks directive-born and unevolved
   * (active, originating here, not spread beyond this settlement). Once the
   * pulse has spread it the crisis has a life of its own — leave it and say
   * so on the console rather than silently rewrite world history. When the
   * pre-event snapshot (`twin`, stamped on logEntry.undo by applyEvent)
   * holds an earlier stressor the upsert overwrote, that copy is restored
   * instead.
   *
   * 'restore' (resolution undone) — the resolve directive resolved the twin
   * into an echo and queued its residual aftermath: restore the snapshotted
   * pre-resolution twin over the echo (same stable id) and drop the still-
   * PENDING residual proposals that resolution queued. No snapshot (a legacy
   * log entry) → nothing restorable; a re-ignited ACTIVE stressor already
   * under the id is left alone.
   *
   * @param {string} campaignId
   * @param {{ action?: 'withdraw'|'restore', eventType?: string, type?: string, settlementId?: string|number, twin?: Object|null }} [args]
   * @returns {boolean} whether the world state changed
   */
  undoCampaignStressorBridge: (campaignId, { action, eventType, type, settlementId, twin = null } = {}) => {
    let changed = false;
    const act = action
      || (eventType === 'APPLY_STRESSOR' ? 'withdraw'
        : eventType === 'RESOLVE_STRESSOR' ? 'restore'
          : null);
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const worldState = ensureWorldState(c.worldState, c);
      const roamingType = pulseTypeForStressorKey(type) || type;
      if (!roamingType) return;
      const sid = String(settlementId || '');
      const stressors = (worldState.stressors || []).map(raw => normalizeStressor(raw));
      const sameType = st => String(st.type).toLowerCase() === String(roamingType).toLowerCase();

      if (act === 'withdraw') {
        const current = stressors.find(st => st.status === 'active'
          && sameType(st)
          && String(st.originSettlementId || '') === sid);
        if (!current) return;
        if ((current.affectedSettlementIds || []).map(String).some(id => id !== sid)) {
          console.debug(`[campaignSlice] undo left roaming stressor ${current.id} in place — the pulse has spread it beyond ${sid}.`);
          return;
        }
        const remaining = stressors.filter(st => st.id !== current.id);
        c.worldState = {
          ...worldState,
          stressors: twin ? [...remaining, normalizeStressor(cloneJson(twin))] : remaining,
        };
      } else if (act === 'restore') {
        if (!twin) {
          console.debug(`[campaignSlice] undo could not un-resolve the roaming ${roamingType} twin at ${sid} — the log entry predates the twin snapshot.`);
          return;
        }
        const restored = normalizeStressor(cloneJson(twin));
        const occupant = stressors.find(st => st.id === restored.id);
        if (occupant && occupant.status === 'active') {
          console.debug(`[campaignSlice] undo left roaming stressor ${occupant.id} in place — it re-ignited after the undone resolution.`);
          return;
        }
        // Replace the echo (same stable id — echoOf coalesces on it) with the
        // pre-resolution twin, and drop the resolution's queued aftermath:
        // residualOutcome stamps the twin's id on the proposal's condition.
        c.worldState = {
          ...worldState,
          stressors: [...stressors.filter(st => !(st.id === restored.id
            || (st.status === 'residual' && sameType(st) && String(st.originSettlementId || '') === sid))), restored],
          proposals: (worldState.proposals || []).filter(p => !(p.status === 'pending'
            && p.outcome?.candidateType === 'stressor_residual'
            && String(p.outcome?.condition?.triggeredAt?.sourceEventTargetId || '') === restored.id)),
        };
      } else {
        return;
      }
      c.updatedAt = now;
      changed = true;
      persistCampaignState(state, campaignId);
    });
    return changed;
  },

  setCampaignRegionalGraph: (campaignId, regionalGraph) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.regionalGraph = ensureRegionalGraph(regionalGraph);
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: now });
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  queueCampaignRegionalImpacts: (campaignId, impacts = []) => {
    let graph = null;
    let queued = false;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.regionalGraph = queueRegionalImpacts(beforeGraph, impacts, { now });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: now });
      c.updatedAt = now;
      graph = c.regionalGraph;
      queued = true;
      persistCampaignState(state, campaignId);
    });
    if (queued) {
      track(EVENTS.REGIONAL_IMPACT_QUEUED, {
        count: Array.isArray(impacts) ? impacts.length : 0,
        channel_types: channelTypesFromImpacts(impacts),
      });
    }
    return graph;
  },

  setRegionalImpactStatus: (campaignId, impactId, status, patch = {}, opts = {}) => {
    let graph = null;
    let impactEvent = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      const impact = (beforeGraph.queuedImpacts || []).find(i => i.id === impactId);
      // Flatten the draft impact to plain telemetry INSIDE set(); was_dm_action
      // defaults true (this action is DM-initiated unless a caller says otherwise).
      if (impact) impactEvent = extractRegionalImpactDecision(impact, status, opts.wasDmAction !== false);
      c.regionalGraph = domainSetRegionalImpactStatus(beforeGraph, impactId, status, patch, { now });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: now });
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    if (impactEvent) track(EVENTS.REGIONAL_IMPACT_STATUS_CHANGED, impactEvent);
    return graph;
  },

  ignoreQueuedRegionalImpact: (campaignId, impactId) => {
    return get().setRegionalImpactStatus(campaignId, impactId, 'ignored');
  },

  advanceCampaignRegionalImpacts: (campaignId, ticks = 1, options = {}) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = options.now || new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.wizardNews = advanceWizardNewsFeed(c.wizardNews, ticks, { now });
      c.regionalGraph = advanceRegionalImpacts(beforeGraph, ticks, {
        ...options,
        currentTick: c.wizardNews.currentTick,
        now,
      });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, {
        tick: c.wizardNews.currentTick,
        createdAt: now,
      });
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  applyQueuedRegionalImpact: async (campaignId, impactId) => {
    // ORDERED writes to prevent split truth: the settlement is the source
    // of truth for the condition, so the campaign graph must NOT advertise the
    // impact 'applied' until that settlement is durably saved. Previously both
    // writes were fire-and-forget and unordered, so a settlement-save failure
    // after the campaign synced left a reload showing "applied" with no
    // condition — permanently (the applied status blocks re-apply). We now never
    // mark applied until the settlement save succeeds, so there is nothing to
    // roll back.
    let prepared = /** @type {any} */ (null);
    // Phase 1 — apply the impact to the settlement LOCALLY (optimistic), capture
    // a clone for the durable write, but leave the campaign graph 'queued'.
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const graph = ensureRegionalGraph(c.regionalGraph);
      const impact = graph.queuedImpacts.find(i => i.id === impactId);
      if (!impact || !isRegionalImpactAvailable(impact)) return;
      // DM accepting a cross-settlement impact — the regional permission moment.
      // Flatten the draft impact before set() revokes it.
      const impactDecision = extractRegionalImpactDecision(impact, 'applied', true);

      const saveIdx = state.savedSettlements.findIndex(save =>
        String(save.id) === String(impact.targetSettlementId)
      );
      if (saveIdx === -1) return;

      const save = state.savedSettlements[saveIdx];
      // Stamp the campaign clock (batch apply reuses this action per impact, so
      // it inherits the stamp).
      const nextSettlement = applyRegionalImpact(save.settlement, impact, { tick: campaignClockTick(c) });
      if (!nextSettlement) return;

      const now = new Date().toISOString();
      let systemState = save.campaignState?.systemState || null;
      try {
        systemState = deriveSystemState(nextSettlement);
      } catch (e) {
        console.warn('[campaignSlice] deriveSystemState failed for regional impact', e);
      }

      const campaignState = campaignStateForRegionalImpact(state, save, systemState, now);
      state.savedSettlements[saveIdx] = { ...save, settlement: nextSettlement, campaignState, timestamp: now };

      if (state.activeSaveId && String(state.activeSaveId) === String(save.id)) {
        state.settlement = nextSettlement;
        state.systemState = systemState;
        state.editedAt = now;
      }

      prepared = {
        saveId: save.id,
        settlement: cloneJson(nextSettlement),
        campaignState: cloneJson(campaignState),
        impact: cloneJson(impact),
        now,
        impactDecision,
      };
    });

    if (!prepared) return null;

    // Phase 2 — persist the SETTLEMENT first and AWAIT it. persistSaveUpdate
    // resolves false (never throws) and reports via campaignSyncError on failure.
    const settlementSaved = await persistSaveUpdate(prepared.saveId, {
      settlement: prepared.settlement,
      campaignState: prepared.campaignState,
    });
    if (!settlementSaved) {
      // Settlement never reached the cloud — leave the campaign impact 'queued'
      // so the two agree on reload. The local optimistic condition reconciles on
      // the next successful save / re-apply (idempotent). Failure already surfaced
      // via campaignSyncError.
      return null;
    }

    // Phase 3 — settlement is durable: NOW mark the campaign graph applied + sync.
    let result = /** @type {any} */ (null);
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      // Guard against a concurrent change between phases: only mark applied if the
      // impact is STILL queued. If a concurrent Ignore (or any status change)
      // landed during the awaited save, don't clobber it back to 'applied' — the
      // settlement is already saved with the condition; the DM's decision wins.
      if (!beforeGraph.queuedImpacts.find(i => i.id === impactId && i.status === 'queued')) return;
      c.regionalGraph = domainSetRegionalImpactStatus(beforeGraph, impactId, 'applied', { appliedAt: prepared.now }, { now: prepared.now });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: prepared.now });
      c.updatedAt = prepared.now;
      persistCampaignState(state, campaignId);
      result = {
        saveId: prepared.saveId,
        settlement: prepared.settlement,
        campaignState: prepared.campaignState,
        timestamp: prepared.now,
        impact: prepared.impact,
      };
    });

    if (result && prepared.impactDecision) {
      track(EVENTS.REGIONAL_IMPACT_STATUS_CHANGED, prepared.impactDecision);
    }
    return result;
  },

  resolveRegionalImpact: async (campaignId, impactId) => {
    // ORDERED writes to prevent split truth (mirroring applyQueuedRegionalImpact):
    // the settlement is the source of truth for the condition. Resolving REMOVES the
    // active condition, so the campaign graph must NOT advertise the impact 'resolved'
    // until that condition-removed settlement is durably saved. Previously the graph
    // flipped to 'resolved' synchronously while the settlement save was fire-and-forget,
    // so a save failure left a reload showing 'resolved' with the condition STILL present
    // — permanently (the resolved status blocks re-resolve). We now never mark resolved
    // until the settlement save succeeds, so there is nothing to roll back.
    let prepared = /** @type {any} */ (null);
    // Phase 1 — remove the condition from the settlement LOCALLY (optimistic), capture
    // a clone for the durable write, but leave the campaign graph impact 'applied'.
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const graph = ensureRegionalGraph(c.regionalGraph);
      const impact = graph.queuedImpacts.find(i => i.id === impactId);
      if (!impact || impact.status !== 'applied') return;

      const saveIdx = state.savedSettlements.findIndex(save =>
        String(save.id) === String(impact.targetSettlementId)
      );
      if (saveIdx === -1) return;

      const save = state.savedSettlements[saveIdx];
      const condition = conditionFromRegionalImpact(impact);
      const nextSettlement = withoutActiveCondition(save.settlement, condition.id);
      const now = new Date().toISOString();
      let systemState = save.campaignState?.systemState || null;
      try {
        systemState = deriveSystemState(nextSettlement);
      } catch (e) {
        console.warn('[campaignSlice] deriveSystemState failed while resolving regional impact', e);
      }

      const campaignState = campaignStateForRegionalImpact(state, save, systemState, now);
      state.savedSettlements[saveIdx] = { ...save, settlement: nextSettlement, campaignState, timestamp: now };

      if (state.activeSaveId && String(state.activeSaveId) === String(save.id)) {
        state.settlement = nextSettlement;
        state.systemState = systemState;
        state.editedAt = now;
      }

      prepared = {
        saveId: save.id,
        settlement: cloneJson(nextSettlement),
        campaignState: cloneJson(campaignState),
        impact: cloneJson(impact),
        now,
      };
    });

    if (!prepared) return null;

    // Phase 2 — persist the SETTLEMENT first and AWAIT it. persistSaveUpdate
    // resolves false (never throws) and reports via campaignSyncError on failure.
    const settlementSaved = await persistSaveUpdate(prepared.saveId, {
      settlement: prepared.settlement,
      campaignState: prepared.campaignState,
    });
    if (!settlementSaved) {
      // The condition-removed settlement never reached the cloud — leave the campaign
      // impact 'applied' so the two agree on reload (cloud still carries the condition,
      // graph still 'applied'). The local optimistic removal reconciles on the next
      // successful save / re-resolve (idempotent). Failure already surfaced via
      // campaignSyncError.
      return null;
    }

    // Phase 3 — settlement is durable: NOW mark the campaign graph resolved + sync.
    let result = /** @type {any} */ (null);
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      // Guard against a concurrent change between phases: only mark resolved if the
      // impact is STILL applied. If a concurrent status change landed during the
      // awaited save, don't clobber it — the settlement is already saved without the
      // condition; the latest decision wins.
      if (!beforeGraph.queuedImpacts.find(i => i.id === impactId && i.status === 'applied')) return;
      c.regionalGraph = domainSetRegionalImpactStatus(beforeGraph, impactId, 'resolved', { resolvedAt: prepared.now }, { now: prepared.now });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: prepared.now });
      c.updatedAt = prepared.now;
      persistCampaignState(state, campaignId);
      result = {
        saveId: prepared.saveId,
        settlement: prepared.settlement,
        campaignState: prepared.campaignState,
        timestamp: prepared.now,
        impact: prepared.impact,
      };
    });

    if (result) {
      // result.impact is a cloneJson (plain, not a revoked draft) — safe to read.
      track(EVENTS.REGIONAL_IMPACT_STATUS_CHANGED, extractRegionalImpactDecision(result.impact, 'resolved', true));
    }
    return result;
  },

  applyAllQueuedRegionalImpacts: async (campaignId) => {
    const graph = get().getCampaignRegionalGraph(campaignId);
    const ids = graph.queuedImpacts
      .filter(impact => isRegionalImpactAvailable(impact))
      .map(impact => impact.id);
    // Sequential await — each impact's settlement save completes (and its campaign
    // mark) before the next, keeping the ordered-write guarantee per impact.
    const results = [];
    for (const id of ids) {
      const r = await get().applyQueuedRegionalImpact(campaignId, id);
      if (r) results.push(r);
    }
    return results;
  },

  ignoreAllQueuedRegionalImpacts: (campaignId) => {
    const graph = get().getCampaignRegionalGraph(campaignId);
    const ids = graph.queuedImpacts
      .filter(impact => impact.status === 'queued')
      .map(impact => impact.id);
    for (const id of ids) {
      get().setRegionalImpactStatus(campaignId, id, 'ignored');
    }
    return ids.length;
  },

  getCampaignRegionalGraph: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    return ensureRegionalGraph(c?.regionalGraph);
  },
});
