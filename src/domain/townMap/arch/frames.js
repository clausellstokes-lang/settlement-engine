/**
 * domain/townMap/arch/frames.js -- K-1 GRAMMAR: the FINITE FRAME VOCABULARY (orientation).
 *
 * Orientation in the kernel is a SELECTION from a pinned finite vocabulary + a reflection bit --
 * NEVER a composed rotation and NEVER trig (kernel doc CORRECTION 1/2: "orientation a finite frame
 * vocabulary, no trig ever"). A frame is an orthonormal basis {right, up, fwd}; a scope carries a
 * frame REFERENCE (an index into these pinned tables + a reflect bit), and the emitter places a
 * local point as origin + local.x*right + local.y*up + local.z*fwd. Because every basis vector is
 * either an axis literal or a pinned N_GON_DIRS rational unit vector (Math.sqrt at most), a frame is
 * byte-deterministic cross-engine and the bilateral (left/right buttress) symmetry is exact.
 *
 * PURITY: axis literals + the pinned N_GON_DIRS table; {+,-,*,/} only, 0 transcendental sites.
 *
 * @typedef {[number, number, number]} V3
 * @typedef {{ id: string, right: ReadonlyArray<number>, up: ReadonlyArray<number>, fwd: ReadonlyArray<number> }} Frame  an orthonormal basis
 * @typedef {{ frameIndex: number, reflect: 0 | 1 }} FrameRef  a SELECTED orientation
 */

import { N_GON_DIRS } from './rationalTables.js';

/**
 * BASE_FRAMES -- the pinned cardinal orientations. Index 0 is the identity (right = +x, up = +y,
 * fwd = +z, the facade frame the K-0 builders use); 1..3 are quarter-turns about the vertical
 * (Y) axis, taken from the CONSTRUCTIBLE 4-gon ring so a scope can face east / north / west /
 * south with no trig. A signature building never needs a finer cardinal step than these; radial
 * placement (apse chapels, rose spokes, polygon-tower faces) uses the n-gon frames below instead.
 * @type {ReadonlyArray<Frame>}
 */
export const BASE_FRAMES = Object.freeze([
  Object.freeze({ id: 'identity', right: Object.freeze([1, 0, 0]), up: Object.freeze([0, 1, 0]), fwd: Object.freeze([0, 0, 1]) }),
  Object.freeze({ id: 'turn-east', right: Object.freeze([0, 0, -1]), up: Object.freeze([0, 1, 0]), fwd: Object.freeze([1, 0, 0]) }),
  Object.freeze({ id: 'turn-back', right: Object.freeze([-1, 0, 0]), up: Object.freeze([0, 1, 0]), fwd: Object.freeze([0, 0, -1]) }),
  Object.freeze({ id: 'turn-west', right: Object.freeze([0, 0, 1]), up: Object.freeze([0, 1, 0]), fwd: Object.freeze([-1, 0, 0]) }),
]);

/** The reflection bit flips the RIGHT axis (a mirror across the local y-z plane) -- exact, no trig. */
const REFLECT_RIGHT = -1;

/**
 * Resolve a frame reference to a concrete orthonormal basis. A reflect bit negates the right axis
 * (bilateral symmetry). Throws on an out-of-range index (fail-closed -- orientation must be a
 * registered selection, never an arbitrary composition).
 * @param {FrameRef} ref @returns {Frame}
 */
export function resolveFrame(ref) {
  const base = BASE_FRAMES[ref.frameIndex];
  if (!base) throw new Error(`arch/frames: frame index ${ref.frameIndex} is not in BASE_FRAMES (finite vocabulary)`);
  if (!ref.reflect) return base;
  const s = REFLECT_RIGHT;
  return {
    id: `${base.id}~mirror`,
    right: [base.right[0] * s, base.right[1] * s, base.right[2] * s],
    up: base.up,
    fwd: base.fwd,
  };
}

/**
 * A RADIAL frame whose forward axis points along the pinned n-gon direction k (in the x-z ground
 * plane), up stays +y, and right is the exact cross(up, fwd). This is how the interpreter orients
 * apse chapels / rose spokes / polygon-tower faces around a hub WITHOUT trig -- the direction is a
 * pinned N_GON_DIRS literal, so it is a SELECTION (n, k) not a computed angle. Throws on an
 * unregistered n (fail-closed). A reflect bit mirrors right, as for the base frames.
 * @param {number} n gon count (must be in N_GON_DIRS) @param {number} k spoke index @param {0|1} [reflect]
 * @returns {Frame}
 */
export function ngonFrame(n, k, reflect) {
  const table = N_GON_DIRS[n];
  if (!table) throw new Error(`arch/frames: n-gon count ${n} is not in the pinned N_GON_DIRS registry`);
  const d = table[((k % n) + n) % n];
  const fx = d[0] / 10000, fz = d[1] / 10000;
  /** @type {V3} */ const fwd = [fx, 0, fz];
  /** @type {V3} */ const up = [0, 1, 0];
  // right = up x fwd  = (uy*fz - uz*fy, uz*fx - ux*fz, ux*fy - uy*fx) = (fz, 0, -fx)
  const s = reflect ? REFLECT_RIGHT : 1;
  /** @type {V3} */ const right = [fz * s, 0, -fx * s];
  return { id: `ngon-${n}-${((k % n) + n) % n}${reflect ? '~mirror' : ''}`, right, up, fwd };
}

/**
 * Place a LOCAL point (in a scope's frame + size) into world space:
 *   world = origin + local.x*size.x*right + local.y*size.y*up + local.z*size.z*fwd.
 * Pure {+,-,*,/}. @param {ReadonlyArray<number>} origin @param {ReadonlyArray<number>} size
 * @param {Frame} frame @param {ReadonlyArray<number>} local @returns {number[]}
 */
export function placeLocal(origin, size, frame, local) {
  const lx = local[0] * size[0], ly = local[1] * size[1], lz = local[2] * size[2];
  return [
    origin[0] + lx * frame.right[0] + ly * frame.up[0] + lz * frame.fwd[0],
    origin[1] + lx * frame.right[1] + ly * frame.up[1] + lz * frame.fwd[1],
    origin[2] + lx * frame.right[2] + ly * frame.up[2] + lz * frame.fwd[2],
  ];
}
