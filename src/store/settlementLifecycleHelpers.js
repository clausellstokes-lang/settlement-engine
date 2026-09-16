/**
 * settlementLifecycleHelpers.js — the module-level helpers of settlementSlice.js
 * that live OUTSIDE the slice literal, moved out verbatim by THE DECOMPOSITION
 * WAVE (lane D).
 *
 * Four unrelated-looking pieces that share one property: none of them closes over
 * `set` or `get` from the slice factory, so relocating them cannot change a single
 * store behaviour.
 *
 *   - _dimsSummary — the coarse SystemState before/after slice for an ActionResult.
 *   - DERIVED_CONFIG_KEYS / stripDerivedConfigKeys — the derived-config strip.
 *   - rippleEventThroughWorld — the world half of applyEvent.
 *   - activateFaithIfEntitled — W-F6, the store side of the premium faith gate.
 *   - resetSettlementIdentity — THE single chokepoint for clearing session-only
 *     identity residue on any active-settlement swap.
 *
 * DERIVED_CONFIG_KEYS and stripDerivedConfigKeys are re-exported from
 * settlementSlice.js, which stays the public import site for their consumers.
 */
import { activateLatentPantheon } from '../domain/worldPulse/latentPantheon.js';
import { propagateRegionalEvent } from '../domain/region/index.js';
import { mapEventToPartyImpact } from '../domain/events/partyEventLinkage.js';
import { canonRelationshipTargetFor } from '../domain/events/canonRelationshipLinkage.js';
import { twinDirectiveForEvent } from '../domain/crisisLifecycle.js';
import { saveEnvelopeFor, visibleSettlementIdsForCampaign } from './settlementSliceHelpers.js';

/**
 * Coarse SystemState summary for an ActionResult before/after slice — the four
 * dimension values (or null), never a clone. Tolerant of a null/partial state.
 * @param {*} ss
 * @returns {{resilience:number|null, volatility:number|null, externalThreat:number|null, resourcePressure:number|null}|null}
 */
export function _dimsSummary(ss) {
  if (!ss || typeof ss !== 'object') return null;
  const pick = (d) => (d && typeof d.value === 'number' ? d.value : null);
  return {
    resilience:       pick(ss.resilience),
    volatility:       pick(ss.volatility),
    externalThreat:   pick(ss.externalThreat),
    resourcePressure: pick(ss.resourcePressure),
  };
}

// ── Derived-config strip ────────────────────────────────────────────────
// settlement.config is the RESOLVED effectiveConfig snapshot: pipeline steps
// write purely-derived keys onto it (resolveStress → stressType/stressTypes/
// intendedStressTypes/_population; isolationGenerator → _magicTradeOnly;
// generateEconomy → _neighbourEconBias; resolveConfig → tier/magicLevel/
// terrainType; resolveNeighbour → neighborRelationship). Display and sim
// consumers read those keys from
// settlement.config, so they must stay there — but they must NOT re-enter
// the pipeline as user input: emergent stress would be re-rolled as
// user-forced stress (with a false "selected by user config" receipt) and
// stale isolation/economy flags would outlive their causes.
// settlement._config (the raw pre-resolution config) is the preferred
// regeneration input; this strip protects the fallback for settlements
// persisted before _config existed. Overwritten-in-place keys (floored
// priorityMilitary, magicExists-zeroed priorityMagic, resolved route/threat/
// culture) are NOT stripped here — their raw values are unrecoverable from
// the snapshot and are restored via the _config path instead.
export const DERIVED_CONFIG_KEYS = Object.freeze([
  'stressType', 'stressTypes', 'intendedStressTypes',
  '_magicTradeOnly', '_neighbourEconBias', '_neighbourEconMode', '_isolationInfraType',
  '_population',
  'tier', 'magicLevel', 'terrainType',
  'neighborRelationship',
]);

export function stripDerivedConfigKeys(config) {
  if (!config || typeof config !== 'object') return config;
  const out = { ...config };
  for (const key of DERIVED_CONFIG_KEYS) delete out[key];
  return out;
}

/**
 * The world-ripple half of applyEvent: AFTER the settlement event has committed
 * and persisted, propagate it into the campaign's world engine. Three best-
 * effort, canon-only consumers (campaign is set only in canon), each guarded so
 * a linkage failure can never undo the settlement event that already applied:
 *   1. Regional propagation — the change ripples to visible neighbours.
 *   2. Crisis lifecycle — the DOMAIN names the transition (twinDirectiveForEvent:
 *      'inject' on onset/escalate so the pulse ages the crisis; 'resolve' on
 *      resolution so the pulse stops aging one the DM already ended). This is the
 *      ONE place the store obeys it, so a new crisis event type cannot forget its
 *      twin — the directive lands here by construction, not in a per-event bridge.
 *   3. Party impact — a party-caused event with a world-scale analog also ripples
 *      through the party-impact pipeline (active conditions, faction/NPC world
 *      state, regional propagation, Wizard News).
 * Timestamps reuse this apply's editedAt stamp so propagation stamps no
 * wall-clock time of its own (replay is byte-identical — same args, same graph).
 */
export function rippleEventThroughWorld({ afterState, campaign, event, beforeEnvelope, beforeSave, activeSaveId, afterCampaignState }) {
  if (campaign && beforeEnvelope && typeof afterState.setCampaignRegionalGraph === 'function') {
    const afterEnvelope = saveEnvelopeFor(
      activeSaveId,
      beforeSave,
      afterState.settlement,
      afterCampaignState || beforeSave?.campaignState,
    );
    const result = propagateRegionalEvent({
      graph: campaign.regionalGraph,
      beforeSettlement: beforeEnvelope,
      afterSettlement: afterEnvelope,
      event,
      activeSettlementId: activeSaveId,
      visibleSettlementIds: visibleSettlementIdsForCampaign(afterState, campaign),
      maxDepth: 2,
      waveDecay: 0.45,
      now: afterState.editedAt,
    });
    if (result.impacts.length > 0) {
      afterState.setCampaignRegionalGraph(campaign.id, result.graph);
      // The canon-edit cross-settlement propagation moment — this path fired NO
      // analytics. result is a plain domain return; emit the redacted summary.
      Promise.all([
        import('../lib/analytics.js'),
        import('../lib/regionalFingerprint.js'),
      ]).then(([{ track, EVENTS }, { extractRegionalPropagation }]) => {
        const p = extractRegionalPropagation({
          impacts: result.impacts, changes: result.localDelta?.changes,
          genesis: 'canon_edit', maxDepth: 2,
        });
        if (p) track(EVENTS.REGIONAL_PROPAGATION_APPLIED, p);
      }).catch(() => {});
    }
  }

  const twinDirective = campaign ? twinDirectiveForEvent(event) : null;
  if (twinDirective) {
    try {
      if (twinDirective.action === 'inject'
        && typeof afterState.injectCampaignStressor === 'function') {
        afterState.injectCampaignStressor(campaign.id, {
          ...twinDirective.stressor,
          originSettlementId: String(activeSaveId),
          affectedSettlementIds: [String(activeSaveId)],
        });
      } else if (twinDirective.action === 'resolve'
        && typeof afterState.resolveCampaignStressor === 'function') {
        afterState.resolveCampaignStressor(campaign.id, {
          type: twinDirective.type,
          settlementId: String(activeSaveId),
          now: afterState.editedAt,
        });
      }
    } catch { /* the world half is best-effort */ }
  }

  if (event?.partyCaused && campaign) {
    try {
      const action = mapEventToPartyImpact(event, activeSaveId);
      const record = afterState.recordPartyImpact;
      if (action && typeof record === 'function') {
        Promise.resolve(record(campaign.id, action)).catch(() => { /* world ripple is best-effort */ });
      }
    } catch { /* linkage is best-effort */ }
  }

  // Lane 2 (domain-events-region-1): a NON-party DM canon relationship event
  // (BROKERED_ALLIANCE / SETTLEMENT_DISPUTE / OPENED_TRADE_ROUTE, or an
  // APPLY_STRESSOR carrying an instigator) ALSO ripples to the campaign's pulse
  // relationship edge — the worldState.relationshipStates the war layer reads +
  // the regionalGraph edge label — mirroring the settlement-level neighbourNetwork
  // mutation into the world engine. The light mapping gate avoids the lazy engine
  // load for every non-relationship event; the undo snapshot was captured in
  // applyEvent (logEntry.undo.relationshipRipple) and is reversed synchronously by
  // reverseCanonRelationshipRipple, so this async ripple is never awaited for undo.
  if (campaign && !event?.partyCaused) {
    try {
      const relRipple = afterState.recordCanonRelationshipRipple;
      if (typeof relRipple === 'function' && canonRelationshipTargetFor(event, activeSaveId)) {
        Promise.resolve(relRipple(campaign.id, { event, homeId: activeSaveId }))
          .catch(() => { /* world ripple is best-effort */ });
      }
    } catch { /* linkage is best-effort */ }
  }
}

/**
 * W-F6 THE PREMIUM GATE — the store-side half of the latent-pantheon activation
 * seam (owner 2026-07-10; PHASE4_FAITH_DELTA). The generation pipeline bakes a
 * starting pantheon LATENTLY into every seed (config.latentPantheon), identical
 * for all tiers — tier never touches generation. This is where the key turns:
 * a PREMIUM (or elevated) account activates on generation-complete / save-open,
 * copying the latent patron + cults into the LIVE embeds via the pure, rng-free,
 * idempotent activateLatentPantheon. FREE / ANON never activate — the latent
 * record stays private (stripped from every public projection, publicSafe.js /
 * migration 128) and the engine stays the certified inert ground state (the
 * neutrality theorem). Defensive: any auth-read failure ⇒ no activation.
 * @template T
 * @param {T} settlement
 * @param {() => any} get  the store getter (auth tier + role live here)
 * @returns {T}
 */
export function activateFaithIfEntitled(settlement, get) {
  try {
    const s = typeof get === 'function' ? get() : null;
    const entitled = s?.auth?.tier === 'premium'
      || (typeof s?.isElevated === 'function' && s.isElevated());
    return entitled ? activateLatentPantheon(settlement) : settlement;
  } catch {
    return settlement;
  }
}

/**
 * resetSettlementIdentity — THE single chokepoint for clearing a settlement's
 * session-only identity residue on ANY active-settlement swap: generateSettlement,
 * hydrateFromSave (open a save), setSettlement, clearSettlement. Every field reset
 * here is session-scoped (never persisted). Save-scoped pending intents are the
 * one optional exception: their stable owner/target envelopes can remain in the
 * session while projections hide them from every other save, so returning to the
 * original save recovers reviewed work. Fresh generation/set/clear paths still
 * discard them. Every other field must NOT survive an identity change, or the new
 * settlement inherits the previous one's in-flight state — the exact cross-
 * identity leak class the slice documents (F17/F19):
 *   • a stale successor prompt fires on the wrong lineage;
 *   • B renders A's draft version timeline;
 *   • the pipeline rail renders A's "how this was simulated" receipts against B's
 *     dossier (components-dossier-5);
 *   • a stale regen-delta card describes the prior settlement.
 * Structural prevention (state-lifecycle-3 / store-5): the ONE writer for this
 * class, so a NEW load path cannot re-open the leak by hand-maintaining its own
 * partial reset list — every entry point routes through here.
 *
 * NOTE: the LIFECYCLE slots that DIFFER by path (settlement / activeSaveId / phase /
 * eventLog / locks / canonizedAt / systemState / generatedAt / editedAt /
 * lastExportAt / aiSettlement) are deliberately NOT reset here — each caller sets
 * them itself: hydrateFromSave from the save's persisted campaignState; generate /
 * set / clear to their own DRAFT defaults.
 *
 * @param {*} state the Immer store draft
 * @param {{ preservePendingEdits?:boolean }} [options]
 */
export function resetSettlementIdentity(state, { preservePendingEdits = false } = {}) {
  if (!preservePendingEdits) {
    state.pendingEditsQueue   = [];
    state.pendingEditsClock   = 0;
    state.pendingEditReceipts = [];
  } else {
    // Only save-owned work is recoverable by later navigation. Draft-owned and
    // ownerless legacy records cannot prove a durable destination; drop them at
    // the saved-identity boundary rather than projecting them into the next save.
    state.pendingEditsQueue = (state.pendingEditsQueue || [])
      .filter((intent) => intent?.ownerRef?.scope === 'save');
    state.pendingEditReceipts = (state.pendingEditReceipts || [])
      .filter((receipt) => receipt?.ownerRef?.scope === 'save');
    if (state.pendingEditsQueue.length === 0) state.pendingEditsClock = 0;
  }
  state.pendingSuccession     = null;
  state.canonEventCommandFence = null;
  state.draftVersionHistory   = [];
  // The generation-id spine is per-generation identity: a loaded/new settlement
  // must never inherit the prior generation's id (a save re-derives its own from
  // seed + generatedAt; a fresh generate mints one after the pipeline).
  state.generationId          = null;
  // The pipeline rail + reveal overlay are per-run receipts (components-dossier-5).
  state.pipelineHistory       = [];
  state.pipelineRevealActive  = false;
  // A stale regenerate-delta card must not describe an unrelated settlement.
  state.lastRegenerationDelta = null;
  // Any pending single/batch event preview — and any staged composer intent —
  // belongs to the prior identity.
  state.pendingPreview        = null;
  state.composerIntent        = null;
}
