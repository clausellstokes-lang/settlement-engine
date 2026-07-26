/**
 * Compact synchronous admission for public content tunables.
 *
 * Campaign persistence must reject malformed pinned environments before they
 * enter state, while the generator's application policy should remain lazy.
 * This module therefore owns only the closed registry and fail-closed value
 * validation. userContentTunables.js re-exports this authority and adds the
 * generation-time resolution behavior.
 */

import {
  USER_CONTENT_TUNABLE_INTENT_DEFAULTS,
} from './userContentTunableIntent.js';

/**
 * @typedef {{
 *   type:'number',
 *   min:number,
 *   max:number,
 *   defaultValue:number,
 *   label:string,
 * } | {
 *   type:'boolean',
 *   defaultValue:boolean,
 *   label:string,
 * }} UserContentTunableSpec
 * @typedef {{key:string, reason:string}} UserContentTunableRejection
 * @typedef {{
 *   ok:boolean,
 *   tunables:Record<string, number|boolean>,
 *   rejected:UserContentTunableRejection[],
 * }} UserContentTunableValidation
 */

/** @type {Readonly<Record<string, Readonly<UserContentTunableSpec>>>} */
export const USER_CONTENT_TUNABLES = Object.freeze({
  priorityEconomy: Object.freeze({
    type: 'number',
    min: 0,
    max: 100,
    defaultValue: USER_CONTENT_TUNABLE_INTENT_DEFAULTS.priorityEconomy,
    label: 'Economic emphasis',
  }),
  priorityMilitary: Object.freeze({
    type: 'number',
    min: 0,
    max: 100,
    defaultValue: USER_CONTENT_TUNABLE_INTENT_DEFAULTS.priorityMilitary,
    label: 'Military emphasis',
  }),
  priorityMagic: Object.freeze({
    type: 'number',
    min: 0,
    max: 100,
    defaultValue: USER_CONTENT_TUNABLE_INTENT_DEFAULTS.priorityMagic,
    label: 'Arcane emphasis',
  }),
  priorityReligion: Object.freeze({
    type: 'number',
    min: 0,
    max: 100,
    defaultValue: USER_CONTENT_TUNABLE_INTENT_DEFAULTS.priorityReligion,
    label: 'Religious emphasis',
  }),
  priorityCriminal: Object.freeze({
    type: 'number',
    min: 0,
    max: 100,
    defaultValue: USER_CONTENT_TUNABLE_INTENT_DEFAULTS.priorityCriminal,
    label: 'Underworld emphasis',
  }),
  magicExists: Object.freeze({
    type: 'boolean',
    defaultValue: USER_CONTENT_TUNABLE_INTENT_DEFAULTS.magicExists,
    label: 'Magic exists',
  }),
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function plainRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value */
function isPlainRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/**
 * Fail closed on unknown keys and invalid types. Number values are rejected,
 * not silently clamped, because a reviewed pack must mean the same thing on
 * import as it did on export.
 *
 * @param {unknown} value
 * @returns {UserContentTunableValidation}
 */
export function validateUserContentTunables(value) {
  if (value != null && !isPlainRecord(value)) {
    return {
      ok: false,
      tunables: {},
      rejected: [{ key: '$tunables', reason: 'invalid_container' }],
    };
  }
  /** @type {Record<string, number|boolean>} */
  const accepted = {};
  /** @type {UserContentTunableRejection[]} */
  const rejected = [];
  for (const [key, raw] of Object.entries(plainRecord(value))) {
    const spec = USER_CONTENT_TUNABLES[key];
    if (!spec) {
      rejected.push({ key, reason: 'unregistered_tunable' });
      continue;
    }
    if (spec.type === 'boolean') {
      if (typeof raw !== 'boolean') {
        rejected.push({ key, reason: 'invalid_type' });
      } else {
        accepted[key] = raw;
      }
      continue;
    }
    if (typeof raw !== 'number' || !Number.isFinite(raw)) {
      rejected.push({ key, reason: 'invalid_type' });
      continue;
    }
    if (!Number.isInteger(raw)) {
      rejected.push({ key, reason: 'non_integer' });
      continue;
    }
    if (raw < spec.min || raw > spec.max) {
      rejected.push({ key, reason: 'out_of_bounds' });
      continue;
    }
    accepted[key] = raw;
  }
  return {
    ok: rejected.length === 0,
    tunables: accepted,
    rejected,
  };
}
