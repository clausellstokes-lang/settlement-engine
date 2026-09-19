/**
 * settlementGenerateAction.js — THE GENERATION LANE, lifted out of the slice.
 *
 * The store keeps the action KEY (`generateSettlement`) on its literal and
 * delegates the body here through a dynamic import, the established idiom
 * (`recordSnapshot: (opts) => recordSnapshotAction(set, get, opts)`), so the
 * operation-registry walker still sees the action and the eager first-paint
 * closure no longer carries the lane.
 *
 * ⭐ WHAT MOVED AND WHAT DID NOT. The five phases of the old action are here
 * verbatim except for ONE seam: phase B, the work itself, now goes through
 * `runGeneration` so it can run in a Web Worker. The pre-flight gates, the
 * post-steps, the commit and the analytics are unchanged code in a new home.
 *
 * ⭐ THE CONTRACT THE CALLERS SEE IS UNCHANGED.
 * `generateSettlement(seedOverride?) -> Promise<settlement|null>` was already
 * async and every caller already awaits it. The one observable difference is
 * that resolution now takes a macrotask rather than a microtask; no caller
 * reads store state synchronously in the same tick after the call.
 *
 * ⚠ THE HISTORY LIST COMES OFF THE RESULT PACKET, NOT OFF THE RELAYED STEPS.
 * A transport failure after step 7 of 14 makes the in-thread run emit all 14
 * again. A body that pushed one row per relayed step would commit 21 rows, the
 * reveal would replay 21 steps, and store state would then differ by transport
 * OUTCOME — a fork by the law's own definition. So relayed steps only stamp
 * receipt TIMES; the authoritative list is the one the core returns.
 *
 * ⚠ DECLARED TELEMETRY SHIFT (owner row WK-8): `duration_ms` is main's
 * wall-clock around the whole await, so it now includes the transport and, on
 * the first generation of a session, the lazy fetch of the generation core.
 * Starting the clock after the core resolved would time the two paths
 * differently, which is the fork this design exists to prevent.
 */

import { generateSeed } from '../kernel/prng.js';
import { deriveSystemState } from '../domain/state/deriveSystemState.js';
import { reconcileSettlementChange } from '../domain/settlementReconciliation.js';
import { anonAtCap, incrementAnonFull, incrementAnonReroll } from '../lib/anonGenCounter.js';
import { REFUSAL_REASONS, refusalOf } from '../lib/refusalReasons.js';
import { GENERATION_INTENT_SAMPLE_FORK, intentOf } from '../lib/generationIntent.js';
import { isChunkLoadError } from '../lib/staleDeploy.js';
import { DEFAULT_CONFIG } from './configSlice.js';

/**
 * The DISPLAY label for a size token, and the ceiling label for an account tier.
 * Both frozen maps are keyed by literal unions, so a plain `string` index is a type
 * error at the call site; narrowing once here keeps the refusal sites readable and
 * keeps a raw tier token off the page when a map has no row.
 * @param {string|undefined} token
 */
const sizeLabelOf = (token) => (token
  ? (/** @type {Record<string, string>} */ (SIZE_LABEL)[token] || token) : '');
/** @param {string|undefined} tier */
const ceilingLabelOf = (tier) => (tier
  ? (/** @type {Record<string, { maxSizeLabel: string }>} */ (TIER_FACTS)[tier]?.maxSizeLabel || '') : '');
/**
 * Was the refusal the FLOOR rather than the ceiling? Asked only of a size the gate has
 * already refused. The slice owns the rank table and answers; a store that predates the
 * selector (or a hand-built one in a test) answers `false`, which is exactly the
 * behaviour this gate had before the floor had its own sentence.
 * @param {any} st the store state the gate is reading
 * @param {string|undefined} token
 */
const belowFloor = (st, token) => typeof st?.isTierBelowFloor === 'function'
  && st.isTierBelowFloor(token) === true;
/**
 * ⛔ THE RUNGS A 'random' ROLL MAY ACTUALLY HAND THIS ACCOUNT.
 *
 * The generator's ladder starts at `thorp`; an anonymous visitor's gate starts at
 * `hamlet`. So one roll in six was resolved, populated, staffed, narrated — and then
 * DISCARDED by the post-resolution re-gate below, which answered a reader who had asked
 * for nothing in particular with a refusal about a size they never picked. The roll is
 * the generator's and stays there; what crosses is the RANGE, asked of the gate itself
 * so this lane holds no second copy of the rule.
 *
 * `null` when the account reaches the whole ladder, and `null` when the range admits
 * NOTHING (a gate that refuses every size is a gate misconfiguration, not a pool): in
 * both cases the generator draws from TIER_ORDER exactly as it always has, so an
 * uncapped generation — and every golden — is byte-identical.
 *
 * @param {any} st the store state the gate is reading
 * @returns {string[]|null}
 */
const allowedTierPoolOf = (st) => {
  if (typeof st?.isTierAllowed !== 'function') return null;
  const pool = TIER_ORDER.filter((rung) => st.isTierAllowed(rung) === true);
  return pool.length > 0 && pool.length < TIER_ORDER.length ? pool : null;
};
import { SIZE_LABEL, TIER_FACTS } from '../config/tierFacts.js';
// THE LADDER the generator's 'random' rolls over, read here so the pool this lane sends
// is cut from the same array `resolveConfig` picks from rather than from a parallel list.
// No new first-paint cost: components/HomeHero.jsx already holds this leaf eagerly.
import { TIER_ORDER } from '../data/constants.js';
import { flag } from '../lib/flags.js';
import { runGeneration } from '../lib/generationClient.js';
import {
  GENERATION_PROTOCOL_VERSION,
  GENERATION_REQUEST_KIND,
} from '../lib/generationProtocol.js';
import { loadSettlementContentRuntimeOptions } from './settlementContentRuntime.js';
import {
  carryLockedSections, remapLocksAfterGenerate,
} from './settlementSliceHelpers.js';
// ⛔ THE CREATE BOUNDARY IS IMPORTED DIRECTLY, NOT THROUGH THE HELPERS LEAF, AND
// THAT EDGE IS A FIRST-PAINT MEASUREMENT. `settlementSliceHelpers.js` is EAGER;
// while it re-exported `birthConfig` the boundary module sat in src/main.jsx's
// static closure even though its only two callers — this lane and the realm
// composer — are both lazy. This lane is reached solely through
// settlementSlice.js's dynamic import, so importing the boundary here keeps it
// on the lazy side with its callers (MEASURED, lane L-MAT: closure 239 -> 238).
import { birthConfig, loadGenerationLawPayloads } from '../domain/density/densityCreateBoundary.js';
import { activateFaithIfEntitled, resetSettlementIdentity, retiringDraftOf } from './settlementLifecycleHelpers.js';

/** Request correlation. A counter, never a clock and never a random draw. */
let _requestSeq = 0;


/**
 * The in-thread half of the ONE code path. Imported lazily so the happy worker
 * path never fetches the engine chunk on the main thread at all.
 * @param {any} request
 * @param {(step: any) => void} [onStep]
 */
async function inThreadGeneration(request, onStep) {
  const core = await import('../workers/generationRequest.js');
  return core.runGenerationRequest(request, (event) => onStep?.(event.step));
}

/**
 * The generate action's body.
 *
 * @param {(fn: (draft: any) => void) => void} set
 * @param {() => any} get
 * @param {string} [seedOverride]
 * @param {{ intent?: string }} [options] who is asking (lib/generationIntent.js); only
 *   the anonymous daily cap reads it, and only to exempt a curated sample fork.
 * @returns {Promise<any>} the activated settlement, or null when a gate refused
 */
export async function generateSettlementAction(set, get, seedOverride, options) {
  // A refusal from a PREVIOUS attempt must not outlive this one: the reader clicked
  // again, and whatever they read before is now either cured or about to be re-raised.
  set(state => { state.lastRefusal = null; });
  // ⛔ SAMPLE FORKS ARE EXEMPT FROM THE ANONYMOUS DAILY CAP (owner ruling, ODQ
  // §934.24(b)) — and from nothing else. `intentOf` fails CLOSED: anything it does not
  // recognise reads as an ordinary generation, so the exemption must be asked for by
  // its exact name and an older or mistyped caller is still capped.
  const isSampleFork = intentOf(options) === GENERATION_INTENT_SAMPLE_FORK;
  const state = get();
  const {
    config: storedConfig,
    institutionToggles: storedInstitutionToggles,
    categoryToggles: storedCategoryToggles,
    goodsToggles: storedGoodsToggles,
    servicesToggles: storedServicesToggles,
  } = state;
  // ⛔ AN ANONYMOUS GENERATION IS EVERYTHING ON RANDOM (the owner, §934.34: "only hamlet,
  // village, and town can be accessed without signing in and only with everything on
  // random"). The SIZE is theirs; every other dial rolls.
  //
  // ⭐ THE FORCING IS HERE, NOT IN THE WIZARD, AND THAT IS THE WHOLE POINT. `config` is
  // PERSISTED (store/persistProjection.js), so a disabled control is a courtesy and never
  // a gate: a stored config from a session that once had an account, a hand-edited
  // localStorage blob, or the Library's "Apply Saved Configuration" can all put a
  // customized config in front of an anonymous forge. That is the 2026-09-16 production
  // bug's exact shape — a value that survived one lifecycle path and ghosted another — so
  // the rule is enforced at the ONE point every full generation funnels through, and the
  // stored config is left untouched (a reader who signs in gets their dials back).
  //
  // "Everything on random" is not invented here: DEFAULT_CONFIG already IS that shape —
  // settType random, random_trade, random_culture, random_threat, every priority at 50,
  // resources and stresses rolling, no custom name and no constraint bags. So the
  // anonymous config is the defaults with the reader's own size on top, which also means
  // this can never drift from what the wizard calls "random".
  //
  // ⛔ A CURATED SAMPLE FORK IS NOT THE READER'S CONFIGURATION, AND FORCING RANDOM ON IT
  // WOULD HAVE DESTROYED IT. `forkConfigFor(sample)` replays the PRODUCT'S own config for
  // one of the three curated worlds — the owner ruled the fork a curated seed, not a free
  // generation (§934.24(b)) — so rolling its dials would have handed an anonymous reader
  // a random town under a curated town's name. The exemption is asked for by the same
  // fail-closed intent the cap uses, so an ordinary generation cannot borrow it. (None of
  // the three samples is a thorpe — town, city, village — so §934.34's floor changes
  // nothing about them; the TIER gate still applies to a fork, which is why the city
  // sample already refuses for an anonymous reader.)
  // ⛔ AND IT FAILS CLOSED. The `typeof` guard exists because a hand-built store (a test's,
  // an older persisted shape) may not carry the selector — but its fallback was `true`,
  // which is a CAPABILITY GATE answering "yes" to a store that could not be asked. Every
  // real store carries it (store/authSlice.js), so the fallback is never taken in
  // production and closing it costs nothing there; what it buys is that the ONE point
  // §934.34 is enforced at cannot be opened by an absence. The exemption above still
  // wins, because a curated sample fork is not the reader's configuration at all.
  const canCustomize = isSampleFork || (typeof state.canCustomizePreGeneration === 'function'
    ? state.canCustomizePreGeneration() === true
    : false);
  const config = canCustomize
    ? storedConfig
    : { ...DEFAULT_CONFIG, settType: storedConfig?.settType ?? DEFAULT_CONFIG.settType };
  // The four constraint bags are the Deep-constraints grids — the same class of
  // pre-generation input as `config`, persisted beside it (store/toggleSlice.js's own
  // scope contract says so), and each one EMPTY means "force nothing, forbid nothing",
  // which is what random means for them. An anonymous forge therefore takes four empty
  // bags, not the reader's stored ones.
  const institutionToggles = canCustomize ? storedInstitutionToggles : {};
  const categoryToggles = canCustomize ? storedCategoryToggles : {};
  const goodsToggles = canCustomize ? storedGoodsToggles : {};
  const servicesToggles = canCustomize ? storedServicesToggles : {};
  // An IMPORTED NEIGHBOUR is a pre-generation input too — and it is already premium-only
  // (TIER_GATE.{tier}.neighbour is false for anon and free), so it is left exactly as it
  // was: a second gate here would be a second source for a rule that already has one.
  const neighbor = state.importedNeighbour;

  // Tier gate check
  const settType = config.settType;
  if (settType && settType !== 'random' && settType !== 'custom') {
    if (!state.isTierAllowed(settType)) {
      console.warn(`Tier "${settType}" not allowed for current user tier.`);
      // …and SAY so where the reader clicked. The sentence names the size asked for
      // and the ceiling this account reaches, both as display labels off the config
      // (never a raw tier token, never a hand-typed ceiling).
      //
      // ⛔ WHICH BOUND REFUSED DECIDES WHICH SENTENCE (§934.34). `isTierAllowed` is one
      // boolean over a RANGE, and raising the ceiling's reason for every refusal made the
      // product tell an anonymous visitor "A Thorpe is past what this account forges; it
      // reaches up to a Town" — the opposite of the truth, on the one rung the floor
      // exists for. The slice answers which bound it was; a floor refusal gets its own
      // reason and names the floor instead of a ceiling the reader never approached.
      set(s => {
        s.lastRefusal = belowFloor(state, settType)
          ? refusalOf(REFUSAL_REASONS.TIER_TOO_SMALL, {
            size: sizeLabelOf(settType),
            min: sizeLabelOf(state.minAllowedTier?.()),
          })
          : refusalOf(REFUSAL_REASONS.TIER, {
            size: sizeLabelOf(settType),
            max: ceilingLabelOf(state.auth?.tier) || sizeLabelOf(state.maxAllowedTier?.()),
          });
      });
      return null;
    }
  }

  // ⛔ ONE ROLL IN SIX WAS BEING THROWN AWAY. Measured BEFORE the engine runs, because
  // that is the point: the post-resolution re-gate below discards a FINISHED settlement,
  // so the only cure that saves the work is one that reaches the roll. The gate answers
  // which rungs it admits; a full-ladder account gets `null` and changes nothing.
  const allowedTiers = allowedTierPoolOf(state);

  // Anonymous daily generation cap (Tier 7.2). Every full-settlement
  // generation funnels through this action, so this is the single point
  // of enforcement. A *regeneration* (a settlement is already on screen)
  // now counts the same as a first generation — previously rerolls were
  // free, which let an anon mint unlimited towns past the 3/day cap.
  // Captured before the engine runs so we can both block at-cap and pick
  // the right bucket (reroll vs. full) after a successful run.
  const isAnon = state.auth?.tier === 'anon';
  const hadSettlement = !!state.settlement;
  // ⛔ THE SAMPLE FORK DOES NOT PASS THROUGH THIS GATE (ODQ §934.24(b)). It also never
  // reaches the two increments at the bottom, so the counter is not merely bypassed on
  // the way in — a fork leaves the day's allowance BYTE-IDENTICAL, which is the half
  // an exemption written only here would have got wrong.
  if (!isSampleFork && isAnon && anonAtCap()) {
    console.warn('[settlementSlice] anonymous daily generation cap reached.');
    set(s => { s.lastRefusal = refusalOf(REFUSAL_REASONS.DAILY_CAP); });
    return null;
  }

  // LOCKS ENGINE Phase A — GEOGRAPHY is the one lock that is a generation INPUT
  // rather than a post-hoc carry: terrain and trade access are drawn early and
  // everything downstream is conditioned on them, so "keep the ground" can only
  // mean "roll the same ground again". Dormant (same config reference) when
  // geography is unlocked, so an unlocked generation is byte-identical to one
  // taken before locks existed. Under THE PROMISE this stays deterministic —
  // same seed + same config + same locks is the same world.
  // THE CREATE BOUNDARY (ODQ §822) — the `birthConfig` wrapper. This action is a
  // BIRTH on every call: it mints a brand-new town from the WIZARD FORM config,
  // so it can never re-stamp an existing world's law. Re-derivation of an
  // existing world goes through regenSection, which reads `settlement.config`
  // FIRST. ⚠ THIS USED TO END "Dormant today: birthConfig adds nothing while the
  // dial sits at the default", which stopped being true on 2026-09-08: the
  // living-content dial is lit, so every town this action mints carries
  // `_livingContentLawVersion: 2`. Nothing else about the world moves with it,
  // and a world already on disk is untouched because it never passes here again.
  //
  // ⛔ AND A SAVED WORLD'S CONFIG *CAN* REACH `state.config` — this comment used
  // to say otherwise ("never hydrated from a saved settlement"), and that was
  // false (§912, DEF-11). `hydrateFromSave` really does leave config alone, but
  // the Library's "Apply Saved Configuration & Regenerate" calls
  // `updateConfig(migrateConfig(settlement._config || config))` directly, and
  // `updateConfig` admits the underscore family by prefix. What makes a birth
  // from such a config safe is not an absence: it is the CLAMP inside
  // `birthConfig`, which destructures the living-content marker off before
  // spreading the mint, so a birth's law is the DIAL's law on every path.
  //
  // ⛔ A CONFIG-LEVEL `seed` IS DROPPED HERE (reported 2026-09-16 as "Generation
  // failed / The forge stalled before your settlement took shape"). A birth's seed
  // is this action's ARGUMENT (seedOverride, else generateSeed), never a config key:
  // the pipeline reads options.seed or a replayed config._seed, and since Lane PT2-1
  // (4dbef1d16, 2026-08-03) it THROWS on a config carrying `seed`, because a seed
  // there would be silently ignored. The two sample-fork surfaces (FoundingWorlds,
  // SettlementsPanel.forkSample) had stamped `seed` into the stored config since
  // 2026-07-21, and `config` is persisted (store/persistProjection.js), so a single
  // fork failed and then broke every later generation in that browser until its
  // storage was cleared. Dropping the key here, where the STORE config reaches the
  // pipeline, cures every stored state.config and any writer at once; the other
  // reader of saved configs, the campaign content-binding preview, drops it in
  // domain/content/contentSamplePreview.js; the fork writers no longer stamp it
  // (data/sampleSettlements.js forkConfigFor). `seed`
  // stays an ADMITTED key: pruning it would change saved-config loads, which
  // tests/generators/configPatchAllowlistWalker.test.js records as a product call.
  const birthInputs = { ...config };
  delete birthInputs.seed;
  // (No geography-lock overlay since owner order 2026-09-17 retired the world locks: a
  // stored `geography: true` no longer re-rolls the previous town's ground.)
  const fullConfig = birthConfig({
    ...birthInputs,
    _institutionToggles: institutionToggles,
    _categoryToggles:    categoryToggles,
    _goodsToggles:       goodsToggles,
    _servicesToggles:    servicesToggles,
    // "Random" slider mode: resolveConfig rolls the priorities per
    // generation (fresh seed per regenerate) instead of silently using
    // flat 50s — and never writes the rolls back into the stored config.
    ...(state.randomSliderMode === true ? { _randomizePriorities: true } : {}),
    ...(neighbor ? { _importedNeighbor: neighbor } : {}),
    // ⛔ A CAPPED ACCOUNT'S 'random' ROLLS INSIDE ITS OWN RANGE (§934.34). Threaded only
    // for the sentinel that actually rolls, and only when the range is narrower than the
    // ladder, so every other generation reaches the pipeline byte-identical. 'custom' is
    // deliberately NOT covered: its size comes from the reader's own population figure,
    // and a roll cannot be blamed for a number they typed.
    ...(settType === 'random' && allowedTiers ? { _allowedTiers: allowedTiers } : {}),
  });

  const contentRuntimeOptions = await loadSettlementContentRuntimeOptions(state);
  // THE CREATE BOUNDARY'S OTHER HALF (see `loadGenerationLawPayloads`). The
  // config above has just been minted under this build's laws, and one of those
  // laws is obeyed by a module behind a lazy seam: a lit config reaching the
  // pipeline with that payload unloaded THROWS rather than degrading. Awaited
  // HERE, on the lane's own async edge, because the in-thread fallback shares
  // this module instance and is therefore armed by this call; the WORKER
  // transport evaluates its own copy of the graph and arms itself in
  // `generation.worker.js`. Idempotent and memoized on the seam's slot, so the
  // second generation onward pays nothing.
  await loadGenerationLawPayloads();
  const seed = seedOverride || generateSeed();

  const request = {
    kind: GENERATION_REQUEST_KIND,
    v: GENERATION_PROTOCOL_VERSION,
    op: 'settlement',
    requestId: `gen-${++_requestSeq}`,
    payload: {
      fullConfig,
      neighbour: neighbor ?? null,
      seed,
      // §14 P2 — only expose homebrew that passes its tier gate to this
      // settlement's tier. Fail-open for random/custom/unknown types, so it
      // can correctly gate but never silently drop eligible content.
      contentRuntime: contentRuntimeOptions,
      previousSettlement: state.settlement ?? null,
      locks: state.locks ?? null,
    },
  };

  // Receipt times for the reveal's rail, keyed by the step's INDEX so a
  // fallback's re-emitted run overwrites rather than appends. The clock is
  // stamped here on main because the worker may not read one.
  /** @type {number[]} */
  const stepReceiptTimes = [];
  let lastStepId = null;
  const onStep = (step) => {
    if (!step) return;
    lastStepId = step.id ?? lastStepId;
    stepReceiptTimes[step.index ?? stepReceiptTimes.length] = Date.now();
  };

  const genStart = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  let bundle;
  try {
    ({ result: bundle } = await runGeneration(request, {
      flagOn: flag('generationWorker'),
      fallback: inThreadGeneration,
      onStep,
    }));
  } catch (genErr) {
    // Analytics — fire-and-forget GENERATION_FAILED, then re-throw so the
    // existing propagation behaviour is unchanged (additive only).
    import('../lib/analytics.js').then(({ track, EVENTS }) => {
      track(EVENTS.GENERATION_FAILED, {
        error_kind: 'exception',
        step_name: lastStepId ?? /** @type {any} */ (genErr)?.stepId ?? undefined,
      });
    }).catch(() => {});
    // The throw still PROPAGATES — that behaviour is unchanged, and callers that
    // already catch it keep catching it. What is added is the record, so a surface
    // that does NOT catch (three of them did not) still has something to render.
    //
    // ⚠ AND IT NAMES WHICH FAILURE. A tab that outlived a deploy fails on a chunk it
    // can no longer fetch, and "try once more" is FALSE advice there — only a reload
    // helps. `isChunkLoadError` is the same pure predicate lib/staleDeploy.js gives
    // HomeHero, so the two surfaces cannot disagree about what happened.
    set(s => {
      s.lastRefusal = refusalOf(isChunkLoadError(genErr)
        ? REFUSAL_REASONS.STALE_BUILD
        : REFUSAL_REASONS.GENERATION_FAILED);
    });
    throw genErr;
  }
  const generationMs = Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - genStart);

  const { settlement: withRoster, preservation: _preservation, resolvedConfig } = bundle;
  const pipelineHistory = (bundle.pipelineHistory || []).map((row, index) => ({
    id: row.id,
    ts: stepReceiptTimes[index] ?? Date.now(),
    summary: row.summary,
  }));

  // Post-resolution tier RE-GATE (ported master fix): 'random'/'custom' pass
  // the pre-gate as sentinels, so the RESOLVED tier must be re-checked here —
  // otherwise an over-cap resolution commits a settlement the account tier
  // could never select directly. Generators/goldens untouched: this only
  // blocks the COMMIT of an over-cap result. The carry never rewrites `tier`,
  // so reading it off the carried settlement is the same read as before.
  //
  // ⛐ IT IS NO LONGER THE ROUTINE OUTCOME OF A 'random' FORGE, and that is the point of
  // `_allowedTiers` above: this branch used to fire on one anonymous roll in six, spending
  // a whole generation to produce a refusal. It stays as the fail-closed BACKSTOP for
  // 'custom' (a population the reader typed), for a pool the gate could not supply, and
  // for any future path that reaches the pipeline around the pool.
  if ((settType === 'random' || settType === 'custom') && !get().isTierAllowed(withRoster?.tier)) {
    console.warn(`Resolved tier "${withRoster?.tier}" exceeds this account's cap — generation discarded.`);
    // A DIFFERENT sentence from the pre-flight refusal on purpose: the reader picked
    // nothing wrong here, the roll came out too big and the finished town was thrown
    // away. Telling them "you asked for too much" would be false.
    //
    // ⛔ AND THE ROLL CAN LAND UNDER THE FLOOR TOO, where "past what this account
    // forges" is false the other way round. Since the roll draws from `_allowedTiers`
    // this branch should now be unreachable for a capped account — but it is the LAST
    // gate before a commit and it fails closed, so it states the right fact rather than
    // the convenient one: same fact as the pre-flight's, reached by a different door.
    const rolled = get();
    set(s => {
      s.lastRefusal = belowFloor(rolled, withRoster?.tier)
        ? refusalOf(REFUSAL_REASONS.TIER_TOO_SMALL, {
          size: sizeLabelOf(withRoster?.tier),
          min: sizeLabelOf(rolled.minAllowedTier?.()),
        })
        : refusalOf(REFUSAL_REASONS.RESOLVED_TIER, {
          size: sizeLabelOf(withRoster?.tier),
        });
    });
    return null;
  }
  // Regeneration policy (domain/worldPulse/reconcile.js): world/party-
  // authored conditions survive a local regeneration — a reroll replaces
  // the town, not the campaign layer's crises. No-op on a first
  // generation (no prior settlement). EVENT-authored conditions are
  // deliberately NOT carried here: they ride config.eventConditions, so
  // they survive only when the generation input actually records them.
  // Identity guard: the carry is only for a reroll OF the on-screen
  // working draft. When a SAVED settlement is on screen (activeSaveId
  // set), this generation mints a brand-new town (activeSaveId resets
  // below; the save keeps its own settlement and crises) — carrying the
  // old save's world/party conditions onto the new identity would clone
  // the campaign layer onto an unrelated town.
  // LOCKS ENGINE — the POST-HOC half. Phase B (the locked CHARACTERS carried
  // bodily into the new town, each taking over a fresh slot and inheriting its
  // id) now runs INSIDE the generation core, because it lives in the pipeline
  // module and leaving it on main would make every first generate fetch the
  // engine chunk here. `_preservation` is the out-of-band report that lets the
  // lock map follow them; it crosses the boundary as plain data and never
  // enters the settlement blob. Phase A — history (the whole section the user froze)
  // is carried across, below. (The name carry was retired with the world locks by
  // owner order 2026-09-17.)
  // ⛔ Both halves are DORMANT since owner orders 2026-09-17 retired every lock
  // control: the honoured lock view reads nothing (domain/locksPreservation.js
  // normalizeLocks), so no character and no history is carried, and the map tail
  // only drops the stale `npcs` ids the new town cannot hold.
  // The carry ignores activeSaveId on purpose: a lock is the user's standing
  // instruction about what to keep, and Phase A's history carry has
  // always crossed that boundary. Only the campaign-layer condition carry
  // below is guarded, because those belong to a save, not to an intent.
  const locked = carryLockedSections(state.locks, state.settlement, withRoster);
  const reconciled = state.activeSaveId
    ? locked
    : reconcileSettlementChange(locked, state.settlement, {
        source: 'regenerate', changeType: 'GENERATE_SETTLEMENT', changeLabel: locked?.name,
      });
  // W-F6 THE PREMIUM GATE — turn the key at generation-complete. A premium
  // account activates the seed's latent starting pantheon into live embeds
  // (day-one faith life); free/anon leave it latent + private. Idempotent,
  // rng-free, tier-gated — the golden (generator output) is untouched because
  // this fires in the STORE, after the pipeline.
  const withFaith = activateFaithIfEntitled(reconciled, get);
  // Derive the SystemState immediately so the UI never sees a settlement
  // without its accompanying state snapshot. The domain function is
  // pure — no store, no React — and tolerant of partial inputs, so a
  // sparse settlement still produces a usable state.
  let systemState = null;
  try {
    systemState = deriveSystemState(withFaith);
  } catch (e) {
    console.warn('[settlementSlice] deriveSystemState failed:', e);
  }
  const now = new Date().toISOString();
  set(state => {
      // state-lifecycle-3: a fresh generation is a new identity — clear ALL
      // session-only residue through the single chokepoint FIRST (pendingEditsQueue,
      // pendingSuccession, draftVersionHistory, generationId, …), then set this
      // run's own lifecycle fields below. Without this, the prior settlement's
      // queued edits / successor prompt / draft timeline survived onto the new town.
      // The retiring identity is read HERE, before the swap below installs the new
      // world, so the device can retire a slot still holding the world this
      // generation replaces (store/persistProjection.js).
      resetSettlementIdentity(state, { retiring: retiringDraftOf(state) });
      // LOCKS ENGINE Phase B — rewrite the map to the world that now exists:
      // each locked NPC id becomes the id its subject inherited in the carry
      // above, an id nothing preserved is pruned, and every other key is kept
      // verbatim. Run inside the same set()
      // that folds the settlement in, so the map and the roster can never
      // disagree. See domain/locksPreservation.js for the identity split.
      remapLocksAfterGenerate(state, _preservation);
      state.settlement = withFaith;
      state.activeSaveId = null;
      state.lastSeed = seed;
      // ⭐ THE ORIGIN OF THE WORLD IN THE EDITOR (2026-09-18, ODQ §934.8). A birth is
      // the only moment the answer to "whose session made this?" is known for certain,
      // and the whole anonymous-draft persistence rule reads it
      // (store/persistProjection.js): the device keeps a world born anonymous while
      // nobody is signed in, and nothing else.
      //
      // ⛔ IT IS STORE-ROOT STATE AND IT IS NOT ON THE SETTLEMENT. An earlier cut
      // stamped it onto the world itself, which reads well and is wrong twice over: the
      // settlement is PERSISTED into saves and read by the observed-shape corpus, so a
      // session fact would ride into every row and every shape register — and the world
      // this action commits would no longer be byte-identical to the one the pipeline
      // produced. A root field says the same thing about the same instant and travels
      // nowhere it does not belong. `resetSettlementIdentity` nulls it on every swap,
      // so a door that installs a world without answering this question fails CLOSED.
      //
      // READ OFF THE DRAFT, not the snapshot at the top of this action: generation
      // awaits the engine, and a visitor who signs in while it runs has an account by
      // the time it commits — the world is theirs, and 'account' is the honest answer.
      state.draftOrigin = state.auth?.user ? 'account' : 'anon';
      // RETIRED-DARK (owner row WK-2): the full pipeline context is
      // function-bearing and cannot cross a worker boundary, so it is nulled on
      // BOTH transports rather than captured on one. Nulling it only off-thread
      // would make store state differ by transport, which is a fork. The field
      // itself is retained until the owner rules on removing the key; it has no
      // readers in src/ or tests/.
      state.lastCtx = null;
      state.systemState = systemState;
      // A freshly generated settlement carries NO AI overlay — clear the FULL
      // AI-identity slate, not just aiSettlement, so a prior settlement's
      // daily-life / verifier report / refund notice / stale-detection
      // fingerprints can't leak onto the new one (F17/F19 identity hygiene).
      state.aiSettlement = null;
      state.aiDailyLife = null;
      state.aiViolations = null;
      state.aiRefundNotice = null;
      state.aiDataVersion = null;
      state.aiSourceFingerprint = null;
      state.aiPartialFailure = null;
      state.showNarrative = false;
      // pendingPreview cleared by resetSettlementIdentity above.
      state.pipelineHistory = pipelineHistory;
      // P100 — arm the reveal overlay. PipelineReveal mounts when this
      // flips true, plays back through pipelineHistory, then calls
      // dismissPipelineReveal() to clear it. Gated by the flag at the
      // consumer site (GenerateWizard) so a flag-flip kills the
      // behavior without touching the slice.
      state.pipelineRevealActive = true;
      // Generation always returns the settlement to draft phase. Going to
      // canon is a deliberate user action (canonize()), not a side-effect
      // of regeneration — that would silently invalidate any campaign log.
      state.phase = 'draft';
      state.eventLog = [];
      state.generatedAt = now;
      state.editedAt = now;
      state.canonizedAt = null;
  });

  // Count this anonymous generation against the daily cap. A regeneration
  // (a settlement was already on screen) spends a reroll; the first
  // generation of the day spends the full allowance. Only on success.
  // ⛔ AND A SAMPLE FORK SPENDS NOTHING (ODQ §934.24(b)) — the write half of the
  // exemption. A fork that was let past the gate above but still incremented here
  // would burn the reader's real allowance for a curated seed, which is the exemption
  // failing on its second lifecycle path while passing on its first.
  if (!isSampleFork && isAnon && withRoster) {
    if (hadSettlement) incrementAnonReroll();
    else incrementAnonFull();
  }

  // Analytics — fire-and-forget, never affects the return. GENERATION_COMPLETED
  // carries the reduced (enum/count-only) fingerprint; fires alongside (not
  // replacing) the component-layer anonymous_generation_completed. When this
  // run replaced an on-screen draft it is also a re-roll, so REGENERATION_TRIGGERED
  // fires with regen_mode 'full' (this action does a fresh whole-pipeline roll).
  // ⚠ THE CONFIG READ IS THE ONE THE CORE RETURNED, never a reference this
  // thread still happens to hold: on the worker path the object the pipeline
  // saw lives in another thread, so reading `resolvedConfig` is what keeps the
  // two transports' telemetry identical instead of differing by accident.
  Promise.all([
    import('../lib/analytics.js'),
    import('../lib/structuralFingerprint.js'),
    import('../lib/regionalFingerprint.js'),
    import('../lib/constructionUsage.js'),
  ]).then(async ([{ track, EVENTS }, fp, { extractNeighbourGenerated }, { configArchetype }]) => {
    const { extractReducedFingerprint, computeFingerprintHash, computeConfigSignature, usedRandomSentinels, extractStressorGenesis, band5 } = fp;
    const reduced = extractReducedFingerprint(reconciled) || {};
    const power = reconciled?.powerStructure || {};
    // The variance grouping key (config_signature) + an output identity hash
    // (content_hash) are async (SubtleCrypto); resolve them, but never let a
    // hashing hiccup drop the event.
    let config_signature; let content_hash;
    try { config_signature = await computeConfigSignature(resolvedConfig); } catch { /* omit */ }
    try { content_hash = await computeFingerprintHash(reduced); } catch { /* omit */ }
    // A2-deferral note (DESIGN_ANALYTICS_V2 §4 market floor): world_pulse_advanced +
    // world_canonized now stamp the campaign uuid as subject_id so the k=200-campaigns
    // floor can form cells. generation_completed is INTENTIONALLY left unstamped here:
    // this is the working-buffer generation (pre-save, pre-campaign) — no campaign uuid
    // exists in scope, and the settlement carries no persistent save uuid yet (the
    // generation-id spine below uses a pseudonymous, non-uuid id). "Stamp where
    // campaign-scoped" is thus a no-op at this emit; report_market_archetype_popularity's
    // campaign floor stays fail-closed until a campaign-scoped generation path exists.
    track(EVENTS.GENERATION_COMPLETED, {
      ...reduced,
      config_signature,
      content_hash,
      // §1.2 settlement-construction grouping: the priority-profile cluster the user
      // asked for, joined to the outcome fingerprint — the demand signal for what
      // players build (never ids/names; a coarse enum off the config sliders).
      config_archetype: configArchetype(resolvedConfig),
      used_random_sentinels: usedRandomSentinels(resolvedConfig),
      is_regeneration: hadSettlement,
      duration_ms: generationMs,
      conflict_count: Array.isArray(power.conflicts) ? power.conflicts.length : 0,
      relationship_count: Array.isArray(reconciled?.relationships) ? reconciled.relationships.length : 0,
      service_count: Array.isArray(reconciled?.services) ? reconciled.services.length : 0,
      hook_count: Array.isArray(reconciled?.plotHooks || reconciled?.hooks) ? (reconciled.plotHooks || reconciled.hooks).length : 0,
      legitimacy_band: band5(power.publicLegitimacy?.score),
      defense_readiness: reconciled?.defenseProfile?.readiness?.label,
      neighbour_present: !!(neighbor || reconciled?.neighborRelationship),
      neighbour_relationship_type: reconciled?.neighborRelationship?.relationshipType || resolvedConfig?._neighbourRelType,
      custom_content_active: resolvedConfig?.useCustomContent !== false,
      // per-type stressor genesis (forced-pre / emergent / post-gen / suppressed)
      stressor_genesis: extractStressorGenesis(reconciled),
    });
    // Activate the dead neighbour_generated event: the generation-time
    // neighbour bias (which axes it shifted), only when a neighbour was bound.
    const neigh = extractNeighbourGenerated(reconciled);
    if (neigh) track(EVENTS.NEIGHBOUR_GENERATED, neigh);
    if (hadSettlement) {
      track(EVENTS.REGENERATION_TRIGGERED, { regen_mode: 'full', config_signature });
    }
  }).catch(() => {});

  // Wave E1 — the generation-id spine. Mint the pseudonymous id (stable across
  // reload via seed+stamp), stash it in the store field (NOT on the settlement),
  // and fire the 'generate' milestone. Lazy + fire-and-forget so it never touches
  // cold start or the return value.
  import('../lib/generationTelemetry.js').then(({ recordGenerationMilestone, deriveGenerationId }) => {
    const genId = deriveGenerationId(seed, now);
    set(s => { s.generationId = genId; });
    recordGenerationMilestone('generate', reconciled, { generationId: genId });
  }).catch(() => {});

  // Return the activated settlement so a caller that saves the return value
  // persists the SAME faith-active shape the store holds (state.settlement =
  // withFaith). Generation telemetry above intentionally reads `reconciled`
  // (generator truth — activation is a post-pipeline store overlay). The draft's
  // ORIGIN is deliberately not here: it describes the session, not the world, so
  // it lives at the store root and never reaches a caller that saves this object.
  return withFaith;
}
