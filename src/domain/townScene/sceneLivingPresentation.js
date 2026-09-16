/**
 * Renderer-neutral presentation policy for authorized TownScene living state.
 *
 * The manifest owns meaning; renderers own pixels and polygons. Keeping the
 * bounded tint and marker vocabulary here lets WebGL, Portrait PNG, and GLB use
 * one interpretation without importing Three.js or product theme tokens into
 * the deterministic domain.
 */

import { clamp } from '../../kernel/math.js';

/**
 * The campaign clock currently advances in whole weeks and seasons. Until a
 * canonical day phase exists, every TownScene surface uses this one authored
 * daylight rig instead of deriving an invented hour from a seed or wall clock.
 */
export const TOWN_SCENE_LIGHT_POLICY = 'fixed-authored-daylight';

export const TOWN_SCENE_LIVING_MARKER_KINDS = Object.freeze([
  'condition',
  'hazard',
  'fire',
  'flood',
  'plague',
  'siege',
  'occupation',
  'abandonment',
  'neglect',
  'repair',
  'construction',
  'scar',
  'reconstruction',
]);

/** @param {unknown} value @param {number} [fallback] */
function finite(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Multiplicative building tint derived only from the authorized condition
 * vector. Damage, prosperity, occupation, abandonment, neglect, repair, and
 * construction are deliberately restrained so material identity remains
 * legible. `corruptionCovert` is never read.
 *
 * @param {unknown} profileValue
 * @returns {[number, number, number]}
 */
export function townSceneConditionTint(profileValue = {}) {
  const profile = record(profileValue);
  const prosperity = clamp(finite(profile.prosperity, 0.5), 0, 1);
  const damage = clamp(
    Math.max(
      finite(profile.warScar),
      finite(profile.corruptionRevealed) * 0.75,
    ),
    0,
    1,
  );
  const occupation = clamp(finite(profile.occupation), 0, 1);
  const abandonment = clamp(finite(profile.abandonment), 0, 1);
  const neglect = clamp(finite(profile.neglect), 0, 1);
  const repair = clamp(finite(profile.repair), 0, 1);
  const construction = clamp(finite(profile.construction), 0, 1);

  const brightness = clamp(
    0.86
      + prosperity * 0.14
      + repair * 0.04
      + construction * 0.03
      - abandonment * 0.18
      - neglect * 0.1,
    0.58,
    1,
  );
  return [
    clamp(brightness * (1 - abandonment * 0.08), 0, 1),
    clamp(
      brightness
        * (1 - damage * 0.18)
        * (1 - occupation * 0.1)
        * (1 - neglect * 0.04),
      0,
      1,
    ),
    clamp(
      brightness
        * (1 - damage * 0.3)
        * (1 - occupation * 0.18)
        * (1 - abandonment * 0.08),
      0,
      1,
    ),
  ];
}

/**
 * Choose a non-color marker silhouette from an already-authorized living row.
 * Channel is explicit so a persistent occupation scar never becomes a transient
 * occupation banner merely because its kind contains the same word.
 *
 * @param {unknown} value
 * @param {'condition'|'scar'|'reconstruction'} channel
 * @returns {string}
 */
export function townSceneLivingMarkerKind(value, channel) {
  if (channel === 'scar') return 'scar';
  const row = record(value);
  const text = [
    row.id,
    row.kind,
    row.archetype,
    row.type,
    row.label,
  ].map((part) => String(part || '').toLowerCase()).join(' ');

  if (channel === 'reconstruction') {
    const reconstructionType = String(row.type || '').toLowerCase();
    if (/repair|restor|mend/.test(reconstructionType)) return 'repair';
    if (/construct|build|rebirth/.test(reconstructionType)) return 'construction';
    return 'reconstruction';
  }
  if (/occupation_lifted|siege_lifted|repair|restor|recovery/.test(text)) {
    return 'repair';
  }
  if (/reconstruct|construction|rebuild|rebirth/.test(text)) {
    return 'construction';
  }
  if (/abandon|deserted|evacuat/.test(text)) return 'abandonment';
  if (/neglect|derelict|decay|lean_year|destitut/.test(text)) return 'neglect';
  if (
    /occupation|occupied|occupier/.test(text)
    && !/occupation_burden/.test(text)
  ) {
    return 'occupation';
  }
  // These disaster silhouettes require an explicit authorized description.
  // IDs are deliberately excluded: an opaque engine identifier must never
  // acquire visual meaning that the projected row did not actually disclose.
  const explicitDisaster = [
    row.kind,
    row.archetype,
    row.label,
  ].map((part) => String(part || '').toLowerCase()).join(' ');
  if (/\b(fire|wildfire|conflagration|burning)\b/.test(explicitDisaster)) {
    return 'fire';
  }
  if (/\b(flood|flooding|inundation|deluge)\b/.test(explicitDisaster)) {
    return 'flood';
  }
  if (/\b(plague|pestilence|epidemic)\b/.test(explicitDisaster)) {
    return 'plague';
  }
  if (/\b(siege|besieged|blockade)\b/.test(explicitDisaster)) {
    return 'siege';
  }
  if (String(row.id || '').startsWith('hazard:') || row.archetype === 'hazard') {
    return 'hazard';
  }
  return 'condition';
}

/** @param {string} markerKind */
export function townSceneLivingMaterialId(markerKind) {
  return TOWN_SCENE_LIVING_MARKER_KINDS.includes(markerKind)
    ? `living:${markerKind}`
    : 'living:condition';
}
