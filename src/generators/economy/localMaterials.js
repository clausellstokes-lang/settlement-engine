/**
 * economy/localMaterials.js — THE TOWN'S OWN MATERIALS (COHERENCE-AGREE, 2026-11-11). A leaf: the
 * resource analysis (resourceGenerator.js), the viability hooks (foodBalance.js) and the coherence
 * receipt's agreement arm (generationCoherence.js) read one table, so the must-import list, the
 * hooks and the receipt give one answer to "does this town have it".
 */

/**
 * A must-import requirement word, and the resources that yield the material outright. Most words
 * join by token ("grain", "salt", "stone"); these do not: "metals" is not "iron", peat and coal
 * are fuel, and a managed forest is timber. Gold and silver join "metals" by the token already.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const MATERIAL_RESOURCE_KEYS = Object.freeze({
  metals: Object.freeze(['iron_deposits', 'iron']),
  iron: Object.freeze(['iron_deposits', 'iron']),
  fuel: Object.freeze(['coal_deposits', 'coal', 'marshlands', 'peat']),
  timber: Object.freeze(['timber', 'managed_forest', 'mountain_timber', 'shipbuilding_timber']),
});

/** The requirement words a live resource answers outright. @param {unknown} requirement @param {ReadonlyArray<string>} available */
export const liveMaterialFor = (requirement, available) => {
  const words = String(requirement || '').toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-z]+/);
  for (const word of words) {
    const hit = (MATERIAL_RESOURCE_KEYS[word] || []).find((key) => available.includes(key));
    if (hit) return hit;
  }
  return null;
};
