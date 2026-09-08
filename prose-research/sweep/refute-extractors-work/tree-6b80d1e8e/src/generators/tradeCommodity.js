/**
 * generators/tradeCommodity.js
 *
 * Single source of truth for the first-export → commodity keyword scan.
 * Four sites used to run their own drifted copies (historyGenerator's
 * deriveTradeCommodity, two inline IIFEs in narrativeGenerator, and a raw
 * first-word split in npcGenerator), so a settlement whose first export was
 * "Herbal remedies" or "Rare spices and dyes" got a commodity word in one
 * narrative block and a raw first word (or nothing) in the next — inconsistent
 * prose flavor from the same data.
 *
 * The scan list is the union of the drifted copies, in historyGenerator's
 * original order (so every history output that matched before still maps to
 * the same label) with narrativeGenerator's extra keywords appended. Order is
 * load-bearing: fish before salt keeps "Salted fish" → fish, iron before gems
 * keeps "Fine metalwork and jewelry" → iron.
 *
 * This module must stay dependency-free: historyGenerator imports from
 * narrativeGenerator, so housing the helper in either would cycle.
 */

/** @type {ReadonlyArray<readonly [readonly string[], string]>} */
const COMMODITY_SCAN = [
  [['timber', 'lumber', 'wood'], 'timber'],
  [['grain', 'wheat', 'rye'], 'grain'],
  [['fish', 'seafood'], 'fish'],
  [['wool', 'textile', 'cloth'], 'wool'],
  [['iron', 'metal', 'steel'], 'iron'],
  [['stone', 'marble', 'quarry'], 'stone'],
  [['gem', 'jewel', 'crystal'], 'gems'],
  [['potion', 'alchemical', 'reagent'], 'alchemy'],
  [['craft', 'tool', 'manufactured'], 'crafts'],
  [['livestock', 'cattle', 'sheep'], 'livestock'],
  [['salt'], 'salt'],
  [['spice', 'exotic'], 'spices'],
  [['silk'], 'silk'],
  [['herb'], 'medicinal herbs'],
  [['ale'], 'ale'],
];

/**
 * Map a settlement's primary export to a canonical trade-commodity label
 * (timber / grain / iron / …). The fallback knobs are deliberate per-context
 * defaults, not redundancy:
 *
 * - Default (strict): unmatched exports return `fallback` (null), never a raw
 *   first word. History prose interpolates the result into lines like "The
 *   supply of ${commodity}…", where a first-word guess turns "Financial
 *   services" into "the supply of financial".
 * - `firstWordFallback: true`: unmatched exports fall back to the export's
 *   lowercased first word before `fallback`. The narrative/NPC templates that
 *   consume it each carry their own per-sentence default ("resource", "grain",
 *   "food"), so a plausible word beats null there.
 * - `fallback: 'trade goods'` (genSettSummary): that value feeds replaceTokens,
 *   which leaves the literal "{commodity}" in prose on a falsy substitution,
 *   so the result must never be empty.
 *
 * @param {any} economicState - object with a primaryExports string array
 * @param {{firstWordFallback?: boolean, fallback?: string|null}} [opts]
 * @returns {string|null}
 */
export const deriveTradeCommodity = (economicState, { firstWordFallback = false, fallback = null } = {}) => {
  const first = economicState?.primaryExports?.[0];
  if (!first) return fallback;
  const lower = String(first).toLowerCase();
  for (const [keywords, label] of COMMODITY_SCAN) {
    if (keywords.some(kw => lower.includes(kw))) return label;
  }
  if (firstWordFallback) return lower.split(' ')[0] || fallback;
  return fallback;
};
