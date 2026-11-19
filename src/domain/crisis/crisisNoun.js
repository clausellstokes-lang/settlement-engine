/**
 * domain/crisis/crisisNoun.js — THE CRISIS NOUN, a dependency-free leaf (COHERENCE-UPKEEP-7). The table is the one
 * `crisisHooks.js` always held, moved here byte for byte and re-exported there, so a display leaf can name a crisis
 * without importing the hooks module and its graph (`tests/architecture/layerBoundaries.test.js`, the
 * deityConstants.js pattern): `prosperityInCrisis.js`, read by `threatAssessment.js`, had closed a cycle through
 * crisisHooks -> crisisCast -> factsOf -> defenseDisplay -> threatAssessment.
 *
 * Pure: no imports.
 */

/** The noun each kind is spoken of by ("In the siege, …"). PROPOSAL N1 (the lane's report). */
export const CRISIS_NOUN = Object.freeze(/** @type {Record<string, string>} */ ({
  under_siege: 'siege',
  famine: 'famine',
  occupied: 'occupation',
  politically_fractured: 'split between the powers',
  indebted: 'debt crisis',
  recently_betrayed: 'betrayal',
  infiltrated: 'infiltration',
  plague_onset: 'outbreak',
  succession_void: 'succession crisis',
  monster_pressure: 'raids',
  insurgency: 'insurgency',
  religious_conversion: 'conversion',
  slave_revolt: 'revolt',
  wartime: 'war',
  mass_migration: 'migration',
}));
