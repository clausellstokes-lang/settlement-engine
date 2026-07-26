/**
 * economy/neighbourEconomicBias.js — applies relationship-derived trade bias
 * to the final export candidates.
 *
 * This is a post-processing policy: chain and service derivation have already
 * produced the export list, and final trade-list normalization runs after it.
 * The function therefore mutates the supplied arrays deliberately and does not
 * consume randomness.
 */

/**
 * Apply the configured relationship mode to a settlement's exports.
 *
 * Modes have intentionally different effects:
 * - suppress: a hostile embargo caps export variety.
 * - complement: a trade partner removes goods that compete with its exports.
 * - compete: rivals keep overlapping exports; institution generation already
 *   expresses the competition.
 * - dependent: a client adds high-priority goods its patron needs.
 */
export const applyNeighbourEconomicBias = ({
  bias,
  mode,
  isSubsistenceIsolated,
  primaryExports,
  nativeTradeCandidates,
}) => {
  if (Object.keys(bias).length === 0 || isSubsistenceIsolated) return;

  if (mode === 'suppress') {
    if (primaryExports.length > 4) primaryExports.splice(4);
    return;
  }

  if (mode === 'complement') {
    const biasKeys = Object.keys(bias);
    for (let exportIndex = primaryExports.length - 1; exportIndex >= 0; exportIndex--) {
      const normalizedGood = primaryExports[exportIndex].toLowerCase();
      for (const biasKey of biasKeys) {
        const competesWithNeighbour =
          bias[biasKey] < 0.8 &&
          normalizedGood.includes(biasKey.toLowerCase());
        if (competesWithNeighbour) {
          primaryExports.splice(exportIndex, 1);
          break;
        }
      }
    }
    return;
  }

  // Rival and cold-war economies intentionally retain overlapping exports.
  if (mode === 'compete') return;
  if (mode !== 'dependent') return;

  for (const [good, weight] of Object.entries(bias)) {
    const alreadyExported = primaryExports.some(exportedGood =>
      exportedGood.toLowerCase().includes(good.toLowerCase())
    );
    if (weight <= 1.3 || alreadyExported || primaryExports.length >= 8) {
      continue;
    }

    const patronGood = good.charAt(0).toUpperCase() + good.slice(1);
    primaryExports.push(patronGood);
    nativeTradeCandidates.exports.push(patronGood);
  }
};
