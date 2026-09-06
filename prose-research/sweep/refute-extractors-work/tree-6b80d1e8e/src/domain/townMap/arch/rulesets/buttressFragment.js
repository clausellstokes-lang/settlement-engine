/**
 * domain/townMap/arch/rulesets/buttressFragment.js -- K-1 GRAMMAR: THE BYTE-PARITY FRAGMENT.
 *
 * The flying buttress is the gothic structural signature; this module builds ONE bay two ways and
 * the gate proves they are BYTE-EQUAL:
 *   - buildButtressDirect(pierCX, landX, sign) -- a DIRECT arch build (the K-0b mesh algebra called
 *     by hand: 3 stepped pier boxes, a weathering cap + a pinnacle spire, the arced flyer as a swept
 *     tube, a wall-spring corbel -- the exact primitive sequence + constants of the proven
 *     cathedralSection.buildButtress);
 *   - buttressRuleset(pierCX, landX, sign) -- a frozen GRAMMAR ruleset the interpreter + emitter run.
 *
 * When emitMesh(interpret(buttressRuleset)) equals finalizeMesh(buildButtressDirect) bit-for-bit in
 * positions/normals/indices, the interpreter+emitter PATH is proven to introduce ZERO drift over the
 * mesh algebra -- the wave's own adversarial check. The ruleset carries the terminal geometry
 * EXPLICITLY (same literal arithmetic as the direct build) so the parity is exact rather than
 * fraction-rounded; the richer grammar ops (split/inset/prism/defer/occlude/events) are exercised +
 * pinned separately (archInterpreter + the cathedral goldens).
 *
 * PURITY: {+,-,*,/} + Math.sqrt via cubicAt; 0 transcendental sites; pure in its arguments.
 *
 * @typedef {import('../grammarIR.js').Shape} Shape
 */

import { cubicAt } from '../geom.js';
import { createMesh, addBox, addSpire, addTube, finalizeMesh } from '../mesh.js';

const Z_FRONT = 40; // wall outer face depth (cathedralSection.js layout), inlined for parity

/** The 17-point arced-flyer centerline (a cubic Bezier at the pinned 16-step subdivision). @param {number} pierCX @param {number} landX @param {number} sign @returns {Array<[number,number,number]>} */
function flyerPath(pierCX, landX, sign) {
  const zc = (Z_FRONT + 60 + (Z_FRONT + 150)) / 2; // = z-center of the pier footprint
  const startX = pierCX + sign * 18, startY = 372, startZ = zc;
  const endY = 360;
  /** @type {[number,number,number]} */ const p0 = [startX, startY, startZ];
  /** @type {[number,number,number]} */ const c1 = [startX + sign * 6, startY + 64, startZ - 6];
  /** @type {[number,number,number]} */ const c2 = [landX - sign * 30, endY + 42, (startZ + Z_FRONT) / 2];
  /** @type {[number,number,number]} */ const p3 = [landX, endY, Z_FRONT + 4];
  /** @type {Array<[number,number,number]>} */ const pts = [];
  for (let k = 0; k <= 16; k++) pts.push(/** @type {[number,number,number]} */ (cubicAt(p0, c1, c2, p3, k / 16)));
  return pts;
}

/**
 * The DIRECT arch build -- hand-called mesh primitives, the reference the grammar must match.
 * @param {number} pierCX @param {number} landX @param {number} sign @returns {ReturnType<typeof finalizeMesh>}
 */
export function buildButtressDirect(pierCX, landX, sign) {
  const m = createMesh();
  const z0 = Z_FRONT + 60, z1 = Z_FRONT + 150;
  const zc = (z0 + z1) / 2;
  addBox(m, pierCX - 34, pierCX + 34, 0, 150, z0, z1);
  addBox(m, pierCX - 27, pierCX + 27, 150, 300, z0 + 6, z1 - 6);
  addBox(m, pierCX - 21, pierCX + 21, 300, 372, z0 + 12, z1 - 12);
  addSpire(m, pierCX, zc, 24, 372, 400);
  addSpire(m, pierCX, zc, 11, 398, 470);
  addTube(m, flyerPath(pierCX, landX, sign), 8, 14, [1, 0, 0]);
  const endY = 360;
  addBox(m, landX - 12, landX + 12, endY - 16, endY + 12, Z_FRONT - 2, Z_FRONT + 18);
  return finalizeMesh(m);
}

/**
 * The GRAMMAR ruleset -- one axiom whose rule lists the same terminals in the same order, carrying
 * the geometry explicitly (byte-parity with buildButtressDirect). The tree is deliberately shallow;
 * its point is to prove the interpret->emit path is byte-faithful, not to show off subdivision.
 * @param {number} pierCX @param {number} landX @param {number} sign @returns {object}
 */
export function buttressRuleset(pierCX, landX, sign) {
  const z0 = Z_FRONT + 60, z1 = Z_FRONT + 150;
  const zc = (z0 + z1) / 2;
  const endY = 360;
  return Object.freeze({
    name: 'buttress-fragment',
    symbols: ['buttress'],
    axiom: {
      sym: 'buttress',
      scope: { origin: [0, 0, 0], frameRef: { frameIndex: 0, reflect: 0 }, size: [1, 1, 1] },
      attrs: { materialRole: 'buttressStone', params: {} },
    },
    rules: {
      buttress: [
        { op: 'emit', kind: 'box', role: 'buttressStone', box: [pierCX - 34, pierCX + 34, 0, 150, z0, z1] },
        { op: 'emit', kind: 'box', role: 'buttressStone', box: [pierCX - 27, pierCX + 27, 150, 300, z0 + 6, z1 - 6] },
        { op: 'emit', kind: 'box', role: 'buttressStone', box: [pierCX - 21, pierCX + 21, 300, 372, z0 + 12, z1 - 12] },
        { op: 'emit', kind: 'spire', role: 'pinnacleStone', spire: [pierCX, zc, 24, 372, 400] },
        { op: 'emit', kind: 'spire', role: 'pinnacleStone', spire: [pierCX, zc, 11, 398, 470] },
        { op: 'sweep', profile: 'square', role: 'buttressStone', path: flyerPath(pierCX, landX, sign), halfW: 8, halfH: 14, refUp: [1, 0, 0] },
        { op: 'emit', kind: 'box', role: 'corbel', box: [landX - 12, landX + 12, endY - 16, endY + 12, Z_FRONT - 2, Z_FRONT + 18] },
      ],
    },
    events: [],
  });
}
