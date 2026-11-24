/**
 * tests/helpers/fortuneLegacyConfig.js — THE ABSENT ARM OF A FORTUNE-LAW DARK CONTROL, MADE DIAL-FREE
 * (FORTUNE U5a-CURE-2 unit 2; the chair's ruling of 2026-11-20 22:18 UTC on COMMON-RULES 14(c)).
 *
 * A dark-control differential asks "does a LEGACY world, one that carries no fortune-law marker, read
 * law 1?". Its absent arm was born through a bare `birthConfig(...)`, which MINTS the dial: dark, the
 * mint is `{}` and the arm is legacy by accident; lit, the arm would carry the new law and the control
 * would compare law 2 against law 1. This helper gives the arm what it means, whatever the dial says:
 * the config `birthConfig` gives, with the fortune law's key deleted. Every other law `birthConfig`
 * mints (density, living content) is kept, so the arm differs from its forced twins in that key alone.
 *
 * The forced arms (`_fortuneLawVersion: 1` and `2`, set AFTER `birthConfig`) do not use it, and the
 * dial's own pins (`tests/domain/fortuneLawWiring.test.js`) read the dial and do not either.
 *
 * Pure: a fresh object per call (`birthConfig` returns one), the caller's config untouched.
 */
import { birthConfig } from '../../src/domain/density/densityCreateBoundary.js';
import { FORTUNE_LAW_CONFIG_KEY } from '../../src/domain/fortune/fortuneLaw.js';

/**
 * A LEGACY config: `birthConfig(config)` with `FORTUNE_LAW_CONFIG_KEY` deleted, so the world born
 * from it carries no fortune-law marker and reads law 1 at any setting of the dial.
 *
 * @template {Record<string, unknown>} C
 * @param {C} config the config a birth would generate from
 * @returns {C}
 */
export function legacyConfig(config) {
  const born = /** @type {Record<string, unknown>} */ (birthConfig(config));
  delete born[FORTUNE_LAW_CONFIG_KEY];
  return /** @type {C} */ (born);
}
