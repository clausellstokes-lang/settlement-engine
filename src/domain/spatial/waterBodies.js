/**
 * waterBodies.js — W-CAP CAP-4 / design §2 D2: THE ONE WATER FLOOD-FILL HOME.
 *
 * D2's ruling, verbatim: `seaLanes.waterComponents` (private) is promoted to a shared
 * module producing BOTH views — the sailing components the sea lanes already use, and the
 * interior-vs-ocean split the lake typology needs — "never a third ad-hoc BFS". So the
 * navigable view below is seaLanes' own function MOVED, not re-derived, and seaLanes now
 * imports it. Its behaviour must therefore be byte-identical, and that is proved by
 * measurement rather than asserted (the sea-lane digest bytes do not move).
 *
 * ── TWO VIEWS, AND THEY ARE GENUINELY DIFFERENT QUESTIONS ────────────────────────────
 *   NAVIGABLE — "where can a hull go": ocean cells AND land cells carrying a river course
 *     (`r != 0`). A ship sails both, so a river-mouth port bridges river and sea into one
 *     sailing group. This is the sea lanes' reachability constraint.
 *   OPEN WATER — "what is a body of water": `h < LAND_HEIGHT` only. Rivers are EXCLUDED,
 *     because a river running out of a lake would otherwise weld that lake to the ocean
 *     and every lake on a drained continent would read as sea.
 * Sharing one BFS between two different predicates would be the bug, not the cure; what is
 * shared is the LABELLING MACHINE, and each view supplies its own membership test.
 *
 * ── FMG'S OWN LAKE LAW, PORTED (its `markupPack`, `Lakes`, `defineClimateData`) ───────
 * FMG classifies a water component as `border ? "ocean" : "lake"` — which is exactly the
 * charter's "interior h<20 non-border components". Its water budget for a lake is:
 *     height      = min(shoreline h) − LAKE_ELEVATION_DELTA
 *     temp        = cells < 6 ? temp[g[firstCell]] : median(temp[g[shoreline]])
 *     flux        = Σ prec[g[shorelineCell]]
 *     evaporation = ((700·(temp + 0.006·(height−18)^e)/50 + 75) / (80 − temp)) · cells
 * The evaporation line is FMG's Penman-shaped model, copied in substance. FMG is MIT and
 * the copy is attributed in the repository's licence-notices document, landed in the same act
 * (program law §1.8). ⚠ That notices document is chartered to ship DARK and a build test
 * reds if any file under src/ names it, so this note deliberately does not.
 *
 * ⛔ `salt` IS DELIBERATELY REFUSED, and this is the most important line in the file.
 * FMG's own group law reads `!outlet && evaporation > flux ? "salt" : "freshwater"`, and
 * `outlet` is river-DIRECTION topology: whether a river flows OUT of the lake. The capture
 * carries `r` (a river id per cell) and `fl` (flux), and an inlet and an outlet are
 * identical under both — nothing captured distinguishes them. Deriving `salt` anyway would
 * be asserting a fact about the world that the frozen inputs cannot support, which is
 * exactly the failure mode "a legibility pass over a surface that is WRONG makes the
 * wrongness more credible". So the vocabulary is `unknown | frozen | dry | freshwater`, and
 * an endorheic salt lake reads `freshwater` — a known, written limitation rather than a
 * silent fabrication.
 *
 * ⚠ `border` IS DERIVED, NOT READ, AND ERRS TOWARD OCEAN. FMG marks frame cells in
 * `pack.cells.b`, but `b` is not in the capture set D1 enumerated (`fl`; `temp`+`prec`+`g`),
 * so this module derives "touches the map frame" from the captured centroids: the bounding
 * box of `p`, with a one-mean-spacing tolerance. The tolerance direction is chosen: a body
 * wrongly called OCEAN produces silence, while a body wrongly called a LAKE would put a
 * fabricated lake on the map. Widening the capture with `cells.b` would make this exact —
 * recorded for the chair rather than taken unilaterally.
 *
 * PURE + seeded + import-light: this module imports ONE constant from spatialCost (the
 * zero-import leaf) and nothing else, so any consumer may take it without dragging a chunk.
 */

import { LAND_HEIGHT } from './spatialCost.js';

/** The self-describing lake sub-digest version (the BIOME_TEXTURE_VERSION precedent).
 *  Bumping it is a DISCRETE re-canonize event; an existing canon keeps its own forever. */
export const LAKE_TYPOLOGY_VERSION = 1;

/** The closed subtype vocabulary. `unknown` is the honest state where the capture carried
 *  no climate for this lake (A1.2.14: "lake subtype is typed `unknown` where climate
 *  fields are uncaptured"). `salt` is ABSENT by ruling — see the header.
 *  @type {ReadonlyArray<string>} */
export const LAKE_SUBTYPES = Object.freeze(['unknown', 'frozen', 'dry', 'freshwater']);

// ── FMG's own constants, read out of the fork source ──────────────────────────────────
/** FMG `Lakes.LAKE_ELEVATION_DELTA`: a lake's surface sits just under its lowest shore. */
export const LAKE_ELEVATION_DELTA = 0.1;
/** FMG's lake group law: `if (lake.temp < -3) return "frozen"`. */
export const FROZEN_LAKE_TEMP_C = -3;
/** FMG's lake group law: a closed basin is `dry` when `evaporation > flux * 4`. */
export const DRY_LAKE_EVAPORATION_RATIO = 4;
/** FMG's `heightExponent` UI input; its shipped default. PARAMETERIZED rather than read
 *  from a bare `window` — a bare global read is not an import and evades the layer walker,
 *  and a non-integer exponent would put an implementation-approximated power on a
 *  canon-deciding path. The exponent is applied through `intPow` below, which cannot
 *  express a fractional one at all. */
export const DEFAULT_HEIGHT_EXPONENT = 2;

/**
 * Is a cell NAVIGABLE water — an ocean cell (below land height) OR a river-course cell
 * (land carrying `r != 0`)? A ship sails both. MOVED VERBATIM from seaLanes.js by CAP-4;
 * no behaviour change, and the sea-lane digest bytes are measured unmoved.
 * @param {{ h:number[], r:number[], cellCount:number }} pack @param {number} cell
 */
export function isNavigableWater(pack, cell) {
  if (cell == null || cell < 0 || cell >= pack.cellCount) return false;
  const h = Number((pack.h || [])[cell]);
  if (!(h >= LAND_HEIGHT)) return true; // ocean / below land height
  const rv = Number((pack.r || [])[cell]);
  return Number.isFinite(rv) && rv !== 0; // river course on land
}

/**
 * Is a cell OPEN water — below land height, full stop? Rivers are EXCLUDED here on
 * purpose: a river leaving a lake would otherwise weld it to the sea (see the header).
 * @param {{ h:number[], cellCount:number }} pack @param {number} cell
 */
export function isOpenWater(pack, cell) {
  if (cell == null || cell < 0 || cell >= pack.cellCount) return false;
  return !(Number((pack.h || [])[cell]) >= LAND_HEIGHT);
}

/**
 * THE SHARED LABELLING MACHINE. Flood-fill every cell satisfying `belongs` into connected
 * components over pack adjacency; everything else stays -1. Deterministic by construction:
 * components are numbered in ascending FIRST-CELL order because the outer scan runs
 * 0..cellCount, so the same pack always yields the same ids.
 * @param {{ c:number[][], cellCount:number }} pack
 * @param {(cell:number) => boolean} belongs
 * @returns {{ comp: Int32Array, count: number, firstCell: number[], size: number[] }}
 */
export function labelComponents(pack, belongs) {
  const n = pack.cellCount;
  const comp = new Int32Array(n).fill(-1);
  /** @type {number[]} */
  const firstCell = [];
  /** @type {number[]} */
  const size = [];
  let next = 0;
  for (let start = 0; start < n; start++) {
    if (comp[start] !== -1 || !belongs(start)) continue;
    const id = next++;
    firstCell.push(start);
    comp[start] = id;
    let members = 1;
    const stack = [start];
    while (stack.length) {
      const u = /** @type {number} */ (stack.pop());
      for (const v of (pack.c || [])[u] || []) {
        if (v == null || v < 0 || v >= n || comp[v] !== -1 || !belongs(v)) continue;
        comp[v] = id; stack.push(v); members += 1;
      }
    }
    size.push(members);
  }
  return { comp, count: next, firstCell, size };
}

/**
 * Label every NAVIGABLE-water cell with its connected-component id; land stays -1. This is
 * seaLanes' original `waterComponents`, now shared. Two ports can only share a lane if the
 * water they touch is the SAME component — so no lane crosses land or joins two seas.
 * @param {{ h:number[], r:number[], c:number[][], cellCount:number }} pack
 * @returns {Int32Array} per-cell component id (-1 = non-navigable land)
 */
export function navigableWaterComponents(pack) {
  return labelComponents(pack, (cell) => isNavigableWater(pack, cell)).comp;
}

/**
 * THE MAP FRAME, derived from the captured centroids (see the header's `border` note).
 * Returns a predicate answering "is this cell's centroid within one mean cell spacing of
 * the bounding box of every centroid?". Mean spacing is `sqrt(area / cellCount)` — FMG's
 * grid is jittered-uniform, so its outermost cells sit roughly half a spacing in, and a
 * full-spacing tolerance captures them with margin. A degenerate pack (no area, one cell)
 * calls EVERYTHING a frame cell, which is the erring-toward-ocean direction.
 * @param {{ p:Array<[number,number]|number[]>, cellCount:number }} pack
 * @returns {(cell:number) => boolean}
 */
export function frameTouchTest(pack) {
  const P = pack.p || [];
  const n = pack.cellCount;
  let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    const pt = P[i];
    if (!pt) continue;
    const x = Number(pt[0]); const y = Number(pt[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return () => true;
  const area = Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
  const spacing = n > 0 && area > 0 ? Math.sqrt(area / n) : Infinity;
  return (cell) => {
    const pt = P[cell];
    if (!pt) return true; // a cell with no centroid cannot be proven interior
    const x = Number(pt[0]); const y = Number(pt[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return true;
    return (x - minX) <= spacing || (maxX - x) <= spacing
      || (y - minY) <= spacing || (maxY - y) <= spacing;
  };
}

/** d3.median semantics over a numeric array, sort-based so it is order-stable: the middle
 *  value, or the mean of the two middle values. Empty ⇒ null. Pure.
 *  @param {number[]} values @returns {number|null} */
function medianOf(values) {
  const xs = values.filter((/** @type {number} */ v) => Number.isFinite(v)).slice()
    .sort((/** @type {number} */ a, /** @type {number} */ b) => a - b);
  if (!xs.length) return null;
  const mid = xs.length >> 1;
  return xs.length % 2 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2;
}

/**
 * INTEGER POWER BY REPEATED MULTIPLICATION — and the reason is determinism, not speed.
 *
 * `**` and `Math.pow` are implementation-APPROXIMATED per the ECMAScript spec, so a value
 * they produce can differ between engines in the last bits; the transcendental-math ratchet
 * exists to keep that surface off a canon-deciding path, and it counts the OPERATOR, not the
 * exponent. Both powers this module needs have INTEGER exponents, and an integer power is
 * just multiplication — which IEEE-754 rounds correctly, so this form is not merely
 * ratchet-legal, it is exactly reproducible on every engine by construction.
 *
 * Writing it this way also makes the integer-exponent constraint STRUCTURAL instead of a
 * comment: a fractional exponent cannot be expressed here at all, where `**` would have
 * accepted one silently.
 * @param {number} base @param {number} exponent a non-negative INTEGER
 * @returns {number}
 */
function intPow(base, exponent) {
  let out = 1;
  for (let i = 0; i < exponent; i++) out *= base;
  return out;
}

/** Round to `digits` decimals the way FMG's `rn` does. `digits` is a small non-negative
 *  integer at every call site here (0, 1 or 2), so the scale is an exact integer power. */
const rn = (/** @type {number} */ v, /** @type {number} */ digits = 0) => {
  const m = intPow(10, digits);
  return Math.round(v * m) / m;
};

/** The GRID climate row behind a PACK cell, or null. The `g` bridge (CAP-1), and the ONLY
 *  way this module reaches climate — never `temp[packCell]`.
 *  @param {{ g:number[], temp:number[], prec:number[], gridCellCount:number }} pack
 *  @param {number} cell @returns {{ temp:number, prec:number }|null} */
function climateAt(pack, cell) {
  const gridCell = Number((pack.g || [])[cell]);
  if (!Number.isInteger(gridCell) || gridCell < 0 || gridCell >= pack.gridCellCount) return null;
  const temp = Number((pack.temp || [])[gridCell]);
  const prec = Number((pack.prec || [])[gridCell]);
  if (!Number.isFinite(temp) || !Number.isFinite(prec)) return null;
  return { temp, prec };
}

/**
 * W-CAP CAP-4 — the frozen LAKE sub-digest, or null when the pack holds no interior water.
 *
 * Every lake carries its cell COUNT (not a roster — the charter's size ruling), its
 * SHORELINE land-cell ids (which is what a consumer needs to ask "is this candidate site on
 * a lake shore"), its typed SUBTYPE, and the three water-budget readings the subtype came
 * from so the verdict is auditable rather than merely stated.
 *
 * ⚠ CAPTURED INPUTS ONLY (A1.2.14): `h`, `c`, `p`, `g`, `temp`, `prec`. No sibling
 * sub-digest is consulted — not `biomes`, not `climate` — so the two can be versioned
 * independently. Where climate is uncaptured the subtype is `unknown`, never a guess.
 *
 * @param {{ h:number[], c:number[][], p:Array<[number,number]|number[]>, g:number[],
 *   temp:number[], prec:number[], cellCount:number, gridCellCount:number }} pack
 * @param {{ heightExponent?: number }} [opts]
 * @returns {{ version:number, bodies: Array<{ id:number, cells:number, shoreline:number[],
 *   subtype:string, temp:number|null, flux:number|null, evaporation:number|null }> }|null}
 */
export function deriveLakes(pack, opts = {}) {
  const { comp, count, firstCell, size } = labelComponents(pack, (cell) => isOpenWater(pack, cell));
  if (!count) return null;
  const touchesFrame = frameTouchTest(pack);
  // A non-integer exponent has no exact form; refuse it and use FMG's own default rather
  // than reach for an implementation-approximated power (see `intPow`).
  const rawExp = Number(opts.heightExponent);
  const heightExponent = Number.isInteger(rawExp) && rawExp > 0 ? rawExp : DEFAULT_HEIGHT_EXPONENT;

  // ONE pass over the cells: mark which components touch the frame, and collect each
  // interior component's shoreline (LAND neighbours of its water cells).
  const frameComp = new Uint8Array(count);
  /** @type {Array<Set<number>>} */
  const shorelines = Array.from({ length: count }, () => new Set());
  for (let cell = 0; cell < pack.cellCount; cell++) {
    const id = comp[cell];
    if (id < 0) continue;
    if (touchesFrame(cell)) frameComp[id] = 1;
    for (const v of (pack.c || [])[cell] || []) {
      if (v == null || v < 0 || v >= pack.cellCount) continue;
      if (!isOpenWater(pack, v)) shorelines[id].add(v);
    }
  }

  /** @type {Array<{ id:number, cells:number, shoreline:number[], subtype:string,
   *   temp:number|null, flux:number|null, evaporation:number|null }>} */
  const bodies = [];
  for (let id = 0; id < count; id++) {
    if (frameComp[id]) continue; // ocean: it reaches the map frame
    const shoreline = [...shorelines[id]].sort((a, b) => a - b);
    const cells = size[id];

    // FMG: the lake surface sits LAKE_ELEVATION_DELTA under its lowest shore.
    const shoreHeights = shoreline.map((c) => Number((pack.h || [])[c])).filter(Number.isFinite);
    const height = rn((shoreHeights.length ? Math.min(...shoreHeights) : LAND_HEIGHT)
      - LAKE_ELEVATION_DELTA, 2);

    // FMG: a small lake reads its first cell's climate; a larger one the shoreline median.
    const firstClimate = climateAt(pack, firstCell[id]);
    /** @type {Array<{ temp:number, prec:number }>} */
    const shoreClimates = [];
    // An explicit loop, not `.map(...).filter(Boolean)`: `filter(Boolean)` does not narrow
    // the null out of the element type, so every later read would need a cast.
    for (const c of shoreline) {
      const reading = climateAt(pack, c);
      if (reading) shoreClimates.push(reading);
    }
    let temp = null;
    if (cells < 6 && firstClimate) temp = rn(firstClimate.temp, 1);
    else if (shoreClimates.length) temp = rn(/** @type {number} */ (medianOf(shoreClimates.map((c) => c.temp))), 1);
    else if (firstClimate) temp = rn(firstClimate.temp, 1);

    // FMG: inflow is the precipitation summed over the shoreline.
    const flux = shoreClimates.length
      ? shoreClimates.reduce((sum, c) => sum + c.prec, 0)
      : null;

    let evaporation = null;
    if (temp !== null && temp < 80) {
      // FMG's Penman-shaped line, verbatim in substance (MIT; attributed — see the header).
      const rise = intPow(height - 18, heightExponent);
      evaporation = rn((((700 * (temp + 0.006 * rise)) / 50 + 75) / (80 - temp)) * cells);
    }

    let subtype = 'unknown';
    if (temp !== null && flux !== null && evaporation !== null) {
      if (temp < FROZEN_LAKE_TEMP_C) subtype = 'frozen';
      else if (evaporation > flux * DRY_LAKE_EVAPORATION_RATIO) subtype = 'dry';
      else subtype = 'freshwater'; // `salt` is refused: outlet is not derivable (header)
    }
    bodies.push({ id, cells, shoreline, subtype, temp, flux, evaporation });
  }
  if (!bodies.length) return null; // every water body reaches the frame ⇒ all ocean
  return { version: LAKE_TYPOLOGY_VERSION, bodies };
}

/**
 * The lake a PACK cell stands on the shore of, or null — the read a site-placement
 * consumer needs. Pure; a linear scan over a handful of bodies, so no index is persisted.
 * @param {{ version:number, bodies:Array<{id:number, shoreline:number[], subtype:string}> }
 *   |null|undefined} lakes a frozen digest's `lakes` sub-digest
 * @param {number} cell
 * @returns {{ id:number, subtype:string }|null}
 */
export function lakeShoreAt(lakes, cell) {
  const bodies = lakes && typeof lakes === 'object' && Array.isArray(lakes.bodies)
    ? lakes.bodies : null;
  if (!bodies || !Number.isInteger(cell)) return null;
  for (const body of bodies) {
    if (Array.isArray(body?.shoreline) && body.shoreline.includes(cell)) {
      return { id: Number(body.id), subtype: String(body.subtype) };
    }
  }
  return null;
}
