/**
 * Closed registry for environment-level visual selections.
 *
 * TownScene already exposes registered presentation fields on individual
 * definitions. No environment-wide visual switch has a runtime consumer yet,
 * so the honest registry is currently empty. Persisting speculative palette or
 * renderer keys would make reviewed environments claim behavior the product
 * silently ignores and would widen browser/PostgreSQL hash parity unnecessarily.
 *
 * Add a key here only together with its renderer consumer, accessibility
 * fallback, pack admission rule, PostgreSQL mirror, and parity tests.
 */

import { isPlainContentRecord } from './contentFingerprint.js';

export const USER_VISUAL_SELECTIONS =
  /** @type {Readonly<Record<string, readonly string[]>>} */ (
    Object.freeze({})
  );

/**
 * Fail closed on every unregistered environment-wide visual selection.
 *
 * @param {unknown} value
 * @returns {{
 *   ok:boolean,
 *   selection:Record<string, string>,
 *   rejected:Array<{key:string, reason:string}>,
 * }}
 */
export function validateUserVisualSelection(value) {
  if (value != null && !isPlainContentRecord(value)) {
    return {
      ok: false,
      selection: {},
      rejected: [{ key: '$visualSelection', reason: 'invalid_container' }],
    };
  }

  const selection = /** @type {Record<string, string>} */ ({});
  const rejected = [];
  for (const [key, raw] of Object.entries(value || {})) {
    const allowed = USER_VISUAL_SELECTIONS[key];
    if (!Array.isArray(allowed)) {
      rejected.push({ key, reason: 'unregistered_visual_selection' });
      continue;
    }
    if (
      typeof raw !== 'string'
      || !/^[\x20-\x7e]{1,80}$/.test(raw)
      || !allowed.includes(raw)
    ) {
      rejected.push({ key, reason: 'invalid_value' });
      continue;
    }
    selection[key] = raw;
  }
  return {
    ok: rejected.length === 0,
    selection,
    rejected,
  };
}
