/**
 * Resolve a culture-specific NPC title against the run's world law.
 *
 * Culture profiles may map a neutral catalog key to a setting-bearing title:
 * Celtic `priest`, for example, materializes as "Druid". The underlying role
 * remains valid in a world without functional magic, so use that role as the
 * draw-free neutral fallback instead of deleting the NPC.
 *
 * @param {{
 *   role:string,
 *   culturalTitle:string,
 *   category:string,
 *   worldLaw:{allowsRole:(candidate:Record<string, unknown>)=>boolean},
 * }} input
 * @returns {string}
 */
export function resolveGeneratedNpcTitle({
  role,
  culturalTitle,
  category,
  worldLaw,
}) {
  return worldLaw.allowsRole({
    role,
    title: culturalTitle,
    category,
    source: 'generated',
  })
    ? culturalTitle
    : role;
}
