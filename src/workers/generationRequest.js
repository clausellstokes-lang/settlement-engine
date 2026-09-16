/**
 * generationRequest.js — THE ONE CORE of off-thread generation.
 *
 * ⭐ ONE CODE PATH, TWO TRANSPORTS. The Web Worker shell
 * (`generation.worker.js`) and the main-thread fallback in
 * `lib/generationClient.js` both call THIS function. There is no second
 * implementation to drift: a worker run and an in-thread run differ only in
 * which thread evaluates the identical module over identical cloned inputs.
 *
 * ⛔ WHY THIS FILE LIVES UNDER src/workers/ AND NOT src/lib/. Three existing
 * laws cover this directory by construction and would each need a new,
 * separately-maintained rule elsewhere:
 *   • the FULL determinism ban (eslint `src/workers/**`: no Math.random, no
 *     new Date(), no Date.now(), no locale collation or locale formatting, plus
 *     the transcendental ban) — the guard against a worker-vs-main byte fork;
 *   • the transcendental-site census, whose trees include src/workers;
 *   • the writer-without-reader walker's STOP set, which contains src/workers,
 *     so an executor that reads no settlement field cannot be mistaken for one.
 * It must also NOT live under src/generators/, whose vite manualChunks rule
 * would route it into the byte-ratcheted `engine` chunk.
 *
 * PURITY CONTRACT, enforced by the directory's rules and by the shape below:
 * synchronous, pure over its inputs, no store, no persistence, no DOM global,
 * no wall clock, no ambient entropy. It never dereferences a settlement FIELD
 * (it hands whole objects to the pipeline and the carry and returns them), so
 * it adds nothing to the observed-shape reader population.
 *
 * THE BOUNDARY IS MADE EXPLICIT ON BOTH PATHS: the first act is
 * `structuredClone(request)`. In the worker that clone has already happened at
 * postMessage; doing it here too costs one clone and buys the guarantee that
 * the in-thread path cannot accidentally retain a live reference the worker
 * path could never have had. That is the difference between a fallback and a
 * fork.
 */

import { generateSettlementPipeline, carryLockedRosterThroughGenerate } from '../generators/generateSettlementPipeline.js';
import { metaForStep } from '../generators/steps/stepMetadata.js';
import {
  GENERATION_OPS,
  GENERATION_STEP_KIND,
  GENERATION_WORKER_CONTRACT,
} from '../lib/generationProtocol.js';

/**
 * Run one generation request and emit its typed step events.
 *
 * @param {{op: string, requestId: any, payload: any}} request the plain-data request
 * @param {(event: any) => void} [emit] receives one `generation.step` packet per step
 * @returns {{settlement: any, preservation: any, pipelineHistory: Array<{id: string, summary: any}>, resolvedConfig: any}}
 */
export function runGenerationRequest(request, emit) {
  const cloned = structuredClone(request);
  const { op, requestId, payload } = cloned || {};
  if (!GENERATION_OPS.includes(op)) {
    throw Object.assign(
      new Error(`Unknown generation op: ${String(op)}`),
      { code: 'request_invalid' },
    );
  }
  return runSettlementOp(requestId, payload || {}, emit);
}

/**
 * The `settlement` op — the store's generate action's phase B, verbatim in
 * behaviour and with the callbacks turned into typed events.
 *
 * ⭐ IDENTITY WITH THE ONE GENERATION ENTRY. With `previousSettlement` null and
 * no locks, `carryLockedRosterThroughGenerate` returns the fresh settlement
 * untouched, so the value this returns is the direct
 * `generateSettlementPipeline(...)` result. The headless runners (soak, the
 * golden master, the OSR corpus) and this core are therefore the SAME path by
 * construction rather than by agreement.
 *
 * @param {any} requestId correlation id echoed on every emitted packet
 * @param {any} payload {fullConfig, neighbour, seed, contentRuntime, previousSettlement, locks}
 * @param {(event: any) => void} [emit] step sink
 */
function runSettlementOp(requestId, payload, emit) {
  const {
    fullConfig,
    neighbour = null,
    seed,
    contentRuntime = {},
    previousSettlement = null,
    locks = null,
  } = payload;

  /** @type {Array<{id: string, summary: any}>} */
  const pipelineHistory = [];

  // The per-step summary is minted WHERE THE CONTEXT LIVES. stepMetadata's
  // summaries read function-bearing members of the generation context (world-law
  // closures among them) that could never cross a postMessage boundary, so the
  // string is computed here and only the string travels. Summary failures are
  // tolerated exactly as the store action tolerated them: a null summary, never
  // a failed run.
  const onStep = (name, ctx) => {
    const meta = metaForStep(name);
    let summary;
    try { summary = meta.summary ? meta.summary(ctx) : null; }
    catch { summary = null; }
    const index = pipelineHistory.length;
    pipelineHistory.push({ id: name, summary });
    emit?.({
      kind: GENERATION_STEP_KIND,
      requestId,
      workerContract: GENERATION_WORKER_CONTRACT,
      step: { id: name, index, summary },
    });
  };

  const fresh = generateSettlementPipeline(fullConfig, neighbour, {
    seed,
    ...contentRuntime,
    onStep,
  });

  // The locked-roster carry runs INSIDE the core rather than on the main thread:
  // it lives in the pipeline module, so leaving it outside would make every
  // first generate fetch the engine chunk on main and the worker would ADD a
  // bundle instead of replacing one. Its inputs and its out-of-band report are
  // plain data.
  const { settlement, _preservation = null } = carryLockedRosterThroughGenerate(
    previousSettlement,
    fresh,
    locks,
  );

  return {
    settlement,
    preservation: _preservation,
    pipelineHistory,
    // The config AFTER the run, returned rather than read back off a reference
    // the caller happens to still hold. On the worker path the caller's copy is
    // in another thread; returning it is what makes the two paths' analytics
    // read the same value instead of differing by transport.
    resolvedConfig: fullConfig,
  };
}
