/**
 * Main-thread transport for deterministic town-scene compilation.
 *
 * A reusable worker is safe because every request carries a monotonically
 * increasing generation id. Starting a new generation rejects the prior one,
 * terminates the obsolete worker, and ignores any late packet. A transport
 * failure rejects to the owning product surface, which returns to the canonical
 * 2D plan. Manifest and geometry compilation never run on the interaction
 * thread; the only posted input is the bounded audience-authorized envelope.
 */

const WATCHDOG_MS = 30000;

/**
 * @typedef {Record<string, unknown>} TownSceneManifestRecord
 * @typedef {Record<string, unknown> & {manifestDigest?:string}}
 *   TownSceneGeometryRecord
 * @typedef {{
 *   manifest:TownSceneManifestRecord,
 *   manifestDigest:string,
 *   geometry:TownSceneGeometryRecord,
 *   transport:'worker',
 * }} TownSceneCompileResult
 * @typedef {{
 *   resolve:(value:TownSceneCompileResult)=>void,
 *   reject:(reason:unknown)=>void,
 *   manifest:TownSceneManifestRecord|null,
 *   manifestDigest:string|null,
 *   onManifest?:(
 *     packet:{manifest:TownSceneManifestRecord,manifestDigest:string}
 *   )=>void,
 *   onProgress?:(
 *     packet:{stage:string,geometry:TownSceneGeometryRecord}
 *   )=>void,
 *   signal?:AbortSignal,
 *   abort:()=>void,
 *   watchdog:ReturnType<typeof setTimeout>|null,
 * }} PendingTownSceneRequest
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {string} [message] */
export function townSceneAbortError(message = 'Town-scene geometry request superseded') {
  if (typeof DOMException === 'function') return new DOMException(message, 'AbortError');
  return Object.assign(new Error(message), { name: 'AbortError' });
}

/** @param {string} reason */
export function townSceneWorkerTransportError(reason) {
  return Object.assign(
    new Error(`Town-scene worker unavailable: ${reason}`),
    {
      code: 'TOWN_SCENE_WORKER_UNAVAILABLE',
      reason,
    },
  );
}

/** @param {string} reason */
export function townSceneWorkerProtocolError(reason) {
  return Object.assign(
    new Error(`Town-scene worker protocol invalid: ${reason}`),
    {
      code: 'TOWN_SCENE_WORKER_PROTOCOL_INVALID',
      reason,
    },
  );
}

/**
 * @param {{
 *   workerFactory?:()=>Worker|null,
 *   watchdogMs?:number,
 * }} [dependencies]
 */
export function createTownSceneWorkerClient(dependencies = {}) {
  const watchdogMs = Math.max(1000, dependencies.watchdogMs || WATCHDOG_MS);
  /** @type {Worker|null} */
  let worker = null;
  let generation = 0;
  let disposed = false;
  /** @type {Map<number, PendingTownSceneRequest>} */
  const pending = new Map();
  /** @type {WeakSet<Worker>} */
  const boundWorkers = new WeakSet();

  const makeWorker = () => {
    if (worker) return worker;
    if (typeof Worker === 'undefined' && !dependencies.workerFactory) return null;
    worker = dependencies.workerFactory
      ? dependencies.workerFactory()
      : new Worker(new URL('../../workers/townScene.worker.js', import.meta.url), { type: 'module' });
    return worker;
  };

  const terminateWorker = () => {
    try { worker?.terminate(); } catch { /* already unavailable */ }
    worker = null;
  };

  /** @param {number} id */
  const takePending = (id) => {
    const request = pending.get(id);
    if (!request) return null;
    pending.delete(id);
    clearTimeout(request.watchdog);
    request.signal?.removeEventListener?.('abort', request.abort);
    return request;
  };

  /** @param {number} id @param {TownSceneCompileResult} value */
  const resolvePending = (id, value) => {
    takePending(id)?.resolve(value);
  };

  /** @param {number} id @param {unknown} reason */
  const rejectPending = (id, reason) => {
    takePending(id)?.reject(reason);
  };

  /** @param {number} id @param {PendingTownSceneRequest} request */
  const refreshWatchdog = (id, request) => {
    if (request.watchdog != null) clearTimeout(request.watchdog);
    request.watchdog = setTimeout(
      () => failTransport(id, 'worker-timeout'),
      watchdogMs,
    );
  };

  const rejectOlder = (nextGeneration) => {
    let superseded = false;
    for (const id of pending.keys()) {
      if (id >= nextGeneration) continue;
      superseded = true;
      rejectPending(id, townSceneAbortError());
    }
    // The compiler is synchronous inside its worker event. Posting a cancel
    // message cannot interrupt it; terminating the isolated worker can.
    if (superseded) terminateWorker();
  };

  const failTransport = (id, reason) => {
    if (!pending.has(id)) return;
    terminateWorker();
    rejectPending(id, townSceneWorkerTransportError(reason));
  };

  const failProtocol = (id, reason) => {
    if (!pending.has(id)) return;
    terminateWorker();
    rejectPending(id, townSceneWorkerProtocolError(reason));
  };

  const bindWorker = (activeWorker) => {
    if (boundWorkers.has(activeWorker)) return;
    boundWorkers.add(activeWorker);
    activeWorker.onmessage = (event) => {
      const packet = record(event.data);
      const id = packet.generationId;
      if (typeof id !== 'number' || !Number.isSafeInteger(id)) return;
      const request = pending.get(id);
      if (!request || id !== generation) return;
      if (packet.type === 'manifest') {
        if (
          !packet.manifest
          || typeof packet.manifest !== 'object'
          || Array.isArray(packet.manifest)
          || typeof packet.manifestDigest !== 'string'
          || !packet.manifestDigest
        ) {
          failProtocol(id, 'malformed-manifest-packet');
          return;
        }
        if (request.manifest) {
          failProtocol(id, 'duplicate-manifest-packet');
          return;
        }
        request.manifest = /** @type {TownSceneManifestRecord} */ (packet.manifest);
        request.manifestDigest = packet.manifestDigest;
        refreshWatchdog(id, request);
        request.onManifest?.({
          manifest: request.manifest,
          manifestDigest: packet.manifestDigest,
        });
      } else if (packet.type === 'progress') {
        if (!request.manifest || !request.manifestDigest) {
          failProtocol(id, 'geometry-before-manifest');
          return;
        }
        const geometry = record(packet.geometry);
        if (
          geometry.manifestDigest !== request.manifestDigest
        ) {
          failProtocol(id, 'geometry-manifest-digest-mismatch');
          return;
        }
        refreshWatchdog(id, request);
        request.onProgress?.({
          stage: typeof packet.stage === 'string' && packet.stage
            ? packet.stage
            : 'massing',
          geometry: /** @type {TownSceneGeometryRecord} */ (geometry),
        });
      } else if (packet.type === 'result') {
        if (!request.manifest || !request.manifestDigest) {
          failProtocol(id, 'result-before-manifest');
          return;
        }
        const geometry = record(packet.geometry);
        if (geometry.manifestDigest !== request.manifestDigest) {
          failProtocol(id, 'geometry-manifest-digest-mismatch');
          return;
        }
        resolvePending(id, {
          manifest: request.manifest,
          manifestDigest: request.manifestDigest,
          geometry: /** @type {TownSceneGeometryRecord} */ (geometry),
          transport: 'worker',
        });
      } else if (packet.type === 'error') {
        // A domain/compiler error is not a transport failure and should remain
        // visible rather than burning the same work twice.
        const error = Object.assign(new Error(
          typeof packet.message === 'string' && packet.message
            ? packet.message
            : 'Town-scene worker failed',
        ), {
          workerStack: typeof packet.stack === 'string' ? packet.stack : null,
        });
        rejectPending(id, error);
      } else {
        failProtocol(id, 'unknown-worker-packet');
      }
    };
    activeWorker.onerror = () => {
      const ids = [...pending.keys()];
      terminateWorker();
      for (const id of ids) {
        rejectPending(id, townSceneWorkerTransportError('worker-error'));
      }
    };
    activeWorker.onmessageerror = () => {
      const ids = [...pending.keys()];
      terminateWorker();
      for (const id of ids) {
        rejectPending(id, townSceneWorkerTransportError('worker-message-error'));
      }
    };
  };

  return {
    /**
     * @param {unknown} compileInput
     * @param {{lodBias?:number,massingOnly?:boolean}} [options]
     * @param {{
     *   onManifest?:(
     *     packet:{manifest:TownSceneManifestRecord,manifestDigest:string}
     *   )=>void,
     *   onProgress?:(
     *     packet:{stage:string,geometry:TownSceneGeometryRecord}
     *   )=>void,
     *   signal?:AbortSignal,
     * }} [requestOptions]
     * @returns {Promise<TownSceneCompileResult>}
     */
    compile(compileInput, options = {}, requestOptions = {}) {
      if (disposed) return Promise.reject(new Error('Town-scene worker client is disposed'));
      const id = ++generation;
      rejectOlder(id);
      const normalized = {
        lodBias: Math.max(0, Math.trunc(options.lodBias || 0)),
        massingOnly: Boolean(options.massingOnly),
      };
      return new Promise((resolve, reject) => {
        const abort = () => {
          terminateWorker();
          rejectPending(id, townSceneAbortError('Town-scene request aborted'));
        };
        pending.set(id, {
          resolve,
          reject,
          manifest: null,
          manifestDigest: null,
          onManifest: requestOptions.onManifest,
          onProgress: requestOptions.onProgress,
          signal: requestOptions.signal,
          abort,
          watchdog: null,
        });
        if (requestOptions.signal?.aborted) return abort();
        requestOptions.signal?.addEventListener?.('abort', abort, { once: true });
        let activeWorker;
        try {
          activeWorker = makeWorker();
          if (activeWorker) bindWorker(activeWorker);
        } catch {
          activeWorker = null;
        }
        if (!activeWorker) {
          failTransport(id, 'worker-unavailable');
          return;
        }
        const request = pending.get(id);
        if (!request) return;
        refreshWatchdog(id, request);
        try {
          activeWorker.postMessage({
            type: 'compile',
            generationId: id,
            compileInput,
            options: normalized,
          });
        } catch {
          failTransport(id, 'worker-post-failed');
        }
      });
    },
    dispose() {
      disposed = true;
      for (const id of pending.keys()) {
        rejectPending(id, townSceneAbortError('Town-scene worker disposed'));
      }
      terminateWorker();
    },
    get generationId() {
      return generation;
    },
  };
}
