/**
 * generateSettlementPDF — entry point that builds and downloads the dossier PDF.
 *
 * Replaces the legacy hand-painted jsPDF generator with a thin wrapper around
 * @react-pdf/renderer. The actual layout lives in src/pdf/SettlementPDF.jsx
 * and its supporting primitives / sections under src/pdf/.
 *
 * Signature is backward-compatible — existing callers may invoke
 *   generateSettlementPDF(settlement)
 * and get a clean dossier. To export the AI narrative edition, callers should
 * pass:
 *   generateSettlementPDF(settlement, { aiSettlement, narrativeMode: true })
 *
 * The function is async and resolves once the browser download has been
 * triggered.
 *
 * ── F41: rendering happens in a Web Worker ──────────────────────────────────
 * @react-pdf's toBlob() runs its reconcile + layout + serialization
 * synchronously — a multi-second MAIN-THREAD freeze on a large dossier. The
 * render now lives in src/utils/pdfRender.worker.js: this module normalizes the
 * settlement, posts the (plain-data) props to the worker, and receives the
 * finished Blob back. The page stays interactive; the caller's existing
 * `exporting` spinner state paints and animates normally throughout.
 *
 * The original blocker — @react-pdf's browser build reads `window.*`
 * unguarded, and `window` is undefined in a worker — is solved by
 * src/utils/pdfWorkerShim.js (aliases `window` to the worker global before the
 * vendor bundle evaluates).
 *
 * Fallback doctrine: the main-thread path survives ONLY for environments where
 * the worker cannot be CONSTRUCTED (no Worker global, CSP worker-src block,
 * script-level load/eval failure, non-cloneable props). That is feature
 * detection, not user-agent sniffing. A render error INSIDE a healthy worker
 * propagates as an export failure — the same document would fail identically
 * on the main thread, so retrying there would just freeze the page before
 * showing the same error.
 *
 * Lazy-chunk contract (tests/build/vendorPdfLazy.test.js): this module has NO
 * static import of @react-pdf/renderer. The worker carries its own bundle of
 * the PDF stack (fetched when the worker is constructed, i.e. on first
 * export); the main-thread fallback reaches vendor-pdf via dynamic import()
 * only. Nothing here can drag PDF vendor bytes into first paint.
 */
import React from 'react';
import { normalizeSettlement } from '../domain/normalizeSettlement.js';
import { track, EVENTS } from '../lib/analytics.js';
import { captureFingerprint } from '../lib/researchCapture.js';

/** duration_band vocabulary (taxonomy §Banding): lt_5s · 5_15s · 15_60s · 1_5m · 5_30m · gt_30m */
function durationBand(ms) {
  const n = Number(ms);
  if (!Number.isFinite(n) || n < 0) return 'unknown';
  if (n < 5000) return 'lt_5s';
  if (n < 15000) return '5_15s';
  if (n < 60000) return '15_60s';
  if (n < 300000) return '1_5m';
  if (n < 1800000) return '5_30m';
  return 'gt_30m';
}

// ── Worker lifecycle ─────────────────────────────────────────────────────────
// A keep-alive singleton: the worker bundle (the whole PDF stack) is fetched
// once on first export, and @react-pdf's FontStore inside the worker caches
// the fetched TTFs — so repeat exports (draft → export → tweak → export) skip
// both costs. `workerBroken` latches construction/script-level failure so we
// don't re-pay a doomed construction attempt on every subsequent export.
let pdfWorker = null;
let workerBroken = false;
let nextRenderId = 1;
const pending = new Map(); // renderId → { resolve, reject }

// Marker for "the worker path is unusable in this environment" — routes the
// caller to the main-thread fallback, as distinct from a real render error
// (which propagates to the user).
const workerUnavailable = (err) => Object.assign(err, { pdfWorkerUnavailable: true });

function failAllPending(err) {
  for (const { reject } of pending.values()) reject(err);
  pending.clear();
}

function getPdfWorker() {
  if (workerBroken) return null;
  if (pdfWorker) return pdfWorker;
  if (typeof Worker !== 'function') {
    workerBroken = true;
    return null;
  }
  try {
    // Vite worker syntax — the URL is statically analyzable, so the worker
    // (and the PDF stack inside it) is emitted as its own lazily-fetched
    // asset, never part of the first-paint graph.
    pdfWorker = new Worker(
      new URL('./pdfRender.worker.js', import.meta.url),
      { type: 'module' },
    );
  } catch (err) {
    console.warn('[PDF export] worker construction failed; falling back to main thread:', err);
    workerBroken = true;
    return null;
  }
  pdfWorker.onmessage = (event) => {
    const { id, ok, blob, error } = event.data || {};
    const entry = pending.get(id);
    if (!entry) return;
    pending.delete(id);
    if (ok) entry.resolve(blob);
    else entry.reject(new Error(error || 'PDF render failed in worker'));
  };
  // 'error' fires for SCRIPT-LEVEL failures — the worker module failed to
  // load or evaluate (CSP, a bundling regression, a global-scope crash the
  // shim didn't cover). That is "construction failed" in spirit: tear the
  // worker down, latch broken, and let in-flight renders fall back.
  pdfWorker.onerror = (event) => {
    console.warn('[PDF export] worker script failure; falling back to main thread:', event?.message);
    const dead = pdfWorker;
    pdfWorker = null;
    workerBroken = true;
    try { dead.terminate(); } catch { /* already gone */ }
    failAllPending(workerUnavailable(new Error(event?.message || 'PDF worker script failed')));
  };
  return pdfWorker;
}

/**
 * Render in the worker. Resolves to the PDF Blob, or rejects:
 *   - with `err.pdfWorkerUnavailable` set → caller should use the fallback
 *   - otherwise → a real render failure; propagate to the user.
 * Returns null (without a Promise) when the worker path is already known to
 * be unusable, so the caller goes straight to the fallback.
 */
function renderPdfBlobInWorker(props) {
  const worker = getPdfWorker();
  if (!worker) return null;
  const id = nextRenderId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    try {
      worker.postMessage({ id, props });
    } catch (err) {
      // DataCloneError — a caller smuggled something non-serializable into
      // the options. The main-thread path can still render it (no clone
      // boundary there), so treat as worker-unavailable for this export.
      pending.delete(id);
      reject(workerUnavailable(err));
    }
  });
}

/**
 * Main-thread fallback — the pre-F41 render path, kept ONLY for environments
 * where the worker cannot be constructed. Everything heavy arrives via
 * dynamic import() so vendor-pdf stays lazy (and is simply never fetched on
 * the main thread when the worker path works).
 */
async function renderPdfBlobOnMainThread(props) {
  // The caller flips its `exporting` spinner state synchronously on click,
  // but React hasn't committed/painted that yet when this async fn runs;
  // yield two animation frames so the browser paints the spinner BEFORE the
  // render freezes the main thread. No-op in non-DOM test envs.
  await new Promise(resolve => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    } else {
      setTimeout(resolve, 0);
    }
  });
  const [{ pdf }, { SettlementPDF }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('../pdf/SettlementPDF.jsx'),
  ]);
  return pdf(React.createElement(SettlementPDF, props)).toBlob();
}

export async function generateSettlementPDF(settlement, options = {}) {
  const {
    aiSettlement = null,
    aiDailyLife = null,
    narrativeMode = false,
    // Campaign-state engine extras — when present, the PDF emits the
    // SystemStateSnapshot chapter (always) and the Timeline chapter
    // (canon mode only). Optional; PDFs from before this feature still
    // render cleanly without them.
    systemState = null,
    eventLog = [],
    phase = 'draft',
    // Audit recommendation: three export variants. Default preserves
    // the previous behavior so any pre-existing caller gets the same
    // PDF it always got.
    variant = 'canon_dossier',
    // Founder Lifetime exporters get a "Founder Edition" badge on the
    // cover. The flag is read at export time so revoking founder status
    // (refund, etc.) immediately stops the badge appearing on new
    // exports. Existing exported PDFs are obviously unchanged.
    isFounder = false,
    // Anonymous / unauthenticated exporters get a small parchment-stripe
    // watermark in the cover footer. Used by the single-dossier success
    // page (no account) and any other unauthenticated PDF path. Real
    // accounts (even Wanderer/free) get clean exports. The watermark
    // discourages bulk scraping of the anonymous homepage hero for
    // resale and signals "free preview" without being obnoxious.
    isAnonymous = false,
  } = options;

  const startedAt = Date.now();

  // Run the canonical-shape adapter at the export boundary. Saves loaded
  // from before Phase 6 don't yet carry version stamps; normalizing here
  // means every PDF chapter can rely on the canonical contract without
  // each section adding its own defensive guards. It also keeps the props
  // posted to the worker plain, structured-cloneable data.
  const normalizedSettlement = normalizeSettlement(settlement);

  const props = {
    settlement: normalizedSettlement,
    aiSettlement,
    aiDailyLife,
    narrativeMode,
    systemState,
    eventLog,
    phase,
    variant,
    isFounder,
    isAnonymous,
  };

  let blob;
  try {
    blob = await renderPdfBlobInWorker(props);
  } catch (err) {
    if (!err?.pdfWorkerUnavailable) throw err; // real render failure — surface it
    blob = null;
  }
  if (!blob) blob = await renderPdfBlobOnMainThread(props);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const safeName = (settlement?.name || 'settlement')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase() || 'settlement';
  const suffix = narrativeMode ? '_narrative' : '_dossier';
  a.download = `${safeName}${suffix}.pdf`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Export succeeded (download triggered) — emit the success event + structural
  // snapshot. Both are fire-and-forget; a fault here must never surface as an
  // export failure to the caller. captureFingerprint silently skips when no
  // stable uuid is available (anonymous exports).
  try {
    track(EVENTS.PDF_EXPORT_COMPLETED, {
      scope: 'settlement',
      narrative_mode: !!narrativeMode,
      canon_phase: typeof phase === 'string' ? phase : 'draft',
      duration_band: durationBand(Date.now() - startedAt),
    });
    captureFingerprint('exported', settlement, { settlementUuid: options.settlementUuid });
  } catch { /* analytics never breaks export */ }
}

export default generateSettlementPDF;
