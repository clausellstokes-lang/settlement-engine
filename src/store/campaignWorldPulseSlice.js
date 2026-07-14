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
// Light, first-paint-safe world-state helpers ONLY. Imported from their leaf
// modules (never the `export *` barrel) so the barrel's whole re-export graph
// can't be pulled into the boot path. The heavy simulation machinery is loaded
// lazily via loadWorldEngine() below.
import {
  canonizeWorldState,
  ensureWorldState,
  updateProposalStatus as domainUpdateWorldPulseProposalStatus,
} from '../domain/worldPulse/worldState.js';
import { normalizeSimulationRules, worldProgressionOf, advancesOnOpen } from '../domain/worldPulse/simulationRules.js';
import {
  cloneJson, cacheCampaignState, syncCampaignSnapshot,
  flushWorldPulsePersist, findActiveCampaign, campaignSettlements,
} from './campaignSliceShared.js';
import { applyWorldPulseResultToState } from './campaignPulseHelpers.js';
import { track, EVENTS } from '../lib/analytics.js';
// The advance/resume BODY (with its advance-only fingerprint/analytics/consent
// imports) lives in the lazily-loaded ./campaignAdvanceSession.js so it stays out
// of the first-paint entry closure; this slice keeps only the light mutators +
// getters + thin guarded wrappers.
// The proposal/party/rules telemetry EXTRACTORS (pulseFingerprint.js) are reached
// ONLY from the async pulse-mutator actions below, so they load lazily via
// loadPulseFingerprint() (FP-2 reclaim) instead of riding the first-paint entry
// closure — this slice was pulseFingerprint's SOLE eager importer.
import { extractRegionalGraphSnapshot } from '../lib/regionalFingerprint.js';

// ── Lazy world-simulation engine ──────────────────────────────────────────
// The advance / preview / apply-proposal / party-impact machinery
// (advanceCampaignWorld + its whole dependency graph: relationshipEvolution,
// npcAgency, factionCompetition, institutionLifecycle, tier/population dynamics,
// applyWorldPulse, …) is the single largest first-paint contributor and is ONLY
// reachable from these async user actions. Statically importing it welded the
// full campaign simulation into first paint for anonymous visitors. We instead
// dynamic-import it here — memoized so it resolves once and every later call
// hits the cached module promise — so Rollup splits it into its own chunk that
// is fetched on the first pulse action, not on boot. Mirrors settlementSlice's
// proven loadEngine() pattern. Each consumer below is already an async action,
// so it simply awaits the load before mutating state.
let _worldEnginePromise = null;
function loadWorldEngine() {
  if (!_worldEnginePromise) {
    _worldEnginePromise = Promise.all([
      import('../domain/worldPulse/advanceCampaignWorld.js'),
      import('../domain/worldPulse/applyWorldPulse.js'),
      import('../domain/worldPulse/partyImpact.js'),
      // Light transport for the off-main-thread multi-tick advance. Loaded HERE
      // (not statically) so it rides the lazy sim chunk instead of the first-paint
      // entry closure — it's only ever used once an advance runs, which already
      // awaits this loader. It takes the sim function as a fallback, so this slice
      // keeps its no-static-worldPulse-import invariant.
      import('../lib/advanceWorkerClient.js'),
      // The multi-tick SESSION logic (pause cursor + resume orchestration). Same
      // lazy boundary: pause/resume is reachable only once an advance runs, so its
      // bytes stay OUT of the first-paint entry closure.
      import('./campaignAdvanceSession.js'),
    ]).then(([advance, apply, party, workerClient, session]) => ({
      previewCampaignWorldPulse: advance.previewCampaignWorldPulse,
      advanceCampaignWorld: advance.advanceCampaignWorld,
      // Multi-tick orchestrator (Advance-scaling): N real one-week kernel ticks
      // composed into ONE result of the same shape as the single-tick advance.
      // Re-exported by advanceCampaignWorld.js, so it rides the SAME lazy chunk —
      // no extra first-paint cost.
      simulateCampaignWorldInterval: advance.simulateCampaignWorldInterval,
      runAdvanceInterval: workerClient.runAdvanceInterval,
      runAdvanceCampaignWorld: session.runAdvanceCampaignWorld,
      runResolveIntervalMajors: session.runResolveIntervalMajors,
      // M10b catch-up body — lazified out of this eager slice (FP-2 reclaim); rides
      // the SAME lazy session chunk as the advance/resume bodies.
      runCatchUpCampaignWorld: session.runCatchUpCampaignWorld,
      applyWorldPulseProposal: apply.applyWorldPulseProposal,
      applyPartyImpact: party.applyPartyImpact,
    }));
  }
  return _worldEnginePromise;
}

// ── Lazy control-layer profile tools (Phase 5.5 CL-0) ─────────────────────
// validateSimulationProfile + the ruleset-change receipt builder live in the
// lazily-loaded simulationProfile.js leaf so the first-paint entry closure
// (byte-budgeted) carries none of it. Rules edits are async user actions, so
// they simply await this memoized loader — same pattern as loadWorldEngine.
let _profileToolsPromise = null;
function loadProfileTools() {
  if (!_profileToolsPromise) {
    _profileToolsPromise = import('../domain/worldPulse/simulationProfile.js');
  }
  return _profileToolsPromise;
}

// ── Lazy analytics fingerprint extractors ─────────────────────────────────
// The proposal/party/rules telemetry extractors are pure analytics helpers reached
// only from the async pulse-mutator actions, so they ride a memoized dynamic import
// rather than the eager entry closure (FP-2 reclaim). Each consumer is already async;
// it awaits this loader BEFORE the set()/track() that uses the extractor — for the
// inside-set() uses that means the function is resolved before the producer runs, so
// it stays available synchronously inside it, exactly as the static import was.
let _pulseFingerprintPromise = null;
function loadPulseFingerprint() {
  if (!_pulseFingerprintPromise) {
    _pulseFingerprintPromise = import('../lib/pulseFingerprint.js');
  }
  return _pulseFingerprintPromise;
}

// FROZEN progression guard (CL-0 item 4): worldProgression 'frozen' parks time
// itself — advance/resume/preview no-op at the store, the same no-op-with-
// typed-reason discipline as the isAdvanceInFlight guard. State is FULLY
// preserved (nothing is deleted or rewritten); unfreezing restores everything,
// because freezing never touched anything but the rules. worldProgressionOf is
// a virtual read: an untouched campaign has no worldProgression key and reads
// 'dm_advanced' — this guard is byte-invisible to legacy saves.
// The typed no-op result is shared (callers treat advance results as
// read-only; ADVANCE_ERROR_TEXT maps the reason to plain language).
const WORLD_FROZEN_RESULT = Object.freeze({ ok: false, reason: 'world_frozen' });
// Frozen read against the STORED rules of a campaign (advance/resume guards).
function frozenFor(get, campaignId) {
  return worldProgressionOf(findActiveCampaign(get().campaigns, campaignId)?.worldState?.simulationRules) === 'frozen';
}

// ── Cross-slice contract ──────────────────────────────────────────────────
// All 14 slices share ONE Immer store, so coupling is by shared state on the
// draft + get() method calls — not imports. This slice's contract:
//
// OWNS state:   pulseUndoStack (session-scoped; not persisted).
// PROVIDES (read via get() by other slices): recordPartyImpact — called by
//   settlementSlice.rippleEventThroughWorld on a party-caused canon event.
//   (advanceCampaignWorld → get().recordPartyImpact is a SAME-slice call.)
// CONSUMES shared state, owned elsewhere, read/written on the draft:
//   • campaigns                      — campaignSlice
//   • savedSettlements + the live active view (activeSaveId, settlement,
//     systemState, eventLog, phase, editedAt) — settlementSlice
// The pulse drain/apply/snapshot mechanics live in campaignPulseHelpers.js.
export const createCampaignWorldPulseSlice = (set, get) => ({
  // Campaign-clock (Phase C2): session-scoped stack of pre-pulse snapshots, one
  // per advance, capped PER campaign. NOT persisted — a reload clears it.
  pulseUndoStack: [],

  // In-flight guard: campaignIds with an advanceCampaignWorld (or resume) currently
  // running. Multi-tick advance is async — it awaits the interval orchestrator,
  // which yields to the event loop between tick batches — so a double-click would
  // otherwise re-enter the action TWICE and run two real tick batches off one
  // intent. We mark the campaignId here SYNCHRONOUSLY at the very top of the action
  // (before the first await) and clear it in a finally, so a second concurrent call
  // sees its campaign already in flight and no-ops. The SAME mark gates every other
  // pulse MUTATOR on this campaign (canonize / rules / apply-proposal / dismiss /
  // undo): a mutation landing during the advance's yield would be reverted by its
  // Phase-2 commit (which replaces worldState wholesale from clones lifted BEFORE
  // the yield). recordPartyImpact is deliberately NOT gated — advanceCampaignWorld
  // replays its drained party impacts through it while still marked in flight.
  // Session-scoped (an array, not a Set, so it stays Immer-/persist-friendly); a
  // reload clears it.
  advanceInFlight: [],
  /** Is an advanceCampaignWorld currently running for this campaign? Drives the
   *  disabled state of the Advance button so a second click can't fire mid-tick. */
  isAdvanceInFlight: (campaignId) =>
    (get().advanceInFlight || []).some(id => String(id) === String(campaignId)),

  // Advance-scaling Stage 3: the auto-resolve toggle. Default OFF — when the
  // multi-tick flag is ON, an Advance PAUSES at the first tick that surfaces
  // campaign-altering MAJORS so the DM gets a say (auto-resolve ON runs straight to
  // the end, resolving every major to recommended). With the multi-tick flag OFF
  // this value is inert (the single-tick path never pauses), so it changes nothing
  // in prod. UI-scoped; not persisted across reloads (a present pausedAdvance on the
  // campaign worldState rehydrates an in-flight pause instead).
  advanceAutoResolve: false,
  setAdvanceAutoResolve: (value) => set(state => { state.advanceAutoResolve = !!value; }),

  // components-dossier-4 / experience-product-fit-1 — the "while you were away"
  // digest. The M10b catch-up now fires from campaign activation (setActiveCampaign),
  // so the world can move on a path where no one is watching the Pulse tab. This
  // TRANSIENT field carries the just-ran catch-up's legibility payload for the
  // banner (RealmDashboard / WorldPulsePanel): `{ campaignId, status:'running' }`
  // while the capped loop runs, then `{ campaignId, weeksCaughtUp, capped, majors[],
  // error }` when it settles. NOT persisted (partialize omits it; a top-level field,
  // never inside worldState) — a reload clears it, exactly like pulseUndoStack.
  // Written by runCatchUpCampaignWorld (the lazy body); the digest text is built
  // there so no chronicle-grounding bytes reach the first-paint closure.
  livingCatchUp: null,
  /** Dismiss the "while you were away" digest banner. */
  dismissLivingCatchUp: () => set(state => { state.livingCatchUp = null; }),

  previewCampaignWorldPulse: async (campaignId, interval = 'one_month', options = {}) => {
    const state = get();
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return null;
    // FROZEN guard (CL-0): preview is an advance-shaped read, so it honors the
    // EFFECTIVE rules it would run under — a dialog previewing an unfrozen
    // draft over a frozen campaign still works (that is the what-if the dialog
    // exists for); a frozen effective world previews nothing.
    if (worldProgressionOf(options.simulationRules || campaign.worldState?.simulationRules) === 'frozen') return null;
    // Load the heavy preview machinery only once we know there's a campaign to
    // preview (keeps the not-found path from touching the lazy engine chunk).
    const { previewCampaignWorldPulse: domainPreviewCampaignWorldPulse } = await loadWorldEngine();
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
    // Advance-concurrency guard — see the advanceInFlight contract above. A
    // mutation during a running multi-tick advance would be reverted by its
    // Phase-2 commit (which replaces worldState wholesale).
    if (get().isAdvanceInFlight(campaignId)) return null;
    // §1.3 realm-shape telemetry loads lazily (kept out of the first-paint closure) —
    // resolved BEFORE set() so it can flatten the draft regionalGraph to plain enums/
    // bands inside the Immer producer. Best-effort: a chunk-load failure never breaks
    // the canonize (telemetry is optional).
    let realmShape = null;
    try { ({ realmShape } = await import('../lib/constructionUsage.js')); } catch { /* telemetry optional */ }
    let campaignPersist = /** @type {any} */ (null);
    let settlementCount = 0;
    let regionalSnapshot = /** @type {any} */ (null);
    let realmShapeSummary = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const saves = campaignSettlements(state, campaignId);
      settlementCount = saves.length;
      c.worldState = canonizeWorldState(c.worldState, now, c);
      // Compute the regional-topology snapshot while the graph draft is live.
      regionalSnapshot = extractRegionalGraphSnapshot(c.regionalGraph);
      if (realmShape) realmShapeSummary = realmShape(c.regionalGraph, saves);
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (campaignPersist) {
      // §1.3 realm-construction grouping: realm shape (count band, tier mix, topology
      // class) enriches the previously count-only world_canonized fire.
      track(EVENTS.WORLD_CANONIZED, { settlement_count: settlementCount, ...(realmShapeSummary || {}) });
      if (regionalSnapshot) track(EVENTS.REGIONAL_GRAPH_SNAPSHOT, regionalSnapshot);
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return campaignPersist?.snapshot?.find(c => c.id === campaignId)?.worldState || null;
  },

  /**
   * Phase 5.5 KEYSTONE — the ENTITLED spatial opt-in at the canonize seam. Stamps
   * the NEW `worldState.spatialCanonVersion` marker and freezes an immutable
   * spatial digest (territory / gates / neighbour tiers / distance matrix / route
   * receipts) into `worldState.spatialDigest`. This is a DISTINCT action from the
   * plain canonizeCampaignWorld so the aspatial path stays byte-identical: an
   * existing campaign that never opts in carries NO marker and NO digest ⇒ its
   * bytes never change (the dormancy contract).
   *
   * The entitlement + generated-map gates are read HERE, at the store call site
   * (mirroring settlementSlice's tier split); the domain module stays tier-blind.
   * The pack.cells capture is an INJECTED seam (`options.captureSpatialPack`) —
   * the live-iframe capture is a fence-bounded follow-up (see the KEYSTONE
   * report), so the default returns null and the action cleanly no-ops (writing
   * NOTHING) rather than persist a partial digest. The pure digest builder is
   * loaded via a DYNAMIC import so src/domain/spatial never enters the first-paint
   * static closure.
   *
   * Re-canonize (a later placement/forced-road after opt-in) simply calls this
   * again: it re-captures, re-derives, and BUMPS spatialCanonVersion. The digest
   * is NEVER re-derived on load or per tick — only by this explicit action.
   *
   * @param {string} campaignId
   * @param {{ captureSpatialPack?: (ctx:{campaignId:string, get:Function}) =>
   *   Promise<{pack:any, placements:Array<{id:any,cellId:any}>}|null> }} [options]
   * @returns {Promise<{ok:boolean, reason?:string, spatialCanonVersion?:number, digestBytes?:number}>}
   */
  canonizeCampaignWorldSpatial: async (campaignId, options = {}) => {
    // Advance-concurrency guard — a spatial canonize is a worldState mutation, so
    // it is blocked mid-advance for the same reason the other pulse mutators are.
    if (get().isAdvanceInFlight(campaignId)) return { ok: false, reason: 'advance_in_flight' };
    const state = get();
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return { ok: false, reason: 'not_found' };
    // ENTITLEMENT — read at the store call site (settlementSlice tier-split
    // pattern). The domain stays tier-blind; the key turns HERE.
    if (state.auth?.tier !== 'premium') return { ok: false, reason: 'not_entitled' };
    // GENERATED maps only (II.5-3): an imported / custom-backdrop map has no
    // persisted terrain to route on, so it stays aspatial (byte-identical).
    if (state.mapState?.customBackdrop?.imageUrl) return { ok: false, reason: 'not_generated_map' };
    // Delegate the capture + digest build + size guard + persist to the lazily-
    // loaded body — it (and the whole src/domain/spatial graph it pulls) stays OUT
    // of the first-paint entry closure. The cheap gates above ran synchronously so
    // a non-entitled / imported-map / mid-advance reach is blocked before the load.
    const { runSpatialCanonize } = await import('./campaignSpatialCanonize.js');
    return runSpatialCanonize({ set, get, campaignId, options });
  },

  updateCampaignSimulationRules: async (campaignId, patch = {}) => {
    // Advance-concurrency guard — see the advanceInFlight contract above. Rules
    // edited mid-advance would be silently reverted by the Phase-2 commit (the
    // running interval computed from the OLD rules), so block the write instead.
    if (get().isAdvanceInFlight(campaignId)) return null;
    // CL-0: the merge/canonicalize/diff/receipt work is pure and rides the lazy
    // profile-tools chunk (loaded BEFORE set(), used synchronously inside it).
    const { prepareRulesUpdate } = await loadProfileTools();
    // The rules-values telemetry extractor also loads lazily (pulseFingerprint);
    // used after set(), so any order before the track() below is fine.
    const { extractSimulationRules } = await loadPulseFingerprint();
    let campaignPersist = /** @type {any} */ (null);
    let normalizedRules = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const worldState = ensureWorldState(c.worldState, c);
      // prepareRulesUpdate merges + canonicalizes (validateSimulationProfile →
      // normalizeSimulationRules, so this write stays the single normalization
      // choke point) and, on any EFFECTIVE change, folds a ruleset-change
      // receipt into the conditionally-materialized worldState.rulesetLog
      // (OBJECT keyed rc_<tick>_<seq>) + appends a kind:'ruleset_change' realm
      // entry to the wizard news. No effective change ⇒ nextWorldState carries
      // no receipt and nextWizardNews is null — byte-invisible. The plain
      // objects it returns are built OUTSIDE the draft so the telemetry read
      // below is never a revoked Immer proxy.
      const prepared = prepareRulesUpdate(worldState, patch || {}, c.wizardNews, now);
      normalizedRules = prepared.canonical;
      c.worldState = prepared.nextWorldState;
      if (prepared.nextWizardNews) c.wizardNews = prepared.nextWizardNews;
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
    // In-flight guard (checked + set SYNCHRONOUSLY, before the first await below):
    // multi-tick advance yields to the event loop between tick batches, so a
    // double-click would otherwise re-enter this async action and run a SECOND real
    // tick batch off one intent. If already advancing, no-op with a typed result so
    // the caller can tell it apart from a real advance. Cleared in the finally below.
    if (get().isAdvanceInFlight(campaignId)) {
      return { ok: false, reason: 'advance_in_flight' };
    }
    // Parked-pause guard (checked SYNCHRONOUSLY): a campaign with an OUTSTANDING
    // pausedAdvance cursor — a multi-tick interval that paused for DM verdicts,
    // including one rehydrated by a reload-into-paused — is mid-interval, not idle. A
    // fresh Advance over it would run a NEW interval, then clobber the parked cursor
    // in Phase 2, silently discarding the in-flight interval (lost ticks). So no-op
    // with a typed result; the caller must resolveIntervalMajors (resume) or
    // undoLastPulse (abandon) to clear the pause first. The single-tick path never
    // sets pausedAdvance, so this is inert when the flag is OFF.
    if (get().getPausedAdvance(campaignId)) {
      return { ok: false, reason: 'advance_paused' };
    }
    // FROZEN guard (CL-0, checked synchronously like the guards above): a
    // frozen world does not advance. Typed no-op so the caller's toast can
    // explain in plain language; unfreeze in Simulation rules to resume.
    if (frozenFor(get, campaignId)) {
      return WORLD_FROZEN_RESULT;
    }
    set(state => {
      state.advanceInFlight = [...(state.advanceInFlight || []), campaignId];
    });
    try {
      // Delegate the advance body to the lazily-loaded session helper — the two-phase
      // drain→compute→commit, pause-parking, analytics + persist + party-replay all
      // ride the SAME lazy chunk as the heavy sim, keeping them (and the advance-only
      // fingerprint/analytics imports) OUT of the first-paint entry closure. The
      // synchronous in-flight + parked-pause guards + the in-flight mark/clear finally
      // stay HERE so a double-click is blocked before the loader await. The flag-OFF
      // single-tick path is a verbatim code move — its output is byte-identical.
      const {
        runAdvanceCampaignWorld, advanceCampaignWorld: domainAdvanceCampaignWorld,
        simulateCampaignWorldInterval: domainSimulateCampaignWorldInterval, runAdvanceInterval,
      } = await loadWorldEngine();
      // M10b: the living/autonomous catch-up cursor re-stamp lives INSIDE
      // runAdvanceCampaignWorld's Phase-2 commit (campaignAdvanceSession.js), so the
      // moved cursor rides the same atomic persist as the advance — a reload can no
      // longer re-simulate already-advanced weeks (state-lifecycle-1 / store-1). It
      // is gated there on advancesOnOpen + tick-moved, so dm_advanced/frozen stay
      // byte-identical.
      const result = await runAdvanceCampaignWorld({
        set, get, campaignId, interval, options,
        // Pass the sim functions resolved through loadWorldEngine's dynamic import
        // (the seam tests mock) rather than letting the session module import them.
        deps: {
          advanceCampaignWorld: domainAdvanceCampaignWorld,
          simulateCampaignWorldInterval: domainSimulateCampaignWorldInterval,
          runAdvanceInterval,
        },
      });
      return result;
    } finally {
      // Clear the in-flight mark for this campaign — runs on every exit path
      // (success, the not-canonized guard, AND any throw), so a failed advance
      // never wedges the campaign permanently disabled.
      set(state => {
        state.advanceInFlight = (state.advanceInFlight || []).filter(id => String(id) !== String(campaignId));
      });
    }
  },

  /**
   * M10b — the capped, deterministic advance-on-open catch-up for a LIVING/
   * AUTONOMOUS world. THIN eager wrapper: the SYNCHRONOUS not_living guard stays here
   * (FP-2a §0.7.3 sync-prefix rule) so the DEFAULT dm_advanced campaign — every
   * non-living open — returns WITHOUT loading the heavy sim chunk. Only a living/
   * autonomous world falls through to the lazily-loaded body (runCatchUpCampaignWorld
   * in campaignAdvanceSession.js), whose bytes therefore stay OUT of the first-paint
   * entry closure. The full mechanism (seed / up-to-date / capped loop, determinism,
   * cursor lifecycle) is documented on that body.
   *
   * @param {string} campaignId
   * @param {{ now?: string|number }} [options]
   * @returns {Promise<{ ok:boolean, weeksCaughtUp:number, capped:boolean, reason?:string }>}
   */
  catchUpCampaignWorld: async (campaignId, options = {}) => {
    // Sync prefix (kept eager): a dm_advanced/frozen world is not_living — return the
    // typed no-op HERE, before any lazy load, so the common open path never fetches
    // the sim. advancesOnOpen is a virtual read (absent key ⇒ dm_advanced ⇒ false).
    const campaign = findActiveCampaign(get().campaigns, campaignId);
    if (!campaign || !advancesOnOpen(campaign.worldState?.simulationRules)) {
      return { ok: false, weeksCaughtUp: 0, capped: false, reason: 'not_living' };
    }
    // Living/autonomous only: delegate the catch-up body to the lazily-loaded session
    // helper (FP-2a dep-import pattern). It re-reads the campaign through get() after
    // the load — the same seam loadWorldEngine's tests mock.
    const { runCatchUpCampaignWorld } = await loadWorldEngine();
    return runCatchUpCampaignWorld({ set, get, campaignId, options });
  },

  /**
   * Advance-scaling Stage 3 RESUME — apply the DM's verdicts on a paused interval's
   * batched majors and continue the remaining ticks. Reads the resume cursor from
   * c.worldState.pausedAdvance (parked by a paused advanceCampaignWorld, and
   * rehydrated verbatim on reload), re-enters the interval orchestrator's resume
   * path (which re-derives the paused tick from its PRE-tick inputs with the
   * decisions folded in — recommended ⇒ byte-identical to auto-resolve-ON, dismissed
   * ⇒ excluded), commits the resumed segment, and either CLEARS pausedAdvance (the
   * interval finished) or parks a FRESH cursor (the next tick surfaced majors).
   *
   * `decisions` is the DM's per-major verdict keyed by outcome id ({ [id]: { decision:
   * 'recommended'|'dismissed' } }); an empty map resolves every pending major to
   * recommended.
   *
   * @param {string} campaignId
   * @param {Record<string, {decision?: string}>} [decisions]
   * @param {{ now?: string }} [options]
   */
  resolveIntervalMajors: async (campaignId, decisions = {}, options = {}) => {
    // Re-entrancy guard — the SAME advanceInFlight machine advanceCampaignWorld uses
    // (set SYNCHRONOUSLY before the first await, cleared in finally). A double-click on
    // Resume — or a Resume racing an Advance — would otherwise re-enter and run the
    // resumed segment TWICE off the SAME cursor. A re-entrant call no-ops with the
    // typed result; advanceCampaignWorld's parked-pause guard blocks the reverse race.
    if (get().isAdvanceInFlight(campaignId)) {
      return { ok: false, reason: 'advance_in_flight' };
    }
    // FROZEN guard (CL-0): resuming a paused interval runs real ticks, so a
    // frozen world blocks it the same way it blocks a fresh advance. The
    // parked cursor is untouched — unfreeze and the resume works verbatim.
    if (frozenFor(get, campaignId)) {
      return WORLD_FROZEN_RESULT;
    }
    set(state => {
      state.advanceInFlight = [...(state.advanceInFlight || []), campaignId];
    });
    try {
      // Delegate the resume body to the lazily-loaded session helper — pause/resume
      // logic rides the SAME lazy chunk as the heavy sim, out of the first-paint
      // closure. The synchronous in-flight guard + its finally clear stay HERE so a
      // double-click is blocked before the loader await.
      const {
        runResolveIntervalMajors,
        simulateCampaignWorldInterval: domainSimulateCampaignWorldInterval, runAdvanceInterval,
      } = await loadWorldEngine();
      return await runResolveIntervalMajors({
        set, get, campaignId, decisions, options,
        deps: {
          simulateCampaignWorldInterval: domainSimulateCampaignWorldInterval,
          runAdvanceInterval,
        },
      });
    } finally {
      // Clear the in-flight mark on every exit path (success, the no-paused-advance
      // guard, AND any throw) so a failed resume never wedges the campaign disabled.
      set(state => {
        state.advanceInFlight = (state.advanceInFlight || []).filter(id => String(id) !== String(campaignId));
      });
    }
  },

  /** Advance-scaling Stage 3: is there a paused advance awaiting major decisions
   *  for this campaign? Drives the resume affordance + rehydrates after a reload. */
  getPausedAdvance: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    return ensureWorldState(c?.worldState, c).pausedAdvance || null;
  },

  applyWorldPulseProposal: async (campaignId, proposalId) => {
    // Advance-concurrency guard — see the advanceInFlight contract above. A mutation
    // during a running multi-tick advance would be reverted by its Phase-2 commit.
    if (get().isAdvanceInFlight(campaignId)) return null;
    // Parked-pause guard (worldpulse-core-1): a campaign PAUSED mid-interval for DM
    // verdicts is not idle — resolveIntervalMajors re-derives the paused segment from
    // the cursor's PRE-tick snapshot and wholesale-commits it, so any proposal applied
    // during the parked window would be silently overwritten on resume. No-op with the
    // action's existing null shape; the DM resumes or undoes the pause first.
    if (get().getPausedAdvance(campaignId)) return null;
    const { applyWorldPulseProposal: domainApplyWorldPulseProposal } = await loadWorldEngine();
    // The applied-decision extractor loads lazily (pulseFingerprint) — resolved here,
    // before set(), so it's available synchronously inside the producer where it
    // flattens the draft proposal to plain telemetry.
    const { extractProposalDecision } = await loadPulseFingerprint();
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
    // Parked-pause guard (worldpulse-core-1): a party impact recorded while the
    // interval is paused for DM verdicts would be clobbered by resume (which replays
    // the segment from the cursor's pre-tick snapshot). Block a USER-initiated impact
    // during the parked window — but NOT the advance's own internal party-replay,
    // which runs while the campaign is still marked in flight (the drained impacts
    // must land). isAdvanceInFlight distinguishes the two: the parked window is
    // NOT-in-flight (the advance has returned); the internal replay IS in-flight.
    if (get().getPausedAdvance(campaignId) && !get().isAdvanceInFlight(campaignId)) {
      return { ok: false, reason: 'advance_paused' };
    }
    const { applyPartyImpact: domainApplyPartyImpact } = await loadWorldEngine();
    // The party-impact telemetry extractor also loads lazily (pulseFingerprint);
    // used after set(), in the track() call below.
    const { extractPartyImpact } = await loadPulseFingerprint();
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

  /**
   * Lane 2 (domain-events-region-1): land a NON-party DM canon relationship event
   * (BROKERED_ALLIANCE / SETTLEMENT_DISPUTE / OPENED_TRADE_ROUTE, and an
   * APPLY_STRESSOR carrying an instigator) on the live campaign's pulse
   * relationship edge — the worldState.relationshipStates entry the war layer
   * reads, plus the regionalGraph edge label + channel bundle. Called
   * fire-and-forget by settlementSlice.rippleEventThroughWorld on a canon,
   * non-party relationship event; the undo snapshot is captured synchronously in
   * applyEvent (logEntry.undo.relationshipRipple) and reversed by
   * reverseCanonRelationshipRipple, so this async ripple never has to be awaited
   * for undo to be a clean inverse.
   *
   * ORPHAN GUARD: a sync undoLastEvent can pop the event BEFORE this async ripple
   * (which awaits the lazy engine load) commits. If the triggering event is no
   * longer in the acting save's eventLog by commit time, skip — the sync undo
   * already restored the pre-ripple edge, so landing the ripple now would orphan
   * it.
   *
   * @param {string} campaignId
   * @param {{ event?: any, homeId?: string|number }} [args]
   */
  recordCanonRelationshipRipple: async (campaignId, { event, homeId } = {}) => {
    if (!event || homeId == null || homeId === '') return null;
    // Parked-pause guard (mirrors recordPartyImpact), kept as the SYNC PREFIX
    // (FP-2a §0.7.3): a relationship ripple recorded while the interval is paused
    // for DM verdicts would be clobbered by resume. The heavy body (the relationship
    // applier + persist) rides the lazy campaignCanonRelationshipSession chunk so
    // NONE of it — nor the relationshipState constructor it pulls — reaches first
    // paint (dep-import pattern, mirroring canonizeCampaignWorldSpatial).
    if (get().getPausedAdvance(campaignId) && !get().isAdvanceInFlight(campaignId)) {
      return { ok: false, reason: 'advance_paused' };
    }
    const { runRecordCanonRelationshipRipple } = await import('./campaignCanonRelationshipSession.js');
    return runRecordCanonRelationshipRipple({ set, campaignId, event, homeId });
  },

  /**
   * Lane 2 (domain-events-region-1) — the INVERSE of recordCanonRelationshipRipple,
   * for undoLastEvent. Restores the campaign's pre-ripple pulse edge (the
   * relationshipState entry + the regionalGraph edge label + channel bundle) from
   * the snapshot applyEvent stamped on logEntry.undo.relationshipRipple. Called
   * fire-and-forget by settlementSlice.undoLastEvent.
   *
   * Async + lazy on purpose: the channel-bundle re-sync it needs (region graph
   * helpers) rides the SAME lazy chunk the first-paint budget keeps the forward
   * applier out of the eager closure — the eager undo path touches only the light
   * snapshot (logEntry.undo). RACE-SAFE with the forward ripple: the snapshot is
   * the pre-apply value, so restoring it is idempotent when the forward hasn't
   * landed, and the forward's orphan guard skips once the event is undone —
   * whichever async op wins, the pulse edge ends at its pre-event value.
   *
   * @param {string} campaignId
   * @param {{ key?: string, from?: unknown, to?: unknown, priorRelState?: unknown, priorEdgeType?: string|null }} [snapshot]
   */
  reverseCanonRelationshipRipple: async (campaignId, snapshot = {}) => {
    if (!snapshot?.key) return null;
    // Advance-in-flight guard (store-2), kept as the SYNC PREFIX: a running
    // multi-tick advance replaces worldState/regionalGraph wholesale, so an undo
    // reversal landing mid-advance would be silently reverted. The heavy body rides
    // the SAME lazy sidecar as the forward ripple (dep-import pattern).
    if (get().isAdvanceInFlight(campaignId)) return { ok: false, reason: 'advance_in_flight' };
    const { runReverseCanonRelationshipRipple } = await import('./campaignCanonRelationshipSession.js');
    return runReverseCanonRelationshipRipple({ set, campaignId, snapshot });
  },

  dismissWorldPulseProposal: async (campaignId, proposalId) => {
    // Advance-concurrency guard — see the advanceInFlight contract above.
    if (get().isAdvanceInFlight(campaignId)) return null;
    // Parked-pause guard (worldpulse-core-1): dismissing a proposal during a parked
    // pause would be reverted by resume; no-op with the action's existing null shape.
    if (get().getPausedAdvance(campaignId)) return null;
    // The dismissal-decision extractor loads lazily (pulseFingerprint) — awaited HERE,
    // after the synchronous guards, so it's resolved before the set() that flattens
    // the draft proposal to plain telemetry inside the Immer producer.
    const { extractProposalDecision } = await loadPulseFingerprint();
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
    // Advance-concurrency guard — see the advanceInFlight contract above. An undo
    // popped mid-advance would restore a PRIOR tick under the running interval, whose
    // Phase-2 commit then re-lands the advanced world on top. Undoing a PARKED pause
    // (the documented abandon path) is unaffected: a paused advance has returned, so
    // its campaign is no longer marked in flight.
    if (get().isAdvanceInFlight(campaignId)) return false;
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
