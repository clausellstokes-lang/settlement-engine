/**
 * townCartography/cartographyPaint.js — THE CARTOGRAPHY PAINT LEAF (TC-5a).
 *
 * Turns a compiled `manifest.cartography` block into an ordered, deterministic,
 * COLOUR-FREE draw-op list. It renders nothing and mounts nothing: the SVG surface,
 * the token binding and the degraded states are TC-5b's, the raster is TC-5c's, and
 * the skins are TC-5d's. This leaf is the pure half, and it has ZERO production
 * importers by design — which is what keeps it out of the bounded worker/compiler
 * chunk pair (CR-TC3B-BYTES; the exclusion is an acceptance case, not a hope).
 *
 * ── THE LENGTH IDENTITY, NOT A BAND ──────────────────────────────────────────
 * This leaf authors NO op ceiling. The list's length is an IDENTITY over the block's
 * own record counts:
 *
 *   ops.length === wards.length + streets.arterials.length
 *                + streets.lanes.length + buildings.length
 *
 * A band derived from a cap can drift out of agreement with the cap; an identity over
 * the subject's own counts cannot disagree with anything. `parcels[]` emits no op — a
 * parcel is a placement SLOT, not a drawn thing — but it is still READ, because a
 * building's tone rides the ward that owns its parcel.
 *
 * ── GEOMETRY IS COPIED, NEVER RECOMPUTED ─────────────────────────────────────
 * A ward op's polygon IS the block's polygon and a building op's polygon IS the
 * block's footprint, by reference. The painter owns no geometry, so `footprint ⊂
 * parcel ⊂ ward` needs no re-proof here and cannot be broken here. Ops are frozen
 * SHALLOWLY on purpose: deep-freezing would reach through into the caller's own block
 * and mutate the input's arrays, which a pure function may not do.
 *
 * ── AUDIENCE: A PROHIBITION, NOT A FEATURE ───────────────────────────────────
 * compileTownSceneManifest.js threads `audience` through the base manifest BEFORE the
 * cartography stage runs, so a player-audience block already lacks covert structures
 * and the painter inherits the projection by construction. `buildCartographyDrawList`
 * therefore takes NO audience parameter, and that absence is what enforces the rule:
 * the painter must never filter at paint time, because a second filter here would be a
 * second truth about what a given audience may see.
 *
 * Pure and headless: no store, no clock, no randomness, no I/O, no module-scope
 * mutable state, no PRNG draw, no fork label, no float, no while/do loop.
 *
 * @enforced-by tests/domain/townCartographyPaint.test.js
 * @enforced-by tests/domain/townCartographyDeterminism.test.js
 */
import { byCodepoint, premise } from './cartographyPlan.js';
import {
  paintRoleForWardKind,
  streetWeightForClass,
  toneShiftForCondition,
} from './cartographyPaintRoles.js';

/**
 * @typedef {{ op: 'ward', id: string, polygon: unknown, role: string,
 *   tonePermille: number }} CartographyWardOp
 * @typedef {{ op: 'street', id: string, polyline: unknown, classKind: string,
 *   widthPlan: number, weightPermille: number, role: string }} CartographyStreetOp
 * @typedef {{ op: 'building', id: string, polygon: unknown, role: string,
 *   tonePermille: number, condition: string }} CartographyBuildingOp
 * @typedef {CartographyWardOp|CartographyStreetOp|CartographyBuildingOp} CartographyDrawOp
 */

/** The one empty result. Absence returns this rather than null, so a caller never
 *  branches on shape before it can iterate. */
const EMPTY_DRAW_LIST = /** @type {ReadonlyArray<CartographyDrawOp>} */ (Object.freeze([]));

/** The tonal floor and ceiling a permille tone is clamped into, inclusive both ends. */
const TONE_FLOOR_PERMILLE = 0;
const TONE_CEILING_PERMILLE = 1000;

/**
 * A record, or a loud failure. Deliberately NOT cartographyPlan's `record`, which
 * narrows a non-record to `{}` — that fails OPEN here, turning a malformed block into
 * an empty picture instead of an error.
 * @param {unknown} value @param {string} at @returns {Record<string, unknown>}
 */
function requireRecord(value, at) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw premise(`${at} must be a record`);
  }
  return /** @type {Record<string, unknown>} */ (value);
}

/**
 * An array, or a loud failure. Same reasoning as requireRecord: cartographyPlan's
 * `list` narrows a non-array to `[]`, which would silently drop a whole layer.
 * @param {unknown} value @param {string} at @returns {unknown[]}
 */
function requireLayer(value, at) {
  if (!Array.isArray(value)) throw premise(`${at} must be an array`);
  return value;
}

/** @param {unknown} value @param {string} at @returns {string} */
function requireText(value, at) {
  if (typeof value !== 'string' || !value) throw premise(`${at} must be a non-empty string`);
  return value;
}

/** @param {unknown} value @param {string} at @returns {number} */
function requireInteger(value, at) {
  if (!Number.isInteger(value)) throw premise(`${at} must be an integer`);
  return /** @type {number} */ (value);
}

/** @param {unknown} value @param {string} at @returns {number} */
function requirePermille(value, at) {
  const scalar = requireInteger(value, at);
  if (scalar < TONE_FLOOR_PERMILLE || scalar > TONE_CEILING_PERMILLE) {
    throw premise(`${at} must be a permille scalar in 0..1000`);
  }
  return scalar;
}

/** @param {unknown} value @param {string} at @returns {unknown[]} */
function requireGeometry(value, at) {
  return requireLayer(value, at);
}

/**
 * Sort a narrowed row set by raw codepoint id, so the emission order rides the DATA
 * rather than the array order the compiler happened to hand over.
 * @template {{ id: string }} T @param {T[]} rows @returns {T[]}
 */
function byId(rows) {
  return rows.slice().sort((a, b) => byCodepoint(a.id, b.id));
}

/**
 * Clamp a tone into the permille range, inclusive at both ends.
 * @param {number} tone @returns {number}
 */
function clampTone(tone) {
  return Math.min(TONE_CEILING_PERMILLE, Math.max(TONE_FLOOR_PERMILLE, tone));
}

/**
 * BUILD THE DRAW LIST — painter's algorithm, back to front: wards, then the streets
 * over them (arterials before lanes), then the buildings on top.
 *
 * @param {unknown} cartography a compiled cartography block, or null/undefined
 * @returns {ReadonlyArray<CartographyDrawOp>} frozen ops in deterministic order
 */
export function buildCartographyDrawList(cartography) {
  if (cartography === null || cartography === undefined) return EMPTY_DRAW_LIST;
  const block = requireRecord(cartography, 'cartography block');
  const streets = requireRecord(block.streets, 'cartography.streets');
  const wardRows = requireLayer(block.wards, 'cartography.wards');
  const parcelRows = requireLayer(block.parcels, 'cartography.parcels');
  const buildingRows = requireLayer(block.buildings, 'cartography.buildings');
  const arterialRows = requireLayer(streets.arterials, 'cartography.streets.arterials');
  const laneRows = requireLayer(streets.lanes, 'cartography.streets.lanes');

  /** @type {CartographyDrawOp[]} */
  const ops = [];
  /** @type {Map<string, { role: string, tonePermille: number }>} */
  const wardById = new Map();
  /** @type {{ id: string, polygon: unknown, role: string, tonePermille: number }[]} */
  const wards = [];
  for (const [index, raw] of wardRows.entries()) {
    const at = `cartography.wards[${index}]`;
    const row = requireRecord(raw, at);
    const ward = {
      id: requireText(row.id, `${at}.id`),
      polygon: requireGeometry(row.polygon, `${at}.polygon`),
      role: paintRoleForWardKind(row.kind),
      tonePermille: requirePermille(row.tonePermille, `${at}.tonePermille`),
    };
    wardById.set(ward.id, { role: ward.role, tonePermille: ward.tonePermille });
    wards.push(ward);
  }
  for (const ward of byId(wards)) {
    ops.push(Object.freeze({
      op: /** @type {'ward'} */ ('ward'),
      id: ward.id,
      polygon: ward.polygon,
      role: ward.role,
      tonePermille: ward.tonePermille,
    }));
  }

  // Parcels draw NOTHING, but they are the only path from a building to its ward, so
  // the layer is read for its references and for nothing else.
  /** @type {Map<string, string>} */
  const wardIdByParcelId = new Map();
  for (const [index, raw] of parcelRows.entries()) {
    const at = `cartography.parcels[${index}]`;
    const row = requireRecord(raw, at);
    wardIdByParcelId.set(
      requireText(row.id, `${at}.id`),
      requireText(row.wardId, `${at}.wardId`),
    );
  }

  for (const [layerName, rows] of [['arterials', arterialRows], ['lanes', laneRows]]) {
    /** @type {{ id: string, polyline: unknown, classKind: string, widthPlan: number }[]} */
    const streetRows = [];
    for (const [index, raw] of /** @type {unknown[]} */ (rows).entries()) {
      const at = `cartography.streets.${String(layerName)}[${index}]`;
      const row = requireRecord(raw, at);
      streetRows.push({
        id: requireText(row.id, `${at}.id`),
        polyline: requireGeometry(row.polyline, `${at}.polyline`),
        classKind: requireText(row.classKind, `${at}.classKind`),
        widthPlan: requireInteger(row.widthPlan, `${at}.widthPlan`),
      });
    }
    for (const street of byId(streetRows)) {
      ops.push(Object.freeze({
        op: /** @type {'street'} */ ('street'),
        id: street.id,
        polyline: street.polyline,
        classKind: street.classKind,
        widthPlan: street.widthPlan,
        weightPermille: streetWeightForClass(street.classKind),
        role: 'street',
      }));
    }
  }

  /** @type {{ id: string, polygon: unknown, role: string, tonePermille: number,
   *   condition: string }[]} */
  const buildings = [];
  for (const [index, raw] of buildingRows.entries()) {
    const at = `cartography.buildings[${index}]`;
    const row = requireRecord(raw, at);
    const parcelId = requireText(row.parcelId, `${at}.parcelId`);
    const wardId = wardIdByParcelId.get(parcelId);
    if (wardId === undefined) {
      throw premise(`${at}.parcelId names '${parcelId}', which no parcel in this block declares`);
    }
    const ward = wardById.get(wardId);
    if (ward === undefined) {
      throw premise(`${at} sits in parcel '${parcelId}', whose ward '${wardId}' is not in this block`);
    }
    const condition = requireText(row.condition, `${at}.condition`);
    buildings.push({
      id: requireText(row.id, `${at}.id`),
      polygon: requireGeometry(row.footprint, `${at}.footprint`),
      role: ward.role,
      tonePermille: clampTone(ward.tonePermille + toneShiftForCondition(condition)),
      condition,
    });
  }
  for (const building of byId(buildings)) {
    ops.push(Object.freeze({
      op: /** @type {'building'} */ ('building'),
      id: building.id,
      polygon: building.polygon,
      role: building.role,
      tonePermille: building.tonePermille,
      condition: building.condition,
    }));
  }

  return /** @type {ReadonlyArray<CartographyDrawOp>} */ (Object.freeze(ops));
}
