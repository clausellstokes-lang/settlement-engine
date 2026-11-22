/**
 * userContentTunables.js — the deliberately small second rung of the custom
 * content ontology.
 *
 * These are setting defaults over public generation inputs the engine already
 * validates. They are not the internal auto-tuning registry, not pulse physics,
 * and not permission to write arbitrary config. A content environment may pin
 * them; the generator still resolves its ordinary invariants afterward.
 */

import {
  inferLegacyUserContentTunableIntent,
  normalizeUserContentTunableIntent,
  userContentTunableIntentForPatch,
} from './userContentTunableIntent.js';
import {
  USER_CONTENT_TUNABLES,
  validateUserContentTunables,
} from './userContentTunableAdmission.js';

// Compatibility exports for lazy/domain callers. Config and persistence import
// the zero-dependency intent leaf directly, so they do not pull generator
// application policy into their eager hydration path.
export {
  inferLegacyUserContentTunableIntent,
  normalizeUserContentTunableIntent,
  USER_CONTENT_TUNABLES,
  userContentTunableIntentForPatch,
  validateUserContentTunables,
};

/**
 * @typedef {{
 *   contentTunables?:unknown,
 *   explicitConfigFields?:unknown,
 * }} UserContentTunableOptions
 */

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
function plainRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * @param {unknown} config
 * @param {unknown} value
 * @returns {Record<string, true>}
 */
function normalizedExplicitIntent(config, value) {
  // Direct/headless callers predate the intent option. Preserve the conservative
  // API contract for them: a registered key they supplied in `config` is an
  // explicit choice. The store always passes a record, including `{}`.
  if (value === undefined) {
    return /** @type {Record<string, true>} */ (Object.fromEntries(
      Object.keys(plainRecord(config))
        .filter(key => Object.hasOwn(USER_CONTENT_TUNABLES, key))
        .map(key => [key, true]),
    ));
  }
  return normalizeUserContentTunableIntent(value);
}

/**
 * Apply validated environment defaults beneath an explicit generation config.
 * The caller's choices always win; packs never silently override a decision the
 * user made for this settlement. Any invalid member rejects the whole tunable
 * bag: applying the valid subset would make a malformed environment mean
 * something different from the reviewed version.
 * @param {unknown} config
 * @param {unknown} rawTunables
 * @param {unknown} [explicitIntent]
 */
export function applyUserContentTunables(config, rawTunables, explicitIntent) {
  const validation = validateUserContentTunables(rawTunables);
  const explicit = plainRecord(config);
  if (!validation.ok) {
    return {
      ok: false,
      config: { ...explicit },
      applied: [],
      rejected: validation.rejected,
    };
  }
  const chosen = normalizedExplicitIntent(explicit, explicitIntent);
  /** @type {string[]} */
  const applied = [];
  /** @type {Record<string, unknown>} */
  const resolved = { ...explicit };
  for (const [key, value] of Object.entries(validation.tunables)) {
    if (chosen[key]) continue;
    resolved[key] = value;
    applied.push(key);
  }
  return {
    ok: true,
    config: resolved,
    applied,
    rejected: [],
  };
}

/**
 * Canonical generator adapter. The absent option is an identity operation,
 * protecting the vanilla path from even an unnecessary config clone.
 * @param {unknown} config
 * @param {UserContentTunableOptions} [options]
 */
export function resolveConfigWithUserContentTunables(config, options = {}) {
  if (options.contentTunables === undefined) return config;
  const applied = applyUserContentTunables(
    config,
    options.contentTunables,
    options.explicitConfigFields,
  );
  if (applied.ok) return applied.config;
  const reasons = applied.rejected
    .map(entry => `${entry.key}:${entry.reason}`)
    .join(', ');
  throw new TypeError(
    `Content environment tunables were rejected (${reasons}).`,
  );
}
