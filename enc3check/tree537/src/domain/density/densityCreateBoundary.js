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
