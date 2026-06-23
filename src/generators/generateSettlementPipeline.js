/**
 * generateSettlementPipeline.js — Pipeline-based settlement generation.
 *
 * Uses the pipeline runner. Same signature and output as the retired monolithic
 * generateSettlement(), but internally runs through registered steps with a
 * seeded PRNG for deterministic generation.
 *
 * Migration is COMPLETE: this is the sole settlement generation entry point.
 */

import { createPRNG, generateSeed } from './prng.js';
import { setActiveRng, clearActiveRng } from './rngContext.js';
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
 *   receives the final accumulated context. The store captures this as `lastCtx`
 *   (used for diagnostics / the pipeline rail). Existing callers that ignore this
 *   option get back exactly the settlement they always did.
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
 *
 * Runs under a seeded PRNG: the underlying generators draw from the active RNG
 * and SILENTLY fall back to Math.random() when none is set — so a bare regen was
 * non-deterministic and unreproducible. `options.seed` lets a caller reproduce a
 * prior reroll; omitting it mints a fresh seed (a real reroll). The seed used is
 * returned on `_regenSeed` so the caller can persist it for replay.
 *
 * @param {Object} settlement
 * @param {Object} config
 * @param {{ seed?: string }} [options]
 */
export function regenNPCsPipeline(settlement, config, options = {}) {
  const seed = options.seed || generateSeed();
  setActiveRng(createPRNG(seed));
  try {
    const npcs = generateNPCs({
      tier: settlement.tier,
      institutions: settlement.institutions || [],
      powerStructure: settlement.powerStructure,
      economicState: settlement.economicState,
    }, config.culture || 'germanic', config);
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
    return { npcs, relationships, factions, conflicts, _regenSeed: seed };
  } finally {
    clearActiveRng();
  }
}

/**
 * Re-generate history for an existing settlement. Seeded like regenNPCsPipeline.
 *
 * @param {Object} settlement
 * @param {Object} config
 * @param {{ seed?: string }} [options]
 */
export function regenHistoryPipeline(settlement, config, options = {}) {
  const seed = options.seed || generateSeed();
  setActiveRng(createPRNG(seed));
  try {
    return generateHistory(
      settlement.tier, config, settlement.institutions || [],
      settlement.economicViability, settlement.economicState, settlement.powerStructure
    );
  } finally {
    clearActiveRng();
  }
}
