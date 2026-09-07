/**
 * power/factionGrouping.js — group NPCs into factions by connected components
 * of positive relationships, naming each by its dominant member category.
 */
import { FACTION_DESCRIPTORS } from '../../data/powerData.js';
import { pick } from '../helpers.js';

// pickDominantCategory (local) — pick the most common member category among `members`
const pickDominantCategory = (members) => {
  var topEntry;
  const categoryCounts = {};
  members.forEach((member) => {
    categoryCounts[member.category] = (categoryCounts[member.category] || 0) + 1;
  });
  return (
    ((topEntry = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]) == null ? void 0 : topEntry[0]) ||
    'other'
  );
};

// generateFactions — group NPCs into factions by connected components of
// positive relationships (ally / political / patron_client / respect).
export const generateFactions = (npcs, relationships) => {
  if (!(npcs != null && npcs.length)) return [];
  // Undirected adjacency: npc id → set of positively-connected npc ids
  const adjacency = new Map(npcs.map((npc) => [npc.id, new Set()]));
  relationships.forEach((rel) => {
    var set1, set2;
    if (['ally', 'political', 'patron_client', 'respect'].includes(rel.type)) {
      (set1 = adjacency.get(rel.npc1Id)) == null || set1.add(rel.npc2Id);
      (set2 = adjacency.get(rel.npc2Id)) == null || set2.add(rel.npc1Id);
    }
  });
  const visited = new Set(),
    factions = [];
  npcs.forEach((npc) => {
    var neighbors;
    if (visited.has(npc.id)) return;
    const members = [],
      queue = [npc.id];
    while (queue.length) {
      const currentId = queue.shift();
      if (visited.has(currentId)) continue;
      visited.add(currentId);
      const memberNpc = npcs.find((n) => n.id === currentId);
      if (memberNpc) members.push(memberNpc);
      (neighbors = adjacency.get(currentId)) == null ||
        neighbors.forEach((neighborId) => {
          if (!visited.has(neighborId)) queue.push(neighborId);
        });
    }
    if (members.length >= 1) {
      const dominantCategory = pickDominantCategory(members),
        descriptors = FACTION_DESCRIPTORS[dominantCategory] || FACTION_DESCRIPTORS.other;
      (() => {
        const usedNames = new Set(factions.map((f) => f.name));
        let chosenName = pick(descriptors);
        // Retry up to 5 times to avoid duplicate faction names
        for (let attempt = 0; attempt < 5 && usedNames.has(chosenName); attempt++) {
          chosenName = pick(descriptors);
        }
        // If still duplicate after retries, append a distinguishing suffix
        if (usedNames.has(chosenName)) {
          const suffixes = ['Inner Circle', 'Bloc', 'Alliance', 'Faction', 'Assembly'];
          chosenName = chosenName + ' ' + pick(suffixes);
        }
        factions.push({ name: chosenName, members, dominantCategory });
      })();
    }
  });
  return factions.sort((a, b) => b.members.length - a.members.length);
};
