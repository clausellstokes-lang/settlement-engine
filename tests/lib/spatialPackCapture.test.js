/**
 * tests/lib/spatialPackCapture.test.js — the FREEZE-FIRST guard.
 *
 * The live pack.cells capture (src/lib/spatialPackCapture.js, wired by 5.5-M)
 * reads the FMG iframe TWICE and, per the keystone's freeze-first ruling,
 * canonizes the FIRST capture regardless of whether the second read matches —
 * a hypothetical iframe non-determinism can never corrupt the frozen digest.
 *
 * That double-read path had NO automated coverage: the store's spatial-canon
 * tests inject fixture captures that bypass captureSpatialPack entirely, so a
 * refactor could silently break the "return the FIRST pack" guarantee. This is
 * the structural-prevention guard for that path — it injects a fake bridge whose
 * two getSpatialPack reads DIFFER and asserts (a) the FIRST capture is returned,
 * never the second, and (b) the freeze-first warning fires; plus the matching
 * case where two identical reads produce no warning.
 *
 * Uses the REAL registry (registerSpatialCaptureBridge) rather than a module
 * mock, so it also exercises the registry handoff the store relies on.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { captureSpatialPack } from '../../src/lib/spatialPackCapture.js';
import {
  registerSpatialCaptureBridge,
  unregisterSpatialCaptureBridge,
} from '../../src/lib/spatialCaptureRegistry.js';

// A minimal but shape-valid cells object: h (heights) and c (adjacency) must be
// non-empty for captureSpatialPack to accept the pack (spatialPackCapture.js:87).
function cells(heights) {
  return { h: [...heights], biome: heights.map(() => 0), r: heights.map(() => 0), c: [[1], [0], []] };
}

// State with exactly one valid placement so placementsFor returns a non-empty
// list (empty ⇒ the function returns null before we can observe freeze-first).
function stateWithOnePlacement() {
  return {
    mapState: { placements: { burg1: { settlementId: 's1', cellId: 5 } } },
    campaigns: [],
    savedSettlements: [],
  };
}

describe('spatialPackCapture — freeze-first double-read', () => {
  let warnSpy;
  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warnSpy.mockRestore();
    unregisterSpatialCaptureBridge();
  });

  it('freezes the FIRST capture and warns when two reads of the same map differ', async () => {
    const firstPack = { cells: cells([1, 2, 3]) };
    const secondPack = { cells: cells([9, 9, 9]) }; // deliberately different terrain
    let reads = 0;
    registerSpatialCaptureBridge({
      isReady: true,
      getSpatialPack: async () => ({ pack: reads++ === 0 ? firstPack : secondPack }),
    });

    const result = await captureSpatialPack({ campaignId: 'c1', get: stateWithOnePlacement });

    expect(result).not.toBeNull();
    // The FROZEN capture is the FIRST read, never the divergent second one.
    expect(result.pack).toBe(firstPack);
    expect(reads).toBe(2); // it did perform the second (evidence) read
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('freeze-first ruling');
  });

  it('does NOT warn when two reads of a static map match, and still returns the first pack', async () => {
    // Two independent reads that happen to be byte-identical (the real, deterministic case).
    registerSpatialCaptureBridge({
      isReady: true,
      getSpatialPack: async () => ({ pack: { cells: cells([4, 5, 6]) } }),
    });

    const result = await captureSpatialPack({ campaignId: 'c1', get: stateWithOnePlacement });

    expect(result).not.toBeNull();
    expect(result.pack.cells.h).toEqual([4, 5, 6]);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('SEAM-0: a composer-minted cellId:null is COERCED to cell 0, not dropped', async () => {
    // W-SEAM SEAM-0 — EXECUTION VERIFICATION, and the review's premise REFUTED.
    //
    // The §727 review and the V-BRIDGE/V-VAR appendices both read the guard below
    //   const cellId = Number(pl?.cellId);
    //   if (!id || !Number.isInteger(cellId)) continue;
    // as dropping every composer-minted `cellId: null` row, predicting that an
    // untouched Instant World cannot spatially canonize at all (capture returns
    // null ⇒ `spatial_capture_unavailable`). It does NOT drop them:
    // `Number(null) === 0` and `Number.isInteger(0) === true`, so every null cellId
    // is silently coerced to MAP CELL 0.
    //
    // ⚠ THIS TEST PINS A DEFECT, DELIBERATELY. It is the reproduce half of a
    // reproduce-then-clear pair: SEAM-2 re-resolves the cell from the stored x/y at
    // capture and RE-RECORDS this expectation in the same act. Do not "fix" the
    // expectation without the repair.
    registerSpatialCaptureBridge({
      isReady: true,
      getSpatialPack: async () => ({ pack: { cells: cells([40, 40, 40]) } }),
    });
    const result = await captureSpatialPack({
      campaignId: 'c1',
      get: () => ({
        // Exactly the composer's minted placement shape — pinned at its mint site in
        // tests/lib/instantWorld/composeInstantWorld.test.js.
        mapState: { placements: { iw_b0: { settlementId: 's1', x: 500, y: 300, cellId: null } } },
        campaigns: [],
        savedSettlements: [],
      }),
    });

    expect(result).not.toBeNull();
    expect(result.placements).toEqual([{ id: 's1', cellId: 0, institutions: [] }]);
  });

  it('SEAM-0 control: an ABSENT cellId key IS dropped, and that is the only shape the guard catches', async () => {
    // The negative control that isolates the mechanism (LANE-LAW §3: a control that
    // cannot fail proves nothing). `Number(undefined) === NaN`, so a placement whose
    // cellId KEY is missing is genuinely dropped — and with no rows left the capture
    // returns null, which is the lockout the review predicted. The composer never
    // writes that shape: it writes an explicit `cellId: null`. So the predicted
    // lockout is real only for a shape nothing in the tree mints.
    registerSpatialCaptureBridge({
      isReady: true,
      getSpatialPack: async () => ({ pack: { cells: cells([40, 40, 40]) } }),
    });
    const result = await captureSpatialPack({
      campaignId: 'c1',
      get: () => ({
        mapState: { placements: { iw_b0: { settlementId: 's1', x: 500, y: 300 } } },
        campaigns: [],
        savedSettlements: [],
      }),
    });

    expect(result).toBeNull();
  });

  it('a failing second read never blocks canonize — the first capture still returns', async () => {
    const firstPack = { cells: cells([7, 8]) };
    let reads = 0;
    registerSpatialCaptureBridge({
      isReady: true,
      getSpatialPack: async () => {
        if (reads++ === 0) return { pack: firstPack };
        throw new Error('iframe went away between reads');
      },
    });

    const result = await captureSpatialPack({ campaignId: 'c1', get: stateWithOnePlacement });

    expect(result).not.toBeNull();
    expect(result.pack).toBe(firstPack);
    expect(warnSpy).not.toHaveBeenCalled(); // a thrown second read is swallowed, not warned
  });
});
