import { describe, test, expect } from 'vitest';

import { lazyChunkLeaks, findEntryRef } from '../../scripts/check-bundle-budget.mjs';

/**
 * Proves the first-paint lazy-chunk guard (review R6 follow-up) is CORRECT and
 * NON-VACUOUS. The 1.8 MB PDF payload and the sim engine are deliberately gated
 * behind user action in vite.config.js and stripped from modulepreload — they must
 * never enter index.html's up-front <script>/modulepreload set. The total-KB ceiling
 * would eventually catch such a leak, but only opaquely; this guard names the exact
 * regression (a static import reaching a deliberately-lazy chunk).
 *
 * Without this test, "the budget passes" could just mean the guard's regex never
 * matches anything — so we assert it stays silent on a healthy first-paint set AND
 * fires for each lazy chunk by its real hashed filename shape.
 */
describe('bundle-budget lazyChunkLeaks — first-paint guard has teeth', () => {
  const healthy = ['index-D0vu1M9N.js', 'vendor-react-SKOiWvso.js', 'vendor-state-Bg-g3ARq.js', 'data-XSm_D-v7.js'];

  test('a healthy first-paint set (entry + vendor + data) reports no leak', () => {
    expect(lazyChunkLeaks(healthy)).toEqual([]);
  });

  test('a leaked vendor-pdf chunk is detected by its hashed filename', () => {
    const leaks = lazyChunkLeaks([...healthy, 'vendor-pdf-BiNWw-M3.js']);
    expect(leaks).toEqual(['vendor-pdf-BiNWw-M3.js']);
  });

  test('a leaked engine chunk is detected', () => {
    const leaks = lazyChunkLeaks([...healthy, 'engine-CItE2vVd.js']);
    expect(leaks).toEqual(['engine-CItE2vVd.js']);
  });

  test('both leaking at once are both reported', () => {
    expect(lazyChunkLeaks(['engine-AAAA1111.js', 'vendor-pdf-BBBB2222.js'])).toHaveLength(2);
  });

  test('a look-alike that is NOT the gated chunk (e.g. engine-adjacent feature) does not false-alarm', () => {
    // Only the exact manualChunks names gate: `engineRoom-x.js` / `pdfExport-x.js` are
    // ordinary lazy feature chunks, not the vendor-pdf/engine payloads.
    expect(lazyChunkLeaks(['engineRoom-CVMcH6dL.js', 'pdfExport-Cn4PYS48.js'])).toEqual([]);
  });
});

/**
 * Proves the entry-KB ceiling has a concrete target. The 960KB entry guard is pinned
 * to Vite's `index-` filename prefix; if that prefix ever changes, findEntryRef must
 * return undefined so main() fails LOUD instead of letting entryBytes stay 0 and the
 * named entry guard go silently vacuous (backstopped only by the loose total).
 */
describe('bundle-budget findEntryRef — entry guard is non-vacuous', () => {
  const healthy = ['index-D0vu1M9N.js', 'vendor-react-SKOiWvso.js', 'vendor-state-Bg-g3ARq.js', 'data-XSm_D-v7.js'];

  test('the entry chunk is found by its index- prefix', () => {
    expect(findEntryRef(healthy)).toBe('index-D0vu1M9N.js');
  });

  test('returns undefined when no ref matches the index- prefix (Vite renamed the entry)', () => {
    // e.g. a future entryFileNames of `app-[hash].js` — the guard would go vacuous,
    // so findEntryRef must signal the miss and main() fails loud on it.
    expect(findEntryRef(['app-D0vu1M9N.js', 'vendor-react-SKOiWvso.js', 'data-XSm_D-v7.js'])).toBeUndefined();
  });

  test('a non-entry chunk that merely contains "index" is not mistaken for the entry', () => {
    // ENTRY_PREFIX anchors at the start, so `reindex-*.js` / `vendor-index-*.js` don't match.
    expect(findEntryRef(['reindex-CVMcH6dL.js', 'vendor-index-Cn4PYS48.js'])).toBeUndefined();
  });
});
