/**
 * Step 15: assembleSettlement
 *
 * Assembles the final settlement object from all accumulated context,
 * runs narrative overlays, defense profile, legitimacy patching,
 * and coherence generation.
 *
 * Extracted from generateSettlement.js lines 1003–1071.
 */

import { registerStep } from '../pipeline.js';
import { generateSettlementName } from '../npcGenerator.js';
import { generatePressureSentence, generateArrivalScene, generateCoherence } from '../narrativeGenerator.js';
import { generateDefenseProfile } from '../defenseGenerator.js';

const DEFENSE_CONTRIB = {
  'Undefended': -10, 'Vulnerable': -5, 'Defensible': 0,
  'Well-Defended': 7, 'Fortress': 10,
};

registerStep('assembleSettlement', {
  deps: ['generateNarratives', 'generatePopulation'],
  provides: ['settlement'],
  phase: 'assembly',
}, (ctx) => {
  const {
    tier, population, institutions, effectiveConfig,
    neighbourProfile, rawNeighbour,
    economicState, spatialLayout, availableServices, powerStructure,
    settlementReason, npcs, relationships, factions, conflicts,
    resourceAnalysis, economicViability, history, stress, structural,
    culture,
  } = ctx;
  const config = ctx.config || {};

  const settlement = {
    name: (effectiveConfig.customName?.trim()) || generateSettlementName(culture),
    tier,
    population,
    institutions,
    structuralViolations: structural?.violations || [],
    structuralSuggestions: structural?.suggestions || [],
    neighborRelationship: neighbourProfile || (rawNeighbour ? {
      name: rawNeighbour.name,
      tier: rawNeighbour.tier,
      relationshipType: config._neighbourRelType || 'neutral',
      npcs:    rawNeighbour.npcs    || [],
      factions: rawNeighbour.factions || [],
    } : null),
    economicState,
    spatialLayout,
    availableServices,
    powerStructure,
    settlementReason,
    npcs,
    relationships,
    factions,
    conflicts,
    resourceAnalysis,
    economicViability,
    history,
    stress,
    config: { ...effectiveConfig },
  };

  // Narrative overlays
  settlement.pressureSentence = generatePressureSentence(settlement);
  settlement.arrivalScene     = generateArrivalScene(settlement);
  settlement.defenseProfile   = generateDefenseProfile(settlement);

  // Patch publicLegitimacy with real defense readiness
  if (settlement.powerStructure?.publicLegitimacy && settlement.defenseProfile?.readiness?.label) {
    const realDefLabel = settlement.defenseProfile.readiness.label;
    const provLeg      = settlement.powerStructure.publicLegitimacy;
    const realDefContrib = DEFENSE_CONTRIB[realDefLabel] ?? 0;
    const delta = realDefContrib - (provLeg.breakdown?.defense ?? 0);

    if (delta !== 0) {
      const newScore = Math.max(0, Math.min(100, provLeg.score + delta));
      provLeg.score = newScore;
      provLeg.breakdown.defense = realDefContrib;

      if      (newScore >= 75) { provLeg.label = 'Endorsed';          provLeg.color = '#1a5a28'; provLeg.govMultiplier = 1.30; provLeg.crimMultiplier = 0.75; }
      else if (newScore >= 60) { provLeg.label = 'Approved';          provLeg.color = '#4a7a2a'; provLeg.govMultiplier = 1.15; provLeg.crimMultiplier = 0.90; }
      else if (newScore >= 45) { provLeg.label = 'Tolerated';         provLeg.color = '#a0762a'; provLeg.govMultiplier = 1.00; provLeg.crimMultiplier = 1.00; }
      else if (newScore >= 30) { provLeg.label = 'Contested';         provLeg.color = '#8a4010'; provLeg.govMultiplier = 0.80; provLeg.crimMultiplier = 1.15; }
      else                     { provLeg.label = 'Legitimacy Crisis'; provLeg.color = '#8b1a1a'; provLeg.govMultiplier = 0.60; provLeg.crimMultiplier = 1.30; }
      provLeg.isEndorsed          = newScore >= 75;
      provLeg.isApproved          = newScore >= 60;
      provLeg.isTolerated         = newScore >= 45 && newScore < 60;
      provLeg.isContested         = newScore >= 30 && newScore < 45;
      provLeg.isLegitimacyCrisis  = newScore < 30;
      provLeg.governanceFractured = newScore < 30;
    }
  }

  const coherenceUpdates = generateCoherence(settlement);
  Object.assign(settlement, coherenceUpdates);

  return { settlement };
});
