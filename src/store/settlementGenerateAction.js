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
import { flag } from '../lib/flags.js';
import { runGeneration } from '../lib/generationClient.js';
import {
  GENERATION_PROTOCOL_VERSION,
  GENERATION_REQUEST_KIND,
} from '../lib/generationProtocol.js';
import { loadSettlementContentRuntimeOptions } from './settlementContentRuntime.js';
import {
  carryLockedSections, geographyLockedConfig, remapLocksAfterGenerate,
} from './settlementSliceHelpers.js';
// ⛔ THE CREATE BOUNDARY IS IMPORTED DIRECTLY, NOT THROUGH THE HELPERS LEAF, AND
// THAT EDGE IS A FIRST-PAINT MEASUREMENT. `settlementSliceHelpers.js` is EAGER;
// while it re-exported `birthConfig` the boundary module sat in src/main.jsx's
// static closure even though its only two callers — this lane and the realm
// composer — are both lazy. This lane is reached solely through
// settlementSlice.js's dynamic import, so importing the boundary here keeps it
// on the lazy side with its callers (MEASURED, lane L-MAT: closure 239 -> 238).
import { birthConfig, loadGenerationLawPayloads } from '../domain/density/densityCreateBoundary.js';
import { activateFaithIfEntitled, resetSettlementIdentity } from './settlementLifecycleHelpers.js';

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
 * @returns {Promise<any>} the activated settlement, or null when a gate refused
 */
export async function generateSettlementAction(set, get, seedOverride) {
  const state = get();
  const { config, institutionToggles, categoryToggles, goodsToggles, servicesToggles } = state;
  const neighbor = state.importedNeighbour;

  // Tier gate check
  const settType = config.settType;
  if (settType && settType !== 'random' && settType !== 'custom') {
    if (!state.isTierAllowed(settType)) {
      console.warn(`Tier "${settType}" not allowed for current user tier.`);
      return null;
    }
  }

  // Anonymous daily generation cap (Tier 7.2). Every full-settlement
  // generation funnels through this action, so this is the single point
  // of enforcement. A *regeneration* (a settlement is already on screen)
  // now counts the same as a first generation — previously rerolls were
  // free, which let an anon mint unlimited towns past the 3/day cap.
  // Captured before the engine runs so we can both block at-cap and pick
  // the right bucket (reroll vs. full) after a successful run.
  const isAnon = state.auth?.tier === 'anon';
  const hadSettlement = !!state.settlement;
  if (isAnon && anonAtCap()) {
    console.warn('[settlementSlice] anonymous daily generation cap reached.');
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
  const fullConfig = geographyLockedConfig(state.locks, state.settlement, birthConfig({
    ...config,
    _institutionToggles: institutionToggles,
    _categoryToggles:    categoryToggles,
    _goodsToggles:       goodsToggles,
    _servicesToggles:    servicesToggles,
    // "Random" slider mode: resolveConfig rolls the priorities per
    // generation (fresh seed per regenerate) instead of silently using
    // flat 50s — and never writes the rolls back into the stored config.
    ...(state.randomSliderMode === true ? { _randomizePriorities: true } : {}),
    ...(neighbor ? { _importedNeighbor: neighbor } : {}),
  }));

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
  if ((settType === 'random' || settType === 'custom') && !get().isTierAllowed(withRoster?.tier)) {
    console.warn(`Resolved tier "${withRoster?.tier}" exceeds this account's cap — generation discarded.`);
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
  // enters the settlement blob. Phase A — identity (the name) and history (the
  // whole section the user froze) are carried across, below.
  // The carry ignores activeSaveId on purpose: a lock is the user's standing
  // instruction about what to keep, and Phase A's name/history carry has
  // always crossed that boundary. Only the campaign-layer condition carry
  // below is guarded, because those belong to a save, not to an intent.
  const locked = carryLockedSections(state.locks, state.settlement, withRoster);
  // ⭐ THE SCRIBE'S LOCKED CARRY (design §5 REGENERATE). A full generate mints a NEW town, so
  // the rendered dossier prose does NOT follow it by default: the fresh blob carries no
  // artefact and every tab draws the hand corpus until the town is scribed. The one exception
  // is the ground a lock actually froze — carryProseAcrossGenerate re-derives the town card for
  // both towns and keeps a pool's units only where every fact the unit stands on is identical.
  // The path is DORMANT unless the replaced town carries an artefact at all, which is why the
  // module (it pulls the six prose leaves through the town card) is reached lazily and why the
  // ordinary generate loads nothing.
  let carried = locked;
  if (locked && state.settlement && Object.hasOwn(state.settlement, 'prose')) {
    try {
      const { carryProseAcrossGenerate } = await import('../lib/scribeGround.js');
      carried = await carryProseAcrossGenerate(state.settlement, locked, state.locks);
    } catch (e) {
      // A carry is a convenience over a FLOOR that always exists: never block a generation on
      // it, and never leave a half-carried artefact behind.
      console.warn('[settlementSlice] scribe prose carry failed', e);
      carried = locked;
    }
  }
  const reconciled = state.activeSaveId
    ? carried
    : reconcileSettlementChange(carried, state.settlement, {
        source: 'regenerate', changeType: 'GENERATE_SETTLEMENT', changeLabel: carried?.name,
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
      resetSettlementIdentity(state);
      // LOCKS ENGINE Phase B — rewrite the map to the world that now exists:
      // each locked NPC id becomes the id its subject inherited in the carry
      // above, an id nothing preserved is pruned, and the name-keyed faction /
      // institution arrays and the booleans are kept. Run inside the same set()
      // that folds the settlement in, so the map and the roster can never
      // disagree. See domain/locksPreservation.js for the identity split.
      remapLocksAfterGenerate(state, _preservation);
      state.settlement = withFaith;
      state.activeSaveId = null;
      state.lastSeed = seed;
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
  if (isAnon && withRoster) {
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
  // (generator truth — activation is a post-pipeline store overlay).
  return withFaith;
}
