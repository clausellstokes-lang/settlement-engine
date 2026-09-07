/**
 * powerGenerator.js — entry barrel for power-structure generation.
 *
 * The implementation lives under ./power/. This module re-exports the public
 * surface verbatim so existing importers are unaffected:
 *   generatePowerStructure, generateFactions, generateConflicts,
 *   computeRelTension, genSuccessionNarr, genRelNarrative.
 */
export { generatePowerStructure } from './power/rulingStructure.js';
export { generateFactions } from './power/factionGrouping.js';
export { generateConflicts } from './power/conflicts.js';
export { computeRelTension } from './power/relationshipArchetypes.js';
export { genSuccessionNarr, genRelNarrative } from './power/settlementNarrative.js';
