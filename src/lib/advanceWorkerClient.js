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
 *     in-thread call), rejects on a sim throw (the caller's atomic rollback
 *     handles it exactly as it handles an in-thread throw today).
 *
 * DELIBERATELY has NO static import of the domain layer — it takes the sim
 * function as `fallback`, so the store slice keeps its "no top-level worldPulse
 * edge" invariant (the sim still enters only via the slice's lazy loadWorldPulse).
 *
 * One worker per advance, terminated on completion. Reusing a singleton would let
 * two concurrent advances of different campaigns (the advanceInFlight guard is
 * per-campaign) race on the worker's setCustomContentSource global; a fresh
 * worker per request isolates each advance's custom-content snapshot. Its spin-up
 * cost is off the main thread.
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
 * @param {any} payload - {campaign, saves, interval, commit, now, autoResolve, resume}
 * @param {{ fallback:(p:any)=>(Promise<any>|any), customContent?:any, onProgress?:(d:any)=>void }} opts
 * @returns {Promise<any>} the composed advance result (same shape either path)
 */
export async function runAdvanceInterval(payload, { fallback, customContent, onProgress }) {
  if (typeof Worker === 'undefined') return fallback(payload); // Node / vitest / SSR
  let worker;
  try {
    worker = new Worker(new URL('../workers/advanceInterval.worker.js', import.meta.url), { type: 'module' });
  } catch {
    return fallback(payload); // worker construction blocked (CSP / unsupported) → sync
  }
  return new Promise((resolve, reject) => {
    let watchdog;
    const settle = (fn, arg) => {
      clearTimeout(watchdog);
      try { worker.terminate(); } catch { /* already gone */ }
      fn(arg);
    };
    const arm = () => {
      clearTimeout(watchdog);
      watchdog = setTimeout(
        () => settle(reject, new Error('advance worker unresponsive (no progress within timeout)')),
        TICK_WATCHDOG_MS,
      );
    };
    worker.onmessage = (ev) => {
      const d = ev.data || {};
      if (d.type === 'progress') {
        arm(); // a tick completed — the worker is alive
        onProgress?.(d.detail);
        // Re-dispatch on the MAIN thread so useAdvanceSession's listener (which
        // listens on globalThis) drives the toolbar's determinate bar.
        try { globalThis.dispatchEvent(new CustomEvent(ADVANCE_PROGRESS_EVENT, { detail: d.detail })); } catch { /* no dispatch target */ }
        return;
      }
      if (d.type === 'result') return settle(resolve, d.result);
      if (d.type === 'error') return settle(reject, Object.assign(new Error(d.message || 'advance worker error'), { workerStack: d.stack }));
    };
    worker.onerror = (ev) => settle(reject, (ev && ev.error) || new Error('advance worker failed'));
    worker.onmessageerror = () => settle(reject, new Error('advance worker message could not be deserialized'));
    arm();
    worker.postMessage({ payload, customContent });
  });
}
