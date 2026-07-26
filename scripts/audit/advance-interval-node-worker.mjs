/**
 * Node worker_threads adapter for release evidence.
 *
 * The product worker is a browser Web Worker and therefore expects `self`.
 * This adapter supplies only that message host, then imports the product worker
 * module itself. The simulation entry, custom-content setup, progress protocol,
 * and terminal result/error protocol are consequently the same code exercised
 * in the browser. Only the host transport differs: `node:worker_threads`
 * replaces the browser's Web Worker implementation.
 *
 * This file is audit infrastructure, not a second simulation implementation.
 */

import {
  isMainThread,
  parentPort,
  threadId,
} from 'node:worker_threads';
import { performance } from 'node:perf_hooks';

if (isMainThread || !parentPort) {
  throw new Error('advance-interval-node-worker must run inside a Node worker thread');
}

const PRODUCT_WORKER_MODULE = 'src/workers/advanceInterval.worker.js';
const terminalTypes = new Set(['result', 'error']);
let handlerStartedAt = null;
let terminalForwarded = false;

/**
 * Minimal browser-worker host consumed by advanceInterval.worker.js.
 *
 * Timing is attached only to the audit envelope around a terminal message. It
 * never enters the product result and cannot affect the simulation's inputs,
 * random draws, or output bytes.
 */
const auditWorkerHost = {
  onmessage: null,
  postMessage(message) {
    const isTerminal = terminalTypes.has(message?.type);
    const outbound = isTerminal
      ? {
          ...message,
          workerEvidence: {
            schemaVersion: 1,
            workerThreadId: threadId,
            workerIsMainThread: isMainThread,
            productWorkerModule: PRODUCT_WORKER_MODULE,
            handlerToTerminalPostMs: handlerStartedAt == null
              ? null
              : performance.now() - handlerStartedAt,
          },
        }
      : message;

    parentPort.postMessage(outbound);
    if (isTerminal) terminalForwarded = true;
  },
};

// advanceInterval.worker.js deliberately uses the browser-standard global.
globalThis.self = auditWorkerHost;

try {
  await import('../../src/workers/advanceInterval.worker.js');
  const productHandler = auditWorkerHost.onmessage;
  if (typeof productHandler !== 'function') {
    throw new TypeError('The product advance worker did not install self.onmessage');
  }

  parentPort.on('message', async (message) => {
    if (terminalForwarded) return;
    handlerStartedAt = performance.now();
    try {
      await productHandler({ data: message });
    } catch (error) {
      parentPort.postMessage({
        type: 'audit-error',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
      });
    }
  });

  parentPort.postMessage({
    type: 'audit-ready',
    workerEvidence: {
      schemaVersion: 1,
      workerThreadId: threadId,
      workerIsMainThread: isMainThread,
      productWorkerModule: PRODUCT_WORKER_MODULE,
    },
  });
} catch (error) {
  parentPort.postMessage({
    type: 'audit-error',
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : null,
  });
}
