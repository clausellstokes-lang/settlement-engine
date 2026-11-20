/**
 * src/engine/serviceEntry.js — THE ENGINE SERVICE'S ONE ENTRY (ENGINE-1, unit 1).
 *
 * `scripts/build-edge-shared.mjs` bundles this module (and everything it reaches)
 * into `supabase/functions/_shared/engineBundle.js`, which the `engine-generate`
 * edge function imports. The bundle's content hash is the service's
 * `engineVersion` (recorded in `engineBundle.meta.json`).
 *
 * ⛔ THIS FILE IS A RE-EXPORT LIST AND NOTHING ELSE. Every name below is the SAME
 * binding the app generates with, so a settlement the service returns is the
 * settlement the in-process pipeline returns, byte for byte
 * (`tests/build/engineBundleReplay.test.js` proves it over the golden master's
 * 525 configurations). Wrapping, defaulting or re-ordering anything here would
 * make the service a second engine; that is what this module exists to prevent.
 *
 * ⛔ NOTHING IN THE CLIENT IMPORTS THIS FILE. It lives outside every Vite entry's
 * static closure (`tests/build/vendorPdfLazy.test.js`,
 * `tests/build/generationWorkerLazy.test.js`), and it must stay that way: it
 * exists only to be the bundler's entry point.
 *
 * Exports:
 *   - generateSettlementPipeline  — the generator itself
 *                                   (`src/generators/generateSettlementPipeline.js`).
 *   - birthConfig                 — the create boundary's synchronous half: the laws
 *                                   a NEW world is born under
 *                                   (`src/domain/density/densityCreateBoundary.js`).
 *   - loadGenerationLawPayloads   — the create boundary's async half: awaited before
 *                                   any generation that may meet a lit config (same
 *                                   module). esbuild inlines the seam's dynamic
 *                                   `import(` into the bundle, so in the service it
 *                                   resolves without a fetch.
 *   - runGenerationRequest        — THE ONE CORE the Web Worker and the in-thread
 *                                   fallback run (`src/workers/generationRequest.js`):
 *                                   the pipeline plus the per-step summaries the
 *                                   reveal plays back, so the service's reply carries
 *                                   the same `pipelineHistory` the worker posts
 *                                   (ENGINE-2 unit 1, the `remote` transport).
 *   - getStepMeta                 — the pipeline step registry's metadata
 *                                   (`src/generators/pipeline.js`), the rows the DM
 *                                   layer's re-derivation builds its pins bag from;
 *                                   engine-generate's `stepMeta` op answers it
 *                                   (ENGINE-4 unit 1).
 *   - regenNPCsPipeline /         — the two section-regeneration passes
 *     regenHistoryPipeline          (`src/generators/generateSettlementPipeline.js`)
 *                                   that `src/store/settlementRegenAction.js` calls
 *                                   locally; engine-generate's `regenSection` op runs
 *                                   them for a build that carries no engine
 *                                   (ENGINE-5 unit 1).
 *
 *   - VANILLA_CONTENT_ENVIRONMENT — the built-in content environment's identity
 *                                   (`src/domain/content/contentEnvironmentDefaults.js`,
 *                                   a constants leaf with no imports), the very value the
 *                                   store stamps every standalone generation with
 *                                   (`customContentSlice.js :: getActiveCustomContentRuntime`).
 *                                   engine-generate hands its birth the same standalone
 *                                   provenance, so the pipeline writes the SAME
 *                                   `customContentProvenance` on both sides (remote-path
 *                                   R2, 2026-11-10). A constant, not a wrapper.
 *
 * ⚠ RESERVED SLOT — THE ADVANCE ENTRY (not implemented). The engine service's
 * second operation, advancing an existing settlement through time, will be
 * re-exported HERE under the name `advanceSettlement` when its lane lands, from
 * the module the app's own advance action calls, by the same rule: the app's
 * binding, unwrapped. Until then the name is deliberately absent, so a function
 * that imports it fails `deno check` instead of shipping a stub.
 */

export {
  generateSettlementPipeline,
  regenHistoryPipeline,
  regenNPCsPipeline,
} from '../generators/generateSettlementPipeline.js';
export { birthConfig, loadGenerationLawPayloads } from '../domain/density/densityCreateBoundary.js';
export { runGenerationRequest } from '../workers/generationRequest.js';
export { getStepMeta } from '../generators/pipeline.js';
export { VANILLA_CONTENT_ENVIRONMENT } from '../domain/content/contentEnvironmentDefaults.js';
