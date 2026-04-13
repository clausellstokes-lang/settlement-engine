/**
 * generateSettlementPipeline.js — Pipeline-based settlement generation.
 *
 * Drop-in replacement for generateSettlement() that uses the pipeline runner.
 * Same signature, same output, but internally runs through registered steps
 * with seeded PRNG for deterministic generation.
 *
 * Strangler Fig: This coexists with the old generateSettlement.js.
 * Once validated, the old file can be deleted and this becomes the sole entry point.
 */

import { createPRNG, generateSeed } from './prng.js';
import { runPipeline } from './pipeline.js';
import { generateNPCs, generateRelationships } from './npcGenerator.js';
import { generateFactions, generateConflicts } from './powerGenerator.js';
import { generateHistory } from './historyGenerator.js';

// Side-effect: registers all pipeline steps
import './steps/index.js';

/**
 * Generate a complete settlement using the pipeline.
 *
 * @param {Object}  config          — Generation configuration (same as old generateSettlement)
 * @param {Object}  [importedNeighbour] — Previously generated settlement to link as neighbour
 * @param {Object}  [options]
 * @param {string}  [options.seed]  — Seed for deterministic generation. Auto-generated if omitted.
 * @param {Function} [options.onStep] — Callback after each step: (name, ctx, patch) => void
 * @returns {Object} Complete settlement data object (same shape as old generateSettlement)
 */
export function generateSettlementPipeline(config = {}, importedNeighbour = null, options = {}) {
  const seed = options.seed || config._seed || generateSeed();
  const rng = createPRNG(seed);

  const initialContext = {
    config,
    importedNeighbour,
    _seed: seed,
  };

  const finalCtx = runPipeline(initialContext, rng, {
    onStep: options.onStep,
  });

  // Attach seed to settlement for replay
  if (finalCtx.settlement) {
    finalCtx.settlement._seed = seed;
  }

  return finalCtx.settlement;
}

/**
 * Re-generate NPCs for an existing settlement.
 * Uses the pipeline's generatePopulation step in isolation.
 */
export function regenNPCsPipeline(settlement, config) {
  const npcs = generateNPCs({ tier: settlement.tier, institutions: settlement.institutions || [] }, config.culture || 'germanic', config);
  const relationships = generateRelationships(npcs, config, settlement.institutions || []);
  const factions = generateFactions(npcs, relationships);

  // Re-link to existing power factions
  const existingPF = settlement.powerStructure?.factions || [];
  const pfByCategory = existingPF.reduce((acc, pf) => {
    const cat = pf.category || 'other';
    if (!acc[cat] || pf.power > acc[cat].power) acc[cat] = pf;
    return acc;
  }, {});
  factions.forEach(fg => {
    const cat = fg.dominantCategory || 'other';
    const matched = pfByCategory[cat];
    if (matched) {
      fg.powerFactionName = matched.faction;
      fg.powerFactionPower = matched.power;
      fg.powerFactionCat = matched.category;
    }
  });

  const conflicts = generateConflicts(factions, relationships, config, settlement.institutions || []);
  return { npcs, relationships, factions, conflicts };
}

/**
 * Re-generate history for an existing settlement.
 */
export function regenHistoryPipeline(settlement, config) {
  return generateHistory(
    settlement.tier, config, settlement.institutions || [],
    settlement.economicViability, settlement.economicState, settlement.powerStructure
  );
}
