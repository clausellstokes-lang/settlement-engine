/**
 * SEAM-3 pins — the provenance-stamped capture sidecar (DESIGN_FMG_WEAVE W-SEAM,
 * A1.2.10; Q-W1 pre-ruled: it SHIPS, pure additive, absent = byte-identical).
 *
 * The sidecar exists to replace an INFERENCE with a RECORD. SEAM-2 had to decide whether a
 * placement's stored coordinates belong to the pack being captured by hunting for a
 * witness row; these pins prove the stamp answers that question directly, that it fails in
 * the safe direction on every version mismatch, and — the arm that matters most — that a
 * canon frozen without one is completely untouched.
 */
import { describe, test, expect } from 'vitest';
import {
  buildCaptureSidecar,
  compareCaptureSidecar,
  sidecarReceiptRow,
  CAPTURE_SIDECAR_VERSION,
  SIDECAR_VERDICTS,
} from '../../../src/domain/spatial/captureSidecar.js';

/** A small readable pack in the shape the bridge returns. */
function packOf(points, heights) {
  return { cellCount: points.length, cells: { p: points, h: heights } };
}
const P = [[0, 0], [10, 0], [0, 10], [10, 10], [5, 5]];
const H = [12, 40, 55, 8, 70];
const BASE = packOf(P, H);

describe('SEAM-3 — the stamp identifies a geometry', () => {
  test('the same pack stamps identically, twice', () => {
    expect(buildCaptureSidecar(BASE)).toEqual(buildCaptureSidecar(BASE));
  });

  test('a stamp carries its own version and the lattice size', () => {
    const s = buildCaptureSidecar(BASE);
    expect(s.version).toBe(CAPTURE_SIDECAR_VERSION);
    expect(s.cellCount).toBe(5);
    expect(typeof s.positionHash).toBe('string');
    expect(typeof s.heightHash).toBe('string');
  });

  test('MOVED CENTROIDS change the position hash — the thing coordinates resolve against', () => {
    const moved = packOf([[0, 0], [10, 0], [0, 10], [10, 10], [6, 5]], H);
    expect(buildCaptureSidecar(moved).positionHash).not.toBe(buildCaptureSidecar(BASE).positionHash);
  });

  test('a y-only move is still seen (both halves of a point participate)', () => {
    const movedY = packOf([[0, 0], [10, 0], [0, 10], [10, 10], [5, 6]], H);
    expect(buildCaptureSidecar(movedY).positionHash).not.toBe(buildCaptureSidecar(BASE).positionHash);
  });

  test('re-terraformed heights change the height hash but NOT the position hash', () => {
    const reterrained = packOf(P, [99, 1, 2, 3, 4]);
    const a = buildCaptureSidecar(BASE);
    const b = buildCaptureSidecar(reterrained);
    expect(b.positionHash).toBe(a.positionHash);
    expect(b.heightHash).not.toBe(a.heightHash);
  });

  test('the delimiter is load-bearing — [1,23] must not stamp as [12,3]', () => {
    // Without a separator these two render the same characters, which is exactly the
    // collision a provenance stamp cannot afford.
    const a = buildCaptureSidecar(packOf([[1, 0], [23, 0]], [1, 23]));
    const b = buildCaptureSidecar(packOf([[12, 0], [3, 0]], [12, 3]));
    expect(a.heightHash).not.toBe(b.heightHash);
    expect(a.positionHash).not.toBe(b.positionHash);
  });

  test('frame fields are TOLERATED-ABSENT, and present only when observed', () => {
    const bare = buildCaptureSidecar(BASE);
    expect(Object.prototype.hasOwnProperty.call(bare, 'graphWidth')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(bare, 'mapSeed')).toBe(false);
    const framed = buildCaptureSidecar(BASE, { graphWidth: 1000, graphHeight: 600, mapSeed: 's', mapKind: 'atoll' });
    expect(framed).toMatchObject({ graphWidth: 1000, graphHeight: 600, mapSeed: 's', mapKind: 'atoll' });
  });

  test('an unreadable pack stamps NOTHING rather than an empty stamp', () => {
    for (const bad of [null, undefined, {}, { cells: {} }, packOf([], [])]) {
      expect(buildCaptureSidecar(/** @type {any} */ (bad))).toBeNull();
    }
  });
});

describe('SEAM-3 — the comparison answers in typed words', () => {
  const stored = buildCaptureSidecar(BASE);

  test('the same geometry is CONFIRMED', () => {
    const c = compareCaptureSidecar(stored, BASE);
    expect(c.verdict).toBe(SIDECAR_VERDICTS.CONFIRMED);
    expect(c.matched).toBe(true);
  });

  test('a same-sized lattice with moved points is REGRAPHED, not confirmed', () => {
    const moved = packOf([[0, 0], [10, 0], [0, 10], [10, 10], [6, 5]], H);
    const c = compareCaptureSidecar(stored, moved);
    expect(c.verdict).toBe(SIDECAR_VERDICTS.REGRAPHED);
    expect(c.matched).toBe(false);
  });

  test('a different lattice size is CHANGED', () => {
    const bigger = packOf([...P, [1, 1]], [...H, 5]);
    expect(compareCaptureSidecar(stored, bigger).verdict).toBe(SIDECAR_VERDICTS.CHANGED);
  });

  test('an unreadable pack yields UNREADABLE — never a false confirmation', () => {
    expect(compareCaptureSidecar(stored, null).verdict).toBe(SIDECAR_VERDICTS.UNREADABLE);
  });
});

describe('SEAM-3 — version mismatches RECEIPT and never silently degrade (A1.2.10)', () => {
  test('an UNDER-versioned stamp is refused, not partially read', () => {
    const old = { ...buildCaptureSidecar(BASE), version: CAPTURE_SIDECAR_VERSION - 1 };
    const c = compareCaptureSidecar(old, BASE);
    expect(c.verdict).toBe(SIDECAR_VERDICTS.UNDER_VERSIONED);
    // The fields would have MATCHED. Reporting `confirmed` off a schema we do not fully
    // understand is the silent degradation the amendment forbids by name — the receipt
    // would look complete and would not be.
    expect(c.matched).toBe(false);
  });

  test('an OVER-versioned stamp is equally refused', () => {
    const future = { ...buildCaptureSidecar(BASE), version: CAPTURE_SIDECAR_VERSION + 1 };
    expect(compareCaptureSidecar(future, BASE).verdict).toBe(SIDECAR_VERDICTS.OVER_VERSIONED);
  });

  test('a stamp with NO version is treated as under-versioned', () => {
    const { version: _v, ...noVersion } = buildCaptureSidecar(BASE);
    expect(compareCaptureSidecar(noVersion, BASE).verdict).toBe(SIDECAR_VERDICTS.UNDER_VERSIONED);
  });

  test('every mismatch produces a receipt row naming both versions', () => {
    const old = { ...buildCaptureSidecar(BASE), version: 0 };
    const row = sidecarReceiptRow(compareCaptureSidecar(old, BASE));
    expect(row).toMatchObject({
      reason: SIDECAR_VERDICTS.UNDER_VERSIONED,
      storedVersion: 0,
      expectedVersion: CAPTURE_SIDECAR_VERSION,
    });
  });
});

describe('SEAM-3 — DORMANCY: an old canon is untouched', () => {
  test('an ABSENT stamp compares to ABSENT — it can never refuse an old canon', () => {
    for (const nothing of [null, undefined, '', 0, false]) {
      const c = compareCaptureSidecar(/** @type {any} */ (nothing), BASE);
      expect(c.verdict).toBe(SIDECAR_VERDICTS.ABSENT);
      expect(c.matched).toBe(false);
    }
  });

  test('an ABSENT stamp writes NO receipt row', () => {
    expect(sidecarReceiptRow(compareCaptureSidecar(null, BASE))).toBeNull();
  });

  test('a CONFIRMED match also writes no row — a receipt records the unexpected', () => {
    // Otherwise every future canon would carry a key that says nothing happened.
    expect(sidecarReceiptRow(compareCaptureSidecar(buildCaptureSidecar(BASE), BASE))).toBeNull();
  });
});
