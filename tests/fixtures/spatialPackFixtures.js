/**
 * spatialPackFixtures.js — deterministic synthetic FMG packs for the spatial
 * keystone invariant suite.
 *
 * We cannot capture a real FMG pack headlessly (the iframe capture is a deferred,
 * fence-bounded seam — see the KEYSTONE report), and we would not WANT to: a
 * golden pinned to a captured 1MB blob is opaque and brittle. Instead these
 * builders synthesize packs with the SAME shape the iframe exposes
 * (cells.h/biome/r/p/c) but with a legible, fully deterministic terrain — a grid
 * of Voronoi-equivalent cells with hills, a mountain ridge, a river, an ocean
 * bay, and biome bands, so the digest exercises every terrain class, real
 * territory boundaries, multi-hop routes, and equal-cost ties.
 *
 * Everything is index-derived (NO Math.random) so a pack is a pure function of
 * its parameters — the determinism the keystone invariants demand.
 */

// FMG biome ids used across the grid bands (see spatialCost BIOME_COST).
const BIOME_GRASSLAND = 4;
const BIOME_DESERT = 1;
const BIOME_FOREST = 6;
const BIOME_WETLAND = 12;
const BIOME_TUNDRA = 10;

/**
 * A cols×rows grid pack. Cell i sits at (col·spacing, row·spacing) with 4-
 * neighbour adjacency (a valid, uniform adjacency graph — the digest math does
 * not assume Voronoi degree). Terrain is a deterministic function of (col,row):
 *   - an OCEAN BAY in the top-left corner (h<20 ⇒ impassable),
 *   - a MOUNTAIN RIDGE down a mid column (h>60 ⇒ the elevation cost premium),
 *   - a RIVER along a mid row (r=1 ⇒ the river bias),
 *   - four BIOME BANDS by quadrant (grassland / desert / forest / wetland) with a
 *     tundra fringe on the last row,
 * so route receipts see every terrain class.
 * @param {{cols:number, rows:number, spacing?:number, bay?:boolean, ridge?:boolean, river?:boolean}} opts
 */
export function makeGridPack({ cols, rows, spacing = 40, bay = true, ridge = true, river = true } = {}) {
  const n = cols * rows;
  const h = new Array(n);
  const biome = new Array(n);
  const r = new Array(n);
  const p = new Array(n);
  const c = new Array(n);
  const ridgeCol = Math.floor(cols * 0.55);
  const riverRow = Math.floor(rows * 0.5);
  const idx = (col, row) => row * cols + col;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = idx(col, row);
      p[i] = [col * spacing, row * spacing];
      // Ocean bay: top-left block (impassable).
      const inBay = bay && col < cols * 0.22 && row < rows * 0.22;
      // Mountain ridge: a mid column (with a gap at the river row so land stays
      // connected across the ridge).
      const onRidge = ridge && col === ridgeCol && !(river && row === riverRow);
      if (inBay) {
        h[i] = 10; // ocean
      } else if (onRidge) {
        h[i] = 78; // mountain (h>60 ⇒ elevMult)
      } else {
        // Gentle land relief 30..55, index-derived (deterministic).
        h[i] = 30 + ((col * 7 + row * 13) % 26);
      }
      // Biome bands by quadrant + a tundra fringe on the last row.
      if (row === rows - 1) biome[i] = BIOME_TUNDRA;
      else if (col < cols / 2 && row < rows / 2) biome[i] = BIOME_GRASSLAND;
      else if (col >= cols / 2 && row < rows / 2) biome[i] = BIOME_DESERT;
      else if (col < cols / 2 && row >= rows / 2) biome[i] = BIOME_FOREST;
      else biome[i] = BIOME_WETLAND;
      // River along a mid row (land cells only).
      r[i] = river && row === riverRow && h[i] >= 20 ? 1 : 0;
    }
  }
  // 4-neighbour adjacency.
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = idx(col, row);
      const nb = [];
      if (col > 0) nb.push(idx(col - 1, row));
      if (col < cols - 1) nb.push(idx(col + 1, row));
      if (row > 0) nb.push(idx(col, row - 1));
      if (row < rows - 1) nb.push(idx(col, row + 1));
      c[i] = nb;
    }
  }
  return { cells: { h, biome, r, p, c }, meta: { cols, rows, spacing } };
}

/**
 * Place `count` settlements on distinct LAND cells spread across the grid by a
 * deterministic column-major stride, each with a stable id. Returns the
 * placements shape the digest builder consumes ([{ id, cellId }]).
 * @param {ReturnType<typeof makeGridPack>} pack
 * @param {number} count
 * @param {string} [prefix]
 */
export function placeSettlements(pack, count, prefix = 's') {
  const { cols, rows } = pack.meta;
  const H = pack.cells.h;
  const landCells = [];
  // Column-major spread so settlements are geographically dispersed, not clustered.
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const i = row * cols + col;
      if (H[i] >= 20 && H[i] <= 60) landCells.push(i); // land, non-mountain seat
    }
  }
  const placements = [];
  if (landCells.length === 0 || count <= 0) return placements;
  const stride = Math.max(1, Math.floor(landCells.length / count));
  for (let k = 0; k < count; k++) {
    const cellId = landCells[Math.min(landCells.length - 1, k * stride)];
    // Zero-padded id so codepoint sort == numeric order (stable seeding).
    placements.push({ id: `${prefix}${String(k).padStart(3, '0')}`, cellId });
  }
  return placements;
}

/**
 * A tiny hand-built pack with an EXACT equal-cost tie: a 1-row corridor of
 * uniform-cost cells with a settlement at each end. The exact-middle cell is
 * equidistant from both — the tie-break (equal tentative ⇒ lower predecessor
 * index) must resolve it deterministically to the same territory every build.
 * Odd length ⇒ a single unambiguous middle cell.
 */
export function makeTiePack() {
  const len = 7; // cells 0..6; middle = cell 3
  const h = new Array(len).fill(40);   // uniform land
  const biome = new Array(len).fill(BIOME_GRASSLAND); // uniform cost
  const r = new Array(len).fill(0);
  const p = Array.from({ length: len }, (_, i) => [i * 50, 0]); // uniform spacing
  const c = Array.from({ length: len }, (_, i) => {
    const nb = [];
    if (i > 0) nb.push(i - 1);
    if (i < len - 1) nb.push(i + 1);
    return nb;
  });
  const placements = [
    { id: 'left', cellId: 0 },
    { id: 'right', cellId: 6 },
  ];
  return { pack: { cells: { h, biome, r, p, c } }, placements, middleCell: 3 };
}
