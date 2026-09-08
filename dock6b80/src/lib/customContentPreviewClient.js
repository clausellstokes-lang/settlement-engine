/**
 * customContentPreviewClient.js — cancellable worker transport for the custom
 * content sample forge. Dynamically imported only after the author asks for a
 * sample, preserving both first paint and the lightweight inspect stage.
 */

import {
  CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT,
} from './customContentPreviewProtocol.js';

export { CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT };

let sequence = 0;
const DEFAULT_PREVIEW_TIMEOUT_MS = 30_000;

function defaultWorkerFactory() {
  return new Worker(
    new URL('../workers/customContentPreview.worker.js', import.meta.url),
    { type: 'module', name: 'settlementforge-content-preview' },
  );
}

/**
 * @param {object} request
 * @param {{
 *   signal?:AbortSignal,
 *   timeoutMs?:number,
 *   workerFactory?:()=>Worker,
 * }} [options]
 */
export function runCustomContentPreview(request, options = {}) {
  const workerFactory = options.workerFactory || defaultWorkerFactory;
  const requestId = `content-preview-${++sequence}`;
  const timeoutMs = Number.isFinite(options.timeoutMs)
    ? Math.max(1, Math.trunc(options.timeoutMs))
    : DEFAULT_PREVIEW_TIMEOUT_MS;

  return new Promise((resolve, reject) => {
    /** @type {Worker|null} */
    let worker = null;
    let watchdog = null;
    let settled = false;

    const cleanup = () => {
      if (watchdog != null) clearTimeout(watchdog);
      options.signal?.removeEventListener('abort', onAbort);
      worker?.terminate?.();
    };
    const settle = (mode, value) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (mode === 'resolve') resolve(value);
      else reject(value);
    };
    const onAbort = () => {
      settle(
        'reject',
        new DOMException('Preview cancelled', 'AbortError'),
      );
    };

    if (options.signal?.aborted) {
      onAbort();
      return;
    }
    try {
      worker = workerFactory();
    } catch (error) {
      settle('reject', error);
      return;
    }
    if (!worker) {
      settle('reject', new Error('The sample-settlement worker is unavailable.'));
      return;
    }

    options.signal?.addEventListener('abort', onAbort, { once: true });
    worker.onerror = () => {
      settle('reject', new Error('The sample-settlement worker failed.'));
    };
    worker.onmessageerror = () => {
      settle(
        'reject',
        new Error('The sample-settlement worker returned an unreadable response.'),
      );
    };
    worker.onmessage = (event) => {
      const packet = event?.data;
      if (packet?.requestId !== requestId) return;
      if (packet.workerContract !== CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT) {
        settle(
          'reject',
          new Error('The sample-settlement worker protocol is out of date.'),
        );
        return;
      }
      if (packet.ok === true) {
        settle('resolve', packet.result);
        return;
      }
      settle(
        'reject',
        new Error(packet.error || 'The sample settlement could not be forged.'),
      );
    };
    watchdog = setTimeout(() => {
      settle('reject', new Error('The sample settlement timed out.'));
    }, timeoutMs);
    try {
      worker.postMessage({ requestId, request });
    } catch (error) {
      settle('reject', error);
    }
  });
}
