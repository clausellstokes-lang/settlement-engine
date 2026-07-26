/**
 * The transport-safe input boundary for TownSceneManifest compilation.
 *
 * A live viewer must not post raw campaign state to a worker. This module does
 * the comparatively small authorization work on the interaction thread:
 *
 *   1. project the settlement and cosmetic map edits for the requested audience;
 *   2. resolve the atmosphere, then retain only its audience-safe projection;
 *   3. detach the result from caller-owned objects;
 *   4. enforce one exact, JSON-safe, size-bounded envelope; and
 *   5. fingerprint that envelope for request identity.
 *
 * The worker receives no worldState or regionalGraph carrier. Consequently a
 * future compiler or error serializer cannot accidentally recover player-hidden
 * campaign facts after this boundary.
 */

import { deepClone } from '../clone.js';
import {
  compareSceneCodepoint,
  sceneRecord,
} from './sceneCompilePrimitives.js';
import { buildSceneAtmosphere } from './sceneLiving.js';
import { projectSettlementForScene } from './sceneProjection.js';
import { sceneDigest, stableSceneStringify } from './stableScene.js';

export const TOWN_SCENE_COMPILE_INPUT_KIND = 'TownSceneCompileInput';
export const TOWN_SCENE_COMPILE_INPUT_VERSION = 1;
export const TOWN_SCENE_COMPILE_INPUT_MAX_BYTES = 8 * 1024 * 1024;

const TOP_LEVEL_KEYS = Object.freeze([
  'atmosphere',
  'audience',
  'inputDigest',
  'kind',
  'mapEdits',
  'schemaVersion',
  'settlement',
]);
const ATMOSPHERE_KEYS = Object.freeze([
  'besieged',
  'festivalScale',
  'rebuiltCategories',
  'scarLevelPermille',
  'season',
  'severity',
]);

/**
 * @typedef {{
 *   season: string|null,
 *   severity: string|null,
 *   besieged: boolean,
 *   scarLevelPermille: number,
 *   rebuiltCategories: string[],
 *   festivalScale: number|null,
 * }} TownSceneCompileAtmosphere
 *
 * @typedef {{
 *   kind: 'TownSceneCompileInput',
 *   schemaVersion: 1,
 *   audience: 'dm'|'player'|'public',
 *   settlement: Record<string, unknown>,
 *   mapEdits: Record<string, unknown>|null,
 *   atmosphere: TownSceneCompileAtmosphere,
 *   inputDigest: string,
 * }} TownSceneCompileInput
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isPlainRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/** @param {Record<string, unknown>} value */
function compileInputCore(value) {
  return {
    kind: value.kind,
    schemaVersion: value.schemaVersion,
    audience: value.audience,
    settlement: value.settlement,
    mapEdits: value.mapEdits,
    atmosphere: value.atmosphere,
  };
}

/** @param {string[]} actual @param {readonly string[]} expected */
function sameKeys(actual, expected) {
  if (actual.length !== expected.length) return false;
  return actual.every((key, index) => key === expected[index]);
}

/** @param {string} value */
function utf8ByteLength(value) {
  return new TextEncoder().encode(value).byteLength;
}

/**
 * Generated settlements legitimately use absent optional object properties as
 * `undefined` in a few rich subsystem records. Those properties have no JSON
 * meaning and must not make an otherwise valid settlement impossible to send
 * to the scene worker. Omit them explicitly at this one transport boundary.
 *
 * Undefined or sparse array entries remain errors: silently removing an array
 * position could change ordered domain meaning. Every other unsupported value
 * is retained for stableSceneStringify to reject with its precise path.
 *
 * @param {unknown} value
 * @param {string} [path]
 * @param {Set<object>} [ancestors]
 * @returns {unknown}
 */
function omitOptionalUndefinedProperties(
  value,
  path = '$',
  ancestors = new Set(),
) {
  if (!value || typeof value !== 'object') return value;
  if (ancestors.has(value)) {
    throw new TypeError(`TownSceneCompileInput cannot contain a cycle at ${path}`);
  }
  if (!Array.isArray(value) && !isPlainRecord(value)) return value;

  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      return Array.from({ length: value.length }, (_, index) => {
        if (!(index in value) || value[index] === undefined) {
          throw new TypeError(
            `TownSceneCompileInput cannot omit an array entry at ${path}[${index}]`,
          );
        }
        return omitOptionalUndefinedProperties(
          value[index],
          `${path}[${index}]`,
          ancestors,
        );
      });
    }

    /** @type {Record<string, unknown>} */
    const normalized = {};
    for (const [key, entry] of Object.entries(value)) {
      if (entry === undefined) continue;
      normalized[key] = omitOptionalUndefinedProperties(
        entry,
        `${path}.${key}`,
        ancestors,
      );
    }
    return normalized;
  } finally {
    ancestors.delete(value);
  }
}

/**
 * Validate an already-authorized worker envelope without consulting campaign
 * state. Exact top-level keys are load-bearing: adding a raw carrier requires a
 * deliberate contract revision rather than silently widening the privacy wall.
 *
 * @param {unknown} candidate
 * @param {number} maximumBytes
 * @returns {{ ok: boolean, errors: string[] }}
 */
function validateTownSceneCompileInputWithMaximum(candidate, maximumBytes) {
  /** @type {string[]} */
  const errors = [];
  if (!isPlainRecord(candidate)) {
    return { ok: false, errors: ['input must be a plain object'] };
  }
  const value = candidate;
  const keys = Object.keys(value).sort(compareSceneCodepoint);
  if (!sameKeys(keys, TOP_LEVEL_KEYS)) {
    errors.push(`top-level keys must be exactly ${TOP_LEVEL_KEYS.join(', ')}`);
  }
  if (value.kind !== TOWN_SCENE_COMPILE_INPUT_KIND) {
    errors.push(`kind must be ${TOWN_SCENE_COMPILE_INPUT_KIND}`);
  }
  if (value.schemaVersion !== TOWN_SCENE_COMPILE_INPUT_VERSION) {
    errors.push(`schemaVersion must be ${TOWN_SCENE_COMPILE_INPUT_VERSION}`);
  }
  if (!['dm', 'player', 'public'].includes(String(value.audience))) {
    errors.push('audience must be dm, player, or public');
  }
  if (!isPlainRecord(value.settlement)) {
    errors.push('settlement must be a plain object');
  }
  if (value.mapEdits !== null && !isPlainRecord(value.mapEdits)) {
    errors.push('mapEdits must be a plain object or null');
  }

  const atmosphere = sceneRecord(value.atmosphere);
  const atmosphereKeys = Object.keys(atmosphere).sort(compareSceneCodepoint);
  if (!sameKeys(atmosphereKeys, ATMOSPHERE_KEYS)) {
    errors.push(`atmosphere keys must be exactly ${ATMOSPHERE_KEYS.join(', ')}`);
  }
  if (atmosphere.season !== null && typeof atmosphere.season !== 'string') {
    errors.push('atmosphere.season must be a string or null');
  }
  if (atmosphere.severity !== null && typeof atmosphere.severity !== 'string') {
    errors.push('atmosphere.severity must be a string or null');
  }
  if (typeof atmosphere.besieged !== 'boolean') {
    errors.push('atmosphere.besieged must be boolean');
  }
  if (
    !Number.isInteger(atmosphere.scarLevelPermille)
    || Number(atmosphere.scarLevelPermille) < 0
    || Number(atmosphere.scarLevelPermille) > 1000
  ) {
    errors.push('atmosphere.scarLevelPermille must be an integer from 0 to 1000');
  }
  if (
    !Array.isArray(atmosphere.rebuiltCategories)
    || atmosphere.rebuiltCategories.some((entry) => typeof entry !== 'string')
  ) {
    errors.push('atmosphere.rebuiltCategories must contain only strings');
  }
  if (
    atmosphere.festivalScale !== null
    && (!Number.isInteger(atmosphere.festivalScale) || Number(atmosphere.festivalScale) < 0)
  ) {
    errors.push('atmosphere.festivalScale must be a non-negative integer or null');
  }
  if (typeof value.inputDigest !== 'string') {
    errors.push('inputDigest must be a string');
  }

  let serialized = '';
  try {
    serialized = stableSceneStringify(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`input must be JSON-safe: ${message}`);
  }
  if (serialized && utf8ByteLength(serialized) > maximumBytes) {
    errors.push(`input exceeds ${maximumBytes} UTF-8 bytes`);
  }
  if (errors.length === 0) {
    const expectedDigest = sceneDigest(compileInputCore(value));
    if (value.inputDigest !== expectedDigest) {
      errors.push('inputDigest does not match the authorized input');
    }
  }
  return { ok: errors.length === 0, errors };
}

/**
 * @param {unknown} candidate
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateTownSceneCompileInput(candidate) {
  return validateTownSceneCompileInputWithMaximum(
    candidate,
    TOWN_SCENE_COMPILE_INPUT_MAX_BYTES,
  );
}

/**
 * @param {unknown} candidate
 * @returns {asserts candidate is TownSceneCompileInput}
 */
export function assertTownSceneCompileInput(candidate) {
  const result = validateTownSceneCompileInput(candidate);
  if (!result.ok) {
    throw new TypeError(`TownSceneCompileInput invalid: ${result.errors.join('; ')}`);
  }
}

/**
 * Project and detach the only payload the live scene worker is authorized to
 * read. Raw campaign atmosphere inputs are consumed here and deliberately not
 * retained in the returned object.
 *
 * @param {{
 *   settlement?: unknown,
 *   mapEdits?: unknown,
 *   worldState?: unknown,
 *   regionalGraph?: unknown,
 *   audience?: 'dm'|'player'|'public'|string,
 * }} input
 * @param {number} maximumBytes
 * @returns {TownSceneCompileInput}
 */
function prepareTownSceneCompileInputWithMaximum(input, maximumBytes) {
  const projected = projectSettlementForScene(
    input.settlement,
    input.mapEdits,
    input.audience,
  );
  const atmosphere = buildSceneAtmosphere(
    projected.settlement,
    input.worldState,
    input.regionalGraph,
    projected.audience,
  );
  const core = /** @type {Omit<TownSceneCompileInput, 'inputDigest'>} */ (
    deepClone(omitOptionalUndefinedProperties({
      kind: TOWN_SCENE_COMPILE_INPUT_KIND,
      schemaVersion: TOWN_SCENE_COMPILE_INPUT_VERSION,
      audience: projected.audience,
      settlement: projected.settlement,
      mapEdits: projected.mapEdits,
      atmosphere,
    }))
  );
  const prepared = /** @type {TownSceneCompileInput} */ ({
    ...core,
    inputDigest: sceneDigest(core),
  });
  const result = validateTownSceneCompileInputWithMaximum(
    prepared,
    maximumBytes,
  );
  if (!result.ok) {
    throw new TypeError(`TownSceneCompileInput invalid: ${result.errors.join('; ')}`);
  }
  return prepared;
}

/**
 * Project the bounded envelope admitted to the live worker.
 *
 * @param {{
 *   settlement?: unknown,
 *   mapEdits?: unknown,
 *   worldState?: unknown,
 *   regionalGraph?: unknown,
 *   audience?: 'dm'|'player'|'public'|string,
 * }} [input]
 * @returns {TownSceneCompileInput}
 */
export function prepareTownSceneCompileInput(input = {}) {
  return prepareTownSceneCompileInputWithMaximum(
    input,
    TOWN_SCENE_COMPILE_INPUT_MAX_BYTES,
  );
}

/**
 * Internal compatibility seam for the historical synchronous domain/export
 * compiler. It keeps the exact authorization and JSON-safety contract but does
 * not retrofit the worker transport's byte ceiling onto existing local callers.
 * The live worker still asserts the normal bounded contract on receipt.
 *
 * @internal
 * @param {{
 *   settlement?: unknown,
 *   mapEdits?: unknown,
 *   worldState?: unknown,
 *   regionalGraph?: unknown,
 *   audience?: 'dm'|'player'|'public'|string,
 * }} [input]
 * @returns {TownSceneCompileInput}
 */
export function prepareTownSceneCompileInputForSynchronousCompiler(input = {}) {
  return prepareTownSceneCompileInputWithMaximum(
    input,
    Number.MAX_SAFE_INTEGER,
  );
}
