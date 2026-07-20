/**
 * domain/worldPulse/temperamentPresets.js — R-6 TEMPERAMENT PRESETS.
 *
 * Curated, house-voiced BUNDLES over the EXISTING preset machinery
 * (SIMULATION_RULE_PRESETS) — "a quiet march", "an age of storms" — so a DM sets
 * the world's temper by CHOICE, not by raw dials. Preset-as-product.
 *
 * CONSTITUTION (pinned in temperamentPresets.test.js):
 *   • NO NEW PHYSICS / NO NEW TUNING CONSTANTS — a temperament is a base preset
 *     (a real SIMULATION_RULE_PRESETS entry) plus overrides drawn ONLY from
 *     EXISTING rule keys (DEFAULT_SIMULATION_RULES); it introduces no new dial.
 *   • DETERMINISTIC — applyTemperament(id) is a pure function of the id; the same
 *     temperament always yields the identical normalized ruleset.
 *   • This module NEVER mutates SIMULATION_RULE_PRESETS — it composes them — so the
 *     preset-stability / key-order-inference guarantees are untouched.
 *
 * Lazy: imported only by the lazy TemperamentPicker, so it stays off first paint.
 */
import {
  SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_RULES, normalizeSimulationRules,
} from './simulationRules.js';

const _defaultKeys = new Set(Object.keys(DEFAULT_SIMULATION_RULES));

/**
 * The curated temperaments. `basePreset` is a real SIMULATION_RULE_PRESETS id;
 * `overrides` toggles ONLY existing rule keys to existing-value-space values
 * (booleans / enum members already used by a preset). `description` is the
 * house-voice card copy.
 * @type {ReadonlyArray<{ id: string, label: string, basePreset: string, overrides: Record<string, unknown>, description: string }>}
 */
export const TEMPERAMENTS = Object.freeze([
  {
    id: 'quiet_march', label: 'A quiet march', basePreset: 'narrative_campaign', overrides: {},
    description: 'A gentle age. The world keeps its own counsel and turns slowly; change waits to be asked for, and the great powers hold their peace.',
  },
  {
    id: 'steady_realm', label: 'A steady realm', basePreset: 'realistic_regional', overrides: {},
    description: 'The measured middle. Settlements rise and fall at a believable pace, trade and rumor cross the region, and no single hand tips the scales.',
  },
  {
    id: 'the_long_winter', label: 'The long winter', basePreset: 'realistic_regional', overrides: { seasonsEnabled: true },
    description: 'A steady realm that must reckon with the year. The seasons turn, the granary is watched, and a hard winter is a hardship the world remembers.',
  },
  {
    id: 'age_of_storms', label: 'An age of storms', basePreset: 'dramatic_campaign', overrides: {},
    description: 'A time of upheaval. Wars are waged, faiths spread and contend, calamity walks the land, and the wide world moves without waiting for your word.',
  },
  {
    id: 'the_great_game', label: 'The great game', basePreset: 'full_simulation', overrides: {},
    description: 'Every gear turning at once — the ceiling of the simulation. Sieges, levies, spreading creeds, shifting seasons, and a world that carries its own story forward.',
  },
]);

/** Look up a temperament by id, or null. @param {string} id */
export function temperamentById(id) {
  return TEMPERAMENTS.find((t) => t.id === id) || null;
}

/**
 * Resolve a temperament to a fully-normalized simulation-rules object. Pure +
 * deterministic: composes the base preset's rules with the existing-key overrides
 * and runs them through the canonical normalizer (which fail-closes any bad value).
 * Returns null for an unknown id.
 * @param {string} id
 * @returns {Record<string, unknown> | null}
 */
export function applyTemperament(id) {
  const t = temperamentById(id);
  if (!t) return null;
  const preset = /** @type {Record<string, { rules?: Record<string, unknown> }>} */ (SIMULATION_RULE_PRESETS)[t.basePreset];
  const base = preset ? preset.rules : DEFAULT_SIMULATION_RULES;
  return normalizeSimulationRules({ ...base, ...t.overrides });
}

/**
 * The no-new-tuning-constants guard (used by the pin): every temperament's
 * override keys are EXISTING rule keys — a temperament can only bundle dials that
 * already exist, never invent one.
 * @returns {boolean}
 */
export function overridesAreExistingKeysOnly() {
  return TEMPERAMENTS.every((t) => Object.keys(t.overrides).every((k) => _defaultKeys.has(k)));
}
