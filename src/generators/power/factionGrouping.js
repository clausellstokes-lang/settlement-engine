/**
 * power/factionGrouping.js — the named roster grouped by POWER faction.
 *
 * ⭐ ONE FACTION SET (GS-2, chair ruling on G-SEAMS S2, ODQ §934.101). The power factions ARE
 * the factions. This list used to be the connected components of positive ties, each wearing a
 * name drawn from FACTION_DESCRIPTORS ("The Merchant Bloc") and then BOUND to a power faction by
 * category, attraction or a power-weighted scatter. Measured over gen1000v2: 0 of 2,386 group
 * names were power names, 47.9% of groups were one person, and the binding agreed with the
 * members' own affiliation 32.4% of the time. It was a by-product of tie connectivity wearing
 * invented names, and it printed a second politics beside the one the simulation runs.
 *
 * Now each entry is a PROJECTION of one power faction: its name is the power faction's own
 * name (the id every faction link, rename and mention keys on), its members are the NPCs whose
 * `factionAffiliation` names it, and its category is the power faction's. A power faction no
 * named NPC belongs to has no entry. Pure and draw-free: no name is minted, so nothing here
 * can spend a draw or collide.
 *
 * The shape `{ name, members, dominantCategory }` is the one every reader of this list already
 * takes (the simulation's member bookkeeping, the rename cascades, the gallery veil, the
 * neighbour engagement pairing), so those readers keep working unchanged.
 */

/**
 * @param {Array<{ id?: unknown, factionAffiliation?: string }>|null|undefined} npcs
 * @param {Array<{ faction?: string, name?: string, category?: string }>|null|undefined} powerFactions
 * @returns {Array<{ name: string, members: Array<object>, dominantCategory: string }>}
 */
export const generateFactions = (npcs, powerFactions) => {
  if (!(npcs != null && npcs.length)) return [];
  const roster = Array.isArray(powerFactions) ? powerFactions : [];
  const groups = [];
  const seen = new Set();
  for (const pf of roster) {
    const name = pf?.faction || pf?.name;
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const members = npcs.filter((npc) => npc?.factionAffiliation === name);
    if (!members.length) continue;
    groups.push({ name, members, dominantCategory: pf.category || 'other' });
  }
  return groups;
};
