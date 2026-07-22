/**
 * domain/townMap/arch/kit.js -- K-1 GRAMMAR: the INSTANCED-ASSET registry (the `instance` op target).
 *
 * A kit asset is a deterministic pure function (aabb, role) -> terminal specs placed within the box.
 * K-1 ships a MINIMAL set (the pieces the cathedral repeats -- a finial, a corner pinnacle); K-3
 * fills this with the real statuary/crocket/gargoyle library, each an amortized author-once artifact.
 * Instancing is how the same authored piece is drawn many times without re-deriving it (the M1's
 * draw-call budget wants exactly this).
 *
 * PURITY: {+,-,*,/}; 0 transcendental sites; a pure function of the placement box.
 *
 * @typedef {number[]} V3
 * @typedef {{ min: ReadonlyArray<number>, max: ReadonlyArray<number> }} AABB
 * @typedef {{ role: string, kind: string, spec: { cx: number, cz: number, baseHalf: number, baseY: number, apexY: number, apexCx?: number, apexCz?: number }, aabb: { min: number[], max: number[] } }} KitTerminal
 */

/** center + half-extents of a box. @param {AABB} b @returns {{ cx:number, cy:number, cz:number, hx:number, hy:number, hz:number }} */
function dims(b) {
  return {
    cx: (b.min[0] + b.max[0]) / 2, cy: (b.min[1] + b.max[1]) / 2, cz: (b.min[2] + b.max[2]) / 2,
    hx: (b.max[0] - b.min[0]) / 2, hy: (b.max[1] - b.min[1]) / 2, hz: (b.max[2] - b.min[2]) / 2,
  };
}

/** a spire terminal spec + its aabb. @param {string} role @param {number} cx @param {number} cz @param {number} baseHalf @param {number} baseY @param {number} apexY @returns {KitTerminal} */
function spire(role, cx, cz, baseHalf, baseY, apexY) {
  return {
    role, kind: 'spire',
    spec: { cx, cz, baseHalf, baseY, apexY, apexCx: undefined, apexCz: undefined },
    aabb: { min: [cx - baseHalf, baseY, cz - baseHalf], max: [cx + baseHalf, apexY, cz + baseHalf] },
  };
}

/**
 * KIT_ASSETS -- the frozen asset registry. Each: (placementBox, role) -> KitTerminal[].
 *   finial   -- a slender weathering spike (a single tapered spire) crowning a pier/pinnacle.
 *   pinnacle -- a stubby weathering cap + a finial (a corner pinnacle, the buttress idiom).
 * @type {Readonly<Record<string, (b: AABB, role: string) => KitTerminal[]>>}
 */
export const KIT_ASSETS = Object.freeze({
  finial: (b, role) => {
    const d = dims(b);
    return [spire(role, d.cx, d.cz, d.hx * 0.5, b.min[1], b.max[1])];
  },
  pinnacle: (b, role) => {
    const d = dims(b);
    const capTop = b.min[1] + d.hy * 0.8;
    return [
      spire(role, d.cx, d.cz, d.hx, b.min[1], capTop),
      spire(role, d.cx, d.cz, d.hx * 0.45, capTop, b.max[1]),
    ];
  },
});
