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
// ⭐ THE LAZY PAYLOAD, ARMED ON THIS SIDE OF THE TRANSPORT. The store's lane
// arms it too, and that is not a duplicate: a Web Worker evaluates its OWN copy
// of the module graph, so the seam's registry here is a different slot from the
// main thread's and a main-thread load does not arm it. This is transport, and
// loading a payload the core needs is transport work.
//
// ⛔ AND IT IS THE SEAM'S LOADER, NOT THE CREATE BOUNDARY'S AGGREGATE, FOR A
// MEASURED REASON (lane LIGHT, car 3a). `loadGenerationLawPayloads()` lives on
// `densityCreateBoundary.js`, which nothing else in this worker's graph imports;
// routing through it drags that module into a transport bundle held under a
// MONOTONE-DOWN ceiling, and the worker gets nothing for the bytes because the
// seam is already in the graph (the pipeline calls `livingContentRosterFor`).
// The main-thread reachers keep the aggregate: they are where "which laws does
// this generation obey" is answered, and they pay no such ceiling.
//
// ⚠ THE SHORTCUT IS ONLY SOUND WHILE THE AGGREGATE IS THIS ONE LOADER, so it is
// not left to prose: `tests/lint/densityCreateBoundary.walker.test.js` declares
// the two worker rows in a table and REDS the moment
// `loadGenerationLawPayloads()` awaits a second payload the workers would miss.
import { loadLivingContentRoster } from '../domain/content/livingContentSeam.js';
import {
  GENERATION_ERROR_KIND,
  GENERATION_RESULT_KIND,
  GENERATION_WORKER_CONTRACT,
  isValidGenerationRequest,
} from '../lib/generationProtocol.js';

// ⚠ ASYNC, AND THE ONE AWAIT BELOW IS WHY. The handler stays a thin transport:
// it awaits the generation laws' lazy payloads INSIDE the existing try, so a
// load failure answers `pipeline_threw` with its message like every other
// failure rather than becoming an unhandled rejection the main thread waits out.
self.onmessage = async (event) => {
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
    await loadLivingContentRoster();
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
