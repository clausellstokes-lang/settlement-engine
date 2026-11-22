/**
 * domain/townMap/arch/occlusionIndex.js -- K-1 GRAMMAR: the FROZEN spatial index.
 *
 * The CGA++ two-phase discipline: the massing pass completes, then a DETERMINISTIC spatial index is
 * frozen over its terminals, and only then do cross-shape events fire + AO bakes -- both reading
 * this immutable index, never the live derivation. Freezing between phases is what makes events +
 * occlusion PERMUTATION-INVARIANT: the index is built from the terminal list SORTED by derivation
 * path, so the same scene yields the same index regardless of the order rules were registered or
 * terminals produced.
 *
 * It answers three questions, all with pure {+,-,*,/} + comparisons (0 transcendental sites):
 *   - solidAt(p)                 : is world point p inside any massing terminal's AABB? (AO + occlude)
 *   - sampleOccupancy(p, dirs, r): the fraction of pinned offset samples around p that land in solid
 *                                  (the per-vertex AO cavity estimate);
 *   - byRole(role) / bySym(sym)  : the sorted terminals of a role/symbol (cross-shape event pairing).
 *
 * @typedef {ReadonlyArray<number>} V3
 * @typedef {{ min: V3, max: V3 }} AABB
 * @typedef {{ path: string, sym: string, role: string, aabb: AABB }} Indexed  the fields the index needs
 * @typedef {{ count: number, solidAt: (p: V3) => boolean, sampleOccupancy: (p: V3, dirs: ReadonlyArray<V3>, radius: number) => number, byRole: (role: string) => ReadonlyArray<Indexed>, bySym: (sym: string) => ReadonlyArray<Indexed>, all: ReadonlyArray<Indexed> }} OcclusionIndex
 */

import { compareCodepoint } from './project.js';

/** point p inside (inclusive) an AABB. @param {V3} p @param {AABB} b @returns {boolean} */
function inAabb(p, b) {
  return p[0] >= b.min[0] && p[0] <= b.max[0]
    && p[1] >= b.min[1] && p[1] <= b.max[1]
    && p[2] >= b.min[2] && p[2] <= b.max[2];
}

/**
 * Build the frozen occlusion index over a list of massing terminals (each carrying at least
 * { path, sym, role, aabb }). The list is copied + sorted by derivation path so the index is
 * permutation-invariant; a coarse uniform grid buckets AABBs for fast occupancy queries (the
 * bucketing is a pure function of the sorted list -- deterministic).
 * @param {ReadonlyArray<Indexed>} terminals
 * @returns {{
 *   count: number,
 *   solidAt: (p: V3) => boolean,
 *   sampleOccupancy: (p: V3, dirs: ReadonlyArray<V3>, radius: number) => number,
 *   byRole: (role: string) => ReadonlyArray<Indexed>,
 *   bySym: (sym: string) => ReadonlyArray<Indexed>,
 *   all: ReadonlyArray<Indexed>,
 * }}
 */
export function buildOcclusionIndex(terminals) {
  const sorted = terminals.slice().sort((a, b) => compareCodepoint(a.path, b.path));

  // Scene bounds + a coarse uniform grid (fixed cell target ~ 24 world units).
  let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const t of sorted) {
    for (let k = 0; k < 3; k++) {
      if (t.aabb.min[k] < mn[k]) mn[k] = t.aabb.min[k];
      if (t.aabb.max[k] > mx[k]) mx[k] = t.aabb.max[k];
    }
  }
  const CELL = 24;
  const has = sorted.length > 0;
  const nx = has ? Math.max(1, Math.ceil((mx[0] - mn[0]) / CELL)) : 1;
  const ny = has ? Math.max(1, Math.ceil((mx[1] - mn[1]) / CELL)) : 1;
  const nz = has ? Math.max(1, Math.ceil((mx[2] - mn[2]) / CELL)) : 1;
  /** @param {number} x @param {number} y @param {number} z @returns {number} */
  const cellId = (x, y, z) => (x * ny + y) * nz + z;
  /** @param {number} v @param {number} lo @param {number} n @returns {number} */
  const clampCell = (v, lo, n) => {
    const c = Math.floor((v - lo) / CELL);
    return c < 0 ? 0 : c >= n ? n - 1 : c;
  };
  /** @type {Map<number, Indexed[]>} */
  const grid = new Map();
  for (const t of sorted) {
    const x0 = clampCell(t.aabb.min[0], mn[0], nx), x1 = clampCell(t.aabb.max[0], mn[0], nx);
    const y0 = clampCell(t.aabb.min[1], mn[1], ny), y1 = clampCell(t.aabb.max[1], mn[1], ny);
    const z0 = clampCell(t.aabb.min[2], mn[2], nz), z1 = clampCell(t.aabb.max[2], mn[2], nz);
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
      const id = cellId(x, y, z);
      const list = grid.get(id);
      if (list) list.push(t); else grid.set(id, [t]);
    }
  }

  /** @param {V3} p @returns {boolean} */
  const solidAt = (p) => {
    if (!has) return false;
    const cx = clampCell(p[0], mn[0], nx), cy = clampCell(p[1], mn[1], ny), cz = clampCell(p[2], mn[2], nz);
    const bucket = grid.get(cellId(cx, cy, cz));
    if (!bucket) return false;
    for (const t of bucket) if (inAabb(p, t.aabb)) return true;
    return false;
  };

  /** @param {V3} p @param {ReadonlyArray<V3>} dirs @param {number} radius @returns {number} */
  const sampleOccupancy = (p, dirs, radius) => {
    if (dirs.length === 0) return 0;
    let hit = 0;
    for (const d of dirs) {
      /** @type {V3} */ const q = [p[0] + d[0] * radius, p[1] + d[1] * radius, p[2] + d[2] * radius];
      if (solidAt(q)) hit++;
    }
    return hit / dirs.length;
  };

  /** @type {Map<string, Indexed[]>} */ const byRoleMap = new Map();
  /** @type {Map<string, Indexed[]>} */ const bySymMap = new Map();
  for (const t of sorted) {
    let rl = byRoleMap.get(t.role); if (!rl) { rl = []; byRoleMap.set(t.role, rl); } rl.push(t);
    let sl = bySymMap.get(t.sym); if (!sl) { sl = []; bySymMap.set(t.sym, sl); } sl.push(t);
  }
  /** @type {ReadonlyArray<Indexed>} */ const EMPTY = Object.freeze([]);

  return Object.freeze({
    count: sorted.length,
    solidAt,
    sampleOccupancy,
    byRole: (role) => byRoleMap.get(role) || EMPTY,
    bySym: (sym) => bySymMap.get(sym) || EMPTY,
    all: sorted,
  });
}
