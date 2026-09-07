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
 *      unknown keys. Nothing anywhere hydrates it from a saved settlement.
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
 * @type {Readonly<Record<string, {class: string, why: string, reachesVia?: string}>>}
 */
export const PIPELINE_REACHERS = Object.freeze({
  'src/store/settlementGenerateAction.js': Object.freeze({
    class: 'BIRTH',
    why: 'the generation lane mints a brand-new town from the wizard form config on every '
      + 'call; a reroll REPLACES the town rather than re-deriving it, and with a save on '
      + 'screen it explicitly mints a new identity. state.config is never hydrated from a '
      + 'saved settlement, so fullConfig cannot carry an existing world\'s law. It mints '
      + 'the law here on the main thread and sends it as request data; the executor named '
      + 'below is what actually calls the pipeline.',
    reachesVia: 'src/workers/generationRequest.js',
  }),
  'src/workers/generationRequest.js': Object.freeze({
    class: 'EXECUTOR',
    why: 'the generation core runs a request whose density law was already minted by the '
      + 'BIRTH caller that built it; minting again here would stamp a second law over a '
      + 'config that already carries one, and it would do so for every transport including '
      + 'the previews and re-derivations that must never mint at all.',
  }),
  'src/lib/instantWorld/composeInstantWorld.js': Object.freeze({
    class: 'BIRTH',
    why: 'the realm composer mints every member settlement from DEFAULT_CONFIG via '
      + 'memberConfigFor; there is no prior world in the call at all.',
  }),
  'src/components/surveyor/ConstructionPanel.jsx': Object.freeze({
    class: 'PREVIEW',
    why: 'generates a dossier only to compare it against the surveyor\'s construct '
      + 'constraints and report deviations; the result is not committed as a world.',
  }),
  'src/workers/customContentPreview.worker.js': Object.freeze({
    class: 'PREVIEW',
    why: 'renders a preview of what homebrew content would do to a generation; the '
      + 'output is shown, never persisted.',
  }),
  'src/store/campaignContentBindingSession.js': Object.freeze({
    class: 'PREVIEW',
    why: 'forges a SAME-SEED before/after sample so a content-binding change can be '
      + 'shown to the user; minting here would make the sample differ from the world it '
      + 'is meant to predict.',
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
 * @template {Record<string, unknown>} C
 * @param {C} config the config a birth is about to generate from
 * @returns {C} the same shape, carrying the laws a NEW world is born under
 */
export function birthConfig(config) {
  return /** @type {C} */ ({
    ...(config || {}),
    ...newSettlementDensityLaw(),
    ...newSettlementLivingContentLaw(),
  });
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
 * file left it, and every emitted dist file stayed byte-identical. The law's
 * import is now a lazy -> lazy edge and the mint stays in `birthConfig` where
 * one function still answers "which law does a birth mint".
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
      + 're-export took the entry closure 239 modules to 238 and this file out of it, with '
      + 'every emitted dist file byte-identical, so the law rides the lazy side with its '
      + 'callers and neither living-content module enters first paint. The dial stays at the '
      + 'dormant default, so the mint still writes not one config byte.',
  }),
});
