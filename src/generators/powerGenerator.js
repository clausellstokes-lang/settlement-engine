/**
 * powerGenerator.js — entry barrel for power-structure generation.
 *
 * The implementation lives under ./power/. This module re-exports the public
 * surface verbatim so existing importers are unaffected:
 *   generatePowerStructure, generateConflicts,
 *   computeRelTension, genSuccessionNarr, genRelNarrative.
 */
export { generatePowerStructure } from './power/rulingStructure.js';
export { generateConflicts } from './power/conflicts.js';
export { computeRelTension, createTieProseDraw } from './power/relationshipArchetypes.js';
export { genSuccessionNarr, genRelNarrative } from './power/settlementNarrative.js';
