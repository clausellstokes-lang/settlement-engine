/**
 * steps/index.js — Registers all pipeline steps in dependency order.
 *
 * Import this file once at app startup to populate the pipeline registry.
 * Each step module calls registerStep() as a side effect on import.
 */

import './resolveConfig.js';
import './resolveResources.js';
import './resolveStress.js';
import './resolveNeighbour.js';
import './assembleInstitutions.js';
import './subsumptionPass.js';
import './cascadePass.js';
import './isolationPass.js';
import './stressConfirmPass.js';
import './generateEconomy.js';
import './generatePower.js';
import './neighbourFactions.js';
import './factionCorrelationPass.js';
import './economyReconcilePass.js';
import './structuralValidationPass.js';
import './generatePopulation.js';
import './corruptionPass.js';
import './generateNarratives.js';
import './assembleSettlement.js';
