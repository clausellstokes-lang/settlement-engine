| step | key | provides/mutates | step draws (rows of 525) | key drawn? (rows moved of 525) | reaches the record |
|---|---|---|---:|---|---|
| `resolveConfig` | `tier` | provides | 525/525 | **pure** (0) | record.tier |
| `resolveConfig` | `population` | provides | 525/525 | **drawn** (525) | record.population |
| `resolveConfig` | `tradeRoute` | provides | 525/525 | **drawn** (5) | NOT CARRIED (only a coincidental scalar match) |
| `resolveConfig` | `terrainType` | provides | 525/525 | **drawn** (3) | name at record.config.terrainType but a DIFFERENT value |
| `resolveConfig` | `resolvedTerrain` | provides | 525/525 | **drawn** (3) | NOT CARRIED (only a coincidental scalar match) |
| `resolveConfig` | `culture` | provides | 525/525 | **pure** (0) | name at record.config.culture but a DIFFERENT value |
| `resolveConfig` | `culturalIdentity` | provides | 525/525 | **drawn** (525) | record.culturalIdentity |
| `resolveConfig` | `generationContentProfile` | provides | 525/525 | **pure** (0) | ABSENT |
| `resolveConfig` | `magicLevel` | provides | 525/525 | **pure** (0) | name at record.config.magicLevel but a DIFFERENT value |
| `resolveConfig` | `threat` | provides | 525/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveConfig` | `priorityMagicEffective` | provides | 525/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveConfig` | `noMagic` | provides | 525/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveConfig` | `townPlus` | provides | 525/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveConfig` | `effectiveConfig` | provides | 525/525 | **drawn** (7) | record.config |
| `resolveConfig` | `institutionToggles` | provides | 525/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveConfig` | `categoryToggles` | provides | 525/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveConfig` | `goodsToggles` | provides | 525/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveConfig` | `servicesToggles` | provides | 525/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `buildGenerationContext` | `generationContext` | provides | 0/525 | **pure** (0) | ABSENT |
| `resolveResources` | `nearbyResources` | provides | 525/525 | **drawn** (524) | record.config.nearbyResources |
| `resolveResources` | `nearbyResourcesNative` | provides | 525/525 | **drawn** (524) | record.config.nearbyResources |
| `resolveResources` | `nearbyResourcesDepleted` | provides | 525/525 | **drawn** (356) | name at record.config.nearbyResourcesDepleted but a DIFFERENT value [tier-dependent: village=NAME ELSEWHERE, VALUE DIFFERS; town=NAME ELSEWHERE, VALUE DIFFERS; city=VALUE MATCH (nested/renamed)] |
| `resolveResources` | `nearbyResourcesNativeDepleted` | provides | 525/525 | **drawn** (356) | name at record.config.nearbyResourcesNativeDepleted but a DIFFERENT value [tier-dependent: village=NAME ELSEWHERE, VALUE DIFFERS; town=NAME ELSEWHERE, VALUE DIFFERS; city=VALUE MATCH (nested/renamed)] |
| `resolveResources` | `nearbyResourcesCustom` | provides | 525/525 | **pure** (0) | name at record.config.nearbyResourcesCustom but a DIFFERENT value |
| `resolveResources` | `nearbyResourceDefinitions` | provides | 525/525 | **pure** (0) | name at record.config.nearbyResourceDefinitions but a DIFFERENT value |
| `resolveResources` | `nearbyResourceDefinitionsDepleted` | provides | 525/525 | **pure** (0) | name at record.config.nearbyResourceDefinitionsDepleted but a DIFFERENT value |
| `resolveResources` | `effectiveConfig` | mutates | 525/525 | **drawn** (525) | record.config |
| `resolveStress` | `stress` | provides | 525/525 | **drawn** (519) | record.stress |
| `resolveStress` | `stressTypes` | provides | 525/525 | **drawn** (519) | record.config.stressTypes [tier-dependent: village=VALUE MATCH (nested/renamed); town=VALUE MATCH (nested/renamed); city=NAME ELSEWHERE, VALUE DIFFERS] |
| `resolveStress` | `effectiveConfig` | mutates | 525/525 | **drawn** (519) | record.config |
| `resolveNeighbour` | `neighbourProfile` | provides | 0/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveNeighbour` | `neighbourEconBias` | provides | 0/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveNeighbour` | `neighbourFacBias` | provides | 0/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveNeighbour` | `rawNeighbour` | provides | 0/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) |
| `resolveNeighbour` | `effectiveConfig` | mutates | 0/525 | **pure** (0) | record.config |
| `assembleInstitutions` | `institutions` | provides | 525/525 | **drawn** (525) | record.institutions |
| `assembleInstitutions` | `catalogForTier` | provides | 525/525 | **pure** (0) | ABSENT |
| `assembleInstitutions` | `generationRepairs` | provides | 525/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) [tier-dependent: village=VALUE MATCH (nested/renamed); town=VALUE MATCH (scalar — weak); city=VALUE MATCH (nested/renamed)] |
| `subsumptionPass` | `institutions` | mutates | 0/525 | **pure** (0) | record.institutions |
| `cascadePass` | `institutions` | mutates | 441/525 | **drawn** (441) | record.institutions |
| `isolationPass` | `stress` | provides | 24/525 | **pure** (0) | record.stress |
| `isolationPass` | `isolationSupport` | provides | 24/525 | **pure** (0) | record.isolationSupport |
| `isolationPass` | `institutions` | mutates | 24/525 | **pure** (0) | record.institutions |
| `isolationPass` | `effectiveConfig` | mutates | 24/525 | **pure** (0) | record.config |
| `stressConfirmPass` | `stress` | provides | 0/525 | **pure** (0) | record.stress |
| `stressConfirmPass` | `stressTypes` | provides | 0/525 | **pure** (0) | record.config.stressTypes [tier-dependent: village=VALUE MATCH (nested/renamed); town=VALUE MATCH (nested/renamed); city=NAME ELSEWHERE, VALUE DIFFERS] |
| `stressConfirmPass` | `effectiveConfig` | mutates | 0/525 | **pure** (0) | record.config |
| `generateEconomy` | `economicState` | provides | 525/525 | **drawn** (525) | record.economicState |
| `generateEconomy` | `effectiveConfig` | mutates | 525/525 | **pure** (0) | record.config |
| `generatePower` | `powerIntent` | provides | 0/525 | **drawn** (525) | ABSENT |
| `generatePower` | `powerStructure` | provides | 0/525 | **pure** (0) | record.powerStructure (VALUE DIFFERS from ctx) |
| `neighbourFactions` | `powerStructure` | mutates | 0/525 | **pure** (0) | record.powerStructure (VALUE DIFFERS from ctx) |
| `factionCorrelationPass` | `institutions` | mutates | 1/525 | **pure** (0) | record.institutions |
| `coherenceRepairPass` | `generationRepairs` | provides | 0/525 | **pure** (0) | NOT CARRIED (only a coincidental scalar match) [tier-dependent: village=VALUE MATCH (nested/renamed); town=VALUE MATCH (scalar — weak); city=VALUE MATCH (nested/renamed)] |
| `coherenceRepairPass` | `isolationSupport` | provides | 0/525 | **pure** (0) | record.isolationSupport |
| `coherenceRepairPass` | `effectiveConfig` | mutates | 0/525 | **pure** (0) | record.config |
| `coherenceRepairPass` | `institutions` | mutates | 0/525 | **pure** (0) | record.institutions |
| `economyReconcilePass` | `economicState` | provides | 525/525 | **drawn** (205) | record.economicState |
| `economyReconcilePass` | `spatialLayout` | provides | 525/525 | **pure** (0) | record.spatialLayout |
| `economyReconcilePass` | `availableServices` | provides | 525/525 | **drawn** (525) | record.availableServices |
| `powerEconomyReconcilePass` | `powerStructure` | mutates | 0/525 | **pure** (0) | record.powerStructure (VALUE DIFFERS from ctx) |
| `structuralValidationPass` | `structural` | provides | 0/525 | **pure** (0) | ABSENT |
| `generatePopulation` | `npcs` | provides | 525/525 | **drawn** (525) | record.npcs (VALUE DIFFERS from ctx) |
| `generatePopulation` | `relationships` | provides | 525/525 | **drawn** (525) | record.relationships |
| `generatePopulation` | `factions` | provides | 525/525 | **drawn** (525) | record.factions (VALUE DIFFERS from ctx) |
| `generatePopulation` | `conflicts` | provides | 525/525 | **drawn** (497) | record.conflicts |
| `corruptionPass` | `factions` | mutates | 273/525 | **drawn** (270) | record.factions (VALUE DIFFERS from ctx) |
| `corruptionPass` | `npcs` | mutates | 273/525 | **drawn** (270) | record.npcs (VALUE DIFFERS from ctx) |
| `generateNarratives` | `settlementReason` | provides | 525/525 | **pure** (0) | record.settlementReason |
| `generateNarratives` | `resourceAnalysis` | provides | 525/525 | **pure** (0) | record.resourceAnalysis |
| `generateNarratives` | `economicViability` | provides | 525/525 | **pure** (0) | record.economicViability |
| `generateNarratives` | `history` | provides | 525/525 | **drawn** (525) | record.history (VALUE DIFFERS from ctx) |
| `assembleSettlement` | `settlement` | provides | 525/525 | **drawn** (525) | IS THE RECORD |
| `assembleSettlement` | `powerStructure` | mutates | 525/525 | **pure** (0) | record.powerStructure (VALUE DIFFERS from ctx) |
| `assembleSettlement` | `stress` | mutates | 525/525 | **drawn** (516) | record.stress |
