/**
 * pdfVendorGlobals.test.js — THE GLOBALS @react-pdf's BROWSER BUILD ASSUMES, AND THE
 * ONE IT WAS NEVER GIVEN.
 *
 * ── THE DEFECT (ODQ §934.22 item 4b) ────────────────────────────────────────────
 * The 2026-09-19 browser walk recorded, twice, a console warning whose whole text was
 *
 *     Buffer is not defined
 *
 * with nothing naming its source. It comes from @react-pdf/layout, which ships NO
 * browser build and reads the Node global UNGUARDED in `fetchImage`, one line after
 * the image has already resolved:
 *
 *     node.image = await resolveImage(source, { cache });
 *     if (Buffer.isBuffer(source) || source instanceof Blob) return;
 *     node.image.key = 'data' in source ? source.data.toString() : source.uri;
 *
 * In a browser that throws a ReferenceError, and the enclosing
 * `catch (e) { console.warn(e.message); }` turns it into the bare, unattributable
 * warning above — once per <Image> node per render.
 *
 * ── WHAT IT COSTS, MEASURED ─────────────────────────────────────────────────────
 * The image still DRAWS: `node.image` was assigned before the throw. The line that
 * never runs is the one after it, so `node.image.key` stays undefined — and
 * @react-pdf/render's `drawImage` keys its per-document image cache on exactly that
 * (`const cacheKey = image.key`, with `imageCache.set` guarded by `if (cacheKey)`).
 * Every draw of the same image therefore misses the cache and re-embeds the bytes as
 * a fresh PDF image object. No corruption; a heavier artifact, and two warnings.
 *
 * ── WHAT THIS FILE PINS ─────────────────────────────────────────────────────────
 *   1. The shim really installs a `Buffer`, and its `isBuffer` answers CORRECTLY —
 *      true for a feross/buffer instance (the only kind that bundle can produce),
 *      false for the `{ uri }` / `{ data }` source objects react-pdf hands it, and
 *      false for the plain Uint8Arrays fontkit clones.
 *   2. Both render paths reach the shim: the worker imports it first (the window half
 *      is already pinned in tests/build/vendorPdfLazy.test.js), and the main-thread
 *      fallback imports it before it resolves @react-pdf.
 *   3. THE REASON IS RE-DERIVED FROM THE INSTALLED DEPENDENCY, not asserted in prose.
 *      The unguarded `Buffer.isBuffer` is read out of node_modules on every run. When
 *      @react-pdf fixes it, this arm reds and the shim can retire — which is the
 *      outcome to want, and the opposite of a workaround that outlives its cause.
 */

import { describe, expect, test, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const LAYOUT = 'node_modules/@react-pdf/layout/lib/index.js';
const SHIM = 'src/utils/pdfWorkerShim.js';
const WORKER = 'src/utils/pdfRender.worker.js';
const MAIN_THREAD = 'src/utils/generateSettlementPDF.js';

describe('the PDF vendor graph reads a bare `Buffer`, and the shim answers it', () => {
  test('the cause is still real: @react-pdf/layout reads Buffer unguarded, in a catch that warns', () => {
    // ⛔ RE-DERIVED, NOT REMEMBERED. If this reds, read the message before touching it.
    expect(existsSync(join(ROOT, LAYOUT)), `${LAYOUT} is missing — has @react-pdf's layout package moved?`).toBe(true);
    const src = read(LAYOUT);
    expect(
      /Buffer\.isBuffer\s*\(/.test(src),
      `\n@react-pdf/layout no longer reads a bare \`Buffer\`. THE SHIM'S REASON IS GONE:\n`
      + `remove the Buffer half of ${SHIM} and this test with it, rather than carrying a\n`
      + 'polyfill for a bug the dependency has fixed.\n',
    ).toBe(true);
    // …and the read really is inside a catch that only warns, which is why it was silent.
    expect(
      /catch\s*\([^)]*\)\s*\{\s*console\.warn\(/.test(src),
      'the swallowing catch is gone — re-read how the failure now surfaces',
    ).toBe(true);
  });

  test('the shim installs Buffer, and isBuffer answers correctly in both directions', async () => {
    // The module is a side-effecting import; vitest's node env has no Buffer-free
    // global, so the install is exercised against a cleared slot.
    const had = Object.prototype.hasOwnProperty.call(globalThis, 'Buffer');
    const saved = globalThis.Buffer;
    try {
      delete globalThis.Buffer;
      // `vi.resetModules()` rather than a cache-busting query: Vite's dynamic-import
      // helper refuses a template specifier it cannot statically analyse, and the
      // module registry is what has to be cleared for a side-effecting import to run
      // its body a second time.
      vi.resetModules();
      await import('../../src/utils/pdfWorkerShim.js');
      expect(typeof globalThis.Buffer, 'the shim installed no Buffer').toBe('object');
      const { isBuffer } = globalThis.Buffer;
      expect(typeof isBuffer).toBe('function');

      // TRUE only for the feross/buffer marker — the only buffer that bundle can mint.
      expect(isBuffer({ _isBuffer: true }), 'a feross buffer is not recognised').toBe(true);

      // FALSE for everything react-pdf and fontkit actually hand it. Each of these is a
      // real shape from the paths named in the docblock.
      for (const [what, value] of [
        ['a resolved {uri} source', { uri: 'https://example.test/seal.png' }],
        ['a resolved {data} source', { data: new Uint8Array([1, 2, 3]) }],
        ['a plain Uint8Array (fontkit reads fonts as these)', new Uint8Array([1, 2, 3])],
        ['an ArrayBuffer', new ArrayBuffer(8)],
        ['null', null],
        ['undefined', undefined],
        ['a string', '#hex'],
        ['a bare object', {}],
      ]) {
        expect(isBuffer(value), `isBuffer said TRUE for ${what}`).toBe(false);
      }
    } finally {
      if (had) globalThis.Buffer = saved; else delete globalThis.Buffer;
    }
  });

  test('the shim never overwrites a real Buffer (Node, and any future platform that has one)', () => {
    const src = read(SHIM);
    expect(
      /typeof\s+globalThis\.Buffer\s*===\s*'undefined'/.test(src),
      'the Buffer install is no longer guarded — it would clobber Node\'s own Buffer',
    ).toBe(true);
  });

  test('both render paths reach the shim', () => {
    // The worker: already first-import-pinned for `window` by vendorPdfLazy; asserted
    // here too because the Buffer half depends on the same import, and a reader of this
    // file should not have to go and find that out.
    expect(read(WORKER)).toContain("import './pdfWorkerShim.js'");

    // The main thread: the fallback renders the SAME document with the SAME vendor graph,
    // so it needs the same global. Dynamic, so the eager closure is untouched.
    const main = read(MAIN_THREAD);
    const shimAt = main.indexOf("import('./pdfWorkerShim.js')");
    const rendererAt = main.indexOf("import('@react-pdf/renderer')");
    expect(shimAt, `${MAIN_THREAD} must import the shim on the main-thread fallback`).toBeGreaterThanOrEqual(0);
    expect(rendererAt, 'the main-thread fallback no longer imports the renderer').toBeGreaterThanOrEqual(0);
    expect(shimAt, 'the shim must be awaited BEFORE the renderer resolves').toBeLessThan(rendererAt);
    expect(
      /await import\('\.\/pdfWorkerShim\.js'\)/.test(main),
      'the shim import must be AWAITED — an unawaited import races the first render',
    ).toBe(true);
  });

  test('the shim stays off the eager first-paint closure (no static import of it in src/)', () => {
    // Its only static importer is the worker entry, which is its own bundle.
    const offenders = [];
    for (const rel of [MAIN_THREAD, 'src/main.jsx', 'src/App.jsx']) {
      if (!existsSync(join(ROOT, rel))) continue;
      if (/^import .*pdfWorkerShim/m.test(read(rel))) offenders.push(rel);
    }
    expect(offenders, 'a STATIC import of the shim would drag it toward first paint').toEqual([]);
  });
});
