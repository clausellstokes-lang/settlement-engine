/**
 * Actual isolated-worker measurement for the maintained realm-scale evidence.
 *
 * This module launches a real Node worker thread, sends the production advance
 * message through structured clone, and waits for the product worker module's
 * real terminal result. It reports separately:
 *
 *   - the cold one-shot round trip observed by the parent thread;
 *   - the product handler's duration inside the worker isolate; and
 *   - the unattributed remainder around that handler.
 *
 * The remainder is intentionally NOT called "transport time": it also contains
 * module bootstrap, scheduling, structured-clone work, and message delivery.
 * Likewise, Node worker_threads evidence is never represented as a measurement
 * of the production browser's Web Worker implementation.
 */

import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import {
  isMainThread,
  threadId as currentThreadId,
  Worker,
} from 'node:worker_threads';

const NODE_WORKER_ADAPTER = new URL(
  './advance-interval-node-worker.mjs',
  import.meta.url,
);
const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;

const sha256 = value => createHash('sha256').update(value).digest('hex');
const milliseconds = value => (
  Number.isFinite(value) ? Number(value.toFixed(3)) : null
);

function jsonDescription(value) {
  const json = JSON.stringify(value);
  if (json === undefined) {
    throw new TypeError('Worker evidence requires a JSON-serializable message');
  }
  return {
    bytes: Buffer.byteLength(json),
    sha256: sha256(json),
  };
}

function progressDescription(detail) {
  if (!detail || typeof detail !== 'object') return null;
  return {
    ticksDone: Number(detail.ticksDone) || 0,
    ticksTotal: Number(detail.ticksTotal) || 0,
    interval: String(detail.interval || ''),
  };
}

/**
 * Run one production-shaped advance in a separate Node V8 isolate.
 *
 * The returned `result` is provided only so a caller can compare it with the
 * direct-domain result. Persist `evidence`, not the potentially large result.
 *
 * @param {Record<string, unknown>} payload
 * @param {{
 *   customContent?: Record<string, unknown>,
 *   timeoutMs?: number,
 * }} [options]
 * @returns {Promise<{
 *   result: unknown,
 *   evidence: Record<string, unknown>,
 * }>}
 */
export function measureIsolatedAdvanceWorker(
  payload,
  {
    customContent = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = {},
) {
  const request = { payload, customContent };
  const inputJson = jsonDescription(request);
  const constructionStartedAt = performance.now();
  const worker = new Worker(NODE_WORKER_ADAPTER, { type: 'module' });
  const constructedAt = performance.now();
  let onlineAt = null;
  let adapterReadyAt = null;
  let settled = false;
  let progressMessages = 0;
  let firstProgress = null;
  let lastProgress = null;
  const requestPostedAt = performance.now();

  return new Promise((resolvePromise, rejectPromise) => {
    const timeout = setTimeout(() => {
      finishWithError(new Error(
        `Isolated advance worker did not finish within ${timeoutMs}ms`,
      ));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timeout);
      void worker.terminate();
    };
    const finishWithError = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      rejectPromise(error);
    };

    worker.once('online', () => {
      onlineAt = performance.now();
    });
    worker.once('error', finishWithError);
    worker.once('exit', (code) => {
      if (!settled) {
        finishWithError(new Error(
          `Isolated advance worker exited before a terminal result (code ${code})`,
        ));
      }
    });
    worker.on('message', (message) => {
      if (settled) return;

      if (message?.type === 'audit-ready') {
        adapterReadyAt = performance.now();
        return;
      }
      if (message?.type === 'progress') {
        const progress = progressDescription(message.detail);
        progressMessages += 1;
        if (!firstProgress) firstProgress = progress;
        lastProgress = progress;
        return;
      }
      if (message?.type === 'audit-error') {
        finishWithError(Object.assign(
          new Error(message.message || 'The worker evidence adapter failed'),
          { workerStack: message.stack || null },
        ));
        return;
      }
      if (message?.type === 'error') {
        finishWithError(Object.assign(
          new Error(message.message || 'The isolated simulation failed'),
          { workerStack: message.stack || null },
        ));
        return;
      }
      if (message?.type !== 'result') return;

      const terminalReceivedAt = performance.now();
      const workerEvidence = message.workerEvidence || {};
      const responseJson = jsonDescription(message.result);
      const requestToTerminalMs = terminalReceivedAt - requestPostedAt;
      const handlerToTerminalPostMs = Number(
        workerEvidence.handlerToTerminalPostMs,
      );
      const boundaryAndBootstrapResidualMs = Number.isFinite(handlerToTerminalPostMs)
        ? Math.max(0, requestToTerminalMs - handlerToTerminalPostMs)
        : null;
      const measuredWorkerThreadId = Number(workerEvidence.workerThreadId);

      const evidence = {
        schemaVersion: 1,
        kind: 'isolated_advance_worker_measurement',
        actualExecution: true,
        runtime: {
          transport: 'node:worker_threads',
          isolation: 'separate-thread-v8-isolate',
          nodeVersion: process.version,
          platform: process.platform,
          architecture: process.arch,
          parentThreadId: currentThreadId,
          parentIsMainThread: isMainThread,
          workerThreadId: measuredWorkerThreadId,
          workerIsMainThread: workerEvidence.workerIsMainThread === true,
          browserWebWorker: false,
          productionBrowserTransportMeasured: false,
          productWorkerModule: workerEvidence.productWorkerModule,
          domainEntry:
            'src/domain/worldPulse/advanceInterval.js#simulateCampaignWorldInterval',
        },
        request: {
          interval: String(payload?.interval || ''),
          jsonBytes: inputJson.bytes,
          jsonSha256: inputJson.sha256,
        },
        response: {
          status: String(message.result?.status || ''),
          jsonBytes: responseJson.bytes,
          jsonSha256: responseJson.sha256,
          progressMessages,
          firstProgress,
          lastProgress,
        },
        timingsMs: {
          workerConstructor: milliseconds(constructedAt - constructionStartedAt),
          workerOnlineAfterConstructionStart: onlineAt == null
            ? null
            : milliseconds(onlineAt - constructionStartedAt),
          productAdapterReadyAfterConstructionStart: adapterReadyAt == null
            ? null
            : milliseconds(adapterReadyAt - constructionStartedAt),
          coldStartToTerminal: milliseconds(
            terminalReceivedAt - constructionStartedAt,
          ),
          requestToTerminal: milliseconds(requestToTerminalMs),
          workerHandlerToTerminalPost: milliseconds(handlerToTerminalPostMs),
          boundaryAndBootstrapResidual: milliseconds(
            boundaryAndBootstrapResidualMs,
          ),
        },
        nonVacuous: (
          measuredWorkerThreadId > 0
          && measuredWorkerThreadId !== currentThreadId
          && workerEvidence.workerIsMainThread === false
          && progressMessages > 0
          && responseJson.bytes > 0
        ),
        claimBoundary: {
          measured:
            'An actual cold Node worker_threads round trip through the product advance worker module and domain entry.',
          notMeasured:
            'Browser Web Worker startup, scheduling, structured-clone implementation, or device-specific duration.',
          residual:
            'boundaryAndBootstrapResidual is an arithmetic remainder containing bootstrap, scheduling, clone, and delivery work; it is not exact transport time.',
          timingClass:
            'Host-sensitive release evidence and regression telemetry, not a cross-device performance guarantee.',
        },
      };

      settled = true;
      cleanup();
      resolvePromise({ result: message.result, evidence });
    });

    // Match the product's one-shot worker client: post immediately after
    // construction and let the worker host queue the message during bootstrap.
    worker.postMessage(request);
  });
}
