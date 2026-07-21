/**
 * domain/townMap/arch/project.js -- K-0 SPIKE: the bezier-aware axonometric projector +
 * the byte-stable hidden-surface sort (the "Bezier DrawOp add", kernel doc K-0 gate b).
 *
 * PROJECTOR. A trig-free cavalier/axonometric transform extending the massing.js
 * makeCavalierProject idiom (x preserved, depth foreshortened, elevation raised up-screen)
 * with ONE added term: an x-shear proportional to depth, so a receding face reveals a lit
 * side and the pier reads as a solid 3D mass. It is AFFINE, which is the load-bearing
 * property: an affine map commutes with Bezier evaluation, so projecting a cubic's four
 * CONTROL points and reconnecting them reproduces the projected curve EXACTLY -- no arc `A`,
 * no atan2, no per-point trig. That equality is the bezier draw-op, and the unit test pins it.
 *
 * HIDDEN SURFACE. `sortRenderables` orders items far-to-near by model depth (y), ties broken
 * by id codepoint order (never insertion order, never localeCompare). For this fragment the
 * pier is strictly in front of the wall and the flyer strictly in front of the wall, so there
 * is NO cyclic overlap -- a depth sort with a deterministic tiebreak suffices and a
 * Newell/BSP split is not needed (recorded as the K-0 finding). The tiebreak makes the order
 * permutation-invariant, which the unit test proves by shuffling the input.
 *
 * PURITY: {+, -, *, /} + Math.round (0 transcendental sites); deterministic.
 *
 * @typedef {import('./geom.js').P3} P3
 * @typedef {import('./geom.js').P2} P2
 * @typedef {import('./geom.js').Subpath} Subpath
 * @typedef {{ x: number, y: number, z: number }} S3  a projected point carrying its model depth
 */

/**
 * @typedef {{ shearX: number, depth: number, groundTop: number, elev: number }} ProjCfg
 * The default axonometric: gentle depth foreshortening, a right-leaning shear, elevation 1:1.
 */
export const DEFAULT_PROJ = Object.freeze({ shearX: 0.5, depth: 0.52, groundTop: 250, elev: 1 });

/**
 * Build a projector from a rational config. Projects a model point [x, y, z] to a rounded
 * screen point, and exposes the raw (unrounded) depth for sorting.
 * @param {Partial<ProjCfg>} [cfg]
 * @returns {{ project: (p: P3) => [number, number], projectRaw: (p: P3) => [number, number], cfg: ProjCfg }}
 */
export function makeArchProjector(cfg) {
  const c = {
    shearX: cfg && typeof cfg.shearX === 'number' ? cfg.shearX : DEFAULT_PROJ.shearX,
    depth: cfg && typeof cfg.depth === 'number' ? cfg.depth : DEFAULT_PROJ.depth,
    groundTop: cfg && typeof cfg.groundTop === 'number' ? cfg.groundTop : DEFAULT_PROJ.groundTop,
    elev: cfg && typeof cfg.elev === 'number' ? cfg.elev : DEFAULT_PROJ.elev,
  };
  /** @param {P3} p @returns {[number, number]} */
  const projectRaw = (p) => [p[0] + p[1] * c.shearX, c.groundTop + p[1] * c.depth - p[2] * c.elev];
  /** @param {P3} p @returns {[number, number]} */
  const project = (p) => { const q = projectRaw(p); return [Math.round(q[0]), Math.round(q[1])]; };
  return { project, projectRaw, cfg: Object.freeze(c) };
}

/**
 * Project a model-space subpath to a SCREEN-space subpath by projecting every control point.
 * The segment structure (L vs C) is preserved unchanged: this is the affine bezier draw-op.
 * @param {(p: P3) => [number, number]} project
 * @param {Subpath} sub
 * @returns {{ start: [number, number], segs: Array<{ t: 'L', p: [number, number] } | { t: 'C', c1: [number, number], c2: [number, number], p: [number, number] }>, closed: boolean }}
 */
export function projectSubpath(project, sub) {
  return {
    start: project(sub.start),
    segs: sub.segs.map((seg) => seg.t === 'L'
      ? { t: 'L', p: project(seg.p) }
      : { t: 'C', c1: project(seg.c1), c2: project(seg.c2), p: project(seg.p) }),
    closed: sub.closed,
  };
}

/**
 * Serialize a screen-space subpath to an SVG path `d` string using ONLY M / L / C / Z --
 * never the arc `A` command. Integers only (already rounded), so the string is byte-stable.
 * @param {{ start: [number, number], segs: Array<{ t: 'L', p: [number, number] } | { t: 'C', c1: [number, number], c2: [number, number], p: [number, number] }>, closed: boolean }} sub
 * @returns {string}
 */
export function subpathToPathD(sub) {
  let d = `M ${sub.start[0]} ${sub.start[1]}`;
  for (const seg of sub.segs) {
    if (seg.t === 'L') d += ` L ${seg.p[0]} ${seg.p[1]}`;
    else d += ` C ${seg.c1[0]} ${seg.c1[1]} ${seg.c2[0]} ${seg.c2[1]} ${seg.p[0]} ${seg.p[1]}`;
  }
  if (sub.closed) d += ' Z';
  return d;
}

/**
 * Codepoint string comparison (never localeCompare -- host ICU collation forks order across
 * devices). @param {string} a @param {string} b @returns {number}
 */
export function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Order renderables far-to-near for the painter: ascending model depth, ties broken by id
 * codepoint. Returns a NEW array (does not mutate). Permutation-invariant by construction.
 * @template {{ depth: number, id: string }} T
 * @param {ReadonlyArray<T>} items
 * @returns {T[]}
 */
export function sortRenderables(items) {
  return items.slice().sort((a, b) => (a.depth - b.depth) || compareCodepoint(a.id, b.id));
}
