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
import { captureSpatialPack, resolvePlacementCells } from '../../src/lib/spatialPackCapture.js';
import {
  registerSpatialCaptureBridge,
  unregisterSpatialCaptureBridge,
} from '../../src/lib/spatialCaptureRegistry.js';
import { makeGridPack } from '../fixtures/spatialPackFixtures.js';

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

  it('SEAM-0/SEAM-2: a composer-minted cellId:null no longer becomes cell 0 — it resolves or it refuses', async () => {
    // W-SEAM SEAM-0 found this and SEAM-2 repaired it; this is the CLEAR half of a
    // reproduce-then-clear pair, re-recorded in SEAM-2's own act.
    //
    // The review and both verification appendices read the old guard
    //   const cellId = Number(pl?.cellId);
    //   if (!id || !Number.isInteger(cellId)) continue;
    // as dropping every composer-minted `cellId: null` row, and predicted that an
    // untouched Instant World simply could not canonize. It did not drop them:
    // `Number(null) === 0` and `Number.isInteger(0) === true`, so EVERY null cellId was
    // admitted as MAP CELL 0 and the realm froze a canon in which every member stood on
    // index 0 — a false canon, worse than the predicted lockout because it is silent.
    //
    // Now the null stays null. With no witness that these coordinates belong to the
    // captured pack's frame, the row is not remapped and not admitted: it is receipted
    // `frame_unverified`, the placement list comes back EMPTY, and the store refuses.
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
    expect(result.placements).toEqual([]);
    expect(result.cellResolution).toEqual([{ id: 's1', from: null, to: null, reason: 'frame_unverified' }]);
  });

  it('SEAM-0/SEAM-2: an ABSENT cellId key reaches the same honest answer as an explicit null', async () => {
    // The negative control that isolated the mechanism at SEAM-0 (LANE-LAW §3): before
    // the repair, a MISSING cellId key took a different path from an explicit null,
    // because `Number(undefined)` is NaN while `Number(null)` is 0 — so the guard fired
    // for a shape nothing in the tree mints and stayed silent for the one it does.
    // Kept as a control: the two shapes must now agree, which is the point of the fix.
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

    expect(result.placements).toEqual([]);
    expect(result.cellResolution).toEqual([{ id: 's1', from: null, to: null, reason: 'frame_unverified' }]);
  });

  it('SEAM-1: the declared terrain rides the placement row, and ONLY when one is declared', async () => {
    // W-SEAM SEAM-1 (S3). The digest cannot compare the settlement's own terrain with
    // the ground under it unless that terrain travels with the placement — the same
    // additive discipline the institution roster and the magic truth already use.
    // PRESENT-GUARDED: a settlement that declares nothing carries NO key, so an
    // existing capture's row shape (and every digest built from it) is unchanged.
    registerSpatialCaptureBridge({
      isReady: true,
      getSpatialPack: async () => ({ pack: { cells: cells([40, 40, 40]) } }),
    });
    const result = await captureSpatialPack({
      campaignId: 'c1',
      get: () => ({
        mapState: {
          placements: {
            b1: { settlementId: 'declares', cellId: 1 },
            b2: { settlementId: 'silent', cellId: 2 },
          },
        },
        campaigns: [],
        savedSettlements: [
          { id: 'declares', settlement: { config: { terrainType: 'coastal' } } },
          { id: 'silent', settlement: { config: { priorityEconomy: 20 } } },
        ],
      }),
    });

    const byId = Object.fromEntries(result.placements.map(p => [p.id, p]));
    expect(byId.declares.terrainType).toBe('coastal');
    expect('terrainType' in byId.silent).toBe(false);
  });

  it('SEAM-1: the auto sentinel is not a terrain, so it never reaches the receipt', async () => {
    // resolveTerrain's postcondition — 'auto' is a UI sentinel the wizard writes to
    // terrainOverride, never a terrain. Stamping it would put an un-typed word into a
    // frozen digest (finite semantics: typed buckets only).
    registerSpatialCaptureBridge({
      isReady: true,
      getSpatialPack: async () => ({ pack: { cells: cells([40, 40, 40]) } }),
    });
    const result = await captureSpatialPack({
      campaignId: 'c1',
      get: () => ({
        mapState: { placements: { b1: { settlementId: 'sentinel', cellId: 1 } } },
        campaigns: [],
        savedSettlements: [{ id: 'sentinel', settlement: { config: { terrainOverride: 'auto' } } }],
      }),
    });

    expect('terrainType' in result.placements[0]).toBe(false);
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

describe('SEAM-2 — capture-time cell re-resolution, and the frame it refuses to assume', () => {
  // A 4x3 grid at spacing 40, so cell (col,row) sits at [col*40, row*40] and cell
  // index is row*4+col. Every cell is land.
  const grid = () => makeGridPack({ cols: 4, rows: 3, spacing: 40, bay: false, ridge: false, river: false });
  const at = (col, row) => row * 4 + col;

  it('re-derives a missing cell once one placement WITNESSES the coordinate frame', () => {
    const pack = grid();
    // The witness: its stored cell is exactly what nearestCellTo reproduces from its own
    // coordinates, which is only true if those coordinates are in this pack's map space
    // (the iframe minted that id with findCell over this same cells.p).
    const staged = [
      { id: 'witness', cellId: at(1, 1), x: 40, y: 40, institutions: [] },
      { id: 'orphan', cellId: null, x: 80, y: 0, institutions: [] },
    ];
    const { placements, cellResolution } = resolvePlacementCells(staged, pack);

    expect(placements).toEqual([
      { id: 'witness', cellId: at(1, 1), institutions: [] },
      { id: 'orphan', cellId: at(2, 0), institutions: [] },
    ]);
    expect(cellResolution).toEqual([
      { id: 'orphan', from: null, to: at(2, 0), reason: 'cell_derived' },
    ]);
  });

  it('REPORTS a stored cell its coordinates disagree with, and does NOT switch the seed', () => {
    // A stale index that lands on another valid land cell passes every existing check
    // and seeds territory at the wrong place, frozen forever. This car makes it VISIBLE.
    // Switching the seed of an existing canon is a louder act that owes its own
    // declaration, so the emitted placement keeps the stored cell.
    const pack = grid();
    const staged = [
      { id: 'witness', cellId: at(1, 1), x: 40, y: 40, institutions: [] },
      { id: 'stale', cellId: at(0, 0), x: 120, y: 80, institutions: [] },
    ];
    const { placements, cellResolution } = resolvePlacementCells(staged, pack);

    expect(placements[1]).toEqual({ id: 'stale', cellId: at(0, 0), institutions: [] });
    expect(cellResolution).toEqual([
      { id: 'stale', from: at(0, 0), to: at(3, 2), reason: 'cell_remapped' },
    ]);
  });

  it('remaps NOTHING when no placement can witness the frame', () => {
    // Every stored cell is stale, so none reproduces itself from its own coordinates.
    // The honest answer is not to guess a transform: leave the stored cells alone and
    // admit nothing new.
    const pack = grid();
    const staged = [
      { id: 'a', cellId: at(0, 0), x: 120, y: 80, institutions: [] },
      { id: 'b', cellId: null, x: 40, y: 40, institutions: [] },
    ];
    const { placements, cellResolution } = resolvePlacementCells(staged, pack);

    expect(placements).toEqual([{ id: 'a', cellId: at(0, 0), institutions: [] }]);
    expect(cellResolution).toEqual([
      { id: 'b', from: null, to: null, reason: 'frame_unverified' },
    ]);
  });

  it('carries the institution roster, the magic truth and the declared terrain through untouched', () => {
    const pack = grid();
    const staged = [{
      id: 'witness', cellId: at(1, 1), x: 40, y: 40,
      institutions: [{ name: 'Docks/port facilities' }], magicExists: false, terrainType: 'coastal',
    }];
    const { placements } = resolvePlacementCells(staged, pack);
    expect(placements[0]).toEqual({
      id: 'witness', cellId: at(1, 1),
      institutions: [{ name: 'Docks/port facilities' }], magicExists: false, terrainType: 'coastal',
    });
    // The stored coordinates are TRANSPORT ONLY — they never reach the digest.
    expect('x' in placements[0]).toBe(false);
    expect('y' in placements[0]).toBe(false);
  });

  it('never writes mapState.placements — the whole pass is a read-only projection', async () => {
    const pack = grid();
    const placementsState = {
      b1: { settlementId: 'witness', x: 40, y: 40, cellId: at(1, 1) },
      b2: { settlementId: 'orphan', x: 80, y: 0, cellId: null },
    };
    const before = JSON.stringify(placementsState);
    registerSpatialCaptureBridge({ isReady: true, getSpatialPack: async () => ({ pack }) });
    const result = await captureSpatialPack({
      campaignId: 'c1',
      get: () => ({ mapState: { placements: placementsState }, campaigns: [], savedSettlements: [] }),
    });
    expect(result.placements.length).toBe(2);
    expect(JSON.stringify(placementsState), 'the store rows must be untouched').toBe(before);
  });
});
