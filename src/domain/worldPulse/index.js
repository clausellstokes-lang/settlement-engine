/**
 * domain/worldPulse — the engine's AGGREGATE public API (code-quality-6).
 *
 * This barrel re-exports the whole pulse engine. The review flagged it as a
 * "22-module export* barrel with exactly one consumer" — but that counted only
 * src/: its real consumers are the ~70-file domain/property/simulation TEST
 * battery, which drives the engine through this one entrypoint
 * (simulateCampaignWorldPulse, previewCampaignWorldPulse, advanceCampaignWorld,
 * applyWorldPulseOutcomes, …). Deleting it would churn ~70 test files for no
 * runtime benefit (tests are not bundled), so it stays as the test/engine API.
 *
 * FIRST PAINT: PRODUCTION code must NOT statically import this barrel — doing so
 * drags the entire pulse engine into the importer's chunk (the Wave-2 eager-drag
 * class). The two former production consumers (LivingWorldGates, useRealmInspector)
 * were repointed at the simulationRules.js LEAF for exactly this reason; keep new
 * production imports on the specific leaf.
 */
export * from './worldState.js';
export * from './worldSnapshot.js';
export * from './stressors.js';
export * from './pressureModel.js';
export * from './relationshipEvolution.js';
export * from './relationshipMemory.js';
export * from './relationshipHierarchy.js';
export * from './npcAgency.js';
export * from './factionCompetition.js';
export * from './candidateEvents.js';
export * from './applyWorldPulse.js';
export * from './decisionTier.js';
export * from './advanceCampaignWorld.js';
export * from './partyImpact.js';
export * from './realmEvents.js';
export * from './chronicle.js';
export * from './reconcile.js';
export * from './flows.js';
export * from './simulationRules.js';
export * from './populationDynamics.js';
export * from './tierResourceDynamics.js';
export * from './resourceTaxonomy.js';
