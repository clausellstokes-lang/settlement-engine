/**
 * Step 13: generatePopulation
 *
 * Generates NPCs, relationships, NPC faction groups, and links them
 * to power factions. Also generates conflicts.
 *
 * Extracted from generateSettlement.js lines 891–993.
 */

import { registerStep } from '../pipeline.js';
import { generateNPCs, generateRelationships } from '../npcGenerator.js';
import { generateFactions, generateConflicts } from '../powerGenerator.js';

const FACTION_ATTRACTION = {
  government: ['government', 'other'],
  military:   ['military', 'government', 'other'],
  economy:    ['economy', 'crafts', 'government', 'other'],
  religious:  ['religious', 'magic', 'other'],
  criminal:   ['criminal', 'other'],
  magic:      ['magic', 'religious', 'other'],
  crafts:     ['crafts', 'economy', 'other'],
  noble:      ['government', 'military', 'other'],
};

registerStep('generatePopulation', {
  deps: ['factionCorrelationPass', 'generatePower'],
  provides: ['npcs', 'relationships', 'factions', 'conflicts'],
  phase: 'population',
}, (ctx, rng) => {
  const { tier, institutions, culture, effectiveConfig, powerStructure } = ctx;

  const npcs = generateNPCs({ tier, institutions }, culture, effectiveConfig);
  const relationships = generateRelationships(npcs, effectiveConfig, institutions);
  const factions = generateFactions(npcs, relationships);

  // Link NPC faction groups → power factions
  const pfList = powerStructure?.factions || [];
  const topPowerFaction = [...pfList].sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  const governingPF = pfList.find(f => f.isGoverning) || topPowerFaction;

  const powerFactionsByCategory = pfList.reduce((acc, pf) => {
    const cat = pf.category || 'other';
    if (!acc[cat] || pf.power > acc[cat].power) acc[cat] = pf;
    return acc;
  }, {});

  const pfAttractionMap = pfList.map(pf => {
    const profile = FACTION_ATTRACTION[pf.category || 'government'] || ['other'];
    return { pf, profile };
  });

  const totalPower = pfList.reduce((s, f) => s + (f.power || 0), 0) || 1;
  const pfLoadCount = new Map(pfList.map(f => [f.faction, 0]));

  factions.forEach(fg => {
    const cat = fg.dominantCategory || 'other';

    // 1. Direct category match
    const direct = powerFactionsByCategory[cat];
    if (direct) {
      fg.powerFactionName  = direct.faction;
      fg.powerFactionPower = direct.power;
      fg.powerFactionCat   = direct.category;
      pfLoadCount.set(direct.faction, (pfLoadCount.get(direct.faction) || 0) + 1);
      return;
    }

    // 2. Attraction profile match
    let bestMatch = null, bestPriority = 999;
    for (const { pf, profile } of pfAttractionMap) {
      const priority = profile.indexOf(cat);
      if (priority !== -1 && priority < bestPriority) {
        bestPriority = priority;
        bestMatch = pf;
      }
    }
    if (bestMatch && bestPriority < 2) {
      fg.powerFactionName  = bestMatch.faction;
      fg.powerFactionPower = bestMatch.power;
      fg.powerFactionCat   = bestMatch.category;
      pfLoadCount.set(bestMatch.faction, (pfLoadCount.get(bestMatch.faction) || 0) + 1);
      return;
    }

    // 3. Power-weighted scatter
    const roll = rng.random() * totalPower;
    let cumulative = 0;
    let scattered = governingPF;
    for (const pf of pfList) {
      cumulative += pf.power || 0;
      if (roll <= cumulative) { scattered = pf; break; }
    }
    fg.powerFactionName     = scattered.faction;
    fg.powerFactionPower    = scattered.power;
    fg.powerFactionCat      = scattered.category;
    fg.powerFactionFallback = true;
    pfLoadCount.set(scattered.faction, (pfLoadCount.get(scattered.faction) || 0) + 1);
  });

  const conflicts = generateConflicts(factions, relationships, effectiveConfig, institutions);

  return { npcs, relationships, factions, conflicts };
});
