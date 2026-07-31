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
// Light, first-paint-safe world-state helpers ONLY. Imported from their leaf
// modules (never the `export *` barrel) so the barrel's whole re-export graph
// can't be pulled into the boot path. The heavy simulation machinery is loaded
// lazily via loadWorldEngine() below.
import { ensureWorldState } from '../domain/worldPulse/worldState.js';
import { worldProgressionOf, advancesOnOpen } from '../domain/worldPulse/simulationRules.js';
import {
  findActiveCampaign,
  captureCampaignSession, isCurrentCampaignSession,
  parkedIntervalUndoSnapshot,
} from './campaignSliceShared.js';
// The advance/resume BODY (with its advance-only fingerprint/analytics/consent
// imports) lives in the lazily-loaded ./campaignAdvanceSession.js so it stays out
// of the first-paint entry closure; this slice keeps only the light mutators +
// getters + thin guarded wrappers.

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
    ]).then(([advance, workerClient, session]) => ({
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
    }));
  }
  return _worldEnginePromise;
}

// ── Lazy low-frequency mutation bodies ────────────────────────────────────
// Preview, canonization, rules, proposal, party-impact, relationship-ripple,
// and pulse-undo actions are absent from anonymous first paint. Their public
// wrappers stay here because they own the synchronous guard prefix: invalid,
// frozen, unentitled, in-flight, or parked-pause calls must return before any
// chunk is requested. The deferred module repeats owner and mutation checks
// after loading, then owns the atomic store mutation + persistence sequence.
//
// Keep this loader separate from loadWorldEngine. Most mutations need only a
// narrow domain leaf, not the full tick engine; joining the promises would turn
// a proposal dismissal or undo into an unnecessary simulation download.
let _deferredPulseMutationsPromise = null;
function loadDeferredPulseMutations() {
  if (!_deferredPulseMutationsPromise) {
    _deferredPulseMutationsPromise = import('./campaignWorldPulseDeferred.js');
  }
  return _deferredPulseMutationsPromise;
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
const AUTH_SESSION_CHANGED_RESULT = Object.freeze({ ok: false, reason: 'auth_session_changed' });

// ── Owner/session fence ────────────────────────────────────────────────────
// Pulse actions routinely cross lazy-import, worker, and persistence awaits. A
// sign-out/sign-in can therefore replace the entire campaign list while an old
// action is suspended. Campaign UUIDs are only unique inside an account, so
// re-finding by campaignId after the await is not sufficient: account B may own
// the same UUID as account A. Auth rotates campaignSessionGeneration before it
// publishes any owner or same-owner SIGNED_IN session boundary; token refreshes
// deliberately do not rotate it. The shared owner+generation token is therefore
// the complete fence and avoids teaching this eager slice how to parse JWTs.
const capturePulseSession = get => captureCampaignSession(get());
const isPulseSessionCurrent = (get, fence) => isCurrentCampaignSession(get(), fence);

// The public `advanceInFlight` list remains campaign-id-shaped for existing UI
// subscribers. A private per-store token distinguishes A's stale finalizer from
// B's new same-UUID advance, so the former can never clear the latter's marker.
const advanceFlightTokens = new WeakMap();

function flightTokenMap(get) {
  let map = advanceFlightTokens.get(get);
  if (!map) {
    map = new Map();
    advanceFlightTokens.set(get, map);
  }
  return map;
}

function activeFlightToken(get, campaignId) {
  return flightTokenMap(get).get(String(campaignId)) || null;
}

function beginAdvanceFlight(set, get, campaignId, sessionFence) {
  const key = String(campaignId);
  flightTokenMap(get).set(key, sessionFence);
  set(state => {
    state.advanceInFlight = [
      ...(state.advanceInFlight || []).filter(id => String(id) !== key),
      campaignId,
    ];
  });
  return sessionFence;
}

function finishAdvanceFlight(set, get, campaignId, token) {
  const key = String(campaignId);
  const map = flightTokenMap(get);
  // A later account/session may already have started its own same-UUID advance.
  // Only the invocation that owns the current token may clear the shared marker.
  if (map.get(key) !== token) return;
  // clearCampaigns owns auth-boundary cleanup of the public transient list. A
  // stale finally must not issue even an otherwise-benign set() into the new
  // account; leave this private token to be replaced by the next same-id start.
  if (!isPulseSessionCurrent(get, token)) return;
  map.delete(key);
  set(state => {
    state.advanceInFlight = (state.advanceInFlight || []).filter(id => String(id) !== key);
  });
}

// Frozen read against the STORED rules of a campaign (advance/resume guards).
function frozenFor(get, campaignId) {
  return worldProgressionOf(findActiveCampaign(get().campaigns, campaignId)?.worldState?.simulationRules) === 'frozen';
}

// ── Cross-slice contract ──────────────────────────────────────────────────
// All 14 slices share ONE Immer store, so coupling is by shared state on the
// draft + get() method calls — not imports. This slice's contract:
//
// OWNS state:   pulseUndoStack + proposalUndoStack + advanceSeqByCampaign
//               (all session-scoped; not persisted).
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

  // R-1 (queue #5): session-scoped ring of pre-APPLY snapshots, one per applied
  // world-pulse proposal, capped PER campaign (PROPOSAL_UNDO_CAP in the deferred
  // module). A SEPARATE array from pulseUndoStack BY CONSTRUCTION so proposal
  // traffic can never evict a pre-advance snapshot (the R-0 cap-flood finding).
  // NOT persisted — a reload clears it, exactly like pulseUndoStack.
  proposalUndoStack: [],

  // R-1 MUST-FIX (ring-guard saturation): { [campaignId]: int } — the campaign's
  // LOGICAL advance depth. The advance push site increments it; undoLastPulse
  // decrements it as it pops; pulseUndoStack cap-EVICTION never touches it. The
  // proposal ring's coherence guard stamps/compares THIS, never a count of
  // retained advance snapshots (which saturates at PULSE_UNDO_CAP and fails
  // open to stale restores). NOT persisted — a reload clears it, exactly like
  // both undo stacks; clearTransientCampaignWork resets it at the auth boundary.
  advanceSeqByCampaign: {},

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
  isAdvanceInFlight: (campaignId) => {
    const marked = (get().advanceInFlight || []).some(id => String(id) === String(campaignId));
    if (!marked) return false;
    const token = activeFlightToken(get, campaignId);
    // A manually seeded/legacy marker has no private token and retains the
    // historical behavior used by guards and isolated stores. Real async marks
    // are active only for the owner/session that minted them.
    return !token || isPulseSessionCurrent(get, token);
  },

  // Advance-scaling Stage 3 + realm directive 7 (J-D7): the auto-resolve toggle —
  // FULL AUTO-RESOLVE MODE. Default OFF. Two things ride this ONE value, so the DM
  // sets a play MODE rather than two half-settings:
  //   • the multi-tick PAUSE. OFF ⇒ an Advance pauses at the first tick that
  //     surfaces campaign-altering MAJORS so the DM gets a say; ON ⇒ it runs
  //     straight to the end. (With the multi-tick flag OFF this half is inert —
  //     the single-tick path never pauses.)
  //   • the PROPOSAL DOCKET. ON ⇒ every major the advance parks as a pending
  //     proposal is ruled immediately by the engine, through the SAME accept path
  //     a hand-Apply uses, each ruling stamped `adjudicatedBy: 'engine_auto'`
  //     (domain/worldPulse/autoAdjudication.js). OFF ⇒ the docket waits for the DM,
  //     exactly as before. Engagement is decided at the single advance chokepoint
  //     (campaignAdvanceSession.runAdvanceCampaignWorld) and requires this toggle —
  //     an internally-derived autoResolve (the living/autonomous catch-up) never
  //     triggers it.
  // PERSISTED (realm directive 7 wave B): a play mode the user OWNS, not session
  // chrome — re-picking it on every reload was the bug. It rides the store/index.js
  // `partialize` allowlist as an additive top-level key, absent-tolerant: a blob
  // written before this shipped rehydrates to the `false` default below, so no
  // persist-version bump and no migrate branch is owed (the displayPrefs precedent).
  // Registered in tests/store/lifecycleRoundTrip.test.js ZUSTAND_PERSIST_KEYS. It is
  // NOT campaign canon — clearTransientCampaignWork leaves it alone at the auth
  // boundary, and a present pausedAdvance on a campaign worldState still rehydrates
  // an in-flight pause independently of it.
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

  /**
   * Produce a read-only simulation preview without mutating campaign or save
   * state. A rules draft may override the stored profile for this what-if only.
   *
   * @param {string} campaignId
   * @param {string} [interval]
   * @param {{ simulationRules?: any, now?: string|number }} [options]
   * @returns {Promise<any|null>}
   */
  previewCampaignWorldPulse: async (campaignId, interval = 'one_month', options = {}) => {
    // Capture ownership before retaining references to the current store snapshot.
    // The deferred body fences both references after its lazy import resolves.
    const sessionFence = capturePulseSession(get);
    const state = get();
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return null;
    // FROZEN guard (CL-0): preview is an advance-shaped read, so it honors the
    // EFFECTIVE rules it would run under — a dialog previewing an unfrozen
    // draft over a frozen campaign still works (that is the what-if the dialog
    // exists for); a frozen effective world previews nothing.
    if (worldProgressionOf(options.simulationRules || campaign.worldState?.simulationRules) === 'frozen') return null;
    // Not-found/frozen calls remain loader-free. The deferred body revalidates
    // the captured owner before it consumes `state` or `campaign`.
    const { runPreviewCampaignWorldPulse } = await loadDeferredPulseMutations();
    return runPreviewCampaignWorldPulse({
      state,
      campaign,
      campaignId,
      interval,
      options,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
  },

  /**
   * Canonize the current world and, when enabled, project settlement layouts into
   * the compact spatial substrate sidecar. Optional telemetry/projection failures
   * do not block the authoritative canon write.
   *
   * @param {string} campaignId
   * @returns {Promise<any|null>} The persisted world state, or null on a no-op.
   */
  canonizeCampaignWorld: async (campaignId) => {
    const sessionFence = capturePulseSession(get);
    // A running interval later commits a worldState cloned before its awaits; a
    // canon written into that window would be silently replaced.
    if (get().isAdvanceInFlight(campaignId)) return null;
    // A parked interval is also mid-transaction. Resume re-derives from its
    // pre-tick cursor and would replace a canon written while it was waiting.
    if (get().getPausedAdvance(campaignId)) return null;
    // Cheap exclusivity checks stay before the import. The deferred body repeats
    // them after loading and owns canon mutation, telemetry, and persistence.
    const { runCanonizeCampaignWorld } = await loadDeferredPulseMutations();
    return runCanonizeCampaignWorld({
      set,
      get,
      campaignId,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
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
    const sessionFence = capturePulseSession(get);
    // Advance-concurrency guard — a spatial canonize is a worldState mutation, so
    // it is blocked mid-advance for the same reason the other pulse mutators are.
    if (get().isAdvanceInFlight(campaignId)) return { ok: false, reason: 'advance_in_flight' };
    // Parked-pause guard (store-hooks-state-3): a paused-mid-interval campaign
    // re-commits worldState wholesale on resume, so a spatial canonize (and its
    // spatialCanonVersion bump) written into the parked window is silently lost.
    if (get().getPausedAdvance(campaignId)) return { ok: false, reason: 'advance_paused' };
    const state = get();
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return { ok: false, reason: 'not_found' };
    // ENTITLEMENT — read at the store call site (settlementSlice tier-split
    // pattern). The domain stays tier-blind; the key turns HERE.
    if (state.auth?.tier !== 'premium') return { ok: false, reason: 'not_entitled' };
    // GENERATED maps only (II.5-3): an imported / custom-backdrop map has no
    // persisted terrain to route on, so it stays aspatial (byte-identical).
    if (state.mapState?.customBackdrop?.imageUrl) return { ok: false, reason: 'not_generated_map' };
    // All cheap gates ran synchronously. The deferred bridge and spatial session
    // recheck owner/advance state after their imports and map-capture await.
    const { runCanonizeCampaignWorldSpatial } = await loadDeferredPulseMutations();
    return runCanonizeCampaignWorldSpatial({
      set,
      get,
      campaignId,
      options,
      sessionFence,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
  },

  /**
   * Apply a partial simulation-profile edit through the control layer's single
   * canonicalization and ruleset-receipt seam.
   *
   * @param {string} campaignId
   * @param {Record<string, any>} [patch]
   * @returns {Promise<any|null>} The persisted canonical rules, or null on a no-op.
   */
  updateCampaignSimulationRules: async (campaignId, patch = {}) => {
    const sessionFence = capturePulseSession(get);
    // The running interval computed from the old profile and later replaces
    // worldState wholesale, so an edit here would be both ignored and misleading.
    if (get().isAdvanceInFlight(campaignId)) return null;
    // Resume likewise commits the parked cursor's rules and ruleset log. Require
    // the DM to resolve or abandon that interval before changing the profile.
    if (get().getPausedAdvance(campaignId)) return null;
    // Profile normalization, receipt construction, telemetry, and persistence
    // stay behind the low-frequency boundary; post-load guards live in the body.
    const { runUpdateCampaignSimulationRules } = await loadDeferredPulseMutations();
    return runUpdateCampaignSimulationRules({
      set,
      get,
      campaignId,
      patch,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
  },

  advanceCampaignWorld: async (campaignId, interval = 'one_month', options = {}) => {
    const sessionFence = capturePulseSession(get);
    // In-flight guard (checked + set SYNCHRONOUSLY, before the first await below):
    // multi-tick advance yields to the event loop between tick batches, so a
    // double-click would otherwise re-enter this async action and run a SECOND real
    // tick batch off one intent. If already advancing, no-op with a typed result so
    // the caller can tell it apart from a real advance. Cleared in the finally below.
    if (get().isAdvanceInFlight(campaignId)) {
      return { ok: false, reason: 'advance_in_flight' };
    }
    if (get().isCampaignMutationLocked?.(campaignId)) {
      return { ok: false, reason: 'settlement_deletion_in_flight' };
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
    const flightToken = beginAdvanceFlight(set, get, campaignId, sessionFence);
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
      if (!isPulseSessionCurrent(get, sessionFence)) return AUTH_SESSION_CHANGED_RESULT;
      // M10b: the living/autonomous catch-up cursor re-stamp lives INSIDE
      // runAdvanceCampaignWorld's Phase-2 commit (campaignAdvanceSession.js), so the
      // moved cursor rides the same atomic persist as the advance — a reload can no
      // longer re-simulate already-advanced weeks (state-lifecycle-1 / store-1). It
      // is gated there on advancesOnOpen + tick-moved, so dm_advanced/frozen stay
      // byte-identical.
      const result = await runAdvanceCampaignWorld({
        set, get, campaignId, interval, options, sessionFence,
        isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
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
      finishAdvanceFlight(set, get, campaignId, flightToken);
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
    const sessionFence = capturePulseSession(get);
    if (get().isCampaignMutationLocked?.(campaignId)) {
      return { ok: false, weeksCaughtUp: 0, capped: false, reason: 'settlement_deletion_in_flight' };
    }
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
    if (!isPulseSessionCurrent(get, sessionFence)) {
      return { ok: false, weeksCaughtUp: 0, capped: false, reason: 'auth_session_changed' };
    }
    if (get().isCampaignMutationLocked?.(campaignId)) {
      return { ok: false, weeksCaughtUp: 0, capped: false, reason: 'settlement_deletion_in_flight' };
    }
    return runCatchUpCampaignWorld({
      set,
      get,
      campaignId,
      options,
      sessionFence,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
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
    const sessionFence = capturePulseSession(get);
    // Re-entrancy guard — the SAME advanceInFlight machine advanceCampaignWorld uses
    // (set SYNCHRONOUSLY before the first await, cleared in finally). A double-click on
    // Resume — or a Resume racing an Advance — would otherwise re-enter and run the
    // resumed segment TWICE off the SAME cursor. A re-entrant call no-ops with the
    // typed result; advanceCampaignWorld's parked-pause guard blocks the reverse race.
    if (get().isAdvanceInFlight(campaignId)) {
      return { ok: false, reason: 'advance_in_flight' };
    }
    if (get().isCampaignMutationLocked?.(campaignId)) {
      return { ok: false, reason: 'settlement_deletion_in_flight' };
    }
    // FROZEN guard (CL-0): resuming a paused interval runs real ticks, so a
    // frozen world blocks it the same way it blocks a fresh advance. The
    // parked cursor is untouched — unfreeze and the resume works verbatim.
    if (frozenFor(get, campaignId)) {
      return WORLD_FROZEN_RESULT;
    }
    const flightToken = beginAdvanceFlight(set, get, campaignId, sessionFence);
    try {
      // Delegate the resume body to the lazily-loaded session helper — pause/resume
      // logic rides the SAME lazy chunk as the heavy sim, out of the first-paint
      // closure. The synchronous in-flight guard + its finally clear stay HERE so a
      // double-click is blocked before the loader await.
      const {
        runResolveIntervalMajors,
        simulateCampaignWorldInterval: domainSimulateCampaignWorldInterval, runAdvanceInterval,
      } = await loadWorldEngine();
      if (!isPulseSessionCurrent(get, sessionFence)) return AUTH_SESSION_CHANGED_RESULT;
      return await runResolveIntervalMajors({
        set, get, campaignId, decisions, options, sessionFence,
        isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
        deps: {
          simulateCampaignWorldInterval: domainSimulateCampaignWorldInterval,
          runAdvanceInterval,
        },
      });
    } finally {
      // Clear the in-flight mark on every exit path (success, the no-paused-advance
      // guard, AND any throw) so a failed resume never wedges the campaign disabled.
      finishAdvanceFlight(set, get, campaignId, flightToken);
    }
  },

  /** Advance-scaling Stage 3: is there a paused advance awaiting major decisions
   *  for this campaign? Drives the resume affordance + rehydrates after a reload. */
  getPausedAdvance: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    if (!c) return null;
    return ensureWorldState(c?.worldState, c).pausedAdvance || null;
  },

  /**
   * Apply one pending proposal and atomically land all campaign/save effects.
   *
   * @param {string} campaignId
   * @param {string} proposalId
   * @returns {Promise<any|null>} The applied pulse result, or null on a no-op.
   */
  applyWorldPulseProposal: async (campaignId, proposalId) => {
    const sessionFence = capturePulseSession(get);
    // Both active and parked intervals later replace worldState from an earlier
    // snapshot; applying a proposal during either window would be lost.
    if (get().isAdvanceInFlight(campaignId)) return null;
    if (get().getPausedAdvance(campaignId)) return null;
    // Keep the guard prefix eager. The deferred body repeats it after loading,
    // computes from clones, commits once, then flushes campaign and save writes.
    const { runApplyWorldPulseProposal } = await loadDeferredPulseMutations();
    return runApplyWorldPulseProposal({
      set,
      get,
      campaignId,
      proposalId,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
  },

  /**
   * W-COMPOSER-2 — stage a DM realm-verb order as a PENDING proposal (the
   * force-as-proposal lane; realmManifest.js is the verb catalog). Cancel =
   * dismissWorldPulseProposal; approval = applyWorldPulseProposal (the
   * realm-verb arm applies it force ≡ organic). Same guards as every pulse
   * mutator: no-op while an advance runs or a paused interval is parked.
   *
   * @param {string} campaignId
   * @param {string} verb
   * @param {any} args
   * @returns {Promise<any|{ok:false, code:string}>}
   */
  stageRealmVerb: async (campaignId, verb, args) => {
    const sessionFence = capturePulseSession(get);
    if (get().isAdvanceInFlight(campaignId)) return { ok: false, code: 'advance_in_flight' };
    if (get().getPausedAdvance(campaignId)) return { ok: false, code: 'advance_paused' };
    // Mint/apply machinery remains deferred; the body rechecks both guards after
    // the import before staging the authoritative proposal.
    const { runStageRealmVerb } = await loadDeferredPulseMutations();
    return runStageRealmVerb({
      set,
      get,
      campaignId,
      verb,
      args,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
  },

  /**
   * Inject a party action (resolve a stressor, broker/inflame a relationship,
   * clear/impose a condition, or move a faction/NPC) as an authoritative,
   * party-tagged World Pulse input.
   *
   * @param {string} campaignId
   * @param {any} action
   * @param {{ sessionFence?: any }} [options] Internal replay may inherit the
   *   advance session so the entire drain remains under one owner fence.
   * @returns {Promise<any|{ok:false, reason:string}>}
   */
  recordPartyImpact: async (campaignId, action, options = {}) => {
    const sessionFence = options.sessionFence || capturePulseSession(get);
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
    // User-blocking remains synchronous; domain work, telemetry, mutation, and
    // persistence stay behind the deferred boundary.
    const { runRecordPartyImpact } = await loadDeferredPulseMutations();
    return runRecordPartyImpact({
      set,
      get,
      campaignId,
      action,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
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
   * @param {{ event?: any, homeId?: string|number, now?: string|null,
   *   sessionFence?: any }} [args]
   *   `now` is the pinNow seam: the drain-path parity replay threads the advance's
   *   pinned tick clock so a drained relationship verb lands deterministically;
   *   the immediate path omits it (boundary self-mint).
   */
  recordCanonRelationshipRipple: async (campaignId, {
    event, homeId, now, sessionFence: inheritedSessionFence,
  } = {}) => {
    const sessionFence = inheritedSessionFence || capturePulseSession(get);
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
    // The deferred facade preserves the account/session fence around the still
    // heavier relationship session and its persistence await.
    const { runRecordCanonRelationshipRipple } = await loadDeferredPulseMutations();
    return runRecordCanonRelationshipRipple({
      set,
      campaignId,
      event,
      homeId,
      now,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
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
   * @param {{ now?: string|null, sessionFence?: any }} [options]
   *   pinNow seam (mirrors the forward);
   *   the undo caller omits it (boundary self-mint).
   */
  reverseCanonRelationshipRipple: async (campaignId, snapshot = {}, {
    now, sessionFence: inheritedSessionFence,
  } = {}) => {
    const sessionFence = inheritedSessionFence || capturePulseSession(get);
    if (!snapshot?.key) return null;
    // Advance-in-flight guard (store-2), kept as the SYNC PREFIX: a running
    // multi-tick advance replaces worldState/regionalGraph wholesale, so an undo
    // reversal landing mid-advance would be silently reverted. The heavy body rides
    // the SAME lazy sidecar as the forward ripple (dep-import pattern).
    if (get().isAdvanceInFlight(campaignId)) return { ok: false, reason: 'advance_in_flight' };
    // As with the forward ripple, the deferred facade fences the nested lazy
    // session before and after its mutation/persistence sequence.
    const { runReverseCanonRelationshipRipple } = await loadDeferredPulseMutations();
    return runReverseCanonRelationshipRipple({
      set,
      campaignId,
      snapshot,
      now,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
  },

  /**
   * Dismiss one pending proposal and persist the DM's block decision.
   *
   * @param {string} campaignId
   * @param {string} proposalId
   * @returns {Promise<any|null>} The dismissed proposal, or null on a no-op.
   */
  dismissWorldPulseProposal: async (campaignId, proposalId) => {
    const sessionFence = capturePulseSession(get);
    // Dismissal mutates worldState and is subject to the same replacement races
    // as apply/canon/rules: neither an active nor parked interval is idle.
    if (get().isAdvanceInFlight(campaignId)) return null;
    if (get().getPausedAdvance(campaignId)) return null;
    // Telemetry extraction and persistence remain deferred; the body repeats the
    // guards after loading before it touches the proposal draft.
    const { runDismissWorldPulseProposal } = await loadDeferredPulseMutations();
    return runDismissWorldPulseProposal({
      set,
      get,
      campaignId,
      proposalId,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
  },

  getCampaignWorldState: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    return ensureWorldState(c?.worldState, c);
  },

  /** Campaign-clock (Phase C2): is there a pre-pulse snapshot to undo for this
   *  campaign? Drives the "Undo last advance" affordance.
   *
   *  Two sources, in precedence order. (1) The session pulseUndoStack — every
   *  advance this session pushed one, and popping it keeps the multi-step
   *  walk-back working. (2) R-5b: the pre-INTERVAL snapshot parked on a PAUSED
   *  advance's cursor, which survives a reload with the campaign record. Source 2
   *  is what makes a reload-into-paused interval genuinely undoable instead of
   *  honestly-but-uselessly refusing; it can only be reached when source 1 is
   *  empty for this campaign, so an in-session advance behaves exactly as before. */
  canUndoLastPulse: (campaignId) =>
    (get().pulseUndoStack || []).some(s => s.campaignId === campaignId)
    || Boolean(parkedIntervalUndoSnapshot(findActiveCampaign(get().campaigns, campaignId))),

  /**
   * Campaign-clock (Phase C2): reverse the most recent world-pulse advance for
   * this campaign, restoring the campaign world + every member settlement (and
   * the live active view) from the pre-pulse snapshot. Multi-step — each call
   * pops one snapshot, so repeated calls walk back tick by tick. Returns true if
   * an advance was undone. Session-scoped: a reload clears the stack.
   *
   * @param {string} campaignId
   * @returns {Promise<boolean>}
   */
  undoLastPulse: async (campaignId) => {
    const sessionFence = capturePulseSession(get);
    // A restore landing during an advance would itself be replaced by the
    // interval's later Phase-2 commit. A parked pause has returned and is not
    // marked in flight, so undo remains the supported abandon path.
    if (get().isAdvanceInFlight(campaignId)) return false;
    // Restore and multi-entity persistence are deferred; the body keeps the
    // session fence around both the atomic store write and its flush.
    const { runUndoLastPulse } = await loadDeferredPulseMutations();
    return runUndoLastPulse({
      set,
      get,
      campaignId,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
  },

  /**
   * R-1 (queue #5): reverse the most recent APPLIED world-pulse proposal,
   * restoring the campaign world + member saves + the live view from the
   * pre-apply snapshot on the session proposal-undo ring. Distinct from
   * undoLastPulse: it pops the PROPOSAL ring only and never touches advance
   * snapshots. Returns true only when a snapshot was restored and persisted.
   *
   * @param {string} campaignId
   * @returns {Promise<boolean>}
   */
  undoLastProposalApply: async (campaignId) => {
    const sessionFence = capturePulseSession(get);
    // Same exclusivity story as undoLastPulse; the deferred body repeats the
    // guards (plus the parked-pause refusal and ring-coherence checks) after
    // its lazy import resolves.
    if (get().isAdvanceInFlight(campaignId)) return false;
    const { runUndoLastProposalApply } = await loadDeferredPulseMutations();
    return runUndoLastProposalApply({
      set,
      get,
      campaignId,
      isSessionCurrent: () => isPulseSessionCurrent(get, sessionFence),
    });
  },
});
