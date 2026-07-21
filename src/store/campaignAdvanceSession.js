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
import { appendWizardNewsEntries } from '../domain/region/index.js';
// Lane-2 drain-path parity (domain-events-region-1 twin): the LIGHT eager-safe gate
// deciding whether a queued event is a NON-party canon relationship verb — the SAME
// gate the immediate path (settlementSlice.rippleEventThroughWorld) uses, so the two
// paths surface identical events (single source, no drift). Imported into this LAZY
// body only, so it adds nothing to the first-paint closure.
import { canonRelationshipTargetFor } from '../domain/events/canonRelationshipLinkage.js';
import { advancesOnOpen, worldProgressionOf, CATCH_UP_CAP_WEEKS } from '../domain/worldPulse/simulationRules.js';
import { buildChronicleGrounding } from '../domain/worldPulse/chronicle.js';
import {
  cloneJson, cacheCampaignState, flushWorldPulsePersist, findActiveCampaign, campaignSettlements,
} from './campaignSliceShared.js';
import {
  capturePulseSnapshot, applyWorldPulseResultToState, drainCampaignQueueIntoState,
} from './campaignPulseHelpers.js';
import { track, EVENTS } from '../lib/analytics.js';
import { flag } from '../lib/flags.js';
import { verifyAdvanceDeterminism } from '../lib/advanceParanoia.js';
import { captureFingerprint } from '../lib/researchCapture.js';
import { getConsent } from '../lib/consent.js';
import { enqueuePulseEffect } from '../lib/analyticsQueue.js';
import {
  extractPulseSummary, extractPulseEffects, extractStressorTransitions,
} from '../lib/pulseFingerprint.js';
// Coarse, id-free spatial/mover usage summary (side-channel; lazy — see spatialUsage.js).
import { extractSpatialUsage } from '../lib/spatialUsage.js';
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
 * Deposit-and-consume reconcile (fix wave 2 #2). applyWorldPulseResultToState commits
 * `result.wizardNews` WHOLESALE, and that feed was derived from the pre-advance clone
 * lifted BEFORE the advance's in-flight yield. A wizardNews write that landed on the
 * LIVE feed during that yield — a confirmed table-event import (importTableEvents, the
 * one ungated wizardNews writer) — is therefore absent from `resultWizardNews` and
 * would be silently clobbered. This folds back ONLY the entries whose id is NEW since
 * the pre-advance snapshot (`preIds`); the pre-existing entries the advance's own cap
 * intentionally evicted stay evicted (their ids ARE in `preIds`), so a no-concurrent-
 * write advance is byte-identical (empty landed set ⇒ the original feed is returned by
 * reference). Idempotent: appendWizardNewsEntries dedups by stable id. Called at the
 * pre-commit point of BOTH commit paths (advance + paused-resume) so the two can never
 * diverge — the same single-source discipline the war-front reads follow.
 * @param {any} resultWizardNews the pure result feed (the wholesale-commit target)
 * @param {any} liveWizardNews    the live campaign feed at commit time (with any import)
 * @param {Set<string>} preIds    wizardNews entry ids present BEFORE the advance
 * @param {string} now
 * @returns {any} the reconciled feed (the input feed unchanged when nothing landed)
 */
export function reconcileWizardNewsForCommit(resultWizardNews, liveWizardNews, preIds, now) {
  if (!resultWizardNews) return resultWizardNews;
  const liveEntries = Array.isArray(liveWizardNews?.entries) ? liveWizardNews.entries : [];
  const guard = preIds instanceof Set ? preIds : new Set();
  const landed = liveEntries.filter(
    (/** @type {any} */ e) => e && e.id != null && !guard.has(String(e.id))
  );
  if (!landed.length) return resultWizardNews;
  return appendWizardNewsEntries(resultWizardNews, cloneJson(landed), { now });
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
 *   options?: { now?: string, autoResolve?: boolean, weeks?: number },
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
    // M10b catch-up (performance-scale-4): a living/autonomous catch-up passes an
    // explicit whole-week span via options.weeks. A catch-up is INHERENTLY multi-week,
    // so it ALWAYS routes through the interval orchestrator — one composed interval =
    // one snapshot+drain, one Phase-2 commit, one persist, one cloud sync — regardless
    // of the advanceMultiTick killswitch (the single-tick legacy path can only run ONE
    // week, so it cannot serve a catch-up). A normal DM advance passes no weeks, so
    // useMultiTick still follows the flag and the flag-OFF path stays byte-identical.
    const catchUpWeeks = typeof options.weeks === 'number' && Number.isFinite(options.weeks) && options.weeks > 0 ? Math.floor(options.weeks) : null;
    const useMultiTick = catchUpWeeks != null || flag('advanceMultiTick');
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
    /** NON-party canon relationship verbs surfaced from the pre-drain queue —
     *  replayed through recordCanonRelationshipRipple AFTER the pulse (the Lane-2
     *  drain twin, mirroring the immediate path's relationship-ripple branch). */
    let drainedCanonRel = /** @type {Array<{ event: any, homeId: string }>} */ ([]);
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
    /** @type {any[]} */ let drainRefusalNews = [];
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
      // Lane-2 drain twin: capture the NON-party canon relationship verbs from the
      // queue BEFORE the drain clears it, lifted to plain objects (the queue items
      // are draft proxies Immer revokes when this producer returns). The immediate
      // path ripples these the instant they apply; a clock-bound member's identical
      // verb must ripple at the tick, through the SAME applier (replayed below).
      drainedCanonRel = (worldState.pendingEvents || [])
        .filter((/** @type {any} */ item) => item && item.event && !item.event.partyCaused
          && canonRelationshipTargetFor(item.event, item.saveId))
        .map((/** @type {any} */ item) => ({ event: cloneJson(item.event), homeId: String(item.saveId) }));
      const drained = drainCampaignQueueIntoState(state, c, worldState, now);
      c.worldState = drained.worldState;
      drainedPartyImpacts = drained.partyImpacts || [];
      // §10: lift the queue-refusal digest entries to plain objects (Immer drafts
      // revoke); folded into the pulse result's feed after the compute below.
      drainRefusalNews = cloneJson(drained.refusalNews || []);
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

    // M10b (state-lifecycle-1 / store-1): the world clock BEFORE this advance,
    // lifted off the pre-tick sim clone so Phase-2 can tell whether the advance
    // actually moved time. Drain never touches tick, so simCampaign.worldState.tick
    // is the pre-advance value.
    const preTick = simCampaign?.worldState?.tick;

    // Deposit-and-consume reconcile (fix wave 2 #2): the pre-advance wizardNews ids,
    // lifted off the same pre-advance clone. result.wizardNews is derived from this
    // clone, so any live-feed entry NOT in this set landed during the await. (When the
    // Phase-1 set bailed — e.g. world_not_canonized — simCampaign is null ⇒ empty set,
    // and the reconcile block below is guarded by `simCampaign` so it never runs.)
    /** @type {Set<string>} */
    const preAdvanceNewsIds = new Set(
      (Array.isArray(simCampaign?.wizardNews?.entries) ? simCampaign.wizardNews.entries : [])
        .map((/** @type {any} */ e) => String(e?.id))
    );

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
        // M10b catch-up: an explicit whole-week span drives the orchestrator's tick
        // count (overriding the interval→week table); inert for a normal DM advance
        // (no weeks ⇒ the named-interval table). Threads through runAdvanceInterval's
        // payload spread into the worker AND the in-thread fallback alike.
        ...(catchUpWeeks != null ? { weeks: catchUpWeeks } : {}),
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

      // R-18 WORKER PARANOIA MODE (dev-only, default OFF): re-run the just-completed
      // worker advance in-thread and diff the two worldStates, surfacing any worker↔
      // sync divergence through the R-14 pipeline. The gate (paranoiaEnabled) ANDs the
      // flag with import.meta.env.DEV — a build-time `false` in production — so this is
      // inert (and tree-shakeable) on every prod path; off, it is byte-neutral (one
      // flag read, no second advance). Read-only: it never touches `result` or state.
      // (Only the multi-tick worker path produces the composed 'complete' result this
      // guards; the single-tick advanceCampaignWorld branch has no worker to diff.)
      if (result && result.status === 'complete' && useMultiTick) {
        await verifyAdvanceDeterminism({
          workerResult: result,
          // Re-run in-thread over a clone so the paranoia pass can neither be
          // contaminated by nor contaminate the committed advance.
          runSync: () => simulateCampaignWorldInterval(cloneJson(multiTickArgs)),
        });
      }
    }

    // §10 (W-COMPOSER-2): the queue-mouth refusals ride the advance digest —
    // append them to the result's feed through the house appender (dedupe/cap).
    if (simCampaign && result && drainRefusalNews.length && result.wizardNews) {
      result.wizardNews = appendWizardNewsEntries(result.wizardNews, drainRefusalNews);
    }

    // Deposit-and-consume reconcile (fix wave 2 #2): fold back any wizardNews entry
    // (e.g. a confirmed table-event import) that landed on the LIVE feed during this
    // advance's in-flight yield, BEFORE the wholesale commit below clobbers it. A
    // no-concurrent-write advance is byte-identical. Covers BOTH commit paths (manual
    // Advance AND the setActiveCampaign auto-catch-up), which share this Phase-2 commit.
    if (simCampaign && result && result.wizardNews) {
      result.wizardNews = reconcileWizardNewsForCommit(
        result.wizardNews,
        findActiveCampaign(get().campaigns, campaignId)?.wizardNews,
        preAdvanceNewsIds,
        now,
      );
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
        // M10b re-stamp (state-lifecycle-1 / store-1): whenever this advance moved
        // the world clock in a LIVING/AUTONOMOUS world, stamp the catch-up cursor
        // HERE — inside the Phase-2 commit, BEFORE cacheCampaignState — so the moved
        // cursor rides the SAME atomic persist (both the localStorage cache written
        // by cacheCampaignState and the cloud snapshot synced from campaignPersist).
        // Previously the stamp lived in a SEPARATE post-advance set() in the slice,
        // AFTER this persist ran, so both persisted surfaces carried the PRE-advance
        // cursor and a reload re-simulated the already-advanced weeks (phantom time).
        // Placed AFTER the undo-snapshot push above, so undoLastPulse still restores
        // the prior cursor with the reverted worldState. dm_advanced/frozen ⇒
        // advancesOnOpen false ⇒ inert (byte-identical; goldens test the domain).
        if (c.worldState && advancesOnOpen(c.worldState.simulationRules)
            && c.worldState.tick !== preTick) {
          c.worldState = { ...c.worldState, lastLivingAdvanceAt: now };
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
        // Spatial-engine usage: which movers fired + which preset/flags this tick ran
        // under (read-only off the post-tick worldState; empty when aspatial).
        ...extractSpatialUsage(result.worldState),
      // Campaign-grain subject stamp (A2 deferral / §4 market floor): the campaign
      // uuid keys the k=200-campaigns floor so the sellable preset-adoption cells can
      // form. uuid-validated server-side (ingest uuidOrNull → subject_id); a non-uuid
      // legacy campaignId is simply dropped, never leaked.
      }, { subjectId: campaignId });
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
    // Lane-2 drain-path parity (domain-events-region-1 twin): replay the queued
    // NON-party canon relationship verbs through the SAME applier the immediate path
    // uses (recordCanonRelationshipRipple → applyCanonRelationshipEvent), so a DM
    // relationship verb authored on a clock-bound member lands the campaign's pulse
    // edge at the tick EXACTLY as an immediate one does — same canonical edge minting
    // (edgeIdFor), same lastCanonEventId supersession stamp, same orientation
    // normalization. The advance's pinned `now` is threaded (the pinNow seam) so the
    // drained ripple is deterministic + tick-simultaneous. Undo honesty comes from
    // the pre-pulse snapshot (undoLastPulse restores worldState + regionalGraph
    // wholesale), which predates this replay — identical to how the party-impact
    // replay above is reverted. Best-effort + orphan-guarded (a queued verb undone
    // before its replay is skipped by recordCanonRelationshipRipple's log check).
    if (result && result.ok !== false && drainedCanonRel.length
        && typeof get().recordCanonRelationshipRipple === 'function') {
      for (const cr of drainedCanonRel) {
        try { await get().recordCanonRelationshipRipple(campaignId, { ...cr, now }); } catch { /* best-effort */ }
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

  // Deposit-and-consume reconcile (fix wave 2 #2): the wizardNews ids on the LIVE
  // feed before this resume's await, lifted off the same clone the commit re-derives
  // over. Any live-feed entry NOT here at commit time (e.g. a table-event import that
  // landed during the resume's yield) must survive the wholesale wizardNews commit.
  // Mirrors runAdvanceCampaignWorld — the resume is the OTHER path through
  // applyWorldPulseResultToState.
  const preResumeNewsIds = new Set(
    (Array.isArray(simCampaign?.wizardNews?.entries) ? simCampaign.wizardNews.entries : [])
      .map((/** @type {any} */ e) => String(e?.id))
  );

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
    // Deposit-and-consume reconcile (fix wave 2 #2): re-append only wizardNews
    // entries that landed during this resume's yield (see runAdvanceCampaignWorld)
    // before the wholesale commit below clobbers them.
    if (result.wizardNews) {
      result.wizardNews = reconcileWizardNewsForCommit(
        result.wizardNews,
        findActiveCampaign(get().campaigns, campaignId)?.wizardNews,
        preResumeNewsIds,
        now,
      );
    }
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
      // M10b re-stamp on RESUME (state-lifecycle-1 / performance-scale-4): the resume
      // RE-DERIVES worldState wholesale from the cursor's PRE-interval snapshot, which
      // predates the pause's lastLivingAdvanceAt stamp (that stamp was applied by
      // runAdvanceCampaignWorld's Phase-2 to the COMMITTED worldState, never threaded
      // into the cursor's pre-tick inputs). So applyWorldPulseResultToState above just
      // OVERWROTE the cursor back to its pre-catch-up value — without this re-stamp a
      // resolved living catch-up would re-run the WHOLE span on the next open (phantom
      // re-catch-up, the exact double-count M10b exists to prevent). Under the
      // performance-scale-4 collapse the whole catch-up is ONE interval, so this resume
      // is the ONLY place the completing/continuing span re-commits worldState — it must
      // carry the stamp. Gated on advancesOnOpen only (NOT tick-moved: a last-tick pause
      // resumes to the same tick yet still must retain the stamp). `now` is the original
      // advance clock (cursor.now), so the world stays caught up to it. dm_advanced /
      // frozen ⇒ advancesOnOpen false ⇒ inert (byte-identical; goldens carry no living
      // paused-resume fixture).
      if (c.worldState && advancesOnOpen(c.worldState.simulationRules)) {
        c.worldState = { ...c.worldState, lastLivingAdvanceAt: now };
      }
      campaignPersist = cacheCampaignState(state);
    });
  }

  if (result && result.status && campaignPersist) {
    track(EVENTS.WORLD_PULSE_ADVANCED, {
      ...extractPulseSummary(result, result.interval),
      events_applied_count: Array.isArray(result.autoApplied) ? result.autoApplied.length : 0,
      ...extractSpatialUsage(result.worldState),
    // Campaign-grain subject stamp (A2 deferral / §4 market floor) — see the advance path.
    }, { subjectId: campaignId });
  }

  await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
  return result;
}

/**
 * M10b — the capped, deterministic advance-on-open catch-up BODY for a LIVING/
 * AUTONOMOUS world. Split out of campaignWorldPulseSlice's EAGER slice (FP-2 reclaim)
 * so its bytes stay OUT of the first-paint entry closure. The slice's thin wrapper
 * owns the SYNCHRONOUS not_living guard (so a dm_advanced open — the default — returns
 * WITHOUT loading the sim chunk); this body runs only for a world that opted into
 * autonomy, and re-reads the campaign through get() after the lazy load (the FP-2a
 * dep-import pattern, mirroring canonizeCampaignWorldSpatial → runSpatialCanonize).
 *
 * Computes how many whole weeks of REAL time have elapsed since the world last
 * advanced (worldState.lastLivingAdvanceAt), caps at CATCH_UP_CAP_WEEKS, and runs that
 * many one-week kernel ticks through ONE orchestrated interval (performance-scale-4
 * COLLAPSE, owner ruling 2026-07-14): `advanceCampaignWorld(..., { weeks: n })` forces
 * the interval orchestrator to run n real one-week ticks and compose ONE result — so a
 * catch-up is a SINGLE snapshot+drain, a single Phase-2 commit, a single localStorage
 * persist, and a single cloud sync (replacing the prior n SEQUENTIAL full store
 * advances that deep-cloned + persisted + awaited a sync n times on campaign open).
 * The kernel runs the SAME n one-week ticks in the same order, so the world CONTENT is
 * byte-identical to n manual advances; only the persist SHAPE differs — the interval
 * collapses pulseHistory to ONE composed record (Stage 5 policy) and the session undo
 * stack gets ONE snapshot (one catch-up = one undo step). Each advance re-stamps the
 * cursor to `now` (the M10b block in runAdvanceCampaignWorld), so:
 *   • past the cap, the calendar reaches `now` but the sim stopped at the cap
 *     (owner ruling 2026-07-13: calendar-advances-past-cap — no perpetual re-catch-up);
 *   • a LIVING catch-up that pauses on a major leaves the cursor at `now`; the DM
 *     resolves via resolveIntervalMajors, which resumes the remaining weeks of the
 *     SAME interval (autonomous auto-resolves and runs straight to the end).
 * A first open / legacy save (no cursor) SEEDS the cursor and advances nothing — never
 * a 1970-epoch delta. `now` is INJECTED for determinism (the UI open-hook passes
 * Date.now-derived time; tests pass a fixed value). JUDGMENT (vetoable): cursor jumps
 * to `now` on any catch-up (whole-week sim; sub-week remainder + past-cap overflow are
 * dropped). weeksCaughtUp = the interval's committed weeks (n complete; ticksDone at a
 * living pause; 0 if blocked/thrown before the atomic commit).
 *
 * @param {{ set: Function, get: Function, campaignId: string,
 *   options?: { now?: string|number } }} args
 * @returns {Promise<{ ok:boolean, weeksCaughtUp:number, capped:boolean, reason?:string }>}
 */
export async function runCatchUpCampaignWorld({ set, get, campaignId, options = {} }) {
  const campaign = findActiveCampaign(get().campaigns, campaignId);
  // The wrapper already applied the not_living guard; re-read the living campaign's
  // values here (the campaign is guaranteed living/autonomous with a worldState).
  const rules = campaign?.worldState?.simulationRules;
  const nowMs = options.now != null ? new Date(options.now).getTime() : Date.now();
  const nowStamp = new Date(nowMs).toISOString();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const cursor = campaign.worldState.lastLivingAdvanceAt;
  // First open (or a save switched to living/autonomous after canonize): no
  // cursor yet ⇒ nothing is OWED. Seed the cursor to now, persist it (so a reload
  // doesn't re-seed and mis-count), advance nothing.
  if (cursor == null) {
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (c && c.worldState) c.worldState.lastLivingAdvanceAt = nowStamp;
    });
    await flushWorldPulsePersist({ result: true, campaignPersist: cacheCampaignState(get()), persistUpdates: [], campaignId });
    return { ok: true, weeksCaughtUp: 0, capped: false, reason: 'seeded' };
  }
  const elapsedWeeks = Math.floor((nowMs - new Date(cursor).getTime()) / WEEK_MS);
  if (!(elapsedWeeks > 0)) {
    return { ok: true, weeksCaughtUp: 0, capped: false, reason: 'up_to_date' };
  }
  const capped = elapsedWeeks > CATCH_UP_CAP_WEEKS;
  const n = capped ? CATCH_UP_CAP_WEEKS : elapsedWeeks;
  // AUTONOMOUS resolves the realm's own majors during catch-up (the story carries
  // itself forward); LIVING advances routine but a surfacing major PAUSES the
  // catch-up for the DM (they resolve it and the world resumes on the next advance).
  const autoResolve = worldProgressionOf(rules) === 'autonomous';
  // components-dossier-4: mint the "while you were away" digest in a RUNNING state so
  // the banner (RealmDashboard / WorldPulsePanel) shows a busy indicator during the
  // up-to-CATCH_UP_CAP_WEEKS kernel ticks. Only now that n > 0 is there real work to
  // narrate — a seeded / up-to-date / not_living open above stashed nothing.
  set(state => { state.livingCatchUp = { campaignId, status: 'running', weeksCaughtUp: 0, capped }; });
  let done = 0;
  /** @type {string | null} */ let error = null;
  try {
    // performance-scale-4 COLLAPSE (owner ruling 2026-07-14 "collapse to one record"):
    // route the WHOLE catch-up through ONE orchestrated interval instead of n
    // sequential full store advances. `weeks: n` forces the interval orchestrator
    // (runAdvanceCampaignWorld → simulateCampaignWorldInterval / runAdvanceInterval)
    // to run n real one-week kernel ticks and compose ONE result — so the catch-up is
    // a SINGLE snapshot+drain, a single Phase-2 commit (which re-stamps the M10b
    // cursor to `now`), a single localStorage persist, and a single cloud sync. The
    // kernel runs the SAME n one-week ticks in the same order, so the world CONTENT is
    // byte-identical to n manual advances; only the persist SHAPE differs — the
    // interval collapses pulseHistory to ONE composed record (Stage 5 policy), and the
    // undo stack gets ONE snapshot (one catch-up = one undo step). autoResolve carries
    // the living/autonomous split: autonomous resolves the realm's majors and runs to
    // the end; living defers, so the FIRST tick that surfaces a major PAUSES the
    // interval for the DM (parked on worldState.pausedAdvance) — they resolve via
    // resolveIntervalMajors, which resumes the remaining weeks of the SAME interval.
    const result = await get().advanceCampaignWorld(campaignId, 'one_week', { now: nowStamp, autoResolve, weeks: n });
    if (!result || result.ok === false) {
      // Blocked before any commit (frozen / already in flight / a parked pause from a
      // prior unresolved catch-up): nothing advanced. The whole interval is atomic, so
      // a not-ok result committed zero weeks.
      done = 0;
    } else if (result.status === 'paused') {
      // LIVING paused on a surfacing major: the weeks committed at the pause boundary
      // (ticksDone) are the caught-up span; the remainder awaits the DM's verdict.
      // The digest banner reads the park off worldState.pausedAdvance directly (a lazy
      // read, so this eager store path stays byte-inert — experience-product-fit-1).
      done = Math.max(0, Number(result.ticksDone) || 0);
    } else {
      // Ran to the end (autonomous, or living with no major) — the full span caught up.
      done = n;
    }
  } catch (err) {
    // components-dossier-4: a THROWN advance is a real failure — surface it in the
    // digest rather than letting setActiveCampaign's fire-and-forget swallow it. The
    // interval is one atomic Phase-2 commit, so a throw mid-interval committed zero
    // weeks (done stays 0) — the catch-up rolls back whole rather than part-persisted.
    error = err && /** @type {any} */ (err).message ? String(/** @type {any} */ (err).message) : String(err);
  }
  // Settle the digest: the major chronicle beats over the caught-up window (built
  // from the SAME deterministic grounding the interval summary uses), plus the
  // capped flag and any failure. The banner self-gates to nothing when the active
  // campaign has no digest, so a quiet advance still confirms "N weeks passed".
  const majors = done > 0 ? catchUpMajorHeadlines({ get, campaignId, lookback: done }) : [];
  set(state => { state.livingCatchUp = { campaignId, weeksCaughtUp: done, capped, majors, error }; });
  return { ok: true, weeksCaughtUp: done, capped };
}

/**
 * components-dossier-4: the major chronicle beats over the just-caught-up window,
 * built from the SAME deterministic grounding the ChronicleScrollback interval
 * summary uses (buildChronicleGrounding over `lookback` recent ticks). Pure read
 * over the post-catch-up campaign; lazy-loaded with this body so no chronicle-
 * grounding bytes reach the first-paint entry closure.
 * @param {{ get: Function, campaignId: string, lookback: number }} args
 * @returns {string[]}
 */
function catchUpMajorHeadlines({ get, campaignId, lookback }) {
  const after = findActiveCampaign(get().campaigns, campaignId);
  if (!after) return [];
  const saves = get().savedSettlements || [];
  const nameMap = new Map();
  for (const s of saves) {
    const i = String(s?.id ?? s?.settlement?.id ?? '');
    if (i) nameMap.set(i, s?.settlement?.name || s?.name || i);
  }
  const nameFor = (/** @type {any} */ id) => nameMap.get(String(id)) || String(id);
  const grounding = buildChronicleGrounding({
    wizardNews: after.wizardNews,
    worldState: after.worldState,
    snapshot: { settlements: (after.settlementIds || []).map((/** @type {any} */ id) => ({ id, name: nameFor(id) })) },
    regionalGraph: after.regionalGraph || after.worldState?.regionalGraph || null,
    lookback: Math.max(1, lookback),
  });
  return Array.isArray(grounding?.majorHeadlines) ? grounding.majorHeadlines.slice(0, 6) : [];
}
