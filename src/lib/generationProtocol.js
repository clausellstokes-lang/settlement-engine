/**
 * generationProtocol.js — the typed, closed protocol for off-thread generation.
 *
 * A ZERO-IMPORT leaf, the `customContentPreviewProtocol.js` idiom: both sides of
 * the boundary (the main-thread client and the worker shell) verify the same
 * frozen values, so a stale cached worker script can never have its answer read
 * as a current one merely because the request id happens to match.
 *
 * ⭐ WHAT THIS PROTOCOL FORBIDS, AND WHY EACH BAN IS STRUCTURAL
 *
 *   NO FUNCTION CROSSES. The store action's `onStep`/`onComplete` callbacks do
 *   not travel; they become the `generation.step` event and the `generation.result`
 *   packet. A function reaching `postMessage` is a DataCloneError at run time and
 *   a fork in the design: the in-thread path would have kept a live reference
 *   where the worker path could not.
 *
 *   NO WALL CLOCK CROSSES. `pipelineHistory[].ts` is stamped by the RECEIVER on
 *   the main thread at message receipt. `src/workers/**` sits under the FULL
 *   determinism ban (eslint no-restricted-syntax), so the worker files may not
 *   read `Date.now()` at all, and the same core running in-thread must therefore
 *   produce the same rows either way.
 *
 *   NO STORE CROSSES. The request carries `customContent` explicitly, so the
 *   pipeline takes its per-run branch and never consults the boot-wired global
 *   getter. This is the advance worker's dedicated-protocol-field law.
 *
 *   ONE REQUEST PER WORKER INSTANCE, and deliberately NO cancel packet: a
 *   synchronous pipeline cannot be interrupted by a message, only by terminate().
 *
 * FINITE SEMANTICS: every vocabulary below is a closed, frozen list. A code is
 * read as a fact; the human `message` beside it never is.
 */

/**
 * The contract sentinel. Both sides verify it; a differing value means a stale
 * cached worker script and REJECTS (a retry would fetch the same script).
 */
export const GENERATION_WORKER_CONTRACT = 'settlementforge:generation:worker-v1';

/** The protocol version carried on every request. */
export const GENERATION_PROTOCOL_VERSION = 1;

/** The one request kind this transport accepts. */
export const GENERATION_REQUEST_KIND = 'generation.request';

/** The three packet kinds the worker may post back. */
export const GENERATION_STEP_KIND = 'generation.step';
export const GENERATION_RESULT_KIND = 'generation.result';
export const GENERATION_ERROR_KIND = 'generation.error';

/**
 * The closed operation vocabulary. Car 1 ships exactly one; the instant-world
 * and regen ops are separate cars and each adds its member here and its case in
 * the core, never a second core.
 * @type {ReadonlyArray<string>}
 */
export const GENERATION_OPS = Object.freeze(['settlement']);

/**
 * The closed error vocabulary.
 *
 *   pipeline_threw     — the generation itself threw. The in-thread path would
 *                        throw identically, so this REJECTS and never retries.
 *   protocol_mismatch  — a packet whose contract sentinel differs. REJECTS: a
 *                        retry hits the same stale script.
 *   request_invalid    — the shell refused the envelope (kind, version or op).
 *   cancelled          — an AbortSignal fired; the worker was terminated.
 *
 * @type {ReadonlyArray<string>}
 */
export const GENERATION_ERROR_CODES = Object.freeze([
  'pipeline_threw',
  'protocol_mismatch',
  'request_invalid',
  'cancelled',
]);

/**
 * The closed transport-outcome vocabulary reported beside every result, so a
 * caller (and a test) can tell WHICH path produced the world without inferring
 * it. The four in-thread outcomes are all byte-identical runs of the same core.
 * @type {ReadonlyArray<string>}
 */
export const TRANSPORT_OUTCOMES = Object.freeze([
  'worker',
  'in-thread:flag-off',
  'in-thread:no-worker',
  'in-thread:construct-failed',
  'in-thread:transport-failed',
]);

/**
 * Per-STEP liveness watchdog, re-armed on every step event. NOT a total-run
 * deadline: a legitimately long pipeline that keeps emitting steps never trips
 * it, and only a genuinely wedged worker does.
 */
export const GENERATION_STEP_WATCHDOG_MS = 30000;

/**
 * Envelope validation, shared by the shell (which refuses) and the tests (which
 * pin the refusal). Pure, allocation-free, no imports.
 *
 * @param {any} request the raw `event.data` a worker received
 * @returns {boolean} true when the envelope is a request this protocol accepts
 */
export function isValidGenerationRequest(request) {
  if (request == null || typeof request !== 'object') return false;
  if (request.kind !== GENERATION_REQUEST_KIND) return false;
  if (request.v !== GENERATION_PROTOCOL_VERSION) return false;
  return GENERATION_OPS.includes(request.op);
}
