/**
 * Worker boundary for the custom-content taste gate.
 *
 * The generator and its catalogs stay out of the Surveyor/Compendium chunks.
 * Each request is isolated and returns JSON only; the worker never imports the
 * store, persistence services, or a provider client.
 */

import { forgeContentSample } from '../domain/content/contentSamplePreview.js';
import { generateSettlementPipeline } from '../generators/generateSettlementPipeline.js';
import {
  CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT,
} from '../lib/customContentPreviewProtocol.js';

self.onmessage = (event) => {
  const requestId = event?.data?.requestId;
  try {
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
