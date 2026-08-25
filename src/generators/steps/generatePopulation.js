/**
 * Step 13: generatePopulation
 *
 * Generates NPCs, relationships, NPC faction groups, and links them
 * to power factions. Also generates conflicts.
 *
 * Population step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { generateNPCs, generateRelationships } from '../npcGenerator.js';
import { generateFactions, generateConflicts } from '../powerGenerator.js';
import { recordTrace } from '../../domain/trace.js';

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
  reads: ['culture', 'economicState', 'effectiveConfig', 'institutions', 'powerStructure', 'tier'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: ['npcs', 'relationships', 'factions', 'conflicts'],
  phase: 'population',
}, (ctx, rng) => {
  const { tier, institutions, culture, effectiveConfig, powerStructure, economicState } = ctx;

  // generateNPCs reads settlement.powerStructure (noble roles) and
  // settlement.economicState (goal commodity/faction tokens). This step depends on
  // generatePower, so both are present on ctx — pass them through or those branches
  // silently fall back.
  const npcs = generateNPCs({ tier, institutions, powerStructure, economicState }, culture, effectiveConfig);
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

  // Summary traces — one per category, not one per entity. Per-entity
  // traces would flood the rail (50+ NPCs is normal at metropolis tier)
  // and the AI grounding pass does not need that level of detail.
  recordTrace(ctx, {
    targetType: 'npc',
    targetId: `npcs.summary`,
    step: 'generatePopulation',
    result: 'populated',
    causes: [{
      source: `tier.${tier}`,
      effect: `${npcs.length} npcs`,
      reason: `Population scaled from tier; institutions seeded named roles.`,
    }],
    downstreamEffects: [
      { target: 'relationships', effect: `${relationships.length} edges` },
      { target: 'factions',      effect: `${factions.length} npc faction groups` },
    ],
  });

  // Faction-linkage trace — the strategic decision is how NPC faction
  // groups attached to power factions (direct/attraction/scatter).
  const linkCounts = factions.reduce((acc, fg) => {
    const mode = fg.powerFactionFallback ? 'scatter'
               : powerFactionsByCategory[fg.dominantCategory || 'other'] ? 'direct'
               : 'attraction';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});
  if (factions.length) {
    recordTrace(ctx, {
      targetType: 'faction',
      targetId: 'factions.npcGroupLinkage',
      step: 'generatePopulation',
      result: 'linked',
      causes: [{
        source: 'powerStructure.factions',
        effect: `${factions.length} groups linked`,
        reason: `Direct=${linkCounts.direct || 0}, attraction=${linkCounts.attraction || 0}, power-weighted scatter=${linkCounts.scatter || 0}.`,
      }],
      downstreamEffects: [
        { target: 'conflicts', effect: `${conflicts.length} surfaced` },
      ],
    });
  }

  return { npcs, relationships, factions, conflicts };
});
