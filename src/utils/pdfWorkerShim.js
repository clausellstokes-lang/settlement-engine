/**
 * pdfWorkerShim.js — worker-scope globals for @react-pdf/renderer.
 *
 * @react-pdf's browser build assumes a `window` global exists (it reads
 * `window.navigator.msSaveBlob` in its download-link path, and vendored code
 * may probe `window.*` elsewhere). A module Worker has `self` but no `window`,
 * so evaluating the vendor bundle inside a worker can throw before any render
 * starts (the F41 investigation blocker).
 *
 * Aliasing `window` to the worker global fixes the whole class: workers DO
 * have `self.navigator` (WorkerNavigator), `fetch`, `Blob`, `URL`, and
 * `MessageChannel` — everything @react-pdf's render path actually uses — so
 * once `window` resolves, the vendor code runs unmodified off the main thread.
 *
 * MUST be imported FIRST in pdfRender.worker.js — ES module graphs evaluate
 * dependencies depth-first in import order, so this side effect runs before
 * @react-pdf/renderer's module scope executes. Enforced by the source
 * contract in tests/build/vendorPdfLazy.test.js.
 *
 * No-op on the main thread (window already exists) and in node test envs
 * (no `self`), so importing it anywhere is always safe.
 */
if (typeof window === 'undefined' && typeof self !== 'undefined') {
  self.window = self;
}
