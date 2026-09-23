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
import { ensureWorldState, pulseIdFor } from '../domain/worldPulse/worldState.js';
import { appendWizardNewsEntries } from '../domain/region/index.js';
// Lane-2 drain-path parity (domain-events-region-1 twin): the LIGHT eager-safe gate
// deciding whether a queued event is a NON-party canon relationship verb — the SAME
// gate the immediate path (settlementSlice.rippleEventThroughWorld) uses, so the two
// paths surface identical events (single source, no drift). Imported into this LAZY
// body only, so it adds nothing to the first-paint closure.
import { canonRelationshipTargetFor } from '../domain/events/canonRelationshipLinkage.js';
import { advancesOnOpen, worldProgressionOf, CATCH_UP_CAP_WEEKS } from '../domain/worldPulse/simulationRules.js';
import { generateSeed } from '../kernel/prng.js';
// FULL AUTO-RESOLVE (realm directive 7 / J-D7). Static import is free here: this
// whole module is reachable only through campaignWorldPulseSlice.loadWorldEngine(),
// the SAME dynamic import that already pulls advanceCampaignWorld → pulseKernel →
// applyWorldPulse, so the adjudicator rides the existing lazy sim chunk and adds
// nothing to the first-paint entry closure.
import { autoAdjudicateAdvanceProposals } from '../domain/worldPulse/autoAdjudication.js';
import { buildChronicleGrounding } from '../domain/worldPulse/chronicle.js';
import {
  cloneJson, cacheCampaignState, flushWorldPulsePersist, findActiveCampaign, campaignSettlements,
  parkedIntervalUndoSnapshot,
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
import {
  contentRuntimeFromCampaignBinding,
} from '../domain/content/contentEnvironment.js';
import { PULSE_UNDO_CAP } from './pulseUndoCap.js';

/**
 * Per-campaign cap on retained pre-pulse snapshots (multi-step undo depth). The advance
 * body that evicts past it lives here and reads it from its own leaf; the slice that once
 * mirrored the number no longer spells it, and nothing else in src/ declares a second one.
 *
 * ⛔ THE DECLARATION MOVED DOWN TO A LEAF, AND THE RE-EXPORT IS WHY NOTHING ELSE MOVED
 * (U73, the verifier's FIX-5). U8 exported the cap from this file so the registry page
 * could stop parsing this source — and the page still could not read it, because the edit
 * mount is reached from `src/App.jsx` OUTSIDE every campaignLazy boundary and a static edge
 * into THIS file would put every runtime-gated campaign action in that mount's transitive
 * graph (`tests/store/campaignRuntimeCallerCoverage.test.js` derives those boundaries and
 * convicts exactly that). `./pulseUndoCap.js` is the one home now: it imports nothing, both
 * sides may reach it, and every reader that already imports the cap FROM HERE — the page's
 * own A7 arm among them — keeps working unchanged through this line.
 */
export { PULSE_UNDO_CAP } from './pulseUndoCap.js';
/**
 * ⭐ U72 — §20.3's LIVE CATALOGUES FOR THE HEAD OF THE TICK, COMPOSED AT THE ONE LAYER THAT
 * CAN COMPOSE THEM (design §20.3; ARCH §1 and §6; the verifier's FIX-3).
 *
 * "A pending decree that no longer resolves is WITHDRAWN WITH ITS REASON — never dropped,
 * never applied … the tick hook calls the resolver before it applies anything." EM-C1's
 * `resolveDecree` takes `{ opTypes, pools }` HANDED IN and the hook guards its whole
 * resolution on the bag being present, so until something composed one, every due entry
 * applied and design §20.3's rejected branch — best-effort application, "a pin on a fork
 * that no longer means what the DM chose is a lie" — was the shipping behaviour.
 *
 * ⛔ THE STORE IS THE ONLY LAYER THAT CAN. The op catalogue may not be imported by the
 * kernel or by the hook (`editMutationPath.walker` and EM-E1's two-import pin), and a pool's
 * values are a function of A SETTLEMENT — `npc.role` reads its institutions, `power.holder`
 * its factions, `institution.class` its tier — so the reading needs the live member saves,
 * which only this path holds. The bag then travels as an ARGUMENT the whole way down.
 *
 * ⛔ THE EDGE IS DYNAMIC, and that is what keeps the edit leaves out of every eager closure
 * (`EAGER_FIRST_PAINT_MODULES` walks STATIC edges only). It is the same idiom, and the same
 * reason, as the roster half's own dynamic reach into the edit slice further down this file
 * — ⛔ WHOSE CALL FORM IS NAMED IN WORDS AND NOT IN ITS OWN SPELLING ON PURPOSE, because
 * `tests/store/rosterOpsAtTick.test.js` case C4 counts that form over this file's RAW
 * SOURCE, comments included, and pins the total at ONE. A campaign whose saves hold no
 * PENDING decree — every world today — reaches no import at all, composes nothing, and
 * hands the kernel `null`, so the whole path is dormant by construction.
 *
 * ⛔ ONLY THE POOLS THE PENDING ENTRIES ACTUALLY NAME ARE READ, and that is a measurement,
 * not thrift: two of the seventeen (`name.settlement`, `name.npc`) are CROSS PRODUCTS of the
 * naming bag and would be thousands of strings on a payload that crosses a worker boundary.
 * The pool ids come from the op catalogue's own payload specs, so a row that grows a pool
 * field is covered the day it lands and nothing here is transcribed.
 *
 * ⭐ EACH SAVE IS JUDGED BY ITS OWN TOWN'S VOCABULARY, AND THAT IS U86's WHOLE MEMBER.
 * U72 shipped the LAX UNION — one `pools` bag folded across every member — because the hook
 * took ONE bag for N registries and a union is the only honest reading available to that
 * shape. Its own header recorded the cost and left the ruling to the chair: a word alive in
 * SOME member town admitted an order in a town that had never offered it, so a decree could
 * be applied against a vocabulary that is not its settlement's. It was ruled (U86, lane E's
 * ruling 2): the bag is keyed BY SAVE ID, `applyDecreesToSaves` hands each registry the
 * pools of ITS OWN save, and the union is gone rather than merely unread. Design §2.5 is
 * the reason it can be: `decrees` is a key on the SAVED SETTLEMENT, so the tick's subject
 * was always N registries and never one.
 *
 * ⛔ THE KEY IS THE KERNEL'S OWN `saveId`, IMPORTED RATHER THAN RE-SPELLED, so the word this
 * bag is filed under is the word the hook looks it up by — one spelling, never a second,
 * which is the same law E1-8 holds the hook's own import list to. It joins the dynamic
 * block below rather than this file's static imports for the reason the other two are
 * there: a campaign with no pending decree must reach no import at all.
 *
 * ⛔ AND A MEMBER THIS BAG DOES NOT NAME RESOLVES NOTHING — it is not a member with an empty
 * vocabulary. That distinction is design §9's tie-break made structural: a caller that
 * composed for a different realm (or for none) would otherwise have every pool-typed word
 * in the unnamed town read as stale, which is a FALSE warning on an order nobody judged.
 * A member NAMED with no words is the other fact, and its orders are resolved and withdrawn.
 *
 * PURE apart from the three dynamic imports: it reads no clock, takes no draw and writes
 * nothing.
 *
 * @param {unknown} saves the advance's own plain member clones
 * @returns {Promise<{ opTypes: Record<string, unknown>,
 *   poolsBySave: Record<string, Record<string, readonly string[]>> }|null>}
 *   null when nothing is pending anywhere — the kernel then resolves nothing, as before.
 */
export async function decreeCataloguesForSaves(saves) {
  const rows = Array.isArray(saves) ? saves : [];
  const pending = rows.filter((row) => Array.isArray(row?.settlement?.decrees)
    && row.settlement.decrees.some((/** @type {any} */ entry) => entry?.status === 'pending'));
  if (pending.length === 0) return null;
  const [operations, pools, helpers] = await Promise.all([
    import('../domain/edit/operations.js'),
    import('../domain/edit/pools.js'),
    import('../domain/worldPulse/pulseHelpers.js'),
  ]);
  const opTypes = operations.OP_TYPES;
  /** @type {Record<string, Record<string, readonly string[]>>} */
  const poolsBySave = {};
  for (const row of pending) {
    /** @type {Record<string, readonly string[]>} */
    const live = {};
    for (const entry of row.settlement.decrees) {
      if (entry?.status !== 'pending') continue;
      const decl = /** @type {any} */ (opTypes)[entry?.op?.type];
      const specs = decl && typeof decl === 'object' ? decl.payload : null;
      if (!specs || typeof specs !== 'object') continue;
      for (const spec of Object.values(specs)) {
        const poolId = spec && typeof spec === 'object' && /** @type {any} */ (spec).kind === 'pool'
          ? /** @type {any} */ (spec).pool
          : null;
        if (typeof poolId !== 'string' || poolId === '') continue;
        // Two pending entries in ONE town may name the same pool; the town's own reading of
        // it is one fact, so the second read is skipped rather than folded.
        if (!Object.hasOwn(live, poolId)) live[poolId] = pools.poolValues(poolId, row.settlement);
      }
    }
    poolsBySave[helpers.saveId(row)] = Object.freeze(live);
  }
  return { opTypes, poolsBySave: Object.freeze(poolsBySave) };
}

/** One frozen empty list, so an advance with no applied decree allocates nothing. */
const NO_CHRONICLE_ENTRIES = /** @type {readonly Record<string, unknown>[]} */ (Object.freeze([]));

/**
 * ⭐ U76 — THE APPLIED DECREE'S CHRONICLE LINE, COMPOSED FOR THE CAMPAIGN'S ONE CHRONICLE
 * (EM-C1b unit 2; the verifier's FIX-7; design §2.6, §11; ARCH §1).
 *
 * "The pulse must treat decrees as first-class causes or the chronicle lies" (design §9).
 * EM-E1's hook applied them and EM-E2 wrote the voice, and nothing joined the two: an
 * applied decree landed a RECEIPT and an advance-report row and left the realm's actual
 * scrollback silent about the one act the DM ordered by hand.
 *
 * ⛔ WHY THE COMPOSITION IS HERE AND THE REFERENCE IS IN THE HOOK. They are two writes at
 * two instants and neither may move. The `chronicleRef` can ONLY be written at the instant
 * of application (`amendPending` amends a pending row and nothing else), so the hook writes
 * it — see `decreeHook.js`'s `CHRONICLE_REF_PREFIX`. The LINE needs EM-E2's prose leaf and
 * the campaign, and the hook may reach neither: case E1-8 pins its import list at EXACTLY
 * TWO, and the prose leaf has no `src/` importer on purpose. So the advance — which already
 * holds the campaign, the result and the bound writer — composes, and the two halves are
 * joined by ONE ADDRESS that case C1b-1 holds equal to the producer's own minting.
 *
 * ⛔ NO SECOND WRITER AND NO NEW PERSISTED KEY. The entries below are exactly the four keys
 * `appendCampaignChronicle` already persists (`id`, `tick`, `prose`, `createdAt`) and go
 * through that one action. The prose leaf's return also carries `decreeId`, `cause` and
 * `followsFrom`; they are deliberately NOT carried across, because a chronicle entry that
 * grew a field would be a persisted-shape change and that is the owner's (U93). The CAUSE
 * is not lost by dropping the key — it is the receipt's own hand word, handed to the
 * producer below so the sentence it draws is the table's.
 *
 * ⛔ THE EDGE IS DYNAMIC and the early return is BEFORE it, so an advance with no applied
 * decree — every world today — reaches no import, composes nothing and appends nothing.
 *
 * ⛔ THE TICK IS RECOVERED WITH THE PRODUCER'S OWN VERB. An entry applied at tick 3 of a
 * fifty-two week advance must be filed at tick 3, not at the interval's landing tick, or
 * the scrollback puts the DM's act in the wrong year. `markApplied` wrote `pulseIdFor`'s
 * output onto the entry, so the ticks of this advance are run back through `pulseIdFor`
 * and matched — never by parsing the id, which would be a second spelling of its grammar.
 *
 * PURE apart from the one dynamic import: no clock, no draw, no write.
 *
 * @param {unknown} result the composed pulse result this advance is committing
 * @param {unknown} campaignId @param {unknown} preTick the world tick before the advance
 * @returns {Promise<readonly Record<string, unknown>[]>} the entries to append, in the
 *   order the tick applied them; the shared empty list when the tick applied none.
 */
export async function decreeChronicleEntriesForResult(result, campaignId, preTick) {
  const bag = result && typeof result === 'object' ? /** @type {any} */ (result) : {};
  const history = Array.isArray(bag.worldState?.pulseHistory) ? bag.worldState.pulseHistory : [];
  // The tick's own receipt, which the interval collapse deliberately carries across every
  // tick of the advance (deduped by the (saveId, decreeId) pair) precisely so the DM's act
  // cannot be applied and erased from the record in one advance.
  const causes = Array.isArray(history[history.length - 1]?.decreeCauses)
    ? history[history.length - 1].decreeCauses
    : [];
  if (causes.length === 0) return NO_CHRONICLE_ENTRIES;
  const updates = Array.isArray(bag.settlementUpdates) ? bag.settlementUpdates : [];
  const bySave = new Map(updates.map((/** @type {any} */ row) => [String(row?.saveId), row]));
  const endTick = Number.isFinite(bag.tick) ? Number(bag.tick) : null;
  const startTick = Number.isFinite(preTick) ? Number(preTick) : endTick;
  /** @type {Map<string, number>} */
  const tickByRef = new Map();
  if (endTick !== null && startTick !== null) {
    for (let t = startTick; t <= endTick; t += 1) tickByRef.set(pulseIdFor(campaignId, t), t);
  }
  const { decreeChronicleLine } = await import('../domain/display/stateProse/decreeProse.js');
  /** @type {Record<string, unknown>[]} */
  const entries = [];
  for (const cause of causes) {
    const update = bySave.get(String(/** @type {any} */ (cause)?.saveId));
    const registry = Array.isArray(update?.settlement?.decrees) ? update.settlement.decrees : [];
    const entry = registry.find((/** @type {any} */ row) => row?.id === /** @type {any} */ (cause)?.decreeId);
    if (!entry) continue;
    const tick = tickByRef.get(String(entry.tickRef));
    const line = /** @type {any} */ (decreeChronicleLine(entry, update?.settlement, {
      registry,
      cause: /** @type {any} */ (cause)?.cause,
      ...(tick === undefined ? {} : { tick }),
    }));
    // The leaf returns null for a row it cannot say anything true about, and design §11's
    // own rule is that half a sentence about a decree is worse than none: a silent entry
    // is skipped rather than filed with an empty line.
    if (!line || typeof line.prose !== 'string' || line.prose === '') continue;
    entries.push({ id: line.id, tick: line.tick, prose: line.prose, createdAt: line.createdAt });
  }
  return entries.length === 0 ? NO_CHRONICLE_ENTRIES : entries;
}

const AUTH_SESSION_CHANGED_RESULT = Object.freeze({ ok: false, reason: 'auth_session_changed' });

function sessionCurrent(isSessionCurrent) {
  return typeof isSessionCurrent !== 'function' || isSessionCurrent();
}

function ensureCampaignContentCutoff(get, campaignId) {
  const state = get();
  const campaign = findActiveCampaign(state.campaigns, campaignId);
  if (!campaign || campaign.contentBinding) return true;
  const signedOwner = state.auth?.user?.id;
  // The production store owns an explicit hydration flag. Small headless stores
  // may compose only the campaign slices; in that shape no account library can
  // arrive later, so `{}` is already the complete legacy cutoff rather than an
  // unresolved cloud state.
  const hasContentHydrationBoundary = Object.hasOwn(
    state,
    'customContentEnvironmentHydrated',
  );
  if (
    signedOwner
    && hasContentHydrationBoundary
    && (
      state.customContentSyncedAt == null
      || state.customContentEnvironmentHydrated !== true
    )
  ) {
    return false;
  }
  state.pinLegacyCampaignContentBindings?.(state.customContent || {});
  return Boolean(
    findActiveCampaign(get().campaigns, campaignId)?.contentBinding,
  );
}

/**
 * Build the pausedAdvance resume cursor from a paused interval result. Shared by
 * the advance path (Phase-2 first pause) and the resume path (a re-pause) so both
 * park an identically-shaped cursor. The PRE-tick fields are already plain deep
 * clones (threaded off the sim inputs through the kernel), so they are parked by
 * reference — a second clone would only re-copy the whole pre-tick world for no gain.
 * THE CURSOR SHAPE (persisted inside campaign.worldState.pausedAdvance, so every
 * field here rides the campaign record into localStorage + the cloud snapshot):
 *   interval, ticksTotal, ticksDone, atTick, resumeTick, autoResolve, startedAt,
 *   now, preIntervalHistoryLen, pendingMajors — the resume orchestrator's inputs.
 *   preSnapshot { worldState, regionalGraph, wizardNews, saves } — the PRE-TICK
 *     clones the PAUSED TICK re-derives from. These describe a mid-interval
 *     position, NOT a committed world: restoring them would mint a state the
 *     campaign was never in, so they are resume fuel only, never undo fuel.
 *   preIntervalUndo — OPTIONAL. The PRE-INTERVAL pulse-undo snapshot
 *     (capturePulseSnapshot output: campaign world + every member save + the
 *     live active view) that the advance also pushed onto the session
 *     pulseUndoStack. Parked here so a RELOAD into a paused interval can still
 *     arm Undo: the session stack is gone after a reload while this cursor
 *     rehydrates with the campaign. ADDITIVE + ABSENT-TOLERANT — a cursor
 *     written by an older build simply omits the key, and every reader treats
 *     its absence as "no parked undo", i.e. exactly the pre-change behaviour.
 *     No migration: the key materializes on the next pause and disappears with
 *     the cursor when the interval finishes or is undone.
 *   advanceEpoch — OPTIONAL, and MATERIALIZATION M2 of the advance-epoch program
 *     (docs/DESIGN_FP_ARCH_EP.md §1.3). The advance's own epoch, parked so a resume
 *     re-derives the paused tick from the SAME stream the pause committed from: the
 *     cursor is PERSISTED, so a paused interval resumed after a reload without its
 *     epoch would finish as a different world than the half already committed — a
 *     silent mid-interval divergence, not a crash. Conditionally materialized on the
 *     FLAG-GATED term and NEVER on the raw value: the caller hands `epochTerm`, which
 *     is null whenever `advanceEpochEnabled` is not exactly true, so a flag-dark or
 *     legacy world serializes no new key here. ADDITIVE + ABSENT-TOLERANT exactly like
 *     preIntervalUndo — a cursor written by an older build omits it and resumes
 *     epoch-absent, which is the pre-change behaviour.
 *
 * @param {any} result - a { status:'paused', … } interval result.
 * @param {string} now - the ORIGINAL advance wall-clock, re-threaded so a resume
 *   replays from the same clock the pause was computed from.
 * @param {any} [preIntervalUndo] - the pre-INTERVAL undo snapshot to park (see
 *   above). The advance path passes its own Phase-1 capture; the resume path
 *   passes the OUTGOING cursor's value VERBATIM, so a re-pause keeps pointing at
 *   where the interval BEGAN rather than at the segment just resumed — undo must
 *   return the DM to the pre-advance world, never to a mid-interval one.
 * @param {string|null} [epochTerm] - the FLAG-GATED advance epoch to park (see above).
 */
export function buildPausedAdvanceCursor(result, now, preIntervalUndo = null, epochTerm = null) {
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
    // Parked by REFERENCE (the snapshot is already a plain deep clone, and the
    // resume path hands back a plain lift), keeping the cursor bounded at one
    // pre-interval copy no matter how many times the interval re-pauses.
    ...(preIntervalUndo ? { preIntervalUndo } : {}),
    // MATERIALIZATION M2 — keyed on the FLAG-GATED term, exactly as M1 is keyed on the
    // kernel's. Keying it on the raw value would leave every stream assertion green while
    // parking a live epoch in a flag-dark world's PERSISTED cursor.
    ...(epochTerm ? { advanceEpoch: epochTerm } : {}),
  };
}

/**
 * Attach the exact inverse of deterministic member births to a pre-advance
 * snapshot.  The snapshot remains absent-shape-compatible when no birth fired.
 * @param {any} snapshot
 * @param {any[]} births
 */
function withUndoMemberBirths(snapshot, births) {
  if (!snapshot || !Array.isArray(births) || births.length === 0) return snapshot;
  const byId = new Map(
    (Array.isArray(snapshot.memberBirths) ? snapshot.memberBirths : [])
      .map(row => [String(row.saveId), row]),
  );
  for (const birth of births) {
    const saveId = String(birth?.saveId || '');
    const birthId = String(birth?.birthId || '');
    if (saveId && birthId) byId.set(saveId, { saveId, birthId });
  }
  return { ...snapshot, memberBirths: [...byId.values()] };
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

/** One shared frozen empty list, so a campaign that carries no registry names nobody alike. */
const NO_ROSTER_SAVES = /** @type {readonly string[]} */ (Object.freeze([]));

/**
 * ⭐ EM-E8b B (U49) — THE MEMBER SAVES THE TICK'S ROSTER HALF IS OWED, IN THE CAMPAIGN'S OWN
 * MEMBER ORDER: the SAME saves `applyDecreesToSaves` just walked.
 *
 * MEASURED at EM-E8's tip: a two-save campaign whose NON-ACTIVE member carried a due
 * add-decree in ITS registry came out of the tick with that registry `applied` and its roster
 * holding NOBODY. The kernel's hook is N registries wide (design §2.5: `decrees` is a key on
 * the SAVED SETTLEMENT, so a campaign's tick is N registries, not one) and the store's binder
 * was one save wide. This reader is what makes the two the same width.
 *
 * ⛔ THE OPEN SAVE IS READ THROUGH THE LIVE VIEW. The hydrated record is the authority for the
 * save the DM has in front of them — its library row can legitimately lag a staged decree —
 * so a reader that took the row for it would miss exactly the registry the DM just wrote.
 *
 * ⛔ IT IS APPENDED WHEN IT IS NOT A MEMBER of this campaign, so the reach EM-E8 shipped (the
 * active save, whatever its membership) is never narrowed by this widening.
 *
 * ⛔ IT ASKS FOR THE KEY'S PRESENCE AND NEVER READS ITS VALUE, and that is MEASURED rather
 * than stylistic. `decrees` is one of the record register's NOT_YET_WRITTEN keys — nothing in
 * generation writes it — so a guarded value read of it here mints an observed-shape
 * reader-with-no-writer row, and this file holds NO frozen row, which makes every new identity
 * a ceiling-0 violation. Measured: the value spelling reported
 * "src/store/campaignAdvanceSession.js: NEW decrees on settlement — 2 read(s) … (ceiling 0)".
 * `Object.hasOwn` asks the dormancy question exactly — does this save carry a registry at all
 * — without asking the record for the key's value.
 *
 * ⛔ DORMANT BY REFERENCE: a campaign whose members carry no `decrees` key — every world today
 * — returns ONE shared frozen list and allocates nothing of its own.
 *
 * @param {any} state @param {string} campaignId
 * @returns {readonly string[]} member ids, in campaign order, each carrying a registry key
 */
export function rosterTickSaveIds(state, campaignId) {
  const activeSaveId = String(state?.activeSaveId ?? '');
  const carriesRegistry = (/** @type {any} */ record) =>
    record !== null && typeof record === 'object' && Object.hasOwn(record, 'decrees');
  /** @type {string[]|null} */
  let ids = null;
  for (const save of campaignSettlements(state, campaignId)) {
    const id = String(save?.id ?? '');
    if (!id) continue;
    if (carriesRegistry(id === activeSaveId ? state?.settlement : save?.settlement)) {
      (ids ||= []).push(id);
    }
  }
  if (activeSaveId && carriesRegistry(state?.settlement) && !(ids || []).includes(activeSaveId)) {
    (ids ||= []).push(activeSaveId);
  }
  return ids === null ? NO_ROSTER_SAVES : ids;
}

/**
 * ⭐ EM-E8b A (U48) — THE TICK'S MINTED ROSTER STATE, FOLDED INTO THE OUTBOX PAYLOAD THE
 * ADVANCE ALREADY CARRIES. ONE PERSISTENCE PATH AND NO SECOND WRITER OF A SAVE ROW.
 *
 * MEASURED at EM-E8's tip, over the real advance in local mode: the tick minted the newcomer
 * onto the active view and the DURABLE save came back with the decree `applied` and nobody on
 * the roster. The roster half ran AFTER `flushWorldPulsePersist`, so the outbox had already
 * carried the pre-mint record. The cure is not a second write — it is this fold plus the call
 * site's move to BEFORE that one flush, so the minted record rides the SAME
 * `persistSaveUpdates` the pulse's own `settlementUpdates` ride.
 *
 * ⛔ IT REPLACES, IT NEVER APPENDS A SECOND OP FOR ONE SAVE. `applyWorldPulseResultToState`
 * already put an entry on this list for every member the pulse updated; a second entry for the
 * same save would be two ops racing for one row. A save with no entry (a member the pulse left
 * alone) gets ONE, because a mint that reached no op would not persist at all.
 *
 * ⛔ A BIRTH ENVELOPE KEEPS ITS SHAPE. `createSave` is the WR-3 upsert of a first-class birth;
 * re-reading the whole row is how its minted roster reaches the same envelope without turning
 * an upsert into a partial update.
 *
 * ⛔ BY REFERENCE WHEN NOTHING MINTED, so a dormant advance's payload is the identical array
 * and two dormant advances compare alike.
 *
 * @param {any} state the store AFTER the tick's roster writes (the rows are the source)
 * @param {any[]} persistUpdates the advance's own outbox payload
 * @param {any} receipts one receipt from the tick's roster half in `editSlice.js` (its
 *   `{ok, saveId, minted}` shape), or a list of them. The symbol is deliberately NOT named
 *   here: `tests/store/rosterOpsAtTick.test.js` case C4 pins this file's reaches at EXACTLY
 *   ONE, and that walker reads the raw source, so even a doc mention would convict it.
 * @returns {any[]} the payload, minted state folded in
 */
export function withMintedRosterState(state, persistUpdates, receipts) {
  const rows = Array.isArray(receipts) ? receipts : [receipts];
  const minting = rows.filter(
    (receipt) => receipt && receipt.ok === true
      && Array.isArray(receipt.minted) && receipt.minted.length > 0,
  );
  if (minting.length === 0) return persistUpdates;
  const updates = Array.isArray(persistUpdates) ? [...persistUpdates] : [];
  for (const receipt of minting) {
    const saveId = String(receipt.saveId ?? '');
    const row = (state?.savedSettlements || []).find(
      (/** @type {any} */ save) => String(save?.id ?? '') === saveId,
    );
    if (!saveId || !row || !row.settlement) continue;
    const idx = updates.findIndex(
      (/** @type {any} */ update) => String(update?.saveId ?? '') === saveId,
    );
    if (idx === -1) {
      updates.push({
        saveId,
        settlement: cloneJson(row.settlement),
        campaignState: cloneJson(row.campaignState),
      });
    } else if (updates[idx].createSave) {
      updates[idx] = { ...updates[idx], createSave: cloneJson(row) };
    } else {
      updates[idx] = { ...updates[idx], settlement: cloneJson(row.settlement) };
    }
  }
  return updates;
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
 *   options?: { now?: string, autoResolve?: boolean, weeks?: number, epoch?: string },
 *   sessionFence?: any, isSessionCurrent?: Function,
 *   deps: { advanceCampaignWorld: Function, simulateCampaignWorldInterval: Function,
 *           runAdvanceInterval: Function } }} args
 */
export async function runAdvanceCampaignWorld({
  set, get, campaignId, interval = 'one_month', options = {}, sessionFence,
  isSessionCurrent, deps,
}) {
    if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
    if (!ensureCampaignContentCutoff(get, campaignId)) {
      return { ok: false, reason: 'content_binding_pending' };
    }
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
    // FULL AUTO-RESOLVE (realm directive 7 / J-D7): the DM's toggle says the realm
    // rules on its own, so the majors this advance parks in the PROPOSAL DOCKET are
    // ruled immediately — through the same accept path a hand-Apply uses — instead
    // of piling up unread. Engagement is deliberately narrower than `autoResolve`:
    // it requires the USER TOGGLE, i.e. NO caller passed an explicit option. The one
    // internal caller that does (runCatchUpCampaignWorld, which derives autoResolve
    // from world progression) therefore keeps its existing semantics BYTE-IDENTICALLY
    // — an autonomous world's open-hook catch-up is not a decision the DM pressed, and
    // silently changing what it does to existing seeds is exactly the unversioned
    // semantics shift THE PROMISE forbids. Extending full-auto to catch-ups is a
    // deliberate DEFERRAL, recorded here, not an oversight.
    // Derived from the ALREADY-RESOLVED `autoResolve` above rather than re-reading the
    // shared toggle: the single-chokepoint law (tests/lint/autoresolveTwoMount.walker)
    // allows exactly ONE store read of it in this module, and that walker scans the raw
    // source, so even a comment quoting the accessor would trip it.
    const fullAutoResolve = options.autoResolve == null && autoResolve;
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
    // THE ADVANCE-EPOCH MINT (owner directive 2026-08-05, chair-signed). One nonce per
    // USER ADVANCE, minted at the store layer beside `now` and for the same reasons: this
    // is the only lint-legal home (eslint bans Math.random/Date.now across src/domain,
    // src/kernel except prng.js, src/workers and src/generators), and it sits AFTER the
    // synchronous refusal guards, so a refused or no-op advance burns no epoch.
    //
    // THE GATE READ IS BY NAME AND STRICT, and that spelling is load-bearing rather than
    // stylistic: engineGatedRuleKeys' census anchors on a `rules`/`simulationRules`
    // receiver with `=== true`, so a read spelled `cfg.advanceEpochEnabled === true` would
    // be invisible to it and would make the manifest lie about its own engine.
    //
    // THE VALUE IS ARGS-BORNE, NEVER AMBIENT. R-18 paranoia mode re-runs the interval over
    // `cloneJson(multiTickArgs)` and diffs; an epoch read from a module singleton would
    // diff clean here and red there, on every advance.
    const simulationRules = findActiveCampaign(get().campaigns, campaignId)?.worldState?.simulationRules || null;
    const epochLit = simulationRules?.advanceEpochEnabled === true;
    const advanceEpoch = epochLit ? (options.epoch || generateSeed()) : null;

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

    // U72 (design §20.3) — THE LIVE CATALOGUES, COMPOSED ONCE PER USER ADVANCE AND BEFORE
    // THE COMPUTE. It is read off the same plain member clones the pulse is about to run
    // over, so the vocabulary the hook judges by is the vocabulary of the world the tick
    // enters. Null — and a single flag read's worth of work — for a campaign with no
    // pending decree, which is every world today.
    const decreeCatalogues = await decreeCataloguesForSaves(simSaves);
    if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;

    // Pure, heavy compute OUTSIDE the producer. The multi-tick path is awaited: the
    // orchestrator yields to the event loop between tick batches so a long advance
    // (up to 48 one-week kernel passes) does not freeze the UI. The compute is a pure
    // function over the plain clones lifted above, so the yield only changes WHEN the
    // commit lands, not WHAT it commits.
    if (simCampaign) {
      const contentRuntime = contentRuntimeFromCampaignBinding(
        simCampaign.contentBinding,
      );
      const pinnedCustomContent = contentRuntime.customContent;
      const multiTickArgs = {
        campaign: simCampaign,
        saves: simSaves,
        interval,
        commit: true,
        now,
        autoResolve,
        customContent: pinnedCustomContent,
        // M10b catch-up: an explicit whole-week span drives the orchestrator's tick
        // count (overriding the interval→week table); inert for a normal DM advance
        // (no weeks ⇒ the named-interval table). Threads through runAdvanceInterval's
        // payload spread into the worker AND the in-thread fallback alike.
        ...(catchUpWeeks != null ? { weeks: catchUpWeeks } : {}),
        advanceEpoch,
        // U72: §20.3's live catalogues for the head of every tick of this advance, composed
        // ONCE here (see `decreeCataloguesForSaves`) and null for a world with no pending
        // decree — which keeps the flag-OFF and flag-ON paths alike byte-identical there.
        decreeCatalogues,
      };
      result = useMultiTick
        // The worker runs the SAME simulate function off the main thread; the
        // fallback is the in-thread call (used in Node/tests/SSR, when the worker flag
        // is off, or when worker construction fails). customContent is snapshotted so
        // the worker's chain-activation seam matches the page.
        ? await (flag('simAdvanceWorker')
            ? runAdvanceInterval(multiTickArgs, {
                fallback: simulateCampaignWorldInterval,
                customContent: pinnedCustomContent,
              })
            : simulateCampaignWorldInterval(multiTickArgs))
        : advanceCampaignWorld({
            campaign: simCampaign,
            saves: simSaves,
            interval,
            now,
            customContent: pinnedCustomContent,
            advanceEpoch,
            decreeCatalogues,
          });
      if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;

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
        if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
      }
    }

    if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;

    // §10 (W-COMPOSER-2): the queue-mouth refusals ride the advance digest —
    // append them to the result's feed through the house appender (dedupe/cap).
    // `{ now }` IS LOAD-BEARING, not tidiness: the appender's stamp chain is
    // `entry.createdAt || options.now || wallClockNow()`, so omitting the options object
    // gave every refusal entry a LIVE wall-clock createdAt while the rest of this advance
    // carried the pinned `now` minted at the top of this function. Same seed, same advance,
    // different bytes — and the sibling appender (reconcileWizardNewsForCommit) already
    // threads it. The refusals belong to THIS tick's digest, so they take THIS tick's instant.
    if (simCampaign && result && drainRefusalNews.length && result.wizardNews) {
      result.wizardNews = appendWizardNewsEntries(result.wizardNews, drainRefusalNews, { now });
    }

    // FULL AUTO-RESOLVE ruling pass (realm directive 7 / J-D7). Runs on the composed
    // result BEFORE the Phase-2 commit, so the advance and every verdict it triggered
    // land in ONE atomic commit, ONE persist, and ONE undo step — a DM who undoes the
    // advance undoes its rulings with it. Pure + deterministic: the advance's pinned
    // `now`, the STORED outcome replayed through applyWorldPulseProposal, no fresh RNG.
    // Returns the input result BY REFERENCE when the advance minted no proposals, so a
    // toggle-OFF advance (the default) is byte-identical to before this existed.
    // Placed AFTER the §10 refusal append (those belong to the tick's own digest) and
    // BEFORE the deposit-and-consume reconcile below, so a wizardNews entry that landed
    // during the in-flight yield still survives the wholesale commit.
    if (simCampaign && result && fullAutoResolve) {
      result = autoAdjudicateAdvanceProposals({
        campaign: simCampaign,
        saves: simSaves,
        result,
        now,
      });
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

    preSnapshot = withUndoMemberBirths(preSnapshot, result?.memberBirths || []);

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
          // R-1 MUST-FIX (ring-guard saturation): every snapshot push raises the
          // campaign's LOGICAL advance depth (`advanceSeqByCampaign`, session-only;
          // undoLastPulse decrements as it pops). The cap-eviction above never
          // touches it — counting RETAINED entries saturated at PULSE_UNDO_CAP and
          // let the proposal-ring coherence guard pass STALE pre-apply snapshots
          // after the cap-th advance (see advanceDepthOf, campaignWorldPulseDeferred).
          if (!state.advanceSeqByCampaign) state.advanceSeqByCampaign = {};
          state.advanceSeqByCampaign[String(campaignId)] =
            (Number(state.advanceSeqByCampaign[String(campaignId)]) || 0) + 1;
        }
        persistUpdates = applyWorldPulseResultToState(state, c, result, now, authoredEventBySave);
        // Advance-scaling Stage 3 PAUSE: a paused interval committed its minors
        // (applyWorldPulseResultToState wrote the minors-only pause-tick worldState).
        // Park the resume cursor on c.worldState.pausedAdvance so the partial interval
        // + the cursor land in the SAME atomic persist. Only the multi-tick path
        // produces status:'paused', so this is inert when the flag is OFF.
        // R-5b reload-into-paused arming: the SAME pre-interval snapshot just pushed
        // onto the session pulseUndoStack is parked on the cursor (by reference — one
        // object, two homes, neither mutated after capture), so a reload that clears
        // the session stack can still offer the honest pre-advance undo. `preSnapshot`
        // was captured in Phase 1, BEFORE the drain, and the advance refuses to start
        // while a pause is parked, so its worldState provably carries no pausedAdvance
        // — restoring it is also what CLEARS the pause (the documented abandon path).
        // ⭐ M2 rides this park (EP-2). `advanceEpoch` is ALREADY the flag-gated term on
        // THIS path — the mint above is `epochLit ? … : null`, so it is null in every dark
        // configuration by construction and no second gate is owed here. The resume path
        // is where the two names come apart, because there the value arrives off the
        // persisted cursor and the flag must gate the PARK as well as the MINT.
        if (result.status === 'paused') {
          c.worldState = {
            ...c.worldState,
            pausedAdvance: buildPausedAdvanceCursor(result, now, preSnapshot, advanceEpoch),
          };
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

    // ⭐ EM-E8 — THE ROSTER OPS' TICK HALF (design §2.6's head of the tick, §14's regeneration
    // from the layer). EM-E1's hook marked every due decree APPLIED inside the pulse and left
    // "the world effect of each op" to the members that bind the verbs; the roster family's
    // binder is the store's, because only the store may reach the DM layer's writer and
    // EM-B2a4's re-derivation seam. It mints every applied add-decree the layer does not
    // already hold and re-derives ONCE.
    //
    // ⭐ EM-E8b A (U48) — AND IT RUNS **BEFORE** THE ONE FLUSH BELOW, WHICH IS THE WHOLE CURE.
    // At EM-E8's tip this block sat after `flushWorldPulsePersist`, so the outbox had already
    // carried the PRE-MINT record and the durable save came back with an `applied` decree and
    // nobody on the roster — the record claiming an order carried out over a world that held no
    // such person. Moved here, the minted rows ride the SAME `persistSaveUpdates` the pulse's
    // own `settlementUpdates` ride (`withMintedRosterState` folds them into that payload), so
    // the tick is ONE durable op per save and the members-before-snapshot barrier still holds.
    // The two replays below are unaffected: neither reads the roster, and both persist their
    // own writes through their own actions exactly as before.
    //
    // ⛔ DORMANT BY REFERENCE, AND THE GUARD IS WHAT MAKES IT FREE. A save that carries no
    // `decrees` key — every world today — reaches no import, runs nothing and allocates
    // nothing, so this line composes exactly what it composed before EM-E8.
    //
    // ⛔ THE EDGE IS DYNAMIC, which is the estate's own store idiom and what keeps the edit
    // leaf out of every eager closure (`EAGER_FIRST_PAINT_MODULES` walks STATIC edges only).
    // Best-effort and session-fenced, exactly as the two replays are: the roster half never
    // blocks the advance, and the pre-pulse snapshot already covers it for undo.
    const liveDecrees = get().settlement?.decrees;
    const rosterSaveIds = result && result.ok !== false
      ? rosterTickSaveIds(get(), campaignId)
      : NO_ROSTER_SAVES;
    if (result && result.ok !== false
        && ((Array.isArray(liveDecrees) && liveDecrees.length > 0) || rosterSaveIds.length > 0)) {
      if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
      try {
        const editSlice = await import('./editSlice.js');
        if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
        /** @type {any[]} */
        const receipts = [];
        // EM-E8b B (U49): ONE pass over the member saves the tick's hook just walked, in the
        // campaign's own order, so two ticks over one campaign mint in one order. Each save's
        // own run is idempotent on ITS layer, so a member that already holds its newcomer
        // mints nobody and reaches the re-derivation lane not at all.
        for (const rosterSaveId of rosterSaveIds) {
          if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
          receipts.push(
            await editSlice.applyRosterDecreesAtTick(get, set, { saveId: rosterSaveId }),
          );
        }
        persistUpdates = withMintedRosterState(get(), persistUpdates, receipts);
      } catch { /* best-effort */ }
      if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
    }
    // ⭐ U76 — AND THEN THE RECORD OF IT (EM-C1b unit 2; design §2.6, §9, §11). The order
    // is the act's own: the hook applied the decree, the roster half above carried out its
    // world effect, and this files the line the realm reads. It runs BEFORE the one flush
    // below for the reason EM-E8b A moved the roster half there — so the tick's writes are
    // one durable moment — though `appendCampaignChronicle` also persists on its own, which
    // is what makes it the single writer of `chronicles[]` rather than a helper.
    //
    // ⛔ THE WRITER IS THE CAMPAIGN SLICE'S OWN BOUND ACTION, reached off `get()` exactly as
    // the two replays below reach theirs, so THERE IS NO NEW IMPORT EDGE from the domain
    // hook into the store and no second writer of the chronicle. Best-effort and
    // session-fenced like its neighbours: the record half never blocks the advance.
    if (result && result.ok !== false) {
      const chronicleEntries = await decreeChronicleEntriesForResult(result, campaignId, preTick);
      if (chronicleEntries.length > 0 && typeof get().appendCampaignChronicle === 'function') {
        for (const chronicleEntry of chronicleEntries) {
          if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
          try { get().appendCampaignChronicle(campaignId, chronicleEntry); } catch { /* best-effort */ }
        }
      }
    }
    if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
    await flushWorldPulsePersist({
      result,
      campaignPersist,
      persistUpdates,
      campaignId,
      isSessionCurrent,
    });
    if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
    // Replay party-caused queued events through the party-impact pipeline — the
    // drain surfaced them; this mirrors the immediate path's rippleEventThroughWorld
    // party branch (faction/NPC world state, condition resolution, Wizard News).
    // Best-effort: the world half never blocks the advance, and the pre-pulse
    // snapshot already covers these for undo (they land after the snapshot).
    if (result && result.ok !== false && drainedPartyImpacts.length
        && typeof get().recordPartyImpact === 'function') {
      for (const pi of drainedPartyImpacts) {
        if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
        try {
          await get().recordPartyImpact(campaignId, pi.action, { sessionFence });
        } catch { /* best-effort */ }
        if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
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
        if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
        try {
          await get().recordCanonRelationshipRipple(campaignId, {
            ...cr,
            now,
            sessionFence,
          });
        } catch { /* best-effort */ }
        if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
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
 *   decisions?: Record<string, {decision?: string}>, options?: { now?: string, epoch?: string },
 *   sessionFence?: any, isSessionCurrent?: Function,
 *   deps: { simulateCampaignWorldInterval: Function, runAdvanceInterval: Function } }} args
 */
export async function runResolveIntervalMajors({
  set, get, campaignId, decisions = {}, options = {}, isSessionCurrent, deps,
}) {
  if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
  if (!ensureCampaignContentCutoff(get, campaignId)) {
    return { ok: false, reason: 'content_binding_pending' };
  }
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
  // R-5b: the parked pre-INTERVAL undo snapshot, read off the CURRENT (non-draft)
  // state so it can be re-parked BY REFERENCE below. Deliberately NOT part of the
  // `cursor` clone: it is the largest thing on the cursor and the resume kernel
  // never reads it, so deep-copying it on every resume would charge a full extra
  // pre-interval world per DM verdict for nothing. Same read window as the lift
  // below (the advance-in-flight guard serializes both against any other writer).
  let parkedUndo = parkedIntervalUndoSnapshot(
    findActiveCampaign(get().campaigns, campaignId),
  );
  set(state => {
    const c = findActiveCampaign(state.campaigns, campaignId);
    if (!c) return;
    const worldState = ensureWorldState(c.worldState, c);
    if (!worldState.pausedAdvance) { result = { ok: false, reason: 'no_paused_advance' }; return; }
    const { preIntervalUndo: _parked, ...resumeInputs } = worldState.pausedAdvance;
    cursor = cloneJson(resumeInputs);
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
  // THE ADVANCE-EPOCH RE-THREAD (EP-2, docs/DESIGN_FP_ARCH_EP.md §1.3 / §3c row 4). THE
  // CONSTRAINT, NOT THE OPPORTUNITY: a resume re-derives the paused tick and must land
  // byte-identically on the minors already committed, so it REUSES the advance's epoch and
  // never mints a fresh one. Threaded exactly like `now` above, with the identical
  // three-term fallback — an explicit option wins (tests/replay pin one), else the cursor's
  // parked value, else absent (a legacy cursor written before this program resumes
  // epoch-absent, which composes the pre-wave seed character-for-character).
  //
  // ⛔ AND THE FLAG GATES THE RE-THREAD, WHICH `now`'s twin does not need. The mint does not
  // run on this path, so without this read a LIT advance that paused, went dark, and resumed
  // would compose an epoch-bearing seed in a flag-dark world and re-park a live epoch on its
  // persisted cursor. THE READ IS BY NAME AND STRICT for the census reason the mint's is.
  // ⚠ THE RECEIVER MUST BE LITERALLY NAMED `rules` OR `simulationRules`: engineGatedRuleKeys'
  // census anchors on that receiver, so a read spelled `resumeRules.advanceEpochEnabled`
  // would be invisible to it AND would red fence 4's gate-polarity arm as a loose read.
  const simulationRules = simCampaign?.worldState?.simulationRules || null;
  const epochTerm = simulationRules?.advanceEpochEnabled === true
    ? (options.epoch || cursor.advanceEpoch || null)
    : null;
  const pre = cursor.preSnapshot || {};
  const contentRuntime = contentRuntimeFromCampaignBinding(
    simCampaign.contentBinding,
  );
  // U72 (design §20.3) — THE RESUMED SEGMENT'S CATALOGUES ARE THE PAUSED ADVANCE'S OWN.
  // THE CONSTRAINT IS THE SAME ONE THE EPOCH RE-THREAD OBEYS: a resume re-derives the
  // paused tick and must land byte-identically, so it may not take a FRESH reading of the
  // vocabulary. The fresh path composed its bag from the PRE-ADVANCE member clones, and the
  // cursor parked exactly those (`pre.saves`), so reading them back reproduces that bag
  // word for word. A legacy cursor that parked no saves falls back to the live clones —
  // still resolution, still §20.3, and the only reading available on that shape.
  const decreeCatalogues = await decreeCataloguesForSaves(pre.saves ?? simSaves);
  const resumeArgs = {
    campaign: simCampaign,
    saves: simSaves,
    commit: true,
    now,
    autoResolve: false,
    customContent: contentRuntime.customContent,
    advanceEpoch: epochTerm,
    decreeCatalogues,
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
        customContent: resumeArgs.customContent,
      })
    : simulateCampaignWorldInterval(resumeArgs));
  if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;

  parkedUndo = withUndoMemberBirths(parkedUndo, result?.memberBirths || []);

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
      // The initial paused commit already pushed the pre-interval snapshot onto
      // the session undo stack.  A later resume segment can mint additional
      // deterministic members, so refresh that existing entry with the parked
      // snapshot's accumulated birth inverses.  Without this replacement the
      // cursor knew about the later child, but completing the interval dropped
      // the cursor and Undo left that child orphaned.
      if (parkedUndo && Array.isArray(state.pulseUndoStack)) {
        for (let i = state.pulseUndoStack.length - 1; i >= 0; i -= 1) {
          if (String(state.pulseUndoStack[i]?.campaignId) !== String(campaignId)) continue;
          state.pulseUndoStack[i] = parkedUndo;
          break;
        }
      }
      // Park a FRESH cursor if the resumed segment paused again; else CLEAR the
      // cursor back to byte-neutral (the interval finished). The pre-INTERVAL undo
      // snapshot rides across verbatim (R-5b): a re-pause is still the SAME advance,
      // so undo must keep returning to where that advance began. An interval that
      // finishes drops the cursor and its parked snapshot together — the session
      // stack (when this session ran the advance) remains the undo source there.
      if (result.status === 'paused') {
        c.worldState = {
          ...c.worldState,
          // M2 again, and THIS is the park the flag gate above exists for: `epochTerm` is
          // null in a flag-dark world even when the OUTGOING cursor carried a live epoch,
          // so a lit-paused advance resumed dark re-parks nothing.
          pausedAdvance: buildPausedAdvanceCursor(result, now, parkedUndo, epochTerm),
        };
      } else if (c.worldState && 'pausedAdvance' in c.worldState) {
        const { pausedAdvance: _drop, ...rest } = c.worldState;
        c.worldState = rest;
      }
      // R-5b continuity: the interval just FINISHED, so the cursor (and the
      // pre-interval snapshot parked on it) is gone. In the session that RAN the
      // advance that snapshot is already on pulseUndoStack and nothing is owed. After
      // a RELOAD it lived ONLY on that cursor, and the DM has been looking at an
      // offered "Undo Advance" the whole time they resolved verdicts — dropping it at
      // the moment they finish would retract a capability mid-flow. Adopt it onto the
      // session stack instead, exactly as the advance's own push would have. Guarded
      // on the campaign having NO stack entry, so the in-session path never
      // double-pushes; a paused interval blocks further advances on its own campaign,
      // so this campaign's entry cannot have been cap-evicted while it was parked.
      if (result.status !== 'paused' && parkedUndo
          && !(state.pulseUndoStack || []).some(s => String(s.campaignId) === String(campaignId))) {
        state.pulseUndoStack = [...(state.pulseUndoStack || []), parkedUndo];
        if (!state.advanceSeqByCampaign) state.advanceSeqByCampaign = {};
        state.advanceSeqByCampaign[String(campaignId)] =
          (Number(state.advanceSeqByCampaign[String(campaignId)]) || 0) + 1;
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

  if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
  await flushWorldPulsePersist({
    result,
    campaignPersist,
    persistUpdates,
    campaignId,
    isSessionCurrent,
  });
  if (!sessionCurrent(isSessionCurrent)) return AUTH_SESSION_CHANGED_RESULT;
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
 *   options?: { now?: string|number }, sessionFence?: any,
 *   isSessionCurrent?: Function }} args
 * @returns {Promise<{ ok:boolean, weeksCaughtUp:number, capped:boolean, reason?:string }>}
 */
export async function runCatchUpCampaignWorld({
  set, get, campaignId, options = {}, isSessionCurrent,
}) {
  const staleResult = () => ({
    ok: false,
    weeksCaughtUp: 0,
    capped: false,
    reason: 'auth_session_changed',
  });
  if (!sessionCurrent(isSessionCurrent)) return staleResult();
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
    if (!sessionCurrent(isSessionCurrent)) return staleResult();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (c && c.worldState) c.worldState.lastLivingAdvanceAt = nowStamp;
    });
    await flushWorldPulsePersist({
      result: true,
      campaignPersist: cacheCampaignState(get()),
      persistUpdates: [],
      campaignId,
      isSessionCurrent,
    });
    if (!sessionCurrent(isSessionCurrent)) return staleResult();
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
  if (!sessionCurrent(isSessionCurrent)) return staleResult();
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
    if (!sessionCurrent(isSessionCurrent)) return staleResult();
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
  if (!sessionCurrent(isSessionCurrent)) return staleResult();
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
