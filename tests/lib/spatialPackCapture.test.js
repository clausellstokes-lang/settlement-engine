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
