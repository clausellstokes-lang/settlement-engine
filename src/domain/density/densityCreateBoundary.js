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

/**
 * How a module that can reach `generateSettlementPipeline` is classified.
 *
 *   BIRTH   — mints a genuinely new world; MUST spread `birthConfig`.
 *   DERIVED — re-derives an EXISTING world; must never mint (the world's own
 *             persisted config already carries its law, or its markerless
 *             absence IS its law).
 *   PREVIEW — generates a throwaway for comparison/diagnostics that is never
 *             persisted as a world; must never mint, because a preview that
 *             minted would make previews and reality disagree.
 *
 * @type {ReadonlyArray<string>}
 */
export const BOUNDARY_CLASSES = Object.freeze(['BIRTH', 'DERIVED', 'PREVIEW']);

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
 * @type {Readonly<Record<string, {class: string, why: string}>>}
 */
export const PIPELINE_REACHERS = Object.freeze({
  'src/store/settlementSlice.js': Object.freeze({
    class: 'BIRTH',
    why: 'generateSettlement mints a brand-new town from the wizard form config on every '
      + 'call; a reroll REPLACES the town rather than re-deriving it, and with a save on '
      + 'screen it explicitly mints a new identity. state.config is never hydrated from a '
      + 'saved settlement, so fullConfig cannot carry an existing world\'s law.',
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
 * Spread this into the config a BIRTH hands the pipeline. While the dial sits at
 * the dormant default `newSettlementDensityLaw()` returns an EMPTY object, so
 * this spreads NOTHING and a birth's config is byte-identical to one taken
 * before the law existed — which is why the call sites can land now, dormant and
 * proved, and the flip stays the one line it is advertised to be.
 *
 * @template {Record<string, unknown>} C
 * @param {C} config the config a birth is about to generate from
 * @returns {C} the same shape, carrying the law a NEW world is born under
 */
export function birthConfig(config) {
  return /** @type {C} */ ({ ...(config || {}), ...newSettlementDensityLaw() });
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
 *   living content `newSettlementLivingContentLaw()`  NO CALLER ANYWHERE
 *
 * ⛔ AND THE WALKER COULD NOT SEE THE DIFFERENCE. Its `MINT_SYMBOLS` names the
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
 * ════════════════════════════════════════════════════════════════════════════
 * ⛔⛔ WHY THE LIVING-CONTENT LAW IS UNWIRED, AND IT IS A MEASUREMENT
 * ════════════════════════════════════════════════════════════════════════════
 *
 * NOT because the create boundary is missing — that is the stale reading this
 * car retired, and `livingContentLaw.js` carried it in prose until this commit.
 * The boundary is here, it is wired, and it is walked. The reason is BYTES, and
 * it is executable rather than argued:
 *
 *   1. THIS MODULE IS EAGER. `src/main.jsx`'s static closure is 237 modules and
 *      this file is one of them (store/index -> settlementSlice ->
 *      settlementSliceHelpers -> here). Its density import is free because
 *      `densityLaw.js` is already in that closure.
 *   2. THE LIVING-CONTENT LAW IS NOT, ON PURPOSE. `livingContentLaw.js` and the
 *      leaf behind it, `livingContentLawVersion.js`, are BOTH outside the
 *      237-module closure, and `vite.config.js` lists the leaf in
 *      `ENGINE_SHARED_DOMAIN_EXCISIONS` — excised and deliberately UNPINNED —
 *      on the stated ground that "no first-paint module reaches it either, so
 *      that would be first-paint bytes paid for nothing". The excision's own
 *      note measures the alternative at engine-core +214 B with 112 chunks
 *      re-hashed.
 *   3. SO A STATIC IMPORT FROM HERE IS A HARD RED, WITH NO BUILD REQUIRED.
 *      Adding it puts exactly those two modules into the first-paint closure,
 *      and `tests/build/engineChunkLazy.test.js`'s orphan-excision arm — "every
 *      excised module the first paint reaches is PLACED by manualChunks" —
 *      convicts an unpinned excision the moment first paint reaches it.
 *
 * ⭐ WHAT THE WIRING CAR THEREFORE HAS TO DO, SO IT IS NOT REDISCOVERED. The
 * mint has to happen on the LAZY side of a boundary the birth caller already
 * crosses. The store's generation lane already awaits `loadEngine()` before it
 * hands the config to the pipeline, so the engine surface is the one place a
 * birth can mint this law without touching first paint — and that move needs
 * `livingContentLaw.js` added to `ENGINE_SHARED_DOMAIN_EXCISIONS` beside the
 * leaf, plus the hashed-chunk listing diff to prove it free. That is a build,
 * which is why this car declares the gap instead of taking it.
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
    wiring: 'UNWIRED',
    why: 'a real generation law with a dormant dial and no birth caller. It stays unwired for a '
      + 'MEASURED reason and not a missing one: this module is eager and both living-content '
      + 'modules are deliberately outside the first-paint closure, with the leaf excised and '
      + 'unpinned in vite.config.js, so a static import from here makes an unpinned excision '
      + 'first-paint reachable and engineChunkLazy convicts it. The mint belongs on the lazy '
      + 'engine side the birth caller already awaits; see this module header.',
  }),
});
