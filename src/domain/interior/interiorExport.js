/**
 * domain/interior/interiorExport.js — the interior export lane (DOOR 3).
 *
 * PRE-WALLED BY CONSTRUCTION. The town map has no literal walls, so its UVTT export is
 * a documented seam (townMapExport.js MAP-EXPORTS-2) that must DERIVE blocking segments
 * from rect footprints. An interior HAS literal walls — model.walls IS the geometry — so
 * the UVTT `line_of_sight` is a 1:1 image of the wall segments and the `portals` a 1:1
 * image of the doors. No derivation, no drift: the pin (interiorExport.test.js) asserts
 * exactly one line-of-sight segment per (visible) wall.
 *
 * FAIL-CLOSED covert scrub: a UVTT scene is a shareable battlemap. Covert geometry (the
 * DM-only concealed chamber) is NEVER emitted — buildInteriorUvtt filters covert walls /
 * doors by construction, so even a raw DM model exported here cannot leak the hidden room
 * (the covert-scrub precedent, defense-in-depth over toPublicSafeInterior).
 *
 * PRICING SEAM (owner-pending ladder ruling): interior export rides the EXISTING per-
 * settlement export-bundle entitlement lane (resolveExportAccess — the $2.99 dossier
 * bundle). `interiorExportGateReady` is the ONE predicate the owner wires when the free /
 * premium / bundle split is ruled; today it is a pass-through seam seam-tested but wired
 * to no UI (record the seam, wire nothing new).
 *
 * PURE + deterministic: UVTT JSON + SVG string are byte-identical per (model, lens).
 * No Date / Math.random / localeCompare / document / canvas (a browser download adapter
 * lives in the component, not this domain file).
 */

import { buildInteriorSvg, hasDrawableInterior } from './interiorDraw.js';
import { slugify } from '../townMap/anchors.js';

/** The VTT grid: the interior 0..1000 view maps to a 20×20 cell scene at the same
 *  50-units-per-cell scale the town-map VTT lens uses (pixels_per_grid = token px). */
const VIEW = 1000;
const UNITS_PER_CELL = 50;
const CELLS = VIEW / UNITS_PER_CELL; // 20
const PIXELS_PER_GRID = 70;

/** View-space scalar → grid-cell scalar (deterministic; keeps up to 4 decimals so the
 *  JSON is byte-stable — round to avoid IEEE tails). @param {number} v @returns {number} */
function toCell(v) {
  return Math.round((v / UNITS_PER_CELL) * 10000) / 10000;
}

/**
 * @typedef {Object} UvttScene
 * @property {string} format @property {'uvtt'} software
 * @property {{ map_origin: {x:number,y:number}, map_size: {x:number,y:number}, pixels_per_grid: number }} resolution
 * @property {Array<Array<{x:number,y:number}>>} line_of_sight
 * @property {Array<{ position:{x:number,y:number}, bounds:Array<{x:number,y:number}>, rotation:number, closed:boolean, freestanding:boolean }>} portals
 * @property {unknown[]} lights
 * @property {{ baked_lighting:boolean, ambient_light:string }} environment
 */

/**
 * Build the UVTT (.dd2vtt / .uvtt) scene for an interior model. `line_of_sight` is a
 * 1:1 image of the VISIBLE wall segments (covert filtered — fail-closed); `portals` a
 * 1:1 image of the visible doors. Coordinates are in grid cells. Pure + deterministic.
 * The `image` field is intentionally omitted here (the browser adapter attaches the
 * rasterized battlemap PNG); the geometry is the deterministic, testable half.
 * @param {import('./interiorModel.js').InteriorModel | null | undefined} model
 * @returns {UvttScene}
 */
export function buildInteriorUvtt(model) {
  const walls = Array.isArray(model?.walls) ? model.walls.filter((w) => w.covert !== true) : [];
  const doors = Array.isArray(model?.doors) ? model.doors.filter((d) => d.covert !== true) : [];
  const line_of_sight = walls.map((w) => [
    { x: toCell(w.x1), y: toCell(w.y1) },
    { x: toCell(w.x2), y: toCell(w.y2) },
  ]);
  const portals = doors.map((d) => ({
    position: { x: toCell(Math.round((d.x1 + d.x2) / 2)), y: toCell(Math.round((d.y1 + d.y2) / 2)) },
    bounds: [{ x: toCell(d.x1), y: toCell(d.y1) }, { x: toCell(d.x2), y: toCell(d.y2) }],
    rotation: 0,
    closed: false,
    freestanding: false,
  }));
  return {
    format: '0.3.0',
    software: 'uvtt',
    resolution: {
      map_origin: { x: 0, y: 0 },
      map_size: { x: CELLS, y: CELLS },
      pixels_per_grid: PIXELS_PER_GRID,
    },
    line_of_sight,
    portals,
    lights: [],
    environment: { baked_lighting: true, ambient_light: 'ffffffff' },
  };
}

/**
 * The interior SVG string for a settlement's institution under a lens — the native
 * (vector) export. `null` when the interior is degenerate (nothing to draw).
 * @param {import('./interiorModel.js').InteriorModel | null | undefined} model
 * @param {{ style?: string, resolution?: number }} [opts]
 * @returns {string | null}
 */
export function interiorExportSvg(model, opts = {}) {
  if (!hasDrawableInterior(model)) return null;
  const size = opts.resolution || 1600;
  return buildInteriorSvg(model, { style: opts.style, width: size, height: size });
}

/** A filesystem-safe interior export filename: `<settlement>-<institution>-interior[-<lens>].<ext>`.
 *  Date-free (a browser adapter may prepend a stamp) — this domain file stays pure.
 * @param {string} settlementName @param {string} institutionName @param {string} ext @param {string} [lens]
 * @returns {string} */
export function interiorExportFilename(settlementName, institutionName, ext, lens) {
  const s = slugify(settlementName) || 'settlement';
  const i = slugify(institutionName) || 'institution';
  const l = lens && lens !== 'parchment' ? `-${slugify(lens)}` : '';
  return `${s}-${i}-interior${l}.${ext || 'svg'}`;
}

/**
 * THE PRICING SEAM (owner-pending). The ONE predicate interior export routes through:
 * it rides the EXISTING per-settlement export bundle decision (resolveExportAccess →
 * `{ allowed }`, the $2.99 dossier/Foundry bundle lane), so a single owner ruling flips
 * both the map export and the interior export together — never a new gate class. Today
 * it is a pass-through of the resolved access; the free/premium/bundle split is the
 * owner's ladder call. Wired to no UI by this lane (record the seam, wire nothing new).
 * @param {{ allowed?: boolean } | null | undefined} exportAccess  the resolveExportAccess result
 * @returns {boolean}
 */
export function interiorExportGateReady(exportAccess) {
  return exportAccess?.allowed === true;
}
