/**
 * campaignAdvanceSession.js — the multi-tick advance SESSION logic (pause cursor +
 * resume), split out of campaignWorldPulseSlice so it does NOT sit in the
 * first-paint entry closure.
 *
 * The pause/resume machinery is reachable ONLY once a DM advances a campaign's
 * world clock — the same lazy boundary the heavy simulation already loads behind
 * (campaignWorldPulseSlice.loadWorldEngine()). So this module is imported through
 * that SAME dynamic import, keeping its bytes out of the eager store graph while
 * the slice's method bodies stay thin wrappers that await the loader (which they
 * already do). Determinism / behaviour are unchanged — this is a pure code-location
 * move: the resume kernel + cursor shape are byte-identical to the inline version.
 *
 * `set` / `get` are threaded in from the slice so this helper mutates the SAME
 * Immer store; every store helper it needs (persistence, pulse-apply, analytics)
 * is a leaf already in the eager graph, so importing them here references the
 * existing chunks rather than duplicating them into a lazy one.
 *
 * The heavy sim functions (advanceCampaignWorld / simulateCampaignWorldInterval /
 * runAdvanceInterval) are passed in as `deps` from the slice's loadWorldEngine()
 * resolution rather than statically imported here — so they resolve through the
 * SAME dynamic-import seam tests mock, and this module never gains a static edge to
 * the sim (keeping the lazy chunking + the mockability of the kernel intact).
 */
import { ensureWorldState } from '../domain/worldPulse/worldState.js';
import {
  cloneJson, cacheCampaignState, flushWorldPulsePersist, findActiveCampaign, campaignSettlements,
} from './campaignSliceShared.js';
import {
  capturePulseSnapshot, applyWorldPulseResultToState, drainCampaignQueueIntoState,
} from './campaignPulseHelpers.js';
import { track, EVENTS } from '../lib/analytics.js';
import { flag } from '../lib/flags.js';
import { captureFingerprint } from '../lib/researchCapture.js';
import { getConsent } from '../lib/consent.js';
import { enqueuePulseEffect } from '../lib/analyticsQueue.js';
import {
  extractPulseSummary, extractPulseEffects, extractStressorTransitions,
} from '../lib/pulseFingerprint.js';
import {
  extractRegionalGraphSnapshot, extractRegionalArcs, extractRegionalPropagation,
} from '../lib/regionalFingerprint.js';

// Per-campaign cap on retained pre-pulse snapshots (multi-step undo depth). Mirrors
// the slice's PULSE_UNDO_CAP — the advance body that reads it now lives here.
const PULSE_UNDO_CAP = 10;

/**
 * Build the pausedAdvance resume cursor from a paused interval result. Shared by
 * the advance path (Phase-2 first pause) and the resume path (a re-pause) so both
 * park an identically-shaped cursor. The PRE-tick fields are already plain deep
 * clones (threaded off the sim inputs through the kernel), so they are parked by
 * reference — a second clone would only re-copy the whole pre-tick world for no gain.
 * @param {any} result - a { status:'paused', … } interval result.
 * @param {string} now - the ORIGINAL advance wall-clock, re-threaded so a resume
 *   replays from the same clock the pause was computed from.
 */
export function buildPausedAdvanceCursor(result, now) {
  return {
    interval: result.interval,
    ticksTotal: result.ticksTotal,
    ticksDone: result.ticksDone,
    atTick: result.atTick,
    resumeTick: result.resumeTick,
    autoResolve: false,
    startedAt: now,
    now,
    preIntervalHistoryLen: result.preIntervalHistoryLen,
    pendingMajors: cloneJson(result.pendingMajors) || [],
    preSnapshot: {
      worldState: result.preWorldState,
      regionalGraph: result.preRegionalGraph,
      wizardNews: result.preWizardNews,
      saves: result.preSaves || [],
    },
  };
}

/**
 * The advance BODY — snapshot + drain + lift (Phase 1), the pure/awaited compute
 * (flag-branched single-tick vs multi-tick, worker vs in-thread), the commit
 * (Phase 2 + pause-park), then the analytics + persist + party-replay tail. Split
 * out of the slice so its bytes (and the advance-only fingerprint/analytics imports
 * it pulls) stay OUT of the first-paint entry closure.
 *
 * The slice's thin wrapper owns the SYNCHRONOUS in-flight + parked-pause guards and
 * the in-flight mark/clear finally; this body runs inside that guarded window. It is
 * a verbatim code-location move — the flag-OFF single-tick path stays byte-identical.
 *
 * @param {{ set: Function, get: Function, campaignId: string, interval?: string,
 *   options?: { now?: string, autoResolve?: boolean },
 *   deps: { advanceCampaignWorld: Function, simulateCampaignWorldInterval: Function,
 *           runAdvanceInterval: Function } }} args
 */
export async function runAdvanceCampaignWorld({ set, get, campaignId, interval = 'one_month', options = {}, deps }) {
    const { advanceCampaignWorld, simulateCampaignWorldInterval, runAdvanceInterval } = deps;
    // Advance-scaling Stage 1: a flag selects the advance path. OFF (killswitch) →
    // the single-tick `advanceCampaignWorld`; the flag-OFF store path is byte-
    // identical to the legacy advance. ON → `simulateCampaignWorldInterval`, which
    // runs N real one-week ticks and composes ONE result of the same shape, so the
    // snapshot/drain/commit/persist/analytics scaffolding below runs ONCE per Advance
    // regardless of tick count.
    const useMultiTick = flag('advanceMultiTick');
    // Advance-scaling Stage 3: auto-resolve rides ONLY the multi-tick path. OFF ⇒ the
    // orchestrator PAUSES at the first tick that surfaces majors. options.autoResolve
    // overrides per-advance; otherwise the store toggle governs. The single-tick path
    // ignores it (it never pauses).
    const autoResolve = options.autoResolve != null ? !!options.autoResolve : !!get().advanceAutoResolve;
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

    // ── Phase 1: snapshot + drain, then lift the (plain, already-drained)
    // simulation inputs OUT of the Immer producer. The heavy pulse is a pure
    // function over plain clones, so we run it OUTSIDE the producer (multi-tick is
    // awaited — it yields between tick batches). JS is single-threaded, so no other
    // action can observe the drained-but-not-committed intermediate state; the
    // advanceInFlight guard (set by the wrapper) serializes advance/resume on THIS
    // campaign across the yield. For the flag-OFF single-tick path the compute is
    // synchronous, so this split is output-identical to the legacy single set().
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
      // after the pulse is confirmed (Phase 2 below). capturePulseSnapshot deep-
      // clones every field, so the snapshot survives across the two set() calls.
      preSnapshot = capturePulseSnapshot(state, c, now);
      // Advance-scaling Stage 5: tag the snapshot with the DM-CHOSEN interval so the
      // session-only Undo affordance can name what it reverts ("Undo the last advance
      // (1 year)"). Session-scoped like the stack itself; never persisted.
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
      // Snapshot the pre-pulse queued-impact ids (primitive Set — safe to read
      // outside set) so we can isolate this pulse's NEW propagation impacts. Read
      // here; the pure compute takes clones and never mutates c.regionalGraph.
      priorQueuedIds = new Set((c.regionalGraph?.queuedImpacts || []).map(i => String(i.id)));
      // Lift plain (post-drain) simulation inputs OUT of the draft — the ONLY
      // clones the pure pulse needs.
      simCampaign = cloneJson(c);
      simSaves = cloneJson(campaignSettlements(state, campaignId));
      // drainCampaignQueueIntoState read the authored events off THIS draft, so
      // their values are draft proxies Immer revokes when this producer returns.
      // Lift them to plain objects now so the Phase-2 commit's
      // applyWorldPulseResultToState can safely read them after revocation.
      authoredEventBySave = drained.authoredEventBySave instanceof Map
        ? new Map([...drained.authoredEventBySave].map(([k, v]) => [k, cloneJson(v)]))
        : drained.authoredEventBySave;
    });

    // Pure, heavy compute OUTSIDE the producer. The multi-tick path is awaited: the
    // orchestrator yields to the event loop between tick batches so a long advance
    // (up to 48 one-week kernel passes) does not freeze the UI. The compute is a pure
    // function over the plain clones lifted above, so the yield only changes WHEN the
    // commit lands, not WHAT it commits.
    if (simCampaign) {
      const multiTickArgs = {
        campaign: simCampaign,
        saves: simSaves,
        interval,
        commit: true,
        now,
        autoResolve,
      };
      result = useMultiTick
        // The worker runs the SAME simulate function off the main thread; the
        // fallback is the in-thread call (used in Node/tests/SSR, when the worker flag
        // is off, or when worker construction fails). customContent is snapshotted so
        // the worker's chain-activation seam matches the page.
        ? await (flag('simAdvanceWorker')
            ? runAdvanceInterval(multiTickArgs, {
                fallback: simulateCampaignWorldInterval,
                customContent: cloneJson(get().customContent || {}),
              })
            : simulateCampaignWorldInterval(multiTickArgs))
        : advanceCampaignWorld({
            campaign: simCampaign,
            saves: simSaves,
            interval,
            now,
          });
    }

    // ── Phase 2: commit the pure result back onto the draft.
    if (simCampaign && result) {
      set(state => {
        const c = findActiveCampaign(state.campaigns, campaignId);
        if (!c) return;
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
        persistUpdates = applyWorldPulseResultToState(state, c, result, now, authoredEventBySave);
        // Advance-scaling Stage 3 PAUSE: a paused interval committed its minors
        // (applyWorldPulseResultToState wrote the minors-only pause-tick worldState).
        // Park the resume cursor on c.worldState.pausedAdvance so the partial interval
        // + the cursor land in the SAME atomic persist. Only the multi-tick path
        // produces status:'paused', so this is inert when the flag is OFF.
        if (result.status === 'paused') {
          c.worldState = { ...c.worldState, pausedAdvance: buildPausedAdvanceCursor(result, now) };
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
}

/**
 * Advance-scaling Stage 3 RESUME — apply the DM's verdicts on a paused interval's
 * batched majors and continue the remaining ticks. Reads the resume cursor from
 * c.worldState.pausedAdvance (parked by a paused advance, rehydrated verbatim on
 * reload), re-enters the interval orchestrator's resume path (which re-derives the
 * paused tick from its PRE-tick inputs with the decisions folded in — recommended ⇒
 * byte-identical to auto-resolve-ON, dismissed ⇒ excluded), commits the resumed
 * segment, and either CLEARS pausedAdvance (the interval finished) or parks a FRESH
 * cursor (the next tick surfaced majors).
 *
 * The slice's thin wrapper owns the SYNCHRONOUS advanceInFlight guard + its finally
 * clear; this body runs inside that guarded window.
 *
 * @param {{ set: Function, get: Function, campaignId: string,
 *   decisions?: Record<string, {decision?: string}>, options?: { now?: string },
 *   deps: { simulateCampaignWorldInterval: Function, runAdvanceInterval: Function } }} args
 */
export async function runResolveIntervalMajors({ set, get, campaignId, decisions = {}, options = {}, deps }) {
  const { simulateCampaignWorldInterval, runAdvanceInterval } = deps;
  let result = /** @type {any} */ (null);
  let persistUpdates = [];
  let campaignPersist = /** @type {any} */ (null);

  // Lift the resume cursor + plain sim inputs in a read-only set(). The
  // orchestrator's resume is PURE over the cursor's pre-tick inputs, so the live
  // campaign/saves are only the commit target — the cursor drives determinism.
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
  // kernel, which stamps `now` into regional-graph/wizard-news records. An explicit
  // options.now still wins (tests/callers that pin a clock); a legacy cursor lacking
  // `now` falls back to wall-clock.
  const now = options.now || cursor.now || new Date().toISOString();
  const pre = cursor.preSnapshot || {};
  const resumeArgs = {
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
      preIntervalHistoryLen: cursor.preIntervalHistoryLen,
    },
  };
  // Same worker/fallback split as the advance path (a resumed segment is also a
  // multi-tick run through the same simulate function).
  result = await (flag('simAdvanceWorker')
    ? runAdvanceInterval(resumeArgs, {
        fallback: simulateCampaignWorldInterval,
        customContent: cloneJson(get().customContent || {}),
      })
    : simulateCampaignWorldInterval(resumeArgs));

  if (result && result.status) {
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      persistUpdates = applyWorldPulseResultToState(state, c, result, now);
      // Park a FRESH cursor if the resumed segment paused again; else CLEAR the
      // cursor back to byte-neutral (the interval finished).
      if (result.status === 'paused') {
        c.worldState = { ...c.worldState, pausedAdvance: buildPausedAdvanceCursor(result, now) };
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

  await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
  return result;
}
