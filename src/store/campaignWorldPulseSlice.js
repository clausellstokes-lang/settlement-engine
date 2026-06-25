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
 * Imports only leaf helpers (shared persistence, pulse helpers, the region
 * domain + light worldPulse schema leaves, and the fingerprint/analytics libs)
 * and never campaignSlice, so there is no cycle. The HEAVY worldPulse simulation
 * is NOT a static import — it loads lazily (see below).
 *
 * ── Lazy worldPulse simulation ──────────────────────────────────────────────
 * The full worldPulse domain barrel (../domain/worldPulse/index.js) is ~22.7k
 * LOC of simulation. Statically importing it here pulled the entire simulation
 * into store/index.js's static graph, so it landed in the eager entry chunk at
 * first paint even though a user only touches it when they advance a campaign's
 * world clock. Mirroring settlementSlice.loadEngine(), the HEAVY simulation
 * entry points (advance / preview / apply-proposal / party-impact) now load
 * through a module-level memoized `loadWorldPulse()` dynamic import — each action
 * that runs the simulation does `const { ... } = await loadWorldPulse()` before
 * its `set()` producer (Immer producers can't be async), exactly as the engine
 * loader does. Those actions are already async and already awaited by callers
 * (SettlementsPanel/WorldMap await advanceCampaignWorld; SimulationRulesDialog
 * wraps preview in `await Promise.resolve(...)`), so making preview return a
 * Promise is contract-compatible.
 *
 * The LIGHT, schema-shaped helpers (ensureWorldState / canonizeWorldState /
 * updateProposalStatus / normalizeSimulationRules) stay STATIC, imported from
 * their leaf modules (worldState.js / simulationRules.js) rather than the barrel.
 * Those leaves only import simulationRules + ../clock + ../clone (no heavy
 * transitive deps), so they cost ~nothing on first paint, and keeping them sync
 * preserves the contract of `getCampaignWorldState` — which aiSlice consumes
 * SYNCHRONOUSLY (its result is read immediately, not awaited), so it must NOT
 * become async. Importing them from the leaves (not index.js) is also what lets
 * the architecture-boundary ratchet assert this slice has no top-level
 * `worldPulse/index.js` edge.
 */
// ── Lazy worldPulse simulation loader ───────────────────────────────────────
// Declared BEFORE the import block (mirroring settlementSlice.loadEngine()) so
// the module's static `import` statements stay first — keeping `import/first`
// happy — while the dynamic import() boundary lives in a function body. This is
// the seam that keeps the ~22.7k-LOC simulation OUT of the first-paint entry
// chunk: it loads only when an action that runs the simulation is first invoked.
/** @type {?Promise<typeof import('../domain/worldPulse/index.js')>} */
let _worldPulsePromise = null;
/** Memoized dynamic import of the worldPulse simulation barrel. Resolves once
 *  and is shared by every action that runs the simulation. */
function loadWorldPulse() {
  return _worldPulsePromise ??= import('../domain/worldPulse/index.js');
}

import {
  ensureRegionalGraph,
  ensureWizardNewsFeed,
  queueRegionalImpacts,
} from '../domain/region/index.js';
// LIGHT, sync schema helpers (leaf modules — no heavy transitive deps). Imported
// from the leaves (not the barrel) so this slice has NO top-level edge to
// worldPulse/index.js: the heavy simulation only enters via loadWorldPulse().
import {
  canonizeWorldState,
  ensureWorldState,
  updateProposalStatus as domainUpdateWorldPulseProposalStatus,
} from '../domain/worldPulse/worldState.js';
import { normalizeSimulationRules } from '../domain/worldPulse/simulationRules.js';
import {
  cloneJson, cacheCampaignState, syncCampaignSnapshot,
  flushWorldPulsePersist, findActiveCampaign, campaignSettlements,
} from './campaignSliceShared.js';
import {
  capturePulseSnapshot, applyWorldPulseResultToState, drainCampaignQueueIntoState,
  restorePulseSnapshot, applyWarFrontSeed,
} from './campaignPulseHelpers.js';
import { track, EVENTS } from '../lib/analytics.js';
import { flag } from '../lib/flags.js';
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

  // Advance-scaling Stage 3: the autoresolve toggle. Default OFF — when the
  // multi-tick flag is ON, an Advance PAUSES at the first tick that surfaces
  // campaign-altering MAJORS so the DM gets a say (autoresolve ON runs straight to
  // the end, resolving every major to recommended). With the multi-tick flag OFF
  // this value is inert (the single-tick path never pauses), so it changes nothing
  // in prod. UI-scoped; not persisted across reloads (a present pausedAdvance on the
  // campaign worldState rehydrates an in-flight pause instead).
  advanceAutoResolve: false,
  setAdvanceAutoResolve: (value) => set(state => { state.advanceAutoResolve = !!value; }),

  previewCampaignWorldPulse: async (campaignId, interval = 'one_month', options = {}) => {
    const state = get();
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return null;
    // Lazy-load the simulation before the (pure, synchronous) preview compute.
    // The sole caller already awaits this (SimulationRulesDialog wraps it in
    // `await Promise.resolve(...)`), so returning a Promise is contract-safe.
    const { previewCampaignWorldPulse: domainPreviewCampaignWorldPulse } = await loadWorldPulse();
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

    // Lazy-load the simulation BEFORE Phase 1. This is the ONLY await in the
    // critical region, and it sits before the first set() — so the two-phase
    // drain→compute→commit sequence below still runs with NO await between its
    // set() calls and stays atomic w.r.t. other actions (JS is single-threaded;
    // once the synchronous Phase 1 begins no other action can observe the
    // drained-but-not-advanced intermediate state). Memoized, so only the first
    // advance pays the import; subsequent advances resolve from cache.
    // Advance-scaling Stage 1: a flag selects the advance path. OFF (default) →
    // the existing single-tick `advanceCampaignWorld` (UNCHANGED — the flag-OFF
    // store path is byte-identical to today). ON → `simulateCampaignWorldInterval`,
    // which runs N real one-week ticks for the chosen interval and composes ONE
    // result of the same shape. Either way the snapshot/drain/commit/persist/
    // analytics scaffolding below runs ONCE per Advance, so undo grows by exactly
    // one and persist + analytics fire once regardless of tick count.
    const { simulateCampaignWorldInterval: domainSimulateCampaignWorldInterval, advanceCampaignWorld: domainAdvanceCampaignWorld } = await loadWorldPulse();
    const useMultiTick = flag('advanceMultiTick');
    // Advance-scaling Stage 3: autoresolve rides ONLY the multi-tick path. OFF ⇒ the
    // interval orchestrator PAUSES at the first tick that surfaces majors. A caller
    // can override per-advance via options.autoResolve; otherwise the store toggle
    // governs. The single-tick path ignores it entirely (it never pauses).
    const autoResolve = options.autoResolve != null ? !!options.autoResolve : !!get().advanceAutoResolve;

    // ── Phase 1: snapshot + drain, then lift the (plain, already-drained)
    // simulation inputs OUT of the Immer producer. The heavy organic pulse is a
    // pure function over plain clones, so running it on the draft only made
    // Immer track a draft it never touches. We split it out below WITHOUT an
    // await between the two set() calls — JS is single-threaded, so no other
    // action can observe the intermediate (drained-but-not-advanced) state.
    // The drain IS committed here before the pure pulse runs, but it is no longer
    // left committed UNCONDITIONALLY: if the pure pulse throws, the compute block
    // below rolls the full pre-drain snapshot back (atomic rollback), so a failed
    // advance neither consumes the queue nor advances a tick. This split also
    // removes the second full clone of every member save: the simulation now
    // consumes the SAME plain clones we hand it here. */
    /** @type {any} */ let preSnapshot = null;
    /** @type {any} */ let simCampaign = null;
    /** @type {any} */ let simSaves = null;
    /** @type {any} */ let authoredEventBySave = null;
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
      preSnapshot = capturePulseSnapshot(state, c, now);
      // Advance-scaling Stage 5: tag the snapshot with the DM-CHOSEN interval so
      // the session-only Undo affordance can name what it reverts ("Undo the last
      // advance (1 year)"). Session-scoped like the stack itself; never persisted.
      preSnapshot.interval = interval;
      // Campaign-clock C1: drain queued player intentions into the member
      // settlements (and inject any crisis twins into worldState) BEFORE the
      // organic pulse, so every settlement's events resolve simultaneously at
      // this tick and the pulse simulates the post-intervention world. The
      // augmented worldState is written onto the draft campaign so the pulse's
      // input clone carries the injected stressors + the cleared queue.
      const drained = drainCampaignQueueIntoState(state, c, worldState, now);
      c.worldState = drained.worldState;
      drainedPartyImpacts = drained.partyImpacts || [];
      // Phase 4b — fold any DEFERRED regional impacts (parked by campaign-member
      // change-queue commits since the last Advance) into the live queuedImpacts
      // EXACTLY ONCE, then clear the bucket. This is the consume-side of the
      // double-propagation guard: the commit did NOT enqueue these into the graph
      // (it only stashed them on worldState.deferredImpacts), so this fold is the
      // single point at which the deferred regional ripple becomes real. Done
      // BEFORE priorQueuedIds is captured below so the analytics diff treats them
      // as this pulse's new propagation; they then age via the normal delayTicks
      // path (advanceCampaignRegionalImpacts), exactly like an immediate enqueue.
      // After the fold the bucket is emptied, so a SECOND Advance finds nothing
      // to fold — structurally impossible to double-apply.
      {
        const deferred = Array.isArray(c.worldState.deferredImpacts) ? c.worldState.deferredImpacts : [];
        if (deferred.length > 0) {
          c.regionalGraph = queueRegionalImpacts(c.regionalGraph, deferred, { now });
        }
        if ('deferredImpacts' in c.worldState) {
          c.worldState = { ...c.worldState, deferredImpacts: [] };
        }
      }
      // #2.2 — DRAIN any deferred WAR-FRONT seeds (parked by campaign-member
      // change-queue commits of a siege/occupation stressor since the last
      // Advance) into real seedCampaignWarFront calls EXACTLY ONCE, then clear
      // the bucket. This is the consume-side of the war-front deferral: the
      // commit did NOT seed live (it ran with skipRegional), it only stashed the
      // intent on worldState.deferredWarFronts. Done HERE — in the Phase-1
      // producer, mutating this draft's worldState.deployments + regionalGraph
      // BEFORE the post-drain clone (cloneJson below) and BEFORE evaluateWarLayer
      // reads them — so the seeded siege is processed/retired by THIS SAME
      // Advance, identical to the immediate path one tick earlier. The bucket is
      // cleared FIRST (before the loop) so even a throw mid-loop cannot leave
      // entries for a second drain (and the Phase-1 rollback restores the full
      // pre-drain snapshot anyway). A SECOND Advance finds [] → seeds nothing.
      // seedCampaignWarFront's own guards (war-off no-op, one-army invariant,
      // self-target no-op) make a duplicate-or-stale entry a structural no-op.
      {
        const fronts = Array.isArray(c.worldState.deferredWarFronts) ? c.worldState.deferredWarFronts : [];
        if ('deferredWarFronts' in c.worldState) {
          c.worldState = { ...c.worldState, deferredWarFronts: [] };
        }
        for (const f of fronts) {
          // Mutate THIS draft `c` directly via the shared seed primitive (NOT the
          // set()-based seedCampaignWarFront action — a nested set inside this
          // producer would write a separate update that this producer's draft
          // would clobber). applyWarFrontSeed is the SAME code the immediate
          // action runs, so the seeded ledger is byte-identical; it lands on the
          // draft cloned for the pure pulse below (simCampaign), and is read by
          // evaluateWarLayer THIS Advance.
          applyWarFrontSeed(c, {
            instigatorId: f.instigatorId,
            targetId: f.targetId,
            sinceTick: f.sinceTick,
            now,
          });
        }
      }
      // drainCampaignQueueIntoState read these authored events off THIS (Phase-1)
      // draft, so their values are draft proxies that Immer revokes the moment
      // this producer returns. Lift them to plain objects now (mirroring the
      // cloneJson of simCampaign/simSaves below) so the Phase-2 commit's
      // layerAuthoredDeltas can safely read event.type after revocation.
      authoredEventBySave = drained.authoredEventBySave instanceof Map
        ? new Map([...drained.authoredEventBySave].map(([k, v]) => [k, cloneJson(v)]))
        : drained.authoredEventBySave;
      // Snapshot the pre-pulse queued-impact ids (primitive Set — safe to read
      // outside set) so we can isolate this pulse's NEW propagation impacts.
      priorQueuedIds = new Set((c.regionalGraph?.queuedImpacts || []).map(i => String(i.id)));
      // Lift plain (post-drain) simulation inputs out of the draft. These are
      // the ONLY clones the pure pulse needs — the previous code re-cloned the
      // member saves a second time inside domainAdvanceCampaignWorld's args.
      simCampaign = cloneJson(c);
      simSaves = cloneJson(campaignSettlements(state, campaignId));
    });

    // Pure, heavy compute OUTSIDE the producer (synchronous — no await before
    // the commit set() below, so the action stays atomic w.r.t. other actions).
    //
    // ATOMICITY: Phase 1 ALREADY committed the queue drain (player intentions
    // consumed off worldState.pendingEvents, member settlements + the live view
    // advanced). If this pure pulse THROWS, that drain must NOT survive — leaving
    // it committed with no tick advanced and no undo snapshot is silent data
    // loss: the queued intentions are gone and the world never moved. So on a
    // throw we roll the FULL pre-drain snapshot back onto the draft, making the
    // whole action a no-op and preserving the queue for a retry. preSnapshot was
    // captured BEFORE the drain (above), so it is a complete pre-drain rewind
    // point for everything the drain touched.
    if (simCampaign) {
      try {
        // Flag-gated path select (commit:true rides the interval orchestrator's
        // final tick; the single-tick path commits as before). The composed
        // result has the SAME shape, so Phase 2 + persist + analytics are identical.
        result = useMultiTick
          ? domainSimulateCampaignWorldInterval({
              campaign: simCampaign,
              saves: simSaves,
              interval,
              commit: true,
              now,
              autoResolve,
            })
          : domainAdvanceCampaignWorld({
              campaign: simCampaign,
              saves: simSaves,
              interval,
              now,
            });
      } catch (e) {
        console.error('[campaignWorldPulseSlice] world pulse compute threw; rolling back drain', e);
        set(state => { restorePulseSnapshot(state, preSnapshot); });
        // Abort Phase 2 + the persist/analytics tail: the drain is reverted and
        // nothing was advanced, so there is nothing to commit or persist. Re-throw
        // so the caller learns the advance failed rather than reading a silent null.
        throw e;
      }
    }

    // ── Phase 2: commit the pure result back onto the draft.
    if (simCampaign && result) {
      set(state => {
        const c = findActiveCampaign(state.campaigns, campaignId);
        if (!c) return;
        // The pulse landed — retain the pre-pulse snapshot for multi-step undo.
        // Cap PER campaign so churn in one campaign can't evict another's
        // history: drop only this campaign's oldest snapshot past the cap.
        {
          const next = [...(state.pulseUndoStack || []), preSnapshot];
          const mineCount = next.reduce((n, s) => n + (s.campaignId === campaignId ? 1 : 0), 0);
          if (mineCount > PULSE_UNDO_CAP) {
            const oldestIdx = next.findIndex(s => s.campaignId === campaignId);
            if (oldestIdx !== -1) next.splice(oldestIdx, 1);
          }
          state.pulseUndoStack = next;
        }
        persistUpdates = applyWorldPulseResultToState(state, c, result, now, authoredEventBySave);
        // Advance-scaling Stage 3 PAUSE: a paused interval committed its minors
        // (applyWorldPulseResultToState above wrote the minors-only pause-tick
        // worldState). Park the resume cursor on c.worldState.pausedAdvance so the
        // partial interval (ticks committed) + the cursor land in the SAME atomic
        // persist (069 forward-guard accepts it — tick advanced monotonically). The
        // cursor carries the PRE-tick inputs (preSnapshot) the resume re-derives from,
        // so a reload rehydrates it and resolveIntervalMajors continues deterministically.
        // ensureWorldState materializes pausedAdvance ONLY when present + non-empty, so
        // a non-paused (complete) advance clears it to byte-neutral (absent) below.
        if (result.status === 'paused') {
          c.worldState = {
            ...c.worldState,
            pausedAdvance: {
              interval: result.interval,
              ticksTotal: result.ticksTotal,
              ticksDone: result.ticksDone,
              atTick: result.atTick,
              resumeTick: result.resumeTick,
              autoResolve: false,
              startedAt: now,
              // Determinism: thread the ORIGINAL advance `now` onto the cursor so a
              // RESUME (which re-derives the paused tick through the kernel, stamping
              // now into regional-graph/wizard-news records) replays with the SAME
              // wall-clock the pause was computed from — not a fresh one. resolveInterval-
              // Majors reuses this instead of regenerating new Date(). Survives a reload.
              now,
              // Stage 5 ring policy: thread the original pre-interval history length
              // through every re-pause so the whole interval collapses to one record.
              preIntervalHistoryLen: result.preIntervalHistoryLen,
              pendingMajors: cloneJson(result.pendingMajors) || [],
              // The PRE-tick snapshot — the exact inputs the paused tick was computed
              // from. Resume re-runs the tick from these (seed replay). These fields
              // are ALREADY plain deep clones: they thread references off simCampaign/
              // simSaves (cloneJson'd before the pure compute) through the kernel, which
              // never aliases store state, and `result` is a plain object we own. So we
              // park the references directly — a second cloneJson per field would deep-
              // copy the WHOLE pre-tick world (worldState+graph+news+every save) AGAIN
              // on EVERY pause of a multi-pause interval, doubling the retained + later
              // serialized cursor for no gain. Bytes fed to the resume kernel are
              // identical either way, so resume determinism is untouched.
              preSnapshot: {
                worldState: result.preWorldState,
                regionalGraph: result.preRegionalGraph,
                wizardNews: result.preWizardNews,
                saves: result.preSaves || [],
              },
            },
          };
        } else if (c.worldState && 'pausedAdvance' in c.worldState) {
          // A COMPLETE advance clears any stale cursor back to byte-neutral (absent).
          const { pausedAdvance: _drop, ...rest } = c.worldState;
          c.worldState = rest;
        }
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
    }

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

    const persistOutcome = await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    // Surface the persistence outcome on the (advanced) result so callers can tell
    // an advance that fully reached the cloud from one that is applied locally but
    // cloud-pending. The advance is real locally either way; on a failed persist
    // the persist tail already raised the retryable campaignSyncError banner, so
    // the caller must NOT show a plain 'Realm advanced' success — it would
    // contradict the banner and invite a re-advance (double tick). Only tag a
    // genuine advance (ok !== false); the not-canonized guard result is untouched.
    if (result && result.ok !== false && persistOutcome && persistOutcome.ok === false) {
      result.cloudPending = true;
    }
    // Replay party-caused queued events through the party-impact pipeline — the
    // drain surfaced them; this mirrors the immediate path's rippleEventThroughWorld
    // party branch (faction/NPC world state, condition resolution, Wizard News).
    // Best-effort in that each replay is individually try/catch'd so one failure
    // can't abort the rest or the advance. Unlike the immediate path (which fires
    // these off unawaited), these ARE awaited sequentially before advance
    // resolves, so the advance's promise does not settle until every replay has
    // run — callers that await advanceCampaignWorld see the world fully settled.
    // The tick itself is already committed above, so a replay failure never
    // rolls the advance back, and the pre-pulse snapshot already covers these
    // for undo (they land after the snapshot).
    //
    // GUARD: skip the replay when the underlying advance did NOT reach the cloud
    // (result.cloudPending — the atomic advance write rejected or conflicted with a
    // concurrent same-tick advance). recordPartyImpact persists as a BACKWARD /
    // last-write-wins write (expectedTick = null), so it FORCE-writes its settlement
    // deltas to the cloud out of band — bypassing the very forward guard the advance
    // just lost to. That would push a party-impact world built atop an unpersisted /
    // conflicted advance over the (different, winning) cloud timeline, manufacturing
    // the hybrid state the advance's cloud-pending discipline exists to prevent. The
    // impacts stay drained on the LOCAL world (the tick is real locally) and replay
    // on the retry/reload that reconciles the advance, so nothing is lost.
    if (result && result.ok !== false && !result.cloudPending && drainedPartyImpacts.length
        && typeof get().recordPartyImpact === 'function') {
      for (const pi of drainedPartyImpacts) {
        try { await get().recordPartyImpact(campaignId, pi.action); } catch { /* best-effort */ }
      }
    }
    return result;
  },

  /**
   * Advance-scaling Stage 3 RESUME — apply the DM's verdicts on a paused interval's
   * batched majors and continue the remaining ticks. Reads the resume cursor from
   * c.worldState.pausedAdvance (parked by a paused advanceCampaignWorld, and
   * rehydrated verbatim on reload), re-enters the interval orchestrator's resume
   * path (which re-derives the paused tick from its PRE-tick inputs with the
   * decisions folded in — recommended ⇒ byte-identical to autoresolve-ON, dismissed
   * ⇒ excluded), commits the resumed segment, and either CLEARS pausedAdvance (the
   * interval finished) or parks a FRESH cursor (the next tick surfaced majors).
   *
   * `decisions` is the DM's per-major verdict keyed by outcome id ({ [id]: { decision:
   * 'recommended'|'dismissed' } }); an empty map resolves every pending major to
   * recommended. Persists atomically like advanceCampaignWorld (069 forward guard).
   *
   * @param {string} campaignId
   * @param {Record<string, {decision?: string}>} [decisions]
   * @param {{ now?: string }} [options]
   */
  resolveIntervalMajors: async (campaignId, decisions = {}, options = {}) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    const { simulateCampaignWorldInterval: domainSimulateCampaignWorldInterval } = await loadWorldPulse();

    // Compute the resumed interval OUTSIDE any producer, from plain clones lifted in
    // a read-only set(). The orchestrator's resume is PURE over the cursor's pre-tick
    // inputs, so the live campaign/saves are only the commit target — the cursor
    // drives determinism.
    /** @type {any} */ let simCampaign = null;
    /** @type {any} */ let simSaves = null;
    /** @type {any} */ let cursor = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const worldState = ensureWorldState(c.worldState, c);
      cursor = worldState.pausedAdvance ? cloneJson(worldState.pausedAdvance) : null;
      if (!cursor) { result = { ok: false, reason: 'no_paused_advance' }; return; }
      simCampaign = cloneJson(c);
      simSaves = cloneJson(campaignSettlements(state, campaignId));
    });

    if (!simCampaign || !cursor) return result;

    // Determinism: replay with the advance's ORIGINAL `now` (parked on the cursor),
    // NOT a fresh wall-clock — the resume re-derives the paused tick through the
    // kernel, which stamps `now` into regional-graph/wizard-news records, so a fresh
    // now would make a seed-replay-identical resume diverge. An explicit options.now
    // still wins (tests/callers that pin a clock); the cursor's now is the default,
    // and only a legacy cursor lacking it falls back to wall-clock.
    const now = options.now || cursor.now || new Date().toISOString();
    const pre = cursor.preSnapshot || {};
    result = domainSimulateCampaignWorldInterval({
      campaign: simCampaign,
      saves: simSaves,
      commit: true,
      now,
      autoResolve: false,
      resume: {
        interval: cursor.interval,
        ticksTotal: cursor.ticksTotal,
        resumeTick: cursor.resumeTick,
        pendingMajors: cursor.pendingMajors || [],
        preWorldState: pre.worldState,
        preRegionalGraph: pre.regionalGraph,
        preWizardNews: pre.wizardNews,
        preSaves: pre.saves,
        decisions: decisions || {},
        // Stage 5 ring policy: the original pre-interval length, so the whole
        // multi-segment interval collapses to ONE composed record on finish.
        preIntervalHistoryLen: cursor.preIntervalHistoryLen,
      },
    });

    if (result && result.status) {
      set(state => {
        const c = findActiveCampaign(state.campaigns, campaignId);
        if (!c) return;
        persistUpdates = applyWorldPulseResultToState(state, c, result, now);
        // Park a FRESH cursor if the resumed segment paused again; else CLEAR the
        // cursor back to byte-neutral (the interval finished).
        if (result.status === 'paused') {
          c.worldState = {
            ...c.worldState,
            pausedAdvance: {
              interval: result.interval,
              ticksTotal: result.ticksTotal,
              ticksDone: result.ticksDone,
              atTick: result.atTick,
              resumeTick: result.resumeTick,
              autoResolve: false,
              startedAt: now,
              // Determinism: a re-pause within a resume re-threads the SAME original
              // `now` so every segment of the interval replays from one wall-clock.
              now,
              // Stage 5 ring policy: thread the original pre-interval history length
              // through every re-pause so the whole interval collapses to one record.
              preIntervalHistoryLen: result.preIntervalHistoryLen,
              pendingMajors: cloneJson(result.pendingMajors) || [],
              // Park the PRE-tick references directly (NOT a second cloneJson): they are
              // already plain deep clones off simCampaign/simSaves threaded through the
              // kernel, and re-cloning the whole pre-tick world on every re-pause of a
              // multi-pause interval doubles the retained + serialized cursor for no
              // gain. Resume feeds identical bytes either way (determinism preserved).
              preSnapshot: {
                worldState: result.preWorldState,
                regionalGraph: result.preRegionalGraph,
                wizardNews: result.preWizardNews,
                saves: result.preSaves || [],
              },
            },
          };
        } else if (c.worldState && 'pausedAdvance' in c.worldState) {
          const { pausedAdvance: _drop, ...rest } = c.worldState;
          c.worldState = rest;
        }
        campaignPersist = cacheCampaignState(state);
      });
    }

    if (result && result.status && campaignPersist) {
      track(EVENTS.WORLD_PULSE_ADVANCED, {
        ...extractPulseSummary(result, result.interval),
        events_applied_count: Array.isArray(result.autoApplied) ? result.autoApplied.length : 0,
      });
    }

    const persistOutcome = await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    if (result && result.ok !== false && persistOutcome && persistOutcome.ok === false) {
      result.cloudPending = true;
    }
    return result;
  },

  /** Advance-scaling Stage 3: is there a paused advance awaiting major decisions
   *  for this campaign? Drives the resume affordance + rehydrates after a reload. */
  getPausedAdvance: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    return ensureWorldState(c?.worldState, c).pausedAdvance || null;
  },

  applyWorldPulseProposal: async (campaignId, proposalId) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    let appliedDecision = /** @type {any} */ (null);
    const now = new Date().toISOString();
    // Lazy-load the simulation before the (synchronous) Immer producer below —
    // Immer producers can't be async, so the import is awaited up front.
    const { applyWorldPulseProposal: domainApplyWorldPulseProposal } = await loadWorldPulse();
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
    {
      // backward:true — applying a proposal mutates the world but does NOT advance
      // the tick, so the snapshot tick EQUALS the cloud's. Under the forward guard
      // (advance only when strictly behind) that ties → stale_tick (read as success)
      // and the applied proposal is silently dropped on reload. So this is a
      // last-write-wins write, exactly like undo (expectedTick = null).
      const persistOutcome = await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId, backward: true });
      // Same cloud-pending contract as advanceCampaignWorld: a failed persist
      // already raised the retryable banner, so flag the result rather than let a
      // caller read an unqualified success over a cloud-pending write.
      if (result && result.ok !== false && persistOutcome && persistOutcome.ok === false) {
        result.cloudPending = true;
      }
    }
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
    // Lazy-load the simulation before the (synchronous) Immer producer below.
    const { applyPartyImpact: domainApplyPartyImpact } = await loadWorldPulse();
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
    {
      // backward:true — a party impact is a discrete injection, NOT a time advance
      // (the snapshot tick equals the cloud's), so the forward guard would tie and
      // return stale_tick (read as success), dropping the impact's settlement deltas
      // on reload. Last-write-wins like undo (expectedTick = null) so the write lands.
      const persistOutcome = await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId, backward: true });
      if (result && result.ok !== false && persistOutcome && persistOutcome.ok === false) {
        result.cloudPending = true;
      }
    }
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
    // backward:true — an undo restores a PRIOR (lower) tick, so it MUST bypass the
    // forward stale-tick guard (last-write-wins). Otherwise the cloud, holding the
    // higher post-advance tick, rejects the revert as stale_tick (which the client
    // reads as success) and the undone advance resurrects on reload. The forward
    // advance path leaves backward falsy, keeping the guard intact.
    await flushWorldPulsePersist({ result: didUndo, campaignPersist, persistUpdates, campaignId, backward: true });
    return didUndo;
  },
});
