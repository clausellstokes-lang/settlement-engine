/**
 * domain/construct/configVocabulary.js — the CONFIG VOCABULARY for S5/S6 construction
 * (Surveyor S5/S6, DESIGN_AI_CONTROL_SURFACE §2 stages 5–6). "The config vocabulary IS the op."
 *
 * Construction compiles intent → generator CONFIG → deterministic generate. The schema wall
 * here is the CONFIG surface: the compiler may emit ONLY registered config keys with bounded
 * values — a hallucinated config key dies at the wall (dropped-and-listed), so the compiler
 * can NEVER write config vocabulary the pipeline ignores (the F2/G2 config-seam integrity,
 * walker-pinned: every key here is read by the generator pipeline).
 *
 * Two config surfaces, one philosophy:
 *   • SETTLEMENT (S5) — a curated, intent-expressible subset of DEFAULT_CONFIG (configSlice.js).
 *   • REALM (S6) — the instant-world composer's three knobs (realmSize / tone / mapKind).
 *
 * Plus the CONSTRAINT vocabulary — the coarse target bands the compiler declares its INTENT
 * against, which the deterministic comparator (intentComparator.js) judges the result by.
 *
 * PURE, headless, no store/React/transport. Read only by the lazy construction panel/transport
 * ⇒ zero eager bytes. Emits only registered key/enum strings.
 */

import { isRealmSize, isTone, isMapKind, REALM_SIZES, TONES, MAP_KINDS } from '../instantWorld/worldPlan.js';

/** The tiers a settType may name (smallest→largest) + the two resolver sentinels. */
export const SETT_TYPES = Object.freeze(['random', 'custom', 'thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/**
 * The SETTLEMENT config fields the compiler may emit — a curated subset of DEFAULT_CONFIG,
 * every key read by the generator pipeline (walker-pinned). Each: a `type` + bounds.
 *   enum  → value ∈ `values`
 *   number→ min..max (clamped-or-dropped is the caller's choice; here: dropped if out of range)
 *   bool  → boolean
 *   string→ free string, capped (the pipeline resolves unknowns fail-open, e.g. random_*)
 * @type {Readonly<Record<string, { type: 'enum'|'number'|'bool'|'string', values?: readonly string[], min?: number, max?: number, max_len?: number }>>}
 */
export const SETTLEMENT_CONFIG_FIELDS = Object.freeze({
  settType:               { type: 'enum', values: SETT_TYPES },
  population:             { type: 'number', min: 20, max: 5_000_000 },
  priorityEconomy:       { type: 'number', min: 0, max: 100 },
  priorityMilitary:      { type: 'number', min: 0, max: 100 },
  priorityMagic:         { type: 'number', min: 0, max: 100 },
  priorityReligion:      { type: 'number', min: 0, max: 100 },
  priorityCriminal:      { type: 'number', min: 0, max: 100 },
  magicExists:           { type: 'bool' },
  culture:               { type: 'string', max_len: 40 },
  tradeRouteAccess:      { type: 'string', max_len: 40 },
  monsterThreat:         { type: 'string', max_len: 40 },
  settlementAgeMode:     { type: 'enum', values: ['auto', 'custom'] },
  settlementAgeYears:    { type: 'number', min: 0, max: 10_000 },
  selectedStressesRandom:{ type: 'bool' },
  customName:            { type: 'string', max_len: 60 },
});

/** The REALM knobs the compiler may emit — the instant-world composer's basicConfig. */
export const REALM_CONFIG_FIELDS = Object.freeze({
  realmSize: { type: 'enum', check: isRealmSize },
  tone:      { type: 'enum', check: isTone },
  mapKind:   { type: 'enum', check: isMapKind },
});

/** The four constraint dimensions (the systemState axes deriveSystemState produces). */
export const CONSTRAINT_DIMENSIONS = Object.freeze(['resilience', 'volatility', 'externalThreat', 'resourcePressure']);
/** The coarse target band a constraint names — value <34 low, 34..66 moderate, >66 high. */
export const CONSTRAINT_BANDS = Object.freeze(['low', 'moderate', 'high']);
const _dimSet = new Set(CONSTRAINT_DIMENSIONS);
const _bandSet = new Set(CONSTRAINT_BANDS);

/** Coarse target band for a 0..100 value. Pure.
 *  @param {number} value @returns {'low'|'moderate'|'high'} */
export function coarseBand(value) {
  if (!Number.isFinite(value)) return 'moderate';
  if (value < 34) return 'low';
  if (value > 66) return 'high';
  return 'moderate';
}

/** @typedef {{ type: string, values?: readonly string[], min?: number, max?: number, max_len?: number, check?: (v: unknown) => boolean }} FieldSpec */

/** @param {FieldSpec} spec @param {unknown} value @returns {boolean} */
function validOne(spec, value) {
  switch (spec.type) {
    case 'enum':
      if (spec.check) return spec.check(value);
      return typeof value === 'string' && Array.isArray(spec.values) && spec.values.includes(value);
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
        && (spec.min === undefined || value >= spec.min) && (spec.max === undefined || value <= spec.max);
    case 'bool':
      return typeof value === 'boolean';
    case 'string':
      return typeof value === 'string' && (spec.max_len === undefined || value.length <= spec.max_len);
    default:
      return false;
  }
}

/**
 * Validate a raw config against a field spec map (THE SCHEMA WALL). Pure + total. Keeps only
 * registered keys with valid values; every other key (unregistered, or a bounded key with a
 * bad value) is DROPPED and listed in `unsupported` — the compiler can never write config the
 * pipeline ignores.
 * @param {Record<string, unknown>|null|undefined} rawConfig
 * @param {Record<string, { type: string, values?: readonly string[], min?: number, max?: number, max_len?: number, check?: (v: unknown) => boolean }>} fields
 * @returns {{ config: Record<string, unknown>, unsupported: Array<{ key: string, reason: 'unregistered_key'|'invalid_value' }> }}
 */
export function validateConfig(rawConfig, fields) {
  /** @type {Record<string, unknown>} */
  const config = {};
  /** @type {Array<{ key: string, reason: 'unregistered_key'|'invalid_value' }>} */
  const unsupported = [];
  const r = (rawConfig && typeof rawConfig === 'object' && !Array.isArray(rawConfig)) ? rawConfig : {};
  for (const [key, value] of Object.entries(r)) {
    const spec = Object.prototype.hasOwnProperty.call(fields, key) ? fields[key] : null;
    if (!spec) { unsupported.push({ key, reason: 'unregistered_key' }); continue; }
    if (!validOne(spec, value)) { unsupported.push({ key, reason: 'invalid_value' }); continue; }
    config[key] = value;
  }
  return { config, unsupported };
}

/** Validate a settlement config against the wall. Pure.
 *  @param {Record<string, unknown>|null|undefined} rawConfig */
export function validateSettlementConfig(rawConfig) {
  return validateConfig(rawConfig, SETTLEMENT_CONFIG_FIELDS);
}

/** Validate realm knobs against the wall. Pure.
 *  @param {Record<string, unknown>|null|undefined} rawConfig */
export function validateRealmConfig(rawConfig) {
  return validateConfig(rawConfig, REALM_CONFIG_FIELDS);
}

/**
 * Validate the compiler's declared CONSTRAINTS (target dimension bands) — the intent the
 * comparator judges against. Keeps only real dimensions with a real band. Pure.
 * @param {Record<string, unknown>|null|undefined} rawConstraints
 * @returns {{ constraints: Record<string, 'low'|'moderate'|'high'>, unsupported: Array<{ key: string }> }}
 */
export function validateConstraints(rawConstraints) {
  /** @type {Record<string, 'low'|'moderate'|'high'>} */
  const constraints = {};
  /** @type {Array<{ key: string }>} */
  const unsupported = [];
  const r = (rawConstraints && typeof rawConstraints === 'object' && !Array.isArray(rawConstraints)) ? rawConstraints : {};
  for (const [key, value] of Object.entries(r)) {
    if (_dimSet.has(key) && typeof value === 'string' && _bandSet.has(value)) {
      constraints[key] = /** @type {'low'|'moderate'|'high'} */ (value);
    } else {
      unsupported.push({ key });
    }
  }
  return { constraints, unsupported };
}

/** The realm knobs as a JSON-serializable {type:'enum', values} descriptor (the `check`-fn form
 *  in REALM_CONFIG_FIELDS can't be POSTed; this is the wire shape, uniform with settlementFields). */
export const REALM_FIELDS_WIRE = Object.freeze({
  realmSize: { type: 'enum', values: Object.keys(REALM_SIZES) },
  tone:      { type: 'enum', values: TONES.map((t) => t.id) },
  mapKind:   { type: 'enum', values: MAP_KINDS.map((m) => m.id) },
});

/** Build the construct-vocabulary descriptor the client POSTs (settlement + realm + constraints).
 *  Pure. The edge grounds the compiler on it; the client validates against it. Both config
 *  surfaces share one wire shape ({ type, values, min, max }) so the edge validates uniformly. */
export function buildConstructVocabulary() {
  return {
    settlementFields: SETTLEMENT_CONFIG_FIELDS,
    realmFields: REALM_FIELDS_WIRE,
    constraintDimensions: [...CONSTRAINT_DIMENSIONS],
    constraintBands: [...CONSTRAINT_BANDS],
  };
}
