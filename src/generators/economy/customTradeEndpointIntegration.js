/**
 * Custom trade-endpoint integration for the legacy flat economy lists.
 *
 * `economicState.js` owns the broad economic algorithm. This module owns the
 * narrower source-accounting boundary: capture native membership before custom
 * finished goods enter, normalize both sources through the same catalog rules,
 * and emit sparse sidecars only when custom endpoints are active.
 */

import {
  reconcileTradeLists,
  subsumeTradeGoods,
} from '../../domain/region/goodsCatalog.js';
import { computeFinishedGoodsDemand } from './finishedGoodsDemand.js';

/**
 * @param {{
 *   tier:string,
 *   tradeRoute:string,
 *   institutions:unknown[],
 *   nearbyResources:string[],
 *   chainExports:string[],
 *   chainImports:string[],
 * }} input
 */
export function applyFinishedGoodsDemandWithOwnership(input) {
  const nativeTradeCandidates = {
    exports: [...input.chainExports],
    imports: [...input.chainImports],
  };
  const customDemandProjection = computeFinishedGoodsDemand(
    input.tier,
    input.tradeRoute,
    input.institutions,
    input.nearbyResources,
    input.chainExports,
    input.chainImports,
  );
  nativeTradeCandidates.exports.push(
    ...customDemandProjection.nativeExportsAdded,
  );
  nativeTradeCandidates.imports.push(
    ...customDemandProjection.nativeImportsAdded,
  );
  return { nativeTradeCandidates, customDemandProjection };
}

/**
 * Restore the military/slave-trade entries produced before chain derivation.
 * The chain-first rewrite cannot model these streams, so it must re-seat them
 * without duplicating equivalent native output.
 *
 * @param {{
 *   primaryExports:string[],
 *   primaryImports:string[],
 *   stageFiveExports:string[],
 *   stageFiveImports:string[],
 *   nativeTradeCandidates:{exports:string[],imports:string[]},
 * }} input
 */
export function restoreStageFiveTrade(input) {
  for (const value of input.stageFiveExports) {
    const normalized = value.toLowerCase();
    const military = normalized.includes('military')
      || normalized.includes('mercenary');
    const covered = input.primaryExports.some(candidate => {
      const candidateKey = candidate.toLowerCase();
      return military
        ? candidateKey.includes('military')
          || candidateKey.includes('mercenary')
        : candidateKey.includes('slave');
    });
    if (!covered) input.primaryExports.push(value);
    input.nativeTradeCandidates.exports.push(value);
  }
  for (const value of input.stageFiveImports) {
    const covered = input.primaryImports.some(
      candidate => candidate.toLowerCase().includes('slave'),
    );
    if (!covered) input.primaryImports.push(value);
    input.nativeTradeCandidates.imports.push(value);
  }
}

/**
 * Apply the isolated-subsistence boundary and replace heuristic local
 * production with chain-derived production.
 *
 * @param {{
 *   tier:string,
 *   tradeRoute:string,
 *   primaryExports:string[],
 *   primaryImports:string[],
 *   activeChains:Array<Record<string,any>>,
 *   localProduction:string[]|null|undefined,
 *   chainLocalProduction:string[],
 *   hasMagicTrade?:boolean,
 * }} input
 */
export function applySubsistenceTradeBoundary(input) {
  const disconnected = (
    input.hasMagicTrade !== true
    && (
      input.tradeRoute === 'none'
      || (
        ['thorp', 'hamlet'].includes(input.tier)
        && input.tradeRoute === 'isolated'
      )
    )
  );
  if (disconnected) {
    input.primaryExports.length = 0;
    input.primaryImports.length = 0;
    for (const chain of input.activeChains) {
      if (chain.entrepot || chain.needKey === 'trade_entrepot') {
        chain.status = 'unexploited';
      }
    }
  }
  if (Array.isArray(input.localProduction)) {
    input.localProduction.splice(
      0,
      input.localProduction.length,
      ...input.chainLocalProduction,
    );
  }
  return disconnected;
}

/**
 * Apply the canonical catalog normalization to final mutable trade lists.
 *
 * @param {string[]} primaryExports
 * @param {string[]} primaryImports
 * @param {string[]|null|undefined} localProduction
 */
export function normalizeFinalTradeLists(
  primaryExports,
  primaryImports,
  localProduction,
) {
  const normalizedImports = subsumeTradeGoods(primaryImports);
  primaryImports.splice(0, primaryImports.length, ...normalizedImports);
  const normalizedExports = reconcileTradeLists(
    subsumeTradeGoods(primaryExports),
    primaryImports,
  );
  primaryExports.splice(0, primaryExports.length, ...normalizedExports);
  if (Array.isArray(localProduction)) {
    const normalizedLocal = subsumeTradeGoods(localProduction);
    localProduction.splice(0, localProduction.length, ...normalizedLocal);
  }
}

/**
 * Project native and custom source ownership onto the surviving final lists.
 *
 * @param {{
 *   primaryExports:string[],
 *   primaryImports:string[],
 *   nativeTradeCandidates:{exports:string[],imports:string[]},
 *   customTradeEndpoints:Array<Record<string,unknown>>,
 * }} input
 */
export function deriveEarlyTradeOwnership(input) {
  if (!input.customTradeEndpoints.length) return null;

  const normalizedNativeImports = subsumeTradeGoods(
    input.nativeTradeCandidates.imports,
  );
  const normalizedNativeExports = reconcileTradeLists(
    subsumeTradeGoods(input.nativeTradeCandidates.exports),
    normalizedNativeImports,
  );
  const nativeImportKeys = new Set(
    normalizedNativeImports.map(value => value.toLowerCase()),
  );
  const nativeExportKeys = new Set(
    normalizedNativeExports.map(value => value.toLowerCase()),
  );
  const nativeTradeLabels = {
    exports: input.primaryExports.filter(
      value => nativeExportKeys.has(value.toLowerCase()),
    ),
    imports: input.primaryImports.filter(
      value => nativeImportKeys.has(value.toLowerCase()),
    ),
  };
  const nativeEndpointKeys = new Set(
    nativeTradeLabels.exports.map(value => value.toLowerCase()),
  );
  const customOnlyLabels = input.customTradeEndpoints
    .map(endpoint => String(endpoint.label || ''))
    .filter((label, index, labels) => (
      label
      && !nativeEndpointKeys.has(label.toLowerCase())
      && labels.findIndex(
        candidate => candidate.toLowerCase() === label.toLowerCase(),
      ) === index
    ));

  return {
    nativeTradeLabels,
    customTradeEndpoints: {
      exports: input.customTradeEndpoints,
      imports: [],
    },
    customTradeLabels: {
      exports: customOnlyLabels,
      imports: [],
    },
  };
}
