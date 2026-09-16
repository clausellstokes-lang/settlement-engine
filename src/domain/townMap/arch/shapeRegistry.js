/**
 * domain/townMap/arch/shapeRegistry.js -- K-3: THE SHAPE LIBRARY (archetype-organized grammar registry).
 *
 * THE SHAPE LIBRARY (kernel doc "THE GENRE LIBRARY"): a finite, versioned registry of PARAMETRIC
 * building-shape grammars, organized by FUNCTIONAL ARCHETYPE (genre-agnostic, so a later SELECTOR maps
 * institution function -> archetype uniformly). Gothic/medieval is the FIRST deep family (K-3); future
 * genre packs (sci-fi, modern, post-apoc) are ADDITIONAL entries the structure holds identically -- the
 * engine treats all packs the same, so "vast in reserve" = the registry grows, the code does not.
 *
 * This is the STRUCTURE + the gothic pack. K-2 adds the SELECTOR (AI-clerk + rule ladder) + the
 * fantasy-core shape set over this same registry; K-5 adds the editor browse. A shape entry is a pure
 * descriptor { id, archetype, genre, kind, builder } -- the builder is a K-1/K-3 ruleset factory.
 *
 * PURITY: pure data + factory references; 0 transcendental sites.
 *
 * @typedef {{ id: string, archetype: string, genre: string, kind: 'building'|'element', builder: () => object }} ShapeEntry
 */

import { cathedralRuleset } from './rulesets/cathedral.js';
import { roseWindowRuleset } from './rulesets/roseWindow.js';
import { vaultBayRuleset } from './rulesets/vaultBay.js';
import { traceryFamiliesRuleset } from './rulesets/traceryFamilies.js';
import { evilChapelRuleset } from './rulesets/evilChapel.js';

/** the shape-library version -- bumps when the registry's archetype taxonomy changes. */
export const SHAPE_LIBRARY_VERSION = 1;

/**
 * FUNCTIONAL ARCHETYPES -- the genre-agnostic taxonomy the registry is organized by (kernel doc). The
 * eight building functions + an ELEMENT category for sub-assemblies (rose, vault, tracery). Future genre
 * packs slot into the SAME archetypes. @type {ReadonlyArray<string>}
 */
export const SHAPE_ARCHETYPES = Object.freeze([
  'sacred', 'civic', 'martial', 'industrial', 'mercantile', 'domestic', 'agrarian', 'exotic', 'element',
]);

/**
 * SHAPE_REGISTRY -- the frozen entry list. K-3 populates the GOTHIC family: two sacred buildings
 * (cathedral, evil chapel) + three ornament elements (rose, vault, tracery sampler). The remaining
 * archetypes are held by the structure, unpopulated until K-2's fantasy-core set + later genre packs.
 * @type {ReadonlyArray<ShapeEntry>}
 */
export const SHAPE_REGISTRY = /** @type {ReadonlyArray<ShapeEntry>} */ (Object.freeze([
  entry('cathedral', 'sacred', 'gothic', 'building', cathedralRuleset),
  entry('evilChapel', 'sacred', 'gothic', 'building', evilChapelRuleset),
  entry('roseWindow', 'element', 'gothic', 'element', roseWindowRuleset),
  entry('vaultBay', 'element', 'gothic', 'element', vaultBayRuleset),
  entry('traceryFamilies', 'element', 'gothic', 'element', traceryFamiliesRuleset),
]));

/** a shape entry, validating the archetype against the taxonomy. @param {string} id @param {string} archetype @param {string} genre @param {'building'|'element'} kind @param {() => object} builder @returns {ShapeEntry} */
function entry(id, archetype, genre, kind, builder) {
  if (!SHAPE_ARCHETYPES.includes(archetype)) throw new Error(`arch/shapeRegistry: archetype "${archetype}" not in SHAPE_ARCHETYPES`);
  return Object.freeze({ id, archetype, genre, kind, builder });
}

/** the frozen id -> entry map (built once). @type {Readonly<Record<string, ShapeEntry>>} */
const BY_ID = Object.freeze(SHAPE_REGISTRY.reduce((/** @type {Record<string, ShapeEntry>} */ acc, e) => { acc[e.id] = e; return acc; }, {}));

/** the registered shape ids (ascending). @type {ReadonlyArray<string>} */
export const SHAPE_IDS = Object.freeze(SHAPE_REGISTRY.map((e) => e.id).sort());

/** every entry of a given functional archetype. @param {string} archetype @returns {ReadonlyArray<ShapeEntry>} */
export function shapesByArchetype(archetype) { return SHAPE_REGISTRY.filter((e) => e.archetype === archetype); }

/** every entry of a given genre pack. @param {string} genre @returns {ReadonlyArray<ShapeEntry>} */
export function shapesByGenre(genre) { return SHAPE_REGISTRY.filter((e) => e.genre === genre); }

/** look up a shape entry by id, fail-closed. @param {string} id @returns {ShapeEntry} */
export function lookupShape(id) {
  const e = BY_ID[id];
  if (!e) throw new Error(`arch/shapeRegistry: shape "${id}" is not registered`);
  return e;
}

/** build a registered shape's ruleset by id. @param {string} id @returns {object} */
export function buildShape(id) { return lookupShape(id).builder(); }
