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
 * Place `nCoastal` coastal ports + `nRiver` river ports + `nInland` landlocked
 * settlements on the grid (Phase 5.5 M8 fixtures). Each PORT carries a water-access
 * institution (so geography ∧ institution ⇒ a port); the inland settlements carry a
 * dock TOO (proving geography is NECESSARY — an inland dock is a beach, not a port).
 * Deterministic: seats are collected in codepoint (index) order and taken by stride,
 * ids zero-padded so codepoint sort == placement order.
 * @param {ReturnType<typeof makeGridPack>} pack
 * @param {{ nCoastal?: number, nRiver?: number, nInland?: number,
 *   coastalInstitution?: string, riverInstitution?: string }} [opts]
 */
export function placePortSettlements(pack, {
  nCoastal = 3, nRiver = 2, nInland = 3,
  coastalInstitution = 'Docks/port facilities', riverInstitution = 'River ferry',
} = {}) {
  const { cells } = pack;
  const cellCount = cells.h.length;
  const H = cells.h;
  const R = cells.r;
  const seat = (c) => H[c] >= 20 && H[c] <= 60;
  const isOcean = (c) => c == null || c < 0 || c >= cellCount || !(H[c] >= 20);
  const isCoast = (c) => seat(c) && (cells.c[c] || []).some(isOcean);
  const isRiver = (c) => seat(c) && Number(R[c]) !== 0;
  const coastalSeats = [];
  const riverSeats = [];
  const inlandSeats = [];
  for (let i = 0; i < cellCount; i++) {
    if (isCoast(i)) coastalSeats.push(i);
    else if (isRiver(i)) riverSeats.push(i);
    else if (seat(i)) inlandSeats.push(i);
  }
  const take = (seats, n) => {
    const out = [];
    if (!seats.length || n <= 0) return out;
    const stride = Math.max(1, Math.floor(seats.length / n));
    for (let k = 0; k < n; k++) out.push(seats[Math.min(seats.length - 1, k * stride)]);
    return [...new Set(out)];
  };
  const placements = [];
  let idx = 0;
  const push = (cellId, institutions) => {
    placements.push({ id: `p${String(idx).padStart(3, '0')}`, cellId, institutions });
    idx += 1;
  };
  for (const c of take(coastalSeats, nCoastal)) push(c, [{ name: coastalInstitution }]);
  for (const c of take(riverSeats, nRiver)) push(c, [{ name: riverInstitution }]);
  // Inland settlements ALSO carry a dock — geography must still deny them a port.
  for (const c of take(inlandSeats, nInland)) push(c, [{ name: coastalInstitution }]);
  return placements;
}

/**
 * A tiny hand-built ISLAND pack (Phase 5.5 M8): a mainland block and a separate
 * island block, separated by an impassable ocean channel so NO land route connects
 * them — the frozen land digest gives the island its own disconnected territory
 * (unreachable by land). Placing a port on each side lets the sea lane INVERT the
 * isolation (the island becomes a hub). Returns { pack, placements } with a coastal
 * port on the mainland ('main') and one on the island ('isle'), each with a dock.
 */
export function makeIslandPack() {
  // 6 columns × 3 rows. Column 3 is all ocean (the channel): cols 0..2 = mainland,
  // cols 4..5 = island. Land cells are uniform grassland seats.
  const cols = 6;
  const rows = 3;
  const n = cols * rows;
  const h = new Array(n);
  const biome = new Array(n).fill(BIOME_GRASSLAND);
  const r = new Array(n).fill(0);
  const p = new Array(n);
  const c = new Array(n);
  const idx = (col, row) => row * cols + col;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = idx(col, row);
      p[i] = [col * 50, row * 50];
      h[i] = col === 3 ? 10 : 40; // column 3 is the ocean channel
    }
  }
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
  // Offset the two ports along the channel (different rows) so the water path between
  // their embarkation cells is a real sail (a few cells), not zero — a meaningful sea
  // cost that hopWeeks can distinguish across seasons.
  const placements = [
    { id: 'main', cellId: idx(2, 0), institutions: [{ name: 'Docks/port facilities' }] }, // mainland coast, top
    { id: 'isle', cellId: idx(4, 2), institutions: [{ name: 'Docks/port facilities' }] }, // island coast, bottom
  ];
  return { pack: { cells: { h, biome, r, p, c } }, placements };
}

/**
 * A DISCONNECTED-WATER pack (Phase 5.5 M8 soak): a coast on the LEFT (ocean col 0)
 * and a separate river on the RIGHT (col 5), divided by land — two water bodies with
 * NO connection. Two coastal ports share the sea; a river port sits on the separate
 * river. The sparse edge set must connect the two COASTAL ports and produce NO lane
 * to the river port (no phantom cross-land / cross-sea lane). Returns { pack, placements }.
 */
export function makeDisconnectedWaterPack() {
  const cols = 6;
  const rows = 3;
  const n = cols * rows;
  const h = new Array(n);
  const biome = new Array(n).fill(BIOME_GRASSLAND);
  const r = new Array(n).fill(0);
  const p = new Array(n);
  const c = new Array(n);
  const idx = (col, row) => row * cols + col;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = idx(col, row);
      p[i] = [col * 50, row * 50];
      h[i] = col === 0 ? 10 : 40;         // col 0 = the SEA (ocean strip)
      r[i] = col === 5 ? 1 : 0;           // col 5 = a separate RIVER (land, r=1)
    }
  }
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
  const DOCK = [{ name: 'Docks/port facilities' }];
  const placements = [
    { id: 'coastA', cellId: idx(1, 0), institutions: DOCK }, // borders the sea (col 0)
    { id: 'coastB', cellId: idx(1, 2), institutions: DOCK }, // borders the sea (col 0)
    { id: 'river', cellId: idx(5, 1), institutions: DOCK },  // on the separate river (col 5)
  ];
  return { pack: { cells: { h, biome, r, p, c } }, placements };
}

/**
 * An ISTHMUS pack (Phase 5.5 M8 water-path pricing soak): two ISLAND ports close by
 * straight-line CHORD but far by WATER — a long peninsula (a land wall) forces a ship
 * to sail AROUND it. The correct sea cost is the long water-path, not the short chord
 * (which the old Euclidean pricing under-charged, making distant ports behave adjacent).
 * Because both ports are islands (no land route), the sea lane is always emitted (never
 * land-dominated), so the pricing is directly observable. Returns { pack, placements }.
 */
export function makeIsthmusPack() {
  const cols = 5;
  const rows = 6;
  const n = cols * rows;
  const h = new Array(n).fill(10); // water everywhere by default
  const biome = new Array(n).fill(BIOME_GRASSLAND);
  const r = new Array(n).fill(0);
  const p = new Array(n);
  const c = new Array(n);
  const idx = (col, row) => row * cols + col;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) p[idx(col, row)] = [col * 50, row * 50];
  }
  // Two island cells (isolated land, surrounded by water) — no land route between them.
  h[idx(0, 1)] = 40;
  h[idx(4, 1)] = 40;
  // A peninsula: col 2 from row 0 down to row 4 — a wall a ship must sail around
  // (the only open water crossing is along the bottom row 5).
  for (let row = 0; row <= 4; row++) h[idx(2, row)] = 40;
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
  const DOCK = [{ name: 'Docks/port facilities' }];
  const placements = [
    { id: 'westIsle', cellId: idx(0, 1), institutions: DOCK },
    { id: 'eastIsle', cellId: idx(4, 1), institutions: DOCK },
  ];
  return { pack: { cells: { h, biome, r, p, c } }, placements };
}

/**
 * A MANY-PORT pack (Phase 5.5 M8 soak): a long straight coastline — rows 0..2 ocean,
 * the rest land — so every cell on the first land row is coastal on ONE shared sea.
 * Placing `count` dock settlements along it yields `count` ports in a single water
 * body — the stress case that BLEW the digest cap under the old O(P²) clique. Returns
 * placements the digest builder consumes (with institutions), plus the pack.
 * @param {number} count @param {{ cols?: number, rows?: number }} [opts]
 */
export function makePortCoastPack(count, { cols = 100, rows = 8 } = {}) {
  const n = cols * rows;
  const h = new Array(n);
  const biome = new Array(n).fill(BIOME_GRASSLAND);
  const r = new Array(n).fill(0);
  const p = new Array(n);
  const c = new Array(n);
  const idx = (col, row) => row * cols + col;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = idx(col, row);
      p[i] = [col * 10, row * 10];
      h[i] = row < 3 ? 10 : 40; // rows 0..2 ocean, rows 3+ land ⇒ row 3 is all coast
    }
  }
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
  const DOCK = [{ name: 'Docks/port facilities' }];
  const placements = [];
  for (let k = 0; k < count; k++) {
    placements.push({ id: `p${String(k).padStart(3, '0')}`, cellId: idx(k % cols, 3), institutions: DOCK });
  }
  return { pack: { cells: { h, biome, r, p, c } }, placements };
}

/**
 * Place `nCircle` teleport-CIRCLE settlements (each carrying a 'Teleportation circle',
 * the magic capability M9c reads) + `nPlain` ordinary settlements (no circle — proving
 * the bloc is the clique of HOLDERS, not every settlement) on the grid. Geography is
 * IRRELEVANT to teleport (magic bypasses terrain), so seats are just dispersed land
 * cells. Deterministic: seats collected column-major, taken by stride, ids zero-padded
 * so codepoint sort == placement order. Circle-holders get the LOW ids (t000..) so the
 * bloc nodes are legible in a golden.
 * @param {ReturnType<typeof makeGridPack>} pack
 * @param {{ nCircle?: number, nPlain?: number, institution?: string }} [opts]
 */
export function placeTeleportSettlements(pack, { nCircle = 3, nPlain = 4, institution = 'Teleportation circle' } = {}) {
  const { cols, rows } = pack.meta;
  const H = pack.cells.h;
  const landCells = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const i = row * cols + col;
      if (H[i] >= 20 && H[i] <= 60) landCells.push(i);
    }
  }
  const total = nCircle + nPlain;
  const placements = [];
  if (!landCells.length || total <= 0) return placements;
  const stride = Math.max(1, Math.floor(landCells.length / total));
  for (let k = 0; k < total; k++) {
    const cellId = landCells[Math.min(landCells.length - 1, k * stride)];
    const institutions = k < nCircle ? [{ name: institution }] : [];
    placements.push({ id: `t${String(k).padStart(3, '0')}`, cellId, institutions });
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
