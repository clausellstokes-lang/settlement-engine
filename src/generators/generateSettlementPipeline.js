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
import { withCustomContent } from '../lib/dependencyEngine.js';

// Side-effect: registers all pipeline steps
import './steps/index.js';

/**
 * Generate a complete settlement using the pipeline.
 *
 * @param {Object}  config          — Generation configuration (same as old generateSettlement)
 * @param {Object}  [importedNeighbour] - Previously generated settlement to link as neighbour
 * @param {Object}  [options]
 * @param {string}  [options.seed]  - Seed for deterministic generation. Auto-generated if omitted.
 * @param {Function} [options.onStep] - Callback after each step: (name, ctx, patch) => void
 * @param {Function} [options.onComplete] - Callback after the full pipeline finishes,
 *   receives the final accumulated context. The reactive-update engine uses this
 *   to capture `lastCtx` so future `applyEvent` calls can re-run only affected
 *   steps via `rerunAffected` instead of paying for a full re-generation. Existing
 *   callers that ignore this option get back exactly the settlement they always did.
 * @param {Object}  [options.customContent] - Custom-content snapshot to expose to the
 *   generator's dependencyEngine. If omitted, falls back to whatever the global
 *   source returns (the live store, when running in the app). Pass an explicit
 *   blob (or `{}`) to make this generation fully deterministic and headless —
 *   independent of any app state.
 * @returns {Object} Complete settlement data object (same shape as old generateSettlement)
 */
export function generateSettlementPipeline(config = {}, importedNeighbour = null, options = {}) {
  const seed = options.seed || config._seed || generateSeed();
  const rng = createPRNG(seed);

  const initialContext = {
    config,
    importedNeighbour,
    _seed: seed,
    // Deterministic trace timestamps: every recordTrace() call reads
    // and increments this monotonic counter instead of calling
    // Date.now(). Snapshots of `simulationTrace[].ts` stay stable
    // across runs of the same seed.
    _traceClock: 0,
  };

  const run = () => runPipeline(initialContext, rng, { onStep: options.onStep });

  const finalCtx = options.customContent !== undefined
    ? withCustomContent(options.customContent, run)
    : run();

  // Attach seed to settlement for replay
  if (finalCtx.settlement) {
    finalCtx.settlement._seed = seed;
  }

  if (typeof options.onComplete === 'function') {
    try { options.onComplete(finalCtx); } catch (e) { console.warn('[pipeline] onComplete threw:', e); }
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
