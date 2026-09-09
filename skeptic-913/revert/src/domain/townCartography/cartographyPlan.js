/**
 * townCartography/cartographyPlan.js — THE SHARED NARROWING KERNEL (TC-3a).
 *
 * The plan-space narrowing every TC-3 stage needs, and nothing else. A cartography
 * stage reads UNTRUSTED manifest values — a district row is `unknown` until something
 * proves it carries a string id and an integer centroid — and the narrowing that
 * proves it must be spelled ONCE. Two copies of `planPoint` would be two definitions
 * of what an integer plan coordinate is, and the first time one gained a tolerance
 * the ward layer and the parcel layer would disagree about the same town.
 *
 * ZERO IMPORTS BY DESIGN, for the reason cartographyTuning.js states: a leaf that
 * pulls in a module can never be the leaf a lazy chunk safely imports. This one is
 * imported by the ward layer today and by the parcel layer at TC-3b, which is the
 * whole reason it is a separate module rather than a section of either.
 *
 * The `premise` prefix deliberately reads `TC-3`, not `TC-3a`: TC-3a and TC-3b are
 * ONE behavior family split for budget, and the error a DM or a test sees names the
 * family rather than the wave that happened to emit it.
 *
 * Pure and headless: no store, no clock, no randomness, no I/O, no module-scope
 * mutable state.
 *
 * @enforced-by tests/domain/townCartographyWards.test.js
 * @enforced-by tests/domain/townCartographyDeterminism.test.js
 */

/**
 * @typedef {[number, number]} PlanPoint
 * @typedef {{ kind: string, ref: string|null }} CartographyProvenance
 * @typedef {{ id: string, category: string, footprint: PlanPoint[],
 *   centroid: PlanPoint, densityPermille: number }} SourceDistrict
 */

/** A district that publishes no density has no opinion about tone; 500 is the midpoint. */
const DEFAULT_TONE_PERMILLE = 500;

/** Every generated TC-3 row carries the same provenance; an edit never reaches here.
 *  @returns {CartographyProvenance} */
export function generatedProvenance() {
  return { kind: 'generated', ref: null };
}

/** @param {string} message @returns {RangeError} */
export function premise(message) {
  return new RangeError(`townCartography TC-3 premise: ${message}`);
}

/** @param {unknown} value @returns {Record<string, unknown>} */
export function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {unknown[]} */
export function list(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {string} a @param {string} b @returns {number} */
export function byCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {unknown} value @returns {PlanPoint|null} */
export function planPoint(value) {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const x = value[0];
  const z = value[1];
  if (typeof x !== 'number' || typeof z !== 'number') return null;
  if (!Number.isInteger(x) || !Number.isInteger(z)) return null;
  return [x, z];
}

/** @param {unknown} value @returns {PlanPoint[]} */
export function planPolygon(value) {
  /** @type {PlanPoint[]} */
  const points = [];
  for (const raw of list(value)) {
    const point = planPoint(raw);
    if (point) points.push(point);
  }
  return points;
}

/** @param {number[]} values @returns {number} */
export function roundedMean(values) {
  let sum = 0;
  for (const value of values) sum += value;
  return Math.round(sum / values.length);
}

/**
 * NARROW THE CANONICAL DISTRICTS the manifest publishes into the exact rows a
 * cartography stage may read, sorted by raw codepoint id so every downstream order
 * rides the DATA rather than the array the compiler happened to hand over.
 * @param {unknown} districts
 * @returns {SourceDistrict[]}
 */
export function sourceDistricts(districts) {
  /** @type {SourceDistrict[]} */
  const rows = [];
  for (const raw of list(districts)) {
    const district = record(raw);
    const id = district.id;
    const centroid = planPoint(district.centroid);
    if (typeof id !== 'string' || !id || !centroid) continue;
    const density = district.densityPermille;
    rows.push({
      id,
      category: typeof district.category === 'string' ? district.category : '',
      footprint: planPolygon(district.footprint),
      centroid,
      densityPermille: Number.isInteger(density)
        ? Math.min(1000, Math.max(0, Number(density)))
        : DEFAULT_TONE_PERMILLE,
    });
  }
  return rows.sort((a, b) => byCodepoint(a.id, b.id));
}
