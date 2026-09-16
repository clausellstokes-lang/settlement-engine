/**
 * npcDisplayNames.js
 *
 * Draw-free display-identity reconciliation for generated NPC rosters.
 */

const ROMAN_ORDINALS = [
  'I', 'II', 'III', 'IV', 'V',
  'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV',
  'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
];

/**
 * Make duplicate NPC display names unambiguous without drawing another random
 * name or removing either character.
 *
 * Exact name collisions are rare but consequential: relationship prose and
 * entity pickers otherwise present two different IDs as the same person. A
 * role qualifier is both human-readable and stable. When colliding characters
 * also share a role (for example, two rival Council Members), Roman ordinals
 * keep every display name distinct.
 */
export const disambiguateNPCDisplayNames = npcs => {
  const normalizedName = npc => String(npc?.name || '').trim().toLowerCase();
  const normalizedRole = npc => String(npc?.role || 'local figure').trim().toLowerCase();
  const nameCounts = new Map();
  const roleCountsByName = new Map();

  for (const npc of npcs || []) {
    const nameKey = normalizedName(npc);
    const roleKey = normalizedRole(npc);
    nameCounts.set(nameKey, (nameCounts.get(nameKey) || 0) + 1);
    if (!roleCountsByName.has(nameKey)) roleCountsByName.set(nameKey, new Map());
    const roleCounts = roleCountsByName.get(nameKey);
    roleCounts.set(roleKey, (roleCounts.get(roleKey) || 0) + 1);
  }

  const roleOccurrences = new Map();
  return (npcs || []).map(npc => {
    const nameKey = normalizedName(npc);
    if ((nameCounts.get(nameKey) || 0) < 2) return npc;

    const role = String(npc.role || 'Local Figure').trim() || 'Local Figure';
    const roleKey = normalizedRole(npc);
    const occurrenceKey = `${nameKey}::${roleKey}`;
    const occurrence = (roleOccurrences.get(occurrenceKey) || 0) + 1;
    roleOccurrences.set(occurrenceKey, occurrence);

    const repeatedRole = (roleCountsByName.get(nameKey)?.get(roleKey) || 0) > 1;
    const ordinal = ROMAN_ORDINALS[occurrence - 1] || String(occurrence);
    const qualifier = repeatedRole ? `${role} ${ordinal}` : role;
    return { ...npc, name: `${String(npc.name).trim()} (${qualifier})` };
  });
};
