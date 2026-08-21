/**
 * domain/townMap/arch/archetypeMassing.js -- K-4: THE ARCHETYPE MASSING FLOOR (a host per SHAPE_FAMILY).
 *
 * K-3's shapeRegistry has ONE deep family populated (gothic sacred: the cathedral + evil chapel); the
 * other seven functional archetypes are registered but unbuilt. K-4 (the drift binding) needs a HOST
 * geometry for every archetype so the single writer can dress a whole settlement block, and so the
 * drift-totality walker can prove EVERY archetype builds + drifts. This module is that floor: a
 * parameterized K-1 massing grammar -- a body box + a functional-archetype CAP -- built from the frozen
 * 12-op vocabulary (emit box|spire|extrudeConvex, prism). It is the M-0 massing floor expressed as a
 * grammar: the SHELL (body + cap) is present at EVERY LOD tier (footprint + ridge agree by construction),
 * and drift detail is added on top by conditionParams.js (the single writer), never here.
 *
 * A cap that stacks a spire on the body top SEATS its base below that top (kit.js seatedSpire discipline)
 * so no coincident spire-base / body-top face z-fights -- the general striping cure, honored here too.
 *
 * PURITY: {+,-,*,/}; 0 transcendental sites; deterministic -- a given (archetype, footprint, height)
 * yields a byte-identical ruleset. The cathedral remains the SACRED SIGNATURE exemplar (full ornament);
 * this floor is what the commons/other-archetype buildings of a block are.
 *
 * @typedef {import('./grammarIR.js').Scope} Scope
 * @typedef {import('./grammarIR.js').Ruleset} Ruleset
 */

import { SHAPE_FAMILIES, HEIGHT_CLASSES } from './params.js';

/** an axis-aligned world box as an identity-frame scope. @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {Scope} */
function boxScope(x0, x1, y0, y1, z0, z1) {
  return { origin: [x0, y0, z0], frameRef: { frameIndex: 0, reflect: 0 }, size: [x1 - x0, y1 - y0, z1 - z0] };
}

/** height-class token -> body height in world units (discrete massing bands). @type {Readonly<Record<string, number>>} */
export const HEIGHT_UNITS = Object.freeze({ squat: 40, low: 72, mid: 116, tall: 176, soaring: 250 });

/** a stacked cap spire seats its base this fraction of its height below the body top (the striping cure). */
const CAP_EMBED_FRAC = 1 / 8;

/**
 * The per-archetype CAP terminal list over a body box [0,w] x [0,H] x [0,d]. Each cap is built from the
 * frozen terminal ops (box|spire|extrudeConvex|prism) and BOUNDS the footprint (never extends it), so the
 * silhouette agrees across tiers. @param {string} archetype @param {number} w @param {number} d @param {number} H
 * @returns {ReadonlyArray<object>} op invocations for the cap
 */
function capOps(archetype, w, d, H) {
  const cx = w / 2, cz = d / 2, mnr = Math.min(w, d) / 2;
  /** seat a spire base below the body top by CAP_EMBED_FRAC of its own height (no coincident face). @param {number} baseHalf @param {number} apexY @param {string} role @returns {object} */
  const spireCap = (baseHalf, apexY, role) => ({ op: 'emit', kind: 'spire', role, spire: [cx, cz, baseHalf, H - (apexY - H) * CAP_EMBED_FRAC, apexY] });
  /** a low gable ridge as a convex ring extruded across depth (a pitched/hip roof). @param {number} rise @param {string} role @returns {object} */
  const gableRoof = (rise, role) => ({ op: 'emit', kind: 'extrudeConvex', role, ring: [[0, H], [w, H], [w / 2, H + rise]], z0: 0, z1: d });
  switch (archetype) {
    case 'sacred':     return [spireCap(mnr * 0.7, H + H * 0.9, 'roofLead')];                                   // a steep spire
    case 'civic':      return [{ op: 'prism', n: 8, role: 'dressedStone', cx, cz, radius: mnr * 0.8, y0: H, y1: H + mnr * 0.5 }]; // a low octagonal drum/dome
    case 'martial':    return crenellations(w, d, H);                                                            // a crenellated parapet
    case 'industrial': return [{ op: 'emit', kind: 'box', role: 'buttressStone', box: [cx + w * 0.18, cx + w * 0.34, H, H + H * 0.7, cz - d * 0.16, cz + d * 0.16] }]; // an offset chimney stack
    case 'mercantile': return [gableRoof(mnr * 0.35, 'dressedStone')];                                          // a shallow gable
    case 'domestic':   return [gableRoof(mnr * 0.7, 'roofLead')];                                               // a pitched roof
    case 'agrarian':   return [gableRoof(mnr * 1.05, 'roofLead')];                                              // a tall barn roof
    case 'exotic':     return [{ op: 'prism', n: 6, role: 'tracery', cx, cz, radius: mnr * 0.6, y0: H, y1: H + mnr * 1.2 }]; // a crystalline hex spike
    default: throw new Error(`arch/archetypeMassing: archetype "${archetype}" has no cap (register it)`);
  }
}

/** a ring of merlon boxes around the body top (a battlemented parapet). @param {number} w @param {number} d @param {number} H @returns {ReadonlyArray<object>} */
function crenellations(w, d, H) {
  const mh = Math.max(6, Math.min(w, d) * 0.12), t = Math.max(4, Math.min(w, d) * 0.08);
  return [
    { op: 'emit', kind: 'box', role: 'buttressStone', box: [0, t, H, H + mh, 0, d] },
    { op: 'emit', kind: 'box', role: 'buttressStone', box: [w - t, w, H, H + mh, 0, d] },
    { op: 'emit', kind: 'box', role: 'buttressStone', box: [0, w, H, H + mh, 0, t] },
    { op: 'emit', kind: 'box', role: 'buttressStone', box: [0, w, H, H + mh, d - t, d] },
  ];
}

/**
 * Build a deterministic massing ruleset for one archetype at a footprint + height class. The SHELL
 * (body + cap) is emitted at EVERY tier via defer-default, so the footprint + ridge agree across tiers
 * (the silhouette law); K-4 drift detail is added by the writer, never in the ruleset.
 * @param {{ archetype: string, footprint: [number, number], heightClass: string }} p @returns {Ruleset}
 */
export function archetypeMassingRuleset(p) {
  const archetype = p.archetype;
  if (!SHAPE_FAMILIES.includes(archetype)) throw new Error(`arch/archetypeMassing: archetype "${archetype}" not in SHAPE_FAMILIES`);
  if (!HEIGHT_CLASSES.includes(p.heightClass)) throw new Error(`arch/archetypeMassing: heightClass "${p.heightClass}" invalid`);
  const w = p.footprint[0], d = p.footprint[1], H = HEIGHT_UNITS[p.heightClass];
  const cap = capOps(archetype, w, d, H);
  return Object.freeze({
    name: `massing-${archetype}`,
    symbols: ['building', 'shell', 'body', 'cap'],
    axiom: { sym: 'building', scope: boxScope(0, w, 0, H * 2, 0, d), attrs: { materialRole: 'ashlar', params: {} } },
    rules: {
      building: [{ op: 'defer', byTier: { default: [{ sym: 'shell' }] } }],
      shell: [{ op: 'defer', byTier: { default: [{ sym: 'body' }, { sym: 'cap' }] } }],
      body: [{ op: 'emit', kind: 'box', role: 'ashlar', box: [0, w, 0, H, 0, d] }],
      cap: cap,
    },
  });
}

/** the archetypes this floor hosts (the 8 SHAPE_FAMILIES -- totality). @type {ReadonlyArray<string>} */
export const MASSING_ARCHETYPES = SHAPE_FAMILIES;
