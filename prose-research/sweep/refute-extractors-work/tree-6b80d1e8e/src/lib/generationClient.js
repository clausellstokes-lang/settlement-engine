/**
 * generationClient.js — the main-thread transport for settlement generation.
 *
 * The advance-worker client's idiom, with the two departures this boundary
 * needs stated rather than inherited silently.
 *
 * FAILURE TAXONOMY — a PIPELINE throw and a TRANSPORT failure are not the same
 * event, and conflating them would either hide a real defect or burn the work
 * twice:
 *   • PIPELINE throw: the worker caught the exception and posted
 *     `generation.error`. The in-thread path would throw identically, so this
 *     REJECTS with the typed code and the step it died on.
 *   • TRANSPORT failure: onerror (worker script or module error), onmessageerror
 *     (an un-cloneable message) or the per-step liveness watchdog. These are
 *     infrastructural and the byte-identical in-thread path would have
 *     completed, so it runs ONCE in-thread rather than failing the generation.
 *
 * TWO DELIBERATE DEPARTURES FROM THE ADVANCE CLIENT:
 *   (a) a request-side clone failure REJECTS rather than falling back. An
 *       un-cloneable request means a function or a class instance reached the
 *       boundary, which is a defect in the request shape; hiding it behind the
 *       in-thread path would be a false green that ships.
 *   (b) `protocol_mismatch` REJECTS rather than falling back. A retry would
 *       fetch the same stale cached script and mismatch again.
 *
 * DELIBERATELY HAS NO IMPORT OF THE CORE, static or dynamic — the wire-lean
 * law. The caller supplies `fallback`, so on the happy path the main thread
 * never fetches the engine chunk at all; only a fallback pays for it.
 *
 * This module reads ONLY protocol-envelope keys (kind, requestId,
 * workerContract, step, result, error). It never dereferences a settlement
 * field, so it joins no reader population.
 */

import {
  GENERATION_ERROR_KIND,
  GENERATION_RESULT_KIND,
  GENERATION_STEP_KIND,
  GENERATION_STEP_WATCHDOG_MS,
  GENERATION_WORKER_CONTRACT,
} from './generationProtocol.js';

/** The abort rejection, minted the same way on every cancel path. */
function cancelledError() {
  const message = 'Generation cancelled';
  if (typeof DOMException === 'function') return new DOMException(message, 'AbortError');
  return Object.assign(new Error(message), { name: 'AbortError', code: 'cancelled' });
}

/** The default transport: one worker per request, terminated on every settle path. */
function defaultWorkerFactory() {
  return new Worker(new URL('../workers/generation.worker.js', import.meta.url), { type: 'module' });
}

/**
 * Run one generation request off the main thread, or in-thread when the flag is
 * off, no Worker exists, construction fails, or the transport breaks mid-run.
 *
 * @param {any} request the plain-data protocol request
 * @param {{
 *   flagOn?: boolean,
 *   fallback: (request: any, onStep?: (step: any) => void) => (Promise<any>|any),
 *   onStep?: (step: any) => void,
 *   signal?: {aborted?: boolean, addEventListener?: Function, removeEventListener?: Function},
 *   workerFactory?: () => any,
 * }} opts
 * @returns {Promise<{result: any, outcome: string}>}
 */
export async function runGeneration(request, {
  flagOn,
  fallback,
  onStep,
  signal,
  workerFactory = defaultWorkerFactory,
} = /** @type {any} */ ({})) {
  const inThread = async (outcome) => ({ result: await fallback(request, onStep), outcome });

  if (signal?.aborted) throw cancelledError();
  if (!flagOn) return inThread('in-thread:flag-off');
  // The `Worker` probe asks whether the DEFAULT transport can exist (Node /
  // vitest / SSR have no Worker constructor). It must not veto a transport the
  // caller INJECTED: `workerFactory` is the seam a pooled or headless transport
  // arrives through, and a probe that silently ignored the injected factory
  // would let a test believe it exercised the worker path while it ran
  // in-thread — a false green that reports the wrong path as proven.
  if (workerFactory === defaultWorkerFactory && typeof Worker === 'undefined') {
    return inThread('in-thread:no-worker');
  }

  let worker;
  try {
    worker = workerFactory();
  } catch {
    worker = null;
  }
  if (!worker) return inThread('in-thread:construct-failed');

  return new Promise((resolve, reject) => {
    let watchdog;
    let settled = false; // one-shot latch — a late packet cannot double-settle
    let onAbort;

    const cleanup = () => {
      clearTimeout(watchdog);
      if (onAbort) { try { signal?.removeEventListener?.('abort', onAbort); } catch { /* detached */ } }
      try { worker.terminate(); } catch { /* already gone */ }
    };
    const succeed = (result) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ result, outcome: 'worker' });
    };
    const fail = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    // Infrastructural failure only. The in-thread run emits every step again;
    // the caller discards relayed rows and takes the list off the result packet,
    // so a mid-run failure cannot commit a doubled history.
    const failTransport = () => {
      if (settled) return;
      settled = true;
      cleanup();
      Promise.resolve()
        .then(() => fallback(request, onStep))
        .then(result => resolve({ result, outcome: 'in-thread:transport-failed' }), reject);
    };
    const arm = () => {
      clearTimeout(watchdog);
      watchdog = setTimeout(failTransport, GENERATION_STEP_WATCHDOG_MS);
    };

    worker.onmessage = (event) => {
      if (settled) return;
      const packet = event?.data || {};
      if (packet.requestId !== request?.requestId) return; // a foreign or late packet
      if (packet.workerContract !== GENERATION_WORKER_CONTRACT) {
        return fail(Object.assign(
          new Error('The generation worker answered under a different protocol contract.'),
          { code: 'protocol_mismatch' },
        ));
      }
      if (packet.kind === GENERATION_STEP_KIND) {
        arm(); // a step landed — the worker is alive
        onStep?.(packet.step);
        return;
      }
      if (packet.kind === GENERATION_RESULT_KIND) return succeed(packet.result);
      if (packet.kind === GENERATION_ERROR_KIND) {
        return fail(Object.assign(
          new Error(packet.message || 'The generation failed.'),
          { code: packet.code, stepId: packet.stepId ?? null, workerStack: packet.stack ?? null },
        ));
      }
    };
    worker.onerror = failTransport;
    worker.onmessageerror = failTransport;

    if (signal) {
      onAbort = () => fail(cancelledError());
      try { signal.addEventListener?.('abort', onAbort); } catch { /* no listener support */ }
    }

    arm();
    try {
      worker.postMessage(request);
    } catch (error) {
      // (a) above: an un-cloneable request is a defect in the request, not a
      // transport hiccup. Surfacing it is the whole point.
      fail(Object.assign(
        error instanceof Error ? error : new Error('The generation request could not be posted.'),
        { code: 'request_invalid' },
      ));
    }
  });
}
