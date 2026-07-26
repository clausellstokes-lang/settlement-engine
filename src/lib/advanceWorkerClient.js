/**
 * advanceWorkerClient.js — main-thread transport for the world-advance Web Worker.
 *
 * Keeps the sim OFF the main thread while preserving every existing contract:
 *   • Falls back to the in-thread `fallback` when Workers are unavailable
 *     (Node/vitest/SSR) or spawn fails — so headless tests run the pure function
 *     unchanged and nothing depends on a Worker existing.
 *   • Relays the worker's per-tick progress to `onProgress` AND re-dispatches it
 *     as the same CustomEvent the toolbar listens for (ADVANCE_PROGRESS_EVENT in
 *     advanceInterval.js), so the determinate progress bar keeps animating.
 *   • Resolves with the worker's structured-cloned result (same shape as the
 *     in-thread call).
 *
 * Failure taxonomy — a SIM throw and a TRANSPORT failure are NOT the same event:
 *   • SIM throw: the worker caught the exception and posted {type:'error'}. The
 *     in-thread path would throw identically, so we REJECT and let the caller's
 *     atomic rollback handle it (retrying in-thread would just burn the work
 *     twice and fail the same way).
 *   • TRANSPORT failure: onerror (worker script/module error), onmessageerror
 *     (un-cloneable message), or the liveness watchdog (a wedged worker). These
 *     are infrastructural — the byte-identical in-thread path would have
 *     completed — so we FALL BACK to `fallback(payload)` once rather than failing
 *     the user's advance. A one-shot latch stops a late worker message from
 *     double-settling once we've committed to a path.
 *
 * DELIBERATELY has NO static import of the domain layer — it takes the sim
 * function as `fallback`, so the store slice keeps its "no top-level worldPulse
 * edge" invariant (the sim still enters only via the slice's lazy loadWorldPulse).
 *
 * One worker per advance, terminated on completion. The pinned custom-content
 * projection is passed as request data and scoped around each synchronous kernel
 * tick; it is never installed as mutable worker-global library state. A fresh
 * worker still gives each interval an isolated liveness/error lifecycle.
 */

// Mirror of ADVANCE_PROGRESS_EVENT (src/domain/worldPulse/advanceInterval.js) —
// duplicated here so this light client needs no domain import. Frozen contract.
const ADVANCE_PROGRESS_EVENT = 'settlementforge:advance-progress';

// Per-tick liveness watchdog: reset on every message, so a legitimately long
// year-advance never trips it — only a genuinely wedged worker (no progress for
// this long between ticks) does. NOT a total-run deadline.
const TICK_WATCHDOG_MS = 30000;

/**
 * Run a multi-tick advance in a Web Worker, or fall back to the in-thread function.
 * @param {any} payload - {campaign, saves, interval, commit, now,
 *   autoResolve, resume, customContent?}
 * @param {{ fallback:(p:any)=>(Promise<any>|any), customContent?:any, onProgress?:(d:any)=>void }} opts
 * @returns {Promise<any>} the composed advance result (same shape either path)
 */
export async function runAdvanceInterval(payload, { fallback, customContent, onProgress }) {
  // `customContent` has a dedicated worker-protocol field so it cannot be
  // installed as mutable worker-global state. The in-thread function has no
  // transport envelope, however: preserve its established payload object
  // exactly unless the caller supplied an explicit projection that the payload
  // does not already carry. This keeps Node/SSR and transport-recovery calls
  // byte-equivalent to a direct domain invocation.
  const payloadCustomContent = payload != null && typeof payload === 'object'
    ? payload.customContent
    : undefined;
  const hasCustomContentOverride = customContent !== undefined;
  const pinnedCustomContent = hasCustomContentOverride
    ? customContent
    : payloadCustomContent;
  const fallbackPayload = (
    !hasCustomContentOverride
    || payloadCustomContent === customContent
  )
    ? payload
    : { ...(payload || {}), customContent };
  const workerPayload = { ...(payload || {}) };
  delete workerPayload.customContent;
  if (typeof Worker === 'undefined') {
    return fallback(fallbackPayload); // Node / vitest / SSR
  }
  let worker;
  try {
    worker = new Worker(new URL('../workers/advanceInterval.worker.js', import.meta.url), { type: 'module' });
  } catch {
    return fallback(fallbackPayload); // worker construction blocked (CSP / unsupported) → sync
  }
  return new Promise((resolve, reject) => {
    let watchdog;
    let settled = false; // one-shot latch — a late worker message can't double-settle
    const cleanup = () => {
      clearTimeout(watchdog);
      try { worker.terminate(); } catch { /* already gone */ }
    };
    // Worker produced a usable result.
    const succeed = (result) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };
    // Real sim failure (caller's rollback must see it) — do NOT retry in-thread.
    const failSim = (err) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err);
    };
    // Transport failure — run the byte-identical in-thread path once. If the
    // in-thread run itself throws, THAT is a genuine sim error → reject.
    const failTransport = () => {
      if (settled) return;
      settled = true;
      cleanup();
      Promise.resolve().then(() => fallback(fallbackPayload)).then(resolve, reject);
    };
    const arm = () => {
      clearTimeout(watchdog);
      watchdog = setTimeout(failTransport, TICK_WATCHDOG_MS);
    };
    worker.onmessage = (ev) => {
      if (settled) return;
      const d = ev.data || {};
      if (d.type === 'progress') {
        arm(); // a tick completed — the worker is alive
        onProgress?.(d.detail);
        // Re-dispatch on the MAIN thread so useAdvanceSession's listener (which
        // listens on globalThis) drives the toolbar's determinate bar.
        try { globalThis.dispatchEvent(new CustomEvent(ADVANCE_PROGRESS_EVENT, { detail: d.detail })); } catch { /* no dispatch target */ }
        return;
      }
      if (d.type === 'result') return succeed(d.result);
      if (d.type === 'error') return failSim(Object.assign(new Error(d.message || 'advance worker error'), { workerStack: d.stack }));
    };
    worker.onerror = failTransport;
    worker.onmessageerror = failTransport;
    arm();
    worker.postMessage({
      payload: workerPayload,
      customContent: pinnedCustomContent,
    });
  });
}
