/**
 * domain/facts/otherNpc.js — THE OTHER-NPC HOME (CENSUS-1 wave 0, fact 14; the design's §1 row
 * "other named NPC": a new atom from the sample — a line naming "{npc}" presumes a second person,
 * and the rung-2 certification failures were the `someone` fallback printing where none stood).
 *
 *   otherNpcOf(record, npc)  the first NPC of the roster that is not `npc` (an index into
 *                            `record.npcs`, or the NPC object itself), named or not — the stress
 *                            secret's own selection, kept exactly
 *   hasOtherNpc(record, npc) whether that NPC has a name a line can print
 *
 * Pure: no randomness, no clock.
 */

/**
 * @param {{ npcs?: unknown } | null | undefined} record
 * @param {number | object | null | undefined} npc the speaking NPC (its index, or itself)
 * @returns {{ name?: unknown } | null} the roster's row for that NPC
 */
export function otherNpcOf(record, npc) {
  const npcs = Array.isArray(record?.npcs) ? record.npcs : [];
  const others = typeof npc === 'number' ? npcs.filter((_, idx) => idx !== npc) : npcs.filter((n) => n !== npc);
  return others[0] ?? null;
}

/**
 * THE ONE READER of the atom.
 * @param {{ npcs?: unknown } | null | undefined} record
 * @param {number | object | null | undefined} npc
 * @returns {boolean}
 */
export function hasOtherNpc(record, npc) {
  const other = otherNpcOf(record, npc);
  return typeof other?.name === 'string' && other.name.trim() !== '';
}
