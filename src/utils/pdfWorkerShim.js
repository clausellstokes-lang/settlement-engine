/**
 * pdfWorkerShim.js — the globals @react-pdf/renderer's browser build assumes.
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

/**
 * ⛔ AND `Buffer`, WHICH IS NOT A WORKER PROBLEM AT ALL — IT IS MISSING ON BOTH
 * RENDER PATHS (ODQ §934.22 item 4b).
 *
 * `@react-pdf/layout` ships NO browser build, and its `fetchImage` reads the Node
 * global unguarded, one line after the image has already resolved:
 *
 *     node.image = await resolveImage(source, { cache });
 *     if (Buffer.isBuffer(source) || source instanceof Blob) return;
 *     node.image.key = 'data' in source ? source.data.toString() : source.uri;
 *
 * In a browser that line throws `ReferenceError: Buffer is not defined`, and the
 * enclosing `catch (e) { console.warn(e.message); }` swallows it — which is why the
 * 2026-09-19 walk saw a bare `Buffer is not defined` warning twice, from a PDF export,
 * with nothing naming the source.
 *
 * WHAT IT ACTUALLY COSTS, measured rather than guessed: the image still DRAWS, because
 * `node.image` was assigned before the throw. What never runs is the line after it, so
 * `node.image.key` stays undefined — and `@react-pdf/render`'s `drawImage` keys its
 * per-document image cache on exactly that (`const cacheKey = image.key`, and the
 * `imageCache.set` beside it is guarded by `if (cacheKey)`). Every draw of the same
 * image therefore MISSES the cache and re-embeds the bytes as a fresh PDF image object.
 * No corruption, a heavier file, and two warnings a reader could not attribute.
 *
 * ⚠ THE SHIM IS THE NARROWEST THING THAT CURES IT, AND ITS ONE SIDE EFFECT IS NAMED.
 * `isBuffer` is the only member the vendor graph reads off a BARE `Buffer` — every
 * other Buffer in that bundle is a module-local copy of feross/buffer that Rollup
 * renames, never a global. The predicate is feross/buffer's own marker (`_isBuffer`),
 * so it answers TRUE for a real buffer from that bundled implementation and FALSE for
 * the `{ uri }` / `{ data }` source objects react-pdf actually hands it.
 *
 * The side effect: `clone` (bundled via fontkit) gates its Buffer branch on
 * `typeof Buffer < "u"`, which was false and is now true. That branch is still only
 * reachable for a value carrying `_isBuffer === true`, and fontkit clones font data it
 * read through `fetch(...).arrayBuffer()` — plain `Uint8Array`s — so nothing on that
 * path can enter it. Pinned by tests/build/pdfVendorGlobals.test.js.
 *
 * Installed here, next to the `window` alias, because this module is already THE place
 * this estate keeps "globals the vendor bundle assumes". The worker imports it first;
 * the main-thread fallback (utils/generateSettlementPDF.js) reaches it by dynamic
 * import beside @react-pdf, so the eager first-paint closure is untouched on both.
 */
if (typeof globalThis !== 'undefined' && typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = {
    /** @param {unknown} value */
    isBuffer: (value) => !!value && typeof value === 'object'
      && /** @type {{ _isBuffer?: unknown }} */ (value)._isBuffer === true,
  };
}
