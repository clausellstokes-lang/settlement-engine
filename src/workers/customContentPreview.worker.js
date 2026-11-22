/**
 * Worker boundary for the custom-content taste gate.
 *
 * The generator and its catalogs stay out of the Surveyor/Compendium chunks.
 * Each request is isolated and returns JSON only; the worker never imports the
 * store, persistence services, or a provider client.
 */

import { forgeContentSample } from '../domain/content/contentSamplePreview.js';
import { generateSettlementPipeline } from '../generators/generateSettlementPipeline.js';
// The lazy payload. A PREVIEW never mints a law, but it can be handed a config
// that already carries one — the gate reads the WORLD'S config, not the build's
// dial — and the pipeline throws rather than degrading when the lazy payload
// behind that law was never loaded. A worker evaluates its own copy of the
// graph, so this side arms its own seam.
//
// ⛔ THE SEAM'S LOADER, NOT THE CREATE BOUNDARY'S AGGREGATE, for the reason
// `generation.worker.js` states at length (lane LIGHT, car 3a): the boundary is
// otherwise absent from a worker's graph and the seam is already in it, so the
// aggregate costs a worker bundle bytes it gets nothing for. The two worker rows
// are declared in `tests/lint/densityCreateBoundary.walker.test.js`, which reds
// if the aggregate ever grows a second payload these shells would miss.
import { loadLivingContentRoster } from '../domain/content/livingContentSeam.js';
import {
  CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT,
} from '../lib/customContentPreviewProtocol.js';

// ⚠ ASYNC for the one await below, which sits INSIDE the existing try so a load
// failure answers on the worker's own error channel rather than as an unhandled
// rejection.
self.onmessage = async (event) => {
  const requestId = event?.data?.requestId;
  try {
    await loadLivingContentRoster();
    const result = forgeContentSample(
      event?.data?.request || {},
      generateSettlementPipeline,
    );
    self.postMessage({
      requestId,
      ok: true,
      result,
      workerContract: CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT,
    });
  } catch (error) {
    self.postMessage({
      requestId,
      ok: false,
      workerContract: CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT,
      error: error instanceof Error
        ? error.message
        : 'The sample settlement could not be forged.',
    });
  }
};
