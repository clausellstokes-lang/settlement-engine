/**
 * densityCreateBoundary.js — WHICH GENERATION IS A BIRTH.
 *
 * ODQ §822 chartered this into car D2: "give the density law a true birth
 * boundary … the dial stays DORMANT, but after your car the flip must be safe."
 * Both halves are here — the mint itself, and the manifest that makes a future
 * caller unable to get the answer wrong silently.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS AT ALL: A BIRTH AND A REPLAY LOOK IDENTICAL
 * ════════════════════════════════════════════════════════════════════════════
 *
 * `newSettlementDensityLaw()` (densityLaw.js) mints the config marker a new
 * world is born under. It had no caller, because the call site is not obvious:
 *
 *   BIRTH  → generateSettlementPipeline(formConfig,        null, { seed: fresh })
 *   REPLAY → generateSettlementPipeline(settlement.config, null, { seed: saved })
 *
 * Structurally identical. The pipeline cannot tell them apart, and a
 * non-clobbering "mint only when the marker is absent" guard cannot either —
 * because a pre-law world's config is MARKERLESS, exactly like a fresh one. So
 * the birth signal has to be POSITIVE and it has to come from the CALLER.
 *
 * ⛔ AND IT MUST BE THE GENERATION LAW, NOT A LABEL STAMPED AFTERWARDS. The
 * sibling `layoutLawVersion` mints at three SAVE chokepoints, and that precedent
 * deliberately does NOT transfer: layout is a READ law applied at render time,
 * so stamping it after the fact is coherent. Density is a WRITE law — it governs
 * the roll itself. A settlement generated under v1 and then labelled v2 at save
 * would re-derive under v2 on its next section regen and disagree with its own
 * body. Stamping late is strictly worse than not stamping.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * THE MEASURED CALLER SET (car D2, executed reads — not inferred)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ⭐ THE STORE'S GENERATE ACTION IS A BIRTH, AND THE RECORD THAT SAID OTHERWISE
 * IS CORRECTED HERE. Car D1 reverted its create-boundary attempt on the reading
 * that "the store's generate action is both a birth and a regeneration … and
 * fullConfig for a regeneration is the existing world's own config". That is not
 * so, and four executed reads say why:
 *
 *   1. `generateSettlement` builds `fullConfig` from `state.config`
 *      (settlementSlice.js), never from a settlement.
 *   2. `state.config` is the WIZARD'S FORM STATE. `hydrateFromSave` assigns
 *      settlement / activeSaveId / lastSeed / phase / eventLog / locks and the
 *      timestamps — and NOT config. `config` lives in configSlice.js behind
 *      `updateConfig`, which validates against an admitted key surface and drops
 *      unknown keys.
 *      ⛔ BUT A SAVED SETTLEMENT *CAN* REACH IT, AND THE ORIGINAL SENTENCE HERE
 *      ("Nothing anywhere hydrates it from a saved settlement") WAS FALSE — the
 *      load-bearing half of this correction, and the reason an admission surface
 *      was left unchanged. The Library's "Apply Saved Configuration & Regenerate"
 *      runs `updateConfig(migrateConfig(data.settlement?._config || data.config))`
 *      (`SettlementsPanel.jsx`, also reached from `SettlementDetail.jsx`), and
 *      `updateConfig` admits the whole underscore family by prefix
 *      (`isAllowedConfigKey`: `key.startsWith('_')`), so a saved world's law
 *      marker really does arrive in the form state. What makes that harmless is
 *      not an absence — it is the CLAMP in `birthConfig` below, which destructures
 *      the marker off the incoming config before spreading the mint. Measured end
 *      to end before the clamp existed: an imported v2 world's config, loaded and
 *      regenerated, minted a roster on a build whose dial says v1.
 *   3. `geographyLockedConfig` cannot smuggle the marker across: it overlays
 *      ONLY the geography keys from the previous settlement.
 *   4. The true regeneration path already reads the world's own law —
 *      `regenSection` takes `settlement.config || config`, settlement first, so
 *      a markerless v1 world regenerates as v1.
 *
 * ⚠ AND A STALE COMMENT THAT WOULD HAVE MISLED THE NEXT READER, MEASURED:
 * generateSettlementPipeline's docblock says `config._seed` "is how a saved
 * settlement replays itself". Executed probe: a generated `settlement.config`
 * carries NO `_seed` (the seed is top-level `settlement._seed`), and re-running
 * the pipeline on a settlement's own config produces a DIFFERENT TOWN. There is
 * no config-carried replay path to protect, which is why the birth signal can
 * safely live at the caller.
 *
 * Pure. No RNG, no store, no React.
 */

import { newSettlementDensityLaw } from './densityLaw.js';
// ⭐ THE SECOND GENERATION LAW, WIRED HERE AND NOWHERE ELSE (lane L-MAT). This
// edge was refused by the car that wrote `GENERATION_LAWS` below, on a BYTE
// ground that was true then and is not now: this module used to be EAGER, so a
// static import from here dragged the living-content law into first paint. It is
// no longer eager — its one eager edge (a `birthConfig` re-export through
// `src/store/settlementSliceHelpers.js`) was cut in the car before this one — so
// the law rides the lazy side with the two birth callers that reach it.
// ⚠ THE LAW FILES LIVE UNDER `src/domain/content/`, NOT beside this one.
import { newSettlementLivingContentLaw } from '../content/livingContentLaw.js';
// The marker's ONE spelling, for the clamp inside `birthConfig`. It comes from
// the dependency-free leaf that declares it — the same edge the law file itself
// takes, and the reason a second copy of the key can never exist. The leaf
// imports nothing, so this adds no module to any closure the law import above
// did not already bring.
import { LIVING_CONTENT_LAW_CONFIG_KEY } from '../content/livingContentLawVersion.js';
// ⭐ THE OTHER HALF OF A MINT, AND THE REASON IT LIVES HERE. A mint is
// synchronous by construction; a PAYLOAD behind a lazy boundary is not. The
// living-content law's roster is reached through `livingContentSeam.js`'s
// dynamic import, and a generation whose config carries that law THROWS when the
// payload was never loaded, so "which law does a birth mint" and "what must be
// loaded before that law can be obeyed" are two halves of one question and are
// answered in one file. The seam is engine-side already (the pipeline imports it
// statically), so this edge adds no module to any closure.
import { loadLivingContentRoster } from '../content/livingContentSeam.js';

/**
 * How a module that can reach `generateSettlementPipeline` is classified.
 *
 *   BIRTH    — mints a genuinely new world; MUST spread `birthConfig`.
 *   DERIVED  — re-derives an EXISTING world; must never mint (the world's own
 *              persisted config already carries its law, or its markerless
 *              absence IS its law).
 *   PREVIEW  — generates a throwaway for comparison/diagnostics that is never
 *              persisted as a world; must never mint, because a preview that
 *              minted would make previews and reality disagree.
 *   EXECUTOR — runs a request whose law was ALREADY minted by a classified
 *              BIRTH caller on the main thread, and must never mint one of its
 *              own. This class exists because the generation transport split
 *              the mint from the reach: the store's generation lane mints the
 *              law and hands a plain-data request across a worker boundary,
 *              and the core on the far side is the module that actually calls
 *              the pipeline. Without EXECUTOR the walker's premise (the module
 *              that mints IS the module that reaches) would force the executor
 *              to be miscalled a BIRTH, which would then demand that it mint
 *              a SECOND law over a request that already carries one.
 *
 * @type {ReadonlyArray<string>}
 */
export const BOUNDARY_CLASSES = Object.freeze(['BIRTH', 'DERIVED', 'PREVIEW', 'EXECUTOR']);

/**
 * ⭐ THE MANIFEST — every module in `src/` that can reach the settlement
 * pipeline, and what it is. `tests/lint/densityCreateBoundary.walker.test.js`
 * holds this to the tree: a module that reaches the pipeline and is NOT listed
 * here REDS, and a listed module whose class disagrees with whether it actually
 * mints REDS. That is the whole point — the correctness of the create boundary
 * must not rest on today's caller set happening to stay frozen.
 *
 * Keys are repo-relative POSIX paths.
 *
 * `reachesVia` is optional and names the module a row reaches the pipeline
 * THROUGH when the mint and the call live in two files. A row that carries it
 * is held to the tree by its executor's reach, not its own.
 *
 * ⭐ `payloadAwaitedBy` IS REQUIRED ON EVERY ROW, and it is the second half of
 * the boundary (see `loadGenerationLawPayloads` above): the modules that await
 * the lazy payload before this row's pipeline call runs. It is a LIST because a
 * reacher can be entered from more than one thread — the generation core is
 * entered in-thread by the store's lane and in a Web Worker by the worker shell,
 * and a worker evaluates its own copy of the seam, so each entry point loads for
 * itself. Every named module is held to the tree: the walker requires each one
 * to really await the loader, so a row cannot name a module that stopped doing
 * it.
 *
 * @type {Readonly<Record<string, {class: string, why: string, reachesVia?: string,
 *   payloadAwaitedBy: ReadonlyArray<string>}>>}
 */
export const PIPELINE_REACHERS = Object.freeze({
  'src/store/settlementGenerateAction.js': Object.freeze({
    class: 'BIRTH',
    why: 'the generation lane mints a brand-new town from the wizard form config on every '
      + 'call; a reroll REPLACES the town rather than re-deriving it, and with a save on '
      + 'screen it explicitly mints a new identity. A SAVED WORLD\'S LAW *CAN* REACH '
      + 'state.config: the Library\'s "Apply Saved Configuration & Regenerate" runs '
      + 'updateConfig(migrateConfig(data.settlement?._config || data.config)) and '
      + 'updateConfig admits the whole underscore family by prefix. So what keeps this '
      + 'birth unambiguous is not that absence (the sentence here used to claim one, and '
      + 'it was FALSE; corrected at §913) but the CLAMP in birthConfig, which destructures '
      + 'the marker off the incoming config before spreading the mint. It mints '
      + 'the law here on the main thread and sends it as request data; the executor named '
      + 'below is what actually calls the pipeline.',
    reachesVia: 'src/workers/generationRequest.js',
    payloadAwaitedBy: Object.freeze(['src/store/settlementGenerateAction.js']),
  }),
  'src/workers/generationRequest.js': Object.freeze({
    class: 'EXECUTOR',
    why: 'the generation core runs a request whose density law was already minted by the '
      + 'BIRTH caller that built it; minting again here would stamp a second law over a '
      + 'config that already carries one, and it would do so for every transport including '
      + 'the previews and re-derivations that must never mint at all.',
    // TWO entry points, two module instances: the store's lane awaits the payload
    // in-thread, and the worker shell awaits it inside its own message handler
    // because a Web Worker evaluates its own copy of the seam and a main-thread
    // load does not arm it.
    payloadAwaitedBy: Object.freeze([
      'src/store/settlementGenerateAction.js',
      'src/workers/generation.worker.js',
    ]),
  }),
  'src/lib/instantWorld/composeInstantWorld.js': Object.freeze({
    class: 'BIRTH',
    why: 'the realm composer mints every member settlement from DEFAULT_CONFIG via '
      + 'memberConfigFor; there is no prior world in the call at all.',
    // The composer is SYNCHRONOUS by design, so it cannot await anything itself;
    // its three callers do it, and it re-exports the loader so a caller that has
    // already paid for the composer's chunk needs no second dynamic import.
    payloadAwaitedBy: Object.freeze([
      'src/store/instantWorldBody.js',
      'src/components/WorldPage.jsx',
      'src/components/surveyor/ConstructionPanel.jsx',
    ]),
  }),
  'src/components/surveyor/ConstructionPanel.jsx': Object.freeze({
    class: 'PREVIEW',
    why: 'generates a dossier only to compare it against the surveyor\'s construct '
      + 'constraints and report deviations; the result is not committed as a world.',
    payloadAwaitedBy: Object.freeze(['src/components/surveyor/ConstructionPanel.jsx']),
  }),
  'src/workers/customContentPreview.worker.js': Object.freeze({
    class: 'PREVIEW',
    why: 'renders a preview of what homebrew content would do to a generation; the '
      + 'output is shown, never persisted.',
    payloadAwaitedBy: Object.freeze(['src/workers/customContentPreview.worker.js']),
  }),
  'src/store/campaignContentBindingSession.js': Object.freeze({
    class: 'PREVIEW',
    why: 'forges a SAME-SEED before/after sample so a content-binding change can be '
      + 'shown to the user; minting here would make the sample differ from the world it '
      + 'is meant to predict.',
    payloadAwaitedBy: Object.freeze(['src/store/campaignContentBindingSession.js']),
  }),
});

/**
 * ⭐ THE ONE MINT, AND THE ONLY THING A BIRTH CALLER CALLS.
 *
 * Spread this into the config a BIRTH hands the pipeline. While a law's dial
 * sits at its dormant default its mint returns an EMPTY object, so this spreads
 * NOTHING and a birth's config is byte-identical to one taken before the laws
 * existed — which is why the call sites can land dormant and proved, and each
 * flip stays the one line it is advertised to be.
 *
 * ⛔ EVERY WIRED LAW IS SPREAD HERE, IN ONE PLACE, AND THAT IS THE ARCHITECTURE
 * RATHER THAN A CONVENIENCE. The alternative offered for the living-content law
 * was a per-caller LAZY mint declared in the two BIRTH callers, which would keep
 * the law off first paint without this module moving at all. It was refused: it
 * puts the mint in two places, so "which law does a birth mint" stops being
 * answerable by reading one function, and the `GENERATION_LAWS` register below
 * — whose WIRED arm asks exactly that of THIS file — would go blind to it. Both
 * dials stay dormant, so the choice costs nothing today and is only about where
 * the next reader has to look.
 *
 * ⛔ AND THE INCOMING LIVING-CONTENT MARKER IS CLAMPED OFF FIRST, BECAUSE A
 * SPREAD OF `{}` DELETES NOTHING. ⚠ THE CLAMP BITES AT THE DORMANT DIAL AND ONLY
 * THERE, which the lighting made visible rather than changed: the mint is spread
 * LAST, so a non-empty mint always wins and the destructure is load-bearing
 * exactly when the mint is `{}`. It stays because the dial is one line in both
 * directions, and the day it is reverted is the day the hole below re-opens if
 * this destructure has gone. While the dial is dormant the mint returns an empty
 * object, so it cannot overwrite a marker the incoming config already
 * carries — and a config CAN carry one: the Library's Load hydrates the wizard
 * form from a saved `settlement._config` (`SettlementsPanel.jsx`, "Apply Saved
 * Configuration & Regenerate", also reached from `SettlementDetail.jsx`), and the
 * store's `updateConfig` admits the whole underscore family by prefix. Without
 * this destructure, loading an imported v2 world's configuration and pressing
 * Generate births a NEW world under v2 on a build whose dial says v1 — a world
 * born under a law no dial in this build ever minted, which is precisely what
 * "a birth's law is the dial's law" is supposed to mean. Measured: at the dormant
 * default this writes not one config byte, because the key is simply absent from
 * every config the product produces.
 *
 * @template {Record<string, unknown>} C
 * @param {C} config the config a birth is about to generate from
 * @returns {C} the same shape, carrying the laws a NEW world is born under
 */
export function birthConfig(config) {
  const {
    // The underscore-prefixed binding IS the clamp (see the note above); the lint
    // config admits that name shape, so no disable directive is wanted here.
    [LIVING_CONTENT_LAW_CONFIG_KEY]: _incomingLivingContentLaw,
    ...carried
  } = /** @type {Record<string, unknown>} */ ({ ...(config || {}) });
  return /** @type {C} */ ({
    ...carried,
    ...newSettlementDensityLaw(),
    ...newSettlementLivingContentLaw(),
  });
}

/**
 * ⭐⭐ THE CREATE BOUNDARY'S ASYNC EDGE — the ONE call every module that can
 * reach `generateSettlementPipeline` awaits before it reaches it.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * WHY A GENERATION HAS AN ASYNC PRELUDE AT ALL
 * ════════════════════════════════════════════════════════════════════════════
 *
 * `birthConfig` above answers "which law does a birth mint" synchronously,
 * because the pipeline is synchronous and a config is data. But the
 * living-content law's ROSTER is not data — it is a module behind
 * `livingContentSeam.js`'s dynamic `import(`, and that boundary exists for a
 * measured byte reason (a static edge from the pipeline moved the first-paint
 * closure 1,045,910 to 1,095,584 against a 1,047,000 ceiling). The seam
 * therefore answers dormant-or-lit synchronously and FAILS LOUD when a world's
 * own config says v2 and the payload was never loaded:
 * `[livingContentSeam] v2 world, roster payload not loaded`, thrown out of the
 * pipeline. A quiet `null` there would be a same-seed divergence conditioned on
 * whether a chunk happened to be fetched, which is the one failure a lazy seam
 * must never introduce.
 *
 * ⛔⛔ AND THIS FUNCTION IS WHAT THE ESTATE DID NOT HAVE. `loadLivingContentRoster`
 * had NO CALLER in `src/`: the seam defined it and nothing invoked it. That
 * outage — not the dial — was the true ground of every "the roster is inert"
 * claim in this estate, and lighting the dial without curing it first would have
 * taken GENERATION DOWN on every path rather than producing leaky worlds.
 * Recorded in four places while it stood; cured here, first, before the dial
 * moved.
 *
 * ⭐ IT IS AWAITED BY EVERY REACHER, NOT ONLY BY A BIRTH, AND THAT IS MEASURED
 * RATHER THAN CAUTIOUS. The seam's gate reads the WORLD'S config, not the
 * build's dial, and a config carrying the marker can arrive from an IMPORT FILE
 * with no dial moving at all (the Library's "Apply Saved Configuration &
 * Regenerate" hydrates the wizard form from a saved `settlement._config`, and
 * `updateConfig` admits the underscore family by prefix). A PREVIEW or an
 * EXECUTOR can therefore meet a lit config on a build whose dial is dark. Every
 * row of `PIPELINE_REACHERS` names, in `payloadAwaitedBy`, the module that
 * awaits this on its behalf, and `tests/lint/densityCreateBoundary.walker.test.js`
 * holds those names to the tree.
 *
 * ⚠ IT IS NEVER CALLED AT MODULE LOAD, AND THE FENCE IS BYTES. Awaiting it in a
 * module body would make the roster closure a startup fetch for whichever chunk
 * did it; awaiting it inside the async function that is ABOUT to generate keeps
 * the payload exactly as lazy as the seam made it. It is also idempotent and
 * memoized on the seam's slot, so a second await after the first resolves is
 * free and every reacher may call it unconditionally.
 *
 * ⚠ AND ONCE PER MODULE INSTANCE, WHICH IS WHY THE TWO WORKER SHELLS ARM THE
 * SEAM THEMSELVES. The seam's registry is module state, and a Web Worker
 * evaluates its own copy of the graph: a main-thread load does not arm the
 * worker's seam. `src/workers/generation.worker.js` and
 * `src/workers/customContentPreview.worker.js` therefore arm it inside their own
 * message handlers, for that reason and no other.
 *
 * ⛔ THEY DO IT BY CALLING THE SEAM'S `loadLivingContentRoster` DIRECTLY, NOT
 * THIS AGGREGATE, AND THE REASON IS BYTES (lane LIGHT, car 3a). This module is
 * otherwise absent from a worker's module graph while the seam is already in it,
 * so the aggregate would drag a whole file into a transport bundle that is held
 * under a MONOTONE-DOWN ceiling and buy the worker nothing: 31 B measured on each
 * worker bundle at `dd0b68c0d`. Every MAIN-THREAD reacher still comes through
 * here, which is the point of the aggregate existing.
 *
 * ⚠ THAT SHORTCUT IS SOUND ONLY WHILE THIS FUNCTION AWAITS ONE LOADER. Add a
 * second payload below and the two worker shells silently stop arming it, which
 * would show up as a world that generates in-thread and throws in the worker.
 * `tests/lint/densityCreateBoundary.walker.test.js` reads this body and reds the
 * moment a second await appears, so the workers cannot be forgotten quietly.
 *
 * @returns {Promise<void>}
 */
export async function loadGenerationLawPayloads() {
  await loadLivingContentRoster();
}

/**
 * The wiring states a versioned GENERATION law can be in at this boundary.
 *
 *   WIRED   - its mint is spread by `birthConfig`, so every BIRTH caller mints
 *             it and no other caller can.
 *   UNWIRED - the law exists and its dial is dormant, but no BIRTH reaches it
 *             yet. A world can only be born under it by an explicit config key,
 *             which is how its own tests drive it.
 *
 * ⚠ THERE IS NO "OUT OF SCOPE" MEMBER, AND ITS ABSENCE IS LOAD-BEARING. One
 * `NEW_SETTLEMENT_…` dial in the estate is NOT a generation law — it is a READ
 * law stamped at the save chokepoints, for the reason this module's header
 * gives — and the obvious move is a third state excusing it here. That row was
 * WRITTEN AND WITHDRAWN: naming its module and its mint put a retired
 * capability's vocabulary into `src/`, which `tests/lint/`'s terminal
 * settlement-surface census convicts as an owner-gated question (ODQ §725), and
 * it convicted this file on the first run. The exclusion is therefore declared
 * in the walker, which that census deliberately does not scan, with its reason
 * beside it. A law that is off this boundary is named where naming it is free.
 *
 * @type {ReadonlyArray<string>}
 */
export const LAW_WIRING_STATES = Object.freeze(['WIRED', 'UNWIRED']);

/**
 * ⭐ THE GENERATION-LAW REGISTER — WHICH VERSIONED LAWS THIS BOUNDARY CARRIES,
 * WHICH ONE IT DELIBERATELY DOES NOT, AND WHY (LGT-P8-MATBOUND).
 *
 * ════════════════════════════════════════════════════════════════════════════
 * WHY A SECOND TABLE, WHEN THE FIRST ONE ALREADY WORKS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * `PIPELINE_REACHERS` above answers "which CALLER is a birth". It says nothing
 * about "which LAW a birth mints", because when it was written there was only
 * one. There are two now, and the second one is NOT here:
 *
 *   density        `newSettlementDensityLaw()`        spread by `birthConfig`
 *   living content `newSettlementLivingContentLaw()`  spread by `birthConfig`
 *
 * Both are WIRED now; the second one was not when this table was written, and
 * the paragraphs below record why it was refused then and what changed.
 *
 * ⛔ AND THE WALKER COULD NOT SEE THE DIFFERENCE. Its `MINT_SYMBOLS` named the
 * density pair only, so every one of its mint arms — "every BIRTH mints", "no
 * non-BIRTH mints", "the mint is not named outside its homes" — was blind to
 * the living-content mint. A future car could have wired that mint into a
 * PREVIEW module and the walker would have said nothing. The register closes
 * that by making the LAW SET the denominator, exactly as the caller set already
 * is: a `newSettlement…` mint or a `NEW_SETTLEMENT_…` dial that is named
 * neither here nor in the walker's off-boundary roster REDS, and an UNWIRED law
 * that acquires a generation-side caller REDS until somebody changes its row to
 * WIRED and states what the edge costs.
 *
 * ⚠ AND THE REGISTER'S OWN ARM RETIRES ITSELF FOR A LAW THE MOMENT THAT LAW IS
 * WIRED, WHICH IS WHY THE WALKER'S `MINT_SYMBOLS` WIDENED IN THE SAME ACT (lane
 * L-MAT). The starred arm above guards NON-WIRED laws only: flipping the
 * living-content row to WIRED took it out of that arm's denominator and would
 * have left nothing at all watching where its mint is named. The walker now
 * carries `newSettlementLivingContentLaw` in `MINT_SYMBOLS`, with the law module
 * added to its mint homes, so the three per-caller arms cover BOTH laws and a
 * PREVIEW that minted either one still reds.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⛔⛔ WHY THE LIVING-CONTENT LAW WAS UNWIRED, AND WHAT ACTUALLY CHANGED
 * ════════════════════════════════════════════════════════════════════════════
 *
 * NOT because the create boundary was missing — that was the stale reading the
 * register's own car retired. The boundary was here, wired and walked. The
 * reason was BYTES: THIS MODULE WAS EAGER, reached from `src/main.jsx` through
 * `store/index -> settlementSlice -> settlementSliceHelpers`, which re-exported
 * `birthConfig`. Its density import was free because `densityLaw.js` is already
 * in that closure; a static import of `livingContentLaw.js` would have dragged
 * that module and the leaf behind it, `livingContentLawVersion.js`, into first
 * paint — and the leaf is listed in `vite.config.js`'s
 * `ENGINE_SHARED_DOMAIN_EXCISIONS`, excised and deliberately UNPINNED, so
 * `tests/build/engineChunkLazy.test.js`'s orphan-excision arm would have
 * convicted it the moment first paint reached it. No build was needed to see it.
 *
 * ⭐ THE CURE WAS TO MOVE THIS MODULE, NOT THE MINT (lane L-MAT). The register's
 * own car predicted a different one — put the mint on the lazy engine surface
 * "the store's generation lane already awaits `loadEngine()` before it hands the
 * config to the pipeline", and add `livingContentLaw.js` to the excision list.
 * BOTH HALVES OF THAT PREDICTION WERE MEASURED WRONG, and they are recorded here
 * so the next reader inherits the measurement rather than the guess:
 *
 *   1. THE LANE DOES NOT AWAIT `loadEngine()`. That memoized loader lives in
 *      `settlementSlice.js` and serves `regenSection`. The generation lane calls
 *      `runGeneration` and reaches the core through its own dynamic import of
 *      `src/workers/generationRequest.js`. There was no engine await to hang a
 *      mint on.
 *   2. THE EXCISION ROW WOULD HAVE BEEN INERT. `ENGINE_SHARED_DOMAIN` is seeded
 *      from `src/generators` only and has 68 members; `livingContentLaw.js` is
 *      not one of them (the seam reaches the law through a dynamic import that
 *      neither vite derivation follows). Adding it to the excision list is a
 *      `.delete()` of a non-member.
 *
 * What was actually true is that this module's ONLY eager edge was that one
 * `birthConfig` re-export, for a leaf whose two real callers are both lazy. The
 * re-export was cut; the entry's static closure went 239 modules -> 238, this
 * file left it, and NO EMITTED DIST FILE CHANGED SIZE. The law's
 * import is now a lazy -> lazy edge and the mint stays in `birthConfig` where
 * one function still answers "which law does a birth mint".
 *
 * ⚠ THAT SENTENCE USED TO READ "every emitted dist file stayed byte-identical",
 * AND IT WAS FALSE — corrected at §912 (DEF-10). Re-measured across the two
 * builds: of 1,377 emitted files, 719 are byte-identical and 658 are NOT (311
 * HTML + 347 JS), because the entry chunk's content hash moves and every file
 * naming it is re-hashed. What no file did was change SIZE, which is the claim
 * the byte objection actually needed. The same wrong sentence is in the
 * `442c7f988` commit message, which cannot be amended now the register was taken;
 * the correction lives here and in the lane receipt.
 *
 * ⛔ THE MINT'S NAME IS A STRING FIELD, NEVER THE OBJECT KEY, AND A PLANT IS WHY.
 * Keying this table by the mint's identifier read beautifully and BROKE THE
 * WALKER AGAINST ITSELF: an identifier used as an object key is, to a source
 * scan, indistinguishable from a call site, so the row declaring the
 * living-content law UNWIRED was itself convicted as this module naming that
 * law's mint. A declaration must not be spelled the way the thing it declares
 * is spelled. The mint lives in `mint`, as a string the scan strips.
 *
 * @type {Readonly<Record<string, {mint: string, module: string, dial: string, configKey: string, wiring: string, why: string}>>}
 */
export const GENERATION_LAWS = Object.freeze({
  density: Object.freeze({
    mint: 'newSettlementDensityLaw',
    module: 'src/domain/density/densityLaw.js',
    dial: 'NEW_SETTLEMENT_DENSITY_LAW_VERSION',
    configKey: '_densityLawVersion',
    wiring: 'WIRED',
    why: 'the write law this boundary was built for: birthConfig spreads its mint, so every '
      + 'classified BIRTH mints it and no PREVIEW or re-derivation can. Its module is already '
      + 'inside the first-paint closure, so the edge costs nothing.',
  }),
  livingContent: Object.freeze({
    mint: 'newSettlementLivingContentLaw',
    module: 'src/domain/content/livingContentLaw.js',
    dial: 'NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION',
    configKey: '_livingContentLawVersion',
    wiring: 'WIRED',
    why: 'birthConfig spreads its mint beside the density one, so every classified BIRTH mints '
      + 'it and no PREVIEW or re-derivation can. THE EDGE COSTS ZERO FIRST-PAINT BYTES, and '
      + 'that is a two-build measurement rather than a claim: the byte objection this row used '
      + 'to record was that THIS module was eager, and it was eager only through a birthConfig '
      + 're-export in an eager store leaf whose two real callers are both lazy. Cutting that '
      + 're-export took the entry closure 239 modules to 238 and this file out of it, with no '
      + 'emitted dist file changing SIZE (658 of 1,377 changed BYTES: the entry chunk\'s hash '
      + 'moves and every file naming it is re-hashed; the earlier "byte-identical" wording here '
      + 'was wrong and was corrected in the same car that measured it), so the law rides the '
      + 'lazy side with its callers and neither living-content module enters first paint. THE '
      + 'DIAL IS LIT since 2026-09-08 (owner), so the mint writes exactly one config key on '
      + 'every classified BIRTH and no other byte of the world moves with it: measured on the '
      + 'golden 525 and the RATE 768, zero movers. This row read "the dial stays at the dormant '
      + 'default, so the mint still writes not one config byte" until that day.',
  }),
});
