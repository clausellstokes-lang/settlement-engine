/**
 * stressPriority.js — the canonical stress-severity ordering, in one place.
 *
 * A settlement narrates around its PRIMARY stress: the highest-severity active one.
 * This list + selector were copy-pasted byte-identically into five history/narrative
 * sites; a stress type added to one copy and missed in another would silently change
 * which crisis a settlement reads as dominant, undetectably at runtime. Single source
 * so adding a stress type is one edit.
 */
export const STRESS_PRIORITY = Object.freeze([
  'under_siege',
  'occupied',
  'famine',
  'plague_onset',
  'politically_fractured',
  'recently_betrayed',
  'succession_void',
  'indebted',
  'infiltrated',
  'monster_pressure',
  'insurgency',
  'mass_migration',
  'wartime',
  'religious_conversion',
  'slave_revolt',
]);

/**
 * The highest-severity active stress (the settlement's primary crisis), falling back
 * to the first listed stress if none match the priority order, or null when empty.
 * @param {string[]} stresses
 * @returns {string|null}
 */
export function resolvePrimaryStress(stresses) {
  if (!stresses?.length) return null;
  return STRESS_PRIORITY.find((s) => stresses.includes(s)) || stresses[0];
}
