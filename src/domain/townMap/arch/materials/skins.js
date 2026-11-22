/**
 * domain/townMap/arch/materials/skins.js -- K-3 SKIN: the SKIN REGISTRY (role -> material mapping).
 *
 * THE RESKIN SEAM (kernel doc "THE GENRE LIBRARY"): a SKIN is a finite, typed mapping from the 12 K-1
 * MATERIAL ROLES (grammarIR.MATERIAL_ROLES) onto (material, weathering) pairs from the library. Because
 * a mesh is partitioned by ROLE (not rgb), swapping the skin re-dresses ANY shape without touching its
 * geometry -- the "any skin dresses any shape" law. The default stone skin reproduces the K-1 plate's
 * all-ashlar read; the genre skins (timber, marble, brick, brutalist, ruin) prove the decoupling.
 *
 * A skin resolves two ways: `skinRoleAlbedo(skin)` gives a role -> mean-linear-RGB map (the plate/2D
 * read, drop-in for plate.js ROLE_ALBEDO), and `skinRoleTexture(skin, role)` bakes the tiling texture
 * (the 3D viewer read). glassLead is a fixed leaded-glass tint (a role, not a material) so glazing
 * reads correctly under every skin.
 *
 * PURITY: {+,-,*,/} + Math.sqrt via the material bakes; 0 transcendental sites; deterministic.
 *
 * @typedef {readonly [number, number, number]} RGB
 * @typedef {{ id: string, genre: string, roles: Readonly<Record<string, { material: string, weathering: string }>> }} Skin
 */

import { MATERIAL_ROLES } from '../grammarIR.js';
import { MATERIALS, WEATHERING, materialMeanAlbedo } from './materials.js';

/** glazing is a role, not a material: a fixed dark leaded-glass linear tint (matches plate ROLE_ALBEDO.glassLead). @type {RGB} */
const GLASS_ALBEDO = Object.freeze([0.12, 0.15, 0.22]);

/** build a skin: a base (material, weathering) for the stone-ish roles + explicit overrides. @param {string} id @param {string} genre @param {string} baseMat @param {string} baseWeather @param {Record<string, {material:string,weathering:string}>} [overrides] @returns {Skin} */
function skin(id, genre, baseMat, baseWeather, overrides) {
  /** @type {Record<string, { material: string, weathering: string }>} */ const roles = {};
  for (const role of MATERIAL_ROLES) roles[role] = { material: baseMat, weathering: baseWeather };
  if (overrides) for (const [k, v] of Object.entries(overrides)) roles[k] = v;
  return Object.freeze({ id, genre, roles: Object.freeze(roles) });
}

/**
 * SKINS -- the frozen skin registry. Each dresses ANY role-partitioned mesh. The stone skin is the
 * gothic default; the rest span the genre reserve (medieval + modern), proving skin/shape decoupling.
 * @type {Readonly<Record<string, Skin>>}
 */
export const SKINS = /** @type {Readonly<Record<string, Skin>>} */ (Object.freeze({
  stoneAshlar: skin('stoneAshlar', 'gothic', 'stoneAshlar', 'pristine', {
    dressedStone: { material: 'stoneAshlar', weathering: 'pristine' },
    buttressStone: { material: 'stoneAshlar', weathering: 'soot' },
    groundStone: { material: 'stoneAshlar', weathering: 'moss' },
    roofLead: { material: 'corrugatedIndustrial', weathering: 'stain' },
  }),
  timberVillage: skin('timberVillage', 'medieval', 'timberFrame', 'pristine', {
    ashlar: { material: 'adobe', weathering: 'pristine' },
    dressedStone: { material: 'stoneAshlar', weathering: 'pristine' },
    groundStone: { material: 'adobe', weathering: 'stain' },
  }),
  marbleTemple: skin('marbleTemple', 'classical', 'marble', 'pristine', {
    groundStone: { material: 'marble', weathering: 'soot' },
    relief: { material: 'marble', weathering: 'pristine' },
  }),
  brickGuild: skin('brickGuild', 'medieval', 'brick', 'pristine', {
    dressedStone: { material: 'stoneAshlar', weathering: 'pristine' },
    groundStone: { material: 'brick', weathering: 'moss' },
  }),
  steelModern: skin('steelModern', 'modern', 'concreteBrutalist', 'pristine', {
    ashlar: { material: 'steelGlassCurtain', weathering: 'pristine' },
    tracery: { material: 'steelGlassCurtain', weathering: 'pristine' },
    mullion: { material: 'steelGlassCurtain', weathering: 'pristine' },
    roofLead: { material: 'corrugatedIndustrial', weathering: 'pristine' },
  }),
  ruinedGothic: skin('ruinedGothic', 'gothic', 'stoneAshlar', 'ruin', {
    groundStone: { material: 'stoneAshlar', weathering: 'moss' },
    relief: { material: 'stoneAshlar', weathering: 'ruin' },
  }),
}));

/** the frozen skin id list (ascending). @type {ReadonlyArray<string>} */
export const SKIN_IDS = Object.freeze(Object.keys(SKINS).sort());

/** validate a skin id, fail-closed. @param {string} id @returns {Skin} */
export function assertSkin(id) {
  const s = SKINS[id];
  if (!s) throw new Error(`arch/skins: skin "${id}" is not registered`);
  return s;
}

/**
 * Resolve a skin to a role -> mean linear-RGB map -- a drop-in for plate.js ROLE_ALBEDO, so the plate
 * renders any mesh under any skin. glassLead is the fixed leaded-glass tint. @param {string|Skin} skinOrId
 * @returns {Readonly<Record<string, RGB>>}
 */
export function skinRoleAlbedo(skinOrId) {
  const s = typeof skinOrId === 'string' ? assertSkin(skinOrId) : skinOrId;
  /** @type {Record<string, RGB>} */ const out = {};
  for (const role of MATERIAL_ROLES) {
    if (role === 'glassLead') { out[role] = GLASS_ALBEDO; continue; }
    const r = s.roles[role];
    out[role] = materialMeanAlbedo(r.material, r.weathering);
  }
  return Object.freeze(out);
}

/** the (material, weathering) a skin assigns a role, fail-closed. @param {string|Skin} skinOrId @param {string} role @returns {{ material: string, weathering: string }} */
export function skinRoleAssignment(skinOrId, role) {
  const s = typeof skinOrId === 'string' ? assertSkin(skinOrId) : skinOrId;
  const r = s.roles[role];
  if (!r) throw new Error(`arch/skins: skin "${s.id}" has no assignment for role "${role}"`);
  if (!MATERIALS[r.material]) throw new Error(`arch/skins: skin "${s.id}" role "${role}" -> unknown material "${r.material}"`);
  if (!WEATHERING[r.weathering]) throw new Error(`arch/skins: skin "${s.id}" role "${role}" -> unknown weathering "${r.weathering}"`);
  return r;
}
