/**
 * scripts/audit/soak-review/chains.mjs — THE ENGINE'S OWN CHAINS, each the relationship a rule
 * promises, read as a dependence over the corpus. `expect`: 'strong' (the rule makes one a
 * function of the other: |measure| ≥ 0.5 holds), 'present' (the rule moves one with the other:
 * ≥ 0.2 holds), 'reported' (a distribution the chair reads, no promise). The rule is the file
 * that owns the link, `path :: symbol`; a generator step is cited by its step module.
 */
export const CHAINS = Object.freeze([
  { id: 'C1a', from: 'chain.population', to: 'chain.institutionCount', expect: 'strong', withinTier: true, rule: 'src/generators/steps/assembleInstitutions.js (step; catalogue floors src/data/institutionalCatalog.js)' },
  { id: 'C1b', from: 'chain.institutionCount', to: 'chain.npcCount', expect: 'strong', withinTier: true, rule: 'src/generators/npcGenerator.js :: generateNPCs' },
  { id: 'C1c', from: 'chain.population', to: 'chain.factionCount', expect: 'present', withinTier: true, rule: 'src/generators/power/rulingStructure.js :: generatePowerStructure' },
  { id: 'C2a', from: 'chain.terrain', to: 'chain.nativeResources', expect: 'present', rule: 'src/generators/steps/resolveResources.js (step)' },
  { id: 'C2b', from: 'chain.terrain', to: 'chain.grownPct', expect: 'present', rule: 'src/generators/foodGenerator.js :: generateFoodSecurity' },
  { id: 'C2c', from: 'chain.nativeResources', to: 'chain.prosperity', expect: 'present', rule: 'src/generators/economy/economicState.js :: generateEconomicState' },
  { id: 'C2d', from: 'chain.prosperity', to: 'chain.foodBand', expect: 'present', rule: 'src/generators/economy/foodBalance.js :: deriveFoodRecord' },
  { id: 'C2e', from: 'chain.grownPct', to: 'chain.foodBand', expect: 'strong', rule: 'src/generators/economy/foodBalance.js :: deriveFoodRecord' },
  { id: 'C3a', from: 'chain.route', to: 'chain.imports', expect: 'present', rule: 'src/generators/economy/economicState.js :: generateEconomicState' },
  { id: 'C3b', from: 'chain.route', to: 'chain.normalImportPct', expect: 'present', rule: 'src/data/foodImportRates.js (import rates by route)' },
  { id: 'C3c', from: 'chain.normalImportPct', to: 'chain.storageMonths', expect: 'present', rule: 'src/generators/foodGenerator.js :: generateFoodSecurity' },
  { id: 'C3d', from: 'chain.route', to: 'chain.storageMonths', expect: 'reported', rule: 'src/generators/foodGenerator.js :: generateFoodSecurity' },
  { id: 'C4a', from: 'chain.stressCell', to: 'chain.stressPrimary', expect: 'strong', rule: 'src/generators/steps/resolveStress.js (step) over src/generators/stressGenerator.js :: generateStress' },
  { id: 'C4b', from: 'chain.stressPrimary', to: 'chain.foodBand', expect: 'present', rule: 'src/generators/economy/foodBalance.js :: deriveFoodRecord (famine, siege)' },
  { id: 'C4c', from: 'chain.stressPrimary', to: 'chain.renderedHooks', expect: 'present', rule: 'src/domain/dossier/plotHooks.js :: collectPlotHooks' },
  { id: 'C4d', from: 'chain.stressPrimary', to: 'chain.tonightNamesCrisis', expect: 'reported', rule: 'src/domain/summary/tonightSheet.js :: composeTonightSheet' },
  { id: 'C4e', from: 'chain.stressPrimary', to: 'chain.stability', expect: 'present', rule: 'src/generators/power/rulingStructure.js :: generatePowerStructure' },
  { id: 'C5a', from: 'chain.culture', to: 'chain.faithChurchEvidence', expect: 'reported', rule: 'src/domain/dossier/faithReading.js :: faithReadingOf' },
  { id: 'C5b', from: 'chain.priorityReligion', to: 'chain.religiousFaction', expect: 'present', rule: 'src/generators/power/rulingStructure.js :: generatePowerStructure' },
  { id: 'C5c', from: 'chain.culture', to: 'chain.government', expect: 'present', rule: 'src/generators/power/rulingStructure.js :: generatePowerStructure' },
  { id: 'C6a', from: 'chain.priorityMilitary', to: 'chain.hasGarrison', expect: 'present', rule: 'src/generators/defenseGenerator.js :: generateDefenseProfile' },
  { id: 'C6b', from: 'chain.tier', to: 'chain.hasWalls', expect: 'present', rule: 'src/domain/defense/defenseFacts.js :: defenseFactsOf' },
  { id: 'C6c', from: 'chain.hasGarrison', to: 'chain.defenseScoreMean', expect: 'present', rule: 'src/generators/defenseGenerator.js :: generateDefenseProfile' },
  { id: 'C6d', from: 'chain.storageMonths', to: 'chain.enduranceFullMonths', expect: 'strong', rule: 'src/domain/defense/defenseFacts.js :: foodEnduranceOf (SIEGE_PRODUCTION_KEPT)' },
  { id: 'C6e', from: 'chain.tier', to: 'chain.enduranceHalfForever', expect: 'reported', rule: 'src/domain/defense/defenseFacts.js :: foodEnduranceOf (SIEGE_PRODUCTION_KEPT)' },
  { id: 'C6f', from: 'chain.hasGranary', to: 'chain.storageMonths', expect: 'present', rule: 'src/generators/economy/foodBalance.js :: deriveFoodRecord' },
  { id: 'C7a', from: 'chain.magicScenario', to: 'chain.magicReliance', expect: 'strong', rule: 'src/domain/magicReliance.js :: deriveMagicReliance' },
  { id: 'C7b', from: 'chain.magicPractitioners', to: 'chain.magicReliance', expect: 'strong', rule: 'src/domain/magicReliance.js :: deriveMagicReliance' },
  { id: 'C8a', from: 'chain.tier', to: 'chain.population', expect: 'strong', rule: 'src/data/constants.js :: POPULATION_RANGES' },
  { id: 'C8b', from: 'chain.tier', to: 'chain.inBand', expect: 'reported', rule: 'docs/UX_CONSOLIDATION_2026-10-30.md X-46 (car 1 parked)' },
  { id: 'C8c', from: 'chain.tier', to: 'chain.tierNounFindings', expect: 'reported', rule: 'src/domain/coherence/tierNounFindings.js :: tierNounFindings' },
  { id: 'C9a', from: 'chain.contentProfile', to: 'chain.findingCount', expect: 'reported', rule: 'src/domain/generationContentProfile.js' },
  { id: 'C9b', from: 'chain.monsterThreat', to: 'chain.hasWalls', expect: 'present', rule: 'src/generators/defenseGenerator.js :: generateDefenseProfile' },
]);
