/**
 * mapBridge.js — Typed RPC client for the FMG iframe.
 *
 * Replaces the fire-and-forget postMessage pattern in WorldMap.jsx.
 * Every command returns a Promise. Commands issued before the iframe
 * signals ready are queued and drained in order. Push events go through
 * a tiny event emitter that React components subscribe to.
 *
 *   const bridge = createMapBridge(() => iframeRef.current);
 *   await bridge.ready();
 *   await bridge.placeSettlement({ settlementId, x, y, name, population });
 *   bridge.on('burgSelected', (burg) => ...);
 *
 * Contract with public/map/main.js:
 *   Every command carries a `_rid` (request id). Replies echo the `_rid`.
 *   Push events have no `_rid`. Errors come back as { _rid, _error }.
 */

const DEFAULT_TIMEOUT_MS = 7000;

let __ridCounter = 0;
const nextRid = () => `rpc_${Date.now()}_${++__ridCounter}`;

/**
 * Create a bridge instance bound to an iframe getter.
 * The getter is called lazily so the ref can be populated after creation.
 */
export function createMapBridge(getIframe, opts = {}) {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const debug = opts.debug ?? false;

  let readyResolved = false;
  let readyPromise = null;
  let readyResolve = null;
  let readyReject = null;

  // Pending RPC calls: rid -> { resolve, reject, timer, type }
  const pending = new Map();

  // Command queue for calls issued before ready
  const queue = [];

  // Event listeners: eventName -> Set<callback>
  const listeners = new Map();

  // Bookkeeping
  let destroyed = false;
  let messageHandler = null;

  function log(...args) {
    if (debug) console.log('[mapBridge]', ...args);
  }

  function emit(event, payload) {
    const set = listeners.get(event);
    if (!set) return;
    for (const cb of set) {
      try { cb(payload); } catch (e) { console.error(`mapBridge listener for ${event} threw:`, e); }
    }
  }

  function handleMessage(event) {
    const data = event?.data;
    if (!data || typeof data !== 'object') return;
    const { type, _rid, _error } = data;

    // Ignore messages not meant for us — anything that doesn't start with
    // `fmg:` is someone else's concern.
    if (typeof type !== 'string' || !type.startsWith('fmg:')) return;

    log('in', type, _rid || '-');

    // First fmg:ready resolves the ready promise and drains the queue
    if (type === 'fmg:ready') {
      if (!readyResolved) {
        readyResolved = true;
        readyResolve?.(data);
        drainQueue();
      }
      emit('ready', data);
      return;
    }

    // RPC reply — has _rid matching a pending call
    if (_rid && pending.has(_rid)) {
      const entry = pending.get(_rid);
      clearTimeout(entry.timer);
      pending.delete(_rid);
      if (_error) {
        entry.reject(new Error(`${entry.type}: ${_error}`));
      } else {
        entry.resolve(data);
      }
      return;
    }

    // Push event — strip the "fmg:" prefix for the event name
    const eventName = type.slice(4);
    emit(eventName, data);
  }

  function send(msg) {
    const iframe = getIframe?.();
    if (!iframe?.contentWindow) {
      log('send dropped — no iframe', msg.type);
      return false;
    }
    try {
      iframe.contentWindow.postMessage(msg, '*');
      return true;
    } catch (e) {
      console.warn('mapBridge.send failed:', e);
      return false;
    }
  }

  function drainQueue() {
    log(`draining ${queue.length} queued commands`);
    while (queue.length) {
      const item = queue.shift();
      dispatch(item);
    }
  }

  function dispatch(item) {
    if (destroyed) {
      item.reject?.(new Error('Bridge destroyed'));
      return;
    }
    const msg = { ...item.msg, _rid: item.rid };
    const timer = setTimeout(() => {
      if (pending.has(item.rid)) {
        pending.delete(item.rid);
        item.reject?.(new Error(`RPC timeout: ${item.msg.type}`));
      }
    }, item.timeout ?? timeoutMs);

    pending.set(item.rid, {
      resolve: item.resolve,
      reject: item.reject,
      timer,
      type: item.msg.type,
    });

    const ok = send(msg);
    if (!ok) {
      clearTimeout(timer);
      pending.delete(item.rid);
      item.reject?.(new Error(`Failed to post message: ${item.msg.type}`));
    }
  }

  /**
   * Issue an RPC call. Returns a promise resolving with the reply payload
   * or rejecting on timeout/error. Queued if ready hasn't fired yet.
   */
  function call(type, payload = {}, { timeout, skipQueue } = {}) {
    if (destroyed) return Promise.reject(new Error('Bridge destroyed'));
    const rid = nextRid();
    return new Promise((resolve, reject) => {
      const item = {
        rid,
        msg: { type, ...payload },
        resolve,
        reject,
        timeout,
      };
      if (readyResolved || skipQueue) {
        dispatch(item);
      } else {
        log('queued', type);
        queue.push(item);
      }
    });
  }

  /**
   * Fire-and-forget send. Does not await a reply. Used for high-frequency
   * events like viewport sync where we don't care about acknowledgement.
   */
  function notify(type, payload = {}) {
    if (destroyed) return false;
    if (!readyResolved) {
      // Don't queue notifications — by the time they drain they're stale
      return false;
    }
    return send({ type, ...payload });
  }

  function ready() {
    if (readyResolved) return Promise.resolve();
    if (readyPromise) return readyPromise;
    readyPromise = new Promise((resolve, reject) => {
      readyResolve = resolve;
      readyReject = reject;
    });
    return readyPromise;
  }

  function on(event, cb) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(cb);
    return () => off(event, cb);
  }

  function off(event, cb) {
    listeners.get(event)?.delete(cb);
  }

  function start() {
    if (messageHandler) return;
    messageHandler = handleMessage;
    window.addEventListener('message', messageHandler);
  }

  function destroy() {
    destroyed = true;
    if (messageHandler) {
      window.removeEventListener('message', messageHandler);
      messageHandler = null;
    }
    // Reject all pending calls
    for (const [rid, entry] of pending) {
      clearTimeout(entry.timer);
      entry.reject(new Error('Bridge destroyed'));
    }
    pending.clear();
    // Reject queued calls
    for (const item of queue) {
      item.reject?.(new Error('Bridge destroyed'));
    }
    queue.length = 0;
    listeners.clear();
    readyResolved = false;
    readyPromise = null;
  }

  // Typed surface — the API parent components talk to
  const api = {
    // Lifecycle
    start, destroy, ready,
    // Low-level RPC (for commands not in the typed surface)
    call, notify, on, off,
    // Introspection
    get isReady() { return readyResolved; },

    // ── Settlement placement ──────────────────────────────────────────────
    placeSettlement: (args) => call('settlementEngine:placeSettlement', args),
    removePlacement: (burgId) => call('settlementEngine:removePlacement', { burgId }),
    clearAllPlacements: () => call('settlementEngine:clearAllPlacements'),
    restorePlacements: (placements) =>
      call('settlementEngine:restorePlacements', { placements }, { timeout: 15000 }),

    // ── Viewport / geometry ───────────────────────────────────────────────
    getViewport: () => call('settlementEngine:getViewport'),
    setViewport: ({ cx, cy, scale, duration }) =>
      call('settlementEngine:setViewport', { cx, cy, scale, duration }),
    fitMap: () => call('settlementEngine:fitMap'),

    // ── Map snapshot (campaign save/load) ─────────────────────────────────
    saveSnapshot: () => call('settlementEngine:saveSnapshot', {}, { timeout: 15000 }),
    loadSnapshot: (snapshot) =>
      call('settlementEngine:loadSnapshot', { snapshot }, { timeout: 30000 }),
    resetMap: (seed) => call('settlementEngine:resetMap', { seed }, { timeout: 30000 }),

    // ── Terrain mode ──────────────────────────────────────────────────────
    activateTool: (tool, options = {}) =>
      call('settlementEngine:activateTool', { tool, options }),
    deactivateTool: () => call('settlementEngine:deactivateTool'),
    terrainUndo: () => call('settlementEngine:terrainUndo'),
    terrainRedo: () => call('settlementEngine:terrainRedo'),

    // ── Template selection ───────────────────────────────────────────────
    setTemplate: (templateId) =>
      call('settlementEngine:setTemplate', { templateId }),
    getTemplates: () => call('settlementEngine:getTemplates'),

    // ── Misc ──────────────────────────────────────────────────────────────
    requestBurgList: () => call('settlementEngine:requestBurgList'),
    setEmbeddedMode: (enabled) =>
      call('settlementEngine:setEmbeddedMode', { enabled }),
  };

  return api;
}

/**
 * React hook for using a map bridge inside a component.
 * Usage:
 *   const bridgeRef = useRef(null);
 *   const iframeRef = useRef(null);
 *   const bridge = useMapBridge(iframeRef);
 *   useEffect(() => { bridge.ready().then(() => ...); }, [bridge]);
 */
export function createBridgeSingleton(getIframe, opts) {
  const bridge = createMapBridge(getIframe, opts);
  bridge.start();
  return bridge;
}
