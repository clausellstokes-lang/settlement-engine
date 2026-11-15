| # | step (in run order; A0–A14 are the assembly's own sub-steps, in `assembleSettlement.js` order) | WRITES facts (family: towns where it changes there) | WRITES prose (final strings born there: count; top record paths) | READS (fact families) |
|---|---|---|---|---|
| 1 | resolveConfig | — | 5837; `culturalIdentity.scope` 720; `culturalIdentity.builtForm` 720; `culturalIdentity.civicPattern` 720; `culturalIdentity.exchangePattern` 720 | — |
| 2 | buildGenerationContext | — | 0 | — |
| 3 | resolveResources | — | 0 | — |
| 4 | resolveStress | stress 491 | 969; `stress.viabilityNote` 437; `stress.crisisHook` 431; `stress.label` 71; `stress[].crisisHook` 14 | — |
| 5 | resolveNeighbour | — | 0 | — |
| 6 | assembleInstitutions | houses 720 | 26190; `institutions[].desc` 24372; `institutions[].name` 1818 | — |
| 7 | subsumptionPass | houses 189 | 0 | houses |
| 8 | cascadePass | houses 443 | 1368; `institutions[].desc` 1343; `institutions[].name` 25 | houses |
| 9 | isolationPass | houses 32, stress 14 | 30; `institutions[].desc` 12; `stress[].viabilityNote` 10; `stress.viabilityNote` 4; `isolationSupport.paths[].evidence[]` 4 | stress |
| 10 | stressConfirmPass | stress 17 | 0 | houses, stress |
| 11 | generateEconomy | chains 720, trade 720, income 720, food 720, safety 720 | 29868; `economicState.incomeSources[].desc` 4487; `economicState.tradeDependencies[].detail` 4443; `economicState.primaryImports[]` 1890; `economicState.compound.inst.names[]` 1843 | houses |
| 12 | generatePower | powers 720, powerText 720 | 4506; `powerStructure.factions[].desc` 1732; `powerStructure.factionRelationships[].narrative` 1167; `powerStructure.recentConflict` 720; `powerStructure.stability` 503 | chains, food, houses, income, safety, stress, trade |
| 13 | neighbourFactions | — | 0 | — |
| 14 | factionCorrelationPass | houses 84 | 84; `institutions[].desc` 83; `institutions[].name` 1 | houses, powerText, powers |
| 15 | coherenceRepairPass | houses 108 | 87; `institutions[].desc` 87 | houses |
| 16 | economyReconcilePass | trade 448, chains 79, food 78, safety 31, income 26 | 45364; `availableServices.equipment[].desc` 10254; `availableServices.legal[].desc` 7381; `availableServices.healing[].desc` 4052; `availableServices.food[].desc` 3362 | chains, food, income, safety, trade |
| 17 | powerEconomyReconcilePass | powers 8, powerText 6 | 15; `powerStructure.factionRelationships[].narrative` 7; `powerStructure.factions[].desc` 7; `powerStructure.factions[].crisisNote` 1 | chains, food, income, powerText, powers, safety, trade |
| 18 | structuralValidationPass | — | 0 | houses |
| 19 | generatePopulation | people 720, ties 720 | 138234; `npcs[].plotHooks[]` 20650; `npcs[].presentation.impression` 19404; `npcs[].presentation.behaviour` 19384; `npcs[].secret.stakes` 17259 | chains, food, houses, income, powerText, powers, safety, trade |
| 20 | generateNarratives | history 720 | 34739; `history.historicalEvents[].description` 3738; `history.currentTensions[].plotHooks[]` 3344; `history.historicalEvents[].lastingEffects[]` 3052; `resourceAnalysis.gaps[].impact` 2222 | chains, food, houses, income, powerText, powers, safety, trade |
| 21 | A0-literal | — | 1227; `culturalNotes` 720; `structuralSuggestions[].reason` 240; `structuralViolations[].reason` 112; `structuralViolations[].suggestedFixes[]` 87 | the settlement as it stands (all but conditions) |
| 22 | A1-stress-summary | — | 553; `stress.summary` 466; `stress.crisisHook` 35; `stress[].summary` 24; `stress.viabilityNote` 18 | the settlement as it stands (all but conditions) |
| 23 | A2-arrival | — | 720; `arrivalScene` 720 | the settlement as it stands (all but conditions) |
| 24 | A3-defence | defence 720 | 204; `economicState.safetyProfile.guardEffectivenessDesc` 204 | the settlement as it stands (all but conditions) |
| 25 | A4-reconcile | powers 58, powerText 39 | 67; `powerStructure.factions[].desc` 32; `powerStructure.factionRelationships[].narrative` 22; `powerStructure.stability` 6; `powerStructure.factions[].crisisNote` 5 | the settlement as it stands (all but conditions) |
| 26 | A5-resize | powers 660, powerText 660 | 16; `powerStructure.factions[].faction` 16 | the settlement as it stands (all but conditions) |
| 27 | A6-crime-lines | — | 115; `economicState.safetyProfile.crimeTypes[].desc` 115 | the settlement as it stands (all but conditions) |
| 28 | A7-coherence | people 720, ties 610 | 97846; `npcs[].goal.short` 20950; `npcs[].goal.long` 20939; `relationships[].description` 20846; `relationships[].tension` 20846 | the settlement as it stands (all but conditions) |
| 29 | A8-conserve-settle | powers 639, powerText 378, history 99 | 827; `powerStructure.factions[].desc` 782; `powerStructure.factionRelationships[].narrative` 45 | the settlement as it stands (all but conditions) |
| 30 | A9-structural-npcs | — | 0 | the settlement as it stands (all but conditions) |
| 31 | A10-pressure | — | 531; `pressureSentence` 531 | the settlement as it stands (all but conditions) |
| 32 | A11-conflicts | — | 1700; `powerStructure.conflicts[].plotHooks[]` 576; `powerStructure.conflicts[].desc` 565; `powerStructure.conflicts[].issue` 550; `powerStructure.conflicts[].stakes` 9 | the settlement as it stands (all but conditions) |
| 33 | A12-true-hooks | — | 31; `economicViability.summary` 29; `npcs[].plotHooks[]` 2 | the settlement as it stands (all but conditions) |
| 34 | A13-labels-close | powers 9, powerText 9, people 9 | 23; `powerStructure.factionRelationships[].narrative` 9; `npcs[].goal.short` 6; `npcs[].goal.long` 4; `powerStructure.conflicts[].desc` 1 | the settlement as it stands (all but conditions) |
| 35 | A14-receipt | — | 0 | the settlement as it stands (all but conditions) |
| 36 | assembleSettlement | conditions 720 | 1013; `activeConditions[].description` 490; `activeConditions[].causes[].detail` 490; `activeConditions[].label` 33 | powers, powerText, houses, chains, trade, income, food, safety, defence, people, ties, history, stress |
| 37 | resolveCrisisCast | people 57 | 1879; `stress.cast.stakes[].reason` 990; `stress.cast.roles[].reason` 618; `stress.cast.absent[].reason` 190; `stress[].cast.roles[].reason` 38 | powers, powerText, houses, chains, trade, income, food, safety, defence, people, ties, history, stress, conditions |
