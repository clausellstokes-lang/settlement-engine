/**
 * domain/townMap/arch/grammarIR.js -- K-1 GRAMMAR: the frozen IR (shapes, registries, versions).
 *
 * The K-1 wave freezes the CONTRACT every later kernel wave (K-2..K-5) compiles into: a
 * deterministic shape-grammar whose atoms are SHAPES and whose rules are frozen plain-data objects.
 * This module holds the vocabulary the interpreter + emitter agree on -- the Shape record, the
 * finite symbol/op/material/tier registries, and the version stamps the goldens carry. Nothing here
 * builds geometry; it is pure data + tiny constructors.
 *
 * A SHAPE is { sym, scope, attrs, path }:
 *   - sym    : a symbol from the ACTIVE ruleset's frozen symbol set (fail-closed if unknown);
 *   - scope  : { origin:[x,y,z] world, frameRef (a SELECTED orientation, arch/frames.js), size:[x,y,z] };
 *   - attrs  : { materialRole (a MATERIAL_ROLES member), lodTier (a LOD tier), params (a typed bag) };
 *   - path   : a stable derivation-path string ("root/nave/bay.2/window") -- the PRNG key + the
 *              permutation-invariant identity (the massing.js never-restamp idiom).
 *
 * DETERMINISM: no rng, no clock, no trig -- pure constructors over frozen data.
 *
 * @typedef {import('./frames.js').FrameRef} FrameRef
 * @typedef {import('./occlusionIndex.js').OcclusionIndex} OcclusionIndex
 * @typedef {ReadonlyArray<number>} V3
 * @typedef {number|string|boolean|ReadonlyArray<number>|ReadonlyArray<ReadonlyArray<number>>} ParamVal  a typed param-bag value
 * @typedef {{ origin: V3, frameRef: FrameRef, size: V3 }} Scope
 * @typedef {{ materialRole: string, lodTier: number, params: Readonly<Record<string, ParamVal>> }} Attrs
 * @typedef {{ sym: string, scope: Scope, attrs: Attrs, path: string }} Shape
 *
 * The grammar's rule DATA is heterogeneous plain data dispatched by op name -- a genuinely dynamic
 * boundary, so `OpArgs` is the ONE typed any-hole the interpreter needs (baselined, reviewed).
 * @typedef {Record<string, any>} OpArgs  one op-invocation's args (dynamic plain data)
 * @typedef {number|string|boolean|{ param: string }|{ prng: readonly [number, number], salt?: number }|{ weight: number }} ArgScalar  a resolvable arg value or ref
 * @typedef {{ sym: string, tag?: string, role?: string, params?: object, scope?: Scope }} DeferEntry
 * @typedef {{ name: string, produces: (index: OcclusionIndex, ctx: InterpCtx) => Shape[] }} EventSpec
 * @typedef {{ name?: string, symbols: ReadonlyArray<string>, axiom: { sym: string, scope: Scope, attrs: { materialRole: string, params?: object } }, rules: Record<string, ReadonlyArray<OpArgs>>, events?: ReadonlyArray<EventSpec> }} Ruleset
 * @typedef {{ tier: number, ruleset: Ruleset, symbols: Set<string>, meters: { rules: number, shapes: number, terminals: number, rounds: number }, occlusionIndex: OcclusionIndex|null, rand: (path: string, salt: number) => number }} InterpCtx
 */

/**
 * ARCH_KERNEL_LAZY_SENTINEL -- a distinctive constant the archKernelLazy build gate greps for. The
 * whole arch/ subtree is DORMANT (imported by nothing shipped), so this string must NEVER appear in
 * the entry's first-paint static closure; if it does, an eager module statically imported the kernel.
 */
export const ARCH_KERNEL_LAZY_SENTINEL = 'ARCH_KERNEL_LAZY_SENTINEL_k1';

/**
 * ARCH_GEOMETRY_VERSION -- bumps when the MESH byte output can legitimately change (a primitive
 * emission order, a subdivision table, the intern discipline). A bump is a declared same-seed
 * geometry shift and reprints the exemplar hashes.
 *
 * VERSION 2 (K-2, 2026-07-22): the evil-chapel spire base is embedded below the tower top (evilChapel.js
 * SPIRE_EMBED) to cure the tone-gate roof-underside striping (coincident spire-base / tower-top faces
 * z-fighting in the shared raster). ONLY the evil-chapel geometry shifts -- every other arch golden
 * (cathedral GLB all tiers, buttress, rose, vault, tracery, and ALL cathedral plate goldens) is
 * byte-IDENTICAL; only K3_GLB_GOLDEN.chapel2 is re-pinned. The version number is not embedded in GLB
 * bytes, so bumping it does not perturb any unchanged hash.
 */
export const ARCH_GEOMETRY_VERSION = 2;

/**
 * ARCH_GRAMMAR_VERSION -- bumps when the IR/op CONTRACT changes (a new op, a changed rule shape,
 * a symbol-registry semantic). Frozen for K-1; K-2..K-5 extend rulesets, not the contract.
 */
export const ARCH_GRAMMAR_VERSION = 1;

/** LOD tiers -- one derivation prefix yields all three (defer). Higher tier = more detail, SAME footprint. */
export const LOD_GLYPH = 0;      // distant fill: massing silhouette only
export const LOD_COMMONS = 1;    // near-field commons: massing + coarse detail
export const LOD_SIGNATURE = 2;  // the signature institution: full ornament
/** @type {ReadonlyArray<number>} */
export const LOD_TIERS = Object.freeze([LOD_GLYPH, LOD_COMMONS, LOD_SIGNATURE]);

/**
 * MATERIAL_ROLES -- the ~12 finite SEMANTIC roles the emitter partitions submeshes by (roles, NOT
 * rgb -- the drift/reskin seam; K-3 maps role -> weathered texture, K-4 drifts the mapping). Every
 * terminal carries exactly one role; the plate + viewer map role -> albedo via a frozen table.
 * @type {ReadonlyArray<string>}
 */
export const MATERIAL_ROLES = Object.freeze([
  'ashlar',        // 0  plain wall face
  'dressedStone',  // 1  courses, plinth, sills, jamb shafts
  'voussoir',      // 2  archivolt / arch order rings
  'tracery',       // 3  window bar-tracery, foils, cusps
  'mullion',       // 4  window mullions + spoke-mullions
  'glassLead',     // 5  glazed openings (leaded lights)
  'roofLead',      // 6  spire / coping / roof metal
  'buttressStone', // 7  buttress pier masses
  'pinnacleStone', // 8  pinnacles + weathering caps
  'corbel',        // 9  wall-spring corbels / brackets
  'relief',        // 10 ashlar-block relief bands
  'groundStone',   // 11 apron / ground plane
]);
/** role name -> index (for the compact per-triangle role attribute). @type {Readonly<Record<string, number>>} */
export const ROLE_INDEX = Object.freeze(
  MATERIAL_ROLES.reduce((/** @type {Record<string, number>} */ acc, r, i) => { acc[r] = i; return acc; }, {}),
);

/**
 * HARD_TIER_CEILINGS -- the interpreter's FAIL-CLOSED envelope per tier, from the MEASURED M1
 * ceiling (kernel doc "THE MEASURED CEILING": signature <=150k tris, commons <=6k, distant <=300;
 * a signature building authored at <=150k). These are HARD machine limits -- a rule expansion that
 * would breach any of them is a build-time RED, not a silent over-budget. The per-kind meshBudget
 * enforcer pins a TIGHTER, kind-specific ceiling (~1.4-1.5x the measured cathedral) on top of these.
 * @type {Readonly<Record<number, { rules: number, shapes: number, triangles: number, vertices: number }>>}
 */
export const HARD_TIER_CEILINGS = Object.freeze({
  [LOD_GLYPH]: Object.freeze({ rules: 400, shapes: 400, triangles: 300, vertices: 1200 }),
  [LOD_COMMONS]: Object.freeze({ rules: 4000, shapes: 4000, triangles: 6000, vertices: 24000 }),
  [LOD_SIGNATURE]: Object.freeze({ rules: 60000, shapes: 60000, triangles: 150000, vertices: 600000 }),
});

/**
 * Make a shape. Freezes the record so the derivation tree is immutable (a shape is never mutated
 * in place -- children are new shapes; the never-restamp idiom).
 * @param {string} sym @param {Scope} scope @param {Attrs} attrs @param {string} path @returns {Shape}
 */
export function makeShape(sym, scope, attrs, path) {
  return Object.freeze({ sym, scope, attrs, path });
}

/**
 * The child derivation path: parent path + "/" + a stable local tag. Deterministic + collision-free
 * as long as sibling tags are distinct (the interpreter appends the ordinal for repeats).
 * @param {string} parentPath @param {string} tag @returns {string}
 */
export function childPath(parentPath, tag) {
  return `${parentPath}/${tag}`;
}

/**
 * Freeze a RULESET's symbol set into a lookup used by the interpreter's fail-closed check. A ruleset
 * declares every symbol it can produce; a shape whose sym is absent is a build-time RED.
 * @param {ReadonlyArray<string>} symbols @returns {ReadonlySet<string>}
 */
export function freezeSymbols(symbols) {
  return Object.freeze(new Set(symbols));
}

/** Validate a material role, fail-closed. @param {string} role @returns {string} */
export function assertRole(role) {
  if (!(role in ROLE_INDEX)) throw new Error(`arch: material role "${role}" is not in MATERIAL_ROLES`);
  return role;
}
