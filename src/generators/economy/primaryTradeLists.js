/**
 * economy/primaryTradeLists.js — the pre-chain trade lists: the necessity imports a stress adds, the stress-shaped
 * primary exports and imports, and the caller's goods toggles applied to them.
 *
 * Extracted VERBATIM from economy/economicState.js :: generateEconomicState (LANDING-3, the economicStructure
 * cohesion ceiling's own cure: one cohesive piece moved out, no behaviour change; the generator golden master is
 * byte-identical over its 525 rows). The arrays are returned, not frozen: the Stage-5 military/slave-trade writers
 * and the Stage-7 chain override in generateEconomicState go on mutating them in place, as before.
 *
 * ⚠ It mutates `tradeStreams.localProduction` in place for a forced or disallowed toggle, exactly as the inline
 * block did; the caller's later reads of that array depend on it.
 */

/**
 * @param {object} args
 * @param {string[]} args.stressTypes the config's stress types.
 * @param {{ necessityImports?: string[], exports: string[], imports: string[], transit?: string[],
 *   localProduction?: string[] }} args.tradeStreams the trade income streams (mutated: localProduction).
 * @param {string} args.tradeRoute the resolved trade route.
 * @param {() => boolean} args.supportsMaritime the world law's maritime question, asked only under siege (as before).
 * @param {Record<string, {force?: boolean, allow?: boolean}>} [args.goodsToggles]
 * @returns {{ necessityImports: string[], primaryExports: string[], primaryImports: string[] }}
 */
export function buildPrimaryTradeLists({ stressTypes, tradeStreams, tradeRoute, supportsMaritime, goodsToggles }) {
  let necessityImports = [...(tradeStreams.necessityImports || [])];
  if (stressTypes.includes('under_siege') || stressTypes.includes('famine')) {
    if (!necessityImports.includes('Grain')) necessityImports.push('Grain');
    if (!necessityImports.includes('Salt')) necessityImports.push('Salt');
  }
  if (stressTypes.includes('under_siege') && !necessityImports.includes('Iron')) {
    necessityImports.push('Iron (weapons)');
  }
  if (stressTypes.includes('plague_onset') && !necessityImports.includes('Medicinal herbs')) {
    necessityImports.push('Medicinal herbs');
  }
  const primaryExports = stressTypes.includes('under_siege')
      ? supportsMaritime()
        ? tradeStreams.exports.slice(0, 3).map((exp) => `${exp} (naval route only)`)
        : []
      : stressTypes.includes('occupied')
        ? tradeStreams.exports.slice(0, 5).map((exp) => `${exp} (taxed by occupation)`)
        : [
            ...(['crossroads', 'port', 'river'].includes(tradeRoute)
              ? (tradeStreams.transit || []).map((item) => `${item} (transit)`)
              : []),
          ],
    topImports = tradeStreams.imports.slice(0, 8),
    primaryImports = [
      ...necessityImports
        .map((imp) => imp)
        .filter((imp) => !topImports.some((existing) => existing.toLowerCase().includes(imp.toLowerCase()))),
      ...topImports,
    ].slice(0, 10);
  if (goodsToggles && Object.keys(goodsToggles).length > 0) {
    const goodTogglePattern = /_good_(.+)$/;
    Object.entries(goodsToggles).forEach(function (entry) {
      const key = entry[0],
        toggle = entry[1],
        match = key.match(goodTogglePattern);
      if (!match) return;
      const goodName = match[1];
      if (toggle.force) {
        if (!primaryExports.some((item) => item.toLowerCase().includes(goodName.toLowerCase()))) {
          primaryExports.push(goodName);
        }
        if (
          tradeStreams.localProduction &&
          !tradeStreams.localProduction.some((item) => item.toLowerCase().includes(goodName.toLowerCase()))
        ) {
          tradeStreams.localProduction.push(goodName);
        }
      } else if (toggle.allow === false) {
        for (let i = primaryExports.length - 1; i >= 0; i--) {
          if (primaryExports[i].toLowerCase().includes(goodName.toLowerCase())) primaryExports.splice(i, 1);
        }
        if (tradeStreams.localProduction) {
          for (let i = tradeStreams.localProduction.length - 1; i >= 0; i--) {
            if (tradeStreams.localProduction[i].toLowerCase().includes(goodName.toLowerCase())) {
              tradeStreams.localProduction.splice(i, 1);
            }
          }
        }
      }
    });
  }
  return { necessityImports, primaryExports, primaryImports };
}
