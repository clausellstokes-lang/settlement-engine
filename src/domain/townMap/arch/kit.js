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
 * @typedef {{ role: string, kind: string, spec: Record<string, number|undefined>, aabb: { min: number[], max: number[] } }} KitTerminal
 */

/** center + half-extents of a box. @param {AABB} b @returns {{ cx:number, cy:number, cz:number, hx:number, hy:number, hz:number }} */
function dims(b) {
  return {
    cx: (b.min[0] + b.max[0]) / 2, cy: (b.min[1] + b.max[1]) / 2, cz: (b.min[2] + b.max[2]) / 2,
    hx: (b.max[0] - b.min[0]) / 2, hy: (b.max[1] - b.min[1]) / 2, hz: (b.max[2] - b.min[2]) / 2,
  };
}

/** a spire terminal spec + its aabb. @param {string} role @param {number} cx @param {number} cz @param {number} baseHalf @param {number} baseY @param {number} apexY @param {number} [apexCx] @param {number} [apexCz] @returns {KitTerminal} */
function spire(role, cx, cz, baseHalf, baseY, apexY, apexCx, apexCz) {
  const ax = apexCx === undefined ? cx : apexCx, az = apexCz === undefined ? cz : apexCz;
  return {
    role, kind: 'spire',
    spec: { cx, cz, baseHalf, baseY, apexY, apexCx, apexCz },
    aabb: { min: [Math.min(cx - baseHalf, ax), baseY, Math.min(cz - baseHalf, az)], max: [Math.max(cx + baseHalf, ax), apexY, Math.max(cz + baseHalf, az)] },
  };
}

/**
 * SPIRE_EMBED_FRAC -- a stacked spire's base is seated this fraction of its OWN height BELOW the top
 * plane of the primitive it rests on. A spire's downward base quad (addSpire's bottom face, -y normal)
 * that is COINCIDENT + COPLANAR with the host's upward top quad (+y) at equal depth makes the two
 * abutting closed solids z-fight in the shared raster: the z-buffer flip-flops between the two faces
 * scanline-by-scanline -- the "cap-diamond" tone-gate striping the K-2 investigation localized on the
 * grotesque / skull / crocket caps and the cathedral pinnacle-on-pier joint. Seating the base below the
 * host's top plane (embedded, not flush) puts the spire's near faces strictly in front of that cap and
 * removes the coincidence -- exactly the evilChapel.js SPIRE_EMBED cure, generalized kit-wide. A fraction
 * of the spire's own span keeps the embed strictly positive and strictly less than the spire height for
 * every asset scale. DECLARED same-seed geometry shift: ARCH_GEOMETRY_VERSION 2 -> 3; cathedral GLB tiers
 * 1/2 (they carry the pinnacle) + all 3 cathedral plate goldens + evil-chapel (grotesque+skull) chapel2
 * re-pinned. Cathedral tier 0 (glyph, no statuary) / buttress / rose / vault / tracery stay byte-identical.
 * robedFigure (a box on a spire APEX = a point contact, no coplanar face) + gargoyle (side snout) + finial
 * (a lone spire) have no coincident face and are unchanged (visually confirmed clean in the tone plates).
 */
const SPIRE_EMBED_FRAC = 1 / 8;

/** a spire SEATED on the primitive below it, its base embedded below that top plane (the coincident-face striping cure). Same args as spire(). @param {string} role @param {number} cx @param {number} cz @param {number} baseHalf @param {number} baseY @param {number} apexY @param {number} [apexCx] @param {number} [apexCz] @returns {KitTerminal} */
function seatedSpire(role, cx, cz, baseHalf, baseY, apexY, apexCx, apexCz) {
  return spire(role, cx, cz, baseHalf, baseY - (apexY - baseY) * SPIRE_EMBED_FRAC, apexY, apexCx, apexCz);
}

/** a box terminal spec + its aabb. @param {string} role @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {KitTerminal} */
function boxT(role, x0, x1, y0, y1, z0, z1) {
  return {
    role, kind: 'box',
    spec: { x0, x1, y0, y1, z0, z1 },
    aabb: { min: [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)], max: [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)] },
  };
}

/**
 * KIT_ASSETS -- the frozen asset registry. Each: (placementBox, role) -> KitTerminal[]. The K-1 base
 * (finial, pinnacle) plus the K-3 STATUARY KIT: crockets, gargoyles, grotesques, abstract robed
 * silhouettes, and a skull (the evil-drift iconography). Every piece is built from CLOSED primitives
 * (box / spire) so an instanced assembly stays watertight, and every piece is an ABSTRACT architectural
 * form -- NEVER a named character, NEVER a portrait (product scope: the sim never resolves a named
 * fate; the ornament never depicts one). Instancing draws the one authored piece many times (the M1
 * draw-call budget wants exactly this).
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
      seatedSpire(role, d.cx, d.cz, d.hx, b.min[1], capTop),        // lower cap seated into the pier top (was coincident with it)
      seatedSpire(role, d.cx, d.cz, d.hx * 0.45, capTop, b.max[1]), // upper spire seated into the lower cap
    ];
  },

  // ── K-3 STATUARY KIT (abstract forms only) ──────────────────────────────────────────────────────
  /** a hooked leaf-bud CROCKET: a stem block + an out-curling tapered bud (climbs a gable/spire edge). */
  crocket: (b, role) => {
    const d = dims(b);
    return [
      boxT(role, d.cx - d.hx * 0.3, d.cx + d.hx * 0.3, b.min[1], d.cy, d.cz - d.hx * 0.3, d.cz + d.hx * 0.3),
      seatedSpire(role, d.cx, d.cz, d.hx * 0.6, d.cy, b.max[1], d.cx + d.hx * 1.1, d.cz), // the bud curls outward (+x), seated into the stem top
    ];
  },
  /** a projecting GARGOYLE waterspout: a horizontal corbel beam + a tapered snout thrown outward + down. */
  gargoyle: (b, role) => {
    const d = dims(b);
    return [
      boxT(role, b.min[0], d.cx + d.hx * 0.2, d.cy - d.hy * 0.4, d.cy + d.hy * 0.4, d.cz - d.hz * 0.5, d.cz + d.hz * 0.5), // corbel beam
      spire(role, d.cx + d.hx * 0.3, d.cz, d.hz * 0.5, d.cy - d.hy * 0.3, d.cy - d.hy * 0.2, b.max[0], d.cz),             // snout thrown out (+x, downward)
      boxT(role, d.cx - d.hx * 0.1, d.cx + d.hx * 0.3, d.cy - d.hy * 0.2, d.cy + d.hy * 0.5, d.cz - d.hz * 0.4, d.cz + d.hz * 0.4), // blocky head
    ];
  },
  /** a crouching GROTESQUE: a stacked body + head block under a spire cap (an abstract carved figure). */
  grotesque: (b, role) => {
    const d = dims(b);
    const bodyTop = b.min[1] + d.hy * 1.0, headTop = b.min[1] + d.hy * 1.55;
    return [
      boxT(role, d.cx - d.hx * 0.7, d.cx + d.hx * 0.7, b.min[1], bodyTop, d.cz - d.hz * 0.7, d.cz + d.hz * 0.7),      // hunched body
      boxT(role, d.cx - d.hx * 0.45, d.cx + d.hx * 0.45, bodyTop, headTop, d.cz - d.hz * 0.45, d.cz + d.hz * 0.45),   // head block
      seatedSpire(role, d.cx, d.cz, d.hx * 0.45, headTop, b.max[1]),                                                  // horn/cap seated into the head block
    ];
  },
  /** an abstract ROBED SILHOUETTE: a wide-base tapering robe (a truncated pyramid) + a small head. NEVER a face. */
  robedFigure: (b, role) => {
    const d = dims(b);
    const robeTop = b.min[1] + d.hy * 1.35, headTop = b.max[1];
    return [
      spire(role, d.cx, d.cz, d.hx, b.min[1], robeTop, d.cx, d.cz),                                     // the robe cone (wide -> narrow)
      boxT(role, d.cx - d.hx * 0.28, d.cx + d.hx * 0.28, robeTop, headTop, d.cz - d.hx * 0.28, d.cz + d.hx * 0.28), // cowled head block
    ];
  },
  /** a SKULL (evil-drift iconography): an abstract blocky cranium + jaw + a crowning spike. No portrait. */
  skull: (b, role) => {
    const d = dims(b);
    const jawTop = b.min[1] + d.hy * 0.6, cranTop = b.min[1] + d.hy * 1.5;
    return [
      boxT(role, d.cx - d.hx * 0.5, d.cx + d.hx * 0.5, b.min[1], jawTop, d.cz - d.hz * 0.4, d.cz + d.hz * 0.4),  // jaw
      boxT(role, d.cx - d.hx * 0.7, d.cx + d.hx * 0.7, jawTop, cranTop, d.cz - d.hz * 0.6, d.cz + d.hz * 0.6),   // cranium
      seatedSpire(role, d.cx, d.cz, d.hx * 0.35, cranTop, b.max[1]),                                             // crowning spike seated into the cranium
    ];
  },
});
