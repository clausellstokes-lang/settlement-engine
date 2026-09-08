/**
 * generation.worker.js — the Web Worker shell for settlement generation.
 *
 * Forty lines of transport. Every decision that could move a byte of the world
 * lives in `generationRequest.js`, which this file and the main-thread fallback
 * both call, so there is one code path and no second implementation to drift.
 *
 * The shell refuses an envelope it does not recognise rather than guessing: a
 * wrong kind, a wrong protocol version or an op outside the closed vocabulary
 * all answer `request_invalid`. A stale cached worker script is caught on the
 * other side by the contract sentinel every packet carries.
 *
 * Never imports the store, a persistence service, a provider client or a DOM
 * global; the world travels OUT to the main thread and the save never crosses.
 */

import { runGenerationRequest } from './generationRequest.js';
import {
  GENERATION_ERROR_KIND,
  GENERATION_RESULT_KIND,
  GENERATION_WORKER_CONTRACT,
  isValidGenerationRequest,
} from '../lib/generationProtocol.js';

self.onmessage = (event) => {
  const request = event?.data;
  const requestId = request?.requestId;
  const post = (packet) => self.postMessage({ ...packet, workerContract: GENERATION_WORKER_CONTRACT });

  if (!isValidGenerationRequest(request)) {
    post({
      kind: GENERATION_ERROR_KIND,
      requestId,
      code: 'request_invalid',
      message: 'The generation request envelope was refused: unknown kind, version or op.',
    });
    return;
  }

  // Tracked so a failure can say WHERE it failed. The reader-facing consequence
  // is an error that can name the step it died on instead of a bare apology.
  let lastStepId = null;
  try {
    const result = runGenerationRequest(request, (stepEvent) => {
      lastStepId = stepEvent?.step?.id ?? lastStepId;
      post(stepEvent);
    });
    post({ kind: GENERATION_RESULT_KIND, requestId, result });
  } catch (error) {
    post({
      kind: GENERATION_ERROR_KIND,
      requestId,
      code: 'pipeline_threw',
      stepId: lastStepId,
      message: error instanceof Error ? error.message : 'The generation failed inside the worker.',
      stack: error instanceof Error ? error.stack : null,
    });
  }
};
